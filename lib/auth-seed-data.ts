import { AdminUser, TeacherUser, StudentUser, ClassroomInfo } from '@/types/auth';

export const SEED_CLASSROOMS: ClassroomInfo[] = [];


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
    assignedClasses: [],
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
    assignedClasses: [],
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
    assignedClasses: [],
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
    assignedClasses: [],
    isProfileComplete: true
  }
];

export const SEED_STUDENTS: StudentUser[] = [];
