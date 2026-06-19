// ──────────────────────────────────────────────────────────────────
// タイマーグループ（残留タイマー対策の安全網）
//   グループ単位で setTimeout/setInterval を追跡し、clearAll() でまとめて
//   キャンセルできる。バトル開始/終了時に呼ぶことで「前の状態の積み残し
//   タイマーが次バトルに干渉する」残留バグ（背景残留・重さ）を防ぐ。
//   使い方: agruBattleTimers.setTimeout(fn, ms) で登録 → teardown で clearAll()
// ──────────────────────────────────────────────────────────────────
function makeTimerGroup() {
  const timeouts  = new Set();
  const intervals = new Set();
  return {
    setTimeout(fn, ms) {
      const id = setTimeout(() => { timeouts.delete(id); fn(); }, ms);
      timeouts.add(id);
      return id;
    },
    setInterval(fn, ms) {
      const id = setInterval(fn, ms);
      intervals.add(id);
      return id;
    },
    clear(id) { clearTimeout(id); clearInterval(id); timeouts.delete(id); intervals.delete(id); },
    clearAll() {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
      timeouts.clear();
      intervals.clear();
    },
  };
}
// アゲルバトル専用のタイマーグループ。バトル中に生成する一時的な演出
// タイマーをここに登録すると、startAgruBattle / endAgruBattle で自動一掃される。
const agruBattleTimers = makeTimerGroup();

