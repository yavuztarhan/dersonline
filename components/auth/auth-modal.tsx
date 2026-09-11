'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useAuth } from '@/lib/auth-store';
import { BoardQrLogin } from '@/components/auth/board-qr-login';
import {
  X,
  LogIn,
  Mail,
  Lock,
  Sparkles,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Tv,
  QrCode
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register' | 'board';
}

export function AuthModal({
  isOpen,
  onClose,
  defaultTab = 'login'
}: AuthModalProps) {
  const router = useRouter();
  const { loginWithEmail } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'board'>(defaultTab);
  const [identifierInput, setIdentifierInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [oauthErrorNotice, setOauthErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Check if URL has NextAuth OAuth error parameter
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const err = params.get('error');
      if (err) {
        if (err === 'AccessDenied') {
          setOauthErrorNotice('Google oturum açma işlemi iptal edildi veya yetki verilmedi.');
        } else {
          setOauthErrorNotice(`Giriş uyarısı: ${err}.`);
        }
      }
    }
  }, []);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  if (!isOpen || !mounted) return null;

  const handleLiveGoogleSignIn = async () => {
    setGoogleLoading(true);
    setLoginError('');
    try {
      const res = await signIn('google', { callbackUrl: '/', redirect: true });
      if (res?.error) {
        setOauthErrorNotice('Google OAuth bağlantısı kurulamadı.');
        setGoogleLoading(false);
      }
    } catch (e) {
      console.error('Google Sign In Error:', e);
      setOauthErrorNotice('Google ile bağlantı kurulamadı.');
      setGoogleLoading(false);
    }
  };

  const handleIdentifierLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!identifierInput.trim()) {
      setLoginError('Lütfen e-posta adresinizi veya okul numaranızı giriniz.');
      return;
    }
    if (!passwordInput.trim()) {
      setLoginError('Lütfen şifrenizi giriniz.');
      return;
    }

    const success = loginWithEmail(identifierInput, passwordInput);
    if (success) {
      onClose();
    } else {
      setLoginError('Kullanıcı bilgileri veya şifre hatalı. Lütfen bilgilerinizi kontrol ediniz.');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center shadow-lg transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {activeTab === 'register' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Türkiye Yüzyılı Maarif Modeli</span>
              </div>
              
              <div className="flex justify-center mb-1">
                <Image
                  src="/logo-192.png"
                  alt="Maarif Akademi Logo"
                  width={64}
                  height={64}
                  className="rounded-2xl shadow-md border border-slate-100 object-cover"
                />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Yeni Öğretmen Kaydı
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Güvenli ve doğrulanmış öğretmen hesabı oluşturmak için Google hesabınızla giriş yapınız.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="py-2 text-xs font-bold rounded-xl transition-all text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Oturum Aç
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('board')}
                  className="py-2 text-xs font-bold rounded-xl transition-all text-teal-700 hover:text-teal-900 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Tv className="w-3.5 h-3.5 text-teal-600" />
                  <span>Akıllı Tahta</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="py-2 text-xs font-extrabold rounded-xl transition-all bg-white text-slate-900 shadow-xs cursor-pointer"
                >
                  Öğretmen Kaydı
                </button>
              </div>
            </div>

            {/* OAuth Notice if present */}
            {oauthErrorNotice && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5 text-left">
                <span className="text-base">⚠️</span>
                <div className="space-y-1">
                  <div className="font-bold text-amber-950">OAuth Bildirimi</div>
                  <div>{oauthErrorNotice}</div>
                </div>
              </div>
            )}

            {/* Google Registration Action Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-teal-50/80 to-teal-50/40 border border-teal-200 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              
              <div className="text-xs text-teal-950 leading-relaxed font-medium">
                Öğretmen kaydı <strong>Google kimlik doğrulaması</strong> ile yapılmaktadır. Google ile giriş yaptıktan sonra <strong>KVKK & Öğretmen Taahhütnamesi'ni</strong> onaylayarak okul ve branş bilgilerinizi tamamlayabilirsiniz.
              </div>

              {/* 1. Live Google OAuth Button */}
              <button
                type="button"
                onClick={handleLiveGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Google'a Yönlendiriliyor...</span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.43 7.34 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.57 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    </div>
                    <span>Google Hesabı İle Kayıt Ol</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-70" />
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Zaten bir öğretmen hesabınız var mı?</span>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-teal-600 hover:text-teal-700 font-bold hover:underline cursor-pointer"
              >
                Oturum Açın
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
            
            {/* Header & Tabs */}
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Türkiye Yüzyılı Maarif Modeli</span>
              </div>
              
              <div className="flex justify-center mb-1">
                <Image
                  src="/logo-192.png"
                  alt="Maarif Akademi Logo"
                  width={64}
                  height={64}
                  className="rounded-2xl shadow-md border border-slate-100 object-cover"
                />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Maarif Akademi Girişi
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Google hesabınız, e-posta veya okul numaranız ile sisteme erişin.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`py-2 text-xs transition-all rounded-xl cursor-pointer ${
                    activeTab === 'login'
                      ? 'font-extrabold bg-white text-slate-900 shadow-xs'
                      : 'font-bold text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Oturum Aç
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('board')}
                  className={`py-2 text-xs transition-all rounded-xl cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'board'
                      ? 'font-extrabold bg-white text-teal-800 shadow-xs'
                      : 'font-bold text-teal-700 hover:text-teal-900'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5 text-teal-600" />
                  <span>Akıllı Tahta</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`py-2 text-xs transition-all rounded-xl cursor-pointer ${
                    (activeTab as string) === 'register'
                      ? 'font-extrabold bg-white text-slate-900 shadow-xs'
                      : 'font-bold text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Öğretmen Kaydı
                </button>
              </div>
            </div>

            {/* Board QR & PIN View */}
            {activeTab === 'board' ? (
              <BoardQrLogin onSuccess={onClose} />
            ) : (
              <>
                {/* Akıllı Tahta Hızlı Geçiş Öneri Kartı */}
                <div
                  onClick={() => setActiveTab('board')}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-200 hover:border-teal-400 hover:bg-teal-50/70 transition-all cursor-pointer flex items-center justify-between gap-3 text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <span>Akıllı Tahtada mısınız?</span>
                        <span className="text-[10px] font-extrabold bg-teal-200 text-teal-900 px-1.5 py-0.2 rounded-full">
                          Şifresiz
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Öğrencilerin yanında şifre girmeden QR veya PIN ile anında giriş yapın.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform shrink-0" />
                </div>

                {/* OAuth Notice if present */}
                {oauthErrorNotice && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5 text-left">
                    <span className="text-base">⚠️</span>
                    <div className="space-y-1">
                      <div className="font-bold text-amber-950">OAuth Bildirimi</div>
                      <div>{oauthErrorNotice}</div>
                    </div>
                  </div>
                )}

            {/* Google OAuth Login Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleLiveGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Google'a Yönlendiriliyor...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.43 7.34 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.57 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>Google ile Oturum Aç</span>
                  </>
                )}
              </button>
            </div>

            {/* Email / Student Number & Password Login Form */}
            <div className="pt-2 border-t border-slate-100">
              <form onSubmit={handleIdentifierLogin} className="space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-left">
                  E-POSTA İLE GİRİŞ
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifierInput}
                    onChange={(e) => setIdentifierInput(e.target.value)}
                    placeholder="E-posta Adresiniz"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Giriş Şifreniz"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                {loginError && (
                  <div className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-left">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sisteme Giriş Yap</span>
                </button>
              </form>
            </div>

              {/* Quick Registration Helper Link */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Henüz öğretmen hesabınız yok mu?</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-teal-600 hover:text-teal-700 font-bold hover:underline cursor-pointer"
                >
                  Öğretmen Kaydı Yapın
                </button>
              </div>
            </>
          )}

        </div>
        )}

      </div>
    </div>,
    document.body
  );
}

