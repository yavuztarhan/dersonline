'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOutcomeById, getBreadcrumbPath } from '@/lib/curriculum-data';
import { LessonPhaseId } from '@/types';
import { useApp } from '@/lib/store';
import { BoardToolbar } from '@/components/board-toolbar';
import { DrawingCanvas } from '@/components/drawing-canvas';
import { TeacherGuideDrawer } from '@/components/teacher-guide-drawer';
import { StoryPhase } from '@/components/lesson-phases/story-phase';
import { LabPhase } from '@/components/lesson-phases/lab-phase';
import { PuzzlePhase } from '@/components/lesson-phases/puzzle-phase';
import { AssessmentPhase } from '@/components/lesson-phases/assessment-phase';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Home,
  Sparkles,
  AlertCircle,
  Lock
} from 'lucide-react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useDemoMode } from '@/lib/demo-mode-store';
import { isDemoOutcome } from '@/lib/demo-seed-data';

export default function LessonRoomPage() {
  const params = useParams();
  const router = useRouter();
  const outcomeId = typeof params?.outcomeId === 'string' ? params.outcomeId : '';

  const { playSound, role, setSelectedOutcome, setDrawingActive, setShowAnswers } = useApp();
  const { isDemoMode } = useDemoMode();
  const [activePhase, setActivePhase] = useState<LessonPhaseId>('story');

  const outcome = getOutcomeById(outcomeId);
  const pathInfo = getBreadcrumbPath(outcomeId);

  useEffect(() => {
    setDrawingActive(false);
    setShowAnswers(false);
    if (outcome) {
      if (!isDemoMode || isDemoOutcome(outcome.code)) {
        setSelectedOutcome(outcome);
      }
    }
  }, [outcomeId, outcome, isDemoMode, setSelectedOutcome, setDrawingActive, setShowAnswers]);

  // If outcome not found
  if (!outcome) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Kazanım Bulunamadı</h2>
        <p className="text-xs text-slate-500">
          İstenen <strong>"{outcomeId}"</strong> kazanımı müfredat listesinde kayıtlı değil.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Kazanım Seçimine Dön</span>
        </Link>
      </div>
    );
  }

  // If locked in demo mode
  if (isDemoMode && outcome && !isDemoOutcome(outcome.code)) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-amber-200 text-center space-y-5 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
            DEMO SÜRÜM KISITLAMASI
          </span>
          <h2 className="text-xl font-black text-slate-800">
            Bu Kazanım Tam Sürümde Aktiftir
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>{outcome.code} - {outcome.title}</strong> kazanımı tam sürümde aktiftir. Gösterim / Demo sürümünde 5, 6 ve 7. sınıfın ilk kazanımları (<strong>MAT.5.3.1</strong>, <strong>MAT.6.1.1</strong>, <strong>MAT.7.1.1</strong>) tam erişime açıktır.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Kazanım Listesi</span>
          </Link>
          <Link
            href="/lesson/mat-7-1-1"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>7. Sınıf Demosunu Aç</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard
      title="Akıllı Tahta Ders Odası Girişi"
      description={`"${outcome.code} - ${outcome.shortTitle}" interaktif ders odasına ve 4 fazlı akıllı tahta atölyesine erişmek için lütfen giriş yapınız.`}
    >
      <div className="relative min-h-[calc(100vh-4.5rem)] flex flex-col bg-slate-50">
        
        {/* Smart Board Annotation Transparent Canvas Layer */}
        <DrawingCanvas />

        {/* Top Board Navigation & Toolbar */}
        <BoardToolbar
          currentPhase={activePhase}
          onSelectPhase={(phase) => setActivePhase(phase)}
          outcomeCode={outcome.code}
          outcomeTitle={outcome.shortTitle}
          outcome={outcome}
        />

        {/* Breadcrumb Path Banner */}
        <div className="bg-slate-100/80 border-b border-slate-200/60 px-4 sm:px-6 py-2 text-xs font-semibold text-slate-500">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-teal-700 transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                <span>Ana Sayfa</span>
              </Link>

              {pathInfo && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>{pathInfo.grade.title}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>{pathInfo.subject.title}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="line-clamp-1">{pathInfo.unit.title.split(':')[0]}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="text-teal-700 font-bold">{outcome.code}</span>
                </>
              )}
            </div>

            <div className="text-[11px] text-teal-800 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
              <span>📚 Türkiye Yüzyılı Maarif Modeli</span>
            </div>
          </div>
        </div>

        {/* Dynamic Lesson Phase Slot */}
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 z-10">
          {activePhase === 'story' && (
            <StoryPhase
              data={outcome.phases.story}
              onNextPhase={() => setActivePhase('lab')}
            />
          )}

          {activePhase === 'lab' && (
            <LabPhase
              data={outcome.phases.lab}
              onNextPhase={() => setActivePhase('puzzle')}
            />
          )}

          {activePhase === 'puzzle' && (
            <PuzzlePhase
              data={outcome.phases.puzzle}
              onNextPhase={() => setActivePhase('assessment')}
            />
          )}

          {activePhase === 'assessment' && (
            <AssessmentPhase data={outcome.phases.assessment} />
          )}
        </div>

        {/* Pedagogical Guide Slide-over Drawer for Teacher */}
        <TeacherGuideDrawer
          outcomeCode={outcome.code}
          outcomeTitle={outcome.title}
          guide={outcome.pedagogyGuide}
          outcome={outcome}
        />

      </div>
    </AuthGuard>
  );
}
