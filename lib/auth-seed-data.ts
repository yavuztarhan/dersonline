import { AdminUser, TeacherUser, StudentUser } from '@/types/auth';

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const clean = (fullName || '').trim().replace(/\s+/g, ' ');
  if (!clean) return { firstName: '', lastName: '' };
  const parts = clean.split(' ');
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  const lastName = parts.pop() || '';
  const firstName = parts.join(' ');
  return { firstName, lastName };
}

export function formatFullName(firstName?: string, lastName?: string, fallback = ''): string {
  const f = (firstName || '').trim();
  const l = (lastName || '').trim();
  if (f && l) return `${f} ${l}`;
  if (f) return f;
  if (l) return l;
  return fallback;
}

export const ADMIN_EMAILS = [
  'powerose@gmail.com',
  'maarifakademi.com.tr@gmail.com',
  'viziteci325@gmail.com'
];

export const SEED_ADMINS: AdminUser[] = [
  {
    id: 'usr-admin-powerose',
    firstName: 'Sistem Yöneticisi',
    lastName: 'Powerose',
    name: 'Sistem Yöneticisi Powerose',
    email: 'powerose@gmail.com',
    password: 'Admin1234',
    role: 'admin',
    avatar: '👑',
    createdAt: '2026-09-08',
    permissions: ['all', 'approve_teachers', 'manage_users', 'view_reports']
  },
  {
    id: 'usr-admin-maarifakademi',
    firstName: 'Maarif Akademi',
    lastName: 'Yönetim',
    name: 'Maarif Akademi Yönetim',
    email: 'maarifakademi.com.tr@gmail.com',
    password: 'admin',
    role: 'admin',
    avatar: '👑',
    createdAt: '2026-09-08',
    permissions: ['all', 'approve_teachers', 'manage_users', 'view_reports']
  },
  {
    id: 'usr-admin-viziteci',
    firstName: 'Sistem Yöneticisi',
    lastName: 'Viziteci',
    name: 'Sistem Yöneticisi Viziteci',
    email: 'viziteci325@gmail.com',
    password: 'admin',
    role: 'admin',
    avatar: '👑',
    createdAt: '2026-09-08',
    permissions: ['all', 'approve_teachers', 'manage_users', 'view_reports']
  }
];

export const isUserAdmin = (email?: string | null, customAdmins: AdminUser[] = []): boolean => {
  if (!email) return false;
  const trimmed = email.trim().toLowerCase();
  if (ADMIN_EMAILS.some((e) => e.toLowerCase() === trimmed)) return true;
  return customAdmins.some((a) => a.email.toLowerCase() === trimmed);
};

export const getAdminUser = (email: string, name?: string, avatar?: string): AdminUser => {
  const trimmed = email.trim().toLowerCase();
  const seed = SEED_ADMINS.find((a) => a.email.toLowerCase() === trimmed);
  if (seed) return seed;

  const { firstName, lastName } = splitFullName(name || 'Sistem Yöneticisi');

  return {
    id: `usr-admin-${trimmed.replace(/[^a-z0-9]/g, '_')}`,
    firstName: firstName || 'Sistem',
    lastName: lastName || 'Yöneticisi',
    name: formatFullName(firstName, lastName, name || 'Sistem Yöneticisi'),
    email: trimmed,
    password: 'admin',
    role: 'admin',
    avatar: avatar || '👑',
    createdAt: '2026-09-08',
    permissions: ['all', 'approve_teachers', 'manage_users', 'view_reports']
  };
};

