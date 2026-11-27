# Bản thiết kế UI/UX · Giờ Vàng (tên tạm)

Website + app Android về phòng chống và sơ cứu đột quỵ. Bản 0.1 · 27/11/2026.

- **Bản đầy đủ có prototype bấm thử được:** mở `docs/ui-ux/ban-thiet-ke.html` bằng trình duyệt.
- Nội dung y khoa trong bản mẫu chỉ để minh hoạ bố cục, sẽ thay bằng tài liệu `.md` chính thức và cần bác sĩ duyệt.

## Luận điểm

Đột quỵ chưa điều trị làm não mất khoảng 1,9 triệu tế bào thần kinh mỗi phút (Saver, *Stroke* 2006). Mọi quyết định giao diện phải trả lời: nó giúp người dùng hành động nhanh hơn hay chậm lại?

| Chỉ tiêu | Giá trị |
|---|---|
| Từ mọi màn hình tới nút gọi 115 | 1 chạm |
| Từ lúc mở app tới bước sơ cứu đầu tiên | ≤ 3 giây |
| Cỡ chữ nội dung mặc định | 18sp, phóng được 200% |
| Vùng chạm | tối thiểu 48dp, chuẩn 56dp, nhịp khẩn ≥ 72dp, nút Gọi 115 ≥ 96dp |

## 8 nguyên tắc (kèm câu hỏi duyệt thiết kế)

1. **Hai nhịp trong một app.** Khẩn: đỏ, ít chữ, một việc mỗi màn hình, tự đọc to. Bình tĩnh: dịu, có cấu trúc. *Màn hình này thuộc nhịp nào?*
2. **115 luôn cách tối đa một chạm.** *Từ đây gọi 115 mất mấy chạm?*
3. **Không bao giờ trấn an sai.** Không bao giờ ghi “Bạn không bị đột quỵ”. *Câu này có khiến ai chần chừ không?*
4. **Màu là tín hiệu.** Đỏ = cấp cứu, vàng = thời gian, lam = kiến thức, xanh lá = phòng ngừa; luôn kèm icon + chữ. *Người mù màu có hiểu không?*
5. **Viết như nói.** Từ đời thường trước, thuật ngữ sau; câu hướng dẫn bắt đầu bằng động từ. *Người 70 tuổi có hiểu ngay?*
6. **Nghe được, không cần đọc.** Giọng đọc tiếng Việt, minh hoạ, rung. *Nhắm mắt có làm theo được?*
7. **Vùng ngón cái.** Nút chính ở nửa dưới, rộng hết chiều ngang; không thao tác quan trọng nào chỉ dùng vuốt/nhấn giữ. *Cầm một tay, run tay có bấm trúng?*
8. **Đáng tin, kiểm chứng được.** Bác sĩ thẩm định, ngày cập nhật, nguồn; không cần đăng nhập; cấp cứu chạy offline.

## Thước giờ vàng (ý tưởng “rất sớm – sớm – bình thường – muộn”)

Giai đoạn **tính bằng thời gian** từ lúc người bệnh được thấy bình thường lần cuối, không đo bằng bài test. Bài test chỉ trả lời “có dấu hiệu hay không”.

| Ý tưởng ban đầu | Tên trong app | Xác định bằng | App làm gì | Bài kiểm tra |
|---|---|---|---|---|
| (trước dấu hiệu) | Phòng ngừa · Thấp/Trung bình/Cao/Rất cao | Câu hỏi yếu tố nguy cơ | Kế hoạch giảm nguy cơ, nhắc đo huyết áp | Nguy cơ của tôi · 3 phút |
| Rất sớm | Cảnh báo sớm (TIA) | Dấu hiệu xuất hiện rồi tự hết | “Đi khám cấp cứu trong hôm nay”; tái lại thì gọi 115 | Dấu hiệu đã tự hết? · 1 phút |
| Sớm | Giờ vàng · 0–4,5 giờ | Giờ lần cuối bình thường | Gọi 115, đồng hồ, BV có đơn vị đột quỵ | BE-FAST · 60 giây |
| Bình thường | **Còn cơ hội** · 4,5–24 giờ | như trên | Gọi 115; vẫn có thể điều trị | BE-FAST |
| Muộn | Muộn · > 24 giờ | như trên | Vẫn đi viện ngay | BE-FAST |

