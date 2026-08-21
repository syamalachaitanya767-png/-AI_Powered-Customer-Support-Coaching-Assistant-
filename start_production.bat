@echo off
title AI Customer Support Coaching Assistant - Production Server
echo =================================================================
echo  AI Customer Support Coaching Assistant - Unified Production
echo =================================================================
echo.

cd /d "%~dp0frontend"
echo [1/2] Building React production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b %errorlevel%
)

cd /d "%~dp0backend"
echo.
echo [2/2] Starting Flask Unified Backend & SPA Server...
echo  - Live Workspace: http://localhost:5000
echo.

if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
)

python app.py
pause
