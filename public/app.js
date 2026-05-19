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
  '黄': '#FFCC00', '紫': '#CC44CC',
  '黒': '#222222', 'ピンク': '#FF88BB', '橙': '#FF8800',
  'オレンジ': '#FF8800', 'シアン': '#00CCCC', 'ライム': '#88FF00',
  '水色': '#87CEEB', '茶': '#A0522D',
};
const SHAPE_MAP     = { '丸': 'round', '四角': 'square', '雲': 'cloud', '棘': 'spike', 'ハート': 'heart', '思考': 'thought', '叫び': 'shout' };
const DECO_MAP      = { '光る': 'glow', 'グロー': 'glow', '虹': 'rainbow', 'レインボー': 'rainbow', '点線': 'dotted', 'なし': '', 'リセット': '' };
const EFFECT_TYPES  = { '花火': 'hanabi', '紙吹雪': 'confetti', '流れ星': 'star', 'ハートシャワー': 'hearts' };
const MOVE_AREA_MAP = {
  'all':         { x0: 0,   x1: 1,   y0: 0,   y1: 1   },
  'bottom':      { x0: 0,   x1: 1,   y0: 0.5, y1: 1   },
  'top':         { x0: 0,   x1: 1,   y0: 0,   y1: 0.5 },
  'left':        { x0: 0,   x1: 0.5, y0: 0,   y1: 1   },
  'right':       { x0: 0.5, x1: 1,   y0: 0,   y1: 1   },
  'bottomLeft':  { x0: 0,   x1: 0.5, y0: 0.5, y1: 1   },
  'bottomRight': { x0: 0.5, x1: 1,   y0: 0.5, y1: 1   },
};
const MOVE_INTERVAL = { '速い': 2400, '普通': 5600, '遅い': 11000, '止まれ': 0 };
const MOVE_DURATION = { '速い': 1800, '普通':  4400, '遅い':  9000, '止まれ': 0 };
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

// ── 背景色・背景画像 ────────────────────────────
const bgColorInput = document.getElementById('bgColor');
const bgImageBtn   = document.getElementById('bgImageBtn');
const bgClearBtn   = document.getElementById('bgClearBtn');
const bgImageInput = document.getElementById('bgImageInput');

const transparentBg = new URLSearchParams(location.search).get('transparent') === '1';

function applyBgColor(c) {
  if (transparentBg) return;
  stage.style.backgroundColor = c;
  document.body.style.background = c;
  document.documentElement.style.background = c;
}

function applyBgImage(url) {
  if (url) {
    stage.style.backgroundImage    = `url("${url}")`;
    stage.style.backgroundSize     = 'cover';
    stage.style.backgroundPosition = 'center';
    stage.style.backgroundRepeat   = 'no-repeat';
    bgClearBtn.style.display = '';
  } else {
    stage.style.backgroundImage = '';
    bgClearBtn.style.display = 'none';
    applyBgColor(bgColorInput.value);
  }
}

(function initBg() {
  if (transparentBg) {
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';
    stage.style.backgroundColor = 'transparent';
  }
  const savedColor = localStorage.getItem('bgColor') || '#00FF00';
  bgColorInput.value = savedColor;
  applyBgColor(savedColor);
  const savedUrl = localStorage.getItem('bgImageUrl');
  if (savedUrl) applyBgImage(savedUrl);
})();

bgColorInput.addEventListener('input', () => {
  applyBgColor(bgColorInput.value);
  localStorage.setItem('bgColor', bgColorInput.value);
});

bgImageBtn.addEventListener('click', () => bgImageInput.click());

bgImageInput.addEventListener('change', async () => {
  const file = bgImageInput.files[0];
  if (!file) return;
  bgImageInput.value = '';
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const res = await fetch('/api/bg-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl: e.target.result }),
      });
      const data = await res.json();
      if (data.url) {
        // キャッシュバスター付き
        const url = data.url + '?t=' + Date.now();
        localStorage.setItem('bgImageUrl', url);
        applyBgImage(url);
      }
    } catch (err) {
      console.error('BG upload error:', err);
    }
  };
  reader.readAsDataURL(file);
});

bgClearBtn.addEventListener('click', async () => {
  await fetch('/api/bg', { method: 'DELETE' }).catch(() => {});
  localStorage.removeItem('bgImageUrl');
  applyBgImage(null);
});

// ── APIキー・配信番号の保存・復元 ──────────────
(function initSavedCredentials() {
  const k = localStorage.getItem('apikey') || '';
  const h = localStorage.getItem('hash')   || '';
  document.getElementById('apikey').value = k;
  document.getElementById('hash').value   = h;
})();

let users     = {};
let lastCnum  = null;
let pollTimer         = null;
let hayaoshiAutoTimerWhite = null;
let hayaoshiAutoTimerRed   = null;
let namesPool       = [];
let sinjakomeWords  = [];
let yojijukugoWords = [];
let hayaoshiFreq  = 5000;  // 白：自動起動間隔(ms)　赤はこの3倍
let hayaoshiSpeed = 7500;  // 流れるアニメーション duration(ms)
let treasureChestEl    = null;
let treasureChestTimer = null;
let treasureAutoTimer  = null;
let serverHour = 12;
let serverDay  = 1;
let charSizeScale = 1.0;
let bossSizeScale = 1.0;
let apikey    = '';
let hash      = '';
let petGachaDrumAudio = null;
let dragState      = null;
let trashDragState = null;
let moveArea       = MOVE_AREA_MAP['all'];

let dragSounds   = [];
let sentouSounds = [];
(async function loadSounds() {
  try {
    const d = await (await fetch('/api/sounds/drag')).json();
    dragSounds = d.sounds || [];
  } catch {}
  try {
    const d = await (await fetch('/api/sounds/sentou')).json();
    sentouSounds = d.sounds || [];
  } catch {}
})();

function playSentouSound() {
  if (!sentouSounds.length) return;
  playLocalSound('/sound/sentou/' + encodeURIComponent(sentouSounds[Math.floor(Math.random() * sentouSounds.length)]));
}

// ── タイプライター ───────────────────────────
function typewriter(el, text, msPerChar, onDone) {
  const chars = [...text];
  let i = 0;
  const id = setInterval(() => {
    if (i < chars.length) { el.textContent += chars[i++]; }
    else { clearInterval(id); onDone?.(); }
  }, msPerChar);
  return id;
}

// ── ボスセリフ ───────────────────────────────
let bossTexts = [];
(async function loadBossTexts() {
  try {
    const r = await fetch('/text/bosstext.txt');
    const t = await r.text();
    bossTexts = t.split('\n').map(l => l.trim()).filter(l => l);
  } catch {}
})();

// ── 初期ランダム設定用フォント候補 ───────────
const RANDOM_FONTS = [
  '', '', // デフォルト多めに
  '"MS Gothic"', '"MS PGothic"', '"Yu Gothic"',
  '"Segoe UI"', '"Comic Sans MS"', '"Courier New"',
  '"Arial Black"', '"Segoe Print"',
];

const SOUND_TRASH_HOVER    = '/sound/' + encodeURIComponent('ｽﾋﾟｷｦｲｼﾞﾒﾇﾝﾃﾞ….wav');
const SOUND_TRASH_DROP     = '/sound/' + encodeURIComponent('ｳｱｱ!.wav');
const SOUND_HAYAOSHI_WHITE = '/sound/hayaosi/' + encodeURIComponent('nc45952_回復音.wav');
const SOUND_HAYAOSHI_RED   = '/sound/hayaosi/' + encodeURIComponent('Onoma-Flash14-1(High).mp3');
const SOUND_MYTH_DROP      = '/sound/tarabako/' + encodeURIComponent('nc179911_パチンコ確定_脳汁プシャー！キュインキュイン！.wav');
const SOUND_GACHA_DRUM     = '/sound/petgatya/' + encodeURIComponent('ドラムロール.mp3');
const SOUND_GACHA_NORMAL   = '/sound/petgatya/' + encodeURIComponent('ちゃんちゃん♪1.mp3');
const SOUND_GACHA_RARE     = '/sound/petgatya/' + encodeURIComponent('ジャン！.mp3');
const SOUND_GACHA_EPIC     = '/sound/petgatya/' + encodeURIComponent('ジャジャーン.mp3');
const SOUND_GACHA_LEGEND   = '/sound/petgatya/' + encodeURIComponent('きらきら輝く6.mp3');
const SOUND_GACHA_MYTH     = '/sound/petgatya/' + encodeURIComponent('nc272529_当たりの効果音.mp3');
const SOUND_QUIZ_CORRECT   = '/sound/quiz/'    + encodeURIComponent('クイズ正解2.mp3');

let charImages   = loadCharImages();
let charAliases  = loadCharAliases();
// 起動時にlocalStorageの割り当てをサーバーへ同期
fetch('/api/char-images', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(charImages) }).catch(() => {});
let slotPage     = 0;
const SLOT_SIZE  = 20;

function loadCharImages() {
  try { return JSON.parse(localStorage.getItem('charImages') || '{}'); }
  catch { return {}; }
}
function saveCharImages() {
  localStorage.setItem('charImages', JSON.stringify(charImages));
  fetch('/api/char-images', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(charImages) }).catch(() => {});
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
function getUsedNames(excludeIpid) {
  return new Set(Object.values(users)
    .filter(u => u.ipid !== excludeIpid)
    .map(u => u.name)
    .filter(Boolean));
}

function pickRandomName(excludeIpid) {
  if (namesPool.length === 0) return '名無し';
  const used = getUsedNames(excludeIpid);
  const free = namesPool.filter(n => !used.has(n));
  const pool = free.length > 0 ? free : namesPool;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getUser(ipid) {
  if (!users[ipid]) {
    users[ipid] = {
      ipid,
      name:        pickRandomName(ipid),
      charDef:     null,
      textColor:   '#111111',
      bubbleShape: 'round',
      bubbleDeco:  '',
      movement:    '止まれ',
      motion:      null,
      nameManual:  false,
      size:        80,
      font:        '',
      x: randX({ size: 80 }),
      y: randY({ size: 80 }),
      el:          null,
      exp:            0,
      level:          1,
      hp:             30,
      maxHp:          30,
      mp:             10,
      atk:            2,
      ko:             false,
      koTimer:        null,
      equips:         [],
      typewriterTimer: null,
      firstAppear:    true,
      moveTimer:      null,
      bubbleTimer:    null,
      motionTimer:    null,
      // 統計
      commentCount:   0,
      deaths:         0,
      wordleWins:     0,
      hayaoshiWins:   0,
      totalDmgDealt:  0,
      walking:        false,
      walkTimer:      null,
      // ペット
      pet:            null,
      pet2:           null,
      titles:         [],
      activeTitle:    null,
      tc: {
        bossParticipations: 0,
        bossKills:     0,
        healCount:     0,
        comboTriggers: 0,
        treasureOpens: 0,
        whiteHayaoshi: 0,
        redHayaoshi:   0,
        moveChanges:   0,
        mpFull:        0,
        petGachas:     0,
        lowHpSurvive:  0,
        longComment:   0,
      },
    };
  }
  return users[ipid];
}

function randX(u) {
  const w    = stage.clientWidth;
  const uw   = u?.el ? (u.el.offsetWidth  || Math.round((u.size || 80) * 1.5 * charSizeScale)) : Math.round((u?.size || 80) * 1.5 * charSizeScale);
  const lo   = Math.floor(moveArea.x0 * w) + 10;
  const hi   = Math.max(Math.floor(moveArea.x1 * w) - uw - 10, lo + 10);
  return lo + Math.random() * (hi - lo);
}
function randY(u) {
  const h    = stage.clientHeight;
  const uh   = u?.el ? (u.el.offsetHeight || (Math.round((u.size || 80) * 1.5 * charSizeScale) + 60)) : (Math.round((u?.size || 80) * 1.5 * charSizeScale) + 60);
  const lo   = Math.floor(moveArea.y0 * h) + 10;
  const hi   = Math.max(Math.floor(moveArea.y1 * h) - uh - 10, lo + 10);
  return lo + Math.random() * (hi - lo);
}

// ──────────────────────────────────────────────────────────────────
// キャラクター DOM
// ──────────────────────────────────────────────────────────────────

// ステージ上で既に使われているキャラIDのSet（自分自身は除外）
function getUsedCharIds(excludeUser) {
  const used = new Set();
  Object.values(users).forEach(u => {
    if (u === excludeUser) return;
    if (u.el && u.charDef && u.charDef.id > 0) used.add(u.charDef.id);
  });
  return used;
}

function ensureCharOnStage(user) {
  if (user.el) return;
  if (!user.charDef) {
    const used = getUsedCharIds(user);
    const allIds = Object.keys(charImages).map(Number).filter(id => id >= 1 && id <= 500);
    const freeIds = allIds.filter(id => !used.has(id));
    const pool = freeIds.length > 0 ? freeIds : allIds; // 全枠埋まっていたら重複許容
    user.charDef = pool.length > 0
      ? getCharDef(pool[Math.floor(Math.random() * pool.length)])
      : { id: 0, name: '', emoji: '👤', bg: 'transparent' };
  }
  createCharacter(user);
}

function createCharacter(user) {
  if (user.firstAppear !== false) {
    randomizeCharAppearance(user);
    user.firstAppear = false;
  }

  const el = document.createElement('div');
  el.className  = 'character';
  el.id         = 'char-' + user.ipid;
  el.style.left = user.x + 'px';
  el.style.top  = user.y + 'px';

  el.innerHTML = `
    <div class="bubble hidden" id="b-${user.ipid}"></div>
    <div class="avatar-wrap">
      <div class="avatar"   id="a-${user.ipid}"></div>
      <div class="char-pet"  id="p-${user.ipid}"></div>
      <div class="char-pet2" id="p2-${user.ipid}"></div>
    </div>
    <div class="char-name" id="n-${user.ipid}">${escapeHtml(user.name)}</div>
    <div class="char-stats" id="s-${user.ipid}"></div>
  `;

  stage.appendChild(el);
  user.el = el;
  emptyHint.classList.add('hidden');
  applyAvatarStyle(user);
  updateLevelBadge(user);
  updateEquipBadge(user);
  updateStatsDisplay(user);
  renderPetBadge(user);
  scheduleMove(user);
  restoreMotion(user);

  // 名前クリックでステータスモーダル（手動クローズ）
  el.querySelector('.char-name')?.addEventListener('click', e => {
    e.stopPropagation();
    const prev = document.getElementById('statusModal');
    if (prev) prev.remove();
    showStatusModal(user, false);
  });

  el.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    dragState = { user, el, ox: user.x, oy: user.y, sx: e.clientX, sy: e.clientY, overTrash: false };
    el.style.transition = 'none';
    el.classList.add('char-dragging');
    el.classList.remove('walking');
    user.movement = '止まれ';
    if (user.moveTimer) { clearTimeout(user.moveTimer); user.moveTimer = null; }
    if (dragSounds.length > 0) {
      playLocalSound('/sound/drag/' + encodeURIComponent(dragSounds[Math.floor(Math.random() * dragSounds.length)]));
    }
    e.preventDefault();
  });

  if (compactMode) gatherCharactersBottom();
}

function applyAvatarStyle(user) {
  const a = document.getElementById('a-' + user.ipid);
  if (!a || !user.charDef) return;
  const lvScale = 1 + ((user.level || 1) - 1) * 0.06;
  const px = Math.round(user.size * 1.5 * lvScale * charSizeScale * (user.brWinnerScale || 1));
  a.style.width  = px + 'px';
  a.style.height = px + 'px';
  const imgFile = charImages[user.charDef.id] || 'kisyokeee.png';
  a.innerHTML      = `<img src="/chara/${encodeURIComponent(imgFile)}" alt="${escapeHtml(user.name)}">`;
  a.style.fontSize = '0';
}

function renderPetBadge(user) {
  const petSize = Math.max(20, Math.round(user.size * 0.75 * charSizeScale * (user.brWinnerScale || 1)));
  const slot = document.getElementById('p-' + user.ipid);
  if (slot) {
    if (!user.pet) { slot.className = 'char-pet'; slot.innerHTML = ''; }
    else {
      slot.className = `char-pet ${user.pet.rarityCls || ''}`;
      slot.innerHTML = `<img src="/chara/${encodeURIComponent(user.pet.img)}" alt="pet" style="width:${petSize}px;height:${petSize}px;object-fit:contain" title="${escapeHtml(user.pet.abilityName)}: ${escapeHtml(user.pet.abilityDesc)}">`;
    }
  }
  const slot2 = document.getElementById('p2-' + user.ipid);
  if (slot2) {
    if (!user.pet2) { slot2.className = 'char-pet2'; slot2.innerHTML = ''; }
    else {
      slot2.className = `char-pet2 ${user.pet2.rarityCls || ''}`;
      slot2.innerHTML = `<img src="/chara/${encodeURIComponent(user.pet2.img)}" alt="pet2" style="width:${petSize}px;height:${petSize}px;object-fit:contain" title="${escapeHtml(user.pet2.abilityName)}: ${escapeHtml(user.pet2.abilityDesc)}">`;
    }
  }
}

function updateNameDisplay(user) {
  const n = document.getElementById('n-' + user.ipid);
  if (!n) return;
  let html = escapeHtml(user.name);
  if (user.activeTitle && typeof TITLES !== 'undefined') {
    const t = TITLES.find(x => x.id === user.activeTitle);
    if (t) {
      const cls = ['T99','T100'].includes(t.id) ? 'title-tag-rainbow'
                : ['T91','T92','T93','T94'].includes(t.id) ? 'title-tag-gold'
                : ['T62','T70','T74','T80'].includes(t.id) ? 'title-tag-gold'
                : 'title-tag-normal';
      html = '<span class="title-tag ' + cls + '">' + escapeHtml(t.name) + '</span>' + escapeHtml(user.name);
    }
  }
  if (user.brWinner) {
    html = '<span class="title-tag title-tag-winner">優勝</span>' + html;
  }
  n.innerHTML = html;
}

function refreshAllAvatars() {
  Object.values(users).forEach(u => { if (u.el) applyAvatarStyle(u); });
}

// ──────────────────────────────────────────────────────────────────
// 移動
// ──────────────────────────────────────────────────────────────────
const WALK_SPEED = { '速い': '0.22s', '普通': '0.45s', '遅い': '0.75s' };

function applyWalking(user) {
  if (!user.el) return;
  if (user.movement && user.movement !== '止まれ') {
    user.el.style.setProperty('--walk-speed', WALK_SPEED[user.movement] || '0.45s');
    user.el.classList.add('walking');
  } else {
    user.el.classList.remove('walking');
  }
}

function scheduleMove(user) {
  if (user.moveTimer) clearTimeout(user.moveTimer);
  if (user.movement === '止まれ') {
    applyWalking(user);
    return;
  }
  applyWalking(user);

  const interval = MOVE_INTERVAL[user.movement] ?? 5600;
  const duration = MOVE_DURATION[user.movement] ?? 4400;

  user.moveTimer = setTimeout(() => {
    if (!users[user.ipid] || user.movement === '止まれ') return;
    user.x = randX(user);
    user.y = randY(user);
    if (user.el) {
      user.el.style.transition = `left ${duration}ms ease-in-out, top ${duration}ms ease-in-out`;
      user.el.style.left = user.x + 'px';
      user.el.style.top  = user.y + 'px';
    }
    scheduleMove(user);
  }, interval);
}

function scheduleWalk(user) {
  if (!user.walking || !user.el) return;
  if (user.walkTimer) clearTimeout(user.walkTimer);
  const stageW   = stage.clientWidth;
  const charW    = Math.round(user.size * 1.5 * charSizeScale);
  const maxX     = Math.max(0, stageW - charW);
  const dist     = 80 + Math.random() * 240;
  const dir      = Math.random() < 0.5 ? -1 : 1;
  user.x         = Math.max(0, Math.min(maxX, user.x + dir * dist));
  const duration = 4400 + Math.random() * 4000;
  user.el.style.transition = `left ${duration}ms linear`;
  user.el.style.left = user.x + 'px';
  // top は変えない（縦移動なし）
  const avatarEl = document.getElementById('a-' + user.ipid);
  if (avatarEl) avatarEl.style.transform = dir < 0 ? 'scaleX(-1)' : 'scaleX(1)';
  user.walkTimer = setTimeout(() => scheduleWalk(user), duration + 150);
}

function startWalk(user) {
  if (user.walkTimer) clearTimeout(user.walkTimer);
  if (user.moveTimer)  { clearTimeout(user.moveTimer); user.moveTimer = null; }
  user.walking = true;
  if (user.el) {
    user.el.style.setProperty('--walk-speed', '0.7s');
    user.el.classList.add('walking');
  }
  scheduleWalk(user);
}

function stopWalk(user) {
  user.walking = false;
  if (user.walkTimer) { clearTimeout(user.walkTimer); user.walkTimer = null; }
  if (user.el) {
    user.el.classList.remove('walking');
    user.el.style.removeProperty('--walk-speed');
    const avatarEl = document.getElementById('a-' + user.ipid);
    if (avatarEl) avatarEl.style.transform = '';
  }
  if (user.el) scheduleMove(user);
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

const MOTION_CLASSES = ['bouncing', 'spinning', 'trembling', 'wavy'];

function applyMotion(user, type) {
  if (user.el) MOTION_CLASSES.forEach(c => user.el.classList.remove(c));
  if (user.motionTimer) { clearTimeout(user.motionTimer); user.motionTimer = null; }
  user.motion = type || null;
  if (!type || !user.el) return;
  user.el.classList.add(type);
  user.motionTimer = setTimeout(() => {
    if (user.el) user.el.classList.remove(type);
    user.motion = null;
    user.motionTimer = null;
  }, 10000);
}

function restoreMotion(user) {
  if (user.motion && user.el) user.el.classList.add(user.motion);
  applyWalking(user);
}

// ── 集合 ──────────────────────────────────────
function clampToStage(u, x, y) {
  const w = u.el ? (u.el.offsetWidth  || Math.round(u.size * 1.5 * charSizeScale)) : Math.round(u.size * 1.5 * charSizeScale);
  const h = u.el ? (u.el.offsetHeight || (w + 60)) : (w + 60);
  return {
    x: Math.max(0, Math.min(stage.clientWidth  - w, x)),
    y: Math.max(20, Math.min(stage.clientHeight - h, y)),
  };
}

function gatherCharacters() {
  const onStage = Object.values(users).filter(u => u.el);
  if (onStage.length === 0) return;

  const ROW_MAX = 12;
  const GAP     = 20;
  const ROW_GAP = 10;
  const stageW  = stage.clientWidth;
  const stageH  = stage.clientHeight;
  const cw      = u => u.el ? (u.el.offsetWidth  || Math.round(u.size * 1.5 * charSizeScale)) : Math.round(u.size * 1.5 * charSizeScale);
  const ch      = u => u.el ? (u.el.offsetHeight || (Math.round(u.size * 1.5 * charSizeScale) + 60)) : (Math.round(u.size * 1.5 * charSizeScale) + 60);

  // 行に分割（最大12体ずつ）
  const rows = [];
  for (let i = 0; i < onStage.length; i += ROW_MAX) {
    rows.push(onStage.slice(i, i + ROW_MAX));
  }

  // 各行の高さを計算して、下から積み上げる形でY座標を決定
  const rowHeights = rows.map(row => Math.max(...row.map(ch)));
  const totalH     = rowHeights.reduce((s, h) => s + h, 0) + ROW_GAP * (rows.length - 1);
  let   y          = stageH - totalH - 20;

  rows.forEach((row, ri) => {
    const rowH      = rowHeights[ri];
    const totalRowW = row.reduce((s, u) => s + cw(u), 0);
    let   gap       = GAP;
    const totalWithGap = totalRowW + GAP * (row.length - 1);
    if (totalWithGap > stageW - 40) {
      gap = Math.max(4, (stageW - 40 - totalRowW) / Math.max(1, row.length - 1));
    }
    const totalW = totalRowW + gap * (row.length - 1);
    let   x      = Math.max(10, (stageW - totalW) / 2);

    row.forEach(u => {
      const clamped = clampToStage(u, x, y);
      u.x = clamped.x;
      u.y = clamped.y;
      u.el.style.transition = 'left 600ms cubic-bezier(0.34,1.56,0.64,1), top 600ms cubic-bezier(0.34,1.56,0.64,1)';
      u.el.style.left = u.x + 'px';
      u.el.style.top  = u.y + 'px';
      x += cw(u) + gap;
    });

    y += rowH + ROW_GAP;
  });
}

function gatherCharactersBottom() {
  const onStage = Object.values(users).filter(u => u.el);
  if (onStage.length === 0) return;
  const stageW = stage.clientWidth;
  const stageH = stage.clientHeight;
  const charW  = u => u.el ? (u.el.offsetWidth  || Math.round(u.size * 1.5 * charSizeScale)) : Math.round(u.size * 1.5 * charSizeScale);
  const charH  = u => u.el ? (u.el.offsetHeight || (Math.round(u.size * 1.5 * charSizeScale) + 48)) : (Math.round(u.size * 1.5 * charSizeScale) + 48);
  // 重なり許容で均等配置
  const n    = onStage.length;
  const step = n > 1 ? Math.min(charW(onStage[0]) + 8, (stageW - 20) / n) : 0;
  const startX = Math.max(10, (stageW - (step * (n - 1) + charW(onStage[0]))) / 2);
  onStage.forEach((u, i) => {
    const rawX = Math.round(startX + step * i);
    const rawY = stageH - charH(u) - 10;
    const clamped = clampToStage(u, rawX, rawY);
    u.x = clamped.x;
    u.y = clamped.y;
    u.el.style.transition = 'left 600ms cubic-bezier(0.34,1.56,0.64,1), top 600ms cubic-bezier(0.34,1.56,0.64,1)';
    u.el.style.left = u.x + 'px';
    u.el.style.top  = u.y + 'px';
  });
}

function setCompactMode(on) {
  compactMode = on;
  document.body.classList.toggle('compact-mode', on);

  // ボス表示切替
  if (bossState?.el) bossState.el.style.display = on ? 'none' : '';

  // ダメランパネル
  const rankingPanel = document.getElementById('rankingPanel');
  if (rankingPanel) rankingPanel.style.display = on ? 'none' : '';

  // Wordleパネル
  const wordlePanel = document.getElementById('wordlePanel');
  if (wordlePanel) wordlePanel.style.display = on ? 'none' : '';

  // クイズパネル
  const quizPanel = document.getElementById('quizPanel');
  if (quizPanel) quizPanel.style.display = on ? 'none' : '';

  // BRタイマーパネル
  const brTimerPanel = document.getElementById('brTimerPanel');
  if (brTimerPanel) brTimerPanel.style.display = (on || !brTimerVisible) ? 'none' : '';

  // 早押し：コンパクトONで停止、OFFで再開（配信中のみ）
  if (on) {
    clearTimeout(hayaoshiAutoTimerWhite); hayaoshiAutoTimerWhite = null;
    clearTimeout(hayaoshiAutoTimerRed);   hayaoshiAutoTimerRed   = null;
    hayaoshiItems.forEach(it => clearTimeout(it.timeoutId));
    hayaoshiItems = [];
  } else if (pollTimer) {
    if (!hayaoshiAutoTimerWhite) {
      (function scheduleHayaoshiWhite() {
        hayaoshiAutoTimerWhite = setTimeout(() => {
          if (!pollTimer) return;
          startHayaoshiAutoWhite();
          scheduleHayaoshiWhite();
        }, hayaoshiFreq);
      })();
    }
    if (!hayaoshiAutoTimerRed) {
      (function scheduleHayaoshiRed() {
        hayaoshiAutoTimerRed = setTimeout(() => {
          if (!pollTimer) return;
          startHayaoshiAutoRed();
          scheduleHayaoshiRed();
        }, hayaoshiFreq * 3);
      })();
    }
  }

  // ボタン表示更新
  const btn = document.getElementById('compactBtn');
  if (btn) {
    btn.textContent = on ? '📦 通常モード' : '📦 コンパクト';
    btn.classList.toggle('compact-active', on);
  }
}

// ──────────────────────────────────────────────────────────────────
// 吹き出し表示
// ──────────────────────────────────────────────────────────────────
function applyCommentStyle(b, style) {
  b.style.fontSize   = style && style.fontSize   ? style.fontSize   : '';
  b.style.fontWeight = style && style.fontWeight ? style.fontWeight : '';
  b.style.fontStyle  = style && style.fontStyle  ? style.fontStyle  : '';
}

function bubbleClass(user) {
  return `bubble bubble-${user.bubbleShape}${user.bubbleDeco ? ' bubble-deco-' + user.bubbleDeco : ''}`;
}

function showBubble(user, text, style) {
  const b = document.getElementById('b-' + user.ipid);
  if (!b) return;
  if (user.typewriterTimer) { clearInterval(user.typewriterTimer); user.typewriterTimer = null; }
  b.textContent = '';
  b.style.color = user.textColor;
  b.style.fontFamily = user.font || '';
  b.className   = bubbleClass(user);
  applyCommentStyle(b, style);
  triggerTalk(user, b);
  const speed = Math.max(25, Math.min(90, Math.floor(1000 / Math.max([...text].length, 1))));
  user.typewriterTimer = typewriter(b, text, speed, () => { user.typewriterTimer = null; });
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
  b.className   = bubbleClass(user);
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
  b.className   = bubbleClass(user);
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
// エフェクト
// ──────────────────────────────────────────────────────────────────
function getCharCenter(user) {
  if (user.el) {
    const r = user.el.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    return { x: r.left - sr.left + r.width / 2, y: r.top - sr.top + r.height / 2 };
  }
  return { x: stage.clientWidth / 2, y: stage.clientHeight / 2 };
}

function triggerEffect(type, user) {
  if (compactMode) return;
  const { x, y } = getCharCenter(user);
  if (type === 'hanabi')   spawnFireworks(x, y);
  if (type === 'confetti') spawnConfetti();
  if (type === 'star')     spawnShootingStar();
  if (type === 'hearts')   spawnHeartShower(x, y);
}

function spawnFireworks(cx, cy) {
  if (compactMode) return;
  const colors = ['#ff4444','#ffaa00','#44ff44','#4499ff','#ff44ff','#44ffee','#ffffff','#ffdd44'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:9px;height:9px;border-radius:50%;background:${colors[i%colors.length]};z-index:60;pointer-events:none;`;
    stage.appendChild(p);
    const angle = (i / 30) * Math.PI * 2;
    const dist  = 60 + Math.random() * 130;
    p.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`, opacity: 0 },
    ], { duration: 700 + Math.random()*400, easing: 'cubic-bezier(0,.9,.57,1)', fill: 'forwards' }).onfinish = () => p.remove();
  }
}

