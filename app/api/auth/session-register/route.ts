import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
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
    const { userId, userEmail, clientHint, clientSessionToken } = body;

    if (!userId || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bilgisi eksik.' },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get('user-agent');
    const deviceCategory: DeviceCategory = detectDeviceCategory(userAgent, clientHint);
    const config = DEVICE_SESSION_CONFIGS[deviceCategory] || DEVICE_SESSION_CONFIGS.desktop;

    const now = Date.now();
    const expiresAt = now + config.durationMs;
    const sessionId = clientSessionToken || `mrf_sess_${randomBytes(24).toString('hex')}`;

    const activeSession: ActiveUserSession = {
      sessionId,
      userId,
      userEmail,
      deviceCategory,
      createdAt: now,
      expiresAt,
      lastActiveAt: now,
      userAgent: userAgent || undefined
    };

    registerUserActiveSession(activeSession);

    return NextResponse.json({
      success: true,
      sessionId,
      expiresAt,
      deviceCategory,
      durationLabel: config.durationLabel
    });
  } catch (err: any) {
    console.error('Session register error:', err);
    return NextResponse.json(
      { success: false, error: 'Oturum kaydedilemedi.' },
      { status: 500 }
    );
  }
}
