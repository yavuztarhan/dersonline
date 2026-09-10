'use client';

import { getStoredSubmissions, RubricSubmissionRecord } from '@/lib/rubric-store';
import { getStoredStudentActivities, StudentActivityScore } from '@/lib/student-performance-store';
import { getStoredGroups, StudentGroup, StudentGroupMember } from '@/lib/student-group-store';

export interface PeerEvaluationRecord {
  id: string;
  evaluatorStudentId: string;
  evaluatorStudentName: string;
  evaluatorStudentNumber: string;
  targetStudentId: string;
  targetStudentName: string;
  targetStudentNumber: string;
  targetAvatar?: string;
  groupId: string;
  groupName: string;
  classSection: string; // '5-A', '5-B'
  outcomeCode: string; // 'MAT.5.3.3', 'MAT.5.3.1', etc.
  outcomeTitle: string;
  ratings: Record<string, number>; // { c1: 4, c2: 3, c3: 4, c4: 4, c5: 3 }
  totalScore: number;
  maxScore: number;
  percentage: number;
  performanceLevel: 'Mükemmel' | 'Başarılı' | 'Orta' | 'Geliştirilmeli';
  evaluatorNote?: string;
  submittedAt: string;
}

const STORAGE_PEER_EVALUATIONS_KEY = 'maarif_peer_evaluations_v1';

// Pre-populated Seed Peer Evaluations for 5-A students (Ahmet, Hasan, Zeynep, Mustafa, Elif)
const SEED_PEER_EVALUATIONS: PeerEvaluationRecord[] = [
  // Ahmet evaluating Hasan
  {
    id: 'pe-seed-1',
    evaluatorStudentId: 'stu-101',
    evaluatorStudentName: 'Ahmet Yılmaz',
    evaluatorStudentNumber: '101',
    targetStudentId: 'stu-201',
    targetStudentName: 'Çırak Hasan',
    targetStudentNumber: '104',
    targetAvatar: '👦',
    groupId: 'grp-seed-1',
    groupName: 'Pisagor Kaşifleri',
    classSection: '5-A',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
    totalScore: 20,
    maxScore: 20,
    percentage: 100,
    performanceLevel: 'Mükemmel',
    evaluatorNote: 'Hasan iletkiyi ve radarı çok hızlı kullanıyor, grupta dar ve geniş açıları modellerken bize liderlik etti.',
    submittedAt: '2026-09-09T14:00:00Z'
  },
  // Zeynep evaluating Hasan
  {
    id: 'pe-seed-2',
    evaluatorStudentId: 'stu-102',
    evaluatorStudentName: 'Zeynep Kaya',
    evaluatorStudentNumber: '102',
    targetStudentId: 'stu-201',
    targetStudentName: 'Çırak Hasan',
    targetStudentNumber: '104',
    targetAvatar: '👦',
    groupId: 'grp-seed-1',
    groupName: 'Pisagor Kaşifleri',
    classSection: '5-A',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 3, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    evaluatorNote: 'Işınları döndürüp açı oluşturmada çok başarılı.',
    submittedAt: '2026-09-09T14:15:00Z'
  },
  // Hasan evaluating Ahmet
  {
    id: 'pe-seed-3',
    evaluatorStudentId: 'stu-201',
    evaluatorStudentName: 'Çırak Hasan',
    evaluatorStudentNumber: '104',
    targetStudentId: 'stu-101',
    targetStudentName: 'Ahmet Yılmaz',
    targetStudentNumber: '101',
    targetAvatar: '👦',
    groupId: 'grp-seed-1',
    groupName: 'Pisagor Kaşifleri',
    classSection: '5-A',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
    totalScore: 20,
    maxScore: 20,
    percentage: 100,
    performanceLevel: 'Mükemmel',
    evaluatorNote: 'Ahmet açı çeşitlerini ve derece okumalarını hatasız yaptı.',
    submittedAt: '2026-09-09T14:30:00Z'
  },
  // Zeynep evaluating Ahmet
  {
    id: 'pe-seed-4',
    evaluatorStudentId: 'stu-102',
    evaluatorStudentName: 'Zeynep Kaya',
    evaluatorStudentNumber: '102',
    targetStudentId: 'stu-101',
    targetStudentName: 'Ahmet Yılmaz',
    targetStudentNumber: '101',
    targetAvatar: '👦',
    groupId: 'grp-seed-1',
    groupName: 'Pisagor Kaşifleri',
    classSection: '5-A',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 4, c2: 3, c3: 4, c4: 4, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    evaluatorNote: 'Grup çalışmasında fikirlerimizi çok güzel özetledi.',
    submittedAt: '2026-09-09T15:00:00Z'
  },
  // Hasan evaluating Zeynep
  {
    id: 'pe-seed-5',
    evaluatorStudentId: 'stu-201',
    evaluatorStudentName: 'Çırak Hasan',
    evaluatorStudentNumber: '104',
    targetStudentId: 'stu-102',
    targetStudentName: 'Zeynep Kaya',
    targetStudentNumber: '102',
    targetAvatar: '👧',
    groupId: 'grp-seed-1',
    groupName: 'Pisagor Kaşifleri',
    classSection: '5-A',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 3 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    evaluatorNote: 'Zeynep pergel ve iletki çizimlerinde çok titiz çalıştı.',
    submittedAt: '2026-09-09T15:15:00Z'
  },
  // Mustafa evaluating Elif
  {
    id: 'pe-seed-6',
    evaluatorStudentId: 'stu-103',
    evaluatorStudentName: 'Mustafa Demir',
    evaluatorStudentNumber: '103',
    targetStudentId: 'stu-104',
    targetStudentName: 'Elif Çelik',
    targetStudentNumber: '105',
    targetAvatar: '👧',
    groupId: 'grp-seed-2',
    groupName: 'Harezmi Ekibi',
    classSection: '5-A',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
    totalScore: 20,
    maxScore: 20,
    percentage: 100,
    performanceLevel: 'Mükemmel',
    evaluatorNote: 'Elif dar ve geniş açıları ayırt ederken bize çok yardımcı oldu.',
    submittedAt: '2026-09-09T16:00:00Z'
  },
  // Elif evaluating Mustafa
  {
    id: 'pe-seed-7',
    evaluatorStudentId: 'stu-104',
    evaluatorStudentName: 'Elif Çelik',
    evaluatorStudentNumber: '105',
    targetStudentId: 'stu-103',
    targetStudentName: 'Mustafa Demir',
    targetStudentNumber: '103',
    targetAvatar: '👦',
    groupId: 'grp-seed-2',
    groupName: 'Harezmi Ekibi',
    classSection: '5-A',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 3, c2: 3, c3: 4, c4: 3, c5: 3 },
    totalScore: 16,
    maxScore: 20,
    percentage: 80,
    performanceLevel: 'Başarılı',
    evaluatorNote: 'Mustafa iletkiyi yerleştirirken biraz zorlandı ama çaba gösterdi.',
    submittedAt: '2026-09-09T16:20:00Z'
  }
];

