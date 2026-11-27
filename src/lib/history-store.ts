import { DotQuyNative, isAndroidApk } from './native-bridge';

export type TestKind = 'acute_befast' | 'tia_resolved' | 'baseline_risk';

export type TestOutcome =
  | 'emergency'
  | 'uncertain'
  | 'tia_warning'
  | 'no_common_signs'
  | 'abandoned'
  | 'risk_low'
  | 'risk_medium'
  | 'risk_high'
  | 'risk_very_high';

export type StepAnswer = 'yes' | 'no' | 'unsure' | 'not_asked';

export interface FamilyProfile {
  id: string;
  label: string;         // e.g. "Bố", "Mẹ", "Tôi"
  fullName: string;
  birthYear: string;
  weightKg: string;      // Critical for Tenecteplase/Alteplase mg/kg dosing
  anticoagulants: string;
  otherMeds: string;
  conditions: string;
  allergies: string;
  emergencyContact: string;
}

export interface TestRecord {
  id: string;
  schema: 1;
  test: TestKind;
  testVersion: string;
  personId: string;      // 'unassigned' until confirmed when >=2 profiles exist (Rule H9)
  personLabel: string;
  startedAt: string;     // ISO 8601
  finishedAt: string;
  answers: Record<string, StepAnswer>;
  positiveSigns: string[];
  outcome: TestOutcome;
  resolvedDetails?: {
    signs: string[];
    onsetDesc: string;
    duration: 'lt5m' | '5_15m' | '15_60m' | 'gt60m' | 'unknown';
    side: 'left' | 'right' | 'unknown';
  };
  riskLevelLabel?: string;
  lkwConfirmedIso?: string;
  actions: {
    type: 'tapped_call_115' | 'marked_called_115' | 'marked_hospital_visited' | 'note';
    at: string;
    text?: string;
  }[];
}

export interface VaultPayload {
  schema: 1;
  profiles: FamilyProfile[];
  records: TestRecord[];
}

const IDB_DB_NAME = 'dotquy115_vault_db';
const IDB_STORE = 'vault';
const IDB_KEY = 'primary_vault_v1';
const MAX_RECORDS = 500;

const DEFAULT_PROFILES: FamilyProfile[] = [
  {
    id: 'bo',
    label: 'Bố',
    fullName: '',
    birthYear: '1958',
    weightKg: '62',
    anticoagulants: '',
    otherMeds: '',
    conditions: 'Tăng huyết áp',
    allergies: 'Không rõ',
    emergencyContact: '',
  },
  {
    id: 'me',
    label: 'Mẹ',
    fullName: '',
    birthYear: '1962',
    weightKg: '54',
    anticoagulants: '',
    otherMeds: '',
    conditions: '',
    allergies: 'Không rõ',
    emergencyContact: '',
  },
  {
    id: 'toi',
    label: 'Tôi',
    fullName: '',
    birthYear: '1988',
    weightKg: '65',
    anticoagulants: '',
    otherMeds: '',
    conditions: '',
    allergies: 'Không',
    emergencyContact: '',
  },
];

let memoryFallbackVault: VaultPayload = {
  schema: 1,
  profiles: structuredClone(DEFAULT_PROFILES),
  records: [],
};

