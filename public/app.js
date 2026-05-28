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
  // ── 基本色 (13) ──
  '赤': '#FF4444', '青': '#4499FF', '緑': '#44CC44',
  '黄': '#FFCC00', '紫': '#CC44CC',
  '黒': '#222222', 'ピンク': '#FF88BB', '橙': '#FF8800',
  'オレンジ': '#FF8800', 'シアン': '#00CCCC', 'ライム': '#88FF00',
  '水色': '#87CEEB', '茶': '#A0522D',
  // ── 白・灰系 (15) ──
  '白': '#FFFFFF', '灰': '#888888', 'グレー': '#808080',
  '薄灰': '#D3D3D3', '鼠色': '#696969', 'スレート': '#708090',
  'チャコール': '#36454F', 'ガンメタル': '#2A3439',
  '銀': '#C0C0C0', 'シルバー': '#A8A9AD', 'プラチナ': '#E5E4E2',
  'パール': '#F0EAD6', 'アイボリー': '#FFFFF0',
  'クリーム': '#FFFDD0', 'オフホワイト': '#FAF9F6',
  // ── 赤系 (15) ──
  '深紅': '#C00040', '朱色': '#E34234', '紅': '#CC0033',
  '真紅': '#8B0000', 'バーガンディ': '#7C0A02', 'スカーレット': '#FF2400',
  'クリムゾン': '#DC143C', 'マルーン': '#800000', 'ルビー': '#9B111E',
  'ガーネット': '#733635', 'トマト': '#FF6347', 'ポピー': '#FF4040',
  'ヒナゲシ': '#FF3B32', 'ヴァーミリオン': '#E44D2E', 'ストロベリー': '#FC5A8D',
  // ── ピンク系 (16) ──
  '薄紅': '#FF9EAE', '桃色': '#FFBBCB', '桜色': '#FFB7C5',
  'ローズ': '#FF007F', 'ホットピンク': '#FF69B4', 'ディープピンク': '#FF1493',
  'ベビーピンク': '#F4C2C2', 'ラズベリー': '#E30B5C', 'カーネーション': '#FFA6C9',
  'フラミンゴ': '#FC8EAC', 'ペールピンク': '#FADADD', 'ローズピンク': '#FF66CC',
  'コットンキャンディ': '#FFBCD9', 'ライトピンク': '#FFB6C1',
  'ネオンピンク': '#FF6EC7', 'ロータス': '#E8B4B8',
  // ── オレンジ・コーラル系 (15) ──
  'コーラル': '#FF7F50', 'サーモン': '#FA8072', '珊瑚': '#FF6B6B',
  'テラコッタ': '#E2725B', 'レンガ': '#CB4154', 'チェリー': '#DE3163',
  'クランベリー': '#9C2542', 'バーンオレンジ': '#CC5500', 'ダークオレンジ': '#FF8C00',
  'ピーチ': '#FFCBA4', 'マンダリン': '#F47B20', 'アプリコット': '#FBCEB1',
  'ライトオレンジ': '#FFB347', 'ネオンオレンジ': '#FF6700', 'ライトコーラル': '#F08080',
  // ── 黄色系 (23) ──
  '山吹': '#FFB300', '向日葵': '#FFC512', 'レモン': '#FFF44F',
  'バニラ': '#F3E5AB', 'アンバー': '#FFBF00', 'ゴールド': '#FFD700',
  '金色': '#E6B800', 'カーキ': '#C3B091', 'マスタード': '#FFDB58',
  'タンジェリン': '#F28500', 'パンプキン': '#FF7518', 'ハニー': '#FEA004',
  'コーン': '#FBEC5D', 'サフラン': '#F4C430', '菜の花': '#FFD800',
  'シャンパン': '#F7E7CE', 'バター': '#FFFD74', 'ゴールデン': '#FFC200',
  'イエロー': '#FFFF00', 'サンシャイン': '#FFD447', 'ミモザ': '#F3DC5C',
  'ライトイエロー': '#FFFFE0', 'ネオンイエロー': '#DFFF00',
  // ── 青系 (30) ──
  '紺': '#003087', '藍': '#1F3A6E', '群青': '#4166F5',
  '瑠璃色': '#1C4D9B', '蒼': '#27408B', 'ネイビー': '#000080',
  'ロイヤルブルー': '#4169E1', 'ドジャーブルー': '#1E90FF', 'ターコイズ': '#40E0D0',
  'ティール': '#008080', 'スカイブルー': '#00BFFF', 'ミッドナイトブルー': '#191970',
  'スチールブルー': '#4682B4', 'インディゴ': '#4B0082', 'コバルト': '#0047AB',
  '空色': '#A8D8EA', '紺碧': '#007FFF', 'アクア': '#00FFFF',
  'ペリウィンクル': '#CCCCFF', 'セルリアン': '#2A52BE', 'アイスブルー': '#99C5C4',
  'デニム': '#1560BD', 'サファイア': '#0F52BA', 'コーンフラワー': '#6495ED',
  'パウダーブルー': '#B0E0E6', 'ライトブルー': '#ADD8E6', 'ベビーブルー': '#89CFF0',
  'ブルーグレー': '#6699CC', 'アクアマリン': '#7FFFD4', 'ネオンブルー': '#4D4DFF',
  // ── 緑系 (28) ──
  '黄緑': '#9ACD32', '萌黄': '#AACC44', '若草': '#9DC05D',
  '深緑': '#006400', '苔色': '#8A9A5B', '抹茶': '#8FBC45',
  'フォレストグリーン': '#228B22', 'エメラルド': '#50C878', 'ミント': '#98FF98',
  'オリーブ': '#808000', 'セージ': '#77926F', 'ジェード': '#00A86B',
  'ハンターグリーン': '#355E3B', '常磐': '#007F5F', 'ネオングリーン': '#39FF14',
  'ピスタチオ': '#93C572', 'アーミーグリーン': '#4B5320', 'アボカド': '#568203',
  'スプリンググリーン': '#00FF7F', 'チャートリューズ': '#7FFF00', 'フェルン': '#4F7942',
  'グラスグリーン': '#67B346', 'グリーンティー': '#D0F0C0', 'シーグリーン': '#2E8B57',
  'ミリタリーグリーン': '#4A5240', 'ダークグリーン': '#013220',
  'ライトグリーン': '#90EE90', 'モスグリーン': '#556B2F',
  // ── 紫系 (21) ──
  '薄紫': '#D8BFD8', '藤色': '#9B7CB5', '葡萄色': '#6F2DA8',
  '菫色': '#5C3A7A', 'ラベンダー': '#E6E6FA', 'バイオレット': '#7F00FF',
  'マゼンタ': '#FF00FF', 'フクシア': '#FF1DCE', 'プラム': '#DDA0DD',
  'ライラック': '#C8A2C8', 'アメジスト': '#9966CC', 'オーキッド': '#DA70D6',
  'パープル': '#800080', 'ワイン': '#722F37', 'モーブ': '#E0B0FF',
  'ダークバイオレット': '#9400D3', 'スレートブルー': '#6A5ACD',
  'ブルーバイオレット': '#8A2BE2', 'ロイヤルパープル': '#7851A9',
  'ディープパープル': '#673AB7', 'ナス': '#4B0057',
  // ── 茶・アース系 (24) ──
  '栗色': '#954535', '小麦': '#F5DEB3', 'タン': '#D2B48C',
  'ベージュ': '#F5F5DC', 'チョコ': '#7B3F00', 'コーヒー': '#6F4E37',
  'セピア': '#704214', 'マホガニー': '#C04000', '朽葉': '#D4955B',
  '黄土': '#D4A017', 'バフ': '#F0DC82', 'キャメル': '#C19A6B',
  'チョコレート': '#D2691E', '銅色': '#B87333', 'ブロンズ': '#CD7F32',
  'クルミ': '#855E42', 'ブラウン': '#A52A2A', 'タウプ': '#483C32',
  'サンド': '#C2B280', 'ウォームグレー': '#999080', 'バンブー': '#DAC17A',
  '錆色': '#8E402A', '朱': '#E55B3C', 'ストーングレー': '#928E85',
};
const SHAPE_MAP     = { '丸': 'round', '四角': 'square', '雲': 'cloud', '棘': 'spike', 'ハート': 'heart', '思考': 'thought', '叫び': 'shout', '星': 'star-shape', '六角': 'hex', '爆裂': 'burst', '楕円': 'oval', '横長': 'wide' };
const DECO_MAP      = { '光る': 'glow', 'グロー': 'glow', '虹': 'rainbow', 'レインボー': 'rainbow', '点線': 'dotted', '炎': 'fire', '金': 'gold', '二重': 'double', '点滅': 'blink', '緑': 'glow-green', 'なし': '', 'リセット': '' };
const EFFECT_TYPES  = { '花火': 'hanabi', '紙吹雪': 'confetti', '流れ星': 'star', 'ハートシャワー': 'hearts', '桜': 'sakura', '雪': 'snow', '爆発': 'explosion', '泡': 'bubbles', '稲妻': 'lightning' };
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

// フォントエイリアス（スペースを含むフォント名の短縮形 + 日本語ショートカット）
const FONT_MAP = {
  'デフォルト': '', 'リセット': '',
  // ── 日本語短縮エイリアス ──
  'ゴシック':        '"MS Gothic"',
  'Pゴシック':       '"MS PGothic"',
  '明朝':            '"MS Mincho"',
  'P明朝':           '"MS PMincho"',
  'メイリオ':        'Meiryo',
  '游ゴシック':      '"Yu Gothic"',
  '游明朝':          '"Yu Mincho"',
  '教科書体':        '"UD Digi Kyokasho N"',
  'ノトサンズ':      '"Noto Sans JP"',
  'ノトセリフ':      '"Noto Serif JP"',
  'デラゴシック':    '"Dela Gothic One"',
  // ── 日本語ゴシック ──
  'MSゴシック':      '"MS Gothic"',
  'MSPゴシック':     '"MS PGothic"',
  'MSUIゴシック':    '"MS UI Gothic"',
  'BIZUDゴシック':   '"BIZ UDGothic"',
  'BIZUDPゴシック':  '"BIZ UDPGothic"',
  // ── 日本語明朝 ──
  'MS明朝':         '"MS Mincho"',
  'MSP明朝':        '"MS PMincho"',
  'BIZUDMincho':    '"BIZ UDMincho Medium"',
  'BIZUDPMincho':   '"BIZ UDPMincho Medium"',
  // ── 游フォント ──
  'YuGothic':       '"Yu Gothic"',
  'YuGothicLight':  '"Yu Gothic Light"',
  'YuGothicMedium': '"Yu Gothic Medium"',
  'YuGothicUI':     '"Yu Gothic UI"',
  'YuMincho':       '"Yu Mincho"',
  'YuMinchoLight':  '"Yu Mincho Light"',
  'YuMinchoDemi':   '"Yu Mincho Demibold"',
  // ── UD教科書体 ──
  'UDデジタルN':    '"UD Digi Kyokasho N"',
  'UDデジタルNK':   '"UD Digi Kyokasho NK"',
  'UDデジタルNP':   '"UD Digi Kyokasho NP"',
  // ── Noto ──
  'NotoSansJP':      '"Noto Sans JP"',
  'NotoSansJPBlack': '"Noto Sans JP Black"',
  'NotoSansJPLight': '"Noto Sans JP Light"',
  'NotoSerifJP':     '"Noto Serif JP"',
  'NotoSerifJPBlack':'"Noto Serif JP Black"',
  // ── その他日本語 ──
  'DelaGothicOne':  '"Dela Gothic One"',
  'MeiriyoUI':      '"Meiryo UI"',
  'MeirioUI':       '"Meiryo UI"',
  // ── フリーフォント（日本語） ──
  '851POP':          '"851MkPOP"',
  'くるんデコ':      '"27_kurundeco"',
  'おまつり':        'omatsuri',
  'かずき':          'KazukiReiwa',
  'かずきライト':    '"KazukiReiwa Light"',
  'KazukiReiwaLight':'"KazukiReiwa Light"',
  '鉄瓶ゴシック':   '"07TetsubinGothic"',
  'ホラー明朝':      '"07ReallyScaryMinchotai"',
  'みつばち':        'mitubachi',
  '源界明朝':        'Genkaimincho',
  '蒼空明朝':        'SoukouMincho',
  'またたき明朝':    'MatatakinoMincho',
  '書楽宴':          '"ShokakiUtage-FreeVer."',
  'すし器':          'sushiki',
  'すし器かな':      'sushiki_kana_UB',
  'MOBO':            '"MOBO-ExtraLight"',
  'コトノル':        '"Kotonoru Muryou-Shiyou Kw-N Black"',
  'SmartFont':       '"SmartFont UI"',
  '美しい明朝':      '"02UtsukushiMincho"',
  // 黒薔薇ゴシック
  '黒薔薇':         '"kurobara gothic bold"',
  '黒薔薇ブラック': '"kurobara gothic black"',
  '黒薔薇ヘビー':   '"kurobara gothic heavy"',
  '黒薔薇シン':     '"kurobara gothic thin"',
  'KurobaraBlack':  '"kurobara gothic black"',
  'KurobaraBold':   '"kurobara gothic bold"',
  'KurobaraHeavy':  '"kurobara gothic heavy"',
  'KurobaraThin':   '"kurobara gothic thin"',
  // fontopo
  'fontopoBOKU':    '"fontopoBOKU"',
  'fontopoKEISEN':  '"fontopoKEISEN"',
  'fontopoSOLID':   '"fontopoSOLID"',
  'ORIENTAL':       '"FontopoORIENTAL"',
  'NIKUKYU':        '"FontopoNIKUKYU"',
  // ── 英語フォント ──
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
  saveSettingsToServer();
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

// ── サーバー側永続化ヘルパー ─────────────────────────────────────────
function _loadServerSync(url) {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false); // 同期（localhost専用）
    xhr.send();
    if (xhr.status === 200) return JSON.parse(xhr.responseText);
  } catch {}
  return {};
}
function _saveServer(url, data) {
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).catch(() => {});
}

// 管理パネル設定をサーバーから取得してlocalStorageに先行反映
(function preloadServerSettings() {
  const s = _loadServerSync('/api/settings');
  Object.entries(s).forEach(([k, v]) => { if (v != null) localStorage.setItem(k, v); });
})();

let _charSaveData = _loadServerSync('/api/char-save');

const SETTINGS_KEYS = [
  'charSizeScale','bossSizeScale','moveArea','bossHpScale','bossAtkCoeff','bossCounterRate',
  'brHpMult','taimanHpMult','nikoFontSize','nikoOpacity','hayaoshiFreq','hayaoshiSpeed',
  'slotProbs','slotSoundEnabled','seVolume','voiceVolume',
  'aiModel','aiSystem','wordleDisplayRows','wordleCellSize','charFontSizes',
  'bgColor','bgImageUrl','taimanDefeatCommand','taimanCharScale',
  'slotMpJackpot','slotMpDiamond','slotMpStar','slotMpBell','slotMpCherry',
  'rankingPanelX','rankingPanelY','mpRankingPanelX','mpRankingPanelY',
  'wordlePanelX','wordlePanelY','quizPanelX','quizPanelY',
  'brTimerPanelX','brTimerPanelY','trashX','trashY',
  'bossX','bossY',
  'gatherMarginLeft','gatherMarginRight',
];
let _settingsSaveTimer = null;
function saveSettingsToServer() {
  clearTimeout(_settingsSaveTimer);
  _settingsSaveTimer = setTimeout(() => {
    const data = {};
    SETTINGS_KEYS.forEach(k => { const v = localStorage.getItem(k); if (v !== null) data[k] = v; });
    _saveServer('/api/settings', data);
  }, 2000);
}

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
let charFontSizes = JSON.parse(localStorage.getItem('charFontSizes') || 'null') || { name:11, stats:10, lv:9, title:9, bubble:13 };

function applyCharFontSizes() {
  const r = document.documentElement.style;
  r.setProperty('--fs-char-name',  charFontSizes.name   + 'px');
  r.setProperty('--fs-char-stats', charFontSizes.stats  + 'px');
  r.setProperty('--fs-char-lv',    charFontSizes.lv     + 'px');
  r.setProperty('--fs-title-tag',  charFontSizes.title  + 'px');
  r.setProperty('--fs-bubble',     charFontSizes.bubble + 'px');
}
applyCharFontSizes();
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
  // スピキボスは攻撃されるたびdrag音をランダム再生
  if (bossState?.isSpiki && dragSounds.length) {
    playLocalSound('/sound/drag/' + encodeURIComponent(dragSounds[Math.floor(Math.random() * dragSounds.length)]));
    return;
  }
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
const SOUND_SLOT_START     = '/sound/slot/'    + encodeURIComponent('start.wav');
const SOUND_SLOT_STOP      = '/sound/slot/'    + encodeURIComponent('カーソル移動2.mp3');
const SOUND_SLOT_MISS      = '/sound/slot/'    + encodeURIComponent('ビープ音4.mp3');
const SOUND_SLOT_CHERRY    = '/sound/slot/'    + encodeURIComponent('決定ボタンを押す26.mp3');
const SOUND_SLOT_PIRORI    = '/sound/slot/'    + encodeURIComponent('nc129326_ピロピロピロピロ.mp3');
const SOUND_SLOT_777       = '/sound/slot/'    + encodeURIComponent('777.mp3');
const SOUND_RACE_FANFARE   = '/sound/keiba/'  + encodeURIComponent('nc269405_中山競馬場_ファンファーレ（歓声Ver02）_トゥール.wav');
const SOUND_RACE_COUNTDOWN = '/sound/keiba/'  + encodeURIComponent('決定ボタンを押す1.mp3');
const SOUND_RACE_GATE      = '/sound/keiba/'  + encodeURIComponent('競馬のゲートが開く.mp3');
const SOUND_RACE_HORSE     = [
  '/sound/keiba/' + encodeURIComponent('nc133589_【効果音ラボ】馬が走る2.mp3'),
  '/sound/keiba/' + encodeURIComponent('nc154228_【効果音】馬が走る音.mp3'),
];
const SOUND_RACE_WIN       = '/sound/keiba/'  + encodeURIComponent('おめでとう.mp3');
const SOUND_RACE_CROWD     = '/sound/keiba/'  + encodeURIComponent('nc13275_歓声.mp3');

let _raceFanfareAudio = null;
function startRaceFanfare() {
  stopRaceFanfare();
  if (compactMode) return;
  try {
    _raceFanfareAudio = new Audio(SOUND_RACE_FANFARE);
    _raceFanfareAudio.volume = Math.min(1, 0.7 * seVolume);
    _raceFanfareAudio.loop = true;
    _raceFanfareAudio.play().catch(() => {});
  } catch {}
}
function stopRaceFanfare() {
  if (_raceFanfareAudio) {
    _raceFanfareAudio.pause();
    _raceFanfareAudio.src = '';
    _raceFanfareAudio = null;
  }
}

let charImages   = loadCharImages();
let charAliases  = loadCharAliases();
let slotPage     = 0;
const SLOT_SIZE  = 20;

function loadCharImages()  { return _loadServerSync('/api/char-images');  }
function saveCharImages()  { _saveServer('/api/char-images', charImages);  }
function loadCharAliases() { return _loadServerSync('/api/char-aliases'); }
function saveCharAliases() { _saveServer('/api/char-aliases', charAliases); }
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

const CHAR_SAVE_FIELDS = [
  'level','exp','hp','maxHp','mp','equips','pet','pet2',
  'titles','activeTitle','totalDmgDealt','deaths','wordleWins','hayaoshiWins',
  'commentCount','tc','sizeScale','flipped','lastTaimanAt','charDef',
  'name','nameManual',
  'textColor','bubbleShape','bubbleDeco','bubbleBgColor','font',
  'charImage',
];

