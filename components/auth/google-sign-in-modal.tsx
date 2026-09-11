'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { signIn } from 'next-auth/react';
import { X, Check, Globe, Sparkles, User, Mail, ArrowRight } from 'lucide-react';

interface GoogleAccount {
  name: string;
  email: string;
  avatar: string;
  desc: string;
  badge: string;
}

const PRESET_ACCOUNTS: GoogleAccount[] = [
  {
    name: 'Sistem Yöneticisi (Powerose)',
    email: 'powerose@gmail.com',
    avatar: '🛡️',
    desc: 'Tam Yetkili Sistem Yöneticisi (Admin)',
    badge: 'Yönetici'
  },
  {
    name: 'Maarif Akademi Yönetim',
    email: 'maarifakademi.com.tr@gmail.com',
    avatar: '🛡️',
    desc: 'Tam Yetkili Sistem Yöneticisi (Admin)',
    badge: 'Yönetici'
  },
  {
    name: 'Sistem Yöneticisi',
    email: 'viziteci325@gmail.com',
    avatar: '🛡️',
    desc: 'Tam Yetkili Sistem Yöneticisi (Admin)',
    badge: 'Yönetici'
  },
  {
    name: 'Ahmet Öğretmen',
    email: 'ahmet.ogretmen@meb.k12.tr',
    avatar: '👨‍🏫',
    desc: 'Edirne Selimiye İHO Matematik',
    badge: 'Onaylı Öğretmen'
  },
  {
    name: 'Zeynep Kaya',
    email: 'zeynep.kaya@meb.k12.tr',
    avatar: '👩‍🏫',
    desc: 'Kadıköy Melahat Şefizade OO',
    badge: 'Onay Bekliyor'
  },
  {
    name: 'Çırak Hasan',
    email: 'hasan.ogrenci@meb.k12.tr',
    avatar: '🎓',
    desc: '5-A Sınıfı Öğrencisi (450 XP)',
    badge: 'Öğrenci'
  },
  {
    name: 'Mustafa Kemal Erdem',
    email: 'mustafa.erdem.ogretmen@gmail.com',
    avatar: '✨',
    desc: 'Yeni Öğretmen Kaydı (E-Posta Doğrulanmış)',
    badge: 'Yeni Google Kaydı'
  }
];

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { name: string; email: string; avatar?: string }) => void;
  mode?: 'login' | 'register';
}

export function GoogleSignInModal({
  isOpen,
  onClose,
  onSelectAccount,
  mode = 'login'
}: GoogleSignInModalProps) {
  const [customMode, setCustomMode] = useState(false);
  const [customFirstName, setCustomFirstName] = useState('');
  const [customLastName, setCustomLastName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customError, setCustomError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');

    if (!customFirstName.trim()) {
      setCustomError('Lütfen adınızı giriniz.');
      return;
    }
    if (!customLastName.trim()) {
      setCustomError('Lütfen soyadınızı giriniz.');
      return;
    }
    if (!customEmail.trim() || !customEmail.includes('@')) {
      setCustomError('Lütfen geçerli bir Google e-posta adresi giriniz.');
      return;
    }

    const fullName = `${customFirstName.trim()} ${customLastName.trim()}`;

    onSelectAccount({
      name: fullName,
      email: customEmail.trim().toLowerCase(),
      avatar: '🌟'
    });
  };

  const handleLiveOAuth = async () => {
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (e) {
      console.error('NextAuth Google Error:', e);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Google Logo */}
        <div className="p-6 border-b border-slate-100 text-center space-y-2 bg-gradient-to-b from-slate-50 to-white">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm mx-auto">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.43 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.57 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {mode === 'register' ? 'Google ile Hızlı Kayıt' : 'Google ile Oturum Açın'}
          </h3>
          <p className="text-xs text-slate-500">
            Maarif Akademi uygulamasına bağlanmak için bir Google hesabı seçin
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Primary Live Google OAuth Button */}
          <button
            onClick={handleLiveOAuth}
            className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.43 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.57 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
            </div>
            <span>
              {mode === 'register'
                ? 'Google Hesabı İle Kayıt Ol'
                : 'Google Hesabı İle Giriş Yap'}
            </span>
          </button>

          <div className="relative border-t border-slate-200 my-2">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              veya test / demo hesap seçin
            </span>
          </div>

          {!customMode ? (
            <div className="space-y-2">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
                Hızlı Rol / Test Hesapları:
              </div>

              {PRESET_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => onSelectAccount(acc)}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-left flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                    {acc.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-extrabold text-xs text-slate-900 truncate">
                        {acc.name}
                      </span>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-800 shrink-0">
                        {acc.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{acc.email}</div>
                    <div className="text-[10px] text-teal-600 font-medium truncate">{acc.desc}</div>
                  </div>
                </button>
              ))}

              {/* Enter Another Account */}
              <button
                onClick={() => setCustomMode(true)}
                className="w-full p-3 rounded-2xl border border-dashed border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-900 transition-all text-xs font-bold flex items-center justify-center gap-2 mt-3"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Başka bir Google Hesabı Kullan</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Google Hesap Bilgileri:
              </div>

              {customError && (
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                  {customError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ad
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Melis"
                    value={customFirstName}
                    onChange={(e) => setCustomFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Soyad
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Yıldız"
                    value={customLastName}
                    onChange={(e) => setCustomLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gmail veya Kurumsal E-Posta
                </label>
                <input
                  type="email"
                  required
                  placeholder="melis.yildiz@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Geri
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>{mode === 'register' ? 'Kayıt Ol' : 'Giriş Yap'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            🔒 Google OAuth 2.0 & Maarif Güvenlik Protokolü ile korunmaktadır.
          </p>
        </div>

      </div>
    </div>,
    document.body
  );
}
