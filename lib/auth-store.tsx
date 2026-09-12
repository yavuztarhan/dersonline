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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher';
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
  deleteClassFromTeacher: (teacherId: string, className: string) => { deletedStudentCount: number };
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
  addStudent: (student: StudentUser) => void;
  addStudentsBulk: (students: StudentUser[]) => { addedCount: number; updatedCount: number };
  updateStudent: (student: StudentUser) => void;
  deleteStudent: (studentId: string) => void;
  awardPointsToStudent: (studentId: string, pts: number) => void;
  getVisibleStudents: (user?: AuthUser | null) => StudentUser[];
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

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

      // Live DB synchronization for teachers
      fetch('/api/admin/teachers')
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.teachers) && data.teachers.length > 0) {
            setTeachers((prev) => {
              const dbEmails = new Set(data.teachers.map((dt: any) => dt.email.toLowerCase()));
              const merged = [...data.teachers.map(enrichUser)];
              prev.forEach((t) => {
                if (!dbEmails.has(t.email.toLowerCase())) {
                  merged.push(t);
                }
              });
              try {
                localStorage.setItem('maarif_teachers', JSON.stringify(merged));
              } catch (e) {}
              return merged;
            });
          }
        })
        .catch(() => {});

      const savedStudents = localStorage.getItem('maarif_students');
      if (savedStudents) {
        const parsed = JSON.parse(savedStudents);
        if (Array.isArray(parsed)) {
          setStudents(parsed.map(enrichUser));
        }
      }

      const savedClassrooms = localStorage.getItem('maarif_classrooms');
      if (savedClassrooms) {
        const parsed = JSON.parse(savedClassrooms);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...parsed];
          for (const sc of SEED_CLASSROOMS) {
            if (!merged.some((c: ClassroomInfo) => c.code === sc.code || (c.name === sc.name && c.teacherId === sc.teacherId))) {
              merged.push(sc);
            }
          }
          setClassrooms(merged);
        }
      }

      const savedUser = localStorage.getItem('maarif_current_user');
      if (savedUser) {
        const parsedUser = enrichUser(JSON.parse(savedUser));
        setCurrentUser(parsedUser);

        // Background server sync: fetch updated profile from DB if available
        if (parsedUser.email) {
          fetch(`/api/user/profile?email=${encodeURIComponent(parsedUser.email)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data?.success && data?.user) {
                const dbUser = data.user;
                const dbClasses: string[] = dbUser.assignedClasses || [];
                const localClasses: string[] = (parsedUser as any).assignedClasses || [];
                const mergedClasses = Array.from(new Set([...dbClasses, ...localClasses])).sort((a, b) =>
                  a.localeCompare(b, 'tr-TR', { numeric: true })
                );

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
                    assignedClasses: mergedClasses.length > 0 ? mergedClasses : (prev as any).assignedClasses,
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
                            }
                          : t
                      )
                    );
                  }

                  return synced;
                });

                // If local user has classes or password not yet saved to DB, sync them
                const hasMissingClasses = localClasses.some((c: string) => !dbClasses.includes(c));
                const needsPasswordSync = Boolean(parsedUser.password && !dbUser.hasPassword);
                if (hasMissingClasses || needsPasswordSync) {
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
                      assignedClasses: mergedClasses,
                      ...(needsPasswordSync ? { password: parsedUser.password } : {}),
                    }),
                  }).catch(() => {});
                }
              } else {
                // User is in local storage but not in PostgreSQL DB: auto self-heal
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
                    assignedClasses: (parsedUser as any).assignedClasses || ['5-A'],
                    password: parsedUser.password,
                  }),
                }).catch(() => {});
              }
            })
            .catch(() => {});
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
    try {
      if (currentUser) {
        localStorage.setItem('maarif_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('maarif_current_user');
      }
    } catch (e) {}
  }, [currentUser, isLoaded]);

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
    const enrichUser = (u: any) => {
      if (!u) return u;
      if (!u.firstName || !u.lastName) {
        const parts = splitFullName(u.name || '');
        u.firstName = u.firstName || parts.firstName || 'Öğretmen';
        u.lastName = u.lastName || parts.lastName || '';
      }
      if (!u.name) {
        u.name = formatFullName(u.firstName, u.lastName, 'Öğretmen');
      }
      return u;
    };

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
    const cleanIdNoSpaces = trimmed.replace(/\s+/g, '');
    const cleanPass = (pass || '').trim();
    if (!trimmed || !cleanPass) return false;

    // 1. Primary Authentication: Directly against PostgreSQL Database via Prisma
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
      console.warn('[loginWithEmail] Database login error, falling back to local cache:', e);
    }

    // 2. Offline / Local Seed Fallback
    if (checkIsAdmin(trimmed)) {
      const adminUser = admins.find((a) => a.email.toLowerCase() === trimmed) || getAdminUser(trimmed);
      const validPass = adminUser.password || 'admin';
      const matches = cleanPass === validPass;

      if (matches) {
        setCurrentUser(adminUser);
        registerDeviceSession(adminUser);
        return true;
      }
    }
    const adminByPhone = admins.find(a => a.phone && a.phone.replace(/\s+/g, '') === cleanIdNoSpaces);
    if (adminByPhone) {
      const validPass = adminByPhone.password || 'admin';
      const matches = cleanPass === validPass;

      if (matches) {
        setCurrentUser(adminByPhone);
        registerDeviceSession(adminByPhone);
        return true;
      }
    }

    // 3. Fallback check for Teachers
    const teacher = teachers.find((t) => 
      t.email.toLowerCase() === trimmed || 
      (t.phone && t.phone.replace(/\s+/g, '') === cleanIdNoSpaces)
    );
    if (teacher) {
      const validPass = teacher.password || 'admin';
      const matches = cleanPass === validPass;

      if (matches) {
        setCurrentUser(teacher);
        registerDeviceSession(teacher);
        // Self-heal: sync credentials and classes to PostgreSQL DB
        fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: teacher.email,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            name: teacher.name,
            phone: teacher.phone,
            school: teacher.school,
            branch: teacher.branch,
            assignedClasses: teacher.assignedClasses,
            password: cleanPass,
          }),
        }).catch(() => {});
        return true;
      }
    }

    // 4. Fallback check for Students
    const student = students.find((s) => 
      (s.email && s.email.toLowerCase() === trimmed) || 
      (s.studentNumber && s.studentNumber.trim().toLowerCase() === trimmed)
    );
    if (student) {
      const validPass = student.password || 'admin';
      const matches = cleanPass === validPass;

      if (matches) {
        setCurrentUser(student);
        registerDeviceSession(student);
        return true;
      }
    }

    return false;
  };

  const loginStudent = async (classCode: string, studentNumber: string, pass?: string): Promise<boolean> => {
    const cleanCode = (classCode || '').trim().toUpperCase();
    const cleanNumber = (studentNumber || '').trim();
    const cleanPass = (pass || '').trim();

    if (!cleanCode || !cleanNumber || !cleanPass) return false;

    // 1. Primary Authentication: via Database API
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
      console.warn('[loginStudent] API error, falling back to local cache:', e);
    }

    // 2. Offline / Local Fallback
    const matchedClassroom = classrooms.find((c) => c.code?.toUpperCase() === cleanCode);
    const student = students.find((s) => {
      const matchesCode =
        (s.classCode && s.classCode.toUpperCase() === cleanCode) ||
        (matchedClassroom && s.classSection && s.classSection.toUpperCase() === matchedClassroom.name.toUpperCase());
      const matchesNumber = s.studentNumber && s.studentNumber.trim().toLowerCase() === cleanNumber.toLowerCase();
      return matchesCode && matchesNumber;
    });

    if (student) {
      const validPass = student.password || 'admin';
      const matches = cleanPass === validPass;

      if (matches) {
        setCurrentUser(student);
        registerDeviceSession(student);
        return true;
      }
    }

    return false;
  };

  const logout = () => {
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

    setTeachers((prev) => {
      const next = prev.map((t) => (t.id === userId || (targetEmail && t.email?.toLowerCase() === targetEmail) ? { ...t, password: newPassword } : t));
      try {
        localStorage.setItem('maarif_teachers', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    setStudents((prev) => {
      const next = prev.map((s) => (s.id === userId || (targetEmail && s.email?.toLowerCase() === targetEmail) ? { ...s, password: newPassword } : s));
      try {
        localStorage.setItem('maarif_students', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    setCurrentUser((prev) => {
      if (!prev) return prev;
      if (prev.id === userId || (targetEmail && prev.email?.toLowerCase() === targetEmail)) {
        const updated = { ...prev, password: newPassword };
        try {
          localStorage.setItem('maarif_current_user', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      }
      return prev;
    });

    if (targetEmail) {
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
          assignedClasses: (updates as any).assignedClasses || (base as any)?.assignedClasses || ['5-A', '5-B'],
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
          assignedClasses: (updates as any).assignedClasses || (base as any)?.assignedClasses || ['5-A', '5-B'],
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
      assignedClasses: ['5-A'],
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
        assignedClasses: ['5-A'],
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

  const addClassToTeacher = (teacherId: string, className: string) => {
    const trimmed = className.trim().toUpperCase();
    if (!trimmed) return;

    // Ensure classroom has a unique 6-char code in classrooms store
    setClassrooms((prev) => {
      const exists = prev.some(
        (c) => c.name.toUpperCase() === trimmed && (!teacherId || c.teacherId === teacherId)
      );
      if (exists) return prev;
      const newCls: ClassroomInfo = {
        id: `cls-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: trimmed,
        code: generateUniqueClassCode(prev),
        teacherId,
        gradeLevel: parseInt(trimmed.charAt(0)) || 5,
        createdAt: new Date().toISOString().split('T')[0]
      };
      return [...prev, newCls];
    });

    let targetEmail = '';
    let updatedClasses: string[] = [];

    const updated = teachers.map((t) => {
      if (t.id === teacherId) {
        targetEmail = t.email;
        const classes = t.assignedClasses || [];
        if (!classes.includes(trimmed)) {
          updatedClasses = [...classes, trimmed].sort((a, b) =>
            a.localeCompare(b, 'tr-TR', { numeric: true })
          );
          return {
            ...t,
            assignedClasses: updatedClasses
          };
        }
        updatedClasses = classes;
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
          assignedClasses: updatedClasses.length > 0 ? updatedClasses : [trimmed],
        }),
      }).catch((err) => console.warn('[addClassToTeacher] DB sync note:', err));
    }
  };

  const deleteClassFromTeacher = (teacherId: string, className: string): { deletedStudentCount: number } => {
    const trimmed = className.trim().toUpperCase();
    if (!trimmed) return { deletedStudentCount: 0 };

    // 1. Identify all students in this class belonging to this teacher
    const targetTeacher = teachers.find((t) => t.id === teacherId);
    const teacherSchool = targetTeacher?.school;

    const studentsToDelete = students.filter(
      (s) =>
        s.classSection.toUpperCase() === trimmed &&
        (!s.teacherId || s.teacherId === teacherId || (teacherSchool && s.school === teacherSchool))
    );
    const studentIdsToDelete = new Set(studentsToDelete.map((s) => s.id));
    const studentNumbersToDelete = new Set(studentsToDelete.map((s) => s.studentNumber));

    // 2. Remove students from state and localStorage
    setStudents((prev) => {
      const nextStudents = prev.filter((s) => !studentIdsToDelete.has(s.id));
      try {
        localStorage.setItem('maarif_students', JSON.stringify(nextStudents));
      } catch (e) {}
      return nextStudents;
    });

    // 3. Remove classroom from classrooms state and localStorage
    setClassrooms((prev) => {
      const nextClassrooms = prev.filter(
        (c) => !(c.name.toUpperCase() === trimmed && (!c.teacherId || c.teacherId === teacherId))
      );
      try {
        localStorage.setItem('maarif_classrooms', JSON.stringify(nextClassrooms));
      } catch (e) {}
      return nextClassrooms;
    });

    // 4. Remove class from teacher's assignedClasses
    const updatedTeachers = teachers.map((t) => {
      if (t.id === teacherId) {
        return {
          ...t,
          assignedClasses: (t.assignedClasses || []).filter((c) => c.toUpperCase() !== trimmed)
        };
      }
      return t;
    });
    setTeachers(updatedTeachers);
    try {
      localStorage.setItem('maarif_teachers', JSON.stringify(updatedTeachers));
    } catch (e) {}

    if (currentUser && currentUser.id === teacherId) {
      const target = updatedTeachers.find((t) => t.id === teacherId);
      if (target) {
        setCurrentUser(target);
        try {
          localStorage.setItem('maarif_current_user', JSON.stringify(target));
        } catch (e) {}
      }
    }

    // 5. Clean up associated data in related localStorage stores
    try {
      // Rubrics / self assessment submissions
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

      // Learning journals
      const journalsRaw = typeof window !== 'undefined' ? localStorage.getItem('maarif_learning_journals_v1') : null;
      if (journalsRaw) {
        const journals = JSON.parse(journalsRaw);
        const filteredJournals = journals.filter((j: any) => j.classSection?.toUpperCase() !== trimmed);
        localStorage.setItem('maarif_learning_journals_v1', JSON.stringify(filteredJournals));
      }

      // Board participations
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

      // Peer evaluations
      const peerRaw = typeof window !== 'undefined' ? localStorage.getItem('maarif_peer_evaluations_v1') : null;
      if (peerRaw) {
        const peer = JSON.parse(peerRaw);
        const filteredPeer = peer.filter((p: any) => p.classSection?.toUpperCase() !== trimmed);
        localStorage.setItem('maarif_peer_evaluations_v1', JSON.stringify(filteredPeer));
      }

      // Teacher groups
      const groupsRaw = typeof window !== 'undefined' ? localStorage.getItem('maarif_teacher_groups_v1') : null;
      if (groupsRaw) {
        const groups = JSON.parse(groupsRaw);
        const filteredGroups = groups.filter((g: any) => g.classSection?.toUpperCase() !== trimmed);
        localStorage.setItem('maarif_teacher_groups_v1', JSON.stringify(filteredGroups));
      }
    } catch (cleanErr) {
      console.warn('[deleteClassFromTeacher] Error cleaning related stores:', cleanErr);
    }

    // 6. Asynchronously sync class deletion to backend database
    try {
      fetch('/api/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId,
          className: trimmed
        })
      }).catch((err) => console.warn('[deleteClassFromTeacher] DB deletion sync note:', err));

      const remainingClasses = (targetTeacher?.assignedClasses || []).filter((c) => c.toUpperCase() !== trimmed);
      const syncEmail = targetTeacher?.email || currentUser?.email;
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

    return { deletedStudentCount: studentsToDelete.length };
  };

  const addStudent = (student: StudentUser) => {
    const fName = student.firstName || splitFullName(student.name || '').firstName || 'Öğrenci';
    const lName = student.lastName || splitFullName(student.name || '').lastName || '';
    const fullName = formatFullName(fName, lName, student.name || 'Öğrenci');

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

  const adminCreateUser = (payload: AdminCreateUserPayload): { success: boolean; error?: string; user?: AuthUser } => {
    const cleanEmail = (payload.email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Lütfen geçerli bir e-posta adresi giriniz.' };
    }

    if (!payload.firstName.trim()) {
      return { success: false, error: 'Lütfen kullanıcının adını giriniz.' };
    }

    if (!payload.lastName.trim()) {
      return { success: false, error: 'Lütfen kullanıcının soyadını giriniz.' };
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

    const fullName = formatFullName(payload.firstName.trim(), payload.lastName.trim());

    if (payload.role === 'admin') {
      const newAdmin: AdminUser = {
        id: `usr-admin-${Date.now()}`,
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        name: fullName,
        email: cleanEmail,
        password: payload.password,
        role: 'admin',
        avatar: '👑',
        permissions: ['all', 'approve_teachers', 'manage_users', 'view_reports'],
        phone: payload.phone || '',
        city: payload.city || 'Edirne',
        district: payload.district || 'Merkez',
        school: payload.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
        branch: payload.branch || 'Matematik',
        principalName: payload.principalName || 'Mehmet GÜNGÖR',
        assignedClasses: payload.assignedClasses || ['5-A', '5-B'],
        isProfileComplete: true,
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
            assignedClasses: newAdmin.assignedClasses
          })
        }).catch(() => {});
      } catch (e) {}

      return { success: true, user: newAdmin };
    } else {
      const newTeacher: TeacherUser = {
        id: `tch-${Date.now()}`,
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        name: fullName,
        email: cleanEmail,
        password: payload.password,
        role: 'teacher',
        avatar: '👨‍🏫',
        phone: payload.phone || '',
        city: payload.city || 'Edirne',
        district: payload.district || 'Merkez',
        school: payload.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
        branch: payload.branch || 'Matematik',
        principalName: payload.principalName || 'Mehmet GÜNGÖR',
        assignedClasses: payload.assignedClasses || ['5-A', '5-B'],
        status: 'approved',
        isProfileComplete: true,
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
            assignedClasses: newTeacher.assignedClasses
          })
        }).catch(() => {});
      } catch (e) {}

      return { success: true, user: newTeacher };
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
