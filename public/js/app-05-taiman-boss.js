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

