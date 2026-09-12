'use client';

import { checkContentSafety } from '@/lib/profanity-filter';
import { UserRole } from '@/types/auth';

export interface MessageRecord {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverRole: UserRole;
  receiverClassSection?: string;
  title: string;
  content: string; // Max 300 chars
  read: boolean;
  createdAt: string;
}

const STORAGE_MESSAGES_KEY = 'maarif_messages_v1';

// Seed Messages
const SEED_MESSAGES: MessageRecord[] = [
  // Admin to Teacher
  {
    id: 'msg-seed-1',
    senderId: 'usr-admin-1',
    senderName: 'Maarif Sistem Yöneticisi',
    senderRole: 'admin',
    senderAvatar: '🛡️',
    receiverId: 'tch-101',
    receiverName: 'Ayşe Yılmaz',
    receiverRole: 'teacher',
    title: 'Yeni Dönem Müfredat ve Rubrik Güncellemeleri',
    content: 'Değerli Öğretmenimiz, Türkiye Yüzyılı Maarif Modeli 5. ve 6. sınıf geometri kazanımları ve süreç odaklı rubrik formları sisteme başarıyla yüklenmiştir. İyi çalışmalar dileriz.',
    read: false,
    createdAt: '2026-09-09T09:30:00Z'
  },
  // Teacher to Student
  {
    id: 'msg-seed-2',
    senderId: 'tch-101',
    senderName: 'Ayşe Yılmaz (Matematik Öğretmeni)',
    senderRole: 'teacher',
    senderAvatar: '👩‍🏫',
    receiverId: 'stu-201',
    receiverName: 'Çırak Hasan',
    receiverRole: 'student',
    receiverClassSection: '5-A',
    title: 'Harika Oyun Performansı ve Tebrik',
    content: 'Sevgili Hasan, Doğruların Durumu ve Çarpım Tablosu oyunundaki yüksek skorunu ve kombo başarını gördüm. Seni tebrik ederim, grup arkadaşlarına da liderlik etmeni bekliyorum!',
    read: false,
    createdAt: '2026-09-10T10:15:00Z'
  },
  // Student to Teacher
  {
    id: 'msg-seed-3',
    senderId: 'stu-101',
    senderName: 'Ahmet Yılmaz',
    senderRole: 'student',
    senderAvatar: '👦',
    receiverId: 'tch-101',
    receiverName: 'Ayşe Yılmaz',
    receiverRole: 'teacher',
    title: 'İletki Kullanımı ve Açı Sorusu',
    content: 'Öğretmenim, açı dedektifi oyunundaki 135 derecelik geniş açıyı iletki simülasyonuyla ölçerken başlangıç çizgisini doğru yerleştirdim. Yarınki derste pergel inşa çizimini de yapacak mıyız?',
    read: true,
    createdAt: '2026-09-08T14:20:00Z'
  }
];

export function getStoredMessages(): MessageRecord[] {
  if (typeof window === 'undefined') return SEED_MESSAGES;
  try {
    const raw = localStorage.getItem(STORAGE_MESSAGES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(SEED_MESSAGES));
      return SEED_MESSAGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_MESSAGES;
  } catch (err) {
    console.warn('Mesajlar yüklenirken hata oluştu:', err);
    return SEED_MESSAGES;
  }
}

function saveStoredMessages(messages: MessageRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages));
  } catch (err) {
    console.warn('Mesajlar kaydedilirken hata oluştu:', err);
  }
}

/**
 * Hiyerarşik İzin Kontrolü:
 * - Admin: Öğretmenlere ve Adminlere yazabilir.
 * - Öğretmen: Adminlere ve Öğrencilere yazabilir.
 * - Öğrenci: Öğretmenlerine ve Sistem Yöneticisine (Görüş Bildirme/Admin) mesaj gönderebilir.
 * - Tüm roller geri bildirim ve destek için Admin'e mesaj gönderebilir.
 */
export function canUserMessageRecipient(senderRole: UserRole, receiverRole: UserRole): boolean {
  // Tüm kullanıcılar (öğrenci, öğretmen, admin) Sistem Yöneticisine (Admin) görüş/mesaj iletebilir
  if (receiverRole === 'admin') return true;

  if (senderRole === 'admin') {
    return receiverRole === 'teacher';
  }
  if (senderRole === 'teacher') {
    return receiverRole === 'student';
  }
  if (senderRole === 'student') {
    return receiverRole === 'teacher';
  }
  return false;
}

/**
 * Mesajların gönderilme tarih ve saatini formatlar (Örn: 11 Eylül 2026, 14:30)
 */
