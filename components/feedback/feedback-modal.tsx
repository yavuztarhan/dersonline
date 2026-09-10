'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  sendMessage,
  DAILY_MESSAGE_LIMIT,
  getRemainingDailyMessages
} from '@/lib/message-store';
import { checkContentSafety } from '@/lib/profanity-filter';
import confetti from 'canvas-confetti';
import {
  MessageSquarePlus,
  Gamepad2,
  Send,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Clock,
  Lightbulb
} from 'lucide-react';

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextTitle: string; // e.g. 'MAT.5.3.3 Ders Akışı', 'Öğrenci Paneli', 'Oyunlar Sayfası'
  defaultSubject?: string;
  description?: string;
  placeholder?: string;
  type?: 'feedback' | 'game_request';
  onSuccess?: () => void;
}

export function FeedbackModal({
  isOpen,
  onClose,
  contextTitle,
  defaultSubject,
  description,
  placeholder,
  type = 'feedback',
  onSuccess
}: FeedbackModalProps) {
  const { currentUser, admins } = useAuth();
  const { playSound } = useApp();

  const [messageText, setMessageText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [remainingQuota, setRemainingQuota] = useState(DAILY_MESSAGE_LIMIT);

  // Target Admin (First admin in system or default fallback)
  const targetAdmin = admins && admins.length > 0 ? admins[0] : {
    id: 'usr-admin-1',
    name: 'Maarif Sistem Yöneticisi',
    role: 'admin' as const,
    avatar: '🛡️'
  };

  const isGameRequest = type === 'game_request';
  const defaultPlaceholder = isGameRequest
    ? 'Örn: Kesirlerle pizza dilimleme yarışı olsun, doğru kesri seçtikçe puan katlansın ve zamana karşı kombo yapalım...'
    : 'Örn: Bu ders akışında açı ölçümü animasyonunu çok faydalı buldum, şu konuya da bir interaktif örnek eklenebilir...';

  const defaultDesc = isGameRequest
    ? 'Oynamak istediğiniz veya matematik öğrenimini daha eğlenceli hale getirecek yeni bir oyun fikrini tarif edin. Maarif Akademi ekibi olarak önerilerinizi değerlendirip yeni oyunlar geliştiriyoruz!'
    : 'Ders akışları, etkinlikler veya platform hakkında görüş, öneri ya da düzeltme taleplerinizi doğrudan Sistem Yöneticisine iletebilirsiniz.';

  // Reload quota on open
  useEffect(() => {
    if (isOpen && currentUser) {
      const remaining = getRemainingDailyMessages(currentUser.id);
      setRemainingQuota(remaining);
      setMessageText('');
      setErrorMsg(null);
      setIsSuccess(false);
    }
  }, [isOpen, currentUser]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMsg('Geri bildirim göndermek için lütfen giriş yapınız.');
      return;
    }

    const trimmed = messageText.trim();
    if (!trimmed) {
      setErrorMsg('Lütfen mesajınızı yazınız.');
      return;
    }

    if (trimmed.length > 300) {
      setErrorMsg(`Mesajınız 300 karakter sınırını aşıyor (${trimmed.length}/300).`);
      return;
    }

    // Check Safety
    const safety = checkContentSafety(trimmed);
    if (!safety.isClean) {
      setErrorMsg(safety.warningMessage || 'Mesajınız uygunsuz ifadeler içerdiği için iletilemedi.');
      return;
    }

    // Send to Admin
    const subjectTitle = defaultSubject || (isGameRequest ? `[İstek Oyun] ${contextTitle}` : `[Görüş Bildir] ${contextTitle}`);

    const res = sendMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar || (currentUser.role === 'teacher' ? '👨‍🏫' : currentUser.role === 'admin' ? '🛡️' : '🎓'),
      receiverId: targetAdmin.id,
      receiverName: targetAdmin.name,
      receiverRole: 'admin',
      title: subjectTitle,
      content: trimmed
    });

    if (!res.success) {
      setErrorMsg(res.error || 'Mesaj gönderilemedi.');
      return;
    }

    playSound('success');
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    setIsSuccess(true);
    setRemainingQuota((prev) => Math.max(0, prev - 1));
    onSuccess?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`p-5 sm:p-6 text-white flex items-start justify-between gap-4 shrink-0 border-b ${
          isGameRequest
            ? 'bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border-indigo-800/40'
            : 'bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 border-teal-800/40'
        }`}>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border ${
                isGameRequest
                  ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                  : 'bg-teal-500/20 text-teal-300 border-teal-400/40'
              }`}>
                {isGameRequest ? <Gamepad2 className="w-3.5 h-3.5" /> : <MessageSquarePlus className="w-3.5 h-3.5" />}
                <span>{isGameRequest ? 'Oyun İstek & Fikir Formu' : 'Görüş & Geri Bildirim'}</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-xs font-bold truncate max-w-[220px]">
                {contextTitle}
              </span>
            </div>

            <h3 className="text-xl font-black text-white">
              {isGameRequest ? 'Yeni Oyun Fikrini Paylaş' : 'Görüş ve Önerinizi Bildirin'}
            </h3>

            <div className="text-xs text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Alıcı: <strong>{targetAdmin.name}</strong></span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in duration-300">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center text-3xl shadow-md animate-bounce">
                🎉
              </div>
              <h4 className="text-xl font-black text-slate-900">
                {isGameRequest ? 'Oyun Fikriniz İletildi!' : 'Geri Bildiriminiz Başarıyla Gönderildi!'}
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Mesajınız Sistem Yöneticisine (Admin) başarıyla ulaştı. Maarif Akademi\'yi birlikte geliştirdiğimiz için teşekkür ederiz!
              </p>

              <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Kalan Günlük Mesaj Hakkınız: <strong>{remainingQuota} / {DAILY_MESSAGE_LIMIT}</strong></span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                >
                  Tamam
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Description Box */}
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
                isGameRequest
                  ? 'bg-purple-50/70 border-purple-200 text-purple-950'
                  : 'bg-teal-50/70 border-teal-200 text-teal-950'
              }`}>
                <div className="font-black flex items-center gap-1.5">
                  <Lightbulb className={`w-4 h-4 ${isGameRequest ? 'text-purple-600' : 'text-teal-600'}`} />
                  <span>{isGameRequest ? 'Nasıl Bir Oyun İstiyorsunuz?' : 'Görüşünüz Bizim İçin Değerli'}</span>
                </div>
                <p className="text-slate-700 text-xs">
                  {description || defaultDesc}
                </p>
              </div>

              {/* Quota Badge */}
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-slate-600 flex items-center gap-1">
                  <span>Konum / Konu:</span>
                  <span className="font-black text-slate-900">{contextTitle}</span>
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-black text-[11px] border ${
                  remainingQuota > 0
                    ? 'bg-teal-50 text-teal-800 border-teal-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
                }`}>
                  ⚡ Günlük Hak: {remainingQuota} / {DAILY_MESSAGE_LIMIT}
                </span>
              </div>

              {/* Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <label htmlFor="feedback-text">Mesajınız (Maks. 300 Karakter):</label>
                  <span className={messageText.length > 300 ? 'text-rose-600 font-black' : ''}>
                    {messageText.length} / 300
                  </span>
                </div>

                <textarea
                  id="feedback-text"
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder={placeholder || defaultPlaceholder}
                  rows={4}
                  maxLength={300}
                  disabled={remainingQuota <= 0}
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none transition-all disabled:opacity-60 disabled:bg-slate-50"
                />
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Quota Exhausted Warning */}
              {remainingQuota <= 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Bugünkü mesaj gönderme sınırınıza (5/5) ulaştınız. Yeni görüş iletmek için lütfen yarını bekleyiniz.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>

                <button
                  type="submit"
                  disabled={!messageText.trim() || remainingQuota <= 0}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
                    messageText.trim() && remainingQuota > 0
                      ? isGameRequest
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20 active:scale-95'
                        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20 active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isGameRequest ? 'Oyun Fikrini İlet' : 'Görüşü Gönder'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
