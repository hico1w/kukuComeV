// ══════════════════════════════════════════════════════════════════
//  app-14: コメント物理オブジェクト ＋ 配信サマリー（エンドカード／記憶日記）
//  - 読み込み順は app-13 の後（index.html 末尾）。全ファイルと同一グローバルスコープ。
// ══════════════════════════════════════════════════════════════════

// ── 配信セッションの集計用 ────────────────────────────────────────
let _streamStartAt   = 0;     // 最初のコメントが来た時刻（配信時間の起点）
let _streamHighlights = [];   // 名場面ログ（最大保持は表示時に制限）
let _streamComments  = [];    // 今日の全コメント { name, text }（エンドカードの一覧用）
function recordStreamHighlight(text) {
  if (!text) return;
  _streamHighlights.push(String(text));
  if (_streamHighlights.length > 40) _streamHighlights.shift();
}
function recordStreamComment(name, text) {
  if (!text) return;
  _streamComments.push({ name: name || '名無し', text: String(text) });
  if (_streamComments.length > 3000) _streamComments.shift(); // メモリ上限
}

// エンドカードの表示サイズ（admin から変更可能）。height はカード全体の高さ（画面より大きくならない）
let endCardWidth  = parseInt(localStorage.getItem('endCardWidth')  ?? '880');
let endCardHeight = parseInt(localStorage.getItem('endCardHeight') ?? '640');
let endCardVolume = parseInt(localStorage.getItem('endCardVolume') ?? '80'); // 効果音「ジャン！」音量(0〜100)

// コメント総評のシステムプロンプト（admin から編集可能。空ならデフォルトを使用）
const REVIEW_DEFAULT_SYSTEM =
  'あなたは配信を見守る先生（講師）です。視聴者コメントをもとに、今日の配信の雰囲気・盛り上がり・視聴者の様子を' +
  '黒板に書く講評のように総評してください。日本語のみ。300文字程度。' +
  '良かった点・特徴・ひとことアドバイスを、親しみやすく前向きな先生口調でまとめてください。箇条書きでも文章でも構いません。';
let reviewSystem   = localStorage.getItem('reviewSystem') || '';
let reviewNumCtx   = parseInt(localStorage.getItem('reviewNumCtx') ?? '131072');

// 総評モーダルの講師キャラ（大きさ・右/下オフセット）。admin から調整可能
let reviewCharSize   = parseInt(localStorage.getItem('reviewCharSize')   ?? '160');
let reviewCharRight  = parseInt(localStorage.getItem('reviewCharRight')  ?? '14');
let reviewCharBottom = parseInt(localStorage.getItem('reviewCharBottom') ?? '12');
function _applyReviewCharStyle() {
  const img = document.querySelector('#streamReviewModal .sr-char');
  if (img) { img.style.width = reviewCharSize + 'px'; img.style.right = reviewCharRight + 'px'; img.style.bottom = reviewCharBottom + 'px'; }
}

let reviewBoardWidth     = parseInt(localStorage.getItem('reviewBoardWidth')     ?? '760');
let reviewBoardMaxHeight = parseInt(localStorage.getItem('reviewBoardMaxHeight') ?? '88');
let reviewBoardOffsetX   = parseInt(localStorage.getItem('reviewBoardOffsetX')   ?? '0');
let reviewBoardOffsetY   = parseInt(localStorage.getItem('reviewBoardOffsetY')   ?? '0');
function _applyReviewBoardStyle() {
  const board = document.querySelector('#streamReviewModal .sr-board');
  if (board) {
    board.style.width = `min(${reviewBoardWidth}px, 94vw)`;
    board.style.maxHeight = reviewBoardMaxHeight + 'vh';
    board.style.transform = `translate(${reviewBoardOffsetX}px, ${reviewBoardOffsetY}px)`;
  }
}

// 記憶日記の回想文（システムプロンプトに注入される）
let _agruDiaryRecall = '';

