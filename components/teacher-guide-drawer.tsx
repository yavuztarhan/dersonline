'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { PedagogyGuide, Outcome } from '@/types';
import { LessonPlanModal } from '@/components/lesson-plan-modal';
import {
  BookOpen,
  X,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  Target,
  GraduationCap,
  Compass,
  FileText,
  Download
} from 'lucide-react';

interface TeacherGuideDrawerProps {
  outcomeCode: string;
  outcomeTitle: string;
  guide: PedagogyGuide;
  outcome?: Outcome;
}

export function TeacherGuideDrawer({ outcomeCode, outcomeTitle, guide, outcome }: TeacherGuideDrawerProps) {
  const { teacherDrawerOpen, setTeacherDrawerOpen, playSound } = useApp();
  const [showPlanModal, setShowPlanModal] = useState(false);

  if (!teacherDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-700 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-teal-900/60 text-teal-200 text-xs font-black">
                  {outcomeCode}
                </span>
                <span className="text-xs font-semibold text-teal-100">Öğretmen Kılavuzu</span>
              </div>
              <h3 className="text-base font-bold text-white line-clamp-1 mt-0.5">
                {outcomeTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click');
              setTeacherDrawerOpen(false);
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Quick Action: Daily Lesson Plan Download */}
          {outcome && (
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl p-4 shadow-md flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-black flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Maarif Modeli Günlük Ders Planı</span>
                </div>
                <p className="text-[11px] text-teal-100">
                  Bu dersin resmi müfredat ve 4 aşamalı ders planını okulunuza özel PDF olarak indirin.
                </p>
              </div>
              <button
                onClick={() => {
                  playSound('select');
                  setShowPlanModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-white text-teal-900 font-black text-xs shadow-md hover:bg-teal-50 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Planı İndir (PDF)</span>
              </button>
            </div>
          )}

          {/* Maarif Modeli SDB Becerileri */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Sosyal Duygusal Beceriler (SDB) & Değerler</span>
            </div>
            <ul className="space-y-2 text-xs text-emerald-950">
              {guide.maarifSDBs.map((sdb, i) => (
                <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <span className="font-medium">{sdb}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Süreç Bileşenleri */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Maarif Modeli Süreç Bileşenleri</span>
            </div>
            <ul className="space-y-2 text-xs text-blue-950">
              {guide.processComponents.map((sb, i) => (
                <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-blue-100">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <span className="font-medium">{sb}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Öğrenme Çıktıları ve Hedefler */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
              <Target className="w-4 h-4 text-teal-600" />
              <span>Dersin Öğrenme Hedefleri</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {guide.learningGoals.map((goal, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pedagojik İpuçları & Yönergeler */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Pedagojik İpuçları & Uygulama Önerileri</span>
            </div>
            <ul className="space-y-2 text-xs text-amber-950">
              {guide.teacherTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sık Yapılan Kavram Yanılgıları */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Sık Yapılan Kavram Yanılgıları & Dikkat Edilecekler</span>
            </div>
            <ul className="space-y-2 text-xs text-rose-950">
              {guide.misconceptions.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">⚠️</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sınıf İçi Düşündürücü Sorular */}
          <div className="bg-violet-50/70 border border-violet-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-violet-900 font-extrabold text-sm">
              <HelpCircle className="w-4 h-4 text-violet-600" />
              <span>Sınıfı Harekete Geçiren Düşündürücü Sorular</span>
            </div>
            <ul className="space-y-2 text-xs text-violet-950">
              {guide.keyQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-violet-600 font-bold">❓</span>
                  <span className="italic font-medium">{q}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {outcome ? (
            <button
              onClick={() => {
                playSound('select');
                setShowPlanModal(true);
              }}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Günlük Planı İndir (PDF)</span>
            </button>
          ) : <div />}

          <button
            onClick={() => {
              playSound('click');
              setTeacherDrawerOpen(false);
            }}
            className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>

        {/* Lesson Plan PDF Modal */}
        {outcome && (
          <LessonPlanModal
            isOpen={showPlanModal}
            onClose={() => setShowPlanModal(false)}
            outcome={outcome}
          />
        )}

      </div>
    </div>
  );
}