export const SEED_TEACHERS: TeacherUser[] = [
  {
    id: 'tch-101',
    firstName: 'Mimar Sinan & Hasan',
    lastName: 'Hoca',
    name: 'Mimar Sinan & Hasan Hoca',
    email: 'ahmet.ogretmen@meb.k12.tr',
    password: 'admin',
    role: 'teacher',
    avatar: '👨‍🏫',
    phone: '0555 123 45 67',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    branch: 'Matematik',
    principalName: 'Mehmet GÜNGÖR',
    status: 'approved',
    createdAt: '2026-09-02',
    approvedAt: '2026-09-02',
    assignedClasses: ['5-A', '5-B'],
    isProfileComplete: true
  },
  {
    id: 'tch-102',
    firstName: 'Zeynep',
    lastName: 'Kaya',
    name: 'Zeynep Kaya',
    email: 'zeynep.kaya@meb.k12.tr',
    password: 'admin',
    role: 'teacher',
    avatar: '👩‍🏫',
    phone: '0532 987 65 43',
    city: 'İstanbul',
    district: 'Kadıköy',
    school: 'Kadıköy Melahat Şefizade Ortaokulu',
    branch: 'Matematik',
    principalName: 'Mehmet GÜNGÖR',
    status: 'pending_admin_approval',
    createdAt: '2026-09-06',
    verifiedAt: '2026-09-06',
    assignedClasses: ['5-C'],
    isProfileComplete: true
  },
  {
    id: 'tch-103',
    firstName: 'Mehmet',
    lastName: 'Şahin',
    name: 'Mehmet Şahin',
    email: 'mehmet.sahin@meb.k12.tr',
    password: 'admin',
    role: 'teacher',
    avatar: '👨‍🏫',
    phone: '0544 321 00 11',
    city: 'Ankara',
    district: 'Çankaya',
    school: 'Çankaya Ortaokulu',
    branch: 'Matematik',
    principalName: 'Mehmet GÜNGÖR',
    status: 'pending_admin_approval',
    createdAt: '2026-09-07',
    verifiedAt: '2026-09-07',
    assignedClasses: ['5-A'],
    isProfileComplete: true
  },
  {
    id: 'tch-104',
    firstName: 'Ayşe',
    lastName: 'Demir',
    name: 'Ayşe Demir (Fen Öğretmeni)',
    email: 'ayse.fen@meb.k12.tr',
    password: 'admin',
    role: 'teacher',
    avatar: '🔬',
    phone: '0533 111 22 33',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    branch: 'Fen Bilimleri',
    principalName: 'Mehmet GÜNGÖR',
    status: 'approved',
    createdAt: '2026-09-08',
    approvedAt: '2026-09-08',
    assignedClasses: ['5-A'],
    isProfileComplete: true
  }
];

