'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Award,
  Play,
  Layers,
  Sliders,
  Compass,
  Sparkles,
  HelpCircle,
  Sun,
  Flame,
  BatteryCharging
} from 'lucide-react';

// =================================================================
// GAME 1: KÜME AYIKLAMA İSTASYONU (SET SORTING ARCADE)
// =================================================================
interface SortingItem {
  id: number;
  display: string;
  bestSet: 'N' | 'Z' | 'Q' | 'UNDEFINED';
  explanation: string;
  subValue?: string;
}

const SORTING_QUESTIONS: SortingItem[] = [
  { id: 1, display: '+5', bestSet: 'N', explanation: '+5 pozitif bir tam sayıdır ve ℕ (Doğal Sayılar) kümesinin elemanıdır.' },
  { id: 2, display: '-3', bestSet: 'Z', explanation: '-3 negatiftir, bu yüzden doğal sayı olamaz. ℤ (Tam Sayılar) kümesinin elemanıdır.' },
  { id: 3, display: '0', bestSet: 'N', explanation: '0 başlangıç noktasıdır ve en küçük doğal sayıdır (0 ∈ ℕ).' },
  { id: 4, display: '2/3', bestSet: 'Q', explanation: '2/3 tam sayıya sadeleşmez, ℚ (Rasyonel Sayılar) kümesine aittir.' },
  { id: 5, display: '-7/4', bestSet: 'Q', explanation: '-7/4 negatif bir kesirdir (-1 tam 3/4), ℚ kümesine aittir.' },
  { id: 6, display: '0/5', bestSet: 'N', explanation: '0/5 = 0 eder. 0 bir doğal sayıdır (ve dolayısıyla tam sayı ve rasyonel sayıdır).' },
  { id: 7, display: '4/0', bestSet: 'UNDEFINED', explanation: 'Payda sıfır olamaz! 4/0 matematiksel olarak TANIMSIZDIR ve hiçbir kümeye ait değildir.' },
  { id: 8, display: '-12/3', bestSet: 'Z', explanation: '-12/3 = -4 eder! Sadeleştiğinde negatif tam sayı olduğu için ℤ kümesine aittir.' },
  { id: 9, display: '+15/5', bestSet: 'N', explanation: '+15/5 = +3 eder! Sadeleştiğinde pozitif tam sayı olduğu için ℕ kümesine aittir.' },
  { id: 10, display: '-8/0', bestSet: 'UNDEFINED', explanation: 'Payda sıfır olduğunda ifade tanımsızdır!' }
];

