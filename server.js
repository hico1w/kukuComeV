const express          = require('express');
const https            = require('https');
const path             = require('path');
const fs               = require('fs');
const { WebSocketServer } = require('ws');

const app  = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// 背景画像アップロード
app.post('/api/bg-upload', (req, res) => {
  const { dataUrl } = req.body || {};
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Invalid image data' });
  }
  const m = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/s);
  if (!m) return res.status(400).json({ error: 'Invalid data URL' });
  const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
  const dir = path.join(__dirname, 'public', 'bg');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  // 古い背景ファイルを削除
  try { fs.readdirSync(dir).forEach(f => fs.unlinkSync(path.join(dir, f))); } catch {}
  const filename = `background.${ext}`;
  fs.writeFileSync(path.join(dir, filename), Buffer.from(m[2], 'base64'));
  res.json({ url: `/bg/${filename}` });
});

// 背景画像クリア
app.delete('/api/bg', (req, res) => {
  const dir = path.join(__dirname, 'public', 'bg');
  try { fs.readdirSync(dir).forEach(f => fs.unlinkSync(path.join(dir, f))); } catch {}
  res.json({ ok: true });
});

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch { reject(new Error('Invalid JSON from API')); }
      });
    }).on('error', reject);
  });
}

app.get('/api/comments', async (req, res) => {
  const { apikey, hash, cnum } = req.query;
  if (!apikey) return res.status(400).json({ error: 'apikey が必要です' });

  let url = `https://live.erinn.biz/api/?category=comment&type=list`
           + `&apikey=${encodeURIComponent(apikey)}`;
  if (hash) url += `&hash=${encodeURIComponent(hash)}`;
  if (cnum) url += `&cnum=${encodeURIComponent(cnum)}`;

  try {
    const data = await fetchJSON(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 生レスポンス確認用
app.get('/api/raw', async (req, res) => {
  const { apikey, hash } = req.query;
  if (!apikey) return res.status(400).json({ error: 'apikey が必要です' });

  let url = `https://live.erinn.biz/api/?category=comment&type=list`
           + `&apikey=${encodeURIComponent(apikey)}`;
  if (hash) url += `&hash=${encodeURIComponent(hash)}`;

  try {
    const data = await fetchJSON(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// sound/sentou フォルダの音声一覧
app.get('/api/sounds/sentou', (req, res) => {
  const dir = path.join(__dirname, 'public', 'sound', 'sentou');
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(wav|mp3|ogg|m4a|aac|flac)$/i.test(f))
      .sort();
    res.json({ sounds: files });
  } catch {
    res.json({ sounds: [] });
  }
});

// sound/drag フォルダの音声一覧
app.get('/api/sounds/drag', (req, res) => {
  const dir = path.join(__dirname, 'public', 'sound', 'drag');
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(wav|mp3|ogg|m4a|aac|flac)$/i.test(f))
      .sort();
    res.json({ sounds: files });
  } catch {
    res.json({ sounds: [] });
  }
});

// charImages 永続化（キャラスロット割り当て）
const CHAR_IMAGES_FILE = path.join(__dirname, 'data', 'charImages.json');
app.get('/api/char-images', (req, res) => {
  try {
    const data = fs.existsSync(CHAR_IMAGES_FILE)
      ? JSON.parse(fs.readFileSync(CHAR_IMAGES_FILE, 'utf8'))
      : {};
    res.json(data);
  } catch { res.json({}); }
});
app.post('/api/char-images', (req, res) => {
  try {
    const dir = path.join(__dirname, 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CHAR_IMAGES_FILE, JSON.stringify(req.body || {}));
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// chara フォルダの画像一覧
app.get('/api/images', (req, res) => {
  const dir = path.join(__dirname, 'public', 'chara');
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))
      .sort();
    res.json({ images: files });
  } catch {
    res.json({ images: [] });
  }
});

app.get('/api/time', (req, res) => {
  const now = new Date();
  res.json({ hour: now.getHours(), day: now.getDay() });
});

const server = app.listen(PORT, () => {
  console.log(`✅ kukuCome 起動: http://localhost:${PORT}`);
  console.log('   Ctrl+C で停止');
});

// ── WebSocket中継サーバー（管理パネル↔メインウィンドウ） ────────────
const wss = new WebSocketServer({ server, path: '/ws' });
const wsClients = { main: new Set(), admin: new Set() };

wss.on('connection', ws => {
  let role = null;
  ws.on('message', raw => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    if (msg.type === 'identify') {
      role = msg.role;
      if (role === 'main' || role === 'admin') wsClients[role].add(ws);
      return;
    }
    // admin→main、main→admin に中継
    const targets = role === 'admin' ? wsClients.main
                  : role === 'main'  ? wsClients.admin
                  : null;
    if (!targets) return;
    const out = JSON.stringify(msg);
    targets.forEach(c => { if (c.readyState === 1) c.send(out); });
  });
  ws.on('close', () => {
    wsClients.main.delete(ws);
    wsClients.admin.delete(ws);
  });
});
