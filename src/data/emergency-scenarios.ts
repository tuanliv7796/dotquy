export interface EmergencyBranch {
  id: 'arrest' | 'airway' | 'seizure' | 'awake' | 'wakeup' | 'tia';
  gateGroup: 'arrest' | 'airway' | 'awake';
  shortLabel: string;
  badge: string;
  title: string;
  lead: string;
  illustrationKey: 'cprChest' | 'recoveryPosition' | 'seizureSafety' | 'awakeRest';
  showCprMetronome: boolean;
  dos: string[];
  donts: string[];
}

export const LKW_PRESETS: { id: string; minutesAgo: number | null; isWakeUp?: boolean; label: string }[] = [
  { id: 'now', minutesAgo: 0, label: 'Vừa mới xảy ra' },
  { id: '15m', minutesAgo: 15, label: '15 phút trước' },
  { id: '30m', minutesAgo: 30, label: '30 phút trước' },
  { id: '60m', minutesAgo: 60, label: '1 giờ trước' },
  { id: '180m', minutesAgo: 180, label: '3 giờ trước' },
  { id: 'wakeup', minutesAgo: null, isWakeUp: true, label: 'Ngủ dậy mới thấy (Wake-up)' },
  { id: 'unknown', minutesAgo: null, isWakeUp: false, label: 'Không rõ giờ' },
];

export const SURVIVAL_GATE_OPTIONS: {
  group: 'arrest' | 'airway' | 'awake';
  defaultBranch: EmergencyBranch['id'];
  severityColor: 'red' | 'warn' | 'teal';
  title: string;
  subtitle: string;
}[] = [
  {
    group: 'arrest',
    defaultBranch: 'arrest',
    severityColor: 'red',
    title: '1. Bất tỉnh & Không thở bình thường (hoặc thở ngáp cá)',
    subtitle: 'Gọi không đáp ứng, lồng ngực không phập phồng bình thường → Mở ngay nhịp ép tim CPR 110 lần/phút',
  },
  {
    group: 'airway',
    defaultBranch: 'airway',
    severityColor: 'warn',
    title: '2. Lơ mơ, Nôn ói, Nuốt sặc hoặc Đang lên cơn co giật',
    subtitle: 'Nguy cơ sặc vào phổi rất cao → Đặt nằm nghiêng an toàn hoặc bảo vệ đầu chống va đập',
  },
  {
    group: 'awake',
    defaultBranch: 'awake',
    severityColor: 'teal',
    title: '3. Vẫn tỉnh táo (Méo miệng, yếu tay chân, nói khó, chóng mặt, mờ mắt...)',
    subtitle: 'Bao gồm cả trường hợp Ngủ dậy mới phát hiện (Wake-up) hoặc Triệu chứng vừa tự hết (TIA)',
  },
];

