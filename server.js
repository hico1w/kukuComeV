const express          = require('express');
const https            = require('https');
const http             = require('http');
const zlib             = require('zlib');
const path             = require('path');
const fs               = require('fs');
const net              = require('net');
const { spawn, exec }  = require('child_process');
const sharp            = require('sharp');
const ws_lib = require('ws');
const { WebSocketServer } = ws_lib;

const app  = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ユーザーインストールフォントを配信（OBS Browser Source 対応）
const USER_FONTS_DIR = process.env.LOCALAPPDATA
  ? path.join(process.env.LOCALAPPDATA, 'Microsoft', 'Windows', 'Fonts')
  : null;
if (USER_FONTS_DIR && fs.existsSync(USER_FONTS_DIR)) {
  app.use('/user-fonts', express.static(USER_FONTS_DIR, { setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }}));
}

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

function hasJapanese(text) {
  return /[　-鿿＀-￯]/.test(text);
}

async function translateToEnglish(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  const data = await fetchJSON(url);
  // data[0] is array of [translated, original] pairs
  return data[0].map(seg => seg[0]).join('');
}

app.post('/api/translate', async (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.json({ result: '' });
  if (!hasJapanese(text)) return res.json({ result: text });
  try {
    const result = await translateToEnglish(text);
    res.json({ result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/live-info', async (req, res) => {
  const { apikey } = req.query;
  if (!apikey) return res.status(400).json({ error: 'apikey が必要です' });
  try {
    const data = await fetchJSON(`https://live.erinn.biz/api/?category=mylive&type=port_info&apikey=${encodeURIComponent(apikey)}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// リダイレクト追跡 + gzip対応でHTMLを取得
function _fetchHtml(url, depth, cookies, cb) {
  if (depth <= 0) return cb(null);
  let parsed;
  try { parsed = new URL(url); } catch { return cb(null); }
  const mod = parsed.protocol === 'https:' ? https : http;
  const opts = {
    hostname: parsed.hostname,
    path: parsed.pathname + parsed.search,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
      'Accept-Encoding': 'gzip, deflate',
      ...(cookies ? { 'Cookie': cookies } : {}),
    },
  };
  const r2 = mod.get(opts, (r) => {
    const setCookies = [].concat(r.headers['set-cookie'] || []).map(c => c.split(';')[0]);
    const nextCookies = [cookies, ...setCookies].filter(Boolean).join('; ');
    const location = r.headers['location'];
    if (location && [301, 302, 307, 308].includes(r.statusCode)) {
      r.resume();
      const next = /^https?:\/\//i.test(location) ? location : new URL(location, url).href;
      return _fetchHtml(next, depth - 1, nextCookies, cb);
    }
    const enc = r.headers['content-encoding'] || '';
    let stream = r;
    if (enc.includes('gzip'))    stream = r.pipe(zlib.createGunzip());
    else if (enc.includes('deflate')) stream = r.pipe(zlib.createInflate());
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => cb(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', () => cb(null));
  });
  r2.on('error', () => cb(null));
  r2.setTimeout(8000, () => { r2.destroy(); cb(null); });
}

// kuku.luページをプロキシ: MutationObserverでSunoリンクを傍受してpostMessage
app.get('/api/kuku-proxy', (req, res) => {
  const { url } = req.query;
  if (!url || !/^https?:\/\/kuku\.lu\//i.test(url)) return res.status(400).send('invalid');
  _fetchHtml(url, 5, '', (html) => {
    if (!html) return res.status(500).send('fetch failed');
    const inject = `<script>(function(){
var _n=function(u){try{window.parent.postMessage({__kuku:String(u)},'*')}catch(e){}};
try{new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){
  if(n.nodeType!==1)return;
  var as=(n.tagName==='A'?[n]:[]).concat(Array.from(n.querySelectorAll?n.querySelectorAll('a[href]'):[]));
  as.forEach(function(a){if(a.href&&/suno\.com/i.test(a.href))_n(a.href);});
})})}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
window.addEventListener('load',function(){setTimeout(function(){
  document.querySelectorAll('a[href]').forEach(function(a){if(a.href&&/suno\.com/i.test(a.href))_n(a.href);});
},800);});
})();</script>`;
    const modified = html.replace(/(<head[^>]*>)/i, '$1' + inject);
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.send(modified);
  });
});

// suno.com/s/{shortId} → song UUID を解決
app.get('/api/suno-resolve', (req, res) => {
  const { id } = req.query;
  if (!id || /[^A-Za-z0-9_-]/.test(id)) return res.status(400).json({ error: 'invalid id' });
  const opts = {
    hostname: 'suno.com', path: `/s/${id}`,
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' },
  };
  const r2 = https.get(opts, (r) => {
    const loc = r.headers['location'] || '';
    const m = loc.match(/\/song\/([a-f0-9-]{36})/i);
    r.resume();
    if (m) res.json({ songId: m[1] });
    else res.json({ songId: id }); // 解決できなければそのまま返す
  });
  r2.on('error', () => res.json({ songId: id }));
  r2.setTimeout(5000, () => { r2.destroy(); res.json({ songId: id }); });
});

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

app.get('/api/emotions', async (req, res) => {
  const { apikey, hash } = req.query;
  if (!apikey) return res.status(400).json({ error: 'apikey が必要です' });
  let url = `https://live.erinn.biz/api/?category=comment&type=emotions&apikey=${encodeURIComponent(apikey)}`;
  if (hash) url += `&hash=${encodeURIComponent(hash)}`;
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

// ageru/oto/bgm フォルダの会話モードBGM一覧（ランダム再生用）
app.get('/api/ageru-bgm', (req, res) => {
  const dir = path.join(__dirname, 'public', 'ageru', 'oto', 'bgm');
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(mp3|ogg|m4a|aac|flac|wav)$/i.test(f))
      .sort();
    res.json({ files });
  } catch {
    res.json({ files: [] });
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

// ── 汎用JSONファイル永続化ヘルパー ───────────────────────────────────
function makeDataEndpoints(route, file) {
  app.get(route, (req, res) => {
    try { res.json(fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {}); }
    catch { res.json({}); }
  });
  app.post(route, (req, res) => {
    try {
      const dir = path.dirname(file);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(file, JSON.stringify(req.body || {}));
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  // PATCH: 既存設定とマージして保存（admin.html の直接保存用）
  app.patch(route, (req, res) => {
    try {
      const dir = path.dirname(file);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const current = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
      const merged = Object.assign(current, req.body || {});
      fs.writeFileSync(file, JSON.stringify(merged));
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
}

const DATA = p => path.join(__dirname, 'data', p);
makeDataEndpoints('/api/char-images',      DATA('charImages.json'));
makeDataEndpoints('/api/char-aliases',     DATA('charAliases.json'));
makeDataEndpoints('/api/char-image-sizes', DATA('charImageSizes.json'));
makeDataEndpoints('/api/settings',         DATA('settings.json'));

// ageru.html 専用システムプロンプト（settings.json に agruPageSystem キーで保存）
app.get('/api/ageru-page-system', (req, res) => {
  try {
    const file = DATA('agruPageSystem.txt');
    const system = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    res.json({ system });
  } catch { res.json({ system: '' }); }
});
app.post('/api/ageru-page-system', (req, res) => {
  try {
    const system = typeof req.body.system === 'string' ? req.body.system : '';
    fs.writeFileSync(DATA('agruPageSystem.txt'), system, 'utf8');
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// char-save: GET は全データ返却、POST はマージ（上書きしない）
app.get('/api/char-save', (req, res) => {
  try { res.json(fs.existsSync(DATA('charSave.json')) ? JSON.parse(fs.readFileSync(DATA('charSave.json'), 'utf8')) : {}); }
  catch { res.json({}); }
});
app.post('/api/char-save', (req, res) => {
  try {
    const file = DATA('charSave.json');
    const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
    const merged = { ...existing, ...(req.body || {}) };
    fs.writeFileSync(file, JSON.stringify(merged));
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// キャラセーブ削除
app.delete('/api/char-save', (req, res) => {
  try { fs.writeFileSync(DATA('charSave.json'), '{}'); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/char-save/:ipid', (req, res) => {
  try {
    const file = DATA('charSave.json');
    const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
    delete data[req.params.ipid];
    fs.writeFileSync(file, JSON.stringify(data));
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── 記憶日記（配信ごとの「今日あったこと」を日付キーで保存／回想） ──
// 形式: { "YYYY-MM-DD": { date, text, stats } } を新しい順で最大60件保持
app.get('/api/agru-diary', (req, res) => {
  try {
    const file = DATA('agruDiary.json');
    const all = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
    const entries = Object.values(all).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    // ?latest=1 で直近1件だけ返す（回想用）
    if (req.query.latest) return res.json({ latest: entries[0] || null });
    res.json({ entries });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/agru-diary', (req, res) => {
  try {
    const file = DATA('agruDiary.json');
    const all = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
    const body = req.body || {};
    const date = body.date || new Date().toISOString().slice(0, 10);
    all[date] = { date, text: String(body.text || ''), stats: body.stats || {}, savedAt: Date.now() };
    // 60件を超えたら古い日付から削除
    const keys = Object.keys(all).sort((a, b) => b.localeCompare(a));
    keys.slice(60).forEach(k => delete all[k]);
    fs.writeFileSync(file, JSON.stringify(all));
    res.json({ ok: true, date });
  } catch (e) { res.status(500).json({ error: e.message }); }
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

app.get('/api/ageru-images', (req, res) => {
  const dir = path.join(__dirname, 'public', 'ageru');
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))
      .sort();
    res.json({ images: files });
  } catch {
    res.json({ images: [] });
  }
});

app.get('/api/ageru-images/:folder', (req, res) => {
  const folder = decodeURIComponent(req.params.folder);
  if (!folder || folder.includes('..') || folder.includes('/') || folder.includes('\\')) return res.json({ images: [] });
  const dir = path.join(__dirname, 'public', 'ageru', folder);
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))
      .sort();
    res.json({ images: files });
  } catch {
    res.json({ images: [] });
  }
});

// ageru フォルダ一覧
app.get('/api/ageru-folders', (req, res) => {
  const dir = path.join(__dirname, 'public', 'ageru');
  try {
    const folders = fs.readdirSync(dir, { withFileTypes: true })
      .filter(d => d.isDirectory()).map(d => d.name);
    res.json({ folders });
  } catch { res.json({ folders: [] }); }
});

// boss 画像一覧
app.get('/api/boss-images', (req, res) => {
  const dir = path.join(__dirname, 'public', 'boss');
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))
      .sort();
    res.json({ images: files });
  } catch { res.json({ images: [] }); }
});

app.get('/api/chara-images', (req, res) => {
  const dir = path.join(__dirname, 'public', 'chara');
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))
      .sort();
    res.json({ images: files });
  } catch { res.json({ images: [] }); }
});

app.get('/api/boss-boshai-images', (req, res) => {
  const dir = path.join(__dirname, 'public', 'boss', 'boshai');
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))
      .sort();
    res.json({ images: files });
  } catch { res.json({ images: [] }); }
});

// sprite フォルダ一覧
app.get('/api/sprite-folders', (req, res) => {
  const dir = path.join(__dirname, 'public', 'sprite');
  try {
    const folders = fs.readdirSync(dir, { withFileTypes: true })
      .filter(d => d.isDirectory()).map(d => d.name);
    res.json({ folders });
  } catch { res.json({ folders: [] }); }
});

// sprite フォルダ内画像一覧（サブフォルダ含む再帰）
app.get('/api/sprite-list/:folder', (req, res) => {
  const folder = decodeURIComponent(req.params.folder);
  if (!folder || folder.includes('..') || folder.includes('/') || folder.includes('\\')) return res.json({ images: [] });
  const base = path.join(__dirname, 'public', 'sprite', folder);
  function collect(dir, rel) {
    let results = [];
    try {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const rp = rel ? rel + '/' + e.name : e.name;
        if (e.isDirectory()) results = results.concat(collect(path.join(dir, e.name), rp));
        else if (/\.(png|jpg|jpeg|gif|webp)$/i.test(e.name)) results.push(rp);
      }
    } catch {}
    return results;
  }
  res.json({ images: collect(base, '') });
});

// サウンドファイル一覧（再帰）
app.get('/api/sounds', (req, res) => {
  const base = path.join(__dirname, 'public', 'sound');
  function collect(dir, rel) {
    let results = [];
    try {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const rp = rel ? rel + '/' + e.name : e.name;
        if (e.isDirectory()) results = results.concat(collect(path.join(dir, e.name), rp));
        else if (/\.(mp3|wav|ogg)$/i.test(e.name)) results.push(rp);
      }
    } catch {}
    return results;
  }
  res.json({ sounds: collect(base, '') });
});

// ボスアゲル設定 GET/POST
const _bossAgruConfigPath = path.join(__dirname, 'data', 'bossAgruConfig.json');
let _bossAgruConfig = {};
try { _bossAgruConfig = JSON.parse(fs.readFileSync(_bossAgruConfigPath, 'utf8')); } catch {}
app.get('/api/boss-ageru-config', (req, res) => res.json(_bossAgruConfig));
app.post('/api/boss-ageru-config', (req, res) => {
  try {
    _bossAgruConfig = req.body;
    fs.writeFileSync(_bossAgruConfigPath, JSON.stringify(_bossAgruConfig, null, 2));
    res.json({ ok: true });
  } catch { res.json({ ok: false }); }
});

app.get('/api/yt-random-video', async (req, res) => {
  try {
    const html = await new Promise((resolve, reject) => {
      https.get({
        hostname: 'www.youtube.com',
        path: '/@hico1w/videos',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      }, r => {
        let d = '';
        r.on('data', c => { d += c; });
        r.on('end', () => resolve(d));
      }).on('error', reject);
    });

    const marker = 'var ytInitialData = ';
    const idx = html.indexOf(marker);
    if (idx === -1) return res.status(404).json({ error: 'no ytInitialData' });

    let depth = 0, start = idx + marker.length, end = start;
    for (let i = start; i < html.length; i++) {
      if (html[i] === '{') depth++;
      else if (html[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
    }

    const data = JSON.parse(html.slice(start, end));
    const videoIds = [];
    function _findIds(obj) {
      if (!obj || typeof obj !== 'object') return;
      if (typeof obj.videoId === 'string' && obj.videoId.length === 11) videoIds.push(obj.videoId);
      for (const v of Object.values(obj)) _findIds(v);
    }
    const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
    for (const tab of tabs) _findIds(tab);

    if (!videoIds.length) return res.status(404).json({ error: 'no videos' });
    const videoId = videoIds[Math.floor(Math.random() * videoIds.length)];
    res.json({ videoId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/ageru-emotion-map', (req, res) => {
  const dir = path.join(__dirname, 'public', 'ageru');
  const result = {};
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      try {
        const files = fs.readdirSync(path.join(dir, entry.name))
          .filter(f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))
          .sort();
        result[entry.name] = files;
      } catch {}
    }
  } catch {}
  res.json(result);
});

// Discord Webhook 連携
const DISCORD_CONFIG_PATH = path.join(__dirname, 'data', 'discord.json');

function loadDiscordConfig() {
  try { return JSON.parse(fs.readFileSync(DISCORD_CONFIG_PATH, 'utf-8')); }
  catch { return { webhookUrl: '' }; }
}

function saveDiscordConfig(cfg) {
  fs.writeFileSync(DISCORD_CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

app.get('/api/discord-config', (req, res) => {
  res.json(loadDiscordConfig());
});

app.post('/api/discord-config', (req, res) => {
  const { webhookUrl } = req.body || {};
  saveDiscordConfig({ webhookUrl: webhookUrl || '' });
  res.json({ ok: true });
});

async function sendToDiscord(imageDataUrl, prompt, translatedPrompt, charName) {
  const { webhookUrl } = loadDiscordConfig();
  if (!webhookUrl) return;

  const base64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
  const imgBuf  = Buffer.from(base64, 'base64');
  const boundary = 'kukuComeBoundary' + Date.now() + Math.random().toString(36).slice(2);

  const promptLine = (translatedPrompt && translatedPrompt !== prompt)
    ? `**${prompt}** → ${translatedPrompt}`
    : `**${prompt}**`;
  const content = charName
    ? `🎨 ${charName}\n${promptLine}`
    : `🎨 ${promptLine}`;

  const payloadJson = JSON.stringify({ content, username: 'kukuCome SD' });

  const head = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="payload_json"\r\nContent-Type: application/json\r\n\r\n${payloadJson}\r\n` +
    `--${boundary}\r\nContent-Disposition: form-data; name="files[0]"; filename="sd_output.png"\r\nContent-Type: image/png\r\n\r\n`
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([head, imgBuf, tail]);

  let parsedUrl;
  try { parsedUrl = new URL(webhookUrl); } catch { console.error('[Discord] invalid webhook URL'); return; }

  const lib = parsedUrl.protocol === 'https:' ? https : http;

  return new Promise(resolve => {
    const req = lib.request({
      hostname: parsedUrl.hostname,
      port:     parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path:     parsedUrl.pathname + parsedUrl.search,
      method:   'POST',
      headers: {
        'Content-Type':   `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
      },
    }, response => {
      let raw = '';
      response.on('data', c => raw += c);
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          console.error('[Discord] webhook error:', response.statusCode, raw.slice(0, 200));
        } else {
          console.log('[Discord] sent OK');
        }
        resolve();
      });
    });
    req.on('error', err => { console.error('[Discord] webhook error:', err.message); resolve(); });
    req.write(body);
    req.end();
  });
}

// Stable Diffusion 画像生成プロキシ（Gradio WebSocket queue API）
const SD_DEFAULTS_PATH = 'C:/Users/swift/AppData/Local/Temp/sd_defaults.json';
// SD_IDX はsd_defaults.jsonのidxMapで上書きされる（後方互換のデフォルト値）
let SD_IDX = { PROMPT:1, NEGATIVE:2, BATCH_COUNT:4, BATCH_SIZE:5, CFG:6, HEIGHT:7, WIDTH:8, HIRES_FIX:9, OVERRIDE:22, SCRIPT:23, STEPS:24, SAMPLER:25 };
const SD_NEGATIVE = '(worst quality:2),(low quality:2),(normal quality:2),lowres,extra fingers,fewer fingers,monochrome,grayscale,text,watermark,logo,';

// /config から txt2img の fn_index・defaults・idxMap を取得してキャッシュ
async function _sdFetchDefaults() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:7860/config', res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try {
          const config = JSON.parse(raw);
          const deps = config.dependencies || [];
          const comps = {};
          (config.components || []).forEach(c => { comps[c.id] = c; });

          // txt2img を探す: inputs[1]=Prompt, inputs[2]=Negative prompt, inputs に Width/Height を含む
          let bestDep = null, bestIdx = -1;
          deps.forEach((dep, i) => {
            const inputs = dep.inputs || [];
            if (inputs.length < 200 || inputs.length > 700) return;
            const labels = inputs.map(id => (comps[id]?.props?.label || '').trim());
            if (labels[1] === 'Prompt' && labels[2] === 'Negative prompt' &&
                labels.includes('Width') && labels.includes('Height')) {
              if (!bestDep || inputs.length > bestDep.inputs.length) {
                bestDep = dep; bestIdx = i;
              }
            }
          });
          if (!bestDep) return reject(new Error('txt2img not found in /config'));

          const inputs = bestDep.inputs;
          const defaults = inputs.map(id => {
            const comp = comps[id] || {};
            const val = comp.props?.value;
            const type = comp.type || '';
            if (type === 'image') return null;
            if (val !== undefined && val !== null) return val;
            if (type === 'checkbox') return false;
            if (type === 'slider' || type === 'number') return comp.props?.minimum ?? 0;
            if (type === 'textbox' || type === 'dropdown' || type === 'radio') return '';
            if (type === 'checkboxgroup') return [];
            return null;
          });

          const idxMap = {};
          inputs.forEach((id, i) => {
            const label = (comps[id]?.props?.label || '').trim();
            if (label === 'Prompt')           idxMap.PROMPT = i;
            if (label === 'Negative prompt')  idxMap.NEGATIVE = i;
            // 最初の Width/Height を使用（Forge では後方に拡張機能の同名スライダーが複数存在するため）
            if (label === 'Width'  && idxMap.WIDTH  === undefined) idxMap.WIDTH  = i;
            if (label === 'Height' && idxMap.HEIGHT === undefined) idxMap.HEIGHT = i;
            if (label === 'Sampling steps')   idxMap.STEPS = i;
            if (label === 'Sampling method')  idxMap.SAMPLER = i;
            if (label === 'CFG Scale')        idxMap.CFG = i;
            if (label === 'Batch count')      idxMap.BATCH_COUNT = i;
            if (label === 'Batch size')       idxMap.BATCH_SIZE = i;
            if (label.startsWith('Hires. fix')) idxMap.HIRES_FIX = i;
            if (label === 'Override settings') idxMap.OVERRIDE = i;
            if (label === 'Script')           idxMap.SCRIPT = i;
          });

          const result = { fn_index: bestIdx, defaults, idxMap };
          fs.writeFileSync(SD_DEFAULTS_PATH, JSON.stringify(result));
          SD_IDX = { ...SD_IDX, ...idxMap };
          console.log(`[SD] defaults 再取得: fn_index=${bestIdx} params=${defaults.length} idxMap=${JSON.stringify(idxMap)}`);
          resolve(result);
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function _sdGetDefaults() {
  // idxMap がないキャッシュは古いので無条件に再取得
  try {
    const cached = JSON.parse(fs.readFileSync(SD_DEFAULTS_PATH, 'utf-8'));
    if (cached.fn_index && Array.isArray(cached.defaults) && cached.idxMap) {
      SD_IDX = { ...SD_IDX, ...cached.idxMap };
      return cached;
    }
  } catch {}
  return _sdFetchDefaults();
}

// 起動時にキャッシュを削除して必ず再取得（idxMap の Width/Height 検出ロジック変更に追従）
try { fs.unlinkSync(SD_DEFAULTS_PATH); } catch {}
_sdFetchDefaults().catch(() => {});

app.post('/api/sd-generate', async (req, res) => {
  const { prompt, charName, width, height, steps, cfgScale, sampler, positiveSuffix, negative } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });

  let fn_index, defaults;
  try {
    ({ fn_index, defaults } = await _sdGetDefaults());
  } catch (e) {
    return res.status(500).json({ error: 'SD defaults 取得失敗: ' + e.message });
  }

  let translatedPrompt = prompt;
  if (hasJapanese(prompt)) {
    try {
      translatedPrompt = await translateToEnglish(prompt);
      console.log(`[SD] translate: "${prompt}" → "${translatedPrompt}"`);
    } catch (e) {
      console.warn('[SD] 翻訳失敗、元プロンプトで続行:', e.message);
    }
  }

  const _w = parseInt(width)  || 1600;
  const _h = parseInt(height) || 1000;
  const data = [...defaults];
  if (data[0] === null || (typeof data[0] === 'object' && !Array.isArray(data[0]) && data[0] !== null && Object.keys(data[0]).length === 0)) data[0] = {};
  data[SD_IDX.PROMPT]      = translatedPrompt + (positiveSuffix ? ', ' + positiveSuffix : '');
  data[SD_IDX.NEGATIVE]    = negative || SD_NEGATIVE;
  data[SD_IDX.WIDTH]       = _w;
  data[SD_IDX.HEIGHT]      = _h;
  data[SD_IDX.STEPS]       = parseInt(steps)      || 20;
  data[SD_IDX.CFG]         = parseFloat(cfgScale) || 3;
  data[SD_IDX.SAMPLER]     = sampler || 'Euler a';
  data[SD_IDX.BATCH_COUNT] = 1;
  data[SD_IDX.BATCH_SIZE]  = 1;
  data[SD_IDX.HIRES_FIX]   = false;
  data[SD_IDX.OVERRIDE]    = [];
  data[SD_IDX.SCRIPT]      = 'None';

  console.log(`[SD] generating via /api/predict: "${prompt}" ${_w}x${_h} fn_index=${fn_index} WIDTH_idx=${SD_IDX.WIDTH}(default=${defaults[SD_IDX.WIDTH]}) HEIGHT_idx=${SD_IDX.HEIGHT}(default=${defaults[SD_IDX.HEIGHT]}) data[0]=${JSON.stringify(data[0]).slice(0,80)}`);

  const body = JSON.stringify({ fn_index, data, session_hash: Math.random().toString(36).slice(2, 12) });
  const options = {
    hostname: '127.0.0.1', port: 7860, path: '/api/predict',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  };

  const sdReq = http.request(options, sdRes => {
    const chunks = [];
    sdRes.on('data', c => chunks.push(c));
    sdRes.on('end', () => {
      try {
        const result = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        console.log('[SD] predict response:', JSON.stringify(result).slice(0, 300));
        if (result.error) return res.status(500).json({ error: 'SD error: ' + result.error });

        const gallery = result.data?.[0];
        let imageInfo = null;
        if (Array.isArray(gallery) && gallery.length > 0) {
          imageInfo = gallery[gallery.length - 1];
        } else if (gallery && typeof gallery === 'object') {
          imageInfo = gallery;
        }
        if (!imageInfo) return res.status(500).json({ error: 'SD: 画像情報が取得できませんでした' });

        console.log('[SD] imageInfo:', JSON.stringify(imageInfo).slice(0, 150));

        function resolveAndSend(info) {
          if (info.url) {
            const fileUrl = info.url.startsWith('http') ? info.url : `http://127.0.0.1:7860${info.url}`;
            http.get(fileUrl, r => {
              const cs = [];
              r.on('data', c => cs.push(c));
              r.on('end', () => {
                const img = 'data:image/png;base64,' + Buffer.concat(cs).toString('base64');
                console.log('[SD] success (url)');
                sendToDiscord(img, prompt, translatedPrompt, charName).catch(() => {});
                res.json({ image: img, translatedPrompt });
              });
            }).on('error', e => res.status(500).json({ error: 'SD 画像DL失敗: ' + e.message }));
          } else if (info.data && info.data.startsWith('data:')) {
            console.log('[SD] success (base64)');
            sendToDiscord(info.data, prompt, translatedPrompt, charName).catch(() => {});
            res.json({ image: info.data, translatedPrompt });
          } else if (info.name) {
            const fileUrl = `http://127.0.0.1:7860/file=${info.name.split('?')[0]}`;
            http.get(fileUrl, r => {
              const cs = [];
              r.on('data', c => cs.push(c));
              r.on('end', () => {
                const img = 'data:image/png;base64,' + Buffer.concat(cs).toString('base64');
                console.log('[SD] success (name)');
                sendToDiscord(img, prompt, translatedPrompt, charName).catch(() => {});
                res.json({ image: img, translatedPrompt });
              });
            }).on('error', e => res.status(500).json({ error: 'SD 画像DL失敗: ' + e.message }));
          } else {
            res.status(500).json({ error: 'SD: 画像フォーマット不明 ' + JSON.stringify(info).slice(0, 80) });
          }
        }
        resolveAndSend(imageInfo);
      } catch (e) {
        if (!res.headersSent) res.status(500).json({ error: 'SD レスポンス解析失敗: ' + e.message });
      }
    });
  });
  sdReq.setTimeout(120000, () => { sdReq.destroy(); if (!res.headersSent) res.status(500).json({ error: 'SD timeout' }); });
  sdReq.on('error', e => { if (!res.headersSent) res.status(500).json({ error: e.message }); });
  sdReq.write(body);
  sdReq.end();
});

