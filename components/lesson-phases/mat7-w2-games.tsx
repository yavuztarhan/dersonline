'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Train,
  Scale,
  Crosshair,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Award,
  ArrowRight,
  Zap,
  Play,
  Flame,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { getStoredActiveBoardStudent, clearActiveBoardStudent, saveBoardParticipation } from '@/lib/board-participation-store';
import { useAuth } from '@/lib/auth-store';
import { MathFraction } from '@/components/ui/math-fraction';

// =================================================================
// 1. OYUN: RASYONEL METRO HATTI (DURAK EŞLEME)
// =================================================================
interface MetroStationQuestion {
  id: number;
  fractionDisplay: string;
  fractionValue: number;
  mixedDisplay: string;
  leftInt: number;
  rightInt: number;
  denominator: number;
  numeratorPart: number; // 0-based index from left to right or from 0
  explanation: string;
}

const METRO_QUESTIONS: MetroStationQuestion[] = [
  {
    id: 1,
    fractionDisplay: '-9/2',
    fractionValue: -4.5,
    mixedDisplay: '-4 tam 1/2',
    leftInt: -5,
    rightInt: -4,
    denominator: 2,
    numeratorPart: 1,
    explanation: '-9/2 bileşik kesri -4 tam 1/2 eder. Sayı doğrusunda -4 ile -5 arasındaki tam orta noktadadır.'
  },
  {
    id: 2,
    fractionDisplay: '+7/3',
    fractionValue: 7 / 3,
    mixedDisplay: '+2 tam 1/3',
    leftInt: 2,
    rightInt: 3,
    denominator: 3,
    numeratorPart: 1,
    explanation: '+7/3 bileşik kesri +2 tam 1/3 eder. 2 ile 3 arası 3 eşit parçaya bölünüp 2\'den sağa 1. parça seçilir.'
  },
  {
    id: 3,
    fractionDisplay: '-7/4',
    fractionValue: -1.75,
    mixedDisplay: '-1 tam 3/4',
    leftInt: -2,
    rightInt: -1,
    denominator: 4,
    numeratorPart: 1, // -2'ye daha yakın: -1'den sola 3 çeyrek = -2'den sağa 1 çeyrek
    explanation: '-7/4 kesri -1 tam 3/4 eder. -1 ile -2 arası 4 eşit parçaya bölünür, sıfırdan sola doğru 7. çeyrek (-1\'in solundaki 3. nokta) işaretlenir.'
  },
  {
    id: 4,
    fractionDisplay: '+11/4',
    fractionValue: 2.75,
    mixedDisplay: '+2 tam 3/4',
    leftInt: 2,
    rightInt: 3,
    denominator: 4,
    numeratorPart: 3,
    explanation: '+11/4 kesri +2 tam 3/4 eder. 2 ile 3 arası 4 parçaya bölünür ve 2\'den sağa 3. nokta seçilir.'
  },
  {
    id: 5,
    fractionDisplay: '-3/5',
    fractionValue: -0.6,
    mixedDisplay: '-3/5 (Basit Kesir)',
    leftInt: -1,
    rightInt: 0,
    denominator: 5,
    numeratorPart: 2, // 0'dan sola 3 birim, yani -1'den sağa 2 birim
    explanation: '-3/5 basit kesri 0 ile -1 arasındadır. Aralık 5 parçaya bölünür, 0\'dan sola doğru 3. nokta işaretlenir.'
  }
];

