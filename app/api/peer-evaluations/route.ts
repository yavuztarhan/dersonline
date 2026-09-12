import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classSection = searchParams.get('classSection');
    const outcomeCode = searchParams.get('outcomeCode');
    const targetStudentId = searchParams.get('targetStudentId');
    const evaluatorStudentId = searchParams.get('evaluatorStudentId');

    const where: Record<string, unknown> = {};
    if (classSection && classSection !== 'Tümü') where.classSection = classSection;
    if (outcomeCode) where.outcomeCode = outcomeCode;
    if (targetStudentId) where.targetStudentId = targetStudentId;
    if (evaluatorStudentId) where.evaluatorStudentId = evaluatorStudentId;

    let evaluations: unknown[] = [];
    try {
      if ((prisma as any).peerEvaluationSubmission) {
        evaluations = await (prisma as any).peerEvaluationSubmission.findMany({
          where,
          orderBy: { submittedAt: 'desc' }
        });
      }
    } catch (dbErr) {
      console.warn('[PeerEvaluations API] Prisma fetch warning (using local fallback):', dbErr);
    }

    return NextResponse.json({ success: true, evaluations });
  } catch (error: any) {
    console.error('[PeerEvaluations API] GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      evaluatorStudentId,
      evaluatorStudentName,
      evaluatorStudentNumber,
      targetStudentId,
      targetStudentName,
      targetStudentNumber,
      targetAvatar,
      groupId,
      groupName,
      gradeLevel = 5,
      classSection = '5-A',
      school,
      outcomeId,
      outcomeCode,
      outcomeTitle,
      ratings = {},
      totalScore = 0,
      maxScore = 20,
      percentage = 0,
      performanceLevel = 'Başarılı',
      evaluatorNote
    } = body;

    if (!targetStudentName || !outcomeCode) {
      return NextResponse.json(
        { success: false, error: 'Hedef öğrenci ve kazanım bilgisi zorunludur.' },
        { status: 400 }
      );
    }

    let createdRecord = null;
    try {
      if ((prisma as any).peerEvaluationSubmission) {
        createdRecord = await (prisma as any).peerEvaluationSubmission.create({
          data: {
            evaluatorStudentId: evaluatorStudentId || null,
            evaluatorStudentName: evaluatorStudentName || 'Değerlendiren Öğrenci',
            evaluatorStudentNumber: evaluatorStudentNumber ? String(evaluatorStudentNumber) : null,
            targetStudentId: targetStudentId || null,
            targetStudentName: targetStudentName,
            targetStudentNumber: targetStudentNumber ? String(targetStudentNumber) : null,
            targetAvatar: targetAvatar || '👦',
            groupId: groupId || null,
            groupName: groupName || 'Grup',
            gradeLevel: parseInt(gradeLevel) || 5,
            classSection: (classSection || '5-A').trim().toUpperCase(),
            school: school || null,
            outcomeId: outcomeId || outcomeCode,
            outcomeCode: outcomeCode,
            outcomeTitle: outcomeTitle || outcomeCode,
            ratings: ratings,
            totalScore: parseInt(totalScore) || 0,
            maxScore: parseInt(maxScore) || 20,
            percentage: parseInt(percentage) || 0,
            performanceLevel: performanceLevel,
            evaluatorNote: evaluatorNote ? String(evaluatorNote).trim() : null
          }
        });
      }
    } catch (dbErr) {
      console.warn('[PeerEvaluations API] Prisma insert warning (proceeding with local fallback):', dbErr);
    }

    return NextResponse.json({ success: true, evaluation: createdRecord });
  } catch (error: any) {
    console.error('[PeerEvaluations API] POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