// TTS（RVC 7870）
app.post('/api/tts', (req, res) => {
  const {
    text, model, voice = 'ja-JP-NanamiNeural-Female',
    f0_up_key = 0, f0_method = 'rmvpe',
    index_rate = 0.75, protect = 0.33, speed = 0,
  } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text is required' });
  if (!model) return res.status(400).json({ error: 'model is required' });

  const body = JSON.stringify({
    fn_index: 0,
    data: [model, Number(speed), text, voice, Number(f0_up_key), f0_method, Number(index_rate), Number(protect)],
  });

  const opts = {
    hostname: '127.0.0.1', port: 7870,
    path: '/run/predict', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  };

  const req2 = http.request(opts, res2 => {
    let raw = '';
    res2.on('data', c => raw += c);
    res2.on('end', () => {
      try {
        const json = JSON.parse(raw);
        const audioData = json.data?.[2];
        if (!audioData?.name) return res.status(500).json({ error: 'No audio returned' });
        const url = `http://127.0.0.1:7870/file=${audioData.name.replace(/\\/g, '/')}`;
        res.json({ url });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });
  });
  req2.on('error', e => res.status(500).json({ error: e.message }));
  req2.write(body);
  req2.end();
});

// VoiceVox スピーカー一覧
app.get('/api/voicevox-speakers', (req, res) => {
  const opts = { hostname: '127.0.0.1', port: 50021, path: '/speakers', method: 'GET' };
  const r = http.request(opts, r2 => {
    let raw = '';
    r2.on('data', c => raw += c);
    r2.on('end', () => {
      try {
        const speakers = JSON.parse(raw);
        // { name, styles:[{name, id}] } を { id, label } のフラットリストに
        const list = [];
        speakers.forEach(sp => {
          sp.styles.forEach(st => {
            list.push({ id: st.id, label: `${sp.name}（${st.name}）` });
          });
        });
        res.json({ speakers: list });
      } catch (e) { res.status(500).json({ error: e.message }); }
    });
  });
  r.on('error', e => res.status(500).json({ error: e.message }));
  r.end();
});

// VoiceVox TTS（port 50021）
app.post('/api/voicevox', (req, res) => {
  const { text, speaker = 0, speedScale = 1.0 } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text is required' });

  const queryPath = `/audio_query?text=${encodeURIComponent(text)}&speaker=${speaker}`;
  const queryOpts = {
    hostname: '127.0.0.1', port: 50021, path: queryPath, method: 'POST',
    headers: { 'Content-Length': 0 },
  };

  const queryReq = http.request(queryOpts, queryRes => {
    let raw = '';
    queryRes.on('data', c => raw += c);
    queryRes.on('end', () => {
      if (queryRes.statusCode !== 200) return res.status(500).json({ error: 'audio_query failed: ' + queryRes.statusCode });
      let query;
      try { query = JSON.parse(raw); } catch (e) { return res.status(500).json({ error: 'parse error: ' + e.message }); }
      query.speedScale = Number(speedScale);

      const bodyStr = JSON.stringify(query);
      const synthOpts = {
        hostname: '127.0.0.1', port: 50021,
        path: `/synthesis?speaker=${speaker}`, method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr) },
      };

      const synthReq = http.request(synthOpts, synthRes => {
        const chunks = [];
        synthRes.on('data', c => chunks.push(c));
        synthRes.on('end', () => {
          if (synthRes.statusCode !== 200) return res.status(500).json({ error: 'synthesis failed: ' + synthRes.statusCode });
          const audio = 'data:audio/wav;base64,' + Buffer.concat(chunks).toString('base64');
          res.json({ audio });
        });
      });
      synthReq.on('error', e => res.status(500).json({ error: e.message }));
      synthReq.write(bodyStr);
      synthReq.end();
    });
  });
  queryReq.on('error', e => res.status(500).json({ error: e.message }));
  queryReq.end();
});

