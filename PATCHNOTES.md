# kukuCome パッチノート

---

## v2.266.0 — 2026-05-29

### 自動AFK・自動削除からmasterキャラを除外、タイムアウト延長

- `public/app.js`: 自動AFK・自動削除どちらも `u.ipid === 'master'` の場合はスキップ
- 自動削除のタイムアウトを10分 → 30分に変更

---

## v2.265.0 — 2026-05-29

### セーブ機能改修：icon_num途中設定時にキャラを即時上書き

- `public/app.js`: ipidで登場後にicon_numが付いた場合、icon_numのセーブデータを適用した後にDOM表示も即時更新するよう修正
  - `atk`・`maxHp` を再計算
  - `user.el` が存在する場合は `applyAvatarStyle`・`updateNameDisplay`・`updateStatsDisplay`・`updateLevelBadge`・`applyPets` を呼び出して反映

---

## v2.264.0 — 2026-05-29

### ステータス確認画面の記録エリアを拡充

- スロット回数を「XX回 / XX当選」形式に変更（`tc.slotWins` を併記）
- 宝箱開封数（`tc.treasureOpens`）を追加

---

## v2.263.0 — 2026-05-29

### ステータス確認画面にクリティカル率を表示

- `public/app.js`: ATKの下に「CRT XX%」を追加（基礎15% + ペット補正 + 称号補正の合計）

---

## v2.262.0 — 2026-05-29

### ステータス確認画面の記録エリアにスロット・ペットガチャ回数を追加

- `public/app.js`: 記録エリアに「スロット回数（`tc.slotPlays`）」「ペットガチャ（`tc.petGachas`）」の2行を追加

---

## v2.261.0 — 2026-05-29

### 管理パネルリロード時に総評プロンプトが空になるバグ修正

- `public/app.js`: `getState` レスポンスに `ollamaReviewPrompt` を追加（`aiSystem` と同様に返すよう修正）

---

## v2.260.0 — 2026-05-29

### セーブ機能改修

- `public/app.js`: コメントレスポンスに `icon_num` がある場合、そのキャラのセーブキーを `icon_num` に更新（`user.saveKey`）
  - `icon_num` キーの既存セーブデータがあれば優先適用（見た目・ステータス含む全フィールド）
  - 自動セーブは `u.saveKey || u.ipid` をキーに使用
  - ゴミ箱ドロップ・10分自動削除どちらも `saveKey` を使って削除
  - 管理パネルからの個別削除ブロードキャスト `deleteCharSave` を受信して `_charSaveData` から除去
- `public/admin.html`: セーブ管理パネルにセーブデータ個別削除機能を追加
  - 「🔄 一覧を更新」ボタンで現在のセーブデータ一覧を表示（キー・名前・レベル）
  - 各行の「🗑」ボタンで個別削除（サーバー削除 + app.jsへのブロードキャスト）

---

## v2.259.0 — 2026-05-29

### 10分無コメントで自動削除

- `public/app.js`: 10分間コメントがないキャラを自動的にゴミ箱ドロップと同じアニメーション＋処理で削除するインターバルを追加（60秒ごとにチェック）
- 手動でAFK/ＡＦＫコマンドや放置:/無明:コマンドを入力したキャラは除外（`u.afkManual` フラグで管理）
- AFK解除時（次のコメント送信時）に `u.afkManual` もリセット
- BR中に削除されたキャラはサバイバーリストから除去し、終了チェックも実施

---

## v2.258.0 — 2026-05-29

### index.html コマンド生成機能を最新化

- フォントチップに12種追加（BIZUDゴシック・源界明朝・蒼空明朝・またたき明朝・書楽宴・すし器・MOBO・コトノル・fontopoBOKU・ORIENTAL・NIKUKYU・Arial・InkFree）
- JS の `CmdGen.state` を整理
- `飾り:なし` と `フォント:デフォルト` も明示的に生成するよう修正（リセット用途に対応）

---

## v2.257.0 — 2026-05-29

### index.html 機能解説を大幅拡充

- 機能解説セクションに新カードを7枚追加：タイマン（1v1決闘）・スロット・宝箱・競馬・自動AFK・Discord/Ollama連携・TTS/AI/ノベル
- 既存カードを詳細化：ボスバトル（管理パネル設定・揺れ設定・自動召喚）、キャラステータス（MP消費一覧・キャラ名装飾）、早押し（白/赤ストリームの違い）、AI画像生成（コマンド別名追記）
- ペットセクションのヒントボックスを拡充（2スロット解放条件・攻撃モーション説明）
- ボスバトルセクションの補足を追加（管理パネル設定・自動召喚）
- コマンド一覧のタイマン・スロット・開ける・AFK の説明を詳細化

---

## v2.256.0 — 2026-05-29

### index.html コマンドリファレンスを最新仕様に更新

- `名前:` コマンドの最大文字数を「20文字」→「10文字」に修正（コマンド生成フォームの maxlength も更新）
- 名前コマンドの説明に「文字色・背景色・フォント・装飾がキャラ名にも反映される」旨を追記
- `ステータス確認` の説明に Discord Webhook 連携時のスクリーンショット自動投稿について追記（Ollama 総評なしでも投稿）
- `ペットガチャ` の MP消費表記を全ページで統一（誤記 MP10 → 正 MP20 に5箇所修正）
- 文字色と吹き出し背景色に同じ色を指定した場合の自動文字色変更仕様を色セクションに追記

---

## v2.255.0 — 2026-05-29

### コンパクトモード中も揺れオーバーレイを表示

- `style.css`: `body.compact-mode .jiggle-overlay { display: none !important; }` を削除し、コンパクトモード中でも胸の揺れ設定が反映されるよう修正

---

## v2.254.0 — 2026-05-29

### captureAndPostDiscord の DOM 復元・レイアウト安定化修正

- `app.js` `captureAndPostDiscord()`:
  - DOM スタイル復元処理を `try` ブロック内から `finally` ブロックに移動し、エラー時も必ず復元されるよう修正
  - `height: auto` の適用を他の overflow 変更より後にすることでレイアウト崩壊を防止
  - スタイル変更後に `requestAnimationFrame` で1フレーム待機し、ブラウザのリフローを確実に待つよう修正
  - `captureW / captureH` に `scrollWidth || offsetWidth` フォールバックを追加（0×0 キャプチャを防止）
  - 画像置換処理も `finally` ブロック内で確実に復元するよう整理

---

## v2.253.0 — 2026-05-29

### ステータス確認の Discord 連携にデバッグログを追加

- `app.js` `captureAndPostDiscord()`: 各ステップ（開始・画像差し替え・html2canvas・POST・レスポンス・コメント投稿）に `console.log` を追加
- Ollama フローにも開始・レスポンス・タイムアウト時のログを追加

---

## v2.252.0 — 2026-05-29

### AFK スライダーをサーバー設定に追加

- `app.js`: `afkOpacity`・`afkGrayscale`・`afkBrightness` を `SETTINGS_KEYS` に追加（サーバー保存対応）
- AFK スライダーの `input` ハンドラに `saveSettingsToServer()` を追加

---

## v2.251.0 — 2026-05-29

### 吹き出し背景色と文字色が同色の場合にランダム文字色を設定

- `app.js`: `色:` / `吹き出し背景色:` コマンド処理後、`textColor === bubbleBgColor` の場合は `COLOR_NAMES` からランダムな別の色を `textColor` に設定

---

## v2.250.0 — 2026-05-29

### 爆弾・ゴミ箱の表示状態を保存

- `app.js`: `bombHidden` / `trashHidden` を `localStorage` + サーバー設定（`SETTINGS_KEYS`）に保存
- トグルボタン押下時に `localStorage.setItem` と `saveSettingsToServer()` を呼ぶよう追加
- ページ読み込み時に保存済み状態を反映（ボタン非表示・active クラス付与）

---

## v2.249.0 — 2026-05-29

### 名前変更コマンドの文字数制限

- `app.js`: `名前:` コマンドで10文字を超える名前が指定された場合、先頭10文字のみを使用するよう修正

---

## v2.248.0 — 2026-05-29

### ボスの揺れオーバーレイを水平反転に対応

- `app.js` `updateBossJiggleOverlay()`: オーバーレイに `transform: scaleX(-1)` を追加（ボス画像のデフォルト反転に合わせる）

---

## v2.247.0 — 2026-05-29

### 管理パネルの揺れ設定にボスを追加

- `app.js`: `getUsers` レスポンスに `bossImgFile` を追加
- `admin.html`: 揺れ設定の画像グリッドにボス画像を「👹 BOSS」ラベルで先頭表示
- 🔄 更新ボタンを押すとボスが表示中の場合にグリッドへ反映される

---

## v2.246.0 — 2026-05-29

### ボスに胸の揺れ（jiggle）を適用

- `app.js`: `updateBossJiggleOverlay()` 関数を追加（`updateJiggleOverlay` のボス版）
- `spawnBoss()`: `bossState` に `imgFile` を保存、スポーン時に `updateBossJiggleOverlay()` を呼び出し
- `jiggleConfig` 更新時: ボス画像が対象ファイルと一致する場合も `updateBossJiggleOverlay()` を呼び出し

---

## v2.245.0 — 2026-05-29

### キャラ名表示に吹き出しと同じ装飾を適用

- `app.js` `updateNameDisplay()`: 文字色（`textColor`）・背景色（`bubbleBgColor`）・フォント（`font`）・装飾クラス（`bubbleDeco`）をキャラ名ラベルに反映するよう拡張
- `ensureCharOnStage()`: キャラ生成時に `updateNameDisplay()` を呼ぶよう追加
- `handleComment()`: 背景色・文字色・フォント・飾りの変更時に `updateNameDisplay()` を呼ぶよう追加
- ステータスモーダルの名前表示（`.sm-ol-name`）は装飾なしに戻す

---

## v2.244.0 — 2026-05-29

### ステータス確認 Discord 連携の改善

- `app.js` `showStatusModal()`: Ollama レビューに 9 秒タイムアウトを追加（`Promise.race`）
- タイムアウト時は総評なしでキャプチャ・投稿を実行
- Ollama 未設定の場合も 600ms 後にキャプチャ・投稿を実行（既存動作を維持）

---

## v2.242.0 — 2026-05-29

### ステータスモーダル：名前表示に吹き出しと同じ装飾を適用

- `app.js` `showStatusModal()`: `.sm-ol-name` にユーザーの `textColor`・`bubbleBgColor`・`font`・`bubbleDeco` を inline style / class で適用
- `style.css`: `.sm-ol-name` に `padding: 2px 7px; border-radius: 6px` を追加（背景色が見えるように）

---

## v2.241.0 — 2026-05-29

### ステータス確認のテキスト自動コメントを廃止

- `app.js`: ステータス確認コマンド実行時の `postStatusComment()` 呼び出しを削除
- `postStatusComment()` 関数を削除（Discord 画像 URL コメントに一本化）

---

## v2.240.0 — 2026-05-29

### キャプチャ画像に称号が含まれないバグ修正

- `app.js` `captureAndPostDiscord()`: `.sm-content` / `.sm-title-panel` / `.sm-title-list` の `overflow` / `height` / `minHeight` / `flex` をキャプチャ前に一時解除し全称号が映るよう修正

---

## v2.239.0 — 2026-05-29

### ステータスモーダル横幅拡大

- `style.css`: `.sm-modal` の `width` を `82vw` → `65vw` に変更、`max-width` を `1040px` → `1230px` に変更

---

## v2.234.1 — 2026-05-29

### ライブタイトル取得の CORS 修正

- `server.js`: `/api/live-info` プロキシエンドポイント追加（`category=mylive&type=port_info` をサーバー経由で取得）
- `app.js`: ライブタイトル取得を外部 URL 直接 fetch → `/api/live-info` プロキシ経由に変更

---

## v2.234.0 — 2026-05-29

### ステータスモーダルのヘッダーを配信タイトル＋日時に変更

- `showStatusModal()`: ヘッダーを「配信タイトル（APIから取得）」＋「現在の年月日-時刻」に変更
- モーダル表示後に `https://live.erinn.biz/api/?category=mylive&type=port_info&apikey=...` を fetch し `livetitle` をヘッダーに反映
- apikey なし / 取得失敗時は「ステータス確認」にフォールバック
- `.sm-header-live-title` / `.sm-header-date` クラス追加

---

## v2.238.0 — 2026-05-29

### ステータスモーダル：称号を2列表示に変更

- `.sm-title-list`: `flex-direction: column` → `grid-template-columns: 1fr 1fr` の2列グリッドに変更
- `.sm-title-panel`: 幅を 190px → 380px（2列分）に拡大

---

## v2.237.0 — 2026-05-29

### キャプチャ画像の画質向上

- `html2canvas` の `scale: 1` → `scale: 2` に変更（解像度2倍）
- キャラ・ペット画像のキャンバス差し替えも同じ scale2 で高解像度描画

---

## v2.236.0 — 2026-05-29

### キャプチャ画像の品質改善（引き伸ばし修正・総評エリア含める）

- `captureAndPostDiscord()`:
  - img を `onclone` ではなく html2canvas 実行前に実 DOM でキャンバスに差し替え（object-fit:contain を Canvas API で手動描画）、キャプチャ後に元に戻す
  - キャプチャ前に `sm-modal`/`sm-content`/`sm-main-panel` の overflow/height 制約を一時解除し全コンテンツを展開。総評エリアも確実にキャプチャされるように

---

## v2.235.0 — 2026-05-29

### キャプチャ画像の引き伸ばし修正（再）

- `fixContain()`: canvas 差し替え方式 → `background-image + background-size:contain` div 差し替え方式に変更
  - html2canvas は background-size:contain を正しくサポートするため、余白を維持しつつ引き伸ばしなしで描画される

---

## v2.233.0 — 2026-05-29

### キャプチャ画像のキャラ・ペット余白消え修正

- `fixContain()`: margin 方式から canvas 差し替え方式に変更。box サイズのキャンバスに `object-fit:contain` 相当の描画を行い img と置換することで、余白（レターボックス）を正確に再現

---

## v2.232.1 — 2026-05-29

### アンカー番号を number に変更

- `app.js`: Discord 画像 URL コメントのアンカーを `comment.icon_num` → `comment.number` に変更

---

## v2.232.0 — 2026-05-29

### ステータス画像キャプチャの引き伸ばし修正

- `captureAndPostDiscord()`: html2canvas の `onclone` コールバックで `.sm-avatar` / `.sm-pet-img` の `object-fit: contain` を手動計算して適用し、キャラ・ペット画像の引き伸ばしを修正

---

## v2.231.1 — 2026-05-29

### アンカーを icon_num に変更

- `app.js`: `showStatusModal` に渡すアンカー番号を `comment.cnum` → `comment.icon_num` に変更

---

## v2.231.0 — 2026-05-29

### ステータス Discord 連携の改善

- クリックでステータス確認を開いた場合は Discord 投稿しない（`triggerCnum == null` のときスキップ）
- html2canvas に `height/width: modalEl.clientHeight/Width` を指定し、スクロール部分を含めず実際の表示と同じ高さでキャプチャ
- 自動コメントに `>>{cnum}` アンカーを付与（例: `>>3 https://...`）
- `showStatusModal` に第3引数 `triggerCnum` を追加

---

## v2.230.0 — 2026-05-29

### ステータス確認画面を Discord に画像投稿・URL を自動コメント

- `public/index.html`: `html2canvas@1.4.1` を CDN から読み込み
- `server.js`: `/api/status-screenshot` POST エンドポイント追加
  - base64 画像を受け取り Discord webhook に `?wait=true` で投稿
  - レスポンスから `attachments[0].url` を取得して返却
- `app.js`:
  - `captureAndPostDiscord()` 関数を追加（html2canvas でモーダルをキャプチャ → `/api/status-screenshot` → `postAIReply` で URL をコメント投稿）
  - 総評プロンプトありの場合: Ollama 応答後にキャプチャ
  - 総評プロンプトなしの場合: 600ms 後にキャプチャ

---

## v2.229.0 — 2026-05-29

### ステータスモーダル：総評ラベルを「コメント」に変更

- `showStatusModal()`: レビューエリアのラベル「🤖 総評」→「コメント」に変更

---

## v2.228.2 — 2026-05-29

### 総評プロンプトのサーバー保存対応

- `app.js`: `aiText` ハンドラで `saveSettingsToServer()` を呼び出し、`data/settings.json` にも保存するように修正（再起動後も設定が維持される）

---

## v2.228.1 — 2026-05-29

### 総評プロンプトが反映されないバグ修正

- `app.js`: `aiText` ハンドラの `elMap` に `ollamaReviewPrompt` を追加し、`if (elId)` の外で `localStorage.setItem` と変数更新を実行するよう修正

---

## v2.228.0 — 2026-05-29

### ステータス確認画面にOllama総評を追加

- `server.js`: `/api/ollama-review` POSTエンドポイント追加（comments配列・systemPrompt・モデルを受け取りOllama `/api/chat` で総評を生成）
- `app.js`:
  - `user.recentComments[]` に最新150件のコメントを蓄積
  - `SETTINGS_KEYS` に `ollamaReviewPrompt` を追加
  - `showStatusModal()`: 総評プロンプトが設定されている場合、キャラ表示エリア下に `.sm-review-area` を表示し非同期でOllamaから総評を取得
- `admin.html`: AI設定セクションに「総評プロンプト」テキストエリアを追加、`applyState()` で復元対応
- `style.css`: `.sm-review-area` / `.sm-review-label` / `.sm-review-text` / `.sm-review-loading` クラス追加

---

## v2.227.0 — 2026-05-29

### ステータスモーダル：ペット画像を1.3倍に拡大

- `.sm-pet-img`: 108px → 140px（1.3倍）に変更

---

## v2.226.0 — 2026-05-29

### ステータスモーダル：称号表示の改善

- 称号の `【】` を削除
- 称号とHPステータスを `.sm-ol-stats-wrap` で包み独立表示（称号ブロック → ステータスブロックの縦並び）
- `.sm-ol-stats-wrap`: `position: absolute; top: 6px; left: 6px` で左上に配置
- `.sm-ol-title`: 独自の半透明背景付きブロックに変更

---

## v2.225.0 — 2026-05-29

### ステータスモーダル：称号をレア度高い順に表示

- `showStatusModal()`: 称号リストをレア度順（虹 → 金 → 通常）にソートして表示
- `titleRank()` ヘルパーで T99/T100 → 0、金称号 → 1、通常 → 2 に分類

---

## v2.224.0 — 2026-05-29

### ステータスモーダル：表示中の称号をHPの上にオーバーレイ表示

- `showStatusModal()`: `sm-ol-stats` 内のHP行の上に表示中称号を追加（`.sm-ol-title`）
- `.sm-ol-title`: 金色・太字で称号名を表示するクラス追加

---

## v2.223.0 — 2026-05-29

### ステータスモーダル：装備一覧を70%サイズに縮小

- `.sm-ol-equip`: `transform: scale(0.7); transform-origin: bottom right` 追加

---

## v2.222.0 — 2026-05-29

### ステータスモーダル：装備一覧をキャラ画像右下にオーバーレイ表示

- `showStatusModal()`: 装備一覧を `sm-left` 内に移動し `.sm-ol-equip` でラップ
- `.sm-ol-equip`: `position: absolute; bottom: 6px; right: 6px` でキャラ画像右下に重ね表示

---

## v2.221.0 — 2026-05-29

### ステータスモーダルの高さ変更

- `.sm-modal`: `height: 82vh` → `60vh` に変更

---

## v2.220.0 — 2026-05-29

### ステータスモーダルの高さを固定

- `.sm-modal`: `max-height: 82vh` → `height: 82vh` に変更し、コンテンツ量によらず高さを固定

---

## v2.219.0 — 2026-05-29

### ステータスモーダル：装備一覧をキャラ画像右に独立配置・2列表示

- `showStatusModal()`: 装備一覧を `sm-right` から取り出し、`sm-left` の右隣に `.sm-equip-side` として配置
- `.sm-equip-side` クラス追加（`align-self: flex-start` でキャラ画像の高さに揃える）
- `.sm-equip-list`: `display: grid; grid-template-columns: repeat(2, auto)` で2列表示に変更

---

## v2.218.0 — 2026-05-29

### ステータスモーダル：名前・LV のフォントサイズ変更

- `.sm-ol-name`: 15px → 20px（1.3倍）
- `.sm-ol-lv`: 14px → 28px（2倍）

---

## v2.217.0 — 2026-05-29

### ステータスモーダル：装備一覧を1行表示に変更

- `.sm-equip-list`: grid → `display: flex; flex-wrap: nowrap` に変更し、常に1行で横並び表示

---

## v2.216.0 — 2026-05-29

### ステータスモーダル：Lv オーバーレイの位置ずれ修正

- `.sm-left`: `align-self: flex-start` を追加し、sm-right の高さに引き伸ばされないよう修正（bottom: 6px が画像の底に正しく配置されるようになる）

---

## v2.215.0 — 2026-05-29

### ステータスモーダル：装備一覧の横幅をコンテンツ幅に縮小

- `.sm-equip-list`: `grid-template-columns: repeat(4, 1fr)` → `repeat(4, auto)`、`width: fit-content` 追加

---

## v2.214.0 — 2026-05-29

### ステータスモーダルのキャラ画像を2.5倍に変更

- `.sm-avatar`: 480px → 400px（元160pxの2.5倍）に変更

---

## v2.213.0 — 2026-05-29

### ステータスモーダル：装備一覧をペット情報の下に移動

- `showStatusModal()`: `sm-equip-section` を廃止し、装備一覧を `sm-right` 内のペットセクション下に移動

---

## v2.212.0 — 2026-05-29

### ステータスモーダルのレイアウト刷新（キャラ画像オーバーレイ表示）

- 名前をキャラ画像の右上にオーバーレイ表示（`.sm-ol-name`）
- Lv をキャラ画像の左下にオーバーレイ表示（`.sm-ol-lv`）
- HP / MP / ATK / EXP をキャラ画像の左上にオーバーレイ表示（`.sm-ol-stats`）、1行ずつ縦並び
- `.sm-right` は 📈 記録・🐾 ペット のみに整理
- `public/style.css`: `.sm-left` に `position: relative` 追加、`.sm-ol-name` / `.sm-ol-lv` / `.sm-ol-stats` / `.sm-ol-stat` クラス追加

---

## v2.211.0 — 2026-05-29

### ペット横並び表示の修正

- `showStatusModal()`: `.sm-pet-row` に inline style で `flex-direction:row` を明示し確実に横並びになるよう修正
- `.sm-pet-block`: `flex-shrink: 0` を追加して縮まらないように

---

## v2.210.0 — 2026-05-29

### ペット画像サイズを1.5倍に変更

- `.sm-pet-img`: 144px → 108px（72pxの1.5倍）に変更

---

## v2.209.0 — 2026-05-29

### ステータスモーダル：ペット2体を横並び表示

- `showStatusModal()`: ペットブロックを `.sm-pet-row` コンテナで囲み横並びに
- `.sm-pet-row`: `display: flex; flex-direction: row; gap: 12px; flex-wrap: wrap` 追加

---

## v2.208.0 — 2026-05-29

### ステータスモーダルのペット表示改善

- `.sm-pet-block`: `flex-direction: column` に変更し画像の下にテキストを表示
- `.sm-pet-img`: 72px → 144px（2倍）に拡大
- `.sm-pet-info`: `align-items: center; text-align: center` を追加してテキストを中央揃え

---

## v2.207.0 — 2026-05-29

### ステータスモーダルのレイアウト改善（名前・ペット位置変更）

- `showStatusModal()`: 名前・アイコン名・レベルを `sm-left`（画像横）から `sm-right` の先頭（ステータスセクションの上）に移動
- `showStatusModal()`: ペット情報セクション（🐾）を装備一覧の下から `sm-right` 内の「📈 記録」セクションの下に移動
- これにより「名前→ステータス→記録→ペット」という読みやすい縦並び順になった

---

## v2.206.1 — 2026-05-29

### ステータスモーダルのレイアウト修正

- `.sm-modal` の幅を `56vw / 720px` → `82vw / 1040px` に拡大
- `.sm-right` に `min-width: 200px; max-height: 480px` を追加してスタッツ欄が潰れないように調整

---

## v2.206.0 — 2026-05-29

### ステータス確認モーダルのキャラ画像を3倍に拡大

- `.sm-avatar` の width/height を 160px → 480px に変更

---

## v2.205.0 — 2026-05-29

### ダメージ表示を常に最前面に・HPバーに数値を重ね表示

- `showDamageNumber()`: `el.style.zIndex = charZCounter + 1` を設定し、常に最前面のキャラより手前に表示
- `updateStatsDisplay()`: HPバーに `<span class="cs-hpnum">` を追加して現在HP数値を重ね表示
- `public/style.css`:
  - `.cs-hpbar` の height を 5px → 10px に変更、`position: relative` を追加
  - `.cs-hpnum` クラス追加（絶対配置、7px 太字、黒テキストシャドウ）

---

## v2.204.0 — 2026-05-29

### 揺れ設定プレビューにアニメーション表示を追加

- 管理パネルのプレビューで実際の揺れアニメーションを確認可能に
- `#jigglePreviewOverlay` / `#jigglePreviewOverlayImg` をプレビュー内に追加
- `@keyframes jiggleBounce` を admin.html の `<style>` に追加
- スライダー操作のたびに clip-path と CSS 変数を更新してリアルタイムプレビュー
- ゾーン枠を破線に変更（アニメーションを隠さないように）

---

## v2.203.0 — 2026-05-29

### 揺れ設定の画像選択をグリッド表示に変更

