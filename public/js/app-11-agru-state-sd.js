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
let _agruVictoryFadeTimer    = null; // リスナー勝利時の10秒フェードタイマー
let _agruVictoryBounceTimer  = null; // リスナー勝利時のバウンスタイマー
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

// 会話モードのパラメータメーター（.agru-params-overlay）の表示位置オフセット（px）。
// 既定位置（左6px・下6px）からの相対移動。管理パネルから変更可能。
let agruParamPosX        = parseInt(localStorage.getItem('agruParamPosX') ?? '0');
let agruParamPosY        = parseInt(localStorage.getItem('agruParamPosY') ?? '0');
function _applyAgruParamPos() {
  const el = document.querySelector('.agru-params-overlay');
  if (el) {
    el.style.left   = (6 + agruParamPosX) + 'px';
    el.style.bottom = (6 + agruParamPosY) + 'px';
  }
}
_applyAgruParamPos();

// 手動返答モード: ON のときアゲルちゃんはコメントに自動返答（Ollama）せず、
// admin.html から入力した文を発言する。
let agruManualMode = localStorage.getItem('agruManualMode') === '1';
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

// アゲル画像をランダムに切り替える（感情フォルダから無作為に1枚）。手動返答時などに使用。
function _agruSetRandomImage() {
  const emotions = Object.keys(agruFolderMap || {}).filter(e => (agruFolderMap[e] || []).length > 0);
  if (emotions.length > 0) {
    _agruSetImage(emotions[Math.floor(Math.random() * emotions.length)]);
  } else if (agruDefaultImage) {
    _agruSlideImage(`/ageru/${encodeURIComponent(agruDefaultImage)}`);
  }
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
  a.play().catch(() => {});
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

  let i = 0;
  const chars = [...text];
  _agruTypeTimer = setInterval(() => {
    if (i < chars.length) {
      textEl.textContent += chars[i++];
      log.scrollTop = log.scrollHeight;
    } else {
      clearInterval(_agruTypeTimer);
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
    if (data.error) { return; }
    if (_agruVvAudio) { _agruVvAudio.pause(); _agruVvAudio = null; }
    const audio = new Audio(data.audio);
    audio.volume = agruVoicevoxVolume;
    _agruVvAudio = audio;
    audio.play().catch(() => {});
    audio.onended = () => { if (_agruVvAudio === audio) _agruVvAudio = null; };
  } catch (e) {}
}

function _agruLog(msg, type) {
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
  // 手動返答モード: コメントはチャットに表示しパラメータも更新するが、自動返答（Ollama）はしない。
  // アゲルちゃんの発言は admin.html の手動返答入力（_agruManualReply）から行う。
  if (agruManualMode) {
    _agruUpdateParams(message);
    if (commenter) _agruAddBubble('right', commenter, message);
    agruIdle = true; // 次のコメントも受け付ける
    _agruSetStatus('返答中...'); // アゲルちゃんが入力中の「・・・」を表示（手動返答待ち）
    return;
  }
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
    agruAffinity = Math.max(0, Math.min(1000, agruAffinity + affinityDelta));
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

// 手動返答モード: admin.html から入力したアゲルちゃんのセリフを発言として表示する。
function _agruManualReply(text) {
  if (!agruManualMode) return; // 手動返答モードのときだけ動作（自動モードでは発言・ランダム画像をしない）
  const replyText = (text || '').trim();
  if (!replyText || !agruActive) return;
  agruIdle = false;
  clearTimeout(_agruIdleTimer);
  _agruSetRandomImage(); // 手動返答時はアゲル画像をランダムに切り替える
  _agruPlayVoicevox(replyText);
  const _typingEl = document.getElementById('agruTypingIndicator');
  if (_typingEl) _typingEl.remove();
  _agruAddBubble('left', 'アゲルちゃん', replyText, () => {
    _agruIdleTimer = setTimeout(() => {
      if (agruActive) { agruIdle = true; _agruSetStatus('コメント待ち...'); }
    }, agruIdleDelay * 1000);
  });
  _agruScrollBottom?.();
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
    agruAffinity = Math.max(0, Math.min(1000, agruAffinity + affinityDelta));
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

  agruAffinity    = 500;
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
    if (data.error) { return; }
    const reply = data.reply.trim();
    showBubble(user, reply, {});
    addToLog(user, `🤖 AI返答: ${reply}`, '#818cf8');
  } catch (e) {}
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
      showBubble(user, '❌ ' + data.error.slice(0, 40), {});
      addToLog(user, '🎨SD ❌ ' + data.error.slice(0, 80), '#ef4444');
      return;
    }
    if (data.translatedPrompt && data.translatedPrompt !== prompt) {
      addToLog(user, `🎨SD 翻訳: ${prompt} → ${data.translatedPrompt}`, '#c084fc');
    }
    showSDImage(user, data.image, prompt, data.translatedPrompt || prompt, cfg);
  } catch (e) {
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

