# 🤝 Contributing Guide – Smile Sprout

## 📌 Quy tắc chung

1. **Không push trực tiếp lên `main`** – Tạo branch riêng → Pull Request → Code review → Merge
2. **Mỗi PR chỉ giải quyết 1 vấn đề** – Không gộp nhiều feature/fix vào 1 PR
3. **Viết commit message rõ ràng** – Theo format bên dưới

## 🌿 Branch Naming

```
<type>/<short-description>
```

| Type | Mô tả | Ví dụ |
|------|--------|-------|
| `feature/` | Tính năng mới | `feature/add-emotion-history` |
| `fix/` | Sửa bug | `fix/quiz-loading-error` |
| `refactor/` | Cải thiện code (không đổi logic) | `refactor/extract-quiz-service` |
| `docs/` | Cập nhật tài liệu | `docs/update-api-endpoints` |
| `chore/` | Cấu hình, dependencies | `chore/upgrade-nestjs-11` |

## 📝 Commit Convention

Sử dụng [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

**Ví dụ:**
```
feat(quiz): add random quiz by level endpoint
fix(auth): fix refresh token not updating localStorage
refactor(fe): extract API calls to service layer
docs(be): update API endpoints table in README
chore(deps): upgrade prisma to v6.18
```

### Types

| Type | Mô tả |
|------|--------|
| `feat` | Tính năng mới |
| `fix` | Sửa bug |
| `refactor` | Cải thiện code |
| `docs` | Tài liệu |
| `style` | Format, whitespace (không đổi logic) |
| `test` | Thêm/sửa test |
| `chore` | Build, deps, config |

### Scopes thường dùng
- `fe` – Frontend chung
- `be` – Backend chung
- `auth` – Xác thực
- `quiz` – Module quiz
- `level` – Module level
- `user` – Module user
- `deps` – Dependencies

## 🔁 Workflow làm việc

```bash
# 1. Lấy code mới nhất
git checkout main
git pull origin main

# 2. Tạo branch mới
git checkout -b feature/my-feature

# 3. Code & commit
git add .
git commit -m "feat(quiz): add quiz timer"

# 4. Push & tạo PR
git push origin feature/my-feature
# Tạo Pull Request trên GitHub/GitLab
```

## 🧪 Trước khi tạo PR

### Backend
```bash
cd support-autism-children-be
npm run build     # Phải compile thành công
npm run lint      # Không có lỗi ESLint
npm run test      # Tests phải pass
```

### Frontend
```bash
cd smile-sprout
npm run build     # Phải build thành công
npm run lint      # Không có lỗi ESLint
```

## 📐 Code Style

### TypeScript
- Sử dụng `const` thay `let` khi có thể
- Không dùng `any` – khai báo type rõ ràng
- Xóa `console.log` debug trước khi commit

### Frontend
- API calls nằm trong `src/services/`, KHÔNG gọi trực tiếp trong page
- Types nằm trong `src/types/`
- Custom hooks nằm trong `src/hooks/`
- Không sửa file trong `src/components/ui/` (shadcn auto-generated)

### Backend
- Tất cả DTOs phải có `class-validator` decorators
- Mỗi controller method phải có `@ApiOperation`, `@ApiResponse` decorators
- Sử dụng `ConfigService` thay vì `process.env` trực tiếp
- Không dùng `console.log` – dùng NestJS `Logger`

## 📂 Cấu trúc thêm file mới

### Thêm Module Backend mới
```
src/new-feature/
├── new-feature.controller.ts
├── new-feature.service.ts
├── new-feature.module.ts
├── new-feature.dto.ts
└── new-feature.entity.ts
```

### Thêm Page Frontend mới
1. Tạo file trong `src/pages/NewPage.tsx`
2. Thêm route trong `App.tsx` (wrap `ProtectedRoute` nếu cần auth)
3. Nếu cần API, tạo service trong `src/services/`
4. Nếu cần types, khai báo trong `src/types/`
