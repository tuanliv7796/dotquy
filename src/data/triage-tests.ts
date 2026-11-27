export interface AcuteCheckStep {
  stepNumber: number;
  code: 'F' | 'A' | 'S' | 'B' | 'E' | 'RF';
  badge: string;
  title: string;
  safeInstruction: string;
  question: string;
  signLabel: string;
  hasTenSecTimer?: boolean;
  speechSample?: string;
}

export const UNIFIED_SPEECH_SENTENCE = 'Hôm nay trời rất đẹp, cả nhà ăn cơm ngon.';

/* 6 Safe Prehospital Steps — Fixes K2 (NO standing/walking hazard) & Covers 5 Non-BE-FAST Red Flags */
export const ACUTE_CHECK_STEPS: AcuteCheckStep[] = [
  {
    stepNumber: 1,
    code: 'F',
    badge: 'F · Khuôn mặt',
    title: 'Kiểm tra cân đối khuôn mặt khi cười',
    safeInstruction: 'Giữ người cần kiểm tra ngồi tựa hoặc nằm yên an toàn. Nhờ họ CƯỜI TƯƠI hoặc NHE RĂNG.',
    question: 'Một bên mặt hoặc khóe miệng có bị xệ xuống, lệch sang một bên không?',
    signLabel: 'Méo miệng / Lệch mặt',
  },
  {
    stepNumber: 2,
    code: 'A',
    badge: 'A · Tay & Bàn tay',
    title: 'Nghiệm pháp giơ hai tay 10 giây & vận động tinh bàn tay',
    safeInstruction: 'Trong tư thế ngồi tựa hoặc nằm, nhờ họ nhắm mắt, giơ thẳng đều cả hai tay ra trước (lòng bàn tay ngửa lên) trong 10 giây.',
    question: 'Có một tay yếu không nâng nổi, rơi thấp dần/xoay sấp, tê bì nửa người HOẶC đột ngột cầm rơi đũa, không viết được chữ không?',
    signLabel: 'Yếu/tê một bên hoặc vụng đột ngột 1 bàn tay',
    hasTenSecTimer: true,
  },
  {
    stepNumber: 3,
    code: 'S',
    badge: 'S · Lời nói',
    title: 'Kiểm tra độ rõ lời nói và khả năng hiểu lời',
    safeInstruction: 'Nhờ người bệnh đọc to, rõ câu tiếng Việt chuẩn bên dưới:',
    question: 'Có nói đớ, nói ngọng, ú ớ khó tìm từ, nói câu vô nghĩa hoặc không hiểu lời bạn hỏi không?',
    signLabel: 'Nói khó / Thất ngôn',
    speechSample: UNIFIED_SPEECH_SENTENCE,
  },
  {
    stepNumber: 4,
    code: 'B',
    badge: 'B · Thăng bằng',
    title: 'Kiểm tra chóng mặt & giữ thăng bằng (Không đứng dậy đi thử!)',
    safeInstruction: 'TUYỆT ĐỐI KHÔNG bắt người bệnh đứng dậy bước đi để tránh té ngã đập đầu! Giữ họ ngồi tựa/nằm yên và hỏi cảm giác hiện tại.',
    question: 'Có đột ngột chóng mặt xoay tròn dữ dội, cảm giác nhà cửa chao đảo, không tự ngồi vững hoặc vừa đi loạng choạng trước đó không?',
    signLabel: 'Mất thăng bằng / Chóng mặt cấp',
  },
  {
    stepNumber: 5,
    code: 'E',
    badge: 'E · Thị giác',
    title: 'Kiểm tra thị lực từng mắt và tầm nhìn hai bên',
    safeInstruction: 'Hỏi người bệnh nhìn xung quanh và che nhẹ lần lượt từng mắt để kiểm tra.',
    question: 'Có đột ngột nhìn mờ, tối sầm một mắt như rèm đen kéo xuống (không đau), nhìn một thành hai (song thị) hoặc mất nửa tầm nhìn không?',
    signLabel: 'Mất thị lực 1 mắt / Nhìn đôi / Bán manh',
  },
  {
    stepNumber: 6,
    code: 'RF',
    badge: '5 Dấu hiệu Đỏ kín đáo',
    title: 'Rà soát các dấu hiệu đột quỵ hố sau & xuất huyết dưới nhện ngoài BE-FAST',
    safeInstruction: 'Khoảng 40% đột quỵ tuần hoàn sau không gây méo miệng hay liệt tay chân. Hãy rà kỹ các biểu hiện mới xuất hiện đột ngột sau:',
    question: 'Có xuất hiện đột ngột: (1) Đau đầu dữ dội như sét đánh · (2) Sặc nước, khó nuốt, khàn tiếng · (3) Lú lẫn, ngủ gà gọi khó tỉnh, bỏ quên một bên · hoặc (4) Đau chói 1 bên cổ/gáy mới phát không?',
    signLabel: 'Dấu hiệu Đỏ ngoài BE-FAST (Đau đầu sét đánh / Sặc nuốt / Ngủ gà / Đau cổ cấp)',
  },
];

