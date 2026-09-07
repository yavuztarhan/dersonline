'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  AuthUser,
  TeacherUser,
  StudentUser,
  AdminUser,
  UserRole,
  TeacherRegistrationPayload
} from '@/types/auth';

interface AuthContextType {
  currentUser: AuthUser | null;
  teachers: TeacherUser[];
  students: StudentUser[];
  activeVerificationCode: { email: string; code: string; expiresAt: number } | null;
  
  // Auth Operations
  loginAsRole: (role: UserRole) => void;
  loginWithEmail: (email: string, pass?: string) => boolean;
  loginWithGoogle: (profile: { name: string; email: string; avatar?: string }) => { isNewUser: boolean; user: AuthUser };
  logout: () => void;
  
  // Teacher Registration & Profile Flow
  startTeacherRegistration: (data: TeacherRegistrationPayload) => { code: string; success: boolean };
  verifyTeacherEmail: (email: string, code: string) => boolean;
  resendVerificationCode: (email: string) => string | null;
  updateTeacherProfile: (teacherId: string, updates: Partial<TeacherUser>) => void;
  addClassToTeacher: (teacherId: string, className: string) => void;
  
  // Admin Operations
  approveTeacher: (teacherId: string) => void;
  rejectTeacher: (teacherId: string, reason?: string) => void;
  deleteTeacher: (teacherId: string) => void;
  
  // Student Operations & Visibility
  addStudent: (student: StudentUser) => void;
  updateStudent: (student: StudentUser) => void;
  deleteStudent: (studentId: string) => void;
  getVisibleStudents: (user?: AuthUser | null) => StudentUser[];
}

export const ADMIN_EMAILS = [
  'admin@maarif.gov.tr',
  'powerose@gmail.com',
  'maarifakademi.com.tr@gmail.com',
  'viziteci325@gmail.com'
];

const SEED_ADMIN: AdminUser = {
  id: 'usr-admin-1',
  name: 'Maarif Sistem Yöneticisi',
  email: 'admin@maarif.gov.tr',
  role: 'admin',
  avatar: '🛡️',
  createdAt: '2026-09-01',
  permissions: ['all', 'approve_teachers', 'manage_users', 'view_reports']
};

export const isUserAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const trimmed = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((e) => e.toLowerCase() === trimmed);
};

export const getAdminUser = (email: string, name?: string, avatar?: string): AdminUser => {
  const trimmed = email.trim().toLowerCase();
  if (trimmed === 'admin@maarif.gov.tr') {
    return SEED_ADMIN;
  }
  return {
    id: `usr-admin-${trimmed.replace(/[^a-z0-9]/g, '_')}`,
    name: name || (trimmed.startsWith('powerose') ? 'Sistem Yöneticisi (Powerose)' : trimmed.startsWith('maarifakademi') ? 'Maarif Akademi Yönetim' : 'Sistem Yöneticisi'),
    email: trimmed,
    role: 'admin',
    avatar: avatar || '🛡️',
    createdAt: '2026-09-08',
    permissions: ['all', 'approve_teachers', 'manage_users', 'view_reports']
  };
};

const SEED_TEACHERS: TeacherUser[] = [
  {
    id: 'tch-101',
    name: 'Mimar Sinan & Hasan Hoca',
    email: 'ahmet.ogretmen@meb.k12.tr',
    role: 'teacher',
    avatar: '👨‍🏫',
    phone: '0555 123 45 67',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    branch: 'Matematik',
    status: 'approved',
    createdAt: '2026-09-02',
    approvedAt: '2026-09-02',
    assignedClasses: ['5-A', '5-B']
  },
  {
    id: 'tch-102',
    name: 'Zeynep Kaya',
    email: 'zeynep.kaya@meb.k12.tr',
    role: 'teacher',
    avatar: '👩‍🏫',
    phone: '0532 987 65 43',
    city: 'İstanbul',
    district: 'Kadıköy',
    school: 'Kadıköy Melahat Şefizade Ortaokulu',
    branch: 'Matematik',
    status: 'pending_admin_approval',
    createdAt: '2026-09-06',
    verifiedAt: '2026-09-06',
    assignedClasses: ['5-C']
  },
  {
    id: 'tch-103',
    name: 'Mehmet Şahin',
    email: 'mehmet.sahin@meb.k12.tr',
    role: 'teacher',
    avatar: '👨‍🏫',
    phone: '0544 321 00 11',
    city: 'Ankara',
    district: 'Çankaya',
    school: 'Çankaya Ortaokulu',
    branch: 'Matematik',
    status: 'pending_admin_approval',
    createdAt: '2026-09-07',
    verifiedAt: '2026-09-07',
    assignedClasses: ['5-A']
  }
];

