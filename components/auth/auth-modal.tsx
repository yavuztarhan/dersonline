'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import { TeacherRegisterWizard } from './teacher-register-wizard';
import {
  X,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  School
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const { loginAsRole, loginWithEmail, currentUser, logout } = useAuth();
  const { setRole } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [emailInput, setEmailInput] = useState('');
  const [loginError, setLoginError] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = (role: 'admin' | 'teacher' | 'student') => {
    loginAsRole(role);
    setRole(role === 'student' ? 'student' : 'teacher');
    onClose();
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!emailInput.trim()) return;

    const success = loginWithEmail(emailInput);
    if (success) {
      onClose();
    } else {
      setLoginError('Bu e-posta adresine ait kullanıcı bulunamadı.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center shadow-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {activeTab === 'register' ? (
          <TeacherRegisterWizard
            onComplete={() => {
              onClose();
            }}
            onSwitchToLogin={() => setActiveTab('login')}
          />
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
            
            {/* Header & Tabs */}
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-teal-50 border-2 border-teal-200 text-teal-700 text-3xl flex items-center justify-center mx-auto shadow-inner">
                🏛️
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Maarif Akademi Giriş Masası
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Rolünüze göre sisteme giriş yapın veya yeni öğretmen hesabı oluşturun.
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="py-2 rounded-xl text-xs font-black transition-all bg-white text-slate-900 shadow-xs"
                >
                  Giriş Yap
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="py-2 rounded-xl text-xs font-black transition-all text-slate-600 hover:text-slate-900"
                >
                  Öğretmen Kaydı (Yeni)
                </button>
              </div>
            </div>

            {/* QUICK 1-CLICK DEMO LOGIN TILES */}
            <div className="space-y-2">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">
                Tek Tıkla Hızlı Rol Girişi (Demo & Sunum):
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* Admin Tile */}
                <button
                  onClick={() => handleQuickLogin('admin')}
                  className="p-3.5 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🛡️</span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                      Yönetici
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="font-extrabold text-xs text-indigo-950">Admin Masası</div>
                    <div className="text-[10px] text-slate-500">Öğretmen onayla & verileri gör</div>
                  </div>
                </button>

                {/* Teacher Tile */}
                <button
                  onClick={() => handleQuickLogin('teacher')}
                  className="p-3.5 rounded-2xl bg-teal-50/70 border-2 border-teal-200 hover:border-teal-500 hover:bg-teal-50 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">👨‍🏫</span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                      Öğretmen
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="font-extrabold text-xs text-teal-950">Öğretmen Paneli</div>
                    <div className="text-[10px] text-slate-500">Selimiye İHO Matematik</div>
                  </div>
                </button>

                {/* Student Tile */}
                <button
                  onClick={() => handleQuickLogin('student')}
                  className="p-3.5 rounded-2xl bg-blue-50/70 border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🎓</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      Öğrenci
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="font-extrabold text-xs text-blue-950">Öğrenci Masası</div>
                    <div className="text-[10px] text-slate-500">Çırak Hasan (5-A)</div>
                  </div>
                </button>

              </div>
            </div>

            {/* EMAIL FORM LOGIN */}
            <div className="relative border-t border-slate-200 pt-4 space-y-3">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-[10px] font-bold text-slate-400 uppercase">
                Veya E-Posta ile Giriş
              </span>

              {loginError && (
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleEmailLogin} className="space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="ahmet.ogretmen@meb.k12.tr veya admin@maarif.gov.tr"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sisteme Giriş Yap</span>
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