export interface SignQuickCard {
  id: string;
  shortCode: string;
  group: 'befast' | 'redflag';
  name: string;
  summary: string;
  detail: string;
}

export const HOME_SIGN_CARDS: SignQuickCard[] = [
  {
    id: 'B',
    shortCode: 'B',
    group: 'befast',
    name: 'Thăng bằng',
    summary: 'Chóng mặt xoay tròn, không ngồi vững',
    detail: 'Đột ngột chóng mặt dữ dội, loạng choạng hoặc không tự ngồi vững (chiếm 38,8% triệu chứng vào viện của đột quỵ tuần hoàn sau). Giữ người bệnh nằm/ngồi yên — không tự uống thuốc tiền đình chờ đợi!',
  },
  {
    id: 'E',
    shortCode: 'E',
    group: 'befast',
    name: 'Mắt (Thị giác)',
    summary: 'Mù 1 mắt rèm che, nhìn đôi, mờ nửa bên',
    detail: 'Đột ngột nhìn một thành hai (song thị), khuyết nửa tầm nhìn hoặc tối sầm không đau một mắt như rèm kéo (tắc động mạch trung tâm võng mạc CRAO). Dù mắt tự sáng lại vẫn phải đi cấp cứu ngay!',
  },
  {
    id: 'F',
    shortCode: 'F',
    group: 'befast',
    name: 'Khuôn mặt',
    summary: 'Méo miệng, một bên mặt xệ khi cười',
    detail: 'Nhờ người bệnh cười tươi hoặc nhe răng: một bên khóe miệng trễ xuống, nhân trung lệch. Tuyệt đối không tự chẩn đoán là "trúng gió liệt dây VII ngoại biên" để ở nhà châm cứu, cạo gió.',
  },
  {
    id: 'A',
    shortCode: 'A',
    group: 'befast',
    name: 'Tay / Chân',
    summary: 'Giơ 2 tay 10s một bên rơi, tê yếu 1 bên',
    detail: 'Nhắm mắt giơ thẳng đều 2 tay lòng bàn tay ngửa trong 10 giây: một bên rơi thấp dần hoặc xoay sấp, hoặc tê bì nửa người. Kể cả ngủ dậy thấy tê tay cũng không được chủ quan nghĩ do nằm đè.',
  },
  {
    id: 'S',
    shortCode: 'S',
    group: 'befast',
    name: 'Lời nói',
    summary: 'Nói đớ, ngọng, khó tìm từ, không hiểu lời',
    detail: `Nhờ đọc câu "${UNIFIED_SPEECH_SENTENCE}": giọng bỗng đớ ngọng, ú ớ không thốt thành câu (thất ngôn Broca) hoặc nói trôi chảy nhưng vô nghĩa, không hiểu câu hỏi (thất ngôn Wernicke).`,
  },
  {
    id: 'T',
    shortCode: 'T',
    group: 'befast',
    name: 'Thời gian (115)',
    summary: 'Gọi 115 ngay & ghi mốc giờ bình thường cuối',
    detail: 'Chỉ cần CÓ 1 dấu hiệu nghi ngờ: gọi ngay 115, nói rõ "Có người nghi đột quỵ não cấp" và ghi nhớ chính xác mốc giờ bình thường cuối cùng (Last Known Well — LKW).',
  },
  {
    id: 'RF1',
    shortCode: 'ĐỎ 1',
    group: 'redflag',
    name: 'Đau đầu "sét đánh"',
    summary: 'Đạt cực đại tức thì ("đau dữ dội nhất đời")',
    detail: 'Cơn đau đầu bùng lên dữ dội tối đa trong vài giây đến dưới 1 giờ (kèm buồn nôn, cứng gáy, sợ ánh sáng) là dấu hiệu kinh điển của Xuất huyết dưới nhện do vỡ túi phình mạch não. Cấm uống thuốc giảm đau đi ngủ!',
  },
  {
    id: 'RF2',
    shortCode: 'ĐỎ 2',
    group: 'redflag',
    name: 'Sặc nước, khó nuốt, khàn tiếng',
    summary: 'Đột ngột nghẹn sặc dù tay chân không liệt',
    detail: 'Nhồi máu hành não lưng bên (Hội chứng Wallenberg) có thể chỉ gây đột ngột sặc nước lên mũi, khàn giọng, nấc cụt liên tục mà tay chân vẫn cử động bình thường. Phải nhịn ăn uống tuyệt đối và gọi 115!',
  },
  {
    id: 'RF3',
    shortCode: 'ĐỎ 3',
    group: 'redflag',
    name: 'Vụng đột ngột 1 bàn tay',
    summary: 'Rơi đũa, không cài được cúc áo, mất viết',
    detail: 'Nhồi máu vỏ não vùng vận động bàn tay ("hand-knob") chỉ làm một bàn tay bỗng nhiên vụng về, rơi bát đũa hoặc biến dạng chữ viết, rất dễ bị nhầm với hội chứng ống cổ tay hay thoái hóa đốt sống cổ.',
  },
  {
    id: 'RF4',
    shortCode: 'ĐỎ 4',
    group: 'redflag',
    name: 'Lú lẫn cấp / Ngủ gà gọi khó tỉnh',
    summary: 'Đột ngột thờ ơ, bỏ quên nửa không gian trái',
    detail: 'Người cao tuổi bỗng ngủ li bì gọi khó tỉnh (coi chừng tắc động mạch thân nền hoặc xuất huyết lớn) hoặc chỉ ăn nửa bát cơm bên phải. Tuyệt đối không đắp chăn cho nằm ngủ tiếp!',
  },
  {
    id: 'RF5',
    shortCode: 'ĐỎ 5',
    group: 'redflag',
    name: 'Đau chói 1 bên cổ/gáy mới phát',
    summary: 'Kèm chóng mặt/sụp mi ở người trẻ (Cấm bẻ cổ!)',
    detail: 'Đau nhói mới xuất hiện một bên cổ hoặc vùng chẩm sau xoay vặn cổ, tập thể thao hay massage — báo động Bóc tách động mạch đốt sống/cảnh (nguyên nhân hàng đầu gây đột quỵ người trẻ). Tuyệt đối cấm bẻ cổ tiếp!',
  },
];

