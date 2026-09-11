import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/auth-options';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, firstName, lastName, name, phone, branch, city, district, school, principalName } = body;

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
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          name: fullName,
          ...(isAdmin ? { role: 'ADMIN' } : {}),
        },
        create: {
          email: cleanEmail,
          firstName: firstName || '',
          lastName: lastName || '',
          name: fullName,
          role: isAdmin ? 'ADMIN' : 'TEACHER',
        },
      });

      // If teacher, also update or create TeacherProfile
      if (user.role === 'TEACHER' || !isAdmin) {
        await prisma.teacherProfile.upsert({
          where: { userId: user.id },
          update: {
            phone: phone || undefined,
            city: city || 'Edirne',
            district: district || 'Merkez',
            school: school || 'Edirne Selimiye İmam Hatip Ortaokulu',
            branch: branch || 'Matematik',
            principalName: principalName || undefined,
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
