// キーワードサンプル画像の自動生成（管理画面「🖼 キーワードサンプル自動生成」）
//
// サンプル画像（chara/keyword-samples/<キーワード>.webp）がまだ無い登録キーワードについて、
// 配信の画像生成と同じ SD 設定（幅・高さ・Steps・CFG・Sampler・常時ポジティブ・ネガティブ）で画像を作り、
// WebP（quality 85）にして保存する。
// プロンプトは「付与ワード, 常時ポジティブ, キーワードのポジティブ」。付与ワードは管理画面で自由に入れる語で、
// 配信でいうコメント本文の位置に入る（＝「<付与ワード> <キーワード>」とコメントしたときと同じ並び）。
// 1枚ずつ SD の共有キューに積むので、配信中の画像生成コマンドも間に割り込める。
// キーワードごとの保存枚数は generated.json に書き、ルートの index.html（マニュアル）がそれを見て画像を並べる。
// 手動で置いた PNG / JPG を WebP に変換する機能もここ（convertImages）。
const fs    = require('fs');
const path  = require('path');
const http  = require('http');
const sharp = require('sharp');

const MAX_COUNT  = 10;  // 1キーワードあたりの上限枚数
const MAX_EXTRA  = 2000; // 付与ワードの最大文字数
// 手動で置いて WebP に変換する画像の形式。同じ名前で複数あるときは前にある形式を使う
const SOURCE_EXTS = ['.png', '.jpg', '.jpeg'];
const SOURCE_RE   = /\.(png|jpe?g)$/i;
const RECENT_MAX = 12;  // 管理画面に出す直近の結果の件数

