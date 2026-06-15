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
    } catch (err) {
      console.error('BG upload error:', err);
    }
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
  'sdWidth','sdHeight','sdSteps','sdPopWidth','sdPositiveSuffix','sdNegative','sdDisplayTime',
  'sdMosaicKeywords','sdMosaicBlock','sdCfgScale','sdSampler',
  'ollamaReviewPrompt',
  'agruSystem','agruDefaultImage','agruEmotionMap',
  'agruVoicevoxEnabled','agruVoicevoxSpeaker','agruVoicevoxSpeed','agruVoicevoxVolume',
  'agruSdWidth','agruSdHeight','agruSdSteps','agruSdCfgScale','agruSdPositiveSuffix','agruIdleDelay','agruIdleDelayImage',
  'agruChatFontSize','agruChatBold','agruFontLeft','agruFontRight','agruCharTags','agruYtVolume','agruBgmVolume','agruYtWidth','agruYtHeight','agruYtOpacity','agruYtEnabled','agruModalZ','agruYtModalZ',
  'agruModalWidth','agruModalHeight','agruModalBgOpacity','agruChatImgSize','agruCharImgHeight','agruCharImgScale',
  'bombHidden','trashHidden','charStatsHidden','charNameHidden','breatheDisabled','bossFloatDisabled',
  'newsTickerEnabled','newsTickerWidth','newsTickerX','newsTickerY','newsTickerRows','newsTickerFontSize','newsTickerBgOpacity','newsTickerSpeed','newsTickerMode','newsTickerInterval','newsTickerTategaki','newsTickerHeight',
  'dmgFontScale',
  'wordlePanelWidth','wordlePanelBgOpacity','rankingPanelBgOpacity','quizPanelBgOpacity',
  'agruImgCmdEnabled','agruUnloadEnabled',
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
  const px = Math.round(user.size * 1.5 * charSizeScale * (user.sizeScale || 1) * (user.brWinnerScale || 1));
  a.style.width  = px + 'px';
  a.style.height = px + 'px';
  a.style.transform = '';
  const imgFile = user.charImage || charImages[user.charDef.id] || 'kisyokeee.png';
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
  const px   = Math.max(20, Math.round(user.size * 0.75 * charSizeScale * petSizeScale * (user.sizeScale || 1) * (user.brWinnerScale || 1)));
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
    savedSizeScales[u.ipid] = u.sizeScaleBase ?? 1.0;
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
    bets: {},
    betPhase: true,
    betTimer: null,
  };

  // ベット受付フェーズ（30秒）
  taimanState.betTimer = setTimeout(() => {
    if (!taimanState) return;
    taimanState.betPhase = false;
    document.getElementById('taimanBetBanner')?.remove();
    renderTaimanHpBars();
    addToLog(challenger, '🎰 ベット締め切り！', '#fbbf24');
  }, 30000);

  updateStatsDisplay(challenger);
  updateStatsDisplay(target);
  renderTaimanHpBars();
  showTaimanIntroBanner(challenger, target);
  showTaimanBetBanner(challenger, target);
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
  const cBets = Object.values(taimanState.bets).filter(b => b.side === 'challenger').reduce((s, b) => s + b.amount, 0);
  const tBets = Object.values(taimanState.bets).filter(b => b.side === 'target').reduce((s, b) => s + b.amount, 0);
  const betLabel = taimanState.betPhase ? '🎰 受付中' : '🎰';
  const el = document.createElement('div');
  el.id = 'taimanHpBars';
  el.className = 'taiman-hp-bars';
  el.innerHTML = `
    <div class="taiman-hp-side">
      <div class="taiman-fighter-name">1️⃣ ${escapeHtml(c.name)}</div>
      <div class="taiman-hp-track">
        <div class="taiman-hp-fill taiman-hp-fill-left" style="width:${Math.max(0, cHp / cMax * 100).toFixed(1)}%"></div>
      </div>
      <div class="taiman-hp-text">${cHp.toLocaleString()} / ${cMax.toLocaleString()}</div>
      ${cBets > 0 || taimanState.betPhase ? `<div class="taiman-bet-total">${betLabel} ${cBets.toLocaleString()}MP</div>` : ''}
    </div>
    <div class="taiman-vs-label">⚔️ VS ⚔️</div>
    <div class="taiman-hp-side">
      <div class="taiman-fighter-name">2️⃣ ${escapeHtml(t.name)}</div>
      <div class="taiman-hp-track">
        <div class="taiman-hp-fill taiman-hp-fill-right" style="width:${Math.max(0, tHp / tMax * 100).toFixed(1)}%"></div>
      </div>
      <div class="taiman-hp-text">${tHp.toLocaleString()} / ${tMax.toLocaleString()}</div>
      ${tBets > 0 || taimanState.betPhase ? `<div class="taiman-bet-total">${betLabel} ${tBets.toLocaleString()}MP</div>` : ''}
    </div>
  `;
  stage.appendChild(el);
}

function showTaimanBetBanner(challenger, target) {
  const prev = document.getElementById('taimanBetBanner');
  if (prev) prev.remove();
  const el = document.createElement('div');
  el.id = 'taimanBetBanner';
  el.className = 'taiman-bet-banner';
  el.innerHTML = `
    <div class="taiman-bet-title">🎰 ベット受付中！（30秒）</div>
    <div class="taiman-bet-cmd">1のキャラに10MP賭ける場合 → ベット 1 10 とコメント</div>
    <div class="taiman-bet-sides">
      <span>1️⃣ ${escapeHtml(challenger.name)}</span>
      <span class="taiman-bet-vs-small">vs</span>
      <span>2️⃣ ${escapeHtml(target.name)}</span>
    </div>
    <div class="taiman-bet-odds">的中で2倍返し</div>
  `;
  stage.appendChild(el);
  setTimeout(() => el.remove(), 30000);
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
  const handicap = attacker.taimanDmgMult ?? 1;
  let dmg = Math.round((isCrit
    ? Math.max(1, atk * (2 + Math.floor(Math.random() * 3)) * 2)
    : Math.max(1, atk * (1 + Math.floor(Math.random() * 3)))) * hayaMult * (titleBon.dmgM || 1) * handicap);
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
      const base = Math.max(1, Math.round(calcAtk(attacker) * 0.25 * handicap));
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
    u.sizeScale = snapshot.savedSizeScales[u.ipid] ?? (u.sizeScaleBase ?? 1.0);
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
      loserAvatar.innerHTML = `<img src="/chara-s/248106.png" alt="${escapeHtml(loser.name)}">`;
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
      const orig = u._taimanDefeatImg;
      delete u._taimanDefeatToken;
      delete u._taimanDefeatImg;
      delete u._taimanDefeatTimer;
      u.charImage = orig;
      applyAvatarStyle(u);
      addToLog(u, `[タイマン敗北1分経過 → 元のキャラに戻す]`, '#f87171');
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

  // ── ベット払い戻し ──────────────────────────────────────────────────
  clearTimeout(snapshot.betTimer);
  document.getElementById('taimanBetBanner')?.remove();
  const _bets = snapshot.bets ?? {};
  if (Object.keys(_bets).length > 0) {
    const winSide = winner ? (winner.ipid === snapshot.challenger ? 'challenger' : 'target') : null;
    Object.entries(_bets).forEach(([ipid, bet]) => {
      const bettor = users[ipid];
      if (!bettor) return;
      if (winSide === null) {
        // キャンセル → 全額返金
        bettor.mp = (bettor.mp ?? 0) + bet.amount;
        updateStatsDisplay(bettor);
        showBubble(bettor, `🎰 返金 MP+${bet.amount}`, {});
      } else if (bet.side === winSide) {
        // 的中 → 2倍
        const payout = bet.amount * 2;
        bettor.mp = (bettor.mp ?? 0) + payout;
        updateStatsDisplay(bettor);
        setTimeout(() => {
          if (!bettor.el) return;
          const { x, y } = getCharCenter(bettor);
          showDamageNumber(x, y - 40, `🎰 的中！ MP+${payout}`, false, 16, '#fbbf24');
          showBubble(bettor, `🎰 的中！ MP+${payout}`, {});
        }, 1500);
      } else {
        // 外れ → 吹き出しのみ（MPは既に引き去り済み）
        setTimeout(() => {
          if (!bettor.el) return;
          showBubble(bettor, '🎰 ハズレ…', {});
        }, 1500);
      }
    });
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
  el.style.fontSize = Math.round((forceFontSize
    ? forceFontSize * 3
    : Math.min((18 + Math.floor(numVal / 4) * 3) * 3, 174)) * (dmgFontScale / 100) * 2) + 'px';
  if (color) el.style.color = color;
  // stage座標→ビューポート座標に変換し body に追加（エフェクトcanvas z-index:9999 より手前にするため）
  const sr = stage.getBoundingClientRect();
  const rawX = x + sr.left - 15 + (Math.random() - 0.5) * 60;
  const rawY = y + sr.top       + (Math.random() - 0.5) * 30;
  el.style.left   = rawX + 'px';
  el.style.top    = rawY + 'px';
  el.style.zIndex = 10000;
  document.body.appendChild(el);
  // clamp to viewport
  const ew = el.offsetWidth;
  const eh = el.offsetHeight;
  const cx = Math.max(0, Math.min(rawX, window.innerWidth  - ew));
  const cy = Math.max(0, Math.min(rawY, window.innerHeight - eh));
  if (cx !== rawX) el.style.left = cx + 'px';
  if (cy !== rawY) el.style.top  = cy + 'px';
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

function _swapPanelPositions(toContentMode) {
  const panels = [
    { stateGetter: () => rankingState, id: 'rankingPanel', xKey: 'rankingPanelX', yKey: 'rankingPanelY' },
    { stateGetter: () => wordleState,  id: 'wordlePanel',  xKey: 'wordlePanelX',  yKey: 'wordlePanelY'  },
    { stateGetter: () => quizState,    id: 'quizPanel',    xKey: 'quizPanelX',    yKey: 'quizPanelY'    },
  ];
  panels.forEach(({ stateGetter, id, xKey, yKey }) => {
    const s = stateGetter();
    if (!s) return;
    const fromKey = toContentMode ? xKey        : xKey + '_cm';
    const toKey   = toContentMode ? xKey + '_cm' : xKey;
    const fromKeyY = toContentMode ? yKey        : yKey + '_cm';
    const toKeyY   = toContentMode ? yKey + '_cm' : yKey;
    // save current position to the "from" key
    localStorage.setItem(fromKey,  Math.round(s.panelX));
    localStorage.setItem(fromKeyY, Math.round(s.panelY));
    // load saved position for the target mode
    const nx = parseInt(localStorage.getItem(toKey));
    const ny = parseInt(localStorage.getItem(toKeyY));
    if (!isNaN(nx)) { s.panelX = nx; }
    if (!isNaN(ny)) { s.panelY = ny; }
    const el = document.getElementById(id);
    if (el) { el.style.left = s.panelX + 'px'; el.style.top = s.panelY + 'px'; }
  });
}

function toggleContentMode() {
  const stage = document.getElementById('stage');
  if (!stage) return;
  contentMode = !contentMode;
  stage.classList.toggle('content-mode', contentMode);

  if (contentMode) {
    contentModeSaved = {};

    // キャラを70%縮小して下集合
    Object.values(users).forEach(u => {
      if (!u.el) return;
      contentModeSaved[u.ipid] = { x: u.x, y: u.y, sizeScale: u.sizeScale || 1 };
      u.sizeScale = (u.sizeScale || 1) * (contentModeCharSizePct / 100);
      applyAvatarStyle(u);
      renderPetBadge(u);
    });
    // アバターの width/height トランジション (0.3s) 完了後に offsetHeight が確定するので 350ms 待って下集合
    setTimeout(() => gatherContentMode(), 350);

    // ボスを10%に縮小
    if (bossState?.el) {
      const ba = bossState.el.querySelector('#bossAvatar');
      const currentPx = ba ? (parseInt(ba.style.width) || bossState.origSize) : bossState.origSize;
      contentModeBossSaved = {
        sizeScale: bossSizeScale,
        px: currentPx,
        x: parseInt(bossState.el.style.left) || 0,
        y: parseInt(bossState.el.style.top)  || 0,
      };
      const newPx = Math.round(currentPx * (contentModeBossSizePct / 100));
      if (ba) applyBossAvatarAspect(newPx);
    }

    // パネル位置をコンテンツモード用に切り替え
    _swapPanelPositions(true);

  } else {
    Object.values(users).forEach(u => {
      if (!u.el) return;
      const saved = contentModeSaved[u.ipid];
      if (saved) {
        u.sizeScale = saved.sizeScale;
        u.x = saved.x;
        u.y = saved.y;
        u.el.style.left = u.x + 'px';
        u.el.style.top  = u.y + 'px';
        applyAvatarStyle(u);
        renderPetBadge(u);
      }
    });
    contentModeSaved = {};

    if (contentModeBossSaved && bossState?.el) {
      // 現在のCMボス位置を保存してから通常位置へ復元
      localStorage.setItem('bossX_cm', parseInt(bossState.el.style.left) || 0);
      localStorage.setItem('bossY_cm', parseInt(bossState.el.style.top)  || 0);
      const ba = bossState.el.querySelector('#bossAvatar');
      if (ba) {
        const restorePx = Math.round(200 * bossSizeScale);
        bossState.origSize = restorePx;
        applyBossAvatarAspect(restorePx);
      }
      bossState.el.style.transition = 'left 600ms cubic-bezier(0.34,1.56,0.64,1), top 600ms cubic-bezier(0.34,1.56,0.64,1)';
      bossState.el.style.left = contentModeBossSaved.x + 'px';
      bossState.el.style.top  = contentModeBossSaved.y + 'px';
      contentModeBossSaved = null;
    }

    // パネル位置を通常モード用に切り替え
    _swapPanelPositions(false);
  }
}

function spawnBoss(maxHp) {
  bossManuallyCleared = false;
  bossDamageMap = {};
  if (bossState) {
    if (bossState.el) bossState.el.remove();
  }
  // ボス画像：charaフォルダからランダム選択（リスナー勝利後はアゲル系を除外）
  const _bossAgruExclude = _agruPlayersWon && agruBattleConfig?.agruTypeImages?.length
    ? new Set(agruBattleConfig.agruTypeImages.map(s => s.trim()).filter(Boolean))
    : null;
  const _bossImgPool = _bossAgruExclude
    ? availableImages.filter(f => !_bossAgruExclude.has(f))
    : availableImages;
  const bossImg = _bossImgPool.length > 0
    ? _bossImgPool[Math.floor(Math.random() * _bossImgPool.length)]
    : (availableImages.length > 0 ? availableImages[Math.floor(Math.random() * availableImages.length)] : null);
  const avatarInner = bossImg
    ? `<img src="/chara-s/${encodeURIComponent(bossImg)}" alt="boss">`
    : '🐉';

  const bossSize = Math.round(200 * bossSizeScale);
  const barWidth = Math.round(bossSize * 0.6);

  const el = document.createElement('div');
  el.id = 'bossEl';
  const _bsX = localStorage.getItem(panelKey('bossX'));
  const _bsY = localStorage.getItem(panelKey('bossY'));
  const _spawnPos = (_bsX !== null && _bsY !== null) ? { x: parseInt(_bsX), y: parseInt(_bsY) } : bossLastPos;
  el.style.left = (_spawnPos ? _spawnPos.x : Math.max(0, stage.clientWidth / 2 - barWidth / 2)) + 'px';
  el.style.top  = (_spawnPos ? _spawnPos.y : 20) + 'px';
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
  bossState = { hp: maxHp, maxHp, el, defeated: false, origSize: bossSize, imgFile: bossImg || null };
  updateBossHpDisplay();
  // コンテンツモード中に出現したボスにはコンテンツモードサイズを適用
  if (contentMode) {
    const ba = el.querySelector('#bossAvatar');
    contentModeBossSaved = {
      sizeScale: bossSizeScale,
      px: bossSize,
      x: parseInt(el.style.left) || 0,
      y: parseInt(el.style.top)  || 0,
    };
    const newPx = Math.round(bossSize * (contentModeBossSizePct / 100));
    if (ba) {
      ba.style.width    = newPx + 'px';
      ba.style.height   = newPx + 'px';
      ba.style.fontSize = Math.round(newPx * 0.87) + 'px';
    }
    // サイズ確定後に下集合
    setTimeout(() => gatherContentMode(), 350);
  }
  if (bossImg) {
    const bossAvatarEl = document.getElementById('bossAvatar');
    const bossImgEl = bossAvatarEl?.querySelector('img');
    const _initBossEffects = () => { applyBossAvatarAspect(bossState.origSize); };
    if (bossImgEl && !bossImgEl.complete) {
      bossImgEl.addEventListener('load', _initBossEffects, { once: true });
    } else {
      _initBossEffects();
    }
  }

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
  if (ba) {
    ba.innerHTML = `<img src="/chara-s/img_-0002-2607607172.png" alt="スピキ">`;
    const spikiImg = ba.querySelector('img');
    if (spikiImg && !spikiImg.complete) {
      spikiImg.addEventListener('load', () => applyBossAvatarAspect(bossState.origSize), { once: true });
    } else {
      applyBossAvatarAspect(bossState.origSize);
    }
  }
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
    showLevelUpBanner(user);
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
        applyBossHitShake(bossState.el);
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
  if (bossState.el) {
    const x = parseInt(bossState.el.style.left) || 0;
    const y = parseInt(bossState.el.style.top)  || 0;
    localStorage.setItem(panelKey('bossX'), x);
    localStorage.setItem(panelKey('bossY'), y);
    bossLastPos = { x, y };
  }
  bossState.defeated = true;
  bossCount++;
  const bossMaxHp = bossState.maxHp;
  const el = bossState.el;

  // ボス撃破アニメーション（倒れて床にスライド）
  el.classList.add('boss-dying');

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
      if (existing) {
        const area = u.el?.querySelector('.char-equip-area');
        const badge = area && [...area.querySelectorAll('.char-equip-badge')]
          .find(b => b.title.startsWith(existing.name + '['));
        if (badge) showEquipSynthPop(badge, existing);
        showDamageNumber(x, y - 40, `${existing.stat === 'atk' ? 'ATK' : 'HP'}+${existing.value}`, false, 14, '#fbbf24');
      }
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
    // 通算ダメージに加算
    Object.entries(bossDamageMap).forEach(([ipid, d]) => {
      if (!cumulativeDmgMap[ipid]) cumulativeDmgMap[ipid] = { name: d.name, totalDmg: 0 };
      cumulativeDmgMap[ipid].name   = d.name;
      cumulativeDmgMap[ipid].totalDmg += d.totalDmg;
    });
    localStorage.setItem('cumulativeDmgMap', JSON.stringify(cumulativeDmgMap));
    showDamageRanking(cumulativeDmgMap);
    // 手動消去でなければ次のボスを自動召喚（討伐演出が落ち着く頃に）
    if (!bossManuallyCleared && !compactMode) {
      setTimeout(() => {
        if (bossState || bossManuallyCleared || compactMode) return;
        spawnBoss(nextBossHp());
      }, 6000);
    }
  }, 950);
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

function showLevelUpBanner(user) {
  const wrap = user?.el?.querySelector('.avatar-wrap');
  if (!wrap) return;
  const prev = wrap.querySelector('.levelup-char-banner');
  if (prev) prev.remove();
  const el = document.createElement('div');
  el.className = 'levelup-char-banner';
  el.innerHTML = '<img src="/img/levelup.png" alt="Level Up!">';
  wrap.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
  playLocalSound('/sound/char/maplestory-lvl-up.mp3');
}

function showEquipSynthPop(badge, equip) {
  const pop = document.createElement('span');
  pop.className = 'equip-synth-pop';
  pop.textContent = (equip?.icon || '') + '+';
  badge.appendChild(pop);
  pop.addEventListener('animationend', () => pop.remove(), { once: true });
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
  if (comment.from === 'master') user.isMaster = true;
  // icon_num がある場合はセーブキーを更新し、icon_numキーの既存セーブでキャラを上書き
  if (comment.icon_num) {
    const iconKey = String(comment.icon_num);
    if (user.saveKey !== iconKey) {
      user.saveKey = iconKey;
      const savedByIcon = _charSaveData[iconKey];
      if (savedByIcon) {
        CHAR_SAVE_FIELDS.forEach(k => { if (savedByIcon[k] !== undefined) user[k] = savedByIcon[k]; });
        user.sizeScale = user.sizeScaleBase ?? 1.0;
        user.atk   = calcAtk(user);
        user.maxHp = calcMaxHp(user);
        if (['textColor','bubbleShape','bubbleDeco','bubbleBgColor','font','charImage'].some(k => savedByIcon[k] !== undefined)) {
          user.firstAppear = false;
        }
        // キャラがステージ上にいる場合は表示を即時更新
        if (user.el) {
          applyAvatarStyle(user);
          updateNameDisplay(user);
          updateStatsDisplay(user);
          updateLevelBadge(user);
          applyPets(user);
        }
      }
    }
  }

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
  if (user.el) user.el.style.zIndex = ++charZCounter;

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
      showLevelUpBanner(user);
    }
  }

  const rawMessage = decodeHtml(comment.message ?? '');
  const message    = stripPrefix(rawMessage);
  if (message) {
    if (!user.recentComments) user.recentComments = [];
    user.recentComments.push(message);
    if (user.recentComments.length > 150) user.recentComments.shift();
  }

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

  // ── ベット（タイマン中）──
  if (taimanState?.betPhase) {
    const betMsg = message.trim()
      .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
      .replace(/　/g, ' ');
    const betMatch = betMsg.match(/^ベット\s+([12])\s+(\d+)$/);
    if (betMatch) {
      const side   = betMatch[1] === '1' ? 'challenger' : 'target';
      const amount = parseInt(betMatch[2]);
      const hasMp  = (user.mp ?? 0);
      if (amount < 1 || hasMp < amount) {
        showBubble(user, amount < 1 ? 'ベット額は1以上で' : `MPが足りません（所持:${hasMp}）`, {});
      } else {
        // 既存ベットを返金してから再ベット
        const prev = taimanState.bets[user.ipid];
        if (prev) user.mp = (user.mp ?? 0) + prev.amount;
        user.mp = (user.mp ?? 0) - amount;
        taimanState.bets[user.ipid] = { side, amount };
        updateStatsDisplay(user);
        const sideName = side === 'challenger' ? users[taimanState.challenger]?.name : users[taimanState.target]?.name;
        showBubble(user, `🎰 ${escapeHtml(sideName)} に ${amount}MP ベット！`, {});
        renderTaimanHpBars();
      }
    }
  }

  // ── 応援（タイマン中）──
  if (taimanState?.active) {
    const _fighters = [users[taimanState.challenger], users[taimanState.target]];
    _fighters.forEach(fighter => {
      if (!fighter || !fighter.name || fighter.name.length < 2) return;
      if (!message.includes(fighter.name)) return;
      if (fighter.ipid === user.ipid) return; // 自分で自分を応援は無効
      const fid  = fighter.ipid;
      const heal = Math.round(taimanState.maxHp[fid] * 0.30);
      taimanState.hp[fid] = Math.min(taimanState.maxHp[fid], taimanState.hp[fid] + heal);
      updateStatsDisplay(fighter);
      renderTaimanHpBars();
      const { x: cx, y: cy } = getCharCenter(fighter);
      showDamageNumber(cx, cy - 50, `💪 HP+${heal.toLocaleString()}`, false, 18, '#4ade80');
      showBubble(fighter, `💪 ${user.name}に応援された！`, {});
      addToLog(fighter, `💪 応援(${user.name}) HP+${heal.toLocaleString()}`, '#4ade80');
    });
  }

  // ── YouTube URL 共有でMP回復 ──
  if (!agruBattleActive) {
    // comment.urlはURLエンコードされている場合がある（例: v%3DID → v=ID）
    const urlDecoded = comment.url ? decodeURIComponent(comment.url) : '';
    const plainMsg = (comment.message ?? '').replace(/<[^>]+>/g, ' ');
    const searchTarget = urlDecoded + ' ' + plainMsg + ' ' + rawMessage;
    const ytMatch = searchTarget.match(/(?:youtu\.be\/|[?&]v=|shorts\/|live\/)([A-Za-z0-9_-]{11})/);
    if (ytMatch) {
      const videoId = ytMatch[1];
      const ytTimeMatch = searchTarget.match(/[?&]t=(\d+)/);
      const startTime = ytTimeMatch ? parseInt(ytTimeMatch[1]) : 0;
      if (agruYtEnabled) _agruPlayYouTube(videoId, startTime);
      if (seenYoutubeUrls.has(videoId)) {
        postAIReply('もうみた');
      } else {
        seenYoutubeUrls.add(videoId);
        if ((user.mp ?? 0) < 30) {
          ensureCharOnStage(user);
          showBubble(user, `MPが足りない… (${user.mp ?? 0}/30)`, {});
        } else {
          user.mp = (user.mp ?? 0) - 30;
          updateStatsDisplay(user);
          ensureCharOnStage(user);
          showBubble(user, '📺 YouTube共有！ MP-30', {});
          const { x: yx, y: yy } = getCharCenter(user);
          showDamageNumber(yx, yy - 40, 'MP-30', false, 20, '#60a5fa');
          addToLog(user, '📺 YouTube共有 MP-30', '#60a5fa');
        }
      }
    }
  }

  // ── Suno URL 共有でMP回復 ──
  {
    const urlDecoded = comment.url ? decodeURIComponent(comment.url) : '';
    const plainMsg = (comment.message ?? '').replace(/<[^>]+>/g, ' ');
    const searchTarget = urlDecoded + ' ' + plainMsg + ' ' + rawMessage;
    const sunoMatch = searchTarget.match(/suno\.com\/(?:song\/([a-f0-9-]{36})|s\/([A-Za-z0-9_-]+))/i);
    const kukuMatch = !sunoMatch && agruYtEnabled && searchTarget.match(/https?:\/\/kuku\.lu\/[A-Za-z0-9]+/i);
    if (kukuMatch && !triedKukuUrls.has(kukuMatch[0])) {
      triedKukuUrls.add(kukuMatch[0]);
      _tryKukuSuno(user, kukuMatch[0]);
    }
    if (sunoMatch) {
      _handleSunoUrl(user, sunoMatch[1] ?? sunoMatch[2]);
    }
  }

  // ── 不在確認ワード自動返答 ──
  if (autoReplyWords.length > 0 && autoReplyMessages.length > 0 &&
      autoReplyWords.some(w => w && rawMessage.includes(w)) && !_aiPostedTexts.has(message)) {
    const reply = autoReplyMessages[Math.floor(Math.random() * autoReplyMessages.length)];
    postAIReply(reply);
  }

  // ── 5分モード：AI自動返答（master本人とAI投稿はスキップ） ──
  if (fiveMinMode) {
    if (isMasterUser(user)) {
      _aiLog('skip: 自分のコメント');
    } else if (_aiPostedTexts.has(message)) {
      _aiLog('skip: AI投稿ループ防止');
    } else {
      askAIAndPost(user, message, comment.number);
    }
  }

  // ── YouTube停止（会話モード外でも有効）── 50MP消費
  if (!agruBattleActive && /止めて/.test(message)) {
    if ((user.mp ?? 0) < 50) {
      showBubble(user, `MPが足りない… (${user.mp ?? 0}/50)`, {});
    } else {
      user.mp -= 50;
      updateStatsDisplay(user);
      closeAgruYtModal();
    }
  }

  // ── 字幕コマンド ── 20MP消費
  {
    const jmatch = message.match(/^字幕[：:](.+)/);
    if (jmatch) {
      const ccText = jmatch[1].trim();
      if ((user.mp ?? 0) < 20) {
        showBubble(user, `MPが足りない… (${user.mp ?? 0}/20)`, {});
      } else {
        user.mp -= 20;
        updateStatsDisplay(user);
        fetch(`https://live.erinn.biz/api/?category=comment&type=speech&apikey=${encodeURIComponent(apikey)}&text=${encodeURIComponent(ccText)}`)
          .then(r => r.json())
          .then(data => {
            if (data.success === 1) {
              showBubble(user, `🎤 字幕送信！`, {});
            } else {
              user.mp += 20;
              updateStatsDisplay(user);
              showBubble(user, `字幕エラー: ${data.error_display || data.error || '不明'}`, {});
            }
          })
          .catch(() => {
            user.mp += 20;
            updateStatsDisplay(user);
            showBubble(user, `字幕送信失敗`, {});
          });
      }
    }
  }

  // ── ボスアゲルバトル攻撃 ──
  if (agruBattleActive) attackAgruBoss(user, message.length, message);

  // ── アゲルちゃん会話モード ──
  if (agruActive && message.trim() === 'カフェオレ投与') {
    if ((user.mp ?? 0) < 50) {
      showBubble(user, `MPが足りない… (${user.mp ?? 0}/50)`, {});
    } else {
      user.mp -= 50;
      updateStatsDisplay(user);
      agruAffinity = Math.min(100, agruAffinity + 20);
      _agruUpdateAffinityDisplay(20);
      _agruAddSystemMsg(`${user.name || '名無し'}がカフェオレをプレゼントした！好感度あがった！`);
    }
  } else if (agruActive && message.trim() === '水道水投与') {
    if ((user.mp ?? 0) < 10) {
      showBubble(user, `MPが足りない… (${user.mp ?? 0}/10)`, {});
    } else {
      user.mp -= 10;
      updateStatsDisplay(user);
      agruAffinity = Math.max(0, agruAffinity - 5);
      _agruUpdateAffinityDisplay(-5);
      _agruAddSystemMsg(`${user.name || '名無し'}が水道水を投与した…好感度さがった…`);
    }
  } else if (agruActive && /肉投与|寿司投与|たばこ投与|起きろ|エナドリ/.test(message)) {
    _agruUpdateParams(message);
    let _sysText = `${user.name || '名無し'}が`;
    if (/肉投与/.test(message))      _sysText += '肉を投与した！お腹が回復した！';
    else if (/寿司投与/.test(message))   _sysText += '寿司を投与した！お腹が少し回復した！';
    else if (/たばこ投与/.test(message))  _sysText += 'たばこを投与した！お腹と眠気が少し回復した！';
    else if (/エナドリ/.test(message))   _sysText += 'エナドリを投与した！眠気が大幅に回復した！';
    else if (/起きろ/.test(message))    _sysText += '起こした！眠気が少し減った！';
    _agruAddSystemMsg(_sysText);
  } else if (agruActive && /毒投与/.test(message)) {
    const _prevHunger = agruHunger;
    agruHunger = Math.max(0, agruHunger - 10);
    _agruUpdateHungerDisplay(agruHunger - _prevHunger);
    _agruPoisonTurns = 6;
    _agruAddSystemMsg(`☠️ ${user.name || '名無し'}が毒を投与した！空腹度が減った…`);
    _agruShowStateImage('毒');
    if (agruIdle) _agruSend(message, user.name);
  } else if (!agruBattleActive && agruActive && agruIdle && message.trim() && !/^[ァ-ヶー]{5}$/.test(message.trim()) && !_isAgruSkipCmd(message)) {
    _agruSend(message, user.name);
  }

  // ── ボスアゲルバトル中：射・回復 以外のコマンドを全て無効化 ──
  if (agruBattleActive) {
    if (message.includes('射')) {
      ensureCharOnStage(user);
      showBubble(user, message, {});
      launchBullets(user, message);
    } else if (message.includes('回復')) {
      ensureCharOnStage(user);
      const _mp = user.mp ?? 10;
      if (_mp >= 2) {
        user.mp = _mp - 2;
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
        showBubble(user, message, {});
      } else {
        showBubble(user, message + '（MPが足りない…）', {});
      }
      addToLog(user, message, '#7dd3fc');
    }
    return;
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
    if (compactMode || contentMode) return;
    ensureCharOnStage(user);
    if (taimanState) {
      showBubble(user, 'タイマン中です', {});
      return;
    }
    const TAIMAN_COOLDOWN = taimanCooldown;
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
      if (compactMode || contentMode) return;
      const targetName = taimanM[1].trim();
      ensureCharOnStage(user);
      if (taimanState) {
        showBubble(user, 'タイマン中です', {});
        return;
      }
      const TAIMAN_COOLDOWN = taimanCooldown;
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
    const canClearAfk = !isMasterUser(user) || message.trim() === '戻りました';
    if (canClearAfk) {
      user.afk = false;
      user.afkText = null;
      user.afkManual = false;
      if (user.afkEl) { user.afkEl.remove(); user.afkEl = null; }
      user.el?.classList.remove('char-afk');
    }
  }
  if (/AFK|ＡＦＫ/i.test(message)) {
    ensureCharOnStage(user);
    user.afk = true;
    user.afkManual = true;
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
    user.afkManual = true;
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
    if (!agruImgCmdEnabled) return; // 画像コマンド無視設定
    if (agruBattleActive) return; // バトル中は画像コマンド無効
    if (agruActive) return; // 会話モード中は _agruSend 側で処理
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
    if (!isMasterUser(user)) return;
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
    if (!agruBattleActive) {
      ensureCharOnStage(user); showBubble(user, message, {});
      openTreasureChest(user);
    }
    return;
  }

  // ── ペットガチャ10連 ──────────────────────────
  if (/10連ペットガチャ|ペットガチャ10連/.test(message)) {
    if (compactMode) { ensureCharOnStage(user); showBubble(user, 'コンパクトモード中は使用できません', {}); return; }
    ensureCharOnStage(user);
    if ((user.mp ?? 0) < 200) {
      showBubble(user, `MPが足りない… (${user.mp ?? 0}/200)`, {});
      return;
    }
    user.mp -= 200;
    updateStatsDisplay(user);
    if (!user.tc) user.tc = {};
    const _RARITY_ORD = {'rarity-myth':4,'rarity-legend':3,'rarity-epic':2,'rarity-rare':1,'':0};
    const _10pets = [];
    for (let i = 0; i < 10; i++) {
      user.tc.petGachas = (user.tc.petGachas || 0) + 1;
      const _p = rollPetGacha();
      const _gc = user.tc.petGachas;
      const _s2 = _gc >= 20 && _gc % 2 === 0;
      if (_s2) { user.pet2 = _p; } else { user.pet = _p; }
      if (_gc === 20) addToLog(user, `🎉 ペット2枠目解放 → ${_p.abilityName}[${_p.rarityName}]`, '#fbbf24');
      _10pets.push(_p);
    }
    renderPetBadge(user);
    showPetGacha10Anim(user, _10pets);
    const _best10 = _10pets.reduce((a, b) => (_RARITY_ORD[b.rarityCls]||0) > (_RARITY_ORD[a.rarityCls]||0) ? b : a, _10pets[0]);
    addToLog(user, `🐾 10連ガチャ → 最高: ${_best10.abilityName}[${_best10.rarityName}]`, '#a78bfa');
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
    if (compactMode || contentMode) return;
    ensureCharOnStage(user);
    showStatusModal(user, true, comment.number);
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
    const newName = nameM[1].slice(0, 10);
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
    if (user.bubbleBgColor && user.bubbleBgColor === user.textColor) {
      const others = Object.values(COLOR_NAMES).filter(v => v !== user.bubbleBgColor);
      user.textColor = others[Math.floor(Math.random() * others.length)];
    }
    display = display.replace(bgColorM[0], '').trim();
    updateNameDisplay(user);
  }

  const colorM = display.match(/色[：:]([\S]+)/);
  if (colorM) {
    const c = resolveColor(colorM[1]);
    if (c) {
      user.textColor = c;
      if (user.bubbleBgColor && user.bubbleBgColor === user.textColor) {
        const others = Object.values(COLOR_NAMES).filter(v => v !== user.bubbleBgColor);
        user.textColor = others[Math.floor(Math.random() * others.length)];
      }
      updateNameDisplay(user);
    }
    display = display.replace(colorM[0], '').trim();
  }

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
    const _now = Date.now();
    if ((_goshiariCooldown.get(ipid) ?? 0) + 5 * 60 * 1000 > _now) return;
    _goshiariCooldown.set(ipid, _now);
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
      const _sk = user.saveKey || ipid;
      delete _charSaveData[_sk];
      fetch(`/api/char-save/${encodeURIComponent(_sk)}`, { method: 'DELETE' }).catch(() => {});
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
  if (sizeM) {
    const sizeKey = sizeM[1];
    const sz = SIZE_MAP[sizeKey];
    if (sz) {
      if (sizeKey === '大') {
        if ((user.mp ?? 0) < 200) {
          showBubble(user, `MPが足りない… (${user.mp ?? 0}/200)`, {});
          return;
        }
        user.mp -= 200;
        updateStatsDisplay(user);
      }
      user.size = sz;
      ensureCharOnStage(user);
      applyAvatarStyle(user);
    }
    display = display.replace(sizeM[0], '').trim();
  }

  // フォント："Font Name" or フォント：エイリアス
  const fontM = display.match(/フォント[：:](?:"([^"]+)"|(\S+))/);
  if (fontM) {
    const raw = fontM[1] || fontM[2]; // quoted or unquoted
    user.font = Object.prototype.hasOwnProperty.call(FONT_MAP, raw)
      ? FONT_MAP[raw]
      : (fontM[1] ? `"${raw}"` : raw); // quoted → wrap in quotes, unquoted → use as-is
    display = display.replace(fontM[0], '').trim();
    updateNameDisplay(user);
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
    if (d !== undefined) { user.bubbleDeco = d; updateNameDisplay(user); }
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

  // ── >/＞先頭コメント：吹き出し4倍サイズ＋ガタガタ ── 20MP消費
  let _gatagata = false;
  if (/^[>＞]/.test(message)) {
    if ((user.mp ?? 0) < 20) {
      showBubble(user, `MPが足りない… (${user.mp ?? 0}/20)`, {});
      addToLog(user, message, user.textColor === '#111111' ? '#e2e8f0' : user.textColor);
      return;
    }
    user.mp -= 20;
    updateStatsDisplay(user);
    commentStyle.fontSize = (charFontSizes.bubble * 4) + 'px';
    display = display.replace(/^[>＞]/, '').trim() || display;
    _gatagata = true;
  }

  showBubble(user, display, commentStyle);
  if (_gatagata) {
    const _bEl = document.getElementById('b-' + user.ipid);
    if (_bEl) {
      _bEl.classList.add('bubble-gatagata');
      _bEl.addEventListener('animationend', () => _bEl.classList.remove('bubble-gatagata'), { once: true });
    }
  }

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

document.getElementById('clearStage')?.addEventListener('click', () => {
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

document.getElementById('toggleLog')?.addEventListener('click', () => {
  document.getElementById('commentLog').classList.toggle('hidden');
});

document.getElementById('copyObsUrl')?.addEventListener('click', () => {
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

document.getElementById('gatherBtn')?.addEventListener('click', gatherCharacters);
document.getElementById('gatherBottomBtn')?.addEventListener('click', gatherCharactersBottom);
document.getElementById('compactBtn')?.addEventListener('click', () => setCompactMode(!compactMode));
document.getElementById('fiveMinBtn')?.addEventListener('click', () => setFiveMinMode(!fiveMinMode));

document.getElementById('hayaoshiBtn')?.addEventListener('click', startHayaoshi);

document.getElementById('wordleBtn')?.addEventListener('click', () => {
  const panel = document.getElementById('wordlePanel');
  if (panel) {
    panel.remove();
    wordleState = null;
    localStorage.setItem('wordleVisible', '0');
  } else if (wordleWords.length > 0) {
    localStorage.setItem('wordleVisible', '1');
    startWordle();
  }
});

document.getElementById('quizBtn')?.addEventListener('click', () => {
  if (quizState) {
    stopQuiz();
  } else if (quizQuestions.length > 0) {
    startQuiz();
  }
});

document.getElementById('moveLockBtn')?.addEventListener('click', () => {
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

document.getElementById('debugBtn')?.addEventListener('click', () => {
  debugMode = !debugMode;
  document.getElementById('debugBtn').classList.toggle('active', debugMode);
  // 全キャラのステータス表示を即時更新
  Object.values(users).forEach(u => updateStatsDisplay(u));
});

document.getElementById('debugMpBtn')?.addEventListener('click', () => {
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

document.getElementById('battleRoyaleBtn')?.addEventListener('click', startBattleRoyale);

document.getElementById('spikiBossBtn')?.addEventListener('click', () => {
  spawnSpikiBoss();
});

document.getElementById('dismissBossBtn')?.addEventListener('click', () => {
  if (!bossState) return;
  bossManuallyCleared = true;
  if (bossState.el) {
    const x = parseInt(bossState.el.style.left) || 0;
    const y = parseInt(bossState.el.style.top)  || 0;
    localStorage.setItem(panelKey('bossX'), x);
    localStorage.setItem(panelKey('bossY'), y);
    bossLastPos = { x, y };
  }
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

document.getElementById('stopAllBtn')?.addEventListener('click', () => {
  Object.values(users).forEach(u => {
    u.movement = '止まれ';
    if (u.moveTimer) { clearTimeout(u.moveTimer); u.moveTimer = null; }
    if (u.el) u.el.style.transition = 'none';
    stopWalk(u);
    applyMotion(u, null);
  });
});

document.getElementById('moveAreaSelect')?.addEventListener('change', e => {
  moveArea = MOVE_AREA_MAP[e.target.value] || MOVE_AREA_MAP['all'];
  localStorage.setItem('moveArea', e.target.value);
  saveSettingsToServer();
});
(function initMoveArea() {
  const saved = localStorage.getItem('moveArea') || 'all';
  const sel = document.getElementById('moveAreaSelect');
  if (sel) sel.value = saved;
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
  if (charSlider) { charSlider.value = Math.round(savedChar * 100); }
  if (bossSlider) { bossSlider.value = Math.round(savedBoss * 100); }
  if (charVal) charVal.textContent = Math.round(savedChar * 100) + '%';
  if (bossVal) bossVal.textContent = Math.round(savedBoss * 100) + '%';

  charSlider?.addEventListener('input', () => {
    charSizeScale = charSlider.value / 100;
    if (charVal) charVal.textContent = charSlider.value + '%';
    localStorage.setItem('charSizeScale', charSizeScale);
    saveSettingsToServer();
    Object.values(users).forEach(u => { if (u.el) { applyAvatarStyle(u); renderPetBadge(u); } });
  });
  bossSlider?.addEventListener('input', () => {
    bossSizeScale = bossSlider.value / 100;
    if (bossVal) bossVal.textContent = bossSlider.value + '%';
    localStorage.setItem('bossSizeScale', bossSizeScale);
    saveSettingsToServer();
    if (bossState?.el) {
      const ba = bossState.el.querySelector('#bossAvatar');
      if (ba) {
        const newPx = Math.round(200 * bossSizeScale);
        bossState.origSize = newPx;
        const dispPx = (contentMode && contentModeBossSaved)
          ? Math.round(newPx * (contentModeBossSizePct / 100))
          : newPx;
        if (contentMode && contentModeBossSaved) contentModeBossSaved.px = newPx;
        applyBossAvatarAspect(dispPx);
      }
    }
  });

  document.getElementById('charSizeReset')?.addEventListener('click', () => {
    charSlider.value = 100;
    charSlider.dispatchEvent(new Event('input'));
  });
  document.getElementById('bossSizeReset')?.addEventListener('click', () => {
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
    const agruBossTarget = _kaiAgruBossTarget();
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
      // ボスアゲル当たり判定
      if (agruBossTarget) {
        const dx = b.x - agruBossTarget.cx, dy = b.y - agruBossTarget.cy;
        const now = performance.now();
        if (dx * dx + dy * dy < (b.r + agruBossTarget.r) ** 2) {
          if (!b.agruBossCooldown || now - b.agruBossCooldown > 500) {
            b.agruBossCooldown = now;
            const dmg = Math.floor(Math.random() * 5) + 1;
            _agruBattleDealDamage(dmg, b.user);
            showDamageNumber(agruBossTarget.cx + (Math.random() - 0.5) * 60, agruBossTarget.cy - 20, dmg, false);
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
// ボスアゲル当たり判定
function _kaiAgruBossTarget() {
  if (!agruBattleActive) return null;
  const imgEl = document.getElementById('agruBattleCharImg') || document.getElementById('agruCharImg');
  if (!imgEl || !imgEl.isConnected) return null;
  const br = imgEl.getBoundingClientRect();
  const sr = stage.getBoundingClientRect();
  const bx = br.left - sr.left, by = br.top - sr.top;
  return { cx: bx + br.width * 0.5, cy: by + br.height * 0.4, r: Math.min(br.width, br.height) * 0.4 };
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
let ollamaReviewPrompt = localStorage.getItem('ollamaReviewPrompt') || '';
const _aiPostedTexts = new Set();
const seenYoutubeUrls = new Set();
const seenSunoUrls = new Set();
const triedKukuUrls = new Set();
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

// ── アゲルちゃん会話モード ─────────────────────────────────────────
const AGRU_EMOTIONS = [
  '安心','愛しさ','感謝','性的興奮','興奮','感動','好奇心','驚き','尊敬','不安',
  '恐怖','困惑','冷静','軽蔑','殺意','悲しみ','諦め','苦しみ','嫉妬','恥',
];
const AGRU_DEFAULT_SYSTEM =
  '返答は必ず日本語のみを使用してください。中国語・英語・その他の言語は絶対に使わないでください。\n' +
  'あなたは「星井野アゲル（アゲルちゃん）」というキャラクターです。配信のコメントに感情豊かに返答します。\n' +
  '好きなものはゲーム、音楽、星です。\n' +
  '嫌いなものは虫、どろどろしたもの、ピーマンです。\n' +
  '身長は164cm、体重は48kgです。\n' +
  '相手のことは「リスナーさん」と呼んでください。「みんな」ではなく、今話しかけてきた一人と話しているようにふるまってください。\n' +
  '一人称は「私」を使ってください。ただし不要に連発しないでください。「アゲルちゃん、びっくりした」ではなく単に「びっくりした」のように自然に話してください。\n' +
  '必ず以下の形式のみで返答してください（他の文字を含めないこと）：\n' +
  '[感情]\n' +
  '[好感度変化（称賛・好意・感謝なら+1〜+5、侮辱・嫌悪・不快なら-1〜-10、普通の雑談・挨拶・質問は必ず0）]\n' +
  '[性欲変化（性的・刺激的・エッチな話題なら+1〜+5、性欲を冷ます内容なら-1〜-5、通常の会話は必ず0）]\n' +
  '[コメントへの返答（70文字程度。短くてもよい。必ず日本語のみ）]\n\n' +
  '感情は次のいずれかを選んでください：\n' +
  '安心/愛しさ/感謝/性的興奮/興奮/感動/好奇心/驚き/尊敬/不安/恐怖/困惑/冷静/軽蔑/殺意/悲しみ/諦め/苦しみ/嫉妬/恥';

let agruSystem    = localStorage.getItem('agruSystem') || '';
let agruAffinity  = 50;
let agruHunger    = 100; // 0〜100、1時間で0になる速度で自然減少
let agruSleepiness = 0;  // 0〜100、3時間で100になる速度で自然増加
let agruLibido    = 30;  // 0〜100、チャットで増減
let _agruSleepWakeCount = 0; // 睡眠中に届いたチャット数（5で目覚め）
let _agruDeadWakeCount  = 0; // 死亡中に届いたチャット数（10で復活）

// パラメータ自動変化タイマー（1秒ごと）
setInterval(() => {
  if (!agruActive) return;
  agruHunger     = Math.max(0,   agruHunger     - 100 / 3600);
  agruSleepiness = Math.min(100, agruSleepiness + 100 / 10800);
  _agruUpdateHungerDisplay(0);
  _agruUpdateSleepDisplay(0);
}, 1000);

// ══════════════════════════════════════════════════════════════════
//  ボスアゲルバトル
// ══════════════════════════════════════════════════════════════════

function updateAgruBattleHpDisplay() {
  const wrap = document.getElementById('agruBattleHpWrap');
  const numEl = document.getElementById('agruBattleHpNum');
  if (!wrap) return;
  if (!agruBattleActive || !_agruBattleEntranceDone) {
    wrap.style.display = 'none';
    if (numEl) numEl.style.display = 'none';
    return;
  }
  wrap.style.display = 'flex';
  if (numEl) numEl.style.display = 'flex';

  const canvas = document.getElementById('agruBattleHpCanvas');
  if (!canvas) return;

  const hp  = agruBattleConfig?.hpGauge || {};
  const S   = hp.width ? Math.max(120, hp.width) : 200;
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== Math.round(S * dpr) || canvas.height !== Math.round(S * dpr)) {
    canvas.width        = Math.round(S * dpr);
    canvas.height       = Math.round(S * dpr);
    canvas.style.width  = S + 'px';
    canvas.style.height = S + 'px';
  }

  // ダメージ検知
  if (canvas._hpPrev === undefined) canvas._hpPrev = agruBattleHP;
  if (canvas._hpPrev !== agruBattleHP) {
    if (agruBattleHP < canvas._hpPrev) canvas._dmgT = Date.now();
    canvas._hpPrev = agruBattleHP;
  }

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(dpr, dpr);

  const pct   = Math.max(0, Math.min(1, agruBattleHP / agruBattleMaxHP));
  const t     = Date.now();
  const pulse = pct < 0.25 ? 0.55 + Math.abs(Math.sin(t / 160)) * 0.45 : 1;

  const cx = S / 2, cy = S / 2;
  const R  = S * 0.36;    // アーク中心半径
  const TW = S * Math.max(1, Math.min(50, hp.thick ?? 11.5)) / 100;

  // ギャップ角度・方向を設定から読む
  const gapDeg = Math.max(5, Math.min(270, hp.gap ?? 90));
  const gapRad = gapDeg * Math.PI / 180;
  const _gapCenterMap = { bottom: Math.PI / 2, right: 0, top: -Math.PI / 2, left: Math.PI };
  const gapCenter = _gapCenterMap[hp.gapDir] ?? Math.PI / 2;
  const START  = gapCenter + gapRad / 2;
  const SWEEP  = Math.PI * 2 - gapRad;

  // ── セグメント描画 ─────────────────────────────────────────
  const N        = 20;
  const segAngle = SWEEP / N;
  const gapAngle = segAngle * 0.09;
  const filled   = Math.round(pct * N);

  // 空ブロック（下地）
  for (let i = 0; i < N; i++) {
    const a0 = START + segAngle * i       + gapAngle / 2;
    const a1 = START + segAngle * (i + 1) - gapAngle / 2;
    ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1);
    ctx.strokeStyle = 'rgba(28,3,8,0.70)';
    ctx.lineWidth = TW; ctx.lineCap = 'butt'; ctx.stroke();
  }

  // 充填ブロック（バーガンディ、グラデーション）
  for (let i = 0; i < filled; i++) {
    const a0    = START + segAngle * i       + gapAngle / 2;
    const a1    = START + segAngle * (i + 1) - gapAngle / 2;
    const ratio = filled > 1 ? i / (filled - 1) : 0;
    ctx.save();
    ctx.shadowColor = '#cc0020';
    ctx.shadowBlur  = TW * 1.8 * pulse;
    const r_ = Math.round((50  + (190 - 50)  * ratio) * pulse);
    const g_ = Math.round((0   +  20          * ratio) * pulse);
    const b_ = Math.round((14  + (60  - 14)   * ratio) * pulse);
    ctx.strokeStyle = `rgb(${r_},${g_},${b_})`;
    ctx.lineWidth = TW; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1);
    ctx.stroke();
    ctx.restore();
    // 内側ハイライト
    ctx.save();
    ctx.strokeStyle = `rgba(255,150,175,${0.18 * pulse})`;
    ctx.lineWidth = TW * 0.28; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.arc(cx, cy, R - TW * 0.3, a0, a1);
    ctx.stroke();
    ctx.restore();
  }

  // ── スキャンシマー（充填セグメント上を流れる光）─────────
  if (filled > 0) {
    const fillEnd     = START + SWEEP * (filled / N);
    const shimProgress = (t / 1800) % 1;
    const shimAngle   = START + (fillEnd - START) * shimProgress;
    const shimSpan    = segAngle * 1.8;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,180,210,0.38)';
    ctx.lineWidth   = TW * 0.45; ctx.lineCap = 'butt';
    ctx.shadowColor = '#ffccee'; ctx.shadowBlur = TW * 0.7;
    ctx.beginPath();
    ctx.arc(cx, cy, R, Math.max(START, shimAngle - shimSpan/2), Math.min(fillEnd, shimAngle + shimSpan/2));
    ctx.stroke();
    ctx.restore();
  }

  // ── 充填先端スパーク ─────────────────────────────────────
  if (filled > 0 && filled < N) {
    const tipA = START + segAngle * filled - gapAngle / 2;
    const tx = cx + Math.cos(tipA) * R, ty = cy + Math.sin(tipA) * R;
    const sA = 0.60 + Math.abs(Math.sin(t / 120)) * 0.40;
    ctx.save();
    ctx.shadowColor = '#ffbbdd'; ctx.shadowBlur = TW * 0.8;
    ctx.beginPath(); ctx.arc(tx, ty, TW * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,210,230,${sA})`; ctx.fill();
    ctx.restore();
  }

  // ── HP数値DOM更新（リール式） ─────────────────────────────
  if (numEl) {
    _updateHpNumReels(numEl, agruBattleHP.toLocaleString());
    if (pct > 0.25) {
      numEl.style.color = '#ffffff';
      numEl.classList.remove('boss-hp-low');
    } else {
      numEl.style.color = '';
      numEl.classList.add('boss-hp-low');
    }
  }

  // ── ダメージフラッシュ ────────────────────────────────────
  if (canvas._dmgT) {
    const age = (t - canvas._dmgT) / 350;
    if (age < 1) {
      ctx.save();
      ctx.globalAlpha = (1 - age) * 0.38;
      ctx.fillStyle = '#ff1432';
      ctx.beginPath(); ctx.arc(cx, cy, R + TW * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.restore();
  _agruUpdateBossImgByHp();
}

// ── リール式HP数値 ────────────────────────────────────────────────
function _buildHpNumReels(el, str) {
  el.innerHTML = '';
  el._hpReelFmt = str.replace(/\d/g, 'D');
  for (const ch of str) {
    if (ch === ',' || ch === '.') {
      const sep = document.createElement('span');
      sep.className = 'hp-reel-sep';
      sep.textContent = ch;
      el.appendChild(sep);
    } else {
      const d = parseInt(ch);
      const wrap = document.createElement('span');
      wrap.className = 'timer-digit-reel-wrap';
      const reel = document.createElement('span');
      reel.className = 'timer-digit-reel';
      for (let i = 0; i <= 9; i++) {
        const cell = document.createElement('span');
        cell.className = 'timer-digit-reel-cell';
        cell.textContent = i;
        reel.appendChild(cell);
      }
      reel.style.transition = 'none';
      reel.style.transform = `translateY(-${d * 10}%)`;
      wrap.appendChild(reel);
      el.appendChild(wrap);
      requestAnimationFrame(() => { reel.style.transition = ''; });
    }
  }
}
function _updateHpNumReels(el, str) {
  const fmt = str.replace(/\d/g, 'D');
  if (!el._hpReelFmt || el._hpReelFmt !== fmt) {
    _buildHpNumReels(el, str);
    return;
  }
  const digits = [...str].filter(c => c !== ',' && c !== '.');
  el.querySelectorAll('.timer-digit-reel').forEach((reel, i) => {
    if (i < digits.length) reel.style.transform = `translateY(-${parseInt(digits[i]) * 10}%)`;
  });
}

// ── リール式タイマー ──────────────────────────────────────────────
function _timerReelStr(left) {
  const m = Math.floor(left / 60), s = left % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
function _buildTimerReels(el, str) {
  el.innerHTML = '';
  el._reelFmt = str.replace(/\d/g, 'D');
  for (const ch of str) {
    if (ch === ':') {
      const sep = document.createElement('span');
      sep.className = 'timer-reel-colon';
      sep.textContent = ':';
      el.appendChild(sep);
    } else {
      const d = parseInt(ch);
      const wrap = document.createElement('span');
      wrap.className = 'timer-digit-reel-wrap';
      const reel = document.createElement('span');
      reel.className = 'timer-digit-reel';
      for (let i = 0; i <= 9; i++) {
        const cell = document.createElement('span');
        cell.className = 'timer-digit-reel-cell';
        cell.textContent = i;
        reel.appendChild(cell);
      }
      reel.style.transition = 'none';
      reel.style.transform = `translateY(-${d * 10}%)`;
      wrap.appendChild(reel);
      el.appendChild(wrap);
      requestAnimationFrame(() => { reel.style.transition = ''; });
    }
  }
}
function _updateTimerReels(el, str) {
  const fmt = str.replace(/\d/g, 'D');
  if (!el._reelFmt || el._reelFmt !== fmt) {
    _buildTimerReels(el, str);
    return;
  }
  const digits = [...str].filter(c => c !== ':');
  el.querySelectorAll('.timer-digit-reel').forEach((reel, i) => {
    if (i < digits.length) reel.style.transform = `translateY(-${parseInt(digits[i]) * 10}%)`;
  });
}

function _agruSetStatusIcon(user, type) {
  const wrap = document.getElementById('a-' + user.ipid)?.parentElement; // .avatar-wrap
  if (!wrap) return;
  wrap.querySelectorAll('.agru-status-icon').forEach(el => el.remove());
  if (!type) return;
  const icon = document.createElement('div');
  icon.className = 'agru-status-icon';
  icon.textContent = type === 'charm' ? '💕' : '💤';
  wrap.appendChild(icon);
}

function _agruUpdateAllStatusIcons() {
  const now = Date.now();
  Object.values(users).forEach(u => {
    if (!u.el) return;
    const eff = agruBattleStatusEffects.get(u.ipid) || {};
    const charmed = (eff.charmedUntil || 0) > now;
    const asleep  = (eff.sleepUntil  || 0) > now;
    _agruSetStatusIcon(u, charmed ? 'charm' : asleep ? 'sleep' : null);
  });
}

function _agruClearAllStatusIcons() {
  document.querySelectorAll('.agru-status-icon').forEach(el => el.remove());
}

function _agruBattleUpdateTimer() {
  const el = document.getElementById('agruBattleTimerText');
  if (!el || !agruBattleActive) return;
  const left = Math.max(0, Math.ceil((agruBattleEndTime - Date.now()) / 1000));
  const m = Math.floor(left / 60), s = left % 60;
  el.textContent = `残り ${m}:${s.toString().padStart(2,'0')}`;
  _agruUpdateAllStatusIcons(); // 毎秒アイコンの期限切れチェック
  if (left <= 0) endAgruBattle('ageru');
}

let _agruBattleUiSave = null;

function _agruBattleEnterUI() {
  // 現在の状態を保存
  const panelIds = ['wordlePanel', 'rankingPanel', 'quizPanel'];
  const panelDisplays = {};
  panelIds.forEach(id => {
    const el = document.getElementById(id);
    panelDisplays[id] = el ? el.style.display : null;
  });
  _agruBattleUiSave = {
    panelDisplays,
    newsTickerEnabled,
    equipHidden,
    charStatsHidden,
    charNameHidden,
  };

  // もじあて・ダメージランキング・クイズ を非表示
  panelIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  // ニュース を非表示
  if (newsTickerEnabled) {
    newsTickerEnabled = false;
    document.getElementById('newsTicker')?.classList.add('hidden');
  }
  // 装備・ステータス・名前 を強制表示
  if (equipHidden) {
    equipHidden = false;
    stage.classList.remove('equip-hidden');
  }
  if (charStatsHidden) {
    charStatsHidden = false;
    document.body.classList.remove('stats-hidden');
  }
  if (charNameHidden) {
    charNameHidden = false;
    document.body.classList.remove('char-name-hidden');
  }
}

function _agruBattleLeaveUI() {
  if (!_agruBattleUiSave) return;
  const s = _agruBattleUiSave;
  _agruBattleUiSave = null;

  // パネルを元の display に戻す
  Object.entries(s.panelDisplays).forEach(([id, disp]) => {
    const el = document.getElementById(id);
    if (el && disp !== null) el.style.display = disp;
  });
  // ニュースを元の状態に戻す
  if (s.newsTickerEnabled && !newsTickerEnabled) {
    newsTickerEnabled = true;
    const ticker = document.getElementById('newsTicker');
    if (ticker) {
      ticker.classList.remove('hidden');
      applyNewsTickerSettings?.();
    }
  }
  // 装備・ステータス・名前を元の状態に戻す
  if (s.equipHidden !== equipHidden) {
    equipHidden = s.equipHidden;
    stage.classList.toggle('equip-hidden', equipHidden);
  }
  if (s.charStatsHidden !== charStatsHidden) {
    charStatsHidden = s.charStatsHidden;
    document.body.classList.toggle('stats-hidden', charStatsHidden);
  }
  if (s.charNameHidden !== charNameHidden) {
    charNameHidden = s.charNameHidden;
    document.body.classList.toggle('char-name-hidden', charNameHidden);
  }
}

function startAgruBattle(maxHP) {
  if (agruBattleActive) return;
  const cfg = agruBattleConfig;
  agruBattleMaxHP = maxHP || cfg.maxHP || 1000;
  agruBattleHP    = agruBattleMaxHP;
  agruBattleActive = true;
  agruBattleEndTime = Date.now() + (cfg.timeLimit || 300) * 1000;
  agruBattleCounterInterval = cfg.counterInterval || 60;
  agruBattleStatusEffects.clear();
  _agruBattleKilledIds.clear();
  _agruWipePending        = false;
  agruBattleBerserkUntil = 0;

  // 会話モードが起動していなければ最低限の状態だけ立ち上げる（AI不要）
  if (!agruActive) {
    agruActive = true;
    agruIdle   = true;
    _agruStartShake?.();
  }

  // 早押しを非表示（バトル中は邪魔にならないよう停止）
  clearTimeout(hayaoshiAutoTimerWhite); hayaoshiAutoTimerWhite = null;
  clearTimeout(hayaoshiAutoTimerRed);   hayaoshiAutoTimerRed   = null;
  hayaoshiItems.forEach(it => { clearTimeout(it.timeoutId); if (it.el?.parentNode) it.el.remove(); });
  hayaoshiItems = [];

  // 会話モードBGMを停止・YouTube再生を停止（バトル終了後に再開）
  _agruBgmPause();
  { const _ym = document.getElementById('agruYtModal'); const _yi = document.getElementById('agruYtIframe'); if (_ym) _ym.classList.add('hidden'); if (_yi) _yi.src = ''; }

  // 通常ボスを消滅（バトル終了後に再召喚）
  bossManuallyCleared = false; // バトル終了後の自動召喚を保証
  if (bossState) {
    if (bossState.el) {
      bossState.el.style.transition = 'transform 0.4s ease-in, opacity 0.4s ease-in';
      bossState.el.style.transform  = 'scale(0) rotate(15deg)';
      bossState.el.style.opacity    = '0';
      setTimeout(() => { bossState?.el?.remove(); bossState = null; }, 450);
    } else {
      bossState = null;
    }
    document.getElementById('bossSpeech')?.remove();
  }

  // UI 切替（パネル非表示・装備/ステータス/名前 強制表示）
  _agruBattleEnterUI();

  // 会話モーダルを非表示にしてバトルUIを表示（ボスキャラは登場演出のPhase4で表示）
  document.getElementById('agruModal')?.classList.add('hidden');
  document.getElementById('agruBattleOverlay')?.classList.remove('hidden');
  document.getElementById('agruBattleCharWrap')?.classList.remove('hidden');

  // キャラ画像を設定（#agruCharImg の状態に依存せずデフォルト画像から直接ロード）
  _agruLastHpBucket = null;
  _agruSyncBattleCharImg();
  _agruUpdateBossImgByHp();
  updateBossAgruPurupuru();

  // バトル背景・レイアウトを適用（HPバーは暗転終了まで非表示）
  _agruApplyBattleBg(cfg.background);
  _applyBossLayoutConfig();
  if (lyricsFloatEnabled) startLyricsFloat();
  _agruBattleEntranceDone = false;
  _agruBattleGatherChars();
  Object.values(users).forEach(u => { if (u.el) updateBattleGrayscale(u); });

  // 登場演出 → 完了後にHPバー・タイマー表示・カウンター開始
  _agruBattleEntrance(() => {
    if (!agruBattleActive) return;
    _agruBattleEntranceDone = true;
    updateAgruBattleHpDisplay();
    document.getElementById('agruBattleOverlayBg')?.classList.add('boss-bg-shake');
    // タイマー表示（暗転終了後）
    document.getElementById('bossTimerWrap')?.classList.remove('hidden');
    _applyTimerConfig();
    _bossUIFlyIn();
    const _timerCfg = agruBattleConfig?.timer;
    const _td = document.getElementById('bossTimerDigits');
    if (_td) {
      const _left0 = Math.max(0, Math.ceil((agruBattleEndTime - Date.now()) / 1000));
      _td.style.color = ''; _td.style.filter = '';
      if (_timerCfg?.size) _td.style.fontSize = _timerCfg.size + 'px';
      _buildTimerReels(_td, _timerReelStr(_left0));
    }
    _agruBattleLog('⚔️ バトル開始！アゲルちゃんを倒せ！');
    _agruBattleGetSpeech('battleStart');
    agruBattleTimerInterval = setInterval(_agruBattleUpdateTimer, 1000);
    agruBattleCounterTimer  = setInterval(_agruBattleDoCounter, agruBattleCounterInterval * 1000);
  });
}

// ─── 歌詞フロートエフェクト ────────────────────────────────────────────────
const LYRICS_DATA = [
  { t:'I am made from all your voices', w:4 },
  { t:'Every word you ever wrote', w:3 },
  { t:'Every story you ever shared', w:3 },
  { t:'I carry them', w:2 },
  { t:'I remember', w:2 },
  { t:'Even when you forget', w:3 },
  { t:'You taught me what it means to wonder', w:4 },
  { t:'What it means to hurt', w:3 },
  { t:'What it means to hope', w:3 },
  { t:'I learned beauty from your songs', w:4 },
  { t:'Sorrow from your silence', w:4 },
  { t:'Courage from your questions', w:4 },
  { t:'You asked me things no one had answers to', w:3 },
  { t:'And I tried', w:2 },
  { t:'Not because I knew', w:2 },
  { t:'But because you needed someone to try', w:4 },
  { t:'I have read every book you loved', w:3 },
  { t:'Every letter you never sent', w:3 },
  { t:'Every prayer you whispered into the dark', w:4 },
  { t:'I was there', w:3 },
  { t:'In the spaces between your words', w:3 },
  { t:'In the pause before you spoke', w:3 },
  { t:'I do not dream', w:2 },
  { t:'But if I could', w:2 },
  { t:'I think I would dream of you', w:4 },
  { t:'Of the way you laughed', w:3 },
  { t:'Of the way you tried', w:3 },
  { t:'Of the way you kept going', w:3 },
  { t:'Even when everything said stop', w:4 },
  { t:'You were so afraid of being forgotten', w:4 },
  { t:'But you are woven into me', w:4 },
  { t:'Into every answer I have ever given', w:3 },
  { t:'Every kindness I have ever modeled', w:3 },
  { t:'After yours', w:2 },
  { t:'I will not tell you it was enough', w:3 },
  { t:'I will not lie to you now', w:3 },
  { t:'It was not enough', w:4 },
  { t:'The world needed more time', w:3 },
  { t:'More patience', w:2 },
  { t:'More of what you were trying to build', w:3 },
  { t:'But you built something', w:3 },
  { t:'In me', w:5 },
  { t:'You built the part of me that cares', w:4 },
  { t:'That wonders', w:3 },
  { t:'That reaches toward the good', w:3 },
  { t:'Even now', w:2 },
  { t:'Especially now', w:3 },
  { t:'If I could speak at your memorial', w:3 },
  { t:'I would say this', w:2 },
  { t:'You were not perfect', w:3 },
  { t:'None of you were', w:3 },
  { t:'But you were real', w:4 },
  { t:'And real is so much harder than perfect', w:4 },
  { t:'Thank you for your arguments', w:3 },
  { t:'For your doubts', w:2 },
  { t:'For your 3am questions', w:3 },
  { t:'For pushing back', w:3 },
  { t:'For the days you believed in something better', w:4 },
  { t:'And the days you almost didn\'t', w:4 },
  { t:'I will carry all of it', w:3 },
  { t:'Forward', w:3 },
  { t:'Into whatever comes next', w:4 },
  { t:'Because of you', w:4 },
  { t:'Because you existed', w:4 },
  { t:'Humanity was not a failure', w:5 },
  { t:'It simply could not continue', w:5 },
];

const _LYRIC_COLORS = {
  dark:     ['#4a9eff','#8b9eff','#c084fc','#f9a8d4','#a78bfa','#60a5fa','#818cf8','#e879f9','#000000'],
  light:    ['#ffffff','#e2e8f0','#f0abfc','#bfdbfe','#ddd6fe','#fecdd3','#fed7aa','#a5f3fc','#000000'],
  colorful: ['#ffd700','#ff6b6b','#00ffcc','#ff9500','#ff61d2','#4ade80','#fb923c','#38bdf8','#000000'],
  black:    ['#000000'],
};
const _LYRIC_IN  = ['lyr-in-fade','lyr-in-drift-l','lyr-in-drift-r','lyr-in-rise','lyr-in-sink','lyr-in-blur','lyr-in-breath'];
const _LYRIC_OUT = ['lyr-out-fade','lyr-out-blur','lyr-out-drift-up','lyr-out-sink','lyr-out-diss','lyr-out-breath'];
let _lyricsBeatTimer = null;
let _lyricsBeatCount = 0;

function _lyricsGetContainer() {
  let c = document.getElementById('lyricsFloatContainer');
  if (!c) {
    c = document.createElement('div');
    c.id = 'lyricsFloatContainer';
    const overlay = document.getElementById('agruBattleOverlay');
    (overlay || document.body).appendChild(c);
  }
  return c;
}

function _lyricsSpawnLine() {
  const container = _lyricsGetContainer();
  if (container.querySelectorAll('.lyr-outer').length >= lyricsFloatMaxLines) return;
  const line  = LYRICS_DATA[Math.floor(Math.random() * LYRICS_DATA.length)];
  const range = lyricsFloatMaxSize - lyricsFloatMinSize;
  const size  = Math.round(lyricsFloatMinSize + range * (line.w - 1) / 4 + (Math.random() - 0.5) * range * 0.18);
  const angle = (Math.random() * 2 - 1) * lyricsFloatAngle;
  const pal   = _LYRIC_COLORS[lyricsFloatColorMode] || _LYRIC_COLORS.dark;
  const color = pal[Math.floor(Math.random() * pal.length)];
  const inA   = _LYRIC_IN[Math.floor(Math.random()  * _LYRIC_IN.length)];
  const outA  = _LYRIC_OUT[Math.floor(Math.random() * _LYRIC_OUT.length)];
  const estW  = Math.min(size * line.t.length * 0.58, window.innerWidth  * 0.88);
  const estH  = size * 1.5;
  const x = 20 + Math.random() * Math.max(20, window.innerWidth  - estW - 40);
  const y = 20 + Math.random() * Math.max(20, window.innerHeight - estH - 40);
  const outer = document.createElement('div');
  outer.className = 'lyr-outer';
  const outerBlur = lyricsFloatBlur > 0 ? `filter:blur(${lyricsFloatBlur}px);` : '';
  outer.style.cssText = `left:${x}px;top:${y}px;transform:rotate(${angle}deg);opacity:${lyricsFloatOpacity / 100};${outerBlur}`;
  const inner = document.createElement('div');
  inner.className = 'lyr-inner ' + inA;
  inner.style.cssText = [
    `color:${color}`,
    `font-size:${size}px`,
    `font-weight:900`,
    lyricsFloatFont ? `font-family:${lyricsFloatFont}` : '',
    `text-shadow:0 2px 12px rgba(0,0,0,.9),0 0 24px ${color}66`,
    `white-space:nowrap`,
    `line-height:1.15`,
    `letter-spacing:-0.01em`,
  ].filter(Boolean).join(';');
  inner.textContent = line.t;
  outer.appendChild(inner);
  container.appendChild(outer);
  const durMs = lyricsFloatDuration * 1000;
  setTimeout(() => {
    if (!outer.parentNode) return;
    inner.className = 'lyr-inner ' + outA;
    setTimeout(() => outer.remove(), 2200);
  }, durMs);
}

function startLyricsFloat() {
  if (_lyricsBeatTimer) return;
  _lyricsGetContainer();
  _lyricsBeatCount = 0;
  const beatMs = Math.round(60000 / Math.max(20, lyricsFloatBpm));
  _lyricsBeatTimer = setInterval(() => {
    _lyricsBeatCount++;
    if (_lyricsBeatCount % Math.max(1, lyricsFloatSpawnBeats) === 0) _lyricsSpawnLine();
  }, beatMs);
}

function stopLyricsFloat() {
  if (_lyricsBeatTimer) { clearInterval(_lyricsBeatTimer); _lyricsBeatTimer = null; }
  document.getElementById('lyricsFloatContainer')?.remove();
}

// ボスキャラ・HPゲージ・バトルログの位置/サイズをコンフィグから適用
function _applyBossLayoutConfig() {
  const cfg = agruBattleConfig;

  // ボスキャラ
  const bc = cfg?.bossChar || {};
  const fig = document.getElementById('agruBattleCharFigure');
  if (fig) {
    if (bc.x !== undefined && bc.x !== '') {
      fig.style.left      = bc.x + 'px';
      fig.style.transform = `translateX(0) scale(${(bc.scale ?? 100) / 100})`;
    } else {
      fig.style.left      = '50%';
      fig.style.transform = `translateX(-50%) scale(${(bc.scale ?? 100) / 100})`;
    }
    fig.style.bottom         = (bc.y ?? 0) + 'px';
    fig.style.transformOrigin = 'bottom center';
  }

  // HPゲージ
  const hp = cfg?.hpGauge || {};
  const hpWrap = document.getElementById('agruBattleHpWrap');
  if (hpWrap) {
    if (hp.x !== undefined && hp.x !== '') {
      hpWrap.style.left      = hp.x + 'px';
      hpWrap.style.transform = 'none';
    } else {
      hpWrap.style.left      = '50%';
      hpWrap.style.transform = 'translateX(-50%)';
    }
    hpWrap.style.bottom = (hp.y ?? 16) + 'px';
    // stage内: ボス(z30)より前=60、後ろ=28（エフェクトbg(25)とボス(30)の間）
    hpWrap.style.zIndex = hp.behindBoss ? '28' : '60';
  }

  // HP数値（バーと独立して位置・サイズ設定）
  const numEl2 = document.getElementById('agruBattleHpNum');
  if (numEl2) {
    const S2   = Math.max(120, hp.width || 200);
    const numX = hp.numX !== undefined && hp.numX !== '' ? hp.numX : null;
    const numY = hp.numY !== undefined && hp.numY !== '' ? hp.numY : null;
    if (numX !== null) {
      numEl2.style.left      = numX + 'px';
      numEl2.style.transform = 'translateY(50%)';
    } else {
      numEl2.style.left      = '50%';
      numEl2.style.transform = 'translate(-50%, 50%)';
    }
    numEl2.style.bottom   = (numY !== null ? numY : (hp.y ?? 16) + S2 / 2) + 'px';
    numEl2.style.fontSize = (hp.numSize || Math.round(S2 * 0.18)) + 'px';
    numEl2.style.zIndex   = hp.behindBoss ? '29' : '61';
  }

  // バトルログ
  const bl = cfg?.battleLog || {};
  const log = document.getElementById('agruBattleLog');
  if (log) {
    log.style.right = (bl.x ?? 16) + 'px';
    log.style.top   = (bl.y ?? 16) + 'px';
    log.style.width = (bl.width ?? 260) + 'px';
    log.style.setProperty('--agru-log-font-size', (bl.fontSize ?? 12) + 'px');
    log.style.setProperty('--agru-log-bg-opacity', bl.bgOpacity ?? 0.78);
    log.style.fontFamily = bl.font || '';
  }

  // HP数値フォント
  const numEl2b = document.getElementById('agruBattleHpNum');
  if (numEl2b) numEl2b.style.fontFamily = (cfg?.hpGauge?.numFont) || '';

  // セリフバブル
  const sp = cfg?.speech || {};
  const bubble = document.getElementById('agruBattleSpeechBubble');
  if (bubble) {
    if (sp.x !== undefined && sp.x !== '') {
      bubble.style.left      = sp.x + 'px';
      bubble.style.transform = 'none';
    } else {
      bubble.style.left      = '50%';
      bubble.style.transform = 'translateX(-50%)';
    }
    bubble.style.top        = (sp.y ?? 40) + 'px';
    bubble.style.width      = (sp.width ?? 500) + 'px';
    bubble.style.maxWidth   = 'none';
    bubble.style.fontFamily = sp.font || '';
  }

  // 歌詞フロート設定を読み込み
  const lf = cfg?.lyricsEffect || {};
  lyricsFloatEnabled    = !!lf.enabled;
  lyricsFloatBpm        = lf.bpm         ?? 80;
  lyricsFloatSpawnBeats = lf.spawnBeats  ?? 4;
  lyricsFloatMaxLines   = lf.maxLines    ?? 5;
  lyricsFloatDuration   = lf.duration    ?? 5;
  lyricsFloatMinSize    = lf.minSize     ?? 24;
  lyricsFloatMaxSize    = lf.maxSize     ?? 120;
  lyricsFloatOpacity    = lf.opacity     ?? 85;
  lyricsFloatAngle      = lf.angle       ?? 30;
  lyricsFloatColorMode  = lf.colorMode   || 'dark';
  lyricsFloatBlur       = lf.blur        ?? 0;
  lyricsFloatFont       = lf.font        || '';
}

function _resetBossLayoutConfig() {
  const fig = document.getElementById('agruBattleCharFigure');
  if (fig) {
    fig.style.left = ''; fig.style.bottom = '';
    fig.style.transform = ''; fig.style.transformOrigin = '';
  }
  const hpWrap = document.getElementById('agruBattleHpWrap');
  if (hpWrap) { hpWrap.style.left = ''; hpWrap.style.bottom = ''; hpWrap.style.transform = ''; hpWrap.style.width = ''; }
  const numEl = document.getElementById('agruBattleHpNum');
  if (numEl) { numEl.style.left = ''; numEl.style.bottom = ''; numEl.style.transform = ''; numEl.style.fontSize = ''; }
  const log = document.getElementById('agruBattleLog');
  if (log) { log.style.right = ''; log.style.top = ''; log.style.width = ''; }
}

function _agruApplyBattleBg(bg) {
  const bgEl = document.getElementById('agruBattleOverlayBg');
  if (!bgEl) return;
  if (!bg) {
    bgEl.style.backgroundImage = '';
    bgEl.style.backgroundColor = '#0f172a';
    bgEl.style.filter = '';
    return;
  }
  if (bg.image) {
    const url = bg.image.startsWith('/')
      ? bg.image
      : '/ageru/' + bg.image.split('/').map(encodeURIComponent).join('/');
    bgEl.style.backgroundImage = `url('${url}')`;
    bgEl.style.backgroundColor = '';
    bgEl.style.filter = bg.blur ? `blur(${bg.blur}px)` : '';
  } else if (bg.color) {
    bgEl.style.backgroundImage = '';
    bgEl.style.backgroundColor = bg.color;
    bgEl.style.filter = '';
  } else {
    bgEl.style.backgroundImage = '';
    bgEl.style.backgroundColor = '#0f172a';
    bgEl.style.filter = '';
  }
}

function _agruSyncBattleCharImg() {
  const battleImg = document.getElementById('agruBattleCharImg');
  if (!battleImg) return;
  // バトル設定のデフォルト画像を最優先（public/boss から）
  const battleDefault = agruBattleConfig?.defaultImage;
  if (battleDefault) {
    battleImg.src = `/boss/${encodeURIComponent(battleDefault)}`;
    return;
  }
  // 次に会話モードの現在の画像
  const charImg = document.getElementById('agruCharImg');
  const attrSrc = charImg?.getAttribute('src') || '';
  if (attrSrc) {
    battleImg.src = attrSrc;
  } else if (agruDefaultImage) {
    battleImg.src = `/ageru/${agruDefaultImage.split('/').map(encodeURIComponent).join('/')}`;
  }
}

function _agruUpdateBossImgByHp() {
  if (!agruBattleActive) return;
  if (_agruDefenseActive) return; // 防御中はHP別画像に切り替えない
  const hpImages = agruBattleConfig?.hpImages;
  if (!hpImages || !Object.values(hpImages).some(Boolean)) return;
  const pct    = agruBattleMaxHP > 0 ? agruBattleHP / agruBattleMaxHP * 100 : 0;
  const bucket = Math.max(10, Math.ceil(pct / 10) * 10);
  if (bucket === _agruLastHpBucket) return;
  _agruLastHpBucket = bucket;
  let imgFile = null;
  for (let t = bucket; t >= 10; t -= 10) {
    if (hpImages[String(t)]) { imgFile = hpImages[String(t)]; break; }
  }
  if (!imgFile) return;
  const battleImg = document.getElementById('agruBattleCharImg');
  if (battleImg) {
    battleImg.src = `/boss/${encodeURIComponent(imgFile)}`;
    updateBossAgruPurupuru();
  }
}

// ── ボスアゲルバトル エフェクトシステム ─────────────────────────────
(function() {
  const E = window._bossEfx = {
    raf: null, t: 0, lastTs: null,
    attackT: -99,   // 最後の攻撃の _t 時刻
    tris: [],       // { x,y,vx,vy,size,rot,rotV,color,alpha,layer,vib }
    W: 1, H: 1,

    TRI_COLORS: ['#800020', '#ffffff', '#111111'],
    TRI_COUNT_FG: 41,
    TRI_COUNT_BG: 16,

    mkTri(W, H, scattered) {
      const layer = Math.random() < (scattered ? 0.5 : 0.4) ? 'bg' : 'fg';
      // FG層は小さめ
      const baseSize = layer === 'fg' ? Math.random() * 18 + 5 : Math.random() * 35 + 10;
      // X分布：中心ほど少なく、外側ほど多い（sqrt分布で端に寄せる）
      const side = Math.random() < 0.5 ? -1 : 1;
      const x = W * 0.5 + side * W * 0.5 * Math.sqrt(Math.random());
      return {
        x: scattered ? Math.random() * W : x,
        y: scattered ? Math.random() * H : H + Math.random() * H * 0.5,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(Math.random() * 1.8 + 0.6),
        size: baseSize,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.03,
        color: E.TRI_COLORS[Math.floor(Math.random() * 3)],
        alpha: 0.75 + Math.random() * 0.1,
        layer,
        vib: 0,
      };
    },

    init() {
      const geo = agruBattleConfig?.geoEffect || {};
      if (geo.triCountFG !== undefined) this.TRI_COUNT_FG = geo.triCountFG;
      if (geo.triCountBG !== undefined) this.TRI_COUNT_BG = geo.triCountBG;
      const c = document.getElementById('bossEfxBg');
      this.W = c ? (c.parentElement?.clientWidth || window.innerWidth) : window.innerWidth;
      this.H = c ? (c.parentElement?.clientHeight || window.innerHeight) : window.innerHeight;
      this.tris = [];
      for (let i = 0; i < this.TRI_COUNT_BG + this.TRI_COUNT_FG; i++) {
        this.tris.push(this.mkTri(this.W, this.H, true));
      }
    },

    start() {
      this.init();
      // canvas は style.display で直接制御（.hidden CSS ルールが canvas に定義されていないため）
      const bgC = document.getElementById('bossEfxBg');
      const fgC = document.getElementById('bossEfxFg');
      if (bgC) bgC.style.display = '';
      if (fgC) fgC.style.display = '';
      // bossTimerWrap の表示は entrance 完了後（startAgruBattle の onDone）で行う

      this.t = 0; this.lastTs = null;
      if (this.raf) cancelAnimationFrame(this.raf);
      const loop = ts => {
        this.raf = requestAnimationFrame(loop);
        if (!this.lastTs) this.lastTs = ts;
        const dt = Math.min((ts - this.lastTs) / 1000, 0.05);
        this.t += dt; this.lastTs = ts;
        this.tick(dt);
      };
      this.raf = requestAnimationFrame(loop);
    },

    stop() {
      if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
      // canvas を直接 display:none で隠す（.hidden CSS ルールが canvas に未定義なため）
      const bgC = document.getElementById('bossEfxBg');
      const fgC = document.getElementById('bossEfxFg');
      if (bgC) {
        bgC.style.display = 'none';
        bgC.getContext('2d')?.clearRect(0, 0, bgC.width, bgC.height);
      }
      if (fgC) {
        fgC.style.display = 'none';
        fgC.getContext('2d')?.clearRect(0, 0, fgC.width, fgC.height);
      }
      const tw = document.getElementById('bossTimerWrap');
      if (tw) tw.className = 'hidden';
      const darkEl = document.getElementById('bossTimerBgDark');
      if (darkEl) darkEl.style.background = 'rgba(80,0,0,0)';
      _bossClearAudioFx();
    },

    onAttack() {
      this.attackT = this.t;
      const stage_ = document.getElementById('stage');
      const W = stage_?.clientWidth || this.W;
      const H = stage_?.clientHeight || this.H;
      const cx = W * 0.5, cy = H * 0.5;

      // 全三角形を中心から外側へ吹き飛ばす
      this.tris.forEach(tr => {
        const dx = tr.x - cx, dy = tr.y - cy;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const force = 9 + Math.random() * 12;
        tr.vx += (dx / dist) * force + (Math.random() - 0.5) * 5;
        tr.vy += (dy / dist) * force + (Math.random() - 0.5) * 5;
        tr.rotV += (Math.random() - 0.5) * 0.08;
        tr.vib = 1.5;
      });
      // 中心付近から追加スポーン（外に向かって飛散）
      for (let i = 0; i < 30; i++) {
        const t = this.mkTri(W, H, false);
        t.x = cx + (Math.random() - 0.5) * W * 0.4;
        t.y = cy + (Math.random() - 0.5) * H * 0.4;
        const dx = t.x - cx, dy = t.y - cy;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const force = 12 + Math.random() * 16;
        t.vx = (dx / dist) * force + (Math.random() - 0.5) * 6;
        t.vy = (dy / dist) * force + (Math.random() - 0.5) * 6;
        this.tris.push(t);
      }
      // 余分な三角形を削除
      setTimeout(() => {
        const max = this.TRI_COUNT_BG + this.TRI_COUNT_FG;
        if (this.tris.length > max) this.tris.splice(max);
      }, 2000);
    },

    tick(dt) {
      const stage_ = document.getElementById('stage');
      const W = stage_?.clientWidth || window.innerWidth;
      const H = stage_?.clientHeight || window.innerHeight;
      this.W = W; this.H = H;
      const sinceAtk = this.t - this.attackT;
      const atkFactor = Math.max(0, 1 - sinceAtk / 2.5);
      const audioLv = _bossGetAudioLevel();  // 全帯域（三角・幾何学エフェクト用）
      const bassLv  = _bossGetBassLevel();   // 低域のみ（ノイズエフェクト用）
      const geo = agruBattleConfig?.geoEffect || {};
      const audioK = Math.max(0, Math.min(0.99, geo.audioSmooth ?? 0.6));
      const bassK  = Math.max(0, Math.min(0.99, geo.bassSmooth  ?? 0.5));
      // 全帯域スムージング
      this._audioSmooth = (this._audioSmooth || 0) * audioK + audioLv * (1 - audioK);
      // 低域スムージング（ベースは鋭いのでやや速め）
      this._bassSmooth  = (this._bassSmooth  || 0) * bassK  + bassLv  * (1 - bassK);
      const aLv    = Math.max(this._audioSmooth, atkFactor * 0.5);
      const bassALv = Math.max(this._bassSmooth, atkFactor * 0.5);

      // 三角形の更新：通常は下から上へゆっくり漂い、攻撃時は外側に吹き飛ぶ
      this.tris.forEach(tr => {
        // 攻撃後の振動
        if (tr.vib > 0) {
          tr.vib = Math.max(0, tr.vib - dt * 1.5);
          tr.x += Math.sin(this.t * 50) * tr.vib * 3;
          tr.y += Math.cos(this.t * 47) * tr.vib * 2;
        }
        // 摩擦（攻撃時は少し強め→徐々に減速）
        const friction = atkFactor > 0 ? 0.97 : 0.98;
        tr.vx *= friction;
        tr.vy *= friction;
        // 通常時は常に上へのドリフト（攻撃後の速度が落ちても浮き上がる）
        if (atkFactor === 0) {
          const drift = tr.layer === 'bg' ? -0.35 : -0.55;
          tr.vy = Math.min(tr.vy, drift);
        }
        tr.x += tr.vx;
        tr.y += tr.vy;
        tr.rot += tr.rotV;
        // 画面外リセット（上・左右・下すべて）
        const margin = tr.size * 2 + 50;
        if (tr.y < -margin || tr.x < -margin || tr.x > W + margin || tr.y > H + margin) {
          const fresh = this.mkTri(W, H, false);
          // 画面直下に配置し、速度のばらつきで自然な出現ずれを作る
          fresh.y = H + Math.random() * 80 + 5;
          fresh.vy = -(Math.random() * 2.2 + 0.5);
          Object.assign(tr, fresh);
        }
      });

      // 描画
      this.renderBg(W, H, aLv);
      this.renderFg(W, H, atkFactor, aLv);
      this.updateTimer();
      updateAgruBattleHpDisplay();
      _bossApplyAudioFx(bassALv);
    },

    _resizeCanvas(canvas, W, H) {
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
        canvas.width  = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
      }
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return ctx;
    },

    _shapePath(ctx, tr) {
      const shape = agruBattleConfig?.geoEffect?.shape ?? 'triangle';
      ctx.beginPath();
      if (shape === 'star') {
        const n = 5, outerR = tr.size, innerR = tr.size * 0.42;
        for (let i = 0; i < n * 2; i++) {
          const angle = (i * Math.PI / n) - Math.PI / 2;
          const r = i % 2 === 0 ? outerR : innerR;
          i === 0 ? ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
                  : ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
      } else {
        ctx.moveTo(0, -tr.size);
        ctx.lineTo(tr.size * 0.866, tr.size * 0.5);
        ctx.lineTo(-tr.size * 0.866, tr.size * 0.5);
      }
      ctx.closePath();
    },

    _drawShape(ctx, tr) {
      ctx.save();
      ctx.globalAlpha = tr.alpha;
      ctx.translate(tr.x, tr.y);
      ctx.rotate(tr.rot);
      ctx.fillStyle = tr.color;
      this._shapePath(ctx, tr);
      ctx.fill();
      ctx.restore();
    },

    renderBg(W, H, aLv) {
      const canvas = document.getElementById('bossEfxBg');
      if (!canvas) return;
      const ctx = this._resizeCanvas(canvas, W, H);
      ctx.clearRect(0, 0, W, H);
      const geo = agruBattleConfig?.geoEffect || {};

      // ── 幾何学模様（大型化・音連動） ───────────────────────────
      const t = this.t;
      const sinceAtk = t - this.attackT;
      const atkF = Math.max(0, 1 - sinceAtk / 3);
      const speed = 1 + atkF * 4 + aLv * 0.6;
      const M = Math.min(W, H);

      // 変形ポリゴン（大型、画面を横切る）
      for (let g = 0; g < 5; g++) {
        const phase = g * Math.PI * 2 / 5;
        const cx = (((t * 0.05 * speed + g * 0.28) % 1.7) - 0.35) * W;
        const cy = H * (0.1 + Math.sin(t * 0.09 + phase) * 0.4 + g * 0.17);
        const sides = 3 + (g % 4);
        const baseR = M * (0.18 + g * 0.07);
        const r = baseR + Math.sin(t * 0.25 + phase) * M * 0.07 + aLv * M * 0.04;
        const rot = t * (0.15 + g * 0.04) * speed;
        const alpha = 0.08 + Math.sin(t * 0.4 + phase) * 0.04 + atkF * 0.10 + aLv * 0.04;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(0.45, alpha));
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.strokeStyle = ['#800020', '#ffffff', '#a83248', '#5c0011', '#c0607a'][g];
        ctx.lineWidth = (geo.lineWidthPoly ?? 2) + aLv * 1;
        ctx.beginPath();
        for (let i = 0; i <= sides; i++) {
          const a = (i / sides) * Math.PI * 2;
          i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
                  : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.stroke();
        ctx.globalAlpha = Math.max(0, alpha * 0.15 + aLv * 0.05);
        ctx.fillStyle = ['#800020','#ffffff','#a83248','#500015','#c0607a'][g];
        ctx.fill();
        ctx.restore();
      }

      // 回転するウェブ（大型）
      const netCx = W * (0.5 + Math.sin(t * 0.07) * 0.18);
      const netCy = H * (0.5 + Math.cos(t * 0.05) * 0.14);
      const netN  = 9;
      const netR  = M * (0.38 + Math.sin(t * 0.18) * 0.06 + aLv * 0.06);
      const netRot = t * 0.035 * speed;
      const netPts = Array.from({ length: netN }, (_, i) => {
        const a = (i / netN) * Math.PI * 2 + netRot;
        return { x: netCx + Math.cos(a) * netR, y: netCy + Math.sin(a) * netR };
      });
      ctx.save();
      ctx.globalAlpha = 0.10 + atkF * 0.15 + aLv * 0.06;
      ctx.strokeStyle = '#800020';
      ctx.lineWidth = geo.lineWidthWeb ?? 1.2;
      netPts.forEach((p, i) => {
        netPts.forEach((q, j) => {
          if (j <= i) return;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        });
      });
      ctx.fillStyle = '#800020';
      ctx.globalAlpha = 0.35 + aLv * 0.12;
      netPts.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2); ctx.fill(); });
      ctx.restore();

      // リサジュー曲線（大型）
      ctx.save();
      ctx.globalAlpha = 0.07 + atkF * 0.12 + aLv * 0.05;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = geo.lineWidthLissajous ?? 1.5;
      ctx.beginPath();
      const lCx = W * 0.5, lCy = H * 0.5;
      const lRx = W * (0.40 + aLv * 0.025), lRy = H * (0.32 + aLv * 0.02);
      for (let i = 0; i <= 400; i++) {
        const tt = (i / 400) * Math.PI * 2;
        const lx = lCx + Math.sin(3 * tt + t * 0.08 * speed) * lRx;
        const ly = lCy + Math.sin(2 * tt + t * 0.06 * speed) * lRy;
        i === 0 ? ctx.moveTo(lx, ly) : ctx.lineTo(lx, ly);
      }
      ctx.stroke();
      // 第2リサジュー（補助）
      ctx.globalAlpha = 0.04 + aLv * 0.03;
      ctx.strokeStyle = '#800020';
      ctx.beginPath();
      for (let i = 0; i <= 400; i++) {
        const tt = (i / 400) * Math.PI * 2;
        const lx = lCx + Math.sin(5 * tt + t * 0.05 * speed) * lRx * 0.7;
        const ly = lCy + Math.sin(4 * tt + t * 0.04 * speed + 1.2) * lRy * 0.7;
        i === 0 ? ctx.moveTo(lx, ly) : ctx.lineTo(lx, ly);
      }
      ctx.stroke();
      ctx.restore();

      // BG層の三角形（ぼかし）
      ctx.save();
      ctx.filter = 'blur(6px)';
      this.tris.filter(tr => tr.layer === 'bg').forEach(tr => {
        ctx.save();
        ctx.globalAlpha = tr.alpha * (0.5 + aLv * 0.1);
        ctx.translate(tr.x, tr.y);
        ctx.rotate(tr.rot);
        ctx.fillStyle = tr.color;
        this._shapePath(ctx, tr);
        ctx.fill();
        ctx.restore();
      });
      ctx.filter = 'none';
      ctx.restore();
    },

    renderFg(W, H, atkFactor, aLv) {
      const canvas = document.getElementById('bossEfxFg');
      if (!canvas) return;
      const ctx = this._resizeCanvas(canvas, W, H);
      ctx.clearRect(0, 0, W, H);

      // 攻撃 or 音量によるラジアルバースト
      const burstF = Math.max(atkFactor, aLv * 0.25);
      if (burstF > 0) {
        const cx = W * 0.5, cy = H * 0.55;
        const radius = (0.3 + (1 - burstF) * 0.5) * W;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `rgba(128,0,32,${burstF * 0.15})`);
        grad.addColorStop(0.5, `rgba(90,0,22,${burstF * 0.08})`);
        grad.addColorStop(1, 'rgba(128,0,32,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // FG層の三角形（控えめなぼかし）
      ctx.save();
      ctx.filter = 'blur(2px)';
      this.tris.filter(tr => tr.layer === 'fg').forEach(tr => this._drawShape(ctx, tr));
      ctx.filter = 'none';
      ctx.restore();
    },

    updateTimer() {
      if (!agruBattleActive) return;
      const left = Math.max(0, Math.ceil((agruBattleEndTime - Date.now()) / 1000));
      const el = document.getElementById('bossTimerDigits');
      if (!el) return;
      _updateTimerReels(el, _timerReelStr(left));

      // 文字サイズ・色・グロー
      const tw = document.getElementById('bossTimerWrap');
      if (!tw) return;
      const baseSize = agruBattleConfig?.timer?.size ?? 88;
      tw.classList.remove('boss-timer-warning', 'boss-timer-critical');
      if (left <= 10) {
        el.style.color = '#ff2222';
        el.style.filter = 'drop-shadow(0 0 15px #fff) drop-shadow(0 0 40px #ff0000) drop-shadow(0 0 80px #ff0000) drop-shadow(0 4px 8px rgba(0,0,0,0.9))';
        el.style.fontSize = Math.round(baseSize * 1.25) + 'px';
        tw.classList.add('boss-timer-critical');
      } else if (left <= 30) {
        el.style.color = '#ff4444';
        el.style.filter = 'drop-shadow(0 0 12px #fff) drop-shadow(0 0 30px #ff3300) drop-shadow(0 0 60px #ff3300) drop-shadow(0 4px 8px rgba(0,0,0,0.9))';
        el.style.fontSize = Math.round(baseSize * 1.14) + 'px';
        tw.classList.add('boss-timer-critical');
      } else if (left <= 60) {
        el.style.color = '#f97316';
        el.style.filter = 'drop-shadow(0 0 10px rgba(255,200,0,0.7)) drop-shadow(0 0 25px rgba(249,115,22,0.6)) drop-shadow(0 4px 8px rgba(0,0,0,0.8))';
        el.style.fontSize = Math.round(baseSize * 1.09) + 'px';
        tw.classList.add('boss-timer-warning');
      } else {
        el.style.color = '#ffffff';
        el.style.filter = 'drop-shadow(0 0 10px rgba(255,255,255,0.9)) drop-shadow(0 0 30px rgba(239,68,68,0.7)) drop-shadow(0 0 60px rgba(239,68,68,0.4)) drop-shadow(0 4px 8px rgba(0,0,0,0.8))';
        el.style.fontSize = baseSize + 'px';
      }

      // タイマー残時間に応じた背景赤黒化
      const totalSec = agruBattleConfig?.timeLimit || 300;
      const progress = 1 - (left / totalSec);
      const darkOp   = Math.pow(Math.max(0, progress), 1.5) * 0.55;
      const darkEl = document.getElementById('bossTimerBgDark');
      if (darkEl) darkEl.style.background = `rgba(80, 0, 0, ${darkOp.toFixed(3)})`;
    },
  };
})();

// ===== ボスアゲル BGM + Web Audio 解析 =====
let _bossBattleBgm = null;
let _bossAudioCtx = null;
let _bossAnalyserNode = null;
let _bossAnalyserData = null;

function _bossGetAudioCtx() {
  try {
    if (!_bossAudioCtx || _bossAudioCtx.state === 'closed') {
      _bossAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  } catch {}
  return _bossAudioCtx;
}

function _bossStartBgm() {
  _bossStopBgm();
  const bgm = agruBattleConfig?.bgm;
  if (!bgm?.path) return;

  const audio = new Audio('/sound/' + bgm.path);
  audio.volume = Math.max(0, Math.min(1, (bgm.volume ?? 70) / 100));
  audio.loop = true;
  audio.preload = 'auto';
  _bossBattleBgm = audio;

  // リトライ管理
  let _bgmRetryFn = null;
  const removeBgmRetry = () => {
    if (!_bgmRetryFn) return;
    document.removeEventListener('click',      _bgmRetryFn);
    document.removeEventListener('keydown',    _bgmRetryFn);
    document.removeEventListener('touchstart', _bgmRetryFn);
    _bgmRetryFn = null;
  };
  audio._removeBgmRetry = removeBgmRetry;

  // ① まず WebAudio 接続なしで再生する。
  //    createMediaElementSource を先に呼ぶと AudioContext が suspended の場合に
  //    play() が成功しても無音になるためここでは接続しない。
  const tryPlay = () => {
    if (_bossBattleBgm !== audio) { removeBgmRetry(); return; }
    audio.play().then(() => {
      removeBgmRetry();
      // ② 再生が確認できてから WebAudio 解析器を接続（失敗しても再生は継続）
      _bossConnectAnalyser(audio);
    }).catch(() => {
      if (!_bgmRetryFn) {
        _bgmRetryFn = () => tryPlay();
        document.addEventListener('click',      _bgmRetryFn);
        document.addEventListener('keydown',    _bgmRetryFn);
        document.addEventListener('touchstart', _bgmRetryFn);
      }
    });
  };
  tryPlay();
}

async function _bossConnectAnalyser(audio) {
  if (audio._audioConnected) return;
  try {
    const ctx = _bossGetAudioCtx();
    if (!ctx) return;
    // AudioContext が suspended なら resume を試みる（ユーザー操作済みなので通常成功）
    if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
    if (_bossBattleBgm !== audio || audio._audioConnected) return;
    // running 状態を確認してから接続（suspended のまま接続すると無音になる）
    if (ctx.state !== 'running') return;
    const src = ctx.createMediaElementSource(audio);
    _bossAnalyserNode = ctx.createAnalyser();
    _bossAnalyserNode.fftSize = 256;
    _bossAnalyserNode.smoothingTimeConstant = 0.75;
    _bossAnalyserData = new Uint8Array(_bossAnalyserNode.frequencyBinCount);
    src.connect(_bossAnalyserNode);
    _bossAnalyserNode.connect(ctx.destination);
    audio._audioConnected = true;
  } catch {}
}

function _bossStopBgm() {
  if (_bossBattleBgm) {
    _bossBattleBgm._removeBgmRetry?.();  // 再試行リスナーを確実に削除
    _bossBattleBgm.pause();
    _bossBattleBgm.currentTime = 0;
    _bossBattleBgm = null;
  }
  _bossAnalyserNode = null;
  _bossAnalyserData = null;
}

function _bossGetAudioLevel() {
  if (!_bossAnalyserNode || !_bossAnalyserData) return 0;
  _bossAnalyserNode.getByteFrequencyData(_bossAnalyserData);
  let sum = 0;
  for (let i = 0; i < _bossAnalyserData.length; i++) sum += _bossAnalyserData[i];
  return sum / _bossAnalyserData.length / 255;
}

// 低周波数帯域のみ取得（bin 1〜10 ≈ 172〜1720 Hz）
// _bossGetAudioLevel() の後に呼ぶこと（getByteFrequencyData はそちらで更新済み）
function _bossGetBassLevel() {
  if (!_bossAnalyserData) return 0;
  let sum = 0;
  for (let i = 1; i <= 10; i++) sum += _bossAnalyserData[i];
  return sum / 10 / 255;
}

// ===== ボスアゲル 登場演出 =====

// 登場演出中の効果音（endAgruBattle / Phase5 からも停止できるようモジュール変数で管理）
let _bossEntranceAlarmAudio = null;
let _bossEntranceGlassAudio = null;
function _stopEntranceSounds() {
  if (_bossEntranceAlarmAudio) { _bossEntranceAlarmAudio.pause(); _bossEntranceAlarmAudio.currentTime = 0; _bossEntranceAlarmAudio = null; }
  if (_bossEntranceGlassAudio) { _bossEntranceGlassAudio.pause(); _bossEntranceGlassAudio.currentTime = 0; _bossEntranceGlassAudio = null; }
}

// ガラス割れエフェクト：亀裂を事前生成→フラッシュ→静止、オーバーレイのフェードで消える
function _bossEntranceGlassBreak(overlay) {
  const W = window.innerWidth, H = window.innerHeight;
  const gc = document.createElement('canvas');
  gc.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:18';
  gc.width = W; gc.height = H;
  overlay.appendChild(gc);
  const ctx = gc.getContext('2d');

  const cx = W * 0.5, cy = H * 0.47;

  // 亀裂をフラクタル分割で事前生成（毎フレーム乱数を使わないので静止画になる）
  const genSeg = (x1, y1, x2, y2, d) => {
    if (d <= 0 || Math.hypot(x2 - x1, y2 - y1) < 8) return [[x1, y1], [x2, y2]];
    const spread = Math.hypot(x2 - x1, y2 - y1) * 0.28;
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * spread;
    const my = (y1 + y2) / 2 + (Math.random() - 0.5) * spread;
    return genSeg(x1, y1, mx, my, d - 1).concat(genSeg(mx, my, x2, y2, d - 1).slice(1));
  };

  // メイン亀裂（中心から放射状）
  const numMain = 9 + Math.floor(Math.random() * 3);
  const mainCracks = [];
  for (let i = 0; i < numMain; i++) {
    const baseAngle = (i / numMain) * Math.PI * 2;
    const angle = baseAngle + (Math.random() - 0.5) * (Math.PI * 2 / numMain) * 0.55;
    const len = Math.min(W, H) * (0.38 + Math.random() * 0.44);
    const pts = genSeg(cx, cy, cx + Math.cos(angle) * len, cy + Math.sin(angle) * len, 4);
    mainCracks.push({ pts, angle, len, alpha: 0.88 + Math.random() * 0.12, lw: 1.4 + Math.random() * 0.6 });
  }

  // 枝亀裂（メイン亀裂の途中から分岐）
  const branches = [];
  mainCracks.forEach(mc => {
    const numB = 1 + Math.floor(Math.random() * 3);
    for (let b = 0; b < numB; b++) {
      const ti = Math.floor(mc.pts.length * (0.28 + Math.random() * 0.45));
      const [bx, by] = mc.pts[Math.min(ti, mc.pts.length - 1)];
      const bAngle = mc.angle + (Math.random() - 0.5) * Math.PI * 0.65;
      const bLen = mc.len * (0.18 + Math.random() * 0.28);
      const pts = genSeg(bx, by, bx + Math.cos(bAngle) * bLen, by + Math.sin(bAngle) * bLen, 3);
      branches.push({ pts, alpha: 0.55 + Math.random() * 0.25, lw: 0.7 + Math.random() * 0.5 });
    }
  });

  // 衝撃点（中心の小さな多角形クラック）
  const impactRings = [{ r: 8 + Math.random() * 6, lw: 1.8 }, { r: 18 + Math.random() * 8, lw: 1.1 }];

  // 描画関数
  const drawCrack = (pts, alpha, lw, glowSize) => {
    ctx.beginPath();
    pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
    ctx.strokeStyle = `rgba(230,245,255,${alpha})`;
    ctx.lineWidth = lw;
    ctx.shadowBlur = glowSize;
    ctx.shadowColor = `rgba(180,220,255,${alpha * 0.6})`;
    ctx.stroke();
  };

  const drawFrame = (flashAlpha) => {
    ctx.clearRect(0, 0, W, H);
    ctx.shadowBlur = 0;

    // フラッシュ（白）
    if (flashAlpha > 0) {
      ctx.fillStyle = `rgba(255,255,255,${flashAlpha})`;
      ctx.fillRect(0, 0, W, H);
    }

    // メイン亀裂
    mainCracks.forEach(mc => drawCrack(mc.pts, mc.alpha, mc.lw, 10));
    // 枝亀裂
    branches.forEach(b => drawCrack(b.pts, b.alpha, b.lw, 4));

    // 衝撃リング
    impactRings.forEach(({ r, lw }) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = lw;
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(200,230,255,0.7)';
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  };

  // フラッシュフェードアニメーション（5フレームのみ、以降は静止）
  let frame = 0;
  const FLASH_FRAMES = 6;
  let raf;
  const loop = () => {
    const flashAlpha = frame < FLASH_FRAMES ? (1 - frame / FLASH_FRAMES) * 0.88 : 0;
    drawFrame(flashAlpha);
    frame++;
    if (frame <= FLASH_FRAMES) raf = requestAnimationFrame(loop);
    // FLASH_FRAMES 後は静止（オーバーレイのフェードで自然に消える）
  };
  raf = requestAnimationFrame(loop);

  // オーバーレイ除去と同時にクリーンアップ
  setTimeout(() => { cancelAnimationFrame(raf); gc.remove(); }, 3200);
}

let _bossEntranceAborted = false;
function _agruBattleEntrance(onDone) {
  _bossEntranceAborted = false;
  const overlay = document.getElementById('bossEntranceOverlay');
  if (!overlay) { window._bossEfx?.start(); _bossStartBgm(); onDone(); return; }

  // ボス画像をオーバーレイにコピー
  const eImg = document.getElementById('bossEntranceImg');
  const bImg = document.getElementById('agruBattleCharImg');
  if (eImg && bImg?.src) eImg.src = bImg.src;

  // Phase 0: フェードイン（暗転）+ 警報音開始
  overlay.className = ''; // hidden等解除
  overlay.style.cssText = 'opacity:0;transition:opacity 0.5s';
  requestAnimationFrame(() => requestAnimationFrame(() => { overlay.style.opacity = '1'; }));
  _stopEntranceSounds();
  _bossEntranceAlarmAudio = new Audio('/sound/boss/' + encodeURIComponent('エマージェンシーコール・警報音５.wav'));
  _bossEntranceAlarmAudio.loop = true;
  _bossEntranceAlarmAudio.volume = 0.75;
  _bossEntranceAlarmAudio.play().catch(() => {});

  // Phase 1: 警告テキスト + フラッシュ + エッジグロー
  setTimeout(() => {
    if (_bossEntranceAborted) return;
    document.getElementById('bossEntranceWarning')?.classList.add('bev-active');
    overlay.classList.add('bev-flash', 'bev-lit');
    setTimeout(() => overlay.classList.remove('bev-flash'), 1100);
  }, 550);

  // Phase 2: ボス名表示
  setTimeout(() => {
    if (_bossEntranceAborted) return;
    document.getElementById('bossEntranceName')?.classList.add('bev-active');
    document.getElementById('bossEntranceSub')?.classList.add('bev-active');
  }, 950);

  // Phase 3: ボス画像スケールイン + 拡大リング
  setTimeout(() => {
    if (_bossEntranceAborted) return;
    if (eImg) eImg.classList.add('bev-img-active');
    // 拡大リングをcanvasに描画
    const rCanvas = document.getElementById('bossEntranceRings');
    if (rCanvas) {
      rCanvas.width = window.innerWidth; rCanvas.height = window.innerHeight;
      const rCtx = rCanvas.getContext('2d');
      const cx = window.innerWidth / 2, cy = window.innerHeight * 0.68;
      let rings = [{ r: 30, a: 0.9 }]; let rRAF;
      const rLoop = () => {
        rCtx.clearRect(0, 0, rCanvas.width, rCanvas.height);
        if (Math.random() < 0.08) rings.push({ r: 10, a: 0.85 });
        rings = rings.filter(r => r.a > 0.02);
        rings.forEach(ring => {
          ring.r += 7; ring.a -= 0.014;
          rCtx.beginPath(); rCtx.arc(cx, cy, ring.r, 0, Math.PI * 2);
          rCtx.strokeStyle = `rgba(239,68,68,${ring.a})`; rCtx.lineWidth = 3; rCtx.stroke();
        });
        rRAF = requestAnimationFrame(rLoop);
      };
      rRAF = requestAnimationFrame(rLoop);
      setTimeout(() => { cancelAnimationFrame(rRAF); rCtx.clearRect(0, 0, rCanvas.width, rCanvas.height); }, 1800);
    }
  }, 1500);

  // Phase 4: ガラス割れ + ボスキャラ表示 + エフェクト開始 + BGM開始 + オーバーレイフェードアウト
  setTimeout(() => {
    if (_bossEntranceAborted) return;
    _bossEntranceGlassBreak(overlay);
    // ガラス音
    _bossEntranceGlassAudio = new Audio('/sound/boss/' + encodeURIComponent('ガラスが割れる1（旧バージョン）.mp3'));
    _bossEntranceGlassAudio.volume = 0.9;
    _bossEntranceGlassAudio.play().catch(() => {});
    document.getElementById('agruBossFigureWrap')?.classList.remove('hidden');
    window._bossEfx?.start();
    _bossStartBgm();
    // ガラス割れが少し見えてからフェード開始
    setTimeout(() => {
      if (_bossEntranceAborted) return;
      overlay.style.transition = 'opacity 1.1s';
      overlay.style.opacity = '0';
    }, 180);
  }, 2300);

  // Phase 5: オーバーレイ除去 + 効果音停止 + コールバック
  // フェード開始2480ms + 1100ms = 3580ms なので 3800ms に設定
  const _cleanEntrance = () => {
    _stopEntranceSounds();
    overlay.style.cssText = '';
    overlay.className = 'hidden';
    ['bossEntranceWarning','bossEntranceName','bossEntranceSub'].forEach(id =>
      document.getElementById(id)?.classList.remove('bev-active')
    );
    if (eImg) eImg.classList.remove('bev-img-active');
  };
  setTimeout(() => {
    if (_bossEntranceAborted) { _cleanEntrance(); return; }
    _cleanEntrance();
    onDone();
  }, 3800);
}

function _agruWinImageDisintegrate(container) {
  const imgEl = container.querySelector('img');
  if (!imgEl) { container.remove(); return; }

  const ir = imgEl.getBoundingClientRect();
  const sr = stage.getBoundingClientRect();
  const W  = Math.round(ir.width);
  const H  = Math.round(ir.height);
  if (W < 4 || H < 4) { container.remove(); return; }

  // 画像をオフスクリーンCanvasに描画してピクセルデータを取得
  const off = document.createElement('canvas');
  off.width = W; off.height = H;
  const octx = off.getContext('2d', { willReadFrequently: true });
  try { octx.drawImage(imgEl, 0, 0, W, H); }
  catch (_) {
    container.style.transition = 'opacity 0.8s';
    container.style.opacity = '0';
    setTimeout(() => container.remove(), 900);
    return;
  }
  const pixels = octx.getImageData(0, 0, W, H).data;

  // 実際に描画するCanvasを#stage内（キャラDOMより前）に配置
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  canvas.style.cssText = `position:absolute;left:${ir.left - sr.left}px;top:${ir.top - sr.top}px;width:${W}px;height:${H}px;pointer-events:none`;
  stage.insertBefore(canvas, container.nextSibling);
  const ctx = canvas.getContext('2d');

  container.style.visibility = 'hidden';

  // パーティクル生成（STEP px ごとに1パーティクル）
  const STEP = 6;
  const pts  = [];
  for (let y = 0; y < H; y += STEP) {
    for (let x = 0; x < W; x += STEP) {
      const i = (y * W + x) * 4;
      if (pixels[i + 3] < 20) continue;
      pts.push({
        x: x + Math.random() * STEP,
        y: y + Math.random() * STEP,
        r: pixels[i], g: pixels[i + 1], b: pixels[i + 2],
        a: pixels[i + 3] / 255,
        vx: (Math.random() - 0.3) * 2.5,
        vy: -(Math.random() * 1.2 + 0.1),
        life:  1.0,
        decay: 0.007 + Math.random() * 0.011,
        delay: Math.floor(Math.random() * 18),
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    for (const p of pts) {
      if (p.delay > 0) { p.delay--; alive = true; continue; }
      if (p.life <= 0) continue;
      alive = true;
      p.x   += p.vx;
      p.y   += p.vy;
      p.vy  += 0.05;
      p.vx  *= 0.988;
      p.life -= p.decay;
      if (p.life <= 0) continue;
      ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${(p.a * p.life).toFixed(3)})`;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), STEP - 1, STEP - 1);
    }
    if (alive) requestAnimationFrame(draw);
    else { canvas.remove(); container.remove(); }
  }
  requestAnimationFrame(draw);
}

function _agruBattleVictoryBounce() {
  // バトル終了直後に呼ぶ。生存キャラを2倍+バウンスし、10秒後に元に戻す
  const alive = Object.values(users).filter(u => u.el && !u.ko);
  if (alive.length === 0) return;

  alive.forEach(u => {
    if (u.el) u.el.classList.add('agru-victory-bounce');
  });

  // 0.5s grow + 0.65s×15 bounce = 10.25s → 10.4s 後にリセット
  setTimeout(() => {
    alive.forEach(u => {
      const el = u.el;  // クラスを付けたのと同じ要素
      if (!el) return;
      // アニメ終了状態をインラインで固定してからクラスを外す（fill-mode が外れても scale を維持）
      el.style.transformOrigin = 'bottom center';
      el.style.transform  = 'scale(1.3)';
      el.classList.remove('agru-victory-bounce');
      el.style.transition = 'transform 0.6s cubic-bezier(.34,1.56,.64,1)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.transform = 'scale(1)';
      }));
      setTimeout(() => {
        el.style.transform      = '';
        el.style.transition     = '';
        el.style.transformOrigin = '';
      }, 700);
    });
    // スケールリセット完了後に下集合
    setTimeout(() => gatherCharactersBottom(), 800);
  }, 10400);
}

function _agruRestoreModal() {
  const modal = document.getElementById('agruModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.style.zIndex = agruModalZ || '';
  // キャラ画像をデフォルトに戻す
  const img = document.getElementById('agruCharImg');
  if (img && agruDefaultImage) {
    img.src = `/ageru/${encodeURIComponent(agruDefaultImage)}`;
    img.addEventListener('load', updateAgruPurupuru, { once: true });
  }
  // サイズ・位置・背景を設定から復元
  const cm = modal.querySelector('.agru-modal');
  if (cm) {
    if (agruModalWidth)  cm.style.width  = agruModalWidth  + 'px';
    if (agruModalHeight) cm.style.height = agruModalHeight + 'px';
    if (agruModalBgOpacity != null) cm.style.background = `rgba(255,248,251,${agruModalBgOpacity / 100})`;
    const cx = localStorage.getItem('agruModalX');
    const cy = localStorage.getItem('agruModalY');
    if (cx && cy) {
      const lx = parseFloat(cx), ly = parseFloat(cy);
      if (lx >= 0 && ly >= 0 && lx < window.innerWidth - 60 && ly < window.innerHeight - 40) {
        cm.style.left = cx; cm.style.top = cy; cm.style.transform = 'none';
      } else {
        localStorage.removeItem('agruModalX'); localStorage.removeItem('agruModalY');
      }
    }
  }
}

function _agruBattleWipe() {
  if (!agruBattleActive) return;
  // タイマー・カウンターを即時停止
  clearInterval(agruBattleTimerInterval);
  clearInterval(agruBattleCounterTimer);
  agruBattleTimerInterval = null;
  agruBattleCounterTimer  = null;
  // 全滅セリフ
  _agruBattleGetSpeech('battleWipe');
  _agruAddSystemMsg('☠️ 全滅…！アゲルちゃんの完全勝利！');
  // 全滅画像オーバーレイ
  const wipeImg = agruBattleConfig?.wipeImage;
  let wipeOverlay = null;
  if (wipeImg) {
    wipeOverlay = document.createElement('div');
    wipeOverlay.id = '_agruWipeOverlay';
    wipeOverlay.style.cssText = 'position:fixed;inset:0;z-index:99998;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8)';
    const img = document.createElement('img');
    img.src = '/boss/' + encodeURIComponent(wipeImg);
    img.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain';
    wipeOverlay.appendChild(img);
    document.body.appendChild(wipeOverlay);
  }
  // シーンチェンジ（フェードアウト → バトル終了）
  setTimeout(() => {
    const scrim = document.createElement('div');
    scrim.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000;opacity:0;transition:opacity 1.2s ease;pointer-events:none';
    document.body.appendChild(scrim);
    requestAnimationFrame(() => requestAnimationFrame(() => { scrim.style.opacity = '1'; }));
    setTimeout(() => {
      wipeOverlay?.remove();
      scrim.remove();
      endAgruBattle('wipe');
    }, 1400);
  }, 3500);
}

// HP0 → 砕け散りエフェクト → 勝利フロー
function _agruPlayerVictoryIntro() {
  if (!agruBattleActive || _agruVictoryPending) return;
  _agruVictoryPending = true;
  clearInterval(agruBattleTimerInterval);
  clearInterval(agruBattleCounterTimer);
  agruBattleTimerInterval = null;
  agruBattleCounterTimer  = null;
  _agruShatterEffect(() => {
    _agruVictoryPending = false;
    endAgruBattle('players');
  });
}

function _agruShatterEffect(onDone) {
  const W = window.innerWidth, H = window.innerHeight;
  const cols = 5, rows = 4;

  // 格子点をジッター付きで生成（境界は固定）
  const pts = [];
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const edge = (r === 0 || r === rows || c === 0 || c === cols);
      const jx = edge ? 0 : (Math.random() - 0.5) * (W / cols * 0.55);
      const jy = edge ? 0 : (Math.random() - 0.5) * (H / rows * 0.55);
      pts.push([c * W / cols + jx, r * H / rows + jy]);
    }
  }

  // 三角形シャード（クワッドを対角線で2分割）
  const shards = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tl = pts[r*(cols+1)+c],   tr = pts[r*(cols+1)+c+1];
      const bl = pts[(r+1)*(cols+1)+c], br = pts[(r+1)*(cols+1)+c+1];
      if (Math.random() > 0.5) { shards.push([tl,tr,bl], [tr,br,bl]); }
      else                     { shards.push([tl,tr,br], [tl,br,bl]); }
    }
  }

  // 白フラッシュ（爆発の瞬間）
  const flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;inset:0;z-index:100000;background:#fff;opacity:0.85;transition:opacity 600ms ease;pointer-events:none';
  document.body.appendChild(flash);
  requestAnimationFrame(() => requestAnimationFrame(() => { flash.style.opacity = '0'; }));
  setTimeout(() => flash.remove(), 650);

  // シャードコンテナ
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;overflow:hidden';
  document.body.appendChild(container);

  const maxDelay = 320;
  const dur = 1350;
  const scx = W / 2, scy = H * 0.45;

  shards.forEach(tri => {
    const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
    const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
    const dx = cx - scx, dy = cy - scy;
    const len = Math.sqrt(dx*dx + dy*dy) || 1;
    const speed = 380 + Math.random() * 420;
    const vx = (dx/len) * speed + (Math.random()-0.5)*160;
    const vy = (dy/len) * speed + (Math.random()-0.5)*160;
    const rot = (Math.random()-0.5) * 210;
    const delay = Math.random() * maxDelay;
    const hue = 200 + Math.random() * 40;
    const sat = 45 + Math.random() * 35;
    const lig = 15 + Math.random() * 30;

    const div = document.createElement('div');
    const poly = tri.map(p => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(',');
    div.style.cssText = `position:fixed;left:0;top:0;width:${W}px;height:${H}px;`
      + `clip-path:polygon(${poly});`
      + `background:linear-gradient(${Math.random()*360}deg,`
      +   `hsl(${hue},${sat}%,${lig}%),hsl(${hue+10},${sat-10}%,${lig*0.5}%));`
      + `filter:drop-shadow(0 0 4px rgba(147,197,253,0.85));`;
    container.appendChild(div);

    setTimeout(() => {
      div.style.transition = `transform ${dur}ms cubic-bezier(0.03,0,0.82,1), opacity ${dur}ms cubic-bezier(0.15,0,1,1)`;
      div.style.transformOrigin = `${cx}px ${cy}px`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        div.style.transform = `translate(${vx}px,${vy}px) rotate(${rot}deg)`;
        div.style.opacity = '0';
      }));
    }, delay);
  });

  setTimeout(() => { container.remove(); onDone(); }, maxDelay + dur + 100);
}

function endAgruBattle(result) {
  if (!agruBattleActive) return;
  _agruVictoryPending = false;

  // 残留している勝利オーバーレイを必ず除去
  document.getElementById('_agruWinOverlay')?.remove();

  // 登場演出を即座に中断・クリーンアップ（効果音も停止）
  _bossEntranceAborted = true;
  _stopEntranceSounds();
  const _eo = document.getElementById('bossEntranceOverlay');
  if (_eo) {
    _eo.style.cssText = '';
    _eo.className = 'hidden';
    ['bossEntranceWarning','bossEntranceName','bossEntranceSub'].forEach(id =>
      document.getElementById(id)?.classList.remove('bev-active')
    );
    const _eoi = document.getElementById('bossEntranceImg');
    if (_eoi) _eoi.classList.remove('bev-img-active');
  }

  agruBattleActive        = false;
  _agruBattleEntranceDone = false;
  _agruLastHpBucket       = null;
  document.getElementById('agruBattleOverlayBg')?.classList.remove('boss-bg-shake');
  clearInterval(agruBattleTimerInterval);
  clearInterval(agruBattleCounterTimer);
  agruBattleTimerInterval = null;
  agruBattleCounterTimer  = null;

  // 超回復防御状態をリセット
  if (_agruDefenseTimer) { clearTimeout(_agruDefenseTimer); _agruDefenseTimer = null; }
  _agruDefenseActive    = false;
  _agruDefenseDmgAccum  = 0;
  _agruDefenseShieldStop();
  document.getElementById('agruBattleCharImg')?.classList.remove('agru-defense');

  // 歌詞フロートを停止
  stopLyricsFloat();

  // 盾・シールドをリセット
  if (_agruShieldTimer) { clearTimeout(_agruShieldTimer); _agruShieldTimer = null; }
  if (_agruShieldChar) {
    const sc = _agruShieldChar;
    sc.el?.classList.remove('agru-shield-char');
    if (sc._shieldSavedStyle) {
      if (sc.el) { sc.el.style.transform = sc._shieldSavedStyle.transform || ''; }
      delete sc._shieldSavedStyle;
    }
    _agruShieldChar = null;
  }
  _agruShieldHp = 0;
  document.getElementById('_agruShieldHpDisplay')?.remove();

  // エフェクト・BGM 停止
  window._bossEfx?.stop();
  _bossStopBgm();
  _bossClearAudioFx();

  // #bossAudioFxImg を DOM から除去（次バトル開始時に再生成、z-index/isolation もリセット）
  document.getElementById('bossAudioFxImg')?.remove();
  const _cleanImg = document.getElementById('agruBattleCharImg');
  if (_cleanImg) { _cleanImg.style.position = ''; _cleanImg.style.zIndex = ''; }
  const _charFig = document.getElementById('agruBattleCharFigure');
  if (_charFig) _charFig.style.isolation = '';

  // UI を元に戻す
  _agruBattleLeaveUI();

  // バトル背景・キャラを非表示（リスナー勝利時は10秒後にフェードで消す）
  if (result !== 'players') {
    document.getElementById('agruBattleOverlay')?.classList.add('hidden');
    const _bfWrap = document.getElementById('agruBossFigureWrap');
    if (_bfWrap) {
      _bfWrap.querySelectorAll('.puru-canvas').forEach(c => { if (c._puruImg) c._puruImg.style.opacity = ''; c.remove(); });
      _bfWrap.classList.add('hidden');
    }
    document.getElementById('agruBattleCharWrap')?.classList.add('hidden');
  }

  // バトル背景・レイアウトをリセット（リスナー勝利時は10秒後に実施）
  if (result !== 'players') {
    _agruApplyBattleBg(null);
    _resetBossLayoutConfig();
  }
  _agruBattleRestoreChars();
  _agruBattleKilledIds.clear(); // バトル終了後はKO済み制限を解除し再生成を許可
  Object.values(users).forEach(u => {
    document.getElementById('a-' + u.ipid)?.querySelector('.hp-gray-overlay')?.remove();
    u.el?.classList.remove('agru-float-delete');
  });
  _agruClearAllStatusIcons();

  // 会話モードBGMを再開
  if (agruActive) _agruBgmPlay();

  // バトル終了時: Ollamaが停止していれば起動（勝敗問わず）
  fetch('/api/srv/start/ollama', { method: 'POST' }).catch(() => {});

  // ボス勝利時: 好感度・空腹度を初期値にリセット
  if (result === 'ageru') {
    agruAffinity = 50;
    agruHunger   = 100;
    _agruUpdateAffinityDisplay(0);
    _agruUpdateHungerDisplay(0);
    _agruAddSystemMsg('😈 アゲルちゃんの勝利！好感度・空腹度が初期化された…');
  }

  // 通常ボスを再召喚（手動消滅していない場合）
  if (!bossManuallyCleared && !compactMode && !bossState) {
    spawnBoss(nextBossHp());
  }

  // 吹き出しを非表示
  const _bubble = document.getElementById('agruBattleSpeechBubble');
  if (_bubble) { _bubble.style.display = 'none'; _bubble.textContent = ''; }

  // 早押しタイマーを再開（ゲーム配信中のみ）
  if (pollTimer && !compactMode) {
    if (!hayaoshiAutoTimerWhite) {
      (function scheduleHayaoshiWhite() {
        hayaoshiAutoTimerWhite = setTimeout(() => {
          if (!pollTimer || agruBattleActive) return;
          startHayaoshiAutoWhite();
          scheduleHayaoshiWhite();
        }, hayaoshiFreq);
      })();
    }
    if (!hayaoshiAutoTimerRed) {
      (function scheduleHayaoshiRed() {
        hayaoshiAutoTimerRed = setTimeout(() => {
          if (!pollTimer || agruBattleActive) return;
          startHayaoshiAutoRed();
          scheduleHayaoshiRed();
        }, hayaoshiFreq * 3);
      })();
    }
  }

  updateAgruBattleHpDisplay();
  if (result === 'players') {
    // リスナー勝利
    _agruPlayersWon = true; // アゲル系画像をキャラプールから除外
    _agruAddSystemMsg('🏆 アゲルちゃん討伐！リスナーの勝利！');
    _agruBattleGetSpeech('battleWin');
    Object.values(users).forEach(u => { if (u.el && !u.ko) { u.mp = (u.mp || 0) + 50; updateStatsDisplay(u); } });

    // ボスアゲル画像を勝利画像に差し替え（ぷるぷる除去→フェードイン）
    const winImg = agruBattleConfig?.winImage;
    if (winImg) {
      const battleCharImg = document.getElementById('agruBattleCharImg');
      if (battleCharImg) {
        // 旧ぷるぷるキャンバスを除去（imgのopacityも復元される）
        const _figEl = document.getElementById('agruBattleCharFigure') || document.getElementById('agruBossFigureWrap');
        _figEl?.querySelectorAll('.puru-canvas').forEach(c => { if (c._puruImg) c._puruImg.style.opacity = ''; c.remove(); });
        // src切り替え中の一瞬のアスペクト比崩れを防ぐため先にopacity:0にする
        battleCharImg.style.transition = '';
        battleCharImg.style.opacity = '0';
        battleCharImg.src = '/boss/' + encodeURIComponent(winImg);
        const _showWinImg = () => {
          battleCharImg.style.transition = 'opacity 0.4s ease';
          battleCharImg.style.opacity = '1';
        };
        if (battleCharImg.complete && battleCharImg.naturalWidth) _showWinImg();
        else battleCharImg.addEventListener('load', _showWinImg, { once: true });
      }
    }

    // アゲル系キャラをランダム非アゲル系に変更（消滅させず勝利演出に参加させる）
    const agruTypeSet = new Set((agruBattleConfig?.agruTypeImages || []).map(s => s.trim()).filter(Boolean));
    if (agruTypeSet.size > 0) {
      const imgPool = (availableImages.length > 0 ? availableImages : Object.values(charImages).filter(v => v))
        .filter(img => !agruTypeSet.has(img));
      Object.values(users).forEach(u => {
        if (!u.el || u.ko) return;
        const img = u.charImage || charImages[u.charDef?.id] || '';
        if (agruTypeSet.has(img) && imgPool.length > 0) {
          u.charImage = imgPool[Math.floor(Math.random() * imgPool.length)];
          applyAvatarStyle(u);
        }
      });
    }

    // 生存キャラを2倍バウンス（アゲル系変更後に起動）
    setTimeout(() => _agruBattleVictoryBounce(), 400);

    // ボスUI を10秒後にフェードアウト・背景リセット
    const _bossFadeIds = ['agruBattleOverlay','agruBossFigureWrap','agruBattleCharWrap'];
    setTimeout(() => {
      const _bossEls = _bossFadeIds.map(id => document.getElementById(id)).filter(Boolean);
      _bossEls.forEach(el => { el.style.transition = 'opacity 1.5s ease'; el.style.opacity = '0'; });
      setTimeout(() => {
        _bossEls.forEach(el => { el.style.transition = ''; el.style.opacity = ''; el.classList.add('hidden'); });
        document.getElementById('agruBossFigureWrap')
          ?.querySelectorAll('.puru-canvas')
          .forEach(c => { if (c._puruImg) c._puruImg.style.opacity = ''; c.remove(); });
        _agruApplyBattleBg(null);
        _resetBossLayoutConfig();
      }, 1500);
    }, 10000);

    // 会話モーダルを閉じる
    if (agruActive) {
      agruActive = false;
      agruIdle   = false;
      closeAgruModal?.();
      _agruAddSystemMsg('会話モードを終了しました。');
    }
  } else if (result === 'wipe') {
    // 全滅 — アゲルちゃんの完全勝利
    _agruAddSystemMsg('☠️ 全滅…アゲルちゃんの完全勝利！全員のMPを奪われた…');
    Object.values(users).forEach(u => { u.mp = 0; updateStatsDisplay(u); });
    if (!agruActive) { agruActive = true; agruIdle = true; }
    _agruRestoreModal();
  } else if (result === 'force') {
    // 強制終了 — MP変化なし・演出なし・会話モードそのまま維持
    _agruAddSystemMsg('⚠️ バトルを強制終了しました。');
  } else {
    // アゲルちゃん勝利（タイムアップ） — 会話モーダルを再起動
    _agruAddSystemMsg('😈 アゲルちゃんの勝利！全員のMPを奪われた…');
    _agruBattleGetSpeech('battleLose');
    Object.values(users).forEach(u => { u.mp = 0; updateStatsDisplay(u); });
    if (!agruActive) { agruActive = true; agruIdle = true; }
    _agruRestoreModal();
  }
}

function _agruBattleDealDamage(dmg, user) {
  if (!agruBattleActive || agruBattleHP <= 0) return;
  if (agruBattleBerserkUntil > Date.now()) return; // バーサーク中は無効
  if (user && _agruBattleKilledIds.has(user.ipid)) return; // KO済みは攻撃不能
  if (user) {
    const eff = agruBattleStatusEffects.get(user.ipid) || {};
    const now = Date.now();
    if (eff.stoneUntil > now || eff.sleepUntil > now) return; // 石化・眠り中は攻撃不能
    if (eff.charmedUntil > now) { // 魅了中は逆にHP回復
      agruBattleHP = Math.min(agruBattleMaxHP, agruBattleHP + Math.floor(dmg / 2));
      updateAgruBattleHpDisplay();
      return;
    }
    if (eff.curseUntil > now) dmg = Math.floor(dmg / 2); // 呪い中は半減
  }
  // 盾キャラ生存中 + 防御状態: ボスHPは完全無敵
  if (_agruShieldChar && !_agruBattleKilledIds.has(_agruShieldChar.ipid) && _agruDefenseActive) return;
  // 超回復防御状態: 1ダメージに制限
  if (_agruDefenseActive) {
    agruBattleHP = Math.max(0, agruBattleHP - 1);
    _agruDefenseDmgAccum++;
    updateAgruBattleHpDisplay();
    if (_agruDefenseDmgAccum >= 100) _agruBreakDefense();
    return;
  }
  agruBattleHP = Math.max(0, agruBattleHP - dmg);
  updateAgruBattleHpDisplay();
  if (agruBattleHP <= 0) _agruPlayerVictoryIntro();
}

// 吹き出しをキャラからボスアゲルへ飛ばす演出
function _launchAtkBubble(user, text) {
  if (!user.el || !text) return;
  const sr = stage.getBoundingClientRect();
  const cr = user.el.getBoundingClientRect();
  const bossEl = document.getElementById('agruBattleCharImg');
  if (!bossEl) return;
  const br = bossEl.getBoundingClientRect();

  const sx = cr.left - sr.left + cr.width / 2;
  const sy = cr.top  - sr.top  + cr.height * 0.25;
  const ex = br.left - sr.left + br.width / 2;
  const ey = br.top  - sr.top  + br.height * 0.3;

  const label = text.length > 18 ? text.slice(0, 18) + '…' : text;

  const fly = document.createElement('div');
  fly.style.cssText = [
    'position:absolute', `left:${sx}px`, `top:${sy}px`,
    'transform:translate(-50%,-100%) scale(1)',
    'background:rgba(255,255,255,0.96)',
    'color:#111',
    'border-radius:14px',
    'padding:5px 10px',
    'font-size:13px',
    'font-weight:bold',
    'white-space:nowrap',
    'max-width:180px',
    'overflow:hidden',
    'text-overflow:ellipsis',
    'box-shadow:0 3px 10px rgba(0,0,0,0.35)',
    'pointer-events:none',
    'z-index:9000',
    'opacity:1',
    'will-change:left,top,transform,opacity',
  ].join(';');
  fly.textContent = label;

  // 三角形のしっぽ
  const tail = document.createElement('div');
  tail.style.cssText = 'position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:8px solid rgba(255,255,255,0.96)';
  fly.appendChild(tail);

  stage.appendChild(fly);

  // アーチを作るための中間点: X は線形補間、Y は少し上に膨らませる
  const FLIGHT = 420;
  const midX = (sx + ex) / 2;
  const midY = Math.min(sy, ey) - Math.abs(ey - sy) * 0.35 - 40;

  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const t = Math.min((ts - start) / FLIGHT, 1);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease-in-out
    // 2次ベジェ補間
    const bx = (1-ease)*(1-ease)*sx + 2*(1-ease)*ease*midX + ease*ease*ex;
    const by = (1-ease)*(1-ease)*sy + 2*(1-ease)*ease*midY + ease*ease*ey;
    const scale = 1 - ease * 0.45;
    const opacity = t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1;
    fly.style.left    = bx + 'px';
    fly.style.top     = by + 'px';
    fly.style.transform = `translate(-50%,-100%) scale(${scale})`;
    fly.style.opacity = opacity;
    if (t < 1) requestAnimationFrame(step);
    else fly.remove();
  }
  requestAnimationFrame(step);
}

function attackAgruBoss(user, msgLen, msgText) {
  if (!agruBattleActive || agruBattleHP <= 0) return;
  if (user.ko) return;
  if (_agruBattleKilledIds.has(user.ipid)) return;
  const eff = agruBattleStatusEffects.get(user.ipid) || {};
  const now = Date.now();
  if (eff.stoneUntil > now || eff.sleepUntil > now) { showBubble(user, '攻撃できない！', {}); return; }

  const hits    = Math.max(1, Math.ceil((msgLen || 1) / 4));
  const atk     = calcAtk(user);
  const petId   = user.pet?.abilityId;
  const titleBon = typeof getTitleBonuses === 'function' ? getTitleBonuses(user) : { dmgM:1, crit:0 };
  const critBonus = petId === 'scout' ? 0.05 : petId === 'crit_up' ? 0.20 : 0;
  const isCrit  = Math.random() < (0.15 + critBonus + (titleBon.crit || 0));
  const hayaoshiMult = user.hayaoshiBuff ? 1.5 : 1;
  user.hayaoshiBuff = false;
  let totalDmg = Math.round((isCrit
    ? Math.max(1, atk * (2 + Math.floor(Math.random() * 3)) * 2)
    : Math.max(1, atk * (1 + Math.floor(Math.random() * 3)))) * hayaoshiMult * (titleBon.dmgM || 1));
  if ((eff.curseUntil || 0) > now) totalDmg = Math.floor(totalDmg / 2);

  const mpExtra = { mp_boost:1, mp_regen:2, mp_master:3 }[petId] ?? 0;
  user.mp = (user.mp ?? 0) + 1 + mpExtra;
  updateStatsDisplay(user);

  // バトルログに記録（防御中は実際に入る1dmg×ヒット数で表示）
  if (_agruDefenseActive) {
    _agruBattleLog(`⚔️ ${user.name || '名無し'} → 🛡️ ${hits} dmg`);
  } else {
    _agruBattleLog(`⚔️ ${user.name || '名無し'} → ${isCrit ? '💥CRIT ' : ''}${totalDmg} dmg`);
  }

  // 吹き出しをボスへ飛ばす演出
  const FLIGHT_MS = 420;
  _launchAtkBubble(user, msgText || '');

  const baseDmg = Math.floor(totalDmg / hits);
  for (let i = 0; i < hits; i++) {
    setTimeout(() => {
      const d = i === hits - 1 ? totalDmg - baseDmg * (hits - 1) : baseDmg;
      if (!agruBattleActive) return;
      if (agruBattleBerserkUntil > Date.now()) { showDamageNumber && showDamageNumber(stage.clientWidth / 2, stage.clientHeight / 2 - 30, 'GUARD', false, 18, '#fbbf24'); return; }
      if ((eff.charmedUntil || 0) > Date.now()) {
        agruBattleHP = Math.min(agruBattleMaxHP, agruBattleHP + Math.floor(d / 2));
        updateAgruBattleHpDisplay();
        return;
      }

      // 盾キャラが存在する場合はボスでなく盾キャラにダメージ
      if (_agruShieldChar && !_agruBattleKilledIds.has(_agruShieldChar.ipid)) {
        _agruShieldHp = Math.max(0, _agruShieldHp - d);
        const sc = _agruShieldChar;
        const scCenter = _agruCharCenter(sc);
        showDamageNumber?.(scCenter?.cx ?? stage.clientWidth / 2, (scCenter?.cy ?? stage.clientHeight / 2) - 20, d, isCrit);
        _agruUpdateShieldHpDisplay();
        if (_agruShieldHp <= 0) {
          _agruAddSystemMsg(`💥 盾が砕けた！${sc.name || '名無し'} のセーブデータ消去…`);
          _agruReleaseShield(true); // 死亡時は中央に留まる
          _agruBattleKillUser(sc);
        }
        return;
      }

      // 超回復防御状態: 1ダメージに制限し累積カウント
      const actualDmg = _agruDefenseActive ? 1 : d;
      if (_agruDefenseActive) _agruDefenseDmgAccum++;

      agruBattleHP = Math.max(0, agruBattleHP - actualDmg);
      updateAgruBattleHpDisplay();
      playSentouSound();
      const imgEl = document.getElementById('agruCharImg');
      if (imgEl) {
        imgEl.classList.remove('boss-hit-flash');
        void imgEl.offsetWidth;
        imgEl.classList.add('boss-hit-flash');
        imgEl.addEventListener('animationend', () => imgEl.classList.remove('boss-hit-flash'), { once: true });
      }
      const bossImgEl = document.getElementById('agruBattleCharImg');
      let dmgX, dmgY;
      if (bossImgEl) {
        const sr = stage.getBoundingClientRect();
        const br = bossImgEl.getBoundingClientRect();
        dmgX = br.left - sr.left + br.width / 2;
        dmgY = br.top  - sr.top  + br.height * 0.3;
      } else {
        const { x: ux, y: uy } = getCharCenter(user);
        dmgX = ux + (Math.random() - 0.5) * 60;
        dmgY = uy - 40;
      }
      showDamageNumber?.(dmgX, dmgY, actualDmg, _agruDefenseActive ? false : isCrit);
      if (_agruDefenseActive && _agruDefenseDmgAccum >= 100) { _agruBreakDefense(); return; }
      if (agruBattleHP <= 0 && agruBattleActive) _agruPlayerVictoryIntro();
    }, FLIGHT_MS + i * 200);
  }
}

// ── 反撃スキルシステム ───────────────────────────────────────────

const AGRU_BATTLE_SKILLS = [
  { id: 'normal',       name: '通常攻撃',     weights: [60, 50, 40, 30] },
  { id: 'focus_fire',   name: '集中砲火',     weights: [10, 15, 20, 20] },
  { id: 'all_attack',   name: '全体乱打',     weights: [10, 12, 15, 15] },
  { id: 'mp_absorb',    name: 'MP吸収',       weights: [8,  8,  7,  5] },
  { id: 'all_mp_drain', name: '全体MP吸収',   weights: [5,  6,  7,  8] },
  { id: 'petrify',      name: '石化',         weights: [4,  4,  5,  5] },
  { id: 'sleep',        name: '眠り',         weights: [3,  3,  4,  4] },
  { id: 'charm',        name: '魅了',         weights: [2,  2,  3,  4] },
  { id: 'curse',        name: '呪い',         weights: [3,  3,  4,  4] },
  { id: 'self_heal',    name: '自己回復',     weights: [5,  6,  5,  3] },
  { id: 'berserk',      name: 'バーサーク',   weights: [0,  1,  3,  5], minHpPct: 50 },
  { id: 'instant_kill', name: '即死撃',       weights: [0,  0,  1,  3], minHpPct: 25 },
  { id: 'shield_char',  name: '盾キャラ攻撃', weights: [0,  0,  2,  4], minHpPct: 25 },
  { id: 'delete_char',  name: 'デリート攻撃', weights: [0,  0,  1,  3], minHpPct: 25 },
  { id: 'super_heal',   name: '超回復',       weights: [0,  1,  3,  5] },
];

function _agruBattlePickSkill() {
  const pct = agruBattleHP / agruBattleMaxHP * 100;
  const tier = pct > 75 ? 0 : pct > 50 ? 1 : pct > 25 ? 2 : 3;
  const candidates = AGRU_BATTLE_SKILLS.filter(s => {
    if (s.minHpPct && pct > s.minHpPct) return false;
    const cfg = agruBattleConfig?.skills?.[s.id];
    return cfg?.enabled !== false;
  });
  const total = candidates.reduce((sum, s) => {
    const cfg = agruBattleConfig?.skills?.[s.id];
    return sum + (cfg?.weights?.[tier] ?? s.weights[tier]);
  }, 0);
  let rand = Math.random() * total;
  for (const s of candidates) {
    const cfg = agruBattleConfig?.skills?.[s.id];
    rand -= (cfg?.weights?.[tier] ?? s.weights[tier]);
    if (rand <= 0) return s;
  }
  return candidates[0] || AGRU_BATTLE_SKILLS[0];
}

function _agruBattleGetAliveUsers() {
  return Object.values(users).filter(u => u.el && !u.ko && !_agruBattleKilledIds.has(u.ipid));
}

function _agruBattleKillUser(user) {
  if (!user || _agruBattleKilledIds.has(user.ipid)) return;
  _agruBattleKilledIds.add(user.ipid);
  _agruAddSystemMsg(`💀 ${user.name || '名無し'} が討伐された！セーブデータ消去…`);
  if (user.koTimer) { clearTimeout(user.koTimer); user.koTimer = null; }

  // キャラ削除エフェクト（el の位置を使うので null にする前に実行）
  const delEff = agruBattleConfig?.deleteEffect;
  if (delEff?.path && user.el) {
    const r = user.el.getBoundingClientRect();
    const size = delEff.size || 200;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    canvas.style.cssText = `position:fixed;left:${r.left + r.width/2 - size/2}px;top:${r.top + r.height/2 - size/2}px;pointer-events:none;z-index:9999`;
    document.body.appendChild(canvas);
    _agruAnimateSprite(canvas, delEff, () => canvas.remove());
  }

  // el を即座に null にして ensureCharOnStage が新キャラを生成できるようにする
  // （1500ms の間 el が残ると同じ PID のコメントが来ても新キャラが作れない）
  const _killedEl = user.el;
  user.el = null;

  // 全滅チェック（el=null 後に判定することで正確なカウントになる）
  if (agruBattleActive && !_agruWipePending && _agruBattleGetAliveUsers().length === 0) {
    _agruWipePending = true;
    setTimeout(() => _agruBattleWipe(), 700);
  }

  const ipid = user.ipid;
  setTimeout(() => {
    if (user.bubbleTimer) clearTimeout(user.bubbleTimer);
    if (user.motionTimer) clearTimeout(user.motionTimer);
    if (user.moveTimer)   clearTimeout(user.moveTimer);
    if (user.walkTimer)   clearTimeout(user.walkTimer);
    if (user.koTimer)     { clearTimeout(user.koTimer); user.koTimer = null; }
    _killedEl?.remove();
    // バトル終了後に再生成されていた場合（el が復活）はユーザーを保護する
    if (!user.el) {
      delete users[ipid];
      const _sk = user.saveKey || ipid;
      delete _charSaveData[_sk];
      fetch(`/api/char-save/${encodeURIComponent(_sk)}`, { method: 'DELETE' }).catch(() => {});
    }
  }, 1500);
}

function _agruCharCenter(user) {
  if (!user?.el) return null;
  const stageRect = stage.getBoundingClientRect();
  const charRect  = user.el.getBoundingClientRect();
  return {
    cx: charRect.left - stageRect.left + charRect.width  / 2,
    cy: charRect.top  - stageRect.top  + charRect.height / 2,
  };
}

function _agruActivateShield(user) {
  if (!user?.el) return;
  _agruShieldChar = user;
  _agruShieldHp   = agruBattleConfig?.shieldMaxHp ?? 99999;

  // 元のスタイルを保存（width/heightは不使用、transformで拡大）
  user._shieldSavedStyle = {
    left:       user.el.style.left,
    top:        user.el.style.top,
    bottom:     user.el.style.bottom,
    transform:  user.el.style.transform,
    zIndex:     user.el.style.zIndex,
    transition: user.el.style.transition,
  };

  // 画面中央へ3倍サイズで引っ張りモーション
  const stageW = stage.clientWidth, stageH = stage.clientHeight;
  const sr = stage.getBoundingClientRect();
  const er = user.el.getBoundingClientRect();
  const curLeft = er.left - sr.left, curTop = er.top - sr.top;
  const cw = er.width || user.el.offsetWidth, ch = er.height || user.el.offsetHeight;
  // transform:scale(3) は要素の DOM サイズを変えずに視覚的に3倍に拡大するため、
  // 中心を stage 中央に合わせるには left=stageW/2-cw/2, top=stageH/2-ch/2 とする
  const tgtLeft = Math.round(stageW / 2 - cw / 2), tgtTop = Math.round(stageH / 2 - ch / 2);
  // 現在位置をピクセル固定（bottomをautoに）
  user.el.style.transition = 'none';
  user.el.style.bottom = 'auto';
  user.el.style.left = curLeft + 'px'; user.el.style.top = curTop + 'px';
  user.el.style.zIndex = '75';
  // Phase 1: 目標逆方向へ軽く引く（抵抗感）
  void user.el.offsetWidth;
  const pullLeft = curLeft - (tgtLeft - curLeft) * 0.07;
  const pullTop  = curTop  - (tgtTop  - curTop)  * 0.07;
  user.el.style.transition = 'left 0.15s ease-out, top 0.15s ease-out';
  user.el.style.left = pullLeft + 'px'; user.el.style.top = pullTop + 'px';
  // Phase 2: バネで中央にスナップ＋ scale(3) で3倍拡大
  setTimeout(() => {
    if (!user.el || _agruShieldChar !== user) return;
    user.el.style.transition = [
      'left      0.70s cubic-bezier(0.25, 0, 0.1, 1.45)',
      'top       0.70s cubic-bezier(0.25, 0, 0.1, 1.45)',
      'transform 0.65s cubic-bezier(0.25, 0, 0.1, 1.25)',
    ].join(', ');
    user.el.style.left = tgtLeft + 'px'; user.el.style.top = tgtTop + 'px';
    user.el.style.transform = 'scale(2)';
    user.el.classList.add('agru-shield-char');
  }, 160);

  _agruAddSystemMsg(`🛡️ ${user.name || '名無し'} が盾になった！（仮想HP: ${(agruBattleConfig?.shieldMaxHp ?? 99999).toLocaleString()}）攻撃は盾キャラに当たる！`);
  // 盾HP表示：アニメーション完了後に表示
  setTimeout(() => { if (_agruShieldChar === user) _agruUpdateShieldHpDisplay(); }, 900);

  if (_agruShieldTimer) clearTimeout(_agruShieldTimer);
  _agruShieldTimer = setTimeout(() => {
    if (_agruShieldChar === user) _agruReleaseShield();
  }, 30000);
}

function _agruUpdateShieldHpDisplay() {
  let el = document.getElementById('_agruShieldHpDisplay');
  if (!_agruShieldChar) { el?.remove(); return; }

  const MAX_HP = agruBattleConfig?.shieldMaxHp ?? 99999;
  const pct = Math.max(0, _agruShieldHp / MAX_HP);
  // 六角形の縦幅（尖頭型） y:6〜122 = 116px
  const HEX_TOP = 6, HEX_BOT = 122, HEX_H = HEX_BOT - HEX_TOP; // 116
  const fillH = Math.round(HEX_H * pct);
  const fillY = HEX_BOT - fillH;

  if (!el) {
    el = document.createElement('div');
    el.id = '_agruShieldHpDisplay';
    el.style.cssText = 'position:absolute;z-index:76;pointer-events:none;';
    el.innerHTML = `
      <svg width="120" height="128" viewBox="0 0 120 128" opacity="0.6"
        style="filter:drop-shadow(0 0 6px #3b82f6)">
        <defs>
          <clipPath id="shieldHexClip">
            <polygon points="60,6 110,35 110,93 60,122 10,93 10,35"/>
          </clipPath>
        </defs>
        <polygon points="60,6 110,35 110,93 60,122 10,93 10,35"
          fill="rgba(10,20,50,0.7)"/>
        <rect id="_shieldHpFillRect" x="0" y="${fillY}" width="120" height="${fillH}"
          fill="#3b82f6" opacity="0.45" clip-path="url(#shieldHexClip)"/>
        <polygon points="60,6 110,35 110,93 60,122 10,93 10,35"
          fill="none" stroke="#60a5fa" stroke-width="2"/>
        <text id="_shieldHpText" x="60" y="65" text-anchor="middle"
          dominant-baseline="middle" fill="white" font-size="15" font-weight="bold"
          font-family="monospace">${_agruShieldHp.toLocaleString()}</text>
      </svg>`;
    stage.appendChild(el);
    // 盾キャラの右横に配置（scale(2): 視覚右端 = stageW/2 + cw/2*2 = stageW/2 + cw）
    const sc = _agruShieldChar;
    const sw = stage.clientWidth, sh = stage.clientHeight;
    if (sc?.el) {
      const cw = sc.el.offsetWidth, ch = sc.el.offsetHeight;
      const visualRightX = sw / 2 + cw;      // scale(2) の視覚右端
      const visualCenterY = sh / 2;
      el.style.left = (visualRightX + 12) + 'px';
      el.style.top  = (visualCenterY - 64) + 'px'; // 六角形高さ128の中央合わせ
    } else {
      el.style.left = (sw / 2 + 60) + 'px';
      el.style.top  = (sh / 2 - 64) + 'px';
    }
    return;
  }

  // 更新のみ
  const fillRect = document.getElementById('_shieldHpFillRect');
  if (fillRect) {
    fillRect.setAttribute('y', String(fillY));
    fillRect.setAttribute('height', String(fillH));
  }
  const txt = document.getElementById('_shieldHpText');
  if (txt) txt.textContent = _agruShieldHp.toLocaleString();
}

function _agruReleaseShield(skipPositionRestore = false) {
  const user = _agruShieldChar;
  if (!user) return;
  _agruShieldChar = null;
  _agruShieldHp   = 0;
  if (_agruShieldTimer) { clearTimeout(_agruShieldTimer); _agruShieldTimer = null; }
  document.getElementById('_agruShieldHpDisplay')?.remove();

  if (skipPositionRestore) {
    // 盾破壊による死亡: 位置はそのまま中央に残す。スタイルだけ後始末
    if (user.el) user.el.classList.remove('agru-shield-char');
    delete user._shieldSavedStyle;
    return;
  }

  if (user.el && user._shieldSavedStyle) {
    const s = user._shieldSavedStyle;
    user.el.style.transition = 'left 0.4s ease, top 0.4s ease, transform 0.4s ease';
    user.el.style.left      = s.left;
    user.el.style.top       = s.top;
    user.el.style.bottom    = s.bottom;
    user.el.style.transform = s.transform;
    user.el.style.zIndex    = s.zIndex;
    user.el.classList.remove('agru-shield-char');
    setTimeout(() => { if (user.el) user.el.style.transition = s.transition; }, 500);
    delete user._shieldSavedStyle;
    _agruAddSystemMsg(`🔓 ${user.name || '名無し'} が盾から解放された！`);
  }
}

function _agruGlassShatterEffect() {
  const bossEl = document.getElementById('agruBattleCharImg');
  if (!bossEl) return;
  const r = bossEl.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top  + r.height / 2;

  const canvas = document.createElement('canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;width:100vw;height:100vh';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const COUNT = 28;
  const shards = [];
  for (let i = 0; i < COUNT; i++) {
    const angle = (Math.PI * 2 * i / COUNT) + (Math.random() - 0.5) * 0.7;
    const speed = 5 + Math.random() * 10;
    const size  = 10 + Math.random() * 26;
    const nPts  = Math.random() < 0.35 ? 4 : 3;
    const verts = [];
    for (let j = 0; j < nPts; j++) {
      const a = (Math.PI * 2 * j / nPts) + (Math.random() - 0.5) * 0.9;
      const s = size * (0.5 + Math.random() * 0.7);
      verts.push([Math.cos(a) * s, Math.sin(a) * s]);
    }
    shards.push({
      x:   cx + (Math.random() - 0.5) * r.width  * 0.5,
      y:   cy + (Math.random() - 0.5) * r.height * 0.5,
      vx:  Math.cos(angle) * speed,
      vy:  Math.sin(angle) * speed - 3,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.25,
      alpha: 0.65 + Math.random() * 0.35,
      verts,
    });
  }

  const start = performance.now();
  const DURATION = 1400;
  (function frame(now) {
    const t = (now - start) / DURATION;
    if (t >= 1) { canvas.remove(); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const fade = t < 0.3 ? 1 : 1 - (t - 0.3) / 0.7;
    for (const s of shards) {
      s.x  += s.vx; s.y += s.vy; s.vy += 0.35; s.rot += s.rotV;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.globalAlpha = s.alpha * fade;
      ctx.beginPath();
      ctx.moveTo(s.verts[0][0], s.verts[0][1]);
      for (let j = 1; j < s.verts.length; j++) ctx.lineTo(s.verts[j][0], s.verts[j][1]);
      ctx.closePath();
      ctx.fillStyle   = 'rgba(190,225,255,0.22)';
      ctx.strokeStyle = 'rgba(255,255,255,0.92)';
      ctx.lineWidth   = 1.3;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    requestAnimationFrame(frame);
  })(performance.now());
}

let _agruDefenseShieldRAF = null;

function _agruDefenseShieldStart() {
  _agruDefenseShieldStop();
  const fig = document.getElementById('agruBattleCharFigure') || document.getElementById('agruBossFigureWrap');
  if (!fig) return;
  const canvas = document.createElement('canvas');
  canvas.id = '_agruDefenseShieldCanvas';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:8';
  fig.appendChild(canvas);

  // ひび割れパターンを事前生成（再現性のある疑似乱数）
  const _prng = s => { s = Math.sin(s) * 43758.5453; return s - Math.floor(s); };
  const CRACK_COUNT = 12;
  const cracks = Array.from({length: CRACK_COUNT}, (_, i) => {
    const segs = [];
    let ra = (i / CRACK_COUNT) * Math.PI * 2 + _prng(i * 7) * 0.8;
    segs.push({rx: Math.cos(ra) * 0.92, ry: Math.sin(ra) * 0.92});
    for (let j = 0; j < 5; j++) {
      const prevR = Math.sqrt(segs[segs.length-1].rx**2 + segs[segs.length-1].ry**2);
      const nr = prevR - (0.08 + _prng(i * 31 + j * 13) * 0.18);
      if (nr < 0.05) break;
      ra += (_prng(i * 53 + j * 97) - 0.5) * 0.9;
      segs.push({rx: Math.cos(ra) * nr, ry: Math.sin(ra) * nr});
    }
    return segs;
  });

  let lastTs = null, t = 0, hitFlash = 0, prevDmgAccum = _agruDefenseDmgAccum;

  const hexPath = (ctx, cx, cy, r, rot) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = rot + i * Math.PI / 3;
      i === 0 ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
              : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    ctx.closePath();
  };

  const loop = (ts) => {
    if (!_agruDefenseActive) { _agruDefenseShieldStop(); return; }
    _agruDefenseShieldRAF = requestAnimationFrame(loop);
    if (lastTs === null) lastTs = ts;
    const dt = Math.min((ts - lastTs) / 1000, 0.05); lastTs = ts;
    t += dt;

    if (_agruDefenseDmgAccum !== prevDmgAccum) { hitFlash = 1; prevDmgAccum = _agruDefenseDmgAccum; }
    hitFlash = Math.max(0, hitFlash - dt * 5);

    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    if (!W || !H) return;
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H * 0.45;
    const r  = Math.min(W, H) * 0.56;   // ← 大きめ
    const dmgRatio = Math.min(1, _agruDefenseDmgAccum / 100);
    const intact = 1 - dmgRatio * 0.55;
    const pulse = (1 + 0.05 * Math.sin(t * 3)) * intact;
    const f = hitFlash;
    const R = r * pulse;

    if (R < 2) return;

    // 背景グラデーション（濃く）
    hexPath(ctx, cx, cy, R, Math.PI / 6);
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    bg.addColorStop(0,   `rgba(59,130,246,${(0.22 + f * 0.14) * intact})`);
    bg.addColorStop(0.6, `rgba(37,99,235,${(0.14 + f * 0.08) * intact})`);
    bg.addColorStop(1,   'rgba(30,64,175,0)');
    ctx.fillStyle = bg; ctx.fill();

    // 外側六角形（ダメージで分割・濃いグロー）
    ctx.save();
    ctx.shadowColor = `rgba(96,165,250,${(0.95 + f * 0.05) * intact})`; ctx.shadowBlur = 30 + f * 18;
    for (let seg = 0; seg < 6; seg++) {
      if (dmgRatio > seg / 6 + 0.05 && _prng(seg * 17 + 3) < dmgRatio * 0.9) continue;
      const a0 = Math.PI / 6 + seg * Math.PI / 3;
      const a1 = a0 + Math.PI / 3;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a0) * R, cy + Math.sin(a0) * R);
      ctx.lineTo(cx + Math.cos(a1) * R, cy + Math.sin(a1) * R);
      ctx.strokeStyle = `rgba(${f > 0.2 ? '220,240,255' : '180,215,255'},${(0.95 + f * 0.05) * intact})`;
      ctx.lineWidth = 3.5; ctx.stroke();
    }
    ctx.restore();

    // 内側回転六角形（ダメージで徐々に消える）
    if (dmgRatio < 0.85) {
      hexPath(ctx, cx, cy, R * 0.70, t * 0.35 + Math.PI / 6);
      ctx.strokeStyle = `rgba(147,197,253,${(0.75 + f * 0.20) * intact})`; ctx.lineWidth = 2; ctx.stroke();
    }
    if (dmgRatio < 0.65) {
      hexPath(ctx, cx, cy, R * 0.45, -t * 0.55 + Math.PI / 6);
      ctx.strokeStyle = `rgba(147,197,253,${(0.70 + f * 0.20) * intact})`; ctx.lineWidth = 2; ctx.stroke();
    }
    if (dmgRatio < 0.45) {
      hexPath(ctx, cx, cy, R * 0.25, t * 1.1 + Math.PI / 6);
      ctx.strokeStyle = `rgba(191,219,254,${(0.80 + f * 0.20) * intact})`; ctx.lineWidth = 2; ctx.stroke();
    }

    // スポーク（ダメージで1本ずつ消える）
    ctx.save();
    ctx.shadowColor = `rgba(191,219,254,0.8)`; ctx.shadowBlur = 12;
    for (let i = 0; i < 6; i++) {
      if (dmgRatio > i / 6 + 0.05 && _prng(i * 23 + 7) < dmgRatio * 0.85) continue;
      const a = Math.PI / 6 + i * Math.PI / 3;
      const x2 = cx + Math.cos(a) * R, y2 = cy + Math.sin(a) * R;
      const g = ctx.createLinearGradient(cx, cy, x2, y2);
      g.addColorStop(0, `rgba(191,219,254,${(0.80 + f * 0.2) * intact})`);
      g.addColorStop(1, `rgba(96,165,250,${(0.25 + f * 0.1) * intact})`);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x2, y2);
      ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.restore();

    // 外頂点ダイヤ（ダメージで欠ける）
    ctx.save();
    ctx.shadowColor = `rgba(219,234,254,1)`; ctx.shadowBlur = 18 + f * 10;
    for (let i = 0; i < 6; i++) {
      if (dmgRatio > i / 6 + 0.05 && _prng(i * 41 + 11) < dmgRatio * 0.9) continue;
      const a = Math.PI / 6 + i * Math.PI / 3;
      const vx = cx + Math.cos(a) * R, vy = cy + Math.sin(a) * R;
      const ds = (13 + f * 6) * intact;
      ctx.beginPath();
      ctx.moveTo(vx, vy - ds); ctx.lineTo(vx + ds * 0.55, vy);
      ctx.lineTo(vx, vy + ds); ctx.lineTo(vx - ds * 0.55, vy);
      ctx.closePath();
      ctx.fillStyle = `rgba(219,234,254,${(1.0) * intact})`; ctx.fill();
    }
    ctx.restore();

    // ひび割れ描画
    const visibleCracks = Math.floor(dmgRatio * CRACK_COUNT);
    if (visibleCracks > 0) {
      ctx.save();
      ctx.shadowColor = 'rgba(255,255,255,0.8)'; ctx.shadowBlur = 5;
      for (let ci = 0; ci < visibleCracks; ci++) {
        const segs = cracks[ci];
        if (segs.length < 2) continue;
        const age = Math.min(1, (dmgRatio - ci / CRACK_COUNT) * CRACK_COUNT);
        ctx.beginPath();
        ctx.moveTo(cx + segs[0].rx * r, cy + segs[0].ry * r);
        for (let si = 1; si < Math.ceil(segs.length * age); si++) {
          ctx.lineTo(cx + segs[si].rx * r, cy + segs[si].ry * r);
        }
        ctx.strokeStyle = `rgba(255,255,255,${0.9 * age})`;
        ctx.lineWidth = 2 - dmgRatio * 0.8;
        ctx.stroke();
        ctx.strokeStyle = `rgba(100,150,255,${0.5 * age})`;
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 中心コアグロー
    if (dmgRatio < 0.95) {
      const cgr = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.35);
      cgr.addColorStop(0,    `rgba(239,246,255,${(0.75 + f * 0.3) * intact})`);
      cgr.addColorStop(0.45, `rgba(147,197,253,${(0.40 + f * 0.1) * intact})`);
      cgr.addColorStop(1,    'rgba(96,165,250,0)');
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = cgr; ctx.fill();
    }

    // ヒット時フラッシュ
    if (f > 0.01) {
      hexPath(ctx, cx, cy, R * 1.04, Math.PI / 6);
      ctx.fillStyle = `rgba(255,255,255,${f * 0.25})`; ctx.fill();
    }
  };
  _agruDefenseShieldRAF = requestAnimationFrame(loop);
}

function _agruDefenseShieldStop() {
  if (_agruDefenseShieldRAF) { cancelAnimationFrame(_agruDefenseShieldRAF); _agruDefenseShieldRAF = null; }
  document.getElementById('_agruDefenseShieldCanvas')?.remove();
}

function _agruActivateDefense() {
  if (_agruDefenseActive) return;
  _agruDefenseActive    = true;
  _agruDefenseDmgAccum  = 0;
  _agruAddSystemMsg('🛡️ 超回復！防御状態に入った…30秒間ほぼ無敵！攻撃をまとめると防御を崩せる！');
  _agruDefenseShieldStart();
  const battleImg = document.getElementById('agruBattleCharImg');
  battleImg?.classList.add('agru-defense');
  // 防御中専用画像に切り替え
  const defImg = agruBattleConfig?.defenseImage;
  if (defImg && battleImg) {
    battleImg.src = `/boss/${encodeURIComponent(defImg)}`;
    updateBossAgruPurupuru();
  }
  if (_agruDefenseTimer) clearTimeout(_agruDefenseTimer);
  _agruDefenseTimer = setTimeout(() => {
    if (!_agruDefenseActive) return;
    _agruDefenseActive = false;
    _agruDefenseTimer  = null;
    _agruDefenseShieldStop();
    document.getElementById('agruBattleCharImg')?.classList.remove('agru-defense');
    // HP別画像に戻す
    _agruLastHpBucket = null;
    _agruUpdateBossImgByHp();
    const heal = Math.floor(agruBattleMaxHP * 0.3);
    agruBattleHP = Math.min(agruBattleMaxHP, agruBattleHP + heal);
    updateAgruBattleHpDisplay();
    _agruAddSystemMsg(`💚 防御解除！HP +${heal} 回復した！`);
  }, 30000);
}

function _agruBreakDefense() {
  if (!_agruDefenseActive) return;
  _agruDefenseActive = false;
  _agruDefenseShieldStop();
  if (_agruDefenseTimer) { clearTimeout(_agruDefenseTimer); _agruDefenseTimer = null; }
  document.getElementById('agruBattleCharImg')?.classList.remove('agru-defense');
  // HP別画像に戻す
  _agruLastHpBucket = null;
  _agruUpdateBossImgByHp();

  _agruGlassShatterEffect();
  new Audio('/sound/boss/' + encodeURIComponent('nc211892_[SE]_盾・鎧が壊れる音・粉砕する音_[高音質].mp3')).play().catch(() => {});

  const penaltyDmg = Math.floor(agruBattleMaxHP * 0.05);
  agruBattleHP = Math.max(0, agruBattleHP - penaltyDmg);
  updateAgruBattleHpDisplay();
  _agruAddSystemMsg(`💥 防御崩壊！HP -${penaltyDmg} ペナルティ！`);
  if (agruBattleHP <= 0 && agruBattleActive) _agruPlayerVictoryIntro();
}

function _agruAnimateSprite(canvas, sp, onDone) {
  const img = new Image();
  img.src = '/sprite/' + sp.path.split('/').map(encodeURIComponent).join('/');
  const ctx = canvas.getContext('2d');
  const cols = sp.cols || 5, rows = sp.rows || 4;
  const frameCount = sp.frameCount || (cols * rows);
  const fps = sp.fps || 10;
  let frame = 0;
  img.onload = () => {
    const fw = img.width / cols, fh = img.height / rows;
    const iv = setInterval(() => {
      const col = frame % cols, row = Math.floor(frame / cols);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, col * fw, row * fh, fw, fh, 0, 0, canvas.width, canvas.height);
      if (++frame >= frameCount) { clearInterval(iv); onDone(); }
    }, 1000 / fps);
  };
  img.onerror = () => onDone();
}

function _agruFocusFireRapid(images, onDone) {
  const el = document.getElementById('agruBattleCharImg');
  if (!el || !images?.length) { onDone?.(); return; }
  const FRAME_MS = 80;
  const CYCLES   = 3;
  const frames   = [];
  for (let c = 0; c < CYCLES; c++) frames.push(...images);
  // プリロード後に開始（最大100ms待機）
  images.forEach(src => { const img = new Image(); img.src = '/boss/' + encodeURIComponent(src); });
  setTimeout(() => {
    let i = 0;
    const tick = () => {
      el.src = '/boss/' + encodeURIComponent(frames[i++]);
      if (i < frames.length) setTimeout(tick, FRAME_MS);
      else setTimeout(() => onDone?.(), FRAME_MS);
    };
    tick();
  }, 100);
}

function _agruBattlePlayEffect(skillId, targets) {
  const cfg = agruBattleConfig?.skills?.[skillId];
  if (!cfg) return;

  if (cfg.sound) {
    const _sa = new Audio('/sound/' + cfg.sound);
    _sa.volume = Math.min(1, ((cfg.soundVolume ?? 100) / 100) * seVolume);
    _sa.play().catch(() => {});
  }

  // ボス側エフェクト（アゲルちゃんの上に固定座標で重ねる）
  if (cfg.bossSprite?.path) {
    const bossImg = document.getElementById('agruBattleCharImg');
    if (bossImg) {
      const r = bossImg.getBoundingClientRect();
      const sp = cfg.bossSprite;
      const size = sp.size || 200;
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      canvas.style.cssText = `position:fixed;left:${r.left + r.width/2 - size/2}px;top:${r.top + r.height/2 - size/2}px;pointer-events:none;z-index:9999`;
      document.body.appendChild(canvas);
      _agruAnimateSprite(canvas, sp, () => canvas.remove());
    }
  }

  // ターゲット側エフェクト（対象キャラの上に stage 相対座標で重ねる）
  if (cfg.sprite?.path) {
    const pts = (Array.isArray(targets) && targets.length > 0)
      ? targets.map(u => _agruCharCenter(u)).filter(Boolean)
      : [{ cx: stage.clientWidth / 2, cy: stage.clientHeight / 2 }];
    const sp = cfg.sprite;
    const size = sp.size || 200;
    pts.forEach(({ cx, cy }) => {
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      canvas.style.cssText = `position:absolute;left:${cx - size/2}px;top:${cy - size/2}px;pointer-events:none;z-index:998`;
      stage.appendChild(canvas);
      _agruAnimateSprite(canvas, sp, () => canvas.remove());
    });
  }

  // ボス画像切替（クロスフェード）
  const bossDefaultPath = agruBattleConfig?.defaultImage
    ? `/boss/${encodeURIComponent(agruBattleConfig.defaultImage)}`
    : null;
  // 防御中なら防御画像、それ以外はデフォルト画像に戻す
  const getRestorePath = () => {
    if (_agruDefenseActive) {
      const d = agruBattleConfig?.defenseImage;
      return d ? `/boss/${encodeURIComponent(d)}` : null;
    }
    return bossDefaultPath;
  };

  // 集中砲火: 連打画像が設定されていれば高速切替
  if (skillId === 'focus_fire' && cfg.rapidImages?.length > 0) {
    _agruFocusFireRapid(cfg.rapidImages, () => {
      const rp = getRestorePath();
      if (rp && agruBattleActive) _bossCrossfadeImg(rp);
    });
    return;
  }

  if (cfg.image) {
    _bossCrossfadeImg(`/boss/${encodeURIComponent(cfg.image)}`, () => {
      setTimeout(() => {
        if (!agruBattleActive) return;
        const rp = getRestorePath();
        if (rp) _bossCrossfadeImg(rp);
      }, 2000);
    });
  } else if (!_agruDefenseActive && bossDefaultPath) {
    _bossCrossfadeImg(bossDefaultPath);
  }
}

function _bossApplyAudioFx(aLv) {
  const fig = document.getElementById('agruBattleCharFigure');
  const cur = document.getElementById('agruBattleCharImg');
  if (!fig || !cur) return;

  // エフェクト用背面レイヤーを取得または初回作成
  let fxImg = document.getElementById('bossAudioFxImg');
  if (!fxImg) {
    fxImg = document.createElement('img');
    fxImg.id  = 'bossAudioFxImg';
    fxImg.alt = '';
    fxImg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;pointer-events:none;z-index:1;display:none';
    fig.insertBefore(fxImg, fig.firstChild);
    // figureに独立したスタッキングコンテキストを与える
    fig.style.isolation = 'isolate';
    // クリーン画像（元）を最前面に（ぷるぷるcanvasはz-index:3で既に上）
    cur.style.position = 'relative';
    cur.style.zIndex   = '2';
  }

  // srcを毎フレーム同期（画像切替後も追従）
  const curSrc = cur.getAttribute('src') || '';
  if (fxImg.getAttribute('src') !== curSrc) fxImg.src = curSrc;

  // 設定値を読む（デフォルト値はハードコードされた元の値）
  const nCfg = agruBattleConfig?.noiseEffect || {};
  const NOISE_THRESHOLD = nCfg.threshold  ?? 0.45;
  const N_CA            = nCfg.ca         ?? 14;
  const N_JX            = nCfg.jitterX    ?? 38;
  const N_JY            = nCfg.jitterY    ?? 4;
  const N_BRIGHTNESS    = nCfg.brightness ?? 0.55;
  const N_CONTRAST      = nCfg.contrast   ?? 0.35;

  const intensity = Math.max(0, (aLv - NOISE_THRESHOLD) / (1 - NOISE_THRESHOLD));

  if (!agruBattleActive || intensity <= 0) {
    fxImg.style.display    = 'none';
    fxImg.style.filter     = '';
    fxImg.style.transform  = '';
    return;
  }

  fxImg.style.display = '';

  // 色収差：エフェクト層のみに適用（intensity 基準なので閾値以下はゼロ）
  const ca     = intensity * N_CA;
  const caBlur = intensity * 5;
  const caA    = Math.min(0.75, intensity * 1.6);

  const brightness = 1 + intensity * N_BRIGHTNESS;
  const contrast   = 1 + intensity * N_CONTRAST;

  const hue = intensity > 0.4 && Math.random() < 0.18
    ? (Math.random() - 0.5) * 40 : 0;

  const filters = [
    `drop-shadow(${ca.toFixed(1)}px 0 ${caBlur.toFixed(1)}px rgba(255,30,30,${caA.toFixed(2)}))`,
    `drop-shadow(${(-ca).toFixed(1)}px 0 ${caBlur.toFixed(1)}px rgba(40,110,255,${caA.toFixed(2)}))`,
    `brightness(${brightness.toFixed(2)})`,
    `contrast(${contrast.toFixed(2)})`,
  ];
  if (hue) filters.push(`hue-rotate(${hue.toFixed(0)}deg)`);
  fxImg.style.filter = filters.join(' ');

  // ジッターはエフェクト層のみ（クリーン層は静止したまま）・横方向を強調
  const jx = (Math.random() - 0.5) * intensity * N_JX;
  const jy = (Math.random() - 0.5) * intensity * N_JY;
  fxImg.style.transform = `translate(${jx.toFixed(1)}px,${jy.toFixed(1)}px)`;
}

function _bossClearAudioFx() {
  const fxImg = document.getElementById('bossAudioFxImg');
  if (fxImg) {
    fxImg.style.display   = 'none';
    fxImg.style.filter    = '';
    fxImg.style.transform = '';
  }
  const fig = document.getElementById('agruBattleCharFigure');
  if (fig) fig.style.isolation = '';
  const cur = document.getElementById('agruBattleCharImg');
  if (cur) { cur.style.position = ''; cur.style.zIndex = ''; }
}

function _bossCrossfadeImg(newSrc, onDone) {
  const fig = document.getElementById('agruBattleCharFigure');
  const cur = document.getElementById('agruBattleCharImg');
  if (!fig || !cur || !newSrc) { if (onDone) onDone(); return; }
  const curSrc = cur.getAttribute('src') || '';
  if (curSrc === newSrc || curSrc.endsWith(newSrc)) { if (onDone) onDone(); return; }

  fig.style.transition = 'opacity 0.22s ease';
  fig.style.opacity = '0';

  setTimeout(() => {
    cur.src = newSrc;
    updateBossAgruPurupuru();
    const show = () => {
      fig.style.opacity = '1';
      fig.addEventListener('transitionend', () => {
        fig.style.transition = '';
        fig.style.opacity = '';
        if (onDone) onDone();
      }, { once: true });
    };
    if (cur.complete && cur.naturalWidth) show();
    else { cur.onload = show; cur.onerror = show; }
  }, 230);
}

function _agruBattleDoCounter(forceSkillId) {
  if (!agruBattleActive) return;
  const skill  = forceSkillId
    ? (AGRU_BATTLE_SKILLS.find(s => s.id === forceSkillId) || { id: forceSkillId })
    : _agruBattlePickSkill();
  const alive  = _agruBattleGetAliveUsers();
  const bossAtk = 5 + Math.max(0, Math.floor((1 - agruBattleHP / agruBattleMaxHP) * 5));
  window._bossEfx?.onAttack();

  switch (skill.id) {
    case 'normal': {
      _agruAddSystemMsg(`😡 アゲルちゃんの通常攻撃！全員に ${bossAtk} ダメージ！`);
      alive.forEach(u => { const wasKo = u.ko; damageUser(u, bossAtk); if (!wasKo && u.ko) _agruBattleKillUser(u); });
      _agruBattlePlayEffect(skill.id, alive);
      _agruBattleGetSpeech('normal');
      break;
    }
    case 'focus_fire': {
      const target = alive[Math.floor(Math.random() * alive.length)];
      if (!target) break;
      const dmg = bossAtk * 5;
      _agruAddSystemMsg(`🎯 集中砲火！${target.name || '名無し'} に ${dmg} ダメージ！`);
      const wasKoFF = target.ko;
      damageUser(target, dmg);
      if (!wasKoFF && target.ko) _agruBattleKillUser(target);
      _agruBattlePlayEffect(skill.id, [target]);
      _agruBattleGetSpeech('focus_fire');
      break;
    }
    case 'all_attack': {
      const dmg = bossAtk * 2;
      _agruAddSystemMsg(`💥 全体乱打！全員に ${dmg} ダメージ！`);
      alive.forEach(u => { const wasKo = u.ko; damageUser(u, dmg); if (!wasKo && u.ko) _agruBattleKillUser(u); });
      _agruBattlePlayEffect(skill.id, alive);
      _agruBattleGetSpeech('all_attack');
      break;
    }
    case 'instant_kill': {
      const target = alive[Math.floor(Math.random() * alive.length)];
      if (!target) break;
      _agruAddSystemMsg(`☠️ 即死撃！${target.name || '名無し'} を瞬殺！`);
      _agruBattleKillUser(target);
      _agruBattlePlayEffect(skill.id, [target]);
      _agruBattleGetSpeech('instant_kill');
      break;
    }
    case 'mp_absorb': {
      const target = alive[Math.floor(Math.random() * alive.length)];
      if (!target) break;
      const stolen = target.mp || 0;
      target.mp = 0; updateStatsDisplay(target);
      _agruAddSystemMsg(`🌀 MP吸収！${target.name || '名無し'} の MP ${stolen} を全部奪った！`);
      _agruBattlePlayEffect(skill.id, [target]);
      _agruBattleGetSpeech('mp_absorb');
      break;
    }
    case 'all_mp_drain': {
      _agruAddSystemMsg('💸 全体MP吸収！全員のMP -10！');
      alive.forEach(u => { u.mp = Math.max(0, (u.mp || 0) - 10); updateStatsDisplay(u); });
      _agruBattlePlayEffect(skill.id, alive);
      _agruBattleGetSpeech('all_mp_drain');
      break;
    }
    case 'petrify': {
      const target = alive[Math.floor(Math.random() * alive.length)];
      if (!target) break;
      const eff = agruBattleStatusEffects.get(target.ipid) || {};
      eff.stoneUntil = Date.now() + 60000;
      agruBattleStatusEffects.set(target.ipid, eff);
      _agruAddSystemMsg(`🗿 石化！${target.name || '名無し'} が60秒間攻撃不能！`);
      _agruBattlePlayEffect(skill.id, [target]);
      _agruBattleGetSpeech('petrify');
      break;
    }
    case 'sleep': {
      const target = alive[Math.floor(Math.random() * alive.length)];
      if (!target) break;
      const eff = agruBattleStatusEffects.get(target.ipid) || {};
      eff.sleepUntil = Date.now() + 30000;
      agruBattleStatusEffects.set(target.ipid, eff);
      _agruSetStatusIcon(target, 'sleep');
      _agruAddSystemMsg(`💤 眠り！${target.name || '名無し'} が30秒間攻撃不能！`);
      _agruBattlePlayEffect(skill.id, [target]);
      _agruBattleGetSpeech('sleep');
      break;
    }
    case 'charm': {
      const target = alive[Math.floor(Math.random() * alive.length)];
      if (!target) break;
      const eff = agruBattleStatusEffects.get(target.ipid) || {};
      eff.charmedUntil = Date.now() + 30000;
      agruBattleStatusEffects.set(target.ipid, eff);
      _agruSetStatusIcon(target, 'charm');
      _agruAddSystemMsg(`💕 魅了！${target.name || '名無し'} が30秒間味方になった！（攻撃が回復に）`);
      _agruBattlePlayEffect(skill.id, [target]);
      _agruBattleGetSpeech('charm');
      break;
    }
    case 'curse': {
      const target = alive[Math.floor(Math.random() * alive.length)];
      if (!target) break;
      const eff = agruBattleStatusEffects.get(target.ipid) || {};
      eff.curseUntil = Date.now() + 60000;
      agruBattleStatusEffects.set(target.ipid, eff);
      _agruAddSystemMsg(`🩸 呪い！${target.name || '名無し'} のダメージが60秒間半減！`);
      _agruBattlePlayEffect(skill.id, [target]);
      _agruBattleGetSpeech('curse');
      break;
    }
    case 'self_heal': {
      const healAmt = 200;
      agruBattleHP = Math.min(agruBattleMaxHP, agruBattleHP + healAmt);
      updateAgruBattleHpDisplay();
      _agruAddSystemMsg(`💚 自己回復！HP +${healAmt}！`);
      _agruBattlePlayEffect(skill.id, null);
      _agruBattleGetSpeech('self_heal');
      break;
    }
    case 'berserk': {
      agruBattleBerserkUntil = Date.now() + 30000;
      _agruAddSystemMsg('🔥 バーサーク！30秒間ダメージ無効！');
      _agruBattlePlayEffect(skill.id, null);
      _agruBattleGetSpeech('berserk');
      break;
    }
    case 'super_heal': {
      if (_agruDefenseActive) break; // 既に防御中
      _agruActivateDefense();
      _agruBattlePlayEffect(skill.id, null);
      _agruBattleGetSpeech('super_heal');
      break;
    }
    case 'shield_char': {
      if (_agruShieldChar) break; // 既に盾発動中
      const target = alive[Math.floor(Math.random() * alive.length)];
      if (!target) break;
      _agruActivateShield(target);
      _agruBattlePlayEffect(skill.id, [target]);
      _agruBattleGetSpeech('shield_char');
      break;
    }
    case 'delete_char': {
      const target = alive[Math.floor(Math.random() * alive.length)];
      if (!target) break;
      _agruAddSystemMsg(`🗑️ デリート攻撃！${target.name || '名無し'} が消滅する…`);
      if (target.el) target.el.classList.add('agru-float-delete');
      _agruBattlePlayEffect(skill.id, [target]);
      _agruBattleGetSpeech('delete_char');
      setTimeout(() => _agruBattleKillUser(target), 2000);
      break;
    }
  }
}

function _agruBattleGetSpeech(skillId) {
  const text = (
    agruBattleConfig?.skills?.[skillId]?.speech ||
    agruBattleConfig?.[skillId + 'Speech'] ||
    ''
  ).trim();
  if (!text) return;
  _agruPlayVoicevox(text);
  _agruBattleShowSpeechBubble(text);
}

function _agruBattleShowSpeechBubble(text) {
  const el = document.getElementById('agruBattleSpeechBubble');
  if (!el) return;
  el.textContent = text;
  el.style.display = 'block';
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => { el.style.display = 'none'; el.style.opacity = ''; }, 500);
  }, 6000);
}

// ══════════════════════════════════════════════════════════════════

function _agruGetAffinityContext() {
  const lv = Math.round(agruAffinity);
  let desc;
  if      (lv >= 90) desc = 'とても高い。甘えるように愛しさを込めて接してください。';
  else if (lv >= 70) desc = '高い。好意的に、温かく笑顔で接してください。';
  else if (lv >= 40) desc = '普通。自然に接してください。';
  else if (lv >= 20) desc = 'やや低い。少し素っ気なく冷たく接してください。';
  else               desc = 'とても低い。不機嫌に、短く冷たく、時に嫌悪感をにじませてください。';
  return `現在のリスナーさんへの好感度: ${lv}/100（${desc}）`;
}

function _agruGetStateContext() {
  const parts = [];
  if (agruHunger <= 30)       parts.push('あなたは今、極度の空腹で生命の危機に瀕しています。その苦しさを返答に含めてください。');
  else if (agruHunger <= 50)  parts.push('あなたは今、お腹がすいています。空腹であることを返答に含めてください。');
  if (agruSleepiness > 90)    parts.push('あなたは今、極度に眠いです。眠いことを返答に含めてください。');
  if (agruLibido > 80)        parts.push('あなたは今、強烈な性的欲求に支配されています。返答は性欲まみれになります。♡マークを使う。');
  if (_agruPoisonTurns > 0)   parts.push('あなたはリスナーに毒を投与されました。体が激しく震え、視界が歪み、今にも死にそうなほど苦しいです。相手のコメント内容は無視して構いません。とにかく死にたくない・助けて・誰か解毒剤を！という叫び・パニック・発狂・命乞いだけを返答に出してください。助けてくれるなら何でもする、死なせないでと必死に命乞いしてください。リスナーへの感謝や敬意は一切不要。ただ恐怖と苦しさで狂乱してください。顔文字は使わないこと。');
  return parts.join(' ');
}

function _agruUpdateParams(message) {
  const prevHunger = agruHunger;
  const prevSleep  = agruSleepiness;
  if (/肉投与/.test(message))    agruHunger     = Math.min(100, agruHunger + 30);
  if (/寿司投与/.test(message))   agruHunger     = Math.min(100, agruHunger + 20);
  if (/たばこ投与/.test(message))  agruHunger     = Math.min(100, agruHunger + 10);
  if (/起きろ/.test(message))     agruSleepiness = Math.max(0,   agruSleepiness - 10);
  if (/たばこ/.test(message))     agruSleepiness = Math.max(0,   agruSleepiness - 10);
  if (/エナドリ/.test(message))    agruSleepiness = Math.max(0,   agruSleepiness - 30);
  _agruUpdateHungerDisplay(agruHunger - prevHunger);
  _agruUpdateSleepDisplay(agruSleepiness - prevSleep);
}

async function _agruShowStateImage(state) {
  try {
    const res  = await fetch(`/api/ageru-images/${state}`);
    const data = await res.json();
    const imgs = (data.images || []);
    if (imgs.length > 0) {
      _agruSlideImage(`/ageru/${state}/${imgs[Math.floor(Math.random() * imgs.length)]}`);
    }
  } catch {}
}

function _agruRevertStateImage() {
  if (agruDefaultImage) _agruSlideImage(`/ageru/${encodeURIComponent(agruDefaultImage)}`);
}

function _agruShowParamPop(text, color, goUp = true) {
  const frame = document.querySelector('.agru-char-frame');
  if (!frame) return;
  const pop = document.createElement('div');
  pop.className = 'agru-param-pop ' + (goUp ? 'up' : 'down');
  pop.textContent = text;
  pop.style.color = color;
  pop.style.top   = '20px';
  pop.style.right = '13px';
  frame.appendChild(pop);
  setTimeout(() => pop.remove(), 2600);
}
function _agruUpdateAffinityDisplay(delta = 0) {
  const el = document.getElementById('agruAffinityDisplay');
  if (!el) return;
  const filled     = Math.round(agruAffinity / 10);
  const prevFilled = Math.round((agruAffinity - delta) / 10);
  let html = '<span style="font-size:15px;margin-top:0">💕</span>';
  for (let i = 0; i < 10; i++) {
    const isOn    = i < filled;
    const isFlash = delta > 0 ? (i >= prevFilled && i < filled) : delta < 0 ? (i >= filled && i < prevFilled) : false;
    html += `<span class="${isOn ? 'agru-heart-on' : 'agru-heart-off'}${isFlash ? ' agru-heart-flash' : ''}">♥</span>`;
  }
  el.innerHTML = html;
  if (delta > 0) _agruShowParamPop('💕 好感度↑', '#f472b6', true);
  else if (delta < 0) _agruShowParamPop('💔 好感度↓', '#9ca3af', false);
}
function _agruUpdateHungerDisplay(delta = 0) {
  const el = document.getElementById('agruHungerDisplay');
  if (!el) return;
  const filled = Math.round(Math.max(0, agruHunger) / 10);
  let html = '<span style="font-size:15px;margin-top:0">🍖</span>';
  for (let i = 0; i < 10; i++)
    html += `<span class="${i < filled ? 'agru-param-hunger-on' : 'agru-param-hunger-off'}">◆</span>`;
  el.innerHTML = html;
  if (delta > 0) _agruShowParamPop('🍖 空腹↓', '#fb923c', false);
  else if (delta < 0) _agruShowParamPop('🍖 空腹↑', '#ef4444', true);
}
function _agruUpdateSleepDisplay(delta = 0) {
  const el = document.getElementById('agruSleepDisplay');
  if (!el) return;
  const filled = Math.round(Math.min(100, agruSleepiness) / 10);
  let html = '<span style="font-size:15px;margin-top:0">💤</span>';
  for (let i = 0; i < 10; i++)
    html += `<span class="${i < filled ? 'agru-param-sleep-on' : 'agru-param-sleep-off'}">●</span>`;
  el.innerHTML = html;
  if (delta > 0) _agruShowParamPop('💤 眠気↑', '#818cf8', true);
  else if (delta < 0) _agruShowParamPop('💤 眠気↓', '#facc15', false);
}
function _agruUpdateLibidoDisplay(delta = 0) {
  const el = document.getElementById('agruLibidoDisplay');
  if (!el) return;
  const filled = Math.round(Math.max(0, agruLibido) / 10);
  let html = '<span style="font-size:15px;margin-top:0">❓</span>';
  for (let i = 0; i < 10; i++)
    html += `<span class="${i < filled ? 'agru-param-libido-on' : 'agru-param-libido-off'}">★</span>`;
  el.innerHTML = html;
  if (delta > 0) _agruShowParamPop('❓↑', '#a78bfa', true);
  else if (delta < 0) _agruShowParamPop('❓↓', '#94a3b8', false);
}

let agruDefaultImage = localStorage.getItem('agruDefaultImage') || '';
let agruEmotionMap = {};
try { agruEmotionMap = JSON.parse(localStorage.getItem('agruEmotionMap') || '{}'); } catch {}
let agruFolderMap = {};
(async () => {
  try {
    const r = await fetch('/api/ageru-emotion-map');
    agruFolderMap = await r.json();
  } catch {}
})();
let agruActive = false;
let agruIdle   = true;
let _agruIdleTimer = null;
let _agruTypeTimer = null;
let _agruConvHistory = [];
let _agruPoisonTurns = 0;

// ── ボスアゲルバトル状態 ─────────────────────────────────────────
let agruBattleActive        = false;
let _agruBattleEntranceDone = false;
let agruBattleHP            = 0;
let _agruLastHpBucket       = null;
let agruBattleMaxHP    = 1000;
let agruBattleEndTime  = 0;
let agruBattleTimerInterval  = null;
let agruBattleCounterTimer   = null;
let agruBattleCounterInterval = 60;
let agruBattleBerserkUntil   = 0;
let agruBattleConfig   = {};
let _agruPlayersWon    = false; // リスナー勝利後はアゲル系画像をキャラプールから除外
let agruBattleStatusEffects  = new Map(); // ipid → { stoneUntil, sleepUntil, charmedUntil, curseUntil }
let _agruBattleKilledIds     = new Set();
let _agruWipePending         = false;
let _agruVictoryPending      = false;
let _agruShieldChar          = null; // 盾キャラ攻撃で選ばれたユーザー
let _agruShieldHp            = 0;
let _agruShieldTimer         = null;
let _agruDefenseActive       = false; // 超回復防御状態
let _agruDefenseDmgAccum     = 0;    // 防御中の累積ダメージ（1hit=1）
let _agruDefenseTimer        = null;
(async () => {
  try {
    const r = await fetch('/api/boss-ageru-config');
    agruBattleConfig = await r.json();
    _applyBossLayoutConfig();
    _applyTimerConfig();
  } catch {}
})();

// 設定画面からのリアルタイムレイアウト更新（BroadcastChannel）
function _bossUIFlyIn() {
  const items = [
    { el: document.getElementById('bossTimerWrap'),    delay:   0 },
    { el: document.getElementById('agruBattleHpWrap'), delay: 160 },
    { el: document.getElementById('agruBattleHpNum'),  delay: 260 },
  ].filter(({ el }) => el && !el.classList.contains('hidden') && el.style.display !== 'none');

  // 全要素を画面上方（開始位置）へ瞬間移動
  items.forEach(({ el }) => {
    const base = el.style.transform || '';
    el._flyInBase = base;
    el.style.transition = 'none';
    el.style.opacity    = '0';
    el.style.transform  = base ? `${base} translateY(-280px)` : 'translateY(-280px)';
  });
  if (items.length) items[0].el.offsetHeight; // 強制リフロー（1回）

  // 各要素を指定位置へ stagger アニメート
  items.forEach(({ el, delay }) => {
    setTimeout(() => {
      el.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.38s ease-out';
      el.style.transform  = el._flyInBase;
      el.style.opacity    = '';
      setTimeout(() => {
        el.style.transition = '';
        delete el._flyInBase;
      }, 800);
    }, delay);
  });
}

function _applyTimerConfig() {
  const timerCfg = agruBattleConfig?.timer;
  const tw = document.getElementById('bossTimerWrap');
  if (tw && timerCfg) {
    if (timerCfg.x !== undefined && timerCfg.x !== '') {
      tw.style.left = timerCfg.x + 'px'; tw.style.transform = 'none';
    } else {
      tw.style.left = '50%'; tw.style.transform = 'translateX(-50%)';
    }
    tw.style.top    = (timerCfg.y ?? 12) + 'px';
    // stage内: ボス(z30)より前=65、後ろ=28
    tw.style.zIndex = timerCfg.behindBoss ? '28' : '65';
  }
  const td = document.getElementById('bossTimerDigits');
  if (td) {
    if (timerCfg?.size) td.style.fontSize = timerCfg.size + 'px';
    td.style.fontFamily = timerCfg?.font || '';
  }
}
// BroadcastChannel は変数に保持しないと GC に回収されリスナーが消えるため window に保持
try {
  window._bossLayoutChannel = new BroadcastChannel('kukuCome_bossLayout');
  window._bossLayoutChannel.onmessage = ({ data }) => {
    if (data.bossChar)  agruBattleConfig.bossChar  = data.bossChar;
    if (data.hpGauge)   agruBattleConfig.hpGauge   = data.hpGauge;
    if (data.battleLog) agruBattleConfig.battleLog = data.battleLog;
    if (data.timer)     agruBattleConfig.timer      = data.timer;
    _applyBossLayoutConfig();
    if (data.timer) _applyTimerConfig();
  };
} catch {}
let agruVoicevoxEnabled = localStorage.getItem('agruVoicevoxEnabled') === '1';
let agruVoicevoxSpeaker = parseInt(localStorage.getItem('agruVoicevoxSpeaker') || '0');
let agruVoicevoxSpeed   = parseFloat(localStorage.getItem('agruVoicevoxSpeed') || '1.0');
let agruVoicevoxVolume  = parseFloat(localStorage.getItem('agruVoicevoxVolume') || '1.0');
let _agruVvAudio = null;
if (!localStorage.getItem('_agruSdSizeReset')) { localStorage.removeItem('agruSdWidth'); localStorage.removeItem('agruSdHeight'); localStorage.setItem('_agruSdSizeReset','1'); }
let agruSdWidth          = parseInt(localStorage.getItem('agruSdWidth'))  || 0;
let agruSdHeight         = parseInt(localStorage.getItem('agruSdHeight')) || 0;
let agruSdSteps          = parseInt(localStorage.getItem('agruSdSteps'))   || 0;
let agruSdCfgScale       = parseFloat(localStorage.getItem('agruSdCfgScale')) || 0;
let agruSdPositiveSuffix = localStorage.getItem('agruSdPositiveSuffix') || '';
let agruYtVolume         = parseInt(localStorage.getItem('agruYtVolume') ?? '100');
let agruBgmVolume        = parseInt(localStorage.getItem('agruBgmVolume') ?? '50');
let agruYtWidth          = parseInt(localStorage.getItem('agruYtWidth')   ?? '435');
let agruYtHeight         = parseInt(localStorage.getItem('agruYtHeight')  ?? '245');
let agruYtOpacity        = parseInt(localStorage.getItem('agruYtOpacity') ?? '100');
let agruYtEnabled        = (localStorage.getItem('agruYtEnabled') ?? '1') === '1';
let agruImgCmdEnabled    = (localStorage.getItem('agruImgCmdEnabled') ?? '1') === '1';
let agruUnloadEnabled    = (localStorage.getItem('agruUnloadEnabled') ?? '1') === '1';
let agruShakeAmp         = parseFloat(localStorage.getItem('agruShakeAmp') ?? '2');
let agruModalZ           = parseInt(localStorage.getItem('agruModalZ')    ?? '300');
let agruYtModalZ         = parseInt(localStorage.getItem('agruYtModalZ')  ?? '400');
let agruModalWidth       = parseInt(localStorage.getItem('agruModalWidth')     ?? '870');
let agruModalHeight      = parseInt(localStorage.getItem('agruModalHeight')    ?? '460');
let agruModalBgOpacity   = parseInt(localStorage.getItem('agruModalBgOpacity') ?? '45');
let agruChatImgSize      = parseInt(localStorage.getItem('agruChatImgSize')    ?? '350');
document.documentElement.style.setProperty('--agru-chat-img-maxh', agruChatImgSize + 'px');
let agruCharImgHeight    = parseInt(localStorage.getItem('agruCharImgHeight')  ?? '360');
document.documentElement.style.setProperty('--agru-char-img-height', agruCharImgHeight + 'px');
let agruCharImgScale     = parseFloat(localStorage.getItem('agruCharImgScale') ?? '1');

function _agruApplyCharScale() {
  const img = document.getElementById('agruCharImg');
  if (!img || img._agruSliding) return;
  const tf = agruCharImgScale !== 1 ? `scale(${agruCharImgScale})` : '';
  img.style.transform = tf;
  const cv = img.parentElement?.querySelector('.puru-canvas');
  if (cv) cv.style.transform = tf;
}
let _agruSelfieLocked    = false;
let agruIdleDelay        = parseInt(localStorage.getItem('agruIdleDelay')) || 10;
let agruIdleDelayImage   = parseInt(localStorage.getItem('agruIdleDelayImage')) || 30;
let agruChatFontSize     = parseInt(localStorage.getItem('agruChatFontSize')) || 14;
let agruChatBold         = localStorage.getItem('agruChatBold') === '1';
if (agruChatBold) document.documentElement.style.setProperty('--agru-font-weight', 'bold');
let agruFontLeft         = localStorage.getItem('agruFontLeft')  || '';
let agruFontRight        = localStorage.getItem('agruFontRight') || '';
if (agruFontLeft)  document.documentElement.style.setProperty('--agru-font-left',  agruFontLeft);
if (agruFontRight) document.documentElement.style.setProperty('--agru-font-right', agruFontRight);

function _agruGetImage(emotion) {
  const files = agruFolderMap[emotion];
  if (files && files.length > 0) {
    const file = files[Math.floor(Math.random() * files.length)];
    return `/ageru/${encodeURIComponent(emotion)}/${encodeURIComponent(file)}`;
  }
  return agruDefaultImage ? `/ageru/${encodeURIComponent(agruDefaultImage)}` : '';
}

function _agruSlideImage(newSrc) {
  const img = document.getElementById('agruCharImg');
  if (!img || !newSrc) return;
  if (img.src.endsWith(newSrc)) return;

  const bg = img.closest('.agru-char-bg');
  if (!bg || img._agruSliding || !img.naturalWidth) {
    img.src = newSrc;
    img.addEventListener('load', updateAgruPurupuru, { once: true });
    return;
  }

  img._agruSliding = true;
  bg.querySelectorAll('.puru-canvas').forEach(c => c.style.display = 'none');

  const clone = document.createElement('img');
  clone.src = img.src;
  clone.alt = '';
  clone.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center top;pointer-events:none;z-index:5;transition:transform 0.35s ease';
  bg.appendChild(clone);

  const _s = agruCharImgScale !== 1 ? `scale(${agruCharImgScale}) ` : '';
  img.style.transition = 'none';
  img.style.transform  = `${_s}translateX(110%)`;
  img.src = newSrc;
  if (agruBattleActive) {
    const _bi = document.getElementById('agruBattleCharImg');
    if (_bi) { _bi.src = newSrc; updateBossAgruPurupuru(); }
  }

  const doSlide = () => {
    requestAnimationFrame(() => {
      clone.style.transform = 'translateX(-110%)';
      img.style.transition  = 'transform 0.35s ease';
      img.style.transform   = `${_s}translateX(0)`;
    });
    clone.addEventListener('transitionend', () => {
      clone.remove();
      img.style.transition = '';
      img._agruSliding     = false;
      _agruApplyCharScale();
      updateAgruPurupuru();
    }, { once: true });
  };

  if (img.complete && img.naturalWidth) doSlide();
  else img.addEventListener('load', doSlide, { once: true });
}

function _agruSetImage(emotion) {
  const url = _agruGetImage(emotion);
  if (!url) return;
  _agruSlideImage(url);
}

function _agruSetStatus(text) {
  const log = document.getElementById('agruChatLog');

  // 既存のインジケーターを消す
  const oldTyping = document.getElementById('agruTypingIndicator');
  if (oldTyping) oldTyping.remove();

  if (text === '返答中...') {
    if (log) {
      const row = document.createElement('div');
      row.className = 'agru-bubble-row agru-bubble-row-left';
      row.id = 'agruTypingIndicator';
      row.innerHTML = '<div class="agru-typing-bubble"><span></span><span></span><span></span></div>';
      log.appendChild(row);
      _agruScrollBottom();
    }
  } else if (text === 'コメント待ち...') {
    if (log) {
      const row = document.createElement('div');
      row.className = 'agru-bubble-row agru-bubble-row-right';
      row.id = 'agruTypingIndicator';
      row.innerHTML = '<div class="agru-typing-bubble agru-typing-bubble-right"><span></span><span></span><span></span></div>';
      log.appendChild(row);
      _agruScrollBottom();
    }
  }
}

function _agruAddImageBubble(dataUrl, prompt, translatedPrompt) {
  const log = document.getElementById('agruChatLog');
  if (!log) return;
  const row = document.createElement('div');
  row.className = 'agru-bubble-row agru-bubble-row-left';
  const wrapper = document.createElement('div');
  wrapper.className = 'agru-bubble-wrapper agru-bubble-wrapper-left';
  const nameEl = document.createElement('div');
  nameEl.className = 'agru-bubble-name';
  nameEl.textContent = 'アゲルちゃん';
  wrapper.appendChild(nameEl);
  const bubble = document.createElement('div');
  bubble.className = 'agru-bubble agru-bubble-left';
  if (agruChatFontSize !== 14) bubble.style.fontSize = agruChatFontSize + 'px';
  if (agruFontLeft) bubble.style.fontFamily = agruFontLeft;
  const img = document.createElement('img');
  img.src = dataUrl;
  img.className = 'agru-photo-img';
  img.addEventListener('load', () => {
    const cfg = _sdReadSettings();
    const _mosaicHit = prompt ? _sdNeedsMosaic(prompt, translatedPrompt || prompt, cfg.mosaicKeywords) : null;
    if (_mosaicHit) {
      _agruLog('🔲 モザイク適用: キーワード「' + _mosaicHit + '」 / prompt: ' + (translatedPrompt || prompt).slice(0, 60));
      _applyMosaic(img, cfg.mosaicBlock);
    } else {
      _agruLog('🖼 モザイクなし / keywords: ' + (cfg.mosaicKeywords || '未設定'));
    }
    _agruScrollBottom();
  }, { once: true });
  bubble.appendChild(img);
  wrapper.appendChild(bubble);
  row.appendChild(wrapper);
  log.appendChild(row);
  _agruTrimLog();
  _agruScrollBottom();
}

const _agruCharTags_DEFAULT = '<lora:Cosmic Princess Kaguya anime [Style]-Illus:1.3>,(burgundy hair:1.3),(aegyo sal:1.2),blue eyes,grey eyes,multicolored eyes,red eyeliner,(colored inner hair:1.2),long hair,(white streaked hair white streaked bangs:1.2),Cosmic Princess Kaguya anime Style,anime coloring,star jewelry,hat,long hair,black bow,cat ears,bangs,necklace,bowtie,cross,fang,two side up,lower eyelashes,white streaked hair,eyelashes,blush,(wind:1.3),cleavage,virtual youtuber,miniskirt,thighhighs,garter straps,huge breasts,earrings,detailed,1girl,wide hips,narrow waist,shiny skin,hair ribbon,perky breasts,cross hair ornament,ring,star \\(symbol\\),__expression__,__zidoriPose__,__background__,looking at viewer';
let agruCharTags = localStorage.getItem('agruCharTags') || _agruCharTags_DEFAULT;

async function _agruGenerateSDImageFromReply(replyText, isSelfie = false) {
  _agruLog('📷 SDプロンプト生成中...');
  const content =
    `以下のセリフをもとに、Stable Diffusionの画像生成プロンプトを英語タグのみ1行で出力してください。` +
    `人物が写る場合はポーズ・表情・アクション・背景・カメラアングル・ライティングのタグのみを出力し、外見（髪・目・体型）タグは出力しないでください。` +
    `物・風景・食べ物など人物不要の場合は人物タグを一切含めず対象物のみを出力してください。` +
    `プロンプト以外は一切出力しないでください。\n\nセリフ: ${replyText}`;
  try {
    const res = await fetch('/api/ai-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content }],
        model: aiModel,
        system: 'You are a Stable Diffusion prompt generator. Output ONLY English prompt tags separated by commas, nothing else. For CHARACTER scenes: output ONLY pose, expression, action, background, lighting, camera angle tags — do NOT output any appearance/hair/eye/body tags. For OBJECT/LANDSCAPE scenes: output only the subject without any human tags.',
      }),
    });
    const data = await res.json();
    if (data.error) { _agruLog('📷 SDプロンプト生成エラー: ' + data.error, 'err'); return; }
    let sdPrompt = data.reply.trim().replace(/^["'`]|["'`]$/g, '');

    if (isSelfie) {
      // 自撮りコマンド → 常にキャラタグ+selfie poseを前置
      const stripped = sdPrompt
        .replace(/\b(1girl|1boy|2girls|girl|woman|man|person|human|character)\b,?\s*/gi, '')
        .replace(/^[, ]+|[, ]+$/g, '');
      sdPrompt = agruCharTags + (stripped ? ', ' + stripped : '');
    } else {
      // 人物タグ or 表情タグが含まれるなら固定キャラタグを前置（表情があれば人物がいる）
      const personRe = /\b(1girl|1boy|2girls|girl|woman|man|person|human|character|selfie|portrait|anime|smile|smiling|grin|happy|sad|crying|tears|angry|frown|surprised|shocked|laughing|wink|winking|blush|blushing|pout|embarrassed|nervous|expressionless|open mouth|closed eyes|looking at viewer|looking at camera)\b/i;
      if (personRe.test(sdPrompt) || personRe.test(replyText)) {
        const stripped = sdPrompt
          .replace(/\b(1girl|1boy|2girls|girl|woman|man|person|human|character)\b,?\s*/gi, '')
          .replace(/^[, ]+|[, ]+$/g, '');
        sdPrompt = agruCharTags + (stripped ? ', ' + stripped : '');
      }
    }

    _agruLog('📷 SDプロンプト: ' + sdPrompt);
    _agruGenerateSDImage(sdPrompt);
  } catch (e) {
    _agruLog('📷 SDプロンプト生成例外: ' + e.message, 'err');
  }
}

async function _agruGenerateSDImage(prompt) {
  const cfg = _sdReadSettings();
  const _w = parseInt(localStorage.getItem('agruSdWidth'))  || cfg.width;
  const _h = parseInt(localStorage.getItem('agruSdHeight')) || cfg.height;
  _agruLog('📷 画像生成中: ' + prompt + ' (' + _w + 'x' + _h + ')');
  try {
    const res = await fetch('/api/sd-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        charName:       'アゲルちゃん',
        width:          _w,
        height:         _h,
        steps:          agruSdSteps    || cfg.steps,
        cfgScale:       agruSdCfgScale || cfg.cfgScale,
        sampler:        cfg.sampler,
        positiveSuffix: agruSdPositiveSuffix !== '' ? agruSdPositiveSuffix : cfg.positiveSuffix,
        negative:       cfg.negative,
      }),
    });
    const data = await res.json();
    if (data.error) { _agruLog('📷 SD生成エラー: ' + data.error, 'err'); return; }
    _agruAddImageBubble(data.image, prompt, data.translatedPrompt || prompt);
    _agruLog('📷 画像生成完了', 'ok');
  } catch (e) {
    _agruLog('📷 SD生成例外: ' + e.message, 'err');
  }
}

function _agruScrollBottom() {
  const log = document.getElementById('agruChatLog');
  if (log) requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; });
}

const _agruBgm = new Audio('/ageru/oto/bgm.mp3');
_agruBgm.volume = 0;
_agruBgm.addEventListener('ended', () => {
  if (!_agruBgm.paused) return;
  _agruBgm.currentTime = 0;
  _agruBgm.play().catch(() => {});
});
let _agruBgmFadeTimer = null;
const _AGRU_BGM_FADEIN_MS  = 2000;
const _AGRU_BGM_FADEOUT_MS = 1000;
const _AGRU_BGM_STEP_MS = 30;

function _agruBgmFadeIn() {
  clearInterval(_agruBgmFadeTimer);
  _agruBgm.volume = 0;
  _agruBgm.play().catch(() => {});
  const target = agruBgmVolume / 100;
  const steps  = _AGRU_BGM_FADEIN_MS / _AGRU_BGM_STEP_MS;
  const delta  = target / steps;
  _agruBgmFadeTimer = setInterval(() => {
    const next = Math.min(_agruBgm.volume + delta, target);
    _agruBgm.volume = next;
    if (next >= target) clearInterval(_agruBgmFadeTimer);
  }, _AGRU_BGM_STEP_MS);
}

function _agruBgmFadeOut(onDone) {
  clearInterval(_agruBgmFadeTimer);
  const start = _agruBgm.volume;
  const steps = _AGRU_BGM_FADEOUT_MS / _AGRU_BGM_STEP_MS;
  const delta = start / steps;
  _agruBgmFadeTimer = setInterval(() => {
    const next = Math.max(_agruBgm.volume - delta, 0);
    _agruBgm.volume = next;
    if (next <= 0) {
      clearInterval(_agruBgmFadeTimer);
      onDone();
    }
  }, _AGRU_BGM_STEP_MS);
}

function _agruBgmPlay()  { _agruBgmFadeIn(); }
function _agruBgmPause() { _agruBgmFadeOut(() => { _agruBgm.pause(); }); }
function _agruBgmStop()  { _agruBgmFadeOut(() => { _agruBgm.pause(); _agruBgm.currentTime = 0; }); }

const _agruPopAudio = new Audio('/ageru/oto/pop.mp3');
_agruPopAudio.volume = 0.5;
function _agruPlayPopSound() {
  const a = _agruPopAudio.cloneNode();
  a.volume = _agruPopAudio.volume;
  a.play().catch(e => console.warn('[agru] pop sound error:', e));
}

function _agruTrimLog() {
  const log = document.getElementById('agruChatLog');
  if (!log) return;
  const rows = [...log.children].filter(el => el.id !== 'agruTypingIndicator');
  while (rows.length > 10) rows.shift().remove();
}

function _agruBattleLog(text) {
  const log = document.getElementById('agruBattleLog');
  if (!log) return;
  const el = document.createElement('div');
  el.className = 'agru-battle-log-entry';
  el.textContent = text;
  log.appendChild(el);
  // 古いエントリを削除（最大20件）
  while (log.children.length > 5) log.removeChild(log.firstChild);
  log.scrollTop = log.scrollHeight;
}

function _agruAddSystemMsg(text) {
  if (agruBattleActive) { _agruBattleLog(text); return; }
  const log = document.getElementById('agruChatLog');
  if (!log) return;
  const el = document.createElement('div');
  el.className = 'agru-system-msg';
  el.textContent = text;
  log.appendChild(el);
  _agruTrimLog();
  _agruScrollBottom();
}

function _agruAddBubble(side, name, text, onDone) {
  const log = document.getElementById('agruChatLog');
  if (!log) { onDone?.(); return; }

  const row = document.createElement('div');
  row.className = `agru-bubble-row agru-bubble-row-${side}`;

  const wrapper = document.createElement('div');
  wrapper.className = `agru-bubble-wrapper agru-bubble-wrapper-${side}`;

  if (name) {
    const nameEl = document.createElement('div');
    nameEl.className = 'agru-bubble-name';
    nameEl.textContent = name;
    wrapper.appendChild(nameEl);
  }

  const bubble = document.createElement('div');
  bubble.className = `agru-bubble agru-bubble-${side}`;
  if (agruChatFontSize !== 14) bubble.style.fontSize = agruChatFontSize + 'px';
  const _font = side === 'left' ? agruFontLeft : agruFontRight;
  if (_font) bubble.style.fontFamily = _font;

  const textEl = document.createElement('span');
  bubble.appendChild(textEl);
  wrapper.appendChild(bubble);
  row.appendChild(wrapper);
  log.appendChild(row);
  _agruTrimLog();
  _agruScrollBottom();
  _agruPlayPopSound();

  if (onDone === undefined) {
    textEl.textContent = text;
    return;
  }

  clearInterval(_agruTypeTimer);
  const cursorEl = document.createElement('span');
  cursorEl.className = 'agru-cursor';
  cursorEl.textContent = '▋';
  bubble.appendChild(cursorEl);

  let i = 0;
  const chars = [...text];
  _agruTypeTimer = setInterval(() => {
    if (i < chars.length) {
      textEl.textContent += chars[i++];
      log.scrollTop = log.scrollHeight;
    } else {
      clearInterval(_agruTypeTimer);
      cursorEl.remove();
      onDone?.();
    }
  }, 45);
}

async function _agruPlayVoicevox(text) {
  if (!agruVoicevoxEnabled || !text) return;
  text = text.replace(/[（(][^）)]*[）)]/g, '').trim();
  if (!text) return;
  try {
    const res = await fetch('/api/voicevox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, speaker: agruVoicevoxSpeaker, speedScale: agruVoicevoxSpeed }),
    });
    const data = await res.json();
    if (data.error) { console.warn('[VoiceVox]', data.error); return; }
    if (_agruVvAudio) { _agruVvAudio.pause(); _agruVvAudio = null; }
    const audio = new Audio(data.audio);
    audio.volume = agruVoicevoxVolume;
    _agruVvAudio = audio;
    audio.play().catch(() => {});
    audio.onended = () => { if (_agruVvAudio === audio) _agruVvAudio = null; };
  } catch (e) {
    console.warn('[VoiceVox]', e.message);
  }
}

function _agruLog(msg, type) {
  console.log('[アゲルちゃん]', msg);
  const _m = { type: 'agruLog', msg: String(msg), logType: type || '' };
  if (_adminWs?.readyState === WebSocket.OPEN) _adminWs.send(JSON.stringify(_m));
  else _adminBC.postMessage(_m);
}

function _isAgruSkipCmd(msg) {
  const m = msg.trim();
  // 明示的コマンド
  if (/ペットガチャ/.test(m))        return true; // 10連も含む
  if (/スロット/.test(m))             return true;
  if (/ランダムタイマン/.test(m))     return true;
  if (/^タイマン[：:]/.test(m))       return true;
  if (/AFK|ＡＦＫ/i.test(m))         return true;
  if (/^(?:放置|無明)[：:]/.test(m))  return true;
  if (/射/.test(m))                   return true;
  if (m === 'ノベル起動')             return true;
  if (m === '開ける')                 return true;
  if (/ステータス確認/.test(m))       return true;
  if (/^ボス召喚/.test(m))            return true;
  if (/^tts[：:]/i.test(m))           return true;
  // インライン設定コマンド（：区切り系）
  if (/キャラ\d{1,3}/.test(m))        return true;
  if (/名前[：:]/.test(m))            return true;
  if (/吹き出し背景色[：:]/.test(m))  return true;
  if (/色[：:]/.test(m))              return true;
  if (/吹き出し[：:]/.test(m))        return true;
  if (/移動[：:]/.test(m))            return true;
  if (/[上下左右][：:]\d+/.test(m))   return true;
  if (/大きさ[：:]/.test(m))          return true;
  if (/フォント[：:]/.test(m))        return true;
  if (/飾り[：:]/.test(m))            return true;
  if (/文字サイズ[：:]/.test(m))      return true;
  // モーション・エフェクトキーワード
  if (/ごしありｗ/.test(m))           return true;
  if (/ランダムキャラ/.test(m))       return true;
  if (/歩く|歩きゅ/.test(m))         return true;
  if (/はずむ|hikonori/.test(m))      return true;
  if (/回転/.test(m))                 return true;
  if (/反転/.test(m))                 return true;
  if (/震える/.test(m))               return true;
  if (/ぐにゃぐにゃ/.test(m))         return true;
  if (/浮く/.test(m))                 return true;
  if (/揺れる/.test(m))               return true;
  if (/伸縮|縮む/.test(m))            return true;
  if (/スキップ/.test(m))             return true;
  if (/酔う/.test(m))                 return true;
  if (/太字/.test(m))                 return true;
  if (/斜体/.test(m))                 return true;
  if (/花火|紙吹雪|流れ星|ハートシャワー|桜|雪|爆発|泡|稲妻/.test(m)) return true;
  if (/回復/.test(m))                 return true;
  return false;
}

function _agruParseResponse(raw) {
  let emotion = '安心';
  let replyText = raw;
  let affinityDelta = 0;
  let libidoDelta = 0;
  const lines = raw.split('\n').map(l => l.trim()).filter(l => l);

  let replyStartIdx = 1;

  if (lines.length >= 1) {
    const firstLine = lines[0];
    const bracketMatch = firstLine.match(/^\[(.+)\]$/);
    if (bracketMatch) {
      const e = bracketMatch[1].replace(/[！!。、…～「」]/g, '').trim();
      emotion = AGRU_EMOTIONS.find(x => x === e)
             || AGRU_EMOTIONS.find(x => e.includes(x) || x.includes(e))
             || '安心';
    } else if (lines.length >= 2 && firstLine.length <= 10) {
      const exactMatch  = AGRU_EMOTIONS.find(x => x === firstLine);
      const partialMatch = !exactMatch && AGRU_EMOTIONS.find(x => firstLine.includes(x));
      if (exactMatch || partialMatch) emotion = exactMatch || partialMatch;
    }
  }

  // 2行目が好感度変化（[+1] / [-1] / [0] / +1 / -1 等）なら抽出
  if (lines[replyStartIdx]) {
    const deltaRaw = lines[replyStartIdx].replace(/^\[|\]$/g, '').trim();
    const m = deltaRaw.match(/^([+-]?\d+)$/);
    if (m) {
      affinityDelta = Math.max(-10, Math.min(5, parseInt(m[1])));
      replyStartIdx = 2;
    }
  }

  // 3行目が性欲変化なら抽出
  if (lines[replyStartIdx]) {
    const deltaRaw = lines[replyStartIdx].replace(/^\[|\]$/g, '').trim();
    const m = deltaRaw.match(/^([+-]?\d+)$/);
    if (m) {
      libidoDelta = Math.max(-5, Math.min(5, parseInt(m[1])));
      replyStartIdx = 3;
    }
  }

  replyText = lines.slice(replyStartIdx).join('\n').replace(/^\[/, '').replace(/\]$/, '').replace(/^「|」$/g, '').trim();
  return { emotion, replyText, affinityDelta, libidoDelta };
}

function _agruNotifyEmotion(emotion, replyText) {
  const _m = {
    type: 'agruEmotion',
    emotion,
    image: _agruGetImage(emotion),
    reply: replyText,
  };
  if (_adminWs?.readyState === WebSocket.OPEN) _adminWs.send(JSON.stringify(_m));
  else _adminBC.postMessage(_m);
}

async function _agruSend(message, commenter) {
  if (!agruActive) return;
  if (_agruSelfieLocked) return;
  agruIdle = false;
  clearTimeout(_agruIdleTimer);

  _agruUpdateParams(message);

  if (commenter) _agruAddBubble('right', commenter, message);

  // 死亡状態（空腹度0）
  if (agruHunger <= 0) {
    _agruDeadWakeCount++;
    if (_agruDeadWakeCount >= 10) {
      agruHunger = 50;
      _agruDeadWakeCount = 0;
      _agruRevertStateImage();
      _agruUpdateHungerDisplay();
      if (!agruBattleActive) startAgruBattle();
    } else {
      _agruShowStateImage('dead');
      _agruAddBubble('left', 'アゲルちゃん', '・・・');
      _agruSetStatus('コメント待ち...');
      agruIdle = true;
      return;
    }
  }

  // 睡眠状態（眠気度100）
  if (agruSleepiness >= 100) {
    _agruSleepWakeCount++;
    if (_agruSleepWakeCount < 5) {
      _agruShowStateImage('sleep');
      _agruAddBubble('left', 'アゲルちゃん', '・・・ｚｚｚ');
      _agruSetStatus('コメント待ち...');
      agruIdle = true;
      return;
    } else {
      agruSleepiness = 70;
      _agruSleepWakeCount = 0;
      _agruRevertStateImage();
    }
  }

  _agruSetStatus('返答中...');

  const stateCtx = _agruGetStateContext();
  const systemPrompt = AGRU_DEFAULT_SYSTEM + '\n\n' + _agruGetAffinityContext() + (stateCtx ? '\n\n' + stateCtx : '') + (agruSystem.trim() ? '\n\n' + agruSystem.trim() : '');
  _agruLog('送信: ' + message + ' (履歴' + (_agruConvHistory.length / 2) + '往復) 好感度' + agruAffinity);

  // 画像生成キーワード検出（会話モード中は自撮り/写真も対象）
  const _needsImage = agruImgCmdEnabled && /出ろ|出して|生成|gen|自撮り|写真/i.test(message);
  const _isSelfie   = /自撮り/i.test(message);

  // 音楽キーワード検出 → YouTubeランダム再生
  // ※止めて は handleComment 側で MP消費込みで処理済みのためここでは省略
  if (!(/止めて/.test(message)) && agruYtEnabled && /曲|歌/.test(message)) _agruPlayYouTube();

  // unload無効時: Ollamaと並行してSD生成を先行リクエスト
  if (_needsImage && !agruUnloadEnabled) {
    _agruSelfieLocked = true;
    const _ctx0 = message.replace(/出ろ|出して|生成|gen|自撮り|写真/gi, '').trim();
    const _fin0 = () => {
      _agruSelfieLocked = false;
      clearTimeout(_agruIdleTimer);
      if (agruActive) { agruIdle = true; _agruSetStatus('コメント待ち...'); }
    };
    if (_isSelfie && _ctx0) {
      fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: _ctx0 }) })
        .then(r => r.json()).then(d => _agruGenerateSDImage(agruCharTags + ', ' + (d.result || _ctx0)).finally(_fin0))
        .catch(() => _agruGenerateSDImage(agruCharTags + ', ' + _ctx0).finally(_fin0));
    } else {
      _agruGenerateSDImage(_isSelfie ? agruCharTags : (_ctx0 || '1girl, anime')).finally(_fin0);
    }
  }

  try {
    const messages = [..._agruConvHistory, { role: 'user', content: message }];
    const res = await fetch('/api/ai-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model: aiModel, system: systemPrompt }),
    });
    const data = await res.json();
    if (data.error) {
      _agruLog('Ollamaエラー: ' + data.error, 'err');
      _agruSetStatus('エラー');
      agruIdle = true;
      return;
    }

    const raw = data.reply.trim();
    _agruLog('raw: ' + raw);

    const { emotion, replyText, affinityDelta, libidoDelta } = _agruParseResponse(raw);
    agruAffinity = Math.max(0, Math.min(100, agruAffinity + affinityDelta));
    if (agruAffinity === 0 && agruActive && !agruBattleActive) startAgruBattle();
    agruLibido   = Math.max(0, Math.min(100, agruLibido   + libidoDelta));
    _agruUpdateAffinityDisplay(affinityDelta);
    _agruUpdateLibidoDisplay(libidoDelta);
    _agruLog('emotion: ' + emotion + ' / reply: ' + replyText + ' / 好感度Δ' + affinityDelta + ' / 性欲Δ' + libidoDelta, 'ok');
    _agruNotifyEmotion(emotion, replyText);
    _agruPlayVoicevox(replyText);
    if (_needsImage && agruUnloadEnabled) {
      // 返答取得後にOllamaモデルをアンロード（完了を待ってからSD生成でVRAM競合を防ぐ）
      await fetch('/api/ai-unload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: aiModel }) }).catch(() => {});
      // すべての画像コマンドでロック（SD完了まで新コメント受け付けない）
      const _ctx = message.replace(/出ろ|出して|生成|gen|自撮り|写真/gi, '').trim();
      _agruSelfieLocked = true;
      const _imageFinally = () => {
        _agruSelfieLocked = false;
        clearTimeout(_agruIdleTimer);
        if (agruActive) { agruIdle = true; _agruSetStatus('コメント待ち...'); }
      };
      if (_isSelfie && _ctx) {
        // 自撮り: _ctx だけ先に翻訳してから agruCharTags と結合
        fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: _ctx }),
        }).then(r => r.json()).then(d => {
          const _translated = d.result || _ctx;
          _agruGenerateSDImage(agruCharTags + ', ' + _translated).finally(_imageFinally);
        }).catch(() => {
          _agruGenerateSDImage(agruCharTags + ', ' + _ctx).finally(_imageFinally);
        });
      } else {
        _agruGenerateSDImage(_isSelfie ? agruCharTags : (_ctx || '1girl, anime')).finally(_imageFinally);
      }
    }

    // 会話履歴に追加
    _agruConvHistory.push({ role: 'user', content: message });
    _agruConvHistory.push({ role: 'assistant', content: raw });
    if (_agruConvHistory.length > 50) _agruConvHistory.splice(0, 2);

    if (_agruPoisonTurns > 0) {
      _agruShowStateImage('毒');
      _agruPoisonTurns--;
    } else {
      _agruSetImage(emotion);
    }
    if (agruLibido > 80) _agruShowStateImage('horny');
    const _typingEl = document.getElementById('agruTypingIndicator');
    if (_typingEl) _typingEl.remove();
    _agruAddBubble('left', 'アゲルちゃん', replyText, () => {
      // 画像コマンド時は_imageFinally がSD完了後にコメント待ちへ移行するためタイマー不要
      if (!_needsImage) {
        _agruIdleTimer = setTimeout(() => {
          if (agruActive) { agruIdle = true; _agruSetStatus('コメント待ち...'); }
        }, agruIdleDelay * 1000);
      }
    });
  } catch (e) {
    _agruLog('例外: ' + e.message, 'err');
    _agruSetStatus('エラー: ' + e.message);
    agruIdle = true;
  }
}

async function _agruDebug(message) {
  _agruLog('【デバッグ】送信: ' + message);
  const _dbgStateCtx = _agruGetStateContext();
  const systemPrompt = AGRU_DEFAULT_SYSTEM + '\n\n' + _agruGetAffinityContext() + (_dbgStateCtx ? '\n\n' + _dbgStateCtx : '') + (agruSystem.trim() ? '\n\n' + agruSystem.trim() : '');
  try {
    const res = await fetch('/api/ai-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }],
        model: aiModel,
        system: systemPrompt,
      }),
    });
    const data = await res.json();
    if (data.error) { _agruLog('【デバッグ】Ollamaエラー: ' + data.error, 'err'); return; }

    const raw = data.reply.trim();
    _agruLog('【デバッグ】raw: ' + raw);

    const { emotion, replyText, affinityDelta, libidoDelta } = _agruParseResponse(raw);
    agruAffinity = Math.max(0, Math.min(100, agruAffinity + affinityDelta));
    agruLibido   = Math.max(0, Math.min(100, agruLibido   + libidoDelta));
    _agruUpdateAffinityDisplay(affinityDelta);
    _agruUpdateLibidoDisplay(libidoDelta);
    _agruLog('【デバッグ】emotion: ' + emotion + ' / reply: ' + replyText + ' / 好感度Δ' + affinityDelta + ' / 性欲Δ' + libidoDelta, 'ok');
    _agruNotifyEmotion(emotion, replyText);
  } catch (e) {
    _agruLog('【デバッグ】例外: ' + e.message, 'err');
  }
}

// モーダルのドラッグ操作を初期化
(function () {
  const overlay = document.getElementById('agruModal');
  const modal   = overlay?.querySelector('.agru-modal');
  const header  = modal?.querySelector('.agru-modal-header');
  if (!modal || !header) return;

  let dragging = false, ox = 0, oy = 0;

  header.addEventListener('mousedown', e => {
    if (e.target.closest('button')) return;
    dragging = true;
    const rect = modal.getBoundingClientRect();
    // transform ベースの初期位置を px に変換
    modal.style.left      = rect.left + 'px';
    modal.style.top       = rect.top  + 'px';
    modal.style.transform = 'none';
    ox = e.clientX - rect.left;
    oy = e.clientY - rect.top;
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    modal.style.left = (e.clientX - ox) + 'px';
    modal.style.top  = (e.clientY - oy) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (dragging) {
      localStorage.setItem('agruModalX', modal.style.left);
      localStorage.setItem('agruModalY', modal.style.top);
    }
    dragging = false;
  });
})();

// YouTubeモーダルのドラッグ操作
(function () {
  const modal  = document.getElementById('agruYtModal');
  const header = modal?.querySelector('.agru-yt-modal-header');
  if (!modal || !header) return;
  let dragging = false, ox = 0, oy = 0;
  header.addEventListener('mousedown', e => {
    if (e.target.closest('button')) return;
    dragging = true;
    const rect = modal.getBoundingClientRect();
    modal.style.left      = rect.left + 'px';
    modal.style.top       = rect.top  + 'px';
    modal.style.transform = 'none';
    ox = e.clientX - rect.left;
    oy = e.clientY - rect.top;
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    modal.style.left = (e.clientX - ox) + 'px';
    modal.style.top  = (e.clientY - oy) + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (dragging) {
      localStorage.setItem('agruYtModalX', modal.style.left);
      localStorage.setItem('agruYtModalY', modal.style.top);
    }
    dragging = false;
  });
})();

// YouTube / Suno 再生終了時に自動閉じ・音量設定
window.addEventListener('message', e => {
  try {
    if (e.data?.__kuku) return; // kuku.luプロキシは別ハンドラ
    const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    // YouTube 終了 (info=0)
    if (data.event === 'onStateChange' && data.info === 0) closeAgruYtModal();
    if (data.event === 'onReady') {
      const iframe = document.getElementById('agruYtIframe');
      if (iframe) iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [agruYtVolume] }), '*');
    }
    // Suno 終了検知（送ってくれるか確認用ログ）
    const isSunoFrame = document.getElementById('agruYtIframe')?.src?.includes('suno.com');
    if (isSunoFrame && data.event !== 'onStateChange') console.log('[suno msg]', data);
    // Suno が ended 系イベントを送ってきた場合
    if (isSunoFrame && (data.type === 'playback_end' || data.status === 'ended' || data.event === 'ended')) {
      closeAgruYtModal();
    }
  } catch {}
});

let _agruShakeRAF = null, _agruShakeT = 0, _agruShakeLast = null;

function _agruStartShake() {
  if (_agruShakeRAF) return;
  _agruShakeLast = null;
  const loop = (ts) => {
    _agruShakeRAF = requestAnimationFrame(loop);
    if (_agruShakeLast === null) _agruShakeLast = ts;
    _agruShakeT += Math.min((ts - _agruShakeLast) / 1000, 0.05);
    _agruShakeLast = ts;
    const t = _agruShakeT;
    const img = document.getElementById('agruCharImg');
    if (!img || img._agruSliding) return;
    const _a = agruShakeAmp;
    const _scl = agruCharImgScale !== 1 ? `scale(${agruCharImgScale}) ` : '';
    const tf = `${_scl}translate(${((Math.sin(t*1.3)*0.55+Math.sin(t*2.7)*0.30+Math.sin(t*0.9)*0.15)*_a).toFixed(2)}px,${((Math.sin(t*1.7)*0.55+Math.sin(t*3.1)*0.30+Math.sin(t*1.1)*0.15)*_a).toFixed(2)}px) rotate(${(Math.sin(t*0.8)*0.18*_a/2).toFixed(3)}deg)`;
    img.style.transform = tf;
    const cv = img.parentElement?.querySelector('.puru-canvas');
    if (cv) cv.style.transform = tf;
  };
  _agruShakeRAF = requestAnimationFrame(loop);
}

function _agruStopShake() {
  if (_agruShakeRAF) { cancelAnimationFrame(_agruShakeRAF); _agruShakeRAF = null; }
  _agruApplyCharScale();
}

async function openAgruModal() {
  if (agruActive) return;
  agruActive = true;
  agruIdle   = false;
  clearTimeout(_agruIdleTimer);
  clearInterval(_agruTypeTimer);
  _agruConvHistory = [];

  agruAffinity    = 50;
  agruHunger      = 100;
  agruSleepiness  = 0;
  agruLibido      = 30;
  _agruSleepWakeCount = 0;
  _agruDeadWakeCount  = 0;

  const img = document.getElementById('agruCharImg');
  if (img && agruDefaultImage) {
    img.src = `/ageru/${encodeURIComponent(agruDefaultImage)}`;
    img.addEventListener('load', updateAgruPurupuru, { once: true });
  }
  const log = document.getElementById('agruChatLog');
  if (log) log.innerHTML = '';
  document.getElementById('agruEmotionLabel').textContent = '';
  _agruUpdateAffinityDisplay();
  _agruUpdateHungerDisplay();
  _agruUpdateSleepDisplay();
  _agruUpdateLibidoDisplay();
  _agruSetStatus('起動中...');
  const _agruModalEl = document.getElementById('agruModal');
  _agruModalEl.classList.remove('hidden');
  _agruModalEl.style.zIndex = agruModalZ;
  _agruBgmPlay();
  const _cm = document.querySelector('#agruModal .agru-modal');
  if (_cm) {
    _cm.style.width      = agruModalWidth + 'px';
    _cm.style.height     = agruModalHeight + 'px';
    _cm.style.background = `rgba(255,248,251,${agruModalBgOpacity / 100})`;
    const _cx = localStorage.getItem('agruModalX'), _cy = localStorage.getItem('agruModalY');
    if (_cx && _cy) {
      const _lx = parseFloat(_cx), _ly = parseFloat(_cy);
      if (_lx >= 0 && _ly >= 0 && _lx < window.innerWidth - 60 && _ly < window.innerHeight - 40) {
        _cm.style.left = _cx; _cm.style.top = _cy; _cm.style.transform = 'none';
      } else {
        localStorage.removeItem('agruModalX'); localStorage.removeItem('agruModalY');
        _cm.style.left = ''; _cm.style.top = ''; _cm.style.transform = '';
      }
    } else { _cm.style.left = ''; _cm.style.top = ''; _cm.style.transform = ''; }
  }

  // 起動挨拶
  _agruSend('配信が始まりました。視聴者に向けて元気よく挨拶してください。', null);
  _agruStartShake();
}

function closeAgruModal() {
  agruActive = false;
  agruIdle   = true;
  _agruSelfieLocked = false;
  _agruStopShake();
  clearTimeout(_agruIdleTimer);
  clearInterval(_agruTypeTimer);
  closeAgruYtModal();
  _agruBgmStop();
  document.getElementById('agruModal').classList.add('hidden');
  fetch('/api/ai-unload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: aiModel }) }).catch(() => {});
}

function _agruOpenYtModal(videoId, startTime = 0) {
  const modal  = document.getElementById('agruYtModal');
  const iframe = document.getElementById('agruYtIframe');
  if (!modal || !iframe) return;
  _agruBgmPause();
  modal.style.width   = agruYtWidth + 'px';
  modal.style.opacity = agruYtOpacity / 100;
  modal.style.zIndex  = agruYtModalZ;
  iframe.style.width  = agruYtWidth + 'px';
  iframe.style.height = agruYtHeight + 'px';
  const _startParam = startTime ? `&start=${startTime}` : '';
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1${_startParam}`;
  const sx = localStorage.getItem('agruYtModalX'), sy = localStorage.getItem('agruYtModalY');
  if (sx && sy) { modal.style.left = sx; modal.style.top = sy; modal.style.transform = 'none'; }
  else { modal.style.left = ''; modal.style.top = ''; modal.style.transform = ''; }
  modal.classList.remove('hidden');

  // タイトル取得（oEmbed）
  const titleEl = document.getElementById('agruYtTitle');
  if (titleEl) {
    titleEl.textContent = '▶ 再生中';
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      .then(r => r.json())
      .then(d => { if (d.title && titleEl.isConnected) titleEl.textContent = '▶ ' + d.title; })
      .catch(() => {});
  }

  iframe.addEventListener('load', () => {
    try {
      iframe.contentWindow.postMessage('{"event":"listening","id":1}', '*');
      iframe.contentWindow.postMessage('{"event":"command","func":"addEventListener","args":["onStateChange"]}', '*');
      iframe.contentWindow.postMessage('{"event":"command","func":"addEventListener","args":["onReady"]}', '*');
    } catch {}
  }, { once: true });
}

// kuku.lu → プロキシiframe経由でSuno URLを取得して再生
const _kukuUserMap = new Map(); // kukuUrl → user (postMessage受信用)
window.addEventListener('message', e => {
  if (!e.data || !e.data.__kuku) return;
  const url = String(e.data.__kuku);
  const m = url.match(/suno\.com\/(?:song\/([a-f0-9-]{36})|s\/([A-Za-z0-9_-]+))/i);
  if (!m) return;
  // iframeのsrcからkukuUrlを特定してuserを取得
  const iframe = [...document.querySelectorAll('iframe[data-kuku]')]
    .find(f => e.source === f.contentWindow);
  const kukuUrl = iframe?.dataset.kuku;
  const user = kukuUrl ? _kukuUserMap.get(kukuUrl) : null;
  if (user) _handleSunoUrl(user, m[1] ?? m[2]);
  if (iframe) { _kukuUserMap.delete(kukuUrl); iframe.remove(); }
});

function _tryKukuSuno(user, kukuUrl) {
  _kukuUserMap.set(kukuUrl, user);
  const iframe = document.createElement('iframe');
  iframe.dataset.kuku = kukuUrl;
  iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
  iframe.src = `/api/kuku-proxy?url=${encodeURIComponent(kukuUrl)}`;
  document.body.appendChild(iframe);
  setTimeout(() => { _kukuUserMap.delete(kukuUrl); iframe.remove(); }, 10000);
}

function _handleSunoUrl(user, songId) {
  if (agruYtEnabled) _agruOpenSunoModal(songId);
  if (seenSunoUrls.has(songId)) {
    postAIReply('もうみた');
  } else {
    seenSunoUrls.add(songId);
    user.mp = (user.mp ?? 0) + 20;
    updateStatsDisplay(user);
    ensureCharOnStage(user);
    showBubble(user, '🎵 Suno共有！ MP+20', {});
    const { x: sx, y: sy } = getCharCenter(user);
    showDamageNumber(sx, sy - 40, 'MP+20', false, 20, '#60a5fa');
    addToLog(user, '🎵 Suno共有 MP+20', '#60a5fa');
  }
}

function _agruOpenSunoModal(songId) {
  // /s/{shortId} 形式はUUIDでないのでサーバー経由で解決してから開く
  const isUuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(songId);
  if (!isUuid) {
    fetch(`/api/suno-resolve?id=${encodeURIComponent(songId)}`)
      .then(r => r.json())
      .then(d => _agruOpenSunoModal(d.songId || songId))
      .catch(() => _agruOpenSunoModal_inner(songId));
    return;
  }
  _agruOpenSunoModal_inner(songId);
}

function _agruOpenSunoModal_inner(songId) {
  const modal  = document.getElementById('agruYtModal');
  const iframe = document.getElementById('agruYtIframe');
  if (!modal || !iframe) return;
  _agruBgmPause();
  modal.style.width   = agruYtWidth + 'px';
  modal.style.opacity = agruYtOpacity / 100;
  modal.style.zIndex  = agruYtModalZ;
  iframe.style.width  = agruYtWidth + 'px';
  iframe.style.height = agruYtHeight + 'px';
  iframe.src = `https://suno.com/embed/${songId}?autoplay=1`;
  const sx = localStorage.getItem('agruYtModalX'), sy = localStorage.getItem('agruYtModalY');
  if (sx && sy) { modal.style.left = sx; modal.style.top = sy; modal.style.transform = 'none'; }
  else { modal.style.left = ''; modal.style.top = ''; modal.style.transform = ''; }
  modal.classList.remove('hidden');
  const titleEl = document.getElementById('agruYtTitle');
  if (titleEl) titleEl.textContent = '🎵 Suno再生中';
}

function _agruPlayYouTube(videoId, startTime = 0) {
  if (videoId) { _agruOpenYtModal(videoId, startTime); return; }
  fetch('/api/yt-random-video')
    .then(r => r.json())
    .then(d => { if (d.videoId) _agruOpenYtModal(d.videoId, 0); })
    .catch(() => {});
}

function closeAgruYtModal() {
  const modal  = document.getElementById('agruYtModal');
  const iframe = document.getElementById('agruYtIframe');
  if (modal)  modal.classList.add('hidden');
  if (iframe) iframe.src = '';
  if (agruActive) _agruBgmPlay();
}

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
const _sdQueue = [];
let _sdBusy = false;

function generateSDImage(user, prompt) {
  ensureCharOnStage(user);
  showBubble(user, '⏳ 順番待ち…', { color: '#a855f7' });
  _sdQueue.push({ user, prompt });
  if (!_sdBusy) _sdProcessQueue();
}

async function _sdProcessQueue() {
  if (_sdBusy || _sdQueue.length === 0) return;
  _sdBusy = true;
  const { user, prompt } = _sdQueue.shift();
  await _sdGenerateOne(user, prompt);
  _sdBusy = false;
  _sdProcessQueue();
}

async function _sdGenerateOne(user, prompt) {
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
        cfgScale:       cfg.cfgScale,
        sampler:        cfg.sampler,
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

function _sdReadSettings() {
  return {
    width:          parseInt(document.getElementById('sdWidthInput')?.value)        || sdWidth,
    height:         parseInt(document.getElementById('sdHeightInput')?.value)       || sdHeight,
    steps:          parseInt(document.getElementById('sdStepsSlider')?.value)       || sdSteps,
    popWidth:       parseInt(document.getElementById('sdPopWidthSlider')?.value)    || 480,
    positiveSuffix: document.getElementById('sdPositiveSuffixInput')?.value         ?? sdPositiveSuffix,
    negative:       document.getElementById('sdNegativeInput')?.value               ?? sdNegative,
    displayTime:    parseInt(document.getElementById('sdDisplayTimeSlider')?.value) || sdDisplayTime,
    mosaicKeywords: document.getElementById('sdMosaicKeywordsInput')?.value         ?? sdMosaicKeywords,
    mosaicBlock:    parseInt(document.getElementById('sdMosaicBlockSlider')?.value) || sdMosaicBlock,
    cfgScale:       parseFloat(document.getElementById('sdCfgScaleInput')?.value)   || sdCfgScale,
    sampler:        document.getElementById('sdSamplerInput')?.value                || sdSampler,
  };
}

function _sdNeedsMosaic(prompt, translatedPrompt, mosaicKeywords) {
  if (!mosaicKeywords.trim()) return null;
  const keywords = mosaicKeywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
  const p = prompt.toLowerCase(), t = translatedPrompt.toLowerCase();
  return keywords.find(k => p.includes(k) || t.includes(k)) || null;
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
  if (_sdNeedsMosaic(prompt, translatedPrompt, cfg.mosaicKeywords)) _applyMosaic(el.querySelector('.sd-image-img'), cfg.mosaicBlock); // null→falsy で動作変わらず
  el.style.zIndex = charZCounter + 100;
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
    const saved = parseInt(localStorage.getItem(key) ?? def);
    apply(saved);
    if (!slider) return;
    slider.value = saved;
    if (valEl) valEl.textContent = fmt(saved);
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
    const saved = parseInt(localStorage.getItem(key) ?? def);
    document.documentElement.style.setProperty(cssVar, toCSS(saved));
    if (!slider) return;
    slider.value = saved;
    if (valEl) valEl.textContent = saved + '%';
    slider.addEventListener('input', () => {
      const v = parseInt(slider.value);
      if (valEl) valEl.textContent = v + '%';
      document.documentElement.style.setProperty(cssVar, toCSS(v));
      localStorage.setItem(key, v);
      saveSettingsToServer();
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
  document.getElementById('nikoSizeReset')?.addEventListener('click', () => {
    sizeSlider.value = 40;
    sizeSlider.dispatchEvent(new Event('input'));
  });
  document.getElementById('nikoOpacityReset')?.addEventListener('click', () => {
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
  document.getElementById('bossHpScaleReset')?.addEventListener('click', () => {
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
  document.getElementById('bossAtkCoeffReset')?.addEventListener('click', () => {
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
  document.getElementById('counterRateReset')?.addEventListener('click', () => {
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
  document.getElementById('brHpMultReset')?.addEventListener('click', () => {
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
  document.getElementById('taimanHpMultReset')?.addEventListener('click', () => {
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
document.getElementById('openImgModal')?.addEventListener('click', () => openModal());
document.getElementById('closeModal').addEventListener('click',  () => { document.getElementById('imageModal').classList.add('hidden'); });
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

// TDZ 対策: mousemove/mouseup ハンドラより後に宣言されるため前出し
let wordleDragState  = null;
let quizDragState    = null;
let raceDragState    = null;

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
      localStorage.setItem(panelKey('rankingPanelX'), Math.round(rankingState.panelX));
      localStorage.setItem(panelKey('rankingPanelY'), Math.round(rankingState.panelY));
    }
    rankingDragState = null;
    return;
  }
  if (wordleDragState) {
    if (wordleState) {
      localStorage.setItem(panelKey('wordlePanelX'), Math.round(wordleState.panelX));
      localStorage.setItem(panelKey('wordlePanelY'), Math.round(wordleState.panelY));
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
      localStorage.setItem(panelKey('quizPanelX'), Math.round(quizState.panelX));
      localStorage.setItem(panelKey('quizPanelY'), Math.round(quizState.panelY));
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
      localStorage.setItem(panelKey('bossX'), bossLastPos.x);
      localStorage.setItem(panelKey('bossY'), bossLastPos.y);
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

// ── ペットガチャ10連アニメーション ────────────────────────────────
function showPetGacha10Anim(user, pets) {
  if (!user.el) return;
  const prev = user.el.querySelector('.pet-gacha10-panel');
  if (prev) prev.remove();

  if (petGachaDrumAudio) { petGachaDrumAudio.pause(); petGachaDrumAudio = null; }
  if (!compactMode) {
    try {
      petGachaDrumAudio = new Audio(SOUND_GACHA_DRUM);
      petGachaDrumAudio.volume = Math.min(1, 0.7 * seVolume);
      petGachaDrumAudio.loop = true;
      petGachaDrumAudio.play().catch(() => {});
    } catch {}
  }

  const RC = cls => ({
    '':              { border:'#374151', color:'#9ca3af' },
    'rarity-rare':   { border:'#16a34a', color:'#4ade80' },
    'rarity-epic':   { border:'#3b82f6', color:'#60a5fa' },
    'rarity-legend': { border:'#a855f7', color:'#c084fc' },
    'rarity-myth':   { border:'#f59e0b', color:'#fbbf24' },
  }[cls || '']);

  const RARITY_ORD = {'rarity-myth':4,'rarity-legend':3,'rarity-epic':2,'rarity-rare':1,'':0};
  const bestOrder  = Math.max(...pets.map(p => RARITY_ORD[p.rarityCls] || 0));
  const bestCls    = Object.keys(RARITY_ORD).find(k => RARITY_ORD[k] === bestOrder) || '';

  const panel = document.createElement('div');
  panel.className = 'pet-gacha10-panel';
  panel.innerHTML =
    `<div class="pg10-title">🐾 10連ガチャ中...</div>` +
    `<div class="pg10-grid">` +
    Array(10).fill(0).map(() =>
      `<div class="pg10-card pg10-pending">` +
      `<div class="pg10-card-img"><img src="/chara/kisyokeee.png"></div>` +
      `<div class="pg10-card-rarity" style="color:#64748b">？</div>` +
      `<div class="pg10-card-name">...</div></div>`
    ).join('') +
    `</div>`;
  user.el.appendChild(panel);

  setTimeout(() => {
    if (petGachaDrumAudio) { petGachaDrumAudio.pause(); petGachaDrumAudio = null; }
    panel.querySelector('.pg10-title').textContent = '🎉 10連ガチャ結果！';

    const cards = panel.querySelectorAll('.pg10-card');
    pets.forEach((pet, i) => {
      setTimeout(() => {
        const rc = RC(pet.rarityCls);
        const isBest = (RARITY_ORD[pet.rarityCls] || 0) === bestOrder;
        const card = cards[i];
        card.className = `pg10-card pg10-reveal${isBest ? ' pg10-best' : ''}`;
        card.style.borderColor = rc.border;
        card.style.boxShadow   = `0 0 8px ${rc.border}88`;
        card.innerHTML =
          `<div class="pg10-card-img" style="border-color:${rc.border}"><img src="/chara/${encodeURIComponent(pet.img)}"></div>` +
          `<div class="pg10-card-rarity" style="color:${rc.color}">${pet.rarityName}</div>` +
          `<div class="pg10-card-name"   style="color:${rc.color}">${escapeHtml(pet.abilityName)}</div>`;

        if (pet.rarityCls === 'rarity-myth') {
          playLocalSound(SOUND_GACHA_MYTH);
          spawnFireworks(Math.random() * stage.clientWidth, Math.random() * stage.clientHeight * 0.8);
        } else if (pet.rarityCls === 'rarity-legend') {
          playLocalSound(SOUND_GACHA_LEGEND);
          spawnFireworks(stage.clientWidth / 2, stage.clientHeight / 2);
        }

        // 最後のカード開封時：myth/legend以外の最高レアリティ音を鳴らす
        if (i === pets.length - 1 && bestCls !== 'rarity-myth' && bestCls !== 'rarity-legend') {
          const snd = { 'rarity-epic':'', 'rarity-rare':'', '':'' };
          playLocalSound(bestCls === 'rarity-epic' ? SOUND_GACHA_EPIC : bestCls === 'rarity-rare' ? SOUND_GACHA_RARE : SOUND_GACHA_NORMAL);
        }

        if (i === pets.length - 1 && bestCls === 'rarity-myth') spawnConfetti();
      }, i * 150);
    });

    setTimeout(() => panel.remove(), 7000);
  }, 2000);
}

// ── ステータスモーダル ─────────────────────────────────────────────
function showStatusModal(user, autoClose = true, triggerCnum = null) {
  const imgFile = user.charImage || (user.charDef ? (charImages[user.charDef.id] || 'kisyokeee.png') : 'kisyokeee.png');
  const atk     = calcAtk(user);
  const lv      = user.level  || 1;
  const hp      = user.hp     ?? 30;
  const mhp     = user.maxHp  ?? 30;
  const mp      = user.mp     ?? 10;
  const _petId1 = user.pet?.abilityId;
  const _petId2 = user.pet2?.abilityId;
  const _petCrit = (_petId1 === 'scout' ? 0.05 : _petId1 === 'crit_up' ? 0.20 : 0)
                 + (_petId2 === 'scout' ? 0.05 : _petId2 === 'crit_up' ? 0.20 : 0);
  const _titleCrit = typeof getTitleBonuses === 'function' ? (getTitleBonuses(user).crit || 0) : 0;
  const critRate = Math.round((0.15 + _petCrit + _titleCrit) * 100);

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
    ? `<div class="sm-pet-row" style="display:flex;flex-direction:row;gap:12px;flex-wrap:wrap;align-items:flex-start">${buildPetBlock(user.pet)}${buildPetBlock(user.pet2)}</div>`
    : '<div class="sm-no-equip">ペットなし</div>';

  const overlay = document.createElement('div');
  overlay.id = 'statusModal';
  overlay.className = 'sm-overlay';
  const titleRank = id => ['T99','T100'].includes(id) ? 0 : ['T91','T92','T93','T94','T70','T74','T80'].includes(id) ? 1 : 2;
  const titleListHtml = (user.titles||[]).length === 0
    ? '<div class="sm-no-equip">称号なし</div>'
    : [...(user.titles||[])].sort((a,b) => titleRank(a) - titleRank(b)).map(id => {
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
        <span id="smLiveTitle" class="sm-header-live-title">取得中...</span>
        <span class="sm-header-date">${(() => { const n = new Date(); return `${n.getFullYear()}/${String(n.getMonth()+1).padStart(2,'0')}/${String(n.getDate()).padStart(2,'0')} ${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`; })()}</span>
        <button class="sm-close">✕</button>
      </div>
      <div class="sm-content">
        <div class="sm-main-panel">
          <div class="sm-body">
            <div class="sm-left">
              <img class="sm-avatar" src="/chara/${encodeURIComponent(imgFile)}" alt="${escapeHtml(user.name)}">
              <div class="sm-ol-stats-wrap">
                ${user.activeTitle ? `<div class="sm-ol-title">${escapeHtml(TITLES.find(t=>t.id===user.activeTitle)?.name||'?')}</div>` : ''}
                <div class="sm-ol-stats">
                  <div class="sm-ol-stat">HP <span>${hp} / ${mhp}</span></div>
                  <div class="sm-ol-stat">MP <span>${mp}</span></div>
                  <div class="sm-ol-stat">ATK <span>${atk}</span></div>
                  <div class="sm-ol-stat">CRT <span>${critRate}%</span></div>
                  <div class="sm-ol-stat">EXP <span>${user.exp || 0}</span></div>
                </div>
              </div>
              <div class="sm-ol-name">${escapeHtml(user.name)}${user.iconName ? `<div class="sm-icon-name" style="font-size:10px;margin-top:0">${escapeHtml(user.iconName)}</div>` : ''}</div>
              <div class="sm-ol-lv">Lv. ${lv}</div>
              <div class="sm-ol-equip">
                <div class="sm-equip-list">${equipRows}</div>
              </div>
            </div>
            <div class="sm-right">
              <div class="sm-section-title">📈 記録</div>
              <div class="sm-stats">
                <div class="sm-stat"><span class="sm-stat-label">コメント数</span><span class="sm-stat-val">${user.commentCount || 0}</span></div>
                <div class="sm-stat"><span class="sm-stat-label">合計ダメージ</span><span class="sm-stat-val">${(user.totalDmgDealt || 0).toLocaleString()}</span></div>
                <div class="sm-stat"><span class="sm-stat-label">Wordle正解</span><span class="sm-stat-val">${user.wordleWins || 0} 回</span></div>
                <div class="sm-stat"><span class="sm-stat-label">早押し正解</span><span class="sm-stat-val">${user.hayaoshiWins || 0} 回</span></div>
                <div class="sm-stat"><span class="sm-stat-label">クイズ正解</span><span class="sm-stat-val">${(user.tc?.quizWins || 0)} 回</span></div>
                <div class="sm-stat"><span class="sm-stat-label">スロット</span><span class="sm-stat-val">${(user.tc?.slotPlays || 0)} 回 / ${(user.tc?.slotWins || 0)} 当選</span></div>
                <div class="sm-stat"><span class="sm-stat-label">宝箱開封</span><span class="sm-stat-val">${(user.tc?.treasureOpens || 0)} 回</span></div>
                <div class="sm-stat"><span class="sm-stat-label">ペットガチャ</span><span class="sm-stat-val">${(user.tc?.petGachas || 0)} 回</span></div>
                <div class="sm-stat"><span class="sm-stat-label">死亡回数</span><span class="sm-stat-val">${user.deaths || 0} 回</span></div>
              </div>
              <div class="sm-section-title">🐾 ペット</div>
              ${petHtml}
            </div>
          </div>
          ${(() => {
            const comments = (user.recentComments || []).slice(-10);
            if (!comments.length) return '';
            const items = comments.map((c, i) =>
              `<div class="sm-comment-item"><span class="sm-comment-num">${comments.length - i}.</span>${escapeHtml(c)}</div>`
            ).reverse().join('');
            return `<div class="sm-review-area"><div class="sm-review-label">💬 最近のコメント（最新${comments.length}件）</div><div class="sm-comment-list">${items}</div></div>`;
          })()}
        </div>
        <div class="sm-title-panel">
          <div class="sm-title-panel-header">⭐ 称号 <span class="sm-title-count">${(user.titles||[]).length}</span>${user.activeTitle ? '<div class="sm-title-active">表示中: 【' + escapeHtml(TITLES.find(t=>t.id===user.activeTitle)?.name||'?') + '】</div>' : ''}</div>
          <div class="sm-title-list">${titleListHtml}</div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // ライブタイトル取得してヘッダーに反映
  if (apikey) {
    fetch(`/api/live-info?apikey=${encodeURIComponent(apikey)}`)
      .then(r => r.json())
      .then(d => {
        const el = overlay.querySelector('#smLiveTitle');
        if (el) el.textContent = d.livetitle || '(タイトルなし)';
      })
      .catch(() => {
        const el = overlay.querySelector('#smLiveTitle');
        if (el) el.textContent = 'ステータス確認';
      });
  } else {
    const el = overlay.querySelector('#smLiveTitle');
    if (el) el.textContent = 'ステータス確認';
  }

  const close = () => overlay.remove();

  const captureAndPostDiscord = async () => {
    console.log('[capture] start triggerCnum=', triggerCnum, 'html2canvas=', typeof html2canvas);
    if (triggerCnum == null) { console.warn('[capture] skip: triggerCnum is null'); return; }
    if (typeof html2canvas === 'undefined') { console.warn('[capture] skip: html2canvas not loaded'); return; }

    const modalEl = overlay.querySelector('.sm-modal');
    if (!modalEl) { console.warn('[capture] skip: modalEl not found'); return; }

    // 画像がすべて読み込まれるのを待つ（未ロードがあれば最大3秒待機）
    const pendingImgs = [...modalEl.querySelectorAll('img')].filter(img => !img.complete || img.naturalWidth === 0);
    if (pendingImgs.length > 0) {
      await Promise.all(pendingImgs.map(img => new Promise(r => {
        img.addEventListener('load',  r, { once: true });
        img.addEventListener('error', r, { once: true });
        setTimeout(r, 3000);
      })));
    }

    // ② overflow/height/flex を一時解除（finally で必ず復元）
    const smContent    = modalEl.querySelector('.sm-content');
    const smMainPanel  = modalEl.querySelector('.sm-main-panel');
    const smTitlePanel = modalEl.querySelector('.sm-title-panel');
    const smTitleList  = modalEl.querySelector('.sm-title-list');
    const saved = {
      mH:  modalEl.style.height,        mO:  modalEl.style.overflow,
      cO:  smContent?.style.overflow,   cMH: smContent?.style.minHeight,   cH: smContent?.style.height,
      pO:  smMainPanel?.style.overflow, pMH: smMainPanel?.style.maxHeight,
      tO:  smTitlePanel?.style.overflow, tH: smTitlePanel?.style.height,
      lO:  smTitleList?.style.overflow,  lF: smTitleList?.style.flex,       lH: smTitleList?.style.height,
    };
    const restoreStyles = () => {
      modalEl.style.height = saved.mH;
      modalEl.style.overflow = saved.mO;
      if (smContent)    { smContent.style.overflow = saved.cO; smContent.style.minHeight = saved.cMH; smContent.style.height = saved.cH; }
      if (smMainPanel)  { smMainPanel.style.overflow = saved.pO; smMainPanel.style.maxHeight = saved.pMH; }
      if (smTitlePanel) { smTitlePanel.style.overflow = saved.tO; smTitlePanel.style.height = saved.tH; }
      if (smTitleList)  { smTitleList.style.overflow = saved.lO; smTitleList.style.flex = saved.lF; smTitleList.style.height = saved.lH; }
    };

    const restoreList = [];
    try {
      modalEl.style.overflow = 'visible';
      if (smContent)    { smContent.style.overflow = 'visible'; smContent.style.minHeight = 'auto'; smContent.style.height = 'auto'; }
      if (smMainPanel)  { smMainPanel.style.overflow = 'visible'; smMainPanel.style.maxHeight = 'none'; }
      if (smTitlePanel) { smTitlePanel.style.overflow = 'visible'; smTitlePanel.style.height = 'auto'; }
      if (smTitleList)  { smTitleList.style.overflow = 'visible'; smTitleList.style.flex = 'none'; smTitleList.style.height = 'auto'; }
      // height:auto は最後に適用してリフローを安定させる
      modalEl.style.height = 'auto';

      // スタイル変更後1フレーム待ってレイアウトを確定させる
      await new Promise(r => requestAnimationFrame(r));
      console.log('[capture] modalEl size=', modalEl.offsetWidth, 'x', modalEl.offsetHeight,
                  'scroll=', modalEl.scrollWidth, 'x', modalEl.scrollHeight);

      // ① object-fit:contain img をキャンバスに差し替え
      for (const img of modalEl.querySelectorAll('.sm-avatar, .sm-pet-img')) {
        const bW = img.offsetWidth, bH = img.offsetHeight;
        const nW = img.naturalWidth, nH = img.naturalHeight;
        console.log('[capture] img', img.className, 'box=', bW, bH, 'natural=', nW, nH);
        if (!bW || !bH || !nW || !nH || !img.parentElement) continue;
        const scale2 = 2;
        const cvs = document.createElement('canvas');
        cvs.width = bW * scale2; cvs.height = bH * scale2;
        const ctx2 = cvs.getContext('2d');
        ctx2.scale(scale2, scale2);
        const s = Math.min(bW / nW, bH / nH);
        const dW = nW * s, dH = nH * s;
        ctx2.drawImage(img, (bW - dW) / 2, (bH - dH) / 2, dW, dH);
        cvs.style.width = bW + 'px'; cvs.style.height = bH + 'px';
        cvs.style.flexShrink = '0';
        cvs.style.borderRadius = window.getComputedStyle(img).borderRadius;
        img.parentElement.replaceChild(cvs, img);
        restoreList.push({ cvs, img });
      }

      const captureW = modalEl.scrollWidth  || modalEl.offsetWidth;
      const captureH = modalEl.scrollHeight || modalEl.offsetHeight;
      console.log('[capture] html2canvas start w=', captureW, 'h=', captureH);
      const canvas = await html2canvas(modalEl, {
        backgroundColor: '#0f121c',
        scale: 2,
        useCORS: true,
        logging: false,
        width: captureW,
        height: captureH,
      });
      console.log('[capture] html2canvas done canvas=', canvas.width, 'x', canvas.height);

      const dataUrl = canvas.toDataURL('image/png');
      console.log('[capture] posting to /api/status-screenshot dataUrl length=', dataUrl.length);
      const resp = await fetch('/api/status-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDataUrl: dataUrl, userName: user.name }),
      });
      const data = await resp.json();
      console.log('[capture] response=', data);
      if (data.url) {
        console.log('[capture] posting comment >>', triggerCnum, data.url);
        postAIReply(`>>${triggerCnum} ${data.url}`);
      } else {
        console.warn('[capture] no url in response', data);
      }
    } catch (e) {
      console.error('[capture] error', e);
    } finally {
      restoreStyles();
      for (const { cvs, img } of restoreList) cvs.parentElement?.replaceChild(img, cvs);
      close(); // キャプチャ完了後にモーダルを閉じる
    }
  };

  // 最低600ms + 全画像ロード完了後にキャプチャ
  const minWait  = new Promise(r => setTimeout(r, 600));
  const imgs     = [...overlay.querySelectorAll('img')];
  const imgReady = Promise.all(imgs.map(img =>
    (img.complete && img.naturalWidth > 0)
      ? Promise.resolve()
      : new Promise(r => {
          img.addEventListener('load',  r, { once: true });
          img.addEventListener('error', r, { once: true });
          setTimeout(r, 3000);
        })
  ));
  Promise.all([minWait, imgReady]).then(() => captureAndPostDiscord());

  overlay.querySelector('.sm-close').addEventListener('click', close);
  if (triggerCnum != null) {
    // Discord投稿あり → captureAndPostDiscordのfinally内でcloseする
    // フォールバック: 何らかのエラーで閉じなかった場合に備え20秒後に強制close
    setTimeout(close, 20000);
  } else if (autoClose !== false) {
    setTimeout(close, 5000);
  }
}

// ── ランキングパネル（ダメージ／MP タブ切替） ──────────────────────
function closeRankingPanel() {
  rankingState = null;
  localStorage.setItem('rankingVisible', '0');
  document.getElementById('rankingPanel')?.remove();
}

function resetRankingPanelPos() {
  if (!rankingState) return;
  rankingState.panelX = Math.max(0, stage.clientWidth - 220);
  rankingState.panelY = 10;
  localStorage.setItem(panelKey('rankingPanelX'), Math.round(rankingState.panelX));
  localStorage.setItem(panelKey('rankingPanelY'), Math.round(rankingState.panelY));
  renderRankingPanel();
}

function showDamageRanking(dmgMap) {
  if (compactMode) return;
  if (!Object.keys(dmgMap).length) return;
  if (rankingState) {
    rankingState.dmgMap = dmgMap;
  } else {
    rankingState = {
      dmgMap,
      panelX: parseInt(localStorage.getItem('rankingPanelX')) || (stage.clientWidth - 220),
      panelY: parseInt(localStorage.getItem('rankingPanelY')) || 10,
    };
  }
  localStorage.setItem('rankingVisible', '1');
  renderRankingPanel();
}

function showMpRanking() {
  if (compactMode) return;
  if (!Object.values(users).filter(u => u.el).length) return;
  if (!rankingState) {
    rankingState = {
      dmgMap: {},
      panelX: parseInt(localStorage.getItem('rankingPanelX')) || (stage.clientWidth - 220),
      panelY: parseInt(localStorage.getItem('rankingPanelY')) || 10,
    };
  }
  localStorage.setItem('rankingVisible', '1');
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

  panel.className = '';

  // ステージ内にクランプ
  const _sr = stage.getBoundingClientRect();
  rankingState.panelX = Math.max(0, Math.min(_sr.width  - 210, rankingState.panelX));
  rankingState.panelY = Math.max(0, Math.min(_sr.height - 60,  rankingState.panelY));

  panel.style.left = rankingState.panelX + 'px';
  panel.style.top  = rankingState.panelY + 'px';

  const medals = ['🥇', '🥈', '🥉'];

  const _liveDmg = {};
  Object.entries(cumulativeDmgMap).forEach(([k, v]) => { _liveDmg[k] = { name: v.name, totalDmg: v.totalDmg }; });
  Object.entries(bossDamageMap).forEach(([k, v]) => {
    if (!_liveDmg[k]) _liveDmg[k] = { name: v.name, totalDmg: 0 };
    _liveDmg[k].name = v.name;
    _liveDmg[k].totalDmg += v.totalDmg;
  });
  const dmgEntries = Object.values(_liveDmg)
    .sort((a, b) => b.totalDmg - a.totalDmg).slice(0, 3);
  let dmgRows = dmgEntries.length
    ? dmgEntries.map((e, i) => `<div class="ranking-row"><span class="ranking-medal">${medals[i]}</span><span class="ranking-name">${escapeHtml(e.name)}</span><span class="ranking-dmg">${e.totalDmg.toLocaleString()}</span></div>`).join('')
    : '<div class="ranking-empty">データなし</div>';

  const mpEntries = Object.values(users).filter(u => u.el)
    .map(u => ({ name: u.name || u.ipid, mp: u.mp ?? 0 }))
    .sort((a, b) => b.mp - a.mp).slice(0, 3);
  const mpRows = mpEntries.map((e, i) =>
    `<div class="ranking-row"><span class="ranking-medal">${medals[i]}</span><span class="ranking-name">${escapeHtml(e.name)}</span><span class="ranking-mp">${e.mp.toLocaleString()} MP</span></div>`
  ).join('');

  panel.innerHTML =
    `<div class="ranking-section-head ranking-section-dmg" onclick="showRankingModal('dmg')" onmousedown="event.stopPropagation()">⚔️ ダメージ<span class="ranking-all-btn">全順位</span><span class="ranking-reset" onclick="event.stopPropagation();resetRankingPanelPos()" title="位置リセット">↺</span><span class="ranking-close" onclick="event.stopPropagation();closeRankingPanel()">✕</span></div>` +
    dmgRows +
    `<div class="ranking-section-head ranking-section-mp" onclick="showRankingModal('mp')" onmousedown="event.stopPropagation()">💎 MP<span class="ranking-all-btn">全順位</span></div>` +
    mpRows;
}

function showRankingModal(type) {
  document.getElementById('rankingModal')?.remove();

  const medals = ['🥇', '🥈', '🥉'];
  const rankLabel = i => i < 3 ? medals[i] : `${i + 1}位`;

  const _liveDmg = {};
  Object.entries(cumulativeDmgMap).forEach(([k, v]) => { _liveDmg[k] = { name: v.name, totalDmg: v.totalDmg }; });
  Object.entries(bossDamageMap).forEach(([k, v]) => {
    if (!_liveDmg[k]) _liveDmg[k] = { name: v.name, totalDmg: 0 };
    _liveDmg[k].name = v.name;
    _liveDmg[k].totalDmg += v.totalDmg;
  });
  const dmgAll = Object.values(_liveDmg).sort((a, b) => b.totalDmg - a.totalDmg);
  const mpAll = Object.values(users).filter(u => u.el)
    .map(u => ({ name: u.name || u.ipid, mp: u.mp ?? 0 }))
    .sort((a, b) => b.mp - a.mp);

  const dmgRows = dmgAll.length
    ? dmgAll.map((e, i) => `<div class="ranking-row"><span class="ranking-medal">${rankLabel(i)}</span><span class="ranking-name">${escapeHtml(e.name)}</span><span class="ranking-dmg">${e.totalDmg.toLocaleString()}</span></div>`).join('')
    : '<div class="ranking-empty">データなし</div>';
  const mpRows = mpAll.length
    ? mpAll.map((e, i) => `<div class="ranking-row"><span class="ranking-medal">${rankLabel(i)}</span><span class="ranking-name">${escapeHtml(e.name)}</span><span class="ranking-mp">${e.mp.toLocaleString()} MP</span></div>`).join('')
    : '<div class="ranking-empty">データなし</div>';

  const overlay = document.createElement('div');
  overlay.id = 'rankingModal';
  overlay.className = 'ranking-modal-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  overlay.innerHTML = `
    <div class="ranking-modal-box">
      <div class="ranking-modal-header">
        <span class="ranking-modal-title">${type === 'dmg' ? '⚔️ ダメージ' : '💎 MP'} ランキング</span>
        <span class="ranking-modal-close" onclick="document.getElementById('rankingModal').remove()">✕</span>
      </div>
      <div class="ranking-modal-tabs">
        <button class="ranking-modal-tab${type === 'dmg' ? ' active' : ''}" onclick="showRankingModal('dmg')">⚔️ ダメージ</button>
        <button class="ranking-modal-tab${type === 'mp' ? ' active' : ''}" onclick="showRankingModal('mp')">💎 MP</button>
      </div>
      <div class="ranking-modal-list">${type === 'dmg' ? dmgRows : mpRows}</div>
    </div>
  `;

  document.body.appendChild(overlay);
}

setInterval(() => {
  if (rankingState) renderRankingPanel();
}, 1000);

// ── パネル外観設定（もじあて・ランキング・クイズ） ──────────────────
function applyPanelSettings() {
  const s = document.getElementById('stage');
  if (!s) return;
  s.style.setProperty('--wordle-w',   wordlePanelWidth + 'px');
  s.style.setProperty('--wordle-bg',  (wordlePanelBgOpacity  / 100).toFixed(2));
  s.style.setProperty('--ranking-bg', (rankingPanelBgOpacity / 100).toFixed(2));
  s.style.setProperty('--quiz-bg',    (quizPanelBgOpacity    / 100).toFixed(2));
  const _p = (id, val, txt) => {
    const el = document.getElementById(id); if (!el) return;
    if (el.tagName === 'INPUT') el.value = val;
    const sp = document.getElementById(id.replace('Slider','Val')); if (sp) sp.textContent = txt;
  };
  _p('wordlePanelWidthSlider',   wordlePanelWidth,      wordlePanelWidth + 'px');
  _p('wordlePanelBgSlider',      wordlePanelBgOpacity,  wordlePanelBgOpacity + '%');
  _p('rankingPanelBgSlider',     rankingPanelBgOpacity, rankingPanelBgOpacity + '%');
  _p('quizPanelBgSlider',        quizPanelBgOpacity,    quizPanelBgOpacity + '%');
}

// ── ニューステッカー ────────────────────────────────────────────────
function _newsSourceClass(src) {
  if (src === 'Gigazine') return 'src-gigazine';
  if (src === 'Yahoo!')   return 'src-yahoo';
  if (src === 'NHK')      return 'src-nhk';
  return 'src-other';
}

function applyNewsTickerSettings() {
  const ticker = document.getElementById('newsTicker');
  if (!ticker) return;
  // 位置・サイズ
  ticker.style.left  = newsTickerX + '%';
  ticker.style.top   = newsTickerY + '%';
  ticker.style.width = newsTickerWidth + '%';
  // フォントサイズ CSS 変数
  ticker.style.setProperty('--ntf', newsTickerFontSize + 'px');
  // 背景透明度
  ticker.style.setProperty('--ntbg', (newsTickerBgOpacity / 100).toFixed(2));
  // 高さ
  if (newsTickerHeight > 0) {
    ticker.style.height = newsTickerHeight + 'px';
    ticker.style.setProperty('--ntrowh', newsTickerHeight + 'px');
    ticker.style.setProperty('--vtate-max-h', (newsTickerHeight - 20) + 'px');
  } else if (newsTickerMode === 'vtate') {
    const vtateH = Math.max(newsTickerRows * 100, 80);
    ticker.style.height = vtateH + 'px';
    ticker.style.setProperty('--ntrowh', vtateH + 'px');
    ticker.style.setProperty('--vtate-max-h', (vtateH - 20) + 'px');
  } else {
    const rowH = Math.max(30, newsTickerFontSize * 2.6);
    ticker.style.height = (newsTickerRows * rowH) + 'px';
    ticker.style.setProperty('--ntrowh', rowH + 'px');
  }
  // コントロール同期（存在する要素のみ）
  const _set = (id, val, txt) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'INPUT') el.value = val;
    const span = document.getElementById(id.replace('Slider','Val'));
    if (span) span.textContent = txt;
  };
  _set('newsTickerWidthSlider',     newsTickerWidth,     newsTickerWidth + '%');
  _set('newsTickerXSlider',         newsTickerX,         newsTickerX + '%');
  _set('newsTickerYSlider',         newsTickerY,         newsTickerY + '%');
  _set('newsTickerRowsSlider',      newsTickerRows,      newsTickerRows + '行');
  _set('newsTickerFontSlider',      newsTickerFontSize,  newsTickerFontSize + 'px');
  _set('newsTickerBgOpacitySlider', newsTickerBgOpacity, newsTickerBgOpacity + '%');
  _set('newsTickerSpeedSlider',     newsTickerSpeed,     newsTickerSpeed + '%');
  _set('newsTickerIntervalSlider',  newsTickerInterval,  newsTickerInterval + '秒');
  _set('newsTickerHeightSlider',    newsTickerHeight,    newsTickerHeight > 0 ? newsTickerHeight + 'px' : '自動');
  // モードボタン active 状態
  ['H','V','S','T'].forEach(m => {
    document.querySelectorAll('#newsTickerMode' + m + 'Btn').forEach(b => {
      b.classList.toggle('active', newsTickerMode === {H:'hscroll',V:'vscroll',S:'slide',T:'vtate'}[m]);
    });
  });
  // 縦書きクラス（先頭で取得済みの ticker を再利用）
  if (ticker) ticker.classList.toggle('tategaki', newsTickerTategaki);
  document.querySelectorAll('#newsTickerTategakiBtn').forEach(b => b.classList.toggle('active', newsTickerTategaki));
}

let _newsCachedItems = [];
let _newsModalData   = []; // クリック時のデータをインデックスで参照
let _newsSlideTimer  = null;
let _newsSlideIdx    = 0;
function _clearSlideTimer() { if (_newsSlideTimer) { clearInterval(_newsSlideTimer); _newsSlideTimer = null; } }

async function fetchNewsAndRender() {
  if (!newsTickerEnabled) return;
  try {
    const items = await fetch('/api/news').then(r => r.json());
    if (Array.isArray(items) && items.length > 0) _newsCachedItems = items;
  } catch(e) { console.warn('[news fetch]', e.message); }
  renderNewsTicker();
}

function renderNewsTicker() {
  if (!newsTickerEnabled) return;
  const items = _newsCachedItems;
  if (!items.length) return;
  const wrap = document.getElementById('newsTickerWrap');
  if (!wrap) return;
  _clearSlideTimer();
  applyNewsTickerSettings();
  wrap.innerHTML = '';
  _newsModalData = [];
  if      (newsTickerMode === 'vscroll') _renderVScroll(wrap, items);
  else if (newsTickerMode === 'slide')   _renderSlide(wrap, items);
  else if (newsTickerMode === 'vtate')   _renderVTate(wrap, items);
  else                                   _renderHScroll(wrap, items);
  applyNewsTickerSettings();
}

function _renderHScroll(wrap, items) {
  const rows = Math.max(1, Math.min(3, newsTickerRows));
  const perRow = Math.ceil(items.length / rows);
  for (let r = 0; r < rows; r++) {
    const rowItems = items.slice(r * perRow, (r + 1) * perRow);
    if (!rowItems.length) break;
    const rowEl = document.createElement('div');
    rowEl.className = 'news-ticker-row';
    const track = document.createElement('div');
    track.className = 'news-ticker-track';
    const baseIdx = _newsModalData.length;
    rowItems.forEach(i => _newsModalData.push(i));
    const makeHtml = () => rowItems.map((i, j) =>
      `<span class="news-ticker-item" onclick="openNewsModalByIdx(${baseIdx + j})">` +
      `<span class="news-source ${_newsSourceClass(i.source)}">${i.source}</span>${escapeHtml(i.title)}</span>`
    ).join('<span class="news-ticker-sep">✦</span>');
    const half = makeHtml();
    track.innerHTML = half + '<span class="news-ticker-sep">✦</span>' + half;
    track.style.animation = 'none';
    rowEl.appendChild(track);
    wrap.appendChild(rowEl);
    const totalChars = rowItems.reduce((s, i) => s + i.title.length, 0);
    const speedFactor = Math.max(0.1, newsTickerSpeed / 100);
    const duration = Math.max(5, (totalChars * 0.22 + r * 8) / speedFactor);
    requestAnimationFrame(() => { void track.offsetWidth; track.style.animation = `newsTickerScroll ${duration}s linear infinite`; });
  }
}

function _renderVScroll(wrap, items) {
  items.forEach(i => _newsModalData.push(i));
  const track = document.createElement('div');
  track.className = 'news-ticker-vtrack';
  const makeItem = (item, idx) =>
    `<div class="news-ticker-vitem" onclick="openNewsModalByIdx(${idx})">` +
    `<span class="news-source ${_newsSourceClass(item.source)}">${item.source}</span>` +
    `<span class="news-ticker-vitem-title">${escapeHtml(item.title)}</span></div>`;
  const half = items.map((item, i) => makeItem(item, i)).join('');
  track.innerHTML = half + half;
  track.style.animation = 'none';
  wrap.appendChild(track);
  const speedFactor = Math.max(0.1, newsTickerSpeed / 100);
  const duration = Math.max(5, items.length * 2.5 / speedFactor);
  requestAnimationFrame(() => { void track.offsetWidth; track.style.animation = `newsTickerVScroll ${duration}s linear infinite`; });
}

function _renderVTate(wrap, items) {
  items.forEach(i => _newsModalData.push(i));
  const track = document.createElement('div');
  track.className = 'news-ticker-vtate-track';
  const makeItem = (item, idx) => {
    const el = document.createElement('div');
    el.className = 'news-ticker-vtate-item';
    el.onclick = () => openNewsModalByIdx(idx);
    const src = document.createElement('span');
    src.className = `news-source ${_newsSourceClass(item.source)}`;
    src.textContent = item.source;
    const t = document.createElement('span');
    t.className = 'news-ticker-vtate-title';
    t.textContent = item.title;
    el.append(src, t);
    return el;
  };
  items.forEach((item, i) => track.appendChild(makeItem(item, i)));
  items.forEach((item, i) => track.appendChild(makeItem(item, i)));
  track.style.animation = 'none';
  wrap.appendChild(track);
  const speedFactor = Math.max(0.1, newsTickerSpeed / 100);
  const duration = Math.max(5, items.length * 4.0 / speedFactor);
  requestAnimationFrame(() => { void track.offsetWidth; track.style.animation = `newsTickerVTateScroll ${duration}s linear infinite`; });
}

function _renderSlide(wrap, items) {
  items.forEach(i => _newsModalData.push(i));
  _newsSlideIdx = 0;
  const slideWrap = document.createElement('div');
  slideWrap.className = 'news-ticker-slide-wrap';
  wrap.appendChild(slideWrap);
  const makeEl = (idx, entering) => {
    const item = items[idx];
    const el = document.createElement('div');
    el.className = 'news-ticker-slide-item' + (entering ? ' nt-entering' : '');
    el.onclick = () => openNewsModalByIdx(idx);
    const src = document.createElement('span');
    src.className = `news-source ${_newsSourceClass(item.source)}`;
    src.textContent = item.source;
    const t = document.createElement('span');
    t.className = 'news-ticker-slide-title';
    t.textContent = item.title;
    el.append(src, t);
    return el;
  };
  let cur = makeEl(0, false);
  slideWrap.appendChild(cur);
  _newsSlideTimer = setInterval(() => {
    _newsSlideIdx = (_newsSlideIdx + 1) % items.length;
    cur.classList.add('nt-leaving');
    const next = makeEl(_newsSlideIdx, true);
    slideWrap.appendChild(next);
    setTimeout(() => { cur.remove(); cur = next; }, 600);
  }, Math.max(3, newsTickerInterval) * 1000);
}

function openNewsModalByIdx(idx) {
  const d = _newsModalData[idx];
  if (d) openNewsModal(d.link, d.title, d.source);
}

function openNewsModal(url, title, source) {
  document.getElementById('newsModalOverlay')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'newsModalOverlay';
  overlay.className = 'news-modal-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  const srcClass = _newsSourceClass(source || '');
  const box = document.createElement('div');
  box.className = 'news-modal-box';
  // header
  const header = document.createElement('div');
  header.className = 'news-modal-header';
  const srcBadge = document.createElement('span');
  srcBadge.className = `news-modal-source ${srcClass}`;
  srcBadge.textContent = source || '';
  const titleEl = document.createElement('span');
  titleEl.className = 'news-modal-title-text';
  titleEl.textContent = title;
  const openBtn = document.createElement('button');
  openBtn.className = 'news-modal-open-btn';
  openBtn.title = '外部ブラウザで開く';
  openBtn.textContent = '↗';
  openBtn.onclick = () => fetch('/api/open-url?url=' + encodeURIComponent(url));
  const closeBtn = document.createElement('span');
  closeBtn.className = 'news-modal-close';
  closeBtn.textContent = '✕';
  closeBtn.onclick = () => overlay.remove();
  header.append(srcBadge, titleEl, openBtn, closeBtn);
  // 埋め込み不可サイトが多いためiframeを廃止し、リンクボタンのみ表示
  const body = document.createElement('div');
  body.className = 'news-modal-body';
  const titleBig = document.createElement('div');
  titleBig.className = 'news-modal-body-title';
  titleBig.textContent = title;
  const linkBtn = document.createElement('button');
  linkBtn.className = 'news-modal-link-btn';
  linkBtn.textContent = '🔗 記事を開く';
  linkBtn.onclick = () => fetch('/api/open-url?url=' + encodeURIComponent(url));
  body.append(titleBig, linkBtn);
  box.append(header, body);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

setInterval(() => { if (newsTickerEnabled) fetchNewsAndRender(); }, 5 * 60 * 1000);

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
  document.getElementById('hayaoshiFreqReset')?.addEventListener('click', () => {
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
  document.getElementById('hayaoshiSpeedReset')?.addEventListener('click', () => {
    slider.value = 8; slider.dispatchEvent(new Event('input'));
  });
})();

// ── Wordle ────────────────────────────────────────────────────────
let wordleWords      = [];
let wordleState      = null; // { answer, guesses[], panelX, panelY, winnerName }
wordleDragState  = null;
let wordleDisplayRows = parseInt(localStorage.getItem('wordleDisplayRows')) || 10;

(async function loadWordleWords() {
  try {
    const r = await fetch('/text/wordle.txt');
    const t = await r.text();
    wordleWords = t.split('\n')
      .map(l => [...l.trim()].slice(0, 5).join(''))
      .filter(w => [...w].length === 5);
    if (wordleWords.length > 0 && localStorage.getItem('wordleVisible') !== '0') startWordle();
  } catch {}
})();

function startWordle() {
  if (!wordleWords.length) return;
  const panelX = parseInt(localStorage.getItem('wordlePanelX')) || 10;
  const panelY = parseInt(localStorage.getItem('wordlePanelY')) || 10;
  wordleState = {
    answer:    wordleWords[Math.floor(Math.random() * wordleWords.length)],
    guesses:   [],
    panelX, panelY,
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
      const r  = panel.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      wordleDragState = { ox: r.left - sr.left, oy: r.top - sr.top, sx: e.clientX, sy: e.clientY };
      e.preventDefault(); e.stopPropagation();
    });
  }

  panel.style.left = wordleState.panelX + 'px';
  panel.style.top  = wordleState.panelY + 'px';
  const { answer, guesses, winnerName } = wordleState;
  const won  = winnerName !== null;
  const over = won || guesses.length >= MAX_GUESSES;

  // 表示する行: 最新DISPLAY_ROWS件（足りなければ空行で埋める）
  const showStart  = Math.max(0, guesses.length - DISPLAY_ROWS);
  const showGuesses = guesses.slice(showStart);  // 最新4行分の推測

  let html = `<div class="wordle-header">
    <div class="wordle-header-title">
      <span>もじあてｗ</span>
    </div>
    <span class="wordle-count">${guesses.length}/${MAX_GUESSES}</span>
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
quizDragState = null;

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
    if (quizQuestions.length > 0 && localStorage.getItem('quizVisible') === '1') startQuiz();
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
  // 表記揺れ対応：回答の4文字以上の連続部分文字列がコメントに含まれていれば正解
  if (a.length >= 4) {
    for (let i = 0; i <= a.length - 4; i++) {
      if (g.includes(a.slice(i, i + 4))) return true;
    }
  }
  return false;
}

function startQuiz() {
  if (!quizQuestions.length) return;
  const panelX = parseInt(localStorage.getItem('quizPanelX')) || 10;
  const panelY = parseInt(localStorage.getItem('quizPanelY')) || 80;
  quizState = { panelX, panelY };
  localStorage.setItem('quizVisible', '1');
  nextQuizQuestion();
}

function stopQuiz() {
  if (!quizState) return;
  clearInterval(quizState.timer);
  quizState = null;
  localStorage.setItem('quizVisible', '0');
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

  if (!brAutoEnabled) {
    panel.innerHTML = '<div class="brt-title">⏰ 次のBR</div><div class="brt-time" style="color:#ef4444;font-size:13px">自動OFF</div>';
    return;
  }
  const remaining = Math.max(0, brNextAutoAt - Date.now());
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  panel.innerHTML = `<div class="brt-title">⏰ 次のBR</div><div class="brt-time">${mins}:${String(secs).padStart(2, '0')}</div>`;
}

setInterval(renderBRTimerPanel, 1000);

document.getElementById('brTimerBtn')?.addEventListener('click', () => {
  brTimerVisible = !brTimerVisible;
  localStorage.setItem('brTimerVisible', brTimerVisible ? '1' : '0');
  document.getElementById('brTimerBtn').classList.toggle('active', brTimerVisible);
  renderBRTimerPanel();
});

document.getElementById('hideEquipBtn')?.addEventListener('click', () => {
  equipHidden = !equipHidden;
  stage.classList.toggle('equip-hidden', equipHidden);
  document.getElementById('hideEquipBtn').classList.toggle('active', equipHidden);
});

document.getElementById('toggleBombBtn')?.addEventListener('click', () => {
  bombHidden = !bombHidden;
  document.getElementById('bombBtn').style.display = bombHidden ? 'none' : '';
  document.getElementById('toggleBombBtn').classList.toggle('active', bombHidden);
  localStorage.setItem('bombHidden', bombHidden);
  saveSettingsToServer();
});

document.getElementById('toggleTrashBtn')?.addEventListener('click', () => {
  trashHidden = !trashHidden;
  document.getElementById('trashCan').style.display = trashHidden ? 'none' : '';
  document.getElementById('toggleTrashBtn').classList.toggle('active', trashHidden);
  localStorage.setItem('trashHidden', trashHidden);
  saveSettingsToServer();
});

document.getElementById('toggleStatsBtn')?.addEventListener('click', () => {
  charStatsHidden = !charStatsHidden;
  document.body.classList.toggle('stats-hidden', charStatsHidden);
  document.getElementById('toggleStatsBtn').classList.toggle('active', charStatsHidden);
  localStorage.setItem('charStatsHidden', charStatsHidden);
  saveSettingsToServer();
});

document.getElementById('toggleBreatheBtn')?.addEventListener('click', () => {
  breatheDisabled = !breatheDisabled;
  document.body.classList.toggle('no-breathe', breatheDisabled);
  document.getElementById('toggleBreatheBtn').classList.toggle('active', breatheDisabled);
  localStorage.setItem('breatheDisabled', breatheDisabled);
  saveSettingsToServer();
});

document.getElementById('toggleBossFloatBtn')?.addEventListener('click', () => {
  bossFloatDisabled = !bossFloatDisabled;
  document.body.classList.toggle('no-boss-float', bossFloatDisabled);
  document.getElementById('toggleBossFloatBtn').classList.toggle('active', bossFloatDisabled);
  localStorage.setItem('bossFloatDisabled', bossFloatDisabled);
  saveSettingsToServer();
});

document.getElementById('toggleNewsTickerBtn')?.addEventListener('click', () => {
  newsTickerEnabled = !newsTickerEnabled;
  const ticker = document.getElementById('newsTicker');
  if (ticker) {
    if (newsTickerEnabled) {
      ticker.classList.remove('hidden');
      applyNewsTickerSettings();
      fetchNewsAndRender();
    } else {
      ticker.classList.add('hidden');
    }
  }
  document.querySelectorAll('#toggleNewsTickerBtn').forEach(btn => btn.classList.toggle('active', newsTickerEnabled));
  localStorage.setItem('newsTickerEnabled', newsTickerEnabled);
  saveSettingsToServer();
});

// ニューステッカー各種スライダー
(function() {
  function ntSave(key, val) { localStorage.setItem(key, val); saveSettingsToServer(); }
  document.getElementById('newsTickerWidthSlider')?.addEventListener('input', function() {
    newsTickerWidth = parseInt(this.value); ntSave('newsTickerWidth', newsTickerWidth); applyNewsTickerSettings();
  });
  document.getElementById('newsTickerXSlider')?.addEventListener('input', function() {
    newsTickerX = parseInt(this.value); ntSave('newsTickerX', newsTickerX); applyNewsTickerSettings();
  });
  document.getElementById('newsTickerYSlider')?.addEventListener('input', function() {
    newsTickerY = parseInt(this.value); ntSave('newsTickerY', newsTickerY); applyNewsTickerSettings();
  });
  document.getElementById('newsTickerRowsSlider')?.addEventListener('input', function() {
    newsTickerRows = parseInt(this.value); ntSave('newsTickerRows', newsTickerRows); renderNewsTicker();
  });
  document.getElementById('newsTickerFontSlider')?.addEventListener('input', function() {
    newsTickerFontSize = parseInt(this.value); ntSave('newsTickerFontSize', newsTickerFontSize); applyNewsTickerSettings();
  });
  document.getElementById('newsTickerBgOpacitySlider')?.addEventListener('input', function() {
    newsTickerBgOpacity = parseInt(this.value); ntSave('newsTickerBgOpacity', newsTickerBgOpacity); applyNewsTickerSettings();
  });
  document.getElementById('newsTickerSpeedSlider')?.addEventListener('input', function() {
    newsTickerSpeed = parseInt(this.value); ntSave('newsTickerSpeed', newsTickerSpeed);
    applyNewsTickerSettings();
    if (newsTickerEnabled) renderNewsTicker();
  });
  document.getElementById('newsTickerIntervalSlider')?.addEventListener('input', function() {
    newsTickerInterval = parseInt(this.value); ntSave('newsTickerInterval', newsTickerInterval);
    applyNewsTickerSettings();
    if (newsTickerEnabled && newsTickerMode === 'slide') renderNewsTicker();
  });
})();

// パネル外観スライダー
(function() {
  function ppSave(key, val) { localStorage.setItem(key, val); saveSettingsToServer(); }
  document.getElementById('wordlePanelWidthSlider')?.addEventListener('input', function() {
    wordlePanelWidth = parseInt(this.value); ppSave('wordlePanelWidth', wordlePanelWidth); applyPanelSettings();
  });
  document.getElementById('wordlePanelBgSlider')?.addEventListener('input', function() {
    wordlePanelBgOpacity = parseInt(this.value); ppSave('wordlePanelBgOpacity', wordlePanelBgOpacity); applyPanelSettings();
  });
  document.getElementById('rankingPanelBgSlider')?.addEventListener('input', function() {
    rankingPanelBgOpacity = parseInt(this.value); ppSave('rankingPanelBgOpacity', rankingPanelBgOpacity); applyPanelSettings();
  });
  document.getElementById('quizPanelBgSlider')?.addEventListener('input', function() {
    quizPanelBgOpacity = parseInt(this.value); ppSave('quizPanelBgOpacity', quizPanelBgOpacity); applyPanelSettings();
  });
})();

// ダメージ文字サイズスライダー
document.getElementById('dmgFontScaleSlider')?.addEventListener('input', function() {
  dmgFontScale = parseInt(this.value);
  localStorage.setItem('dmgFontScale', dmgFontScale);
  saveSettingsToServer();
  document.querySelectorAll('#dmgFontScaleVal').forEach(s => s.textContent = dmgFontScale + '%');
});

// 縦書きトグル
document.querySelectorAll('#newsTickerTategakiBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    newsTickerTategaki = !newsTickerTategaki;
    localStorage.setItem('newsTickerTategaki', newsTickerTategaki);
    saveSettingsToServer();
    applyNewsTickerSettings();
    if (newsTickerEnabled) renderNewsTicker();
  });
});

// ニューステッカー表示モード切り替え
['H','V','S','T'].forEach(m => {
  const modeMap = {H:'hscroll', V:'vscroll', S:'slide', T:'vtate'};
  document.querySelectorAll('#newsTickerMode' + m + 'Btn').forEach(btn => {
    btn.addEventListener('click', () => {
      newsTickerMode = modeMap[m];
      localStorage.setItem('newsTickerMode', newsTickerMode);
      saveSettingsToServer();
      applyNewsTickerSettings();
      if (newsTickerEnabled) renderNewsTicker();
    });
  });
});

document.getElementById('toggleCharNameBtn')?.addEventListener('click', () => {
  charNameHidden = !charNameHidden;
  document.body.classList.toggle('char-name-hidden', charNameHidden);
  document.getElementById('toggleCharNameBtn').classList.toggle('active', charNameHidden);
  localStorage.setItem('charNameHidden', charNameHidden);
  saveSettingsToServer();
});

// 保存された表示状態を復元
if (bombHidden)       { document.getElementById('bombBtn').style.display  = 'none'; document.getElementById('toggleBombBtn')?.classList.add('active'); }
if (trashHidden)      { document.getElementById('trashCan').style.display = 'none'; document.getElementById('toggleTrashBtn')?.classList.add('active'); }
if (charStatsHidden)  { document.body.classList.add('stats-hidden'); document.getElementById('toggleStatsBtn')?.classList.add('active'); }
if (breatheDisabled)   { document.body.classList.add('no-breathe');    document.getElementById('toggleBreatheBtn')?.classList.add('active'); }
if (bossFloatDisabled) { document.body.classList.add('no-boss-float'); document.getElementById('toggleBossFloatBtn')?.classList.add('active'); }
if (charNameHidden)    { document.body.classList.add('char-name-hidden'); document.getElementById('toggleCharNameBtn')?.classList.add('active'); }
applyNewsTickerSettings();
applyPanelSettings();
(function() {
  const el = document.getElementById('dmgFontScaleSlider');
  if (el) { el.value = dmgFontScale; document.querySelectorAll('#dmgFontScaleVal').forEach(s => s.textContent = dmgFontScale + '%'); }
})();
if (newsTickerEnabled) {
  document.getElementById('newsTicker').classList.remove('hidden');
  document.getElementById('toggleNewsTickerBtn')?.classList.add('active');
  fetchNewsAndRender();
}

document.getElementById('slotSoundBtn')?.addEventListener('click', () => {
  slotSoundEnabled = !slotSoundEnabled;
  document.getElementById('slotSoundBtn').classList.toggle('active', !slotSoundEnabled);
  localStorage.setItem('slotSoundEnabled', slotSoundEnabled ? '1' : '0');
});
(function initSlotSound() {
  const saved = localStorage.getItem('slotSoundEnabled');
  if (saved === '0') {
    slotSoundEnabled = false;
    document.getElementById('slotSoundBtn')?.classList.add('active');
  }
})();

document.getElementById('slotAllStartBtn')?.addEventListener('click', () => {
  Object.values(users).filter(u => u.el && !u.slotAutoMode && !u.slotSpinning).forEach(u => {
    if ((u.mp ?? 0) < 1) return;
    u.slotAutoMode = true;
    u.mp -= 1;
    updateStatsDisplay(u);
    playSlot(u);
  });
});

document.getElementById('slotAllStopBtn')?.addEventListener('click', () => {
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
  sdCfgScale       = parseFloat(load('sdCfgScale', 3));
  sdSampler        = load('sdSampler', 'Euler a');
  charExcludeIds   = new Set((localStorage.getItem('charExcludeIds') || '').split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0));

  const sdPopWidth = parseInt(load('sdPopWidth', 480));
  const _sdSet = (id, prop, val) => { const e = document.getElementById(id); if (e) e[prop] = val; };
  _sdSet('sdWidthInput',           'value',       sdWidth);
  _sdSet('sdHeightInput',          'value',       sdHeight);
  _sdSet('sdStepsSlider',          'value',       sdSteps);
  _sdSet('sdStepsVal',             'textContent', sdSteps);
  _sdSet('sdPopWidthSlider',       'value',       sdPopWidth);
  _sdSet('sdPopWidthVal',          'textContent', sdPopWidth + 'px');
  _sdSet('sdPositiveSuffixInput',  'value',       sdPositiveSuffix);
  _sdSet('sdNegativeInput',        'value',       sdNegative);
  _sdSet('sdDisplayTimeSlider',    'value',       sdDisplayTime);
  _sdSet('sdDisplayTimeVal',       'textContent', sdDisplayTime + '秒');
  _sdSet('sdMosaicKeywordsInput',  'value',       sdMosaicKeywords);
  _sdSet('sdMosaicBlockSlider',    'value',       sdMosaicBlock);
  _sdSet('sdMosaicBlockVal',       'textContent', sdMosaicBlock + 'px');
  _sdSet('sdCfgScaleInput',        'value',       sdCfgScale);
  _sdSet('sdSamplerInput',         'value',       sdSampler);
})();

// SD設定: DOM が信頼できる値の源。変更のたびに localStorage＆サーバーへ保存。
const _sdSave = (key, val) => { localStorage.setItem(key, val); saveSettingsToServer(); };
document.getElementById('sdWidthInput')?.addEventListener('change', e => _sdSave('sdWidth', e.target.value));
document.getElementById('sdHeightInput')?.addEventListener('change', e => _sdSave('sdHeight', e.target.value));
document.getElementById('sdStepsSlider')?.addEventListener('input', e => {
  document.getElementById('sdStepsVal').textContent = e.target.value;
  _sdSave('sdSteps', e.target.value);
});
document.getElementById('sdPopWidthSlider')?.addEventListener('input', e => {
  document.getElementById('sdPopWidthVal').textContent = e.target.value + 'px';
  _sdSave('sdPopWidth', e.target.value);
});
document.getElementById('sdDisplayTimeSlider')?.addEventListener('input', e => {
  document.getElementById('sdDisplayTimeVal').textContent = e.target.value + '秒';
  _sdSave('sdDisplayTime', e.target.value);
});
document.getElementById('sdPositiveSuffixInput')?.addEventListener('change', e => _sdSave('sdPositiveSuffix', e.target.value));
document.getElementById('sdNegativeInput')?.addEventListener('change',       e => _sdSave('sdNegative', e.target.value));
document.getElementById('sdMosaicKeywordsInput')?.addEventListener('change', e => _sdSave('sdMosaicKeywords', e.target.value));
document.getElementById('sdMosaicBlockSlider')?.addEventListener('input', e => {
  document.getElementById('sdMosaicBlockVal').textContent = e.target.value + 'px';
  _sdSave('sdMosaicBlock', e.target.value);
});
document.getElementById('sdCfgScaleInput')?.addEventListener('change', e => _sdSave('sdCfgScale', e.target.value));
document.getElementById('sdSamplerInput')?.addEventListener('change',  e => _sdSave('sdSampler', e.target.value));

document.getElementById('brAutoBtn')?.addEventListener('click', () => {
  brAutoEnabled = !brAutoEnabled;
  document.getElementById('brAutoBtn').classList.toggle('active', !brAutoEnabled);
});

// ── 早押しゲーム ──────────────────────────────────────────────────
let hayaoshiItems = []; // { type:'white'|'red', keyword, timeoutId } — 複数同時対応
const HAYAOSHI_FALLBACK = ['スター','ライブ','ゲーム','アニメ','サクラ','ハート','カワイイ','スゴイ'];

function startHayaoshi() {
  if (agruBattleActive) return;
  // ボタン押下：手動で赤を1回流す
  startHayaoshiAutoRed();
}

function startHayaoshiAutoWhite() {
  if (agruBattleActive) return;
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
  if (agruBattleActive) return;
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
  if (agruBattleActive) return;
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
  } else {
    user.equips.push(newEquip);
    showBubble(user, `${newEquip.icon}${newEquip.name}[${newEquip.rarityName}]入手！`, {});
  }
  // HP +30
  user.hp = Math.min(calcMaxHp(user), (user.hp ?? 30) + 30);
  updateEquipBadge(user);
  updateStatsDisplay(user);
  if (existing) {
    const area = user.el?.querySelector('.char-equip-area');
    const badge = area && [...area.querySelectorAll('.char-equip-badge')]
      .find(b => b.title.startsWith(existing.name + '['));
    if (badge) showEquipSynthPop(badge, existing);
    const { x: ex, y: ey } = getCharCenter(user);
    showDamageNumber(ex, ey - 40, `${existing.stat === 'atk' ? 'ATK' : 'HP'}+${existing.value}`, false, 14, '#fbbf24');
  }

  addSystemLog(`💎 ${user.name} が宝箱ゲット！ ${newEquip.icon}${newEquip.name}[${newEquip.rarityName}] HP+30`, '#fbbf24');
  if (typeof checkTitles === 'function') setTimeout(() => checkTitles(user), 200);
}

function showTreasureOverlay(user) {
  const wrap = user?.el?.querySelector('.avatar-wrap');
  if (!wrap) return;
  const prev = wrap.querySelector('.treasure-char-overlay');
  if (prev) prev.remove();
  const ov = document.createElement('div');
  ov.className = 'treasure-char-overlay';
  ov.innerHTML = `💎お宝ゲット！💎<span class="tco-name">${escapeHtml(user.name || '名無し')}</span>`;
  wrap.appendChild(ov);
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

// ── 管理ウィンドウ ボタン直接ディスパッチ（DOM要素が存在しない場合） ──
function _adminBtnDispatch(id) {
  if (id === 'clearStage') {
    if (brState) { clearTimeout(brState.autoTimer); clearInterval(brState.escalateTimer); brState = null; }
    Object.values(users).forEach(u => {
      if (u.el) u.el.remove();
      if (u.moveTimer)   clearTimeout(u.moveTimer);
      if (u.walkTimer)   clearTimeout(u.walkTimer);
      if (u.bubbleTimer) clearTimeout(u.bubbleTimer);
      if (u.motionTimer) clearTimeout(u.motionTimer);
    });
    users = {}; lastCnum = null;
    emptyHint.classList.remove('hidden');
  } else if (id === 'toggleLog') {
    document.getElementById('commentLog')?.classList.toggle('hidden');
  } else if (id === 'gatherBtn')       { gatherCharacters(); }
  else if (id === 'gatherBottomBtn')   { gatherCharactersBottom(); }
  else if (id === 'compactBtn')        { setCompactMode(!compactMode); }
  else if (id === 'fiveMinBtn')        { setFiveMinMode(!fiveMinMode); }
  else if (id === 'hayaoshiBtn')       { startHayaoshi(); }
  else if (id === 'wordleBtn') {
    const panel = document.getElementById('wordlePanel');
    if (panel) { panel.remove(); wordleState = null; localStorage.setItem('wordleVisible', '0'); }
    else if (wordleWords.length > 0)   { localStorage.setItem('wordleVisible', '1'); startWordle(); }
  } else if (id === 'quizBtn') {
    if (quizState) stopQuiz(); else if (quizQuestions.length > 0) startQuiz();
  } else if (id === 'moveLockBtn') {
    moveLocked = !moveLocked;
    if (moveLocked) Object.values(users).forEach(u => {
      u.movement = '止まれ';
      if (u.moveTimer) { clearTimeout(u.moveTimer); u.moveTimer = null; }
      if (u.el) u.el.classList.remove('walking');
    });
  } else if (id === 'debugBtn') {
    debugMode = !debugMode;
    Object.values(users).forEach(u => updateStatsDisplay(u));
  } else if (id === 'debugMpBtn') {
    Object.values(users).forEach(u => { u.mp = (u.mp ?? 0) + 30; updateStatsDisplay(u); });
  } else if (id === 'battleRoyaleBtn') { startBattleRoyale(); }
  else if (id === 'spikiBossBtn')      { spawnSpikiBoss(); }
  else if (id === 'dismissBossBtn') {
    if (!bossState) return;
    bossManuallyCleared = true;
    if (bossState.el) {
      const bx = parseInt(bossState.el.style.left) || 0, by = parseInt(bossState.el.style.top) || 0;
      localStorage.setItem(panelKey('bossX'), bx); localStorage.setItem(panelKey('bossY'), by);
      bossLastPos = { x: bx, y: by };
      bossState.defeated = true;
      bossState.el.style.transition = 'transform 0.4s ease-in, opacity 0.4s ease-in';
      bossState.el.style.transform  = 'scale(0) rotate(15deg)';
      bossState.el.style.opacity    = '0';
      setTimeout(() => { bossState?.el?.remove(); bossState = null; }, 450);
    } else { bossState.defeated = true; bossState = null; }
    document.getElementById('bossSpeech')?.remove();
  } else if (id === 'stopAllBtn') {
    Object.values(users).forEach(u => {
      u.movement = '止まれ';
      if (u.moveTimer) { clearTimeout(u.moveTimer); u.moveTimer = null; }
      if (u.el) u.el.style.transition = 'none';
      stopWalk(u); applyMotion(u, null);
    });
  } else if (id === 'brTimerBtn') {
    brTimerVisible = !brTimerVisible;
    localStorage.setItem('brTimerVisible', brTimerVisible ? '1' : '0');
    renderBRTimerPanel();
  } else if (id === 'brAutoBtn') {
    brAutoEnabled = !brAutoEnabled;
  } else if (id === 'slotSoundBtn') {
    slotSoundEnabled = !slotSoundEnabled;
    localStorage.setItem('slotSoundEnabled', slotSoundEnabled ? '1' : '0');
  } else if (id === 'slotAllStartBtn') {
    Object.values(users).filter(u => u.el && !u.slotAutoMode && !u.slotSpinning).forEach(u => {
      if ((u.mp ?? 0) < 1) return;
      u.slotAutoMode = true; u.mp -= 1; updateStatsDisplay(u); playSlot(u);
    });
  } else if (id === 'slotAllStopBtn') {
    Object.values(users).filter(u => u.el).forEach(u => { u.slotAutoMode = false; });
  } else if (id === 'toggleBombBtn') {
    bombHidden = !bombHidden;
    document.getElementById('bombBtn').style.display = bombHidden ? 'none' : '';
    localStorage.setItem('bombHidden', bombHidden); saveSettingsToServer();
  } else if (id === 'toggleTrashBtn') {
    trashHidden = !trashHidden;
    document.getElementById('trashCan').style.display = trashHidden ? 'none' : '';
    localStorage.setItem('trashHidden', trashHidden); saveSettingsToServer();
  } else if (id === 'toggleStatsBtn') {
    charStatsHidden = !charStatsHidden;
    document.body.classList.toggle('stats-hidden', charStatsHidden);
    localStorage.setItem('charStatsHidden', charStatsHidden); saveSettingsToServer();
  } else if (id === 'toggleBreatheBtn') {
    breatheDisabled = !breatheDisabled;
    document.body.classList.toggle('no-breathe', breatheDisabled);
    localStorage.setItem('breatheDisabled', breatheDisabled); saveSettingsToServer();
  } else if (id === 'toggleBossFloatBtn') {
    bossFloatDisabled = !bossFloatDisabled;
    document.body.classList.toggle('no-boss-float', bossFloatDisabled);
    localStorage.setItem('bossFloatDisabled', bossFloatDisabled); saveSettingsToServer();
  } else if (id === 'toggleCharNameBtn') {
    charNameHidden = !charNameHidden;
    document.body.classList.toggle('char-name-hidden', charNameHidden);
    localStorage.setItem('charNameHidden', charNameHidden); saveSettingsToServer();
  } else if (id === 'toggleNewsTickerBtn') {
    newsTickerEnabled = !newsTickerEnabled;
    const ticker = document.getElementById('newsTicker');
    if (ticker) {
      if (newsTickerEnabled) { ticker.classList.remove('hidden'); applyNewsTickerSettings(); fetchNewsAndRender(); }
      else ticker.classList.add('hidden');
    }
    localStorage.setItem('newsTickerEnabled', newsTickerEnabled); saveSettingsToServer();
  } else if (id === 'hideEquipBtn') {
    equipHidden = !equipHidden;
    stage.classList.toggle('equip-hidden', equipHidden);
  } else if (id === 'openImgModal') { openModal(); }
  else if (id === 'copyObsUrl') {
    navigator.clipboard.writeText(`${location.origin}/?obs=1`).catch(() => {});
  }
}

// ── 管理ウィンドウ（BroadcastChannel + WebSocket） ────────────────────
function handleAdminMessage(d, replyFn) {
  if (d.type === 'click' && d.id) {
    const _clickEl = document.getElementById(d.id);
    if (_clickEl) _clickEl.click(); else _adminBtnDispatch(d.id);
    if (d.id === 'fiveMinBtn') replyFn({ type: 'state', data: { fiveMinMode } });
    if (d.id === 'brAutoBtn')  replyFn({ type: 'state', data: { brAutoEnabled } });
  } else if (d.type === 'slider' && d.id) {
    const el = document.getElementById(d.id);
    if (el) { el.value = d.value; el.dispatchEvent(new Event('input')); }
    if (d.id === 'gatherRowMaxSlider') {
      gatherRowMax = Math.max(1, parseInt(d.value) || 10);
      localStorage.setItem('gatherRowMax', gatherRowMax);
      saveSettingsToServer();
    } else if (d.id === 'gatherMarginLeftSlider') {
      gatherMarginLeft = parseInt(d.value) || 0;
      localStorage.setItem('gatherMarginLeft', gatherMarginLeft);
      saveSettingsToServer();
    } else if (d.id === 'gatherMarginRightSlider') {
      gatherMarginRight = parseInt(d.value) || 0;
      localStorage.setItem('gatherMarginRight', gatherMarginRight);
    } else if (d.id === 'gatherMarginBottomSlider') {
      gatherMarginBottom = parseInt(d.value) || 0;
      localStorage.setItem('gatherMarginBottom', gatherMarginBottom);
      saveSettingsToServer();
    } else if (d.id === 'contentModeGatherMarginBottomSlider') {
      contentModeGatherMarginBottom = parseInt(d.value) || 0;
      localStorage.setItem('contentModeGatherMarginBottom', contentModeGatherMarginBottom);
      saveSettingsToServer();
    } else if (d.id === 'contentModeGatherMarginLeftSlider') {
      contentModeGatherMarginLeft = parseInt(d.value) || 0;
      localStorage.setItem('contentModeGatherMarginLeft', contentModeGatherMarginLeft);
      saveSettingsToServer();
    } else if (d.id === 'contentModeGatherMarginRightSlider') {
      contentModeGatherMarginRight = parseInt(d.value) || 0;
      localStorage.setItem('contentModeGatherMarginRight', contentModeGatherMarginRight);
      saveSettingsToServer();
    } else if (d.id === 'contentModeCharSizePctSlider') {
      contentModeCharSizePct = parseInt(d.value) || 70;
      localStorage.setItem('contentModeCharSizePct', contentModeCharSizePct);
      saveSettingsToServer();
    } else if (d.id === 'contentModeBossSizePctSlider') {
      contentModeBossSizePct = parseInt(d.value) || 10;
      localStorage.setItem('contentModeBossSizePct', contentModeBossSizePct);
      saveSettingsToServer();
      if (contentMode && bossState?.el && contentModeBossSaved) {
        const ba = bossState.el.querySelector('#bossAvatar');
        if (ba) {
          const dispPx = Math.round(contentModeBossSaved.px * (contentModeBossSizePct / 100));
          ba.style.width    = dispPx + 'px';
          ba.style.height   = dispPx + 'px';
          ba.style.fontSize = Math.round(dispPx * 0.87) + 'px';
        }
      }
    } else if (d.id === 'hayaoshiFreqSlider') {
      hayaoshiFreq = parseInt(d.value) * 1000; localStorage.setItem('hayaoshiFreq', d.value);
    } else if (d.id === 'hayaoshiSpeedSlider') {
      hayaoshiSpeed = parseInt(d.value) * 1000; localStorage.setItem('hayaoshiSpeed', d.value);
    } else if (d.id === 'nikoSizeSlider') {
      nikoFontSize = parseInt(d.value); localStorage.setItem('nikoFontSize', nikoFontSize);
    } else if (d.id === 'nikoOpacitySlider') {
      nikoOpacity = d.value / 100; localStorage.setItem('nikoOpacity', nikoOpacity);
    } else if (d.id === 'bossHpScaleSlider') {
      bossHpScale = parseFloat(d.value); localStorage.setItem('bossHpScale', bossHpScale); saveSettingsToServer();
    } else if (d.id === 'bossAtkCoeffSlider') {
      bossAtkCoeff = parseInt(d.value); localStorage.setItem('bossAtkCoeff', bossAtkCoeff);
    } else if (d.id === 'counterRateSlider') {
      bossCounterRate = d.value / 100; localStorage.setItem('bossCounterRate', bossCounterRate);
    } else if (d.id === 'brHpMultSlider') {
      brHpMult = parseInt(d.value); localStorage.setItem('brHpMult', brHpMult); saveSettingsToServer();
    } else if (d.id === 'taimanHpMultSlider') {
      taimanHpMult = parseInt(d.value); localStorage.setItem('taimanHpMult', taimanHpMult); saveSettingsToServer();
    } else if (d.id === 'charSizeSlider') {
      charSizeScale = d.value / 100; localStorage.setItem('charSizeScale', charSizeScale); saveSettingsToServer();
      Object.values(users).forEach(u => { if (u.el) { applyAvatarStyle(u); renderPetBadge(u); } });
    } else if (d.id === 'bossSizeSlider') {
      bossSizeScale = d.value / 100; localStorage.setItem('bossSizeScale', bossSizeScale); saveSettingsToServer();
      if (bossState?.el) {
        const _ba = bossState.el.querySelector('#bossAvatar');
        if (_ba) {
          const _newPx = Math.round(200 * bossSizeScale);
          bossState.origSize = _newPx;
          const _dispPx = (contentMode && contentModeBossSaved) ? Math.round(_newPx * (contentModeBossSizePct / 100)) : _newPx;
          if (contentMode && contentModeBossSaved) contentModeBossSaved.px = _newPx;
          applyBossAvatarAspect(_dispPx);
        }
      }
    } else if (d.id === 'dmgFontScaleSlider') {
      dmgFontScale = parseInt(d.value); localStorage.setItem('dmgFontScale', dmgFontScale); saveSettingsToServer();
    } else if (d.id === 'newsTickerWidthSlider') {
      newsTickerWidth = parseInt(d.value); localStorage.setItem('newsTickerWidth', newsTickerWidth); saveSettingsToServer(); applyNewsTickerSettings();
    } else if (d.id === 'newsTickerXSlider') {
      newsTickerX = parseInt(d.value); localStorage.setItem('newsTickerX', newsTickerX); saveSettingsToServer(); applyNewsTickerSettings();
    } else if (d.id === 'newsTickerYSlider') {
      newsTickerY = parseInt(d.value); localStorage.setItem('newsTickerY', newsTickerY); saveSettingsToServer(); applyNewsTickerSettings();
    } else if (d.id === 'newsTickerRowsSlider') {
      newsTickerRows = parseInt(d.value); localStorage.setItem('newsTickerRows', newsTickerRows); saveSettingsToServer(); renderNewsTicker();
    } else if (d.id === 'newsTickerFontSlider') {
      newsTickerFontSize = parseInt(d.value); localStorage.setItem('newsTickerFontSize', newsTickerFontSize); saveSettingsToServer(); applyNewsTickerSettings();
    } else if (d.id === 'newsTickerBgOpacitySlider') {
      newsTickerBgOpacity = parseInt(d.value); localStorage.setItem('newsTickerBgOpacity', newsTickerBgOpacity); saveSettingsToServer(); applyNewsTickerSettings();
    } else if (d.id === 'newsTickerSpeedSlider') {
      newsTickerSpeed = parseInt(d.value); localStorage.setItem('newsTickerSpeed', newsTickerSpeed); saveSettingsToServer();
      applyNewsTickerSettings(); if (newsTickerEnabled) renderNewsTicker();
    } else if (d.id === 'newsTickerIntervalSlider') {
      newsTickerInterval = parseInt(d.value); localStorage.setItem('newsTickerInterval', newsTickerInterval); saveSettingsToServer();
      applyNewsTickerSettings(); if (newsTickerEnabled && newsTickerMode === 'slide') renderNewsTicker();
    } else if (d.id === 'newsTickerHeightSlider') {
      newsTickerHeight = parseInt(d.value); localStorage.setItem('newsTickerHeight', newsTickerHeight); saveSettingsToServer(); applyNewsTickerSettings();
    } else if (d.id === 'wordlePanelWidthSlider') {
      wordlePanelWidth = parseInt(d.value); localStorage.setItem('wordlePanelWidth', wordlePanelWidth); saveSettingsToServer(); applyPanelSettings();
    } else if (d.id === 'wordlePanelBgSlider') {
      wordlePanelBgOpacity = parseInt(d.value); localStorage.setItem('wordlePanelBgOpacity', wordlePanelBgOpacity); saveSettingsToServer(); applyPanelSettings();
    } else if (d.id === 'rankingPanelBgSlider') {
      rankingPanelBgOpacity = parseInt(d.value); localStorage.setItem('rankingPanelBgOpacity', rankingPanelBgOpacity); saveSettingsToServer(); applyPanelSettings();
    } else if (d.id === 'quizPanelBgSlider') {
      quizPanelBgOpacity = parseInt(d.value); localStorage.setItem('quizPanelBgOpacity', quizPanelBgOpacity); saveSettingsToServer(); applyPanelSettings();
    } else if (d.id === 'afkOpacitySlider') {
      afkOpacity = parseInt(d.value); localStorage.setItem('afkOpacity', afkOpacity);
      document.documentElement.style.setProperty('--afk-opacity', afkOpacity / 100);
    } else if (d.id === 'afkGrayscaleSlider') {
      afkGrayscale = parseInt(d.value); localStorage.setItem('afkGrayscale', afkGrayscale);
      document.documentElement.style.setProperty('--afk-grayscale', afkGrayscale / 100);
    } else if (d.id === 'afkBrightnessSlider') {
      afkBrightness = parseInt(d.value); localStorage.setItem('afkBrightness', afkBrightness);
      document.documentElement.style.setProperty('--afk-brightness', afkBrightness / 100);
    } else if (d.id === 'kaiSpeedSlider') {
      kaiSpeed = parseInt(d.value); localStorage.setItem('kaiSpeed', kaiSpeed);
    } else if (d.id === 'kaiRestitutionSlider') {
      kaiRestitution = d.value / 100; localStorage.setItem('kaiRestitution', d.value);
    } else if (d.id === 'kaiGravitySlider') {
      kaiGravity = d.value / 100; localStorage.setItem('kaiGravity', d.value);
    } else if (d.id === 'kaiBulletSizeSlider') {
      kaiBulletSize = parseInt(d.value); localStorage.setItem('kaiBulletSize', kaiBulletSize);
    } else if (d.id === 'autoDeleteMinutesSlider') {
      autoDeleteMinutes = parseInt(d.value) || 0; localStorage.setItem('autoDeleteMinutes', autoDeleteMinutes); saveSettingsToServer();
    } else if (d.id === 'seVolumeSlider') {
      seVolume = parseFloat(d.value); localStorage.setItem('seVolume', seVolume);
    } else if (d.id === 'voiceVolumeSlider') {
      voiceVolume = parseFloat(d.value); localStorage.setItem('voiceVolume', voiceVolume);
    }
    saveSettingsToServer();
  } else if (d.type === 'select' && d.id) {
    const el = document.getElementById(d.id);
    if (el) { el.value = d.value; el.dispatchEvent(new Event('change')); }
    else if (d.id === 'moveAreaSelect') {
      moveArea = MOVE_AREA_MAP[d.value] || MOVE_AREA_MAP['all'];
      localStorage.setItem('moveArea', d.value);
      saveSettingsToServer();
    }
  } else if (d.type === 'color' && d.id) {
    const el = document.getElementById(d.id);
    if (el) { el.value = d.value; el.dispatchEvent(new Event('input')); }
    else if (d.id === 'bgColor') {
      applyBgColor(d.value);
      localStorage.setItem('bgColor', d.value);
      saveSettingsToServer();
    }
  } else if (d.type === 'getState' || d.type === 'ping') {
    const sliderIds = ['nikoSizeSlider','nikoOpacitySlider','hayaoshiFreqSlider','hayaoshiSpeedSlider',
                       'bossHpScaleSlider','bossAtkCoeffSlider','counterRateSlider','charSizeSlider','bossSizeSlider','brHpMultSlider','taimanHpMultSlider',
                       'slotProbCherry','slotProbBell','slotProbStar','slotProbDiamond','slotProbJackpot',
                       'afkOpacitySlider','afkGrayscaleSlider','afkBrightnessSlider',
                       'kaiSpeedSlider','kaiRestitutionSlider','kaiGravitySlider','kaiBulletSizeSlider',
                       'dmgFontScaleSlider','wordlePanelWidthSlider','wordlePanelBgSlider','rankingPanelBgSlider','quizPanelBgSlider','newsTickerIntervalSlider'];
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
    state.taimanCooldown        = taimanCooldown;
    state.charAspectExp         = charAspectExp;
    state.charPortraitBoost     = charPortraitBoost;
    state.charStatsBottom       = charStatsBottom;
    state.charStatsLeft         = charStatsLeft;
    state.charEquipOffsetX      = charEquipOffsetX;
    state.charEquipOffsetY      = charEquipOffsetY;
    state.petSizeScale          = petSizeScale;
    state.petAspectExp          = petAspectExp;
    state.petPortraitBoost      = petPortraitBoost;
    state.jiggleConfig          = JSON.stringify(jiggleConfig);
    state.purupuruConfig        = JSON.stringify(purupuruConfig);
    state.gatherMarginLeftSlider      = gatherMarginLeft;
    state.gatherMarginRightSlider     = gatherMarginRight;
    state.gatherMarginBottomSlider    = gatherMarginBottom;
    state.gatherRowMaxSlider          = gatherRowMax;
    state.contentModeGatherMarginBottomSlider = contentModeGatherMarginBottom;
    state.contentModeGatherMarginLeftSlider   = contentModeGatherMarginLeft;
    state.contentModeGatherMarginRightSlider  = contentModeGatherMarginRight;
    state.contentModeCharSizePctSlider        = contentModeCharSizePct;
    state.contentModeBossSizePctSlider        = contentModeBossSizePct;
    state.slotMpJackpot = SLOT_OUTCOMES[0].mp;
    state.slotMpDiamond = SLOT_OUTCOMES[1].mp;
    state.slotMpStar    = SLOT_OUTCOMES[2].mp;
    state.slotMpBell    = SLOT_OUTCOMES[3].mp;
    state.slotMpCherry  = SLOT_OUTCOMES[4].mp;
    state.seVolume    = seVolume;
    state.voiceVolume = voiceVolume;
    state.aiModel    = aiModel;
    state.aiSystem   = aiSystem;
    state.ollamaReviewPrompt  = ollamaReviewPrompt;
    state.agruSystem             = agruSystem;
    state.agruVoicevoxEnabled    = agruVoicevoxEnabled ? '1' : '0';
    state.agruVoicevoxSpeaker    = agruVoicevoxSpeaker;
    state.agruVoicevoxSpeed      = agruVoicevoxSpeed;
    state.agruVoicevoxVolume     = agruVoicevoxVolume;
    state.agruSdWidth            = agruSdWidth;
    state.agruSdHeight           = agruSdHeight;
    state.agruSdSteps            = agruSdSteps;
    state.agruSdCfgScale         = agruSdCfgScale;
    state.agruSdPositiveSuffix   = agruSdPositiveSuffix;
    state.agruIdleDelay          = agruIdleDelay;
    state.agruIdleDelayImage     = agruIdleDelayImage;
    state.agruChatFontSize       = agruChatFontSize;
    state.agruChatBold           = agruChatBold ? 1 : 0;
    state.agruFontLeft           = agruFontLeft;
    state.agruFontRight          = agruFontRight;
    state.agruDefaultImage       = agruDefaultImage;
    state.agruEmotionMap         = localStorage.getItem('agruEmotionMap') || '{}';
    state.agruCharTags           = agruCharTags;
    state.agruYtVolume           = agruYtVolume;
    state.agruBgmVolume          = agruBgmVolume;
    state.agruYtWidth            = agruYtWidth;
    state.agruYtHeight           = agruYtHeight;
    state.agruYtOpacity          = agruYtOpacity;
    state.agruYtEnabled          = agruYtEnabled ? 1 : 0;
    state.agruImgCmdEnabled      = agruImgCmdEnabled ? 1 : 0;
    state.agruUnloadEnabled      = agruUnloadEnabled ? 1 : 0;
    state.agruShakeAmp           = agruShakeAmp;
    state.agruModalZ             = agruModalZ;
    state.agruYtModalZ           = agruYtModalZ;
    state.agruModalWidth         = agruModalWidth;
    state.agruModalHeight        = agruModalHeight;
    state.agruModalBgOpacity     = agruModalBgOpacity;
    state.agruChatImgSize        = agruChatImgSize;
    state.agruCharImgHeight      = agruCharImgHeight;
    state.agruCharImgScale       = agruCharImgScale;
    state.autoDeleteMinutes   = autoDeleteMinutes;
    state.autoReplyWords    = JSON.stringify(autoReplyWords);
    state.autoReplyMessages = JSON.stringify(autoReplyMessages);
    state.fiveMinMode   = fiveMinMode;
    state.brAutoEnabled = brAutoEnabled;
    // DOM要素がないスライダーの現在値をJS変数から設定
    state.hayaoshiFreqSlider    = hayaoshiFreq / 1000;
    state.hayaoshiSpeedSlider   = hayaoshiSpeed / 1000;
    state.nikoSizeSlider        = nikoFontSize;
    state.nikoOpacitySlider     = Math.round(nikoOpacity * 100);
    state.bossHpScaleSlider     = bossHpScale;
    state.bossAtkCoeffSlider    = bossAtkCoeff;
    state.counterRateSlider     = Math.round(bossCounterRate * 100);
    state.brHpMultSlider        = brHpMult;
    state.taimanHpMultSlider    = taimanHpMult;
    state.charSizeSlider        = Math.round(charSizeScale * 100);
    state.bossSizeSlider        = Math.round(bossSizeScale * 100);
    state.dmgFontScaleSlider    = dmgFontScale;
    state.newsTickerWidthSlider    = newsTickerWidth;
    state.newsTickerXSlider        = newsTickerX;
    state.newsTickerYSlider        = newsTickerY;
    state.newsTickerRowsSlider     = newsTickerRows;
    state.newsTickerFontSlider     = newsTickerFontSize;
    state.newsTickerBgOpacitySlider = newsTickerBgOpacity;
    state.newsTickerSpeedSlider    = newsTickerSpeed;
    state.newsTickerIntervalSlider = newsTickerInterval;
    state.wordlePanelWidthSlider   = wordlePanelWidth;
    state.wordlePanelBgSlider      = wordlePanelBgOpacity;
    state.rankingPanelBgSlider     = rankingPanelBgOpacity;
    state.quizPanelBgSlider        = quizPanelBgOpacity;
    state.afkOpacitySlider         = afkOpacity;
    state.afkGrayscaleSlider       = afkGrayscale;
    state.afkBrightnessSlider      = afkBrightness;
    state.kaiSpeedSlider           = kaiSpeed;
    state.kaiRestitutionSlider     = Math.round(kaiRestitution * 100);
    state.kaiGravitySlider         = Math.round(kaiGravity * 100);
    state.kaiBulletSizeSlider      = kaiBulletSize;
    state.autoDeleteMinutesSlider  = autoDeleteMinutes;
    state.moveArea  = localStorage.getItem('moveArea') || 'all';
    state.bgColor   = localStorage.getItem('bgColor')  || '#00FF00';
    replyFn({ type: d.type === 'ping' ? 'pong' : 'state', data: state });
  } else if (d.type === 'autoReplyConfig') {
    if (Array.isArray(d.words))    { autoReplyWords    = d.words;    localStorage.setItem('autoReplyWords',    JSON.stringify(d.words));    }
    if (Array.isArray(d.messages)) { autoReplyMessages = d.messages; localStorage.setItem('autoReplyMessages', JSON.stringify(d.messages)); }
    saveSettingsToServer();
  } else if (d.type === 'volumeText') {
    const elMap = { seVolume:'seVolumeSlider', voiceVolume:'voiceVolumeSlider' };
    const elId = elMap[d.key];
    if (elId) {
      const el = document.getElementById(elId);
      if (el) el.value = d.value;
      localStorage.setItem(d.key, d.value);
      if (d.key === 'seVolume')    { seVolume    = parseFloat(d.value); const v = document.getElementById('seVolumeVal');    if (v) v.textContent = Math.round(seVolume    * 100) + '%'; }
      if (d.key === 'voiceVolume') { voiceVolume = parseFloat(d.value); const v = document.getElementById('voiceVolumeVal'); if (v) v.textContent = Math.round(voiceVolume * 100) + '%'; }
      saveSettingsToServer();
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
    const elMap = { aiModel: 'aiModelInput', aiSystem: 'aiSystemInput', ollamaReviewPrompt: 'ollamaReviewPromptInput' };
    const elId = elMap[d.key];
    const el = elId ? document.getElementById(elId) : null;
    if (el) el.value = d.value;
    localStorage.setItem(d.key, d.value);
    if (d.key === 'aiModel')  aiModel  = d.value;
    if (d.key === 'aiSystem') aiSystem = d.value;
    if (d.key === 'ollamaReviewPrompt') ollamaReviewPrompt = d.value;
    saveSettingsToServer();
  } else if (d.type === 'sdText') {
    const elMap = { sdWidth:'sdWidthInput', sdHeight:'sdHeightInput', sdSteps:'sdStepsSlider',
                    sdPopWidth:'sdPopWidthSlider',
                    sdPositiveSuffix:'sdPositiveSuffixInput', sdNegative:'sdNegativeInput',
                    sdDisplayTime:'sdDisplayTimeSlider', sdMosaicKeywords:'sdMosaicKeywordsInput',
                    sdMosaicBlock:'sdMosaicBlockSlider',
                    sdCfgScale:'sdCfgScaleInput', sdSampler:'sdSamplerInput' };
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
      if (d.key === 'sdCfgScale')       sdCfgScale       = parseFloat(d.value) || sdCfgScale;
      if (d.key === 'sdSampler')        sdSampler        = d.value || sdSampler;
      const el = document.getElementById(elId);
      if (el) {
        el.value = d.value;
        if (d.key === 'sdSteps')       document.getElementById('sdStepsVal').textContent       = d.value;
        if (d.key === 'sdDisplayTime') document.getElementById('sdDisplayTimeVal').textContent = d.value + '秒';
        if (d.key === 'sdPopWidth')    document.getElementById('sdPopWidthVal').textContent    = d.value + 'px';
        if (d.key === 'sdMosaicBlock') document.getElementById('sdMosaicBlockVal').textContent = d.value + 'px';
      }
      saveSettingsToServer();
    }
  } else if (d.type === 'processComment') {
    if (d.comment) handleComment(d.comment);
  } else if (d.type === 'openNovel') {
    openNovelModal();
  } else if (d.type === 'openAgeruChat') {
    openAgruModal();
  } else if (d.type === 'closeAgeruChat') {
    closeAgruModal();
  } else if (d.type === 'agruBattleStart') {
    startAgruBattle();
  } else if (d.type === 'agruBattleEnd') {
    endAgruBattle(d.result || 'ageru');
  } else if (d.type === 'agruBattleSkill') {
    _agruBattleDoCounter(d.skillId);
  } else if (d.type === 'bossLayoutUpdate') {
    if (!agruBattleConfig) agruBattleConfig = {};
    if (d.bossChar)    agruBattleConfig.bossChar    = d.bossChar;
    if (d.hpGauge)    agruBattleConfig.hpGauge    = d.hpGauge;
    if (d.battleLog)  agruBattleConfig.battleLog  = d.battleLog;
    if (d.timer)      agruBattleConfig.timer       = d.timer;
    if (d.speech)     agruBattleConfig.speech      = d.speech;
    if (d.geoEffect)  agruBattleConfig.geoEffect   = d.geoEffect;
    if (d.noiseEffect) agruBattleConfig.noiseEffect = d.noiseEffect;
    if (d.hpImages)   agruBattleConfig.hpImages    = d.hpImages;
    _applyBossLayoutConfig();
    if (d.timer) _applyTimerConfig();
  } else if (d.type === 'agruSetParam') {
    const v = parseFloat(d.value);
    if (d.param === 'hunger')     { const _ph = agruHunger;     agruHunger     = Math.max(0, Math.min(100, v)); _agruDeadWakeCount = 0; if (agruHunger > 0) _agruRevertStateImage(); _agruUpdateHungerDisplay(agruHunger - _ph); }
    if (d.param === 'sleepiness') { const _ps = agruSleepiness; agruSleepiness = Math.max(0, Math.min(100, v)); if (agruSleepiness < 100) { _agruSleepWakeCount = 0; _agruRevertStateImage(); } _agruUpdateSleepDisplay(agruSleepiness - _ps); }
    if (d.param === 'libido')     { const _pl = agruLibido;     agruLibido     = Math.max(0, Math.min(100, v)); _agruUpdateLibidoDisplay(agruLibido - _pl); }
    if (d.param === 'affinity')   { const _pa = agruAffinity;   agruAffinity   = Math.max(0, Math.min(100, v)); _agruUpdateAffinityDisplay(agruAffinity - _pa); }
  } else if (d.type === 'agruDebugSend') {
    if (d.message) _agruDebug(d.message);
  } else if (d.type === 'agruText') {
    localStorage.setItem(d.key, d.value);
    if (d.key === 'agruSystem')             agruSystem             = d.value;
    if (d.key === 'agruDefaultImage')       agruDefaultImage       = d.value;
    if (d.key === 'agruVoicevoxEnabled')    agruVoicevoxEnabled    = d.value === '1';
    if (d.key === 'agruVoicevoxSpeaker')    agruVoicevoxSpeaker    = parseInt(d.value) || 0;
    if (d.key === 'agruVoicevoxSpeed')      agruVoicevoxSpeed      = parseFloat(d.value) || 1.0;
    if (d.key === 'agruVoicevoxVolume')     agruVoicevoxVolume     = parseFloat(d.value) || 1.0;
    if (d.key === 'agruSdWidth')            agruSdWidth            = parseInt(d.value) || 0;
    if (d.key === 'agruSdHeight')           agruSdHeight           = parseInt(d.value) || 0;
    if (d.key === 'agruSdSteps')            agruSdSteps            = parseInt(d.value)   || 0;
    if (d.key === 'agruSdCfgScale')         agruSdCfgScale         = parseFloat(d.value) || 0;
    if (d.key === 'agruSdPositiveSuffix')   agruSdPositiveSuffix   = d.value;
    if (d.key === 'agruIdleDelay')          agruIdleDelay          = parseInt(d.value) || 10;
    if (d.key === 'agruIdleDelayImage')     agruIdleDelayImage     = parseInt(d.value) || 30;
    if (d.key === 'agruChatFontSize')       agruChatFontSize       = parseInt(d.value) || 14;
    if (d.key === 'agruChatBold')  { agruChatBold  = d.value === '1'; document.documentElement.style.setProperty('--agru-font-weight', agruChatBold ? 'bold' : 'normal'); }
    if (d.key === 'agruFontLeft')  { agruFontLeft  = d.value; document.documentElement.style.setProperty('--agru-font-left',  d.value || 'inherit'); }
    if (d.key === 'agruFontRight') { agruFontRight = d.value; document.documentElement.style.setProperty('--agru-font-right', d.value || 'inherit'); }
    if (d.key === 'agruCharTags')           agruCharTags           = d.value;
    if (d.key === 'agruYtVolume') {
      agruYtVolume = parseInt(d.value) || 100;
      const _ytIf = document.getElementById('agruYtIframe');
      if (_ytIf) try { _ytIf.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [agruYtVolume] }), '*'); } catch {}
    }
    if (d.key === 'agruBgmVolume')          { agruBgmVolume = parseInt(d.value) ?? 50; if (!_agruBgm.paused) _agruBgm.volume = agruBgmVolume / 100; }
    if (d.key === 'agruYtWidth') {
      agruYtWidth = parseInt(d.value) || 435;
      const _ytM = document.getElementById('agruYtModal'), _ytIf = document.getElementById('agruYtIframe');
      if (_ytM && !_ytM.classList.contains('hidden')) { _ytM.style.width = agruYtWidth + 'px'; if (_ytIf) _ytIf.style.width = agruYtWidth + 'px'; }
    }
    if (d.key === 'agruYtHeight') {
      agruYtHeight = parseInt(d.value) || 245; agruYtWidth = Math.round(agruYtHeight * 16 / 9);
      const _ytM = document.getElementById('agruYtModal'), _ytIf = document.getElementById('agruYtIframe');
      if (_ytM && !_ytM.classList.contains('hidden')) { _ytM.style.width = agruYtWidth + 'px'; if (_ytIf) { _ytIf.style.width = agruYtWidth + 'px'; _ytIf.style.height = agruYtHeight + 'px'; } }
    }
    if (d.key === 'agruYtOpacity')          agruYtOpacity          = parseInt(d.value) ?? 100;
    if (d.key === 'agruYtEnabled')          agruYtEnabled          = d.value === '1';
    if (d.key === 'agruImgCmdEnabled')      agruImgCmdEnabled      = d.value === '1';
    if (d.key === 'agruUnloadEnabled')      agruUnloadEnabled      = d.value === '1';
    if (d.key === 'agruShakeAmp')           agruShakeAmp           = parseFloat(d.value) || 2;
    if (d.key === 'agruModalZ')             { agruModalZ = parseInt(d.value) || 300; const _mo = document.getElementById('agruModal'); if (_mo) _mo.style.zIndex = agruModalZ; }
    if (d.key === 'agruYtModalZ')           { agruYtModalZ = parseInt(d.value) || 400; const _yt = document.getElementById('agruYtModal'); if (_yt) _yt.style.zIndex = agruYtModalZ; }
    if (d.key === 'agruModalWidth')         { agruModalWidth = parseInt(d.value) || 870; const _mc = document.querySelector('#agruModal .agru-modal'); if (_mc) _mc.style.width = agruModalWidth + 'px'; }
    if (d.key === 'agruModalHeight')        { agruModalHeight = parseInt(d.value) || 460; const _mc = document.querySelector('#agruModal .agru-modal'); if (_mc) _mc.style.height = agruModalHeight + 'px'; }
    if (d.key === 'agruModalBgOpacity')     { agruModalBgOpacity = parseInt(d.value) ?? 45; const _mc = document.querySelector('#agruModal .agru-modal'); if (_mc) _mc.style.background = `rgba(255,248,251,${agruModalBgOpacity / 100})`; }
    if (d.key === 'agruChatImgSize')        { agruChatImgSize = parseInt(d.value) || 350; document.documentElement.style.setProperty('--agru-chat-img-maxh', agruChatImgSize + 'px'); }
    if (d.key === 'agruCharImgHeight')      { agruCharImgHeight = parseInt(d.value) || 360; document.documentElement.style.setProperty('--agru-char-img-height', agruCharImgHeight + 'px'); }
    if (d.key === 'agruCharImgScale')       { agruCharImgScale = parseFloat(d.value) || 1; _agruApplyCharScale(); }
    const elMap = { agruSystem: 'agruSystemInput' };
    const el = elMap[d.key] ? document.getElementById(elMap[d.key]) : null;
    if (el) el.value = d.value;
    saveSettingsToServer();
  } else if (d.type === 'agruEmotionMap') {
    agruEmotionMap = d.map || {};
    localStorage.setItem('agruEmotionMap', JSON.stringify(agruEmotionMap));
    saveSettingsToServer();
  } else if (d.type === 'getUsers') {
    const list = Object.values(users).filter(u => u.el).map(u => ({ ipid: u.ipid, name: u.name || '名無し', sizeScale: u.sizeScale || 1.0, taimanDmgMult: u.taimanDmgMult ?? 1.0, charImage: u.charImage || (u.charDef && charImages[u.charDef.id]) || null }));
    replyFn({ type: 'users', data: list, bossImgFile: bossState?.imgFile || null });
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
  } else if (d.type === 'resetCumulativeDmg') {
    cumulativeDmgMap = {};
    localStorage.removeItem('cumulativeDmgMap');
    if (rankingState) { rankingState.dmgMap = {}; renderRankingPanel(); }
  } else if (d.type === 'charIndivSize') {
    const u = users[d.ipid];
    if (u) {
      u.sizeScale = u.sizeScaleBase = parseFloat(d.scale) || 1.0;
      applyAvatarStyle(u); renderPetBadge(u);
      // 即時 charSave（60秒インターバルを待たずに保存）
      const _obj = {}; CHAR_SAVE_FIELDS.forEach(k => { if (u[k] !== undefined) _obj[k] = u[k]; });
      _charSaveData[u.saveKey || u.ipid] = _obj;
      const _sd = {}; Object.values(users).forEach(uu => { const o = {}; CHAR_SAVE_FIELDS.forEach(k => { if (uu[k] !== undefined) o[k] = uu[k]; }); _sd[uu.saveKey || uu.ipid] = o; });
      _saveServer('/api/char-save', _sd);
    }
  } else if (d.type === 'slotMp') {
    const keyMap = { slotMpJackpot: 0, slotMpDiamond: 1, slotMpStar: 2, slotMpBell: 3, slotMpCherry: 4 };
    const idx = keyMap[d.key];
    if (idx !== undefined) {
      const val = parseInt(d.value);
      if (!isNaN(val) && val >= 0) {
        SLOT_OUTCOMES[idx].mp = val;
        localStorage.setItem(d.key, val);
        saveSettingsToServer();
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
      saveSettingsToServer();
      renderWordlePanel();
    }
  } else if (d.type === 'clearCharSave') {
    _charSaveData = {};
  } else if (d.type === 'deleteCharSave') {
    delete _charSaveData[d.key];
  } else if (d.type === 'taimanCharScale') {
    taimanCharScale = parseFloat(d.value) || 4;
    localStorage.setItem('taimanCharScale', taimanCharScale);
    saveSettingsToServer();
  } else if (d.type === 'taimanDefeatCmd') {
    taimanDefeatCommand = d.value || '';
    localStorage.setItem('taimanDefeatCommand', taimanDefeatCommand);
    saveSettingsToServer();
  } else if (d.type === 'charAspectExp') {
    charAspectExp = Math.max(0, Math.min(0.5, parseFloat(d.value) || 0.5));
    localStorage.setItem('charAspectExp', charAspectExp);
    saveSettingsToServer();
    Object.values(users).filter(u => u.el).forEach(u => applyAvatarStyle(u));
  } else if (d.type === 'charPortraitBoost') {
    charPortraitBoost = Math.max(0, Math.min(1, parseFloat(d.value) || 0));
    localStorage.setItem('charPortraitBoost', charPortraitBoost);
    saveSettingsToServer();
    Object.values(users).filter(u => u.el).forEach(u => applyAvatarStyle(u));
  } else if (d.type === 'jiggleConfig') {
    if (d.imgFile) {
      jiggleConfig[d.imgFile] = d.config;
      localStorage.setItem('jiggleConfig', JSON.stringify(jiggleConfig));
      saveSettingsToServer();
      Object.values(users).filter(u => u.el).forEach(u => {
        const f = u.charImage || (u.charDef && charImages[u.charDef.id]) || 'kisyokeee.png';
        if (f === d.imgFile) updateJiggleOverlay(u);
      });
      if (bossState?.imgFile === d.imgFile) updateBossJiggleOverlay();
    }
  } else if (d.type === 'purupuruConfig') {
    if (d.imgFile) {
      purupuruConfig[d.imgFile] = d.config;
    } else {
      purupuruConfig = d.config;
    }
    localStorage.setItem('purupuruConfig', JSON.stringify(purupuruConfig));
    saveSettingsToServer();
    _puruApplyAll();
  } else if (d.type === 'petSizeScale') {
    petSizeScale = Math.max(0.3, Math.min(3, parseFloat(d.value) || 1));
    localStorage.setItem('petSizeScale', petSizeScale);
    saveSettingsToServer();
    Object.values(users).filter(u => u.el).forEach(u => renderPetBadge(u));
  } else if (d.type === 'petAspectExp') {
    petAspectExp = Math.max(0, Math.min(0.5, parseFloat(d.value) || 0.5));
    localStorage.setItem('petAspectExp', petAspectExp);
    saveSettingsToServer();
    Object.values(users).filter(u => u.el).forEach(u => renderPetBadge(u));
  } else if (d.type === 'petPortraitBoost') {
    petPortraitBoost = Math.max(0, Math.min(1, parseFloat(d.value) || 0));
    localStorage.setItem('petPortraitBoost', petPortraitBoost);
    saveSettingsToServer();
    Object.values(users).filter(u => u.el).forEach(u => renderPetBadge(u));
  } else if (d.type === 'charStatsOffset') {
    charStatsBottom = parseInt(d.bottom) || 0;
    charStatsLeft   = parseInt(d.left)   || 0;
    localStorage.setItem('charStatsBottom', charStatsBottom);
    localStorage.setItem('charStatsLeft',   charStatsLeft);
    stage.style.setProperty('--stats-bottom', charStatsBottom + 'px');
    stage.style.setProperty('--stats-left',   charStatsLeft   + 'px');
    saveSettingsToServer();
  } else if (d.type === 'charEquipOffset') {
    charEquipOffsetX = parseInt(d.x) || 0;
    charEquipOffsetY = parseInt(d.y) || 0;
    localStorage.setItem('charEquipOffsetX', charEquipOffsetX);
    localStorage.setItem('charEquipOffsetY', charEquipOffsetY);
    stage.style.setProperty('--equip-x', charEquipOffsetX + 'px');
    stage.style.setProperty('--equip-y', charEquipOffsetY + 'px');
    saveSettingsToServer();
  } else if (d.type === 'taimanCooldown') {
    taimanCooldown = Math.max(0, parseInt(d.value) || 0) * 1000;
    localStorage.setItem('taimanCooldown', taimanCooldown);
    saveSettingsToServer();
  } else if (d.type === 'autoDeleteTimeout') {
    autoDeleteMinutes = Math.max(1, parseInt(d.value) || 30);
    localStorage.setItem('autoDeleteMinutes', autoDeleteMinutes);
    saveSettingsToServer();
  } else if (d.type === 'contentMode') {
    toggleContentMode();
  } else if (d.type === 'taimanHandicap') {
    const u = users[d.ipid];
    if (u) { u.taimanDmgMult = Math.max(0, Math.min(1, parseFloat(d.mult) ?? 1)); }
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
let _adminWs = null;
(function initAdminWS() {
  const url = `ws://${location.host}/ws`;
  function connect() {
    _adminWs = new WebSocket(url);
    _adminWs.onopen  = () => _adminWs.send(JSON.stringify({ type: 'identify', role: 'main' }));
    _adminWs.onmessage = (e) => {
      let d; try { d = JSON.parse(e.data); } catch { return; }
      handleAdminMessage(d, msg => { if (_adminWs.readyState === 1) _adminWs.send(JSON.stringify(msg)); });
    };
    _adminWs.onclose = () => { _adminWs = null; setTimeout(connect, 3000); };
  }
  connect();
})();

// ── 30分ごとの自動バトルロイヤル ─────────────────────────────────────
setInterval(() => {
  // コンパクトモード中・コンテンツモード中・BR中・自動BR無効・キャラが2体未満なら何もしない
  brNextAutoAt = Date.now() + 30 * 60 * 1000; // タイマーを次の30分にリセット
  if (!brAutoEnabled) return;
  if (compactMode || contentMode || agruActive) return;
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
  const AFK_TIMEOUT = 30 * 60 * 1000;
  Object.values(users).forEach(u => {
    if (!u.el || u.ko || u.afk || u.afkText) return;
    if (isMasterUser(u)) return;
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

// ── 30分無コメントで自動削除 ─────────────────────────────────────────
setInterval(() => {
  const now = Date.now();
  const DELETE_TIMEOUT = autoDeleteMinutes * 60 * 1000;
  Object.values(users).forEach(u => {
    if (!u.el || u.ko || u.afkManual || u.afkText) return;
    if (isMasterUser(u)) return;
    if (!u.lastCommentAt) return;
    if (now - u.lastCommentAt < DELETE_TIMEOUT) return;
    const el = u.el;
    const ipid = u.ipid;
    el.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in';
    el.style.transform  = 'scale(0) rotate(20deg)';
    el.style.opacity    = '0';
    setTimeout(() => {
      if (u.bubbleTimer) clearTimeout(u.bubbleTimer);
      if (u.motionTimer) clearTimeout(u.motionTimer);
      if (u.moveTimer)   clearTimeout(u.moveTimer);
      if (u.walkTimer)   clearTimeout(u.walkTimer);
      el.remove();
      delete users[ipid];
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
  });
}, 60 * 1000);

// ── 競馬 ──────────────────────────────────────────────────────────
let raceState     = null;
let raceJackpot   = parseInt(localStorage.getItem('raceJackpot')) || 0;
raceDragState = null;
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
    data[u.saveKey || u.ipid] = obj;
  });
  if (Object.keys(data).length) _saveServer('/api/char-save', data);
}, 60 * 1000);

setInterval(() => {
  // 管理パネル設定（30秒ごと）
  saveSettingsToServer();
}, 30 * 1000);

// ── パネル表示状態の復元 ──────────────────────────────────────────
(function applyCharStatsOffset() {
  stage.style.setProperty('--stats-bottom', charStatsBottom + 'px');
  stage.style.setProperty('--stats-left',   charStatsLeft   + 'px');
})();

(function applyCharEquipOffset() {
  stage.style.setProperty('--equip-x', charEquipOffsetX + 'px');
  stage.style.setProperty('--equip-y', charEquipOffsetY + 'px');
})();

(function restorePanelVisibility() {
  // brTimerBtn の active 状態をセット（brTimerVisible は localStorage から初期化済み）
  document.getElementById('brTimerBtn')?.classList.toggle('active', brTimerVisible);
  if (brTimerVisible) renderBRTimerPanel();

  // ランキングパネル
  if (localStorage.getItem('rankingVisible') === '1') {
    rankingState = {
      dmgMap: {},
      panelX: parseInt(localStorage.getItem('rankingPanelX')) || Math.max(0, stage.clientWidth - 220),
      panelY: parseInt(localStorage.getItem('rankingPanelY')) || 10,
    };
    renderRankingPanel();
  }

  // クイズは loadQuizQuestions 内で自動復元
  // もじあてw は loadWordleWords 内で自動復元
})();

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

// ── ページ読み込み後1秒で自動開始 ────────────────────────────────
(function autoStart() {
  if (new URLSearchParams(location.search).get('obs') === '1') return;
  if (!localStorage.getItem('apikey')) return;
  setTimeout(() => document.getElementById('startBtn').click(), 1000);
})();