export const SEED_STUDENTS: StudentUser[] = [
  // 5-A Sınıfı
  {
    id: 'stu-201',
    firstName: 'Çırak',
    lastName: 'Hasan',
    name: 'Çırak Hasan',
    email: 'hasan.ogrenci@meb.k12.tr',
    password: 'admin',
    role: 'student',
    avatar: '🎓',
    studentNumber: '104',
    gradeLevel: 5,
    classSection: '5-A',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-101',
    points: 620,
    unlockedBadges: ['first-step', 'geometry-master', 'maarif-genius', 'hafiza_ustasi', 'puzzle-pro'],
    createdAt: '2026-09-03'
  },
  {
    id: 'stu-202',
    firstName: 'Elif',
    lastName: 'Çelik',
    name: 'Elif Çelik',
    email: 'elif.ogrenci@meb.k12.tr',
    password: 'admin',
    role: 'student',
    avatar: '👩‍🎓',
    studentNumber: '215',
    gradeLevel: 5,
    classSection: '5-A',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-101',
    points: 540,
    unlockedBadges: ['first-step', 'puzzle-pro', 'geometry-master'],
    createdAt: '2026-09-03'
  },
  {
    id: 'stu-204',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    name: 'Ahmet Yılmaz',
    email: 'ahmet.ogrenci@meb.k12.tr',
    password: 'admin',
    role: 'student',
    avatar: '🧑‍🎓',
    studentNumber: '108',
    gradeLevel: 5,
    classSection: '5-A',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-101',
    points: 430,
    unlockedBadges: ['first-step', 'puzzle-pro'],
    createdAt: '2026-09-03'
  },
  {
    id: 'stu-205',
    firstName: 'Zeynep',
    lastName: 'Kaya',
    name: 'Zeynep Kaya',
    email: 'zeynep.ogrenci@meb.k12.tr',
    password: 'admin',
    role: 'student',
    avatar: '👩‍🎓',
    studentNumber: '312',
    gradeLevel: 5,
    classSection: '5-A',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-101',
    points: 360,
    unlockedBadges: ['first-step'],
    createdAt: '2026-09-04'
  },
  {
    id: 'stu-206',
    firstName: 'Ömer Faruk',
    lastName: 'Demir',
    name: 'Ömer Faruk Demir',
    email: 'omer.ogrenci@meb.k12.tr',
    password: 'admin',
    role: 'student',
    avatar: '👨‍🎓',
    studentNumber: '177',
    gradeLevel: 5,
    classSection: '5-A',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-101',
    points: 280,
    unlockedBadges: ['first-step'],
    createdAt: '2026-09-05'
  },

  // 5-B Sınıfı
  {
    id: 'stu-203',
    firstName: 'Burak',
    lastName: 'Polat',
    name: 'Burak Polat',
    email: 'burak.ogrenci@meb.k12.tr',
    password: 'admin',
    role: 'student',
    avatar: '🎓',
    studentNumber: '142',
    gradeLevel: 5,
    classSection: '5-B',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-101',
    points: 580,
    unlockedBadges: ['first-step', 'geometry-master', 'puzzle-pro'],
    createdAt: '2026-09-04'
  },
  {
    id: 'stu-207',
    firstName: 'Meryem',
    lastName: 'Şen',
    name: 'Meryem Şen',
    email: 'meryem.ogrenci@meb.k12.tr',
    password: 'admin',
    role: 'student',
    avatar: '👩‍🎓',
    studentNumber: '254',
    gradeLevel: 5,
    classSection: '5-B',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-101',
    points: 490,
    unlockedBadges: ['first-step', 'hafiza_ustasi'],
    createdAt: '2026-09-04'
  },
  {
    id: 'stu-208',
    firstName: 'Emir Arda',
    lastName: 'Öztürk',
    name: 'Emir Arda Öztürk',
    email: 'emir.ogrenci@meb.k12.tr',
    password: 'admin',
    role: 'student',
    avatar: '🧑‍🎓',
    studentNumber: '189',
    gradeLevel: 5,
    classSection: '5-B',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-101',
    points: 390,
    unlockedBadges: ['first-step'],
    createdAt: '2026-09-05'
  },

  // 5-C Sınıfı
  {
    id: 'stu-209',
    firstName: 'Selin',
    lastName: 'Koç',
    name: 'Selin Koç',
    email: 'selin.ogrenci@meb.k12.tr',
    password: 'admin',
    role: 'student',
    avatar: '👩‍🎓',
    studentNumber: '305',
    gradeLevel: 5,
    classSection: '5-C',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-102',
    points: 510,
    unlockedBadges: ['first-step', 'puzzle-pro'],
    createdAt: '2026-09-03'
  },
  {
    id: 'stu-210',
    firstName: 'Kaan',
    lastName: 'Aydın',
    name: 'Kaan Aydın',
    email: 'kaan.ogrenci@meb.k12.tr',
    password: 'admin',
    role: 'student',
    avatar: '👨‍🎓',
    studentNumber: '411',
    gradeLevel: 5,
    classSection: '5-C',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-102',
    points: 440,
    unlockedBadges: ['first-step'],
    createdAt: '2026-09-04'
  },

  // 5-D Sınıfı
  {
    id: 'stu-211',
    firstName: 'Defne',
    lastName: 'Erdem',
    name: 'Defne Erdem',
    email: 'defne.ogrenci@meb.k12.tr',
    password: 'admin',
    role: 'student',
    avatar: '👩‍🎓',
    studentNumber: '502',
    gradeLevel: 5,
    classSection: '5-D',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-101',
    points: 570,
    unlockedBadges: ['first-step', 'geometry-master'],
    createdAt: '2026-09-04'
  },
  {
    id: 'stu-212',
    firstName: 'Yusuf Kerem',
    lastName: 'Aksoy',
    name: 'Yusuf Kerem Aksoy',
    email: 'yusuf.ogrenci@meb.k12.tr',
    password: 'admin',
    role: 'student',
    avatar: '🧑‍🎓',
    studentNumber: '534',
    gradeLevel: 5,
    classSection: '5-D',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-101',
    points: 460,
    unlockedBadges: ['first-step', 'puzzle-pro'],
    createdAt: '2026-09-05'
  }
];
