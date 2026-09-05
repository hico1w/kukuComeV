#!/usr/bin/env node
/**
 * アイコン原本 → cloudflare/pages/ の favicon 一式
 *
 *   node scripts/build-favicon.js <元画像のパス>
 *   （省略時は assets/favicon-src.png を使う）
 *
 * 出力:
 *   favicon.ico          16/32/48 を1ファイルに格納（PC のタブ・古い環境）
 *   favicon-32.png       32x32（現行ブラウザのタブ）
 *   apple-touch-icon.png 180x180（iOS のホーム画面。iOS は透過を黒く塗るので白地で焼く）
 *   icon-192.png         192x192（Android のホーム画面）
 *   icon-512.png         512x512（PWA / OS のアプリ一覧）
 *
 * 元画像は正方形・1024px 以上の PNG を想定。透過はそのまま活かす
 * （apple-touch-icon だけは白地に載せる）。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'cloudflare', 'pages');
const SRC = process.argv[2] || path.join(ROOT, 'assets', 'favicon-src.png');

/** PNG を並べて .ico コンテナを組み立てる（ICO は PNG をそのまま格納できる） */
function buildIco(pngs) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // reserved
  header.writeUInt16LE(1, 2);      // type: 1 = icon
  header.writeUInt16LE(count, 4);

  const entries = [];
  let offset = 6 + count * 16;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);   // 幅（256 は 0 で表す）
    e.writeUInt8(size >= 256 ? 0 : size, 1);   // 高さ
    e.writeUInt8(0, 2);                        // パレット色数
    e.writeUInt8(0, 3);                        // reserved
    e.writeUInt16LE(1, 4);                     // カラープレーン
    e.writeUInt16LE(32, 6);                    // ビット深度
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map(p => p.data)]);
}

async function main() {
  if (!fs.existsSync(SRC)) throw new Error(`元画像が見つからない: ${SRC}`);
  const meta = await sharp(SRC).metadata();
  if (meta.width !== meta.height) {
    console.warn(`⚠ 元画像が正方形ではない (${meta.width}x${meta.height})。中央を正方形に切って使う`);
  }
  const side = Math.min(meta.width, meta.height);
  const base = sharp(SRC).extract({
    left: Math.round((meta.width - side) / 2),
    top: Math.round((meta.height - side) / 2),
    width: side, height: side,
  });
  const square = await base.png().toBuffer();

  const png = (n, bg) => {
    let p = sharp(square).resize(n, n, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
    if (bg) p = p.flatten({ background: bg });
    return p.png().toBuffer();
  };

  fs.mkdirSync(OUT, { recursive: true });

  const ico = buildIco([
    { size: 16, data: await png(16) },
    { size: 32, data: await png(32) },
    { size: 48, data: await png(48) },
  ]);
  fs.writeFileSync(path.join(OUT, 'favicon.ico'), ico);

  const files = [
    ['favicon-32.png', await png(32)],
    ['apple-touch-icon.png', await png(180, '#ffffff')],  // iOS は透過を黒く塗るため白地に焼く
    ['icon-192.png', await png(192)],
    ['icon-512.png', await png(512)],
  ];
  for (const [name, data] of files) fs.writeFileSync(path.join(OUT, name), data);

  console.log(`✅ ${path.relative(ROOT, SRC)} から書き出し`);
  console.log(`   favicon.ico          ${(ico.length / 1024).toFixed(1)} KB (16/32/48)`);
  for (const [name, data] of files) {
    console.log(`   ${name.padEnd(20)} ${(data.length / 1024).toFixed(1)} KB`);
  }
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
