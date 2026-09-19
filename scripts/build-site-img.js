#!/usr/bin/env node
/**
 * cloudflare/pages/img/ を走査して manifest.json を書き出す。
 *
 * index.html はこれまでファイル名を「連番」で組み立てていたため、
 * 画像を1枚消すと index.html の数字も直さないと歯抜けになっていた。
 * （Cloudflare Pages は存在しないパスに 404 ではなく index.html を 200 で返すので、
 *   消したファイルは「壊れた img」として枠だけ残ってしまう）
 *
 * このスクリプトを通すことで、**画像を足す・消すはファイル操作だけで済む**ようになる。
 * 画像を足したり消したりしたら再実行すること。
 *
 *   node scripts/build-site-img.js
 *
 * 接頭辞ごとにグループを分けている。どのグループがサイトのどこに出るかは index.html 側の担当：
 *   an   … ヒーロー / ページ内ストリップ / スクリーンセーバー
 *   cos  … ギャラリー（メイン写真とサムネ）
 *   v89  … PHOTO INDEX のグリッド
 *   ph   … ストリップ各種
 *   ss   … 横に流れる2本のストリップ（前半が strip1、後半が strip2）
 * グループに属さないもの（logo.png / cover.webp など）は一覧に入れない。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'cloudflare', 'pages', 'img');
const OUT = path.join(DIR, 'manifest.json');

const GROUPS = ['an', 'cos', 'v89', 'ph', 'ss'];
// v89 を an/ph より先に見ないと v8901 が拾えないので、長い接頭辞から順に並べてある
const RE = new RegExp('^(' + ['v89', 'cos', 'an', 'ph', 'ss'].join('|') + ')(\\d+)\\.webp$', 'i');

function main() {
  if (!fs.existsSync(DIR)) throw new Error(`画像フォルダが見つからない: ${DIR}`);

  const out = {};
  for (const g of GROUPS) out[g] = [];
  const skipped = [];

  for (const f of fs.readdirSync(DIR)) {
    if (f === 'manifest.json') continue;
    const m = RE.exec(f);
    if (!m) { skipped.push(f); continue; }
    out[m[1].toLowerCase()].push({ f, n: Number(m[2]) });
  }

  let total = 0;
  for (const g of GROUPS) {
    out[g].sort((a, b) => a.n - b.n || a.f.localeCompare(b.f));   // 01, 02, … 10 の順にする
    out[g] = out[g].map(x => x.f);
    total += out[g].length;
  }

  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n', 'utf8');

  console.log(`✅ ${total} 枚を書き出し: ${path.relative(ROOT, OUT)}`);
  for (const g of GROUPS) console.log(`   ${g.padEnd(4)} ${String(out[g].length).padStart(3)} 枚`);
  if (skipped.length) console.log(`   （一覧に入れなかったファイル: ${skipped.join(', ')}）`);
}

main();
