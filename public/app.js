// ──────────────────────────────────────────────────────────────────
// キャラ定義（1〜500 を動的生成）
// ──────────────────────────────────────────────────────────────────
const CHAR_EMOJIS = [
  '🐱','🐶','🐸','🐻','🦊','🐰','🐼','🐯','🦁','🐨',
  '🦆','🐧','🐺','🦋','🐝','🐢','🦀','🐙','🦑','🐠',
  '🐬','🐳','🦈','🐊','🦎','🦕','🦜','🦩','🦚','🌸',
  '⭐','🌈','🌙','☀️','🔥','💎','🌊','🍀','🎵','🎮',
  '🏆','🎭','🎨','🎪','🌺','🍭','🦄','🐲','🌻','🎯',
];
const CHAR_BGS = [
  '#FFB6C1','#ADD8E6','#90EE90','#DEB887','#FFA07A',
  '#F8BBD0','#D3D3D3','#FFD700','#DAA520','#B0C4DE',
  '#E6E6FA','#98FB98','#FFDAB9','#E0FFFF','#FFFACD',
  '#F0FFF0','#FFE4E1','#FFF5EE','#F5F5DC','#E8F4F8',
];

function getCharDef(id) {
  return {
    id,
    name:  `キャラ${id}`,
    emoji: CHAR_EMOJIS[(id - 1) % CHAR_EMOJIS.length],
    bg:    CHAR_BGS[(id - 1) % CHAR_BGS.length],
  };
}

// ──────────────────────────────────────────────────────────────────
// 定数
// ──────────────────────────────────────────────────────────────────
const COLOR_NAMES = {
  '赤': '#FF4444', '青': '#4499FF', '緑': '#44CC44',
  '黄': '#FFCC00', '紫': '#CC44CC', '白': '#FFFFFF',
  '黒': '#222222', 'ピンク': '#FF88BB', '橙': '#FF8800',
  'オレンジ': '#FF8800', 'シアン': '#00CCCC', 'ライム': '#88FF00',
  '水色': '#87CEEB', '茶': '#A0522D', '灰': '#888888',
};
const SHAPE_MAP     = { '丸': 'round', '四角': 'square', '雲': 'cloud', '棘': 'spike' };
const MOVE_INTERVAL = { '速い': 1200, '普通': 2800, '遅い': 5500, '止まれ': 0 };
const MOVE_DURATION = { '速い':  900, '普通': 2200, '遅い': 4500, '止まれ': 0 };
const SIZE_MAP      = { '大': 120, '中': 80, '小': 48 };
const TEXT_SIZE_MAP = { '極大': '32px', '大': '20px', '中': '13px', '小': '10px', '極小': '8px' };

// フォントエイリアス（スペースを含むフォント名の短縮形）
const FONT_MAP = {
  'デフォルト': '', 'リセット': '',
  // 日本語ゴシック
  'MSゴシック':      '"MS Gothic"',
  'MSPゴシック':     '"MS PGothic"',
  'MSUIゴシック':    '"MS UI Gothic"',
  'BIZUDゴシック':   '"BIZ UDGothic"',
  'BIZUDPゴシック':  '"BIZ UDPGothic"',
  // 日本語明朝
  'MS明朝':         '"MS Mincho"',
  'MSP明朝':        '"MS PMincho"',
  'BIZUDMincho':    '"BIZ UDMincho Medium"',
  'BIZUDPMincho':   '"BIZ UDPMincho Medium"',
  // 游フォント
  'YuGothic':       '"Yu Gothic"',
  'YuGothicLight':  '"Yu Gothic Light"',
  'YuGothicMedium': '"Yu Gothic Medium"',
  'YuGothicUI':     '"Yu Gothic UI"',
  'YuMincho':       '"Yu Mincho"',
  'YuMinchoLight':  '"Yu Mincho Light"',
  'YuMinchoDemi':   '"Yu Mincho Demibold"',
  // UD教科書体
  'UDデジタルN':    '"UD Digi Kyokasho N"',
  'UDデジタルNK':   '"UD Digi Kyokasho NK"',
  'UDデジタルNP':   '"UD Digi Kyokasho NP"',
  // Noto
  'NotoSansJP':     '"Noto Sans JP"',
  'NotoSansJPBlack':'"Noto Sans JP Black"',
  'NotoSerifJP':    '"Noto Serif JP"',
  // その他日本語
  'DelaGothicOne':  '"Dela Gothic One"',
  'MeirioUI':       '"Meiryo UI"',
  // 英語フォント
  'ArialBlack':     '"Arial Black"',
  'CascadiaCode':   '"Cascadia Code"',
  'CascadiaMono':   '"Cascadia Mono"',
  'ComicSans':      '"Comic Sans MS"',
  'CourierNew':     '"Courier New"',
  'FranklinGothic': '"Franklin Gothic Medium"',
  'InkFree':        '"Ink Free"',
  'LucidaConsole':  '"Lucida Console"',
  'LucidaSans':     '"Lucida Sans Unicode"',
  'MicrosoftSans':  '"Microsoft Sans Serif"',
  'PalatinoLinotype':'"Palatino Linotype"',
  'SegoePrint':     '"Segoe Print"',
  'SegoeScript':    '"Segoe Script"',
  'SegoeUI':        '"Segoe UI"',
  'TimesNewRoman':  '"Times New Roman"',
  'TrebuchetMS':    '"Trebuchet MS"',
};