// ── サーバー設定（永続化） ────────────────────────────────────────
const SERVER_CONFIG_PATH = path.join(__dirname, 'data', 'server-config.json');
function loadServerConfig() {
  try { return JSON.parse(fs.readFileSync(SERVER_CONFIG_PATH, 'utf-8')); }
  catch { return {}; }
}
function saveServerConfig(cfg) {
  const dir = path.dirname(SERVER_CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SERVER_CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

const _initSrvCfg = loadServerConfig();
let ollamaHost      = _initSrvCfg.ollamaHost      || '127.0.0.1';
let ollamaNumGpu    = _initSrvCfg.ollamaNumGpu    ?? -1;
let ollamaNumThread = _initSrvCfg.ollamaNumThread ?? -1;
let ollamaNumCtx    = _initSrvCfg.ollamaNumCtx    ?? -1;
const OLLAMA_PORT = 11434;
const OLLAMA_TIMEOUT_MS = 120000; // Ollama応答のタイムアウト(ms)。生成スタック時に無限待ちしないため

function buildOllamaOptions() {
  const o = {};
  if (ollamaNumGpu    !== -1) o.num_gpu    = ollamaNumGpu;
  if (ollamaNumThread !== -1) o.num_thread = ollamaNumThread;
  if (ollamaNumCtx    !== -1) o.num_ctx    = ollamaNumCtx;
  return Object.keys(o).length ? o : null;
}

app.get('/api/ollama-host', (req, res) => {
  res.json({ host: ollamaHost === '127.0.0.1' ? '' : ollamaHost });
});

app.post('/api/ollama-host', (req, res) => {
  const { host } = req.body || {};
  ollamaHost = (host || '').trim() || '127.0.0.1';
  const cfg = loadServerConfig();
  cfg.ollamaHost = ollamaHost;
  saveServerConfig(cfg);
  if (MANAGED_SERVERS.ollama) MANAGED_SERVERS.ollama.host = ollamaHost;
  console.log(`[Ollama] host → ${ollamaHost}`);
  res.json({ ok: true, host: ollamaHost });
});

app.get('/api/ollama-num-gpu', (req, res) => {
  res.json({ numGpu: ollamaNumGpu });
});

app.post('/api/ollama-num-gpu', (req, res) => {
  const { numGpu } = req.body || {};
  ollamaNumGpu = (numGpu === undefined || numGpu === null || numGpu === '') ? -1 : parseInt(numGpu, 10);
  if (isNaN(ollamaNumGpu)) ollamaNumGpu = -1;
  const cfg = loadServerConfig();
  cfg.ollamaNumGpu = ollamaNumGpu;
  saveServerConfig(cfg);
  console.log(`[Ollama] num_gpu → ${ollamaNumGpu}`);
  res.json({ ok: true, numGpu: ollamaNumGpu });
});

app.get('/api/ollama-num-thread', (req, res) => {
  res.json({ numThread: ollamaNumThread });
});

app.post('/api/ollama-num-thread', (req, res) => {
  const { numThread } = req.body || {};
  ollamaNumThread = (numThread === undefined || numThread === null || numThread === '') ? -1 : parseInt(numThread, 10);
  if (isNaN(ollamaNumThread)) ollamaNumThread = -1;
  const cfg = loadServerConfig();
  cfg.ollamaNumThread = ollamaNumThread;
  saveServerConfig(cfg);
  console.log(`[Ollama] num_thread → ${ollamaNumThread}`);
  res.json({ ok: true, numThread: ollamaNumThread });
});

app.get('/api/ollama-num-ctx', (req, res) => {
  res.json({ numCtx: ollamaNumCtx });
});

app.post('/api/ollama-num-ctx', (req, res) => {
  const { numCtx } = req.body || {};
  ollamaNumCtx = (numCtx === undefined || numCtx === null || numCtx === '') ? -1 : parseInt(numCtx, 10);
  if (isNaN(ollamaNumCtx)) ollamaNumCtx = -1;
  const cfg = loadServerConfig();
  cfg.ollamaNumCtx = ollamaNumCtx;
  saveServerConfig(cfg);
  console.log(`[Ollama] num_ctx → ${ollamaNumCtx}`);
  res.json({ ok: true, numCtx: ollamaNumCtx });
});

// ── サーバー管理 ────────────────────────────────────────────────
const MANAGED_SERVERS = {
  tts:    { label: 'TTS (RVC)',         port: 7870,  cmd: 'E:\\rvc-tts-webui\\venv\\Scripts\\python.exe', args: ['app.py'], cwd: 'E:\\rvc-tts-webui' },
  ollama: { label: 'Ollama',            port: OLLAMA_PORT, get host() { return ollamaHost; }, cmd: 'C:\\Users\\swift\\AppData\\Local\\Programs\\Ollama\\ollama.exe', args: ['serve'], cwd: null },
  sd:     { label: 'Stable Diffusion',  port: 7860,  cmd: 'cmd.exe', args: ['/c', 'webui-user.bat'], cwd: 'E:\\stable-diffusion-webui' },
};
const _srvProcs = {};

function checkPort(port, host = '127.0.0.1') {
  return new Promise(resolve => {
    const s = new net.Socket();
    s.setTimeout(500);
    s.on('connect', () => { s.destroy(); resolve(true); });
    s.on('timeout', () => { s.destroy(); resolve(false); });
    s.on('error',   () => resolve(false));
    s.connect(port, host);
  });
}

app.get('/api/srv/status', async (req, res) => {
  const result = {};
  for (const [name, cfg] of Object.entries(MANAGED_SERVERS)) {
    result[name] = await checkPort(cfg.port, cfg.host || '127.0.0.1');
  }
  res.json(result);
});

app.post('/api/srv/start/:name', async (req, res) => {
  const cfg = MANAGED_SERVERS[req.params.name];
  if (!cfg) return res.status(404).json({ error: 'unknown server' });
  if (await checkPort(cfg.port)) return res.json({ ok: true, msg: 'already running' });
  const opts = { detached: false, stdio: 'ignore' };
  if (cfg.cwd) opts.cwd = cfg.cwd;
  try {
    const proc = spawn(cfg.cmd, cfg.args, opts);
    _srvProcs[req.params.name] = proc;
    proc.on('exit', () => { delete _srvProcs[req.params.name]; });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/srv/stop/:name', (req, res) => {
  const cfg = MANAGED_SERVERS[req.params.name];
  if (!cfg) return res.status(404).json({ error: 'unknown server' });
  exec(`for /f "tokens=5" %a in ('netstat -aon ^| findstr :${cfg.port}') do taskkill /F /PID %a`,
    { shell: 'cmd.exe' },
    () => res.json({ ok: true })
  );
});

// コメント投稿プロキシ（OBS等ブラウザから外部HTTPSが届かない場合用）
app.post('/api/post-comment', async (req, res) => {
  const { apikey, comment, icon = '0' } = req.body || {};
  if (!apikey || !comment) return res.status(400).json({ error: 'apikey と comment が必要です' });
  const url = `https://live.erinn.biz/api/?${new URLSearchParams({ category: 'comment', type: 'write', apikey, icon, comment }).toString()}`;
  try {
    const data = await fetchJSON(url);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// AI返答（Ollama）
app.post('/api/ai-reply', (req, res) => {
  const { prompt, messages, model = 'gemma3:12b', system, keepAlive } = req.body || {};
  const systemText = system || 'あなたは配信のコメントに返答するアシスタントです。必ず50文字以内の日本語で返答してください。';

  if (messages) {
    // /api/chat — 会話履歴あり
    const chatMessages = [{ role: 'system', content: systemText }, ...messages];
    const ollamaBody = { model, messages: chatMessages, stream: false };
    if (keepAlive !== undefined) ollamaBody.keep_alive = keepAlive;
    const _opts1 = buildOllamaOptions(); if (_opts1) ollamaBody.options = _opts1;
    const body = JSON.stringify(ollamaBody);
    const opts = {
      hostname: ollamaHost, port: OLLAMA_PORT,
      path: '/api/chat', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    };
    const req2 = http.request(opts, res2 => {
      let raw = '';
      res2.on('data', c => raw += c);
      res2.on('end', () => {
        try {
          const json = JSON.parse(raw);
          const reply = json.message?.content?.trim();
          if (!reply) { if (!res.headersSent) res.status(500).json({ error: 'No response from Ollama' }); return; }
          if (!res.headersSent) res.json({ reply });
        } catch (e) { if (!res.headersSent) res.status(500).json({ error: e.message }); }
      });
    });
    req2.on('error', e => { if (!res.headersSent) res.status(500).json({ error: e.message }); });
    // Ollamaが応答しない（生成スタック等）と無限に待つため、タイムアウトを設ける
    req2.setTimeout(OLLAMA_TIMEOUT_MS, () => { req2.destroy(); if (!res.headersSent) res.status(504).json({ error: `Ollama応答タイムアウト(${OLLAMA_TIMEOUT_MS / 1000}秒)` }); });
    req2.write(body);
    req2.end();
  } else {
    // /api/generate — 後方互換（単発）
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });
    const ollamaBody2 = { model, prompt, system: systemText, stream: false };
    if (keepAlive !== undefined) ollamaBody2.keep_alive = keepAlive;
    const _opts2 = buildOllamaOptions(); if (_opts2) ollamaBody2.options = _opts2;
    const body = JSON.stringify(ollamaBody2);
    const opts = {
      hostname: ollamaHost, port: OLLAMA_PORT,
      path: '/api/generate', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    };
    const req2 = http.request(opts, res2 => {
      let raw = '';
      res2.on('data', c => raw += c);
      res2.on('end', () => {
        try {
          const json = JSON.parse(raw);
          if (!json.response) { if (!res.headersSent) res.status(500).json({ error: 'No response from Ollama' }); return; }
          if (!res.headersSent) res.json({ reply: json.response.trim() });
        } catch (e) { if (!res.headersSent) res.status(500).json({ error: e.message }); }
      });
    });
    req2.on('error', e => { if (!res.headersSent) res.status(500).json({ error: e.message }); });
    req2.setTimeout(OLLAMA_TIMEOUT_MS, () => { req2.destroy(); if (!res.headersSent) res.status(504).json({ error: `Ollama応答タイムアウト(${OLLAMA_TIMEOUT_MS / 1000}秒)` }); });
    req2.write(body);
    req2.end();
  }
});

// Ollama モデルのアンロード（画像コマンド後に返答とは別で呼ぶ）
app.post('/api/ai-unload', (req, res) => {
  const { model = 'gemma3:12b' } = req.body || {};
  const body = JSON.stringify({ model, messages: [], keep_alive: 0 });
  const opts = {
    hostname: ollamaHost, port: OLLAMA_PORT,
    path: '/api/chat', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  };
  const req2 = http.request(opts, res2 => {
    res2.resume();
    res2.on('end', () => res.json({ ok: true }));
  });
  req2.on('error', () => res.json({ ok: false }));
  req2.write(body);
  req2.end();
});

// ステータス画面スクリーンショット → Discord 投稿 → URL 返却
app.post('/api/status-screenshot', async (req, res) => {
  const { imageDataUrl, userName = '' } = req.body || {};
  if (!imageDataUrl) return res.status(400).json({ error: 'imageDataUrl is required' });
  const { webhookUrl } = loadDiscordConfig();
  if (!webhookUrl) return res.status(400).json({ error: 'Discord webhook not configured' });

  const base64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
  const imgBuf = Buffer.from(base64, 'base64');
  const boundary = 'kukuComeBoundary' + Date.now() + Math.random().toString(36).slice(2);
  const content = userName ? `📊 ${userName} のステータス` : '📊 ステータス確認';
  const payloadJson = JSON.stringify({ content, username: 'kukuCome' });
  const head = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="payload_json"\r\nContent-Type: application/json\r\n\r\n${payloadJson}\r\n` +
    `--${boundary}\r\nContent-Disposition: form-data; name="files[0]"; filename="status.png"\r\nContent-Type: image/png\r\n\r\n`
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([head, imgBuf, tail]);

  let parsedUrl;
  try { parsedUrl = new URL(webhookUrl); } catch { return res.status(400).json({ error: 'Invalid webhook URL' }); }
  // ?wait=true でメッセージオブジェクトを返してもらう
  const pathWithWait = parsedUrl.pathname + (parsedUrl.search ? parsedUrl.search + '&wait=true' : '?wait=true');
  const lib = parsedUrl.protocol === 'https:' ? https : http;

  const result = await new Promise(resolve => {
    const req2 = lib.request({
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: pathWithWait,
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': body.length },
    }, response => {
      let raw = '';
      response.on('data', c => raw += c);
      response.on('end', () => {
        try {
          const json = JSON.parse(raw);
          const url = json.attachments?.[0]?.url;
          resolve(url ? { url } : { error: 'No attachment URL: ' + raw.slice(0, 100) });
        } catch (e) { resolve({ error: e.message }); }
      });
    });
    req2.on('error', err => resolve({ error: err.message }));
    req2.write(body);
    req2.end();
  });

  res.json(result);
});

// コメント総評（Ollama）
app.post('/api/ollama-review', (req, res) => {
  const { comments = [], systemPrompt = '', userName = '', model = 'gemma3:12b' } = req.body || {};
  if (!systemPrompt) return res.status(400).json({ error: 'systemPrompt is required' });
  const commentsText = comments.length > 0 ? comments.join('\n') : '（コメントなし）';
  const userPrompt = `${userName ? `${userName}さん` : 'ユーザー'}のコメント一覧:\n${commentsText}`;
  const chatMessages = [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }];
  const reviewBody = { model, messages: chatMessages, stream: false };
  const _optsR = buildOllamaOptions(); if (_optsR) reviewBody.options = _optsR;
  const body = JSON.stringify(reviewBody);
  const opts = {
    hostname: ollamaHost, port: OLLAMA_PORT,
    path: '/api/chat', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  };
  const req2 = http.request(opts, res2 => {
    let raw = '';
    res2.on('data', c => raw += c);
    res2.on('end', () => {
      try {
        const json = JSON.parse(raw);
        const review = json.message?.content?.trim();
        if (!review) return res.status(500).json({ error: 'No response from Ollama' });
        res.json({ review });
      } catch (e) { res.status(500).json({ error: e.message }); }
    });
  });
  req2.on('error', e => res.status(500).json({ error: e.message }));
  req2.write(body);
  req2.end();
});

app.get('/api/time', (req, res) => {
  const now = new Date();
  res.json({ hour: now.getHours(), day: now.getDay() });
});

// ── ニュースフィード RSS プロキシ ────────────────────────────────────────
const _newsCache = { data: null, at: 0 };
const NEWS_FEEDS = [
  { url: 'https://gigazine.net/news/rss_2.0/',                        source: 'Gigazine' },
  { url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml',         source: 'Yahoo!' },
];

function _fetchRss(feedUrl) {
  return new Promise((resolve, reject) => {
    const req = https.get(feedUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; kukuCome/1.0)' } }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function _parseRss(xml, source) {
  const items = [];
  const itemRe = /<item[\s>]([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const titleM = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    // <link> の中身のみを検索対象に絞る（CDATA description 内の誤マッチを防ぐ）
    const linkTagM = block.match(/<link>\s*([\s\S]*?)\s*<\/link>/);
    const linkUrl  = linkTagM ? linkTagM[1].trim() : '';
    // Atom形式 <link href="..." rel="alternate"/> 専用フォールバック
    const linkAtomM = !linkUrl && block.match(/<link\s[^>]*rel="alternate"[^>]*href="(https?:[^"]+)"/);
    // guid isPermaLink="true" フォールバック（Yahoo RSS 等）
    const linkGuidM = !linkUrl && !linkAtomM && block.match(/<guid[^>]*isPermaLink="true"[^>]*>\s*(https?:[^\s<]+)\s*<\/guid>/);
    const link = (linkUrl.startsWith('http') ? linkUrl : '') || (linkAtomM && linkAtomM[1]) || (linkGuidM && linkGuidM[1]) || '';
    if (titleM) {
      const title = titleM[1].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#039;/g,"'").trim();
      if (title) items.push({ title, link, source });
    }
  }
  return items;
}

app.get('/api/news', async (req, res) => {
  const now = Date.now();
  if (_newsCache.data && now - _newsCache.at < 5 * 60 * 1000) return res.json(_newsCache.data);
  try {
    const results = await Promise.allSettled(NEWS_FEEDS.map(f => _fetchRss(f.url).then(xml => _parseRss(xml, f.source))));
    const bySource = {};
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') bySource[NEWS_FEEDS[i].source] = r.value;
    });
    // 交互に並べる
    const interleaved = [];
    let added = true;
    const queues = Object.values(bySource).map(arr => [...arr]);
    while (added) {
      added = false;
      queues.forEach(q => { if (q.length) { interleaved.push(q.shift()); added = true; } });
    }
    _newsCache.data = interleaved.slice(0, 50);
    _newsCache.at = now;
    res.json(_newsCache.data);
  } catch(e) {
    console.error('[news]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// キャラ画像を半サイズにリサイズして配信（軽量化用）
const _charaDir   = path.join(__dirname, 'public', 'chara');
const _charaSCache = new Map(); // filename → { buf, ct }

app.get('/chara-s/:filename', async (req, res) => {
  const filename = req.params.filename;
  if (/[/\\]/.test(filename)) return res.status(400).end();

  const filepath = path.join(_charaDir, filename);
  if (!fs.existsSync(filepath)) return res.status(404).end();

  const ext = path.extname(filename).toLowerCase();

  // GIF・SVGはリサイズ不要のままそのまま返す
  if (ext === '.gif' || ext === '.svg') {
    return res.sendFile(filepath);
  }

  if (_charaSCache.has(filename)) {
    const { buf, ct } = _charaSCache.get(filename);
    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(buf);
  }

  try {
    const meta = await sharp(filepath).metadata();
    const halfW = Math.max(1, Math.round(meta.width / 2));
    const s = sharp(filepath).resize(halfW);

    let buf, ct;
    if (ext === '.png') {
      buf = await s.png().toBuffer(); ct = 'image/png';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      buf = await s.jpeg({ quality: 85 }).toBuffer(); ct = 'image/jpeg';
    } else if (ext === '.webp') {
      buf = await s.webp({ quality: 85 }).toBuffer(); ct = 'image/webp';
    } else {
      return res.sendFile(filepath);
    }

    _charaSCache.set(filename, { buf, ct });
    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(buf);
  } catch (err) {
    console.error('[chara-s] resize error:', err.message);
    res.sendFile(filepath); // fallback: 元ファイルをそのまま返す
  }
});

// URLをPCのデフォルトブラウザで開く（OBSブラウザソース対応）
app.get('/api/open-url', (req, res) => {
  const url = req.query.url || '';
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error('invalid protocol');
  } catch {
    return res.status(400).json({ error: 'invalid url' });
  }
  const cmd = process.platform === 'win32'
    ? `start "" "${url.replace(/"/g, '')}"`
    : process.platform === 'darwin'
      ? `open "${url.replace(/"/g, '')}"`
      : `xdg-open "${url.replace(/"/g, '')}"`;
  exec(cmd, err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true });
  });
});