// ══════════════════════════════════════════════════════════════════
//  ① コメント物理オブジェクト化（流れてきたコメントが落下・積み上がり・弾ける）
// ══════════════════════════════════════════════════════════════════
let commentPhysEnabled     = localStorage.getItem('commentPhysEnabled') === '1';
let commentPhysGravity     = parseFloat(localStorage.getItem('commentPhysGravity')     ?? '40') / 100; // 重力加速度
let commentPhysRestitution = parseFloat(localStorage.getItem('commentPhysRestitution') ?? '45') / 100; // 反発係数
let commentPhysMax         = parseInt(localStorage.getItem('commentPhysMax')           ?? '25');         // 同時最大数（最大500）
let commentPhysFontSize    = parseInt(localStorage.getItem('commentPhysFontSize')      ?? '18');         // 文字サイズ(px)
let commentPhysZ           = parseInt(localStorage.getItem('commentPhysZ')             ?? '65');         // 重なり順(z-index)

let _cphysObjs  = [];   // { el, x, y, vx, vy, w, h, born }
let _cphysAnim  = null;
let _cphysRectCache = null;
let _cphysRectTs = 0;

const _CPHYS_BURST_SND = '/sound/syageki/' + encodeURIComponent('nc77822_びっくり０３－１.mp3');
function _playCommentPhysBurstSound() {
  try { const a = new Audio(_CPHYS_BURST_SND); a.volume = 0.7; a.play().catch(() => {}); } catch (e) {}
}

function _commentPhysDestroy(o, bulletUser) {
  // バーストエフェクト（クローンで爆発アニメ）
  const clone = o.el.cloneNode(true);
  clone.style.pointerEvents = 'none';
  clone.style.zIndex = '10001';
  clone.classList.add('comment-phys-destroy');
  document.body.appendChild(clone);
  clone.addEventListener('animationend', () => clone.remove(), { once: true });

  // パーティクル（7方向に飛び散る）
  const _pColors = ['#ff4444','#ff8c00','#ffd700','#44dd55','#4499ff','#cc44ff','#ff44bb'];
  const vpx = parseFloat(o.el.style.left) + o.w / 2;
  const vpy = parseFloat(o.el.style.top)  + o.h / 2;
  for (let p = 0; p < 7; p++) {
    const pt = document.createElement('div');
    pt.className = 'cphys-particle';
    const ang = (p / 7) * Math.PI * 2;
    const spd = 45 + Math.random() * 50;
    pt.style.cssText = `left:${vpx}px;top:${vpy}px;background:${_pColors[p % _pColors.length]};--tx:${(Math.cos(ang) * spd).toFixed(1)}px;--ty:${(Math.sin(ang) * spd).toFixed(1)}px`;
    document.body.appendChild(pt);
    pt.addEventListener('animationend', () => pt.remove(), { once: true });
  }

  o.el.remove();

  // +1 MP & 表示
  if (bulletUser) {
    bulletUser.mp = (bulletUser.mp ?? 0) + 1;
    if (typeof updateStatsDisplay === 'function') updateStatsDisplay(bulletUser);
    if (typeof showDamageNumber === 'function')
      showDamageNumber(o.x + o.w / 2, o.y + o.h / 2, '+1MP', false, null, '#7dd3fc');
  }

  _playCommentPhysBurstSound();
}

