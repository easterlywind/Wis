#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# Smile Sprout — Script khởi chạy đầy đủ (local development)
#
# Sử dụng: chmod +x start.sh && ./start.sh
#
# Script sẽ:
#   1. Kiểm tra dependencies (Node.js, npm, PostgreSQL)
#   2. Cài đặt packages cho frontend & backend
#   3. Thiết lập database (migrations + seed data)
#   4. Khởi chạy Backend (NestJS) trên port 3000
#   5. Khởi chạy Frontend (Vite) trên port 8080
# ─────────────────────────────────────────────────────────────────

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/support-autism-children-be"
FRONTEND_DIR="$PROJECT_DIR/smile-sprout"

echo ""
echo -e "${CYAN}${BOLD}╔══════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}${BOLD}║     🌱 Smile Sprout — Khởi chạy hệ thống    ║${NC}"
echo -e "${CYAN}${BOLD}║     Ứng dụng hỗ trợ trẻ tự kỷ học cảm xúc   ║${NC}"
echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════════╝${NC}"
echo ""

# ── 1. Kiểm tra dependencies ──
echo -e "${BLUE}[1/5]${NC} Kiểm tra dependencies..."

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js chưa được cài đặt!${NC}"
    echo "   Tải tại: https://nodejs.org/"
    exit 1
fi
echo -e "  ✅ Node.js: $(node -v)"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm chưa được cài đặt!${NC}"
    exit 1
fi
echo -e "  ✅ npm: $(npm -v)"

# Check PostgreSQL
if command -v psql &> /dev/null; then
    echo -e "  ✅ PostgreSQL: $(psql --version | head -n1)"
else
    echo -e "${YELLOW}  ⚠️  psql không tìm thấy (có thể PostgreSQL đang chạy qua Docker)${NC}"
fi

echo ""

# ── 2. Cài đặt packages ──
echo -e "${BLUE}[2/5]${NC} Cài đặt packages..."

echo -e "  📦 Backend..."
cd "$BACKEND_DIR"
if [ ! -d "node_modules" ]; then
    npm install --loglevel=warn
else
    echo -e "  ${GREEN}(node_modules đã tồn tại, skip)${NC}"
fi

echo -e "  📦 Frontend..."
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    npm install --loglevel=warn
else
    echo -e "  ${GREEN}(node_modules đã tồn tại, skip)${NC}"
fi

echo ""

# ── 3. Thiết lập Database ──
echo -e "${BLUE}[3/5]${NC} Thiết lập database..."
cd "$BACKEND_DIR"

# Check if DATABASE_URL is set
if [ -f .env ]; then
    echo -e "  📄 .env file found"
else
    echo -e "${YELLOW}  ⚠️  Tạo file .env mặc định...${NC}"
    cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/autismsupport"
JWT_SECRET="smile-sprout-dev-secret-key-2026"
JWT_ACCESS_SECRET="smile-sprout-access-secret-2026"
JWT_REFRESH_SECRET="smile-sprout-refresh-secret-2026"
PORT=3000
CORS_ORIGIN="http://localhost:8080"
EOF
fi

echo -e "  🔄 Chạy Prisma migrations..."
npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init 2>/dev/null || echo -e "${YELLOW}  ⚠️  Migration có thể đã được chạy trước đó${NC}"

echo -e "  🌱 Generate Prisma Client..."
npx prisma generate

echo -e "  🌱 Seed data..."
npx ts-node prisma/seed.ts 2>/dev/null || echo -e "${YELLOW}  ⚠️  Seed có thể đã được chạy (bỏ qua lỗi duplicate)${NC}"

echo ""

# ── 4. Khởi chạy Backend ──
echo -e "${BLUE}[4/5]${NC} Khởi chạy Backend (NestJS)..."
cd "$BACKEND_DIR"
npm run start:dev &
BACKEND_PID=$!
echo -e "  🚀 Backend PID: $BACKEND_PID (port 3000)"

# Wait for backend to be ready
echo -e "  ⏳ Đợi backend khởi động..."
for i in {1..30}; do
    if curl -s http://localhost:3000/api > /dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Backend đã sẵn sàng!${NC}"
        break
    fi
    sleep 1
done

echo ""

# ── 5. Khởi chạy Frontend ──
echo -e "${BLUE}[5/5]${NC} Khởi chạy Frontend (Vite)..."
cd "$FRONTEND_DIR"

# Ensure frontend .env
if [ ! -f .env ]; then
    cat > .env << 'EOF'
VITE_API_URL=http://localhost:3000/api
VITE_AI_API_URL=http://localhost:8000
EOF
fi

npm run dev &
FRONTEND_PID=$!
echo -e "  🚀 Frontend PID: $FRONTEND_PID (port 8080)"

echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║          ✅ Hệ thống đã khởi chạy!           ║${NC}"
echo -e "${GREEN}${BOLD}╠══════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}${BOLD}║  🌐 Frontend:  http://localhost:8080         ║${NC}"
echo -e "${GREEN}${BOLD}║  🔧 Backend:   http://localhost:3000/api     ║${NC}"
echo -e "${GREEN}${BOLD}║  📚 Swagger:   http://localhost:3000/swagger ║${NC}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Nhấn Ctrl+C để dừng tất cả services${NC}"
echo ""

# Trap Ctrl+C to kill both processes
cleanup() {
    echo ""
    echo -e "${YELLOW}Đang dừng services...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Đã dừng tất cả services${NC}"
    exit 0
}

trap cleanup INT TERM

# Wait for both processes
wait
