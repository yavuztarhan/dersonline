'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import { getRubricForOutcome } from '@/lib/rubric-data';
import { savePeerEvaluation } from '@/lib/peer-evaluation-store';
import { UserAvatar } from '@/components/ui/user-avatar';
import confetti from 'canvas-confetti';
import {
  X,
  Users,
  CheckCircle2,
  Sparkles,
  Trophy,
  Award,
  RotateCcw,
  Star,
  Check,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  Heart,
  Smile,
  ShieldCheck,
  HelpCircle,
  FileCheck2,
  Send
} from 'lucide-react';

interface PeerAssessmentRubricModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStudent: {
    id: string;
    name: string;
    studentNumber: string;
    avatar?: string;
    classSection: string;
  };
  evaluatorStudent: {
    id: string;
    name: string;
    studentNumber: string;
    avatar?: string;
  };
  groupId: string;
  groupName: string;
  outcomeId?: string;
  outcomeTitle?: string;
  outcomeCode?: string;
  onCompleted?: () => void;
}

const LEVEL_COLORS: Record<number, {
  bg: string;
  border: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  starColor: string;
  title: string;
  shortTitle: string;
}> = {
  1: {
    bg: 'bg-rose-50/70 hover:bg-rose-50',
    border: 'border-rose-200 hover:border-rose-400',
    text: 'text-rose-950',
    badgeBg: 'bg-rose-100 border-rose-300',
    badgeText: 'text-rose-800',
    starColor: 'text-rose-400',
    title: '1. Düzey: Geliştirilmeli',
    shortTitle: 'Geliştirilmeli (1P)'
  },
  2: {
    bg: 'bg-amber-50/70 hover:bg-amber-50',
    border: 'border-amber-200 hover:border-amber-400',
    text: 'text-amber-950',
    badgeBg: 'bg-amber-100 border-amber-300',
    badgeText: 'text-amber-800',
    starColor: 'text-amber-400',
    title: '2. Düzey: Kısmen Başarılı',
    shortTitle: 'Kısmen Başarılı (2P)'
  },
  3: {
    bg: 'bg-teal-50/70 hover:bg-teal-50',
    border: 'border-teal-200 hover:border-teal-400',
    text: 'text-teal-950',
    badgeBg: 'bg-teal-100 border-teal-300',
    badgeText: 'text-teal-800',
    starColor: 'text-teal-500',
    title: '3. Düzey: Başarılı',
    shortTitle: 'Başarılı (3P)'
  },
  4: {
    bg: 'bg-emerald-50/70 hover:bg-emerald-50',
    border: 'border-emerald-200 hover:border-emerald-400',
    text: 'text-emerald-950',
    badgeBg: 'bg-emerald-100 border-emerald-300',
    badgeText: 'text-emerald-800',
    starColor: 'text-emerald-500',
    title: '4. Düzey: Çok Başarılı',
    shortTitle: 'Çok Başarılı (4P)'
  }
};

