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
  QrCode,
  GraduationCap,
  KeyRound,
  Hash
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'student' | 'login' | 'register' | 'board';
}

export function AuthModal({
  isOpen,
  onClose,
  defaultTab = 'login'
}: AuthModalProps) {
  const router = useRouter();
  const { loginWithEmail, loginStudent } = useAuth();

  const [activeTab, setActiveTab] = useState<'student' | 'login' | 'register' | 'board'>(defaultTab);
  
  // Teacher / General Login state
  const [identifierInput, setIdentifierInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Student Login state (3 parameters: Sınıf Kodu, Okul No, Şifre)
  const [studentClassCode, setStudentClassCode] = useState('');
  const [studentNumberInput, setStudentNumberInput] = useState('');
  const [studentPasswordInput, setStudentPasswordInput] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [studentLoginError, setStudentLoginError] = useState('');

  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setOauthErrorNotice(null);
    try {
      const res = await signIn('google', { redirect: false, callbackUrl: '/' });
      if (res?.error) {
        setOauthErrorNotice('Google ile oturum açılamadı. Lütfen tekrar deneyiniz.');
        setGoogleLoading(false);
      }
    } catch (e) {
      console.error('Google Sign In Error:', e);
      setOauthErrorNotice('Google ile bağlantı kurulamadı.');
      setGoogleLoading(false);
    }
  };

  const handleIdentifierLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!identifierInput.trim()) {
      setLoginError('Lütfen e-posta adresinizi giriniz.');
      return;
    }
    if (!passwordInput.trim()) {
      setLoginError('Lütfen şifrenizi giriniz.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await loginWithEmail(identifierInput, passwordInput);
      if (success) {
        onClose();
      } else {
        setLoginError('Kullanıcı bilgileri veya şifre hatalı. Lütfen bilgilerinizi kontrol ediniz.');
      }
    } catch (err) {
      setLoginError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentLoginError('');

    const cleanCode = studentClassCode.trim().toUpperCase();
    const cleanNo = studentNumberInput.trim();
    const cleanPass = studentPasswordInput.trim();

    if (!cleanCode) {
      setStudentLoginError('Lütfen sınıf kodunuzu veya şubenizi giriniz.');
      return;
    }
    if (cleanCode.length < 2 || cleanCode.length > 12) {
      setStudentLoginError('Lütfen geçerli bir sınıf kodu veya şube giriniz (Örn: MRF5A1 veya 5-A).');
      return;
    }

    if (!cleanNo) {
      setStudentLoginError('Lütfen okul numaranızı giriniz.');
      return;
    }
    if (!cleanPass) {
      setStudentLoginError('Lütfen şifrenizi giriniz.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await loginStudent(cleanCode, cleanNo, cleanPass);
      if (success) {
        onClose();
      } else {
        setStudentLoginError('Sınıf kodu, okul numarası veya şifre hatalı. Lütfen bilgilerinizi kontrol ediniz.');
      }
    } catch (err) {
      setStudentLoginError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('student')}
                  className="py-2 text-xs font-bold rounded-xl transition-all text-indigo-700 hover:text-indigo-900 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Öğrenci</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="py-2 text-xs font-bold rounded-xl transition-all text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-600" />
                  <span>Öğretmen</span>
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
                  className="py-2 text-xs font-extrabold rounded-xl transition-all bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Kayıt Ol</span>
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
                  {activeTab === 'student'
                    ? 'Öğrenci Girişi'
                    : activeTab === 'board'
                    ? 'Akıllı Tahta Girişi'
                    : 'Öğretmen & Yönetici Girişi'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {activeTab === 'student'
                    ? 'Sınıf kodu, okul numarası ve şifrenizle giriş yapınız.'
                    : activeTab === 'board'
                    ? 'Şifresiz ve anında QR veya PIN ile tahtada oturum açın.'
                    : 'Google hesabınız veya MEB e-posta adresiniz ile erişin.'}
                </p>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('student')}
                  className={`py-2 text-xs transition-all rounded-xl cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'student'
                      ? 'font-extrabold bg-white text-indigo-700 shadow-xs'
                      : 'font-bold text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Öğrenci</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`py-2 text-xs transition-all rounded-xl cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'login'
                      ? 'font-extrabold bg-white text-slate-900 shadow-xs'
                      : 'font-bold text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-700" />
                  <span>Öğretmen</span>
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
                  className="py-2 text-xs font-bold rounded-xl transition-all text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Kayıt Ol</span>
                </button>
              </div>
            </div>

            {/* Content per Tab */}
            {activeTab === 'board' ? (
              <BoardQrLogin onSuccess={onClose} />
            ) : activeTab === 'student' ? (
              /* STUDENT 3-PARAMETER LOGIN VIEW */
              <div className="space-y-4">
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-950 flex items-start gap-2.5">
                  <GraduationCap className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-indigo-900">Öğrenci Giriş Bilgileri</p>
                    <p className="text-[11px] text-indigo-700 leading-relaxed">
                      Sınıf kodunuzu ve şifrenizi ders öğretmeninizden temin edebilirsiniz. Öğrenci girişinde e-posta gerekmez.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleStudentLoginSubmit} className="space-y-3.5 text-left">
                  {/* 1. Sınıf Kodu */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      1. Sınıf Kodu (6 Haneli)
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoCapitalize="characters"
                        autoCorrect="off"
                        spellCheck={false}
                        value={studentClassCode}
                        onChange={(e) => setStudentClassCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                        placeholder="Örn: MRF5A1"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-black tracking-widest text-indigo-950 placeholder:font-sans placeholder:text-xs placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all uppercase"
                      />
                    </div>
                  </div>

                  {/* 2. Okul Numarası */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      2. Okul Numarası
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        value={studentNumberInput}
                        onChange={(e) => setStudentNumberInput(e.target.value.trim())}
                        placeholder="Örn: 104"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* 3. Şifre */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      3. Giriş Şifresi
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showStudentPassword ? 'text' : 'password'}
                        required
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        value={studentPasswordInput}
                        onChange={(e) => setStudentPasswordInput(e.target.value)}
                        placeholder="Öğretmeninizin verdiği şifre"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowStudentPassword(!showStudentPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                      >
                        {showStudentPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {studentLoginError && (
                    <div className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-left">
                      {studentLoginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-black text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Kontrol Ediliyor...</span>
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-4 h-4" />
                        <span>Öğrenci Girişi Yap</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Öğretmen misiniz?</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline cursor-pointer"
                  >
                    Öğretmen Girişi
                  </button>
                </div>
              </div>
            ) : (
              /* TEACHER / ADMIN LOGIN VIEW */
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

                {/* Email / Teacher Password Login Form */}
                <div className="pt-2 border-t border-slate-100">
                  <form onSubmit={handleIdentifierLogin} className="space-y-3 text-left">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      ÖĞRETMEN / YÖNETİCİ E-POSTA GİRİŞİ
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        inputMode="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        value={identifierInput}
                        onChange={(e) => setIdentifierInput(e.target.value)}
                        placeholder="E-posta Adresiniz (Örn: ahmet@meb.k12.tr)"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                      />
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
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
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Kontrol Ediliyor...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          <span>Sisteme Giriş Yap</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Quick Registration Helper Link */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => setActiveTab('student')}
                    className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Öğrenci Girişi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-teal-600 hover:text-teal-700 font-bold hover:underline cursor-pointer"
                  >
                    Öğretmen Kaydı
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

