'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import { TeacherRegisterWizard } from './teacher-register-wizard';
import { StudentRegisterWizard } from './student-register-wizard';
import { GoogleSignInModal } from './google-sign-in-modal';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  School,
  GraduationCap
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
  defaultRegisterRole?: 'teacher' | 'student';
}

export function AuthModal({
  isOpen,
  onClose,
  defaultTab = 'login',
  defaultRegisterRole = 'teacher'
}: AuthModalProps) {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const { setRole } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [registerRole, setRegisterRole] = useState<'teacher' | 'student'>(defaultRegisterRole);
  const [identifierInput, setIdentifierInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveTab(defaultTab);
    if (defaultRegisterRole) {
      setRegisterRole(defaultRegisterRole);
    }
  }, [defaultTab, defaultRegisterRole]);

  if (!isOpen || !mounted) return null;

  const handleGoogleAccountSelect = (profile: { name: string; email: string; avatar?: string }) => {
    const result = loginWithGoogle(profile);
    if (result.user.role === 'student') {
      setRole('student');
    } else {
      setRole('teacher');
    }
    setShowGoogleModal(false);
    onClose();

    if (result.isNewUser || (result.user.role === 'teacher' && !(result.user as any).isProfileComplete && !(result.user as any).school)) {
      router.push('/profile');
    }
  };

  const handleIdentifierLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!identifierInput.trim()) {
      setLoginError('Lütfen e-posta adresinizi veya okul numaranızı giriniz.');
      return;
    }

    const success = loginWithEmail(identifierInput, passwordInput || undefined);
    if (success) {
      onClose();
    } else {
      setLoginError('Kullanıcı bilgileri veya şifre hatalı. Lütfen kontrol ediniz.');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center shadow-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {activeTab === 'register' ? (
          <div className="space-y-4">
            {/* Register Role Sub-Selector */}
            <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-md grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setRegisterRole('teacher')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  registerRole === 'teacher'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>👨‍🏫</span>
                <span>Öğretmen Kaydı</span>
              </button>
              <button
                type="button"
                onClick={() => setRegisterRole('student')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  registerRole === 'student'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>🎓</span>
                <span>Öğrenci Kaydı</span>
              </button>
            </div>

            {registerRole === 'teacher' ? (
              <TeacherRegisterWizard
                onComplete={() => {
                  onClose();
                }}
                onSwitchToLogin={() => setActiveTab('login')}
              />
            ) : (
              <StudentRegisterWizard
                onComplete={() => {
                  onClose();
                }}
                onSwitchToLogin={() => setActiveTab('login')}
              />
            )}
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
                  E-posta, telefon veya okul numaranız ile hesabınıza erişin.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="py-2.5 text-xs font-extrabold rounded-xl transition-all bg-white text-slate-900 shadow-xs"
                >
                  Oturum Aç
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="py-2.5 text-xs font-bold rounded-xl transition-all text-slate-500 hover:text-slate-900"
                >
                  Yeni Kayıt Ol
                </button>
              </div>
            </div>

            {/* Google OAuth Login Button */}
            <div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.43 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.57 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Google ile Oturum Aç</span>
              </button>
            </div>

            {/* Email / Student Number & Password Login Form */}
            <div className="pt-2 border-t border-slate-100">
              <form onSubmit={handleIdentifierLogin} className="space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-left">
                  veya E-Posta / Okul No / Telefon ile Giriş
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifierInput}
                    onChange={(e) => setIdentifierInput(e.target.value)}
                    placeholder="E-posta, Okul No (örn: 142) veya Telefon"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Şifreniz (Varsayılan: 123456 veya belirlenen)"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
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

            {/* Quick Registration Helper Links */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Henüz hesabınız yok mu?</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setRegisterRole('teacher');
                  }}
                  className="text-teal-600 hover:text-teal-700 font-bold hover:underline"
                >
                  Öğretmen Kaydı
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setRegisterRole('student');
                  }}
                  className="text-amber-600 hover:text-amber-700 font-bold hover:underline"
                >
                  Öğrenci Kaydı
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Google Sign In Account Chooser Modal */}
        <GoogleSignInModal
          isOpen={showGoogleModal}
          onClose={() => setShowGoogleModal(false)}
          onSelectAccount={handleGoogleAccountSelect}
          mode="login"
        />

      </div>
    </div>,
    document.body
  );
}
