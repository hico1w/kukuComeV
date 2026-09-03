# index.html 最新化（コマンドマニュアル同期） (update-index)

ルートの `E:\claude\kukuCome\index.html`（ユーザー向けコマンドマニュアル兼コマンド生成ページ）を、**現在のコード実装と一致するよう最新化する**。

## 前提・進め方（厳守）

- **情報源（正）はコードの実装**。下の「情報源マップ」に従い、各セクションの正しい値・仕様を**コードを実際に読んで**手動で確認する（推測・記憶で書かない）。
- **必ず差分提示 → 承認 → 反映の順**。いきなり書き換えない。追加／削除／変更されるコマンド・仕様を一覧で見せ、ユーザーの承認を得てから `index.html` を編集する。
- **キャラ一覧（`STANDALONE_CHARS`）は `/sync-chars` に委譲**。このスキルでは手書きせず、必要なら `/sync-chars` を実行する。
- 行番号は変動するので、コード参照は**シンボル名（定数名・関数名）で特定**する。フロントは `public/js/app-01〜13-*.js` に分割済み（[`public/js/README.md`](../../public/js/README.md) 参照）。
- 「何をしたら何が起きるか」まで含めた**詳細なマニュアル**に保つ。仕様変更（ダメージ式・発動条件・クールダウン等）も反映する。

## 情報源マップ（index.html セクション → コードの正）

| index.html セクション（id） | 正（情報源） |
|---|---|
| 🔧 コマンド生成（`sec-cmdgen`）のチップ | 下記の各マップと外見設定パーサ（`app-06` の `色:` `吹き出し:` `移動:` `大きさ:` `フォント:` `上下左右:N` `装飾:` `ランダムキャラ` 解析ブロック） |
| 💬 吹き出しの形（`sec-bubble`） | `SHAPE_MAP`（`app-01-core-characters.js`） |
| ✨ 吹き出し装飾（`sec-deco`） | `DECO_MAP`（`app-01`） |
| 🎨 文字色／背景色（`sec-color`） | `COLOR_NAMES`（`app-01`） |
| 🔤 フォント一覧（`sec-font`） | `FONT_MAP`（`app-01`） |
| （移動・大きさ・文字サイズ） | `MOVE_INTERVAL` / `SIZE_MAP` / `TEXT_SIZE_MAP`（`app-01`） |
| ⭐ 称号一覧（`sec-titles`） | `checkTitles` / `getTitleBonuses` とその称号定義（`app-13-race-admin-misc.js`） |
| 🐾 ペットガチャ・ペット能力（全30種）（`sec-pet`） | `PET_ABILITIES`（`app-03-boss-pets.js`） |
| ⚔️ 装備レアリティ（`sec-equip`） | `RARITY` と `rollEquipValue`（`app-03`） |
| 🐉 ボスバトルコマンド（`sec-boss`） | `handleComment`（`app-06`）のボス系コマンド＋ボス処理（`app-05-taiman-boss.js`：召喚/攻撃/討伐） |
| 👹 ボスアゲルバトル・アゲルちゃんスキル一覧（`sec-ageru-boss`） | `AGRU_BATTLE_SKILLS` と `_agruBattleDoCounter`（`app-10-agru-battle-skills.js`）＋ `data/bossAgruConfig.json` の `skills`。**ダメージ式（基礎攻撃×`atkMult`）・発動確率（HPティア別の重み）・各スキルの効果**を反映 |
| 🎮 ゲーム機能（`sec-game`） | スロット/Wordle/クイズ/早押し/コンボ/宝箱（`app-12` `app-13`）、競馬（`app-13`） |
| 📖 機能解説（`sec-features`）のキーワード一覧 | `sdKeywordPrompts`（`data/settings.json` の `sdKeywordPrompts` フィールドをJSONパース）。**動的設定なのでコードではなく実データが正**。以下のコマンドでキーワード名一覧を取得してindex.htmlの汎用キーワードchip（`data-group="kwp"` またはキーワード別ポジティブのvariantリスト）と比較する：<br>`node -e "const fs=require('fs');const kw=JSON.parse(JSON.parse(fs.readFileSync('data/settings.json','utf8')).sdKeywordPrompts\|\|'[]');kw.forEach(k=>console.log(k.keyword));"` |
| 📖 機能解説（`sec-features`）その他 | AI画像生成（出して）/AFK・放置自動削除/AI返答(ai:)/タイマン 等、各実装 |
| 📋 コマンド一覧（`sec-cmdref`） | `handleComment`（`app-06`）の全コマンド分岐＋各機能トリガー文字列 |
| ⚙️ その他の設定（`sec-settings`） | フォント/反転 等の永続設定コマンド（`handleComment`） |
| 🐱 キャラ設定 / `STANDALONE_CHARS`（`sec-char`） | **`/sync-chars` に委譲**（`data/charImages.json`） |

