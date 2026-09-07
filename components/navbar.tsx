'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import { AuthModal } from '@/components/auth/auth-modal';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  GraduationCap,
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  UserCheck,
  BookOpen,
  Award,
  Tv2,
  RotateCcw,
  ShieldCheck,
  User,
  LogIn,
  LogOut,
  ChevronDown
} from 'lucide-react';

export function Navbar() {
  const {
    role,
    setRole,
    isFullscreen,
    toggleFullscreen,
    soundEnabled,
    setSoundEnabled,
    playSound,
    studentPoints,
    resetSelection,
  } = useApp();

  const { currentUser, logout, loginAsRole } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState<'login' | 'register'>('login');

  const pathname = usePathname();
  const router = useRouter();
  const isLessonPage = pathname?.startsWith('/lesson/');

  const handleResetHome = () => {
    playSound('click');
    resetSelection();
    router.push('/');
  };

  const handleOpenLogin = () => {
    playSound('click');
    setAuthModalDefaultTab('login');
    setAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    playSound('click');
    setAuthModalDefaultTab('register');
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleResetHome}
              className="flex items-center gap-3 group text-left transition-transform active:scale-95"
              title="Ana Sayfaya Dön"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-all">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-slate-800">
                    MAARİF <span className="text-teal-600 font-black">AKADEMİ</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Maarif Modeli
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  Kademeli Akıllı Tahta & İnteraktif Matematik
                </p>
              </div>
            </button>

            {/* Quick Navigation Links to Role Dashboards */}
            <div className="hidden lg:flex items-center gap-1 border-l border-slate-200 pl-4 text-xs font-bold">
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                  pathname === '/admin' ? 'bg-indigo-50 text-indigo-900 font-black' : 'text-slate-600 hover:text-indigo-900'
                }`}
              >
                <span>🛡️ Admin Paneli</span>
              </Link>
              <Link
                href="/teacher"
                className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                  pathname === '/teacher' ? 'bg-teal-50 text-teal-900 font-black' : 'text-slate-600 hover:text-teal-900'
                }`}
              >
                <span>👨‍🏫 Öğretmen Paneli</span>
              </Link>
              <Link
                href="/student"
                className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                  pathname === '/student' ? 'bg-blue-50 text-blue-900 font-black' : 'text-slate-600 hover:text-blue-900'
                }`}
              >
                <span>🎓 Öğrenci Paneli</span>
              </Link>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            
            {/* Student Gamification Badge */}
            {role === 'student' && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold shadow-xs">
                <Award className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>{studentPoints} Puan</span>
              </div>
            )}

            {/* User Account / Login Button / Logout Button */}
            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded-2xl shadow-xs">
                  <Link
                    href={
                      currentUser.role === 'admin'
                        ? '/admin'
                        : currentUser.role === 'teacher'
                        ? '/teacher'
                        : '/student'
                    }
                    className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-white transition-all text-xs group"
                    title="Panelime Git"
                  >
                    <UserAvatar avatar={currentUser.avatar} name={currentUser.name} size="sm" />
                    <div className="text-left hidden sm:block">
                      <div className="font-extrabold text-slate-900 leading-tight">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-teal-700 uppercase font-bold">
                        {currentUser.role === 'admin'
                          ? '🛡️ Yönetici'
                          : currentUser.role === 'teacher'
                          ? '👨‍🏫 Öğretmen'
                          : '🎓 Öğrenci'}
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/profile"
                    className="p-1.5 rounded-xl hover:bg-teal-50 text-slate-500 hover:text-teal-700 text-xs font-bold transition-colors cursor-pointer"
                    title="Profilim & Okul Bilgilerim"
                  >
                    <User className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={handleOpenLogin}
                    className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    title="Hesap Değiştir / Hızlı Giriş"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Prominent Logout Button */}
                <button
                  onClick={() => {
                    playSound('click');
                    logout();
                    router.push('/');
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-200 font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                  title="Oturumu Kapat (Çıkış Yap)"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden md:inline">Çıkış Yap</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleOpenLogin}
                  className="px-3.5 py-2 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5 border border-slate-200"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Giriş</span>
                </button>
                <button
                  onClick={handleOpenRegister}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-all shadow-xs"
                >
                  Öğretmen Kaydı
                </button>
              </div>
            )}

            {/* Sound Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playSound('click');
              }}
              title={soundEnabled ? 'Ses Efektlerini Kapat' : 'Ses Efektlerini Aç'}
              className={`p-2.5 rounded-xl border transition-all ${
                soundEnabled
                  ? 'bg-slate-50 border-slate-200 text-teal-700 hover:bg-slate-100'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Fullscreen / Smart Board Mode */}
            <button
              onClick={() => {
                playSound('click');
                toggleFullscreen();
              }}
              title={isFullscreen ? 'Tam Ekrandan Çık' : 'Akıllı Tahta / Tam Ekran Modu'}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isFullscreen
                  ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10'
              }`}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Küçült</span>
                </>
              ) : (
                <>
                  <Tv2 className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Akıllı Tahta</span>
                </>
              )}
            </button>

            {/* Return to Home if in Lesson */}
            {isLessonPage && (
              <button
                onClick={handleResetHome}
                title="Ders Seçimine Dön"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

          </div>
        </div>
      </header>

      {/* Auth Modal Trigger */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalDefaultTab}
      />
    </>
  );
}

