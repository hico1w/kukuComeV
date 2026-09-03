/**
 * キーワード別ポジティブ サンプル画像生成スクリプト
 *
 * 使い方:
 *   node scripts/gen-keyword-samples.js           # 未生成のみ生成
 *   node scripts/gen-keyword-samples.js --force   # 全件再生成
 *   node scripts/gen-keyword-samples.js --kw ちび # 特定キーワードのみ
 *
 * 前提: SD WebUI (Forge/A1111) が http://127.0.0.1:7860 で起動中であること
 * 出力: chara/keyword-samples/{keyword}.png        … ベース+キーワード
 *       chara/keyword-samples/{keyword}_plain.png  … キーワードのみ
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

// ========== 設定 ==========

const BASE_PROMPT =
  '1girl,(burgundy hair:1.3),(aegyo sal:1.2),blue eyes,grey eyes,multicolored eyes,red eyeliner,' +
  '(colored inner hair:1.2),long hair,(white streaked hair white streaked bangs:1.2),anime coloring,' +
  'long hair,black bow,cat ears,bangs,necklace,cross,fang,two side up,lower eyelashes,white streaked hair,' +
  'eyelashes,blush,virtual youtuber,earrings,detailed,shiny skin,hair ribbon,cross hair ornament,ring,' +
  'smile,looking at viewer,clothing,wide hips,large breasts,bouncing breasts,masterpiece,';

const NEGATIVE =
  'sex,nipple,nude,pussy,penis,nsfw,sexy,ai-generated,lowres,normal quality,extra fingers,fewer fingers,' +
  'lowres,normal quality,monochrome,grayscale,extra hands,censored,mosaic censoring,bar censor,text,' +
  'watermark,logo,IllusP0s,3d,lowres,(worst quality, bad quality:1.2),bad anatomy,sketch,jpeg artifacts,' +
  'signature,watermark,old,oldest,censored,bar_censor,simple background,extra head,conjoined,deformed,' +
  'long body,bad body,ugly,poorly drawn face,distant eyes,bad hands,mutated hands and fingers,' +
  'malformed hands,poorly drawn hands,too many fingers,multiple_heads,';

// 両ケース共通で必ず末尾に付加するプロンプト
const COMMON_SUFFIX = 'masterpiece,<lora:NSFWFilterXL_animagine:-1.5>,';

const WIDTH   = 1272;
const HEIGHT  = 1920;
const STEPS   = 23;
const CFG     = 3.5;
const SAMPLER = 'Euler a';
const OUT_DIR = path.join(__dirname, '..', 'chara', 'keyword-samples');

// ========== 引数解析 ==========

const args      = process.argv.slice(2);
const FORCE     = args.includes('--force');
const KW_FILTER = (() => { const i = args.indexOf('--kw'); return i >= 0 ? args[i + 1] : null; })();

// ========== ユーティリティ ==========

function safeName(keyword) {
  return keyword.replace(/[<>:"/\\|?*]/g, '_').slice(0, 60);
}

function generate(prompt, negative) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      prompt,
      negative_prompt: negative,
      width: WIDTH, height: HEIGHT,
      steps: STEPS,
      cfg_scale: CFG,
      sampler_name: SAMPLER,
      scheduler: 'Automatic',
      batch_size: 1, n_iter: 1,
    });

    const req = http.request({
      hostname: '127.0.0.1', port: 7860,
      path: '/sdapi/v1/txt2img', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try {
          const result = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          if (result.detail) return reject(new Error('SD error: ' + result.detail));
          const b64 = result.images?.[0];
          if (!b64) return reject(new Error('画像なし'));
          resolve(Buffer.from(b64, 'base64'));
        } catch (e) { reject(e); }
      });
    });

    req.setTimeout(180000, () => { req.destroy(); reject(new Error('タイムアウト (180s)')); });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ベース+ポジティブ と ポジティブのみ の2枚を生成して保存
async function generatePair(label, positive, idx, total) {
  const name     = safeName(label);
  const outBase  = path.join(OUT_DIR, name + '.png');
  const outPlain = path.join(OUT_DIR, name + '_plain.png');
  const prefix   = `[${idx}/${total}] ${label}`;

  const needsBase  = FORCE || !fs.existsSync(outBase);
  const needsPlain = FORCE || !fs.existsSync(outPlain);

  if (!needsBase && !needsPlain) {
    console.log(`  ⏭ スキップ: ${prefix}`);
    return { skipped: true };
  }

  // ベース+キーワード
  if (needsBase) {
    const parts = [BASE_PROMPT, positive, COMMON_SUFFIX].filter(Boolean);
    const fullPrompt = parts.join(', ');
    process.stdout.write(`  🎨 [base ] ${prefix} ...`);
    try {
      const buf = await generate(fullPrompt, NEGATIVE);
      fs.writeFileSync(outBase, buf);
      console.log(` ✓`);
    } catch (e) {
      console.log(` ✗ ${e.message}`);
    }
  }

  // キーワードのみ（COMMON_SUFFIX は必ず付加）
  if (needsPlain) {
    const parts = [positive, COMMON_SUFFIX].filter(Boolean);
    const plainPrompt = parts.join(', ');
    process.stdout.write(`  🎨 [plain] ${prefix} ...`);
    try {
      const buf = await generate(plainPrompt, NEGATIVE);
      fs.writeFileSync(outPlain, buf);
      console.log(` ✓`);
    } catch (e) {
      console.log(` ✗ ${e.message}`);
    }
  }

  return { skipped: false };
}

// ========== メイン ==========

async function main() {
  const settings = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'settings.json'), 'utf8'));
  let kwp = settings.sdKeywordPrompts;
  if (typeof kwp === 'string') kwp = JSON.parse(kwp);
  kwp = (kwp || []).filter(k => k.keyword);

  // 固定キーワード（ドット・リアル・もいちゃん）を先頭に追加
  const fixedKwp = [
    { keyword: 'ドット',     positive: settings.sdDotPositiveSuffix  || '' },
    { keyword: 'リアル',     positive: settings.sdRealPositiveSuffix || '' },
    { keyword: 'もいちゃん', positive: settings.sdMoiPositiveSuffix  || '' },
  ].filter(k => k.positive);
  const allKwp = [...fixedKwp, ...kwp];

  if (KW_FILTER) {
    const filtered = allKwp.filter(k => k.keyword === KW_FILTER);
    if (!filtered.length) { console.error(`キーワード「${KW_FILTER}」が見つかりません`); process.exit(1); }
    kwp.length = 0; kwp.push(...filtered);
  } else {
    kwp.length = 0; kwp.push(...allKwp);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`\n=== キーワードサンプル生成 ===`);
  console.log(`対象: ${kwp.length} 件 (各2枚) | ${FORCE ? '強制再生成' : '未生成のみ'} | ${WIDTH}x${HEIGHT} steps:${STEPS} cfg:${CFG}`);
  console.log(`出力先: chara/keyword-samples/\n`);

  let generated = 0, skipped = 0;

  for (let i = 0; i < kwp.length; i++) {
    const { keyword, positive } = kwp[i];
    const r = await generatePair(keyword, positive, i + 1, kwp.length);
    if (r.skipped) skipped++; else generated++;
  }

  console.log(`\n=== 完了 ===`);
  console.log(`処理: ${generated}件 / スキップ: ${skipped}件`);
  console.log(`\n次のステップ:`);
  console.log(`  git add chara/keyword-samples/`);
  console.log(`  git commit -m "feat: キーワードサンプル画像追加"`);
  console.log(`  git push`);
}

main().catch(e => { console.error(e); process.exit(1); });