- ドロップダウンを廃止し、画像サムネイルのグリッドから選択する方式に変更
- 🔄更新でキャラ画像一覧を64pxサムネイル表示（ファイル名ラベル付き）
- 選択中画像は赤枠でハイライト表示
- `_jiggleSelectedImg` 変数で選択状態を管理

---

## v2.202.0 — 2026-05-29

### 揺れエリアを四角形指定に対応（左端・右端追加）

- `jiggleConfig` に `left`（デフォルト0%）・`right`（デフォルト100%）を追加
- `clip-path: inset(top% rightInv% bottomInv% left%)` で四角形エリアを指定可能に
- 管理パネル「🫀 揺れ設定」に「左端」「右端」スライダー追加（0〜100%）
- プレビューゾーンも左右を反映して正確な四角形で表示

---

## v2.201.0 — 2026-05-29

### キャラ画像の特定部位を揺らす機能（クリップ案1）

- `jiggleConfig` 変数追加（画像ファイル名をキーにした設定オブジェクト）、localStorage + `/api/settings` に保存
- `updateJiggleOverlay(user)` 関数追加:
  - `.avatar` 内に `.jiggle-overlay` div を絶対配置で追加
  - `clip-path: inset(top% 0% bottom% 0%)` で揺れエリアを切り抜き
  - `@keyframes jiggleBounce` で translateY + scaleY アニメーション
  - CSS変数 `--jiggle-speed / --jiggle-sy / --jiggle-ty / --jiggle-origin-y` で強さ・速さを制御
- `applyAvatarStyle()` の `adjustSize` コールバック内で `updateJiggleOverlay` を呼ぶ
- `applyFacingFlip()` で揺れオーバーレイ div に `scaleX(-1)` を適用（アニメーションと干渉しない）
- `public/style.css`: `.jiggle-overlay` / `.jiggle-overlay img` / `@keyframes jiggleBounce` 追加
- `public/admin.html` 「🫀 揺れ設定」セクション追加:
  - 🔄 更新ボタンで現在ユーザーのcharImage一覧をドロップダウンに反映
  - プレビュー: キャラ画像 + 赤色の揺れエリアハイライト（リアルタイム更新）
  - スライダー: 上端(0〜100%) / 下端(0〜100%) / 強さ(0〜20%) / 速さ(0.1〜2s)
  - 有効/無効チェックボックス

---

## v2.200.0 — 2026-05-29

### ペット画像の縦長補正・ブースト・サイズ調整に対応

- `petSizeScale`（デフォルト1.0）・`petAspectExp`（0.5）・`petPortraitBoost`（0）変数を追加
- `renderPetBadge()` を DOM ベースに書き換え、キャラ画像と同様に自然サイズ取得後に補正を適用
  - 縦横比補正: `Math.pow(r, petAspectExp)` でスケール調整
  - 縦長ブースト: `r < 1 ? Math.pow(1/r, petPortraitBoost) : 1`
- `public/app.js` : SETTINGS_KEYS 追加、state 送信追加、`petSizeScale`/`petAspectExp`/`petPortraitBoost` メッセージハンドラ追加
- `public/admin.html` : 「📐 サイズ調整」に「🐾 ペット」サイズ・縦長補正・縦長ブーストスライダー追加、`applyState()` 復元追加

---

## v2.199.0 — 2026-05-29

### 装備アイコン表示位置を管理パネルから調整可能に

- `charEquipOffsetX` / `charEquipOffsetY` 変数を追加（デフォルト0）
- CSSカスタムプロパティ `--equip-x` / `--equip-y` で全キャラの装備アイコン位置を一括制御
- `public/style.css` `.char-equip-area` に `transform: translate(var(--equip-x, 0px), var(--equip-y, 0px))` 追加（前バージョンで追加済み）
- `public/app.js`:
  - `SETTINGS_KEYS` に `charEquipOffsetX`, `charEquipOffsetY` 追加
  - 起動時IIFE `applyCharEquipOffset()` で `--equip-x` / `--equip-y` を stage に適用
  - state送信に `charEquipOffsetX`, `charEquipOffsetY` を追加
  - `handleAdminMessage()` に `charEquipOffset` ハンドラ追加
- `public/admin.html`:
  - 「📐 サイズ調整」に「⚔️ 装備 横/縦」スライダー（-200〜200px）を追加
  - `syncEquipOffset()` 関数追加
  - `applyState()` で `charEquipOffsetX` / `charEquipOffsetY` を復元

---

## v2.198.0 — 2026-05-29

### ステータス表示位置を管理パネルから調整可能に

- `charStatsBottom` / `charStatsLeft` 変数を追加（デフォルト0）
- CSSカスタムプロパティ `--stats-bottom` / `--stats-left` で全キャラ一括制御
- 管理パネル「📐 サイズ調整」に「📊 ステータス 縦/横」スライダー（-200〜200px）を追加
- `/api/settings` に保存・復元

---

## v2.197.0 — 2026-05-29

### 称号をステータス表示（HPバー上）に移動

- `updateNameDisplay()` から称号タグを削除（名前の左の称号表示を廃止）
- `getTitleCls(t)` ヘルパー関数を追加（称号クラス判定を共通化）
- `updateStatsDisplay()` で称号を最上行に表示（HPバーの上）
  - 称号なしの場合は行ごと省略

---

## v2.196.0 — 2026-05-29

### ステータス表示をコンパクト化（HPバー＋アイコン）

- `updateStatsDisplay()` をHPバー＋アイコン形式に変更
  - 1行目: HPバー（50%超=緑、20%超=黄、以下=赤）＋ 💎MP
  - 2行目: ⚔️ATK ⭐EXP
- `.char-stats` を flex 列レイアウトに変更
- `.cs-hpbar` / `.cs-hpfill` / `.cs-row` クラスを追加

---

## v2.195.0 — 2026-05-29

### タイマン敗北1分後に元のキャラ画像に戻すよう変更

- 1分タイマー発火時、ランダムキャラではなく敗北前の `charImage` を復元するよう変更
- `_taimanDefeatImg`（敗北時点のcharImageを保存したフィールド）を使って元画像に戻す

---

## v2.194.0 — 2026-05-29

### ステータス表示をキャラ画像に重ねて2行表示に変更

- `char-stats` を `avatar-wrap` 内に移動（名前の上・キャラ画像に重なる位置）
- CSS を `position: absolute; bottom: 0; left: 50%; transform: translateX(-50%)` に変更
- `updateStatsDisplay()` を `innerHTML` + `<br>` で2行表示に変更
  - 1行目: `HP:x/y MP:x`
  - 2行目: `ATK:x EXP:x`

---

## v2.193.0 — 2026-05-29

### 下集合の上下位置を管理パネルで調整可能に

- `gatherMarginBottom`（デフォルト10px）変数を追加
- `gatherCharactersBottom()` の Y 座標を `stageH - charH(u) - gatherMarginBottom` に変更
- 管理パネル「📐 サイズ調整」に「⬇ 下集合 下余白」スライダー（-400〜400px、5px刻み）を追加
  - 正値 = 上方向にずらす、負値 = 画面外に沈める
- `localStorage('gatherMarginBottom')` および `/api/settings` に保存

---

## v2.192.0 — 2026-05-29

### 縦長キャラのみ全体スケールアップ（縦長ブースト）を管理パネルで設定可能に

- グローバル変数 `charPortraitBoost`（デフォルト0）を追加
- `applyAvatarStyle()` に `boost = r < 1 ? (1/r)^charPortraitBoost : 1` を追加し、縦長画像のみ幅・高さ両方を拡大
  - 0 = 無効（現状維持）
  - 0.3 = アスペクト比0.5の縦長で約1.4倍
  - 横長画像（r≥1）には影響なし
- 管理パネル「📐 サイズ調整」に「縦長ブースト」スライダー（0.00〜1.00、0.05刻み）を追加
- スライダー変更時に全キャラ即時反映

---

## v2.191.0 — 2026-05-29

### 縦長キャラ画像の補正強度を管理パネルで調整可能に

- グローバル変数 `charAspectExp`（デフォルト0.5）を追加
- `applyAvatarStyle()` の `Math.sqrt(r)` を `Math.pow(r, charAspectExp)` に変更
  - 0.5 = 従来と同じ面積統一（√r）
  - 0.0 = 高さ固定（縦長が最大に大きく表示される）
  - 中間値で縦長キャラを徐々に大きく
- 管理パネル「📐 サイズ調整」セクションに「縦長補正」スライダー（0.00〜0.50、0.05刻み）を追加
- スライダー変更時に全キャラに即時反映
- `localStorage('charAspectExp')` および `/api/settings` に保存

---

## v2.190.0 — 2026-05-29

### 管理パネルにタイマンハンデ・クールダウン設定を追加

**タイマンクールダウン**
- グローバル変数 `taimanCooldown`（デフォルト300秒）を追加
- ハードコードの `5 * 60 * 1000` を `taimanCooldown` に置き換え（ランダムタイマン・通常タイマン両方）
- 管理パネルの⚔️タイマンセクションにクールダウンスライダー（0〜1800秒、30秒刻み）を追加
- `localStorage('taimanCooldown')` および `/api/settings` に保存

**タイマンハンデ（キャラ個別ダメージ倍率）**
- `user.taimanDmgMult`（0.0〜1.0、デフォルト1.0）フィールドを追加、`CHAR_SAVE_FIELDS` に追加
- `taimanDoAttack()` でメインダメージ・ペットダメージの両方に `attacker.taimanDmgMult` を乗算
- 管理パネルに「⚔️ タイマンハンデ」セクションを追加
  - キャラ選択ドロップダウン（`getUsers` で `taimanDmgMult` も送信）
  - ダメージ倍率スライダー（0〜100%、5%刻み）
  - キャラ切り替え時に現在の倍率を自動反映

---

## v2.189.0 — 2026-05-29

### パネルの表示位置・表示状態を記憶

対象: クイズ / ダメージランキング / MPランキング / 次のBR / もじあてw

- 各パネルの表示/非表示状態を `localStorage` および `/api/settings` に保存
- ページリロード後も前回の表示状態を復元
- `brTimerVisible` / `rankingVisible` / `mpRankingVisible` / `quizVisible` / `wordleVisible` をキーとして保存
- `restorePanelVisibility()` IIFE をファイル末尾に追加（起動時に復元）
- ダメージ/MPランキングのclose ✕ を `closeRankingPanel()` / `closeMpRankingPanel()` に差し替え
- もじあてw は非表示にした場合のみ次回起動時に非表示（デフォルトは自動表示）

---

## v2.188.0 — 2026-05-29

### 自動AFK発動タイムアウトを30分に変更

- `AFK_TIMEOUT` を `5 * 60 * 1000` → `30 * 60 * 1000` に変更

---

## v2.187.0 — 2026-05-28

### AFK・放置モード中は装備アイコン非表示

- `.char-afk .char-equip-area { display: none !important; }` をCSSに追加
- `char-afk` クラスが付いている間、装備バッジエリアを非表示

---

## v2.186.0 — 2026-05-28

### 最後にコメントしたキャラを最前面に表示

- グローバルカウンター `charZCounter`（初期値70）を追加
- コメント受信時に `user.el.style.zIndex = ++charZCounter` でインクリメント
- 最後にコメントしたキャラが常に他のキャラより手前に表示される

---

## v2.185.0 — 2026-05-28

### ダメージ表示を画面内に収めるよう修正

- `showDamageNumber()` で要素をDOMに追加後 `offsetWidth/offsetHeight` で実際のサイズを取得
- `stage.clientWidth/clientHeight` に対してクランプし、画面外にはみ出さないように修正

---

## v2.184.0 — 2026-05-28

### キャラ・吹き出しをランキングパネルより手前に表示

- `.character` の `z-index: 10` → `z-index: 70`
- `.bubble` の `z-index: 65` → `z-index: 70`
- `#rankingPanel` / `#mpRankingPanel` / `#brTimerPanel`（全て z-index: 65）より手前に表示されるよう変更

---

## v2.183.0 — 2026-05-28

### 起動時にsizeScaleを1.0にリセット

- セーブデータ復元直後に `user.sizeScale = 1.0` を強制セット
- タイマン中のリロードで0.5や4.0が残存するバグを修正

---

## v2.182.0 — 2026-05-28

### キャラ画像の透明余白を一括トリム

- Pillow `getbbox()` で透明余白のバウンディングボックスを検出してクロップ（パディング2px保持）
- `public/chara/` + `chara/` の全PNG 503枚中457枚をトリム

---

## v2.181.0 — 2026-05-28

### キャラ表示面積を統一（√アスペクト比補正）

- `applyAvatarStyle()` でimg読み込み後に `r = naturalWidth/naturalHeight` を検出
- `width = px×√r`, `height = px/√r` で全キャラの `幅×高 = px²` に統一
- 縦長→高くなる、横長→横に伸びる、正方形→変化なし

---

## v2.180.0 — 2026-05-28

### 縦長キャラ画像のコンテナ幅をアスペクト比に合わせて調整

- `applyAvatarStyle()` でimg読み込み後に `naturalWidth < naturalHeight` を検出
- 縦長の場合、コンテナ幅を `px × (naturalWidth / naturalHeight)` に縮小
- 正方形・横長はそのまま

---

## v2.179.0 — 2026-05-28

### キャラサイズのランダム化廃止・object-fit変更

- `randomizeCharAppearance()` からランダムサイズ選択（50/55/60）を削除
- `.avatar img` の `object-fit: contain` → `cover` に変更

---

## v2.178.0 — 2026-05-28

### AFKバブルに「...」1文字ずつ表示アニメーション追加

- `::after` に `content: '...'` + `overflow: hidden` + `width: 0 → 1.2em` を `steps(4, end)` でアニメーション
- 2秒周期で `.` → `..` → `...` → リセット

---

## v2.177.0 — 2026-05-28

### AFKバブルをゆるやかに点滅

- `@keyframes afkPulse` を追加（2.4秒周期、opacity 1→0.35）

---

## v2.176.0 — 2026-05-28

### AFKバブル位置・背景・枠線を調整

- 位置: `top: 50%` → `top: 30%`
- 背景: `none` → `rgba(0,0,0,0.9)`
- 枠線: `none` → `1px solid rgba(255,255,255,0.1)`

---

## v2.175.0 — 2026-05-28

### AFKバブルのデザイン変更

- キャラに重ねて中央表示（`top: -28px` → `top: 50%; transform: translate(-50%,-50%)`）
- フォントサイズ 12px → 14px
- 背景の半透明を廃止（`background: none; border: none`）
- 代わりに `text-shadow` で視認性を確保

---

## v2.174.0 — 2026-05-28

### masterキャラのAFK解除を「戻りました」コメントのみに制限

- AFK解除処理に `user.ipid !== 'master'` チェックを追加
- masterは通常コメントではAFK解除されず、「戻りました」のみで解除

---

## v2.173.0 — 2026-05-28

### 5分無コメントで自動AFKモード

- コメント受信時に `user.lastCommentAt = Date.now()` を記録
- 30秒ごとの定期チェックで、最終コメントから5分経過したキャラを自動AFK状態に
- 解除は次のコメント時（既存ロジック）

---

## v2.172.0 — 2026-05-28

### コンパクトモード中のタイマン・ランダムタイマン無効化

- `タイマン:名前` / `ランダムタイマン` コマンドの先頭に `if (compactMode) return;` を追加

---

## v2.171.0 — 2026-05-28

### レベルバッジを装備アイコンエリアの右下に移動

- `updateLevelBadge()` でバッジを `.char-equip-area` 内に配置するよう変更
- `updateEquipBadge()` の `innerHTML = ''` を `.char-equip-badge` 限定削除に変更（バッジを保持するため）
- CSS: `.char-equip-area` に `position: relative` 追加
- CSS: `.char-level-badge` の位置を `bottom: 20px` → `bottom: -6px`（装備エリア基準）に変更

---

## v2.170.0 — 2026-05-28

### タイマン中のペット回復効果に仮想HP倍率を適用

- `regen`・`hp_steal`・`soul_steal`・`full_drain`・`team_heal`・`omega` の回復量に `taimanHpMult × attacker.level` を乗算
- 仮想HPプールが大きくなった分、回復量も同倍率でスケールするよう修正

---

## v2.169.0 — 2026-05-28

### ステータス確認にクイズ正解数を追加

- `showStatusModal()` の記録セクションに「クイズ正解 N 回」を追加（`user.tc.quizWins`）
- `postStatusComment()` のコメントテキストに `クイズ:N` を追加

---

## v2.168.0 — 2026-05-28

### タイマン仮想HP倍率スライダーの上限を1000xに拡張

- `admin.html` / `public/index.html` のスライダー `max="100"` → `max="1000"` に変更

---

## v2.167.0 — 2026-05-28

### タイマン仮想HPにキャラレベルを乗算

- `startTaiman()` の仮想HP計算を変更
- 旧: `calcMaxHp(char) × taimanHpMult`
- 新: `calcMaxHp(char) × taimanHpMult × char.level`
- 高レベルキャラほど仮想HPが多くなり、レベル差がバトルの長さに反映される

---

## v2.166.0 — 2026-05-28

### index.html 最新化

- `STANDALONE_CHARS` を212エントリ → 258エントリ（`data/charImages.json` と完全一致）に更新
- キャラ育成説明を最新仕様に更新：最大レベル10→100、合計EXP 150→4000
- HP説明を追加：`HP = 30 + (Lv-1)×2`（Lv.1→30HP, Lv.100→228HP）
- `lv-bar` のEXPテーブルを新曲線（Lv.1/2/5/10/20/30/50/75/100の累計EXP）に更新
- コマンド一覧に「ランダムタイマン」追加
- タイマン説明にレベル差MPペナルティ（1Lvにつき5%減）を記載

---

## v2.165.0 — 2026-05-28

### タイマン・ランダムタイマンのレベル差によるMPペナルティ

- `endTaiman()` でMP移転量にレベル差補正を追加
- 挑戦者（コマンド実行側）のレベルが対象より高い場合、1Lvにつき5%ずつ獲得MPを減少（`max(0, 1 - lvDiff * 0.05)`）
- 挑戦者が低レベルの場合はペナルティなし（低レベルが高レベルに勝った場合はフルMP獲得）
- 敗者のMPは `全MP - 移転量` を残す（`loser.mp = 0` → `loser.mp = loserFullMp - transferMp`）
- ログの敗北メッセージを `MP→0` から実際の残MP表示に変更

---

## v2.164.0 — 2026-05-28

### ステータス確認の自動コメントから装備情報を除外

- `postStatusComment()` の投稿テキストから `装備:XX` の項目を削除

---

## v2.163.0 — 2026-05-28

### ランダムタイマンコマンド追加

- コメントに「ランダムタイマン」が含まれると、ステージ上のランダムなキャラにタイマンを挑む
- 通常タイマンと同じクールダウン（5分）・タイマン中チェックを適用
- 挑める相手がいない場合は「挑める相手がいません」と表示

---

## v2.162.0 — 2026-05-28

### レベルバッジをLv100まで対応

- `updateLevelBadge()` のクラス付与ロジックをレンジ別方式に変更。Lv11以降は個別クラスではなくティア別クラスを使用
  - Lv11〜30: `.lv11plus`（インディゴ）
  - Lv31〜50: `.lv31plus`（シアン）
  - Lv51〜70: `.lv51plus`（ピンク、パルスアニメ）
  - Lv71〜90: `.lv71plus`（オレンジ〜レッド、レインボーアニメ）
  - Lv91〜99: `.lv91plus`（マルチカラーレインボー高速）
  - Lv100:   `.lv100`（金×ピンク超高速レインボー）
- `style.css` に対応クラスと `@keyframes lvHiPulse` を追加

---

## v2.161.0 — 2026-05-28

### レベル上限をLv10→Lv100に拡張、レベル毎にHP+2

- `LEVEL_EXP` を10要素のハードコード配列から100要素の数式生成配列に変更。Lv100到達に必要な累計EXP=4000（`f(i) = round((96010i + 1010i²) / 4851)` の二次曲線）
  - 1ステップあたりEXP: Lv1→2=20、Lv50→51≒40、Lv99→100≒61 の緩やかな増加
- `calcLevel()` のキャップを `Math.min(lv, 10)` → `Math.min(lv, 100)` に変更
- `calcMaxHp()` に `(lv - 1) * 2` を基本HPに加算。Lv1=30、Lv100=228
- `updateStatsDisplay()` のMAX判定を `lv >= 10` → `lv >= 100` に変更

---

## v2.160.0 — 2026-05-28

### 管理パネルにタイマン仮想HP倍率スライダーを追加

- `taimanHpMult` 変数を追加（デフォルト10倍）。`SETTINGS_KEYS` に追加してサーバー保存対応
- タイマン開始時の仮想HP計算を `calcMaxHp * 10` から `calcMaxHp * taimanHpMult` に変更
- `index.html` の管理パネルに「⚔️ タイマン」セクションを新設し `taimanHpMultSlider`（1〜100x）を追加
- `admin.html` のタイマンセクションに同スライダーを追加。`applyState` / `getState` 対応済み
- `initTaimanHpMultSlider()` IIFE を追加（`initBrHpMultSlider` と同パターン）

---

## v2.159.0 — 2026-05-28

### 神話ドロップ演出をキャラごとのパネル方式に変更

- `showMythDrop(user)` に引数追加。全画面オーバーレイ（`#mythDropOverlay`）を廃止し、`user.el` に `.myth-drop-panel` を付ける形式に変更（ペットガチャ演出と同方式）
- 星エフェクト（`.myth-star`）の生成座標をキャラ周辺（±130px）に集中するよう変更。枚数を40→24に削減
- CSSで `#mythDropOverlay` / `#mythDropRays` / `#mythDropText` および関連 `@keyframes` を削除し `.myth-drop-panel` / `.mdp-title` / `.mdp-text` / `.mdp-reveal` / `@keyframes mdpReveal` / `@keyframes mdpFadeOut` に差し替え

---

## v2.158.0 — 2026-05-28

### ボスHPゲージ幅変更・ボスを画面外へドラッグ可能に

- **HPゲージ幅**：ゲージ幅の計算を「ステージ幅の60%」から「ボス画像サイズの60%」に変更 (`spawnBoss()` 内 `barWidth` 計算)
- **ボスドラッグ範囲**：ドラッグ時の座標クランプ（`Math.max/min` によるステージ内制限）を撤廃し、画面外へも自由に移動可能に (`mousemove` ハンドラ)

---

## v2.157.0 — 2026-05-28

### タイマン敗北1分ランダムキャラの複数キャラ対応修正

- **調査結果**：異なるユーザー間では独立したクロージャにより問題なし。ただし同一ユーザーが連続敗北した場合、`_defeatCharImage` が両タイマーで同値になり2回目がスキップされる可能性があった
- **修正内容**：
  - ユーザーオブジェクトにタイマーID（`_taimanDefeatTimer`）と敗北トークン（`_taimanDefeatToken`）を保持。同一ユーザーの前回タイマーをキャンセルして重複を防止
  - `charImage` 直接比較をトークン一致 + `_taimanDefeatImg` 比較に変更。`undefined` 同士一致による誤作動も防止
  - `ランダムキャラ` / `キャラN` コマンドで自発的にキャラ変更した際に `_taimanDefeatImg` を削除し、タイマーが正しく「変更済み」と判定するよう対応

---

## v2.156.0 — 2026-05-28

### ノベル起動コマンドを master 限定に制限

- `ノベル起動` コマンドを `ipid === 'master'` のユーザー以外が実行した場合は無視するよう変更 (`public/app.js` 3235行付近)

---

## v2.155.0 — 2026-05-28

### index.html に吹き出し背景色コマンドと200色を追記

- **文字色セクション**を「文字色 / 吹き出し背景色（共通 200色）」に拡張。`色:XX` / `吹き出し背景色:XX` 両方の説明を追記
- 13色 → 200色のカラーテーブルに更新。白・灰系 / 赤系 / ピンク系 / オレンジ・コーラル系 / 黄色系 / 青系 / 緑系 / 紫系 / 茶・アース系の9カテゴリに分類
- **コマンド生成機能**に `吹き出し背景色` チップ行を追加（代表14色 + なし解除）
- `CmdGen.state` に `bgColor` フィールドを追加。`build()` で `吹き出し背景色:XX` / `吹き出し背景色:なし` を出力
- サイドバーリンクを「🎨 文字色 / 吹き出し背景色」に更新
- CSS `.color-group-title` を追加（カテゴリ見出しのグリッド全幅スパン）

---

## v2.154.0 — 2026-05-28

### 指定可能な色を200色に拡張

- `COLOR_NAMES` を 13色 → 200色に拡張（`色：XX` / `吹き出し背景色：XX` コマンドで利用可能）
- 追加カテゴリ：白・灰系、赤系、ピンク系、オレンジ・コーラル系、黄色系、青系、緑系、紫系、茶・アース系
- 主な追加色例：白 灰 銀 深紅 桜色 ラズベリー ネオンピンク ターコイズ 群青 エメラルド 抹茶 ラベンダー アメジスト セピア 錆色 など

---

## v2.153.0 — 2026-05-28

### 吹き出し背景色コマンド追加・文字色競合バグ修正

- **新コマンド**：`吹き出し背景色：色名 / #RRGGBB` で吹き出しの背景色を変更
  - 例：`吹き出し背景色：水色`、`吹き出し背景色：#ff8800`
  - リセット：`吹き出し背景色：なし` / `吹き出し背景色：リセット` / `吹き出し背景色：クリア`