function openIdb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(IDB_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function readIdbVault(): Promise<VaultPayload | null> {
  const db = await openIdb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
    req.onsuccess = () => {
      db.close();
      resolve(req.result || null);
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

async function writeIdbVault(payload: VaultPayload): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().catch(() => {});
  }
  const db = await openIdb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(payload, IDB_KEY);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

/* Rule H8: Storage read/write failures NEVER throw or block emergency UI */
export async function loadVault(): Promise<{ vault: VaultPayload; persisted: boolean }> {
  try {
    if (isAndroidApk()) {
      const res = await DotQuyNative.readEncryptedVault();
      if (res.data) {
        const parsed = JSON.parse(res.data) as VaultPayload;
        memoryFallbackVault = parsed;
        return { vault: parsed, persisted: true };
      }
    } else {
      const idbData = await readIdbVault();
      if (idbData && Array.isArray(idbData.profiles) && Array.isArray(idbData.records)) {
        memoryFallbackVault = idbData;
        return { vault: idbData, persisted: true };
      }
    }
  } catch {
    // Graceful fallback to in-memory vault (Rule H8)
  }
  return { vault: memoryFallbackVault, persisted: true };
}

export async function saveVault(vault: VaultPayload): Promise<boolean> {
  if (vault.records.length > MAX_RECORDS) {
    vault.records = vault.records.slice(0, MAX_RECORDS);
  }
  memoryFallbackVault = vault;
  try {
    if (isAndroidApk()) {
      await DotQuyNative.writeEncryptedVault({ data: JSON.stringify(vault) });
      return true;
    }
    await writeIdbVault(vault);
    return true;
  } catch {
    return false;
  }
}

export function makeUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'rec-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}

export async function addTestRecord(record: TestRecord): Promise<{ saved: boolean; vault: VaultPayload }> {
  const { vault } = await loadVault();
  vault.records.unshift(record);
  const saved = await saveVault(vault);
  return { saved, vault };
}

/* Rule H9: Explicit 1-tap person assignment AFTER test completion so multi-member households never cross-contaminate */
export async function assignRecordToPerson(
  recordId: string,
  personId: string,
  personLabel: string
): Promise<VaultPayload> {
  const { vault } = await loadVault();
  const target = vault.records.find((r) => r.id === recordId);
  if (target) {
    target.personId = personId;
    target.personLabel = personLabel;
    await saveVault(vault);
  }
  return vault;
}

export async function logRecordAction(
  recordId: string,
  actionType: TestRecord['actions'][number]['type'],
  text?: string
): Promise<VaultPayload> {
  const { vault } = await loadVault();
  const target = vault.records.find((r) => r.id === recordId);
  if (target) {
    target.actions.push({ type: actionType, at: new Date().toISOString(), text });
    await saveVault(vault);
  }
  return vault;
}

/* Rule H3: Detect "Có dấu hiệu / Không chắc -> Sau đó không thấy dấu hiệu" within 48h for the SAME confirmed person */
export function detect48hTiaResolvedPattern(
  records: TestRecord[],
  currentRecordId: string,
  personId: string
): TestRecord | null {
  if (!personId || personId === 'unassigned' || personId === 'other') return null;
  const nowMs = Date.now();
  const fortyEightHoursMs = 48 * 3600 * 1000;

  for (const rec of records) {
    if (rec.id === currentRecordId) continue;
    if (rec.personId !== personId) continue;
    const recTime = new Date(rec.finishedAt).getTime();
    if (Number.isNaN(recTime) || nowMs - recTime > fortyEightHoursMs) continue;

    const wasPositive =
      rec.outcome === 'emergency' ||
      rec.outcome === 'uncertain' ||
      rec.outcome === 'tia_warning';
    const alreadyVisited = rec.actions.some((a) => a.type === 'marked_hospital_visited');
    if (wasPositive && !alreadyVisited) {
      return rec;
    }
  }
  return null;
}

/* Rule H5: Suggest candidate Last Known Well from a prior negative check within 24h (Requires user confirmation!) */
export function findCandidateLkwFromHistory(
  records: TestRecord[],
  currentRecordId: string,
  personId: string
): TestRecord | null {
  if (!personId || personId === 'unassigned' || personId === 'other') return null;
  const nowMs = Date.now();
  const twentyFourHoursMs = 24 * 3600 * 1000;

  for (const rec of records) {
    if (rec.id === currentRecordId) continue;
    if (rec.personId !== personId) continue;
    if (rec.outcome !== 'no_common_signs') continue; // Abandoned records NEVER count as negative!
    const recTime = new Date(rec.finishedAt).getTime();
    if (!Number.isNaN(recTime) && nowMs - recTime <= twentyFourHoursMs) {
      return rec;
    }
  }
  return null;
}

/* Rule H1: Check if an old record is > 2 hours stale */
export function isRecordStale(isoTimestamp: string, thresholdHours = 2): boolean {
  const t = new Date(isoTimestamp).getTime();
  if (Number.isNaN(t)) return true;
  return Date.now() - t > thresholdHours * 3600 * 1000;
}

export function formatClockVi(isoTimestamp: string): string {
  const d = new Date(isoTimestamp);
  if (Number.isNaN(d.getTime())) return '--:--';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function formatRelativeVi(isoTimestamp: string): string {
  const ms = Date.now() - new Date(isoTimestamp).getTime();
  if (Number.isNaN(ms)) return '';
  if (ms < 0) return 'Giờ trên máy có thể bị lệch';
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hours < 24) return rem > 0 ? `${hours} giờ ${rem} phút trước` : `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}
