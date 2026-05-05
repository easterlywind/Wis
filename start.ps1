# ─────────────────────────────────────────────────────────────────
# Smile Sprout — Script khởi chạy đầy đủ (local development)
# Dành cho Windows PowerShell
#
# Sử dụng: .\start.ps1
#
# Script sẽ:
#   1. Kiểm tra dependencies (Node.js, npm, PostgreSQL)
#   2. Cài đặt packages cho frontend & backend
#   3. Thiết lập database (migrations + seed data)
#   4. Khởi chạy Backend (NestJS) trên port 3000
#   5. Khởi chạy Frontend (Vite) trên port 8080
# ─────────────────────────────────────────────────────────────────

$ErrorActionPreference = "Stop"

$PROJECT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$BACKEND_DIR = Join-Path $PROJECT_DIR "support-autism-children-be"
$FRONTEND_DIR = Join-Path $PROJECT_DIR "smile-sprout"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     🌱 Smile Sprout — Khởi chạy hệ thống    ║" -ForegroundColor Cyan
Write-Host "║     Ứng dụng hỗ trợ trẻ tự kỷ học cảm xúc   ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── 1. Kiểm tra dependencies ──
Write-Host "[1/5] Kiểm tra dependencies..." -ForegroundColor Blue

# Check Node.js
try {
    $nodeVersion = node -v 2>$null
    Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js chưa được cài đặt!" -ForegroundColor Red
    Write-Host "     Tải tại: https://nodejs.org/"
    exit 1
}

# Check npm
try {
    $npmVersion = npm -v 2>$null
    Write-Host "  ✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ npm chưa được cài đặt!" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
try {
    $psqlVersion = psql --version 2>$null
    Write-Host "  ✅ PostgreSQL: $psqlVersion" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  psql không tìm thấy (có thể PostgreSQL đang chạy qua Docker)" -ForegroundColor Yellow
}

Write-Host ""

# ── 2. Cài đặt packages ──
Write-Host "[2/5] Cài đặt packages..." -ForegroundColor Blue

Write-Host "  📦 Backend..."
Push-Location $BACKEND_DIR
if (-not (Test-Path "node_modules")) {
    npm install --loglevel=warn
} else {
    Write-Host "  (node_modules đã tồn tại, skip)" -ForegroundColor Green
}
Pop-Location

Write-Host "  📦 Frontend..."
Push-Location $FRONTEND_DIR
if (-not (Test-Path "node_modules")) {
    npm install --loglevel=warn
} else {
    Write-Host "  (node_modules đã tồn tại, skip)" -ForegroundColor Green
}
Pop-Location

Write-Host ""

# ── 3. Thiết lập Database ──
Write-Host "[3/5] Thiết lập database..." -ForegroundColor Blue
Push-Location $BACKEND_DIR

# Check / create .env
if (Test-Path ".env") {
    Write-Host "  📄 .env file found"
} else {
    Write-Host "  ⚠️  Tạo file .env mặc định..." -ForegroundColor Yellow
    @"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/autismsupport"
JWT_SECRET="smile-sprout-dev-secret-key-2026"
JWT_ACCESS_SECRET="smile-sprout-access-secret-2026"
JWT_REFRESH_SECRET="smile-sprout-refresh-secret-2026"
PORT=3000
CORS_ORIGIN="http://localhost:8080"
"@ | Set-Content -Path ".env" -Encoding UTF8
}

Write-Host "  🔄 Chạy Prisma migrations..."
try {
    npx prisma migrate deploy 2>$null
} catch {
    try {
        npx prisma migrate dev --name init 2>$null
    } catch {
        Write-Host "  ⚠️  Migration có thể đã được chạy trước đó" -ForegroundColor Yellow
    }
}

Write-Host "  🌱 Generate Prisma Client..."
npx prisma generate

Write-Host "  🌱 Seed data..."
try {
    npx ts-node prisma/seed.ts 2>$null
} catch {
    Write-Host "  ⚠️  Seed có thể đã được chạy (bỏ qua lỗi duplicate)" -ForegroundColor Yellow
}

Pop-Location
Write-Host ""

# ── 4. Khởi chạy Backend ──
Write-Host "[4/5] Khởi chạy Backend (NestJS)..." -ForegroundColor Blue
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:BACKEND_DIR
    npm run start:dev
}
Write-Host "  🚀 Backend Job ID: $($backendJob.Id) (port 3000)" -ForegroundColor Green

# Wait for backend to be ready
Write-Host "  ⏳ Đợi backend khởi động..."
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ Backend đã sẵn sàng!" -ForegroundColor Green
            $ready = $true
            break
        }
    } catch {
        # Backend chưa sẵn sàng, thử lại
    }
    Start-Sleep -Seconds 1
}
if (-not $ready) {
    Write-Host "  ⚠️  Backend chưa phản hồi sau 30s, tiếp tục khởi chạy Frontend..." -ForegroundColor Yellow
}

Write-Host ""

# ── 5. Khởi chạy Frontend ──
Write-Host "[5/5] Khởi chạy Frontend (Vite)..." -ForegroundColor Blue
Push-Location $FRONTEND_DIR

# Ensure frontend .env
if (-not (Test-Path ".env")) {
    @"
VITE_API_URL=http://localhost:3000/api
VITE_AI_API_URL=http://localhost:8000
"@ | Set-Content -Path ".env" -Encoding UTF8
}

Pop-Location

$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:FRONTEND_DIR
    npm run dev
}
Write-Host "  🚀 Frontend Job ID: $($frontendJob.Id) (port 8080)" -ForegroundColor Green

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          ✅ Hệ thống đã khởi chạy!           ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║  🌐 Frontend:  http://localhost:8080         ║" -ForegroundColor Green
Write-Host "║  🔧 Backend:   http://localhost:3000/api     ║" -ForegroundColor Green
Write-Host "║  📚 Swagger:   http://localhost:3000/swagger ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Nhấn Ctrl+C để dừng tất cả services" -ForegroundColor Yellow
Write-Host "Hoặc chạy: Stop-Job $($backendJob.Id),$($frontendJob.Id); Remove-Job $($backendJob.Id),$($frontendJob.Id)" -ForegroundColor Yellow
Write-Host ""

# Stream output from both jobs until user presses Ctrl+C
try {
    while ($true) {
        # Print backend output
        Receive-Job -Job $backendJob -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Host "[BE] $_" -ForegroundColor Cyan
        }
        # Print frontend output
        Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Host "[FE] $_" -ForegroundColor Magenta
        }
        
        # Check if jobs are still running
        if ($backendJob.State -eq "Completed" -and $frontendJob.State -eq "Completed") {
            Write-Host "Cả hai services đã dừng." -ForegroundColor Yellow
            break
        }
        
        Start-Sleep -Milliseconds 500
    }
} finally {
    # Cleanup on Ctrl+C
    Write-Host ""
    Write-Host "Đang dừng services..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $frontendJob -ErrorAction SilentlyContinue
    Write-Host "✅ Đã dừng tất cả services" -ForegroundColor Green
}