export function SetSortingGame() {
  const { playSound, addPoints, unlockBadge } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentItem = SORTING_QUESTIONS[currentIndex];

  const handlePickSet = (chosenSet: 'N' | 'Z' | 'Q' | 'UNDEFINED') => {
    if (feedback) return;

    const isCorrect = chosenSet === currentItem.bestSet;
    if (isCorrect) {
      playSound('success');
      setScore((prev) => prev + 15);
      addPoints(15);
      setFeedback({
        isCorrect: true,
        text: `Doğru! ${currentItem.explanation}`
      });
    } else {
      playSound('clear');
      setFeedback({
        isCorrect: false,
        text: `Yanlış sepet! Doğrusu: ${
          currentItem.bestSet === 'N'
            ? 'ℕ (Doğal Sayılar)'
            : currentItem.bestSet === 'Z'
            ? 'ℤ (Tam Sayılar)'
            : currentItem.bestSet === 'Q'
            ? 'ℚ (Rasyonel Sayılar)'
            : '🚫 Tanımsız'
        }. ${currentItem.explanation}`
      });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentIndex + 1 < SORTING_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsGameOver(true);
      playSound('bell');
      confetti({ particleCount: 100, spread: 70 });
      unlockBadge('Küme Dedektifi');
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setIsGameOver(false);
  };

  if (isGameOver) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-6 max-w-xl mx-auto animate-in zoom-in-95">
        <div className="w-20 h-20 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
          <Trophy className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">Ayıklama İstasyonu Tamamlandı!</h3>
          <p className="text-xs text-slate-500 mt-2">
            Tüm sayıları doğru sepetlere yerleştirdiniz ve N ⊂ Z ⊂ Q hiyerarşisini kanıtladınız!
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 font-black text-purple-900 text-lg">
          Toplam Puan: {score} / 150
        </div>
        <button
          type="button"
          onClick={handleRestart}
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition-all flex items-center gap-2 mx-auto cursor-pointer shadow-md shadow-purple-600/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Yeniden Oyna</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 max-w-2xl mx-auto">
      {/* Top Status */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700 font-black text-xs">
            Sayı {currentIndex + 1} / {SORTING_QUESTIONS.length}
          </div>
          <span className="text-xs font-black text-slate-700">Küme Ayıklama İstasyonu</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>{score} Puan</span>
        </div>
      </div>

      {/* Falling / Active Number Card */}
      <div className="text-center py-8 bg-slate-900 rounded-3xl text-white shadow-inner relative overflow-hidden border border-slate-800">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Hangi Sepete Ait? (En Özel Kümeyi Seçin)
        </div>
        <div className="text-5xl font-black font-mono tracking-tight text-amber-300 drop-shadow-md animate-in zoom-in-95">
          {currentItem.display}
        </div>
      </div>

      {/* Baskets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => handlePickSet('N')}
          disabled={!!feedback}
          className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <span className="text-2xl font-black">ℕ</span>
          <span className="text-xs font-bold">Doğal Sayılar</span>
          <span className="text-[10px] text-emerald-700 font-mono">0, 1, 2...</span>
        </button>

        <button
          type="button"
          onClick={() => handlePickSet('Z')}
          disabled={!!feedback}
          className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 text-blue-950 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <span className="text-2xl font-black">ℤ</span>
          <span className="text-xs font-bold">Tam Sayılar</span>
          <span className="text-[10px] text-blue-700 font-mono">... -2, -1, 0, 1 ...</span>
        </button>

        <button
          type="button"
          onClick={() => handlePickSet('Q')}
          disabled={!!feedback}
          className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 text-purple-950 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <span className="text-2xl font-black">ℚ</span>
          <span className="text-xs font-bold">Rasyonel Sayılar</span>
          <span className="text-[10px] text-purple-700 font-mono">a/b, b ≠ 0</span>
        </button>

        <button
          type="button"
          onClick={() => handlePickSet('UNDEFINED')}
          disabled={!!feedback}
          className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-950 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <span className="text-2xl font-black">🚫</span>
          <span className="text-xs font-bold">Tanımsız</span>
          <span className="text-[10px] text-rose-700 font-mono">Payda = 0</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 animate-in fade-in ${
            feedback.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-start gap-2 text-xs font-bold">
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <p>{feedback.text}</p>
          </div>
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-all flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
          >
            <span>Sıradaki</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// =================================================================
// GAME 2: RASYONEL PARAŞÜTÇÜ (RATIONAL PARACHUTIST)
// =================================================================
interface ParachuteMission {
  id: number;
  targetFraction: string;
  targetValue: number;
  correctMin: number;
  correctMax: number;
  recommendedPartitions: number;
  correctTickStep: number;
  contextText: string;
}

const PARACHUTE_MISSIONS: ParachuteMission[] = [
  {
    id: 1,
    targetFraction: '-3/4',
    targetValue: -0.75,
    correctMin: -1,
    correctMax: 0,
    recommendedPartitions: 4,
    correctTickStep: 1, // 1 step from -1 towards 0, which is -1 + 1/4 = -3/4
    contextText: 'Klima yarım saat çalışıp -3/4 kWh enerji tüketti. Paraşütçüyü tam bu noktaya indir!'
  },
  {
    id: 2,
    targetFraction: '+5/2',
    targetValue: 2.5,
    correctMin: 2,
    correctMax: 3,
    recommendedPartitions: 2,
    correctTickStep: 1, // 2 + 1/2 = 5/2
    contextText: 'Güneş panelleri saat 14:00\'te +5/2 kWh elektrik üretti. Paraşütçüyü enerji zirvesine indir!'
  },
  {
    id: 3,
    targetFraction: '-7/3',
    targetValue: -2.33,
    correctMin: -3,
    correctMax: -2,
    recommendedPartitions: 3,
    correctTickStep: 2, // -3 + 2/3 = -7/3
    contextText: 'Akıllı evin kış mevsimi performans kaybı -7/3 olarak ölçüldü. Sayı doğrusunda iniş yap!'
  }
];

export function RationalParachuteGame() {
  const { playSound, addPoints, unlockBadge } = useApp();
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedMin, setSelectedMin] = useState<number>(-3); // Default to first range [-3, -2]
  const [selectedPartitions, setSelectedPartitions] = useState<number>(2); // Default to first partition 2
  const [landedTick, setLandedTick] = useState<number | null>(null);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const currentMission = PARACHUTE_MISSIONS[missionIndex];

  const handleDropParachute = (step: number) => {
    setLandedTick(step);
    const chosenVal = selectedMin + step / selectedPartitions;
    const diff = Math.abs(chosenVal - currentMission.targetValue);

    if (diff < 0.05) {
      playSound('success');
      setIsSuccess(true);
      setGameFeedback(`TAM İSABET! Paraşütçü kusursuz şekilde ${currentMission.targetFraction} noktasına indi!`);
      setScore((prev) => prev + 30);
      addPoints(30);
      confetti({ particleCount: 80, spread: 60 });
    } else {
      playSound('clear');
      setIsSuccess(false);
      setGameFeedback(
        `Hedefi ıskaladın! İndiğin nokta: ${(selectedMin * selectedPartitions + step)}/${selectedPartitions} (${chosenVal.toFixed(2)}). Hedef ise ${currentMission.targetFraction} idi.`
      );
    }
  };

  const handleNextMission = () => {
    setLandedTick(null);
    setGameFeedback(null);
    setIsSuccess(false);
    if (missionIndex + 1 < PARACHUTE_MISSIONS.length) {
      setMissionIndex((prev) => prev + 1);
      setSelectedMin(-3);
      setSelectedPartitions(2);
    } else {
      playSound('bell');
      unlockBadge('Hassas Paraşütçü');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
            Görev {missionIndex + 1} / {PARACHUTE_MISSIONS.length}
          </span>
          <h3 className="text-base font-black text-slate-900 mt-1">Rasyonel Paraşütçü</h3>
        </div>
        <div className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          {score} Puan
        </div>
      </div>

      {/* Mission HUD */}
      <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-2 border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-indigo-400 uppercase">HEDEF İNİŞ NOKTASI:</span>
          <span className="text-2xl font-black text-amber-400 font-mono">{currentMission.targetFraction}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          {currentMission.contextText}
        </p>
      </div>

      {/* Controls: Select Range & Division */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Integer Range Selection */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <label className="block text-xs font-black text-slate-700">1. Adım: İki Tam Sayı Aralığını Seç</label>
          <div className="flex flex-wrap gap-2">
            {[
              { min: -3, max: -2 },
              { min: -2, max: -1 },
              { min: -1, max: 0 },
              { min: 0, max: 1 },
              { min: 2, max: 3 }
            ].map((rng) => (
              <button
                key={`${rng.min}-${rng.max}`}
                type="button"
                onClick={() => {
                  setSelectedMin(rng.min);
                  setLandedTick(null);
                  setGameFeedback(null);
                  playSound('select');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedMin === rng.min
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                [{rng.min}, {rng.max}]
              </button>
            ))}
          </div>
        </div>

        {/* Partition Count */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <label className="block text-xs font-black text-slate-700">2. Adım: Paydaya Göre Eşit Dilimle</label>
          <div className="flex gap-2">
            {[2, 3, 4, 5, 8].map((part) => (
              <button
                key={part}
                type="button"
                onClick={() => {
                  setSelectedPartitions(part);
                  setLandedTick(null);
                  setGameFeedback(null);
                  playSound('click');
                }}
                className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedPartitions === part
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {part}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Number Line Canvas with Clickable Drop Zones */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white relative">
        <div className="text-center text-[11px] font-mono text-slate-400 mb-4">
          3. Adım: Paraşütçüyü indirmek istediğin bölme çizgisine tıkla! 🪂
        </div>

        <div className="h-32 relative flex flex-col justify-center px-8">
          <div className="w-full h-1 bg-indigo-400/80 rounded-full relative">
            {/* Left Bound */}
            <div className="absolute -left-4 -top-6 flex flex-col items-center">
              <div className="w-1 h-12 bg-white rounded-full"></div>
              <span className="mt-2 text-lg font-black text-white">{selectedMin}</span>
            </div>

            {/* Right Bound */}
            <div className="absolute -right-4 -top-6 flex flex-col items-center">
              <div className="w-1 h-12 bg-white rounded-full"></div>
              <span className="mt-2 text-lg font-black text-white">{selectedMin + 1}</span>
            </div>

            {/* Intermediate Ticks / Drop Buttons */}
            {Array.from({ length: selectedPartitions - 1 }).map((_, i) => {
              const step = i + 1;
              const leftPercent = (step / selectedPartitions) * 100;
              const isLanded = landedTick === step;

              return (
                <div
                  key={step}
                  style={{ left: `${leftPercent}%` }}
                  onClick={() => handleDropParachute(step)}
                  className="absolute -top-6 -translate-x-1/2 flex flex-col items-center cursor-pointer group"
                >
                  {isLanded && (
                    <div className="absolute -top-8 text-2xl animate-bounce">🪂</div>
                  )}
                  <div
                    className={`w-2 h-10 rounded-full transition-all ${
                      isLanded
                        ? 'bg-amber-400 ring-4 ring-amber-400/40'
                        : 'bg-indigo-300 group-hover:bg-amber-300'
                    }`}
                  />
                  <span className="mt-2 text-[10px] font-mono text-indigo-200 group-hover:text-amber-300">
                    {selectedMin * selectedPartitions + step}/{selectedPartitions}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result / Feedback */}
      {gameFeedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 animate-in fade-in ${
            isSuccess
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-start gap-2 text-xs font-bold">
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <p>{gameFeedback}</p>
          </div>
          {isSuccess && (
            <button
              type="button"
              onClick={handleNextMission}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-all flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
            >
              <span>Sonraki Seviye</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// =================================================================
// GAME 3: SIFIR DENGE MERKEZİ (ZERO BALANCE CENTER / ABSOLUTE VALUE)
// =================================================================
interface BalanceLevel {
  id: number;
  leakVal: number; // e.g. -6
  leakLabel: string;
  targetAbsolute: number; // |-6| = 6
  choices: Array<{ id: string; text: string; val: number; isCorrect: boolean }>;
}

const BALANCE_LEVELS: BalanceLevel[] = [
  {
    id: 1,
    leakVal: -6,
    leakLabel: '-6 kWh (Şebeke Kaçağı)',
    targetAbsolute: 6,
    choices: [
      { id: 'c1', text: '+6 kWh', val: 6, isCorrect: true },
      { id: 'c2', text: '-6 kWh', val: -6, isCorrect: false },
      { id: 'c3', text: '+3 kWh', val: 3, isCorrect: false },
      { id: 'c4', text: '+12/2 kWh', val: 6, isCorrect: true }
    ]
  },
  {
    id: 2,
    leakVal: +4,
    leakLabel: '+4 kWh (Fazla Güneş Üretimi)',
    targetAbsolute: 4,
    choices: [
      { id: 'c1', text: '-4 kWh (Eşit Sapma)', val: -4, isCorrect: true },
      { id: 'c2', text: '+8 kWh', val: 8, isCorrect: false },
      { id: 'c3', text: '-8/2 kWh (Eşit Sapma)', val: -4, isCorrect: true },
      { id: 'c4', text: '0 kWh', val: 0, isCorrect: false }
    ]
  }
];

export function ZeroBalanceCenterGame() {
  const { playSound, addPoints, unlockBadge } = useApp();
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentLevel = BALANCE_LEVELS[levelIndex];

  const handleSelectChoice = (choice: { text: string; isCorrect: boolean }) => {
    if (choice.isCorrect) {
      playSound('success');
      setIsSuccess(true);
      setFeedback(`KİLİT AÇILDI! Her iki enerji de sıfır noktasından tam ${currentLevel.targetAbsolute} birim uzaklıktadır. Mutlak değer eşitliği sağlandı!`);
      setScore((prev) => prev + 25);
      addPoints(25);
      confetti({ particleCount: 70, spread: 50 });
    } else {
      playSound('clear');
      setIsSuccess(false);
      setFeedback(`Denge kurulamadı! Sıfıra olan mesafe (mutlak değer) tam ${currentLevel.targetAbsolute} birim olmalıdır.`);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setIsSuccess(false);
    if (levelIndex + 1 < BALANCE_LEVELS.length) {
      setLevelIndex((prev) => prev + 1);
    } else {
      playSound('bell');
      unlockBadge('Enerji Mimarı');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
            Kademe {levelIndex + 1} / {BALANCE_LEVELS.length}
          </span>
          <h3 className="text-base font-black text-slate-900 mt-1">Sıfır Denge Merkezi</h3>
        </div>
        <div className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          {score} Puan
        </div>
      </div>

      {/* Energy Crystal Vault */}
      <div className="p-6 bg-slate-950 rounded-3xl text-white text-center space-y-4 border border-slate-800">
        <span className="text-[11px] font-mono text-slate-400 uppercase">AKILLI EV ENERJİ SAYAÇ DURUMU</span>
        <div className="text-4xl font-black font-mono text-rose-400">
          {currentLevel.leakLabel}
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 max-w-md mx-auto text-xs text-slate-300 font-mono">
          Hedef Mutlak Değer: | {currentLevel.leakVal} | = <span className="text-emerald-400 font-bold">{currentLevel.targetAbsolute} birim</span> uzaklık.
        </div>
      </div>

      {/* Choices: Select Opposite Balance Crystal */}
      <div className="space-y-2">
        <span className="text-xs font-black text-slate-700">
          Sıfır denge noktasına (0) aynı mesafede olan dengeli kristali seç:
        </span>
        <div className="grid grid-cols-2 gap-3">
          {currentLevel.choices.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelectChoice(c)}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-400 text-slate-900 font-black text-sm transition-all cursor-pointer active:scale-95 text-center"
            >
              {c.text}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 animate-in fade-in ${
            isSuccess
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-start gap-2 text-xs font-bold">
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <p>{feedback}</p>
          </div>
          {isSuccess && (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-all flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
            >
              <span>Devam Et</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
