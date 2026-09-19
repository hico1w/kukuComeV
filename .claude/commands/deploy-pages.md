---
description: kukucome-chara.pages.dev（公開サイト）と Worker のデプロイ手順
---

# 公開サイトのデプロイ（kukucome-chara.pages.dev）

対象は2つ。**別々のデプロイが必要**で、片方だけ上げると表示と実挙動がズレる。

| 何 | 実体 | デプロイ |
|---|---|---|
| サイト | `cloudflare/pages/`（`index.html` / `puru.html` / `upload-admin.html` / `img/` / `img-saito/` / `patchnotes.json` / `dino.html` / `games/`） | `npx wrangler pages deploy pages --project-name=kukucome-chara --branch=main` |
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
- **Production になっても本番 URL が前の版を返し続けることがある。**（2026-09-13 に発生。デプロイ後15分以上、`?cb=` を付けても旧 ETag のまま。同じ中身で再デプロイしても変わらなかった）
  切り分けは「①デプロイ単体 URL（`https://<id>.kukucome-chara.pages.dev/…`）に新しい中身があるか ②API `GET /accounts/<acc>/pages/projects/kukucome-chara` の `canonical_deployment.id` が新しい版か ③本番 URL の `ETag` がどのデプロイ単体 URL と一致するか」。①②が新しいのに③が旧版なら、アップロード漏れではなく Cloudflare 側の配信の遅れ。ダッシュボードで対象デプロイを「Rollback to this deployment」するか、時間を置いて再確認する。
- **`/xxx.html` は 308 で `/xxx` にリダイレクトされる。** curl で確認するときは `-L` を付けないと 0 バイトが返る。
- **未知パスは 404 にならず `index.html` が返る。** ファイルを消しても直リンクはギャラリーが表示される（`/patchnotes` の直リンクが動くのもこの仕組み）。
- **Worker の `/upload` はページの `/upload` とは別物。** `index.html` と `puru.html` が `fetch(WORKER_URL + '/upload')` で叩いている API なので消さない。
- **ゲームを追加するときは3か所そろえる。** ゲーム本体は `cloudflare/pages/games/<id>.html`、画像は `cloudflare/pages/games/img-<id>/`、
  一覧に出すには **`index.html` の `GAMES` 配列に1行足す**（`{ id, title, sub, url, thumb, tag }`）。
  `url` は拡張子なしのパス（`/games/crash`）で書く。`/xxx.html` は 308 で `/xxx` に飛ぶため。
  サムネは `cloudflare/pages/img-games/<id>.webp`（16:10）。**無くてもグラデーション＋頭文字で表示されるので、後から足してよい。**
  一覧は `/games`（`#gm-view`・下からスライドする別ページ）に出る。カードを押すと `#game-panel` の iframe で開く。ゲーム側のページは iframe と単独ページの両方で開かれるので、
  戻るリンクには `target="_top"` を付けること。
- **ランキングを使うゲームは Worker も別途デプロイする。** スコアの保存先は Worker
  （`cloudflare/worker.js`）で、`pages deploy` では反映されない。**`npx wrangler deploy` を忘れると
  ゲーム側だけ新しくなり、ランキングが「取得できませんでした」になる。**
  現在のエンドポイントは DINO が `/dino-ranking`、AGERU CRASH!! が `/crash-ranking`。
  保存先は非公開リポジトリの `_dino_ranking.json` / `_crash_ranking.json`。
  管理用の削除は `DELETE /admin/<game>-ranking?secret=<ADMIN_SECRET>` で、
  ボディは `{clear:true}` 全消し / `{index:N}` 順位指定 / `{name,score}` 指定。
- アップロードの対応形式・サイズ上限は **`index.html` のモーダル / `puru.html` / `worker.js` の3か所**にある。1か所だけ直すと表示と実挙動がズレる。
