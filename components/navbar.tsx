'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
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
  RotateCcw
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

  const pathname = usePathname();
  const router = useRouter();
  const isLessonPage = pathname?.startsWith('/lesson/');

  const handleRoleToggle = () => {
    const newRole = role === 'teacher' ? 'student' : 'teacher';
    setRole(newRole);
    playSound('click');
  };

  const handleResetHome = () => {
    playSound('click');
    resetSelection();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
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
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Student Gamification Badge (visible in Student Mode) */}
          {role === 'student' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold shadow-xs animate-pulse-slow">
              <Award className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{studentPoints} Puan</span>
            </div>
          )}

          {/* Role Toggle Switch */}
          <div className="relative inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                if (role !== 'teacher') {
                  setRole('teacher');
                  playSound('click');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                role === 'teacher'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-base">👨‍🏫</span>
              <span className="hidden md:inline">Öğretmen Modu</span>
              <span className="md:hidden">Öğretmen</span>
            </button>

            <button
              onClick={() => {
                if (role !== 'student') {
                  setRole('student');
                  playSound('click');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                role === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-base">🎒</span>
              <span className="hidden md:inline">Öğrenci Modu</span>
              <span className="md:hidden">Öğrenci</span>
            </button>
          </div>

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
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Fullscreen / Smart Board Mode */}
          <button
            onClick={() => {
              playSound('click');
              toggleFullscreen();
            }}
            title={isFullscreen ? 'Tam Ekrandan Çık' : 'Akıllı Tahta / Tam Ekran Modu'}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
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
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
