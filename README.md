# 🌱 Smile Sprout

> Ứng dụng hỗ trợ trẻ tự kỷ nhận biết và luyện tập biểu đạt cảm xúc.

## 📋 Tổng quan

Smile Sprout là nền tảng học tập tương tác giúp trẻ em mắc chứng tự kỷ:

- **Nhận biết cảm xúc** qua hình ảnh, video, âm thanh (quiz trắc nghiệm)
- **Luyện biểu đạt cảm xúc** qua camera với AI nhận diện khuôn mặt (AWS Rekognition)
- **Theo dõi tiến trình** học tập và phát triển của trẻ

---

## 🏗️ Kiến trúc hệ thống

```
KHMT/
├── smile-sprout/                  # Frontend (React + Vite + TypeScript)
│   └── AI/
│       ├── backend-emotrack/      # AI Service – Nhận diện cảm xúc (FastAPI + AWS Rekognition)
│       └── backend-mapping/       # AI Gateway – Chuyển đổi label cảm xúc (FastAPI)
├── support-autism-children-be/    # Backend API (NestJS + Prisma + PostgreSQL)
├── docker-compose.yml             # Docker Compose (PostgreSQL + Backend + Frontend)
├── start.sh                       # Script khởi chạy nhanh (Linux/macOS)
├── start.ps1                      # Script khởi chạy nhanh (Windows PowerShell)
└── README.md
```

| Thành phần          | Tech Stack                                              | Port   |
| ------------------- | ------------------------------------------------------- | ------ |
| **Frontend**        | React 18, Vite 5, TypeScript, TailwindCSS, shadcn/ui    | `8080` |
| **Backend API**     | NestJS 11, Prisma ORM, PostgreSQL 16, JWT Auth, Swagger | `3000` |
| **AI – EmoTrack**   | FastAPI, OpenCV, AWS Rekognition, SQLite                 | `8000` |
| **AI – Mapping**    | FastAPI, httpx                                           | `8001` |

---

## ⚙️ Yêu cầu hệ thống

### Cài đặt thủ công (Manual)

| Phần mềm          | Phiên bản tối thiểu | Ghi chú                     |
| ------------------ | -------------------- | --------------------------- |
| **Node.js**        | ≥ 18                 | Khuyến nghị v20 LTS         |
| **npm**            | ≥ 9                  | Đi kèm Node.js             |
| **PostgreSQL**     | ≥ 14                 | Khuyến nghị v16             |
| **Python**         | ≥ 3.10               | Cho AI services (tuỳ chọn)  |
| **Git**            | ≥ 2.30               |                             |

### Cài đặt qua Docker

| Phần mềm          | Phiên bản tối thiểu |
| ------------------ | -------------------- |
| **Docker**         | ≥ 20.10              |
| **Docker Compose** | ≥ 2.0                |

---

## 🚀 Hướng dẫn cài đặt

### Bước 0: Clone dự án

```bash
git clone https://github.com/<your-org>/KHMT.git
cd KHMT
```

---

## 🐧 Cài đặt trên Ubuntu / Linux

### Cách 1: Dùng Docker (Khuyến nghị ✅)

#### 1. Cài Docker & Docker Compose

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker
sudo apt install -y docker.io docker-compose-v2

# Thêm user hiện tại vào group docker (không cần sudo khi chạy docker)
sudo usermod -aG docker $USER

# Đăng xuất và đăng nhập lại để áp dụng, hoặc chạy:
newgrp docker

# Kiểm tra
docker --version
docker compose version
```

#### 2. Khởi chạy toàn bộ hệ thống

```bash
# Chạy tất cả services (PostgreSQL + Backend + Frontend)
docker compose up --build -d

# Xem logs
docker compose logs -f

# Dừng tất cả services
docker compose down
```

> **Lưu ý:** Lần đầu chạy sẽ mất vài phút để build images và tải dependencies.

Sau khi chạy thành công:

| Service     | URL                                |
| ----------- | ---------------------------------- |
| Frontend    | http://localhost:8080               |
| Backend API | http://localhost:3000/api           |
| Swagger     | http://localhost:3000/swagger       |

---

### Cách 2: Cài đặt thủ công

#### 1. Cài đặt Node.js

```bash
# Cài Node.js 20 LTS qua NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra
node -v   # v20.x.x
npm -v    # 10.x.x
```

#### 2. Cài đặt PostgreSQL

```bash
# Cài PostgreSQL 16
sudo apt install -y postgresql postgresql-contrib

