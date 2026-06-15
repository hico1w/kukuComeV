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

// 共通: パーティクル1個を stage に追加し、アニメ終了後に自動削除する。
// spawnFireworks など各エフェクト関数の土台。init(p) で textContent 等を設定可能。
function _spawnParticle(cssText, keyframes, options, init) {
  const p = document.createElement('div');
  p.style.cssText = cssText;
  if (init) init(p);
  stage.appendChild(p);
  p.animate(keyframes, options).onfinish = () => p.remove();
  return p;
}

function spawnFireworks(cx, cy) {
  if (compactMode) return;
  const colors = ['#ff4444','#ffaa00','#44ff44','#4499ff','#ff44ff','#44ffee','#ffffff','#ffdd44'];
  for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * Math.PI * 2;
    const dist  = 60 + Math.random() * 130;
    _spawnParticle(
      `position:absolute;left:${cx}px;top:${cy}px;width:9px;height:9px;border-radius:50%;background:${colors[i%colors.length]};z-index:60;pointer-events:none;`,
      [
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`, opacity: 0 },
      ],
      { duration: 700 + Math.random()*400, easing: 'cubic-bezier(0,.9,.57,1)', fill: 'forwards' });
  }
}

function spawnConfetti() {
  if (compactMode) return;
  const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c77dff','#ff9a3c'];
  for (let i = 0; i < 55; i++) {
    setTimeout(() => {
      const w = 6 + Math.random()*8, h = 10 + Math.random()*6;
      const rot = Math.random() * 360;
      _spawnParticle(
        `position:absolute;left:${Math.random()*stage.clientWidth}px;top:-${h}px;width:${w}px;height:${h}px;background:${colors[Math.floor(Math.random()*colors.length)]};z-index:60;pointer-events:none;border-radius:2px;`,
        [
          { transform: `rotate(${rot}deg)`, opacity: 1 },
          { transform: `rotate(${rot+360}deg) translateY(${stage.clientHeight+20}px)`, opacity: 0.7 },
        ],
        { duration: 2000 + Math.random()*1500, easing: 'linear', fill: 'forwards' });
    }, i * 22);
  }
}

function spawnConfettiSmall(n) {
  if (compactMode) return;
  const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c77dff','#ff9a3c','#ffffff','#ffb347'];
  for (let i = 0; i < (n || 10); i++) {
    const w = 5 + Math.random()*7, h = 8 + Math.random()*6;
    const rot = Math.random() * 360;
    const drift = (Math.random() - 0.5) * 120;
    _spawnParticle(
      `position:absolute;left:${Math.random()*stage.clientWidth}px;top:-${h}px;width:${w}px;height:${h}px;background:${colors[Math.floor(Math.random()*colors.length)]};z-index:60;pointer-events:none;border-radius:2px;`,
      [
        { transform: `rotate(${rot}deg) translateX(0)`, opacity: 1 },
        { transform: `rotate(${rot+270}deg) translateX(${drift}px) translateY(${stage.clientHeight+20}px)`, opacity: 0.6 },
      ],
      { duration: 2200 + Math.random()*1200, easing: 'linear', fill: 'forwards' });
  }
}

function spawnShootingStar() {
  const startY = Math.random() * stage.clientHeight * 0.5;
  _spawnParticle(
    `position:absolute;top:${startY}px;left:0;width:200px;height:3px;background:linear-gradient(90deg,transparent,#fff,rgba(255,255,200,.9),transparent);z-index:60;pointer-events:none;border-radius:2px;`,
    [
      { transform: 'translate(-200px,0) rotate(18deg)', opacity: 1 },
      { transform: `translate(${stage.clientWidth+200}px,${stage.clientHeight*0.3}px) rotate(18deg)`, opacity: 0 },
    ],
    { duration: 900, easing: 'ease-in', fill: 'forwards' });
}

function spawnHeartShower(cx, cy) {
  if (compactMode) return;
  const hearts = ['❤️','💕','💖','💗','💓','🩷'];
  for (let i = 0; i < 14; i++) {
    setTimeout(() => {
      const ox = (Math.random() - 0.5) * 130;
      _spawnParticle(
        `position:absolute;left:${cx}px;top:${cy}px;font-size:${14+Math.random()*18}px;z-index:60;pointer-events:none;user-select:none;`,
        [
          { transform: `translate(calc(-50% + ${ox}px),-50%) scale(1)`, opacity: 1 },
          { transform: `translate(calc(-50% + ${ox}px),calc(-50% - ${100+Math.random()*90}px)) scale(0.3)`, opacity: 0 },
        ],
        { duration: 1100 + Math.random()*700, easing: 'ease-out', fill: 'forwards' },
        (p) => { p.textContent = hearts[Math.floor(Math.random()*hearts.length)]; });
    }, i * 70);
  }
}

function spawnSakura(cx, cy) {
  if (compactMode) return;
  const petals = ['🌸','🌺','🌼'];
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const ox = (Math.random() - 0.5) * 200;
      const drift = (Math.random() - 0.5) * 80;
      _spawnParticle(
        `position:absolute;left:${cx}px;top:${cy}px;font-size:${12+Math.random()*14}px;z-index:60;pointer-events:none;user-select:none;`,
        [
          { transform: `translate(calc(-50% + ${ox}px),-50%) rotate(0deg)`, opacity: 1 },
          { transform: `translate(calc(-50% + ${ox+drift}px),calc(-50% + ${80+Math.random()*80}px)) rotate(${Math.random()*360}deg)`, opacity: 0 },
        ],
        { duration: 1500 + Math.random()*800, easing: 'ease-out', fill: 'forwards' },
        (p) => { p.textContent = petals[Math.floor(Math.random()*petals.length)]; });
    }, i * 60);
  }
}

