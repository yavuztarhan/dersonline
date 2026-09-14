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
  BatteryCharging,
  Scale,
  Check,
  Star
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
interface BalanceChoice {
  id: string;
  text: string;
  val: number;
  isCorrect: boolean;
  sublabel?: string;
}

interface BalanceLevel {
  id: number;
  title: string;
  scenario: string;
  leakVal: number;
  leakDisplay: string;
  targetAbsolute: number;
  icon: string;
  explanation: string;
  choices: BalanceChoice[];
}

const BALANCE_LEVELS: BalanceLevel[] = [
  {
    id: 1,
    title: 'Kademe 1: Şebeke Enerji Kaçağı',
    scenario: 'Ana şebekede -6 kWh tüketim açığı oluştu. Sıfır denge noktasına (0) eşit mesafede zıt bir enerjiyle dengeyi sağlayınız.',
    leakVal: -6,
    leakDisplay: '-6 kWh',
    targetAbsolute: 6,
    icon: '⚡',
    explanation: '|-6| = 6 birim ve |+6| = 6 birim. Sıfıra eşit 6 birim uzaklıktaki zıt işaretli +6 kWh enerji sistemi tam 0 noktasına dengeler!',
    choices: [
      { id: 'c1', text: '+6 kWh', val: 6, isCorrect: true, sublabel: '|+6| = 6 birim (Tam Denge)' },
      { id: 'c2', text: '-6 kWh', val: -6, isCorrect: false, sublabel: 'Aynı yönde açığı büyütür' },
      { id: 'c3', text: '+3 kWh', val: 3, isCorrect: false, sublabel: '|+3| = 3 birim (Yetersiz kalır)' },
      { id: 'c4', text: '-12 kWh', val: -12, isCorrect: false, sublabel: 'Aşırı negatif sapma' }
    ]
  },
  {
    id: 2,
    title: 'Kademe 2: Güneş Panelleri Fazla Üretimi',
    scenario: 'Çatı güneş panelleri aniden +8 kWh fazla enerji üretti. Sayacı 0 denge seviyesine getirecek karşıt yükü bulunuz.',
    leakVal: 8,
    leakDisplay: '+8 kWh',
    targetAbsolute: 8,
    icon: '☀️',
    explanation: '|+8| = 8 birimdir. Denge için sıfır merkezinden diğer yöne doğru tam 8 birim uzaklıkta olan -8 kWh kristali gerekir.',
    choices: [
      { id: 'c1', text: '-8 kWh', val: -8, isCorrect: true, sublabel: '|-8| = 8 birim (Tam Denge)' },
      { id: 'c2', text: '+8 kWh', val: 8, isCorrect: false, sublabel: 'Zaten pozitif yük var' },
      { id: 'c3', text: '-4 kWh', val: -4, isCorrect: false, sublabel: '|-4| = 4 birim (Eksik kalır)' },
      { id: 'c4', text: '0 kWh', val: 0, isCorrect: false, sublabel: 'Nötr eleman etki etmez' }
    ]
  },
  {
    id: 3,
    title: 'Kademe 3: Jeotermal Isıtma Çekimi (Rasyonel Model)',
    scenario: 'Jeotermal pompa şebekeden -15/3 kWh (-5 kWh) enerji çekti. Sıfır noktasına eşit mesafede (+5) rasyonel dengeleyiciyi seçiniz.',
    leakVal: -5,
    leakDisplay: '-15/3 kWh (-5 kWh)',
    targetAbsolute: 5,
    icon: '🌋',
    explanation: '|-15/3| = |-5| = 5 birimdir. Karşı tarafta sıfıra 5 birim uzaklıktaki rasyonel denge kristali +10/2 kWh = +5 kWh olur!',
    choices: [
      { id: 'c1', text: '+10/2 kWh', val: 5, isCorrect: true, sublabel: '+10/2 = +5, |+5| = 5 birim' },
      { id: 'c2', text: '-5 kWh', val: -5, isCorrect: false, sublabel: 'Negatif yönde kalır' },
      { id: 'c3', text: '+15/5 kWh', val: 3, isCorrect: false, sublabel: '15/5 = 3 birim (Yetersiz)' },
      { id: 'c4', text: '-15/3 kWh', val: -5, isCorrect: false, sublabel: 'Aynı negatif çekim' }
    ]
  },
  {
    id: 4,
    title: 'Kademe 4: Rüzgar Türbini Voltaj Yükü',
    scenario: 'Fırtınada rüzgar türbini şebekeye +12 kWh yüksek gerilim yükledi. Sıfıra 12 birim mesafedeki zıt denge kristalini bulunuz.',
    leakVal: 12,
    leakDisplay: '+12 kWh',
    targetAbsolute: 12,
    icon: '💨',
    explanation: '|+12| = 12 birimdir. Sıfır merkezine 12 birim mesafedeki zıt rasyonel kristal -24/2 kWh = -12 kWh değeridir!',
    choices: [
      { id: 'c1', text: '-24/2 kWh', val: -12, isCorrect: true, sublabel: '-24/2 = -12, |-12| = 12 birim' },
      { id: 'c2', text: '+12 kWh', val: 12, isCorrect: false, sublabel: 'Aşırı pozitif yük' },
      { id: 'c3', text: '-6 kWh', val: -6, isCorrect: false, sublabel: '|-6| = 6 birim (Yarısı kadar)' },
      { id: 'c4', text: '-36/2 kWh', val: -18, isCorrect: false, sublabel: '|-18| = 18 birim (Fazla sapma)' }
    ]
  },
  {
    id: 5,
    title: 'Kademe 5: Akıllı Şehir Batarya Deşarjı',
    scenario: 'Merkezi enerji bataryası -18/2 kWh (-9 kWh) seviyesine düştü. Sıfıra 9 birim uzaklıktaki pozitif dolumu seçiniz.',
    leakVal: -9,
    leakDisplay: '-18/2 kWh (-9 kWh)',
    targetAbsolute: 9,
    icon: '🔋',
    explanation: '|-18/2| = |-9| = 9 birimdir. Mutlak değeri 9 olan pozitif rasyonel enerji kristali +27/3 = +9 kWh değeridir.',
    choices: [
      { id: 'c1', text: '+27/3 kWh', val: 9, isCorrect: true, sublabel: '+27/3 = +9, |+9| = 9 birim' },
      { id: 'c2', text: '-9 kWh', val: -9, isCorrect: false, sublabel: 'Deşarjı 2 katına çıkarır' },
      { id: 'c3', text: '+18/3 kWh', val: 6, isCorrect: false, sublabel: '18/3 = 6 birim (Eksik kalır)' },
      { id: 'c4', text: '+36/3 kWh', val: 12, isCorrect: false, sublabel: '36/3 = 12 birim (Aşar)' }
    ]
  },
  {
    id: 6,
    title: 'Kademe 6: Hidroelektrik Barajı Taşkın Rezervi',
    scenario: 'Baraj jeneratörleri taşkın korumada +15 kWh enerji pompaladı. 0 merkezine tam 15 birim mesafedeki dengeleyiciyi seçiniz.',
    leakVal: 15,
    leakDisplay: '+15 kWh',
    targetAbsolute: 15,
    icon: '🌊',
    explanation: '|+15| = 15 birimdir. Sıfır denge merkezinde tam simetrisi |-30/2| = |-15| = 15 birim uzaklıktaki -30/2 kWh kristalidir!',
    choices: [
      { id: 'c1', text: '-30/2 kWh', val: -15, isCorrect: true, sublabel: '-30/2 = -15, |-15| = 15 birim' },
      { id: 'c2', text: '+15 kWh', val: 15, isCorrect: false, sublabel: 'Taşmayı arttırır' },
      { id: 'c3', text: '-10 kWh', val: -10, isCorrect: false, sublabel: '|-10| = 10 birim (Yetersiz)' },
      { id: 'c4', text: '+30/2 kWh', val: 15, isCorrect: false, sublabel: 'Pozitif yönde kalır' }
    ]
  }
];

