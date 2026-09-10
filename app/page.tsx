'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import { StepSelector } from '@/components/step-selector';
import { StudentBadgePanel } from '@/components/student-badge-panel';
import { LandingPage } from '@/components/landing/landing-page';
import { AuthModal } from '@/components/auth/auth-modal';
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
  LayoutDashboard,
  Tv
} from 'lucide-react';

export default function HomePage() {
  const { role, playSound } = useApp();
  const { currentUser } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // 1. If not authenticated -> Render rich Landing Page
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LandingPage onOpenAuth={() => setAuthModalOpen(true)} />
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  // Check if teacher profile is incomplete
  const isTeacher = currentUser.role === 'teacher';
  const teacherUser = isTeacher ? (currentUser as any) : null;
  const isTeacherProfileComplete = isTeacher
    ? Boolean(teacherUser?.isProfileComplete || (teacherUser?.school && teacherUser?.city && teacherUser?.district && teacherUser?.branch))
    : true;

  const dashboardHref =
    currentUser.role === 'admin'
      ? '/admin'
      : currentUser.role === 'teacher'
      ? '/teacher'
      : '/student';

  const dashboardLabel =
    currentUser.role === 'admin'
      ? 'Yönetici Paneli'
      : currentUser.role === 'teacher'
      ? 'Öğretmen Paneli'
      : 'Öğrenci Paneli';

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
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            
            {/* Model Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Türkiye Yüzyılı Maarif Modeli</span>
            </div>

            {/* Greeting */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Hoş geldiniz, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">{currentUser.name}</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {isTeacher && teacherUser?.school
                ? `📍 ${teacherUser.city || 'İl'} • ${teacherUser.school} (${teacherUser.branch || 'Matematik'})`
                : currentUser.role === 'student'
                ? `🎓 ${(currentUser as any).school || 'Ortaokul'} • ${(currentUser as any).classSection || '5-A'} Şubesi`
                : 'Sistem Yöneticisi • Maarif Akademi Yönetim Portalı'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-300 font-medium">
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

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end">
            <Link
              href={dashboardHref}
              className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{dashboardLabel}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              href="/profile"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Profilimi Düzenle"
            >
              <User className="w-4 h-4 text-teal-300" />
              <span className="hidden sm:inline">Profilim</span>
            </Link>
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

    </div>
  );
}
