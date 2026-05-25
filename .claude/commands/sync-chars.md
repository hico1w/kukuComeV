# キャラ画像同期 (sync-chars)

`data/charImages.json` を正として、以下を一括実行する。

## 手順

### 1. charImages.json を読み込む

`E:\claude\kukuCome\data\charImages.json` を読み込み、キャラN→ファイル名マップを取得する。

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

### 4. 完了報告

- 補完したファイル数と名前を列挙
- STANDALONE_CHARS のキャラ数（エントリ数）を報告
- 不一致があれば警告
