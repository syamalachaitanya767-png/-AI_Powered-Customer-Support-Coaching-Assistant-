@echo off
title Push AI Customer Support Assistant to GitHub
echo =================================================================
echo  Pushing Project to GitHub: -AI_Powered-Customer-Support-Coaching-Assistant-
echo =================================================================
echo.

set "GIT_PATH=C:\Program Files\Git\cmd\git.exe"
if not exist "%GIT_PATH%" (
    set "GIT_PATH=git"
)

echo [1/3] Checking Git Status...
"%GIT_PATH%" status

echo.
echo [2/3] Verifying Remote Repository...
"%GIT_PATH%" remote -v

echo.
echo [3/3] Pushing to GitHub (Branch: main)...
echo If a browser window opens, please click "Sign in with your browser" to authenticate.
echo.
"%GIT_PATH%" push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo =================================================================
    echo  SUCCESS! Project successfully pushed to GitHub!
    echo  URL: https://github.com/syamalachaitanya767-png/-AI_Powered-Customer-Support-Coaching-Assistant-
    echo =================================================================
) else (
    echo.
    echo [ERROR] Git push failed. Please check your GitHub credentials.
)

echo.
pause
