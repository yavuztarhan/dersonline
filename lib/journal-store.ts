'use client';

export interface LearningJournalEntry {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  gradeLevel: number;
  classSection: string; // '5-A', '5-B', '6-A'
  school?: string;
  outcomeId: string;
  outcomeCode: string;
  outcomeTitle: string;
  prompt: string;
  studentReflection: string;
  teacherFeedback?: string;
  teacherLiked?: boolean;
  submittedAt: string;
}

const STORAGE_KEY = 'maarif_learning_journals_v1';

// Initial pre-populated rich data for learning journals
const INITIAL_JOURNAL_ENTRIES: LearningJournalEntry[] = [
  {
    id: 'jrn-6a-01',
    studentId: 'stu-601',
    studentName: 'Zeynep Kaya',
    studentNumber: '204',
    gradeLevel: 6,
    classSection: '6-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.6.1.3',
    outcomeCode: 'MAT.6.1.3',
    outcomeTitle: 'Asal Sayılar ve Asal Çarpanlara Ayırma',
    prompt: 'Bugün asal sayılar ve çarpan ağacı hakkında öğrendiğim en şaşırtıcı özellik şuydu:',
    studentReflection: 'Eratosthenes kalburunda sadece 2, 3, 5 ve 7 nin katlarını elediğimizde 1-100 arasındaki tüm 25 asal sayının kendiliğinden parladığını gördüm. Ayrıca 72 nin çarpan ağacında her satırdaki sayıların çarpımının daima 72 ye eşit kaldığını keşfettim!',
    teacherFeedback: 'Harika bir matematiksel farkındalık Zeynep! Çarpan ağacındaki korunum ilkesini çok güzel açıklamışsın.',
    teacherLiked: true,
    submittedAt: '2026-09-09T14:30:00Z'
  },
  {
    id: 'jrn-6a-02',
    studentId: 'stu-602',
    studentName: 'Ahmet Demir',
    studentNumber: '215',
    gradeLevel: 6,
    classSection: '6-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.6.1.4',
    outcomeCode: 'MAT.6.1.4',
    outcomeTitle: 'İki Doğal Sayının Ortak Bölenleri ve Ortak Katları',
    prompt: 'Ortak bölen ve ortak kat kavramlarını günlük hayatta nerelerde kullanabileceğimizi fark ettiniz mi?',
    studentReflection: 'Torbalara hiç artmayacak şekilde eşit pirinç ve mercimek paylaştırırken EBOB kullandığımızı, ortak nöbet ve otobüs sefer saatlerinde ise EKOK ile periyodu bulduğumuzu anladım.',
    teacherFeedback: 'Günlük hayat modellemesini somutlaştırman çok değerli Ahmet. Tebrik ederim!',
    teacherLiked: true,
    submittedAt: '2026-09-09T15:10:00Z'
  },
  {
    id: 'jrn-5a-01',
    studentId: 'stu-101',
    studentName: 'Beren Kurt',
    studentNumber: '101',
    gradeLevel: 5,
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.5.3.3',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    prompt: 'Bugün açılar ve iletki kullanımı ile ilgili keşfettiğim en önemli kural:',
    studentReflection: 'Açının kollarını istediğimiz kadar uzatalım açının derecesi kesinlikle değişmiyor çünkü açı iki ışın arasındaki açıklıktır. İletkiyi merkeze oturtup sıfır çizgisini doğru hizalamak çok önemli.',
    teacherFeedback: 'En yaygın kavram yanılgısını mükemmel şekilde aşmışsın Beren!',
    teacherLiked: true,
    submittedAt: '2026-09-08T11:20:00Z'
  },
  {
    id: 'jrn-5a-02',
    studentId: 'stu-102',
    studentName: 'Mehmet Can',
    studentNumber: '108',
    gradeLevel: 5,
    classSection: '5-A',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.5.3.1',
    outcomeCode: 'MAT.5.3.1',
    outcomeTitle: 'Doğru, Doğru Parçası ve Işın ile İlgili Temel Geometrik Çizimler',
    prompt: 'Bugün öğrendiğim en şaşırtıcı geometrik özellik ve çıkarım şuydu:',
    studentReflection: 'Doğru parçasının iki ucunda nokta olduğu için cetvelle boyu ölçülebiliyor, ama ışın bir yönde sonsuza gittiği için boyu ölçülemiyor. Lazer feneri tam bir ışın modeli.',
    submittedAt: '2026-09-08T11:45:00Z'
  },
  {
    id: 'jrn-6b-01',
    studentId: 'stu-612',
    studentName: 'Elif Sena',
    studentNumber: '342',
    gradeLevel: 6,
    classSection: '6-B',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    outcomeId: 'MAT.6.1.2',
    outcomeCode: 'MAT.6.1.2',
    outcomeTitle: 'Bölünebilme Kuralları (2, 3, 4, 5, 6, 9, 10)',
    prompt: '3 ve 9 ile bölünebilme kuralının basamak çözümlemesi ispatı hakkında ne düşünüyorsunuz?',
    studentReflection: '100 sayısının 99 + 1, 1000 sayısının 999 + 1 şeklinde yazılmasıyla 9 ların zaten tam bölündüğü ve geriye sadece rakamlar toplamının kaldığı ispatı beni çok etkiledi.',
    teacherFeedback: 'Ezberlemek yerine mantığını kavramış olman harika Elif!',
    teacherLiked: true,
    submittedAt: '2026-09-09T16:00:00Z'
  }
];

export function getStoredJournalEntries(): LearningJournalEntry[] {
  if (typeof window === 'undefined') {
    return INITIAL_JOURNAL_ENTRIES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_JOURNAL_ENTRIES));
      return INITIAL_JOURNAL_ENTRIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_JOURNAL_ENTRIES;
  } catch (err) {
    console.error('Error loading learning journal entries:', err);
    return INITIAL_JOURNAL_ENTRIES;
  }
}

export function saveJournalEntry(entry: Omit<LearningJournalEntry, 'id' | 'submittedAt'>): LearningJournalEntry {
  const all = getStoredJournalEntries();
  const newEntry: LearningJournalEntry = {
    ...entry,
    id: `jrn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    submittedAt: new Date().toISOString()
  };

  const updated = [newEntry, ...all];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving journal entry to localStorage:', err);
    }
  }
  return newEntry;
}

export function updateTeacherJournalFeedback(entryId: string, feedback: string, liked?: boolean): void {
  const all = getStoredJournalEntries();
  const index = all.findIndex((e) => e.id === entryId);
  if (index !== -1) {
    all[index] = {
      ...all[index],
      teacherFeedback: feedback,
      ...(liked !== undefined ? { teacherLiked: liked } : {})
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      } catch (err) {
        console.error('Error updating journal feedback in localStorage:', err);
      }
    }
  }
}
