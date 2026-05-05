# 🧪 Hướng Dẫn Testing — Smile Sprout

> Tài liệu kiểm thử hệ thống đầy đủ

---

## Mục lục

1. [Tổng quan chiến lược test](#1-tổng-quan-chiến-lược-test)
2. [Backend Testing](#2-backend-testing)
3. [Frontend Testing](#3-frontend-testing)
4. [UI/UX Testing](#4-uiux-testing)
5. [Integration Testing](#5-integration-testing)
6. [Test Checklist](#6-test-checklist)

---

## 1. Tổng quan chiến lược test

### Phân tầng test

```
┌──────────────────────────────┐
│        E2E / UI Tests        │  ← Browser-based
├──────────────────────────────┤
│     Integration Tests        │  ← API + DB
├──────────────────────────────┤
│       Unit Tests             │  ← Logic functions
└──────────────────────────────┘
```

### Công cụ

| Layer | Công cụ | Mô tả |
|-------|---------|--------|
| Backend Unit | Jest | Unit test NestJS services |
| Backend E2E | SuperTest | API endpoint testing |
| Frontend Build | Vite Build | Build-time type/import checks |
| UI Manual | Browser | Visual inspection |

---

## 2. Backend Testing

### 2.1. Chạy Unit Tests

```bash
cd support-autism-children-be

# Chạy tất cả tests
npm run test

# Chạy với watch mode
npm run test:watch

# Chạy với coverage report
npm run test:cov

# Chạy E2E tests
npm run test:e2e
```

### 2.2. Test Cases — Authentication

| # | Test Case | Input | Expected |
|---|-----------|-------|----------|
| 1 | Đăng ký thành công | Valid email, password, username | 201 + tokens |
| 2 | Đăng ký email trùng | Existing email | 409 Conflict |
| 3 | Đăng ký thiếu field | Missing email | 400 Bad Request |
| 4 | Đăng nhập thành công | Valid credentials | 200 + tokens |
| 5 | Đăng nhập sai password | Wrong password | 401 Unauthorized |
| 6 | Đăng nhập email không tồn tại | Non-existing email | 401 Unauthorized |
| 7 | Truy cập protected route không có token | No Authorization header | 401 |
| 8 | Truy cập protected route với token hết hạn | Expired token | 401 |

### 2.3. Test Cases — Quiz API

| # | Test Case | Expected |
|---|-----------|----------|
| 1 | GET /api/quiz/random | 200 + Quiz with questions |
| 2 | GET /api/quiz/:id (valid) | 200 + Quiz object |
| 3 | GET /api/quiz/:id (invalid) | 404 Not Found |
| 4 | Quiz có đủ options (A,B,C,D) | All options present |
| 5 | Quiz có correctAnswer valid | correctAnswer ∈ {A,B,C,D} |

### 2.4. Test Cases — Level API

| # | Test Case | Expected |
|---|-----------|----------|
| 1 | GET /api/levels | 200 + Array of levels |
| 2 | GET /api/levels/:id | 200 + Array of quizzes |
| 3 | Level ordering by difficulty | Sorted ascending |
| 4 | Level unlock logic | Only level 1 unlocked initially |

---

## 3. Frontend Testing

### 3.1. Build Check

```bash
cd smile-sprout

# TypeScript type-check + build
npm run build

# Lint check
npm run lint
```

### 3.2. Test Cases — Routing

| # | Test Case | Action | Expected |
|---|-----------|--------|----------|
| 1 | Landing page loads | Navigate to `/` | Landing page renders |
| 2 | Auth page loads | Navigate to `/auth` | Login form renders |
| 3 | Protected route redirect | Navigate to `/home` without token | Redirect to `/` |
| 4 | Dashboard loads | Login + navigate to `/home` | Dashboard renders |
| 5 | 404 page | Navigate to `/nonexistent` | NotFound page |

### 3.3. Test Cases — Auth Flow

| # | Test Case | Action | Expected |
|---|-----------|--------|----------|
| 1 | Switch to Register | Click toggle link | Registration form shows |
| 2 | Password validation | Type weak password | Error message shows |
| 3 | Confirm password | Type mismatched password | Mismatch error shows |
| 4 | Login success | Valid credentials | Redirect to /home |
| 5 | Login failure | Wrong credentials | Error toast |
| 6 | Logout | Click logout button | Redirect to / |

### 3.4. Test Cases — Quiz

| # | Test Case | Action | Expected |
|---|-----------|--------|----------|
| 1 | Quiz loads | Navigate to /quiz | Loading → Quiz card |
| 2 | Answer correct | Click correct answer | "Chính xác! 🎉" dialog |
| 3 | Answer incorrect | Click wrong answer | "Thử lại nhé!" dialog |
| 4 | Quiz complete | Answer all questions | Result screen |
| 5 | Retry quiz | Click "Làm lại" | Quiz resets |
| 6 | Audio play | Click "Nghe hướng dẫn" | Audio plays |
| 7 | Media display | Question with image | Image renders |

### 3.5. Test Cases — Practice

| # | Test Case | Action | Expected |
|---|-----------|--------|----------|
| 1 | Camera start | Click "Bật camera" | Camera stream shows |
| 2 | Camera stop | Click "Tắt camera" | Stream stops |
| 3 | Emotion select | Click emotion card | Card highlighted |
| 4 | Auto practice | Click "Tập lần lượt" | Sequential emotions |
| 5 | Match success | Show correct face | "Tuyệt vời!" overlay |
| 6 | Match bar updates | During detection | Percentage changes |

---

## 4. UI/UX Testing

### 4.1. Nguyên tắc UI cho trẻ tự kỷ

| # | Kiểm tra | Tiêu chí |
|---|----------|----------|
| 1 | Màu sắc | Pastel, không quá tương phản |
| 2 | Font chữ | Nunito, tròn, dễ đọc |
| 3 | Kích thước nút | >= 48px min-height |
| 4 | Animation | Chậm (>= 2s), không giật |
| 5 | Text | Ngắn gọn, kèm emoji |
| 6 | Background | Không quá nhiều pattern |
| 7 | Phản hồi | Tích cực, khích lệ |
| 8 | Loading | Có indicator rõ ràng |
| 9 | Error | Không dùng màu đỏ chói |
| 10 | Navigation | Đơn giản, có nút quay lại |

### 4.2. Responsive Check

| # | Breakpoint | Thiết bị | Kiểm tra |
|---|-----------|----------|----------|
| 1 | 320px | Mobile nhỏ | Layout 1 cột, text đọc được |
| 2 | 375px | Mobile trung bình | Cards hiển thị đúng |
| 3 | 768px | Tablet | Grid 2 cột |
| 4 | 1024px | Desktop | Grid 3-4 cột |
| 5 | 1440px | Desktop lớn | Max-width container |

### 4.3. Accessibility Check

| # | Kiểm tra | Tiêu chí |
|---|----------|----------|
| 1 | Color contrast | WCAG AA (4.5:1 cho text) |
| 2 | Focus visible | Ring hiện khi tab navigate |
| 3 | Aria labels | Buttons có label mô tả |
| 4 | Keyboard nav | Tab order logic |
| 5 | Screen reader | Content có nghĩa khi đọc |

---

## 5. Integration Testing

### 5.1. Flow hoàn chỉnh

```
1. Landing Page → Click "Bắt đầu ngay"
2. Auth Page → Đăng ký tài khoản mới
3. Dashboard → Click "Trắc nghiệm vui"
4. Quiz → Trả lời tất cả câu hỏi → Xem kết quả
5. Dashboard → Click "Cấp độ học"
6. Levels → Chọn cấp độ 1 → Làm quiz
7. Dashboard → Click "Tiến trình" → Xem biểu đồ
8. Settings → Thay đổi âm lượng → Lưu
9. Logout → Về Landing Page
```

### 5.2. Database Integration

```bash
# Kiểm tra seed data
npx prisma studio

# Verify:
# - Emotions có đủ (vui, buồn, giận, ngạc nhiên...)
# - Levels có ít nhất 2 levels
# - Mỗi level có quizzes
# - Mỗi quiz có questions
# - Questions có media URLs
```

---

## 6. Test Checklist

### ✅ Pre-release Checklist

- [ ] Frontend build thành công (`npm run build`)
- [ ] Backend build thành công (`npm run build`)
- [ ] Database migrations chạy OK
- [ ] Seed data đầy đủ
- [ ] Landing page hiển thị đúng
- [ ] Auth flow hoạt động (login/register/logout)
- [ ] Dashboard hiển thị 4 options
- [ ] Quiz flow hoàn chỉnh
- [ ] Practice camera hoạt động
- [ ] Levels hiển thị danh sách
- [ ] Progress hiển thị biểu đồ
- [ ] Settings lưu được cài đặt
- [ ] Responsive trên mobile/tablet
- [ ] Màu sắc pastel (không gây kích thích)
- [ ] Font chữ Nunito load đúng
- [ ] Animations mượt, chậm
- [ ] Nút bấm >= 48px
- [ ] Error states không gây sợ
- [ ] Loading states có indicator

---

> 📝 Cập nhật lần cuối: 2026-04-27