// ──────────────────────────────────────────────────────────────────
// 状態
// ──────────────────────────────────────────────────────────────────
const stage     = document.getElementById('stage');
const statusEl  = document.getElementById('status');
const emptyHint = document.getElementById('emptyHint');

// ── 背景色ピッカー ────────────────────────────
const bgColorInput = document.getElementById('bgColor');
(function initBgColor() {
  const saved = localStorage.getItem('bgColor') || '#00FF00';
  bgColorInput.value = saved;
  stage.style.background = saved;
})();
bgColorInput.addEventListener('input', () => {
  stage.style.background = bgColorInput.value;
  localStorage.setItem('bgColor', bgColorInput.value);
});

let users     = {};
let lastCnum  = null;
let pollTimer = null;
let apikey    = '';
let hash      = '';
let dragState = null;

let charImages   = loadCharImages();
let charAliases  = loadCharAliases();
let slotPage     = 0;
const SLOT_SIZE  = 20;

function loadCharImages() {
  try { return JSON.parse(localStorage.getItem('charImages') || '{}'); }
  catch { return {}; }
}
function saveCharImages() {
  localStorage.setItem('charImages', JSON.stringify(charImages));
}

function loadCharAliases() {
  try { return JSON.parse(localStorage.getItem('charAliases') || '{}'); }
  catch { return {}; }
}
function saveCharAliases() {
  localStorage.setItem('charAliases', JSON.stringify(charAliases));
}
function getAliasForId(id) {
  return Object.keys(charAliases).find(k => charAliases[k] === id) || '';
}

// ──────────────────────────────────────────────────────────────────
// ユーザー管理
// ──────────────────────────────────────────────────────────────────
function getUser(ipid) {
  if (!users[ipid]) {
    users[ipid] = {
      ipid,
      name:        '匿名',
      charDef:     null,
      textColor:   '#111111',
      bubbleShape: 'round',
      movement:    '止まれ',
      bounce:      false,
      nameManual:  false,
      size:        80,
      font:        '',
      x: randX(),
      y: randY(),
      el:          null,
      moveTimer:   null,
      bubbleTimer: null,
    };
  }
  return users[ipid];
}

function randX() { return 60 + Math.random() * Math.max(stage.clientWidth  - 200, 100); }
function randY() { return 60 + Math.random() * Math.max(stage.clientHeight - 200, 100); }

// ──────────────────────────────────────────────────────────────────
// キャラクター DOM
// ──────────────────────────────────────────────────────────────────
function ensureCharOnStage(user) {
  if (user.el) return;
  if (!user.charDef) {
    user.charDef = { id: 0, name: '', emoji: '👤', bg: 'transparent' };
  }
  createCharacter(user);
}

