import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/auth-options';
import { hashPassword, isPasswordHashed } from '@/lib/password';

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
    } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const hasNameInput = Boolean(name || firstName || lastName);
    const computedFullName = hasNameInput
      ? (name || `${firstName || ''} ${lastName || ''}`.trim())
      : undefined;
    const isAdmin = isUserAdmin(cleanEmail);

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
          ...(isAdmin ? { role: 'ADMIN' } : {}),
        },
        create: {
          email: cleanEmail,
          firstName: firstName || '',
          lastName: lastName || '',
          name: computedFullName || 'Kullanıcı',
          gender: gender || undefined,
          password: hashedPassword || undefined,
          role: isAdmin ? 'ADMIN' : 'TEACHER',
        },
      });

      // Upsert teacherProfile only if user is teacher, or non-admin with school info
      if (!isAdmin && (user.role === 'TEACHER' || school || phone)) {
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
                const safeCode = `MRF${clsName.replace(/[^A-Z0-9]/g, '')}${Math.floor(10 + Math.random() * 90)}`;
                await prisma.classroom.create({
                  data: {
                    name: clsName,
                    code: safeCode,
                    gradeLevel: grade,
                    school: school || profile.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
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

      return NextResponse.json({ success: true, user });
    } catch (dbError: any) {
      console.error('[Profile API] Database update error:', dbError);
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Profile API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