const SEED_STUDENTS: StudentUser[] = [
  {
    id: 'stu-201',
    name: 'Çırak Hasan',
    email: 'hasan.ogrenci@meb.k12.tr',
    role: 'student',
    avatar: '🎓',
    studentNumber: '104',
    gradeLevel: 5,
    classSection: '5-A',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-101',
    points: 450,
    unlockedBadges: ['first-step', 'geometry-master', 'maarif-genius'],
    createdAt: '2026-09-03'
  },
  {
    id: 'stu-202',
    name: 'Elif Çelik',
    email: 'elif.ogrenci@meb.k12.tr',
    role: 'student',
    avatar: '🎓',
    studentNumber: '215',
    gradeLevel: 5,
    classSection: '5-A',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-101',
    points: 380,
    unlockedBadges: ['first-step', 'puzzle-pro'],
    createdAt: '2026-09-03'
  },
  {
    id: 'stu-203',
    name: 'Burak Polat',
    email: 'burak.ogrenci@meb.k12.tr',
    role: 'student',
    avatar: '🎓',
    studentNumber: '142',
    gradeLevel: 5,
    classSection: '5-B',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    teacherId: 'tch-101',
    points: 290,
    unlockedBadges: ['first-step'],
    createdAt: '2026-09-04'
  }
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null); // default as unauthenticated guest
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
      const savedTeachers = localStorage.getItem('maarif_teachers');
      if (savedTeachers) setTeachers(JSON.parse(savedTeachers));

      const savedStudents = localStorage.getItem('maarif_students');
      if (savedStudents) setStudents(JSON.parse(savedStudents));

      const savedUser = localStorage.getItem('maarif_current_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Save changes to localStorage
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

  const loginAsRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser(SEED_ADMIN);
    } else if (role === 'teacher') {
      const approvedTeacher = teachers.find((t) => t.status === 'approved') || teachers[0];
      setCurrentUser(approvedTeacher);
    } else if (role === 'student') {
      setCurrentUser(students[0]);
    }
  };

  const loginWithEmail = (email: string, _pass?: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    if (isUserAdmin(trimmed)) {
      const adminUser = getAdminUser(trimmed);
      setCurrentUser(adminUser);
      return true;
    }

    const teacher = teachers.find((t) => t.email.toLowerCase() === trimmed);
    if (teacher) {
      setCurrentUser(teacher);
      return true;
    }

    const student = students.find((s) => s.email.toLowerCase() === trimmed);
    if (student) {
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

  const loginWithGoogle = (profile: { name: string; email: string; avatar?: string }): { isNewUser: boolean; user: AuthUser } => {
    const trimmed = profile.email.trim().toLowerCase();

    // 1. Check if admin
    if (isUserAdmin(trimmed)) {
      const adminUser = getAdminUser(trimmed, profile.name, profile.avatar);
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
      name: profile.name || 'Google Kullanıcısı',
      email: profile.email,
      role: 'teacher',
      avatar: profile.avatar || '👨‍🏫',
      city: 'Edirne',
      district: 'Merkez',
      school: 'Edirne Selimiye İmam Hatip Ortaokulu',
      branch: 'Matematik',
      status: 'pending_admin_approval',
      verifiedAt: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      assignedClasses: ['5-A']
    };

    const updated = [...teachers, newTeacher];
    setTeachers(updated);
    setCurrentUser(newTeacher);

    return { isNewUser: true, user: newTeacher };
  };

  const startTeacherRegistration = (data: TeacherRegistrationPayload): { code: string; success: boolean } => {
    // Generate 6-digit numeric verification code
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    setActiveVerificationCode({
      email: data.email,
      code: randomCode,
      expiresAt
    });

    // Check if teacher already exists, if so update, else create new
    const existingIndex = teachers.findIndex((t) => t.email.toLowerCase() === data.email.toLowerCase());
    const newTeacher: TeacherUser = {
      id: existingIndex >= 0 ? teachers[existingIndex].id : `tch-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'teacher',
      avatar: '👨‍🏫',
      city: data.city,
      district: data.district,
      school: data.school,
      branch: data.branch || 'Matematik',
      status: 'pending_email',
      createdAt: new Date().toISOString().split('T')[0],
      assignedClasses: ['5-A']
    };

    if (existingIndex >= 0) {
      const updated = [...teachers];
      updated[existingIndex] = newTeacher;
      setTeachers(updated);
    } else {
      setTeachers([...teachers, newTeacher]);
    }

    return { code: randomCode, success: true };
  };

  const verifyTeacherEmail = (email: string, code: string): boolean => {
    if (!activeVerificationCode) return false;
    if (
      activeVerificationCode.email.toLowerCase() === email.toLowerCase() &&
      activeVerificationCode.code === code.trim()
    ) {
      // Email verified! Update status to pending_admin_approval
      const updated = teachers.map((t) => {
        if (t.email.toLowerCase() === email.toLowerCase()) {
          return {
            ...t,
            status: 'pending_admin_approval' as const,
            verifiedAt: new Date().toISOString().split('T')[0]
          };
        }
        return t;
      });
      setTeachers(updated);

      const target = updated.find((t) => t.email.toLowerCase() === email.toLowerCase());
      if (target) setCurrentUser(target);

      setActiveVerificationCode(null);
      return true;
    }
    return false;
  };

  const resendVerificationCode = (email: string): string | null => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveVerificationCode({
      email,
      code: randomCode,
      expiresAt: Date.now() + 10 * 60 * 1000
    });
    return randomCode;
  };

  const approveTeacher = (teacherId: string) => {
    const updated = teachers.map((t) => {
      if (t.id === teacherId) {
        return {
          ...t,
          status: 'approved' as const,
          approvedAt: new Date().toISOString().split('T')[0],
          rejectionReason: undefined
        };
      }
      return t;
    });
    setTeachers(updated);

    if (currentUser && currentUser.id === teacherId) {
      const target = updated.find((t) => t.id === teacherId);
      if (target) setCurrentUser(target);
    }
  };

  const rejectTeacher = (teacherId: string, reason = 'Okul veya kimlik bilgileri doğrulanamadı.') => {
    const updated = teachers.map((t) => {
      if (t.id === teacherId) {
        return {
          ...t,
          status: 'rejected' as const,
          rejectionReason: reason
        };
      }
      return t;
    });
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

  const updateTeacherProfile = (teacherId: string, updates: Partial<TeacherUser>) => {
    const updated = teachers.map((t) => {
      if (t.id === teacherId) {
        const item: TeacherUser = {
          ...t,
          ...updates,
          email: t.email, // email is immutable
          isProfileComplete: true
        };
        return item;
      }
      return t;
    });
    setTeachers(updated);

    if (currentUser && currentUser.id === teacherId) {
      const target = updated.find((t) => t.id === teacherId);
      if (target) setCurrentUser(target);
    }
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
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === student.id);
      if (exists) {
        return prev.map((s) => (s.id === student.id ? student : s));
      }
      return [student, ...prev];
    });
  };

  const updateStudent = (student: StudentUser) => {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === student.id);
      if (exists) {
        return prev.map((s) => (s.id === student.id ? student : s));
      }
      return [student, ...prev];
    });

    if (currentUser && currentUser.id === student.id) {
      setCurrentUser(student);
    }
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
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

    // 3. Teacher visibility rule:
    // Teachers only see students they created OR students enrolled in their own school & district & city.
    // Teachers from other schools cannot see these students.
    if (target.role === 'teacher') {
      const tch = target as TeacherUser;
      return students.filter((s) => {
        // Condition A: Teacher explicitly added this student
        if (s.teacherId && s.teacherId === tch.id) {
          return true;
        }

        // Condition B: Student is enrolled in the same school (case-insensitive) and location
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
        activeVerificationCode,
        loginAsRole,
        loginWithEmail,
        loginWithGoogle,
        logout,
        startTeacherRegistration,
        verifyTeacherEmail,
        resendVerificationCode,
        updateTeacherProfile,
        addClassToTeacher,
        approveTeacher,
        rejectTeacher,
        deleteTeacher,
        addStudent,
        updateStudent,
        deleteStudent,
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
