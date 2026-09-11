import { randomBytes } from 'crypto';

export type DeviceCategory = 'mobile' | 'smartboard' | 'windows' | 'desktop';

export interface DeviceSessionConfig {
  category: DeviceCategory;
  name: string;
  durationMs: number;
  durationLabel: string;
}

export const DEVICE_SESSION_CONFIGS: Record<DeviceCategory, DeviceSessionConfig> = {
  mobile: {
    category: 'mobile',
    name: 'Mobil Cihaz (Telefon / Tablet)',
    durationMs: 7 * 24 * 60 * 60 * 1000, // 7 Gün (168 saat)
    durationLabel: '7 Gün'
  },
  smartboard: {
    category: 'smartboard',
    name: 'Akıllı Tahta (MEB Pardus / ETAP)',
    durationMs: 2 * 60 * 60 * 1000, // 2 Saat
    durationLabel: '2 Saat'
  },
  windows: {
    category: 'windows',
    name: 'Windows Masaüstü / Dizüstü',
    durationMs: 8 * 60 * 60 * 1000, // 8 Saat
    durationLabel: '8 Saat'
  },
  desktop: {
    category: 'desktop',
    name: 'Masaüstü Cihaz',
    durationMs: 8 * 60 * 60 * 1000, // 8 Saat
    durationLabel: '8 Saat'
  }
};

/**
 * Detects device category from User-Agent string.
 * Special attention to MEB Smart Boards which run Pardus Linux / ETAP.
 */
export function detectDeviceCategory(userAgent?: string | null, clientHint?: string | null): DeviceCategory {
  if (clientHint && clientHint in DEVICE_SESSION_CONFIGS) {
    return clientHint as DeviceCategory;
  }

  if (!userAgent) return 'desktop';
  const ua = userAgent.toLowerCase();

  // 1. MEB Smart Board Detection (Pardus, ETAP, X11 Linux boards)
  if (
    ua.includes('pardus') ||
    ua.includes('etap') ||
    (ua.includes('linux') && (ua.includes('x11') || ua.includes('board')) && !ua.includes('android'))
  ) {
    return 'smartboard';
  }

  // 2. Mobile Detection (iOS, Android, Windows Phone)
  if (
    ua.includes('mobile') ||
    ua.includes('android') ||
    ua.includes('iphone') ||
    ua.includes('ipad') ||
    ua.includes('ipod')
  ) {
    return 'mobile';
  }

  // 3. Windows Detection
  if (ua.includes('windows') || ua.includes('win32') || ua.includes('win64')) {
    return 'windows';
  }

  // 4. Default / Mac / Other Desktop
  return 'desktop';
}

export interface BoardLoginRequest {
  channelId: string;
  pin: string; // 4-character alphanumeric uppercase
  status: 'pending' | 'approved' | 'expired' | 'rejected';
  createdAt: number;
  expiresAt: number; // 2 minutes
  deviceCategory: DeviceCategory;
  approvedUser?: any;
  sessionToken?: string;
  sessionExpiresAt?: number;
}

export interface ActiveUserSession {
  sessionId: string;
  userId: string;
  userEmail: string;
  deviceCategory: DeviceCategory;
  createdAt: number;
  expiresAt: number;
  lastActiveAt: number;
  userAgent?: string;
}

// In-memory singletons for active board requests and device sessions (survives across requests in Node process)
const globalStore = global as unknown as {
  __boardSessions?: Map<string, BoardLoginRequest>;
  __boardPinIndex?: Map<string, string>; // pin -> channelId
  __userActiveSessions?: Map<string, Map<DeviceCategory, ActiveUserSession>>; // userId -> (category -> session)
};

if (!globalStore.__boardSessions) {
  globalStore.__boardSessions = new Map();
}
if (!globalStore.__boardPinIndex) {
  globalStore.__boardPinIndex = new Map();
}
if (!globalStore.__userActiveSessions) {
  globalStore.__userActiveSessions = new Map();
}

const boardSessions = globalStore.__boardSessions;
const boardPinIndex = globalStore.__boardPinIndex;
const userActiveSessions = globalStore.__userActiveSessions;

// Allowed PIN characters: Clear, unambiguous uppercase letters and digits (omits O, 0, I, 1, L)
const PIN_CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

export function generate4DigitPin(): string {
  let pin = '';
  const bytes = randomBytes(4);
  for (let i = 0; i < 4; i++) {
    pin += PIN_CHARS[bytes[i] % PIN_CHARS.length];
  }
  return pin;
}

/**
 * Creates a new pending Smart Board login session request.
 * Generates an intuitive 4-digit PIN and a unique channelId.
 */
export function createBoardSession(deviceCategory: DeviceCategory = 'smartboard'): BoardLoginRequest {
  cleanupExpiredBoardSessions();

  const channelId = `bs_${Date.now()}_${randomBytes(8).toString('hex')}`;
  
  // Ensure unique 4-character PIN
  let pin = generate4DigitPin();
  let attempts = 0;
  while (boardPinIndex.has(pin) && attempts < 10) {
    pin = generate4DigitPin();
    attempts++;
  }

  const now = Date.now();
  const expiresAt = now + 2.5 * 60 * 1000; // 2.5 minutes expiry for QR/PIN

  const sessionReq: BoardLoginRequest = {
    channelId,
    pin,
    status: 'pending',
    createdAt: now,
    expiresAt,
    deviceCategory
  };

  boardSessions.set(channelId, sessionReq);
  boardPinIndex.set(pin, channelId);

  return sessionReq;
}

