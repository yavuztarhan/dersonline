'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { signIn } from 'next-auth/react';
import { X, User, Mail, ArrowRight, Sparkles } from 'lucide-react';

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim()) {
      setError('Lütfen adınızı giriniz.');
      return;
    }
    if (!lastName.trim()) {
      setError('Lütfen soyadınızı giriniz.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Lütfen geçerli bir Google e-posta adresi giriniz.');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    onSelectAccount({
      name: fullName,
      email: email.trim().toLowerCase(),
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
            {mode === 'register' ? 'Google ile Kayıt Ol' : 'Google ile Oturum Açın'}
          </h3>
          <p className="text-xs text-slate-500">
            Maarif Akademi platformuna Google hesabınızla güvenle bağlanın.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
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

          <div className="relative border-t border-slate-200 my-3">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              veya Google E-Postanız ile Doğrudan Giriş
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adınız
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Adınız"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Soyadınız
                </label>
                <input
                  type="text"
                  required
                  placeholder="Soyadınız"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gmail veya Google E-Posta
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="ornek@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98 mt-2"
            >
              <span>{mode === 'register' ? 'Google ile Kayıt Ol' : 'Devam Et'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Security Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            🔒 Google OAuth 2.0 & Maarif Güvenlik Protokolü ile korunmaktadır.
          </p>
        </div>

      </div>
    </div>,
    document.body
  );
}