function spawnCommentPhys(text, user, imgUrls) {
  if (!commentPhysEnabled) return;
  const stageEl = document.getElementById('stage');
  const hasImages = Array.isArray(imgUrls) && imgUrls.length > 0;
  if (!stageEl || (!text && !hasImages)) return;

  // 外側 = 物理位置のみ。内側 = 吹き出しの見た目（形状・装飾・文字色・フォント・背景）を反映
  const el = document.createElement('div');
  el.className = 'comment-phys';
  el.style.zIndex = commentPhysZ;

  const inner = document.createElement('div');
  const shape = (user && user.bubbleShape) || 'round';
  const deco  = (user && user.bubbleDeco)  || '';
  inner.className = 'comment-phys-bubble bubble-' + shape + (deco ? ' bubble-deco-' + deco : '');

  if (hasImages) {
    inner.style.display = 'flex';
    inner.style.flexDirection = 'column';
    inner.style.alignItems = 'center';
    inner.style.gap = '4px';
    inner.style.padding = '6px';
    const imgRow = document.createElement('div');
    imgRow.style.cssText = 'display:flex;flex-direction:row;gap:4px;flex-wrap:wrap;justify-content:center';
    for (const url of imgUrls) {
      const img = document.createElement('img');
      img.src = url;
      img.className = 'comment-phys-emo-img';
      img.onerror = () => { img.style.display = 'none'; };
      imgRow.appendChild(img);
    }
    inner.appendChild(imgRow);
    const caption = String(text || '').trim().replace(/\([^)]*\)/g, '').trim().slice(0, 24);
    if (caption) {
      const cap = document.createElement('div');
      cap.textContent = caption;
      cap.style.fontSize = commentPhysFontSize + 'px';
      inner.appendChild(cap);
    }
  } else {
    const msg = String(text).trim().slice(0, 24);
    if (!msg) return;
    inner.textContent = msg;
    inner.style.fontSize = commentPhysFontSize + 'px';
  }

  if (user) {
    if (user.textColor)     inner.style.color = user.textColor;
    if (user.font)          inner.style.fontFamily = user.font;
    if (user.bubbleBgColor) inner.style.setProperty('--bubble-bg', user.bubbleBgColor);
  }
  el.appendChild(inner);
  // body 直下に置く（#stage は position:fixed でスタッキングコンテキストを作るため、
  // stage内に入れると z-index がモーダル等と比較されない。body直下なら commentPhysZ が
  // YouTube/会話モーダルと同じルート文脈で重なり順を決められる）
  document.body.appendChild(el);

  const w = el.offsetWidth  || 80;
  const h = el.offsetHeight || 28;
  const stageW = stageEl.clientWidth;
  const rect = stageEl.getBoundingClientRect();
  const x = Math.random() * Math.max(1, stageW - w);
  const obj = {
    el, x, y: -h - 4, w, h,
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 2,
    born: performance.now(),
  };
  // 物理座標(o.x/o.y)はstage基準。translate でビューポート絶対位置に配置（GPU コンポジット）
  el.style.transform = `translate(${(rect.left + x).toFixed(1)}px,${(rect.top + obj.y).toFixed(1)}px)`;
  _cphysObjs.push(obj);

  // 上限超過：古いものから消す（積み上がりすぎ防止）
  while (_cphysObjs.length > commentPhysMax) {
    const old = _cphysObjs.shift();
    old.el?.remove();
  }
  if (!_cphysAnim) _cphysAnim = requestAnimationFrame(_cphysStep);
}

