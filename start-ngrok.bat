@echo off
chcp 65001 > nul
echo ====================================
echo  kukuCome — ngrok 公開トンネル
echo ====================================
echo.

REM サーバー起動確認
curl -s --max-time 1 http://localhost:3000/api/time > nul 2>&1
if errorlevel 1 (
  echo [INFO] kukuCome サーバーを起動します...
  start "kukuCome Server" cmd /k "node server.js"
  timeout /t 3 /nobreak > nul
) else (
  echo [INFO] サーバーは既に起動中です
)

echo [INFO] ngrok トンネルを開始します...
echo       表示される Forwarding URL を相手に共有してください
echo       例: https://xxxx-xx-xx-xx-xx.ngrok-free.app
echo.
ngrok http 3000
