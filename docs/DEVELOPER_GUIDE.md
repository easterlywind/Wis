# 🛠️ Hướng Dẫn Phát Triển — Smile Sprout

> Tài liệu dành cho lập trình viên tham gia phát triển dự án

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
3. [Công nghệ sử dụng](#3-công-nghệ-sử-dụng)
4. [Thiết lập môi trường](#4-thiết-lập-môi-trường)
5. [Frontend](#5-frontend)
6. [Backend](#6-backend)
7. [Database](#7-database)
8. [API Documentation](#8-api-documentation)
9. [Design System](#9-design-system)
10. [Quy ước code](#10-quy-ước-code)

---

## 1. Tổng quan kiến trúc

```
                    ┌──────────────────┐
                    │   Browser/User   │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
    ┌─────────▼────┐  ┌─────▼──────┐  ┌────▼─────┐
    │   Frontend   │  │  Backend   │  │   AI API  │
    │ React + Vite │  │  NestJS    │  │ FastAPI   │
    │  Port: 8080  │  │ Port: 3000 │  │ Port:8000 │
    └──────────────┘  └──────┬─────┘  └──────────┘
                             │
                    ┌────────▼─────────┐
                    │   PostgreSQL     │
                    │   Port: 5432     │
                    └──────────────────┘
```

## 2. Cấu trúc thư mục

```
KHMT/
├── smile-sprout/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/            # Hình ảnh, icons
│   │   ├── components/        # React components
│   │   │   ├── ui/            # Shadcn UI components
│   │   │   ├── EmotionCard.tsx
│   │   │   ├── LevelCard.tsx
│   │   │   ├── QuizCard.tsx
│   │   │   └── ProgressCard.tsx
│   │   ├── hooks/             # React hooks (useAuth)
│   │   ├── lib/               # Utilities (axios, auth, validation)
│   │   ├── pages/             # Page components
│   │   │   ├── LandingPage.tsx  # Trang giới thiệu (/)
│   │   │   ├── Auth.tsx         # Đăng nhập/Đăng ký
│   │   │   ├── Dashboard.tsx    # Trang chủ sau đăng nhập
│   │   │   ├── Quiz.tsx         # Trắc nghiệm cảm xúc
│   │   │   ├── Practice.tsx     # Luyện biểu cảm
│   │   │   ├── Levels.tsx       # Cấp độ
│   │   │   ├── QuizLevel.tsx    # Quiz trong level
│   │   │   ├── Progress.tsx     # Tiến trình
│   │   │   └── Settings.tsx     # Cài đặt
│   │   ├── services/          # API service layer
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx            # Routes
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Design system CSS
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
├── support-autism-children-be/  # Backend (NestJS)
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # Users module
│   │   ├── quiz/              # Quiz module
│   │   ├── question/          # Question module
│   │   ├── level/             # Level module
│   │   ├── prisma/            # Prisma service
│   │   ├── middleware/        # Middlewares
│   │   └── main.ts            # Entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.ts            # Seed data
│   │   └── migrations/        # DB migrations
│   ├── media_emotion/         # Emotion media files
│   └── media_question/        # Question media files
│
├── docs/                      # Documentation
├── docker-compose.yml
└── start.sh
```

## 3. Công nghệ sử dụng

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|------------|-----------|----------|
| React | 18.x | UI framework |
| Vite | 5.x | Build tool |
| TypeScript | 5.x | Type safety |
| TailwindCSS | 3.x | Styling |
| Shadcn UI | latest | Component library |
| React Router | 6.x | Routing |
| TanStack Query | 5.x | Data fetching |
| Recharts | 2.x | Charts |
| Axios | 1.x | HTTP client |
| Sonner | 1.x | Toast notifications |

### Backend
| Công nghệ | Phiên bản | Mục đích |
|------------|-----------|----------|
| NestJS | 11.x | API framework |
| Prisma | 6.x | ORM |
| PostgreSQL | 16.x | Database |
| Passport + JWT | latest | Authentication |
| Swagger | latest | API documentation |

## 4. Thiết lập môi trường

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

### Environment Variables

**Backend** (`support-autism-children-be/.env`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/autismsupport"
JWT_SECRET="smile-sprout-dev-secret-key-2026"
JWT_ACCESS_SECRET="smile-sprout-access-secret-2026"
JWT_REFRESH_SECRET="smile-sprout-refresh-secret-2026"
PORT=3000
CORS_ORIGIN="http://localhost:8080"
```

**Frontend** (`smile-sprout/.env`):
```env
VITE_API_URL=http://localhost:3000/api
VITE_AI_API_URL=http://localhost:8000
```

## 5. Frontend

### Routing

| Path | Component | Auth | Mô tả |
|------|-----------|------|--------|
| `/` | LandingPage | ❌ | Trang giới thiệu |
| `/auth` | Auth | ❌ | Đăng nhập/Đăng ký |
| `/home` | Dashboard | ✅ | Trang chủ |
| `/quiz` | Quiz | ✅ | Trắc nghiệm |
| `/practice` | Practice | ✅ | Luyện biểu cảm |
| `/levels` | Levels | ✅ | Danh sách cấp độ |
| `/levels/:id` | QuizLevel | ✅ | Quiz trong level |
| `/progress` | Progress | ✅ | Tiến trình |
| `/settings` | Settings | ✅ | Cài đặt |

### Authentication Flow
1. User đăng nhập → API trả về `accessToken` + `refreshToken`
2. Token lưu vào `localStorage`
3. `ProtectedRoute` kiểm tra token → redirect nếu chưa đăng nhập
4. Axios interceptor tự động gắn Bearer token

### State Management
- **React Query** cho server state (quiz, levels, etc.)
- **useState/useEffect** cho local state
- **localStorage** cho auth tokens

## 6. Backend

### Modules

| Module | Mô tả |
|--------|--------|
| `auth` | JWT authentication, login/register |
| `users` | User CRUD |
| `quiz` | Quiz management, random quiz |
| `question` | Question management |
| `level` | Level management |
| `prisma` | Prisma ORM service |

### API Prefix: `/api`

Tất cả API endpoints đều có prefix `/api`.

## 7. Database

### Schema chính

- **User** — Người dùng (trẻ/phụ huynh)
- **Emotion** — Cảm xúc (vui, buồn, giận, ngạc nhiên...)
- **Level** — Cấp độ học
- **Quiz** — Bộ quiz thuộc level
- **Question** — Câu hỏi (image/video/audio/text)
- **AttemptQuiz** — Lịch sử làm quiz
- **AttemptLevel** — Lịch sử làm level
- **Practice** — Lịch sử luyện biểu cảm
- **UnlockedLevel** — Level đã mở khóa

### Commands

```bash
# Tạo migration
npx prisma migrate dev --name <tên>

# Chạy migration
npx prisma migrate deploy

# Generate client
npx prisma generate

# Reset DB
npx prisma migrate reset --force

# Seed data
npx ts-node prisma/seed.ts

# Prisma Studio (GUI)
npx prisma studio
```

## 8. API Documentation

- Swagger UI: http://localhost:3000/swagger
- Tự động generated từ NestJS decorators

## 9. Design System

### Nguyên tắc cho trẻ tự kỷ

1. **Màu pastel** — Không dùng màu quá sáng/tương phản cao
2. **Border radius lớn** — Mọi thứ tròn, mềm mại (1.25rem default)
3. **Font Nunito** — Chữ tròn, dễ đọc
4. **Touch targets ≥ 48px** — Nút bấm to
5. **Animations chậm** — Không gây giật, 3-4s/cycle
6. **Emoji thay text** — Giảm cognitive load

### CSS Variables

Xem `smile-sprout/src/index.css` cho toàn bộ design tokens:
- `--primary`: Coral-peach pastel
- `--secondary`: Teal pastel
- `--success`: Green pastel
- `--accent`: Sunshine yellow
- `--gradient-*`: Soft gradient utilities

### TailwindCSS Classes

| Class | Mục đích |
|-------|----------|
| `.app-bg` | Background toàn trang |
| `.gradient-primary` | Primary gradient |
| `.gradient-secondary` | Secondary gradient |
| `.gradient-success` | Success gradient |
| `.shadow-soft` | Shadow nhẹ |
| `.shadow-hover` | Shadow cho hover |
| `.shadow-glow` | Glow effect |
| `.animate-bounce-gentle` | Bounce chậm |
| `.animate-float` | Float lên xuống |
| `.animate-scale-in` | Scale entrance |
| `.animate-fade-in-up` | Fade + slide up |
| `.btn-friendly` | Nút thân thiện |
| `.card-friendly` | Card thân thiện |

## 10. Quy ước code

### Naming
- Components: `PascalCase` (e.g., `EmotionCard.tsx`)
- Hooks: `camelCase` with `use` prefix (e.g., `useAuth.ts`)
- Services: `camelCase` with `.service.ts` suffix
- Types: `PascalCase` interface/type names

### File organization
- Mỗi page 1 file trong `pages/`
- Mỗi component tái sử dụng trong `components/`
- UI primitives trong `components/ui/`
- Business logic trong `hooks/` và `services/`

### Comments
- Tiếng Việt hoặc Tiếng Anh (nhất quán trong file)
- JSDoc cho functions phức tạp
- Inline comment cho logic khó hiểu

---

> 📝 Cập nhật lần cuối: 2026-04-27