const server = app.listen(PORT, () => {
  console.log(`✅ kukuCome 起動: http://localhost:${PORT}`);
  console.log('   Ctrl+C で停止');
});

// ── オセロゲーム WebSocket ─────────────────────────────────────────
const gameWss = new WebSocketServer({ noServer: true });
const gameRooms = new Map(); // roomId → { black, white, board, turn }

function _gFlips(b, idx, color) {
  const opp = color === 'black' ? 'white' : 'black';
  const row = idx >> 3, col = idx & 7;
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const flips = [];
  for (const [dr, dc] of dirs) {
    const line = [];
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const i = r * 8 + c;
      if (b[i] === opp)     { line.push(i); r += dr; c += dc; }
      else if (b[i] === color) { flips.push(...line); break; }
      else break;
    }
  }
  return flips;
}
function _gApply(b, idx, color) {
  const flips = _gFlips(b, idx, color);
  if (!flips.length || b[idx] !== null) return null;
  const nb = [...b]; nb[idx] = color; flips.forEach(i => nb[i] = color);
  return { board: nb, flips };
}
function _gHasMoves(b, color) {
  return b.some((c, i) => c === null && _gFlips(b, i, color).length);
}
function _gInitBoard() {
  const b = Array(64).fill(null);
  b[27]='white'; b[28]='black'; b[35]='black'; b[36]='white';
  return b;
}
function _gSend(ws, obj) { if (ws?.readyState === 1) ws.send(JSON.stringify(obj)); }