function getUser(ipid) {
  if (!users[ipid]) {
    users[ipid] = {
      ipid,
      name:        pickRandomName(ipid),
      charDef:     null,
      textColor:     '#111111',
      bubbleShape:   'round',
      bubbleDeco:    '',
      bubbleBgColor: '',
      movement:    '止まれ',
      motion:      null,
      nameManual:  false,
      size:        80,
      sizeScale:   1.0,
      font:        '',
      x: randX({ size: 80 }),
      y: Math.max(0, stage.clientHeight - Math.round(80 * 1.5 * charSizeScale + 58) - 10),
      el:          null,
      exp:            0,
      level:          1,
      hp:             30,
      maxHp:          30,
      mp:             50,
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
    // セーブデータがあれば上書き復元
    const saved = _charSaveData[ipid];
    if (saved) {
      CHAR_SAVE_FIELDS.forEach(k => { if (saved[k] !== undefined) users[ipid][k] = saved[k]; });
      users[ipid].sizeScale = 1.0; // タイマン中リロード時の異常値を起動時にリセット
      // 外見データが保存済みならランダム初期化をスキップ
      if (['textColor','bubbleShape','bubbleDeco','bubbleBgColor','font','charImage'].some(k => saved[k] !== undefined)) {
        users[ipid].firstAppear = false;
      }
    }
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
  if (user.el) {
    return;
  }
  if (!user.charDef) {
    const used = getUsedCharIds(user);
    const allIds = Object.keys(charImages).map(Number).filter(id => id >= 1 && id <= 500 && !charExcludeIds.has(id));
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

  // AFK/放置状態の復元
  if (user.afk || user.afkText) {
    if (user.afkEl) user.afkEl.remove();
    const afkEl = document.createElement('div');
    afkEl.className = 'afk-bubble';
    afkEl.textContent = '💤 ' + (user.afkText || 'AFK');
    el.appendChild(afkEl);
    user.afkEl = afkEl;
    el.classList.add('char-afk');
  }

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

  setTimeout(() => gatherCharactersBottom(), 500);
}

function applyAvatarStyle(user) {
  const a = document.getElementById('a-' + user.ipid);
  if (!a || !user.charDef) return;
  const px = Math.round(user.size * 1.5 * charSizeScale * (user.sizeScale || 1) * (user.brWinnerScale || 1));
  a.style.width  = px + 'px';
  a.style.height = px + 'px';
  a.style.transform = '';
  const imgFile = user.charImage || charImages[user.charDef.id] || 'kisyokeee.png';
  a.innerHTML      = `<img src="/chara/${encodeURIComponent(imgFile)}" alt="${escapeHtml(user.name)}">`;
  a.style.fontSize = '0';
  const img = a.querySelector('img');
  if (img) {
    const adjustSize = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        const r = img.naturalWidth / img.naturalHeight;
        const sqr = Math.sqrt(r);
        a.style.width  = Math.round(px * sqr) + 'px';
        a.style.height = Math.round(px / sqr) + 'px';
      }
    };
    if (img.complete) adjustSize();
    else img.addEventListener('load', adjustSize, { once: true });
  }
  applyFacingFlip(user);
}

function isUserFlipped(user) {
  if (user._taimanFlip) return true;
  return (!!user.facingRight) !== (!!user.flipped);
}

function applyFacingFlip(user) {
  const a = document.getElementById('a-' + user.ipid);
  if (!a) return;
  const img = a.querySelector('img');
  if (!img) return;
  const flip = isUserFlipped(user);
  img.style.transform = flip ? 'scaleX(-1)' : '';
  // ペット画像も同様に反転
  ['p-', 'p2-'].forEach(prefix => {
    const petImg = document.getElementById(prefix + user.ipid)?.querySelector('img');
    if (petImg) petImg.style.transform = flip ? 'scaleX(-1)' : '';
  });
}

function renderPetBadge(user) {
  const petSize = Math.max(20, Math.round(user.size * 0.75 * charSizeScale * (user.sizeScale || 1) * (user.brWinnerScale || 1)));
  const flipCss = isUserFlipped(user) ? 'transform:scaleX(-1);' : '';
  const slot = document.getElementById('p-' + user.ipid);
  if (slot) {
    if (!user.pet) { slot.className = 'char-pet'; slot.innerHTML = ''; }
    else {
      slot.className = `char-pet ${user.pet.rarityCls || ''}`;
      slot.innerHTML = `<img src="/chara/${encodeURIComponent(user.pet.img)}" alt="pet" style="width:${petSize}px;height:${petSize}px;object-fit:contain;${flipCss}" title="${escapeHtml(user.pet.abilityName)}: ${escapeHtml(user.pet.abilityDesc)}">`;
    }
  }
  const slot2 = document.getElementById('p2-' + user.ipid);
  if (slot2) {
    if (!user.pet2) { slot2.className = 'char-pet2'; slot2.innerHTML = ''; }
    else {
      slot2.className = `char-pet2 ${user.pet2.rarityCls || ''}`;
      slot2.innerHTML = `<img src="/chara/${encodeURIComponent(user.pet2.img)}" alt="pet2" style="width:${petSize}px;height:${petSize}px;object-fit:contain;${flipCss}" title="${escapeHtml(user.pet2.abilityName)}: ${escapeHtml(user.pet2.abilityDesc)}">`;
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
    const oldX = user.x;
    user.x = randX(user);
    user.y = randY(user);
    if (user.el) {
      user.el.style.transition = `left ${duration}ms ease-in-out, top ${duration}ms ease-in-out`;
      user.el.style.left = user.x + 'px';
      user.el.style.top  = user.y + 'px';
      user.facingRight = user.x > oldX;
      applyFacingFlip(user);
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
  user.facingRight = dir > 0;
  applyFacingFlip(user);
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

const MOTION_CLASSES = ['bouncing', 'spinning', 'trembling', 'wavy', 'floating', 'swaying', 'pulsing', 'skipping', 'drunk'];

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

  const ROW_MAX = 10;
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
    const rowH  = rowHeights[ri];
    const n     = row.length;
    const step  = n > 1 ? Math.min(cw(row[0]) + GAP, (stageW - 40) / n) : 0;
    const rowW  = step * (n - 1) + cw(row[0]);
    const startX = Math.max(10, (stageW - rowW) / 2);
    const clampedY = Math.max(20, Math.min(stageH - rowH, y));

    row.forEach((u, i) => {
      u.x = Math.round(startX + step * i);
      u.y = clampedY;
      u.el.style.transition = 'left 600ms cubic-bezier(0.34,1.56,0.64,1), top 600ms cubic-bezier(0.34,1.56,0.64,1)';
      u.el.style.left = u.x + 'px';
      u.el.style.top  = u.y + 'px';
    });

    y += rowH + ROW_GAP;
  });
}

function gatherCharactersBottom() {
  const onStage = Object.values(users).filter(u => u.el);
  if (onStage.length === 0) return;
  const stageW     = stage.clientWidth;
  const stageH     = stage.clientHeight;
  const marginL    = gatherMarginLeft;
  const marginR    = gatherMarginRight;
  const effectiveW = Math.max(100, stageW - marginL - marginR);
  const charW = u => u.el ? (u.el.offsetWidth  || Math.round(u.size * 1.5 * charSizeScale)) : Math.round(u.size * 1.5 * charSizeScale);
  const charH = u => u.el ? (u.el.offsetHeight || (Math.round(u.size * 1.5 * charSizeScale) + 48)) : (Math.round(u.size * 1.5 * charSizeScale) + 48);
  const n     = onStage.length;

  // 均等ステップで1行配置。キャラが多くても折り返さず均等に重なる
  const step   = n > 1 ? effectiveW / n : 0;
  const startX = marginL + (effectiveW - (step * (n - 1) + charW(onStage[0]))) / 2;

  onStage.forEach((u, i) => {
    u.x = Math.round(startX + step * i);
    u.y = Math.max(20, Math.min(stageH - charH(u), stageH - charH(u) - 10));
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

  // MPランキングパネル
  const mpRankingPanel = document.getElementById('mpRankingPanel');
  if (mpRankingPanel) mpRankingPanel.style.display = on ? 'none' : '';

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
  if (user.bubbleBgColor) b.style.setProperty('--bubble-bg', user.bubbleBgColor);
  else b.style.removeProperty('--bubble-bg');
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
  if (user.bubbleBgColor) b.style.setProperty('--bubble-bg', user.bubbleBgColor);
  else b.style.removeProperty('--bubble-bg');
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
  if (user.bubbleBgColor) b.style.setProperty('--bubble-bg', user.bubbleBgColor);
  else b.style.removeProperty('--bubble-bg');
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
  if (type === 'hanabi')    spawnFireworks(x, y);
  if (type === 'confetti')  spawnConfetti();
  if (type === 'star')      spawnShootingStar();
  if (type === 'hearts')    spawnHeartShower(x, y);
  if (type === 'sakura')    spawnSakura(x, y);
  if (type === 'snow')      spawnSnow();
  if (type === 'explosion') spawnExplosion(x, y);
  if (type === 'bubbles')   spawnBubbles(x, y);
  if (type === 'lightning') spawnLightning(x, y);
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

function spawnConfettiSmall(n) {
  if (compactMode) return;
  const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c77dff','#ff9a3c','#ffffff','#ffb347'];
  for (let i = 0; i < (n || 10); i++) {
    const p = document.createElement('div');
    const w = 5 + Math.random()*7, h = 8 + Math.random()*6;
    p.style.cssText = `position:absolute;left:${Math.random()*stage.clientWidth}px;top:-${h}px;width:${w}px;height:${h}px;background:${colors[Math.floor(Math.random()*colors.length)]};z-index:60;pointer-events:none;border-radius:2px;`;
    stage.appendChild(p);
    const rot = Math.random() * 360;
    const drift = (Math.random() - 0.5) * 120;
    p.animate([
      { transform: `rotate(${rot}deg) translateX(0)`, opacity: 1 },
      { transform: `rotate(${rot+270}deg) translateX(${drift}px) translateY(${stage.clientHeight+20}px)`, opacity: 0.6 },
    ], { duration: 2200 + Math.random()*1200, easing: 'linear', fill: 'forwards' }).onfinish = () => p.remove();
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

function spawnSakura(cx, cy) {
  if (compactMode) return;
  const petals = ['🌸','🌺','🌼'];
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      const ox = (Math.random() - 0.5) * 200;
      p.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;font-size:${12+Math.random()*14}px;z-index:60;pointer-events:none;user-select:none;`;
      p.textContent = petals[Math.floor(Math.random()*petals.length)];
      stage.appendChild(p);
      const drift = (Math.random() - 0.5) * 80;
      p.animate([
        { transform: `translate(calc(-50% + ${ox}px),-50%) rotate(0deg)`, opacity: 1 },
        { transform: `translate(calc(-50% + ${ox+drift}px),calc(-50% + ${80+Math.random()*80}px)) rotate(${Math.random()*360}deg)`, opacity: 0 },
      ], { duration: 1500 + Math.random()*800, easing: 'ease-out', fill: 'forwards' }).onfinish = () => p.remove();
    }, i * 60);
  }
}

function spawnSnow() {
  if (compactMode) return;
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      const size = 5 + Math.random() * 8;
      p.style.cssText = `position:absolute;left:${Math.random()*stage.clientWidth}px;top:-${size}px;width:${size}px;height:${size}px;background:rgba(255,255,255,0.9);border-radius:50%;z-index:60;pointer-events:none;`;
      stage.appendChild(p);
      const drift = (Math.random() - 0.5) * 100;
      p.animate([
        { transform: 'translateX(0)', opacity: 1 },
        { transform: `translate(${drift}px,${stage.clientHeight+20}px)`, opacity: 0.5 },
      ], { duration: 2500 + Math.random()*1500, easing: 'linear', fill: 'forwards' }).onfinish = () => p.remove();
    }, i * 40);
  }
}

function spawnExplosion(cx, cy) {
  if (compactMode) return;
  const colors = ['#ff6600','#ff9900','#ffcc00','#ffffff','#ff3300'];
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div');
    const size = 8 + Math.random() * 14;
    p.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;border-radius:50%;background:${colors[i%colors.length]};z-index:60;pointer-events:none;`;
    stage.appendChild(p);
    const angle = (i / 24) * Math.PI * 2;
    const dist = 80 + Math.random() * 100;
    p.animate([
      { transform: 'translate(-50%,-50%) scale(1.5)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`, opacity: 0 },
    ], { duration: 500 + Math.random()*300, easing: 'ease-out', fill: 'forwards' }).onfinish = () => p.remove();
  }
}

function spawnBubbles(cx, cy) {
  if (compactMode) return;
  for (let i = 0; i < 16; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      const size = 10 + Math.random() * 20;
      const ox = (Math.random() - 0.5) * 100;
      p.style.cssText = `position:absolute;left:${cx+ox}px;top:${cy}px;width:${size}px;height:${size}px;border-radius:50%;background:rgba(173,216,230,0.45);border:1.5px solid rgba(135,206,235,0.8);z-index:60;pointer-events:none;`;
      stage.appendChild(p);
      p.animate([
        { transform: 'translate(-50%,-50%) scale(0.5)', opacity: 0.9 },
        { transform: `translate(calc(-50% + ${(Math.random()-0.5)*40}px),calc(-50% - ${80+Math.random()*80}px)) scale(1)`, opacity: 0 },
      ], { duration: 1200 + Math.random()*800, easing: 'ease-out', fill: 'forwards' }).onfinish = () => p.remove();
    }, i * 80);
  }
}

function spawnLightning(cx, cy) {
  if (compactMode) return;
  const bolt = document.createElement('div');
  bolt.style.cssText = `position:absolute;left:${cx}px;top:0;width:4px;height:${cy}px;background:linear-gradient(180deg,#fff 0%,#faff00 40%,transparent 100%);z-index:60;pointer-events:none;border-radius:2px;box-shadow:0 0 10px 4px rgba(255,255,100,0.7);transform:translateX(-50%);`;
  stage.appendChild(bolt);
  bolt.animate([
    { opacity: 1, transform: 'translateX(-50%) scaleX(1)' },
    { opacity: 0.6, transform: 'translateX(-50%) scaleX(2)' },
    { opacity: 0, transform: 'translateX(-50%) scaleX(0.5)' },
  ], { duration: 400, easing: 'ease-in', fill: 'forwards' }).onfinish = () => bolt.remove();
  const flash = document.createElement('div');
  flash.style.cssText = `position:absolute;left:${cx-50}px;top:${cy-50}px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,150,0.85) 0%,transparent 70%);z-index:61;pointer-events:none;`;
  stage.appendChild(flash);
  flash.animate([{ opacity: 1 },{ opacity: 0 }], { duration: 350, fill: 'forwards' }).onfinish = () => flash.remove();
}

// ──────────────────────────────────────────────────────────────────
// ボス討伐・育成
// ──────────────────────────────────────────────────────────────────
let bossState = null;
let bossManuallyCleared = false;
let brState   = null; // バトルロイヤル状態 // 消去ボタン押下後は自動召喚しない
let taimanState = null; // タイマン状態
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
let taimanHpMult   = 10;   // タイマン仮想HP倍率
let taimanDefeatCommand = localStorage.getItem('taimanDefeatCommand') || '';
let taimanCharScale     = parseFloat(localStorage.getItem('taimanCharScale') || '4');
let nikoFontSize  = 40;  // 早押しコメント文字サイズ(px)
let nikoOpacity   = 1.0; // 早押しコメント透明度（0〜1）
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
let brAutoEnabled = true;        // 自動バトルロイヤル有効フラグ
let bombHidden   = false;        // 爆弾ボタン非表示
let trashHidden  = false;        // ゴミ箱非表示
let slotSoundEnabled = true;    // スロット効果音ON/OFF
// TTS設定
let seVolume      = 1.0;  // 効果音マスター音量
let voiceVolume   = 1.0;  // ボイスコメント音量
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
let sdPositiveSuffix = 'masterpiece, best quality';
let sdNegative       = '(worst quality:2),(low quality:2),(normal quality:2),lowres,extra fingers,fewer fingers,monochrome,grayscale,text,watermark,logo,';
let sdDisplayTime    = 10;
let sdMosaicKeywords = '';
let sdMosaicBlock    = 20;
let charExcludeIds   = new Set();
let kaiBullets    = [];          // 射コマンド物理弾リスト
let kaiAnimId     = null;        // 射物理ループ requestAnimationFrame ID
let kaiSpeed      = 18;          // 射出強さ
let kaiRestitution = 0.65;       // 反発係数
let kaiGravity    = 0.35;        // 重力加速度
let kaiBulletSize = 32;          // 弾文字サイズ(px)
let bossDamageMap = {};          // ipid → { name, totalDmg }
let rankingState       = null;
let rankingDragState   = null;
let mpRankingState     = null;
let mpRankingDragState = null;
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
  s.textContent = `HP:${hp.toLocaleString()}/${mhp.toLocaleString()}  MP:${mp}  ATK:${atk}  EXP:${expToNext}`;
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
      if (winner.el) {
        delete winner.brWinnerScale;
        applyAvatarStyle(winner);
        renderPetBadge(winner);
      }
      // .avatar の transition: width/height 0.3s 完了後に下集合
      setTimeout(() => gatherCharactersBottom(), 400);
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

// ── タイマン ────────────────────────────────────────────────────────
function startTaiman(challenger, target) {
  if (taimanState) return;
  if (brState?.active) return;
  if (raceState) return;
  if (!challenger.el || !target.el) return;
  if (challenger.ko || target.ko) return;

  const sw = stage.clientWidth;
  const sh = stage.clientHeight;

  // 全キャラの移動を止め、戦闘員以外を縮小
  const savedSizeScales = {};
  Object.values(users).forEach(u => {
    savedSizeScales[u.ipid] = u.sizeScale || 1;
    if (u.moveTimer) { clearTimeout(u.moveTimer); u.moveTimer = null; }
    if (u.walkTimer) { clearTimeout(u.walkTimer); u.walkTimer = null; }
    if (u.ipid !== challenger.ipid && u.ipid !== target.ipid && u.el) {
      u.sizeScale = 0.5;
      applyAvatarStyle(u);
      renderPetBadge(u);
    }
  });

  // 観客を画面の左端・右端に退かす
  const bystanders = Object.values(users).filter(u =>
    u.el && u.ipid !== challenger.ipid && u.ipid !== target.ipid
  );
  const half = Math.ceil(bystanders.length / 2);
  bystanders.forEach((u, i) => {
    const szPx = Math.round(u.size * 1.5 * charSizeScale * 0.5);
    const isLeft = i < half;
    const idx    = isLeft ? i : i - half;
    const nx = isLeft
      ? Math.max(0, idx * (szPx + 3))
      : Math.min(sw - szPx, sw - szPx - idx * (szPx + 3));
    const ny = Math.max(0, sh - szPx - 10);
    u.x = nx; u.y = ny;
    u.el.style.transition = 'left 0.7s ease-in-out, top 0.7s ease-in-out';
    u.el.style.left = nx + 'px';
    u.el.style.top  = ny + 'px';
    setTimeout(() => { if (u.el) u.el.style.transition = ''; }, 800);
  });

  // 戦闘員を拡大
  challenger.sizeScale = taimanCharScale;
  target.sizeScale = taimanCharScale;
  applyAvatarStyle(challenger);
  applyAvatarStyle(target);
  renderPetBadge(challenger);
  renderPetBadge(target);

  // 左右に配置
  const charSize = Math.round(challenger.size * 1.5 * charSizeScale * taimanCharScale);
  const gap    = 100;
  const leftX  = Math.max(0, Math.round(sw / 2 - charSize - gap / 2));
  const rightX = Math.max(0, Math.min(sw - charSize, Math.round(sw / 2 + gap / 2)));
  const midY   = Math.max(0, Math.min(sh - charSize, Math.round(sh * 0.42 - charSize / 2)));

  challenger.x = leftX;  challenger.y = midY;
  target.x     = rightX; target.y     = midY;

  [challenger, target].forEach(u => {
    u.el.style.transition = 'left 0.6s ease-in-out, top 0.6s ease-in-out';
    u.el.style.left = u.x + 'px';
    u.el.style.top  = u.y + 'px';
    setTimeout(() => { if (u.el) u.el.style.transition = ''; }, 700);
  });

  // 左のキャラ（挑戦者）を水平反転
  challenger._taimanFlip = true;
  applyFacingFlip(challenger);

  // HP を 元の最大HP × taimanHpMult × キャラレベル に設定
  const cMax = calcMaxHp(challenger) * taimanHpMult * (challenger.level || 1);
  const tMax = calcMaxHp(target)     * taimanHpMult * (target.level     || 1);

  taimanState = {
    active: true,
    challenger: challenger.ipid,
    target: target.ipid,
    turn: 'challenger',
    hp:    { [challenger.ipid]: cMax, [target.ipid]: tMax },
    maxHp: { [challenger.ipid]: cMax, [target.ipid]: tMax },
    savedSizeScales,
    savedHp: {
      [challenger.ipid]: challenger.hp ?? 30,
      [target.ipid]:     target.hp ?? 30,
    },
    attackTimer: null,
    interval: 1200,
  };

  updateStatsDisplay(challenger);
  updateStatsDisplay(target);
  renderTaimanHpBars();
  showTaimanIntroBanner(challenger, target);
  addToLog(challenger, `⚔️ タイマン：${challenger.name} vs ${target.name}`, '#ef4444');

  taimanState.attackTimer = setTimeout(() => taimanDoAttack(), 3200);
}

function renderTaimanHpBars() {
  const prev = document.getElementById('taimanHpBars');
  if (prev) prev.remove();
  if (!taimanState) return;
  const c = users[taimanState.challenger];
  const t = users[taimanState.target];
  if (!c || !t) return;
  const cHp  = taimanState.hp[taimanState.challenger];
  const tHp  = taimanState.hp[taimanState.target];
  const cMax = taimanState.maxHp[taimanState.challenger];
  const tMax = taimanState.maxHp[taimanState.target];
  const el = document.createElement('div');
  el.id = 'taimanHpBars';
  el.className = 'taiman-hp-bars';
  el.innerHTML = `
    <div class="taiman-hp-side">
      <div class="taiman-fighter-name">${escapeHtml(c.name)}</div>
      <div class="taiman-hp-track">
        <div class="taiman-hp-fill taiman-hp-fill-left" style="width:${Math.max(0, cHp / cMax * 100).toFixed(1)}%"></div>
      </div>
      <div class="taiman-hp-text">${cHp.toLocaleString()} / ${cMax.toLocaleString()}</div>
    </div>
    <div class="taiman-vs-label">⚔️ VS ⚔️</div>
    <div class="taiman-hp-side">
      <div class="taiman-fighter-name">${escapeHtml(t.name)}</div>
      <div class="taiman-hp-track">
        <div class="taiman-hp-fill taiman-hp-fill-right" style="width:${Math.max(0, tHp / tMax * 100).toFixed(1)}%"></div>
      </div>
      <div class="taiman-hp-text">${tHp.toLocaleString()} / ${tMax.toLocaleString()}</div>
    </div>
  `;
  stage.appendChild(el);
}

function showTaimanIntroBanner(challenger, target) {
  const el = document.createElement('div');
  el.className = 'taiman-intro-banner';
  el.innerHTML = `
    <div class="taiman-intro-title">⚔️ タイマン ⚔️</div>
    <div class="taiman-intro-names">
      <span class="taiman-intro-name">${escapeHtml(challenger.name)}</span>
      <span class="taiman-intro-vs">VS</span>
      <span class="taiman-intro-name">${escapeHtml(target.name)}</span>
    </div>
  `;
  stage.appendChild(el);
  setTimeout(() => el.remove(), 3000);
  playLocalSound(SOUND_RACE_FANFARE);
}

function taimanDoAttack() {
  if (!taimanState?.active) return;
  const attackerId = taimanState.turn === 'challenger' ? taimanState.challenger : taimanState.target;
  const defenderId = taimanState.turn === 'challenger' ? taimanState.target     : taimanState.challenger;
  const attacker = users[attackerId];
  const defender = users[defenderId];
  if (!attacker?.el || !defender?.el) { endTaiman(null, null); return; }

  const atk       = calcAtk(attacker);
  const titleBon  = typeof getTitleBonuses === 'function' ? getTitleBonuses(attacker) : { dmgM: 1, crit: 0 };
  const petId     = attacker.pet?.abilityId;
  const petId2    = attacker.pet2?.abilityId;
  const critBonus = (petId  === 'scout' ? 0.05 : petId  === 'crit_up' ? 0.20 : 0)
                  + (petId2 === 'scout' ? 0.05 : petId2 === 'crit_up' ? 0.20 : 0);
  const isCrit    = Math.random() < (0.15 + critBonus + (titleBon.crit || 0));
  const hayaMult  = attacker.hayaoshiBuff ? 1.5 : 1;
  attacker.hayaoshiBuff = false;
  let dmg = Math.round((isCrit
    ? Math.max(1, atk * (2 + Math.floor(Math.random() * 3)) * 2)
    : Math.max(1, atk * (1 + Math.floor(Math.random() * 3)))) * hayaMult * (titleBon.dmgM || 1));
  // 防御側ペット: guard(-1), barrier(20%で-3)
  const defPetId  = defender.pet?.abilityId;
  const defPetId2 = defender.pet2?.abilityId;
  if (defPetId  === 'guard')                        dmg = Math.max(0, dmg - 1);
  if (defPetId2 === 'guard')                        dmg = Math.max(0, dmg - 1);
  if (defPetId  === 'barrier' && Math.random() < 0.20) dmg = Math.max(0, dmg - 3);
  if (defPetId2 === 'barrier' && Math.random() < 0.20) dmg = Math.max(0, dmg - 3);

  rushToChar(attacker, defender);

  // ── ペット攻撃エフェクト（ボス戦と同じ突進モーション）──────────────
  const PET_HIT_MAP = { extra_hit:1, double_hit:2, triple_hit:3, quad_hit:4, storm:5,
                        chain:1, regen:1, hp_steal:1, soul_steal:1, full_drain:1,
                        team_heal:1, poison:1, burn:1, charge:1, avenger:1, berserk:1, godhand:1, omega:1 };
  [[attacker.pet, 'p-' + attacker.ipid], [attacker.pet2, 'p2-' + attacker.ipid]]
    .forEach(([pet, elId], pi) => {
      if (!pet) return;
      const aid  = pet.abilityId;
      const base = Math.max(1, Math.round(calcAtk(attacker) * 0.25));
      let mult = 1;
      if (aid === 'avenger' && (attacker.hp ?? 30) < (attacker.maxHp ?? 30) * 0.5) mult = 1.5;
      if (aid === 'berserk' && (attacker.hp ?? 30) < (attacker.maxHp ?? 30) * 0.3) mult = 3;
      if (aid === 'godhand' && Math.random() < 0.05) mult = 20;
      if (aid === 'charge') { pet._chargeCount = (pet._chargeCount || 0) + 1; if (pet._chargeCount % 2 !== 0) return; mult = 2; }
      let hits = PET_HIT_MAP[aid] ?? 1;
      if (aid === 'cheer') hits = Math.random() < 0.10 ? 1 : 0;
      if (aid === 'chain') hits = Math.random() < 0.35 ? 2 : 1;
      if (hits === 0) return;
      const petDmg = Math.max(1, Math.round(base * mult));
      for (let i = 0; i < hits; i++) {
        setTimeout(() => {
          if (!taimanState?.active) return;
          rushPetToChar(attacker, elId, defender);
          setTimeout(() => {
            if (!taimanState?.active) return;
            taimanState.hp[defenderId] = Math.max(0, taimanState.hp[defenderId] - petDmg);
            updateStatsDisplay(defender);
            playSentouSound();
            // ペットダメージは被攻撃キャラの位置に表示（メインダメージと分離のためoffset）
            { const { x: px, y: py } = getCharCenter(defender);
              showDamageNumber(px + 30, py - 65, `🐾${petDmg}`, false, 14, '#a78bfa'); }
            if (defender.el) {
              defender.el.classList.add('trembling');
              setTimeout(() => defender.el?.classList.remove('trembling'), 700);
            }
            renderTaimanHpBars();
            // 副効果（回復はタイマン仮想HP倍率×レベル分スケール）
            const healMult = taimanHpMult * (attacker.level || 1);
            const stealPct = { hp_steal:0.25, soul_steal:0.40, full_drain:0.60 }[aid];
            if (stealPct) {
              const heal = Math.max(1, Math.round(petDmg * stealPct * healMult));
              taimanState.hp[attackerId] = Math.min(taimanState.maxHp[attackerId], taimanState.hp[attackerId] + heal);
              const { x: ax, y: ay } = getCharCenter(attacker);
              showDamageNumber(ax, ay - 30, `💉+${heal}`, false, 14, '#86efac');
              updateStatsDisplay(attacker);
              renderTaimanHpBars();
            }
            if (aid === 'regen') {
              const regenHeal = Math.max(1, Math.round(2 * healMult));
              taimanState.hp[attackerId] = Math.min(taimanState.maxHp[attackerId], taimanState.hp[attackerId] + regenHeal);
              updateStatsDisplay(attacker);
              renderTaimanHpBars();
            }
            if (aid === 'team_heal') {
              const th = Math.max(1, Math.round(petDmg * 0.5 * healMult));
              taimanState.hp[attackerId] = Math.min(taimanState.maxHp[attackerId], taimanState.hp[attackerId] + th);
              const { x: ax2, y: ay2 } = getCharCenter(attacker);
              showDamageNumber(ax2, ay2 - 30, `💚+${th}`, false, 14, '#86efac');
              updateStatsDisplay(attacker);
              renderTaimanHpBars();
            }
            if (aid === 'omega') {
              taimanState.hp[attackerId] = Math.min(taimanState.maxHp[attackerId], taimanState.hp[attackerId] + Math.max(1, Math.round(petDmg * 0.5 * healMult)));
              taimanState.hp[defenderId] = Math.max(0, taimanState.hp[defenderId] - petDmg);
              updateStatsDisplay(attacker); updateStatsDisplay(defender);
              renderTaimanHpBars();
            }
            if (taimanState.hp[defenderId] <= 0 && taimanState.active) {
              if (!tryTaimanRevive(defender, defenderId)) endTaiman(attacker, defender);
            }
          }, 120);
        }, 370 + pi * 800 + i * 400);
      }
    });

  setTimeout(() => {
    if (!taimanState?.active) return;
    taimanState.hp[defenderId] = Math.max(0, taimanState.hp[defenderId] - dmg);
    updateStatsDisplay(defender);
    playSentouSound();
    const { x, y } = getCharCenter(defender);
    showDamageNumber(x, y - 20, (isCrit ? '💥' : '') + dmg.toLocaleString(), isCrit);
    if (defender.el) {
      defender.el.classList.add('trembling');
      setTimeout(() => defender.el?.classList.remove('trembling'), 700);
    }
    // ダメージトースト
    const container = document.getElementById('brToastContainer');
    if (container) {
      const toast = document.createElement('div');
      toast.className = 'br-toast' + (isCrit ? ' br-toast-crit' : '');
      toast.innerHTML = `<span class="br-atk">${escapeHtml(attacker.name)}</span> ⚔️ <span class="br-tgt">${escapeHtml(defender.name)}</span> <span class="br-dmg">${isCrit ? '💥' : '−'}${dmg.toLocaleString()}</span>`;
      container.prepend(toast);
      while (container.children.length > 8) container.lastChild.remove();
      setTimeout(() => toast.remove(), 2800);
    }
    renderTaimanHpBars();
    if (taimanState.hp[defenderId] <= 0) {
      if (!tryTaimanRevive(defender, defenderId)) { endTaiman(attacker, defender); return; }
    }
    taimanState.turn = taimanState.turn === 'challenger' ? 'target' : 'challenger';
    taimanState.interval = Math.max(200, taimanState.interval - 40);
    taimanState.attackTimer = setTimeout(() => taimanDoAttack(), taimanState.interval);
  }, 240);
}

function tryTaimanRevive(defender, defenderId) {
  if (!taimanState) return false;
  const revivePet = (defender.pet?.abilityId  === 'revive' && !defender.pet.reviveUsed)  ? defender.pet
                  : (defender.pet2?.abilityId === 'revive' && !defender.pet2.reviveUsed) ? defender.pet2
                  : null;
  if (!revivePet) return false;
  revivePet.reviveUsed = true;
  taimanState.hp[defenderId] = Math.round(taimanState.maxHp[defenderId] * 0.5);
  updateStatsDisplay(defender);
  renderTaimanHpBars();
  const { x, y } = getCharCenter(defender);
  showDamageNumber(x, y - 50, '🔥 不死鳥！', false, 18, '#f97316');
  showBubble(defender, '🔥 不死鳥！復活！', {});
  return true;
}

function endTaiman(winner, loser) {
  if (!taimanState) return;
  clearTimeout(taimanState.attackTimer);
  taimanState.active = false;
  const snapshot = taimanState;
  taimanState = null;

  document.getElementById('taimanHpBars')?.remove();

  // 全キャラのサイズをリセット
  Object.values(users).forEach(u => {
    u.sizeScale = snapshot.savedSizeScales[u.ipid] ?? 1;
    applyAvatarStyle(u);
    renderPetBadge(u);
  });

  // 反転フラグ解除
  const c = users[snapshot.challenger];
  const t = users[snapshot.target];
  if (c) { c._taimanFlip = false; applyFacingFlip(c); }

  // HP を元に戻す
  if (c) { c.hp = snapshot.savedHp[snapshot.challenger] ?? (c.hp ?? 30); updateStatsDisplay(c); }
  if (t) { t.hp = snapshot.savedHp[snapshot.target]     ?? (t.hp ?? 30); updateStatsDisplay(t); }

  if (winner && loser) {
    // 挑戦者のレベルが相手より高い場合、1Lvにつき10%ペナルティ
    const challengerLv = (c?.level || 1);
    const targetLv     = (t?.level || 1);
    const lvDiff       = challengerLv - targetLv;
    const mpMult       = lvDiff > 0 ? Math.max(0, 1 - lvDiff * 0.05) : 1;
    const loserFullMp  = loser.mp ?? 0;
    const transferMp   = Math.floor(loserFullMp * mpMult);
    winner.mp = (winner.mp ?? 0) + transferMp;
    loser.mp  = loserFullMp - transferMp;
    updateStatsDisplay(winner);
    updateStatsDisplay(loser);

    if (transferMp > 0) {
      const { x: wx, y: wy } = getCharCenter(winner);
      showDamageNumber(wx, wy - 50, `MP+${transferMp}`, false, 20, '#a78bfa');
    }

    // 敗者の画像を敗北画像に変更
    const loserAvatar = document.getElementById('a-' + loser.ipid);
    if (loserAvatar) {
      loserAvatar.innerHTML = `<img src="/chara/248106.png" alt="${escapeHtml(loser.name)}">`;
    }
    loser._taimanDefeated = true;

    // 1分間キャラ変更なければランダムキャラ
    // 同一ユーザーの前回タイマーをキャンセル（連敗時の重複防止）
    if (loser._taimanDefeatTimer) clearTimeout(loser._taimanDefeatTimer);
    const _loserIpid       = loser.ipid;
    const _defeatToken     = loser._taimanDefeatToken = Date.now() + Math.random();
    loser._taimanDefeatImg = loser.charImage; // キャプチャ時点の charImage を保存
    loser._taimanDefeatTimer = setTimeout(() => {
      const u = users[_loserIpid];
      if (!u || !u.el) return;
      if (u._taimanDefeatToken !== _defeatToken) return; // 後続の敗北で上書き済み
      if (u.charImage !== u._taimanDefeatImg) return;    // ユーザーが自分で変更済み
      if (availableImages.length === 0) return;
      delete u._taimanDefeatToken;
      delete u._taimanDefeatImg;
      delete u._taimanDefeatTimer;
      u.charImage = availableImages[Math.floor(Math.random() * availableImages.length)];
      applyAvatarStyle(u);
      addToLog(u, `[タイマン敗北1分経過 → ランダムキャラ]`, '#f87171');
    }, 60000);

    // 勝者に花火・紙吹雪
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        if (!winner.el) return;
        const { x, y } = getCharCenter(winner);
        spawnFireworks(x + (Math.random() - 0.5) * 250, y + (Math.random() - 0.5) * 120);
      }, i * 350);
    }
    spawnConfettiSmall(20);
    const confettiId = setInterval(() => spawnConfettiSmall(12), 400);
    setTimeout(() => clearInterval(confettiId), 5000);

    showBubble(winner, `🏆 勝利！ MP+${transferMp}`, {});
    showBubble(loser,  '😢 負け…', {});

    // 敗北コマンドを敗者の発言として実行
    if (taimanDefeatCommand.trim()) {
      setTimeout(() => {
        handleComment({ type: 'comment', ipid: loser.ipid, icon_name: loser.name, message: taimanDefeatCommand, _skipCharDupeCheck: true });
      }, 1200);
    }

    showTaimanWinBanner(winner, loser, transferMp);
    addToLog(winner, `⚔️ タイマン勝利！ MP+${transferMp}`, '#fbbf24');
    addToLog(loser,  `⚔️ タイマン敗北… MP→${loser.mp}`, '#f87171');
  }

  setTimeout(() => gatherCharactersBottom(), 4500);
}

function showTaimanWinBanner(winner, loser, transferMp) {
  const banner = document.createElement('div');
  banner.className = 'taiman-win-banner';
  banner.innerHTML = `
    <div class="taiman-win-title">⚔️ タイマン終了 ⚔️</div>
    <div class="taiman-win-result">🏆 <b>${escapeHtml(winner.name)}</b> の勝利！</div>
    <div class="taiman-win-mp">MP +${transferMp.toLocaleString()} 獲得</div>
  `;
  stage.appendChild(banner);
  const { x, y } = getCharCenter(winner);
  spawnHeartShower(x, y);
  spawnFireworks(x, y);
  setTimeout(() => banner.remove(), 6000);
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
  }, 10000);
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
  let area = user.el.querySelector('.char-equip-area');
  if (!area) {
    area = document.createElement('div');
    area.className = 'char-equip-area';
    const avatarWrap = user.el.querySelector('.avatar-wrap');
    if (avatarWrap) user.el.insertBefore(area, avatarWrap);
    else user.el.appendChild(area);
  }
  let badge = area.querySelector('.char-level-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.className = 'char-level-badge';
    area.appendChild(badge);
  }
  const lv = user.level || 1;
  badge.textContent = `Lv.${lv}`;
  let lvCls = '';
  if      (lv >= 100) lvCls = ' lv100';
  else if (lv >= 91)  lvCls = ' lv91plus';
  else if (lv >= 71)  lvCls = ' lv71plus';
  else if (lv >= 51)  lvCls = ' lv51plus';
  else if (lv >= 31)  lvCls = ' lv31plus';
  else if (lv >= 11)  lvCls = ' lv11plus';
  else if (lv >= 2)   lvCls = ` lv${lv}`;
  badge.className = 'char-level-badge' + lvCls;
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

  const bossSize = Math.round(200 * bossSizeScale);
  const barWidth = Math.round(bossSize * 0.6);

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

function spawnSpikiBoss() {
  const hp = nextBossHp();
  spawnBoss(hp);
  // 画像をスピキ専用に差し替え
  const ba = bossState.el.querySelector('#bossAvatar');
  if (ba) ba.innerHTML = `<img src="/chara/img_-0002-2607607172.png" alt="スピキ">`;
  // ラベル変更
  const lbl = bossState.el.querySelector('.boss-label');
  if (lbl) lbl.textContent = '👾 スピキ';
  bossState.isSpiki = true;
  addToLog({ name: 'SYSTEM', charDef: null }, `👾 スピキ召喚！ HP:${hp}`, '#a855f7');
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
  user.mp = (user.mp ?? 0) + 1 + mpExtra;
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

function rushPetToChar(attacker, elId, defender) {
  const petEl = document.getElementById(elId);
  if (!petEl || !defender?.el) return;
  const pr = petEl.getBoundingClientRect();
  const cr = defender.el.getBoundingClientRect();
  const dx = (cr.left + cr.width  / 2) - (pr.left + pr.width  / 2);
  const dy = (cr.top  + cr.height / 2) - (pr.top  + pr.height / 2);
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
      if (value >= 9) { spawnFireworks(x, y); spawnHeartShower(x, y); showMythDrop(u); }
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
function showMythDrop(user) {
  if (!user?.el) return;
  const prev = user.el.querySelector('.myth-drop-panel');
  if (prev) prev.remove();

  const panel = document.createElement('div');
  panel.className = 'myth-drop-panel';
  panel.innerHTML = `
    <div class="mdp-title">⚡ 神話ドロップ！！ ⚡</div>
    <div class="mdp-text mdp-reveal">✨ MYTHIC ✨</div>
  `;
  user.el.appendChild(panel);

  // 星エフェクトをキャラ周辺に集中
  const rect = user.el.getBoundingClientRect();
  const cx = rect.left + rect.width  / 2;
  const cy = rect.top  + rect.height / 2;
  const stars = ['⭐','🌟','✨','💫','🔥','👑','💎','🎆'];
  for (let i = 0; i < 24; i++) {
    setTimeout(() => {
      const s = document.createElement('div');
      s.className = 'myth-star';
      s.textContent = stars[Math.floor(Math.random() * stars.length)];
      s.style.left = (cx + (Math.random() - 0.5) * 260) + 'px';
      s.style.top  = (cy + (Math.random() - 0.5) * 160) + 'px';
      s.style.animationDelay    = (Math.random() * 0.4) + 's';
      s.style.animationDuration = (0.8 + Math.random() * 0.8) + 's';
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove(), { once: true });
    }, i * 70);
  }

  playLocalSound(SOUND_MYTH_DROP);
  setTimeout(() => panel.remove(), 3800);
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
function playLocalSound(src, volume = 0.8) {
  if (compactMode) return;
  try { const a = new Audio(src); a.volume = Math.min(1, volume * seVolume); a.play().catch(() => {}); } catch {}
}

function playVoice(url) {
  if (!isSafeUrl(url)) return;
  try {
    const audio = new Audio(url);
    audio.volume = Math.min(1, 0.8 * voiceVolume);
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
  if (comment.icon_name) {
    user.iconName = comment.icon_name; // 匿名含め常に保存
    if (!user.nameManual && !comment.icon_name.includes('匿名')) {
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
  user.lastCommentAt = Date.now();

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

  const rawMessage = decodeHtml(comment.message ?? '');
  const message    = stripPrefix(rawMessage);

  // ── 馬券ベット ──
  if (raceState?.phase === 'betting') {
    // 全角→半角に正規化してから判定
    const betMsg = message.trim()
      .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
      .replace(/[－−‐]/g, '-')
      .replace(/　/g, ' ');
    const m = betMsg.match(/^馬券\s+([\d]+(?:-[\d]+){0,2})\s+(\d+)$/);
    if (m) {
      handleRaceBet(user, m[1], parseInt(m[2]));
    } else if (betMsg.startsWith('馬券')) {
      addSystemLog(`⚠️ 馬券フォーマット違い: 「${betMsg}」→ 例: 馬券 2 10`, '#f87171');
    }
  }

  // ── 応援（レース中） ──
  if (raceState?.phase === 'racing' && raceState.horses?.length) {
    const normMsg = message.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
    raceState.horses.forEach(h => {
      if (new RegExp(`(?<![0-9])${h.no}(?![0-9])`).test(normMsg)) {
        triggerRaceCheer(h);
      }
    });
  }

  // ── YouTube URL 共有でMP回復 ──
  {
    // comment.urlはURLエンコードされている場合がある（例: v%3DID → v=ID）
    const urlDecoded = comment.url ? decodeURIComponent(comment.url) : '';
    const plainMsg = (comment.message ?? '').replace(/<[^>]+>/g, ' ');
    const searchTarget = urlDecoded + ' ' + plainMsg + ' ' + rawMessage;
    const ytMatch = searchTarget.match(/(?:youtu\.be\/|[?&]v=|shorts\/|live\/)([A-Za-z0-9_-]{11})/);
    if (ytMatch) {
      const videoId = ytMatch[1];
      if (seenYoutubeUrls.has(videoId)) {
        postAIReply('もうみた');
      } else {
        seenYoutubeUrls.add(videoId);
        user.mp = (user.mp ?? 0) + 20;
        updateStatsDisplay(user);
        ensureCharOnStage(user);
        showBubble(user, '📺 YouTube共有！ MP+20', {});
        const { x: yx, y: yy } = getCharCenter(user);
        showDamageNumber(yx, yy - 40, 'MP+20', false, 20, '#60a5fa');
        addToLog(user, '📺 YouTube共有 MP+20', '#60a5fa');
      }
    }
  }

  // ── 不在確認ワード自動返答 ──
  const _absentWords = ['これ放置', 'mumyou', '無明', 'いない', 'いにゃい', '寝た？', 'ねた？', 'ほうち', 'ホウチ', 'houti', 'houchi', 'abandoned', 'いる？', 'iru?', 'ねてる'];
  if (_absentWords.some(w => rawMessage.includes(w)) && !_aiPostedTexts.has(message)) {
    postAIReply('いますよ');
  }

  // ── 5分モード：AI自動返答（master本人とAI投稿はスキップ） ──
  if (fiveMinMode) {
    if (ipid === 'master') {
      _aiLog('skip: 自分のコメント');
    } else if (_aiPostedTexts.has(message)) {
      _aiLog('skip: AI投稿ループ防止');
    } else {
      askAIAndPost(user, message, comment.number);
    }
  }

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

  // ── ランダムタイマン ──────────────────────────────
  if (message.includes('ランダムタイマン')) {
    if (compactMode) return;
    ensureCharOnStage(user);
    if (taimanState) {
      showBubble(user, 'タイマン中です', {});
      return;
    }
    const TAIMAN_COOLDOWN = 5 * 60 * 1000;
    const elapsed = Date.now() - (user.lastTaimanAt ?? 0);
    if (elapsed < TAIMAN_COOLDOWN) {
      const remaining = Math.ceil((TAIMAN_COOLDOWN - elapsed) / 1000);
      showBubble(user, `あと${remaining}秒でタイマンできます`, {});
      return;
    }
    const candidates = Object.values(users).filter(u => u.el && !u.ko && u.ipid !== user.ipid);
    if (candidates.length === 0) {
      showBubble(user, '挑める相手がいません', {});
      return;
    }
    const target = candidates[Math.floor(Math.random() * candidates.length)];
    user.lastTaimanAt = Date.now();
    showBubble(user, `⚔️ ${target.name} にタイマンを挑む！`, {});
    startTaiman(user, target);
    return;
  }

  // ── タイマン ─────────────────────────────────────
  {
    const taimanM = message.trim().match(/^タイマン[：:](.+)$/);
    if (taimanM) {
      if (compactMode) return;
      const targetName = taimanM[1].trim();
      ensureCharOnStage(user);
      if (taimanState) {
        showBubble(user, 'タイマン中です', {});
        return;
      }
      const TAIMAN_COOLDOWN = 5 * 60 * 1000;
      const elapsed = Date.now() - (user.lastTaimanAt ?? 0);
      if (elapsed < TAIMAN_COOLDOWN) {
        const remaining = Math.ceil((TAIMAN_COOLDOWN - elapsed) / 1000);
        showBubble(user, `あと${remaining}秒でタイマンできます`, {});
        return;
      }
      const targetUser = Object.values(users).find(u => u.name === targetName && u.el && !u.ko && u.ipid !== user.ipid);
      if (!targetUser) {
        showBubble(user, `「${targetName}」が見つかりません`, {});
        return;
      }
      user.lastTaimanAt = Date.now();
      showBubble(user, `⚔️ ${targetName} にタイマンを挑む！`, {});
      startTaiman(user, targetUser);
      return;
    }
  }

  // ── AFK ───────────────────────────────────────
  if (user.afk || user.afkText) {
    // masterは「戻りました」のみ解除
    const canClearAfk = user.ipid !== 'master' || message.trim() === '戻りました';
    if (canClearAfk) {
      user.afk = false;
      user.afkText = null;
      if (user.afkEl) { user.afkEl.remove(); user.afkEl = null; }
      user.el?.classList.remove('char-afk');
    }
  }
  if (/AFK|ＡＦＫ/i.test(message)) {
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
  // 放置コマンド: 「放置:テキスト」
  const afkTextMatch = message.trim().match(/^(?:放置|無明)[：:](.+)$/);
  if (afkTextMatch) {
    ensureCharOnStage(user);
    const text = afkTextMatch[1].trim();
    user.afkText = text;
    if (user.afkEl) user.afkEl.remove();
    const afkEl = document.createElement('div');
    afkEl.className = 'afk-bubble';
    afkEl.textContent = '💤 ' + text;
    user.el.appendChild(afkEl);
    user.afkEl = afkEl;
    user.el.classList.add('char-afk');
    addToLog(user, '💤 放置: ' + text, '#64748b');
    return;
  }

  // ── 射コマンド：1文字ずつ物理発射 ───────────────
  if (message.includes('射')) {
    ensureCharOnStage(user); showBubble(user, message, {});
    launchBullets(user, message);
    return;
  }

  // ── 出ろ/出して/生成コマンド：SD画像生成 ──────
  if (/出ろ|出して|生成|gen/i.test(message)) {
    ensureCharOnStage(user);
    if ((user.mp ?? 0) < 20) {
      showBubble(user, 'MPが足りなくて画像生成できません', {});
      postAIReply(`${user.name || '名無し'} MPが足りません（${user.mp ?? 0}/20）`);
      return;
    }
    user.mp -= 20;
    showBubble(user, message, {});
    const prompt = message.replace(/出ろ|出して|生成|gen/gi, '').trim();
    generateSDImage(user, prompt || '1girl, anime');
    return;
  }

  // ── TTSコマンド ──────────────────────────────
  const ttsMatch = message.trim().match(/^tts[：:](.+)$/);
  if (ttsMatch) {
    ensureCharOnStage(user); showBubble(user, message, {});
    playTTS(ttsMatch[1].trim());
    return;
  }

  // ── ノベル起動コマンド ────────────────────────
  if (message.trim() === 'ノベル起動') {
    if (user.ipid !== 'master') return;
    ensureCharOnStage(user); showBubble(user, message, {});
    openNovelModal();
    return;
  }

  // ── AI返答コマンド（ai：質問） ────────────────
  const aiMatch = message.trim().match(/^(?:ai|AI|ＡＩ)[：:](.+)$/i);
  if (aiMatch) {
    ensureCharOnStage(user); showBubble(user, message, {});
    askAI(user, aiMatch[1].trim());
    return;
  }

  // ── 宝箱を開ける ─────────────────────────────
  if (message.trim() === '開ける') {
    ensureCharOnStage(user); showBubble(user, message, {});
    openTreasureChest(user);
    return;
  }

  // ── ペットガチャ ──────────────────────────────
  if (message.includes('ペットガチャ')) {
    if (compactMode) { ensureCharOnStage(user); showBubble(user, 'コンパクトモード中は使用できません', {}); return; }
    ensureCharOnStage(user);
    if ((user.mp ?? 0) < 20) {
      showBubble(user, `MPが足りない… (${user.mp ?? 0}/20)`, {});
      return;
    }
    user.mp -= 20;
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
      addToLog(user, `🎉 ペット2枠目解放 → ${pet.abilityName}[${pet.rarityName}]`, '#fbbf24');
    } else {
      const slotLabel = isSlot2 ? '(2枠目)' : '';
      addToLog(user, `🐾 ペットガチャ${slotLabel} → ${pet.abilityName}[${pet.rarityName}]`, '#a78bfa');
    }
    return;
  }

  // ── スロット停止 ──────────────────────────────
  if (message.includes('スロット停止')) {
    if (user.slotAutoMode) {
      user.slotAutoMode = false;
      ensureCharOnStage(user);
      showBubble(user, '🎰 スロット停止', {});
      addToLog(user, '🎰 スロット停止', '#94a3b8');
    }
    return;
  }

  // ── スロット開始（自動連続） ───────────────────
  if (message.includes('スロット開始')) {
    if (compactMode) { ensureCharOnStage(user); showBubble(user, 'コンパクトモード中は使用できません', {}); return; }
    ensureCharOnStage(user);
    if (user.slotAutoMode) return;
    if (user.slotSpinning) return;
    if ((user.mp ?? 0) < 3) {
      showBubble(user, `MPが足りない… (${user.mp ?? 0}/3)`, {});
      return;
    }
    user.slotAutoMode = true;
    user.mp -= 3;
    updateStatsDisplay(user);
    playSlot(user);
    addToLog(user, '🎰 スロット開始（自動）', '#fbbf24');
    return;
  }

  // ── スロット（1回） ───────────────────────────
  if (message.includes('スロット')) {
    if (compactMode) { ensureCharOnStage(user); showBubble(user, 'コンパクトモード中は使用できません', {}); return; }
    ensureCharOnStage(user);
    if (user.slotSpinning) return;
    if ((user.mp ?? 0) < 3) {
      showBubble(user, `MPが足りない… (${user.mp ?? 0}/3)`, {});
      return;
    }
    user.mp -= 3;
    updateStatsDisplay(user);
    playSlot(user);
    addToLog(user, '🎰 スロット！', '#fbbf24');
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

  // ── エイリアス（単独コマンドのみ） ─────────────
  const aliasId = Object.prototype.hasOwnProperty.call(charAliases, message)
    ? charAliases[message] : null;
  if (aliasId != null) {
    const id = aliasId;
    if (id < 1 || id > 500) return;
    const usedIds = getUsedCharIds(user);
    if (usedIds.has(id) && !comment._skipCharDupeCheck) {
      ensureCharOnStage(user);
      showBubble(user, `キャラ${id}は他の人が使用中です`, {});
      return;
    }
    user.charDef = getCharDef(id);
    delete user.charImage;
    if (!user.el) createCharacter(user);
    else applyAvatarStyle(user);
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

  // コマンド処理前にキャラを確定させる（randomizeCharAppearanceをここで済ませ、後続コマンドで上書きさせる）
  ensureCharOnStage(user);

  // キャラN（他コマンドと併用可）
  const charM = display.match(/キャラ(\d{1,3})/);
  if (charM) {
    const id = parseInt(charM[1]);
    if (id >= 1 && id <= 500) {
      const usedIds = getUsedCharIds(user);
      if (usedIds.has(id) && !comment._skipCharDupeCheck) {
        ensureCharOnStage(user);
        showBubble(user, `キャラ${id}は他の人が使用中です`, {});
      } else {
        user.charDef = getCharDef(id);
        delete user.charImage;
        delete user._taimanDefeatImg; // 自発変更としてタイマー判定をリセット
        if (!user.el) createCharacter(user);
        else applyAvatarStyle(user);
        updateNameDisplay(user);
        addToLog(user, `[キャラ${id}に変更]`, '#64748b');
      }
    }
    display = display.replace(charM[0], '').trim();
  }

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

  const bgColorM = display.match(/吹き出し背景色[：:]([\S]+)/);
  if (bgColorM) {
    const raw = bgColorM[1];
    if (raw === 'なし' || raw === 'リセット' || raw === 'クリア') {
      user.bubbleBgColor = '';
    } else {
      const c = resolveColor(raw);
      if (c) user.bubbleBgColor = c;
    }
    display = display.replace(bgColorM[0], '').trim();
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

  if (/ごしありｗ/.test(display)) {
    const ipid = user.ipid;
    addToLog(user, '[ごしありｗ → 自キャラ削除]', '#ef4444');
    if (user.el) {
      user.el.style.transition = 'transform 0.4s ease-in, opacity 0.4s ease-in';
      user.el.style.transform  = 'scale(0) rotate(20deg)';
      user.el.style.opacity    = '0';
    }
    setTimeout(() => {
      if (user.bubbleTimer) clearTimeout(user.bubbleTimer);
      if (user.motionTimer) clearTimeout(user.motionTimer);
      if (user.moveTimer)   clearTimeout(user.moveTimer);
      if (user.walkTimer)   clearTimeout(user.walkTimer);
      user.el?.remove();
      delete users[ipid];
      delete _charSaveData[ipid];
      fetch(`/api/char-save/${encodeURIComponent(ipid)}`, { method: 'DELETE' }).catch(() => {});
      if (brState?.active && brState.survivors.has(ipid)) {
        brState.survivors.delete(ipid);
        brState.ranking.push(ipid);
        if (brState.survivors.size <= 1) {
          const winnerId = [...brState.survivors][0];
          setTimeout(() => endBattleRoyale(winnerId ? users[winnerId] : null), 800);
        }
      }
    }, 400);
    return;
  }

  if (/ランダムキャラ/.test(display)) {
    if (availableImages.length > 0) {
      user.charImage = availableImages[Math.floor(Math.random() * availableImages.length)];
      delete user._taimanDefeatImg; // 自発変更としてタイマー判定をリセット
      applyAvatarStyle(user);
      addToLog(user, `[ランダムキャラ → ${user.charImage}]`, '#64748b');
    }
    display = display.replace(/ランダムキャラ/g, '').trim();
  }

  const sizeM = display.match(/大きさ[：:]([\S]+)/);
  if (sizeM) { const sz = SIZE_MAP[sizeM[1]]; if (sz) { user.size = sz; ensureCharOnStage(user); applyAvatarStyle(user); } display = display.replace(sizeM[0], '').trim(); }

  // フォント："Font Name" or フォント：エイリアス
  const fontM = display.match(/フォント[：:](?:"([^"]+)"|(\S+))/);
  if (fontM) {
    const raw = fontM[1] || fontM[2]; // quoted or unquoted
    user.font = Object.prototype.hasOwnProperty.call(FONT_MAP, raw)
      ? FONT_MAP[raw]
      : (fontM[1] ? `"${raw}"` : raw); // quoted → wrap in quotes, unquoted → use as-is
    display = display.replace(fontM[0], '').trim();
  }

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
  if (/反転/.test(display)) {
    ensureCharOnStage(user);
    user.flipped = !user.flipped;
    applyAvatarStyle(user);
    display = display.replace(/反転/g, '').trim();
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
  if (/浮く/.test(display)) {
    ensureCharOnStage(user);
    applyMotion(user, 'floating');
    display = display.replace(/浮く/g, '').trim();
  }
  if (/揺れる/.test(display)) {
    ensureCharOnStage(user);
    applyMotion(user, 'swaying');
    display = display.replace(/揺れる/g, '').trim();
  }
  if (/伸縮|縮む/.test(display)) {
    ensureCharOnStage(user);
    applyMotion(user, 'pulsing');
    display = display.replace(/伸縮|縮む/g, '').trim();
  }
  if (/スキップ/.test(display)) {
    ensureCharOnStage(user);
    applyMotion(user, 'skipping');
    display = display.replace(/スキップ/g, '').trim();
  }
  if (/酔う/.test(display)) {
    ensureCharOnStage(user);
    applyMotion(user, 'drunk');
    display = display.replace(/酔う/g, '').trim();
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
function decodeHtml(s) {
  const t = document.createElement('textarea');
  t.innerHTML = String(s);
  return t.value;
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
document.getElementById('fiveMinBtn').addEventListener('click', () => setFiveMinMode(!fiveMinMode));

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
    u.mp = (u.mp ?? 0) + 30;
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

document.getElementById('spikiBossBtn').addEventListener('click', () => {
  spawnSpikiBoss();
});

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
  saveSettingsToServer();
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
    saveSettingsToServer();
    Object.values(users).forEach(u => { if (u.el) { applyAvatarStyle(u); renderPetBadge(u); } });
  });
  bossSlider.addEventListener('input', () => {
    bossSizeScale = bossSlider.value / 100;
    bossVal.textContent = bossSlider.value + '%';
    localStorage.setItem('bossSizeScale', bossSizeScale);
    saveSettingsToServer();
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

// ── AFK表示スライダー（透明度・グレースケール・明るさ） ──────────
// ── 射コマンド：物理演算ループ ────────────────────────────────────
function startKaiPhysics() {
  if (kaiAnimId) return;
  function step() {
    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;
    const charTargets = Object.values(users)
      .filter(u => u.el)
      .map(u => {
        const w = u.el.offsetWidth  || 60;
        const h = u.el.offsetHeight || 80;
        return { cx: u.x + w * 0.5, cy: u.y + h * 0.45, r: Math.min(w, h) * 0.4 };
      });
    const bossTarget = _kaiBossTarget();
    for (let i = kaiBullets.length - 1; i >= 0; i--) {
      const b = kaiBullets[i];
      b.vy += kaiGravity;
      b.x  += b.vx;
      b.y  += b.vy;
      // 壁反射
      if (b.x - b.r < 0)      { b.x = b.r;          b.vx =  Math.abs(b.vx) * kaiRestitution; }
      if (b.x + b.r > stageW) { b.x = stageW - b.r; b.vx = -Math.abs(b.vx) * kaiRestitution; }
      if (b.y - b.r < 0)      { b.y = b.r;           b.vy =  Math.abs(b.vy) * kaiRestitution; }
      if (b.y + b.r > stageH) {
        b.y = stageH - b.r;
        b.vy = -Math.abs(b.vy) * kaiRestitution;
        if (Math.abs(b.vy) < 1.5) { b.vy = 0; b.vx *= 0.85; }
      }
      // キャラクター当たり判定
      for (const c of charTargets) {
        const dx = b.x - c.cx, dy = b.y - c.cy;
        const d2 = dx * dx + dy * dy;
        const minD = b.r + c.r;
        if (d2 < minD * minD && d2 > 0) {
          const d  = Math.sqrt(d2);
          const nx = dx / d, ny = dy / d;
          const dot = b.vx * nx + b.vy * ny;
          if (dot < 0) {
            b.vx -= (1 + kaiRestitution) * dot * nx;
            b.vy -= (1 + kaiRestitution) * dot * ny;
          }
          const ov = minD - d;
          b.x += nx * ov; b.y += ny * ov;
        }
      }
      // ボス当たり判定（ヒット後も弾は消えない・クールダウンで連続ダメージ防止）
      if (bossTarget) {
        const dx = b.x - bossTarget.cx, dy = b.y - bossTarget.cy;
        const now = performance.now();
        if (dx * dx + dy * dy < (b.r + bossTarget.r) ** 2) {
          if (!b.bossCooldown || now - b.bossCooldown > 500) {
            b.bossCooldown = now;
            const dmg = Math.floor(Math.random() * 5) + 1;
            bossState.hp = Math.max(0, bossState.hp - dmg);
            updateBossHpDisplay();
            if (b.user) {
              if (!bossDamageMap[b.user.ipid]) bossDamageMap[b.user.ipid] = { name: b.user.name || '名無し', totalDmg: 0 };
              bossDamageMap[b.user.ipid].name = b.user.name || '名無し';
              bossDamageMap[b.user.ipid].totalDmg += dmg;
              b.user.totalDmgDealt = (b.user.totalDmgDealt || 0) + dmg;
            }
            playSentouSound();
            const ba = bossState.el.querySelector('#bossAvatar');
            if (ba) {
              ba.classList.remove('boss-hit-flash');
              void ba.offsetWidth;
              ba.classList.add('boss-hit-flash');
              ba.addEventListener('animationend', () => ba.classList.remove('boss-hit-flash'), { once: true });
            }
            showDamageNumber(
              bossTarget.cx + (Math.random() - 0.5) * 70,
              bossTarget.by + 30, dmg, false
            );
            if (bossState.hp <= 0 && !bossState.defeated) setTimeout(() => defeatBoss(), 200);
          }
        }
      }
      // フェードアウト（寿命後半30%）
      const fadeStart = b.maxLife * 0.7;
      const alpha = b.life > fadeStart ? 1 - (b.life - fadeStart) / (b.maxLife - fadeStart) : 1;
      b.el.style.left      = (b.x - b.r) + 'px';
      b.el.style.top       = (b.y - b.r) + 'px';
      b.el.style.opacity   = Math.max(0, alpha).toFixed(3);
      b.el.style.transform = 'rotate(' + (Math.atan2(b.vy, b.vx) * 180 / Math.PI) + 'deg)';
      b.life++;
      if (b.life >= b.maxLife) { b.el.remove(); kaiBullets.splice(i, 1); }
    }
    kaiAnimId = kaiBullets.length > 0 ? requestAnimationFrame(step) : null;
  }
  kaiAnimId = requestAnimationFrame(step);
}
// ボス当たり判定rect（step内で毎フレーム1回だけ取得）
function _kaiBossTarget() {
  if (!bossState?.el || bossState.defeated) return null;
  const br = bossState.el.getBoundingClientRect();
  const sr = stage.getBoundingClientRect();
  const bx = br.left - sr.left, by = br.top - sr.top;
  return { cx: bx + br.width * 0.5, cy: by + br.height * 0.45, r: Math.min(br.width, br.height) * 0.45, by, bx };
}

// ── TTS（RVC音声合成） ────────────────────────────────────────────
let _ttsAudio = null;
async function playTTS(text) {
  if (!ttsModel) return;
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text, model: ttsModel, voice: ttsVoice,
        f0_up_key: ttsF0UpKey, index_rate: ttsIndexRate,
        protect: ttsProtect, speed: ttsSpeed,
      }),
    });
    const data = await res.json();
    if (data.error) { console.warn('[TTS]', data.error); return; }
    if (_ttsAudio) { _ttsAudio.pause(); _ttsAudio = null; }
    const audio = new Audio(data.url);
    audio.volume = ttsVolume;
    _ttsAudio = audio;
    audio.play().catch(() => {});
    audio.onended = () => { if (_ttsAudio === audio) _ttsAudio = null; };
  } catch (e) {
    console.warn('[TTS]', e.message);
  }
}

// ── AI返答（Ollama） ─────────────────────────────────────────────
let aiModel  = localStorage.getItem('aiModel')  || 'gemma3:12b';
let aiSystem = localStorage.getItem('aiSystem') || '';
const _aiPostedTexts = new Set();
const seenYoutubeUrls = new Set();
let _aiQueue = Promise.resolve();
let _aiConvHistory = []; // 5分モードの会話履歴 [{role:'user',content:...},{role:'assistant',content:...},...]

function _aiLog(text, color) {
  addToLog({ charDef: null, name: '🤖AI' }, text, color || '#818cf8');
}

function setFiveMinMode(on) {
  fiveMinMode = on;
  if (on) _aiConvHistory = []; // セッション開始時に履歴リセット
  const btn = document.getElementById('fiveMinBtn');
  if (btn) {
    btn.textContent = on ? '🤖 5分モード（今起動中）' : '🤖 5分モード';
    btn.classList.toggle('five-min-active', on);
  }
  _aiLog(on ? `5分モード 開始 (apikey:${apikey ? 'あり' : 'なし'})` : '5分モード 終了');
  if (on) postAIReply('配信者不在のためCLAIRを起動します');
}

async function postAIReply(text) {
  if (!apikey) { _aiLog('投稿スキップ: apikey なし', '#f87171'); return; }
  _aiPostedTexts.add(text);
  setTimeout(() => _aiPostedTexts.delete(text), 60000);
  fetch('/api/post-comment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apikey, comment: text, icon: '0' }),
  })
    .then(r => r.json())
    .then(j => _aiLog(`投稿完了: ${text}`, '#6ee7b7'))
    .catch(e => _aiLog(`投稿エラー: ${e.message}`, '#f87171'));
}

function askAIAndPost(user, question, number) {
  _aiQueue = _aiQueue.then(() => _doAskAI(user, question, number)).catch(() => {});
}

async function _doAskAI(user, question, number) {
  const systemPrompt = aiSystem.trim() ||
    'あなたは配信のコメントに返答するアシスタントです。必ず50文字以内の日本語で返答してください。';
  const userName = user.name || '視聴者';
  const userContent = `${userName}: ${question}`;
  _aiLog(`送信: ${userContent}`);
  const messages = [..._aiConvHistory, { role: 'user', content: userContent }];
  try {
    const res = await fetch('/api/ai-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model: aiModel, system: systemPrompt }),
    });
    const data = await res.json();
    if (data.error) { _aiLog(`Ollamaエラー: ${data.error}`, '#f87171'); return; }
    const replyText = data.reply.trim();
    // 履歴に追加（最大40件=20往復で古いものを削除）
    _aiConvHistory.push({ role: 'user', content: userContent });
    _aiConvHistory.push({ role: 'assistant', content: replyText });
    if (_aiConvHistory.length > 40) _aiConvHistory.splice(0, 2);
    const prefix = number ? `>>${number} ` : '';
    const reply = prefix + replyText;
    _aiLog(`返答生成: ${reply}`, '#a5b4fc');
    postAIReply(reply);
    playTTS(replyText);
  } catch (e) {
    _aiLog(`例外: ${e.message}`, '#f87171');
  }
}

(function initAISettings() {
  const mEl = document.getElementById('aiModelInput');
  const sEl = document.getElementById('aiSystemInput');
  if (mEl) mEl.value = aiModel;
  if (sEl) sEl.value = aiSystem;
})();

async function askAI(user, question) {
  addToLog(user, `🤖 AI質問: ${question}`, '#818cf8');
  const systemPrompt = aiSystem.trim() ||
    'あなたは配信のコメントに返答するアシスタントです。必ず50文字以内の日本語で返答してください。';
  try {
    const res = await fetch('/api/ai-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: question, model: aiModel, system: systemPrompt }),
    });
    const data = await res.json();
    if (data.error) { console.warn('[AI]', data.error); return; }
    const reply = data.reply.trim();
    showBubble(user, reply, {});
    addToLog(user, `🤖 AI返答: ${reply}`, '#818cf8');
  } catch (e) {
    console.warn('[AI]', e.message);
  }
}

// ── Stable Diffusion 画像生成 ────────────────────────────────────
function _sdReadSettings() {
  return {
    width:          parseInt(document.getElementById('sdWidthInput')?.value)        || 1600,
    height:         parseInt(document.getElementById('sdHeightInput')?.value)       || 1000,
    steps:          parseInt(document.getElementById('sdStepsSlider')?.value)       || 20,
    popWidth:       parseInt(document.getElementById('sdPopWidthSlider')?.value)    || 480,
    positiveSuffix: document.getElementById('sdPositiveSuffixInput')?.value         ?? '',
    negative:       document.getElementById('sdNegativeInput')?.value               ?? '',
    displayTime:    parseInt(document.getElementById('sdDisplayTimeSlider')?.value) || 10,
    mosaicKeywords: document.getElementById('sdMosaicKeywordsInput')?.value         ?? '',
    mosaicBlock:    parseInt(document.getElementById('sdMosaicBlockSlider')?.value) || 20,
  };
}

async function generateSDImage(user, prompt) {
  ensureCharOnStage(user);
  const cfg = _sdReadSettings();
  const fullPrompt = prompt + (cfg.positiveSuffix ? ', ' + cfg.positiveSuffix : '');
  showBubble(user, '🎨 生成中…', { color: '#a855f7' });
  addToLog(user,
    `🎨SD prompt: ${fullPrompt} | ${cfg.width}x${cfg.height} steps:${cfg.steps} popW:${cfg.popWidth}`,
    '#a855f7');
  try {
    const res  = await fetch('/api/sd-generate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        prompt,
        charName:       user.name || '',
        width:          cfg.width,
        height:         cfg.height,
        steps:          cfg.steps,
        positiveSuffix: cfg.positiveSuffix,
        negative:       cfg.negative,
      }),
    });
    const data = await res.json();
    if (data.error) {
      console.error('[SD]', data.error);
      showBubble(user, '❌ ' + data.error.slice(0, 40), {});
      addToLog(user, '🎨SD ❌ ' + data.error.slice(0, 80), '#ef4444');
      return;
    }
    if (data.translatedPrompt && data.translatedPrompt !== prompt) {
      addToLog(user, `🎨SD 翻訳: ${prompt} → ${data.translatedPrompt}`, '#c084fc');
    }
    showSDImage(user, data.image, prompt, data.translatedPrompt || prompt, cfg);
  } catch (e) {
    console.error('[SD fetch]', e);
    showBubble(user, '❌ 通信エラー', {});
  }
}

function _sdNeedsMosaic(prompt, translatedPrompt, mosaicKeywords) {
  if (!mosaicKeywords.trim()) return false;
  const keywords = mosaicKeywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
  const p = prompt.toLowerCase(), t = translatedPrompt.toLowerCase();
  return keywords.some(k => p.includes(k) || t.includes(k));
}

function _applyMosaic(imgEl, blockSize) {
  blockSize = Math.max(1, parseInt(blockSize) || 20);
  const doIt = () => {
    const w = imgEl.naturalWidth, h = imgEl.naturalHeight;
    if (!w || !h) return;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgEl, 0, 0, Math.ceil(w / blockSize), Math.ceil(h / blockSize));
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(canvas, 0, 0, Math.ceil(w / blockSize), Math.ceil(h / blockSize), 0, 0, w, h);
    imgEl.src = canvas.toDataURL('image/png');
  };
  if (imgEl.complete && imgEl.naturalWidth) doIt();
  else imgEl.addEventListener('load', doIt, { once: true });
}

function openNovelModal() {
  const modal = document.getElementById('novelModal');
  const frame = document.getElementById('novelFrame');
  if (frame.src === 'about:blank' || frame.src === '') frame.src = 'http://localhost:3001/';
  modal.classList.remove('hidden');
}
function closeNovelModal() {
  document.getElementById('novelModal').classList.add('hidden');
}

function showSDImage(user, dataUrl, prompt, translatedPrompt, cfg) {
  const el = document.createElement('div');
  el.className = 'sd-image-popup';
  const { x: cx, y: cy } = getCharCenter(user);
  const sw = stage.clientWidth, sh = stage.clientHeight;
  const popW = Math.min(cfg.popWidth, sw - 16);
  const imgH = Math.round(popW * (cfg.height / cfg.width));
  const popH = imgH + 40;
  const left = Math.min(Math.max(8, cx - popW / 2), sw - popW - 8);
  const top  = Math.min(Math.max(8, cy - popH - 10), sh - popH - 8);
  el.style.left  = left + 'px';
  el.style.top   = top  + 'px';
  el.style.width = popW + 'px';
  el.innerHTML =
    `<div class="sd-image-header">` +
      `<span class="sd-image-user">${escapeHtml(user.name || '名無し')}</span>` +
      `<button class="sd-image-close">✕</button>` +
    `</div>` +
    `<img src="${dataUrl}" alt="${escapeHtml(prompt)}" class="sd-image-img">`;
  el.querySelector('.sd-image-close').addEventListener('click', () => el.remove());
  if (_sdNeedsMosaic(prompt, translatedPrompt, cfg.mosaicKeywords)) _applyMosaic(el.querySelector('.sd-image-img'), cfg.mosaicBlock);
  stage.appendChild(el);
  setTimeout(() => { if (el.isConnected) el.remove(); }, cfg.displayTime * 1000);
}

function launchBullets(user, text) {
  if (compactMode) return;
  ensureCharOnStage(user);
  const chars  = [...text];
  const colors = ['#ff4444','#ff8c00','#ffd700','#44dd55','#4499ff','#cc44ff','#ff44bb','#00dddd'];
  addToLog(user, '🚀 射: ' + text, '#f97316');
  chars.forEach((ch, i) => {
    setTimeout(() => {
      const { x: cx, y: cy } = getCharCenter(user);
      const el = document.createElement('div');
      el.className = 'kai-bullet';
      const r = Math.round(kaiBulletSize * 0.55);
      el.style.cssText = `width:${r*2}px;height:${r*2}px;font-size:${kaiBulletSize}px;color:${colors[i % colors.length]};`;
      el.textContent = ch;
      stage.appendChild(el);
      const targetAngle = Math.atan2(0 - cy, stage.clientWidth / 2 - cx);
      const angle = targetAngle + (Math.random() - 0.5) * (Math.PI / 6);
      const speed = kaiSpeed * (0.8 + Math.random() * 0.4);
      kaiBullets.push({
        el, r, user,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 300 + Math.floor(Math.random() * 120),
      });
      startKaiPhysics();
    }, i * 70);
  });
}

(function initKaiSliders() {
  const defs = [
    { id:'kaiSpeedSlider',       valId:'kaiSpeedVal',       key:'kaiSpeed',       def:18, fmt:v=>v,      apply:v=>{ kaiSpeed=v; }            },
    { id:'kaiRestitutionSlider', valId:'kaiRestitutionVal', key:'kaiRestitution', def:65, fmt:v=>v+'%',  apply:v=>{ kaiRestitution=v/100; }  },
    { id:'kaiGravitySlider',     valId:'kaiGravityVal',     key:'kaiGravity',     def:35, fmt:v=>v+'%',  apply:v=>{ kaiGravity=v/100; }      },
    { id:'kaiBulletSizeSlider',  valId:'kaiBulletSizeVal',  key:'kaiBulletSize',  def:32, fmt:v=>v+'px', apply:v=>{ kaiBulletSize=v; }       },
  ];
  defs.forEach(({ id, valId, key, def, fmt, apply }) => {
    const slider = document.getElementById(id);
    const valEl  = document.getElementById(valId);
    if (!slider) return;
    const saved = parseInt(localStorage.getItem(key) ?? def);
    slider.value = saved;
    if (valEl) valEl.textContent = fmt(saved);
    apply(saved);
    slider.addEventListener('input', () => {
      const v = parseInt(slider.value);
      if (valEl) valEl.textContent = fmt(v);
      apply(v);
      localStorage.setItem(key, v);
    });
    document.getElementById(id.replace('Slider', 'Reset'))?.addEventListener('click', () => {
      slider.value = def;
      slider.dispatchEvent(new Event('input'));
    });
  });
})();

(function initAfkSliders() {
  const defs = [
    { id: 'afkOpacitySlider',   valId: 'afkOpacityVal',   key: 'afkOpacity',   def: 45,  cssVar: '--afk-opacity',   toCSS: v => v / 100 },
    { id: 'afkGrayscaleSlider', valId: 'afkGrayscaleVal', key: 'afkGrayscale', def: 60,  cssVar: '--afk-grayscale', toCSS: v => v / 100 },
    { id: 'afkBrightnessSlider',valId: 'afkBrightnessVal',key: 'afkBrightness',def: 55,  cssVar: '--afk-brightness',toCSS: v => v / 100 },
  ];
  defs.forEach(({ id, valId, key, def, cssVar, toCSS }) => {
    const slider = document.getElementById(id);
    const valEl  = document.getElementById(valId);
    if (!slider) return;
    const saved = parseInt(localStorage.getItem(key) ?? def);
    slider.value = saved;
    if (valEl) valEl.textContent = saved + '%';
    document.documentElement.style.setProperty(cssVar, toCSS(saved));
    slider.addEventListener('input', () => {
      const v = parseInt(slider.value);
      if (valEl) valEl.textContent = v + '%';
      document.documentElement.style.setProperty(cssVar, toCSS(v));
      localStorage.setItem(key, v);
    });
    document.getElementById(id.replace('Slider', 'Reset'))?.addEventListener('click', () => {
      slider.value = def;
      slider.dispatchEvent(new Event('input'));
    });
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
    saveSettingsToServer();
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
    saveSettingsToServer();
  });
  document.getElementById('brHpMultReset').addEventListener('click', () => {
    slider.value = 200;
    slider.dispatchEvent(new Event('input'));
  });
})();

(function initTaimanHpMultSlider() {
  const slider = document.getElementById('taimanHpMultSlider');
  const val    = document.getElementById('taimanHpMultVal');
  if (!slider || !val) return;
  const saved = parseInt(localStorage.getItem('taimanHpMult') ?? '10');
  taimanHpMult = saved;
  slider.value = saved;
  val.textContent = saved + 'x';
  slider.addEventListener('input', () => {
    taimanHpMult = parseInt(slider.value);
    val.textContent = taimanHpMult + 'x';
    localStorage.setItem('taimanHpMult', taimanHpMult);
    saveSettingsToServer();
  });
  document.getElementById('taimanHpMultReset').addEventListener('click', () => {
    slider.value = 10;
    slider.dispatchEvent(new Event('input'));
  });
})();

document.getElementById('batchAssign').addEventListener('click', () => {
  const assigned = new Set(Object.values(charImages));
  const unassigned = availableImages.filter(f => !assigned.has(f));
  if (!unassigned.length) { alert('未割当の画像はありません'); return; }
  const usedIds = new Set(Object.keys(charImages).map(Number));
  let nextId = 1;
  unassigned.forEach(fname => {
    while (usedIds.has(nextId)) nextId++;
    charImages[nextId] = fname;
    usedIds.add(nextId);
    nextId++;
  });
  saveCharImages();
  refreshAllAvatars();
  renderCharSlots();
});
document.getElementById('batchAssignAll').addEventListener('click', () => {
  if (!confirm('全キャラの画像割り当てをリセットして一括再割り当てしますか？\n既存の割り当てはすべて上書きされます。')) return;
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
  const savedX = localStorage.getItem('trashX');
  const savedY = localStorage.getItem('trashY');
  if (savedX !== null && savedY !== null) {
    const sw   = stage.clientWidth  || window.innerWidth;
    const sh   = stage.clientHeight || window.innerHeight;
    const maxX = Math.max(0, sw - 72);
    const maxY = Math.max(0, sh - 72);
    const x    = Math.max(0, Math.min(maxX, parseInt(savedX) || 0));
    const y    = Math.max(0, Math.min(maxY, parseInt(savedY) || 0));
    trashEl.style.right  = 'auto';
    trashEl.style.bottom = 'auto';
    trashEl.style.left   = x + 'px';
    trashEl.style.top    = y + 'px';
  }
  // 保存座標がない場合はCSSの right:18px bottom:18px がそのまま有効
})();

document.getElementById('trashCan').addEventListener('mousedown', e => {
  if (e.button !== 0 || dragState) return;
  const trashEl   = document.getElementById('trashCan');
  const trashRect = trashEl.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  trashDragState = {
    ox: trashRect.left - stageRect.left,
    oy: trashRect.top  - stageRect.top,
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
  if (mpRankingDragState) {
    const panel = document.getElementById('mpRankingPanel');
    if (panel && mpRankingState) {
      const { ox, oy, sx, sy } = mpRankingDragState;
      const sr = stage.getBoundingClientRect();
      mpRankingState.panelX = Math.max(0, Math.min(sr.width  - panel.offsetWidth,  ox + (e.clientX - sx)));
      mpRankingState.panelY = Math.max(0, Math.min(sr.height - panel.offsetHeight, oy + (e.clientY - sy)));
      panel.style.left = mpRankingState.panelX + 'px';
      panel.style.top  = mpRankingState.panelY + 'px';
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
  if (raceDragState) {
    const panel = document.getElementById('racePanel');
    if (panel && raceState) {
      const { ox, oy, sx, sy } = raceDragState;
      const sr = stage.getBoundingClientRect();
      raceState.panelX = Math.max(0, Math.min(sr.width  - panel.offsetWidth,  ox + (e.clientX - sx)));
      raceState.panelY = Math.max(0, Math.min(sr.height - panel.offsetHeight, oy + (e.clientY - sy)));
      panel.style.left = raceState.panelX + 'px';
      panel.style.top  = raceState.panelY + 'px';
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
    const x = ox + (e.clientX - sx);
    const y = oy + (e.clientY - sy);
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
    trashEl.style.right  = 'auto';
    trashEl.style.bottom = 'auto';
    trashEl.style.left   = x + 'px';
    trashEl.style.top    = y + 'px';
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
  if (mpRankingDragState) {
    if (mpRankingState) {
      localStorage.setItem('mpRankingPanelX', Math.round(mpRankingState.panelX));
      localStorage.setItem('mpRankingPanelY', Math.round(mpRankingState.panelY));
    }
    mpRankingDragState = null;
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
  if (raceDragState) {
    raceDragState = null;
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
      localStorage.setItem('bossX', bossLastPos.x);
      localStorage.setItem('bossY', bossLastPos.y);
      saveSettingsToServer();
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
  if (!user.el) return;
  const prev = user.el.querySelector('.pet-gacha-panel');
  if (prev) prev.remove();

  // ドラムロール開始
  if (petGachaDrumAudio) { petGachaDrumAudio.pause(); petGachaDrumAudio = null; }
  if (!compactMode) {
    try {
      petGachaDrumAudio = new Audio(SOUND_GACHA_DRUM);
      petGachaDrumAudio.volume = Math.min(1, 0.7 * seVolume);
      petGachaDrumAudio.loop = true;
      petGachaDrumAudio.play().catch(() => {});
    } catch {}
  }

  const panel = document.createElement('div');
  panel.className = 'pet-gacha-panel';
  user.el.appendChild(panel);

  const imgs = availableImages.length > 0 ? availableImages : ['kisyokeee.png'];
  const update = img => {
    panel.innerHTML = `
      <div class="pg-panel-title">🐾 ガチャ中...</div>
      <div class="pg-panel-img"><img src="/chara/${encodeURIComponent(img)}" alt="pet"></div>`;
  };

  update(imgs[0]);
  let timer = setInterval(() => update(imgs[Math.floor(Math.random() * imgs.length)]), 80);

  setTimeout(() => {
    clearInterval(timer);
    timer = setInterval(() => update(imgs[Math.floor(Math.random() * imgs.length)]), 280);
  }, 2000);

  setTimeout(() => {
    clearInterval(timer);
    if (petGachaDrumAudio) { petGachaDrumAudio.pause(); petGachaDrumAudio = null; }

    const RC = {
      '':             { border:'#374151', color:'#9ca3af' },
      'rarity-rare':  { border:'#16a34a', color:'#4ade80' },
      'rarity-epic':  { border:'#3b82f6', color:'#60a5fa' },
      'rarity-legend':{ border:'#a855f7', color:'#c084fc' },
      'rarity-myth':  { border:'#f59e0b', color:'#fbbf24' },
    }[finalPet.rarityCls || ''];

    panel.style.borderColor = RC.border;
    panel.style.boxShadow   = `0 0 12px ${RC.border}88, 0 4px 16px rgba(0,0,0,0.6)`;
    panel.innerHTML = `
      <div class="pg-panel-title" style="color:${RC.color}">🎉 GET!</div>
      <div class="pg-panel-img pg-panel-reveal" style="border-color:${RC.border}">
        <img src="/chara/${encodeURIComponent(finalPet.img)}" alt="pet">
      </div>
      <div class="pg-panel-rarity" style="color:${RC.color}">${finalPet.rarityName}</div>
      <div class="pg-panel-name"   style="color:${RC.color}">${escapeHtml(finalPet.abilityName)}</div>
      <div class="pg-panel-desc">${escapeHtml(finalPet.abilityDesc)}</div>`;

    const raritySound = {
      '':              SOUND_GACHA_NORMAL,
      'rarity-rare':   SOUND_GACHA_RARE,
      'rarity-epic':   SOUND_GACHA_EPIC,
      'rarity-legend': SOUND_GACHA_LEGEND,
      'rarity-myth':   SOUND_GACHA_MYTH,
    }[finalPet.rarityCls || ''];
    playLocalSound(raritySound);

    if (finalPet.rarityCls === 'rarity-myth') {
      for (let i = 0; i < 5; i++) setTimeout(() => spawnFireworks(Math.random() * stage.clientWidth, Math.random() * stage.clientHeight * 0.8), i * 200);
      spawnConfetti();
    } else if (finalPet.rarityCls === 'rarity-legend') {
      spawnFireworks(stage.clientWidth / 2, stage.clientHeight / 2);
    }

    setTimeout(() => panel.remove(), 4000);
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
  const quiz = user.tc?.quizWins || 0;

  const petSummary = [user.pet, user.pet2].filter(Boolean)
    .map(p => `${p.abilityName}(${p.abilityDesc})`).join(' / ') || 'なし';

  const activeTitleName = user.activeTitle
    ? (TITLES.find(t => t.id === user.activeTitle)?.name || '')
    : '';

  let text = `【${user.name}】Lv.${lv} HP:${hp}/${mhp} MP:${mp} ATK:${atk} EXP:${exp}`;
  text += ` | ダメージ:${dmg} 死亡:${deaths}回 Wordle:${wordle} 早押し:${hayaoshi} クイズ:${quiz}`;
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
  const imgFile = user.charImage || (user.charDef ? (charImages[user.charDef.id] || 'kisyokeee.png') : 'kisyokeee.png');
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
              ${user.iconName ? `<div class="sm-icon-name">${escapeHtml(user.iconName)}</div>` : ''}
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
              <div class="sm-section-title" style="margin-top:8px">📈 記録</div>
              <div class="sm-stats">
                <div class="sm-stat"><span class="sm-stat-label">コメント数</span><span class="sm-stat-val">${user.commentCount || 0}</span></div>
                <div class="sm-stat"><span class="sm-stat-label">合計ダメージ</span><span class="sm-stat-val">${(user.totalDmgDealt || 0).toLocaleString()}</span></div>
                <div class="sm-stat"><span class="sm-stat-label">Wordle正解</span><span class="sm-stat-val">${user.wordleWins || 0} 回</span></div>
                <div class="sm-stat"><span class="sm-stat-label">早押し正解</span><span class="sm-stat-val">${user.hayaoshiWins || 0} 回</span></div>
                <div class="sm-stat"><span class="sm-stat-label">クイズ正解</span><span class="sm-stat-val">${(user.tc?.quizWins || 0)} 回</span></div>
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
  if (autoClose !== false) setTimeout(close, 5000);
}

// ── ダメージランキング ─────────────────────────────────────────────
function showDamageRanking(dmgMap) {
  if (compactMode) return;
  if (!Object.keys(dmgMap).length) return;
  rankingState = {
    dmgMap,
    panelX: parseInt(localStorage.getItem('rankingPanelX')) || (stage.clientWidth - 220),
    panelY: parseInt(localStorage.getItem('rankingPanelY')) || 10,
  };
  renderRankingPanel();
}

function showMpRanking() {
  if (compactMode) return;
  const active = Object.values(users).filter(u => u.el);
  if (!active.length) return;
  mpRankingState = {
    panelX: parseInt(localStorage.getItem('mpRankingPanelX')) || Math.max(0, stage.clientWidth - 450),
    panelY: parseInt(localStorage.getItem('mpRankingPanelY')) || 10,
  };
  renderMpRankingPanel();
}

function renderMpRankingPanel() {
  let panel = document.getElementById('mpRankingPanel');
  if (!mpRankingState) { if (panel) panel.remove(); return; }

  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'mpRankingPanel';
    stage.appendChild(panel);
    panel.addEventListener('mousedown', e => {
      if (e.button !== 0 || dragState || trashDragState || bossDragState || wordleDragState) return;
      const r = panel.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      mpRankingDragState = { ox: r.left - sr.left, oy: r.top - sr.top, sx: e.clientX, sy: e.clientY };
      e.preventDefault(); e.stopPropagation();
    });
  }

  panel.style.left = mpRankingState.panelX + 'px';
  panel.style.top  = mpRankingState.panelY + 'px';

  const entries = Object.values(users)
    .filter(u => u.el)
    .map(u => ({ name: u.name || u.ipid, mp: u.mp ?? 0 }))
    .sort((a, b) => b.mp - a.mp)
    .slice(0, 5);

  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  let html = '<div class="ranking-header ranking-header-mp">💎 MPランキング<span class="ranking-close" onclick="mpRankingState=null;document.getElementById(\'mpRankingPanel\')?.remove()">✕</span></div>';
  entries.forEach((entry, i) => {
    html += `<div class="ranking-row">
      <span class="ranking-medal">${medals[i]}</span>
      <span class="ranking-name">${escapeHtml(entry.name)}</span>
      <span class="ranking-mp">${(entry.mp ?? 0).toLocaleString()} MP</span>
    </div>`;
  });
  panel.innerHTML = html;
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

  const entries = Object.values(rankingState.dmgMap)
    .sort((a, b) => b.totalDmg - a.totalDmg)
    .slice(0, 5);

  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  let html = '<div class="ranking-header">⚔️ ダメージランキング<span class="ranking-close" onclick="rankingState=null;document.getElementById(\'rankingPanel\')?.remove()">✕</span></div>';
  entries.forEach((entry, i) => {
    html += `<div class="ranking-row">
      <span class="ranking-medal">${medals[i]}</span>
      <span class="ranking-name">${escapeHtml(entry.name)}</span>
      <span class="ranking-dmg">${entry.totalDmg.toLocaleString()}</span>
    </div>`;
  });
  panel.innerHTML = html;
}

setInterval(() => {
  if (rankingState)   renderRankingPanel();
  if (mpRankingState) renderMpRankingPanel();
}, 1000);

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
let wordleWords      = [];
let wordleState      = null; // { answer, guesses[], panelX, panelY, winnerName }
let wordleDragState  = null;
let wordleDisplayRows = parseInt(localStorage.getItem('wordleDisplayRows')) || 10;

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
  const DISPLAY_ROWS  = wordleDisplayRows;  // 最新N行だけ表示（管理パネルから変更可）
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
  user.mp = (user.mp ?? 0) + 20;
  updateStatsDisplay(user);
  const { x, y } = getCharCenter(user);
  showDamageNumber(x, y - 30, '💊+20', false, 20, '#86efac');
  showDamageNumber(x, y - 60, 'MP+20', false, 20, '#60a5fa');
  spawnFireworks(x, y);
  playLocalSound(SOUND_QUIZ_CORRECT);

  setTimeout(() => { if (quizState) nextQuizQuestion(); }, 4000);
}

// ── スロットマシン ────────────────────────────────────────────────
const SLOT_ICONS = ['🍒', '🔔', '⭐', '💎', '7️⃣'];

// 結果先行方式: 当選確率を直接指定（%）、残りはハズレ
const SLOT_MP_DEFAULTS = { slotMpJackpot: 200, slotMpDiamond: 60, slotMpStar: 25, slotMpBell: 10, slotMpCherry: 5 };
function _loadSlotMp(key) { const v = parseInt(localStorage.getItem(key)); return (!isNaN(v) && v >= 0) ? v : SLOT_MP_DEFAULTS[key]; }
let SLOT_OUTCOMES = [
  { icon: '7️⃣', pct:  0.5, label: '🎰 JACKPOT！！！', mp: _loadSlotMp('slotMpJackpot'), jackpot: true, sound: SOUND_SLOT_777    },
  { icon: '💎', pct:  1.0, label: '💎 ダイヤ！！',    mp: _loadSlotMp('slotMpDiamond'),               sound: SOUND_SLOT_PIRORI },
  { icon: '⭐', pct:  5.0, label: '⭐ スター！',      mp: _loadSlotMp('slotMpStar'),                   sound: SOUND_SLOT_PIRORI },
  { icon: '🔔', pct: 10.0, label: '🔔 ベル！',        mp: _loadSlotMp('slotMpBell'),                   sound: SOUND_SLOT_PIRORI },
  { icon: '🍒', pct: 20.0, label: '🍒 チェリー！',    mp: _loadSlotMp('slotMpCherry'),                 sound: SOUND_SLOT_CHERRY },
]; // ハズレ = 63.5%

function rollSlotOutcome() {
  const rand = Math.random() * 100;
  let cum = 0;
  for (const o of SLOT_OUTCOMES) {
    cum += o.pct;
    if (rand < cum) return { reels: [o.icon, o.icon, o.icon], result: o };
  }
  // ハズレ: 三つ揃いにならない表示用絵柄を生成
  const pick = () => SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)];
  const r = [pick(), pick(), pick()];
  if (r[0] === r[1] && r[1] === r[2]) {
    r[2] = SLOT_ICONS[(SLOT_ICONS.indexOf(r[2]) + 1) % SLOT_ICONS.length];
  }
  return { reels: r, result: { label: 'ハズレ…', mp: 0, sound: SOUND_SLOT_MISS } };
}

const SLOT_PROB_DEFAULTS = { cherry: 20, bell: 10, star: 5, diamond: 1, jackpot: 0.5 };

function loadSlotProbs() {
  const saved = JSON.parse(localStorage.getItem('slotProbs') || 'null') || {};
  const d = SLOT_PROB_DEFAULTS;
  return {
    cherry:  parseFloat(saved.cherry  ?? d.cherry),
    bell:    parseFloat(saved.bell    ?? d.bell),
    star:    parseFloat(saved.star    ?? d.star),
    diamond: parseFloat(saved.diamond ?? d.diamond),
    jackpot: parseFloat(saved.jackpot ?? d.jackpot),
  };
}

function applySlotProbs(probs) {
  // SLOT_OUTCOMES の順: [jackpot, diamond, star, bell, cherry]
  SLOT_OUTCOMES[0].pct = probs.jackpot;
  SLOT_OUTCOMES[1].pct = probs.diamond;
  SLOT_OUTCOMES[2].pct = probs.star;
  SLOT_OUTCOMES[3].pct = probs.bell;
  SLOT_OUTCOMES[4].pct = probs.cherry;
  localStorage.setItem('slotProbs', JSON.stringify(probs));
  saveSettingsToServer();
  document.querySelectorAll('.slot-miss-rate').forEach(el => {
    const total = probs.cherry + probs.bell + probs.star + probs.diamond + probs.jackpot;
    el.textContent = Math.max(0, 100 - total).toFixed(1) + '%';
  });
}

(function initSlotProbSliders() {
  const defs = [
    { key: 'cherry',  id: 'slotProbCherry',  valId: 'slotProbCherryVal'  },
    { key: 'bell',    id: 'slotProbBell',     valId: 'slotProbBellVal'    },
    { key: 'star',    id: 'slotProbStar',     valId: 'slotProbStarVal'    },
    { key: 'diamond', id: 'slotProbDiamond',  valId: 'slotProbDiamondVal' },
    { key: 'jackpot', id: 'slotProbJackpot',  valId: 'slotProbJackpotVal' },
  ];
  const saved = loadSlotProbs();
  defs.forEach(({ key, id, valId }) => {
    const slider = document.getElementById(id);
    const valEl  = document.getElementById(valId);
    const reset  = document.getElementById(id + 'Reset');
    if (!slider) return;
    slider.value = saved[key];
    if (valEl) valEl.textContent = saved[key] + '%';
    slider.addEventListener('input', () => {
      const v = parseFloat(slider.value);
      if (valEl) valEl.textContent = v + '%';
      const probs = loadSlotProbs();
      probs[key] = v;
      applySlotProbs(probs);
    });
    reset?.addEventListener('click', () => {
      const def = SLOT_PROB_DEFAULTS[key];
      slider.value = def;
      if (valEl) valEl.textContent = def + '%';
      const probs = loadSlotProbs();
      probs[key] = def;
      applySlotProbs(probs);
    });
  });
  applySlotProbs(saved);
})();

const SLOT_INTERVAL = 330; // リール停止間隔(ms)
const SLOT_TOTAL_MS = SLOT_INTERVAL * 3 + 200; // 結果表示まで
const SLOT_PANEL_MS = SLOT_TOTAL_MS + 1600;    // パネル消滅まで

function playSlot(user) {
  if (!user.el) return;
  user.slotSpinning = true;
  if (slotSoundEnabled) playLocalSound(SOUND_SLOT_START, 0.7);

  const { reels, result } = rollSlotOutcome();

  const panel = document.createElement('div');
  panel.className = 'slot-panel';
  panel.innerHTML =
    `<div class="slot-title">🎰 スロット</div>` +
    `<div class="slot-reels">` +
      `<div class="slot-reel slot-spinning">❓</div>` +
      `<div class="slot-reel slot-spinning">❓</div>` +
      `<div class="slot-reel slot-spinning">❓</div>` +
    `</div>` +
    `<div class="slot-result"></div>`;
  user.el.appendChild(panel);

  const reelEls = panel.querySelectorAll('.slot-reel');
  const resultEl = panel.querySelector('.slot-result');

  [0, 1, 2].forEach(i => {
    setTimeout(() => {
      if (!reelEls[i]) return;
      reelEls[i].textContent = reels[i];
      reelEls[i].classList.remove('slot-spinning');
      reelEls[i].classList.add('slot-stopped');
      if (slotSoundEnabled) playLocalSound(SOUND_SLOT_STOP);
    }, (i + 1) * SLOT_INTERVAL);
  });

  setTimeout(() => {
    if (!panel.isConnected) return;
    resultEl.textContent = result.label;
    resultEl.className   = 'slot-result' + (result.mp > 0 ? ' slot-win' : '');
    if (slotSoundEnabled) playLocalSound(result.sound);

    if (result.mp > 0) {
      user.mp = (user.mp ?? 0) + result.mp;
      updateStatsDisplay(user);
      const { x, y } = getCharCenter(user);
      showDamageNumber(x, y - 50, `🎰 MP+${result.mp}`, false, 18, '#fbbf24');
      if (result.jackpot) {
        Object.values(users).filter(u => u.el).forEach(u => {
          const { x: ux, y: uy } = getCharCenter(u);
          spawnFireworks(ux, uy);
        });
        spawnHeartShower(x, y);
        playLocalSound(SOUND_MYTH_DROP);
      } else if (result.mp >= 25) {
        spawnFireworks(x, y);
        playLocalSound(SOUND_HAYAOSHI_WHITE);
      }
    }

    if (!user.tc) user.tc = {};
    user.tc.slotPlays = (user.tc.slotPlays || 0) + 1;
    if (result.mp > 0) user.tc.slotWins = (user.tc.slotWins || 0) + 1;
  }, SLOT_TOTAL_MS);

  setTimeout(() => {
    panel.remove();
    user.slotSpinning = false;
    // 自動モード継続
    if (user.slotAutoMode) {
      if ((user.mp ?? 0) >= 3) {
        user.mp -= 3;
        updateStatsDisplay(user);
        playSlot(user);
      } else {
        user.slotAutoMode = false;
        if (user.el) showBubble(user, 'MPがなくなりました… スロット停止', {});
        addToLog(user, '🎰 MP切れ・スロット自動停止', '#94a3b8');
      }
    }
  }, SLOT_PANEL_MS);
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

document.getElementById('toggleBombBtn').addEventListener('click', () => {
  bombHidden = !bombHidden;
  document.getElementById('bombBtn').style.display = bombHidden ? 'none' : '';
  document.getElementById('toggleBombBtn').classList.toggle('active', bombHidden);
});

document.getElementById('toggleTrashBtn').addEventListener('click', () => {
  trashHidden = !trashHidden;
  document.getElementById('trashCan').style.display = trashHidden ? 'none' : '';
  document.getElementById('toggleTrashBtn').classList.toggle('active', trashHidden);
});

document.getElementById('slotSoundBtn').addEventListener('click', () => {
  slotSoundEnabled = !slotSoundEnabled;
  document.getElementById('slotSoundBtn').classList.toggle('active', !slotSoundEnabled);
  localStorage.setItem('slotSoundEnabled', slotSoundEnabled ? '1' : '0');
});
(function initSlotSound() {
  const saved = localStorage.getItem('slotSoundEnabled');
  if (saved === '0') {
    slotSoundEnabled = false;
    document.getElementById('slotSoundBtn').classList.add('active');
  }
})();

document.getElementById('slotAllStartBtn').addEventListener('click', () => {
  Object.values(users).filter(u => u.el && !u.slotAutoMode && !u.slotSpinning).forEach(u => {
    if ((u.mp ?? 0) < 1) return;
    u.slotAutoMode = true;
    u.mp -= 1;
    updateStatsDisplay(u);
    playSlot(u);
  });
});

document.getElementById('slotAllStopBtn').addEventListener('click', () => {
  Object.values(users).filter(u => u.el).forEach(u => { u.slotAutoMode = false; });
});

// ── 音量設定 init & listeners ─────────────────────────────────────
(function initVolumeSettings() {
  const load = (key, def) => { const v = localStorage.getItem(key); return v !== null ? parseFloat(v) : def; };
  seVolume    = load('seVolume',    1.0);
  voiceVolume = load('voiceVolume', 1.0);
  const set = (id, val, labelId) => {
    const el = document.getElementById(id); if (el) el.value = val;
    const lbl = document.getElementById(labelId); if (lbl) lbl.textContent = Math.round(val * 100) + '%';
  };
  set('seVolumeSlider',    seVolume,    'seVolumeVal');
  set('voiceVolumeSlider', voiceVolume, 'voiceVolumeVal');
})();

document.getElementById('seVolumeSlider')?.addEventListener('input', e => {
  seVolume = parseFloat(e.target.value);
  localStorage.setItem('seVolume', seVolume);
  saveSettingsToServer();
  document.getElementById('seVolumeVal').textContent = Math.round(seVolume * 100) + '%';
});
document.getElementById('voiceVolumeSlider')?.addEventListener('input', e => {
  voiceVolume = parseFloat(e.target.value);
  localStorage.setItem('voiceVolume', voiceVolume);
  saveSettingsToServer();
  document.getElementById('voiceVolumeVal').textContent = Math.round(voiceVolume * 100) + '%';
});

// ── TTS設定 init & listeners ────────────────────────────────────
(function initTTSSettings() {
  const load = (key, def) => { const v = localStorage.getItem(key); return v !== null ? v : def; };
  ttsModel     = load('ttsModel',     '');
  ttsVoice     = load('ttsVoice',     'ja-JP-NanamiNeural-Female');
  ttsF0UpKey   = parseFloat(load('ttsF0UpKey',   0));
  ttsIndexRate = parseFloat(load('ttsIndexRate', 0.75));
  ttsProtect   = parseFloat(load('ttsProtect',   0.33));
  ttsSpeed     = parseInt(load('ttsSpeed',       0));
  ttsVolume    = parseFloat(load('ttsVolume',    1.0));
  const ids = ['ttsModelInput','ttsVoiceInput','ttsF0UpKeySlider','ttsIndexRateSlider','ttsProtectSlider','ttsSpeedSlider','ttsVolumeSlider'];
  const vals = [ttsModel, ttsVoice, ttsF0UpKey, ttsIndexRate, ttsProtect, ttsSpeed, ttsVolume];
  ids.forEach((id, i) => { const el = document.getElementById(id); if (el) el.value = vals[i]; });
  const show = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  show('ttsF0UpKeyVal',   ttsF0UpKey);
  show('ttsIndexRateVal', ttsIndexRate);
  show('ttsProtectVal',   ttsProtect);
  show('ttsSpeedVal',     ttsSpeed);
  show('ttsVolumeVal',    Math.round(ttsVolume * 100) + '%');
})();

const _ttsListeners = [
  ['ttsModelInput',      'input',  e => { ttsModel     = e.target.value; localStorage.setItem('ttsModel',     ttsModel); }],
  ['ttsVoiceInput',      'input',  e => { ttsVoice     = e.target.value; localStorage.setItem('ttsVoice',     ttsVoice); }],
  ['ttsF0UpKeySlider',   'input',  e => { ttsF0UpKey   = parseFloat(e.target.value); localStorage.setItem('ttsF0UpKey',   ttsF0UpKey);   document.getElementById('ttsF0UpKeyVal').textContent   = ttsF0UpKey; }],
  ['ttsIndexRateSlider', 'input',  e => { ttsIndexRate = parseFloat(e.target.value); localStorage.setItem('ttsIndexRate', ttsIndexRate); document.getElementById('ttsIndexRateVal').textContent = ttsIndexRate; }],
  ['ttsProtectSlider',   'input',  e => { ttsProtect   = parseFloat(e.target.value); localStorage.setItem('ttsProtect',   ttsProtect);   document.getElementById('ttsProtectVal').textContent   = ttsProtect; }],
  ['ttsSpeedSlider',     'input',  e => { ttsSpeed     = parseInt(e.target.value);   localStorage.setItem('ttsSpeed',     ttsSpeed);     document.getElementById('ttsSpeedVal').textContent     = ttsSpeed; }],
  ['ttsVolumeSlider',    'input',  e => { ttsVolume    = parseFloat(e.target.value); localStorage.setItem('ttsVolume',    ttsVolume);    document.getElementById('ttsVolumeVal').textContent    = Math.round(ttsVolume * 100) + '%'; }],
];
_ttsListeners.forEach(([id, ev, fn]) => document.getElementById(id)?.addEventListener(ev, fn));

// ── SD生成設定 init & listeners ────────────────────────────────
(function initSDSettings() {
  const load = (key, def) => { const v = localStorage.getItem(key); return v !== null ? v : def; };
  sdWidth          = parseInt(load('sdWidth',  1600));
  sdHeight         = parseInt(load('sdHeight', 1000));
  sdSteps          = parseInt(load('sdSteps',  20));
  sdPositiveSuffix = load('sdPositiveSuffix', 'masterpiece, best quality');
  sdNegative       = load('sdNegative', sdNegative);
  sdDisplayTime    = parseInt(load('sdDisplayTime', 10));
  sdMosaicKeywords = load('sdMosaicKeywords', '');
  sdMosaicBlock    = parseInt(load('sdMosaicBlock', 20));
  charExcludeIds   = new Set((localStorage.getItem('charExcludeIds') || '').split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0));

  const sdPopWidth = parseInt(load('sdPopWidth', 480));
  document.getElementById('sdWidthInput').value           = sdWidth;
  document.getElementById('sdHeightInput').value          = sdHeight;
  document.getElementById('sdStepsSlider').value          = sdSteps;
  document.getElementById('sdStepsVal').textContent       = sdSteps;
  document.getElementById('sdPopWidthSlider').value       = sdPopWidth;
  document.getElementById('sdPopWidthVal').textContent    = sdPopWidth + 'px';
  document.getElementById('sdPositiveSuffixInput').value  = sdPositiveSuffix;
  document.getElementById('sdNegativeInput').value        = sdNegative;
  document.getElementById('sdDisplayTimeSlider').value    = sdDisplayTime;
  document.getElementById('sdDisplayTimeVal').textContent = sdDisplayTime + '秒';
  document.getElementById('sdMosaicKeywordsInput').value  = sdMosaicKeywords;
  document.getElementById('sdMosaicBlockSlider').value    = sdMosaicBlock;
  document.getElementById('sdMosaicBlockVal').textContent = sdMosaicBlock + 'px';
})();

// SD設定: DOM が信頼できる値の源。変更のたびに localStorage へ保存。
document.getElementById('sdWidthInput').addEventListener('input',  e => localStorage.setItem('sdWidth', e.target.value));
document.getElementById('sdWidthInput').addEventListener('change', e => localStorage.setItem('sdWidth', e.target.value));
document.getElementById('sdHeightInput').addEventListener('input',  e => localStorage.setItem('sdHeight', e.target.value));
document.getElementById('sdHeightInput').addEventListener('change', e => localStorage.setItem('sdHeight', e.target.value));
document.getElementById('sdStepsSlider').addEventListener('input', e => {
  document.getElementById('sdStepsVal').textContent = e.target.value;
  localStorage.setItem('sdSteps', e.target.value);
});
document.getElementById('sdPopWidthSlider').addEventListener('input', e => {
  document.getElementById('sdPopWidthVal').textContent = e.target.value + 'px';
  localStorage.setItem('sdPopWidth', e.target.value);
});
document.getElementById('sdDisplayTimeSlider').addEventListener('input', e => {
  document.getElementById('sdDisplayTimeVal').textContent = e.target.value + '秒';
  localStorage.setItem('sdDisplayTime', e.target.value);
});
document.getElementById('sdPositiveSuffixInput').addEventListener('input',  e => localStorage.setItem('sdPositiveSuffix', e.target.value));
document.getElementById('sdNegativeInput').addEventListener('input',        e => localStorage.setItem('sdNegative', e.target.value));
document.getElementById('sdMosaicKeywordsInput').addEventListener('input',  e => localStorage.setItem('sdMosaicKeywords', e.target.value));
document.getElementById('sdMosaicBlockSlider').addEventListener('input', e => {
  document.getElementById('sdMosaicBlockVal').textContent = e.target.value + 'px';
  localStorage.setItem('sdMosaicBlock', e.target.value);
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
  const sr = stage.getBoundingClientRect();
  const er = user.el.getBoundingClientRect();
  const cx = er.left - sr.left + er.width / 2;
  const cy = er.bottom - sr.top + 4 - 36;
  popup.style.left = (cx - 80) + 'px';
  popup.style.top  = cy + 'px';
  setTimeout(() => {
    popup.style.transition = 'opacity 0.6s, transform 0.6s';
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(20px) scale(0.9)';
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
    if (d.id === 'fiveMinBtn') replyFn({ type: 'state', data: { fiveMinMode } });
  } else if (d.type === 'slider' && d.id) {
    const el = document.getElementById(d.id);
    if (el) { el.value = d.value; el.dispatchEvent(new Event('input')); }
    if (d.id === 'gatherMarginLeftSlider') {
      gatherMarginLeft = parseInt(d.value) || 0;
      localStorage.setItem('gatherMarginLeft', gatherMarginLeft);
      saveSettingsToServer();
    } else if (d.id === 'gatherMarginRightSlider') {
      gatherMarginRight = parseInt(d.value) || 0;
      localStorage.setItem('gatherMarginRight', gatherMarginRight);
      saveSettingsToServer();
    }
  } else if (d.type === 'select' && d.id) {
    const el = document.getElementById(d.id);
    if (el) { el.value = d.value; el.dispatchEvent(new Event('change')); }
  } else if (d.type === 'color' && d.id) {
    const el = document.getElementById(d.id);
    if (el) { el.value = d.value; el.dispatchEvent(new Event('input')); }
  } else if (d.type === 'getState' || d.type === 'ping') {
    const sliderIds = ['nikoSizeSlider','nikoOpacitySlider','hayaoshiFreqSlider','hayaoshiSpeedSlider',
                       'bossHpScaleSlider','bossAtkCoeffSlider','counterRateSlider','charSizeSlider','bossSizeSlider','brHpMultSlider','taimanHpMultSlider',
                       'slotProbCherry','slotProbBell','slotProbStar','slotProbDiamond','slotProbJackpot',
                       'afkOpacitySlider','afkGrayscaleSlider','afkBrightnessSlider',
                       'kaiSpeedSlider','kaiRestitutionSlider','kaiGravitySlider','kaiBulletSizeSlider'];
    const state = {};
    sliderIds.forEach(sid => { const el = document.getElementById(sid); if (el) state[sid] = el.value; });
    state.bgColor    = document.getElementById('bgColor')?.value;
    state.moveArea   = document.getElementById('moveAreaSelect')?.value;
    state.bgImageUrl = localStorage.getItem('bgImageUrl') || '';
    state.ttsModel     = ttsModel;
    state.ttsVoice     = ttsVoice;
    state.ttsF0UpKey   = ttsF0UpKey;
    state.ttsIndexRate = ttsIndexRate;
    state.ttsProtect   = ttsProtect;
    state.ttsSpeed     = ttsSpeed;
    state.sdWidth          = sdWidth;
    state.sdHeight         = sdHeight;
    state.sdSteps          = sdSteps;
    state.sdPopWidth       = parseInt(document.getElementById('sdPopWidthSlider')?.value) || 480;
    state.sdPositiveSuffix = sdPositiveSuffix;
    state.sdNegative       = sdNegative;
    state.sdDisplayTime    = sdDisplayTime;
    state.sdMosaicKeywords = sdMosaicKeywords;
    state.sdMosaicBlock    = sdMosaicBlock;
    state.charExcludeIds        = localStorage.getItem('charExcludeIds') || '';
    state.taimanDefeatCommand   = taimanDefeatCommand;
    state.taimanCharScale       = taimanCharScale;
    state.gatherMarginLeft      = gatherMarginLeft;
    state.gatherMarginRight     = gatherMarginRight;
    state.slotMpJackpot = SLOT_OUTCOMES[0].mp;
    state.slotMpDiamond = SLOT_OUTCOMES[1].mp;
    state.slotMpStar    = SLOT_OUTCOMES[2].mp;
    state.slotMpBell    = SLOT_OUTCOMES[3].mp;
    state.slotMpCherry  = SLOT_OUTCOMES[4].mp;
    state.seVolume    = seVolume;
    state.voiceVolume = voiceVolume;
    state.aiModel    = aiModel;
    state.aiSystem   = aiSystem;
    state.fiveMinMode = fiveMinMode;
    replyFn({ type: d.type === 'ping' ? 'pong' : 'state', data: state });
  } else if (d.type === 'volumeText') {
    const elMap = { seVolume:'seVolumeSlider', voiceVolume:'voiceVolumeSlider' };
    const elId = elMap[d.key];
    if (elId) {
      const el = document.getElementById(elId);
      if (el) el.value = d.value;
      localStorage.setItem(d.key, d.value);
      if (d.key === 'seVolume')    { seVolume    = parseFloat(d.value); const v = document.getElementById('seVolumeVal');    if (v) v.textContent = Math.round(seVolume    * 100) + '%'; }
      if (d.key === 'voiceVolume') { voiceVolume = parseFloat(d.value); const v = document.getElementById('voiceVolumeVal'); if (v) v.textContent = Math.round(voiceVolume * 100) + '%'; }
    }
  } else if (d.type === 'ttsText') {
    const elMap = { ttsModel:'ttsModelInput', ttsVoice:'ttsVoiceInput', ttsF0UpKey:'ttsF0UpKeySlider',
                    ttsIndexRate:'ttsIndexRateSlider', ttsProtect:'ttsProtectSlider', ttsSpeed:'ttsSpeedSlider',
                    ttsVolume:'ttsVolumeSlider' };
    const valMap = { ttsF0UpKey:'ttsF0UpKeyVal', ttsIndexRate:'ttsIndexRateVal', ttsProtect:'ttsProtectVal', ttsSpeed:'ttsSpeedVal',
                     ttsVolume:'ttsVolumeVal' };
    const elId = elMap[d.key];
    if (elId) {
      const el = document.getElementById(elId);
      if (el) {
        el.value = d.value;
        localStorage.setItem(d.key, d.value);
        if (d.key === 'ttsModel')     ttsModel     = d.value;
        if (d.key === 'ttsVoice')     ttsVoice     = d.value;
        if (d.key === 'ttsF0UpKey')   ttsF0UpKey   = parseFloat(d.value);
        if (d.key === 'ttsIndexRate') ttsIndexRate = parseFloat(d.value);
        if (d.key === 'ttsProtect')   ttsProtect   = parseFloat(d.value);
        if (d.key === 'ttsSpeed')     ttsSpeed     = parseInt(d.value);
        if (d.key === 'ttsVolume')    ttsVolume    = parseFloat(d.value);
        if (valMap[d.key]) { const v = document.getElementById(valMap[d.key]); if (v) v.textContent = d.value; }
      }
    }
  } else if (d.type === 'aiText') {
    const elMap = { aiModel: 'aiModelInput', aiSystem: 'aiSystemInput' };
    const elId = elMap[d.key];
    if (elId) {
      const el = document.getElementById(elId);
      if (el) el.value = d.value;
      localStorage.setItem(d.key, d.value);
      if (d.key === 'aiModel')  aiModel  = d.value;
      if (d.key === 'aiSystem') aiSystem = d.value;
    }
  } else if (d.type === 'sdText') {
    const elMap = { sdWidth:'sdWidthInput', sdHeight:'sdHeightInput', sdSteps:'sdStepsSlider',
                    sdPopWidth:'sdPopWidthSlider',
                    sdPositiveSuffix:'sdPositiveSuffixInput', sdNegative:'sdNegativeInput',
                    sdDisplayTime:'sdDisplayTimeSlider', sdMosaicKeywords:'sdMosaicKeywordsInput',
                    sdMosaicBlock:'sdMosaicBlockSlider' };
    const elId = elMap[d.key];
    if (elId) {
      localStorage.setItem(d.key, d.value);
      if (d.key === 'sdWidth')          sdWidth          = parseInt(d.value)   || sdWidth;
      if (d.key === 'sdHeight')         sdHeight         = parseInt(d.value)   || sdHeight;
      if (d.key === 'sdSteps')          sdSteps          = parseInt(d.value)   || sdSteps;
      if (d.key === 'sdPositiveSuffix') sdPositiveSuffix = d.value;
      if (d.key === 'sdNegative')       sdNegative       = d.value;
      if (d.key === 'sdDisplayTime')    sdDisplayTime    = parseInt(d.value)   || sdDisplayTime;
      if (d.key === 'sdMosaicKeywords') sdMosaicKeywords = d.value;
      if (d.key === 'sdMosaicBlock')    sdMosaicBlock    = parseInt(d.value)   || sdMosaicBlock;
      const el = document.getElementById(elId);
      if (el) {
        el.value = d.value;
        if (d.key === 'sdSteps')       document.getElementById('sdStepsVal').textContent       = d.value;
        if (d.key === 'sdDisplayTime') document.getElementById('sdDisplayTimeVal').textContent = d.value + '秒';
        if (d.key === 'sdPopWidth')    document.getElementById('sdPopWidthVal').textContent    = d.value + 'px';
        if (d.key === 'sdMosaicBlock') document.getElementById('sdMosaicBlockVal').textContent = d.value + 'px';
      }
    }
  } else if (d.type === 'processComment') {
    if (d.comment) handleComment(d.comment);
  } else if (d.type === 'openNovel') {
    openNovelModal();
  } else if (d.type === 'getUsers') {
    const list = Object.values(users).filter(u => u.el).map(u => ({ ipid: u.ipid, name: u.name || '名無し', sizeScale: u.sizeScale || 1.0 }));
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
  } else if (d.type === 'showMpRanking') {
    showMpRanking();
  } else if (d.type === 'charIndivSize') {
    const u = users[d.ipid];
    if (u) { u.sizeScale = parseFloat(d.scale) || 1.0; applyAvatarStyle(u); renderPetBadge(u); }
  } else if (d.type === 'slotMp') {
    const keyMap = { slotMpJackpot: 0, slotMpDiamond: 1, slotMpStar: 2, slotMpBell: 3, slotMpCherry: 4 };
    const idx = keyMap[d.key];
    if (idx !== undefined) {
      const val = parseInt(d.value);
      if (!isNaN(val) && val >= 0) {
        SLOT_OUTCOMES[idx].mp = val;
        localStorage.setItem(d.key, val);
      }
    }
  } else if (d.type === 'giveMp') {
    const u = users[d.ipid];
    if (u) {
      u.mp = (u.mp ?? 0) + (parseInt(d.amount) || 0);
      showBubble(u, `MP +${parseInt(d.amount) || 0}！（現在 ${u.mp} MP）`, {});
    }
  } else if (d.type === 'raceStart') {
    startRace(parseInt(d.numHorses)||5, parseInt(d.betSeconds)||60);
  } else if (d.type === 'raceBegin') {
    beginRacing();
  } else if (d.type === 'raceCancel') {
    cancelRace();
  } else if (d.type === 'charFontSizes') {
    Object.assign(charFontSizes, d.sizes);
    localStorage.setItem('charFontSizes', JSON.stringify(charFontSizes));
    saveSettingsToServer();
    applyCharFontSizes();
  } else if (d.type === 'wordleRows') {
    const v = parseInt(d.value);
    if (!isNaN(v) && v >= 1 && v <= 50) {
      wordleDisplayRows = v;
      localStorage.setItem('wordleDisplayRows', v);
      renderWordlePanel();
    }
  } else if (d.type === 'clearCharSave') {
    _charSaveData = {};
  } else if (d.type === 'taimanCharScale') {
    taimanCharScale = parseFloat(d.value) || 4;
    localStorage.setItem('taimanCharScale', taimanCharScale);
    saveSettingsToServer();
  } else if (d.type === 'taimanDefeatCmd') {
    taimanDefeatCommand = d.value || '';
    localStorage.setItem('taimanDefeatCommand', taimanDefeatCommand);
    saveSettingsToServer();
  } else if (d.type === 'charExclude') {
    localStorage.setItem('charExcludeIds', d.value);
    charExcludeIds = new Set((d.value || '').split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0));
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

// ── 5分無コメントで自動AFK ───────────────────────────────────────────
setInterval(() => {
  const now = Date.now();
  const AFK_TIMEOUT = 5 * 60 * 1000;
  Object.values(users).forEach(u => {
    if (!u.el || u.ko || u.afk || u.afkText) return;
    if (!u.lastCommentAt) return;
    if (now - u.lastCommentAt < AFK_TIMEOUT) return;
    u.afk = true;
    if (u.afkEl) u.afkEl.remove();
    const afkEl = document.createElement('div');
    afkEl.className = 'afk-bubble';
    afkEl.textContent = '💤 AFK';
    u.el.appendChild(afkEl);
    u.afkEl = afkEl;
    u.el.classList.add('char-afk');
  });
}, 30 * 1000);

// ── 競馬 ──────────────────────────────────────────────────────────
let raceState     = null;
let raceJackpot   = parseInt(localStorage.getItem('raceJackpot')) || 0;
let raceDragState = null;
const RACE_TOTAL_SEC = 20;

const RACE_BUBBLE_PHRASES = [
  'うおｗ', 'ええてｗ', 'uoooooooo', '', 'まてまて！','ゴールは？', 
  '脚が動かん…', '全力だ！', 'ガチ速い…', 'ここから！', 'うあああ！',
  'おそｗ','だる','はあ・・・','とんでもねえ速度','あいてうまｗ',
  '逃げたｗ','よわ','雑魚が','二度と逆らうなよ','ちんぽぽｐ','あとごーるのみ'
];

const RACE_CONDITIONS = [
  { label: '絶好調', emoji: '🔥', cls: 'cond-great',  weight: 5 },
  { label: '好調',   emoji: '✨', cls: 'cond-good',   weight: 4 },
  { label: '普通',   emoji: '😐', cls: 'cond-normal', weight: 3 },
  { label: 'やや不調', emoji: '😓', cls: 'cond-bad',  weight: 2 },
  { label: '不調',   emoji: '💤', cls: 'cond-worst',  weight: 1 },
];

function easeInOut(p) {
  return p < 0.5 ? 2*p*p : 1 - Math.pow(-2*p+2, 2)/2;
}

function getHorseX(horse, t, trackW) {
  const finishT = horse.finishT;
  if (!finishT || t >= finishT) return trackW;
  const p = t / finishT;
  // Piecewise easeInOut through waypoints based on pace style
  // pace=0: frontrunner (fast early, slow late)  pace=1: closer (slow early, explosive finish)
  const pace = horse.pace ?? 0.5;
  const w1 = 0.68 - pace * 0.56; // waypoint at p=0.40 (0.68→0.12)
  const w2 = 0.90 - pace * 0.42; // waypoint at p=0.75 (0.90→0.48)
  let base;
  if (p < 0.40) {
    base = easeInOut(p / 0.40) * w1;
  } else if (p < 0.75) {
    base = w1 + easeInOut((p - 0.40) / 0.35) * (w2 - w1);
  } else {
    base = w2 + easeInOut((p - 0.75) / 0.25) * (1.0 - w2);
  }
  // Forward-only tiny jitter (fades near finish to avoid overshooting)
  const jitter = (Math.sin(t * 3.7 + horse.dramaSeed) * 0.5 + 0.5) * 0.015 * (1 - p * p);
  return Math.max(0, Math.min(trackW * 0.99, (base + jitter) * trackW));
}

function startRace(numHorses, betSeconds) {
  if (raceState) return;
  const active = Object.values(users).filter(u => u.el && !u.ko);
  if (active.length < 2) { addSystemLog('⚠️ 競馬：参加キャラが2体以上必要です', '#f87171'); return; }
  const count = Math.min(numHorses || 5, active.length, 8);
  const shuffled = [...active].sort(() => Math.random() - 0.5).slice(0, count);
  const PACE_STYLES = ['front', 'front', 'steady', 'steady', 'back', 'back', 'steady'];
  const horses = shuffled.map((u, i) => {
    const cond = RACE_CONDITIONS[Math.floor(Math.random() * RACE_CONDITIONS.length)];
    const paceStyle = PACE_STYLES[Math.floor(Math.random() * PACE_STYLES.length)];
    const pace = paceStyle === 'front' ? Math.random() * 0.3 : paceStyle === 'back' ? 0.7 + Math.random() * 0.3 : 0.35 + Math.random() * 0.3;
    return {
      no: i+1,
      ipid: u.ipid,
      name: u.name || '名無し',
      imgFile: u.charImage || charImages[u.charDef?.id] || 'kisyokeee.png',
      finalRank: null,
      finishT: null,
      dramaSeed: Math.random() * Math.PI * 2,
      finished: false,
      finishTime: null,
      laneIdx: i,
      condLabel: cond.label,
      condEmoji: cond.emoji,
      condCls:   cond.cls,
      condWeight: cond.weight,
      pace,
      paceStyle,
    };
  });
  raceState = {
    phase: 'betting',
    horses,
    bets: [],
    pool: 0,
    betSeconds: betSeconds || 60,
    betRemaining: betSeconds || 60,
    panelX: 20,
    panelY: 60,
    raceStartTime: null,
    trackW: 0,
    payouts: null,
    resultOrder: null,
    _betTimerId: null,
    gapFactor: 0.5 + Math.random() * 2.5, // 0.5x=接戦 〜 3.0x=大差
  };
  renderRacePanel();
  startRaceFanfare();
  raceState._betTimerId = setInterval(() => {
    if (!raceState || raceState.phase !== 'betting') { clearInterval(raceState?._betTimerId); return; }
    raceState.betRemaining--;
    renderRacePanel();
    if (raceState.betRemaining <= 0) {
      clearInterval(raceState._betTimerId);
      beginRacing();
    }
  }, 1000);
  addSystemLog(`🏇 競馬スタート！受付${raceState.betSeconds}秒。「馬券 2 10」「馬券 1-2 10」「馬券 2-1-3 10」でベット！`, '#f59e0b');
}

function beginRacing() {
  if (!raceState || raceState.phase !== 'betting') return;
  if (raceState._betTimerId) { clearInterval(raceState._betTimerId); raceState._betTimerId = null; }
  stopRaceFanfare();
  // Weighted shuffle: better condition = higher chance of top finish
  const pool = [...raceState.horses];
  const order = [];
  while (pool.length > 0) {
    const total = pool.reduce((s, h) => s + h.condWeight, 0);
    let r = Math.random() * total, chosen = pool.length - 1;
    for (let i = 0; i < pool.length; i++) { r -= pool[i].condWeight; if (r <= 0) { chosen = i; break; } }
    order.push(...pool.splice(chosen, 1));
  }
  const nn = raceState.horses.length;
  order.forEach((h, i) => {
    h.finalRank = i + 1;
    h.finishT = RACE_TOTAL_SEC * (0.82 + (i / Math.max(nn - 1, 1)) * 0.16 * raceState.gapFactor);
  });
  raceState.phase = 'racing';
  raceState.raceStartTime = null;
  renderRacePanel();
  const gapMsg = raceState.gapFactor >= 2.2 ? '大差レースの予感…！' : raceState.gapFactor <= 0.85 ? '超接戦になりそう…！' : 'レーススタート！';
  addSystemLog(`🏇 ${gapMsg}`, '#f59e0b');
  const panel = document.getElementById('racePanel');
  // Countdown overlay 3→2→1→GO! then start animation
  // trackW is measured after countdown so CSS width transition (0.3s) is guaranteed complete
  if (panel) {
    const cdEl = document.createElement('div');
    cdEl.className = 'race-countdown';
    cdEl.textContent = '3';
    panel.appendChild(cdEl);
    playLocalSound(SOUND_RACE_COUNTDOWN);
    let cdCount = 3;
    const cdTick = setInterval(() => {
      cdCount--;
      if (cdCount > 0) {
        cdEl.textContent = String(cdCount);
        cdEl.style.animation = 'none'; void cdEl.offsetWidth; cdEl.style.animation = '';
        playLocalSound(SOUND_RACE_COUNTDOWN);
      } else {
        clearInterval(cdTick);
        cdEl.textContent = 'GO!';
        cdEl.classList.add('race-countdown-go');
        playLocalSound(SOUND_RACE_GATE);
        setTimeout(() => {
          cdEl.remove();
          // Measure track width here — panel has fully expanded by now
          const trackEl = panel.querySelector('.race-track-inner');
          raceState.trackW = trackEl ? Math.max(200, trackEl.offsetWidth - 82) : 680;
          spawnConfettiSmall(14);
          raceState._confettiTimerId = setInterval(() => spawnConfettiSmall(10), 500);
          requestAnimationFrame(ts => { raceState.raceStartTime = ts; requestAnimationFrame(raceAnimFrame); });
        }, 650);
      }
    }, 900);
  } else {
    requestAnimationFrame(ts => { raceState.raceStartTime = ts; requestAnimationFrame(raceAnimFrame); });
  }
}

function showRaceHorseBubble(horse, text, extraCls) {
  const panel = document.getElementById('racePanel');
  const horseEl = document.getElementById('rh-' + horse.no);
  if (!panel || !horseEl) return;
  panel.querySelectorAll(`.race-horse-bubble[data-no="${horse.no}"]`).forEach(b => b.remove());
  const pr = panel.getBoundingClientRect();
  const hr = horseEl.getBoundingClientRect();
  const x = hr.left - pr.left + hr.width / 2;
  const y = hr.top - pr.top;
  const msg = text ?? RACE_BUBBLE_PHRASES[Math.floor(Math.random() * RACE_BUBBLE_PHRASES.length)];
  const b = document.createElement('div');
  b.className = 'race-horse-bubble' + (extraCls ? ' ' + extraCls : '');
  b.dataset.no = horse.no;
  b.textContent = msg;
  b.style.left = x + 'px';
  b.style.top  = y + 'px';
  panel.appendChild(b);
  setTimeout(() => b.remove(), 2400);
}

function triggerRaceCheer(horse) {
  showRaceHorseBubble(horse, 'うおおお！', 'race-cheer-bubble');
  const el = document.getElementById('rh-' + horse.no);
  if (!el) return;
  el.classList.remove('race-cheer-flash');
  void el.offsetWidth;
  el.classList.add('race-cheer-flash');
  el.addEventListener('animationend', () => el.classList.remove('race-cheer-flash'), { once: true });
}

function raceAnimFrame(ts) {
  if (!raceState || raceState.phase !== 'racing') return;
  const t = (ts - raceState.raceStartTime) / 1000;
  const panel = document.getElementById('racePanel');
  if (!panel) return;
  // Periodic speech bubbles + horse run sounds
  raceState.horses.forEach(h => {
    if (h.finished) return;
    if (h._nextSpeakAt === undefined) h._nextSpeakAt = 1.5 + Math.random() * 3;
    if (t >= h._nextSpeakAt) {
      h._nextSpeakAt = t + 3 + Math.random() * 5;
      showRaceHorseBubble(h);
    }
    if (h._nextHorseSoundAt === undefined) h._nextHorseSoundAt = Math.random() * 2;
    if (t >= h._nextHorseSoundAt) {
      h._nextHorseSoundAt = t + 1.5 + Math.random() * 2.5;
      playLocalSound(SOUND_RACE_HORSE[Math.floor(Math.random() * SOUND_RACE_HORSE.length)], 0.35);
    }
  });
  let allDone = true;
  raceState.horses.forEach(h => {
    const x = getHorseX(h, t, raceState.trackW);
    const el = document.getElementById('rh-' + h.no);
    if (el) el.style.left = x + 'px';
    if (x < raceState.trackW * 0.98) allDone = false;
  });
  // z-index: leading horse (rightmost) on top so it visually overtakes others
  const xMap = {};
  raceState.horses.forEach(h => { xMap[h.no] = parseFloat(document.getElementById('rh-' + h.no)?.style.left) || 0; });
  [...raceState.horses].sort((a, b) => xMap[a.no] - xMap[b.no]).forEach((h, i) => {
    const el = document.getElementById('rh-' + h.no);
    if (el) el.style.zIndex = i + 2;
  });
  raceState.horses.forEach(h => {
    const x = xMap[h.no];
    if (!h.finished && x >= raceState.trackW * 0.97) {
      h.finished = true;
      h.finishTime = t;
      const badge = document.getElementById('rb-' + h.no);
      if (badge) { badge.textContent = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣'][h.finalRank-1]||h.finalRank+'着'; badge.style.display='block'; }
      if (h.finalRank === 1) {
        playLocalSound(SOUND_RACE_WIN);
      }
    }
  });
  if (allDone || t > RACE_TOTAL_SEC * 2 + 5) { raceState.phase = 'finished'; setTimeout(finishRace, 1200); return; }
  requestAnimationFrame(raceAnimFrame);
}

function finishRace() {
  if (!raceState) return;
  raceState.phase = 'finished';
  const resultOrder = [...raceState.horses].sort((a,b) => a.finalRank - b.finalRank).map(h => h.no);
  raceState.resultOrder = resultOrder;
  raceState.payouts = calcRacePayoutPure(resultOrder);
  // Apply payouts / jackpot
  if (raceState.payouts.length === 0) {
    raceJackpot = raceState.pool + raceJackpot;
    localStorage.setItem('raceJackpot', raceJackpot);
    addSystemLog(`💰 当選者なし！ジャックポット繰越: ${raceJackpot}MP`, '#fbbf24');
  } else {
    raceJackpot = 0;
    localStorage.setItem('raceJackpot', 0);
    raceState.payouts.forEach(({ ipid, payout }) => {
      const u = users[ipid];
      if (u) { u.mp = (u.mp??0) + payout; updateStatsDisplay(u); showBubble(u, `🏆 +${payout}MP！`, {}); }
    });
  }
  const top3 = resultOrder.slice(0,3).map(no => `${no}番${raceState.horses.find(h=>h.no===no)?.name||''}`).join('→');
  addSystemLog(`🏇 結果: ${top3}`, '#f59e0b');
  renderRacePanel();
  playLocalSound(SOUND_RACE_CROWD);
  if (raceState._confettiTimerId) { clearInterval(raceState._confettiTimerId); raceState._confettiTimerId = null; }
  setTimeout(() => { document.getElementById('racePanel')?.remove(); raceState = null; }, 8000);
}

function calcRacePayoutPure(resultOrder) {
  const totalPool = raceState.pool + raceJackpot;
  if (totalPool === 0) return [];
  const effMap = {};
  raceState.bets.forEach(bet => {
    let correct = false;
    if (bet.type === 'tan')         correct = bet.picks[0] === resultOrder[0];
    else if (bet.type === 'umatan') correct = bet.picks[0] === resultOrder[0] && bet.picks[1] === resultOrder[1];
    else if (bet.type === 'san')    correct = bet.picks[0] === resultOrder[0] && bet.picks[1] === resultOrder[1] && bet.picks[2] === resultOrder[2];
    if (correct) {
      const w = bet.type === 'tan' ? 1 : bet.type === 'umatan' ? 3 : 10;
      effMap[bet.ipid] = (effMap[bet.ipid] || 0) + bet.mp * w;
    }
  });
  const winners = Object.entries(effMap);
  if (winners.length === 0) return [];
  const totalEff = winners.reduce((s,[,e]) => s+e, 0);
  return winners.map(([ipid, eff]) => ({ ipid, payout: Math.max(1, Math.round(totalPool * eff / totalEff)) }));
}

function handleRaceBet(user, picksStr, mp) {
  if (!raceState || raceState.phase !== 'betting') return;
  if (mp < 1) return;
  const n = raceState.horses.length;
  const picks = picksStr.split('-').map(Number);
  if (picks.some(v => isNaN(v) || v < 1 || v > n)) { showBubble(user, '❌ 馬番が不正', {}); return; }
  if (new Set(picks).size !== picks.length)          { showBubble(user, '❌ 馬番が重複', {}); return; }
  const type = picks.length === 1 ? 'tan' : picks.length === 2 ? 'umatan' : picks.length === 3 ? 'san' : null;
  if (!type) return;
  if (type !== 'tan' && n < 2) return;
  if (type === 'san' && n < 3) return;
  if ((user.mp??0) < mp) { showBubble(user, '💸 MPが足りない！', {}); return; }
  user.mp -= mp;
  updateStatsDisplay(user);
  raceState.bets.push({ ipid: user.ipid, name: user.name || '名無し', type, picks, mp });
  raceState.pool += mp;
  const label = type === 'tan' ? '単勝' : type === 'umatan' ? '馬単' : '3連単';
  showBubble(user, `🎫 ${label} ${picksStr} に${mp}MP！`, {});
  renderRacePanel();
}

function cancelRace() {
  if (!raceState) return;
  if (raceState._betTimerId) clearInterval(raceState._betTimerId);
  if (raceState._confettiTimerId) { clearInterval(raceState._confettiTimerId); raceState._confettiTimerId = null; }
  stopRaceFanfare();
  raceState.bets.forEach(bet => {
    const u = users[bet.ipid]; if (u) { u.mp = (u.mp??0)+bet.mp; updateStatsDisplay(u); }
  });
  document.getElementById('racePanel')?.remove();
  raceState = null;
  addSystemLog('🏇 競馬キャンセル・賭けMP返金', '#94a3b8');
}

function renderRacePanel() {
  if (!raceState) return;
  let panel = document.getElementById('racePanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'racePanel';
    panel.className = 'race-panel';
    stage.appendChild(panel);
    panel.addEventListener('mousedown', e => {
      if (e.button !== 0 || dragState || trashDragState || bossDragState || wordleDragState || raceDragState) return;
      const r = panel.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      raceDragState = { ox: r.left-sr.left, oy: r.top-sr.top, sx: e.clientX, sy: e.clientY };
      e.preventDefault();
    });
  }
  panel.style.left = raceState.panelX + 'px';
  panel.style.top  = raceState.panelY + 'px';
  panel.classList.toggle('is-racing', raceState.phase === 'racing');
  const { phase, horses, pool, betRemaining, bets, payouts } = raceState;
  const totalPool = pool + raceJackpot;

  if (phase === 'betting') {
    const mpByNo = {};
    bets.forEach(b => { mpByNo[b.picks[0]] = (mpByNo[b.picks[0]]||0) + b.mp; });
    const totalBet = Object.values(mpByNo).reduce((s,v)=>s+v, 0);
    const rows = horses.map(h => {
      const amt = mpByNo[h.no]||0;
      const odds = totalBet>0 && amt>0 ? (totalBet/amt).toFixed(1)+'x' : '-';
      return `<div class="race-horse-row">
        <span class="race-no">${h.no}番</span>
        <img class="race-horse-avatar" src="/chara/${encodeURIComponent(h.imgFile)}" alt="">
        <span class="race-horse-name">${escapeHtml(h.name)}</span>
        <span class="race-cond ${h.condCls}">${h.condEmoji} ${h.condLabel}</span>
        <span class="race-pace">${h.paceStyle === 'front' ? '逃🔴' : h.paceStyle === 'back' ? '追🔵' : '差🟡'}</span>
        <span class="race-horse-odds">${amt}MP (${odds})</span>
      </div>`;
    }).join('');
    const betTypeLabel = { tan:'単勝', umatan:'馬単', san:'3連単' };
    const betRows = bets.slice(-12).reverse().map(b =>
      `<div class="race-bet-item">🎫 <b>${escapeHtml(b.name)}</b> ${betTypeLabel[b.type]} ${b.picks.join('-')}番 ${b.mp}MP</div>`
    ).join('');
    panel.innerHTML = `
      <div class="race-header">
        <span class="race-title">🏇 競馬レース</span>
        <span class="race-pool">💰JKP:${raceJackpot}MP　プール:${pool}MP</span>
        <span class="race-timer${betRemaining<=10?' race-timer-urgent':''}">${betRemaining}s</span>
      </div>
      ${rows}
      ${bets.length > 0 ? `<div class="race-bet-list">${betRows}</div>` : ''}
      <div class="race-hint">単勝「馬券 2 10」　馬単「馬券 1-2 10」　3連単「馬券 2-1-3 10」</div>`;

  } else if (phase === 'racing') {
    const n = horses.length;
    const topMargin = 60;
    const trackH = n <= 1 ? 200 : Math.min(480, Math.max(200, topMargin * 2 + (n - 1) * 58));
    // Assign fixed Y positions spread across track height (sorted by laneIdx)
    [...horses].sort((a, b) => a.laneIdx - b.laneIdx).forEach((h, i) => {
      h._trackY = n <= 1 ? trackH / 2 : topMargin + i * (trackH - topMargin * 2) / (n - 1);
    });
    const horseEls = horses.map(h => `
      <div class="race-horse-run" id="rh-${h.no}" style="left:0;top:${Math.round(h._trackY)}px;z-index:2">
        <span class="race-horse-no">${h.no}</span>
        <img src="/chara/${encodeURIComponent(h.imgFile)}" alt="" style="transform:scaleX(-1)">
        <span class="race-horse-run-name">${escapeHtml(h.name)}</span>
        <span class="race-rank-badge" id="rb-${h.no}" style="display:none"></span>
      </div>`).join('');
    panel.innerHTML = `
      <div class="race-header">
        <span class="race-title">🏇 レース中！</span>
        <span class="race-pool">💰 プール: ${totalPool}MP</span>
      </div>
      <div class="race-track-inner race-track-flat" style="height:${trackH}px">
        ${horseEls}
        <div class="race-finish-line"></div>
        <span class="race-finish-label">GOAL</span>
      </div>`;

  } else if (phase === 'finished') {
    const sorted = [...horses].sort((a,b)=>a.finalRank-b.finalRank);
    const medals = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣'];
    const orderRows = sorted.map((h,i) => `
      <div class="race-result-row">
        <span class="race-result-medal">${medals[i]||i+1+'着'}</span>
        <img class="race-horse-avatar" src="/chara/${encodeURIComponent(h.imgFile)}" alt="">
        <span class="race-horse-name">${escapeHtml(h.name)}</span>
      </div>`).join('');
    let payoutHtml = '';
    if (!payouts || payouts.length === 0) {
      payoutHtml = `<div class="race-jackpot-msg">💰 当選者なし！次回JKP繰越: ${raceJackpot}MP</div>`;
    } else {
      const winRows = [...payouts].sort((a,b)=>b.payout-a.payout).map(p => {
        const u = users[p.ipid];
        const name = u?.name || '名無し';
        const spent = bets.filter(b=>b.ipid===p.ipid).reduce((s,b)=>s+b.mp,0);
        const profit = p.payout - spent;
        return `<div class="race-winner-row">
          <span class="race-winner-name">${escapeHtml(name)}</span>
          <span class="race-winner-payout">+${p.payout}MP</span>
          <span class="race-winner-profit">(${profit>=0?'+':''}${profit})</span>
        </div>`;
      }).join('');
      payoutHtml = `<div class="race-payout-section">
        <div class="race-payout-title">🏆 当選者</div>
        ${winRows}
      </div>`;
    }
    panel.innerHTML = `
      <div class="race-header"><span class="race-title">🏁 レース結果</span></div>
      <div class="race-result-cols">
        <div>${orderRows}</div>
        <div>${payoutHtml}</div>
      </div>`;
  }
}

// ── サーバー側定期保存 ────────────────────────────────────────────
setInterval(() => {
  // キャラセーブ（60秒ごと）
  const data = {};
  Object.values(users).forEach(u => {
    const obj = {};
    CHAR_SAVE_FIELDS.forEach(k => { if (u[k] !== undefined) obj[k] = u[k]; });
    data[u.ipid] = obj;
  });
  if (Object.keys(data).length) _saveServer('/api/char-save', data);
}, 60 * 1000);

setInterval(() => {
  // 管理パネル設定（30秒ごと）
  saveSettingsToServer();
}, 30 * 1000);

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
