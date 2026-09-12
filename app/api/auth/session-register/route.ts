import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
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

    // Record login to PostgreSQL
    try {
      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { id: userId },
            { email: userEmail.toLowerCase() },
          ],
        },
      });

      if (dbUser) {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            lastLoginAt: new Date(now),
            loginCount: { increment: 1 },
            loginLogs: {
              create: {
                deviceCategory,
                userAgent: userAgent || undefined,
              },
            },
          },
        });
      }
    } catch (e) {
      console.warn('[session-register] DB login log note:', e);
    }

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