export const EMERGENCY_BRANCHES: Record<EmergencyBranch['id'], EmergencyBranch> = {
  arrest: {
    id: 'arrest',
    gateGroup: 'arrest',
    shortLabel: 'Ngừng thở / Ngáp cá (CPR)',
    badge: 'TỐI KHẨN CẤP • HỒI SỨC TIM PHỔI (AHA CPR 2025)',
    title: 'Ép tim ngoài lồng ngực ngay lập tức theo nhịp 110 lần/phút!',
    lead: 'Khi người bệnh bất tỉnh và không thở bình thường (hoặc chỉ thở ngáp cá từng tiếng rời rạc), mỗi phút chậm ép tim giảm 7%–10% cơ hội sống. Hãy bật loa ngoài cuộc gọi 115 và ép tim liên tục!',
    illustrationKey: 'cprChest',
    showCprMetronome: true,
    dos: [
      'Đặt người bệnh NẰM NGỬA trên mặt phẳng cứng (sàn nhà). Bật loa ngoài điện thoại để vừa ép tim vừa nghe điều phối viên 115.',
      'Đặt gót 2 bàn tay chồng lên nhau ở CHÍNH GIỮA XƯƠNG ỨC, duỗi thẳng khuỷu tay, dùng sức nặng thân trên ấn thẳng xuống sâu 5–6 cm.',
      'Giữ tần số 100–120 lần/phút (bấm nút bật tiếng bíp 110 nhịp/phút ngay bên trên), để lồng ngực nảy lên hoàn toàn sau mỗi lần ép.',
      'Nhờ người xung quanh tìm máy sốc điện tự động (AED) nếu ở nơi công cộng và thay người ép mỗi 2 phút.',
    ],
    donts: [
      'KHÔNG mất thời gian mò bắt mạch cổ nếu bạn không phải nhân viên y tế.',
      'KHÔNG nhầm lẫn tiếng thở ngáp cá (thở hước ngắt quãng) là người bệnh vẫn còn thở bình thường.',
      'KHÔNG kê gối cao dưới đầu khi đang ép tim và KHÔNG dừng ép tim quá 10 giây cho tới khi kíp 115 tiếp quản.',
    ],
  },

  airway: {
    id: 'airway',
    gateGroup: 'airway',
    shortLabel: 'Lơ mơ / Nôn ói / Sặc đờm',
    badge: 'ƯU TIÊN SỐ 1 • BẢO VỆ ĐƯỜNG THỞ CHỐNG SẶC',
    title: 'Xoay ngay sang Tư thế Nằm nghiêng an toàn!',
    lead: 'Người đột quỵ kèm lơ mơ, ngủ gà, nôn vọt hoặc sặc đờm dãi (rất hay gặp ở xuất huyết não và đột quỵ thân não/tiểu não) có thể tử vong trong vài phút nếu dịch nôn tràn vào phổi.',
    illustrationKey: 'recoveryPosition',
    showCprMetronome: false,
    dos: [
      'Nhẹ nhàng xoay đồng trục cơ thể người bệnh NẰM NGHIÊNG sang một bên (tay trên đỡ dưới má, chân trên co lại giữ vững tư thế).',
      'Giữ đầu ngang trục cột sống, hơi ngửa nhẹ tự nhiên để đờm dãi và chất nôn tự chảy ra ngoài khóe miệng.',
      'Chỉ tháo răng giả bị lỏng ở ngoài miệng nếu dễ lấy; dùng khăn sạch lau dịch ở khóe miệng ngoài.',
      'Theo dõi sát nhịp thở từng phút; nếu ngừng thở bình thường thì lật ngửa trên sàn cứng để ép tim ngay.',
    ],
    donts: [
      'CẤM ĐỂ NẰM NGỬA khi đang nôn, sặc hoặc bất tỉnh (gây tụt gốc lưỡi và hít sặc dịch dạ dày vào phổi).',
      'CẤM để đầu thấp hơn thân mình (làm tăng áp lực nội sọ nguy hiểm).',
      'CẤM móc tay sâu vào họng mù quáng, CẤM đút nước lọc, nước gừng, nước chanh hay An Cung Ngưu Hoàng Hoàn.',
    ],
  },

  seizure: {
    id: 'seizure',
    gateGroup: 'airway',
    shortLabel: 'Đang lên cơn co giật',
    badge: 'CHỐNG CHẤN THƯƠNG & DỊ VẬT ĐƯỜNG THỞ (AHA 2024)',
    title: 'Lót mềm dưới đầu — Tuyệt đối KHÔNG nhét bất cứ vật gì vào miệng!',
    lead: 'Cơn co giật giờ đầu gặp ở 2%–23% ca đột quỵ cấp (đặc biệt xuất huyết vỏ não và huyết khối tĩnh mạch não). Sai lầm nguy hiểm nhất tại Việt Nam là cạy răng nhét đũa, thìa hoặc ngón tay vào miệng.',
    illustrationKey: 'seizureSafety',
    showCprMetronome: false,
    dos: [
      'Đỡ người bệnh nằm xuống sàn an toàn, dọn sạch bàn ghế, vật cứng, sắc nhọn xung quanh và lót khăn/áo mềm dưới đầu.',
      'Nới lỏng cổ áo, cà vạt, kính mắt; bấm giờ theo dõi thời gian cơn co giật để báo bác sĩ 115.',
      'Ngay khi cơn giật vừa dứt và người bệnh còn lơ mơ, xoay nhẹ sang TƯ THẾ NẰM NGHIÊNG AN TOÀN để đờm dãi thoát ra.',
    ],
    donts: [
      'CẤM TUYỆT ĐỐI cạy hàm, nhét đũa, muỗng, khăn hay ngón tay vào miệng (người co giật không tự nuốt lưỡi, nhưng vật nhét vào gây gãy răng bít khí quản!).',
      'CẤM đè ghì chặt tay chân người bệnh đang giật mạnh (gây trật khớp, gãy xương).',
      'CẤM vắt chanh hay đổ bất kỳ chất lỏng/thuốc nào vào miệng.',
    ],
  },

  awake: {
    id: 'awake',
    gateGroup: 'awake',
    shortLabel: 'Tỉnh táo (Đang có dấu hiệu)',
    badge: 'QUY TRÌNH CHUẨN TRONG LÚC CHỜ XE 115',
    title: 'Đặt nằm nghỉ yên thoải mái, nhịn ăn uống tuyệt đối & chuẩn bị vỏ thuốc',
    lead: 'Dù người bệnh vẫn tỉnh táo nói chuyện được hay triệu chứng có vẻ nhẹ, tuyệt đối không chủ quan tự theo dõi ở nhà. Giữ người bệnh nghỉ yên để bảo toàn dòng máu nuôi vùng não tranh tối tranh sáng.',
    illustrationKey: 'awakeRest',
    showCprMetronome: false,
    dos: [
      'Đỡ người bệnh nằm hoặc tựa nghỉ ở tư thế thoải mái nhất, không tự đứng dậy đi lại (tránh ngã chấn thương sọ não).',
      'Nới lỏng cổ áo, thắt lưng, giữ phòng thoáng khí; trấn an nhẹ nhàng tránh xúc động mạnh.',
      'Gom toàn bộ đơn thuốc và vỏ thuốc đang uống (đặc biệt THUỐC CHỐNG ĐÔNG), CCCD/BHYT; mở rộng cửa đón xe 115.',
    ],
    donts: [
      'CẤM TỰ CHO UỐNG THUỐC HẠ HUYẾT ÁP (kể cả huyết áp đo thấy 180–210 mmHg — hạ áp mù trước chụp CT làm lan rộng ổ nhồi máu não theo RCT INTERACT4!).',
      'CẤM tự uống Aspirin, thuốc chống đông hay An Cung Ngưu Hoàng Hoàn (làm chảy máu não ồ ạt nếu là thể xuất huyết).',
      'CẤM ăn uống bất cứ thứ gì (kể cả nước lọc), CẤM chích máu 10 đầu ngón tay/dái tai, CẤM cạo gió, CẤM xoa bóp cổ, CẤM chở bằng xe máy.',
    ],
  },

  wakeup: {
    id: 'wakeup',
    gateGroup: 'awake',
    shortLabel: 'Ngủ dậy mới thấy (Wake-up)',
    badge: 'ĐỘT QUỴ KHI THỨC DẬY • VẪN CÒN CƠ HỘI CỨU NÃO TỚI 24 GIỜ',
    title: 'Gọi 115 đưa thẳng tới bệnh viện có chụp MRI / CT tưới máu ngay!',
    lead: 'Khoảng 14%–27% ca nhồi máu não phát hiện lúc thức dậy. Hướng dẫn Bộ Y tế (QĐ 3312/QĐ-BYT) và AHA/ASA 2026 cho phép cứu não tới 9–24 giờ nhờ chụp MRI (DWI–FLAIR) hoặc CT tưới máu!',
    illustrationKey: 'awakeRest',
    showCprMetronome: false,
    dos: [
      'Gọi 115 ngay lập tức, báo rõ phát hiện lúc thức dậy để điều phối đến trung tâm có chụp MRI hoặc CT tưới máu & can thiệp mạch.',
      'Ghi lại chính xác 2 mốc: (1) Giờ cuối cùng còn bình thường tối qua trước khi ngủ (LKW) và (2) Giờ thức dậy phát hiện.',
      'Kiểm tra nhanh lịch sử cuộc gọi/tin nhắn trên điện thoại người bệnh xem đêm qua có thức dậy dùng máy lúc mấy giờ không để giúp bác sĩ thu hẹp mốc LKW.',
    ],
    donts: [
      'KHÔNG bỏ cuộc hay chần chừ ở nhà vì nghĩ "đã ngủ qua đêm là hết giờ vàng".',
      'KHÔNG ăn sáng, không uống nước hay tự uống cữ thuốc huyết áp/tiểu đường buổi sáng trước khi bác sĩ chụp CT và kiểm tra phản xạ nuốt.',
      'KHÔNG xoa dầu nóng bóp tay chân rồi chờ tới giờ hành chính vì tưởng "nằm ngủ đè cấn tê tay".',
    ],
  },

  tia: {
    id: 'tia',
    gateGroup: 'awake',
    shortLabel: 'Dấu hiệu vừa tự hết (TIA)',
    badge: 'BÁO ĐỘNG ĐỎ CƠN THIẾU MÁU NÃO THOÁNG QUA (TIA)',
    title: 'Triệu chứng tự khỏi sau 5–15 phút VẪN LÀ CẤP CỨU KHẨN!',
    lead: 'Cục máu đông vừa bít mạch não rồi tạm trôi đi. Nguy cơ tái tắc gây đột quỵ liệt hoàn toàn dồn cực cao vào 24–48 giờ đầu (cấp cứu khẩn ngay giúp giảm ~80% nguy cơ theo nghiên cứu EXPRESS).',
    illustrationKey: 'awakeRest',
    showCprMetronome: false,
    dos: [
      'Đưa ngay lập tức tới Khoa Cấp cứu bệnh viện có Đơn vị Đột quỵ (Gọi 115 hoặc đi ô tô cấp cứu ngay, không chờ lịch khám thường).',
      'Ghi lại rõ triệu chứng vừa xảy ra (méo bên nào, yếu tay nào, mờ mắt nào, bắt đầu mấy giờ, kéo dài bao nhiêu phút) vào Thẻ báo bác sĩ.',
      'Nếu triệu chứng tái xuất hiện trên đường đi, gọi lại 115 cập nhật ngay.',
    ],
    donts: [
      'TUYỆT ĐỐI KHÔNG để người bệnh tự lái xe máy hay ô tô đi khám (cơn liệt thật có thể ập đến ngay khi đang cầm lái).',
      'KHÔNG thở phào đi ngủ tiếp hay đợi chiều tối / cuối tuần mới đi khám.',
      'KHÔNG tự ra hiệu thuốc mua Aspirin hay An Cung uống trước khi bác sĩ chụp phim loại trừ chảy máu não nhỏ.',
    ],
  },
};

