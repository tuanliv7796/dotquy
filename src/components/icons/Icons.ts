export const ICON_PATHS: Record<string, string> = {
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  aid: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  alert: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 9.5v4.5M12 17.2h.01"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="M5.7 5.7l12.6 12.6"/>',
  shieldCheck: '<path d="M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z"/><path d="M9 12.2l2.2 2.2 4.3-4.4"/>',
  speaker: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4.2-4.2"/>',
  mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  home: '<path d="M3 10.8L12 3.5l9 7.3V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1z"/>',
  clipboard: '<path d="M9 3h6v3H9z"/><path d="M8 4.5H6a1.5 1.5 0 0 0-1.5 1.5v13.5A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 18 4.5h-2"/><path d="M8.5 11.5h7M8.5 15.5h5"/>',
  book: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19"/>',
  userCard: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="10.5" r="2.2"/><path d="M5.8 16.2c.6-1.5 1.8-2.2 3.2-2.2s2.6.7 3.2 2.2M14.5 9.5h3.8M14.5 13h3.8"/>',
  hospital: '<path d="M4 21h16M6 21V5a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 18 5v16"/><path d="M12 7.5v5M9.5 10h5M10 21v-4.5h4V21"/>',
  heartPulse: '<path d="M12 20s-8-4.9-8-10.8A4.4 4.4 0 0 1 12 6.6a4.4 4.4 0 0 1 8 2.6C20 15.1 12 20 12 20z"/><path d="M7 12h2.5l1.4-2.5 2 4.6 1.5-2.1H17"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  share: '<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v12M7.5 7.5L12 3l4.5 4.5"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevRight: '<path d="M9 6l6 6-6 6"/>',
  chevLeft: '<path d="M15 6l-6 6 6 6"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.1 5.4M20 6v5h-5"/>',
  face: '<circle cx="12" cy="12" r="9"/><path d="M9 9.5h.01M15 9.5h.01"/><path d="M8.2 14.2c1.4 1.6 3.5 2 5.2 1.4 1-.4 1.8-1.1 2.6-2.4"/>',
  arm: '<circle cx="12" cy="4.5" r="2"/><path d="M12 6.5v8M12 14.5l-3 6M12 14.5l3 6M12 9l-7-1M12 9l6.5 3.5"/>',
  speech: '<path d="M4 5h16v10H10l-5 4v-4H4z"/><path d="M8 9h8M8 12h5"/>',
  eye: '<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  balance: '<circle cx="11" cy="4.5" r="2"/><path d="M11 6.5l1.2 7M12.2 13.5l-3.5 7M12.2 13.5l3.8 6.5M6 9.5l11-1.5"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  circleDot: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" fill="currentColor"/>',
  circleHollow: '<circle cx="12" cy="12" r="8"/>',
  question: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.5 2.5 0 0 1 4.8.8c0 1.6-2.4 2.1-2.4 3.5M12 17h.01"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/>',
  moon: '<path d="M20.4 14.8A8.5 8.5 0 0 1 9.2 3.6a8.5 8.5 0 1 0 11.2 11.2z"/>',
  contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor"/>',
  download: '<path d="M12 3v12M7.5 10.5L12 15l4.5-4.5M4 19h16"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
};

export function renderIcon(name: keyof typeof ICON_PATHS | string, size = 22, strokeWidth = 2.1): string {
  const path = ICON_PATHS[name] || ICON_PATHS.info || '<circle cx="12" cy="12" r="9"/>';
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

export function renderBrandMark(size = 32): string {
  return `<svg viewBox="0 0 36 36" width="${size}" height="${size}" aria-hidden="true">
    <rect width="36" height="36" rx="10" fill="#B91C1C"/>
    <circle cx="18" cy="18" r="10.5" fill="none" stroke="#FFFFFF" stroke-opacity="0.32" stroke-width="2.2"/>
    <path d="M18 7.5A10.5 10.5 0 0 1 28 15" fill="none" stroke="#F0B323" stroke-width="3.6" stroke-linecap="round"/>
    <path d="M18 12v6.2l4 2.4" fill="none" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}
