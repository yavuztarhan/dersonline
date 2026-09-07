'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import { StepSelector } from '@/components/step-selector';
import { StudentBadgePanel } from '@/components/student-badge-panel';
import { LandingPage } from '@/components/landing/landing-page';
import { AuthModal } from '@/components/auth/auth-modal';
import {
  GraduationCap,
  Sparkles,
  Tv,
  CheckCircle2,
  BookOpen,
  Award,
  Zap,
  Target,
  Compass,
  LogOut,
  User,
  ShieldCheck,
  ChevronRight,
  School
} from 'lucide-react';

export default function HomePage() {
  const { role, playSound } = useApp();
  const { currentUser, logout } = useAuth();
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

  // 2. If authenticated -> Render Personal Workspace with Welcome Bar & Logout
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Authenticated User Welcome Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 text-2xl flex items-center justify-center shadow-inner shrink-0">
            {currentUser.avatar || '👤'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Hoş geldiniz, {currentUser.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase">
                {currentUser.role === 'admin'
                  ? '🛡️ Sistem Yöneticisi'
                  : currentUser.role === 'teacher'
                  ? '👨‍🏫 Matematik Öğretmeni'
                  : '🎓 Öğrenci'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.role === 'teacher' && (currentUser as any).school
                ? `${(currentUser as any).city} • ${(currentUser as any).school}`
                : 'Türkiye Yüzyılı Maarif Modeli interaktif çalışma alanınızdasınız.'}
            </p>
          </div>
        </div>

        {/* Quick Dashboard & Logout Action */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <Link
            href={
              currentUser.role === 'admin'
                ? '/admin'
                : currentUser.role === 'teacher'
                ? '/teacher'
                : '/student'
            }
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Panelime Git</span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => {
              playSound('click');
              logout();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Oturumu Kapat"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış</span>
          </button>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-slate-800">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Türkiye Yüzyılı Maarif Modeli Müfredatı</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            Geleceğin Akıllı Sınıfı & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
              İnteraktif Matematik Platformu
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Kademeli hiyerarşik akış ile sınıf, ders, ünite ve kazanımınızı seçin; 4 fazlı (Hikâye, Çizim Atölyesi, Bulmaca ve Değerlendirme) akıllı tahta ders odasını başlatın.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Tv className="w-4 h-4 text-teal-400" />
              <span>4K / Dokunmatik Akıllı Tahta Uyumlu</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>SDB Becerileri ve Süreç Bileşenleri</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Target className="w-4 h-4 text-amber-400" />
              <span>{role === 'teacher' ? '👨‍🏫 Öğretmen Modu Aktif' : '🎒 Öğrenci Modu Aktif'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Badge Panel (shown in Student Mode) */}
      {role === 'student' && (
        <div className="animate-in fade-in duration-300">
          <StudentBadgePanel />
        </div>
      )}

      {/* Step-by-Step Cascading Selection Wizard */}
      <StepSelector />

      {/* Maarif Modeli Pillars Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            1
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm">Somuttan Soyuta Anlamlandırma</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Günlük hayat hikayesiyle başlayan kazanım, zihinde soyut sembollere dönüştürülür.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            2
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm">Etkileşimli Atölye ve Çizim</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Doğru, doğru parçası ve ışın çizimleri ekranda anlık sembolik formüllerle eşleşir.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            3
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm">Bilişsel & SDB Gelişimi</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kura çarkı ile katılım artırılır, akran öğrenmesi ve öz düzenleme desteklenir.
          </p>
        </div>
      </div>

    </div>
  );
}
