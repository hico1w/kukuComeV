// kukuCome キャラ画像アップロード Worker (GitHub Storage)
// Cloudflare Dashboard > Workers & Pages > Create > Worker に貼り付けて Deploy
// Settings > Variables and Secrets:
//   GITHUB_TOKEN  (Secret) : GitHub Fine-grained PAT (Contents: Read+Write)
//   GITHUB_OWNER  (Variable): hico1w
//   GITHUB_REPO   (Variable): kukucome-chara-uploads
//   ADMIN_SECRET  (Secret) : 管理ページのパスワード (wrangler secret put ADMIN_SECRET)

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const ua = request.headers.get('user-agent') || '';

    // ── POST /upload ──────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname === '/upload') {
      try {
        // ブロックリスト確認
        const blocked = await getBlocklist(env);
        if (blocked.includes(ip)) {
          return json({ error: 'この端末からはアップロードできません' }, 403, cors);
        }

        const form = await request.formData();
        const file = form.get('file');
        if (!file) return json({ error: 'ファイルがありません' }, 400, cors);

        const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.type)) {
          return json({ error: '対応形式: PNG / JPG / WebP / GIF のみ' }, 400, cors);
        }
        if (file.size > 2 * 1024 * 1024) {
          return json({ error: 'ファイルは2MB以下にしてください' }, 400, cors);
        }

        const ext = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
        const key = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

        // base64 encode (chunked)
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        const base64 = btoa(binary);

        // GitHub へ画像コミット
        const ghRes = await ghPut(env, key, base64, `upload: ${key}`);
        if (!ghRes.ok) {
          const errText = await ghRes.text().catch(() => '');
          throw new Error(`GitHub ${ghRes.status}: ${errText.slice(0, 200)}`);
        }

        // ぷるぷる設定サイドカー保存 (_puru/{key}.json)
        const puruConfigStr = form.get('puruConfig');
        if (puruConfigStr) {
          try { JSON.parse(puruConfigStr); } catch { /* 不正JSON は無視 */ }
          await ghPut(env, `_puru/${key}.json`, encodeContent(puruConfigStr), `puru: ${key}`)
            .catch(() => {});
        }

        // ログ保存 (_log/{key}.json) — 失敗しても本体は成功扱い
        const logEntry = {
          timestamp: new Date().toISOString(),
          ip,
          ua,
          file: key,
          size: file.size,
        };
        await ghPut(env, `_log/${key}.json`, encodeContent(JSON.stringify(logEntry, null, 2)), `log: ${key}`)
          .catch(() => {});

        return json({ ok: true, key }, 200, cors);
      } catch (e) {
        return json({ error: e.message }, 500, cors);
      }
    }

    // ── Admin routes (/admin/*) ──────────────────────────────────
    if (url.pathname.startsWith('/admin/')) {
      const secret = url.searchParams.get('secret');
      if (!secret || secret !== env.ADMIN_SECRET) {
        return json({ error: '認証エラー' }, 401, cors);
      }

      // GET /admin/logs — 最新50件のアップロードログを返す
      if (request.method === 'GET' && url.pathname === '/admin/logs') {
        try {
          const entries = await getLogEntries(env);
          return json({ entries }, 200, cors);
        } catch (e) {
          return json({ error: e.message }, 500, cors);
        }
      }

      // GET /admin/blocklist — ブロック済みIPリストを返す
      if (request.method === 'GET' && url.pathname === '/admin/blocklist') {
        try {
          const blocked = await getBlocklist(env);
          return json({ blocked }, 200, cors);
        } catch (e) {
          return json({ error: e.message }, 500, cors);
        }
      }

      // POST /admin/block — { ip } をブロックリストに追加
      if (request.method === 'POST' && url.pathname === '/admin/block') {
        try {
          const body = await request.json();
          if (!body.ip) return json({ error: 'ip が必要です' }, 400, cors);
          await addToBlocklist(env, body.ip);
          return json({ ok: true }, 200, cors);
        } catch (e) {
          return json({ error: e.message }, 500, cors);
        }
      }

      // DELETE /admin/block — { ip } をブロックリストから削除
      if (request.method === 'DELETE' && url.pathname === '/admin/block') {
        try {
          const body = await request.json();
          if (!body.ip) return json({ error: 'ip が必要です' }, 400, cors);
          await removeFromBlocklist(env, body.ip);
          return json({ ok: true }, 200, cors);
        } catch (e) {
          return json({ error: e.message }, 500, cors);
        }
      }
    }

    return new Response('Not found', { status: 404, headers: cors });
  },
};

// ── GitHub helpers ────────────────────────────────────────────────

function ghHeaders(env) {
  return {
    'Authorization': `token ${env.GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'kukuCome-Worker',
  };
}

function ghPut(env, path, base64Content, message, sha) {
  const body = { message, content: base64Content };
  if (sha) body.sha = sha;
  return fetch(
    `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`,
    { method: 'PUT', headers: ghHeaders(env), body: JSON.stringify(body) }
  );
}

// UTF-8 safe encode/decode for GitHub Contents API base64
function encodeContent(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decodeContent(b64) {
  const binaryStr = atob(b64.replace(/\n/g, ''));
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

// ── Blocklist (_blocklist.json) ───────────────────────────────────

async function getBlocklist(env) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/_blocklist.json`,
      { headers: ghHeaders(env) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return JSON.parse(decodeContent(data.content));
  } catch {
    return [];
  }
}

async function saveBlocklist(env, list) {
  let sha;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/_blocklist.json`,
      { headers: ghHeaders(env) }
    );
    if (res.ok) sha = (await res.json()).sha;
  } catch {}
  await ghPut(env, '_blocklist.json', encodeContent(JSON.stringify(list, null, 2)), 'blocklist update', sha);
}

async function addToBlocklist(env, ip) {
  const list = await getBlocklist(env);
  if (!list.includes(ip)) {
    list.push(ip);
    await saveBlocklist(env, list);
  }
}

async function removeFromBlocklist(env, ip) {
  const list = await getBlocklist(env);
  await saveBlocklist(env, list.filter(x => x !== ip));
}

// ── Upload log (_log/*.json) ──────────────────────────────────────

async function getLogEntries(env) {
  const res = await fetch(
    `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/_log`,
    { headers: ghHeaders(env) }
  );
  if (!res.ok) return [];
  const files = await res.json();
  if (!Array.isArray(files)) return [];

  // 最新50件（ファイル名 = タイムスタンプ先頭なので降順ソートで新しい順）
  const jsonFiles = files
    .filter(f => f.name.endsWith('.json'))
    .sort((a, b) => b.name.localeCompare(a.name))
    .slice(0, 50);

  const entries = await Promise.all(jsonFiles.map(async f => {
    try {
      const r = await fetch(f.url, { headers: ghHeaders(env) });
      if (!r.ok) return null;
      const d = await r.json();
      return JSON.parse(decodeContent(d.content));
    } catch {
      return null;
    }
  }));

  return entries.filter(Boolean);
}

// ── util ──────────────────────────────────────────────────────────

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}
