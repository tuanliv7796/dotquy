# Cẩm Nang Đột Quỵ — Sơ cứu & Phòng bệnh (`Đột Quỵ 115`)

Hệ sinh thái **Website chuẩn SEO** và **Ứng dụng Android độc lập (`.apk`)** về nhận diện cực sớm, phòng ngừa có đích và sơ cứu đột quỵ não trước viện tại Việt Nam.

- **Tên đầy đủ:** Cẩm Nang Đột Quỵ — Sơ cứu & Phòng bệnh
- **Tên hiển thị trên màn hình chính Android (`.apk`):** `Đột Quỵ 115` (`vn.dotquy115.app`)
- **Nguồn tri thức y khoa chuẩn hóa:** Đối chiếu và kiểm chứng tới tháng 11/2026 (`Quyết định 3312/QĐ-BYT` của Bộ Y tế Việt Nam, `AHA/ASA 2024–2026`, `ESO 2025/2026`, `ILCOR 2025`; hồ sơ nghiên cứu gốc lưu tại [`docs/archive/`](./docs/archive/)).

---

## 1. Tính năng cốt lõi (`Phiên bản v1.0`)

1. **Luồng Cấp cứu 0 Giây (`Không bao giờ rời nút 115`):**
   - Nút **`GỌI 115 NGAY`** cao `≥ 98px` nằm ngay đỉnh Bước 1 kèm kịch bản 3 câu đọc cho tổng đài viên, định vị tọa độ GPS và thanh Đỏ ghim nút `115` + **Thước Giờ Vàng** xuyên suốt mọi bước.
   - **Cổng phân nhánh 3 trạng thái sinh tồn (`1 chạm`):** (1) *Bất tỉnh & Ngừng thở/Ngáp cá → Mở ngay máy đếm nhịp ép tim CPR `110 lần/phút` có âm bíp & rung*; (2) *Lơ mơ, Nôn ói, Nuốt sặc hoặc Đang co giật → Tư thế nằm nghiêng an toàn*; (3) *Vẫn tỉnh táo (gồm cả Đột quỵ lúc thức dậy Wake-up & Cơn thoáng qua TIA)*.
   - **Rào chắn chống sai lầm tại chỗ:** Cặp khung song song `VIỆC CẦN LÀM NGAY` và `TUYỆT ĐỐI CẤM LÀM` (*cấm tự uống thuốc hạ áp theo RCT `INTERACT4`, cấm Aspirin, cấm An Cung Ngưu Hoàng Hoàn, cấm chích máu ngón tay, cấm cạo gió/xoa cổ, cấm ăn uống*).
   - Giữ màn hình luôn sáng (`WakeLock` / `FLAG_KEEP_SCREEN_ON`) và đọc hướng dẫn bằng giọng nói tiếng Việt tốc độ `0,9×`.
2. **Trung tâm 3 Bài Kiểm tra Đa trục An toàn + Lịch sử Mã hóa (`Quy tắc H1–H9`):**
   - *Bài 1 — Kiểm tra dấu hiệu ngay (`60 giây` · 6 bước an toàn):* Gồm `BE-FAST` + `5 Dấu hiệu Đỏ ngoài BE-FAST`, tích hợp đếm ngược `10 giây` giơ hai tay và câu đọc mẫu chuẩn; có tùy chọn `"Không chắc"`; **cắt mạch 0 giây** ngay câu đầu tiên dương tính; cấm hướng dẫn đứng dậy đi thử gây ngã; không bao giờ trấn an sai ở màn âm tính.
   - *Bài 2 — Dấu hiệu vừa tự hết? (`TIA < 48h`)* & *Bài 3 — Nguy cơ của tôi (`Đồng hồ 4 mức + Lộ trình tầm soát có đích 10 nhóm`)*.
   - **Lịch sử kiểm tra lưu cục bộ mã hóa phần cứng (`AndroidKeyStore AES-256-GCM` trên `.apk` / `IndexedDB` trên Web):** Tự động bắt mẫu triệu chứng *"Có rồi tự hết"* trong vòng `48 giờ` để bật cảnh báo khẩn cấp TIA, gợi ý thu hẹp mốc `LKW` có xác nhận và chống nhiễm chéo hồ sơ giữa các thành viên gia đình.
3. **Bộ Tìm kiếm An toàn Y khoa 4 Tầng & 24 Chuyên đề Đọc 3 Lớp:**
   - Hiểu tiếng Việt không dấu & từ dân gian (*"trúng gió", "đớ lưỡi", "tê tay", "rối loạn tiền đình", "hạ huyết áp", "nước gừng", "an cung"*), tự động ghim **Thẻ Đỏ Gọi 115 / Thẻ Đỏ Chặn Mẹo Nguy Hiểm** lên vị trí `#0` ngay dưới ô tìm kiếm.
