import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import {
  createBoardSession,
  detectDeviceCategory,
  DEVICE_SESSION_CONFIGS
} from '@/lib/device-session-service';

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get('user-agent') || '';
    let body: any = {};
    try {
      body = await req.json();
    } catch (e) {}

    // Detect device category (Pardus / Linux / Windows / Mobile / etc.)
    const clientHint = body.clientHint || req.headers.get('x-device-category');
    const deviceCategory = detectDeviceCategory(userAgent, clientHint);
    const config = DEVICE_SESSION_CONFIGS[deviceCategory] || DEVICE_SESSION_CONFIGS.smartboard;

    const boardSession = createBoardSession(deviceCategory);

    // QR Payload: Contains channelId and PIN formatted for camera detection
    const qrPayload = JSON.stringify({
      type: 'maarif_board_auth',
      channelId: boardSession.channelId,
      pin: boardSession.pin
    });

    // Generate high-quality QR code data URL
    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });

    return NextResponse.json({
      success: true,
      channelId: boardSession.channelId,
      pin: boardSession.pin,
      expiresAt: boardSession.expiresAt,
      deviceCategory,
      durationLabel: config.durationLabel,
      deviceName: config.name,
      qrDataUrl
    });
  } catch (err: any) {
    console.error('Board session create error:', err);
    return NextResponse.json(
      { success: false, error: 'Akıllı tahta oturumu oluşturulamadı.' },
      { status: 500 }
    );
  }
}
