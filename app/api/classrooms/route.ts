import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/classrooms
 * Okula veya öğretmene ait sınıfları veritabanından sorgular.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const school = searchParams.get('school');
    const city = searchParams.get('city');
    const district = searchParams.get('district');
    const teacherId = searchParams.get('teacherId');
    const email = searchParams.get('email');

    const cleanSchool = school ? decodeURIComponent(school).trim() : null;
    const cleanCity = city ? decodeURIComponent(city).trim() : null;
    const cleanDistrict = district ? decodeURIComponent(district).trim() : null;
    const cleanEmail = email ? decodeURIComponent(email).trim().toLowerCase() : null;

    try {
      // 1. Öğretmen profilini tespit et (varsa)
      let currentTeacherProfile: any = null;
      if (cleanEmail || teacherId) {
        currentTeacherProfile = await prisma.teacherProfile.findFirst({
          where: {
            OR: [
              ...(cleanEmail ? [{ user: { email: { equals: cleanEmail, mode: 'insensitive' as const } } }] : []),
              ...(teacherId ? [{ id: teacherId }, { userId: teacherId }] : []),
            ]
          },
          include: { classrooms: true }
        });
      }

      const targetSchool = cleanSchool || currentTeacherProfile?.school || null;
      const targetCity = cleanCity || currentTeacherProfile?.city || null;
      const targetDistrict = cleanDistrict || currentTeacherProfile?.district || null;

      // 2. İl, İlçe ve Okula ait tüm sınıfları veritabanından çek (Classroom tablosu)
      const classroomWhere: any = {};
      if (targetSchool) {
        classroomWhere.school = { equals: targetSchool, mode: 'insensitive' as const };
      }
      if (targetCity) {
        classroomWhere.city = { equals: targetCity, mode: 'insensitive' as const };
      }
      if (targetDistrict) {
        classroomWhere.district = { equals: targetDistrict, mode: 'insensitive' as const };
      }

      const dbClassrooms = await prisma.classroom.findMany({
        where: Object.keys(classroomWhere).length > 0 ? classroomWhere : undefined,
        include: {
          teacher: {
            include: {
              user: {
                select: { name: true, email: true }
              }
            }
          }
        },
        orderBy: { name: 'asc' }
      });

      // 3. Okula ait öğrencilerin kayıtlı olduğu şubeleri çek (StudentProfile tablosu)
      const studentWhere: any = {};
      if (targetSchool) {
        studentWhere.school = { equals: targetSchool, mode: 'insensitive' as const };
      }
      if (targetCity) {
        studentWhere.city = { equals: targetCity, mode: 'insensitive' as const };
      }
      if (targetDistrict) {
        studentWhere.district = { equals: targetDistrict, mode: 'insensitive' as const };
      }

      const studentSections = await prisma.studentProfile.findMany({
        where: Object.keys(studentWhere).length > 0 ? studentWhere : undefined,
        select: { classSection: true },
        distinct: ['classSection']
      });

      // 4. Okula ait tüm benzersiz sınıf isimlerini birleştir
      const classSet = new Set<string>();
      dbClassrooms.forEach((c) => {
        if (c.name) classSet.add(c.name.trim().toUpperCase());
      });
      studentSections.forEach((s) => {
        if (s.classSection) classSet.add(s.classSection.trim().toUpperCase());
      });

      const sortedClasses = Array.from(classSet).sort((a, b) =>
        a.localeCompare(b, 'tr-TR', { numeric: true })
      );

      // 5. Bu öğretmene atanmış sınıflar
      const teacherAssignedClasses = currentTeacherProfile?.classrooms?.map((c: any) => c.name.trim().toUpperCase()) || [];

      return NextResponse.json({
        success: true,
        school: targetSchool || '',
        city: targetCity || '',
        district: targetDistrict || '',
        schoolClasses: sortedClasses,
        classrooms: dbClassrooms.map((c) => ({
          id: c.id,
          name: c.name,
          code: c.code,
          gradeLevel: c.gradeLevel,
          city: c.city,
          district: c.district,
          school: c.school,
          teacherId: c.teacherId,
          teacherName: c.teacher?.user?.name || undefined
        })),
        teacherClasses: teacherAssignedClasses
      });
    } catch (dbError: any) {
      console.warn('[Classrooms API GET] Database note (falling back):', dbError);
      return NextResponse.json({
        success: true,
        schoolClasses: [],
        classrooms: [],
        teacherClasses: [],
        localOnly: true
      });
    }
  } catch (err: any) {
    console.error('[Classrooms API GET] Server error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/classrooms
 * Öğretmene yeni sınıf/şubeler ekler veya okula yeni sınıf tanımlar.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { teacherId, email, school, city, district, classNames, className, code, gradeLevel } = body;

    const cleanEmail = email ? String(email).trim().toLowerCase() : null;
    const listToAdd = Array.isArray(classNames)
      ? classNames
      : className
      ? [className]
      : [];

    if (listToAdd.length === 0) {
      return NextResponse.json({ success: false, error: 'Eklenecek sınıf adı belirtilmedi.' }, { status: 400 });
    }

    try {
      // 1. Öğretmen profilini tespit et
      let tProf: any = null;
      if (cleanEmail || teacherId) {
        tProf = await prisma.teacherProfile.findFirst({
          where: {
            OR: [
              ...(cleanEmail ? [{ user: { email: { equals: cleanEmail, mode: 'insensitive' as const } } }] : []),
              ...(teacherId ? [{ id: teacherId }, { userId: teacherId }] : [])
            ]
          }
        });

        if (!tProf) {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                ...(cleanEmail ? [{ email: { equals: cleanEmail, mode: 'insensitive' as const } }] : []),
                ...(teacherId ? [{ id: teacherId }] : [])
              ]
            }
          });
          if (user) {
            tProf = await prisma.teacherProfile.upsert({
              where: { userId: user.id },
              update: {
                school: school || undefined,
                city: city || undefined,
                district: district || undefined,
              },
              create: {
                userId: user.id,
                phone: '',
                school: school || '',
                city: city || '',
                district: district || '',
                branch: 'Matematik',
                status: 'APPROVED'
              }
            });
          }
        }
      }

      const targetSchool = school || tProf?.school || 'Edirne Selimiye İmam Hatip Ortaokulu';
      const targetCity = city || tProf?.city || 'Edirne';
      const targetDistrict = district || tProf?.district || 'Merkez';

      // 2. Her sınıfı veritabanına ekle / ilişkilendir
      const createdClassrooms = [];
      for (const rawName of listToAdd) {
        const cleanName = String(rawName).trim().toUpperCase();
        if (!cleanName) continue;

        const grade = gradeLevel || parseInt(cleanName.charAt(0)) || 5;
        const generatedCode = code ? String(code).trim().toUpperCase() : `MRF${cleanName.replace(/[^A-Z0-9]/g, '')}${Math.floor(10 + Math.random() * 90)}`;

        if (tProf) {
          // Öğretmende bu sınıf zaten var mı?
          const existing = await prisma.classroom.findFirst({
            where: {
              teacherId: tProf.id,
              name: cleanName
            }
          });

          if (!existing) {
            const newCls = await prisma.classroom.create({
              data: {
                name: cleanName,
                code: generatedCode,
                gradeLevel: grade,
                city: targetCity,
                district: targetDistrict,
                school: targetSchool,
                teacherId: tProf.id
              }
            });
            createdClassrooms.push(newCls);
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: `${listToAdd.length} sınıf başarıyla kaydedildi.`,
        createdCount: createdClassrooms.length
      });
    } catch (dbError: any) {
      console.warn('[Classrooms API POST] Database note:', dbError);
      return NextResponse.json({ success: true, localOnly: true });
    }
  } catch (err: any) {
    console.error('[Classrooms API POST] Server error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/classrooms
 * Sınıf silme: Eğer başka öğretmende kayıtlı değilse veritabanından tamamen siler.
 * Başka öğretmende kayıtlıysa sadece bu öğretmenin atamasını kaldırır.
 */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { teacherId, email, className, school } = body;

    if (!className) {
      return NextResponse.json({ success: false, error: 'Sınıf adı zorunludur.' }, { status: 400 });
    }

    const cleanName = String(className).trim().toUpperCase();
    const cleanEmail = email ? String(email).trim().toLowerCase() : null;

    try {
      // 1. Öğretmen profilini tespit et
      let tProf: any = null;
      if (cleanEmail || teacherId) {
        tProf = await prisma.teacherProfile.findFirst({
          where: {
            OR: [
              ...(cleanEmail ? [{ user: { email: { equals: cleanEmail, mode: 'insensitive' as const } } }] : []),
              ...(teacherId ? [{ id: teacherId }, { userId: teacherId }] : [])
            ]
          }
        });
      }

      const dbTeacherProfileId = tProf?.id || teacherId;
      const targetSchool = school || tProf?.school;

      // 2. Bu sınıfa atanmış BAŞKA bir öğretmen var mı kontrol et
      const otherTeachersClassCount = await prisma.classroom.count({
        where: {
          name: cleanName,
          ...(dbTeacherProfileId ? { teacherId: { not: dbTeacherProfileId } } : {}),
          ...(targetSchool ? { school: { equals: targetSchool, mode: 'insensitive' as const } } : {})
        }
      });

      const isSharedWithOtherTeachers = otherTeachersClassCount > 0;

      // 3. Silen öğretmenin Classroom kaydını sil
      if (dbTeacherProfileId) {
        await prisma.classroom.deleteMany({
          where: {
            teacherId: dbTeacherProfileId,
            name: cleanName
          }
        });
      }

      // 4. Eğer başka öğretmende kayıtlı DEĞİLSE: Sınıfı ve tüm öğrencileri veritabanından kalıcı olarak sil
      let deletedStudentCount = 0;
      if (!isSharedWithOtherTeachers) {
        // Okul ve şubeye ait öğrenci profillerini bul
        const studentProfiles = await prisma.studentProfile.findMany({
          where: {
            classSection: cleanName,
            ...(targetSchool ? { school: { equals: targetSchool, mode: 'insensitive' as const } } : {})
          },
          select: { id: true, userId: true }
        });

        const userIdsToDelete = studentProfiles.map((sp) => sp.userId);
        const studentProfileIds = studentProfiles.map((sp) => sp.id);
        deletedStudentCount = userIdsToDelete.length;

        if (studentProfileIds.length > 0) {
          // İlgili kayıtları sil (cascade)
          await prisma.selfAssessmentSubmission.deleteMany({
            where: {
              OR: [
                { classSection: cleanName },
                { studentId: { in: studentProfileIds } }
              ]
            }
          }).catch(() => {});

          await prisma.learningJournal.deleteMany({
            where: {
              OR: [
                { classSection: cleanName },
                { studentId: { in: studentProfileIds } }
              ]
            }
          }).catch(() => {});

          await prisma.peerEvaluationSubmission.deleteMany({
            where: {
              OR: [
                { classSection: cleanName },
                { evaluatorStudentId: { in: studentProfileIds } },
                { targetStudentId: { in: studentProfileIds } }
              ]
            }
          }).catch(() => {});

          await prisma.boardParticipation.deleteMany({
            where: {
              OR: [
                { classSection: cleanName },
                { studentId: { in: studentProfileIds } }
              ]
            }
          }).catch(() => {});

          await prisma.studentProfile.deleteMany({
            where: { id: { in: studentProfileIds } }
          }).catch(() => {});

          await prisma.user.deleteMany({
            where: {
              id: { in: userIdsToDelete },
              role: Role.STUDENT
            }
          }).catch(() => {});
        }

        // Kalan genel classroom kayıtlarını da temizle
        await prisma.classroom.deleteMany({
          where: {
            name: cleanName,
            ...(targetSchool ? { school: { equals: targetSchool, mode: 'insensitive' as const } } : {})
          }
        }).catch(() => {});

        return NextResponse.json({
          success: true,
          isShared: false,
          deletedStudentCount,
          message: `${cleanName} sınıfı ve ilgili ${deletedStudentCount} öğrenci veritabanından kalıcı olarak silindi.`
        });
      } else {
        // Başka öğretmenlerde kayıtlı olduğu için öğrenciler korundu
        return NextResponse.json({
          success: true,
          isShared: true,
          deletedStudentCount: 0,
          message: `${cleanName} sınıfı listenizden kaldırıldı. Okulunuzdaki diğer öğretmenlerde kayıtlı olduğu için ortak sınıf havuzunda korundu.`
        });
      }
    } catch (dbError: any) {
      console.warn('[Classrooms API DELETE] Database note:', dbError);
      return NextResponse.json({ success: true, localOnly: true });
    }
  } catch (err: any) {
    console.error('[Classrooms API DELETE] Server error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
