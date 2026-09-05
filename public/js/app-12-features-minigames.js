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
                  ${user.op != null ? `<div class="sm-ol-stat">預金MP <span>🏦${user.op}</span></div>` : ''}
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
    if (triggerCnum == null) { return; }
    if (typeof html2canvas === 'undefined') { return; }

    const modalEl = overlay.querySelector('.sm-modal');
    if (!modalEl) { return; }

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

      // ① object-fit:contain img をキャンバスに差し替え
      for (const img of modalEl.querySelectorAll('.sm-avatar, .sm-pet-img')) {
        const bW = img.offsetWidth, bH = img.offsetHeight;
        const nW = img.naturalWidth, nH = img.naturalHeight;
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
      const canvas = await html2canvas(modalEl, {
        backgroundColor: '#0f121c',
        scale: 2,
        useCORS: true,
        logging: false,
        width: captureW,
        height: captureH,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const resp = await fetch('/api/status-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDataUrl: dataUrl, userName: user.name }),
      });
      const data = await resp.json();
      if (data.url) {
        postAIReply(`>>${triggerCnum} ${data.url}`);
      }
    } catch (e) {
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
  if (localStorage.getItem('rankingVisible') === '0') return;
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
  if (rankingState) { closeRankingPanel(); return; }
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
  const dmgEntries = Object.entries(_liveDmg)
    .filter(([k]) => !users[k]?.isMaster)
    .map(([, v]) => v)
    .sort((a, b) => b.totalDmg - a.totalDmg).slice(0, 3);
  let dmgRows = dmgEntries.length
    ? dmgEntries.map((e, i) => `<div class="ranking-row"><span class="ranking-medal">${medals[i]}</span><span class="ranking-name">${escapeHtml(e.name)}</span><span class="ranking-dmg">${e.totalDmg.toLocaleString()}</span></div>`).join('')
    : '<div class="ranking-empty">データなし</div>';

  const mpEntries = Object.values(users).filter(u => u.el && !u.isMaster)
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
  const dmgAll = Object.entries(_liveDmg)
    .filter(([k]) => !users[k]?.isMaster)
    .map(([, v]) => v)
    .sort((a, b) => b.totalDmg - a.totalDmg);
  const mpAll = Object.values(users).filter(u => u.el && !u.isMaster)
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
  } catch(e) {}
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
  localStorage.setItem('equipHidden', equipHidden);
});

