import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classSection = searchParams.get('classSection');
    const outcomeCode = searchParams.get('outcomeCode');
    const studentId = searchParams.get('studentId');
    const studentNumber = searchParams.get('studentNumber');

    const where: Record<string, unknown> = {};
    if (classSection && classSection !== 'Tümü') where.classSection = classSection;
    if (outcomeCode) where.outcomeCode = outcomeCode;
    if (studentId) where.studentId = studentId;
    if (studentNumber) where.studentNumber = studentNumber;

    let journals: unknown[] = [];
    try {
      if ((prisma as any).learningJournal) {
        journals = await (prisma as any).learningJournal.findMany({
          where,
          orderBy: { submittedAt: 'desc' }
        });
      }
    } catch (dbErr) {
      console.warn('[LearningJournals API] Prisma fetch warning (using local fallback):', dbErr);
    }

    return NextResponse.json({ success: true, journals });
  } catch (error: any) {
    console.error('[LearningJournals API] GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      studentName,
      studentNumber,
      gradeLevel = 5,
      classSection = '5-A',
      school,
      outcomeId,
      outcomeCode,
      outcomeTitle,
      prompt,
      studentReflection
    } = body;

    if (!studentReflection || !outcomeCode) {
      return NextResponse.json(
        { success: false, error: 'Yansıtma metni ve kazanım kodu zorunludur.' },
        { status: 400 }
      );
    }

    let createdJournal = null;
    try {
      if ((prisma as any).learningJournal) {
        // Attempt to find student profile id if only studentId or studentNumber provided
        let resolvedStudentProfileId = null;
        if (studentId) {
          const sp = await prisma.studentProfile.findFirst({
            where: { OR: [{ id: studentId }, { userId: studentId }] }
          });
          if (sp) resolvedStudentProfileId = sp.id;
        }

        createdJournal = await (prisma as any).learningJournal.create({
          data: {
            studentId: resolvedStudentProfileId || studentId || null,
            studentName: studentName || 'Öğrenci',
            studentNumber: studentNumber ? String(studentNumber).trim() : null,
            gradeLevel: parseInt(gradeLevel) || 5,
            classSection: (classSection || '5-A').trim().toUpperCase(),
            school: school || null,
            outcomeId: outcomeId || outcomeCode,
            outcomeCode: outcomeCode,
            outcomeTitle: outcomeTitle || outcomeCode,
            prompt: prompt || 'Öğrenme Yansıtması',
            studentReflection: String(studentReflection).trim(),
            teacherFeedback: null,
            teacherLiked: false
          }
        });
      }
    } catch (dbErr) {
      console.warn('[LearningJournals API] Prisma insert warning (proceeding with local fallback):', dbErr);
    }

    return NextResponse.json({ success: true, journal: createdJournal });
  } catch (error: any) {
    console.error('[LearningJournals API] POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, teacherFeedback, teacherLiked } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Günlük kimliği (id) zorunludur.' },
        { status: 400 }
      );
    }

    let updated = null;
    try {
      if ((prisma as any).learningJournal) {
        const updateData: Record<string, unknown> = {};
        if (teacherFeedback !== undefined) updateData.teacherFeedback = teacherFeedback;
        if (teacherLiked !== undefined) updateData.teacherLiked = Boolean(teacherLiked);

        updated = await (prisma as any).learningJournal.update({
          where: { id },
          data: updateData
        });
      }
    } catch (dbErr) {
      console.warn('[LearningJournals API] Prisma update warning:', dbErr);
    }

    return NextResponse.json({ success: true, journal: updated });
  } catch (error: any) {
    console.error('[LearningJournals API] PATCH error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
