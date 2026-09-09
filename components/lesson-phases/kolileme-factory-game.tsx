'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Package,
  Sparkles,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Heart,
  Zap,
  ArrowRight,
  ShieldCheck,
  Award,
  Play
} from 'lucide-react';

interface BoxLevel {
  id: number;
  targetNumber: number | string;
  productName: string;
  unitText: string;
  allFactors: number[];
  distractors: number[];
  timeLimit: number;
}

const LEVELS_MAT611: BoxLevel[] = [
  {
    id: 1,
    targetNumber: 24,
    productName: 'Kardeşlik Zeytinyağı Kolisi',
    unitText: '24 Kutu Zeytinyağı',
    allFactors: [1, 2, 3, 4, 6, 8, 12, 24],
    distractors: [5, 7, 9, 10, 14, 16],
    timeLimit: 45
  },
  {
    id: 2,
    targetNumber: 36,
    productName: 'İyilik Mercimek Paketi',
    unitText: '36 Paket Mercimek',
    allFactors: [1, 2, 3, 4, 6, 9, 12, 18, 36],
    distractors: [5, 7, 8, 10, 14, 15, 16],
    timeLimit: 45
  },
  {
    id: 3,
    targetNumber: 30,
    productName: 'Dayanışma Erzak Sandığı',
    unitText: '30 Paket Kuru Gıda',
    allFactors: [1, 2, 3, 5, 6, 10, 15, 30],
    distractors: [4, 7, 8, 9, 12, 20],
    timeLimit: 40
  },
  {
    id: 4,
    targetNumber: 48,
    productName: 'Öğrenci Evi Destek Kolisi',
    unitText: '48 Adet Temel İhtiyaç',
    allFactors: [1, 2, 3, 4, 6, 8, 12, 16, 24, 48],
    distractors: [5, 7, 9, 10, 14, 18, 20],
    timeLimit: 40
  }
];

const LEVELS_MAT612: BoxLevel[] = [
  {
    id: 1,
    targetNumber: 48750,
    productName: 'Lazer Tasnif Sandığı 1',
    unitText: '48.750 Sayısını Kalansız Bölen Kriterler',
    allFactors: [2, 3, 5, 6, 10],
    distractors: [4, 9],
    timeLimit: 45
  },
  {
    id: 2,
    targetNumber: 7324,
    productName: 'Lazer Tasnif Sandığı 2',
    unitText: '7.324 Sayısını Kalansız Bölen Kriterler',
    allFactors: [2, 4],
    distractors: [3, 5, 6, 9, 10],
    timeLimit: 40
  },
  {
    id: 3,
    targetNumber: 9468,
    productName: 'Lazer Tasnif Sandığı 3',
    unitText: '9.468 Sayısını Kalansız Bölen Kriterler',
    allFactors: [2, 3, 4, 6, 9],
    distractors: [5, 10],
    timeLimit: 40
  },
  {
    id: 4,
    targetNumber: 1235,
    productName: 'Lazer Tasnif Sandığı 4',
    unitText: '1.235 Sayısını Kalansız Bölen Kriterler',
    allFactors: [5],
    distractors: [2, 3, 4, 6, 9, 10],
    timeLimit: 35
  }
];

