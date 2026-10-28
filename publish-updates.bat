@echo off
cd /d "%~dp0"
echo ==========================================================
echo   PUBLISHING UPDATES TO LIVE SITE: https://nerdymisfits.com
echo ==========================================================
git add -A
git commit -m "Update NerdyMisfits.com live site"
git push origin main
echo.
echo Done! https://nerdymisfits.com will update in ~15 seconds!
pause
