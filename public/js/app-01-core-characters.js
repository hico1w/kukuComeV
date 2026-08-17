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
    if (bgClearBtn) bgClearBtn.style.display = '';
  } else {
    stage.style.backgroundImage = '';
    if (bgClearBtn) bgClearBtn.style.display = 'none';
    applyBgColor(bgColorInput ? bgColorInput.value : (localStorage.getItem('bgColor') || '#00FF00'));
  }
}

(function initBg() {
  if (transparentBg) {
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';
    stage.style.backgroundColor = 'transparent';
  }
  const savedColor = localStorage.getItem('bgColor') || '#00FF00';
  if (bgColorInput) bgColorInput.value = savedColor;
  applyBgColor(savedColor);
  const savedUrl = localStorage.getItem('bgImageUrl');
  if (savedUrl) applyBgImage(savedUrl);
})();

bgColorInput?.addEventListener('input', () => {
  applyBgColor(bgColorInput.value);
  localStorage.setItem('bgColor', bgColorInput.value);
  saveSettingsToServer();
});

bgImageBtn?.addEventListener('click', () => bgImageInput?.click());

bgImageInput?.addEventListener('change', async () => {
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
        const url = data.url + '?t=' + Date.now();
        localStorage.setItem('bgImageUrl', url);
        applyBgImage(url);
      }
    } catch (err) {}
  };
  reader.readAsDataURL(file);
});

bgClearBtn?.addEventListener('click', async () => {
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
const _goshiariCooldown = new Map();

const SETTINGS_KEYS = [
  'charSizeScale','bossSizeScale','moveArea','bossHpScale','bossAtkCoeff','bossCounterRate',
  'brHpMult','taimanHpMult','nikoFontSize','nikoOpacity','hayaoshiFreq','hayaoshiSpeed',
  'slotProbs','slotSoundEnabled','seVolume','voiceVolume',
  'aiModel','aiSystem','wordleDisplayRows','charFontSizes',
  'bgColor','bgImageUrl','taimanDefeatCommand','taimanCharScale','taimanCooldown','charAspectExp','charPortraitBoost',
  'charStatsBottom','charStatsLeft','charEquipOffsetX','charEquipOffsetY',
  'petSizeScale','petAspectExp','petPortraitBoost',
  'jiggleConfig','purupuruConfig','autoDeleteMinutes',
  'slotMpJackpot','slotMpDiamond','slotMpStar','slotMpBell','slotMpCherry',
  'rankingPanelX','rankingPanelY',
  'wordlePanelX','wordlePanelY','quizPanelX','quizPanelY',
  'brTimerPanelX','brTimerPanelY','trashX','trashY',
  'rankingVisible','quizVisible','wordleVisible','brTimerVisible',
  'bossX','bossY','bossX_cm','bossY_cm',
  'gatherMarginLeft','gatherMarginRight','gatherMarginBottom','gatherRowMax',
  'contentModeGatherMarginBottom','contentModeGatherMarginLeft','contentModeGatherMarginRight',
  'contentModeCharSizePct','contentModeBossSizePct',
  'sdWidth','sdHeight','sdSteps','sdPopWidth','sdPositiveSuffix','sdDotPositiveSuffix','sdRealPositiveSuffix','sdMoiPositiveSuffix','sdNegative','sdDisplayTime',
  'sdMosaicKeywords','sdMosaicBlock','sdCfgScale','sdSampler','sdKeywordPrompts','sdCharOutdir','sdCharPositiveSuffix',
  'ollamaReviewPrompt',
  'agruSystem','agruDefaultImage','agruEmotionMap',
  'agruVoicevoxEnabled','agruVoicevoxSpeaker','agruVoicevoxSpeed','agruVoicevoxVolume',
  'agruVoiceEmoteEnabled','agruVoiceStyleJoy','agruVoiceStyleAnger','agruVoiceStyleSorrow','agruVoiceStyleFun','agruVoiceStyleNormal',
  'commentPhysEnabled','commentPhysGravity','commentPhysRestitution','commentPhysMax','commentPhysFontSize','commentPhysZ',
  'endCardWidth','endCardHeight','endCardVolume',
  'reviewSystem','reviewNumCtx','reviewCharSize','reviewCharRight','reviewCharBottom',
  'agruSdWidth','agruSdHeight','agruSdSteps','agruSdCfgScale','agruSdPositiveSuffix','agruIdleDelay','agruIdleDelayImage',
  'agruChatFontSize','agruChatBold','agruFontLeft','agruFontRight','agruCharTags','agruYtVolume','agruBgmVolume','agruYtWidth','agruYtHeight','agruYtOpacity','agruYtEnabled','agruModalZ','agruYtModalZ',
  'agruModalWidth','agruModalHeight','agruModalBgOpacity','agruChatImgSize','agruCharImgHeight','agruCharImgScale','agruParamPosX','agruParamPosY',
  'bombHidden','trashHidden','charStatsHidden','charNameHidden','breatheDisabled','bossFloatDisabled',
  'newsTickerEnabled','newsTickerWidth','newsTickerX','newsTickerY','newsTickerRows','newsTickerFontSize','newsTickerBgOpacity','newsTickerSpeed','newsTickerMode','newsTickerInterval','newsTickerTategaki','newsTickerHeight',
  'dmgFontScale',
  'wordlePanelWidth','wordlePanelBgOpacity','rankingPanelBgOpacity','quizPanelBgOpacity',
  'agruImgCmdEnabled','agruUnloadEnabled','agruManualMode','agruAutoTalkEnabled','agruAutoTalkInterval','agruAutoTalkMaxStreak','agruAutoTalkTopics',
  'afkOpacity','afkGrayscale','afkBrightness',
  'autoReplyWords','autoReplyMessages',
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
let hayaoshiFreq  = (parseInt(localStorage.getItem('hayaoshiFreq'))  || 5) * 1000;
let hayaoshiSpeed = (parseInt(localStorage.getItem('hayaoshiSpeed')) || 8) * 1000;
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
let charZCounter   = 70;
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

let charImages      = loadCharImages();
let charAliases     = loadCharAliases();
let charImageSizes  = loadCharImageSizes();
let slotPage        = 0;
const SLOT_SIZE     = 20;

function loadCharImages()      { return _loadServerSync('/api/char-images');      }
function saveCharImages()      { _saveServer('/api/char-images', charImages);      }
function loadCharAliases()     { return _loadServerSync('/api/char-aliases');     }
function saveCharAliases()     { _saveServer('/api/char-aliases', charAliases);     }
function loadCharImageSizes()  { return _loadServerSync('/api/char-image-sizes'); }
function saveCharImageSizes()  { _saveServer('/api/char-image-sizes', charImageSizes); }
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
  'commentCount','tc','sizeScale','sizeScaleBase','flipped','lastTaimanAt','charDef',
  'name','nameManual',
  'textColor','bubbleShape','bubbleDeco','bubbleBgColor','font',
  'charImage','taimanDmgMult','isMaster',
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
      // コメント履歴（総評用・最新150件）
      recentComments: [],
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
      users[ipid].sizeScale = saved.sizeScaleBase ?? 1.0; // タイマン中リロード時の異常値をリセットし、管理者設定値を復元
      // 外見データが保存済みならランダム初期化をスキップ
      if (['textColor','bubbleShape','bubbleDeco','bubbleBgColor','font','charImage'].some(k => saved[k] !== undefined)) {
        users[ipid].firstAppear = false;
      }
    }
  }
  return users[ipid];
}