document.getElementById('hidePetBtn')?.addEventListener('click', () => {
  petHidden = !petHidden;
  stage.classList.toggle('pet-hidden', petHidden);
  document.getElementById('hidePetBtn').classList.toggle('active', petHidden);
  localStorage.setItem('petHidden', petHidden);
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
if (equipHidden)      { stage.classList.add('equip-hidden'); document.getElementById('hideEquipBtn')?.classList.add('active'); }
if (petHidden)        { stage.classList.add('pet-hidden');   document.getElementById('hidePetBtn')?.classList.add('active'); }
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
  sdChoWidth    = parseInt(load('sdChoWidth',    1920));
  sdChoHeight   = parseInt(load('sdChoHeight',   1080));
  sdChoSteps    = parseInt(load('sdChoSteps',    40));
  sdChoPopWidth = parseInt(load('sdChoPopWidth', 700));
  sdGomiWidth    = parseInt(load('sdGomiWidth',    512));
  sdGomiHeight   = parseInt(load('sdGomiHeight',   512));
  sdGomiSteps    = parseInt(load('sdGomiSteps',    5));
  sdGomiPopWidth = parseInt(load('sdGomiPopWidth', 240));
  sdPositiveSuffix    = load('sdPositiveSuffix', 'masterpiece, best quality');
  sdDotPositiveSuffix  = load('sdDotPositiveSuffix',  sdDotPositiveSuffix);
  sdRealPositiveSuffix = load('sdRealPositiveSuffix', sdRealPositiveSuffix);
  sdMoiPositiveSuffix  = load('sdMoiPositiveSuffix',  sdMoiPositiveSuffix);
  sdCharOutdir         = load('sdCharOutdir',         sdCharOutdir);
  sdCharPositiveSuffix = load('sdCharPositiveSuffix', sdCharPositiveSuffix);
  try { sdKeywordPrompts = JSON.parse(load('sdKeywordPrompts', '[]')); } catch(e) { sdKeywordPrompts = []; }
  sdNegative       = load('sdNegative', sdNegative);
  sdDisplayTime    = parseInt(load('sdDisplayTime', 10));
  sdMosaicKeywords = load('sdMosaicKeywords', '');
  sdMosaicBlock    = parseInt(load('sdMosaicBlock', 20));
  sdCfgScale       = parseFloat(load('sdCfgScale', 3));
  sdSampler        = load('sdSampler', 'Euler a');
  charExcludeIds   = new Set((localStorage.getItem('charExcludeIds') || '').split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0));

  sdPopWidth       = parseInt(load('sdPopWidth', 480)); // グローバル変数に格納（_sdReadSettings が参照）
  const _sdSet = (id, prop, val) => { const e = document.getElementById(id); if (e) e[prop] = val; };
  _sdSet('sdWidthInput',           'value',       sdWidth);
  _sdSet('sdHeightInput',          'value',       sdHeight);
  _sdSet('sdStepsSlider',          'value',       sdSteps);
  _sdSet('sdStepsVal',             'textContent', sdSteps);
  _sdSet('sdChoWidthInput',    'value', sdChoWidth);
  _sdSet('sdChoHeightInput',   'value', sdChoHeight);
  _sdSet('sdChoStepsSlider',   'value', sdChoSteps);
  _sdSet('sdChoStepsVal',      'textContent', sdChoSteps);
  _sdSet('sdChoPopWidthSlider','value', sdChoPopWidth);
  _sdSet('sdChoPopWidthVal',   'textContent', sdChoPopWidth + 'px');
  _sdSet('sdGomiWidthInput',    'value', sdGomiWidth);
  _sdSet('sdGomiHeightInput',   'value', sdGomiHeight);
  _sdSet('sdGomiStepsSlider',   'value', sdGomiSteps);
  _sdSet('sdGomiStepsVal',      'textContent', sdGomiSteps);
  _sdSet('sdGomiPopWidthSlider','value', sdGomiPopWidth);
  _sdSet('sdGomiPopWidthVal',   'textContent', sdGomiPopWidth + 'px');
  _sdSet('sdPopWidthSlider',       'value',       sdPopWidth);
  _sdSet('sdPopWidthVal',          'textContent', sdPopWidth + 'px');
  _sdSet('sdPositiveSuffixInput',     'value', sdPositiveSuffix);
  _sdSet('sdDotPositiveSuffixInput',  'value', sdDotPositiveSuffix);
  _sdSet('sdRealPositiveSuffixInput', 'value', sdRealPositiveSuffix);
  _sdSet('sdMoiPositiveSuffixInput',  'value', sdMoiPositiveSuffix);
  _sdSet('sdNegativeInput',           'value', sdNegative);
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
document.getElementById('sdChoWidthInput')?.addEventListener('change', e => _sdSave('sdChoWidth', e.target.value));
document.getElementById('sdChoHeightInput')?.addEventListener('change', e => _sdSave('sdChoHeight', e.target.value));
document.getElementById('sdChoStepsSlider')?.addEventListener('input', e => {
  document.getElementById('sdChoStepsVal').textContent = e.target.value;
  _sdSave('sdChoSteps', e.target.value);
});
document.getElementById('sdChoPopWidthSlider')?.addEventListener('input', e => {
  document.getElementById('sdChoPopWidthVal').textContent = e.target.value + 'px';
  _sdSave('sdChoPopWidth', e.target.value);
});
document.getElementById('sdGomiWidthInput')?.addEventListener('change', e => _sdSave('sdGomiWidth', e.target.value));
document.getElementById('sdGomiHeightInput')?.addEventListener('change', e => _sdSave('sdGomiHeight', e.target.value));
document.getElementById('sdGomiStepsSlider')?.addEventListener('input', e => {
  document.getElementById('sdGomiStepsVal').textContent = e.target.value;
  _sdSave('sdGomiSteps', e.target.value);
});
document.getElementById('sdGomiPopWidthSlider')?.addEventListener('input', e => {
  document.getElementById('sdGomiPopWidthVal').textContent = e.target.value + 'px';
  _sdSave('sdGomiPopWidth', e.target.value);
});
document.getElementById('sdPopWidthSlider')?.addEventListener('input', e => {
  document.getElementById('sdPopWidthVal').textContent = e.target.value + 'px';
  _sdSave('sdPopWidth', e.target.value);
});
document.getElementById('sdDisplayTimeSlider')?.addEventListener('input', e => {
  document.getElementById('sdDisplayTimeVal').textContent = e.target.value + '秒';
  _sdSave('sdDisplayTime', e.target.value);
});
document.getElementById('sdPositiveSuffixInput')?.addEventListener('change',     e => _sdSave('sdPositiveSuffix',    e.target.value));
document.getElementById('sdDotPositiveSuffixInput')?.addEventListener('change',  e => _sdSave('sdDotPositiveSuffix',  e.target.value));
document.getElementById('sdRealPositiveSuffixInput')?.addEventListener('change', e => _sdSave('sdRealPositiveSuffix', e.target.value));
document.getElementById('sdMoiPositiveSuffixInput')?.addEventListener('change',  e => _sdSave('sdMoiPositiveSuffix',  e.target.value));
document.getElementById('sdNegativeInput')?.addEventListener('change',           e => _sdSave('sdNegative',           e.target.value));
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