export const TEN_ABSOLUTE_DONTS: { title: string; reason: string; source: string }[] = [
  {
    title: '1. Không tự cho uống hoặc ngậm thuốc hạ huyết áp tại nhà',
    reason: 'Trong nhồi máu não cấp (chiếm ~77%–80%), cơ thể phản xạ nâng huyết áp để bơm máu qua hệ tuần hoàn bàng hệ nuôi vùng não đang thiếu máu. Thử nghiệm ngẫu nhiên lớn INTERACT4 (NEJM 2024, n=2.404) chứng minh hạ huyết áp trước khi chụp CT sọ não gây hại có ý nghĩa thống kê ở bệnh nhân nhồi máu não (OR 1,30 làm tăng tàn phế).',
    source: 'INTERACT4 (NEJM 2024) · ESO BP Guideline 2025/2026',
  },
  {
    title: '2. Không tự cho uống Aspirin hoặc thuốc chống đông',
    reason: 'Khác hoàn toàn với nhồi máu cơ tim, triệu chứng bên ngoài không thể phân biệt nhồi máu não với xuất huyết não (~18%–20%). Uống Aspirin trên ca xuất huyết não làm máu chảy lan rộng không cầm được và làm mất cơ hội phẫu thuật.',
    source: 'AHA/ASA AIS 2026 & ICH 2022 · QĐ 3312/QĐ-BYT',
  },
  {
    title: '3. Không cho uống An Cung Ngưu Hoàng Hoàn',
    reason: 'Thử nghiệm mù đôi đa trung tâm ANGONG TRIAL (2024/2025) cho kết cục chính âm tính, chống chỉ định trong xuất huyết não, viên hoàn lớn cực dễ gây tắc thở/viêm phổi hít ở người rối loạn nuốt, và công thức truyền thống chứa Thủy ngân (Chu sa), Asen (Hùng hoàng).',
    source: 'ANGONG TRIAL (PMID 39501831) · Cảnh báo BV TWQĐ 108 & Bộ Y tế',
  },
  {
    title: '4. Không chích máu 10 đầu ngón tay, ngón chân hoặc dái tai',
    reason: 'Nặn vài giọt máu mao mạch ngoại vi hoàn toàn không làm thông được động mạch não đang tắc hay cầm máu não đang vỡ. Ngược lại, cơn đau buốt làm vọt huyết áp giao cảm, gây nguy cơ nhiễm trùng và làm lỡ mất Giờ Vàng.',
    source: 'Kim & Han Systematic Review 2024 (PMC11507497) · AHA First Aid 2024',
  },
  {
    title: '5. Không cho ăn hay uống bất cứ thứ gì (kể cả nước lọc, nước gừng, nước chanh)',
    reason: 'Tới 40%–65% người đột quỵ cấp bị liệt phản xạ hầu họng kín đáo. Chỉ vài thìa nước lọc hay nước gừng sặc vào phổi sẽ gây suy hô hấp cấp và viêm phổi hít — một trong các nguyên nhân tử vong hàng đầu sau đột quỵ.',
    source: 'AHA/ASA Guidelines · Quy tắc NPO trước sàng lọc nuốt',
  },
  {
    title: '6. Không cạo gió, giác hơi, đánh cảm hay chườm nóng',
    reason: 'Đột quỵ là tai biến mạch máu não, không phải "cảm phong hàn". Cạo gió làm chậm trễ đưa đi viện và tạo các mảng bầm xuất huyết dưới da cực kỳ nguy hiểm nếu bệnh nhân ngay sau đó cần tiêm thuốc tiêu sợi huyết tĩnh mạch.',
    source: 'Bộ Y tế Việt Nam · Hội Đột quỵ Việt Nam',
  },
  {
    title: '7. Không xoa bóp, miết mạnh hay xoay vặn vùng cổ',
    reason: 'Ép mạnh lên xoang cảnh/động mạch cảnh ở cổ có thể làm bong mảng xơ vữa bắn thẳng lên não, làm nặng vết bóc tách động mạch đốt sống hoặc kích hoạt phản xạ xoang cảnh gây ngừng tim, tụt huyết áp đột ngột.',
    source: 'Age Ageing 2000 · Báo cáo ca lâm sàng PMID 33618738',
  },
  {
    title: '8. Không cạy hàm hay nhét đũa, thìa, ngón tay vào miệng khi co giật',
    reason: 'Người co giật không thể "nuốt lưỡi" vào cổ họng, nhưng vật cứng nhét vào sẽ làm gãy răng, rách niêm mạc chảy máu rơi thẳng vào khí quản gây ngạt thở tử vong.',
    source: 'AHA & Red Cross First Aid Guidelines 2024',
  },
  {
    title: '9. Không bắt người bệnh đứng dậy đi thử và không chở đến viện bằng xe máy',
    reason: 'Bắt người đang chóng mặt/yếu nửa người đứng dậy đi thử hoặc ngồi sau xe máy rất dễ ngã đập đầu xuống đường, gây chấn thương sọ não chống chỉ định hoàn toàn thuốc tiêu sợi huyết.',
    source: 'ILCOR 2025 · Paul Coverdell Registry (n=500.829)',
  },
  {
    title: '10. Không nằm chờ xem có tự đỡ không (kể cả khi triệu chứng đã tự hết)',
    reason: 'Mỗi phút thiếu máu não làm chết trung bình 1,9 triệu tế bào thần kinh. Ngay cả khi triệu chứng tự hết sau vài phút (cơn TIA), nguy cơ đột quỵ thật trong 48 giờ đầu vẫn cực cao.',
    source: 'Saver (Stroke 2006) · EXPRESS Study',
  },
];
