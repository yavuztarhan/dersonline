import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import {
  detectDeviceCategory,
  DEVICE_SESSION_CONFIGS,
  registerUserActiveSession,
  ActiveUserSession,
  DeviceCategory
} from '@/lib/device-session-service';
import { isUserAdmin } from '@/lib/auth-options';
import { verifyPassword, hashPassword, isPasswordHashed } from '@/lib/password';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password, classCode, studentNumber, clientHint } = body;

    const isStudentLogin = Boolean(classCode && studentNumber);

    if (!isStudentLogin && (!identifier || !password)) {
      return NextResponse.json(
        { success: false, error: 'E-posta veya şifre boş bırakılamaz.' },
        { status: 400 }
      );
    }

    if (isStudentLogin && !password) {
      return NextResponse.json(
        { success: false, error: 'Öğrenci şifresi boş bırakılamaz.' },
        { status: 400 }
      );
    }

    const cleanPass = (password || '').trim();

    // Query database directly through Prisma
    let dbUser: any = null;
    if (isStudentLogin) {
      const cleanStudentNo = (studentNumber || '').trim();
      const cleanClassCode = (classCode || '').trim().toUpperCase();

      // Check if there is a classroom matching the entered code or name
      let matchedSection = cleanClassCode;
      try {
        const matchingClassroom = await prisma.classroom.findFirst({
          where: {
            OR: [
              { code: { equals: cleanClassCode, mode: 'insensitive' } },
              { name: { equals: cleanClassCode, mode: 'insensitive' } }
            ]
          }
        });
        if (matchingClassroom?.name) {
          matchedSection = matchingClassroom.name;
        }
      } catch (e) {}

      dbUser = await prisma.user.findFirst({
        where: {
          role: 'STUDENT',
          studentProfile: {
            studentNumber: { equals: cleanStudentNo },
            OR: [
              { classCode: { equals: cleanClassCode, mode: 'insensitive' } },
              { classSection: { equals: cleanClassCode, mode: 'insensitive' } },
              { classSection: { equals: matchedSection, mode: 'insensitive' } },
              {
                teacher: {
                  classrooms: {
                    some: {
                      OR: [
                        { code: { equals: cleanClassCode, mode: 'insensitive' } },
                        { name: { equals: cleanClassCode, mode: 'insensitive' } }
                      ]
                    }
                  }
                }
              }
            ]
          }
        },
        include: {
          teacherProfile: {
            include: { classrooms: true }
          },
          studentProfile: true
        }
      });
    } else {
      const trimmed = (identifier || '').trim().toLowerCase();
      const cleanIdNoSpaces = trimmed.replace(/\s+/g, '');
      dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: trimmed, mode: 'insensitive' } },
            { teacherProfile: { phone: { equals: cleanIdNoSpaces } } },
            { studentProfile: { studentNumber: { equals: trimmed } } }
          ]
        },
        include: {
          teacherProfile: {
            include: { classrooms: true }
          },
          studentProfile: true
        }
      });
    }

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bilgileri veya şifre hatalı.' },
        { status: 401 }
      );
    }

    // Password validation directly against DB stored credential using bcrypt.compare
    const dbPassword = dbUser.password || '';
    
    // Check password strictly using bcryptjs (no backdoors or secondary passwords)
    const isPasswordValid = await verifyPassword(cleanPass, dbPassword);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bilgileri veya şifre hatalı.' },
        { status: 401 }
      );
    }

    // Transparent migration: if stored password was plaintext, hash and update it in the database
    if (!isPasswordHashed(dbPassword)) {
      hashPassword(cleanPass).then((hashed) => {
        prisma.user.update({
          where: { id: dbUser.id },
          data: { password: hashed }
        }).catch((err) => console.warn('[login-verify] Password hash migration note:', err));
      }).catch(() => {});
    }

    const userRole = isUserAdmin(dbUser.email) ? 'admin' : dbUser.role.toLowerCase();
    const userAgent = req.headers.get('user-agent');
    const deviceCategory: DeviceCategory = detectDeviceCategory(userAgent, clientHint);
    const config = DEVICE_SESSION_CONFIGS[deviceCategory] || DEVICE_SESSION_CONFIGS.desktop;

    const now = Date.now();
    const expiresAt = now + config.durationMs;
    const sessionId = `mrf_sess_${randomBytes(24).toString('hex')}`;

    const activeSession: ActiveUserSession = {
      sessionId,
      userId: dbUser.id,
      userEmail: dbUser.email || undefined,
      deviceCategory,
      createdAt: now,
      expiresAt,
      lastActiveAt: now,
      userAgent: userAgent || undefined
    };

    registerUserActiveSession(activeSession);

    // Record login timestamp and login log in PostgreSQL
    try {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          lastLoginAt: new Date(),
          loginCount: { increment: 1 },
          loginLogs: {
            create: {
              deviceCategory,
              userAgent: userAgent || undefined,
            },
          },
        },
      });
    } catch (logErr) {
      console.warn('[LoginVerify] Login logging note:', logErr);
    }

    // Build safe user profile (without password!)
    const safeUser = {
      id: dbUser.id,
      email: dbUser.email || undefined,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      name: dbUser.name,
      gender: (dbUser as any).gender || '',
      role: userRole,
      avatar: dbUser.avatar || (userRole === 'admin' ? '👑' : userRole === 'teacher' ? '👨‍🏫' : '🎓'),
      phone: dbUser.teacherProfile?.phone || '',
      city: dbUser.teacherProfile?.city || dbUser.studentProfile?.city || '',
      district: dbUser.teacherProfile?.district || dbUser.studentProfile?.district || '',
      school: dbUser.teacherProfile?.school || dbUser.studentProfile?.school || '',
      branch: dbUser.teacherProfile?.branch || 'Matematik',
      principalName: dbUser.teacherProfile?.principalName || '',
      assignedClasses: dbUser.teacherProfile?.classrooms?.map((c: any) => c.name) || (userRole === 'teacher' ? ['5-A'] : []),
      accountStatus: dbUser.accountStatus || (dbUser.teacherProfile?.status === 'SUSPENDED' ? 'beklemede' : 'aktif'),
      status: dbUser.accountStatus === 'beklemede' || dbUser.teacherProfile?.status === 'SUSPENDED'
        ? 'suspended'
        : dbUser.teacherProfile?.status?.toLowerCase() || 'approved',
      isKvkkAccepted: dbUser.isKvkkAccepted || Boolean(dbUser.kvkkAcceptedAt),
      kvkkAcceptedAt: dbUser.kvkkAcceptedAt ? dbUser.kvkkAcceptedAt.toISOString() : undefined,
      classCode: dbUser.studentProfile?.classCode || (classCode ? String(classCode).trim().toUpperCase() : undefined),
      classSection: dbUser.studentProfile?.classSection || '5-A',
      studentNumber: dbUser.studentProfile?.studentNumber || '',
      gradeLevel: dbUser.studentProfile?.gradeLevel || 5,
      points: dbUser.studentProfile?.points || 0,
      isProfileComplete: Boolean(
        dbUser.firstName &&
        dbUser.lastName &&
        (userRole !== 'teacher' || (dbUser.teacherProfile?.phone && dbUser.teacherProfile?.school))
      )
    };

    return NextResponse.json({
      success: true,
      user: safeUser,
      sessionId,
      expiresAt,
      deviceCategory
    });
  } catch (e: any) {
    console.error('[LoginVerify API] Database authentication error:', e);
    return NextResponse.json({ success: false, error: 'Sunucu bağlantı hatası.' }, { status: 500 });
  }
}
