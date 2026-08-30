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
  const eligible = Object.values(users).filter(u => u.el && !u.ko && !u.afk && !u.isMaster);
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

