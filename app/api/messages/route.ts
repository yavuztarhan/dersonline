import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const RETENTION_DAYS = 90;

/**
 * 90 Günden Eski Mesajları Veritabanından Otomatik Temizleme Fonksiyonu
 */
async function cleanupOldMessages() {
  try {
    const cutoffDate = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
    const result = await prisma.message.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });
    if (result.count > 0) {
      console.log(`[Message Retention] 90 günden eski ${result.count} adet mesaj veritabanından otomatik olarak silindi.`);
    }
  } catch (error) {
    console.warn('[Message Retention Cleanup Note]:', error);
  }
}

export async function GET(req: NextRequest) {
  try {
    // 1. 90 günden eski mesajları temizle
    await cleanupOldMessages();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: 'userId veya email parametresi gereklidir.' },
        { status: 400 }
      );
    }

    const cleanEmail = email?.trim().toLowerCase();
    const isPoweroseAdmin =
      cleanEmail === 'powerose@gmail.com' ||
      userId === 'usr-admin-powerose' ||
      userId === 'usr-admin-1';

    // Olası alıcı/gönderici kimlik havuzu
    const targetIds = new Set<string>();
    if (userId) targetIds.add(userId);
    if (cleanEmail) targetIds.add(cleanEmail);

    if (isPoweroseAdmin) {
      targetIds.add('usr-admin-powerose');
      targetIds.add('usr-admin-1');
      targetIds.add('powerose@gmail.com');
    }

    // Veritabanında kullanıcı profili varsa onun id'lerini de ekle
    if (userId || cleanEmail) {
      try {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              userId ? { id: userId } : undefined,
              cleanEmail ? { email: cleanEmail } : undefined,
            ].filter(Boolean) as any,
          },
          include: { teacherProfile: true, studentProfile: true },
        });
        if (dbUser) {
          targetIds.add(dbUser.id);
          if (dbUser.teacherProfile) targetIds.add(dbUser.teacherProfile.id);
          if (dbUser.studentProfile) targetIds.add(dbUser.studentProfile.id);
        }
      } catch (e) {}
    }

    const idsArray = Array.from(targetIds);
    const cutoffDate = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { receiverId: { in: idsArray } },
          { senderId: { in: idsArray } },
        ],
        createdAt: {
          gte: cutoffDate, // Kesin 90 gün filtresi
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      retentionDays: RETENTION_DAYS,
      messages: messages.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        senderName: m.senderName,
        senderRole: m.senderRole,
        senderAvatar: m.senderAvatar || '👨‍🏫',
        receiverId: m.receiverId,
        receiverName: m.receiverName,
        receiverRole: m.receiverRole,
        receiverClassSection: m.receiverClassSection || undefined,
        title: m.title,
        content: m.content,
        read: m.read,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('[Messages GET Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Mesajlar listelenemedi.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 90 günden eski mesajları temizle
    cleanupOldMessages().catch(() => {});

    const body = await req.json();
    const {
      id,
      senderId,
      senderName,
      senderRole,
      senderAvatar,
      receiverId,
      receiverName,
      receiverRole,
      receiverClassSection,
      title,
      content,
    } = body;

    if (!senderId || !receiverId || !content) {
      return NextResponse.json(
        { success: false, error: 'Gönderen, alıcı ve mesaj içeriği zorunludur.' },
        { status: 400 }
      );
    }

    const trimmedContent = String(content).trim();
    if (trimmedContent.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Mesaj metni 500 karakterden uzun olamaz.' },
        { status: 400 }
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        ...(id && !id.startsWith('msg-') ? { id } : {}),
        senderId: String(senderId),
        senderName: String(senderName || 'Kullanıcı'),
        senderRole: String(senderRole || 'teacher'),
        senderAvatar: senderAvatar ? String(senderAvatar) : null,
        receiverId: String(receiverId),
        receiverName: String(receiverName || 'Kullanıcı'),
        receiverRole: String(receiverRole || 'admin'),
        receiverClassSection: receiverClassSection ? String(receiverClassSection) : null,
        title: String(title || 'Genel Mesaj').trim(),
        content: trimmedContent,
        read: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: {
        id: newMessage.id,
        senderId: newMessage.senderId,
        senderName: newMessage.senderName,
        senderRole: newMessage.senderRole,
        senderAvatar: newMessage.senderAvatar || '👨‍🏫',
        receiverId: newMessage.receiverId,
        receiverName: newMessage.receiverName,
        receiverRole: newMessage.receiverRole,
        receiverClassSection: newMessage.receiverClassSection || undefined,
        title: newMessage.title,
        content: newMessage.content,
        read: newMessage.read,
        createdAt: newMessage.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[Messages POST Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Mesaj kaydedilemedi.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { messageId, read } = body;

    if (!messageId) {
      return NextResponse.json(
        { success: false, error: 'messageId parametresi zorunludur.' },
        { status: 400 }
      );
    }

    await prisma.message.update({
      where: { id: messageId },
      data: {
        read: read !== undefined ? Boolean(read) : true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Messages PATCH Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Mesaj güncellenemedi.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { messageId } = body;

    if (!messageId) {
      return NextResponse.json(
        { success: false, error: 'messageId parametresi zorunludur.' },
        { status: 400 }
      );
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Messages DELETE Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Mesaj silinemedi.' },
      { status: 500 }
    );
  }
}