- **CSS**：`.bubble` の `background` を `var(--bubble-bg, rgba(255,255,255,0.96))` に変更。`::after` 尻尾も同プロパティ参照で背景色に追従
- **セーブ対応**：`CHAR_SAVE_FIELDS` に `bubbleBgColor` を追加。`firstAppear` チェックにも含め、サーバー再起動後も復元される
- **バグ修正**：`吹き出し背景色：XX` に `色：` が含まれるため `色[：:]` の正規表現が先にマッチして文字色が変わっていた。`吹き出し背景色` の処理を `色：` より前に移動して解決
- **適用箇所**：`showBubble` / `showImageBubble` / `showEmotionBubble` で `--bubble-bg` CSS カスタムプロパティを設定 (`public/app.js`)

---

## v2.152.0 — 2026-05-28

### セーブ機能改修：フォント・吹き出し・文字色・装飾を正しく復元

- **バグ**：サーバー再起動後、ユーザーが初めてコメントした際に `randomizeCharAppearance` が呼ばれ、セーブ済みの `textColor`/`bubbleShape`/`bubbleDeco`/`font`/`charImage` が上書きされていた
- **原因**：`firstAppear` フラグが `CHAR_SAVE_FIELDS` に含まれておらず、常に `true` で初期化されるため
- **修正**：`getUser(ipid)` にてセーブデータ復元後、外見フィールド (`textColor`/`bubbleShape`/`bubbleDeco`/`font`/`charImage`) のいずれかが保存済みであれば `firstAppear = false` をセット (`public/app.js` 533行付近)

---

## v2.151.0 — 2026-05-28

### バトロワ勝者が下集合に並ばないバグ修正（第2弾）

- **原因**：`.avatar` に `transition: width 0.3s, height 0.3s` が設定されているため、`applyAvatarStyle` でサイズを3x→等倍に戻した直後に `gatherCharactersBottom` を呼ぶと、`offsetHeight` がまだ3x状態の値を返し、勝者の Y 座標が他キャラと異なる位置に計算されていた
- **修正**：`gatherCharactersBottom()` をトランジション完了後（400ms後）に遅延呼び出し

---

## v2.150.0 — 2026-05-28

### バトロワ勝者サイズ復元時の下集合が動作しないバグ修正

- `if (!winner.el) return` で勝者が退場済みの場合に `gatherCharactersBottom()` まで届かなかった
- 勝者処理（サイズ復元）と `gatherCharactersBottom()` を分離し、勝者の状態によらず必ず下集合が実行されるよう修正

---

## v2.149.0 — 2026-05-28

### タイマン敗者：1分間キャラ未変更でランダムキャラ自動実行

- `endTaiman` の敗者処理に60秒タイマーを追加
- 敗北時点の `charImage` を記録し、1分後も同じ画像のままなら `ランダムキャラ` を自動実行
- キャラを変更済みの場合・退場済みの場合はスキップ

---

## v2.148.0 — 2026-05-28

### バトロワ勝者サイズ復元時に下集合を実行

- `endBattleRoyale` の60秒タイマー（勝者の `brWinnerScale` 削除）に `gatherCharactersBottom()` を追加
- サイズが元に戻るタイミングで自動的に下集合が発動する

---

## v2.147.0 — 2026-05-28

### OBS Browser Source でのフリーフォント対応

- **原因**：フリーフォントが `%LOCALAPPDATA%\Microsoft\Windows\Fonts`（ユーザーインストール）にあり、OBS の Browser Source（CEF）からアクセスできなかった
- **修正**：
  - `server.js` に `/user-fonts` ルートを追加し、AppData フォントディレクトリを HTTP 配信
  - `public/index.html` に `@font-face` 宣言ブロックを追加（34フォント）
  - 対象：黒薔薇/おまつり/くるんデコ/鉄瓶ゴシック/みつばち/源界明朝 等 AppData 内全フォント
  - 日本語ファイル名フォント（しょかきうたげ・みつバッチ・数式フォント等）もURLエンコードで対応

---

## v2.146.0 — 2026-05-28

### index.html（コマンドリファレンス）同期更新

- `STANDALONE_CHARS` を `data/charImages.json` と完全同期（190→212エントリ）
- キャラ画像19ファイルを `public/chara/` から `chara/` へ補完コピー
  - `00223-2211292362.png` ～ `img_-0023-716318130.png` 等
- コマンド生成の吹き出しチップに新形状追加：星 / 六角 / 爆裂 / 楕円 / 横長
- コマンド生成の装飾チップに追加：炎 / 金 / 二重 / 点滅 / 緑光

---

## v2.145.0 — 2026-05-28

### フォントコマンド強化（インストール済みフォント全対応）

- `FONT_MAP` を大幅拡充（約30種追加、計80種以上）
  - 日本語ショートカット追加：`ゴシック` / `明朝` / `メイリオ` / `游ゴシック` / `游明朝` / `教科書体` / `ノトサンズ` / `ノトセリフ` / `デラゴシック`
  - フリーフォントのエイリアス追加：`おまつり` / `851POP` / `くるんデコ` / `かずき` / `鉄瓶ゴシック` / `ホラー明朝` / `みつばち` / `黒薔薇` / `源界明朝` / `蒼空明朝` / `またたき明朝` / `書楽宴` / `すし器` / `MOBO` / `コトノル` / `SmartFont` / `fontopoBOKU` / `ORIENTAL` / `NIKUKYU` など
  - スペースを含むフォント名の全エイリアスを整備（`黒薔薇ブラック` / `黒薔薇ヘビー` / `黒薔薇シン` など）
- `フォント：` コマンドの正規表現を更新（`/フォント[：:](?:"([^"]+)"|(\S+))/`）
  - `フォント："Yu Gothic Light"` のようにスペース含む名前を引用符で直接指定可能に
- `public/index.html` のフォントチップを一新（日本語ショートカット + フリーフォントを表示）
- `index.html`（コマンドリファレンス）のフォント一覧を全面更新・フリーフォントセクション追加

---

## v2.144.0 — 2026-05-28

### 色・吹き出し等のコマンドが初コメで効かないバグ修正

- 原因：`色:#XXXXXX` 等のコマンドだけ送った場合、`display` が空になり `ensureCharOnStage` が呼ばれないまま処理終了。次のコメントでキャラ登場時に `randomizeCharAppearance` が走り設定を上書きしていた
- 修正：コマンド処理セクションの先頭（`let display = message` 直後）に `ensureCharOnStage(user)` を追加。全コマンドより先にキャラ登場処理を完了させることで、後続コマンドの設定が確実に反映される
- `色:` / `吹き出し:` / `飾り:` / `フォント:` / `名前:` 等すべての設定コマンドに有効

---

## v2.143.0 — 2026-05-28

### 集合コマンドの右端スタックバグ修正

- `gatherCharacters()` の行配置を累積x+clampToStageから均等ステップ配置に変更
- `clampToStage` によるX座標クランプを廃止し、右端に重なるバグを修正

---

## v2.142.0 — 2026-05-27

### 集合コマンドの折り返し数を変更

- `gatherCharacters()` の `ROW_MAX` を 12 → 8 に変更

---

## v2.141.0 — 2026-05-27

### 下集合：キャラ大量時の右端スタックバグ修正

- `gatherCharactersBottom()` を1行固定・均等ステップ配置に書き直し
- 従来のX座標クランプ処理を廃止（これが「はみ出したキャラが全員同じ座標に重なる」原因だった）
- キャラが多い場合は均等ステップで重なるが、1箇所にスタックしなくなった
- 複数行折り返しは行わない

---

## v2.140.0 — 2026-05-27

### 下集合余白設定・装備アイコン位置変更

**下集合コマンドの余白設定**
- `gatherMarginLeft` / `gatherMarginRight` 変数を追加（デフォルト各50px）
- `gatherCharactersBottom()` を修正：有効幅 = `stageW - marginL - marginR` の範囲内に配置し、端への移動を防止
- 管理パネル「サイズ調整」セクションに「⬇ 下集合 左余白」「⬇ 下集合 右余白」スライダーを追加（0〜400px、5px刻み）
- `SETTINGS_KEYS` に `gatherMarginLeft` / `gatherMarginRight` を追加（サーバー設定に永続化）

**装備アイコン表示位置をキャラ上に変更**
- `updateEquipBadge()` を修正：`.char-equip-area` を `.avatar-wrap` の前に挿入することでキャラ画像の上に表示
- `.char-equip-area` CSSを `position:absolute`（左側縦並び）から フロー配置の横並び（`flex-direction:row`）に変更

---

## v2.139.0 — 2026-05-27

### 吹き出し形状・装飾・エフェクト・モーションを大幅追加

**吹き出し形状（`SHAPE_MAP`）**
- 追加: `星`→star-shape、`六角`→hex、`爆裂`→burst、`楕円`→oval、`横長`→wide
- CSS: `.bubble-star-shape`（星形clip-path）、`.bubble-hex`（六角形）、`.bubble-burst`（爆裂）、`.bubble-oval`（楕円）、`.bubble-wide`（横長角丸）

**吹き出し装飾（`DECO_MAP`）**
- 追加: `炎`→fire、`金`→gold、`二重`→double、`点滅`→blink、`緑`→glow-green
- CSS: `.bubble-deco-fire`（橙グロー）、`.bubble-deco-gold`（金縁）、`.bubble-deco-double`（二重アウトライン）、`.bubble-deco-blink`（点滅アニメ）、`.bubble-deco-glow-green`（緑グロー）

**エフェクト（`EFFECT_TYPES` + spawn関数）**
- 追加: `桜`→sakura（`spawnSakura`）、`雪`→snow（`spawnSnow`）、`爆発`→explosion（`spawnExplosion`）、`泡`→bubbles（`spawnBubbles`）、`稲妻`→lightning（`spawnLightning`）

**モーション（`MOTION_CLASSES` + CSS + コマンドハンドラ）**
- 追加: `浮く`→floating（ふわふわ上下）、`揺れる`→swaying（左右ゆらゆら）、`伸縮`/`縮む`→pulsing（伸縮）、`スキップ`→skipping（スキップ）、`酔う`→drunk（フラフラ）
- 全モーション10秒で自動停止（既存仕様を継承）

**index.html コマンドリファレンス更新**
- モーション・吹き出し・エフェクトセクションに新コマンドを追記

---

## v2.138.0 — 2026-05-27

### タイマンクールダウンを5分に変更
- `TAIMAN_COOLDOWN` を 2分 → 5分 に変更

---

## v2.137.0 — 2026-05-27

### キャラ生成後に自動で「下集合」
- `createCharacter` 末尾に `setTimeout(gatherCharactersBottom, 500)` を追加
- 新キャラ生成から0.5秒後に全キャラをステージ下端へ集合

---

## v2.136.0 — 2026-05-27

### タイマン敗北コマンドで正しいキャラ画像が表示されない追加修正
- キャラN コマンド（エイリアス・インライン）実行時に `user.charImage` をクリアするよう修正
- `ランダムキャラ` 後に残った `user.charImage` が敗北コマンドで上書きされず古い画像が残るバグを解消

---

## v2.135.0 — 2026-05-27

### ランダムキャラ・タイマン敗北コマンドのバグ修正
- 「ランダムキャラ」がグローバル `charImages` を書き換えていた問題を修正
  - `user.charImage` (ユーザー個別) に保存するよう変更
  - 同じ charDef.id を持つ他ユーザーの画像が変わるバグを解消
  - 敗北コマンド「キャラ73」が違う画像になるバグも同原因のため解消
- `charImage` を `CHAR_SAVE_FIELDS` に追加（サーバーセーブで永続化）
- `applyAvatarStyle`・`showStatusModal`・タイマンバナーで `user.charImage` を優先表示

---

## v2.134.0 — 2026-05-27

### レベルアップによるキャラサイズ増加を廃止
- `applyAvatarStyle` から `lvScale` を削除
- キャラサイズはレベルに依存せず、`charSizeScale` / `sizeScale` のみで決定

---

## v2.133.0 — 2026-05-27

### 一括割り当てを「未割当のみ」に変更
- 「🖼 未割当のみ一括割り当て」: 既存の割り当てを維持し、未割当の画像だけを次の空きIDへ追加
- 「🔄 全リセット&一括割り当て」: 従来通り全IDを上書き（確認ダイアログあり）
- 画像追加時に既存のキャラコマンド番号がズレなくなった

---

## v2.132.0 — 2026-05-27

### ボス表示位置をD&D後にセーブ
- ドラッグ終了時に `bossX` / `bossY` を localStorage に保存 → サーバーにも反映
- 起動時に localStorage から `bossLastPos` を復元し、次回ボス生成時に同じ位置に表示
- `SETTINGS_KEYS` に `bossX` / `bossY` を追加

---

## v2.131.0 — 2026-05-27

### キャラ生成位置を「下集合」エリアに統一
- `getUser` の初期 y 座標を `gatherCharactersBottom` と同じ底辺ロジックに変更
- 新規キャラはステージ下端（`stageH - charH - 10`）に生成されるようになった

---

## v2.130.0 — 2026-05-27

### タイマン時のキャラ倍率を管理パネルから設定可能に
- `taimanCharScale` 変数を追加（デフォルト4、localStorage/サーバー保存）
- 管理パネル「タイマン」セクションに「キャラ倍率」スライダー（1〜10x、0.5刻み）追加
- `startTaiman` の hardcoded `4` を `taimanCharScale` に置き換え
- `applyState` / `handleAdminMessage` / `getState` に対応追加

---

## v2.129.0 — 2026-05-27

### 「ごしありｗ」コマンド追加
- コメントに「ごしありｗ」が含まれると自キャラを削除（縮小アニメーション付き）
- `users[ipid]` と `_charSaveData[ipid]` をメモリから削除
- `DELETE /api/char-save/:ipid` でサーバーのセーブデータも削除
- BR中の場合はサバイバーからも除去して終了チェック

---

## v2.128.0 — 2026-05-27

### 「ランダムキャラ」コマンド追加
- コメントに「ランダムキャラ」が含まれると `availableImages` からランダムに画像を選択して自キャラに適用
- `charImages[charDef.id]` に保存し `saveCharImages()` でサーバーに永続化

---

## v2.127.0 — 2026-05-27

### 管理パネルにセーブ削除ボタン追加
- 「💾 セーブ管理」セクションを追加（タイマンセクションの直後）
- 「🗑 全キャラセーブ削除」ボタン: 確認ダイアログ後に `DELETE /api/char-save` → `data/charSave.json` を `{}` に初期化
- `server.js`: `DELETE /api/char-save`（全削除）・`DELETE /api/char-save/:ipid`（個別削除）エンドポイント追加
- `app.js`: `clearCharSave` メッセージ受信時に `_charSaveData` をクリア

---

## v2.126.0 — 2026-05-27

### 吹き出し・フォント・装飾をセーブ対象に追加
- `CHAR_SAVE_FIELDS` に `textColor`・`bubbleShape`・`bubbleDeco`・`font` を追加

---

## v2.125.0 — 2026-05-27

### キャラ自己設定名をセーブ対象に追加
- `CHAR_SAVE_FIELDS` に `name` と `nameManual` を追加
- `nameManual: true` のキャラはリロード後もコメントによる名前上書きをブロック（既存ロジックを活用）

---

## v2.124.0 — 2026-05-27

### サーバー側セーブ機能実装
- **`server.js`**: `makeDataEndpoints` ヘルパー追加。`/api/char-save`・`/api/settings`・`/api/char-aliases` エンドポイントを追加（`data/charSave.json` / `data/settings.json` / `data/charAliases.json` に保存）
- **キャラセーブ**: `_charSaveData` グローバル導入。`getUser()` でipid既存データを自動復元。60秒ごとに全キャラを `/api/char-save` へ保存
- **管理パネル設定**: `saveSettingsToServer()`（2秒デバウンス）追加。起動時にサーバー設定をlocalStorageへ先行反映。30秒ごと+主要スライダー変更時にサーバー保存
- **charImages/charAliases**: localStorageを廃止しサーバー専用に変更。`loadCharImages`/`loadCharAliases`/`saveCharImages`/`saveCharAliases` をサーバーAPIに統一
- **保存対象フィールド**: `level`,`exp`,`hp`,`maxHp`,`mp`,`equips`,`pet`,`pet2`,`titles`,`activeTitle`,`totalDmgDealt`,`deaths`,`wordleWins`,`hayaoshiWins`,`commentCount`,`tc`,`sizeScale`,`flipped`,`lastTaimanAt`,`charDef`

---

## v2.123.0 — 2026-05-27

### ボス画像サイズを固定化
- HP依存のサイズ計算（HP100→120px〜HP2000→420px）を廃止
- HP3000超のランダムサイズ（80〜320px）を廃止
- ベースサイズを200pxに固定（管理パネルのボスサイズスライダーは引き続き有効）

---

## v2.122.0 — 2026-05-27

### 10分無コメントによるキャラ非表示処理を撤廃
- `sleepChar` / `wakeUpChar` 関数を削除
- 60秒インターバルの非表示チェックを削除
- `user.dormant` / `user.lastCommentAt` フィールドを削除
- `ensureCharOnStage` / `handleComment` / タイマン傍観者フィルターの dormant 参照を除去

---

## v2.121.0 — 2026-05-27

### 競馬ベット画面の馬券説明文字サイズ変更
- `.race-hint` font-size `10px` → `13px`

---

## v2.120.0 — 2026-05-27

### ペットガチャ効果説明の文字サイズ変更
- `.pg-panel-desc` font-size `9px` → `11px`

---

## v2.119.0 — 2026-05-27

### ステータス確認画面: 暗幕撤廃・左上表示
- `.sm-overlay` の全画面暗幕 (`inset:0; background:rgba(0,0,0,0.65)`) を撤廃
- 左上固定表示に変更 (`position:fixed; top:10px; left:10px`)
- オーバーレイ外クリックによる閉じる処理を削除

---

## v2.118.0 — 2026-05-27

### ステータス確認画面コンパクト化・自動コメントにペット効果追加
- モーダル幅 `66vw/858px` → `56vw/720px`、最大高さ `85vh` → `82vh`
- ヘッダー padding `12px 18px` → `8px 14px`
- 本文 (sm-body) padding `18px` → `12px 14px`、gap `20px` → `14px`
- sm-left gap `8px` → `4px`、sm-right gap `4px` → `3px`
- sm-stat padding `3px 8px` → `2px 6px`、sm-stats gap `4px` → `3px`
- 装備セクション padding `0 18px 16px` → `0 14px 10px`、equip-row padding `6px 4px` → `4px 3px`
- ペットブロック gap `12px` → `8px`、padding `8px` → `6px`
- 称号パネル幅 `220px` → `190px`、padding `14px 10px` → `10px 8px`
- `postStatusComment`: ペットサマリーに `abilityDesc` を追加 (`abilityName(abilityDesc)` 形式)

---

## v2.117.0 — 2026-05-27

### ペットガチャ結果にペット効果説明を表示
- ガチャ結果パネルにペット名の下へ `abilityDesc` を表示する `pg-panel-desc` を追加 (`showPetGachaAnim`)
- `.pg-panel-desc` スタイル追加: 9px・グレー・最大幅110px・中央揃え (`style.css`)

---

## v2.116.0 — 2026-05-27

### キャラ水平反転時にペット画像も反転
- `isUserFlipped(user)` ヘルパーを追加（`_taimanFlip` または `facingRight XOR flipped` で反転判定）
- `applyFacingFlip`: キャラ `img` に加え `p-{ipid}` / `p2-{ipid}` のペット `img` にも同じ `scaleX(-1)` を適用
- `renderPetBadge`: `innerHTML` 生成時にインラインスタイルで `transform:scaleX(-1)` を付与することで再描画後も反転を維持

---

## v2.115.0 — 2026-05-27

### ペットガチャ時の吹き出し削除
- ガチャ結果の `showBubble` 呼び出しを削除（ガチャパネルで表示されるため不要）
- ログへの記録 (`addToLog`) は継続

---

## v2.114.0 — 2026-05-27

### タイマン: ペットダメージ位置修正・不死鳥/team_heal/omega対応
- ペット攻撃のダメージ数字を攻撃者ペットアイコン位置 → **被攻撃キャラの位置** (y-65px offset) に修正 (`taimanDoAttack`)
- `tryTaimanRevive` 関数を追加: 被攻撃者がrevive(不死鳥)ペットを持ちreviveUsedでない場合、HP50%で復活 + 演出表示
- reviveチェックをメイン攻撃KO判定・ペット攻撃KO判定の両方に追加
- ペット副効果 `team_heal` をタイマン対応: 攻撃者HP+50% of petDmg
- ペット副効果 `omega` をタイマン対応: 追加ダメージ + 攻撃者HP回復

---

## v2.113.0 — 2026-05-27

### ペットガチャをキャラ個別のインライン表示に変更・全画面廃止
- 全画面オーバーレイ (`#petGachaOverlay`) を廃止
- スロットと同様にキャラ要素の上にパネルを表示する `pet-gacha-panel` に変更 (`showPetGachaAnim`)
- ドラムロール中は72px画像をランダム切替、結果表示ではレア度カラーでボーダー変化
- 効果音・演出（花火・紙吹雪）は従来通り (`app.js`, `style.css`)

---

## v2.112.0 — 2026-05-27

### タイマン中の2キャラを画面中心に寄せて配置
- 左右キャラを画面中央から `gap=100px` ずつ対称配置に変更 (`startTaiman`)
- 以前: 左 8%・右 68% → 変更後: `sw/2 - charSize - 50` と `sw/2 + 50`

---

## v2.111.0 — 2026-05-27

### タイマン中のペット・キャラダメージ表示を分離
- キャラ攻撃ダメージ：防御側キャラの上に表示（従来通り）
- ペット攻撃ダメージ：攻撃側のペットアイコン位置に表示（`🐾X`、紫色）
- 両者が重ならず同時に視認できるようになった (`taimanDoAttack`)

---

## v2.110.0 — 2026-05-27

### タイマン中にペットがボス戦と同じ突進エフェクト・モーションで攻撃
- `rushPetToChar` 関数を追加（`rushPetToBoss` のタイマン版）(`app.js`)
- 攻撃ターンごとに pet/pet2 が対象キャラへ突進し `🐾{ダメージ}` 数字を表示
- `hp_steal`/`soul_steal`/`full_drain` の吸収、`regen` 回復の副効果も発動
- `cheer`/`chain`/`storm` など複数ヒット能力も対応
- ペット攻撃でHPが0になった場合も `endTaiman` を発動

---

## v2.109.0 — 2026-05-27

### タイマン中にペット能力を反映
- 攻撃側: `scout`(クリット+5%), `crit_up`(+20%), `hayaoshiBuff`(×1.5), 称号ダメージ倍率を適用 (`taimanDoAttack`)
- pet と pet2 の両方を確認
- 防御側: `guard`(-1ダメ), `barrier`(20%で-3ダメ) を適用 (`taimanDoAttack`)

---

## v2.108.0 — 2026-05-27

### タイマンコマンドにクールダウンを追加
- 1キャラごとに2分に1回のみ実行可能 (`handleComment`)
- クールダウン中は「あとX秒でタイマンできます」を吹き出し表示
- 実行時に `user.lastTaimanAt` を記録 (`handleComment`)

---

## v2.107.0 — 2026-05-27

### タイマン中のキャラサイズを5倍→4倍に変更
- `startTaiman` の `sizeScale` と `charSize` 計算を 5 → 4 に変更 (`app.js`)

---

## v2.106.0 — 2026-05-27

### タイマン敗北コマンドでのキャラ重複チェックを無効化
- 敗北コマンド経由の `handleComment` に `_skipCharDupeCheck: true` フラグを付与 (`endTaiman`)
- エイリアス・キャラNコマンドの重複チェックで同フラグを確認し、敗北コマンドの場合はスキップ (`handleComment`)

---

## v2.105.0 — 2026-05-27

### タイマンの攻撃間隔を徐々に短縮
- 攻撃ごとに間隔を40ms短縮、最小200msまで加速 (`taimanDoAttack`)

---

## v2.104.0 — 2026-05-27

### タイマン敗北コマンドを管理パネルで設定可能に
- 管理パネルに「⚔️ タイマン」セクションを追加、敗北コマンド入力欄を設置 (`admin.html`)
- タイマンで負けたキャラが設定されたコマンドを1.2秒後に自動発言 (`endTaiman`)
- `taimanDefeatCommand` 変数に保持し `localStorage` で永続化 (`app.js`)
- `handleAdminMessage` に `taimanDefeatCmd` メッセージタイプを追加 (`app.js`)
- 接続時に管理パネルの入力欄を現在の設定値で初期化 (`applyState` in `admin.html`)

---

## v2.103.0 — 2026-05-27

### タイマン中の観客キャラを画面端に移動
- タイマン開始時、戦闘員以外のキャラを左端・右端に寄せて配置 (`startTaiman`)
- 前半グループは左端から、後半グループは右端から並べる
- タイマン終了時は `gatherCharactersBottom` で通常配置に復帰 (`app.js`)

---

## v2.102.0 — 2026-05-27

