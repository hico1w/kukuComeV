const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const URL = 'https://hico1w.github.io/kukuComeV/';
const OUT = 'E:\\claude\\kukuCome\\chara\\screenshots';

// kwsamples と promptsamples は画像ギャラリーがあるのでスキップ
const SECTIONS = [
  'sec-cmdgen',
  'sec-features',
  'sec-pet',
  'sec-equip',
  'sec-boss',
  'sec-ageru-boss',
  'sec-game',
  'sec-char',
  'sec-bubble',
  'sec-deco',
  'sec-color',
  'sec-settings',
  'sec-effects',
  'sec-motion',
  'sec-style',
  'sec-font',
  'sec-media',
  'sec-ageru',
  'sec-titles',
  'sec-examples',
  'sec-cmdref',
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });

  console.log('Loading page...');
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  // フォント・画像の読み込み待ち
  await page.waitForTimeout(1500);

  for (const id of SECTIONS) {
    const el = await page.$(`#${id}`);
    if (!el) { console.log(`  SKIP (not found): ${id}`); continue; }

    // セクションをビューポートの上端にスクロール
    await page.evaluate(id => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, id);
    await page.waitForTimeout(400);

    // セクション要素の位置を取得してクリップ
    const box = await el.boundingBox();
    const clipH = Math.min(box.height, 560);

    const outPath = path.join(OUT, `${id}.png`);
    await page.screenshot({
      path: outPath,
      clip: { x: 0, y: box.y - 8, width: 1280, height: clipH },
    });
    console.log(`  ✓ ${id} (${Math.round(clipH)}px)`);
  }

  await browser.close();
  console.log('Done!');
})().catch(e => { console.error(e); process.exit(1); });