function spawnSnow() {
  if (compactMode) return;
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const size = 5 + Math.random() * 8;
      const drift = (Math.random() - 0.5) * 100;
      _spawnParticle(
        `position:absolute;left:${Math.random()*stage.clientWidth}px;top:-${size}px;width:${size}px;height:${size}px;background:rgba(255,255,255,0.9);border-radius:50%;z-index:60;pointer-events:none;`,
        [
          { transform: 'translateX(0)', opacity: 1 },
          { transform: `translate(${drift}px,${stage.clientHeight+20}px)`, opacity: 0.5 },
        ],
        { duration: 2500 + Math.random()*1500, easing: 'linear', fill: 'forwards' });
    }, i * 40);
  }
}

function spawnExplosion(cx, cy) {
  if (compactMode) return;
  const colors = ['#ff6600','#ff9900','#ffcc00','#ffffff','#ff3300'];
  for (let i = 0; i < 24; i++) {
    const size = 8 + Math.random() * 14;
    const angle = (i / 24) * Math.PI * 2;
    const dist = 80 + Math.random() * 100;
    _spawnParticle(
      `position:absolute;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;border-radius:50%;background:${colors[i%colors.length]};z-index:60;pointer-events:none;`,
      [
        { transform: 'translate(-50%,-50%) scale(1.5)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`, opacity: 0 },
      ],
      { duration: 500 + Math.random()*300, easing: 'ease-out', fill: 'forwards' });
  }
}

function spawnBubbles(cx, cy) {
  if (compactMode) return;
  for (let i = 0; i < 16; i++) {
    setTimeout(() => {
      const size = 10 + Math.random() * 20;
      const ox = (Math.random() - 0.5) * 100;
      _spawnParticle(
        `position:absolute;left:${cx+ox}px;top:${cy}px;width:${size}px;height:${size}px;border-radius:50%;background:rgba(173,216,230,0.45);border:1.5px solid rgba(135,206,235,0.8);z-index:60;pointer-events:none;`,
        [
          { transform: 'translate(-50%,-50%) scale(0.5)', opacity: 0.9 },
          { transform: `translate(calc(-50% + ${(Math.random()-0.5)*40}px),calc(-50% - ${80+Math.random()*80}px)) scale(1)`, opacity: 0 },
        ],
        { duration: 1200 + Math.random()*800, easing: 'ease-out', fill: 'forwards' });
    }, i * 80);
  }
}

function spawnLightning(cx, cy) {
  if (compactMode) return;
  _spawnParticle(
    `position:absolute;left:${cx}px;top:0;width:4px;height:${cy}px;background:linear-gradient(180deg,#fff 0%,#faff00 40%,transparent 100%);z-index:60;pointer-events:none;border-radius:2px;box-shadow:0 0 10px 4px rgba(255,255,100,0.7);transform:translateX(-50%);`,
    [
      { opacity: 1, transform: 'translateX(-50%) scaleX(1)' },
      { opacity: 0.6, transform: 'translateX(-50%) scaleX(2)' },
      { opacity: 0, transform: 'translateX(-50%) scaleX(0.5)' },
    ],
    { duration: 400, easing: 'ease-in', fill: 'forwards' });
  _spawnParticle(
    `position:absolute;left:${cx-50}px;top:${cy-50}px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,150,0.85) 0%,transparent 70%);z-index:61;pointer-events:none;`,
    [{ opacity: 1 },{ opacity: 0 }],
    { duration: 350, fill: 'forwards' });
}

