# 🚀 Đề Xuất Cải Tiến — Smile Sprout

> Tài liệu tổng hợp các cải tiến tiềm năng cho ứng dụng

---

## Mục lục

1. [Cải tiến UI/UX](#1-cải-tiến-uiux)
2. [Cải tiến tính năng](#2-cải-tiến-tính-năng)
3. [Cải tiến kỹ thuật](#3-cải-tiến-kỹ-thuật)
4. [Cải tiến AI/ML](#4-cải-tiến-aiml)
5. [Cải tiến cho phụ huynh/giáo viên](#5-cải-tiến-cho-phụ-huynhgiáo-viên)
6. [Roadmap đề xuất](#6-roadmap-đề-xuất)

---

## 1. Cải tiến UI/UX

### 1.1. Giao diện

| # | Cải tiến | Ưu tiên | Mô tả |
|---|----------|---------|--------|
| 1 | 🎨 **Dark mode cho trẻ nhạy sáng** | Cao | Một số trẻ tự kỷ nhạy cảm với ánh sáng, dark mode giúp giảm kích thích |
| 2 | 🖼️ **Hệ thống avatar** | Trung bình | Cho trẻ chọn/tùy biến avatar, tăng tính cá nhân hóa |
| 3 | 🎵 **Nhạc nền nhẹ nhàng** | Trung bình | Nhạc ambient giúp trẻ thư giãn trong khi học |
| 4 | 📱 **PWA (Progressive Web App)** | Cao | Cho phép "cài" app trên điện thoại, dùng offline |
| 5 | ⌨️ **Keyboard shortcuts** | Thấp | Phím tắt cho phụ huynh |
| 6 | 🌈 **Chế độ màu tùy chỉnh** | Cao | Cho phụ huynh tùy chỉnh bảng màu phù hợp trẻ |

### 1.2. Trải nghiệm

| # | Cải tiến | Ưu tiên | Mô tả |
|---|----------|---------|--------|
| 1 | 🎯 **Onboarding tutorial** | Cao | Hướng dẫn tương tác lần đầu sử dụng |
| 2 | 🏅 **Hệ thống reward** | Cao | Stickers, badges, điểm thưởng tương tác |
| 3 | 📢 **Text-to-Speech** | Cao | Đọc to câu hỏi/hướng dẫn cho trẻ chưa biết đọc |
| 4 | 🔔 **Daily reminder** | Trung bình | Nhắc nhở luyện tập hàng ngày |
| 5 | 🎮 **Gamification** | Cao | Thêm yếu tố game: streak, leaderboard (riêng tư) |

---

## 2. Cải tiến tính năng

### 2.1. Tính năng mới

| # | Tính năng | Ưu tiên | Mô tả |
|---|-----------|---------|--------|
| 1 | 📖 **Story mode** | Cao | Kể chuyện tình huống, trẻ nhận diện cảm xúc nhân vật |
| 2 | 🎬 **Video lessons** | Cao | Video ngắn dạy về từng cảm xúc |
| 3 | 🤝 **Social scenarios** | Trung bình | Mô phỏng tình huống xã hội, dạy cách phản ứng |
| 4 | ✏️ **Drawing mode** | Trung bình | Vẽ khuôn mặt cảm xúc bằng tay |
| 5 | 🎤 **Voice recognition** | Thấp | Nhận diện giọng nói để phát hiện cảm xúc |
| 6 | 👥 **Multi-child profiles** | Cao | Một tài khoản phụ huynh, nhiều profile trẻ |
| 7 | 📅 **Lịch học** | Trung bình | Calendar xem lịch sử & lịch học |

### 2.2. Cải tiến Quiz

| # | Cải tiến | Mô tả |
|---|----------|--------|
| 1 | 🔀 **Adaptive difficulty** | Tự điều chỉnh độ khó theo trình độ trẻ |
| 2 | 💡 **Hint system** | Gợi ý khi trẻ trả lời sai nhiều lần |
| 3 | 📝 **Giải thích đáp án** | Sau mỗi câu, hiện giải thích vì sao đúng/sai |
| 4 | ⏱️ **Không giới hạn thời gian** | Bỏ thời gian, trẻ tự kỷ cần thời gian suy nghĩ |
| 5 | 🔄 **Spaced repetition** | Ôn lại câu sai theo thuật toán lặp lại ngắt quãng |

### 2.3. Cải tiến Practice

| # | Cải tiến | Mô tả |
|---|----------|--------|
| 1 | 🪞 **Mirror mode** | Hiện khuôn mặt mẫu bên cạnh camera |
| 2 | 📹 **Record & replay** | Ghi lại video luyện tập để xem lại |
| 3 | 🎯 **Step-by-step guide** | Hướng dẫn từng bước: "Nâng lông mày", "Mở miệng"... |
| 4 | 📊 **History** | Lưu lịch sử luyện tập theo ngày |

---

## 3. Cải tiến kỹ thuật

### 3.1. Frontend

| # | Cải tiến | Mô tả |
|---|----------|--------|
| 1 | 🧩 **Code splitting** | Lazy load pages để giảm bundle size |
| 2 | 💾 **Offline support** | Service Worker + IndexedDB cache |
| 3 | 🔄 **State management** | Zustand/Jotai thay useState cho global state |
| 4 | 🧪 **Unit tests** | Vitest + React Testing Library |
| 5 | 📏 **E2E tests** | Playwright cho automated browser testing |
| 6 | 🌐 **i18n** | React-intl cho đa ngôn ngữ thực sự |

### 3.2. Backend

| # | Cải tiến | Mô tả |
|---|----------|--------|
| 1 | 🔐 **Refresh token rotation** | Bảo mật hơn với token rotation |
| 2 | 📧 **Email verification** | Xác minh email khi đăng ký |
| 3 | 🔒 **Rate limiting** | Chống brute force login |
| 4 | 📊 **Analytics API** | API thống kê chi tiết cho phụ huynh |
| 5 | 🗃️ **Redis caching** | Cache quiz/questions cho performance |
| 6 | 📝 **Audit logging** | Ghi log hoạt động cho phụ huynh xem |

### 3.3. DevOps

| # | Cải tiến | Mô tả |
|---|----------|--------|
| 1 | 🐳 **Docker optimization** | Multi-stage builds, alpine images |
| 2 | 🔄 **CI/CD** | GitHub Actions cho auto test + deploy |
| 3 | 📊 **Monitoring** | Sentry error tracking |
| 4 | 🌐 **CDN** | Media files serve qua CDN |

---

## 4. Cải tiến AI/ML

| # | Cải tiến | Ưu tiên | Mô tả |
|---|----------|---------|--------|
| 1 | 🧠 **Model accuracy** | Cao | Fine-tune model nhận diện cảm xúc trên data trẻ |
| 2 | 📊 **Confidence calibration** | Trung bình | Calibrate confidence scores chính xác hơn |
| 3 | 🎭 **More emotions** | Trung bình | Thêm cảm xúc: sợ hãi, ghê tởm, bình tĩnh |
| 4 | 👤 **Face landmark** | Thấp | Hiện landmarks trên khuôn mặt (lông mày, miệng) |
| 5 | 📹 **Real-time feedback** | Cao | Phản hồi theo thời gian thực thay vì 1.5s interval |
| 6 | 🗣️ **Multimodal** | Thấp | Kết hợp giọng nói + khuôn mặt để phân tích cảm xúc |

---

## 5. Cải tiến cho phụ huynh/giáo viên

| # | Cải tiến | Ưu tiên | Mô tả |
|---|----------|---------|--------|
| 1 | 📊 **Dashboard phụ huynh** | Cao | Trang riêng cho phụ huynh xem chi tiết tiến trình |
| 2 | 📋 **Báo cáo tuần** | Cao | Email báo cáo tiến trình hàng tuần |
| 3 | ⚙️ **Difficulty control** | Trung bình | Phụ huynh chọn độ khó phù hợp |
| 4 | 📞 **Community** | Thấp | Forum/group cho phụ huynh chia sẻ kinh nghiệm |
| 5 | 🎓 **Resources** | Trung bình | Thư viện tài liệu về hỗ trợ trẻ tự kỷ |
| 6 | 👨‍🏫 **Teacher mode** | Trung bình | Chế độ cho giáo viên quản lý nhiều trẻ |

---

## 6. Roadmap đề xuất

### Phase 1 (1-2 tháng) — Ưu tiên cao
- [ ] PWA support (offline + install)
- [ ] Text-to-Speech cho câu hỏi
- [ ] Hệ thống reward (badges, stickers)
- [ ] Dark mode
- [ ] Multi-child profiles
- [ ] Onboarding tutorial

### Phase 2 (3-4 tháng) — Trung bình
- [ ] Story mode
- [ ] Video lessons
- [ ] Adaptive difficulty
- [ ] Dashboard phụ huynh
- [ ] Báo cáo tuần
- [ ] i18n (đa ngôn ngữ)

### Phase 3 (5-6 tháng) — Nâng cao
- [ ] Social scenarios
- [ ] Drawing mode
- [ ] AI model fine-tuning
- [ ] Real-time emotion feedback
- [ ] Teacher mode
- [ ] Community features

---

> 📝 Tài liệu này nên được review và cập nhật mỗi sprint
> 
> 📅 Cập nhật lần cuối: 2026-04-27