### タイマン機能を追加
- コメント「タイマン：（名前）」でタイマン（1v1デュエル）を開始 (`app.js`)
- タイマン中のキャラは画像を5倍に拡大、他のキャラは半分に縮小 (`app.js`)
- 挑戦者は左（水平反転）、対象は右に配置 (`app.js`)
- タイマン中はHPを元の最大HPの10倍に設定 (`app.js`)
- 交互に攻撃し、先にHP0になった方が負け (`taimanDoAttack`)
- 敗者の全MPを勝者に譲渡 (`endTaiman`)
- 敗者のキャラ画像を`248106.png`に変更 (`endTaiman`)
- 開始時にドラマチックなイントロバナー・VS表示・ファンファーレ再生 (`showTaimanIntroBanner`)
- 画面下部に両者のHPバーをリアルタイム表示 (`renderTaimanHpBars`)
- 戦闘中はダメージトースト・ダメージ数字・効果音・震え演出 (`taimanDoAttack`)
- 終了時に花火・紙吹雪・勝利バナー・ハートシャワー (`showTaimanWinBanner`)
- `updateStatsDisplay` でタイマン中の仮想HP表示に対応 (`app.js`)
- `applyFacingFlip` に `_taimanFlip` フラグ対応を追加 (`app.js`)
- タイマン用スタイルを追加 (`style.css`)

---

## v2.101.0 — 2026-05-27

### キャラ画像割り当て画面の縦幅を70%に変更
- `.modal` の `max-height` を 85vh → 70vh に変更 (`style.css`)

---

## v2.100.0 — 2026-05-27

### ドラムロール音量を70%に変更
- ペットガチャのドラムロール再生音量を 80% → 70% に変更 (`app.js`)

---

## v2.99.0 — 2026-05-27

### 10分間コメントなしのキャラを自動非表示
- コメントのたびに `user.lastCommentAt` を更新
- 60秒ごとに全ユーザーをチェックし10分以上未コメントのキャラをフェードアウト→非表示
- 再コメント時にフェードイン→表示・移動再開 (`wakeUpChar`)
- `sleepChar` / `wakeUpChar` 関数を追加、`ensureCharOnStage` で休眠中キャラも復帰対応 (`app.js`)

---

## v2.98.0 — 2026-05-27

### クイズ答えを名詞に統一
- 文章・動詞句・Yes/No 形式だった答え27問を名詞・短語句に変更
- 主な変更: 先験的/後験的、無知の知、真空、水、潮汐力、波長、集合体、38万年、光、周回、脱出、粒子、中性子、半分、酸素×2、気体、反比例、比例、電流、平衡、水、青函トンネル、スウェーデン、促進、陽イオンと陰イオン など (`quiz.txt`)

---

## v2.97.0 — 2026-05-27

### 動画URLコメント処理を再修正
- `type: "comment"` のまま `url` フィールドに URL が入るケースに対応
- 誤って追加した早期 `return` を削除し通常コメント処理も実行されるように修正
- `comment.url` を `decodeURIComponent` してから検索（`v%3D` → `v=` の変換）(`app.js`)

---

## v2.96.0 — 2026-05-27

### 動画URLコメント対応を修正
- `comment.url` フィールドに URL がある場合を「動画コメント」として専用処理
- `type !== 'comment'` ガードより前で処理するため、動画コメントが弾かれなくなった
- YouTube ID を `comment.url` から直接抽出して MP+20 判定 (`app.js`)

---

## v2.95.0 — 2026-05-27

### クイズ正解でMP+20
- クイズ正解時に HP+20 に加えて MP+20 を付与
- 青い「MP+20」ダメージ数字を表示 (`app.js` `handleQuizAnswer`)

---

## v2.94.0 — 2026-05-27

### YouTube URL 検出を修正
- NicoNico が URL を `<a>` タグで送る場合に検出できなかった問題を修正
- HTML タグを除去してから判定するように変更
- 正規表現を `youtu.be/ID`・`?v=ID`・`&v=ID`・`shorts/ID`・`live/ID` に対応するよう単純化 (`app.js`)

---

## v2.93.0 — 2026-05-26

### 競馬中に紙吹雪を連続表示
- レース開始（GO!）から終了まで 0.5秒ごとに紙吹雪を生成し続ける
- `spawnConfettiSmall` 関数を追加（8色、横に流れる動き）
- `raceState._confettiTimerId` で管理、`finishRace`・`cancelRace` 時に停止 (`app.js`)

---

## v2.92.0 — 2026-05-26

### 競馬効果音追加
- ベット受付開始時：ファンファーレをループ再生（ベット終了・キャンセル時に停止）
- カウントダウン 3・2・1 各秒に決定音を再生
- GO! 表示と同時にゲートオープン音を再生
- レース中、馬ごとに1.5〜4秒間隔でランダムに馬が走る音（2種類）を再生
- 1位ゴール時に「おめでとう」音（旧 AudioContext 発振器を置き換え）
- 結果発表時に歓声音を再生
- `SOUND_RACE_*` 定数、`startRaceFanfare`/`stopRaceFanfare` を追加 (`app.js`)

---

## v2.91.0 — 2026-05-26

### YouTube URL 共有でMP回復
- コメントに YouTube URL（youtu.be / youtube.com/watch・shorts・live）が含まれると MP+20
- 同じ動画ID（11桁）は重複カウントしない → 「もうみた」と自動コメント返信
- `seenYoutubeUrls` Set でセッション内の既視URL管理 (`app.js`)

---

## v2.90.0 — 2026-05-26

### レース中：番号バッジ・応援機能追加
- レース走行中の各キャラ画像の上に番号バッジ（オレンジ）を表示（馬券の番号と一致）
- レース中にコメントに番号が含まれると対応する馬が「うおおお！」と吹き出し表示
- 応援時に黄色い光エフェクト（`raceCheerFlash`）を馬キャラに表示
- 応援バブルはオレンジグラデーションで通常バブルと区別
- `showRaceHorseBubble` を `text` / `extraCls` 引数対応に拡張
- `triggerRaceCheer` 関数を追加 (`app.js`)
- `.race-horse-no`, `.race-cheer-bubble`, `.race-cheer-flash` を追加 (`style.css`)

---

## v2.89.0 — 2026-05-26

### スロット消費MP変更
- スロット1回の消費MP: 1 → 3
- スロット開始（自動）・スロット（1回）・自動連続時の全箇所を更新
- 不足時のエラーメッセージ表示値も合わせて更新 (`app.js`)

---

## v2.88.0 — 2026-05-26

### キャラ初期MP・ペットガチャコスト変更
- キャラ生成時の初期MP: 30 → 50 (`app.js` 375行)
- ペットガチャ消費MP: 10 → 20 (`app.js` 2430行)
- 不足時のエラーメッセージ表示値も合わせて更新

---

## v2.87.0 — 2026-05-26

### レース結果画面を2カラム表示に刷新
- 左: 着順（馬名・メダル）
- 右: 当選者一覧（名前・獲得MP・収支）、獲得MP降順ソート
- 当選者なしの場合はジャックポット繰越メッセージを右カラムに表示
- `app.js` `style.css` を変更

---

## v2.86.0 — 2026-05-26

### 馬券複数購入対応 + ベット一覧表示
- 1人何枚でも馬券を購入可能に（「すでに賭け済み」チェックを廃止）
- `raceState.bets` をオブジェクト→配列に変更
- ベット受付画面に購入一覧（最新12件、新しい順）を表示
- `calcRacePayoutPure` / `cancelRace` を配列対応に更新
- `app.js` `style.css` を変更

---

## v2.85.0 — 2026-05-26

### 馬券ベット修正 + レース中キャラ反転
- 馬券入力の全角数字・全角ダッシュ（－−‐）・全角スペースを半角に正規化してから判定（馬単・3連単が通らなかった原因）
- レース中のキャラ画像を全員 `scaleX(-1)` で水平反転（右向き走行に統一）
- `app.js` を変更

---

## v2.84.0 — 2026-05-26

### 馬券ベット受付修正
- `rawMessage` → `message.trim()`（プレフィックス除去済み）に変更
- 正規表現の空白を `[\s　]+`（全角スペース対応）に変更
- 「馬券」で始まるがフォーマット不一致の場合はシステムログに理由を表示
- `app.js` を変更

---

## v2.83.0 — 2026-05-26

### 歩き方向フリップ再修正
- `applyAvatarStyle` が `a.style.transform = ''` でリセットしてフリップが消える問題を修正
- `user.facingRight` に向きを保持し、`applyFacingFlip()` で img に `scaleX(-1)` を適用
- `applyAvatarStyle` 内でも `applyFacingFlip` を呼び出すことで再描画後も向きを維持
- `反転` コマンドも `user.flipped` XOR `user.facingRight` で正しく合成
- `app.js` を変更

---

## v2.82.0 — 2026-05-26

### 歩き方向フリップ修正
- キャラ画像は左向き基準のため、右移動時のみ `scaleX(-1)` で反転するよう修正
- `scheduleWalk`: `dir < 0` → `dir > 0` に判定反転
- `scheduleMove`: 移動コマンド時も oldX と新 X を比較して方向フリップを適用（未実装だった）
- `app.js` を変更

---

## v2.81.0 — 2026-05-26

### ボス画像を水平反転表示
- `.boss-avatar img` に `transform: scaleX(-1)` を追加
- `style.css` を変更

---

## v2.80.0 — 2026-05-26

### 🏇 レース中パネル横幅を60%に変更
- `style.css` を変更

---

## v2.79.0 — 2026-05-26

### 🏇 レース中パネル横幅を85%→70%に変更
- `style.css` を変更

---

## v2.78.0 — 2026-05-26

### 🏇 レース中パネル横幅を画面85%に拡大
- `.race-panel.is-racing` の幅を `800px` → `85vw` に変更
- `style.css` を変更

---

## v2.77.0 — 2026-05-26

### 🏇 レース画面のキャラ大型化・縦幅拡張
- キャラ画像 72px → 100px に拡大
- トラック縦幅: margin 38→60px、馬間隔 34→58px（最大480px）
- ランクバッジ位置を上方に調整（-26px → -32px）
- `app.js` `style.css` を変更

---

## v2.76.0 — 2026-05-26

### 🏇 レース画面を全馬同一トラック表示に刷新
- レーン廃止 → 全馬が1つのトラック上に重なって走る表現に変更
- キャラ画像を 38px → 72px に大型化
- 先頭馬が手前に表示されるよう x 位置をもとに z-index をフレームごとに更新（追い越し演出）
- Y 位置は `laneIdx` をもとにトラック高さに均等配置し、馬同士が重なる
- `trackW` 計測を `.race-lane-track` → `.race-track-inner` に変更
- `.race-track-flat` CSS クラス追加、旧レーンスタイルから独立
- `app.js` `style.css` を変更

---

## v2.75.0 — 2026-05-26

### 🏇 レース中キャラ吹き出し追加
- レース中、各馬がランダムなセリフを3〜8秒間隔で喋る
- 「ふんっ！」「まだまだ！」「ちきしょう！」など30種のフレーズをランダム表示
- 吹き出しはキャラ画像の真上に表示し、2.4秒でフェードアウト
- `showRaceHorseBubble()` 関数、`RACE_BUBBLE_PHRASES` 定数を追加
- `app.js` `style.css` を変更

---

## v2.74.0 — 2026-05-26

### 🏇 レース展開のドラマ強化
- **ランダム着差**: レースごとに `gapFactor`（0.5〜3.0）をランダム決定。接戦〜大差が毎回変わる
- **ペーススタイル**: 各馬に「逃げ🔴 / 差し🟡 / 追い込み🔵」をランダム付与
  - 逃げ: 序盤ハイペース→後半失速。先頭を走る壮快感
  - 追い込み: 序盤は最後方→後半爆発的加速。劇的な追い上げ演出
  - どのスタイルでも最終着順は重み付きシャッフルが決定
- **予告ログ**: gapFactor 2.2以上=「大差レースの予感…！」、0.85以下=「超接戦になりそう…！」
- ベット受付画面にペーススタイルバッジ表示
- タイムアウト上限を `RACE_TOTAL_SEC*2+5` に延長（大差レース対応）
- `app.js` `style.css` を変更

---

## v2.73.0 — 2026-05-26

### 🏇 馬の後退バグ修正
- `getHorseX` の drama 揺らぎが `Math.sin` のマイナス値で後退していた問題を修正
- `sin * 0.5 + 0.5` で `[0,1]` にマッピングし常に前進のみに変更
- `app.js` を変更

---

## v2.72.0 — 2026-05-26

### 🏇 走りアニメーション修正
- `raceHop` から後傾 `rotate(-4deg)` と横縮み `scaleX(0.95)` を除去
- 前傾のみ（0〜8deg）・`scaleY` のみ使用し、左に戻るように見えるモーションを解消
- `style.css` を変更

---

## v2.71.0 — 2026-05-26

### 🏇 レース時間を倍に延長
- `RACE_TOTAL_SEC` を 10 → 20 に変更（1位ゴール: 8.2s → 16.4s）
- `app.js` を変更

---

## v2.70.0 — 2026-05-26

### 🏇 競馬ゴール位置ズレ修正
- パネル幅拡大のCSSトランジション（0.3s）完了前に `trackW` を計測していたためゴール位置がズレる問題を修正
- `trackW` の計測タイミングをカウントダウン終了後（GO!表示後650ms）に移動
- `app.js` を変更

---

## v2.69.0 — 2026-05-26

### 🏇 競馬レース画面の横幅拡大
- レース中フェーズのみパネル幅を 800px に拡大（ベット/結果フェーズは 540px のまま）
- `.race-panel.is-racing` クラスで切り替え、0.3s トランジション付き
- `app.js` `style.css` を変更

---

## v2.68.0 — 2026-05-26

### 🏇 競馬リッチ化
- **馬の調子システム追加**: 絶好調🔥/好調✨/普通😐/やや不調😓/不調💤 を各馬にランダム付与
  - ベット受付画面に調子バッジ表示
  - 調子が良いほど1位になる確率が高い重み付きランダム着順決定（ランダム性は維持）
- **奥行きレーン**: 上レーン（遠）→小さく、下レーン（近）→大きい遠近感表現
  - レーン高さ・馬サイズ・馬番フォント・跳ねアニメ速度がすべて奥行きに連動
- **カウントダウン演出**: レース開始前に 3→2→1→GO! オーバーレイ表示
- **スクロールグラウンド**: レーン背景が横方向にスクロールして走感を演出（CSS animation）
- **ホコリエフェクト**: 各馬の後方に砂塵が流れる `::after` エフェクト
- **ホップアニメ改善**: 走り跳ねに回転・スケールを追加してよりリズミカルに
- `app.js` `style.css` を変更

---

## v2.67.0 — 2026-05-26

### 🏇 競馬ゲーム追加
- ステージ上のキャラからランダムに馬を選出してレース
- ベット受付フェーズ（N秒）→ キャラがレーンを走るアニメーション → 配当発表
- 賭け方: 単勝「馬券 2 10」/ 馬単「馬券 1-2 10」/ 3連単「馬券 2-1-3 10」
- 重み付きパリミュチュエル配当（単勝×1 / 馬単×3 / 3連単×10）
- 当選者なしの場合はジャックポット繰越（localStorage保存）
- 実際の着順とアニメーションの着順が一致（finalRank 基準のベジェ補間 + ドラマ揺らぎ）
- 管理パネル「🏇 競馬」セクション追加（馬数・受付秒・スタート/開始/キャンセル）
- ドラッグで移動可能なパネル UI
- `app.js` / `style.css` / `admin.html` を変更

---

## v2.66.0 — 2026-05-26

### 🔤 文字サイズを管理パネルから変更可能に
- 名前・ステータス・LV・称号・吹き出しの5項目を個別に px 指定で変更可能
- CSS変数（`--fs-char-name` 等）を導入し `style.css` の該当クラスに適用
- `charFontSizes` グローバル変数・`localStorage` で永続化（`app.js`）
- `handleAdminMessage` に `charFontSizes` ハンドラーを追加
- 管理パネル「🔤 文字サイズ」セクション追加・リセットボタンつき（`admin.html`）

---

## v2.65.0 — 2026-05-26

### ⭐ 称号解放ポップアップをキャラ下側に表示
- `showTitleUnlock` の表示位置をキャラ中央上部 → 下端 +4px に変更（`app.js`）
- フェードアウト時の移動方向も上向き → 下向きに変更

---

## v2.64.0 — 2026-05-25

### 💬 不在確認ワード追加
- `いにゃい` を `_absentWords` に追加（`app.js`）

---

## v2.63.0 — 2026-05-25

### 📝 もじあて表示行数を管理パネルから変更可能に
- 管理パネルの「ゲーム操作」セクションに行数入力欄と「適用」ボタンを追加（1〜50行）
- `wordleDisplayRows` グローバル変数・`localStorage` で保持
- `handleAdminMessage` に `wordleRows` ハンドラーを追加（`app.js`）

---

## v2.62.0 — 2026-05-25

### 💬 不在確認ワード追加
- `ホウチ` を `_absentWords` に追加（`app.js`）

---

## v2.61.0 — 2026-05-25

### 💬 不在確認ワード追加
- `ねてる` を `_absentWords` に追加（`app.js`）

---

## v2.60.0 — 2026-05-25

### 💬 不在確認ワード追加
- `いる？` / `iru?` を `_absentWords` に追加（`app.js`）

---

## v2.59.0 — 2026-05-25

### 💬 不在確認ワード追加
- `ほうち` / `houti` / `houchi` / `abandoned` を `_absentWords` に追加（`app.js`）

---

## v2.58.0 — 2026-05-25

### 🗨️ 吹き出しをスロットパネルより前面に表示
- `.bubble` の `z-index` を 20 → 65 に変更（`.slot-panel` の z-index 60 より上）
- `style.css`

---

## v2.57.0 — 2026-05-25

### 💬 不在確認ワード自動返答を拡張
- トリガーワードを追加: `mumyou` / `無明` / `いない` / `寝た？` / `ねた？`
- 「これ放置」含む全6ワードをまとめて `_absentWords` 配列で管理（`app.js`）

---

## v2.56.0 — 2026-05-25

### 💬 「これ放置」自動返答
- コメントに「これ放置」が含まれると自動で「いますよ」とコメント投稿
- `_aiPostedTexts` によるループ防止チェックを適用

---

## v2.55.0 — 2026-05-25

### 📄 index.html / public/help.html を最新化
- **STANDALONE_CHARS** を `data/charImages.json` と完全同期（91→98キャラ、追加分反映）
- **MP記述更新**: 「基本10、最大20」→「初期30。出してで20・ペットガチャで10・回復で2消費」
- **AI画像生成（出してコマンド）** 機能解説カード追加（MP20消費、Discord自動送信）
- **出してコマンド** をその他設定セクションに追加（MP20消費）
- **反転コマンド** をその他設定セクションに追加（左右反転トグル）
- スクリプトのキャラパスを `./chara/` → `/chara/` に統一（help.htmlと一致）
- `renderCharChips` / `renderCharGrid`: localStorage空時に STANDALONE_CHARS へフォールバック（簡略化）

---

## v2.54.0 — 2026-05-25

### 📦 コンパクトモード時にMPランキングを自動非表示
- `setCompactMode(on)`: MPランキングパネル（`#mpRankingPanel`）をON時に非表示、OFF時に復元
- 次のBRタイマー（`#brTimerPanel`）は既存コードで対応済み（変更なし）

---

## v2.53.0 — 2026-05-25

### 💰 管理パネルから個別MP付与機能を追加
- 管理パネルに「💰 MP付与」セクションを追加（キャラ個別サイズの下）
- キャラ選択ドロップダウン（`giveMpUserSelect`）＋付与量入力（`giveMpAmount`）＋「付与」ボタン
- `giveMp` メッセージで `handleAdminMessage` が対象ユーザーの `u.mp` を加算
- 付与後にキャラの吹き出しで「MP +N！（現在 N MP）」を表示

---

## v2.52.0 — 2026-05-24

### 🐛 反転コマンドの動作修正
- CSSアニメーション（breathe/bouncing/spinning）が `.avatar` の `transform` を上書きしていた問題を修正
- `applyAvatarStyle`: `.avatar` div への `transform` 適用をやめ、内部 `<img>` 要素の `style` 属性に `scaleX(-1)` を適用するよう変更

---

## v2.51.0 — 2026-05-24

### 🔄 反転コマンドを追加
- コメントに「反転」が含まれるとキャラ画像を左右反転（トグル）
- `user.flipped` フラグを追加、`applyAvatarStyle` で `transform: scaleX(-1)` を適用
- 他コマンドと併用可能なインラインコマンドとして実装

---

## v2.50.0 — 2026-05-24

### 📊 ステータスモーダルに icon_name を表示
- `handleComment`: `comment.icon_name` を匿名・非匿名問わず `user.iconName` に常時保存
- `showStatusModal`: キャラ名の下に `user.iconName` をグレーで表示（`.sm-icon-name`）

---

## v2.49.0 — 2026-05-24

### 🔍 管理パネルからキャラ個別サイズ変更機能を追加
- `user.sizeScale` (デフォルト1.0) を追加。`applyAvatarStyle` / `renderPetBadge` の計算に組み込み
- `handleAdminMessage` に `charIndivSize` ハンドラーを追加（`users[ipid].sizeScale` を更新し即時反映）
- `getUsers` 返却データに `sizeScale` を追加
- `admin.html` に「🔍 キャラ個別サイズ」セクションを追加
  - ユーザー選択ドロップダウン（↺ で更新、選択時に現在の倍率をスライダーに反映）
  - サイズスライダー（20%〜300%、step 5%）リアルタイム送信
  - ↺ でリセット（100%）

---

## v2.48.0 — 2026-05-24

### 🎰 スロット役ごとのMP獲得量を管理パネルから設定可能に
- `SLOT_OUTCOMES` の MP 値を起動時に `localStorage` から読み込むよう変更（デフォルト: チェリー5/ベル10/スター25/ダイヤ60/JACKPOT200）
- `handleAdminMessage` に `slotMp` ハンドラーを追加
- `getState` に各スロット MP 値を追加（再接続時に復元）
- `admin.html` スロット確率セクションの各役行に MP 入力欄（数値入力）を追加

---

## v2.47.0 — 2026-05-24

### 💧 出してコマンドのMP消費を20に変更
- SD画像生成コマンドのMP消費: 10 → 20

---

## v2.46.0 — 2026-05-24

### 💬 出してコマンドMP不足時にコメント通知を追加
- MP不足で生成できなかった場合、`postAIReply` で「キャラ名 MPが足りません（現在MP/10）」をコメント投稿

---

## v2.45.0 — 2026-05-24

### 🔤 吹き出しの `&gt;` などHTMLエンティティが文字コードのまま表示される問題を修正
- `decodeHtml()` 関数を追加（`textarea.innerHTML` を利用したブラウザ標準デコード）
- `handleComment` でメッセージを受け取った直後に `decodeHtml()` を適用
- 原因: `live.erinn.biz` API が `>` → `&gt;` などHTMLエンコードして返すが、`typewriter` が `textContent` で描画するためデコードされなかった

---

## v2.44.0 — 2026-05-24

### 🤖 5分モード開始時に起動メッセージを自動投稿
- `setFiveMinMode(true)` 時に `postAIReply('配信者不在のためCLAIRを起動します')` を呼び出し

---

## v2.43.0 — 2026-05-24

### 🤖 5分モードAIの会話セッション継続に対応
- `server.js /api/ai-reply`: `messages` 配列が送られた場合は Ollama `/api/chat` を使用（会話履歴対応）。`prompt` のみの場合は従来の `/api/generate` にフォールバック（後方互換）
- `app.js`: `_aiConvHistory` 配列を追加。5分モード開始時にリセット
- `_doAskAI`: `messages: [..._aiConvHistory, {role:'user', content:'名前: コメント'}]` を送信し、返答後に履歴へ追加
- 履歴は最大20往復（40件）まで保持し古いものから削除してトークンオーバーフローを防止

---

## v2.42.0 — 2026-05-23

### ✕ MPランキング・ダメージランキングに閉じるボタンを追加
- 各パネルのヘッダー右端に ✕ ボタンを追加
- クリックで `rankingState`/`mpRankingState` を null にしてパネルを削除（インターバルによる再表示も停止）

---

## v2.41.0 — 2026-05-23

### 💧 出してコマンドのMP消費を10に変更
- SD画像生成コマンドのMP消費: 3 → 10

---

## v2.40.0 — 2026-05-23

### 💧 キャラ生成時の初期MPを30に変更
- ユーザー初期化時の `mp: 10` → `mp: 30`

---

## v2.39.0 — 2026-05-23

### 💧 出してコマンドにMP消費を追加
- SD画像生成コマンド（出ろ/出して/生成/gen）: 実行時にMP3消費
- MP < 3 の場合は吹き出しに「MPが足りなくて画像生成できません」を表示して処理中断

---

## v2.38.0 — 2026-05-23

### 💬 Discord送信メッセージにキャラ名を追加
- `generateSDImage`: リクエスト body に `charName: user.name` を追加
- `server.js /api/sd-generate`: `charName` を受け取り `sendToDiscord` に渡す
- `sendToDiscord`: 第4引数に `charName` を追加。メッセージ形式を変更:
  - キャラ名あり: `🎨 キャラ名\n**プロンプト** → 翻訳`
  - キャラ名なし: `🎨 **プロンプト**`（従来通り）

---

## v2.37.0 — 2026-05-23

### 💬 SD生成画像をDiscordに自動送信する機能を追加
- `server.js`: Discord Webhook 設定を `data/discord.json` に保存
- `server.js`: `sendToDiscord(imageDataUrl, prompt, translatedPrompt)` 関数を追加（Node.js 標準 `https` モジュールのみ使用、依存追加なし）
  - `multipart/form-data` でファイル添付として送信
  - 翻訳された場合は `🎨 **元プロンプト** → 翻訳後` 形式でメッセージ付き
  - `username: 'kukuCome SD'` でボット名表示
