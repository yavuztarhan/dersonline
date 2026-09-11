'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import { getRubricForOutcome } from '@/lib/rubric-data';
import { saveRubricSubmission } from '@/lib/rubric-store';
import { BoardStudentWidget } from '@/components/board/board-student-widget';
import {
  getStoredActiveBoardStudent,
  clearActiveBoardStudent,
  saveBoardParticipation
} from '@/lib/board-participation-store';
import confetti from 'canvas-confetti';
import {
  ClipboardCheck,
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
  FileCheck2
} from 'lucide-react';

interface SelfAssessmentRubricProps {
  outcomeId?: string;
  outcomeTitle?: string;
  outcomeCode?: string;
  onCompleted?: (totalScore: number) => void;
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

export function SelfAssessmentRubricComponent({
  outcomeId = 'MAT.5.3.3',
  outcomeTitle = 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
  outcomeCode = 'MAT.5.3.3',
  onCompleted
}: SelfAssessmentRubricProps) {
  const { playSound, addPoints, unlockBadge } = useApp();

  const rubric = getRubricForOutcome(outcomeId, outcomeTitle, outcomeCode);
  const totalCriteriaCount = rubric.criteria.length;
  const maxPossibleScore = totalCriteriaCount * 4;

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [checklistAnswers, setChecklistAnswers] = useState<Record<string, 'evet' | 'kismen' | 'hayir'>>({});
  const [studentNote, setStudentNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const ratedCount = Object.keys(ratings).length;
  const totalScore = Object.values(ratings).reduce((a, b) => a + b, 0);
  const scorePercentage = Math.round((totalScore / maxPossibleScore) * 100);

  const { currentUser, awardPointsToStudent } = useAuth();
  const student = currentUser && currentUser.role === 'student' ? (currentUser as any) : null;

  const handleSelectLevel = (criterionId: string, level: number) => {
    playSound('select');
    setRatings((prev) => ({
      ...prev,
      [criterionId]: level
    }));
  };

  const handleSaveRubric = async () => {
    if (ratedCount < totalCriteriaCount) {
      playSound('click');
      return;
    }

    // Determine performance level
    const performanceLevel =
      totalScore >= 17 ? 'Mükemmel' : totalScore >= 13 ? 'Başarılı' : totalScore >= 9 ? 'Orta' : 'Geliştirilmeli';

    const submissionData = {
      studentId: student?.id || `stu-local-${Date.now()}`,
      studentName: student?.name || 'Öğrenci (Misafir)',
      studentNumber: student?.studentNumber || '101',
      gradeLevel: student?.gradeLevel || 5,
      classSection: student?.classSection || '5-A',
      school: student?.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
      teacherId: student?.teacherId,
      outcomeId,
      outcomeCode,
      outcomeTitle: rubric.title,
      ratings,
      totalScore,
      maxScore: maxPossibleScore,
      percentage: scorePercentage,
      performanceLevel: performanceLevel as 'Mükemmel' | 'Başarılı' | 'Orta' | 'Geliştirilmeli',
      studentNote: studentNote.trim() || undefined
    };

    // Save in local persistent store
    saveRubricSubmission(submissionData);

    // Save board student participation if active
    const activeBoardStu = getStoredActiveBoardStudent();
    if (activeBoardStu) {
      awardPointsToStudent(activeBoardStu.id, 50);
      saveBoardParticipation({
        studentId: activeBoardStu.id,
        studentName: activeBoardStu.name,
        studentNumber: activeBoardStu.studentNumber,
        classSection: activeBoardStu.classSection,
        school: activeBoardStu.school,
        teacherId: currentUser?.id,
        teacherName: currentUser?.name,
        activityType: 'rubric',
        activityTitle: 'Öz Değerlendirme Formu (Rubrik)',
        outcomeCode: outcomeCode || 'MAT',
        score: scorePercentage,
        maxScore: 100,
        xpEarned: 50
      });
      clearActiveBoardStudent();
    }

    // Save via API in background if possible
    try {
      fetch('/api/rubric-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      }).catch(() => {});
    } catch (e) {}

    playSound('success');
    playSound('bell');
    addPoints(50);
    unlockBadge('maarif-genius');
    setIsSaved(true);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    if (onCompleted) {
      onCompleted(totalScore);
    }
  };

  const handleReset = () => {
    playSound('clear');
    setRatings({});
    setStudentNote('');
    setIsSaved(false);
  };

  // Performance Rating Level Calculation
  const getPerformanceBadge = () => {
    if (totalScore >= 17) {
      return {
        title: '🌟 Mükemmel / Üst Düzey Başarı',
        sub: 'Kazanım hedeflerine tam ulaştınız, kavramları ve matematiksel araçları ustalıkla kullanıyorsunuz.',
        color: 'bg-emerald-500 text-white shadow-emerald-500/20'
      };
    }
    if (totalScore >= 13) {
      return {
        title: '🎯 Başarılı / İyi Düzey',
        sub: 'Kazanım temel yeterliliklerini kazandınız, birkaç küçük tekrarla mükemmel seviyeye ulaşabilirsiniz.',
        color: 'bg-teal-600 text-white shadow-teal-600/20'
      };
    }
    if (totalScore >= 9) {
      return {
        title: '🔄 Orta / Gelişmekte Olan Düzey',
        sub: 'Temel kavramları anladınız; simülasyon ve araç kullanımı üzerinde biraz daha pratik yapmanız önerilir.',
        color: 'bg-amber-500 text-slate-950 shadow-amber-500/20'
      };
    }
    return {
      title: '💡 Başlangıç / Geliştirilmeli Düzey',
      sub: 'Konu basamaklarını tekrar inceleyerek öğretmen ve arkadaşlarınızla pratik yapabilirsiniz.',
      color: 'bg-rose-500 text-white shadow-rose-500/20'
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-teal-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-black uppercase tracking-wider">
              <ClipboardCheck className="w-4 h-4 text-teal-400" />
              <span>Türkiye Yüzyılı Maarif Modeli • Dereceli Öz Değerlendirme</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{rubric.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {rubric.description}
            </p>
          </div>

          {/* Quick Score Widget */}
          <div className="bg-slate-900/90 border border-teal-400/30 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-inner">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">İlerleme</div>
              <div className="text-lg font-mono font-black text-teal-400">
                {ratedCount} / {totalCriteriaCount}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Rubrik Puanı</div>
              <div className="text-lg font-mono font-black text-amber-400">
                {totalScore} / {maxPossibleScore}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
            <span>Değerlendirme Tamamlanma Oranı:</span>
            <span className="font-mono text-teal-300">%{Math.round((ratedCount / totalCriteriaCount) * 100)}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 transition-all duration-300"
              style={{ width: `${(ratedCount / totalCriteriaCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Teacher Smart Board Student Delegation Widget */}
      <BoardStudentWidget activityTitle="Öz Değerlendirme Formu (Rubrik)" />

      {/* 2. Criteria Rubric Cards */}
      <div className="space-y-6">
        {rubric.criteria.map((criterion, idx) => {
          const selectedLevel = ratings[criterion.id];

          return (
            <div
              key={criterion.id}
              className={`bg-white rounded-3xl p-6 border-2 transition-all duration-200 shadow-xs space-y-4 ${
                selectedLevel
                  ? 'border-teal-400/80 shadow-md ring-1 ring-teal-400/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Criterion Header */}
              <div className="flex items-start justify-between gap-3 flex-wrap border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700">
                      {criterion.category}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-0.5">
                      {criterion.title}
                    </h3>
                  </div>
                </div>

                {selectedLevel ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 border border-teal-300 text-xs font-black">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                    <span>Seçilen: {LEVEL_COLORS[selectedLevel].shortTitle}</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 italic font-medium">
                    (Bir düzey seçiniz)
                  </span>
                )}
              </div>

              {/* 4 Levels Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((levelNum) => {
                  const isChosen = selectedLevel === levelNum;
                  const cfg = LEVEL_COLORS[levelNum];
                  const desc = criterion.levelDescriptions[levelNum as 1 | 2 | 3 | 4];

                  return (
                    <button
                      key={levelNum}
                      type="button"
                      disabled={isSaved}
                      onClick={() => handleSelectLevel(criterion.id, levelNum)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all duration-150 flex flex-col justify-between space-y-3 cursor-pointer active:scale-98 ${
                        isChosen
                          ? `${cfg.bg} ${cfg.border} ring-2 ring-teal-400 shadow-md scale-101`
                          : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                      }`}
                    >
                      {/* Level Badge & Star */}
                      <div className="flex items-center justify-between w-full">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border ${
                          isChosen ? `${cfg.badgeBg} ${cfg.badgeText}` : 'bg-white border-slate-200 text-slate-600'
                        }`}>
                          {cfg.title}
                        </span>

                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: levelNum }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 fill-current ${
                                isChosen ? cfg.starColor : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Level Description Statement */}
                      <p className={`text-xs leading-relaxed font-medium ${
                        isChosen ? cfg.text : 'text-slate-600'
                      }`}>
                        "{desc}"
                      </p>

                      {/* Selection Checkmark Indicator */}
                      <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-bold">
                        <span className={isChosen ? 'text-teal-700' : 'text-slate-400'}>
                          {levelNum} Puan
                        </span>
                        {isChosen ? (
                          <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-300 bg-white" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2.5. Student Öz Değerlendirme Maddeleri (Evet / Kısmen / Hayır) */}
      {rubric.checklistItems && rubric.checklistItems.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border-2 border-teal-500/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-sm">
                ✓
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700">
                  Öğrenci Öz Denetim Listesi
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Öğrenci Öz Değerlendirme Maddeleri (Evet / Kısmen / Hayır)
                </h3>
              </div>
            </div>
            <span className="text-xs text-teal-700 font-bold bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              5 Temel Hedef
            </span>
          </div>

          <div className="space-y-2.5">
            {rubric.checklistItems.map((chk, index) => {
              const currentAns = checklistAnswers[chk.id];
              return (
                <div
                  key={chk.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    currentAns
                      ? 'bg-slate-50 border-teal-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-black flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 leading-relaxed">
                      {chk.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {[
                      { val: 'evet', label: 'Evet (3P)', color: 'bg-emerald-600 text-white' },
                      { val: 'kismen', label: 'Kısmen (2P)', color: 'bg-amber-500 text-white' },
                      { val: 'hayir', label: 'Hayır (1P)', color: 'bg-rose-500 text-white' }
                    ].map((btn) => (
                      <button
                        key={btn.val}
                        type="button"
                        disabled={isSaved}
                        onClick={() => {
                          playSound('select');
                          setChecklistAnswers((prev) => ({ ...prev, [chk.id]: btn.val as any }));
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          currentAns === btn.val
                            ? `${btn.color} shadow-sm scale-102`
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Student Personal Reflection & Learning Goal Note */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-black text-slate-900">
              Kişisel Öğrenme Hedefim & Gelişim Notum (SDB1.3: Öz Yansıtma)
            </h3>
          </div>
          <span className="text-xs text-slate-400">İsteğe Bağlı</span>
        </div>

        <textarea
          value={studentNote}
          onChange={(e) => setStudentNote(e.target.value)}
          disabled={isSaved}
          placeholder="Örnek: Bu derste iletkiyi çevirerek ölçüm yapmayı çok iyi anladım. Bir sonraki derste geniş açıların dış cetvelden okunmasına daha çok dikkat edeceğim..."
          rows={3}
          className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs sm:text-sm text-slate-800 bg-slate-50/50 resize-none"
        />
      </div>

      {/* 4. Submission & Results Scorecard */}
      {!isSaved ? (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-bold text-slate-500">
              Tüm ölçütleri ({ratedCount}/{totalCriteriaCount}) değerlendirdiğinizde formu onaylayabilirsiniz.
            </div>
            <div className="text-xs text-teal-700 font-extrabold">
              🏆 Formu tamamladığınızda +50 XP Puanı ve Maarif Rozeti kazanacaksınız.
            </div>
          </div>

          <button
            onClick={handleSaveRubric}
            disabled={ratedCount < totalCriteriaCount}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Öz Değerlendirmeyi Kaydet (+50 XP)</span>
          </button>
        </div>
      ) : (
        /* SAVED COMPLETED VIEW WITH PERFORMANCE BADGE */
        <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-3xl bg-white/20 text-white flex items-center justify-center text-3xl mx-auto shadow-inner">
            🏆
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black">
              Öz Değerlendirme Başarıyla Kaydedildi!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Kendi öğrenme sürecinizi Türkiye Yüzyılı Maarif Modeli kriterlerine göre dereceli olarak değerlendirdiniz.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <div className="text-2xl font-black font-mono">{totalScore} / {maxPossibleScore}</div>
              <div className="text-[11px] text-emerald-100 font-bold mt-0.5">Toplam Rubrik Puanı</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <div className="text-2xl font-black font-mono">%{scorePercentage}</div>
              <div className="text-[11px] text-emerald-100 font-bold mt-0.5">Yetkinlik Düzeyi</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <div className="text-2xl font-black font-mono">+50 XP</div>
              <div className="text-[11px] text-emerald-100 font-bold mt-0.5">Kazanılan Ödül</div>
            </div>
          </div>

          {/* Performance Level Description Card */}
          {(() => {
            const badge = getPerformanceBadge();
            return (
              <div className="bg-white text-slate-900 p-5 rounded-2xl max-w-xl mx-auto shadow-lg space-y-1.5 text-left border border-emerald-200">
                <div className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>{badge.title}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {badge.sub}
                </p>
              </div>
            );
          })()}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yeniden Değerlendir</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
