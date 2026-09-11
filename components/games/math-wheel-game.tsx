'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import { recordStudentGameScore } from '@/lib/student-performance-store';
import { MascotCharacter } from '@/components/mascot';
import { BoardStudentWidget } from '@/components/board/board-student-widget';
import {
  getStoredActiveBoardStudent,
  clearActiveBoardStudent,
  saveBoardParticipation
} from '@/lib/board-participation-store';
import {
  Gamepad2,
  Clock,
  Zap,
  Trophy,
  Flame,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Star,
  Play,
  Volume2,
  VolumeX,
  TrendingUp,
  ShieldCheck,
  Disc3,
  Dices,
  Layers
} from 'lucide-react';

interface WheelSlice {
  id: string;
  label: string;
  type: 'add' | 'sub' | 'mul' | 'div' | 'bonus_2x' | 'bonus_time' | 'bonus_gold';
  icon: string;
  color: string;
  bgHex: string;
  multiplier: number;
  bonusSeconds: number;
}

const WHEEL_SLICES: WheelSlice[] = [
  { id: 'add', label: 'Toplama', type: 'add', icon: '➕', color: 'text-teal-900', bgHex: '#14b8a6', multiplier: 1, bonusSeconds: 1.5 },
  { id: 'bonus_2x', label: '2x Kombo', type: 'bonus_2x', icon: '⚡', color: 'text-purple-900', bgHex: '#a855f7', multiplier: 2, bonusSeconds: 2 },
  { id: 'sub', label: 'Çıkarma', type: 'sub', icon: '➖', color: 'text-indigo-900', bgHex: '#6366f1', multiplier: 1, bonusSeconds: 1.5 },
  { id: 'bonus_time', label: '+3 Saniye', type: 'bonus_time', icon: '⏳', color: 'text-cyan-900', bgHex: '#06b6d4', multiplier: 1, bonusSeconds: 3 },
  { id: 'mul', label: 'Çarpma', type: 'mul', icon: '✖️', color: 'text-rose-900', bgHex: '#f43f5e', multiplier: 1, bonusSeconds: 1.5 },
  { id: 'bonus_gold', label: 'Altın Soru (3x)', type: 'bonus_gold', icon: '🌟', color: 'text-amber-900', bgHex: '#f59e0b', multiplier: 3, bonusSeconds: 2 },
  { id: 'div', label: 'Bölme', type: 'div', icon: '➗', color: 'text-emerald-900', bgHex: '#10b981', multiplier: 1, bonusSeconds: 1.5 },
  { id: 'super_add', label: 'Süper İşlem', type: 'add', icon: '🚀', color: 'text-blue-900', bgHex: '#3b82f6', multiplier: 1.5, bonusSeconds: 2 },
];

interface WheelQuestion {
  num1: number;
  num2: number;
  operatorSymbol: string;
  operationName: string;
  correctAnswer: number;
  options: number[];
  slice: WheelSlice;
}

interface MathWheelGameProps {
  onBackToHub?: () => void;
}

