import { registerPlugin } from '@capacitor/core';

export interface OtaStatusInfo {
  currentVersion: string;
  source: 'apk_seed' | 'ota_snapshot' | 'web';
  lastCheckedAt?: string;
  pendingVersion?: string;
  manifestUrl?: string;
}

export interface DotQuyNativePluginContract {
  dial115(): Promise<void>;
  setKeepScreenOn(options: { enabled: boolean }): Promise<void>;
  speakVi(options: { text: string; rate?: number }): Promise<{ available: boolean; message?: string }>;
  stopSpeak(): Promise<void>;
  vibrate(options: { pattern: number[] }): Promise<void>;
  readEncryptedVault(): Promise<{ data: string | null }>;
  writeEncryptedVault(options: { data: string }): Promise<void>;
  scheduleRecheckReminder(options: { minutes: number; personLabel: string }): Promise<{ scheduled: boolean }>;
  confirmBootHealthy(): Promise<void>;
  checkForWebUpdate(options: { manifestUrl: string }): Promise<{ hasUpdate: boolean; version?: string; error?: string }>;
  applyPendingUpdate(): Promise<void>;
  getOtaStatus(): Promise<OtaStatusInfo>;
}

const DotQuyNative = registerPlugin<DotQuyNativePluginContract>('DotQuyNative');

let webWakeLock: any = null;
let audioCtx: AudioContext | null = null;

export function isAndroidApk(): boolean {
  if (typeof window === 'undefined') return false;
  const cap = (window as any).Capacitor;
  return Boolean(cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform());
}

export async function triggerCall115(): Promise<void> {
  vibrateDevice([40]);
  if (isAndroidApk()) {
    try {
      await DotQuyNative.dial115();
      return;
    } catch {
      // Fallback to tel URI
    }
  }
  if (typeof window !== 'undefined') {
    window.location.href = 'tel:115';
  }
}

export async function setEmergencyWakeLock(enabled: boolean): Promise<void> {
  if (isAndroidApk()) {
    try {
      await DotQuyNative.setKeepScreenOn({ enabled });
    } catch {
      // Ignore native bridge error
    }
  }
  if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
    try {
      if (enabled && !webWakeLock) {
        webWakeLock = await (navigator as any).wakeLock.request('screen');
      } else if (!enabled && webWakeLock) {
        await webWakeLock.release();
        webWakeLock = null;
      }
    } catch {
      // Ignore browser WakeLock permission denial
    }
  }
}

export function vibrateDevice(pattern: number[]): void {
  if (isAndroidApk()) {
    DotQuyNative.vibrate({ pattern }).catch(() => {});
    return;
  }
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore
    }
  }
}

export function playMetronomeClick(freq = 880, durationSec = 0.075): void {
  if (typeof window === 'undefined') return;
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.22, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationSec);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + durationSec);
  } catch {
    // Audio blocked or unsupported
  }
}

export async function speakVietnamese(
  text: string,
  onEnd?: () => void
): Promise<{ ok: boolean; warning?: string }> {
  if (isAndroidApk()) {
    try {
      const res = await DotQuyNative.speakVi({ text, rate: 0.9 });
      if (!res.available) {
        return {
          ok: false,
          warning: res.message || 'Máy chưa cài gói giọng đọc tiếng Việt. Hãy mở Cài đặt Android → Ngôn ngữ & Giọng nói để tải tiếng Việt.',
        };
      }
      return { ok: true };
    } catch {
      // Fall through to Web Speech API
    }
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
    return {
      ok: false,
      warning: 'Trình duyệt này chưa hỗ trợ đọc giọng nói tự động. Hãy dùng bản cài đặt Android (.apk) để có giọng đọc tiếng Việt ngoại tuyến.',
    };
  }

  const synth = window.speechSynthesis;
  synth.cancel();
  const voices = synth.getVoices();
  const viVoice = voices.find((v) => /^vi([-_]|$)/i.test(v.lang));
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.9;
  if (viVoice) {
    utterance.voice = viVoice;
  }
  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }
  synth.speak(utterance);

  if (voices.length > 0 && !viVoice) {
    return {
      ok: true,
      warning: 'Thiết bị chưa có giọng đọc tiếng Việt (vi-VN) chuẩn. Bạn có thể cài thêm gói tiếng Việt trong phần Cài đặt giọng nói của máy.',
    };
  }
  return { ok: true };
}

export async function stopSpeaking(): Promise<void> {
  if (isAndroidApk()) {
    DotQuyNative.stopSpeak().catch(() => {});
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}

export async function scheduleLocalRecheck(minutes: number, personLabel: string): Promise<{ scheduled: boolean; note: string }> {
  if (isAndroidApk()) {
    try {
      const res = await DotQuyNative.scheduleRecheckReminder({ minutes, personLabel });
      if (res.scheduled) {
        return {
          scheduled: true,
          note: `Đã đặt lịch nhắc kiểm tra lại cho ${personLabel} sau ${minutes} phút (không hiển thị triệu chứng trên màn hình khóa).`,
        };
      }
    } catch {
      // Fallback
    }
  }

  if (typeof window !== 'undefined') {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    window.setTimeout(() => {
      vibrateDevice([80, 60, 80]);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Đột Quỵ 115 — Đến giờ kiểm tra lại', {
          body: `Đến giờ kiểm tra lại cho ${personLabel}. Chạm để bắt đầu.`,
        });
      } else {
        window.dispatchEvent(
          new CustomEvent('dotquy:recheck-due', { detail: { personLabel, minutes } })
        );
      }
    }, minutes * 60 * 1000);
  }

  return {
    scheduled: true,
    note: `Đã đặt bộ đếm nhắc kiểm tra lại sau ${minutes} phút (trên trình duyệt Web, hãy giữ tab này không đóng; bản .apk hỗ trợ nhắc ngay cả khi tắt màn hình).`,
  };
}

export { DotQuyNative };
