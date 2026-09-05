/**
 * update-index-webp.js
 * index.html の PNG/JPG 画像参照を WebP に書き換える
 */
const fs = require('fs');

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const before = html;

// 1. STANDALONE_CHARS の値 ".png" / ".PNG" / ".jpg" / ".jpeg" → ".webp"
//    ただし .gif と既存 .webp はそのまま
html = html.replace(/("(?:[^"]*?))\.(?:png|PNG|jpg|jpeg)(")/g, (m, pre, post) => {
  return pre + '.webp' + post;
});

// 2. promptSample 配列の {f:'xxx.jpg'} / {f:'xxx.png'} → .webp
html = html.replace(/(f:'[^']+?)\.(?:png|jpg|jpeg)(')/g, (m, pre, post) => {
  return pre + '.webp' + post;
});

// 3. keyword-samples の +'.png' → +'.webp'
html = html.replace(/\+'\.png'/g, "+'.webp'");

// 4. screenshots の '+id+'.png' → '+id+'.webp'
html = html.replace(/'\+id\+'\.png'/g, "'+id+'.webp'");

// 5. ageru/haikei.png はゲームサーバー側の画像なので戻す
html = html.replace(/ageru\/haikei\.webp/g, 'ageru/haikei.png');

const changed = html !== before;
if (changed) {
  fs.writeFileSync(file, html, 'utf8');
  console.log('index.html を更新しました。');
} else {
  console.log('変更なし。');
}
