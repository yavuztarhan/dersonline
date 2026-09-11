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
  score?: number;
  maxScore?: number;
  xpEarned: number;
  timestamp: string; // ISO string
}

const STORAGE_KEY = 'maarif_board_participations_v1';
const ACTIVE_BOARD_STUDENT_KEY = 'maarif_active_board_student_v1';

// Initial realistic seed records for demonstration
const SEED_BOARD_PARTICIPATIONS: BoardParticipationRecord[] = [
  {
    id: 'bp-seed-1',
    studentId: 'stu-104',
    studentName: 'Çırak Hasan',
    studentNumber: '104',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'game',
    activityTitle: 'Radar Açı Ölçme Simülasyonu',
    outcomeCode: 'MAT.5.3.3',
    score: 100,
    maxScore: 100,
    xpEarned: 150,
    timestamp: '2026-09-10T10:15:00Z'
  },
  {
    id: 'bp-seed-2',
    studentId: 'stu-104',
    studentName: 'Çırak Hasan',
    studentNumber: '104',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'test',
    activityTitle: 'Kazanım Değerlendirme Testi',
    outcomeCode: 'MAT.5.3.4',
    score: 95,
    maxScore: 100,
    xpEarned: 100,
    timestamp: '2026-09-10T11:20:00Z'
  },
  {
    id: 'bp-seed-3',
    studentId: 'stu-101',
    studentName: 'Ahmet Yılmaz',
    studentNumber: '101',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'game',
    activityTitle: 'Kavşak Mimarı & Ters Açı Oyunu',
    outcomeCode: 'MAT.5.3.4',
    score: 90,
    maxScore: 100,
    xpEarned: 130,
    timestamp: '2026-09-10T14:10:00Z'
  },
  {
    id: 'bp-seed-4',
    studentId: 'stu-102',
    studentName: 'Zeynep Kaya',
    studentNumber: '102',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'rubric',
    activityTitle: 'Öz Değerlendirme Formu (Rubrik)',
    outcomeCode: 'MAT.5.3.3',
    score: 96,
    maxScore: 100,
    xpEarned: 80,
    timestamp: '2026-09-10T14:45:00Z'
  },
  {
    id: 'bp-seed-5',
    studentId: 'stu-103',
    studentName: 'Mustafa Demir',
    studentNumber: '103',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'journal',
    activityTitle: 'Öğrenme Günlüğü & Yansıtma',
    outcomeCode: 'MAT.5.3.1',
    xpEarned: 50,
    timestamp: '2026-09-11T09:30:00Z'
  },
  {
    id: 'bp-seed-6',
    studentId: 'stu-215',
    studentName: 'Elif Çelik',
    studentNumber: '215',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'game',
    activityTitle: 'Kavram Hafıza Kartı & Eşleme',
    outcomeCode: 'MAT.5.3.1',
    score: 100,
    maxScore: 100,
    xpEarned: 140,
    timestamp: '2026-09-11T10:05:00Z'
  }
];

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
    } catch (err) {
      console.warn('Failed to save board participation to localStorage:', err);
    }
  }

  return newRecord;
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
