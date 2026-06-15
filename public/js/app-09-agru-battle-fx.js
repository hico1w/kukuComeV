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
  _agruVictoryBounceTimer = setTimeout(() => {
    _agruVictoryBounceTimer = null;
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
    if (!agruBattleActive) setTimeout(() => gatherCharactersBottom(), 800);
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
  agruBattleTimers.clearAll(); // グループ登録済みの演出タイマーを一掃（残留対策）

  // 前回バトル残留タイマーをキャンセル（連続起動時の干渉防止）
  if (_agruVictoryFadeTimer)   { clearTimeout(_agruVictoryFadeTimer);   _agruVictoryFadeTimer   = null; }
  if (_agruVictoryBounceTimer) { clearTimeout(_agruVictoryBounceTimer); _agruVictoryBounceTimer = null; }
  document.getElementById('_agruWipeOverlay')?.remove();

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
    _agruVictoryBounceTimer = setTimeout(() => {
      _agruVictoryBounceTimer = null;
      _agruBattleVictoryBounce();
    }, 400);

    // ボスUI を10秒後にフェードアウト・背景リセット（次バトル開始でキャンセル）
    const _bossFadeIds = ['agruBattleOverlay','agruBossFigureWrap','agruBattleCharWrap'];
    _agruVictoryFadeTimer = setTimeout(() => {
      _agruVictoryFadeTimer = null;
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

