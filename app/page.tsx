'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import { StepSelector } from '@/components/step-selector';
import { StudentBadgePanel } from '@/components/student-badge-panel';
import { LandingPage } from '@/components/landing/landing-page';
import { AuthModal } from '@/components/auth/auth-modal';
import { DirectLaunchSection } from '@/components/home/direct-launch-section';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Zap,
  Target,
  Compass,
  User,
  ShieldCheck,
  ChevronRight,
  School,
  Tv
} from 'lucide-react';
import { MascotCharacter } from '@/components/mascot';
import { MASCOT_CONFIG } from '@/lib/mascot-config';
import { SuspendedTeacherView } from '@/components/teacher/suspended-teacher-view';

export default function HomePage() {
  const { role, playSound } = useApp();
  const { currentUser } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('error')) {
        setAuthModalOpen(true);
      }
    }
  }, []);

  // 1. If not authenticated -> Render rich Landing Page
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LandingPage onOpenAuth={() => setAuthModalOpen(true)} />
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  // Suspension Guard: If account is suspended (beklemede), show appeal screen
  const isSuspended =
    currentUser.accountStatus === 'beklemede' ||
    currentUser.status === 'suspended' ||
    (currentUser as any).status === 'SUSPENDED';

  if (isSuspended) {
    return <SuspendedTeacherView />;
  }

  // Check if teacher profile is incomplete
  const isTeacher = currentUser.role === 'teacher';
  const teacherUser = isTeacher ? (currentUser as any) : null;
  const isTeacherProfileComplete = isTeacher
    ? Boolean(teacherUser?.isProfileComplete || (teacherUser?.school && teacherUser?.city && teacherUser?.district && teacherUser?.branch))
    : true;

  // 2. Authenticated User Experience
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Teacher Incomplete Profile Alert (Only shown if genuinely incomplete) */}
      {isTeacher && !isTeacherProfileComplete && (
        <div className="p-5 rounded-3xl bg-teal-50 border-2 border-teal-300 text-teal-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in slide-in-from-top">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
              ✨
            </div>
            <div>
              <div className="font-black text-sm text-teal-950">Öğretmen Profilinizi & Okulunuzu Belirleyin</div>
              <div className="text-xs text-teal-800">
                İl, ilçe, okul ve branş bilgilerinizi tamamlayarak sınıfınızı ve öğrenci değerlendirmelerinizi yönetmeye başlayın.
              </div>
            </div>
          </div>
          <Link
            href="/profile"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Profili Tamamla ➔</span>
          </Link>
        </div>
      )}

      {/* Unified Professional Hero Welcome Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-4 sm:p-8 lg:p-10 text-white shadow-xl border border-slate-800">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-8">
          
          {/* Left Column: Greeting, Role Tags & Actions */}
          <div className="space-y-4 max-w-2xl flex-1 w-full">
            
            {/* Model Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Türkiye Yüzyılı Maarif Modeli</span>
            </div>

            {/* Greeting */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Hoş geldiniz, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">{currentUser.name}</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              {isTeacher && teacherUser?.school
                ? `📍 ${teacherUser.city || 'İl'} • ${teacherUser.school} (${teacherUser.branch || 'Matematik'})`
                : currentUser.role === 'student'
                ? `🎓 ${(currentUser as any).school || 'Ortaokul'} • ${(currentUser as any).classSection || '5-A'} Şubesi`
                : 'Sistem Yöneticisi • Maarif Akademi Yönetim Portalı'}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2.5 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
                <Tv className="w-3.5 h-3.5 text-teal-400" />
                <span>Akıllı Tahta & 4 Fazlı Ders Odası</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>SDB Becerileri & Süreç Odaklı Rubrik</span>
              </div>
            </div>
          </div>

          {/* Right Column: Grand & Lively Selim Mascot Section */}
          <div className="flex items-center gap-3.5 sm:gap-5 bg-gradient-to-br from-white/10 to-teal-900/40 backdrop-blur-md p-3.5 sm:p-5 rounded-3xl border border-white/20 shadow-2xl max-w-md w-full lg:w-auto relative group overflow-hidden">
            <div className="relative shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-xl group-hover:bg-teal-400/30 transition-all" />
              <MascotCharacter
                pose={currentUser.role === 'student' ? 'pointing' : currentUser.role === 'teacher' ? 'proud' : 'success'}
                size="lg"
                showBadge
                badgeText="Selim"
              />
            </div>
            <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                  Öğrenme Yoldaşı
                </span>
                <span className="text-[10px] font-bold text-teal-300 sm:hidden">Selim</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-100 font-semibold leading-relaxed break-words">
                {currentUser.role === 'student'
                  ? `"${MASCOT_CONFIG.quotes.heroWelcome}"`
                  : currentUser.role === 'teacher'
                  ? `"${MASCOT_CONFIG.quotes.teacherHelp}"`
                  : `"Sistem yöneticisi hoş geldiniz! Tüm okul ve müfredat verileri hazır."`}
              </div>
              <div className="text-[10px] sm:text-[11px] text-teal-300 font-bold flex items-center gap-1 truncate">
                <span>✨ Anadolu'nun Matematik Dahisi</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Student Badge Panel (shown in Student Mode) */}
      {currentUser.role === 'student' && (
        <div className="animate-in fade-in duration-300">
          <StudentBadgePanel />
        </div>
      )}

      {/* Step-by-Step Cascading Selection Wizard */}
      <StepSelector />

      {/* Dersi Doğrudan Başlat: Takvime Dayalı Hızlı Başlatma Kartları (Mobilde Gizli) */}
      <DirectLaunchSection />

    </div>
  );
}
