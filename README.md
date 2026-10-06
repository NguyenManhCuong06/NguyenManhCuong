# 🎂 Website Chúc Mừng Sinh Nhật

Website sinh nhật single-page, phong cách viral TikTok/Douyin — lung linh, cảm xúc, mượt trên điện thoại. Web tĩnh (không backend), deploy được trên GitHub Pages.

## ✨ Tính năng

- Màn hình mở đầu với nền sao lấp lánh + nút "Mở quà" (bắt đầu nhạc)
- Đếm ngược 3 – 2 – 1 hiệu ứng phóng to rồi mờ dần
- Hạt sáng bay vào xếp chữ "Happy Birthday" → tên người nhận → tan ra → trái tim đập nhẹ, kèm pháo hoa (Canvas 2D)
- Bánh kem CSS thuần, số nến theo tuổi; thổi nến bằng micro (Web Audio API) hoặc bấm vào nến (phương án dự phòng); khi tắt nến: khói bay + pháo giấy + dòng "Điều ước của bạn sẽ thành hiện thực"
- Vòng ảnh 3D xoay quanh trái tim phát sáng (Three.js), kéo/vuốt để xoay, bấm ảnh để phóng to (lightbox)
- Lời chúc hiện kiểu máy đánh chữ, nền đèn lồng bay nhẹ
- Thư tay hiện từng dòng + ký tên
- Nút "Xem lại từ đầu" + credit "Made with ❤️"
- Hỗ trợ `prefers-reduced-motion`, giới hạn hạt theo thiết bị, nút bấm ≥ 44px, nhạc chỉ phát sau cử động đầu tiên

## 🛠 Công nghệ

HTML5, CSS3, JavaScript ES modules; Three.js (vòng ảnh 3D), GSAP (chuyển cảnh), canvas-confetti (pháo giấy) qua CDN; Web Audio API (micro + nhạc nền tự tạo).

## 📝 Cách thay nội dung

Mở `script.js`, sửa object `CONFIG` ở đầu file:

| Trường | Ý nghĩa |
|---|---|
| `recipientName` | Tên người nhận |
| `birthDate` | Ngày sinh (DD/MM/YYYY) |
| `age` | Tuổi (số nến, tối đa 12 nến để đẹp trên mobile) |
| `senderName` | Người gửi (ký tên cuối thư) |
| `wishes` | 3–5 câu chúc |
| `letter` | Các dòng thư tay |
| `images` | Đường dẫn ảnh trong `assets/images/` |
| `music` | Đường dẫn file mp3, ví dụ `"assets/audio/birthday.mp3"`. Để trống `""` sẽ phát nhạc nền nhẹ tự tạo bằng Web Audio |

## 🖼 Thêm ảnh

1. Đặt ảnh vào thư mục `assets/images/`
2. Đặt tên **không dấu tiếng Việt, không khoảng trắng** (ví dụ: `anh-di-bien.webp`)
3. Cập nhật mảng `images` trong `CONFIG` (6–10 ảnh). Ảnh tự động lazy-load; ảnh lỗi sẽ được thay bằng ảnh tạm.

## 🎵 Nhạc nền

Đặt file `.mp3` vào `assets/audio/`, rồi sửa `music: "assets/audio/birthday.mp3"`. Nhạc chỉ phát sau lần chạm đầu tiên (quy định của trình duyệt) và có nút bật/tắt cố định góc trên bên phải.

## 🚀 Deploy lên GitHub Pages

1. Commit toàn bộ mã nguồn và push lên repo GitHub.
2. Vào repo → **Settings** → **Pages** (mục "Code and automation").
3. **Source**: chọn *Deploy from a branch*.
4. **Branch**: `main`, **Folder**: `/ (root)` → **Save**.
5. Chờ 1–2 phút, trang sẽ có tại `https://<username>.github.io/<ten-repo>/`.

> Mọi đường dẫn trong project là tương đối nên chạy đúng trên GitHub Pages. Nếu mở file `index.html` trực tiếp (double-click) cũng chạy được, trừ ảnh Three.js có thể bị chặn CORS ở một số trình duyệt — nên dùng qua HTTP (GitHub Pages hoặc `npx serve`).
