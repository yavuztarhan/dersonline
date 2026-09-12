'use client';

export interface RubricSubmissionRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  gradeLevel: number;
  classSection: string; // '5-A', '5-B', '5-C', '5-D'
  school?: string;
  teacherId?: string;
  outcomeId: string;
  outcomeCode: string; // 'MAT.5.3.3', 'MAT.5.3.1'
  outcomeTitle: string;
  ratings: Record<string, number>; // { c1: 4, c2: 3, c3: 4, c4: 3, c5: 4 }
  totalScore: number;
  maxScore: number;
  percentage: number;
  performanceLevel: 'Mükemmel' | 'Başarılı' | 'Orta' | 'Geliştirilmeli';
  studentNote?: string;
  teacherFeedback?: string;
  submittedAt: string;
}

const STORAGE_KEY = 'maarif_rubric_submissions_v1';

// Initial pre-populated Maarif data across classes (5-A, 5-B, 5-C) and outcomes
const INITIAL_SUBMISSIONS: RubricSubmissionRecord[] = [];

export function getStoredSubmissions(): RubricSubmissionRecord[] {
  if (typeof window === 'undefined') return INITIAL_SUBMISSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SUBMISSIONS;
  }
}

export function saveRubricSubmission(
  data: Omit<RubricSubmissionRecord, 'id' | 'submittedAt'>
): RubricSubmissionRecord {
  const current = getStoredSubmissions();
  const newRecord: RubricSubmissionRecord = {
    ...data,
    id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    submittedAt: new Date().toISOString()
  };

  // Replace existing submission from same student for same outcome or append
  const filtered = current.filter(
    (s) => !(s.studentId === data.studentId && s.outcomeCode === data.outcomeCode)
  );

  const updated = [newRecord, ...filtered];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Asynchronously persist to database API
    fetch('/api/rubric-submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch((err) => console.warn('[rubric-store] Background API sync note:', err));
  }
  return newRecord;
}

export function updateTeacherFeedbackInStore(submissionId: string, feedback: string): void {
  const current = getStoredSubmissions();
  const updated = current.map((s) => (s.id === submissionId ? { ...s, teacherFeedback: feedback } : s));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Asynchronously update feedback on database API
    fetch('/api/rubric-submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId, teacherFeedback: feedback })
    }).catch((err) => console.warn('[rubric-store] Background feedback API sync note:', err));
  }
}

/**
 * Synchronizes rubric submissions from PostgreSQL database API into localStorage.
 */