function _cphysStep() {
  const stageEl = document.getElementById('stage');
  if (!stageEl) { _cphysAnim = null; return; }
  const stageW = stageEl.clientWidth;
  const stageH = stageEl.clientHeight;
  // getBoundingClientRect は 300ms ごとにのみ呼ぶ（毎フレームのレイアウトリフローを削減）
  const now300 = performance.now();
  if (!_cphysRectCache || now300 - _cphysRectTs > 300) {
    _cphysRectCache = stageEl.getBoundingClientRect();
    _cphysRectTs = now300;
  }
  const rect = _cphysRectCache;
  const hasBullets = typeof kaiBullets !== 'undefined' && kaiBullets.length > 0;

  for (const o of _cphysObjs) {
    const sleeping = o.vy === 0 && Math.abs(o.vx) < 0.1;

    if (!sleeping) {
      o.vy += commentPhysGravity;
      o.x  += o.vx;
      o.y  += o.vy;

      // 壁・床の反射
      if (o.x < 0)            { o.x = 0;            o.vx =  Math.abs(o.vx) * commentPhysRestitution; }
      if (o.x + o.w > stageW) { o.x = stageW - o.w; o.vx = -Math.abs(o.vx) * commentPhysRestitution; }
      if (o.y + o.h > stageH) {
        o.y = stageH - o.h;
        o.vy = -Math.abs(o.vy) * commentPhysRestitution;
        o.vx *= 0.9;
        if (Math.abs(o.vy) < 1.2) { o.vy = 0; o.vx *= 0.6; } // 着地して静止
      }
    }

    // 射コマンドの弾と衝突 → 消滅（+1MP・バーストエフェクト）
    if (!o._destroyBy && hasBullets) {
      for (const b of kaiBullets) {
        const nx = Math.max(o.x, Math.min(b.x, o.x + o.w));
        const ny = Math.max(o.y, Math.min(b.y, o.y + o.h));
        const dx = b.x - nx, dy = b.y - ny;
        if (dx * dx + dy * dy < b.r * b.r) {
          o._destroyBy = b.user ?? null;
          break;
        }
      }
    }
  }

  // 箱どうしの簡易分離（積み上がり）。x方向のバケットで近傍のみ比較し、最大500個でも軽量に保つ
  const _sep = (a, c) => {
    if (a.x < c.x + c.w && a.x + a.w > c.x && a.y < c.y + c.h && a.y + a.h > c.y) {
      const overlapY = Math.min(a.y + a.h - c.y, c.y + c.h - a.y);
      if (a.y < c.y) { a.y -= overlapY / 2; c.y += overlapY / 2; } // 上にある方を持ち上げて縦に積む
      else            { a.y += overlapY / 2; c.y -= overlapY / 2; }
      a.vy *= 0.5; c.vy *= 0.5;
    }
  };
  const BW = 90;
  const buckets = new Map();
  for (const o of _cphysObjs) {
    const col = Math.floor((o.x + o.w / 2) / BW);
    let arr = buckets.get(col); if (!arr) buckets.set(col, arr = []);
    arr.push(o);
  }
  for (const [col, list] of buckets) {
    const right = buckets.get(col + 1);
    for (let x = 0; x < list.length; x++) {
      for (let y = x + 1; y < list.length; y++) _sep(list[x], list[y]);
      if (right) for (let y = 0; y < right.length; y++) _sep(list[x], right[y]);
    }
  }

  for (const o of _cphysObjs) {
    o.el.style.transform = `translate(${(rect.left + o.x).toFixed(1)}px,${(rect.top + o.y).toFixed(1)}px)`;
  }

  // 弾が命中したオブジェクトの消滅処理（レンダリング後に実行してクローンの座標を正確にする）
  if (_cphysObjs.some(o => o._destroyBy !== undefined)) {
    const _hit = _cphysObjs.filter(o => o._destroyBy !== undefined);
    _cphysObjs = _cphysObjs.filter(o => o._destroyBy === undefined);
    for (const o of _hit) _commentPhysDestroy(o, o._destroyBy);
  }

  _cphysAnim = _cphysObjs.length > 0 ? requestAnimationFrame(_cphysStep) : null;
}

function clearCommentPhys() {
  _cphysObjs.forEach(o => o.el?.remove());
  _cphysObjs = [];
  if (_cphysAnim) { cancelAnimationFrame(_cphysAnim); _cphysAnim = null; }
}

// ══════════════════════════════════════════════════════════════════
//  ②③ 配信サマリー：集計 → エンドカード表示 ＋ 記憶日記の生成・保存
// ══════════════════════════════════════════════════════════════════
// キャラの表示画像URL（ステージのアバターと同じ解決ロジック）
function _userImgUrl(u) {
  const file = (u && (u.charImage || (u.charDef && typeof charImages !== 'undefined' && charImages[u.charDef.id]))) || 'kisyokeee.png';
  return '/chara-s/' + encodeURIComponent(file);
}