export function getBoardSession(channelId: string): BoardLoginRequest | null {
  const req = boardSessions.get(channelId);
  if (!req) return null;

  if (Date.now() > req.expiresAt && req.status === 'pending') {
    req.status = 'expired';
    boardPinIndex.delete(req.pin);
  }

  return req;
}

export function getBoardSessionByPin(pin: string): BoardLoginRequest | null {
  const cleanPin = pin.trim().toUpperCase();
  const channelId = boardPinIndex.get(cleanPin);
  if (!channelId) return null;
  return getBoardSession(channelId);
}

/**
 * Approves a board login session when a teacher scans the QR or enters the 4-digit PIN.
 * Implements:
 * 1. Correct session duration based on board device category (Pardus: 2 hours).
 * 2. Single active session per device category: Replaces any previous smartboard session for this teacher!
 */
export function approveBoardSession(
  identifier: { channelId?: string; pin?: string },
  teacherUser: any
): { success: boolean; error?: string; session?: BoardLoginRequest } {
  let req: BoardLoginRequest | null = null;

  if (identifier.channelId) {
    req = getBoardSession(identifier.channelId);
  } else if (identifier.pin) {
    req = getBoardSessionByPin(identifier.pin);
  }

  if (!req) {
    return { success: false, error: 'Geçersiz veya süresi dolmuş Akıllı Tahta oturumu.' };
  }

  if (req.status === 'expired' || Date.now() > req.expiresAt) {
    return { success: false, error: 'Bu QR kod veya PIN kodunun süresi dolmuş. Tahtadan yenisini alınız.' };
  }

  if (req.status === 'approved') {
    return { success: false, error: 'Bu oturum daha önce onaylanmıştır.' };
  }

  // Calculate duration based on the device category of the board
  const boardConfig = DEVICE_SESSION_CONFIGS[req.deviceCategory] || DEVICE_SESSION_CONFIGS.smartboard;
  const now = Date.now();
  const sessionExpiresAt = now + boardConfig.durationMs;
  const sessionToken = `mrf_sess_${randomBytes(24).toString('hex')}`;

  // 3. Register active user session & Terminate any previous session of the SAME category
  const activeSession: ActiveUserSession = {
    sessionId: sessionToken,
    userId: teacherUser.id,
    userEmail: teacherUser.email,
    deviceCategory: req.deviceCategory,
    createdAt: now,
    expiresAt: sessionExpiresAt,
    lastActiveAt: now
  };

  registerUserActiveSession(activeSession);

  req.status = 'approved';
  req.approvedUser = teacherUser;
  req.sessionToken = sessionToken;
  req.sessionExpiresAt = sessionExpiresAt;

  // Clean up PIN index
  boardPinIndex.delete(req.pin);

  return { success: true, session: req };
}

/**
 * Registers an active session for a user on a specific device category.
 * CRITICAL RULE:
 * A teacher can have 1 session per device category (e.g. 1 on Mobile, 1 on Smart Board).
 * If they log in on another Smart Board, the previous Smart Board session is terminated!
 */
export function registerUserActiveSession(session: ActiveUserSession): void {
  const userId = session.userId;
  let userMap = userActiveSessions.get(userId);

  if (!userMap) {
    userMap = new Map();
    userActiveSessions.set(userId, userMap);
  }

  // Set the new session for this device category (overwrites and replaces previous session in this category)
  userMap.set(session.deviceCategory, session);
}

/**
 * Validates whether a given sessionId is still the active session for that user and category.
 * If another smart board logged in with the same teacher account, this returns isValid: false.
 */
export function validateUserSession(
  userId: string,
  sessionId: string,
  deviceCategory: DeviceCategory
): { isValid: boolean; reason?: 'not_found' | 'expired' | 'replaced_by_newer_device' } {
  const userMap = userActiveSessions.get(userId);
  if (!userMap) {
    // If no active session recorded yet in memory, allow fallback to token expiry
    return { isValid: true };
  }

  const currentCategorySession = userMap.get(deviceCategory);
  if (!currentCategorySession) {
    return { isValid: true };
  }

  // CRITICAL RULE:
  // ONLY Smart Boards ('smartboard') enforce single-session concurrency,
  // so when a teacher logs into a new classroom board, the old classroom board terminates.
  // Personal phones ('mobile') and personal computers ('windows', 'desktop') NEVER terminate each other!
  if (deviceCategory === 'smartboard' && currentCategorySession.sessionId !== sessionId) {
    return {
      isValid: false,
      reason: 'replaced_by_newer_device'
    };
  }

  if (Date.now() > currentCategorySession.expiresAt) {
    return {
      isValid: false,
      reason: 'expired'
    };
  }

  currentCategorySession.lastActiveAt = Date.now();
  return { isValid: true };
}

/**
 * Removes sessions that have exceeded their valid duration.
 */
function cleanupExpiredBoardSessions() {
  const now = Date.now();
  boardSessions.forEach((req, chId) => {
    if (now > req.expiresAt + 60000) {
      boardPinIndex.delete(req.pin);
      boardSessions.delete(chId);
    }
  });
}