function isMasterUser(u) {
  return u?.isMaster === true;
}

function panelKey(base) {
  return contentMode ? base + '_cm' : base;
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
  // ボスアゲルバトル中は新規キャラ生成禁止（KO済みの再生成も禁止）
  if (agruBattleActive) return;
  // バトル中にKOされたキャラはバトル終了後も再生成しない
  if (_agruBattleKilledIds.has(user.ipid)) return;
  if (!user.charDef) {
    const used = getUsedCharIds(user);
    const _agruExcludeSet = _agruPlayersWon && agruBattleConfig?.agruTypeImages?.length
      ? new Set(agruBattleConfig.agruTypeImages.map(s => s.trim()).filter(Boolean))
      : null;
    const allIds = Object.keys(charImages).map(Number).filter(id => {
      if (id < 1 || id > 500 || charExcludeIds.has(id)) return false;
      if (_agruExcludeSet && _agruExcludeSet.has(charImages[id])) return false;
      return true;
    });
    const freeIds = allIds.filter(id => !used.has(id));
    const pool = freeIds.length > 0 ? freeIds : allIds; // 全枠埋まっていたら重複許容
    user.charDef = pool.length > 0
      ? getCharDef(pool[Math.floor(Math.random() * pool.length)])
      : { id: 0, name: '', emoji: '👤', bg: 'transparent' };
  }
  // コンテンツモード中は生成前にサイズを適用し、フルサイズで一瞬表示されるのを防ぐ
  if (contentMode && !contentModeSaved[user.ipid]) {
    contentModeSaved[user.ipid] = { x: user.x, y: user.y, sizeScale: user.sizeScale || 1 };
    user.sizeScale = (user.sizeScale || 1) * (contentModeCharSizePct / 100);
  }
  createCharacter(user);
  // コンテンツモード中はキャラ生成後にコンテンツモード下集合を実行（アバタートランジション完了を待つ）
  if (contentMode) {
    setTimeout(() => gatherContentMode(), 400);
  }
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
      <div class="char-stats" id="s-${user.ipid}"></div>
    </div>
    <div class="char-name" id="n-${user.ipid}">${escapeHtml(user.name)}</div>
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
  updateNameDisplay(user);

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
  const imgFile    = user.charImage || charImages[user.charDef.id] || 'kisyokeee.png';
  const imgScale   = charImageSizes[imgFile] || 1.0;
  const px = Math.round(user.size * 1.5 * charSizeScale * (user.sizeScale || 1) * imgScale * (user.brWinnerScale || 1));
  a.style.width  = px + 'px';
  a.style.height = px + 'px';
  a.style.transform = '';
  a.innerHTML      = `<img src="/chara-s/${encodeURIComponent(imgFile)}" alt="${escapeHtml(user.name)}">`;
  a.style.fontSize = '0';
  const img = a.querySelector('img');
  if (img) {
    const adjustSize = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        const r     = img.naturalWidth / img.naturalHeight;
        const pow   = Math.pow(r, charAspectExp);
        const boost = r < 1 ? Math.pow(1 / r, charPortraitBoost) : 1;
        a.style.width  = Math.round(px * pow * boost) + 'px';
        a.style.height = Math.round(px / pow * boost) + 'px';
        updateJiggleOverlay(user);
        updatePurupuruOverlay(user);
      }
    };
    if (img.complete) adjustSize();
    else img.addEventListener('load', adjustSize, { once: true });
  }
  applyFacingFlip(user);
  if (agruBattleActive) updateBattleGrayscale(user);
}

function updateJiggleOverlay(user) {
  const a = document.getElementById('a-' + user.ipid);
  if (!a) return;
  a.querySelector('.jiggle-overlay')?.remove();

  const imgFile = user.charImage || (user.charDef && charImages[user.charDef.id]) || 'kisyokeee.png';
  const cfg = jiggleConfig[imgFile];
  if (!cfg || !cfg.enabled) return;

  const baseImg = a.querySelector('img');
  if (!baseImg || !baseImg.complete || !baseImg.naturalWidth) return;

  const topPct   = cfg.top    ?? 35;
  const botPct   = cfg.bottom ?? 55;
  const leftPct  = cfg.left   ?? 0;
  const rightPct = cfg.right  ?? 100;
  const scaleAmt = cfg.scale  ?? 4;
  const speedVal = cfg.speed  ?? 0.4;

  const overlay = document.createElement('div');
  overlay.className = 'jiggle-overlay';
  overlay.style.clipPath = `inset(${topPct}% ${100 - rightPct}% ${100 - botPct}% ${leftPct}%)`;
  if (isUserFlipped(user)) overlay.style.transform = 'scaleX(-1)';

  const img2 = document.createElement('img');
  img2.src = baseImg.src;
  img2.alt = '';
  img2.style.setProperty('--jiggle-speed',    speedVal + 's');
  img2.style.setProperty('--jiggle-sy',       String(1 + scaleAmt / 100));
  img2.style.setProperty('--jiggle-ty',       `-${(scaleAmt * 0.5).toFixed(1)}px`);
  img2.style.setProperty('--jiggle-origin-y', topPct + '%');

  overlay.appendChild(img2);
  a.appendChild(overlay);
}

