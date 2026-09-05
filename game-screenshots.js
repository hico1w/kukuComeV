/**
 * game-screenshots.js
 * ゲーム画面の各機能スクショを自動撮影する
 * Usage: node game-screenshots.js
 */

const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const OUT = path.join(__dirname, 'chara', 'screenshots');
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}/`;

// ── ユーティリティ ────────────────────────────────────

function waitForServer(port, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const req = http.get(`http://localhost:${port}/`, res => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error(`Server not ready after ${timeout}ms`));
        } else {
          setTimeout(check, 300);
        }
      });
      req.end();
    };
    check();
  });
}

// ゲームページを開いて背景色を注入し、初期化待ち
async function openGamePage(browser) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });

  // コンソールエラーを黙らせる
  page.on('console', () => {});
  page.on('pageerror', () => {});

  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 20000 });

  // OBS用グリーンバック(#stage #00FF00)をダークな背景に差し替え
  await page.addStyleTag({
    content: `
      body {
        background: #0d1117 !important;
      }
      #stage {
        background: linear-gradient(160deg, #0d1117 0%, #161b22 60%, #1a1a2e 100%) !important;
      }
      #settings { background: rgba(13,17,23,0.95) !important; }
    `
  });

  // JS初期化が完了するまで少し待つ
  await page.waitForTimeout(800);

  return page;
}

// handleComment 呼び出し
async function comment(page, from, name, message) {
  await page.evaluate(({ from, name, message }) => {
    if (typeof handleComment === 'function') {
      handleComment({ from, ipid: from, icon_name: name, message, type: 'comment' });
    }
  }, { from, name, message });
}

// 複数コメントを連続送信
async function comments(page, list, delayMs = 400) {
  for (const [from, name, message] of list) {
    await comment(page, from, name, message);
    await page.waitForTimeout(delayMs);
  }
}

// スクショ撮影
async function shot(page, filename) {
  const outPath = path.join(OUT, filename);
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(`  ✓ ${filename}`);
}

// ── シナリオ定義 ──────────────────────────────────────

async function runScenario(browser, label, fn) {
  console.log(`\n[${label}]`);
  const page = await openGamePage(browser);
  try {
    await fn(page);
  } catch (e) {
    console.error(`  ✗ error: ${e.message}`);
  }
  await page.close();
}