export function RationalMetroLineGame() {
  const { playSound, addPoints, unlockBadge, selectedOutcome } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedFractionIndex, setSelectedFractionIndex] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const q = METRO_QUESTIONS[currentIndex];

  const handleSelectStation = (intVal: number) => {
    if (feedback) return;
    playSound('click');
    setSelectedLeft(intVal);
    setSelectedFractionIndex(null);
  };

  const handleSelectSlot = (slotIdx: number) => {
    if (feedback || selectedLeft === null) return;
    playSound('click');
    setSelectedFractionIndex(slotIdx);
  };

  const handleCheckPlacement = () => {
    if (selectedLeft === null || selectedFractionIndex === null || feedback) return;

    const isIntervalCorrect = selectedLeft === q.leftInt;
    const isSlotCorrect = selectedFractionIndex === q.numeratorPart;

    if (isIntervalCorrect && isSlotCorrect) {
      playSound('success');
      const newCombo = combo + 1;
      setCombo(newCombo);
      const pointsEarned = 25 + newCombo * 5;
      setScore((prev) => prev + pointsEarned);
      addPoints(pointsEarned);

      setFeedback({
        isCorrect: true,
        text: `Harika Makinist! Vagon tam yerine kilitlendi. (${q.mixedDisplay})`
      });

      if (newCombo >= 3) {
        unlockBadge('metro-chief');
      }

      const activeStu = getStoredActiveBoardStudent();
      if (activeStu) {
        awardPointsToStudent(activeStu.id, pointsEarned);
        saveBoardParticipation({
          studentId: activeStu.id,
          studentName: activeStu.name,
          studentNumber: activeStu.studentNumber,
          classSection: activeStu.classSection,
          school: activeStu.school,
          teacherId: currentUser?.id,
          teacherName: currentUser?.name,
          activityType: 'game',
          activityTitle: 'Rasyonel Metro Hattı',
          outcomeCode: selectedOutcome?.code || 'MAT.7.1.1',
          score: 100,
          maxScore: 100,
          xpEarned: pointsEarned
        });
      }
    } else {
      playSound('click');
      setCombo(0);
      setFeedback({
        isCorrect: false,
        text: `Hatalı Makas! ${q.fractionDisplay} sayısı ${q.leftInt} ile ${q.rightInt} arasında olmalıdır. (${q.explanation})`
      });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setSelectedLeft(null);
    setSelectedFractionIndex(null);
    if (currentIndex + 1 < METRO_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsGameOver(true);
      playSound('success');
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedLeft(null);
    setSelectedFractionIndex(null);
    setCombo(0);
    setScore(0);
    setFeedback(null);
    setIsGameOver(false);
  };

  const STATIONS = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background Neon Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-500/30">
            <Train className="w-3.5 h-3.5" />
            <span>1. Oyun: Rasyonel Metro Hattı</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Durak Eşleme İstasyonu</span>
            {combo >= 3 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black flex items-center gap-1 animate-pulse">
                <Trophy className="w-3 h-3" />
                Baş Makinist
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Vagonun üzerindeki rasyonel sayıyı sayı doğrusundaki doğru iki istasyon arasına ve doğru aralık dilimine yerleştirin!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Puan</div>
            <div className="text-xl font-black text-amber-400">{score} XP</div>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Kombo</div>
            <div className="text-xl font-black text-blue-400">{combo}x</div>
          </div>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Active Wagon Display */}
          <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 p-6 rounded-2xl border-2 border-blue-500/40 text-center relative overflow-hidden shadow-lg">
            <div className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
              Gelen Metro Vagonu ({currentIndex + 1} / {METRO_QUESTIONS.length})
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-wider flex items-center justify-center gap-3 my-2">
              <Train className="w-8 h-8 text-blue-400 animate-bounce" />
              <span className="px-5 py-2 rounded-2xl bg-blue-600/30 border border-blue-400 text-amber-300 shadow-inner flex items-center justify-center">
                <MathFraction value={q.fractionDisplay} />
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Hedef: Sayı doğrusu raylarında bu vagonun durması gereken aralığı seçip aralığı dilimleyin!
            </div>
          </div>

          {/* Metro Track (Sayı Doğrusu Rayları) */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>1. Adım: Hangi iki ardışık istasyon arasına yanaşmalı? (Sol İstasyonu Seçin)</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {STATIONS.map((st) => {
                const isChosen = selectedLeft === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleSelectStation(st)}
                    className={`py-3 rounded-xl font-black text-sm transition-all border cursor-pointer ${
                      isChosen
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30 scale-105 ring-2 ring-blue-300'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                    }`}
                  >
                    {st} ile {st + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Station Interval Sub-division */}
          {selectedLeft !== null && (
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-blue-500/30 space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300">
                  2. Adım: [{selectedLeft}] ile [{selectedLeft + 1}] arasını {q.denominator} eşit parçaya böldük. Doğru dilimi tıklayın:
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedFractionIndex !== null ? `Dilim: ${selectedFractionIndex}. nokta seçildi` : 'Seçim bekleniyor'}
                </span>
              </div>

              {/* Graphical Visual Rail */}
              <div className="relative py-6 px-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                {/* Rail line */}
                <div className="absolute left-8 right-8 h-2 bg-slate-700 rounded-full" />
                <div className="absolute left-8 right-8 h-0.5 bg-blue-500/50" />

                {/* Left boundary marker */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-4 h-8 bg-amber-500 rounded-md border border-white shadow-sm" />
                  <span className="text-sm font-black text-amber-400 mt-1">{selectedLeft}</span>
                </div>

                {/* Sub-division slots */}
                <div className="flex-1 flex justify-evenly relative z-10 px-4">
                  {Array.from({ length: q.denominator - 1 }).map((_, idx) => {
                    const slotNum = idx + 1;
                    const isSelected = selectedFractionIndex === slotNum;
                    return (
                      <button
                        key={slotNum}
                        type="button"
                        onClick={() => handleSelectSlot(slotNum)}
                        className={`group flex flex-col items-center cursor-pointer transition-all ${
                          isSelected ? 'scale-125' : 'hover:scale-110'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 shadow-md ring-4 ring-amber-400/40'
                              : 'bg-slate-800 border-2 border-slate-600 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-300'
                          }`}
                        >
                          {slotNum}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 font-mono">
                          {slotNum}/{q.denominator}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Right boundary marker */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-4 h-8 bg-amber-500 rounded-md border border-white shadow-sm" />
                  <span className="text-sm font-black text-amber-400 mt-1">{selectedLeft + 1}</span>
                </div>
              </div>

              {/* Confirm Placement Button */}
              {!feedback && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    disabled={selectedFractionIndex === null}
                    onClick={handleCheckPlacement}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Vagonu Kilitle ve Kontrol Et</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Feedback & Next */}
          {feedback && (
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-bottom-2 ${
                feedback.isCorrect ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-sm">{feedback.text}</div>
                  <div className="text-xs opacity-80 mt-0.5">{q.explanation}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-black text-xs transition-all shrink-0 hover:bg-slate-200 shadow-md cursor-pointer active:scale-95"
              >
                <span>{currentIndex + 1 < METRO_QUESTIONS.length ? 'Sonraki Vagon ➔' : 'Sonucu Gör ➔'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Game Over Screen */
        <div className="text-center py-12 space-y-5 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-3xl bg-blue-500/20 border-2 border-blue-400 text-blue-300 flex items-center justify-center mx-auto shadow-xl">
            <Trophy className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-black text-white">Metro Seferi Tamamlandı!</h4>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Rasyonel sayı vagonlarını ardışık tam sayı istasyonlarına ve aralık bölmelerine başarıyla ulaştırdınız.
          </p>
          <div className="text-3xl font-black text-amber-400">{score} XP Kazanıldı</div>
          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-lg flex items-center gap-2 mx-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Oyna</span>
          </button>
        </div>
      )}
    </div>
  );
}

// =================================================================
// 2. OYUN: MUTLAK TERAZİ (ENERJİ DENGELEME ARCADE)
// =================================================================
interface ScaleRound {
  id: number;
  targetExpression: string;
  targetAbsoluteValue: number; // e.g. |-3 tam 1/4| = 3.25
  options: Array<{
    id: string;
    display: string;
    value: number;
    absMatches: boolean;
  }>;
  explanation: string;
}

const SCALE_ROUNDS: ScaleRound[] = [
  {
    id: 1,
    targetExpression: '|-3 tam 1/4|',
    targetAbsoluteValue: 3.25,
    options: [
      { id: 'o1', display: '+13/4', value: 3.25, absMatches: true },
      { id: 'o2', display: '-7/2', value: -3.5, absMatches: false },
      { id: 'o3', display: '+3', value: 3.0, absMatches: false },
      { id: 'o4', display: '-13/4', value: -3.25, absMatches: true },
      { id: 'o5', display: '+3 tam 1/2', value: 3.5, absMatches: false }
    ],
    explanation: '|-3 tam 1/4| = 13/4 = 3,25 birimdir. Mutlak değeri 3,25 olan sayılar hem +13/4 hem de -13/4\'tür.'
  },
  {
    id: 2,
    targetExpression: '|+5/2|',
    targetAbsoluteValue: 2.5,
    options: [
      { id: 'o21', display: '-5/2', value: -2.5, absMatches: true },
      { id: 'o22', display: '+2 tam 1/2', value: 2.5, absMatches: true },
      { id: 'o23', display: '-2', value: -2.0, absMatches: false },
      { id: 'o24', display: '+7/2', value: 3.5, absMatches: false },
      { id: 'o25', display: '-2,5', value: -2.5, absMatches: true }
    ],
    explanation: '|+5/2| = 2,5 birimdir. -5/2, +2 tam 1/2 ve -2,5 sayılarının üçünün de mutlak değeri 2,5\'tir.'
  },
  {
    id: 3,
    targetExpression: '|-7/3|',
    targetAbsoluteValue: 7 / 3,
    options: [
      { id: 'o31', display: '+7/3', value: 7 / 3, absMatches: true },
      { id: 'o32', display: '-2 tam 1/3', value: -7 / 3, absMatches: true },
      { id: 'o33', display: '+2', value: 2.0, absMatches: false },
      { id: 'o34', display: '-8/3', value: -8 / 3, absMatches: false },
      { id: 'o35', display: '+2 tam 2/3', value: 8 / 3, absMatches: false }
    ],
    explanation: '|-7/3| = 7/3 birimdir. +7/3 ve -2 tam 1/3 sayılarının mutlak değerleri sıfıra 7/3 birim eşit mesafededir.'
  }
];

export function AbsoluteBalanceGame() {
  const { playSound, addPoints, unlockBadge, selectedOutcome } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const round = SCALE_ROUNDS[roundIndex];

  const handleToggleOption = (id: string) => {
    if (feedback) return;
    playSound('click');
    setSelectedOptionIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleCheckBalance = () => {
    if (selectedOptionIds.length === 0 || feedback) return;

    const correctMatches = round.options.filter((o) => o.absMatches).map((o) => o.id);
    const isAllCorrect =
      selectedOptionIds.length === correctMatches.length &&
      correctMatches.every((id) => selectedOptionIds.includes(id));

    if (isAllCorrect) {
      playSound('success');
      setScore((prev) => prev + 40);
      addPoints(40);
      setFeedback({
        isCorrect: true,
        text: `Mükemmel Denge! Terazi tam yatay konuma kilitlendi. (${round.explanation})`
      });

      const activeStu = getStoredActiveBoardStudent();
      if (activeStu) {
        awardPointsToStudent(activeStu.id, 40);
        saveBoardParticipation({
          studentId: activeStu.id,
          studentName: activeStu.name,
          studentNumber: activeStu.studentNumber,
          classSection: activeStu.classSection,
          school: activeStu.school,
          teacherId: currentUser?.id,
          teacherName: currentUser?.name,
          activityType: 'game',
          activityTitle: 'Mutlak Terazi Arcade',
          outcomeCode: selectedOutcome?.code || 'MAT.7.1.1',
          score: 100,
          maxScore: 100,
          xpEarned: 40
        });
      }
    } else {
      playSound('click');
      setFeedback({
        isCorrect: false,
        text: `Denge Sağlanamadı! Sol kefedeki mutlak değere eşit olan TÜM rasyonel sayıları seçmelisiniz. (${round.explanation})`
      });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setSelectedOptionIds([]);
    if (roundIndex + 1 < SCALE_ROUNDS.length) {
      setRoundIndex((prev) => prev + 1);
    } else {
      setIsGameOver(true);
      playSound('success');
      unlockBadge('balance-master');
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    setRoundIndex(0);
    setSelectedOptionIds([]);
    setScore(0);
    setFeedback(null);
    setIsGameOver(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-500/30">
            <Scale className="w-3.5 h-3.5" />
            <span>2. Oyun: Mutlak Terazi</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Enerji Dengeleme Terazisi</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Sol kefedeki mutlak değere eşit olan TÜM rasyonel ağırlıkları sağ kefeye koyup teraziyi yatay dengeye getirin!
          </p>
        </div>

        <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-right">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Toplam Skor</div>
          <div className="text-xl font-black text-amber-400">{score} XP</div>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Animated Balance Scale Visual */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center relative overflow-hidden">
            {/* Center Pivot */}
            <div className="relative max-w-md mx-auto py-6">
              <div className="w-4 h-12 bg-amber-500 mx-auto rounded-t-lg shadow-lg border border-white/20" />
              <div className="w-16 h-3 bg-slate-700 mx-auto rounded-b-md" />
              <div className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-amber-300 bg-slate-900 px-2 py-0.5 rounded-full border border-amber-500/40">
                0 Noktası
              </div>

              {/* Lever Bar */}
              <div
                className={`absolute top-5 left-4 right-4 h-2 bg-gradient-to-r from-teal-500 via-amber-400 to-teal-500 rounded-full transition-transform duration-500 ${
                  feedback?.isCorrect ? 'rotate-0 shadow-lg shadow-teal-500/50' : feedback ? 'rotate-3' : '-rotate-6'
                }`}
              />

              {/* Left Pan */}
              <div className="absolute top-10 left-6 flex flex-col items-center">
                <div className="w-0.5 h-8 bg-slate-600" />
                <div className="w-24 py-2 bg-teal-900/80 border-2 border-teal-400 rounded-xl text-center shadow-lg">
                  <span className="text-[10px] text-teal-300 block font-bold">SOL KEFE</span>
                  <span className="text-base font-black text-white flex items-center justify-center"><MathFraction value={round.targetExpression} /></span>
                </div>
              </div>

              {/* Right Pan */}
              <div className="absolute top-10 right-6 flex flex-col items-center">
                <div className="w-0.5 h-8 bg-slate-600" />
                <div className="w-24 py-2 bg-indigo-900/80 border-2 border-indigo-400 rounded-xl text-center shadow-lg min-h-[50px] flex flex-col items-center justify-center">
                  <span className="text-[10px] text-indigo-300 block font-bold">SAĞ KEFE</span>
                  <span className="text-xs font-black text-amber-300">
                    {selectedOptionIds.length > 0 ? `${selectedOptionIds.length} Ağırlık` : 'Boş'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Options Belt (Sağ Taraftan Geçen Rasyonel Ağırlıklar) */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sağ taraftaki banttan geçen rasyonel sayıları seçin (Birden fazla olabilir):</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {round.options.map((opt) => {
                const isSelected = selectedOptionIds.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleToggleOption(opt.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-teal-600/40 border-teal-400 text-white shadow-lg ring-2 ring-teal-400/50 scale-105'
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    <span className="text-lg font-black text-amber-300 flex items-center justify-center"><MathFraction value={opt.display} /></span>
                    <span className="text-[10px] text-slate-400 mt-1 font-mono">
                      {isSelected ? '✓ Kefede' : '+ Kefeye Koy'}
                    </span>
                  </button>
                );
              })}
            </div>

            {!feedback && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={selectedOptionIds.length === 0}
                  onClick={handleCheckBalance}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Scale className="w-4 h-4" />
                  <span>Teraziyi Dengele</span>
                </button>
              </div>
            )}
          </div>

          {/* Feedback Display */}
          {feedback && (
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-bottom-2 ${
                feedback.isCorrect ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-sm">{feedback.text}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-black text-xs transition-all shrink-0 hover:bg-slate-200 shadow-md cursor-pointer active:scale-95"
              >
                <span>{roundIndex + 1 < SCALE_ROUNDS.length ? 'Sonraki Aşama ➔' : 'Sonucu Gör ➔'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 space-y-5 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-3xl bg-teal-500/20 border-2 border-teal-400 text-teal-300 flex items-center justify-center mx-auto shadow-xl">
            <Trophy className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-black text-white">Mutlak Terazi Dengelendi!</h4>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Zıt işaretli rasyonel sayıların başlangıç noktasına olan uzaklıklarının eşit olduğunu kanıtladınız.
          </p>
          <div className="text-3xl font-black text-amber-400">{score} XP Kazanıldı</div>
          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs transition-all shadow-lg flex items-center gap-2 mx-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Dengele</span>
          </button>
        </div>
      )}
    </div>
  );
}

// =================================================================
// 3. OYUN: SAYI DOĞRUSUNDA MAYIN TEMİZLEME (HASSAS KONUM)
// =================================================================
interface MineMission {
  id: number;
  targetFraction: string;
  targetValue: number;
  intervalStart: number;
  intervalEnd: number;
  requiredParts: number; // e.g. 4
  correctStepIndex: number; // 1-based index from left to right inside that interval
  hint: string;
  explanation: string;
}

const MINE_MISSIONS: MineMission[] = [
  {
    id: 1,
    targetFraction: '-5/4',
    targetValue: -1.25,
    intervalStart: -2,
    intervalEnd: -1,
    requiredParts: 4,
    correctStepIndex: 3, // -1'den sola 1 adım = -2'den sağa 3. adım
    hint: '-5/4 = -1 tam 1/4 eder. -1 ile -2 arası 4 parçaya bölünür, -1\'in solundaki ilk parça (-2\'den sağa 3. nokta).',
    explanation: '-5/4 sayısı -1 ile -2 tam sayıları arasındadır. 0\'dan sola doğru 5 adet çeyrek birim sayılır.'
  },
  {
    id: 2,
    targetFraction: '+7/3',
    targetValue: 7 / 3,
    intervalStart: 2,
    intervalEnd: 3,
    requiredParts: 3,
    correctStepIndex: 1, // 2'den sağa 1. adım
    hint: '+7/3 = +2 tam 1/3 eder. 2 ile 3 arası 3 eşit parçaya bölünür ve 2\'nin sağındaki 1. nokta seçilir.',
    explanation: '2 tam geçildikten sonra 1/3 daha sağa ilerlenir.'
  },
  {
    id: 3,
    targetFraction: '-7/2',
    targetValue: -3.5,
    intervalStart: -4,
    intervalEnd: -3,
    requiredParts: 2,
    correctStepIndex: 1, // -3 ile -4 ortası
    hint: '-7/2 = -3 tam 1/2 eder. -3 ile -4 arası 2 eşit parçaya bölünür ve tam orta nokta seçilir.',
    explanation: '-3 tam ile -4 tam arasındaki tam orta nokta -7/2 değeridir.'
  }
];

export function NumberLineMinesweeperGame() {
  const { playSound, addPoints, unlockBadge, selectedOutcome } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [missionIndex, setMissionIndex] = useState(0);
  const [chosenParts, setChosenParts] = useState<number>(2);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const mission = MINE_MISSIONS[missionIndex];

  const handleSelectPoint = (ptIndex: number) => {
    if (feedback) return;
    playSound('click');
    setSelectedPoint(ptIndex);
  };

  const handleDisarmMine = () => {
    if (selectedPoint === null || feedback) return;

    const isPartsCorrect = chosenParts === mission.requiredParts;
    const isPointCorrect = selectedPoint === mission.correctStepIndex;

    if (isPartsCorrect && isPointCorrect) {
      playSound('success');
      setScore((prev) => prev + 50);
      addPoints(50);
      setFeedback({
        isCorrect: true,
        text: `Hedef İmha Edildi! Mayın etkisiz hale geldi ve yeşil enerji çiçeği açtı! (${mission.explanation})`
      });

      const activeStu = getStoredActiveBoardStudent();
      if (activeStu) {
        awardPointsToStudent(activeStu.id, 50);
        saveBoardParticipation({
          studentId: activeStu.id,
          studentName: activeStu.name,
          studentNumber: activeStu.studentNumber,
          classSection: activeStu.classSection,
          school: activeStu.school,
          teacherId: currentUser?.id,
          teacherName: currentUser?.name,
          activityType: 'game',
          activityTitle: 'Sayı Doğrusunda Mayın Temizleme',
          outcomeCode: selectedOutcome?.code || 'MAT.7.1.1',
          score: 100,
          maxScore: 100,
          xpEarned: 50
        });
      }
    } else {
      playSound('click');
      setFeedback({
        isCorrect: false,
        text: `Uyarı Zili Çaldı! 1 birim sapma oldu. ${mission.hint}`
      });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setSelectedPoint(null);
    setChosenParts(2);
    if (missionIndex + 1 < MINE_MISSIONS.length) {
      setMissionIndex((prev) => prev + 1);
    } else {
      setIsGameOver(true);
      playSound('success');
      unlockBadge('minesweeper-hero');
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    setMissionIndex(0);
    setChosenParts(2);
    setSelectedPoint(null);
    setScore(0);
    setFeedback(null);
    setIsGameOver(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2 border border-rose-500/30">
            <Crosshair className="w-3.5 h-3.5" />
            <span>3. Oyun: Sayı Doğrusunda Mayın Temizleme</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Hassas Konum Bulmaca</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Gizli radar koordinatındaki mayını etkisiz kılmak için aralığı doğru parçaya bölün ve tam noktayı işaretleyin!
          </p>
        </div>

        <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-right">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Puan</div>
          <div className="text-xl font-black text-amber-400">{score} XP</div>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Mission Briefing */}
          <div className="bg-rose-950/40 p-5 rounded-2xl border-2 border-rose-500/30 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                Radar Görevi ({missionIndex + 1} / {MINE_MISSIONS.length})
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                Gizli Radar <span className="text-amber-400 inline-flex items-center px-1"><MathFraction value={mission.targetFraction} /></span> Noktasında!
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Sayı Doğrusundaki Sisli Bölge: [{mission.intervalStart}] ile [{mission.intervalEnd}] arası
              </div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-rose-600/30 border border-rose-400 flex items-center justify-center text-rose-300 shrink-0 animate-pulse">
              <Crosshair className="w-7 h-7" />
            </div>
          </div>

          {/* Bölüntü Aracı (Divide Tool) */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300">
              1. Adım: Bu iki tam sayı arasını kaç eşit parçaya bölmek istersiniz?
            </div>
            <div className="flex flex-wrap gap-2">
              {[2, 3, 4, 5, 6].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setChosenParts(p);
                    setSelectedPoint(null);
                  }}
                  className={`px-4 py-2 rounded-xl font-black text-xs transition-all border cursor-pointer ${
                    chosenParts === p
                      ? 'bg-rose-600 border-rose-400 text-white shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                >
                  {p} Eşit Parçaya Böl
                </button>
              ))}
            </div>
          </div>

          {/* Number Line Segment Area */}
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Sol Sınır: {mission.intervalStart}</span>
              <span className="text-amber-400 font-bold">2. Adım: Mayının olduğunu düşündüğünüz noktaya tıklayın</span>
              <span>Sağ Sınır: {mission.intervalEnd}</span>
            </div>

            {/* Visual Interactive Segment */}
            <div className="relative py-8 px-6 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
              {/* Segment Line */}
              <div className="absolute left-6 right-6 h-2 bg-slate-700 rounded-full" />
              <div className="absolute left-6 right-6 h-0.5 bg-rose-500/50" />

              {/* Left End */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-4 h-8 bg-slate-500 rounded-md border border-white" />
                <span className="text-sm font-black text-slate-300 mt-1">{mission.intervalStart}</span>
              </div>

              {/* Clickable Tick Marks */}
              <div className="flex-1 flex justify-evenly relative z-10 px-4">
                {Array.from({ length: chosenParts - 1 }).map((_, idx) => {
                  const ptNumber = idx + 1;
                  const isSelected = selectedPoint === ptNumber;
                  return (
                    <button
                      key={ptNumber}
                      type="button"
                      onClick={() => handleSelectPoint(ptNumber)}
                      className={`group flex flex-col items-center cursor-pointer transition-all ${
                        isSelected ? 'scale-125' : 'hover:scale-110'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                          isSelected
                            ? 'bg-rose-500 text-white shadow-lg ring-4 ring-rose-500/40 animate-pulse'
                            : 'bg-slate-800 border-2 border-slate-600 text-slate-400 group-hover:border-rose-400 group-hover:text-rose-300'
                        }`}
                      >
                        {ptNumber}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 font-mono">
                        {ptNumber}. nokta
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right End */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-4 h-8 bg-slate-500 rounded-md border border-white" />
                <span className="text-sm font-black text-slate-300 mt-1">{mission.intervalEnd}</span>
              </div>
            </div>

            {!feedback && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={selectedPoint === null}
                  onClick={handleDisarmMine}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>Mayını Etkisiz Hale Getir</span>
                </button>
              </div>
            )}
          </div>

          {/* Feedback Section */}
          {feedback && (
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-bottom-2 ${
                feedback.isCorrect ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-sm">{feedback.text}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-black text-xs transition-all shrink-0 hover:bg-slate-200 shadow-md cursor-pointer active:scale-95"
              >
                <span>{missionIndex + 1 < MINE_MISSIONS.length ? 'Sonraki Mayın ➔' : 'Görevi Bitir ➔'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 space-y-5 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border-2 border-rose-400 text-rose-300 flex items-center justify-center mx-auto shadow-xl">
            <Trophy className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-black text-white">Mayın Temizleme Başarılı!</h4>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Sayı doğrusundaki rasyonel konumları hassasiyetle belirleyerek parkı güvenli hale getirdiniz.
          </p>
          <div className="text-3xl font-black text-amber-400">{score} XP Kazanıldı</div>
          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all shadow-lg flex items-center gap-2 mx-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Tara</span>
          </button>
        </div>
      )}
    </div>
  );
}
