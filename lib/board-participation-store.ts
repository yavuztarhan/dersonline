'use client';

export interface BoardParticipationRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  classSection: string;
  school?: string;
  teacherId?: string;
  teacherName?: string;
  activityType: 'game' | 'test' | 'rubric' | 'journal';
  activityTitle: string;
  outcomeCode?: string;
  subject?: string; // 'Matematik', 'Fen Bilimleri' vb.
  score?: number;
  maxScore?: number;
  xpEarned: number;
  timestamp: string; // ISO string
}

export function getSubjectFromOutcomeOrRecord(record: {
  subject?: string;
  outcomeCode?: string;
  activityTitle?: string;
}): string {
  if (record.subject && record.subject.trim()) {
    return record.subject.trim();
  }
  const code = (record.outcomeCode || '').toUpperCase();
  if (code.startsWith('MAT') || code.startsWith('M.')) return 'Matematik';
  if (code.startsWith('FEN') || code.startsWith('F.')) return 'Fen Bilimleri';
  if (code.startsWith('TÜR') || code.startsWith('TUR') || code.startsWith('TR.')) return 'Türkçe';
  if (code.startsWith('SOS') || code.startsWith('SB.')) return 'Sosyal Bilgiler';
  if (code.startsWith('İNG') || code.startsWith('ING') || code.startsWith('ENG')) return 'İngilizce';
  if (code.startsWith('DİN') || code.startsWith('DKAB') || code.startsWith('D.')) return 'Din Kültürü ve Ahlak Bilgisi';

  const title = (record.activityTitle || '').toLowerCase();
  if (title.includes('fen') || title.includes('deney') || title.includes('kuvvet')) return 'Fen Bilimleri';
  if (title.includes('türkçe') || title.includes('okuma') || title.includes('yazma')) return 'Türkçe';

  return 'Matematik'; // default
}

const STORAGE_KEY = 'maarif_board_participations_v1';
const ACTIVE_BOARD_STUDENT_KEY = 'maarif_active_board_student_v1';

// Rich seed records across days to demonstrate historical progression and trend curves
const SEED_BOARD_PARTICIPATIONS: BoardParticipationRecord[] = [];

export function getStoredBoardParticipations(): BoardParticipationRecord[] {
  if (typeof window === 'undefined') return SEED_BOARD_PARTICIPATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BOARD_PARTICIPATIONS));
      return SEED_BOARD_PARTICIPATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_BOARD_PARTICIPATIONS;
  } catch (err) {
    console.warn('Board participation read error:', err);
    return SEED_BOARD_PARTICIPATIONS;
  }
}

export function saveBoardParticipation(
  record: Omit<BoardParticipationRecord, 'id' | 'timestamp'>
): BoardParticipationRecord {
  const current = getStoredBoardParticipations();
  const newRecord: BoardParticipationRecord = {
    ...record,
    id: `bp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString()
  };

  const updated = [newRecord, ...current];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Dispatch custom event for real-time reactivity across tabs/components
      window.dispatchEvent(new CustomEvent('maarif_board_participation_added', { detail: newRecord }));

      // Asynchronous API call to persist in DB
      fetch('/api/board-participations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      }).catch((apiErr) => {
        console.warn('Background board participation API sync warning:', apiErr);
      });
    } catch (err) {
      console.warn('Failed to save board participation to localStorage:', err);
    }
  }

  return newRecord;
}

export function getStudentBoardParticipationsHistory(
  studentNumber: string,
  studentId?: string
): BoardParticipationRecord[] {
  const all = getStoredBoardParticipations();
  return all.filter(
    (r) =>
      (studentNumber && r.studentNumber === studentNumber) ||
      (studentId && r.studentId === studentId)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

// Active Board Student in Session Management
export function getStoredActiveBoardStudent(): {
  id: string;
  name: string;
  studentNumber: string;
  classSection: string;
  school?: string;
  points?: number;
} | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_BOARD_STUDENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredActiveBoardStudent(student: {
  id: string;
  name: string;
  studentNumber: string;
  classSection: string;
  school?: string;
  points?: number;
} | null) {
  if (typeof window === 'undefined') return;
  try {
    if (student) {
      localStorage.setItem(ACTIVE_BOARD_STUDENT_KEY, JSON.stringify(student));
    } else {
      localStorage.removeItem(ACTIVE_BOARD_STUDENT_KEY);
    }
    window.dispatchEvent(new CustomEvent('maarif_active_board_student_changed', { detail: student }));
  } catch (e) {
    console.warn('Error setting active board student:', e);
  }
}

export function clearActiveBoardStudent() {
  setStoredActiveBoardStudent(null);
}
