# 🌱 Smile Sprout

**Smile Sprout** là một ứng dụng toàn diện giúp trẻ tự kỷ nhận biết và biểu đạt cảm xúc, kết hợp giữa học tập, trò chơi tương tác và không gian sáng tạo. 

Hệ thống được thiết kế linh hoạt với kiến trúc Client-Server:
- **Frontend**: React + Vite + TailwindCSS.
- **Backend**: NestJS + Prisma ORM.
- **Database**: PostgreSQL.
- **Deployment**: Docker Compose.

---

## 📑 Mục Lục
- [📋 Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [🚀 Hướng Dẫn Cài Đặt (Cho cả Windows & Ubuntu)](#-hướng-dẫn-cài-đặt-cho-cả-windows--ubuntu)
- [🛠️ Các Lệnh Docker Thường Dùng](#️-các-lệnh-docker-thường-dùng)
- [🗄️ Database & Seed Data](#️-database--seed-data)
- [📝 Cấu Trúc Thư Mục Chính](#-cấu-trúc-thư-mục-chính)
- [🛑 Khắc phục sự cố (Troubleshooting)](#-khắc-phục-sự-cố-troubleshooting)

---

## 📋 Yêu Cầu Hệ Thống

Để chạy source code nhanh chóng và không gặp lỗi môi trường, dự án sử dụng **Docker**.
Hãy đảm bảo máy tính của bạn đã cài đặt các phần mềm sau:

- **Docker Desktop** (dành cho Windows/Mac) hoặc **Docker Engine** (dành cho Linux).
- **Docker Compose** (thường đã được tích hợp sẵn cùng Docker Desktop).
- **Git** (để clone mã nguồn).

---

## 🚀 Hướng Dẫn Cài Đặt (Cho cả Windows & Ubuntu)

Mọi thao tác khởi chạy và cấu hình đều được tự động hóa thông qua Docker. Bạn chỉ cần thực hiện 3 bước đơn giản sau:

### Bước 1: Tải mã nguồn về máy
Mở Terminal (trên Ubuntu) hoặc Command Prompt / PowerShell (trên Windows) và gõ:
```bash
git clone https://github.com/easterlywind/Wis.git
```

### Bước 2: Khởi chạy hệ thống bằng Docker
Trong thư mục gốc của dự án (nơi chứa file `docker-compose.yml`), chạy lệnh sau:
```bash
docker compose up -d --build
```
> **Lưu ý**: Lệnh này sẽ tải các images cần thiết (Postgres, Nodejs) và tự động cài đặt các thư viện (npm install), tạo database, thực thi migrate, và build code. Quá trình này có thể mất từ 2-5 phút trong lần chạy đầu tiên.

### Bước 3: Kiểm tra trạng thái
Kiểm tra xem tất cả các container đã hoạt động (trạng thái `Up` hoặc `Running`) bằng lệnh:
```bash
docker compose ps
```

Nếu thành công, bạn có thể truy cập các dịch vụ tại:
- 🌐 **Frontend (Giao diện người dùng):** [http://localhost:8080](http://localhost:8080)
- 🔧 **Backend API:** [http://localhost:3000/api](http://localhost:3000/api)
- 📚 **Swagger Docs (Tài liệu API):** [http://localhost:3000/api/docs](http://localhost:3000/api/docs) *(nếu đã cấu hình swagger)*

---

## 🛠️ Các Lệnh Docker Thường Dùng

- **Xem log hệ thống (để debug):**
  ```bash
  docker compose logs -f
  ```
  *(Để xem log của riêng backend: `docker compose logs -f backend`)*

- **Dừng hệ thống:**
  ```bash
  docker compose stop
  ```

- **Khởi động lại hệ thống:**
  ```bash
  docker compose start
  ```

- **Dừng và xóa hoàn toàn containers (không xóa dữ liệu DB):**
  ```bash
  docker compose down
  ```

- **Xóa hoàn toàn cả dữ liệu Database (Reset sạch):**
  ```bash
  docker compose down -v
  ```

---

## 🗄️ Database & Seed Data

Docker Compose đã cấu hình sẵn PostgreSQL. Khi backend khởi chạy, nó tự động chạy script `npx prisma migrate deploy` và `npx prisma db seed` (qua script trong Dockerfile hoặc `main.ts` setup) để nạp sẵn dữ liệu mẫu về các cảm xúc (Vui vẻ, Buồn bã, Giận dữ...) và bộ câu hỏi cho ứng dụng.

Nếu bạn cần truy cập trực tiếp vào DB để kiểm tra dữ liệu:
- **Host**: `localhost`
- **Port**: `5433` *(đã map từ 5432 của container ra host qua file docker-compose.yml)*
- **User**: `postgres`
- **Password**: `postgres`
- **Database**: `autismsupport`

Bạn có thể dùng các tool như DBeaver, pgAdmin hoặc DataGrip để kết nối.

---

## 📝 Cấu Trúc Thư Mục Chính

```
KHMT/
│
├── smile-sprout/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/            # Các UI component tái sử dụng
│   │   ├── pages/                 # Các trang chính (Dashboard, Practice, Draw...)
│   │   └── ...
│
├── support-autism-children-be/    # Backend (NestJS)
│   ├── prisma/                    # Schema cơ sở dữ liệu và files Seed
│   ├── src/                       # Logic modules (Auth, Game, Story, Drawing)
│   └── ...
│
├── docker-compose.yml             # Cấu hình orchestration
└── README.md                      # Tài liệu này
```

---

## 🛑 Khắc phục sự cố (Troubleshooting)

1. **Lỗi cổng (Port already in use):**
   Nếu cổng `8080` hoặc `3000` hoặc `5433` đã bị chiếm, hãy tắt các phần mềm đang dùng cổng này, hoặc sửa file `docker-compose.yml` để map ra port khác (Ví dụ: `8081:80`).

2. **Lỗi Database không đồng bộ:**
   Nếu bạn thay đổi file `schema.prisma` và gặp lỗi database, hãy truy cập vào shell của container backend để migrate lại:
   ```bash
   docker compose exec backend sh
   npx prisma migrate dev
   ```

3. **Lỗi trên Windows (CRLF vs LF):**
   Nếu Windows báo lỗi liên quan tới file script `\r`, hãy đảm bảo Git của bạn set autocrlf đúng cách, hoặc sử dụng WSL2 làm môi trường chạy Docker sẽ mượt mà hơn.
