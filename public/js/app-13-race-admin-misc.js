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
  else if (id === 'streamEndBtn')      { _streamEndSummary(); }
  else if (id === 'streamEndCardClose'){ closeEndCard(); }
  else if (id === 'streamReviewBtn')   { _streamReview(); }
  else if (id === 'streamReviewClose') { document.getElementById('streamReviewModal')?.remove(); }
  else if (id === 'streamRecallBtn')   { _agruLoadDiaryRecall(); }
  else if (id === 'copyObsUrl') {
    navigator.clipboard.writeText(`${location.origin}/?obs=1`).catch(() => {});
  }
}

// ── 管理ウィンドウ（BroadcastChannel + WebSocket） ────────────────────
const _adminSeenNonces = new Set();
function handleAdminMessage(d, replyFn) {
  // BroadcastChannel と WebSocket の両方から同一メッセージが届くため、nonce で二重処理を防ぐ
  // （特に手動返答など「追記系」コマンドが2回実行されないように）
  if (d && d._n) {
    if (_adminSeenNonces.has(d._n)) return;
    _adminSeenNonces.add(d._n);
    setTimeout(() => _adminSeenNonces.delete(d._n), 5000);
  }
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
    state.sdPopWidth       = sdPopWidth;
    state.sdPositiveSuffix    = sdPositiveSuffix;
    state.sdDotPositiveSuffix  = sdDotPositiveSuffix;
    state.sdRealPositiveSuffix = sdRealPositiveSuffix;
    state.sdMoiPositiveSuffix  = sdMoiPositiveSuffix;
    state.sdKeywordPrompts     = sdKeywordPrompts;
    state.sdNegative           = sdNegative;
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
    state.agruVoiceEmoteEnabled  = agruVoiceEmoteEnabled ? '1' : '0';
    state.agruVoiceStyleJoy      = agruVoiceStyleJoy;
    state.agruVoiceStyleAnger    = agruVoiceStyleAnger;
    state.agruVoiceStyleSorrow   = agruVoiceStyleSorrow;
    state.agruVoiceStyleFun      = agruVoiceStyleFun;
    state.agruVoiceStyleNormal   = agruVoiceStyleNormal;
    state.commentPhysEnabled     = commentPhysEnabled ? '1' : '0';
    state.commentPhysGravity     = Math.round(commentPhysGravity * 100);
    state.commentPhysRestitution = Math.round(commentPhysRestitution * 100);
    state.commentPhysMax         = commentPhysMax;
    state.commentPhysFontSize    = commentPhysFontSize;
    state.commentPhysZ           = commentPhysZ;
    state.endCardWidth           = endCardWidth;
    state.endCardHeight          = endCardHeight;
    state.endCardVolume          = endCardVolume;
    state.reviewSystem           = reviewSystem;
    state.reviewNumCtx           = reviewNumCtx;
    state.reviewCharSize         = reviewCharSize;
    state.reviewCharRight        = reviewCharRight;
    state.reviewCharBottom       = reviewCharBottom;
    state.reviewBoardWidth       = reviewBoardWidth;
    state.reviewBoardMaxHeight   = reviewBoardMaxHeight;
    state.reviewBoardOffsetX     = reviewBoardOffsetX;
    state.reviewBoardOffsetY     = reviewBoardOffsetY;
    state.logWidth               = logWidth;
    state.logHeight              = logHeight;
    state.logPosRight            = logPosRight;
    state.logPosBottom           = logPosBottom;
    state.logBgOpacity           = logBgOpacity;
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
    state.agruParamPosX          = agruParamPosX;
    state.agruParamPosY          = agruParamPosY;
    state.agruManualMode         = agruManualMode;
    state.agruAutoTalkEnabled    = agruAutoTalkEnabled;
    state.agruAutoTalkInterval   = agruAutoTalkInterval;
    state.agruAutoTalkMaxStreak  = agruAutoTalkMaxStreak;
    state.agruAutoTalkTopics     = agruAutoTalkTopics;
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
                    sdPositiveSuffix:'sdPositiveSuffixInput',
                    sdDotPositiveSuffix:'sdDotPositiveSuffixInput',
                    sdRealPositiveSuffix:'sdRealPositiveSuffixInput',
                    sdMoiPositiveSuffix:'sdMoiPositiveSuffixInput',
                    sdNegative:'sdNegativeInput',
                    sdDisplayTime:'sdDisplayTimeSlider', sdMosaicKeywords:'sdMosaicKeywordsInput',
                    sdMosaicBlock:'sdMosaicBlockSlider',
                    sdCfgScale:'sdCfgScaleInput', sdSampler:'sdSamplerInput' };
    const elId = elMap[d.key];
    if (elId) {
      localStorage.setItem(d.key, d.value);
      if (d.key === 'sdWidth')          sdWidth          = parseInt(d.value)   || sdWidth;
      if (d.key === 'sdHeight')         sdHeight         = parseInt(d.value)   || sdHeight;
      if (d.key === 'sdSteps')          sdSteps          = parseInt(d.value)   || sdSteps;
      if (d.key === 'sdPopWidth')       sdPopWidth       = parseInt(d.value)   || sdPopWidth;
      if (d.key === 'sdPositiveSuffix')    sdPositiveSuffix    = d.value;
      if (d.key === 'sdDotPositiveSuffix')  sdDotPositiveSuffix  = d.value;
      if (d.key === 'sdRealPositiveSuffix') sdRealPositiveSuffix = d.value;
      if (d.key === 'sdMoiPositiveSuffix')  sdMoiPositiveSuffix  = d.value;
      if (d.key === 'sdNegative')           sdNegative           = d.value;
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
  } else if (d.type === 'sdKwpUpdate') {
    sdKeywordPrompts = d.list || [];
    localStorage.setItem('sdKeywordPrompts', JSON.stringify(sdKeywordPrompts));
    saveSettingsToServer();
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
    if (d.param === 'affinity')   { const _pa = agruAffinity;   agruAffinity   = Math.max(0, Math.min(1000, v)); _agruUpdateAffinityDisplay(agruAffinity - _pa); }
  } else if (d.type === 'agruManualReply') {
    if (d.message) _agruManualReply(d.message);
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
    if (d.key === 'agruVoiceEmoteEnabled')  agruVoiceEmoteEnabled  = d.value === '1';
    if (d.key === 'agruVoiceStyleJoy')      agruVoiceStyleJoy      = parseInt(d.value);
    if (d.key === 'agruVoiceStyleAnger')    agruVoiceStyleAnger    = parseInt(d.value);
    if (d.key === 'agruVoiceStyleSorrow')   agruVoiceStyleSorrow   = parseInt(d.value);
    if (d.key === 'agruVoiceStyleFun')      agruVoiceStyleFun      = parseInt(d.value);
    if (d.key === 'agruVoiceStyleNormal')   agruVoiceStyleNormal   = parseInt(d.value);
    if (d.key === 'commentPhysEnabled')     { commentPhysEnabled = d.value === '1'; if (!commentPhysEnabled) clearCommentPhys(); }
    if (d.key === 'commentPhysGravity')     commentPhysGravity     = (parseFloat(d.value) || 40) / 100;
    if (d.key === 'commentPhysRestitution') commentPhysRestitution = (parseFloat(d.value) || 45) / 100;
    if (d.key === 'commentPhysMax')         commentPhysMax         = parseInt(d.value) || 25;
    if (d.key === 'commentPhysFontSize')    commentPhysFontSize    = parseInt(d.value) || 18;
    if (d.key === 'commentPhysZ')           { commentPhysZ = parseInt(d.value); if (!Number.isFinite(commentPhysZ)) commentPhysZ = 65; }
    if (d.key === 'endCardWidth')           endCardWidth           = parseInt(d.value) || 880;
    if (d.key === 'endCardHeight')          endCardHeight          = parseInt(d.value) || 640;
    if (d.key === 'endCardVolume')          { endCardVolume = parseInt(d.value); if (!Number.isFinite(endCardVolume)) endCardVolume = 80; }
    if (d.key === 'reviewSystem')           reviewSystem           = d.value;
    if (d.key === 'reviewNumCtx')           reviewNumCtx           = parseInt(d.value) || 131072;
    if (d.key === 'reviewCharSize')         { reviewCharSize   = parseInt(d.value) || 160; _applyReviewCharStyle(); }
    if (d.key === 'reviewCharRight')        { reviewCharRight  = parseInt(d.value); if (!Number.isFinite(reviewCharRight))  reviewCharRight  = 14; _applyReviewCharStyle(); }
    if (d.key === 'reviewCharBottom')       { reviewCharBottom = parseInt(d.value); if (!Number.isFinite(reviewCharBottom)) reviewCharBottom = 12; _applyReviewCharStyle(); }
    if (d.key === 'reviewBoardWidth')       { reviewBoardWidth     = parseInt(d.value) || 760; _applyReviewBoardStyle(); }
    if (d.key === 'reviewBoardMaxHeight')   { reviewBoardMaxHeight = parseInt(d.value) || 88;  _applyReviewBoardStyle(); }
    if (d.key === 'reviewBoardOffsetX')     { reviewBoardOffsetX   = parseInt(d.value); if (!Number.isFinite(reviewBoardOffsetX)) reviewBoardOffsetX = 0; _applyReviewBoardStyle(); }
    if (d.key === 'reviewBoardOffsetY')     { reviewBoardOffsetY   = parseInt(d.value); if (!Number.isFinite(reviewBoardOffsetY)) reviewBoardOffsetY = 0; _applyReviewBoardStyle(); }
    if (d.key === 'logWidth')     { logWidth     = parseInt(d.value) || 300; _applyCommentLogStyle(); }
    if (d.key === 'logHeight')    { logHeight    = parseInt(d.value) || 265; _applyCommentLogStyle(); }
    if (d.key === 'logPosRight')  { logPosRight  = parseInt(d.value); if (!Number.isFinite(logPosRight))  logPosRight  = 10; _applyCommentLogStyle(); }
    if (d.key === 'logPosBottom') { logPosBottom = parseInt(d.value); if (!Number.isFinite(logPosBottom)) logPosBottom = 10; _applyCommentLogStyle(); }
    if (d.key === 'logBgOpacity') { logBgOpacity = parseInt(d.value); if (!Number.isFinite(logBgOpacity)) logBgOpacity = 92; _applyCommentLogStyle(); }
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
    if (d.key === 'agruParamPosX')          { agruParamPosX = parseInt(d.value) || 0; _applyAgruParamPos(); }
    if (d.key === 'agruParamPosY')          { agruParamPosY = parseInt(d.value) || 0; _applyAgruParamPos(); }
    if (d.key === 'agruManualMode')         { agruManualMode = d.value === '1'; if (agruManualMode && agruActive) { agruIdle = true; _agruSetStatus('コメント待ち...'); } }
    if (d.key === 'agruAutoTalkEnabled')    { agruAutoTalkEnabled = d.value === '1'; _agruScheduleAutoTalk(); }
    if (d.key === 'agruAutoTalkInterval')   { agruAutoTalkInterval = parseInt(d.value) || 90; _agruScheduleAutoTalk(); }
    if (d.key === 'agruAutoTalkMaxStreak')  { agruAutoTalkMaxStreak = parseInt(d.value) || 3; }
    if (d.key === 'agruAutoTalkTopics')     { agruAutoTalkTopics = d.value || ''; }
    const elMap = { agruSystem: 'agruSystemInput' };
    const el = elMap[d.key] ? document.getElementById(elMap[d.key]) : null;
    if (el) el.value = d.value;
    saveSettingsToServer();
  } else if (d.type === 'agruEmotionMap') {
    agruEmotionMap = d.map || {};
    localStorage.setItem('agruEmotionMap', JSON.stringify(agruEmotionMap));
    saveSettingsToServer();
  } else if (d.type === 'getUsers') {
    const list = Object.values(users).filter(u => u.el).map(u => {
      const _img = u.charImage || (u.charDef && charImages[u.charDef.id]) || null;
      return { ipid: u.ipid, name: u.name || '名無し', sizeScale: (_img && charImageSizes[_img]) || 1.0, taimanDmgMult: u.taimanDmgMult ?? 1.0, charImage: _img };
    });
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
  } else if (d.type === 'reloadCharImages') {
    charImages = loadCharImages(); refreshAllAvatars();
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
      const _imgFile = u.charImage || charImages[u.charDef?.id];
      if (_imgFile) {
        charImageSizes[_imgFile] = parseFloat(d.scale) || 1.0;
        saveCharImageSizes();
        Object.values(users).filter(uu => uu.el).forEach(uu => {
          if ((uu.charImage || charImages[uu.charDef?.id]) === _imgFile) {
            applyAvatarStyle(uu); renderPetBadge(uu);
          }
        });
      }
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
