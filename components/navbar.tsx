'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import { AuthModal } from '@/components/auth/auth-modal';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  Volume2,
  VolumeX,
  Award,
  RotateCcw,
  User,
  LogIn,
  LogOut,
  ChevronRight,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

export function Navbar() {
  const {
    role,
    soundEnabled,
    setSoundEnabled,
    playSound,
    studentPoints,
    resetSelection,
  } = useApp();

  const { currentUser, logout } = useAuth();
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

  // Determine user's target dashboard
  const userDashboardHref =
    currentUser?.role === 'admin'
      ? '/admin'
      : currentUser?.role === 'teacher'
      ? '/teacher'
      : '/student';

  const userDashboardLabel =
    currentUser?.role === 'admin'
      ? 'Yönetici Paneli'
      : currentUser?.role === 'teacher'
      ? 'Öğretmen Paneli'
      : 'Öğrenci Paneli';

  const userDashboardIcon =
    currentUser?.role === 'admin'
      ? '🛡️'
      : currentUser?.role === 'teacher'
      ? '👨‍🏫'
      : '🎓';

  const isCurrentDashboardActive = pathname === userDashboardHref;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* 1. Brand Logo & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleResetHome}
              className="flex items-center gap-3 group text-left transition-transform active:scale-95 cursor-pointer"
              title="Ana Sayfaya Dön"
            >
              <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-teal-950/10 group-hover:scale-105 transition-all shrink-0 border border-teal-500/20 bg-slate-900 flex items-center justify-center">
                <Image
                  src="/logo-192.png"
                  alt="Maarif Akademi Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900">
                    MAARİF <span className="text-teal-600 font-black">AKADEMİ</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Türkiye Yüzyılı Maarif Modeli • İnteraktif Dersler
                </p>
              </div>
            </button>
          </div>

          {/* 2. Right Side: Context-Aware Single Dashboard Button & User Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            
            {/* Student Points Badge if student */}
            {currentUser?.role === 'student' && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-xs">
                <Award className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>{studentPoints} XP</span>
              </div>
            )}

            {/* Authenticated State: Single Dynamic Role Panel Button + Profile Controls */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                
                {/* Single Context-Aware Role Panel Button */}
                <Link
                  href={userDashboardHref}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                    isCurrentDashboardActive
                      ? 'bg-teal-700 text-white shadow-teal-700/20 scale-102'
                      : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200/80 hover:border-teal-300'
                  }`}
                  title={`${userDashboardLabel}ne Git`}
                >
                  <span className="text-sm">{userDashboardIcon}</span>
                  <span className="hidden sm:inline">{userDashboardLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-600" />
                </Link>

                {/* User Pill with Avatar & Name */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded-2xl">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-white transition-all text-xs group"
                    title="Profilimi ve Okul Bilgilerimi Düzenle"
                  >
                    <UserAvatar avatar={currentUser.avatar} name={currentUser.name} size="sm" />
                    <div className="text-left hidden md:block max-w-[130px] truncate">
                      <div className="font-extrabold text-slate-900 leading-tight truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold truncate">
                        {currentUser.role === 'admin'
                          ? 'Yönetici'
                          : currentUser.role === 'teacher'
                          ? (currentUser as any).school || 'Öğretmen'
                          : `${(currentUser as any).classSection || '5-A'} Şubesi`}
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/profile"
                    className="p-1.5 rounded-xl hover:bg-white text-slate-500 hover:text-teal-700 transition-colors cursor-pointer"
                    title="Profil Ayarları"
                  >
                    <User className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={handleOpenLogin}
                    className="p-1.5 rounded-xl hover:bg-white text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Hesap Değiştir / Hızlı Giriş"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    playSound('click');
                    logout();
                    router.push('/');
                  }}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="Oturumu Kapat"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden lg:inline">Çıkış</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenLogin}
                  className="px-3.5 py-2 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Giriş Yap</span>
                </button>
                <button
                  onClick={handleOpenRegister}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all shadow-xs cursor-pointer"
                >
                  Öğretmen Kaydı
                </button>
              </div>
            )}

            {/* Sound Effects Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playSound('click');
              }}
              title={soundEnabled ? 'Ses Efektlerini Kapat' : 'Ses Efektlerini Aç'}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-slate-50 border-slate-200 text-teal-700 hover:bg-slate-100'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Return to Home button when in Lesson Room */}
            {isLessonPage && (
              <button
                onClick={handleResetHome}
                title="Ders Seçimine / Ana Sayfaya Dön"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalDefaultTab}
      />
    </>
  );
}
