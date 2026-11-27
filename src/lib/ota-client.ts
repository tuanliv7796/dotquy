import { DotQuyNative, isAndroidApk, type OtaStatusInfo } from './native-bridge';

const CUSTOM_OTA_URL_KEY = 'dotquy115_ota_manifest_url';

export function resolveConfiguredManifestUrl(): string {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(CUSTOM_OTA_URL_KEY)?.trim();
    if (saved && /^https?:\/\//i.test(saved)) {
      return saved.endsWith('.json') ? saved : `${saved.replace(/\/+$/, '')}/ota/manifest.json`;
    }
  }
  const envManifest = (import.meta.env.PUBLIC_OTA_MANIFEST_URL || '').trim();
  if (envManifest && /^https?:\/\//i.test(envManifest)) {
    return envManifest;
  }
  const envSite = (import.meta.env.PUBLIC_SITE_URL || '').trim();
  if (envSite && /^https?:\/\//i.test(envSite) && !envSite.includes('dotquy115.vn')) {
    return `${envSite.replace(/\/+$/, '')}/ota/manifest.json`;
  }
  return '';
}

export function saveCustomOtaDomain(domainOrManifestUrl: string): string {
  const clean = domainOrManifestUrl.trim();
  if (typeof localStorage !== 'undefined') {
    if (!clean) {
      localStorage.removeItem(CUSTOM_OTA_URL_KEY);
      return '';
    }
    const normalized = clean.endsWith('.json')
      ? clean
      : `${clean.replace(/\/+$/, '')}/ota/manifest.json`;
    localStorage.setItem(CUSTOM_OTA_URL_KEY, normalized);
    return normalized;
  }
  return '';
}

export async function initOtaLifecycle(isEmergencyScreen: boolean): Promise<void> {
  if (typeof window === 'undefined') return;

  // Register PWA Service Worker when running in standard browser
  if (!isAndroidApk() && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
    return;
  }

  if (!isAndroidApk()) return;

  // 1. Signal healthy boot to Native Watchdog so it never false-rollbacks a healthy snapshot
  try {
    await DotQuyNative.confirmBootHealthy();
  } catch {
    // Ignore
  }

  // 2. Never run background OTA download while user is in Emergency Mode!
  if (isEmergencyScreen) return;

  const manifestUrl = resolveConfiguredManifestUrl();
  if (!manifestUrl) return;

  window.setTimeout(async () => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
    if (window.location.pathname.includes('/so-cuu')) return;
    try {
      const res = await DotQuyNative.checkForWebUpdate({ manifestUrl });
      if (res.hasUpdate) {
        window.dispatchEvent(
          new CustomEvent('dotquy:ota-ready', { detail: { version: res.version || 'mới' } })
        );
      }
    } catch {
      // Silent fail offline — app continues serving last known good snapshot
    }
  }, 2500);
}

export async function manualCheckOtaUpdate(overrideUrl?: string): Promise<{
  checked: boolean;
  hasUpdate: boolean;
  message: string;
}> {
  if (!isAndroidApk()) {
    return {
      checked: false,
      hasUpdate: false,
      message: 'Bạn đang xem trực tiếp trên trình duyệt Website (luôn là bản mới nhất từ máy chủ). Tính năng tải gói OTA dùng cho bản cài đặt Android (.apk).',
    };
  }
  const url = (overrideUrl?.trim() ? saveCustomOtaDomain(overrideUrl) : resolveConfiguredManifestUrl());
  if (!url) {
    return {
      checked: false,
      hasUpdate: false,
      message: 'Chưa cấu hình địa chỉ máy chủ Website nguồn OTA. Hãy nhập tên miền Website của bạn ở ô bên trên.',
    };
  }
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return {
      checked: false,
      hasUpdate: false,
      message: 'Thiết bị đang ngoại tuyến (Offline). Ứng dụng đang hiển thị an toàn bản cập nhật gần nhất lưu trong máy.',
    };
  }
  try {
    const res = await DotQuyNative.checkForWebUpdate({ manifestUrl: url });
    if (res.error) {
      return {
        checked: true,
        hasUpdate: false,
        message: `Không thể tải bản mới lúc này (${res.error}). Đang giữ nguyên bản an toàn trong máy.`,
      };
    }
    if (res.hasUpdate) {
      return {
        checked: true,
        hasUpdate: true,
        message: `Đã tải và xác thực SHA-256 thành công bản cập nhật ${res.version || 'mới'}! Bấm "Áp dụng ngay" để làm mới giao diện.`,
      };
    }
    return {
      checked: true,
      hasUpdate: false,
      message: `Ứng dụng đã ở phiên bản mới nhất đồng bộ với Website (${res.version || 'hiện tại'}).`,
    };
  } catch {
    return {
      checked: false,
      hasUpdate: false,
      message: 'Kết nối mạng chập chờn — giữ nguyên bản lưu trữ nội bộ an toàn.',
    };
  }
}

export async function readCurrentOtaInfo(): Promise<OtaStatusInfo> {
  if (!isAndroidApk()) {
    return { currentVersion: 'Web Live', source: 'web' };
  }
  try {
    return await DotQuyNative.getOtaStatus();
  } catch {
    return { currentVersion: '1.0.0-seed', source: 'apk_seed' };
  }
}