gameWss.on('connection', ws => {
  let roomId = null, color = null;

  ws.on('message', raw => {
    let msg; try { msg = JSON.parse(raw); } catch { return; }

    if (msg.type === 'create') {
      roomId = Math.random().toString(36).slice(2, 8).toUpperCase();
      color  = 'black';
      gameRooms.set(roomId, { black: ws, white: null, board: _gInitBoard(), turn: 'black' });
      _gSend(ws, { type: 'created', roomId, color: 'black' });
    }

    else if (msg.type === 'join') {
      const rid  = (msg.roomId || '').toUpperCase();
      const room = gameRooms.get(rid);
      if (!room)       { _gSend(ws, { type: 'error', msg: 'ルームが見つかりません' }); return; }
      if (room.white)  { _gSend(ws, { type: 'error', msg: 'ルームが満員です' }); return; }
      roomId = rid; color = 'white'; room.white = ws;
      const base = { type: 'start', board: room.board, turn: room.turn };
      _gSend(ws,         { ...base, color: 'white' });
      _gSend(room.black, { ...base, color: 'black' });
    }

    else if (msg.type === 'move') {
      const room = gameRooms.get(roomId);
      if (!room || room.turn !== color) return;
      const res = _gApply(room.board, msg.index, color);
      if (!res) return;
      room.board = res.board;
      const opp  = color === 'black' ? 'white' : 'black';
      const next = _gHasMoves(room.board, opp)    ? opp
                 : _gHasMoves(room.board, color)   ? color
                 : null;
      const passed = next === color;
      room.turn = next;
      const upd = { type: 'update', board: room.board, turn: next, lastMove: msg.index,
                    flips: res.flips, movedColor: color, passed, passedColor: opp };
      _gSend(room.black, upd);
      _gSend(room.white, upd);
      if (next === null) {
        const blacks = room.board.filter(c => c === 'black').length;
        const whites = room.board.filter(c => c === 'white').length;
        const winner = blacks > whites ? 'black' : whites > blacks ? 'white' : 'draw';
        const over = { type: 'gameover', board: room.board, blacks, whites, winner };
        _gSend(room.black, over); _gSend(room.white, over);
        gameRooms.delete(roomId);
      }
    }

    else if (msg.type === 'resign') {
      const room = gameRooms.get(roomId);
      if (!room) return;
      const winner = color === 'black' ? 'white' : 'black';
      const blacks = room.board.filter(c => c === 'black').length;
      const whites = room.board.filter(c => c === 'white').length;
      const over = { type: 'gameover', board: room.board, blacks, whites, winner, resigned: color };
      _gSend(room.black, over); _gSend(room.white, over);
      gameRooms.delete(roomId);
    }
  });

  ws.on('close', () => {
    if (!roomId) return;
    const room = gameRooms.get(roomId);
    if (!room) return;
    const other = color === 'black' ? room.white : room.black;
    _gSend(other, { type: 'opponent_left' });
    gameRooms.delete(roomId);
  });
});

// ── WebSocket URLルーティング ─────────────────────────────────────
const wss = new WebSocketServer({ noServer: true });
server.on('upgrade', (req, socket, head) => {
  if (req.url === '/ws/game') {
    gameWss.handleUpgrade(req, socket, head, ws => gameWss.emit('connection', ws, req));
  } else if (req.url === '/ws') {
    wss.handleUpgrade(req, socket, head, ws => wss.emit('connection', ws, req));
  } else {
    socket.destroy();
  }
});
// ── WebSocket中継サーバー（管理パネル↔メインウィンドウ） ────────────
const wsClients = { main: new Set(), admin: new Set() };

wss.on('connection', ws => {
  let role = null;
  ws.on('message', raw => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    if (msg.type === 'identify') {
      role = msg.role;
      if (role === 'main' || role === 'admin') wsClients[role].add(ws);
      // main が接続したら admin 全員に通知 → admin が getState を再送する
      if (role === 'main') {
        const note = JSON.stringify({ type: 'mainConnected' });
        wsClients.admin.forEach(c => { if (c.readyState === 1) c.send(note); });
      }
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
