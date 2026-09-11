import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/auth-options';

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
          assignedClasses,
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
    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim() || 'Kullanıcı';
    const isAdmin = isUserAdmin(cleanEmail);

    try {
      const user = await prisma.user.upsert({
        where: { email: cleanEmail },
        update: {
          firstName: firstName !== undefined ? firstName : undefined,
          lastName: lastName !== undefined ? lastName : undefined,
          name: fullName,
          gender: gender !== undefined ? gender : undefined,
          ...(password ? { password } : {}),
          ...(isAdmin ? { role: 'ADMIN' } : {}),
        },
        create: {
          email: cleanEmail,
          firstName: firstName || '',
          lastName: lastName || '',
          name: fullName,
          gender: gender || undefined,
          password: password || undefined,
          role: isAdmin ? 'ADMIN' : 'TEACHER',
        },
      });

      // Upsert teacherProfile if user is teacher, or admin who also sets school info
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
          city: city || 'Edirne',
          district: district || 'Merkez',
          school: school || 'Edirne Selimiye İmam Hatip Ortaokulu',
          branch: branch || 'Matematik',
          principalName: principalName || 'Mehmet GÜNGÖR',
          status: 'APPROVED',
        },
      });

      // Save assignedClasses if provided
      if (Array.isArray(assignedClasses) && assignedClasses.length > 0) {
        try {
          await prisma.classroom.deleteMany({
            where: { teacherId: profile.id },
          });

          for (const clsName of assignedClasses) {
            const gradeMatch = String(clsName).match(/^(\d+)/);
            const grade = gradeMatch ? parseInt(gradeMatch[1], 10) : 5;
            await prisma.classroom.create({
              data: {
                name: String(clsName).trim(),
                gradeLevel: grade,
                school: school || profile.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
                teacherId: profile.id,
              },
            });
          }
        } catch (classError) {
          console.warn('Classrooms sync note:', classError);
        }
      }

      return NextResponse.json({ success: true, user });
    } catch (dbError) {
      console.warn('Prisma profile update note (proceeding with local store):', dbError);
      return NextResponse.json({ success: true, localOnly: true });
    }
  } catch (error: any) {
    console.error('Profile API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
