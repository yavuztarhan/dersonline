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
const INITIAL_SUBMISSIONS: RubricSubmissionRecord[] = [
  // 5-A Şubesi - MAT.5.3.3 (Açıları Ölçme)
  {
    id: 'sub-5a-01',
    studentId: 'stu-101',
    studentName: 'Ahmet Yılmaz',
    studentNumber: '101',
    gradeLevel: 5,
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.5.3.3',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
    totalScore: 20,
    maxScore: 20,
    percentage: 100,
    performanceLevel: 'Mükemmel',
    studentNote: 'İletkiyi 360 derece döndürerek eğik duran açıları tam sıfırlayıp ölçmeyi çok iyi kavradım.',
    teacherFeedback: 'Harika bir performans Ahmet! Radar simülasyonundaki hassas açı ölçümlerin mükemmeldi.',
    submittedAt: '2026-09-08T10:15:00Z'
  },
  {
    id: 'sub-5a-02',
    studentId: 'stu-102',
    studentName: 'Zeynep Kaya',
    studentNumber: '102',
    gradeLevel: 5,
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.5.3.3',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 4, c2: 3, c3: 4, c4: 4, c5: 3 },
    totalScore: 18,
    maxScore: 20,
    percentage: 90,
    performanceLevel: 'Mükemmel',
    studentNote: 'Işın kollarının uzunluğunun açının ölçüsünü değiştirmediğini kanıtladım.',
    submittedAt: '2026-09-08T10:20:00Z'
  },
  {
    id: 'sub-5a-03',
    studentId: 'stu-103',
    studentName: 'Mustafa Demir',
    studentNumber: '103',
    gradeLevel: 5,
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.5.3.3',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 3, c2: 3, c3: 3, c4: 3, c5: 3 },
    totalScore: 15,
    maxScore: 20,
    percentage: 75,
    performanceLevel: 'Başarılı',
    studentNote: 'İletkinin iç ve dış cetvelini okurken biraz daha dikkat etmem gerekiyor.',
    submittedAt: '2026-09-08T10:25:00Z'
  },
  {
    id: 'sub-5a-04',
    studentId: 'stu-104',
    studentName: 'Elif Çelik',
    studentNumber: '104',
    gradeLevel: 5,
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.5.3.3',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 3, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: 'Radar oyununda 3x kombo yaptım ve tüm hedefleri tam 1 derece toleransla vurdum.',
    submittedAt: '2026-09-08T10:30:00Z'
  },
  {
    id: 'sub-5a-05',
    studentId: 'stu-105',
    studentName: 'Caner Arslan',
    studentNumber: '105',
    gradeLevel: 5,
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.5.3.3',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 2, c2: 2, c3: 2, c4: 3, c5: 2 },
    totalScore: 11,
    maxScore: 20,
    percentage: 55,
    performanceLevel: 'Orta',
    studentNote: 'Geniş açıları ölçerken iletkiyi köşeye oturtmakta biraz zorlandım.',
    teacherFeedback: 'Caner, laboratuvardaki mıknatıs butonunu ve tabana hizalama özelliğini tekrar incelemeni öneririm.',
    submittedAt: '2026-09-08T10:35:00Z'
  },

  // 5-B Şubesi - MAT.5.3.3 (Açıları Ölçme)
  {
    id: 'sub-5b-01',
    studentId: 'stu-201',
    studentName: 'Mehmet Şahin',
    studentNumber: '201',
    gradeLevel: 5,
    classSection: '5-B',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.5.3.3',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 3, c2: 3, c3: 3, c4: 3, c5: 3 },
    totalScore: 15,
    maxScore: 20,
    percentage: 75,
    performanceLevel: 'Başarılı',
    studentNote: 'Açıların isimlendirilmesinde köşe harfinin daima ortada olduğunu öğrendim.',
    submittedAt: '2026-09-08T11:00:00Z'
  },
  {
    id: 'sub-5b-02',
    studentId: 'stu-202',
    studentName: 'Ayşe Yıldız',
    studentNumber: '202',
    gradeLevel: 5,
    classSection: '5-B',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.5.3.3',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 4, c2: 3, c3: 4, c4: 4, c5: 3 },
    totalScore: 18,
    maxScore: 20,
    percentage: 90,
    performanceLevel: 'Mükemmel',
    studentNote: 'Açı radarında takım modunda yarıştık ve 5 hedefi de vurduk.',
    submittedAt: '2026-09-08T11:10:00Z'
  },
  {
    id: 'sub-5b-03',
    studentId: 'stu-203',
    studentName: 'Emir Öztürk',
    studentNumber: '203',
    gradeLevel: 5,
    classSection: '5-B',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.5.3.3',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 2, c2: 2, c3: 2, c4: 2, c5: 2 },
    totalScore: 10,
    maxScore: 20,
    percentage: 50,
    performanceLevel: 'Orta',
    studentNote: 'Dar açı ile geniş açıyı bazen karıştırıyorum.',
    submittedAt: '2026-09-08T11:15:00Z'
  },

  // 5-C Şubesi - MAT.5.3.3 (Açıları Ölçme)
  {
    id: 'sub-5c-01',
    studentId: 'stu-301',
    studentName: 'Beren Koç',
    studentNumber: '301',
    gradeLevel: 5,
    classSection: '5-C',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.5.3.3',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
    totalScore: 20,
    maxScore: 20,
    percentage: 100,
    performanceLevel: 'Mükemmel',
    studentNote: 'Tüm aşamaları eksiksiz tamamladım, açı ölçme konusunda kendime güveniyorum.',
    submittedAt: '2026-09-08T13:00:00Z'
  },
  {
    id: 'sub-5c-02',
    studentId: 'stu-302',
    studentName: 'Burak Polat',
    studentNumber: '302',
    gradeLevel: 5,
    classSection: '5-C',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.5.3.3',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 3, c2: 2, c3: 3, c4: 3, c5: 2 },
    totalScore: 13,
    maxScore: 20,
    percentage: 65,
    performanceLevel: 'Başarılı',
    studentNote: 'İletkiyi döndürme kolundan tutarak çevirmek çok eğlenceliydi.',
    submittedAt: '2026-09-08T13:10:00Z'
  },

  // 5-A Şubesi - MAT.5.3.1 (Temel Geometri: Doğru, Işın, Doğru Parçası)
  {
    id: 'sub-5a-geo-01',
    studentId: 'stu-101',
    studentName: 'Ahmet Yılmaz',
    studentNumber: '101',
    gradeLevel: 5,
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.5.3.1',
    outcomeCode: 'MAT.5.3.1',
    outcomeTitle: 'Doğru, Doğru Parçası ve Işın ile İlgili Temel Geometrik Çizimler ve Sembolik Gösterimler',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
    totalScore: 20,
    maxScore: 20,
    percentage: 100,
    performanceLevel: 'Mükemmel',
    studentNote: 'Doğru parçasının iki ucunun kapalı olması sayesinde boyunun ölçülebildiğini öğrendim.',
    submittedAt: '2026-09-01T09:30:00Z'
  },
  {
    id: 'sub-5a-geo-02',
    studentId: 'stu-102',
    studentName: 'Zeynep Kaya',
    studentNumber: '102',
    gradeLevel: 5,
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.5.3.1',
    outcomeCode: 'MAT.5.3.1',
    outcomeTitle: 'Doğru, Doğru Parçası ve Işın ile İlgili Temel Geometrik Çizimler ve Sembolik Gösterimler',
    ratings: { c1: 4, c2: 4, c3: 3, c4: 4, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: 'Sembolleri [AB], [AB ve AB şeklinde hatasız yazabiliyorum.',
    submittedAt: '2026-09-01T09:40:00Z'
  }
];

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
  }
  return newRecord;
}

export function updateTeacherFeedbackInStore(submissionId: string, feedback: string): void {
  const current = getStoredSubmissions();
  const updated = current.map((s) => (s.id === submissionId ? { ...s, teacherFeedback: feedback } : s));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
}

// Analytics Helpers
export function calculateClassAnalytics(classSection: string) {
  const all = getStoredSubmissions();
  const classSubs = all.filter((s) => s.classSection === classSection);

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

export function calculateOutcomeCrossClassAnalytics(outcomeCode: string) {
  const all = getStoredSubmissions();
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
