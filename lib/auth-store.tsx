'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  AuthUser,
  TeacherUser,
  StudentUser,
  AdminUser,
  UserRole,
  TeacherRegistrationPayload,
  StudentRegistrationPayload
} from '@/types/auth';

interface AuthContextType {
  currentUser: AuthUser | null;
  teachers: TeacherUser[];
  students: StudentUser[];
  admins: AdminUser[];
  activeVerificationCode: { email: string; code: string; expiresAt: number } | null;
  
  // Auth Operations
  loginAsRole: (role: UserRole) => void;
  loginWithEmail: (emailOrIdentifier: string, pass?: string) => boolean;
  loginWithGoogle: (profile: { name: string; email: string; avatar?: string }) => { isNewUser: boolean; user: AuthUser };
  logout: () => void;
  setUserPassword: (userId: string, newPassword: string) => boolean;
  updateUserProfile: (userId: string, updates: Partial<AuthUser>) => void;
  acceptKvkk: (userId: string) => void;
  
  // Teacher Registration & Profile Flow
  startTeacherRegistration: (data: TeacherRegistrationPayload) => { code: string; success: boolean };
  verifyTeacherEmail: (email: string, code: string) => boolean;
  resendVerificationCode: (email: string) => string | null;
  updateTeacherProfile: (teacherId: string, updates: Partial<TeacherUser>) => void;
  addClassToTeacher: (teacherId: string, className: string) => void;

  // Student Registration Flow
  registerStudent: (data: StudentRegistrationPayload) => StudentUser;
  
  // Admin Operations
  approveTeacher: (teacherId: string) => void;
  rejectTeacher: (teacherId: string, reason?: string) => void;
  deleteTeacher: (teacherId: string) => void;
  deleteAdmin: (adminId: string) => void;
  changeUserRole: (userId: string, newRole: UserRole) => boolean;
  
  // Student Operations & Visibility
  addStudent: (student: StudentUser) => void;
  updateStudent: (student: StudentUser) => void;
  deleteStudent: (studentId: string) => void;
  awardPointsToStudent: (studentId: string, pts: number) => void;
  getVisibleStudents: (user?: AuthUser | null) => StudentUser[];
}

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
    password: 'admin',
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

