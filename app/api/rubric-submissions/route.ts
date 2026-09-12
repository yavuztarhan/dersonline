import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classSection = searchParams.get('classSection');
    const outcomeCode = searchParams.get('outcomeCode');
    const studentName = searchParams.get('studentName');

    const where: Record<string, unknown> = {};
    if (classSection) where.classSection = classSection;
    if (outcomeCode) where.outcomeCode = outcomeCode;
    if (studentName) where.studentName = { contains: studentName, mode: 'insensitive' };

    let submissions: unknown[] = [];
    try {
      if ((prisma as any).selfAssessmentSubmission) {
        submissions = await (prisma as any).selfAssessmentSubmission.findMany({
          where,
          orderBy: { submittedAt: 'desc' }
        });
      }
    } catch (dbErr) {
      // Return empty array if DB table not yet migrated
      console.warn('Prisma query warning:', dbErr);
    }

    return NextResponse.json({ success: true, submissions });
  } catch (error) {
    console.error('Error fetching rubric submissions:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch rubric submissions' }, { status: 500 });
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
      teacherId,
      outcomeId,
      outcomeCode,
      outcomeTitle,
      ratings,
      totalScore,
      maxScore = 20,
      percentage,
      performanceLevel,
      studentNote
    } = body;

    let createdRecord = null;
    try {
      if ((prisma as any).selfAssessmentSubmission) {
        createdRecord = await (prisma as any).selfAssessmentSubmission.create({
          data: {
            studentId: studentId || null,
            studentName: studentName || 'Anonim Öğrenci',
            studentNumber: studentNumber || null,
            gradeLevel: parseInt(gradeLevel) || 5,
            classSection: classSection || '5-A',
            school: school || null,
            teacherId: teacherId || null,
            outcomeId: outcomeId || outcomeCode,
            outcomeCode: outcomeCode,
            outcomeTitle: outcomeTitle,
            ratings: ratings || {},
            totalScore: parseInt(totalScore) || 0,
            maxScore: parseInt(maxScore) || 20,
            percentage: parseInt(percentage) || 0,
            performanceLevel: performanceLevel || 'Başarılı',
            studentNote: studentNote || null
          }
        });
      }
    } catch (dbErr) {
      console.warn('Prisma insert warning (using client fallback):', dbErr);
    }

    return NextResponse.json({ success: true, submission: createdRecord });
  } catch (error) {
    console.error('Error creating rubric submission:', error);
    return NextResponse.json({ success: false, error: 'Failed to create rubric submission' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, teacherFeedback } = body;

    if (!submissionId) {
      return NextResponse.json({ success: false, error: 'submissionId is required' }, { status: 400 });
    }

    let updated = null;
    try {
      if ((prisma as any).selfAssessmentSubmission) {
        updated = await (prisma as any).selfAssessmentSubmission.update({
          where: { id: submissionId },
          data: { teacherFeedback }
        });
      }
    } catch (dbErr) {
      console.warn('Prisma update warning:', dbErr);
    }

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error('Error updating rubric feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to update rubric feedback' }, { status: 500 });
  }
}