export function getStoredPeerEvaluations(): PeerEvaluationRecord[] {
  if (typeof window === 'undefined') return SEED_PEER_EVALUATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_PEER_EVALUATIONS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_PEER_EVALUATIONS_KEY, JSON.stringify(SEED_PEER_EVALUATIONS));
      return SEED_PEER_EVALUATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_PEER_EVALUATIONS;
  } catch (err) {
    console.warn('Akran değerlendirmeleri yüklenirken hata:', err);
    return SEED_PEER_EVALUATIONS;
  }
}

export function saveStoredPeerEvaluations(evaluations: PeerEvaluationRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PEER_EVALUATIONS_KEY, JSON.stringify(evaluations));
  } catch (err) {
    console.warn('Akran değerlendirmeleri kaydedilirken hata:', err);
  }
}

export function savePeerEvaluation(record: Omit<PeerEvaluationRecord, 'id' | 'submittedAt'>): PeerEvaluationRecord {
  const newRecord: PeerEvaluationRecord = {
    ...record,
    id: `pe-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    submittedAt: new Date().toISOString()
  };

  const all = getStoredPeerEvaluations();
  // If an evaluation by same evaluator for same target on same outcome exists, replace it
  const filtered = all.filter(
    (e) =>
      !(
        e.evaluatorStudentId === newRecord.evaluatorStudentId &&
        e.targetStudentId === newRecord.targetStudentId &&
        e.outcomeCode === newRecord.outcomeCode
      )
  );

  const updated = [newRecord, ...filtered];
  saveStoredPeerEvaluations(updated);
  return newRecord;
}

export function getPeerEvaluationsForTargetStudent(
  targetStudentId: string,
  outcomeCode?: string
): PeerEvaluationRecord[] {
  const all = getStoredPeerEvaluations();
  return all.filter(
    (e) =>
      e.targetStudentId === targetStudentId &&
      (!outcomeCode || e.outcomeCode === outcomeCode)
  );
}

export function getPeerEvaluationsByEvaluator(
  evaluatorStudentId: string,
  outcomeCode?: string
): PeerEvaluationRecord[] {
  const all = getStoredPeerEvaluations();
  return all.filter(
    (e) =>
      e.evaluatorStudentId === evaluatorStudentId &&
      (!outcomeCode || e.outcomeCode === outcomeCode)
  );
}

export interface PendingPeerEvaluationItem {
  group: StudentGroup;
  targetMember: StudentGroupMember;
  outcomeCode: string;
  outcomeTitle: string;
  isCompleted: boolean;
  completedRecord?: PeerEvaluationRecord;
}

/**
 * Öğrencinin dahil olduğu çalışma gruplarında aktif olan akran değerlendirme görevlerini ve durumlarını döner.
 */
export function getPendingPeerEvaluationsForStudent(studentId: string): PendingPeerEvaluationItem[] {
  const allGroups = getStoredGroups();
  const allEvaluations = getStoredPeerEvaluations();

  const studentGroups = allGroups.filter((g) =>
    g.members.some((m) => m.id === studentId) && g.peerEvaluationEnabled
  );

  const items: PendingPeerEvaluationItem[] = [];

  studentGroups.forEach((group) => {
    const outcomeCode = group.peerEvaluationOutcomeCode || 'MAT.5.3.3';
    const outcomeTitle =
      group.peerEvaluationOutcomeTitle ||
      'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme';

    const otherMembers = group.members.filter((m) => m.id !== studentId);

    otherMembers.forEach((targetMember) => {
      const existing = allEvaluations.find(
        (e) =>
          e.evaluatorStudentId === studentId &&
          e.targetStudentId === targetMember.id &&
          e.outcomeCode === outcomeCode
      );

      items.push({
        group,
        targetMember,
        outcomeCode,
        outcomeTitle,
        isCompleted: !!existing,
        completedRecord: existing
      });
    });
  });

  return items;
}

export interface StudentTriangulatedData {
  studentId: string;
  studentName: string;
  studentNumber: string;
  classSection: string;
  outcomeCode: string;
  outcomeTitle: string;

  // 1. Öz Değerlendirme (Self-Assessment)
  selfScore: number | null; // e.g. 95 (%)
  selfSubmission: RubricSubmissionRecord | null;

  // 2. Akran Değerlendirme (Peer-Assessment)
  peerAverageScore: number | null; // e.g. 97.5 (%)
  peerReviewerCount: number; // e.g. 2 peers evaluated
  peerSubmissions: PeerEvaluationRecord[];

  // 3. Kazanım Oyun & Etkinlik Başarısı (Game Performance)
  activityScore: number | null; // e.g. 92 (%)
  activityCount: number;
  activityList: StudentActivityScore[];

  // 4. Korelasyon & Uyum Analizi (Triangulation Alignment)
  selfPeerDiff: number | null; // selfScore - peerAverageScore
  selfGameDiff: number | null; // selfScore - activityScore
  peerGameDiff: number | null; // peerAverageScore - activityScore
  overallCorrelationIndex: number; // 0 - 100 correlation/alignment index
  correlationStatus:
    | 'high_agreement' // Self, Peer, and Game are all in sync (difference < 12%)
    | 'modest_underconfident' // High Game/Peer score but self-score is significantly lower
    | 'overconfident' // High self-score but Game/Peer score is lower
    | 'needs_support' // Low scores across dimensions
    | 'partial_data'; // Missing one or more dimensions
  statusBadge: {
    title: string;
    description: string;
    badgeClass: string;
    color: string;
    icon: string;
  };
}

/**
 * Belirli bir sınıf ve kazanım için 3'lü Korelasyon (Öz Değerlendirme vs Akran Değerlendirme vs Oyun Başarısı) matrisini hesaplar.
 */
export function getTriangulatedCorrelationData(
  classSection: string = '5-A',
  outcomeCode: string = 'MAT.5.3.3'
): {
  studentsData: StudentTriangulatedData[];
  classStats: {
    totalStudents: number;
    selfAverage: number;
    peerAverage: number;
    activityAverage: number;
    overallAgreementRate: number; // percentage of students with high agreement
    highAgreementCount: number;
    overconfidentCount: number;
    modestCount: number;
    needsSupportCount: number;
  };
} {
  const allSubmissions: RubricSubmissionRecord[] = getStoredSubmissions();
  const allPeerEvaluations: PeerEvaluationRecord[] = getStoredPeerEvaluations();
  const allActivities: StudentActivityScore[] = getStoredStudentActivities();
  const allGroups: StudentGroup[] = getStoredGroups();

  // Get all unique students in this class from submissions, groups, and activities
  const studentMap = new Map<string, { id: string; name: string; number: string; classSection: string }>();

  // From groups
  allGroups
    .filter((g: StudentGroup) => classSection === 'Tümü' || g.classSection === classSection)
    .forEach((g: StudentGroup) => {
      g.members.forEach((m: StudentGroupMember) => {
        if (!studentMap.has(m.id)) {
          studentMap.set(m.id, { id: m.id, name: m.name, number: m.studentNumber, classSection: g.classSection });
        }
      });
    });

  // From submissions
  allSubmissions
    .filter((s: RubricSubmissionRecord) => (classSection === 'Tümü' || s.classSection === classSection) && s.outcomeCode === outcomeCode)
    .forEach((s: RubricSubmissionRecord) => {
      if (!studentMap.has(s.studentId)) {
        studentMap.set(s.studentId, { id: s.studentId, name: s.studentName, number: s.studentNumber, classSection: s.classSection });
      }
    });

  // From activities
  allActivities
    .filter((a: StudentActivityScore) => (classSection === 'Tümü' || a.classSection === classSection) && a.outcomeCode === outcomeCode)
    .forEach((a: StudentActivityScore) => {
      if (!studentMap.has(a.studentId)) {
        studentMap.set(a.studentId, { id: a.studentId, name: a.studentName, number: a.studentNumber, classSection: a.classSection });
      }
    });

  const studentsList = Array.from(studentMap.values());
  const studentsData: StudentTriangulatedData[] = [];

  studentsList.forEach((stu) => {
    // 1. Self Submission
    const selfSub = allSubmissions.find(
      (s: RubricSubmissionRecord) => s.studentId === stu.id && s.outcomeCode === outcomeCode
    ) || null;
    const selfScore = selfSub ? selfSub.percentage : null;

    // 2. Peer Submissions for this student
    const peerSubs = allPeerEvaluations.filter(
      (p: PeerEvaluationRecord) => p.targetStudentId === stu.id && p.outcomeCode === outcomeCode
    );
    const peerReviewerCount = peerSubs.length;
    const peerAverageScore =
      peerReviewerCount > 0
        ? Math.round(peerSubs.reduce((acc: number, curr: PeerEvaluationRecord) => acc + curr.percentage, 0) / peerReviewerCount)
        : null;

    // 3. Activity / Game Performance
    const acts = allActivities.filter(
      (a: StudentActivityScore) => (a.studentId === stu.id || a.studentNumber === stu.number) && a.outcomeCode === outcomeCode
    );
    const activityCount = acts.length;
    const activityScore =
      activityCount > 0
        ? Math.round(acts.reduce((acc: number, curr: StudentActivityScore) => acc + curr.percentage, 0) / activityCount)
        : null;

    // 4. Differences and Correlation
    let selfPeerDiff: number | null = null;
    let selfGameDiff: number | null = null;
    let peerGameDiff: number | null = null;

    if (selfScore !== null && peerAverageScore !== null) {
      selfPeerDiff = selfScore - peerAverageScore;
    }
    if (selfScore !== null && activityScore !== null) {
      selfGameDiff = selfScore - activityScore;
    }
    if (peerAverageScore !== null && activityScore !== null) {
      peerGameDiff = peerAverageScore - activityScore;
    }

    // Calculate Overall Alignment / Correlation Index (0 - 100)
    let overallCorrelationIndex = 80;
    let correlationStatus: StudentTriangulatedData['correlationStatus'] = 'partial_data';

    if (selfScore !== null && peerAverageScore !== null && activityScore !== null) {
      const maxDiff = Math.max(
        Math.abs(selfPeerDiff || 0),
        Math.abs(selfGameDiff || 0),
        Math.abs(peerGameDiff || 0)
      );
      overallCorrelationIndex = Math.max(0, 100 - Math.round(maxDiff * 1.2));

      if (maxDiff <= 15) {
        correlationStatus = 'high_agreement';
      } else if (selfScore < (activityScore + peerAverageScore) / 2 - 12) {
        correlationStatus = 'modest_underconfident';
      } else if (selfScore > (activityScore + peerAverageScore) / 2 + 15) {
        correlationStatus = 'overconfident';
      } else if (selfScore < 60 && activityScore < 60) {
        correlationStatus = 'needs_support';
      } else {
        correlationStatus = 'high_agreement';
      }
    } else if (selfScore !== null && peerAverageScore !== null) {
      const diff = Math.abs(selfPeerDiff || 0);
      overallCorrelationIndex = Math.max(0, 100 - diff);
      correlationStatus = diff <= 15 ? 'high_agreement' : selfPeerDiff! > 0 ? 'overconfident' : 'modest_underconfident';
    } else {
      correlationStatus = 'partial_data';
      overallCorrelationIndex = 70;
    }

    // Status Badge Info
    let statusBadge = {
      title: 'Veri Bekleniyor',
      description: 'Tüm değerlendirme boyutları henüz tamamlanmamış.',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      color: 'slate',
      icon: '⏳'
    };

    if (correlationStatus === 'high_agreement') {
      statusBadge = {
        title: 'Yüksek Tutarlılık',
        description: 'Öz, akran ve oyun performansı birbiriyle yüksek uyum ve tutarlılık gösteriyor.',
        badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        color: 'emerald',
        icon: '🎯'
      };
    } else if (correlationStatus === 'modest_underconfident') {
      statusBadge = {
        title: 'Mütevazı / Çekingen',
        description: 'Oyun ve akran puanları yüksek ancak öğrenci kendi öz değerlendirmesinde çekingen davranmış.',
        badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
        color: 'blue',
        icon: '💡'
      };
    } else if (correlationStatus === 'overconfident') {
      statusBadge = {
        title: 'Aşırı Özgüvenli',
        description: 'Öğrencinin kendine verdiği puan, oyun ve akran değerlendirmesi ortalamasından belirgin derecede yüksek.',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
        color: 'amber',
        icon: '⚠️'
      };
    } else if (correlationStatus === 'needs_support') {
      statusBadge = {
        title: 'Gelişim Desteği',
        description: 'Tüm boyutlarda kazanım pekiştirme ve ek çalışma önerilir.',
        badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
        color: 'rose',
        icon: '🚨'
      };
    }

    studentsData.push({
      studentId: stu.id,
      studentName: stu.name,
      studentNumber: stu.number,
      classSection: stu.classSection,
      outcomeCode,
      outcomeTitle: selfSub?.outcomeTitle || 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
      selfScore,
      selfSubmission: selfSub,
      peerAverageScore,
      peerReviewerCount,
      peerSubmissions: peerSubs,
      activityScore,
      activityCount,
      activityList: acts,
      selfPeerDiff,
      selfGameDiff,
      peerGameDiff,
      overallCorrelationIndex,
      correlationStatus,
      statusBadge
    });
  });

  // Calculate Class Averages & Agreement Rates
  const validSelf = studentsData.filter((s) => s.selfScore !== null);
  const validPeer = studentsData.filter((s) => s.peerAverageScore !== null);
  const validAct = studentsData.filter((s) => s.activityScore !== null);

  const selfAverage = validSelf.length > 0
    ? Math.round(validSelf.reduce((acc, curr) => acc + (curr.selfScore || 0), 0) / validSelf.length)
    : 0;

  const peerAverage = validPeer.length > 0
    ? Math.round(validPeer.reduce((acc, curr) => acc + (curr.peerAverageScore || 0), 0) / validPeer.length)
    : 0;

  const activityAverage = validAct.length > 0
    ? Math.round(validAct.reduce((acc, curr) => acc + (curr.activityScore || 0), 0) / validAct.length)
    : 0;

  const highAgreementCount = studentsData.filter((s) => s.correlationStatus === 'high_agreement').length;
  const overconfidentCount = studentsData.filter((s) => s.correlationStatus === 'overconfident').length;
  const modestCount = studentsData.filter((s) => s.correlationStatus === 'modest_underconfident').length;
  const needsSupportCount = studentsData.filter((s) => s.correlationStatus === 'needs_support').length;

  const overallAgreementRate = studentsData.length > 0
    ? Math.round((highAgreementCount / studentsData.length) * 100)
    : 0;

  return {
    studentsData,
    classStats: {
      totalStudents: studentsData.length,
      selfAverage,
      peerAverage,
      activityAverage,
      overallAgreementRate,
      highAgreementCount,
      overconfidentCount,
      modestCount,
      needsSupportCount
    }
  };
}