## 手順

### 1. 現在の「正」をコードから収集
情報源マップの各シンボルを読み、**コマンド文字列・選択肢・効果・数値（ダメージ/確率/クールダウン/上限等）**を抽出する。特に `handleComment`（`app-06`）はユーザーコマンドの中核なので、`message.includes(...)` / `=== '...'` / `match(...)` の分岐を網羅的に拾う。

### 2. index.html の現状と照合
`index.html` の各セクションの記述と、手順1で集めた実装を突き合わせ、**ズレ**を洗い出す：
- 追加すべきコマンド／選択肢（コードにあるが index.html に無い）
- 削除すべき記述（index.html にあるがコードに無い・廃止済み）
- 変更すべき仕様（ダメージ式・発動条件・数値・説明文の食い違い）

**汎用キーワード（`sdKeywordPrompts`）の照合方法**：
1. Node.jsで現在のキーワード一覧を取得（情報源マップのコマンド参照）
2. `index.html` 内の `sec-features` AI画像生成欄の「汎用」キーワードchip群と突き合わせ
3. settings.jsonにあってindex.htmlにないキーワードを「追加候補」、逆を「削除候補」として提示
4. この一覧は動的に増減するため、毎回 `/update-index` 実行時に照合すること

### 3. 差分を提示して承認を得る
洗い出した差分を**セクション別に一覧化**して提示する（例：「`sec-ageru-boss`：即死撃の『HP25%以下で発動』を削除／攻撃力倍率の説明を追加」）。ユーザーが承認した項目のみ反映する。

### 4. 承認後に反映
承認された差分について、`index.html` の**該当セクションのみ**を編集する。コマンド生成チップや色・形などのリストは、対応するマップ（`SHAPE_MAP` 等）と**完全一致**させる。

### 5. キャラ一覧
キャラ（`STANDALONE_CHARS`）の更新が必要なら **`/sync-chars` を実行**する（このスキルでは手書きしない）。

### 6. 仕上げ
- `PATCHNOTES.md` に変更を追記（CLAUDE.md の必須ルール）。
- 反映したセクションと主な追加／削除／変更点を報告する。

### 7. GitHub Pages への反映
`index.html` と `chara/` の変更は **GitHub Actions 経由で自動デプロイ**される（`.github/workflows/pages.yml`）。

push したあと以下で確認できる：

```powershell
& "C:\Program Files\GitHub CLI\gh.exe" run list --repo hico1w/kukuComeV --workflow=pages.yml --limit 1
```

- ワークフローが起動しない場合（`paths` フィルターに該当ファイルがなかったとき）は手動トリガー：
  ```powershell
  & "C:\Program Files\GitHub CLI\gh.exe" workflow run pages.yml --repo hico1w/kukuComeV
  ```
- 公開 URL：**https://hico1w.github.io/kukuComeV/**

## 注意
- index.html は app.js を読み込まない静的ページ。記述は**実装の写し**であり、ここを直してもアプリ挙動は変わらない（逆に、アプリ側のコマンド追加時にこのページが取り残されやすい→このスキルで追従する）。
- 色（200色）など大量項目は、`COLOR_NAMES` のキー集合と index.html の集合を集合比較し、差分だけ提示する。
