import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { verifyServerCredentials } from '@/lib/server-user-store';
import {
  detectDeviceCategory,
  DEVICE_SESSION_CONFIGS,
  registerUserActiveSession,
  ActiveUserSession,
  DeviceCategory
} from '@/lib/device-session-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password, clientHint } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'E-posta veya şifre boş bırakılamaz.' },
        { status: 400 }
      );
    }

    const verification = verifyServerCredentials(identifier, password);
    if (!verification.valid || !verification.user) {
      return NextResponse.json(
        { success: false, error: verification.reason || 'Kullanıcı bilgileri veya şifre hatalı.' },
        { status: 401 }
      );
    }

    const user = verification.user;
    const userAgent = req.headers.get('user-agent');
    const deviceCategory: DeviceCategory = detectDeviceCategory(userAgent, clientHint);
    const config = DEVICE_SESSION_CONFIGS[deviceCategory] || DEVICE_SESSION_CONFIGS.desktop;

    const now = Date.now();
    const expiresAt = now + config.durationMs;
    const sessionId = `mrf_sess_${randomBytes(24).toString('hex')}`;

    const activeSession: ActiveUserSession = {
      sessionId,
      userId: user.id,
      userEmail: user.email,
      deviceCategory,
      createdAt: now,
      expiresAt,
      lastActiveAt: now,
      userAgent: userAgent || undefined
    };

    registerUserActiveSession(activeSession);

    return NextResponse.json({
      success: true,
      user,
      sessionId,
      expiresAt,
      deviceCategory
    });
  } catch (e: any) {
    console.error('[LoginVerify API] Error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
