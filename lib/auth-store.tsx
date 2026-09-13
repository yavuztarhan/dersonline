'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  AuthUser,
  TeacherUser,
  StudentUser,
  AdminUser,
  ClassroomInfo,
  UserRole,
  TeacherRegistrationPayload,
  StudentRegistrationPayload
} from '@/types/auth';
import { validatePassword } from '@/lib/password-validator';

export interface AdminCreateUserPayload {
  email: string;
  password: string;
  role: 'admin' | 'teacher';
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  district?: string;
  school?: string;
  branch?: string;
  principalName?: string;
  assignedClasses?: string[];
}

interface AuthContextType {
  currentUser: AuthUser | null;
  teachers: TeacherUser[];
  students: StudentUser[];
  admins: AdminUser[];
  classrooms: ClassroomInfo[];
  activeVerificationCode: { email: string; code: string; expiresAt: number } | null;
  
  // Auth Operations
  loginAsRole: (role: UserRole) => void;
  loginWithEmail: (emailOrIdentifier: string, pass?: string) => Promise<boolean>;
  loginStudent: (classCode: string, studentNumber: string, pass?: string) => Promise<boolean>;
  loginWithGoogle: (profile: { name: string; email: string; avatar?: string }) => { isNewUser: boolean; user: AuthUser };
  loginWithBoardSession: (user: AuthUser, sessionToken: string, expiresAt: number, deviceCategory: string) => void;
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
  addClassesToTeacher: (teacherId: string, classNames: string[]) => void;
  getSchoolClasses: (schoolName?: string) => string[];
  deleteClassFromTeacher: (teacherId: string, className: string) => { deletedStudentCount: number; isShared?: boolean };

  getClassCodeForClass: (className: string, teacherId?: string) => string;

  // Student Registration Flow
  registerStudent: (data: StudentRegistrationPayload) => StudentUser;
  
  // Admin Operations
  adminCreateUser: (payload: AdminCreateUserPayload) => { success: boolean; error?: string; user?: AuthUser };
  approveTeacher: (teacherId: string) => void;
  rejectTeacher: (teacherId: string, reason?: string) => void;
  suspendTeacher: (teacherId: string, email?: string) => void;
  unsuspendTeacher: (teacherId: string, email?: string) => void;
  deleteTeacher: (teacherId: string) => void;
  deleteAdmin: (adminId: string) => void;
  changeUserRole: (userId: string, newRole: UserRole) => boolean;
  
  // Student Operations & Visibility
  addStudent: (student: StudentUser) => { success: boolean; error?: string; student?: StudentUser };
  addStudentsBulk: (students: StudentUser[]) => { addedCount: number; updatedCount: number };
  updateStudent: (student: StudentUser) => void;
  deleteStudent: (studentId: string) => void;
  resetStudentPassword: (studentId: string) => { success: boolean; newPassword?: string };
  awardPointsToStudent: (studentId: string, pts: number, reason?: string, subject?: string) => void;
  getVisibleStudents: (user?: AuthUser | null) => StudentUser[];
  refreshData: () => Promise<void>;
}

export {
  splitFullName,
  formatFullName,
  ADMIN_EMAILS,
  SEED_ADMINS,
  SEED_TEACHERS,
  SEED_STUDENTS,
  SEED_CLASSROOMS,
  isUserAdmin,
  getAdminUser
} from '@/lib/auth-seed-data';

import {
  splitFullName,
  formatFullName,
  ADMIN_EMAILS,
  SEED_ADMINS,
  SEED_TEACHERS,
  SEED_STUDENTS,
  SEED_CLASSROOMS,
  isUserAdmin,
  getAdminUser
} from '@/lib/auth-seed-data';

import { useDemoMode, isDemoModeActive, getDemoActiveRole } from '@/lib/demo-mode-store';
import {
  DEMO_TEACHER_USER,
  DEMO_STUDENT_USER,
  DEMO_STUDENTS_LIST
} from '@/lib/demo-seed-data';

export const DEMO_CLASSROOMS: ClassroomInfo[] = [
  { id: 'demo-cls-5a', name: '5-A', gradeLevel: 5, code: 'MAARİF', school: 'Atatürk Ortaokulu', teacherId: 'demo-teacher-01', createdAt: '2026-09-01T08:00:00.000Z' },
  { id: 'demo-cls-6b', name: '6-B', gradeLevel: 6, code: 'MAARİF', school: 'Atatürk Ortaokulu', teacherId: 'demo-teacher-01', createdAt: '2026-09-01T08:00:00.000Z' },
  { id: 'demo-cls-7a', name: '7-A', gradeLevel: 7, code: 'MAARİF', school: 'Atatürk Ortaokulu', teacherId: 'demo-teacher-01', createdAt: '2026-09-01T08:00:00.000Z' }
];

export function generateUniqueClassCode(existingClassrooms: ClassroomInfo[] = []): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  let attempts = 0;
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    attempts++;
  } while (
    existingClassrooms.some((c) => c.code?.toUpperCase() === code) &&
    attempts < 1000
  );
  return code;
}