function applyBossAvatarAspect(basePx) {
  const ba = document.getElementById('bossAvatar');
  if (!ba || !bossState) return;
  const img = ba.querySelector('img');
  if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
    const r     = img.naturalWidth / img.naturalHeight;
    const pow   = Math.pow(r, charAspectExp);
    const boost = r < 1 ? Math.pow(1 / r, charPortraitBoost) : 1;
    ba.style.width  = Math.round(basePx * pow * boost) + 'px';
    ba.style.height = Math.round(basePx / pow * boost) + 'px';
  } else {
    ba.style.width  = basePx + 'px';
    ba.style.height = basePx + 'px';
  }
  ba.style.fontSize = Math.round(basePx * 0.87) + 'px';
  updateBossJiggleOverlay();
  updateBossPurupuru();
}

function updateBossJiggleOverlay() {
  const a = document.getElementById('bossAvatar');
  if (!a) return;
  a.querySelector('.jiggle-overlay')?.remove();
  if (!bossState) return;
  const imgFile = bossState.imgFile;
  if (!imgFile) return;
  const cfg = jiggleConfig[imgFile];
  if (!cfg || !cfg.enabled) return;
  const baseImg = a.querySelector('img');
  if (!baseImg || !baseImg.complete || !baseImg.naturalWidth) return;
  const topPct   = cfg.top    ?? 35;
  const botPct   = cfg.bottom ?? 55;
  const leftPct  = cfg.left   ?? 0;
  const rightPct = cfg.right  ?? 100;
  const scaleAmt = cfg.scale  ?? 4;
  const speedVal = cfg.speed  ?? 0.4;
  const overlay = document.createElement('div');
  overlay.className = 'jiggle-overlay';
  overlay.style.clipPath = `inset(${topPct}% ${100 - rightPct}% ${100 - botPct}% ${leftPct}%)`;
  overlay.style.transform = 'scaleX(-1)';
  const img2 = document.createElement('img');
  img2.src = baseImg.src;
  img2.alt = '';
  img2.style.setProperty('--jiggle-speed',    speedVal + 's');
  img2.style.setProperty('--jiggle-sy',       String(1 + scaleAmt / 100));
  img2.style.setProperty('--jiggle-ty',       `-${(scaleAmt * 0.5).toFixed(1)}px`);
  img2.style.setProperty('--jiggle-origin-y', topPct + '%');
  overlay.appendChild(img2);
  a.appendChild(overlay);
}

// ── ぷるぷるエンジン（Canvas メッシュ変形・画像別設定）──────────────────────
// purupuruConfig は画像ファイル名をキーとする辞書
// キャラ/ボス: ファイル名 (例: 'kisyokeee.png')
// アゲルちゃん: '__agru__' という特殊キー
let dmgFontScale = parseInt(localStorage.getItem('dmgFontScale')) || 100;

let purupuruConfig = {};
try {
  const _ps = localStorage.getItem('purupuruConfig');
  if (_ps) purupuruConfig = JSON.parse(_ps);
} catch(e) {}

function _puruDefaultCfg() {
  return {
    enabled: false,
    gridSize: 20,
    points: [
      { enabled:false, x:30, y:45, radius:30, amplitude:8, speed:1.2, mode:'circle',     phase:0,   shape:'circle', width:60, height:30, rotation:0, direction:0 },
      { enabled:false, x:70, y:45, radius:30, amplitude:8, speed:1.2, mode:'circle',     phase:180, shape:'circle', width:60, height:30, rotation:0, direction:0 },
      { enabled:false, x:50, y:20, radius:25, amplitude:5, speed:0.8, mode:'pendulum_x', phase:0,   shape:'circle', width:60, height:30, rotation:0, direction:0 },
      { enabled:false, x:50, y:80, radius:25, amplitude:5, speed:0.8, mode:'pendulum_y', phase:0,   shape:'circle', width:60, height:30, rotation:0, direction:0 },
      { enabled:false, x:20, y:60, radius:20, amplitude:6, speed:1.5, mode:'pendulum_x', phase:90,  shape:'circle', width:60, height:30, rotation:0, direction:0 },
      { enabled:false, x:80, y:60, radius:20, amplitude:6, speed:1.5, mode:'pendulum_x', phase:270, shape:'circle', width:60, height:30, rotation:0, direction:0 },
      { enabled:false, x:50, y:10, radius:20, amplitude:4, speed:1.0, mode:'sin_y',      phase:0,   shape:'circle', width:60, height:30, rotation:0, direction:0 },
      { enabled:false, x:50, y:90, radius:20, amplitude:4, speed:1.0, mode:'sin_y',      phase:180, shape:'circle', width:60, height:30, rotation:0, direction:0 },
      { enabled:false, x:35, y:27, radius:12, amplitude:2.5,speed:2.0, mode:'pendulum_y', phase:0,   shape:'circle', width:60, height:30, rotation:0, direction:0 },
      { enabled:false, x:65, y:27, radius:12, amplitude:2.5,speed:2.0, mode:'pendulum_y', phase:0,   shape:'circle', width:60, height:30, rotation:0, direction:0 },
      { enabled:false, x:25, y:75, radius:22, amplitude:7,  speed:1.1, mode:'skirt',      phase:0,   shape:'circle', width:60, height:30, rotation:0, direction:0 },
      { enabled:false, x:75, y:75, radius:22, amplitude:7,  speed:1.1, mode:'skirt',      phase:180, shape:'circle', width:60, height:30, rotation:0, direction:0 },
    ]
  };
}

let _puruTime = 0, _puruLastTs = null, _puruRAF = null, _puruRenderLastTs = null;
const _puruDispBuf = {dx:0, dy:0}; // scratchオブジェクト（毎フレームのnewを排除）

