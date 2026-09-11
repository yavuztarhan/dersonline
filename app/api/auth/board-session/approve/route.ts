import { NextRequest, NextResponse } from 'next/server';
import { approveBoardSession } from '@/lib/device-session-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { channelId, pin, teacherUser } = body;

    if (!channelId && !pin) {
      return NextResponse.json(
        { success: false, error: 'QR kod (channelId) veya 4 haneli PIN girilmelidir.' },
        { status: 400 }
      );
    }

    if (!teacherUser || !teacherUser.id || (teacherUser.role !== 'teacher' && teacherUser.role !== 'admin')) {
      return NextResponse.json(
        { success: false, error: 'Yalnızca yetkili öğretmen ve yöneticiler akıllı tahta girişini onaylayabilir.' },
        { status: 403 }
      );
    }

    const result = approveBoardSession({ channelId, pin }, teacherUser);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Onaylama başarısız.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Akıllı tahta oturumu ${teacherUser.name} adına başarıyla açıldı!`,
      sessionExpiresAt: result.session?.sessionExpiresAt,
      deviceCategory: result.session?.deviceCategory
    });
  } catch (err: any) {
    console.error('Board session approve error:', err);
    return NextResponse.json(
      { success: false, error: 'Oturum onaylanırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
