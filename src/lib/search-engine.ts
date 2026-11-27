import { sitePath } from './site-path';
export interface SearchableArticle {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  actionLevel: 'emergency' | 'urgent_today' | 'routine';
  keywords: string[];
  tldr15s: string[];
}

export interface SafetyInterceptorBanner {
  kind: 'acute_symptom' | 'harm_blocker';
  title: string;
  message: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryArticleSlug?: string;
  secondaryArticleLabel?: string;
}

export interface SearchOutput {
  query: string;
  normalizedQuery: string;
  understoodSynonyms: string[];
  banners: SafetyInterceptorBanner[];
  results: (SearchableArticle & { score: number })[];
}

export function normalizeVietnamese(input: string): string {
  return String(input || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasWholePhrase(paddedHaystack: string, phrase: string): boolean {
  const clean = normalizeVietnamese(phrase);
  if (!clean) return false;
  return paddedHaystack.includes(` ${clean} `);
}

/* Layer 1A: >= 55 Acute Stroke Symptom Patterns -> Immediate 115 Red Emergency Card */
const ACUTE_SYMPTOM_PHRASES: string[] = [
  'meo mieng', 'meo mom', 'lech mat', 'xe mat', 'xe mieng', 'liet mat', 'liet day 7', 'liet day vii',
  'yeu tay', 'te tay', 'te chan', 'yeu chan', 'te nua', 'yeu nua', 'liet nua', 'bai nua', 'te bi',
  'nam de tay', 'roi dua', 'mat viet', 'vung tay',
  'noi kho', 'noi ngong', 'noi do', 'do luoi', 'liu luoi', 'noi lap', 'u o', 'mat tieng', 'that ngon',
  'chong mat', 'loang choang', 'mat thang bang', 'roi loan tien dinh', 'tien dinh', 'quay cuong',
  'nhin mo', 'nhin doi', 'song thi', 'mu 1 mat', 'mu mat', 'mo 1 mat', 'mo mat', 'rem che', 'ban manh',
  'sac nuoc', 'kho nuot', 'nuot nghen', 'nghen nuoc', 'khan tieng', 'khan giong', 'wallenberg',
  'dau dau set danh', 'dau dau du doi', 'cung gay', 'dau co', 'dau gay', 'vo phinh mach',
  'lu lan', 'ngu ga', 'lo mo', 'bat tinh', 'ngat xiu', 'ngat', 'hon me', 'kho danh thuc',
  'co giat', 'ngung tho', 'tho ngap ca', 'ngap ca',
  'trung gio', 'tai bien', 'dot quy cap', 'ngu day liet', 'thuc day liet', 'wake up',
];

/* Layer 1B: 13 Dangerous Home Folk / OTC Interventions -> Immediate Harm-Blocker Red Card */
const HARM_BLOCKERS: {
  phrases: string[];
  title: string;
  message: string;
  articleSlug: string;
  articleLabel: string;
}[] = [
  {
    phrases: ['ha huyet ap', 'ha ap', 'huyet ap 200', 'huyet ap 190', 'huyet ap 180', 'ngam thuoc duoi luoi', 'nho thuoc duoi luoi', 'nifedipine', 'captopril', 'uong thuoc ha ap'],
    title: 'DỪNG NGAY: Tuyệt đối CẤM tự uống/ngậm thuốc hạ huyết áp khi đang nghi đột quỵ!',
    message: 'Dù huyết áp đo thấy 180–210 mmHg, tự hạ áp tại nhà trước khi chụp CT sọ não làm sập dòng máu nuôi vùng não tranh tối tranh sáng và gây tăng tàn phế ở ca nhồi máu não (RCT INTERACT4). Hãy gọi 115 ngay!',
    articleSlug: '02-cam-thuoc-ha-huyet-ap-va-aspirin',
    articleLabel: 'Xem bằng chứng INTERACT4',
  },
  {
    phrases: ['aspirin', 'nhai aspirin', 'uong aspirin'],
    title: 'DỪNG NGAY: Nghi đột quỵ CẤM tự uống Aspirin trước khi chụp CT sọ não!',
    message: 'Khoảng 20% ca đột quỵ là vỡ mạch xuất huyết não — uống Aspirin sẽ làm máu chảy ồ ạt không cầm được (khác hoàn toàn nhồi máu cơ tim!).',
    articleSlug: '02-cam-thuoc-ha-huyet-ap-va-aspirin',
    articleLabel: 'Vì sao cấm Aspirin tại nhà?',
  },
  {
    phrases: ['an cung', 'nguu hoang hoan', 'agnhw'],
    title: 'CẢNH BÁO ĐỎ: Tuyệt đối CẤM tự cho uống An Cung Ngưu Hoàng Hoàn!',
    message: 'Thử nghiệm mù đôi ANGONG TRIAL cho kết cục chính âm tính; tự đút viên An Cung khi đang đột quỵ cực dễ gây tắc thở sặc phổi, làm nặng xuất huyết não và chứa độc tính Thủy ngân/Asen.',
    articleSlug: '04-kiem-chung-an-cung-nguu-hoang-hoan',
    articleLabel: 'Xem kiểm chứng An Cung',
  },
  {
    phrases: ['chich mau', 'nan mau', 'kim chich', '10 dau ngon tay', 'dau ngon tay', 'dai tai'],
    title: 'TIN GIẢ NGUY HIỂM: Tuyệt đối CẤM chích máu ngón tay hoặc dái tai!',
    message: 'Nặn máu ngón tay không thông được mạch não mà cơn đau buốt làm vọt huyết áp và cướp mất Giờ Vàng cấp cứu.',
    articleSlug: '03-su-that-chich-mau-ngon-tay-xoa-co',
    articleLabel: 'Xem giải mã chích máu',
  },
  {
    phrases: ['cao gio', 'giac hoi', 'danh cam', 'xoa dau'],
    title: 'DỪNG NGAY: Không cạo gió, giác hơi khi nghi trúng gió / đột quỵ!',
    message: 'Triệu chứng "trúng gió" méo miệng, tê yếu thực chất thường là đột quỵ cấp. Cạo gió tạo mảng bầm xuất huyết cản trở tiêm thuốc tiêu sợi huyết tại viện.',
    articleSlug: '03-su-that-chich-mau-ngon-tay-xoa-co',
    articleLabel: 'Xem lý do y khoa',
  },
  {
    phrases: ['xoa co', 'bop co', 'bam huyet co', 'xoang canh', 'be co', 'massage co'],
    title: 'CẤM TUYỆT ĐỐI xoa miết, bóp hoặc bẻ vặn vùng cổ!',
    message: 'Ép mạnh vùng cổ có thể làm bong mảng xơ vữa bắn thẳng lên não, rách thêm động mạch đốt sống hoặc gây phản xạ ngừng tim.',
    articleSlug: '03-su-that-chich-mau-ngon-tay-xoa-co',
    articleLabel: 'Xem nguy cơ xoa/bẻ cổ',
  },
  {
    phrases: ['nuoc gung', 'nuoc chanh', 'nuoc duong', 'cho uong nuoc', 'dut chao'],
    title: 'DỪNG NGAY: Tuyệt đối CẤM cho ăn uống (kể cả nước lọc, nước gừng, nước chanh)!',
    message: 'Người đột quỵ rất hay liệt phản xạ nuốt kín đáo — chỉ vài ngụm nước gừng/nước lọc sặc vào phổi sẽ gây suy hô hấp và viêm phổi hít nguy kịch.',
    articleSlug: '06-tu-the-nam-nghieng-co-giat-ep-tim',
    articleLabel: 'Xem quy tắc chống sặc',
  },
  {
    phrases: ['tam that', 'nattokinase', 'lumbrokinase', 'hoat huyet duong nao', 'ginkgo', 'bach qua', 'vitamin e'],
    title: 'CẢNH BÁO DƯỢC LÂM SÀNG: Thực phẩm chức năng KHÔNG làm tan cục máu đông đột quỵ cấp!',
    message: 'Tuyệt đối không dùng bột Tam thất, Nattokinase hay Hoạt huyết dưỡng não để sơ cứu tại nhà hoặc tự ý thay thế thuốc chống đông/huyết áp bác sĩ kê.',
    articleSlug: '05-kiem-chung-nattokinase-ginkgo-tam-that',
    articleLabel: 'Xem bảng kiểm toán 13 loại TPCN',
  },
];

/* Layer 2: Multi-syllable Colloquial Synonym Graph (Whole-phrase safe expansion) */
const SYNONYM_GRAPH: [string, string, string][] = [
  ['trung gio', 'dot quy cao gio', '"trúng gió" thường chính là đột quỵ cấp'],
  ['tai bien', 'dot quy tai bien mach mau nao', '"tai biến" = đột quỵ não'],
  ['meo mom', 'meo mieng lech mat', '"méo mồm" → méo miệng / lệch mặt'],
  ['xe mieng', 'meo mieng lech mat', '"xệ miệng" → méo miệng'],
  ['do luoi', 'noi kho noi ngong that ngon befast', '"đớ lưỡi" → nói khó / nói ngọng đột ngột'],
  ['liu luoi', 'noi kho noi ngong', '"líu lưỡi" → nói khó đột ngột'],
  ['te tay', 'yeu tay te nua nguoi befast', '"tê tay" → tê yếu một bên tay/cơ thể'],
  ['nam de tay', 'wake up ngu day liet te tay', '"ngủ đè tay" → cảnh giác đột quỵ khi thức dậy'],
  ['roi loan tien dinh', 'chong mat tuan hoan sau tam bay', '"rối loạn tiền đình" → coi chừng bẫy đột quỵ tiểu não/thân não'],
  ['tien dinh', 'chong mat tuan hoan sau tam bay', '"tiền đình" → coi chừng đột quỵ tuần hoàn sau'],
  ['sac nuoc', 'kho nuot khan tieng wallenberg tam bay', '"sặc nước" → coi chừng đột quỵ hành não Wallenberg'],
  ['khan tieng', 'kho nuot sac nuoc wallenberg tam bay', '"khàn tiếng" → dấu hiệu hành não bên'],
  ['mu 1 mat', 'crao mo mat nhin mo tam bay', '"mù 1 mắt" → tắc động mạch võng mạc (đột quỵ mắt)'],
  ['nhin doi', 'song thi nhin mo tuan hoan sau', '"nhìn đôi" → song thị đột quỵ thân não'],
  ['co giat', 'co giat can luoi tu the nam nghieng cvt', '"co giật" → xử trí an toàn chống nhét vật vào miệng'],
  ['bat tinh', 'lo mo nam nghieng ep tim cpr ngung tho', '"bất tỉnh" → kiểm tra thở ngay (nằm nghiêng hoặc ép tim CPR)'],
  ['liet day 7', 'liet mat phan biet gia dot quy', '"liệt dây 7" → bắt buộc khám loại trừ đột quỵ cầu não trước'],
  ['tam dem', 'tam dem soc nhiet 14 yeu to cham ngoi', '"tắm đêm" → sự thật về chênh lệch nhiệt độ & yếu tố châm ngòi'],
  ['huyet ap 200', 'ha huyet ap interact4 cam thuoc', '"huyết áp 200" → cấm tự hạ áp trước khi chụp CT'],
];

/* Ambiguous short Vietnamese words excluded from standalone single-word matching */
const AMBIGUOUS_SHORT_STOPWORDS = new Set([
  'co', 'la', 'gi', 'khi', 'bi', 'va', 'cua', 'thi', 'nhu', 'the', 'nao',
  'toi', 'phai', 'khong', 'duoc', 'do', 'ha', 'an', 'ra', 'vo', 'bo', 'di',
  'tai', 'cho', 'voi', 'hay', 'neu', 'luc', 'nay', 'con', 'nguoi', 'benh',
]);

export function runMedicalSafetySearch(
  rawQuery: string,
  corpus: SearchableArticle[],
  maxResults = 8
): SearchOutput {
  const normalizedQuery = normalizeVietnamese(rawQuery);
  if (!normalizedQuery) {
    return {
      query: rawQuery,
      normalizedQuery: '',
      understoodSynonyms: [],
      banners: [],
      results: [],
    };
  }

  const paddedQuery = ` ${normalizedQuery} `;
  const banners: SafetyInterceptorBanner[] = [];
  const understoodSynonyms: string[] = [];
  const expandedPhrases: string[] = [];
  const boostedSlugs = new Set<string>();

  // 1. Check Harm Blockers FIRST (so 'hạ huyết áp' or 'nước gừng' immediately warns!)
  for (const hb of HARM_BLOCKERS) {
    if (hb.phrases.some((p) => hasWholePhrase(paddedQuery, p))) {
      boostedSlugs.add(hb.articleSlug);
      banners.push({
        kind: 'harm_blocker',
        title: hb.title,
        message: hb.message,
        primaryCtaLabel: 'Mở hướng dẫn Sơ cứu đúng',
        primaryCtaHref: sitePath('/so-cuu/'),
        secondaryArticleSlug: hb.articleSlug,
        secondaryArticleLabel: hb.articleLabel,
      });
    }
  }

  // 2. Check Acute Symptoms -> Pin Red 115 Call Banner
  const isAcuteSymptom = ACUTE_SYMPTOM_PHRASES.some((p) => hasWholePhrase(paddedQuery, p));
  if (isAcuteSymptom) {
    banners.unshift({
      kind: 'acute_symptom',
      title: 'Triệu chứng này đang xảy ra đột ngột ngay lúc này?',
      message: 'Đừng đọc tiếp bài dài! Hãy xử trí như ĐỘT QUỴ CẤP: gọi 115 ngay lập tức và ghi nhớ giờ bình thường cuối cùng (LKW).',
      primaryCtaLabel: 'Gọi 115 & Mở Sơ cứu 0 giây',
      primaryCtaHref: sitePath('/so-cuu/'),
    });
  }

  // 3. Expand multi-syllable colloquial synonyms safely
  let remainingText = paddedQuery;
  for (const [srcPhrase, targetTerms, humanNote] of SYNONYM_GRAPH) {
    if (hasWholePhrase(paddedQuery, srcPhrase)) {
      understoodSynonyms.push(humanNote);
      expandedPhrases.push(...targetTerms.split(' ').filter(Boolean));
      remainingText = remainingText.replace(` ${srcPhrase} `, ' ');
    }
  }

  // 4. Tokenize remaining meaningful whole syllables (min length >= 3 OR medical acronyms like 'ct', 'ha' excluded unless in phrase)
  const validTokens = Array.from(
    new Set(
      remainingText
        .trim()
        .split(' ')
        .filter((tok) => tok.length >= 2 && !AMBIGUOUS_SHORT_STOPWORDS.has(tok))
    )
  );

  const scored = corpus
    .map((article) => {
      const normTitle = normalizeVietnamese(article.title);
      const normKeywords = article.keywords.map(normalizeVietnamese).join(' ');
      const normTldr = normalizeVietnamese(article.tldr15s.join(' '));
      const paddedTitle = ` ${normTitle} `;
      const paddedKeywords = ` ${normKeywords} `;
      const paddedAll = ` ${normTitle} ${normKeywords} ${normTldr} `;

      let score = 0;

      if (boostedSlugs.has(article.slug)) {
        score += 50;
      }

      // Exact full query phrase match
      if (normalizedQuery.length >= 3) {
        if (hasWholePhrase(paddedKeywords, normalizedQuery)) score += 24;
        if (hasWholePhrase(paddedTitle, normalizedQuery)) score += 20;
        else if (hasWholePhrase(paddedAll, normalizedQuery)) score += 12;
      }

      // Synonym phrase boosts
      for (const exp of expandedPhrases) {
        if (exp.length >= 3 && hasWholePhrase(paddedKeywords, exp)) score += 8;
        else if (exp.length >= 3 && hasWholePhrase(paddedTitle, exp)) score += 6;
        else if (exp.length >= 3 && hasWholePhrase(paddedAll, exp)) score += 3;
      }

      // Strict whole-syllable boundary matching (NEVER substring inside another syllable!)
      for (const tok of validTokens) {
        if (hasWholePhrase(paddedKeywords, tok)) score += 6;
        else if (hasWholePhrase(paddedTitle, tok)) score += 5;
        else if (hasWholePhrase(paddedAll, tok)) score += 2;
      }

      return { ...article, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return {
    query: rawQuery,
    normalizedQuery,
    understoodSynonyms,
    banners,
    results: scored,
  };
}
