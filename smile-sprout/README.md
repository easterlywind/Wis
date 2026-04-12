# 🌱 Smile Sprout – Frontend

> React + Vite + TypeScript + TailwindCSS + shadcn/ui

## 📁 Cấu trúc thư mục

```
src/
├── assets/                 # Hình ảnh, icons
├── components/             # React components
│   ├── ui/                 # shadcn/ui components (auto-generated)
│   ├── EmotionCard.tsx     # Card hiển thị cảm xúc
│   ├── ErrorBoundary.tsx   # Global error boundary
│   ├── LevelCard.tsx       # Card hiển thị level
│   ├── ProgressCard.tsx    # Card tiến trình
│   ├── ProtectedRoute.tsx  # Route guard (yêu cầu đăng nhập)
│   └── QuizCard.tsx        # Card quiz
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts          # Hook xác thực (login/register/logout)
│   ├── use-mobile.tsx      # Hook detect mobile device
│   └── use-toast.ts        # Hook toast notifications
├── lib/                    # Utilities & core logic
│   ├── apiRetry.ts         # Retry helper cho API calls
│   ├── auth.api.ts         # Auth API endpoints (login, register, refresh)
│   ├── auth-session.ts     # Session management (localStorage)
│   ├── auth-validation.ts  # Validation rules (email, password, birthDate)
│   ├── axios.ts            # Axios instance + interceptors
│   └── utils.ts            # Tiện ích chung (cn, detectMediaType)
├── pages/                  # Page components (1 page = 1 route)
│   ├── Auth.tsx            # Trang đăng nhập / đăng ký
│   ├── Dashboard.tsx       # Trang chủ (menu chính)
│   ├── Levels.tsx          # Danh sách cấp độ
│   ├── NotFound.tsx        # 404
│   ├── Practice.tsx        # Luyện biểu cảm qua camera
│   ├── Progress.tsx        # Tiến trình học tập
│   ├── Quiz.tsx            # Chơi quiz (trắc nghiệm)
│   ├── QuizLevel.tsx       # Danh sách quiz trong 1 level
│   └── Settings.tsx        # Cài đặt
├── services/               # API service layer
│   ├── index.ts            # Barrel export
│   ├── level.service.ts    # Level API calls
│   ├── quiz.service.ts     # Quiz API calls
│   └── user.service.ts     # User API calls
├── types/                  # TypeScript type definitions
│   ├── emotion.ts          # Emotion types + helpers
│   ├── level.ts            # Level interface
│   ├── question.ts         # Question & AnswerChoice types
│   └── quiz.ts             # Quiz interface
├── App.tsx                 # Root component + routing
├── App.css                 # App-level styles
├── index.css               # Global styles + CSS variables
├── main.tsx                # Entry point
└── vite-env.d.ts           # Vite env types
```

## 🔧 Environment

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

| Biến | Mô tả | Default |
|------|--------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000/api` |
| `VITE_AI_API_URL` | AI emotion detection API URL | `http://localhost:8000` |

## 🏃 Scripts

```bash
npm run dev        # Chạy development server (port 8080)
npm run build      # Build production
npm run lint       # Kiểm tra ESLint
npm run preview    # Preview production build
```

## 🧩 Conventions

### Routing
- Routes được khai báo tập trung trong `App.tsx`
- Tất cả routes (trừ `/` Auth) được wrap bởi `ProtectedRoute`
- Path pattern: `/feature` (không nested, flat routing)

### API Calls
- **KHÔNG** gọi `api.get/post` trực tiếp trong page components
- Sử dụng service layer trong `src/services/`
- Mỗi domain (quiz, level, user) có file service riêng

### Types
- Tất cả TypeScript interfaces/types nằm trong `src/types/`
- Import bằng `@/types/...`

### Components
- `src/components/ui/` – shadcn/ui (KHÔNG chỉnh sửa trực tiếp)
- `src/components/` – Custom components của project
- Pages trong `src/pages/` – Mỗi file = 1 route

## 🛡️ Authentication Flow

```
1. User đăng nhập/ký → POST /auth/login hoặc /auth/register
2. Server trả về { accessToken, refreshToken, user }
3. Frontend lưu vào localStorage qua saveSession()
4. Axios interceptor tự gắn Bearer token vào mỗi request
5. Khi token hết hạn (401) → tự refresh bằng refreshToken
6. Nếu refresh thất bại → clearSession() & redirect về /
```

## 📦 Tech Stack

- **React 18** – UI library
- **Vite 5** – Build tool
- **TypeScript** – Type safety
- **TailwindCSS 3** – Utility-first CSS
- **shadcn/ui** – UI component library (Radix UI based)
- **React Router 6** – Client-side routing
- **TanStack Query** – Data fetching & caching
- **Axios** – HTTP client
- **Zod** – Schema validation
- **Recharts** – Charts library
- **Sonner** – Toast notifications
- **Lucide React** – Icons