export function PeerAssessmentRubricModal({
  isOpen,
  onClose,
  targetStudent,
  evaluatorStudent,
  groupId,
  groupName,
  outcomeId = 'MAT.5.3.3',
  outcomeTitle = 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
  outcomeCode = 'MAT.5.3.3',
  onCompleted
}: PeerAssessmentRubricModalProps) {
  const { playSound, addPoints, unlockBadge } = useApp();
  const { awardPointsToStudent } = useAuth();

  const rubric = getRubricForOutcome(outcomeId, outcomeTitle, outcomeCode);
  const totalCriteriaCount = rubric.criteria.length;
  const maxPossibleScore = totalCriteriaCount * 4;

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [peerNote, setPeerNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectRating = (criteriaId: string, level: number) => {
    playSound('select');
    setRatings((prev) => ({
      ...prev,
      [criteriaId]: level
    }));
  };

  const handleToggleChecklist = (checkId: string) => {
    playSound('click');
    setChecklist((prev) => ({
      ...prev,
      [checkId]: !prev[checkId]
    }));
  };

  // Calculate scores
  const ratedCount = Object.keys(ratings).length;
  const isAllRated = ratedCount === totalCriteriaCount;
  const currentTotalScore = Object.values(ratings).reduce((a, b) => a + b, 0);
  const percentage = Math.round((currentTotalScore / maxPossibleScore) * 100);

  const getPerformanceLevel = (pct: number): 'Mükemmel' | 'Başarılı' | 'Orta' | 'Geliştirilmeli' => {
    if (pct >= 85) return 'Mükemmel';
    if (pct >= 70) return 'Başarılı';
    if (pct >= 50) return 'Orta';
    return 'Geliştirilmeli';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAllRated) return;

    playSound('success');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const performanceLevel = getPerformanceLevel(percentage);

    // Save to Peer Evaluation Store
    savePeerEvaluation({
      evaluatorStudentId: evaluatorStudent.id,
      evaluatorStudentName: evaluatorStudent.name,
      evaluatorStudentNumber: evaluatorStudent.studentNumber,
      targetStudentId: targetStudent.id,
      targetStudentName: targetStudent.name,
      targetStudentNumber: targetStudent.studentNumber,
      targetAvatar: targetStudent.avatar || '🎓',
      groupId,
      groupName,
      classSection: targetStudent.classSection || '5-A',
      outcomeCode,
      outcomeTitle,
      ratings,
      totalScore: currentTotalScore,
      maxScore: maxPossibleScore,
      percentage,
      performanceLevel,
      evaluatorNote: peerNote.trim()
    });

    // Reward Evaluator Student for contributing to Peer Assessment (+25 XP)
    if (awardPointsToStudent) {
      awardPointsToStudent(evaluatorStudent.id, 25);
    }
    addPoints(25);
    unlockBadge('badge-peer-reviewer');

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-teal-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0 border-b border-teal-800/40">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Akran Değerlendirme Formu</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-xs font-bold">
                Grup: {groupName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold">
                {outcomeCode}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              Akran Değerlendirmesi: {outcomeTitle}
            </h2>

            {/* Target Student Identity Banner */}
            <div className="mt-3 p-3.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center gap-3.5 flex-wrap sm:flex-nowrap">
              <UserAvatar
                avatar={targetStudent.avatar}
                name={targetStudent.name}
                size="md"
                className="w-12 h-12 border-2 border-teal-400 bg-teal-950 text-white shadow-sm shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase font-bold text-teal-300">
                  Değerlendirilen Takım Arkadaşın:
                </div>
                <div className="text-base font-black text-white truncate">
                  {targetStudent.name}
                </div>
                <div className="text-xs text-slate-300">
                  {targetStudent.classSection} Şubesi • Okul No: #{targetStudent.studentNumber}
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-200 text-xs font-bold text-right shrink-0">
                ✨ +25 XP Katılım Ödülü
              </div>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Kapat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* MODAL BODY (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in duration-300">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center text-4xl shadow-lg animate-bounce">
                🎉
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Akran Değerlendirmesi Başarıyla Kaydedildi!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                <strong>{targetStudent.name}</strong> için hazırladığın akran değerlendirmesi başarıyla sisteme aktarıldı. Akran öğrenimine katkı sağladığın için <strong>+25 XP</strong> kazandın!
              </p>

              <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 font-bold text-sm">
                <span>Verilen Toplam Puan:</span>
                <span className="text-xl font-black text-teal-700">{currentTotalScore} / {maxPossibleScore} (%{percentage})</span>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    onCompleted?.();
                    onClose();
                  }}
                  className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
                >
                  Tamamla ve Kapat
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Guidance Box */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs leading-relaxed space-y-1">
                <div className="font-black flex items-center gap-1.5 text-blue-950">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Nasıl Değerlendirmelisin?</span>
                </div>
                <p>
                  Grup çalışmalarında, etkinliklerde ve ders aşamalarında takım arkadaşın <strong>{targetStudent.name}</strong>'in gösterdiği gayreti, problem çözme adımlarını ve katkısını tarafsız, yapıcı ve adil şekilde 1'den 4'e kadar puanlayınız.
                </p>
              </div>

              {/* CRITERIA LIST */}
              <div className="space-y-6">
                {rubric.criteria.map((criterion, index) => {
                  const selectedLevel = ratings[criterion.id];

                  return (
                    <div
                      key={criterion.id}
                      className={`p-5 sm:p-6 rounded-3xl border-2 transition-all space-y-4 ${
                        selectedLevel
                          ? 'bg-white border-teal-400 shadow-md ring-2 ring-teal-400/10'
                          : 'bg-slate-50/60 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="space-y-0.5">
                          <div className="text-[10px] uppercase font-black tracking-wider text-teal-700">
                            {criterion.category} • Kriter #{index + 1}
                          </div>
                          <h4 className="text-base font-black text-slate-900">
                            {criterion.title}
                          </h4>
                        </div>

                        {selectedLevel ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-black border ${LEVEL_COLORS[selectedLevel].badgeBg} ${LEVEL_COLORS[selectedLevel].badgeText}`}>
                            {LEVEL_COLORS[selectedLevel].shortTitle}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                            Seçim Bekleniyor
                          </span>
                        )}
                      </div>

                      {/* 4 Levels Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((level) => {
                          const lvlInfo = LEVEL_COLORS[level];
                          const desc = criterion.levelDescriptions[level as 1 | 2 | 3 | 4];
                          const isSelected = selectedLevel === level;

                          return (
                            <button
                              key={level}
                              type="button"
                              onClick={() => handleSelectRating(criterion.id, level)}
                              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                                isSelected
                                  ? `${lvlInfo.bg} ${lvlInfo.border} ring-2 ring-teal-500 shadow-sm scale-101`
                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: level }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 fill-current ${
                                        isSelected ? lvlInfo.starColor : 'text-slate-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                                  isSelected ? lvlInfo.badgeBg + ' ' + lvlInfo.badgeText : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {level} Puan
                                </span>
                              </div>

                              <p className="text-xs leading-relaxed font-medium text-slate-800">
                                {desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Peer Feedback Note */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Takım Arkadaşına Teşekkür / Gelişim Notu (İsteğe Bağlı)</span>
                  <span className="text-[10px] text-slate-400 font-bold">Nezaket ve destek dili</span>
                </label>
                <textarea
                  value={peerNote}
                  onChange={(e) => setPeerNote(e.target.value)}
                  placeholder={`Örn: "${targetStudent.name} grup çalışmasında açı ölçümünde çok dikkatliydi, birlikte çalışmak çok keyifliydi."`}
                  rows={3}
                  maxLength={300}
                  className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                />
              </div>

              {/* SUBMIT FOOTER */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-teal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs text-teal-300 font-bold uppercase tracking-wider">
                    Değerlendirme İlerlemesi: {ratedCount} / {totalCriteriaCount} Kriter
                  </div>
                  <div className="text-lg font-black text-white flex items-center justify-center sm:justify-start gap-2">
                    <span>Toplam Puan: {currentTotalScore} / {maxPossibleScore}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500 text-slate-950 font-black">
                      %{percentage}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={!isAllRated}
                    className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                      isAllRated
                        ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/20 active:scale-95'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>Akran Formunu Gönder (+25 XP)</span>
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
