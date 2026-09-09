'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthModal } from '@/components/auth/auth-modal';
import { GoogleSignInModal } from '@/components/auth/google-sign-in-modal';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  GraduationCap,
  Sparkles,
  Tv,
  BookOpen,
  Award,
  Zap,
  Target,
  Compass,
  Lock,
  ArrowRight,
  CheckCircle2,
  Users,
  ShieldCheck,
  Building2,
  Layers,
  ChevronRight,
  Play,
  FileCheck2,
  Sparkle
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth?: (tab: 'login' | 'register') => void;
}

export function LandingPage({ onOpenAuth }: LandingPageProps) {
  const { loginWithGoogle } = useAuth();
  const { setRole, playSound } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  const handleOpenLogin = () => {
    playSound('click');
    setAuthModalTab('login');
    setAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    playSound('click');
    setAuthModalTab('register');
    setAuthModalOpen(true);
  };

  const handleGoogleAccountSelect = (profile: { name: string; email: string; avatar?: string }) => {
    const result = loginWithGoogle(profile);
    if (result.user.role === 'student') {
      setRole('student');
    } else {
      setRole('teacher');
    }
    setGoogleModalOpen(false);
  };

  return (
    <div className="w-full space-y-16 py-6 pb-20 animate-in fade-in duration-300">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl border border-slate-800">
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          
          {/* Badge & Logo */}
          <div className="flex items-center gap-3.5 flex-wrap">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border border-amber-500/40 shrink-0 bg-slate-950">
              <Image
                src="/logo-192.png"
                alt="Maarif Akademi Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Türkiye Yüzyılı Maarif Modeli • 5. Sınıf Matematik</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Matematiği Keşfet, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">
              Geleceğin Akıllı Sınıfını
            </span>{' '}
            İnşa Et!
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
            Edirne Selimiye Camii'nin kubbesinden uzay geometrisine uzanan 4 fazlı hikâye, deney atölyesi, kavram bulmacası ve değerlendirme odalarıyla yeni nesil akıllı tahta deneyimi.
          </p>

          {/* Hero CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={handleOpenLogin}
              className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-teal-500/30 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Hemen Başla / Giriş Yap</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setGoogleModalOpen(true)}
              className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2.5 active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.43 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.57 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google ile Giriş</span>
            </button>

            <button
              onClick={handleOpenRegister}
              className="px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-teal-300 font-bold text-xs sm:text-sm border border-teal-500/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-teal-400" />
              <span>Öğretmen Kaydı (Yeni)</span>
            </button>
          </div>

          {/* Key Indicators */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 border-t border-slate-800/80">
            <div className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
              <Tv className="w-4 h-4 text-teal-400 shrink-0" />
              <span>4K / Dokunmatik Tahta</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>81 İl & MEB Okul Ağı</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
              <Compass className="w-4 h-4 text-amber-400 shrink-0" />
              <span>SDB1.3 Öz Düzenleme</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Yönetici Onaylı Güvenlik</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. PROTECTED CURRICULUM OUTCOMES SHOWCASE */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-teal-700">
              Müfredat İçerikleri & Ders Odaları
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              5. Sınıf Geometri & Uzay Kazanımları
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Ders akışlarına ve akıllı tahta moduna erişmek için kullanıcı girişi yapılması gerekmektedir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Outcome 1 Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-xl transition-all space-y-5 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-black">
                MAT.5.3.1
              </span>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <span>1. Hafta</span>
                <span>•</span>
                <span>4 Faz</span>
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                Temel Geometrik Kavramlar ve Çizimler
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Nokta, doğru, doğru parçası ve ışın kavramlarını Mimar Sinan'ın Edirne Selimiye Camii inşası hikayesiyle keşfedin.
              </p>
            </div>

            {/* 4 Phases List */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-600">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
                <span>📖 1. Faz: Hikâye</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
                <span>📐 2. Faz: Laboratuvar</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
                <span>🧩 3. Faz: Bulmaca</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
                <span>📝 4. Faz: Değerlendirme</span>
              </div>
            </div>

            {/* Locked Action Button */}
            <button
              onClick={handleOpenLogin}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Giriş Yaparak Dersi Başlat</span>
            </button>
          </div>

          {/* Outcome 2 Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-xl transition-all space-y-5 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                MAT.5.3.2
              </span>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <span>2. Hafta</span>
                <span>•</span>
                <span>4 Faz</span>
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                İki Noktanın Konumu & Eş Doğru Parçaları
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Kareli ve noktalı kâğıtta yön/birim ötelemesi, eş uzunluktaki doğru parçaları ve Mimar Sinan'ın kemer çizimleri.
              </p>
            </div>

            {/* 4 Phases List */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-600">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
                <span>📖 1. Faz: Sinan'ın Sırrı</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
                <span>🧪 2. Faz: Deney Masası</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
                <span>🧩 3. Faz: Çengel Bulmaca</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
                <span>📔 4. Faz: SDB1.3 Günlük</span>
              </div>
            </div>

            {/* Locked Action Button */}
            <button
              onClick={handleOpenLogin}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Giriş Yaparak Dersi Başlat</span>
            </button>
          </div>

        </div>
      </section>

      {/* 3. 4-PHASE METHODOLOGY */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8 border border-slate-800">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-400">
            Pedagojik Öğrenme Mimarisi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Somuttan Soyuta 4 Kademeli Maarif Odası
          </h2>
          <p className="text-xs text-slate-400">
            Öğrencilerin kavramları ezberlemeden, keşfederek ve yaşayarak içselleştirmesini sağlayan pedagojik tasarım.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 font-black flex items-center justify-center text-sm border border-teal-500/30">
              1
            </div>
            <h4 className="font-extrabold text-sm text-white">Hikâye & Bağlam</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mimar Sinan ve Çırak Hasan'ın Selimiye Camii şantiyesindeki günlük hayat problemleri.
            </p>
          </div>

          <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 font-black flex items-center justify-center text-sm border border-emerald-500/30">
              2
            </div>
            <h4 className="font-extrabold text-sm text-white">Deney Laboratuvarı</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dinamik çizim araçları, cetvel, lazer ve açıölçer ile somut çizim deneyleri.
            </p>
          </div>

          <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 font-black flex items-center justify-center text-sm border border-amber-500/30">
              3
            </div>
            <h4 className="font-extrabold text-sm text-white">Kavram Çıkarımı</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              İnteraktif çengel bulmacalar ve tümevarım eşleştirmeleriyle sembolik matematik.
            </p>
          </div>

          <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 font-black flex items-center justify-center text-sm border border-purple-500/30">
              4
            </div>
            <h4 className="font-extrabold text-sm text-white">SDB Değerlendirme</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Süreç bileşenleri, öğrenme günlüğü ve anlık öğretmen dönüt mekanizması.
            </p>
          </div>
        </div>
      </section>

      {/* 4. ROLES OVERVIEW */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-700">
            Kullanıcı Rolleri
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Her Paydaş İçin Özel Tasarlanmış Paneller
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Admin Tile */}
          <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">Yönetici (Admin) Masası</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Kayıt olan öğretmenleri onaylar/reddeder, 81 ildeki okul verilerini ve öğrenci başarı istatistiklerini denetler.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Öğretmen Başvuru Onay Masası</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>81 İl Okul Listesi Denetimi</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Öğrenci ve Sınıf Raporları</span>
              </li>
            </ul>
          </div>

          {/* Teacher Tile */}
          <div className="bg-white p-6 rounded-3xl border border-teal-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center text-2xl">
              👨‍🏫
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">Öğretmen Paneli</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Sınıflarını yönetir (`5-A`, `5-B`), akıllı tahta ders odasını başlatır ve öğrenci kazanım çizelgelerini takip eder.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Akıllı Tahtada Dersi Başlat</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Sınıf ve Öğrenci Yönetimi</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Kura Çarkı ve Pedagojik Rehber</span>
              </li>
            </ul>
          </div>

          {/* Student Tile */}
          <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-2xl">
              🎓
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">Öğrenci Masası</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Kazanımları tamamladıkça XP puanları ve Maarif rozetleri kazanır, çizim ödevlerini etkileşimli çözer.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>XP Puanı & Maarif Rozet Vitrini</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>İnteraktif Çizim & Çengel Bulmaca</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>SDB1.3 Kişisel Öğrenme Günlüğü</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION BOTTOM BANNER */}
      <section className="bg-gradient-to-r from-teal-800 to-emerald-800 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
          Siz de Maarif Akademi Ailesine Katılın
        </h2>
        <p className="text-xs sm:text-sm text-teal-100 max-w-xl mx-auto leading-relaxed">
          Türkiye Yüzyılı Maarif Modeli ile derslerinizi akıllı tahtada görsel bir şölene dönüştürün.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleOpenLogin}
            className="px-6 py-3 rounded-2xl bg-white text-teal-950 hover:bg-teal-50 font-black text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Sisteme Giriş Yap
          </button>
          <button
            onClick={handleOpenRegister}
            className="px-6 py-3 rounded-2xl bg-teal-900/60 hover:bg-teal-900 text-white font-bold text-xs border border-teal-400/40 transition-all cursor-pointer"
          >
            Öğretmen Hesabı Başlat
          </button>
        </div>
      </section>

      {/* Auth Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />

      <GoogleSignInModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelect}
        mode="login"
      />

    </div>
  );
}