const LEVELS_MAT613: BoxLevel[] = [
  {
    id: 1,
    targetNumber: 60,
    productName: 'Asal Çarpan Sandığı 1 (60)',
    unitText: '60 Sayısının ASAL Çarpanlarını Seç (Bileşikler Tuzaktır!)',
    allFactors: [2, 3, 5],
    distractors: [4, 6, 10, 12, 15, 20, 30],
    timeLimit: 45
  },
  {
    id: 2,
    targetNumber: 84,
    productName: 'Asal Çarpan Sandığı 2 (84)',
    unitText: '84 Sayısının ASAL Çarpanlarını Seç',
    allFactors: [2, 3, 7],
    distractors: [4, 6, 12, 14, 21, 28, 42],
    timeLimit: 45
  },
  {
    id: 3,
    targetNumber: 72,
    productName: 'Asal Çarpan Sandığı 3 (72)',
    unitText: '72 Sayısının ASAL Çarpanlarını Seç (72 = 2³ · 3²)',
    allFactors: [2, 3],
    distractors: [4, 6, 8, 9, 12, 18, 24, 36],
    timeLimit: 40
  },
  {
    id: 4,
    targetNumber: 120,
    productName: 'Asal Çarpan Sandığı 4 (120)',
    unitText: '120 Sayısının ASAL Çarpanlarını Seç',
    allFactors: [2, 3, 5],
    distractors: [4, 6, 8, 10, 12, 15, 20, 24, 30],
    timeLimit: 40
  }
];

const LEVELS_MAT614: BoxLevel[] = [
  {
    id: 1,
    targetNumber: '24 & 36',
    productName: 'Ortak Bidon Sandığı 1',
    unitText: '24L ve 36L Sıvıların ORTAK Bölenlerini Seç',
    allFactors: [1, 2, 3, 4, 6, 12],
    distractors: [8, 9, 18, 24, 36],
    timeLimit: 45
  },
  {
    id: 2,
    targetNumber: '18 & 30',
    productName: 'Ortak Bidon Sandığı 2',
    unitText: '18 ve 30 Sayılarının ORTAK Bölenlerini Seç',
    allFactors: [1, 2, 3, 6],
    distractors: [4, 5, 9, 10, 15, 18],
    timeLimit: 40
  },
  {
    id: 3,
    targetNumber: '40 & 60',
    productName: 'Ortak Ağaçlandırma Sandığı 3',
    unitText: '40m ve 60m Ortak Aralıklarını Seç',
    allFactors: [1, 2, 4, 5, 10, 20],
    distractors: [3, 6, 8, 12, 15, 30],
    timeLimit: 40
  },
  {
    id: 4,
    targetNumber: '8 & 15',
    productName: 'Aralarında Asallık Sandığı 4',
    unitText: '8 ve 15 (Aralarında Asal) ORTAK Bölenini Seç',
    allFactors: [1],
    distractors: [2, 3, 4, 5, 8, 15],
    timeLimit: 35
  }
];

interface KolilemeFactoryGameProps {
  onBackToMenu?: () => void;
}