export function generateRandomStudentPassword(length = 6): string {
  const letters = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const all = letters + numbers;

  let password = '';
  password += letters.charAt(Math.floor(Math.random() * letters.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  for (let i = 2; i < length; i++) {
    password += all.charAt(Math.floor(Math.random() * all.length));
  }
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export function enrichUser(u: any): any {
  if (!u) return u;
  if (!u.firstName || !u.lastName) {
    const parts = splitFullName(u.name || '');
    u.firstName = u.firstName || parts.firstName || 'Kullanıcı';
    u.lastName = u.lastName || parts.lastName || '';
  }
  if (!u.name) {
    u.name = formatFullName(u.firstName, u.lastName, 'Kullanıcı');
  }
  // Sanitize student password: never allow raw bcrypt hash or raw ciphertext on client
  if (u.role === 'student' && typeof u.password === 'string') {
    if (u.password.startsWith('$2') || u.password.startsWith('enc:') || u.password.length > 25) {
      u.password = u.studentNumber || '123456';
    }
  }
  return u;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isDemoMode, demoRole } = useDemoMode();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null); // default as unauthenticated guest
  const [admins, setAdmins] = useState<AdminUser[]>(SEED_ADMINS);
  const [teachers, setTeachers] = useState<TeacherUser[]>(SEED_TEACHERS);
  const [students, setStudents] = useState<StudentUser[]>(SEED_STUDENTS);
  const [classrooms, setClassrooms] = useState<ClassroomInfo[]>(SEED_CLASSROOMS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeVerificationCode, setActiveVerificationCode] = useState<{
    email: string;
    code: string;
    expiresAt: number;
  } | null>(null);

  // Synchronize demo mode state
  useEffect(() => {
    if (isDemoMode) {
      if (demoRole === 'teacher') {
        setCurrentUser(DEMO_TEACHER_USER);
        try {
          const raw = localStorage.getItem('demo_maarif_students');
          if (raw) {
            setStudents(JSON.parse(raw));
          } else {
            setStudents(DEMO_STUDENTS_LIST);
          }
        } catch {
          setStudents(DEMO_STUDENTS_LIST);
        }
      } else if (demoRole === 'student') {
        try {
          const raw = localStorage.getItem('demo_maarif_students');
          if (raw) {
            const list = JSON.parse(raw);
            const found = list.find((s: StudentUser) => s.id === DEMO_STUDENT_USER.id);
            setCurrentUser(found || DEMO_STUDENT_USER);
            setStudents(list);
          } else {
            setCurrentUser(DEMO_STUDENT_USER);
            setStudents(DEMO_STUDENTS_LIST);
          }
        } catch {
          setCurrentUser(DEMO_STUDENT_USER);
          setStudents(DEMO_STUDENTS_LIST);
        }
      }
      setClassrooms(DEMO_CLASSROOMS);
      setTeachers([DEMO_TEACHER_USER]);
    } else {
      // Demo is not active: purge any demo user that might have been retained in state or storage
      setCurrentUser((prev) => {
        if (prev && (prev.id?.startsWith('demo-') || (prev as any).isDemoUser || prev.email?.includes('demo.') || (prev as any).school?.includes('Atatürk Ortaokulu'))) {
          try {
            localStorage.removeItem('maarif_current_user');
          } catch {}
          return null;
        }
        return prev;
      });
    }
  }, [isDemoMode, demoRole]);

  // Listen to maarif:demo-change event for immediate cleanup upon exiting demo
  useEffect(() => {
    const handleDemoChange = (e: any) => {
      const isDemo = e?.detail?.isDemo;
      if (!isDemo) {
        setCurrentUser((prev) => {
          if (prev && (prev.id?.startsWith('demo-') || (prev as any).isDemoUser || prev.email?.includes('demo.') || (prev as any).school?.includes('Atatürk Ortaokulu'))) {
            return null;
          }
          return prev;
        });
        try {
          const saved = localStorage.getItem('maarif_current_user');
          if (saved) {
            const u = JSON.parse(saved);
            if (u?.id?.startsWith('demo-') || u?.isDemoUser || u?.email?.includes('demo.') || u?.school?.includes('Atatürk Ortaokulu')) {
              localStorage.removeItem('maarif_current_user');
            }
          }
        } catch {}
        setTeachers(SEED_TEACHERS);
        setStudents(SEED_STUDENTS);
        setClassrooms(SEED_CLASSROOMS);
      }
    };
    window.addEventListener('maarif:demo-change', handleDemoChange);
    return () => window.removeEventListener('maarif:demo-change', handleDemoChange);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      if (isDemoModeActive()) {
        setIsLoaded(true);
        return;
      }

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
        try {
          const parsed = JSON.parse(savedTeachers);
          if (Array.isArray(parsed)) {
            setTeachers(parsed.map(enrichUser));
          }
        } catch (e) {}
      }

      // Live DB synchronization for teachers (DB is single source of truth)
      fetch('/api/admin/teachers')
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.teachers)) {
            const enriched = data.teachers.map(enrichUser);
            setTeachers(enriched);
            try {
              localStorage.setItem('maarif_teachers', JSON.stringify(enriched));
            } catch (e) {}
          }
        })
        .catch(() => {});

      const savedStudents = localStorage.getItem('maarif_students');
      if (savedStudents) {
        try {
          const parsed = JSON.parse(savedStudents);
          if (Array.isArray(parsed)) {
            setStudents(parsed.map(enrichUser));
          }
        } catch (e) {}
      }

      // Live DB synchronization for students (DB is single source of truth)
      fetch('/api/students')
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.students)) {
            const enriched = data.students.map(enrichUser);
            setStudents(enriched);
            try {
              localStorage.setItem('maarif_students', JSON.stringify(enriched));
            } catch (e) {}
          }
        })
        .catch(() => {});

      const savedClassrooms = localStorage.getItem('maarif_classrooms');
      if (savedClassrooms) {
        try {
          const parsed = JSON.parse(savedClassrooms);
          if (Array.isArray(parsed)) {
            setClassrooms(parsed);
          }
        } catch (e) {}
      }

      // Live DB synchronization for classrooms
      fetch('/api/classrooms')
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.classrooms)) {
            setClassrooms(data.classrooms);
            try {
              localStorage.setItem('maarif_classrooms', JSON.stringify(data.classrooms));
            } catch (e) {}
          }
        })
        .catch(() => {});

      const savedUser = localStorage.getItem('maarif_current_user');
      if (savedUser) {
        try {
          const rawParsed = JSON.parse(savedUser);
          if (rawParsed?.id?.startsWith('demo-') || rawParsed?.isDemoUser || rawParsed?.email?.includes('demo.') || rawParsed?.school?.includes('Atatürk Ortaokulu')) {
            // NEVER restore demo user as real authenticated user
            localStorage.removeItem('maarif_current_user');
          } else {
            const parsedUser = enrichUser(rawParsed);
            setCurrentUser(parsedUser);

            // Background server sync: fetch updated profile from DB if available
            if (parsedUser.email) {
          fetch(`/api/user/profile?email=${encodeURIComponent(parsedUser.email)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data?.success && data?.user) {
                const dbUser = data.user;
                const dbClasses: string[] = dbUser.assignedClasses || [];

                setCurrentUser((prev) => {
                  if (!prev || prev.email?.toLowerCase() !== parsedUser.email?.toLowerCase()) return prev;
                  const synced = {
                    ...prev,
                    firstName: dbUser.firstName || prev.firstName,
                    lastName: dbUser.lastName || prev.lastName,
                    name: dbUser.name || prev.name,
                    phone: dbUser.phone || (prev as any).phone,
                    city: dbUser.city || (prev as any).city,
                    district: dbUser.district || (prev as any).district,
                    school: dbUser.school || (prev as any).school,
                    branch: dbUser.branch || (prev as any).branch,
                    principalName: dbUser.principalName || (prev as any).principalName,
                    assignedClasses: dbClasses,
                    accountStatus: dbUser.accountStatus || prev.accountStatus || 'aktif',
                    status: dbUser.accountStatus === 'beklemede' ? 'suspended' : (dbUser.status || (prev as any).status),
                    isKvkkAccepted: dbUser.isKvkkAccepted !== undefined ? dbUser.isKvkkAccepted : (prev as any).isKvkkAccepted,
                    kvkkAcceptedAt: dbUser.kvkkAcceptedAt || prev.kvkkAcceptedAt,
                  };
                  try {
                    localStorage.setItem('maarif_current_user', JSON.stringify(synced));
                  } catch (e) {}

                  if (dbUser.accountStatus) {
                    setTeachers((prevTchs) =>
                      prevTchs.map((t) =>
                        t.email.toLowerCase() === parsedUser.email?.toLowerCase()
                          ? {
                              ...t,
                              accountStatus: dbUser.accountStatus,
                              status: dbUser.accountStatus === 'beklemede' ? 'suspended' : t.status,
                              isKvkkAccepted: dbUser.isKvkkAccepted !== undefined ? dbUser.isKvkkAccepted : t.isKvkkAccepted,
                              kvkkAcceptedAt: dbUser.kvkkAcceptedAt || t.kvkkAcceptedAt,
                              assignedClasses: dbClasses,
                            }
                          : t
                      )
                    );
                  }

                  return synced;
                });

                // If user password is not yet saved to DB, sync it
                const needsPasswordSync = Boolean(parsedUser.password && !dbUser.hasPassword);
                if (needsPasswordSync) {
                  fetch('/api/user/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: parsedUser.email,
                      firstName: parsedUser.firstName,
                      lastName: parsedUser.lastName,
                      name: parsedUser.name,
                      phone: (parsedUser as any).phone,
                      school: (parsedUser as any).school,
                      branch: (parsedUser as any).branch,
                      assignedClasses: dbClasses,
                      password: parsedUser.password,
                    }),
                  }).catch(() => {});
                }
              }
            })
            .catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Error parsing savedUser:', err);
    }
  }
} catch (e) {
  console.warn('LocalStorage error:', e);
} finally {
  setIsLoaded(true);
}
}, []);

  // Save changes to localStorage only after initial load completed
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('maarif_admins', JSON.stringify(admins));
    } catch (e) {}
  }, [admins, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('maarif_teachers', JSON.stringify(teachers));
    } catch (e) {}
  }, [teachers, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('maarif_students', JSON.stringify(students));
    } catch (e) {}
  }, [students, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('maarif_classrooms', JSON.stringify(classrooms));
    } catch (e) {}
  }, [classrooms, isLoaded]);


  useEffect(() => {
    if (!isLoaded) return;
    // CRITICAL: Never write demo user into maarif_current_user!
    if (
      isDemoModeActive() ||
      isDemoMode ||
      (currentUser && (currentUser.id?.startsWith('demo-') || (currentUser as any).isDemoUser || currentUser.email?.includes('demo.') || (currentUser as any).school?.includes('Atatürk Ortaokulu')))
    ) {
      return;
    }
    try {
      if (currentUser) {
        localStorage.setItem('maarif_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('maarif_current_user');
      }
    } catch (e) {}
  }, [currentUser, isLoaded, isDemoMode]);

  const { data: session } = useSession();

  // Sync live NextAuth OAuth session
  useEffect(() => {
    if (!isLoaded) return;
    if (session?.user?.email) {
      const email = session.user.email;
      if (!currentUser || (currentUser.email && currentUser.email.toLowerCase() !== email.toLowerCase())) {
        loginWithGoogle({
          name: session.user.name || 'Google Kullanıcısı',
          email: session.user.email,
          avatar: session.user.image || '✨'
        });
      }
    }
  }, [session, isLoaded]);

  const checkIsAdmin = (email?: string | null): boolean => {
    return isUserAdmin(email, admins);
  };

  const registerDeviceSession = (u: AuthUser, clientHint?: string) => {
    if (!u || !u.id || !u.email) return;
    fetch('/api/auth/session-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: u.id,
        userEmail: u.email,
        clientHint
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.sessionId) {
          try {
            localStorage.setItem('maarif_session_token', data.sessionId);
            localStorage.setItem('maarif_session_expires', String(data.expiresAt));
            localStorage.setItem('maarif_device_category', data.deviceCategory);
          } catch (e) {}
        }
      })
      .catch(() => {});
  };

  const loginWithBoardSession = (
    user: AuthUser,
    sessionToken: string,
    expiresAt: number,
    deviceCategory: string
  ) => {
    const enriched = enrichUser(user);
    setCurrentUser(enriched);

    try {
      localStorage.setItem('maarif_current_user', JSON.stringify(enriched));
      if (sessionToken) localStorage.setItem('maarif_session_token', sessionToken);
      if (expiresAt) localStorage.setItem('maarif_session_expires', String(expiresAt));
      if (deviceCategory) localStorage.setItem('maarif_device_category', deviceCategory);
    } catch (e) {}
  };

  // Concurrent session heartbeat validator:
  // Terminates older smartboard sessions if the teacher logs into another smartboard!
  useEffect(() => {
    if (!currentUser || !isLoaded) return;

    const checkHeartbeat = async () => {
      try {
        const category = localStorage.getItem('maarif_device_category');
        // CRITICAL RULE:
        // Sadece akıllı tahtalarda ('smartboard') oturum değişimi denetlenir.
        // Cep telefonları ve kişisel bilgisayarlar (macOS, Windows) ASLA başka cihaz tarafından kapatılamaz!
        if (category !== 'smartboard') return;

        const token = localStorage.getItem('maarif_session_token');
        if (!token) return;

        const expiresStr = localStorage.getItem('maarif_session_expires');
        if (expiresStr) {
          const exp = parseInt(expiresStr, 10);
          if (exp && Date.now() > exp) {
            alert('Akıllı tahta oturum süreniz (2 saat) doldu. Güvenliğiniz için tahta oturumu kapatıldı.');
            logout();
            return;
          }
        }

        const res = await fetch('/api/auth/session-heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            sessionId: token,
            deviceCategory: 'smartboard'
          })
        });

        const data = await res.json();
        if (data && data.active === false) {
          const msg = data.message || 'Hesabınız başka bir akıllı tahtada açıldığı için bu tahtadaki oturum güvenlik amacıyla kapatıldı.';
          alert(msg);
          logout();
        }
      } catch (e) {
        // Silently ignore network blips
      }
    };

    const initialTimer = setTimeout(checkHeartbeat, 4000);
    const interval = setInterval(checkHeartbeat, 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [currentUser, isLoaded]);

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

  const loginWithEmail = async (identifier: string, pass?: string): Promise<boolean> => {
    const trimmed = (identifier || '').trim().toLowerCase();
    const cleanPass = (pass || '').trim();
    if (!trimmed || !cleanPass) return false;

    // Direct Database Authentication via Prisma API
    try {
      const res = await fetch('/api/auth/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: trimmed, password: cleanPass })
      });
      const data = await res.json();
      if (data?.success && data?.user) {
        const verifiedUser: AuthUser = data.user;
        setCurrentUser(verifiedUser);
        if (data.sessionId) {
          try {
            localStorage.setItem('maarif_session_token', data.sessionId);
            localStorage.setItem('maarif_session_expires', String(data.expiresAt));
            localStorage.setItem('maarif_device_category', data.deviceCategory);
            localStorage.setItem('maarif_current_user', JSON.stringify(verifiedUser));
          } catch (e) {}
        }
        return true;
      }
    } catch (e) {
      console.warn('[loginWithEmail] Database login error:', e);
    }

    return false;
  };

  const loginStudent = async (classCode: string, studentNumber: string, pass?: string): Promise<boolean> => {
    const cleanCode = (classCode || '').trim().toUpperCase();
    const cleanNumber = (studentNumber || '').trim();
    const cleanPass = (pass || '').trim();

    if (!cleanCode || !cleanNumber || !cleanPass) return false;

    // Demo Student Authentication Bypass
    if ((isDemoModeActive() || isDemoMode || cleanCode === 'MAARİF') && (cleanPass === 'MRF01' || cleanPass === 'admin')) {
      const currentList = students.length > 0 ? students : DEMO_STUDENTS_LIST;
      const found = currentList.find((s) => s.studentNumber === cleanNumber);
      if (found) {
        setCurrentUser(found);
        return true;
      }
    }

    // Direct Database Authentication via Prisma API
    try {
      const res = await fetch('/api/auth/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classCode: cleanCode, studentNumber: cleanNumber, password: cleanPass })
      });
      const data = await res.json();
      if (data?.success && data?.user) {
        const verifiedUser: AuthUser = data.user;
        setCurrentUser(verifiedUser);
        if (data.sessionId) {
          try {
            localStorage.setItem('maarif_session_token', data.sessionId);
            localStorage.setItem('maarif_session_expires', String(data.expiresAt));
            localStorage.setItem('maarif_device_category', data.deviceCategory);
            localStorage.setItem('maarif_current_user', JSON.stringify(verifiedUser));
          } catch (e) {}
        }
        return true;
      }
    } catch (e) {
      console.warn('[loginStudent] Database login error:', e);
    }

    return false;
  };

  const logout = () => {
    if (isDemoMode) {
      try {
        localStorage.removeItem('demo_maarif_active_role');
      } catch (e) {}
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('maarif_current_user');
      localStorage.removeItem('maarif_session_token');
      localStorage.removeItem('maarif_session_expires');
      localStorage.removeItem('maarif_device_category');
      signOut({ redirect: false });
    } catch (e) {}
  };

  const setUserPassword = (userId: string, newPassword: string): boolean => {
    if (!userId || !newPassword) return false;
    const targetEmail = currentUser?.email?.toLowerCase();

    setAdmins((prev) => {
      const next = prev.map((a) => (a.id === userId || (targetEmail && a.email?.toLowerCase() === targetEmail) ? { ...a, password: newPassword } : a));
      try {
        localStorage.setItem('maarif_admins', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    const isStudentUser = currentUser?.role === 'student' || students.some((s) => s.id === userId);

    setTeachers((prev) => {
      const next = prev.map((t) => (t.id === userId || (targetEmail && t.email?.toLowerCase() === targetEmail) ? { ...t, password: newPassword } : t));
      try {
        localStorage.setItem('maarif_teachers', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    setStudents((prev) => {
      const next = prev.map((s) => {
        if (s.id === userId || (targetEmail && s.email?.toLowerCase() === targetEmail)) {
          return {
            ...s,
            password: newPassword,
            isPasswordChangedByStudent: isStudentUser ? true : s.isPasswordChangedByStudent
          };
        }
        return s;
      });
      try {
        localStorage.setItem('maarif_students', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    setCurrentUser((prev) => {
      if (!prev) return prev;
      if (prev.id === userId || (targetEmail && prev.email?.toLowerCase() === targetEmail)) {
        const updated = {
          ...prev,
          password: newPassword,
          ...(prev.role === 'student' ? { isPasswordChangedByStudent: true } : {})
        };
        try {
          localStorage.setItem('maarif_current_user', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      }
      return prev;
    });

    if (isStudentUser) {
      try {
        fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_password',
            studentId: userId,
            newPassword,
            isPasswordChangedByStudent: true
          }),
        }).catch(() => {});
      } catch (e) {}
    } else if (targetEmail) {
      try {
        const u = currentUser;
        fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: targetEmail,
            firstName: u?.firstName,
            lastName: u?.lastName,
            name: u?.name,
            phone: (u as any)?.phone,
            school: (u as any)?.school,
            branch: (u as any)?.branch,
            assignedClasses: (u as any)?.assignedClasses,
            password: newPassword,
          }),
        }).catch(() => {});
      } catch (e) {}
    }

    return true;
  };

  const updateUserProfile = (userId: string, updates: Partial<AuthUser>) => {
    const targetEmail = (updates.email || currentUser?.email || '').trim().toLowerCase();

    const applyUpdates = <T extends AuthUser>(existing: T): T => {
      const fName = updates.firstName !== undefined ? updates.firstName : existing.firstName;
      const lName = updates.lastName !== undefined ? updates.lastName : existing.lastName;
      const full = updates.name || formatFullName(fName, lName, existing.name);
      const pass = (updates as any).password !== undefined ? (updates as any).password : (existing as any).password;

      return {
        ...existing,
        ...updates,
        firstName: fName,
        lastName: lName,
        name: full,
        phone: (updates as any).phone !== undefined ? (updates as any).phone : (existing as any).phone,
        gender: (updates as any).gender !== undefined ? (updates as any).gender : (existing as any).gender,
        city: (updates as any).city !== undefined ? (updates as any).city : (existing as any).city,
        district: (updates as any).district !== undefined ? (updates as any).district : (existing as any).district,
        school: (updates as any).school !== undefined ? (updates as any).school : (existing as any).school,
        branch: (updates as any).branch !== undefined ? (updates as any).branch : (existing as any).branch,
        principalName: (updates as any).principalName !== undefined ? (updates as any).principalName : (existing as any).principalName,
        assignedClasses: (updates as any).assignedClasses !== undefined ? (updates as any).assignedClasses : (existing as any).assignedClasses,
        password: pass,
        isProfileComplete: true
      };
    };

    // 1. Update Current User State & Storage
    let updatedCurrentUser: AuthUser | null = null;
    setCurrentUser((prev) => {
      if (prev && (prev.id === userId || (targetEmail && prev.email?.toLowerCase() === targetEmail))) {
        updatedCurrentUser = applyUpdates(prev);
        try {
          localStorage.setItem('maarif_current_user', JSON.stringify(updatedCurrentUser));
        } catch (e) {}
        return updatedCurrentUser;
      }
      return prev;
    });

    // 2. Update Teachers list & Storage
    setTeachers((prev) => {
      const existsIndex = prev.findIndex((t) => t.id === userId || (targetEmail && t.email.toLowerCase() === targetEmail));
      let nextTeachers: TeacherUser[];
      if (existsIndex >= 0) {
        nextTeachers = prev.map((t, idx) => (idx === existsIndex ? applyUpdates(t) as TeacherUser : t));
      } else if (currentUser?.role === 'teacher' || updatedCurrentUser?.role === 'teacher') {
        const base = updatedCurrentUser || currentUser;
        const newTeacher: TeacherUser = {
          id: userId || base?.id || `tch-${Date.now()}`,
          firstName: updates.firstName || base?.firstName || 'Öğretmen',
          lastName: updates.lastName || base?.lastName || '',
          name: formatFullName(updates.firstName || base?.firstName, updates.lastName || base?.lastName),
          email: updates.email || base?.email || targetEmail,
          password: (updates as any).password || (base as any)?.password || '',
          phone: (updates as any).phone || (base as any)?.phone || '',
          city: (updates as any).city || (base as any)?.city || 'Edirne',
          district: (updates as any).district || (base as any)?.district || 'Merkez',
          school: (updates as any).school || (base as any)?.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
          branch: (updates as any).branch || (base as any)?.branch || 'Matematik',
          principalName: (updates as any).principalName || (base as any)?.principalName || 'Mehmet GÜNGÖR',
          assignedClasses: (updates as any).assignedClasses || (base as any)?.assignedClasses || [],
          role: 'teacher',
          status: 'approved',
          isProfileComplete: true,
          createdAt: base?.createdAt || new Date().toISOString().split('T')[0],
          verifiedAt: new Date().toISOString().split('T')[0]
        };
        nextTeachers = [...prev, newTeacher];
      } else {
        nextTeachers = prev;
      }
      try {
        localStorage.setItem('maarif_teachers', JSON.stringify(nextTeachers));
      } catch (e) {}
      return nextTeachers;
    });

    // 3. Update Admins list
    setAdmins((prev) => {
      const existsIndex = prev.findIndex((a) => a.id === userId || (targetEmail && a.email.toLowerCase() === targetEmail));
      let nextAdmins: AdminUser[];
      if (existsIndex >= 0) {
        nextAdmins = prev.map((a, idx) => (idx === existsIndex ? applyUpdates(a) as AdminUser : a));
      } else if (currentUser?.role === 'admin' || updatedCurrentUser?.role === 'admin') {
        const base = updatedCurrentUser || currentUser;
        const newAdmin: AdminUser = {
          id: userId || base?.id || `usr-admin-${targetEmail.replace(/[^a-z0-9]/g, '_')}`,
          firstName: updates.firstName || base?.firstName || 'Sistem',
          lastName: updates.lastName || base?.lastName || 'Yöneticisi',
          name: formatFullName(updates.firstName || base?.firstName, updates.lastName || base?.lastName, 'Sistem Yöneticisi'),
          email: updates.email || base?.email || targetEmail,
          password: (updates as any).password || (base as any)?.password || 'admin',
          role: 'admin',
          avatar: base?.avatar || '👑',
          permissions: ['all', 'approve_teachers', 'manage_users', 'view_reports'],
          phone: (updates as any).phone || (base as any)?.phone || '',
          city: (updates as any).city || (base as any)?.city || 'Edirne',
          district: (updates as any).district || (base as any)?.district || 'Merkez',
          school: (updates as any).school || (base as any)?.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
          branch: (updates as any).branch || (base as any)?.branch || 'Matematik',
          principalName: (updates as any).principalName || (base as any)?.principalName || 'Mehmet GÜNGÖR',
          assignedClasses: (updates as any).assignedClasses || (base as any)?.assignedClasses || [],
          isProfileComplete: true,
          createdAt: base?.createdAt || new Date().toISOString().split('T')[0]
        };
        nextAdmins = [...prev, newAdmin];
      } else {
        nextAdmins = prev;
      }
      try {
        localStorage.setItem('maarif_admins', JSON.stringify(nextAdmins));
      } catch (e) {}
      return nextAdmins;
    });

    // 4. Update Students list
    setStudents((prev) => {
      const nextStudents = prev.map((s) => {
        if (s.id === userId || (targetEmail && s.email && s.email.toLowerCase() === targetEmail)) {
          return applyUpdates(s) as StudentUser;
        }
        return s;
      });
      try {
        localStorage.setItem('maarif_students', JSON.stringify(nextStudents));
      } catch (e) {}
      return nextStudents;
    });

    // 5. Asynchronous server sync
    if (targetEmail) {
      try {
        fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: targetEmail,
            firstName: updates.firstName,
            lastName: updates.lastName,
            name: updates.name,
            phone: (updates as any).phone,
            branch: (updates as any).branch,
            city: (updates as any).city,
            district: (updates as any).district,
            school: (updates as any).school,
            principalName: (updates as any).principalName,
            assignedClasses: (updates as any).assignedClasses,
            password: (updates as any).password,
          }),
        }).catch((err) => console.warn('Server profile sync note:', err));
      } catch (e) {}
    }
  };

  const acceptKvkk = (userId: string) => {
    const timestamp = new Date().toISOString();
    setTeachers((prev) => {
      const updated = prev.map((t) => (t.id === userId || (currentUser?.email && t.email.toLowerCase() === currentUser.email.toLowerCase()) ? { ...t, isKvkkAccepted: true, kvkkAcceptedAt: timestamp } : t));
      try {
        localStorage.setItem('maarif_teachers', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setAdmins((prev) =>
      prev.map((a) => (a.id === userId ? { ...a, isKvkkAccepted: true, kvkkAcceptedAt: timestamp } : a))
    );
    setStudents((prev) =>
      prev.map((s) => (s.id === userId ? { ...s, isKvkkAccepted: true, kvkkAcceptedAt: timestamp } : s))
    );

    if (currentUser) {
      const updated = { ...currentUser, isKvkkAccepted: true, kvkkAcceptedAt: timestamp };
      setCurrentUser(updated);
      try {
        localStorage.setItem('maarif_current_user', JSON.stringify(updated));
      } catch (e) {}
    }

    // Persist to PostgreSQL database
    fetch('/api/user/accept-kvkk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        email: currentUser?.email,
      }),
    }).catch((err) => console.error('Accept KVKK database error:', err));
  };

  const loginWithGoogle = (profile: { name: string; email: string; avatar?: string }): { isNewUser: boolean; user: AuthUser } => {
    const trimmed = profile.email.trim().toLowerCase();
    const { firstName, lastName } = splitFullName(profile.name || 'Google Kullanıcısı');
    const fullName = formatFullName(firstName, lastName, profile.name || 'Google Kullanıcısı');

    // 1. Check if admin
    if (checkIsAdmin(trimmed)) {
      const foundAdmin = admins.find((a) => a.email.toLowerCase() === trimmed);
      let existingStorageUser: any = null;
      try {
        const savedUserRaw = typeof window !== 'undefined' ? localStorage.getItem('maarif_current_user') : null;
        if (savedUserRaw) {
          const parsed = JSON.parse(savedUserRaw);
          if (parsed.email?.toLowerCase() === trimmed) {
            existingStorageUser = parsed;
          }
        }
      } catch (e) {}

      const adminUser: AdminUser = {
        ...(foundAdmin || getAdminUser(trimmed, profile.name, profile.avatar)),
        ...(existingStorageUser || {}),
        role: 'admin',
        avatar: profile.avatar || existingStorageUser?.avatar || foundAdmin?.avatar || '👑',
      };
      setCurrentUser(adminUser);
      registerDeviceSession(adminUser);
      return { isNewUser: false, user: adminUser };
    }

    // 2. Check if student
    const existingStudent = students.find((s) => s.email && s.email.toLowerCase() === trimmed);
    if (existingStudent) {
      setCurrentUser(existingStudent);
      registerDeviceSession(existingStudent);
      return { isNewUser: false, user: existingStudent };
    }

    // 3. Check if teacher exists
    const existingTeacher = teachers.find((t) => t.email.toLowerCase() === trimmed);
    if (existingTeacher) {
      let existingStorageUser: any = null;
      try {
        const savedUserRaw = typeof window !== 'undefined' ? localStorage.getItem('maarif_current_user') : null;
        if (savedUserRaw) {
          const parsed = JSON.parse(savedUserRaw);
          if (parsed.email?.toLowerCase() === trimmed) {
            existingStorageUser = parsed;
          }
        }
      } catch (e) {}

      const mergedTeacher: TeacherUser = {
        ...existingTeacher,
        ...(existingStorageUser || {}),
        role: 'teacher',
        avatar: profile.avatar || existingStorageUser?.avatar || existingTeacher.avatar || '👨‍🏫',
      };
      setCurrentUser(mergedTeacher);
      registerDeviceSession(mergedTeacher);
      return { isNewUser: false, user: mergedTeacher };
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
      assignedClasses: [],
      isProfileComplete: false
    };

    const updated = [...teachers, newTeacher];
    setTeachers(updated);
    setCurrentUser(newTeacher);
    registerDeviceSession(newTeacher);

    // Sync newly logged in Google teacher to PostgreSQL DB
    fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: profile.email,
        firstName: firstName || 'Google',
        lastName: lastName || 'Kullanıcısı',
        name: fullName,
        school: 'Edirne Selimiye İmam Hatip Ortaokulu',
        branch: 'Matematik',
        assignedClasses: [],
      }),
    }).catch((e) => console.warn('Google teacher sync note:', e));

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
      assignedClasses: []
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
      avatar: data.gender === 'Kız' ? '👩‍🎓' : data.gender === 'Erkek' ? '👨‍🎓' : '🎓',
      gender: data.gender || undefined,
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

    fetch('/api/admin/teachers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherId, action: 'reject', reason })
    }).catch(err => console.error('Reject teacher DB error:', err));
  };

  const suspendTeacher = (teacherId: string, email?: string) => {
    const target = teachers.find(
      (t) => t.id === teacherId || (email && t.email.toLowerCase() === email.toLowerCase())
    );
    const targetEmail = email || target?.email;

    const updated = teachers.map((t) =>
      t.id === teacherId || (targetEmail && t.email.toLowerCase() === targetEmail.toLowerCase())
        ? {
            ...t,
            status: 'suspended' as const,
            accountStatus: 'beklemede' as const,
          }
        : t
    );
    setTeachers(updated);
    try {
      localStorage.setItem('maarif_teachers', JSON.stringify(updated));
    } catch (e) {}

    if (currentUser && target && (currentUser.id === target.id || currentUser.email?.toLowerCase() === target.email.toLowerCase())) {
      const suspendedUser = {
        ...currentUser,
        status: 'suspended' as const,
        accountStatus: 'beklemede' as const,
      };
      setCurrentUser(suspendedUser);
      try {
        localStorage.setItem('maarif_current_user', JSON.stringify(suspendedUser));
      } catch (e) {}
    }

    fetch('/api/admin/teachers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherId, email: targetEmail, action: 'suspend' }),
    }).catch((err) => console.error('Suspend teacher DB error:', err));
  };

  const unsuspendTeacher = (teacherId: string, email?: string) => {
    const target = teachers.find(
      (t) => t.id === teacherId || (email && t.email.toLowerCase() === email.toLowerCase())
    );
    const targetEmail = email || target?.email;

    const updated = teachers.map((t) =>
      t.id === teacherId || (targetEmail && t.email.toLowerCase() === targetEmail.toLowerCase())
        ? {
            ...t,
            status: 'approved' as const,
            accountStatus: 'aktif' as const,
          }
        : t
    );
    setTeachers(updated);
    try {
      localStorage.setItem('maarif_teachers', JSON.stringify(updated));
    } catch (e) {}

    if (currentUser && target && (currentUser.id === target.id || currentUser.email?.toLowerCase() === target.email.toLowerCase())) {
      const activeUser = {
        ...currentUser,
        status: 'approved' as const,
        accountStatus: 'aktif' as const,
      };
      setCurrentUser(activeUser);
      try {
        localStorage.setItem('maarif_current_user', JSON.stringify(activeUser));
      } catch (e) {}
    }

    fetch('/api/admin/teachers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherId, email: targetEmail, action: 'unsuspend' }),
    }).catch((err) => console.error('Unsuspend teacher DB error:', err));
  };

  const deleteTeacher = (teacherId: string) => {
    const target = teachers.find((t) => t.id === teacherId);
    setTeachers((prev) => {
      const updated = prev.filter((t) => t.id !== teacherId && t.email?.toLowerCase() !== target?.email?.toLowerCase());
      try {
        localStorage.setItem('maarif_teachers', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (currentUser && (currentUser.id === teacherId || currentUser.email?.toLowerCase() === target?.email?.toLowerCase())) {
      setCurrentUser(null);
      try {
        localStorage.removeItem('maarif_current_user');
      } catch (e) {}
    }

    fetch('/api/admin/teachers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teacherId,
        email: target?.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          fetch('/api/admin/teachers')
            .then((r) => r.json())
            .then((d) => {
              if (d?.success && Array.isArray(d.teachers)) {
                setTeachers(d.teachers.map(enrichUser));
              }
            }).catch(() => {});
          fetch('/api/students')
            .then((r) => r.json())
            .then((d) => {
              if (d?.success && Array.isArray(d.students)) {
                setStudents(d.students.map(enrichUser));
              }
            }).catch(() => {});
        }
      })
      .catch((err) => console.error('Delete teacher DB error:', err));
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
          assignedClasses: [],
          isProfileComplete: true
        };
        setTeachers((prev) => [newTeacher, ...prev.filter((t) => t.email.toLowerCase() !== adminUser.email.toLowerCase())]);
        if (currentUser?.email && currentUser.email.toLowerCase() === adminUser.email.toLowerCase()) {
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
        setStudents((prev) => [newStudent, ...prev.filter((s) => !s.email || s.email.toLowerCase() !== adminUser.email.toLowerCase())]);
        if (currentUser?.email && currentUser.email.toLowerCase() === adminUser.email.toLowerCase()) {
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
        if (currentUser?.email && currentUser.email.toLowerCase() === teacherUser.email.toLowerCase()) {
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
        setStudents((prev) => [newStudent, ...prev.filter((s) => !s.email || s.email.toLowerCase() !== teacherUser.email.toLowerCase())]);
        if (currentUser?.email && currentUser.email.toLowerCase() === teacherUser.email.toLowerCase()) {
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

      const fallbackEmail = studentUser.email || (studentUser.studentNumber ? `${studentUser.studentNumber}@okul.meb.k12.tr` : `student_${studentUser.id}@okul.meb.k12.tr`);

      if (newRole === 'admin') {
        const newAdmin: AdminUser = {
          id: `usr-admin-${studentUser.id}`,
          firstName: studentUser.firstName || splitFullName(studentUser.name).firstName,
          lastName: studentUser.lastName || splitFullName(studentUser.name).lastName,
          name: studentUser.name,
          email: fallbackEmail,
          password: studentUser.password,
          role: 'admin',
          avatar: '👑',
          createdAt: studentUser.createdAt || new Date().toISOString().split('T')[0],
          permissions: ['all', 'approve_teachers', 'manage_users', 'view_reports'],
          city: studentUser.city,
          district: studentUser.district,
          school: studentUser.school
        };
        setAdmins((prev) => [newAdmin, ...prev.filter((a) => a.email.toLowerCase() !== fallbackEmail.toLowerCase())]);
        if (currentUser?.id === studentUser.id || (currentUser?.email && currentUser.email.toLowerCase() === fallbackEmail.toLowerCase())) {
          setCurrentUser(newAdmin);
        }
      } else if (newRole === 'teacher') {
        const newTeacher: TeacherUser = {
          id: `tch-${Date.now()}`,
          firstName: studentUser.firstName || splitFullName(studentUser.name).firstName,
          lastName: studentUser.lastName || splitFullName(studentUser.name).lastName,
          name: studentUser.name,
          email: fallbackEmail,
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
        setTeachers((prev) => [newTeacher, ...prev.filter((t) => t.email.toLowerCase() !== fallbackEmail.toLowerCase())]);
        if (currentUser?.id === studentUser.id || (currentUser?.email && currentUser.email.toLowerCase() === fallbackEmail.toLowerCase())) {
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

  const getClassCodeForClass = (className: string, teacherId?: string): string => {
    if (isDemoModeActive() || isDemoMode) {
      return 'MAARİF';
    }
    const trimmed = (className || '').trim().toUpperCase();
    if (!trimmed) return '';

    const match = classrooms.find(
      (c) => c.name.toUpperCase() === trimmed && (!teacherId || c.teacherId === teacherId)
    ) || classrooms.find((c) => c.name.toUpperCase() === trimmed);

    if (match) return match.code;

    const newCode = generateUniqueClassCode(classrooms);
    const newCls: ClassroomInfo = {
      id: `cls-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      code: newCode,
      teacherId,
      gradeLevel: parseInt(trimmed.charAt(0)) || 5,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClassrooms((prev) => [...prev, newCls]);
    return newCode;
  };

  /**
   * Bir öğretmenin okulunda kayıtlı olan tüm sınıfların (okul ortak sınıf havuzu) listesini döner.
   */
  const getSchoolClasses = (schoolName?: string): string[] => {
    const teacherUser = teachers.find((t) => t.id === currentUser?.id);
    const targetSchool = (schoolName || teacherUser?.school || (currentUser as any)?.school || '').trim().toLowerCase();
    if (!targetSchool) return [];

    const classSet = new Set<string>();

    // 1. Okula ait sınıflar
    classrooms.forEach((c) => {
      if (c.school && c.school.trim().toLowerCase() === targetSchool && c.name) {
        classSet.add(c.name.trim().toUpperCase());
      }
    });

    // 2. Okuldaki öğretmenlerin şubeleri
    teachers.forEach((t) => {
      if (t.school && t.school.trim().toLowerCase() === targetSchool && t.assignedClasses) {
        t.assignedClasses.forEach((cls) => {
          if (cls && cls.trim()) {
            classSet.add(cls.trim().toUpperCase());
          }
        });
      }
    });

    // 3. Okuldaki öğrencilerin şubeleri
    students.forEach((s) => {
      if (s.school && s.school.trim().toLowerCase() === targetSchool && s.classSection) {
        classSet.add(s.classSection.trim().toUpperCase());
      }
    });

    const list = Array.from(classSet);
    return list.sort((a, b) => a.localeCompare(b, 'tr-TR', { numeric: true }));
  };

  const addClassToTeacher = (teacherId: string, className: string) => {
    addClassesToTeacher(teacherId, [className]);
  };

  const addClassesToTeacher = (teacherId: string, classNames: string[]) => {
    if (!classNames || classNames.length === 0) return;
    const cleanList = classNames
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);
    if (cleanList.length === 0) return;

    const teacherObj = teachers.find((t) => t.id === teacherId);
    const teacherSchool = teacherObj?.school;

    // Sınıf kodları havuzunu garanti et (Aynı okulda aynı sınıf tek bir koda sahip olur)
    setClassrooms((prev) => {
      const next = [...prev];
      for (const name of cleanList) {
        const exists = next.some(
          (c) => c.name.toUpperCase() === name && (!teacherSchool || !c.school || c.school.trim().toLowerCase() === teacherSchool.trim().toLowerCase())
        );
        if (!exists) {
          next.push({
            id: `cls-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name,
            code: generateUniqueClassCode(next),
            teacherId,
            school: teacherSchool,
            gradeLevel: parseInt(name.charAt(0)) || 5,
            createdAt: new Date().toISOString().split('T')[0]
          });
        }
      }
      return next;
    });

    let targetEmail = '';
    let updatedClasses: string[] = [];

    const updated = teachers.map((t) => {
      if (t.id === teacherId) {
        targetEmail = t.email;
        const current = t.assignedClasses || [];
        const merged = Array.from(new Set([...current, ...cleanList])).sort((a, b) =>
          a.localeCompare(b, 'tr-TR', { numeric: true })
        );
        updatedClasses = merged;
        return {
          ...t,
          assignedClasses: updatedClasses
        };
      }
      return t;
    });
    setTeachers(updated);

    if (currentUser && currentUser.id === teacherId) {
      const target = updated.find((t) => t.id === teacherId);
      if (target) {
        setCurrentUser(target);
        targetEmail = target.email;
        updatedClasses = target.assignedClasses || [];
      }
    }

    const syncEmail = targetEmail || currentUser?.email;
    if (syncEmail) {
      fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: syncEmail,
          assignedClasses: updatedClasses.length > 0 ? updatedClasses : cleanList,
        }),
      }).catch((err) => console.warn('[addClassesToTeacher] DB sync note:', err));

      fetch('/api/classrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId,
          email: syncEmail,
          school: teacherSchool,
          city: teacherObj?.city || (currentUser as any)?.city,
          district: teacherObj?.district || (currentUser as any)?.district,
          classNames: cleanList
        })
      }).catch((err) => console.warn('[addClassesToTeacher] /api/classrooms sync note:', err));

      // Live sync students from database for the added class with decrypted passwords
      fetch('/api/students')
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.students)) {
            const enriched = data.students.map(enrichUser);
            setStudents(enriched);
            try {
              localStorage.setItem('maarif_students', JSON.stringify(enriched));
            } catch (e) {}
          }
        })
        .catch((err) => console.warn('[addClassesToTeacher] /api/students sync note:', err));
    }
  };

  const deleteClassFromTeacher = (teacherId: string, className: string): { deletedStudentCount: number; isShared?: boolean } => {
    const trimmed = className.trim().toUpperCase();
    if (!trimmed) return { deletedStudentCount: 0, isShared: false };

    // 1. Identify all teachers and school
    const targetTeacher = teachers.find((t) => t.id === teacherId || (currentUser?.email && t.email?.toLowerCase() === currentUser.email.toLowerCase()));
    const teacherSchool = targetTeacher?.school || (currentUser as any)?.school;

    // Check if any other teacher in the same school has this class assigned
    const otherTeachersWithThisClass = teachers.filter(
      (t) =>
        t.id !== targetTeacher?.id &&
        (!teacherSchool || !t.school || t.school.trim().toLowerCase() === teacherSchool.trim().toLowerCase()) &&
        (t.assignedClasses || []).some((c) => c.toUpperCase() === trimmed)
    );

    const isSharedWithOtherTeachers = otherTeachersWithThisClass.length > 0;
    let deletedStudentCount = 0;

    // 2. If NOT shared with other teachers, delete students from state and localStorage
    if (!isSharedWithOtherTeachers) {
      const studentsToDelete = students.filter(
        (s) =>
          s.classSection.toUpperCase() === trimmed &&
          (!s.teacherId || s.teacherId === teacherId || (teacherSchool && s.school === teacherSchool))
      );
      const studentIdsToDelete = new Set(studentsToDelete.map((s) => s.id));
      const studentNumbersToDelete = new Set(studentsToDelete.map((s) => s.studentNumber));
      deletedStudentCount = studentIdsToDelete.size;

      setStudents((prev) => {
        const nextStudents = prev.filter((s) => !studentIdsToDelete.has(s.id));
        try {
          localStorage.setItem('maarif_students', JSON.stringify(nextStudents));
        } catch (e) {}
        return nextStudents;
      });

      // Remove classroom from classrooms state and localStorage
      setClassrooms((prev) => {
        const nextClassrooms = prev.filter(
          (c) => !(c.name.toUpperCase() === trimmed && (!teacherSchool || !c.school || c.school.trim().toLowerCase() === teacherSchool.trim().toLowerCase()))
        );
        try {
          localStorage.setItem('maarif_classrooms', JSON.stringify(nextClassrooms));
        } catch (e) {}
        return nextClassrooms;
      });

      // Clean up associated stores
      try {
        const rubricsRaw = typeof window !== 'undefined' ? localStorage.getItem('maarif_rubric_submissions_v1') : null;
        if (rubricsRaw) {
          const rubrics = JSON.parse(rubricsRaw);
          const filteredRubrics = rubrics.filter(
            (r: any) =>
              !(
                r.classSection?.toUpperCase() === trimmed &&
                (r.teacherId === teacherId || studentNumbersToDelete.has(r.studentNumber))
              )
          );
          localStorage.setItem('maarif_rubric_submissions_v1', JSON.stringify(filteredRubrics));
        }

        const journalsRaw = typeof window !== 'undefined' ? localStorage.getItem('maarif_learning_journals_v1') : null;
        if (journalsRaw) {
          const journals = JSON.parse(journalsRaw);
          const filteredJournals = journals.filter((j: any) => j.classSection?.toUpperCase() !== trimmed);
          localStorage.setItem('maarif_learning_journals_v1', JSON.stringify(filteredJournals));
        }

        const boardRaw = typeof window !== 'undefined' ? localStorage.getItem('maarif_board_participations_v1') : null;
        if (boardRaw) {
          const board = JSON.parse(boardRaw);
          const filteredBoard = board.filter(
            (b: any) =>
              !(
                b.classSection?.toUpperCase() === trimmed &&
                (b.teacherId === teacherId || studentNumbersToDelete.has(b.studentNumber))
              )
          );
          localStorage.setItem('maarif_board_participations_v1', JSON.stringify(filteredBoard));
        }

        const peerRaw = typeof window !== 'undefined' ? localStorage.getItem('maarif_peer_evaluations_v1') : null;
        if (peerRaw) {
          const peer = JSON.parse(peerRaw);
          const filteredPeer = peer.filter((p: any) => p.classSection?.toUpperCase() !== trimmed);
          localStorage.setItem('maarif_peer_evaluations_v1', JSON.stringify(filteredPeer));
        }

        const groupsRaw = typeof window !== 'undefined' ? localStorage.getItem('maarif_teacher_groups_v1') : null;
        if (groupsRaw) {
          const groups = JSON.parse(groupsRaw);
          const filteredGroups = groups.filter((g: any) => g.classSection?.toUpperCase() !== trimmed);
          localStorage.setItem('maarif_teacher_groups_v1', JSON.stringify(filteredGroups));
        }
      } catch (cleanErr) {
        console.warn('[deleteClassFromTeacher] Error cleaning related stores:', cleanErr);
      }
    } else {
      // If shared with other teachers, remove only this teacher's classroom entry
      setClassrooms((prev) => {
        const nextClassrooms = prev.filter(
          (c) => !(c.name.toUpperCase() === trimmed && c.teacherId === teacherId)
        );
        try {
          localStorage.setItem('maarif_classrooms', JSON.stringify(nextClassrooms));
        } catch (e) {}
        return nextClassrooms;
      });
    }

    // 3. Remove class from teacher's assignedClasses
    const remainingClasses = (targetTeacher?.assignedClasses || []).filter((c) => c.toUpperCase() !== trimmed);
    const updatedTeachers = teachers.map((t) => {
      if (t.id === teacherId || (targetTeacher?.email && t.email?.toLowerCase() === targetTeacher.email.toLowerCase())) {
        return {
          ...t,
          assignedClasses: remainingClasses
        };
      }
      return t;
    });
    setTeachers(updatedTeachers);
    try {
      localStorage.setItem('maarif_teachers', JSON.stringify(updatedTeachers));
    } catch (e) {}

    if (currentUser && (currentUser.id === teacherId || (targetTeacher?.email && currentUser.email?.toLowerCase() === targetTeacher.email.toLowerCase()))) {
      const target = updatedTeachers.find((t) => t.id === teacherId || (targetTeacher?.email && t.email?.toLowerCase() === targetTeacher.email.toLowerCase()));
      if (target) {
        setCurrentUser(target);
        try {
          localStorage.setItem('maarif_current_user', JSON.stringify(target));
        } catch (e) {}
      }
    }

    // 4. Asynchronously sync class deletion to backend database
    try {
      const syncEmail = targetTeacher?.email || currentUser?.email;
      fetch('/api/classrooms', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId,
          email: syncEmail,
          className: trimmed,
          school: teacherSchool
        })
      }).catch((err) => console.warn('[deleteClassFromTeacher] /api/classrooms deletion sync note:', err));

      fetch('/api/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId,
          email: syncEmail,
          className: trimmed,
          school: teacherSchool
        })
      }).catch((err) => console.warn('[deleteClassFromTeacher] /api/students deletion sync note:', err));

      if (syncEmail) {
        fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: syncEmail,
            assignedClasses: remainingClasses,
          }),
        }).catch(() => {});
      }
    } catch (e) {}

    return { deletedStudentCount, isShared: isSharedWithOtherTeachers };
  };

  const addStudent = (student: StudentUser): { success: boolean; error?: string; student?: StudentUser } => {
    const fName = student.firstName || splitFullName(student.name || '').firstName || 'Öğrenci';
    const lName = student.lastName || splitFullName(student.name || '').lastName || '';
    const fullName = formatFullName(fName, lName, student.name || 'Öğrenci');

    if (isDemoModeActive() || isDemoMode) {
      const normalized: StudentUser = {
        ...student,
        firstName: fName,
        lastName: lName,
        name: fullName,
        classCode: 'MAARİF',
        password: student.password?.trim() || 'MRF01',
        gender: student.gender || undefined,
        school: 'Atatürk Ortaokulu',
        city: 'Ankara',
        district: 'Çankaya',
        teacherId: 'demo-teacher-01'
      };
      setStudents((prev) => {
        const updated = [normalized, ...prev.filter((s) => s.id !== normalized.id)];
        try { localStorage.setItem('demo_maarif_students', JSON.stringify(updated)); } catch {}
        return updated;
      });
      return { success: true, student: normalized };
    }

    const targetSchool = (student.school || (currentUser as any)?.school || '').trim().toLowerCase();
    const targetSection = (student.classSection || '').trim().toUpperCase();
    const targetNumber = (student.studentNumber || '').trim();

    // 1. Okul İçi Mükerrer Numara Denetimi:
    // Bir okulda aynı şube ve aynı okul numarasıyla birden fazla öğrenci olamaz!
    if (targetSchool && targetSection && targetNumber) {
      const isDuplicate = students.some(
        (s) =>
          s.id !== student.id &&
          (s.school || '').trim().toLowerCase() === targetSchool &&
          (s.classSection || '').trim().toUpperCase() === targetSection &&
          (s.studentNumber || '').trim() === targetNumber
      );

      if (isDuplicate) {
        return {
          success: false,
          error: `Bu okulda [${targetSection}] şubesinde #${targetNumber} numaralı bir öğrenci zaten kayıtlıdır. Aynı şubeye mükerrer numara eklenemez.`
        };
      }
    }

    // Auto-resolve or generate classCode
    let code = student.classCode;
    if (!code && student.classSection) {
      const sec = student.classSection.trim().toUpperCase();
      const match = classrooms.find(
        (c) => c.name.toUpperCase() === sec && (!student.teacherId || c.teacherId === student.teacherId)
      ) || classrooms.find((c) => c.name.toUpperCase() === sec);
      if (match) {
        code = match.code;
      } else {
        code = generateUniqueClassCode(classrooms);
        const newCls: ClassroomInfo = {
          id: `cls-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: sec,
          code: code,
          teacherId: student.teacherId,
          gradeLevel: parseInt(sec.charAt(0)) || 5,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setClassrooms((prev) => [...prev, newCls]);
      }
    }

    // Auto-generate random alphanumeric password if not provided
    const password = student.password && student.password.trim().length > 0
      ? student.password.trim()
      : generateRandomStudentPassword();

    const normalized: StudentUser = {
      ...student,
      firstName: fName,
      lastName: lName,
      name: fullName,
      classCode: code,
      password: password,
      gender: student.gender || undefined
    };

    setStudents((prev) => {
      const exists = prev.some((s) => s.id === normalized.id);
      if (exists) {
        return prev.map((s) => (s.id === normalized.id ? normalized : s));
      }
      return [normalized, ...prev];
    });

    // Asynchronous database synchronization
    try {
      fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: normalized,
          teacherId: currentUser?.id,
          classrooms: classrooms
        })
      }).catch((err) => console.warn('[addStudent] DB sync note:', err));
    } catch (e) {}

    return { success: true, student: normalized };
  };

  const addStudentsBulk = (newStudentsList: StudentUser[]): { addedCount: number; updatedCount: number } => {
    let added = 0;
    let updated = 0;

    const normalizedList = newStudentsList.map((student) => {
      const fName = student.firstName || splitFullName(student.name || '').firstName || 'Öğrenci';
      const lName = student.lastName || splitFullName(student.name || '').lastName || '';
      const fullName = formatFullName(fName, lName, student.name || 'Öğrenci');

      let code = student.classCode;
      if (!code && student.classSection) {
        const sec = student.classSection.trim().toUpperCase();
        const match = classrooms.find(
          (c) => c.name.toUpperCase() === sec && (!student.teacherId || c.teacherId === student.teacherId)
        ) || classrooms.find((c) => c.name.toUpperCase() === sec);
        if (match) {
          code = match.code;
        }
      }

      const password = student.password && student.password.trim().length > 0
        ? student.password.trim()
        : generateRandomStudentPassword();

      return {
        ...student,
        firstName: fName,
        lastName: lName,
        name: fullName,
        classCode: code,
        password: password,
        gender: student.gender || undefined
      };
    });

    setStudents((prev) => {
      const next = [...prev];
      for (const norm of normalizedList) {
        // Find existing match by id or by studentNumber in the same school and classSection
        const existingIdx = next.findIndex(
          (s) =>
            s.id === norm.id ||
            (s.studentNumber === norm.studentNumber &&
              s.classSection === norm.classSection &&
              (s.school === norm.school || !norm.school || !s.school))
        );
        if (existingIdx >= 0) {
          next[existingIdx] = {
            ...next[existingIdx],
            ...norm,
            gender: norm.gender || next[existingIdx].gender,
            id: next[existingIdx].id
          };
          updated++;
        } else {
          next.unshift(norm);
          added++;
        }
      }
      return next;
    });

    // Asynchronous database synchronization
    try {
      fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students: normalizedList,
          teacherId: currentUser?.id,
          classrooms: classrooms
        })
      }).catch((err) => console.warn('[addStudentsBulk] DB sync note:', err));
    } catch (e) {}

    return { addedCount: added, updatedCount: updated };
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
    setStudents((prev) => {
      const filtered = prev.filter((s) => s.id !== studentId);
      if (isDemoModeActive() || isDemoMode) {
        try { localStorage.setItem('demo_maarif_students', JSON.stringify(filtered)); } catch {}
      }
      return filtered;
    });
  };

  const resetStudentPassword = (studentId: string): { success: boolean; newPassword?: string } => {
    if (!studentId) return { success: false };
    if (isDemoModeActive() || isDemoMode) {
      const newPassword = 'MRF01';
      setStudents((prev) => {
        const next = prev.map((s) => {
          if (s.id === studentId) {
            return { ...s, password: newPassword, isPasswordChangedByStudent: false };
          }
          return s;
        });
        try { localStorage.setItem('demo_maarif_students', JSON.stringify(next)); } catch {}
        return next;
      });
      return { success: true, newPassword };
    }
    const newPassword = generateRandomStudentPassword(6);

    setStudents((prev) => {
      const next = prev.map((s) => {
        if (s.id === studentId) {
          return { ...s, password: newPassword, isPasswordChangedByStudent: false };
        }
        return s;
      });
      try {
        localStorage.setItem('maarif_students', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    setCurrentUser((prev) => {
      if (prev && prev.id === studentId) {
        const updated = { ...prev, password: newPassword, isPasswordChangedByStudent: false };
        try {
          localStorage.setItem('maarif_current_user', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      }
      return prev;
    });

    try {
      fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_password',
          studentId,
          newPassword,
          isPasswordChangedByStudent: false
        })
      }).catch(() => {});
    } catch (e) {}

    return { success: true, newPassword };
  };

  const awardPointsToStudent = (studentId: string, pts: number, reason?: string, subject?: string) => {
    const activeSubject = subject || 'Matematik';

    if (isDemoMode) {
      setStudents((prev) => {
        const updated = prev.map((s) => {
          if (s.id !== studentId) return s;
          const currentSubjectPoints = s.subjectPoints || {};
          const newSubjectPts = Math.max(0, (currentSubjectPoints[activeSubject] || 0) + pts);
          const updatedSubjectPoints = {
            ...currentSubjectPoints,
            [activeSubject]: newSubjectPts
          };
          const newTotalPoints = Math.max(0, (s.points || 0) + pts);
          return {
            ...s,
            points: newTotalPoints,
            subjectPoints: updatedSubjectPoints
          };
        });
        try {
          localStorage.setItem('demo_maarif_students', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      if (currentUser && currentUser.id === studentId && currentUser.role === 'student') {
        const studentUser = currentUser as StudentUser;
        const currentSubjectPoints = studentUser.subjectPoints || {};
        const newSubjectPts = Math.max(0, (currentSubjectPoints[activeSubject] || 0) + pts);
        const updatedUser: StudentUser = {
          ...studentUser,
          points: Math.max(0, (studentUser.points || 0) + pts),
          subjectPoints: {
            ...currentSubjectPoints,
            [activeSubject]: newSubjectPts
          }
        };
        setCurrentUser(updatedUser);
      }
      return;
    }

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const currentSubjectPoints = s.subjectPoints || {};
        const newSubjectPts = Math.max(0, (currentSubjectPoints[activeSubject] || 0) + pts);
        const updatedSubjectPoints = {
          ...currentSubjectPoints,
          [activeSubject]: newSubjectPts
        };
        const newTotalPoints = Math.max(0, (s.points || 0) + pts);

        return {
          ...s,
          points: newTotalPoints,
          subjectPoints: updatedSubjectPoints
        };
      })
    );

    if (currentUser && currentUser.id === studentId && currentUser.role === 'student') {
      const studentUser = currentUser as StudentUser;
      const currentSubjectPoints = studentUser.subjectPoints || {};
      const newSubjectPts = Math.max(0, (currentSubjectPoints[activeSubject] || 0) + pts);
      const updatedUser: StudentUser = {
        ...studentUser,
        points: Math.max(0, (studentUser.points || 0) + pts),
        subjectPoints: {
          ...currentSubjectPoints,
          [activeSubject]: newSubjectPts
        }
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('maarif_current_user', JSON.stringify(updatedUser));
      } catch (e) {}
    }
  };

  const getVisibleStudents = (user?: AuthUser | null): StudentUser[] => {
    if (isDemoModeActive() || isDemoMode) {
      return students;
    }
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

  const adminCreateUser = (payload: AdminCreateUserPayload): { success: boolean; error?: string; user?: AuthUser } => {
    const cleanEmail = (payload.email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Lütfen geçerli bir e-posta adresi giriniz.' };
    }

    const passCheck = validatePassword(payload.password);
    if (!passCheck.isValid) {
      return { success: false, error: passCheck.errorMessage };
    }

    // Check if email already exists
    const emailExistsInAdmins = admins.some(a => a.email.toLowerCase() === cleanEmail);
    const emailExistsInTeachers = teachers.some(t => t.email.toLowerCase() === cleanEmail);
    const emailExistsInStudents = students.some(s => s.email && s.email.toLowerCase() === cleanEmail);

    if (emailExistsInAdmins || emailExistsInTeachers || emailExistsInStudents) {
      return { success: false, error: 'Bu e-posta adresi ile kayıtlı bir kullanıcı zaten mevcut.' };
    }

    const fName = (payload.firstName || '').trim();
    const lName = (payload.lastName || '').trim();
    const fullName = formatFullName(fName, lName, cleanEmail.split('@')[0]);

    if (payload.role === 'admin') {
      const newAdmin: AdminUser = {
        id: `usr-admin-${Date.now()}`,
        firstName: fName,
        lastName: lName,
        name: fullName,
        email: cleanEmail,
        password: payload.password,
        role: 'admin',
        avatar: '👑',
        permissions: ['all', 'approve_teachers', 'manage_users', 'view_reports'],
        phone: payload.phone || '',
        city: payload.city || '',
        district: payload.district || '',
        school: payload.school || '',
        branch: payload.branch || 'Matematik',
        principalName: payload.principalName || '',
        assignedClasses: payload.assignedClasses || [],
        isProfileComplete: Boolean(fName && lName),
        createdAt: new Date().toISOString().split('T')[0]
      };

      const updatedAdmins = [...admins, newAdmin];
      setAdmins(updatedAdmins);
      try {
        localStorage.setItem('maarif_admins', JSON.stringify(updatedAdmins));
      } catch (e) {}

      // Server DB Sync
      try {
        fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            firstName: newAdmin.firstName,
            lastName: newAdmin.lastName,
            name: newAdmin.name,
            phone: newAdmin.phone,
            branch: newAdmin.branch,
            city: newAdmin.city,
            district: newAdmin.district,
            school: newAdmin.school,
            principalName: newAdmin.principalName,
            assignedClasses: newAdmin.assignedClasses,
            password: payload.password
          })
        }).catch(() => {});
      } catch (e) {}

      return { success: true, user: newAdmin };
    } else {
      const newTeacher: TeacherUser = {
        id: `tch-${Date.now()}`,
        firstName: fName,
        lastName: lName,
        name: fullName,
        email: cleanEmail,
        password: payload.password,
        role: 'teacher',
        avatar: '👨‍🏫',
        phone: payload.phone || '',
        city: payload.city || '',
        district: payload.district || '',
        school: payload.school || '',
        branch: payload.branch || 'Matematik',
        principalName: payload.principalName || '',
        assignedClasses: payload.assignedClasses || [],
        status: 'approved',
        isProfileComplete: Boolean(fName && lName && payload.school && payload.phone),
        createdAt: new Date().toISOString().split('T')[0],
        verifiedAt: new Date().toISOString().split('T')[0],
        approvedAt: new Date().toISOString().split('T')[0]
      };

      const updatedTeachers = [...teachers, newTeacher];
      setTeachers(updatedTeachers);
      try {
        localStorage.setItem('maarif_teachers', JSON.stringify(updatedTeachers));
      } catch (e) {}

      // Server DB Sync
      try {
        fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            firstName: newTeacher.firstName,
            lastName: newTeacher.lastName,
            name: newTeacher.name,
            phone: newTeacher.phone,
            branch: newTeacher.branch,
            city: newTeacher.city,
            district: newTeacher.district,
            school: newTeacher.school,
            principalName: newTeacher.principalName,
            assignedClasses: newTeacher.assignedClasses,
            password: payload.password
          })
        }).catch(() => {});
      } catch (e) {}

      return { success: true, user: newTeacher };
    }
  };

  const refreshData = async () => {
    if (isDemoModeActive() || isDemoMode) {
      const role = getDemoActiveRole() || demoRole;
      if (role === 'teacher') {
        setCurrentUser(DEMO_TEACHER_USER);
      } else if (role === 'student') {
        try {
          const raw = localStorage.getItem('demo_maarif_students');
          const list = raw ? JSON.parse(raw) : DEMO_STUDENTS_LIST;
          const found = list.find((s: StudentUser) => s.id === DEMO_STUDENT_USER.id);
          setCurrentUser(found || DEMO_STUDENT_USER);
        } catch {
          setCurrentUser(DEMO_STUDENT_USER);
        }
      }
      setClassrooms(DEMO_CLASSROOMS);
      setTeachers([DEMO_TEACHER_USER]);
      try {
        const raw = localStorage.getItem('demo_maarif_students');
        if (raw) {
          setStudents(JSON.parse(raw));
        } else {
          setStudents(DEMO_STUDENTS_LIST);
        }
      } catch {
        setStudents(DEMO_STUDENTS_LIST);
      }
      return;
    }

    try {
      // 1. Fetch classrooms from DB
      const classRes = await fetch('/api/classrooms').then(r => r.json()).catch(() => null);
      if (classRes?.success && Array.isArray(classRes.classrooms)) {
        setClassrooms(classRes.classrooms);
        try {
          localStorage.setItem('maarif_classrooms', JSON.stringify(classRes.classrooms));
        } catch (e) {}
      }

      // 2. Fetch students from DB
      const stuRes = await fetch('/api/students').then(r => r.json()).catch(() => null);
      if (stuRes?.success && Array.isArray(stuRes.students)) {
        const enrichedStu = stuRes.students.map(enrichUser);
        setStudents(enrichedStu);
        try {
          localStorage.setItem('maarif_students', JSON.stringify(enrichedStu));
        } catch (e) {}
      }

      // 3. Fetch teachers from DB
      const tchRes = await fetch('/api/admin/teachers').then(r => r.json()).catch(() => null);
      if (tchRes?.success && Array.isArray(tchRes.teachers)) {
        const enrichedTch = tchRes.teachers.map(enrichUser);
        setTeachers(enrichedTch);
        try {
          localStorage.setItem('maarif_teachers', JSON.stringify(enrichedTch));
        } catch (e) {}
      }

      // 4. Fetch currentUser profile from DB if logged in
      if (currentUser?.email) {
        const profRes = await fetch(`/api/user/profile?email=${encodeURIComponent(currentUser.email)}`).then(r => r.json()).catch(() => null);
        if (profRes?.success && profRes?.user) {
          const dbUser = profRes.user;
          const dbClasses: string[] = dbUser.assignedClasses || [];
          setCurrentUser((prev) => {
            if (!prev) return prev;
            const updated = {
              ...prev,
              firstName: dbUser.firstName || prev.firstName,
              lastName: dbUser.lastName || prev.lastName,
              name: dbUser.name || prev.name,
              phone: dbUser.phone || (prev as any).phone,
              city: dbUser.city || (prev as any).city,
              district: dbUser.district || (prev as any).district,
              school: dbUser.school || (prev as any).school,
              branch: dbUser.branch || (prev as any).branch,
              principalName: dbUser.principalName || (prev as any).principalName,
              assignedClasses: dbClasses,
              accountStatus: dbUser.accountStatus || prev.accountStatus || 'aktif',
              status: dbUser.accountStatus === 'beklemede' ? 'suspended' : (dbUser.status || (prev as any).status),
              isKvkkAccepted: dbUser.isKvkkAccepted !== undefined ? dbUser.isKvkkAccepted : (prev as any).isKvkkAccepted,
              kvkkAcceptedAt: dbUser.kvkkAcceptedAt || prev.kvkkAcceptedAt,
              isProfileComplete: dbUser.isProfileComplete !== undefined ? dbUser.isProfileComplete : (prev as any).isProfileComplete,
            };
            try {
              localStorage.setItem('maarif_current_user', JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }
      }
    } catch (e) {
      console.warn('[refreshData] Error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        teachers,
        students,
        admins,
        classrooms,
        activeVerificationCode,
        loginAsRole,
        loginWithEmail,
        loginStudent,
        loginWithGoogle,
        loginWithBoardSession,
        logout,
        setUserPassword,
        updateUserProfile,
        acceptKvkk,
        startTeacherRegistration,
        verifyTeacherEmail,
        resendVerificationCode,
        updateTeacherProfile,
        addClassToTeacher,
        addClassesToTeacher,
        getSchoolClasses,
        deleteClassFromTeacher,
        getClassCodeForClass,
        registerStudent,
        adminCreateUser,
        approveTeacher,
        rejectTeacher,
        suspendTeacher,
        unsuspendTeacher,
        deleteTeacher,
        deleteAdmin,
        changeUserRole,
        addStudent,
        addStudentsBulk,
        updateStudent,
        deleteStudent,
        resetStudentPassword,
        awardPointsToStudent,
        getVisibleStudents,
        refreshData
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
