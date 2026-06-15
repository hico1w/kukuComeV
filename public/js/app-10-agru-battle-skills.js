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
// 共通: 10段のパラメータバー（空腹/眠気/性欲）を描画する土台。
// _agruUpdateHungerDisplay 等の各ステータス更新関数から呼ばれる。
function _agruRenderParamBar(elId, icon, mark, onCls, offCls, filled) {
  const el = document.getElementById(elId);
  if (!el) return;
  let html = `<span style="font-size:15px;margin-top:0">${icon}</span>`;
  for (let i = 0; i < 10; i++)
    html += `<span class="${i < filled ? onCls : offCls}">${mark}</span>`;
  el.innerHTML = html;
}
function _agruUpdateHungerDisplay(delta = 0) {
  _agruRenderParamBar('agruHungerDisplay', '🍖', '◆', 'agru-param-hunger-on', 'agru-param-hunger-off',
    Math.round(Math.max(0, agruHunger) / 10));
  if (delta > 0) _agruShowParamPop('🍖 空腹↓', '#fb923c', false);
  else if (delta < 0) _agruShowParamPop('🍖 空腹↑', '#ef4444', true);
}
function _agruUpdateSleepDisplay(delta = 0) {
  _agruRenderParamBar('agruSleepDisplay', '💤', '●', 'agru-param-sleep-on', 'agru-param-sleep-off',
    Math.round(Math.min(100, agruSleepiness) / 10));
  if (delta > 0) _agruShowParamPop('💤 眠気↑', '#818cf8', true);
  else if (delta < 0) _agruShowParamPop('💤 眠気↓', '#facc15', false);
}
function _agruUpdateLibidoDisplay(delta = 0) {
  _agruRenderParamBar('agruLibidoDisplay', '❓', '★', 'agru-param-libido-on', 'agru-param-libido-off',
    Math.round(Math.max(0, agruLibido) / 10));
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