function _puruWeight(pt, dx, dy, W, H) {
  const mn = Math.min(W, H);
  const shape = pt.shape || 'circle';
  if (shape === 'rect') {
    const hw = ((pt.width  ?? (pt.radius ?? 30)) / 100) * W / 2;
    const hh = ((pt.height ?? (pt.radius ?? 30)) / 100) * H / 2;
    if (!hw || !hh || Math.abs(dx) >= hw || Math.abs(dy) >= hh) return 0;
    return (1 - Math.max(Math.abs(dx)/hw, Math.abs(dy)/hh)) ** 2;
  }
  if (shape === 'triangle') {
    const R = (pt.radius ?? 30) / 100 * mn; if (!R) return 0;
    const rotDeg = pt.rotation ?? 0;
    if (pt._wRot !== rotDeg) { pt._wRot=rotDeg; pt._wC=Math.cos(rotDeg*Math.PI/180); pt._wS=Math.sin(rotDeg*Math.PI/180); }
    const lx=dx*pt._wC+dy*pt._wS, ly=-dx*pt._wS+dy*pt._wC;
    const h=R*0.8660254, hy=R*0.5, R15=R*1.5;
    // cr() インライン展開（クロージャ生成を排除）
    const d0=h*(ly+R)-R15*lx, d1=-2*h*(ly-hy), d2=h*(ly-hy)+R15*(lx+h);
    if (!((d0>=0&&d1>=0&&d2>=0)||(d0<=0&&d1<=0&&d2<=0))) return 0;
    return Math.max(0, 1 - Math.sqrt(lx*lx+ly*ly)/R) ** 2;
  }
  const rr = (pt.radius ?? 30) / 100 * mn; if (!rr) return 0;
  const dist = Math.sqrt(dx*dx + dy*dy);
  return dist >= rr ? 0 : (1 - dist/rr) ** 2;
}

function _puruDisplace(pt, t) {
  const ph = (pt.phase || 0) * Math.PI / 180;
  const om = (pt.speed || 1) * Math.PI * 2;
  const a  = pt.amplitude || 0;
  let dx=0, dy=0;
  switch (pt.mode || 'circle') {
    case 'circle':     dx=Math.cos(t*om+ph)*a;                             dy=Math.sin(t*om+ph)*a; break;
    case 'pendulum_x': dx=Math.sin(t*om+ph)*a;                                                     break;
    case 'pendulum_y':                                                       dy=Math.sin(t*om+ph)*a; break;
    case 'sin_y':      dx=Math.sin(t*om*2+ph)*a*0.3;                       dy=Math.sin(t*om+ph)*a; break;
    case 'lissajous':  dx=Math.sin(t*om+ph)*a;                             dy=Math.sin(t*om*2+ph+Math.PI/2)*a; break;
    case 'breast':     dx=Math.sin(t*om*1.5+ph+Math.PI/4)*a*0.3;          dy=Math.sin(t*om+ph)*a; break;
    case 'bounce':                                                            dy=Math.abs(Math.sin(t*om*0.5+ph))*a; break;
    case 'spring':                                                            dy=(Math.sin(t*om+ph)+0.3*Math.sin(t*om*3+ph))*a/1.3; break;
    case 'flutter':    dx=Math.sin(t*om*2.7+ph)*a*0.7;                    dy=Math.cos(t*om*2.5+ph)*a; break;
    case 'skirt': {
      // 風に揺れるスカート：主周波数＋振幅変調でランダム感
      const c=t*om+ph;
      dx=Math.sin(c)*a*(1+0.4*Math.sin(c*0.53+1.2)+0.15*Math.sin(c*2.3));
      dy=Math.sin(c*0.7+0.5)*a*0.15;
      break;
    }
    case 'neko': {
      const c=t*om+ph;
      const base=Math.max(0, Math.sin(c));
      dx=Math.sin(c*1.3+ph)*a*0.2;
      dy=-(base+base*0.3*Math.sin(c*4))*a;
      break;
    }
    case 'swing': {
      // ブランコ：横sin＋二乗項で弧を描く（中央=下、端=上）
      const p=Math.sin(t*om+ph);
      dx=p*a;
      dy=(0.4-0.6*p*p)*a;
      break;
    }
    case 'purun': {
      // ぷるん：1周期内で減衰振動（弾けて収まる）
      const c=(t*om+ph)%(Math.PI*2);
      const jig=Math.exp(-c*0.8)*Math.cos(c*5)*a;
      dx=jig*0.25; dy=jig;
      break;
    }
    case 'heart': {
      // 💓 鼓動：1周期に2つのガウシアン峰
      const c=((t*om+ph)%(Math.PI*2))/(Math.PI*2);
      const p1=Math.exp(-Math.pow((c-0.15)*14,2));
      const p2=Math.exp(-Math.pow((c-0.35)*11,2))*0.65;
      dy=-(p1+p2)*a; dx=p1*a*0.15;
      break;
    }
    case 'punipuni': {
      // ぷにぷに：非整数比周波数2本合成でランダム感のある柔らか揺れ
      const c=t*om+ph;
      dx=(Math.sin(c*1.0)*0.55+Math.sin(c*2.3+0.7)*0.45)*a;
      dy=(Math.cos(c*0.7)*0.55+Math.cos(c*1.9+1.1)*0.45)*a;
      break;
    }
  }
  _puruDispBuf.dx=dx; _puruDispBuf.dy=dy;
  return _puruDispBuf;
}