export function formatMessageDateTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
}

export function getInboxForUser(userId: string): MessageRecord[] {
  const all = getStoredMessages();
  const isPoweroseAdmin = userId === 'usr-admin-powerose' || userId.toLowerCase().includes('powerose');
  return all
    .filter((m) => {
      if (m.receiverId === userId) return true;
      if (isPoweroseAdmin && (m.receiverId === 'usr-admin-powerose' || m.receiverId === 'usr-admin-1')) return true;
      return false;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const DAILY_MESSAGE_LIMIT = 5;

export function getSentForUser(userId: string): MessageRecord[] {
  const all = getStoredMessages();
  return all.filter((m) => m.senderId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Kullanıcının bugün gönderdiği toplam mesaj sayısını döner.
 */
export function getDailySentMessageCount(userId: string): number {
  const sent = getSentForUser(userId);
  const todayStr = new Date().toDateString();
  return sent.filter((m) => {
    try {
      const msgDate = new Date(m.createdAt).toDateString();
      return msgDate === todayStr;
    } catch {
      return false;
    }
  }).length;
}

/**
 * Kullanıcının bugünkü kalan mesaj gönderme hakkını döner.
 */
export function getRemainingDailyMessages(userId: string): number {
  const sentToday = getDailySentMessageCount(userId);
  return Math.max(0, DAILY_MESSAGE_LIMIT - sentToday);
}

export function getUnreadMessageCount(userId: string): number {
  const inbox = getInboxForUser(userId);
  return inbox.filter((m) => !m.read).length;
}

export function markMessageAsRead(messageId: string): void {
  const all = getStoredMessages();
  const updated = all.map((m) => (m.id === messageId ? { ...m, read: true } : m));
  saveStoredMessages(updated);
}

export function deleteMessage(messageId: string): void {
  const all = getStoredMessages();
  const updated = all.filter((m) => m.id !== messageId);
  saveStoredMessages(updated);
}

export interface SendMessagePayload {
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverRole: UserRole;
  receiverClassSection?: string;
  title: string;
  content: string;
}

export function sendMessage(payload: SendMessagePayload): { success: boolean; message?: MessageRecord; error?: string } {
  // 1. Günlük Mesaj Gönderme Kotası Kontrolü (Maksimum 5 Mesaj / Gün)
  const sentToday = getDailySentMessageCount(payload.senderId);
  if (sentToday >= DAILY_MESSAGE_LIMIT) {
    return {
      success: false,
      error: `Günlük mesaj gönderme sınırına (${DAILY_MESSAGE_LIMIT} mesaj/gün) ulaştınız. Yeni mesaj göndermek için lütfen yarını bekleyiniz.`
    };
  }

  // 2. İzin Hiyerarşisi Doğrulaması
  if (!canUserMessageRecipient(payload.senderRole, payload.receiverRole)) {
    let err = 'Bu kullanıcı rolüne mesaj gönderme yetkiniz bulunmamaktadır.';
    if (payload.senderRole === 'student') {
      err = 'Öğrenciler yalnızca öğretmenlerine mesaj gönderebilirler.';
    }
    return { success: false, error: err };
  }

  // 3. Karakter Sınırı Denetimi (Maksimum 300 Karakter)
  const trimmedContent = payload.content.trim();
  if (!trimmedContent) {
    return { success: false, error: 'Mesaj içeriği boş bırakılamaz.' };
  }
  if (trimmedContent.length > 300) {
    return { success: false, error: `Mesajınız 300 karakter sınırını aşıyor (${trimmedContent.length}/300).` };
  }

  // 4. Küfür, Hakaret ve Uygunsuz İçerik Filtresi
  const safetyCheck = checkContentSafety(trimmedContent);
  if (!safetyCheck.isClean) {
    return {
      success: false,
      error: safetyCheck.warningMessage || 'Mesajınız uygunsuz ifadeler içerdiği için iletilemedi.'
    };
  }

  const newMessage: MessageRecord = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    senderId: payload.senderId,
    senderName: payload.senderName,
    senderRole: payload.senderRole,
    senderAvatar: payload.senderAvatar,
    receiverId: payload.receiverId,
    receiverName: payload.receiverName,
    receiverRole: payload.receiverRole,
    receiverClassSection: payload.receiverClassSection,
    title: payload.title.trim() || 'Genel Mesaj',
    content: trimmedContent,
    read: false,
    createdAt: new Date().toISOString()
  };

  const current = getStoredMessages();
  const updated = [newMessage, ...current];
  saveStoredMessages(updated);

  return { success: true, message: newMessage };
}
