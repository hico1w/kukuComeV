const express          = require('express');
const https            = require('https');
const http             = require('http');
const path             = require('path');
const fs               = require('fs');
const net              = require('net');
const { spawn, exec }  = require('child_process');
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
}

const DATA = p => path.join(__dirname, 'data', p);
makeDataEndpoints('/api/char-images',  DATA('charImages.json'));
makeDataEndpoints('/api/char-aliases', DATA('charAliases.json'));
makeDataEndpoints('/api/settings',     DATA('settings.json'));

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
const SD_IDX = { PROMPT:1, NEGATIVE:2, BATCH_COUNT:4, BATCH_SIZE:5, CFG:6, HEIGHT:7, WIDTH:8, HIRES_FIX:9, OVERRIDE:22, SCRIPT:23, STEPS:24, SAMPLER:25 };
const SD_NEGATIVE = '(worst quality:2),(low quality:2),(normal quality:2),lowres,extra fingers,fewer fingers,monochrome,grayscale,text,watermark,logo,';

app.post('/api/sd-generate', async (req, res) => {
  const { prompt, charName, width, height, steps, cfgScale, sampler, positiveSuffix, negative } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });

  let fn_index, defaults;
  try {
    ({ fn_index, defaults } = JSON.parse(fs.readFileSync(SD_DEFAULTS_PATH, 'utf-8')));
  } catch (e) {
    return res.status(500).json({ error: 'sd_defaults.json 読み込み失敗: ' + e.message });
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

  const data = [...defaults];
  data[SD_IDX.PROMPT]      = translatedPrompt + (positiveSuffix ? ', ' + positiveSuffix : '');
  data[SD_IDX.NEGATIVE]    = negative || SD_NEGATIVE;
  data[SD_IDX.WIDTH]       = parseInt(width)  || 1600;
  data[SD_IDX.HEIGHT]      = parseInt(height) || 1000;
  data[SD_IDX.STEPS]       = parseInt(steps)  || 20;
  data[SD_IDX.CFG]         = parseFloat(cfgScale) || 3;
  data[SD_IDX.SAMPLER]     = sampler || 'Euler a';
  data[SD_IDX.BATCH_COUNT] = 1;
  data[SD_IDX.BATCH_SIZE]  = 1;
  data[SD_IDX.HIRES_FIX]   = false;
  data[SD_IDX.OVERRIDE]    = [];
  data[SD_IDX.SCRIPT]      = 'None';

  const sessionHash = Math.random().toString(36).slice(2, 12);
  console.log(`[SD] generating: "${prompt}" session=${sessionHash}`);

  const ws = new ws_lib('ws://127.0.0.1:7860/queue/join');

  const timeout = setTimeout(() => {
    ws.close();
    if (!res.headersSent) res.status(500).json({ error: 'SD generation timeout' });
  }, 120000);

  ws.on('message', raw => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    console.log('[SD WS]', msg.msg, msg.rank != null ? `rank=${msg.rank}` : '');

    if (msg.msg === 'send_hash') {
      ws.send(JSON.stringify({ fn_index, session_hash: sessionHash }));
    } else if (msg.msg === 'send_data') {
      ws.send(JSON.stringify({ fn_index, data, session_hash: sessionHash }));
    } else if (msg.msg === 'process_completed') {
      clearTimeout(timeout);
      ws.close();
      const gallery = msg.output?.data?.[0];
      if (!Array.isArray(gallery) || gallery.length === 0) {
        console.error('[SD] empty gallery:', JSON.stringify(msg.output).slice(0, 300));
        return res.status(500).json({ error: 'Empty gallery from SD' });
      }
      const imageInfo = gallery[gallery.length - 1];
      console.log('[SD] imageInfo keys:', Object.keys(imageInfo));

      if (imageInfo.data && imageInfo.data.startsWith('data:')) {
        sendToDiscord(imageInfo.data, prompt, translatedPrompt, charName).catch(() => {});
        return res.json({ image: imageInfo.data, translatedPrompt });
      }
      if (imageInfo.name) {
        const fileUrl = `http://127.0.0.1:7860/file=${imageInfo.name.split('?')[0]}`;
        console.log('[SD] downloading:', fileUrl);
        http.get(fileUrl, imgRes => {
          const chunks = [];
          imgRes.on('data', c => chunks.push(c));
          imgRes.on('end', () => {
            const b64 = Buffer.concat(chunks).toString('base64');
            console.log('[SD] success, b64 length:', b64.length);
            const imageDataUrl = 'data:image/png;base64,' + b64;
            sendToDiscord(imageDataUrl, prompt, translatedPrompt, charName).catch(() => {});
            res.json({ image: imageDataUrl, translatedPrompt });
          });
        }).on('error', err => {
          if (!res.headersSent) res.status(500).json({ error: '画像ダウンロード失敗: ' + err.message });
        });
        return;
      }
      res.status(500).json({ error: '画像フォーマット不明: ' + JSON.stringify(imageInfo).slice(0, 100) });
    } else if (msg.msg === 'process_errored') {
      clearTimeout(timeout);
      ws.close();
      console.error('[SD] process_errored:', JSON.stringify(msg).slice(0, 300));
      if (!res.headersSent) res.status(500).json({ error: 'SD process error' });
    }
  });

  ws.on('error', err => {
    clearTimeout(timeout);
    console.error('[SD WS error]', err.message);
    if (!res.headersSent) res.status(500).json({ error: err.message });
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
let ollamaHost = _initSrvCfg.ollamaHost || '127.0.0.1';
const OLLAMA_PORT = 11434;

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
  const { prompt, messages, model = 'gemma3:12b', system } = req.body || {};
  const systemText = system || 'あなたは配信のコメントに返答するアシスタントです。必ず50文字以内の日本語で返答してください。';

  if (messages) {
    // /api/chat — 会話履歴あり
    const chatMessages = [{ role: 'system', content: systemText }, ...messages];
    const body = JSON.stringify({ model, messages: chatMessages, stream: false });
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
          if (!reply) return res.status(500).json({ error: 'No response from Ollama' });
          res.json({ reply });
        } catch (e) { res.status(500).json({ error: e.message }); }
      });
    });
    req2.on('error', e => res.status(500).json({ error: e.message }));
    req2.write(body);
    req2.end();
  } else {
    // /api/generate — 後方互換（単発）
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });
    const body = JSON.stringify({ model, prompt, system: systemText, stream: false });
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
          if (!json.response) return res.status(500).json({ error: 'No response from Ollama' });
          res.json({ reply: json.response.trim() });
        } catch (e) { res.status(500).json({ error: e.message }); }
      });
    });
    req2.on('error', e => res.status(500).json({ error: e.message }));
    req2.write(body);
    req2.end();
  }
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
  const body = JSON.stringify({ model, messages: chatMessages, stream: false });
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
