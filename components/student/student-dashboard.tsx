'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import Link from 'next/link';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  Flame,
  Star,
  CheckCircle2,
  Gamepad2,
  Compass,
  School
} from 'lucide-react';

export function StudentDashboard() {
  const { currentUser } = useAuth();
  const { studentPoints, studentBadges } = useApp();

  const student = currentUser && currentUser.role === 'student' ? currentUser : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Student Gamified Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-blue-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <UserAvatar
            avatar={student?.avatar}
            name={student?.name}
            size="xl"
            className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-blue-400 bg-blue-500/20 text-blue-200 shadow-inner"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black">{student?.name || 'Çırak Hasan'}</h1>
              <span className="px-3 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 font-bold text-xs">
                {student?.classSection || '5-A Sınıfı'} • No: #{student?.studentNumber || '104'}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <School className="w-4 h-4 text-blue-400" />
                <span>{student?.school || 'Edirne Selimiye İmam Hatip Ortaokulu'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* XP / Point Pill */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg">
            ⚡
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300">Toplam Puanın:</div>
            <div className="text-xl sm:text-2xl font-black text-white">
              +{studentPoints || 450} XP
            </div>
          </div>
        </div>
      </div>

      {/* Badges & Active Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active Lessons Hub (2 Cols) */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <span>İnteraktif Maarif Derslerim</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">5. Sınıf Matematik</span>
          </div>

          {/* Lesson 1 Card */}
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-teal-400 transition-all shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-black border border-teal-200">
                1. Hafta Kazanımı (MAT.5.3.1)
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tamamlandı</span>
              </span>
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900">
                Doğru, Doğru Parçası ve Işın Çizimleri
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Kaptan Bilge ve Mimar Defne hikayesi, serbest çizim tahtası, kelime avı bulmacası ve 8 soruluk değerlendirme testi.
              </p>
            </div>

            <Link
              href="/lesson/MAT.5.3.1"
              className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Ders Aşamalarına Git</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Lesson 2 Card */}
          <div className="p-6 rounded-3xl bg-white border-2 border-indigo-200 hover:border-indigo-400 transition-all shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-black border border-indigo-200">
                2. Hafta Kazanımı (MAT.5.3.2)
              </span>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Flame className="w-4 h-4" />
                <span>Yeni Ders!</span>
              </span>
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900">
                Geometrinin İzinde: Çıkarım ve Keşif Atölyesi
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Selimiye Camii planları, 3 kritik deney masası (Ölçülebilirlik, Açı, Çifte Dikme), Çıkarım Terazisi ve Öğrenme Günlüğü.
              </p>
            </div>

            <Link
              href="/lesson/MAT.5.3.2"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Keşif Atölyesini Başlat</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Gamified Badges Showcase (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Rozet Vitrini</span>
            </h3>
            <span className="text-xs font-bold text-amber-600">
              {studentBadges.filter((b) => b.unlocked).length} / {studentBadges.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {studentBadges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                  badge.unlocked
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    badge.unlocked ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {badge.unlocked ? '🏆' : '🔒'}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-black text-slate-900">{badge.title}</div>
                  <div className="text-[10px] text-slate-500">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
