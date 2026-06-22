# kukuCome パッチノート

---

## v2.764.0 — 2026-06-22

### feat: コメントログパネルの位置・サイズ・背景透明度を admin から設定可能に

- **admin.html** 表示セクション内にコメントログ設定スライダーを追加
  - 横幅（100〜600px、デフォルト300）
  - 縦幅（100〜800px、デフォルト265）
  - 右端からの位置（-500〜1200px、デフォルト10）
  - 下端からの位置（-500〜1200px、デフォルト10）
  - 背景透明度（0〜100%、デフォルト92）
- **`app-07-ui-stage-ai.js`**：`logWidth/Height/PosRight/PosBottom/BgOpacity` 変数（localStorage初期化）と `_applyCommentLogStyle()` 追加、起動時に即適用
- **`app-13-race-admin-misc.js`**：各キーの handleAdminMessage ハンドラー追加、state スナップショットに追加
- **`admin.html`**：設定復元コードに logWidth/Height/PosRight/PosBottom/BgOpacity を追加

---

## v2.763.0 — 2026-06-22

### feat: 配信サマリー設定改修（admin.html）

- **コメント総評を閉じるボタン**を admin.html に追加（ボタン名「✖ 総評を閉じる」、`cmd('streamReviewClose')` → `#streamReviewModal` を削除）
- モーダル内の閉じるボタン（`.sr-close`）を削除。背景クリックによる閉じる動作は引き続き有効
- **黒板の幅・高さ・位置**を admin から調整できるスライダーを追加
  - `reviewBoardWidth`（300〜1400px、デフォルト760）
  - `reviewBoardMaxHeight`（20〜98vh、デフォルト88）
  - `reviewBoardOffsetX` 左右オフセット（-800〜800px、デフォルト0）
  - `reviewBoardOffsetY` 上下オフセット（-500〜500px、デフォルト0）
- **`app-14-stream-physics.js`**：`reviewBoardWidth/MaxHeight/OffsetX/Y` グローバル変数追加、`_applyReviewBoardStyle()` 関数追加、`_showReviewModal` で呼び出し
- **`app-13-race-admin-misc.js`**：`streamReviewClose` ボタンディスパッチ追加、黒板設定の state 同期・`handleAdminMessage` ハンドラー追加
- **`admin.html`**：黒板スライダー UI 追加、設定復元コード追加

---

## v2.762.0 — 2026-06-22

### feat: コメント総評のシステムプロンプトを admin から編集可能に

- 設定 `reviewSystem` を追加。admin の配信サマリーに総評プロンプトのテキストエリアを追加（空欄ならデフォルトを使用）
- デフォルトプロンプトを定数 `REVIEW_DEFAULT_SYSTEM` として明示（先生口調・300文字程度の講評）。プレースホルダにもデフォルト文を表示
- **`app-14-stream-physics.js`**（`reviewSystem`／`REVIEW_DEFAULT_SYSTEM`、`_streamReview` で使用）／**`app-13-race-admin-misc.js`**（受信＋state同期）／**`app-01-core-characters.js`**（SETTINGS_KEYS）／**`admin.html`**（テキストエリア・復元）を更新

---

## v2.761.0 — 2026-06-22

### change: 総評モーダル — 文字とキャラの重なりを許可＋位置調整幅を3倍に

- 本文の右パディング（キャラ回避）を撤去し、**文字がキャラに重なってもOK**（本文は全幅使用）。キャラは `pointer-events:none` で前面に重なる
- 講師キャラの位置スライダー（右/下）の範囲を約3倍に拡大：`-50〜400px` → **`-150〜1200px`**
- **`app-14-stream-physics.js`**（パディング処理撤去）／**`style.css`**（`.sr-text` の padding-right 削除）／**`admin.html`**（スライダー範囲拡大）を更新

---

## v2.760.0 — 2026-06-22

### feat: 総評モーダルの講師キャラの大きさ・位置を admin から調整可能に

- 設定 `reviewCharSize`（大きさ、既定160px）/`reviewCharRight`（右からの位置、既定14px）/`reviewCharBottom`（下からの位置、既定12px）を追加。admin の配信サマリーにスライダーを3本追加（負の値も可で画面外寄せも可能）
- **モーダル表示中はスライダー操作でリアルタイム反映**（`_applyReviewCharStyle()`）。キャラ幅に合わせて本文の右パディングも自動調整
- **`app-14-stream-physics.js`**（設定＋`_applyReviewCharStyle`）／**`app-13-race-admin-misc.js`**（受信＋ライブ反映＋state同期）／**`app-01-core-characters.js`**（SETTINGS_KEYS）／**`admin.html`**（UI・復元）を更新

---

## v2.759.0 — 2026-06-22

### feat: コメント総評ボタンを追加（Ollamaで配信を総評、黒板モーダル表示）

- admin の配信サマリーに「📋 コメント総評」ボタンを追加。現在の全コメント（直近を上限4000文字まで）＋集計を Ollama に送り、先生（講師）口調で**今日の配信を総評**する
- 総評は**黒板風モーダル**（濃緑〜黒のチョーク質感＋木枠、白チョーク文字）で表示。**右下に講師キャラ画像**（`/souhyou/kousi.png`）を配置。✖ボタン／背景クリックで閉じる
- **`app-14-stream-physics.js`**: `_streamReview()`（コメント収集→Ollama送信→表示）と `_showReviewModal()` を追加
- **`app-13-race-admin-misc.js`**: `streamReviewBtn` のディスパッチを追加
- **`admin.html`**: 「📋 コメント総評」ボタンを追加
- **`style.css`**: `.stream-review-modal`（黒板風）一式を追加

---

## v2.758.0 — 2026-06-22

### fix: エンドカードの自動スクロールが動かない/止まって見える問題を修正

- 自動スクロールが `el.scrollTop += 0.5` だったため、ブラウザによっては scrollTop が整数に丸められて加算が消え、**まったく動かない**ことがあった。**浮動小数のアキュムレータ**で位置を累積し `el.scrollTop = pos` で反映するよう変更（丸めで止まらない）。速度も 0.5→0.7px/フレームに微増して視認しやすくした
- ※コメント/名場面が枠の高さを超えていないとき（件数が少ないとき）はスクロールしない（仕様）
- **`app-14-stream-physics.js`** を更新

---

## v2.757.0 — 2026-06-22

### change: エンドカードの背景を「きらめく星空」にリッチ化

- 背景を淡いピンク→紫の多段グラデーションに変更し、**瞬く星**（`::before`、opacityパルス）と**下から漂い上がるキラキラ粒子**（`::after`、ゆっくり上昇）のレイヤーを重ねた
- 本文は `.ec-inner > * { z-index:1 }` で星空レイヤーの上に表示。CSSのみ（JSなし）で実装
- **`style.css`**: `.ec-inner` の背景グラデ更新、`::before`/`::after` の星・粒子レイヤーと `_ecTwinkle`/`_ecSparkleUp` アニメーションを追加

---

## v2.756.0 — 2026-06-22

### change: エンドカードの立ち絵をオーバーレイ表示で最大化＋効果音音量をadminから調整

- 部門MVPのスライドを、**立ち絵をスライド全面に大きく表示**し、その上に情報を重ねるレイアウトに変更：
  - 部門アイコン（絵文字）を**右上**に配置
  - 名前・部門名・記録を**左下**に配置（半透明の影付きで視認性確保）
  - 立ち絵は枠いっぱいまで拡大（フレームサイズは不変）
- **効果音音量**: 設定 `endCardVolume`（0〜100、既定80）を追加。admin の配信サマリーに「効果音 音量」スライダーを追加し、「ジャン！」の音量を調整可能に
- **`app-14-stream-physics.js`**（スライド構造・音量適用）／**`style.css`**（オーバーレイ配置）／**`app-13-race-admin-misc.js`**・**`app-01-core-characters.js`**・**`admin.html`**（音量設定の配線・UI）を更新

---

## v2.755.0 — 2026-06-22

### change: エンドカードの閉じるボタンを廃止＋立ち絵をスライド枠いっぱいに拡大

- カード内の「閉じる」ボタンを削除（閉じるのは admin の「✖ エンドカードを閉じる」から）
- 部門MVPの立ち絵を、フレームサイズは変えずに**スライド枠いっぱいまで拡大**。スライドカードを縦フレックスにして立ち絵を `flex:1` で残り高さいっぱいに広げ、画像は `max-width/height:100%` でスケール
- **`app-14-stream-physics.js`**（閉じるボタン削除）／**`style.css`**（立ち絵拡大）を更新

---

## v2.754.0 — 2026-06-22

### fix: エンドカードの各部門MVPを1行2個に（縦のはみ出し・重なりを解消）

- 各部門MVPランキングを縦1列（6行）→ **1行2個の2列グリッド**（3行）に変更し、本文の高さをはみ出して要素が重なる問題を解消
- **`style.css`**: `.ec-ranklist` を `display:grid; grid-template-columns:1fr 1fr; align-content:center; overflow:hidden` に変更。`.ec-rank-item` はアイコンを2行ぶち抜き＋ラベル/名前を `text-overflow:ellipsis` にして狭いセルでも崩れないよう調整

---

## v2.753.0 — 2026-06-22

### fix: エンドカードの「カード縦幅」設定が効くように修正＋下部の見切れ解消

- **カード縦幅設定を復活**: 前版で自動サイズ化した際に縦幅設定が反映されなくなっていたのを修正。admin の「カード縦幅」(`endCardHeight`、既定640px・360〜1200px）でカード全体の高さを指定できるようにした（画面より大きい場合は `min(指定px, 96vh)` で自動縮小し、画面外にはみ出さない）
- **見切れ解消**: 本文（スライド）とコメント/名場面リストを `flex` で残り高さを分け合う伸縮レイアウトに変更（body:lists = 2:1）。スライドの固定 `min-height` を撤去し、**閉じるボタンが常に見える**ようにした
- **コメント/名場面は枠内で自動スクロール**: リスト枠の高さが確定するため、コメントが多いと枠内を自動スクロール（末尾で少し待って先頭へループ）する挙動が正しく働く
- **`app-14-stream-physics.js`** / **`style.css`** / **`app-13-race-admin-misc.js`** / **`admin.html`** を更新

---

## v2.752.0 — 2026-06-22

### fix: エンドカードの下部が見切れる問題を修正（中身に合わせて自動サイズ化）

- **原因**: カードを固定縦幅にして内側を `overflow:hidden` でクリップしていたため、高さが足りないとコメント欄・閉じるボタンなど下部が見切れていた
- **対応**: カード全体を**中身に合わせて自動サイズ**（`height:auto` ＋ `max-height:96vh` で画面内に必ず収まる）に変更。スライド領域とコメント/名場面リストの高さをビューポート連動（`min(指定px, 38〜40vh)`）にして、スクロールしなくても全体が表示されるようにした
- **設定変更**: 「カード縦幅」を「**リスト高さ**」に変更（コメント/名場面欄の高さを指定。既定240px・100〜600px）。カード全体の高さは自動。横幅 `endCardWidth` は従来どおり
- **`app-14-stream-physics.js`** / **`style.css`** / **`app-13-race-admin-misc.js`** / **`admin.html`** を更新

---

## v2.751.0 — 2026-06-22

### change: 会話モードBGMを bgm フォルダ内からランダム再生に変更

- 会話モードのBGMを固定の `ageru/oto/bgm.mp3` から、**`ageru/oto/bgm/` フォルダ内のファイルをランダム再生**に変更。再生開始時とループ（曲の終了）時に次の曲をランダムに選ぶ。**再生/一時停止/停止のフェード制御ロジックは従来のまま**（一時停止からの再開は同じ曲を継続）
- **`server.js`**: `GET /api/ageru-bgm`（`public/ageru/oto/bgm/` 内の音声ファイル一覧）を追加
- **`app-11-agru-state-sd.js`**: 起動時に一覧を取得して `_agruBgmTracks` に保持。`_agruBgmPickRandom()` を追加し、`_agruBgmFadeIn`（新規再生時 `currentTime===0` のみ）と `ended`（ループ時）で選曲。一覧未取得時は従来の `bgm.mp3` にフォールバック

---

## v2.750.0 — 2026-06-22

### feat: エンドカードにサイズ指定・今日のコメント一覧・自動スクロールを追加

- **サイズ指定**: admin の配信サマリーに「カード横幅（400〜1600px）」「カード縦幅（300〜1200px）」スライダーを追加。設定 `endCardWidth`/`endCardHeight`（既定880/600）でエンドカードの表示サイズを変更できる
- **今日のコメント一覧**: 配信中の全コメントを `recordStreamComment` で蓄積（最大3000件、名前付き）し、エンドカードに「💬 今日のコメント」一覧として表示。**上から下へ自動スクロール**し、末尾まで行くと少し待って先頭へループ
- **名場面も自動スクロール**: 名場面リストも全件表示＋自動スクロールに変更（従来は8件表示・固定）。コメント一覧と名場面を左右2カラムで並べ、カードの残り高さいっぱいに広げて内部スクロール
- **`app-14-stream-physics.js`**: `_streamComments`/`recordStreamComment`、`endCardWidth`/`endCardHeight`、自動スクロール `_ecAutoScroll`（停止関数を `_ecScrollers` で管理し閉じる時に解除）を追加。`_showEndCard` を2カラム＋サイズ反映に刷新
- **`app-06-comment-handler.js`**: 通常コメントで `recordStreamComment` を呼ぶ
- **`style.css`**: `.ec-frame`/`.ec-inner` を可変サイズのフレックス縦並びにし、`.ec-lists`/`.ec-comments` 等の2カラム・自動スクロール用スタイルを追加
- **`app-13-race-admin-misc.js`** / **`app-01-core-characters.js`** / **`admin.html`**: 設定の受信・state同期・`SETTINGS_KEYS`・UI を追加

---

## v2.749.0 — 2026-06-22

### fix: コメント物理オブジェクトの z-index がモーダルより背面に行かない問題を修正

- **原因**: コメント物理オブジェクトを `#stage` 内に追加していたが、`#stage` は `position: fixed` で**独自のスタッキングコンテキスト**を作るため、子要素の z-index は `#stage` 内でしか比較されず、body直下にある YouTube再生モーダル・会話モーダルとは重なり順を比較できなかった（マイナス指定しても背面に回らない）
- **対応**: コメント物理オブジェクトを **`document.body` 直下**に配置（`position: fixed`）するよう変更。物理演算の座標は従来どおり stage 基準のまま、描画時に `stage.getBoundingClientRect()` のオフセットを加えてビューポート配置する。これで `commentPhysZ` がモーダルと同じルート文脈で評価され、**値を下げればモーダルの背面、上げれば前面**に出せるようになった
- **`app-14-stream-physics.js`**: `spawnCommentPhys`／`_cphysStep` の配置先と座標変換を変更。**`style.css`**: `.comment-phys` を `position: absolute` → `fixed` に変更

---

## v2.748.0 — 2026-06-22

### change: コメント物理オブジェクトの z-index をマイナス指定可能に

- admin の「重なり順 z」スライダーの下限を 0 → **-1000** に拡張（マイナスにするとキャラクター等より背面に表示できる）
- **`app-13-race-admin-misc.js`**: 受信処理を `parseInt(d.value) || 65` から `Number.isFinite` 判定に変更し、**0 やマイナス値がフォールバック(65)で潰れない**よう修正

---

## v2.747.0 — 2026-06-22

### change: エンドカードの見た目調整（虹色廃止・横長化・立ち絵拡大）＋効果音＋admin閉じるボタン

- **虹色の点滅を廃止**: フレームの回転コニックグラデーション＋`hue-rotate` アニメ（全体が7色に変化して目が痛い）をやめ、淡い静的グラデーション縁取りに変更
- **横長化＆立ち絵拡大**: カード幅を `min(560px)` → `min(880px)`、スライド領域を 200→360px・最小高 230→340px、立ち絵枠 130→240px・画像最大 120→230px に拡大
- **効果音**: 部門MVPキャラが表示されるたびに `/sound/endcard/nc201523_【効果音】ジャン！（短）.mp3` を再生（`_ecPlayJan`、Audioを使い回し）
- **admin に閉じるボタン**: 「✖ エンドカードを閉じる」を追加。グローバル `closeEndCard()`（タイマー解除＋カード除去）を新設し、カード内の閉じるボタンと `cmd('streamEndCardClose')` の両方から利用
- **`app-14-stream-physics.js`** / **`style.css`** / **`app-13-race-admin-misc.js`** / **`admin.html`** を更新

---

## v2.746.0 — 2026-06-22

### change: コメント物理オブジェクトを吹き出しスタイル反映＋最大500＋z-index設定対応

- **吹き出しスタイル反映**: 物理オブジェクトを「外側＝物理位置／内側＝吹き出し見た目」の2層構造に変更。内側にコメント主の**吹き出し形状（`bubble-*`）・装飾（`bubble-deco-*`）・文字色・フォント・背景色**を反映して落下させるようにした
  - **`app-14-stream-physics.js`** `spawnCommentPhys(text, user)`: 第2引数 `user` を追加し、`bubbleShape`/`bubbleDeco`/`textColor`/`font`/`bubbleBgColor` を内側要素へ適用
  - **`app-06-comment-handler.js`**: 呼び出しを `spawnCommentPhys(message, user)` に変更
  - **`style.css`**: `.comment-phys` を位置専用にし、見た目用の `.comment-phys-bubble` を **shape ルールより前**に追加（shape/deco が padding・背景・角丸・clip-path を上書きできるようにするため）
- **最大数を500まで**: admin の「最大数」スライダー上限を 80 → **500** に拡張。高密度でも軽量に保つため、積み上がり判定をx方向バケットによる近傍比較に変更（O(n²)を回避）
- **z-index設定**: 設定 `commentPhysZ`（既定65）を追加。admin の「重なり順 z」スライダー（0〜9999）で重なり順を調整可能。受信・state同期・`SETTINGS_KEYS` にも登録

---

## v2.745.0 — 2026-06-22

### feat: 配信エンドカードをリッチ化（部門別1位のスライドショー＋常時ランキング＋おしゃれフレーム）

- エンドカードを刷新。**部門別の1位キャラを大きな立ち絵付きでスライドショー表示**（約2.8秒ごとに自動切替）しつつ、**全部門のテキスト順位は右側に常時表示**（現在表示中の部門をハイライト、クリックでその部門へジャンプ）
- 部門を拡充: 🏆MVP（最多コメント）／⚔️ダメージ王／📈レベル王／💥攻撃力王／❤️タフネス王／🛡️歴戦の勇者（ボス参加数）。各部門は参加者（コメントしたキャラ）の中から1位を選出し、規定値未満の部門は非表示
- **`app-14-stream-physics.js`**: `_collectStreamStats` が `departments`（部門・1位名・値・キャラ画像URL）を返すよう拡張、`_userImgUrl`（ステージのアバターと同じ画像解決）を追加。`_showEndCard` をスライドショー化（`_ecTimer` で自動送り、リストクリックで手動切替、閉じる時にタイマー解除）。日記生成用のスカラー項目は後方互換で維持
- **`style.css`**: 回転グラデーションの縁取りフレーム、立ち絵のグロー演出、スライドイン、常時ランキングのアクティブ表示、狭幅時の縦並びレスポンシブを追加

---

## v2.744.0 — 2026-06-22

### feat: 4機能追加（声色エモート／記憶日記／配信エンドカード／コメント物理オブジェクト）

#### ① 声色エモート（感情でVoiceVoxスタイル自動切替）
- アゲルちゃんの返答感情（既存の20種 `AGRU_EMOTIONS`）を **喜・怒・哀・楽・通常** の5バケットに分類し、バケットごとに割り当てたVoiceVoxスタイルで読み上げるようにした
- **`app-08-agru-chat.js`**: `AGRU_EMOTION_VOICE_BUCKET`（20感情→5バケットの対応表）を追加
- **`app-11-agru-state-sd.js`**: 設定 `agruVoiceEmoteEnabled`/`agruVoiceStyle{Joy,Anger,Sorrow,Fun,Normal}`（-1=既定スピーカーにフォールバック）と `_agruResolveVoiceSpeaker(emotion)` を追加。`_agruPlayVoicevox(text, emotion)` に感情引数を追加し、返答・自発トークの2箇所で感情を渡すよう変更
- **`app-13-race-admin-misc.js`** / **`app-01-core-characters.js`** / **`admin.html`**: 設定の受信・state同期・`SETTINGS_KEYS`・UI（有効トグル＋5バケットのスタイル選択ドロップダウン、`loadVoicevoxSpeakers` で一括populate）を追加

#### ② 記憶日記（配信終わりに日記化→翌日回想）
- 配信終了時に「今日あったこと」をOllamaでアゲルちゃん視点の日記に変換し保存。次回起動時に前回の日記を読み込み、システムプロンプトに回想文脈として注入（「前は〜だったね」と自然に振り返れる）
- **`server.js`**: `GET/POST /api/agru-diary`（`data/agruDiary.json` に日付キーで最大60件保持。`?latest=1` で直近1件）を追加
- **`app-14-stream-physics.js`**（新規）: `_saveStreamDiary`（Ollama日記化＋保存、失敗時は集計フォールバック）/`_agruLoadDiaryRecall`（回想読込）/`_agruDiaryRecall` を追加
- **`app-11-agru-state-sd.js`** `openAgruModal`: 起動挨拶の前に `await _agruLoadDiaryRecall()` を実行。システムプロンプト構築2箇所に回想文脈を注入

#### ③ 配信エンドカード（今日の数字まとめ）
- 配信終了ボタンで、コメント総数・参加者数・配信時間・MVP（最多コメント）・ダメージ王・最高レベル・名場面をまとめたカードをオーバーレイ表示。集計は日記にも添付保存
- **`app-14-stream-physics.js`**: `_collectStreamStats`（`users`/`bossDamageMap`/`bossCount` から集計）・`_showEndCard`・`_streamEndSummary` を追加。名場面は `recordStreamHighlight` で収集
- **`app-06-comment-handler.js`**: 最初のコメントで `_streamStartAt` をセット（配信時間起点）、神話ドロップ時に名場面記録
- **`app-05-taiman-boss.js`** `defeatBoss`: ボス討伐を名場面として記録
- **`style.css`**: `.stream-end-card` 一式のCSSを追加

#### ④ コメント物理オブジェクト化
- 流れてきたコメントがステージ上に物理オブジェクトとして落下し、床や壁で跳ねて積み上がる。`射`コマンドの弾が当たると弾ける。admin から ON/OFF と重力・反発・最大数・文字サイズを設定可能
- **`app-14-stream-physics.js`**: 独立物理ループ `spawnCommentPhys`/`_cphysStep`/`clearCommentPhys` と設定 `commentPhysEnabled`/`commentPhysGravity`/`commentPhysRestitution`/`commentPhysMax`/`commentPhysFontSize` を追加。既存 `kaiBullets` と衝突判定
- **`app-06-comment-handler.js`**: 通常コメント処理で `spawnCommentPhys(message)` を呼ぶ
- **`app-13-race-admin-misc.js`** / **`app-01-core-characters.js`** / **`admin.html`**: 設定の受信（OFF時 `clearCommentPhys`）・state同期・`SETTINGS_KEYS`・UI（トグル＋4スライダー）と配信サマリーの「配信終了」「回想を再読込」ボタンを追加
- **`style.css`**: `.comment-phys` / `.comment-phys-pop` のCSSを追加
- **`public/index.html`**: `app-14-stream-physics.js` を読み込みリスト末尾に追加

---

## v2.743.0 — 2026-06-21

### fix: Ollamaが応答しない時にアプリが無言で固まる問題を改善（タイムアウト追加）

- **背景**: Ollama の生成がスタックする（モデルが詰まる・VRAM不足等）と、`/api/ai-reply` が**タイムアウト無しで無限に待機**していた。その結果アゲルちゃんの `agruIdle` が false のまま戻らず、Ollama 復帰後も返答処理が止まったままになっていた（＝「返事がこない」状態が継続）
- **`server.js`**: `OLLAMA_TIMEOUT_MS`（既定120秒）を追加し、`/api/ai-reply` の Ollama リクエスト（/api/chat・/api/generate 両方）に `setTimeout` を設定。応答が無ければ 504 とエラーJSONを返す。レスポンス二重送出を防ぐ `res.headersSent` ガードも追加
- これにより Ollama が固まっても**クライアントが明確なエラーで回復**（`agruIdle` を true に戻す）し、無言の永久ハングを防ぐ
- ※適用にはサーバ再起動が必要。Ollama 自体が詰まっている場合は **Ollama の再起動**が根本対処

---

## v2.742.0 — 2026-06-20

### fix: #拡大コマンドが %23（URLエンコード）で送られると認識されない問題を修正

- **症状**: 半角 `#` で吹き出し4倍コマンドを送ると、外部コメント元が `#`（URL予約文字）を `%23` のままエンコードして送ってくるため `/^[#＃]/` にマッチせず、吹き出しに `%23…` がそのまま表示され発動しなかった
- **`app-06-comment-handler.js`**: 発動判定・先頭文字除去の正規表現を `/^[#＃]/` → `/^(?:[#＃]|%23)/i` に変更。半角 `#`・全角 `＃`・URLエンコード `%23` のいずれでも発動し、先頭から正しく除去されるようにした（全角 `＃` は元々エンコードされず素通りで判定可能）

---

## v2.741.0 — 2026-06-20

### change: 吹き出し4倍拡大コメントの発動文字を「＞/>」から「#/＃」に変更

- **`app-06-comment-handler.js`**: コメント先頭で吹き出しを4倍サイズ＋ガタガタ表示にする発動トリガーを `/^[>＞]/` → `/^[#＃]/` に変更（判定・先頭文字の除去の2か所）。半角 `#` / 全角 `＃` のどちらでも発動する。20MP消費・演出は従来どおり
- `#` の他用途はカラーコード判定（`/^#[0-9a-fA-F]{3,6}$/`、別関数）のみで、コメント先頭コマンドとの衝突なし

---

## v2.740.0 — 2026-06-19

### fix: sdPopWidth の state同期もDOM読み(480固定)になっていた点を修正＋設定の反映漏れ全体監査

- **`app-13-race-admin-misc.js`**: 管理パネルへ送る state の `sdPopWidth` が `sdPopWidthSlider`（オーバーレイに存在しない要素）を読んで常に480を返していたのを、グローバル変数 `sdPopWidth` 参照に修正（管理パネルを開いた時に正しい現在値が表示される）
- **監査**: 同種の「グローバル変数が無く反映/保存されない」項目が他に無いか全体確認。`sendAgruText`/`sendSDText`/`sendAIText` の全送信キーが受信処理で変数代入されていること、起動ローダに `const` ローカル取りこぼしが無いこと、`_sdReadSettings` の全項目が変数フォールバックであることを確認。**該当バグは `sdPopWidth` のみ**で、本修正で解消

---

## v2.739.0 — 2026-06-19

### fix: SD生成設定の「表示サイズ」(sdPopWidth)が保存されても反映されない問題を修正

- **根本原因**: `sdPopWidth` だけ**グローバル変数が宣言されておらず**、起動時ローダはローカル `const sdPopWidth` に読み込むだけ（adminスライダー設定用）。`sdText` 受信処理にも変数更新が無かった。そのため `_sdReadSettings()` のフォールバックが `|| 480`（ハードコード）となり、オーバーレイ（`sdPopWidthSlider` が存在しない）では**常に480px固定**で表示されていた。他のSD設定（`sdWidth` 等）はグローバル変数に読み込まれ反映されていた
- **`app-03-boss-pets.js`**: グローバル `let sdPopWidth = 480;` を宣言
- **`app-12-features-minigames.js`**: 起動時ローダを `const sdPopWidth` → グローバル `sdPopWidth` への代入に変更（localStorageから復元）
- **`app-13-race-admin-misc.js`**: `sdText` 受信に `sdPopWidth` の変数更新を追加（管理パネルからの変更が即反映）
- **`app-11-agru-state-sd.js`** `_sdReadSettings`: `popWidth` のフォールバックを `|| 480` → `|| sdPopWidth` に変更
- これで表示サイズが「保存・起動時復元・ライブ反映」されるようになる

---

## v2.738.0 — 2026-06-18

### fix: ボスアゲルを複数回起動すると処理が多重化して異常に重くなる問題を修正

- **根本原因**: 登場演出 `_agruBattleEntrance` は非同期（setTimeoutチェーン）で、中断は共有フラグ `_bossEntranceAborted` で判定していた。ところが**新しいバトル開始時にこのフラグを false にリセット**するため、前のバトルがバトル中に終了→すぐ次のバトルを開始した場合、**前バトルの登場演出が「中断解除」されて完走し、その onDone が発火**。`agruBattleTimerInterval`/`agruBattleCounterTimer` を**二重に setInterval** し、古い方のIDは上書きで失われてクリアされず、**カウンター攻撃・タイマー・背景処理が多重実行**されたまま蓄積していた
- **`app-09-agru-battle-fx.js`**: バトル世代カウンタ `_agruBattleEpoch` を追加。`_agruBattleEntrance` は開始時の世代を記憶し、各フェーズと最終onDoneのガードを「`_bossEntranceAborted` または世代が変わったら無効」に変更。別バトルが始まった時点で古い登場演出が確実に停止する
- **`app-08-agru-chat.js`** `startAgruBattle`: 開始時に世代を `++`、登場演出onDoneで世代不一致なら無視。さらに間隔タイマーは設定前に `clearInterval` してから張り直す（多重・リーク防止の二重対策）

---

## v2.737.0 — 2026-06-18

### fix: コメントのURLでページが勝手に遷移し戻れなくなる問題を修正（フレームバスティング対策）

- **根本原因**: kuku.lu URL共有時、`_tryKukuSuno` が `/api/kuku-proxy`（kuku.luのページをサーバ側でリダイレクト追跡し**同一オリジンで配信**）を**サンドボックスなしのiframe**で読み込んでいた。kuku.lu が `live.erinn.biz/live.php?...` 等にリダイレクト／フレームバスティングすると、そのページのJSが `top.location` で **localhost:3000 のタブごと別サイトへ遷移**させ、戻れなくなっていた
- **`app-11-agru-state-sd.js`** `_tryKukuSuno`: プロキシ用の隠しiframeに `sandbox="allow-scripts"` を付与。**トップ遷移（フレームバスティング）を禁止**しつつ、スクリプト実行と postMessage（suno リンク抽出）は維持。受信側は `e.source` で照合するため opaque origin でも動作する

---

## v2.736.0 — 2026-06-16

### feat: 自発トークの話題を管理パネルから設定可能に（箇条書き）

- 管理パネルに**話題リスト入力（テキストエリア・箇条書き可）**を追加。自発トーク時、リストから**ランダムに1つ選んでアゲルちゃんに自然に振らせる**（空欄なら従来どおり自由な話題）
- **`app-11-agru-state-sd.js`**: 設定 `agruAutoTalkTopics`（localStorage永続）を追加。`_agruAutoTalkPrompt` で各行を1話題としてパース（行頭の `・`/`-`/`*` 等の箇条書き記号を除去）し、ランダムに1つ選んでプロンプト化
- **`app-13-race-admin-misc.js`**: `agruText` 受信・state同期に追加
- **`app-01-core-characters.js`**: `SETTINGS_KEYS` に追加
- **`admin.html`**: 話題リストのテキストエリアを追加、state反映も追加
- **`index.html`**: マニュアルに追記

---

## v2.735.0 — 2026-06-16

### change: 自発トークを「話題振り」に統一（状況別の実況を廃止）

- **`app-11-agru-state-sd.js`** `_agruAutoTalkPrompt`: ボス戦/クイズ/Wordle中の「実況」分岐を廃止し、常に「話題振り」プロンプトを返すよう統一
- **`admin.html`** / **`index.html`**: 説明文を「話題を振る」に更新

---

## v2.734.0 — 2026-06-16

### feat: アゲルちゃん「自発トーク」を追加（無言が続くと自分から話題を振る／実況）

- 管理パネルのトグルで **自発トーク** を有効化。コメントが途切れて一定時間（既定90秒）経つと、アゲルちゃんが Ollama で自分から発言する（VoiceVox再生あり）
- **状況に応じてモード自動切替**: ボス戦/クイズ/Wordle中は「実況」、それ以外は「話題振り」
- **連続上限**（既定3回）に達すると、次の視聴者コメントが来るまで停止（独り言の連発を防止）
- 手動返答モード中・ボスアゲルバトル中・画像生成ロック中は自発トークしない。好感度は変動させない（視聴者入力ではないため）
- **`app-11-agru-state-sd.js`**: `agruAutoTalkEnabled`/`agruAutoTalkInterval`/`agruAutoTalkMaxStreak`（localStorage永続）と `_agruScheduleAutoTalk()`/`_agruAutoTalkPrompt()`/`_agruAutoTalk()` を追加。`_agruSend`・`openAgruModal`・`closeAgruModal` に無言タイマーの開始/リセット/停止を組込み
- **`app-13-race-admin-misc.js`**: `agruText` 受信に3設定を追加、state同期にも追加
- **`app-01-core-characters.js`**: `SETTINGS_KEYS` に3キーを追加
- **`admin.html`**: 自発トークのトグル＋無言秒数＋連続上限のUIを追加、state反映も追加
- **`index.html`**: マニュアルに自発トークの説明を追記

---

## v2.733.0 — 2026-06-16

### fix: 手動返答（とアゲル画像ランダム切替）が自動モードでも発生していた問題を修正

- **`app-11-agru-state-sd.js`** `_agruManualReply`: 先頭に `if (!agruManualMode) return;` を追加。手動返答モードがOFF（Ollama自動返答）のときは、admin の「発言」を送っても反応せず、**画像のランダム切替も行わない**ようにした（ランダム切替は手動返答モード時のみ）
- **`admin.html`**: 手動返答モードがOFFのときは「発言」入力欄・ボタンを**無効化**（誤操作防止）。`sendAgruManualReply` 側でもモードOFF時は送信しないようガード。state読込時・トグル時にUI状態を同期

---

## v2.732.0 — 2026-06-16

### fix: 手動返答で空チャット＋本文の2個が表示される問題を修正（管理メッセージの二重処理）

- **根本原因**: `adminSend` は BroadcastChannel と WebSocket の両方で送信し、アプリも両方で受信するため、同一ブラウザ＋WS接続時に `handleAdminMessage` が**1メッセージにつき2回実行**されていた。手動返答（`_agruManualReply`）が2回呼ばれ、`_agruAddBubble` の共有タイマー `_agruTypeTimer` を2回目が `clearInterval` するため、**1個目が空・2個目が本文**の2バブルになっていた（設定系コマンドは冪等のため無害だった）
- **`admin.html`** `adminSend`: メッセージに重複除去用の `_n`（nonce）を付与
- **`app-13-race-admin-misc.js`** `handleAdminMessage`: 冒頭で `_n` を見て、同一nonceの2回目以降を無視（5秒で自動失効）。BroadcastChannel + WebSocket の二重配信を一本化
- これにより手動返答・デバッグ送信など「追記系」コマンドが正しく1回だけ実行される

---

## v2.731.0 — 2026-06-16

### fix: アゲルちゃん吹き出しの点滅カーソル「▋」を廃止（入力待ちは「・・・」のみに）

- **`app-11-agru-state-sd.js`** `_agruAddBubble`: タイプライター表示中に出していた点滅カーソル `▋`（`.agru-cursor`）を削除。返答バブルのタイプ中に新コメントが来ると「▋」と「・・・」インジケータが二重表示されていた問題を解消
- 入力待ち表示は丸ドットの「・・・」（`agru-typing-bubble`）のみになる。テキストのタイプライター表示自体は維持

---

## v2.730.0 — 2026-06-16

### improve: 手動返答モードの「・・・」表示とアゲル画像のランダム切替

- **手動返答モードでも「・・・」入力待ち表示**を行うよう変更。コメント到着時に `_agruSetStatus('返答中...')` でアゲルちゃん側の「・・・」（入力中インジケータ）を表示し、返答後は `'コメント待ち...'` の「・・・」に戻す
- **手動返答時にアゲル画像をランダムに切り替え**。`_agruSetRandomImage()`（感情フォルダから無作為に1枚選択。無ければデフォルト画像）を追加し、`_agruManualReply` で呼び出し
- **`app-11-agru-state-sd.js`**: `_agruSetRandomImage()` 追加、`_agruSend` 手動分岐と `_agruManualReply` のステータス表示を修正
- **`app-13-race-admin-misc.js`**: 手動モード切替時のステータス表示を `'コメント待ち...'` に変更

---

## v2.729.0 — 2026-06-16

### feat: アゲルちゃん会話モードに「手動返答モード」を追加

- 管理パネルのトグルで **手動返答モード** に切り替え可能。ONのときアゲルちゃんは Ollama での自動返答をせず、**admin.html から入力した文を発言**する（VoiceVox再生あり）
- **`app-11-agru-state-sd.js`**: フラグ `agruManualMode`（localStorage永続）を追加。`_agruSend` 冒頭に手動モード時の分岐を追加（コメントはチャット表示＋パラメータ更新するが Ollama を呼ばない）。手動発言用 `_agruManualReply(text)` を追加（吹き出し表示＋VoiceVox＋自動アイドル復帰）
- **`app-13-race-admin-misc.js`**: `agruText` 受信に `agruManualMode` を追加、新メッセージ型 `agruManualReply` を追加（`_agruManualReply` 呼び出し）、管理パネルへの state 同期にも追加
- **`app-01-core-characters.js`**: `SETTINGS_KEYS` に `agruManualMode` を追加
- **`admin.html`**: 「手動返答モード」チェックボックス＋セリフ入力欄＋「発言」ボタンを追加（Enter送信対応）、受信stateからのチェックボックス反映も追加
- **`index.html`**: マニュアルに手動返答モードの説明を追記

---

## v2.728.0 — 2026-06-16

### feat: 会話モードのパラメータメーター表示位置を管理パネルから調整可能に

- 会話モードのパラメータメーター（`.agru-params-overlay`、好感度/空腹/眠気/❓）の表示位置を、admin.html の **「パラメータ位置」X/Y スライダー**で調整できるようにした（既定の左下位置からのオフセットpx）
- **`app-11-agru-state-sd.js`**: `agruParamPosX` / `agruParamPosY`（localStorage永続）と適用関数 `_applyAgruParamPos()` を追加（`.agru-params-overlay` の `left`/`bottom` をオフセット）
- **`app-13-race-admin-misc.js`**: `agruText` 受信に `agruParamPosX`/`agruParamPosY` の適用を追加、管理パネルへの state 同期にも追加
- **`app-01-core-characters.js`**: `SETTINGS_KEYS` に両キーを追加（サーバ保存対象）
- **`admin.html`**: 「パラメータ位置」横→/上↑ スライダーを追加（`sendAgruText`）、受信stateからの入力欄反映も追加
- **`index.html`**: マニュアルに位置調整が可能な旨を追記

---

## v2.727.0 — 2026-06-16

### change: アゲルちゃん好感度パラメータを 0〜100（初期50）→ 0〜1000（初期500）に変更

- **`app-08-agru-chat.js`**: 初期値 `agruAffinity = 50` → `500`
- **`app-11-agru-state-sd.js`**: AI返答での好感度クランプ `Math.min(100, …)` → `Math.min(1000, …)`（2箇所）、リセット値 50 → 500
- **`app-09-agru-battle-fx.js`** `endAgruBattle`: トリガー解除/ボス勝利時のリセット 50 → 500
- **`app-10-agru-battle-skills.js`**: 好感度レベル閾値を新レンジに合わせ ×10（`>=900/700/400/200`）、AIプロンプト表記 `/100` → `/1000`。ハート表示の換算を `/10` → `/100`（0〜1000を10ハートに対応）
- **`app-13-race-admin-misc.js`** / **`admin.html`**: 管理パネルの好感度スライダーを `max 100 step 1 value 50` → `max 1000 step 10 value 500`、設定クランプも 0〜1000 に
- **`index.html`**: パラメータ説明（好感度0〜1000・初期500）・好感度レベル別態度表を新レンジに更新
- 補足: 好感度の増減幅（カフェオレ投与+20・水道水-5・AIの±）は今回**据え置き**（指定外のため）。同じ変化ペースにしたい場合は増減幅も10倍にできる。空腹・眠気・❓は従来どおり0〜100

---

## v2.726.0 — 2026-06-16

### feat: アゲル会話モードに「解毒剤投与」コマンドを追加

- **`解毒剤投与`**（MP20消費）を追加。投与すると**現在の毒状態を解除**し、**5分間は `毒投与` を無効化**する
- **`app-10-agru-battle-skills.js`**: 状態変数 `_agruAntidoteUntil`（解毒剤の効果終了時刻）を追加
- **`app-06-comment-handler.js`** `handleComment`: `解毒剤投与` 分岐を追加（MP20チェック→消費→`_agruPoisonTurns=0`＋`_agruAntidoteUntil`を5分後にセット＋状態画像を通常へ戻す）。`毒投与` 分岐に解毒剤効果中の無効化チェックを追加
  - 補足: 毒状態のときアゲルちゃんは「誰か解毒剤を！」とAIが命乞いする仕様のため、narrative 的にも整合
- **`index.html`** アゲル会話モードの投与コマンド一覧に `解毒剤投与` を追記

---

## v2.725.0 — 2026-06-16

### fix: ボスアゲル終了後の即ループ＋2回目以降の背景残留・重さを修正

- **根本原因1（ループ）**: バトル終了時のパラメータ初期化（`agruAffinity=50` / `agruHunger=100`）が **`result==='ageru'`（ボス勝利）時のみ**実行されていた。`agruAffinity===0` で自動開始したバトルをリスナーが勝利（`'players'`）すると、終了後も好感度が0のまま残り、次のコメントで即座に次バトルが起動してループしていた
  - **`app-09-agru-battle-fx.js`** `endAgruBattle`: 全結果共通で「自動開始トリガー（好感度0 / 空腹0）」を解除する処理を追加（`agruAffinity<=0`→50、`agruHunger<=0`→50、`_agruDeadWakeCount`/`_agruSleepWakeCount` を0にリセット）。ボス勝利時は従来どおり50/100で改めて初期化
- **根本原因2（背景残留・重い）**: リスナー勝利時の「10秒後フェード→1.5秒後に背景/レイアウトをリセット」する**内側の `setTimeout(1500)` が追跡されておらず**、フェード中に次バトルが始まると次バトルの背景を消したり、ぷるぷるキャンバスが残ってアニメループが多重化していた
  - **`app-09`** `endAgruBattle`: 内側の遅延クリーンアップを `agruBattleTimers.setTimeout(...)` 管理に変更し、次バトル開始時の `clearAll()` で確実にキャンセルされるようにした
  - **`app-08-agru-chat.js`** `startAgruBattle`: 前バトルの残留ぷるぷるキャンバス（`#agruBossFigureWrap .puru-canvas`）を開始時に除去（アニメループ多重化による重さを防止）

---

## v2.724.0 — 2026-06-15

### fix: ボスアゲルバトル スキル演出後にHP別画像へ戻るよう修正

- **根本原因**: `_agruBattlePlayEffect` の `getRestorePath()` と画像なしスキルの復帰分岐が、スキル演出後に常に**デフォルト画像**へ戻していた（HP別画像を考慮していなかった）
- **`app-08-agru-chat.js`**: 現在HPに対応するHP別画像のパスを返す `_agruBattleHpImagePath()` を追加（HP別画像が未設定なら null）
- **`app-10-agru-battle-skills.js`** `_agruBattlePlayEffect`: 復帰先を「防御中→防御画像／それ以外→HP別画像（無ければデフォルト画像）」に変更。`cfg.image` なしスキルの復帰も同じく `getRestorePath()` 経由に統一

### feat: ボスアゲル ぷるぷる設定にPポイント配置のコピー＆ペーストを追加

- **`ageru-boss.html`** の「ぷるぷる設定（ボスアゲル画像）」に **📋 コピー / 📌 貼り付け** ボタンを追加。選択中画像のPポイント配置をコピーし、別画像を選んで貼り付けると配置を引き継げる
- admin.html の `puruCopyPoints`/`puruPastePoints` と同方式（`_bossPuruCopiedPoints` に points を deep clone → 貼り付け時に per-index で適用 → `buildBossPuruPointsUI` 再描画＋`syncBossPuruConfig` 保存）

---

## v2.723.0 — 2026-06-15

### chore: 重複画像の削除＋ /sync-chars に未登録ファイル警告を追加

- **重複画像6件を削除**（`chara/` から）。いずれも同名 `.png` が `charImages.json` に登録済み・どこからも参照されていない別形式（`.jpg`/`.jpeg`）:
  `00000-2030634083.jpg` / `00208-3215337490.jpg` / `00293-1473418849.jpg` / `00734-3531920647.jpg` / `59565e10f2324d2ab1e25ac49235d506.jpeg` / `magicaldraw_20250904_174643.jpg`
- **`/sync-chars` スキルに手順4「未登録の画像ファイルを検出して警告」を追加**。`chara/`・`public/chara/` にあるが `charImages.json` 未登録の画像を「新規キャラ候補」「別形式の重複候補」に分けて報告するようにした（今回の見落としを今後は自動検出できる）

---

## v2.722.0 — 2026-06-15

### feat: 未登録だった新キャラ4件を登録・マニュアル反映

- `chara/` に存在するが `data/charImages.json` に未登録だった新キャラ4件を登録（キー264〜267）: `ppageru.png` / `pageru.png` / `chameageru.png` / `chamerageru.png`
- アプリは `/chara-s/`（＝`public/chara/`）から配信するため、4ファイルを `public/chara/` にもコピー（マニュアルは root `chara/` から読み込むため両方に配置）
- `index.html` の `STANDALONE_CHARS` を再同期（263→267件）
- 別形式の `.jpg`/`.jpeg` 6件（同名 `.png` が既登録）は重複のため除外
- 補足: `/sync-chars` は charImages.json を正とするため、未登録の画像ファイルは検出対象外だった（今回は手動で登録）

---

## v2.721.0 — 2026-06-15

### docs: index.html フォント一覧を全掲載（FONT_MAP 全86件）

- **🔤 フォント一覧**を `FONT_MAP` の全エントリ（86フォント、`デフォルト`/`リセット`除く）に拡充。従来は47件のみ掲載だった
- ソースのカテゴリ分けを保持して12グループで整理（日本語短縮エイリアス／日本語ゴシック／日本語明朝／游フォント／UD教科書体／Noto／その他日本語／フリーフォント／黒薔薇ゴシック／fontopo／英語フォント／直接指定の例）
- 各フォントにコマンド（`フォント:名前`）とフォントプレビューを表示。別名（例: `ゴシック`＝`MSゴシック`）も含め全て掲載
- 末尾に「直接指定の例」（Arial/Impact/Calibri/Georgia）を追加。FONT_MAP外の任意フォント名もそのまま使えることを明示

---

## v2.720.0 — 2026-06-15

### docs: index.html マニュアル最新化（続き・ボス/会話/設定セクション照合）

- **🐉 ボスバトルコマンドの陳腐化を修正**:
  - ボス召喚HP: 「ランダムHP（100〜2000）」→ 実装どおり「参加キャラ全員の総攻撃力 × 係数（最小100）」、HP直接指定は「上限2000」→「最小10・上限なし」に修正
  - 反撃確率: デフォルト「20%」→ 実装どおり「40%」（`bossCounterRate ?? 0.40`）。反撃ダメージ「5」→「5 ＋ 撃破数」（周回で増加）に修正
  - ボスサイズ: 「HP比例（HP100→120px / HP2000→420px）」→ 実装どおり「管理パネルのスケール設定で変更（既定約200px）」に修正
- **🌸 アゲルちゃん会話モード**: 未掲載だった <code>毒投与</code>（空腹-10＋毒状態・嫌がらせ用）を追記
- **⚙️ その他の設定**: 「出して」コマンドの別名（出ろ／生成／gen）を補記
- 照合で一致を確認（変更なし）: 移動4・大きさ3・文字サイズ5（マップと一致）／モーション9種（`applyMotion`）／エフェクト9種／SD生成コスト MP20

---

## v2.719.0 — 2026-06-15

### docs: index.html（コマンドマニュアル）を実装と全面照合・最新化（/update-index, /sync-chars）

- **👹 ボスアゲルバトルのアゲルスキル一覧を全面刷新**（最大の陳腐化）。旧実装の `random_comment`/`emote`/`roar`/`bomb`/`freeze`/`time_extend` 等から、現行 `AGRU_BATTLE_SKILLS`（`normal`/`focus_fire`/`all_attack`/`mp_absorb`/`all_mp_drain`/`petrify`/`sleep`/`charm`/`curse`/`self_heal`/`berserk`/`instant_kill`/`shield_char`/`delete_char`/`super_heal` の15スキル）へ更新。各スキルの効果・既定の発動重み（HPティア別）を反映
  - 「発動条件（HP○%以下）」列を撤廃し「既定の発動重み」に変更（v2.718でHP閾値ゲートを廃止したため）。攻撃倍率（設定画面で変更可）の説明を追加
  - 「攻撃の仕組み」を現行式に修正：ヒット数＝⌈コメント文字数÷4⌉、各ヒットはキャラ攻撃力ベース（通常 atk×1〜3／クリ atk×2〜4×2）、早押しバフ×1.5・称号倍率・呪い半減・攻撃でMP+1
- **キャラ一覧（`STANDALONE_CHARS`）を `data/charImages.json` に同期**（258→263件、新規5キャラ: 259-263）。root `chara/` へ画像ファイル5件を補完
- 照合結果（差分なし＝最新を確認）: 文字色200／吹き出し形12／装飾9／エフェクト9／ペット能力30／装備レアリティ5／称号101／主要コマンド網羅性
- 既知の問題: キャラ69「247448 - コピー.png」の画像ファイルが public/chara・chara の両方に存在しない（要対応）。フォント一覧は86エイリアス中47掲載（残りは別名重複が大半・要判断）

---

## v2.718.0 — 2026-06-15

### feat: ボスアゲルバトル スキルの攻撃力を設定可能化＋HP閾値ゲートを廃止

- **攻撃力（攻撃倍率）を設定画面から変更可能に**
  - `ageru-boss.html` のスキル設定に「攻撃力」欄を追加（攻撃ダメージを持つ `通常攻撃`/`集中砲火`/`全体乱打` のみ表示）。実ダメージ = 基礎攻撃(5〜10, ボスHP低下で上昇) × 攻撃倍率
  - 既定倍率: 通常攻撃=1 / 全体乱打=2 / 集中砲火=5（従来のダメージと同一）。`config.skills.<id>.atkMult` として保存・復元
  - **`app-10-agru-battle-skills.js`** `_agruBattleDoCounter`: `normal`/`focus_fire`/`all_attack` のダメージ式を `Math.round(bossAtk × atkMult)` に変更（設定値、未設定時は既定倍率）
- **HP閾値による発動制限（minHpPct）を廃止**
  - **`app-10`** `_agruBattlePickSkill`: `if (s.minHpPct && pct > s.minHpPct) return false;` を削除。`AGRU_BATTLE_SKILLS` から `minHpPct`（berserk/instant_kill/shield_char/delete_char）を除去
  - 発動可否は「発動確率（HPティア別の重み）」のみで制御。重み[0]（HP100-75%）を1以上にすればHP100%から発動可能。重みで同等の制御ができるため閾値は不要
  - `ageru-boss.html`: `SKILL_DEFS` から `minHpPct` と説明文の「（HP○%以下で発動）」を削除。`_recalcSkillProbs` の HP条件判定（`isAvailable`）を撤去し全ティアで確率表示

---

## v2.717.0 — 2026-06-15

### refactor: リファクタリング Phase 4（handleComment軽量化・consoleログ除去・挙動変更なし）

- **`app-06-comment-handler.js`** `handleComment`: 全コメントで16回再計算していた `message.trim()` を、関数冒頭で1回だけ算出する `trimmedMsg` に集約（`message` は const のため値は不変）。コメント1件あたりの文字列処理を削減
- **フロントエンド全 `console.*`（28箇所）を除去**。`console.log('[comment]', JSON.stringify(comment, null, 2))` のように全コメントで実行されていた整形JSON化を含む。`if (data.error) { return; }` の `return` や `showBubble`/`setStatus`/`postAIReply` 等のロジックは保持し、console呼び出しのみ削除したため挙動は不変
  - 対象ファイル: `app-01`(BG upload catch) / `app-06`(コメントログ) / `app-07`(受信catch・TTS) / `app-11`(VoiceVox・AI・SD・Suno・アゲルログ・pop音) / `app-12`(ステータスキャプチャ・ニュースfetch)
- 各ファイル `node --check`・全13ファイル連結パース OK
- 補足: `server.js` のログ（21箇所・サーバ起動/障害診断用）は対象外として残置

---

## v2.716.0 — 2026-06-15

### refactor: リファクタリング Phase 5（app.js を機能単位で13分割・挙動変更なし）

- **`public/app.js`（約14,900行）を `public/js/` 配下の13ファイルに分割**。元ファイルの出現順を保ったまま連続行で切り出し、`index.html` に番号順で読み込む。classic script のためグローバルスコープは共有され、関数・コマンド・変数の挙動は単一ファイル時と完全に同一
- 分割ファイル: `app-01-core-characters.js`（キャラ/アバター/移動/吹き出し）/ `app-02-effects.js`（spawnエフェクト）/ `app-03-boss-pets.js`（ボス育成/ペット定義/タイマーグループ）/ `app-04-battle-royale.js` / `app-05-taiman-boss.js`（タイマン/ボス討伐）/ `app-06-comment-handler.js`（handleComment）/ `app-07-ui-stage-ai.js`（モーダル/物理/TTS/AI）/ `app-08-agru-chat.js`（アゲル会話）/ `app-09-agru-battle-fx.js`（バトル演出）/ `app-10-agru-battle-skills.js`（反撃スキル）/ `app-11-agru-state-sd.js`（バトル状態/SD生成）/ `app-12-features-minigames.js`（ガチャ/ランキング/各ミニゲーム）/ `app-13-race-admin-misc.js`（競馬/管理連携/自動処理）
- **検証**: 13ファイルを番号順に連結すると分割前の `app.js` と**バイト単位で一致**（md5 `cc0fe883...`）。各ファイル `node --check` 通過。稼働中サーバで全ファイルがHTTP 200配信されパースOKを確認
- ナビ用に `public/js/README.md`（機能→ファイル対応表）を追加。元 `public/app.js` は削除（git履歴から復元可能）
- **`public/index.html`** の `<script src="app.js">` を13ファイルの順次読み込みに差し替え

---

## v2.715.0 — 2026-06-15

### refactor: リファクタリング Phase 3（タイマー残留対策の安全網インフラ・挙動変更なし）

- **`public/app.js`** タイマーグループ・ユーティリティ `makeTimerGroup()` を追加。グループ単位で `setTimeout`/`setInterval` を追跡し `clearAll()` でまとめてキャンセルできる
- アゲルバトル専用グループ `agruBattleTimers` を追加し、`startAgruBattle`（開始時）と `endAgruBattle`（終了時）の teardown で `agruBattleTimers.clearAll()` を呼ぶよう組込み。今後バトル中の一時演出タイマーを `agruBattleTimers.setTimeout(fn, ms)` で登録すれば、連続起動時に自動一掃され「背景/演出の残留」バグを構造的に防げる
- 現時点ではグループ登録タイマーが無いため `clearAll()` は実質no-op＝**既存の挙動は完全に不変**。`node --check` 確認済み
- 補足: 既存のバトルエフェクト内 `setTimeout` の一括移行は、後始末（DOM削除・onDone連鎖）を担うtimeoutを途中キャンセルするとDOMリークを招くため見送り。個別移行は実機テストと合わせて段階実施する

---

## v2.714.0 — 2026-06-15

### refactor: リファクタリング Phase 2（spawnエフェクト群の共通化・挙動変更なし）

- **`public/app.js`** パーティクル生成の定型処理（`createElement`→`cssText`→`appendChild`→`animate`→終了で`remove`）を共通ヘルパー `_spawnParticle(cssText, keyframes, options, init)` に集約
- 対象: `spawnFireworks` / `spawnConfetti` / `spawnConfettiSmall` / `spawnShootingStar` / `spawnHeartShower` / `spawnSakura` / `spawnSnow` / `spawnExplosion` / `spawnBubbles` / `spawnLightning`
- 各関数名・パーティクルのcssText・キーフレーム・タイミング・個数は一切変更していないため見た目・挙動は同一
- `node --check` で構文確認済み

---

## v2.713.0 — 2026-06-15

### refactor: リファクタリング Phase 1（安全な掃除・挙動変更なし）

- **不要物削除**: `public/help/hico1w.io/`（独自`.git`を持つ古いプロジェクト複製・コード参照なし）を削除
- **`public/app.js`** 重複コード集約: ほぼ同一だった `_agruUpdateHungerDisplay` / `_agruUpdateSleepDisplay` / `_agruUpdateLibidoDisplay` の10段バー描画処理を共通ヘルパー `_agruRenderParamBar(elId, icon, mark, onCls, offCls, filled)` に集約。各関数名・DOM ID・表示記号・CSSクラス・計算式は不変のため挙動は完全に同一
- `node --check` で構文確認済み

---

## v2.712.0 — 2026-06-15

### fix: 複数回ボスアゲルを行ったとき前バトルの背景/オーバーレイが残る・重くなる問題を修正

- **根本原因1**: リスナー勝利時の10秒フェードタイマー（`setTimeout 10000`）が追跡されておらず、次バトル開始後に発火してオーバーレイ非表示・背景リセットを実行してしまっていた
- **根本原因2**: `_agruBattleVictoryBounce` の10.4秒タイマーも追跡されておらず、次バトル中に発火してキャラのtransformをリセット→`gatherCharactersBottom()`を呼び出していた
- **根本原因3**: `_agruPlayersWon` が次バトル開始時にリセットされず、画像プールの絞り込みが残り続けた
- **根本原因4**: 前バトル終了時のフェード途中に新バトルが開始されると、オーバーレイに `opacity:0`/`transition` インラインスタイルが残り、バトル画面が不可視になった
- **`public/app.js`** `startAgruBattle`: `_agruPlayersWon=false`リセット、`_agruVictoryFadeTimer`/`_agruVictoryBounceTimer`をキャンセル、オーバーレイのopacity/transitionをリセット、`_agruWipeOverlay`/`_agruWinOverlay`の残留DOM除去、`agru-victory-bounce`クラス・インラインスタイルをキャラからクリア
- **`public/app.js`** `endAgruBattle`: `_agruVictoryFadeTimer`/`_agruVictoryBounceTimer`キャンセル、`_agruWipeOverlay`除去を追加
- **`public/app.js`** `endAgruBattle`(result='players')のタイマーを`_agruVictoryFadeTimer`/`_agruVictoryBounceTimer`変数で追跡
- **`public/app.js`** `_agruBattleVictoryBounce`: 内部10.4秒タイマーを`_agruVictoryBounceTimer`で追跡。バトル中でなければ`gatherCharactersBottom()`を実行

---

## v2.711.0 — 2026-06-15

### fix: AFK透明度・グレースケール・明るさ等のスライダー設定がページ起動時に反映されない問題を修正

- **根本原因1**: `afkOpacity`/`afkGrayscale`/`afkBrightness` が変数宣言されておらず暗黙グローバルになっていた。`initAfkSliders` がindex.htmlではスライダー要素がないため早期リターンし、CSS変数 `--afk-opacity` 等が初期化されなかった
- **根本原因2**: `kaiSpeed`/`kaiRestitution`/`kaiGravity`/`kaiBulletSize` がハードコードのデフォルト値で宣言されており、index.htmlではスライダーなしで早期リターンのため保存値が復元されなかった
- **`public/app.js`** 変数宣言（line ~2144-2150）: `kaiSpeed`/`kaiRestitution`/`kaiGravity`/`kaiBulletSize`/`seVolume`/`voiceVolume` をlocalStorageから初期化するよう変更。`afkOpacity`/`afkGrayscale`/`afkBrightness` を新規宣言してlocalStorageから初期化
- **`public/app.js`** `initKaiSliders` IIFE: `apply(saved)` をスライダー要素チェックより前に移動し、index.htmlでも変数が正しく初期化されるよう修正
- **`public/app.js`** `initAfkSliders` IIFE: CSS変数の `setProperty` をスライダー要素チェックより前に移動し、index.htmlでもAFKスタイルが起動時に適用されるよう修正

---

## v2.710.0 — 2026-06-15

### feat: ボスアゲル起動時にYouTube再生を停止

- **`public/app.js`** `startAgruBattle`: `_agruBgmPause()` の直後に `agruYtModal` を非表示・`agruYtIframe.src` をクリアしてYouTube再生を停止
- `closeAgruYtModal` はBGM再開を含むため直接呼ばず、モーダル停止部分のみインラインで実行

---

## v2.709.0 — 2026-06-15

### fix: ボスアゲル終了時にOllama停止チェックを勝敗問わず実行

- **`public/app.js`** `endAgruBattle`: `result === 'players'` 限定だった Ollama 起動呼び出しを条件なしに変更。勝敗に関わらずバトル終了時に `POST /api/srv/start/ollama` を実行（起動済みならサーバー側でスキップ）

---

## v2.708.0 — 2026-06-15

### fix: ボスアゲル終了後に通常ボスが召喚されないことがある問題を修正

- **根本原因**: バトル開始前にユーザーが手動でボスを消していた場合、`bossManuallyCleared = true` のままバトルが始まり、終了時の自動召喚チェック `!bossManuallyCleared` が false になってスキップされていた
- **`public/app.js`** `startAgruBattle`: 通常ボス消滅処理の直前に `bossManuallyCleared = false` をリセット。これによりボスアゲル終了後は常にボスが自動召喚される

---

## v2.707.0 — 2026-06-15

### fix: ボスアゲルバトルで死亡キャラが画面中央から攻撃できてしまう問題を修正

- **根本原因①**: `attackAgruBoss` が `user.ko` しか確認しておらず、`instant_kill` 等でキルされたユーザーや削除後に再生成されたユーザーが `_agruBattleKilledIds` をすり抜けていた
- **根本原因②**: `getCharCenter` が `user.el === null` のとき `stage` 中央座標を返すため、死亡キャラの攻撃エフェクトが中央から発生していた
- **`public/app.js`** `attackAgruBoss`: `_agruBattleKilledIds.has(user.ipid)` チェックを追加し、KO済みユーザーの攻撃を早期リターンでブロック

---

## v2.706.0 — 2026-06-15

### fix: ボスアゲル終了後にKO済みリスナーがキャラを再生成できない問題を修正

- **根本原因**: `endAgruBattle` で `_agruBattleKilledIds` がクリアされなかったため、バトル後も `ensureCharOnStage` が killed ユーザーを弾き続けていた
- **`public/app.js`** `endAgruBattle`: `_agruBattleRestoreChars()` の直後に `_agruBattleKilledIds.clear()` を追加し、バトル終了後は再生成制限を解除
- **`public/app.js`** `_agruBattleKillUser` 内 1500ms タイマー: `user.el` が復活している場合（バトル終了後に再生成済み）は `delete users[ipid]` / charSave削除をスキップし、ユーザーオブジェクトを保護

---

## v2.705.0 — 2026-06-15

### feat: ボスアゲル勝利時に好感度・空腹度を初期値にリセット

- **`public/app.js`** `endAgruBattle`: `result === 'ageru'`（ボス勝利）のとき `agruAffinity = 50`・`agruHunger = 100` にリセットし表示を更新

---

## v2.704.0 — 2026-06-15

### feat: ボスアゲルバトル中は画像・YouTubeコマンドを無効化

- **`public/app.js`** 画像生成コマンド (`出ろ|出して|生成|gen`): `agruBattleActive` 中は早期リターン
- **`public/app.js`** YouTube URL共有ブロック: `agruBattleActive` 中はブロック全体をスキップ
- **`public/app.js`** YouTube停止コマンド (`止めて`): `agruBattleActive` 中はスキップ

---

## v2.703.0 — 2026-06-15

### feat: ボスアゲルバトル中は宝箱を非表示

- **`public/app.js`** `spawnTreasureChest`: `agruBattleActive` 中は早期リターンで宝箱を出現させない（自動出現・手動呼び出し両方）
- **`public/app.js`** `開ける` コマンド: バトル中はコマンドを無視（`return` は維持し他の処理への波及を防ぐ）

---

## v2.702.0 — 2026-06-15

### feat: ボスアゲルデバッグ用スキル強制発動UI追加

- **`public/ageru-boss.html`**: バトル操作セクション直下に「🛠 デバッグ — スキル強制発動」セクションを追加。全15スキルをクリック1つで即発動できるボタンを配置
- **`public/app.js`** `_agruBattleDoCounter`: `forceSkillId` 引数を追加。指定時はランダム選択をスキップして指定スキルを実行
- **`public/app.js`** `handleAdminMessage`: `agruBattleSkill` タイプを追加し `_agruBattleDoCounter(d.skillId)` を呼び出し

---

## v2.701.0 — 2026-06-15

### fix: 超回復30秒経過時の回復量を50%→30%に変更

- **`public/app.js`** `_agruActivateDefense`: タイムアウト時の `agruBattleMaxHP * 0.5` → `* 0.3` に変更

---

## v2.700.0 — 2026-06-15

### fix: 超回復防御崩壊時のHPペナルティを10%→5%に変更

- **`public/app.js`** `_agruBreakDefense`: `agruBattleMaxHP * 0.1` → `* 0.05` に変更

---

## v2.699.0 — 2026-06-15

### feat: ボスアゲルバトル プレイヤー勝利時にOllamaを自動起動

- **`public/app.js`** `endAgruBattle`: `result === 'players'` のとき `POST /api/srv/start/ollama` を呼び出し、停止していた場合でもOllamaを再起動する（既に起動中ならサーバー側で安全にスキップ）

---

## v2.698.0 — 2026-06-15

### feat: 超回復防御中にスキルの画像・エフェクトを表示（バリア維持）

- **`public/app.js`** `_agruBattlePlayEffect`: `_agruDefenseActive` 時の早期 `return` を削除し、防御中もスキル画像のクロスフェードとエフェクトが再生されるように変更
- スキル画像表示後の復帰先を `getRestorePath()` で動的に判定：防御中なら `defenseImage` に、それ以外は `defaultImage` に戻す
- `focus_fire` の連打後も同様に防御画像へ復帰するよう修正

---

## v2.697.0 — 2026-06-15

### fix: ボスアゲルバトル中にKO済みキャラが攻撃できる問題を修正

- **`public/app.js`** `_agruBattleDealDamage`: `_agruBattleKilledIds` に含まれる ipid のユーザーはダメージ処理を早期リターンでスキップ

## v2.696.0 — 2026-06-15

### fix: 超回復防御中もスキル発動を許可（バリアは維持）

- **`public/app.js`** `_agruBattleDoCounter`: `_agruDefenseActive` 中のスキップ処理を削除。バリア・ダメージ軽減ロジックはそのまま維持

## v2.695.0 — 2026-06-15

### fix: ボスアゲル勝利後の通常ボスにアゲル系キャラが選ばれないよう修正

- **`public/app.js`** `spawnBoss`: `_agruPlayersWon` が true のとき `agruBattleConfig.agruTypeImages` に含まれるファイル名を `availableImages` から除外したプールで画像を選択する。フィルタ後にプールが空の場合は全画像から選択するフォールバックあり

## v2.694.0 — 2026-06-15

### feat: ボスアゲルバトル中の新規キャラ生成禁止

- **`public/app.js`** `ensureCharOnStage`: `agruBattleActive` が true のとき `el` を持たないユーザーの生成をスキップ（バトル中に新規コメントしても出現しない）
- **`public/app.js`** `ensureCharOnStage`: `_agruBattleKilledIds` に含まれる ipid はバトル終了後も `el` の再生成をスキップ（次バトル開始時に `clear()` されるまで復活しない）

## v2.693.0 — 2026-06-15

### feat: ボスアゲルバトル開始/終了時の連携処理追加

- **`public/app.js`** `startAgruBattle`: バトル開始時に会話モードBGMを `_agruBgmPause()` で停止し、通常ボス（`bossState`）が存在すれば消滅アニメーション後に除去
- **`public/app.js`** `endAgruBattle`: バトル終了後に `agruActive` が true なら `_agruBgmPlay()` でBGMを再開し、`bossManuallyCleared` でない場合は `spawnBoss(nextBossHp())` で通常ボスを再召喚

## v2.692.0 — 2026-06-15

### feat/fix: ニュースステッカー — vtate1列化・縦幅スライダー追加・幅0%対応

- **`public/style.css`** `.news-ticker-vtate-item`: `display: flex` → `display: block; writing-mode: vertical-rl` に変更し、ソースバッジとタイトルが同一縦列に並ぶよう1列化
- **`public/style.css`** `.news-ticker-vtate-item .news-source`: `display: inline-block; writing-mode: vertical-rl; margin-bottom: 5px` に変更してバッジも縦書きで1行に統合
- **`public/style.css`** `.news-ticker-vtate-title`: `display: inline` に変更（親の `writing-mode` を継承）
- **`public/app.js`** `newsTickerHeight` 変数追加（デフォルト0=自動）。`applyNewsTickerSettings` で高さ優先順位: 明示指定値 → vtate自動（rows×100px）→ 通常（rows×rowH）
- **`public/app.js`** `handleAdminMessage`: `newsTickerHeightSlider` ハンドラ追加
- **`public/admin.html`** 縦幅スライダー追加（0=自動〜600px、10px刻み）。`_SLIDER_MAP` / `applyState` / `_loadSettingsDirect` に登録
- **`public/admin.html`** `newsTickerWidthSlider`: `min="20"` → `min="0"` に変更し幅を0%まで減らせるように

## v2.691.0 — 2026-06-15

## v2.690.0 — 2026-06-15

### feat: ニュースステッカー — 縦書き縦スクロールモード追加

- **`public/app.js`** `_renderVTate(wrap, items)` 追加。縦書き（`writing-mode: vertical-rl`）で各アイテムを表示し、トラックを縦方向に `-50%` スクロール（シームレスループ）
- **`public/app.js`** `applyNewsTickerSettings`: モードが `vtate` のとき高さを `newsTickerRows × 100px` で計算し `--vtate-max-h` CSS変数も設定。モードボタンのactive判定に `T:'vtate'` を追加
- **`public/app.js`** `renderNewsTicker`: `newsTickerMode === 'vtate'` のとき `_renderVTate` を呼ぶ分岐を追加
- **`public/app.js`** モード切り替えイベントリスナー: `['H','V','S','T']` に拡張
- **`public/style.css`** `.news-ticker-vtate-track / -item / -title` および `@keyframes newsTickerVTateScroll` を追加。タイトルは `writing-mode: vertical-rl; white-space: nowrap; max-height: var(--vtate-max-h)` でコンテナ高さに収まるよう表示
- **`public/admin.html`** 表示モード行に「縦書き↕」ボタン（`id="newsTickerModeTBtn"`）を追加
- **`public/index.html`** adminパネルからのBroadcastChannel経由クリックが届くよう、モードボタン（H/V/S/T/Tategaki）の非表示対応要素を追加（既存のH/V/S/縦書きボタンが動作しない問題も同時修正）

## v2.689.0 — 2026-06-15

### fix: ダメージ数字をエフェクトより手前に表示・サイズ2倍

- **`public/app.js`** `showDamageNumber`: `document.body` に `position:fixed` で追加するよう変更（従来は `#stage` に `position:absolute`）。`#stage` は `position:fixed` で独自スタッキングコンテキストを形成するため内側の z-index がいくら高くても body 直下のエフェクト canvas に負けていた。stage座標→ビューポート座標変換（`sr.left/top` を加算）も追加
- **`public/style.css`** `.dmg-number { position: fixed }` に変更
- **`public/app.js`** `showDamageNumber`: フォントサイズ計算に `×2` を追加し全ダメージ数字を2倍サイズに

## v2.688.0 — 2026-06-15

### fix: 超回復防御中はスキル発動をスキップ

- **`public/app.js`** `_agruBattleDoCounter` の先頭に `if (_agruDefenseActive) return` を追加。超回復スキルによる30秒防御状態が続いている間はカウンタータイマーが発火しても次のスキルを使わない

## v2.687.0 — 2026-06-14

### feat: ボスアゲルバトル — スキルごとの効果音音量設定

- **`public/ageru-boss.html`** 効果音セクションに音量スライダー（0〜100%）を追加。`id="soundVolume-{skillId}"`
- **`public/ageru-boss.html`** `applyConfigToDOM`: `sk.soundVolume` をスライダーに反映（未設定時は 100）
- **`public/ageru-boss.html`** `collectConfig`: `soundVolume` をスキル設定に含めて保存
- **`public/ageru-boss.html`** `playSound`: プレビュー再生時にも設定音量を適用
- **`public/app.js`** `_agruBattlePlayEffect`: `cfg.soundVolume / 100 × seVolume` を Audio の volume に設定

## v2.686.0 — 2026-06-14

### feat: spritePreview — 非表示機能・遅延ロードで軽量化

- **`public/spritePreview.htm`** カード右上に「✕」非表示ボタンを追加。非表示状態は `localStorage`（`spr-hidden` キー）に永続保存
- ツールバーに「非表示: N」ボタンを追加。クリックで「非表示管理中」モードに切り替わり、隠したカードが赤枠で再表示され「復元」ボタンで個別に戻せる
- フォルダをデフォルト折りたたみに変更。展開時のみ API を叩いてカードを生成（遅延ロード）→ 初期表示が大幅に高速化
- シーケンスカード・シートカードとも画像ロードを IntersectionObserver 発火時まで遅延。DOM 上に存在するだけでは HTTP リクエストが飛ばない

## v2.685.0 — 2026-06-14

### feat: spritePreview — 元画像モーダル・設定永続保存

- **`public/spritePreview.htm`** 全カードに「元画像」ボタンを追加。クリックすると元画像をモーダルで表示し、現在の cols/rows に合わせたグリッド線・フレーム番号をオーバーレイ
- cols/rows スライダー変更時にモーダルのグリッドをリアルタイム更新
- シーケンスカードのモーダルに前後ナビゲーション（◀ / ▶）
- cols/rows/fps/frames の設定を localStorage に永続保存（キー: `spr:{folder}/{path}`）。次回ページ読み込み時に自動復元

## v2.684.0 — 2026-06-14

### feat: スプライトプレビューページ追加

- **`public/spritePreview.htm`** 新規作成。`http://localhost:3000/spritePreview.htm` でアクセス可能
- `/api/sprite-folders` と `/api/sprite-list/:folder` を利用して `public/sprite/` 内の全スプライトを自動列挙
- 同一ベース名の連番ファイル（3枚以上）は自動検出してシーケンスアニメとして再生
- 単体PNGはスプライトシートモード（cols / rows / fps / frames を個別調整可能）
- IntersectionObserver でビューポートに入ったカードから自動再生
- フォルダセクションの折りたたみ、全体フィルター検索、全再生/全停止、configコピー機能

## v2.683.0 — 2026-06-14

### fix: 状態異常アイコンをキャラに重ねて表示・1.5倍サイズに変更

- **`public/style.css`** `.agru-status-icon` の配置を `bottom:100%`（頭上）から `top:50%; left:50%`（キャラ中央重ね）に変更。フォントサイズを 22px → 33px（1.5倍）に変更。float アニメーションも `translate(-50%,-50%)` ベースに合わせて修正

## v2.682.0 — 2026-06-14

### feat: 魅了・眠り状態のキャラにアイコン表示

- **`public/style.css`** `.agru-status-icon` を追加。`.avatar-wrap` 内に `position:absolute; bottom:100%` で配置し、上下にふわふわ浮くアニメーション付き
- **`public/app.js`** `_agruSetStatusIcon(user, type)` — キャラの avatar-wrap にアイコン div（💕 / 💤）を追加・差替・除去
- **`public/app.js`** `_agruUpdateAllStatusIcons()` — 全キャラの効果期限を確認してアイコンを更新。`_agruBattleUpdateTimer`（毎秒）から呼び出し
- **`public/app.js`** `_agruClearAllStatusIcons()` — `endAgruBattle` 終了時に全アイコンを一括除去
- **`public/app.js`** charm / sleep スキル適用直後に `_agruSetStatusIcon` を即時呼び出し

## v2.681.0 — 2026-06-14

### feat: 集中砲火スキルに連打画像アニメーション追加・ageru-boss.htmlに設定UI追加

- **`public/app.js`** `_agruFocusFireRapid(images, onDone)` 関数を追加。最大6枚の画像を80ms間隔×3周で高速切替し、終了後にデフォルト画像へクロスフェード復帰。プリロードを100ms先行実行
- **`public/app.js`** `_agruBattlePlayEffect` の `focus_fire` 処理に `cfg.rapidImages` があれば `_agruFocusFireRapid` を優先使用する分岐を追加
- **`public/ageru-boss.html`** 集中砲火スキルカードに「連打画像（最大6枚）」セクションを追加。各スロットに入力欄・画像選択ボタン・プレビューを配置
- **`public/ageru-boss.html`** `applyConfigToDOM` / `collectConfig` / 画像モーダル確定ハンドラ / `_updateRapidImgPreview` を対応追加

## v2.680.0 — 2026-06-14

### fix: リスナー勝利時のキャラ拡大倍率を2倍→1.3倍に変更

- **`public/style.css`** `_agruVicGrow` / `_agruVicBounce` の `scale(2)` を `scale(1.3)` に変更
- **`public/app.js`** `_agruBattleVictoryBounce` クリーンアップ時のインライン transform を `scale(1.3)` に変更

## v2.679.0 — 2026-06-14

### fix: リスナー勝利画像に旧ぷるぷる設定が反映される・アスペクト比が一瞬崩れる問題を修正

- **`public/app.js`** 勝利画像への `src` 切り替え前に `agruBattleCharFigure` 配下の `.puru-canvas` を明示的に除去。旧ボス画像のぷるぷるキャンバスが残存して新 src の描画に適用される問題を解消
- **`public/app.js`** puru-canvas 除去後に `battleCharImg.style.opacity = '0'` を設定してから `src` を変更し、新画像ロード完了後に `opacity: 1` にフェードインすることでアスペクト比崩れを防止

## v2.678.0 — 2026-06-14

### feat: セーブ管理「ID非5桁を削除」ボタン追加・「全削除」ボタン削除

- **`public/admin.html`** セーブ管理の「全削除」ボタンを削除
- **`public/admin.html`** 「ID非5桁を削除」ボタンを追加。`/api/char-save` から全キーを取得し `/^\d{5}$/` にマッチしないキーを一括削除する `deleteNonNumericIdSave()` を実装

## v2.677.0 — 2026-06-14

### feat: ボスアゲルHP0時に砕け散りスローモーションエフェクト追加

- **`public/app.js`** `_agruShatterEffect(onDone)` 関数を追加。画面をジッター付き三角形シャード40枚に分割し、白フラッシュ演出後に各シャードがスローモーション（`cubic-bezier(0.03,0,0.82,1)`）でランダム方向に飛び散る。終了後に `onDone` を呼び出す（所要時間 約1.8秒）
- **`public/app.js`** `_agruPlayerVictoryIntro()` 関数を追加。HP0検知時に `_agruVictoryPending` フラグで多重起動を防ぎながら `_agruShatterEffect` を起動し、完了後に `endAgruBattle('players')` を呼び出す。タイマー類はイントロ開始時に即停止
- **`public/app.js`** HP0判定の3箇所（`_agruBattleDealDamage`・`_launchAtkBubble`・`_agruBreakDefense`）を `endAgruBattle('players')` 直接呼び出しから `_agruPlayerVictoryIntro()` に変更
- **`public/app.js`** `endAgruBattle` 冒頭で `_agruVictoryPending = false` をリセット

## v2.676.0 — 2026-06-14

### fix: リスナー勝利時に背景等がすぐ消える問題を修正・ボスアゲル画像を勝利画像に差し替え

- **`public/app.js`** `endAgruBattle('players')` 時に `_agruApplyBattleBg(null)` と `_resetBossLayoutConfig()` を即時実行しないよう変更。10秒後のフェードアウト完了後に実行することで、バトル背景が10秒間維持されるようになった
- **`public/app.js`** リスナー勝利時に `agruBattleCharImg` の `src` を `winImage` に差し替えてボスフィギュアエリアに勝利画像を表示。従来の `#stage` 上への `_agruWinOverlay` 挿入は廃止

## v2.675.0 — 2026-06-14

### fix: 設定値が起動時に反映されない問題を修正（早押し・ニコ・ボスバトルパラメータ）

- **`public/app.js`** `hayaoshiFreq` / `hayaoshiSpeed` の初期値を `localStorage` から直接読み込むよう変更。`initHayaoshiFreqSlider` / `initHayaoshiSpeedSlider` はスライダー要素が `index.html` に存在しないため早期リターンしており、保存値が反映されていなかった
- **`public/app.js`** `nikoFontSize` / `nikoOpacity` の初期値も同様に `localStorage` から読み込むよう修正
- **`public/app.js`** `bossHpScale` / `bossAtkCoeff` / `bossCounterRate` / `brHpMult` / `taimanHpMult` の初期値も `localStorage` から読み込むよう修正。いずれも対応する init IIFE がスライダー要素の有無で早期リターンしており、`index.html` 上で設定値が反映されていなかった

### fix: リスナー勝利時のバウンスアニメーションが元サイズに戻らない問題を修正

- **`public/app.js`** `_agruBattleVictoryBounce` のクリーンアップが `#a-{ipid}`（内側 avatar div）に対して行われていたのを `u.el`（クラスを付けたのと同じ要素）に修正。アニメ終了状態の `scale(2)` をインラインで固定してからクラスを外すことで滑らかな `scale(1)` への戻りを実現
- **`public/app.js`** バウンスリセット後に `gatherCharactersBottom()` を呼び出して下集合を実行するよう追加

### feat: リスナー勝利時のアゲル系キャラ処理を消滅からランダム変更に変更

- **`public/app.js`** 勝利時のアゲル系キャラを消滅させる代わりに `availableImages` からランダムな非アゲル系画像に変更し `applyAvatarStyle` で更新。変更後のキャラも勝利バウンスに参加する

### feat: リスナー勝利時のボスUI を10秒後にフェードアウト

- **`public/app.js`** `endAgruBattle('players')` 時にボスオーバーレイ・ボスフィギュアラップ・キャララップの即時非表示をスキップし、10秒後に `opacity 1.5s ease` トランジションでフェードアウトするよう変更

## v2.674.0 — 2026-06-14

### fix: ボスアゲル終了時に水平反転が残るキャラがいる問題を修正

- **`public/app.js`** `_agruBattleRestoreChars` を修正。`_preBattleFacing` が `undefined` のキャラ（バトル前に `facingRight` 未設定だったキャラ）も `applyFacingFlip` を必ず呼ぶよう変更。バトル中に `placeGroup` で強制セットされた向きを確実に解除する。`_preBattleX` が設定済み（＝集合対象だった）場合のみ `facingRight` を削除して初期状態に戻す

## v2.673.0 — 2026-06-14

### feat: リスナー勝利画像をキャラ背面に表示・砂エフェクトで消去

- **`public/app.js`** 勝利画像を `position:fixed;background:黒` のオーバーレイから `position:absolute;inset:0` で `#stage` 先頭に挿入する方式に変更。キャラ要素は `stage.appendChild` で後から追加されるため自然にキャラが前面になる
- **`public/app.js`** 背景暗化・クリック消去を廃止。表示時間を15秒→10秒に変更
- **`public/app.js`** `_agruWinImageDisintegrate(container)` を新規追加。10秒後に起動し、画像をオフスクリーンCanvasでピクセルデータ化→STEP=6pxのパーティクル（重力・摩擦・ランダム遅延あり）が散って砂のように消えるアニメーションを実装。パーティクルcanvasも `#stage` 内（キャラ背面）に配置

## v2.672.0 — 2026-06-14

### feat: リスナー勝利時に生存キャラが2倍バウンス演出

- **`public/app.js`** `_agruBattleVictoryBounce()` を新規追加。`endAgruBattle('players')` の400ms後に呼び出し。生存キャラ全員に `agru-victory-bounce` クラスを付与し、10.4秒後にスプリングトランジションで元サイズに戻す
- **`public/style.css`** `@keyframes _agruVicGrow`（0.5s で scale(1)→scale(2)）と `@keyframes _agruVicBounce`（0.65s×15回 translateY バウンス）を追加。`.agru-victory-bounce` クラスで transform-origin:bottom center を設定し足元起点でキャラが大きくなる

## v2.671.0 — 2026-06-14

### fix: アゲル勝利・全滅後に会話モーダルの画像・サイズ・位置が崩れる問題を修正

- **`public/app.js`** `_agruRestoreModal()` を新規追加。`agruDefaultImage` でキャラ画像を復元し、`agruModalWidth` / `agruModalHeight` / `agruModalBgOpacity` / localStorage 位置情報でモーダルの見た目を完全に再適用する
- **`public/app.js`** `endAgruBattle` の `'ageru'`（タイムアップ）・`'wipe'`（全滅）両ブランチで `classList.remove('hidden')` 単体呼び出しを `_agruRestoreModal()` に統一。画像非表示・サイズ崩れ・位置ずれをまとめて解消

## v2.670.0 — 2026-06-14

### feat: ボスアゲル全滅エンディング実装

- **`public/app.js`** `_agruBattleWipe()` を新規追加。全員討伐時にタイマーを即時停止し、全滅専用セリフ（`battleWipeSpeech`）を再生、全滅専用画像（`wipeImage`）を全画面表示。3.5秒後にフェードアウト（シーンチェンジ）してバトルを終了する
- **`public/app.js`** `_agruBattleKillUser` に全滅チェックを追加。`user.el = null` 後に `_agruBattleGetAliveUsers().length === 0` を検出すると `_agruBattleWipe()` を 700ms 遅延で起動
- **`public/app.js`** `endAgruBattle('wipe')` ブランチを追加。全滅時は全員 MP を 0 にし、アゲルちゃん会話モーダルを再開
- **`public/app.js`** `_agruWipePending` フラグを追加し二重起動を防止。`startAgruBattle` でリセット
- **`data/bossAgruConfig.json`** `battleWipeSpeech`（全滅時セリフ）・`wipeImage`（全滅時専用画像ファイル名）フィールドを追加

## v2.669.0 — 2026-06-14

### feat: ボスアゲル攻撃演出をコメント吹き出し飛翔モーションに変更

- **`public/app.js`** `_launchAtkBubble(user, text)` を新規追加。コメントテキストを吹き出し形の DOM 要素として生成し、2次ベジェ曲線（アーク軌道）で420ms かけてボスアゲルへ飛翔させる。スケール縮小・フェードアウトで遠近感を演出
- **`public/app.js`** `attackAgruBoss` のシグネチャに `msgText` を追加。コメント呼び出し元 (line 4274) からメッセージ本文を渡すよう変更
- **`public/app.js`** ヒットループの遅延を `FLIGHT_MS (420ms) + i*200ms` に変更。吹き出しがボスに到達するタイミングで最初のダメージが入るよう同期

## v2.668.0 — 2026-06-14

### fix: 早押し演出（頻度・速度）が保存されない問題を修正

- **`public/admin.html`** `_SLIDER_MAP` の `hayaoshiFreqSlider`/`hayaoshiSpeedSlider`: save 関数が `parseInt(v)*1000` (ms換算) で保存していたが、app.js は秒のまま (`d.value`) を localStorage に保存するため `parseInt(v)` (直値) に修正
- **`public/admin.html`** `_loadSettingsDirect()`: `hayaoshiFreq`/`hayaoshiSpeed` を `/1000` 変換せず直接スライダー値として渡すよう修正（変換は app.js 起動時に行われる）

## v2.667.0 — 2026-06-14

### fix: admin.html の設定保存を app.js 非依存に変更

- **`server.js`** `makeDataEndpoints()` に `PATCH /api/settings` を追加。既存設定とマージして保存するため admin.html が個別キーを上書きできる
- **`public/admin.html`** `adminSend()` に `_adminDirectSave()` フックを追加。スライダー・テキスト・セレクト等すべての設定変更を `/api/settings` へ直接 PATCH 保存（app.js が切断中でも確実に永続化）
- **`public/admin.html`** `_loadSettingsDirect()` を追加。ページ起動時に `/api/settings` を直接フェッチしてフォームを復元（app.js が未起動でも設定を表示できる）
- スライダー ID → settings.json キー + 値変換の対応表 `_SLIDER_MAP` を定義（全スライダー網羅）

## v2.666.0 — 2026-06-14

### fix: admin.htmlで変更した設定が保存されない問題を修正

- **`public/app.js`** スライダーハンドラ全体: 各 `else if` の末尾に個別で `saveSettingsToServer()` を書いていたものを、ブロック末尾に一括呼び出しに変更。未保存だったスライダー（niko/hayaoshi/bossAtk/counterRate/afk など）が保存されるように
- **`public/app.js`** `type:'color'` ハンドラ: `bgColor` の DOM 要素が index.html に存在しないため設定が完全に無視されていた → DOM がない場合は `applyBgColor()` + localStorage + save を直接実行
- **`public/app.js`** `type:'select'` ハンドラ: `moveAreaSelect` の DOM 要素が index.html に存在しないため無視されていた → DOM がない場合は `moveArea` 変数 + localStorage + save を直接設定
- **`public/app.js`** `type:'volumeText'` ハンドラ: localStorage 保存後に `saveSettingsToServer()` を追加
- **`public/app.js`** `type:'sdText'` ハンドラ: localStorage 保存後に `saveSettingsToServer()` を追加
- **`public/app.js`** `type:'slotMp'` / `type:'wordleRows'` ハンドラ: `saveSettingsToServer()` を追加

## v2.665.0 — 2026-06-14

### fix: アゲル系キャラが透明ゴーストで残留する問題を修正

- **`public/app.js`** `endAgruBattle('players')` のアゲル系キャラ消滅処理: `u.el` を即 `null` にして `_killedEl` にキャプチャ。これまでは1秒後の削除タイマーまで `u.el` が残り、同じキャラが透明で残留していた

### fix: autoReplyWords/Messages が再起動後に消える問題を修正

- **`public/app.js`** `SETTINGS_KEYS` に `autoReplyWords`・`autoReplyMessages` を追加。これまで localStorage 止まりで `settings.json` に保存されなかった
- `autoReplyConfig` 受信時に `saveSettingsToServer()` を呼び出し、即座にディスクへ永続化するよう変更

---

## v2.663.0 — 2026-06-14

### fix: ボスアゲル削除キャラが透明ゴーストで残り新キャラが生成されない問題を修正

- **`public/app.js`** `_agruBattleKillUser()`: `user.el` をスプライトエフェクト計算直後に即 `null` にするよう変更。これまでは1500ms後のタイマー発火まで `user.el` が残り、同じPIDのコメントが来ても `ensureCharOnStage` が `user.el` を検知してスキップしていた
- DOM削除は `_killedEl` にキャプチャして1500ms後に実行（既存の削除タイミングは維持）

---

## v2.662.0 — 2026-06-14

### feat: リスナー勝利後はアゲル系キャラをキャラ生成プールから除外

- **`public/app.js`**: `_agruPlayersWon` フラグを追加。`endAgruBattle('players')` 時に `true` にセット（ページリロードまで維持）
- **`public/app.js`** `ensureCharOnStage()`: `_agruPlayersWon` が true かつ `agruBattleConfig.agruTypeImages` が設定されている場合、対応するキャラIDをランダム選択プールから除外
- アゲル系画像が設定されていない、または勝利前は従来通りの挙動を維持

---

## v2.661.0 — 2026-06-14

### fix: リスナー勝利画像が消えない問題を修正

- **`public/app.js`**: 勝利オーバーレイ（`_agruWinOverlay`）にクリック消去に加えて15秒自動消去タイマーを追加。クリックした場合はタイマーもキャンセルする

---

## v2.660.0 — 2026-06-14

### feat/fix: 盾キャラ+超回復同時発動時の挙動改善

- **`public/app.js`** `_agruBattleDealDamage()`: 盾キャラが生存中かつ超回復防御状態のとき、ボスHPを完全に減らさないよう修正（ペット効果・呪いなど直接ダメージ関数経由のパスも防御）
- **`public/app.js`** `_agruReleaseShield()`: `skipPositionRestore` 引数を追加。`true` のとき位置を元に戻さず中央に留まる（盾破壊による死亡用）
- **`public/app.js`** 盾HP=0で死亡する呼び出しを `_agruReleaseShield(true)` に変更。盾キャラが殺されたときは中央に留まったままセーブデータ削除エフェクトを待つ
- タイマー解放（30秒経過）は従来通り元の位置に戻す（引数なし = `false`）

---

## v2.659.0 — 2026-06-14

### feat: 盾キャラ攻撃の仮想HPを設定画面から変更可能に

- **`public/ageru-boss.html`** `buildSkillCards()`: `shield_char` スキルカードに「盾キャラ 仮想HP」入力欄（`id="shieldMaxHp"`）を追加
- **`public/ageru-boss.html`** `applyConfigToDOM()`: `config.shieldMaxHp` を読み込んで入力欄に反映
- **`public/ageru-boss.html`** config収集: `shieldMaxHp` フィールドを保存対象に追加（デフォルト: 99999）
- **`public/app.js`** `_agruActivateShield()`: ハードコードの `99999` を `agruBattleConfig?.shieldMaxHp ?? 99999` に変更
- **`public/app.js`** `_agruUpdateShieldHpDisplay()`: `MAX_HP` を同様に設定値参照に変更
- **`public/app.js`** 盾発動時のシステムメッセージも設定値を表示するよう修正

---

## v2.658.0 — 2026-06-14

### fix: 超回復防御中のバトルログに本来の値が表示される問題を修正

- **`public/app.js`** `attackAgruBoss()`: `_agruBattleLog()` の呼び出しがダメージ計算後・setTimeout外にあったため、防御中でも `totalDmg`（防御前の値）がログに記録されていたバグを修正
- 防御中は実際に入るダメージ（1dmg × ヒット数）で `🛡️ N dmg` と表示するよう変更。通常時は従来通り

---

## v2.657.0 — 2026-06-14

### fix: 強制終了時にリスナー勝利画像が表示される問題を修正

- **`public/ageru-boss.html`** `bossBattleEnd()`: 送信する `result` を `'players'` → `'force'` に修正。これまで管理画面の「強制終了」ボタンがリスナー勝利と同じ結果を送っていたため勝利画像が出ていた
- **`public/app.js`** `endAgruBattle()`: 関数先頭で `_agruWinOverlay` を必ず除去するように修正。前回バトルの勝利オーバーレイが残り続けるバグを解消
- **`public/app.js`** `endAgruBattle()`: `result === 'force'` 分岐を追加。強制終了時はMP変化なし・勝利演出なし・会話モード状態を維持したまま静かに終了
- **`public/app.js`** ソケットハンドラ: `d.result || 'players'` → `d.result || 'ageru'` に変更。`result` 未指定時のデフォルトをボス勝利に変更（リスナー勝利は明示的に指定された場合のみ発動）

---

## v2.656.0 — 2026-06-14

### ボスアゲル 超回復シールドを拡大・高濃度化

- **`public/app.js`**: `_agruDefenseShieldStart()` のシールド半径を `0.42 → 0.56`（約33%拡大）に変更
- 背景グラデーションアルファを約2倍（0.10→0.22 / 0.06→0.14）に増加
- 外側六角形の line-width を 2.5→3.5、アルファ 0.80→0.95 に増加、グロー shadowBlur を 20→30 に拡大
- 内側回転六角形・スポーク・ダイヤのアルファも同様に増加（約1.5倍）
- 中心コアグロー半径を R*0.32→R*0.35、アルファ 0.55→0.75 に増加
- ヒットフラッシュアルファを 0.18→0.25 に増加
- ひび割れの白ライン線幅・アルファも増加（0.7→0.9、1.5→2.0）

---

## v2.655.0 — 2026-06-14

### ボスアゲル 超回復防御中シールドエフェクト

- **`public/app.js`**: `_agruDefenseShieldStart()` / `_agruDefenseShieldStop()` を追加
- 防御開始時にボスキャラの前面に Canvas 製六角形幾何学シールドを表示。外側六角形 + 回転する内側六角形3枚 + スポーク + 頂点ダイヤの多層構造
- ダメージ蓄積（`_agruDefenseDmgAccum`）が増えるほど外枠が欠け・内側の六角形が消え・ひび割れ（12本、疑似乱数で事前生成）が増加し、崩壊直前は大きくひびだらけになる演出
- ダメージ着弾時に白フラッシュ（`hitFlash`）
- 防御解除（時間切れ・崩壊）と `endAgruBattle()` で canvas を除去

---

## v2.654.0 — 2026-06-14

### fix: ぷるぷる設定が画像ごとに切り替わらない問題を修正

- **`public/app.js`**: `_agruUpdateBossImgByHp()` が `battleImg.src` を直接セットした後に `updateBossAgruPurupuru()` を呼んでいなかったバグを修正。HP変化で画像が切り替わった際に前の画像のぷるぷる設定がそのまま残っていた
- **`public/app.js`**: `_agruActivateDefense()` の防御画像切り替え後にも `updateBossAgruPurupuru()` を追加。画像ごとに設定された `purupuruMap` エントリを正しく適用するよう修正
- 既存の `_bossCrossfadeImg()`（スキルエフェクト時）はすでに `updateBossAgruPurupuru()` を呼んでいたため変更不要

---

## v2.653.0 — 2026-06-14

### ボスアゲル 盾キャラ調整

- **`public/app.js`**: 盾キャラの拡大倍率を 3倍 → **2倍** に変更
- **`public/app.js`**: 盾HP表示を盾キャラの右横に配置（scale(2)の視覚右端 + 12px）
- **`public/app.js`**: 盾HP表示を半透明化（SVG全体 `opacity:0.6`、背景 `rgba(10,20,50,0.7)`）

---

## v2.652.0 — 2026-06-14

### ボスアゲル 盾キャラ攻撃の強化

- **`public/app.js`**: `_agruActivateShield()` でキャラの拡大を `width/height` ではなく `transform: scale(3)` で実装。アバター画像が実際に3倍に拡大されるよう修正（従来は `.character` コンテナの width/height を変えても `.avatar` 子要素の視覚サイズは変わっていなかった）
- **`public/app.js`**: 中央への位置計算を `scale(3)` の transform-origin に合わせて修正（`left = stageW/2 - cw/2`）
- **`public/app.js`**: `_agruReleaseShield()` / バトル終了リセットで `transform` を復元するよう修正
- **`public/app.js`**: `_agruUpdateShieldHpDisplay()` 関数を追加。六角形SVGバー（数値のみ）で盾HPを表示。ダメージで青フィルが減少し、盾消滅・解放時に非表示になる

---

## v2.651.0 — 2026-06-13

### ボスアゲル スキル発動確率リアルタイム表示

- **`public/ageru-boss.html`**: `SKILL_DEFS` に `minHpPct` フィールドを追加（berserk=50、instant_kill/shield_char/delete_char=25）
- **`public/ageru-boss.html`**: `TIER_LOWER_BOUNDS` 定数を追加（各HPティアの下限値）
- **`public/ageru-boss.html`**: 各ウェイト入力欄の下に `<span class="weight-pct">` を追加、ティアごとの実発動確率（%）をリアルタイム表示
- **`public/ageru-boss.html`**: `.weight-pct` CSS追加（pct-hi=緑≥30%、pct-mid=黄≥10%、pct-lo=グレー、pct-na=薄暗/イタリック）
- **`public/ageru-boss.html`**: `_recalcSkillProbs()` 関数を追加。HP条件外ティアは「—」表示、disabled時は非表示
- **`public/ageru-boss.html`**: ウェイト入力 `oninput`、有効チェックボックス `onchange` で `_recalcSkillProbs()` を呼び出し
- **`public/ageru-boss.html`**: `applyConfigToDOM()` 末尾で `_recalcSkillProbs()` を呼び出しロード後に初期計算

---

## v2.650.0 — 2026-06-13

### fix: 超回復防御中に専用画像がデフォルト画像に上書きされる問題を修正

- **`public/app.js`**: `_agruBattlePlayEffect()` でスキルエフェクト後にデフォルト画像へ戻す処理が防御中に走っていた問題を修正。`_agruDefenseActive` のとき画像切替ブロック全体をスキップするよう変更
- 2秒後のデフォルト復帰タイマーも `!_agruDefenseActive` チェックを追加し、防御解除前に発火しても上書きしないよう対処

---

## v2.649.0 — 2026-06-13

### ボスアゲル 超回復防御中の画像固定化

- **`public/ageru-boss.html`**: 「防御中画像」フィールドを追加（HP別画像セクション直下）。画像選択モーダルに `defense` ターゲット対応を追加
- **`public/ageru-boss.html`**: `applyConfigToDOM()` / `collectConfig()` に `defenseImage` を追加
- **`public/app.js`**: `_agruUpdateBossImgByHp()` に `_agruDefenseActive` 中はスキップするガードを追加
- **`public/app.js`**: `_agruActivateDefense()` で防御開始時に `defenseImage` を設定（空欄時は現在の画像を維持）
- **`public/app.js`**: 防御タイムアウト終了・`_agruBreakDefense()` 両方で `_agruLastHpBucket = null` してから `_agruUpdateBossImgByHp()` を呼び出し、HP別画像に復帰

---

## v2.648.0 — 2026-06-13

### ボスアゲルバトル: HPゲージ表示改善・早押し非表示

- **`public/style.css`**: `#agruBattleHpCanvas` に `filter: drop-shadow()` を追加。HPゲージ円弧が自然にグロー発光するように変更（タイマーと同様の演出）
- **`public/style.css`**: `#agruBattleHpNum` の `text-shadow` を削除し、`filter: drop-shadow()` に変更（タイマー `#bossTimerDigits` と同等の多層グロー）。HP低下時の `.boss-hp-low` も同様に更新
- **`public/app.js`**: `updateAgruBattleHpDisplay()` から `numEl.style.textShadow` の設定を削除（CSS filter に統一）
- **`public/app.js`**: `startAgruBattle()` でボスバトル開始時に早押し自動タイマーを停止し、既存の早押し要素を削除
- **`public/app.js`**: `endAgruBattle()` でバトル終了後に早押しタイマーを再開（配信中かつコンパクトモードでない場合）
- **`public/app.js`**: `startHayaoshi()` / `startHayaoshiAutoWhite()` / `startHayaoshiAutoRed()` に `agruBattleActive` 中はスキップするガードを追加

---

## v2.647.0 — 2026-06-13

### admin.html → index.html 通信の全ボタン・スライダー修正

管理パネルを admin.html に分離したことで DOM 要素が index.html から消え、BroadcastChannel 経由の操作がすべて無効になっていた問題を修正。

- **`public/app.js`**: `_adminBtnDispatch()` 関数を追加。`handleAdminMessage` の `type:'click'` で DOM 要素が見つからない場合に直接 JS 関数を呼ぶ（clearStage・gatherBtn・hayaoshiBtn・battleRoyaleBtn・toggle系など全 30 ボタン対応）
- **`public/app.js`**: `type:'slider'` ハンドラに DOM 要素がない場合の直接変数更新を追加（hayaoshiFreq/Speed・nikoSize/Opacity・bossHpScale/AtkCoeff・counterRate・brHpMult・taimanHpMult・charSize・bossSize・dmgFontScale・newsTicker系・panel系・afk系・kai系・autoDeleteMinutes・seVolume・voiceVolume）
- **`public/app.js`**: `getState` レスポンスにすべての欠落スライダー値を JS 変数から設定するよう追加（admin.html 初期値の正しい同期）

---

## v2.646.0 — 2026-06-13

### app.js：管理モーダル削除後のnull参照クラッシュを修正

- **`public/app.js`**: `bgColorInput` / `bgImageBtn` / `bgImageInput` / `bgClearBtn` の null 参照クラッシュを修正（`initBg` IIFE が起動時クラッシュする問題）
- **`public/app.js`**: 管理モーダル内にあった全ボタン・スライダー要素（`clearStage`, `toggleLog`, `copyObsUrl`, `gatherBtn` 等 40件以上）への `addEventListener` 呼び出しに `?.` オプショナルチェーンを追加
- **`public/app.js`**: `openImgModal` の `addEventListener` を `?.` 対応に修正
- **`public/app.js`**: `initSlotSound` / `restorePanelVisibility` IIFE 内の `slotSoundBtn` / `brTimerBtn` への直接 `classList` アクセスを `?.` 対応に修正
- **`public/app.js`**: 起動時に実行される toggle ボタン状態復元コード（`toggleBombBtn` / `toggleTrashBtn` / `toggleStatsBtn` / `toggleBreatheBtn` / `toggleBossFloatBtn` / `toggleCharNameBtn` / `toggleNewsTickerBtn`）を `?.` 対応に修正
- **`public/app.js`**: SD設定 IIFE 内の `sdWidthInput` 等 13要素への直接プロパティ代入を null ガード（`_sdSet` ヘルパー）に変更

---

## v2.645.0 — 2026-06-13

### メインページから管理パネルボタン・ヘルプセクションを削除

- **`public/index.html`**: `#adminBtn`（⚙️ 管理）ボタンを設定バーから削除
- **`public/index.html`**: `#adminModal`（管理パネルモーダル、全設定グループ含む）を削除
- **`public/index.html`**: `#emptyHint` 内のヘルプコンテンツ（開始ボタン案内・コマンド生成・基本コマンド・ゲーム等タブ）を削除。`#emptyHint` div 自体は app.js の表示制御のため残存
- **`public/index.html`**: `CmdGen` / `switchHintTab` インラインスクリプトを削除
- **`public/app.js`**: `adminModal` / `adminBtn` / `closeAdminModal` 関連イベントリスナーを削除

---

## v2.644.0 — 2026-06-13

### 歌詞：黒のみカラーモード追加・点滅廃止・黒カラー追加

- **`public/app.js`**: `_LYRIC_COLORS` に `black: ['#000000']` を追加、全パレットに `#000000` を追加
- **`public/ageru-boss.html`**: カラーモード選択肢に「⬛ 黒のみ」を追加
- **`public/style.css`**: beat 点滅アニメーション（`lyrBeatPulse` / `.lyr-beat`）を廃止

---

## v2.643.0 — 2026-06-13

### ボスアゲル設定：フォント指定・歌詞ブラー・静かな演出

- **`public/ageru-boss.html`**: タイマー・HP数値・バトルログ・セリフ・歌詞の各設定セクションにフォント選択を追加（`_BOSS_FONT_OPTS` 共通テンプレート、OBS 対応 Webフォント・カスタムフォント含む）
- **`public/ageru-boss.html`**: `applyConfigToDOM()` / `collectConfig()` にて各フォント設定（timer.font / hpGauge.numFont / battleLog.font / speech.font / lyricsEffect.font）を読み書き
- **`public/app.js`**: `_applyBossLayoutConfig()` / `_applyTimerConfig()` でタイマー・HP数値・ログ・セリフにフォントを適用
- **`public/ageru-boss.html`**: 歌詞フロートエフェクト設定に「ブラー (px)」欄を追加（0〜20px）
- **`public/app.js`**: `.lyr-outer` に `filter:blur(Xpx)` を適用、`lyricsFloatBlur` / `lyricsFloatFont` state var を追加
- **`public/style.css`**: 歌詞アニメを全面改定。派手な演出を廃止し、フェード・ドリフト・ブリーズを中心とした7種の出現/6種の消失アニメに変更（出現 1.3〜1.6s、消失 1.8〜2.0s）

---

## v2.642.0 — 2026-06-13

### 歌詞フロートエフェクト・盾キャラ 2倍サイズ＋引っ張りモーション実装

- **`public/app.js`**: `LYRICS_DATA`（65フレーズ、重み付き）定数を追加
- **`public/app.js`**: `lyricsFloat*` 状態変数群・`_lyricsSpawnLine()` / `startLyricsFloat()` / `stopLyricsFloat()` 関数を追加
- **`public/app.js`**: `_applyBossLayoutConfig()` にて `config.lyricsEffect` から各設定を読み込み。`startAgruBattle()` / `endAgruBattle()` で開始/停止
- **`public/style.css`**: `#lyricsFloatContainer` / `.lyr-outer` / `.lyr-inner` スタイル・歌詞アニメを追加
- **`public/style.css`**: `.agru-battle-log-entry` に `--agru-log-bg-opacity` / `--agru-log-font-size` CSS 変数を適用
- **`public/app.js`**: `_agruActivateShield()` を改修 — Phase 1（160ms 逆引き 7%）+ Phase 2（`cubic-bezier(0.25,0,0.1,1.45)` バネ、2倍サイズで中央へ）

---

## v2.631.0 — 2026-06-13

### ボスアゲルバトル解説セクションをルートの index.html に追加

- **`index.html`**: サイドバーに「👹 ボスアゲルバトル」リンク（`#sec-ageru-boss`）を追加
- **`index.html`**: `#sec-ageru-boss` セクションを新規追加（`#sec-boss` の直後）
  - バトル概要・攻撃の仕組み・セーブ削除リスク・バトル結果の4枚カード
  - 全15スキルを網羅したスキル一覧テーブル（効果・発動条件）
  - 盾キャラ（shield_char）・超回復（super_heal）の詳細カード
  - タイマー演出・HP段階別画像・飛び込み演出の説明
  - 管理者向け設定ガイド（8項目のボタン説明）

---

## v2.630.0 — 2026-06-13

### ボスアゲルバトル解説セクションを index.html に追加

- **`public/index.html`**: ヒントパネルに新タブ「👹 ボスバトル」（`switchHintTab(6)`）を追加
- 概要カード（バトルの流れ・セーブ削除リスクの説明）
- 攻撃の仕組み（コメント攻撃・文字数ヒット数・クリティカル・早押しバフ）
- 状態異常一覧（石化/眠り/魅了/呪い の効果と持続時間）
- 勝利条件と結果（リスナー勝利・アゲル勝利それぞれの効果）
- バトルUI演出（HPグレーアウト・タイマー赤黒化・HPリール・HP別画像・飛び込み演出）
- スキル一覧テーブル（全15種：効果・発動条件を網羅）
- 盾キャラ攻撃の詳細解説
- 超回復の詳細解説（防御崩壊条件・演出）
- 管理者向け操作ガイド（設定画面・各種設定項目）

---

## v2.629.0 — 2026-06-13

### ボスアゲル：新スキル「超回復」追加

- **`public/app.js`**: `AGRU_BATTLE_SKILLS` に `super_heal`（weights: [0,1,3,5]）を追加
- **`public/app.js`**: 状態変数 `_agruDefenseActive`・`_agruDefenseDmgAccum`・`_agruDefenseTimer` を追加
- **`public/app.js`**: `_agruActivateDefense()` — 防御状態開始；30秒タイマーで自動回復（HP+50%）
- **`public/app.js`**: `_agruBreakDefense()` — 累積100ダメージで防御崩壊；ガラス破砕エフェクト再生・鎧破砕音再生・HP-10%ペナルティ
- **`public/app.js`**: `_agruGlassShatterEffect()` — canvas ベースのガラス破片パーティクルアニメーション（28個の三角/四角形ポリゴン、重力・フェードアウト付き）
- **`public/app.js`**: `attackAgruBoss()` に防御インターセプト — 防御中は `actualDmg=1` に制限し累積カウント、100達成で `_agruBreakDefense()` 呼び出し
- **`public/app.js`**: `_agruBattleDealDamage()` にも防御インターセプトを追加
- **`public/app.js`**: `_agruBattleDoCounter()` に `super_heal` ケース追加
- **`public/app.js`**: `endAgruBattle()` で防御状態・タイマーをリセット
- **`public/ageru-boss.html`**: `SKILL_DEFS` に `super_heal` エントリ追加（説明文付き）
- **`public/style.css`**: `#agruBattleCharImg.agru-defense` — 青白いグロー点滅アニメ

---

## v2.628.0 — 2026-06-13

### ボスアゲル：HP数値をリール式アニメーションに変更
- **`public/app.js`**: `_buildHpNumReels(el, str)` / `_updateHpNumReels(el, str)` 関数追加 — タイマーと同じリールDOM構造をHP数値に適用
- **`public/app.js`**: `updateAgruBattleHpDisplay()` でHP数値更新を `textContent` から `_updateHpNumReels()` に変更
- **`public/app.js`**: HP数値要素の `display: block` を `display: flex` に変更（リール横並び用）
- **`public/style.css`**: `#agruBattleHpNum` に `align-items/justify-content: center` 追加
- **`public/style.css`**: `.hp-reel-sep` スタイル追加（桁区切りカンマ用、`.timer-reel-colon` 相当）

---

## v2.627.0 — 2026-06-13

### ボスアゲル：スキル説明文・削除エフェクト・新スキル2種・終了演出追加

#### A. スキル設定画面に説明文を追加
- **`public/ageru-boss.html`**: `SKILL_DEFS` に `desc` フィールドを追加（全スキルに効果説明文）
- **`public/ageru-boss.html`**: `buildSkillCards()` のスキルヘッダーに説明文を表示（グレー小テキスト、折り畳み状態でも常時表示）

#### B. キャラ削除エフェクト設定を追加
- **`public/ageru-boss.html`**: 「キャラ削除エフェクト」セクション追加 — スプライトアニメ設定（path / cols / rows / frameCount / fps / size）
- **`public/app.js`**: `_agruBattleKillUser()` でキャラ削除時に `agruBattleConfig.deleteEffect` スプライトを再生（キャラ中央に canvas を配置）

#### C. 新スキル：盾キャラ攻撃 (`shield_char`)
- **`public/app.js`**: `AGRU_BATTLE_SKILLS` に `shield_char`（weights: [0,0,2,4], minHpPct:25）を追加
- **`public/app.js`**: `_agruActivateShield(user)` — ランダムキャラをサイズ×1.5で画面中央へ移動、仮想HP99999付与、30秒タイマーで自動解放
- **`public/app.js`**: `_agruReleaseShield()` — 盾解除、元位置・サイズ・スタイル復元
- **`public/app.js`**: `attackAgruBoss()` に盾インターセプト処理 — 盾キャラ存在中はダメージが盾HPへ。HP0で盾キャラ削除
- **`public/ageru-boss.html`**: `SKILL_DEFS` に `shield_char` エントリ追加（説明文付き）
- **`public/style.css`**: `.agru-shield-char` — 青いグロー点滅アニメ

#### D. 新スキル：デリート攻撃 (`delete_char`)
- **`public/app.js`**: `AGRU_BATTLE_SKILLS` に `delete_char`（weights: [0,0,1,3], minHpPct:25）を追加
- **`public/app.js`**: `_agruBattleDoCounter()` に `delete_char` ケース — ランダムキャラへ `agru-float-delete` クラス付与後 2000ms で `_agruBattleKillUser()`
- **`public/ageru-boss.html`**: `SKILL_DEFS` に `delete_char` エントリ追加（説明文付き）
- **`public/style.css`**: `.agru-float-delete` — 上昇フェードアウトアニメ

#### E. 終了演出：アゲル勝利（ボス勝利）
- **`public/app.js`**: `endAgruBattle()` の else ブランチ修正 — 勝利後に会話モーダルを再表示して何事もなかったように会話再開（agruActive/agruIdle は維持）

#### F. 終了演出：リスナー勝利（プレイヤー勝利）
- **`public/ageru-boss.html`**: 「終了演出設定」セクション追加 — リスナー勝利画像・アゲル系キャラリスト（ファイル名＋プレビュー）
- **`public/app.js`**: `endAgruBattle()` の players ブランチ — 勝利画像を全画面表示（クリックで閉じる）
- **`public/app.js`**: `endAgruBattle()` の players ブランチ — `agruBattleConfig.agruTypeImages` 一致キャラをフェードアウト消滅

#### クリーンアップ
- **`public/app.js`**: バトル終了時に盾状態・`agru-float-delete` クラスをリセット
- **`public/app.js`**: `_agruBattleRestoreChars()` の後に `agru-float-delete` クラスを除去

---

## v2.626.0 — 2026-06-13

### ボスアゲル：残HP 10%刻みでボス画像を切り替え可能に
- **`public/app.js`**: `_agruUpdateBossImgByHp()` 関数追加 — 現在HPをバケット化（ceil(pct/10)*10、最小10）し、設定された画像に切り替え；下位バケットへのフォールバックあり
- **`public/app.js`**: `let _agruLastHpBucket` を追加し、バケット変化時のみ画像更新（毎フレームの負荷を回避）
- **`public/app.js`**: `updateAgruBattleHpDisplay()` 末尾で `_agruUpdateBossImgByHp()` を呼び出し
- **`public/app.js`**: `startAgruBattle()` 開始時にバケットリセット＆初期HP画像を適用
- **`public/app.js`**: WebSocket `bossLayoutUpdate` 受信時に `hpImages` を `agruBattleConfig` に反映
- **`public/ageru-boss.html`**: HP別画像セクションを追加（`_buildHpImageRows()` で動的生成）
- **`public/ageru-boss.html`**: `confirmBossImgSelect()` に `hpImg*` ターゲット対応を追加
- **`public/ageru-boss.html`**: `collectConfig`・`_sendLayoutUpdate`・`applyConfigToDOM` に `hpImages` を追加

## v2.624.0 — 2026-06-13

### ボスアゲル：暗転終了後にUIをスライドイン演出
- **`public/app.js`**: `_bossUIFlyIn()` 関数追加 — タイマー(delay:0)・HPゲージ(delay:160ms)・HP数値(delay:260ms) を `translateY(-280px)` → 指定位置へ stagger アニメート
- **`public/app.js`**: タイマーの `translateX(-50%)` など既存 transform を保持しつつ translateY を合成して開始位置を設定
- **`public/app.js`**: 入場演出完了コールバック内で `_applyTimerConfig()` 直後に `_bossUIFlyIn()` を呼び出し

## v2.623.0 — 2026-06-13

### ボスアゲル：パーティクルを三角形／星形で切り替え可能に
- **`public/app.js`**: `_drawTri()` を廃止し `_shapePath(ctx, tr)` + `_drawShape(ctx, tr)` に分割 — `agruBattleConfig.geoEffect.shape` を毎フレーム参照して即時切り替え
- **`public/app.js`**: BG層インライン描画も `_shapePath()` を使用（アルファスケールは維持）
- **`public/app.js`**: FG層の `_drawTri` 呼び出しを `_drawShape` に置換
- **`public/ageru-boss.html`**: 「パーティクル形状」セレクト (`geoShape`) を追加（三角形 / 星形 ★）
- **`public/ageru-boss.html`**: `applyConfigToDOM`・`collectConfig`・`_sendLayoutUpdate` collectConfig・`change` リスナーリストに `geoShape` を追加
- セクションタイトルを「幾何学エフェクト設定（パーティクル・ポリゴン）」に更新

## v2.622.0 — 2026-06-13

### ボスアゲル：グレーアウトオーバーレイを水平反転に同期
- **`public/app.js`**: `applyFacingFlip()` で `.hp-gray-overlay` に `scaleX(-1)` を適用（基本画像と同期）
- **`public/app.js`**: `updateBattleGrayscale()` でオーバーレイ作成・更新時に `isUserFlipped()` で反転状態を設定

## v2.621.0 — 2026-06-13

### ボスアゲル：タイマー残時間に応じてバトル背景画像を赤黒化
- **`public/index.html`**: `#agruBattleOverlay` 内に `#bossTimerBgDark` div を追加（`z-index:1`、背景画像の上・ボスキャラより下）
- **`public/app.js`**: `_bossEfx.updateTimer()` 内でタイマー進行率に応じ `rgba(80,0,0,opacity)` を設定（`Math.pow(progress, 1.5) * 0.55` でゆるやかに増加）
- **`public/app.js`**: `_bossEfx.stop()` で `#bossTimerBgDark` の背景色をリセット（親要素の表示制御に委任）

### ボスアゲル：キャラHPに連動したグレーアウト演出
- **`public/style.css`**: `.hp-gray-overlay` スタイル追加（`position:absolute; filter:grayscale(1); clip-path` で切り抜き）
- **`public/app.js`**: `updateBattleGrayscale(user)` 関数追加 — HP率に応じ `clip-path: inset(0 0 hpPct% 0)` を設定（上からグレー、HP低いほど広がる）
- **`public/app.js`**: `updateStatsDisplay()` と `applyAvatarStyle()` の末尾でバトル中は `updateBattleGrayscale()` を呼び出し
- **`public/app.js`**: `startAgruBattle()` 開始時に全キャラのグレーオーバーレイを初期化
- **`public/app.js`**: `endAgruBattle()` でグレーオーバーレイを全キャラから除去

## v2.619.0 — 2026-06-13

### ボスアゲル：左ゾーン配置キャラを右向きに反転
- **`public/app.js`**: `_agruBattleGatherChars()` で左グループに `facingRight = true` を設定し `applyFacingFlip()` を呼び出し（ペット・ぷるぷる・ジグルオーバーレイも含めて一括反転）
- **`public/app.js`**: `_preBattleFacing` に元の向きを保存し、`_agruBattleRestoreChars()` でバトル終了後に向きを復元

## v2.618.0 — 2026-06-13

### ボスアゲル：バトル開始時キャラ配置を改善
- **`public/app.js`**: `_agruBattleGatherChars()` を書き直し
  - 左ゾーン（画面幅0〜35%）・右ゾーン（65〜100%）に分け、中央30%にキャラを配置しない
  - 各ゾーン内でキャラ数に応じて均等分割配置（重なりOK）
  - 全キャラ下端を画面下ぴったりに固定（下半分に収まる）
  - 行分けロジックを廃止してシンプルな1行均等配置に変更

## v2.617.0 — 2026-06-13

### ボスアゲル：バトル中は射・回復 以外のコマンドを無効化
- **`public/app.js`**: `handleComment()` のアゲル会話ブロック直後に `agruBattleActive` ガードを追加
  - `射` を含むメッセージ → `launchBullets()` のみ実行して return
  - `回復` を含むメッセージ → 回復ロジック（MP-2・全キャラHP+2・ハートシャワー）を実行して return
  - それ以外 → 即 return（早押し・クイズ・タイマン・キャラコマンド等すべてスキップ）
  - ボスへの攻撃（`attackAgruBoss`）はガードより前で処理されるため引き続き動作

## v2.616.0 — 2026-06-13

### ボスアゲル：バトル開始時キャラ集合・タイマーリール修正

#### バトル開始時に全キャラが左下・右下に集合
- **`public/app.js`**: `_agruBattleGatherChars()` を追加 — キャラを前半/後半に分けて左下・右下に5体×N行で配置（`_preBattleX/Y` に元座標を保存）
- **`public/app.js`**: `_agruBattleRestoreChars()` を追加 — バトル終了後に元位置へアニメーション復元
- **`public/app.js`**: `scheduleMove()` のタイムアウト内で `agruBattleActive` チェックを追加 — バトル中は自動移動をスキップして集合位置を維持
- **`public/app.js`**: `startAgruBattle()` で `_agruBattleGatherChars()` 呼び出し（登場演出前）
- **`public/app.js`**: `endAgruBattle()` で `_agruBattleRestoreChars()` 呼び出し（レイアウトリセット後）

#### タイマーリール方向を上→下に修正
- **`public/app.js`**: `_buildTimerReels()` のセル生成を 0→9 順に変更、`translateY(-${d*10}%)` に更新
- **`public/app.js`**: `_updateTimerReels()` も同フォーミュラに更新

#### タイマーのグロー効果が四角になる問題を修正
- **`public/style.css`**: `#bossTimerDigits` の `text-shadow` を `filter: drop-shadow(...)` に変更（`overflow:hidden` によるクリップを回避）、transition を `filter 0.5s` に更新
- **`public/style.css`**: `.timer-digit-reel-cell` / `.timer-reel-colon` から `text-shadow: inherit` を削除
- **`public/app.js`**: `updateTimer()` の各フェーズで `el.style.textShadow` → `el.style.filter` (drop-shadow 構文) に変更

## v2.613.0 — 2026-06-13

### ボスアゲル：タイマーをリール式カウントダウンに変更
- **`public/style.css`**: `#bossTimerDigits` に `display:flex` を追加、リール用クラス（`.timer-digit-reel-wrap` / `.timer-digit-reel` / `.timer-digit-reel-cell` / `.timer-reel-colon`）を追加
  - リールは `overflow:hidden` + `height:1em` のウィンドウで各桁を切り抜き
  - `.timer-digit-reel-cell` に `text-shadow:inherit` を指定しグロー効果を継承
- **`public/app.js`**: `_timerReelStr(left)` / `_buildTimerReels(el, str)` / `_updateTimerReels(el, str)` を追加
  - リールは上から 9→0 の順に並べ、`translateY(-(9-d)*10%)` でスクロール位置を制御
  - 桁数が変わった場合（例：分が2桁になる）は自動再構築
  - 常に `M:SS` 形式で表示（秒のみのときも `0:30` 形式）
- **`public/app.js`**: 登場演出完了時・`_bossEfx.updateTimer()` での `textContent` 代入を `_buildTimerReels` / `_updateTimerReels` 呼び出しに置き換え

## v2.612.0 — 2026-06-13

### ボスアゲル：HP数値を独立要素化・バー太さ設定追加

#### HP数値をバーと独立して位置・サイズ調整可能に
- **`public/index.html`**: `#agruBattleHpNum`（div）を `#stage` 内に追加
- **`public/style.css`**: `#agruBattleHpNum` を `position:absolute` で配置、低HP時の `.boss-hp-low` 点滅アニメーション（`bossHpLowPulse`）を CSS で定義
- **`public/app.js`**: `updateAgruBattleHpDisplay()` から canvas への HP 数値描画を削除し、`#agruBattleHpNum` のテキスト・色・クラスを更新する処理に変更
- **`public/app.js`**: `_applyBossLayoutConfig()` に `#agruBattleHpNum` の位置（`hp.numX`, `hp.numY`）・フォントサイズ（`hp.numSize`）・z-index 適用を追加
- **`public/app.js`**: `_resetBossLayoutConfig()` に `#agruBattleHpNum` のスタイルリセットを追加
- **`public/ageru-boss.html`**: HP数値セクションに X位置・Y位置・文字サイズ入力欄（id=`hpGaugeNumX/Y/Size`）を追加、各 JS 関数・イベントリスナーに反映

#### HPバーの太さを設定から変更可能に
- **`public/app.js`**: `updateAgruBattleHpDisplay()` の `TW` 計算を `S * (hp.thick ?? 11.5) / 100` に変更（円サイズに対する%）
- **`public/ageru-boss.html`**: 「太さ (%)」入力欄（id=`hpGaugeThick`、デフォルト11.5、範囲1〜50）を追加、各 JS 関数・イベントリスナーに反映

## v2.610.0 — 2026-06-13

### ボスアゲル：HPゲージ・タイマーのサイズ上限を撤廃
- **`public/app.js`**: `updateAgruBattleHpDisplay()` の canvas サイズ計算から上限 `Math.min(400, ...)` を除去（下限120pxのみ維持）
- タイマーサイズ（`timerCfg.size`）は元々クランプなし。設定画面の input 要素にも `max` 属性はないため追加変更なし

## v2.609.0 — 2026-06-13

### ボスアゲル：HPバーギャップ方向を設定から選択可能に
- **`public/ageru-boss.html`**: 「ギャップ方向」セレクト（id=`hpGaugeGapDir`）を追加（下・右・上・左、デフォルト下）
- **`public/ageru-boss.html`**: `collectConfig()` / `applyConfigToDOM()` / `_sendLayoutUpdate()` に `gapDir` フィールドを追加、`hpGaugeGapDir` を change イベントリスナーに登録
- **`public/app.js`**: `updateAgruBattleHpDisplay()` で `hp.gapDir` を角度にマップ（right:0°, bottom:90°, left:180°, top:-90°）し、`START = gapCenter + gapRad/2` で方向を反映

## v2.608.0 — 2026-06-13

### ボスアゲル：HPバーギャップ設定・背景暗化除去・ボス画像レイヤー修正

#### HPバーのギャップ角度を設定から変更可能に
- **`public/ageru-boss.html`**: 「ギャップ (°)」入力欄（id=`hpGaugeGap`、デフォルト90°、範囲5〜270°）を追加
- **`public/ageru-boss.html`**: `collectConfig()` / `applyConfigToDOM()` / `_sendLayoutUpdate()` に `gap` フィールドを追加、`hpGaugeGap` を input イベントリスナーに登録
- **`public/app.js`**: `updateAgruBattleHpDisplay()` で `hp.gap`（デフォルト90）を読み取り、下部中央を欠けの基点として `START = π/2 + gapRad/2`、`SWEEP = 2π - gapRad` で計算

#### HPバーの背景暗化グラデーションを除去
- **`public/app.js`**: `updateAgruBattleHpDisplay()` の `ctx.createRadialGradient` による背景描画ブロックを削除

#### 「ボス画像の後ろに表示」修正
- **`public/index.html`**: `#agruBattleHpWrap` と `#bossTimerWrap` を `#stage` の外（`position:fixed`）から内部（`position:absolute`）へ移動
  - `position:fixed` の `#stage` は常に独立したスタッキングコンテキストを作るため、外部の fixed 要素は z-index に関わらず常に前面に出ていた
- **`public/style.css`**: 両要素を `position: absolute` に変更、z-index を stage 内の階層（HP:60/タイマー:65 前面、28 後ろ）に合わせて更新
- **`public/app.js`**: `_applyBossLayoutConfig()` / `_applyTimerConfig()` の z-index を stage 内階層に対応（前:60/65、後:28）

## v2.607.0 — 2026-06-13

### ボスアゲル：バトル背景に手振れエフェクト追加
- **`public/style.css`**: `#agruBattleOverlayBg` に `inset: -6px`（縁を広げて揺れてもギャップを出さない）
- **`public/style.css`**: `@keyframes bossBgHandShake`（14ステップ、translate + rotate でランダム感を演出）と `.boss-bg-shake` クラスを追加（2.4秒ループ）
- **`public/app.js`**: 登場演出完了時に `boss-bg-shake` クラス付与、`endAgruBattle()` で除去

## v2.606.0 — 2026-06-13

### ボスアゲル：HPバー刷新・暗転中非表示・設定永続化

#### HPバー 馬蹄形アーク＋ブロック分け＆エフェクト
- **`public/app.js`**: `updateAgruBattleHpDisplay()` を馬蹄形（270°）アーク＋セグメント式 canvas に全面書き換え
  - 20分割セグメント（充填=バーガンディグラデーション＋グロー、空=暗色）、lineCap:'butt' でブロック間に隙間
  - スキャンシマー（充填アーク上を流れる光）
  - 充填先端スパーク（パルス光点）
  - 低HP（25%以下）時に全ブロック点滅（pulse）
  - ダメージ検知フラッシュ（赤オーバーレイが 350ms でフェード）
  - 中央に HP 数値のみ表示（ラベル・maxHP 表示なし）
  - サイズ `hp.width`（120〜400px、デフォルト200）で canvas を自動リサイズ

#### 暗転終了まで何も映さない
- **`public/app.js`**: `_agruBattleEntranceDone` フラグを追加
  - entrance 中（`_agruBattleEntranceDone = false`）は HP バーを非表示
  - `onDone()` コールバック内で `true` にしてから HP バー・タイマーを表示
- **`public/app.js`**: `_bossEfx.start()` からタイマー表示コードを除去（`onDone` に移動）
- **`public/app.js`**: `endAgruBattle()` で `_agruBattleEntranceDone = false` リセット

#### 設定永続化・即時反映
- **`public/ageru-boss.html`**: `saveAll()` で保存後に `_bossSend({ type: 'bossLayoutUpdate', ... })` を送信 → ライブページに即時反映
- **`public/app.js`**: 起動時 config 読み込み IIFE で `_applyBossLayoutConfig()` / `_applyTimerConfig()` を呼び出してレイアウト設定を即時適用
- **`public/app.js`**: `_applyBossLayoutConfig()` の不要な `canvas._hpS = null` を削除（新実装では canvas 寸法比較で自動リサイズ）

#### HP ゲージ設定変更
- **`public/ageru-boss.html`**: HP ゲージ幅のデフォルトを 200 → 500 に変更、ラベルを「バーの横幅」に更新

## v2.602.0 — 2026-06-13

### ボスアゲル：HPゲージ・タイマーの表示レイヤー設定を追加
- **`public/index.html`**: `#agruBattleHpWrap` を `#agruBattleCharWrap` の外（兄弟要素）に移動し独立した重なり順を制御可能に
- **`public/style.css`**: `#agruBattleHpWrap` を `position:fixed; z-index:300` に変更
- **`public/app.js`**: `_applyBossLayoutConfig()` で `hpGauge.behindBoss` に応じて `zIndex` を `20`（後ろ）or `300`（前）に切り替え
- **`public/app.js`**: `_applyTimerConfig()` で `timer.behindBoss` に応じて `zIndex` を `20`（後ろ）or `320`（前）に切り替え
- **`public/ageru-boss.html`**: HPゲージ設定・タイマー設定それぞれに「ボス画像より後ろに表示」トグル（`hpGaugeBehindBoss` / `timerBehindBoss`）を追加
- **`public/ageru-boss.html`**: `collectConfig()` / `applyConfigToDOM()` / `_sendLayoutUpdate()` に `behindBoss` フィールドを追加
- **`public/ageru-boss.html`**: チェックボックスの `change` イベントでリアルタイム反映（`hpGaugeBehindBoss`・`timerBehindBoss`）

## v2.601.0 — 2026-06-13

### ボスアゲル：HPゲージを円形アークデザインに刷新
- **`public/index.html`**: `#agruBattleHpBarBg` / `#agruBattleHpBar` / `#agruBattleHpText` を削除し `<canvas id="agruBattleHpCanvas">` に置換
- **`public/style.css`**: `#agruBattleHpWrap` を flex 縦並び配置に変更、旧バー関連 CSS を削除
- **`public/app.js`**: `updateAgruBattleHpDisplay()` を canvas 描画に全面書き換え
  - 270° ホースシューアーク（135° 〜 45°）
  - バーガンディ グラデーション塗りアーク（`#3d0010→#c04068`）
  - グロー・光沢ハイライト・先端光点・始点キャップ装飾
  - 外側装飾リング・内側リング・10% 刻み目盛り
  - 中央に "BOSS HP" ラベル・HP 数値（大）・区切り線・最大 HP サブテキスト
  - 低 HP（25%以下）時に `Date.now()` ベースのパルスアニメーション
  - 設定値 `hpGauge.width` をリング径として使用
- **`public/app.js`**: `_bossEfx.tick()` 内で毎フレーム `updateAgruBattleHpDisplay()` を呼び出してアニメーションを滑らかに

## v2.600.0 — 2026-06-13

### ボスアゲル：タイマーサイズ設定が反映されない問題を修正
- **原因**: `updateTimer()` が毎秒 `fontSize` を固定値（88/96/100/110px）で上書きしていた
- **`public/app.js`**: `updateTimer()` 内で `agruBattleConfig.timer.size` をベースサイズとして読み込み
  - 通常: `baseSize` px
  - 残60秒以下: `baseSize × 1.09` px
  - 残30秒以下: `baseSize × 1.14` px
  - 残10秒以下: `baseSize × 1.25` px

## v2.599.0 — 2026-06-13

### ボスアゲル：幾何学エフェクト設定に線の太さを追加
- **`public/ageru-boss.html`**: 「幾何学エフェクト設定」に線幅スライダーを3つ追加
  - 線幅 ポリゴン（デフォルト2.0）
  - 線幅 ウェブ（デフォルト1.2）
  - 線幅 リサジュー（デフォルト1.5）
- **`public/app.js`**: `renderBg()` 先頭で `agruBattleConfig.geoEffect` を読み込むよう修正
- **`public/app.js`**: 各 `lineWidth` を `geoEffect.lineWidthPoly/Web/Lissajous` から取得するよう変更

## v2.598.0 — 2026-06-13

### ボスアゲル：HPゲージ・赤色三角をバーガンディ色に変更
- **`public/style.css`**: `#agruBattleHpBar` グラデーションを `#800020→#a83248` に変更
- **`public/style.css`**: `#agruBattleHpText` テキスト色・グロー色をバーガンディに変更
- **`public/style.css`**: `#agruBattleSpeechBubble` ボーダー・シャドウをバーガンディに変更
- **`public/app.js`**: HPバー動的色（>50% / 25-50% / <25%）をバーガンディグラデーションに変更
- **`public/app.js`**: `TRI_COLORS` の赤を `#800020` に変更
- **`public/app.js`**: 背景ポリゴンの stroke/fill 色配列をバーガンディ系に変更
- **`public/app.js`**: 回転ウェブ・リサジュー曲線の赤色を `#800020` に変更
- **`public/app.js`**: ラジアルバーストグラデーションを `rgba(128,0,32,...)` に変更

## v2.597.0 — 2026-06-13

### ボスアゲル：幾何学・ノイズエフェクトの各種パラメータを設定画面から変更可能に
- **`public/ageru-boss.html`**: 「幾何学エフェクト設定」セクションを追加
  - 三角形数 FG/BG（バトル開始時に反映）
  - 全帯域スムージング / 低域スムージング（リアルタイム反映・高いほど鈍感）
- **`public/ageru-boss.html`**: 「ノイズエフェクト設定」セクションを追加
  - 発動閾値 / 色収差強度 / ジッターX・Y / 明るさ係数 / コントラスト係数（リアルタイム反映）
- **`public/app.js`**: `_bossEfx.init()` で `agruBattleConfig.geoEffect` から `TRI_COUNT_FG/BG` を適用
- **`public/app.js`**: `_bossEfx.tick()` で `agruBattleConfig.geoEffect.audioSmooth/bassSmooth` を使用
- **`public/app.js`**: `_bossApplyAudioFx()` で `agruBattleConfig.noiseEffect` の全パラメータを使用
- **`public/app.js`**: `handleAdminMessage` の `bossLayoutUpdate` に `geoEffect`/`noiseEffect` を追加

## v2.596.0 — 2026-06-13

### ボスアゲル：セリフ表示位置を設定画面から変更可能に
- **`public/ageru-boss.html`**: 「セリフ表示設定」セクションを追加
  - X位置 (px、空欄=中央)、Y位置 (px、上から)、幅 (px) の3項目
  - `collectConfig()` / `applyConfigToDOM()` に `speech` フィールドを追加
  - `_sendLayoutUpdate()` の送信データに `speech` を追加
  - input イベントリスナーに `speechX/Y/Width` を追加
- **`public/app.js`**: `_applyBossLayoutConfig()` に `#agruBattleSpeechBubble` のスタイル反映を追加
  - X/Y/幅を `agruBattleConfig.speech` から適用
- **`public/app.js`**: `handleAdminMessage` の `bossLayoutUpdate` ハンドラに `speech` を追加

## v2.595.0 — 2026-06-13

### ボスアゲル設定画面：WebSocket送信を追加（OBS対応）
- **`public/ageru-boss.html`**: BroadcastChannel のみの送信では OBS ブラウザソースに届かない問題を修正
  - `_initBossWS()` を追加：`ws://{host}/ws` に接続し `role: admin` で識別、自動再接続付き
  - `_bossSend(msg)` を追加：BroadcastChannel と WebSocket の両方に送信（admin.html と同じ方式）
  - `bossBattleStart()` / `bossBattleEnd()` / `_sendLayoutUpdate()` を `_bossSend()` 経由に統一

## v2.594.0 — 2026-06-13

### ボスアゲル：レイアウトリアルタイム反映の方式を変更
- **`public/ageru-boss.html`**: `_sendLayoutUpdate()` を独自チャンネル `kukuCome_bossLayout` から既存の `kukucome-admin` チャンネルに統合
  - 送信メッセージに `type: 'bossLayoutUpdate'` を追加
  - 独自チャンネル `_bossLayoutChannel` の宣言を削除
- **`public/app.js`**: `handleAdminMessage()` に `bossLayoutUpdate` タイプのハンドラを追加
  - `agruBattleConfig` を更新後 `_applyBossLayoutConfig()` / `_applyTimerConfig()` を呼び出し
  - 独自チャンネル `window._bossLayoutChannel` は残置（後方互換）

## v2.593.0 — 2026-06-13

### ボスアゲル設定画面：バトル開始・強制終了ボタンを追加
- **`public/ageru-boss.html`**: ページ上部に「バトル操作」セクションを追加
  - ⚔️ バトル開始ボタン（`agruBattleStart` を送信）
  - 強制終了ボタン（`agruBattleEnd` を送信）
  - `BroadcastChannel('kukucome-admin')` 経由で index.html に送信（admin.html と同じ仕組み）
  - 送信後は操作ステータスを3秒表示

## v2.592.0 — 2026-06-12

### ボスアゲル：BroadcastChannel GC バグ修正（リアルタイム反映が動作しない問題）
- **`public/app.js`**: `new BroadcastChannel(...)` を変数なしで生成していたためGCに回収されリスナーが消える不具合を修正
  - `window._bossLayoutChannel` に保持するよう変更し、参照が失われないようにした

## v2.591.0 — 2026-06-12

### ボスアゲル：レイアウト設定をリアルタイムに反映
- **`public/ageru-boss.html`**: `BroadcastChannel('kukuCome_bossLayout')` を生成
  - `bossCharX/Y/Scale`, `hpGaugeX/Y/Width`, `battleLogX/Y/Width`, `timerX/Y/Size` の各 input に `input` イベントリスナーを追加
  - 変更のたびに `_sendLayoutUpdate()` で最新値を BroadcastChannel に送信
- **`public/app.js`**: `BroadcastChannel('kukuCome_bossLayout')` を受信
  - `agruBattleConfig` の `bossChar`/`hpGauge`/`battleLog`/`timer` を更新し、即座に `_applyBossLayoutConfig()` + `_applyTimerConfig()` を呼び出し
- **`public/app.js`**: `_applyTimerConfig()` を独立関数として抽出（`_bossEfx.start()` と BroadcastChannel ハンドラで共用）

## v2.590.0 — 2026-06-12

### ボスアゲル登場演出：効果音を追加
- **`public/app.js`**: `_bossEntranceAlarmAudio` / `_bossEntranceGlassAudio` をモジュール変数で管理
- **`public/app.js`**: `_stopEntranceSounds()` を新規追加（両音声を停止してnull化）
- **`public/app.js`**: Phase 0（暗転開始）で `/sound/boss/エマージェンシーコール・警報音５.wav` をループ再生開始（volume 0.75）
- **`public/app.js`**: Phase 4（2300ms）で `/sound/boss/ガラスが割れる1（旧バージョン）.mp3` を再生（volume 0.9）
- **`public/app.js`**: Phase 5 で `_stopEntranceSounds()` を呼び出し両音声を停止
- **`public/app.js`**: Phase 5 タイミングを 3200ms → 3800ms に変更（フェード完了 3580ms に合わせる）
- **`public/app.js`**: `endAgruBattle()` の登場演出中断時にも `_stopEntranceSounds()` を呼び出し

## v2.589.0 — 2026-06-12

### ボスアゲル登場演出：暗転終了時にガラス割れエフェクトを追加
- **`public/app.js`**: `_bossEntranceGlassBreak(overlay)` を新規追加
  - 亀裂をフラクタル分割（再帰深度4）で事前生成（毎フレーム乱数なし→フレーム間でブレない静止画）
  - メイン亀裂9〜11本を画面中心から放射状に生成、各亀裂から1〜3本の枝亀裂を分岐
  - 衝撃点中央に2重リングを描画
  - 6フレームのホワイトフラッシュ後に静止、オーバーレイのフェード（1.1s）で自然に消える
  - キャンバスをオーバーレイ内に動的生成（z-index:18）、Phase 5 タイミング（3200ms後）で削除
- **`public/app.js`**: Phase 4 を修正
  - `_bossEntranceGlassBreak()` を呼び出し後、180ms 遅延してからオーバーレイフェードを開始（ガラス割れが見えてからフェードするよう調整）
  - オーバーレイフェード時間を 0.85s → 1.1s に延長（ガラス割れをゆっくり見せる）

## v2.588.0 — 2026-06-12

### ボスアゲル：ボス・HPゲージ・ログの表示位置/サイズを設定画面から変更可能に
- **`public/ageru-boss.html`**: 設定セクションを3つ追加
  - **ボスキャラ表示設定**: `bossCharX`（X位置、空欄=中央）、`bossCharY`（下からの距離）、`bossCharScale`（スケール%）
  - **HPゲージ表示設定**: `hpGaugeX`（X位置、空欄=中央）、`hpGaugeY`（下からの距離）、`hpGaugeWidth`（幅px）
  - **バトルログ表示設定**: `battleLogX`（右からの距離）、`battleLogY`（上からの距離）、`battleLogWidth`（幅px）
  - `collectConfig()` / `applyConfigToDOM()` に各項目を追加
- **`public/app.js`**: `_applyBossLayoutConfig()` を新規追加
  - `startAgruBattle()` でバトル開始時に適用
  - `#agruBattleCharFigure`・`#agruBattleHpWrap`・`#agruBattleLog` に inline style で反映
  - X位置空欄時は `left:50%; translateX(-50%)` で中央揃え維持
  - `transformOrigin: bottom center` で scale がキャラの足元を基準に拡縮
- **`public/app.js`**: `_resetBossLayoutConfig()` を新規追加
  - `endAgruBattle()` でバトル終了時にインラインスタイルを全削除（CSS側の初期値に戻す）

## v2.587.0 — 2026-06-12

### ボスアゲル：ノイズエフェクトを大音量時のみ発動に変更
- **`public/app.js`**: `_bossApplyAudioFx()` に `NOISE_THRESHOLD = 0.45` を導入
  - `bassALv` が閾値以下は完全にエフェクトなし（fxImg を非表示）
  - 閾値超過分を `intensity = (aLv - 0.45) / 0.55` で正規化し全パラメータに適用
  - これにより静音〜中音では反応せず、大音量のみ色収差・ジッターが発動

## v2.586.0 — 2026-06-12

### ボスアゲル BGM 再生されない問題を根本修正
- **`public/app.js`**: `_bossStartBgm()` を async → 通常関数に変更し、再生と WebAudio 接続を完全分離
  - **根本原因**: `createMediaElementSource` で audio を AudioContext 経由にルーティングした後、AudioContext が suspended のままだと `audio.play()` が成功しても無音になっていた
  - 修正: まず WebAudio 接続なしで `audio.play()` → 成功後に `_bossConnectAnalyser(audio)` で解析器を接続
- **`public/app.js`**: `_bossConnectAnalyser(audio)` を新規追加
  - `play()` 成功後（ユーザー操作済み前提）に AudioContext を resume → `ctx.state === 'running'` を確認してから `createMediaElementSource` 接続
  - 接続失敗・context が suspended のままでも BGM 再生には影響しない（解析なしで続行）
- **`public/app.js`**: `_bossStopBgm()` — `_bossBattleBgm._removeBgmRetry?.()` を呼び出してリトライリスナーをクリーンアップ

## v2.585.0 — 2026-06-12

### ボスアゲル：ノイズエフェクトを低音連動・横方向強化
- **`public/app.js`**: `_bossGetBassLevel()` を新規追加
  - `_bossGetAudioLevel()` 呼び出し後にバッファを再利用（`getByteFrequencyData` 二重呼び出し不要）
  - bin 1〜10（≈172〜1720 Hz）のみを平均して低域レベルを算出
- **`public/app.js`**: `_bossEfx.tick()` で低域レベルを別途計算
  - `bassLv` / `_bassSmooth`（lerp 係数 0.5：やや速め）を追加
  - `_bossApplyAudioFx()` の引数を全帯域 `aLv` から低域 `bassALv` に変更（三角・幾何学は従来通り全帯域）
- **`public/app.js`**: `_bossApplyAudioFx()` — 横ジッター幅を `aLv*14` → `bassALv*36` に拡大、縦は `aLv*5` → `bassALv*4` に抑制。発動閾値を 0.2 → 0.15 に下げ低域に敏感化

## v2.584.0 — 2026-06-12

### ボスアゲル：バトル終了時エフェクト残留・タイマー0残留バグ修正
- **`public/app.js`**: `_bossEfx.stop()` — `#bossEfxBg` / `#bossEfxFg` canvas は CSS に `.hidden` ルールが未定義だったため `classList.add('hidden')` が無効だった。`style.display = 'none'` + `clearRect()` に変更し確実に消去
- **`public/app.js`**: `_bossEfx.start()` — canvas を `style.display = ''` で復元。タイマー値を RAF 初回フレーム前に即時セット（0 が一瞬表示される問題を修正）。タイマー文字色・shadow をリセット
- **`public/app.js`**: `endAgruBattle()` — `#bossAudioFxImg` を DOM から削除、`#agruBattleCharImg` の position/z-index および `#agruBattleCharFigure` の isolation インラインスタイルをリセット。次バトルで確実にクリーンな状態から再生成されるよう保証

## v2.583.0 — 2026-06-12

### ボスアゲル：エフェクト層 + クリーン層の二重表示
- **`public/app.js`**: `_bossApplyAudioFx()` を全面改修
  - `#bossAudioFxImg`（背面エフェクト専用 img）を動的に生成・再利用
  - エフェクト（色収差・ジッター）は `#bossAudioFxImg`（z-index:1）にのみ適用
  - `#agruBattleCharImg`（クリーン版、z-index:2）が常に最前面に表示
  - `#agruBattleCharFigure` に `isolation:isolate` を付与してスタッキングコンテキストを独立化
  - `src` は毎フレーム `#agruBattleCharImg` から同期（画像切替後も追従）
  - ジッターを `transform: translate()` に変更（絶対配置要素のためレイアウト影響なし）
  - 色収差・輝度・コントラスト強度をわずかに上げ（視覚的にエフェクト層が目立つよう調整）
- **`public/app.js`**: `_bossClearAudioFx()` を改修
  - `#bossAudioFxImg` を非表示にし filter/transform をリセット
  - `#agruBattleCharImg` の position/z-index インラインスタイルを削除

## v2.582.0 — 2026-06-12

### ボスアゲル：音連動ノイズエフェクト
- **`public/app.js`**: `_bossApplyAudioFx(aLv)` / `_bossClearAudioFx()` を新規追加
  - 音量 < 0.04: エフェクトなし
  - 色収差 (chromatic aberration): `drop-shadow` で R を右、B を左にずらす（最大±10px）
  - 輝度・コントラストパルス: `brightness(〜1.45)` `contrast(〜1.25)`
  - hue-rotate ノイズ: 音量0.55超でランダムに±20°色相ずれ（確率18%/frame）
  - ランダムジッター: 音量0.2超で最大±6px の位置揺れ（`margin-left/bottom`）
- **`public/app.js`**: `_bossEfx.tick()` から毎フレーム呼び出し
- **`public/app.js`**: `_bossEfx.stop()` と `endAgruBattle()` で `_bossClearAudioFx()` を呼びリセット

---

## v2.581.0 — 2026-06-12

### 三角形：飛散後の出現をすぐに・なめらかに
- **`public/app.js`**: 画面外リセット時の Y を `H + rand*H*2.2`（深いバッファ）→ `H + rand*80 + 5`（画面直下）に変更
- **`public/app.js`**: リセット時の vy を `-rand*2.2 - 0.5` とばらけさせ、速度差で自然な出現タイミングのずれを生成（約0.3〜2秒で画面内に入る）

---

## v2.580.0 — 2026-06-12

### 三角形の出現分布を外側寄りに変更
- **`public/app.js`**: `mkTri()` の X 座標に `sqrt(random)` 分布を適用
  - 中心（x=W/2）付近: 出現確率低、端（x=0, x=W）付近: 出現確率高
  - `x = W/2 ± W/2 * sqrt(random)` — 確率密度が中心0→端2の線形グラデーション
  - scattered（初期配置）時は従来通り一様分布

---

## v2.579.0 — 2026-06-12

### 三角形エフェクト調整
- **`public/app.js`**: FG三角数 55→41、BG三角数 22→16（約75%に削減）
- **`public/app.js`**: FG層の三角形サイズを小さく（5〜23px）。BG層は10〜45pxを維持
- **`public/app.js`**: 画面外リセット時の再出現Y座標を `H + random*H*2.2` に広げ、攻撃後にまとめて出現しないよう分散
- **`public/app.js`**: FG層の三角形に `ctx.filter = 'blur(2px)'` を適用（BG層の6pxより控えめ）

---

## v2.577.0 — 2026-06-12

### 幾何学模様の音連動を抑制
- **`public/app.js`**: `renderBg()` / `renderFg()` の `aLv` 係数を全体的に約1/3以下に削減
  - speed: `aLv*2` → `aLv*0.6`、ポリゴン半径: `aLv*0.12` → `aLv*0.04`
  - ウェブ半径: `aLv*0.18` → `aLv*0.06`、各alpha値の係数も同様に削減
  - ラジアルバースト: `aLv*0.7` → `aLv*0.25`

---

## v2.576.0 — 2026-06-12

### 三角形エフェクト挙動変更
- **`public/app.js`**: `tick()` — 通常時は常に上方向へのドリフト強制（`vy`を BG:-0.35 / FG:-0.55 以下にクランプ）
- **`public/app.js`**: `tick()` — 画面下方向の脱出リセット条件を追加（攻撃後に下に吹き飛んだ三角が底から再生成）
- **`public/app.js`**: `tick()` — 攻撃時の摩擦を 0.985→0.97 に上げて減速を早めた
- **`public/app.js`**: `onAttack()` — 三角形を「画面中心から外側へ放射状に」吹き飛ばすよう変更
  - 各三角に `(位置-中心)/距離 * force` の外向きベクトルを付与
  - スポーン30個も中心から外側へ放射
- **`public/app.js`**: `renderBg()` — BG層三角形に `ctx.filter = 'blur(6px)'` を適用（ボスより奥にいる感を演出）

---

## v2.573.0 — 2026-06-12

### 三角形エフェクトを元の挙動に戻す
- **`public/app.js`**: `_bossEfx.tick()` から音量連動の三角形揺れ処理を削除
  - 通常時: ゆっくり漂う挙動を復元
  - 攻撃時: `onAttack()` による飛散・振動・スポーンのみ
  - 幾何学模様・ラジアルバーストの音連動は継続

---

## v2.572.0 — 2026-06-12

### ボスアゲル：登場前チラ見え修正・画像クロスフェード・エフェクトクリーンアップ・音連動・幾何学拡大

#### 登場前ボスキャラ表示修正
- **`public/app.js`**: `startAgruBattle()` から `agruBossFigureWrap.classList.remove('hidden')` を削除
- **`public/app.js`**: `_agruBattleEntrance()` のPhase4（2300ms）でボスキャラを表示
  - 暗転演出中はボスキャラが完全に隠れるよう変更

#### ボス画像クロスフェード
- **`public/app.js`**: `_bossCrossfadeImg(newSrc, onDone)` 関数を新規追加
  - `#agruBattleCharFigure`全体をopacityで0→1クロスフェード（ぷるぷるcanvasも含む）
  - 約220ms フェードアウト → 画像切替 → フェードイン
- **`public/app.js`**: `_agruBattlePlayEffect()` がクロスフェードを使用するよう変更

#### 音楽連動エフェクト
- **`public/app.js`**: Web Audio API (`AudioContext`, `AnalyserNode`) 解析器を追加
  - `_bossGetAudioCtx()`, `_bossGetAudioLevel()` 関数追加
  - `_bossStartBgm()` でBGMをアナライザーに接続
- **`public/app.js`**: `_bossEfx.tick()` でオーディオレベルを計算・スムージング
  - `aLv` (smoothed audio level) を `renderBg()`・`renderFg()` に渡す
  - 音量に応じて三角形を揺らす処理を追加
- **`public/app.js`**: `renderBg()` がaLvを使用：ポリゴンサイズ・アルファ・線幅が音に反応
- **`public/app.js`**: `renderFg()` がaLvを使用：ラジアルバーストが音に反応

#### 幾何学模様の大型化
- **`public/app.js`**: `renderBg()` の各要素を大幅拡大
  - ポリゴン: 固定px → `M * 0.18〜0.46` (画面サイズ比例)
  - ウェブネット: 80px → `M * 0.38〜0.62`、ノード9個(7→9)
  - リサジュー: `W*0.28` → `W*0.40〜0.48`、第2曲線追加
  - ポリゴン数: 4→5個

#### BGM再生信頼性改善
- **`public/app.js`**: `_bossStartBgm()` を async 関数に変更
  - `ctx.resume()` で AudioContext の suspend 状態を解除
  - 再生失敗時は `click`/`keydown` イベントで自動再試行
  - `loop = true` で確実なループ設定

#### バトル終了時エフェクト残留修正
- **`public/app.js`**: `endAgruBattle()` 冒頭で登場演出オーバーレイを徹底クリーンアップ
  - `style.cssText = ''`, `className = 'hidden'`, 全 `bev-active` クラス除去
  - `_bossEntranceAborted = true` で演出コールバックをキャンセル

---

## v2.560.0 — 2026-06-12

### ボスアゲル：登場演出・BGM・タイマー設定・攻撃回転修正・ぷるぷるバグ修正

#### 登場演出（新規）
- **`public/index.html`**: `#bossEntranceOverlay` 追加（登場演出オーバーレイ、z-index:500）
- **`public/style.css`**: 登場演出スタイル・アニメーション追加（暗転・テキスト展開・ボス画像スケールイン・赤エッジグロー・スキャンライン）
- **`public/app.js`**: `_agruBattleEntrance(onDone)` 追加
  - Phase 0(0ms): フェードイン暗転
  - Phase 1(550ms): 「⚠ BOSS BATTLE ⚠」警告テキスト展開・フラッシュ・赤エッジグロー
  - Phase 2(950ms): ボス名・BATTLE STARTテキスト表示
  - Phase 3(1500ms): ボス画像スケールイン・拡大リングcanvasアニメーション
  - Phase 4(2300ms): `_bossEfx.start()`・BGM開始・オーバーレイフェードアウト
  - Phase 5(3200ms): オーバーレイ除去・タイマー/カウンター開始コールバック
- **`public/app.js`**: `startAgruBattle()` を登場演出対応に変更（タイマー・カウンター開始を演出完了後に遅延）
- **`public/app.js`**: `_bossEntranceAborted` フラグで`endAgruBattle`時に演出コールバックをキャンセル

#### バトルBGM（新規）
- **`public/ageru-boss.html`**: BGM設定セクション追加（ファイルパス・音量スライダー・試聴ボタン）
- **`public/ageru-boss.html`**: `openSoundModal('__bgm__')` 対応、`confirmSoundSelect` を `__bgm__` ターゲットに対応
- **`public/app.js`**: `_bossBattleBgm`、`_bossStartBgm()`、`_bossStopBgm()` 追加
- BGM設定は `bossAgruConfig.bgm.path` / `bgm.volume` に保存

#### タイマー位置・サイズ設定（新規）
- **`public/ageru-boss.html`**: タイマー表示設定セクション追加（X/Y位置・文字サイズ）
- **`public/app.js`**: `_bossEfx.start()` で `agruBattleConfig.timer` 設定を適用
- タイマー設定は `bossAgruConfig.timer.x` / `timer.y` / `timer.size` に保存

#### 攻撃時三角形回転速度修正
- **`public/app.js`**: `_bossEfx.onAttack()` の `rotV` 加算を `* 0.5` → `* 0.08` に変更（約6分の1に低速化）

#### ぷるぷる全画面バグ修正
- **`public/index.html`**: `#agruBattleCharImg` を `#agruBattleCharFigure` ラッパーで囲んだ
- **`public/style.css`**: `#agruBattleCharFigure` に `position:absolute;bottom:0;left:50%;transform:translateX(-50%);display:inline-block` を設定
- **`public/app.js`**: `updateBossAgruPurupuru()` の parent を `#agruBattleCharFigure` に変更（ぷるぷるcanvasが全画面に広がるバグを修正）

#### スキル使用後の画像切替バグ修正
- **`public/app.js`**: `_agruBattlePlayEffect()` の画像切替ロジックを変更
  - スキル固有画像を表示後、2秒でデフォルト画像へ自動復帰
  - スキル固有画像なし時は即座にデフォルト画像へ復帰
  - `_agruSlideImage` の代わりに `#agruBattleCharImg` を直接更新（通常チャット画像に影響しない）

#### ぷるぷる設定UI改善（ageru-boss.html）
- プレビューサイズを2倍（320px → 640px）
- 「Pポイント表示/非表示」トグルボタン追加
- Pポイントのドラッグ移動対応（canvas上でP点をドラッグ、X/Y入力フィールドに同期）
- P点X/Y入力に `id="bpX-{i}"` / `id="bpY-{i}"` 追加（ドラッグ同期用）
- `_bvInitCanvasEvents()` でpointerイベント初期化（`selectBossPuruImg` 時に呼び出し）

---

## v2.546.0 — 2026-06-11

### ボスアゲル：バトルエフェクト・ドラマチックタイマー・ぷるぷる画像別設定・背景画像boshai対応

#### バトルエフェクトシステム（新規）
- **`public/index.html`**: `#bossEfxBg`（z-index:25）、`#bossEfxFg`（z-index:55）の2枚のcanvasを追加
- **`public/index.html`**: `#bossTimerWrap` ドラマチックタイマーDOMを追加
- **`public/style.css`**: タイマー用スタイル・アニメーション追加（`boss-timer-warning`, `boss-timer-critical`）
- **`public/app.js`**: `window._bossEfx` エフェクトシステムを追加
  - 赤・白・黒の三角形パーティクル（FG: 55個、BG: 22個、透明度80%）
  - 背景レイヤー: 変形ポリゴン、回転ウェブ、リサジュー曲線の幾何学模様
  - 攻撃時バースト: `onAttack()` で三角形が散乱・振動・高速回転、30個スポーン
  - タイマー: 残り時間に応じて色・サイズ・グロー・アニメーション段階変化（白→橙→赤→点滅）
  - `_agruBattleDoCounter()` に `_bossEfx.onAttack()` フックを追加
  - `startAgruBattle()` / `endAgruBattle()` でエフェクトの開始/停止を制御

#### ぷるぷる：画像別設定（前回からの続き完成）
- **`ageru-boss.html`**: `collectConfig()` を `purupuruMap`（画像ファイル名キー辞書）形式に変更
- **`ageru-boss.html`**: `applyConfigToDOM()` を `loadBossPuruMapConfig()` 呼び出しに変更
- **`app.js`**: `updateBossAgruPurupuru()` を現在の画像ファイル名で `purupuruMap` を参照する方式に変更
- **`app.js`**: `_agruSlideImage()` に `updateBossAgruPurupuru()` フックを追加

#### 背景画像 public/boss/boshai/ 対応
- **`server.js`**: `/api/boss-boshai-images` エンドポイント追加（`public/boss/boshai/` の画像一覧）
- **`ageru-boss.html`**: 背景画像ピッカーボタンを `openBossImgModal('bg')` に変更
- **`ageru-boss.html`**: `loadBossHaiBgImages()` 追加（boshai サブディレクトリ専用ローダー）
- **`ageru-boss.html`**: `confirmBossImgSelect()` に `'bg'` ターゲット対応（値は `/boss/boshai/filename.png` 形式）
- **`ageru-boss.html`**: `_updateBgPreview()` を `/boss/` パスに対応

---

## v2.541.0 — 2026-06-11

### ボスアゲル：ぷるぷる設定追加・ダメージ表示位置修正

- **`ageru-boss.html`**
  - バトル基本設定に「ぷるぷる設定（ボスアゲル画像）」セクションを追加
  - 有効/無効チェックボックス、グリッドサイズスライダー、12ポイント詳細設定UI
  - `_bossPuruDefaultPoints()` / `loadBossPuruConfig()` / `buildBossPuruPointsUI()` / `syncBossPuruPoint()` 追加
  - `collectConfig()`: `purupuru` フィールドを含めるよう更新
  - `applyConfigToDOM()`: `loadBossPuruConfig(config.purupuru)` を呼び出すよう更新
- **`app.js`**
  - `updateBossAgruPurupuru()` 追加: `agruBattleConfig.purupuru` を `#agruBattleCharImg` に適用
  - `_puruApplyAll()`: `updateBossAgruPurupuru()` を追加
  - `startAgruBattle()`: `updateBossAgruPurupuru()` を呼び出すよう更新
  - `endAgruBattle()`: バトル終了時にぷるぷるcanvasを除去するよう更新
  - `attackAgruBoss()`: ダメージ数値をキャラ位置ではなくボスアゲル画像の位置に表示するよう修正

---

## v2.539.0 — 2026-06-11

### ボスアゲル：スキル画像も public/boss に変更

- **`ageru-boss.html`**
  - スキルカードの「画像を選ぶ」ボタンを `openBossImgModal(skillId)` に変更
  - `openBossImgModal(targetId)`: 引数なしはデフォルト画像、skillId 指定はスキル画像として動作
  - `confirmBossImgSelect()`: ターゲットに応じて `bossDefaultImage` または `image-${skillId}` に書き込み
  - `applyConfigToDOM()`: スキル画像プレビューを `/boss/` パスで表示
- **`app.js`**
  - `_agruBattlePlayEffect()`: スキル画像を `/boss/ファイル名` として `_agruSlideImage` に渡すよう変更

---

## v2.538.0 — 2026-06-11

### ボスアゲル：デフォルト画像を public/boss から選択

- **`server.js`**: `/api/boss-images` エンドポイントを追加（`public/boss` 内の画像一覧を返す）
- **`ageru-boss.html`**:
  - `#bossImgModal`: `public/boss` の画像を表示する専用モーダルを追加
  - `openBossImgModal()` / `loadBossImages()` / `confirmBossImgSelect()` / `closeBossImgModal()`: ボス画像選択ロジック
  - `_updateDefaultImgPreview()`: プレビューパスを `/ageru/` → `/boss/` に修正
  - デフォルト画像「画像を選ぶ」ボタンを `openBossImgModal()` に変更
- **`app.js`**: `_agruSyncBattleCharImg()` でデフォルト画像のURLを `/boss/` パスに変更

---

## v2.537.0 — 2026-06-11

### ボスアゲルバトル：ダメージログ表示・デフォルト画像モーダルバグ修正

- **`app.js`**
  - `attackAgruBoss()`: バトルログに `⚔️ {名前} → {CRIT? }N dmg` を表示（コメント攻撃ごとに記録）

- **`ageru-boss.html`**
  - `openAgruImgModal('bossDefault')` が `image-bossDefault` という存在しない要素を参照してエラーになっていたバグを修正。`bossDefault` ターゲット時は `bossDefaultImage` 要素を正しく参照するよう分岐を追加

---

## v2.536.0 — 2026-06-11

### ボスアゲルバトル：キル判定修正・バトル中UI切替

- **`app.js`**
  - `_agruBattleDoCounter()`: `if (u.hp <= 0)` でのキル判定を `if (!wasKo && u.ko)` に修正。`damageUser` → `charDeath` が HP をリセットするためキルが発動していなかったバグを修正
  - `_agruBattleKillUser()`: 即座と1.5秒後の両方で `user.koTimer` をキャンセル（復活タイマーを防止）
  - `_agruBattleEnterUI()`: バトル開始時にもじあて・ダメージランキング・クイズ・ニュースを非表示、装備・ステータス・名前を強制表示
  - `_agruBattleLeaveUI()`: バトル終了時に各要素をバトル前の状態に復元
  - `startAgruBattle()`: `_agruBattleEnterUI()` を呼び出し
  - `endAgruBattle()`: `_agruBattleLeaveUI()` を呼び出し

---

## v2.535.0 — 2026-06-11

### ボスアゲルバトル：バトルログ5件上限・ボスキャラをステージキャラより後ろに表示

- **`app.js`**
  - `_agruBattleLog()`: エントリ上限を 20 → 5 件に変更
  - `startAgruBattle()` / `endAgruBattle()`: `#agruBossFigureWrap` の show/hide を追加

- **`index.html`**
  - `#agruBattleCharImg` を `#agruBattleCharWrap` から分離し、`#stage` 内の `#agruBossFigureWrap` に移動
  - `#agruBattleCharWrap` は HUD（吹き出し・HP バー・ログ）のみに

- **`style.css`**
  - `#agruBossFigureWrap`: `position:absolute; inset:0; z-index:30`（`#stage` 内、`.character` の z-index:70 より後ろ）
  - `#agruBattleCharWrap`: 変わらず `position:fixed; z-index:300`（HUD はステージキャラより前）

---

## v2.534.0 — 2026-06-11

### ボスアゲルバトル：ボスデフォルト画像設定・バトルログスクロール廃止

- **`ageru-boss.html`**
  - バトル基本設定に「デフォルト画像」ピッカーを追加（`bossDefaultImage` フィールド）
  - `collectConfig()` / `applyConfigToDOM()`: `defaultImage` フィールドを追加
  - `confirmAgruImgSelect()`: `'bossDefault'` ターゲットの処理を追加
  - `_updateDefaultImgPreview(val)`: デフォルト画像プレビュー更新関数を追加

- **`app.js`**
  - `_agruSyncBattleCharImg()`: バトル設定の `defaultImage` を最優先で使用（未設定時は会話モードの画像 → `agruDefaultImage` の順でフォールバック）

- **`style.css`**
  - `#agruBattleLog`: `overflow-y: auto` を削除、スクロールバー非表示に変更

---

## v2.533.0 — 2026-06-11

### ボスアゲルバトル：スプライトエフェクト対象キャラ追従・ボス側エフェクト追加

- **`app.js`**
  - `_agruCharCenter(user)`: ステージ相対座標でキャラの中央を返すヘルパーを追加
  - `_agruAnimateSprite(canvas, sp, onDone)`: スプライトシート再生の共通関数を追加
  - `_agruBattlePlayEffect(skillId, targets)`: シグネチャを `(cx,cy)` → `targets[]` に変更
    - `cfg.sprite`: 対象ユーザーのキャラ上に `position:absolute` で表示（複数対象は全員に）
    - `cfg.bossSprite`: アゲルちゃんの上に `position:fixed; z-index:9999` で表示
    - targets が null / 空の場合はステージ中央に表示（self_heal, berserk 等）
  - `_agruBattleDoCounter()`: 各スキルケース内で `_agruBattlePlayEffect` を呼ぶよう変更し、スキルごとに正しいターゲットを渡す

- **`ageru-boss.html`**
  - 各スキルカードに「スプライトエフェクト（ボス側）」セクションを追加（`bossSpritePath`, `bossSpriteCols`, `bossSpriteRows`, `bossSpriteFrameCount`, `bossSpriteFps`, `bossSpriteSize`）
  - `openSpriteModal(skillId, type)`: type パラメータ追加（`'target'` | `'boss'`）で書き込み先フィールドを切り替え
  - `confirmSpriteSelect()`: `_spriteTargetType` に応じて `spritePath` か `bossSpritePath` に書き込む
  - `previewBossSprite(skillId)`: ボス側エフェクトのプレビュー関数を追加
  - `applyConfigToDOM()` / `collectConfig()`: `bossSprite` フィールドを追加

---

## v2.532.0 — 2026-06-11

### ボスアゲルバトル完全分離・ollama不要・ダメージログ分離

- **`app.js`**
  - `startAgruBattle()`: 古いモーダル表示コードを完全削除。ollama/会話モード不要で単独起動可能に
  - `startAgruBattle()`: `_agruSyncBattleCharImg()` の呼び出し順序修正（`agruActive` セット後に実行）
  - `_agruSyncBattleCharImg()`: `getAttribute('src')` で空srcを正しく検出し、`agruDefaultImage` をフォールバックに使用
  - `_agruBattleLog(text)`: バトルログ専用関数を追加（`#agruBattleLog` に `.agru-battle-log-entry` として追記）
  - `_agruAddSystemMsg(text)`: バトル中（`agruBattleActive=true`）は `_agruBattleLog` に委譲、会話ログに混入しない
  - ダメージ・スキル発動ログがすべて `#agruBattleLog`（バトルHUD内）に表示されるように

---

## v2.531.0 — 2026-06-11

### ボスアゲルバトル表示構造修正

- **`index.html`**
  - `#agruBattleOverlay`（背景専用, z-index 280）と `#agruBattleCharWrap`（キャラ・HUD, z-index 285）を別要素に分離
  - 背景オーバーレイはキャラより後ろに表示される構造に

- **`style.css`**
  - `#agruBattleOverlay`: z-index 280（背景レイヤー）
  - `#agruBattleCharWrap`: z-index 285（キャラ・吹き出し・HP バー、背景より前）

- **`app.js`**
  - `startAgruBattle()` / `endAgruBattle()`: `#agruBattleCharWrap` の show/hide も追加
  - `_agruSlideImage()`: バトル中に `#agruBattleCharImg` の src を即座に同期（キャッシュ済み画像も対応）

---

## v2.530.0 — 2026-06-11

### ボスアゲルバトル UI 全面改修・AI セリフ廃止・設定画面拡張

- **`app.js`**
  - `startAgruBattle()`: `#agruModal` 全体を非表示、`#agruBattleOverlay`（全画面）を表示
  - `endAgruBattle()`: オーバーレイを非表示、モーダルを復元
  - `_agruApplyBattleBg(bg)`: `#agruBattleOverlayBg` に直接 backgroundImage/backgroundColor を設定（全画面適用）
  - `_agruSyncBattleCharImg()`: `#agruCharImg` の src を `#agruBattleCharImg` に同期
  - `_agruSlideImage()`: 画像変更時にバトル中なら `#agruBattleCharImg` も更新
  - `_kaiAgruBossTarget()`: バトル中は `#agruBattleCharImg` を優先して当たり判定を取得
  - `_agruBattleGetSpeech(skillId)`: AI 呼び出しを廃止 → 設定ファイルの `skills[id].speech` または `battleStartSpeech` 等の固定テキストを吹き出し表示

- **`index.html`**
  - `#agruBattleOverlay`（全画面バトルオーバーレイ）を `#stage` 外側に追加
    - `#agruBattleOverlayBg`: 背景レイヤー
    - `#agruBattleOverlayCharWrap` → `#agruBattleCharImg`: キャラクター画像
    - `#agruBattleSpeechBubble`: バトルセリフ吹き出し
    - `#agruBattleHpWrap` / `#agruBattleHpBar` / `#agruBattleTimerText`: HP バー・タイマー
  - モーダル内の HP バー・吹き出し要素を削除（オーバーレイに移動）

- **`style.css`**
  - `#agruBattleOverlay` 一式のスタイルを追加（全画面・z-index 290）
  - HP バー・タイマー・吹き出し・背景レイヤーのスタイルを追加

- **`public/ageru-boss.html`**
  - バトル開始/リスナー勝利/アゲル勝利の固定セリフ入力欄を追加（`battleStartSpeech`, `battleWinSpeech`, `battleLoseSpeech`）
  - 各スキルカードに「セリフ」入力欄を追加（`skills[id].speech`）
  - スプライトプレビューをアニメーション再生に修正（`setInterval` でフレームループ、ループ再生）

---

## v2.529.0 — 2026-06-11

### ボスアゲルバトル UI 改善・設定画面拡張

- **`app.js`**
  - `startAgruBattle()`: バトル中は `.agru-chat-area`（会話チャット欄）を非表示
  - `endAgruBattle()`: バトル終了時にチャット欄を復元・吹き出しをクリア
  - `_agruBattleGetSpeech()`: アゲルちゃんのバトルセリフを `#agruBattleSpeechBubble` に吹き出し表示（6秒後に自動フェードアウト）
  - `_agruBattleShowSpeechBubble(text)`: 吹き出し表示関数（pop アニメーション付き）
  - `_agruApplyBattleBg(bg)`: バトル中の背景画像・色を `.agru-char-bg::before` に動的適用（動的 `<style>` 注入）
  - `_agruBattlePlayEffect()`: スプライトパスのエンコードをセグメント単位に修正（日本語フォルダ対応）

- **`index.html`**
  - `#agruBattleSpeechBubble` 要素を `.agru-char-area` 内に追加

- **`style.css`**
  - `#agruBattleSpeechBubble` スタイル追加（pop アニメーション・フェードアウト対応）

- **`server.js`**
  - `/api/ageru-folders` エンドポイント追加（`public/ageru` のサブフォルダ一覧）

- **`public/ageru-boss.html`**
  - バトル背景設定セクション追加（背景画像・ブラー強度・背景色）
  - アゲル画像ピッカーモーダル追加（フォルダ一覧 → 画像グリッド選択・サムネイル表示）
  - スキルカードの「アゲル画像」欄に「画像を選ぶ」ボタンとサムネイルプレビューを追加
  - 効果音再生パス `/sounds/` → `/sound/` 修正

---

## v2.528.0 — 2026-06-11

### アゲルちゃんボスバトルシステム実装

- **`server.js`**
  - `/api/sprite-folders` — `public/sprite` 内のフォルダ一覧を返す
  - `/api/sprite-list/:folder` — 指定フォルダ内のスプライト画像一覧（サブフォルダ含む再帰）
  - `/api/sounds` — `public/sound` 内の音声ファイル一覧（再帰）
  - `/api/boss-ageru-config` GET/POST — `data/bossAgruConfig.json` でバトル設定を保存・取得
  - `/api/ageru-images/:folder` のサニタイズ改修（日本語フォルダ名対応済）

- **`app.js`**
  - **バトル状態変数**追加: `agruBattleActive`, `agruBattleHP`, `agruBattleMaxHP`, `agruBattleEndTime`, `agruBattleCounterInterval`, `agruBattleBerserkUntil`, `agruBattleStatusEffects`, `_agruBattleKilledIds`
  - **`startAgruBattle(maxHP)`**: バトル開始・HP初期化・タイマー開始・AIバトル宣言
  - **`endAgruBattle(result)`**: リスナー勝利（+50MP, 会話モード終了）/ アゲルちゃん勝利（全員MP0）
  - **`attackAgruBoss(user, msgLen)`**: コメントでアゲルちゃんにダメージ（`calcAtk` ベースのボス戦と同一ダメージ計算・クリティカル・ペット・称号ボーナス適用・MP+1）
  - **射コマンド対応**: `_kaiAgruBossTarget()` 追加・物理弾がアゲルちゃんに当たるように
  - **自動バトル開始トリガー**: 空腹度0からの強制復活時・好感度0になった時
  - **12スキル反撃システム**: `_agruBattleDoCounter()` が60秒ごとに自動発動
    - 通常攻撃・集中砲火・全体乱打・即死撃・MP吸収・全体MP吸収・石化・眠り・魅了・呪い・自己回復・バーサーク
    - HPティア（100-75% / 74-50% / 49-25% / 24-0%）で発動確率が変動
  - **スプライトエフェクト再生**: `_agruBattlePlayEffect(skillId, cx, cy)` — スキルごとのsprite/image/soundを再生
  - **ステータス効果管理**: `agruBattleStatusEffects` Map でプレイヤーごとに石化/眠り/魅了/呪いの終了時刻を追跡
  - **討伐システム**: `_agruBattleKillUser(user)` — キャラDOMとセーブデータをサーバーから完全削除
  - **`_agruBattleGetSpeech(prompt)`**: バトル中AIがリアルタイムでセリフを生成
  - バトル中は通常チャット(`_agruSend`)を無効化
  - `handleAdminMessage` に `agruBattleStart` / `agruBattleEnd` コマンドを追加

- **`public/index.html`**
  - アゲルちゃんモーダル内にバトルHPバーUI追加（`#agruBattleHpWrap`, `#agruBattleHpBar`, `#agruBattleTimerText`）

- **`public/admin.html`**
  - 「⚔️ ボスアゲル設定画面」ボタン（`/ageru-boss.html` を別タブで開く）追加
  - 「⚔️ バトル開始」「強制終了」ボタン追加

- **`public/ageru-boss.html`** (新規作成)
  - バトル設定専用ページ（ダークテーマ）
  - バトル基本設定（maxHP / timeLimit / counterInterval）
  - 12スキルのアコーディオン設定UI（有効/無効・HPティア別確率・アゲル画像・スプライト・効果音）
  - スプライト選択モーダル（フォルダ選択 → 画像一覧 → プレビュー）
  - サウンド選択モーダル（絞り込み検索・プレビュー再生）
  - `GET/POST /api/boss-ageru-config` で設定を読み書き

---

## v2.527.0 — 2026-06-11

### アゲルちゃん会話モード — 毒投与コマンド

- **`app.js`**
  - 毒投与ハンドラを追加（アゲルちゃん会話モード中に有効）
    - `agruHunger` を 10 減少
    - `_agruPoisonTurns = 6` をセット（以後6往復は毒状態コンテキスト付与）
    - `ageru/毒/` フォルダからランダム画像を表示（`_agruShowStateImage('毒')`）
    - システムメッセージ「☠️ xxxが毒を投与した！空腹度が減った…」をチャットに表示
    - idle状態なら AI に返答させる（`_agruSend`）
  - `_agruGetStateContext()`: `_agruPoisonTurns > 0` のとき毒状態プロンプトを追加（死にそうな苦しさ・恐怖）
  - `_agruSend()`: AI返答ごとに `_agruPoisonTurns` をデクリメント（0になったら毒コンテキスト消滅）
  - グローバル変数 `_agruPoisonTurns` を追加

- **`server.js`**
  - `/api/ageru-images/:folder` のフォルダ名サニタイズを改修
    - 旧: ASCII英数字のみ許可 → 日本語フォルダ名（`毒` 等）が空文字になるバグ
    - 新: パストラバーサル（`..` `/` `\`）のみ除外し、Unicode文字を許容

---

## v2.526.0 — 2026-06-11

### ニュースクリック時に別記事のリンクに飛ぶ不具合を修正

- **`_parseRss()`** (`server.js`)
  - `<link>` 内コンテンツのみを抽出するよう変更（CDATA description 内の `<link href=...>` への誤マッチを防止）
  - `<link>` 直後の空白・改行を許容（Yahoo RSS 等でURLが次行に来るケース対応）
  - Atom形式フォールバック: `<link rel="alternate" href="...">` に限定（旧: 任意の `<link href>`）
  - guid フォールバック追加: `<guid isPermaLink="true">` からURL取得（Yahoo RSS 対応）
  - いずれも `https?:` 始まりのURLのみ採用

---

## v2.525.0 — 2026-06-11

### 画像生成結果パネルをキャラより前面に表示

- **`showSDImage()`** (`app.js`): `el.style.zIndex = charZCounter + 100` を追加
  - 静的な `z-index: 150`（CSS）は `charZCounter` が増えると追い越されて埋もれていた
  - 表示時点の最前面キャラより常に100上のレイヤーに配置
- **`style.css`**: `.sd-image-popup` の固定 `z-index: 150` を削除（JS側で動的管理）

---

## v2.524.0 — 2026-06-11

### ボス画像に縦長補正・縦長ブーストを適用

- **`applyBossAvatarAspect(basePx)`** を新設 (`app.js`)
  - `charAspectExp` / `charPortraitBoost` をボス画像にも適用（キャラと同じロジック）
  - 画像ロード後に `naturalWidth/naturalHeight` を参照してアスペクト補正
- 適用箇所:
  - `spawnBoss()`: 画像ロード時の `_initBossEffects`
  - `spawnSpikiBoss()`: スピキ差し替え画像のロード後
  - ボスサイズスライダー変更時
  - コンテンツモード有効化・無効化時の復元

---

## v2.523.0 — 2026-06-10

### 不在自動返答を管理パネルから設定可能に

- **`app.js`**
  - `autoReplyWords` / `autoReplyMessages` グローバル変数を追加（localStorage永続化）
  - 不在確認ワード・返答内容のハードコードを廃止し、これらの変数を参照
  - 返答が複数ある場合はランダムに1つ選んで `postAIReply`
  - `getState` に `autoReplyWords` / `autoReplyMessages` を追加
  - `handleAdminMessage` に `autoReplyConfig` タイプのハンドラを追加
- **`admin.html`**
  - 「💬 不在自動返答」セクションを追加（タイマン設定の直後）
  - 対象ワード（テキストエリア・1行1ワード）・返答内容（テキストエリア・1行1メッセージ）・保存ボタン
  - `saveAutoReplyConfig()` → `adminSend({type:'autoReplyConfig', words, messages})`
  - `applyState` で管理パネル開時に現在の設定を復元

---

## v2.521.0 — 2026-06-10

### 大きさ：大 コマンドにMP制限追加・が先頭コマンド追加

- **`大きさ：大`** (`app.js` `handleComment`)
  - `SIZE_MAP['大']` (120px) の適用に200MP消費を追加
  - MP不足時はバブル `MPが足りない… (X/200)` を表示してコマンドをキャンセル
  - `中` / `小` は引き続き無料
- **`>` / `＞`先頭コメント** (`app.js` `handleComment`, `style.css`)
  - `>` または `＞`（全角）を先頭から除去し、本文のみを吹き出しに表示
  - 吹き出しフォントを4倍（`charFontSizes.bubble × 4` px）に拡大
  - `.bubble-gatagata`（`@keyframes bubbleGatagata`）: 0.12s × 6回の激しいガタガタ振動 + ゴールドアウトライン＆グロー
  - 20MP消費。MP不足時はバブルでエラー表示し通常表示をスキップ

---

## v2.519.0 — 2026-06-10

### 字幕コマンド追加

- **`handleComment`** (`app.js`)
  - コメントで `字幕：テキスト` または `字幕:テキスト` と入力すると字幕APIを呼び出す機能を追加
  - MP20消費。MP不足時はバブル `MPが足りない… (X/20)` を表示
  - API: `https://live.erinn.biz/api/?category=comment&type=speech&apikey=...&text=...`
  - 成功時: バブル `🎤 字幕送信！` を表示
  - エラー時・通信失敗時: MP返金 + エラー内容をバブルで表示

---

## v2.518.0 — 2026-06-10

### 呼吸オフ時にペットの呼吸モーションも停止

- **`style.css`**
  - `body.no-breathe .char-pet, body.no-breathe .char-pet2 { animation: none !important; }` を追加
  - 管理パネルの呼吸ボタンでOFFにするとペット（`.char-pet`/`.char-pet2`）の呼吸アニメーションも同時に無効化

---

## v2.517.0 — 2026-06-09

### お宝オーバーレイをキャラ個別表示に変更

- **`showTreasureOverlay(user)`** (`app.js`)
  - フルスクリーン固定表示（`position: fixed; inset: 0`）→ 宝箱を開けたキャラの `.avatar-wrap` 内に追加
  - レベルアップバナーと同じ方式でキャラ上にポップアップ
- **`style.css`**
  - 旧 `#treasureOverlay` / `#treasureOverlayText`（72px 巨大テキスト）を削除
  - 新 `.treasure-char-overlay` / `@keyframes treasureCharAnim` を追加（20px、キャラ上でポップして上昇フェード）

---

## v2.516.0 — 2026-06-09

### ぷるぷる描画を48fps制限・CSS contain 追加による軽量化

- **ぷるぷる48fps制限** (`app.js`)
  - `_puruRenderLastTs` 変数を追加
  - RAFループは60fpsで継続（`_puruTime` の進行は正確に維持）
  - キャンバス描画（`_puruRenderCanvas`）は 1000/48 ≈ 20.83ms 未満の間隔ではスキップ
  - ループ停止時に `_puruRenderLastTs` もリセット
- **CSS `contain: layout style`** (`style.css`)
  - `.character` に追加
  - 1キャラの変化が他キャラや画面全体のレイアウト再計算を引き起こさなくなる
  - `paint` は除外（吹き出し等のはみ出し表示を壊さないため）

---

## v2.515.0 — 2026-06-09

### 管理パネルのスライダー値が保存されない問題を修正

- **原因**: admin.html 接続時に `getState` でスライダーの現在値を同期するリストに、新しく追加したスライダーが含まれていなかった。admin.html を開くたびにデフォルト値（100%等）に戻り、そのまま操作すると保存済みの値を上書きしていた
- **修正 `app.js`**: `getState` の `sliderIds` に以下を追加
  - `dmgFontScaleSlider`、`wordlePanelWidthSlider`、`wordlePanelBgSlider`、`rankingPanelBgSlider`、`quizPanelBgSlider`、`newsTickerIntervalSlider`
- **修正 `admin.html`**: `applyState` の `sliderDefs` に同スライダーを追加（接続時に正しい値を表示）

---

## v2.514.0 — 2026-06-09

### キャラ画像の半サイズ配信による軽量化

- **`server.js`**
  - `sharp` を追加（`npm install sharp` 済み）
  - `/chara-s/:filename` エンドポイントを新設
    - `public/chara/` の元画像を幅1/2にリサイズしてブラウザに返す
    - GIF・SVGはリサイズ不要のため元ファイルをそのまま返す
    - サーバープロセス内にメモリキャッシュ（起動後初回のみ処理、以降は即返却）
    - `Cache-Control: public, max-age=86400` でブラウザ側にも1日キャッシュ
    - 変換失敗時は元ファイルをフォールバックで返す
- **`public/app.js`**
  - キャラアバター・ペット・ボス・スピキ・タイマン敗北画像の `img.src` を `/chara/` → `/chara-s/` に変更
  - 管理パネルのサムネイルグリッドは `/chara/`（元画像）のまま維持
- **エフェクト・ぷるぷるへの影響なし**
  - ブラウザが受け取る `naturalWidth/naturalHeight` が最初から半分になるため、ぷるぷるUV計算・CSS表示サイズ計算・じゃぎキャンバスがすべて自動整合

---

## v2.513.0 — 2026-06-09

### レベルアップ演出をキャラ個別表示に変更

- **`showLevelUpBanner(user)`** (`app.js`)
  - 引数なし→`user`引数付きに変更
  - `#stage` 中央配置 (`#levelupBanner`) から各キャラの `.avatar-wrap` 内に `.levelup-char-banner` を追加する方式に変更
  - 複数キャラが同時にレベルアップしても各自の上にバナーが出る
- **`style.css`**
  - 旧 `#levelupBanner`（中央固定）と `@keyframes lvupBanner` を削除
  - 新 `.levelup-char-banner` と `@keyframes lvupCharBanner` を追加（キャラ上でポップアップして上に流れる）

### 装備合成演出をシンプル化

- **合成時の `showBubble` を廃止** (`app.js` — `defeatBoss` / `grantSpikiEquip` 内)
  - 合成バブルテキスト（「〇〇合成！ ATK+X(+Y)」）を削除
  - 代わりに装備バッジに金色の `+` マークがポップするエフェクト（`.equip-synth-pop`）
  - 合成後のステータス（`ATK+X` or `HP+X`）を `showDamageNumber` で金色フロート表示
- **新規装備入手の `showBubble` は従来通り維持**
- **`style.css`**: `.char-equip-badge { position: relative }` + `.equip-synth-pop` + `@keyframes synthPopAnim` を追加

---

## v2.512.0 — 2026-06-09

### ボス撃破モーション変更（倒れて床にスライド消滅）

- **`defeatBoss()`** (`app.js`)
  - 従来の「膨張してフェードアウト」を廃止
  - `.boss-dying` クラスを付与するだけに変更
  - 要素削除タイムアウトを 600ms → 950ms に延長（アニメーション完了後に削除）
- **新アニメーション** (`style.css`)
  - `@keyframes bossDeath`: 0→40%で90度回転（倒れる）、65→100%で260px下スライドしながらフェードアウト
  - `transform-origin: bottom center` でボスの足元を軸に回転（木が倒れるような動き）
  - `.boss-dying * { animation-play-state: paused }` で子要素の浮遊アニメを停止しリアルな倒れ方に

---

## v2.511.0 — 2026-06-09

### ボス被弾シェイク修正（CSS cascade 競合解消）

- **`applyBossHitShake` の対象を変更** (`app.js`)
  - `.boss-avatar`（`#bossAvatar`）→ `bossState.el`（ボスコンテナ全体）
  - `.boss-avatar` には `bossFloat` / `bossHitFlash` アニメーションが競合するため、アニメーションなしの外側コンテナに移動
- **CSS 修正** (`style.css`)
  - セレクタを `.boss-avatar.boss-hit-shake` → `.boss-hit-shake` に変更
  - キーフレームを `translate:` プロパティ → `transform: translateX()` に変更（ブラウザ互換性向上）
  - `!important` 追加でコンテナ上の他スタイルに優先

---

## v2.510.0 — 2026-06-09

### ぷるぷる RAF ループのパフォーマンス改善

- **`_puruStartLoop` 自動停止** (`app.js`)
  - キャンバスが0枚になったら RAF ループを自律停止、次回 `_puruAttach` 時に再起動
  - アイドル時（ぷるぷる設定なし）は 60fps ループが完全に止まる
- **`getBoundingClientRect` フレーム分散** (`_puruAttach`)
  - 新規キャンバスの `_puruTick` 初期値をランダム（0〜118）に設定
  - 多数キャラが同時スポーン時の強制レイアウト集中（フレームスパイク）を解消

---

## v2.509.0 — 2026-06-09

### ボス被弾エフェクトをぷるぷる→振動アニメーションに変更

- ぷるぷるエフェクト（`applyBossHitPuruEffect` / `_bossHitPuruTimer` 等）を廃止
- **CSS振動アニメーション** `bossHitShake` を追加（`style.css`）
  - `translate` プロパティを使用（既存の `transform: scaleX(-1)` フリップと独立）
  - 0.38s、8ステップの左右振動 + わずかな上下
- `applyBossHitShake(ba)` 関数を追加（`app.js`）、ヒット時に `boss-hit-flash` と同時に適用

---

## v2.508.0 — 2026-06-09

### ダメージ文字サイズ設定・ボス被弾ぷるぷるエフェクト追加

- **⚔️ ダメージ演出グループ** を `index.html` / `admin.html` に新設
- **ダメージ文字サイズ** `dmgFontScale`：25〜200%（デフォルト 100%）
  - `showDamageNumber()` の fontSize 計算に乗算、通常攻撃・クリティカル・反撃すべて対象
- **ボス被弾時ランダムぷるぷるエフェクト** (`app.js`)
  - `applyBossHitPuruEffect()` 追加
  - `purupuruConfig` の `enabled: true` エントリをランダムに1つ選択し、ボスに一時適用（700ms後に元の設定に戻す）
  - 連続ヒット時はタイマーを延長（エフェクトが重複しない）
  - ぷるぷる設定が1件もない場合は何もしない

---

## v2.506.0 — 2026-06-09

### ニューステッカー：縦書きオプション追加

- **縦書きトグルボタン** `newsTickerTategaki`（`index.html`, `admin.html`）
  - 全表示モード（横スクロール・縦スクロール・スライド）に対応
  - `#newsTicker.tategaki` クラスで CSS `writing-mode: vertical-rl` を適用
  - ソースバッジ（Yahoo!/Gigazine）も縦書きで表示
  - スライドモード時のバッジのみ `horizontal-tb` を維持（読みやすさ優先）
- **CSS追加** (`style.css`): `#newsTicker.tategaki` 配下の各要素スタイル

---

## v2.505.0 — 2026-06-09

### パネル外観設定を管理パネルに追加（もじあて・ランキング・クイズ）

- **📐 パネル外観グループ** を `index.html` / `admin.html` に新設
- **もじあてパネル幅** `wordlePanelWidth`：100〜500px（デフォルト 200px）、`--wordle-w` CSS変数で制御
- **もじあてパネル背景透明度** `wordlePanelBgOpacity`：0〜100%（デフォルト 93%）、`--wordle-bg` CSS変数で制御
- **ダメージランキング背景透明度** `rankingPanelBgOpacity`：0〜100%（デフォルト 92%）、`--ranking-bg` CSS変数で制御
- **クイズ背景透明度** `quizPanelBgOpacity`：0〜100%（デフォルト 93%）、`--quiz-bg` CSS変数で制御
- 各パネルの `background: rgba(...)` をCSS変数化（`style.css`）
- `applyPanelSettings()` 関数を `app.js` に追加、初期化時に呼び出し

---

## v2.504.0 — 2026-06-09

### ニューステッカー：表示モード3種追加（横スクロール／縦スクロール／スライド）

- **新設定：表示モード** `newsTickerMode` (`app.js`, `index.html`, `admin.html`)
  - `hscroll`（横スクロール）: 従来の左流れマーキー（デフォルト）
  - `vscroll`（縦スクロール）: 記事が下から上へ流れる縦マーキー、行数で可視アイテム数を制御
  - `slide`（スライド切り替え）: 1件ずつ表示し、設定秒数ごとに下→上のスライドアニメーションで自動切り替え
- **新設定：切替間隔** `newsTickerInterval` 3〜30秒（スライドモード専用）
- **CSS追加** (`style.css`): `.news-ticker-vtrack`, `.news-ticker-vitem`, `@keyframes newsTickerVScroll`, `.news-ticker-slide-wrap`, `.news-ticker-slide-item`, `@keyframes ntSlideIn/ntSlideOut`
- `renderNewsTicker()` を `_renderHScroll` / `_renderVScroll` / `_renderSlide` に分割
- モード変更時は自動でスライドタイマーをクリア・再起動

---

## v2.503.0 — 2026-06-09

### ニューステッカー：OBSブラウザソース対応・サーバー経由でブラウザ起動

- **`/api/open-url` エンドポイント追加** (`server.js`)
  - `GET /api/open-url?url=<encoded>` でPCのデフォルトブラウザを起動
  - http/https のみ許可（それ以外は400）
  - Windows: `start ""`, macOS: `open`, Linux: `xdg-open`
- **モーダルのリンクボタンをサーバー経由に変更** (`app.js`, `style.css`)
  - `<a target="_blank">` → `<button onclick="fetch('/api/open-url?...')">` に変更
  - OBSブラウザソース内でクリックしてもPCのブラウザが開くようになった
  - ヘッダーの↗ボタン・本文の「🔗 記事を開く」ボタン両方対応

---

## v2.502.0 — 2026-06-09

### ニューステッカー：NEWSラベル削除・クリックモーダル改修

- **NEWSラベル削除** (`index.html`, `style.css`)
  - `<span class="news-ticker-label">NEWS</span>` を削除
  - `.news-ticker-label` CSSブロックを削除
- **クリックモーダルをiframeなし構成に変更** (`app.js`, `style.css`)
  - X-Frame-Options によりiframeが無音でブロックされ何も表示されない問題を修正
  - iframeを廃止し、記事タイトル + 「🔗 記事を開く」ボタンのみ表示するシンプルなモーダルに変更
  - `.news-modal-iframe` / `.news-modal-fallback` CSS を `.news-modal-body` / `.news-modal-body-title` / `.news-modal-link-btn` に置き換え

---

## v2.501.0 — 2026-06-09

### ニューステッカー：設定項目を大幅拡張

- **新設定スライダー（admin.html・index.html 両対応）**
  - **横幅** `newsTickerWidth`：20〜100%（デフォルト 100%）
  - **位置X** `newsTickerX`：0〜90%（左端からの距離）
  - **位置Y** `newsTickerY`：0〜99%（画面上端からの距離、デフォルト 97% = 画面下部）
  - **背景透明度** `newsTickerBgOpacity`：0〜100%（デフォルト 90%）
  - **速度** `newsTickerSpeed`：25〜400%（デフォルト 100%、数値が大きいほど速い）
  - **行数**・**文字サイズ**は既存スライダーを継続
- **削除**: 上下トグルボタン `newsTickerPos` を廃止し X/Y 座標で自由配置に変更
- `public/style.css`: `#newsTicker` を `left/top/width` の JS 制御に変更、背景に `--ntbg` CSS 変数を追加
- `public/app.js`:
  - `applyNewsTickerSettings()` を全面刷新（位置・幅・透明度・フォントを `style` に直接適用）
  - `renderNewsTicker()` でスクロール速度を `newsTickerSpeed` から計算
  - スライダーイベントリスナーを IIFE にまとめて整理
- 全設定は `SETTINGS_KEYS` 経由でサーバー同期

---

## v2.500.0 — 2026-06-09

### ニューステッカー：管理パネル設定・クリックモーダル・バグ修正

- **バグ修正**
  - `#newsTicker` を `<script src="app.js">` より前に配置し、起動時 null エラーを解消
  - `flex-shrink` でトラックが潰れてスクロールしない問題を修正（`flex-shrink: 0` + `inline-flex`）
  - `wordleDragState`・`quizDragState`・`raceDragState` の TDZ エラーを修正（mousemove ハンドラより前に前出し宣言）

- **管理パネル設定（index.html・admin.html）**
  - 「📰 ニューステッカー設定」グループを追加
  - **位置**ボタン：上 / 下を切り替え（`body.news-ticker-top` クラスで CSS 制御）
  - **行数**スライダー：1〜3行（行ごとに異なるアイテムが流れる・速度も微差）
  - **文字サイズ**スライダー：10〜20px（CSS 変数 `--ntf` で反映）

- **クリックでニュースモーダル表示**
  - 各ニュース項目をクリックすると `.news-modal-overlay` を生成
  - ヘッダーにソースバッジ・タイトル・外部リンクボタン・✕
  - iframe で記事を埋め込み表示（X-Frame-Options ブロック時は「外部ブラウザで開く」ボタン表示）

- **app.js**
  - `fetchNewsAndRender()` を `fetchNewsAndRender` + `renderNewsTicker()` に分離
  - `applyNewsTickerSettings()`: 位置・フォントサイズ・高さ・スライダー値を一括適用
  - `openNewsModal(url, title, source)` 追加
  - 設定 3 件（`newsTickerPos`・`newsTickerFontSize`・`newsTickerRows`）を `SETTINGS_KEYS` に追加・サーバー同期

- **style.css**：ニュースモーダル CSS 追加・多段行 `.news-ticker-row` 追加

---

## v2.499.0 — 2026-06-08

### ニューステッカー追加（Gigazine・Yahoo!ニュース 横スクロール）

- `server.js`: `/api/news` エンドポイント追加
  - Gigazine RSS (`rss_2.0/`) と Yahoo!ニュース RSS (`top-picks.xml`) をサーバー側でフェッチ
  - CDATA 対応 XML パーサー `_parseRss()` を内蔵
  - 2ソースを交互に並べて最大50件返却、5分キャッシュ付き
- `public/index.html`: `#newsTicker` 要素（`</body>` 直前）を追加
- `public/style.css`: `.news-ticker-*` スタイル追加（固定下部バー・赤ラベル・無限スクロールアニメーション）
  - ソースごとに色分けバッジ（Gigazine: オレンジ, Yahoo!: 紫）
- `public/app.js`:
  - `SETTINGS_KEYS` に `'newsTickerEnabled'` を追加
  - `let newsTickerEnabled` 変数を追加
  - `fetchNewsAndRender()`: `/api/news` を叩いてトラックを構築、文字数に応じてスクロール速度調整（`newsTickerScroll` animation）
  - 5分 `setInterval` で自動更新
  - `toggleNewsTickerBtn` クリックでオン/オフ・localStorage保存・サーバー同期
  - 起動時に前回の状態を復元
- `public/admin.html`: 「📰 ニュース」トグルボタン追加

---

## v2.498.0 — 2026-06-08

### ボス浮遊アニメーション（bossFloat）の管理パネルトグル追加

- `public/admin.html`: 「🆙 ボス浮遊」ボタン（`id="toggleBossFloatBtn"`）を追加（呼吸ボタン横）
- `public/app.js`:
  - `SETTINGS_KEYS` に `'bossFloatDisabled'` を追加（サーバー同期対象）
  - `let bossFloatDisabled` 変数を追加（localStorage 初期値読み込み）
  - `toggleBossFloatBtn` のクリックリスナー追加：`no-boss-float` クラスをトグル・localStorage 保存・サーバー同期
  - 起動時に `bossFloatDisabled === true` ならクラスとボタン active を復元
- `public/style.css`: `body.no-boss-float .boss-avatar { animation: none !important; }` を追加

---

## v2.497.0 — 2026-06-08

### 「止めて」コマンド：50MP消費制に変更

- `public/app.js`: `handleComment()` の YouTube停止処理を変更
  - MP が 50 未満の場合は「MPが足りない…」バブルを表示して停止しない
  - MP が 50 以上の場合は 50MP 消費して `closeAgruYtModal()` を呼び出す
- `public/app.js`: `_agruSend()` 内の `closeAgruYtModal()` 呼び出しを削除（`handleComment` 側で処理済みのため重複排除）

---

## v2.496.0 — 2026-06-08

### ぷるぷる：ボス（正方形コンテナ）での位置・サイズずれを修正

- `public/app.js`: `_puruRenderCanvas()` でメッシュ座標とコントロールポイントを**画像コンテンツ領域基準**で計算するよう変更
  - **問題**: admin プレビューは `height:420px;width:auto` で画像そのもののサイズ=コンテナ。コントロールポイント % は画像基準。ボスアバターは正方形コンテナに `object-fit:contain` → 縦長・横長画像でレターボックスが生じ、同じ % が別の位置を指してしまっていた
  - **修正**: `srcX/srcW/iw` から画像コンテンツの左端オフセット `contentL/contentT` と幅高さ `cW/cH` を算出。余白ありの場合は頂点・点座標をコンテンツ領域内にマップ、UV は 0→1 の線形に変更
  - cover やレターボックスなしの場合は `contentL=0` のため従来と同じ動作を維持
- `public/app.js`: `ampScale` を `cssH/420` からコンテンツ実高 `cH/(dpr*SS)/420` に変更（横長画像のボスで振幅が正しくスケールされるよう）

---

## v2.495.0 — 2026-06-08

### ボスぷるぷる：揺れ設定なし時も正しく適用されるよう修正

- `public/app.js`: `spawnBoss()` を修正
  - 従来: `updateBossJiggleOverlay()` のみ呼び出し → 揺れ設定がないとその関数内で `return` するため `updateBossPurupuru()` に未到達
  - 修正後: `_initBossEffects()` ヘルパーで `updateBossJiggleOverlay()` と `updateBossPurupuru()` を**独立して**呼び出す（ユーザーキャラの処理と同じ構造）
- `public/app.js`: `updateBossJiggleOverlay()` 末尾の `updateBossPurupuru()` 呼び出しを削除（`spawnBoss` 側で明示的に呼ぶことで重複排除）

---

## v2.494.0 — 2026-06-07

### ランキングパネル：位置リセット機能＋画面外自動補正

- `public/app.js`: `resetRankingPanelPos()` 関数を追加
  - ダメージセクションヘッドにホバーで表示される `↺` ボタンをクリックすると右上デフォルト位置にリセット
  - localStorage の保存済み位置も更新
- `public/app.js`: `renderRankingPanel()` でステージ外にはみ出した場合に自動クランプ（ウィンドウ縮小時などにパネルが画面外に消えなくなる）
- `public/style.css`: `.ranking-reset` スタイル追加（ホバー時のみ表示）

---

## v2.493.0 — 2026-06-07

### ランキングパネル：上位3位表示＋全順位モーダル追加

- `public/app.js`: `renderRankingPanel()` をダメージ・MP それぞれ上位3位表示に変更（従来は5位まで）
- `public/app.js`: `showRankingModal(type)` 関数を新規追加
  - ⚔️ ダメージ / 💎 MP セクションヘッドをクリックするとモーダルを表示
  - モーダルはタブ切り替えで全参加者の順位を確認可能（4位以降は「4位」「5位」と表示）
  - オーバーレイクリックで閉じる
- `public/style.css`: `.ranking-all-btn`（「全順位」ラベル）スタイル追加
- `public/style.css`: `.ranking-modal-overlay` / `.ranking-modal-box` / `.ranking-modal-tabs` などモーダル用スタイル追加

---

## v2.492.0 — 2026-06-07

### 回転・はずむなどのモーションが動かないバグ修正

- `public/style.css`: `no-breathe`（呼吸無効モード）の CSS セレクタを修正
  - 変更前: `body.no-breathe .avatar { animation: none !important }` → bounce/spin/walk など全アバターアニメーションも抑制してしまっていた
  - 変更後: `:not(.bouncing):not(.spinning):...:not(.walking)` 付きのセレクタに変更し、モーション・歩行中のキャラクターはアニメーションを維持
- `public/app.js`: `applyMotion` 関数を修正
  - モーション適用時に `walking` クラスを除去。`.character.walking .avatar { animation: walkBob !important }` が bounce/spin アニメーションを上書きする問題を解消
  - `u.el.style.transition = ''` を追加。`全員停止` が設定する `transition: none` インラインスタイルの残留によるアニメーション非表示を解消
  - モーション終了後（10秒）に `user.walking` フラグで walking クラスを復元、または `applyWalking` で movement に応じた状態を再設定

---

## v2.491.0 — 2026-06-07

### キャラ名前非表示/表示ボタンを管理パネルに追加

- `public/index.html`: `toggleCharNameBtn`（👤 名前）ボタンを追加
- `public/style.css`: `body.char-name-hidden .char-name { display: none !important; }` を追加
- `public/app.js`:
  - `charNameHidden` 変数追加・設定キーリストに追加
  - `toggleCharNameBtn` クリックで `body.char-name-hidden` トグル・localStorage 保存
  - 起動時に保存済み状態を復元
- `public/admin.html`: 「👤 名前」ボタンを表示切替グループに追加

---

## v2.490.0 — 2026-06-07

### 10連ペットガチャコマンド実装

- `public/app.js`:
  - `10連ペットガチャ` / `ペットガチャ10連` コマンド追加（MP200消費）
  - `showPetGacha10Anim(user, pets)` 関数追加: 10枚カードをグリッド表示し150ms間隔で順次解放
    - 最高レアリティカードにゴールドのアウトライン表示
    - myth: 花火＋紙吹雪、legend: 花火、それ以外は全解放後に最高レアリティ音
    - 7秒後に自動消去
  - `_isAgruSkipCmd` の `/ペットガチャ/` パターンで10連も自動スキップ
  - ペットガチャ回数カウント（`tc.petGachas`）は10回分加算（称号・スロット解放も正常動作）
- `public/style.css`: `.pet-gacha10-panel` / `.pg10-*` CSS追加

---

## v2.489.0 — 2026-06-07

### Ollama CPUスレッド数・コンテキスト長を管理パネルから設定可能に

- `server.js`:
  - `ollamaNumThread`・`ollamaNumCtx` 変数追加（デフォルト -1 = 自動/モデルデフォルト）
  - `buildOllamaOptions()` 関数を追加し、num_gpu / num_thread / num_ctx を一括管理
  - `GET/POST /api/ollama-num-thread`・`/api/ollama-num-ctx` エンドポイント追加
  - `/api/ai-reply`（chat・generate）と `/api/ollama-review` の options 注入を `buildOllamaOptions()` に統一
- `public/admin.html`: AI設定セクションに「CPUスレッド数」「コンテキスト長」入力欄を追加
  - CPUスレッド数: -1=自動、物理コア数を指定するとCPU推論が速くなる
  - コンテキスト長: -1=モデルデフォルト、短くすると推論速度が上がる

---

## v2.488.0 — 2026-06-07

### 画像コマンド時のOllamaアンロードを管理パネルから設定可能に／unload無効時SD並行生成

- `public/app.js`:
  - `agruUnloadEnabled` 変数追加（デフォルト: 有効）
  - 設定キーリスト・state保存・agruText同期ハンドラに `agruUnloadEnabled` を追加
  - unload **有効**時: 従来通り Ollama 返答 → unload → SD 生成（直列）
  - unload **無効**時: Ollama 返答生成と並行して SD に先行リクエストを送信（並列化でトータル待ち時間を短縮）
- `public/admin.html`: アゲルちゃんセクションに「画像時unload」トグルボタンを追加
  - 無効にするとVRAMを解放せずSD生成を先行開始（速くなる可能性あり）
  - 起動時に設定値を復元

---

## v2.487.0 — 2026-06-07

### Ollama GPU レイヤー数を管理パネルから設定可能に

- `server.js`: `ollamaNumGpu` 変数追加（デフォルト -1 = 全レイヤー GPU）
  - `GET/POST /api/ollama-num-gpu` エンドポイント追加
  - `/api/ai-reply`（chat・generate 両パス）と `/api/ollama-review` の Ollama 呼び出し時に `options: { num_gpu }` を注入
  - 値はサーバー設定ファイルに永続化
- `public/admin.html`: AI設定セクションに「GPU レイヤー数」入力フィールドを追加
  - 範囲: -1（全レイヤー・デフォルト）〜任意の正数（例: 0=CPUのみ、24=半分）
  - 起動時にサーバーから現在値を取得して表示
  - `saveOllamaNumGpu()` 関数でリアルタイム反映

---

## v2.486.0 — 2026-06-07

### もじあて・クイズ・ダメージ/MPランキングをミュートカラーにリデザイン

- `public/style.css`: 各パネルの配色をビビッドカラーからくすんだピンク・パープル・ブルー系に統一
  - **もじあてパネル** (`#wordlePanel`): ボーダーを赤→ミュートパープル、ヘッダーをグレー→ラベンダー、セルの正解色を緑→ティール系、不正解色をアンバー→くすみアンバー
  - **もじあて勝利バナー** (`.wordle-win-banner`): ボーダーを水色→ミュートパープル、背景をネイビー→ダークパープル
  - **クイズパネル** (`#quizPanel`): ボーダーをビビッドブルー→ミュートインディゴ、ヘッダーをスカイブルー→パープル系、正解色をグリーン→ティール、優勝色をアンバー→くすみアンバー、タイムアップをレッド→ダスティローズ
  - **ダメージランキング** (`#rankingPanel`): ボーダーをレッド→ミュートパープル、DMGヘッダーをレッド→ダスティローズ (`#c08898`)、MPヘッダーをシアン→スレートブルー (`#8898c8`)、数値色も同様に変更

---

## v2.485.0 — 2026-06-07

### YouTube/SunoモーダルのZ-indexを管理パネルから設定可能に

- `public/app.js`: `agruYtModalZ` 変数を追加（デフォルト400、localStorage永続化）
- `public/app.js`: `SETTINGS_KEYS` に `agruYtModalZ` を追加
- `public/app.js`: `_agruOpenYtModal` / `_agruOpenSunoModal_inner` 両関数でモーダル表示時に `agruYtModalZ` を適用
- `public/app.js`: state送信・受信ハンドラに `agruYtModalZ` を追加（リアルタイム反映）
- `public/admin.html`: 「会話モーダルZ」の行に「YT/SunoモーダルZ」入力欄を並べて追加（`agruYtModalZInput`）
- `public/admin.html`: 設定復元時に `agruYtModalZInput` に値を反映

---

## v2.484.0 — 2026-06-07

### 会話モード・YouTube/Sunoモーダルヘッダーをブラウザフレーム風にリデザイン

- `public/style.css`: `.agru-modal-header`（会話モード）をくすんだピンク→パープル→スレートブルーのグラデーションに変更
  - 旧: 鮮やかなホットピンク (`#f472b6 → #db2777`)
  - 新: ミュートなモーブ→インディゴ系 (`#a07090 → #7278c0`)
- `public/style.css`: `.agru-yt-modal-header`（YouTube/Suno共通）をくすんだスレートブルー→ダスティパープルに変更
  - 旧: 鮮やかなホットピンク (`#f472b6 → #db2777`)
  - 新: ミュートなインディゴ→モーブ系 (`#526aa0 → #7a5898`)
- 両ヘッダーの閉じるボタンをブラウザ風の丸形に統一（内側ハイライト・半透明スタイル）

---

## v2.483.0 — 2026-06-07

### 画像コマンド無視設定を非会話モードにも適用

- `public/app.js`: 非会話モードの「出ろ/出して/生成/gen」コマンド処理（line 4199付近）に `agruImgCmdEnabled` チェックを追加
  - 変更前: 「画像コマンド 無視」設定は会話モード（`_agruSend`）のみ有効で、通常コメントの画像コマンドは無視設定に関係なく実行されていた
  - 変更後: `agruImgCmdEnabled` が false の場合、会話モード・非会話モードのどちらでも画像コマンドを完全に無視

---

## v2.482.0 — 2026-06-06

### SD生成 — 幅・高さが反映されない問題を修正

- `server.js`: `_sdFetchDefaults` の Width/Height ラベル検出を「最後の一致」から「最初の一致」に変更
  - 根本原因: Forge では ControlNet 等の拡張機能が後方に同名スライダーを追加するため、最後の Width/Height（index=161/162）は拡張機能のものだった。本物の txt2img Width/Height は先頭付近にある
  - 起動時に `sd_defaults.json` を削除して新しい検出ロジックで必ず再取得するよう変更
  - `idxMap` なしキャッシュも無効化して強制再フェッチ

---

## v2.481.0 — 2026-06-06

### アゲルちゃん — 会話モードの画像コマンドでOllamaアンロード完了後にSD生成開始するよう修正

- `app.js`: `_agruSendMessage` 内の `ai-unload` フェッチを fire-and-forget から `await` に変更
  - 変更前: アンロードリクエストを投げっぱなしにして即SD生成開始 → GPU VRAM競合の可能性
  - 変更後: アンロード完了を待ってからSD生成開始 → Ollamaがメモリを解放した後にSDが実行される

---

## v2.480.0 — 2026-06-06

### アゲルちゃん — 自撮り SD 設定が反映されない問題を修正

- `app.js`: `_sdReadSettings()` のフォールバック値をハードコードから同期済み JS 変数に変更
  - `cfgScale`: DOM `sdCfgScaleInput` が存在しない場合 `3` 固定 → `sdCfgScale` 変数を参照
  - `sampler`: DOM `sdSamplerInput` が存在しない場合 `'Euler a'` 固定 → `sdSampler` 変数を参照
  - `negative`: DOM `sdNegativeInput` が存在しない場合 `''` 固定 → `sdNegative` 変数を参照
  - `positiveSuffix` / `mosaicKeywords` / `mosaicBlock` / `steps` / `width` / `height` / `displayTime` も同様に変数参照に統一
  - `index.html` ではこれらの DOM 要素が存在しないため、admin から localStorage 経由で同期された設定が使われるようになった

### アゲルちゃん — 会話モード SD生成設定の幅・高さが適用されない問題を修正

- `app.js`: `agruSdWidth` / `agruSdHeight` の初期値を `|| 512` から `|| 0` に変更
  - 0 = グローバル SD 設定を使用（steps/cfgScale と同じ挙動に統一）
  - 未設定のまま生成すると 512 が常に使われてグローバル設定が無視される問題を解消
  - WebSocket 受信時のパース `|| 512` も `|| 0` に統一
- `admin.html`: 幅・高さ入力の `value="512"` を廃止し `placeholder="SD設定値"` に変更
  - 空欄 = グローバル設定使用であることを steps/CFG と統一した UI で明示
  - 状態ロード時、値が 0 のとき空欄を表示するよう修正（`el.value = s.agruSdWidth || ''`）
  - `app.js`: 初回ロード時に旧デフォルト '512' が localStorage に残っている場合を除去するマイグレーション追加
    - `_agruSdSizeReset` フラグが未設定の場合のみ `agruSdWidth` / `agruSdHeight` をクリア（一度だけ実行）
    - 以降は admin で明示的に設定した値のみ有効
  - `app.js`: `_agruGenerateSDImage` の幅・高さ読み取りを localStorage 直接参照方式に変更
    - `agruSdWidth` JS 変数（WebSocket 受信タイミングに依存）→ `localStorage.getItem('agruSdWidth')` を直接読む
    - admin.html の `sendAgruText` は localStorage と WebSocket を同時に書き込むため、WebSocket 未到達でも確実に最新値を反映
    - ログに使用中の幅・高さを表示（例：`📷 画像生成中: prompt (768x768)`）

---

## v2.477.0 — 2026-06-06

### SD画像生成 — Gradio config ベースで完全修正

- `server.js`: `_sdFetchDefaults()` を `/config` エンドポイントベースに全面書き換え
  - `/info` は隠し state コンポーネントを除外した誤った順番でパラメータを返していた
  - `/config` の `dependencies[fn_index].inputs`（実際のコンポーネントID順）から正しい defaults と idxMap を構築
  - Width/Height が位置7/8 → **161/162** に移動していたことを検出・修正（SD更新で変わっていた）
  - 起動時・リクエスト時に自動再取得、SD更新後も自動対応
- `sd_defaults.json`: 正しい252個の defaults + idxMap で再生成

---

## v2.476.0 — 2026-06-06

### SD画像生成 — WebSocket をやめて Gradio HTTP API（/api/predict）に切り替え

- `server.js`: Gradio WebSocket（`/queue/join`）を完全廃止し `POST /api/predict` に変更
  - WebSocket の `success: false` 問題を根本解決
  - `--api` フラグ不要、Gradio バージョン問わず動作
  - `url` / `data` / `name` の3形式の画像レスポンスに対応

---

## v2.475.0 — 2026-06-06

### SD画像生成 — Gradio 4.x プロトコル修正・自動取得の上限設定

- `server.js`:
  - send_hash 応答に `event_data: null` を追加（Gradio 4.x 必須）
  - send_data 応答に `event_id`（クライアント生成）を追加（Gradio 4.x 必須）
  - `_sdFetchDefaults()` の上限を 200〜600 パラメータに設定し巨大な誤検出（1175個）を防止
  - "Prompt" が 2番目、"Negative prompt" が 3番目にある関数のみを txt2img として認識

---

## v2.474.0 — 2026-06-06

### SD画像生成 — defaults を SD 起動時に自動取得・再生成

- `server.js`: `_sdFetchDefaults()` を追加。SD の `/info` から txt2img の `fn_index` と `defaults`（パラメータ数・デフォルト値）を自動取得し `sd_defaults.json` に保存
  - SDアップデートでパラメータ数が313→322に増えて `ValueError` が出ていた問題を根本解決
  - サーバー起動時にバックグラウンドで取得試行、リクエスト時にもキャッシュなければ取得
  - 今後のSDアップデートにも自動対応

---

## v2.473.0 — 2026-06-06

### SD画像生成 — Gradio 4.x プロトコル完全対応

- `server.js`: 新Gradio（4.x）では画像データが `process_generating` で届き `process_completed` は `{error:null}` のみになった問題を修正
  - `process_generating` メッセージで画像情報を `lastImageInfo` に保持
  - `send_data` 時に `event_id` を echo バック（Gradio 4.x 必須）
  - `process_completed` は旧Gradio互換として `data` があれば使用、なければ `lastImageInfo` を使用

---

## v2.472.0 — 2026-06-06

### SD画像生成 — 新旧Gradioレスポンス形式に両対応

- `server.js`: WebSocketアプローチを維持しつつ `process_completed` レスポンスのパースを強化
  - 旧Gradio: `gallery[i].data`（base64）/ `gallery[i].name`（ファイルパス）
  - 新Gradio: `gallery[i].url`（URL直接）/ `gallery` がオブジェクト1個の場合も対応
  - `console.log('[SD] output:')` でSDの生レスポンスをログ出力（デバッグ用）

---

## v2.471.0 — 2026-06-06

### SD画像生成 — GradioWebSocketをREST APIに切り替え

- `server.js`: `/api/sd-generate` を Gradio WebSocket プロトコル（`/queue/join`）から SD 標準 REST API（`POST /sdapi/v1/txt2img`）に変更
  - SDのアップデートでGradioバージョンが上がりWebSocket形式が変わり `empty gallery` が発生していた
  - REST APIはSDのバージョンに関わらず安定して動作する
  - `sd_defaults.json` と `fn_index` への依存を削除
  - レスポンスの `images[0]` を直接 base64 として取得

---

## v2.470.0 — 2026-06-05

### Suno: /s/ 短縮URL対応・ループ終了検知追加

- `server.js`:
  - `/api/suno-resolve?id=` エンドポイント追加：`suno.com/s/{shortId}` → UUID変換（307リダイレクトのLocationから抽出）
- `public/app.js`:
  - `_agruOpenSunoModal`: UUID形式でない場合は `/api/suno-resolve` でUUIDを解決してから開く
  - `_agruOpenSunoModal_inner` に分離
  - YouTube/Sunoメッセージリスナー統合：Sunoの終了系postMessageを検知したらモーダルを閉じる（`playback_end` / `ended` / `status:ended`）
  - Sunoメッセージのデバッグログ追加（`[suno msg]`）
  - Sunoループ防止：モーダル表示時に5分タイマーをセット、時間経過で自動クローズ（`_sunoCloseTimer`）
  - `closeAgruYtModal` でタイマーをキャンセル

---

## v2.469.0 — 2026-06-05

### Suno URL 共有の自動再生対応・kuku.lu短縮URL展開対応

- `public/app.js`:
  - `seenSunoUrls` セットを追加（重複検出用）
  - コメント処理にSuno URL検出ブロックを追加（`suno.com/song/{UUID}` および `suno.com/s/{shortId}` 形式）
  - 配信サービスがSuno URLを `kuku.lu` で短縮する問題に対応：URLがJavaScript暗号化されているため、プロキシ経由で kuku.lu ページを隠しiframeに読ませ、MutationObserver でSunoリンクが動的生成された瞬間をpostMessageで傍受して取得
  - 初回共有で MP+20・バブル・ログ表示、重複時は「もうみた」（共通処理を `_handleSunoUrl` に整理）
  - `_agruOpenSunoModal(songId)` 関数を追加：既存の `agruYtModal` を再利用し `https://suno.com/embed/{songId}` を iframe に表示
  - タイトル表示は「🎵 Suno再生中」固定
- `server.js`:
  - `/api/expand-url?url=...` エンドポイントを追加：リダイレクト先URLを1段展開して返す（タイムアウト3秒）

---

## v2.468.0 — 2026-06-05

### ageru.html — キャラ画像を horny フォルダからランダム表示に変更

- `public/ageru.html`:
  - 感情フォルダマップ・好感度・性欲変数を削除
  - 起動時に `/api/ageru-images/horny` で画像一覧取得
  - 初期表示・返答ごとに `public/ageru/horny/` からランダム表示

---

## v2.467.0 — 2026-06-05

### ageru.html — ぷるぷる canvas の親要素を修正

- `public/ageru.html`: `#charFrame`（width:100% の flex）に直接 canvas を貼っていたため、画像より広い領域に canvas が伸びてぷるぷるが機能しなかった
  - `#charBg`（`display:inline-block; position:relative; line-height:0`）を `#charImg` の直接の親として追加
  - canvas が `#charBg`（= 画像とぴったり同じ大きさ）に貼り付くよう修正

---

## v2.466.0 — 2026-06-05

### ageru.html — スマホ拡大防止・ぷるぷる反映

- `public/ageru.html`:
  - `#msgInput` の `font-size` を `14px → 16px` に変更（iOS Safari の自動拡大を防止）
  - ぷるぷるエンジン（`_puruWeight` / `_puruDisplace` / `_puruTri` / `_puruRenderCanvas` / `_puruStartLoop` / `_puruAttach`）を app.js から移植
  - `updatePurupuru()` を追加。`localStorage: purupuruConfig` の `__agru__/...` キー設定を読み込み、キャラ画像に適用
  - 画像切り替え時・初期表示時に `updatePurupuru()` を呼び出し

---

## v2.465.0 — 2026-06-05

### ageru.html — システムプロンプト独立化・サーバー保存・画像拡大

- `public/ageru.html`:
  - 基本プロンプト（AGRU_DEFAULT_SYSTEM）を除去。システムプロンプトはモーダルで設定した内容のみを使用
  - システムプロンプトをサーバー（`/api/ageru-page-system`）から取得・保存に変更
  - キャラ画像を1.5倍に拡大（`clamp(160px,30vh,260px)` → `clamp(240px,45vh,390px)`）
- `server.js`: `GET/POST /api/ageru-page-system` エンドポイント追加（`data/settings.json` の `agruPageSystem` キーに保存）

---

## v2.464.0 — 2026-06-05

### アゲルちゃん独立ページ追加（/ageru.html）

- `public/ageru.html`: 新規作成
  - スマホ最適化の縦長UI（max-width 480px、dvh 対応、safe-area 対応）
  - キャラ画像・感情切り替え・チャットバブル表示
  - 直接チャット送信（ユーザー入力欄 + Enterキー送信）
  - 専用追加システムプロンプト（`localStorage: agruPageSystem`、設定モーダルで編集）
  - モデル選択プルダウン（`localStorage: aiModel` と共有）
  - VoiceVox 読み上げ対応（元の設定と共有）
  - 元の会話モード（index.html）には影響なし

---

## v2.463.0 — 2026-06-05

### ダメージランキング — ボス撃破ごとにリセットされるバグを修正

- `public/app.js`: `renderRankingPanel()` のダメージ表示を修正
  - 修正前: `bossState ? bossDamageMap : cumulativeDmgMap`（新ボス湧き時に空の `bossDamageMap` を表示してリセットに見えた）
  - 修正後: 常に `cumulativeDmgMap`（全ボス通算）と `bossDamageMap`（現ボス分）をマージして表示

---

## v2.462.0 — 2026-06-05

### アゲルちゃん VoiceVox — 括弧内テキストを読み上げから除外

- `public/app.js`: `_agruPlayVoicevox()` で VoiceVox 送信前に全角・半角括弧 `（）`/`()` で囲まれた文字列を除去

---

## v2.461.0 — 2026-06-05

### AIモデル選択に3モデルを追加

- `public/admin.html`: `aiModelInput` プルダウンに以下の3モデルを追加
  - `huihui_ai/qwen2.5-1m-abliterated:14b`
  - `mdq100/Gemma3-Instruct-Abliterated:12b`
  - `huihui_ai/gemma-4-abliterated:31b`

---

## v2.460.0 — 2026-06-05

### アゲルちゃん — 返答文字数を70文字程度に変更

- `public/app.js`: `AGRU_DEFAULT_SYSTEM` の返答文字数指示を40文字→70文字に変更
  - `[コメントへの返答（40文字程度、必ず日本語のみ）]` → `[コメントへの返答（70文字程度。短くてもよい。必ず日本語のみ）]`

---

## v2.459.0 — 2026-06-03

### ぷるぷる新モード追加・アゲルちゃん会話中カメラ手振れ

#### ぷるぷる新モード: スカート・猫耳
- `public/app.js` / `public/admin.html`: `_puruDisplace` / `_pvDisplace` に2モード追加
  - `skirt`（🎀 スカート）: 主周波数 + 2種の振幅変調で風に揺れるランダム感のある横揺れ、わずかな縦ドリフト付き
  - `neko`（🐱 猫耳）: 上向き専用パルス（rectified sine）+ 頂点での小刻み quiver + 微細な横揺れ
- `public/admin.html`: `PURU_MODE_LABELS` に `skirt` / `neko` を追加

#### アゲルちゃん会話中カメラ手振れ
- `public/app.js`: `_agruStartShake()` / `_agruStopShake()` を追加
  - 3つの非整数比周波数 sine の合成で手持ちカメラ風の非周期的な X/Y ドリフト（±2px）と回転（±0.18°）
  - `.agru-char-frame` に inline transform で適用
- `public/app.js`: `openAgruModal()` 末尾で `_agruStartShake()` を呼び出し
- `public/app.js`: `closeAgruModal()` 先頭で `_agruStopShake()` を呼び出し、transform をリセット

---

## v2.456.0 — 2026-06-03

### ぷるぷる設定改善・呼吸アニメーション無効化ボタン追加

#### ぷるぷる: 最後に編集した値を次の画像のデフォルトとして引き継ぎ
- `public/admin.html`: `_puruLastPointTpl` を localStorage に保存
  - `syncPuruPoint(i)` 実行時に `_puruSaveTpl(pt)` でアニメーション値（mode/amplitude/speed/radius/shape/width/height/rotation/direction）を記録
  - `_puruMkPt()` で新規画像のデフォルト生成時にテンプレートを適用（x/y/phase/enabled は per-point デフォルトを維持）

#### ぷるぷる: 有効済み画像を非表示フィルター
- `public/admin.html`: 「有効済を非表示」ボタン（`puruHideEnabledBtn`）を追加
  - `togglePuruHideEnabled()` でグリッドの有効画像アイテムをトグル表示/非表示
  - 設定変更時と画像グリッド再構築時に自動でフィルター適用

#### ぷるぷる: プレビューのポイントオーバーレイ非表示トグル
- `public/admin.html`: プレビュー下に「P非表示」ボタン（`puruHideOverlayBtn`）を追加
  - `togglePuruOverlay()` で `_puruHideOverlay` フラグをトグル
  - `_puruRenderPreview()` でフラグが true の場合オーバーレイ描画をスキップ

#### キャラ呼吸アニメーション（breathe）無効化ボタン
- `public/style.css`: `body.no-breathe .avatar { animation: none !important; }` を追加
- `public/app.js`: `breatheDisabled` 変数を追加（localStorage 永続化）
- `public/app.js`: `toggleBreatheBtn` クリックで `body.no-breathe` をトグル、設定保存
- `public/index.html`: `<button id="toggleBreatheBtn">` をSettings バーに追加
- `public/admin.html`: 表示セクションに「🫁 呼吸」ボタンを追加

---

## v2.455.0 — 2026-06-03

### アゲルちゃん画像切り替えをスライドアニメーションに変更

- `public/app.js`: `_agruSlideImage(newSrc)` 関数を追加
  - 現在の画像クローンを左へスライドアウト、新画像を右からスライドインする 0.35s のアニメーション
  - `.agru-char-bg`（overflow:hidden、position:relative）内でクリッピング
  - スライド中は puru-canvas を非表示、完了後に `updateAgruPurupuru()` で再アタッチ
  - スライド中に次の切り替え要求が来た場合・コンテナ未発見・初期ロード前 はフォールバックで即時切り替え
- `public/app.js`: `_agruSetImage` / `_agruShowStateImage` / `_agruRevertStateImage` の `img.src` 直接書き換えを `_agruSlideImage` に統一

---

## v2.454.0 — 2026-06-03

### fix: ボスのぷるぷるエリアがずれる問題を修正

- `public/style.css`: `.boss-avatar` に `position: relative` を追加
  - puru-canvas は `position: absolute; top:0; left:0; width:100%; height:100%` で配置されるため、親要素に `position: relative` がないと `#bossEl`（HPバー含む全体）を基準に配置されてしまっていた
  - ユーザーキャラの `.avatar` は既に `position: relative` を持っており、ボスだけ欠けていた

---

## v2.453.0 — 2026-06-03

### fix: 管理パネルからのステータス非表示ボタンが機能しない問題を修正

- `public/index.html`: `toggleStatsBtn` ボタン要素を追加
  - `cmd('toggleStatsBtn')` は `document.getElementById(id)?.click()` でオーバーレイ側の要素をクリックするため、index.html に要素がないと無効だった
  - `toggleBombBtn`/`toggleTrashBtn` と同様のパターンで追加

---

## v2.452.0 — 2026-06-03

### アゲルちゃん：食べ物/回復コマンドをシステムメッセージ化・履歴削減・YouTube改善・管理パネルボタン追加

#### 食べ物/回復コマンド → システムメッセージ
- `public/app.js`: 肉投与・寿司投与・たばこ投与・起きろ・エナドリ をチャットバブル/AI送信から除外
  - `_agruSend` の手前に `else if` ブロックを追加
  - `_agruUpdateParams` でパラメータ更新 → `_agruAddSystemMsg` でシステムメッセージ表示
  - カフェオレ投与・水道水投与と同様の表示形式に統一

#### 会話履歴：50往復 → 25往復
- `public/app.js`: `_agruConvHistory.length > 100` を `> 50` に変更（1往復=2要素）

#### YouTube：リアルタイム反映・時間指定再生
- `public/app.js`: `_agruOpenYtModal` に `startTime` パラメータを追加、`&start=N` をiframe URLに付与
- `public/app.js`: `_agruPlayYouTube` に `startTime` パラメータを追加、呼び出し元から伝播
- `public/app.js`: YouTubeコメントURL解析で `[?&]t=(\d+)` を抽出し startTime として渡す
- `public/app.js`: `agruYtWidth` 変更時にライブiframeのwidthをリアルタイム更新
- `public/app.js`: `agruYtHeight` 変更時にライブiframe/モーダルのwidth/heightをリアルタイム更新
- `public/app.js`: `agruYtVolume` 変更時に `postMessage` で `setVolume` コマンドをiframeに送信
- `public/admin.html`: YouTubeモーダル幅・高さ入力を `onchange` → `oninput` に変更

#### ステータス非表示トグルボタン（管理パネル）
- `public/app.js`: `charStatsHidden` 変数を追加（localStorage永続化）
- `public/app.js`: `toggleStatsBtn` クリックで `body.stats-hidden` クラスをトグル
- `public/style.css`: `body.stats-hidden .char-stats { display: none !important; }` を追加
- `public/admin.html`: 表示セクションに「📊 ステータス」ボタンを追加
- `public/app.js`: 設定保存リストに `charStatsHidden` を追加

#### 画像コマンド許可/無視トグルボタン（管理パネル）
- `public/app.js`: `agruImgCmdEnabled` 変数を追加（localStorage永続化、デフォルト許可）
- `public/app.js`: `_agruSend` 内の `_needsImage` 検出を `agruImgCmdEnabled` フラグでガード
- `public/app.js`: `agruImgCmdEnabled` を設定ハンドラ・状態送信に追加
- `public/admin.html`: アゲルちゃん設定に「画像コマンド」許可/無視ボタンを追加（`agruYtEnabledBtn` と同スタイル）
- `public/admin.html`: 設定復元時に `agruImgCmdEnabledBtn` の表示状態を反映

---

## v2.451.0 — 2026-06-03

### ぷるぷる：反転ポイント座標ミラーを削除（v2.450の誤修正を訂正）

- `public/app.js`: `_puruRenderCanvas` からX座標ミラー（`W*(1-pt.x/100)`）を削除
  - canvas全体にCSS `scaleX(-1)` を適用することで画像と揺れポイントが一緒に反転されるため、ポイント座標の個別ミラーは不要かつ逆効果だった
  - v2.450で追加したミラーにより揺れが反対側に発生していた問題を修正

---

## v2.450.0 — 2026-06-03

### ぷるぷる：水平反転対応（ボス・キャラ・歩き）

- `public/app.js`: `_puruAttach` に `flipped` パラメータを追加
  - `canvas._puruFlipped` を保存し、`canvas.style.transform = 'scaleX(-1)'` をcanvas要素に適用
- `public/app.js`: `updateBossPurupuru` でボスcanvasを `flipped=true` で生成（CSS `.boss-avatar img { scaleX(-1) }` と同期）
  - ぷるぷる有効時にボスの水平反転が消えていた問題を修正
- `public/app.js`: `updatePurupuruOverlay` で `isUserFlipped(user)` を渡してキャラcanvasの反転状態を初期化
- `public/app.js`: `applyFacingFlip` でpuru-canvasの `transform` と `_puruFlipped` も更新
  - 歩き時の方向転換でもぷるぷるcanvasが正しく反転するように
- `public/app.js`: `_puruRenderCanvas` で `canvas._puruFlipped` が true の場合、ポイントX座標をミラー（`W*(1 - pt.x/100)`）
  - CSS scaleX(-1) と組み合わせて揺れポイントが視覚的に正しい位置で動くよう補正

---

## v2.449.0 — 2026-06-03

### ぷるぷる：GCプレッシャー排除・カクつき低減

- `public/app.js`: `_puruDisplace` の戻り値をscratchオブジェクト化（`_puruDispBuf`）
  - 毎フレーム8pt×441頂点＝3500超の `{dx,dy}` オブジェクト生成→GCを排除
- `public/app.js`: `_puruWeight` の三角形分岐で `cr()` クロージャをインライン展開
  - 三角形ゾーン使用時の関数オブジェクト生成を排除
- `public/app.js`: `_puruWeight` の三角形回転trig値をpointオブジェクトにキャッシュ（`_wRot/_wC/_wS`）
- `public/app.js`: `_puruTri` の `ep()` をインライン展開
  - 1フレームあたり gs=20 なら800個（20×20×2三角×2点）の小配列生成を排除
- `public/app.js`: `_puruRenderCanvas` の `Float32Array` バッファをcanvasに持たせて使い回し
  - 毎フレームの `new Float32Array(882)` × 2本を排除
- `public/app.js`: `getBoundingClientRect()` を120フレームごと・未初期化時のみ呼ぶようにキャッシュ
  - 毎フレームの強制レイアウト再計算を排除
- `public/app.js`: `getComputedStyle()` をfitKeyが変わった時のみ呼ぶようにキャッシュ
  - 毎フレームのスタイル再計算を排除
- `public/app.js`: `cfg.points.filter()` を除去、直接インデックスループで `pt.enabled` チェック
- `public/app.js`: `pt.direction` のtrig値をpointオブジェクトにキャッシュ（`_dDir/_dC/_dS`）

---

## v2.448.0 — 2026-06-03

### ぷるぷる：ステージ/プレビュー揺れ一致・揺れ方向設定

- `public/app.js`: `_puruRenderCanvas` にampScaleを追加（`cssH / 420`）
  - amplitudeをadminプレビュー基準高さ(420px)で定義し、ステージ表示サイズに比例させる
  - ステージでキャラが小さく表示されても揺れの見た目がプレビューと同じ比率に
- `public/app.js`, `public/admin.html`: 各ポイントに `direction`（方向°）パラメータを追加
  - 揺れベクトルを指定角度で回転させる（縦揺れを斜め方向にするなど）
  - 0° = そのまま / 90° = 90°回転（縦揺れ→横揺れ） / -45° = 斜め45°
- `public/admin.html`: 各ポイントUIに「方向°」入力欄を追加（-180°〜+180°、15°刻み）
- `public/admin.html`: プレビューレンダラーにも direction 回転を適用し、プレビューとステージの挙動を統一

---

## v2.447.0 — 2026-06-03

### ぷるぷる：スーパーサンプリング・メッシュ細分化で画質向上

- `public/app.js`: `_puruRenderCanvas` にスーパーサンプリング（SS=2）を追加
  - canvasバッファを表示サイズの2倍解像度でレンダリングし、CSSで縮小表示
  - ブラウザのダウンサンプリングによりアンチエイリアスが大幅向上（三角形エッジの段差・シーム低減）
- `public/app.js`: `_puruDefaultCfg` のデフォルト `gridSize` を 12 → 20 に変更
  - メッシュ頂点数が増え、変形時の面取り感（faceted look）が減少してなめらかな揺れに

---

## v2.446.0 — 2026-06-03

### ぷるぷる：形状ゾーン・プレビューアニメ・アスペクト比修正・未整理除外

- `public/app.js`: `_puruWeight()` 新関数追加 — 揺れポイントの影響ゾーンを円・四角・三角から選択可能に
  - `circle`（円）: 半径%で指定、距離ベースの重み
  - `rect`（四角）: 横幅%・縦幅%で独立指定、Chebyshev距離ベースの重み
  - `triangle`（三角）: 半径%＋回転°で正三角形ゾーン、重心距離ベースの重み
- `public/app.js`: `_puruDefaultCfg()` の各ポイントに `shape:'circle', width:60, height:30, rotation:0` を追加
- `public/app.js`: `_puruRenderCanvas` でobject-fit対応のUV座標補正を実装
  - CSSの `object-fit: cover` / `object-position` を読み取り、自然画像座標系でsrcX/srcY/srcW/srcHを計算
  - Float32Array `uvs` でグリッド頂点のUV座標を事前計算し `_puruTri` に渡す
  - 会話モードのアゲルちゃんでアスペクト比が崩れていた問題を修正
- `public/app.js`: `_puruTri` に `imageSmoothingQuality = 'high'` を追加（画質向上）
- `public/admin.html`: 揺れポイント設定UIに形状ドロップダウン追加（`puru-pt-shape`）
  - 形状ごとに表示する入力欄を切り替え（`data-shapes` 属性で制御）
  - 四角選択時: 横幅%・縦幅% 表示、半径・回転非表示
  - 三角選択時: 半径%・回転° 表示、横幅・縦幅非表示
- `public/admin.html`: プレビューキャンバスをRAFアニメーションループに変更（静止画から実際の揺れをリアルタイム表示）
  - `_puruStartPreviewLoop()` / `_puruRenderPreview()` 追加
  - `_pvDisplace()` / `_pvWeight()` / `_pvTri()` をadmin側に実装
  - 形状ゾーンのオーバーレイ（円・四角・三角）をプレビュー上に描画
- `public/admin.html`: `puruBuildImgGrid` で「未整理」フォルダを除外（ぷるぷる設定グリッドに表示しない）

---

## v2.445.0 — 2026-06-03

### ぷるぷる・揺れ設定：アゲルちゃん画像別設定・2カラムレイアウト

- `public/admin.html`: 揺れ設定を「プレビュー左・設定右」の2カラムレイアウトに変更（`jigglePanelWrap`）
- `public/admin.html`: ぷるぷる設定を「プレビュー左・設定右」の2カラムレイアウトに変更（`puruPanelWrap`）
- `public/admin.html`: `puruRefreshImages()` で `/api/ageru-emotion-map` も取得し、アゲルちゃん画像をフォルダ別・ファイル別に個別グリッド表示
- `public/admin.html`: ぷるぷる設定キーを `__agru__` 単一から `__agru__/${folder}/${file}` 形式に変更
- `public/app.js`: `updateAgruPurupuru()` で現在表示中の画像パスからキーを動的生成（`/ageru/folder/file.png → __agru__/folder/file.png`）

---

## v2.444.0 — 2026-06-03

### ぷるぷる：画質修正・プレビュー拡大・揺れモード追加

- `public/app.js`: `_puruRenderCanvas` で `devicePixelRatio` を考慮したcanvas解像度に修正（高DPIで画像が荒くなる問題を解消）
- `public/app.js`: `_puruDisplace` に胸揺れ向け4モードを追加
  - `breast`（むね揺れ）: 縦振動メイン＋1.5倍周波数の横成分で自然な揺れ
  - `bounce`（バウンス）: `|sin|` パターンで重力バウンス感
  - `spring`（バネ弾み）: 縦振動に3倍高調波を加えたバネ感
  - `flutter`（ふるふる）: 高周波数の細かい振動
- `public/admin.html`: プレビュー画像の高さを 300px → 600px に拡大
- `public/admin.html`: `PURU_MODE_LABELS` に上記4モードを追加

---

## v2.443.0 — 2026-06-03

### ぷるぷる：グリッド線非表示・プレビューOFF点非表示

- `public/app.js`: `_puruTri` のクリップパスを重心から0.6px外側に拡張し、三角形間のseam（グリッド線）を消去
- `public/admin.html`: `_puruDrawPreview` でOFFのポイントをプレビューキャンバスから非表示に変更

---

## v2.442.0 — 2026-06-03

### ぷるぷる設定：画像別保存対応・統合バグ修正

- `public/admin.html`: `applyState` ハンドラの `_puruLoadUI` 参照を `_puruAllConfig = JSON.parse(...)` に修正（関数削除後の stale 参照）
- `public/admin.html`: `d.type === 'users'` ハンドラに `puruBuildImgGrid(d)` 呼び出しを追加（画像グリッドが更新されていなかった問題を修正）

---

## v2.441.0 — 2026-06-03

### ぷるぷるエンジン実装（Canvas メッシュ変形）

- `public/app.js`: ぷるぷるエンジン追加（Canvas 2D メッシュ変形 + アフィンテクスチャマッピング）
  - `purupuruConfig` グローバル設定（8ポイント、グリッドサイズ、対象設定）
  - `_puruDisplace(pt, t)` — 各動きモード計算（円/横揺れ/縦揺れ/縦波/リサジュー）
  - `_puruTri(ctx, img, ...)` — 三角形アフィンテクスチャマッピング
  - `_puruRenderCanvas(canvas)` — メッシュ変形描画（全頂点を影響範囲加重平均で変位）
  - `_puruStartLoop()` — 単一 requestAnimationFrame ループで全キャンバスを更新
  - `_puruAttach(parent, imgEl)` — キャンバスを対象要素にオーバーレイ設置
  - `updatePurupuruOverlay(user)` — キャラアバター用
  - `updateBossPurupuru()` — ボス用
  - `updateAgruPurupuru()` — アゲルちゃん（会話モード）用
  - `_puruApplyAll()` — 設定変更時に全対象を再適用
- `public/app.js`: `applyAvatarStyle` の `adjustSize` コールバックに `updatePurupuruOverlay` 追加
- `public/app.js`: `updateBossJiggleOverlay` に `updateBossPurupuru` 追加
- `public/app.js`: `openAgruModal`・`_agruShowStateImage`・`_agruRevertStateImage` に `updateAgruPurupuru` フック追加
- `public/app.js`: `purupuruConfig` を SETTINGS_KEYS に追加、state 保存・メッセージハンドラ追加
- `public/admin.html`: 「🌊 ぷるぷる設定」セクション追加
  - 有効トグル・対象選択（キャラ/ボス/アゲルちゃん）・グリッドサイズ
  - 8ポイント個別設定（有効、X/Y位置、半径、振幅、速さ、動きモード、位相）
  - プレビューキャンバス（ドラッグでポイント位置調整、影響範囲円表示）

---

## v2.440.0 — 2026-06-03

### ドキュメント更新 — index.html アゲルちゃんセクション最新化

- `index.html`: 「会話モーダル」カードを更新 — パラメータメーターがキャラ画像左下オーバーレイ表示に変わった点を反映
- `index.html`: 「AI返答システム」カードを更新 — 4行形式レスポンス（感情/好感度変化/性欲変化/返答）に修正
- `index.html`: 「好感度システム」カードを「パラメータシステム」カードに刷新
  - 4パラメータ（好感度♥ / 空腹◆ / 眠気● / 性欲❓★）の記号・変動ルールを一覧表示
  - 性欲がチャット内容で±5変動することを追記
  - パラメータ変化時のポップアップ通知（上昇↑浮上・下降↓沈降、2.6秒）を追記
- `index.html`: フォルダ構成 info-box にパラメータ管理（管理パネルから直接セット可能）の説明を追記

---

## v2.439.0 — 2026-06-02

### セーブ管理 — 保護チェック付き一括削除

- `public/admin.html`: セーブ一覧の各行に「保護」チェックボックスを追加
- `public/admin.html`: 「🗑 保護以外を削除」ボタン追加 — チェックなしのセーブを一括削除
- `public/admin.html`: `deleteUnprotectedSave()` 関数追加（対象件数を確認ダイアログで表示）
- 既存の「🗑 全削除」ボタンはそのまま残存

---

## v2.438.0 — 2026-06-02

### 会話モード — 性欲度がチャット内容で変化するように

- `public/app.js`: `AGRU_DEFAULT_SYSTEM` のレスポンスフォーマットに性欲変化行を追加（3行目）
  - 性的・刺激的・エッチな話題: +1〜+5
  - 性欲を冷ます内容: -1〜-5
  - 通常の会話: 0
- `public/app.js`: `_agruParseResponse` で `libidoDelta` を解析（3行目の数値）、戻り値に追加
- `public/app.js`: `_agruSend` / `_agruDebug` で `libidoDelta` を `agruLibido` に反映し、ポップアップ表示

---

## v2.437.0 — 2026-06-02

### 会話モード — パラメータ表示リニューアル

- `public/index.html`: パラメータ4種（好感度・空腹・眠気・❓）をキャラ画像に重ねて左下に配置 (`.agru-params-overlay`)
- `public/style.css`: `.agru-affinity-display` / `.agru-params-right` / `.agru-param-display` を廃止し、`.agru-params-overlay` / `.agru-param-row` に置換
- `public/style.css`: パラメータ変化ポップアップ用 `.agru-param-pop` + `@keyframes agru-pop-float` 追加
- `public/app.js`: `_agruShowParamPop(text, color)` 関数を追加。パラメータ変化時にテキストが浮かんでフェードアウト
  - 好感度↑: 💕 ピンク / ↓: 💔 グレー
  - 空腹↑(お腹すいた): 🍖 赤 / ↓(食べた): 🍖 オレンジ
  - 眠気↑: 💤 インディゴ / ↓: 💤 イエロー
  - 性欲: ❓ パープル/グレー
- `public/app.js`: 性欲メーターの絵文字を 🔥 → ❓ に変更
- `public/app.js`: タイマーによる自動変化ではポップアップを表示しない（delta=0）
- `public/app.js`: コマンド・管理パネルからのパラメータ変化時のみポップアップを表示

---

## v2.436.0 — 2026-06-02

### アゲルちゃん — 死亡復活・パラメータ表示追加

- `public/app.js`: 死亡中に10回チャットが来たら空腹度50で復活（`_agruDeadWakeCount`）
- `public/app.js`: `_agruUpdateHungerDisplay` / `_agruUpdateSleepDisplay` / `_agruUpdateLibidoDisplay` 追加
- `public/app.js`: 1秒タイマー・チャットトリガー・admin SETボタンで各表示を更新
- `public/index.html`: キャラ画像右に `.agru-params-right` パネル追加（空腹🍖 / 眠気💤 / 性欲🔥 の10段ハート）
- `public/style.css`: `.agru-param-display` / `.agru-params-right` / 各色クラス追加

---

## v2.435.0 — 2026-06-02

### アゲルちゃん — 空腹度・眠気度・性欲度パラメータ追加

#### 空腹度
- 会話モード開始時 100、1時間で0になる速度で自然減少（毎秒 100/3600）
- 肉投与コメントで+30、寿司投与で+20、たばこ投与で+10
- 50以下でAIへの指示に空腹を含める、30以下で生命の危機レベル、0で死亡（「・・・」のみ返答）
- 死亡画像フォルダ: `public/ageru/dead/`

#### 眠気度
- 会話モード開始時 0、3時間で100になる速度で自然増加（毎秒 100/10800）
- 起きろコメントで-10、たばこで-10、エナドリで-30
- 90超えでAIへの指示に眠さを含める、100で睡眠状態（「・・・ｚｚｚ」のみ返答）
- 睡眠中5回チャットが来たら目覚め（眠気度70に戻す）
- 睡眠画像フォルダ: `public/ageru/sleep/`

#### 性欲度
- 会話モード開始時 30
- 80超えで発情モード（AIへの指示に性欲まみれを含める）、キャラ画像をhornyフォルダからランダム表示
- 発情画像フォルダ: `public/ageru/horny/`

#### 共通
- `public/app.js`: `agruHunger`/`agruSleepiness`/`agruLibido`/`_agruSleepWakeCount` 変数追加
- `public/app.js`: setInterval で1秒ごとに空腹減少・眠気増加
- `public/app.js`: `_agruGetStateContext()` — 状態に応じたAIプロンプト付加
- `public/app.js`: `_agruUpdateParams(message)` — チャットトリガー検出
- `public/app.js`: `_agruShowStateImage(state)` / `_agruRevertStateImage()` — 状態画像切替
- `public/app.js`: `_agruSend` に状態チェック・ショートサーキット処理を追加
- `public/app.js`: `openAgruModal` でパラメータをリセット
- `public/app.js`: `agruSetParam` adminメッセージハンドラ追加
- `server.js`: `/api/ageru-images/:folder` エンドポイント追加（サブフォルダ画像一覧）
- `public/admin.html`: デバッグ欄に空腹度/眠気度/性欲度/好感度スライダー+SETボタン追加

---

## v2.434.0 — 2026-06-02

### アゲルちゃん — キャラ画像高さを管理パネルから設定可能に

- `public/style.css`: `.agru-char-img` を `height: var(--agru-char-img-height, 360px); width: 100%; object-fit: cover; object-position: center top` に変更（横幅固定・はみ出し左右クリップ）
- `public/app.js`: `agruCharImgHeight` 変数を追加。初期値 360px、CSS変数 `--agru-char-img-height` を起動時に設定
- `public/app.js`: `SETTINGS_KEYS`・`agruText` ハンドラ・`getState` に `agruCharImgHeight` を追加
- `public/admin.html`: 会話モーダルサイズ行に「キャラ画像高さ」数値入力を追加（100〜1200px）
- `public/admin.html`: state restore に `agruCharImgHeight` を追加

---

## v2.433.0 — 2026-06-02

### アゲルちゃん — 好感度ハートを下から上に増えるよう変更

- `public/style.css`: `.agru-affinity-display` の `flex-direction` を `column` → `column-reverse` に変更

---

## v2.432.0 — 2026-06-02

### アゲルちゃん — チャットフォント太字切替ボタンを追加

- `public/style.css`: `.agru-bubble-left` / `.agru-bubble-right` に `font-weight: var(--agru-font-weight, normal)` を追加
- `public/app.js`: `agruChatBold` 変数を追加。ON 時に CSS変数 `--agru-font-weight: bold` を設定
- `public/app.js`: `SETTINGS_KEYS`・`agruText` ハンドラ・`getState` に `agruChatBold` を追加
- `public/admin.html`: 文字サイズ入力の隣に「太字 ON/OFF」ボタンを追加
- `public/admin.html`: state restore に `agruChatBold` を追加

---

## v2.431.0 — 2026-06-02

### アゲルちゃん — 好感度表示をキャラ画像の左に縦表示

- `public/index.html`: `#agruAffinityDisplay` を `.agru-char-frame` の前に移動（左側に来るよう）
- `public/style.css`: `.agru-char-inner` を `flex row` に変更してアフィニティとフレームを横並びに
- `public/style.css`: `.agru-affinity-display` の絶対配置を廃止し `flex column` の縦並びに変更

---

## v2.430.0 — 2026-06-02

### 管理パネル — ボス召喚ボタンを追加

- `public/admin.html`: ボス設定セクションに「⚔️ ボス召喚」ボタンを追加（`processComment` で `ボス召喚` コマンドを実行）

---

## v2.429.0 — 2026-06-02

### アゲルちゃん — 会話モード終了時にOllamaアンロード・管理パネルから閉じるボタン追加

- `public/app.js`: `closeAgruModal` にOllamaアンロード (`/api/ai-unload`) を追加（モーダルを閉じたらVRAMを即時解放）
- `public/app.js`: `handleAdminMessage` に `closeAgeruChat` ハンドラを追加
- `public/admin.html`: 「✕ 会話モードを閉じる」ボタンを「会話モードを開く」の隣に追加

---

## v2.428.0 — 2026-06-02

### アゲルちゃん — コマンドメッセージを会話チャットに送信しないよう除外

- `public/app.js`: `_isAgruSkipCmd(msg)` 関数を追加
  - 除外対象: ペットガチャ/スロット/タイマン/AFK/放置・無明:/射/ノベル起動/開ける/ステータス確認/ボス召喚/TTS
  - 除外対象: キャラN/名前:/色:/吹き出し:/移動:/方向移動([上下左右]:数字)/大きさ:/フォント:/飾り:/文字サイズ:/ランダムキャラ/ごしありｗ
  - 除外対象: 歩く/回転/反転/震える/ぐにゃぐにゃ/浮く/揺れる/伸縮/スキップ/酔う/太字/斜体/エフェクト系(花火・桜・雪等)/回復
- `public/app.js`: `_agruSend` 呼び出し条件に `!_isAgruSkipCmd(message)` を追加

---

## v2.427.0 — 2026-06-02

### アゲルちゃん — 好感度変動幅を調整

- `public/app.js`: `_agruParseResponse` の好感度クランプを `[-10, +5]` → `[-5, +10]` に変更
- `public/app.js`: カフェオレ投与コマンドの上昇量を `+10` → `+20` に変更
- `public/app.js`: 水道水投与コマンドの減少量を `-10` → `-5` に変更

---

## v2.426.0 — 2026-06-02

### 管理パネル — 会話モーダルZ指定をマイナス値まで対応

- `public/admin.html`: `agruModalZInput` の `min` を `1` → `-9999` に変更

---

## v2.425.0 — 2026-06-02

### YouTube — 自動再生ON/OFF切り替え・16:9自動計算・ヘッダー縮小

- `public/app.js`: `agruYtEnabled` 変数を追加。`false` 時は URL コマンド・「曲|歌」キーワードによる YouTube 再生を無視
- `public/app.js`: `SETTINGS_KEYS` に `agruYtEnabled` を追加
- `public/app.js`: `agruYtHeight` 変更時に `agruYtWidth = Math.round(height * 16/9)` を自動設定
- `public/admin.html`: 「YT自動再生」ON/OFF ボタンを追加（緑=受付中 / 赤=無視）
- `public/admin.html`: 高さ入力変更時に幅を 16:9 で自動計算・送信
- `public/admin.html`: state restore に `agruYtEnabled` を追加
- `public/style.css`: `.agru-yt-modal-header` の `padding` を `8px 14px` → `3px 10px` に変更

---

## v2.424.0 — 2026-06-02

### 通常モード — SD生成画像をキャラより手前に表示

- `public/style.css`: `.sd-image-popup` の `z-index` を `80` → `150` に変更（キャラ: 70 より確実に手前）

---

## v2.423.0 — 2026-06-02

### 通常モード — SD画像生成をキュー方式に変更（順番待ち）

- `public/app.js`: `generateSDImage` をキューエントリ登録のみに変更
- `public/app.js`: `_sdQueue` 配列と `_sdBusy` フラグを追加
- `public/app.js`: `_sdProcessQueue` / `_sdGenerateOne` を追加し、前の生成が完了してから次を処理
- キュー待ち中のキャラには「⏳ 順番待ち…」吹き出しを表示

---

## v2.422.0 — 2026-06-02

### アゲルちゃん — SNSアイコンを上寄せに変更

- `public/style.css`: `.agru-sns-bar` の `margin-top: auto` を削除し、キャラ画像の直下に配置

---

## v2.421.0 — 2026-06-02

### アゲルちゃん — チャットフォントプルダウンをFONT_MAPベースの静的リストに変更

- `public/admin.html`: Font Access API (`window.queryLocalFonts()`) を廃止（OBS Browser Source非対応のため）
- `public/admin.html`: アゲルちゃん・コメント両フォントセレクトを `<optgroup>` 構造に統一
  - Webフォント / Windows日本語 / Windows英語 / カスタム（/user-fonts/） / 汎用 の5グループ
  - `フォント：` チャットコマンドの FONT_MAP と同一フォントセットを使用
- `public/admin.html`: 廃止したFont Access API の IIFE コードを削除

---

## v2.419.0 — 2026-06-02

### アゲルちゃん — チャットフォント変更をCSS変数方式に変更（即時全体反映）

- **原因**: インラインスタイルで新規バブルにのみフォントを適用していたため、既存バブルが変わらず見た目に変化が分かりにくかった
- `public/style.css`: `.agru-bubble-left` に `font-family: var(--agru-font-left, inherit)` を追加
- `public/style.css`: `.agru-bubble-right` に `font-family: var(--agru-font-right, inherit)` を追加
- `public/app.js`: `agruFontLeft`/`agruFontRight` 変更時に CSS変数 `--agru-font-left`/`--agru-font-right` を即時更新 → 既存バブルも含め全体に即時反映
- `public/app.js`: 起動時も localStorage の値から CSS変数を初期設定

---

## v2.418.0 — 2026-06-02

### アゲルちゃん — キャラ画像上寄せ・SNSアイコン復活

- `public/style.css`: `.agru-char-area` の `padding-top` を `18px` → `4px` に変更し、フレームを上寄せ
- `public/style.css`: `.agru-sns-bar` / `.agru-sns-icon` CSS を復活（`margin-top: auto` でキャラエリア下部に配置）
- `public/index.html`: SNSアイコンバー（X・YouTube・Instagram・TikTok）を `.agru-char-area` に復活

---

## v2.417.0 — 2026-06-02

### アゲルちゃん — PCインストール済みフォントの指定、ヘッダー縮小

- `public/admin.html`: アゲルちゃん・コメントフォントにカスタム入力欄を追加（インストール済みフォント名を直接入力可能）
  - セレクトで選択するとカスタム入力欄をクリア、カスタム入力するとセレクトをクリア
  - state restore でセレクトにない値はカスタム入力欄に復元
- `public/style.css`: `.agru-modal-header` の `padding` を `11px 18px` → `4px 14px` に縮小（文字サイズは維持）

---

## v2.416.0 — 2026-06-02

### アゲルちゃん — 会話モーダルの保存位置が画面外の場合に自動リセット

- `public/app.js`: `openAgruModal` で保存位置がビューポート外の場合に `localStorage` をクリアして中央配置に戻す

---

## v2.415.0 — 2026-06-02

### アゲルちゃん — 画像コマンド時のOllama返答遅延を修正

- **原因**: `keep_alive: 0` をメインリクエストに含めていたため、Ollamaが返答生成後にモデルをアンロードしてからHTTPレスポンスを返しており、アンロード時間が返答時間に加算されていた
- `server.js`: `/api/ai-unload` エンドポイントを追加（`keep_alive: 0` でアンロードのみ実行）
- `public/app.js`: メインリクエストから `keepAlive: 0` を削除
- `public/app.js`: 画像コマンドの返答受取後に `/api/ai-unload` をバックグラウンドで呼び出す（fire and forget）

---

## v2.414.0 — 2026-06-02

### アゲルちゃん — 会話モーダル外観を管理パネルから設定可能に

- `public/admin.html`: 会話モーダル幅・高さ入力欄を追加（デフォルト 870×460）
- `public/admin.html`: 会話背景透明度スライダーを追加（デフォルト 45%）
- `public/admin.html`: チャット画像最大高さ入力欄を追加（デフォルト 350px）
- `public/app.js`: `agruModalWidth` / `agruModalHeight` / `agruModalBgOpacity` / `agruChatImgSize` 変数追加
- `public/app.js`: `openAgruModal` でモーダルのサイズと背景色を動的に適用
- `public/app.js`: `agruChatImgSize` は CSS 変数 `--agru-chat-img-maxh` で `.agru-photo-img` に即時反映
- `public/style.css`: `.agru-photo-img` の `max-height` を CSS 変数化

---

## v2.413.0 — 2026-06-02

### アゲルちゃん — 会話モーダルZ軸を管理パネルから設定可能に

- `public/admin.html`: 「会話モーダルZ」数値入力欄を追加（デフォルト 300）
- `public/admin.html`: getState復元時に `agruModalZInput` の値をセット
- `public/app.js`: `openAgruModal` でモーダルに `style.zIndex = agruModalZ` を適用

### もじあてゲーム — ヘッダー縮小

- `public/app.js`: ヘッダーから「当てたら全回復」サブテキストを削除し縦幅を節約

---

## v2.412.0 — 2026-06-02

### アゲルちゃん — YouTubeモーダル透明度を管理パネルから設定可能に

- `public/admin.html`: YT透明度スライダー（10〜100%）を追加
- `public/app.js`: `agruYtOpacity` 変数・SETTINGS_KEYS・agruTextハンドラ・getState に追加
- `public/app.js`: `_agruOpenYtModal` でモーダルの `opacity` を動的に適用

---

## v2.411.0 — 2026-06-02

### アゲルちゃん — YouTubeモーダルサイズを管理パネルから設定可能に

- `public/admin.html`: YTモーダル幅・高さの入力欄を追加（デフォルト 435×245）
- `public/app.js`: `agruYtWidth` / `agruYtHeight` 変数・SETTINGS_KEYS・agruTextハンドラ・getState に追加
- `public/app.js`: `_agruOpenYtModal` でモーダル・iframeのサイズを動的に適用

---

## v2.410.0 — 2026-06-02

### アゲルちゃん — 画像コマンド中のコメントロック修正

- `public/app.js`: `_agruSelfieLocked` を自撮りだけでなく全画像コマンド（出して/生成/写真/自撮り）に適用
- `public/app.js`: SD画像がチャットに表示されるまでロックを維持。`_imageFinally` がSD完了後にコメント待ちへ移行
- `public/app.js`: `_agruAddBubble` コールバックの独自タイマーを画像コマンド時に起動しないよう変更

---

## v2.409.0 — 2026-06-02

### Ollama — 画像コマンド後にモデルをアンロード

- `server.js`: `/api/ai-reply` に `keepAlive` パラメータを追加。Ollamaリクエストの `keep_alive` に反映
- `public/app.js`: `_agruSend` で画像生成コマンド（出して/生成/写真/自撮り）の場合に `keepAlive: 0` を送信。通常チャット時はOllama既定（5分）を維持

---

## v2.408.0 — 2026-06-01

### アゲルちゃん — ひこいち言及時の反応変更

- `public/app.js`: 「ひこいち」について聞かれた際の反応を「辛辣・嘲笑」→「照れながら隠す・はぐらかす」に変更

---

## v2.407.0 — 2026-06-01

### 会話モード — タイマン・ステータス確認を許可

- `public/app.js`: ランダムタイマン・タイマン:XX・ステータス確認から `if (agruActive) return` を削除。会話モード中でも実行可能に。チャットログへの反映なし

### YouTube URL 自動再生

- `public/app.js`: `_agruOpenYtModal(videoId)` ヘルパーを抽出、`_agruPlayYouTube(videoId?)` でID直接指定に対応
- `public/app.js`: コメントに `youtu.be/` または `?v=` / `&v=` 形式の YouTube URL が含まれていたら自動でモーダル再生。再生終了でモーダルを自動閉じ（既存動作）

---

## v2.406.0 — 2026-06-01

### ボス — ダメージランキングのリアルタイム更新

- `public/app.js`: `renderRankingPanel` でボス戦中は `bossDamageMap` を直接参照するよう変更。攻撃のたびに1秒インターバルで反映
- `public/app.js`: `spawnBoss` でボス召喚時に `bossDamageMap` をリセット

---

## v2.405.0 — 2026-06-01

### アゲルちゃん — BGMループ修正

- `public/app.js`: `_agruBgm` に `ended` フォールバックリスナーを追加。`loop=true` が機能しないブラウザ環境でも自動で先頭に戻って再生を継続する

---

## v2.404.0 — 2026-06-01

### アゲルちゃん — 「水道水投与」コマンド

- `public/app.js`: 会話モード中に「水道水投与」とコメントするとMP10を消費して好感度-10。チャットログにシステムメッセージを表示。MP不足時はバブルで通知

---

## v2.403.0 — 2026-06-01

### アゲルちゃん — 「カフェオレ投与」コスト変更・システムメッセージ表示

- `public/app.js`: カフェオレ投与のMPコストを10→50に変更
- `public/app.js`: `_agruAddSystemMsg(text)` 関数追加。チャットログに中央寄せのシステムメッセージを表示
- `public/app.js`: カフェオレ投与実行時のチャットログ表示をキャラクターバブルからシステムメッセージ形式に変更
- `public/style.css`: `.agru-system-msg` スタイル追加（中央寄せ、薄ピンク文字）

### ごしありw — 同一ユーザー5分クールダウン

- `public/app.js`: `_goshiariCooldown` Map追加。同一ipidからのごしありwコマンドは5分に1回のみ実行可能

---

## v2.402.0 — 2026-06-01

### アゲルちゃん — 「カフェオレ投与」コマンド

- `public/app.js`: 会話モード中に「カフェオレ投与」とコメントするとMP10を消費して好感度+10。チャットログにコメント者名入りのメッセージを表示。MP不足時はバブルで通知

---

## v2.401.0 — 2026-06-01

### アゲルちゃん — BGMフェードイン・フェードアウト

- `public/app.js`: `_agruBgmFadeIn/Out` を実装（1.5秒、30msステップ）。再生・再開時はフェードイン、一時停止・停止時はフェードアウト後に `pause()`
- `public/app.js`: フェード中に新たなフェードが始まった場合は前のタイマーをキャンセル

---

## v2.400.0 — 2026-06-01

### アゲルちゃん — BGM音量を管理パネルから設定可能に

- `public/app.js`: `agruBgmVolume` 変数を追加（localStorage保存、デフォルト50）、SETTINGS_KEYSに追加
- `public/app.js`: BGMオブジェクトの初期音量を `agruBgmVolume/100` で設定、`agruText` ハンドラで即時反映
- `public/admin.html`: BGM音量スライダー（`#agruBgmVolumeInput`、0〜100%）をYouTube音量の上に追加、状態復元対応

---

## v2.399.0 — 2026-06-01

### アゲルちゃん — BGM再生（bgm.mp3）

- `public/app.js`: `_agruBgm`（`/ageru/oto/bgm.mp3`、loop）を追加、`_agruBgmPlay/Pause/Stop` ヘルパーを定義
- `public/app.js`: `openAgruModal` でBGMループ再生開始、`closeAgruModal` で停止（currentTime=0）
- `public/app.js`: `_agruPlayYouTube` でBGMを一時停止、`closeAgruYtModal` でBGMを再開（会話モーダルが開いている場合のみ）

---

## v2.398.0 — 2026-06-01

### アゲルちゃん — 自撮りロック中は全コメント無視・生成完了でコメント待ちへ

- `public/app.js`: 自撮りロック中（`_agruSelfieLocked`）は自撮り以外のコメントも含め全て無視するよう変更
- `public/app.js`: `_agruGenerateSDImage` の Promise 完了時（成功・失敗とも）にアイドルタイマーをキャンセルし、即座に `agruIdle=true` / `コメント待ち...` へ移行

---

## v2.397.0 — 2026-06-01

### アゲルちゃん — 「止めて」でYouTube停止

- `public/app.js`: チャットに「止めて」が含まれていたら `closeAgruYtModal()` を呼び出し、YouTubeモーダルを閉じて再生停止

---

## v2.396.0 — 2026-06-01

### アゲルちゃん — YouTube音量設定・自撮りコマンドロック

- `public/app.js`: `agruYtVolume` 変数を追加（localStorage保存、デフォルト100）、SETTINGS_KEYSに追加
- `public/app.js`: YouTube `onReady` イベントで `setVolume` コマンドを送信して音量を反映
- `public/app.js`: `_agruPlayYouTube` のload時に `onReady` も購読するよう変更
- `public/app.js`: `_agruSelfieLocked` フラグを追加。自撮り生成中は新たな自撮りコマンドを無視、画像バブル表示後（成功・失敗とも）にロック解除
- `public/app.js`: `closeAgruModal` でも `_agruSelfieLocked` をリセット
- `public/admin.html`: YouTube音量スライダー（`#agruYtVolumeInput`、0〜100%）をVOICEVOX設定下に追加、状態復元対応

---

## v2.395.0 — 2026-06-01

### アゲルちゃん — YouTube専用モーダル・位置保存

- `public/index.html`: `#agruYtModal` を追加（会話モーダルとは独立した固定モーダル、`#agruYtIframe` を内包）
- `public/style.css`: `.agru-yt-modal` スタイル追加（幅435px×高さ245px、すりガラス調、ドラッグヘッダー）
- `public/app.js`: `_agruPlayYouTube` をチャットログ挿入から専用モーダル表示に変更、`enablejsapi=1` 追加
- `public/app.js`: `closeAgruYtModal()` 追加、会話モーダルclose時にも呼ぶよう変更
- `public/app.js`: YouTube再生終了（`onStateChange` info=0）を `window.message` で検知し自動クローズ
- `public/app.js`: `#agruYtModal` にドラッグIIFEを追加、`mouseup` 時に `agruYtModalX/Y` を localStorage に保存
- `public/app.js`: 会話モーダルのドラッグも `mouseup` 時に `agruModalX/Y` を保存、`openAgruModal` で復元

---

## v2.394.0 — 2026-06-01

### アゲルちゃん — モザイク無限ログ修正・チャットDOM上限10件

- `public/app.js`: `_agruAddImageBubble` の `img.onload` を `addEventListener('load', ..., { once: true })` に変更。`_applyMosaic` が `img.src` を書き換えるたびに再発火していた無限ループを解消
- `public/app.js`: `_agruTrimLog()` 関数を追加。`#agruChatLog` の子要素（タイピングインジケーター除く）を最新10件に制限し、古いものを削除
- `public/app.js`: `_agruAddBubble`・`_agruAddImageBubble`・`_agruPlayYouTube` の各 `appendChild` 後に `_agruTrimLog()` を呼び出し

---

## v2.393.0 — 2026-06-01

### アゲルちゃん — 自撮り基本プロンプトを管理パネルから設定可能に

- `public/app.js`: `const AGRU_CHAR_TAGS` を `const _AGRU_CHAR_TAGS_DEFAULT` + `let agruCharTags` に変更、localStorage から読み込んでデフォルト値にフォールバック
- `public/app.js`: `SETTINGS_KEYS` に `'agruCharTags'` を追加（サーバー保存対象）
- `public/app.js`: `agruText` ハンドラに `agruCharTags` の更新処理を追加
- `public/app.js`: `getState` に `state.agruCharTags = agruCharTags` を追加
- `public/admin.html`: SD設定セクションに自撮り基本プロンプト textarea (`#agruCharTagsInput`) を追加済み、状態復元処理も追加

---

## v2.361.0 — 2026-05-31

### アゲルちゃん — チャット効果音が鳴らない問題を修正

- `public/app.js`: `_agruPlayPopSound()` を `currentTime=0` + `play()` 方式から `cloneNode()` 方式に変更。連続チャット時に前の再生と競合して play() Promise が中断されていた問題を解消

---

## v2.392.0 — 2026-06-01

### 会話モーダル — 半透明化

- `public/style.css`: `.agru-modal` を `rgba(255,248,251,0.55)` + `backdrop-filter: blur(14px)` のすりガラス調に変更
- `public/style.css`: `.agru-char-area` / `.agru-chat-area` / `.agru-chat-log` の背景も半透明に統一

---

## v2.391.0 — 2026-06-01

### 会話モーダル — SNSアイコン削除・キャラ画像拡大

- `public/index.html`: `.agru-sns-bar` を削除
- `public/style.css`: `.agru-sns-bar` / `.agru-sns-icon` のスタイルを削除
- `public/style.css`: `.agru-char-img` の `max-height` を 290px → 360px に拡大

---

## v2.390.0 — 2026-06-01

### 会話モーダル — サイズ調整・好感度をキャラ画像に重ねて表示

- `public/style.css`: モーダル幅 890px → 870px、高さ 400px → 430px
- `public/index.html`: `.agru-char-inner` ラッパーを追加し、frame と affinity を内包
- `public/style.css`: `.agru-char-inner` を `position: relative; display: inline-block` に設定
- `public/style.css`: `.agru-affinity-display` を `position: absolute; bottom: 14px` でキャラ画像下部に重ねて表示。半透明白背景＋backdropBlur付き
- `public/style.css`: `.agru-char-img` の `max-height` を 450px → 290px に縮小してモーダル高さに合わせる

---

## v2.389.0 — 2026-06-01

### 会話モーダル — サイズ調整・チャット表示修正

- `public/style.css`: `.agru-modal` の幅 900px → 890px、高さ 600px → 400px
- `public/style.css`: `.agru-chat-area` を `flex: 0 0 600px`（固定幅）から `flex: 1`（残り幅を占有）に変更。モーダル幅縮小によりチャット欄が見えなくなっていた問題を修正

---

## v2.388.0 — 2026-06-01

### 会話モーダル — 背景暗化なし・幅調整・ドラッグ移動対応

- `public/style.css`: `.agru-overlay` の背景を `rgba(0,0,0,0.4)` → `rgba(0,0,0,0)` に変更。`pointer-events: none` でオーバーレイ自体はクリックを透過
- `public/style.css`: `.agru-modal` の幅を 980px → 900px に変更。`position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)` でオーバーレイ内に中央配置。`pointer-events: all` でクリックを受け取る
- `public/style.css`: `.agru-modal-header` に `cursor: move; user-select: none` を追加
- `public/app.js`: IIFE でドラッグ処理を初期化。ヘッダーのmousedownで `transform` を解除してpx位置に変換しdrag開始

---

## v2.387.0 — 2026-06-01

### 会話モード — YouTube再生の改善

- `public/app.js`: 新しい動画を再生する前に既存の `.agru-yt-bubble` のsrcをクリアして削除（前の動画を停止・除去）
- `public/app.js`: iframe追加後のスクロールを `requestAnimationFrame` に変更（レイアウト確定後にスクロール）

---

## v2.386.0 — 2026-06-01

### 会話モード — YouTube再生時に動画タイトルをAI返答に含める

- `server.js`: `/api/yt-random-video` で `videoRenderer.title` を取得し `{ videoId, title }` を返すように変更。重複排除も追加
- `public/app.js`: `_agruPlayYouTube()` を async に変更しタイトルを返すように修正
- `public/app.js`: `_agruSend()` で `await _agruPlayYouTube()` し、取得したタイトルをAIへのメッセージに `（今再生している曲：「{title}」）` として付加

---

## v2.386.0 — 2026-06-01

### 会話モード — キャラ背景ぼかしを15%に調整

- `public/style.css`: `.agru-char-bg::before` の `filter: blur` を 8px → 4px に変更

---

## v2.385.0 — 2026-06-01

### 会話モード — YouTube再生をチャット欄に移動

- `public/index.html`: `#agruYtPanel`（キャラエリア内の独立パネル）を削除
- `public/app.js`: `_agruPlayYouTube()` をチャットログへのiframe挿入方式に変更。`.agru-yt-bubble` divをチャットログに追加してスクロール
- `public/app.js`: `closeAgruYt()` は `.agru-yt-bubble` 内のiframeのsrcをクリア
- `public/style.css`: `.agru-yt-panel` 系を `.agru-yt-bubble` スタイルに置き換え

---

## v2.384.0 — 2026-06-01

### 会話モード — キャラ背景画像を30%ぼかし

- `public/style.css`: `.agru-char-bg::before` に背景画像を移し `filter: blur(8px)` を適用。キャラ画像本体はぼけず背景のみぼかされる
- `public/style.css`: `.agru-char-img` に `position: relative` を追加してキャラが背景の前面に描画されるよう修正

---

## v2.383.0 — 2026-06-01

### 会話モード — キャラ画像の背後にhaikei.pngを表示

- `public/index.html`: `.agru-char-frame` 内に `.agru-char-bg` ラッパーを追加
- `public/style.css`: `.agru-char-area` を元のグラデーション＋ドット柄に戻す
- `public/style.css`: `.agru-char-bg` に `haikei.png` を背景として設定（透過キャラ画像の後ろに表示）

---

## v2.382.0 — 2026-06-01

### 会話モード — アゲルちゃんエリアの背景を画像に変更

- `public/style.css`: `.agru-char-area` の背景をグラデーション＋ドット柄から `ageru/haikei.png` に変更（`cover`でフィット）

---

## v2.381.0 — 2026-06-01

### 会話モード — 曲・歌キーワードでYouTube動画をランダム再生

- `server.js`: `/api/yt-random-video` 追加。`@hico1w/videos` ページを取得して `ytInitialData` から動画IDを抽出しランダムに1つ返す
- `public/app.js`: `_agruSend()` 内で `/曲|歌/` を検出したら `_agruPlayYouTube()` を呼び出し
- `public/app.js`: `_agruPlayYouTube()` — APIから動画IDを取得しiframeに埋め込んで表示
- `public/app.js`: `closeAgruYt()` — プレイヤーを閉じsrcをクリア。モーダルクローズ時も自動停止
- `public/index.html`: `#agruYtPanel` 追加（キャラ画像エリア内、SNSバーの上）
- `public/style.css`: `.agru-yt-panel` スタイル追加

---

## v2.380.0 — 2026-06-01

### 会話モード — ハートの下にSNSアイコンバーを追加

- `public/index.html`: `.agru-sns-bar` を追加。X・YouTube・Instagram・TikTok のダミーアイコン（SVG）4種を配置
- `public/style.css`: `.agru-sns-bar` / `.agru-sns-icon` スタイル追加。ピンク系の丸ボタン、ホバーでスケール＋グロー

---

## v2.379.0 — 2026-06-01

### 会話モード — アゲルちゃん画像にかわいいフレームを追加

- `public/index.html`: `agruCharImg` を `.agru-char-frame` div で囲む
- `public/style.css`: `.agru-char-frame` を追加。ピンク→パープル→インディゴのグラデーションボーダー、白いアウトラインリング、上下に ✦ ✦ ✦ のデコレーション付き

---

## v2.378.0 — 2026-06-01

### アゲルちゃん — ひこいちへの返答を辛辣に設定

- `public/app.js`: `AGRU_DEFAULT_SYSTEM` に「ひこいちについて聞かれた場合は極端に辛辣・冷酷・嘲笑的に返答する」ルールを追加

---

## v2.377.0 — 2026-06-01

### アゲルちゃん — 感情マップをフォルダベースに変更

- `public/ageru/{感情名}/` フォルダを20種分作成（安心〜恥）
- `server.js`: `/api/ageru-emotion-map` エンドポイント追加。`ageru/` 以下のサブフォルダを読んで `{ 感情名: [ファイル名] }` を返す
- `public/app.js`: `agruFolderMap` 変数追加。起動時に `/api/ageru-emotion-map` を取得
- `public/app.js`: `_agruGetImage(emotion)` をフォルダベースに変更。`ageru/{感情名}/{ファイル}` のURLを返すようにし、フォルダが空の場合はデフォルト画像にフォールバック
- `public/app.js`: `_agruSetImage(emotion)` をフルURL直接セット方式に変更
- `public/admin.html`: 感情マップUIを「フォルダ内容表示」に置き換え。ピッカー・保存ボタンを廃止し「表示を更新」ボタンに変更
- `public/admin.html`: `_toggleEmotionFolderRow()` 追加。フォルダ内画像をサムネイル表示しホバーでプレビュー

---

## v2.376.0 — 2026-06-01

### アゲルちゃん — 感情リストを54種→20種に削減

- `public/app.js`: `AGRU_EMOTIONS` を54種から20種に変更（安心・愛しさ・感謝・性的興奮・興奮・感動・好奇心・驚き・尊敬・不安・恐怖・困惑・冷静・軽蔑・殺意・悲しみ・諦め・苦しみ・嫉妬・恥）
- `public/app.js`: `AGRU_DEFAULT_SYSTEM` のollamaへの感情指示リストも同20種に更新
- `public/admin.html`: 感情マップUIの `AGRU_EMOTIONS` も同20種に更新

---

## v2.375.0 — 2026-06-01

### 管理パネル — 感情マップで他の感情に割り当て済み画像を非表示に

- `public/admin.html`: `_buildEmotionPicker()` で `_agruEmotionMapLocal` を走査し、他の感情に割り当てられている画像をピッカーから除外

---

## v2.374.0 — 2026-06-01

### 管理パネル — 感情マップUIを左右レイアウトに変更

- `public/admin.html`: 感情リストを左・プレビューパネルを右に並べ、画像ホバー時にプレビューを確認しながら選択できるレイアウトに変更
- `public/admin.html`: プレビューパネルを `position:sticky;top:0` にしてスクロール時も右側に固定表示
- `public/admin.html`: 感情リストの `max-height` を 320px → 480px に拡張

---

## v2.373.0 — 2026-06-01

### 管理パネル — デフォルト画像選択もアコーディオン方式に変更

- `public/admin.html`: デフォルト画像エリアをサマリー行（選択中サムネイル表示）＋クリックで展開するピッカーに変更
- `public/admin.html`: ピッカーはオンデマンド構築のため初期ロード時に全画像のDOMを生成しない
- `public/admin.html`: `_refreshDefaultThumb()` 追加、`toggleDefaultImgPicker()` 追加

---

## v2.372.0 — 2026-06-01

### 管理パネル — 感情マッピングをアコーディオン方式に変更（パフォーマンス改善）

- `public/admin.html`: 感情グリッドを「全感情×全画像のDOM一括生成」から「サマリー行のみ表示＋クリックで1感情分だけピッカーを展開」するアコーディオン方式に変更
- `public/admin.html`: ピッカーはオンデマンド生成のため、初期ロード時のDOM生成量を 感情数×画像数 → 感情数 のみに削減
- `public/admin.html`: 感情ごとの選択済み画像をサムネイル（最大3枚）でサマリー表示
- `public/admin.html`: `saveAgruEmotionMap()` を `_agruEmotionMapLocal` から直接収集する方式に変更
- `public/admin.html`: `applyState` の感情マップ復元を `_refreshEmotionSummary()` 呼び出しに変更

---

## v2.371.0 — 2026-05-31

### 会話モード — チャット欄の生成画像表示高さを変更

- `public/style.css`: `.agru-photo-img` の `max-height` を `300px` → `350px` に変更

---

## v2.370.0 — 2026-05-31

### アゲルちゃん — 自撮りコマンドのコメント部分を翻訳してからプロンプトに付与

- `server.js`: `/api/translate` エンドポイントを追加（POST `{text}` → `{result}` 英語訳）
- `public/app.js`: 自撮りコマンド時にコメント部分（`_ctx`）を `/api/translate` で先に翻訳してから `AGRU_CHAR_TAGS` と結合。従来は結合後に全体翻訳されLoRAタグ等が壊れていた

---

## v2.369.0 — 2026-05-31

### アゲルちゃん — 自撮り基本プロンプトを更新

- `public/app.js`: `AGRU_CHAR_TAGS` を LoRA (`Cosmic Princess Kaguya anime Style`) 使用の新プロンプトに変更

---

## v2.368.0 — 2026-05-31

### アゲルちゃん会話モード — 画像生成をOllama不使用の直接翻訳方式に変更

- `public/app.js`: `_needsImage` 時に `_agruGenerateSDImageFromReply()`（Ollamaでプロンプト生成）を廃止
- `public/app.js`: 「出して」「写真」「生成」コマンドはコメントからキーワードを除いた文字列をそのままプロンプトとして渡す（通常モードと同じ方式、サーバーで翻訳）
- `public/app.js`: 「自撮り」コマンドは `AGRU_CHAR_TAGS`（基本プロンプト）＋翻訳したコメントを結合して生成
- `public/app.js`: `AGRU_CHAR_TAGS` を新しいプロンプト（anime coloring, tareme, zidoriPose, garter straps等追加）に更新

---

## v2.367.0 — 2026-05-31

### 会話モード SD生成設定 — CFG Scale を追加

- `public/app.js`: `agruSdCfgScale` 変数を追加（0=SD生成設定の値を使用）
- `public/app.js`: `_agruGenerateSDImage()` で `agruSdCfgScale || cfg.cfgScale` に変更
- `public/app.js`: SETTINGS_KEYS・agruText ハンドラ・getState に追加
- `public/admin.html`: 幅/高さ/Steps 行に CFG 入力欄を追加（空欄でSD設定値を使用）
- `public/admin.html`: `applyState` に復元処理を追加

---

## v2.366.0 — 2026-05-31

### 致命的バグ修正 — 管理パネルと接続できない問題

- `public/app.js`: `sdCfgScaleInput`・`sdSamplerInput` が index.html に存在しないため、`addEventListener()` が null 参照エラーを throw し、BroadcastChannel / WebSocket のセットアップが実行されなくなっていた
- `public/app.js`: 全 SD DOM リスナーを `?.addEventListener()` に変更してクラッシュを防止
- `public/app.js`: `initSDSettings()` 内の CFG Scale / Sampler の UI セットも null チェックを追加

---

## v2.365.0 — 2026-05-31

### ?transparent=1 ページが管理パネルと接続されない問題を修正

- `server.js`: `main` ロールの WebSocket が identify したとき、全 `admin` クライアントに `mainConnected` を通知するよう追加
- `public/admin.html`: `mainConnected` 受信時に `getState` を再送する処理を追加
  - これにより OBS Browser Source 等が後から接続しても設定が自動反映される

---

## v2.364.0 — 2026-05-31

### 管理パネル — SD設定がリロード後に失われる問題を修正

- `public/app.js`: `SETTINGS_KEYS` に `sdWidth`/`sdHeight`/`sdSteps`/`sdPopWidth`/`sdPositiveSuffix`/`sdNegative`/`sdDisplayTime`/`sdMosaicKeywords`/`sdMosaicBlock`/`sdCfgScale`/`sdSampler` を追加（これまで未登録でサーバー保存されていなかった）
- `public/app.js`: SD設定の DOM リスナーを `localStorage.setItem` のみから `saveSettingsToServer()` も呼ぶ `_sdSave()` ヘルパーに統一
- `public/app.js`: `sdCfgScaleInput`・`sdSamplerInput` の change リスナーを追加

---

## v2.363.0 — 2026-05-31

### 会話モード SD生成設定 — Steps を追加

- `public/app.js`: `agruSdSteps` 変数を追加（0=SD生成設定の値を使用）
- `public/app.js`: `_agruGenerateSDImage()` で `agruSdSteps || cfg.steps` に変更
- `public/app.js`: SETTINGS_KEYS・agruText ハンドラ・getState に追加
- `public/admin.html`: 会話モード SD生成設定の幅/高さ行に Steps 入力欄を追加（空欄でSD設定値を使用）
- `public/admin.html`: `applyState` に復元処理を追加

---

## v2.362.0 — 2026-05-31

### SD生成設定 — CFG Scale・Samplerを管理パネルで設定可能に

- `public/admin.html`: SD生成設定セクションに CFG Scale（数値入力）・Sampler（プルダウン）を追加
- `public/admin.html`: `applyState` の sdFields / sdElMap に `sdCfgScale`・`sdSampler` を追加
- `public/app.js`: `sdCfgScale`（デフォルト3）・`sdSampler`（デフォルト Euler a）変数を追加
- `public/app.js`: `_sdReadSettings()` に `cfgScale`・`sampler` を追加
- `public/app.js`: `generateSDImage()` / `_agruGenerateSDImage()` の fetch body に `cfgScale`・`sampler` を追加
- `public/app.js`: `sdText` ハンドラ・初期ロード処理に両変数を追加
- `server.js`: `/api/sd-generate` の destructuring に `cfgScale`・`sampler` を追加し、ハードコード値を置き換え

---

## v2.361.0 — 2026-05-31

### アゲルちゃん — チャット効果音が鳴らない問題を修正

- `public/app.js`: `_agruPlayPopSound()` を `currentTime=0` + `play()` 方式から `cloneNode()` 方式に変更。連続チャット時に前の再生と競合して play() Promise が中断されていた問題を解消

---

## v2.360.0 — 2026-05-31

### 会話モード — オーバーレイ背景を薄く変更

- `public/style.css`: `.agru-overlay` の `background` を `rgba(0,0,0,0.88)` → `rgba(0,0,0,0.4)` に変更

---

## v2.359.0 — 2026-05-31

### アゲルちゃん — チャットフォントサイズ・フォント種類を管理パネルで設定可能に

- `public/app.js`: `agruChatFontSize`（デフォルト14px）・`agruFontLeft`（アゲルちゃん側）・`agruFontRight`（コメント側）変数を追加
- `public/app.js`: `SETTINGS_KEYS` に3変数を追加
- `public/app.js`: `_agruAddBubble()` / `_agruAddImageBubble()` でバブル生成時にフォントサイズ・フォントファミリーを `style` に適用
- `public/app.js`: `agruText` ハンドラ・`getState` レスポンスに3変数を追加
- `public/admin.html`: 「会話モード チャットフォント」セクションを追加（文字サイズ入力、アゲルちゃん/コメント別フォント選択プルダウン）
- `public/admin.html`: `applyState` に3変数の復元処理を追加
- `public/index.html`: Google Fonts (Noto Sans JP / M PLUS Rounded 1c / Zen Maru Gothic / Kosugi Maru / Reggae One / Kaisei Opti / Yuji Syuku / RocknRoll One / Stick) を preconnect + stylesheet リンクで読み込み

---

## v2.358.0 — 2026-05-31

### アゲルちゃん — コメント待ち移行時間を管理パネルで設定可能に

- `public/app.js`: `agruIdleDelay`（通常、デフォルト10秒）・`agruIdleDelayImage`（画像生成コマンド時、デフォルト30秒）変数を追加
- `public/app.js`: `SETTINGS_KEYS` に `agruIdleDelay`・`agruIdleDelayImage` を追加
- `public/app.js`: `_agruSend()` のアイドルタイマーを `(_needsImage ? agruIdleDelayImage : agruIdleDelay) * 1000` に変更（ハードコード10000から変更）
- `public/app.js`: `agruText` ハンドラに両キーの処理を追加
- `public/app.js`: `getState` レスポンスに `agruIdleDelay`・`agruIdleDelayImage` を追加
- `public/admin.html`: 会話モードSD生成設定セクションに「コメント待ち移行（秒）」「画像生成時（秒）」入力欄を追加
- `public/admin.html`: `applyState` に両入力欄の復元処理を追加

---

## v2.357.0 — 2026-05-31

### 管理パネル — AIモデルに gemma4:e4b を追加

- `public/admin.html`: モデルプルダウンに `gemma4:e4b` を追加

---

## v2.356.0 — 2026-05-31

### アゲルちゃん — 日本語のみ使用を強制

- `public/app.js`: `AGRU_DEFAULT_SYSTEM` の冒頭に「返答は必ず日本語のみ、中国語・英語は絶対使わない」指示を追加。返答フォーマット行にも「必ず日本語のみ」を明記

---

## v2.355.0 — 2026-05-31

### 管理パネル — AIモデル選択をプルダウンに変更

- `public/admin.html`: `#aiModelInput` をテキスト入力→`<select>` に変更（gemma3:4b / gemma3:12b / qwen2.5:7b）

---

## v2.354.0 — 2026-05-31

### 好感度ハート点滅を増減したハートのみに変更・普通コメントは0固定

- `public/app.js`:
  - `_agruUpdateAffinityDisplay()`: 変化したハート（増減分）のみに `agru-heart-flash` クラスを付与
  - `AGRU_DEFAULT_SYSTEM`: 好感度変化指示を「普通の雑談・挨拶・質問は必ず0」に強化
- `public/style.css`: `.agru-affinity-flash`（コンテナ全体）→ `.agru-heart-flash`（個別ハート）に変更。点滅時にscale(1.3)で拡大も追加

---

## v2.353.0 — 2026-05-31

### アゲルちゃん — 返答文字数を40文字程度に変更

- `public/app.js`: `AGRU_DEFAULT_SYSTEM` の返答文字数指示を70文字→40文字に変更

---

## v2.352.0 — 2026-05-31

### 会話モード — チャット欄背景を暗めのピンクに変更

- `public/style.css`: チャットエリア背景を `#ffffff` → `#f5e8ef`（くすみピンク）に変更

---

## v2.351.0 — 2026-05-31

### 好感度ハート点滅・返答の「」除去

- `public/app.js`:
  - `_agruUpdateAffinityDisplay(delta)`: delta≠0のときに `.agru-affinity-flash` を付与して点滅
  - `_agruParseResponse()`: replyTextの先頭・末尾の `「」` を除去
- `public/style.css`: `.agru-affinity-flash` アニメーション追加（0.6s×3回点滅）

---

## v2.350.0 — 2026-05-31

### 好感度システム・返答文字数の調整

- `public/app.js`:
  - `agruAffinity` を0〜10→0〜100管理に変更（初期値50）
  - `_agruGetAffinityContext()`: 閾値を100スケールに合わせて更新
  - `_agruUpdateAffinityDisplay()`: `filled = agruAffinity / 10` でハート10個表示
  - 好感度変化クランプを `±2` → `-10〜+5` に変更
  - `AGRU_DEFAULT_SYSTEM`: 好感度変化指示を「好感+1〜+5 / 嫌悪-1〜-10 / 普通0」に更新
  - 返答文字数を150文字程度→70文字程度に変更
- `public/style.css`: `.agru-affinity-display` のfont-sizeを16px→32pxに変更

---

## v2.349.0 — 2026-05-31

### 会話モード — モーダルデザインを白×ピンク基調にリニューアル

- `public/style.css`:
  - モーダル全体: 白×ピンク基調、角丸22px、ピンクのグロー影
  - ヘッダー: ピンクグラデーション（#f472b6→#db2777）、閉じるボタンを丸形に
  - キャラエリア: ライトピンクグラデーション、ドット模様の装飾背景、キャラ画像にドロップシャドウ
  - チャットエリア: 白背景、上部にごく薄いピンクフェード
  - アゲルちゃんバブル: ピンクグラデーション・ピンクテキスト
  - リスナーバブル: 水色グラデーション・紺テキスト
  - タイピングバブル: ピンク/水色に対応
  - ハート・感情ラベル・カーソルもピンク系に統一
- `public/index.html`: ヘッダータイトルを「🌸 星井野アゲル」に変更

---

## v2.348.0 — 2026-05-31

### アゲルちゃん — 好感度システム追加

- `public/app.js`:
  - `agruAffinity`（0〜10、初期値5）変数追加
  - `_agruGetAffinityContext()`: 好感度レベルに応じた態度指示を返す
  - `_agruUpdateAffinityDisplay()`: ♥×10のハート表示を更新
  - `AGRU_DEFAULT_SYSTEM`: 返答フォーマットに `[好感度変化（+2/+1/0/-1/-2）]` 行を追加
  - `_agruParseResponse()`: 2行目の好感度変化を抽出し `affinityDelta` を返すよう更新
  - `_agruSend()` / `_agruDebug()`: システムプロンプトに好感度コンテキストを注入、返答後に好感度を加算・表示更新
  - `openAgruModal()`: 起動時に好感度を5にリセット
- `public/index.html`: `#agruAffinityDisplay` をキャラ画像下に追加
- `public/style.css`: `.agru-affinity-display` / `.agru-heart-on` / `.agru-heart-off` を追加

---

## v2.347.0 — 2026-05-31

### 会話モード — キャラ画像を上寄せに変更

- `public/style.css`: `.agru-char-area` の `justify-content` を `flex-end` → `flex-start` に変更

---

## v2.346.0 — 2026-05-31

### 会話モード — 履歴上限変更・キャラ設定修正

- `public/app.js`:
  - `_agruConvHistory` の上限を40→100件（50往復）に変更
  - `AGRU_DEFAULT_SYSTEM` からHカップの記述を削除

---

## v2.345.0 — 2026-05-31

### 会話モード — 自撮りコマンド時のみキャラタグ+selfie poseを強制付加

- `public/app.js`:
  - `_agruSend()`: `自撮り` キーワードを `_isSelfie` フラグで別検出
  - `_agruGenerateSDImageFromReply(replyText, isSelfie)`: `isSelfie=true` の場合は `AGRU_CHAR_TAGS + ',selfie pose'` を常に前置。`出して` / `写真` 等の場合は従来通り personRe 判定のみ

---

## v2.344.0 — 2026-05-31

### 会話モード — チャット効果音を安定化

- `public/ageru/oto/pop.mp3`: 効果音ファイルをシンプルな名前でコピー
- `public/app.js`: `_agruPopAudio` をモジュールレベルで保持し `currentTime = 0` でリセット再生に変更（GCによる途中停止を防止）

---

## v2.343.0 — 2026-05-31

### 会話モード — コメント待ち表示と効果音修正

- `public/app.js`:
  - `_agruSetStatus()`: コメント待ちを右側（リスナー側）バブルに変更
  - `_agruPlayPopSound()`: ファイル名を `encodeURIComponent` でURLエンコードし再生エラーをコンソール出力
- `public/style.css`: `.agru-typing-bubble-right`（右テール・青ドット）を追加、不要な `.agru-typing-bubble-idle` を廃止

---

## v2.342.0 — 2026-05-31

### 会話モード — チャット効果音追加

- `public/app.js`:
  - `_agruPlayPopSound()` 追加（`/ageru/oto/nc280166_メッセージのポップ音.mp3` を音量50%で再生）
  - `_agruAddBubble()`: コメント・返答どちらのバブル追加時にも効果音を再生

---

## v2.341.0 — 2026-05-31

### 会話モード — コメント待ちをチャット内タイピング表示に変更

- `public/index.html`: `#agruWaitingIndicator`（右下の...）を削除
- `public/app.js`: `_agruSetStatus()` でコメント待ちも返答中と同様にチャット欄末尾にバブルを表示。アイドル時はクラス `agru-typing-bubble-idle` を付与
- `public/style.css`: `.agru-waiting-indicator` を削除。`.agru-typing-bubble-idle`（グレー・ゆっくり）を追加

---

## v2.340.0 — 2026-05-31

### アゲルちゃん — 身長・体重追加

- `public/app.js`: `AGRU_DEFAULT_SYSTEM` に身長164cm・体重48kgを追加

---

## v2.339.0 — 2026-05-31

### アゲルちゃん — キャラクター設定追加

- `public/app.js`: `AGRU_DEFAULT_SYSTEM` にバストサイズ（Hカップ）を追加

---

## v2.338.0 — 2026-05-31

### アゲルちゃん — 嫌いなもの設定追加

- `public/app.js`: `AGRU_DEFAULT_SYSTEM` に嫌いなもの（虫・どろどろしたもの・ピーマン）を追加

---

## v2.337.0 — 2026-05-31

### アゲルちゃん — 好きなもの設定追加

- `public/app.js`: `AGRU_DEFAULT_SYSTEM` に好きなもの（ゲーム・音楽・星）を追加

---

## v2.336.0 — 2026-05-31

### アゲルちゃん — 一人称を「私」に変更

- `public/app.js`: `AGRU_DEFAULT_SYSTEM` の一人称指示を「私」に変更

---

## v2.335.0 — 2026-05-31

### アゲルちゃん — キャラクター設定追加

- `public/app.js`:
  - `AGRU_DEFAULT_SYSTEM`: フルネーム「星井野アゲル（アゲルちゃん）」を明記
  - 年齢は存在しない旨を追加（聞かれたら自然にかわす）

---

## v2.334.0 — 2026-05-31

### 会話モード — チャット表示改善

- `public/app.js`:
  - `_agruSend()`: コメント泡を追加してから入力中インジケーターを末尾に追加するよう順序を修正（入力中...が常に最下部に表示）
  - `_agruScrollBottom()` ヘルパー追加（requestAnimationFrame で確実に最下部へスクロール）
  - `_agruAddBubble()`: 名前ラベルをバブル外（上）に移動し、ラッパーdivで囲む構造に変更
  - `_agruAddImageBubble()`: 同様に名前を外側へ移動
  - `_agruSetStatus()`: スクロールを `_agruScrollBottom()` に統一
- `public/style.css`:
  - `.agru-bubble-wrapper` / `.agru-bubble-wrapper-right/left` を追加（名前+バブルを縦並びで囲むコンテナ）
  - `max-width: 78%` を `.agru-bubble` から `.agru-bubble-wrapper` へ移動
  - `.agru-bubble-name` のセレクタを `bubble-wrapper` ベースに更新

---

## v2.333.0 — 2026-05-31

### ステータスモーダル — 最近のコメント表示を10件・スクロールなしに変更

- `public/app.js`: `recentComments` の表示件数を20→10件に変更
- `public/style.css`: `.sm-comment-list` の `max-height` と `overflow-y: auto` を削除

---

## v2.332.0 — 2026-05-31

### 管理パネル — 会話モード設定の復元を修正

- `public/app.js`:
  - `getState` レスポンスに `agruSystem` / `agruVoicevox*` / `agruSd*` / `agruDefaultImage` / `agruEmotionMap` を追加
  - これにより管理パネル再接続時にSD生成設定（幅・高さ・ポジティブサフィックス）や VoiceVox 設定・感情マップが正しく復元されるようになった

---

## v2.331.0 — 2026-05-31

### アゲルちゃん — ステータス表示をインジケーターに変更

- `public/index.html`:
  - キャラ画像下の `#agruStatus` テキストラベルを削除
  - `.agru-chat-area` 内に `#agruWaitingIndicator`（右寄せ3ドット）を追加
- `public/app.js`:
  - `_agruSetStatus()` を全面書き換え:
    - `返答中...` → チャット欄末尾に `.agru-typing-bubble`（バウンスする3ドット）を動的生成
    - `コメント待ち...` → `#agruWaitingIndicator` を表示（右端の小ドット）
    - その他 → 両方非表示
  - `_agruSend()`: 返信バブル追加直前にタイピングインジケーターを確実に消去
- `public/style.css`:
  - `.agru-status` を削除
  - `.agru-typing-bubble` `.agru-waiting-indicator` + `@keyframes agru-dot-bounce` を追加

---

## v2.330.0 — 2026-05-31

### ステータスモーダル — 総評欄をキャラのコメント履歴表示に変更

- `public/app.js`:
  - ステータスモーダルのHTML生成: 総評（Ollama生成テキスト）の代わりに `user.recentComments` の最新20件を表示
  - キャプチャフロー: Ollama総評リクエスト分岐を削除し、常に「最低600ms + 全画像ロード後にキャプチャ」に統一
- `public/style.css`:
  - `.sm-comment-list`・`.sm-comment-item`・`.sm-comment-num` スタイルを追加

---

## v2.329.0 — 2026-05-31

### 会話モード — モザイク適用時にマッチキーワードをログ出力

- `public/app.js`:
  - `_sdNeedsMosaic()` の戻り値を `true/false` → マッチしたキーワード文字列 or `null` に変更
  - `_agruAddImageBubble()`: モザイク適用時に「🔲 モザイク適用: キーワード「xxx」」、非適用時に「🖼 モザイクなし」をログ出力

---

## v2.328.0 — 2026-05-31

### 会話モード — SD生成で表情タグも人物判定に含める

- `public/app.js`:
  - `_agruGenerateSDImageFromReply()` の `personRe` に表情キーワードを追加
    （smile/sad/crying/angry/surprised/wink/blush 等）
  - 表情タグが含まれる場合もキャラ定義タグを前置するよう対応

---

## v2.327.0 — 2026-05-31

### 管理パネルからOllamaホストIPを設定できるように

- `server.js`:
  - `SERVER_CONFIG_PATH` (`data/server-config.json`) と `loadServerConfig` / `saveServerConfig` 追加
  - `ollamaHost` を `let` に変更し起動時に `server-config.json` から復元
  - `GET /api/ollama-host` — 現在のホストを返す
  - `POST /api/ollama-host` — ホストを変更・永続化。空欄で `127.0.0.1` にフォールバック
  - `MANAGED_SERVERS.ollama.host` を getter に変更し常に `ollamaHost` を参照
- `public/admin.html`:
  - AI設定セクション先頭に「ホストIP」入力欄を追加
  - ページロード時に `/api/ollama-host` から値を取得して表示
  - `saveOllamaHost()` 関数を追加

---

## v2.326.0 — 2026-05-31

### Ollama接続先を別PCに変更できるよう対応

- `server.js`:
  - `OLLAMA_HOST` / `OLLAMA_PORT` 定数を追加（環境変数 `OLLAMA_HOST_ADDR` / `OLLAMA_PORT_NUM` で上書き可）
  - `/api/ai-reply`・`/api/ollama-review` のOllama接続先を定数に変更（全3箇所）
  - `checkPort()` に `host` 引数を追加
  - `MANAGED_SERVERS.ollama` にも `host` フィールドを追加し、ステータス確認が別PCに対応

---

## v2.325.0 — 2026-05-31

### 会話モード — 一人称を不要に使わないよう指示追加

- `public/app.js`:
  - `AGRU_DEFAULT_SYSTEM` に追記: 一人称（自分の名前）を不要に使わない

---

## v2.324.0 — 2026-05-31

### 会話モード — アゲルちゃんのキャラクター挙動調整

- `public/app.js`:
  - `AGRU_DEFAULT_SYSTEM` に追記: 相手を「リスナーさん」と呼ぶ・一人と話しているようにふるまう

---

## v2.323.0 — 2026-05-31

### 会話モード — system promptはAGRU_DEFAULT_SYSTEMに追記する形式に変更

- `public/app.js`:
  - `_agruSend()` / `_agruDebug()`: `systemPrompt` の生成を `agruSystem.trim() || AGRU_DEFAULT_SYSTEM` から `AGRU_DEFAULT_SYSTEM + '\n\n' + agruSystem` に変更
  - 管理パネルでルールを入力しても `AGRU_DEFAULT_SYSTEM`（形式指定・感情リスト）は常に使用される

---

## v2.322.0 — 2026-05-31

### 会話モード — 画像高さ上限・VoiceVox音量・SDサーバー管理

- `public/style.css`:
  - `.agru-photo-img`: `max-height: 300px` (モーダル高さ600pxの半分) + `object-fit: contain` 追加
- `public/app.js`:
  - `SETTINGS_KEYS` に `'agruVoicevoxVolume'` 追加
  - `agruVoicevoxVolume` 変数を追加（デフォルト1.0）
  - `_agruPlayVoicevox()`: `audio.volume = agruVoicevoxVolume` を適用
  - `agruText` ハンドラに `agruVoicevoxVolume` の更新を追加
- `public/admin.html`:
  - VoiceVox設定パネルに音量スライダー（`agruVoicevoxVolume`）を追加
  - `applyState` で `agruVoicevoxVolume` を反映
  - `SRV_LABELS` に `sd: 'Stable Diffusion'` を追加
- `server.js`:
  - `MANAGED_SERVERS` に `sd` エントリを追加（port: 7860、cmd: `cmd.exe /c webui-user.bat`、cwd: `E:\\stable-diffusion-webui`）

---

## v2.321.0 — 2026-05-31

### アゲルちゃん — SDプロンプト生成で物だけの写真に対応

- `public/app.js`:
  - `_agruGenerateSDImageFromReply()`: プロンプト生成用のsystem/userメッセージを改善
    - 人物不要なシーン（物・風景・食べ物等）では woman/girl 等の人物タグを含めないよう明示指示
    - 人物が必要な場合のみキャラの外見・感情・シーンを含める

---

## v2.320.0 — 2026-05-31

### アゲルちゃん — 出してコマンドをOllama自動プロンプト生成に変更

- `public/app.js`:
  - `_agruSend()`: 画像キーワード検出をフラグ化し、即時SD送信をやめてOllama返答後に処理
  - `_agruGenerateSDImageFromReply(replyText)`: 新関数。Ollamaの返答文をもとに第2のOllama呼び出しで英語SDプロンプトを自動生成し、`_agruGenerateSDImage()` へ渡す
  - SDへの送信はポジティブ・ネガティブ設定（会話モード専用 or SD生成設定）を引き続き適用

---

## v2.319.0 — 2026-05-31

### アゲルちゃん — 会話モード専用SD設定・モザイク対応

- `public/app.js`:
  - `agruSdWidth` / `agruSdHeight` / `agruSdPositiveSuffix` 変数追加、SETTINGS_KEYS に登録
  - `_agruGenerateSDImage()`: 幅・高さ・ポジティブサフィックスを会話モード専用設定から取得（未設定時はSD生成設定の値にフォールバック）
  - `_agruAddImageBubble(dataUrl, prompt, translatedPrompt)`: `img.onload` 内でモザイクキーワード判定 → マッチ時は `_applyMosaic()` を適用
  - `agruText` WS ハンドラに新設定3件を追加
- `public/admin.html`:
  - アゲルちゃんセクションに「会話モード SD生成設定」パネル追加（幅・高さ・ポジティブ常時付加）
  - `applyState()` に3設定のロード処理を追加

---

## v2.318.0 — 2026-05-31

### アゲルちゃん — VoiceVoxスピーカー一覧取得

- `server.js`:
  - `/api/voicevox-speakers` エンドポイント追加。VoiceVox の `/speakers` API から取得し `{id, label}` のフラットリストで返す
- `public/admin.html`:
  - スピーカーID入力欄をドロップダウンに変更
  - 「一覧取得」ボタンで VoiceVox から名前付きリストを取得・選択
  - 選択済みIDは復元される（`_agruVvSavedSpeaker`）

---

## v2.317.0 — 2026-05-31

### アゲルちゃん — VoiceVox 読み上げ対応

- `server.js`:
  - `/api/voicevox` エンドポイント追加。VoiceVox（port 50021）の audio_query → synthesis を2段階で呼び出し、WAV を base64 で返す
- `public/app.js`:
  - `agruVoicevoxEnabled` / `agruVoicevoxSpeaker` / `agruVoicevoxSpeed` 変数追加、SETTINGS_KEYS に登録
  - `_agruPlayVoicevox(text)`: VoiceVox API を呼び出して再生（前の音声があれば停止）
  - `_agruSend()`: Ollama 返答後に `_agruPlayVoicevox(replyText)` を呼び出し
  - `agruText` WS ハンドラに新設定3件を追加
- `public/admin.html`:
  - アゲルちゃんセクションに VoiceVox 設定パネル追加（有効チェックボックス、スピーカーID、速度）
  - `applyState()` に VoiceVox 設定のロード処理を追加

---

## v2.316.0 — 2026-05-31

### アゲルちゃん — モーダル高さ固定・レイアウト崩れ修正

- `public/style.css`:
  - `.agru-modal-body`: `overflow: hidden; min-height: 0` を追加（flex子要素がコンテンツ量で高さを押し広げる問題を修正）
  - `.agru-char-area`: `overflow: hidden` を追加（キャラ画像がエリア外に出ない）
  - `.agru-chat-area`: `min-width: 0` を追加（flex縮小が正しく機能）
  - `.agru-chat-log`: `min-height: 0` を追加（スクロール領域が正しく機能）

---

## v2.315.0 — 2026-05-31

### アゲルちゃん — チャット自動スクロール修正

- `public/style.css`:
  - `.agru-chat-log`: `scroll-behavior: smooth` → `auto`（typewriter中の頻繁なscrollTop更新との干渉を解消）
- `public/app.js`:
  - `_agruAddImageBubble()`: `img.onload` でも `scrollTop = scrollHeight`（画像ロード前のスクロールがズレる問題を修正）

---

## v2.314.0 — 2026-05-31

### アゲルちゃん — 会話モード中のSD画像生成・チャット表示

- `public/app.js`:
  - 出して/生成コマンド: `agruActive` 中はステージへの通常表示をブロック（`_agruSend` 側で処理）
  - `_agruSend()`: 画像生成キーワード（出ろ/出して/生成/gen/自撮り/写真）を検出したら `_agruGenerateSDImage()` を並行起動
  - `_agruGenerateSDImage(prompt)`: SD生成API呼び出し → 完了後 `_agruAddImageBubble()` でチャットに表示
  - `_agruAddImageBubble(dataUrl)`: アゲルちゃん側（左）に写真バブルをチャットログに追加
  - 会話モード限定: 「自撮り」「写真」もSD生成キーワードとして扱う
- `public/style.css`:
  - `.agru-photo-img`: チャット内写真バブル用スタイル追加

---

## v2.313.0 — 2026-05-31

### アゲルちゃん — 会話モード中のコマンド禁止

- `public/app.js`:
  - `ランダムタイマン` コマンド: `agruActive` 中は無視
  - `タイマン：xxx` コマンド: `agruActive` 中は無視
  - `ステータス確認` コマンド: `agruActive` 中は無視
  - 30分自動バトルロイヤル: `agruActive` 中は発動しない

---

## v2.312.0 — 2026-05-31

### アゲルちゃん — モーダル縦幅600px固定

- `public/style.css`:
  - `.agru-modal`: `height: 600px; max-height: 96vh` を追加
  - `.agru-modal-body`: `min-height`/`max-height` を削除し `flex: 1` で残り高さを埋める

---

## v2.311.0 — 2026-05-31

### アゲルちゃん — チャットエリア幅600px固定

- `public/style.css`:
  - `.agru-chat-area`: `flex: 1` → `flex: 0 0 600px`（600px固定）
  - `.agru-modal`: 幅 900px → 980px（キャラ380px + チャット600px）

---

## v2.310.0 — 2026-05-31

### アゲルちゃん — モーダルキャラ画像を1.5倍サイズに・レイアウト修正

- `public/style.css`:
  - `.agru-char-img`: `max-height` 300px → 450px、`max-width` を `100%` に変更（コンテナ幅でクリップ、はみ出し防止）
  - `.agru-char-area`: 幅 260px → 380px（1.5x画像に合わせて拡張）

---

## v2.309.0 — 2026-05-31

### アゲルちゃん — 感情マッピング複数画像対応・UIサイズ2x

- `public/app.js`:
  - `_agruGetImage(emotion)`: 配列値に対応。複数画像がマッピングされている場合はランダム選択。文字列（旧形式）後方互換あり
- `public/admin.html`:
  - `agruEmotionMap` のデータ形式を `{ emotion: ["file1", "file2"] }` の配列形式に変更
  - `_agruSelectInStrip(strip, files)`: 文字列（単一）・配列（複数）両方に対応
  - `_agruEmotionClick()`: クリックでトグル（複数選択）、`✕` ボタンで全解除
  - `_buildImgStrip()`: 画像高さ 32px → 64px、`×` ボタン高さも 64px に統一
  - `saveAgruEmotionMap()`: 選択された全画像を配列として保存
  - `initAgruEmotionMapUI()`: 旧文字列形式の保存データを配列に変換して読み込み

---

## v2.308.0 — 2026-05-31

### アゲルちゃん — 感情通知をWebSocket経由に変更（OBS対応）

- `public/app.js`:
  - `_adminWs` をモジュールレベル変数として公開（IIFE内の `ws` → `_adminWs` に変更）
  - `_agruLog()` / `_agruNotifyEmotion()`: BroadcastChannel のみから WebSocket優先に変更（WS接続時はWS送信、未接続時はBC）
  - OBS ブラウザソース環境で admin.html のデバッグログ・感情パネルが更新されなかった問題を修正（BC は同一ブラウザプロセス内のみ有効なため）

---

## v2.307.0 — 2026-05-31

### アゲルちゃん — 会話履歴20往復保持

- `public/app.js`:
  - `_agruConvHistory` 配列を追加
  - `_agruSend()`: 送信メッセージに `_agruConvHistory` を前置して Ollama へ送信、返答後に user/assistant の2件を履歴に追加。40件超えで古い2件を削除（最大20往復）
  - `openAgruModal()`: 起動時に `_agruConvHistory = []` でリセット
  - ログに現在の履歴往復数を表示（`送信: xxx (履歴N往復)`）

---

## v2.306.0 — 2026-05-31

### アゲルちゃん — デバッグ機能・感情リアルタイム表示

- `public/app.js`:
  - `_agruParseResponse(raw)` 関数を追加: `[感情]` 行のパース処理を `_agruSend` から切り出して共有化
  - `_agruNotifyEmotion(emotion, replyText)` 関数を追加: 感情・画像・返答テキストを `agruEmotion` メッセージとして admin へプッシュ
  - `_agruDebug(message)` 関数を追加: モーダルの状態に依存せず Ollama に直接問い合わせてデバッグログ出力
  - WebSocketハンドラに `agruDebugSend` タイプを追加 → `_agruDebug()` を呼び出し

- `public/admin.html`:
  - アゲルちゃんセクションにデバッグパネルを追加:
    - テストコメント入力欄（`#agruDebugInput`）＋送信ボタン（Enter キーでも送信）
    - 現在の感情パネル: `#agruDbgEmotionName`（感情名大表示）・`#agruDbgEmotionImg`（画像サムネイル）・`#agruDbgReplyText`（返答テキスト先頭60文字）
  - `sendAgruDebug()` 関数追加
  - `handleReply()` に `agruEmotion` タイプを追加 → 感情パネルをリアルタイム更新

---

## v2.305.0 — 2026-05-31

### アゲルちゃん — ログを管理パネルのdbgLogに表示

- `public/app.js`:
  - `_agruLog(msg, type)` 関数を追加: `console.log` + `_adminBC.postMessage({type:'agruLog',...})` を同時実行
  - `_agruSend()` 内の `console.log/error` 呼び出しをすべて `_agruLog()` に置き換え
  - ログ種別: 送信・raw・エラーは `''`/`'err'`、emotion/reply確定時は `'ok'`

- `public/admin.html`:
  - `channel.onmessage = (e) => handleReply(e.data)` を追加（BroadcastChannel受信対応）
  - `handleReply()` に `agruLog` タイプを追加 → `dbgLog('[アゲルちゃん] ' + msg, logType)` を呼び出し

---

## v2.304.0 — 2026-05-31

### アゲルちゃん — 感情マップを画像ピッカーUIに変更

- `public/admin.html`:
  - `<style>` に `.agru-img-strip` / `.agru-img-opt` / `.agru-img-none` / `.agru-selected` クラスを追加
  - 感情マップのドロップダウンを廃止 → 全画像をサムネイル表示したインライン画像ピッカーに変更
  - デフォルト画像セレクタも同様の画像ピッカーUIに変更（`#agruDefaultImgStrip`）
  - `_buildImgStrip()`: ✕（なし）＋全画像サムネイルのストリップを生成するヘルパー追加
  - `_agruSelectInStrip()`: ストリップ内選択状態を更新するヘルパー追加
  - `_agruDefaultClick()` / `_agruEmotionClick()`: クリックハンドラ追加
  - 画像ホバーで大プレビューパネルを更新
  - `saveAgruEmotionMap()`: `.agru-selected` 要素から選択値を収集するよう変更
  - settings読み込み: `_agruSelectInStrip()` で選択状態を反映するよう変更

---

## v2.303.0 — 2026-05-31

### アゲルちゃん — 感情マップUIプレビュー・デフォルト画像設定

- `public/admin.html`:
  - 感情マップに画像プレビュー機能を追加
    - 各行にサムネイル（28px）を表示・ドロップダウン変更時に自動更新
    - 共有プレビューパネル（`#agruPreviewPanel`）を追加 — 選択/フォーカス時に大きく表示
    - サムネイルクリックでも共有プレビューに反映
  - デフォルト画像セレクタ（`#agruDefaultImgSelect`）を追加 — サムネイルプレビュー付き
  - `onAgruDefaultChange()` / `onAgruEmotionSelect()` / `_agruShowPreview()` 関数追加
  - settings読み込み時に `agruDefaultImage` を反映する処理を追加

- `public/app.js`:
  - `agruDefaultImage` 変数を追加（localStorage `agruDefaultImage` から初期化）
  - `SETTINGS_KEYS` に `'agruDefaultImage'` を追加
  - `_agruGetImage()`: `_agruDefaultImage` → `agruDefaultImage` 変数を使用するよう変更
  - `openAgruModal()`: デフォルト画像自動検出ロジックを削除、`agruDefaultImage` を直接使用
  - WebSocketハンドラ `agruText`: `agruDefaultImage` キーを処理するよう追加

---

## v2.302.0 — 2026-05-31

### アゲルちゃん会話モード — チャットUI & ログ追加

- `public/index.html`:
  - `agru-text-area` → `agru-chat-area` / `#agruChatLog` に変更（LINEチャット形式）

- `public/style.css`:
  - `.agru-text-area` / `.agru-text` / `.agru-cursor-hidden` を削除
  - `.agru-chat-area` / `.agru-chat-log` / `.agru-bubble-row` / `.agru-bubble` / `.agru-bubble-right` / `.agru-bubble-left` / `.agru-bubble-name`: LINEライクなチャットバブルスタイル追加

- `public/app.js`:
  - `_agruTypewrite()` を削除
  - `_agruAddBubble(side, name, text, onDone)` を追加: 右（コメント）・左（返答）バブルを動的生成し、左バブルはタイプライター表示
  - `_agruSend()`: コメント受信時に右バブル追加→Ollama返答時に左バブル（タイプライター）追加
  - `_agruSend()`: `console.log('[アゲルちゃん] Ollama raw:', raw)` / `console.log('[アゲルちゃん] emotion:', ...)` を追加
  - `openAgruModal()`: チャットログを `innerHTML = ''` でクリアするよう変更

---

## v2.301.0 — 2026-05-31

### アゲルちゃん会話モード実装

- `server.js`:
  - `GET /api/ageru-images`: `public/ageru/` ディレクトリの画像一覧を返すエンドポイントを追加

- `public/index.html`:
  - `#agruModal`: アゲルちゃん会話モーダルHTML追加（キャラ画像エリア・テキスト表示エリア・感情ラベル・ステータス表示）

- `public/style.css`:
  - `.agru-overlay` / `.agru-modal` / `.agru-modal-header` / `.agru-modal-body`: モーダル全体のレイアウトスタイル追加
  - `.agru-char-area` / `.agru-char-img` / `.agru-emotion-label` / `.agru-status`: キャラクター表示エリアのスタイル追加
  - `.agru-text-area` / `.agru-text` / `.agru-cursor`: ノベルゲーム風テキスト表示・タイプライターカーソルのスタイル追加
  - `@keyframes agru-blink`: カーソル点滅アニメーション追加

- `public/app.js`:
  - `AGRU_EMOTIONS`: 全感情リスト定数追加（54種類）
  - `AGRU_DEFAULT_SYSTEM`: デフォルトsystem prompt（`[感情]\n[返答]`形式を指示）追加
  - `agruSystem` / `agruEmotionMap` / `agruActive` / `agruIdle`: 状態変数追加
  - `openAgruModal()`: モーダル表示・起動時挨拶送信・デフォルト画像自動決定
  - `closeAgruModal()`: モーダル非表示・タイマークリア
  - `_agruSend()`: Ollama API呼び出し・`[感情]\n[返答]`パース・感情画像切替・タイプライター表示・10秒後アイドル復帰
  - `_agruTypewrite()`: 45ms間隔タイプライター表示（カーソル制御付き）
  - `_agruSetImage()` / `_agruSetStatus()`: 感情画像・ステータス更新ヘルパー
  - `handleComment()`: アゲルちゃんアクティブ＆アイドル時にコメントを`_agruSend()`へ転送
  - WebSocketハンドラに `openAgeruChat` / `agruText` / `agruEmotionMap` メッセージ処理を追加
  - `SETTINGS_KEYS` に `'agruSystem'`・`'agruEmotionMap'` を追加

- `public/admin.html`:
  - 💬 アゲルちゃん会話モードセクション追加
    - 「会話モードを開く」ボタン（`openAgeruChat`メッセージ送信）
    - `#agruSystemInput`: system promptテキストエリア
    - `#agruEmotionMapGrid`: 感情→画像マッピングUI（全54感情×ドロップダウン）
    - 「感情マップを保存」ボタン
  - `sendAgruText()` / `saveAgruEmotionMap()` / `initAgruEmotionMapUI()`: 管理パネルJS関数追加
  - settings読み込み時に `agruSystem` / `agruEmotionMap` を反映する処理を追加

---

## v2.300.0 — 2026-05-31

### ボス撃破・消去時の位置保存 / ボスサイズスライダー修正

- `public/app.js`:
  - `defeatBoss()`: 関数先頭でボス位置を `panelKey('bossX'/'bossY')` に保存するよう追加（倒された時も次回スポーン位置が保持される）
  - `dismissBossBtn` ハンドラ: 消去前にボス位置を `panelKey('bossX'/'bossY')` に保存するよう追加
  - `bossSizeSlider` ハンドラ: `bossState.origSize * bossSizeScale`（二重乗算バグ）を `200 * bossSizeScale` に修正。`bossState.origSize` を更新。コンテンツモード中は `contentModeBossSizePct` を適用した表示サイズを使用。`contentModeBossSaved.px` も更新
  - `contentModeBossSizePctSlider` ハンドラ: コンテンツモード中・ボス出現中にスライダーを動かした際、即座にボスサイズに反映するよう追加
  - `toggleContentMode()` OFF時: `bossSizeScale = contentModeBossSaved.sizeScale`（スライダー変更を上書きするバグ）を削除。復元サイズを `Math.round(200 * bossSizeScale)` で計算し `bossState.origSize` を更新

---

## v2.299.0 — 2026-05-31

### コンテンツモード専用のボス位置保存

- `public/app.js`:
  - `STATE_SAVE_KEYS`: `'bossX_cm'`・`'bossY_cm'` を追加
  - ボスドラッグ保存: `localStorage.setItem('bossX', ...)` → `panelKey('bossX')` に変更し、コンテンツモード中は `bossX_cm`/`bossY_cm` に保存
  - `spawnBoss()`: 生成位置を `panelKey('bossX')` から読み、コンテンツモード中は `bossX_cm`/`bossY_cm` を参照
  - `gatherContentMode()`: ボス処理を `bossX_cm` 保存済みならその位置へ復元、未保存なら画面下部へ集合するよう変更
  - `toggleContentMode()` OFF時: ボス位置を `bossX_cm` に保存してから通常位置へ復元

---

## v2.298.0 — 2026-05-31

### コンテンツモード: ボス・キャラ出現時の下集合

- `public/app.js`:
  - `spawnBoss()`: コンテンツモード中はサイズ縮小後 350ms 待って `gatherContentMode()` を呼び出し、ボスを画面下部に移動
  - `ensureCharOnStage()`: コンテンツモード中はキャラ生成後 400ms 待って `gatherContentMode()` を呼び出し、全キャラ（新規含む）をコンテンツモード専用下集合で配置
    - `createCharacter()` 内の `gatherCharactersBottom` (500ms) とは別に、より早い 400ms で実行

---

## v2.297.0 — 2026-05-31

### コンテンツモード: キャラ生成時の下集合 ＋ スロット・ガチャの縮小

- `public/app.js`:
  - `gatherContentMode()` 関数を新設（コンテンツモード専用の下集合ロジックをまとめた独立関数）
  - `gatherCharactersBottom()`: `contentMode` が ON の場合 `gatherContentMode()` にリダイレクト
    - コンテンツモード中の全 `gatherCharactersBottom` 呼び出し（キャラ生成後の500ms遅延含む）が自動的に正しい余白・位置で集合するようになった
  - `toggleContentMode()`: `setTimeout(350ms)` 内の重複コードを `gatherContentMode()` 呼び出しに置き換え
- `public/style.css`:
  - `#stage.content-mode .slot-panel`: `transform: translateX(-50%) scale(0.5); transform-origin: bottom center` を追加（50%縮小）
  - `#stage.content-mode .pet-gacha-panel`: 同様に 50% 縮小

---

## v2.296.0 — 2026-05-31

### 管理パネル設定の保存修正 ＋ コンテンツモードでのキャラ生成サイズ修正

- `public/app.js`:
  - `getState` ハンドラ: `gatherMarginLeft/Right/Bottom`, `gatherRowMax`, `contentModeGatherMarginBottom/Left/Right`, `contentModeCharSizePct`, `contentModeBossSizePct` のステートキーを `Slider` サフィックス付きに修正
    - admin.html の `applyState` が slider ID (`*Slider`) をキーとして参照するため、サフィックスなしでは undefined になり設定が復元されなかった
  - `ensureCharOnStage()`: コンテンツモードのサイズ適用を `createCharacter()` 呼び出し**前**に移動
    - 以前はキャラがフルサイズで生成されてから縮小アニメーションしていた問題を修正
    - `createCharacter` 内の `applyAvatarStyle` / `renderPetBadge` が最初からコンテンツモードサイズで実行されるようになった

---

## v2.295.0 — 2026-05-31

### 管理パネル余白スライダー 1px単位 ＋ コンテンツモードでボスも下寄せ

- `public/admin.html`:
  - `contentModeGatherMarginBottomSlider`: `step="5"` → `step="1"`
  - `contentModeGatherMarginLeftSlider`: `step="10"` → `step="1"`
  - `contentModeGatherMarginRightSlider`: `step="10"` → `step="1"`
- `public/app.js`:
  - `toggleContentMode()` ON時: キャラ下集合の `setTimeout(350)` 内でボスも `stageH - bossEl.offsetHeight - contentModeGatherMarginBottom` に移動（600ms アニメーション付き）
  - `toggleContentMode()` OFF時: ボス復元に `transition: left/top 600ms` を追加してスムーズに元の位置へ戻るよう修正

---

## v2.294.0 — 2026-05-31

### コンテンツモード: キャラ名非表示・下集合の底辺アライメント修正

- `public/style.css`: `#stage.content-mode .char-name { display: none !important; }` を追加
- `public/app.js`: `toggleContentMode()` ON時の下集合を `setTimeout(350ms)` で遅延実行するよう変更
  - `.avatar` に `transition: width 0.3s, height 0.3s` があり `requestAnimationFrame` では縮小途中の高さを読んでしまう問題を修正
  - トランジション完了後 (300ms) に `offsetHeight` を計測することでキャラが正確に画面下部に寄るよう修正

---

## v2.293.0 — 2026-05-31

### コンテンツモード中のペットサイズをキャラに連動

- `public/app.js`:
  - `toggleContentMode()` ON時: `applyAvatarStyle(u)` 後に `renderPetBadge(u)` を呼び出し、ペットをキャラと同倍率で縮小
  - `toggleContentMode()` OFF時: `applyAvatarStyle(u)` 後に `renderPetBadge(u)` を呼び出し、ペットを元のサイズに復元
  - `ensureCharOnStage()`: コンテンツモード中に出現したキャラへの `applyAvatarStyle` 後に `renderPetBadge(user)` を呼び出し
  - 下集合時にペットサイズが確定してから `offsetHeight` で底辺位置を計算するため、ボトムアライメントが正確になる

---

## v2.292.0 — 2026-05-31

### コンテンツモード専用のキャラ・ボスサイズを設定可能に

- `public/app.js`:
  - `contentModeCharSizePct`（デフォルト70%）・`contentModeBossSizePct`（デフォルト10%）変数を追加
  - `toggleContentMode()` のサイズ指定を変数参照に変更
  - `ensureCharOnStage()`: コンテンツモード中に出現したキャラに即座にコンテンツモードサイズを適用し `contentModeSaved` に登録
  - `spawnBoss()`: コンテンツモード中に出現したボスに即座にコンテンツモードサイズを適用し `contentModeBossSaved` に登録
- `public/admin.html`: 「📺 コンテンツ キャラ大きさ」「📺 コンテンツ ボス大きさ」スライダーを追加（1〜100%）

---

## v2.291.0 — 2026-05-31

### コンテンツモード専用の下集合 左余白・右余白を追加

- `public/app.js`: `contentModeGatherMarginLeft` / `contentModeGatherMarginRight` 変数を追加（デフォルト0px）
  - 下集合の横幅計算に左右余白を反映
  - スライダーハンドラ・`getState`・`STATE_SAVE_KEYS` に追加
- `public/admin.html`: 「📺 コンテンツ 左余白」「📺 コンテンツ 右余白」スライダーを追加（0〜1200px、step 10px）

---

## v2.290.0 — 2026-05-31

### コンテンツモード大幅改修

- `public/app.js`:
  - ボスサイズを60% → **10%** に変更
  - キャラの「左下集合（x=0固定）」を廃止し、横均等配置の**下集合**に変更
  - コンテンツモード用の下余白 `contentModeGatherMarginBottom`（デフォルト10px）を追加
  - `stage` 要素に `content-mode` クラスを付与/除去するよう変更
  - `_swapPanelPositions()` を追加。コンテンツモード切替時にランキング・文字当て・クイズパネルの位置を独立したキー (`_cm` サフィックス) で保存・復元
  - パネルドラッグの保存先をコンテンツモード中は `_cm` キーに切り替え (`panelKey()` ヘルパー追加)
- `public/admin.html`: 「📺 コンテンツ 下余白」スライダーを追加
- `public/style.css`:
  - `#stage.content-mode` 時にキャラのステータス・装備・レベルバッジを非表示
  - `#stage.content-mode #quizPanel` の幅を400pxに拡大

---

## v2.289.0 — 2026-05-31

### 文字当てパネルの＋－ボタン削除・幅200px固定

- `public/app.js`: `wordle-sz-btn` の生成・ハンドラ・`cellSize` 管理を全て削除
- `public/style.css`: `#wordlePanel` を `min-width: 192px` → `width: 200px` に変更、`.wordle-sz-btn` スタイル削除
- セルサイズをデフォルト32pxに調整（200px幅に5列がぴったり収まるサイズ）

---

## v2.288.0 — 2026-05-31

### ダメージランキング・MPランキングを1パネルに統合（同時表示）

- `public/app.js`: `#mpRankingPanel` を廃止し `#rankingPanel` に両ランキングを縦並びで同時表示
  - 上段: ⚔️ ダメージ（ボス討伐後に更新）、下段: 💎 MP（常時リアルタイム）
  - `showDamageRanking()` / `showMpRanking()` どちらでも同一パネルが開く
  - タブ廃止、`setRankingTab()` 削除
- `public/style.css`: `#mpRankingPanel`・タブ関連スタイルを削除、セクションヘッダースタイルを追加

---

## v2.287.0 — 2026-05-31

### masterキャラを集合・下集合・コンテンツモードの対象に変更

- `public/app.js`: `gatherCharacters` / `gatherCharactersBottom` のmaster除外フィルタを削除
- コンテンツモードのmaster除外も削除
- masterも他のキャラと同様に集合・下集合・コンテンツモードで移動するように

---

## v2.286.0 — 2026-05-31

### masterキャラ識別を `comment.from === 'master'` ベースに変更

- `public/app.js`: `isMasterUser(u)` ヘルパーを追加（`u?.isMaster === true` のみ判定）
- `handleComment` で `comment.from === 'master'` の時に `user.isMaster = true` をセット
- `isMaster` を `CHAR_SAVE_FIELDS` に追加し、ページリロード後も識別を維持
- AFK・自動削除・ノベル起動・5分モードの全master判定を `isMasterUser()` に統一

---

## v2.279.0 — 2026-05-31

### キャラ個別サイズの永続化

- `public/app.js`: `CHAR_SAVE_FIELDS` に `sizeScaleBase` を追加
  - `charIndivSize` ハンドラで `sizeScale` と `sizeScaleBase` を同時にセット
  - ロード時のリセット行を `sizeScaleBase ?? 1.0` に変更
  - タイマン中のリロード対策を維持しつつ、管理者が設定したサイズを復元するように
  - タイマン・コンテンツモードは `sizeScale` のみ変更し `sizeScaleBase` は変更しない

---

## v2.285.0 — 2026-05-31

### クイズ・ダメージランキング・MPランキングパネルを200px固定に変更

- `public/style.css`: `#quizPanel`, `#rankingPanel`, `#mpRankingPanel` を `width: 200px` に統一

---

## v2.284.0 — 2026-05-31

### MPランキングパネルの横幅を統一

- `public/style.css`: `#mpRankingPanel` を `min-width: 200px` から `width: 240px` 固定に変更

---

## v2.283.0 — 2026-05-31

### クイズパネルとダメージランキングパネルの横幅を統一

- `public/style.css`: `#quizPanel` を `min-width/max-width` から `width: 240px` 固定に変更
- `public/style.css`: `#rankingPanel` を `min-width: 200px` から `width: 240px` 固定に変更

---

## v2.282.0 — 2026-05-31

### 自動BRのON/OFF状態を管理パネル・BR次回タイマーに反映

- `public/app.js`: `brAutoBtn` クリック後に `brAutoEnabled` 状態を admin.html へ返信
- `public/app.js`: `getState` に `brAutoEnabled` を追加（パネル接続時に同期）
- `public/app.js`: `renderBRTimerPanel` でOFF時は「自動OFF」を赤文字で表示
- `public/admin.html`: 状態受信時に「🔄 自動BR」ボタンのテキスト・背景色を更新
  - ON: 通常表示、OFF: 「🔄 自動BR（OFF）」＋赤背景

---

## v2.281.0 — 2026-05-31

### バトルロイヤル・タイマン終了時にmasterを元の位置に復元

- `public/app.js`: `startBattleRoyale` で `brState.masterSavedPos` に開始時のmaster座標を保存
- `public/app.js`: `endBattleRoyale` で `snapshot.masterSavedPos` から復元（0.6sトランジション）
- `public/app.js`: `startTaiman` で `taimanState.masterSavedPos` に開始時のmaster座標を保存
- `public/app.js`: `endTaiman` で `snapshot.masterSavedPos` から復元（0.6sトランジション）

---

## v2.280.0 — 2026-05-31

### masterキャラ: コンテンツモードでも移動しないよう修正

- `public/app.js`: `toggleContentMode()` のキャラ移動ループに `u.ipid === 'master'` の除外を追加
  - コンテンツモードON時にmasterが x=0（左端）・画面底に移動してしまうバグを修正
  - masterは `contentModeSaved` に保存されないため、OFF時の復元ループも自動的にスキップ

---

## v2.278.0 — 2026-05-31

### 集合・下集合でmasterキャラを移動しないよう変更

- `public/app.js`: `gatherCharacters` / `gatherCharactersBottom` のフィルタに `u.ipid !== 'master'` を追加

---

## v2.277.0 — 2026-05-31

### 集合コマンドの1行あたり数を管理パネルから設定可能に

- `public/app.js`: `gatherRowMax` 変数を追加（デフォルト10、localStorage永続化）
  - `gatherCharacters()` 内のハードコード `ROW_MAX = 10` を `gatherRowMax` に変更
  - SETTINGS_KEYS・getState に `gatherRowMax` を追加
  - `type:'slider'` ハンドラに `gatherRowMaxSlider` を追加
- `public/admin.html`: サイズ設定セクションに「🔔 集合 1行の数」スライダーを追加（1〜30体、デフォルト10）

---

## v2.276.0 — 2026-05-31

### コンテンツモード: ボスサイズ復元バグ修正

- `public/app.js`: `toggleContentMode` のボスサイズ復元を修正
  - 旧: `origSize * bossSizeScale` で再計算 → スポーン時スケールと現在のスケールが二重適用されてサイズが大きくなるバグ
  - 新: コンテンツモードON時に `ba.style.width`（実際のpx値）を保存し、OFF時はそのpxをそのまま復元
  - ON時の縮小計算も `currentPx * 0.6` に変更（同様に実際の表示pxを基準に60%）

---

## v2.275.0 — 2026-05-31

### コンテンツモード追加

- `public/app.js`: `toggleContentMode()` 関数を追加
  - ON時: 全キャラのsizeScaleを現在の70%に縮小、全キャラをx=0・画面底にピッタリ配置（余白なし）
  - ON時: ボスが表示中の場合、bossSizeScaleを60%に縮小してx=0・画面底左端に移動
  - OFF時: 保存していた各キャラの座標・sizeScale・ボスの座標・bossSizeScaleをすべて復元
  - `contentMode`, `contentModeSaved`, `contentModeBossSaved` 変数を追加
- `public/app.js`: コンテンツモード中はタイマンコマンド（指名・ランダム両方）を無視
- `public/app.js`: コンテンツモード中はステータス確認コマンドを無視
- `public/app.js`: 自動バトルロイヤルのインターバル処理でコンテンツモード中はスキップ
- `public/app.js`: `handleAdminMessage` に `contentMode` タイプを追加
- `public/admin.html`: ゲーム操作セクションに「📺 コンテンツ」ボタンを追加
  - `btn-teal` スタイルクラスを追加（ON中は `.active` で明るいティール＋アウトライン表示）
  - `toggleContentModeAdmin()` 関数を追加（クリックで送信＋ボタン状態トグル）

---

## v2.274.0 — 2026-05-31

### クイズ問題追加（kukulu LIVE編）

- `public/text/quiz.txt`: kukulu LIVEに関するクイズ問題を200問追記（1082行 → 1282行）
  - プラットフォーム基本情報（無料・個人運営・aquapal）
  - KP（Kukupo）仮想通貨システム
  - ゲーム機能：Magical Collect（最大10000倍）、Magical Mahjong、Pluto game
  - 補助サービス：FileNow、MagicalDraw、RemoteCam、Coffret
  - 技術仕様：H.265/HEVC（帯域50%削減）、ブラウザ拡張、スマートフォンアプリ
  - 音楽ライセンス：JASRAC（第9013518001Y45123号）、NexTone（000006415）
  - AI Macaron、継承配信、コラボ配信、ファーストプッシュなどの各種機能
  - 統計情報：エモーション6418個、MagicalDraw部屋数1876、最大72時間連続配信

---

## v2.273.0 — 2026-05-31

### ステータス確認のDiscord連携バグ修正

- `public/app.js`: Discord投稿時のモーダル自動クローズを修正
  - `autoClose 5秒 < ollama 9秒タイムアウト` の競合でモーダルが消えキャプチャが走らないバグを修正
  - `triggerCnum` ありの場合はキャプチャ完了後に `close()` を呼ぶよう変更（自動5秒クローズを廃止）
  - フォールバックとして20秒後に強制close（エラー時にモーダルが残り続けるのを防ぐ）
- `public/app.js`: キャプチャ前に画像ロード完了を待つように修正
  - `captureAndPostDiscord` 内で未ロード画像を `Promise.all` で最大3秒待機
  - これにより「画像が空白になる」「600ms以内に画像が来ない」問題を解消
- `public/app.js`: ollama未設定時のキャプチャタイミングを改善
  - 固定600ms → 「最低600ms + 全画像ロード完了」のどちらか遅い方まで待つよう変更

---

## v2.272.0 — 2026-05-29

### タイマン観戦ベット機能追加

- `public/app.js`: タイマン開始時に30秒間のベット受付フェーズを追加
  - コマンド: `ベット 1 [MP数]`（挑戦者）または `ベット 2 [MP数]`（相手）
  - MP不足時・0以下は拒否。重複ベット時は前ベット返金してから再ベット
  - 的中で賭けMP 2倍返し、外れで没収、キャンセル・引き分けで全額返金
  - HPバーにベット総額を常時表示（受付中は「🎰 受付中 XXX MP」）
- `public/app.js`: `showTaimanBetBanner` 関数を追加（受付中バナー表示）
- `public/style.css`: ベットバナー・ベット総額表示のCSSを追加

---

## v2.271.0 — 2026-05-29

### タイマン応援機能追加

- `public/app.js`: タイマン中に他ユーザーがコメントで戦士の名前を呼ぶと、そのキャラのHPが最大HPの30%回復
  - 2文字未満の名前は対象外
  - 自分で自分の名前を呼んでの回復は無効
  - 回復時にダメージ数字（💪 HP+XX）・吹き出し・ログを表示

---

## v2.270.0 — 2026-05-29

### 自動削除タイムアウトを管理パネルから設定可能に

- `public/admin.html`: AFK設定セクションに「🗑 自動削除」スライダーを追加（5〜120分、5分刻み、デフォルト30分）
- `public/app.js`: `autoDeleteMinutes` 変数を追加（localStorage永続化）
- `public/app.js`: `SETTINGS_KEYS` に `'autoDeleteMinutes'` を追加
- `public/app.js`: 自動削除インターバルの `DELETE_TIMEOUT` を `autoDeleteMinutes * 60 * 1000` に変更
- `public/app.js`: `handleAdminMessage` に `d.type === 'autoDeleteTimeout'` ハンドラを追加
- `public/app.js`: `getState` レスポンスに `state.autoDeleteMinutes` を追加
- `public/admin.html`: 管理パネルリロード時にスライダー値を復元

---

## v2.269.0 — 2026-05-29

### index.html 機能解説・コマンド一覧を最新仕様に更新

- 自動AFK「5分」→「30分」に修正
- 自動AFK・離席表示カードに「30分無コメントで自動ステージ削除（セーブ保持）」「手動AFK/放置/無明は対象外」を追記
- キャラステータスカードのクリティカル率説明をCRTの計算式付きに更新（偵察+5%・鋭爪+20%）
- ステータス確認コマンドの説明にCRT・スロット当選数・宝箱開封数・ペットガチャ回数を追記
- コマンド一覧のAFK/放置/無明欄に「手動AFK中は自動削除対象外」を追記

---

## v2.268.0 — 2026-05-29

### セーブデータ保存をマージ方式に変更（ステージ外キャラのデータ保持）

- `server.js`: `/api/char-save` の POST を上書きからマージに変更
  - 自動セーブ（60秒ごと）でステージ上のキャラのみ送信しても、ステージ外のキャラのセーブが消えない
  - 管理パネルのセーブ一覧でステージにいないキャラのデータも表示される

---

## v2.267.0 — 2026-05-29

### 30分自動削除でセーブデータを残すよう変更

- `public/app.js`: 30分無コメント自動削除はキャラをステージから消すのみ、セーブデータは削除しない（ゴミ箱ドロップと同じ挙動）

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