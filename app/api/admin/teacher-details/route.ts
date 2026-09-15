import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('teacherId');
    const email = searchParams.get('email');

    if (!teacherId && !email) {
      return NextResponse.json(
        { success: false, error: 'teacherId veya email parametresi zorunludur.' },
        { status: 400 }
      );
    }

    // 1. Find User by id or email
    const user = await prisma.user.findFirst({
      where: teacherId
        ? {
            OR: [
              { id: teacherId },
              { teacherProfile: { is: { id: teacherId } } },
            ],
          }
        : { email: email!.trim().toLowerCase() },
      include: {
        teacherProfile: {
          include: {
            classrooms: {
              orderBy: { name: 'asc' },
            },
          },
        },
        loginLogs: {
          orderBy: { createdAt: 'desc' },
          take: 30,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Öğretmen bulunamadı.' },
        { status: 404 }
      );
    }

    const profile = user.teacherProfile;
    const classrooms: any[] = (profile as any)?.classrooms || [];
    const classNames = classrooms.map((c: any) => c.name.toUpperCase());
    const classCodes = classrooms
      .map((c: any) => (c.code ? String(c.code).trim().toUpperCase() : ''))
      .filter(Boolean);
    const teacherSchool = (profile?.school || '').trim();

    // 2. Fetch only students belonging strictly to this teacher, these class codes, or this school & section
    const whereConditions: any[] = [];
    if (profile?.id) {
      whereConditions.push({ teacherId: profile.id });
    }
    if (classCodes.length > 0) {
      whereConditions.push({ classCode: { in: classCodes } });
    }
    if (teacherSchool && classNames.length > 0) {
      whereConditions.push({
        AND: [
          { school: { equals: teacherSchool, mode: 'insensitive' } },
          { classSection: { in: classNames } },
          {
            OR: [
              { teacherId: null },
              profile ? { teacherId: profile.id } : undefined,
            ].filter(Boolean),
          },
        ],
      });
    }

    const studentsInDb = whereConditions.length > 0
      ? await prisma.studentProfile.findMany({
          where: { OR: whereConditions },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                lastLoginAt: true,
                loginCount: true,
                createdAt: true,
              },
            },
            _count: {
              select: {
                selfAssessments: true,
                learningJournals: true,
                boardParticipations: true,
              },
            },
          },
          orderBy: { studentNumber: 'asc' },
        })
      : [];

    // 3. Calculate Device Breakdown from Login Logs
    const deviceBreakdown = {
      smartboard: 0,
      mobile: 0,
      desktop: 0,
      windows: 0,
    };

    user.loginLogs.forEach((log) => {
      const cat = (log.deviceCategory || 'desktop').toLowerCase();
      if (cat.includes('smartboard') || cat.includes('tahta') || cat.includes('etap') || cat.includes('pardus')) {
        deviceBreakdown.smartboard++;
      } else if (cat.includes('mobile') || cat.includes('ios') || cat.includes('android')) {
        deviceBreakdown.mobile++;
      } else if (cat.includes('windows')) {
        deviceBreakdown.windows++;
      } else {
        deviceBreakdown.desktop++;
      }
    });

    // 4. Calculate Feedback Given Count (journals with teacherFeedback)
    let feedbackGivenCount = 0;
    try {
      feedbackGivenCount = await prisma.learningJournal.count({
        where: {
          teacherFeedback: { not: null },
          classSection: { in: classNames },
          ...(teacherSchool ? { school: { equals: teacherSchool, mode: 'insensitive' } } : {}),
        },
      });
    } catch (e) {}

    // 5. Structure Students per Classroom (Strict isolation by classCode, teacherId, or school)
    const now = Date.now();
    const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

    const classroomsWithStudents = classrooms.map((cls) => {
      const clsCode = (cls.code || '').trim().toUpperCase();
      const clsName = (cls.name || '').trim().toUpperCase();

      const clsStudents = studentsInDb
        .filter((s) => {
          // A. Direct classCode match (highest priority)
          if (clsCode && s.classCode && s.classCode.trim().toUpperCase() === clsCode) {
            return true;
          }
          // If student has an explicit DIFFERENT classCode, do not put in this classroom
          if (clsCode && s.classCode && s.classCode.trim().toUpperCase() !== clsCode) {
            return false;
          }
          // B. Direct teacherId match and matching classSection
          if (profile && s.teacherId === profile.id && s.classSection.toUpperCase() === clsName) {
            return true;
          }
          // C. School match and classSection match (when student teacherId is null or matches this teacher)
          if (
            teacherSchool &&
            s.school &&
            s.school.trim().toLowerCase() === teacherSchool.toLowerCase() &&
            s.classSection.toUpperCase() === clsName &&
            (!s.teacherId || (profile && s.teacherId === profile.id))
          ) {
            return true;
          }
          return false;
        })
        .map((s) => {
          const lastActive = s.user.lastLoginAt ? new Date(s.user.lastLoginAt).getTime() : null;
          const isAtRisk = !lastActive || (now - lastActive > FOURTEEN_DAYS_MS);

          return {
            id: s.id,
            userId: s.userId,
            studentNumber: s.studentNumber,
            name: s.user.name,
            classSection: s.classSection,
            classCode: s.classCode || cls.code,
            points: s.points,
            lastLoginAt: s.user.lastLoginAt,
            loginCount: s.user.loginCount,
            rubricCount: s._count.selfAssessments,
            journalCount: s._count.learningJournals,
            boardParticipationCount: s._count.boardParticipations,
            isAtRisk,
          };
        });

      const totalXp = clsStudents.reduce((acc, curr) => acc + (curr.points || 0), 0);
      const activeStudentsCount = clsStudents.filter((s) => !s.isAtRisk).length;

      return {
        id: cls.id,
        name: cls.name,
        code: cls.code,
        gradeLevel: cls.gradeLevel,
        school: cls.school,
        totalStudents: clsStudents.length,
        activeStudents: activeStudentsCount,
        totalXp,
        students: clsStudents,
      };
    });

    return NextResponse.json({
      success: true,
      teacher: {
        id: user.id,
        teacherProfileId: profile?.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar || '👨‍🏫',
        phone: profile?.phone || '',
        city: profile?.city || '',
        district: profile?.district || '',
        school: profile?.school || '',
        branch: profile?.branch || 'Matematik',
        principalName: profile?.principalName || '',
        status: (user.accountStatus === 'beklemede' || profile?.status === 'SUSPENDED') ? 'SUSPENDED' : (profile?.status || 'APPROVED'),
        accountStatus: user.accountStatus || (profile?.status === 'SUSPENDED' ? 'beklemede' : 'aktif'),
        verifiedAt: profile?.verifiedAt,
        registeredAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
        loginCount: Math.max(user.loginCount, user.loginLogs.length),
        loginLogs: user.loginLogs.slice(0, 10).map((l) => ({
          id: l.id,
          deviceCategory: l.deviceCategory,
          createdAt: l.createdAt,
        })),
        deviceBreakdown,
        totalClasses: classrooms.length,
        totalStudents: studentsInDb.length,
        feedbackGivenCount,
      },
      classrooms: classroomsWithStudents,
    });
  } catch (error: any) {
    console.error('[TeacherDetails API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