export function MathWheelGame({ onBackToHub }: MathWheelGameProps) {
  const { currentUser, awardPointsToStudent } = useAuth();
  const { studentPoints, addPoints, playSound, soundEnabled } = useApp();

  // Lifecycle: 'intro' | 'spinning' | 'answering' | 'gameover'
  const [gameState, setGameState] = useState<'intro' | 'spinning' | 'answering' | 'gameover'>('intro');

  // Wheel Animation
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [selectedSlice, setSelectedSlice] = useState<WheelSlice>(WHEEL_SLICES[0]);

  // Game Engine State
  const [currentQuestion, setCurrentQuestion] = useState<WheelQuestion | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [bonusNotification, setBonusNotification] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecking, setIsAnswerChecking] = useState<boolean>(false);
  const [lastEarnedXp, setLastEarnedXp] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const bonusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate arithmetic problem based on slice
  const generateProblemForSlice = (slice: WheelSlice): WheelQuestion => {
    let num1 = 10;
    let num2 = 5;
    let operatorSymbol = '+';
    let operationName = 'Toplama';
    let correctAnswer = 15;

    const opType = slice.type === 'bonus_2x' || slice.type === 'bonus_gold' || slice.type === 'bonus_time'
      ? (['add', 'sub', 'mul', 'div'] as const)[Math.floor(Math.random() * 4)]
      : slice.type;

    if (opType === 'add') {
      num1 = Math.floor(Math.random() * 65) + 12;
      num2 = Math.floor(Math.random() * 45) + 8;
      operatorSymbol = '+';
      operationName = slice.label;
      correctAnswer = num1 + num2;
    } else if (opType === 'sub') {
      num1 = Math.floor(Math.random() * 70) + 25;
      num2 = Math.floor(Math.random() * (num1 - 10)) + 5;
      operatorSymbol = '−';
      operationName = slice.label;
      correctAnswer = num1 - num2;
    } else if (opType === 'mul') {
      num1 = Math.floor(Math.random() * 10) + 2;
      num2 = Math.floor(Math.random() * 9) + 2;
      operatorSymbol = '×';
      operationName = slice.label;
      correctAnswer = num1 * num2;
    } else { // div
      const divisor = Math.floor(Math.random() * 8) + 2;
      const quotient = Math.floor(Math.random() * 10) + 2;
      num1 = divisor * quotient;
      num2 = divisor;
      operatorSymbol = '÷';
      operationName = slice.label;
      correctAnswer = quotient;
    }

    // Generate 3 smart distractors
    const distractors = new Set<number>();
    const offsets = [1, -1, 2, -2, 5, -5, 10, -10, num2, -num2];

    for (const off of offsets.sort(() => Math.random() - 0.5)) {
      const candidate = correctAnswer + off;
      if (candidate > 0 && candidate !== correctAnswer) {
        distractors.add(candidate);
        if (distractors.size === 3) break;
      }
    }

    let fallback = 1;
    while (distractors.size < 3) {
      const candidate = Math.max(1, correctAnswer + fallback);
      if (candidate !== correctAnswer) distractors.add(candidate);
      fallback++;
    }

    const options = [correctAnswer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

    return {
      num1,
      num2,
      operatorSymbol,
      operationName,
      correctAnswer,
      options,
      slice,
    };
  };

  // Spin Wheel to Next Segment
  const spinToNextQuestion = useCallback(() => {
    setGameState('spinning');
    setSelectedOption(null);
    setIsAnswerChecking(false);

    // Pick a random slice index (0 to 7)
    const sliceIndex = Math.floor(Math.random() * WHEEL_SLICES.length);
    const targetSlice = WHEEL_SLICES[sliceIndex];
    setSelectedSlice(targetSlice);

    // Calculate rotation: slice angle is 360 / 8 = 45 deg
    // Pointer is at the top (270 deg or 0 deg).
    const sliceAngle = 360 / WHEEL_SLICES.length;
    const targetSliceAngle = 360 - (sliceIndex * sliceAngle + sliceAngle / 2);
    const extraSpins = (Math.floor(Math.random() * 2) + 2) * 360; // 2-3 full spins

    const newAngle = rotationAngle + extraSpins + (targetSliceAngle - (rotationAngle % 360));
    setRotationAngle(newAngle);

    playSound('click');

    // Wait for wheel to settle (0.8s swift spin)
    setTimeout(() => {
      const question = generateProblemForSlice(targetSlice);
      setCurrentQuestion(question);
      setGameState('answering');
      playSound('select');
    }, 850);
  }, [rotationAngle, playSound]);

  // Start the Game
  const startGame = () => {
    playSound('click');
    setScore(0);
    setTimeLeft(30);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedOption(null);
    setIsAnswerChecking(false);
    setLastEarnedXp(0);
    setBonusNotification(null);

    spinToNextQuestion();
  };

  // Timer Tick (100ms precision)
  useEffect(() => {
    if (gameState !== 'spinning' && gameState !== 'answering') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return Math.max(0, parseFloat((prev - 0.1).toFixed(1)));
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Handle Game Over
  useEffect(() => {
    if ((gameState === 'spinning' || gameState === 'answering') && timeLeft <= 0) {
      setGameState('gameover');
      playSound('bell');

      const totalQuestions = correctCount + wrongCount;
      const xpEarned = Math.max(20, Math.round(score * 1.6) + (maxStreak * 6));
      setLastEarnedXp(xpEarned);

      // Add to global XP Store
      addPoints(xpEarned);

      // Record to Student Activity Database / LocalStorage Store silently
      const studentId = currentUser?.id || 'stu-guest';
      const studentName = currentUser?.name || 'Misafir Öğrenci';
      const studentNumber = (currentUser as any)?.studentNumber || '104';
      const classSection = (currentUser as any)?.classSection || '5-A';

      const activeBoardStu = getStoredActiveBoardStudent();
      if (activeBoardStu) {
        const accuracyPct = totalQuestions > 0 ? Math.min(100, Math.max(0, Math.round((correctCount / totalQuestions) * 100))) : 100;
        awardPointsToStudent(activeBoardStu.id, xpEarned);
        saveBoardParticipation({
          studentId: activeBoardStu.id,
          studentName: activeBoardStu.name,
          studentNumber: activeBoardStu.studentNumber,
          classSection: activeBoardStu.classSection,
          school: activeBoardStu.school,
          teacherId: currentUser?.id,
          teacherName: currentUser?.name,
          activityType: 'game',
          activityTitle: 'Matematik Çarkı & Hızlı İşlem',
          outcomeCode: 'MAT.5.1.1',
          score: accuracyPct,
          maxScore: 100,
          xpEarned
        });
        clearActiveBoardStudent();
      }

      recordStudentGameScore({
        studentId,
        studentName,
        studentNumber,
        classSection,
        outcomeCode: 'MAT.5.1.1',
        outcomeTitle: 'Doğal Sayılarla İşlemler ve Çarpım Tablosu',
        gameType: 'math-wheel',
        gameTitle: 'Matematik Çarkı & Hızlı İşlem',
        score,
        maxScore: Math.max(score, totalQuestions * 20),
        xpEarned,
      });
    }
  }, [timeLeft, gameState, correctCount, wrongCount, score, maxStreak, currentUser, addPoints, playSound, awardPointsToStudent]);

  // Option Selection
  const handleSelectOption = (optionValue: number) => {
    if (isAnswerChecking || gameState !== 'answering' || !currentQuestion) return;

    setSelectedOption(optionValue);
    setIsAnswerChecking(true);

    const isCorrect = optionValue === currentQuestion.correctAnswer;

    if (isCorrect) {
      playSound('success');

      // Score Calculation with Slice Multiplier + Streak Bonus
      const currentStreak = streak + 1;
      const sliceMultiplier = currentQuestion.slice.multiplier || 1;
      const streakBonus = Math.min(30, currentStreak * 3);
      const pointsToAdd = Math.round((15 + streakBonus) * sliceMultiplier);

      setScore((prev) => prev + pointsToAdd);
      setStreak(currentStreak);
      setMaxStreak((prev) => Math.max(prev, currentStreak));
      setCorrectCount((prev) => prev + 1);

      // Time Bonus from Slice
      const timeBonus = currentQuestion.slice.bonusSeconds || 1.5;
      setTimeLeft((prev) => parseFloat((prev + timeBonus).toFixed(1)));

      // Show floating notification
      setBonusNotification(`+${timeBonus}s ⏱️ ${sliceMultiplier > 1 ? `(${sliceMultiplier}x Puan)` : ''}`);
      if (bonusTimeoutRef.current) clearTimeout(bonusTimeoutRef.current);
      bonusTimeoutRef.current = setTimeout(() => {
        setBonusNotification(null);
      }, 800);

      // Quick advance to spin next question
      setTimeout(() => {
        spinToNextQuestion();
      }, 250);

    } else {
      playSound('clear');
      setWrongCount((prev) => prev + 1);
      setStreak(0); // Reset combo

      // Give visual feedback and advance
      setTimeout(() => {
        spinToNextQuestion();
      }, 450);
    }
  };

  // Keyboard shortcut listener (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'answering' || isAnswerChecking || !currentQuestion) return;
      if (e.key === '1' && currentQuestion.options[0] !== undefined) {
        handleSelectOption(currentQuestion.options[0]);
      } else if (e.key === '2' && currentQuestion.options[1] !== undefined) {
        handleSelectOption(currentQuestion.options[1]);
      } else if (e.key === '3' && currentQuestion.options[2] !== undefined) {
        handleSelectOption(currentQuestion.options[2]);
      } else if (e.key === '4' && currentQuestion.options[3] !== undefined) {
        handleSelectOption(currentQuestion.options[3]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isAnswerChecking, currentQuestion]);

  const timerPercentage = Math.min(100, Math.max(0, (timeLeft / 30) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Top Bar / Breadcrumb */}
      <div className="flex items-center justify-between gap-4">
        {onBackToHub ? (
          <button
            onClick={() => {
              playSound('click');
              onBackToHub();
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-all hover:border-slate-300 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Oyun Salonuna Dön</span>
          </button>
        ) : (
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-amber-600" />
            <span>Maarif Zeka Laboratuvarı</span>
          </div>
        )}

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black shadow-xs">
          <Award className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>XP Puanın: {studentPoints}</span>
        </div>
      </div>

      {/* Teacher Smart Board Student Delegation Widget */}
      <BoardStudentWidget activityTitle="Matematik Çarkı & Hızlı İşlem" />

      {/* ========================================================================= */}
      {/* VIEW 1: INTRO / START SCREEN */}
      {/* ========================================================================= */}
      {gameState === 'intro' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden">
          
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-rose-950 p-6 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Dört İşlem & Hız Çarkı</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  Matematik Çarkı & <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300">
                    Hızlı Dört İşlem
                  </span>
                </h1>
                
                <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                  Çarkı çevir, gelen işlem ve sürpriz çarpanlarla süren bitmeden en doğru cevabı bul! Her doğru cevap sürene ekstra zaman kazandırır ve kombo serini katlar.
                </p>
              </div>

              <div className="relative shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl animate-pulse" />
                <MascotCharacter pose="proud" size="xl" showBadge badgeText="Selim" />
              </div>
            </div>
          </div>

          {/* Gameplay Rules */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-center sm:text-left">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm mx-auto sm:mx-0 shadow-xs">
                  🎡
                </div>
                <div className="font-black text-xs text-amber-950">Dönen İşlem Çarkı</div>
                <div className="text-[11px] text-amber-800 leading-snug">
                  Toplama, Çıkarma, Çarpma, Bölme ve 2x/3x altın çarpan dilimleri.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2 text-center sm:text-left">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-sm mx-auto sm:mx-0 shadow-xs">
                  ⚡
                </div>
                <div className="font-black text-xs text-teal-950">Doğru Cevaba Ek Süre</div>
                <div className="text-[11px] text-teal-800 leading-snug">
                  Her doğru cevapta +1.5 ile +3 saniye kazanarak oyunda daha uzun süre kal.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2 text-center sm:text-left">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm mx-auto sm:mx-0 shadow-xs">
                  ⌨️
                </div>
                <div className="font-black text-xs text-indigo-950">4 Seçenek & Tuşlar</div>
                <div className="text-[11px] text-indigo-800 leading-snug">
                  Doğru şıkka tıkla veya klavyeden 1, 2, 3, 4 tuşlarına basarak reflekslerini konuştur.
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-2">
              <button
                onClick={startGame}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer hover:scale-[1.01]"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>Çarkı Çevir & Başla (30 Saniye)</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: ACTIVE GAMEPLAY (WHEEL + QUESTION) */}
      {/* ========================================================================= */}
      {(gameState === 'spinning' || gameState === 'answering') && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          
          {/* Header Stats Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            
            {/* Score */}
            <div className="flex items-center gap-2.5 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-sm">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div className="text-[9px] text-slate-400 font-bold uppercase">Puan</div>
                <div className="text-base sm:text-lg font-black leading-none text-amber-300">
                  {score}
                </div>
              </div>
            </div>

            {/* Streak / Combo */}
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-2xl">
              <Flame className={`w-4 h-4 ${streak > 0 ? 'text-rose-500 fill-rose-400 animate-bounce' : 'text-slate-400'}`} />
              <div>
                <span className="text-xs font-black text-rose-950">
                  {streak > 1 ? `${streak}x Kombo!` : 'Seri: 0'}
                </span>
              </div>
            </div>

            {/* Timer */}
            <div className="relative">
              <div
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border font-black transition-all ${
                  timeLeft <= 6
                    ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                    : timeLeft <= 12
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-teal-50 text-teal-950 border-teal-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-[9px] opacity-80 font-bold uppercase">Kalan Süre</div>
                  <div className="text-base sm:text-lg leading-none font-black tabular-nums">
                    {timeLeft.toFixed(1)} sn
                  </div>
                </div>
              </div>

              {/* Bonus Notification */}
              {bonusNotification && (
                <div className="absolute -top-6 right-0 text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-md animate-in slide-in-from-bottom-2 duration-200 shrink-0 whitespace-nowrap">
                  {bonusNotification}
                </div>
              )}
            </div>

          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Süre İlerlemesi</span>
              <span className="tabular-nums font-black text-slate-700">%{Math.round(timerPercentage)}</span>
            </div>

            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-100 ${
                  timeLeft <= 6
                    ? 'bg-rose-500'
                    : timeLeft <= 12
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
          </div>

          {/* Wheel & Question Display Area */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left: Interactive Spinning Wheel (4 Cols) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-3xl relative">
              <div className="text-[11px] font-black uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                <Disc3 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span>İşlem Çarkı</span>
              </div>

              {/* Pointer Arrow */}
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-rose-600 z-20 mb-[-6px] shadow-sm animate-bounce" />

              {/* The Spinning Wheel Canvas / SVG */}
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-xl border-4 border-slate-800 bg-slate-900">
                <div
                  className="w-full h-full rounded-full transition-transform ease-out duration-700 relative"
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                  }}
                >
                  {/* SVG Slices */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {WHEEL_SLICES.map((slice, i) => {
                      const angle = 360 / WHEEL_SLICES.length;
                      const startAngle = i * angle;
                      const endAngle = (i + 1) * angle;

                      const startRad = ((startAngle - 90) * Math.PI) / 180;
                      const endRad = ((endAngle - 90) * Math.PI) / 180;

                      const x1 = 50 + 50 * Math.cos(startRad);
                      const y1 = 50 + 50 * Math.sin(startRad);
                      const x2 = 50 + 50 * Math.cos(endRad);
                      const y2 = 50 + 50 * Math.sin(endRad);

                      const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                      return (
                        <path
                          key={slice.id}
                          d={pathData}
                          fill={slice.bgHex}
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                      );
                    })}
                  </svg>

                  {/* Slice Text Labels overlaid */}
                  {WHEEL_SLICES.map((slice, i) => {
                    const angle = 360 / WHEEL_SLICES.length;
                    const midAngle = i * angle + angle / 2;
                    return (
                      <div
                        key={`label-${slice.id}`}
                        className="absolute inset-0 flex items-start justify-center pt-2 pointer-events-none"
                        style={{
                          transform: `rotate(${midAngle}deg)`,
                        }}
                      >
                        <span className="text-xs font-black text-white drop-shadow-md">
                          {slice.icon}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Center Hub of the Wheel */}
                <div className="absolute inset-0 m-auto w-12 h-12 bg-white rounded-full border-4 border-slate-900 shadow-md flex items-center justify-center font-black text-slate-900 text-xs">
                  ⚡
                </div>
              </div>

              {/* Selected Slice Pill */}
              <div className="mt-3 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-extrabold text-slate-800 shadow-xs flex items-center gap-1.5">
                <span>{selectedSlice.icon}</span>
                <span>{selectedSlice.label}</span>
              </div>
            </div>

            {/* Right: Question Box & Action (8 Cols) */}
            <div className="md:col-span-8 space-y-4">
              {currentQuestion ? (
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-center text-white relative shadow-inner border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400/90 uppercase tracking-wider">
                    <span>Soru #{correctCount + wrongCount + 1}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300">
                      {currentQuestion.slice.label}
                    </span>
                  </div>

                  {/* Math Formula */}
                  <div className="py-2">
                    <div className="inline-flex items-center justify-center gap-3 sm:gap-5 text-3xl sm:text-5xl font-black tracking-wider text-white">
                      <span className="text-amber-300">{currentQuestion.num1}</span>
                      <span className="text-rose-400 font-extrabold">{currentQuestion.operatorSymbol}</span>
                      <span className="text-amber-300">{currentQuestion.num2}</span>
                      <span className="text-slate-400">=</span>
                      <span className="text-teal-300 animate-pulse">?</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 font-medium">
                    Doğru sonucu seçin (Klavye: 1, 2, 3, 4)
                  </div>
                </div>
              ) : (
                <div className="h-44 flex items-center justify-center bg-slate-900 rounded-3xl text-white">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-300 animate-pulse">
                    <Disc3 className="w-5 h-5 animate-spin" />
                    <span>Çark Dönüyor...</span>
                  </div>
                </div>
              )}

              {/* 4 Options Grid */}
              {currentQuestion && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === currentQuestion.correctAnswer;

                    let buttonStyle = 'bg-white hover:bg-amber-50/80 border-2 border-slate-200 hover:border-amber-400 text-slate-900 hover:scale-[1.02] shadow-sm';

                    if (isAnswerChecking) {
                      if (isCorrect) {
                        buttonStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-lg shadow-emerald-500/30 scale-105';
                      } else if (isSelected && !isCorrect) {
                        buttonStyle = 'bg-rose-500 text-white border-2 border-rose-600 shadow-lg shadow-rose-500/30 animate-shake';
                      } else {
                        buttonStyle = 'bg-slate-100 text-slate-400 border-2 border-slate-200 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={`${option}-${idx}`}
                        disabled={isAnswerChecking || gameState !== 'answering'}
                        onClick={() => handleSelectOption(option)}
                        className={`py-5 px-3 rounded-2xl text-xl sm:text-2xl font-black transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 cursor-pointer relative ${buttonStyle}`}
                      >
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 absolute top-2 left-2.5">
                          [{idx + 1}]
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: GAME OVER & SUMMARY */}
      {/* ========================================================================= */}
      {gameState === 'gameover' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-6 sm:p-10 space-y-8 animate-in zoom-in-95 duration-300">
          
          {/* Header & Mascot Reaction */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Oyun Tamamlandı! Süre Doldu</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Muhteşem Çark Performansı! 🎡
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                {score >= 200
                  ? 'Harika refleks ve zihinden işlem hızı! Çarkın efendisi unvanını hak ettin.'
                  : score >= 90
                  ? 'Çok başarılı! Hızlı düşünme ve işlem kabiliyetin gayet iyi.'
                  : 'İyi bir deneme! Çarkı tekrar çevirerek daha yüksek skorlara ulaşabilirsin.'}
              </p>
            </div>

            <div className="relative shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse" />
              <MascotCharacter
                pose={score >= 200 ? 'success' : score >= 90 ? 'proud' : 'pointing'}
                size="xl"
                showBadge
                badgeText="Selim"
              />
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
              <div className="text-[11px] font-bold text-amber-700 uppercase">Toplam Skor</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-950">{score}</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <div className="text-[11px] font-bold text-emerald-700 uppercase">Doğru Cevap</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-950">{correctCount}</div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-1">
              <div className="text-[11px] font-bold text-rose-700 uppercase">Yanlış Cevap</div>
              <div className="text-2xl sm:text-3xl font-black text-rose-950">{wrongCount}</div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center space-y-1">
              <div className="text-[11px] font-bold text-indigo-700 uppercase">En Uzun Seri</div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-950">{maxStreak}x</div>
            </div>

          </div>

          {/* XP Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-teal-50 border border-amber-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                ⭐
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-slate-900">
                  +{lastEarnedXp} XP Kazandın!
                </div>
                <div className="text-xs text-slate-600">
                  Tebrikler, puanın hesabına eklendi.
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={startGame}
              className="w-full sm:flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tekrar Çevir & Oyna</span>
            </button>

            {onBackToHub && (
              <button
                onClick={() => {
                  playSound('click');
                  onBackToHub();
                }}
                className="w-full sm:flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs sm:text-sm border border-slate-200 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Oyun Salonuna Dön</span>
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
