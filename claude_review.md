# Báo cáo review thiết kế UI/UX: Gemini và Claude

> **Ngày:** 27/11/2026 · **Người review:** Claude
> **Đối tượng review:**
> - Thiết kế của Gemini: `gemini/docs/ui-ux/` gồm `README.md`, 2 ảnh concept trong `assets/` và bản demo `demo-giao-dien.html` (2.008 dòng).
> - Thiết kế của Claude: `claude/docs/ui-ux/` gồm `README.md` và `ban-thiet-ke.html` (bản thiết kế có prototype app bấm thử được).
>
> **Mục tiêu:** so sánh hai thiết kế, giữ ưu điểm của mỗi bên, sửa nhược điểm, đề xuất **một thiết kế tối ưu duy nhất** để bắt tay vào làm sản phẩm thật.

---

## Mục lục

1. [Kết luận nhanh](#1-kết-luận-nhanh)
2. [Cách review](#2-cách-review)
3. [Bảng so sánh tổng thể](#3-bảng-so-sánh-tổng-thể)
4. [Review thiết kế Gemini](#4-review-thiết-kế-gemini)
5. [Tự review thiết kế Claude](#5-tự-review-thiết-kế-claude)
6. [Thiết kế tối ưu hợp nhất](#6-thiết-kế-tối-ưu-hợp-nhất)
7. [Danh sách việc cần làm theo mức ưu tiên](#7-danh-sách-việc-cần-làm-theo-mức-ưu-tiên)
8. [Kế hoạch thử nghiệm với người dùng](#8-kế-hoạch-thử-nghiệm-với-người-dùng)
9. [Phụ lục: số liệu kiểm thử](#9-phụ-lục-số-liệu-kiểm-thử)

---

## 1. Kết luận nhanh

**Hai thiết kế đi cùng một hướng**, và hướng đó đúng:
- tách hai chế độ “bình tĩnh” và “khẩn cấp”;
- dùng BE-FAST;
- ghi giờ lần cuối thấy bình thường (LKW);
- có màn hình chống mẹo dân gian, thẻ thông tin cho bác sĩ, giọng đọc tiếng Việt, nhịp ép tim, widget Android;
- chạy được khi mất mạng; dùng một mã nguồn cho web và `.apk`.

**Gemini mạnh hơn ở:**
- Sơ cứu **theo tình huống** (nôn, co giật, ngừng thở, ngủ dậy mới thấy…).
- Thẻ **“Nên làm / Tuyệt đối cấm” đặt cạnh nhau** trong từng tình huống.
- Bài viết **đọc 3 lớp**.
- Các nút **đổi chế độ hiển thị** (ấm dịu, tương phản cao, ban đêm).
- Ý tưởng **giữ màn hình luôn sáng**.
- **5 dấu hiệu đỏ** ngoài BE-FAST.
- Thẻ y tế có **cân nặng**; minh họa widget rõ ràng.

**Claude mạnh hơn ở:**
- **Luồng cấp cứu đặt nút “Gọi 115” lên đầu.**
- **Bài kiểm tra an toàn:** có lựa chọn “Không chắc”; không bao giờ ghi kết quả “bình thường”.
- **Đồng hồ khởi phát và thước giờ vàng.**
- **Tìm kiếm hiểu từ dân gian**, và tự hiện thẻ “Gọi 115” khi người dùng gõ triệu chứng.
- **Cỡ chữ mặc định lớn hơn**; biểu tượng vẽ bằng SVG thay vì emoji.

**Thiết kế Gemini có 6 lỗi an toàn cần sửa trước khi làm sản phẩm** (mục 4.2). Ba lỗi nặng nhất:
1. Bài kiểm tra **hiện sẵn kết quả “Mức 1: Bình thường” trước khi người dùng trả lời câu nào**.
2. Trên điện thoại, nút **“Gọi 115” nằm cách đầu màn hình cấp cứu khoảng 3 lần chiều cao màn hình**.
3. **Đau đầu sét đánh bị xếp là “Muộn”.**

**Thiết kế Claude cũng có nhược điểm** (mục 5.2):
- Một số chữ phụ chỉ 13–14px; vài nút nhỏ hơn 44px.
- “1 chạm tới 115” thực tế là 2 chạm.
- Thiếu bước chọn tình huống.
- Chưa có chức năng giữ màn hình sáng.
- Nút tương phản cao chưa hoạt động.

**Đề xuất:** lấy **khung luồng cấp cứu và logic bài kiểm tra của Claude** làm xương sống. Ghép vào đó **bước chọn tình huống, thẻ Nên/Cấm, đọc 3 lớp, các nút đổi chế độ hiển thị và giữ màn hình sáng của Gemini**. Toàn bộ nội dung y khoa lấy từ một nguồn duy nhất là `claude_merge_final.md`. Chi tiết ở mục 6.

---

## 2. Cách review

| Bước | Nội dung |
|---|---|
| Đọc tài liệu | `README.md` hai bên; ảnh concept của Gemini; mã nguồn demo của Gemini (giao diện, dữ liệu, logic) |
| Chạy thử | Mở demo Gemini bằng Chromium không giao diện, ở hai cỡ màn hình: máy tính 1366×900 và điện thoại 390×844, cả chế độ Website và chế độ App. Chạy các luồng: bài test, sơ cứu, tìm kiếm, ghi giờ, đổi cỡ chữ |
| Đo đạc | Lỗi JavaScript; tràn ngang; kích thước vùng chạm; phân bố cỡ chữ thực tế; vị trí nút “Gọi 115”; độ tương phản màu (công thức WCAG) |
| So sánh công bằng | Chạy cùng bộ đo trên prototype của Claude |
| Đối chiếu y khoa | So nội dung trong demo với `claude_merge_final.md` |

Kết quả đo chi tiết ở mục 9.

---

## 3. Bảng so sánh tổng thể

Thang điểm 1–5 (5 là tốt nhất), chấm theo những gì **đang có trong demo**, không phải theo những gì tài liệu mô tả.

| Tiêu chí | Gemini | Claude | Ghi chú |
|---|:-:|:-:|---|
| **An toàn của câu chữ và kết quả** | 2 | 5 | Gemini hiện sẵn “Bình thường”, xếp đau đầu sét đánh là “Muộn”, không có “Không chắc” |
| **Tốc độ tới cuộc gọi 115** | 2 | 4 | Gemini: phải cuộn khoảng 3 màn hình. Claude: nút gọi ở trên cùng nhưng vẫn cần 2 chạm |
| **Luồng sơ cứu** | 4 | 4 | Gemini: theo tình huống, nhưng thứ tự sai. Claude: tuyến tính, thiếu bước chọn tình huống |
| **Hướng dẫn Nên/Cấm** | 5 | 3 | Gemini đặt cạnh nhau trong từng tình huống. Claude tách thành một màn riêng |
| **Bài kiểm tra** | 2 | 4 | Gemini trộn kiểm tra dấu hiệu với đánh giá nguy cơ. Claude tách hai bài, nhưng điểm nguy cơ mới là minh họa |
| **Đồng hồ khởi phát, thước giờ vàng** | 2 | 5 | Gemini chỉ có 2 mốc giờ; sau 30 giờ vẫn ghi “đang trong cửa sổ cấp cứu” |
| **Tìm kiếm** | 2 | 5 | Gemini: gõ ở trang chủ là bị chuyển trang, ô tìm biến mất; “te tay” không ra kết quả |
| **Tra cứu bài viết** | 5 | 3 | Mẫu đọc 3 lớp của Gemini rõ ràng hơn |
| **Trợ năng người cao tuổi** | 3 | 3 | Gemini có nhiều chế độ hiển thị nhưng nhiều chữ 12–13px. Claude chữ chính 17–18px nhưng một số nhãn 13px, vài nút 36–40px |
| **Hệ thống màu, chữ** | 3 | 4 | Gemini ghi “AAA” nhưng màu teal và đỏ chỉ đạt AA. Claude ghi tỷ lệ đúng |
| **Biểu tượng** | 2 | 4 | Gemini dùng emoji (hiển thị khác nhau giữa các máy, TalkBack đọc tên emoji) |
| **Tính năng riêng Android** | 4 | 4 | Hai bên cùng có widget, thẻ y tế. Gemini thêm gửi SMS vị trí; Claude thêm lối tắt, ô cài đặt nhanh, màn hình khóa |
| **Website** | 4 | 4 | Gemini: phần đầu trang chia đôi rõ. Claude: ô tìm kiếm là trung tâm, thanh 2 nút ở đáy trên điện thoại |
| **Độ hoàn thiện demo** | 4 | 4 | Cả hai không lỗi JavaScript, không tràn ngang |
| **Tài liệu thiết kế** | 4 | 4 | Gemini có sơ đồ luồng mermaid. Claude có nghiên cứu nguồn, câu hỏi duyệt, kế hoạch tính năng |

---

## 4. Review thiết kế Gemini

![Trang chủ website trong demo Gemini](claude/docs/review/gemini-web-home.png)

### 4.1 Điểm mạnh nên giữ

1. **Chọn tình huống khi sơ cứu.** Người dùng chọn đúng cảnh đang thấy (nôn, lơ mơ, co giật, ngừng thở, ngủ dậy mới thấy, triệu chứng đã tự hết) và nhận hướng dẫn riêng. Sát thực tế hơn một luồng chung.
2. **Khung “Việc cần làm ngay / Tuyệt đối cấm” đặt cạnh nhau** trên cùng một thẻ. Người đọc thấy ngay việc nên làm và điều cấm, không cần sang màn khác.
3. **Đọc 3 lớp cho mỗi bài:** tóm tắt 15 giây, hành động nên và cấm, bằng chứng mở rộng. Hợp cho cả người già lẫn người muốn tìm hiểu sâu.
4. **Ba chế độ hiển thị bấm được:** Ấm dịu, Rõ nét (tương phản cao), Ban đêm. Có thanh đổi cỡ chữ ba mức ở đầu trang.
5. **5 dấu hiệu đỏ ngoài BE-FAST** có thẻ bấm xem giải thích. Mỗi thẻ có nút “Có dấu hiệu này → Sơ cứu ngay”.
6. **Thẻ báo bác sĩ có cân nặng** (để bác sĩ tính liều thuốc). Thông tin được lưu trên máy để lần sau không phải nhập lại.
7. **Nhịp ép tim 110 lần/phút** có tiếng bíp, hiện tự động ở tình huống ngừng thở.
8. **Ý tưởng giữ màn hình luôn sáng** trong chế độ cấp cứu, và **gửi SMS vị trí cho người thân** khi gọi 115.
9. **Phần đầu trang web chia đôi rõ:** bên trái khẩn cấp, bên phải bài test. Có hàng nút chủ đề tra cứu nhanh (“Tại sao cấm uống thuốc hạ áp”, “Sự thật chích máu”…).
10. **Sơ đồ luồng điều hướng bằng mermaid** trong README dễ đọc với đội phát triển.
11. Demo chạy ổn: **không lỗi JavaScript, không tràn ngang** ở cả hai cỡ màn hình, kể cả cỡ chữ lớn nhất.

### 4.2 Lỗi an toàn (phải sửa)

| # | Lỗi | Bằng chứng khi chạy thử | Vì sao nguy hiểm | Cách sửa |
|---|---|---|---|---|
| **G1** | **Kết quả “Mức 1: Bình thường” hiện sẵn khi mở bài test**, trước khi trả lời câu nào. Bấm “Làm lại” cũng quay về kết quả này | Kết quả ban đầu: “🟢 MỨC 1: BÌNH THƯỜNG / NGUY CƠ NỀN THẤP · Chưa ghi nhận triệu chứng thần kinh khu trú bất thường” | Người đang hoảng nhìn lướt sẽ thấy chữ xanh “Bình thường” và yên tâm sai | Khi chưa có câu trả lời, ô kết quả để trống: “Kết quả sẽ hiện sau khi trả lời” |
| **G2** | **Kết quả âm tính khẳng định “Hiện tại khuôn mặt, vận động hai tay, lời nói và thăng bằng ổn định”**, không kèm lưu ý | Trả lời bình thường cả 5 bước thì ra đúng câu trên | Trái nguyên tắc “không bao giờ trấn an sai” trong cả hai bộ kiến thức. Các thang sàng lọc đều có thể bỏ sót | Đổi thành “Chưa thấy dấu hiệu thường gặp. Kết quả này không loại trừ đột quỵ”, kèm danh sách dấu hiệu vẫn phải gọi 115 |
| **G3** | **Không có lựa chọn “Không chắc”**; mỗi câu chỉ có bình thường, đã tự hết, hoặc đang có | Bước 1 chỉ có 3 nút | Người không chắc sẽ chọn “bình thường” | Thêm “Không chắc”, xử lý như “Có” |
| **G4** | **Đau đầu sét đánh, nôn vọt, sặc, ngủ gà bị xếp là “Mức 4: Muộn”** | Chọn “Đau đầu sét đánh” ở bước 3 thì ra “🔴 MỨC 4: GIAI ĐOẠN MUỘN” | Đau đầu sét đánh là cấp cứu **tối cấp** (nghi vỡ phình mạch), không phải “muộn”. Thang này trộn **mức độ nặng** với **thời gian** | Tách hai trục (xem `claude_merge_final.md` mục 3): dấu hiệu nặng là **mức nguy kịch**, ưu tiên đường thở; thời gian tính theo LKW |
| **G5** | **Nút “Gọi 115” trong màn hình sơ cứu nằm cuối thẻ**, sau phần ghi giờ, hàng chọn tình huống và hai danh sách | Điện thoại 390×844: nút nằm ở khoảng **2.537px** tính từ đầu trang, phải cuộn khoảng 3 màn hình. Máy tính: ở mép dưới màn hình (763/900px) | Hành động quan trọng nhất lại nằm xa nhất. Nút đỏ “Sơ cứu khẩn cấp” ở đầu trang chỉ mở màn hình, không gọi | Đặt nút “Gọi 115” lớn **trên cùng** màn hình cấp cứu; thêm một nút gọi nhỏ cố định ở mọi bước |
| **G6** | **Sau 30 giờ, dòng LKW vẫn ghi “Đang trong cửa sổ cấp cứu!”** | Ghi LKW cách đây 1.800 phút thì hiện “Đã trôi qua 1800 phút… Đang trong cửa sổ cấp cứu!” | Thông tin thời gian sai, và không phân biệt được giờ vàng với các mức sau | Dùng thước giờ vàng: 0–4,5 giờ / 4,5–24 giờ / trên 24 giờ, kèm thông điệp đúng từng mức (nhưng **luôn** gọi 115) |

![Màn hình sơ cứu của demo Gemini trên điện thoại: nút Gọi 115 nằm rất xa](claude/docs/review/gemini-app-emergency.jpg)

Lưu ý: phần đầu ảnh là thanh điều khiển của demo (chọn Website/App, cỡ chữ). Ngay cả khi bỏ thanh này, nút “Gọi 115” vẫn nằm dưới phần ghi giờ, hàng chọn tình huống và hai danh sách.

### 4.3 Vấn đề trải nghiệm (nên sửa)

| # | Vấn đề | Bằng chứng | Cách sửa |
|---|---|---|---|
| G7 | **Gõ tìm kiếm ở trang chủ là bị chuyển sang trang Cẩm nang, ô tìm kiếm biến mất.** Trang Cẩm nang không có ô tìm kiếm riêng | Gõ “meo mieng”: ô tìm kiếm không còn hiện, trang Cẩm nang mở ra | Hiện kết quả ngay dưới ô tìm kiếm; trang Tra cứu có ô tìm kiếm riêng |
| G8 | **Tìm kiếm chỉ so trùng nguyên cụm, không hiểu từ đồng nghĩa.** Gợi ý trong ô có “te tay” nhưng gõ “te tay” thì không ra kết quả | “te tay”: “Không tìm thấy”. “tai bien”: chỉ ra bài chích máu | Dùng bộ tìm kiếm của Claude: bỏ dấu, tách từ, từ dân gian (“trúng gió”, “tai biến” → đột quỵ), và hiện thẻ “Gọi 115” khi người dùng gõ triệu chứng |
| G9 | **Bài test trộn hai việc khác nhau.** Kiểm tra dấu hiệu đang xảy ra (bước 1–3) bị nối liền với đánh giá yếu tố nguy cơ (bước 4–5) | Một luồng 5 bước | Tách thành hai bài: “Kiểm tra dấu hiệu ngay” và “Nguy cơ của tôi”. Kiểm tra dấu hiệu xong, nếu âm tính thì gợi ý làm bài nguy cơ |
| G10 | **Mức 2 “Rất sớm” lại có nghĩa là “có yếu tố nguy cơ”** | Đồng hồ: Bình thường → Rất sớm (nguy cơ) → Sớm → Muộn | Người có huyết áp cao sẽ hiểu là “đã bị đột quỵ giai đoạn rất sớm”. Dùng tên “Nguy cơ: Thấp / Trung bình / Cao / Rất cao” cho trục nguy cơ |
| G11 | **Nút “Tình huống trước / Tình huống tiếp theo”** khiến các tình huống trông như các bước tuần tự | Nút ở cuối thẻ sơ cứu | Tình huống là các lựa chọn thay thế nhau. Bỏ hai nút này; giữ nút quay lại bước chọn tình huống |
| G12 | **Chế độ khẩn cấp không khác chế độ thường.** README ghi “ẩn mọi menu phụ”, nhưng demo vẫn giữ nguyên đầu trang, thanh điều hướng, nền | So ảnh trang chủ với màn hình sơ cứu | Khi vào cấp cứu: nền và thanh trạng thái đổi màu đỏ, ẩn thanh điều hướng, chỉ còn nút thoát, nút đọc to, nút gọi |
| G13 | **Ghi giờ chỉ có 3 lựa chọn** (vừa xảy ra, 15 phút trước, ngủ dậy mới thấy) | Phần LKW | Thêm 30 phút, 1 giờ, 3 giờ, “Không rõ”, và chọn giờ cụ thể |
| G14 | **Biểu tượng là emoji** (🚨🧪📖🫀…) | Toàn bộ giao diện | Emoji hiển thị khác nhau giữa các đời Android, và TalkBack đọc tên emoji gây nhiễu. Dùng bộ biểu tượng nét (SVG) kèm nhãn chữ |
| G15 | **Thông báo “Đang đọc…” hiện ngay cả khi máy không có giọng tiếng Việt** | Hàm đọc không kiểm tra giọng | Kiểm tra giọng `vi-VN`; nếu không có thì báo cách cài |
| G16 | **Ở độ rộng 1366px, nút “Sơ cứu khẩn cấp” bị đẩy xuống dòng thứ hai** dưới logo | Ảnh trang chủ máy tính | Gom thanh điều hướng, hoặc rút gọn nhãn |

### 4.4 Chỗ README mô tả khác với demo

| README ghi | Thực tế trong demo |
|---|---|
| “Chuẩn WCAG 2.2 AAA” | Xanh teal `#0F766E` với chữ trắng là **5,47:1**, đỏ `#DC2626` là **4,83:1**: chỉ đạt **AA**, chưa đạt AAA (cần 7:1). README ghi đỏ là 5,6:1, đo thực tế là 4,83:1 |
| Chữ nội dung 16px ở mức A | Ở mức A, đo được **15 đoạn chữ 12px và 28 đoạn 13px** (nhãn, mô tả thẻ, hàng nút) |
| Vùng chạm tối thiểu 48–56px, trang thiết kế ghi 54–60px | Các nút chủ đề và nút điều khiển chỉ **38px** |
| Giữ màn hình sáng (WakeLock) | **Chưa có trong mã** |
| 10 tình huống sơ cứu | Demo có **6** tình huống |
| Thanh điều hướng 4 nút | Ảnh concept có **5** nút, trong đó có “Tài khoản” (trái nguyên tắc “không bắt tạo tài khoản”) |
| Demo “hoạt động cả khi mất mạng, 100% độc lập” | Phông chữ tải từ Google Fonts; khi mất mạng vẫn chạy nhưng đổi sang phông hệ thống |

### 4.5 Ảnh concept

Ảnh `android-app-screens.jpg` và `website-ui-concept.jpg` có bố cục và màu sắc đẹp, **nhưng không nên dùng làm mẫu cho đội phát triển** vì có các lỗi sau:

- **Nút “CÓ” màu xanh lá, “KHÔNG” màu cam** ở bài test. Ngược với nghĩa: “Có dấu hiệu” là nguy hiểm.
- **Đồng hồ “Thời gian còn lại 0:58:12”** trong màn hình sơ cứu. Đếm ngược tạo cảm giác hết giờ là hết hy vọng, trái với thông điệp “không bỏ cuộc”.
- **“Nằm nghiêng… đầu thấp hơn thân”** sai tư thế. README đã ghi chú lỗi này.
- Bài test gọi từng bước là **“Giai đoạn 1: Méo mặt?”**, dễ nhầm “bước kiểm tra” với “giai đoạn bệnh”. Đồng hồ hiện **điểm số “2.5”** không có nghĩa với người dùng.
- Web: nhãn tiếng Anh (“Balance”, “Eyes”, “Audio read-aloud”); menu **không có mục “Sơ cứu”**; thứ tự 4 mức khác với README.
- Ngày “Thứ Hai, 15/05/2024” đã cũ; dùng từ “Nạn nhân” thay vì “Người bệnh”.

### 4.6 Nội dung y khoa trong demo

Phần lớn khớp với `claude_merge_final.md`. Một số chỗ cần sửa:
- **Bài “8 cái bẫy”:** con số FAST nhạy 58,7% ở tuần hoàn sau bị gán cho nghiên cứu Aroor 2017. Con số này đến từ một đoàn hệ khác.
- **Tình huống “Ngủ dậy mới thấy”:** ghi “Quyết định 3312 đã mở cửa sổ… tới 9–24 giờ”. Theo tài liệu gốc, hướng dẫn Bộ Y tế nói 4,5–9 giờ; mốc 24 giờ là của AHA/ASA 2026. Việc Quyết định 3312 thay thế 5331 cũng **chưa được xác minh**.
- **Demo và README dẫn `gemini_merge.md`.** Bản đó còn các lỗi đã sửa trong `claude_merge_final.md` (nguồn HINTS, tử vong tắc thân nền, đích huyết áp xuất huyết não…). Nên đổi sang **một nguồn kiến thức duy nhất**.

---

## 5. Tự review thiết kế Claude

### 5.1 Điểm mạnh nên giữ

1. **Luồng cấp cứu 4 bước, nút “Gọi 115” to nhất nằm trên cùng**: cách đầu khung điện thoại khoảng 180px, không cần cuộn. Đi kèm câu mẫu để nói với tổng đài và địa chỉ GPS.
2. **Đồng hồ khởi phát và thước giờ vàng** (0–4,5 / 4,5–24 / trên 24 giờ) chạy liên tục ở đầu mọi bước cấp cứu, đồng bộ với thẻ bác sĩ. Có 6 mốc chọn giờ, kể cả “Không rõ”.
3. **Bài kiểm tra an toàn:**
   - Mỗi câu có “Có / Không / Không chắc”; “Không chắc” được xử lý như “Có”.
   - Kết quả âm tính không bao giờ ghi “bình thường”, luôn kèm danh sách dấu hiệu vẫn phải gọi 115.
   - Bài “Dấu hiệu đã tự hết?” tách riêng.
4. **Tìm kiếm thông minh:** bỏ dấu, hiểu từ dân gian (“trúng gió”, “tai biến”, “méo mồm”); gõ triệu chứng thì hiện thẻ đỏ “Gọi 115”. Kết quả hiện ngay tại chỗ.
5. **Thẻ hành động 3 cấp** (Gọi 115 ngay / Đi khám trong hôm nay / Theo dõi). Màu đỏ chỉ dùng cho cấp cứu.
6. **Biểu tượng nét SVG kèm nhãn chữ**; tự theo chế độ sáng, tối của máy; tôn trọng cài đặt giảm chuyển động.
7. **Lối vào không cần mở app**: widget, lối tắt khi nhấn giữ icon, ô cài đặt nhanh, màn hình khóa.
8. Tài liệu có **nghiên cứu nguồn, 8 nguyên tắc kèm câu hỏi duyệt, kế hoạch tính năng theo giai đoạn**.

### 5.2 Nhược điểm cần sửa

| # | Nhược điểm | Bằng chứng | Cách sửa |
|---|---|---|---|
| C1 | **“1 chạm tới 115” là chưa đúng.** Nút đỏ ở thanh điều hướng mở màn hình gọi, phải chạm thêm một lần nữa | Luồng prototype | Ghi đúng “1 chạm tới màn hình gọi, 2 chạm tới bàn phím gọi”. Widget và lối tắt “Gọi 115” mở bàn phím gọi ngay |
| C2 | **Thiếu bước chọn tình huống.** Ai cũng đi qua 5 bước giống nhau, dù người bệnh đang co giật hay đã ngừng thở | Luồng sơ cứu tuyến tính | Thêm màn “Người bệnh đang thế nào?” với 3 lựa chọn lớn (mục 6.3) |
| C3 | **Điều cấm nằm ở một màn riêng** (bước 3). Người dùng có thể bỏ qua | Luồng 4 bước | Mỗi thẻ sơ cứu có 1–2 điều cấm liên quan ngay bên dưới (học từ Gemini); vẫn giữ màn tổng hợp 10 điều cấm |
| C4 | **Một số chữ còn nhỏ** | Trang chủ ở cỡ chữ thường: 7 đoạn 13px, 11 đoạn 14px (nhãn thanh điều hướng, nhãn phụ, thanh trạng thái) | Nhãn thanh điều hướng và chú thích tối thiểu 14px; ở mức Lớn, Rất lớn tăng theo |
| C5 | **Vài vùng chạm dưới 44px** | Nút gợi ý tìm kiếm 40px; nút A/A+/A++ 36px; liên kết “làm BE-FAST” trong thẻ bác sĩ 20px | Nâng tối thiểu 48px; liên kết trong câu đổi thành nút |
| C6 | **Chưa giữ màn hình sáng** trong chế độ cấp cứu | Không có trong mã | Thêm giữ màn hình sáng (WakeLock trên web, KeepScreenOn trên Android) |
| C7 | **Nút “Tương phản cao” chỉ bật tắt, chưa đổi giao diện** | Màn Hồ sơ | Làm chế độ tương phản cao thật (học từ Gemini) |
| C8 | **Dùng 2 họ phông** (Lexend + Be Vietnam Pro) | Hệ thống chữ | Dùng một họ Be Vietnam Pro cho nhẹ app. Nếu cần, chỉ dùng Lexend cho số lớn (đồng hồ) |
| C9 | **Điểm nguy cơ mới là minh họa** | Bài “Nguy cơ của tôi” | Chọn công thức đã kiểm định (mục 6.4) |
| C10 | **Bài viết chưa có mẫu 3 lớp rõ ràng** (mới có “Tóm tắt 30 giây”) | Mẫu bài viết | Dùng mẫu đọc 3 lớp của Gemini |
| C11 | **Prototype nằm trong một trang tài liệu dài**, không tách thành bản demo độc lập như Gemini | `ban-thiet-ke.html` | Khi làm sản phẩm thật, dựng thành app riêng |
| C12 | **Chỉ có 3 dấu hiệu đỏ** (làm trước khi có bộ kiến thức cuối) | Màn BE-FAST | Cập nhật lên 5 dấu hiệu đỏ theo `claude_merge_final.md` |

---

## 6. Thiết kế tối ưu hợp nhất

Tên tạm vẫn là **Giờ Vàng**. Nội dung y khoa lấy từ **`claude_merge_final.md`**.

### 6.1 Mười nguyên tắc

| # | Nguyên tắc | Nguồn |
|---|---|---|
| 1 | **Hai chế độ khác hẳn nhau.** Bình tĩnh: dịu, có cấu trúc. Khẩn cấp: nền đỏ, ẩn menu, một việc mỗi màn hình, đọc to tự động, giữ màn hình sáng | Cả hai |
| 2 | **Nút “Gọi 115” luôn ở trên cùng và luôn nhìn thấy** trong chế độ khẩn cấp | Claude |
| 3 | **Không bao giờ trấn an sai.** Không có kết quả “bình thường”; luôn có “Không chắc” | Claude |
| 4 | **Thời gian và mức độ nặng là hai trục khác nhau.** Thời gian tính theo LKW; mức nguy kịch xử lý đường thở ở mọi thời điểm | Claude (sửa G4) |
| 5 | **Nên làm và Cấm đặt cạnh nhau** trên từng thẻ | Gemini |
| 6 | **Chọn đúng tình huống, nhưng tối đa 3 lựa chọn** khi đang hoảng | Gemini, rút gọn |
| 7 | **Màu là tín hiệu:** đỏ chỉ cho cấp cứu; vàng cho thời gian; xanh lá cho “nên làm”; không dùng màu một mình | Cả hai |
| 8 | **Đọc 3 lớp:** tóm tắt, hành động, bằng chứng | Gemini |
| 9 | **Chữ to, vùng chạm lớn, không emoji**: chữ nội dung 18px; chạm tối thiểu 48px, chuẩn 56px, cấp cứu 72px | Claude, sửa C4, C5 |
| 10 | **Không đăng nhập; phần cấp cứu chạy khi mất mạng; ghi rõ ai thẩm định** | Cả hai |

### 6.2 Cấu trúc

**App Android:** thanh điều hướng 5 mục, nhãn chữ tối thiểu 14px.

| Mục | Nội dung |
|---|---|
| **Trang chủ** | Khối đỏ “Có người nghi đột quỵ?”; 3 bài kiểm tra; 6 chữ BE-FAST và 5 dấu hiệu đỏ (bấm xem giải thích, học từ Gemini); nhắc việc hôm nay |
| **Kiểm tra** | “Kiểm tra dấu hiệu ngay” (BE-FAST và 5 dấu hiệu đỏ) · “Dấu hiệu đã tự hết?” · “Nguy cơ của tôi” · Cảm biến (giai đoạn sau) |
| **Cấp cứu** (nút đỏ ở giữa) | Luồng mục 6.3 |
| **Tra cứu** | Ô tìm kiếm thông minh + hàng chủ đề + bài viết 3 lớp |
| **Hồ sơ** | Thẻ y tế (hồ sơ gia đình); cỡ chữ; chế độ hiển thị (Theo máy · Ấm dịu · Tương phản cao · Ban đêm); giọng đọc |

Không có mục “Tài khoản”.

**Lối vào ngoài app:**
- Widget 2×2 (một nút “Đột quỵ? Chạm ngay”) và 4×2 (theo mẫu của Gemini: Sơ cứu · 115 và Thẻ y tế · Kiểm tra).
- Lối tắt khi nhấn giữ icon: “Gọi 115” mở bàn phím gọi ngay.
- Ô cài đặt nhanh; thẻ y tế trên màn hình khóa.

**Website:**
- **Dải đỏ cố định trên đầu mọi trang:** “Nghi đột quỵ? Gọi 115 · Xem sơ cứu”. Trên điện thoại, chuyển thành **thanh 2 nút ở đáy** (Claude).
- **Phần đầu trang chia đôi** (Gemini):
  - Trái: khối đỏ khẩn cấp với nút “Gọi 115” và “Sơ cứu từng bước”.
  - Phải: **ô tìm kiếm** cùng các gợi ý (Claude) và nút “Kiểm tra dấu hiệu”.
- Bên dưới: 3 cánh cửa (Khẩn cấp · Kiểm tra · Phòng ngừa); BE-FAST và 5 dấu hiệu đỏ; ngộ nhận; danh sách bệnh viện.
- **Menu:** Nhận biết · Kiểm tra · **Sơ cứu** · Phòng ngừa · Sau đột quỵ · Hỏi đáp; nút “Aa” và “Nghe”.

### 6.3 Luồng cấp cứu tối ưu

| Bước | Màn hình | Lấy từ | Ngân sách thời gian |
|---|---|---|---|
| **0** | **Vào chế độ khẩn cấp** từ widget, lối tắt, nút đỏ hoặc thẻ dấu hiệu. Nền đỏ, ẩn thanh điều hướng, **giữ màn hình sáng**, đọc to tự động (tắt được) | Cả hai | ≤3 giây |
| **1** | **Gọi 115.** Nút gọi lớn nhất **trên cùng**. Câu mẫu để nói. Địa chỉ GPS chữ to. Chọn giờ LKW: Vừa xong · 15 phút · 30 phút · 1 giờ · 3 giờ · Ngủ dậy mới thấy · Không rõ. Đồng hồ khởi phát bắt đầu chạy. Có tùy chọn gửi SMS vị trí cho người thân | Claude + Gemini (SMS) | ≤10 giây |
| **2** | **“Người bệnh đang thế nào?”** 3 nút lớn: **① Không đáp ứng, không thở bình thường** · **② Lơ mơ, nôn, hoặc đang co giật** · **③ Tỉnh táo** | Gemini, rút gọn | 1 chạm |
| **3a** | Nếu chọn ①: **ép tim** với nhịp 110 lần/phút có tiếng và rung, hướng dẫn dùng AED, nhắc bật loa ngoài | Cả hai | Liên tục |
| **3b** | Nếu chọn ②: **nằm nghiêng an toàn**. Nếu đang co giật: dọn vật cứng, không ghì, không nhét gì vào miệng, dứt cơn thì nằm nghiêng | Gemini | Từng bước |
| **3c** | Nếu chọn ③: **nằm nghỉ**, nới quần áo, ở cạnh theo dõi. **Nếu vẫn chưa chắc có phải đột quỵ không, làm BE-FAST 60 giây** (dấu hiệu tự ghi vào thẻ bác sĩ) | Claude | Từng bước |
| **Mọi thẻ ở bước 3** | Mỗi thẻ là một việc, có hình minh họa. **Khung xanh “Nên làm” và khung đỏ “Cấm” (1–2 điều liên quan) đặt cạnh nhau.** Nút “Xong · Tiếp” ở vùng ngón cái. Thanh trên cùng luôn có **đồng hồ khởi phát và nút gọi 115 nhỏ** | Gemini + Claude | |
| **4** | **10 điều tuyệt đối không làm**: bấm “Vì sao?” để mở giải thích | Claude | 1 màn |
| **5** | **Thẻ báo bác sĩ:** 2 mốc giờ, cân nặng, thuốc chống đông (tô nổi), bệnh nền, dấu hiệu đã ghi, người thân. Nút gửi Zalo, SMS, phóng to toàn màn hình. Bệnh viện có đơn vị đột quỵ gần nhất | Claude + Gemini (cân nặng) | Khi xe tới |

Ghi chú kỹ thuật:
- Nút “Gọi 115” trên Android nên mở **bàn phím gọi đã điền sẵn 115**. Cách này không cần xin quyền gọi điện. Gọi thẳng thì phải xin quyền và chịu thêm ràng buộc chính sách của Google Play.
- Thước giờ vàng hiện đúng mức theo thời gian. **Không dùng đồng hồ đếm ngược “thời gian còn lại”** (lỗi trong ảnh concept của Gemini).

### 6.4 Bài kiểm tra tối ưu

**“Kiểm tra dấu hiệu ngay” (60 giây).** Câu hỏi:
1. Mặt (cười).
2. Tay: đồng hồ đếm 10 giây (học từ Gemini).
3. Lời nói: **một câu mẫu cố định** cho toàn app.
4. Thăng bằng.
5. Mắt.
6. 5 dấu hiệu đỏ.

Cách hoạt động:
- Mỗi câu có **Có / Không / Không chắc**, và đánh số là **“Bước”**, không gọi là “giai đoạn”.
- **Gặp “Có” hoặc “Không chắc” thì dừng ngay**, chuyển sang màn đỏ “Gọi 115”. Gemini gọi cơ chế này là “cắt mạch”.
- **Khi chưa trả lời, không hiện kết quả.**

| Kết quả | Màn hình |
|---|---|
| Có dấu hiệu, hoặc không chắc | **Màn đỏ: “Gọi 115 ngay”**, danh sách dấu hiệu đã ghi vào thẻ bác sĩ |
| Dấu hiệu đã tự hết | **Màn cam: “Cảnh báo sớm: đi cấp cứu trong hôm nay; tái lại thì gọi 115”** |
| Không thấy dấu hiệu | **Màn trung tính: “Chưa thấy dấu hiệu thường gặp. Kết quả này không loại trừ đột quỵ.”** Kèm danh sách dấu hiệu vẫn phải gọi 115 và gợi ý làm bài “Nguy cơ của tôi” |

**“Nguy cơ của tôi” (3 phút).** Dùng **đồng hồ bán nguyệt 4 mức của Gemini** cho trục nguy cơ: **Thấp · Trung bình · Cao · Rất cao**. Có phần “thử thay đổi” của Claude. Công thức tính phải do chuyên gia chọn và kiểm định (ví dụ dựa trên Stroke Riskometer). **Không hiện điểm số thập phân.**

**Thước giờ vàng** (chỉ dùng sau khi có dấu hiệu): Cảnh báo sớm (TIA) · Giờ vàng 0–4,5 giờ · Còn cơ hội 4,5–24 giờ · Trên 24 giờ. **Mức nào cũng phải gọi 115.**

### 6.5 Tra cứu và tìm kiếm

- **Bộ tìm kiếm của Claude:**
  - Bỏ dấu, tách từ, từ đồng nghĩa dân gian.
  - **Thẻ “Gọi 115” tự hiện khi gõ triệu chứng.**
  - Kết quả hiện **ngay dưới ô tìm**, không chuyển trang.
  - Có tìm bằng giọng nói.
- **Mẫu bài 3 lớp của Gemini:**
  - **Lớp 1:** tóm tắt 15–30 giây.
  - **Lớp 2:** khung Nên làm / Cấm.
  - **Lớp 3:** bằng chứng (mở rộng).
- Mỗi bài ghi tên người thẩm định và ngày cập nhật; có nút “Nghe bài”, “Aa”, “Gửi Zalo”.
- **Khung file `.md` cho mỗi bài:**
  - phần đầu file: `title`, `category`, `tldr` (lớp 1), `keywords` (từ dân gian), `reviewed_by`, `updated`;
  - các khối `:::cap-cuu`, `:::nen-lam`, `:::khong-lam` (lớp 2);
  - khối `:::bang-chung` (lớp 3).
  - Kết hợp khung trong `claude/docs/ui-ux/README.md` với ba lớp của Gemini.

### 6.6 Hệ thống thiết kế hợp nhất

**Màu** (đã đo tương phản):

| Token | Sáng | Tối | Dùng cho | Tương phản |
|---|---|---|---|---|
| `--primary` | `#115E59` (xanh ngọc đậm) | `#2DD4BF` | Nút chính, liên kết, kiến thức | Chữ trắng 7,58:1 (**AAA**); trên nền tối 9,5:1 |
| `--emergency` | `#B91C1C` | `#F87171` (chữ), `#DC2626` (nền nút) | **Chỉ cho cấp cứu** | Chữ trắng 6,47:1 |
| `--time` | `#F0B323` (vàng giờ vàng) | `#F5C451` | Đồng hồ khởi phát, thước giờ vàng | Chữ mực 9,5:1 |
| `--warn` | `#B45309` | `#F2A23A` | “Đi khám trong hôm nay”, thuốc chống đông | Chữ trắng 5,02:1 |
| `--do` | `#15803D` | `#4CC495` | Khung “Nên làm”, hoàn thành | Chữ trắng 5,02:1 |
| `--ink` / `--muted` | `#0F172A` / `#475569` | `#E6EDF3` / `#9DB0C2` | Chữ chính, chữ phụ | 16,96:1 / 7,20:1 |
| `--bg` | `#FAF9F6` (nền ấm, theo Gemini) | `#0F1A1F` | Nền chế độ bình tĩnh | |

Ghi chú về màu:
- Xanh ngọc của Gemini được **làm đậm hơn** (`#0F766E` → `#115E59`) để đạt AAA thật sự.
- Đỏ đổi từ `#DC2626` (4,83:1) sang `#B91C1C` (6,47:1).
- Vàng thời gian giữ của Claude.

**Chế độ hiển thị:** Theo máy (mặc định) · Ấm dịu · Tương phản cao · Ban đêm (theo Gemini). **Chế độ khẩn cấp giữ nền đỏ ở mọi chế độ.**

**Chữ:**
- Một họ **Be Vietnam Pro**.
- Ba mức: **18 / 21 / 24px** cho chữ nội dung (Claude). Mức thấp nhất của Gemini là 16px, nhỏ quá với người già.
- Chú thích và nhãn tối thiểu **14px**; tiêu đề khẩn cấp 32px.
- Bố cục phải chịu được cỡ chữ hệ thống 200%.

**Vùng chạm:** tối thiểu 48px (kể cả các nút chủ đề); chuẩn 56px; nút cấp cứu và nút Có/Không 72px; nút Gọi 115 từ 96px, rộng hết màn hình; khoảng cách giữa các nút tối thiểu 8–12px.

**Biểu tượng:** nét 2px, bo tròn, SVG, **luôn có nhãn chữ**; không dùng emoji trong giao diện.

**Chuyển động, âm thanh:**
- Chuyển màn 200ms, không hiệu ứng nảy.
- Rung 1 nhịp khi sang bước, 2 nhịp khi có kết quả đỏ.
- Tắt chuyển động khi máy bật “giảm chuyển động”.
- Đọc to ở tốc độ 0,9. Kiểm tra có giọng tiếng Việt; nếu không có thì hướng dẫn cài.

**Hình minh họa:** người Việt; mỗi hình một hành động. Hình nằm nghiêng phải **đúng tư thế** (đầu ngang, hơi ngửa); cần bác sĩ duyệt từng hình.

### 6.7 Công nghệ

Hai bên thống nhất: một mã nguồn web tĩnh, đóng gói `.apk` bằng **Capacitor**, nội dung lấy từ `.md` lúc build.

**Đề xuất cụ thể:**
- **Astro** cho website (đọc `.md` trực tiếp, nhanh, tốt cho tìm kiếm Google).
- **Capacitor** cho Android, kèm plugin cho:
  - widget, lối tắt, ô cài đặt nhanh, màn hình khóa (Kotlin);
  - giữ màn hình sáng; giọng đọc; rung; mở bàn phím gọi; SMS vị trí.
- Nội dung cấp cứu đóng gói sẵn trong `.apk`. Website dùng PWA để lưu đệm phần cấp cứu.

**Nguồn nội dung duy nhất:** `claude_merge_final.md`, tách thành các file bài viết theo khung ở mục 6.5.

---

## 7. Danh sách việc cần làm theo mức ưu tiên

**P0: bắt buộc trước bản thử nghiệm đầu tiên**

| # | Việc | Bên | Liên quan |
|---|---|---|---|
| 1 | Bỏ kết quả mặc định “Bình thường”; sửa câu kết quả âm tính | Thiết kế, nội dung | G1, G2 |
| 2 | Thêm “Không chắc” vào mọi câu kiểm tra, xử lý như “Có” | Thiết kế | G3 |
| 3 | Tách trục thời gian và trục mức độ nặng; bỏ nhãn “Muộn” cho đau đầu sét đánh | Thiết kế, nội dung | G4 |
| 4 | Đặt nút Gọi 115 trên cùng màn cấp cứu và luôn hiện ở mọi bước | Thiết kế | G5, C1 |
| 5 | Thước giờ vàng với các mức đúng; bỏ đồng hồ đếm ngược | Thiết kế | G6, ảnh concept |
| 6 | Thống nhất nguồn nội dung là `claude_merge_final.md`; bác sĩ duyệt | Nội dung | 4.6 |
| 7 | Sửa ảnh minh họa tư thế nằm nghiêng; bác sĩ duyệt mọi hình sơ cứu | Thiết kế, y khoa | 4.5 |

**P1: cần có trong bản phát hành đầu**

| # | Việc | Liên quan |
|---|---|---|
| 8 | Màn “Người bệnh đang thế nào?” 3 lựa chọn; thẻ Nên/Cấm đặt cạnh nhau | C2, C3 |
| 9 | Chế độ khẩn cấp khác biệt: nền đỏ, ẩn điều hướng, giữ màn hình sáng, đọc to | G12, C6 |
| 10 | Bộ tìm kiếm thông minh, kết quả tại chỗ, thẻ 115 khi gõ triệu chứng | G7, G8 |
| 11 | Tách bài “Kiểm tra dấu hiệu” và “Nguy cơ của tôi”; đổi tên trục nguy cơ | G9, G10 |
| 12 | Ghi giờ LKW đủ mốc, có “Không rõ” | G13 |
| 13 | Chữ tối thiểu 14px, mặc định 18px; vùng chạm tối thiểu 48px | C4, C5, 4.4 |
| 14 | Màu mới đạt AAA cho nút chính và nút cấp cứu; chế độ tương phản cao thật | 4.4, C7 |
| 15 | Bộ biểu tượng SVG thay emoji | G14 |
| 16 | Widget 2×2 và 4×2, lối tắt Gọi 115, thẻ y tế trên màn hình khóa | 6.2 |
| 17 | Mẫu bài viết 3 lớp | C10 |

**P2: giai đoạn sau**

| # | Việc |
|---|---|
| 18 | Hồ sơ gia đình (con cài cho bố mẹ) |
| 19 | Bản đồ bệnh viện có đơn vị đột quỵ |
| 20 | Nhắc đo huyết áp, uống thuốc, biểu đồ |
| 21 | Câu đố, huy hiệu cho người trẻ |
| 22 | Tự kiểm tra bằng cảm biến (chỉ hỗ trợ, không bao giờ kết luận âm tính) |

---

## 8. Kế hoạch thử nghiệm với người dùng

Làm trước khi phát hành, với bản prototype hợp nhất.

| Nhóm | Số người | Nhiệm vụ | Chỉ số đạt |
|---|---|---|---|
| Người từ 60 tuổi | 8–10 | Từ màn hình chính, gọi 115 cho người nhà nghi đột quỵ | Mở được bàn phím gọi **dưới 10 giây**; không bấm nhầm |
| Con cháu chăm người già | 8–10 | Làm theo hướng dẫn khi người bệnh nôn và lơ mơ | Chọn đúng tình huống, đặt nằm nghiêng đúng; không làm điều cấm |
| Người dùng chung | 10 | Làm bài kiểm tra dấu hiệu với các kịch bản dựng sẵn | **0 người** hiểu kết quả âm tính là “không sao” |
| Người dùng chung | 10 | Tìm “trúng gió”, “tê tay”, “an cung” | Mở đúng bài trong 2 lần thử |
| Người có thị lực kém | 5 | Đọc thẻ bác sĩ ở cỡ chữ lớn nhất, ngoài trời | Đọc đúng giờ LKW và tên thuốc chống đông |

Thử thêm trong **điều kiện căng thẳng**: bấm giờ, có tiếng ồn, cầm máy một tay. Ghi lại mọi chỗ người dùng ngập ngừng quá 3 giây.

---

## 9. Phụ lục: số liệu kiểm thử

### 9.1 Demo Gemini (`gemini/docs/ui-ux/demo-giao-dien.html`)

| Kiểm tra | Kết quả |
|---|---|
| Lỗi JavaScript | Không có |
| Tràn ngang ở 390px (Website, App, cỡ chữ A++) | 0px |
| Kết quả bài test khi chưa trả lời | “🟢 MỨC 1: BÌNH THƯỜNG / NGUY CƠ NỀN THẤP” |
| Trả lời bình thường cả 5 bước | “Hiện tại khuôn mặt, vận động hai tay, lời nói và thăng bằng ổn định…” (không có lưu ý) |
| Chọn “đau đầu sét đánh” ở bước 3 | “🔴 MỨC 4: GIAI ĐOẠN MUỘN / NGUY KỊCH” |
| Lựa chọn ở bước 1 | 3 lựa chọn, không có “Không chắc” |
| Ghi LKW cách đây 30 giờ | “Đã trôi qua 1800 phút… Đang trong cửa sổ cấp cứu!” |
| Vị trí nút Gọi 115 trong màn sơ cứu | Máy tính: y=763/900px. Điện thoại: y=2.537px (màn hình cao 844px) |
| Gõ “meo mieng” ở trang chủ | Chuyển sang Cẩm nang, ô tìm kiếm bị ẩn |
| Tìm “te tay” | Không có kết quả (dù ô tìm gợi ý từ này) |
| Tìm “tai bien”, “trung gio” | Chỉ ra bài chích máu |
| Nút dưới 44px đang hiện | 14 nút cao 38px (gồm 3 nút chủ đề tra cứu; còn lại là thanh điều khiển của demo) |
| Cỡ chữ thực tế ở mức A | 12px: 15 đoạn · 13px: 28 · 14px: 6 · 15px: 4 · 16px: 18 · lớn hơn: 10 |
| Giữ màn hình sáng | Không có trong mã |

### 9.2 Prototype Claude (`claude/docs/ui-ux/ban-thiet-ke.html`)

| Kiểm tra | Kết quả |
|---|---|
| Lỗi JavaScript | Không có |
| Vị trí nút Gọi 115 trong màn cấp cứu | Cách đầu khung điện thoại khoảng 180px (khung cao 722px) |
| Nút dưới 44px | Màn Tra cứu: 5 nút gợi ý 40px. Màn Hồ sơ: 3 nút cỡ chữ 36px. Thẻ bác sĩ: liên kết “làm BE-FAST” 20px |
| Cỡ chữ thực tế ở trang chủ (cỡ thường) | 13px: 7 đoạn · 14px: 11 · 15px: 2 · 16px: 1 · 17px: 7 · 18px: 1 · 24px: 7 |

### 9.3 Độ tương phản (công thức WCAG)

| Cặp màu | Tỷ lệ | Mức |
|---|---|---|
| Gemini: chữ trắng trên `#0F766E` | 5,47:1 | AA |
| Gemini: chữ trắng trên `#DC2626` | 4,83:1 | AA (README ghi 5,6:1) |
| Gemini: chữ đỏ `#DC2626` trên nền đỏ nhạt `#FEF2F2` | 4,41:1 | **Dưới AA** cho chữ thường |
| Gemini: cung vàng `#D97706` trên đồng hồ | 3,19:1 với nền trắng | Chỉ dùng làm mảng màu, không dùng cho chữ |
| Đề xuất: chữ trắng trên `#115E59` | 7,58:1 | **AAA** |
| Đề xuất: chữ trắng trên `#B91C1C` | 6,47:1 | AA, gần AAA |
| Đề xuất: chữ `#B91C1C` trên `#FEF2F2` | 5,91:1 | AA |
| Đề xuất: chữ mực trên vàng `#F0B323` | 9,50:1 | AAA |

---

*Báo cáo review thiết kế giao diện. Mọi nội dung y khoa hiển thị trong sản phẩm phải theo `claude_merge_final.md` và được bác sĩ thẩm định trước khi phát hành.*