function _puruTri(ctx, img, x0,y0,u0,v0, x1,y1,u1,v1, x2,y2,u2,v2) {
  const iw=img.naturalWidth, ih=img.naturalHeight;
  const p0u=u0*iw,p0v=v0*ih, p1u=u1*iw,p1v=v1*ih, p2u=u2*iw,p2v=v2*ih;
  const det = p0u*(p1v-p2v) + p1u*(p2v-p0v) + p2u*(p0v-p1v);
  if (Math.abs(det) < 0.001) return;
  const a_=(x0*(p1v-p2v)+x1*(p2v-p0v)+x2*(p0v-p1v))/det;
  const b_=(y0*(p1v-p2v)+y1*(p2v-p0v)+y2*(p0v-p1v))/det;
  const c_=(x0*(p2u-p1u)+x1*(p0u-p2u)+x2*(p1u-p0u))/det;
  const d_=(y0*(p2u-p1u)+y1*(p0u-p2u)+y2*(p1u-p0u))/det;
  // ep() インライン展開（三角形ごとに配列を生成していた問題を解消）
  const ecx=(x0+x1+x2)/3, ecy=(y0+y1+y2)/3;
  const d0x=x0-ecx,d0y=y0-ecy,l0=Math.sqrt(d0x*d0x+d0y*d0y);
  const ex0=l0<.001?x0:x0+d0x/l0*.6, ey0=l0<.001?y0:y0+d0y/l0*.6;
  const d1x=x1-ecx,d1y=y1-ecy,l1=Math.sqrt(d1x*d1x+d1y*d1y);
  const ex1=l1<.001?x1:x1+d1x/l1*.6, ey1=l1<.001?y1:y1+d1y/l1*.6;
  const d2x=x2-ecx,d2y=y2-ecy,l2=Math.sqrt(d2x*d2x+d2y*d2y);
  const ex2=l2<.001?x2:x2+d2x/l2*.6, ey2=l2<.001?y2:y2+d2y/l2*.6;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(ex0,ey0); ctx.lineTo(ex1,ey1); ctx.lineTo(ex2,ey2);
  ctx.closePath(); ctx.clip();
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.transform(a_,b_,c_,d_, x0-a_*p0u-c_*p0v, y0-b_*p0u-d_*p0v);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

function _puruRenderCanvas(canvas) {
  const img = canvas._puruImg;
  const cfg = purupuruConfig[canvas._puruImgFile];
  if (!cfg || !cfg.enabled || !img || !img.isConnected || !img.complete || !img.naturalWidth) {
    canvas.style.display = 'none';
    if (img) img.style.opacity = '';
    return;
  }
  const SS = 2;
  const dpr = window.devicePixelRatio || 1;
  // getBoundingClientRect はレイアウト再計算を強制する。
  // 120フレームごと or 未初期化時のみ再取得（毎フレームの強制レイアウトを排除）
  canvas._puruTick = ((canvas._puruTick || 0) + 1) % 120;
  let cssW = canvas._puruCssW || 0, cssH = canvas._puruCssH || 0;
  if (!cssW || !cssH || canvas._puruTick === 0) {
    const rect = img.getBoundingClientRect();
    if (cssW !== rect.width || cssH !== rect.height) canvas._puruFitKey = null;
    cssW = rect.width; cssH = rect.height;
    canvas._puruCssW = cssW; canvas._puruCssH = cssH;
  }
  const W = Math.round(cssW * dpr * SS), H = Math.round(cssH * dpr * SS);
  if (!W || !H) { canvas.style.display = 'none'; return; }
  if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; canvas._puruFitKey = null; }
  img.style.opacity = '0';
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  const iw = img.naturalWidth, ih = img.naturalHeight;
  // getComputedStyle はobject-fitが変わった時のみ再計算（通常は不変）
  const fitKey = `${iw},${ih},${W},${H}`;
  if (canvas._puruFitKey !== fitKey) {
    canvas._puruFitKey = fitKey;
    let srcX=0, srcY=0, srcW=iw, srcH=ih;
    const fit = getComputedStyle(img).objectFit;
    if ((fit === 'cover' || fit === 'contain') && iw && ih) {
      const s = fit === 'cover' ? Math.max(cssW/iw, cssH/ih) : Math.min(cssW/iw, cssH/ih);
      const sw=iw*s, sh=ih*s;
      const pos = getComputedStyle(img).objectPosition.split(' ');
      const pv = (v, total, avail) => {
        if(!v||v==='center') return (total-avail)/2;
        if(v==='left'||v==='top') return 0;
        if(v==='right'||v==='bottom') return total-avail;
        if(v.endsWith('%')) return (total-avail)*parseFloat(v)/100;
        return (total-avail)/2;
      };
      srcX = pv(pos[0], sw, cssW) / s;
      srcY = pv(pos[1]||pos[0], sh, cssH) / s;
      srcW = cssW / s; srcH = cssH / s;
    }
    canvas._puruSrcX=srcX; canvas._puruSrcY=srcY; canvas._puruSrcW=srcW; canvas._puruSrcH=srcH;
  }
  const srcX=canvas._puruSrcX, srcY=canvas._puruSrcY, srcW=canvas._puruSrcW, srcH=canvas._puruSrcH;
  // object-fit:contain でレターボックスが生じる場合、画像コンテンツ領域をcanvas座標で算出。
  // admimプレビューは width:auto で余白なし（contentL=0, cW=W）なので既存と同動作。
  // cover や余白なしの場合も contentL=0 になり既存と同動作。
  const contentL = Math.max(0, (-srcX / srcW) * W);
  const contentT = Math.max(0, (-srcY / srcH) * H);
  const cW = contentL > 0 ? Math.min(W - contentL, (iw / srcW) * W) : W;
  const cH = contentT > 0 ? Math.min(H - contentT, (ih / srcH) * H) : H;
  // ampScale はadminプレビュー高さ420pxを基準に画像コンテンツの実高で正規化
  const ampScale = (cH / (dpr * SS)) / 420;
  const gs = cfg.gridSize || 12;
  const cols = gs + 1, rows = gs + 1;
  const needed = cols * rows * 2;
  // Float32Array を使い回す（毎フレームの new + GCを排除）
  if (!canvas._puruVerts || canvas._puruVerts.length < needed) {
    canvas._puruVerts = new Float32Array(needed);
    canvas._puruUvs   = new Float32Array(needed);
  }
  const verts = canvas._puruVerts, uvs = canvas._puruUvs;
  const allPts = cfg.points || [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      // 頂点ベース座標を画像コンテンツ領域内で計算（レターボックス分オフセット）
      const bx = contentL + (i/gs)*cW, by = contentT + (j/gs)*cH;
      let tdx=0, tdy=0;
      for (let pi = 0; pi < allPts.length; pi++) {
        const pt = allPts[pi];
        if (!pt.enabled) continue;
        // canvas全体にCSSでscaleX(-1)を適用するため、点座標はミラー不要。
        // 画像も揺れも同じcanvas空間にあり、CSS反転で一緒にミラーされる。
        // pt.x/y はadminプレビューと同じく画像コンテンツ内 % なのでコンテンツ領域にマップ
        const px = contentL + (pt.x/100)*cW, py = contentT + (pt.y/100)*cH;
        const w=_puruWeight(pt, bx-px, by-py, cW, cH);
        if (w <= 0) continue;
        const d=_puruDisplace(pt,_puruTime);
        // direction trig をキャッシュ（変更時のみ再計算）
        const dirDeg=pt.direction??0;
        if (pt._dDir !== dirDeg) { pt._dDir=dirDeg; pt._dC=Math.cos(dirDeg*Math.PI/180); pt._dS=Math.sin(dirDeg*Math.PI/180); }
        tdx+=(d.dx*pt._dC-d.dy*pt._dS)*w*dpr*SS*ampScale;
        tdy+=(d.dx*pt._dS+d.dy*pt._dC)*w*dpr*SS*ampScale;
      }
      const idx=(j*cols+i)*2;
      verts[idx]=bx+tdx; verts[idx+1]=by+tdy;
      // レターボックスありの場合はメッシュが画像領域のみをカバーするので UV は 0→1 の線形
      // cover（クロップ）や余白なしの場合は従来の srcX ベース式を使う
      uvs[idx]   = contentL > 0 ? (i/gs) : (srcX + (i/gs)*srcW) / iw;
      uvs[idx+1] = contentT > 0 ? (j/gs) : (srcY + (j/gs)*srcH) / ih;
    }
  }
  for (let j=0; j<gs; j++) {
    for (let i=0; i<gs; i++) {
      const i00=(j*cols+i)*2,   i10=(j*cols+i+1)*2;
      const i01=((j+1)*cols+i)*2, i11=((j+1)*cols+i+1)*2;
      _puruTri(ctx,img, verts[i00],verts[i00+1],uvs[i00],uvs[i00+1], verts[i10],verts[i10+1],uvs[i10],uvs[i10+1], verts[i01],verts[i01+1],uvs[i01],uvs[i01+1]);
      _puruTri(ctx,img, verts[i10],verts[i10+1],uvs[i10],uvs[i10+1], verts[i11],verts[i11+1],uvs[i11],uvs[i11+1], verts[i01],verts[i01+1],uvs[i01],uvs[i01+1]);
    }
  }
}

