import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classSection = searchParams.get('classSection');
    const studentId = searchParams.get('studentId');
    const studentNumber = searchParams.get('studentNumber');

    const where: Record<string, unknown> = {};
    if (classSection && classSection !== 'Tümü') where.classSection = classSection;
    if (studentId) where.studentId = studentId;
    if (studentNumber) where.studentNumber = studentNumber;

    let participations: unknown[] = [];
    try {
      if ((prisma as any).boardParticipation) {
        participations = await (prisma as any).boardParticipation.findMany({
          where,
          orderBy: { timestamp: 'desc' }
        });
      }
    } catch (dbErr) {
      console.warn('Prisma query warning for boardParticipation:', dbErr);
    }

    return NextResponse.json({ success: true, participations });
  } catch (error) {
    console.error('Error fetching board participations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch board participations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      studentName,
      studentNumber,
      classSection = '5-A',
      school,
      teacherId,
      teacherName,
      activityType = 'game',
      activityTitle,
      outcomeCode,
      score,
      maxScore,
      xpEarned = 0
    } = body;

    let createdRecord = null;
    try {
      if ((prisma as any).boardParticipation) {
        createdRecord = await (prisma as any).boardParticipation.create({
          data: {
            studentId: studentId || null,
            studentName: studentName || 'Öğrenci',
            studentNumber: studentNumber || null,
            classSection: classSection || '5-A',
            school: school || null,
            teacherId: teacherId || null,
            teacherName: teacherName || null,
            activityType: activityType,
            activityTitle: activityTitle || 'Akıllı Tahta Etkinliği',
            outcomeCode: outcomeCode || null,
            score: score !== undefined && score !== null ? parseInt(score) : null,
            maxScore: maxScore !== undefined && maxScore !== null ? parseInt(maxScore) : null,
            xpEarned: parseInt(xpEarned) || 0
          }
        });
      }
    } catch (dbErr) {
      console.warn('Prisma insert warning for boardParticipation (using client fallback):', dbErr);
    }

    return NextResponse.json({ success: true, participation: createdRecord });
  } catch (error) {
    console.error('Error creating board participation:', error);
    return NextResponse.json({ success: false, error: 'Failed to create board participation' }, { status: 500 });
  }
}
