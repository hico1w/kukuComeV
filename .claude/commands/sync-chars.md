# キャラ画像同期 (sync-chars)

`data/charImages.json` を正として、以下を一括実行する。

> **重要**: `public/chara/` に存在しないファイルは、ユーザーが意図的に削除した可能性がある。手順1.5 でそれらを charImages.json から削除してから以降の手順を実行する。

## 大前提：2つのディレクトリと拡張子マッピング規則（必読）

| ディレクトリ | 役割 | 形式 |
|---|---|---|
| `public/chara/` | **常に正**。ゲーム本体が使う原本 | 元のまま（png/jpg/gif/webp） |
| `chara/` | GitHub Pages 配信用のコピー | png/jpg は **WebP に変換**、変換できないものはそのまま |

**Pages 側の期待ファイル名は原本名から機械的に決まる：**

```
.png / .jpg / .jpeg  →  同名の .webp
.gif / .webp など    →  そのまま（GIFはアニメ保持のため変換しない）
```

この規則を `expected()` として全手順で共有する。**`charImages.json` の値をそのまま `chara/` や `STANDALONE_CHARS` に使ってはいけない**（拡張子が違うため画像が全滅する）。

### やってはいけないこと

- ❌ **`STANDALONE_CHARS` に `charImages.json` の値をそのまま書く** → Pages には `.png` が存在しないので画像が全滅する
- ❌ **`chara/` の実ファイル名と `charImages.json` の値を直接比較して不足判定する** → 変換済み306件が全部「不足」と誤判定され、`.png` が大量コピーされる。
  `convert-chara-webp.js` は変換先の `.webp` が既存だと**スキップして元ファイルを削除しない**ため、孤立 `.png` が `chara/` に残り続ける
- ✅ 比較は必ず `expected()` を通した名前で行う（手順2のスクリプトは対応済み）

## 手順

### 1. charImages.json を読み込む

`E:\claude\kukuCome\data\charImages.json` を読み込み、キャラN→ファイル名マップを取得する。

### 1.5. public/chara/ に存在しないエントリを charImages.json から削除

`public/chara/` に実ファイルが存在しないエントリを charImages.json から取り除く（ユーザーが手動削除した場合などに対応）：

```powershell
cd E:\claude\kukuCome
node -e "
const fs = require('fs');
const path = require('path');
const charaDir = path.join(__dirname, 'public', 'chara');
const json = JSON.parse(fs.readFileSync('data/charImages.json', 'utf8'));
const existing = new Set(fs.readdirSync(charaDir));
const removed = [];
const newJson = {};
Object.entries(json).forEach(([k, v]) => {
  if (existing.has(v)) {
    newJson[k] = v;
  } else {
    removed.push(k + ': ' + v);
  }
});
fs.writeFileSync('data/charImages.json', JSON.stringify(newJson));
console.log('Removed entries:', removed.length);
removed.forEach(r => console.log('  ' + r));
console.log('Remaining entries:', Object.keys(newJson).length);
"
```

- 削除されたエントリはユーザーに報告する
- 削除があった場合は **charImages.json を再読み込みしてから** 手順2以降を実行する

### 2. root chara/ への不足ファイルを補完（拡張子マッピング対応）

`expected()` を通した名前で比較するので、変換済みファイルを重複コピーしない。
**変換が必要な png/jpg だけが元形式でコピーされ、手順6で WebP 化される。**

```bash
node -e '
const fs=require("fs"), path=require("path");
const cj=JSON.parse(fs.readFileSync("data/charImages.json","utf8"));
const expected=f=>/\.(png|jpe?g)$/i.test(f)? f.replace(/\.(png|jpe?g)$/i,".webp") : f;
const pages=new Set(fs.readdirSync("chara"));
let copied=0, already=0, nosrc=[];
for(const [k,f] of Object.entries(cj)){
  if(pages.has(expected(f))){ already++; continue; }   // 変換済み or 配置済み
  const src=path.join("public","chara",f);
  if(!fs.existsSync(src)){ nosrc.push(k+": "+f); continue; }
  fs.copyFileSync(src, path.join("chara",f));
  console.log("Copied:", f, f===expected(f)?"(変換不要)":"(→手順6で.webp化)");
  copied++;
}
console.log("\nコピー:",copied,"/ 既に配置済み:",already,"/ 元ファイル無し:",nosrc.length);
nosrc.forEach(x=>console.log("  NOT FOUND: "+x));
'
```

### 3. index.html の STANDALONE_CHARS を更新（`.webp` 名で書く）

**`charImages.json` の値をそのまま貼ってはいけない。** `expected()` を通した名前で書き込む：

```bash
node -e '
const fs=require("fs");
const cj=JSON.parse(fs.readFileSync("data/charImages.json","utf8"));
const expected=f=>/\.(png|jpe?g)$/i.test(f)? f.replace(/\.(png|jpe?g)$/i,".webp") : f;
const sc={}; for(const [k,f] of Object.entries(cj)) sc[k]=expected(f);
let html=fs.readFileSync("index.html","utf8");
const out="const STANDALONE_CHARS = "+JSON.stringify(sc)+";";
if(!/const STANDALONE_CHARS = \{.*?\};/s.test(html)) throw new Error("STANDALONE_CHARS が見つかりません");
html=html.replace(/const STANDALONE_CHARS = \{.*?\};/s,out);
fs.writeFileSync("index.html",html,"utf8");
console.log("STANDALONE_CHARS 更新:",Object.keys(sc).length,"件");
'
```

- キーは文字列 `"1"`, `"2"` ... の形式（JSON準拠）
- 少数の追加だけなら全置換せず該当キーだけ足してもよい（その場合も `expected()` の規則に従う）

### 4. 未登録の画像ファイルを検出して警告