function _collectStreamStats() {
  const us = Object.values(typeof users !== 'undefined' ? users : {});
  // 参加者＝コメントしたキャラ（masterは除外）。各部門の1位は参加者の中から選ぶ
  const participants = us.filter(u => (u.commentCount || 0) > 0 && !u.isMaster);
  let totalComments = 0;
  participants.forEach(u => { totalComments += (u.commentCount || 0); });

  // 部門定義（value が threshold 以下の部門は表示しない）
  const defs = [
    { key: 'mvp',   icon: '🏆', label: 'MVP（最多コメント）', val: u => u.commentCount || 0,                unit: 'コメント', min: 1 },
    { key: 'dmg',   icon: '⚔️', label: 'ダメージ王',          val: u => u.totalDmgDealt || 0,              unit: 'ダメージ', min: 1 },
    { key: 'level', icon: '📈', label: 'レベル王',            val: u => u.level || 1,                      unit: '',         min: 2, lvl: true },
    { key: 'atk',   icon: '💥', label: '攻撃力王',            val: u => u.atk || 0,                        unit: 'ATK',      min: 1 },
    { key: 'hp',    icon: '❤️', label: 'タフネス王',          val: u => u.maxHp || 0,                      unit: 'HP',       min: 1 },
    { key: 'boss',  icon: '🛡️', label: '歴戦の勇者（ボス参加）', val: u => (u.tc && u.tc.bossParticipations) || 0, unit: '戦',   min: 1 },
  ];

  const departments = [];
  defs.forEach(def => {
    let best = null, bestV = -Infinity;
    participants.forEach(u => { const v = def.val(u) || 0; if (v > bestV) { bestV = v; best = u; } });
    if (!best || bestV < def.min) return;
    departments.push({
      key: def.key, icon: def.icon, label: def.label,
      name: best.name || '名無し',
      img: _userImgUrl(best),
      value: bestV,
      valueText: def.lvl ? ('Lv.' + bestV) : (bestV + (def.unit ? ' ' + def.unit : '')),
    });
  });

  const get = k => departments.find(d => d.key === k);
  const mvp = get('mvp'), dmg = get('dmg'), lvl = get('level');
  return {
    date: new Date().toISOString().slice(0, 10),
    durationMin:  _streamStartAt ? Math.max(1, Math.round((Date.now() - _streamStartAt) / 60000)) : 0,
    totalComments,
    commenters:   participants.length,
    bossDefeats:  (typeof bossCount !== 'undefined' ? bossCount : 0),
    departments,
    highlights:   _streamHighlights.slice(-8),
    // 日記生成用のスカラー（後方互換）
    mvpName:      mvp ? mvp.name : '',
    mvpComments:  mvp ? mvp.value : 0,
    dmgMvpName:   dmg ? dmg.name : '',
    dmgMvpTotal:  dmg ? dmg.value : 0,
    topLevelName: lvl ? lvl.name : '',
    topLevel:     lvl ? lvl.value : 1,
  };
}

// 配信終了：エンドカードを表示し、記憶日記を生成・保存する（admin の「配信終了」ボタンから）
async function _streamEndSummary() {
  const stats = _collectStreamStats();
  _showEndCard(stats);
  await _saveStreamDiary(stats);
}

// ── コメント総評（現在の全コメントを Ollama に送って配信を総評。黒板モーダルで表示） ──
function _showReviewModal(text, loading) {
  document.getElementById('streamReviewModal')?.remove();
  const m = document.createElement('div');
  m.id = 'streamReviewModal';
  m.className = 'stream-review-modal';
  m.innerHTML = `
    <div class="sr-board">
      <div class="sr-title">📋 配信総評</div>
      <div class="sr-text${loading ? ' sr-loading' : ''}">${_escHtml(text)}</div>
      <img class="sr-char" src="/souhyou/kousi.png" alt="" onerror="this.style.display='none'">
    </div>`;
  document.body.appendChild(m);
  _applyReviewCharStyle();
  _applyReviewBoardStyle();
  m.addEventListener('click', e => { if (e.target === m) m.remove(); });
  return m;
}

