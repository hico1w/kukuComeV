/**
 * convert-chara-webp.js
 * chara/ 以下の PNG/JPG を WebP に変換し、元ファイルを削除する
 * GIF は透過アニメのため変換しない
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIRS = [
  'chara',
  'chara/keyword-samples',
  'chara/promptSample',
  'chara/screenshots',
];

let converted = 0, skipped = 0, errors = 0;

async function convertDir(dir) {
  const full = path.join(__dirname, dir);
  const files = fs.readdirSync(full).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  for (const f of files) {
    const src = path.join(full, f);
    const dst = path.join(full, f.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    if (fs.existsSync(dst)) { skipped++; continue; }
    try {
      await sharp(src).webp({ quality: 85 }).toFile(dst);
      fs.unlinkSync(src);
      converted++;
      if (converted % 50 === 0) console.log(`  ${converted} 変換済み...`);
    } catch (e) {
      console.error(`  ✗ ${f}: ${e.message}`);
      errors++;
    }
  }
}

(async () => {
  for (const dir of DIRS) {
    const full = path.join(__dirname, dir);
    if (!fs.existsSync(full)) continue;
    console.log(`[${dir}]`);
    await convertDir(dir);
  }
  console.log(`\n完了: 変換 ${converted} 枚, スキップ ${skipped} 枚, エラー ${errors} 件`);
})();
