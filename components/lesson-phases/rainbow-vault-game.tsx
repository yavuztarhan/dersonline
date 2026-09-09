'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Lock,
  Unlock,
  Sparkles,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Key,
  ShieldCheck,
  Award,
  Play,
  ArrowRight
} from 'lucide-react';

interface VaultPair {
  a: number | null; // null means question mark
  b: number | null;
  correctA: number;
  correctB: number;
}

interface VaultLevel {
  id: number;
  targetNumber: number;
  title: string;
  pairs: VaultPair[];
  optionsPool: number[];
}

const VAULT_LEVELS: VaultLevel[] = [
  {
    id: 1,
    targetNumber: 28,
    title: 'Çelik Kasa 1: İyilik Sandığı (28)',
    pairs: [
      { a: 1, b: null, correctA: 1, correctB: 28 },
      { a: 2, b: 14, correctA: 2, correctB: 14 },
      { a: null, b: 7, correctA: 4, correctB: 7 }
    ],
    optionsPool: [4, 6, 8, 14, 21, 28]
  },
  {
    id: 2,
    targetNumber: 40,
    title: 'Çelik Kasa 2: Dayanışma Kasası (40)',
    pairs: [
      { a: 1, b: 40, correctA: 1, correctB: 40 },
      { a: 2, b: null, correctA: 2, correctB: 20 },
      { a: null, b: 10, correctA: 4, correctB: 10 },
      { a: 5, b: null, correctA: 5, correctB: 8 }
    ],
    optionsPool: [4, 6, 8, 12, 15, 20, 24]
  },
  {
    id: 3,
    targetNumber: 54,
    title: 'Çelik Kasa 3: Kardeşlik Kasası (54)',
    pairs: [
      { a: 1, b: 54, correctA: 1, correctB: 54 },
      { a: null, b: 27, correctA: 2, correctB: 27 },
      { a: 3, b: null, correctA: 3, correctB: 18 },
      { a: 6, b: null, correctA: 6, correctB: 9 }
    ],
    optionsPool: [2, 4, 8, 9, 12, 16, 18]
  },
  {
    id: 4,
    targetNumber: 72,
    title: 'Çelik Kasa 4: Büyük Maarif Kasası (72)',
    pairs: [
      { a: 1, b: null, correctA: 1, correctB: 72 },
      { a: 2, b: 36, correctA: 2, correctB: 36 },
      { a: null, b: 24, correctA: 3, correctB: 24 },
      { a: 4, b: null, correctA: 4, correctB: 18 },
      { a: 6, b: 12, correctA: 6, correctB: 12 },
      { a: null, b: 9, correctA: 8, correctB: 9 }
    ],
    optionsPool: [3, 5, 8, 14, 18, 20, 72]
  }
];

const RAINBOW_COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

interface RainbowVaultGameProps {
  onBackToMenu?: () => void;
}