export async function syncRubricSubmissionsFromApi(classSection?: string): Promise<RubricSubmissionRecord[]> {
  if (typeof window === 'undefined') return INITIAL_SUBMISSIONS;

  try {
    const url = classSection && classSection !== 'Tümü'
      ? `/api/rubric-submissions?classSection=${encodeURIComponent(classSection)}`
      : '/api/rubric-submissions';
    const res = await fetch(url);
    const data = await res.json();
    if (data?.success && Array.isArray(data.submissions) && data.submissions.length > 0) {
      const local = getStoredSubmissions();
      const mergedMap = new Map<string, RubricSubmissionRecord>();
      local.forEach((item) => mergedMap.set(item.id, item));
      data.submissions.forEach((dbItem: any) => {
        mergedMap.set(dbItem.id, {
          id: dbItem.id,
          studentId: dbItem.studentId || '',
          studentName: dbItem.studentName || 'Öğrenci',
          studentNumber: dbItem.studentNumber || '',
          gradeLevel: dbItem.gradeLevel || 5,
          classSection: dbItem.classSection || '5-A',
          school: dbItem.school || undefined,
          teacherId: dbItem.teacherId || undefined,
          outcomeId: dbItem.outcomeId || '',
          outcomeCode: dbItem.outcomeCode || '',
          outcomeTitle: dbItem.outcomeTitle || '',
          ratings: (typeof dbItem.ratings === 'object' && dbItem.ratings) ? dbItem.ratings : {},
          totalScore: dbItem.totalScore || 0,
          maxScore: dbItem.maxScore || 20,
          percentage: dbItem.percentage || 0,
          performanceLevel: dbItem.performanceLevel || 'Başarılı',
          studentNote: dbItem.studentNote || undefined,
          teacherFeedback: dbItem.teacherFeedback || undefined,
          submittedAt: typeof dbItem.submittedAt === 'string' ? dbItem.submittedAt : new Date(dbItem.submittedAt).toISOString()
        });
      });
      const merged = Array.from(mergedMap.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('[rubric-store] syncRubricSubmissionsFromApi note:', err);
  }
  return getStoredSubmissions();
}

// Analytics Helpers
export function calculateClassAnalytics(classSection: string, customSubmissions?: RubricSubmissionRecord[]) {
  const all = customSubmissions !== undefined ? customSubmissions : getStoredSubmissions();
  const classSubs = all.filter((s) => s.classSection === classSection || classSection === 'Tümü');

  // Group by Outcome
  const outcomesMap: Record<string, RubricSubmissionRecord[]> = {};
  classSubs.forEach((sub) => {
    if (!outcomesMap[sub.outcomeCode]) {
      outcomesMap[sub.outcomeCode] = [];
    }
    outcomesMap[sub.outcomeCode].push(sub);
  });

  const outcomeStats = Object.entries(outcomesMap).map(([code, list]) => {
    const avgScore = Math.round(list.reduce((acc, cur) => acc + cur.totalScore, 0) / list.length);
    const avgPercent = Math.round(list.reduce((acc, cur) => acc + cur.percentage, 0) / list.length);
    const excellentCount = list.filter((s) => s.performanceLevel === 'Mükemmel').length;
    const goodCount = list.filter((s) => s.performanceLevel === 'Başarılı').length;
    const mediumCount = list.filter((s) => s.performanceLevel === 'Orta').length;
    const needSupportCount = list.filter((s) => s.performanceLevel === 'Geliştirilmeli').length;

    // Criteria Averages (c1..c5)
    const criteriaAvgs: Record<string, number> = {};
    ['c1', 'c2', 'c3', 'c4', 'c5'].forEach((cId) => {
      const sum = list.reduce((acc, cur) => acc + (cur.ratings[cId] || 0), 0);
      criteriaAvgs[cId] = parseFloat((sum / list.length).toFixed(1));
    });

    return {
      outcomeCode: code,
      outcomeTitle: list[0]?.outcomeTitle || code,
      studentCount: list.length,
      avgScore,
      avgPercent,
      excellentCount,
      goodCount,
      mediumCount,
      needSupportCount,
      criteriaAvgs,
      submissions: list
    };
  });

  const totalClassSubs = classSubs.length;
  const overallAvgPercent = totalClassSubs > 0
    ? Math.round(classSubs.reduce((acc, cur) => acc + cur.percentage, 0) / totalClassSubs)
    : 0;

  return {
    classSection,
    totalSubmissions: totalClassSubs,
    overallAvgPercent,
    outcomeStats,
    allClassSubmissions: classSubs
  };
}

export function calculateOutcomeCrossClassAnalytics(outcomeCode: string, customSubmissions?: RubricSubmissionRecord[]) {
  const all = customSubmissions !== undefined ? customSubmissions : getStoredSubmissions();
  const outcomeSubs = all.filter((s) => s.outcomeCode === outcomeCode);

  // Group by Class Section (e.g. 5-A, 5-B, 5-C, 5-D)
  const classMap: Record<string, RubricSubmissionRecord[]> = {};
  outcomeSubs.forEach((sub) => {
    if (!classMap[sub.classSection]) {
      classMap[sub.classSection] = [];
    }
    classMap[sub.classSection].push(sub);
  });

  const classStats = Object.entries(classMap).map(([section, list]) => {
    const avgScore = Math.round(list.reduce((acc, cur) => acc + cur.totalScore, 0) / list.length);
    const avgPercent = Math.round(list.reduce((acc, cur) => acc + cur.percentage, 0) / list.length);
    const excellentCount = list.filter((s) => s.performanceLevel === 'Mükemmel').length;
    const goodCount = list.filter((s) => s.performanceLevel === 'Başarılı').length;
    const mediumCount = list.filter((s) => s.performanceLevel === 'Orta').length;
    const needSupportCount = list.filter((s) => s.performanceLevel === 'Geliştirilmeli').length;

    // Criteria Averages (c1..c5)
    const criteriaAvgs: Record<string, number> = {};
    ['c1', 'c2', 'c3', 'c4', 'c5'].forEach((cId) => {
      const sum = list.reduce((acc, cur) => acc + (cur.ratings[cId] || 0), 0);
      criteriaAvgs[cId] = parseFloat((sum / list.length).toFixed(1));
    });

    return {
      classSection: section,
      studentCount: list.length,
      avgScore,
      avgPercent,
      excellentCount,
      goodCount,
      mediumCount,
      needSupportCount,
      criteriaAvgs,
      submissions: list
    };
  });

  const totalSubs = outcomeSubs.length;
  const overallAvgPercent = totalSubs > 0
    ? Math.round(outcomeSubs.reduce((acc, cur) => acc + cur.percentage, 0) / totalSubs)
    : 0;

  return {
    outcomeCode,
    outcomeTitle: outcomeSubs[0]?.outcomeTitle || outcomeCode,
    totalSubmissions: totalSubs,
    overallAvgPercent,
    classStats,
    allOutcomeSubmissions: outcomeSubs
  };
}
