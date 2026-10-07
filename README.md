# 🎂 Website Chúc Mừng Sinh Nhật

Website sinh nhật single-page, theme pastel sáng, mobile-first. Web tĩnh (không backend), deploy được trên GitHub Pages.

## ✨ Tính năng

- Màn hình mở đầu: hộp quà SVG ngọ nguậy — chạm để mở (nắp hộp bay lên, pháo giấy, bắt đầu nhạc)
- Hero: tiêu đề gõ chữ máy "Chúc mừng sinh nhật …", bóng bay bay lên, đếm ngược đến sinh nhật tiếp theo (tự ẩn nếu hôm nay là sinh nhật)
- Bánh kem 3D (Three.js): số nến theo tuổi (tối đa 12), kéo để xoay có quán tính, lửa nhấp nháy, khói bay khi tắt nến
- Thổi nến bằng micro (Web Audio API, tự hiệu chỉnh ngưỡng theo tiếng ồn nền) hoặc chạm vào nến / bánh; tắt hết nến → pháo giấy + "Điều ước của bạn đã được gửi đi ✨"
- Không có WebGL → tự động chuyển bánh dự phòng (DOM/CSS)
- Lời chúc card, timeline kỷ niệm (2 cột xen kẽ trên desktop), thư viện ảnh masonry + lightbox (phóng to, ←/→, Esc)
- Lá thư viết dần từng dòng trên nền giấy kẻ, nút ✦ bật lời chúc bí mật
- Easter egg: gõ "love" (trên điện thoại: gõ vào ô nhập cuối trang; trên máy tính: gõ ở bất cứ đâu) → lời chúc bí mật + pháo giấy
- Nền lấp lánh, nút nhạc góc dưới phải, nút "Phát lại hiệu ứng"
- Hỗ trợ `prefers-reduced-motion`, lazy-load ảnh, chỉ tải Three.js khi cuộn tới phần bánh kem

## 🛠 Công nghệ

HTML5, CSS3, JavaScript thuần (classic script); Three.js (bánh kem 3D) qua CDN import map, canvas-confetti (pháo giấy) qua CDN; Web Audio API (micro + nhạc nền tự tạo). Không dùng framework, không build step.

## 📝 Cách thay nội dung

Mở `script.js`, sửa object `CONFIG` ở đầu file:

| Trường | Ý nghĩa |
|---|---|
| `name` | Tên người nhận (hiện ở tiêu đề chính) |
| `nickname` | Tên gọi thân mật |
| `sender` | Người gửi (ký tên cuối thư, credit footer) |
| `relation` | Quan hệ với người gửi |
| `birthdayISO` | Ngày sinh (ISO) — tự tính tuổi (số nến) và đếm ngược đến sinh nhật tiếp theo |
| `birthdayDisplay` | Ngày sinh hiển thị trên badge |
| `wishes` | Các câu chúc |
| `memories` | Kỷ niệm (title, date, text, src, alt) |
| `gallery` | Ảnh thư viện (src, alt, ratio = rộng/cao) |
| `letter` | Các dòng thư tay (hỗ trợ `{nickname}`) |
| `secretWish` | Lời chúc bí mật |
| `audioSrc` | Đường dẫn mp3, ví dụ `"assets/audio/birthday.mp3"`. Để trống `""` sẽ phát "Happy Birthday" tự tạo bằng Web Audio (public domain) |

## 🖼 Thêm ảnh

1. Đặt ảnh vào thư mục `assets/images/`
2. Đặt tên **không dấu tiếng Việt, không khoảng trắng** (ví dụ: `anh-di-bien.webp`)
3. Cập nhật `src` trong `memories` / `gallery` của `CONFIG`. Ảnh tự động lazy-load; để `src: ""` sẽ dùng ảnh placeholder pastel.

## 🎵 Nhạc nền

Để `audioSrc: ""` (mặc định) sẽ tự chơi giai điệu "Happy Birthday" (public domain) bằng Web Audio. Hoặc đặt file `.mp3` vào `assets/audio/` và sửa `audioSrc: "assets/audio/birthday.mp3"`. Nhạc chỉ phát sau lần chạm đầu tiên (quy định của trình duyệt) và có nút bật/tắt góc dưới phải.

## 🚀 Deploy lên GitHub Pages

1. Commit toàn bộ mã nguồn và push lên repo GitHub.
2. Vào repo → **Settings** → **Pages**.
3. **Source**: *Deploy from a branch* → **Branch**: `main`, **Folder**: `/ (root)` → **Save**.
4. Chờ 1–2 phút, trang sẽ có tại `https://<username>.github.io/<ten-repo>/`.

> Mọi đường dẫn trong project là tương đối. Nên mở qua HTTP (GitHub Pages hoặc `python -m http.server`) thay vì double-click `index.html`, vì Three.js dạng ES module có thể bị chặn CORS khi mở trực tiếp từ file.
