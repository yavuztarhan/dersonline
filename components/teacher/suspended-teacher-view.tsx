'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Send,
  LogOut,
  Mail,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Clock,
  Building2,
  Lock
} from 'lucide-react';
import { useAuth } from '@/lib/auth-store';
import { sendMessage, getInboxForUser, MessageRecord, markMessageAsRead } from '@/lib/message-store';
import confetti from 'canvas-confetti';

export function SuspendedTeacherView() {
  const { currentUser, logout, admins } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageRecord | null>(null);

  // Get messages sent to this suspended teacher from admin
  const inboxMessages = currentUser?.id ? getInboxForUser(currentUser.id) : [];

  const handleSendMessageToAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Lütfen bir konu başlığı giriniz.');
      return;
    }

    if (!content.trim()) {
      setErrorMsg('Lütfen mesajınızı yazınız.');
      return;
    }

    if (content.trim().length > 300) {
      setErrorMsg(`Mesajınız 300 karakter sınırını aşıyor (${content.trim().length}/300).`);
      return;
    }

    setIsSending(true);

    const primaryAdmin = admins.find((a) => a.email?.toLowerCase() === 'powerose@gmail.com') ||
      admins.find((a) => a.id === 'usr-admin-powerose') ||
      admins[0] || {
        id: 'usr-admin-powerose',
        name: 'Sistem Yöneticisi',
        email: 'powerose@gmail.com',
        role: 'admin' as const,
      };

    const result = sendMessage({
      senderId: currentUser?.id || 'suspended-teacher',
      senderName: `${currentUser?.name || 'Öğretmen'} (Askıda)`,
      senderRole: 'teacher',
      senderAvatar: currentUser?.avatar || '👨‍🏫',
      receiverId: primaryAdmin.id,
      receiverName: 'Sistem Yöneticisi',
      receiverRole: 'admin',
      title: `[Askı İtirazı / Açıklama] ${title.trim()}`,
      content: content.trim(),
    });

    if (!result.success) {
      setErrorMsg(result.error || 'Mesaj iletilemedi.');
      setIsSending(false);
      return;
    }

    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    setSuccessMsg('Mesajınız Sistem Yöneticisine (powerose@gmail.com) başarıyla iletildi. İnceleme sonrası yanıt size bu ekranda iletilecektir.');
    setTitle('');
    setContent('');
    setIsSending(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER WARNING */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center text-3xl mx-auto shadow-inner animate-pulse">
            <ShieldAlert className="w-9 h-9" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-black uppercase tracking-wider">
              Hesap Askıya Alındı
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-rose-400 mt-3 tracking-tight">
              Hesabınız askıya alınmıştır lütfen yönetici ile iletişime geçin
            </h1>
            <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 font-medium">
              Sayın {currentUser?.name} {currentUser?.school ? `(${currentUser.school})` : ''} • {currentUser?.email}
            </p>
          </div>
        </div>

        {/* EXPLANATION BOX */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold">
            <Lock className="w-4 h-4 flex-shrink-0" />
            <span>Sistem Kullanım Kısıtlaması</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Hesabınız Sistem Yöneticisi tarafından güvenlik, inceleme veya yönetim politikaları gereğince geçici olarak askıya alınmıştır. Bu süre zarfında sınıflara, öğrenci listelerine, ders planlarına ve akıllı tahta paneline erişiminiz sınırlandırılmıştır.
          </p>
          <p className="text-slate-300 font-bold text-[11px]">
            Hesabınızın yeniden aktif edilmesi, itirazda bulunmak veya durum hakkında bilgi almak için aşağıdaki form üzerinden doğrudan Sistem Yöneticisine mesaj iletebilirsiniz.
          </p>
        </div>

        {/* ADMIN MESSAGES INBOX (IF ANY) */}
        {inboxMessages.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Yöneticiden Gelen Yanıtlar / Bildirimler ({inboxMessages.length})</span>
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {inboxMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    markMessageAsRead(msg.id);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    !msg.read
                      ? 'bg-teal-950/40 border-teal-500/40 text-teal-100'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="truncate">{msg.title}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-1">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SELECTED MESSAGE DETAIL MODAL/CARD */}
        {selectedMessage && (
          <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/40 space-y-2 text-xs">
            <div className="flex items-center justify-between font-black text-teal-300">
              <span>{selectedMessage.title}</span>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Kapat
              </button>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px]">{selectedMessage.content}</p>
            <div className="text-[10px] text-teal-400/80 pt-1">
              Gönderen: {selectedMessage.senderName} • {new Date(selectedMessage.createdAt).toLocaleString('tr-TR')}
            </div>
          </div>
        )}

        {/* APPEAL / MESSAGE TO ADMIN FORM */}
        <form onSubmit={handleSendMessageToAdmin} className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-indigo-400" />
            <span>Sistem Yöneticisine Mesaj İlet</span>
          </h3>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <input
              type="text"
              placeholder="Konu başlığı (Örn: Hesap Askı Durumu ve Bilgi Talebi)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>İtiraz veya açıklama metniniz:</span>
              <span className={content.length > 270 ? 'text-amber-400 font-bold' : ''}>
                {content.length} / 300
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Durumunuzu, talebinizi veya iletmek istediğiniz notu buraya yazınız..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={300}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Güvenli Çıkış Yap</span>
            </button>

            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'İletiliyor...' : 'Yöneticiye Gönder'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