function _puruStartLoop() {
  if (_puruRAF) return;
  const _PURU_INTERVAL = 1000 / 48; // 48fps = 約20.83ms
  const loop = ts => {
    const canvases = document.querySelectorAll('.puru-canvas');
    if (!canvases.length) { _puruRAF = 0; _puruLastTs = null; _puruRenderLastTs = null; return; }
    _puruRAF = requestAnimationFrame(loop);
    if (_puruLastTs === null) { _puruLastTs = ts; _puruRenderLastTs = ts; }
    const dt = Math.min((ts - _puruLastTs) / 1000, 0.05);
    _puruLastTs = ts;
    _puruTime += dt;
    if (ts - _puruRenderLastTs >= _PURU_INTERVAL) {
      _puruRenderLastTs = ts;
      canvases.forEach(_puruRenderCanvas);
    }
  };
  _puruRAF = requestAnimationFrame(loop);
}

function _puruAttach(parent, imgEl, imgFile, flipped) {
  parent.querySelectorAll('.puru-canvas').forEach(c => { if (c._puruImg) c._puruImg.style.opacity = ''; c.remove(); });
  const canvas = document.createElement('canvas');
  canvas.className = 'puru-canvas';
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:none;z-index:3';
  canvas._puruImg     = imgEl;
  canvas._puruImgFile = imgFile;
  canvas._puruFlipped = !!flipped;
  canvas._puruTick    = Math.floor(Math.random() * 119); // 初回getBCRをフレーム分散
  if (flipped) canvas.style.transform = 'scaleX(-1)';
  const cs = window.getComputedStyle(parent);
  if (cs.position === 'static') parent.style.position = 'relative';
  parent.appendChild(canvas);
  _puruStartLoop();
}

function updatePurupuruOverlay(user) {
  const a = document.getElementById('a-' + user.ipid);
  if (!a) return;
  a.querySelectorAll('.puru-canvas').forEach(c => { if (c._puruImg) c._puruImg.style.opacity = ''; c.remove(); });
  const imgFile = user.charImage || (user.charDef && charImages[user.charDef.id]) || 'kisyokeee.png';
  const cfg = purupuruConfig[imgFile];
  if (!cfg || !cfg.enabled) return;
  const imgEl = a.querySelector('img');
  if (!imgEl) return;
  _puruAttach(a, imgEl, imgFile, isUserFlipped(user));
}

function updateBossPurupuru() {
  const a = document.getElementById('bossAvatar');
  if (!a) return;
  a.querySelectorAll('.puru-canvas').forEach(c => { if (c._puruImg) c._puruImg.style.opacity = ''; c.remove(); });
  if (!bossState) return;
  const imgFile = bossState.imgFile;
  if (!imgFile) return;
  const cfg = purupuruConfig[imgFile];
  if (!cfg || !cfg.enabled) return;
  const imgEl = a.querySelector('img');
  if (!imgEl) return;
  // ボス画像はCSS で常時 scaleX(-1) のため flipped=true で固定
  if (!imgEl.complete || !imgEl.naturalWidth) imgEl.addEventListener('load', () => _puruAttach(a, imgEl, imgFile, true), { once: true });
  else _puruAttach(a, imgEl, imgFile, true);
}

function applyBossHitShake(bossEl) {
  if (!bossEl) return;
  bossEl.classList.remove('boss-hit-shake');
  void bossEl.offsetWidth;
  bossEl.classList.add('boss-hit-shake');
  bossEl.addEventListener('animationend', () => bossEl.classList.remove('boss-hit-shake'), { once: true });
}

