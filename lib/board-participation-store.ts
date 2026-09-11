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

// Rich seed records across days to demonstrate historical progression and trend curves
const SEED_BOARD_PARTICIPATIONS: BoardParticipationRecord[] = [
  // Çırak Hasan (104) Progression
  {
    id: 'bp-seed-1',
    studentId: 'stu-104',
    studentName: 'Çırak Hasan',
    studentNumber: '104',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'game',
    activityTitle: 'Açı Radar Simülasyonu',
    outcomeCode: 'MAT.5.3.1',
    score: 80,
    maxScore: 100,
    xpEarned: 100,
    timestamp: '2026-09-02T09:15:00Z'
  },
  {
    id: 'bp-seed-2',
    studentId: 'stu-104',
    studentName: 'Çırak Hasan',
    studentNumber: '104',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'rubric',
    activityTitle: 'Öz Değerlendirme Formu (Rubrik)',
    outcomeCode: 'MAT.5.3.1',
    score: 85,
    maxScore: 100,
    xpEarned: 70,
    timestamp: '2026-09-05T10:30:00Z'
  },
  {
    id: 'bp-seed-3',
    studentId: 'stu-104',
    studentName: 'Çırak Hasan',
    studentNumber: '104',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'test',
    activityTitle: 'Kazanım Değerlendirme Testi',
    outcomeCode: 'MAT.5.3.2',
    score: 90,
    maxScore: 100,
    xpEarned: 110,
    timestamp: '2026-09-08T11:00:00Z'
  },
  {
    id: 'bp-seed-4',
    studentId: 'stu-104',
    studentName: 'Çırak Hasan',
    studentNumber: '104',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'game',
    activityTitle: 'Kavşak Mimarı & Ters Açı Oyunu',
    outcomeCode: 'MAT.5.3.3',
    score: 100,
    maxScore: 100,
    xpEarned: 150,
    timestamp: '2026-09-10T10:15:00Z'
  },
  {
    id: 'bp-seed-5',
    studentId: 'stu-104',
    studentName: 'Çırak Hasan',
    studentNumber: '104',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'journal',
    activityTitle: 'Öğrenme Günlüğü & Yansıtma',
    outcomeCode: 'MAT.5.3.3',
    score: 95,
    maxScore: 100,
    xpEarned: 60,
    timestamp: '2026-09-11T09:40:00Z'
  },

  // Ahmet Yılmaz (101) Progression
  {
    id: 'bp-seed-6',
    studentId: 'stu-101',
    studentName: 'Ahmet Yılmaz',
    studentNumber: '101',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'game',
    activityTitle: 'Kavşak Mimarı Oyunu',
    outcomeCode: 'MAT.5.3.1',
    score: 75,
    maxScore: 100,
    xpEarned: 90,
    timestamp: '2026-09-04T13:20:00Z'
  },
  {
    id: 'bp-seed-7',
    studentId: 'stu-101',
    studentName: 'Ahmet Yılmaz',
    studentNumber: '101',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'test',
    activityTitle: 'Kazanım Değerlendirme Testi',
    outcomeCode: 'MAT.5.3.3',
    score: 85,
    maxScore: 100,
    xpEarned: 95,
    timestamp: '2026-09-09T14:15:00Z'
  },
  {
    id: 'bp-seed-8',
    studentId: 'stu-101',
    studentName: 'Ahmet Yılmaz',
    studentNumber: '101',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'game',
    activityTitle: 'Radar Açı Ölçme Simülasyonu',
    outcomeCode: 'MAT.5.3.4',
    score: 95,
    maxScore: 100,
    xpEarned: 130,
    timestamp: '2026-09-11T11:10:00Z'
  },

  // Zeynep Kaya (102) Progression
  {
    id: 'bp-seed-9',
    studentId: 'stu-102',
    studentName: 'Zeynep Kaya',
    studentNumber: '102',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'rubric',
    activityTitle: 'Öz Değerlendirme Formu (Rubrik)',
    outcomeCode: 'MAT.5.3.2',
    score: 90,
    maxScore: 100,
    xpEarned: 75,
    timestamp: '2026-09-06T10:00:00Z'
  },
  {
    id: 'bp-seed-10',
    studentId: 'stu-102',
    studentName: 'Zeynep Kaya',
    studentNumber: '102',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'game',
    activityTitle: 'Kavram Eşleme Bulmacası',
    outcomeCode: 'MAT.5.3.3',
    score: 100,
    maxScore: 100,
    xpEarned: 140,
    timestamp: '2026-09-10T14:45:00Z'
  },

  // Mustafa Demir (103)
  {
    id: 'bp-seed-11',
    studentId: 'stu-103',
    studentName: 'Mustafa Demir',
    studentNumber: '103',
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    activityType: 'journal',
    activityTitle: 'Öğrenme Günlüğü & Yansıtma',
    outcomeCode: 'MAT.5.3.1',
    score: 85,
    maxScore: 100,
    xpEarned: 50,
    timestamp: '2026-09-11T09:30:00Z'
  },

  // Elif Çelik (215)
  {
    id: 'bp-seed-12',
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
