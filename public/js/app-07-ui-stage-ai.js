// ──────────────────────────────────────────────────────────────────
// コメントログ スタイル設定
// ──────────────────────────────────────────────────────────────────
let logWidth     = parseInt(localStorage.getItem('logWidth')     ?? '300');
let logHeight    = parseInt(localStorage.getItem('logHeight')    ?? '265');
let logPosRight  = parseInt(localStorage.getItem('logPosRight')  ?? '10');
let logPosBottom = parseInt(localStorage.getItem('logPosBottom') ?? '10');
let logBgOpacity = parseInt(localStorage.getItem('logBgOpacity') ?? '92');

function _applyCommentLogStyle() {
  const el = document.getElementById('commentLog');
  if (!el) return;
  el.style.width      = logWidth + 'px';
  el.style.height     = logHeight + 'px';
  el.style.right      = logPosRight + 'px';
  el.style.bottom     = logPosBottom + 'px';
  el.style.background = `rgba(10,14,20,${Math.max(0, Math.min(100, logBgOpacity)) / 100})`;
}
_applyCommentLogStyle();

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
// 登録済みエモーション
// ──────────────────────────────────────────────────────────────────
let registeredEmotions = {};

async function fetchRegisteredEmotions() {
  if (!apikey) return;
  try {
    let url = `/api/emotions?apikey=${encodeURIComponent(apikey)}`;
    if (hash) url += `&hash=${encodeURIComponent(hash)}`;
    const res  = await fetch(url);
    const data = await res.json();
    if (data.success && data.emotions && typeof data.emotions === 'object') {
      registeredEmotions = data.emotions;
      console.log('[kukuCome] 登録済みエモーション取得:', Object.keys(data.emotions).length, '件', data.emotions);
    } else if (data.error) {
      console.warn('[kukuCome] エモーション一覧取得エラー:', data.error, data.error_display);
    }
  } catch (err) {
    console.warn('[kukuCome] エモーション一覧取得失敗:', err);
  }
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
        if (newOnes.length > 0) {
          console.log('[kukuCome] コメント受信:', newOnes);
          newOnes.forEach(handleComment);
          lastCnum = lastInBatch;
        }
      }
    }

    const onStage = Object.values(users).filter(u => u.el).length;
    setStatus('running', `● 受信中 (${onStage} キャラ)`);
  } catch (err) {
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
  fetchRegisteredEmotions();
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
// charTargets の offsetWidth/offsetHeight は変わらないのでキャッシュする
let _kaiCharCache = [];
let _kaiCharCacheTs = 0;
function startKaiPhysics() {
  if (kaiAnimId) return;
  function step() {
    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;
    const now = performance.now();
    // offsetWidth/offsetHeight は 200ms ごとにのみ読み直す（レイアウト強制リフローを削減）
    if (now - _kaiCharCacheTs > 200) {
      _kaiCharCache = Object.values(users).filter(u => u.el).map(u => {
        const w = u.el.offsetWidth  || 60;
        const h = u.el.offsetHeight || 80;
        return { u, w, h, r: Math.min(w, h) * 0.4 };
      });
      _kaiCharCacheTs = now;
    }
    // cx/cy はキャラが動くので毎フレーム u.x/y から算出
    const charTargets = _kaiCharCache.map(c => ({
      cx: c.u.x + c.w * 0.5, cy: c.u.y + c.h * 0.45, r: c.r,
    }));
    const bossTarget = _kaiBossTarget();
    const agruBossTarget = _kaiAgruBossTarget();
    for (let i = kaiBullets.length - 1; i >= 0; i--) {
      const b = kaiBullets[i];
      // 停止した弾（床に着地・静止）は物理計算をスキップして寿命だけ進める
      const sleeping = b.vy === 0 && Math.abs(b.vx) < 0.3;
      if (sleeping) {
        b.life++;
        const fadeStart = b.maxLife * 0.7;
        if (b.life > fadeStart) {
          b.el.style.opacity = Math.max(0, 1 - (b.life - fadeStart) / (b.maxLife - fadeStart)).toFixed(2);
        }
        if (b.life >= b.maxLife) { b.el.remove(); kaiBullets.splice(i, 1); }
        continue;
      }
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
      // left/top の代わりに translate() でGPUコンポジットのみに処理させる
      b.el.style.transform = `translate(${(b.x - b.r).toFixed(1)}px,${(b.y - b.r).toFixed(1)}px) rotate(${(Math.atan2(b.vy, b.vx) * 180 / Math.PI).toFixed(1)}deg)`;
      b.el.style.opacity   = Math.max(0, alpha).toFixed(2);
      b.life++;
      if (b.life >= b.maxLife) { b.el.remove(); kaiBullets.splice(i, 1); }
    }
    kaiAnimId = kaiBullets.length > 0 ? requestAnimationFrame(step) : null;
  }
  kaiAnimId = requestAnimationFrame(step);
}
// ボス当たり判定rect — 150ms キャッシュで毎フレームの getBoundingClientRect を削減
let _kaiBossRectCache = null, _kaiBossRectTs = 0;
function _kaiBossTarget() {
  const now = performance.now();
  if (now - _kaiBossRectTs > 150) {
    _kaiBossRectTs = now;
    if (!bossState?.el || bossState.defeated) { _kaiBossRectCache = null; }
    else {
      const br = bossState.el.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      const bx = br.left - sr.left, by = br.top - sr.top;
      _kaiBossRectCache = { cx: bx + br.width * 0.5, cy: by + br.height * 0.45, r: Math.min(br.width, br.height) * 0.45, by, bx };
    }
  }
  return _kaiBossRectCache;
}
let _kaiAgruBossRectCache = null, _kaiAgruBossRectTs = 0;
function _kaiAgruBossTarget() {
  const now = performance.now();
  if (now - _kaiAgruBossRectTs > 150) {
    _kaiAgruBossRectTs = now;
    if (!agruBattleActive) { _kaiAgruBossRectCache = null; }
    else {
      const imgEl = document.getElementById('agruBattleCharImg') || document.getElementById('agruCharImg');
      if (!imgEl || !imgEl.isConnected) { _kaiAgruBossRectCache = null; }
      else {
        const br = imgEl.getBoundingClientRect();
        const sr = stage.getBoundingClientRect();
        const bx = br.left - sr.left, by = br.top - sr.top;
        _kaiAgruBossRectCache = { cx: bx + br.width * 0.5, cy: by + br.height * 0.4, r: Math.min(br.width, br.height) * 0.4 };
      }
    }
  }
  return _kaiAgruBossRectCache;
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
    if (data.error) { return; }
    if (_ttsAudio) { _ttsAudio.pause(); _ttsAudio = null; }
    const audio = new Audio(data.url);
    audio.volume = ttsVolume;
    _ttsAudio = audio;
    audio.play().catch(() => {});
    audio.onended = () => { if (_ttsAudio === audio) _ttsAudio = null; };
  } catch (e) {}
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

