'use client';

import { RubricSubmissionRecord, getStoredSubmissions } from '@/lib/rubric-store';
import { LearningJournalEntry, getStoredJournalEntries } from '@/lib/journal-store';

export interface StudentActivityScore {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  classSection: string;
  outcomeCode: string; // e.g. 'MAT.5.3.1', 'MAT.5.3.2', 'MAT.5.3.3', 'MAT.5.3.4', 'MAT.5.1.1'
  outcomeTitle: string;
  gameType: string; // 'memory-cards' | 'angle-radar' | 'true-false' | 'word-search' | 'junction-architect' | 'construction-bench' | 'mini-test'
  gameTitle: string;
  score: number; // e.g. 85
  maxScore: number; // e.g. 100
  percentage: number; // e.g. 85
  xpEarned: number;
  completedAt: string;
}

export interface OutcomePerformanceItem {
  outcomeCode: string;
  outcomeTitle: string;
  category: string;
  description: string;

  // Activity / Game Performance
  hasActivityData: boolean;
  activitySuccessRate: number | null; // e.g. 92 (%)
  activityXp: number;
  completedGames: string[]; // e.g. ['Hafıza Kartı', 'Doğru-Yanlış', 'Mini Test']
  activitiesCount: number;
  activitiesList: StudentActivityScore[];

  // Rubric Performance
  hasRubricData: boolean;
  rubricScore: number | null; // e.g. 95 (%)
  rubricLevel: 'Mükemmel' | 'Başarılı' | 'Orta' | 'Geliştirilmeli' | null;
  rubricSubmission: RubricSubmissionRecord | null;

  // Learning Journal Reflection
  hasJournalData: boolean;
  journalEntry: LearningJournalEntry | null;

  // Comparative Insight
  comparisonStatus: 'both_present' | 'only_activity' | 'only_rubric' | 'no_data';
  alignmentDelta: number | null; // difference between activity and rubric percentage
  alignmentScore: number | null; // 0 - 100 match rating
  alignmentInsight: {
    type: 'perfect' | 'aligned' | 'overconfident' | 'underconfident' | 'incomplete';
    title: string;
    description: string;
    color: string;
    badgeClass: string;
  };
}

export interface StudentPerformanceProfile {
  studentId: string;
  studentName: string;
  studentNumber: string;
  classSection: string;
  avatar: string;
  totalPoints: number;
  rank: number;
  totalBadges: number;
  overallSuccessRate: number; // average activity score across active outcomes
  overallRubricRate: number; // average rubric score across active submissions
  completedOutcomesCount: number;
  totalOutcomesCount: number;
  totalJournalsCount: number;
  allActivities: StudentActivityScore[];
  outcomes: OutcomePerformanceItem[];
}

const STORAGE_ACTIVITY_KEY = 'maarif_student_activity_scores_v1';


// Seed Activity Performance for standard curriculum outcomes
const SEED_STUDENT_ACTIVITIES: StudentActivityScore[] = [];

export const CURRICULUM_OUTCOMES_LIST = [
  {
    code: 'MAT.5.3.1',
    title: 'Doğru, Doğru Parçası ve Işın ile İlgili Temel Geometrik Çizimler',
    category: 'Geometrik Çizim & Kavramlar',
    description: 'Doğru, doğru parçası ve ışını tanır, sembolle gösterir; düzlemde farklı konumlarını dinamik olarak modeller.'
  },
  {
    code: 'MAT.5.3.2',
    title: 'Bir Noktanın Diğer Noktaya Göre Konumu ve Eş Doğru Parçası İnşası',
    category: 'Konum & Geometrik İnşa',
    description: 'Noktanın noktaya göre konumunu yön ve birimlerle açıklar; pergel ve cetvelle eşit uzunlukta doğru parçaları inşa eder.'
  },
  {
    code: 'MAT.5.3.3',
    title: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    category: 'Açı Ölçümü & Teknoloji',
    description: 'Açıları standart araçlarla (iletki/gönye/dinamik yazılım) ölçer; dar, dik, geniş ve doğru açıları hassas biçimde belirler.'
  },
  {
    code: 'MAT.5.3.4',
    title: 'Düzlemde İki ve Üç Doğrunun Durumları ve Açı Çıkarımları',
    category: 'Doğruların Durumları & Açı İlişkileri',
    description: 'Paralel, dik, kesişen ve kesen doğruların oluşturduğu açıları keşfeder; ters ve komşu bütünler açı eşitliğini kanıtlar.'
  },
  {
    code: 'MAT.5.1.1',
    title: 'Doğal Sayılarla İşlemler ve Çarpım Tablosu',
    category: 'Sayılar & İşlemler',
    description: 'Doğal sayılarla çarpma ve dört işlem stratejilerini etkili kullanır, hızlı zihinden hesaplama yapar.'
  }
];

