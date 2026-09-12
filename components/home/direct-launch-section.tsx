'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import { StudentUser } from '@/types/auth';
import { getDirectLaunchData } from '@/lib/direct-launch';
import { Play, Calendar, Zap, ChevronRight, BookOpen } from 'lucide-react';

const GRADE_STYLES: Record<number, { badge: string; borderHover: string; btnBg: string; text: string }> = {
  5: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    borderHover: 'hover:border-emerald-500 hover:shadow-emerald-500/10',
    btnBg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
    text: 'text-emerald-700'
  },
  6: {
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    borderHover: 'hover:border-blue-500 hover:shadow-blue-500/10',
    btnBg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20',
    text: 'text-blue-700'
  },
  7: {
    badge: 'bg-purple-50 text-purple-800 border-purple-200',
    borderHover: 'hover:border-purple-500 hover:shadow-purple-500/10',
    btnBg: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20',
    text: 'text-purple-700'
  },
  8: {
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    borderHover: 'hover:border-amber-500 hover:shadow-amber-500/10',
    btnBg: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20',
    text: 'text-amber-700'
  },
};

export function DirectLaunchSection() {
  const { playSound } = useApp();
  const { currentUser } = useAuth();

  const isStudent = currentUser?.role === 'student';
  const studentUser = isStudent ? (currentUser as StudentUser) : null;

  // Öğrencinin sınıf seviyesini belirle (örn. 5)
  const studentGradeLevel = useMemo(() => {
    if (!studentUser) return null;
    if (studentUser.gradeLevel) return Number(studentUser.gradeLevel);
    if (studentUser.classSection) {
      const parsed = parseInt(studentUser.classSection.replace(/\D/g, ''), 10);
      if (!isNaN(parsed)) return parsed;
    }
    return null;
  }, [studentUser]);

  // Sunucu / tarayıcı tarihine göre ilgili haftanın kazanımlarını hesapla
  const data = useMemo(() => {
    return getDirectLaunchData();
  }, []);

  // Öğrenci giriş yapmışsa yalnızca kendi sınıf seviyesindeki kartı göster
  const items = useMemo(() => {
    if (!data || !data.items) return [];
    if (isStudent && studentGradeLevel) {
      return data.items.filter((item) => item.gradeLevel === studentGradeLevel);
    }
    return data.items;
  }, [data, isStudent, studentGradeLevel]);

  if (!data || items.length === 0) {
    return null;
  }

  const { week, isUpcoming } = data;

  return (
    <section aria-label="Dersi Doğrudan Başlat" className="hidden md:block w-full pt-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
        
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-1 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 shrink-0">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Dersi Doğrudan Başlat
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-100 text-teal-900 border border-teal-200">
                  Hızlı Başlat
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isStudent && studentGradeLevel
                  ? `MEB Akademik Çalışma Takvimine göre bu haftaki ${studentGradeLevel}. Sınıf müfredat kazanımın`
                  : `MEB Akademik Çalışma Takvimine göre ${week.label} müfredat kazanımları`}
              </p>
            </div>
          </div>

          {/* Date & Week Indicator Badge */}
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-2xs ${
              isUpcoming
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
            }`}>
              <Calendar className="w-3.5 h-3.5" />
              <span>{isUpcoming ? 'Gelecek Hafta' : 'Aktif Hafta'}: {week.formattedDateRange}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Grade Outcome Cards Grid */}
        <div className={`grid gap-4 ${
          items.length === 1
            ? 'grid-cols-1 max-w-md'
            : items.length === 2
            ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {items.map((item) => {
            const style = GRADE_STYLES[item.gradeLevel] || GRADE_STYLES[5];

            return (
              <div
                key={`${item.gradeLevel}-${item.outcomeId}`}
                className={`group bg-white rounded-2xl border-2 border-slate-200/80 ${style.borderHover} hover:shadow-xl transition-all duration-200 p-5 flex flex-col justify-between min-h-[195px] relative`}
              >
                <div>
                  {/* Top Bar: Grade Badge & Date Range */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${style.badge}`}>
                      {item.gradeTitle}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.weekDateRange}
                    </span>
                  </div>

                  {/* Outcome Code & Concise Title */}
                  <div className="space-y-1">
                    <span className={`text-xs font-black tracking-wide ${style.text}`}>
                      {item.outcomeCode}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 line-clamp-2 group-hover:text-teal-700 transition-colors leading-snug">
                      {item.outcomeTitle}
                    </h3>
                  </div>

                  {/* Unit & Topic (Compact single line) */}
                  <p className="text-[11px] text-slate-500 font-semibold mt-2 line-clamp-1 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{item.unitTitle.split(':')[0]}</span>
                  </p>
                </div>

                {/* Direct Launch Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <Link
                    href={`/lesson/${item.outcomeId}`}
                    onClick={() => playSound('click')}
                    className={`w-full py-2.5 px-4 rounded-xl text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${style.btnBg}`}
                    title={`${item.gradeTitle} ${item.outcomeCode} Ders Odasını Aç`}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Dersi Başlat</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