# Khởi động service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Tạo database và user
sudo -u postgres psql -c "CREATE DATABASE autismsupport;"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

# Kiểm tra kết nối
psql -U postgres -h localhost -d autismsupport -c "SELECT 1;"
```

#### 3. Cài đặt Backend

```bash
cd support-autism-children-be

# Tạo file .env
cp .env.example .env
```

Mở file `.env` và chỉnh sửa (hoặc giữ nguyên nếu dùng cấu hình mặc định):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/autismsupport"
JWT_SECRET="smile-sprout-dev-secret-key-2026"
JWT_ACCESS_SECRET="smile-sprout-access-secret-2026"
JWT_REFRESH_SECRET="smile-sprout-refresh-secret-2026"
PORT=3000
CORS_ORIGIN="http://localhost:8080"
```

```bash
# Cài dependencies
npm install

# Tạo Prisma Client & chạy migrations
npx prisma generate
npx prisma migrate dev

# Seed data mẫu
npx ts-node prisma/seed.ts

# Chạy server (development mode)
npm run start:dev
```

> ✅ Backend sẽ chạy tại `http://localhost:3000/api`
> 📚 Swagger docs tại `http://localhost:3000/swagger`

#### 4. Cài đặt Frontend

Mở terminal mới:

```bash
cd smile-sprout

# Tạo file .env
cp .env.example .env
```

Nội dung `.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_AI_API_URL=http://localhost:8000
```

```bash
# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

> ✅ Frontend sẽ chạy tại `http://localhost:8080`

#### 5. (Tuỳ chọn) Cài đặt AI Service

```bash
# Cài Python 3.11
sudo apt install -y python3.11 python3.11-venv python3-pip

# --- EmoTrack Service (nhận diện cảm xúc) ---
cd smile-sprout/AI/backend-emotrack

python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Cấu hình AWS credentials (cần tài khoản AWS với quyền Rekognition)
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="ap-southeast-1"

# Chạy
uvicorn app:app --host 0.0.0.0 --port 8000

# --- Mapping Service (gateway) ---
cd ../backend-mapping

python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

uvicorn main:app --host 0.0.0.0 --port 8001
```

#### 6. Sử dụng script tự động (chỉ Linux)

```bash
chmod +x start.sh
./start.sh
```

Script sẽ tự động: kiểm tra dependencies → cài packages → tạo database → chạy Backend + Frontend.

---

## 🪟 Cài đặt trên Windows

### Cách 1: Dùng Docker Desktop (Khuyến nghị ✅)

#### 1. Cài Docker Desktop