function createCharacter(user) {
  const el = document.createElement('div');
  el.className  = 'character';
  el.id         = 'char-' + user.ipid;
  el.style.left = user.x + 'px';
  el.style.top  = user.y + 'px';

  el.innerHTML = `
    <div class="bubble hidden" id="b-${user.ipid}"></div>
    <div class="avatar"    id="a-${user.ipid}"></div>
    <div class="char-name" id="n-${user.ipid}">${escapeHtml(user.name)}</div>
  `;

  stage.appendChild(el);
  user.el = el;
  emptyHint.classList.add('hidden');
  applyAvatarStyle(user);
  scheduleMove(user);
  applyBounce(user);

  el.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    dragState = { user, el, ox: user.x, oy: user.y, sx: e.clientX, sy: e.clientY };
    el.style.transition = 'none';
    if (user.moveTimer) { clearTimeout(user.moveTimer); user.moveTimer = null; }
    e.preventDefault();
  });
}

function applyAvatarStyle(user) {
  const a = document.getElementById('a-' + user.ipid);
  if (!a || !user.charDef) return;
  const px = user.size * 1.5;
  a.style.width  = px + 'px';
  a.style.height = px + 'px';
  const imgFile = charImages[user.charDef.id] || 'kisyokeee.png';
  a.innerHTML      = `<img src="/chara/${encodeURIComponent(imgFile)}" alt="${escapeHtml(user.name)}">`;
  a.style.fontSize = '0';
}

function updateNameDisplay(user) {
  const n = document.getElementById('n-' + user.ipid);
  if (n) n.textContent = user.name;
}

function refreshAllAvatars() {
  Object.values(users).forEach(u => { if (u.el) applyAvatarStyle(u); });
}

// ──────────────────────────────────────────────────────────────────
// 移動
// ──────────────────────────────────────────────────────────────────
function scheduleMove(user) {
  if (user.moveTimer) clearTimeout(user.moveTimer);
  if (user.movement === '止まれ') return;

  const interval = MOVE_INTERVAL[user.movement] ?? 2800;
  const duration = MOVE_DURATION[user.movement] ?? 2200;

  user.moveTimer = setTimeout(() => {
    if (!users[user.ipid] || user.movement === '止まれ') return;
    user.x = randX();
    user.y = randY();
    if (user.el) {
      user.el.style.transition = `left ${duration}ms ease-in-out, top ${duration}ms ease-in-out`;
      user.el.style.left = user.x + 'px';
      user.el.style.top  = user.y + 'px';
    }
    scheduleMove(user);
  }, interval);
}

function applyDirectionalMove(user, dir, amount) {
  if (!user.el) return;
  const charSize = user.size * 1.5;
  const maxX = Math.max(0, stage.clientWidth  - charSize);
  const maxY = Math.max(0, stage.clientHeight - charSize);
  switch (dir) {
    case '上': user.y = Math.max(0,    user.y - amount); break;
    case '下': user.y = Math.min(maxY, user.y + amount); break;
    case '左': user.x = Math.max(0,    user.x - amount); break;
    case '右': user.x = Math.min(maxX, user.x + amount); break;
  }
  user.el.style.transition = 'left 400ms ease-out, top 400ms ease-out';
  user.el.style.left = user.x + 'px';
  user.el.style.top  = user.y + 'px';
}

function applyBounce(user) {
  if (!user.el) return;
  user.el.classList.toggle('bouncing', user.bounce);
}

// ── 集合 ──────────────────────────────────────
function gatherCharacters() {
  const onStage = Object.values(users).filter(u => u.el);
  if (onStage.length === 0) return;

  const GAP      = 20;
  const stageW   = stage.clientWidth;
  const stageH   = stage.clientHeight;
  const charW    = u => u.size * 1.5;

  const totalCharW = onStage.reduce((s, u) => s + charW(u), 0);
  let   gap        = GAP;

  // キャラが多くてはみ出す場合はgapを詰める
  const totalWithGap = totalCharW + GAP * (onStage.length - 1);
  if (totalWithGap > stageW - 40) {
    gap = Math.max(4, (stageW - 40 - totalCharW) / Math.max(1, onStage.length - 1));
  }

  const totalW  = totalCharW + gap * (onStage.length - 1);
  let   x       = Math.max(10, (stageW - totalW) / 2);
  const maxCharH = onStage.reduce((m, u) => Math.max(m, u.size * 1.5 + 24), 0);
  const y        = Math.max(20, stageH - maxCharH * 2);

  onStage.forEach(u => {
    u.x = x;
    u.y = y;
    u.el.style.transition = 'left 600ms cubic-bezier(0.34,1.56,0.64,1), top 600ms cubic-bezier(0.34,1.56,0.64,1)';
    u.el.style.left = u.x + 'px';
    u.el.style.top  = u.y + 'px';
    x += charW(u) + gap;
  });
}

