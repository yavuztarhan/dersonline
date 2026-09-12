import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TeacherStatus } from '@prisma/client';

export async function GET() {
  try {
    const dbTeachers = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'TEACHER' },
          { teacherProfile: { isNot: null } },
        ],
      },
      include: {
        teacherProfile: {
          include: {
            classrooms: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const teachers = dbTeachers.map((u) => {
      const profile = u.teacherProfile;
      const assignedClasses = profile?.classrooms?.map((c) => c.name) || [];
      const isSuspended = u.accountStatus === 'beklemede' || profile?.status === 'SUSPENDED';

      return {
        id: u.id,
        teacherProfileId: profile?.id,
        email: u.email || '',
        name: u.name,
        firstName: u.firstName,
        lastName: u.lastName,
        role: 'teacher' as const,
        avatar: u.avatar || '👨‍🏫',
        phone: profile?.phone || '',
        city: profile?.city || '',
        district: profile?.district || '',
        school: profile?.school || '',
        branch: profile?.branch || 'Matematik',
        principalName: profile?.principalName || '',
        status: isSuspended ? 'suspended' : (profile?.status?.toLowerCase() || 'approved'),
        accountStatus: u.accountStatus || (isSuspended ? 'beklemede' : 'aktif'),
        isKvkkAccepted: Boolean(u.isKvkkAccepted || u.kvkkAcceptedAt),
        kvkkAcceptedAt: u.kvkkAcceptedAt ? u.kvkkAcceptedAt.toISOString() : undefined,
        assignedClasses,
        createdAt: u.createdAt.toISOString(),
        verifiedAt: profile?.verifiedAt?.toISOString(),
        isProfileComplete: Boolean(
          u.firstName &&
          u.lastName &&
          profile?.phone &&
          profile?.school
        ),
      };
    });

    return NextResponse.json({ success: true, teachers });
  } catch (error: any) {
    console.error('[Admin Teachers GET] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Öğretmenler listelenemedi.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { teacherId, email, action, reason } = body;

    if (!teacherId && !email) {
      return NextResponse.json(
        { success: false, error: 'teacherId veya email gereklidir.' },
        { status: 400 }
      );
    }

    const cleanEmail = (email || (teacherId && teacherId.includes('@') ? teacherId : '')).trim().toLowerCase();

    // Find user directly using unique lookups (id, teacherProfile id, or email)
    let user = teacherId
      ? await prisma.user.findUnique({
          where: { id: teacherId },
          include: { teacherProfile: true },
        })
      : null;

    if (!user && teacherId) {
      const profile = await prisma.teacherProfile.findUnique({
        where: { id: teacherId },
        include: { user: true },
      });
      if (profile?.user) {
        user = {
          ...profile.user,
          teacherProfile: profile,
        };
      }
    }

    if (!user && cleanEmail) {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: { teacherProfile: true },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bulunamadı.' },
        { status: 404 }
      );
    }

    let nextStatus: TeacherStatus;
    switch (action) {
      case 'suspend':
        nextStatus = TeacherStatus.SUSPENDED;
        break;
      case 'unsuspend':
      case 'approve':
        nextStatus = TeacherStatus.APPROVED;
        break;
      case 'reject':
        nextStatus = TeacherStatus.REJECTED;
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Geçersiz işlem türü (suspend, unsuspend, approve, reject).' },
          { status: 400 }
        );
    }

    const nextAccountStatus = action === 'suspend' ? 'beklemede' : 'aktif';

    // Update User accountStatus
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        accountStatus: nextAccountStatus,
      },
    });

    // Update or create TeacherProfile if applicable
    let updatedProfile = user.teacherProfile;
    if (user.teacherProfile) {
      updatedProfile = await prisma.teacherProfile.update({
        where: { id: user.teacherProfile.id },
        data: {
          status: nextStatus,
          rejectionReason: action === 'reject' ? reason || 'Yönetici tarafından reddedildi.' : undefined,
          approvedAt: nextStatus === TeacherStatus.APPROVED ? new Date() : undefined,
        },
      });
    }

    return NextResponse.json({
      success: true,
      teacherId: updatedProfile?.id || updatedUser.id,
      userId: updatedUser.id,
      status: action === 'suspend' ? 'suspended' : (updatedProfile?.status?.toLowerCase() || 'approved'),
      accountStatus: nextAccountStatus,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        accountStatus: nextAccountStatus,
        isKvkkAccepted: Boolean(updatedUser.isKvkkAccepted || updatedUser.kvkkAcceptedAt),
        kvkkAcceptedAt: updatedUser.kvkkAcceptedAt?.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[Admin Teachers PATCH] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Öğretmen durumu güncellenemedi.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { teacherId, email } = body;

    if (!teacherId && !email) {
      return NextResponse.json(
        { success: false, error: 'teacherId veya email gereklidir.' },
        { status: 400 }
      );
    }

    const cleanEmail = (email || (teacherId && teacherId.includes('@') ? teacherId : '')).trim().toLowerCase();

    // 1. Find user & teacher profile
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(teacherId ? [{ id: teacherId }, { teacherProfile: { id: teacherId } }] : []),
          ...(cleanEmail ? [{ email: { equals: cleanEmail, mode: 'insensitive' as const } }] : []),
        ],
      },
      include: {
        teacherProfile: {
          include: {
            classrooms: true,
          },
        },
      },
    });

    if (!user && cleanEmail) {
      user = await prisma.user.findFirst({
        where: {
          email: { equals: cleanEmail, mode: 'insensitive' as const },
        },
        include: {
          teacherProfile: {
            include: {
              classrooms: true,
            },
          },
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Silinecek öğretmen bulunamadı.' },
        { status: 404 }
      );
    }

    const profile = user.teacherProfile;
    const teacherName = user.name;
    const classrooms = profile?.classrooms || [];
    const classNames = classrooms.map((c) => c.name.toUpperCase());

    let deletedStudentsCount = 0;
    let deletedClassroomsCount = classrooms.length;

    // 2. Cascade delete all students belonging to this teacher
    if (profile) {
      const studentsToDelete = await prisma.studentProfile.findMany({
        where: {
          OR: [
            { teacherId: profile.id },
            ...(classNames.length > 0 ? [{ classSection: { in: classNames } }] : []),
          ],
        },
        select: { id: true, userId: true },
      });

      deletedStudentsCount = studentsToDelete.length;
      const studentProfileIds = studentsToDelete.map((s) => s.id);
      const studentUserIds = studentsToDelete.map((s) => s.userId);

      if (studentProfileIds.length > 0) {
        // Delete related student activities
        await prisma.selfAssessmentSubmission.deleteMany({
          where: { studentId: { in: studentProfileIds } },
        }).catch(() => {});

        await prisma.learningJournal.deleteMany({
          where: { studentId: { in: studentProfileIds } },
        }).catch(() => {});

        await prisma.boardParticipation.deleteMany({
          where: { studentId: { in: studentProfileIds } },
        }).catch(() => {});

        await prisma.peerEvaluationSubmission.deleteMany({
          where: {
            OR: [
              { evaluatorStudentId: { in: studentProfileIds } },
              { targetStudentId: { in: studentProfileIds } },
            ],
          },
        }).catch(() => {});

        await prisma.outcomeProgress.deleteMany({
          where: { studentId: { in: studentProfileIds } },
        }).catch(() => {});

        await prisma.studentBadge.deleteMany({
          where: { studentId: { in: studentProfileIds } },
        }).catch(() => {});

        // Delete student profiles
        await prisma.studentProfile.deleteMany({
          where: { id: { in: studentProfileIds } },
        }).catch(() => {});

        // Delete student user accounts
        await prisma.user.deleteMany({
          where: { id: { in: studentUserIds } },
        }).catch(() => {});
      }

      // Delete classrooms
      await prisma.classroom.deleteMany({
        where: { teacherId: profile.id },
      }).catch(() => {});

      // Delete teacher profile
      await prisma.teacherProfile.delete({
        where: { id: profile.id },
      }).catch(() => {});
    }

    // Delete teacher messages
    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: user.id },
          { receiverId: user.id },
          ...(profile ? [{ senderId: profile.id }, { receiverId: profile.id }] : [])
        ]
      }
    }).catch(() => {});

    // Delete teacher user and their login logs
    await prisma.loginLog.deleteMany({
      where: { userId: user.id },
    }).catch(() => {});

    await prisma.user.delete({
      where: { id: user.id },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      deletedTeacherName: teacherName,
      deletedClassesCount: deletedClassroomsCount,
      deletedStudentsCount,
    });
  } catch (error: any) {
    console.error('[Admin Teachers DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Öğretmen ve ilişkili veriler silinemedi.' },
      { status: 500 }
    );
  }
}