export interface ModifiableRiskFactor {
  key: string;
  label: string;
  targetAction: string;
  weight: number;
  evidenceNote: string;
}

export const MODIFIABLE_RISK_FACTORS: ModifiableRiskFactor[] = [
  {
    key: 'hypertension',
    label: 'Huyết áp thường xuyên ≥ 140/90 mmHg (hoặc chưa kiểm soát < 130/80)',
    targetAction: 'Kiểm soát huyết áp đều đặn < 130/80 mmHg bằng thuốc bác sĩ kê & giảm muối',
    weight: 6,
    evidenceNote: 'Yếu tố số 1 toàn cầu (PAR ~48%–54%); mỗi giảm 5 mmHg tâm thu giảm ~22% nguy cơ đột quỵ.',
  },
  {
    key: 'afib',
    label: 'Rung nhĩ / Loạn nhịp tim chưa dùng thuốc chống đông đều đặn',
    targetAction: 'Khám Tim mạch dùng thuốc chống đông đường uống (DOAC/VKA) đúng chỉ định',
    weight: 6,
    evidenceNote: 'Rung nhĩ làm tăng ~5 lần nguy cơ nhồi máu não diện rộng; thuốc chống đông giảm ~65% nguy cơ.',
  },
  {
    key: 'smoking',
    label: 'Đang hút thuốc lá, thuốc lào hoặc thuốc lá điện tử',
    targetAction: 'Cai thuốc lá hoàn toàn (nguy cơ giảm mạnh ngay trong 1–2 năm đầu)',
    weight: 4,
    evidenceNote: 'Làm tăng gấp đôi nguy cơ nhồi máu não và tăng 3–4 lần nguy cơ vỡ phình mạch dưới nhện.',
  },
  {
    key: 'diabetes',
    label: 'Đái tháo đường / Tiền đái tháo đường chưa đạt đích HbA1c',
    targetAction: 'Kiểm soát HbA1c < 7% (ưu tiên nhóm thuốc bảo vệ mạch máu GLP-1RA theo chỉ định)',
    weight: 3,
    evidenceNote: 'Tổn thương nội mạc mạch máu lớn và mạch xuyên sâu (nhồi máu lỗ khuyết).',
  },
  {
    key: 'dyslipidemia',
    label: 'Mỡ máu LDL-C cao hoặc tự ý bỏ thuốc mỡ máu (Statin)',
    targetAction: 'Duy trì Statin và chế độ ăn Địa Trung Hải theo mục tiêu LDL-C của bác sĩ',
    weight: 3,
    evidenceNote: 'Ổn định mảng xơ vữa động mạch cảnh và nội sọ, ngăn nứt vỡ tạo huyết khối.',
  },
  {
    key: 'lifestyle',
    label: 'Ăn mặn (> 5g muối/ngày), ít vận động (< 150 phút/tuần) hoặc uống nhiều rượu bia',
    targetAction: 'Ăn nhạt < 5g muối/ngày, đi bộ nhanh 30 phút/ngày, bỏ uống rượu nặng',
    weight: 3,
    evidenceNote: '84%–90,7% gánh nặng đột quỵ gắn với 10 yếu tố nguy cơ có thể điều chỉnh được (INTERSTROKE).',
  },
];

