@echo off
title AI Trading Journal Launcher
echo ==================================================
echo        AI TRADING JOURNAL LAUNCHER
echo ==================================================

echo [*] Checking Python dependencies...
python -c "import fastapi, uvicorn" 2>NUL
if %ERRORLEVEL% neq 0 (
    echo [!] Installing Python dependencies...
    pip install -r requirements.txt
) else (
    echo [+] Python dependencies already installed.
)

echo [*] Checking Frontend dependencies...
if not exist "frontend\node_modules\" (
    echo [!] Installing Frontend dependencies...
    cd frontend && cmd /c npm install && cd ..
) else (
    echo [+] Frontend dependencies already installed.
)

echo [*] Starting FastAPI Backend on port 8000...
start cmd /k "python -m uvicorn main:app --port 8000"

echo [*] Starting Vite React Frontend on port 5173...
start cmd /k "cd frontend && npm run dev"

echo [*] Launching application in browser...
timeout /t 3 >nul
start http://localhost:5173

echo ==================================================
echo    Servers started successfully! Keep windows open.
echo ==================================================