4. **Cơ chế Đồng bộ Nội dung & Bố cục Tự động theo Website (`OTA Atomic Swap + Dự phòng Offline`):**
   - Mỗi lần build Website (`npm run build`), hệ thống tự động đóng gói `dist/ota/bundle.zip` (`~416 KB`) kèm chữ ký băm `SHA-256` trong `dist/ota/manifest.json`.
   - Ứng dụng `.apk` khởi động tức thì (`< 0,2 giây`) từ bộ nhớ Flash nội bộ, sau đó kiểm tra ngầm máy chủ Website của bạn: nếu có bản mới sẽ tải ngầm, xác thực `SHA-256` và cập nhật cả nội dung lẫn bố cục (có `Boot Watchdog` tự động quay lui nếu bản mới lỗi). **Khi không có mạng, `.apk` luôn hiển thị mượt mà 100% theo phiên bản cài đặt / cập nhật thành công gần nhất.**
5. **4 Lối vào ngoài App trên Android:** Widget màn hình chính (`2×2` và `4×2`), Lối tắt nhấn giữ biểu tượng (`App Shortcuts`), Ô cài đặt nhanh (`Quick Settings Tile`), và Thẻ Bàn Giao Bác Sĩ 115 phóng to toàn màn hình.

---

## 2. Hướng dẫn Cài đặt, Phát triển & Xuất bản

### Chạy môi trường phát triển trên máy tính
```bash
npm install
npm run dev
```

### Xuất bản Website tĩnh + Gói cập nhật OTA cho Tên miền riêng
1. Tạo tệp `.env` từ `.env.example` và điền tên miền chính thức của bạn:
   ```env
   PUBLIC_SITE_URL=https://ten-mien-cua-ban.vn
   ```
2. Chạy lệnh biên dịch:
   ```bash
   npm run build
   ```
3. Sao chép toàn bộ thư mục `dist/` lên máy chủ Web của bạn (tham khảo cấu hình mẫu chống lưu đệm `manifest.json` tại [`deploy/nginx.conf.example`](./deploy/nginx.conf.example) hoặc [`deploy/Caddyfile.example`](./deploy/Caddyfile.example)).
   - Khi muốn **cập nhật bài viết** (trong `src/content/articles/*.md`) hoặc **thay đổi bố cục giao diện** (trong `src/pages/`, `src/components/`, `src/styles/`), bạn chỉ cần sửa trên kho mã, chạy `npm run build` và đẩy thư mục `dist/` lên máy chủ Web — các máy Android đã cài `.apk` sẽ tự nhận diện và cập nhật khi có kết nối mạng!

### Chạy 10 Cổng Kiểm tra Tự động (`Playwright CI Safety Gates`)
```bash
npm run test:e2e
```

### Biên dịch ra tệp cài đặt Android (`.apk`)
```bash
npm run apk:debug
# File xuất ra tại: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 3. Cấu trúc Thư mục Dự án

```text
├── src/
│   ├── content/articles/     # 24 bài viết chuyên đề chuẩn Đọc 3 Lớp (.md)
│   ├── data/                 # Kịch bản sơ cứu, câu hỏi kiểm tra 6 bước & danh bạ Bệnh viện Đột quỵ
│   ├── components/           # SearchBox 4 tầng, thư viện SVG Icons & hình vẽ sơ cứu chuẩn giải phẫu
│   ├── layouts/              # Khung giao diện Bình tĩnh & Khẩn cấp (BaseLayout.astro)
│   ├── lib/                  # Bộ máy Tìm kiếm, Lịch sử H1–H9, Đồng hồ Giờ Vàng, Cầu nối Native & OTA
│   ├── pages/                # Các trang tĩnh chuẩn SEO & điểm cuối chỉ mục tìm kiếm
│   └── styles/               # Design System v3.0 (4 chế độ màu WCAG AAA, phông Be Vietnam Pro offline)
├── android/                  # Dự án Capacitor Android + Plugin Kotlin (OTA, KeyStore, Widget, TTS, 115)
├── scripts/                  # Trình đóng gói & ký mã băm SHA-256 cho gói cập nhật OTA
├── tests/                    # Bộ kiểm thử tự động 10 Cổng An Toàn Y Khoa & Trợ Năng (Playwright)
├── deploy/                   # Mẫu cấu hình Nginx & Caddy cho máy chủ tên miền riêng
└── docs/archive/             # Lưu trữ toàn bộ tài liệu nghiên cứu y khoa & báo cáo review thiết kế
```

---

*Tuyên bố y khoa: Nội dung trong dự án phục vụ giáo dục sức khỏe và hướng dẫn sơ cứu an toàn trước viện, không thay thế chẩn đoán hay chỉ định điều trị trực tiếp của bác sĩ. Trong mọi tình huống nghi ngờ đột quỵ cấp: gọi ngay **115**.*