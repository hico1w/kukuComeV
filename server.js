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

// GitHub アップロード先リポジトリ設定を読む（キャラ画像自動取り込み/削除で共用）
function _ghUploadConfig() {
  try {
    const c = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'server-config.json'), 'utf8'));
    const s = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'secrets.json'), 'utf8')); } catch { return {}; } })();
    return { owner: c.githubUploadOwner || '', repo: c.githubUploadRepo || '', token: s.githubUploadToken || '' };
  } catch { return { owner: '', repo: '', token: '' }; }
}

// GitHub 上のキャラ画像ファイルを削除（存在しなければ何もしない）
async function _ghDeleteCharaFile(filename) {
  const { owner, repo, token } = _ghUploadConfig();
  if (!owner || !repo || !token) return false;
  const headers = { 'User-Agent': 'kukuCome-Server', 'Accept': 'application/vnd.github.v3+json', 'Authorization': `token ${token}` };
  const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filename)}`, { headers });
  if (getRes.status === 404) return false;
  if (!getRes.ok) throw new Error(`GitHub取得失敗: ${getRes.status}`);
  const info = await getRes.json();
  const delRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `chore: delete ${filename} via admin`, sha: info.sha })
  });
  if (!delRes.ok) throw new Error(`GitHub削除失敗: ${delRes.status}`);
  return true;
}

// キャラ画像削除
app.delete('/api/chara-image/:filename', async (req, res) => {
  const fname = req.params.filename;
  if (!fname || /[/\\]/.test(fname)) return res.status(400).json({ error: 'invalid filename' });
  try {
    const filePath = path.join(__dirname, 'public', 'chara', fname);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    const ciPath = path.join(__dirname, 'data', 'charImages.json');
    const ci = JSON.parse(fs.readFileSync(ciPath, 'utf8'));
    for (const k of Object.keys(ci)) { if (ci[k] === fname) delete ci[k]; }
    fs.writeFileSync(ciPath, JSON.stringify(ci));

    const csPath = path.join(__dirname, 'data', 'charImageSizes.json');
    const cs = JSON.parse(fs.readFileSync(csPath, 'utf8'));
    delete cs[fname];
    fs.writeFileSync(csPath, JSON.stringify(cs));

    let githubDeleted = false, githubError = null;
    try { githubDeleted = await _ghDeleteCharaFile(fname); }
    catch (e) { githubError = e.message; console.warn(`[CHARA] GitHub削除失敗 (${fname}):`, e.message); }

    const note = JSON.stringify({ type: 'charaReload' });
    wsClients.main.forEach(c => { if (c.readyState === 1) c.send(note); });
    wsClients.admin.forEach(c => { if (c.readyState === 1) c.send(note); });

    res.json({ ok: true, githubDeleted, githubError });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 背景画像クリア
app.delete('/api/bg', (req, res) => {
  const dir = path.join(__dirname, 'public', 'bg');
  try { fs.readdirSync(dir).forEach(f => fs.unlinkSync(path.join(dir, f))); } catch {}
  res.json({ ok: true });
});

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
    }
  });
  const raw = await res.text();
  try {
    return JSON.parse(raw);
  } catch {
    const u = (() => { try { return new URL(url); } catch { return null; } })();
    const host = u?.hostname || url;
    const typeParam = u?.searchParams.get('type') || '';
    const label = typeParam ? `${host} type=${typeParam}` : host;
    console.warn(`[fetchJSON] Invalid JSON from ${label} (HTTP ${res.status}): ${raw.slice(0, 300)}`);
    throw new Error(`Invalid JSON from API (${label} HTTP ${res.status})`);
  }
}

function hasJapanese(text) {
  return /[　-鿿＀-￯]/.test(text);
}

async function _translateGoogle(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  const data = await fetchJSON(url);
  // data[0] is array of [translated, original] pairs
  return data[0].map(seg => seg[0]).join('');
}

// MyMemoryの無料枠を5,000→50,000文字/日に上げるダミー識別子（実在不要・他利用者との衝突回避のためランダム生成）
const MYMEMORY_DUMMY_EMAIL = 'kukucome-835470f510a742fd@example.com';

async function _translateMyMemory(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|en&de=${encodeURIComponent(MYMEMORY_DUMMY_EMAIL)}`;
  const data = await fetchJSON(url);
  const translated = data?.responseData?.translatedText;
  // クォータ超過時は responseStatus!=200 か、本文に警告文言が入る
  if (!translated || Number(data.responseStatus) !== 200 || /MYMEMORY WARNING/i.test(translated)) {
    throw new Error('MyMemory translate failed');
  }
  return translated;
}

// Google翻訳（非公式）が429等で失敗した場合はMyMemoryにフォールバック
async function translateToEnglish(text) {
  try {
    return await _translateGoogle(text);
  } catch (e) {
    console.warn('[translate] Google失敗、MyMemoryにフォールバック:', e.message);
    return await _translateMyMemory(text);
  }
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
    console.warn(`[comments] fetch失敗 hash=${JSON.stringify(hash)} cnum=${JSON.stringify(cnum)}`);
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

// ── kukuluLIVE オリジナルポイント管理 ────────────────────────────────
// mypoint_list?hash=LIVE_NUMBER&cnum=COMMENT_CNUM でそのコメントを書いたユーザーのOP取得
// mypoint_change?pid=POINT_ID&point=N でそのユーザーのOPを変更

function _kukuluApikey() {
  try {
    const s = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'secrets.json'), 'utf8'));
    return s.kukuluApikey || '';
  } catch { return ''; }
}

const _KUKULU_BASE = () => {
  const apikey = _kukuluApikey();
  return apikey ? `https://live.erinn.biz/api/?category=comment&apikey=${encodeURIComponent(apikey)}` : null;
};

// 視聴者のOP残高と pid を取得（hash+cnum または pid で特定）
// hash 無しで cnum だけ渡すと kukuluLIVE は cnum を無視して常に同一口座を返すため必ず両方要求する
async function _fetchMypointEntry(base, pid, h, cnum) {
  let qs;
  if (pid)               qs = `&pid=${encodeURIComponent(pid)}`;
  else if (h && cnum)    qs = `&hash=${encodeURIComponent(h)}&cnum=${encodeURIComponent(cnum)}`;
  else throw new Error('pid、または hash と cnum の両方が必要です');
  const got = await fetchJSON(`${base}&type=mypoint_list${qs}`);
  return (Array.isArray(got.users) && got.users[0]) || null;
}

