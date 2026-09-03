'use client';

import React, { useState } from 'react';
import { StoryPhaseData } from '@/types';
import { useApp } from '@/lib/store';
import {
  Sparkles,
  Compass,
  MessageCircle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface StoryPhaseProps {
  data: StoryPhaseData;
  onNextPhase: () => void;
}

export function StoryPhase({ data, onNextPhase }: StoryPhaseProps) {
  const { playSound, role } = useApp();
  const [reflectionRevealed, setReflectionRevealed] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner with Character */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/30 border border-teal-300/30 text-teal-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>1. Aşama: Hayatla Bağlantı & Hikâye</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {data.title}
            </h2>
            <p className="text-teal-100 text-sm max-w-2xl leading-relaxed">
              Matematiğin günlük yaşamdaki doğuşunu ve anlamlandırma sürecini keşfedelim.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-inner">
              {data.character.avatar}
            </div>
            <div>
              <div className="text-sm font-bold text-white">{data.character.name}</div>
              <div className="text-xs text-teal-200">{data.character.role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Story & Visual Analogy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Scenario Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-teal-700 font-extrabold text-sm">
              <Compass className="w-5 h-5" />
              <span>Hikâyenin Başlangıcı</span>
            </div>
            <p className="text-slate-700 text-base leading-relaxed bg-teal-50/40 p-4 rounded-2xl border border-teal-100/80">
              "{data.scenario}"
            </p>
          </div>

          {/* Visual representations badge */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xl mb-1">📍</div>
              <div className="font-bold text-slate-800">Nokta</div>
              <div className="text-[10px] text-slate-500">Konum / Başlangıç</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xl mb-1">📏</div>
              <div className="font-bold text-slate-800">Doğru Parçası</div>
              <div className="text-[10px] text-slate-500">Köprü Kirişi</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xl mb-1">🔦</div>
              <div className="font-bold text-slate-800">Işın</div>
              <div className="text-[10px] text-slate-500">Fener Işığı</div>
            </div>
          </div>
        </div>

        {/* Real Life Connection & Takeaway */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-extrabold text-sm">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>Günlük Hayat ile Matematiksel Köprü</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {data.realLifeConnection}
            </p>
          </div>

          <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-md space-y-2">
            <div className="flex items-center gap-2 text-emerald-100 text-xs font-black uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Kazanım Özeti (Ana Fikir)</span>
            </div>
            <p className="text-white font-bold text-sm sm:text-base leading-snug">
              {data.keyTakeaway}
            </p>
          </div>
        </div>

      </div>

      {/* Reflection & Class Discussion Area */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-extrabold text-base">
            <MessageCircle className="w-5 h-5 text-teal-600" />
            <span>Sınıf İçi Düşünme ve Tartışma Sorusu</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Söz Hakkı Ver</span>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <p className="text-slate-800 font-bold text-base sm:text-lg">
            "{data.reflectionQuestion}"
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={() => {
              playSound('click');
              setReflectionRevealed(!reflectionRevealed);
            }}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-4 py-2.5 rounded-xl border border-teal-200 transition-colors flex items-center gap-1.5"
          >
            <Lightbulb className="w-4 h-4 text-teal-600" />
            <span>{reflectionRevealed ? 'İpuçlarını Gizle' : 'Tartışma İpuçlarını Aç'}</span>
          </button>

          <button
            onClick={() => {
              playSound('select');
              onNextPhase();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>2. Aşamaya Geç: Çizim Atölyesi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {reflectionRevealed && (
          <div className="mt-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-in fade-in duration-200">
            <strong>Öğretmen İpucu:</strong> Işığın uzayda kesintisiz devam ettiği için uzunluğunun sonlu olamayacağını, köprü kirişinin ise iki nokta arasında sabit kalarak ölçülebilir olduğunu vurgulayınız.
          </div>
        )}
      </div>

    </div>
  );
}