export interface ZeroBalanceCenterGameProps {
  onBackToMenu?: () => void;
}

export function ZeroBalanceCenterGame({ onBackToMenu }: ZeroBalanceCenterGameProps) {
  const { playSound, addPoints, unlockBadge } = useApp();
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<BalanceChoice | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);

  const currentLevel = BALANCE_LEVELS[levelIndex] || BALANCE_LEVELS[0];

  const handleSelectChoice = (choice: BalanceChoice) => {
    if (isSuccess || isGameCompleted) return;

    setSelectedChoice(choice);

    if (choice.isCorrect) {
      playSound('success');
      setIsSuccess(true);
      setFeedback(`KİLİT AÇILDI! Her iki enerji de sıfır noktasından tam ${currentLevel.targetAbsolute} birim uzaklıktadır. Mutlak değer eşitliği sağlandı: |${currentLevel.leakVal}| = |${choice.val}| = ${currentLevel.targetAbsolute}.`);
      setScore((prev) => prev + 25);
      addPoints(25);
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } else {
      playSound('clear');
      setIsSuccess(false);
      setFeedback(`Denge kurulamadı! Sıfıra olan mesafe (mutlak değer) tam ${currentLevel.targetAbsolute} birim olmalıdır. Tekrar deneyiniz.`);
    }
  };

  const handleNext = () => {
    setSelectedChoice(null);
    setFeedback(null);
    setIsSuccess(false);

    if (levelIndex + 1 < BALANCE_LEVELS.length) {
      setLevelIndex((prev) => prev + 1);
      playSound('click');
    } else {
      playSound('bell');
      setIsGameCompleted(true);
      unlockBadge('Enerji Mimarı');
      addPoints(50);
      confetti({ particleCount: 120, spread: 90 });
    }
  };

  const handleRestart = () => {
    setLevelIndex(0);
    setScore(0);
    setSelectedChoice(null);
    setFeedback(null);
    setIsSuccess(false);
    setIsGameCompleted(false);
    playSound('click');
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
      
      {/* 1. TOP STATS & LEVEL HEADER */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
              ⚖️
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Sıfır Denge Merkezi
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Mutlak Değer ve Sıfır Noktasına Olan Uzaklık (MAT.7.1.1)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs">
              ⚡ {score} XP
            </div>
            {onBackToMenu && (
              <button
                type="button"
                onClick={onBackToMenu}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                title="Oyun Menüsüne Dön"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {!isGameCompleted && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500">
              <span>Kademe {levelIndex + 1} / {BALANCE_LEVELS.length}</span>
              <span className="text-emerald-700 font-black">{Math.round(((levelIndex + (isSuccess ? 1 : 0)) / BALANCE_LEVELS.length) * 100)}% Tamamlandı</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${((levelIndex + (isSuccess ? 1 : 0)) / BALANCE_LEVELS.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. GAME OVER / VICTORY VIEW */}
      {isGameCompleted ? (
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-center space-y-6 text-white border-2 border-emerald-500/50 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 text-white flex items-center justify-center text-4xl mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
            ⚖️
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tüm 6 Kademe Başarıyla Tamamlandı!</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Sıfır Denge Merkezi Kusursuz Çalışıyor!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Her tam sayının ve rasyonel sayının 0 başlangıç noktasına olan mesafesine <strong>mutlak değer</strong> denir. Sıfıra eşit mesafedeki zıt işaretli kristallerle enerji şebekesini tam 0 seviyesinde dengelediniz!
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Kazanılan Puan</div>
              <div className="text-xl font-black text-amber-400">+{score + 50} XP</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Kademe Başarısı</div>
              <div className="text-xl font-black text-emerald-400">6 / 6 (100%)</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Kazanılan Rozet</div>
              <div className="text-xs font-black text-indigo-300 mt-1">Enerji Mimarı</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-slate-700 shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tekrar Oyna</span>
            </button>

            {onBackToMenu && (
              <button
                type="button"
                onClick={onBackToMenu}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-lg shadow-emerald-500/25"
              >
                <span>Oyun Menüsüne Dön</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* 3. SCENARIO / TARGET VAULT */}
          <div className="bg-slate-950 rounded-3xl p-5 sm:p-6 text-white border border-slate-800 space-y-4 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>{currentLevel.icon}</span>
                <span>{currentLevel.title}</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Hedef Mesafe: <strong className="text-emerald-400">{currentLevel.targetAbsolute} birim</strong>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {currentLevel.scenario}
            </p>

            {/* Visual Balance Scale SVG */}
            <div className="relative h-44 flex items-center justify-center bg-slate-900/60 rounded-2xl border border-slate-800/80 p-2 overflow-hidden">
              <svg viewBox="0 0 500 160" className="w-full h-full max-w-lg select-none">
                {/* Center Fulcrum / Destek Üçgeni (0 Noktası) */}
                <polygon points="250,90 232,135 268,135" fill="#334155" stroke="#64748b" strokeWidth="2" />
                <circle cx="250" cy="90" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <text x="250" y="152" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle">
                  0 (Sıfır Denge Noktası)
                </text>

                {/* Dynamic Beam (Çubuk): Tilts if not answered, levels at 0deg when balanced! */}
                <g
                  style={{
                    transformOrigin: '250px 90px',
                    transform: isSuccess
                      ? 'rotate(0deg)'
                      : selectedChoice && !selectedChoice.isCorrect
                      ? 'rotate(-10deg)'
                      : currentLevel.leakVal < 0
                      ? 'rotate(-7deg)'
                      : 'rotate(7deg)',
                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  {/* Horizontal Beam Bar */}
                  <rect x="50" y="86" width="400" height="8" rx="4" fill={isSuccess ? '#10b981' : '#475569'} />

                  {/* Left Pan / Weight */}
                  <line x1="85" y1="90" x2="85" y2="45" stroke={isSuccess ? '#10b981' : '#ef4444'} strokeWidth="2.5" />
                  <rect x="40" y="15" width="90" height="38" rx="10" fill="#1e293b" stroke={isSuccess ? '#10b981' : '#f43f5e'} strokeWidth="2" />
                  <text x="85" y="32" fill="#fda4af" fontSize="11" fontWeight="900" textAnchor="middle">
                    {currentLevel.leakDisplay.split(' ')[0]}
                  </text>
                  <text x="85" y="46" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
                    |{currentLevel.leakVal}| = {currentLevel.targetAbsolute} br
                  </text>

                  {/* Right Pan / Slot */}
                  <line x1="415" y1="90" x2="415" y2="45" stroke={isSuccess ? '#10b981' : '#38bdf8'} strokeWidth="2.5" />
                  <rect
                    x="370"
                    y="15"
                    width="90"
                    height="38"
                    rx="10"
                    fill={isSuccess ? '#064e3b' : '#0f172a'}
                    stroke={isSuccess ? '#10b981' : '#38bdf8'}
                    strokeWidth="2"
                    strokeDasharray={isSuccess ? 'none' : '4,2'}
                  />
                  <text x="415" y="32" fill={isSuccess ? '#6ee7b7' : '#38bdf8'} fontSize="11" fontWeight="900" textAnchor="middle">
                    {selectedChoice ? selectedChoice.text.split(' ')[0] : '? Denge'}
                  </text>
                  <text x="415" y="46" fill={isSuccess ? '#a7f3d0' : '#64748b'} fontSize="9" fontWeight="bold" textAnchor="middle">
                    {isSuccess ? `|${selectedChoice?.val}| = ${currentLevel.targetAbsolute} br ✓` : 'Kristal Seç'}
                  </text>
                </g>

                {/* Equilibrium Aura when balanced */}
                {isSuccess && (
                  <text x="250" y="30" fill="#10b981" fontSize="12" fontWeight="900" textAnchor="middle" className="animate-pulse">
                    ⚖️ TAM DENGE SAĞLANDI! ( |-x| = |+x| )
                  </text>
                )}
              </svg>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono text-center">
              Mevcut Sapma: <span className="text-rose-400 font-bold">{currentLevel.leakDisplay}</span> • Sıfıra Olan Mesafe (Mutlak Değer): <span className="text-emerald-400 font-bold">| {currentLevel.leakVal} | = {currentLevel.targetAbsolute} birim</span>
            </div>
          </div>

          {/* 4. CHOICES (3D TACTILE BUTTONS) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-slate-800">
              <span>Sıfır denge noktasına (0) aynı mesafede ({currentLevel.targetAbsolute} birim) olan kristali seçiniz:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentLevel.choices.map((c) => {
                const isSelected = selectedChoice?.id === c.id;
                let btnStyle =
                  'bg-white hover:bg-slate-50 border-slate-200 border-b-slate-300 hover:border-teal-500 hover:border-b-teal-600 text-slate-800 shadow-xs hover:shadow-md';

                if (isSelected) {
                  if (c.isCorrect) {
                    btnStyle =
                      'bg-emerald-500 text-white border-emerald-600 border-b-emerald-700 shadow-lg shadow-emerald-500/25 scale-[1.02] ring-4 ring-emerald-300/50';
                  } else {
                    btnStyle =
                      'bg-rose-500 text-white border-rose-600 border-b-rose-700 shadow-lg shadow-rose-500/25 animate-shake';
                  }
                } else if (isSuccess && c.isCorrect) {
                  btnStyle =
                    'bg-emerald-50 border-emerald-400 border-b-emerald-500 text-emerald-950 font-black';
                }

                return (
                  <button
                    key={c.id}
                    type="button"
                    disabled={isSuccess}
                    onClick={() => handleSelectChoice(c)}
                    className={`group relative p-4 rounded-2xl border-2 border-b-4 transition-all duration-150 flex items-center justify-between gap-3 text-left cursor-pointer active:translate-y-1 active:border-b-2 select-none outline-none ${btnStyle}`}
                  >
                    <div>
                      <div className="font-black text-base tracking-tight font-mono">{c.text}</div>
                      {c.sublabel && (
                        <div
                          className={`text-xs mt-0.5 font-medium ${
                            isSelected ? 'text-white/90' : 'text-slate-500'
                          }`}
                        >
                          {c.sublabel}
                        </div>
                      )}
                    </div>

                    <div
                      className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-2xs ${
                        isSelected && c.isCorrect
                          ? 'bg-white text-emerald-900 shadow-sm'
                          : isSelected && !c.isCorrect
                          ? 'bg-white text-rose-900 shadow-sm'
                          : 'bg-slate-100 group-hover:bg-teal-600 text-slate-600 group-hover:text-white border border-slate-200 group-hover:border-teal-600'
                      }`}
                    >
                      {isSelected && c.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Dengeli ✓</span>
                        </>
                      ) : isSelected && !c.isCorrect ? (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Dengesiz ✕</span>
                        </>
                      ) : (
                        <span>👆 Seç</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. FEEDBACK BANNER & NEXT ACTION */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in ${
                isSuccess
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-2 text-xs sm:text-sm font-bold leading-relaxed">
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
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95 shadow-md"
                >
                  <span>{levelIndex + 1 === BALANCE_LEVELS.length ? 'Sonuçları Gör 🏆' : 'Sıradaki Kademe'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
}
