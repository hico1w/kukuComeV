// kukuCome キャラ画像アップロード Worker (GitHub Storage)
// Cloudflare Dashboard > Workers & Pages > Create > Worker に貼り付けて Deploy
// Settings > Variables and Secrets:
//   GITHUB_TOKEN  (Secret)  : GitHub Fine-grained PAT (Contents: Read+Write)
//   GITHUB_OWNER  (Variable): hico1w
//   GITHUB_REPO   (Variable): kukucome-chara-uploads

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    // POST /upload
    if (request.method === 'POST' && url.pathname === '/upload') {
      try {
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

        // base64 encode (chunked to avoid call stack limit)
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        const base64 = btoa(binary);

        // GitHub Contents API でコミット
        const ghRes = await fetch(
          `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${key}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `token ${env.GITHUB_TOKEN}`,
              'Content-Type': 'application/json',
              'User-Agent': 'kukuCome-Worker',
            },
            body: JSON.stringify({ message: `upload: ${key}`, content: base64 }),
          }
        );

        if (!ghRes.ok) {
          const err = await ghRes.json().catch(() => ({}));
          throw new Error(err.message || 'GitHubへの保存に失敗しました');
        }

        return json({ ok: true, key }, 200, cors);
      } catch (e) {
        return json({ error: e.message }, 500, cors);
      }
    }

    return new Response('Not found', { status: 404, headers: cors });
  },
};

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}