- `GET /api/discord-config`、`POST /api/discord-config` エンドポイントを追加
- `/api/sd-generate`: 画像生成完了後に `sendToDiscord` をバックグラウンド呼び出し（レスポンスはブロックしない）
- `admin.html`: 「💬 Discord 連携」セクションを追加（Webhook URL 入力 → 即時保存）、ページロード時に設定を復元

---

## v2.36.0 — 2026-05-23

### 🔄 ダメージランキング・MPランキングのリアルタイム更新
- `renderRankingPanel()`: `rankingState.entries`（スナップショット）を廃止し、毎回 `rankingState.dmgMap` からソートして描画
- `renderMpRankingPanel()`: `mpRankingState.entries` を廃止し、毎回 `users` から再集計・ソートして描画
- `setInterval` (1秒) を追加: `rankingState`/`mpRankingState` が存在する間、両パネルを毎秒再描画

---

## v2.35.0 — 2026-05-23

### 🎭 ランダムキャラ除外設定を追加
- `charExcludeIds` (Set) 変数を追加。`localStorage.charExcludeIds`（カンマ区切り）から起動時にロード
- `ensureCharOnStage()`: ランダム選択プールから `charExcludeIds` に含まれるキャラを除外
- `handleAdminMessage` に `charExclude` ハンドラー追加（`charExcludeIds` を更新 + localStorage 保存）
- `getState` に `charExcludeIds` を追加（管理パネル再接続時に復元）
- `admin.html` に「🎭 キャラ設定」セクションを追加: ランダム除外キャラ番号をカンマ区切りで入力

---

## v2.34.0 — 2026-05-23

### 💎 所持MPランキング実装（ダメージランキングと同時表示対応）
- `showMpRanking()` 追加: ステージ上全ユーザーを `user.mp` 降順ソートし上位5名を表示
- `renderMpRankingPanel()` 追加: `#mpRankingPanel` を独立した DOM 要素として生成（ダメージランキングと別パネル）
- `mpRankingState` / `mpRankingDragState` を独立した変数として追加
- `mousemove` / `mouseup` ハンドラーに `mpRankingDragState` のドラッグ処理を追加
- パネル位置を `mpRankingPanelX` / `mpRankingPanelY` として localStorage に保存
- `handleAdminMessage` に `showMpRanking` ハンドラー追加
- `admin.html` ゲーム操作セクションに「💎 MPランキング」ボタンを追加
- `style.css` に `#mpRankingPanel`（シアン枠）・`.ranking-header-mp`・`.ranking-mp` を追加

---

## v2.33.0 — 2026-05-23

### 🔍 モザイクキーワード検知を大文字・小文字区別なしに変更
- `_sdNeedsMosaic`: prompt / translatedPrompt / キーワードをすべて `toLowerCase()` で比較

---

## v2.32.0 — 2026-05-23

### 💾 管理パネルの設定を localStorage に直接保存するよう修正
- `admin.html` の `sendSDText` / `sendTTSText` / `sendAIText` / `sendVolumeText` に `localStorage.setItem(key, value)` を追加
- 変更前: adminSend 経由で main ページが受信した時だけ保存 → 接続が切れていると消失
- 変更後: admin.html が変更と同時に直接 localStorage に書き込む（main ページへの送信と並行）

---

## v2.31.0 — 2026-05-23

### 💾 管理パネルの設定保存を修正
- **根本原因①**: `sdMosaicBlockSlider` が `public/index.html` になく、sdText ハンドラーの `if (el)` が通らないため `localStorage.setItem` が呼ばれていなかった
  - `index.html` にモザイクの粗さスライダー（`sdMosaicBlockSlider` / `sdMosaicBlockVal`）を追加
- **根本原因②**: sdText ハンドラーが localStorage のみ更新し JS 変数を更新しないため、管理パネル再接続時に `state.sdXxx` が古い値を返していた
  - sdText ハンドラーで `localStorage.setItem` を `if (el)` の外に移動（要素の有無に依存せず必ず保存）
  - `sdWidth` / `sdHeight` / `sdSteps` / `sdPositiveSuffix` / `sdNegative` / `sdDisplayTime` / `sdMosaicKeywords` / `sdMosaicBlock` の JS 変数もハンドラー内で更新するよう修正
- `admin.html`: `sdFields` / `sdElMap` に `sdMosaicBlock` を追加、state 復元時に `sdMosaicBlockVal` テキストも更新

---

## v2.30.0 — 2026-05-23

### 🐱 キャラN コマンドを他コマンドと併用可能に変更
- `app.js`: キャラN をインラインコマンドとして処理するよう変更
  - 旧: `/^キャラ(\d{1,3})$/`（メッセージ全体一致・単独のみ）→ 即 return
  - 新: `/キャラ(\d{1,3})/`（部分一致・インライン）→ 他コマンドと同時処理可
  - キャラN 部分は display から除去されるため吹き出しには表示されない
- エイリアス（カスタム名 → キャラN 変換）は引き続き単独コマンドのみ対応
- 例: `キャラ3 名前:hico 吹き出し:丸 色:青` を1コメントで一括設定可能

---

## v2.29.0 — 2026-05-23

### 🟫 モザイクの粗さ調整スライダーを管理パネルに追加
- `admin.html`: モザイクキーワード入力欄の直下に「モザイクの粗さ」スライダー追加
  - ID: `sdMosaicBlockSlider`、範囲: 5〜80px、ステップ: 5、デフォルト: 20px
- `app.js`:
  - `_applyMosaic(imgEl, blockSize)` — blockSize パラメータ化（旧ハードコード `20` → 可変）
  - `_sdReadSettings()` に `mosaicBlock` フィールド追加
  - `showSDImage()` の `_applyMosaic` 呼び出しに `cfg.mosaicBlock` を渡すよう変更
  - 初期化・localStorage 保存・state sync・sdText elMap に `sdMosaicBlock` を追加

---

## v2.28.0 — 2026-05-23

### 🐱 index.html スタンドアロン版キャラN番号をサーバーと完全一致に修正
- `STANDALONE_CHARS` を順序依存の配列 → `{キャラN: ファイル名}` オブジェクトに変更
- `data/charImages.json` の実データと照合し、キャラ1〜91の正確なマッピングに修正
  - 旧配列はキャラ31以降がずれていた（BCO/ChatGPT Image/KH.png/age.pngの欠落が原因）
- `renderCharGrid` / `renderCharChips` のフォールバック処理を `Object.keys()` + ソートに更新
- スタンドアロン時のキャラN指定コマンドがサーバーと完全一致するよう修正

---

## v2.27.0 — 2026-05-23

### 🐱 コマンド生成キャラチップのラベルを `キャラN` 形式に統一
- `public/help.html` / `index.html` の `renderCharChips`（localStorage あり分岐）を修正
- エイリアス設定済みキャラの表示が `エイリアス名(N)` → `キャラN` に統一

---

## v2.26.0 — 2026-05-23

### 📄 index.html（スタンドアロン）キャラ表示をキャラN形式に統一
- `STANDALONE_CHARS` 定数をスクリプト先頭に定義（allFiles の重複を解消）
- キャラ一覧（`renderCharGrid` フォールバック）：ファイル名ラベル → `キャラ1`〜`キャラ82` 形式に変更
- コマンド生成キャラセレクター（`renderCharChips` フォールバック）：番号入力欄 → 画像サムネイルチップ（`キャラ1`〜`キャラ82`）に変更
- サーバーなしでも `http://localhost:3000/help.html` と同様の見た目でキャラを選択・コマンド生成可能

---

## v2.25.0 — 2026-05-23

### 📄 index.html（スタンドアロン）にキャラ選択機能を反映
- `public/help.html` の CmdGen キャラセレクター変更を `index.html` に反映
- CSS: `.cmdgen-chara-img`（28×28px サムネイル）・`.cmdgen-chara-num`（番号入力スタイル）追加
- HTML: コマンド生成セクションに「🐱 キャラ」行を追加（`#cgCharChips`）
- `CmdGen` JS 更新：`chara` state 追加・`build()` に `キャラN` 先頭出力・`setChara()` 追加
- `renderCharChips()` スタンドアロン対応：
  - localStorage にキャラ割り当てがある → 画像サムネイルチップ表示（`./chara/` パス）
  - データなし → 番号入力フィールド（1〜500）に切り替え、入力値を `キャラN` 形式で出力

---

## v2.24.0 — 2026-05-23

### 🐱 コマンド生成にキャラ選択機能を追加（public/help.html）
- `CmdGen` の `state` に `chara` フィールドを追加
- `build()` でキャラが選択されている場合、先頭に `キャラN` を出力
- `renderCharChips()` 関数を追加：`localStorage.charImages` からキャラ画像サムネイルをチップとして生成
  - エイリアスが設定されているキャラは `エイリアス名(N)` 形式で表示
  - 画像が未割り当ての場合は「サーバー起動後に表示されます」メッセージを表示
- コマンド生成セクションに「🐱 キャラ」行を追加（名前入力欄の上）
- CSS: `.cmdgen-chara-img`（28×28px サムネイル）を追加

---

## v2.23.0 — 2026-05-23

### 🖼 index.html キャラ画像をスタンドアロンで表示できるよう修正
- `renderCharGrid` 関数にフォールバック処理を追加
- `localStorage` にキャラ割り当てデータがある場合 → 従来どおりキャラ番号付きで表示
- データがない場合（`file://` 直接起動など） → `chara/` フォルダの全82画像をハードコードリストから表示
- 読み込み失敗画像は `onerror` で自動非表示（カード自体を削除）

---

## v2.22.0 — 2026-05-23

### 📄 ルート index.html をスタンドアロン版ヘルプページに更新
- `public/help.html` の内容を完全コピーして `index.html`（ルート）に反映
- サーバー（localhost:3000）が起動していなくてもダブルクリックで開ける完全スタンドアロン HTML
- 変更点：
  - `href="/"` のバックリンクを「📄 スタンドアロン版」表示に変更（サーバー依存のリンクを除去）
  - キャラ画像パスを `/chara/` → `./public/chara/` に変更（ファイル直接開き時に相対パスで参照）
- CSS・JS・サイドバー・コマンド生成機能はすべてインライン完結でサーバー不要

---

## v2.21.0 — 2026-05-23

### 🔧 コマンド生成機能を追加（help.html / index.html）

#### public/help.html
- 「コマンド生成」セクションをサイドバーの先頭・ページ最上部に新設（`id="sec-cmdgen"`）
- 名前入力・吹き出し7種・装飾4種・文字色12種・フォント11種をクリックで選択
- 選択内容を組み合わせたコマンド文字列をリアルタイム生成、クリックでクリップボードにコピー
- コピー完了時に枠が緑色になり「✅ コピーしました！」メッセージを表示
- `CmdGen` IIFE モジュールとして `build / selectChip / copy / reset` を実装

#### public/index.html
- `#emptyHint` に「🔧 コマンド生成」タブを先頭（Tab 0）として追加
- 既存タブのインデックスを 1〜5 にシフト
- help.html と同一の `CmdGen` ロジックをインライン実装
- `<head>` に `.cmdgen-*` スタイルを追加（style.css に依存しない独立 CSS）

---

## v2.20.0 — 2026-05-23

### 🗂 public/help.html にサイドバーナビゲーションを追加
- 左固定サイドバー（幅 192px）を新設し、18セクションへのリンクを配置
- 各 `<div class="section">` に ID を付与（`sec-features` 〜 `sec-examples`）
- `IntersectionObserver` でスクロール位置に合わせてアクティブリンクをハイライト
- body の `padding-left` を 216px に拡大してコンテンツとサイドバーが重ならないよう調整
- サイドバー自体もスクロール可能でアクティブリンクが自動スクロールで追従

---

## v2.19.0 — 2026-05-22

### 📋 public/index.html をタブ構成に刷新
- `#emptyHint` をタブナビゲーション付きのレイアウトに全面改訂
- タブ 5 種: 🎮 基本コマンド / ⚔️ ゲーム / 🤖 AI・生成 / 📋 仕様 / 🐱 キャラ一覧
- **`switchHintTab(idx)`** 関数を `public/index.html` インラインスクリプトに追加してタブ切替を実装
- **style.css**: `.hint-tabs`, `.hint-tab`, `.hint-tab-content`, `.hint-chara-grid` 等のスタイルを追加
- キャラ一覧タブにキャラ1〜50の emoji グリッドを掲載
- 全コマンド・仕様・AI機能・音量設定を最新内容に更新

### 📖 ルート index.html（コマンドリファレンス）を最新化
- バージョン番号を v2.19.0 に更新
- **射コマンド**を「その他の設定」セクションに追加
- **🤖 AI・生成機能**セクションを新規追加（`ai：`, `tts：`, `gen`, `ノベル起動`, 5分モード解説）
- 機能解説セクションに「AI返答・5分モード」「TTS（音声読み上げ）」のカードを追加
- 組み合わせ例に `ai：`, `tts：`, `射` コマンドの例を追加

---

## v2.18.0 — 2026-05-22

### 🎮 オセロゲームを追加 (`/othello`)
- `public/othello.html` を新規作成 — スタンドアロンのブラウザ完結型オセロゲーム
- **オンライン対戦**: 6文字ルームコードで2人がリアルタイム対戦（WebSocket）
- **AI対戦**: 位置重み付きグリーディAI（コーナー優先戦略）
- **ローカル2人プレイ**: 同一画面で交互に操作
- **server.js**: WebSocketサーバーを `/ws/game` パスに追加
  - ルーム管理（`gameRooms` Map）、`_gFlips` / `_gApply` / `_gHasMoves` / `_gInitBoard` を実装
  - create / join / move / resign メッセージに対応
  - パス判定・ゲーム終了判定をサーバー側で処理
- UI: 配置アニメーション・ひっくり返しアニメーション・スコア表示・投了ボタン

---

## v2.17.0 — 2026-05-22

### 🖥 サーバー管理パネルを admin.html に追加
- TTS (RVC/7870) と Ollama (11434) の起動/停止/状態確認をボタン操作可能に
- ●緑 = 起動中 / ●赤 = 停止中 を常時表示、5秒ごと自動更新
- 起動後 1.5 秒後に状態を再取得して反映
- **server.js**: `/api/srv/status` (GET) ・ `/api/srv/start/:name` (POST) ・ `/api/srv/stop/:name` (POST) を追加
  - `checkPort()` でポート疎通確認、`spawn()` で起動、`taskkill` で停止
  - 対象サーバーは `MANAGED_SERVERS` オブジェクトで管理（拡張可能）
- **admin.html**: 「🖥 サーバー管理」セクション追加、`srvRefresh()` / `srvAction()` を追加

---

## v2.16.0 — 2026-05-22

### 🔈 全効果音の音量を管理パネルから調節可能に
- 管理パネルに「🔈 音量設定」セクションを新設
  - **効果音** (`seVolume`): ガチャ・スロット・早押し・戦闘音など `playLocalSound` 全般
  - **ボイス** (`voiceVolume`): ボイスコメント (`playVoice`)
  - **TTS音量** (`ttsVolume`): 既存、TTS設定セクションに継続
- 各設定は localStorage に保存、ページリロード後も維持
- `playLocalSound` → `Math.min(1, volume * seVolume)` で乗算適用
- `playVoice` → `Math.min(1, 0.8 * voiceVolume)` で乗算適用
- **app.js**: `seVolume` / `voiceVolume` 変数・`initVolumeSettings` ・`volumeText` ハンドラ・`getState` 追加
- **index.html / admin.html**: 音量設定セクション追加、`sendVolumeText()` 追加

---

## v2.15.0 — 2026-05-22

### 🔊 TTS 音量調節を追加
- TTS設定に「音量」スライダー（0〜100%）を追加
- 管理パネル（admin.html / index.html）から調整可能、localStorage に保存
- **app.js**: `ttsVolume` 変数追加・`playTTS` で `audio.volume = ttsVolume` 適用・`initTTSSettings` / `_ttsListeners` / `ttsText` ハンドラに追加
- **index.html / admin.html**: `ttsVolumeSlider` / `ttsVolumeVal` を TTS設定セクションに追加

---

## v2.14.0 — 2026-05-22

### 🔊 5分モードの返答を TTS で自動読み上げ
- AI が返答を生成したタイミングで `playTTS()` を呼び出し、音声合成で読み上げ
- `>>{number}` プレフィックスは読み上げ対象外（テキスト本文のみ読み上げ）
- TTS モデル未設定の場合は無音でスキップ（既存の `playTTS` の動作）
- **app.js**: `_doAskAI` に `playTTS(replyText)` を追加

---

## v2.13.0 — 2026-05-22

### 🔧 コメント投稿をサーバー経由に変更（OBS対応）
- OBS ブラウザソースから `https://live.erinn.biz/` への直接 fetch が "failed to fetch" でブロックされる問題を修正
- **server.js**: `/api/post-comment` プロキシエンドポイントを追加（サーバー側で erinn.biz へ HTTP リクエスト）
- **app.js**: `postAIReply` の fetch 先を `https://live.erinn.biz/api/` → `/api/post-comment` に変更

---

## v2.12.0 — 2026-05-22

### 🤖 5分モード デバッグログを視覚ログに表示
- `_aiLog(text, color)` ヘルパーを追加し、全 5分モードログをアプリの視覚ログに出力
  - `送信:` → Ollama へ質問を送った
  - `返答生成:` → 返答テキストが生成された（水色）
  - `投稿完了:` → kukulu API 送信成功（緑）
  - `投稿スキップ: apikey なし` → OBS 等で apikey が未設定（赤）
  - `skip: 自分のコメント` / `skip: AI投稿ループ防止`
  - `Ollamaエラー:` / `例外:` → エラー詳細（赤）
- 5分モード開始時に apikey の有無を表示（OBS の設定漏れを即検出）
- **app.js**: `console.log` をすべて `_aiLog` に置換

---

## v2.11.0 — 2026-05-22

### 🤖 5分モード 安定性改善
- Ollama へのリクエストを直列キュー（`_aiQueue`）で管理し、並列送信によるエラーを防止
- スキップ理由を `console.log` で出力（`master本人` / `AI投稿ループ防止`）、原因の特定が容易に
- AI返答はアプリのログには表示せず、kukulu の API 経由のみでコメント投稿するよう変更
- **app.js**: `askAIAndPost` をキューラッパーに変更、内部処理を `_doAskAI` に分離

---

## v2.10.0 — 2026-05-22

### 🤖 5分モード改善
- AI返答の先頭に `>>{cnum}` を付けてどのコメントへの返答か明示（例：`>>484 いいですね！`）
- `from === 'master'` のコメントはAI返答をスキップ（自コメへの返信防止）
- **app.js**: `askAIAndPost` に `cnum` 引数を追加し、返答テキストに prefix を付与

---

## v2.09.0 — 2026-05-22

### 🤖 5分モード（AI自動返答）
- 管理パネルの「🤖 5分モード」ボタンで ON/OFF 切替
- ON 中にコメントが届くと自動で Ollama に送信し、返答を erinn.biz API でコメント投稿
- AI 投稿したテキストは 60 秒間 `_aiPostedTexts` に記録し、ループ防止でスキップ
- ゲーム処理（EXP・コマンド等）は通常通り継続
- ボタンは ON 時に青く点灯（admin.html / index.html 両方同期）
- **app.js**: `fiveMinMode` フラグ・`setFiveMinMode()` ・`postAIReply()` ・`askAIAndPost()` を追加、`handleComment` に 5分モードチェックを追加、`getState` に `fiveMinMode` を追加
- **index.html**: `fiveMinBtn` ボタンを追加
- **admin.html**: `adminFiveMinBtn` ボタン追加、`applyState` で ON/OFF 状態を反映
- **style.css**: `.btn-five-min` / `.five-min-active` スタイルを追加

---

## v2.08.0 — 2026-05-22

### 🤖 AI設定を管理パネルから設定可能に
- 管理パネル（admin.html / index.html）に「🤖 AI設定」セクションを追加
  - **モデル**: Ollama で使用するモデル名（デフォルト: `gemma3:12b`）
  - **ルール**: system prompt（AIへの指示・口調・制約など）
- 設定は localStorage に保存され、ページリロード後も維持
- 管理パネル↔メインウィンドウ間は `aiText` メッセージタイプで同期
- **admin.html**: AI設定セクション・`sendAIText()` 関数・`applyState` 対応を追加
- **index.html**: AI設定 admin-group を追加
- **app.js**: `aiModel` / `aiSystem` 変数・localStorage 復元・`aiText` ハンドラ・`getState` 対応を追加
- **server.js**: `/api/ai-reply` の `system` パラメータは既にクライアントから渡す実装済み

---

## v2.07.0 — 2026-05-22

### 🤖 AI返答機能（Ollama）
- コメントで `ai：質問内容` と送ると、Ollama（gemma3:12b）が返答を生成してキャラの吹き出しに表示
- `AI：` `ＡＩ：` など大文字・全角コロンにも対応
- 返答はログにも `🤖 AI質問` / `🤖 AI返答` として記録
- **server.js**: `/api/ai-reply` POST エンドポイントを追加（Ollama `http://127.0.0.1:11434/api/generate` を呼び出し）
- **app.js**: `askAI(user, question)` 関数を追加、`handleComment` に `aiMatch` コマンド処理を追加
- `aiModel` 変数でモデルを切り替え可能（デフォルト: `gemma3:12b`）

---

## v2.06.0 — 2026-05-22

### 🎨 SD生成コマンドに「gen」を追加
- `gen` （大文字小文字問わず）でも SD画像生成を起動可能に
- 例：`gen cute cat` → "cute cat" をプロンプトに生成
- **app.js**: SD生成コマンドの正規表現を `/出ろ|出して|生成|gen/i` に変更

---

## v2.05.0 — 2026-05-22

### 💬 コマンド実行時に吹き出しを表示
- 射・SD生成・TTS・ノベル起動・開ける の各コマンドで、コマンドテキストをキャラの吹き出しに表示するよう変更
- ペットガチャ・スロット系はすでに独自の吹き出しあり、AFK/放置は専用UIのため対象外
- **app.js**: 各コマンド検出ブロックに `ensureCharOnStage(user); showBubble(user, message, {})` を追加

---

## v2.04.0 — 2026-05-22

### 🔊 TTSテスト用コマンド追加
- コメントで `tts：文章`（全角・半角コロン両対応）と送ると音声合成を再生
- **app.js**: `handleComment` に TTSコマンド検出を追加

---

## v2.03.0 — 2026-05-22

### 🔊 TTS（RVC音声合成）基盤を追加
- `localhost:7870` の RVC を使った音声合成システムを実装
- `playTTS(text)` を呼ぶだけでシステムボイスを再生可能
- TTS設定（モデル・ボイス・ピッチ・IndexRate・Protect・Speed）を管理パネルから変更可能、localStorage に保存
- **server.js**: `/api/tts` POST エンドポイント追加（7870/run/predict プロキシ）
- **app.js**: `playTTS()` 関数追加、TTS設定変数追加、`handleAdminMessage` に `ttsText` ハンドラ追加、`getState` にTTS設定追加
- **index.html**: 🔊 TTS設定 adminグループ追加
- **admin.html**: TTS設定セクション・`sendTTSText()` 関数・`applyState` 対応追加

---

## v2.02.0 — 2026-05-21

### 📖 ノベルモーダル追加
- `localhost:3001` を iframe で表示するモーダルを追加
- **admin.html**: 「📖 ノベル起動」ボタンを追加（システムセクション）。クリックで index.html 側のモーダルを開く
- **index.html**: `#novelModal` モーダル追加（iframe で localhost:3001 を表示）
- **app.js**: `openNovelModal()` / `closeNovelModal()` 関数追加、コメントで「ノベル起動」と送るとモーダルが開く、`handleAdminMessage` に `openNovel` タイプ追加
- **style.css**: `.novel-modal` / `.novel-modal-header` / `.novel-modal-frame` / `.btn-novel` スタイル追加

---

## v2.01.0 — 2026-05-21

### 🎨 翻訳後プロンプトもモザイク判定に追加
- 日本語プロンプトが翻訳された場合、翻訳後のワードもモザイクキーワードと照合
- 例：「裸」→「naked」に翻訳された場合、「naked」がモザイクキーワードに含まれていればモザイク適用
- **app.js**: `_sdNeedsMosaic(prompt, translatedPrompt, mosaicKeywords)` にシグネチャ変更、`showSDImage` に `translatedPrompt` 引数追加

---

## v2.00.0 — 2026-05-21

### 🌐 SD生成プロンプトの日本語→英語自動翻訳
- プロンプトに日本語が含まれる場合、`translate.googleapis.com` を使って英語に翻訳してから SD に送信
- 翻訳失敗時は元のプロンプトでそのまま続行（エラーで生成が止まらない）
- ログに「翻訳: 元テキスト → 翻訳後テキスト」を紫色で表示
- **server.js**: `hasJapanese()` / `translateToEnglish()` 関数追加、`/api/sd-generate` に翻訳ステップ追加、レスポンスに `translatedPrompt` を含める
- **app.js**: 翻訳結果をログに出力するよう `generateSDImage` を修正

---

## v1.99.0 — 2026-05-21

### 🎨 SD Sampling method を Euler a に変更
- **server.js**: `data[SD_IDX.SAMPLER]` を `'DPM++ 2M'` → `'Euler a'` に変更

---

## v1.98.0 — 2026-05-21

### 🐛 SD表示サイズ・ログ修正（v1.96/v1.97の続き）
- **表示サイズが admin.html から変更できない問題を修正**: `handleAdminMessage` の `sdText` ハンドラの `elMap` に `sdPopWidth:'sdPopWidthSlider'` が抜けていた。追加と同時に `sdPopWidthVal` ラベル更新も追加
- **`getState` に `sdPopWidth` を追加**: admin.html 接続時に現在値が反映されるよう修正
- **SD生成ログを修正**: `{ name: '🎨SD', charDef: null }` → 実際の `user` オブジェクトを使用、`popWidth` もログに出力するよう変更
- **app.js**: `handleAdminMessage` `elMap`・`sdPopWidthVal` 更新追加、`getState` 修正、`generateSDImage` ログ修正

