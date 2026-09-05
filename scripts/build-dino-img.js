#!/usr/bin/env node
/**
 * public/dino/*.png → cloudflare/pages/img-dino/*.webp （+ manifest.json）
 *
 * DINO ゲーム（/dino）で使う画像。原本は 1MB 級の PNG があり
 * そのままでは重いので、表示サイズに合わせて縮めて webp にする。
 *
 * キャラのコマ（run_/jump_）は**トリミングしない**。
 * 余白を各コマで削ると足の位置がコマごとにズレて歩きがガタつくため、
 * 原本の余白（3〜4px）を残したまま等倍スケールで下端合わせして描く。
 *
 * 障害物・UI は余白が大きい（hosi は上下左右に 80〜350px の透明）ので
 * トリミングしてから縮める。当たり判定と接地位置を素直に扱うため。
 *
 * 画像を差し替えたら再実行すること。出力先は毎回作り直す。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'dino');
const OUT = path.join(ROOT, 'cloudflare', 'pages', 'img-dino');

// [ファイル, 出力幅(なければ高さ指定), トリミングするか]
const PLAN = [
  ['back.png', { width: 2400 }, false],   // 論理1200x400の2倍。1枚でちょうど1画面
  ['sun.png', { width: 240 }, true],
  ['cloud1.png', { width: 400 }, true],
  ['cloud2.png', { width: 400 }, true],
  ['cloud3.png', { width: 380 }, true],
  ['cloud4.png', { width: 400 }, true],
  ['cloud5.png', { width: 380 }, true],
  ['hugu.png', { width: 200 }, true],
  ['hosi.png', { width: 180 }, true],
  ['kani.png', { width: 220 }, true],
  ['kaniyarare.png', { width: 240 }, true],
  ['retry.png', { width: 420 }, true],
];
for (let i = 1; i <= 8; i++) PLAN.push([`run_0${i}.png`, null, false]);
for (let i = 1; i <= 6; i++) PLAN.push([`jump_0${i}.png`, null, false]);

async function main() {
  if (!fs.existsSync(SRC)) throw new Error(`素材フォルダが見つからない: ${SRC}`);
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  let inBytes = 0, outBytes = 0;
  const manifest = {};

  for (const [file, resize, trim] of PLAN) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) throw new Error(`素材が無い: ${file}`);

    let img = sharp(src);
    if (trim) img = img.trim({ threshold: 8 });
    if (resize) img = img.resize({ ...resize, withoutEnlargement: true });

    const name = file.replace(/\.png$/i, '.webp');
    const dst = path.join(OUT, name);
    const info = await img.webp({ quality: 88 }).toFile(dst);

    manifest[name] = { w: info.width, h: info.height };
    inBytes += fs.statSync(src).size;
    outBytes += info.size;
  }

  // 効果音はそのままコピー（mp3 は変換しない）
  fs.copyFileSync(path.join(SRC, 'jump.mp3'), path.join(OUT, 'jump.mp3'));

  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1), 'utf8');

  const mb = b => (b / 1024 / 1024).toFixed(2) + ' MB';
  console.log(`✅ ${Object.keys(manifest).length} 枚 + jump.mp3 → ${path.relative(ROOT, OUT)}`);
  console.log(`   ${mb(inBytes)} → ${mb(outBytes)}`);
  for (const k of ['back.webp', 'run_01.webp', 'hugu.webp', 'hosi.webp', 'kani.webp', 'kaniyarare.webp', 'retry.webp']) {
    console.log(`   ${k.padEnd(18)} ${manifest[k].w}x${manifest[k].h}`);
  }
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
