# キャラ画像同期 (sync-chars)

`data/charImages.json` を正として、以下を一括実行する。

> **重要**: `public/chara/` に存在しないファイルは、ユーザーが意図的に削除した可能性がある。手順1.5 でそれらを charImages.json から削除してから以降の手順を実行する。

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

### 2. root chara/ への不足ファイルを補完

PowerShell で以下を実行する：

```powershell
$json = Get-Content "E:\claude\kukuCome\data\charImages.json" | ConvertFrom-Json
$needed = $json.PSObject.Properties.Value
$existing = (Get-ChildItem "E:\claude\kukuCome\chara").Name
$missing = $needed | Where-Object { $_ -notin $existing }
foreach ($f in $missing) {
  $src = "E:\claude\kukuCome\public\chara\$f"
  $dst = "E:\claude\kukuCome\chara\$f"
  if (Test-Path $src) { Copy-Item $src $dst; Write-Host "Copied: $f" }
  else { Write-Host "NOT FOUND: $f" }
}
if ($missing.Count -eq 0) { Write-Host "No missing files." }
```

### 3. index.html の STANDALONE_CHARS を更新

`E:\claude\kukuCome\index.html` の以下の行を、`charImages.json` の内容と完全一致するよう書き換える：

```javascript
const STANDALONE_CHARS = {charImages.jsonの内容をそのままJSオブジェクトとして貼り付け};
```

- 既存の `const STANDALONE_CHARS = {...};` の行全体を置換する
- キーは文字列 `"1"`, `"2"` ... の形式（JSON準拠）

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

