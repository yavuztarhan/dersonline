import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/auth-options';
import { hashPassword, isPasswordHashed, generateRandomClassCode } from '@/lib/password';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email parametresi gereklidir' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: {
          teacherProfile: {
            include: {
              classrooms: true,
            },
          },
          studentProfile: true,
        },
      });

      if (!user) {
        return NextResponse.json({ success: false, error: 'Kullanıcı bulunamadı' }, { status: 404 });
      }

      const assignedClasses = user.teacherProfile?.classrooms?.map((c) => c.name) || [];

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          gender: (user as any).gender || '',
          role: user.role.toLowerCase(),
          avatar: user.avatar,
          phone: user.teacherProfile?.phone || '',
          city: user.teacherProfile?.city || '',
          district: user.teacherProfile?.district || '',
          school: user.teacherProfile?.school || user.studentProfile?.school || '',
          branch: user.teacherProfile?.branch || 'Matematik',
          principalName: user.teacherProfile?.principalName || '',
          hasPassword: Boolean(user.password),
          assignedClasses,
          accountStatus: user.accountStatus || 'aktif',
          status: user.teacherProfile?.status?.toLowerCase() || (user.accountStatus === 'beklemede' ? 'suspended' : 'approved'),
          isKvkkAccepted: user.isKvkkAccepted || Boolean(user.kvkkAcceptedAt),
          kvkkAcceptedAt: user.kvkkAcceptedAt ? user.kvkkAcceptedAt.toISOString() : undefined,
          isProfileComplete: Boolean(
            user.firstName &&
            user.lastName &&
            (user.role !== 'TEACHER' || (user.teacherProfile?.phone && user.teacherProfile?.school))
          ),
        },
      });
    } catch (dbError) {
      console.warn('Prisma profile fetch note (falling back to local):', dbError);
      return NextResponse.json({ success: false, localOnly: true }, { status: 200 });
    }
  } catch (error: any) {
    console.error('Profile GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      firstName,
      lastName,
      name,
      phone,
      branch,
      city,
      district,
      school,
      principalName,
      assignedClasses,
      password,
      gender,
      role,
    } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const hasNameInput = Boolean(name || firstName || lastName);
    const computedFullName = hasNameInput
      ? (name || `${firstName || ''} ${lastName || ''}`.trim())
      : undefined;
    const isExplicitAdmin = role && String(role).toUpperCase() === 'ADMIN';
    const isExplicitTeacher = role && String(role).toUpperCase() === 'TEACHER';
    const isAdmin = isExplicitAdmin || isUserAdmin(cleanEmail);

    const hashedPassword = password
      ? (isPasswordHashed(password) ? password : await hashPassword(password))
      : undefined;

    try {
      const user = await prisma.user.upsert({
        where: { email: cleanEmail },
        update: {
          firstName: firstName !== undefined ? firstName : undefined,
          lastName: lastName !== undefined ? lastName : undefined,
          ...(computedFullName ? { name: computedFullName } : {}),
          gender: gender !== undefined ? gender : undefined,
          ...(hashedPassword ? { password: hashedPassword } : {}),
          ...(isAdmin ? { role: 'ADMIN' } : isExplicitTeacher ? { role: 'TEACHER' } : {}),
        },
        create: {
          email: cleanEmail,
          firstName: firstName || '',
          lastName: lastName || '',
          name: computedFullName || (cleanEmail.split('@')[0] || 'Kullanıcı'),
          gender: gender || undefined,
          password: hashedPassword || undefined,
          role: isAdmin ? 'ADMIN' : 'TEACHER',
        },
      });

      // Upsert teacherProfile only if user is teacher, or non-admin with school info
      if (!isAdmin && (user.role === 'TEACHER' || isExplicitTeacher || school || phone)) {
        const profile = await prisma.teacherProfile.upsert({
          where: { userId: user.id },
          update: {
            phone: phone !== undefined ? phone : undefined,
            city: city || undefined,
            district: district || undefined,
            school: school || undefined,
            branch: branch || undefined,
            principalName: principalName !== undefined ? principalName : undefined,
            status: 'APPROVED',
          },
          create: {
            userId: user.id,
            phone: phone || '',
            city: city || '',
            district: district || '',
            school: school || '',
            branch: branch || 'Matematik',
            principalName: principalName || '',
            status: 'APPROVED',
          },
        });

        // Save assignedClasses if provided
        if (Array.isArray(assignedClasses) && assignedClasses.length > 0) {
          try {
            const cleanClassNames = assignedClasses
              .map((c) => String(c).trim().toUpperCase())
              .filter(Boolean);

            const existingClasses = await prisma.classroom.findMany({
              where: { teacherId: profile.id },
            });
            const existingNames = new Set(existingClasses.map((c) => c.name.toUpperCase()));

            for (const clsName of cleanClassNames) {
              if (!existingNames.has(clsName)) {
                const gradeMatch = clsName.match(/^(\d+)/);
                const grade = gradeMatch ? parseInt(gradeMatch[1], 10) : 5;
                let safeCode = generateRandomClassCode();
                let attempts = 0;
                while (attempts < 10) {
                  const exists = await prisma.classroom.findUnique({ where: { code: safeCode } });
                  if (!exists) break;
                  safeCode = generateRandomClassCode();
                  attempts++;
                }
                await prisma.classroom.create({
                  data: {
                    name: clsName,
                    code: safeCode,
                    gradeLevel: grade,
                    school: school || profile.school || '',
                    teacherId: profile.id,
                  },
                });
              }
            }

            // Remove classrooms that are no longer assigned
            await prisma.classroom.deleteMany({
              where: {
                teacherId: profile.id,
                name: { notIn: cleanClassNames },
              },
            });
          } catch (classError) {
            console.warn('[Profile API] Classrooms sync note:', classError);
          }
        }
      }

      const completeUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          teacherProfile: {
            include: { classrooms: true },
          },
          studentProfile: true,
        },
      });

      const assignedClassesList = completeUser?.teacherProfile?.classrooms?.map((c) => c.name) || [];

      return NextResponse.json({
        success: true,
        user: {
          id: completeUser?.id || user.id,
          email: completeUser?.email || user.email,
          firstName: completeUser?.firstName || user.firstName,
          lastName: completeUser?.lastName || user.lastName,
          name: completeUser?.name || user.name,
          gender: (completeUser as any)?.gender || '',
          role: (completeUser?.role || user.role).toLowerCase(),
          avatar: completeUser?.avatar || user.avatar,
          phone: completeUser?.teacherProfile?.phone || '',
          city: completeUser?.teacherProfile?.city || '',
          district: completeUser?.teacherProfile?.district || '',
          school: completeUser?.teacherProfile?.school || completeUser?.studentProfile?.school || '',
          branch: completeUser?.teacherProfile?.branch || 'Matematik',
          principalName: completeUser?.teacherProfile?.principalName || '',
          hasPassword: Boolean(completeUser?.password),
          assignedClasses: assignedClassesList,
          accountStatus: completeUser?.accountStatus || 'aktif',
          status: completeUser?.teacherProfile?.status?.toLowerCase() || (completeUser?.accountStatus === 'beklemede' ? 'suspended' : 'approved'),
          isKvkkAccepted: completeUser?.isKvkkAccepted || Boolean(completeUser?.kvkkAcceptedAt),
          kvkkAcceptedAt: completeUser?.kvkkAcceptedAt ? completeUser?.kvkkAcceptedAt.toISOString() : undefined,
          isProfileComplete: Boolean(
            completeUser?.firstName &&
            completeUser?.lastName &&
            (completeUser?.role !== 'TEACHER' || (completeUser?.teacherProfile?.phone && completeUser?.teacherProfile?.school))
          ),
        },
      });
    } catch (dbError: any) {
      console.error('[Profile API] Database update error:', dbError);
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Profile API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
