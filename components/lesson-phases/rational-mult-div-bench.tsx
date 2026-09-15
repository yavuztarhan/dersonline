'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Award,
  Layers,
  Zap,
  Sliders,
  Rocket,
  Compass,
  Check,
  Info,
  Grid,
  Crosshair,
  RefreshCw,
  Cpu,
  ChevronRight
} from 'lucide-react';
import { MathFraction, MathText } from '@/components/ui/math-fraction';

interface RationalMultDivBenchProps {
  onComplete?: () => void;
  onNextPhase?: () => void;
}

// Helper: GCD & LCM
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
    b = b % a;
  }
  return a || 1;
}

export function RationalMultDivBench({ onComplete, onNextPhase }: RationalMultDivBenchProps) {
  const { playSound, addPoints, unlockBadge } = useApp();

  // Active Lab Sub-tab: 'multiplication' | 'division' | 'challenges'
  const [activeTab, setActiveTab] = useState<'multiplication' | 'division' | 'challenges'>('multiplication');

  // MULTIPLICATION STATE
  const [multNum1, setMultNum1] = useState<number>(2);
  const [multDen1, setMultDen1] = useState<number>(3);
  const [multNum2, setMultNum2] = useState<number>(3);
  const [multDen2, setMultDen2] = useState<number>(4);
  const [enableCrossCancel, setEnableCrossCancel] = useState<boolean>(true);

  // DIVISION STATE
  const [divNum1, setDivNum1] = useState<number>(3);
  const [divDen1, setDivDen1] = useState<number>(4);
  const [divNum2, setDivNum2] = useState<number>(1);
  const [divDen2, setDivDen2] = useState<number>(8);
  const [divisionStep, setDivisionStep] = useState<number>(3); // 1: write, 2: flip, 3: multiply

  // CHALLENGE STATE
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [challengeAnswers, setChallengeAnswers] = useState<{ [key: number]: string }>({});
  const [challengeCompleted, setChallengeCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // MULTIPLICATION COMPUTATIONS
  const multProductRawNum = multNum1 * multNum2;
  const multProductRawDen = multDen1 * multDen2;

  const multGcdVal = useMemo(
    () => gcd(multProductRawNum, multProductRawDen),
    [multProductRawNum, multProductRawDen]
  );

  const multSimplifiedNum = multProductRawNum / multGcdVal;
  const multSimplifiedDen = multProductRawDen / multGcdVal;

  // Cross Cancel factors
  const crossGcd1 = useMemo(() => gcd(multNum1, multDen2), [multNum1, multDen2]);
  const crossGcd2 = useMemo(() => gcd(multNum2, multDen1), [multNum2, multDen1]);

  const cancelledNum1 = multNum1 / crossGcd1;
  const cancelledDen2 = multDen2 / crossGcd1;
  const cancelledNum2 = multNum2 / crossGcd2;
  const cancelledDen1 = multDen1 / crossGcd2;

  // DIVISION COMPUTATIONS
  const divInvertedNum2 = divDen2;
  const divInvertedDen2 = divNum2;

  const divProductRawNum = divNum1 * divInvertedNum2;
  const divProductRawDen = divDen1 * divInvertedDen2;

  const divGcdVal = useMemo(
    () => gcd(divProductRawNum, divProductRawDen),
    [divProductRawNum, divProductRawDen]
  );

  const divSimplifiedNum = divProductRawNum / divGcdVal;
  const divSimplifiedDen = divProductRawDen / divGcdVal;

  // CHALLENGES DATA
  const CHALLENGES = [
    {
      id: 1,
      title: 'Görev 1: CubeSat Güneş Paneli Alanı',
      problem: '(2/3) × (3/4)',
      type: 'mult',
      options: [
        { label: '1/2', isCorrect: true, explanation: '2/3 x 3/4 = (2x3)/(3x4) = 6/12 = 1/2 cm².' },
        { label: '5/7', isCorrect: false, explanation: 'Hata! Pay ve paydalar toplanmaz, karşılıklı çarpılır.' },
        { label: '6/7', isCorrect: false, explanation: 'Paydalar toplanmaz, çarpılır: 3x4 = 12.' }
      ]
    },
    {
      id: 2,
      title: 'Görev 2: Çapraz Lazerle Süper Sadeleştirme',
      problem: '(15/28) × (14/25)',
      type: 'mult',
      options: [
        { label: '3/10', isCorrect: true, explanation: '15 ile 25 5\'e bölünür (3 ve 5), 14 ile 28 14\'e bölünür (1 ve 2). (3/2) x (1/5) = 3/10.' },
        { label: '210/700', isCorrect: false, explanation: 'Doğru değer ancak en sade hali 3/10\'dur.' },
        { label: '1/2', isCorrect: false, explanation: 'Sadeleştirme hatası.' }
      ]
    },
    {
      id: 3,
      title: 'Görev 3: İyon İtki Motoru Manevra Sayısı',
      problem: '(3/4) ÷ (1/8)',
      type: 'div',
      options: [
        { label: '6 tam', isCorrect: true, explanation: '(3/4) ÷ (1/8) = (3/4) x (8/1) = 24/4 = 6 tam manevra.' },
        { label: '3/32', isCorrect: false, explanation: 'Hata! 2. kesir ters çevrilmeden çarpıldı.' },
        { label: '1/6', isCorrect: false, explanation: '1. kesir değil, 2. kesir ters çevrilmelidir.' }
      ]
    },
    {
      id: 4,
      title: 'Görev 4: Çarpmaya Göre Ters Eleman ile Sıfırlama',
      problem: '(-4/5) × (-5/4)',
      type: 'mult',
      options: [
        { label: '+1', isCorrect: true, explanation: '(-4/5) x (-5/4) = +20/20 = +1 tam (Çarpmaya göre etkisiz eleman).' },
        { label: '-1', isCorrect: false, explanation: 'İşaret hatası! Eksi ile eksinin çarpımı artıdır (+1).' },
        { label: '0', isCorrect: false, explanation: 'Çarpımları 0 değil, 1\'dir.' }
      ]
    }
  ];

  const handleChallengeOption = (opt: any) => {
    setChallengeAnswers((prev) => ({ ...prev, [challengeIdx]: opt.label }));
    if (opt.isCorrect) {
      playSound('success');
      setScore((prev) => prev + 25);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } else {
      playSound('bell');
    }
  };

  const handleNextChallenge = () => {
    if (challengeIdx < CHALLENGES.length - 1) {
      setChallengeIdx((prev) => prev + 1);
    } else {
      setChallengeCompleted(true);
      playSound('success');
      addPoints(100);
      unlockBadge('rational-mult-master');
      confetti({ particleCount: 100, spread: 80 });
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white space-y-6">
      {/* ATÖLYE BAŞLIĞI VE SEKMELER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase tracking-wider border border-teal-500/30">
                7. Sınıf • MAT.7.1.4 Atölyesi
              </span>
              <span className="text-xs text-slate-400 font-bold">Kuantum Robotik & Çarpım-Bölme</span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">Rasyonel Sayılarla Çarpma & Bölme Laboratuvarı</h3>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('multiplication');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'multiplication'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Alan Modeli (Çarpma)</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setActiveTab('division');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'division'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Roket İtkisi (Bölme)</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setActiveTab('challenges');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'challenges'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Mühendislik Görevleri</span>
          </button>
        </div>
      </div>

      {/* 1. SEKME: ALAN MODELİ VE ÇARPMA SİMÜLATÖRÜ */}
      {activeTab === 'multiplication' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Fraction Controls */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-indigo-500" />
                  1. Rasyonel Sayı (Satır Dilimi)
                </span>
                <MathFraction numerator={multNum1} denominator={multDen1} className="text-base font-black text-indigo-300" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Pay: {multNum1}</span>
                  <input
                    type="range"
                    min={-6}
                    max={6}
                    value={multNum1}
                    onChange={(e) => setMultNum1(parseInt(e.target.value) || 1)}
                    className="w-36 accent-indigo-500 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Payda: {multDen1}</span>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={multDen1}
                    onChange={(e) => setMultDen1(parseInt(e.target.value) || 1)}
                    className="w-36 accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 2. Fraction Controls */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-purple-500" />
                  2. Rasyonel Sayı (Sütun Dilimi)
                </span>
                <MathFraction numerator={multNum2} denominator={multDen2} className="text-base font-black text-purple-300" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Pay: {multNum2}</span>
                  <input
                    type="range"
                    min={-6}
                    max={6}
                    value={multNum2}
                    onChange={(e) => setMultNum2(parseInt(e.target.value) || 1)}
                    className="w-36 accent-purple-500 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Payda: {multDen2}</span>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={multDen2}
                    onChange={(e) => setMultDen2(parseInt(e.target.value) || 1)}
                    className="w-36 accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400">Hızlı Deney Şablonları:</span>
            {[
              { label: '(2/3) × (3/4)', n1: 2, d1: 3, n2: 3, d2: 4 },
              { label: '(-3/5) × (2/3)', n1: -3, d1: 5, n2: 2, d2: 3 },
              { label: '(4/5) × (5/6)', n1: 4, d1: 5, n2: 5, d2: 6 },
              { label: '(-4/7) × (-7/4)', n1: -4, d1: 7, n2: -7, d2: 4 }
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  playSound('click');
                  setMultNum1(p.n1);
                  setMultDen1(p.d1);
                  setMultNum2(p.n2);
                  setMultDen2(p.d2);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              >
                <MathText text={p.label} />
              </button>
            ))}
          </div>

          {/* Interactive Visual Area Grid & Mathematics Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/80 p-6 rounded-3xl border border-slate-800 items-center">
            {/* 2D Area Matrix */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <span className="text-xs font-black text-teal-400 uppercase tracking-wider">
                Geometrik Alan Modeli ({multDen1} Satır × {multDen2} Sütun = {multDen1 * multDen2} Bölge)
              </span>

              <div
                className="grid gap-1.5 p-3 bg-slate-900 rounded-2xl border-2 border-teal-500/40 shadow-2xl"
                style={{
                  gridTemplateRows: `repeat(${multDen1}, minmax(0, 1fr))`,
                  gridTemplateColumns: `repeat(${multDen2}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: multDen1 }).map((_, rIdx) =>
                  Array.from({ length: multDen2 }).map((_, cIdx) => {
                    const inRow = rIdx < Math.abs(multNum1);
                    const inCol = cIdx < Math.abs(multNum2);
                    const isOverlap = inRow && inCol;

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg transition-all duration-300 flex items-center justify-center font-bold text-xs ${
                          isOverlap
                            ? 'bg-gradient-to-br from-teal-400 to-emerald-500 text-slate-950 ring-2 ring-teal-300 shadow-md shadow-teal-500/30 scale-105 font-black'
                            : inRow
                            ? 'bg-indigo-600/40 border border-indigo-400/40 text-indigo-300'
                            : inCol
                            ? 'bg-purple-600/40 border border-purple-400/40 text-purple-300'
                            : 'bg-slate-800/40 border border-slate-700/50 text-slate-600'
                        }`}
                      >
                        {isOverlap ? '⚡' : ''}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-indigo-500" /> <MathFraction numerator={Math.abs(multNum1)} denominator={multDen1} /> Satır</span>
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-purple-500" /> <MathFraction numerator={Math.abs(multNum2)} denominator={multDen2} /> Sütun</span>
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-teal-400" /> Kesişen Alan</span>
              </div>
            </div>

            {/* Step-by-Step Calculation Engine */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">İşlem Adımları</span>
                  <label className="flex items-center gap-1.5 text-xs text-teal-400 font-bold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={enableCrossCancel}
                      onChange={(e) => setEnableCrossCancel(e.target.checked)}
                      className="w-4 h-4 rounded text-teal-600"
                    />
                    <span>Çapraz Sadeleştirmeyi Göster</span>
                  </label>
                </div>

                {/* Formula Display */}
                <div className="flex items-center justify-around text-center p-3 bg-slate-950 rounded-xl border border-slate-800 font-serif">
                  <div className="px-2.5 py-1 bg-indigo-950/60 rounded-xl border border-indigo-500/30">
                    <MathFraction numerator={multNum1} denominator={multDen1} className="text-xl font-bold text-indigo-400" />
                  </div>

                  <div className="text-2xl font-bold text-slate-400">×</div>

                  <div className="px-2.5 py-1 bg-purple-950/60 rounded-xl border border-purple-500/30">
                    <MathFraction numerator={multNum2} denominator={multDen2} className="text-xl font-bold text-purple-400" />
                  </div>

                  <div className="text-2xl font-bold text-teal-400">=</div>

                  <div className="px-2.5 py-1 bg-slate-900 rounded-xl border border-slate-700">
                    <MathFraction numerator={`(${multNum1} × ${multNum2})`} denominator={`(${multDen1} × ${multDen2})`} className="text-lg font-bold text-slate-300" />
                  </div>

                  <div className="text-2xl font-bold text-emerald-400">=</div>

                  <div className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/50 rounded-xl shadow-md">
                    {multSimplifiedDen === 1 ? (
                      <span className="text-2xl font-bold text-emerald-300">{multSimplifiedNum}</span>
                    ) : (
                      <MathFraction numerator={multSimplifiedNum} denominator={multSimplifiedDen} className="text-2xl font-bold text-emerald-300" />
                    )}
                  </div>
                </div>

                {/* Cross Cancellation Insight */}
                {enableCrossCancel && (crossGcd1 > 1 || crossGcd2 > 1) && (
                  <div className="p-2.5 rounded-xl bg-teal-950/60 border border-teal-500/40 text-xs text-teal-200 flex items-center gap-2 animate-in fade-in">
                    <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>
                      <strong>Çapraz Sadeleştirme Fırsatı:</strong> {crossGcd1 > 1 ? `${multNum1} ile ${multDen2} (${crossGcd1} ile) ` : ''} {crossGcd2 > 1 ? `${multNum2} ile ${multDen1} (${crossGcd2} ile) ` : ''} sadeleşerek doğrudan en sade sonuca ulaştırır!
                    </span>
                  </div>
                )}
              </div>

              {/* Sign Rule & Pedagogical Takeaway */}
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-indigo-400" />
                  <span>İşaret ve Payda Kuralı:</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Rasyonel sayılar çarpılırken paydalar <strong>kesinlikle eşitlenmez</strong>. Aynı işaretlilerin çarpımı pozitif (+), zıt işaretlilerin çarpımı negatiftir (-).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SEKME: ROKET İTKİSİ VE BÖLME SİMÜLATÖRÜ */}
      {activeTab === 'division' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Fraction Controls (Bölünen) */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-teal-500" />
                  1. Rasyonel Sayı (Bölünen)
                </span>
                <MathFraction numerator={divNum1} denominator={divDen1} className="text-base font-black text-teal-300" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Pay: {divNum1}</span>
                  <input
                    type="range"
                    min={-6}
                    max={6}
                    value={divNum1}
                    onChange={(e) => setDivNum1(parseInt(e.target.value) || 1)}
                    className="w-36 accent-teal-500 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Payda: {divDen1}</span>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={divDen1}
                    onChange={(e) => setDivDen1(parseInt(e.target.value) || 1)}
                    className="w-36 accent-teal-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 2. Fraction Controls (Bölen) */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-indigo-500" />
                  2. Rasyonel Sayı (Bölen - Takla Atacak)
                </span>
                <MathFraction numerator={divNum2} denominator={divDen2} className="text-base font-black text-indigo-300" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Pay: {divNum2}</span>
                  <input
                    type="range"
                    min={-6}
                    max={6}
                    value={divNum2 === 0 ? 1 : divNum2}
                    onChange={(e) => setDivNum2(parseInt(e.target.value) || 1)}
                    className="w-36 accent-indigo-500 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Payda: {divDen2}</span>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={divDen2}
                    onChange={(e) => setDivDen2(parseInt(e.target.value) || 1)}
                    className="w-36 accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Division Pipeline Visualizer */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-wider">
                Bölme Dönüşüm Hattı: "1. Aynen Kalır ➔ Bölme Çarpmaya Döner ➔ 2. Ters Çevrilir"
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    onClick={() => setDivisionStep(step)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      divisionStep === step
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Adım {step}
                  </button>
                ))}
              </div>
            </div>

            {/* Animated Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                divisionStep >= 1
                  ? 'bg-slate-900 border-teal-500/50 shadow-lg'
                  : 'bg-slate-900/40 border-slate-800 opacity-50'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold text-teal-400 mb-2">
                  <span>1. Adım: Bölünen Kesir</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-center py-1 font-serif">
                  <MathFraction numerator={divNum1} denominator={divDen1} className="text-2xl font-bold text-teal-300" />
                  <div className="text-[10px] text-slate-400 mt-1 font-sans">Aynen korunur, değiştirilmez.</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                divisionStep >= 2
                  ? 'bg-slate-900 border-amber-500/50 shadow-lg'
                  : 'bg-slate-900/40 border-slate-800 opacity-50'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-2">
                  <span>2. Adım: İşaret Dönüşümü</span>
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div className="text-center py-2 font-mono">
                  <div className="text-2xl font-black text-amber-300">÷ ➔ ×</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-sans">Bölme işareti çarpmaya dönüşür.</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                divisionStep >= 3
                  ? 'bg-slate-900 border-purple-500/50 shadow-lg'
                  : 'bg-slate-900/40 border-slate-800 opacity-50'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold text-purple-400 mb-2">
                  <span>3. Adım: Takla Atan Bölen</span>
                  <Rocket className="w-4 h-4" />
                </div>
                <div className="text-center py-1 font-serif">
                  <MathFraction numerator={divInvertedNum2} denominator={divInvertedDen2} className="text-2xl font-bold text-purple-300" />
                  <div className="text-[10px] text-slate-400 mt-1 font-sans">Çarpmaya göre tersi alındı.</div>
                </div>
              </div>
            </div>

            {/* Final Calculation Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 font-serif">
              <div className="text-base font-bold text-white flex items-center gap-1.5 flex-wrap">
                <span>(</span><MathFraction numerator={divNum1} denominator={divDen1} className="text-lg text-teal-300" /><span>)</span>
                <span className="text-amber-400 font-bold mx-1">÷</span>
                <span>(</span><MathFraction numerator={divNum2} denominator={divDen2} className="text-lg text-indigo-300" /><span>)</span>
                <span className="text-teal-400 font-bold mx-1">=</span>
                <span>(</span><MathFraction numerator={divNum1} denominator={divDen1} className="text-lg text-teal-300" /><span>)</span>
                <span className="text-emerald-400 font-bold mx-1">×</span>
                <span>(</span><MathFraction numerator={divInvertedNum2} denominator={divInvertedDen2} className="text-lg text-purple-300" /><span>)</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-bold font-sans">Net Sonuç:</span>
                <div className="px-4 py-2 bg-emerald-950 border border-emerald-500/50 rounded-2xl text-xl font-bold text-emerald-300 shadow-md">
                  {divSimplifiedDen === 1 ? (
                    <span>{divSimplifiedNum}</span>
                  ) : (
                    <MathFraction numerator={divSimplifiedNum} denominator={divSimplifiedDen} className="text-xl font-bold text-emerald-300" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SEKME: MÜHENDİSLİK GÖREVLERİ (CHALLENGES) */}
      {activeTab === 'challenges' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {!challengeCompleted ? (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-purple-400 uppercase tracking-wider">
                    {CHALLENGES[challengeIdx].title}
                  </span>
                  <h4 className="text-2xl font-black text-white mt-1">
                    <MathText text={`${CHALLENGES[challengeIdx].problem} = ?`} />
                  </h4>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-slate-800 text-purple-300 font-black text-xs">
                  Görev {challengeIdx + 1} / {CHALLENGES.length}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CHALLENGES[challengeIdx].options.map((opt, i) => {
                  const isSelected = challengeAnswers[challengeIdx] === opt.label;
                  return (
                    <button
                      key={i}
                      onClick={() => handleChallengeOption(opt)}
                      disabled={Boolean(challengeAnswers[challengeIdx])}
                      className={`p-4 rounded-2xl border text-center transition-all font-bold flex flex-col items-center justify-center gap-2 cursor-pointer ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                            : 'bg-rose-600/30 border-rose-500 text-rose-200'
                          : challengeAnswers[challengeIdx]
                          ? 'opacity-40 bg-slate-800 border-slate-700 text-slate-400'
                          : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-purple-500 text-white'
                      }`}
                    >
                      <MathText text={opt.label} className="text-2xl font-black" />
                      {isSelected && (
                        opt.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Next */}
              {challengeAnswers[challengeIdx] && (
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                  <p className="text-xs text-slate-300">
                    <MathText text={CHALLENGES[challengeIdx].options.find(o => o.label === challengeAnswers[challengeIdx])?.explanation} />
                  </p>
                  <button
                    onClick={handleNextChallenge}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
                  >
                    <span>{challengeIdx < CHALLENGES.length - 1 ? 'Sonraki Göreve Geç' : 'Atölyeyi Tamamla'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Completed Screen */
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-3xl bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-purple-400 mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-white">Rasyonel Çarpma & Bölme Atölyesi Tamamlandı!</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Toplam <strong>{score} XP</strong> ve <strong>Rasyonel Çarpım Ustası Rozeti</strong> kazandınız. Alan modelleri ve takla atan bölme kurallarını başarıyla deneyimlediniz!
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setChallengeIdx(0);
                    setChallengeAnswers({});
                    setChallengeCompleted(false);
                    setScore(0);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tekrar Dene</span>
                </button>

                {onNextPhase && (
                  <button
                    onClick={() => {
                      playSound('select');
                      onNextPhase();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-teal-600/30"
                  >
                    <span>3. Aşamaya Geç: Oyun Arenası</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
