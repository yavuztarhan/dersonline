'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Heart,
  Zap,
  ArrowRight,
  ShieldCheck,
  Award,
  Play,
  Waves
} from 'lucide-react';

interface FrogLevel {
  id: number;
  baseNumber: number;
  targetCount: number;
  correctMultiples: number[];
  traps: Array<{ num: number; reason: string }>;
}

const FROG_LEVELS: FrogLevel[] = [
  {
    id: 1,
    baseNumber: 6,
    targetCount: 5,
    correctMultiples: [6, 12, 18, 24, 30, 36, 42],
    traps: [
      { num: 2, reason: "2 sayısı 6'nın katı değil, bölenidir!" },
      { num: 3, reason: "3 sayısı 6'nın katı değil, bölenidir!" },
      { num: 16, reason: "16 sayısı 6'nın tam katı değildir!" },
      { num: 20, reason: "20 sayısı 6'nın tam katı değildir!" },
      { num: 28, reason: "28 sayısı 6'nın tam katı değildir!" }
    ]
  },
  {
    id: 2,
    baseNumber: 9,
    targetCount: 5,
    correctMultiples: [9, 18, 27, 36, 45, 54, 63],
    traps: [
      { num: 3, reason: "3 sayısı 9'un katı değil, bölenidir (tuzak)!" },
      { num: 15, reason: "15 sayısı 9'un katı değildir!" },
      { num: 21, reason: "21 sayısı 9'un katı değildir!" },
      { num: 30, reason: "30 sayısı 9'un katı değildir!" },
      { num: 40, reason: "40 sayısı 9'un katı değildir!" }
    ]
  },
  {
    id: 3,
    baseNumber: 8,
    targetCount: 5,
    correctMultiples: [8, 16, 24, 32, 40, 48, 56],
    traps: [
      { num: 2, reason: "2 sayısı 8'in katı değil, bölenidir!" },
      { num: 4, reason: "4 sayısı 8'in katı değil, bölenidir!" },
      { num: 18, reason: "18 sayısı 8'in katı değildir!" },
      { num: 30, reason: "30 sayısı 8'in katı değildir!" },
      { num: 42, reason: "42 sayısı 8'in katı değildir!" }
    ]
  },
  {
    id: 4,
    baseNumber: 12,
    targetCount: 5,
    correctMultiples: [12, 24, 36, 48, 60, 72, 84],
    traps: [
      { num: 3, reason: "3 sayısı 12'nin katı değil, bölenidir!" },
      { num: 4, reason: "4 sayısı 12'nin katı değil, bölenidir!" },
      { num: 6, reason: "6 sayısı 12'nin katı değil, bölenidir!" },
      { num: 20, reason: "20 sayısı 12'nin katı değildir!" },
      { num: 50, reason: "50 sayısı 12'nin katı değildir!" }
    ]
  }
];

interface FrogJumpGameProps {
  onBackToMenu?: () => void;
}