// ──────────────────────────────────────────────────────────────────
// ボス討伐・育成
// ──────────────────────────────────────────────────────────────────
let bossState = null;
let bossManuallyCleared = false;
let contentMode = false;
let contentModeSaved = {};     // { [ipid]: { x, y, sizeScale } }
let contentModeBossSaved = null; // { sizeScale }
let brState   = null; // バトルロイヤル状態 // 消去ボタン押下後は自動召喚しない
let taimanState = null; // タイマン状態
let brNextAutoAt    = Date.now() + 30 * 60 * 1000; // 次回自動BR予定時刻(ms)
let brTimerVisible  = localStorage.getItem('brTimerVisible') === '1';
let brTimerDragState = null;
let brTimerPanelX   = parseInt(localStorage.getItem('brTimerPanelX')) || 10;
let brTimerPanelY   = parseInt(localStorage.getItem('brTimerPanelY')) || 150;
let bossCount = 1;       // 現在何体目のボスか
let bossCounterRate = parseFloat(localStorage.getItem('bossCounterRate') ?? '0.40');
let bossHpScale    = parseFloat(localStorage.getItem('bossHpScale')    ?? '1');
let bossAtkCoeff   = parseInt(localStorage.getItem('bossAtkCoeff')   ?? '20');
let brHpMult       = parseInt(localStorage.getItem('brHpMult')       ?? '200');
let taimanHpMult   = parseInt(localStorage.getItem('taimanHpMult')   ?? '10');
let taimanDefeatCommand = localStorage.getItem('taimanDefeatCommand') || '';
let taimanCharScale     = parseFloat(localStorage.getItem('taimanCharScale') || '4');
let taimanCooldown      = parseInt(localStorage.getItem('taimanCooldown')) || 5 * 60 * 1000;
let autoReplyWords    = JSON.parse(localStorage.getItem('autoReplyWords')    || 'null') || ['これ放置','mumyou','無明','いない','いにゃい','寝た？','ねた？','ほうち','ホウチ','houti','houchi','abandoned','いる？','iru?','ねてる'];
let autoReplyMessages = JSON.parse(localStorage.getItem('autoReplyMessages') || 'null') || ['いますよ'];
let autoDeleteMinutes   = parseInt(localStorage.getItem('autoDeleteMinutes')) || 30;
let charAspectExp       = parseFloat(localStorage.getItem('charAspectExp') ?? '0.5');
let charPortraitBoost   = parseFloat(localStorage.getItem('charPortraitBoost') ?? '0');
let charStatsBottom     = parseInt(localStorage.getItem('charStatsBottom') ?? '0');
let charStatsLeft       = parseInt(localStorage.getItem('charStatsLeft')   ?? '0');
let charEquipOffsetX    = parseInt(localStorage.getItem('charEquipOffsetX') ?? '0');
let charEquipOffsetY    = parseInt(localStorage.getItem('charEquipOffsetY') ?? '0');
let petSizeScale        = parseFloat(localStorage.getItem('petSizeScale') ?? '1');
let petAspectExp        = parseFloat(localStorage.getItem('petAspectExp') ?? '0.5');
let petPortraitBoost    = parseFloat(localStorage.getItem('petPortraitBoost') ?? '0');
let jiggleConfig        = {};
try { jiggleConfig = JSON.parse(localStorage.getItem('jiggleConfig') || '{}'); } catch(e) {}
let nikoFontSize  = parseInt(localStorage.getItem('nikoFontSize')  || '40');
let nikoOpacity   = parseFloat(localStorage.getItem('nikoOpacity') || '1.0');
function nextBossHp() {
  const totalAtk = Object.values(users).filter(u => u.el && !u.ko)
    .reduce((sum, u) => sum + calcAtk(u), 0);
  return Math.max(100, Math.round(Math.max(1, totalAtk) * bossAtkCoeff * bossHpScale));
}
let moveLocked = false;          // 移動制限モード（方向移動・移動コマンド禁止）
let debugMode  = false;          // デバッグモード（全キャラATK=50）
let compactMode  = false;        // コンパクトモード
let fiveMinMode  = false;        // 5分モード（AI自動返答）
let equipHidden        = false;   // 装備アイコン非表示
let gatherMarginLeft   = parseInt(localStorage.getItem('gatherMarginLeft')  || '50');
let gatherMarginRight  = parseInt(localStorage.getItem('gatherMarginRight') || '50');
let gatherMarginBottom = parseInt(localStorage.getItem('gatherMarginBottom') || '10');
let gatherRowMax       = parseInt(localStorage.getItem('gatherRowMax') || '10');
let contentModeGatherMarginBottom = parseInt(localStorage.getItem('contentModeGatherMarginBottom') || '10');
let contentModeGatherMarginLeft   = parseInt(localStorage.getItem('contentModeGatherMarginLeft')   || '0');
let contentModeGatherMarginRight  = parseInt(localStorage.getItem('contentModeGatherMarginRight')  || '0');
let contentModeCharSizePct  = parseInt(localStorage.getItem('contentModeCharSizePct')  || '70');
let contentModeBossSizePct  = parseInt(localStorage.getItem('contentModeBossSizePct')  || '10');
let brAutoEnabled = true;        // 自動バトルロイヤル有効フラグ
let bombHidden      = localStorage.getItem('bombHidden')      === 'true';
let trashHidden     = localStorage.getItem('trashHidden')     === 'true';
let charStatsHidden = localStorage.getItem('charStatsHidden') === 'true';
let charNameHidden  = localStorage.getItem('charNameHidden')  === 'true';
let breatheDisabled   = localStorage.getItem('breatheDisabled')   === 'true';
let bossFloatDisabled = localStorage.getItem('bossFloatDisabled') === 'true';
let newsTickerEnabled   = localStorage.getItem('newsTickerEnabled') === 'true';
let newsTickerWidth     = parseInt(localStorage.getItem('newsTickerWidth'))     || 100;
let newsTickerX         = parseInt(localStorage.getItem('newsTickerX'))         || 0;
let newsTickerY         = parseInt(localStorage.getItem('newsTickerY'))         ?? 97;
let newsTickerRows      = parseInt(localStorage.getItem('newsTickerRows'))      || 1;
let newsTickerFontSize  = parseInt(localStorage.getItem('newsTickerFontSize'))  || 13;
let newsTickerBgOpacity = parseInt(localStorage.getItem('newsTickerBgOpacity')) ?? 90;
let newsTickerSpeed     = parseInt(localStorage.getItem('newsTickerSpeed'))     || 100;
let newsTickerMode     = localStorage.getItem('newsTickerMode')                 || 'hscroll';
let newsTickerInterval = parseInt(localStorage.getItem('newsTickerInterval'))   || 8;
let newsTickerTategaki = localStorage.getItem('newsTickerTategaki') === 'true';
let newsTickerHeight   = parseInt(localStorage.getItem('newsTickerHeight'))   || 0;
let wordlePanelWidth      = parseInt(localStorage.getItem('wordlePanelWidth'))      || 200;
let wordlePanelBgOpacity  = localStorage.getItem('wordlePanelBgOpacity')  !== null ? parseInt(localStorage.getItem('wordlePanelBgOpacity'))  : 93;
let rankingPanelBgOpacity = localStorage.getItem('rankingPanelBgOpacity') !== null ? parseInt(localStorage.getItem('rankingPanelBgOpacity')) : 92;
let quizPanelBgOpacity    = localStorage.getItem('quizPanelBgOpacity')    !== null ? parseInt(localStorage.getItem('quizPanelBgOpacity'))    : 93;
let slotSoundEnabled = true;    // スロット効果音ON/OFF
// ボスアゲル 歌詞フロート状態変数
let lyricsFloatEnabled    = false;
let lyricsFloatBpm        = 80;
let lyricsFloatSpawnBeats = 4;
let lyricsFloatMaxLines   = 5;
let lyricsFloatDuration   = 5;
let lyricsFloatMinSize    = 24;
let lyricsFloatMaxSize    = 120;
let lyricsFloatOpacity    = 85;
let lyricsFloatAngle      = 30;
let lyricsFloatColorMode  = 'dark';
let lyricsFloatBlur       = 0;
let lyricsFloatFont       = '';
// TTS設定
let seVolume      = parseFloat(localStorage.getItem('seVolume')    ?? '1.0');  // 効果音マスター音量
let voiceVolume   = parseFloat(localStorage.getItem('voiceVolume') ?? '1.0');  // ボイスコメント音量
let ttsModel      = '';
let ttsVoice      = 'ja-JP-NanamiNeural-Female';
let ttsF0UpKey    = 0;
let ttsIndexRate  = 0.75;
let ttsProtect    = 0.33;
let ttsSpeed      = 0;
let ttsVolume     = 1.0;