---

## v1.97.0 — 2026-05-21

### 🐛 SD生成画像の表示サイズが反映されない問題を修正
- 原因：`style.css` の `.sd-image-popup` に `width: 480px` が固定されていたため、スライダーの値が無視されていた
- 修正：`showSDImage()` で `el.style.width = popW + 'px'` を設定するよう変更
- **style.css**: `.sd-image-popup` から固定 `width: 480px` を削除
- **app.js**: `showSDImage()` に `el.style.width = popW + 'px'` 追加

---

## v1.96.0 — 2026-05-21

### 🎨 SD生成画像の表示サイズを管理パネルから変更可能に
- 表示幅スライダー（`sdPopWidthSlider`、100〜800px、デフォルト480px）を管理パネルに追加
- 設定値は localStorage に保存、ページリロード後も維持
- `_sdReadSettings()` に `popWidth` を追加、`showSDImage()` で `cfg.popWidth` を使用
- admin.html からも同期変更可能（`sdPopWidthVal` 表示ラベル連動）
- **app.js**: `_sdReadSettings()` に `popWidth` 追加、`initSDSettings` IIFE で `sdPopWidthSlider` 初期化、イベントリスナー追加、`handleAdminMessage` の `sdText` ハンドラに `sdPopWidth` 対応追加
- **index.html**: `sdPopWidthSlider` range input 追加（SD生成設定グループ内）
- **admin.html**: SD設定セクションに `sdPopWidthSlider` 追加、`sdFields` / `sdElMap` / `applyState` に `sdPopWidth` 追加

---

## v1.95.0 — 2026-05-21

### 🎨 SD設定が反映されない問題を修正
- 設定変更が生成に反映されなかった原因：`change` イベント経由の変数更新が不安定だった
- 修正：生成時に `_sdReadSettings()` で DOM から直接値を読む方式に変更（変数キャッシュ不要）
- イベントリスナーを `input` イベントで localStorage 保存のみに統一
- `handleAdminMessage` の `sdText` ハンドラも DOM + localStorage 直書き方式に変更
- **デバッグログ**: 生成実行時に実際のプロンプト・サイズ・ステップ数をログセクションに出力
- **app.js**: `_sdReadSettings()` 関数追加、`generateSDImage` / `showSDImage` を DOM 直読み方式に変更

---

## v1.94.0 — 2026-05-21

### 🎨 SD生成設定を管理パネルから変更可能に
- 幅・高さ・Steps・表示時間・ポジティブサフィックス・ネガティブプロンプト・モザイクキーワードを管理パネルで設定可能
- 設定は localStorage に保存、ページリロード後も維持
- admin.html からも同期変更可能（接続時に現在値を反映）
- **モザイク機能**: モザイクキーワード（カンマ区切り）をプロンプトが含む場合、生成画像にピクセルモザイクを適用（blockSize=20）
- **app.js**: `sdWidth/sdHeight/sdSteps/sdPositiveSuffix/sdNegative/sdDisplayTime/sdMosaicKeywords` 変数追加、`_sdNeedsMosaic()` / `_applyMosaic()` 関数追加、`sdText` メッセージハンドラ追加、`getState` に SD設定を追加
- **index.html**: 🎨 SD生成設定 adminグループ追加
- **admin.html**: SD設定セクション追加、`sendSDText()` / `applyState` への SD設定反映追加
- **server.js**: リクエストボディから width/height/steps/positiveSuffix/negative を受け取るよう変更
- **style.css**: `.admin-text-input` / `.admin-textarea` スタイル追加

---

## v1.93.0 — 2026-05-21

### 🎨 SD生成設定を調整
- 生成サイズを 512×512 → 1600×1000 に変更
- プロンプトサフィックスを `anime, high quality, detailed` → `masterpiece, best quality` に変更
- ポップアップ表示幅を 268px → 480px に拡大（画像サイズに合わせて）
- **server.js**: `WIDTH/HEIGHT/PROMPT` 定数変更
- **app.js / style.css**: ポップアップ幅変更

---

## v1.92.0 — 2026-05-21

### 🎨 SD画像生成コマンド追加（出ろ / 出して / 生成）
- コメントに「出ろ」「出して」「生成」が含まれていたら Stable Diffusion で画像を生成し、ステージ上にポップアップ表示
- コマンド語を除いた残りのテキストをポジティブプロンプトとして使用（空の場合は `1girl, anime` を使用）
- 生成中はキャラのふきだしに「🎨 生成中…」を表示
- 生成完了後、キャラ近くに画像ポップアップを表示（30秒後に自動消去・✕ボタンで手動閉鎖可）
- SD への接続先: `http://127.0.0.1:7860/sdapi/v1/txt2img`（REST API）
- **server.js**: `http` モジュール追加、`POST /api/sd-generate` エンドポイント追加
- **app.js**: `generateSDImage()` / `showSDImage()` 関数追加、`handleComment` にコマンド検出追加
- **style.css**: `.sd-image-popup` / `.sd-image-header` / `.sd-image-img` スタイル追加

---

## v1.91.0 — 2026-05-21

### ⚰️ KO 自動復活時間を 2秒 → 10秒 に変更
- KO 状態からの自動復活タイマーを 2000ms から 10000ms に延長
- **app.js**: `damageUser()` 内の `user.koTimer = setTimeout(...)` の遅延値を変更

---

## v1.90.0 — 2026-05-21

### 🐉 ボスHPバー：横幅をボス画像幅以内に制限
- HPバー・ラベル行の横幅がボス画像（`bossSize`）を超えないよう上限を `bossSize` に変更
- **app.js**: `barWidth` 計算を `Math.min(bossSize, Math.round(stage.clientWidth * 0.6))` に変更

---

## v1.89.0 — 2026-05-21

### 🚀 射コマンド：ボス衝突時に弾が消えないよう変更
- 文字弾がボスに当たっても弾を削除しなくなった（寿命まで飛び続ける）
- 連続ダメージ防止のため弾ごとに 500ms のクールダウンを設定（`b.bossCooldown`）
- **app.js**: `startKaiPhysics()` のボス判定内から `b.el.remove()` / `splice` を削除し、`performance.now()` によるクールダウン判定を追加

---

## v1.88.0 — 2026-05-21

### 🚀 射コマンド：射出方向をキャラ→画面上部中央に変更
- キャラの現在位置から画面上部中央（`stageWidth/2, 0`）を狙う角度を `atan2` で算出し、そこに±15°のブレを加えるように変更
- キャラが左にいれば右斜め上、右にいれば左斜め上へ自然に射出される
- **app.js**: `launchBullets()` 内で `targetAngle = Math.atan2(0 - cy, stageW/2 - cx)` を計算し angle に適用

---

## v1.87.0 — 2026-05-21

### 🚀 射コマンド：射出角度を±15°に変更
- 射出角度のランダム幅を±30°から±15°（`Math.PI / 6`）に縮小
- **app.js**: `launchBullets()` 内の angle 計算を `* (Math.PI / 6)` に変更

---

## v1.86.0 — 2026-05-21

### 🚀 射コマンド：射出方向を真上±30°に変更
- 射出角度を全方向ランダムから「真上（-90°）を中心に±30°のランダム」に変更
- **app.js**: `launchBullets()` 内の `angle` を `-Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 3)` に変更

---

## v1.85.0 — 2026-05-21

### 💤 AFK コマンド：全角「ＡＦＫ」でも起動可能に
- コメントに `ＡＦＫ`（全角）が含まれていても AFK 状態になるように
- 既存の `AFK`（半角大文字・小文字混在）対応は維持
- **app.js**: `handleComment` 内の正規表現を `/AFK|ＡＦＫ/i` に変更

---

## v1.84.0 — 2026-05-21

### 💤 放置コマンド：「無明」でも起動可能に
- `放置:テキスト` に加え `無明:テキスト` でも同じ放置コマンドが使えるように
- 全角コロン（：）も引き続き対応
- **app.js**: `handleComment` 内の正規表現を `/^(?:放置|無明)[：:](.+)$/` に変更

---

## v1.83.0 — 2026-05-21

### 🚀 射コマンド：射出起点をキャラ位置に変更
- 射出された文字弾の発射起点を「ステージ右下固定」から「コマンド実行者のキャラ中心」に変更
- 射出角度も上方向固定から全方向ランダム（360°）に変更し、キャラから四方へ散らばるように
- **app.js**: `launchBullets()` 内で `getCharCenter(user)` を使用、`angle` を `Math.random() * Math.PI * 2` に変更

---

## v1.82.0 — 2026-05-21

### 🎰 全員スロット開始/停止ボタン追加
- 管理パネル（index.html・admin.html）のスロット確率セクションに「🎰 全員開始」「⏹ 全員停止」ボタンを追加
- **全員開始**: ステージ上の全ユーザーに対し、MP >= 1 かつ未スロット中のユーザーを対象に `slotAutoMode = true` で自動スロットを開始
- **全員停止**: 全ユーザーの `slotAutoMode = false` をセットし、現在の1スピン完了後に自動継続を停止
- **app.js**: `slotAllStartBtn` / `slotAllStopBtn` イベントリスナー追加
- **index.html**: スロット確率グループにボタン行追加
- **admin.html**: スロット確率セクションにボタン行追加（`cmd()` 経由）
- **style.css**: `.btn-slot-all-start` / `.btn-slot-all-stop` スタイル追加

---

## v1.81.0 — 2026-05-21

### 🔊 スロット効果音 ON/OFF 切り替え
- 管理パネル（index.html・admin.html）のスロット確率セクションに「🔊 スロット音」トグルボタンを追加
- ON 状態（デフォルト）: 青色表示、全スロット音再生
- OFF 状態: 赤色表示、スロットのすべての効果音（開始音・リール停止音・結果音）をミュート
- 設定は `localStorage`（キー: `slotSoundEnabled`）に保存され、ページリロード後も維持
- **app.js**: `slotSoundEnabled` フラグ追加、3箇所の `playLocalSound` 呼び出しにガード追加、`initSlotSound()` IIFE で起動時復元、`slotSoundBtn` イベントリスナー追加
- **index.html**: スロット確率グループ末尾に `id="slotSoundBtn"` ボタン追加
- **admin.html**: スロット確率セクション末尾に `onclick="cmd('slotSoundBtn')"` ボタン追加
- **style.css**: `.btn-slot-sound` / `.btn-slot-sound.active` スタイル追加

---

## v1.80.0 — 2026-05-21

### 👾 スピキ生成ボタン追加
- 管理パネル（admin.html）⚔️ ボス設定セクションに「👾 スピキ生成」ボタンを追加
- クリックすると専用画像（`img_-0002-2607607172.png`）のスピキボスを召喚
- ラベルが「👾 スピキ」で表示され、通常ボスと区別可能
- **スピキボスへの攻撃時は `playSentouSound` が `dragSounds` からランダム再生に切り替わる**（sentouSoundsは使用しない）
- 射コマンド・ペット攻撃・通常攻撃すべてで適用
- HP・撃破演出・ダメージランキングは通常ボスと同様
- **app.js**: `spawnSpikiBoss()`, `playSentouSound()` 修正, `spikiBossBtn` リスナー追加
- **index.html**: `id="spikiBossBtn"` 非表示ボタン追加
- **admin.html**: ボス設定セクションにスピキ生成ボタン追加

---

## v1.79.0 — 2026-05-21

### 🚀 射コマンド：ボスへのダメージ対応
- 射出された文字弾がボスに当たると1〜5ダメージ
- 通常攻撃と同じ演出（戦闘効果音・ボスフラッシュアニメ・ダメージ数字表示）
- ダメージは射撃者のユーザーに帰属（ダメージランキングに加算）
- ボスHPが0になれば通常討伐と同様に `defeatBoss()` を呼び出す
- `_kaiBossTarget()` ヘルパーで毎フレーム1回だけ `getBoundingClientRect` を呼び出してボス位置を取得
- 文字弾はボス衝突時に即消滅（貫通なし）
- **app.js**: `startKaiPhysics`/`_kaiBossTarget` 追加、`launchBullets` に `user` 参照を追加

---

## v1.78.0 — 2026-05-21

### 🚀 射コマンド追加（物理演算）
- コメントに「射」が含まれていると、コメント文字を1文字ずつ物理弾として右下から発射
- requestAnimationFrame による物理ループ（`startKaiPhysics` / `kaiStep`）
  - 重力・壁反射・床摩擦・フェードアウト（寿命後半30%）・速度方向に回転
- キャラクターとの当たり判定（反射ベクトル計算で跳ね返る）
- 管理パネルにスライダー4種追加（index.html・admin.html）
  - 🚀 射出強さ（5〜40）
  - 反発係数（0〜100%）
  - 重力（0〜100%）
  - 弾文字サイズ（16〜64px）
- `getState` / `applyState` に4スライダーを追加（管理ウィンドウ同期対応）
- **app.js**: `launchBullets()`, `startKaiPhysics()`, `initKaiSliders()`, handleComment に射判定を追加
- **style.css**: `.kai-bullet` クラス追加
- **index.html / admin.html**: 🚀 射コマンド スライダーセクション追加

---

## v1.77.0 — 2026-05-21

### 🗑 ゴミ箱の表示問題を根本修正
- CSS に `right: 18px; bottom: 18px` をデフォルト位置として追加し、JSポジション設定に失敗しても必ず右下に表示されるように対応
- `initTrashPosition` を改修：localStorage保存座標がある場合のみJSでleft/topを設定し、ない場合はCSS位置をそのまま使用
- ドラッグ開始時の初期座標を `style.left` ではなく `getBoundingClientRect` で取得するよう修正（CSS位置との整合性を確保）
- ドラッグ中は `right/bottom` をautoにクリアしてから `left/top` を設定する処理を追加
- 透明度を0.45 → 0.65に引き上げてより視認しやすく
- **style.css**: `#trashCan` に `right/bottom/opacity` 追加
- **app.js**: `initTrashPosition` / マウスダウン / ドラッグ mousemove を修正

---

## v1.76.0 — 2026-05-19

### 💣🗑 爆弾・ゴミ箱の表示切替ボタンを管理パネルに追加
- 「📺 表示」セクションに「💣 爆弾」「🗑 ゴミ箱」トグルボタンを追加
- クリックで表示/非表示を切り替え（active時に青く点灯）
- index.html・admin.html 両パネル対応

---

## v1.75.0 — 2026-05-19

### 📋 index.html のコマンドリファレンス追加
- ゲーム未開始時（キャラ0人）の画面にグリッド形式のコマンド一覧を表示
- カテゴリ10区分：キャラクター / モーション / 吹き出し / スロット / ペット / ボス / AFK / エフェクト / ゲームモード / 自動機能
- スロット役・確率テーブル、ペットレア度バッジも掲載
- スクロール対応（画面サイズに合わせて自動折返しグリッド）

---

## v1.74.0 — 2026-05-19

### 💤 AFK/放置のグレーアウト強度を管理パネルから調整可能に
- 「📐 サイズ調整」セクションに「💤 グレースケール」「💤 明るさ」スライダーを追加
- CSS変数 `--afk-grayscale`（デフォルト60%）・`--afk-brightness`（デフォルト55%）で制御
- 既存の透明度スライダーと合わせて3スライダー体制に（initAfkSlidersに統合）
- 設定はlocalStorageに保存

---

## v1.73.0 — 2026-05-19

### 💤 AFK/放置の透明度を管理パネルから調整可能に
- 「📐 サイズ調整」セクションに「💤 AFK透明度」スライダー追加（0〜100%、デフォルト45%）
- CSS変数 `--afk-opacity` で制御、リアルタイム反映
- 設定はlocalStorageに保存
- index.html・admin.html 両パネル対応

---

## v1.72.0 — 2026-05-19

### 💤 放置コマンド追加
- `放置:テキスト` でキャラクター上部に「💤 テキスト」を表示し続ける
- 次のチャット送信で自動解除（AFK解除と同じタイミング）
- 全角コロン（`放置：テキスト`）にも対応
- キャラ再登場時も放置状態を復元
- 既存の AFK 機能（`afk-bubble` / `char-afk`）を拡張して実装

---

## v1.71.0 — 2026-05-19

### 🔊 スロット開始音の音量調整
- `start.wav` の再生音量を 80% → **70%** に変更
- `playLocalSound(src, volume)` に任意音量引数を追加（デフォルト 0.8 で既存動作は変わらず）

---

## v1.70.0 — 2026-05-19

### 🎰 スロット確率を管理パネルから変更可能に
- 管理パネル（インライン・admin.html両対応）に「🎰 スロット確率」セクション追加
- 各役（🍒/🔔/⭐/💎/7️⃣）の当選確率をスライダーで個別設定可能
- 設定値はlocalStorageに保存、次回起動時に復元
- ハズレ確率をリアルタイム表示（合計100%からの差分）
- `SLOT_PROB_DEFAULTS` / `loadSlotProbs()` / `applySlotProbs()` / `initSlotProbSliders()` 追加

---

## v1.69.0 — 2026-05-19

### 🎰 スロット結果先行方式に変更
- 当選確率を直接指定するテーブル方式に変更（`SLOT_OUTCOMES`）
- 🍒×3: **20%** / 🔔×3: **10%** / ⭐×3: **5%** / 💎×3: **1%** / 7️⃣×3: **0.5%** / ハズレ: 63.5%
- ハズレ時はランダムな非揃い絵柄を表示（演出はそのまま）
- `SLOT_REELS_DEF` / `rollSlotReel()` / `getSlotResult()` を削除し `rollSlotOutcome()` に置き換え

---

## v1.68.0 — 2026-05-19

### 🎰 スロット絵柄調整
- 🍋（役なし）を削除
- 重みを 🍒50 / 🔔30 / ⭐15 / 💎4 / 7️⃣1 に変更
- 当たり確率: 🍒×3≈12.5% / 🔔×3≈2.7% / 合計約16%

---

## v1.67.0 — 2026-05-19

### 🔊 スロット効果音追加
- 回転開始時: `start.wav`
- リール停止ごと: `カーソル移動2.mp3`（3回）
- ハズレ: `ビープ音4.mp3`
- 🍒×3: `決定ボタンを押す26.mp3`
- 🔔/⭐/💎×3: `nc129326_ピロピロピロピロ.mp3`
- 7️⃣×3: `777.mp3`

---

## v1.66.0 — 2026-05-19

### 🎰 スロット調整・自動連続スロット追加
- ペアの役を廃止（3つ揃いのみ当たり）
- リール停止間隔を 220ms → 330ms に変更
- `スロット開始` コマンド追加: MPがある限り自動でスロットを回し続ける
- `スロット停止` コマンド追加: 自動スロットを停止（現在の1回が終わってから停止）
- MP切れ時は自動でスロット停止しバブル表示

---

## v1.65.0 — 2026-05-19

### 🎰 スロットマシン追加
- コメント `スロット` で発動（MP 1消費）
- 3リール独立抽選（🍒35 / 🍋28 / 🔔20 / ⭐12 / 💎4 / 7️⃣1）
- 役と報酬（すべてMP）:
  - ペア(2つ揃い)→MP+2、🍒×3→MP+5、🔔×3→MP+10、⭐×3→MP+25、💎×3→MP+60、7️⃣×3→MP+200+全員花火
- キャラ頭上にリール演出パネルを表示（220ms間隔でリール確定アニメ）
- 演出中の連打は無視（`user.slotSpinning` フラグ）
- 関連関数: `playSlot()` / `rollSlotReel()` / `getSlotResult()`

---

## v1.64.0 — 2026-05-19

### 💧 MP上限撤廃・自動回復発動を廃止
- MP の上限（20）を撤廃。コメントするたびに無制限に蓄積可能に
- MP が20以上になったときの「自動で MP-2 → 全員 HP+2」自動発動を削除
- 「回復」コメントによる手動回復（MP-2）は引き続き有効
- デバッグ「全員MP+30」ボタンの上限クランプも除去

---

## v1.63.0 — 2026-05-19

### ⚖️ 神話装備ドロップ確率を1/10に調整
- `rollEquipValue()` に神話ゲート（追加抽選）を追加
- 通常ロールで神話レアリティ（value≥8）が出た場合、さらに 10% の確率でのみ確定。90% は伝説（value=7）に格下げ
- ボス討伐・デバッグ配布の両方に適用

---

## v1.62.0 — 2026-05-19

### 🎮 管理パネルに装備非表示・自動BR切り替えボタンを追加

#### ⚔️ 装備アイコン非表示ボタン
- `index.html` 表示セクション・`admin.html` に「⚔️ 装備表示」ボタンを追加（トグル）
- ON（青色）のとき全キャラの `.char-equip-area` を CSS クラス `equip-hidden` で一括非表示
- 再押しで再表示。コンパクトモードと独立して動作

#### 🔄 自動BR切り替えボタン
- `index.html` ゲーム操作セクション・`admin.html` に「🔄 自動BR」ボタンを追加（トグル）
- 無効時（赤色）は30分ごとの自動バトルロイヤル発動をスキップ
- `brAutoEnabled` フラグで管理。BRタイマーカウントダウンは有効/無効に関わらず継続

---

## v1.61.0 — 2026-05-19

### 🎮 バトルロイヤル強化・クイズ音声・BRタイマー追加

#### ❓ クイズ正解音声
- 正解時のサウンドを `public/sound/quiz/クイズ正解2.mp3` に変更

#### ⏰ 次回BRタイマーパネル
- ステージ上に「次のBR HH:MM」カウントダウンパネルを追加
- `⏰ BR次回` ボタン（`index.html` / `admin.html`）でトグル表示（トグルONで紫色のパネルが現れる）
- ドラッグ＆ドロップで位置保存（`localStorage`）
- BR中は「👑 BR中」表示、コンパクトモード中は非表示
- 自動BR・手動BR開始のたびにタイマーを30分にリセット

#### 👑 バトルロイヤル脱落ごとに円形配置
- `brEliminate()` 内で脱落後900ms後に残存者を `arrangeBRCircle()` で再配置
- 開始時に加え、1人脱落するたびにフィールド中央に円形整列

#### 🛡️ バトロワ中ボス召喚コマンドを無効化
- `ボス召喚` コマンドをバトルロイヤル中（`brState.active`）は無効にするガードを追加

#### 🐉 バトロワ終了後に自動ボス召喚
- `endBattleRoyale()` 終了7秒後（キャラが下集合した後）に `spawnBoss(nextBossHp())` を自動実行
- ボスが既に存在する場合・コンパクトモード中はスキップ

---

## v1.60.0 — 2026-05-19

### ❓ クイズゲーム機能を追加
- `public/text/quiz.txt` から問題を読み込み、コメントで回答するクイズゲームを実装
  - 1問30秒制限（カウントダウン表示、残り5秒で赤点滅）
  - 正解者には HP+20 の回復、花火演出
  - 時間切れ・正解後4秒で次の問題へ自動遷移
  - 回答判定は部分一致（カタカナ→ひらがな正規化、全角/半角統一、空白無視）
  - `public/text/quiz.txt` に問題1000問（哲学・宇宙・化学・文学・音楽・アニメ・マンガ・ゲーム）
- **❓ クイズ** ボタンを `index.html` 管理モーダルと `admin.html` に追加（トグル式）
- クイズパネルはドラッグ移動可能、コンパクトモード中は非表示
- 関連関数: `startQuiz()` / `stopQuiz()` / `nextQuizQuestion()` / `renderQuizPanel()` / `handleQuizAnswer()` / `normalizeAnswer()` / `checkQuizAnswer()`

---

## v1.59.0 — 2026-05-19

### 🐛 全員停止で歩くモーションが止まらないバグを修正
- `stopAllBtn` ハンドラに `stopWalk(u)` を追加（`walkTimer` クリア・`walking` フラグ解除）

---

## v1.58.0 — 2026-05-19

### 🎮 管理パネルに全員停止ボタンを追加
- `admin.html` 一括モーション行に「⏹ 全員停止」ボタンを追加
  - 移動・歩き・はずむ・回転など全モーションを停止（既存の `stopAllBtn` を中継）

---

## v1.57.0 — 2026-05-19

### 🎮 管理パネルに全員一括モーション/移動ボタンを追加
- `admin.html` ゲーム操作セクションに4ボタンを追加
  - 🚶 全員歩く → `startWalk(u)` を全員に適用
  - 🏃 全員移動:普通 → `movement='普通'` で `scheduleMove(u)` を全員に適用
  - 🎵 全員はずむ → `applyMotion(u, 'bouncing')` を全員に適用
  - 🌀 全員回転 → `applyMotion(u, 'spinning')` を全員に適用
- `app.js` `handleAdminMessage` に `allWalk` / `allMoveNormal` / `allBounce` / `allSpin` ハンドラを追加

---

## v1.56.0 — 2026-05-19

### 👑 バトルロイヤル終了後3秒で自動下集合
- `endBattleRoyale()` の末尾に `setTimeout(() => gatherCharactersBottom(), 3000)` を追加

---

## v1.55.0 — 2026-05-19

### 🐛 大きいキャラが画面外にはみ出すバグを修正
- `clampToStage()` / `gatherCharacters()` / `gatherCharactersBottom()` の高さ・幅計算を
  推定値（`size × 1.5 × charSizeScale`）から実際の DOM サイズ（`el.offsetWidth` / `el.offsetHeight`）に変更
  - `lvScale`・`brWinnerScale` 等が加味されていなかった問題を解消
  - 下集合ボタン押下時にキャラ下部が画面外に出る問題を修正
