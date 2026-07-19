# ==================================================
# AI Trading Journal Application Runner
# ==================================================

Clear-Host
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "       AI TRADING JOURNAL APPLICATION RUNNER      " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Check Python Requirements
Write-Host "[*] Checking Python dependencies..." -ForegroundColor Yellow
try {
    python -c "import fastapi, uvicorn" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[!] Installing Python dependencies from requirements.txt..." -ForegroundColor Yellow
        pip install -r requirements.txt
    } else {
        Write-Host "[+] Python dependencies are already installed." -ForegroundColor Green
    }
} catch {
    Write-Host "[!] Python or pip not found in PATH. Please ensure Python is installed." -ForegroundColor Red
}

# 2. Check Frontend Dependencies
Write-Host "[*] Checking Frontend dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "[!] node_modules not found. Installing frontend dependencies (npm install)..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
} else {
    Write-Host "[+] Frontend dependencies are already installed." -ForegroundColor Green
}

# 3. Start Backend in separate window
Write-Host "[*] Starting FastAPI Backend on port 8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn main:app --port 8000" -WindowStyle Normal

# 4. Start Frontend in separate window
Write-Host "[*] Starting Vite React Frontend on port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

# 5. Launch Browser
Start-Sleep -Seconds 3
Write-Host "[+] Opening Application in browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host "==================================================" -ForegroundColor Green
Write-Host "   Servers are running! Keep windows open.        " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
