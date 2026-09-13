// ===========================================================================
// DEMO SEED DATA - TÜRKİYE YÜZYILI MAARİF MODELİ GÖSTERİM VERİLERİ
// ===========================================================================
import { RubricSubmissionRecord } from '@/lib/rubric-store';
import { PeerEvaluationRecord } from '@/lib/peer-evaluation-store';
import { ClassroomFileRecord } from '@/lib/class-files-store';
import { TeacherUser, StudentUser } from '@/types/auth';

// Demo modunda tam erişime açık olan 5, 6 ve 7. sınıfların ilk kazanımları
export const ALLOWED_DEMO_OUTCOMES = [
  'MAT.5.3.1', // 5. Sınıf: Doğru, Doğru Parçası ve Işın
  'MAT.6.1.1', // 6. Sınıf: Asal Sayılar ve Doğal Sayıların Asal Çarpanları
  'MAT.7.1.1'  // 7. Sınıf: Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi
] as const;

export function isDemoOutcome(code?: string): boolean {
  if (!code) return false;
  return (ALLOWED_DEMO_OUTCOMES as readonly string[]).includes(code);
}

// ---------------------------------------------------------------------------
// 1. DEMO KULLANICILARI (Öğretmen ve Öğrenci)
// ---------------------------------------------------------------------------
export const DEMO_TEACHER_USER: TeacherUser = {
  id: 'demo-teacher-01',
  email: 'demo.ogretmen@maarifakademi.com.tr',
  name: 'Ahmet Yılmaz',
  firstName: 'Ahmet',
  lastName: 'Yılmaz',
  phone: '0555 123 45 67',
  role: 'teacher',
  school: 'Atatürk Ortaokulu',
  city: 'Ankara',
  district: 'Çankaya',
  branch: 'Matematik',
  assignedClasses: ['5-A', '6-B', '7-A'],
  status: 'approved',
  isKvkkAccepted: true,
  kvkkAcceptedAt: '2026-09-01T08:00:00.000Z',
  isProfileComplete: true,
  createdAt: '2026-09-01T08:00:00.000Z'
};

function makeDemoStudent(
  id: string,
  firstName: string,
  lastName: string,
  classSection: string,
  gradeLevel: number,
  studentNumber: string,
  points: number,
  unlockedBadges: string[] = ['badge-first-step', 'badge-explorer']
): StudentUser {
  return {
    id,
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    role: 'student',
    classSection,
    gradeLevel,
    studentNumber,
    school: 'Atatürk Ortaokulu',
    city: 'Ankara',
    district: 'Çankaya',
    teacherId: 'demo-teacher-01',
    points,
    subjectPoints: {
      'Matematik': points
    },
    unlockedBadges,
    isKvkkAccepted: true,
    kvkkAcceptedAt: '2026-09-01T08:00:00.000Z',
    createdAt: '2026-09-01T08:00:00.000Z'
  };
}

export const DEMO_STUDENT_USER: StudentUser = makeDemoStudent(
  'demo-std-7a-104',
  'Zeynep',
  'Kaya',
  '7-A',
  7,
  '104',
  840,
  ['badge-first-step', 'badge-explorer', 'badge-rational-star', 'badge-speed']
);

