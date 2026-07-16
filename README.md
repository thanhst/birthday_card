# Birthday Card

Một trang chúc mừng sinh nhật dạng GitHub Pages: mở hộp quà, nhận chìa khóa, mở quyển thư và xem lời chúc cuối cùng với confetti, pháo hoa, particles và hiệu ứng lật trang.

## Chỉnh nội dung

Mở `script.js` và sửa phần `CONFIG` ở đầu file:

- `recipientName`: tên người nhận.
- `senderName`: tên người gửi.
- `bookPages`: các trang lời nhắn ngắn trong quyển thư.
- `finalTitle`: tiêu đề card cuối.
- `finalMessage`: lời chúc chính.

## Chạy thử

Mở trực tiếp `index.html` trong trình duyệt. Site không cần build và không cần cài package.

## GitHub Pages

Workflow `.github/workflows/pages.yml` sẽ publish tự động khi push lên nhánh `main`. Trong repository GitHub, vào `Settings -> Pages` và chọn source là `GitHub Actions` nếu chưa được bật.