- `randX()` / `randY()` もキャラの実サイズを参照するよう変更（自動移動時のはみ出し対策）

---

## v1.54.0 — 2026-05-19

### ⚔️ ボスHP を参加者の総ATK連動に変更（案A）
- `nextBossHp()` を「参加者全員のATK合計 × 係数 × HP倍率」方式に変更
  - 参加者が強くなるほど・人数が多いほどボスHPが増加
  - 参加者0人またはATK合計0のときは最低値100を保証
- `bossHpCounter`（固定増加）は廃止
- 手動召喚（`ボス召喚：数値`）は引き続き指定値を優先
- **⚔️ ATK係数スライダー**を管理パネルに追加（1〜200、デフォルト20）
  - `index.html` および `admin.html` のボス設定セクションに追加
  - `localStorage` に永続化、WebSocket/BC 経由で同期

---

## v1.53.0 — 2026-05-18

### 🐛 コンパクトモードOFF後に早押し自動起動が止まるバグを修正
- `setCompactMode(false)` 時、`pollTimer` が動いていれば `hayaoshiAutoTimerWhite/Red` を再スケジュール
- コンパクトモードをON→OFFすると以降の自動早押しが止まっていた

---

## v1.52.0 — 2026-05-18

### 🐉 ボスの出現位置を最後のD&D位置に固定
- `let bossLastPos` を追加
- ボスのmouseupハンドラでドロップ時の座標を `bossLastPos` に保存
- `spawnBoss` でボス初期位置に `bossLastPos` を使用（未設定時は従来の中央上部）

---

## v1.51.0 — 2026-05-18

### 🖼 管理パネル（admin.html）にBG画像変更機能を追加
- `admin.html` 背景・エリアセクションに「🖼 BG画像」ボタンと「✕BG」クリアボタンを追加
  - BG画像は admin.html から直接 `/api/bg-upload` にPOSTしてサーバー保存
  - 取得URLを `adminSend({ type:'bgImage', url })` でメインウィンドウに中継
  - クリアは `/api/bg` DELETE → `adminSend({ type:'bgClear' })`
  - 接続時の状態同期（`bgImageUrl`）でボタン表示を自動切替
- `app.js`: `handleAdminMessage` に `bgImage` / `bgClear` ハンドラを追加
- `app.js`: `getState` レスポンスに `bgImageUrl` を追加
- `admin.html`: BG色の送信を `channel.postMessage` → `adminSend` に統一

---

## v1.50.0 — 2026-05-18

### 🔌 管理パネルをOBSブラウザソース外から操作可能に（WebSocket中継）
- `server.js`: `ws` パッケージを追加。`/ws` エンドポイントにWebSocketサーバーを追加
  - `main`（index.html）と `admin`（admin.html）の2ロールを管理
  - admin→main、main→adminにメッセージを中継
- `app.js`: `handleAdminMessage(d, replyFn)` を共通関数として抽出
  - BroadcastChannel・WebSocket の両方から同じハンドラを呼び出す構造に変更
  - `initAdminWS()` IIFE を追加 — サーバーWS経由でadmin.htmlと通信（自動再接続）
- `admin.html`: `adminSend(msg)` を追加 — BC と WS の両方に同時送信
  - WS接続時はステータスドットがWS接続状態を反映
  - WS接続が確立した時点で自動的に状態取得・ユーザー一覧取得を実行
- **使い方**: OBSブラウザソースでindex.htmlを開いたまま、通常ブラウザで `http://localhost:3000/admin.html` を開けば操作可能

---

## v1.49.0 — 2026-05-18

### 🎥 OBS透過モード（?transparent=1）を追加
- URLに `?transparent=1` を付けると body・html・stage の背景色を透明に固定
- `applyBgColor` は透過モード中スキップされるためBG色ピッカーの影響を受けない
- BG画像（`backgroundImage`）は別プロパティなので透過モードでも表示される
- 設定バーはそのまま表示される（`?obs=1` とは独立）
- OBSカスタムCSSは不要、URLのみで制御可能

---

## v1.48.0 — 2026-05-18

### 📦 コンパクトモード中は自動バトルロイヤルを抑制
- 30分自動BRタイマーの先頭に `if (compactMode) return` を追加

---

## v1.47.0 — 2026-05-18

### 📦 コンパクトモード中のキャラ発生時に自動で下集合
- `createCharacter()` の末尾に `if (compactMode) gatherCharactersBottom()` を追加
- コンパクトモード中にキャラがスポーンすると、全員が下集合した状態に自動で整列される

---

## v1.46.0 — 2026-05-18

### 👑 バトルロイヤル終了後の脱落キャラ復活・優勝者サイズ3倍
- **脱落キャラ復活**: BR終了後、脱落したキャラを開始前のHPで全員再スポーン
  - `startBattleRoyale` で参加者の HP を `brState.savedHp` に保存
  - `endBattleRoyale` で `brState.maxHp` のキー全員に対し `ensureCharOnStage()` を呼び出し、`savedHp` を復元
- **優勝者3倍サイズ（1分間）**: BR優勝者のキャラが1分間3倍サイズで表示される
  - `winner.brWinnerScale = 3` を設定し `applyAvatarStyle` / `renderPetBadge` に反映
  - 60秒後に `brWinnerScale` を削除して元サイズに戻す
- `applyAvatarStyle` / `renderPetBadge`: `user.brWinnerScale` を乗数として考慮するよう変更

---

## v1.45.0 — 2026-05-18

### 👑 バトルロイヤル仮想HP倍率を変更・管理パネルから調整可能に
- 仮想HP倍率をデフォルト **500x → 200x** に変更
- `app.js`: `let brHpMult = 200` を追加、BR開始時の仮想HP計算を `calcMaxHp(u) * brHpMult` に変更
- `app.js`: `initBrHpMultSlider()` IIFE を追加（`localStorage` に保存・復元）
- `index.html`: 管理モーダルに「👑 バトルロイヤル」グループを追加（仮想HP倍率スライダー 1〜1000x）
- `admin.html`: 「👑 バトルロイヤル」セクションを追加（同スライダー、別ウィンドウにも反映）
- 管理ウィンドウの状態同期（`getState` / `applyState`）に `brHpMultSlider` を追加

---

## v1.44.0 — 2026-05-18

### 👑 バトルロイヤル優勝ラベルを追加
- 優勝キャラの名前の左に虹色グロー「優勝」ラベルを表示（称号の左側に配置）
- `app.js`: `endBattleRoyale` で `winner.brWinner = true` をセット → `updateNameDisplay(winner)` 呼び出し
- `app.js`: `updateNameDisplay` に `brWinner` フラグ判定を追加し `title-tag-winner` を先頭に挿入
- `style.css`: `.title-tag-winner` — 金〜ピンク〜青〜緑の虹グラデーションが1.2秒でスクロール＋黄金グロー点滅アニメーション

---

## v1.43.0 — 2026-05-18

### 🔬 管理パネルにデバッグ機能を統合
- `public/admin.html`:
  - 「🔬 デバッグ」セクションを追加（`debug.html` の機能を内包）
  - キャラ追加: 名前・キャラ番号を入力してキャラをスポーン
  - コメント送信: ユーザー選択ドロップダウン + メッセージ textarea + 送信ボタン
  - **⚡ 全員ATK+**: 自由入力した値分、全キャラの ATK を加算（「強化」装備として付与・累積）
  - **🐾 全員ランダムペット**: 全キャラにペットガチャ結果を一括配布
  - **⚔️ 全員ランダム装備**: 全キャラにランダム装備を一括配布（同名装備は合成）
  - ユーザー一覧を3秒ごとに自動更新、デバッグログ表示
  - `/debug.html` へのリンクボタンを削除（管理パネルに統合済みのため）
- `app.js`: `_adminBC` ハンドラに以下を追加
  - `processComment` → `handleComment()` に転送
  - `getUsers` → アクティブユーザー一覧を返信
  - `addAtkAll` → 全キャラに「⚡強化」ATK装備を付与・再計算
  - `distributeRandomPets` → 全キャラに `rollPetGacha()` 結果を付与
  - `distributeRandomEquips` → 全キャラに `rollEquipValue(750)` + `EQUIP_POOL` からランダム装備を付与

---

## v1.42.0 — 2026-05-18

### ⚙️ 管理パネルを別ウィンドウで開けるように
- `public/admin.html` を新規作成 — モーダルと同じ全ボタン・スライダーを搭載
  - BroadcastChannel `'kukucome-admin'` でメインウィンドウと通信
  - 開いた瞬間にメインウィンドウから現在のスライダー値・BG色・移動エリアを取得して反映
  - 3秒ごとに ping/pong で接続確認（緑/赤ドット表示）
- `app.js`: `_adminBC` ハンドラを追加
  - `click` → 対象ボタンの `.click()` を実行
  - `slider` → `.value` をセットして `input` イベントを発火
  - `select` / `color` → 同様に `change` / `input` を発火
  - `getState` / `ping` → 現在の全スライダー値・BG色・移動エリアを返信
- `index.html`: 管理モーダルヘッダーに「🔗 別ウィンドウ」ボタンを追加
- `style.css`: `.btn-popout` スタイルを追加

---

## v1.41.0 — 2026-05-18

### 🔔 集合ボタンを多行対応
- `gatherCharacters`: 1行最大12体、13体目から次の行へ折り返す
- 各行ごとに横幅・gapを再計算してセンタリング
- 行間は10px、下から積み上げる形でY座標を配置

---

## v1.40.0 — 2026-05-18

### 🐛 集合・円形配置で画面外にキャラが出る問題を修正
- `clampToStage(u, x, y)` ヘルパー関数を追加
  - キャラ幅: `size × 1.5 × charSizeScale`、高さ: 幅 + 60px（名前ラベル + stats 分）
  - 右側に +30px、上側に +20px の余白を追加（名前ラベル・バブルのはみ出し対策）
  - 戻り値 `{x, y}` は必ずステージ内に収まる値
- `gatherCharacters`: `charW` に `charSizeScale` を追加。`clampToStage` でクランプ
- `gatherCharactersBottom`: `clampToStage` でクランプ
- `arrangeBRCircle`: インライン `Math.max/min` を `clampToStage` に置き換え

---

## v1.39.0 — 2026-05-18

### ⚔️ バトルロイヤル開始時に円形配置
- `arrangeBRCircle(participants)` を追加。`startBattleRoyale` 開始時に全参加者を円形に並べる
- 半径: `max(参加人数×30, min(横幅,縦幅)×38%)`（少人数は小さめ、多人数は画面いっぱい）
- 12時方向スタートで等間隔に配置。各キャラは0.7sのアニメーションで移動
- 移動タイマー（`moveTimer`/`walkTimer`）を一時クリアしてから位置をセット

---

## v1.38.0 — 2026-05-18

### ⚔️ バトルロイヤル演出・バランス強化
- **自動攻撃の加速**: BR開始時は1000ms間隔、5秒ごとに10ms短縮、最小100msまで加速
  - `brState.interval`で管理、`brState.escalateTimer`（`setInterval` 5000ms）で毎5秒更新
  - `brAutoAttack`は`brState.interval`をそのまま次のタイムアウトに使用
- **脱落時の中央バナー表示**: `showBREliminationBanner(user, rank)` を追加
  - ステージ中央に「💀 名前 / N位 脱落」を大きく表示（2.5秒後にフェードアウト）
  - `style.css`: `.br-elim-banner` / `.br-elim-name` / `.br-elim-rank` + アニメーションを追加
- **ダメージログ（右上トースト）**: 表示上限を6行 → 10行に変更

---

## v1.37.0 — 2026-05-18

### ⚔️ バトルロイヤル中の表示HPを仮想HPに切り替え
- `updateStatsDisplay`: BR中かつ参加者の場合、表示HPを`brState.hp[ipid]`/`brState.maxHp[ipid]`に切り替え
- `brAttack`: ダメージ処理後に`updateStatsDisplay(target)`を呼び出し、リアルタイムで仮想HPを反映
- `startBattleRoyale`: 開始時に全参加者の表示を仮想HPに一括更新
- `endBattleRoyale`: 終了後に`brState = null`となったあと全員の表示を元のHPに戻す

---

## v1.36.0 — 2026-05-18

### 🐛 バトルロイヤル終了しない問題を修正 + 仕様変更
- **ゴミ箱/爆破でキャラ削除時のBR残留バグ修正**
  - ゴミ箱にドラッグされたキャラがBR中に`brState.survivors`に残り続けゲームが終わらない問題を修正
  - `mouseup`ハンドラ（trash drop時）でBR survivorsからの除去と終了チェックを追加
  - 💣爆破ボタン（`spawnBloodBath`）でも`endBattleRoyale(null)`を呼び出してBRを強制終了するよう修正
- **仮想HP変更**: `calcMaxHp(user) × 1000` → `× 500` に変更
- **自動攻撃インターバル変更**: 3000ms固定 → 700〜1000msのランダム間隔（`setTimeout`再帰方式に変更）
- **30分ごとの自動BR開始機能を追加**
  - ステージに2体以上いる場合、30分おきに自動でバトルロイヤルを開始
  - ボスが起動中の場合は先に自動消去してから600ms後にBR開始
  - BR中または参加者不足の場合はスキップ

---

## v1.35.0 — 2026-05-18

### 👑 バトルロイヤルモード追加
- **管理パネル** `⚙️管理` → `👑 バトルロイヤル` ボタンを追加（`index.html`）
- **開始条件**: ボス戦中は不可、ステージに2体以上のキャラが必要
- **仮想HP**: 開始時に `calcMaxHp(user) × 1000` を各参加者の仮想HPとして設定（ダメージ計算式はボス戦と同一）
- **攻撃トリガー**: コメント投稿ごとにランダムな生存者を1体選んで攻撃。自動攻撃（3秒間隔）も並行実行
- **脱落ルール**: 仮想HPが0になったキャラはフライアウトアニメーションで脱落。最後の1体が優勝
- **トースト表示** (`#brToastContainer`): 攻撃ごとに「攻撃者 ⚔️ ターゲット −ダメージ」をトーストで表示。クリティカル時は金色。脱落時は「💀 名前 が脱落 N位」
- **優勝演出**: 花火・ハートシャワー・勝者バナー表示
- **再押しで中断**: ボタン再押しで即中断（優勝者なし終了）
- **ステージリセット連動**: `🗑 リセット` ボタン押下時に BR タイマーを確実にクリア
- **脱落者保護**: 脱落済みユーザーからのコメントは以降の処理をスキップ
- `app.js`: `brState`・`rushToChar`・`brAttack`・`brAutoAttack`・`brEliminate`・`endBattleRoyale`・`showBRToast`・`showBRWinBanner`・`startBattleRoyale` を追加
- `style.css`: `.btn-br`・`#brToastContainer`・`.br-toast`・`.br-start-banner`・`.br-win-banner` および関連アニメーションを追加

---

## v1.34.0 — 2026-05-18

### 🔬 デバッグウィンドウ通信方式をBroadcastChannelに変更
- `window.opener._debugAPI` 方式を廃止し、**BroadcastChannel**（`'kukucome-debug'`）経由の通信に全面切り替え
  - Chrome の `target="_blank"` デフォルト `noopener` による `window.opener=null` 問題を根本解決
- `app.js`: `_debugBC` を追加。`getUsers` メッセージでユーザー一覧を返信、`processComment` メッセージで `handleComment()` を呼び出し
- `debug.html`: `window.opener` 依存をすべて削除し `BroadcastChannel` に置き換え
  - ユーザーID生成を debug.html 内で完結（`Date.now() + random`）
  - 接続状態インジケーター（緑/赤ドット）を追加
- `index.html`: デバッグ画面リンクに `rel="opener"` を追加
- **バグ修正**: BroadcastChannel ハンドラで `processComment` と参照していたが、実際の関数名は `handleComment` であったため `Uncaught ReferenceError` が発生していた問題を修正
  - `window._debugAPI` の `processComment,` → `handleComment,` に変更
  - `_debugBC.onmessage` 内の `processComment(d.comment)` → `handleComment(d.comment)` に変更

---

## v1.33.0 — 2026-05-18

### 📖 ヘルプページ最新化
- `public/help/hico1w.io/index.html` を v1.32.0 相当に全面更新
- **機能解説** 更新・追加:
  - ボスバトル: 連続ヒット（4文字ごと1ヒット・0.2秒間隔）、反撃率設定可（デフォルト40%）、宝箱（20秒タイムアウト）の説明を追記
  - キャラ育成: EXPはボスなし・コンパクトモード中でも毎コメント付与される旨を明記
  - Wordle: 正解時の全画面バナー・効果音を追記
  - 早押し: 白（HP+10）・赤（四字熟語→ATK×1.5バフ）の2種類、頻度/速度スライダーを詳述
  - ダメージランキング: 通算（全ボス累計）に更新
  - 歩きモード（歩く/歩きゅ）の新機能カードを追加
- **ボスバトルコマンド** 更新: HP倍率スライダー（1〜100x）、連続ヒット、宝箱、反撃率設定を記載
- **ペットガチャ**: ドラムロール→レア度別効果音の説明を追記
- **ステータス確認**: ライブチャット投稿機能（APIキー入力時）を追記
- **その他設定**: 歩く/歩きゅコマンド（自動左右歩行、壁反転）を追加。名前コマンドにnames.txt・重複ブロックの説明を追加
- **組み合わせ例**: 歩くコマンドの例を追加
- ページヘッダーにバージョン番号 v1.32.0 を表示

---

## v1.32.0 — 2026-05-18

### 🔬 デバッグウィンドウ追加
- 管理パネル → 🔧システムに「🔬 デバッグ画面」ボタンを追加
- クリックで `debug.html` を別ウィンドウ（480×600）で開く（既に開いていればフォーカス）
- `public/debug.html` を新規作成。機能：
  - **👤 キャラ追加**: 名前・キャラ番号を指定してデバッグユーザーとして追加
  - **💬 コメント送信**: 既存ユーザーを選択してメッセージを送信。複数行入力で1行ずつ順番送信（300ms間隔）。Enter で送信、Shift+Enter で改行
  - **📋 ログ**: 送信履歴・エラーをリアルタイム表示
- `window._debugAPI` を `app.js` に追加し、`users` オブジェクトと `processComment` 関数を別ウィンドウから参照可能に

---

## v1.31.0 — 2026-05-18

### 💣 爆破ボタン追加
- ステージのゴミ箱の下に 💣 ボタンを設置
- 押すと全キャラが爆散：ランダム方向に吹き飛びアニメーション（回転＋縮小＋フェード）
- 各キャラ位置から血しぶきドロップを20〜40粒放射
- 画面全体に血痕（`blood-stain`）をランダム配置（キャラ数に比例）
- 画面全体が赤くフラッシュ（`#bloodFlashOverlay`）
- アニメーション完了後に全キャラ・全ユーザーデータを削除してステージリセット

---

## v1.30.0 — 2026-05-18

### 🔊 効果音追加
- **神話ドロップ（宝箱）**: `sound/tarabako/nc179911_パチンコ確定_脳汁プシャー！キュインキュイン！.wav` を再生
- **ペットガチャ**:
  - ガチャ開始時にドラムロール (`sound/petgatya/ドラムロール.mp3`) をループ再生
  - 「ペット獲得！」表示と同時にドラムロールを停止し、レア度別効果音を再生
    - ノーマル: `ちゃんちゃん♪1.mp3`
    - レア: `ジャン！.mp3`
    - エピック: `ジャジャーン.mp3`
    - 伝説: `きらきら輝く6.mp3`
    - 神話: `nc272529_当たりの効果音.mp3`
- サウンド定数 `SOUND_MYTH_DROP` / `SOUND_GACHA_*` を追加
- `petGachaDrumAudio` グローバル変数でドラムロール音声を保持・停止制御

---

## v1.29.0 — 2026-05-18

### ⚔️ ボス攻撃を多段ヒット化
- コメント文字数 4文字ごとに1ヒット（最低1ヒット）で連続攻撃するよう変更
- 合計ダメージは従来と同じ計算式を維持（ヒット数で均等分割、余りは最終ヒットに加算）
- ヒットごとに突進モーション・ダメージ表示・効果音・ボスフラッシュを実行
- ヒット間隔: 0.2秒
- MP回復・EXP付与・レベルアップ・反撃判定はコメント1回分として従来どおり
- `attackBoss(user, msgLen)` に文字数引数を追加。呼び出し2箇所に `message.length` を渡すよう変更
- ダメージ数値の z-index を 60 → 70 に変更し、ダメージランキングパネル（z-index:65）より手前に表示

---

## v1.28.0 — 2026-05-18

### 🌟 コメント毎に基礎 EXP +1
- ボスの有無・コンパクトモードに関わらず、コメント1回につき EXP +1 を付与
- `processComment` の先頭（`commentCount` 加算直後）でレベルアップ判定も実施
- ボス攻撃時の EXP 付与（ペット・称号倍率込み）は従来どおり別途加算

---

## v1.27.0 — 2026-05-18

### 📊 ステータス確認コマンド：API投稿追加
- `ステータス確認` コマンド実行時に、kukuLIVE コメント投稿 API へリクエストを送信するよう追加
- 投稿先: `https://live.erinn.biz/api/?category=comment&type=write&...`
- `postStatusComment(user)` 関数を追加（`showStatusModal` の直前に定義）
- 投稿内容: 名前・Lv・HP/MaxHP・MP・ATK・EXP・合計ダメージ・死亡回数・Wordle/早押し正解数・装備・ペット・アクティブ称号
- `apikey` が未設定の場合はリクエストをスキップ
- パラメータ: `category=comment`, `type=write`, `apikey`, `icon=0`, `comment` のみ（`hash=` / `anon=` は含まない）

---

## v1.26.0 — 2026-05-18

### ⚡ 早押し赤問題の正解判定修正・タイムアウト延長
- 赤問題（yojijukugo）の正解が判定されない問題を修正（`hayaoshiItems` 配列への白と同様の判定ロジックを確認・整備）
- 白・赤ともに問題の消滅タイムアウトを `15000ms` 固定 → `hayaoshiSpeed + 10000`ms に変更
  - 速度スライダーの値に連動し、テキストが画面上にある間は常に正解受付が有効に

---

## v1.24.0 — 2026-05-18

### 👤 名前割り当てロジック変更
- `icon_name` に「匿名」が含まれる場合 → names.txtからのランダム名をそのまま使用
- `icon_name` に「匿名」が含まれない場合 → `icon_name` の値をキャラ名に使用（手動変更済みの場合は除く）

---

## v1.25.0 — 2026-05-18

### ⚡ 早押し正解判定の修正
- 早押しチェックをコメント処理の最上部（AFK・コマンド・早期returnより前）に移動
- 複数問題が同時に流れている状態でも、どの問題に正解しても確実に判定されるよう修正

---

## v1.23.0 — 2026-05-18

### ⚡ 早押し演出改善
- 速度スライダーの上限を 20s → 60s に拡張
- `spawnNikoComment` が DOM 要素を返し `hayaoshiItems[].el` に保存するよう変更
- 正解時に流れている該当テキストを `scatterNikoComment(el)` で飛散させて消去
  - `commitStyles()` で現在位置を確定 → アニメーションキャンセル → scale拡大+上方向+回転+フェードアウト (0.45s)

---

## v1.22.0 — 2026-05-18

### 🎵 早押し・もじあて正解時の演出追加
- 早押し正解時：正解キーワードをキャラ上部にフロート表示（`showDamageNumber`）
- 白（回復）正解時：`sound/hayaosi/nc45952_回復音.wav` を再生
- 赤（攻撃強化）正解時：`sound/hayaosi/Onoma-Flash14-1(High).mp3` を再生
- もじあてゲーム正解時：`sound/hayaosi/nc45952_回復音.wav` を再生

---

## v1.21.0 — 2026-05-18

### ⚡ 早押し複数同時対応・正解効果の修正
- `hayaoshiStateWhite/Red`（単一オブジェクト）を `hayaoshiItems[]` 配列に刷新
- 自動起動スケジューラーから「アクティブなら跳ばす」チェックを削除。頻度に応じて複数が同時にステージを流れる
- 正解マッチングを `hayaoshiItems.find()` で配列全体から検索するよう変更。一致したアイテムだけ削除し回復/攻撃強化を付与
- 停止ボタン・コンパクトモードON時にも `hayaoshiItems` を全クリア

---

## v1.20.0 — 2026-05-18

### 🎲 キャラ名をnames.txtからランダム割り当て
- `public/text/names.txt` を起動時にフェッチし `namesPool` に格納
- `pickRandomName(excludeIpid)` ：既出名を除外してランダム選択、全使用済みの場合のみ重複を許容
- `getUser` の初期名を `pickRandomName()` に変更（`'匿名'` → poolからランダム）
- `icon_name` による名前上書きを廃止
- `名前:XXX` コマンド：重複名を指定した場合「XXXは既に使われています」と吹き出し表示してブロック
- `getUsedNames(excludeIpid)` ヘルパー追加

### 🎯 早押し問題をテキストファイルから取得
- 白（回復）早押し：`public/text/sinjakome.txt` からランダム1行
- 赤（攻撃強化）早押し：`public/text/yojijukugo.txt` からランダム1行
- 各ファイルが空の場合のみ `HAYAOSHI_FALLBACK` にフォールバック