// ── main ─────────────────────────────────────────────

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  // サーバーを起動
  console.log('Starting server...');
  const server = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'ignore',
    detached: false,
  });
  server.on('error', e => console.error('Server error:', e.message));

  await waitForServer(PORT);
  console.log('Server ready.');

  const browser = await chromium.launch({ headless: true });

  // ─────────────────────────────────────────────────
  // 1. 基本コメント表示 (sec-features の AI生成等)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-features: コメント表示', async (page) => {
    await comments(page, [
      ['u1', 'さくら', 'こんにちは！'],
      ['u2', 'たろう', 'やっほー！'],
      ['u3', 'りく',   'よろしく！'],
    ]);
    await page.waitForTimeout(1200);
    await shot(page, 'sec-features.png');
  });

  // ─────────────────────────────────────────────────
  // 2. キャラ設定 (sec-char)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-char: キャラ表示', async (page) => {
    await comments(page, [
      ['u1', 'あかね', 'キャラ1 色:赤 吹き出し:丸 こんにちは！'],
      ['u2', 'あお',   'キャラ2 色:青 吹き出し:四角 やあ！'],
      ['u3', 'みどり', 'キャラ3 色:緑 吹き出し:雲 ねえねえ！'],
    ]);
    await page.waitForTimeout(1500);
    await shot(page, 'sec-char.png');
  });

  // ─────────────────────────────────────────────────
  // 3. 吹き出し形 (sec-bubble)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-bubble: 吹き出し形', async (page) => {
    await comments(page, [
      ['u1', 'ゆき',   '吹き出し:丸 丸い吹き出し！'],
      ['u2', 'はな',   '吹き出し:棘 とげとげ！'],
      ['u3', 'かい',   '吹き出し:雲 もくもく！'],
      ['u4', 'りょう', '吹き出し:ハート ハート型！'],
      ['u5', 'みか',   '吹き出し:星 キラキラ！'],
    ]);
    await page.waitForTimeout(1500);
    await shot(page, 'sec-bubble.png');
  });

  // ─────────────────────────────────────────────────
  // 4. 吹き出し装飾 (sec-deco)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-deco: 吹き出し装飾', async (page) => {
    await comments(page, [
      ['u1', 'にじ',   '飾り:虹 レインボー！'],
      ['u2', 'ほのお', '飾り:炎 燃えてる！'],
      ['u3', 'きん',   '飾り:金 ゴールド！'],
      ['u4', 'きらり', '飾り:光る 光ってる！'],
    ]);
    await page.waitForTimeout(1500);
    await shot(page, 'sec-deco.png');
  });

  // ─────────────────────────────────────────────────
  // 5. 文字色 (sec-color)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-color: 文字色', async (page) => {
    await comments(page, [
      ['u1', 'あか',     '色:赤 赤色！'],
      ['u2', 'あお',     '色:青 青色！'],
      ['u3', 'みどり',   '色:緑 緑色！'],
      ['u4', 'きいろ',   '色:黄 黄色！'],
      ['u5', 'むらさき', '色:紫 紫色！'],
    ]);
    await page.waitForTimeout(1500);
    await shot(page, 'sec-color.png');
  });

  // ─────────────────────────────────────────────────
  // 6. エフェクト・モーション (sec-effects / sec-motion)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-effects: モーション', async (page) => {
    await comments(page, [
      ['u1', 'はしる', '移動:速い 速く走る！'],
      ['u2', 'ゆっくり', '移動:遅い ゆっくり歩く！'],
      ['u3', 'おおきい', '大きさ:大 でかい！'],
    ]);
    await page.waitForTimeout(2000);
    await shot(page, 'sec-effects.png');
    await shot(page, 'sec-motion.png');
  });

  // ─────────────────────────────────────────────────
  // 7. フォント (sec-font)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-font: フォント', async (page) => {
    await comments(page, [
      ['u1', 'ロック',   'フォント:RocknRoll One ロックなフォント！'],
      ['u2', 'りょう',   'フォント:Reggae One レゲエフォント！'],
      ['u3', 'みんちょ', 'フォント:Yuji Syuku 雪柳フォント！'],
    ]);
    await page.waitForTimeout(1500);
    await shot(page, 'sec-font.png');
  });

  // ─────────────────────────────────────────────────
  // 8. ペットガチャ (sec-pet)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-pet: ペットガチャ', async (page) => {
    // まずキャラを出す
    await comment(page, 'u1', 'ペットユーザー', 'こんにちは！');
    await page.waitForTimeout(600);
    // ペットガチャ
    await comment(page, 'u1', 'ペットユーザー', 'ペットガチャ');
    await page.waitForTimeout(2000);
    await shot(page, 'sec-pet.png');
  });

  // ─────────────────────────────────────────────────
  // 9. ステータス確認・装備 (sec-equip)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-equip: ステータス確認', async (page) => {
    await comment(page, 'u1', 'ステータスさん', 'こんにちは！');
    await page.waitForTimeout(600);
    // ペットガチャして装備ドロップの機会を作る
    await comment(page, 'u1', 'ステータスさん', 'ペットガチャ');
    await page.waitForTimeout(1000);
    await comment(page, 'u1', 'ステータスさん', 'ステータス確認');
    await page.waitForTimeout(2000);
    await shot(page, 'sec-equip.png');
  });

  // ─────────────────────────────────────────────────
  // 10. スロット (sec-game)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-game: スロット', async (page) => {
    await comment(page, 'u1', 'スロットさん', 'こんにちは！');
    await page.waitForTimeout(500);
    await comment(page, 'u1', 'スロットさん', 'スロット');
    await page.waitForTimeout(1500);
    // スロットが回っている間にスクショ
    await shot(page, 'sec-game.png');
  });

  // ─────────────────────────────────────────────────
  // 11. ボス召喚 (sec-boss)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-boss: ボス召喚', async (page) => {
    // 複数ユーザーを出す
    await comments(page, [
      ['u1', '勇者A', 'こんにちは！'],
      ['u2', '勇者B', 'やあ！'],
      ['u3', '勇者C', 'いざ！'],
    ], 300);
    await page.waitForTimeout(500);
    // ボス召喚
    await comment(page, 'boss_caller', 'ボス召喚者', 'ボス召喚');
    await page.waitForTimeout(2500);
    // ボスが表示された状態でスクショ
    await shot(page, 'sec-boss.png');
  });

  // ─────────────────────────────────────────────────
  // 12. アゲルボスバトル (sec-ageru-boss) - ボスと攻撃
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-ageru-boss: ボス攻撃', async (page) => {
    await comments(page, [
      ['u1', '剣士',  'こんにちは！'],
      ['u2', '魔法使い', 'やあ！'],
    ], 300);
    await page.waitForTimeout(400);
    await comment(page, 'u0', 'ボス召喚者', 'ボス召喚');
    await page.waitForTimeout(1500);
    // ボスを攻撃
    await comment(page, 'u1', '剣士', '射');
    await page.waitForTimeout(800);
    await comment(page, 'u2', '魔法使い', '射');
    await page.waitForTimeout(800);
    await shot(page, 'sec-ageru-boss.png');
  });

  // ─────────────────────────────────────────────────
  // 13. スタイル・キャラ外見 (sec-style)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-style: スタイル', async (page) => {
    await comments(page, [
      ['u1', 'スタイルA', 'キャラ5 色:水色 大きさ:大 吹き出し:叫び わあ！'],
      ['u2', 'スタイルB', 'キャラ10 色:ピンク 大きさ:中 飾り:虹 ふわふわ！'],
      ['u3', 'スタイルC', 'キャラ15 色:白 大きさ:小 吹き出し:思考 ？？？'],
    ]);
    await page.waitForTimeout(1500);
    await shot(page, 'sec-style.png');
  });

  // ─────────────────────────────────────────────────
  // 14. メディア (sec-media)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-media: キャラ複数', async (page) => {
    await comments(page, [
      ['u1', 'A', 'こんにちは！'],
      ['u2', 'B', 'よろしく！'],
      ['u3', 'C', 'ねえ！'],
      ['u4', 'D', 'おーい！'],
    ], 300);
    await page.waitForTimeout(1200);
    await shot(page, 'sec-media.png');
  });

  // ─────────────────────────────────────────────────
  // 15. アゲルちゃん (sec-ageru)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-ageru: キャラ画面', async (page) => {
    await comments(page, [
      ['u1', 'アゲルファン', 'こんにちは！'],
      ['u2', 'ゆーざー', '色:オレンジ おはよう！'],
    ]);
    await page.waitForTimeout(1200);
    await shot(page, 'sec-ageru.png');
  });

  // ─────────────────────────────────────────────────
  // 16. 称号 (sec-titles)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-titles: ステータス', async (page) => {
    await comment(page, 'u1', '称号ユーザー', 'こんにちは！');
    await page.waitForTimeout(500);
    for (let i = 0; i < 5; i++) {
      await comment(page, 'u1', '称号ユーザー', 'ペットガチャ');
      await page.waitForTimeout(400);
    }
    await comment(page, 'u1', '称号ユーザー', 'ステータス確認');
    await page.waitForTimeout(2000);
    await shot(page, 'sec-titles.png');
  });

  // ─────────────────────────────────────────────────
  // 17. コマンド生成（静的UI - ゲームページで代替）
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-cmdgen: コマンド生成UI', async (page) => {
    await comments(page, [
      ['u1', 'コマンドA', '色:赤 吹き出し:丸 移動:速い こんにちは！'],
      ['u2', 'コマンドB', '色:青 吹き出し:棘 大きさ:大 やあ！'],
    ]);
    await page.waitForTimeout(1200);
    await shot(page, 'sec-cmdgen.png');
  });

  // ─────────────────────────────────────────────────
  // 18. コマンドリファレンス（多数ユーザー画面）
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-cmdref: コマンド参照', async (page) => {
    await comments(page, [
      ['u1', 'ユーザー1', '色:赤 こんにちは！'],
      ['u2', 'ユーザー2', '色:青 やあ！'],
      ['u3', 'ユーザー3', '色:緑 おーい！'],
      ['u4', 'ユーザー4', '色:黄 ねえ！'],
      ['u5', 'ユーザー5', '吹き出し:雲 もくもく'],
    ], 250);
    await page.waitForTimeout(1200);
    await shot(page, 'sec-cmdref.png');
  });

  // ─────────────────────────────────────────────────
  // 19. 設定 (sec-settings)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-settings: 設定', async (page) => {
    await comments(page, [
      ['u1', 'せってい', 'こんにちは！'],
      ['u2', 'かんり', '色:水色 設定画面へ！'],
    ]);
    await page.waitForTimeout(1200);
    await shot(page, 'sec-settings.png');
  });

  // ─────────────────────────────────────────────────
  // 20. サンプル・使用例 (sec-examples)
  // ─────────────────────────────────────────────────
  await runScenario(browser, 'sec-examples: 使用例', async (page) => {
    await comments(page, [
      ['u1', '配信者', '色:白 大きさ:大 飾り:金 吹き出し:叫び ようこそ！！！'],
      ['u2', 'リスナーA', '色:水色 吹き出し:丸 こんばんは！'],
      ['u3', 'リスナーB', '色:ピンク 飾り:虹 今日もよろしく！'],
    ]);
    await page.waitForTimeout(1500);
    await shot(page, 'sec-examples.png');
  });

  await browser.close();

  // サーバーを停止
  server.kill();

  const files = fs.readdirSync(OUT).filter(f => f.endsWith('.png'));
  console.log(`\n完了！ ${files.length} 枚のスクショを ${OUT} に保存しました。`);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
