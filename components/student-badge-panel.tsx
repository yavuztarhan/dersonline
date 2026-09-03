'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Star,
  Zap,
  Layers,
  Shapes,
  Puzzle
} from 'lucide-react';

const BADGE_ICONS: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-6 h-6" />,
  Shapes: <Shapes className="w-6 h-6" />,
  Puzzle: <Puzzle className="w-6 h-6" />,
  Trophy: <Trophy className="w-6 h-6" />,
};

export function StudentBadgePanel() {
  const { studentBadges, studentPoints, role } = useApp();

  const unlockedCount = studentBadges.filter((b) => b.unlocked).length;
  const level = Math.floor(studentPoints / 50) + 1;
  const progressInLevel = (studentPoints % 50) * 2; // 0 to 100%

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
      
      {/* Student Level & Points Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
            🎒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                Seviye {level}
              </span>
              <span className="text-xs text-indigo-200">Bireysel Öğrenci Portfolyosu</span>
            </div>
            <h3 className="text-xl font-black mt-1">Öğrenme ve Beceri İlerlemen</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
          <div className="text-center">
            <div className="text-2xl font-black text-amber-300">{studentPoints}</div>
            <div className="text-[10px] uppercase font-bold text-indigo-200">Toplam Puan</div>
          </div>
          <div className="w-[1px] h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-2xl font-black text-emerald-300">
              {unlockedCount}/{studentBadges.length}
            </div>
            <div className="text-[10px] uppercase font-bold text-indigo-200">Kazanılan Rozet</div>
          </div>
        </div>
      </div>

      {/* Level XP Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-600">
          <span>Seviye {level} İlerlemesi</span>
          <span className="text-indigo-600">Sonraki Seviyeye {50 - (studentPoints % 50)} Puan Kaldı</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progressInLevel}%` }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Maarif Başarı Rozetleri
          </h4>
          <span className="text-xs text-slate-500 font-medium">
            Etkileşimli adımları tamamlayarak kilitleri aç
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {studentBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-3 ${
                badge.unlocked
                  ? 'bg-gradient-to-b from-amber-50/60 to-white border-amber-300 shadow-xs'
                  : 'bg-slate-50/80 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${
                    badge.unlocked
                      ? 'bg-gradient-to-tr from-amber-400 to-orange-500 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {BADGE_ICONS[badge.icon] || <Award className="w-6 h-6" />}
                </div>

                {badge.unlocked ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Kazanıldı
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 font-bold text-[10px] flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Kilitli
                  </span>
                )}
              </div>

              <div>
                <h5 className="font-extrabold text-slate-800 text-sm">{badge.title}</h5>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  {badge.description}
                </p>
              </div>

              {badge.earnedAt && (
                <div className="text-[10px] text-amber-700 font-semibold pt-2 border-t border-amber-100">
                  Kazanıldı: {badge.earnedAt}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