// SD生成設定
let sdWidth          = 1600;
let sdHeight         = 1000;
let sdSteps          = 20;
let sdPopWidth       = 480; // SD画像の表示サイズ(px)
let sdPositiveSuffix = 'masterpiece, best quality';
let sdNegative       = '(worst quality:2),(low quality:2),(normal quality:2),lowres,extra fingers,fewer fingers,monochrome,grayscale,text,watermark,logo,';
let sdDisplayTime    = 10;
let sdMosaicKeywords = '';
let sdMosaicBlock    = 20;
let sdCfgScale       = parseFloat(localStorage.getItem('sdCfgScale')) || 3;
let sdSampler        = localStorage.getItem('sdSampler') || 'Euler a';
let charExcludeIds   = new Set();
let kaiBullets    = [];          // 射コマンド物理弾リスト
let kaiAnimId     = null;        // 射物理ループ requestAnimationFrame ID
let kaiSpeed      = parseInt(localStorage.getItem('kaiSpeed')       ?? '18');          // 射出強さ
let kaiRestitution = parseFloat(localStorage.getItem('kaiRestitution') ?? '65') / 100; // 反発係数
let kaiGravity    = parseFloat(localStorage.getItem('kaiGravity')    ?? '35') / 100;   // 重力加速度
let kaiBulletSize = parseInt(localStorage.getItem('kaiBulletSize')   ?? '32');          // 弾文字サイズ(px)
let afkOpacity    = parseInt(localStorage.getItem('afkOpacity')    ?? '45');
let afkGrayscale  = parseInt(localStorage.getItem('afkGrayscale')  ?? '60');
let afkBrightness = parseInt(localStorage.getItem('afkBrightness') ?? '55');
let bossDamageMap    = {};          // ipid → { name, totalDmg } 現ボス戦分
let cumulativeDmgMap = (() => { try { return JSON.parse(localStorage.getItem('cumulativeDmgMap') || '{}'); } catch { return {}; } })();
let rankingState       = null;
let rankingDragState   = null;
let bossDragState = null;
let bossLastPos   = (localStorage.getItem('bossX') !== null && localStorage.getItem('bossY') !== null)
  ? { x: parseInt(localStorage.getItem('bossX')), y: parseInt(localStorage.getItem('bossY')) }
  : null;
// Lv1〜10 累計攻撃数（合計150）
// Lv1=0, Lv100=4000 の二次曲線: f(i) = round((96010i + 1010i²) / 4851)
const LEVEL_EXP = Array.from({length: 100}, (_, i) => Math.round((96010 * i + 1010 * i * i) / 4851));

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
  return Math.min(lv, 100);
}

function calcAtk(user) {
  if (debugMode) return 50;
  const base  = 1 + (user.level || 1);
  const bonus = (user.equips || []).filter(e => e.stat === 'atk').reduce((s, e) => s + (e.value || 0), 0);
  const titleBonus = typeof getTitleBonuses === 'function' ? (getTitleBonuses(user).atk || 0) : 0;
  return base + bonus + titleBonus;
}