export function getStoredStudentActivities(): StudentActivityScore[] {
  if (typeof window === 'undefined') return SEED_STUDENT_ACTIVITIES;
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVITY_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_ACTIVITY_KEY, JSON.stringify(SEED_STUDENT_ACTIVITIES));
      return SEED_STUDENT_ACTIVITIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_STUDENT_ACTIVITIES;
  } catch (err) {
    console.warn('Student activities read error, using fallback:', err);
    return SEED_STUDENT_ACTIVITIES;
  }
}

export function recordStudentGameScore(
  activity: Omit<StudentActivityScore, 'id' | 'completedAt' | 'percentage'>
): StudentActivityScore {
  const current = getStoredStudentActivities();
  const maxScore = activity.maxScore > 0 ? activity.maxScore : 100;
  const percentage = Math.min(100, Math.max(0, Math.round((activity.score / maxScore) * 100)));

  const newRecord: StudentActivityScore = {
    ...activity,
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    percentage,
    completedAt: new Date().toISOString()
  };

  const updated = [newRecord, ...current];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_ACTIVITY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }
  return newRecord;
}

/**
 * Defensive null-safe aggregator that builds the complete outcome report
 * comparing game/activity performance with rubric self-assessment.
 */
export function getStudentPerformanceProfile(
  studentInput: any,
  allStudentsList?: any[]
): StudentPerformanceProfile {
  // Safe Fallback Defaults
  const student = studentInput ?? {};
  const studentId = String(student.id ?? 'unknown');
  const studentName = String(student.name ?? 'Öğrenci');
  const studentNumber = String(student.studentNumber ?? '-');
  const classSection = String(student.classSection ?? '5-A');
  const avatar = String(student.avatar ?? '🎓');
  const totalPoints = typeof student.points === 'number' && Number.isFinite(student.points) ? student.points : 0;
  const totalBadges = Array.isArray(student.unlockedBadges) ? student.unlockedBadges.length : 0;

  // Calculate rank safely
  let rank = 1;
  if (Array.isArray(allStudentsList) && allStudentsList.length > 0) {
    const sorted = [...allStudentsList].sort((a, b) => (b?.points ?? 0) - (a?.points ?? 0));
    const idx = sorted.findIndex((s) => s?.id === studentId || s?.studentNumber === studentNumber);
    rank = idx >= 0 ? idx + 1 : 1;
  }

  // Load all submissions and activities safely
  let allSubmissions: RubricSubmissionRecord[] = [];
  try {
    allSubmissions = getStoredSubmissions() ?? [];
  } catch {
    allSubmissions = [];
  }

  let allActivities: StudentActivityScore[] = [];
  try {
    allActivities = getStoredStudentActivities() ?? [];
  } catch {
    allActivities = [];
  }

  // Filter for this student safely (match by ID or studentNumber or exact Name)
  const studentSubs = allSubmissions.filter(
    (s) =>
      s &&
      (s.studentId === studentId ||
        s.studentNumber === studentNumber ||
        (s.studentName && s.studentName.trim().toLowerCase() === studentName.trim().toLowerCase()))
  );

  const studentActs = allActivities.filter(
    (a) =>
      a &&
      (a.studentId === studentId ||
        a.studentNumber === studentNumber ||
        (a.studentName && a.studentName.trim().toLowerCase() === studentName.trim().toLowerCase()))
  );

  let allJournals: LearningJournalEntry[] = [];
  try {
    allJournals = getStoredJournalEntries() ?? [];
  } catch {
    allJournals = [];
  }

  const studentJournals = allJournals.filter(
    (j) =>
      j &&
      (j.studentId === studentId ||
        j.studentNumber === studentNumber ||
        (j.studentName && j.studentName.trim().toLowerCase() === studentName.trim().toLowerCase()))
  );

  // Map each outcome in the curriculum
  const outcomeItems: OutcomePerformanceItem[] = CURRICULUM_OUTCOMES_LIST.map((curricOutcome) => {
    const matchingActs = studentActs.filter((a) => a.outcomeCode === curricOutcome.code);
    const matchingSub = studentSubs.find((s) => s.outcomeCode === curricOutcome.code) || null;
    const matchingJournal = studentJournals.find((j) => j.outcomeCode === curricOutcome.code) || null;

    // Activity Metrics
    const hasActivityData = matchingActs.length > 0;
    let activitySuccessRate: number | null = null;
    let activityXp = 0;
    const completedGames: string[] = [];

    if (hasActivityData) {
      const sumPercentage = matchingActs.reduce((acc, cur) => acc + (cur.percentage ?? 0), 0);
      activitySuccessRate = Math.round(sumPercentage / matchingActs.length);
      activityXp = matchingActs.reduce((acc, cur) => acc + (cur.xpEarned ?? 0), 0);
      matchingActs.forEach((act) => {
        if (act.gameTitle && !completedGames.includes(act.gameTitle)) {
          completedGames.push(act.gameTitle);
        }
      });
    }

    // Rubric Metrics
    const hasRubricData = !!matchingSub;
    const rubricScore = matchingSub?.percentage ?? null;
    const rubricLevel = matchingSub?.performanceLevel ?? null;

    // Journal Metrics
    const hasJournalData = !!matchingJournal;

    // Comparison Status
    let comparisonStatus: 'both_present' | 'only_activity' | 'only_rubric' | 'no_data' = 'no_data';
    if (hasActivityData && hasRubricData) {
      comparisonStatus = 'both_present';
    } else if (hasActivityData) {
      comparisonStatus = 'only_activity';
    } else if (hasRubricData) {
      comparisonStatus = 'only_rubric';
    } else {
      comparisonStatus = 'no_data';
    }

    // Alignment and Insight calculation
    let alignmentDelta: number | null = null;
    let alignmentScore: number | null = null;
    let alignmentInsight: OutcomePerformanceItem['alignmentInsight'] = {
      type: 'incomplete',
      title: 'Veri Bekleniyor',
      description: 'Bu kazanım için henüz yeterli etkinlik veya rubrik değerlendirmesi kaydedilmemiştir.',
      color: 'slate',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
    };

    if (comparisonStatus === 'both_present' && activitySuccessRate !== null && rubricScore !== null) {
      alignmentDelta = rubricScore - activitySuccessRate;
      const absDelta = Math.abs(alignmentDelta);
      alignmentScore = Math.max(0, 100 - absDelta);

      if (absDelta <= 10) {
        alignmentInsight = {
          type: 'perfect',
          title: 'Tam Uyum & Yüksek Farkındalık',
          description: `Öğrencinin öz değerlendirme algısı (%${rubricScore}) ile nesnel etkinlik başarısı (%${activitySuccessRate}) birebir örtüşüyor.`,
          color: 'emerald',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300'
        };
      } else if (absDelta <= 20) {
        alignmentInsight = {
          type: 'aligned',
          title: 'Dengeli & Tutarlı Algı',
          description: `Öz değerlendirme puanı (%${rubricScore}) ve uygulama performansı (%${activitySuccessRate}) genel olarak tutarlıdır.`,
          color: 'teal',
          badgeClass: 'bg-teal-50 text-teal-800 border-teal-300'
        };
      } else if (alignmentDelta > 20) {
        alignmentInsight = {
          type: 'overconfident',
          title: 'Öz Değerlendirme Yüksek (Pekiştirme Önerilir)',
          description: `Öğrenci kendini (%${rubricScore}) seviyesinde görürken test/etkinlik başarısı (%${activitySuccessRate}) seviyesindedir. Ek soru ve simülasyonla desteklenmelidir.`,
          color: 'amber',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-300'
        };
      } else {
        alignmentInsight = {
          type: 'underconfident',
          title: 'Mütevazı Başarı (Özgüven Desteklenmeli)',
          description: `Öğrencinin oyun/test başarısı (%${activitySuccessRate}) yüksek olmasına rağmen öz değerlendirmede (%${rubricScore}) kendini mütevazı puanlamıştır. Cesaretlendirilmelidir.`,
          color: 'blue',
          badgeClass: 'bg-blue-50 text-blue-800 border-blue-300'
        };
      }
    } else if (comparisonStatus === 'only_activity') {
      alignmentInsight = {
        type: 'incomplete',
        title: 'Öz Değerlendirme Rubriği Bekleniyor',
        description: `Öğrenci oyunları tamamlamış (%${activitySuccessRate} başarı), ancak öz değerlendirme formunu henüz doldurmamıştır.`,
        color: 'indigo',
        badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200'
      };
    } else if (comparisonStatus === 'only_rubric') {
      alignmentInsight = {
        type: 'incomplete',
        title: 'Oyun/Test Kaydı Bekleniyor',
        description: `Öğrenci rubriği doldurmuş (%${rubricScore}), ancak bu kazanımdaki oyun ve test etkinlikleri henüz sisteme yansımamıştır.`,
        color: 'purple',
        badgeClass: 'bg-purple-50 text-purple-800 border-purple-200'
      };
    }

    return {
      outcomeCode: curricOutcome.code,
      outcomeTitle: curricOutcome.title,
      category: curricOutcome.category,
      description: curricOutcome.description,
      hasActivityData,
      activitySuccessRate,
      activityXp,
      completedGames,
      activitiesCount: matchingActs.length,
      activitiesList: matchingActs,
      hasRubricData,
      rubricScore,
      rubricLevel,
      rubricSubmission: matchingSub,
      hasJournalData,
      journalEntry: matchingJournal,
      comparisonStatus,
      alignmentDelta,
      alignmentScore,
      alignmentInsight
    };
  });

  // Calculate Overall Rates safely
  const activeActivities = outcomeItems.filter((o) => o.activitySuccessRate !== null);
  const overallSuccessRate =
    activeActivities.length > 0
      ? Math.round(activeActivities.reduce((acc, cur) => acc + (cur.activitySuccessRate ?? 0), 0) / activeActivities.length)
      : 0;

  const activeRubrics = outcomeItems.filter((o) => o.rubricScore !== null);
  const overallRubricRate =
    activeRubrics.length > 0
      ? Math.round(activeRubrics.reduce((acc, cur) => acc + (cur.rubricScore ?? 0), 0) / activeRubrics.length)
      : 0;

  const completedOutcomesCount = outcomeItems.filter((o) => o.hasActivityData || o.hasRubricData).length;
  const totalJournalsCount = studentJournals.length;

  return {
    studentId,
    studentName,
    studentNumber,
    classSection,
    avatar,
    totalPoints,
    rank,
    totalBadges,
    overallSuccessRate,
    overallRubricRate,
    completedOutcomesCount,
    totalOutcomesCount: CURRICULUM_OUTCOMES_LIST.length,
    totalJournalsCount,
    allActivities: studentActs,
    outcomes: outcomeItems
  };
}