“Bình thường” được đổi thành “Còn cơ hội” vì người đang hoảng dễ đọc thành “không sao”. Cả 3 mức sau khởi phát đều → gọi 115.

### Quy tắc kết quả bài kiểm tra

- **BE-FAST:** 5 câu (B, E, F, A, S) với Có / Không / Không chắc. Chỉ một “Có” **hoặc** “Không chắc” → màn hình đỏ Gọi 115; dấu hiệu tự ghi vào thẻ bàn giao. Tất cả “Không” → “Chưa thấy dấu hiệu BE-FAST, kết quả không loại trừ đột quỵ” + danh sách dấu hiệu khác cần gọi 115.
- **Dấu hiệu đã tự hết?:** “Có” → thẻ cam “Rất sớm · Cảnh báo”, nguy cơ cao nhất trong 48 giờ, đi khám trong hôm nay.
- **Nguy cơ của tôi:** 4 mức + phần “thử thay đổi”. Công thức phải do chuyên gia chọn và kiểm định.
- **Cảm biến (giai đoạn 3):** chỉ được nói “có dấu hiệu, gọi 115”, không bao giờ kết luận âm tính.

## Kiến trúc thông tin

**App** (thanh điều hướng 5 mục, Cấp cứu đỏ ở giữa): Trang chủ · Kiểm tra · **Cấp cứu** · Tra cứu · Hồ sơ.
- Cấp cứu (offline): Gọi 115 + câu mẫu + địa chỉ GPS → ghi giờ → sơ cứu 5 bước (đọc to, nhịp ép tim) → tuyệt đối không làm → thẻ bàn giao + bệnh viện gần nhất.
- Lối vào không cần mở app: widget 2×2, App Shortcuts, Quick Settings tile, màn hình khoá (thẻ y tế).

**Website:** dải “Gọi 115 · Sơ cứu” trên mọi trang (trên điện thoại thành thanh 2 nút ở đáy) · trang chủ = ô tìm kiếm + 3 cánh cửa (Khẩn cấp / Kiểm tra / Phòng ngừa) · Nhận biết · Kiểm tra · Sơ cứu · Phòng ngừa · Sau đột quỵ · Ngộ nhận & Hỏi đáp · Bệnh viện. Mỗi dấu hiệu, mỗi ngộ nhận là một trang riêng (SEO).

**Tìm kiếm:** không dấu (`meo mieng`), từ dân gian (`trúng gió`, `tai biến`, `méo mồm`), giọng nói; câu hỏi giống triệu chứng → thẻ đỏ Gọi 115 lên đầu.

## Token thiết kế

| Token | Sáng | Tối | Dùng cho |
|---|---|---|---|
| `--red-fill` | `#C8261C` | `#D2382D` | Chỉ cấp cứu (chữ trắng 5,6:1 / 4,8:1) |
| `--gold` | `#F0B323` | `#F5C451` | Thời gian, cửa sổ điều trị |
| `--gold-ink` | `#7A5300` | `#F5C451` | Chữ màu vàng |
| `--amber-line` / `--amber` | `#E08A00` / `#A35200` | `#F2A23A` | “Đi khám trong hôm nay”, chống đông |
| `--navy` | `#1F4F82` | `#8DB8E8` | Màu chính, kiến thức |
| `--green` | `#157A55` | `#4CC495` | Phòng ngừa, hoàn thành |
| `--ink` | `#0F1E2B` | `#E6EDF3` | Chữ chính |
| `--ink-2` | `#4A5B6C` | `#9DB0C2` | Chữ phụ |
| `--paper` / `--surface` | `#F3F6F9` / `#FFFFFF` | `#0C141C` / `#131E29` | Nền |
| `--late1` / `--late2` | `#9E1C14` / `#5E120C` | `#A3241A` / `#6B1710` | Thước giờ vàng 4,5–24h / > 24h |

**Chữ:** tiêu đề *Lexend* (có tiếng Việt), nội dung *Be Vietnam Pro*.

