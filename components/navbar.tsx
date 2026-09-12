'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import { AuthModal } from '@/components/auth/auth-modal';
import { UserAvatar } from '@/components/ui/user-avatar';
import { MessageInboxModal } from '@/components/messages/message-inbox-modal';
import { AppDrawer } from '@/components/navigation/app-drawer';
import { FeedbackModal } from '@/components/feedback/feedback-modal';
import { getUnreadMessageCount, syncMessagesWithDatabase } from '@/lib/message-store';
import { TeacherBoardAuthModal } from '@/components/teacher/teacher-board-auth-modal';
import {
  Award,
  Gamepad2,
  RotateCcw,
  User,
  LogIn,
  LogOut,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
  Mail,
  Menu,
  Tv,
  QrCode,
  GraduationCap
} from 'lucide-react';

export function Navbar() {
  const {
    role,
    playSound,
    studentPoints,
    resetSelection
  } = useApp();

  const { currentUser, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState<'student' | 'login' | 'register' | 'board'>('login');
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [teacherBoardAuthOpen, setTeacherBoardAuthOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [unreadRefresh, setUnreadRefresh] = useState(0);

  const unreadMessageCount = currentUser ? getUnreadMessageCount(currentUser.id) : 0;

  React.useEffect(() => {
    if (currentUser?.id) {
      syncMessagesWithDatabase(currentUser.id, currentUser.email).then(() => {
        setUnreadRefresh((prev) => prev + 1);
      });
    }
  }, [currentUser?.id, currentUser?.email]);

  const pathname = usePathname();
  const router = useRouter();
  const isLessonPage = pathname?.startsWith('/lesson/');

  const handleResetHome = () => {
    playSound('click');
    resetSelection();
    router.push('/');
  };

  const handleOpenStudentLogin = () => {
    playSound('click');
    setAuthModalDefaultTab('student');
    setAuthModalOpen(true);
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
          
          {/* 1. Brand Logo, Left Drawer Toggle & Title */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Left Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setDrawerOpen(true);
              }}
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-100/80 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200/80 hover:border-teal-300 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-2xs group"
              title="Kişisel Menüyü ve Özellikleri Aç"
            >
              <Menu className="w-5 h-5 text-slate-700 group-hover:text-teal-700 transition-colors" />
            </button>

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
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap shrink-0">
            
            {/* Student Points Badge if student */}
            {currentUser?.role === 'student' && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-xs shrink-0">
                <Award className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>{studentPoints} XP</span>
              </div>
            )}

            {/* Authenticated State: Single Dynamic Role Panel Button + Profile Controls */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap shrink-0">
                
                {/* Single Context-Aware Role Panel Button (Masaüstünde görünür, mobilde sol çekmece menüsünden erişilir) */}
                <Link
                  href={userDashboardHref}
                  className={`hidden md:flex px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black transition-all items-center gap-1.5 shadow-xs cursor-pointer shrink-0 ${
                    isCurrentDashboardActive
                      ? 'bg-teal-700 text-white shadow-teal-700/20 scale-102'
                      : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200/80 hover:border-teal-300'
                  }`}
                  title={`${userDashboardLabel}ne Git`}
                >
                  <span className="text-sm">{userDashboardIcon}</span>
                  <span>{userDashboardLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-600" />
                </Link>

                {/* Oyunlar Butonu (Mobilde sadece logo/ikon, masaüstünde metinli) */}
                <Link
                  href="/games"
                  className={`flex p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-black transition-all items-center gap-1.5 shadow-xs cursor-pointer shrink-0 active:scale-95 ${
                    pathname === '/games'
                      ? 'bg-indigo-600 text-white shadow-indigo-600/20 scale-102'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/80 hover:border-indigo-300'
                  }`}
                  title="Eğitici Zeka ve Mantık Oyunları"
                >
                  <Gamepad2 className={`w-4 h-4 shrink-0 ${pathname === '/games' ? 'text-white' : 'text-indigo-600'}`} />
                  <span className="hidden md:inline">Oyunlar</span>
                </Link>

                {/* Teacher Smart Board Fast Authorization Button (Single Compact Action) */}
                {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setTeacherBoardAuthOpen(true);
                    }}
                    className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                    title="Akıllı Tahta Girişi (QR Kod & 4 Haneli PIN)"
                  >
                    <Tv className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-100 shrink-0" />
                    <span className="hidden md:inline">Tahta Girişi</span>
                    <span className="md:hidden text-[11px]">Tahta</span>
                  </button>
                )}

                {/* User Pill with Avatar & Name (Masaüstünde görünür, mobilde sol çekmece menüsünden erişilir) */}
                <div className="hidden md:flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-2xl shrink-0">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-1.5 sm:px-2.5 py-1 rounded-xl hover:bg-white transition-all text-xs group"
                    title="Profilimi ve Okul Bilgilerimi Düzenle"
                  >
                    <UserAvatar avatar={currentUser.avatar} name={currentUser.name} size="sm" />
                    <div className="text-left hidden lg:block max-w-[120px] truncate">
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
                </div>

                {/* Messages Button with Unread Badge */}
                <button
                  onClick={() => {
                    playSound('click');
                    setMessageModalOpen(true);
                  }}
                  className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer shrink-0"
                  title="Mesaj Merkezi & Gelen Kutusu"
                >
                  <Mail className="w-4 h-4 text-slate-600" />
                  {unreadMessageCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full font-black text-[9px] shadow-sm animate-pulse">
                      {unreadMessageCount}
                    </span>
                  )}
                </button>

                {/* Logout Button (Masaüstünde görünür, mobilde sol çekmece menüsünden erişilir) */}
                <button
                  onClick={() => {
                    playSound('click');
                    logout();
                    router.push('/');
                  }}
                  className="hidden md:flex p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                  title="Oturumu Kapat"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden lg:inline">Çıkış</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-nowrap shrink-0">
                <button
                  onClick={handleOpenStudentLogin}
                  className="hidden sm:flex px-3 py-2 rounded-xl text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 font-bold text-xs transition-colors items-center gap-1.5 border border-indigo-200 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Öğrenci Girişi</span>
                </button>
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

      {/* Hierarchical Message Inbox Modal */}
      <MessageInboxModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
      />

      {/* Role-Based Navigation App Drawer */}
      <AppDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpenAuthModal={(tab) => {
          setAuthModalDefaultTab(tab);
          setAuthModalOpen(true);
        }}
        onOpenMessageModal={() => setMessageModalOpen(true)}
        onOpenBoardAuthModal={() => setTeacherBoardAuthOpen(true)}
        onOpenFeedbackModal={() => setFeedbackModalOpen(true)}
      />

      {/* Teacher Smart Board Unified Auth Modal (QR Camera + PIN) */}
      <TeacherBoardAuthModal
        isOpen={teacherBoardAuthOpen}
        onClose={() => setTeacherBoardAuthOpen(false)}
      />

      {/* Teacher Feedback Modal (powerose@gmail.com - Sistem Yöneticisi) */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        contextTitle="Öğretmen Görüş & Geri Bildirim"
        type="feedback"
      />
    </>
  );
}
