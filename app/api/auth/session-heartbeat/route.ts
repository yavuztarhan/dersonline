import { NextRequest, NextResponse } from 'next/server';
import { validateUserSession, DeviceCategory } from '@/lib/device-session-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, sessionId, deviceCategory } = body;

    if (!userId || !sessionId || !deviceCategory) {
      return NextResponse.json({ active: true });
    }

    const check = validateUserSession(userId, sessionId, deviceCategory as DeviceCategory);

    if (!check.isValid) {
      let message = 'Oturumunuz sonlandırıldı.';
      if (check.reason === 'replaced_by_newer_device') {
        message =
          deviceCategory === 'smartboard'
            ? 'Hesabınız başka bir akıllı tahtada açıldığı için bu tahtadaki oturum güvenlik amacıyla kapatıldı.'
            : 'Hesabınız başka bir cihazda açıldığı için bu oturum sonlandırıldı.';
      } else if (check.reason === 'expired') {
        message = 'Oturum süreniz doldu. Lütfen tekrar giriş yapınız.';
      }

      return NextResponse.json({
        active: false,
        reason: check.reason,
        message
      });
    }

    return NextResponse.json({ active: true });
  } catch (err: any) {
    return NextResponse.json({ active: true });
  }
}
