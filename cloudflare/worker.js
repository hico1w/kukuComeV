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

        // APNG は実体が PNG なので image/png で届くことがほとんどだが、
        // .apng 拡張子だと image/apng で来るブラウザがあるため両方許可する
        const allowed = ['image/png', 'image/apng', 'image/jpeg', 'image/gif'];
        if (!allowed.includes(file.type)) {
          return json({ error: '対応形式: PNG / APNG / JPG / GIF のみ' }, 400, cors);
        }
        if (file.size > 1 * 1024 * 1024) {
          return json({ error: 'ファイルは1MB以下にしてください' }, 400, cors);
        }

        const extMap = { 'image/jpeg': 'jpg', 'image/apng': 'png' };
        const ext = extMap[file.type] || file.type.split('/')[1];
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

      // DELETE /admin/dino-ranking — ランキングから消す
      //   { name, score } で1件、{ clear: true } で全消し
      if (request.method === 'DELETE' && url.pathname === '/admin/dino-ranking') {
        try {
          const body = await request.json().catch(() => ({}));
          const cur = await getRankingRaw(env);
          // 消し方は3通り: clear=全部 / index=順位で1件 / name+score で該当を全部
          const keep = e => !(e.name === body.name && Number(e.score) === Number(body.score));
          const which = body.list === 'recent' ? 'recent' : 'ranking';
          let next;
          if (body.clear) {
            next = { ranking: [], recent: [] };
          } else if (Number.isInteger(body.index)) {
            // 1始まり。文字化けした名前など、指定しづらいものを順位で消せるように
            next = { ranking: cur.ranking.slice(), recent: cur.recent.slice() };
            next[which].splice(body.index - 1, 1);
          } else {
            next = { ranking: cur.ranking.filter(keep), recent: cur.recent.filter(keep) };
          }
          const before = cur.ranking.length + cur.recent.length;
          const after = next.ranking.length + next.recent.length;
          const res = await ghPut(
            env, RANKING_PATH,
            encodeContent(JSON.stringify(next, null, 1)),
            body.clear ? 'dino ranking: clear' : `dino ranking: remove ${body.name} ${body.score}`,
            cur.sha
          );
          if (!res.ok) return json({ error: 'GitHub ' + res.status }, 500, cors);
          return json({ ok: true, removed: before - after,
                        ranking: stripIp(next.ranking), recent: stripIp(next.recent) }, 200, cors);
        } catch (e) {
          return json({ error: e.message }, 500, cors);
        }
      }

      // GET /admin/image?key={filename} — GitHubからプライベート画像をプロキシ
      if (request.method === 'GET' && url.pathname === '/admin/image') {
        try {
          const key = url.searchParams.get('key');
          if (!key) return new Response('key が必要です', { status: 400, headers: cors });

          const ext = key.split('.').pop().toLowerCase();
          const ctMap = { png: 'image/png', apng: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' };
          const ct = ctMap[ext] || 'image/jpeg';

          // Contents API はファイルサイズ制限があるため raw エンドポイントから直接取得
          const rawUrl = `https://raw.githubusercontent.com/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/main/${encodeURIComponent(key)}`;
          const dlRes = await fetch(rawUrl, {
            headers: {
              'Authorization': `token ${env.GITHUB_TOKEN}`,
              'User-Agent': 'kukuCome-Worker',
            },
          });
          if (!dlRes.ok) return new Response('Not found', { status: dlRes.status, headers: cors });

          return new Response(dlRes.body, {
            status: 200,
            headers: { ...cors, 'Content-Type': ct, 'Cache-Control': 'public, max-age=86400' },
          });
        } catch (e) {
          return new Response(e.message, { status: 500, headers: cors });
        }
      }
    }

    // ── DINO ハイスコアランキング ────────────────────────────────
    // 保存先は _blocklist.json と同じ非公開リポジトリ（_dino_ranking.json）。
    // 専用のKVなどは用意していないので、既存の置き場に合わせている。
    if (url.pathname === '/dino-ranking') {
      if (request.method === 'GET') {
        const cur = await getRankingRaw(env);
        return json({ ranking: stripIp(cur.ranking), recent: stripIp(cur.recent) },
          200, { ...cors, 'Cache-Control': 'no-store' });
      }

      if (request.method === 'POST') {
        let body;
        try { body = await request.json(); } catch { return json({ error: 'JSON が不正です' }, 400, cors); }

        // 名前: 15文字以内。改行や制御文字は落とす。
        // 自動登録(type:'recent')は名前が無くても既定名で通す
        const isRecent = body.type === 'recent';
        const name = String(body.name ?? '')
          .replace(/[\u0000-\u001f\u007f]/g, '')
          .trim()
          .slice(0, 15) || (isRecent ? DEFAULT_NAME : '');
        if (!name) return json({ error: '名前を入力してください' }, 400, cors);

        const score = Math.floor(Number(body.score));
        if (!Number.isFinite(score) || score < 0 || score > 9999999) {
          return json({ error: 'スコアが不正です' }, 400, cors);
        }

        const entry = {
          name,
          score,
          date: jstDate(),        // UTC のままだと深夜〜朝が前日になるので日本時間で持つ
          ip,                                   // 荒らし対応用。GET では返さない
        };

        // 読み込み→追記→書き戻し。同時投稿で sha が衝突したら数回やり直す
        let saved = null;
        for (let i = 0; i < 4; i++) {
          const cur = await getRankingRaw(env);
          const next = { ranking: cur.ranking, recent: cur.recent };
          if (isRecent) {
            // 自動登録: 最新プレイに積む（新しい順に RECENT_MAX 件）
            next.recent = [entry].concat(cur.recent).slice(0, RECENT_MAX);
          } else {
            // 手動登録: ハイスコアに積む
            next.ranking = cur.ranking.concat([entry])
              .sort((a, b) => b.score - a.score || String(a.date).localeCompare(String(b.date)))
              .slice(0, RANKING_MAX);
          }
          const res = await ghPut(
            env, RANKING_PATH,
            encodeContent(JSON.stringify(next, null, 1)),
            `dino ${isRecent ? 'recent' : 'ranking'}: ${name} ${score}`,
            cur.sha
          );
          if (res.ok) { saved = next; break; }
          if (res.status !== 409 && res.status !== 422) {
            return json({ error: '保存に失敗しました (' + res.status + ')' }, 500, cors);
          }
          await new Promise(r => setTimeout(r, 120 * (i + 1)));   // 競合。少し待って再試行
        }
        if (!saved) return json({ error: '混み合っています。少し待って再度お試しください' }, 503, cors);

        const pubR = stripIp(saved.ranking), pubN = stripIp(saved.recent);
        const rank = isRecent ? null
          : pubR.findIndex(e => e.name === name && e.score === score) + 1 || null;
        return json({ ok: true, rank, ranking: pubR, recent: pubN }, 200, cors);
      }

      return json({ error: 'Method not allowed' }, 405, cors);
    }

    // ── GET /live-status — kukuluLIVE 配信中チェック ──────────────
    if (request.method === 'GET' && url.pathname === '/live-status') {
      try {
        const res = await fetch('https://live.erinn.biz/api/?category=live', {
          headers: { 'User-Agent': 'kukuCome-Worker' },
          cf: { cacheTtl: 60, cacheEverything: true },
        });
        if (!res.ok) return json({ live: false }, 200, cors);
        const data = await res.json();
        const streams = Array.isArray(data.live) ? data.live : [];
        const stream = streams.find(s => s.profile_page === 'https://live.erinn.biz/u/x');
        return json(
          stream ? { live: true, url: stream.url, title: stream.title || '' } : { live: false },
          200, { ...cors, 'Cache-Control': 'public, max-age=60' }
        );
      } catch {
        return json({ live: false }, 200, cors);
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

// ── DINO ランキング (_dino_ranking.json) ──────────────────────────

const RANKING_PATH = '_dino_ranking.json';

/** 日本時間の YYYY-MM-DD */
function jstDate() {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

const RANKING_MAX = 100;          // ハイスコアの保持件数（表示はフロント側で絞る）
const RECENT_MAX = 10;            // 最新プレイの保持件数
const DEFAULT_NAME = '名無し';     // 名前未入力のときの既定

// sha も一緒に返す。書き戻しの競合検出に使う。
// 中身は { ranking, recent }。以前は配列だけだったので、その形も読めるようにする
async function getRankingRaw(env) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${RANKING_PATH}`,
      { headers: ghHeaders(env), cf: { cacheTtl: 0 } }
    );
    if (!res.ok) return { ranking: [], recent: [], sha: undefined };   // 未作成なら新規で作る
    const data = await res.json();
    const parsed = JSON.parse(decodeContent(data.content));
    if (Array.isArray(parsed)) return { ranking: parsed, recent: [], sha: data.sha };  // 旧形式
    return {
      ranking: Array.isArray(parsed.ranking) ? parsed.ranking : [],
      recent: Array.isArray(parsed.recent) ? parsed.recent : [],
      sha: data.sha,
    };
  } catch {
    return { ranking: [], recent: [], sha: undefined };
  }
}

const stripIp = list => list.map(({ ip, ...rest }) => rest);   // 公開用。IP は落とす

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
