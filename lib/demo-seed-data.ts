// ===========================================================================
// DEMO SEED DATA - TÜRKİYE YÜZYILI MAARİF MODELİ GÖSTERİM VERİLERİ
// ===========================================================================
import type { RubricSubmissionRecord } from '@/lib/rubric-store';
import type { PeerEvaluationRecord } from '@/lib/peer-evaluation-store';
import type { ClassroomFileRecord } from '@/lib/class-files-store';
import type { TeacherUser, StudentUser } from '@/types/auth';
import type { LearningJournalEntry } from '@/lib/journal-store';
import type { StudentGroup, GroupTask } from '@/lib/student-group-store';
import type { BoardParticipationRecord } from '@/lib/board-participation-store';

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

export function makeDemoStudent(
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
    classCode: 'MAARİF',
    password: 'MRF01',
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
// Tüm öğrencilerin sınıf kodu "MAARİF", şifresi "MRF01"
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
  // =========================================================================
  // --- 7-A ŞUBESİ (Öğretmen: Ahmet Yılmaz, Aktif Demo Öğrenci: Zeynep Kaya) ---
  // =========================================================================

  // --- ZEYNEP KAYA (No: 104 • Aktif Demo Öğrenci) ---
  {
    id: 'demo-sub-7a-104-01',
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
    id: 'demo-sub-7a-104-02',
    studentId: 'demo-std-7a-104',
    studentName: 'Zeynep Kaya',
    studentNumber: '104',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.1.2',
    outcomeCode: 'MAT.7.1.2',
    outcomeTitle: 'Rasyonel Sayıları Karşılaştırma ve Sıralama',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 3 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: 'Paydaları eşitleme yönteminin yanında yarıma ve bütüne yakınlık stratejisini de kullanarak sayıları hızla sıraladım.',
    teacherFeedback: 'Strateji çeşitliliğin mükemmel Zeynep. Negatif rasyonel sayılarda mutlak değer tuzağına düşmedin, tebrikler!',
    submittedAt: '2026-09-10T11:15:00.000Z'
  },
  {
    id: 'demo-sub-7a-104-03',
    studentId: 'demo-std-7a-104',
    studentName: 'Zeynep Kaya',
    studentNumber: '104',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.1.3',
    outcomeCode: 'MAT.7.1.3',
    outcomeTitle: 'Rasyonel Sayılarla Dört İşlem',
    ratings: { c1: 4, c2: 3, c3: 4, c4: 4, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: 'Çok adımlı rasyonel işlemlerde önce ana kesir çizgisini belirledim ve işlem önceliği sırasına dikkat ettim.',
    teacherFeedback: 'Merdivenli kesir çözümlerindeki işlem disiplinin örnek nitelikte.',
    submittedAt: '2026-09-08T15:20:00.000Z'
  },
  {
    id: 'demo-sub-7a-104-04',
    studentId: 'demo-std-7a-104',
    studentName: 'Zeynep Kaya',
    studentNumber: '104',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.2.1',
    outcomeCode: 'MAT.7.2.1',
    outcomeTitle: 'Cebirsel İfadelerle Toplama ve Çıkarma İşlemleri',
    ratings: { c1: 4, c2: 4, c3: 3, c4: 3, c5: 4 },
    totalScore: 18,
    maxScore: 20,
    percentage: 90,
    performanceLevel: 'Mükemmel',
    studentNote: 'Cebir karoları ile modelleme yaparak benzer terimlerin katsayılarını topladım.',
    teacherFeedback: 'Cebirsel düşünme becerin çok iyi gelişiyor Zeynep, bravo.',
    submittedAt: '2026-09-05T10:45:00.000Z'
  },
  {
    id: 'demo-sub-7a-104-05',
    studentId: 'demo-std-7a-104',
    studentName: 'Zeynep Kaya',
    studentNumber: '104',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.3.1',
    outcomeCode: 'MAT.7.3.1',
    outcomeTitle: 'Bir Açının Açıortayı ve Doğrular Arasındaki Açı İlişkileri',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
    totalScore: 20,
    maxScore: 20,
    percentage: 100,
    performanceLevel: 'Mükemmel',
    studentNote: 'İki paralel doğruyu kesen doğrunun oluşturduğu iç ters, dış ters ve yöndeş açıları iletkiyle doğruladım.',
    teacherFeedback: 'Geometrik muhakeme ve çıkarımların kusursuz! Tam puan.',
    submittedAt: '2026-09-02T13:10:00.000Z'
  },

  // --- 7-A DİĞER ÖĞRENCİLER ---
  {
    id: 'demo-sub-7a-102-01',
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
    studentNote: 'Sayı doğrusunda ardışık iki tam sayı arasını eşit parçaya bölme kuralını uyguladım.',
    teacherFeedback: 'Tebrikler Elif, dilimleme adımlarını çok net uyguladın.',
    submittedAt: '2026-09-12T15:10:00.000Z'
  },
  {
    id: 'demo-sub-7a-102-02',
    studentId: 'demo-std-7a-102',
    studentName: 'Elif Çelik',
    studentNumber: '102',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.1.2',
    outcomeCode: 'MAT.7.1.2',
    outcomeTitle: 'Rasyonel Sayıları Karşılaştırma ve Sıralama',
    ratings: { c1: 4, c2: 4, c3: 3, c4: 4, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: 'Negatif rasyonel sayılarda paydalar eşit olduğunda payı küçük olanın daha küçük olduğunu kavradım.',
    teacherFeedback: 'Çok dikkatli bir çalışma Elif!',
    submittedAt: '2026-09-10T14:00:00.000Z'
  },
  {
    id: 'demo-sub-7a-107-01',
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
    studentNote: 'Rasyonel sayıların yoğunluk özelliğini ve aralık genişletmeyi keşfettim.',
    teacherFeedback: 'Kusursuz çalışma Fatma!',
    submittedAt: '2026-09-12T16:20:00.000Z'
  },
  {
    id: 'demo-sub-7a-107-02',
    studentId: 'demo-std-7a-107',
    studentName: 'Fatma Aydın',
    studentNumber: '107',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.1.3',
    outcomeCode: 'MAT.7.1.3',
    outcomeTitle: 'Rasyonel Sayılarla Dört İşlem',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 3, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: 'Bölme işleminde ikinci kesri ters çevirip çarpma mantığının birim kesir katı olduğunu kavradım.',
    teacherFeedback: 'Kavramsal açıklamaların harika Fatma.',
    submittedAt: '2026-09-08T16:30:00.000Z'
  },
  {
    id: 'demo-sub-7a-101-01',
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
    studentNote: 'Negatif kesirlerde sola doğru sayma pratiği yaptım.',
    teacherFeedback: 'Sola doğru ilerleme kuralını pekiştirdikçe başarı oranınız artacak Mustafa.',
    submittedAt: '2026-09-12T15:45:00.000Z'
  },
  {
    id: 'demo-sub-7a-101-02',
    studentId: 'demo-std-7a-101',
    studentName: 'Mustafa Demir',
    studentNumber: '101',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.1.2',
    outcomeCode: 'MAT.7.1.2',
    outcomeTitle: 'Rasyonel Sayıları Karşılaştırma ve Sıralama',
    ratings: { c1: 3, c2: 4, c3: 3, c4: 4, c5: 3 },
    totalScore: 17,
    maxScore: 20,
    percentage: 85,
    performanceLevel: 'Başarılı',
    studentNote: 'Paydaları eşitleyerek sıralama adımlarını eksiksiz yaptım.',
    teacherFeedback: 'Gayet güzel bir gelişim Mustafa, tebrikler.',
    submittedAt: '2026-09-10T12:00:00.000Z'
  },
  {
    id: 'demo-sub-7a-111-01',
    studentId: 'demo-std-7a-111',
    studentName: 'Selin Kurt',
    studentNumber: '111',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.1.1',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    ratings: { c1: 4, c2: 4, c3: 3, c4: 4, c5: 3 },
    totalScore: 18,
    maxScore: 20,
    percentage: 90,
    performanceLevel: 'Mükemmel',
    studentNote: 'Dinamik cetvelde rasyonel kesirleri yerleştirdim.',
    teacherFeedback: 'Harika bir performans Selin!',
    submittedAt: '2026-09-12T17:00:00.000Z'
  },
  {
    id: 'demo-sub-7a-103-01',
    studentId: 'demo-std-7a-103',
    studentName: 'Ahmet Can',
    studentNumber: '103',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.1.1',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    ratings: { c1: 3, c2: 3, c3: 4, c4: 3, c5: 3 },
    totalScore: 16,
    maxScore: 20,
    percentage: 80,
    performanceLevel: 'Başarılı',
    studentNote: 'Tam sayılı kesri sayı doğrusuna taşırken önce tam kısmın aralığını belirledim.',
    teacherFeedback: 'Aralık belirleme mantığın çok doğru Ahmet, devamını dilerim.',
    submittedAt: '2026-09-12T17:30:00.000Z'
  },
  {
    id: 'demo-sub-7a-105-01',
    studentId: 'demo-std-7a-105',
    studentName: 'Yusuf Eren',
    studentNumber: '105',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.1.1',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    ratings: { c1: 4, c2: 3, c3: 3, c4: 4, c5: 3 },
    totalScore: 17,
    maxScore: 20,
    percentage: 85,
    performanceLevel: 'Başarılı',
    studentNote: 'Sayı doğrusunda kesir basamaklarını cetvelle ölçerek gösterdim.',
    teacherFeedback: 'Pratik ve görsel yaklaşımların çok verimli Yusuf.',
    submittedAt: '2026-09-12T18:00:00.000Z'
  },
  {
    id: 'demo-sub-7a-106-01',
    studentId: 'demo-std-7a-106',
    studentName: 'Ayşe Yıldız',
    studentNumber: '106',
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
    studentNote: 'Yoğunluk prensibini iki rasyonel sayı arasını genişleterek kanıtladım.',
    teacherFeedback: 'Yoğunluk analizindeki matematiksel akıl yürütmen takdire şayan Ayşe.',
    submittedAt: '2026-09-12T18:20:00.000Z'
  },
  {
    id: 'demo-sub-7a-108-01',
    studentId: 'demo-std-7a-108',
    studentName: 'Burak Şahin',
    studentNumber: '108',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.1.1',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    ratings: { c1: 3, c2: 3, c3: 3, c4: 3, c5: 2 },
    totalScore: 14,
    maxScore: 20,
    percentage: 70,
    performanceLevel: 'Başarılı',
    studentNote: 'Negatif rasyonel sayılarda eksi işaretinin kesir çizgisi hizasında durmasını çalıştım.',
    teacherFeedback: 'Sembolik yerleşimi kavradıkça çok daha rahat edeceksin Burak.',
    submittedAt: '2026-09-12T18:40:00.000Z'
  },
  {
    id: 'demo-sub-7a-110-01',
    studentId: 'demo-std-7a-110',
    studentName: 'Hilal Polat',
    studentNumber: '110',
    gradeLevel: 7,
    classSection: '7-A',
    outcomeId: 'MAT.7.1.1',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    ratings: { c1: 4, c2: 4, c3: 3, c4: 4, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: 'Birim kesir adımlarını sayı doğrusunda kaydırmadan yerleştirdim.',
    teacherFeedback: 'Tebrikler Hilal, cetvel kullanımı ve yerleşim çok başarılı.',
    submittedAt: '2026-09-12T19:00:00.000Z'
  },

  // =========================================================================
  // --- 6-B ŞUBESİ (Öğretmen: Ahmet Yılmaz) ---
  // =========================================================================
  {
    id: 'demo-sub-6b-206-01',
    studentId: 'demo-std-6b-206',
    studentName: 'Zehra Bozkurt',
    studentNumber: '206',
    gradeLevel: 6,
    classSection: '6-B',
    outcomeId: 'MAT.6.1.1',
    outcomeCode: 'MAT.6.1.1',
    outcomeTitle: 'Asal Sayılar ve Doğal Sayıların Asal Çarpanları',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 3 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: 'Çarpan ağacı ve bölen listesi yöntemlerinin her ikisini de başarıyla uyguladım.',
    teacherFeedback: 'Tebrikler Zehra, asal çarpanları üslü ifadeyle göstermen harika.',
    submittedAt: '2026-09-11T13:20:00.000Z'
  },
  {
    id: 'demo-sub-6b-206-02',
    studentId: 'demo-std-6b-206',
    studentName: 'Zehra Bozkurt',
    studentNumber: '206',
    gradeLevel: 6,
    classSection: '6-B',
    outcomeId: 'MAT.6.1.2',
    outcomeCode: 'MAT.6.1.2',
    outcomeTitle: 'Bölünebilme Kuralları (2, 3, 4, 5, 6, 9, 10)',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
    totalScore: 20,
    maxScore: 20,
    percentage: 100,
    performanceLevel: 'Mükemmel',
    studentNote: '3 ve 9 ile bölünebilmede basamak değerleri toplamı kuralını zihinden uyguladım.',
    teacherFeedback: 'Kusursuz bir mantık Zehra, tebrikler!',
    submittedAt: '2026-09-09T14:15:00.000Z'
  },
  {
    id: 'demo-sub-6b-202-01',
    studentId: 'demo-std-6b-202',
    studentName: 'Defne Erdem',
    studentNumber: '202',
    gradeLevel: 6,
    classSection: '6-B',
    outcomeId: 'MAT.6.1.1',
    outcomeCode: 'MAT.6.1.1',
    outcomeTitle: 'Asal Sayılar ve Doğal Sayıların Asal Çarpanları',
    ratings: { c1: 4, c2: 4, c3: 3, c4: 4, c5: 3 },
    totalScore: 18,
    maxScore: 20,
    percentage: 90,
    performanceLevel: 'Mükemmel',
    studentNote: 'Eratosthenes kalburu ile 100 e kadar olan asalları belirledim.',
    teacherFeedback: 'Kalbur mantığını çok güzel kavramışsın Defne.',
    submittedAt: '2026-09-11T14:10:00.000Z'
  },
  {
    id: 'demo-sub-6b-202-02',
    studentId: 'demo-std-6b-202',
    studentName: 'Defne Erdem',
    studentNumber: '202',
    gradeLevel: 6,
    classSection: '6-B',
    outcomeId: 'MAT.6.1.4',
    outcomeCode: 'MAT.6.1.4',
    outcomeTitle: 'İki Doğal Sayının Ortak Bölenleri ve Ortak Katları',
    ratings: { c1: 4, c2: 3, c3: 4, c4: 4, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: 'Problem çözümlerinde bütünden parçaya giderken EBOB, parçadan bütüne giderken EKOK kullandım.',
    teacherFeedback: 'Strateji ayrımın çok yerinde Defne.',
    submittedAt: '2026-09-07T11:30:00.000Z'
  },
  {
    id: 'demo-sub-6b-201-01',
    studentId: 'demo-std-6b-201',
    studentName: 'Kerem Yalçın',
    studentNumber: '201',
    gradeLevel: 6,
    classSection: '6-B',
    outcomeId: 'MAT.6.1.1',
    outcomeCode: 'MAT.6.1.1',
    outcomeTitle: 'Asal Sayılar ve Doğal Sayıların Asal Çarpanları',
    ratings: { c1: 3, c2: 3, c3: 3, c4: 3, c5: 3 },
    totalScore: 15,
    maxScore: 20,
    percentage: 75,
    performanceLevel: 'Başarılı',
    studentNote: '2 den başka çift asal sayı olmadığını öğrendim.',
    teacherFeedback: 'Gayet başarılı bir kavrayış Kerem!',
    submittedAt: '2026-09-11T15:00:00.000Z'
  },
  {
    id: 'demo-sub-6b-203-01',
    studentId: 'demo-std-6b-203',
    studentName: 'Arda Güler',
    studentNumber: '203',
    gradeLevel: 6,
    classSection: '6-B',
    outcomeId: 'MAT.6.1.1',
    outcomeCode: 'MAT.6.1.1',
    outcomeTitle: 'Asal Sayılar ve Doğal Sayıların Asal Çarpanları',
    ratings: { c1: 4, c2: 3, c3: 4, c4: 3, c5: 3 },
    totalScore: 17,
    maxScore: 20,
    percentage: 85,
    performanceLevel: 'Başarılı',
    studentNote: 'Asal çarpan ağacı dallarını asal sayılara kadar uzattım.',
    teacherFeedback: 'Çarpan ağacı çizimlerin çok net Arda.',
    submittedAt: '2026-09-11T15:30:00.000Z'
  },
  {
    id: 'demo-sub-6b-204-01',
    studentId: 'demo-std-6b-204',
    studentName: 'Beren Su',
    studentNumber: '204',
    gradeLevel: 6,
    classSection: '6-B',
    outcomeId: 'MAT.6.1.1',
    outcomeCode: 'MAT.6.1.1',
    outcomeTitle: 'Asal Sayılar ve Doğal Sayıların Asal Çarpanları',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 3, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: '1 in asal sayı olmadığını çünkü sadece tek bir pozitif böleni olduğunu öğrendim.',
    teacherFeedback: 'Harika bir tanım çıkarımı Beren!',
    submittedAt: '2026-09-11T16:00:00.000Z'
  },
  {
    id: 'demo-sub-6b-207-01',
    studentId: 'demo-std-6b-207',
    studentName: 'Ceren Öz',
    studentNumber: '207',
    gradeLevel: 6,
    classSection: '6-B',
    outcomeId: 'MAT.6.1.1',
    outcomeCode: 'MAT.6.1.1',
    outcomeTitle: 'Asal Sayılar ve Doğal Sayıların Asal Çarpanları',
    ratings: { c1: 4, c2: 3, c3: 4, c4: 4, c5: 3 },
    totalScore: 18,
    maxScore: 20,
    percentage: 90,
    performanceLevel: 'Mükemmel',
    studentNote: 'Bölen listesinde sağ tarafa sadece asal sayıların yazılması kuralını uyguladım.',
    teacherFeedback: 'Tebrikler Ceren, bölen listesi adımların hatasız.',
    submittedAt: '2026-09-11T16:30:00.000Z'
  },

  // =========================================================================
  // --- 5-A ŞUBESİ (Öğretmen: Ahmet Yılmaz) ---
  // =========================================================================
  {
    id: 'demo-sub-5a-306-01',
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
  },
  {
    id: 'demo-sub-5a-306-02',
    studentId: 'demo-std-5a-306',
    studentName: 'Yağmur Bilgin',
    studentNumber: '306',
    gradeLevel: 5,
    classSection: '5-A',
    outcomeId: 'MAT.5.3.2',
    outcomeCode: 'MAT.5.3.2',
    outcomeTitle: 'Bir Noktanın Diğer Noktaya Göre Konumu ve Eş Doğru Parçası İnşası',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 3 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: 'Kareli kağıtta birim sayarak yön tarif ettim ve pergel yardımıyla eşit doğru parçaları çizdim.',
    teacherFeedback: 'Geometrik inşa tekniklerin çok başarılı Yağmur.',
    submittedAt: '2026-09-08T10:30:00.000Z'
  },
  {
    id: 'demo-sub-5a-306-03',
    studentId: 'demo-std-5a-306',
    studentName: 'Yağmur Bilgin',
    studentNumber: '306',
    gradeLevel: 5,
    classSection: '5-A',
    outcomeId: 'MAT.5.3.3',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    ratings: { c1: 4, c2: 4, c3: 3, c4: 4, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: 'İletki merkezini açının köşesine tam oturtarak dar ve geniş açıların ölçümünü yaptım.',
    teacherFeedback: 'Açı ölçme hassasiyetin çok yüksek.',
    submittedAt: '2026-09-05T11:15:00.000Z'
  },
  {
    id: 'demo-sub-5a-311-01',
    studentId: 'demo-std-5a-311',
    studentName: 'Ozan Coşkun',
    studentNumber: '311',
    gradeLevel: 5,
    classSection: '5-A',
    outcomeId: 'MAT.5.3.1',
    outcomeCode: 'MAT.5.3.1',
    outcomeTitle: 'Doğru, Doğru Parçası ve Işın',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 3, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: 'Doğru iki yöne de sonsuza giderken doğru parçasının uzunluğunun ölçülebildiğini pekiştirdim.',
    teacherFeedback: 'Mükemmel analiz Ozan!',
    submittedAt: '2026-09-11T11:40:00.000Z'
  },
  {
    id: 'demo-sub-5a-311-02',
    studentId: 'demo-std-5a-311',
    studentName: 'Ozan Coşkun',
    studentNumber: '311',
    gradeLevel: 5,
    classSection: '5-A',
    outcomeId: 'MAT.5.3.4',
    outcomeCode: 'MAT.5.3.4',
    outcomeTitle: 'Düzlemde İki ve Üç Doğrunun Durumları ve Açı Çıkarımları',
    ratings: { c1: 4, c2: 3, c3: 4, c4: 4, c5: 3 },
    totalScore: 18,
    maxScore: 20,
    percentage: 90,
    performanceLevel: 'Mükemmel',
    studentNote: 'Paralel iki doğrunun hiçbir zaman kesişmediğini ve aralarındaki dik mesafenin sabit kaldığını modelledim.',
    teacherFeedback: 'Doğru durumları modellemen çok başarılı Ozan.',
    submittedAt: '2026-09-06T14:20:00.000Z'
  },
  {
    id: 'demo-sub-5a-302-01',
    studentId: 'demo-std-5a-302',
    studentName: 'Duru Keskin',
    studentNumber: '302',
    gradeLevel: 5,
    classSection: '5-A',
    outcomeId: 'MAT.5.3.1',
    outcomeCode: 'MAT.5.3.1',
    outcomeTitle: 'Doğru, Doğru Parçası ve Işın',
    ratings: { c1: 4, c2: 3, c3: 4, c4: 4, c5: 3 },
    totalScore: 18,
    maxScore: 20,
    percentage: 90,
    performanceLevel: 'Mükemmel',
    studentNote: 'Cetvel kullanarak doğru parçalarını çizdim ve isimlendirdim.',
    teacherFeedback: 'Çizimlerin çok özenli Duru, tebrikler.',
    submittedAt: '2026-09-11T12:15:00.000Z'
  },
  {
    id: 'demo-sub-5a-301-01',
    studentId: 'demo-std-5a-301',
    studentName: 'Mehmet Ali Tunç',
    studentNumber: '301',
    gradeLevel: 5,
    classSection: '5-A',
    outcomeId: 'MAT.5.3.1',
    outcomeCode: 'MAT.5.3.1',
    outcomeTitle: 'Doğru, Doğru Parçası ve Işın',
    ratings: { c1: 3, c2: 3, c3: 4, c4: 3, c5: 3 },
    totalScore: 16,
    maxScore: 20,
    percentage: 80,
    performanceLevel: 'Başarılı',
    studentNote: 'Işının bir ucu kapalı diğer ucu sonsuz olduğunu fener ışığı benzetmesiyle kavradım.',
    teacherFeedback: 'Harika bir somut benzetme Mehmet Ali!',
    submittedAt: '2026-09-11T12:45:00.000Z'
  },
  {
    id: 'demo-sub-5a-303-01',
    studentId: 'demo-std-5a-303',
    studentName: 'Ali Kemal',
    studentNumber: '303',
    gradeLevel: 5,
    classSection: '5-A',
    outcomeId: 'MAT.5.3.1',
    outcomeCode: 'MAT.5.3.1',
    outcomeTitle: 'Doğru, Doğru Parçası ve Işın',
    ratings: { c1: 4, c2: 3, c3: 3, c4: 4, c5: 3 },
    totalScore: 17,
    maxScore: 20,
    percentage: 85,
    performanceLevel: 'Başarılı',
    studentNote: 'Noktaları büyük harfle, doğruları küçük harfle veya iki büyük harfle göstermeyi pekiştirdim.',
    teacherFeedback: 'Notasyon kurallarına tam uyum sağladın Ali Kemal.',
    submittedAt: '2026-09-11T13:15:00.000Z'
  },
  {
    id: 'demo-sub-5a-304-01',
    studentId: 'demo-std-5a-304',
    studentName: 'Zeynep Ece',
    studentNumber: '304',
    gradeLevel: 5,
    classSection: '5-A',
    outcomeId: 'MAT.5.3.1',
    outcomeCode: 'MAT.5.3.1',
    outcomeTitle: 'Doğru, Doğru Parçası ve Işın',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 3, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    studentNote: 'Doğru parçası uzunluğunu köşeli parantez olmadan [AB] uzunluğu |AB| olarak yazmayı öğrendim.',
    teacherFeedback: 'Kusursuz sembolik kavrayış Zeynep Ece.',
    submittedAt: '2026-09-11T13:45:00.000Z'
  }
];

// ---------------------------------------------------------------------------
// 4. ÖNCEDEN DOLDURULMUŞ AKRAN DEĞERLENDİRME KAYITLARI
// ---------------------------------------------------------------------------
export const DEMO_PEER_EVALUATIONS: PeerEvaluationRecord[] = [
  // 7-A
  {
    id: 'demo-peer-7a-01',
    evaluatorStudentId: 'demo-std-7a-104',
    evaluatorStudentName: 'Zeynep Kaya',
    evaluatorStudentNumber: '104',
    targetStudentId: 'demo-std-7a-101',
    targetStudentName: 'Mustafa Demir',
    targetStudentNumber: '101',
    groupId: 'demo-grp-7a-1',
    groupName: 'Pisagor Kaşifleri',
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
    id: 'demo-peer-7a-02',
    evaluatorStudentId: 'demo-std-7a-101',
    evaluatorStudentName: 'Mustafa Demir',
    evaluatorStudentNumber: '101',
    targetStudentId: 'demo-std-7a-104',
    targetStudentName: 'Zeynep Kaya',
    targetStudentNumber: '104',
    groupId: 'demo-grp-7a-1',
    groupName: 'Pisagor Kaşifleri',
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
    id: 'demo-peer-7a-03',
    evaluatorStudentId: 'demo-std-7a-102',
    evaluatorStudentName: 'Elif Çelik',
    evaluatorStudentNumber: '102',
    targetStudentId: 'demo-std-7a-107',
    targetStudentName: 'Fatma Aydın',
    targetStudentNumber: '107',
    groupId: 'demo-grp-7a-2',
    groupName: 'Harezmi Ekibi',
    classSection: '7-A',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    ratings: { c1: 4, c2: 4, c3: 3, c4: 4, c5: 4 },
    totalScore: 19,
    maxScore: 20,
    percentage: 95,
    performanceLevel: 'Mükemmel',
    evaluatorNote: 'Fatma rasyonel sayıların yoğunluk deneyinde mesafeleri tam zamanında hesapladı.',
    submittedAt: '2026-09-12T16:00:00.000Z'
  },
  // 6-B
  {
    id: 'demo-peer-6b-01',
    evaluatorStudentId: 'demo-std-6b-202',
    evaluatorStudentName: 'Defne Erdem',
    evaluatorStudentNumber: '202',
    targetStudentId: 'demo-std-6b-201',
    targetStudentName: 'Kerem Yalçın',
    targetStudentNumber: '201',
    groupId: 'demo-grp-6b-1',
    groupName: 'Cahit Arf Dahileri',
    classSection: '6-B',
    outcomeCode: 'MAT.6.1.1',
    outcomeTitle: 'Asal Sayılar ve Doğal Sayıların Asal Çarpanları',
    ratings: { c1: 4, c2: 3, c3: 4, c4: 3, c5: 4 },
    totalScore: 18,
    maxScore: 20,
    percentage: 90,
    performanceLevel: 'Mükemmel',
    evaluatorNote: 'Kerem çarpan ağacını oluştururken yaprakları kontrol etmemizde çok dikkatli davrandı.',
    submittedAt: '2026-09-11T14:30:00.000Z'
  },
  // 5-A
  {
    id: 'demo-peer-5a-01',
    evaluatorStudentId: 'demo-std-5a-306',
    evaluatorStudentName: 'Yağmur Bilgin',
    evaluatorStudentNumber: '306',
    targetStudentId: 'demo-std-5a-311',
    targetStudentName: 'Ozan Coşkun',
    targetStudentNumber: '311',
    groupId: 'demo-grp-5a-1',
    groupName: 'Ali Kuşçu Yıldızları',
    classSection: '5-A',
    outcomeCode: 'MAT.5.3.1',
    outcomeTitle: 'Doğru, Doğru Parçası ve Işın',
    ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
    totalScore: 20,
    maxScore: 20,
    percentage: 100,
    performanceLevel: 'Mükemmel',
    evaluatorNote: 'Ozan cetvel ve gönye ile ışın çizimlerini hatasız tamamladı.',
    submittedAt: '2026-09-11T11:50:00.000Z'
  }
];

// ---------------------------------------------------------------------------
// 5. DEMO ÖĞRENME GÜNLÜKLERİ (LEARNING JOURNALS)
// ---------------------------------------------------------------------------
export const DEMO_JOURNAL_ENTRIES: LearningJournalEntry[] = [
  // 7-A
  {
    id: 'demo-jrn-7a-01',
    studentId: 'demo-std-7a-104',
    studentName: 'Zeynep Kaya',
    studentNumber: '104',
    gradeLevel: 7,
    classSection: '7-A',
    school: 'Atatürk Ortaokulu',
    outcomeId: 'MAT.7.1.1',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    prompt: 'Bugünkü derste rasyonel sayıların sayı doğrusundaki yerini belirlerken seni en çok şaşırtan veya kavradığın kilit nokta ne oldu?',
    studentReflection: 'Bugün rasyonel sayıların sayı doğrusunda gösteriminde negatif sayıların sıfırdan sola doğru uzaklaştıkça küçüldüğünü çok daha iyi anladım. Bileşik kesirleri tam sayılı kesre çevirince hangi iki tam sayı arasında olduğunu bulmak çok kolaylaştı.',
    teacherFeedback: 'Harika bir çıkarım Zeynep! Negatif yön kavramını kusursuz kavramışsın.',
    teacherLiked: true,
    submittedAt: '2026-09-12T15:30:00.000Z'
  },
  {
    id: 'demo-jrn-7a-02',
    studentId: 'demo-std-7a-102',
    studentName: 'Elif Çelik',
    studentNumber: '102',
    gradeLevel: 7,
    classSection: '7-A',
    school: 'Atatürk Ortaokulu',
    outcomeId: 'MAT.7.1.1',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    prompt: 'Sayı doğrusunda kesirleri yerleştirirken kullandığın en etkili yöntem hangisiydi?',
    studentReflection: 'Cetvel laboratuvarında paydaya göre aralığı eşit parçalara bölme adımı zihnimde canlandırmamı sağladı. Özellikle -7/3 kesrinin -2 ile -3 arasında olduğunu görmek çok eğlenceliydi.',
    teacherFeedback: 'Somut modellemenin faydasını çok iyi yansıtmışsın Elif, tebrikler!',
    teacherLiked: true,
    submittedAt: '2026-09-12T15:40:00.000Z'
  },
  {
    id: 'demo-jrn-7a-03',
    studentId: 'demo-std-7a-101',
    studentName: 'Mustafa Demir',
    studentNumber: '101',
    gradeLevel: 7,
    classSection: '7-A',
    school: 'Atatürk Ortaokulu',
    outcomeId: 'MAT.7.1.1',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    prompt: 'Bugün zorlandığın ve sonradan çözümünü keşfettiğin bir matematiksel durum oldu mu?',
    studentReflection: 'Negatif rasyonel sayılarda sola doğru sayarken başta pozitif sayılar gibi sağa doğru saymıştım. Arkadaşım Zeynep ile tartışınca sıfırın soluna doğru adım atılması gerektiğini anladım.',
    teacherFeedback: 'Hatanın nedenini fark edip arkadaşınla çözmen tam bir bilim insanı yaklaşımı Mustafa.',
    teacherLiked: true,
    submittedAt: '2026-09-12T16:00:00.000Z'
  },

  // 6-B
  {
    id: 'demo-jrn-6b-01',
    studentId: 'demo-std-6b-202',
    studentName: 'Defne Erdem',
    studentNumber: '202',
    gradeLevel: 6,
    classSection: '6-B',
    school: 'Atatürk Ortaokulu',
    outcomeId: 'MAT.6.1.1',
    outcomeCode: 'MAT.6.1.1',
    outcomeTitle: 'Asal Sayılar ve Doğal Sayıların Asal Çarpanları',
    prompt: 'Asal sayıların doğadaki veya günlük hayattaki yeri hakkında ne düşünüyorsun?',
    studentReflection: 'Eratosthenes kalburunda asal sayıları elerken adeta bir elek gibi çalışan algoritmayı çok sevdim. 2 hariç hiçbir çift sayının asal olamayacağını ve asal sayıların kriptografide şifreleme için kullanıldığını öğrendik.',
    teacherFeedback: 'Kriptografi bağlantısı harika bir araştırma merakı göstergesi Defne, aferin!',
    teacherLiked: true,
    submittedAt: '2026-09-11T14:40:00.000Z'
  },
  {
    id: 'demo-jrn-6b-02',
    studentId: 'demo-std-6b-206',
    studentName: 'Zehra Bozkurt',
    studentNumber: '206',
    gradeLevel: 6,
    classSection: '6-B',
    school: 'Atatürk Ortaokulu',
    outcomeId: 'MAT.6.1.1',
    outcomeCode: 'MAT.6.1.1',
    outcomeTitle: 'Asal Sayılar ve Doğal Sayıların Asal Çarpanları',
    prompt: 'Çarpan ağacı yöntemi ile bölen listesi yöntemini karşılaştırır mısın?',
    studentReflection: 'Çarpan ağacı görsel olarak çok anlaşılır ama sayı büyüdükçe bölen listesi (asal çarpan algoritması) yapmak daha pratik. Sonuçta her iki yöntem de aynı asal çarpanları veriyor.',
    teacherFeedback: 'Algoritmik düşünme becerin çok gelişmiş Zehra.',
    teacherLiked: true,
    submittedAt: '2026-09-11T15:10:00.000Z'
  },

  // 5-A
  {
    id: 'demo-jrn-5a-01',
    studentId: 'demo-std-5a-306',
    studentName: 'Yağmur Bilgin',
    studentNumber: '306',
    gradeLevel: 5,
    classSection: '5-A',
    school: 'Atatürk Ortaokulu',
    outcomeId: 'MAT.5.3.1',
    outcomeCode: 'MAT.5.3.1',
    outcomeTitle: 'Doğru, Doğru Parçası ve Işın',
    prompt: 'Doğru, doğru parçası ve ışını günlük hayatımızdaki nesnelerle nasıl eşleştirirsin?',
    studentReflection: 'Sınıfta tartıştığımız gibi sonsuza uzanan tren raylarını doğruya, başlangıcı olan el feneri ışığını ışına, iki ucundan tuttuğumuz kurşun kalemi ise doğru parçasına benzettim. Artık sembollerini karıştırmıyorum.',
    teacherFeedback: 'Mükemmel benzetmeler Yağmur! Bilgiyi içselleştirdiğini çok iyi gösteriyor.',
    teacherLiked: true,
    submittedAt: '2026-09-11T11:30:00.000Z'
  }
];

// ---------------------------------------------------------------------------
// 6. DEMO İŞBİRLİKLİ ÇALIŞMA GRUPLARI & GRUP GÖREVLERİ
// ---------------------------------------------------------------------------
export const DEMO_STUDENT_GROUPS: StudentGroup[] = [
  // 7-A Grupları
  {
    id: 'demo-grp-7a-1',
    name: 'Pisagor Kaşifleri',
    classSection: '7-A',
    teacherId: 'demo-teacher-01',
    teacherName: 'Ahmet Yılmaz',
    colorGradient: 'from-teal-600 to-emerald-600',
    members: [
      { id: 'demo-std-7a-104', name: 'Zeynep Kaya', studentNumber: '104', avatar: '👩‍🎓', classSection: '7-A' },
      { id: 'demo-std-7a-101', name: 'Mustafa Demir', studentNumber: '101', avatar: '👨‍🎓', classSection: '7-A' },
      { id: 'demo-std-7a-102', name: 'Elif Çelik', studentNumber: '102', avatar: '👩‍🎓', classSection: '7-A' },
      { id: 'demo-std-7a-103', name: 'Mehmet Şahin', studentNumber: '103', avatar: '👨‍🎓', classSection: '7-A' }
    ],
    peerEvaluationEnabled: true,
    peerEvaluationOutcomeCode: 'MAT.7.1.1',
    peerEvaluationOutcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    createdAt: '2026-09-02T09:00:00.000Z'
  },
  {
    id: 'demo-grp-7a-2',
    name: 'Harezmi Ekibi',
    classSection: '7-A',
    teacherId: 'demo-teacher-01',
    teacherName: 'Ahmet Yılmaz',
    colorGradient: 'from-indigo-600 to-purple-600',
    members: [
      { id: 'demo-std-7a-107', name: 'Fatma Aydın', studentNumber: '107', avatar: '👩‍🎓', classSection: '7-A' },
      { id: 'demo-std-7a-108', name: 'Caner Arslan', studentNumber: '108', avatar: '👨‍🎓', classSection: '7-A' },
      { id: 'demo-std-7a-109', name: 'Beren Koç', studentNumber: '109', avatar: '👩‍🎓', classSection: '7-A' },
      { id: 'demo-std-7a-110', name: 'Burak Polat', studentNumber: '110', avatar: '👨‍🎓', classSection: '7-A' }
    ],
    peerEvaluationEnabled: true,
    peerEvaluationOutcomeCode: 'MAT.7.1.1',
    peerEvaluationOutcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    createdAt: '2026-09-02T09:00:00.000Z'
  },
  {
    id: 'demo-grp-7a-3',
    name: 'Öklid Mimarları',
    classSection: '7-A',
    teacherId: 'demo-teacher-01',
    teacherName: 'Ahmet Yılmaz',
    colorGradient: 'from-amber-500 to-orange-600',
    members: [
      { id: 'demo-std-7a-105', name: 'Ayşe Yıldız', studentNumber: '105', avatar: '👩‍🎓', classSection: '7-A' },
      { id: 'demo-std-7a-106', name: 'Emir Öztürk', studentNumber: '106', avatar: '👨‍🎓', classSection: '7-A' },
      { id: 'demo-std-7a-111', name: 'Selin Kurt', studentNumber: '111', avatar: '👩‍🎓', classSection: '7-A' },
      { id: 'demo-std-7a-112', name: 'Yusuf Aksoy', studentNumber: '112', avatar: '👨‍🎓', classSection: '7-A' }
    ],
    peerEvaluationEnabled: false,
    createdAt: '2026-09-02T09:00:00.000Z'
  },

  // 6-B Grupları
  {
    id: 'demo-grp-6b-1',
    name: 'Cahit Arf Dahileri',
    classSection: '6-B',
    teacherId: 'demo-teacher-01',
    teacherName: 'Ahmet Yılmaz',
    colorGradient: 'from-cyan-600 to-blue-600',
    members: [
      { id: 'demo-std-6b-201', name: 'Kerem Yalçın', studentNumber: '201', avatar: '👨‍🎓', classSection: '6-B' },
      { id: 'demo-std-6b-202', name: 'Defne Erdem', studentNumber: '202', avatar: '👩‍🎓', classSection: '6-B' },
      { id: 'demo-std-6b-206', name: 'Zehra Bozkurt', studentNumber: '206', avatar: '👩‍🎓', classSection: '6-B' },
      { id: 'demo-std-6b-211', name: 'Baran Özdemir', studentNumber: '211', avatar: '👨‍🎓', classSection: '6-B' }
    ],
    peerEvaluationEnabled: true,
    peerEvaluationOutcomeCode: 'MAT.6.1.1',
    peerEvaluationOutcomeTitle: 'Asal Sayılar ve Doğal Sayıların Asal Çarpanları',
    createdAt: '2026-09-02T09:00:00.000Z'
  },

  // 5-A Grupları
  {
    id: 'demo-grp-5a-1',
    name: 'Ali Kuşçu Yıldızları',
    classSection: '5-A',
    teacherId: 'demo-teacher-01',
    teacherName: 'Ahmet Yılmaz',
    colorGradient: 'from-violet-600 to-indigo-700',
    members: [
      { id: 'demo-std-5a-306', name: 'Yağmur Bilgin', studentNumber: '306', avatar: '👩‍🎓', classSection: '5-A' },
      { id: 'demo-std-5a-311', name: 'Ozan Coşkun', studentNumber: '311', avatar: '👨‍🎓', classSection: '5-A' },
      { id: 'demo-std-5a-301', name: 'Efe Karaca', studentNumber: '301', avatar: '👨‍🎓', classSection: '5-A' },
      { id: 'demo-std-5a-302', name: 'Duru Keskin', studentNumber: '302', avatar: '👩‍🎓', classSection: '5-A' }
    ],
    peerEvaluationEnabled: true,
    peerEvaluationOutcomeCode: 'MAT.5.3.1',
    peerEvaluationOutcomeTitle: 'Doğru, Doğru Parçası ve Işın',
    createdAt: '2026-09-02T09:00:00.000Z'
  }
];

export const DEMO_GROUP_TASKS: GroupTask[] = [
  {
    id: 'demo-gtask-01',
    groupId: 'demo-grp-7a-1',
    groupName: 'Pisagor Kaşifleri',
    classSection: '7-A',
    teacherId: 'demo-teacher-01',
    teacherName: 'Ahmet Yılmaz',
    title: 'Rasyonel Sayı Doğrusu Modeli Hazırlama',
    description: '-3 ile +3 aralığında negatif ve pozitif kesirleri gösteren ortak bir poster çalışması hazırlayın.',
    outcomeCode: 'MAT.7.1.1',
    outcomeTitle: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi',
    dueDate: '2026-09-20',
    xpReward: 100,
    status: 'submitted',
    submittedByStudentName: 'Zeynep Kaya',
    submittedAt: '2026-09-12T17:30:00.000Z',
    submissionNote: 'Grup olarak posterimizi tamamladık ve beyaz tahtada dijital örneğini kaydettik.',
    teacherFeedback: 'Harika bir işbirliği, tebrikler Pisagor Kaşifleri!',
    createdAt: '2026-09-05T08:00:00.000Z'
  }
];

// ---------------------------------------------------------------------------
// 7. DEMO AKILLI TAHTA KATILIMI KAYITLARI (BOARD PARTICIPATIONS)
// ---------------------------------------------------------------------------
export const DEMO_BOARD_PARTICIPATIONS: BoardParticipationRecord[] = [
  {
    id: 'demo-bp-01',
    studentId: 'demo-std-7a-104',
    studentName: 'Zeynep Kaya',
    studentNumber: '104',
    classSection: '7-A',
    school: 'Atatürk Ortaokulu',
    teacherId: 'demo-teacher-01',
    teacherName: 'Ahmet Yılmaz',
    activityType: 'game',
    activityTitle: 'Dinamik Rasyonel Cetvel Laboratuvarı',
    outcomeCode: 'MAT.7.1.1',
    subject: 'Matematik',
    score: 100,
    maxScore: 100,
    xpEarned: 60,
    timestamp: '2026-09-12T14:15:00.000Z'
  },
  {
    id: 'demo-bp-02',
    studentId: 'demo-std-7a-102',
    studentName: 'Elif Çelik',
    studentNumber: '102',
    classSection: '7-A',
    school: 'Atatürk Ortaokulu',
    teacherId: 'demo-teacher-01',
    teacherName: 'Ahmet Yılmaz',
    activityType: 'game',
    activityTitle: 'Rasyonel Sayı Eşleştirme Testi',
    outcomeCode: 'MAT.7.1.1',
    subject: 'Matematik',
    score: 95,
    maxScore: 100,
    xpEarned: 50,
    timestamp: '2026-09-12T14:40:00.000Z'
  },
  {
    id: 'demo-bp-03',
    studentId: 'demo-std-7a-107',
    studentName: 'Fatma Aydın',
    studentNumber: '107',
    classSection: '7-A',
    school: 'Atatürk Ortaokulu',
    teacherId: 'demo-teacher-01',
    teacherName: 'Ahmet Yılmaz',
    activityType: 'game',
    activityTitle: 'Rasyonel Yoğunluk Mikroskobu',
    outcomeCode: 'MAT.7.1.1',
    subject: 'Matematik',
    score: 100,
    maxScore: 100,
    xpEarned: 60,
    timestamp: '2026-09-12T15:20:00.000Z'
  },
  {
    id: 'demo-bp-04',
    studentId: 'demo-std-6b-206',
    studentName: 'Zehra Bozkurt',
    studentNumber: '206',
    classSection: '6-B',
    school: 'Atatürk Ortaokulu',
    teacherId: 'demo-teacher-01',
    teacherName: 'Ahmet Yılmaz',
    activityType: 'game',
    activityTitle: 'Eratosthenes Kalburu İnteraktif Etkinliği',
    outcomeCode: 'MAT.6.1.1',
    subject: 'Matematik',
    score: 100,
    maxScore: 100,
    xpEarned: 60,
    timestamp: '2026-09-11T13:45:00.000Z'
  },
  {
    id: 'demo-bp-05',
    studentId: 'demo-std-5a-306',
    studentName: 'Yağmur Bilgin',
    studentNumber: '306',
    classSection: '5-A',
    school: 'Atatürk Ortaokulu',
    teacherId: 'demo-teacher-01',
    teacherName: 'Ahmet Yılmaz',
    activityType: 'game',
    activityTitle: 'Temel Geometrik Çizimler Atölyesi',
    outcomeCode: 'MAT.5.3.1',
    subject: 'Matematik',
    score: 100,
    maxScore: 100,
    xpEarned: 60,
    timestamp: '2026-09-11T10:45:00.000Z'
  }
];

// ---------------------------------------------------------------------------
// 8. DEMO SINIF ARŞİVİNDE ÖRNEK BEYAZ TAHTA NOTU
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

