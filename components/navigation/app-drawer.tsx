'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import { UserAvatar } from '@/components/ui/user-avatar';
import { getUnreadMessageCount } from '@/lib/message-store';
import { StudentUser, TeacherUser } from '@/types/auth';
import {
  X,
  Home,
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  Users,
  Trophy,
  FolderOpen,
  Award,
  Mail,
  User,
  LogOut,
  LogIn,
  Sparkles,
  ChevronRight,
  School,
  Volume2,
  VolumeX,
  ShieldCheck,
  BarChart3,
  Calendar,
  Layers,
  CheckCircle2,
  Compass,
  FileText,
  Flame,
  Plus,
  Tv
} from 'lucide-react';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal?: (tab: 'login' | 'register') => void;
  onOpenMessageModal?: () => void;
  onOpenBoardAuthModal?: () => void;
}

export function AppDrawer({
  isOpen,
  onClose,
  onOpenAuthModal,
  onOpenMessageModal,
  onOpenBoardAuthModal
}: AppDrawerProps) {
  const { currentUser, logout } = useAuth();
  const {
    soundEnabled,
    setSoundEnabled,
    playSound,
    studentPoints,
    studentBadges,
    resetSelection
  } = useApp();

  const pathname = usePathname();
  const router = useRouter();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const unreadMessages = currentUser ? getUnreadMessageCount(currentUser.id) : 0;
  const isStudent = currentUser?.role === 'student';
  const isTeacher = currentUser?.role === 'teacher';
  const isAdmin = currentUser?.role === 'admin';
  const isGuest = !currentUser;

  const studentUser = isStudent ? (currentUser as StudentUser) : null;
  const teacherUser = isTeacher ? (currentUser as TeacherUser) : null;

  const handleNavigate = (url: string) => {
    playSound('click');
    onClose();
    router.push(url);
  };

  const handleSoundToggle = () => {
    playSound('click');
    setSoundEnabled(!soundEnabled);
  };

  const handleLogout = () => {
    playSound('click');
    onClose();
    logout();
    resetSelection();
    router.push('/');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
      
      {/* 1. Backdrop Overlay */}
      <div
        onClick={() => {
          playSound('click');
          onClose();
        }}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* 2. Drawer Panel */}
      <aside className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between z-10 border-r border-slate-200 animate-in slide-in-from-left duration-300">
        
        {/* TOP: Brand & Close Button */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-xl shadow-inner">
              📐
            </div>
            <div>
              <div className="font-black text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>Maarif Akademi</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-teal-500 text-slate-950 font-black">
                  v2.0
                </span>
              </div>
              <div className="text-[11px] text-teal-300 font-medium truncate">
                Türkiye Yüzyılı Maarif Modeli
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Menüyü Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MIDDLE: User Profile Card & Role Specific Navigation (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          
          {/* USER PROFILE SUMMARY CARD */}
          {currentUser ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <UserAvatar
                  avatar={currentUser.avatar}
                  name={currentUser.name}
                  size="lg"
                  className="w-12 h-12 border-2 border-teal-500 shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-black text-sm text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      isStudent
                        ? 'bg-blue-100 text-blue-800'
                        : isTeacher
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {isStudent ? 'Öğrenci' : isTeacher ? 'Öğretmen' : 'Yönetici'}
                    </span>
                    {isStudent && (
                      <span className="text-xs font-bold text-slate-500">
                        {studentUser?.classSection} • #{studentUser?.studentNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Student Points Bar */}
              {isStudent && (
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Başarı Puanı:</span>
                  </span>
                  <span className="font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    +{studentPoints || 450} XP
                  </span>
                </div>
              )}

              {/* Teacher School Info */}
              {isTeacher && (
                <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold truncate">
                    <School className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">{teacherUser?.school || 'Edirne Selimiye İHO'}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Branş: {teacherUser?.branch || 'Matematik'} • Şubeler: {teacherUser?.assignedClasses?.join(', ') || '5-A, 5-B'}
                  </div>

                  {/* Smart Board Fast Action Button inside Drawer */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenBoardAuthModal?.();
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-xs flex items-center justify-between transition-all cursor-pointer active:scale-98"
                  >
                    <div className="flex items-center gap-2">
                      <Tv className="w-3.5 h-3.5 text-emerald-100" />
                      <span>Akıllı Tahta Girişi (QR / PIN)</span>
                    </div>
                    <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Şifresiz</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-3">
              <div className="flex items-center gap-2 text-teal-900 font-black text-xs">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Hoş Geldiniz</span>
              </div>
              <p className="text-[11px] text-teal-800 leading-relaxed font-medium">
                Öğrenci veya öğretmen hesabınızla giriş yaparak tüm kişisel özelliklerinize erişebilirsiniz.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal?.('login');
                  }}
                  className="flex-1 py-2 rounded-xl bg-teal-600 text-white font-black text-xs shadow-xs hover:bg-teal-700 transition-colors cursor-pointer"
                >
                  Giriş Yap
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal?.('register');
                  }}
                  className="flex-1 py-2 rounded-xl bg-white border border-teal-200 text-teal-900 font-black text-xs hover:bg-teal-50 transition-colors cursor-pointer"
                >
                  Kayıt Ol
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 1. ROLE SPECIFIC MENU LINKS */}
          {/* ========================================================= */}

          {/* 🎓 STUDENT MENU */}
          {isStudent && (
            <div className="space-y-4">
              
              {/* Bölüm: Ana İşlemler */}
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
                  Öğrenci Portalı
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate('/student')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    pathname === '/student' || pathname === '/'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4" />
                    <span>Öğrenci Paneli</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('/games')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    pathname === '/games'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-4 h-4 text-indigo-600" />
                    <span>Oyun Salonu & Zeka Oyunları</span>
                  </div>
                  <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                    Yeni
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMessageModal?.();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-teal-600" />
                    <span>Öğretmenime Mesaj</span>
                  </div>
                  {unreadMessages > 0 ? (
                    <span className="px-2 py-0.2 rounded-full bg-rose-500 text-white font-black text-[10px]">
                      {unreadMessages}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Gelen Kutusu</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('/student')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Akran Değerlendirmelerim</span>
                  </div>
                  <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded-full">
                    +25 XP
                  </span>
                </button>
              </div>

              {/* Bölüm: İnteraktif Kazanım Dersleri */}
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
                  İnteraktif Maarif Derslerim
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate('/lesson/MAT.5.3.1')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    pathname === '/lesson/MAT.5.3.1'
                      ? 'bg-teal-50 text-teal-900 border border-teal-200 font-black'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-xs">📐</span>
                    <span className="truncate">1. Hafta: Doğru & Işın Çizimi</span>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('/lesson/MAT.5.3.2')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    pathname === '/lesson/MAT.5.3.2'
                      ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 font-black'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-xs">📏</span>
                    <span className="truncate">2. Hafta: Cetvel & Pergel İnşası</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('/lesson/MAT.5.3.3')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    pathname === '/lesson/MAT.5.3.3'
                      ? 'bg-amber-50 text-amber-900 border border-amber-200 font-black'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-xs">🧭</span>
                    <span className="truncate">3. Hafta: Açı ve İletki Ölçümü</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              </div>

              {/* Bölüm: Başarı & Takım */}
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
                  Sınıf & Başarı
                </div>

                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>Sınıf Sıralaması</span>
                    </span>
                    <span className="text-[10px] bg-teal-100 text-teal-900 px-1.5 py-0.2 rounded font-black">
                      {studentUser?.classSection || '5-A'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Kendi sınıfının XP liderlik tablosu panoda yayında.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate('/profile')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-600" />
                    <span>Öğrenci Profilim & Ayarlar</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

            </div>
          )}

          {/* 👨‍🏫 TEACHER MENU */}
          {isTeacher && (
            <div className="space-y-4">
              
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
                  Öğretmen Yönetim Merkezi
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate('/teacher')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    pathname === '/teacher' || pathname === '/'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Öğretmen Ana Paneli</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMessageModal?.();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-teal-600" />
                    <span>Mesajlaşma Merkezi</span>
                  </div>
                  {unreadMessages > 0 && (
                    <span className="px-2 py-0.2 rounded-full bg-rose-500 text-white font-black text-[10px]">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('/games')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-4 h-4 text-indigo-600" />
                    <span>Oyun Salonu & Etkinlikler</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

              {/* Öğretmen Modülleri Hızlı Bilgilendirme */}
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
                  Sınıf & Ders Yönetimi
                </div>

                <div
                  onClick={() => handleNavigate('/teacher')}
                  className="p-3 rounded-xl bg-teal-50/70 hover:bg-teal-100/80 border border-teal-200 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black text-teal-900">
                      <BarChart3 className="w-3.5 h-3.5 text-teal-700" />
                      <span>Öğrenci Formları & Raporlar</span>
                    </div>
                    <span className="text-[9px] bg-teal-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                      3D Korelasyon
                    </span>
                  </div>
                  <div className="text-[10px] text-teal-800">
                    Öz & Akran değerlendirme ve oyun başarısı korelasyonu
                  </div>
                </div>

                <div
                  onClick={() => handleNavigate('/teacher')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50/60 border border-slate-200 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Rubrik & Süreç Analitiği</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Öğrenci karneleri, kazanım grafikleri ve PDF raporları
                  </div>
                </div>

                <div
                  onClick={() => handleNavigate('/teacher')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50/60 border border-slate-200 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span>Gruplar & Takım Ödevleri</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Otomatik/manuel takım kurma ve XP puanlama
                  </div>
                </div>

                <div
                  onClick={() => handleNavigate('/teacher')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50/60 border border-slate-200 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <FolderOpen className="w-3.5 h-3.5 text-teal-600" />
                    <span>Sınıf Dosyaları & Akıllı Tahta</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Ders notu oluşturma, kaydetme ve PDF aktarımı
                  </div>
                </div>
              </div>

              {/* Öğretmen Profil & Ayar */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleNavigate('/profile')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-600" />
                    <span>Öğretmen Profilim</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

            </div>
          )}

          {/* 🛡️ ADMIN MENU */}
          {isAdmin && (
            <div className="space-y-4">
              
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
                  Yönetim Paneli
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate('/admin')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    pathname === '/admin'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Yönetici Kontrol Paneli</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMessageModal?.();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span>Duyuru & Mesaj Merkezi</span>
                  </div>
                  {unreadMessages > 0 && (
                    <span className="px-2 py-0.2 rounded-full bg-rose-500 text-white font-black text-[10px]">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('/games')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-4 h-4 text-indigo-600" />
                    <span>Oyun Salonu</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleNavigate('/profile')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-600" />
                    <span>Yönetici Profili</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

            </div>
          )}

          {/* 🌐 GUEST MENU */}
          {isGuest && (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
                  Genel Gezinti
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate('/')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4 text-teal-600" />
                    <span>Ana Sayfa</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('/games')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-4 h-4 text-indigo-600" />
                    <span>Oyun Salonu</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM: Quick Settings & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
          
          <div className="flex items-center justify-between gap-2">
            
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={handleSoundToggle}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-teal-50 border-teal-200 text-teal-800'
                  : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}
              title={soundEnabled ? 'Sesleri Kapat' : 'Sesleri Aç'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-600" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Ses Açık' : 'Ses Kapalı'}</span>
            </button>

            {/* Direct Message shortcut if logged in */}
            {currentUser && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMessageModal?.();
                  }}
                  className="relative p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all cursor-pointer"
                  title="Gelen Kutusu"
                >
                  <Mail className="w-4 h-4 text-teal-700" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </button>
              </>
            )}

          </div>

          {/* Logout / Login button */}
          {currentUser ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Çıkış Yap</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuthModal?.('login');
              }}
              className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Giriş Yap</span>
            </button>
          )}

        </div>

      </aside>

    </div>
  );
}
