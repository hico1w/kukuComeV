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
  if (typeof recordStreamHighlight === 'function') recordStreamHighlight(`${user.name || '誰か'}が神話級レアをドロップ！`);
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
// 同一 src の Audio を最大4つまで使い回してGCを減らす
const _localSoundPool = Object.create(null);
function playLocalSound(src, volume = 0.8) {
  if (compactMode) return;
  try {
    let pool = _localSoundPool[src];
    if (!pool) _localSoundPool[src] = pool = [];
    let a = pool.find(x => x.paused || x.ended);
    if (!a) {
      if (pool.length < 4) { a = new Audio(src); pool.push(a); }
      else { a = pool[0]; pool.push(pool.shift()); a.currentTime = 0; }
    }
    a.volume = Math.min(1, volume * seVolume);
    a.play().catch(() => {});
  } catch {}
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

// コメント番号 → ユーザー の逆引きマップ（handleComment で随時更新）
const _commentNumMap = new Map();

// ──────────────────────────────────────────────────────────────────
// kukuluLIVE オリジナルポイント預け/引き出し
//
// 必ず hash（配信番号）+ cnum（コメントID）の両方でコメント主を特定する。
// hash を省くと kukuluLIVE 側が cnum を無視して常に同一口座を返すため、
// 全員の残高が同じに見え、全員の預け引き出しが同じ口座を操作してしまう。
// pid はキャッシュしない（誤った pid を掴むと以降ずっと他人の口座を操作するため）。
// OP残高は毎回APIから取得し、charSave には保存しない。
// ──────────────────────────────────────────────────────────────────
function _mypointBody(user, cnum) {
  if (!hash || !cnum) return null;
  return { hash, cnum };
}

function _loadOpOnce(user, cnum) {
  if (user.opLoaded) return;
  const b = _mypointBody(user, cnum);
  if (!b) return;
  user.opLoaded = true;
  const params = new URLSearchParams(b).toString();
  fetch(`/api/mypoint/get?${params}`)
    .then(r => r.json())
    .then(d => {
      const entry = Array.isArray(d.users) && d.users[0];
      if (!entry) return;
      user.op = entry.point ?? null;
      updateStatsDisplay(user);
    })
    .catch(() => {});
}

function _mypointDeposit(user, amount, cnum, commentNumber) {
  // タイマン参加者は預け入れ禁止。敗者は所持MP全額を失うため、
  // 直前に預けて退避されると賭けが成立しなくなる
  if (taimanState && (taimanState.challenger === user.ipid || taimanState.target === user.ipid)) {
    showBubble(user, `⚔️ タイマン中は預けられません`, {});
    return;
  }
  if ((user.mp ?? 0) < amount) { showBubble(user, `MP不足… (${user.mp ?? 0}/${amount})`, {}); return; }
  const b = _mypointBody(user, cnum);
  if (!b) { showBubble(user, `❌ 配信番号(hash)未設定のため利用できません`, {}); return; }
  user.mp -= amount;
  updateStatsDisplay(user);
  showBubble(user, `⏳ ${amount}MP 預け中…`, {});
  fetch('/api/mypoint/deposit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...b, amount }) })
    .then(r => r.json()).then(d => {
      if (d.ok) {
        user.op = d.after;
        updateStatsDisplay(user);
        showBubble(user, `💰 ${amount}MP を預けた！(預金MP: ${d.after})`, {});
        const anchor = commentNumber ? `>>${commentNumber} ` : '';
        postAIReply(`${anchor}💰 ${amount}MPを預けました。預金MP: ${d.after}`);
      } else {
        user.mp += amount;
        updateStatsDisplay(user);
        showBubble(user, `❌ ${d.error || '預け失敗'}`, {});
      }
    }).catch(() => { user.mp += amount; updateStatsDisplay(user); showBubble(user, `❌ 通信エラー`, {}); });
}

// all=true のときは金額を指定せず、サーバー側が預金残高の全額を引き出す
function _mypointWithdraw(user, amount, cnum, commentNumber, all = false) {
  const b = _mypointBody(user, cnum);
  if (!b) { showBubble(user, `❌ 配信番号(hash)未設定のため利用できません`, {}); return; }
  showBubble(user, all ? `⏳ 全額引き出し中…` : `⏳ ${amount}MP 引き出し中…`, {});
  const payload = all ? { ...b, all: true } : { ...b, amount };
  fetch('/api/mypoint/withdraw', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    .then(r => r.json()).then(d => {
      if (d.ok) {
        // 実際に引き出せた額はサーバーの残高差分を正とする（全額引き出し時は事前に金額が分からないため）
        const got = (d.before ?? 0) - (d.after ?? 0);
        user.op = d.after;
        user.mp = (user.mp ?? 0) + got;
        updateStatsDisplay(user);
        showBubble(user, `💎 ${got}MP 引き出し！(預金MP: ${d.after})`, {});
        const anchor = commentNumber ? `>>${commentNumber} ` : '';
        postAIReply(`${anchor}💎 ${got}MPを引き出しました。預金MP: ${d.after}`);
      } else {
        showBubble(user, `❌ ${d.error || '引き出し失敗'}`, {});
      }
    }).catch(() => showBubble(user, `❌ 通信エラー`, {}));
}

// ──────────────────────────────────────────────────────────────────
// コメント処理
// ──────────────────────────────────────────────────────────────────
function handleComment(comment) {
  if (comment.from === 'admin') return;

  const type  = comment.type || 'comment';
  const ipid  = comment.ipid || comment.pid ||
                (comment.icon_num ? String(comment.icon_num) : null) ||
                comment.from || 'master';
  const user  = getUser(ipid);
  if (comment.number != null) _commentNumMap.set(Number(comment.number), user);
  if (comment.cnum) _loadOpOnce(user, String(comment.cnum));
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
      showImageBubble(user, comment.visualchat_url, comment.message ? stripPrefix(decodePercent(decodeHtml(comment.message))) : '');
      addToLog(user, '[お絵描き]', '#7dd3fc');
    }
    return;
  }

  // ── 通常コメント以外はスキップ ─────────────
  if (type !== 'comment') return;
  user.commentCount = (user.commentCount || 0) + 1;
  user.lastCommentAt = Date.now();
  if (!_streamStartAt) _streamStartAt = Date.now(); // 配信サマリー用の起点
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

  const rawMessage = decodePercent(decodeHtml(comment.message ?? ''));
  const message    = stripPrefix(rawMessage);
  const trimmedMsg = message.trim(); // message は const のため一度だけ算出して再利用

  // ボット自身が投稿したコメントはキャラコマンド等を無効化
  if (typeof _aiPostedTexts !== 'undefined' && _aiPostedTexts.has(message)) return;

  // エモーションURLを早期解決（物理オブジェクト・アゲルちゃんチャット共用）— 複数対応
  const _emoUrls = [];
  {
    const _re = comment.emotions && typeof comment.emotions === 'object' && !Array.isArray(comment.emotions) ? comment.emotions : null;
    if (_re) {
      for (const val of Object.values(_re)) {
        if (val && val.url && isSafeUrl(val.url)) _emoUrls.push(val.url);
      }
    }
    if (_emoUrls.length === 0) {
      for (const m of message.matchAll(/\(([^)]+)\)/g)) {
        const _r = registeredEmotions[m[1]];
        if (_r && _r.url && isSafeUrl(_r.url)) _emoUrls.push(_r.url);
      }
    }
  }

  if (message) {
    if (!user.recentComments) user.recentComments = [];
    user.recentComments.push(message);
    if (user.recentComments.length > 150) user.recentComments.shift();
    spawnCommentPhys(message, user, _emoUrls); // コメント物理オブジェクト（commentPhysEnabled 時のみ、吹き出しスタイル反映）
    if (!user.isMaster) recordStreamComment(user.name, message); // エンドカードのコメント一覧用に蓄積
  }

  // ── 馬券ベット ──
  if (raceState?.phase === 'betting') {
    // 全角→半角に正規化してから判定
    const betMsg = trimmedMsg
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
    const betMsg = trimmedMsg
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
      if (seenYoutubeUrls.has(videoId)) {
        postAIReply('もうみた');
      } else {
        seenYoutubeUrls.add(videoId);
        if ((user.mp ?? 0) < 30) {
          ensureCharOnStage(user);
          showBubble(user, `MPが足りない… (${user.mp ?? 0}/30)`, {});
        } else {
          if (agruYtEnabled) _agruPlayYouTube(videoId, startTime);
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

  // ── オリジナルポイント預け/引き出し ──
  {
    // 全額版（金額指定なし）を先に判定する
    if (/^全MPを?預ける$/.test(trimmedMsg)) {
      ensureCharOnStage(user);
      const allMp = user.mp ?? 0;
      if (allMp <= 0) { showBubble(user, `預けるMPがありません`, {}); return; }
      _mypointDeposit(user, allMp, String(comment.cnum || ''), comment.number);
      return;
    }
    if (/^全MPを?引き出す$/.test(trimmedMsg)) {
      ensureCharOnStage(user);
      _mypointWithdraw(user, 0, String(comment.cnum || ''), comment.number, true);
      return;
    }
    const depM = trimmedMsg.match(/^MPを預ける[：:]\s*(\d+)$/);
    const witM = trimmedMsg.match(/^MPを引き出す[：:]\s*(\d+)$/);
    if (depM) { ensureCharOnStage(user); _mypointDeposit(user, parseInt(depM[1], 10), String(comment.cnum || ''), comment.number); return; }
    if (witM) { ensureCharOnStage(user); _mypointWithdraw(user, parseInt(witM[1], 10), String(comment.cnum || ''), comment.number); return; }
    const giveM = trimmedMsg.match(/^MPを渡す[：:]\s*(.+?)\s*[：:]\s*(\d+)$/);
    if (giveM) {
      ensureCharOnStage(user);
      const targetKey = giveM[1].trim();
      const amount    = parseInt(giveM[2], 10);
      let target;
      if (/^\d+$/.test(targetKey)) {
        target = _commentNumMap.get(parseInt(targetKey, 10));
      } else {
        target = Object.values(users).find(u => u.el && (u.name || '').includes(targetKey));
      }
      if (!target)        { showBubble(user, `❌ 「${targetKey}」のユーザーが見つかりません`, {}); return; }
      if (target === user) { showBubble(user, `❌ 自分には渡せません`, {}); return; }
      if ((user.mp ?? 0) < amount) { showBubble(user, `MP不足… (${user.mp ?? 0}/${amount})`, {}); return; }
      user.mp = (user.mp ?? 0) - amount;
      target.mp = (target.mp ?? 0) + amount;
      updateStatsDisplay(user);
      updateStatsDisplay(target);
      showBubble(user,   `💸 ${target.name || '名無し'} に ${amount}MP 渡した！`, {});
      showBubble(target, `🎁 ${user.name   || '名無し'} から ${amount}MP もらった！`, {});
      const anchor = comment.number ? `>>${comment.number} ` : '';
      postAIReply(`${anchor}💸 ${amount}MPを${target.name || '名無し'}さんに渡しました`);
      return;
    }
  }

  // ── ボスアゲルバトル攻撃 ──
  if (agruBattleActive) attackAgruBoss(user, message.length, message);

  // ── アゲルちゃん会話モード ──
  if (agruActive && trimmedMsg === 'カフェオレ投与') {
    if ((user.mp ?? 0) < 50) {
      showBubble(user, `MPが足りない… (${user.mp ?? 0}/50)`, {});
    } else {
      user.mp -= 50;
      updateStatsDisplay(user);
      agruAffinity = Math.min(1000, agruAffinity + 20);
      _agruUpdateAffinityDisplay(20);
      _agruAddSystemMsg(`${user.name || '名無し'}がカフェオレをプレゼントした！好感度あがった！`);
    }
  } else if (agruActive && trimmedMsg === '水道水投与') {
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
  } else if (agruActive && trimmedMsg === '解毒剤投与') {
    if ((user.mp ?? 0) < 20) {
      showBubble(user, `MPが足りない… (${user.mp ?? 0}/20)`, {});
    } else {
      user.mp -= 20;
      updateStatsDisplay(user);
      _agruPoisonTurns = 0;                              // 現在の毒状態を解除
      _agruAntidoteUntil = Date.now() + 5 * 60 * 1000;   // 5分間は毒投与を無効化
      _agruRevertStateImage();
      _agruAddSystemMsg(`💉 ${user.name || '名無し'}が解毒剤を投与した！5分間は毒が効かない！`);
    }
  } else if (agruActive && /毒投与/.test(message)) {
    if (Date.now() < _agruAntidoteUntil) {
      // 解毒剤の効果中は毒投与を無効化
      _agruAddSystemMsg(`🛡️ ${user.name || '名無し'}が毒を投与したが…解毒剤の効果で無効化された！`);
    } else {
      const _prevHunger = agruHunger;
      agruHunger = Math.max(0, agruHunger - 10);
      _agruUpdateHungerDisplay(agruHunger - _prevHunger);
      _agruPoisonTurns = 6;
      _agruAddSystemMsg(`☠️ ${user.name || '名無し'}が毒を投与した！空腹度が減った…`);
      _agruShowStateImage('毒');
      if (agruIdle) _agruSend(message, user.name, _emoUrls);
    }
  } else if (!agruBattleActive && agruActive && agruIdle && trimmedMsg && !/^[ァ-ヶー]{5}$/.test(trimmedMsg) && !_isAgruSkipCmd(message)) {
    _agruSend(message, user.name, _emoUrls);
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
    handleQuizAnswer(user, trimmedMsg);
  }

  // ── ランダムタイマン ──────────────────────────────
  if (message.includes('ランダムタイマン')) {
    if (compactMode || contentMode) return;
    if (taimanDisabled) return;
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
    const taimanM = trimmedMsg.match(/^タイマン[：:](.+)$/);
    if (taimanM) {
      if (compactMode || contentMode) return;
      if (taimanDisabled) return;
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
    const canClearAfk = !isMasterUser(user) || trimmedMsg === '戻りました';
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
  const afkTextMatch = trimmedMsg.match(/^(?:放置|無明)[：:](.+)$/);
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

  // ── キャラ作成コマンド：SD生成＋背景透過＋アバター設定 ──
  if (message.includes('キャラ作成')) {
    if (!agruImgCmdEnabled && !isMasterUser(user)) return;
    if (agruBattleActive) return;
    if (agruActive) return;
    if (taimanState) return;
    ensureCharOnStage(user);
    if (!isMasterUser(user) && (user.mp ?? 0) < 50) {
      showBubble(user, `MPが足りない… (${user.mp ?? 0}/50)`, {});
      return;
    }
    const charPrompt = message.replace(/キャラ作成/g, '').trim() || 'cute character';
    const _cpCfg = _sdReadSettings();
    if (_sdNeedsMosaic(charPrompt, charPrompt, _cpCfg.mosaicKeywords)) {
      showBubble(user, 'そのキャラは作れません', { color: '#ef4444' });
      return;
    }
    if (!isMasterUser(user)) user.mp -= 50;
    updateStatsDisplay(user);
    createCharImage(user, charPrompt, comment.number);
    return;
  }

  // ── エコ生成コマンド：5MP消費・低解像度/低Stepsで雑に生成 ──────
  if (message.includes('エコ生成')) {
    if (!agruImgCmdEnabled && !isMasterUser(user)) return;
    if (agruBattleActive) return;
    if (taimanState) return;
    if (agruActive) return;
    ensureCharOnStage(user);
    if (!isMasterUser(user) && (user.mp ?? 0) < 5) {
      showBubble(user, `MPが足りません（${user.mp ?? 0}/5）`, {});
      return;
    }
    if (!isMasterUser(user)) user.mp -= 5;
    showBubble(user, message, {});
    const prompt = message.replace(/エコ生成/g, '').trim();
    generateSDImageGomi(user, prompt, comment.number);
    return;
  }

  // ── 超生成コマンド：500MP消費・別解像度/Stepsで高品質SD生成 ──────
  if (message.includes('超生成')) {
    if (!agruImgCmdEnabled && !isMasterUser(user)) return;
    if (agruBattleActive) return;
    if (taimanState) return;
    if (agruActive) return;
    ensureCharOnStage(user);
    if (!isMasterUser(user) && (user.mp ?? 0) < 500) {
      showBubble(user, `MPが足りません（${user.mp ?? 0}/500）`, {});
      return;
    }
    if (!isMasterUser(user)) user.mp -= 500;
    showBubble(user, message, {});
    const prompt = message.replace(/超生成/g, '').trim();
    generateSDImageCho(user, prompt, comment.number);
    return;
  }

  // ── 出ろ/出して/生成コマンド：SD画像生成 ──────
  if (/出ろ|出して|生成|gen/i.test(message)) {
    if (!agruImgCmdEnabled && !isMasterUser(user)) return; // 画像コマンド無視設定（masterは常に使用可）
    if (agruBattleActive) return; // バトル中は画像コマンド無効
    if (taimanState) return; // タイマン中は画像コマンド無効
    if (agruActive) return; // 会話モード中は _agruSend 側で処理
    ensureCharOnStage(user);
    if (!isMasterUser(user) && (user.mp ?? 0) < 20) {
      showBubble(user, 'MPが足りなくて画像生成できません', {});
      postAIReply(`${user.name || '名無し'} MPが足りません（${user.mp ?? 0}/20）`);
      return;
    }
    if (!isMasterUser(user)) user.mp -= 20;
    showBubble(user, message, {});
    const prompt = message.replace(/出ろ|出して|生成|gen/gi, '').trim();
    generateSDImage(user, prompt, comment.number);
    return;
  }

  // ── TTSコマンド ──────────────────────────────
  const ttsMatch = trimmedMsg.match(/^tts[：:](.+)$/);
  if (ttsMatch) {
    ensureCharOnStage(user); showBubble(user, message, {});
    playTTS(ttsMatch[1].trim());
    return;
  }

  // ── ノベル起動コマンド ────────────────────────
  if (trimmedMsg === 'ノベル起動') {
    if (!isMasterUser(user)) return;
    ensureCharOnStage(user); showBubble(user, message, {});
    openNovelModal();
    return;
  }

  // ── AI返答コマンド（ai：質問） ────────────────
  const aiMatch = trimmedMsg.match(/^(?:ai|AI|ＡＩ)[：:](.+)$/i);
  if (aiMatch) {
    ensureCharOnStage(user); showBubble(user, message, {});
    askAI(user, aiMatch[1].trim());
    return;
  }

  // ── 宝箱を開ける ─────────────────────────────
  if (trimmedMsg === '開ける') {
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
    delete user.charImageData;
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
        delete user.charImageData;
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
      if ((user.mp ?? 0) < 200) {
        showBubble(user, `❌ MP不足 (${user.mp ?? 0}/200)`, {});
      } else {
        user.mp = (user.mp ?? 0) - 200;
        updateStatsDisplay(user);
        user.movement = moveM[1];
        if (!user.tc) user.tc = {};
        user.tc.moveChanges = (user.tc.moveChanges || 0) + 1;
        if (moveM[1] === '止まれ') { applyMotion(user, null); stopWalk(user); }
        if (user.el) scheduleMove(user);
      }
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

  // 持ち込みエモーション — comment.emotions がオブジェクト形式 { key: {url, message} }
  const rawEmotions = comment.emotions && typeof comment.emotions === 'object' && !Array.isArray(comment.emotions)
    ? comment.emotions : null;
  if (rawEmotions && Object.keys(rawEmotions).length > 0) {
    const emotionList = [];
    for (const [key, val] of Object.entries(rawEmotions)) {
      const url = (val && val.url && isSafeUrl(val.url)) ? val.url : null;
      const emoMsg = (val && val.message) || '';
      if (url) emotionList.push({ url, message: emoMsg });
    }
    if (emotionList.length > 0) {
      ensureCharOnStage(user);
      showEmotionBubble(user, emotionList, display || '', commentStyle);
      addToLog(user, display ? `[エモ] ${display}` : '[エモーション]', '#a78bfa');
      return;
    }
  }

  // 登録済みエモーション — message 内の "(エモーションキー)" をすべて検索
  const regEmoList = [];
  for (const m of message.matchAll(/\(([^)]+)\)/g)) {
    const emo = registeredEmotions[m[1]];
    if (emo && emo.url && isSafeUrl(emo.url)) regEmoList.push(emo);
  }
  if (regEmoList.length > 0) {
    const caption = message.replace(/\([^)]*\)/g, '').trim();
    const emotionList = regEmoList.map(emo => ({ url: emo.url, message: emo.message || '' }));
    ensureCharOnStage(user);
    showEmotionBubble(user, emotionList, caption, commentStyle);
    addToLog(user, caption ? `[エモ] ${caption}` : `[エモ] ${regEmoList.map(e => e.message).filter(Boolean).join('/')}`, '#a78bfa');
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

  // ── #/＃先頭コメント：吹き出し4倍サイズ＋ガタガタ ── 20MP消費
  // 外部コメント元が半角 # を URLエンコード(%23)のまま送ってくるため、それも発動対象に含める
  let _gatagata = false;
  if (/^(?:[#＃]|%23)/i.test(message)) {
    if ((user.mp ?? 0) < 20) {
      showBubble(user, `MPが足りない… (${user.mp ?? 0}/20)`, {});
      addToLog(user, message, user.textColor === '#111111' ? '#e2e8f0' : user.textColor);
      return;
    }
    user.mp -= 20;
    updateStatsDisplay(user);
    commentStyle.fontSize = (charFontSizes.bubble * 4) + 'px';
    display = display.replace(/^(?:[#＃]|%23)/i, '').trim() || display;
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
  if (wordleState && /^[゠-ヿ]{5}$/.test(trimmedMsg)) {
    handleWordleGuess(user, trimmedMsg);
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
  // 【】で囲まれた部分（コメント末尾に付く名前タグ等）はコマンド判定・表示ともに無視する
  return (msg ?? '')
    .replace(/^\d+:\s*/, '')
    .replace(/【[^】]*】/g, '')
    .trim();
}