function calcMaxHp(user) {
  const lv         = user.level || 1;
  const base       = 30 + (lv - 1) * 2;
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
  const expToNext = lv >= 100 ? 'MAX' : LEVEL_EXP[lv] - (user.exp || 0);
  // タイマン/BR中は仮想HPを表示
  const inTaiman = taimanState?.active && taimanState.hp[user.ipid] !== undefined;
  const inBR     = !inTaiman && brState?.active && brState.hp[user.ipid] !== undefined;
  const hp  = inTaiman ? Math.max(0, taimanState.hp[user.ipid])
            : inBR     ? Math.max(0, brState.hp[user.ipid])
            : (user.hp ?? 30);
  const mhp = inTaiman ? (taimanState.maxHp[user.ipid] ?? hp)
            : inBR     ? (brState.maxHp[user.ipid] ?? hp)
            : (user.maxHp ?? 30);
  const hpPct   = mhp > 0 ? Math.min(100, Math.round((hp / mhp) * 100)) : 0;
  const hpColor = hpPct > 50 ? '#4ade80' : hpPct > 20 ? '#fbbf24' : '#f87171';
  let titleHtml = '';
  if (user.activeTitle && typeof TITLES !== 'undefined') {
    const t = TITLES.find(x => x.id === user.activeTitle);
    if (t) titleHtml = `<span class="cs-row"><span class="title-tag ${getTitleCls(t)}">${escapeHtml(t.name)}</span></span>`;
  }
  s.innerHTML =
    titleHtml +
    `<span class="cs-row"><span class="cs-hpbar"><span class="cs-hpfill" style="width:${hpPct}%;background:${hpColor}"></span><span class="cs-hpnum">${hp}</span></span></span>` +
    `<span class="cs-row">💎${mp}</span>` +
    `<span class="cs-row">⚔️${atk}</span>` +
    `<span class="cs-row">⭐${expToNext}</span>`;
  if (agruBattleActive) updateBattleGrayscale(user);
}

function updateBattleGrayscale(user) {
  const a = document.getElementById('a-' + user.ipid);
  if (!a) return;
  if (!agruBattleActive) { a.querySelector('.hp-gray-overlay')?.remove(); return; }
  const baseImg = a.querySelector('img:not(.hp-gray-overlay)');
  if (!baseImg) return;
  const maxHp = user.maxHp ?? calcMaxHp(user);
  const hp    = Math.max(0, user.hp ?? maxHp);
  const hpPct = maxHp > 0 ? Math.min(1, hp / maxHp) : 0;
  let ov = a.querySelector('.hp-gray-overlay');
  if (!ov) {
    ov = document.createElement('img');
    ov.className = 'hp-gray-overlay';
    ov.alt = '';
    a.appendChild(ov);
  }
  if (ov.src !== baseImg.src) ov.src = baseImg.src;
  ov.style.clipPath  = `inset(0 0 ${(hpPct * 100).toFixed(1)}% 0)`;
  ov.style.transform = isUserFlipped(user) ? 'scaleX(-1)' : '';
}

function randomizeCharAppearance(user) {
  const shapes = Object.values(SHAPE_MAP);
  const decos  = ['', 'glow', 'rainbow', 'dotted'];
  const colors = Object.values(COLOR_NAMES);
  user.bubbleShape = shapes[Math.floor(Math.random() * shapes.length)];
  user.font        = RANDOM_FONTS[Math.floor(Math.random() * RANDOM_FONTS.length)];
  user.bubbleDeco  = decos[Math.floor(Math.random() * decos.length)];
  user.textColor   = colors[Math.floor(Math.random() * colors.length)];
}

function rollEquipValue(bossMaxHp) {
  const cap = Math.min(10, Math.max(1, Math.ceil(bossMaxHp / 150)));
  // 2回振って高い方（強ボスほど高レア出やすい）
  const val = Math.max(
    Math.ceil(Math.random() * cap),
    Math.ceil(Math.random() * cap),
  );
  // 神話レアリティ(value>=8)は追加ゲートで1/10に絞る
  if (RARITY[Math.min(val, RARITY.length - 1)]?.cls === 'rarity-myth' && Math.random() >= 0.1) {
    return 7; // 伝説に格下げ
  }
  return val;
}

function updateEquipBadge(user) {
  if (!user.el) return;
  let area = user.el.querySelector('.char-equip-area');
  if (!area) {
    area = document.createElement('div');
    area.className = 'char-equip-area';
    const avatarWrap = user.el.querySelector('.avatar-wrap');
    if (avatarWrap) user.el.insertBefore(area, avatarWrap);
    else user.el.appendChild(area);
  }
  area.querySelectorAll('.char-equip-badge').forEach(b => b.remove());
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

