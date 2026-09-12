import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email } = body;

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: 'userId veya email parametresi zorunludur.' },
        { status: 400 }
      );
    }

    const cleanEmail = email ? email.trim().toLowerCase() : undefined;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          userId ? { id: userId } : undefined,
          cleanEmail ? { email: cleanEmail } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bulunamadı.' },
        { status: 404 }
      );
    }

    const now = new Date();
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isKvkkAccepted: true,
        kvkkAcceptedAt: now,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        isKvkkAccepted: updatedUser.isKvkkAccepted,
        kvkkAcceptedAt: updatedUser.kvkkAcceptedAt?.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[Accept KVKK API Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'KVKK onayı kaydedilemedi.' },
      { status: 500 }
    );
  }
}