async function _streamReview() {
  _showReviewModal('黒板に総評を書いています…', true);

  // cnum=0 で全件を1回取得（サーバー起動前のコメントも含む）
  let comments = null;
  if (apikey) {
    try {
      let url = `/api/comments?apikey=${encodeURIComponent(apikey)}&cnum=0`;
      if (hash) url += `&hash=${encodeURIComponent(hash)}`;
      const res  = await fetch(url);
      const data = await res.json();
      const raw  = Array.isArray(data.comments) ? data.comments : [];
      comments = raw
        .filter(c => c.message && String(c.message).replace(/<[^>]+>/g, '').trim())
        .map(c => ({ name: c.icon_name || '名無し', text: String(c.message).replace(/<[^>]+>/g, '').trim() }));
    } catch(e) { comments = null; }
  }
  // API未設定・失敗時はメモリ上のコメントにフォールバック
  if (!comments) comments = _streamComments;

  if (!comments.length) { _showReviewModal('まだコメントがありません。配信が始まってから総評できます。'); return; }

  // 全コメントをそのまま使用（qwen2.5-1m 等コンテキスト100万トークンのモデルを前提）
  const lines = comments.map(c => c.text);
  const stats = _collectStreamStats();
  const sys = (reviewSystem && reviewSystem.trim()) ? reviewSystem.trim() : REVIEW_DEFAULT_SYSTEM;
  const user =
    `今日の配信のデータ:\n・コメント総数 ${stats.totalComments} / 参加者 ${stats.commenters}人 / 約${stats.durationMin}分\n` +
    `・ボス討伐 ${stats.bossDefeats}\n\n` +
    `視聴者コメント（一部）:\n${lines.join('\n')}\n\n上記をもとに、今日の配信を総評してください。`;
  try {
    const res = await fetch('/api/ai-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: user }], model: (typeof aiModel !== 'undefined' ? aiModel : undefined), system: sys, numCtx: reviewNumCtx }),
    });
    const data = await res.json();
    const txt = (!data.error && data.reply) ? data.reply.trim().replace(/^\[[^\]]*\]\s*/gm, '').trim() : '';
    _showReviewModal(txt || '総評の生成に失敗しました。Ollamaの状態を確認してください。');
  } catch (e) {
    _showReviewModal('総評の生成中にエラーが発生しました: ' + e.message);
  }
}

let _ecTimer = null;
let _ecJanAudio = null;
const EC_JAN_SOUND = '/sound/endcard/' + encodeURIComponent('nc201523_【効果音】ジャン！（短）.mp3');
function _ecPlayJan() {
  try {
    if (!_ecJanAudio) _ecJanAudio = new Audio(EC_JAN_SOUND);
    _ecJanAudio.volume = Math.max(0, Math.min(1, endCardVolume / 100));
    _ecJanAudio.currentTime = 0;
    _ecJanAudio.play().catch(() => {});
  } catch (e) {}
}

