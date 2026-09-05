#!/usr/bin/env node
/**
 * PATCHNOTES.md → cloudflare/pages/patchnotes.json
 *
 * サイト（https://kukucome-chara.pages.dev/ の PATCHNOTES ページ）は
 * PATCHNOTES.md を直接読まず、このスクリプトが吐く JSON を読む。
 * **PATCHNOTES.md を更新したら必ず `node scripts/build-patchnotes.js` を再実行して
 * デプロイすること。** でないとサイト側が古いままになる。
 *
 * 出力形式:
 *   { generated: ISO日時, count: 件数, items: [ { v, date, title, html } ] }
 *     v     … "v2.903.0"      （## 行のバージョン）
 *     date  … "2026-09-05"    （## 行の日付）
 *     title … 最初の ### 行のテキスト（行のタイトルに使う）
 *     html  … その版の本文をHTML化したもの
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'PATCHNOTES.md');
const OUT = path.join(ROOT, 'cloudflare', 'pages', 'patchnotes.json');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** インライン記法: `code` → **bold** → [text](url) の順で処理する */
// コード退避の目印。本文に絶対に出てこない私用領域の文字を使う。
// （" 1 " のような空白+数字を目印にすると「最大 1 MB」まで復元対象になってしまう）
const MARK = String.fromCharCode(0xE000);
const MARK_RE = new RegExp(MARK + '([0-9]+)' + MARK, 'g');

function inline(s) {
  const codes = [];
  // 先にコードを退避しないと、コード中の ** や [] が誤変換される
  s = s.replace(/`([^`]+)`/g, (_, c) => MARK + (codes.push(c) - 1) + MARK);
  s = esc(s);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) =>
    /^(https?:)?\/\//.test(u) ? `<a href="${u}" target="_blank" rel="noopener">${t}</a>` : t);
  s = s.replace(MARK_RE, (_, i) => `<code>${esc(codes[+i])}</code>`);
  return s;
}

/** PATCHNOTES で実際に使われている記法だけを対象にした最小の変換 */
function mdToHtml(lines) {
  const out = [];
  let listDepth = 0;   // 現在開いている <ul> の数
  let para = [];
  let fence = null;    // コードフェンス中のバッファ

  const closeLists = () => { while (listDepth > 0) { out.push('</ul>'); listDepth--; } };
  const flushPara = () => {
    if (para.length) { out.push(`<p>${para.map(inline).join('<br>')}</p>`); para = []; }
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');

    if (fence !== null) {
      if (/^\s*```/.test(line)) { out.push(`<pre><code>${esc(fence.join('\n'))}</code></pre>`); fence = null; }
      else fence.push(raw);
      continue;
    }
    if (/^\s*```/.test(line)) { flushPara(); closeLists(); fence = []; continue; }

    if (!line.trim()) { flushPara(); closeLists(); continue; }

    const h4 = line.match(/^####\s+(.*)$/);
    if (h4) { flushPara(); closeLists(); out.push(`<h4>${inline(h4[1])}</h4>`); continue; }

    const li = line.match(/^(\s*)-\s+(.*)$/);
    if (li) {
      flushPara();
      const depth = Math.floor(li[1].length / 2) + 1;
      while (listDepth < depth) { out.push('<ul>'); listDepth++; }
      while (listDepth > depth) { out.push('</ul>'); listDepth--; }
      out.push(`<li>${inline(li[2])}</li>`);
      continue;
    }

    closeLists();
    para.push(line);
  }
  flushPara();
  closeLists();
  if (fence !== null) out.push(`<pre><code>${esc(fence.join('\n'))}</code></pre>`);
  return out.join('');
}

function build() {
  if (!fs.existsSync(SRC)) throw new Error(`PATCHNOTES.md が見つからない: ${SRC}`);
  const lines = fs.readFileSync(SRC, 'utf8').split(/\r?\n/);

  // ## 行の位置で版を切り出す（--- の水平線は版の区切りなので本文からは落とす）
  const heads = [];
  lines.forEach((l, i) => {
    const m = l.match(/^##\s+(v[\d.]+)\s*—\s*(\d{4}-\d{2}-\d{2})(.*)$/);
    if (m) heads.push({ i, v: m[1], date: m[2], suffix: m[3].trim() });
  });
  if (!heads.length) throw new Error('## 行が1つも見つからない。PATCHNOTES.md の書式を確認すること');

  const items = heads.map((h, n) => {
    const end = n + 1 < heads.length ? heads[n + 1].i : lines.length;
    const body = lines.slice(h.i + 1, end).filter(l => l.trim() !== '---');

    const first = body.find(l => /^###\s+/.test(l));
    const title = first ? first.replace(/^###\s+/, '').replace(/`/g, '').trim()
                        : (h.suffix || h.v);

    // 行タイトルに出す最初の ### は本文から省く（重複表示になるため）
    const bodyLines = [];
    let dropped = false;
    for (const l of body) {
      if (!dropped && /^###\s+/.test(l)) { dropped = true; continue; }
      // 2つ目以降の ### は本文中の小見出しとして残す
      bodyLines.push(/^###\s+/.test(l) ? l.replace(/^###\s+/, '#### ') : l);
    }

    return { v: h.v, date: h.date, title, html: mdToHtml(bodyLines) };
  });

  const json = JSON.stringify({ generated: new Date().toISOString(), count: items.length, items });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, json, 'utf8');

  console.log(`✅ ${items.length} 版を書き出し: ${path.relative(ROOT, OUT)}`);
  console.log(`   サイズ ${(Buffer.byteLength(json) / 1024).toFixed(0)} KB`);
  console.log(`   最新   ${items[0].v} — ${items[0].date}  ${items[0].title}`);
  console.log(`   最古   ${items[items.length - 1].v} — ${items[items.length - 1].date}`);
}

build();