// ---------------------------------------------------------------------------
// 2. 5-A, 6-B ve 7-A DEMO ÖĞRENCİ LİSTESİ (Toplam 36 Öğrenci)
// ---------------------------------------------------------------------------
export const DEMO_STUDENTS_LIST: StudentUser[] = [
  // --- 7-A Sınıfı (12 Öğrenci) ---
  DEMO_STUDENT_USER,
  makeDemoStudent('demo-std-7a-101', 'Mustafa', 'Demir', '7-A', 7, '101', 760),
  makeDemoStudent('demo-std-7a-102', 'Elif', 'Çelik', '7-A', 7, '102', 920),
  makeDemoStudent('demo-std-7a-103', 'Mehmet', 'Şahin', '7-A', 7, '103', 650),
  makeDemoStudent('demo-std-7a-105', 'Ayşe', 'Yıldız', '7-A', 7, '105', 880),
  makeDemoStudent('demo-std-7a-106', 'Emir', 'Öztürk', '7-A', 7, '106', 710),
  makeDemoStudent('demo-std-7a-107', 'Fatma', 'Aydın', '7-A', 7, '107', 940),
  makeDemoStudent('demo-std-7a-108', 'Caner', 'Arslan', '7-A', 7, '108', 580),
  makeDemoStudent('demo-std-7a-109', 'Beren', 'Koç', '7-A', 7, '109', 830),
  makeDemoStudent('demo-std-7a-110', 'Burak', 'Polat', '7-A', 7, '110', 690),
  makeDemoStudent('demo-std-7a-111', 'Selin', 'Kurt', '7-A', 7, '111', 910),
  makeDemoStudent('demo-std-7a-112', 'Yusuf', 'Aksoy', '7-A', 7, '112', 640),

  // --- 6-B Sınıfı (12 Öğrenci) ---
  makeDemoStudent('demo-std-6b-201', 'Kerem', 'Yalçın', '6-B', 6, '201', 720),
  makeDemoStudent('demo-std-6b-202', 'Defne', 'Erdem', '6-B', 6, '202', 890),
  makeDemoStudent('demo-std-6b-203', 'Mert', 'Güneş', '6-B', 6, '203', 610),
  makeDemoStudent('demo-std-6b-204', 'İrem', 'Çetin', '6-B', 6, '204', 850),
  makeDemoStudent('demo-std-6b-205', 'Oğuz', 'Vural', '6-B', 6, '205', 770),
  makeDemoStudent('demo-std-6b-206', 'Zehra', 'Bozkurt', '6-B', 6, '206', 930),
  makeDemoStudent('demo-std-6b-207', 'Eren', 'Yurt', '6-B', 6, '207', 590),
  makeDemoStudent('demo-std-6b-208', 'Ece', 'Tekin', '6-B', 6, '208', 810),
  makeDemoStudent('demo-std-6b-209', 'Kaan', 'Kaplan', '6-B', 6, '209', 740),
  makeDemoStudent('demo-std-6b-210', 'Melis', 'Doğan', '6-B', 6, '210', 680),
  makeDemoStudent('demo-std-6b-211', 'Baran', 'Özdemir', '6-B', 6, '211', 900),
  makeDemoStudent('demo-std-6b-212', 'Sude', 'Yavuz', '6-B', 6, '212', 630),

  // --- 5-A Sınıfı (12 Öğrenci) ---
  makeDemoStudent('demo-std-5a-301', 'Efe', 'Karaca', '5-A', 5, '301', 750),
  makeDemoStudent('demo-std-5a-302', 'Duru', 'Keskin', '5-A', 5, '302', 880),
  makeDemoStudent('demo-std-5a-303', 'Alperen', 'Çakır', '5-A', 5, '303', 620),
  makeDemoStudent('demo-std-5a-304', 'Ceren', 'Avcı', '5-A', 5, '304', 860),
  makeDemoStudent('demo-std-5a-305', 'Tolga', 'Tunç', '5-A', 5, '305', 790),
  makeDemoStudent('demo-std-5a-306', 'Yağmur', 'Bilgin', '5-A', 5, '306', 950),
  makeDemoStudent('demo-std-5a-307', 'Batuhan', 'Ekinci', '5-A', 5, '307', 570),
  makeDemoStudent('demo-std-5a-308', 'Ada', 'Şimşek', '5-A', 5, '308', 820),
  makeDemoStudent('demo-std-5a-309', 'Rüzgar', 'Aktaş', '5-A', 5, '309', 730),
  makeDemoStudent('demo-std-5a-310', 'Ceyda', 'Uysal', '5-A', 5, '310', 670),
  makeDemoStudent('demo-std-5a-311', 'Ozan', 'Coşkun', '5-A', 5, '311', 910),
  makeDemoStudent('demo-std-5a-312', 'Buse', 'Tan', '5-A', 5, '312', 650)
];