// GET /api/mypoint/get?hash=H&cnum=C または ?pid=P
app.get('/api/mypoint/get', async (req, res) => {
  const base = _KUKULU_BASE();
  if (!base) return res.status(503).json({ error: 'kukuluApikey 未設定' });
  const { hash: h, cnum, pid } = req.query;
  try {
    const entry = await _fetchMypointEntry(base, pid, h, cnum);
    if (!entry) return res.json({ users: [] });
    res.json({ users: [entry] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/mypoint/deposit  { pid?, hash?, cnum?, amount }
app.post('/api/mypoint/deposit', async (req, res) => {
  const base = _KUKULU_BASE();
  if (!base) return res.status(503).json({ error: 'kukuluApikey 未設定' });
  const { hash: h, cnum, pid, amount } = req.body || {};
  const amt = Math.round(Number(amount));
  if (!amt || amt <= 0) return res.status(400).json({ error: '正の整数が必要' });
  if (!pid && !cnum) return res.status(400).json({ error: 'pid または cnum が必要' });
  try {
    const entry = await _fetchMypointEntry(base, pid, h, cnum);
    const current = entry ? (parseInt(entry.point, 10) || 0) : 0;
    const usePid  = entry?.pid || null;
    if (!usePid) return res.status(400).json({ error: 'ポイントIDが取得できません' });
    const newPoint = current + amt;
    const changeRes = await fetchJSON(`${base}&type=mypoint_change&point=${encodeURIComponent(newPoint)}&pid=${encodeURIComponent(usePid)}`);
    if (changeRes.success !== 1) {
      console.warn('[deposit] mypoint_change failed:', changeRes);
      return res.status(500).json({ error: changeRes.error_display || changeRes.error || 'mypoint_change失敗' });
    }
    res.json({ ok: true, before: current, after: newPoint, pid: usePid });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/mypoint/withdraw  { pid?, hash?, cnum?, amount }
app.post('/api/mypoint/withdraw', async (req, res) => {
  const base = _KUKULU_BASE();
  if (!base) return res.status(503).json({ error: 'kukuluApikey 未設定' });
  const { hash: h, cnum, pid, amount, all } = req.body || {};
  const reqAmt = all ? null : Math.round(Number(amount));
  if (!all && (!reqAmt || reqAmt <= 0)) return res.status(400).json({ error: '正の整数が必要' });
  if (!pid && !cnum) return res.status(400).json({ error: 'pid または cnum が必要' });
  try {
    const entry = await _fetchMypointEntry(base, pid, h, cnum);
    if (!entry?.pid) return res.status(400).json({ error: '預金アカウントが見つかりません', current: 0 });
    const current = parseInt(entry.point, 10) || 0;
    // all 指定時は取得した残高の全額を引き出す
    const amt = all ? current : reqAmt;
    if (amt <= 0) return res.status(400).json({ error: '預金がありません', current });
    if (current < amt) return res.status(400).json({ error: `預金MP不足 (現在: ${current})`, current });
    // kukuluLIVE は point=0 を受け付けない（error:1）ため必ず1以上を残す。
    // 実際に引き出せた額は current - newPoint となり、応答の before/after から算出される
    const newPoint = Math.max(1, current - amt);
    if (newPoint >= current) return res.status(400).json({ error: '預金がありません', current });
    const changeRes = await fetchJSON(`${base}&type=mypoint_change&point=${encodeURIComponent(newPoint)}&pid=${encodeURIComponent(entry.pid)}`);
    if (changeRes.success !== 1) {
      console.warn('[withdraw] mypoint_change failed:', changeRes);
      return res.status(500).json({ error: changeRes.error_display || changeRes.error || 'mypoint_change失敗' });
    }
    res.json({ ok: true, before: current, after: newPoint, pid: entry.pid });
  } catch (err) { res.status(500).json({ error: err.message }); }
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
      .map(f => ({ name: f, mtime: fs.statSync(path.join(dir, f)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime)
      .map(f => f.name);
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
  let translatedPrompt = prompt || '';
  if (prompt && hasJapanese(prompt)) {
    try {
      translatedPrompt = await translateToEnglish(prompt);
      console.log(`[SD] translate: "${prompt}" → "${translatedPrompt}"`);
    } catch (e) {
      console.warn('[SD] 翻訳失敗、元プロンプトで続行:', e.message);
    }
  }

  const _w = parseInt(width)  || 1600;
  const _h = parseInt(height) || 1000;
  const fullPrompt = translatedPrompt + (positiveSuffix ? ', ' + positiveSuffix : '');

  _sdQueue = _sdQueue.then(() => new Promise((resolveQueue) => {
  console.log(`[SD] queue start, generating via /sdapi/v1/txt2img: "${prompt}" ${_w}x${_h}`);

  const sdBody = JSON.stringify({
    prompt: fullPrompt,
    negative_prompt: negative || SD_NEGATIVE,
    width: _w, height: _h,
    steps: parseInt(steps) || 20,
    cfg_scale: parseFloat(cfgScale) || 3,
    sampler_name: sampler || 'Euler a',
    scheduler: 'Automatic',
    batch_size: 1, n_iter: 1,
  });

  const opts = {
    hostname: '127.0.0.1', port: 7860,
    path: '/sdapi/v1/txt2img', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(sdBody) },
  };

  const sdReq = http.request(opts, sdRes => {
    const chunks = [];
    sdRes.on('data', c => chunks.push(c));
    sdRes.on('end', () => {
      try {
        const result = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        console.log('[SD] response: images:', result.images?.length, '| detail:', result.detail?.toString?.().slice(0, 80));
        if (result.detail) return res.status(500).json({ error: 'SD error: ' + result.detail });
        const b64 = result.images?.[0];
        if (!b64) return res.status(500).json({ error: 'SD: 画像なし' });
        const dataUrl = 'data:image/png;base64,' + b64;
        console.log('[SD] success');
        sendToDiscord(dataUrl, prompt, translatedPrompt, charName).catch(() => {});
        try {
          const _today = new Date().toISOString().slice(0, 10);
          const _saveDir = path.join('F:\\AI\\Data\\Images\\Text2Img', _today);
          if (!fs.existsSync(_saveDir)) fs.mkdirSync(_saveDir, { recursive: true });
          const _ts  = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
          const _slug = translatedPrompt.slice(0, 40).replace(/[^a-zA-Z0-9 _-]/g, '').trim().replace(/\s+/g, '_') || 'image';
          fs.writeFileSync(path.join(_saveDir, `${_ts}_${_slug}.png`), Buffer.from(b64, 'base64'));
        } catch (e) { console.warn('[SD] 保存失敗:', e.message); }
        res.json({ image: dataUrl, translatedPrompt });
      } catch (e) {
        if (!res.headersSent) res.status(500).json({ error: 'SD レスポンス解析失敗: ' + e.message });
      } finally {
        resolveQueue();
      }
    });
  });
  sdReq.setTimeout(30000, () => {
    sdReq.destroy();
    // SD に中断を送信して GPU を解放する
    const intReq = http.request({ hostname: '127.0.0.1', port: 7860, path: '/sdapi/v1/interrupt', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': 0 } });
    intReq.on('error', () => {});
    intReq.end();
    console.warn('[SD] timeout (30s) → sent /sdapi/v1/interrupt');
    if (!res.headersSent) res.status(500).json({ error: 'SD timeout (30s)' });
    resolveQueue();
  });
  sdReq.on('error', e => { if (!res.headersSent) res.status(500).json({ error: e.message }); resolveQueue(); });
  sdReq.write(sdBody);
  sdReq.end();
  })); // _sdQueue
});

// SD生成をすべて直列化する共有キュー（sd-generate / sd-create-char 両方が使う）
// SD は同時に1件しか処理できないため並列リクエストを防ぐ
let _sdQueue = Promise.resolve();

app.post('/api/sd-create-char', async (req, res) => {
  const { prompt, ipid, positiveSuffix, negative, steps, cfgScale, sampler, sdCharOutdir } = req.body || {};
  console.log('[SD-CHAR] request received, prompt:', prompt, 'ipid:', ipid, 'outdir:', sdCharOutdir || '(未設定)');
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });

  // 翻訳は並走させてよい（SDを直列化するだけでよい）
  let translatedPrompt = prompt;
  if (hasJapanese(prompt)) {
    try { translatedPrompt = await translateToEnglish(prompt); } catch(e) { console.warn('[SD-CHAR] 翻訳失敗:', e.message); }
  }
  console.log('[SD-CHAR] translated:', translatedPrompt, '→ queuing SD...');
  const fullPrompt = translatedPrompt + (positiveSuffix ? ', ' + positiveSuffix : '');

  // SD生成をシリアル化：前のリクエスト完了後に startTime を記録してから開始する
  _sdQueue = _sdQueue.then(() => new Promise((resolveQueue) => {
  console.log('[SD-CHAR] queue start, sending to SD:', fullPrompt.slice(0, 60));
  // only_save=true で ABG Remover が透過 PNG をディスク保存する。
  // API レスポンスは JPEG なので使わず、生成直前の timestamp を基に SD の outputs フォルダから
  // 新しく作られた RGBA PNG を探して使う。
  const startTime = Date.now();

  const sdBody = JSON.stringify({
    prompt: fullPrompt,
    negative_prompt: negative || SD_NEGATIVE,
    width: 512, height: 768,
    steps: parseInt(steps) || 20,
    cfg_scale: parseFloat(cfgScale) || 7,
    sampler_name: sampler || 'Euler a',
    scheduler: 'Automatic',
    batch_size: 1, n_iter: 1,
    script_name: 'ABG Remover',
    script_args: [true, false, false, '#ffffff', false],  // only_save=true → 透過PNGのみディスク保存
  });

  const opts = {
    hostname: '127.0.0.1', port: 7860,
    path: '/sdapi/v1/txt2img', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(sdBody) },
  };

  // SD の outputs ディレクトリを options API から取得（キャッシュあり）
  const getSDOutdir = () => new Promise(resolve => {
    http.get({ hostname: '127.0.0.1', port: 7860, path: '/sdapi/v1/options' }, r => {
      const cs = []; r.on('data', c => cs.push(c));
      r.on('end', () => {
        try {
          const o = JSON.parse(Buffer.concat(cs).toString());
          const d = o.outdir_txt2img_samples || 'outputs/txt2img-images';
          resolve(path.isAbsolute(d) ? d : path.resolve(d));
        } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });

  // 指定ディレクトリを再帰スキャンして minTime 以降の RGBA PNG を返す
  const findRGBA = (dir, minTime) => {
    let found = null;
    const scan = (d) => {
      try {
        for (const f of fs.readdirSync(d)) {
          if (found) break;
          const fp = path.join(d, f);
          const st = fs.statSync(fp);
          if (st.isDirectory()) { scan(fp); continue; }
          if (!f.endsWith('.png') || st.mtimeMs < minTime) continue;
          const fbuf = fs.readFileSync(fp);
          const ct = fbuf.length > 25 ? fbuf[25] : -1;
          console.log(`[SD-CHAR] new PNG: ${f} colorType=${ct}`);
          if (ct === 6 || ct === 4) found = { path: fp, buf: fbuf };
        }
      } catch(e) { console.log('[SD-CHAR] scan error:', e.message); }
    };
    scan(dir);
    return found;
  };

  const sdReq = http.request(opts, sdRes => {
    const chunks = [];
    sdRes.on('data', c => chunks.push(c));
    sdRes.on('end', async () => {
      try {
        const result = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        console.log('[SD-CHAR] images count:', result.images?.length, '| detail:', result.detail?.slice?.(0,100));
        if (result.detail) return res.status(500).json({ error: 'SD error: ' + result.detail });

        // SD outputs フォルダから生成後の透過 PNG を探す
        // フロントから渡された絶対パスを優先し、なければ options API で取得
        const outdir = (sdCharOutdir && sdCharOutdir.trim())
          ? sdCharOutdir.trim()
          : await getSDOutdir();
        console.log('[SD-CHAR] SD outdir:', outdir);
        let buf = null;
        if (outdir) {
          const found = findRGBA(outdir, startTime);
          if (found) {
            console.log('[SD-CHAR] using RGBA file:', path.basename(found.path));
            buf = found.buf;
          }
        }
        if (!buf && result.images?.length) {
          console.log('[SD-CHAR] fallback: using API response image');
          buf = Buffer.from(result.images[result.images.length - 1], 'base64');
        }
        if (!buf) return res.status(500).json({ error: 'SD: 画像なし' });

        const b64 = buf.toString('base64');
        const dataUrl = 'data:image/png;base64,' + b64;
        sendToDiscord(dataUrl, prompt, translatedPrompt, ipid || 'キャラ作成').catch(() => {});
        res.json({ image: dataUrl, translatedPrompt });
      } catch(e) {
        if (!res.headersSent) res.status(500).json({ error: 'レスポンス解析失敗: ' + e.message });
      } finally {
        resolveQueue();
      }
    });
  });
  sdReq.setTimeout(120000, () => { sdReq.destroy(); if (!res.headersSent) res.status(504).json({ error: 'SD timeout' }); resolveQueue(); });
  sdReq.on('error', e => { if (!res.headersSent) res.status(500).json({ error: e.message }); resolveQueue(); });
  sdReq.write(sdBody);
  sdReq.end();
  })); // _sdQueue
});

// ── AutoGen: PNG info読み取り＋自動SD生成 ────────────────────────────
const AUTOGEN_SOURCE_DIR = 'E:\\claude\\AutoGen\\sourceImage';
const AUTOGEN_OUTPUT_BASE = 'E:\\claude\\AutoGen\\output';

// SD生成パラメータをファイルから読み取る（PNG/JPG両対応）
function readSdInfo(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    // PNG: tEXt チャンク "parameters"
    if (buf.slice(0, 8).toString('hex') === '89504e470d0a1a0a') {
      let offset = 8;
      while (offset < buf.length - 12) {
        const length = buf.readUInt32BE(offset);
        const type = buf.slice(offset + 4, offset + 8).toString('ascii');
        const data = buf.slice(offset + 8, offset + 8 + length);
        offset += 12 + length;
        if (type === 'tEXt') {
          const nullIdx = data.indexOf(0);
          if (nullIdx !== -1 && data.slice(0, nullIdx).toString('ascii') === 'parameters') {
            return data.slice(nullIdx + 1).toString('latin1');
          }
        }
        if (type === 'IEND') break;
      }
      return null;
    }
    // JPEG: EXIF APP1 → ExifIFD → UserComment (0x9286)
    if (buf[0] === 0xFF && buf[1] === 0xD8) {
      let i = 2;
      while (i < buf.length - 4) {
        if (buf[i] !== 0xFF) break;
        const marker = buf[i + 1];
        const segLen = buf.readUInt16BE(i + 2);
        if (marker === 0xE1 && buf.slice(i + 4, i + 10).toString('ascii') === 'Exif\0\0') {
          const tb = buf.slice(i + 10, i + 2 + segLen); // TIFF buffer
          const isLE = tb[0] === 0x49; // 'I'=little-endian, 'M'=big-endian
          const r16 = o => isLE ? tb.readUInt16LE(o) : tb.readUInt16BE(o);
          const r32 = o => isLE ? tb.readUInt32LE(o) : tb.readUInt32BE(o);
          if (r16(2) !== 42) break;
          const ifd0 = r32(4);
          const cnt0 = r16(ifd0);
          let exifOff = 0;
          for (let e = 0; e < cnt0; e++) {
            const ep = ifd0 + 2 + e * 12;
            if (r16(ep) === 0x8769) { exifOff = r32(ep + 8); break; }
          }
          if (!exifOff) break;
          const cntE = r16(exifOff);
          for (let e = 0; e < cntE; e++) {
            const ep = exifOff + 2 + e * 12;
            if (r16(ep) === 0x9286) { // UserComment
              const count = r32(ep + 4);
              const valOff = count > 4 ? r32(ep + 8) : ep + 8;
              // 先頭8バイトは文字コード識別子（"ASCII\0\0\0"等）をスキップ
              const text = tb.slice(valOff + 8, valOff + count).toString('utf8').replace(/\0+$/, '');
              return text || null;
            }
          }
          break;
        }
        i += 2 + segLen;
      }
      return null;
    }
  } catch (e) { console.warn('[AutoGen] readSdInfo error:', e.message); }
  return null;
}

// A1111形式パラメータテキストをパース
function parseSdParameters(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const positiveLines = [];
  let negative = '';
  const params = {};
  let mode = 'positive';

  for (const line of lines) {
    if (line.startsWith('Negative prompt:')) {
      mode = 'negative';
      negative = line.replace('Negative prompt:', '').trim();
    } else if (/^Steps:\s*\d+/.test(line)) {
      mode = 'params';
      line.split(',').forEach(pair => {
        const m = pair.trim().match(/^([^:]+):\s*(.+)$/);
        if (m) params[m[1].trim()] = m[2].trim();
      });
    } else if (mode === 'positive') {
      positiveLines.push(line);
    } else if (mode === 'negative') {
      negative += '\n' + line;
    }
  }

  const sizeM = (params['Size'] || '').match(/(\d+)x(\d+)/);
  return {
    positive: positiveLines.join(', '),
    negative: negative.trim(),
    steps: parseInt(params['Steps']) || 20,
    cfgScale: parseFloat(params['CFG scale']) || 7,
    sampler: params['Sampler'] || 'Euler a',
    width: sizeM ? parseInt(sizeM[1]) : 512,
    height: sizeM ? parseInt(sizeM[2]) : 512,
  };
}

let _autogenRunning   = false;
let _autogenStopping  = false;
let _autogenProcessed = 0;
let _autogenErrors    = 0;
let _autogenCurrent   = null;
let _autogenTotal     = 0;

// Ollama設定・プロンプト管理
let _autogenOllamaModel      = 'gemma3:12b';
let _autogenNumCtx           = -1;   // -1=グローバル設定に従う
let _autogenPromptInterval   = 5;   // N枚ごとにOllamaでプロンプト更新
let _autogenSinceLastPrompt  = 0;   // 前回更新から何枚生成したか
let _autogenCurrentPrompt    = null; // 現在使用中のOllamaプロンプト
let _autogenCurrentRefParams = null; // ソースから引き継ぐSD基本パラメータ
let _autogenLastOllamaPrompt = null; // ステータス表示用
let _autogenFixedPositive    = '';   // 常時付加するポジティブ
let _autogenFixedNegative    = '';   // 常時使うネガティブ（空=ソース画像のネガティブ）
let _autogenWidth            = 0;   // 0=ソース画像の値を引き継ぐ
let _autogenHeight           = 0;
let _autogenCount            = 0;   // 0=ソースファイル数と同数

// Ollamaにプロンプト生成を依頼（直列キュー内から呼ぶので並列しない）
function _autogenAskOllama(prompts) {
  return new Promise((resolve) => {
    const list = prompts.map((p, i) => `例${i + 1}: ${p}`).join('\n');
    const userMsg =
      `以下は私が好みとする画像のStable Diffusionプロンプト（ポジティブ）です:\n\n${list}\n\n` +
      `これらの傾向・特徴を踏まえ、さらに魅力的でエロいポルノの新しい画像が生成できる英語のSD用プロンプトを1つ作ってください。\n` +
      `プロンプトのテキストのみを出力してください。説明・前置き・番号は不要です。`;
    const ollamaPayload = {
      model: _autogenOllamaModel,
      messages: [
        { role: 'system', content: 'You are an expert Stable Diffusion prompt engineer. Output only the prompt text, nothing else.' },
        { role: 'user', content: userMsg },
      ],
      stream: false,
    };
    if (_autogenNumCtx !== -1) ollamaPayload.options = { num_ctx: _autogenNumCtx };
    const body = JSON.stringify(ollamaPayload);
    const opts = {
      hostname: ollamaHost, port: OLLAMA_PORT, path: '/api/chat', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    };
    const req = http.request(opts, r => {
      let raw = ''; r.on('data', c => raw += c);
      r.on('end', () => {
        try { resolve(JSON.parse(raw).message?.content?.trim() || null); }
        catch (e) { console.warn('[AutoGen] Ollama parse error:', e.message); resolve(null); }
      });
    });
    req.setTimeout(OLLAMA_TIMEOUT_MS, () => { req.destroy(); resolve(null); });
    req.on('error', e => { console.warn('[AutoGen] Ollama error:', e.message); resolve(null); });
    req.write(body); req.end();
  });
}

// SD生成本体（直列キュー内から呼ぶ）
function _autogenGenerateOne(params) {
  return new Promise((resolve) => {
    const fullPositive = params.positive + (_autogenFixedPositive ? ', ' + _autogenFixedPositive : '');
    const fullNegative = _autogenFixedNegative || params.negative || SD_NEGATIVE;
    const sdBody = JSON.stringify({
      prompt: fullPositive,
      negative_prompt: fullNegative,
      width: params.width, height: params.height,
      steps: params.steps, cfg_scale: params.cfgScale,
      sampler_name: params.sampler, scheduler: 'Automatic',
      batch_size: 1, n_iter: 1, seed: -1,
    });
    const opts = {
      hostname: '127.0.0.1', port: 7860, path: '/sdapi/v1/txt2img', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(sdBody) },
    };
    const sdReq = http.request(opts, sdRes => {
      const chunks = [];
      sdRes.on('data', c => chunks.push(c));
      sdRes.on('end', () => {
        try {
          const result = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          if (result.detail || !result.images?.[0]) {
            console.warn('[AutoGen] SD error:', result.detail || '画像なし');
            _autogenErrors++;
          } else {
            const b64 = result.images[0];
            const today = new Date().toISOString().slice(0, 10);
            const outDir = path.join(AUTOGEN_OUTPUT_BASE, today);
            if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
            const ts   = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            const slug = params.positive.slice(0, 40).replace(/[^a-zA-Z0-9 _-]/g, '').trim().replace(/\s+/g, '_') || 'autogen';
            fs.writeFileSync(path.join(outDir, `${ts}_${slug}.png`), Buffer.from(b64, 'base64'));
            _autogenProcessed++;
            _autogenSinceLastPrompt++;
            console.log(`[AutoGen] 保存完了 (${_autogenProcessed}枚, 今回プロンプト${_autogenSinceLastPrompt}枚目)`);
          }
        } catch (e) {
          console.warn('[AutoGen] 解析失敗:', e.message);
          _autogenErrors++;
        }
        resolve();
      });
    });
    sdReq.setTimeout(120000, () => { sdReq.destroy(); console.warn('[AutoGen] SDタイムアウト'); _autogenErrors++; resolve(); });
    sdReq.on('error', e => { console.warn('[AutoGen] SDエラー:', e.message); _autogenErrors++; resolve(); });
    sdReq.write(sdBody); sdReq.end();
  });
}

// 開始時にフォルダ内全画像を一括処理（直列キュー）
function _startAutogenBatch() {
  if (_autogenRunning) return;
  if (!fs.existsSync(AUTOGEN_SOURCE_DIR)) fs.mkdirSync(AUTOGEN_SOURCE_DIR, { recursive: true });

  const files = fs.readdirSync(AUTOGEN_SOURCE_DIR)
    .filter(f => /\.(png|jpe?g|webp)$/i.test(f))
    .map(f => path.join(AUTOGEN_SOURCE_DIR, f));

  if (files.length === 0) {
    console.log('[AutoGen] ソースフォルダに対象ファイルなし');
    return;
  }

  // 全ファイルのプロンプトを事前に収集（Ollamaへの参照リストとして使う）
  const allPrompts = [];
  let refParams = null;
  for (const fp of files) {
    const info = readSdInfo(fp);
    if (!info) continue;
    const p = parseSdParameters(info);
    if (p.positive) allPrompts.push(p.positive);
    if (!refParams) refParams = p;
  }

  if (allPrompts.length === 0) {
    console.warn('[AutoGen] 有効なプロンプトなし（PNG info 未記録の画像のみ）');
    return;
  }

  const genCount = _autogenCount > 0 ? _autogenCount : files.length;

  _autogenRunning          = true;
  _autogenStopping         = false;
  _autogenProcessed        = 0;
  _autogenErrors           = 0;
  _autogenTotal            = genCount;
  _autogenCurrent          = null;
  _autogenCurrentPrompt    = null;
  _autogenCurrentRefParams = refParams;
  _autogenSinceLastPrompt  = _autogenPromptInterval; // 1枚目からOllama呼ぶ

  console.log(`[AutoGen] バッチ開始: ${genCount}枚生成 / ソース${files.length}ファイル / ${allPrompts.length}プロンプト収集済`);

  for (let i = 0; i < genCount; i++) {
    _sdQueue = _sdQueue.then(async () => {
      if (_autogenStopping) return;
      _autogenCurrent = `${i + 1}/${genCount}`;

      try {
        // N枚ごと or 初回: Ollamaでプロンプト生成（直列 — SDキューの中で実行）
        if (_autogenCurrentPrompt === null || _autogenSinceLastPrompt >= _autogenPromptInterval) {
          console.log(`[AutoGen] Ollamaプロンプト生成中... (${allPrompts.length}件参照, model=${_autogenOllamaModel})`);
          const newPrompt = await _autogenAskOllama(allPrompts);
          if (newPrompt) {
            _autogenCurrentPrompt   = newPrompt;
            _autogenLastOllamaPrompt = newPrompt;
            _autogenSinceLastPrompt  = 0;
            console.log(`[AutoGen] 新プロンプト: "${newPrompt.slice(0, 80)}..."`);
          } else {
            console.warn('[AutoGen] Ollama失敗 → 元プロンプトで続行');
            if (!_autogenCurrentPrompt) _autogenCurrentPrompt = allPrompts[0];
          }
        }

        const ref = _autogenCurrentRefParams || {};
        await _autogenGenerateOne({
          positive: _autogenCurrentPrompt,
          negative: ref.negative || '',
          steps:    ref.steps    || 20,
          cfgScale: ref.cfgScale || 7,
          sampler:  ref.sampler  || 'Euler a',
          width:    _autogenWidth  || ref.width  || 512,
          height:   _autogenHeight || ref.height || 512,
        });
      } catch (e) {
        console.warn('[AutoGen] 処理エラー:', e.message);
        _autogenErrors++;
      }
      _autogenCurrent = null;
    });
  }

  // 全処理完了 or 停止後にフラグリセット
  _sdQueue = _sdQueue.then(() => {
    _autogenRunning  = false;
    _autogenStopping = false;
    console.log(`[AutoGen] 完了: 生成${_autogenProcessed}枚 / エラー${_autogenErrors}件`);
  });
}

function _stopAutogenBatch() {
  if (!_autogenRunning) return;
  _autogenStopping = true;
  console.log('[AutoGen] 停止要求 → 現在の生成完了後に停止');
}

app.post('/api/autogen/start', (req, res) => {
  if (_autogenRunning) return res.json({ ok: false, message: '既に実行中' });
  _startAutogenBatch();
  const total = _autogenTotal;
  res.json({ ok: total > 0, message: total > 0 ? `処理開始: ${total}件` : 'ファイルなし', total });
});

app.post('/api/autogen/stop', (req, res) => {
  _stopAutogenBatch();
  res.json({ ok: true, message: '停止要求を送信' });
});

app.post('/api/autogen/config', (req, res) => {
  const { model, interval, numCtx, fixedPositive, fixedNegative, width, height, count } = req.body || {};
  if (model         != null) _autogenOllamaModel   = model;
  if (numCtx        != null) _autogenNumCtx         = (numCtx === '' || numCtx === -1) ? -1 : Math.max(512, parseInt(numCtx) || -1);
  if (fixedPositive != null) _autogenFixedPositive  = fixedPositive;
  if (fixedNegative != null) _autogenFixedNegative  = fixedNegative;
  if (width         != null) _autogenWidth           = Math.max(0, parseInt(width)  || 0);
  if (height        != null) _autogenHeight          = Math.max(0, parseInt(height) || 0);
  if (count         != null) _autogenCount           = Math.max(0, parseInt(count)  || 0);
  if (interval      != null) {
    _autogenPromptInterval  = Math.max(1, parseInt(interval) || 5);
    _autogenSinceLastPrompt = _autogenPromptInterval;
  }
  const cfg = loadServerConfig();
  cfg.autogenOllamaModel    = _autogenOllamaModel;
  cfg.autogenNumCtx         = _autogenNumCtx;
  cfg.autogenPromptInterval = _autogenPromptInterval;
  cfg.autogenFixedPositive  = _autogenFixedPositive;
  cfg.autogenFixedNegative  = _autogenFixedNegative;
  cfg.autogenWidth          = _autogenWidth;
  cfg.autogenHeight         = _autogenHeight;
  cfg.autogenCount          = _autogenCount;
  saveServerConfig(cfg);
  res.json({ ok: true, model: _autogenOllamaModel, interval: _autogenPromptInterval,
             numCtx: _autogenNumCtx, fixedPositive: _autogenFixedPositive, fixedNegative: _autogenFixedNegative,
             width: _autogenWidth, height: _autogenHeight, count: _autogenCount });
});

app.get('/api/autogen/status', (req, res) => {
  res.json({
    running:          _autogenRunning,
    stopping:         _autogenStopping,
    processed:        _autogenProcessed,
    total:            _autogenTotal,
    errors:           _autogenErrors,
    current:          _autogenCurrent,
    lastOllamaPrompt: _autogenLastOllamaPrompt,
    sinceLastPrompt:  _autogenSinceLastPrompt,
    promptInterval:   _autogenPromptInterval,
    model:            _autogenOllamaModel,
    numCtx:           _autogenNumCtx,
    fixedPositive:    _autogenFixedPositive,
    fixedNegative:    _autogenFixedNegative,
    width:            _autogenWidth,
    height:           _autogenHeight,
    count:            _autogenCount,
    sourceDir:        AUTOGEN_SOURCE_DIR,
    outputBase:       AUTOGEN_OUTPUT_BASE,
  });
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

// AutoGen 設定を server-config.json から復元
if (_initSrvCfg.autogenOllamaModel    != null) _autogenOllamaModel    = _initSrvCfg.autogenOllamaModel;
if (_initSrvCfg.autogenNumCtx         != null) _autogenNumCtx          = _initSrvCfg.autogenNumCtx;
if (_initSrvCfg.autogenPromptInterval != null) _autogenPromptInterval  = _initSrvCfg.autogenPromptInterval;
if (_initSrvCfg.autogenFixedPositive  != null) _autogenFixedPositive   = _initSrvCfg.autogenFixedPositive;
if (_initSrvCfg.autogenFixedNegative  != null) _autogenFixedNegative   = _initSrvCfg.autogenFixedNegative;
if (_initSrvCfg.autogenWidth          != null) _autogenWidth            = _initSrvCfg.autogenWidth;
if (_initSrvCfg.autogenHeight         != null) _autogenHeight           = _initSrvCfg.autogenHeight;
if (_initSrvCfg.autogenCount          != null) _autogenCount            = _initSrvCfg.autogenCount;
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

app.get('/api/ollama-models', (req, res) => {
  const opts = { hostname: ollamaHost, port: OLLAMA_PORT, path: '/api/tags', method: 'GET' };
  const r = http.request(opts, r2 => {
    let raw = ''; r2.on('data', c => raw += c);
    r2.on('end', () => {
      try {
        const json = JSON.parse(raw);
        const models = (json.models || []).map(m => m.name).sort();
        res.json({ models });
      } catch (e) { res.status(500).json({ models: [], error: e.message }); }
    });
  });
  r.setTimeout(5000, () => { r.destroy(); res.status(504).json({ models: [], error: 'timeout' }); });
  r.on('error', e => res.status(500).json({ models: [], error: e.message }));
  r.end();
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
  const { prompt, messages, model = 'gemma3:12b', system, keepAlive, numCtx } = req.body || {};
  const systemText = system || 'あなたは配信のコメントに返答するアシスタントです。必ず50文字以内の日本語で返答してください。';

  function buildOptions(ctxOverride) {
    const o = buildOllamaOptions() || {};
    if (ctxOverride != null) o.num_ctx = ctxOverride;
    return Object.keys(o).length ? o : null;
  }

  if (messages) {
    // /api/chat — 会話履歴あり
    const chatMessages = [{ role: 'system', content: systemText }, ...messages];
    const ollamaBody = { model, messages: chatMessages, stream: false };
    if (keepAlive !== undefined) ollamaBody.keep_alive = keepAlive;
    const _opts1 = buildOptions(numCtx); if (_opts1) ollamaBody.options = _opts1;
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
    const _opts2 = buildOptions(numCtx); if (_opts2) ollamaBody2.options = _opts2;
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

// タイマン攻撃技生成（Ollama）
app.post('/api/taiman-skills', (req, res) => {
  const { name, level = 1, atk = 1, model = 'gemma3:12b' } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name is required' });
  const prompt = `キャラ「${name}」（Lv.${level}、ATK${atk}）の必殺技名を4つ、2〜6文字で改行区切りだけで答えてください。余分な文字・説明・番号は不要。`;
  const ollamaBody = { model, prompt, system: 'あなたはゲームキャラクターの必殺技名を考えるアシスタントです。', stream: false };
  const _opts = buildOllamaOptions(); if (_opts) ollamaBody.options = _opts;
  const body = JSON.stringify(ollamaBody);
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
        const text = (json.response || '').trim();
        const skills = text.split('\n')
          .map(s => s.replace(/^[\d.\-\s・●▶→:：]+/, '').trim())
          .filter(s => s.length >= 1 && s.length <= 10)
          .slice(0, 4);
        while (skills.length < 4) skills.push('攻撃');
        if (!res.headersSent) res.json({ skills });
      } catch (e) { if (!res.headersSent) res.status(500).json({ error: e.message }); }
    });
  });
  req2.on('error', e => { if (!res.headersSent) res.status(500).json({ error: e.message }); });
  req2.setTimeout(OLLAMA_TIMEOUT_MS, () => { req2.destroy(); if (!res.headersSent) res.status(504).json({ error: 'タイムアウト' }); });
  req2.write(body);
  req2.end();
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
const _charaKindCache = new Map(); // filename → { mime, animated } | null

// キャッシュキーは "ファイル名:mtime"。同じファイルの古い世代を捨てて増え続けないようにする
function _dropOldGenerations(map, cacheKey) {
  const prefix = cacheKey.slice(0, cacheKey.lastIndexOf(':') + 1);
  for (const k of map.keys()) if (k !== cacheKey && k.startsWith(prefix)) map.delete(k);
}

// APNG は IDAT より前に acTL チャンクを持つ
function _pngHasActl(buf) {
  let off = 8;
  while (off + 8 <= buf.length) {
    const len  = buf.readUInt32BE(off);
    const type = buf.toString('latin1', off + 4, off + 8);
    if (type === 'acTL') return true;
    if (type === 'IDAT' || type === 'IEND') return false;
    off += 12 + len;
  }
  return false;
}

// 画像種別をマジックバイトで判定する（拡張子は信用しない）。
// public/chara には拡張子 .png でも中身が GIF のファイルが実在するため。
function _sniffImageKind(buf) {
  if (buf.length >= 6  && buf.toString('latin1', 0, 3) === 'GIF')
    return { mime: 'image/gif',  animated: true };
  if (buf.length >= 8  && buf.toString('hex', 0, 8) === '89504e470d0a1a0a')
    return { mime: 'image/png',  animated: _pngHasActl(buf) };
  if (buf.length >= 16 && buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WEBP')
    return { mime: 'image/webp', animated: buf.toString('latin1', 12, Math.min(buf.length, 4096)).includes('ANIM') };
  if (buf.length >= 3  && buf.toString('hex', 0, 3) === 'ffd8ff')
    return { mime: 'image/jpeg', animated: false };
  return null; // 判定不能（SVG等）は拡張子ベースにフォールバック
}

// 先頭64KBだけ読んで種別判定（結果は "ファイル名:mtime" でキャッシュ）
function _charaImageKind(cacheKey, filepath) {
  if (_charaKindCache.has(cacheKey)) return _charaKindCache.get(cacheKey);
  let kind = null;
  let fd   = null;
  try {
    fd = fs.openSync(filepath, 'r');
    const buf = Buffer.alloc(65536);
    const n   = fs.readSync(fd, buf, 0, 65536, 0);
    kind = _sniffImageKind(buf.subarray(0, n));
  } catch {} finally {
    if (fd !== null) { try { fs.closeSync(fd); } catch {} }
  }
  _charaKindCache.set(cacheKey, kind);
  return kind;
}

app.get('/chara-s/:filename', async (req, res) => {
  const filename = req.params.filename;
  if (/[/\\]/.test(filename)) return res.status(400).end();

  const filepath = path.join(_charaDir, filename);
  if (!fs.existsSync(filepath)) return res.status(404).end();

  const ext  = path.extname(filename).toLowerCase();
  // 画像を差し替えたら作り直すよう、キャッシュキーに更新時刻を含める
  let mtime = 0;
  try { mtime = fs.statSync(filepath).mtimeMs; } catch {}
  const cacheKey = filename + ":" + mtime;
  // 差し替え前の世代をここで破棄しておく（メモリキャッシュが増え続けないように）
  _dropOldGenerations(_charaSCache,    cacheKey);
  _dropOldGenerations(_charaKindCache, cacheKey);
  const kind = _charaImageKind(cacheKey, filepath);

  // SVGはリサイズ不要のままそのまま返す
  if (ext === '.svg') return res.sendFile(filepath);

  // アニメ画像（GIF / APNG / アニメWebP）はリサイズすると1コマ目の静止画になるため原本を返す。
  // sharp/libvips は GIF の1フレーム目しか読まず、APNG のフレームは読めない。
  if (kind && kind.animated) {
    // 中身と拡張子が食い違うファイル用に Content-Type を明示（sendFile は設定済みなら上書きしない）
    res.setHeader('Content-Type', kind.mime);
    return res.sendFile(filepath);
  }

  if (_charaSCache.has(cacheKey)) {
    const { buf, ct } = _charaSCache.get(cacheKey);
    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'no-cache'); // ETagで毎回検証（差し替えが即反映される）
    return res.send(buf);
  }

  try {
    const meta = await sharp(filepath).metadata();
    const halfW = Math.max(1, Math.round(meta.width / 2));
    const s = sharp(filepath).resize(halfW);

    // 出力形式は中身の判定を優先し、判定不能なときだけ拡張子で決める
    const mime = kind ? kind.mime : null;
    let buf, ct;
    if (mime === 'image/png' || (!mime && ext === '.png')) {
      buf = await s.png().toBuffer(); ct = 'image/png';
    } else if (mime === 'image/jpeg' || (!mime && (ext === '.jpg' || ext === '.jpeg'))) {
      buf = await s.jpeg({ quality: 85 }).toBuffer(); ct = 'image/jpeg';
    } else if (mime === 'image/webp' || (!mime && ext === '.webp')) {
      buf = await s.webp({ quality: 85 }).toBuffer(); ct = 'image/webp';
    } else {
      return res.sendFile(filepath);
    }

    _charaSCache.set(cacheKey, { buf, ct });
    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'no-cache'); // ETagで毎回検証（差し替えが即反映される）
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

// ── キャラ画像自動取り込み（GitHub API ポーリング） ──────────────────
async function _pollCharaUploads() {
  const { owner, repo, token } = _ghUploadConfig();
  if (!owner || !repo || !token) return;
  try {
    const headers = { 'User-Agent': 'kukuCome-Server', 'Accept': 'application/vnd.github.v3+json', 'Authorization': `token ${token}` };
    const listRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/`, { headers });
    if (!listRes.ok) return;
    const remoteFiles = await listRes.json();
    if (!Array.isArray(remoteFiles)) return;

    const charaDir = path.join(__dirname, 'public', 'chara');
    if (!fs.existsSync(charaDir)) fs.mkdirSync(charaDir, { recursive: true });
    const existing = new Set(fs.readdirSync(charaDir).filter(f => /\.(png|jpe?g|webp|gif)$/i.test(f)));

    const newFiles = remoteFiles.filter(f => f.type === 'file' && /\.(png|jpe?g|webp|gif)$/i.test(f.name) && !existing.has(f.name));
    if (!newFiles.length) return;

    const ciPath = path.join(__dirname, 'data', 'charImages.json');
    const csPath = path.join(__dirname, 'data', 'charImageSizes.json');
    const ci = JSON.parse(fs.readFileSync(ciPath, 'utf8'));
    const cs = JSON.parse(fs.readFileSync(csPath, 'utf8'));
    let nextKey = Math.max(0, ...Object.keys(ci).map(Number)) + 1;

    const puruUpdates = [];
    for (const f of newFiles) {
      try {
        const fileRes = await fetch(f.download_url, { headers: { 'User-Agent': 'kukuCome-Server', 'Authorization': `token ${token}` } });
        if (!fileRes.ok) { console.warn(`[CHARA] DL失敗: ${f.name}`); continue; }
        const buf = Buffer.from(await fileRes.arrayBuffer());
        fs.writeFileSync(path.join(charaDir, f.name), buf);

        let ratio = 1.0;
        try { const m = await sharp(buf).metadata(); if (m.width && m.height) ratio = parseFloat((m.width / m.height).toFixed(3)); } catch {}

        ci[String(nextKey)] = f.name;
        cs[f.name] = ratio;
        console.log(`[CHARA] 追加 #${nextKey}: ${f.name} (ratio:${ratio})`);
        nextKey++;

        // ぷるぷる設定サイドカー (_puru/{f.name}.json) を確認
        try {
          const puruRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/_puru/${encodeURIComponent(f.name)}.json`, { headers });
          if (puruRes.ok) {
            const puruMeta = await puruRes.json();
            const puruCfg = JSON.parse(Buffer.from(puruMeta.content.replace(/\n/g, ''), 'base64').toString('utf8'));
            const settingsPath = path.join(__dirname, 'data', 'settings.json');
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8') || '{}');
            let purupuruConfig = {};
            try { purupuruConfig = JSON.parse(settings.purupuruConfig || '{}'); } catch {}
            purupuruConfig[f.name] = puruCfg;
            settings.purupuruConfig = JSON.stringify(purupuruConfig);
            fs.writeFileSync(settingsPath, JSON.stringify(settings));
            puruUpdates.push({ imgFile: f.name, config: puruCfg });
            console.log(`[CHARA] ぷるぷる設定読み込み: ${f.name}`);
          }
        } catch (e) { /* ぷるぷる設定は任意 */ }
      } catch (e) { console.warn(`[CHARA] ${f.name} エラー:`, e.message); }
    }

    fs.writeFileSync(ciPath, JSON.stringify(ci));
    fs.writeFileSync(csPath, JSON.stringify(cs));

    const note = JSON.stringify({ type: 'charaReload' });
    wsClients.main.forEach(c => { if (c.readyState === 1) c.send(note); });
    wsClients.admin.forEach(c => { if (c.readyState === 1) c.send(note); });

    for (const { imgFile, config } of puruUpdates) {
      const pNote = JSON.stringify({ type: 'purupuruConfig', imgFile, config });
      wsClients.main.forEach(c => { if (c.readyState === 1) c.send(pNote); });
      wsClients.admin.forEach(c => { if (c.readyState === 1) c.send(pNote); });
    }

    console.log(`[CHARA] ${newFiles.length}件取り込み完了${puruUpdates.length ? ` (ぷるぷる設定 ${puruUpdates.length}件)` : ''}`);
  } catch (e) { console.warn('[CHARA] ポーリングエラー:', e.message); }
}

{
  const _cfg = _ghUploadConfig();
  if (_cfg.owner && _cfg.repo && _cfg.token) {
    setTimeout(_pollCharaUploads, 5000);
    setInterval(_pollCharaUploads, 60 * 1000);
    console.log(`[CHARA] 自動取り込みポーリング有効: ${_cfg.owner}/${_cfg.repo}`);
  }
}

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