export function FrogJumpGame({ onBackToMenu }: FrogJumpGameProps = {}) {
  const { playSound, addPoints, unlockBadge } = useApp();

  const [levelIndex, setLevelIndex] = useState(0);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'level_won' | 'game_over' | 'completed'>('ready');
  const [collectedMultiples, setCollectedMultiples] = useState<number[]>([]);
  const [sunkenLilies, setSunkenLilies] = useState<number[]>([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [shuffledLilies, setShuffledLilies] = useState<Array<{ num: number; isMultiple: boolean; reason?: string }>>([]);

  const currentLevel = FROG_LEVELS[levelIndex] || FROG_LEVELS[0];

  // Initialize level
  useEffect(() => {
    if (gameState === 'playing') {
      const multiples = currentLevel.correctMultiples.map((num) => ({ num, isMultiple: true }));
      const traps = currentLevel.traps.map((t) => ({ num: t.num, isMultiple: false, reason: t.reason }));
      const all = [...multiples, ...traps].sort(() => Math.random() - 0.5);
      setShuffledLilies(all);
      setCollectedMultiples([]);
      setSunkenLilies([]);
      setLastFeedback(null);
    }
  }, [levelIndex, gameState]);

  const handleStartGame = () => {
    playSound('select');
    setLevelIndex(0);
    setScore(0);
    setLives(3);
    setGameState('playing');
  };

  const handleLilyClick = (item: { num: number; isMultiple: boolean; reason?: string }) => {
    if (collectedMultiples.includes(item.num) || sunkenLilies.includes(item.num) || gameState !== 'playing') return;

    if (item.isMultiple) {
      playSound('success');
      const nextCollected = [...collectedMultiples, item.num];
      setCollectedMultiples(nextCollected);
      setScore((prev) => prev + 20);
      setLastFeedback(`Harika! ${item.num} sayısı ${currentLevel.baseNumber}'in katıdır.`);

      if (nextCollected.length >= currentLevel.targetCount) {
        handleLevelComplete();
      }
    } else {
      playSound('click');
      setSunkenLilies((prev) => [...prev, item.num]);
      setLastFeedback(`Eyvah! ${item.reason || `${item.num} sayısı kat değildir.`}`);
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

    if (levelIndex < FROG_LEVELS.length - 1) {
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
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/50 shadow-2xl space-y-6 select-none relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
              2. Dijital Oyun • Sayı Doğrusu Parkuru
            </span>
            <span className="text-xs text-slate-400 font-bold">
              Seviye {levelIndex + 1} / {FROG_LEVELS.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center gap-2">
            <span>🐸</span>
            <span>KAT AVCISI KURBAĞA</span>
          </h2>
        </div>

        {/* HUD: Score & Lives */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <div className="text-right">
              <div className="text-[9px] text-slate-400 font-bold uppercase">Puan</div>
              <div className="text-sm font-black font-mono text-emerald-300">{score}</div>
            </div>
          </div>

          <div className="bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700 flex items-center gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* READY SCREEN */}
      {gameState === 'ready' && (
        <div className="py-12 text-center space-y-6 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-emerald-500/20">
            🐸
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Gölde Zıplama Macerası!</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kurbağanın sırtında yazan sayının <strong>katı olan nilüfer yapraklarına</strong> zıplayarak gölü geçiniz. Dikkat: Bölenlere (tuzak) veya katı olmayan yapraklara basarsanız nilüfer batar!
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartGame}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>Göl Parkurunu Başlat</span>
          </button>
        </div>
      )}

      {/* PLAYING SCREEN */}
      {gameState === 'playing' && (
        <div className="space-y-6">
          {/* Mission & Target Frog Banner */}
          <div className="bg-gradient-to-r from-teal-950 via-slate-950 to-emerald-950 rounded-2xl p-5 border-2 border-emerald-500/40 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-md">
                🐸
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  Görev Sayısı
                </div>
                <div className="text-2xl font-black text-white">
                  {currentLevel.baseNumber}&apos;in Katlarını Bul!
                </div>
              </div>
            </div>

            {/* Progress Badge */}
            <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300">İlerleme:</span>
              <span className="text-base font-black font-mono text-emerald-400">
                {collectedMultiples.length} / {currentLevel.targetCount} Yaprak
              </span>
            </div>
          </div>

          {/* Feedback Line */}
          {lastFeedback && (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs font-bold text-center text-slate-200 animate-in fade-in">
              {lastFeedback}
            </div>
          )}

          {/* Pond Water Lily Grid */}
          <div className="bg-gradient-to-b from-blue-950/70 via-slate-950 to-teal-950/70 rounded-3xl p-6 sm:p-8 border-2 border-teal-500/30 shadow-2xl relative overflow-hidden">
            {/* Water Waves background decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-around">
              <Waves className="w-48 h-48 text-cyan-400" />
              <Waves className="w-48 h-48 text-teal-400" />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3.5 relative z-10">
              {shuffledLilies.map((item) => {
                const isCollected = collectedMultiples.includes(item.num);
                const isSunken = sunkenLilies.includes(item.num);

                return (
                  <button
                    key={item.num}
                    type="button"
                    disabled={isCollected || isSunken}
                    onClick={() => handleLilyClick(item)}
                    className={`h-20 rounded-3xl font-black text-lg transition-all flex flex-col items-center justify-center border-2 cursor-pointer active:scale-95 relative overflow-hidden ${
                      isCollected
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30 scale-105'
                        : isSunken
                        ? 'bg-slate-900 border-rose-800 text-rose-500 opacity-40 cursor-not-allowed'
                        : 'bg-emerald-950/70 hover:bg-emerald-900/80 border-emerald-500/60 hover:border-emerald-400 text-emerald-200 shadow-md hover:scale-105'
                    }`}
                  >
                    {/* Lily Pad Top Graphic */}
                    <span className="text-[10px] opacity-75 font-semibold">
                      {isCollected ? '🐸 Zıplandı' : isSunken ? '🌊 Battı' : '🍃 Nilüfer'}
                    </span>
                    <span className="text-xl font-mono">{item.num}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LEVEL WON */}
      {gameState === 'level_won' && (
        <div className="py-10 text-center space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-4xl mx-auto animate-bounce">
            🐸
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Harika Sıçrayış!</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              <strong>{currentLevel.baseNumber}</strong> sayısının katlarını başarıyla buldunuz ve kurbağayı karşı kıyıya ulaştırdınız!
            </p>
          </div>
          <button
            type="button"
            onClick={handleNextLevel}
            className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
          >
            <span>Sıradaki Göle Geç</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* GAME OVER */}
      {gameState === 'game_over' && (
        <div className="py-10 text-center space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-4xl mx-auto">
            🌊
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Kurbağa Suya Düştü!</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Tuzak bölenlere bastınız veya canlarınız tükendi. Kat ilişkisine dikkat ederek tekrar deneyiniz.
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartGame}
            className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Başlat</span>
          </button>
        </div>
      )}

      {/* COMPLETED */}
      {gameState === 'completed' && (
        <div className="py-10 text-center space-y-6 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-emerald-500/40 animate-pulse">
            👑
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-emerald-400">Gölün Efendisi!</h3>
            <p className="text-xs sm:text-sm text-slate-200">
              Tüm kat parkurlarını hatasız tamamladınız ve bölen tuzaklarına düşmeden zirveye ulaştınız.
            </p>
            <div className="text-xs text-teal-400 font-bold">
              +150 XP • Kat Avcısı Rozeti Kazanıldı
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
