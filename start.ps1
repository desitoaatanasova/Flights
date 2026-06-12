param(
    [switch]$NoReSeed
)

$ErrorActionPreference = "Stop"
$mysql = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sqlFile = "$rootDir\FlightsApp\sql\v1.sql"

Write-Host "=== AeroTrack Startup ===" -ForegroundColor Cyan

# 1. Ensure MySQL service is running
Write-Host "[1/4] Checking MySQL service..." -ForegroundColor Yellow
$svc = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if (-not $svc) {
    Write-Host "ERROR: MySQL80 service not found" -ForegroundColor Red
    exit 1
}
if ($svc.Status -ne "Running") {
    Write-Host "Starting MySQL service..." -ForegroundColor Yellow
    Start-Service -Name "MySQL80"
}
Write-Host "  MySQL is running" -ForegroundColor Green

# 2. Ensure database and user exist
Write-Host "[2/4] Checking database..." -ForegroundColor Yellow
$dbExists = & $mysql -u root -proot -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME='Flights_app';" 2>$null
if (-not $dbExists) {
    Write-Host "  Creating database and user..." -ForegroundColor Yellow
    & $mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS Flights_app; CREATE USER IF NOT EXISTS 'flights'@'localhost' IDENTIFIED BY 'root'; GRANT ALL PRIVILEGES ON Flights_app.* TO 'flights'@'localhost'; FLUSH PRIVILEGES;" 2>$null
}
Write-Host "  Database ready" -ForegroundColor Green

# 3. Seed data if tables are empty (unless -NoReSeed)
Write-Host "[3/4] Checking seed data..." -ForegroundColor Yellow
if (-not $NoReSeed) {
    $count = & $mysql -u root -proot -e "USE Flights_app; SELECT COUNT(*) as c FROM Airlines;" 2>$null
    if ($count -match "^\s*0\s*$" -or -not $count) {
        Write-Host "  Seeding database..." -ForegroundColor Yellow
        Get-Content $sqlFile | & $mysql -u root -proot 2>$null
        Write-Host "  Seed data inserted" -ForegroundColor Green
    } else {
        Write-Host "  Data already exists, skipping seed" -ForegroundColor Green
    }
} else {
    Write-Host "  Skipped (NoReSeed flag)" -ForegroundColor Green
}

# 4. Start both servers
Write-Host "[4/4] Starting servers..." -ForegroundColor Yellow
Write-Host "  API:  http://localhost:5185" -ForegroundColor Cyan
Write-Host "  Web:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop both" -ForegroundColor Magenta
Write-Host ""

npm run dev:all
