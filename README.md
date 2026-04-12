# 🌱 Smile Sprout

> Ứng dụng hỗ trợ trẻ tự kỷ nhận biết và luyện tập biểu đạt cảm xúc.

## 📋 Tổng quan

Smile Sprout là nền tảng học tập tương tác giúp trẻ em mắc chứng tự kỷ:
- **Nhận biết cảm xúc** qua hình ảnh, video, âm thanh (quiz trắc nghiệm)
- **Luyện biểu đạt cảm xúc** qua camera với AI nhận diện khuôn mặt
- **Theo dõi tiến trình** học tập và phát triển của trẻ

## 🏗️ Kiến trúc

```
KHMT/
├── smile-sprout/                  # Frontend (React + Vite + TypeScript)
├── support-autism-children-be/    # Backend (NestJS + Prisma + PostgreSQL)
└── README.md                      # File này
```

| Thành phần | Tech Stack | Port |
|-----------|------------|------|
| **Frontend** | React 18, Vite, TypeScript, TailwindCSS, shadcn/ui | `8080` |
| **Backend API** | NestJS 11, Prisma ORM, PostgreSQL, JWT Auth, Swagger | `3000` |
| **AI Service** | (External) API nhận diện cảm xúc qua ảnh | `8000` |

## 🚀 Quick Start

### Yêu cầu
- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14
- **npm** hoặc **bun**

### 1. Clone & Setup Backend

```bash
cd support-autism-children-be

# Tạo file .env từ .env.example
cp .env.example .env
# Sửa DATABASE_URL, JWT_SECRET, ... trong .env

# Cài dependencies
npm install

# Tạo database schema & seed data
npx prisma migrate dev
npx prisma generate
npx ts-node prisma/seed.ts

# Chạy
npm run start:dev
```

Backend sẽ chạy tại `http://localhost:3000/api`  
Swagger docs tại `http://localhost:3000/swagger`

### 2. Setup Frontend

```bash
cd smile-sprout

# Tạo file .env từ .env.example
cp .env.example .env

# Cài dependencies
npm install

# Chạy
npm run dev
```

Frontend sẽ chạy tại `http://localhost:8080`

## 📖 Tài liệu chi tiết

- [Frontend README](./smile-sprout/README.md) – Cấu trúc frontend, components, conventions
- [Backend README](./support-autism-children-be/README.md) – API endpoints, database schema, configuration
- [Contributing Guide](./CONTRIBUTING.md) – Quy tắc làm việc nhóm

## 👥 Nhóm phát triển

Nhóm 3 TTNM - KHMT
# Wis