function spawnConfetti() {
  if (compactMode) return;
  const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c77dff','#ff9a3c'];
  for (let i = 0; i < 55; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      const w = 6 + Math.random()*8, h = 10 + Math.random()*6;
      p.style.cssText = `position:absolute;left:${Math.random()*stage.clientWidth}px;top:-${h}px;width:${w}px;height:${h}px;background:${colors[Math.floor(Math.random()*colors.length)]};z-index:60;pointer-events:none;border-radius:2px;`;
      stage.appendChild(p);
      const rot = Math.random() * 360;
      p.animate([
        { transform: `rotate(${rot}deg)`, opacity: 1 },
        { transform: `rotate(${rot+360}deg) translateY(${stage.clientHeight+20}px)`, opacity: 0.7 },
      ], { duration: 2000 + Math.random()*1500, easing: 'linear', fill: 'forwards' }).onfinish = () => p.remove();
    }, i * 22);
  }
}

function spawnShootingStar() {
  const p = document.createElement('div');
  const startY = Math.random() * stage.clientHeight * 0.5;
  p.style.cssText = `position:absolute;top:${startY}px;left:0;width:200px;height:3px;background:linear-gradient(90deg,transparent,#fff,rgba(255,255,200,.9),transparent);z-index:60;pointer-events:none;border-radius:2px;`;
  stage.appendChild(p);
  p.animate([
    { transform: 'translate(-200px,0) rotate(18deg)', opacity: 1 },
    { transform: `translate(${stage.clientWidth+200}px,${stage.clientHeight*0.3}px) rotate(18deg)`, opacity: 0 },
  ], { duration: 900, easing: 'ease-in', fill: 'forwards' }).onfinish = () => p.remove();
}