| Vai trò | Font | Cỡ |
|---|---|---|
| Khẩn cấp | Lexend 800 | 32/40sp |
| Tiêu đề 1 | Lexend 700 | 28/36sp |
| Tiêu đề 2 | Lexend 700 | 22/30sp |
| Nội dung | Be Vietnam Pro 400 | 18/28sp (mặc định) |
| Phụ | Be Vietnam Pro 400 | 16/24sp |
| Chú thích | Be Vietnam Pro 600 | 14/20sp (tối thiểu) |

3 mức cỡ chữ trong app: 18 / 21 / 24sp, nhân thêm theo cỡ chữ hệ thống.

**Thành phần chính:** nút cấp cứu · thẻ hành động 3 cấp (Gọi 115 ngay / Đi khám hôm nay / Theo dõi) · câu trả lời Có/Không/Không chắc · thẻ “Không làm” · đồng hồ khởi phát + thước giờ vàng · công tắc cả dòng.

**Chuyển động:** trượt 200ms, không hoạt ảnh trang trí trong nhịp khẩn, rung 1 nhịp khi sang bước / 2 nhịp khi kết quả đỏ, tắt khi bật giảm chuyển động.

## Khung nội dung `.md` đề xuất

```md
---
title: Sơ cứu khi nghi đột quỵ
category: so-cuu   # nhan-biet | so-cuu | phong-ngua | sau-dot-quy | ngo-nhan | hoi-dap
summary:           # Tóm tắt 30 giây, tối đa 3 ý
  - Gọi 115, ghi lại giờ lần cuối thấy bình thường.
  - Cho nằm ở tư thế an toàn, không cho ăn uống.
  - Không chích máu, không tự cho uống thuốc.
keywords: [trúng gió, tai biến, méo miệng, méo mồm]
reviewed_by: BS. ...
updated: 2026-11-20
---

:::cap-cuu
Có bất kỳ dấu hiệu BE-FAST nào xuất hiện đột ngột.
:::

:::cac-buoc
1. **Gọi 115 và ghi lại giờ** | Nói rõ “nghi đột quỵ”, đọc địa chỉ. | hinh: goi-115.svg
2. **Đặt người bệnh nằm nghiêng** | Nếu lơ mơ hoặc nôn. | hinh: nam-nghieng.svg
:::

:::khong-lam
- Chích máu đầu ngón tay | Không khơi thông mạch máu não, mất thời gian vàng.
:::

## Nội dung chi tiết (Markdown bình thường)
```

## Gợi ý công nghệ (chưa chốt)

Website: **Astro** (đọc thẳng `.md`, nhanh, tốt cho SEO). App: **Capacitor** đóng gói chung giao diện thành `.apk`, thêm plugin Kotlin nhỏ cho widget, App Shortcuts, Quick Settings tile, màn hình khoá. Phương án khác: Flutter cho app (website kém SEO hơn).

## Trước khi phát hành

- Bác sĩ thẩm định mọi nội dung; hiển thị tên + ngày cập nhật.
- Ghi rõ không phải thiết bị y tế, không chẩn đoán.
- Google Play: khai báo *Health apps declaration*, chính sách quyền riêng tư, lời khuyến cáo trong mô tả app.
- Dữ liệu sức khoẻ lưu trên máy, mã hoá; chỉ chia sẻ khi người dùng bấm gửi.
- Thử với người dùng trên 60 tuổi và trong điều kiện bấm giờ.

## Nguồn chính

- American Red Cross First Aid app · AHA/ASA Spot a Stroke F.A.S.T. · WSO Stroke Riskometer
- FAST-AI (AHA Newsroom 2023, Healio 2024) · Tanglay và cs., *J Clin Med* 2024 (BE-FAST vs FAST)
- NHS Design System – Care cards · Nielsen Norman Group – Usability for seniors · Google – Material 3 Expressive research
- Canadian Stroke Best Practices (cửa sổ điều trị) · Saver 2006 (*Time is brain*) · nghiên cứu nguy cơ sau TIA
- VnExpress, BV Tâm Anh, Đại biểu Nhân dân (ngộ nhận sơ cứu) · VOH, Angels Initiative (trung tâm đột quỵ VN) · Znews (Zalo)
- Google Play – chính sách app sức khoẻ

Đường dẫn đầy đủ nằm ở cuối `ban-thiet-ke.html`.