1. Tải **Docker Desktop** từ [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Chạy installer, **bật WSL 2** khi được hỏi
3. Khởi động lại máy sau khi cài xong
4. Mở Docker Desktop và đợi đến khi icon chuyển sang xanh (running)

Kiểm tra trong **PowerShell** hoặc **Command Prompt**:

```powershell
docker --version
docker compose version
```

#### 2. Khởi chạy toàn bộ hệ thống

Mở **PowerShell** tại thư mục dự án:

```powershell
# Chạy tất cả services
docker compose up --build -d

# Xem logs
docker compose logs -f

# Dừng
docker compose down
```

Sau khi chạy thành công:

| Service     | URL                                |
| ----------- | ---------------------------------- |
| Frontend    | http://localhost:8080               |
| Backend API | http://localhost:3000/api           |
| Swagger     | http://localhost:3000/swagger       |

---

### Cách 2: Cài đặt thủ công trên Windows

#### 1. Cài đặt Node.js

1. Tải **Node.js 20 LTS** từ [https://nodejs.org/](https://nodejs.org/)
2. Chạy installer, chọn **"Add to PATH"** (mặc định)
3. Mở **PowerShell mới** và kiểm tra:

```powershell
node -v   # v20.x.x
npm -v    # 10.x.x
```

#### 2. Cài đặt PostgreSQL

1. Tải **PostgreSQL 16** từ [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Chạy installer:
   - Chọn **PostgreSQL Server** + **pgAdmin 4** + **Command Line Tools**
   - Đặt mật khẩu cho user `postgres` là `postgres` (hoặc tuỳ chọn)
   - Giữ port mặc định `5432`
3. Mở **pgAdmin 4** hoặc **SQL Shell (psql)** và tạo database:

```sql
CREATE DATABASE autismsupport;
```

Hoặc qua Command Prompt:

```cmd
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE autismsupport;"
```

#### 3. Cài đặt Git

1. Tải từ [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Cài đặt với cấu hình mặc định
3. Kiểm tra:

```powershell
git --version
```

#### 4. Cài đặt Backend

Mở **PowerShell** tại thư mục dự án:

```powershell
cd support-autism-children-be

# Tạo file .env
Copy-Item .env.example .env
```

Mở file `.env` bằng Notepad và chỉnh sửa:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/autismsupport"
JWT_SECRET="smile-sprout-dev-secret-key-2026"
JWT_ACCESS_SECRET="smile-sprout-access-secret-2026"
JWT_REFRESH_SECRET="smile-sprout-refresh-secret-2026"
PORT=3000
CORS_ORIGIN="http://localhost:8080"
```

```powershell
# Cài dependencies
npm install

# Tạo Prisma Client & chạy migrations
npx prisma generate
npx prisma migrate dev

# Seed data mẫu
npx ts-node prisma/seed.ts

# Chạy server
npm run start:dev
```

> ✅ Backend: `http://localhost:3000/api`
> 📚 Swagger: `http://localhost:3000/swagger`

#### 5. Cài đặt Frontend

Mở **PowerShell mới** (giữ terminal Backend đang chạy):

```powershell
cd smile-sprout

# Tạo file .env
Copy-Item .env.example .env
```

Nội dung `.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_AI_API_URL=http://localhost:8000
```

```powershell
# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

> ✅ Frontend: `http://localhost:8080`

#### 6. (Tuỳ chọn) Cài đặt AI Service

1. Tải **Python 3.11** từ [https://www.python.org/downloads/](https://www.python.org/downloads/)
   - ⚠️ **Bắt buộc check "Add Python to PATH"** khi cài
2. Mở PowerShell:

```powershell
# --- EmoTrack Service ---
cd smile-sprout\AI\backend-emotrack

python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Cấu hình AWS credentials
$env:AWS_ACCESS_KEY_ID = "your-access-key"
$env:AWS_SECRET_ACCESS_KEY = "your-secret-key"
$env:AWS_DEFAULT_REGION = "ap-southeast-1"

# Chạy
uvicorn app:app --host 0.0.0.0 --port 8000

# --- Mapping Service (mở PowerShell mới) ---
cd smile-sprout\AI\backend-mapping

python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

uvicorn main:app --host 0.0.0.0 --port 8001
```

> **Lưu ý Windows:** Nếu gặp lỗi "Execution Policy" khi activate venv, chạy:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

#### 7. Sử dụng script tự động (Windows PowerShell)

Tương tự `start.sh` trên Linux, file `start.ps1` sẽ tự động kiểm tra dependencies → cài packages → tạo database → chạy Backend + Frontend:

```powershell
# Nếu gặp lỗi Execution Policy, chạy dòng này trước:
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# Chạy script
.\start.ps1
```

> Script sẽ tự tạo file `.env` mặc định nếu chưa có. Nhấn `Ctrl+C` để dừng tất cả services.

---

## 📁 Biến môi trường (Environment Variables)

### Backend (`support-autism-children-be/.env`)

| Biến                 | Mô tả                          | Giá trị mặc định (dev)                                    |
| -------------------- | ------------------------------- | ---------------------------------------------------------- |
| `DATABASE_URL`       | Connection string PostgreSQL    | `postgresql://postgres:postgres@localhost:5432/autismsupport` |
| `JWT_SECRET`         | Secret key cho JWT              | `smile-sprout-dev-secret-key-2026`                          |
| `JWT_ACCESS_SECRET`  | Secret cho access token         | `smile-sprout-access-secret-2026`                           |
| `JWT_REFRESH_SECRET` | Secret cho refresh token        | `smile-sprout-refresh-secret-2026`                          |
| `PORT`               | Port backend                    | `3000`                                                     |
| `CORS_ORIGIN`        | Allowed origin cho CORS         | `http://localhost:8080`                                    |

### Frontend (`smile-sprout/.env`)

| Biến               | Mô tả                       | Giá trị mặc định (dev)         |
| ------------------- | ---------------------------- | ------------------------------ |
| `VITE_API_URL`      | URL Backend API              | `http://localhost:3000/api`    |
| `VITE_AI_API_URL`   | URL AI Emotion Detection API | `http://localhost:8000`        |

---

## 📜 Các lệnh thường dùng

### Backend

```bash
npm run start:dev       # Chạy dev server (hot-reload)
npm run build           # Build production
npm run start:prod      # Chạy production
npm run lint            # Kiểm tra code style
npm run test            # Chạy unit tests
npm run test:e2e        # Chạy end-to-end tests
npm run db:reset        # Reset database (xoá data + migrate + seed lại)
npx prisma studio       # Mở Prisma Studio (GUI quản lý database)
```

### Frontend

```bash
npm run dev             # Chạy dev server (hot-reload)
npm run build           # Build production
npm run preview         # Preview bản build production
npm run lint            # Kiểm tra code style
```

### Docker

```bash
docker compose up --build -d     # Build & chạy background
docker compose up -d             # Chạy (dùng image đã build)
docker compose down              # Dừng tất cả
docker compose down -v           # Dừng & xoá volumes (bao gồm data DB)
docker compose logs -f           # Xem logs realtime
docker compose logs backend      # Xem logs backend
docker compose restart backend   # Restart 1 service
docker compose ps                # Xem trạng thái services
```

---

## 🔧 Xử lý sự cố (Troubleshooting)

### Lỗi chung

| Lỗi | Nguyên nhân | Cách sửa |
| --- | --- | --- |
| `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL chưa chạy | Ubuntu: `sudo systemctl start postgresql` · Windows: Mở **Services** → Start **postgresql-x64-16** |
| `P1001: Can't reach database` | Sai DATABASE_URL hoặc DB chưa tạo | Kiểm tra file `.env`, đảm bảo database `autismsupport` đã tồn tại |
| `EACCES permission denied` | Không có quyền ghi | Ubuntu: `sudo chown -R $USER:$USER .` · Windows: Chạy PowerShell **as Administrator** |
| Port đã bị chiếm | Service khác đang dùng port | Ubuntu: `lsof -i :3000` · Windows: `netstat -ano \| findstr :3000` rồi kill process |

### Lỗi trên Ubuntu

| Lỗi | Cách sửa |
| --- | --- |
| `node: command not found` | Cài Node.js: `curl -fsSL https://deb.nodesource.com/setup_20.x \| sudo -E bash - && sudo apt install -y nodejs` |
| `prisma migrate dev` lỗi peer authentication | Sửa `/etc/postgresql/16/main/pg_hba.conf`: đổi `peer` → `md5`, rồi `sudo systemctl restart postgresql` |
| `ENOSPC: no space left on device` khi chạy npm | Tăng inotify watches: `echo fs.inotify.max_user_watches=524288 \| sudo tee -a /etc/sysctl.conf && sudo sysctl -p` |

### Lỗi trên Windows

| Lỗi | Cách sửa |
| --- | --- |
| `'node' is not recognized` | Cài lại Node.js, **chắc chắn chọn "Add to PATH"**. Đóng và mở lại PowerShell |
| `execution of scripts is disabled` | Chạy: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` |
| `gyp ERR!` khi npm install | Cài **Build Tools**: `npm install -g windows-build-tools` hoặc cài [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) |
| Docker Desktop không start | Bật **WSL 2**: `wsl --install` trong PowerShell (Admin), restart máy |
| `bcrypt` compile error | Chạy `npm install --build-from-source` hoặc dùng `npm install bcryptjs` thay thế |

---

## 📖 Tài liệu chi tiết

- [Frontend README](./smile-sprout/README.md) – Cấu trúc frontend, components, conventions
- [Backend README](./support-autism-children-be/README.md) – API endpoints, database schema, configuration
- [Contributing Guide](./CONTRIBUTING.md) – Quy tắc làm việc nhóm
- [Developer Guide](./docs/DEVELOPER_GUIDE.md) – Hướng dẫn phát triển chi tiết
- [User Guide](./docs/USER_GUIDE.md) – Hướng dẫn sử dụng ứng dụng
- [Testing Guide](./docs/TESTING.md) – Hướng dẫn testing

---

## 👥 Nhóm phát triển

Nhóm 3 TTNM - KHMT