export const TARGETED_SCREENING_PROFILES: {
  group: string;
  shouldDo: string;
  doNotAbuse: string;
}[] = [
  {
    group: '1. Người trưởng thành khỏe mạnh 18–39 tuổi (nguy cơ thấp)',
    shouldDo: 'Đo huyết áp chuẩn mỗi 3–5 năm/lần (hằng năm nếu từ ≥40 tuổi hoặc thừa cân); xét nghiệm đường huyết & mỡ máu định kỳ.',
    doNotAbuse: 'KHÔNG chụp MRI sọ não đại trà; KHÔNG siêu âm động mạch cảnh không triệu chứng (USPSTF Mức D).',
  },
  {
    group: '2. Người có Tăng huyết áp hoặc từ ≥ 65 tuổi',
    shouldDo: 'Theo dõi huyết áp tại nhà (sáng/tối); bắt mạch hoặc đo điện tâm đồ (ECG) tầm soát rung nhĩ cơ hội mỗi lần khám bệnh (ESC 2024).',
    doNotAbuse: 'KHÔNG tự ý mua Aspirin uống phòng ngừa tiên phát khi từ ≥ 60 tuổi (USPSTF Mức D — nguy cơ chảy máu vượt lợi ích).',
  },
  {
    group: '3. Người ngủ ngáy to, ngưng thở khi ngủ, buồn ngủ ngày',
    shouldDo: 'Khám Hô hấp / Giấc ngủ đo đa ký giấc ngủ (Polysomnography) tầm soát hội chứng ngưng thở tắc nghẽn khi ngủ (OSA) & huyết áp ban đêm.',
    doNotAbuse: 'Không tự uống thuốc an thần gây ức chế hô hấp ban đêm.',
  },
  {
    group: '4. Gia đình có ≥ 2 người thân bậc 1 (bố, mẹ, anh chị em ruột) bị xuất huyết dưới nhện hoặc mắc thận đa nang (ADPKD)',
    shouldDo: 'Đây là nhóm ĐẶC BIỆT ĐƯỢC CHỈ ĐỊNH chụp MRA hoặc CTA mạch máu não tầm soát túi phình mạch não chưa vỡ theo tư vấn chuyên khoa.',
    doNotAbuse: 'Không áp dụng chụp CTA đại trà cho người chỉ có 1 người họ hàng xa bị đột quỵ thiếu máu cục bộ.',
  },
  {
    group: '5. Phụ nữ mang thai, hậu sản 6 tuần đầu hoặc dùng thuốc tránh thai chứa Estrogen',
    shouldDo: 'Đo huyết áp chặt chẽ tầm soát tiền sản giật; đổi biện pháp tránh thai không chứa Estrogen nếu có Migraine kèm thoáng báo (aura) hoặc hút thuốc ≥35 tuổi.',
    doNotAbuse: 'Không xem nhẹ đau đầu tăng dần hậu sản là "hậu sản thiếu máu" (cần loại trừ huyết khối tĩnh mạch não CVT).',
  },
  {
    group: '6. Người đã từng bị TIA hoặc Đột quỵ trước đó (Dự phòng thứ phát)',
    shouldDo: 'Tuân thủ suốt đời phác đồ kháng tiểu cầu / chống đông + Statin liều cao + kiểm soát HA < 130/80 mmHg do bác sĩ chuyên khoa Đột quỵ kê.',
    doNotAbuse: 'TUYỆT ĐỐI KHÔNG tự ngưng thuốc Tây để chuyển sang uống Nattokinase, Hoạt huyết dưỡng não hay An Cung định kỳ!',
  },
];