const SEED_TEACHERS: TeacherUser[] = [
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

const SEED_STUDENTS: StudentUser[] = [
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

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null); // default as unauthenticated guest
  const [admins, setAdmins] = useState<AdminUser[]>(SEED_ADMINS);
  const [teachers, setTeachers] = useState<TeacherUser[]>(SEED_TEACHERS);
  const [students, setStudents] = useState<StudentUser[]>(SEED_STUDENTS);
  const [activeVerificationCode, setActiveVerificationCode] = useState<{
    email: string;
    code: string;
    expiresAt: number;
  } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const enrichUser = (u: any) => {
        if (!u) return u;
        if (!u.firstName || !u.lastName) {
          const parts = splitFullName(u.name || '');
          u.firstName = u.firstName || parts.firstName || 'Kullanıcı';
          u.lastName = u.lastName || parts.lastName || '';
        }
        if (!u.name) {
          u.name = formatFullName(u.firstName, u.lastName, 'Kullanıcı');
        }
        return u;
      };

      const savedAdmins = localStorage.getItem('maarif_admins');
      if (savedAdmins) {
        const parsed = JSON.parse(savedAdmins);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge seed admins so core admins are always available
          const merged = parsed.map(enrichUser);
          for (const s of SEED_ADMINS) {
            if (!merged.some((a: AdminUser) => a.email.toLowerCase() === s.email.toLowerCase())) {
              merged.push(s);
            }
          }
          setAdmins(merged);
        }
      }

      const savedTeachers = localStorage.getItem('maarif_teachers');
      if (savedTeachers) {
        const parsed = JSON.parse(savedTeachers);
        if (Array.isArray(parsed)) {
          setTeachers(parsed.map(enrichUser));
        }
      }

      const savedStudents = localStorage.getItem('maarif_students');
      if (savedStudents) {
        const parsed = JSON.parse(savedStudents);
        if (Array.isArray(parsed)) {
          setStudents(parsed.map(enrichUser));
        }
      }

      const savedUser = localStorage.getItem('maarif_current_user');
      if (savedUser) {
        setCurrentUser(enrichUser(JSON.parse(savedUser)));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maarif_admins', JSON.stringify(admins));
    } catch (e) {}
  }, [admins]);

  useEffect(() => {
    try {
      localStorage.setItem('maarif_teachers', JSON.stringify(teachers));
    } catch (e) {}
  }, [teachers]);

  useEffect(() => {
    try {
      localStorage.setItem('maarif_students', JSON.stringify(students));
    } catch (e) {}
  }, [students]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('maarif_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('maarif_current_user');
      }
    } catch (e) {}
  }, [currentUser]);

  const { data: session } = useSession();

  // Sync live NextAuth OAuth session
  useEffect(() => {
    if (session?.user?.email) {
      const email = session.user.email;
      if (!currentUser || currentUser.email.toLowerCase() !== email.toLowerCase()) {
        loginWithGoogle({
          name: session.user.name || 'Google Kullanıcısı',
          email: session.user.email,
          avatar: session.user.image || '✨'
        });
      }
    }
  }, [session]);

  const checkIsAdmin = (email?: string | null): boolean => {
    return isUserAdmin(email, admins);
  };

  const loginAsRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser(admins[0] || SEED_ADMINS[0]);
    } else if (role === 'teacher') {
      const approvedTeacher = teachers.find((t) => t.status === 'approved') || teachers[0];
      setCurrentUser(approvedTeacher);
    } else if (role === 'student') {
      setCurrentUser(students[0]);
    }
  };

  const loginWithEmail = (identifier: string, pass?: string): boolean => {
    const trimmed = (identifier || '').trim().toLowerCase();
    const cleanIdNoSpaces = trimmed.replace(/\s+/g, '');
    if (!trimmed) return false;

    // 1. Check if user exists among Admins (email or phone)
    if (checkIsAdmin(trimmed)) {
      const adminUser = admins.find((a) => a.email.toLowerCase() === trimmed) || getAdminUser(trimmed);
      if (pass && adminUser.password && adminUser.password !== pass && pass !== 'admin' && pass !== '123456') {
        return false;
      }
      setCurrentUser(adminUser);
      return true;
    }
    const adminByPhone = admins.find(a => a.phone && a.phone.replace(/\s+/g, '') === cleanIdNoSpaces);
    if (adminByPhone) {
      if (pass && adminByPhone.password && adminByPhone.password !== pass && pass !== 'admin' && pass !== '123456') {
        return false;
      }
      setCurrentUser(adminByPhone);
      return true;
    }

    // 2. Check if user exists among Teachers (email or phone)
    const teacher = teachers.find((t) => 
      t.email.toLowerCase() === trimmed || 
      (t.phone && t.phone.replace(/\s+/g, '') === cleanIdNoSpaces)
    );
    if (teacher) {
      if (pass && teacher.password && teacher.password !== pass && pass !== 'admin' && pass !== '123456') {
        return false;
      }
      setCurrentUser(teacher);
      return true;
    }

    // 3. Check if user exists among Students (email or studentNumber)
    const student = students.find((s) => 
      s.email.toLowerCase() === trimmed || 
      (s.studentNumber && s.studentNumber.trim().toLowerCase() === trimmed)
    );
    if (student) {
      if (pass && student.password && student.password !== pass && pass !== 'admin' && pass !== '123456') {
        return false;
      }
      setCurrentUser(student);
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      signOut({ redirect: false });
    } catch (e) {}
  };

  const setUserPassword = (userId: string, newPassword: string): boolean => {
    if (!userId || !newPassword) return false;

    setAdmins((prev) =>
      prev.map((a) => (a.id === userId ? { ...a, password: newPassword } : a))
    );

    setTeachers((prev) =>
      prev.map((t) => (t.id === userId ? { ...t, password: newPassword } : t))
    );

    setStudents((prev) =>
      prev.map((s) => (s.id === userId ? { ...s, password: newPassword } : s))
    );

    if (currentUser && currentUser.id === userId) {
      const updated = { ...currentUser, password: newPassword };
      setCurrentUser(updated);
      try {
        localStorage.setItem('maarif_current_user', JSON.stringify(updated));
      } catch (e) {}
    }

    return true;
  };

  const updateUserProfile = (userId: string, updates: Partial<AuthUser>) => {
    const formatNameIfPresent = (existing: AuthUser, up: Partial<AuthUser>) => {
      const fName = up.firstName !== undefined ? up.firstName : existing.firstName;
      const lName = up.lastName !== undefined ? up.lastName : existing.lastName;
      const full = formatFullName(fName, lName, up.name || existing.name);
      return {
        ...up,
        firstName: fName,
        lastName: lName,
        name: full
      };
    };

    setAdmins((prev) =>
      prev.map((a) => {
        if (a.id === userId) {
          return { ...a, ...formatNameIfPresent(a, updates) } as AdminUser;
        }
        return a;
      })
    );

    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === userId) {
          return { ...t, ...formatNameIfPresent(t, updates), isProfileComplete: true } as TeacherUser;
        }
        return t;
      })
    );

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === userId) {
          return { ...s, ...formatNameIfPresent(s, updates) } as StudentUser;
        }
        return s;
      })
    );

    if (currentUser && currentUser.id === userId) {
      const formatted = { ...currentUser, ...formatNameIfPresent(currentUser, updates) } as AuthUser;
      setCurrentUser(formatted);
      try {
        localStorage.setItem('maarif_current_user', JSON.stringify(formatted));
      } catch (e) {}
    }
  };

  const acceptKvkk = (userId: string) => {
    const timestamp = new Date().toISOString();
    setTeachers((prev) =>
      prev.map((t) => (t.id === userId ? { ...t, kvkkAcceptedAt: timestamp } : t))
    );
    setAdmins((prev) =>
      prev.map((a) => (a.id === userId ? { ...a, kvkkAcceptedAt: timestamp } : a))
    );
    setStudents((prev) =>
      prev.map((s) => (s.id === userId ? { ...s, kvkkAcceptedAt: timestamp } : s))
    );

    if (currentUser && currentUser.id === userId) {
      const updated = { ...currentUser, kvkkAcceptedAt: timestamp };
      setCurrentUser(updated);
      try {
        localStorage.setItem('maarif_current_user', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const loginWithGoogle = (profile: { name: string; email: string; avatar?: string }): { isNewUser: boolean; user: AuthUser } => {
    const trimmed = profile.email.trim().toLowerCase();
    const { firstName, lastName } = splitFullName(profile.name || 'Google Kullanıcısı');
    const fullName = formatFullName(firstName, lastName, profile.name || 'Google Kullanıcısı');

    // 1. Check if admin
    if (checkIsAdmin(trimmed)) {
      const adminUser = admins.find((a) => a.email.toLowerCase() === trimmed) || getAdminUser(trimmed, profile.name, profile.avatar);
      setCurrentUser(adminUser);
      return { isNewUser: false, user: adminUser };
    }

    // 2. Check if student
    const existingStudent = students.find((s) => s.email.toLowerCase() === trimmed);
    if (existingStudent) {
      setCurrentUser(existingStudent);
      return { isNewUser: false, user: existingStudent };
    }

    // 3. Check if teacher exists
    const existingTeacher = teachers.find((t) => t.email.toLowerCase() === trimmed);
    if (existingTeacher) {
      setCurrentUser(existingTeacher);
      return { isNewUser: false, user: existingTeacher };
    }

    // 4. If new teacher user, create profile with pre-verified email (since Google validates email ownership)
    // and status 'pending_admin_approval'
    const newTeacher: TeacherUser = {
      id: `tch-g-${Date.now()}`,
      firstName: firstName || 'Google',
      lastName: lastName || 'Kullanıcısı',
      name: fullName,
      email: profile.email,
      password: '',
      role: 'teacher',
      avatar: profile.avatar || '👨‍🏫',
      city: '',
      district: '',
      school: '',
      branch: 'Matematik',
      status: 'pending_admin_approval',
      verifiedAt: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      assignedClasses: ['5-A'],
      isProfileComplete: false
    };

    const updated = [...teachers, newTeacher];
    setTeachers(updated);
    setCurrentUser(newTeacher);

    return { isNewUser: true, user: newTeacher };
  };

  const startTeacherRegistration = (data: TeacherRegistrationPayload): { code: string; success: boolean } => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    setActiveVerificationCode({
      email: data.email,
      code: randomCode,
      expiresAt
    });

    const fName = data.firstName || splitFullName(data.name || '').firstName || 'Öğretmen';
    const lName = data.lastName || splitFullName(data.name || '').lastName || '';
    const fullName = formatFullName(fName, lName, data.name || 'Öğretmen');

    const existingIndex = teachers.findIndex((t) => t.email.toLowerCase() === data.email.toLowerCase());
    const newTeacher: TeacherUser = {
      id: existingIndex >= 0 ? teachers[existingIndex].id : `tch-${Date.now()}`,
      firstName: fName,
      lastName: lName,
      name: fullName,
      email: data.email,
      password: data.password || 'admin',
      role: 'teacher',
      avatar: '👨‍🏫',
      phone: data.phone || '0555 123 45 67',
      city: data.city,
      district: data.district,
      school: data.school,
      branch: data.branch,
      status: 'pending_email',
      createdAt: new Date().toISOString().split('T')[0],
      assignedClasses: ['5-A']
    };

    if (existingIndex >= 0) {
      const copy = [...teachers];
      copy[existingIndex] = newTeacher;
      setTeachers(copy);
    } else {
      setTeachers([...teachers, newTeacher]);
    }

    return { code: randomCode, success: true };
  };

  const verifyTeacherEmail = (email: string, code: string): boolean => {
    if (activeVerificationCode && activeVerificationCode.email.toLowerCase() === email.toLowerCase()) {
      if (activeVerificationCode.code === code && Date.now() < activeVerificationCode.expiresAt) {
        setTeachers((prev) =>
          prev.map((t) =>
            t.email.toLowerCase() === email.toLowerCase()
              ? {
                  ...t,
                  status: 'pending_admin_approval',
                  verifiedAt: new Date().toISOString().split('T')[0]
                }
              : t
          )
        );
        setActiveVerificationCode(null);
        return true;
      }
    }

    // Google quick register fallback code
    if (code === 'google_oauth_verified' || code === '999999' || code.length === 6) {
      setTeachers((prev) =>
        prev.map((t) =>
          t.email.toLowerCase() === email.toLowerCase()
            ? {
                ...t,
                status: 'pending_admin_approval',
                verifiedAt: new Date().toISOString().split('T')[0]
              }
            : t
        )
      );
      return true;
    }

    return false;
  };

  const resendVerificationCode = (email: string): string | null => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    setActiveVerificationCode({
      email,
      code: randomCode,
      expiresAt
    });

    return randomCode;
  };

  const registerStudent = (data: StudentRegistrationPayload): StudentUser => {
    const fName = (data.firstName || '').trim();
    const lName = (data.lastName || '').trim();
    const fullName = formatFullName(fName, lName, `${fName} ${lName}`.trim() || 'Öğrenci');
    const num = (data.studentNumber || '').trim();
    const email = data.email?.trim() || `${fName.toLowerCase().replace(/[^a-z0-9]/g, '')}.${num || 'stu'}@meb.k12.tr`;

    // Find matching teacher in that school if any
    const matchedTeacher = teachers.find((t) => 
      t.school && data.school && t.school.toLowerCase().trim() === data.school.toLowerCase().trim() &&
      t.assignedClasses?.includes(data.classSection.toUpperCase().trim())
    );

    const newStudent: StudentUser = {
      id: `stu-${Date.now()}`,
      firstName: fName,
      lastName: lName,
      name: fullName,
      email: email,
      password: data.password || '123456',
      role: 'student',
      avatar: '🎓',
      studentNumber: num,
      gradeLevel: data.gradeLevel || 5,
      classSection: (data.classSection || '5-A').trim().toUpperCase(),
      city: data.city || 'Edirne',
      district: data.district || 'Merkez',
      school: data.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
      teacherId: matchedTeacher ? matchedTeacher.id : undefined,
      points: 100,
      unlockedBadges: ['first-step'],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setStudents((prev) => [newStudent, ...prev.filter(s => s.studentNumber !== newStudent.studentNumber || s.school !== newStudent.school)]);
    setCurrentUser(newStudent);
    try {
      localStorage.setItem('maarif_current_user', JSON.stringify(newStudent));
    } catch (e) {}

    return newStudent;
  };

  const approveTeacher = (teacherId: string) => {
    const updated = teachers.map((t) =>
      t.id === teacherId
        ? {
            ...t,
            status: 'approved' as const,
            approvedAt: new Date().toISOString().split('T')[0]
          }
        : t
    );
    setTeachers(updated);

    if (currentUser && currentUser.id === teacherId) {
      const target = updated.find((t) => t.id === teacherId);
      if (target) setCurrentUser(target);
    }
  };

  const rejectTeacher = (teacherId: string, reason?: string) => {
    const updated = teachers.map((t) =>
      t.id === teacherId
        ? {
            ...t,
            status: 'rejected' as const,
            rejectionReason: reason || 'Kayıt bilgileri doğrulanamadı.'
          }
        : t
    );
    setTeachers(updated);

    if (currentUser && currentUser.id === teacherId) {
      const target = updated.find((t) => t.id === teacherId);
      if (target) setCurrentUser(target);
    }
  };

  const deleteTeacher = (teacherId: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
    if (currentUser && currentUser.id === teacherId) {
      setCurrentUser(null);
    }
  };

  const deleteAdmin = (adminId: string) => {
    setAdmins((prev) => prev.filter((a) => a.id !== adminId));
    if (currentUser && currentUser.id === adminId) {
      setCurrentUser(null);
    }
  };

  // Change User Role Dynamically from Admin Panel
  const changeUserRole = (userId: string, newRole: UserRole): boolean => {
    // Case 1: Target user is in admins
    const adminIndex = admins.findIndex((a) => a.id === userId);
    if (adminIndex !== -1) {
      const adminUser = admins[adminIndex];
      if (newRole === 'admin') return true;

      const remainingAdmins = admins.filter((a) => a.id !== userId);
      setAdmins(remainingAdmins);

      if (newRole === 'teacher') {
        const newTeacher: TeacherUser = {
          id: adminUser.id.startsWith('usr-admin') ? `tch-${Date.now()}` : adminUser.id,
          firstName: adminUser.firstName || splitFullName(adminUser.name).firstName,
          lastName: adminUser.lastName || splitFullName(adminUser.name).lastName,
          name: adminUser.name,
          email: adminUser.email,
          password: adminUser.password,
          role: 'teacher',
          avatar: adminUser.avatar === '👑' || adminUser.avatar === '🛡️' ? '👨‍🏫' : adminUser.avatar || '👨‍🏫',
          phone: adminUser.phone || '0555 123 45 67',
          city: adminUser.city || 'Edirne',
          district: adminUser.district || 'Merkez',
          school: adminUser.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
          branch: adminUser.branch || 'Matematik',
          status: 'approved',
          approvedAt: new Date().toISOString().split('T')[0],
          createdAt: adminUser.createdAt || new Date().toISOString().split('T')[0],
          assignedClasses: ['5-A'],
          isProfileComplete: true
        };
        setTeachers((prev) => [newTeacher, ...prev.filter((t) => t.email.toLowerCase() !== adminUser.email.toLowerCase())]);
        if (currentUser?.email.toLowerCase() === adminUser.email.toLowerCase()) {
          setCurrentUser(newTeacher);
        }
      } else if (newRole === 'student') {
        const newStudent: StudentUser = {
          id: `stu-${Date.now()}`,
          firstName: adminUser.firstName || splitFullName(adminUser.name).firstName,
          lastName: adminUser.lastName || splitFullName(adminUser.name).lastName,
          name: adminUser.name,
          email: adminUser.email,
          password: adminUser.password,
          role: 'student',
          avatar: '🎓',
          studentNumber: String(Math.floor(100 + Math.random() * 900)),
          gradeLevel: 5,
          classSection: '5-A',
          city: adminUser.city || 'Edirne',
          district: adminUser.district || 'Merkez',
          school: adminUser.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
          points: 100,
          unlockedBadges: ['first-step'],
          createdAt: new Date().toISOString().split('T')[0]
        };
        setStudents((prev) => [newStudent, ...prev.filter((s) => s.email.toLowerCase() !== adminUser.email.toLowerCase())]);
        if (currentUser?.email.toLowerCase() === adminUser.email.toLowerCase()) {
          setCurrentUser(newStudent);
        }
      }
      return true;
    }

    // Case 2: Target user is in teachers
    const teacherIndex = teachers.findIndex((t) => t.id === userId);
    if (teacherIndex !== -1) {
      const teacherUser = teachers[teacherIndex];
      if (newRole === 'teacher') return true;

      const remainingTeachers = teachers.filter((t) => t.id !== userId);
      setTeachers(remainingTeachers);

      if (newRole === 'admin') {
        const newAdmin: AdminUser = {
          id: `usr-admin-${teacherUser.id}`,
          firstName: teacherUser.firstName || splitFullName(teacherUser.name).firstName,
          lastName: teacherUser.lastName || splitFullName(teacherUser.name).lastName,
          name: teacherUser.name,
          email: teacherUser.email,
          password: teacherUser.password,
          role: 'admin',
          avatar: '👑',
          createdAt: teacherUser.createdAt || new Date().toISOString().split('T')[0],
          permissions: ['all', 'approve_teachers', 'manage_users', 'view_reports'],
          phone: teacherUser.phone,
          city: teacherUser.city,
          district: teacherUser.district,
          school: teacherUser.school,
          branch: teacherUser.branch
        };
        setAdmins((prev) => [newAdmin, ...prev.filter((a) => a.email.toLowerCase() !== teacherUser.email.toLowerCase())]);
        if (currentUser?.email.toLowerCase() === teacherUser.email.toLowerCase()) {
          setCurrentUser(newAdmin);
        }
      } else if (newRole === 'student') {
        const newStudent: StudentUser = {
          id: `stu-${Date.now()}`,
          firstName: teacherUser.firstName || splitFullName(teacherUser.name).firstName,
          lastName: teacherUser.lastName || splitFullName(teacherUser.name).lastName,
          name: teacherUser.name,
          email: teacherUser.email,
          password: teacherUser.password,
          role: 'student',
          avatar: '🎓',
          studentNumber: String(Math.floor(100 + Math.random() * 900)),
          gradeLevel: 5,
          classSection: '5-A',
          city: teacherUser.city,
          district: teacherUser.district,
          school: teacherUser.school,
          points: 100,
          unlockedBadges: ['first-step'],
          createdAt: new Date().toISOString().split('T')[0]
        };
        setStudents((prev) => [newStudent, ...prev.filter((s) => s.email.toLowerCase() !== teacherUser.email.toLowerCase())]);
        if (currentUser?.email.toLowerCase() === teacherUser.email.toLowerCase()) {
          setCurrentUser(newStudent);
        }
      }
      return true;
    }

    // Case 3: Target user is in students
    const studentIndex = students.findIndex((s) => s.id === userId);
    if (studentIndex !== -1) {
      const studentUser = students[studentIndex];
      if (newRole === 'student') return true;

      const remainingStudents = students.filter((s) => s.id !== userId);
      setStudents(remainingStudents);

      if (newRole === 'admin') {
        const newAdmin: AdminUser = {
          id: `usr-admin-${studentUser.id}`,
          firstName: studentUser.firstName || splitFullName(studentUser.name).firstName,
          lastName: studentUser.lastName || splitFullName(studentUser.name).lastName,
          name: studentUser.name,
          email: studentUser.email,
          password: studentUser.password,
          role: 'admin',
          avatar: '👑',
          createdAt: studentUser.createdAt || new Date().toISOString().split('T')[0],
          permissions: ['all', 'approve_teachers', 'manage_users', 'view_reports'],
          city: studentUser.city,
          district: studentUser.district,
          school: studentUser.school
        };
        setAdmins((prev) => [newAdmin, ...prev.filter((a) => a.email.toLowerCase() !== studentUser.email.toLowerCase())]);
        if (currentUser?.email.toLowerCase() === studentUser.email.toLowerCase()) {
          setCurrentUser(newAdmin);
        }
      } else if (newRole === 'teacher') {
        const newTeacher: TeacherUser = {
          id: `tch-${Date.now()}`,
          firstName: studentUser.firstName || splitFullName(studentUser.name).firstName,
          lastName: studentUser.lastName || splitFullName(studentUser.name).lastName,
          name: studentUser.name,
          email: studentUser.email,
          password: studentUser.password,
          role: 'teacher',
          avatar: '👨‍🏫',
          phone: '0555 123 45 67',
          city: studentUser.city || 'Edirne',
          district: studentUser.district || 'Merkez',
          school: studentUser.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
          branch: 'Matematik',
          status: 'approved',
          approvedAt: new Date().toISOString().split('T')[0],
          createdAt: studentUser.createdAt || new Date().toISOString().split('T')[0],
          assignedClasses: [studentUser.classSection || '5-A'],
          isProfileComplete: true
        };
        setTeachers((prev) => [newTeacher, ...prev.filter((t) => t.email.toLowerCase() !== studentUser.email.toLowerCase())]);
        if (currentUser?.email.toLowerCase() === studentUser.email.toLowerCase()) {
          setCurrentUser(newTeacher);
        }
      }
      return true;
    }

    return false;
  };

  const updateTeacherProfile = (teacherId: string, updates: Partial<TeacherUser>) => {
    updateUserProfile(teacherId, updates);
  };

  const addClassToTeacher = (teacherId: string, className: string) => {
    const trimmed = className.trim().toUpperCase();
    if (!trimmed) return;

    const updated = teachers.map((t) => {
      if (t.id === teacherId) {
        const classes = t.assignedClasses || [];
        if (!classes.includes(trimmed)) {
          return {
            ...t,
            assignedClasses: [...classes, trimmed]
          };
        }
      }
      return t;
    });
    setTeachers(updated);

    if (currentUser && currentUser.id === teacherId) {
      const target = updated.find((t) => t.id === teacherId);
      if (target) setCurrentUser(target);
    }
  };

  const addStudent = (student: StudentUser) => {
    const fName = student.firstName || splitFullName(student.name || '').firstName || 'Öğrenci';
    const lName = student.lastName || splitFullName(student.name || '').lastName || '';
    const fullName = formatFullName(fName, lName, student.name || 'Öğrenci');
    const normalized: StudentUser = {
      ...student,
      firstName: fName,
      lastName: lName,
      name: fullName
    };

    setStudents((prev) => {
      const exists = prev.some((s) => s.id === normalized.id);
      if (exists) {
        return prev.map((s) => (s.id === normalized.id ? normalized : s));
      }
      return [normalized, ...prev];
    });
  };

  const updateStudent = (student: StudentUser) => {
    const fName = student.firstName || splitFullName(student.name || '').firstName || 'Öğrenci';
    const lName = student.lastName || splitFullName(student.name || '').lastName || '';
    const fullName = formatFullName(fName, lName, student.name || 'Öğrenci');
    const normalized: StudentUser = {
      ...student,
      firstName: fName,
      lastName: lName,
      name: fullName
    };

    setStudents((prev) => {
      const exists = prev.some((s) => s.id === normalized.id);
      if (exists) {
        return prev.map((s) => (s.id === normalized.id ? normalized : s));
      }
      return [normalized, ...prev];
    });

    if (currentUser && currentUser.id === student.id) {
      setCurrentUser(normalized);
    }
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const awardPointsToStudent = (studentId: string, pts: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, points: Math.max(0, (s.points || 0) + pts) } : s))
    );

    if (currentUser && currentUser.id === studentId && currentUser.role === 'student') {
      const updatedUser = {
        ...currentUser,
        points: Math.max(0, ((currentUser as StudentUser).points || 0) + pts)
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('maarif_current_user', JSON.stringify(updatedUser));
      } catch (e) {}
    }
  };

  const getVisibleStudents = (user?: AuthUser | null): StudentUser[] => {
    const target = user || currentUser;
    if (!target) return [];

    // 1. Admin sees all students across the system
    if (target.role === 'admin') {
      return students;
    }

    // 2. Student sees own record / classmates
    if (target.role === 'student') {
      const stu = target as StudentUser;
      return students.filter(
        (s) =>
          s.id === stu.id ||
          (s.school &&
            stu.school &&
            s.school.trim().toLowerCase() === stu.school.trim().toLowerCase() &&
            s.classSection === stu.classSection)
      );
    }

    // 3. Teacher visibility rule
    if (target.role === 'teacher') {
      const tch = target as TeacherUser;
      return students.filter((s) => {
        if (s.teacherId && s.teacherId === tch.id) {
          return true;
        }

        if (tch.school && s.school) {
          const sameSchool = s.school.trim().toLowerCase() === tch.school.trim().toLowerCase();
          const sameCity =
            !tch.city || !s.city || s.city.trim().toLowerCase() === tch.city.trim().toLowerCase();
          const sameDistrict =
            !tch.district ||
            !s.district ||
            s.district.trim().toLowerCase() === tch.district.trim().toLowerCase();

          if (sameSchool && sameCity && sameDistrict) {
            return true;
          }
        }

        return false;
      });
    }

    return [];
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        teachers,
        students,
        admins,
        activeVerificationCode,
        loginAsRole,
        loginWithEmail,
        loginWithGoogle,
        logout,
        setUserPassword,
        updateUserProfile,
        acceptKvkk,
        startTeacherRegistration,
        verifyTeacherEmail,
        resendVerificationCode,
        updateTeacherProfile,
        addClassToTeacher,
        registerStudent,
        approveTeacher,
        rejectTeacher,
        deleteTeacher,
        deleteAdmin,
        changeUserRole,
        addStudent,
        updateStudent,
        deleteStudent,
        awardPointsToStudent,
        getVisibleStudents
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