`chara/` や `public/chara/` に画像ファイルがあるのに `charImages.json` に登録されていない（＝マニュアルにもゲームにも出ない）ものを検出して報告する。`charImages.json` を正とするこのスキルでは普段拾えないため、ここで明示的に警告する。

```bash
node -e '
const fs=require("fs");
const cj=JSON.parse(fs.readFileSync("data/charImages.json","utf8"));
const registered=new Set(Object.values(cj));
const baseReg=new Set([...registered].map(f=>f.replace(/\.[^.]+$/,"")));
const imgs=d=>{try{return fs.readdirSync(d).filter(f=>/\.(png|jpe?g|webp|gif)$/i.test(f))}catch(e){return[]}};
const all=new Set([...imgs("chara"),...imgs("public/chara")]);
const unreg=[...all].filter(f=>!registered.has(f)).sort();
// 同名(拡張子違い)の登録済みがあるものは「別形式の重複候補」として区別
const dupFmt=unreg.filter(f=>baseReg.has(f.replace(/\.[^.]+$/,"")));
const newOnes=unreg.filter(f=>!dupFmt.includes(f));
console.log("未登録ファイル合計:",unreg.length);
console.log("◆ 新規キャラ候補(登録推奨):",newOnes.length,"\n  "+(newOnes.join("\n  ")||"(なし)"));
console.log("◆ 別形式の重複候補(同名.pngが登録済み・削除候補):",dupFmt.length,"\n  "+(dupFmt.join("\n  ")||"(なし)"));
'
```

- **新規キャラ候補**があれば、ユーザーに提示して登録（charImages.json に次のキー番号を付与 → 手順2・3を再実行）するか確認する。`public/chara/` に無いファイルは、ゲーム配信用（`/chara-s/` = `public/chara/`）に**コピーが必要**な点も伝える。
- **別形式の重複候補**（`.jpg`/`.jpeg` 等で同名 `.png` が登録済み）は削除候補として提示する。

### 5. 完了報告

- 補完したファイル数と名前を列挙
- STANDALONE_CHARS のキャラ数（エントリ数）を報告
- 手順4の未登録ファイル（新規キャラ候補／重複候補）を報告
- 不一致があれば警告

### 6. chara/ の PNG/JPG を WebP に変換

手順2で png/jpg をコピーした場合は**必ず**実行する。GitHub Pages はサーバーサイド処理がないため、`chara/` には変換済みファイルを配置しておく必要がある（`public/chara/` は原本なので変換しない）。

```bash
node convert-chara-webp.js
```

- `chara/` 以下の PNG/JPG を WebP（quality 85）に変換し、**元ファイルを削除する**
- GIF はアニメーション保持のため変換しない
- 変換先の `.webp` が既にある場合はスキップ（このとき元ファイルは削除されないので、手順2で余計なコピーをしていると孤立 `.png` が残る）

### 7. index.html の残った画像参照を WebP に置換

```bash
node update-index-webp.js
```

- `STANDALONE_CHARS` / promptSample / keyword-samples / screenshots の `.png`/`.jpg` 参照を `.webp` に一括置換
- `ageru/haikei.png` はゲームサーバー側の画像なので意図的に `.png` のまま戻される（**この1件だけは残るのが正常**）

### 8. 整合性を検証（必須）

3者（`charImages.json` / `STANDALONE_CHARS` / `chara/` の実ファイル）が一致していることを必ず確認する：

```bash
node -e '
const fs=require("fs");
const cj=JSON.parse(fs.readFileSync("data/charImages.json","utf8"));
const html=fs.readFileSync("index.html","utf8");
const sc=JSON.parse(html.match(/const STANDALONE_CHARS = (\{.*?\});/s)[1]);
const pages=new Set(fs.readdirSync("chara"));
const expected=f=>/\.(png|jpe?g)$/i.test(f)? f.replace(/\.(png|jpe?g)$/i,".webp") : f;
let bad=0;
for(const [k,f] of Object.entries(cj)){
  const want=expected(f);
  if(sc[k]!==want){ console.log("NG STANDALONE_CHARS",k,sc[k],"!=",want); bad++; }
  if(!pages.has(want)){ console.log("NG ファイル欠損",k,want); bad++; }
}
const wanted=new Set(Object.values(cj).map(expected));
const orphan=[...pages].filter(f=>/\.(png|jpe?g|webp|gif)$/i.test(f)&&!wanted.has(f));
if(orphan.length) console.log("孤立ファイル(chara/にあるが未登録):",orphan.length,orphan.slice(0,10).join(", "));
console.log(bad===0&&orphan.length===0? "✅ 完全一致":"❌ 不整合 "+bad+"件 / 孤立 "+orphan.length+"件");
console.log("件数:",Object.keys(cj).length,"/",Object.keys(sc).length,"/",pages.size);
const d=(html.match(/<div[\s>]/g)||[]).length,c=(html.match(/<\/div>/g)||[]).length;
console.log("divタグ:",d,c,d===c?"OK":"MISMATCH");
'
```

### 9. GitHub Pages へ反映

`index.html` と `chara/` の変更は `.github/workflows/pages.yml` で自動デプロイされる（`main` への push がトリガー）。

- **push は共有状態を変えるので、実行前に必ずユーザーの承認を得る**
- push 後の確認：
  ```powershell
  & "C:\Program Files\GitHub CLI\gh.exe" run list --repo hico1w/kukuComeV --workflow=pages.yml --limit 1
  ```
- 起動しない場合は手動トリガー：
  ```powershell
  & "C:\Program Files\GitHub CLI\gh.exe" workflow run pages.yml --repo hico1w/kukuComeV
  ```
- 公開URL：**https://hico1w.github.io/kukuComeV/**

