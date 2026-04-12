# 🌱 Smile Sprout – Backend API

> NestJS 11 + Prisma ORM + PostgreSQL + JWT Authentication + Swagger

## 📁 Cấu trúc thư mục

```
src/
├── auth/                   # Module xác thực
│   ├── dto/
│   │   └── auth.dto.ts     # SignUpDto, SignInDto, RefreshTokenDto
│   ├── auth.controller.ts  # POST /auth/register, /auth/login, /auth/logout
│   ├── auth.module.ts      # Module config (JWT, Passport)
│   └── auth.service.ts     # Logic xác thực, token management
├── level/                  # Module quản lý cấp độ
│   ├── level.controller.ts # CRUD levels + unlock
│   ├── level.dtos.ts       # CreateLevelDto, UnlockLevel
│   ├── level.entity.ts     # Swagger entity
│   ├── level.module.ts
│   └── level.service.ts
├── middleware/
│   └── auth.middleware.ts  # JWT verification middleware
├── prisma/                 # Prisma DB service
│   ├── prisma.module.ts    # Global module
│   └── prisma.service.ts   # PrismaClient wrapper
├── question/               # Module câu hỏi
│   ├── question.controller.ts
│   ├── question.dto.ts     # CreateQuestionDto
│   ├── question.entity.ts  # Swagger entity
│   ├── question.module.ts
│   └── question.service.ts
├── quiz/                   # Module quiz
│   ├── quiz.controller.ts  # CRUD quiz + random quiz
│   ├── quiz.dto.ts         # CreateQuizDto
│   ├── quiz.entity.ts      # Swagger entity
│   ├── quiz.module.ts
│   └── quiz.service.ts
├── users/                  # Module người dùng
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── entities/
│   ├── users.controller.ts # CRUD users (RESTful)
│   ├── users.module.ts
│   └── users.service.ts
├── app.controller.ts       # Root controller
├── app.module.ts           # Root module
├── app.service.ts
└── main.ts                 # Bootstrap (CORS, Swagger, ValidationPipe)
```

## 🔧 Environment

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

| Biến | Mô tả | Default |
|------|--------|---------|
| `DATABASE_URL` | PostgreSQL connection string | (required) |
| `JWT_SECRET` | JWT signing secret (fallback chung) | `secret_key` |
| `JWT_ACCESS_SECRET` | Secret riêng cho access token | = `JWT_SECRET` |
| `JWT_REFRESH_SECRET` | Secret riêng cho refresh token | = `JWT_SECRET` |
| `PORT` | Server port | `3000` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:8080` |

## 🏃 Scripts

```bash
npm run start:dev      # Development (watch mode)
npm run start          # Production start
npm run build          # Compile TypeScript
npm run lint           # ESLint
npm run format         # Prettier format
npm run test           # Unit tests
npm run test:e2e       # E2E tests

# Database
npm run db:reset       # Reset DB + migrate + seed
npx prisma studio     # GUI database browser
```

## 🗄️ Database Schema

```
User ──┬── UnlockedLevel ── Level ──── Quiz ──── Question ── Emotion
       ├── AttemptQuiz ──── Quiz
       ├── AttemptLevel ─── Level
       └── Practice ─────── Emotion
```

### Models chính

| Model | Mô tả |
|-------|--------|
| **User** | Người dùng (name, email, password, points, streak...) |
| **Emotion** | Cảm xúc (name, icon, video, hint) |
| **Level** | Cấp độ (difficulty, requiredPoints) |
| **Quiz** | Bộ câu hỏi thuộc 1 level |
| **Question** | Câu hỏi (image/video/audio/text, 4 options, correctAnswer) |
| **AttemptQuiz** | Lịch sử làm quiz (maxScore, attemptsCount) |
| **Practice** | Lịch sử luyện tập biểu cảm |

## 🔌 API Endpoints

### Auth (`/api/auth`)
| Method | Path | Mô tả |
|--------|------|--------|
| POST | `/auth/register` | Đăng ký tài khoản |
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/logout` | Đăng xuất |

### Users (`/api/users`) – Yêu cầu token
| Method | Path | Mô tả |
|--------|------|--------|
| POST | `/users` | Tạo user mới |
| GET | `/users` | Lấy tất cả users |
| GET | `/users/:id` | Lấy user theo ID |
| PATCH | `/users/:id` | Cập nhật user |
| DELETE | `/users/:id` | Xóa user |

### Levels (`/api/levels`) – Yêu cầu token
| Method | Path | Mô tả |
|--------|------|--------|
| POST | `/levels` | Tạo level |
| POST | `/levels/unlock` | Mở khóa level cho user |
| GET | `/levels` | Lấy tất cả levels (kèm trạng thái unlock) |
| GET | `/levels/:id` | Lấy quizzes trong level |

### Quiz (`/api/quiz`) – Yêu cầu token
| Method | Path | Mô tả |
|--------|------|--------|
| POST | `/quiz` | Tạo quiz |
| GET | `/quiz` | Lấy danh sách quiz (có pagination) |
| GET | `/quiz/random` | Lấy quiz ngẫu nhiên |
| GET | `/quiz/:id` | Lấy quiz theo ID (kèm questions) |
| GET | `/quiz/level/:levelId/random` | Quiz ngẫu nhiên trong level |

### Questions (`/api/questions`) – Yêu cầu token
| Method | Path | Mô tả |
|--------|------|--------|
| POST | `/questions` | Tạo câu hỏi |
| GET | `/questions` | Lấy tất cả câu hỏi |
| GET | `/questions/quiz/:quizId` | Lấy câu hỏi theo quiz |
| GET | `/questions/:id` | Lấy câu hỏi theo ID |

### Swagger
Truy cập `http://localhost:3000/swagger` để xem API docs với giao diện tương tác.

## 🛡️ Authentication

- Sử dụng **JWT** (JSON Web Token)
- **Access token**: hết hạn sau 15 phút
- **Refresh token**: hết hạn sau 7 ngày
- Middleware `AuthMiddleware` xác thực token cho tất cả routes (trừ `/auth/*`)
- Token được truyền qua header `Authorization: Bearer <token>`

## 🧩 Conventions

### DTO Validation
- Tất cả DTOs phải có `class-validator` decorators
- `ValidationPipe` (global) – auto validate & transform incoming requests
- `whitelist: true` – loại bỏ properties không khai báo trong DTO

### Module Pattern
- Mỗi feature là 1 NestJS module: `controller` + `service` + `dto` + `entity`
- `PrismaModule` là global module, inject được ở bất kỳ đâu

### Naming
- **Controller**: `feature.controller.ts`
- **Service**: `feature.service.ts`
- **DTO**: `feature.dto.ts` hoặc `dto/create-feature.dto.ts`
- **Entity** (Swagger): `feature.entity.ts`