function spawnHeartShower(cx, cy) {
  if (compactMode) return;
  const hearts = ['❤️','💕','💖','💗','💓','🩷'];
  for (let i = 0; i < 14; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      const ox = (Math.random() - 0.5) * 130;
      p.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;font-size:${14+Math.random()*18}px;z-index:60;pointer-events:none;user-select:none;`;
      p.textContent = hearts[Math.floor(Math.random()*hearts.length)];
      stage.appendChild(p);
      p.animate([
        { transform: `translate(calc(-50% + ${ox}px),-50%) scale(1)`, opacity: 1 },
        { transform: `translate(calc(-50% + ${ox}px),calc(-50% - ${100+Math.random()*90}px)) scale(0.3)`, opacity: 0 },
      ], { duration: 1100 + Math.random()*700, easing: 'ease-out', fill: 'forwards' }).onfinish = () => p.remove();
    }, i * 70);
  }
}

// ──────────────────────────────────────────────────────────────────
// ボス討伐・育成
// ──────────────────────────────────────────────────────────────────
let bossState = null;
let bossManuallyCleared = false;
let brState   = null; // バトルロイヤル状態 // 消去ボタン押下後は自動召喚しない
let brNextAutoAt    = Date.now() + 30 * 60 * 1000; // 次回自動BR予定時刻(ms)
let brTimerVisible  = false;
let brTimerDragState = null;
let brTimerPanelX   = parseInt(localStorage.getItem('brTimerPanelX')) || 10;
let brTimerPanelY   = parseInt(localStorage.getItem('brTimerPanelY')) || 150;
let bossCount = 1;       // 現在何体目のボスか
let bossCounterRate = 0.40; // 反撃確率（0〜1）
let bossHpScale    = 1;    // ボスHP倍率（1〜100）
let bossAtkCoeff   = 20;   // 参加者ATK合計への係数
let brHpMult       = 200;  // バトルロイヤル仮想HP倍率
let nikoFontSize  = 40;  // 早押しコメント文字サイズ(px)
let nikoOpacity   = 1.0; // 早押しコメント透明度（0〜1）
function nextBossHp() {
  const totalAtk = Object.values(users).filter(u => u.el && !u.ko)
    .reduce((sum, u) => sum + calcAtk(u), 0);
  return Math.max(100, Math.round(Math.max(1, totalAtk) * bossAtkCoeff * bossHpScale));
}
let moveLocked = false;          // 移動制限モード（方向移動・移動コマンド禁止）
let debugMode  = false;          // デバッグモード（全キャラATK=50）
let compactMode = false;         // コンパクトモード
let equipHidden  = false;        // 装備アイコン非表示
let brAutoEnabled = true;        // 自動バトルロイヤル有効フラグ
let bossDamageMap = {};          // ipid → { name, totalDmg }
let rankingState     = null;
let rankingDragState = null;
let bossDragState = null;
let bossLastPos   = null; // 最後にD&Dした位置
// Lv1〜10 累計攻撃数（合計150）
const LEVEL_EXP = [0, 3, 10, 22, 40, 65, 90, 115, 133, 150];

const EQUIP_POOL = [
  { name: '剣',    icon: '⚔️',  stat: 'atk' },
  { name: '盾',    icon: '🛡️', stat: 'hp'  },
  { name: '兜',    icon: '⛑️', stat: 'hp'  },
  { name: '指輪',  icon: '💍',  stat: 'atk' },
  { name: '鎧',    icon: '🔰',  stat: 'hp'  },
  { name: '杖',    icon: '🪄',  stat: 'atk' },
  { name: '弓',    icon: '🏹',  stat: 'atk' },
  { name: '首飾り', icon: '📿',  stat: 'hp'  },
];
const RARITY = [
  null,
  { name: 'ノーマル', cls: ''             },
  { name: 'ノーマル', cls: ''             },
  { name: 'レア',     cls: 'rarity-rare'  },
  { name: 'レア',     cls: 'rarity-rare'  },
  { name: 'エピック', cls: 'rarity-epic'  },
  { name: 'エピック', cls: 'rarity-epic'  },
  { name: '伝説',     cls: 'rarity-legend'},
  { name: '伝説',     cls: 'rarity-legend'},
  { name: '神話',     cls: 'rarity-myth'  },
  { name: '神話',     cls: 'rarity-myth'  },
];

// ── ペット能力定義（30種） ─────────────────────────────────────────
const PET_ABILITIES = [
  // ノーマル (8)
  { id:'extra_hit',  name:'アシスト',      desc:'追加1回攻撃(ATK×25%)',        cls:''              },
  { id:'regen',      name:'回復ペット',     desc:'攻撃するたびHP+2',             cls:''              },
  { id:'mp_boost',   name:'MP補給',        desc:'攻撃するたびMP+1追加',         cls:''              },
  { id:'exp_up',     name:'修行',          desc:'攻撃するたびEXP+1追加',        cls:''              },
  { id:'guard',      name:'守護',          desc:'受けるダメージ-1',             cls:''              },
  { id:'lucky',      name:'幸運',          desc:'ボス討伐の装備ドロップが強化',  cls:''              },
  { id:'cheer',      name:'応援',          desc:'10%で追加攻撃(ATK×25%)',       cls:''              },
  { id:'scout',      name:'偵察',          desc:'クリティカル率+5%',            cls:''              },
  // レア (8)
  { id:'double_hit', name:'ダブルアタック', desc:'追加2回攻撃',                 cls:'rarity-rare'   },
  { id:'poison',     name:'毒牙',          desc:'25%で毒(3ダメ×3回)',           cls:'rarity-rare'   },
  { id:'hp_steal',   name:'吸血',          desc:'ダメージの25%をHP回収',        cls:'rarity-rare'   },
  { id:'barrier',    name:'バリア',        desc:'20%で被ダメ3軽減',             cls:'rarity-rare'   },
  { id:'crit_up',    name:'鋭爪',          desc:'クリティカル率+20%',           cls:'rarity-rare'   },
  { id:'mp_regen',   name:'MP吸収',        desc:'攻撃するたびMP+2追加',         cls:'rarity-rare'   },
  { id:'tough',      name:'鉄壁',          desc:'最大HP+10',                   cls:'rarity-rare'   },
  { id:'avenger',    name:'復讐',          desc:'HP50%以下でペットダメ+50%',   cls:'rarity-rare'   },
  // エピック (7)
  { id:'triple_hit', name:'トリプルアタック',desc:'追加3回攻撃',               cls:'rarity-epic'   },
  { id:'burn',       name:'炎上',          desc:'35%で炎上(5ダメ×3回)',         cls:'rarity-epic'   },
  { id:'team_heal',  name:'癒し手',        desc:'攻撃時全員HP+1',              cls:'rarity-epic'   },
  { id:'charge',     name:'チャージ',      desc:'2回に1回ダメ×2',              cls:'rarity-epic'   },
  { id:'soul_steal', name:'魂喰い',        desc:'ダメージの40%をHP回収',        cls:'rarity-epic'   },
  { id:'chain',      name:'連鎖',          desc:'35%でさらに追加攻撃',          cls:'rarity-epic'   },
  { id:'mp_master',  name:'MP達人',        desc:'攻撃するたびMP+3追加',         cls:'rarity-epic'   },
  // 伝説 (4)
  { id:'quad_hit',   name:'クアドラアタック',desc:'追加4回攻撃',               cls:'rarity-legend' },
  { id:'revive',     name:'不死鳥',        desc:'死亡時1度HP50%で復活',        cls:'rarity-legend' },
  { id:'berserk',    name:'バーサーク',    desc:'HP30%以下でペットダメ×3',     cls:'rarity-legend' },
  { id:'full_drain', name:'大吸血',        desc:'ダメージの60%をHP回収',        cls:'rarity-legend' },
  // 神話 (3)
  { id:'storm',      name:'ストーム',      desc:'追加5回攻撃',                 cls:'rarity-myth'   },
  { id:'godhand',    name:'神の手',        desc:'5%でダメージ×20',             cls:'rarity-myth'   },
  { id:'omega',      name:'オメガ',        desc:'15%で攻撃時全員HP全回復',     cls:'rarity-myth'   },
];

// ペットガチャ: レア度別の排出グループ
const PET_RARITY_GROUPS = {
  '':             PET_ABILITIES.filter(a => a.cls === ''),
  'rarity-rare':  PET_ABILITIES.filter(a => a.cls === 'rarity-rare'),
  'rarity-epic':  PET_ABILITIES.filter(a => a.cls === 'rarity-epic'),
  'rarity-legend':PET_ABILITIES.filter(a => a.cls === 'rarity-legend'),
  'rarity-myth':  PET_ABILITIES.filter(a => a.cls === 'rarity-myth'),
};
const PET_RARITY_RATE = [
  { cls: '',              name:'ノーマル', weight:50 },
  { cls: 'rarity-rare',  name:'レア',     weight:25 },
  { cls: 'rarity-epic',  name:'エピック', weight:15 },
  { cls: 'rarity-legend',name:'伝説',     weight: 5 },
  { cls: 'rarity-myth',  name:'神話',     weight: 5 },
];

function calcLevel(exp) {
  let lv = 1;
  for (let i = 1; i < LEVEL_EXP.length; i++) { if (exp >= LEVEL_EXP[i]) lv = i + 1; }
  return Math.min(lv, 10);
}

function calcAtk(user) {
  if (debugMode) return 50;
  const base  = 1 + (user.level || 1);
  const bonus = (user.equips || []).filter(e => e.stat === 'atk').reduce((s, e) => s + (e.value || 0), 0);
  const titleBonus = typeof getTitleBonuses === 'function' ? (getTitleBonuses(user).atk || 0) : 0;
  return base + bonus + titleBonus;
}

function calcMaxHp(user) {
  const base       = 30;
  const equipBonus = (user.equips || []).filter(e => e.stat === 'hp').reduce((s, e) => s + (e.value || 0), 0);
  const petBonus   = (user.pet?.abilityId === 'tough' ? 10 : 0)
                   + (user.pet2?.abilityId === 'tough' ? 10 : 0);
  const titleBonus = typeof getTitleBonuses === 'function' ? (getTitleBonuses(user).hp || 0) : 0;
  return base + equipBonus + petBonus + titleBonus;
}

function updateStatsDisplay(user) {
  const s = document.getElementById('s-' + user.ipid);
  if (!s) return;
  const lv  = user.level || 1;
  const mp  = user.mp    ?? 10;
  const atk = calcAtk(user);
  const expToNext = lv >= 10 ? 'MAX' : LEVEL_EXP[lv] - (user.exp || 0);
  // BR中は仮想HPを表示
  const inBR = brState?.active && brState.hp[user.ipid] !== undefined;
  const hp  = inBR ? Math.max(0, brState.hp[user.ipid])         : (user.hp    ?? 30);
  const mhp = inBR ? (brState.maxHp[user.ipid] ?? hp)           : (user.maxHp ?? 30);
  s.textContent = `HP:${hp.toLocaleString()}/${mhp.toLocaleString()}  MP:${mp}  ATK:${atk}  EXP:${expToNext}`;
}

function randomizeCharAppearance(user) {
  const shapes = Object.values(SHAPE_MAP);
  const decos  = ['', 'glow', 'rainbow', 'dotted'];
  const colors = Object.values(COLOR_NAMES);
  const sizes  = [50, 55, 60];
  user.bubbleShape = shapes[Math.floor(Math.random() * shapes.length)];
  user.font        = RANDOM_FONTS[Math.floor(Math.random() * RANDOM_FONTS.length)];
  user.bubbleDeco  = decos[Math.floor(Math.random() * decos.length)];
  user.textColor   = colors[Math.floor(Math.random() * colors.length)];
  user.size        = sizes[Math.floor(Math.random() * sizes.length)];
}

function rollEquipValue(bossMaxHp) {
  const cap = Math.min(10, Math.max(1, Math.ceil(bossMaxHp / 150)));
  // 2回振って高い方（強ボスほど高レア出やすい）
  return Math.max(
    Math.ceil(Math.random() * cap),
    Math.ceil(Math.random() * cap),
  );
}

function updateEquipBadge(user) {
  if (!user.el) return;
  let area = user.el.querySelector('.char-equip-area');
  if (!area) {
    area = document.createElement('div');
    area.className = 'char-equip-area';
    user.el.appendChild(area);
  }
  area.innerHTML = '';
  (user.equips || []).forEach(eq => {
    const b = document.createElement('span');
    b.className   = `char-equip-badge ${eq.rarityCls || ''}`;
    b.textContent = eq.icon;
    b.title       = `${eq.name}[${eq.rarityName}] ${eq.stat === 'atk' ? 'ATK' : 'HP'}+${eq.value}`;
    area.appendChild(b);
  });
}

function rushToBoss(user) {
  if (!user.el || !bossState?.el) return;
  const cr = user.el.getBoundingClientRect();
  const br = bossState.el.getBoundingClientRect();
  const dx = (br.left + br.width  / 2) - (cr.left + cr.width  / 2);
  const dy = (br.top  + br.height / 2) - (cr.top  + cr.height / 2);
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const rx  = (dx / len) * Math.min(len * 0.55, 110);
  const ry  = (dy / len) * Math.min(len * 0.55, 110);
  user.el.style.transition = 'transform 0.24s ease-in';
  user.el.style.transform  = `translate(${rx}px,${ry}px) scale(1.2)`;
  setTimeout(() => {
    if (!user.el) return;
    user.el.style.transition = 'transform 0.44s cubic-bezier(0.34,1.56,0.64,1)';
    user.el.style.transform  = '';
    setTimeout(() => { if (user.el) user.el.style.transition = ''; }, 440);
  }, 240);
}

// ── バトルロイヤル ────────────────────────────────────────────────
function rushToChar(attacker, target) {
  if (!attacker.el || !target.el) return;
  const ar = attacker.el.getBoundingClientRect();
  const tr = target.el.getBoundingClientRect();
  const dx = (tr.left + tr.width  / 2) - (ar.left + ar.width  / 2);
  const dy = (tr.top  + tr.height / 2) - (ar.top  + ar.height / 2);
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const rx  = (dx / len) * Math.min(len * 0.55, 110);
  const ry  = (dy / len) * Math.min(len * 0.55, 110);
  attacker.el.style.transition = 'transform 0.24s ease-in';
  attacker.el.style.transform  = `translate(${rx}px,${ry}px) scale(1.2)`;
  setTimeout(() => {
    if (!attacker.el) return;
    attacker.el.style.transition = 'transform 0.44s cubic-bezier(0.34,1.56,0.64,1)';
    attacker.el.style.transform  = '';
    setTimeout(() => { if (attacker.el) attacker.el.style.transition = ''; }, 440);
  }, 240);
}

function brAttack(attacker, target) {
  if (!brState?.active) return;
  if (!brState.survivors.has(attacker.ipid) || !brState.survivors.has(target.ipid)) return;
  if (!attacker.el || !target.el) return;

  const atk      = calcAtk(attacker);
  const titleBon = typeof getTitleBonuses === 'function' ? getTitleBonuses(attacker) : { dmgM: 1, crit: 0 };
  const petId    = attacker.pet?.abilityId;
  const critBonus = petId === 'scout' ? 0.05 : petId === 'crit_up' ? 0.20 : 0;
  const isCrit   = Math.random() < (0.15 + critBonus + (titleBon.crit || 0));
  const hayaMult = attacker.hayaoshiBuff ? 1.5 : 1;
  attacker.hayaoshiBuff = false;
  const dmg = Math.round((isCrit
    ? Math.max(1, atk * (2 + Math.floor(Math.random() * 3)) * 2)
    : Math.max(1, atk * (1 + Math.floor(Math.random() * 3)))) * hayaMult * (titleBon.dmgM || 1));

  rushToChar(attacker, target);
  setTimeout(() => {
    if (!brState?.active || !brState.survivors.has(target.ipid)) return;
    brState.hp[target.ipid] = Math.max(0, (brState.hp[target.ipid] || 0) - dmg);
    updateStatsDisplay(target);
    playSentouSound();
    const { x, y } = getCharCenter(target);
    showDamageNumber(x, y - 20, (isCrit ? '💥' : '') + dmg.toLocaleString(), isCrit);
    if (target.el) {
      target.el.classList.add('trembling');
      setTimeout(() => target.el?.classList.remove('trembling'), 700);
    }
    showBRToast(attacker, target, dmg, isCrit, false, 0);
    if (brState.hp[target.ipid] <= 0) brEliminate(target);
  }, 240);
}

function brAutoAttack() {
  if (!brState?.active) return;
  const alive = [...brState.survivors].map(id => users[id]).filter(u => u?.el);
  if (alive.length >= 2) {
    const atk = alive[Math.floor(Math.random() * alive.length)];
    const others = alive.filter(u => u !== atk);
    brAttack(atk, others[Math.floor(Math.random() * others.length)]);
  }
  if (brState?.active) {
    brState.autoTimer = setTimeout(brAutoAttack, brState.interval);
  }
}

function brEliminate(user) {
  if (!brState?.active) return;
  brState.survivors.delete(user.ipid);
  brState.ranking.push(user.ipid);
  user.brOut = true;
  const rank = Object.keys(brState.maxHp).length - brState.ranking.length + 1;
  if (user.el) {
    const dx = (Math.random() - 0.5) * 300;
    const dy = -(100 + Math.random() * 150);
    const rot = (Math.random() - 0.5) * 270;
    user.el.style.transition = 'transform 0.7s ease-in, opacity 0.6s ease-in';
    user.el.style.transform  = `translate(${dx}px,${dy}px) rotate(${rot}deg) scale(0)`;
    user.el.style.opacity    = '0';
    setTimeout(() => { if (user.el) { user.el.remove(); user.el = null; } }, 700);
  }
  showBRToast(null, user, 0, false, true, rank);
  showBREliminationBanner(user, rank);
  addToLog(user, `💀 ${rank}位 脱落`, '#f87171');
  if (brState.survivors.size <= 1) {
    const winner = brState.survivors.size === 1 ? users[[...brState.survivors][0]] : null;
    setTimeout(() => endBattleRoyale(winner), 800);
  } else {
    // 脱落ごとに残存者を円形配置
    setTimeout(() => {
      if (!brState?.active) return;
      const survivors = [...brState.survivors].map(id => users[id]).filter(u => u?.el);
      arrangeBRCircle(survivors);
    }, 900);
  }
}

function endBattleRoyale(winner) {
  if (!brState) return;
  clearTimeout(brState.autoTimer);
  clearInterval(brState.escalateTimer);
  brState.active = false;
  if (winner) {
    brState.ranking.push(winner.ipid);
    winner.brWinner = true;
    addToLog(winner, '👑 バトルロイヤル 優勝！', '#fbbf24');
    showBRWinBanner(winner);
    updateNameDisplay(winner);
    winner.brWinnerScale = 3;
    applyAvatarStyle(winner);
    renderPetBadge(winner);
    setTimeout(() => {
      if (!winner.el) return;
      delete winner.brWinnerScale;
      applyAvatarStyle(winner);
      renderPetBadge(winner);
    }, 60000);
  }
  // 脱落キャラを保存済みHPで復活
  const savedHp = brState.savedHp || {};
  Object.values(users).forEach(u => { u.brOut = false; });
  const snapshot = brState;
  brState = null;
  Object.keys(snapshot.maxHp).forEach(ipid => {
    const u = users[ipid];
    if (!u) return;
    u.hp = savedHp[ipid] ?? (u.hp ?? 30);
    if (!u.el) ensureCharOnStage(u);
    updateStatsDisplay(u);
    updateNameDisplay(u);
  });
  const btn = document.getElementById('battleRoyaleBtn');
  if (btn) btn.classList.remove('active');
  setTimeout(() => gatherCharactersBottom(), 3000);
  // バトロワ終了後に自動でボス召喚（キャラが揃ってから）
  setTimeout(() => {
    if (bossState && !bossState.defeated) return;
    if (compactMode) return;
    const hp = nextBossHp();
    spawnBoss(hp);
    addToLog({ name: 'SYSTEM', charDef: null }, `🐉 バトロワ後ボス召喚！ HP:${hp}`, '#ef4444');
  }, 7000);
}

function showBRToast(attacker, target, damage, isCrit, isElim, rank) {
  const container = document.getElementById('brToastContainer');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'br-toast' + (isCrit ? ' br-toast-crit' : '') + (isElim ? ' br-toast-elim' : '');
  if (isElim) {
    el.innerHTML = `💀 <b>${escapeHtml(target.name)}</b> が脱落<span class="br-rank">${rank}位</span>`;
  } else {
    el.innerHTML = `<span class="br-atk">${escapeHtml(attacker.name)}</span> ⚔️ <span class="br-tgt">${escapeHtml(target.name)}</span> <span class="br-dmg">${isCrit ? '💥' : '−'}${damage.toLocaleString()}</span>`;
  }
  container.prepend(el);
  while (container.children.length > 10) container.lastChild.remove();
  setTimeout(() => el.remove(), 2800);
}

function showBREliminationBanner(user, rank) {
  const el = document.createElement('div');
  el.className = 'br-elim-banner';
  el.innerHTML = `<span class="br-elim-name">💀 ${escapeHtml(user.name)}</span><span class="br-elim-rank">${rank}位 脱落</span>`;
  document.getElementById('stage').appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

function showBRWinBanner(winner) {
  const banner = document.createElement('div');
  banner.className = 'br-win-banner';
  banner.innerHTML = `👑 ${escapeHtml(winner.name)}<br><span style="font-size:16px">が優勝！</span>`;
  document.getElementById('stage').appendChild(banner);
  spawnFireworks(getCharCenter(winner).x, getCharCenter(winner).y);
  spawnHeartShower(getCharCenter(winner).x, getCharCenter(winner).y);
  showBubble(winner, '👑 優勝！', {});
  setTimeout(() => banner.remove(), 5000);
}

function startBattleRoyale() {
  // トグル：起動中なら強制終了
  if (brState?.active) {
    endBattleRoyale(null);
    return;
  }
  if (bossState && !bossState.defeated) {
    showBRToast(null, { name: 'ボス戦中はBR不可' }, 0, false, true, 0);
    return;
  }
  const eligible = Object.values(users).filter(u => u.el && !u.ko && !u.afk);
  if (eligible.length < 2) {
    showBRToast(null, { name: '参加者2人以上必要です' }, 0, false, true, 0);
    return;
  }
  brNextAutoAt = Date.now() + 30 * 60 * 1000; // 次回自動BRタイマーをリセット
  const savedHp = {};
  eligible.forEach(u => { savedHp[u.ipid] = u.hp ?? 30; });
  brState = {
    active: true,
    survivors: new Set(eligible.map(u => u.ipid)),
    hp: {}, maxHp: {}, savedHp, ranking: [], autoTimer: null,
    interval: 1000, escalateTimer: null,
  };
  eligible.forEach(u => {
    const mhp = calcMaxHp(u) * brHpMult;
    brState.hp[u.ipid] = mhp;
    brState.maxHp[u.ipid] = mhp;
  });
  // 5秒ごとに10ms短縮（最小100ms）
  brState.escalateTimer = setInterval(() => {
    if (!brState) return;
    brState.interval = Math.max(100, brState.interval - 10);
  }, 5000);
  const btn = document.getElementById('battleRoyaleBtn');
  if (btn) btn.classList.add('active');
  const banner = document.createElement('div');
  banner.className = 'br-start-banner';
  banner.textContent = `👑 バトルロイヤル開始！ ${eligible.length}人参戦`;
  document.getElementById('stage').appendChild(banner);
  setTimeout(() => banner.remove(), 3000);
  addToLog({ name: 'SYSTEM', charDef: null }, `👑 バトルロイヤル開始！ ${eligible.length}人参戦`, '#fbbf24');
  eligible.forEach(u => updateStatsDisplay(u));
  arrangeBRCircle(eligible);
  brState.autoTimer = setTimeout(brAutoAttack, brState.interval);
}

function arrangeBRCircle(participants) {
  const sw = stage.clientWidth;
  const sh = stage.clientHeight;
  const cx = sw / 2;
  const cy = sh / 2;
  const n  = participants.length;
  // 参加人数に応じて半径を調整（最小100、最大は画面の38%）
  const minR = n * 30;
  const r    = Math.max(minR, Math.min(sw, sh) * 0.38);

  participants.forEach((u, i) => {
    if (!u.el) return;
    // 移動タイマーを一時停止
    if (u.moveTimer) { clearTimeout(u.moveTimer); u.moveTimer = null; }
    if (u.walkTimer) { clearTimeout(u.walkTimer); u.walkTimer = null; }

    const angle = (i / n) * Math.PI * 2 - Math.PI / 2; // 12時位置スタート
    const hw = Math.round(u.size * 1.5 * charSizeScale) / 2;
    const clamped = clampToStage(u, Math.round(cx + r * Math.cos(angle) - hw), Math.round(cy + r * Math.sin(angle) - hw));
    u.x = clamped.x;
    u.y = clamped.y;
    u.el.style.transition = 'left 0.7s ease-in-out, top 0.7s ease-in-out';
    u.el.style.left = u.x + 'px';
    u.el.style.top  = u.y + 'px';
    setTimeout(() => { if (u.el) u.el.style.transition = ''; }, 800);
  });
}

function damageUser(user, dmg) {
  if (user.ko) return;
  if (user.afk) return;
  let effectiveDmg = dmg;
  if (user.pet?.abilityId  === 'guard')   effectiveDmg = Math.max(0, effectiveDmg - 1);
  if (user.pet2?.abilityId === 'guard')   effectiveDmg = Math.max(0, effectiveDmg - 1);
  if (user.pet?.abilityId  === 'barrier' && Math.random() < 0.20) effectiveDmg = Math.max(0, effectiveDmg - 3);
  if (user.pet2?.abilityId === 'barrier' && Math.random() < 0.20) effectiveDmg = Math.max(0, effectiveDmg - 3);
  // 称号ダメ軽減
  if (typeof getTitleBonuses === 'function') {
    const tb = getTitleBonuses(user);
    const redRate = Math.min(tb.red || 0, 0.80);
    effectiveDmg = Math.max(0, Math.round(effectiveDmg * (1 - redRate)));
    // T80: 百戦不敗 — 5%でダメージ完全回避
    if (hasTitle(user,'T80') && Math.random() < 0.05) { effectiveDmg = 0; showDamageNumber && (()=>{ const {x,y}=getCharCenter(user); showDamageNumber(x,y-20,'🛡MISS',false,16,'#a3e635'); })(); }
  }
  // HP5以下で生き残りカウント（ダメ後に残HP追跡）
  const hpBefore = user.hp ?? 30;
  user.hp = Math.max(0, (user.hp ?? 30) - effectiveDmg);
  if (hpBefore > 1 && user.hp >= 1 && user.hp <= 5 && !user.ko) {
    if (!user.tc) user.tc = {};
    user.tc.lowHpSurvive = (user.tc.lowHpSurvive || 0) + 1;
  }
  if (user.el) {
    const { x, y } = getCharCenter(user);
    showDamageNumber(x, y - 20, '💢' + dmg, false, 18, '#ff6b6b');
    user.el.classList.add('trembling');
    setTimeout(() => user.el && user.el.classList.remove('trembling'), 700);
  }
  updateStatsDisplay(user);
  if (user.hp <= 0) charDeath(user);
}

function charDeath(user) {
  // 不死鳥ペット: 1度だけ復活
  if (user.pet?.abilityId === 'revive' && !user.pet.reviveUsed) {
    user.pet.reviveUsed = true;
    user.hp = Math.round((user.maxHp ?? 30) * 0.5);
    updateStatsDisplay(user);
    showBubble(user, '🔥 不死鳥復活！', {});
    const { x, y } = getCharCenter(user);
    showDamageNumber(x, y - 30, '🔥復活!', false, 20, '#f97316');
    return;
  }
  user.deaths = (user.deaths || 0) + 1;
  // 装備は保持
  const savedEquips = [...(user.equips || [])];
  user.ko    = true;
  user.level = 1;
  user.exp   = 0;
  // MP は死亡時に自動回復しない
  user.equips = savedEquips;
  user.maxHp  = calcMaxHp(user);
  user.hp     = user.maxHp;
  user.atk    = calcAtk(user);
  if (user.el) user.el.classList.add('knocked-out');
  if (user.koTimer) clearTimeout(user.koTimer);
  user.koTimer = setTimeout(() => {
    user.ko = false;
    if (user.el) {
      user.el.classList.remove('knocked-out');
      user.el.classList.add('revived');
      user.el.addEventListener('animationend', () => user.el?.classList.remove('revived'), { once: true });
      showBubble(user, '復活！', {});
    }
    updateLevelBadge(user);
    applyAvatarStyle(user);
    updateEquipBadge(user);
    updateStatsDisplay(user);
  }, 2000);
  updateLevelBadge(user);
  applyAvatarStyle(user);
  updateStatsDisplay(user);
}

function reviveUser(user) {
  if (user.koTimer) { clearTimeout(user.koTimer); user.koTimer = null; }
  user.ko = false;
  if (user.el) {
    user.el.classList.remove('knocked-out');
    user.el.classList.add('revived');
    user.el.addEventListener('animationend', () => user.el?.classList.remove('revived'), { once: true });
  }
  updateStatsDisplay(user);
}

function showBossSpeech(text) {
  const prev = document.getElementById('bossSpeech');
  if (prev) prev.remove();
  if (!bossState?.el) return;
  const el = document.createElement('div');
  el.id = 'bossSpeech';
  const avatarEl = document.getElementById('bossAvatar');
  const br = (avatarEl || bossState.el).getBoundingClientRect();
  const sr = stage.getBoundingClientRect();
  const speechWidth = 240;
  const left = Math.max(5, br.left - sr.left + br.width / 2 - speechWidth * 0.7);
  const top  = Math.max(5, br.top - sr.top + 10);
  el.style.left = left + 'px';
  el.style.top  = top  + 'px';
  stage.appendChild(el);
  typewriter(el, text, 55, () => setTimeout(() => el.remove(), 2800));
}

function bossCounterAttack() {
  if (!bossState) return;
  playSentouSound();
  stage.classList.add('stage-shock');
  stage.addEventListener('animationend', () => stage.classList.remove('stage-shock'), { once: true });
  const bossAtk = 5 + (bossCount - 1);
  Object.values(users).forEach(u => { if (u.el) damageUser(u, bossAtk); });
  // ボスがセリフを喋る
  if (bossTexts.length > 0) {
    showBossSpeech(bossTexts[Math.floor(Math.random() * bossTexts.length)]);
  }
}

function updateLevelBadge(user) {
  if (!user.el) return;
  let badge = user.el.querySelector('.char-level-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.className = 'char-level-badge';
    user.el.appendChild(badge);
  }
  const lv = user.level || 1;
  badge.textContent = `Lv.${lv}`;
  badge.className = 'char-level-badge' + (lv >= 2 ? ` lv${lv}` : '');
}

function showDamageNumber(x, y, text, isCrit, forceFontSize, color) {
  if (compactMode) return;
  const el = document.createElement('div');
  el.className = 'dmg-number' + (isCrit ? ' dmg-crit' : '');
  el.textContent = String(text);
  const numVal = typeof text === 'number' ? text : (parseInt(String(text).replace(/\D/g, '')) || 0);
  el.style.fontSize = (forceFontSize
    ? forceFontSize * 3
    : Math.min((18 + Math.floor(numVal / 4) * 3) * 3, 174)) + 'px';
  if (color) el.style.color = color;
  el.style.left = (x - 15 + (Math.random() - 0.5) * 60) + 'px';
  el.style.top  = (y      + (Math.random() - 0.5) * 30) + 'px';
  stage.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

function spawnBoss(maxHp) {
  bossManuallyCleared = false;
  if (bossState) {
    if (bossState.el) bossState.el.remove();
  }
  // ボス画像：charaフォルダからランダム選択、なければ絵文字
  const bossImg = availableImages.length > 0
    ? availableImages[Math.floor(Math.random() * availableImages.length)]
    : null;
  const avatarInner = bossImg
    ? `<img src="/chara/${encodeURIComponent(bossImg)}" alt="boss">`
    : '🐉';

  // HP に応じてボスサイズを決定（HP 100→120px, HP 2000→420px）
  const bossSize = Math.round((maxHp > 3000
    ? Math.round((1 + Math.random() * 3) * 80)
    : Math.round((80 + Math.min(maxHp - 100, 1900) / 1900 * 200) * 1.5)) * bossSizeScale);
  const barWidth = Math.min(Math.round(stage.clientWidth * 0.6), Math.max(150, Math.round(bossSize * 1.25)));

  const el = document.createElement('div');
  el.id = 'bossEl';
  el.style.left = (bossLastPos ? bossLastPos.x : Math.max(0, stage.clientWidth / 2 - barWidth / 2)) + 'px';
  el.style.top  = (bossLastPos ? bossLastPos.y : 20) + 'px';
  el.innerHTML = `
    <div class="boss-label-row" style="width:${barWidth}px">
      <span class="boss-label">${bossCount} BOSS</span>
    </div>
    <div class="boss-hp-wrap" style="width:${barWidth}px">
      <div class="boss-hp-bar" id="bossHpBar"></div>
      <span class="boss-hp-text" id="bossHpText"></span>
    </div>
    <div class="boss-avatar" id="bossAvatar" style="width:${bossSize}px;height:${bossSize}px;font-size:${Math.round(bossSize*0.87)}px">${avatarInner}</div>
  `;
  stage.appendChild(el);
  bossState = { hp: maxHp, maxHp, el, defeated: false, origSize: bossSize };
  updateBossHpDisplay();

  el.addEventListener('mousedown', e => {
    if (e.button !== 0 || dragState || trashDragState) return;
    const r = el.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    bossDragState = {
      ox: r.left - sr.left,
      oy: r.top  - sr.top,
      sx: e.clientX,
      sy: e.clientY,
    };
    el.style.transition = 'none';
    e.preventDefault();
    e.stopPropagation();
  });
}

function updateBossHpDisplay() {
  if (!bossState) return;
  const pct = Math.max(0, bossState.hp / bossState.maxHp * 100);
  const bar = document.getElementById('bossHpBar');
  const txt = document.getElementById('bossHpText');
  if (bar) {
    bar.style.width = pct + '%';
    if      (pct > 50) bar.style.background = 'linear-gradient(90deg,#ef4444,#f97316)';
    else if (pct > 25) bar.style.background = 'linear-gradient(90deg,#f97316,#fbbf24)';
    else               bar.style.background = 'linear-gradient(90deg,#dc2626,#ef4444)';
    bar.classList.toggle('low-hp', pct <= 25);
  }
  if (txt) txt.textContent = `HP ${bossState.hp} / ${bossState.maxHp}`;
}

function attackBoss(user, msgLen) {
  if (!bossState || bossState.hp <= 0 || bossState.defeated) return;
  if (user.ko) return;
  ensureCharOnStage(user);

  // コメント文字数4文字ごとに1ヒット（最低1ヒット）
  const hits = Math.max(1, Math.ceil((msgLen || 1) / 4));

  const atk       = calcAtk(user);
  const petId     = user.pet?.abilityId;
  const titleBon  = typeof getTitleBonuses === 'function' ? getTitleBonuses(user) : { dmgM:1, crit:0 };
  const critBonus = petId === 'scout' ? 0.05 : petId === 'crit_up' ? 0.20 : 0;
  const isCrit    = Math.random() < (0.15 + critBonus + (titleBon.crit || 0));
  const hayaoshiMult = user.hayaoshiBuff ? 1.5 : 1;
  user.hayaoshiBuff = false;
  user.el?.classList.remove('char-burning');

  const totalDmg = Math.round((isCrit
    ? Math.max(1, atk * (2 + Math.floor(Math.random() * 3)) * 2)
    : Math.max(1, atk * (1 + Math.floor(Math.random() * 3)))) * hayaoshiMult * (titleBon.dmgM || 1));

  // 合計ダメージをヒット数で均等分割（余りは最終ヒットに）
  const baseDmg = Math.floor(totalDmg / hits);
  const hitDmgs = Array.from({ length: hits }, (_, i) =>
    i === hits - 1 ? totalDmg - baseDmg * (hits - 1) : baseDmg
  );

  // MP回復（コメント1回分、ヒット数に依存しない）
  const mpExtra = { mp_boost:1, mp_regen:2, mp_master:3 }[petId] ?? 0;
  user.mp = Math.min(20, (user.mp ?? 0) + 1 + mpExtra);
  if (user.mp >= 20 && !user.ko) {
    user.mp -= 2;
    if (!user.tc) user.tc = {};
    user.tc.mpFull = (user.tc.mpFull || 0) + 1;
    Object.values(users).forEach(u => {
      if (!u.el || u.ko) return;
      u.hp = Math.min(calcMaxHp(u), (u.hp ?? 30) + 2);
      updateStatsDisplay(u);
      const { x: ux, y: uy } = getCharCenter(u);
      showDamageNumber(ux, uy - 30, '🩹+2', false, 16, '#86efac');
    });
    addToLog(user, '✨ MP満タン → 全員HP+2回復！', '#86efac');
  }
  updateStatsDisplay(user);

  // EXP（コメント1回分）
  const expGain = Math.round((1 + (petId === 'exp_up' ? 1 : 0)) * (titleBon.expM || 1));
  user.exp = (user.exp || 0) + expGain;
  const newLv = calcLevel(user.exp);
  if (newLv > (user.level || 1)) {
    user.level = newLv;
    user.atk   = calcAtk(user);
    user.maxHp = calcMaxHp(user);
    updateLevelBadge(user);
    applyAvatarStyle(user);
    updateStatsDisplay(user);
    if (user.el) {
      user.el.classList.remove('lv-up-flash');
      void user.el.offsetWidth;
      user.el.classList.add('lv-up-flash');
      user.el.addEventListener('animationend', () => user.el?.classList.remove('lv-up-flash'), { once: true });
    }
    showBubble(user, `Lv.${newLv} に上がった！🎉`, {});
    const { x: lvx, y: lvy } = getCharCenter(user);
    spawnHeartShower(lvx, lvy);
    showLevelUpBanner();
  }

  // 反撃は全ヒット終了後に判定（ボス生存時のみ）
  const doCounter = Math.random() < bossCounterRate;

  // ヒットごとに 0.2s 間隔で攻撃モーション・ダメージ・効果音
  for (let i = 0; i < hits; i++) {
    const hd     = hitDmgs[i];
    const isLast = i === hits - 1;
    setTimeout(() => {
      // 前のヒットでボスが倒れていたらスキップ
      if (!bossState || bossState.defeated || bossState.hp <= 0) return;

      rushToBoss(user);

      setTimeout(() => {
        if (!bossState?.el || bossState.defeated) return;

        // ダメージ適用
        bossState.hp = Math.max(0, bossState.hp - hd);
        const hitDefeated = bossState.hp <= 0;
        updateBossHpDisplay();

        // ダメージ記録
        if (!bossDamageMap[user.ipid]) bossDamageMap[user.ipid] = { name: user.name || '名無し', totalDmg: 0 };
        bossDamageMap[user.ipid].name = user.name || '名無し';
        bossDamageMap[user.ipid].totalDmg += hd;
        user.totalDmgDealt = (user.totalDmgDealt || 0) + hd;

        // 効果音・フラッシュ・ダメージ表示
        playSentouSound();
        const ba = bossState.el.querySelector('#bossAvatar');
        if (ba) {
          ba.classList.remove('boss-hit-flash');
          void ba.offsetWidth;
          ba.classList.add('boss-hit-flash');
          ba.addEventListener('animationend', () => ba.classList.remove('boss-hit-flash'), { once: true });
        }
        const br = bossState.el.getBoundingClientRect();
        const sr = stage.getBoundingClientRect();
        const bx = br.left - sr.left + br.width / 2;
        const by = br.top  - sr.top  + 30;
        showDamageNumber(bx + (Math.random() - 0.5) * 70, by, (isCrit ? '💥' : '') + hd, isCrit);

        // 最終ヒットでペット攻撃・倒した判定
        if (isLast && !hitDefeated) {
          applyPetAttack(user);
          if (bossState && bossState.hp <= 0 && !bossState.defeated) {
            if (!user.tc) user.tc = {};
            user.tc.bossKills = (user.tc.bossKills || 0) + 1;
            setTimeout(() => defeatBoss(), 200);
          }
        }
        if (hitDefeated) {
          if (!user.tc) user.tc = {};
          user.tc.bossKills = (user.tc.bossKills || 0) + 1;
          setTimeout(() => defeatBoss(), 200);
        }
      }, 120);
    }, i * 200);
  }

  // 反撃：全ヒット後にボスが生存していれば発動
  if (doCounter) {
    setTimeout(() => {
      if (bossState && !bossState.defeated) bossCounterAttack();
    }, hits * 200 + 350);
  }
}

function rushPetToBoss(user, elId) {
  const petEl = document.getElementById(elId || ('p-' + user.ipid));
  if (!petEl || !bossState?.el) return;
  const pr = petEl.getBoundingClientRect();
  const br = bossState.el.getBoundingClientRect();
  const dx = (br.left + br.width  / 2) - (pr.left + pr.width  / 2);
  const dy = (br.top  + br.height / 2) - (pr.top  + pr.height / 2);
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const rx  = (dx / len) * Math.min(len * 0.6, 120);
  const ry  = (dy / len) * Math.min(len * 0.6, 120);
  petEl.style.transition = 'transform 0.12s ease-in';
  petEl.style.transform  = `translate(${rx}px,${ry}px) scale(1.4)`;
  setTimeout(() => {
    if (!petEl.isConnected) return;
    petEl.style.transition = 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1)';
    petEl.style.transform  = '';
    setTimeout(() => { if (petEl.isConnected) petEl.style.transition = ''; }, 220);
  }, 120);
}

function applyPetAttack(user) {
  applyOnePetAttack(user, user.pet,  'p-'  + user.ipid, 0);
  if (user.pet2) applyOnePetAttack(user, user.pet2, 'p2-' + user.ipid, 800);
}

function applyOnePetAttack(user, pet, petElId, timeOffset) {
  if (!pet || !bossState || bossState.hp <= 0 || bossState.defeated) return;
  const aid  = pet.abilityId;
  const base = Math.max(1, Math.round(calcAtk(user) * 0.25));

  // ダメージ乗数
  let mult = 1;
  if (aid === 'avenger' && (user.hp ?? 30) < (user.maxHp ?? 30) * 0.5) mult = 1.5;
  if (aid === 'berserk' && (user.hp ?? 30) < (user.maxHp ?? 30) * 0.3) mult = 3;
  if (aid === 'godhand' && Math.random() < 0.05) mult = 20;
  if (aid === 'charge') { pet._chargeCount = (pet._chargeCount || 0) + 1; if (pet._chargeCount % 2 === 0) mult = 2; }

  // 攻撃回数
  const hitMap = { extra_hit:1, double_hit:2, triple_hit:3, quad_hit:4, storm:5,
                   chain:1, regen:1, hp_steal:1, soul_steal:1, full_drain:1,
                   team_heal:1, poison:1, burn:1, charge:1, avenger:1, berserk:1, godhand:1, omega:1 };
  let hits = hitMap[aid] ?? 1;
  if (aid === 'cheer') hits = Math.random() < 0.10 ? 1 : 0;
  if (aid === 'chain') hits = Math.random() < 0.35 ? 2 : 1;
  if (hits === 0) return;

  const petDmg   = Math.max(1, Math.round(base * mult));
  const CHAR_MS  = 370 + timeOffset;   // キャラ攻撃が戻るまで待つ
  const HIT_MS   = 400;   // ペット1回攻撃ごとの間隔
  let accDmg     = 0;

  for (let i = 0; i < hits; i++) {
    const isLast = i === hits - 1;
    setTimeout(() => {
      if (!bossState || bossState.hp <= 0 || bossState.defeated) return;

      // 突進モーション
      rushPetToBoss(user, petElId);

      // 120ms後（ヒットタイミング）にダメージ処理
      setTimeout(() => {
        if (!bossState || bossState.hp <= 0) return;

        bossState.hp = Math.max(0, bossState.hp - petDmg);
        updateBossHpDisplay();
        if (!bossDamageMap[user.ipid]) bossDamageMap[user.ipid] = { name: user.name || '名無し', totalDmg: 0 };
        bossDamageMap[user.ipid].totalDmg += petDmg;
        user.totalDmgDealt = (user.totalDmgDealt || 0) + petDmg;
        accDmg += petDmg;

        // ダメージ数字
        if (bossState?.el) {
          const br = bossState.el.getBoundingClientRect();
          const sr = stage.getBoundingClientRect();
          showDamageNumber(
            br.left - sr.left + br.width / 2 + (Math.random() - 0.5) * 70,
            br.top  - sr.top  + 40,
            `🐾${petDmg}`, false, 14, '#a78bfa'
          );
        }

        // ボスフラッシュ
        const ba = bossState?.el?.querySelector('#bossAvatar');
        if (ba) { ba.classList.remove('boss-hit-flash'); void ba.offsetWidth; ba.classList.add('boss-hit-flash'); ba.addEventListener('animationend', () => ba.classList.remove('boss-hit-flash'), { once: true }); }

        // 討伐チェック（どのヒットでも）
        if (bossState && bossState.hp <= 0 && !bossState.defeated) {
          if (isLast) applyPetSideEffects(user, aid, accDmg);
          setTimeout(() => defeatBoss(), 200);
          return;
        }
        // 最終ヒット：副効果
        if (isLast) applyPetSideEffects(user, aid, accDmg);
      }, 120);

    }, CHAR_MS + i * HIT_MS);
  }
}

function applyPetSideEffects(user, aid, totalDmg) {
  const stealPct = { hp_steal:0.25, soul_steal:0.40, full_drain:0.60 }[aid];
  if (stealPct) { user.hp = Math.min(user.maxHp ?? 30, (user.hp ?? 30) + Math.max(1, Math.round(totalDmg * stealPct))); updateStatsDisplay(user); }
  if (aid === 'regen') { user.hp = Math.min(user.maxHp ?? 30, (user.hp ?? 30) + 2); updateStatsDisplay(user); }
  if (aid === 'team_heal') { Object.values(users).forEach(u => { if (!u.el || u.ko) return; u.hp = Math.min(u.maxHp ?? 30, (u.hp ?? 30) + 1); updateStatsDisplay(u); }); }
  if (aid === 'omega' && Math.random() < 0.15) {
    Object.values(users).forEach(u => {
      if (!u.el || u.ko) return;
      u.hp = u.maxHp ?? 30; updateStatsDisplay(u);
      const { x, y } = getCharCenter(u);
      showDamageNumber(x, y - 30, '✨全回復', false, 16, '#86efac');
    });
  }
  if (aid === 'poison' && Math.random() < 0.25 && bossState) {
    let n = 0;
    const t = setInterval(() => {
      if (!bossState || bossState.hp <= 0 || bossState.defeated || n++ >= 3) { clearInterval(t); return; }
      bossState.hp = Math.max(0, bossState.hp - 3);
      updateBossHpDisplay();
      if (bossState.hp <= 0 && !bossState.defeated) { clearInterval(t); setTimeout(() => defeatBoss(), 200); }
    }, 1500);
  }
  if (aid === 'burn' && Math.random() < 0.35 && bossState) {
    let n = 0;
    const t = setInterval(() => {
      if (!bossState || bossState.hp <= 0 || bossState.defeated || n++ >= 3) { clearInterval(t); return; }
      bossState.hp = Math.max(0, bossState.hp - 5);
      updateBossHpDisplay();
      if (bossState.hp <= 0 && !bossState.defeated) { clearInterval(t); setTimeout(() => defeatBoss(), 200); }
    }, 1500);
  }
}

function defeatBoss() {
  if (!bossState || bossState.defeated) return;
  bossState.defeated = true;
  bossCount++;
  const bossMaxHp = bossState.maxHp;
  const el = bossState.el;

  // ボス撃破アニメーション
  el.style.transition = 'transform 0.5s ease-in, opacity 0.5s ease-in';
  el.style.transform  = 'scale(3) rotate(25deg)';
  el.style.opacity    = '0';

  // 大花火・紙吹雪
  const sw = stage.clientWidth, sh = stage.clientHeight;
  for (let i = 0; i < 10; i++) {
    setTimeout(() => spawnFireworks(Math.random() * sw, Math.random() * sh * 0.8), i * 130);
  }
  spawnConfetti();

  // 称号用: 参加者カウント
  Object.values(users).forEach(u => {
    if (!u.el) return;
    if (!u.tc) u.tc = {};
    u.tc.bossParticipations = (u.tc.bossParticipations || 0) + 1;
  });

  // 全キャラ処理
  Object.values(users).forEach((u, idx) => {
    // KO復活
    if (u.ko) reviveUser(u);

    // HP+20回復
    u.maxHp = calcMaxHp(u);
    u.hp    = Math.min(u.maxHp, (u.hp ?? 30) + 20);
    updateStatsDisplay(u);

    if (u.el) {
      applyMotion(u, 'bouncing');
      setTimeout(() => applyMotion(u, null), 6000);
    }

    // 装備ドロップ（少し時差をつけて演出）
    setTimeout(() => {
      if (!u.el) return;
      const value    = rollEquipValue(bossMaxHp) + (u.pet?.abilityId === 'lucky' ? 1 : 0);
      const type     = EQUIP_POOL[Math.floor(Math.random() * EQUIP_POOL.length)];
      const rarEntry = RARITY[Math.min(value, RARITY.length - 1)] || RARITY[1];
      const newEquip = { ...type, value, rarityName: rarEntry.name, rarityCls: rarEntry.cls };

      // 同名装備があれば合成（+10超え可能、追加分は50%換算）
      if (!u.equips) u.equips = [];
      const existing = u.equips.find(e => e.name === newEquip.name);
      if (existing) {
        const gain = Math.max(1, Math.floor(newEquip.value * 0.5));
        existing.value += gain;
        const r2 = RARITY[Math.min(existing.value, RARITY.length - 1)] || RARITY[1];
        existing.rarityName = r2.name; existing.rarityCls = r2.cls;
        showBubble(u, `${existing.icon}${existing.name}合成！ ${existing.stat === 'atk' ? 'ATK' : 'HP'}+${existing.value}(+${gain})`, {});
      } else {
        u.equips.push(newEquip);
        const statLabel = newEquip.stat === 'atk' ? 'ATK' : 'HP';
        showBubble(u, `${newEquip.icon}${newEquip.name}[${newEquip.rarityName}] ${statLabel}+${value}！`, {});
      }

      u.maxHp = calcMaxHp(u);
      u.atk   = calcAtk(u);
      updateEquipBadge(u);
      updateStatsDisplay(u);

      const { x, y } = getCharCenter(u);
      if (value >= 9) { spawnFireworks(x, y); spawnHeartShower(x, y); showMythDrop(); }
      else if (value >= 7) spawnFireworks(x, y);
      else if (value >= 5) spawnHeartShower(x, y);
    }, 1200 + idx * 200);
  });

  // 全ユーザの称号チェック（装備更新後）
  setTimeout(() => {
    if (typeof checkTitles === 'function') {
      Object.values(users).forEach(u => { if (u.el) checkTitles(u); });
    }
  }, 1800);

  setTimeout(() => {
    el.remove();
    bossState = null;
    showDamageRanking(bossDamageMap);
    // 手動消去でなければ次のボスを自動召喚（討伐演出が落ち着く頃に）
    if (!bossManuallyCleared && !compactMode) {
      setTimeout(() => {
        if (bossState || bossManuallyCleared || compactMode) return;
        spawnBoss(nextBossHp());
      }, 6000);
    }
  }, 600);
}

// ──────────────────────────────────────────────────────────────────
// レベルアップバナー
// ──────────────────────────────────────────────────────────────────
function showMythDrop() {
  const prev = document.getElementById('mythDropOverlay');
  if (prev) prev.remove();
  const ov = document.createElement('div');
  ov.id = 'mythDropOverlay';
  ov.innerHTML = '<div id="mythDropRays"></div><div id="mythDropText">⚡ 神話ドロップ！！ ⚡<br>✨MYTHIC✨</div>';
  document.body.appendChild(ov);

  // 星エフェクトを画面全体にばらまく
  const stars = ['⭐','🌟','✨','💫','🔥','👑','💎','🎆'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const s = document.createElement('div');
      s.className = 'myth-star';
      s.textContent = stars[Math.floor(Math.random() * stars.length)];
      s.style.left = (Math.random() * 100) + 'vw';
      s.style.top  = (20 + Math.random() * 70) + 'vh';
      s.style.animationDelay    = (Math.random() * 0.4) + 's';
      s.style.animationDuration = (0.8 + Math.random() * 0.8) + 's';
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove(), { once: true });
    }, i * 60);
  }

  playLocalSound(SOUND_MYTH_DROP);

  setTimeout(() => ov.remove(), 3600);
}

function showLevelUpBanner() {
  const prev = document.getElementById('levelupBanner');
  if (prev) prev.remove();
  const el = document.createElement('div');
  el.id = 'levelupBanner';
  el.innerHTML = '<img src="/img/levelup.png" alt="Level Up!">';
  stage.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
  playLocalSound('/sound/char/maplestory-lvl-up.mp3');
}

// 音声再生
// ──────────────────────────────────────────────────────────────────
function playLocalSound(src) {
  if (compactMode) return;
  try { const a = new Audio(src); a.volume = 0.8; a.play().catch(() => {}); } catch {}
}

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

  // バトルロイヤル中：脱落済みユーザーは処理スキップ
  if (brState?.active && user.brOut) return;

  // icon_name が匿名でなければ実名を使用、匿名ならnames.txtのランダム名を維持
  if (comment.icon_name && !user.nameManual) {
    if (!comment.icon_name.includes('匿名')) {
      user.name = comment.icon_name;
      updateNameDisplay(user);
    }
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
  user.commentCount = (user.commentCount || 0) + 1;

  // コメント毎に基礎 EXP +1（ボス有無・コンパクトモード問わず）
  user.exp = (user.exp || 0) + 1;
  {
    const newLv = calcLevel(user.exp);
    if (newLv > (user.level || 1)) {
      user.level = newLv;
      user.atk   = calcAtk(user);
      user.maxHp = calcMaxHp(user);
      updateLevelBadge(user);
      applyAvatarStyle(user);
      updateStatsDisplay(user);
      if (user.el) {
        user.el.classList.remove('lv-up-flash');
        void user.el.offsetWidth;
        user.el.classList.add('lv-up-flash');
        user.el.addEventListener('animationend', () => user.el?.classList.remove('lv-up-flash'), { once: true });
      }
      showBubble(user, `Lv.${newLv} に上がった！🎉`, {});
      const { x: lvx, y: lvy } = getCharCenter(user);
      spawnHeartShower(lvx, lvy);
      showLevelUpBanner();
    }
  }

  const rawMessage = comment.message ?? '';
  const message    = stripPrefix(rawMessage);

  // ── 早押しチェック（他の処理より前に判定）──────
  {
    const trimmedMsg = message.trim();
    const matchWhite = hayaoshiItems.find(it => it.type === 'white' && it.keyword === trimmedMsg);
    if (matchWhite) {
      clearTimeout(matchWhite.timeoutId);
      hayaoshiItems.splice(hayaoshiItems.indexOf(matchWhite), 1);
      scatterNikoComment(matchWhite.el);
      ensureCharOnStage(user);
      user.hayaoshiWins = (user.hayaoshiWins || 0) + 1;
      if (!user.tc) user.tc = {};
      user.tc.whiteHayaoshi = (user.tc.whiteHayaoshi || 0) + 1;
      user.hp = Math.min(calcMaxHp(user), (user.hp ?? 30) + 10);
      updateStatsDisplay(user);
      const { x: wx, y: wy } = getCharCenter(user);
      showDamageNumber(wx, wy - 60, matchWhite.keyword, false, 10, '#86efac');
      showDamageNumber(wx, wy - 30, '💊+10', false, 20, '#86efac');
      spawnFireworks(wx, wy);
      playLocalSound(SOUND_HAYAOSHI_WHITE);
    }
    const matchRed = hayaoshiItems.find(it => it.type === 'red' && it.keyword === trimmedMsg);
    if (matchRed) {
      clearTimeout(matchRed.timeoutId);
      hayaoshiItems.splice(hayaoshiItems.indexOf(matchRed), 1);
      scatterNikoComment(matchRed.el);
      ensureCharOnStage(user);
      user.hayaoshiWins = (user.hayaoshiWins || 0) + 1;
      if (!user.tc) user.tc = {};
      user.tc.redHayaoshi = (user.tc.redHayaoshi || 0) + 1;
      user.hayaoshiBuff = true;
      user.el?.classList.add('char-burning');
      const { x: rx, y: ry } = getCharCenter(user);
      showDamageNumber(rx, ry - 60, matchRed.keyword, false, 10, '#fbbf24');
      showDamageNumber(rx, ry - 30, '⚡×1.5', false, 20, '#fbbf24');
      spawnFireworks(rx, ry);
      playLocalSound(SOUND_HAYAOSHI_RED);
    }
  }

  // ── クイズ回答チェック ────────────────────────
  if (quizState && !quizState.answered) {
    handleQuizAnswer(user, message.trim());
  }

  // ── AFK ───────────────────────────────────────
  if (user.afk) {
    user.afk = false;
    if (user.afkEl) { user.afkEl.remove(); user.afkEl = null; }
    user.el?.classList.remove('char-afk');
  }
  if (/AFK/i.test(message)) {
    ensureCharOnStage(user);
    user.afk = true;
    if (user.afkEl) user.afkEl.remove();
    const afkEl = document.createElement('div');
    afkEl.className = 'afk-bubble';
    afkEl.textContent = '💤 AFK';
    user.el.appendChild(afkEl);
    user.afkEl = afkEl;
    user.el.classList.add('char-afk');
    addToLog(user, '💤 AFK', '#64748b');
    return;
  }

  // ── 宝箱を開ける ─────────────────────────────
  if (message.trim() === '開ける') {
    openTreasureChest(user);
    return;
  }

  // ── ペットガチャ ──────────────────────────────
  if (message.includes('ペットガチャ')) {
    if (compactMode) { ensureCharOnStage(user); showBubble(user, 'コンパクトモード中は使用できません', {}); return; }
    ensureCharOnStage(user);
    if ((user.mp ?? 0) < 10) {
      showBubble(user, `MPが足りない… (${user.mp ?? 0}/10)`, {});
      return;
    }
    user.mp -= 10;
    updateStatsDisplay(user);
    if (!user.tc) user.tc = {};
    user.tc.petGachas = (user.tc.petGachas || 0) + 1;
    const pet = rollPetGacha();
    const gCount = user.tc.petGachas;
    const isSlot2 = gCount >= 20 && gCount % 2 === 0;
    const unlockPet2 = gCount === 20;
    if (isSlot2) { user.pet2 = pet; }
    else         { user.pet  = pet; }
    renderPetBadge(user);
    showPetGachaAnim(user, pet);
    if (unlockPet2) {
      showBubble(user, `🎉 ペット2枠目が解放！ ${pet.abilityName}[${pet.rarityName}]`, {});
      addToLog(user, `🎉 ペット2枠目解放 → ${pet.abilityName}[${pet.rarityName}]`, '#fbbf24');
    } else {
      const slotLabel = isSlot2 ? '(2枠目)' : '';
      showBubble(user, `🐾 ${pet.abilityName}[${pet.rarityName}]を引いた！${slotLabel}`, {});
      addToLog(user, `🐾 ペットガチャ${slotLabel} → ${pet.abilityName}[${pet.rarityName}]`, '#a78bfa');
    }
    return;
  }

  // ── ステータス確認 ────────────────────────────
  if (message.includes('ステータス確認')) {
    if (compactMode) { ensureCharOnStage(user); showBubble(user, 'コンパクトモード中は使用できません', {}); return; }
    ensureCharOnStage(user);
    showStatusModal(user);
    postStatusComment(user);
    return;
  }

  // ── キャラN またはエイリアス ─────────────────
  const charM = message.match(/^キャラ(\d{1,3})$/);
  const aliasId = !charM && Object.prototype.hasOwnProperty.call(charAliases, message)
    ? charAliases[message] : null;
  const charChangeId = charM ? parseInt(charM[1]) : aliasId;
  if (charChangeId != null) {
    const id = charChangeId;
    if (id < 1 || id > 500) return;
    // 他のユーザーが使用中かチェック
    const usedIds = getUsedCharIds(user);
    if (usedIds.has(id)) {
      ensureCharOnStage(user);
      showBubble(user, `キャラ${id}は他の人が使用中です`, {});
      return;
    }
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

  // ── ボス召喚 ─────────────────────────────────
  if (/^ボス召喚(?:[：:]\d+)?$/.test(message)) {
    if (compactMode) return;
    if (brState?.active) return; // バトロワ中は無効
    if (bossState && !bossState.defeated) {
      // ボス戦中は無効
      return;
    }
    // HP は数列に従う（:HP数値指定で上書き可能、上限なし）
    const hpMatch = message.match(/[：:](\d+)/);
    const hp = hpMatch
      ? Math.max(parseInt(hpMatch[1]), 10)
      : nextBossHp();
    spawnBoss(hp);
    addToLog(user, `🐉 ボス召喚！ HP:${hp}`, '#ef4444');
    return;
  }

  // ── インラインコマンド ───────────────────────
  let display = message;

  const nameM = display.match(/名前[：:]([\S]{1,20})/);
  if (nameM) {
    const newName = nameM[1];
    const usedNames = getUsedNames(user.ipid);
    if (usedNames.has(newName)) {
      ensureCharOnStage(user);
      showBubble(user, `「${newName}」は既に使われています`, {});
    } else {
      user.name = newName; user.nameManual = true; updateNameDisplay(user);
    }
    display = display.replace(nameM[0], '').trim();
  }

  const colorM = display.match(/色[：:]([\S]+)/);
  if (colorM) { const c = resolveColor(colorM[1]); if (c) user.textColor = c; display = display.replace(colorM[0], '').trim(); }

  const bubbleM = display.match(/吹き出し[：:]([\S]+)/);
  if (bubbleM) { const s = SHAPE_MAP[bubbleM[1]]; if (s) user.bubbleShape = s; display = display.replace(bubbleM[0], '').trim(); }

  const moveM = display.match(/移動[：:]([\S]+)/);
  if (moveM) {
    if (!moveLocked && MOVE_INTERVAL[moveM[1]] !== undefined) {
      user.movement = moveM[1];
      if (!user.tc) user.tc = {};
      user.tc.moveChanges = (user.tc.moveChanges || 0) + 1;
      if (moveM[1] === '止まれ') { applyMotion(user, null); stopWalk(user); }
      if (user.el) scheduleMove(user);
    }
    display = display.replace(moveM[0], '').trim();
  }

  // 方向移動（順番に実行）
  const dirMoves = [];
  display = display.replace(/([上下左右])[：:](\d+)/g, (_, dir, amt) => {
    if (!moveLocked) dirMoves.push({ dir, amt: Math.min(parseInt(amt, 10), 2000) });
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

  if (/歩く|歩きゅ/.test(display)) {
    ensureCharOnStage(user);
    startWalk(user);
    display = display.replace(/歩く|歩きゅ/g, '').trim();
  }
  if (/はずむ|hikonori/.test(display)) {
    ensureCharOnStage(user);
    applyMotion(user, 'bouncing');
    display = display.replace(/はずむ|hikonori/g, '').trim();
  }
  if (/回転/.test(display)) {
    ensureCharOnStage(user);
    applyMotion(user, 'spinning');
    display = display.replace(/回転/g, '').trim();
  }
  if (/震える/.test(display)) {
    ensureCharOnStage(user);
    applyMotion(user, 'trembling');
    display = display.replace(/震える/g, '').trim();
  }
  if (/ぐにゃぐにゃ/.test(display)) {
    ensureCharOnStage(user);
    applyMotion(user, 'wavy');
    display = display.replace(/ぐにゃぐにゃ/g, '').trim();
  }

  const decoM = display.match(/飾り[：:]([\S]+)/);
  if (decoM) {
    const d = DECO_MAP[decoM[1]];
    if (d !== undefined) user.bubbleDeco = d;
    display = display.replace(decoM[0], '').trim();
  }

  for (const [cmd, type] of Object.entries(EFFECT_TYPES)) {
    if (display.includes(cmd)) {
      ensureCharOnStage(user);
      triggerEffect(type, user);
      display = display.replace(new RegExp(cmd, 'g'), '').trim();
    }
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

  // ── 回復（MPを2消費して全キャラHP+15） ────────
  if (display.includes('回復')) {
    ensureCharOnStage(user);
    const mp = user.mp ?? 10;
    if (mp >= 2) {
      user.mp = mp - 2;
      if (!user.tc) user.tc = {};
      user.tc.healCount = (user.tc.healCount || 0) + 1;
      Object.values(users).forEach(u => {
        if (!u.el) return;
        u.hp = Math.min(calcMaxHp(u), (u.hp ?? 30) + 2);
        const { x, y } = getCharCenter(u);
        showDamageNumber(x, y - 30, '♥+2', false, 20, '#7dd3fc');
        updateStatsDisplay(u);
      });
      updateStatsDisplay(user);
      spawnHeartShower(stage.clientWidth / 2, stage.clientHeight / 2);
      showBubble(user, display, commentStyle);
    } else {
      showBubble(user, display + '（MPが足りない…）', {});
    }
    // 回復コメントもボスを攻撃
    if (bossState && !bossState.defeated && bossState.hp > 0) attackBoss(user, message.length);
    addToLog(user, display, '#7dd3fc');
    return;
  }

  // ── ボス戦中：すべてのコメントで攻撃 ───────────
  if (bossState && !bossState.defeated && bossState.hp > 0) {
    ensureCharOnStage(user);
    attackBoss(user, message.length);
  }

  // ── バトルロイヤル中：コメントで攻撃 ───────────
  if (brState?.active && brState.survivors.has(ipid) && !user.brOut) {
    const others = [...brState.survivors]
      .filter(id => id !== ipid)
      .map(id => users[id])
      .filter(u => u?.el);
    if (others.length > 0) brAttack(user, others[Math.floor(Math.random() * others.length)]);
  }

  // ── 通常テキスト ─────────────────────────────
  if (!display) { addToLog(user, message, '#475569'); return; }

  ensureCharOnStage(user);
  showBubble(user, display, commentStyle);

  // Wordle チェック：元のメッセージがカタカナ5文字なら推測として処理
  if (wordleState && /^[゠-ヿ]{5}$/.test(message.trim())) {
    handleWordleGuess(user, message.trim());
  }

  // コンボチェック
  if (display && display.length >= 2) checkCombo(user, display);
  // 長コメントカウント
  if (display && display.length >= 15) {
    if (!user.tc) user.tc = {};
    user.tc.longComment = (user.tc.longComment || 0) + 1;
  }

  // 称号チェック
  if (typeof checkTitles === 'function') checkTitles(user);

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
  localStorage.setItem('apikey', apikey);
  localStorage.setItem('hash', hash);
  lastCnum = null;
  document.getElementById('startBtn').disabled = true;
  document.getElementById('stopBtn').disabled  = false;
  setStatus('running', '● 接続中…');
  fetchComments();
  pollTimer = setInterval(fetchComments, 2000);
  // 宝箱自動出現（5分ごと）
  treasureAutoTimer = setInterval(() => { if (pollTimer) spawnTreasureChest(); }, 300000);
  // 早押し自動起動：白（hayaoshiFreqごと）
  (function scheduleHayaoshiWhite() {
    hayaoshiAutoTimerWhite = setTimeout(() => {
      if (!pollTimer) return;
      startHayaoshiAutoWhite();
      scheduleHayaoshiWhite();
    }, hayaoshiFreq);
  })();
  // 早押し自動起動：赤（hayaoshiFreq×3ごと）
  (function scheduleHayaoshiRed() {
    hayaoshiAutoTimerRed = setTimeout(() => {
      if (!pollTimer) return;
      startHayaoshiAutoRed();
      scheduleHayaoshiRed();
    }, hayaoshiFreq * 3);
  })();
});

document.getElementById('stopBtn').addEventListener('click', () => {
  clearInterval(pollTimer); pollTimer = null;
  clearTimeout(hayaoshiAutoTimerWhite); hayaoshiAutoTimerWhite = null;
  clearTimeout(hayaoshiAutoTimerRed);   hayaoshiAutoTimerRed   = null;
  hayaoshiItems.forEach(it => clearTimeout(it.timeoutId));
  hayaoshiItems = [];
  clearInterval(treasureAutoTimer); treasureAutoTimer = null;
  if (treasureChestEl) { treasureChestEl.remove(); treasureChestEl = null; }
  clearTimeout(treasureChestTimer); treasureChestTimer = null;
  document.getElementById('startBtn').disabled = false;
  document.getElementById('stopBtn').disabled  = true;
  setStatus('idle', '● 停止中');
});

document.getElementById('clearStage').addEventListener('click', () => {
  if (brState) { clearTimeout(brState.autoTimer); clearInterval(brState.escalateTimer); brState = null; }
  Object.values(users).forEach(u => {
    if (u.el)          u.el.remove();
    if (u.moveTimer)   clearTimeout(u.moveTimer);
    if (u.walkTimer)   clearTimeout(u.walkTimer);
    if (u.bubbleTimer) clearTimeout(u.bubbleTimer);
    if (u.motionTimer) clearTimeout(u.motionTimer);
  });
  users = {}; lastCnum = null;
  emptyHint.classList.remove('hidden');
});

document.getElementById('toggleLog').addEventListener('click', () => {
  document.getElementById('commentLog').classList.toggle('hidden');
});

document.getElementById('copyObsUrl').addEventListener('click', () => {
  const url = `${location.origin}/?obs=1`;
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('copyObsUrl');
    const orig = btn.textContent;
    btn.textContent = '✅ コピー済み';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  });
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
document.getElementById('gatherBottomBtn').addEventListener('click', gatherCharactersBottom);
document.getElementById('compactBtn').addEventListener('click', () => setCompactMode(!compactMode));

document.getElementById('hayaoshiBtn').addEventListener('click', startHayaoshi);

document.getElementById('wordleBtn').addEventListener('click', () => {
  const panel = document.getElementById('wordlePanel');
  if (panel) {
    panel.remove();
    wordleState = null;
  } else if (wordleWords.length > 0) {
    startWordle();
  }
});

document.getElementById('quizBtn').addEventListener('click', () => {
  if (quizState) {
    stopQuiz();
  } else if (quizQuestions.length > 0) {
    startQuiz();
  }
});

document.getElementById('moveLockBtn').addEventListener('click', () => {
  moveLocked = !moveLocked;
  document.getElementById('moveLockBtn').classList.toggle('active', moveLocked);
  if (moveLocked) {
    // ロック時：全キャラの移動を止める
    Object.values(users).forEach(u => {
      u.movement = '止まれ';
      if (u.moveTimer) { clearTimeout(u.moveTimer); u.moveTimer = null; }
      if (u.el) u.el.classList.remove('walking');
    });
  }
});

document.getElementById('debugBtn').addEventListener('click', () => {
  debugMode = !debugMode;
  document.getElementById('debugBtn').classList.toggle('active', debugMode);
  // 全キャラのステータス表示を即時更新
  Object.values(users).forEach(u => updateStatsDisplay(u));
});

document.getElementById('debugMpBtn').addEventListener('click', () => {
  Object.values(users).forEach(u => {
    u.mp = Math.min(20, (u.mp ?? 0) + 30);
    updateStatsDisplay(u);
  });
});

document.getElementById('bombBtn').addEventListener('click', () => spawnBloodBath());

function spawnBloodBath() {
  if (brState?.active) endBattleRoyale(null);
  const sw = stage.clientWidth, sh = stage.clientHeight;
  const charEls = [...stage.querySelectorAll('.character')];

  // 赤フラッシュ
  const flash = document.getElementById('bloodFlashOverlay');
  if (flash) flash.remove();
  const fl = document.createElement('div');
  fl.id = 'bloodFlashOverlay';
  document.body.appendChild(fl);
  fl.addEventListener('animationend', () => fl.remove(), { once: true });

  // 爆発音（花火音流用）
  playLocalSound('/sound/char/maplestory-lvl-up.mp3');
  setTimeout(() => playLocalSound(SOUND_MYTH_DROP), 80);

  // キャラごとに爆散＋血しぶき
  charEls.forEach((el, idx) => {
    const r  = el.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    const cx = r.left - sr.left + r.width  / 2;
    const cy = r.top  - sr.top  + r.height / 2;

    // キャラ本体を吹き飛ばす
    const dx = (Math.random() - 0.5) * sw * 1.4;
    const dy = -(120 + Math.random() * sh * 0.7);
    const rot = (Math.random() - 0.5) * 900;
    el.style.transition = 'none';
    el.style.transformOrigin = 'center center';
    el.animate([
      { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
      { transform: `translate(${dx}px,${dy}px) rotate(${rot}deg) scale(0.2)`, opacity: 0 },
    ], { duration: 600 + idx * 30, easing: 'cubic-bezier(0.2,0,1,0.8)', fill: 'forwards' });

    // 爆発パーティクル（爆風）
    setTimeout(() => spawnFireworks(cx, cy), idx * 25);

    // 血しぶき放射
    const dropCount = 20 + Math.floor(Math.random() * 20);
    for (let i = 0; i < dropCount; i++) {
      const drop = document.createElement('div');
      drop.className = 'blood-drop';
      const angle = Math.random() * Math.PI * 2;
      const dist  = 60 + Math.random() * 220;
      drop.style.left = cx + 'px';
      drop.style.top  = cy + 'px';
      drop.style.setProperty('--bx', `${Math.cos(angle) * dist}px`);
      drop.style.setProperty('--by', `${Math.sin(angle) * dist}px`);
      drop.style.animationDelay    = (Math.random() * 0.15) + 's';
      drop.style.animationDuration = (0.5 + Math.random() * 0.4) + 's';
      drop.style.transform = `rotate(${Math.random()*360}deg)`;
      stage.appendChild(drop);
      drop.addEventListener('animationend', () => drop.remove(), { once: true });
    }
  });

  // 画面全体に血痕をばらまく
  const stainCount = 40 + charEls.length * 8;
  for (let i = 0; i < stainCount; i++) {
    setTimeout(() => {
      const s    = document.createElement('div');
      s.className = 'blood-stain';
      const size = 20 + Math.random() * 80;
      s.style.width  = size + 'px';
      s.style.height = size * (0.6 + Math.random() * 0.8) + 'px';
      s.style.left   = (Math.random() * sw) + 'px';
      s.style.top    = (Math.random() * sh) + 'px';
      s.style.transform = `rotate(${Math.random()*360}deg)`;
      s.style.animationDelay = (Math.random() * 0.5) + 's';
      stage.appendChild(s);
      s.addEventListener('animationend', () => s.remove(), { once: true });
    }, Math.random() * 400);
  }

  // 少し後にキャラ要素を削除してusersからも除去
  setTimeout(() => {
    charEls.forEach(el => el.remove());
    Object.keys(users).forEach(k => {
      const u = users[k];
      u.el = null;
      delete users[k];
    });
    emptyHint.classList.remove('hidden');
  }, 700);
}

document.getElementById('battleRoyaleBtn').addEventListener('click', startBattleRoyale);

document.getElementById('dismissBossBtn').addEventListener('click', () => {
  if (!bossState) return;
  bossManuallyCleared = true;
  bossState.defeated = true;
  if (bossState.el) {
    bossState.el.style.transition = 'transform 0.4s ease-in, opacity 0.4s ease-in';
    bossState.el.style.transform  = 'scale(0) rotate(15deg)';
    bossState.el.style.opacity    = '0';
    setTimeout(() => { bossState?.el?.remove(); bossState = null; }, 450);
  } else {
    bossState = null;
  }
  const prev = document.getElementById('bossSpeech');
  if (prev) prev.remove();
});

document.getElementById('stopAllBtn').addEventListener('click', () => {
  Object.values(users).forEach(u => {
    u.movement = '止まれ';
    if (u.moveTimer) { clearTimeout(u.moveTimer); u.moveTimer = null; }
    if (u.el) u.el.style.transition = 'none';
    stopWalk(u);
    applyMotion(u, null);
  });
});

document.getElementById('moveAreaSelect').addEventListener('change', e => {
  moveArea = MOVE_AREA_MAP[e.target.value] || MOVE_AREA_MAP['all'];
  localStorage.setItem('moveArea', e.target.value);
});
(function initMoveArea() {
  const saved = localStorage.getItem('moveArea') || 'all';
  const sel = document.getElementById('moveAreaSelect');
  sel.value = saved;
  moveArea = MOVE_AREA_MAP[saved] || MOVE_AREA_MAP['all'];
})();

// ── キャラ／ボス サイズスライダー ──────────────────────────────
(function initSizeSliders() {
  const charSlider = document.getElementById('charSizeSlider');
  const charVal    = document.getElementById('charSizeVal');
  const bossSlider = document.getElementById('bossSizeSlider');
  const bossVal    = document.getElementById('bossSizeVal');

  const savedChar = parseFloat(localStorage.getItem('charSizeScale') || '1');
  const savedBoss = parseFloat(localStorage.getItem('bossSizeScale') || '1');
  charSizeScale = savedChar;
  bossSizeScale = savedBoss;
  charSlider.value = Math.round(savedChar * 100);
  bossSlider.value = Math.round(savedBoss * 100);
  charVal.textContent = Math.round(savedChar * 100) + '%';
  bossVal.textContent = Math.round(savedBoss * 100) + '%';

  charSlider.addEventListener('input', () => {
    charSizeScale = charSlider.value / 100;
    charVal.textContent = charSlider.value + '%';
    localStorage.setItem('charSizeScale', charSizeScale);
    Object.values(users).forEach(u => { if (u.el) { applyAvatarStyle(u); renderPetBadge(u); } });
  });
  bossSlider.addEventListener('input', () => {
    bossSizeScale = bossSlider.value / 100;
    bossVal.textContent = bossSlider.value + '%';
    localStorage.setItem('bossSizeScale', bossSizeScale);
    // ボスが出ている場合はアバターのみリサイズ
    if (bossState?.el) {
      const ba = bossState.el.querySelector('#bossAvatar');
      if (ba) {
        const newPx = Math.round(bossState.origSize * bossSizeScale);
        ba.style.width     = newPx + 'px';
        ba.style.height    = newPx + 'px';
        ba.style.fontSize  = Math.round(newPx * 0.87) + 'px';
      }
    }
  });

  document.getElementById('charSizeReset').addEventListener('click', () => {
    charSlider.value = 100;
    charSlider.dispatchEvent(new Event('input'));
  });
  document.getElementById('bossSizeReset').addEventListener('click', () => {
    bossSlider.value = 100;
    bossSlider.dispatchEvent(new Event('input'));
  });
})();

(function initNikoSliders() {
  const sizeSlider = document.getElementById('nikoSizeSlider');
  const sizeVal    = document.getElementById('nikoSizeVal');
  const opSlider   = document.getElementById('nikoOpacitySlider');
  const opVal      = document.getElementById('nikoOpacityVal');
  if (!sizeSlider || !opSlider) return;

  const savedSize = parseInt(localStorage.getItem('nikoFontSize') || '40');
  const savedOp   = parseFloat(localStorage.getItem('nikoOpacity') || '1.0');
  nikoFontSize = savedSize;
  nikoOpacity  = savedOp;
  sizeSlider.value = savedSize;
  sizeVal.textContent = savedSize + 'px';
  opSlider.value = Math.round(savedOp * 100);
  opVal.textContent  = Math.round(savedOp * 100) + '%';

  sizeSlider.addEventListener('input', () => {
    nikoFontSize = parseInt(sizeSlider.value);
    sizeVal.textContent = sizeSlider.value + 'px';
    localStorage.setItem('nikoFontSize', nikoFontSize);
  });
  opSlider.addEventListener('input', () => {
    nikoOpacity = opSlider.value / 100;
    opVal.textContent = opSlider.value + '%';
    localStorage.setItem('nikoOpacity', nikoOpacity);
  });
  document.getElementById('nikoSizeReset').addEventListener('click', () => {
    sizeSlider.value = 40;
    sizeSlider.dispatchEvent(new Event('input'));
  });
  document.getElementById('nikoOpacityReset').addEventListener('click', () => {
    opSlider.value = 100;
    opSlider.dispatchEvent(new Event('input'));
  });
})();

(function initBossHpScaleSlider() {
  const slider = document.getElementById('bossHpScaleSlider');
  const val    = document.getElementById('bossHpScaleVal');
  if (!slider || !val) return;
  const saved = parseFloat(localStorage.getItem('bossHpScale') ?? '1');
  bossHpScale = saved;
  slider.value = saved;
  val.textContent = saved + 'x';
  slider.addEventListener('input', () => {
    bossHpScale = parseFloat(slider.value);
    val.textContent = bossHpScale + 'x';
    localStorage.setItem('bossHpScale', bossHpScale);
  });
  document.getElementById('bossHpScaleReset').addEventListener('click', () => {
    slider.value = 1;
    slider.dispatchEvent(new Event('input'));
  });
})();

(function initBossAtkCoeffSlider() {
  const slider = document.getElementById('bossAtkCoeffSlider');
  const val    = document.getElementById('bossAtkCoeffVal');
  if (!slider || !val) return;
  const saved = parseInt(localStorage.getItem('bossAtkCoeff') ?? '20');
  bossAtkCoeff = saved;
  slider.value = saved;
  val.textContent = saved + 'x';
  slider.addEventListener('input', () => {
    bossAtkCoeff = parseInt(slider.value);
    val.textContent = bossAtkCoeff + 'x';
    localStorage.setItem('bossAtkCoeff', bossAtkCoeff);
  });
  document.getElementById('bossAtkCoeffReset').addEventListener('click', () => {
    slider.value = 20;
    slider.dispatchEvent(new Event('input'));
  });
})();

(function initCounterRateSlider() {
  const slider = document.getElementById('counterRateSlider');
  const val    = document.getElementById('counterRateVal');
  if (!slider || !val) return;
  const saved = parseFloat(localStorage.getItem('bossCounterRate') ?? '0.40');
  bossCounterRate = saved;
  slider.value = Math.round(saved * 100);
  val.textContent = Math.round(saved * 100) + '%';
  slider.addEventListener('input', () => {
    bossCounterRate = slider.value / 100;
    val.textContent = slider.value + '%';
    localStorage.setItem('bossCounterRate', bossCounterRate);
  });
  document.getElementById('counterRateReset').addEventListener('click', () => {
    slider.value = 40;
    slider.dispatchEvent(new Event('input'));
  });
})();

(function initBrHpMultSlider() {
  const slider = document.getElementById('brHpMultSlider');
  const val    = document.getElementById('brHpMultVal');
  if (!slider || !val) return;
  const saved = parseInt(localStorage.getItem('brHpMult') ?? '200');
  brHpMult = saved;
  slider.value = saved;
  val.textContent = saved + 'x';
  slider.addEventListener('input', () => {
    brHpMult = parseInt(slider.value);
    val.textContent = brHpMult + 'x';
    localStorage.setItem('brHpMult', brHpMult);
  });
  document.getElementById('brHpMultReset').addEventListener('click', () => {
    slider.value = 200;
    slider.dispatchEvent(new Event('input'));
  });
})();

document.getElementById('batchAssign').addEventListener('click', () => {
  availableImages.forEach((fname, i) => { charImages[i + 1] = fname; });
  saveCharImages();
  refreshAllAvatars();
  renderCharSlots();
});
document.getElementById('openImgModal').addEventListener('click', () => { document.getElementById('adminModal').classList.add('hidden'); document.getElementById('adminBtn').classList.remove('active'); openModal(); });
document.getElementById('closeModal').addEventListener('click',  () => { document.getElementById('imageModal').classList.add('hidden'); });

// 管理モーダル
const adminModal = document.getElementById('adminModal');
const adminBtn   = document.getElementById('adminBtn');
adminBtn.addEventListener('click', () => {
  const open = adminModal.classList.toggle('hidden');
  adminBtn.classList.toggle('active', !adminModal.classList.contains('hidden'));
});
document.getElementById('closeAdminModal').addEventListener('click', () => {
  adminModal.classList.add('hidden');
  adminBtn.classList.remove('active');
});
adminModal.addEventListener('click', e => {
  if (e.target === adminModal) { adminModal.classList.add('hidden'); adminBtn.classList.remove('active'); }
});
document.getElementById('reloadImages').addEventListener('click', async () => { await loadImageList(); renderImageGrid(); renderCharSlots(); });
document.getElementById('imageModal').addEventListener('click', e => {
  if (e.target === document.getElementById('imageModal')) document.getElementById('imageModal').classList.add('hidden');
});

// ── ゴミ箱の位置初期化 ──────────────────────────
(function initTrashPosition() {
  const trashEl = document.getElementById('trashCan');
  const savedX  = localStorage.getItem('trashX');
  const savedY  = localStorage.getItem('trashY');
  if (savedX !== null && savedY !== null) {
    trashEl.style.left = savedX + 'px';
    trashEl.style.top  = savedY + 'px';
  } else {
    trashEl.style.left = (stage.clientWidth  - 72 - 18) + 'px';
    trashEl.style.top  = (stage.clientHeight - 72 - 18) + 'px';
  }
})();

document.getElementById('trashCan').addEventListener('mousedown', e => {
  if (e.button !== 0 || dragState) return;
  const trashEl  = document.getElementById('trashCan');
  const stageRect = stage.getBoundingClientRect();
  trashDragState = {
    ox: parseInt(trashEl.style.left) || 0,
    oy: parseInt(trashEl.style.top)  || 0,
    sx: e.clientX,
    sy: e.clientY,
  };
  trashEl.classList.add('trash-dragging');
  e.preventDefault();
  e.stopPropagation();
});

// ── ドラッグ＆ドロップ（グローバルハンドラー） ──
function rectsOverlap(r1, r2) {
  return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

document.addEventListener('mousemove', e => {
  if (rankingDragState) {
    const panel = document.getElementById('rankingPanel');
    if (panel && rankingState) {
      const { ox, oy, sx, sy } = rankingDragState;
      const sr = stage.getBoundingClientRect();
      rankingState.panelX = Math.max(0, Math.min(sr.width  - panel.offsetWidth,  ox + (e.clientX - sx)));
      rankingState.panelY = Math.max(0, Math.min(sr.height - panel.offsetHeight, oy + (e.clientY - sy)));
      panel.style.left = rankingState.panelX + 'px';
      panel.style.top  = rankingState.panelY + 'px';
    }
    return;
  }

  if (wordleDragState) {
    const panel = document.getElementById('wordlePanel');
    if (panel && wordleState) {
      const { ox, oy, sx, sy } = wordleDragState;
      const sr = stage.getBoundingClientRect();
      const pw = panel.offsetWidth  || 192;
      const ph = panel.offsetHeight || 240;
      wordleState.panelX = Math.max(0, Math.min(sr.width  - pw, ox + (e.clientX - sx)));
      wordleState.panelY = Math.max(0, Math.min(sr.height - ph, oy + (e.clientY - sy)));
      panel.style.left = wordleState.panelX + 'px';
      panel.style.top  = wordleState.panelY + 'px';
    }
    return;
  }

  if (quizDragState) {
    const panel = document.getElementById('quizPanel');
    if (panel && quizState) {
      const { ox, oy, sx, sy } = quizDragState;
      const sr = stage.getBoundingClientRect();
      quizState.panelX = Math.max(0, Math.min(sr.width  - panel.offsetWidth,  ox + (e.clientX - sx)));
      quizState.panelY = Math.max(0, Math.min(sr.height - panel.offsetHeight, oy + (e.clientY - sy)));
      panel.style.left = quizState.panelX + 'px';
      panel.style.top  = quizState.panelY + 'px';
    }
    return;
  }

  if (brTimerDragState) {
    const panel = document.getElementById('brTimerPanel');
    if (panel) {
      const { ox, oy, sx, sy } = brTimerDragState;
      const sr = stage.getBoundingClientRect();
      brTimerPanelX = Math.max(0, Math.min(sr.width  - panel.offsetWidth,  ox + (e.clientX - sx)));
      brTimerPanelY = Math.max(0, Math.min(sr.height - panel.offsetHeight, oy + (e.clientY - sy)));
      panel.style.left = brTimerPanelX + 'px';
      panel.style.top  = brTimerPanelY + 'px';
    }
    return;
  }

  if (bossDragState && bossState?.el) {
    const { ox, oy, sx, sy } = bossDragState;
    const sr = stage.getBoundingClientRect();
    const bw = bossState.el.offsetWidth  || 190;
    const bh = bossState.el.offsetHeight || 180;
    const x = Math.max(0, Math.min(sr.width  - bw, ox + (e.clientX - sx)));
    const y = Math.max(0, Math.min(sr.height - bh, oy + (e.clientY - sy)));
    bossState.el.style.left = x + 'px';
    bossState.el.style.top  = y + 'px';
    return;
  }

  if (trashDragState) {
    const { ox, oy, sx, sy } = trashDragState;
    const trashEl   = document.getElementById('trashCan');
    const stageRect = stage.getBoundingClientRect();
    const x = Math.max(0, Math.min(stageRect.width  - 72, ox + (e.clientX - sx)));
    const y = Math.max(0, Math.min(stageRect.height - 72, oy + (e.clientY - sy)));
    trashEl.style.left = x + 'px';
    trashEl.style.top  = y + 'px';
    return;
  }

  if (!dragState) return;
  const { user, el, ox, oy, sx, sy } = dragState;
  const rect = stage.getBoundingClientRect();
  const charSize = user.size * 1.5;
  user.x = Math.max(0, Math.min(rect.width  - charSize, ox + (e.clientX - sx)));
  user.y = Math.max(0, Math.min(rect.height - charSize, oy + (e.clientY - sy)));
  el.style.left = user.x + 'px';
  el.style.top  = user.y + 'px';

  const trashEl = document.getElementById('trashCan');
  const over = rectsOverlap(el.getBoundingClientRect(), trashEl.getBoundingClientRect());
  if (over && !dragState.overTrash) {
    trashEl.classList.add('trash-hover');
    playLocalSound(SOUND_TRASH_HOVER);
  } else if (!over && dragState.overTrash) {
    trashEl.classList.remove('trash-hover');
  }
  dragState.overTrash = over;
});

document.addEventListener('mouseup', () => {
  if (rankingDragState) {
    if (rankingState) {
      localStorage.setItem('rankingPanelX', Math.round(rankingState.panelX));
      localStorage.setItem('rankingPanelY', Math.round(rankingState.panelY));
    }
    rankingDragState = null;
    return;
  }

  if (wordleDragState) {
    if (wordleState) {
      localStorage.setItem('wordlePanelX', Math.round(wordleState.panelX));
      localStorage.setItem('wordlePanelY', Math.round(wordleState.panelY));
    }
    wordleDragState = null;
    return;
  }

  if (quizDragState) {
    if (quizState) {
      localStorage.setItem('quizPanelX', Math.round(quizState.panelX));
      localStorage.setItem('quizPanelY', Math.round(quizState.panelY));
    }
    quizDragState = null;
    return;
  }

  if (brTimerDragState) {
    localStorage.setItem('brTimerPanelX', Math.round(brTimerPanelX));
    localStorage.setItem('brTimerPanelY', Math.round(brTimerPanelY));
    brTimerDragState = null;
    return;
  }

  if (bossDragState) {
    if (bossState?.el) {
      bossLastPos = { x: parseInt(bossState.el.style.left), y: parseInt(bossState.el.style.top) };
    }
    bossDragState = null;
    return;
  }

  if (trashDragState) {
    const trashEl = document.getElementById('trashCan');
    localStorage.setItem('trashX', parseInt(trashEl.style.left));
    localStorage.setItem('trashY', parseInt(trashEl.style.top));
    trashEl.classList.remove('trash-dragging');
    trashDragState = null;
    return;
  }

  if (!dragState) return;
  const { user, el, overTrash } = dragState;
  dragState = null;
  const trashEl = document.getElementById('trashCan');
  trashEl.classList.remove('trash-hover');

  el.classList.remove('char-dragging');

  if (overTrash) {
    playLocalSound(SOUND_TRASH_DROP);
    el.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in';
    el.style.transform  = 'scale(0) rotate(20deg)';
    el.style.opacity    = '0';
    const ipid = user.ipid;
    setTimeout(() => {
      if (user.bubbleTimer) clearTimeout(user.bubbleTimer);
      if (user.motionTimer) clearTimeout(user.motionTimer);
      if (user.moveTimer)   clearTimeout(user.moveTimer);
      if (user.walkTimer)   clearTimeout(user.walkTimer);
      el.remove();
      delete users[ipid];
      // BR中にゴミ箱に捨てられた場合、サバイバーから除去して終了チェック
      if (brState?.active && brState.survivors.has(ipid)) {
        brState.survivors.delete(ipid);
        brState.ranking.push(ipid);
        if (brState.survivors.size <= 1) {
          const winnerId = [...brState.survivors][0];
          const winner = winnerId ? users[winnerId] : null;
          setTimeout(() => endBattleRoyale(winner), 800);
        }
      }
    }, 300);
  }
  // movement は mousedown で '止まれ' に設定済み
});

// ── 起動時に画像リストをプリロード（ボス画像に使用） ──
loadImageList();

// ── ペットガチャ ───────────────────────────────────────────────────
function rollPetGacha() {
  // レア度抽選
  const total = PET_RARITY_RATE.reduce((s, r) => s + r.weight, 0);
  let rand = Math.random() * total;
  let rarityEntry = PET_RARITY_RATE[0];
  for (const r of PET_RARITY_RATE) { rand -= r.weight; if (rand <= 0) { rarityEntry = r; break; } }
  // 能力抽選
  const pool = PET_RARITY_GROUPS[rarityEntry.cls];
  const ability = pool[Math.floor(Math.random() * pool.length)];
  // 画像抽選
  const imgs = availableImages.length > 0 ? availableImages : ['kisyokeee.png'];
  const img  = imgs[Math.floor(Math.random() * imgs.length)];
  return { img, abilityId: ability.id, abilityName: ability.name, abilityDesc: ability.desc, rarityCls: rarityEntry.cls, rarityName: rarityEntry.name, reviveUsed: false, _chargeCount: 0 };
}

function showPetGachaAnim(user, finalPet) {
  const prev = document.getElementById('petGachaOverlay');
  if (prev) prev.remove();

  // ドラムロール開始
  if (petGachaDrumAudio) { petGachaDrumAudio.pause(); petGachaDrumAudio = null; }
  if (!compactMode) {
    try {
      petGachaDrumAudio = new Audio(SOUND_GACHA_DRUM);
      petGachaDrumAudio.volume = 0.8;
      petGachaDrumAudio.loop = true;
      petGachaDrumAudio.play().catch(() => {});
    } catch {}
  }

  const ov = document.createElement('div');
  ov.id = 'petGachaOverlay';
  document.body.appendChild(ov);

  const imgs = availableImages.length > 0 ? availableImages : ['kisyokeee.png'];
  const updateCycle = (img, hint) => {
    ov.innerHTML = `
      <div class="pg-title">🐾 ペットガチャ！</div>
      <div class="pg-img-wrap"><img src="/chara/${encodeURIComponent(img)}" alt="pet"></div>
      <div class="pg-hint">${hint || '🎲 ガチャ中...'}</div>
      <div class="pg-owner">👤 ${escapeHtml(user.name)}</div>`;
  };

  updateCycle(imgs[0]);
  let timer = setInterval(() => updateCycle(imgs[Math.floor(Math.random() * imgs.length)]), 80);

  setTimeout(() => {
    clearInterval(timer);
    timer = setInterval(() => updateCycle(imgs[Math.floor(Math.random() * imgs.length)], '⏳ まもなく...'), 280);
  }, 2000);

  setTimeout(() => {
    clearInterval(timer);

    // ドラムロール停止
    if (petGachaDrumAudio) { petGachaDrumAudio.pause(); petGachaDrumAudio = null; }

    // 結果表示
    const RC = {
      '':             { bg:'rgba(20,25,35,0.97)', border:'#374151', color:'#9ca3af' },
      'rarity-rare':  { bg:'rgba(5,40,20,0.97)',  border:'#16a34a', color:'#4ade80' },
      'rarity-epic':  { bg:'rgba(10,25,60,0.97)', border:'#3b82f6', color:'#60a5fa' },
      'rarity-legend':{ bg:'rgba(30,10,60,0.97)', border:'#a855f7', color:'#c084fc' },
      'rarity-myth':  { bg:'rgba(60,20,5,0.97)',  border:'#f59e0b', color:'#fbbf24' },
    }[finalPet.rarityCls || ''];

    ov.style.background = RC.bg;
    ov.style.boxShadow  = `inset 0 0 80px ${RC.border}44`;
    ov.innerHTML = `
      <div class="pg-title">🎉 ペット獲得！</div>
      <div class="pg-img-wrap pg-reveal" style="border-color:${RC.border};box-shadow:0 0 30px ${RC.border}88">
        <img src="/chara/${encodeURIComponent(finalPet.img)}" alt="pet">
      </div>
      <div class="pg-rarity" style="color:${RC.color}">${finalPet.rarityName}</div>
      <div class="pg-ability-name" style="color:${RC.color}">${escapeHtml(finalPet.abilityName)}</div>
      <div class="pg-ability-desc">${escapeHtml(finalPet.abilityDesc)}</div>
      <div class="pg-owner">👤 ${escapeHtml(user.name)}</div>`;

    // レア度別効果音
    const raritySound = {
      '':              SOUND_GACHA_NORMAL,
      'rarity-rare':   SOUND_GACHA_RARE,
      'rarity-epic':   SOUND_GACHA_EPIC,
      'rarity-legend': SOUND_GACHA_LEGEND,
      'rarity-myth':   SOUND_GACHA_MYTH,
    }[finalPet.rarityCls || ''];
    playLocalSound(raritySound);

    // 演出
    if (finalPet.rarityCls === 'rarity-myth') {
      for (let i = 0; i < 5; i++) setTimeout(() => spawnFireworks(Math.random() * stage.clientWidth, Math.random() * stage.clientHeight * 0.8), i * 200);
      spawnConfetti();
    } else if (finalPet.rarityCls === 'rarity-legend') {
      spawnFireworks(stage.clientWidth / 2, stage.clientHeight / 2);
    }

    setTimeout(() => ov.remove(), 4000);
  }, 3000);
}

// ── ステータスコメント投稿 ─────────────────────────────────────────
function postStatusComment(user) {
  if (!apikey) return;
  const atk  = calcAtk(user);
  const lv   = user.level  || 1;
  const hp   = user.hp     ?? 30;
  const mhp  = user.maxHp  ?? 30;
  const mp   = user.mp     ?? 10;
  const exp  = user.exp    || 0;
  const dmg  = (user.totalDmgDealt || 0).toLocaleString();
  const deaths = user.deaths || 0;
  const wordle = user.wordleWins || 0;
  const hayaoshi = user.hayaoshiWins || 0;

  const equipSummary = (user.equips || []).length > 0
    ? (user.equips || []).map(eq => `${eq.icon}(${eq.stat === 'atk' ? 'ATK' : 'HP'}+${eq.value})`).join(' ')
    : 'なし';

  const petSummary = (user.pet ? user.pet.abilityName : '') + (user.pet2 ? ' ' + user.pet2.abilityName : '') || 'なし';

  const activeTitleName = user.activeTitle
    ? (TITLES.find(t => t.id === user.activeTitle)?.name || '')
    : '';

  let text = `【${user.name}】Lv.${lv} HP:${hp}/${mhp} MP:${mp} ATK:${atk} EXP:${exp}`;
  text += ` | ダメージ:${dmg} 死亡:${deaths}回 Wordle:${wordle} 早押し:${hayaoshi}`;
  text += ` | 装備:${equipSummary}`;
  if (petSummary !== 'なし') text += ` | ペット:${petSummary}`;
  if (activeTitleName) text += ` | 称号:【${activeTitleName}】`;

  const params = new URLSearchParams({
    category: 'comment',
    type:     'write',
    apikey,
    icon:     '0',
    comment:  text,
  });
  const url = `https://live.erinn.biz/api/?${params.toString()}`;
  console.log('[postStatusComment]', url);
  fetch(url).catch(() => {});
}

// ── ステータスモーダル ─────────────────────────────────────────────
function showStatusModal(user, autoClose = true) {
  const imgFile = user.charDef ? (charImages[user.charDef.id] || 'kisyokeee.png') : 'kisyokeee.png';
  const atk     = calcAtk(user);
  const lv      = user.level  || 1;
  const hp      = user.hp     ?? 30;
  const mhp     = user.maxHp  ?? 30;
  const mp      = user.mp     ?? 10;

  const rarityLabel = { 'rarity-rare': 'レア', 'rarity-epic': 'エピック', 'rarity-legend': '伝説', 'rarity-myth': '神話', '': 'コモン' };

  const equipRows = (user.equips || []).map(eq => {
    const statStr = eq.stat === 'atk' ? `ATK+${eq.value}` : `HP+${eq.value}`;
    return `<div class="sm-equip-row">
      <span class="sm-equip-icon ${eq.rarityCls || ''}">${eq.icon}</span>
      <span class="sm-equip-stat">${statStr}</span>
      <span class="sm-equip-name">${escapeHtml(eq.name)}</span>
    </div>`;
  }).join('') || '<div class="sm-no-equip">装備なし</div>';

  function buildPetBlock(p) {
    if (!p) return '';
    const RC = { '':'#9ca3af','rarity-rare':'#4ade80','rarity-epic':'#60a5fa','rarity-legend':'#c084fc','rarity-myth':'#fbbf24' }[p.rarityCls || ''];
    return `<div class="sm-pet-block">
      <img class="sm-pet-img ${p.rarityCls||''}" src="/chara/${encodeURIComponent(p.img)}" alt="pet">
      <div class="sm-pet-info">
        <div class="sm-pet-rarity" style="color:${RC}">${p.rarityName}</div>
        <div class="sm-pet-name" style="color:${RC}">${escapeHtml(p.abilityName)}</div>
        <div class="sm-pet-desc">${escapeHtml(p.abilityDesc)}</div>
      </div>
    </div>`;
  }
  const petHtml = (user.pet || user.pet2)
    ? (buildPetBlock(user.pet) + buildPetBlock(user.pet2))
    : '<div class="sm-no-equip">ペットなし</div>';

  const overlay = document.createElement('div');
  overlay.id = 'statusModal';
  overlay.className = 'sm-overlay';
  const titleListHtml = (user.titles||[]).length === 0
    ? '<div class="sm-no-equip">称号なし</div>'
    : (user.titles||[]).map(id => {
        const t = TITLES.find(x=>x.id===id);
        if (!t) return '';
        const cls = ['T99','T100'].includes(t.id) ? 'sm-title-rainbow'
                  : ['T91','T92','T93','T94','T70','T74','T80'].includes(t.id) ? 'sm-title-gold'
                  : '';
        const mark = user.activeTitle===id ? ' ★' : '';
        return '<div class="sm-title-row ' + cls + '"><span class="sm-title-name">' + escapeHtml(t.name) + mark + '</span><span class="sm-title-ability">' + escapeHtml(t.abilityDesc) + '</span></div>';
      }).join('');

  overlay.innerHTML = `
    <div class="sm-modal">
      <div class="sm-header">
        <span>📊 ステータス確認</span>
        <button class="sm-close">✕</button>
      </div>
      <div class="sm-content">
        <div class="sm-main-panel">
          <div class="sm-body">
            <div class="sm-left">
              <img class="sm-avatar" src="/chara/${encodeURIComponent(imgFile)}" alt="${escapeHtml(user.name)}">
              <div class="sm-name">${escapeHtml(user.name)}</div>
              <div class="sm-lv">Lv. ${lv}</div>
            </div>
            <div class="sm-right">
              <div class="sm-section-title">⚡ ステータス</div>
              <div class="sm-stats">
                <div class="sm-stat"><span class="sm-stat-label">HP</span><span class="sm-stat-val">${hp} / ${mhp}</span></div>
                <div class="sm-stat"><span class="sm-stat-label">MP</span><span class="sm-stat-val">${mp}</span></div>
                <div class="sm-stat"><span class="sm-stat-label">ATK</span><span class="sm-stat-val">${atk}</span></div>
                <div class="sm-stat"><span class="sm-stat-label">EXP</span><span class="sm-stat-val">${user.exp || 0}</span></div>
              </div>
              <div class="sm-section-title" style="margin-top:12px">📈 記録</div>
              <div class="sm-stats">
                <div class="sm-stat"><span class="sm-stat-label">コメント数</span><span class="sm-stat-val">${user.commentCount || 0}</span></div>
                <div class="sm-stat"><span class="sm-stat-label">合計ダメージ</span><span class="sm-stat-val">${(user.totalDmgDealt || 0).toLocaleString()}</span></div>
                <div class="sm-stat"><span class="sm-stat-label">Wordle正解</span><span class="sm-stat-val">${user.wordleWins || 0} 回</span></div>
                <div class="sm-stat"><span class="sm-stat-label">早押し正解</span><span class="sm-stat-val">${user.hayaoshiWins || 0} 回</span></div>
                <div class="sm-stat"><span class="sm-stat-label">死亡回数</span><span class="sm-stat-val">${user.deaths || 0} 回</span></div>
              </div>
            </div>
          </div>
          <div class="sm-equip-section">
            <div class="sm-section-title">🐾 ペット</div>
            ${petHtml}
          </div>
          <div class="sm-equip-section">
            <div class="sm-section-title">⚔️ 装備一覧 (${(user.equips || []).length}個)</div>
            <div class="sm-equip-list">${equipRows}</div>
          </div>
        </div>
        <div class="sm-title-panel">
          <div class="sm-title-panel-header">⭐ 称号 <span class="sm-title-count">${(user.titles||[]).length}</span>${user.activeTitle ? '<div class="sm-title-active">表示中: 【' + escapeHtml(TITLES.find(t=>t.id===user.activeTitle)?.name||'?') + '】</div>' : ''}</div>
          <div class="sm-title-list">${titleListHtml}</div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector('.sm-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  if (autoClose !== false) setTimeout(close, 5000);
}

// ── ダメージランキング ─────────────────────────────────────────────
function showDamageRanking(dmgMap) {
  if (compactMode) return;
  const entries = Object.values(dmgMap)
    .sort((a, b) => b.totalDmg - a.totalDmg)
    .slice(0, 5);
  if (!entries.length) return;
  rankingState = {
    panelX:  parseInt(localStorage.getItem('rankingPanelX')) || (stage.clientWidth - 220),
    panelY:  parseInt(localStorage.getItem('rankingPanelY')) || 10,
    entries,
  };
  renderRankingPanel();
}

function renderRankingPanel() {
  let panel = document.getElementById('rankingPanel');
  if (!rankingState) { if (panel) panel.remove(); return; }

  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'rankingPanel';
    stage.appendChild(panel);
    panel.addEventListener('mousedown', e => {
      if (e.button !== 0 || dragState || trashDragState || bossDragState || wordleDragState) return;
      const r = panel.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      rankingDragState = { ox: r.left - sr.left, oy: r.top - sr.top, sx: e.clientX, sy: e.clientY };
      e.preventDefault(); e.stopPropagation();
    });
  }

  panel.style.left = rankingState.panelX + 'px';
  panel.style.top  = rankingState.panelY + 'px';

  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  let html = '<div class="ranking-header">⚔️ ダメージランキング</div>';
  rankingState.entries.forEach((entry, i) => {
    html += `<div class="ranking-row">
      <span class="ranking-medal">${medals[i]}</span>
      <span class="ranking-name">${escapeHtml(entry.name)}</span>
      <span class="ranking-dmg">${entry.totalDmg.toLocaleString()}</span>
    </div>`;
  });
  panel.innerHTML = html;
}

// ── テキストプール読み込み ────────────────────────────────────────
(async function loadTextPools() {
  try {
    const r = await fetch('/text/names.txt');
    namesPool = (await r.text()).split('\n').map(l => l.trim()).filter(l => l.length > 0);
  } catch {}
  try {
    const r = await fetch('/text/sinjakome.txt');
    sinjakomeWords = (await r.text()).split('\n').map(l => l.trim()).filter(l => l.length > 0);
  } catch {}
  try {
    const r = await fetch('/text/yojijukugo.txt');
    yojijukugoWords = (await r.text()).split('\n').map(l => l.trim()).filter(l => l.length > 0);
  } catch {}
})();

// ── 早押し頻度・速度スライダー ────────────────────────────────────
(function initHayaoshiFreqSlider() {
  const slider = document.getElementById('hayaoshiFreqSlider');
  const val    = document.getElementById('hayaoshiFreqVal');
  if (!slider || !val) return;
  const saved = parseInt(localStorage.getItem('hayaoshiFreq') ?? '5');
  hayaoshiFreq = saved * 1000;
  slider.value = saved;
  val.textContent = saved + 's';
  slider.addEventListener('input', () => {
    hayaoshiFreq = parseInt(slider.value) * 1000;
    val.textContent = slider.value + 's';
    localStorage.setItem('hayaoshiFreq', slider.value);
  });
  document.getElementById('hayaoshiFreqReset').addEventListener('click', () => {
    slider.value = 5; slider.dispatchEvent(new Event('input'));
  });
})();

(function initHayaoshiSpeedSlider() {
  const slider = document.getElementById('hayaoshiSpeedSlider');
  const val    = document.getElementById('hayaoshiSpeedVal');
  if (!slider || !val) return;
  const saved = parseInt(localStorage.getItem('hayaoshiSpeed') ?? '8');
  hayaoshiSpeed = saved * 1000;
  slider.value = saved;
  val.textContent = saved + 's';
  slider.addEventListener('input', () => {
    hayaoshiSpeed = parseInt(slider.value) * 1000;
    val.textContent = slider.value + 's';
    localStorage.setItem('hayaoshiSpeed', slider.value);
  });
  document.getElementById('hayaoshiSpeedReset').addEventListener('click', () => {
    slider.value = 8; slider.dispatchEvent(new Event('input'));
  });
})();

// ── Wordle ────────────────────────────────────────────────────────
let wordleWords   = [];
let wordleState   = null; // { answer, guesses[], panelX, panelY, winnerName }
let wordleDragState = null;

(async function loadWordleWords() {
  try {
    const r = await fetch('/text/wordle.txt');
    const t = await r.text();
    wordleWords = t.split('\n')
      .map(l => [...l.trim()].slice(0, 5).join(''))
      .filter(w => [...w].length === 5);
    if (wordleWords.length > 0) startWordle();
  } catch {}
})();

function startWordle() {
  if (!wordleWords.length) return;
  const panelX    = parseInt(localStorage.getItem('wordlePanelX'))    || 10;
  const panelY    = parseInt(localStorage.getItem('wordlePanelY'))    || 10;
  const cellSize  = parseInt(localStorage.getItem('wordleCellSize'))  || 34;
  wordleState = {
    answer:    wordleWords[Math.floor(Math.random() * wordleWords.length)],
    guesses:   [],
    panelX, panelY, cellSize,
    winnerName: null,
  };
  renderWordlePanel();
}

function nextWordleRound() {
  if (!wordleState) return;
  wordleState.answer     = wordleWords[Math.floor(Math.random() * wordleWords.length)];
  wordleState.guesses    = [];
  wordleState.winnerName = null;
  renderWordlePanel();
}

function evaluateWordle(guess, answer) {
  const g = [...guess], a = [...answer];
  const result = Array(5).fill('gray');
  const remaining = [...a];
  for (let i = 0; i < 5; i++) {
    if (g[i] === a[i]) { result[i] = 'green'; remaining[i] = null; }
  }
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'green') continue;
    const idx = remaining.indexOf(g[i]);
    if (idx !== -1) { result[i] = 'yellow'; remaining[idx] = null; }
  }
  return result;
}

function renderWordlePanel() {
  const MAX_GUESSES   = 30;
  const DISPLAY_ROWS  = 10;  // 最新N行だけ表示
  let panel = document.getElementById('wordlePanel');

  if (!wordleState) { if (panel) panel.remove(); return; }

  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'wordlePanel';
    stage.appendChild(panel);
    panel.addEventListener('mousedown', e => {
      if (e.button !== 0 || dragState || trashDragState || bossDragState) return;
      if (e.target.classList.contains('wordle-sz-btn')) return; // ボタンは除外
      const r  = panel.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      wordleDragState = { ox: r.left - sr.left, oy: r.top - sr.top, sx: e.clientX, sy: e.clientY };
      e.preventDefault(); e.stopPropagation();
    });
  }

  panel.style.left = wordleState.panelX + 'px';
  panel.style.top  = wordleState.panelY + 'px';
  const sz = wordleState.cellSize || 34;
  panel.style.setProperty('--wc-size', sz + 'px');

  const { answer, guesses, winnerName } = wordleState;
  const won  = winnerName !== null;
  const over = won || guesses.length >= MAX_GUESSES;

  // 表示する行: 最新DISPLAY_ROWS件（足りなければ空行で埋める）
  const showStart  = Math.max(0, guesses.length - DISPLAY_ROWS);
  const showGuesses = guesses.slice(showStart);  // 最新4行分の推測

  let html = `<div class="wordle-header">
    <div class="wordle-header-title">
      <span>もじあてｗ</span>
      <span class="wordle-subtitle">当てたら全回復</span>
    </div>
    <div style="display:flex;align-items:center;gap:4px">
      <span class="wordle-count">${guesses.length}/${MAX_GUESSES}</span>
      <button class="wordle-sz-btn" data-dir="-1">－</button>
      <button class="wordle-sz-btn" data-dir="1">＋</button>
    </div>
  </div><div class="wordle-grid">`;

  for (let row = 0; row < DISPLAY_ROWS; row++) {
    html += '<div class="wordle-row">';
    if (row < showGuesses.length) {
      const { word, result } = showGuesses[row];
      const chars = [...word];
      const isLast = row === showGuesses.length - 1;
      for (let col = 0; col < 5; col++) {
        html += `<div class="wordle-cell wc-${result[col]}${isLast ? ' just-added' : ''}">${chars[col] || ''}</div>`;
      }
    } else {
      for (let col = 0; col < 5; col++) html += '<div class="wordle-cell wc-empty"></div>';
    }
    html += '</div>';
  }
  html += '</div>';

  if (over) {
    if (won) {
      html += `<div class="wordle-answer">🎉 ${[...answer].join(' ')}</div>`;
      html += `<div class="wordle-winner-row">👑 ${escapeHtml(winnerName)} が正解！</div>`;
    } else {
      html += `<div class="wordle-answer">答え：${[...answer].join(' ')}</div>`;
    }
  }
  panel.innerHTML = html;

  // サイズ変更ボタン
  panel.querySelectorAll('.wordle-sz-btn').forEach(btn => {
    btn.addEventListener('mousedown', e => { e.stopPropagation(); });
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const dir = parseInt(btn.dataset.dir);
      wordleState.cellSize = Math.max(22, Math.min(58, (wordleState.cellSize || 34) + dir * 6));
      localStorage.setItem('wordleCellSize', wordleState.cellSize);
      renderWordlePanel();
    });
  });
}

function handleWordleGuess(user, word) {
  const MAX_GUESSES = 30;
  if (!wordleState || !wordleWords.length) return;
  const { guesses, answer } = wordleState;

  const alreadyWon = wordleState.winnerName !== null;
  if (alreadyWon || guesses.length >= MAX_GUESSES) return;
  if (guesses.some(g => g.word === word)) return;

  const result = evaluateWordle(word, answer);
  guesses.push({ word, result });
  renderWordlePanel();

  const won = result.every(r => r === 'green');

  if (won) {
    wordleState.winnerName = user.name || '名無し';
    user.wordleWins = (user.wordleWins || 0) + 1;
    renderWordlePanel();
    // 正解者バブル＋演出
    showBubble(user, `🎉 正解！`, {});
    playLocalSound(SOUND_HAYAOSHI_WHITE);
    const { x, y } = getCharCenter(user);
    spawnFireworks(x, y);
    spawnHeartShower(x, y);
    // 全員全回復演出
    const winnerName   = user.name || '名無し';
    const winnerAvatar = user.charDef?.emoji || '👤';
    setTimeout(() => {
      Object.values(users).forEach(u => {
        if (!u.el) return;
        u.hp = calcMaxHp(u);
        updateStatsDisplay(u);
        const { x: ux, y: uy } = getCharCenter(u);
        showDamageNumber(ux, uy - 30, '✨全回復', false, 16, '#86efac');
      });
      // 全員回復バナー
      const banner = document.createElement('div');
      banner.className = 'wordle-win-banner';
      banner.innerHTML = `${winnerAvatar} <b>${escapeHtml(winnerName)}</b> が正解！<br>✨ 全員全回復 ✨`;
      stage.appendChild(banner);
      setTimeout(() => banner.remove(), 4000);
    }, 600);
    setTimeout(nextWordleRound, 4500);
  } else if (guesses.length >= MAX_GUESSES) {
    renderWordlePanel();
    setTimeout(nextWordleRound, 5000);
  }
}

// Wordle パネルのドラッグ（mousemove / mouseup に組み込み）

// ── クイズゲーム ──────────────────────────────────────────────────
let quizQuestions = [];
let quizState = null; // { question, answer, answered, winnerName, timeLeft, timer, panelX, panelY }
let quizDragState = null;

(async function loadQuizQuestions() {
  try {
    const r = await fetch('/text/quiz.txt');
    const t = await r.text();
    quizQuestions = t.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && l.includes(','))
      .map(l => {
        const parts = l.split(',');
        const a = parts.pop().trim();
        const q = parts.join(',').trim();
        return { q, a };
      })
      .filter(({ q, a }) => q && a);
  } catch {}
})();

function normalizeAnswer(s) {
  return (s || '')
    .replace(/[\s　]/g, '')
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

function checkQuizAnswer(guess, answer) {
  const g = normalizeAnswer(guess);
  const a = normalizeAnswer(answer);
  if (!g) return false;
  if (g === a) return true;
  if (g.length >= 2 && (a.includes(g) || g.includes(a))) return true;
  return false;
}

function startQuiz() {
  if (!quizQuestions.length) return;
  const panelX = parseInt(localStorage.getItem('quizPanelX')) || 10;
  const panelY = parseInt(localStorage.getItem('quizPanelY')) || 80;
  quizState = { panelX, panelY };
  nextQuizQuestion();
}

function stopQuiz() {
  if (!quizState) return;
  clearInterval(quizState.timer);
  quizState = null;
  const panel = document.getElementById('quizPanel');
  if (panel) panel.remove();
}

function nextQuizQuestion() {
  if (!quizState || !quizQuestions.length) return;
  clearInterval(quizState.timer);
  const entry = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
  quizState.question   = entry.q;
  quizState.answer     = entry.a;
  quizState.answered   = false;
  quizState.winnerName = null;
  quizState.timeLeft   = 30;
  renderQuizPanel();
  quizState.timer = setInterval(() => {
    if (!quizState || quizState.answered) return;
    quizState.timeLeft = Math.max(0, quizState.timeLeft - 1);
    renderQuizPanel();
    if (quizState.timeLeft === 0) {
      clearInterval(quizState.timer);
      quizState.answered = true;
      renderQuizPanel();
      setTimeout(() => { if (quizState) nextQuizQuestion(); }, 4000);
    }
  }, 1000);
}

function renderQuizPanel() {
  let panel = document.getElementById('quizPanel');
  if (!quizState) { if (panel) panel.remove(); return; }

  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'quizPanel';
    stage.appendChild(panel);
    panel.addEventListener('mousedown', e => {
      if (e.button !== 0 || dragState || trashDragState || bossDragState || wordleDragState) return;
      const r  = panel.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      quizDragState = { ox: r.left - sr.left, oy: r.top - sr.top, sx: e.clientX, sy: e.clientY };
      e.preventDefault(); e.stopPropagation();
    });
  }

  panel.style.left = quizState.panelX + 'px';
  panel.style.top  = quizState.panelY + 'px';

  const { question, answer, answered, winnerName, timeLeft } = quizState;
  const solved   = answered && winnerName;
  const timedOut = answered && !winnerName;

  let html = `<div class="quiz-header">
    <span>${solved ? '✅ 正解！' : timedOut ? '⏰ 時間切れ' : '❓ クイズ'}</span>
    <span class="quiz-timer${!answered && timeLeft <= 5 ? ' quiz-timer-low' : ''}">${answered ? '' : `⏱ ${timeLeft}s`}</span>
  </div>
  <div class="quiz-question">${escapeHtml(question)}</div>`;

  if (answered) {
    html += `<div class="quiz-answer">答え：${escapeHtml(answer)}</div>`;
    if (solved) {
      html += `<div class="quiz-winner">🎉 ${escapeHtml(winnerName)} が正解！</div>`;
    }
  }

  panel.innerHTML = html;
}

function handleQuizAnswer(user, message) {
  if (!quizState || quizState.answered) return;
  if (!checkQuizAnswer(message, quizState.answer)) return;

  clearInterval(quizState.timer);
  quizState.answered   = true;
  quizState.winnerName = user.name || '名無し';
  if (!user.tc) user.tc = {};
  user.tc.quizWins = (user.tc.quizWins || 0) + 1;
  renderQuizPanel();

  user.hp = Math.min(calcMaxHp(user), (user.hp ?? 30) + 20);
  updateStatsDisplay(user);
  const { x, y } = getCharCenter(user);
  showDamageNumber(x, y - 30, '💊+20', false, 20, '#86efac');
  spawnFireworks(x, y);
  playLocalSound(SOUND_QUIZ_CORRECT);

  setTimeout(() => { if (quizState) nextQuizQuestion(); }, 4000);
}

// ── 次回BRタイマーパネル ──────────────────────────────────────────
function renderBRTimerPanel() {
  let panel = document.getElementById('brTimerPanel');

  if (!brTimerVisible) {
    if (panel) panel.style.display = 'none';
    return;
  }

  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'brTimerPanel';
    stage.appendChild(panel);
    panel.addEventListener('mousedown', e => {
      if (e.button !== 0 || dragState || trashDragState || bossDragState || wordleDragState || quizDragState) return;
      const r  = panel.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      brTimerDragState = { ox: r.left - sr.left, oy: r.top - sr.top, sx: e.clientX, sy: e.clientY };
      e.preventDefault(); e.stopPropagation();
    });
  }

  panel.style.display = '';
  panel.style.left = brTimerPanelX + 'px';
  panel.style.top  = brTimerPanelY + 'px';

  if (brState?.active) {
    panel.innerHTML = '<div class="brt-title">👑 BR中</div><div class="brt-time">−−:−−</div>';
    return;
  }

  const remaining = Math.max(0, brNextAutoAt - Date.now());
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  panel.innerHTML = `<div class="brt-title">⏰ 次のBR</div><div class="brt-time">${mins}:${String(secs).padStart(2, '0')}</div>`;
}

setInterval(renderBRTimerPanel, 1000);

document.getElementById('brTimerBtn').addEventListener('click', () => {
  brTimerVisible = !brTimerVisible;
  document.getElementById('brTimerBtn').classList.toggle('active', brTimerVisible);
  renderBRTimerPanel();
});

document.getElementById('hideEquipBtn').addEventListener('click', () => {
  equipHidden = !equipHidden;
  stage.classList.toggle('equip-hidden', equipHidden);
  document.getElementById('hideEquipBtn').classList.toggle('active', equipHidden);
});

document.getElementById('brAutoBtn').addEventListener('click', () => {
  brAutoEnabled = !brAutoEnabled;
  document.getElementById('brAutoBtn').classList.toggle('active', !brAutoEnabled);
});

// ── 早押しゲーム ──────────────────────────────────────────────────
let hayaoshiItems = []; // { type:'white'|'red', keyword, timeoutId } — 複数同時対応
const HAYAOSHI_FALLBACK = ['スター','ライブ','ゲーム','アニメ','サクラ','ハート','カワイイ','スゴイ'];

function startHayaoshi() {
  // ボタン押下：手動で赤を1回流す
  startHayaoshiAutoRed();
}

function startHayaoshiAutoWhite() {
  const pool = sinjakomeWords.length > 0 ? sinjakomeWords : HAYAOSHI_FALLBACK;
  const keyword = pool[Math.floor(Math.random() * pool.length)];
  const item = { type: 'white', keyword, timeoutId: null, el: null };
  item.timeoutId = setTimeout(() => {
    const idx = hayaoshiItems.indexOf(item);
    if (idx !== -1) hayaoshiItems.splice(idx, 1);
  }, hayaoshiSpeed + 10000);
  item.el = spawnNikoComment(keyword, 'white');
  hayaoshiItems.push(item);
}

function startHayaoshiAutoRed() {
  const pool = yojijukugoWords.length > 0 ? yojijukugoWords : HAYAOSHI_FALLBACK;
  const keyword = pool[Math.floor(Math.random() * pool.length)];
  const item = { type: 'red', keyword, timeoutId: null, el: null };
  item.timeoutId = setTimeout(() => {
    const idx = hayaoshiItems.indexOf(item);
    if (idx !== -1) hayaoshiItems.splice(idx, 1);
  }, hayaoshiSpeed + 10000);
  item.el = spawnNikoComment(keyword, 'red');
  hayaoshiItems.push(item);
}

function scatterNikoComment(el) {
  if (!el || !el.parentNode) return;
  // 現在のアニメーション位置をインラインスタイルに確定してからキャンセル
  const anim = el.getAnimations()[0];
  if (anim) {
    try { anim.commitStyles(); } catch {}
    anim.cancel();
  }
  // 飛散アニメーション
  const dir = Math.random() < 0.5 ? -1 : 1;
  el.style.transition = 'transform 0.45s ease-out, opacity 0.4s ease-out';
  el.style.transform  = (el.style.transform || '') + ` scale(1.8) translateY(-50px) rotate(${dir * (20 + Math.random() * 30)}deg)`;
  el.style.opacity    = '0';
  setTimeout(() => { if (el.parentNode) el.remove(); }, 450);
}

function spawnNikoComment(keyword, type) {
  const el = document.createElement('div');
  if (type === 'white') {
    el.className = 'niko-hayaoshi-white';
    el.innerHTML = `<span class="niko-label">💊回復！</span> ${escapeHtml([...keyword].join(' '))}`;
  } else {
    el.className = 'niko-hayaoshi';
    el.innerHTML = `<span class="niko-label">⚡早押し！</span> ${escapeHtml([...keyword].join(' '))}`;
  }

  el.style.fontSize = nikoFontSize + 'px';
  el.style.opacity  = nikoOpacity;
  // ステージ高さの10〜85%のランダムな縦位置
  el.style.top = (10 + Math.random() * 75) + '%';
  el.style.left = '0';
  el.style.transform = `translateX(${stage.clientWidth}px)`;
  stage.appendChild(el);

  requestAnimationFrame(() => {
    const stageW = stage.clientWidth;
    const elW    = el.offsetWidth;
    el.animate(
      [
        { transform: `translateX(${stageW}px)` },
        { transform: `translateX(${-elW}px)`  },
      ],
      { duration: hayaoshiSpeed, easing: 'linear', fill: 'forwards' }
    ).addEventListener('finish', () => el.remove());
  });
  return el;
}

// ──────────────────────────────────────────────────────────────────

// ── コンボシステム ────────────────────────────────────────────────
const comboBuffer = {}; // word → { ipids: Set, timer }
const COMBO_WINDOW = 5000;

function checkCombo(user, word) {
  const key = word.trim();
  if (!key || key.length < 2 || key.length > 30) return;
  if (!comboBuffer[key]) comboBuffer[key] = { ipids: new Set(), timer: null };
  const bucket = comboBuffer[key];
  bucket.ipids.add(user.ipid);
  clearTimeout(bucket.timer);
  if (bucket.ipids.size >= 2) {
    const comboIpids = [...bucket.ipids];
    delete comboBuffer[key];
    const comboUsers = comboIpids.map(id => users[id]).filter(u => u && u.el);
    triggerCombo(key, comboUsers, comboIpids.length);
  } else {
    bucket.timer = setTimeout(() => delete comboBuffer[key], COMBO_WINDOW);
  }
}

function triggerCombo(word, comboUsers, count) {
  // 参加者全員のコンボカウント
  comboUsers.forEach(u => {
    if (!u.tc) u.tc = {};
    u.tc.comboTriggers = (u.tc.comboTriggers || 0) + 1;
  });
  showComboText(count);
  playSentouSound();
  stage.classList.add('stage-shock');
  stage.addEventListener('animationend', () => stage.classList.remove('stage-shock'), { once: true });

  if (bossState && !bossState.defeated && bossState.hp > 0) {
    const mult = 1 + (count - 1) * 0.5;
    comboUsers.forEach((u, i) => {
      setTimeout(() => {
        if (!bossState || bossState.defeated) return;
        const atk = calcAtk(u);
        const dmg = Math.round(Math.max(1, atk * (1 + Math.random())) * mult);
        bossState.hp = Math.max(0, bossState.hp - dmg);
        updateBossHpDisplay();
        const { x, y } = getCharCenter(u);
        showDamageNumber(x, y - 30, '🔥' + dmg, false, 20, '#f97316');
        spawnFireworks(x, y);
        if (bossState.hp <= 0 && !bossState.defeated) setTimeout(() => defeatBoss(), 200);
      }, i * 150);
    });
  }

  addSystemLog(`🔥 ${count}コンボ！「${word}」`, '#f97316');
}

function showComboText(count) {
  const el = document.createElement('div');
  el.className = 'combo-text';
  el.textContent = count + ' COMBO!!';
  stage.appendChild(el);
  el.animate([
    { transform: 'translate(-50%, -50%) scale(0.2)', opacity: 0,   offset: 0    },
    { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 1,   offset: 0.22 },
    { transform: 'translate(-50%, -50%) scale(0.9)', opacity: 1,   offset: 0.38 },
    { transform: 'translate(-50%, -50%) scale(1.0)', opacity: 1,   offset: 0.70 },
    { transform: 'translate(-50%, -50%) scale(1.1)', opacity: 0,   offset: 1    },
  ], { duration: 2800, easing: 'ease-out', fill: 'forwards' }).onfinish = () => el.remove();
}

// ── 宝箱システム ──────────────────────────────────────────────────
function spawnTreasureChest() {
  if (compactMode) return;
  if (treasureChestEl) return;
  const el = document.createElement('div');
  el.id = 'treasureChest';
  el.className = 'treasure-chest';
  el.innerHTML = '🎁<div class="treasure-hint">「開ける」でゲット！</div>';
  const sw = stage.clientWidth, sh = stage.clientHeight;
  el.style.left = (80 + Math.random() * (sw - 200)) + 'px';
  el.style.top  = (80 + Math.random() * Math.max(50, sh - 220)) + 'px';
  stage.appendChild(el);
  treasureChestEl = el;
  treasureChestTimer = setTimeout(() => {
    if (treasureChestEl) { treasureChestEl.remove(); treasureChestEl = null; }
  }, 20000);
  addSystemLog('🎁 宝箱が出現！「開ける」でゲット！', '#fbbf24');
}

function openTreasureChest(user) {
  if (!treasureChestEl) return;
  clearTimeout(treasureChestTimer);
  treasureChestEl.remove();
  treasureChestEl = null;
  ensureCharOnStage(user);
  if (!user.tc) user.tc = {};
  user.tc.treasureOpens = (user.tc.treasureOpens || 0) + 1;

  // ド派手演出
  const sw = stage.clientWidth, sh = stage.clientHeight;
  // 白フラッシュ
  const flash = document.createElement('div');
  flash.className = 'treasure-flash';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 1000);
  // 花火20発
  for (let i = 0; i < 20; i++) {
    setTimeout(() => spawnFireworks(Math.random() * sw, Math.random() * sh * 0.85), i * 65);
  }
  spawnConfetti();
  const { x, y } = getCharCenter(user);
  spawnHeartShower(x, y);
  setTimeout(() => spawnHeartShower(sw * 0.25, sh * 0.5), 350);
  setTimeout(() => spawnHeartShower(sw * 0.75, sh * 0.5), 600);
  showTreasureOverlay(user);

  // 装備配布（value 5〜10 レア以上確定）
  if (!user.equips) user.equips = [];
  const value    = 5 + Math.floor(Math.random() * 6);
  const type     = EQUIP_POOL[Math.floor(Math.random() * EQUIP_POOL.length)];
  const rarEntry = RARITY[Math.min(value, RARITY.length - 1)] || RARITY[5];
  const newEquip = { ...type, value, rarityName: rarEntry.name, rarityCls: rarEntry.cls };
  const existing = user.equips.find(e => e.name === newEquip.name);
  if (existing) {
    const gain = Math.max(1, Math.floor(newEquip.value * 0.5));
    existing.value += gain;
    const r2 = RARITY[Math.min(existing.value, RARITY.length - 1)] || RARITY[1];
    existing.rarityName = r2.name; existing.rarityCls = r2.cls;
    showBubble(user, `${existing.icon}${existing.name}合成！ ${existing.stat === 'atk' ? 'ATK' : 'HP'}+${existing.value}(+${gain})`, {});
  } else {
    user.equips.push(newEquip);
    showBubble(user, `${newEquip.icon}${newEquip.name}[${newEquip.rarityName}]入手！`, {});
  }
  // HP +30
  user.hp = Math.min(calcMaxHp(user), (user.hp ?? 30) + 30);
  updateStatsDisplay(user);

  addSystemLog(`💎 ${user.name} が宝箱ゲット！ ${newEquip.icon}${newEquip.name}[${newEquip.rarityName}] HP+30`, '#fbbf24');
  if (typeof checkTitles === 'function') setTimeout(() => checkTitles(user), 200);
}

function showTreasureOverlay(user) {
  const prev = document.getElementById('treasureOverlay');
  if (prev) prev.remove();
  const ov = document.createElement('div');
  ov.id = 'treasureOverlay';
  ov.innerHTML =
    `<div id="treasureOverlayText">💎 お宝ゲット！！ 💎<br>` +
    `<span style="font-size:0.5em">${escapeHtml(user.name || '名無し')} が開けた！</span></div>`;
  document.body.appendChild(ov);
  setTimeout(() => {
    ov.style.transition = 'opacity 0.8s';
    ov.style.opacity = '0';
    setTimeout(() => ov.remove(), 900);
  }, 3500);
}

function addSystemLog(text, color) {
  const list = document.getElementById('commentList');
  const item = document.createElement('div');
  item.className = 'log-item';
  item.innerHTML =
    `<span class="log-avatar">⚙️</span>` +
    `<span class="log-name">SYSTEM</span>` +
    `<span class="log-msg" style="color:${color || '#e2e8f0'}">${escapeHtml(text)}</span>`;
  list.appendChild(item);
  list.scrollTop = list.scrollHeight;
  while (list.children.length > 300) list.removeChild(list.firstChild);
}

// ──────────────────────────────────────────────────────────────────



// ==================================================================
// 称号システム
// ==================================================================
const TITLES = [
  // -- 入門 --
  { id:'T01', name:'初コメント', condDesc:'初めてコメント', abilityDesc:'ATK+1',
    atk:1, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.commentCount||0) >= 1 },
  { id:'T02', name:'常連', condDesc:'コメント10回', abilityDesc:'HP+5',
    atk:0, hp:5, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.commentCount||0) >= 10 },
  { id:'T03', name:'古参', condDesc:'コメント50回', abilityDesc:'ATK+2',
    atk:2, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.commentCount||0) >= 50 },
  { id:'T04', name:'コメ廃', condDesc:'コメント100回', abilityDesc:'ATK+2 HP+5',
    atk:2, hp:5, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.commentCount||0) >= 100 },
  { id:'T05', name:'神コメンター', condDesc:'コメント200回', abilityDesc:'EXP×1.2',
    atk:0, hp:0, expM:1.2, dmgM:1, crit:0, red:0,
    cond: u => (u.commentCount||0) >= 200 },
  { id:'T06', name:'見習い戦士', condDesc:'ボスに初攻撃', abilityDesc:'ATK+1',
    atk:1, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.totalDmgDealt||0) >= 1 },
  { id:'T07', name:'武者修行中', condDesc:'Lv.3到達', abilityDesc:'HP+10',
    atk:0, hp:10, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.level||1) >= 3 },
  { id:'T08', name:'戦士', condDesc:'Lv.5到達', abilityDesc:'ATK+2',
    atk:2, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.level||1) >= 5 },
  { id:'T09', name:'勇者', condDesc:'Lv.7到達', abilityDesc:'ダメージ×1.05',
    atk:0, hp:0, expM:1, dmgM:1.05, crit:0, red:0,
    cond: u => (u.level||1) >= 7 },
  { id:'T10', name:'英雄', condDesc:'Lv.10（最高レベル）', abilityDesc:'ダメージ×1.1 クリ+5%',
    atk:0, hp:0, expM:1, dmgM:1.1, crit:0.05, red:0,
    cond: u => (u.level||1) >= 10 },
  // -- 戦闘 --
  { id:'T11', name:'討伐者', condDesc:'ボス撃破参加1回', abilityDesc:'ATK+1',
    atk:1, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.bossParticipations||0) >= 1 },
  { id:'T12', name:'猛者', condDesc:'ボス撃破参加5回', abilityDesc:'ダメージ×1.05',
    atk:0, hp:0, expM:1, dmgM:1.05, crit:0, red:0,
    cond: u => (u.tc?.bossParticipations||0) >= 5 },
  { id:'T13', name:'剛の者', condDesc:'ボス撃破参加10回', abilityDesc:'ATK+3',
    atk:3, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.bossParticipations||0) >= 10 },
  { id:'T14', name:'ボスキラー', condDesc:'ボスにトドメ1回', abilityDesc:'クリ+10%',
    atk:0, hp:0, expM:1, dmgM:1, crit:0.10, red:0,
    cond: u => (u.tc?.bossKills||0) >= 1 },
  { id:'T15', name:'刺客', condDesc:'ボスにトドメ3回', abilityDesc:'ダメージ×1.1',
    atk:0, hp:0, expM:1, dmgM:1.1, crit:0, red:0,
    cond: u => (u.tc?.bossKills||0) >= 3 },
  { id:'T16', name:'ダメ500', condDesc:'合計ダメージ500以上', abilityDesc:'ATK+2',
    atk:2, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.totalDmgDealt||0) >= 500 },
  { id:'T17', name:'ダメ2000', condDesc:'合計ダメージ2000以上', abilityDesc:'ダメージ×1.1',
    atk:0, hp:0, expM:1, dmgM:1.1, crit:0, red:0,
    cond: u => (u.totalDmgDealt||0) >= 2000 },
  { id:'T18', name:'ダメ10000', condDesc:'合計ダメージ10000以上', abilityDesc:'ダメ×1.2 ATK+5',
    atk:5, hp:0, expM:1, dmgM:1.2, crit:0, red:0,
    cond: u => (u.totalDmgDealt||0) >= 10000 },
  { id:'T19', name:'コンボマスター', condDesc:'コンボ発動3回', abilityDesc:'クリ+5%',
    atk:0, hp:0, expM:1, dmgM:1, crit:0.05, red:0,
    cond: u => (u.tc?.comboTriggers||0) >= 3 },
  { id:'T20', name:'コンボ王', condDesc:'コンボ発動10回', abilityDesc:'ダメ×1.1 クリ+5%',
    atk:0, hp:0, expM:1, dmgM:1.1, crit:0.05, red:0,
    cond: u => (u.tc?.comboTriggers||0) >= 10 },
  // -- 防御・サバイバル --
  { id:'T21', name:'生還者', condDesc:'死亡1回以上で生存中', abilityDesc:'被ダメ軽減5%',
    atk:0, hp:0, expM:1, dmgM:1, crit:0, red:0.05,
    cond: u => (u.deaths||0) >= 1 },
  { id:'T22', name:'九死に一生', condDesc:'HP1以下で生き残った', abilityDesc:'HP+15',
    atk:0, hp:15, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.lowHpSurvive||0) >= 1 },
  { id:'T23', name:'不屈の魂', condDesc:'5回死亡', abilityDesc:'被ダメ軽減10%',
    atk:0, hp:0, expM:1, dmgM:1, crit:0, red:0.10,
    cond: u => (u.deaths||0) >= 5 },
  { id:'T24', name:'不死鳳', condDesc:'10回死亡', abilityDesc:'HP+20 被ダメ軽減10%',
    atk:0, hp:20, expM:1, dmgM:1, crit:0, red:0.10,
    cond: u => (u.deaths||0) >= 10 },
  { id:'T25', name:'鉄人', condDesc:'20コメ以上 & 一度も死なず', abilityDesc:'HP+30',
    atk:0, hp:30, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.deaths||0) === 0 && (u.commentCount||0) >= 20 },
  // -- 装備・ペット --
  { id:'T26', name:'装備持ち', condDesc:'装備1個以上', abilityDesc:'ATK+1',
    atk:1, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.equips||[]).length >= 1 },
  { id:'T27', name:'装備コレクター', condDesc:'装備3個以上', abilityDesc:'ATK+2 HP+5',
    atk:2, hp:5, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.equips||[]).length >= 3 },
  { id:'T28', name:'重装備', condDesc:'装備5個以上', abilityDesc:'HP+20 被ダメ軽減5%',
    atk:0, hp:20, expM:1, dmgM:1, crit:0, red:0.05,
    cond: u => (u.equips||[]).length >= 5 },
  { id:'T29', name:'神装備', condDesc:'装備8個以上', abilityDesc:'ATK+5 HP+20 ダメ×1.1',
    atk:5, hp:20, expM:1, dmgM:1.1, crit:0, red:0,
    cond: u => (u.equips||[]).length >= 8 },
  { id:'T30', name:'ペット使い', condDesc:'ペット所持', abilityDesc:'EXP×1.1',
    atk:0, hp:0, expM:1.1, dmgM:1, crit:0, red:0,
    cond: u => !!u.pet },
  { id:'T31', name:'ペットマスター', condDesc:'レアペット以上所持', abilityDesc:'EXP×1.2 ATK+2',
    atk:2, hp:0, expM:1.2, dmgM:1, crit:0, red:0,
    cond: u => u.pet && ['rarity-rare','rarity-epic','rarity-legend','rarity-myth'].includes(u.pet.rarityCls) },
  { id:'T32', name:'神獣使い', condDesc:'神話ペット所持', abilityDesc:'ダメ×1.15 クリ+10%',
    atk:0, hp:0, expM:1, dmgM:1.15, crit:0.10, red:0,
    cond: u => u.pet?.rarityCls === 'rarity-myth' },
  // -- 回復・支援 --
  { id:'T33', name:'回復使い', condDesc:'回復コマンド3回使用', abilityDesc:'HP+10',
    atk:0, hp:10, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.healCount||0) >= 3 },
  { id:'T34', name:'天使', condDesc:'回復コマンド10回使用', abilityDesc:'HP+20 被ダメ軽減5%',
    atk:0, hp:20, expM:1, dmgM:1, crit:0, red:0.05,
    cond: u => (u.tc?.healCount||0) >= 10 },
  { id:'T35', name:'聖女', condDesc:'MP満タン発動3回', abilityDesc:'HP+15 EXP×1.1',
    atk:0, hp:15, expM:1.1, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.mpFull||0) >= 3 },
  // -- 早押し --
  { id:'T36', name:'早押し見習い', condDesc:'早押し正解3回', abilityDesc:'ATK+1',
    atk:1, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.hayaoshiWins||0) >= 3 },
  { id:'T37', name:'早押し名人', condDesc:'早押し正解10回', abilityDesc:'ATK+2 クリ+5%',
    atk:2, hp:0, expM:1, dmgM:1, crit:0.05, red:0,
    cond: u => (u.hayaoshiWins||0) >= 10 },
  { id:'T38', name:'早押し達人', condDesc:'早押し正解30回', abilityDesc:'ダメ×1.1',
    atk:0, hp:0, expM:1, dmgM:1.1, crit:0, red:0,
    cond: u => (u.hayaoshiWins||0) >= 30 },
  { id:'T39', name:'回復の鬼', condDesc:'白ストリーム早押し5回', abilityDesc:'HP+15',
    atk:0, hp:15, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.whiteHayaoshi||0) >= 5 },
  { id:'T40', name:'炎の戦士', condDesc:'赤ストリーム早押し5回', abilityDesc:'ダメ×1.1',
    atk:0, hp:0, expM:1, dmgM:1.1, crit:0, red:0,
    cond: u => (u.tc?.redHayaoshi||0) >= 5 },
  // -- Wordle --
  { id:'T41', name:'言葉遊び', condDesc:'Wordle正解1回', abilityDesc:'EXP×1.1',
    atk:0, hp:0, expM:1.1, dmgM:1, crit:0, red:0,
    cond: u => (u.wordleWins||0) >= 1 },
  { id:'T42', name:'言葉の達人', condDesc:'Wordle正解5回', abilityDesc:'ATK+2 EXP×1.1',
    atk:2, hp:0, expM:1.1, dmgM:1, crit:0, red:0,
    cond: u => (u.wordleWins||0) >= 5 },
  { id:'T43', name:'謎解き王', condDesc:'Wordle正解15回', abilityDesc:'ダメ×1.1 EXP×1.2',
    atk:0, hp:0, expM:1.2, dmgM:1.1, crit:0, red:0,
    cond: u => (u.wordleWins||0) >= 15 },
  // -- 宝箱 --
  { id:'T44', name:'宝探し', condDesc:'宝箱を開ける', abilityDesc:'HP+10',
    atk:0, hp:10, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.treasureOpens||0) >= 1 },
  { id:'T45', name:'宝箱ハンター', condDesc:'宝箱3回開ける', abilityDesc:'ATK+3 HP+10',
    atk:3, hp:10, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.treasureOpens||0) >= 3 },
  { id:'T46', name:'財宝の王', condDesc:'宝箱7回開ける', abilityDesc:'ダメ×1.1 HP+20',
    atk:0, hp:20, expM:1, dmgM:1.1, crit:0, red:0,
    cond: u => (u.tc?.treasureOpens||0) >= 7 },
  // -- EXP・成長 --
  { id:'T47', name:'経験豊富', condDesc:'総EXP 50以上', abilityDesc:'EXP×1.1',
    atk:0, hp:0, expM:1.1, dmgM:1, crit:0, red:0,
    cond: u => (u.exp||0) >= 50 },
  { id:'T48', name:'百戦練磨', condDesc:'総EXP 200以上', abilityDesc:'ATK+3 EXP×1.1',
    atk:3, hp:0, expM:1.1, dmgM:1, crit:0, red:0,
    cond: u => (u.exp||0) >= 200 },
  { id:'T49', name:'千戦の剣士', condDesc:'総EXP 500以上', abilityDesc:'ダメ×1.1 EXP×1.2',
    atk:0, hp:0, expM:1.2, dmgM:1.1, crit:0, red:0,
    cond: u => (u.exp||0) >= 500 },
  // -- 時間帯 --
  { id:'T50', name:'夜更かし', condDesc:'深夜0〜4時にコメント', abilityDesc:'ATK+2',
    atk:2, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: (u, h) => h >= 0 && h < 4 },
  { id:'T51', name:'早起き鳥', condDesc:'朝5〜7時にコメント', abilityDesc:'HP+10 EXP×1.1',
    atk:0, hp:10, expM:1.1, dmgM:1, crit:0, red:0,
    cond: (u, h) => h >= 5 && h < 7 },
  { id:'T52', name:'朝型人間', condDesc:'朝7〜10時にコメント', abilityDesc:'EXP×1.1',
    atk:0, hp:0, expM:1.1, dmgM:1, crit:0, red:0,
    cond: (u, h) => h >= 7 && h < 10 },
  { id:'T53', name:'昼間組', condDesc:'昼12〜14時にコメント', abilityDesc:'ATK+1',
    atk:1, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: (u, h) => h >= 12 && h < 14 },
  { id:'T54', name:'夜型人間', condDesc:'夜22時以降にコメント', abilityDesc:'ATK+2 HP+5',
    atk:2, hp:5, expM:1, dmgM:1, crit:0, red:0,
    cond: (u, h) => h >= 22 },
  { id:'T55', name:'深夜の番人', condDesc:'深夜2〜4時にコメント', abilityDesc:'ダメ×1.1',
    atk:0, hp:0, expM:1, dmgM:1.1, crit:0, red:0,
    cond: (u, h) => h >= 2 && h < 4 },
  { id:'T56', name:'週末戦士', condDesc:'土日にコメント', abilityDesc:'HP+10 EXP×1.1',
    atk:0, hp:10, expM:1.1, dmgM:1, crit:0, red:0,
    cond: (u, h, d) => d === 0 || d === 6 },
  { id:'T57', name:'平日戦士', condDesc:'月〜金にコメント', abilityDesc:'ATK+1 EXP×1.1',
    atk:1, hp:0, expM:1.1, dmgM:1, crit:0, red:0,
    cond: (u, h, d) => d >= 1 && d <= 5 },
  // -- 特殊行動 --
  { id:'T58', name:'命名者', condDesc:'名前を設定した', abilityDesc:'ATK+1',
    atk:1, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: u => !!u.nameManual },
  { id:'T59', name:'おしゃれさん', condDesc:'吹き出しをカスタマイズ', abilityDesc:'HP+5',
    atk:0, hp:5, expM:1, dmgM:1, crit:0, red:0,
    cond: u => u.bubbleDeco !== '' },
  { id:'T60', name:'移動王', condDesc:'移動設定5回変更', abilityDesc:'ATK+1',
    atk:1, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.moveChanges||0) >= 5 },
  // -- 複合条件 --
  { id:'T61', name:'バランス型', condDesc:'ATK装備とHP装備を両方所持', abilityDesc:'ATK+2 HP+10',
    atk:2, hp:10, expM:1, dmgM:1, crit:0, red:0,
    cond: u => { const eq=u.equips||[]; return eq.some(e=>e.stat==='atk')&&eq.some(e=>e.stat==='hp'); } },
  { id:'T62', name:'完全体', condDesc:'Lv.10 & 装備5個以上 & ペット所持', abilityDesc:'全能力強化 ダメ×1.2',
    atk:0, hp:0, expM:1, dmgM:1.2, crit:0, red:0,
    cond: u => (u.level||1)>=10 && (u.equips||[]).length>=5 && !!u.pet },
  { id:'T63', name:'攻撃の鬼', condDesc:'ATK合計20以上', abilityDesc:'クリ+10%',
    atk:0, hp:0, expM:1, dmgM:1, crit:0.10, red:0,
    cond: u => calcAtk(u) >= 20 },
  { id:'T64', name:'鉄壁の守護者', condDesc:'最大HP80以上', abilityDesc:'被ダメ軽減15%',
    atk:0, hp:0, expM:1, dmgM:1, crit:0, red:0.15,
    cond: u => calcMaxHp(u) >= 80 },
  { id:'T65', name:'MPマスター', condDesc:'MP18以上', abilityDesc:'EXP×1.2 HP+5',
    atk:0, hp:5, expM:1.2, dmgM:1, crit:0, red:0,
    cond: u => (u.mp||0) >= 18 },
  // -- ボス数 --
  { id:'T66', name:'ボス5体討伐', condDesc:'ボス5体撃破参加', abilityDesc:'ATK+2',
    atk:2, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.bossParticipations||0) >= 5 },
  { id:'T67', name:'ボス20体討伐', condDesc:'ボス20体撃破参加', abilityDesc:'ダメ×1.1',
    atk:0, hp:0, expM:1, dmgM:1.1, crit:0, red:0,
    cond: u => (u.tc?.bossParticipations||0) >= 20 },
  { id:'T68', name:'ボス50体討伐', condDesc:'ボス50体撃破参加', abilityDesc:'ダメ×1.2 ATK+5',
    atk:5, hp:0, expM:1, dmgM:1.2, crit:0, red:0,
    cond: u => (u.tc?.bossParticipations||0) >= 50 },
  { id:'T69', name:'ボスハンター', condDesc:'ボストドメ5回', abilityDesc:'クリ+15% ダメ×1.1',
    atk:0, hp:0, expM:1, dmgM:1.1, crit:0.15, red:0,
    cond: u => (u.tc?.bossKills||0) >= 5 },
  { id:'T70', name:'討伐の帝王', condDesc:'ボストドメ10回', abilityDesc:'ダメ×1.2 ATK+5 クリ+10%',
    atk:5, hp:0, expM:1, dmgM:1.2, crit:0.10, red:0,
    cond: u => (u.tc?.bossKills||0) >= 10 },
  // -- 大量コメント --
  { id:'T71', name:'500コメ', condDesc:'コメント500回', abilityDesc:'ATK+5 HP+10',
    atk:5, hp:10, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.commentCount||0) >= 500 },
  { id:'T72', name:'1000コメ', condDesc:'コメント1000回', abilityDesc:'ダメ×1.2 全能力強化',
    atk:5, hp:20, expM:1.2, dmgM:1.2, crit:0.05, red:0.05,
    cond: u => (u.commentCount||0) >= 1000 },
  // -- 合計ダメ上位 --
  { id:'T73', name:'ダメ30000', condDesc:'合計ダメージ30000以上', abilityDesc:'ダメ×1.3',
    atk:0, hp:0, expM:1, dmgM:1.3, crit:0, red:0,
    cond: u => (u.totalDmgDealt||0) >= 30000 },
  { id:'T74', name:'破壊神', condDesc:'合計ダメージ100000以上', abilityDesc:'ダメ×1.5 ATK+10',
    atk:10, hp:0, expM:1, dmgM:1.5, crit:0, red:0,
    cond: u => (u.totalDmgDealt||0) >= 100000 },
  // -- マイルストーン --
  { id:'T75', name:'コンボ50回', condDesc:'コンボ発動50回', abilityDesc:'ダメ×1.2 クリ+10%',
    atk:0, hp:0, expM:1, dmgM:1.2, crit:0.10, red:0,
    cond: u => (u.tc?.comboTriggers||0) >= 50 },
  { id:'T76', name:'宝箱15回', condDesc:'宝箱15回開ける', abilityDesc:'HP+30 ダメ×1.1',
    atk:0, hp:30, expM:1, dmgM:1.1, crit:0, red:0,
    cond: u => (u.tc?.treasureOpens||0) >= 15 },
  { id:'T77', name:'早押し100回', condDesc:'早押し正解100回', abilityDesc:'ATK+5 ダメ×1.2',
    atk:5, hp:0, expM:1, dmgM:1.2, crit:0, red:0,
    cond: u => (u.hayaoshiWins||0) >= 100 },
  { id:'T78', name:'回復の神', condDesc:'回復コマンド30回使用', abilityDesc:'HP+30 被ダメ軽減15%',
    atk:0, hp:30, expM:1, dmgM:1, crit:0, red:0.15,
    cond: u => (u.tc?.healCount||0) >= 30 },
  { id:'T79', name:'Wordle50回', condDesc:'Wordle正解50回', abilityDesc:'全能力×1.1 EXP×1.3',
    atk:3, hp:10, expM:1.3, dmgM:1.1, crit:0.05, red:0.05,
    cond: u => (u.wordleWins||0) >= 50 },
  { id:'T80', name:'百戦不敗', condDesc:'死亡0回 & 撃破参加50体', abilityDesc:'被ダメ完全回避5%確率',
    atk:0, hp:0, expM:1, dmgM:1, crit:0, red:0, special:'noDmg5',
    cond: u => (u.deaths||0)===0 && (u.tc?.bossParticipations||0)>=50 },
  // -- ユニーク --
  { id:'T81', name:'最高ATK', condDesc:'ATK合計30以上', abilityDesc:'ダメ×1.2 クリ+5%',
    atk:0, hp:0, expM:1, dmgM:1.2, crit:0.05, red:0,
    cond: u => calcAtk(u) >= 30 },
  { id:'T82', name:'最高HP', condDesc:'最大HP100以上', abilityDesc:'被ダメ軽減20%',
    atk:0, hp:0, expM:1, dmgM:1, crit:0, red:0.20,
    cond: u => calcMaxHp(u) >= 100 },
  { id:'T83', name:'ガチャ師', condDesc:'ペットガチャ5回', abilityDesc:'EXP×1.2',
    atk:0, hp:0, expM:1.2, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.petGachas||0) >= 5 },
  { id:'T84', name:'ガチャ廃', condDesc:'ペットガチャ20回', abilityDesc:'EXP×1.3 ATK+3',
    atk:3, hp:0, expM:1.3, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.petGachas||0) >= 20 },
  { id:'T85', name:'逆転の一手', condDesc:'HP5以下で生き残り3回', abilityDesc:'HP+25 被ダメ軽減10%',
    atk:0, hp:25, expM:1, dmgM:1, crit:0, red:0.10,
    cond: u => (u.tc?.lowHpSurvive||0) >= 3 },
  { id:'T86', name:'全力投球', condDesc:'15文字以上のコメント', abilityDesc:'ATK+2',
    atk:2, hp:0, expM:1, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.longComment||0) >= 1 },
  { id:'T87', name:'弁舌家', condDesc:'30文字以上のコメント5回', abilityDesc:'EXP×1.2 ATK+3',
    atk:3, hp:0, expM:1.2, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.longComment||0) >= 5 },
  { id:'T88', name:'炎の加護', condDesc:'赤ストリーム早押し7回', abilityDesc:'ダメ×1.15 クリ+5%',
    atk:0, hp:0, expM:1, dmgM:1.15, crit:0.05, red:0,
    cond: u => (u.tc?.redHayaoshi||0) >= 7 },
  { id:'T89', name:'聖なる癒し', condDesc:'白ストリーム早押し7回', abilityDesc:'HP+20 被ダメ軽減10%',
    atk:0, hp:20, expM:1, dmgM:1, crit:0, red:0.10,
    cond: u => (u.tc?.whiteHayaoshi||0) >= 7 },
  { id:'T90', name:'MPの鬼', condDesc:'MP満タン10回', abilityDesc:'EXP×1.2 HP+10',
    atk:0, hp:10, expM:1.2, dmgM:1, crit:0, red:0,
    cond: u => (u.tc?.mpFull||0) >= 10 },
  // -- 超強力 --
  { id:'T91', name:'天下無双', condDesc:'合計ダメ50000 & Lv.10', abilityDesc:'ダメ×1.4 ATK+8 クリ+10%',
    atk:8, hp:0, expM:1, dmgM:1.4, crit:0.10, red:0,
    cond: u => (u.totalDmgDealt||0)>=50000 && (u.level||1)>=10 },
  { id:'T92', name:'無敵の鎧', condDesc:'HP120以上 & 死亡0回', abilityDesc:'被ダメ軽減25% HP+30',
    atk:0, hp:30, expM:1, dmgM:1, crit:0, red:0.25,
    cond: u => calcMaxHp(u)>=120 && (u.deaths||0)===0 },
  { id:'T93', name:'百戦の覇者', condDesc:'ボス撃破参加100回', abilityDesc:'全ステ×1.15 ダメ×1.3',
    atk:3, hp:15, expM:1.15, dmgM:1.3, crit:0.05, red:0.05,
    cond: u => (u.tc?.bossParticipations||0) >= 100 },
  { id:'T94', name:'千の剣', condDesc:'合計ダメ500000以上', abilityDesc:'ダメ×2.0',
    atk:0, hp:0, expM:1, dmgM:2.0, crit:0, red:0,
    cond: u => (u.totalDmgDealt||0) >= 500000 },
  { id:'T95', name:'不死身', condDesc:'30回死亡', abilityDesc:'被ダメ軽減20% HP+40',
    atk:0, hp:40, expM:1, dmgM:1, crit:0, red:0.20,
    cond: u => (u.deaths||0) >= 30 },
  { id:'T96', name:'奇跡の戦士', condDesc:'10回以上死亡 & Lv.10', abilityDesc:'全能力×1.2',
    atk:3, hp:20, expM:1.2, dmgM:1.2, crit:0.05, red:0.05,
    cond: u => (u.deaths||0)>=10 && (u.level||1)>=10 },
  { id:'T97', name:'Wordle王', condDesc:'Wordle正解100回', abilityDesc:'全能力×1.3',
    atk:5, hp:20, expM:1.3, dmgM:1.3, crit:0.10, red:0.10,
    cond: u => (u.wordleWins||0) >= 100 },
  { id:'T98', name:'宝の神', condDesc:'宝箱30回開ける', abilityDesc:'ダメ×1.3 HP+50',
    atk:0, hp:50, expM:1, dmgM:1.3, crit:0, red:0,
    cond: u => (u.tc?.treasureOpens||0) >= 30 },
  { id:'T99', name:'最強の称号', condDesc:'称号50種以上取得', abilityDesc:'全能力×1.5 ダメ×1.5',
    atk:10, hp:50, expM:1.5, dmgM:1.5, crit:0.20, red:0.20,
    cond: u => (u.titles||[]).length >= 50 },
  { id:'T100', name:'神', condDesc:'称号80種以上取得', abilityDesc:'全能力×2.0 最強の存在',
    atk:15, hp:100, expM:2.0, dmgM:2.0, crit:0.30, red:0.30,
    cond: u => (u.titles||[]).length >= 80 },

  { id:'T101', name:'二刀の獣使い', condDesc:'ペット2体同時所持', abilityDesc:'ATK+3 EXP×1.2 クリ+5%',
    atk:3, hp:0, expM:1.2, dmgM:1.0, crit:0.05, red:0,
    cond: u => !!(u.pet && u.pet2) },
];

// 称号IDが解放済みか
function hasTitle(user, id) { return (user.titles||[]).includes(id); }

// 解放済み称号の合算ボーナスを返す
function getTitleBonuses(user) {
  let atk=0, hp=0, expM=1, dmgM=1, crit=0, red=0;
  (user.titles||[]).forEach(id => {
    const t = TITLES.find(x => x.id === id);
    if (!t) return;
    atk  += t.atk  || 0;
    hp   += t.hp   || 0;
    expM *= t.expM || 1;
    dmgM *= t.dmgM || 1;
    crit += t.crit || 0;
    red  += t.red  || 0;
  });
  return { atk, hp, expM, dmgM, crit, red };
}

// 条件を満たした称号を付与する
function checkTitles(user) {
  let newOnes = [];
  TITLES.forEach(t => {
    if (hasTitle(user, t.id)) return;
    try {
      if (t.cond(user, serverHour, serverDay)) {
        if (!user.titles) user.titles = [];
        user.titles.push(t.id);
        user.activeTitle = t.id;
        newOnes.push(t);
      }
    } catch {}
  });
  if (newOnes.length > 0) {
    newOnes.forEach((t, i) => setTimeout(() => showTitleUnlock(user, t), i * 600));
    updateNameDisplay(user);
    user.maxHp = calcMaxHp(user);
    user.atk   = calcAtk(user);
    updateStatsDisplay(user);
  }
}

// 称号解放演出
function showTitleUnlock(user, title) {
  if (!user.el) return;
  const popup = document.createElement('div');
  popup.className = 'title-unlock-popup';
  popup.innerHTML =
    '<div class="title-unlock-label">称号解放！</div>' +
    '<div class="title-unlock-name">' + escapeHtml(title.name) + '</div>' +
    '<div class="title-unlock-ability">' + escapeHtml(title.abilityDesc) + '</div>';
  document.body.appendChild(popup);
  const { x, y } = getCharCenter(user);
  popup.style.left = (x - 80) + 'px';
  popup.style.top  = (y - 90) + 'px';
  setTimeout(() => {
    popup.style.transition = 'opacity 0.6s, transform 0.6s';
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(-30px) scale(0.9)';
    setTimeout(() => popup.remove(), 700);
  }, 2500);
  addSystemLog('⭐ ' + (user.name||'名無し') + ' 【' + title.name + '】称号解放！ ' + title.abilityDesc, '#fbbf24');
}


// ── サーバ時刻取得 ─────────────────────────────────
async function serverTimePoll() {
  try {
    const r = await fetch('/api/time');
    const d = await r.json();
    serverHour = d.hour ?? serverHour;
    serverDay  = d.day  ?? serverDay;
  } catch {}
}
serverTimePoll();
setInterval(serverTimePoll, 5 * 60 * 1000);

// ── デバッグウィンドウ（BroadcastChannel経由） ──────────────────────
let _debugCounter = 0;

window._debugAPI = {
  get users() { return users; },
  handleComment,
  nextDebugId() { return 'dbg-' + (++_debugCounter) + '-' + Date.now(); },
};

const _debugBC = new BroadcastChannel('kukucome-debug');
_debugBC.onmessage = (e) => {
  const d = e.data;
  if (d.type === 'processComment') {
    try { handleComment(d.comment); } catch {}
  } else if (d.type === 'getUsers') {
    const list = Object.values(users).map(u => ({ ipid: u.ipid, name: u.name || '名無し' }));
    _debugBC.postMessage({ type: 'users', data: list });
  }
};

// ── 管理ウィンドウ（BroadcastChannel + WebSocket） ────────────────────
function handleAdminMessage(d, replyFn) {
  if (d.type === 'click' && d.id) {
    document.getElementById(d.id)?.click();
  } else if (d.type === 'slider' && d.id) {
    const el = document.getElementById(d.id);
    if (el) { el.value = d.value; el.dispatchEvent(new Event('input')); }
  } else if (d.type === 'select' && d.id) {
    const el = document.getElementById(d.id);
    if (el) { el.value = d.value; el.dispatchEvent(new Event('change')); }
  } else if (d.type === 'color' && d.id) {
    const el = document.getElementById(d.id);
    if (el) { el.value = d.value; el.dispatchEvent(new Event('input')); }
  } else if (d.type === 'getState' || d.type === 'ping') {
    const sliderIds = ['nikoSizeSlider','nikoOpacitySlider','hayaoshiFreqSlider','hayaoshiSpeedSlider',
                       'bossHpScaleSlider','bossAtkCoeffSlider','counterRateSlider','charSizeSlider','bossSizeSlider','brHpMultSlider'];
    const state = {};
    sliderIds.forEach(sid => { const el = document.getElementById(sid); if (el) state[sid] = el.value; });
    state.bgColor    = document.getElementById('bgColor')?.value;
    state.moveArea   = document.getElementById('moveAreaSelect')?.value;
    state.bgImageUrl = localStorage.getItem('bgImageUrl') || '';
    replyFn({ type: d.type === 'ping' ? 'pong' : 'state', data: state });
  } else if (d.type === 'processComment') {
    if (d.comment) handleComment(d.comment);
  } else if (d.type === 'getUsers') {
    const list = Object.values(users).filter(u => u.el).map(u => ({ ipid: u.ipid, name: u.name || '名無し' }));
    replyFn({ type: 'users', data: list });
  } else if (d.type === 'addAtkAll') {
    const val = parseInt(d.value) || 0;
    if (val <= 0) return;
    Object.values(users).filter(u => u.el).forEach(u => {
      if (!u.equips) u.equips = [];
      const existing = u.equips.find(e => e.name === '強化' && e.stat === 'atk');
      if (existing) {
        existing.value += val;
        const r2 = RARITY[Math.min(existing.value, RARITY.length - 1)] || RARITY[1];
        existing.rarityName = r2.name; existing.rarityCls = r2.cls;
      } else {
        const rarEntry = RARITY[Math.min(val, RARITY.length - 1)] || RARITY[1];
        u.equips.push({ name: '強化', icon: '⚡', stat: 'atk', value: val, rarityName: rarEntry.name, rarityCls: rarEntry.cls });
      }
      u.atk = calcAtk(u);
      updateEquipBadge(u);
      updateStatsDisplay(u);
    });
  } else if (d.type === 'distributeRandomPets') {
    Object.values(users).filter(u => u.el).forEach(u => {
      u.pet = rollPetGacha();
      renderPetBadge(u);
      updateStatsDisplay(u);
    });
  } else if (d.type === 'bgImage') {
    if (d.url) { localStorage.setItem('bgImageUrl', d.url); applyBgImage(d.url); }
  } else if (d.type === 'bgClear') {
    localStorage.removeItem('bgImageUrl'); applyBgImage(null);
  } else if (d.type === 'allWalk') {
    Object.values(users).filter(u => u.el).forEach(u => startWalk(u));
  } else if (d.type === 'allMoveNormal') {
    Object.values(users).filter(u => u.el).forEach(u => {
      stopWalk(u);
      u.movement = '普通';
      scheduleMove(u);
    });
  } else if (d.type === 'allBounce') {
    Object.values(users).filter(u => u.el).forEach(u => applyMotion(u, 'bouncing'));
  } else if (d.type === 'allSpin') {
    Object.values(users).filter(u => u.el).forEach(u => applyMotion(u, 'spinning'));
  } else if (d.type === 'distributeRandomEquips') {
    Object.values(users).filter(u => u.el).forEach(u => {
      if (!u.equips) u.equips = [];
      const value    = rollEquipValue(750);
      const type     = EQUIP_POOL[Math.floor(Math.random() * EQUIP_POOL.length)];
      const rarEntry = RARITY[Math.min(value, RARITY.length - 1)] || RARITY[1];
      const newEquip = { ...type, value, rarityName: rarEntry.name, rarityCls: rarEntry.cls };
      const existing = u.equips.find(e => e.name === newEquip.name);
      if (existing) {
        const gain = Math.max(1, Math.floor(newEquip.value * 0.5));
        existing.value += gain;
        const r2 = RARITY[Math.min(existing.value, RARITY.length - 1)] || RARITY[1];
        existing.rarityName = r2.name; existing.rarityCls = r2.cls;
      } else {
        u.equips.push(newEquip);
      }
      u.maxHp = calcMaxHp(u);
      u.atk   = calcAtk(u);
      updateEquipBadge(u);
      updateStatsDisplay(u);
    });
  }
}

// BroadcastChannel（同一ブラウザ内）
const _adminBC = new BroadcastChannel('kukucome-admin');
_adminBC.onmessage = (e) => handleAdminMessage(e.data, msg => _adminBC.postMessage(msg));

// WebSocket（OBSブラウザソース↔通常ブラウザのadmin.html）
(function initAdminWS() {
  const url = `ws://${location.host}/ws`;
  let ws;
  function connect() {
    ws = new WebSocket(url);
    ws.onopen  = () => ws.send(JSON.stringify({ type: 'identify', role: 'main' }));
    ws.onmessage = (e) => {
      let d; try { d = JSON.parse(e.data); } catch { return; }
      handleAdminMessage(d, msg => { if (ws.readyState === 1) ws.send(JSON.stringify(msg)); });
    };
    ws.onclose = () => setTimeout(connect, 3000);
  }
  connect();
})();