// ──────────────────────────────────────────────────────────────────
// 吹き出し表示
// ──────────────────────────────────────────────────────────────────
function applyCommentStyle(b, style) {
  b.style.fontSize   = style && style.fontSize   ? style.fontSize   : '';
  b.style.fontWeight = style && style.fontWeight ? style.fontWeight : '';
  b.style.fontStyle  = style && style.fontStyle  ? style.fontStyle  : '';
}

function showBubble(user, text, style) {
  const b = document.getElementById('b-' + user.ipid);
  if (!b) return;
  b.textContent = text;
  b.style.color = user.textColor;
  b.style.fontFamily = user.font || '';
  b.className   = `bubble bubble-${user.bubbleShape}`;
  applyCommentStyle(b, style);
  triggerTalk(user, b);
}

// 画像 + キャプション吹き出し
function showImageBubble(user, imgUrl, caption, style) {
  const b = document.getElementById('b-' + user.ipid);
  if (!b) return;
  if (!isSafeUrl(imgUrl)) return;
  b.innerHTML = `<div class="bubble-img-wrap">
    <img class="bubble-img" src="${escapeAttr(imgUrl)}" loading="lazy" onerror="this.style.display='none'">
    ${caption ? `<div class="bubble-caption">${escapeHtml(caption)}</div>` : ''}
  </div>`;
  b.style.color = user.textColor;
  b.style.fontFamily = user.font || '';
  b.className   = `bubble bubble-${user.bubbleShape}`;
  applyCommentStyle(b, style);
  triggerTalk(user, b);
}

// emotion オブジェクトから画像URLを探す（フィールド名が不定のため）
function findEmotionUrl(e) {
  if (!e || typeof e !== 'object') return null;
  for (const key of ['url', 'image_url', 'img_url', 'image', 'img', 'src']) {
    if (e[key] && typeof e[key] === 'string' && isSafeUrl(e[key])) return e[key];
  }
  for (const val of Object.values(e)) {
    if (typeof val === 'string' && isSafeUrl(val)) return val;
  }
  return null;
}

function findEmotionLabel(e) {
  return (e && (e.message || e.name || e.label || e.text || e.title)) || '';
}

// エモーション吹き出し（複数画像 + ラベル、その下にメッセージ）
function showEmotionBubble(user, emotions, message, style) {
  const b = document.getElementById('b-' + user.ipid);
  if (!b) return;

  const items = emotions
    .map(e => ({ url: findEmotionUrl(e), label: findEmotionLabel(e) }))
    .filter(({ url }) => url)
    .map(({ url, label }) => `<div class="bubble-emotion-item">
      <img class="bubble-emotion-img" src="${escapeAttr(url)}" loading="lazy" onerror="this.style.display='none'">
      ${label ? `<div class="bubble-emotion-label">${escapeHtml(label)}</div>` : ''}
    </div>`)
    .join('');

  b.innerHTML = `<div class="bubble-img-wrap">
    <div class="bubble-emotions">${items}</div>
    ${message ? `<div class="bubble-caption">${escapeHtml(message)}</div>` : ''}
  </div>`;
  b.style.color = user.textColor;
  b.style.fontFamily = user.font || '';
  b.className   = `bubble bubble-${user.bubbleShape}`;
  applyCommentStyle(b, style);
  triggerTalk(user, b);
}

function triggerTalk(user, bubbleEl) {
  bubbleEl.classList.remove('hidden');
  if (user.el) {
    user.el.classList.add('talking');
    setTimeout(() => user.el && user.el.classList.remove('talking'), 600);
  }
  if (user.bubbleTimer) clearTimeout(user.bubbleTimer);
  user.bubbleTimer = setTimeout(() => { bubbleEl.classList.add('hidden'); }, 8000);
}

// ──────────────────────────────────────────────────────────────────
// 音声再生
// ──────────────────────────────────────────────────────────────────
function playVoice(url) {
  if (!isSafeUrl(url)) return;
  try {
    const audio = new Audio(url);
    audio.volume = 0.8;
    audio.play().catch(() => {});
  } catch {}
}

// ──────────────────────────────────────────────────────────────────
// URL検証
// ──────────────────────────────────────────────────────────────────
function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch { return false; }
}

