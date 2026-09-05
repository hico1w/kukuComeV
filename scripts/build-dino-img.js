#!/usr/bin/env node
/**
 * public/dino/*.png → cloudflare/pages/img-dino/*.webp （+ manifest.json）
 *
 * DINO ゲーム（/dino）で使う画像。原本は 1MB 級の PNG があり
 * そのままでは重いので、表示サイズに合わせて縮めて webp にする。
 *
 * キャラのコマ（run_/jump_/dead_）は**トリミングしない**。
 * 余白を各コマで削ると足の位置がコマごとにズレて歩きがガタつくため、
 * 原本の余白（3〜4px）を残したまま等倍スケールで下端合わせして描く。
 *
 * run_/jump_ は**左右反転して書き出す**。原本は左を向いているが、
 * ゲームでは右へ走る（障害物は右から来る）ため。
 * dead_ は原本のまま。倒れる向き（頭が左）が右向きに走る絵と整合している。
 *
 * dead_ は原本が run_ の約2倍の大きさなので、コマ間の比率を保ったまま
 * 一律 DEAD_RATIO 倍して run_ と同じ スケールで扱えるようにする。
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

// dead_ の原本(336px幅)を run_(176px幅)と同じ尺度に合わせる倍率
const DEAD_RATIO = 176 / 336;

// [ファイル, 出力指定(なければ原寸), トリミングするか, 左右反転するか]
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
  ['tatie.png', { width: 420 }, true],     // ロード画面でくるくる回す絵
];
// 走りは run_01 / run_04 / run_02 の3枚しか使わないが、
// 差し替えたくなったときのために8枚とも書き出しておく
for (let i = 1; i <= 8; i++) PLAN.push([`run_0${i}.png`, null, false, true]);
for (let i = 1; i <= 6; i++) PLAN.push([`jump_0${i}.png`, null, false, true]);
for (let i = 1; i <= 4; i++) PLAN.push([`dead${i}.png`, 'dead', false, false]);

async function main() {
  if (!fs.existsSync(SRC)) throw new Error(`素材フォルダが見つからない: ${SRC}`);
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  let inBytes = 0, outBytes = 0;
  const manifest = {};

  for (const [file, resize, trim, flip] of PLAN) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) throw new Error(`素材が無い: ${file}`);

    let img = sharp(src);
    if (trim) img = img.trim({ threshold: 8 });
    if (resize === 'dead') {
      // コマ間の大小関係を保つため、全コマ同じ倍率で縮める
      const m = await sharp(src).metadata();
      img = img.resize({ width: Math.round(m.width * DEAD_RATIO) });
    } else if (resize) {
      img = img.resize({ ...resize, withoutEnlargement: true });
    }
    if (flip) img = img.flop();          // 左右反転（右向きに走らせる）

    const name = file.replace(/\.png$/i, '.webp');
    const dst = path.join(OUT, name);
    const info = await img.webp({ quality: 88 }).toFile(dst);

    manifest[name] = { w: info.width, h: info.height };
    inBytes += fs.statSync(src).size;
    outBytes += info.size;
  }

  // 音はそのままコピー（mp3 は変換しない）
  for (const a of ['jump.mp3', 'madakana.mp3']) {
    fs.copyFileSync(path.join(SRC, a), path.join(OUT, a));
  }

  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1), 'utf8');

  const mb = b => (b / 1024 / 1024).toFixed(2) + ' MB';
  console.log(`✅ ${Object.keys(manifest).length} 枚 + mp3 2本 → ${path.relative(ROOT, OUT)}`);
  console.log(`   画像 ${mb(inBytes)} → ${mb(outBytes)}`);
  for (const k of ['back.webp', 'run_01.webp', 'dead1.webp', 'dead4.webp', 'hugu.webp', 'hosi.webp', 'tatie.webp']) {
    console.log(`   ${k.padEnd(18)} ${manifest[k].w}x${manifest[k].h}`);
  }
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
