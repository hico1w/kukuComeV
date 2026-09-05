---
description: kukucome-chara.pages.dev（公開サイト）と Worker のデプロイ手順
---

# 公開サイトのデプロイ（kukucome-chara.pages.dev）

対象は2つ。**別々のデプロイが必要**で、片方だけ上げると表示と実挙動がズレる。

| 何 | 実体 | デプロイ |
|---|---|---|
| サイト | `cloudflare/pages/`（`index.html` / `puru.html` / `upload-admin.html` / `img/` / `img-saito/` / `patchnotes.json`） | `npx wrangler pages deploy pages --project-name=kukucome-chara --branch=main` |
| API | `cloudflare/worker.js`（画像アップロードの受け口） | `npx wrangler deploy` |

どちらも `cloudflare/` ディレクトリで実行する。

## 手順

1. **PATCHNOTES.md を触ったなら先に JSON を作り直す**
   ```
   node scripts/build-patchnotes.js
   ```
   サイトの Patchnotes ページは `PATCHNOTES.md` を直接読まず `cloudflare/pages/patchnotes.json` を読む。
   ビルドを忘れるとサイトだけ古いまま公開される。
   `public/saitoImg` に画像を足し引きしたときは `node scripts/build-saito-img.js` も。

2. **改行コードを LF に揃える**
   このリポジトリは `core.autocrlf=true` なので、**checkout や merge のたびに作業ツリーが CRLF に戻る。**
   公開中のファイルは LF なので、そのままデプロイすると中身が同じでも全行差分になる（実際に 3576 行の差分が出たことがある）。
   ```
   python -c "import os
   for r,_,fs in os.walk('cloudflare/pages'):
       for f in fs:
           if f.endswith(('.html','.json')):
               p=os.path.join(r,f); b=open(p,'rb').read()
               if b'\r\n' in b: open(p,'wb').write(b.replace(b'\r\n',b'\n'))"
   ```
   Python でファイルを書き戻すときも `io.open(p,'w',newline='\n')` かバイナリで扱うこと。既定だと CRLF になる。

3. **公開中との差分を確認してから上げる**
   `pages deploy` は**ディレクトリ丸ごと上書き**なので、意図しないファイルが一緒に公開されやすい。
   ```
   curl -sL https://kukucome-chara.pages.dev/      > /tmp/live-index.html
   diff /tmp/live-index.html cloudflare/pages/index.html
   ```
   前回デプロイの単体 URL は `npx wrangler pages deployment list --project-name=kukucome-chara` で取れる。

4. **デプロイする**

5. **公開 URL で実際に取得して確認する**（ローカルの確認だけで終わらせない）

## ハマりどころ

- **Git 連携なし。** このプロジェクトは Git Provider が `No` の直接アップロード方式。**git push しても公開サイトには反映されない。**
- **`--branch=main` を明示する。** `wrangler pages deploy` はカレントの git ブランチ名を拾うため、作業ブランチ上で実行すると Production ではなく **Preview 環境**に入る。デプロイ後は `pages deployment list` の `Environment` 列が `Production` になっているか確認する。
- **`/xxx.html` は 308 で `/xxx` にリダイレクトされる。** curl で確認するときは `-L` を付けないと 0 バイトが返る。
- **未知パスは 404 にならず `index.html` が返る。** ファイルを消しても直リンクはギャラリーが表示される（`/patchnotes` の直リンクが動くのもこの仕組み）。
- **Worker の `/upload` はページの `/upload` とは別物。** `index.html` と `puru.html` が `fetch(WORKER_URL + '/upload')` で叩いている API なので消さない。
- アップロードの対応形式・サイズ上限は **`index.html` のモーダル / `puru.html` / `worker.js` の3か所**にある。1か所だけ直すと表示と実挙動がズレる。