function updateAgruPurupuru() {
  const imgEl = document.getElementById('agruCharImg');
  if (!imgEl) return;
  const parent = imgEl.parentElement;
  if (!parent) return;
  parent.querySelectorAll('.puru-canvas').forEach(c => { if (c._puruImg) c._puruImg.style.opacity = ''; c.remove(); });
  if (!imgEl.src || imgEl.src === location.href) return;
  // /ageru/folder/file.png → __agru__/folder/file.png
  const m = new URL(imgEl.src).pathname.match(/^\/ageru\/(.+)$/);
  const imgKey = m ? '__agru__/' + decodeURIComponent(m[1]) : '__agru__';
  const cfg = purupuruConfig[imgKey];
  if (!cfg || !cfg.enabled) return;
  if (!imgEl.complete || !imgEl.naturalWidth) imgEl.addEventListener('load', () => _puruAttach(parent, imgEl, imgKey), { once: true });
  else _puruAttach(parent, imgEl, imgKey);
}

function updateBossAgruPurupuru() {
  const imgEl  = document.getElementById('agruBattleCharImg');
  const parent = document.getElementById('agruBattleCharFigure') || document.getElementById('agruBossFigureWrap');
  if (!imgEl || !parent) return;
  parent.querySelectorAll('.puru-canvas').forEach(c => { if (c._puruImg) c._puruImg.style.opacity = ''; c.remove(); });
  const src = imgEl.getAttribute('src') || '';
  const m = src.match(/^\/boss\/(.+)$/);
  if (!m) return;
  const filename = decodeURIComponent(m[1]);
  const cfg = agruBattleConfig?.purupuruMap?.[filename];
  if (!cfg?.enabled) return;
  const key = '__boss__/' + filename;
  purupuruConfig[key] = cfg;
  if (!imgEl.complete || !imgEl.naturalWidth) imgEl.addEventListener('load', () => _puruAttach(parent, imgEl, key), { once: true });
  else _puruAttach(parent, imgEl, key);
}

function _puruApplyAll() {
  Object.values(users).filter(u => u.el).forEach(u => updatePurupuruOverlay(u));
  updateBossPurupuru();
  updateAgruPurupuru();
  updateBossAgruPurupuru();
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
  // グレーアウトオーバーレイも反転
  const grayOv = a.querySelector('.hp-gray-overlay');
  if (grayOv) grayOv.style.transform = flip ? 'scaleX(-1)' : '';
  // 揺れオーバーレイも反転
  const jOverlay = a.querySelector('.jiggle-overlay');
  if (jOverlay) jOverlay.style.transform = flip ? 'scaleX(-1)' : '';
  // ぷるぷるcanvasも反転同期（imgが非表示のままでも反転が効くように）
  const puruCanvas = a.querySelector('.puru-canvas');
  if (puruCanvas) { puruCanvas.style.transform = flip ? 'scaleX(-1)' : ''; puruCanvas._puruFlipped = flip; }
  // ペット画像も同様に反転
  ['p-', 'p2-'].forEach(prefix => {
    const petImg = document.getElementById(prefix + user.ipid)?.querySelector('img');
    if (petImg) petImg.style.transform = flip ? 'scaleX(-1)' : '';
  });
}

function renderPetBadge(user) {
  const _pImgFile = user.charImage || (user.charDef && charImages[user.charDef.id]);
  const _pImgScale = (_pImgFile && charImageSizes[_pImgFile]) || 1.0;
  const px   = Math.max(20, Math.round(user.size * 0.75 * charSizeScale * petSizeScale * (user.sizeScale || 1) * _pImgScale * (user.brWinnerScale || 1)));
  const flip = isUserFlipped(user);

  function setSlot(slotId, petObj, baseCls) {
    const slot = document.getElementById(slotId);
    if (!slot) return;
    if (!petObj) { slot.className = baseCls; slot.innerHTML = ''; return; }
    slot.className = `${baseCls} ${petObj.rarityCls || ''}`;
    const img = document.createElement('img');
    img.src          = `/chara-s/${encodeURIComponent(petObj.img)}`;
    img.alt          = 'pet';
    img.title        = `${escapeHtml(petObj.abilityName)}: ${escapeHtml(petObj.abilityDesc)}`;
    img.style.width  = px + 'px';
    img.style.height = px + 'px';
    img.style.objectFit = 'contain';
    if (flip) img.style.transform = 'scaleX(-1)';
    const adjustSize = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        const r     = img.naturalWidth / img.naturalHeight;
        const pow   = Math.pow(r, petAspectExp);
        const boost = r < 1 ? Math.pow(1 / r, petPortraitBoost) : 1;
        img.style.width  = Math.round(px * pow * boost) + 'px';
        img.style.height = Math.round(px / pow * boost) + 'px';
      }
    };
    if (img.complete && img.naturalWidth > 0) adjustSize();
    else img.addEventListener('load', adjustSize, { once: true });
    slot.innerHTML = '';
    slot.appendChild(img);
  }

  setSlot('p-'  + user.ipid, user.pet,  'char-pet');
  setSlot('p2-' + user.ipid, user.pet2, 'char-pet2');
}

function getTitleCls(t) {
  return ['T99','T100'].includes(t.id) ? 'title-tag-rainbow'
       : ['T91','T92','T93','T94','T62','T70','T74','T80'].includes(t.id) ? 'title-tag-gold'
       : 'title-tag-normal';
}

