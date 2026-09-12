'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Mail,
  Send,
  User,
  Building2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { TeacherUser } from '@/types/auth';
import { useAuth } from '@/lib/auth-store';
import { sendMessage } from '@/lib/message-store';
import confetti from 'canvas-confetti';

interface AdminSendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherUser | null;
  onSent?: () => void;
}

export function AdminSendMessageModal({
  isOpen,
  onClose,
  teacher,
  onSent,
}: AdminSendMessageModalProps) {
  const { currentUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && teacher) {
      setTitle('');
      setContent('');
      setErrorMsg('');
      setSuccessMsg('');
      setIsSending(false);
    }
  }, [isOpen, teacher]);

  if (!isOpen || !teacher || !mounted) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Lütfen bir konu başlığı giriniz.');
      return;
    }

    if (!content.trim()) {
      setErrorMsg('Lütfen mesaj içeriğini yazınız.');
      return;
    }

    if (content.trim().length > 300) {
      setErrorMsg(`Mesajınız 300 karakter sınırını aşıyor (${content.trim().length}/300).`);
      return;
    }

    setIsSending(true);

    const result = sendMessage({
      senderId: currentUser?.id || 'usr-admin-1',
      senderName: currentUser?.name || 'Sistem Yöneticisi',
      senderRole: 'admin',
      senderAvatar: currentUser?.avatar || '👑',
      receiverId: teacher.id,
      receiverName: teacher.name,
      receiverRole: 'teacher',
      title: title.trim(),
      content: content.trim(),
    });

    if (!result.success) {
      setErrorMsg(result.error || 'Mesaj iletilemedi.');
      setIsSending(false);
      return;
    }

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    setSuccessMsg('Mesajınız öğretmene başarıyla iletildi!');
    setIsSending(false);

    setTimeout(() => {
      if (onSent) onSent();
      onClose();
    }, 1200);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black">Öğretmene Mesaj Gönder</h3>
              <p className="text-xs text-slate-300">Sistem içi doğrudan mesaj iletimi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSend} className="p-6 space-y-4">
          {/* RECIPIENT CARD */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
              {teacher.avatar || '👨‍🏫'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900 truncate">{teacher.name}</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-black">
                  {teacher.branch}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {teacher.school} • {teacher.email}
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TITLE INPUT */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
              Konu Başlığı <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Örn: Ders Planları ve Akıllı Tahta Kullanımı Hakkında"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>

          {/* CONTENT INPUT */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-extrabold text-slate-700">
                Mesaj Metni <span className="text-rose-500">*</span>
              </label>
              <span className={`text-[11px] font-bold ${content.length > 270 ? 'text-amber-600' : 'text-slate-400'}`}>
                {content.length} / 300
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Öğretmene iletmek istediğiniz mesajı buraya yazınız..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={300}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-indigo-500 outline-none transition-all shadow-sm resize-none"
            />
          </div>

          {/* BUTTONS */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSending || Boolean(successMsg)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'İletiliyor...' : 'Mesajı Gönder'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
