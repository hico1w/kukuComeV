# kukuCome — Claude 作業ルール

## 必須ルール

### パッチノート更新
コードや機能に変更を加えたときは、**必ず `PATCHNOTES.md` に変更内容を追記すること。**

- バージョン番号は直前のバージョンからインクリメントする（例: v1.2.0 → v1.3.0）
- 日付は変更を行った日付を記載する
- 変更内容は機能単位でセクションに分けて記載する
- ファイル・関数名など具体的な情報を含める

**`PATCHNOTES.md` を更新したら `node scripts/build-patchnotes.js` を実行すること。**
公開サイトの Patchnotes ページは md を直接読まず `cloudflare/pages/patchnotes.json` を読むので、
ビルドを忘れるとサイトだけ古いまま残る。サイトに反映するところまでやるなら `/deploy-pages` を参照。

## 公開サイト（kukucome-chara.pages.dev）

`cloudflare/pages/` が公開サイト、`cloudflare/worker.js` が画像アップロードの受け口。
**Git 連携ではないので push しても反映されない。** デプロイ手順とハマりどころは
`.claude/commands/deploy-pages.md`（`/deploy-pages`）にまとめてある。

## フロントエンドの構成

- メインのフロントロジックは旧 `public/app.js`（約14,900行）を機能単位で **`public/js/app-01〜13-*.js` に分割** したもの。`public/index.html` が番号順に読み込む。
- **どのファイルに何があるか・編集時の制約（読み込み順＝実行順を壊さない／新ファイルは `index.html` に順序通り追加など）は [`public/js/README.md`](public/js/README.md) を参照すること。**
- 全ファイルは同一のグローバルスコープを共有する classic script。関数名・コマンド名は分割前から不変なので、機能名から該当ファイルを特定できる（例: 「スロット」→ `app-12-features-minigames.js`）。

## ルート index.html（コマンドマニュアル）の更新

ルートの `E:\claude\kukuCome\index.html` は、ユーザー向けのコマンドマニュアル兼コマンド生成ページ。アプリ側でコマンドや仕様を変えると取り残されやすいので、**手動で直接編集せず以下のスキルを読み込んで使うこと。**

- **キャラ一覧（`STANDALONE_CHARS`）の更新 → `/sync-chars`**
  `data/charImages.json` を正として `chara/` 補完と `STANDALONE_CHARS` 書き換えを一括実行（定義: `.claude/commands/sync-chars.md`）。
- **コマンド一覧・コマンド生成の選択肢・各機能の仕様（マニュアル全体）の最新化 → `/update-index`**
  コードの実装を正として各セクションを照合し、差分を提示→承認後に反映（定義: `.claude/commands/update-index.md`）。
- 補足: アプリのコマンド／仕様を変更したら、対応する index.html セクションが古くなるので `/update-index` で追従する。

> 例: ボスアゲルのスキル仕様（攻撃力・発動条件など）を変えたら、index.html の「👹 ボスアゲルバトル」セクションも `/update-index` で更新する。