export function KolilemeFactoryGame({ onBackToMenu }: KolilemeFactoryGameProps = {}) {
  const { playSound, addPoints, unlockBadge, selectedOutcome } = useApp();

  const isDivisibility = selectedOutcome?.id === 'MAT.6.1.2' || selectedOutcome?.code?.includes('6.1.2');
  const isPrimeFactors = selectedOutcome?.id === 'MAT.6.1.3' || selectedOutcome?.code?.includes('6.1.3');
  const isCommon = selectedOutcome?.id === 'MAT.6.1.4' || selectedOutcome?.code?.includes('6.1.4');

  const LEVELS = isDivisibility
    ? LEVELS_MAT612
    : isPrimeFactors
    ? LEVELS_MAT613
    : isCommon
    ? LEVELS_MAT614
    : LEVELS_MAT611;

  const [levelIndex, setLevelIndex] = useState(0);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'level_won' | 'game_over' | 'completed'>('ready');
  const [selectedFactors, setSelectedFactors] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<number[]>([]);

  const currentLevel = LEVELS[levelIndex] || LEVELS[0];

  // Initialize Level
  useEffect(() => {
    if (gameState === 'playing') {
      const options = [...currentLevel.allFactors, ...currentLevel.distractors].sort(() => Math.random() - 0.5);
      setShuffledOptions(options);
      setSelectedFactors([]);
      setTimeLeft(currentLevel.timeLimit);
    }
  }, [levelIndex, gameState]);

  // Timer Tick
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleStartGame = () => {
    playSound('select');
    setLevelIndex(0);
    setScore(0);
    setLives(3);
    setCombo(0);
    setGameState('playing');
  };

  const handleTimeUp = () => {
    playSound('click');
    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setGameState('game_over');
        playSound('bell');
      } else {
        // Retry current level
        setSelectedFactors([]);
        setTimeLeft(currentLevel.timeLimit);
      }
      return next;
    });
  };

  const handleSelectOption = (num: number) => {
    if (selectedFactors.includes(num) || gameState !== 'playing') return;

    const isCorrect = currentLevel.allFactors.includes(num);

    if (isCorrect) {
      playSound('success');
      const nextSelected = [...selectedFactors, num];
      setSelectedFactors(nextSelected);
      const pointsEarned = 10 + combo * 5;
      setScore((prev) => prev + pointsEarned);
      setCombo((prev) => prev + 1);

      // Check if all factors are collected
      if (nextSelected.length === currentLevel.allFactors.length) {
        handleLevelComplete();
      }
    } else {
      playSound('click');
      setCombo(0);
      setLives((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setGameState('game_over');
          playSound('bell');
        }
        return next;
      });
    }
  };

  const handleLevelComplete = () => {
    playSound('bell');
    addPoints(50);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    if (levelIndex < LEVELS.length - 1) {
      setGameState('level_won');
    } else {
      setGameState('completed');
      unlockBadge('maarif-genius');
      addPoints(100);
    }
  };

  const handleNextLevel = () => {
    playSound('select');
    setLevelIndex((prev) => prev + 1);
    setGameState('playing');
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500/50 shadow-2xl space-y-6 select-none relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
              1. Dijital Oyun • Çarpan Eşleme Arcade
            </span>
            <span className="text-xs text-slate-400 font-bold">
              Seviye {levelIndex + 1} / {LEVELS.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-2">
            <Package className="w-6 h-6" />
            <span>KOLİLEME FABRİKASI</span>
          </h2>
        </div>

        {/* HUD: Score, Lives, Timer */}
        <div className="flex items-center gap-3">
          {/* Score */}
          <div className="bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div className="text-right">
              <div className="text-[9px] text-slate-400 font-bold uppercase">Puan</div>
              <div className="text-sm font-black font-mono text-amber-300">{score}</div>
            </div>
          </div>

          {/* Lives */}
          <div className="bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700 flex items-center gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
              />
            ))}
          </div>

          {/* Timer */}
          <div className={`px-3.5 py-2 rounded-2xl border flex items-center gap-2 ${
            timeLeft <= 10 ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse' : 'bg-slate-800/80 border-slate-700 text-slate-200'
          }`}>
            <Clock className="w-4 h-4" />
            <div className="text-sm font-black font-mono">{timeLeft}s</div>
          </div>
        </div>
      </div>

      {/* GAME VIEWPORT */}
      {gameState === 'ready' && (
        <div className="py-12 text-center space-y-6 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-amber-500/20">
            📦
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">İyilik Kolilerini Paketleme Zamanı!</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Banttan gelen yardım kasalarını taşımak için hedef sayının <strong>tüm pozitif çarpanlarını (bölenlerini)</strong> eksiksiz seçip eşleştiriniz. Yanlış çarpan seçerseniz koli banttan düşer!
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartGame}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>Fabrikayı Başlat</span>
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-6">
          {/* Conveyor Belt & Active Box */}
          <div className="bg-slate-950 rounded-2xl p-6 border-2 border-slate-800 shadow-inner relative overflow-hidden flex flex-col items-center">
            {/* Belt animation lines */}
            <div className="w-full h-2 bg-gradient-to-r from-slate-700 via-amber-500/40 to-slate-700 rounded-full mb-6 animate-pulse" />

            {/* Target Crate */}
            <div className="bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 border-4 border-amber-400 rounded-3xl p-6 text-center max-w-sm w-full shadow-2xl space-y-2 transform hover:scale-102 transition-transform">
              <span className="px-3 py-1 rounded-full bg-black/40 text-amber-200 font-extrabold text-[10px] uppercase tracking-wider border border-amber-400/30">
                {currentLevel.productName}
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight drop-shadow-md">
                {currentLevel.targetNumber}
              </div>
              <div className="text-xs font-bold text-amber-100/90">
                {currentLevel.unitText}
              </div>
            </div>

            {/* Collected Factors Counter */}
            <div className="mt-4 flex items-center gap-2 flex-wrap justify-center">
              <span className="text-xs font-bold text-slate-400">Bulunan Çarpanlar ({selectedFactors.length} / {currentLevel.allFactors.length}):</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {currentLevel.allFactors.map((fac) => {
                  const isFound = selectedFactors.includes(fac);
                  return (
                    <span
                      key={fac}
                      className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center border transition-all ${
                        isFound
                          ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm scale-105'
                          : 'bg-slate-800/80 text-slate-500 border-slate-700'
                      }`}
                    >
                      {isFound ? fac : '?'}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Multiplier Wagon Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
              <span>Aşağıdaki vagonlardan {currentLevel.targetNumber}'ün çarpanlarını seçiniz:</span>
              {combo > 1 && (
                <span className="text-amber-400 font-black flex items-center gap-1 animate-bounce">
                  <Zap className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{combo}x Kombo!</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2.5">
              {shuffledOptions.map((num) => {
                const isSelected = selectedFactors.includes(num);

                return (
                  <button
                    key={num}
                    type="button"
                    disabled={isSelected}
                    onClick={() => handleSelectOption(num)}
                    className={`h-14 rounded-2xl font-black text-base transition-all flex flex-col items-center justify-center border-2 cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 opacity-60 cursor-not-allowed shadow-none'
                        : 'bg-slate-800 hover:bg-slate-700/90 border-slate-700 hover:border-amber-400 text-white shadow-md hover:shadow-amber-500/10'
                    }`}
                  >
                    <span>{num}</span>
                    <span className="text-[9px] font-medium text-slate-400">
                      {isSelected ? '✓ Eklendi' : 'Çarpan'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LEVEL WON OVERLAY */}
      {gameState === 'level_won' && (
        <div className="py-10 text-center space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
            ✨
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Harika Paketleme!</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              <strong>{currentLevel.targetNumber}</strong> sayısının tüm çarpanlarını ({currentLevel.allFactors.join(', ')}) eksiksiz buldunuz ve koli hazırlandı!
            </p>
          </div>
          <button
            type="button"
            onClick={handleNextLevel}
            className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
          >
            <span>Sıradaki Koliyi Paketle</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* GAME OVER OVERLAY */}
      {gameState === 'game_over' && (
        <div className="py-10 text-center space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-4xl mx-auto">
            💥
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Koliler Devrildi!</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Canlarınız veya süreniz bitti. Çarpanları dikkatlice kontrol edip yeniden deneyiniz.
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartGame}
            className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Başlat</span>
          </button>
        </div>
      )}

      {/* ALL COMPLETED VICTORY */}
      {gameState === 'completed' && (
        <div className="py-10 text-center space-y-6 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-amber-500/40 animate-pulse">
            🏆
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-amber-400">Kusursuz Paketleyici!</h3>
            <p className="text-xs sm:text-sm text-slate-200">
              Tüm seviyeleri başarıyla tamamladınız ve yardım kolilerini ihtiyaç sahiplerine ulaştırdınız.
            </p>
            <div className="text-xs text-emerald-400 font-bold">
              +150 XP • Maarif Dâhisi Rozeti Açıldı
            </div>
          </div>
          <button
            type="button"
            onClick={handleStartGame}
            className="px-8 py-3.5 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black text-sm shadow-lg transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tekrar Oyna</span>
          </button>
        </div>
      )}

    </div>
  );
}
