export interface LkwState {
  mode: 'unset' | 'known' | 'wakeup' | 'unknown';
  lkwTimestampMs: number | null;
  recordedAtMs: number;
  activeSigns: string[];
  activePersonId: string;
}

export interface GoldenHourComputation {
  clockText: string;
  elapsedText: string;
  phaseBadge: string;
  phaseMessage: string;
  rulerProgressPct: number;
}

const LKW_STORAGE_KEY = 'dotquy115_lkw_v3';

export function readLkwState(): LkwState {
  if (typeof localStorage === 'undefined') {
    return { mode: 'unset', lkwTimestampMs: null, recordedAtMs: Date.now(), activeSigns: [], activePersonId: 'unassigned' };
  }
  try {
    const raw = localStorage.getItem(LKW_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LkwState;
      return parsed;
    }
  } catch {
    // Ignore storage error
  }
  return { mode: 'unset', lkwTimestampMs: null, recordedAtMs: Date.now(), activeSigns: [], activePersonId: 'unassigned' };
}

export function writeLkwState(patch: Partial<LkwState>): LkwState {
  const current = readLkwState();
  const next: LkwState = {
    ...current,
    ...patch,
    recordedAtMs: Date.now(),
  };
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LKW_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore quota error
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dotquy:lkw-updated', { detail: next }));
  }
  return next;
}

export function computeGoldenHourStatus(state: LkwState, nowMs = Date.now()): GoldenHourComputation {
  if (state.mode === 'unset') {
    return {
      clockText: 'Chưa chọn mốc giờ',
      elapsedText: 'Hãy chạm chọn mốc giờ bình thường cuối cùng',
      phaseBadge: 'GỌI 115 NGAY',
      phaseMessage: 'Bác sĩ cần mốc giờ lần cuối thấy bình thường (LKW) để quyết định thuốc tái thông mạch.',
      rulerProgressPct: 8,
    };
  }

  if (state.mode === 'wakeup') {
    return {
      clockText: 'Ngủ dậy mới thấy',
      elapsedText: 'Cần báo bác sĩ giờ đi ngủ tối qua + giờ thức dậy',
      phaseBadge: 'CỬA SỐ MÔ HỌC MRI/CTP',
      phaseMessage: 'Đột quỵ khi thức dậy VẪN CÒN CƠ HỘI CỨU NÃO tới 9–24 giờ nhờ chụp MRI (DWI–FLAIR) hoặc CT tưới máu! Gọi 115 ngay.',
      rulerProgressPct: 52,
    };
  }

  if (state.mode === 'unknown' || state.lkwTimestampMs === null) {
    return {
      clockText: 'Chưa rõ mốc giờ',
      elapsedText: 'Báo bác sĩ thời điểm cuối cùng có người nhìn thấy bình thường',
      phaseBadge: 'VẪN PHẢI GỌI 115 NGAY',
      phaseMessage: 'Không rõ giờ khởi phát vẫn cấp cứu tối khẩn — bệnh viện sẽ chụp hình ảnh học xác định mô não còn cứu được.',
      rulerProgressPct: 50,
    };
  }

  const elapsedMs = Math.max(0, nowMs - state.lkwTimestampMs);
  const totalSec = Math.floor(elapsedMs / 1000);
  const hours = elapsedMs / 3600000;

  const hh = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');

  const d = new Date(state.lkwTimestampMs);
  const clockStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  if (hours <= 4.5) {
    const pct = Math.max(4, Math.min(45, (hours / 4.5) * 45));
    return {
      clockText: `Lúc ${clockStr}`,
      elapsedText: `${hh}:${mm}:${ss}`,
      phaseBadge: 'GIỜ VÀNG (0 – 4,5 GIỜ)',
      phaseMessage: 'Đang trong cửa sổ chuẩn vàng của thuốc tiêu sợi huyết & lấy huyết khối — Gọi 115 đến Đơn vị Đột quỵ ngay!',
      rulerProgressPct: Math.round(pct),
    };
  }

  if (hours <= 24) {
    const pct = 45 + ((hours - 4.5) / 19.5) * 40;
    return {
      clockText: `Lúc ${clockStr}`,
      elapsedText: `${hh}:${mm}:${ss}`,
      phaseBadge: 'CÒN CƠ HỘI (4,5 – 24 GIỜ)',
      phaseMessage: 'Đã qua 4,5 giờ đầu nhưng VẪN CÒN CƠ HỘI CỨU NÃO (lấy huyết khối cơ học / tiêu sợi huyết chọn lọc qua MRI–CTP). Gọi 115 ngay!',
      rulerProgressPct: Math.round(pct),
    };
  }

  const pct = Math.min(98, 85 + ((hours - 24) / 24) * 13);
  return {
    clockText: `Lúc ${clockStr}`,
    elapsedText: `Đã hơn ${Math.floor(hours)} giờ`,
    phaseBadge: 'MUỘN (> 24 GIỜ) • VẪN ĐI VIỆN NGAY',
    phaseMessage: 'Đã qua cửa sổ tái thông cấp 24 giờ, nhưng BẮT BUỘC NHẬP VIỆN NGAY để chống phù não, chống sặc phổi và chặn đột quỵ tái phát!',
    rulerProgressPct: Math.round(pct),
  };
}