// ---------------------------------------------------------------------------
// 3. ÖNCEDEN DOLDURULMUŞ ÖZ DEĞERLENDİRME (RUBRİK) FORMLARI
// ---------------------------------------------------------------------------
export const DEMO_RUBRIC_SUBMISSIONS: RubricSubmissionRecord[] = [
  {
    id: 'demo-sub-01',
    studentId: 'demo-std-7a-104',
    studentName: 'Zeynep Kaya',
    studentNumber: '104',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.1.1',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 3, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: 'Bileşik kesirleri tam sayılı kesre çevirip sayı doğrusunda kilitlerken zorlanmadım. Cetvel laboratuvarı çok faydalı oldu.',
    teacherFeedback: 'Harika bir kavrayış Zeynep! Negatif rasyonel sayıların sıfırın solundaki yönünü kusursuz ayırt ettin.',
    submittedAt: '2026-09-12T14:30:00.000Z'
  },
  {
    id: 'demo-sub-02',
    studentId: 'demo-std-7a-102',
    studentName: 'Elif Çelik',
    studentNumber: '102',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.1.1',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    ratings: { c1: 4, c2: 3, c3: 4, c4: 4, c5: 3 },
    totalScore: 18,
    maxScore: 20,
    percentage: 90,
    performanceLevel: 'Mükemmel',
    studentNote: 'Sayı doğrusunda aralıkları eşit parçaya bölme mantığını kavradım.',
    teacherFeedback: 'Tebrikler Elif, dilimleme adımlarını çok net uyguladın.',
    submittedAt: '2026-09-12T15:10:00.000Z'
  },
  {
    id: 'demo-sub-03',
    studentId: 'demo-std-7a-101',
    studentName: 'Mustafa Demir',
    studentNumber: '101',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.1.1',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    ratings: { c1: 3, c2: 3, c3: 3, c4: 3, c5: 3 },
    totalScore: 15,
    maxScore: 20,
    percentage: 75,
    performanceLevel: 'Başarılı',
    studentNote: 'Negatif rasyonel sayılarda sola doğru ilerlerken bazen yönde tereddüt ettim.',
    teacherFeedback: 'Sola doğru ilerleme kuralını akıllı cetvelde bir kez daha pratik edelim.',
    submittedAt: '2026-09-12T15:45:00.000Z'
  },
  {
    id: 'demo-sub-04',
    studentId: 'demo-std-7a-107',
    studentName: 'Fatma Aydın',
    studentNumber: '107',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.1.1',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
    totalScore: 20,
    maxScore: 20,
    percentage: 100,
    performanceLevel: 'Mükemmel',
    studentNote: 'Tüm soruları ve mikroskop denk temsil eşleştirmelerini tamamladım.',
    teacherFeedback: 'Kusursuz çalışma Fatma!',
    submittedAt: '2026-09-12T16:20:00.000Z'
  },
  {
    id: 'demo-sub-05',
    studentId: 'demo-std-5a-306',
    studentName: 'Yağmur Bilgin',
    studentNumber: '306',
    gradeLevel: 5,
    classSection: '5-A',
    outcomeId: 'MAT.5.3.1',
    outcomeCode: 'MAT.5.3.1',
    outcomeTitle: 'Doğru, Doğru Parçası ve Işın',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
    totalScore: 20,
    maxScore: 20,
    percentage: 100,
    performanceLevel: 'Mükemmel',
    studentNote: 'Işın ile doğru parçasının sembolik gösterimlerini çizerek öğrendim.',
    teacherFeedback: 'Sembolik dil kullanımın harika Yağmur.',
    submittedAt: '2026-09-11T11:00:00.000Z'
  }
];

