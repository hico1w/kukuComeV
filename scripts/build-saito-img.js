#!/usr/bin/env node
/**
 * public/saitoImg/*.png → cloudflare/pages/img-saito/*.webp （+ manifest.json）
 *
 * PATCHNOTES ページで行をクリックするたびに右下へ出す画像。
 * 原本は 714x800 の PNG が150枚・計26MB あり、そのまま Pages に載せると重いので
 * 幅を縮めて webp に変換する。表示は装飾用（テキストの後ろ）なので原寸は不要。
 *
 * 画像を足したり消したりしたら再実行すること。出力先は毎回作り直す。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'saitoImg');
const OUT = path.join(ROOT, 'cloudflare', 'pages', 'img-saito');

const WIDTH = 560;   // 右下に出す装飾用なのでこれで十分
const QUALITY = 78;

async function main() {
  if (!fs.existsSync(SRC)) throw new Error(`画像フォルダが見つからない: ${SRC}`);

  const files = fs.readdirSync(SRC).filter(f => /\.(png|jpe?g|webp)$/i.test(f)).sort();
  if (!files.length) throw new Error(`変換対象の画像がない: ${SRC}`);

  // 消した画像が残らないように出力先ごと作り直す
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  let srcBytes = 0, outBytes = 0;
  const manifest = [];

  for (const f of files) {
    const src = path.join(SRC, f);
    const name = f.replace(/\.[^.]+$/, '') + '.webp';
    const dst = path.join(OUT, name);

    await sharp(src)
      .resize({ width: WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(dst);

    srcBytes += fs.statSync(src).size;
    outBytes += fs.statSync(dst).size;
    manifest.push(name);
  }

  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest), 'utf8');

  const mb = b => (b / 1024 / 1024).toFixed(1) + ' MB';
  console.log(`✅ ${manifest.length} 枚を変換: ${path.relative(ROOT, OUT)}`);
  console.log(`   ${mb(srcBytes)} → ${mb(outBytes)}  (幅${WIDTH}px / webp q${QUALITY})`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