// ── 30分ごとの自動バトルロイヤル ─────────────────────────────────────
setInterval(() => {
  // コンパクトモード中・BR中・自動BR無効・キャラが2体未満なら何もしない
  brNextAutoAt = Date.now() + 30 * 60 * 1000; // タイマーを次の30分にリセット
  if (!brAutoEnabled) return;
  if (compactMode) return;
  if (brState?.active) return;
  const eligible = Object.values(users).filter(u => u.el && !u.ko && !u.afk);
  if (eligible.length < 2) return;

  // ボスが起動中なら先に消去
  if (bossState && !bossState.defeated) {
    bossManuallyCleared = true;
    bossState.defeated = true;
    if (bossState.el) {
      bossState.el.style.transition = 'transform 0.4s ease-in, opacity 0.4s ease-in';
      bossState.el.style.transform  = 'scale(0) rotate(15deg)';
      bossState.el.style.opacity    = '0';
      setTimeout(() => { bossState?.el?.remove(); bossState = null; }, 450);
    } else {
      bossState = null;
    }
    const prev = document.getElementById('bossSpeech');
    if (prev) prev.remove();
    // ボス消去後にBR開始
    setTimeout(startBattleRoyale, 600);
  } else {
    startBattleRoyale();
  }
}, 30 * 60 * 1000);

// ── OBSモード（?obs=1 で設定バーを非表示にして自動スタート） ──
(function initOBSMode() {
  if (new URLSearchParams(location.search).get('obs') !== '1') return;
  document.getElementById('settings').style.display = 'none';
  document.getElementById('stage').style.top = '0';
  document.getElementById('trashCan').style.display = 'none';
  if (localStorage.getItem('apikey')) {
    document.getElementById('startBtn').click();
  }
})();
