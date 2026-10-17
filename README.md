# 🧠 Học Sơ Đồ (Map My Mind) - Không gian học trực quan & sơ đồ tư duy bằng AI

> Ứng dụng vẽ sơ đồ tư duy học tập thông minh, tích hợp AI bám sát chương trình Sách Giáo Khoa (SGK), hỗ trợ ôn tập thẻ nhớ (Flashcard) và tự kiểm tra trắc nghiệm (Quiz).

---

## ✨ Tính năng nổi bật

- **Tạo sơ đồ bằng AI (Google Gemini & OpenAI GPT-4o-mini):**
  - Tự động phân tích nội dung văn bản hoặc **ảnh chụp trang sách giáo khoa** (AI Vision).
  - Áp dụng quy tắc sư phạm: 4–6 nhánh chính ngắn gọn (< 8 từ/nhánh), không bịa thêm ý.
  - Gắn nhãn phân định rõ ràng giữa **Nguồn SGK** và **Ý mở rộng thực tế do AI gợi ý**.
- **Bảng vẽ tư duy trực quan (Interactive Mind Map Canvas):**
  - Kéo thả, thu phóng mượt mà, căn giữa thông minh.
  - Tự do chỉnh sửa nội dung, thêm nhánh con, tạo liên kết chéo giữa các khái niệm.
- **Không gian học tập đa năng:**
  - **Học theo nhánh:** Cô lập từng nhánh kiến thức để nắm sâu từng phần.
  - **Thẻ nhớ (Flashcards):** Tự động tạo thẻ ghi nhớ từ các nhánh để ôn thi nhanh.
  - **Trắc nghiệm (Quiz):** Bộ câu hỏi trắc nghiệm tự động kiểm tra mức độ ghi nhớ bài học.
  - **Đối chiếu chuẩn (Benchmark):** So sánh sơ đồ học sinh/AI với sơ đồ giáo viên và đo lường độ chính xác.

---

## 🚀 Cài đặt & Chạy ứng dụng

### 1. Cài đặt các thư viện phụ thuộc
```bash
npm install
```

### 2. Cấu hình API Key AI (Tùy chọn)
Tạo file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
```
Mở file `.env` và điền khóa API của bạn:
```env
# 1. Google Gemini API Key (Khuyên dùng - Miễn phí tại https://aistudio.google.com/app/apikey)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# 2. OpenAI API Key (Tại https://platform.openai.com/api-keys)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# 3. Nhà cung cấp mặc định: 'gemini' hoặc 'openai'
VITE_DEFAULT_AI_PROVIDER=openai
```
*(Bạn cũng có thể nhập API Key trực tiếp trên giao diện ứng dụng qua nút `API` ở thanh menu).*

### 3. Chạy dev server
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:5173/`

### 4. Build sản phẩm
```bash
npm run build
```

---

## 🛠️ Công nghệ sử dụng
- **Frontend:** React 19, Vite
- **Styling:** Vanilla CSS (Modern Design System, Dark/Light Mode, Chế độ chữ lớn)
- **Icons & FX:** Lucide React, Canvas Confetti
- **AI Models:** Google Gemini (1.5 Flash / 2.0), OpenAI (GPT-4o-mini)