function resolveColor(v) {
  if (/^#[0-9a-fA-F]{3,6}$/.test(v)) return v;
  return COLOR_NAMES[v] || null;
}

// ──────────────────────────────────────────────────────────────────
// コメント処理
// ──────────────────────────────────────────────────────────────────
function handleComment(comment) {
  if (comment.from === 'admin') return;

  console.log('[comment]', JSON.stringify(comment, null, 2));

  const type  = comment.type || 'comment';
  const ipid  = comment.ipid || comment.from || 'master';
  const user  = getUser(ipid);

  // ── icon_name で名前を自動設定（手動設定がない場合のみ） ──
  if (comment.icon_name && !user.nameManual) {
    user.name = comment.icon_name.includes('匿名') ? '名無し' : comment.icon_name;
    updateNameDisplay(user);
  }

  // ── 音声コメント（どのタイプでも再生） ──────
  if (comment.voicecomment_url) playVoice(comment.voicecomment_url);

  // ── visualchat (お絵描きコメント) ──────────
  if (type === 'visualchat') {
    if (comment.visualchat_url) {
      ensureCharOnStage(user);
      showImageBubble(user, comment.visualchat_url, comment.message ? stripPrefix(comment.message) : '');
      addToLog(user, '[お絵描き]', '#7dd3fc');
    }
    return;
  }

  // ── 通常コメント以外はスキップ ─────────────
  if (type !== 'comment') return;

  const rawMessage = comment.message ?? '';
  const message    = stripPrefix(rawMessage);

  // ── キャラN またはエイリアス ─────────────────
  const charM = message.match(/^キャラ(\d{1,3})$/);
  const aliasId = !charM && Object.prototype.hasOwnProperty.call(charAliases, message)
    ? charAliases[message] : null;
  const charChangeId = charM ? parseInt(charM[1]) : aliasId;
  if (charChangeId != null) {
    const id = charChangeId;
    if (id < 1 || id > 500) return;
    user.charDef = getCharDef(id);
    if (!user.el) {
      createCharacter(user);
    } else {
      applyAvatarStyle(user);
    }
    updateNameDisplay(user);
    addToLog(user, `[キャラ${id}に変更]`, '#64748b');
    return;
  }

  // ── インラインコマンド ───────────────────────
  let display = message;

  const nameM = display.match(/名前[：:]([\S]{1,20})/);
  if (nameM) { user.name = nameM[1]; user.nameManual = true; updateNameDisplay(user); display = display.replace(nameM[0], '').trim(); }

  const colorM = display.match(/色[：:]([\S]+)/);
  if (colorM) { const c = resolveColor(colorM[1]); if (c) user.textColor = c; display = display.replace(colorM[0], '').trim(); }

  const bubbleM = display.match(/吹き出し[：:]([\S]+)/);
  if (bubbleM) { const s = SHAPE_MAP[bubbleM[1]]; if (s) user.bubbleShape = s; display = display.replace(bubbleM[0], '').trim(); }

  const moveM = display.match(/移動[：:]([\S]+)/);
  if (moveM) {
    if (MOVE_INTERVAL[moveM[1]] !== undefined) {
      user.movement = moveM[1];
      if (moveM[1] === '止まれ') { user.bounce = false; applyBounce(user); }
      if (user.el) scheduleMove(user);
    }
    display = display.replace(moveM[0], '').trim();
  }

  // 方向移動（順番に実行）
  const dirMoves = [];
  display = display.replace(/([上下左右])[：:](\d+)/g, (_, dir, amt) => {
    dirMoves.push({ dir, amt: Math.min(parseInt(amt, 10), 2000) });
    return '';
  }).trim();
  if (dirMoves.length > 0) {
    ensureCharOnStage(user);
    dirMoves.forEach((move, i) => {
      setTimeout(() => { if (user.el) applyDirectionalMove(user, move.dir, move.amt); }, i * 450);
    });
  }

  const sizeM = display.match(/大きさ[：:]([\S]+)/);
  if (sizeM) { const sz = SIZE_MAP[sizeM[1]]; if (sz) { user.size = sz; ensureCharOnStage(user); applyAvatarStyle(user); } display = display.replace(sizeM[0], '').trim(); }

  const fontM = display.match(/フォント[：:]([\S]+)/);
  if (fontM) { const key = fontM[1]; user.font = Object.prototype.hasOwnProperty.call(FONT_MAP, key) ? FONT_MAP[key] : key; display = display.replace(fontM[0], '').trim(); }

  if (/はずむ/.test(display)) {
    user.bounce = true;
    ensureCharOnStage(user);
    applyBounce(user);
    display = display.replace(/はずむ/g, '').trim();
  }

  // ── コメント単位スタイル（永続しない） ───────
  const commentStyle = {};
  const textSizeM = display.match(/文字サイズ[：:](\S+)/);
  if (textSizeM) {
    const v = textSizeM[1];
    const mapped = TEXT_SIZE_MAP[v] || (/^\d+$/.test(v) ? `${Math.min(72, Math.max(8, +v))}px` : null);
    if (mapped) commentStyle.fontSize = mapped;
    display = display.replace(textSizeM[0], '').trim();
  }
  if (/太字/.test(display)) { commentStyle.fontWeight = 'bold'; display = display.replace(/太字/g, '').trim(); }
  if (/斜体/.test(display)) { commentStyle.fontStyle  = 'italic'; display = display.replace(/斜体/g, '').trim(); }

  // ── flag_first: 初コメは太字 + 登場振動 ──────
  if (comment.flag_first === '1' || comment.flag_first === 1) {
    if (!commentStyle.fontWeight) commentStyle.fontWeight = 'bold';
    setTimeout(() => {
      if (user.el) {
        user.el.classList.add('shaking');
        setTimeout(() => user.el && user.el.classList.remove('shaking'), 2250);
      }
    }, 0);
  }

  // ── メディア優先表示 ─────────────────────────
  // sscomment（スクリーンショット）
  if (comment.sscomment_url) {
    ensureCharOnStage(user);
    showImageBubble(user, comment.sscomment_url, display || '', commentStyle);
    addToLog(user, display ? `[SS] ${display}` : '[スクリーンショット]', '#94a3b8');
    return;
  }

  // emotions（エモーション）
  const emotions = Array.isArray(comment.emotions) ? comment.emotions.filter(e => findEmotionUrl(e)) : [];
  if (emotions.length > 0) {
    ensureCharOnStage(user);
    showEmotionBubble(user, emotions, display || '', commentStyle);
    addToLog(user, display ? `[エモ] ${display}` : '[エモーション]', '#a78bfa');
    return;
  }

  // message_additional（追加コンテンツ）
  if (Array.isArray(comment.message_additional) && comment.message_additional.length > 0) {
    const extra = comment.message_additional;
    const mediaUrl = extra.find(item =>
      (typeof item === 'string' && isSafeUrl(item)) ||
      (item && isSafeUrl(item.url))
    );
    if (mediaUrl) {
      const url = typeof mediaUrl === 'string' ? mediaUrl : mediaUrl.url;
      ensureCharOnStage(user);
      showImageBubble(user, url, display || '', commentStyle);
      addToLog(user, display || '[追加コンテンツ]', '#94a3b8');
      return;
    }
  }

  // ── 通常テキスト ─────────────────────────────
  if (!display) { addToLog(user, message, '#475569'); return; }

  ensureCharOnStage(user);
  showBubble(user, display, commentStyle);
  const logColor = user.textColor === '#111111' ? '#e2e8f0' : user.textColor;
  addToLog(user, display, logColor);
}

function stripPrefix(msg) {
  return (msg ?? '').replace(/^\d+:\s*/, '').trim();
}

// ──────────────────────────────────────────────────────────────────
// ログ
// ──────────────────────────────────────────────────────────────────
function addToLog(user, text, color) {
  const list = document.getElementById('commentList');
  const item = document.createElement('div');
  item.className = 'log-item';
  item.innerHTML =
    `<span class="log-avatar">${user.charDef ? user.charDef.emoji : '👤'}</span>` +
    `<span class="log-name">${escapeHtml(user.name)}</span>` +
    `<span class="log-msg" style="color:${color || '#e2e8f0'}">${escapeHtml(text)}</span>`;
  list.appendChild(item);
  list.scrollTop = list.scrollHeight;
  while (list.children.length > 300) list.removeChild(list.firstChild);
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function escapeAttr(s) {
  return String(s).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ──────────────────────────────────────────────────────────────────
// API ポーリング
// ──────────────────────────────────────────────────────────────────
async function fetchComments() {
  let url = `/api/comments?apikey=${encodeURIComponent(apikey)}`;
  if (hash)     url += `&hash=${encodeURIComponent(hash)}`;
  if (lastCnum) url += `&cnum=${lastCnum}`;

  try {
    const res  = await fetch(url);
    const data = await res.json();
    if (data.error) { setStatus('error', `● エラー: ${data.error}`); return; }

    const comments = Array.isArray(data.comments) ? data.comments : [];
    if (comments.length > 0) {
      const lastInBatch = String(comments[comments.length - 1].cnum);
      if (lastCnum === null) {
        lastCnum = lastInBatch;
      } else {
        const newOnes = comments.filter(c => Number(c.cnum) > Number(lastCnum));
        if (newOnes.length > 0) { newOnes.forEach(handleComment); lastCnum = lastInBatch; }
      }
    }

    const onStage = Object.values(users).filter(u => u.el).length;
    setStatus('running', `● 受信中 (${onStage} キャラ)`);
  } catch (err) {
    console.error(err);
    setStatus('error', '● 通信エラー');
  }
}

function setStatus(type, text) { statusEl.textContent = text; statusEl.className = `status-${type}`; }

// ──────────────────────────────────────────────────────────────────
// コントロール
// ──────────────────────────────────────────────────────────────────
document.getElementById('startBtn').addEventListener('click', () => {
  apikey = document.getElementById('apikey').value.trim();
  hash   = document.getElementById('hash').value.trim();
  if (!apikey) { alert('APIキーを入力してください'); return; }
  lastCnum = null;
  document.getElementById('startBtn').disabled = true;
  document.getElementById('stopBtn').disabled  = false;
  setStatus('running', '● 接続中…');
  fetchComments();
  pollTimer = setInterval(fetchComments, 2000);
});

document.getElementById('stopBtn').addEventListener('click', () => {
  clearInterval(pollTimer); pollTimer = null;
  document.getElementById('startBtn').disabled = false;
  document.getElementById('stopBtn').disabled  = true;
  setStatus('idle', '● 停止中');
});

document.getElementById('clearStage').addEventListener('click', () => {
  Object.values(users).forEach(u => {
    if (u.el)          u.el.remove();
    if (u.moveTimer)   clearTimeout(u.moveTimer);
    if (u.bubbleTimer) clearTimeout(u.bubbleTimer);
  });
  users = {}; lastCnum = null;
  emptyHint.classList.remove('hidden');
});

document.getElementById('toggleLog').addEventListener('click', () => {
  document.getElementById('commentLog').classList.toggle('hidden');
});

// ──────────────────────────────────────────────────────────────────
// キャラ画像設定モーダル
// ──────────────────────────────────────────────────────────────────
let availableImages = [];

async function loadImageList() {
  try { const d = await (await fetch('/api/images')).json(); availableImages = d.images || []; }
  catch { availableImages = []; }
}

function renderImageGrid() {
  const grid = document.getElementById('imageGrid');
  grid.innerHTML = '';
  if (!availableImages.length) {
    grid.innerHTML = `<div class="image-grid-empty">public/chara/ に画像を入れてください<br>（PNG/JPG/GIF/WebP/SVG）</div>`;
    return;
  }
  availableImages.forEach(fname => {
    const div = document.createElement('div');
    div.className = 'image-thumb';
    div.title = fname;
    div.innerHTML = `<img src="/chara/${encodeURIComponent(fname)}" loading="lazy"><div class="image-thumb-name">${fname}</div>`;
    grid.appendChild(div);
  });
}

function renderCharSlots() {
  const slots  = document.getElementById('charSlots');
  const start  = slotPage * SLOT_SIZE + 1;
  const end    = Math.min(start + SLOT_SIZE - 1, 500);
  slots.innerHTML = '';

  // ページネーション
  const pager = document.createElement('div');
  pager.className = 'slot-pager';
  pager.innerHTML = `
    <button id="slotPrev" ${slotPage === 0 ? 'disabled' : ''}>◀</button>
    <span class="slot-pager-info">キャラ${start}〜${end} / 500</span>
    <button id="slotNext" ${end >= 500 ? 'disabled' : ''}>▶</button>
  `;
  slots.appendChild(pager);

  pager.querySelector('#slotPrev').addEventListener('click', () => { slotPage--; renderCharSlots(); });
  pager.querySelector('#slotNext').addEventListener('click', () => { slotPage++; renderCharSlots(); });

  for (let id = start; id <= end; id++) {
    const charDef  = getCharDef(id);
    const assigned = charImages[id] || '';

    const row = document.createElement('div');
    row.className = 'char-slot-row';

    const preview = document.createElement('div');
    preview.className = 'slot-preview';
    preview.style.backgroundColor = assigned ? 'transparent' : charDef.bg;
    preview.innerHTML = assigned
      ? `<img src="/chara/${encodeURIComponent(assigned)}" alt="${charDef.name}">`
      : charDef.emoji;

    const label = document.createElement('div');
    label.className   = 'slot-label';
    label.textContent = charDef.name;

    const select = document.createElement('select');
    select.className = 'slot-select';

    const noneOpt = document.createElement('option');
    noneOpt.value = ''; noneOpt.textContent = '— 絵文字';
    select.appendChild(noneOpt);

    availableImages.forEach(fname => {
      const opt = document.createElement('option');
      opt.value = fname; opt.textContent = fname;
      if (fname === assigned) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', () => {
      const val = select.value;
      if (val) { charImages[id] = val; preview.innerHTML = `<img src="/chara/${encodeURIComponent(val)}">`; preview.style.backgroundColor = 'transparent'; }
      else     { delete charImages[id]; preview.textContent = charDef.emoji; preview.style.backgroundColor = charDef.bg; }
      saveCharImages(); refreshAllAvatars();
    });

    const aliasInput = document.createElement('input');
    aliasInput.className   = 'slot-alias';
    aliasInput.type        = 'text';
    aliasInput.placeholder = 'エイリアス';
    aliasInput.value       = getAliasForId(id);
    aliasInput.title       = 'このキャラを呼ぶ文字列（コメントで入力するとキャラ変更）';
    aliasInput.addEventListener('change', () => {
      const val = aliasInput.value.trim();
      // 既存のこのidのエイリアスを削除
      Object.keys(charAliases).forEach(k => { if (charAliases[k] === id) delete charAliases[k]; });
      if (val) charAliases[val] = id;
      saveCharAliases();
    });

    const clearBtn = document.createElement('button');
    clearBtn.className   = 'slot-clear';
    clearBtn.textContent = '解除';
    clearBtn.addEventListener('click', () => {
      delete charImages[id]; select.value = '';
      preview.textContent = charDef.emoji; preview.style.backgroundColor = charDef.bg;
      saveCharImages(); refreshAllAvatars();
    });

    row.append(preview, label, aliasInput, select, clearBtn);
    slots.appendChild(row);
  }
}

async function openModal() {
  document.getElementById('imageModal').classList.remove('hidden');
  await loadImageList();
  renderImageGrid();
  renderCharSlots();
}

document.getElementById('gatherBtn').addEventListener('click', gatherCharacters);
document.getElementById('openImgModal').addEventListener('click', openModal);
document.getElementById('closeModal').addEventListener('click',  () => { document.getElementById('imageModal').classList.add('hidden'); });
document.getElementById('reloadImages').addEventListener('click', async () => { await loadImageList(); renderImageGrid(); renderCharSlots(); });
document.getElementById('imageModal').addEventListener('click', e => {
  if (e.target === document.getElementById('imageModal')) document.getElementById('imageModal').classList.add('hidden');
});

// ── ドラッグ＆ドロップ（グローバルハンドラー） ──
document.addEventListener('mousemove', e => {
  if (!dragState) return;
  const { user, el, ox, oy, sx, sy } = dragState;
  const rect = stage.getBoundingClientRect();
  const charSize = user.size * 1.5;
  user.x = Math.max(0, Math.min(rect.width  - charSize, ox + (e.clientX - sx)));
  user.y = Math.max(0, Math.min(rect.height - charSize, oy + (e.clientY - sy)));
  el.style.left = user.x + 'px';
  el.style.top  = user.y + 'px';
});

document.addEventListener('mouseup', () => {
  if (!dragState) return;
  const { user } = dragState;
  dragState = null;
  scheduleMove(user);
});