function updateNameDisplay(user) {
  const n = document.getElementById('n-' + user.ipid);
  if (!n) return;
  let html = escapeHtml(user.name);
  if (user.brWinner) {
    html = '<span class="title-tag title-tag-winner">優勝</span>' + html;
  }
  n.innerHTML = html;
  n.style.color      = user.textColor || '';
  n.style.background = user.bubbleBgColor || '';
  n.style.fontFamily = user.font || '';
  n.classList.forEach(c => { if (c.startsWith('bubble-deco-')) n.classList.remove(c); });
  if (user.bubbleDeco) n.classList.add('bubble-deco-' + user.bubbleDeco);
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
    if (agruBattleActive) { scheduleMove(user); return; } // バトル中は集合位置を維持
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
  user.el.classList.remove('walking');  // walking の !important が bounce/spin を上書きするのを防ぐ
  user.el.style.transition = '';        // transition:none が残るとアニメーションが描画されない場合がある
  user.el.classList.add(type);
  user.motionTimer = setTimeout(() => {
    if (user.el) user.el.classList.remove(type);
    user.motion = null;
    user.motionTimer = null;
    if (user.el) {
      if (user.walking) user.el.classList.add('walking');
      else applyWalking(user);
    }
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

  const ROW_MAX = gatherRowMax;
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

function gatherContentMode() {
  if (!contentMode) return;
  const stageEl = document.getElementById('stage');
  if (!stageEl) return;
  const stageW = stageEl.clientWidth;
  const stageH = stageEl.clientHeight;
  const onStage = Object.values(users).filter(u => u.el);
  if (!onStage.length) return;
  const charW = u => u.el.offsetWidth  || Math.round(u.size * 1.5 * charSizeScale);
  const charH = u => u.el.offsetHeight || Math.round(u.size * 1.5 * charSizeScale) + 48;
  const ml = contentModeGatherMarginLeft;
  const mr = contentModeGatherMarginRight;
  const effectiveW = Math.max(100, stageW - ml - mr);
  const n = onStage.length;
  const step   = n > 1 ? effectiveW / n : 0;
  const startX = ml + (effectiveW - (step * (n - 1) + charW(onStage[0]))) / 2;
  onStage.forEach((u, i) => {
    u.x = Math.max(0, Math.round(startX + step * i));
    u.y = Math.max(0, stageH - charH(u) - contentModeGatherMarginBottom);
    u.el.style.transition = 'left 600ms cubic-bezier(0.34,1.56,0.64,1), top 600ms cubic-bezier(0.34,1.56,0.64,1)';
    u.el.style.left = u.x + 'px';
    u.el.style.top  = u.y + 'px';
  });
  if (bossState?.el) {
    const cmX = localStorage.getItem('bossX_cm');
    const cmY = localStorage.getItem('bossY_cm');
    bossState.el.style.transition = 'left 600ms cubic-bezier(0.34,1.56,0.64,1), top 600ms cubic-bezier(0.34,1.56,0.64,1)';
    if (cmX !== null && cmY !== null) {
      bossState.el.style.left = parseInt(cmX) + 'px';
      bossState.el.style.top  = parseInt(cmY) + 'px';
    } else {
      const bossH = bossState.el.offsetHeight;
      bossState.el.style.top = Math.max(0, stageH - bossH - contentModeGatherMarginBottom) + 'px';
    }
  }
}

function gatherCharactersBottom() {
  if (contentMode) { gatherContentMode(); return; }
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
    u.y = Math.max(0, stageH - charH(u) - gatherMarginBottom);
    u.el.style.transition = 'left 600ms cubic-bezier(0.34,1.56,0.64,1), top 600ms cubic-bezier(0.34,1.56,0.64,1)';
    u.el.style.left = u.x + 'px';
    u.el.style.top  = u.y + 'px';
  });
}

// ボスバトル開始時: 左下・右下にキャラ集合（中央30%は空ける・下半分に収める・重なりOK）
function _agruBattleGatherChars() {
  const onStage = Object.values(users).filter(u => u.el);
  if (!onStage.length) return;
  const stageW = stage.clientWidth;
  const stageH = stage.clientHeight;
  const cw = u => u.el.offsetWidth  || Math.round(u.size * 1.5 * charSizeScale);
  const ch = u => u.el.offsetHeight || Math.round(u.size * 1.5 * charSizeScale) + 48;
  // 元位置・向きを保存
  onStage.forEach(u => { u._preBattleX = u.x; u._preBattleY = u.y; u._preBattleFacing = u.facingRight; });
  // 半分ずつ左右に分ける
  const half       = Math.ceil(onStage.length / 2);
  const leftGroup  = onStage.slice(0, half);
  const rightGroup = onStage.slice(half);
  // 中央30%を空ける: 左ゾーン=0〜35%、右ゾーン=65%〜100%
  const ZONE_L_R = stageW * 0.35;
  const ZONE_R_L = stageW * 0.65;
  const EASE = 'left 700ms cubic-bezier(0.34,1.56,0.64,1), top 700ms cubic-bezier(0.34,1.56,0.64,1)';
  function placeGroup(group, zoneL, zoneR, forceFacingRight) {
    if (!group.length) return;
    const zoneW = zoneR - zoneL;
    const n = group.length;
    const step = n > 1 ? zoneW / n : zoneW / 2;
    group.forEach((u, i) => {
      const cx = zoneL + step * i + step / 2;
      u.x = Math.round(cx - cw(u) / 2);
      u.y = stageH - ch(u);
      u.el.style.transition = EASE;
      u.el.style.left = u.x + 'px';
      u.el.style.top  = u.y + 'px';
      // 向きを強制セット
      if (forceFacingRight !== undefined) {
        u.facingRight = forceFacingRight;
        applyFacingFlip(u);
      }
    });
  }
  placeGroup(leftGroup,  0,        ZONE_L_R, true);   // 左グループは右向き（水平反転）
  placeGroup(rightGroup, ZONE_R_L, stageW,   false);  // 右グループはデフォルト向き
}

// ボスバトル終了時: 元位置に復元
function _agruBattleRestoreChars() {
  const EASE = 'left 700ms cubic-bezier(0.34,1.56,0.64,1), top 700ms cubic-bezier(0.34,1.56,0.64,1)';
  Object.values(users).forEach(u => {
    if (!u.el || u._preBattleX === undefined) return;
    u.x = u._preBattleX; u.y = u._preBattleY;
    u.el.style.transition = EASE;
    u.el.style.left = u.x + 'px'; u.el.style.top = u.y + 'px';
    if (u._preBattleFacing !== undefined) {
      u.facingRight = u._preBattleFacing;
    } else if (u._preBattleX !== undefined) {
      // バトル前に向き未設定だったキャラ: placeGroup による強制反転を解除
      delete u.facingRight;
    }
    applyFacingFlip(u);
    delete u._preBattleX; delete u._preBattleY; delete u._preBattleFacing;
  });
}

function setCompactMode(on) {
  compactMode = on;
  document.body.classList.toggle('compact-mode', on);

  // ボス表示切替
  if (bossState?.el) bossState.el.style.display = on ? 'none' : '';

  // ランキングパネル
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