export function RainbowVaultGame({ onBackToMenu }: RainbowVaultGameProps = {}) {
  const { playSound, addPoints, unlockBadge } = useApp();

  const [levelIndex, setLevelIndex] = useState(0);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'level_won' | 'completed'>('ready');
  const [userInputs, setUserInputs] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);

  const currentLevel = VAULT_LEVELS[levelIndex] || VAULT_LEVELS[0];

  // Initialize level
  useEffect(() => {
    if (gameState === 'playing') {
      setUserInputs({});
    }
  }, [levelIndex, gameState]);

  const handleStartGame = () => {
    playSound('select');
    setLevelIndex(0);
    setScore(0);
    setGameState('playing');
  };

  const handleAssignNumber = (slotKey: string, num: number) => {
    playSound('click');
    const nextInputs = { ...userInputs, [slotKey]: num };
    setUserInputs(nextInputs);

    // Check if all slots are filled correctly
    checkCompletion(nextInputs);
  };

  const checkCompletion = (inputs: Record<string, number>) => {
    let allFilled = true;
    let allCorrect = true;

    currentLevel.pairs.forEach((pair, idx) => {
      if (pair.a === null) {
        const val = inputs[`pair-${idx}-a`];
        if (val === undefined) allFilled = false;
        else if (val !== pair.correctA) allCorrect = false;
      }
      if (pair.b === null) {
        const val = inputs[`pair-${idx}-b`];
        if (val === undefined) allFilled = false;
        else if (val !== pair.correctB) allCorrect = false;
      }
    });

    if (allFilled && allCorrect) {
      handleVaultUnlocked();
    } else if (allFilled && !allCorrect) {
      playSound('click');
    }
  };

  const handleVaultUnlocked = () => {
    playSound('bell');
    addPoints(50);
    setScore((prev) => prev + 50);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    if (levelIndex < VAULT_LEVELS.length - 1) {
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
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/50 shadow-2xl space-y-6 select-none relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-black uppercase tracking-wider">
              3. Dijital Oyun • Eksik Çarpan Bulmaca
            </span>
            <span className="text-xs text-slate-400 font-bold">
              Kasa {levelIndex + 1} / {VAULT_LEVELS.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-400 flex items-center gap-2">
            <Lock className="w-6 h-6" />
            <span>GÖKKUŞAĞI KASASI</span>
          </h2>
        </div>

        {/* Score */}
        <div className="bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-indigo-400" />
          <div className="text-right">
            <div className="text-[9px] text-slate-400 font-bold uppercase">Puan</div>
            <div className="text-sm font-black font-mono text-indigo-300">{score}</div>
          </div>
        </div>
      </div>

      {/* READY SCREEN */}
      {gameState === 'ready' && (
        <div className="py-12 text-center space-y-6 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-indigo-500/20">
            🔐
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Çelik Kasaların Şifresini Çöz!</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Gökkuşağı yaylarının uçlarındaki iki sayının çarpımı <strong>hedef sayıyı</strong> verir. Kilitli yuvalara doğru sayıları yerleştirerek kasaları açınız ve yardım rozetlerini toplayınız!
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartGame}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-indigo-500/30 transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Kasa Şifresini Başlat</span>
          </button>
        </div>
      )}

      {/* PLAYING SCREEN */}
      {gameState === 'playing' && (
        <div className="space-y-6">
          {/* Vault Body & Arc Visualization */}
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border-4 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center">
            {/* Vault Dial Center */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border-4 border-indigo-400 flex flex-col items-center justify-center shadow-xl mb-6 relative">
              <span className="text-[10px] font-extrabold uppercase text-indigo-300 tracking-wider">Hedef Çarpım</span>
              <span className="text-3xl font-black text-white font-mono">{currentLevel.targetNumber}</span>
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-400/40 animate-spin" style={{ animationDuration: '20s' }} />
            </div>

            {/* Rainbow Pairs Arcs */}
            <div className="w-full max-w-xl space-y-3">
              {currentLevel.pairs.map((pair, idx) => {
                const color = RAINBOW_COLORS[idx % RAINBOW_COLORS.length];
                const keyA = `pair-${idx}-a`;
                const keyB = `pair-${idx}-b`;

                const valA = pair.a !== null ? pair.a : userInputs[keyA];
                const valB = pair.b !== null ? pair.b : userInputs[keyB];

                const isAInput = pair.a === null;
                const isBInput = pair.b === null;

                const isACorrect = valA === pair.correctA;
                const isBCorrect = valB === pair.correctB;

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4 transition-all"
                    style={{ borderLeftColor: color, borderLeftWidth: '5px' }}
                  >
                    {/* Left Factor */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-base border-2 font-mono transition-all ${
                          isAInput
                            ? valA !== undefined
                              ? isACorrect
                                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                                : 'bg-rose-950/80 border-rose-500 text-rose-300'
                              : 'bg-slate-800 border-dashed border-indigo-400 text-indigo-300 animate-pulse'
                            : 'bg-slate-800 border-slate-700 text-white'
                        }`}
                      >
                        {valA !== undefined ? valA : '?'}
                      </div>
                      <span className="text-xs font-bold text-slate-400">Sol Kol</span>
                    </div>

                    {/* Connecting Rainbow Arc Badge */}
                    <div className="flex flex-col items-center">
                      <div className="h-0.5 w-16 sm:w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full" />
                      <span className="text-[10px] font-mono text-slate-400 mt-1">
                        {valA ?? '?'} × {valB ?? '?'} = {currentLevel.targetNumber}
                      </span>
                    </div>

                    {/* Right Factor */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">Sağ Kol</span>
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-base border-2 font-mono transition-all ${
                          isBInput
                            ? valB !== undefined
                              ? isBCorrect
                                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                                : 'bg-rose-950/80 border-rose-500 text-rose-300'
                              : 'bg-slate-800 border-dashed border-indigo-400 text-indigo-300 animate-pulse'
                            : 'bg-slate-800 border-slate-700 text-white'
                        }`}
                      >
                        {valB !== undefined ? valB : '?'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Numbers Options Bank */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 px-1">
              Eksik yuvaları (?) doldurmak için doğru çarpan anahtarını seçiniz:
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {currentLevel.optionsPool.map((num) => {
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      // Find first empty slot
                      for (let i = 0; i < currentLevel.pairs.length; i++) {
                        const p = currentLevel.pairs[i];
                        if (p.a === null && userInputs[`pair-${i}-a`] === undefined) {
                          handleAssignNumber(`pair-${i}-a`, num);
                          return;
                        }
                        if (p.b === null && userInputs[`pair-${i}-b`] === undefined) {
                          handleAssignNumber(`pair-${i}-b`, num);
                          return;
                        }
                      }
                      // If all filled, overwrite last
                      for (let i = 0; i < currentLevel.pairs.length; i++) {
                        const p = currentLevel.pairs[i];
                        if (p.a === null && userInputs[`pair-${i}-a`] !== p.correctA) {
                          handleAssignNumber(`pair-${i}-a`, num);
                          return;
                        }
                        if (p.b === null && userInputs[`pair-${i}-b`] !== p.correctB) {
                          handleAssignNumber(`pair-${i}-b`, num);
                          return;
                        }
                      }
                    }}
                    className="h-14 rounded-2xl bg-slate-800 hover:bg-slate-700/90 border-2 border-slate-700 hover:border-indigo-400 font-black text-lg text-white shadow-md hover:scale-105 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{num}</span>
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
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center text-4xl mx-auto animate-bounce">
            🔓
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Kasa Açıldı!</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              <strong>{currentLevel.targetNumber}</strong> sayısının tüm gökkuşağı çarpan çiftlerini hatasız eşleştirdiniz ve şifreyi çözdünüz!
            </p>
          </div>
          <button
            type="button"
            onClick={handleNextLevel}
            className="px-8 py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-sm shadow-xl shadow-indigo-500/30 transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
          >
            <span>Sıradaki Kasayı Aç</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* COMPLETED VICTORY */}
      {gameState === 'completed' && (
        <div className="py-10 text-center space-y-6 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-400 to-purple-600 text-white flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-indigo-500/40 animate-pulse">
            👑
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-indigo-400">Kasa Şifre Ustası!</h3>
            <p className="text-xs sm:text-sm text-slate-200">
              Tüm çelik kasaların çarpan kilitlerini gökkuşağı tekniğiyle açtınız ve yardım sandıklarını seferber ettiniz!
            </p>
            <div className="text-xs text-indigo-300 font-bold">
              +150 XP • Maarif Şifre Rozeti Kazanıldı
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
