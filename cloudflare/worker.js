// kukuCome キャラ画像アップロード Worker
// Cloudflare Dashboard > Workers & Pages > Create > Worker に貼り付けて Deploy
// ※ Settings > Bindings > R2 Bucket を追加: Variable name = BUCKET, bucket = kukucome-chara

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
        await env.BUCKET.put(key, file.stream(), {
          httpMetadata: { contentType: file.type },
        });

        return json({ ok: true, key }, 200, cors);
      } catch (e) {
        return json({ error: e.message }, 500, cors);
      }
    }

    // GET /list - ローカルサーバーのポーリング用
    if (request.method === 'GET' && url.pathname === '/list') {
      const listed = await env.BUCKET.list();
      const files = listed.objects.map(o => ({ key: o.key, size: o.size }));
      return json(files, 200, cors);
    }

    // GET /file/:key - ファイルダウンロード用
    if (request.method === 'GET' && url.pathname.startsWith('/file/')) {
      const key = decodeURIComponent(url.pathname.slice(6));
      const obj = await env.BUCKET.get(key);
      if (!obj) return new Response('Not found', { status: 404, headers: cors });
      return new Response(obj.body, {
        headers: { 'Content-Type': obj.httpMetadata?.contentType || 'image/png', ...cors },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}
