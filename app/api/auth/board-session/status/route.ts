import { NextRequest, NextResponse } from 'next/server';
import { getBoardSession } from '@/lib/device-session-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return NextResponse.json(
        { success: false, error: 'channelId parametresi gereklidir.' },
        { status: 400 }
      );
    }

    const session = getBoardSession(channelId);
    if (!session) {
      return NextResponse.json({
        success: false,
        status: 'expired',
        error: 'Oturum bulunamadı veya süresi doldu.'
      });
    }

    if (session.status === 'approved') {
      return NextResponse.json({
        success: true,
        status: 'approved',
        user: session.approvedUser,
        sessionToken: session.sessionToken,
        expiresAt: session.sessionExpiresAt,
        deviceCategory: session.deviceCategory
      });
    }

    if (session.status === 'expired' || Date.now() > session.expiresAt) {
      return NextResponse.json({
        success: true,
        status: 'expired'
      });
    }

    return NextResponse.json({
      success: true,
      status: 'pending',
      expiresAt: session.expiresAt
    });
  } catch (err: any) {
    console.error('Board session status error:', err);
    return NextResponse.json(
      { success: false, error: 'Oturum durumu kontrol edilemedi.' },
      { status: 500 }
    );
  }
}