// リストを上から下へゆっくり自動スクロールし、末尾で少し待って先頭へループ。停止関数を返す
let _ecScrollers = [];
function _ecAutoScroll(el) {
  if (!el) return () => {};
  let raf = null, wait = 60, atBottom = false, pos = 0;
  const speed = 0.7; // px/フレーム
  const step = () => {
    const max = el.scrollHeight - el.clientHeight;
    if (max > 2) {
      if (wait > 0) {
        wait--;
      } else if (atBottom) {
        pos = 0; el.scrollTop = 0; atBottom = false; wait = 50;    // 先頭で少し待つ
      } else {
        pos += speed;                                              // 浮動小数で累積（丸めで止まらないように）
        if (pos >= max) { pos = max; atBottom = true; wait = 110; } // 末尾で待つ
        el.scrollTop = pos;
      }
    }
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => { if (raf) cancelAnimationFrame(raf); };
}

// admin の「エンドカードを閉じる」ボタン等から呼ぶグローバルな閉じる処理
function closeEndCard() {
  if (_ecTimer) { clearInterval(_ecTimer); _ecTimer = null; }
  _ecScrollers.forEach(stop => { try { stop(); } catch (e) {} });
  _ecScrollers = [];
  document.getElementById('streamEndCard')?.remove();
}

function _showEndCard(s) {
  document.getElementById('streamEndCard')?.remove();
  if (_ecTimer) { clearInterval(_ecTimer); _ecTimer = null; }

  const depts = s.departments || [];
  const allHi = _streamHighlights;
  const hi = allHi.length
    ? allHi.map(h => `<li>${_escHtml(h)}</li>`).join('')
    : '<li class="ec-dim">特筆すべき名場面はおだやかな雑談でした</li>';
  const comments = _streamComments;
  const commentsHtml = comments.length
    ? comments.map(c => `<li><span class="ec-cm-name">${_escHtml(c.name)}</span><span class="ec-cm-text">${_escHtml(c.text)}</span></li>`).join('')
    : '<li class="ec-dim">コメントはありませんでした</li>';
  const listHtml = depts.length
    ? depts.map((d, i) => `
        <li class="ec-rank-item" data-i="${i}">
          <span class="ec-rk-ico">${d.icon}</span>
          <span class="ec-rk-lbl">${_escHtml(d.label)}</span>
          <span class="ec-rk-name">${_escHtml(d.name)}</span>
          <span class="ec-rk-val">${_escHtml(d.valueText)}</span>
        </li>`).join('')
    : '<li class="ec-dim">参加者がいませんでした</li>';

  const card = document.createElement('div');
  card.id = 'streamEndCard';
  card.className = 'stream-end-card';
  card.innerHTML = `
    <div class="ec-frame" style="width:${endCardWidth}px;height:min(${endCardHeight}px, 96vh)">
      <div class="ec-inner">
        <div class="ec-title">✨ 今日の配信 ✨</div>
        <div class="ec-date">${_escHtml(s.date)}　${s.durationMin}分</div>
        <div class="ec-grid">
          <div class="ec-cell"><div class="ec-num">${s.totalComments}</div><div class="ec-lbl">コメント</div></div>
          <div class="ec-cell"><div class="ec-num">${s.commenters}</div><div class="ec-lbl">参加者</div></div>
          <div class="ec-cell"><div class="ec-num">${s.bossDefeats}</div><div class="ec-lbl">ボス討伐</div></div>
        </div>
        <div class="ec-body">
          <div class="ec-slide" id="ecSlide"></div>
          <ul class="ec-ranklist">${listHtml}</ul>
        </div>
        <div class="ec-lists">
          <div class="ec-list-col">
            <div class="ec-hi-title">💬 今日のコメント（${comments.length}）</div>
            <ul class="ec-comments" id="ecComments">${commentsHtml}</ul>
          </div>
          <div class="ec-list-col">
            <div class="ec-hi-title">📌 名場面</div>
            <ul class="ec-hi" id="ecHi">${hi}</ul>
          </div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(card);

  // コメント一覧・名場面を自動スクロール
  _ecScrollers.forEach(stop => { try { stop(); } catch (e) {} });
  _ecScrollers = [
    _ecAutoScroll(card.querySelector('#ecComments')),
    _ecAutoScroll(card.querySelector('#ecHi')),
  ];

  const slide = card.querySelector('#ecSlide');
  const items = [...card.querySelectorAll('.ec-rank-item')];
  let idx = 0;
  const render = () => {
    const d = depts[idx];
    if (d && slide) {
      slide.innerHTML = `
        <div class="ec-slide-card">
          <div class="ec-portrait"><div class="ec-portrait-glow"></div><img src="${d.img}" alt="" onerror="this.style.visibility='hidden'"></div>
          <div class="ec-medal">${d.icon}</div>
          <div class="ec-slide-info">
            <div class="ec-slide-lbl">${_escHtml(d.label)}</div>
            <div class="ec-slide-name">👑 ${_escHtml(d.name)}</div>
            <div class="ec-slide-val">${_escHtml(d.valueText)}</div>
          </div>
        </div>`;
      slide.classList.remove('ec-anim'); void slide.offsetWidth; slide.classList.add('ec-anim');
      _ecPlayJan(); // 部門MVP表示のたびに「ジャン！」を再生
    }
    items.forEach(li => li.classList.toggle('active', +li.dataset.i === idx));
  };
  const startAuto = () => {
    if (_ecTimer) clearInterval(_ecTimer);
    if (depts.length > 1) _ecTimer = setInterval(() => { idx = (idx + 1) % depts.length; render(); }, 2800);
  };
  if (depts.length) { render(); startAuto(); }
  items.forEach(li => li.addEventListener('click', () => { idx = +li.dataset.i; render(); startAuto(); }));
}

function _escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// 集計を Ollama でアゲルちゃん視点の日記に変換して保存
async function _saveStreamDiary(stats) {
  let diaryText = '';
  try {
    const lines = [
      `配信時間: 約${stats.durationMin}分`,
      `コメント総数: ${stats.totalComments}（参加者${stats.commenters}人）`,
      stats.mvpName     ? `一番たくさん話しかけてくれたのは「${stats.mvpName}」さん（${stats.mvpComments}コメント）` : '',
      stats.dmgMvpName  ? `ボスに一番ダメージを与えたのは「${stats.dmgMvpName}」さん` : '',
      stats.topLevelName? `一番レベルが上がったのは「${stats.topLevelName}」さん（Lv.${stats.topLevel}）` : '',
      stats.bossDefeats ? `ボスを${stats.bossDefeats}体倒した` : '',
      ...(stats.highlights || []).map(h => `できごと: ${h}`),
    ].filter(Boolean).join('\n');

    const sys = (typeof AGRU_DEFAULT_SYSTEM !== 'undefined' ? AGRU_DEFAULT_SYSTEM.split('\n')[1] || '' : '') +
      '\nあなたは配信が終わったあと、その日をふり返って短い日記を書きます。' +
      '以下のできごとをもとに、あなたの口調で2〜3文の日記を日本語のみで書いてください。' +
      '箇条書きや感情ラベル・好感度表記は不要。日記本文だけを書いてください。';
    const res = await fetch('/api/ai-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: '今日の配信のできごと:\n' + lines + '\n\n上記をもとに今日の日記を書いてください。' }],
        model: (typeof aiModel !== 'undefined' ? aiModel : undefined),
        system: sys,
      }),
    });
    const data = await res.json();
    if (!data.error && data.reply) {
      diaryText = data.reply.trim().replace(/^\[[^\]]*\]\s*/gm, '').trim(); // 念のため感情ラベル除去
    }
  } catch (e) {}

  if (!diaryText) {
    // Ollama 失敗時のフォールバック（集計だけで日記化）
    diaryText = `今日は${stats.totalComments}個もコメントをもらえた！` +
      (stats.mvpName ? ` ${stats.mvpName}さんがいっぱい話しかけてくれて嬉しかったな。` : '') +
      (stats.bossDefeats ? ` ボスも${stats.bossDefeats}体やっつけた！` : '');
  }

  try {
    await fetch('/api/agru-diary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: stats.date, text: diaryText, stats }),
    });
    if (typeof _agruLog === 'function') _agruLog('記憶日記を保存しました: ' + diaryText, 'ok');
  } catch (e) {}
}

// 起動時の回想：直近の日記を読み込み、システムプロンプトへ注入する文脈を作る
async function _agruLoadDiaryRecall() {
  try {
    const res = await fetch('/api/agru-diary?latest=1');
    const data = await res.json();
    const latest = data.latest;
    const today = new Date().toISOString().slice(0, 10);
    if (latest && latest.text && latest.date !== today) {
      _agruDiaryRecall =
        '【前回の配信の記憶】前回（' + latest.date + '）の配信ではこんなことがありました:「' + latest.text + '」。' +
        '会話の流れで自然に「前は〜だったね」と振り返ってもかまいません（毎回触れる必要はありません）。';
    } else {
      _agruDiaryRecall = '';
    }
  } catch (e) {
    _agruDiaryRecall = '';
  }
}
