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
  ShieldCheck
} from 'lucide-react';

interface MultiplicationQuestion {
  num1: number;
  num2: number;
  correctAnswer: number;
  options: number[];
}

interface MultiplicationGameProps {
  onBackToHub?: () => void;
}

export function MultiplicationGame({ onBackToHub }: MultiplicationGameProps) {
  const { currentUser, awardPointsToStudent } = useAuth();
  const { studentPoints, addPoints, playSound, soundEnabled } = useApp();

  // Game Lifecycle: 'intro' | 'playing' | 'gameover'
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');

  // Game Engine State
  const [currentQuestion, setCurrentQuestion] = useState<MultiplicationQuestion | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [bonusTimePopup, setBonusTimePopup] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecking, setIsAnswerChecking] = useState<boolean>(false);
  const [lastEarnedXp, setLastEarnedXp] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const bonusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate a random question with 3 smart options
  const generateQuestion = useCallback((): MultiplicationQuestion => {
    // 1 to 10 inclusive
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 * num2;

    // Generate 2 distinct plausible distractors
    const distractors = new Set<number>();
    
    // Pool of plausible distractors
    const candidateDistractors = [
      correctAnswer + num1,
      correctAnswer - num1,
      correctAnswer + num2,
      correctAnswer - num2,
      correctAnswer + 10,
      correctAnswer - 10,
      correctAnswer + (Math.random() > 0.5 ? 2 : -2),
      correctAnswer + (Math.random() > 0.5 ? 4 : -4),
      (num1 + 1) * (num2 - 1),
      (num1 - 1) * (num2 + 1),
    ].filter((val) => val > 0 && val !== correctAnswer);

    // Shuffle candidates
    const shuffledCandidates = [...candidateDistractors].sort(() => Math.random() - 0.5);

    for (const cand of shuffledCandidates) {
      if (cand > 0 && cand !== correctAnswer && !distractors.has(cand)) {
        distractors.add(cand);
        if (distractors.size === 2) break;
      }
    }

    // Fallback if needed
    let fallbackOffset = 1;
    while (distractors.size < 2) {
      const fallbackVal = Math.max(1, correctAnswer + (distractors.size === 0 ? fallbackOffset : -fallbackOffset));
      if (fallbackVal !== correctAnswer && !distractors.has(fallbackVal)) {
        distractors.add(fallbackVal);
      }
      fallbackOffset++;
    }

    const options = [correctAnswer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

    return {
      num1,
      num2,
      correctAnswer,
      options,
    };
  }, []);

  // Start the Game
  const startGame = () => {
    playSound('click');
    setScore(0);
    setTimeLeft(20);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedOption(null);
    setIsAnswerChecking(false);
    setLastEarnedXp(0);

    const firstQ = generateQuestion();
    setCurrentQuestion(firstQ);
    setGameState('playing');
  };

  // Timer Tick (100ms precision)
  useEffect(() => {
    if (gameState !== 'playing') {
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
    if (gameState === 'playing' && timeLeft <= 0) {
      setGameState('gameover');
      playSound('bell');

      // Final Stats Calculation
      const totalQuestions = correctCount + wrongCount;
      const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      const xpEarned = Math.max(15, Math.round(score * 1.5) + (maxStreak * 5));
      setLastEarnedXp(xpEarned);

      // Add to global XP Store
      addPoints(xpEarned);

      // Record to Student Activity Database / LocalStorage Store
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
          activityTitle: 'Çarpım Tablosu Çarpışması',
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
        gameType: 'multiplication-rush',
        gameTitle: 'Çarpım Tablosu Çarpışması (Bağımsız Oyun)',
        score,
        maxScore: Math.max(score, totalQuestions * 15),
        xpEarned,
      });
    }
  }, [timeLeft, gameState, correctCount, wrongCount, score, maxStreak, currentUser, addPoints, playSound, awardPointsToStudent]);

  // Answer Evaluation
  const handleSelectOption = (optionValue: number) => {
    if (isAnswerChecking || gameState !== 'playing' || !currentQuestion) return;

    setSelectedOption(optionValue);
    setIsAnswerChecking(true);

    const isCorrect = optionValue === currentQuestion.correctAnswer;

    if (isCorrect) {
      playSound('success');
      
      // Calculate score with streak bonus
      const currentStreak = streak + 1;
      const streakBonus = Math.min(25, currentStreak * 2);
      const pointsToAdd = 10 + streakBonus;

      setScore((prev) => prev + pointsToAdd);
      setStreak(currentStreak);
      setMaxStreak((prev) => Math.max(prev, currentStreak));
      setCorrectCount((prev) => prev + 1);

      // Add +1 second to time!
      setTimeLeft((prev) => parseFloat((prev + 1.0).toFixed(1)));
      setBonusTimePopup(true);

      if (bonusTimeoutRef.current) clearTimeout(bonusTimeoutRef.current);
      bonusTimeoutRef.current = setTimeout(() => {
        setBonusTimePopup(false);
      }, 700);

      // Quick advance to next question
      setTimeout(() => {
        setSelectedOption(null);
        setIsAnswerChecking(false);
        setCurrentQuestion(generateQuestion());
      }, 180);

    } else {
      playSound('clear');
      setWrongCount((prev) => prev + 1);
      setStreak(0); // Reset combo

      // Give visual feedback and advance
      setTimeout(() => {
        setSelectedOption(null);
        setIsAnswerChecking(false);
        setCurrentQuestion(generateQuestion());
      }, 450);
    }
  };

  // Keyboard shortcut listener (1, 2, 3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || isAnswerChecking || !currentQuestion) return;
      if (e.key === '1' && currentQuestion.options[0] !== undefined) {
        handleSelectOption(currentQuestion.options[0]);
      } else if (e.key === '2' && currentQuestion.options[1] !== undefined) {
        handleSelectOption(currentQuestion.options[1]);
      } else if (e.key === '3' && currentQuestion.options[2] !== undefined) {
        handleSelectOption(currentQuestion.options[2]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isAnswerChecking, currentQuestion]);

  // Timer Progress Percentage (Relative to initial 20s or capped smoothly)
  const timerPercentage = Math.min(100, Math.max(0, (timeLeft / 20) * 100));

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
            <Gamepad2 className="w-4 h-4 text-teal-600" />
            <span>Maarif Oyun Salonu</span>
          </div>
        )}

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black shadow-xs">
          <Award className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>XP Puanın: {studentPoints}</span>
        </div>
      </div>

      {/* Teacher Smart Board Student Delegation Widget */}
      <BoardStudentWidget activityTitle="Çarpım Tablosu Çarpışması" />

      {/* ========================================================================= */}
      {/* VIEW 1: INTRO / START SCREEN */}
      {/* ========================================================================= */}
      {gameState === 'intro' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-indigo-950 p-6 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-400/20 border border-teal-300/30 text-teal-300 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <span>Bağımsız Hız & Zeka Oyunu</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  Çarpım Tablosu <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-amber-300">Çarpışması</span>
                </h1>
                
                <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                  1 ile 10 arasındaki sayıların çarpımını 20 saniye içinde en hızlı şekilde doğru cevapla! Her doğru cevap sürene <strong>+1 saniye</strong> ekler ve puanını katlar.
                </p>
              </div>

              <div className="relative shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-teal-400/30 rounded-full blur-xl animate-pulse" />
                <MascotCharacter pose="proud" size="xl" showBadge badgeText="Selim" />
              </div>
            </div>
          </div>

          {/* Rules & Guidelines */}
          <div className="p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Oyun Kuralları & Mekanikleri</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2 text-center sm:text-left">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-sm mx-auto sm:mx-0 shadow-xs">
                  ⏱️
                </div>
                <div className="font-black text-xs text-teal-950">20 Saniye Başlangıç</div>
                <div className="text-[11px] text-teal-800 leading-snug">
                  Geriye doğru sayan süre çubuğunu takip et, zaman dolmadan en çok soruyu çöz.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2 text-center sm:text-left">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm mx-auto sm:mx-0 shadow-xs">
                  ➕1s
                </div>
                <div className="font-black text-xs text-emerald-950">Doğru Cevaba +1 Saniye</div>
                <div className="text-[11px] text-emerald-800 leading-snug">
                  Her bildiğin soru için sürene 1 saniye eklenir ve kombo serisiyle puanın katlanır.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2 text-center sm:text-left">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm mx-auto sm:mx-0 shadow-xs">
                  🎯
                </div>
                <div className="font-black text-xs text-indigo-950">3 Seçenek & Hızlı Cevap</div>
                <div className="text-[11px] text-indigo-800 leading-snug">
                  Doğru çarpım sonucunu 3 şıktan seç veya klavyenden 1, 2, 3 tuşlarına basarak hız kazan.
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-2">
              <button
                onClick={startGame}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-500 hover:to-emerald-600 text-white font-black text-base shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer hover:scale-[1.01]"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Oyuna Başla (20 Saniye)</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: ACTIVE GAMEPLAY */}
      {/* ========================================================================= */}
      {gameState === 'playing' && currentQuestion && (
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

            {/* Countdown Timer with Floating +1s Bonus */}
            <div className="relative">
              <div
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border font-black transition-all ${
                  timeLeft <= 5
                    ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                    : timeLeft <= 10
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

              {/* Floating +1s Notification */}
              {bonusTimePopup && (
                <div className="absolute -top-6 right-2 text-xs font-black text-emerald-600 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full shadow-md animate-in slide-in-from-bottom-2 duration-200">
                  +1 sn! ⚡
                </div>
              )}
            </div>

          </div>

          {/* Dynamic Decreasing Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Süre İlerlemesi</span>
              <span className="tabular-nums font-black text-slate-700">%{Math.round(timerPercentage)}</span>
            </div>

            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-100 ${
                  timeLeft <= 5
                    ? 'bg-rose-500'
                    : timeLeft <= 10
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
          </div>

          {/* Question Stage Card */}
          <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white relative shadow-inner border border-slate-800">
            <div className="absolute top-4 left-4 text-xs font-bold text-teal-400/80 uppercase tracking-wider">
              Soru #{correctCount + wrongCount + 1}
            </div>

            {/* Formula Expression */}
            <div className="py-4">
              <div className="inline-flex items-center justify-center gap-4 sm:gap-6 text-4xl sm:text-6xl font-black tracking-wider text-white">
                <span className="text-teal-300">{currentQuestion.num1}</span>
                <span className="text-amber-400">×</span>
                <span className="text-teal-300">{currentQuestion.num2}</span>
                <span className="text-slate-400">=</span>
                <span className="text-amber-300 animate-pulse">?</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Aşağıdaki 3 seçenekten doğru olanı seçin (Klavye: 1, 2, 3)
            </div>
          </div>

          {/* 3 Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              
              let buttonStyle = 'bg-white hover:bg-teal-50/80 border-2 border-slate-200 hover:border-teal-400 text-slate-900 hover:scale-[1.02] shadow-sm';

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
                  disabled={isAnswerChecking}
                  onClick={() => handleSelectOption(option)}
                  className={`py-6 px-4 rounded-2xl text-2xl sm:text-3xl font-black transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer relative ${buttonStyle}`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute top-2 left-3">
                    [{idx + 1}]
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Oyun Tamamlandı! Süre Doldu</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Harika Bir Çarpım Performansı! 🎉
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                {score >= 150
                  ? 'Muazzam refleks ve işlem hızı! Matematiksel düşünme becerin zirvede.'
                  : score >= 70
                  ? 'Çok iyi bir sonuç! Çarpım tablosunda oldukça akıcısın.'
                  : 'İyi bir başlangıç! Pratik yaptıkça süren ve puanın çok daha yukarılara çıkacak.'}
              </p>
            </div>

            <div className="relative shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse" />
              <MascotCharacter
                pose={score >= 150 ? 'success' : score >= 70 ? 'proud' : 'pointing'}
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
              className="w-full sm:flex-1 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tekrar Oyna</span>
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