// ---------------------------------------------------------------------------
// 4. ÖNCEDEN DOLDURULMUŞ AKRAN DEĞERLENDİRME KAYITLARI
// ---------------------------------------------------------------------------
export const DEMO_PEER_EVALUATIONS: PeerEvaluationRecord[] = [
  {
    id: 'demo-peer-01',
    evaluatorStudentId: 'demo-std-7a-104',
    evaluatorStudentName: 'Zeynep Kaya',
    evaluatorStudentNumber: '104',
    targetStudentId: 'demo-std-7a-101',
    targetStudentName: 'Mustafa Demir',
    targetStudentNumber: '101',
    groupId: 'group-7a-1',
    groupName: 'Rasyonel Kaşifler Grubu',
    classSection: '7-A',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    ratings: { c1: 4, c2: 3, c3: 4, c4: 4, c5: 3 },
    totalScore: 18,
    maxScore: 20,
    percentage: 90,
    performanceLevel: 'Mükemmel',
    evaluatorNote: 'Mustafa grup çalışmasında cetveli dilimlerken bize çok yardımcı oldu, fikirlerini açıkça paylaştı.',
    submittedAt: '2026-09-12T15:00:00.000Z'
  },
  {
    id: 'demo-peer-02',
    evaluatorStudentId: 'demo-std-7a-101',
    evaluatorStudentName: 'Mustafa Demir',
    evaluatorStudentNumber: '101',
    targetStudentId: 'demo-std-7a-104',
    targetStudentName: 'Zeynep Kaya',
    targetStudentNumber: '104',
    groupId: 'group-7a-1',
    groupName: 'Rasyonel Kaşifler Grubu',
    classSection: '7-A',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
    totalScore: 20,
    maxScore: 20,
    percentage: 100,
    performanceLevel: 'Mükemmel',
    evaluatorNote: 'Zeynep grup lideri olarak hepimizi koordine etti ve tam sayılı kesre çevirme adımlarını çok iyi anlattı.',
    submittedAt: '2026-09-12T15:05:00.000Z'
  },
  {
    id: 'demo-peer-03',
    evaluatorStudentId: 'demo-std-7a-102',
    evaluatorStudentName: 'Elif Çelik',
    evaluatorStudentNumber: '102',
    targetStudentId: 'demo-std-7a-107',
    targetStudentName: 'Fatma Aydın',
    targetStudentNumber: '107',
    groupId: 'group-7a-2',
    groupName: 'Sayı Doğrusu Mimarları',
    classSection: '7-A',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    ratings: { c1: 4, c2: 4, c3: 3, c4: 4, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    evaluatorNote: 'Fatma lazer mutlak değer uygulamasında mesafeleri tam zamanında hesapladı.',
    submittedAt: '2026-09-12T16:00:00.000Z'
  }
];

// ---------------------------------------------------------------------------
// 5. DEMO SINIF ARŞİVİNDE ÖRNEK BEYAZ TAHTA NOTU
// ---------------------------------------------------------------------------
export const DEMO_WHITEBOARD_FILES: ClassroomFileRecord[] = [
  {
    id: 'demo-file-wb-01',
    title: '7-A Rasyonel Sayılar Sayı Doğrusu Çözümleri',
    fileType: 'whiteboard_note',
    classSection: '7-A',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    authorId: 'demo-teacher-01',
    authorName: 'Ahmet Yılmaz',
    authorRole: 'teacher',
    pageCount: 1,
    school: 'Atatürk Ortaokulu',
    isPublishedToClass: true,
    tags: ['Beyaz Tahta', 'Rasyonel Sayılar', 'Örnek Çözümler'],
    pages: [
      {
        id: 'p-demo-1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: '<h2 style="color: #0f766e; font-weight: 800;">7-A Matematik: Rasyonel Sayıların Sayı Doğrusunda Gösterimi</h2><p><strong>Önemli Kural:</strong> Bir bileşik rasyonel ifade sayı doğrusuna yerleştirilirken önce <em>tam sayılı kesre</em> dönüştürülür.</p><p style="padding: 8px 12px; background: #f0fdfa; border-left: 4px solid #0d9488; border-radius: 6px;">Örnek: <strong>-11/4 = -2 tam 3/4</strong><br/>Burada sayı <strong>-2 ile -3 arasındadır</strong>. Aralık 4 eşit parçaya bölünür ve -2\'den sola doğru 3 adım gidilir.</p>',
        shapes: [],
        images: []
      }
    ],
    createdAt: '2026-09-12T10:00:00.000Z',
    updatedAt: '2026-09-12T10:30:00.000Z'
  }
];