// index.html のキーワードサンプル表示と同じ規則でファイル名にする
function safeName(keyword) {
  return keyword.replace(/[<>:"\/\\|?*]/g, '_').slice(0, 60);
}
// 1枚目は <名前>.webp、2枚目以降は <名前>_2.webp, <名前>_3.webp …
function fileNameFor(keyword, n) {
  return safeName(keyword) + (n > 1 ? '_' + n : '') + '.webp';
}
function clampCount(v) {
  return Math.min(MAX_COUNT, Math.max(1, parseInt(v) || 1));
}
// 改行・連続空白は1つの空白に、前後の空白とカンマは落とす
function cleanExtra(v) {
  return String(v == null ? '' : v).replace(/\s+/g, ' ').replace(/^[\s,]+|[\s,]+$/g, '').slice(0, MAX_EXTRA);
}

function register(app, opts) {
  const {
    dir,                 // 保存先（chara/keyword-samples）
    readSettings,        // () => data/settings.json の中身
    enqueue,             // fn => SD の共有キューに積む
    loadConfig,          // () => server-config.json の中身（枚数の保存先）
    saveConfig,
    defaultNegative = '',
    sdHost    = '127.0.0.1',
    sdPort    = 7860,
    timeoutMs = 180000,
    log       = console,
  } = opts;
  const manifestPath = path.join(dir, 'generated.json');

  const state = { running: false, stopping: false, total: 0, done: 0, errors: 0, current: null, recent: [] };
  let converting = false; // PNG / JPG → WebP 変換中

  // server.js の読み込み途中で呼ばれても困らないよう、枚数の設定は初回に使うときに読む
  let count = null;
  function getCount() {
    if (count === null) {
      try { count = clampCount((loadConfig() || {}).kwSampleCount); } catch { count = 1; }
    }
    return count;
  }
  let extra = null; // 付与ワード（こちらも初回に使うときに読む）
  function getExtra() {
    if (extra === null) {
      try { extra = cleanExtra((loadConfig() || {}).kwSampleExtraPositive); } catch { extra = ''; }
    }
    return extra;
  }
  function saveToConfig(patch) {
    try { const c = loadConfig() || {}; Object.assign(c, patch); saveConfig(c); } catch (e) { log.warn('[KwSample] 設定の保存に失敗:', e.message); }
  }
  function setCount(v) {
    count = clampCount(v);
    saveToConfig({ kwSampleCount: count });
    return count;
  }
  function setExtra(v) {
    extra = cleanExtra(v);
    saveToConfig({ kwSampleExtraPositive: extra });
    return extra;
  }

  // 登録キーワード（組み込みの ドット / リアル / もいちゃん ＋ sdKeywordPrompts）
  function keywordList(s) {
    let list = s.sdKeywordPrompts;
    if (typeof list === 'string') { try { list = JSON.parse(list); } catch { list = []; } }
    const all = [
      { keyword: 'ドット',     positive: s.sdDotPositiveSuffix },
      { keyword: 'リアル',     positive: s.sdRealPositiveSuffix },
      { keyword: 'もいちゃん', positive: s.sdMoiPositiveSuffix },
      ...(Array.isArray(list) ? list : []),
    ];
    const seen = new Set();
    const out = [];
    for (const k of all) {
      const keyword  = String((k && k.keyword)  || '').trim();
      const positive = String((k && k.positive) || '').trim();
      if (!keyword || !positive) continue;
      const name = safeName(keyword);
      if (seen.has(name)) continue; // 同じファイル名になるものは先に出てきた方だけ
      seen.add(name);
      out.push({ keyword, positive });
    }
    return out;
  }

  // サンプル画像（1枚目）がまだ無いキーワード。PNG / JPG を置いてあるもの（変換待ち）も生成しない
  function targets(s) {
    return keywordList(s).filter(k =>
      !fs.existsSync(path.join(dir, fileNameFor(k.keyword, 1))) &&
      !SOURCE_EXTS.some(ext => fs.existsSync(path.join(dir, safeName(k.keyword) + ext))));
  }

  // 保存先に置かれている変換前の画像（手動で置いた PNG / JPG）
  function listSources() {
    try { return fs.readdirSync(dir).filter(f => SOURCE_RE.test(f)).sort(); } catch { return []; }
  }

  // 配信の画像生成（app-11 の _sdReadSettings）と同じ既定値
  function genParams(s) {
    return {
      width:    parseInt(s.sdWidth)      || 1600,
      height:   parseInt(s.sdHeight)     || 1000,
      steps:    parseInt(s.sdSteps)      || 20,
      cfgScale: parseFloat(s.sdCfgScale) || 3,
      sampler:  s.sdSampler || 'Euler a',
      suffix:   s.sdPositiveSuffix != null ? String(s.sdPositiveSuffix) : 'masterpiece, best quality',
      negative: s.sdNegative || defaultNegative,
    };
  }

  function txt2img(body) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(body);
      const req = http.request({
        hostname: sdHost, port: sdPort, path: '/sdapi/v1/txt2img', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
      }, res => {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          try {
            const r = JSON.parse(Buffer.concat(chunks).toString('utf8'));
            if (r.detail) return reject(new Error('SD: ' + (typeof r.detail === 'string' ? r.detail : JSON.stringify(r.detail)).slice(0, 120)));
            if (!r.images || !r.images[0]) return reject(new Error('SD: 画像なし'));
            resolve(Buffer.from(r.images[0], 'base64'));
          } catch (e) { reject(new Error('SD の応答を読めません: ' + e.message)); }
        });
      });
      req.setTimeout(timeoutMs, () => {
        req.destroy(new Error(`SD タイムアウト（${Math.round(timeoutMs / 1000)}秒）`));
        // 生成を止めて GPU を空ける
        const stop = http.request({ hostname: sdHost, port: sdPort, path: '/sdapi/v1/interrupt', method: 'POST', headers: { 'Content-Length': 0 } });
        stop.on('error', () => {});
        stop.end();
      });
      req.on('error', reject);
      req.end(data);
    });
  }

  function readManifest() {
    try {
      const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      return m && typeof m === 'object' && !Array.isArray(m) ? m : {};
    } catch { return {}; }
  }
  function writeManifest(m) {
    const sorted = {};
    Object.keys(m).sort().forEach(k => { sorted[k] = m[k]; });
    fs.writeFileSync(manifestPath, JSON.stringify(sorted, null, 1) + '\n');
  }

  function pushRecent(entry) {
    state.recent.unshift({ ...entry, at: new Date().toISOString() });
    state.recent.length = Math.min(state.recent.length, RECENT_MAX);
  }

  function start(reqCount, reqExtra) {
    if (state.running) return { ok: false, message: 'すでに生成中です' };
    const perKw = reqCount != null ? setCount(reqCount) : getCount();
    // 入力してすぐ開始を押したときも反映されるよう、開始時に送られてきた付与ワードを優先する
    const ex    = reqExtra != null ? setExtra(reqExtra) : getExtra();
    const s = readSettings();
    const list = targets(s);
    if (!list.length) return { ok: false, message: 'サンプル画像が無いキーワードはありません' };
    const p = genParams(s);
    fs.mkdirSync(dir, { recursive: true });

    Object.assign(state, { running: true, stopping: false, total: list.length * perKw, done: 0, errors: 0, current: null, recent: [] });
    log.log(`[KwSample] 開始: ${list.length}キーワード × ${perKw}枚 = ${state.total}枚（${p.width}x${p.height} steps:${p.steps}）`);

    const jobs = [];
    for (const k of list) for (let i = 0; i < perKw; i++) jobs.push({ k, i });
    const saved = new Map(); // キーワード → 保存できた枚数（失敗しても番号が飛ばないように数える）
    let idx = 0;

    // 1枚ぶんだけ積み、終わってから次を積む。
    // まとめて積むと、後から来た配信の画像生成コマンドが全部の後ろに並んでしまうため。
    const runNext = () => {
      if (state.stopping || idx >= jobs.length) {
        log.log(`[KwSample] ${state.stopping ? '停止' : '完了'}: 保存${state.done}枚 / 失敗${state.errors}件`);
        state.running  = false;
        state.stopping = false;
        state.current  = null;
        return;
      }
      const { k, i } = jobs[idx++];
      enqueue(async () => {
        state.current = `${k.keyword}（${i + 1}/${perKw}枚目）`;
        try {
          const png = await txt2img({
            prompt: [ex, p.suffix, k.positive].filter(Boolean).join(', '), // 配信と同じ並び（本文, 常時ポジティブ, キーワード）
            negative_prompt: p.negative,
            width: p.width, height: p.height,
            steps: p.steps, cfg_scale: p.cfgScale,
            sampler_name: p.sampler, scheduler: 'Automatic',
            batch_size: 1, n_iter: 1, seed: -1,
          });
          const n    = (saved.get(k.keyword) || 0) + 1;
          const file = fileNameFor(k.keyword, n);
          const webp = await sharp(png).webp({ quality: 85 }).toBuffer();
          const tmp  = path.join(dir, file + '.tmp');
          fs.writeFileSync(tmp, webp);
          fs.renameSync(tmp, path.join(dir, file));
          saved.set(k.keyword, n);
          const m = readManifest();
          m[k.keyword] = n;
          writeManifest(m);
          state.done++;
          pushRecent({ ok: true, keyword: k.keyword, file });
          log.log(`[KwSample] 保存: ${file}`);
        } catch (e) {
          state.errors++;
          pushRecent({ ok: false, keyword: k.keyword, message: e.message });
          log.warn(`[KwSample] 失敗: ${k.keyword}:`, e.message);
        } finally {
          state.current = null;
        }
        runNext();
      });
    };
    runNext();
    return { ok: true, total: state.total, keywords: list.length, count: perKw };
  }

  // 手動で置いた PNG / JPG を WebP（quality 85）に変換する。同じ名前の WebP があれば置き換え、変換できたら元の画像は消す。
  // 同じ名前で PNG と JPG が両方あるときは PNG（→ JPG → JPEG の順）を使い、ほかは消さずに残して skipped で知らせる。
  async function convertImages() {
    if (converting) return { ok: false, message: 'いま変換中です' };
    converting = true;
    try {
      const converted = [], failed = [], skipped = [];
      // 拡張子違いの同じ名前をまとめる
      const groups = new Map();
      for (const file of listSources()) {
        const key = file.replace(SOURCE_RE, '').toLowerCase();
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(file);
      }
      const rank = f => SOURCE_EXTS.indexOf(path.extname(f).toLowerCase());
      for (const files of groups.values()) {
        files.sort((a, b) => rank(a) - rank(b));
        const [file, ...rest] = files;
        for (const other of rest) skipped.push({ file: other, used: file });
        const webp = file.replace(SOURCE_RE, '.webp');
        const src  = path.join(dir, file);
        const dest = path.join(dir, webp);
        try {
          // パスのまま sharp に渡すとファイルを掴んだままになり、Windows で元の画像を消せなくなるので読み込んでから渡す
          const input = fs.readFileSync(src);
          const meta  = await sharp(input).metadata();
          // スマホで撮った JPG などは EXIF の向きで縦横を指定しているので、その向きに回してから保存する
          const turned = (meta.orientation || 1) >= 5;
          const width  = turned ? meta.height : meta.width;
          const height = turned ? meta.width : meta.height;
          const out    = await sharp(input).rotate().webp({ quality: 85 }).toBuffer();
          const check  = await sharp(out).metadata();
          if (check.width !== width || check.height !== height) throw new Error('変換後のサイズが元と違います');
          const replaced = fs.existsSync(dest);
          const tmp = dest + '.tmp';
          fs.writeFileSync(tmp, out);
          fs.renameSync(tmp, dest);
          const item = { file, webp, replaced, width, height };
          try { fs.unlinkSync(src); } catch (e) { item.kept = true; } // WebP はできている
          converted.push(item);
        } catch (e) {
          failed.push({ file, message: e.message });
        }
      }
      const keywords = syncManifest(converted.map(c => c.webp));
      log.log(`[KwSample] 画像→WebP: 変換${converted.length}枚（置き換え${converted.filter(c => c.replaced).length}） / 失敗${failed.length}件 / 残した${skipped.length}件`);
      return { ok: true, converted, failed, skipped, keywords };
    } finally {
      converting = false;
    }
  }

  // 変換した画像が登録キーワードのものなら generated.json の枚数を実際のファイル（<名前>.webp, _2, _3 …の連番）に揃える。
  // マニュアルの「サンプル画像準備中」のキーワードにも、手で置いた画像がすぐ出るようにするため。
  function syncManifest(webpNames) {
    let list;
    try { list = keywordList(readSettings()); } catch { return []; }
    const byName = new Map(list.map(k => [safeName(k.keyword), k.keyword]));
    const touched = new Set();
    for (const name of webpNames) {
      const base = name.replace(/\.webp$/i, '');
      if (byName.has(base)) { touched.add(byName.get(base)); continue; }
      const m = base.match(/^(.*)_(\d+)$/); // <名前>_2 など
      if (m && byName.has(m[1])) touched.add(byName.get(m[1]));
    }
    if (!touched.size) return [];
    const man = readManifest();
    let changed = false;
    for (const kw of touched) {
      let n = 0;
      while (n < MAX_COUNT && fs.existsSync(path.join(dir, fileNameFor(kw, n + 1)))) n++;
      if (n > 0 && man[kw] !== n) { man[kw] = n; changed = true; }
    }
    if (changed) writeManifest(man);
    return [...touched];
  }

  function status() {
    let missing = [], params = null, settingsError = null;
    try {
      const s = readSettings();
      missing = targets(s).map(k => k.keyword);
      const p = genParams(s);
      params = { width: p.width, height: p.height, steps: p.steps, cfgScale: p.cfgScale, sampler: p.sampler };
    } catch (e) { settingsError = e.message; }
    return { ...state, count: getCount(), maxCount: MAX_COUNT, extra: getExtra(), maxExtra: MAX_EXTRA, missing, params, settingsError, sources: listSources(), converting };
  }

  app.get('/api/kw-samples/status', (req, res) => res.json(status()));
  app.post('/api/kw-samples/config', (req, res) => {
    const b = req.body || {};
    if (b.count != null) setCount(b.count);
    if (b.extra != null) setExtra(b.extra);
    res.json({ ok: true, count: getCount(), extra: getExtra() });
  });
  app.post('/api/kw-samples/start', (req, res) => {
    const b = req.body || {};
    try { res.json(start(b.count, b.extra)); }
    catch (e) { res.status(500).json({ ok: false, message: e.message }); }
  });
  app.post('/api/kw-samples/stop', (req, res) => {
    if (state.running) state.stopping = true;
    res.json({ ok: true, stopping: state.stopping });
  });

  app.post('/api/kw-samples/convert-images', async (req, res) => {
    try { res.json(await convertImages()); }
    catch (e) { res.status(500).json({ ok: false, message: e.message }); }
  });

  return { status, start, convertImages };
}

module.exports = { register, safeName, fileNameFor, cleanExtra, MAX_COUNT, MAX_EXTRA };
