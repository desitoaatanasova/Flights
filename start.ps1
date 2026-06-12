param(
    [switch]$NoReSeed,
    [switch]$Stop,
    [switch]$Status
)

$mysql = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sqlFile = "$rootDir\FlightsApp\sql\v1.sql"

function Test-Port($port) {
    netstat -ano | findstr ":$port " | Out-Null
    return $?
}

function Stop-Server($name, $port) {
    if (Test-Port $port) {
        netstat -ano | findstr ":$port " | ForEach-Object {
            $parts = $_ -split '\s+'
            $p = $parts[-1]
            Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Host "  $name stopped" -ForegroundColor Yellow
}

if ($Stop) {
    Write-Host "=== Stopping AeroTrack ===" -ForegroundColor Cyan
    Stop-Server "API" 5185
    Stop-Server "Web" 5173
    exit 0
}

if ($Status) {
    Write-Host "=== AeroTrack Status ===" -ForegroundColor Cyan
    $a = Test-Port 5185
    $w = Test-Port 5173
    if ($a) { Write-Host "  API :5185  RUNNING" -ForegroundColor Green }
    else { Write-Host "  API :5185  STOPPED" -ForegroundColor Red }
    if ($w) { Write-Host "  Web :5173  RUNNING" -ForegroundColor Green }
    else { Write-Host "  Web :5173  STOPPED" -ForegroundColor Red }
    exit 0
}

Write-Host "=== AeroTrack Startup ===" -ForegroundColor Cyan

# 1. MySQL
Write-Host "[1/4] MySQL..." -ForegroundColor Yellow
$svc = Get-Service MySQL80 -ErrorAction SilentlyContinue
if (-not $svc) { Write-Host "MySQL80 not found" -ForegroundColor Red; exit 1 }
if ($svc.Status -ne "Running") { Start-Service MySQL80; Start-Sleep 3 }
Write-Host "  OK" -ForegroundColor Green

# 2. Database
Write-Host "[2/4] Database..." -ForegroundColor Yellow
$dbExists = & $mysql -u root -proot -e "SELECT 1 FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME='Flights_app'" 2>$null
if (-not $dbExists) {
    & $mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS Flights_app; CREATE USER IF NOT EXISTS 'flights'@'localhost' IDENTIFIED BY 'root'; GRANT ALL ON Flights_app.* TO 'flights'@'localhost'; FLUSH PRIVILEGES;" 2>$null
    Write-Host "  Created" -ForegroundColor Green
} else {
    Write-Host "  OK" -ForegroundColor Green
}

# 3. Seed data
Write-Host "[3/4] Seed data..." -ForegroundColor Yellow
if (-not $NoReSeed) {
    $count = & $mysql -u root -proot -e "USE Flights_app; SELECT COUNT(*) FROM Airlines;" 2>$null
    if ($count -match "^\s*0\s*$" -or -not $count) {
        Get-Content $sqlFile | & $mysql -u root -proot 2>$null
        Write-Host "  Seeded" -ForegroundColor Green
    } else {
        Write-Host "  Skipped (has data)" -ForegroundColor Green
    }
}

# 4. Start servers as detached processes
Write-Host "[4/4] Servers..." -ForegroundColor Yellow

if (Test-Port 5185) {
    Write-Host "  API already running" -ForegroundColor Green
} else {
    Write-Host "  Starting API..." -ForegroundColor Yellow
    $apiScript = @"
cd "$rootDir\FlightsApp"
dotnet run --launch-profile http
"@
    $apiScript | Out-File "$rootDir\_run_api.ps1" -Force
    Start-Process powershell -WindowStyle Hidden -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$rootDir\_run_api.ps1`""
    Write-Host "  Waiting for API..."
    $start = Get-Date
    do {
        Start-Sleep 2
        $ok = Test-Port 5185
        $elapsed = [int]((Get-Date) - $start).TotalSeconds
    } while (-not $ok -and $elapsed -lt 60)
    if ($ok) { Write-Host "  API ready" -ForegroundColor Green }
    else { Write-Host "  API timed out" -ForegroundColor Red; exit 1 }
}

if (Test-Port 5173) {
    Write-Host "  Web already running" -ForegroundColor Green
} else {
    Write-Host "  Starting Vite..." -ForegroundColor Yellow
    $webScript = @"
cd "$rootDir"
npm run dev
"@
    $webScript | Out-File "$rootDir\_run_web.ps1" -Force
    Start-Process powershell -WindowStyle Hidden -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$rootDir\_run_web.ps1`""
    Write-Host "  Waiting for Vite..."
    $start = Get-Date
    do {
        Start-Sleep 2
        $ok = Test-Port 5173
        $elapsed = [int]((Get-Date) - $start).TotalSeconds
    } while (-not $ok -and $elapsed -lt 30)
    if ($ok) { Write-Host "  Web ready" -ForegroundColor Green }
    else { Write-Host "  Web timed out" -ForegroundColor Red; exit 1 }
}

Write-Host ""
Write-Host "  http://localhost:5173" -ForegroundColor Cyan
Write-Host "  .\start.ps1 -Stop to stop" -ForegroundColor Magenta
Start-Process chrome -ArgumentList "http://localhost:5173"
