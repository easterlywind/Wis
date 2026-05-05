# 📖 Hướng Dẫn Sử Dụng — Smile Sprout

> Ứng dụng hỗ trợ trẻ tự kỷ học nhận biết và biểu đạt cảm xúc

---

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Yêu cầu hệ thống](#2-yêu-cầu-hệ-thống)
3. [Cài đặt và khởi chạy](#3-cài-đặt-và-khởi-chạy)
4. [Hướng dẫn sử dụng cho phụ huynh](#4-hướng-dẫn-sử-dụng-cho-phụ-huynh)
5. [Hướng dẫn sử dụng cho trẻ](#5-hướng-dẫn-sử-dụng-cho-trẻ)
6. [Câu hỏi thường gặp](#6-câu-hỏi-thường-gặp)

---

## 1. Giới thiệu

**Smile Sprout** là ứng dụng web giúp trẻ tự kỷ học nhận biết và biểu đạt cảm xúc thông qua:

- 📝 **Trắc nghiệm vui** — Nhận biết cảm xúc qua hình ảnh, video, âm thanh
- 🎭 **Luyện biểu cảm** — Thực hành biểu đạt cảm xúc với camera (AI nhận diện)
- 🎯 **Cấp độ học** — Hệ thống cấp độ từ dễ đến khó
- 📊 **Theo dõi tiến trình** — Biểu đồ chi tiết về kết quả học tập

### Nguyên tắc thiết kế

Giao diện được thiết kế đặc biệt cho trẻ tự kỷ:
- Màu sắc **pastel nhẹ nhàng**, không gây kích thích thị giác
- **Font chữ Nunito** tròn, dễ đọc
- **Nút bấm to** (tối thiểu 48px), dễ chạm/click
- **Animation nhẹ nhàng**, chậm rãi, không giật
- **Phản hồi tích cực** — luôn khích lệ, không phê phán

---

## 2. Yêu cầu hệ thống

### Trình duyệt
- Chrome/Edge 90+ (khuyến nghị)
- Firefox 90+
- Safari 14+

### Phần cứng
- Máy tính hoặc tablet có webcam (cho tính năng Luyện biểu cảm)
- Kết nối internet (cho lần đầu tải ứng dụng)

### Để tự chạy local
- Node.js 18+ 
- PostgreSQL 14+
- npm hoặc yarn

---

## 3. Cài đặt và khởi chạy

### Cách 1: Script tự động (khuyến nghị)

```bash
# Clone project
git clone <repo-url>
cd KHMT

# Chạy một lệnh duy nhất
chmod +x start.sh
./start.sh
```

Script sẽ tự động:
1. ✅ Kiểm tra Node.js, npm, PostgreSQL
2. ✅ Cài đặt dependencies
3. ✅ Thiết lập database (migrations + seed)
4. ✅ Khởi chạy Backend (port 3000)
5. ✅ Khởi chạy Frontend (port 8080)

### Cách 2: Docker Compose

```bash
docker-compose up --build
```

### Cách 3: Thủ công

```bash
# Terminal 1 - Backend
cd support-autism-children-be
npm install
npx prisma migrate deploy
npx prisma generate
npm run start:dev

# Terminal 2 - Frontend
cd smile-sprout
npm install
npm run dev
```

### Truy cập ứng dụng

| Service | URL |
|---------|-----|
| 🌐 Ứng dụng | http://localhost:8080 |
| 🔧 API | http://localhost:3000/api |
| 📚 Swagger | http://localhost:3000/swagger |

---

## 4. Hướng dẫn sử dụng cho phụ huynh

### 4.1. Tạo tài khoản

1. Truy cập http://localhost:8080
2. Nhấn **"Bắt đầu ngay"** hoặc **"Đăng nhập"**
3. Chọn **"Đăng ký"** nếu chưa có tài khoản
4. Nhập:
   - Tên bé
   - Email phụ huynh
   - Ngày sinh (tùy chọn)
   - Mật khẩu (ít nhất 8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt)
5. Nhấn **"Đăng ký"**

### 4.2. Đăng nhập

1. Nhập email và mật khẩu
2. Nhấn **"Đăng nhập"**
3. Sẽ được chuyển đến Trang chủ

### 4.3. Cài đặt

- Vào **Cài đặt** từ Trang chủ
- Điều chỉnh âm lượng
- Thay đổi ngôn ngữ (Tiếng Việt / English)

### 4.4. Theo dõi tiến trình

- Nhấn **"Tiến trình"** ở Trang chủ
- Xem biểu đồ điểm số theo ngày
- Xem độ chính xác theo từng cảm xúc
- Xem chuỗi ngày học, thành tích

---

## 5. Hướng dẫn sử dụng cho trẻ

> 💡 **Mẹo cho phụ huynh:** Nên ngồi cùng trẻ trong những lần đầu sử dụng để hướng dẫn thao tác.

### 5.1. Trắc nghiệm vui 📝

1. Nhấn vào ô **"Trắc nghiệm vui"**
2. Xem hình ảnh/video hiển thị
3. Chọn cảm xúc phù hợp bằng cách nhấn vào các ô cảm xúc
4. Nếu đúng → Thông báo "Chính xác! 🎉"
5. Nếu sai → Thông báo "Thử lại nhé!" kèm đáp án đúng
6. Hoàn thành tất cả câu hỏi → Xem kết quả

### 5.2. Luyện biểu cảm 🎭

1. Nhấn vào ô **"Luyện biểu cảm"**
2. Chọn cảm xúc muốn luyện (Vui, Buồn, Giận, Ngạc nhiên)
3. Nhấn **"Bật camera"** → Cho phép truy cập camera
4. Làm khuôn mặt theo cảm xúc đã chọn
5. Thanh **"Độ khớp"** sẽ hiện phần trăm khớp
6. Khi đạt ≥ 80% → "Tuyệt vời! Bạn làm đúng rồi!"

**Chế độ "Tập lần lượt":**
- Nhấn nút **"Tập lần lượt"**
- Hệ thống sẽ tự động chuyển qua từng cảm xúc
- Hoàn thành tất cả 4 cảm xúc → Thông báo chúc mừng

### 5.3. Cấp độ học 🎯

1. Nhấn **"Cấp độ học"**
2. Xem danh sách cấp độ (từ dễ đến khó)
3. Cấp độ mở khóa → Nhấn **"Bắt đầu"**
4. Cấp độ khóa → Cần hoàn thành cấp trước
5. Trong cấp độ → Chọn quiz để làm

---

## 6. Câu hỏi thường gặp

### ❓ Camera không hoạt động?
- Kiểm tra trình duyệt đã cho phép truy cập camera
- Thử reload trang
- Đảm bảo không có ứng dụng khác đang dùng camera

### ❓ Không tải được quiz?
- Kiểm tra Backend có đang chạy không (http://localhost:3000/api)
- Kiểm tra kết nối database
- Thử reload trang

### ❓ Quên mật khẩu?
- Liên hệ quản trị viên để reset mật khẩu

### ❓ Âm thanh không phát?
- Kiểm tra âm lượng trong Cài đặt
- Kiểm tra âm lượng hệ thống
- Thử nhấn vào nút "Nghe hướng dẫn" 🔊

---

> 📧 Liên hệ hỗ trợ: smile.sprout.team@gmail.com
