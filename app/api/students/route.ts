import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import {
  hashPassword,
  isPasswordHashed,
  encryptStudentPassword,
  decryptStudentPassword,
  isEncryptedStudentPassword
} from '@/lib/password';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('teacherId');
    const classCode = searchParams.get('classCode');

    const whereClause: any = {
      role: Role.STUDENT,
    };

    if (classCode) {
      whereClause.studentProfile = {
        classCode: { equals: classCode.trim().toUpperCase(), mode: 'insensitive' }
      };
    } else if (teacherId) {
      whereClause.studentProfile = {
        teacherId: teacherId
      };
    }

    try {
      const dbStudents = await prisma.user.findMany({
        where: whereClause,
        include: {
          studentProfile: {
            include: {
              teacher: {
                include: { classrooms: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      const formatted = dbStudents.map((u) => {
        const sp = u.studentProfile;
        const rawPass = u.password || '';
        let decryptedPass = '';
        if (isEncryptedStudentPassword(rawPass)) {
          decryptedPass = decryptStudentPassword(rawPass);
        } else if (isPasswordHashed(rawPass)) {
          // If legacy bcrypt hash exists, fallback to student number or default so raw hash is NEVER exposed
          decryptedPass = sp?.studentNumber || '123456';
        } else {
          decryptedPass = rawPass || '123456';
        }
        if (!decryptedPass || decryptedPass.trim().length === 0) {
          decryptedPass = sp?.studentNumber || '123456';
        }

        return {
          id: u.id,
          name: u.name,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email || undefined,
          password: decryptedPass,
          role: 'student',
          avatar: u.avatar || '🎓',
          studentNumber: sp?.studentNumber || '',
          gradeLevel: sp?.gradeLevel || 5,
          classSection: sp?.classSection || '5-A',
          classCode: sp?.classCode || undefined,
          city: sp?.city || 'Edirne',
          district: sp?.district || 'Merkez',
          school: sp?.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
          teacherId: sp?.teacherId || undefined,
          points: sp?.points || 0,
          isPasswordChangedByStudent: sp?.isPasswordChangedByStudent || false,
          createdAt: u.createdAt.toISOString().split('T')[0]
        };
      });

      return NextResponse.json({ success: true, students: formatted });
    } catch (dbError) {
      console.warn('[Students API] Database fetch note (local fallback):', dbError);
      return NextResponse.json({ success: true, students: [], localOnly: true });
    }
  } catch (error: any) {
    console.error('[Students API] GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { student, students, teacherId, classrooms, action, studentId, studentNumber, newPassword, isPasswordChangedByStudent } = body;

    // Direct password update / reset action for student
    if (action === 'update_password' && (studentId || studentNumber)) {
      try {
        const cleanPass = (newPassword || '').trim();
        const finalStoredPassword = isEncryptedStudentPassword(cleanPass)
          ? cleanPass
          : encryptStudentPassword(cleanPass);
        const studentUser = await prisma.user.findFirst({
          where: {
            role: Role.STUDENT,
            OR: [
              ...(studentId ? [{ id: studentId }] : []),
              ...(studentNumber ? [{ studentProfile: { studentNumber: String(studentNumber).trim() } }] : [])
            ]
          },
          include: { studentProfile: true }
        });

        if (studentUser && studentUser.studentProfile) {
          await prisma.user.update({
            where: { id: studentUser.id },
            data: {
              password: finalStoredPassword,
              studentProfile: {
                update: {
                  isPasswordChangedByStudent: Boolean(isPasswordChangedByStudent)
                }
              }
            }
          });
          return NextResponse.json({ success: true, message: 'Öğrenci şifresi başarıyla güncellendi.' });
        }
      } catch (pwErr: any) {
        console.warn('[Students API] Password update note:', pwErr);
        return NextResponse.json({ success: true, localOnly: true });
      }
    }

    const listToProcess = Array.isArray(students) ? students : student ? [student] : [];

    if (listToProcess.length === 0 && (!classrooms || classrooms.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Öğrenci veya sınıf verisi bulunamadı.' },
        { status: 400 }
      );
    }

    try {
      // 1. Synchronize classrooms if provided
      if (Array.isArray(classrooms) && classrooms.length > 0) {
        for (const cls of classrooms) {
          if (!cls.name) continue;
          const cleanName = String(cls.name).trim().toUpperCase();
          const cleanCode = cls.code ? String(cls.code).trim().toUpperCase() : null;
          const grade = cls.gradeLevel || parseInt(cleanName.charAt(0)) || 5;

          // Find teacher profile if teacherId is provided
          let dbTeacherProfileId = null;
          if (cls.teacherId) {
            const tProf = await prisma.teacherProfile.findFirst({
              where: {
                OR: [{ id: cls.teacherId }, { userId: cls.teacherId }]
              }
            });
            if (tProf) dbTeacherProfileId = tProf.id;
          }

          if (dbTeacherProfileId) {
            const existingCls = await prisma.classroom.findFirst({
              where: {
                teacherId: dbTeacherProfileId,
                name: cleanName
              }
            });

            if (existingCls) {
              await prisma.classroom.update({
                where: { id: existingCls.id },
                data: {
                  code: cleanCode || existingCls.code,
                  gradeLevel: grade
                }
              });
            } else {
              await prisma.classroom.create({
                data: {
                  name: cleanName,
                  code: cleanCode,
                  gradeLevel: grade,
                  school: cls.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
                  teacherId: dbTeacherProfileId
                }
              });
            }
          }
        }
      }

      // 2. Synchronize students
      const savedStudents = [];
      for (const st of listToProcess) {
        const studentNo = String(st.studentNumber || '').trim();
        if (!studentNo) continue;

        const fullName = st.name || `${st.firstName || ''} ${st.lastName || ''}`.trim() || 'Öğrenci';
        const cleanPassword = (st.password || 'admin').trim();
        let finalStoredPassword = cleanPassword;
        if (isEncryptedStudentPassword(cleanPassword)) {
          finalStoredPassword = cleanPassword;
        } else if (isPasswordHashed(cleanPassword)) {
          finalStoredPassword = cleanPassword;
        } else {
          finalStoredPassword = encryptStudentPassword(cleanPassword);
        }
        const cleanSection = (st.classSection || '5-A').trim().toUpperCase();
        const cleanClassCode = st.classCode ? String(st.classCode).trim().toUpperCase() : null;

        // Resolve teacher profile id
        let dbTeacherProfileId = null;
        const targetTeacherId = st.teacherId || teacherId;
        if (targetTeacherId) {
          const tProf = await prisma.teacherProfile.findFirst({
            where: {
              OR: [{ id: targetTeacherId }, { userId: targetTeacherId }]
            }
          });
          if (tProf) dbTeacherProfileId = tProf.id;
        }

        // Check if student profile already exists by studentNumber and school/teacher
        let existingUser = await prisma.user.findFirst({
          where: {
            role: Role.STUDENT,
            studentProfile: {
              studentNumber: studentNo,
              ...(dbTeacherProfileId ? { teacherId: dbTeacherProfileId } : {})
            }
          },
          include: { studentProfile: true }
        });

        if (existingUser && existingUser.studentProfile) {
          // Update existing
          const updatedUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: fullName,
              firstName: st.firstName || existingUser.firstName,
              lastName: st.lastName || existingUser.lastName,
              password: finalStoredPassword,
              gender: st.gender || existingUser.gender,
              studentProfile: {
                update: {
                  classSection: cleanSection,
                  classCode: cleanClassCode || existingUser.studentProfile.classCode,
                  points: st.points !== undefined ? st.points : existingUser.studentProfile.points,
                  teacherId: dbTeacherProfileId || existingUser.studentProfile.teacherId,
                  isPasswordChangedByStudent: st.isPasswordChangedByStudent !== undefined
                    ? Boolean(st.isPasswordChangedByStudent)
                    : existingUser.studentProfile.isPasswordChangedByStudent
                }
              }
            },
            include: { studentProfile: true }
          });
          savedStudents.push(updatedUser);
        } else {
          // Create new student
          const createdUser = await prisma.user.create({
            data: {
              name: fullName,
              firstName: st.firstName || fullName.split(' ')[0] || '',
              lastName: st.lastName || fullName.split(' ').slice(1).join(' ') || '',
              password: finalStoredPassword,
              role: Role.STUDENT,
              avatar: st.avatar || '🎓',
              gender: st.gender || null,
              studentProfile: {
                create: {
                  studentNumber: studentNo,
                  gradeLevel: st.gradeLevel || parseInt(cleanSection.charAt(0)) || 5,
                  classSection: cleanSection,
                  classCode: cleanClassCode,
                  city: st.city || 'Edirne',
                  district: st.district || 'Merkez',
                  school: st.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
                  teacherId: dbTeacherProfileId,
                  points: st.points || 0,
                  isPasswordChangedByStudent: Boolean(st.isPasswordChangedByStudent)
                }
              }
            },
            include: { studentProfile: true }
          });
          savedStudents.push(createdUser);
        }
      }

      return NextResponse.json({
        success: true,
        count: savedStudents.length,
        message: `${savedStudents.length} öğrenci veritabanına kaydedildi.`
      });
    } catch (dbError: any) {
      console.warn('[Students API] Database persistence note (proceeding with local store):', dbError);
      return NextResponse.json({
        success: true,
        localOnly: true,
        message: 'Veritabanı offline modunda çalışıyor, veriler yerel olarak korundu.'
      });
    }
  } catch (error: any) {
    console.error('[Students API] POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { teacherId, className } = body;

    if (!teacherId || !className) {
      return NextResponse.json(
        { success: false, error: 'Öğretmen kimliği ve sınıf adı zorunludur.' },
        { status: 400 }
      );
    }

    const cleanName = String(className).trim().toUpperCase();

    try {
      // 1. Resolve and authenticate teacher profile
      const tProf = await prisma.teacherProfile.findFirst({
        where: {
          OR: [{ id: teacherId }, { userId: teacherId }]
        }
      });

      if (!tProf) {
        return NextResponse.json(
          { success: false, error: 'İşlem için yetkili öğretmen profili bulunamadı.' },
          { status: 403 }
        );
      }
      const dbTeacherProfileId = tProf.id;
      const targetSchool = tProf.school;

      // Check if another teacher in the same school has this class
      const otherTeachersClassCount = await prisma.classroom.count({
        where: {
          name: cleanName,
          teacherId: { not: dbTeacherProfileId },
          ...(targetSchool ? { school: { equals: targetSchool, mode: 'insensitive' as const } } : {})
        }
      });

      const isSharedWithOtherTeachers = otherTeachersClassCount > 0;

      // 2. Delete Classroom record for this teacher
      if (dbTeacherProfileId) {
        await prisma.classroom.deleteMany({
          where: {
            teacherId: dbTeacherProfileId,
            name: cleanName
          }
        });
      }

      // 3. If NOT shared with any other teacher, delete students and associated records
      let userIdsToDelete: string[] = [];
      if (!isSharedWithOtherTeachers) {
        const studentProfiles = await prisma.studentProfile.findMany({
          where: {
            classSection: cleanName,
            ...(targetSchool ? { school: { equals: targetSchool, mode: 'insensitive' as const } } : {})
          },
          select: { id: true, userId: true, studentNumber: true }
        });

        userIdsToDelete = studentProfiles.map((sp) => sp.userId);
        const studentProfileIds = studentProfiles.map((sp) => sp.id);

        // 4. Cascade delete student-related records
        if (studentProfileIds.length > 0) {
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

          // 5. Delete student profiles and user accounts
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
      }

      return NextResponse.json({
        success: true,
        isShared: isSharedWithOtherTeachers,
        deletedStudentCount: userIdsToDelete.length,
        message: isSharedWithOtherTeachers
          ? `${cleanName} sınıfı listenizden kaldırıldı. (Diğer öğretmenlerde kayıtlı olduğu için korundu.)`
          : `${cleanName} sınıfı ve ilgili ${userIdsToDelete.length} öğrenci başarıyla silindi.`
      });
    } catch (dbError: any) {
      console.warn('[Students API] Database delete note (proceeding with local store):', dbError);
      return NextResponse.json({
        success: true,
        localOnly: true,
        message: 'Veritabanı offline modunda çalışıyor, yerel silme tamamlandı.'
      });
    }
  } catch (error: any) {
    console.error('[Students API] DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