### ⏱ 早押し頻度・速度スライダー追加
- 管理モーダル「⚡ 早押し演出」に「⏱ 頻度」「💨 速度」スライダーを追加
- 頻度 (1〜60s)：白は設定秒ごと、赤はその3倍間隔で自動起動。デフォルト5s
- 速度 (1〜20s)：問題テキストが流れるアニメーション duration。デフォルト8s
- `localStorage` に `hayaoshiFreq` / `hayaoshiSpeed` として保存・復元

---

## v1.19.0 — 2026-05-18

### 🎁 宝箱の自動消滅時間を短縮
- 開けられなかった場合の消滅タイマーを 120秒 → 20秒 に変更

---

## v1.18.0 — 2026-05-18

### 🎉 文字当て正解時の全員全回復演出
- 正解者バブル・花火・ハートシャワーに加え、600ms後に全員HP全回復
- 全員に「✨全回復」ダメージ数字フロート表示
- ステージ中央に「{正解者アバター} {正解者名} が正解！✨ 全員全回復 ✨」バナーを4秒間表示（`.wordle-win-banner`）

### 📊 ダメージランキングを通算に変更
- `spawnBoss` 時に `bossDamageMap` をリセットしないよう変更
- 全ボス討伐を通じた累積ダメージでランキングを更新

### ❤️ ボスHP倍率スライダー追加
- 管理モーダル「⚔️ ボス設定」に「❤️ HP倍率」スライダーを追加（1x〜100x、整数）
- `bossHpScale` グローバル変数で管理。`nextBossHp()` の計算時に乗算
- `localStorage` に `bossHpScale` として保存・復元

### ⚔️ キャラ攻撃モーションを半速化
- `rushToBoss` の突進アニメーション duration を2倍に変更
  - 前進: `0.12s` → `0.24s`、戻り: `0.22s` → `0.44s`
  - setTimeout タイミング: `120ms` → `240ms`、`220ms` → `440ms`

### 🏷 称号タグの省略を廃止
- `.title-tag` の `max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap` を削除
- `white-space: normal; word-break: break-all` に変更し、称号名を全文表示

---

## v1.17.0 — 2026-05-18

### 📦 コンパクトモード追加制限
- ボス召喚コマンド（`^ボス召喚`）を無効化
- ボス自動召喚（討伐後の次ボス自動スポーン）を無効化
- ペットガチャコマンド（`ペットガチャ`）を無効化
- ペットガチャ・ステータス確認コマンドはコンパクトモード中に使用すると「コンパクトモード中は使用できません」と吹き出し表示してブロック
- 名前クリックによるステータスモーダル表示は有効のまま
- `showDamageRanking` 冒頭でガード（ランキングパネルが表示されなくなる）

---

## v1.16.0 — 2026-05-18

### 🚶 歩くコマンド
- コメントに「歩く」または「歩きゅ」が含まれているとキャラが左右にランダムでゆっくり移動し続ける
- 移動速度を従来の半分に調整（duration: 4400〜8400ms）
- 左右の移動方向が切り替わるたびにキャラ画像を水平反転（`scaleX(-1/1)`）
- 歩行停止時に反転をリセット
- 縦方向への移動はなし（`top` は変更しない）
- 移動制限（`moveLocked`）中でも歩くコマンドは有効
- `scheduleWalk(user)`：次の移動距離・方向・時間をランダム決定し再帰的にスケジュール
- `startWalk(user)`：歩行開始。既存の `moveTimer` をキャンセルして歩行モードに移行
- `stopWalk(user)`：歩行停止。通常の `scheduleMove` に戻る
- `移動:止まれ` コマンドで歩行も同時に停止（`stopWalk` を呼出）
- `clearStage` リセット・ゴミ箱ドロップ時に `walkTimer` を確実にクリア

---

## v1.15.0 — 2026-05-18

### 📦 コンパクトモード
- 管理モーダル「🔧 システム」に「📦 コンパクト」トグルボタンを追加
- ON時に非表示・停止するもの:
  - CSS: アバター・ステータスバー・装備アイコン・レベルバッジ・ペットバッジ・吹き出し・早押しテロップ・早押しパネル・称号タグ
  - JS: ダメージランキングパネル・Wordleパネル・ボスキャラ（`bossState.el`）
  - 自動早押しタイマー停止
  - ミュート（`playLocalSound` を `compactMode` チェックでガード）
  - エフェクト停止（花火・紙吹雪・ハートシャワー・ダメージ数字・宝箱生成）
- `setCompactMode(on)` 関数で一括制御。ボタンラベル・スタイルも切替

### ⬇ 下集合ボタン
- 管理モーダル「🎮 ゲーム操作」に「⬇ 下集合」ボタンを追加
- `gatherCharactersBottom()`：全キャラをステージ下端に集合。重なり許容で画面外には出ない

---

## v1.14.0 — 2026-05-18

### 🚫 キャラ重複禁止
- `getUsedCharIds(excludeUser)` を追加：ステージ上の他ユーザーが使用中のキャラIDを取得
- 初回登場時（`ensureCharOnStage`）：未使用IDの中からランダム選択。全枠埋まっている場合のみ重複を許容
- `キャラN` コマンド・エイリアスコマンドで他ユーザー使用中のIDを指定した場合：「キャラNは他の人が使用中です」とバブル表示してブロック

---

## v1.13.0 — 2026-05-18

### ⚔️ 装備合成の上限撤廃
- 合成時の +10 キャップを廃止。+10 超えが可能に
- 新規加算式：`gain = max(1, floor(新装備value × 0.5))`（例: +10同士の合成 → +10+5=**+15**）
- 吹き出し表示に今回の加算分を `(+N)` で追記
- ボス討伐時・宝箱開封時の両合成処理を同様に変更

---

## v1.12.0 — 2026-05-18

### 🐾 ペット2枠目システム
- ペットガチャ20回到達で2枠目スロット（`user.pet2`）が解放
- 20回目以降は奇数回→1枠目、偶数回→2枠目に交互格納
- 2枠目解放時に特別バブル「🎉 ペット2枠目が解放！」と黄色ログ表示
- `renderPetBadge`：pet2 を `.char-pet2#p2-{ipid}` にレンダリング（左下に表示）
- `rushPetToBoss`：`elId` 引数を追加し pet/pet2 それぞれの要素を突進
- `applyPetAttack` → `applyOnePetAttack(user, pet, petElId, timeOffset)` にリファクタ。pet2 は800msオフセットで実行
- `calcMaxHp`：pet2 の tough ボーナスも加算
- `damageUser`：pet2 の guard/barrier 効果も適用
- ステータスモーダル：ペットブロックを pet/pet2 の2行表示に対応
- CSS：`.char-pet2`（左下 `left:-12px`）追加、レアリティグロー対応

### ⭐ 新称号
- **T101「二刀の獣使い」**：ペット2体同時所持 → ATK+3 EXP×1.2 クリ+5%

---

## v1.11.0 — 2026-05-17

### 📖 ヘルプページに称号一覧追加
- `help.html` に「⭐ 称号一覧（全100種）」セクションを追加
- カテゴリ別グループ行（コメント系・レベル系・戦闘系・生存系・装備ペット系・回復MP系・早押し系・Wordle系・宝箱系・EXP系・時間系・カスタマイズ系・ステータス系・強化討伐系・上位称号・伝説称号）
- 金色背景でT62/T70/T74/T80/T91〜T94を強調、レインボーでT99/T100を強調
- 解除条件・効果を全称号分記載

---

## v1.10.0 — 2026-05-17

### ⚡ 早押し演出 調整機能
- 管理モーダルに「⚡ 早押し演出」グループを追加
- 流れるコメントの文字サイズを 12〜100px でスライダー調整（デフォルト40px）
- 流れるコメントの透明度を 0〜100% でスライダー調整（デフォルト100%）
- `nikoFontSize` / `nikoOpacity` グローバルを追加し `spawnNikoComment` で `el.style` に適用
- 設定は localStorage に保存（`nikoFontSize` / `nikoOpacity`）

---

## v1.9.0 — 2026-05-17

### 📊 ステータスモーダル レイアウト変更
- モーダル幅を10%増加（`60vw/780px` → `66vw/858px`）
- 称号リストをモーダル右側の独立パネル（`.sm-title-panel`）に移動
- 左メインエリア（`.sm-main-panel`）に ステータス・ペット・装備を縦並び
- 右パネルは青系背景（`rgba(8,47,80,0.85)`）で称号数バッジ・表示中称号を表示
- `.sm-title-list` を `flex: 1` でパネル高さいっぱいにスクロール表示

---

## v1.8.0 — 2026-05-17

### ⚔️ ボス設定機能
- 管理モーダルに「⚔️ ボス設定」グループを追加
- ボス反撃確率を 0〜100% でスライダー調整（デフォルト40%、↺リセット付き）
- 設定は localStorage に保存（`bossCounterRate`）
- ボス攻撃力を可変式に変更: `5 + (bossCount - 1)`（ボス4体倒した状態で5体目はATK=9）
- `bossCounterRate` グローバル変数を追加し `attackBoss` の反撃判定に適用

---

## v1.7.0 — 2026-05-17

### 📐 サイズ調整機能
- 管理モーダルに「📐 サイズ調整」グループを追加
- キャラ全体サイズを 30〜300% でスライダー調整（↺リセットボタン付き）
- ボスサイズを 30〜300% でスライダー調整（出現中のボスにもリアルタイム反映）
- 設定は localStorage に保存されセッション間で保持
- `charSizeScale` / `bossSizeScale` グローバルを `applyAvatarStyle`, `renderPetBadge`, `spawnBoss` に適用

### 🛠 微調整
- 装備アイコン（`.char-equip-area`）を右に 2rem 移動（`right: calc(100% - 2rem)`）

---

## v1.6.0 — 2026-05-17

### ⭐ 称号システム（100種類）
- 100種類の称号を実装（T01〜T100）
- 条件を満たすと自動解放、名前の左にバッジ表示（最新の1つ）
- ステータス確認モーダルで全取得称号を閲覧可能
- 称号には固有ボーナス（ATK/HP/EXP倍率/ダメージ倍率/クリ率/被ダメ軽減）
- 時間帯・曜日称号はサーバー時刻（`/api/time`）で判定
- 解放演出: キャラ上部にポップアップ + SYSTEMログ

### 🏷 称号カテゴリ
- **入門系**（T01〜T10）: コメント数・レベル到達
- **戦闘系**（T11〜T20, T66〜T70）: ボス討伐・コンボ・ダメージ
- **サバイバル系**（T21〜T25）: 死亡回数・低HP生存
- **装備・ペット系**（T26〜T32）: 装備数・ペットレアリティ
- **支援系**（T33〜T35）: 回復コマンド・MP満タン
- **早押し系**（T36〜T40）: 白/赤ストリーム正解数
- **Wordle系**（T41〜T43）: Wordle正解数
- **宝箱系**（T44〜T46）: 宝箱開封数
- **EXP系**（T47〜T49）: 総EXP量
- **時間帯系**（T50〜T57）: 深夜/早朝/昼/夜/土日/平日
- **行動系**（T58〜T60）: 命名・デコ・移動変更
- **複合系**（T61〜T65）: バランス装備・完全体・ATK/HP基準
- **マイルストーン系**（T71〜T80）: 大量コメント・合計ダメ・不敗
- **超高難易度**（T91〜T100）: 天下無双・百戦の覇者・神

### 🔧 技術仕様
- `getUser`: `titles[]`, `activeTitle`, `tc{}` フィールド追加
- `calcAtk` / `calcMaxHp`: 称号フラットボーナス適用
- `attackBoss`: 称号 dmgM・crit 倍率適用、expM によるEXP倍率
- `damageUser`: 称号 red（被ダメ軽減率）適用、T80 特殊スキル（5%回避）
- `updateNameDisplay`: activeTitle の称号バッジを名前左に表示
- `showStatusModal`: 称号一覧セクション追加（スクロール対応）
- `tc` カウンター: bossParticipations, bossKills, healCount, comboTriggers, treasureOpens, whiteHayaoshi, redHayaoshi, moveChanges, mpFull, petGachas, lowHpSurvive, longComment
- `server.js`: `/api/time` エンドポイント追加（hour, day）
- サーバー時刻は5分ごとに自動更新（`serverTimePoll`）

---

## v1.0.0 — 2026-05-17 Initial Release

### 🎮 基本システム
- kukuLIVE コメントビジュアライザー 初回リリース
- OBS Browser Source 対応（推奨サイズ 1280×720）
- Express サーバー（ポート 3000）でローカル動作
- APIキー・ハッシュ設定、コメント自動ポーリング

### 👥 キャラクターシステム
- コメントした視聴者が自動でキャラとして出現（最大500枠）
- 各キャラに画像・絵文字・名前・吹き出しを表示
- キャラスロット（キャラ1〜500）に画像を手動割り当て可能
- エイリアス設定（ipidに名前を紐付け）
- ランダム初期化コマンド（ランダム初期化）
- 全員集合コマンド（集合）
- 移動制限モード（🔒ボタン）
- 移動エリア選択（全体 / 左 / 右）

### 💬 コメント・吹き出し
- 吹き出しシェイプ：丸・四角・雲・棘・ハート・考え中・叫び（7種）
- テキストカラー：15色対応（色:〇〇 コマンド）
- フォント変更コマンド（フォント:〇〇）— 12書体対応
- 文字装飾：飾り:光る / 飾り:影 / 飾り:虹
- 文字サイズ：大きさ:小 / 大きさ:中 / 大きさ:大
- アニメーション：はずむ / ゆれる / ぐるぐる / ふよふよ
- エフェクト：花火 / 紙吹雪 / 流れ星 / ハートシャワー
- 初コメ（flag_first）で太字＋振動演出
- お絵描き / スクリーンショット / ボイス / エモーション コメント自動対応

### 🐉 ボスバトルシステム
- ボス召喚コマンドでボス出現（HP 100〜2000）
- HP量によってボスのサイズが変化（100→小、2000→超巨大）
- 全コメントがボスへの攻撃になる
- 20%確率でボスが全キャラに反撃（5ダメージ）
- ランダムなボスセリフ表示
- ボス撃破で全員HP+20回復＋装備ランダム配布
- 💀ボス消去ボタン（管理者用）

### ⭐ レベル・EXP システム
- コメントごとにEXP+1（最大Lv.10 / 合計150コメント）
- Lv up 閾値：3 / 10 / 22 / 40 / 65 / 90 / 115 / 133 / 150
- ATK = 1 + レベル + 装備ボーナス
- レベルアップ時にバナー演出＋効果音

### ⚔️ 装備システム
- ボス撃破で全キャラにランダム装備1個配布
- 同種が当たると合成（上限+10）
- ATK系：剣⚔️・指輪💍・杖🪄・弓🏹
- HP系：盾🛡️・兜⛑️・鎧🔰・首飾り📿
- レアリティ5段階（ノーマル〜神話）、ボスHPが高いほど高レア出やすい

### 📊 キャラステータス
- HP：基本30 + HP系装備ボーナス
- MP：基本10、最大20、攻撃で+1（死亡しても保持）
- ATK：1 + レベル + ATK系装備ボーナス
- クリティカル：基本15%確率でダメージ×2〜4倍
- 死亡時HP30で復活（装備は保持・MP保持・EXP保持）

### 💊 回復コマンド
- 「回復」でMP2消費し全キャラHP+2回復
- ステータス確認（ステータス確認）で5秒間ステータス表示

### 🐾 ペットシステム
- 「ペットガチャ」コマンドでMP10消費してペットを抽選
- レアリティ5段階 / 30種類の能力
  - ノーマル 50%（8種）、レア 25%（8種）、エピック 15%（7種）、伝説 5%（4種）、神話 5%（3種）
- ペットはキャラ右下にアイコン表示
- ペット能力例：回復ペット・幸運・バーサーク・不死鳥・ドレイン など

### 📝 Wordleゲーム
- 「Wordle」コマンドで開始、「ストップ」で終了
- 視聴者が5文字の単語を推測
- 正解で全員HP+30＆装備配布

### ⚡ 早押しクイズ
- 「早押し」コマンドで開始
- 最初の回答者が「正解」コマンドで判定
- 自動延長：15秒後に延長、20秒ごとに繰り返し

### 🏆 ダメージランキング
- ドラッグ可能なランキングパネル表示
- 上位5名を常時表示

### 🔊 バトルサウンド
- 先頭コマンドサウンド（sound/sentou/ フォルダ）
- ドラッグ音（sound/drag/ フォルダ）
- ファイルを置くだけで自動認識

### 🖼 背景カスタマイズ
- BG色変更（カラーピッカー）
- BG画像アップロード（20MB上限）
- BG削除ボタン

### 🛠 管理UI
- ▶開始 / ■停止 / 💬ログ / 🖼キャラ画像 / 🔔集合 / 💀ボス消去
- 🔒移動制限 / 📝Wordle / ⚡早押し / 🐛DEBUG / ⏹全停止 / 🗑リセット
- 📋OBS URL コピー / ❓コマンド一覧

---

## v1.1.0 — 2026-05-17

### 🐾 ペット表示サイズ 1.5倍
- `renderPetBadge` のサイズ計算を変更
  - 変更前：`Math.max(20, Math.round(user.size * 0.5))`
  - 変更後：`Math.max(30, Math.round(user.size * 0.75))`

### 💥 ダメージ数字 3倍サイズ
- `showDamageNumber` のフォントサイズを3倍に拡大
  - 変更前：最大58px
  - 変更後：最大174px

### 🎰 ペットガチャ演出にキャラ名表示
- ガチャスピン中のオーバーレイに「👤 キャラ名」を追加表示

### 📖 help.html 全面リニューアル
- 全機能・仕様・コマンドを網羅的に記載
- ペットガチャ排出確率カード（レアリティ別）を追加
- 全30種ペット能力テーブルを追加
- ボスHP別装備排出確率テーブルを追加
- 全UIボタンの説明を追加
- MP視覚バー表示を追加
- 誤記修正：回復量 HP+15 → HP+2、ボスHP上限 1500 → 2000

### 🌐 独立ヘルプページ新設（public/help/）
- `public/help/index.html` を新規作成（外部公開向けスタンドアロン版）
- `public/help/chara/` に全キャラ画像（90枚）をコピー
- サーバー・localStorage 不要で単体動作

### 🖼 キャラ一覧グリッド追加（ヘルプページ）
- ヘルプページにキャラ画像一覧セクションを追加（90枚）
- 画像が存在しないカードは自動非表示（onerror）

### 🏷 キャラN名をヘルプページに表示
- `server.js` に `/api/char-images` エンドポイントを追加（GET/POST）
- `data/charImages.json` にキャラスロット割り当てを永続保存
- `saveCharImages()` 実行時にサーバーへ自動同期
- アプリ起動時に localStorage → サーバーへ初回同期
- ヘルプページのキャラ一覧にキャラ1〜Nのスロット名をテキスト表示（静的埋め込み）

---

## v1.2.0 — 2026-05-17

### 📊 ステータス確認画面 コンパクト化
- HP・MP・ATK・EXPなどのステータス項目を縦並び→横並びに変更（`HP: 10/30  MP: 10  ATK: 3` スタイル）
- ラベルに `:` を自動付与（CSS `::after`）

### ⚔️ 装備表示 4列グリッド化
- 装備一覧を縦リスト→4列グリッドに変更
- 各装備セルをアイコン（大）・ステータス・装備名の縦積みコンパクト表示に変更

### 💥 ダメージ数字 ランダム位置表示
- ダメージ表示位置に横±30px・縦±15pxのランダムオフセットを追加
- 同タイミングの複数ダメージが重なりにくくなった

### ⏱ ダメージ表示時間 1.5倍
- アニメーション時間を 1.7s → 2.55s に延長

## v1.3.0 — 2026-05-17

### 🐉 ボスHP 200ずつ増加（フィボナッチ廃止）
- 初回HP 100 → 以降 300, 500, 700 … と200ずつ増加

### 🐉 ボスHP 3000超えでランダムサイズ
- HP > 3000 のボスはキャラの1〜4倍の範囲でランダムなサイズで出現

### 🐉 ボスHPバー改善
- HPの数値をHPバーの中央に重ねて表示
- HPバーの最大幅を画面幅の60%に制限

### 💤 AFKコマンド追加
- コメントに「AFK」を含むと 💤 AFK バッジをキャラ上に表示し続ける
- 次のコメント時にバッジを自動解除

### 💊 MP 20以上で自動回復
- ボス攻撃でMPが20に達すると自動で回復を発動（MP-2、全員HP+2）

### ⚡ 早押し機能強化
- 正解時に **次のボス攻撃ダメージ×1.5** のバフを付与
- 流れる文字を赤文字・赤グロー表示に変更
- 自動出題間隔を固定20秒→15〜20秒ランダムに変更

### 📊 ステータス確認 ペット情報右寄せ
- ペットブロックをモーダル内で右寄せ表示に変更

---

### 🐉 ボスHPフィボナッチ数列化
- ボスHPのランダム生成を廃止
- 初戦HP100から開始し、倒されるたびに前の2つのHPを足したHPで次のボスが出現
  - 例：100 → 200 → 300 → 500 → 800 → 1300 → 2100…
- ボス召喚コマンドで `:数値` を指定した場合は数値を優先（数列はその際も進む）

### 📊 キャラ下ステータスにEXP表示追加
- HP・MP・ATKの右に `EXP:N`（次のレベルアップまでの必要経験値）を追加表示
- Lv.10 の場合は `EXP:MAX` と表示

### ⚙️ 管理パネルモーダル化
- 設定バーのボタン類をすべて「⚙️ 管理」ボタン1つにまとめ
- 管理ボタンを押すとモーダルが開き、4グループで全ボタンを表示
  - 📺 表示：💬ログ / 🖼キャラ画像 / 📋OBS URL / ❓コマンド
  - 🎮 ゲーム操作：🔔集合 / 💀ボス消去 / 🔒移動制限 / 📝Wordle / ⚡早押し
  - 🖼 背景・エリア：BG色 / BG画像 / ✕BG / 移動エリア選択
  - 🔧 システム：⏹全停止 / 🗑リセット / 🐛DEBUG

### 🐉 ボスUI レイアウト変更
- BOSS文字・HP数値・HPバーをボス画像の**上**に移動（従来は画像の下）
- ボスのセリフ吹き出しをボス画像に**重ねて**配置・やや左寄り（従来は画像の下）

---

## v1.4.0 — 2026-05-17

### ⚡ 早押し 2ストリーム化
- 白文字ストリームと赤文字ストリームを独立して同時に流す
  - **白（💊回復）**: 3秒ごとに流れる。正解でHP+10回復
  - **赤（⚡攻撃強化）**: 15秒ごとに流れる。正解で次の攻撃ダメージ×1.5
- 両方の流れ文字が同時・独立してステージを流れる
- 流れる縦位置はそれぞれランダム（ステージ高さの10〜85%）
- 白文字用CSSクラス `.niko-hayaoshi-white` を追加

### 🔥 攻撃強化バフ中の炎エフェクト
- 赤文字早押しを正解して×1.5バフが付いているキャラに炎エフェクト表示
- CSSアニメーション `.char-burning`：オレンジ〜赤のグロー点滅（0.4秒周期）
- バフ消費（攻撃）と同時にエフェクト解除

### 🐉 ボス反撃頻度2倍
- 反撃発生確率を 20% → 40% に変更

### 💤 AFK時の防御・演出改善
- AFK中はボスの反撃ダメージを完全無効化（`damageUser` で早期 return）
- AFK中キャラを薄暗く表示（opacity 0.45 + grayscale + brightness 0.55）
- 次のコメントで通常状態に戻る

### 📝 Wordle 表示行数を10行に拡大
- `DISPLAY_ROWS` を 4 → 10 に変更（直近10回分の推測を表示）

### 🎨 文字色から白・灰を削除
- 背景に同化して視認できないため `COLOR_NAMES` から `白`・`灰` を削除
- help.html（全4ファイル）の色一覧からも該当行を削除

---

## v1.5.0 — 2026-05-17

### 🔥 コンボ攻撃システム
- 2人以上が同じワードを5秒以内にコメントするとコンボ発動
- コンボ数に応じてダメージ倍率アップ（2コンボ=×1.5、3コンボ=×2.0…）
- 発動時に大きな「N COMBO!!」テキストをステージ中央に表示（オレンジグロー）
- 全コンボ参加者がボスに同時連撃＋花火演出
- コマンド系のコメントはコンボ対象外（display テキストのみ対象）

### 🐛 ボスHP0で消えないバグ修正
- **ペット多段ヒット**: 最終ヒット以外でHP0になっても`defeatBoss`が呼ばれないケースを修正。どのヒットでもHP0になった瞬間に`defeatBoss`を呼ぶよう変更
- **毒（poison）/炎（burn）setInterval**: ダメージでHP0になっても`defeatBoss`が未呼出だったのを修正。HP0検出時にインターバルをクリアして`defeatBoss`を呼ぶよう変更

### 🐉 ボスラベルに撃破数表示
- ボスのBOSSラベルを「N BOSS」形式に変更（初回: 1 BOSS、2体目: 2 BOSS…）
- `bossCount` 変数で管理し、撃破のたびにインクリメント

### 🎁 宝箱システム
- 5分ごとにランダムな位置に宝箱🎁が出現（ふよふよ浮遊＋金色グロー）
- 最初に「開ける」とコメントした人がゲット
  - レア以上（value 5〜10）の装備を確定ドロップ
  - HP +30 回復
- 開封演出：白フラッシュ → 花火20発 → 紙吹雪 → ハートシャワー3連 → 「💎 お宝ゲット！！」オーバーレイ
- 宝箱は2分間誰も開けなければ自然消滅
- 配信停止時に宝箱は自動撤去