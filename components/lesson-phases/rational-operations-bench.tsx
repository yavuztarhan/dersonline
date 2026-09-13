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
  Plus,
  Minus,
  HelpCircle,
  Award,
  Layers,
  Zap,
  Sliders,
  Scale,
  Rocket,
  Compass,
  Check,
  Fuel,
  Info
} from 'lucide-react';
import { MathFraction, MathText } from '@/components/ui/math-fraction';

interface RationalOperationsBenchProps {
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
  }
  return a || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function RationalOperationsBench({ onComplete, onNextPhase }: RationalOperationsBenchProps) {
  const { playSound, addPoints, unlockBadge, selectedOutcome } = useApp();

  // Active Lab Sub-tab: 'tank' | 'vector' | 'challenge'
  const [activeTab, setActiveTab] = useState<'tank' | 'vector' | 'challenge'>('tank');

  // Interactive Fraction State
  const [num1, setNum1] = useState<number>(3);
  const [den1, setDen1] = useState<number>(8);
  const [op, setOp] = useState<'+' | '-'>('+');
  const [num2, setNum2] = useState<number>(1);
  const [den2, setDen2] = useState<number>(4);

  // Common Denominator Calculation
  const commonDen = useMemo(() => lcm(den1, den2), [den1, den2]);
  const mult1 = useMemo(() => commonDen / den1, [commonDen, den1]);
  const mult2 = useMemo(() => commonDen / den2, [commonDen, den2]);

  const expandedNum1 = num1 * mult1;
  const expandedNum2 = num2 * mult2;

  const resultNumRaw = op === '+' ? expandedNum1 + expandedNum2 : expandedNum1 - expandedNum2;
  const resultDenRaw = commonDen;

  // Simplified Result
  const resGcd = useMemo(() => gcd(resultNumRaw, resultDenRaw), [resultNumRaw, resultDenRaw]);
  const simplifiedNum = resultNumRaw / resGcd;
  const simplifiedDen = resultDenRaw / resGcd;

  // Challenge Mode State
  const CHALLENGES = [
    {
      id: 1,
      title: 'Görev 1: Aynı Paydalı Yakıt İkmali',
      f1: { num: 2, den: 7 },
      op: '+' as const,
      f2: { num: 3, den: 7 },
      targetNum: 5,
      targetDen: 7,
      explanation: 'Paydalar eşit (7). Paylar toplanır: 2 + 3 = 5. Sonuç: 5/7.'
    },
    {
      id: 2,
      title: 'Görev 2: Farklı Paydalarda Ortak EKOK',
      f1: { num: 1, den: 3 },
      op: '+' as const,
      f2: { num: 1, den: 6 },
      targetNum: 1,
      targetDen: 2,
      explanation: 'Ortak payda 6: 1/3 = 2/6. 2/6 + 1/6 = 3/6. Sadeleştirilirse 1/2.'
    },
    {
      id: 3,
      title: 'Görev 3: Yakıt Tüketimi (Çıkarma)',
      f1: { num: 5, den: 8 },
      op: '-' as const,
      f2: { num: 1, den: 4 },
      targetNum: 3,
      targetDen: 8,
      explanation: '1/4 kesri 2 ile genişletilir: 2/8. 5/8 - 2/8 = 3/8.'
    },
    {
      id: 4,
      title: 'Görev 4: Zıt İşaretli İtki Dengesi',
      f1: { num: -3, den: 5 },
      op: '+' as const,
      f2: { num: 4, den: 5 },
      targetNum: 1,
      targetDen: 5,
      explanation: 'Paydalar eşit. (-3) + 4 = +1. Sonuç: +1/5.'
    },
    {
      id: 5,
      title: 'Görev 5: Çıkarma İşleminde Eksi Tuzağı',
      f1: { num: 2, den: 3 },
      op: '-' as const,
      f2: { num: -1, den: 6 },
      targetNum: 5,
      targetDen: 6,
      explanation: '2/3 - (-1/6) = 2/3 + 1/6 = 4/6 + 1/6 = 5/6.'
    }
  ];

  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [ansNumInput, setAnsNumInput] = useState<string>('');
  const [ansDenInput, setAnsDenInput] = useState<string>('');
  const [challengeStatus, setChallengeStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [challengePointsEarned, setChallengePointsEarned] = useState(0);

  const curCh = CHALLENGES[currentChallengeIdx];

  const handleCheckChallenge = () => {
    const userN = parseInt(ansNumInput, 10);
    const userD = parseInt(ansDenInput, 10);

    if (isNaN(userN) || isNaN(userD) || userD === 0) {
      playSound('click');
      return;
    }

    // Check equivalence: userN / userD === curCh.targetNum / curCh.targetDen
    const isEquivalent = userN * curCh.targetDen === userD * curCh.targetNum;

    if (isEquivalent) {
      playSound('success');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setChallengeStatus('correct');
      addPoints(25);
      setChallengePointsEarned((p) => p + 25);
    } else {
      playSound('click');
      setChallengeStatus('wrong');
    }
  };

  const handleNextChallenge = () => {
    if (currentChallengeIdx < CHALLENGES.length - 1) {
      setCurrentChallengeIdx((c) => c + 1);
      setAnsNumInput('');
      setAnsDenInput('');
      setChallengeStatus('idle');
    } else {
      // Completed all
      playSound('bell');
      confetti({ particleCount: 120, spread: 80 });
      unlockBadge('mat7-ops-master');
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner & Mode Tabs */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Rocket className="w-3.5 h-3.5 text-indigo-400" />
            <span>MAT.7.1.3 İnteraktif Laboratuvarı</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Gökbey Rasyonel Yakıt Tankı & Vektörel Atölye</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Kesir çubukları, sıvı tankı, ortak payda genişletme paneli ve vektörel sayı doğrusunu kullanarak rasyonel sayılarda toplama ve çıkarma işlemlerini keşfedin.
          </p>
        </div>

        {/* Navigation Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 shrink-0">
          <button
            onClick={() => {
              playSound('select');
              setActiveTab('tank');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tank'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Fuel className="w-4 h-4 text-indigo-300" />
            <span>Sıvı Tankı & Çubuk</span>
          </button>
          <button
            onClick={() => {
              playSound('select');
              setActiveTab('vector');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'vector'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Compass className="w-4 h-4 text-teal-300" />
            <span>Vektörel Sayı Doğrusu</span>
          </button>
          <button
            onClick={() => {
              playSound('select');
              setActiveTab('challenge');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'challenge'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Hızlı Görevler ({CHALLENGES.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FLUID TANK & FRACTION BARS */}
      {activeTab === 'tank' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          {/* Left Controls Column (4 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>İşlem ve Kesir Kontrol Paneli</span>
                </h3>
                <button
                  onClick={() => {
                    playSound('click');
                    setNum1(3);
                    setDen1(8);
                    setOp('+');
                    setNum2(1);
                    setDen2(4);
                  }}
                  className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Sıfırla</span>
                </button>
              </div>

              {/* 1. Kesir Ayarı */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-950">1. Kesir (Tank A)</span>
                  <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-lg border border-indigo-200">
                    {num1}/{den1}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Pay ({num1})</label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setNum1((n) => Math.max(-10, n - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-black text-sm">{num1}</span>
                      <button
                        onClick={() => setNum1((n) => Math.min(10, n + 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Payda ({den1})</label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDen1((d) => Math.max(1, d - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-black text-sm">{den1}</span>
                      <button
                        onClick={() => setDen1((d) => Math.min(12, d + 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* İşlem Seçici (+ / -) */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    playSound('select');
                    setOp('+');
                  }}
                  className={`w-14 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all cursor-pointer ${
                    op === '+'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Toplama İşlemi"
                >
                  +
                </button>
                <button
                  onClick={() => {
                    playSound('select');
                    setOp('-');
                  }}
                  className={`w-14 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all cursor-pointer ${
                    op === '-'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20 scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Çıkarma İşlemi"
                >
                  -
                </button>
              </div>

              {/* 2. Kesir Ayarı */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-teal-950">2. Kesir (Tank B)</span>
                  <span className="text-xs font-bold text-teal-700 bg-white px-2 py-0.5 rounded-lg border border-teal-200">
                    {num2}/{den2}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Pay ({num2})</label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setNum2((n) => Math.max(-10, n - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-black text-sm">{num2}</span>
                      <button
                        onClick={() => setNum2((n) => Math.min(10, n + 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Payda ({den2})</label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDen2((d) => Math.max(1, d - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-black text-sm">{den2}</span>
                      <button
                        onClick={() => setDen2((d) => Math.min(12, d + 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pedagoji Hatırlatıcı Kartı */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3 text-xs">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Maarif Modeli Önemli Kural:</strong>
                <span>
                  Paydalar dilim büyüklüğünü temsil eder; asla doğrudan toplanmaz! Paydalar farklıysa önce ortak kat (EKOK: {commonDen}) ile genişletilir.
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual Simulation Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Genişletme ve Adım Adım Çözüm Kartı */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                1. Adım: Ortak Paydada Eşitleme (EKOK = {commonDen})
              </h4>

              {/* Genişletme Denklemleri */}
              <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-500 mb-1">1. Kesir ({mult1 > 1 ? `${mult1} ile` : 'Aynen'})</div>
                  <div className="inline-flex items-center gap-1 font-black text-base text-indigo-700">
                    <span>{num1}/{den1}</span>
                    {mult1 > 1 && <span className="text-xs text-slate-400">⟶ ({num1}×{mult1})/({den1}×{mult1}) =</span>}
                    <span className="bg-indigo-100 px-2 py-0.5 rounded-lg text-indigo-900">{expandedNum1}/{commonDen}</span>
                  </div>
                </div>

                <div className="text-2xl font-black text-slate-400">{op}</div>

                <div className="text-center">
                  <div className="text-xs font-bold text-slate-500 mb-1">2. Kesir ({mult2 > 1 ? `${mult2} ile` : 'Aynen'})</div>
                  <div className="inline-flex items-center gap-1 font-black text-base text-teal-700">
                    <span>{num2}/{den2}</span>
                    {mult2 > 1 && <span className="text-xs text-slate-400">⟶ ({num2}×{mult2})/({den2}×{mult2}) =</span>}
                    <span className="bg-teal-100 px-2 py-0.5 rounded-lg text-teal-900">{expandedNum2}/{commonDen}</span>
                  </div>
                </div>
              </div>

              {/* Sonuç Gösterge Paneli */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                    İşlem Sonucu
                  </span>
                  <div className="text-lg font-black text-white mt-1">
                    {expandedNum1}/{commonDen} {op} {expandedNum2}/{commonDen} ={' '}
                    <span className="text-amber-300">{resultNumRaw}/{resultDenRaw}</span>
                  </div>
                </div>

                {resGcd > 1 && (
                  <div className="bg-indigo-900/60 px-3.5 py-2 rounded-xl border border-indigo-400/40 text-center">
                    <span className="text-[10px] text-indigo-200 block font-bold">En Sade Hali ({resGcd} ile sadeleşti)</span>
                    <span className="text-base font-black text-emerald-300">
                      {simplifiedNum}/{simplifiedDen}
                    </span>
                  </div>
                )}
              </div>

              {/* 2. Adım: Kesir Çubukları (Fraction Bars) */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  2. Adım: Kesir Çubukları & Alan Bölmeleri
                </h4>

                {/* Çubuk 1 */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>1. Kesir: {expandedNum1}/{commonDen}</span>
                    <span className="text-indigo-600 font-black">{Math.round((expandedNum1 / commonDen) * 100)}%</span>
                  </div>
                  <div className="h-7 w-full bg-slate-100 rounded-xl border border-slate-200 flex overflow-hidden p-0.5">
                    {Array.from({ length: commonDen }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 h-full mx-0.5 rounded-sm transition-all ${
                          idx < expandedNum1 ? 'bg-indigo-500 shadow-xs' : 'bg-slate-200/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Çubuk 2 */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>2. Kesir: {expandedNum2}/{commonDen}</span>
                    <span className="text-teal-600 font-black">{Math.round((expandedNum2 / commonDen) * 100)}%</span>
                  </div>
                  <div className="h-7 w-full bg-slate-100 rounded-xl border border-slate-200 flex overflow-hidden p-0.5">
                    {Array.from({ length: commonDen }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 h-full mx-0.5 rounded-sm transition-all ${
                          idx < expandedNum2 ? 'bg-teal-500 shadow-xs' : 'bg-slate-200/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Net Toplam / Fark Çubuğu */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Net Depo Seviyesi: {resultNumRaw}/{commonDen}</span>
                    <span className="text-amber-600 font-black">{Math.round((resultNumRaw / commonDen) * 100)}%</span>
                  </div>
                  <div className="h-9 w-full bg-slate-100 rounded-xl border-2 border-indigo-300 flex overflow-hidden p-1 shadow-inner">
                    {Array.from({ length: Math.max(commonDen, Math.abs(resultNumRaw)) }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 h-full mx-0.5 rounded-sm transition-all ${
                          idx < resultNumRaw
                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-xs'
                            : 'bg-slate-200/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SIGNED VECTOR NUMBER LINE */}
      {activeTab === 'vector' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Compass className="w-5 h-5 text-teal-600" />
                <span>Vektörel Sayı Doğrusu ve Yönlü Adımlama Modeli</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rasyonel sayılarda toplama ileriye/geriye adım atmaktır. Pozitif oklar sağa (+), negatif oklar sola (-) hareket eder.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                İşlem: {num1}/{den1} {op} {num2}/{den2} = {resultNumRaw}/{commonDen}
              </span>
            </div>
          </div>

          {/* Dynamic Interactive SVG Number Line */}
          <div className="relative w-full h-56 bg-slate-900 rounded-2xl p-4 overflow-hidden flex flex-col justify-center border border-slate-800">
            {/* Axis Center Info */}
            <div className="text-center mb-2">
              <span className="text-xs font-black text-slate-400 tracking-wider">
                SAYI DOĞRUSU ADIMLAMA SİMÜLASYONU
              </span>
            </div>

            {/* SVG Canvas */}
            <svg viewBox="0 0 900 140" className="w-full h-full select-none">
              {/* Main horizontal line */}
              <line x1="50" y1="90" x2="850" y2="90" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
              {/* Arrows at ends */}
              <polygon points="850,85 860,90 850,95" fill="#64748b" />
              <polygon points="50,85 40,90 50,95" fill="#64748b" />

              {/* Major ticks: -2, -1, 0, 1, 2 */}
              {[-2, -1, 0, 1, 2].map((val) => {
                // Map val (-2 to 2) to SVG X (150 to 750)
                const x = 450 + val * 150;
                return (
                  <g key={val}>
                    <line x1={x} y1="80" x2={x} y2="100" stroke={val === 0 ? '#38bdf8' : '#94a3b8'} strokeWidth={val === 0 ? 3 : 2} />
                    <text
                      x={x}
                      y="118"
                      fill={val === 0 ? '#38bdf8' : '#cbd5e1'}
                      fontSize="14"
                      fontWeight={val === 0 ? '900' : 'bold'}
                      textAnchor="middle"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Step 1 Arrow (Blue: 0 to Fraction 1) */}
              {(() => {
                const val1 = expandedNum1 / commonDen;
                const startX = 450;
                const endX = 450 + val1 * 150;
                const isRight = endX >= startX;
                return (
                  <g>
                    <line x1={startX} y1="50" x2={endX} y2="50" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 2" />
                    <polygon
                      points={isRight ? `${endX},45 ${endX + 8},50 ${endX},55` : `${endX},45 ${endX - 8},50 ${endX},55`}
                      fill="#3b82f6"
                    />
                    <text x={(startX + endX) / 2} y="40" fill="#93c5fd" fontSize="12" fontWeight="bold" textAnchor="middle">
                      1. Adım: {num1}/{den1}
                    </text>
                  </g>
                );
              })()}

              {/* Step 2 Arrow (Purple: from end of step 1) */}
              {(() => {
                const val1 = expandedNum1 / commonDen;
                const val2Signed = op === '+' ? expandedNum2 / commonDen : -(expandedNum2 / commonDen);
                const startX = 450 + val1 * 150;
                const endX = startX + val2Signed * 150;
                const isRight = endX >= startX;
                return (
                  <g>
                    <line x1={startX} y1="25" x2={endX} y2="25" stroke="#a855f7" strokeWidth="3" />
                    <polygon
                      points={isRight ? `${endX},20 ${endX + 8},25 ${endX},30` : `${endX},20 ${endX - 8},25 ${endX},30`}
                      fill="#a855f7"
                    />
                    <text x={(startX + endX) / 2} y="16" fill="#d8b4fe" fontSize="12" fontWeight="bold" textAnchor="middle">
                      2. Adım ({op}): {num2}/{den2}
                    </text>
                  </g>
                );
              })()}

              {/* Final Result Green Indicator & Drop Line */}
              {(() => {
                const finalVal = resultNumRaw / commonDen;
                const targetX = 450 + finalVal * 150;
                return (
                  <g>
                    <line x1={targetX} y1="25" x2={targetX} y2="90" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
                    <circle cx={targetX} cy="90" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <text x={targetX} y="138" fill="#34d399" fontSize="13" fontWeight="black" textAnchor="middle">
                      Sonuç: {resultNumRaw}/{commonDen}
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Visual Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span><strong>Mavi Ok:</strong> İlk kesir (0'dan başlar)</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <span><strong>Mor Ok:</strong> İkinci kesir (ekleme/çıkarma)</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span><strong>Yeşil Nokta:</strong> Ulaşılan net rasyonel değer</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CHALLENGE MODE */}
      {activeTab === 'challenge' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-black text-amber-600 uppercase tracking-wider">
                YÖRÜNGE İTKİ GÖREVİ {currentChallengeIdx + 1} / {CHALLENGES.length}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-800 mt-0.5">
                {curCh.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                🏆 Toplam Skor: +{challengePointsEarned} XP
              </span>
            </div>
          </div>

          {/* Question Display Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col items-center justify-center space-y-4">
            <span className="text-xs text-slate-400 font-semibold">Aşağıdaki işlemi çözüp sonucu yazınız:</span>
            
            <div className="flex items-center gap-4 text-2xl sm:text-3xl font-black">
              <div className="bg-indigo-900/60 px-4 py-2 rounded-2xl border border-indigo-400/30">
                {curCh.f1.num}/{curCh.f1.den}
              </div>
              <span className="text-amber-400 text-3xl font-black">{curCh.op}</span>
              <div className="bg-teal-900/60 px-4 py-2 rounded-2xl border border-teal-400/30">
                {curCh.f2.num}/{curCh.f2.den}
              </div>
              <span className="text-slate-400">=</span>
              <span className="text-amber-300">?</span>
            </div>
          </div>

          {/* User Input & Submit */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  value={ansNumInput}
                  onChange={(e) => setAnsNumInput(e.target.value)}
                  placeholder="Pay"
                  disabled={challengeStatus === 'correct'}
                  className="w-24 h-12 text-center text-lg font-black border-2 border-slate-300 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
                <div className="w-20 h-0.5 bg-slate-400 my-1.5" />
                <input
                  type="number"
                  value={ansDenInput}
                  onChange={(e) => setAnsDenInput(e.target.value)}
                  placeholder="Payda"
                  disabled={challengeStatus === 'correct'}
                  className="w-24 h-12 text-center text-lg font-black border-2 border-slate-300 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleCheckChallenge}
                disabled={challengeStatus === 'correct'}
                className="px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                Cevabı Kontrol Et
              </button>
            </div>

            {/* Feedback Message */}
            {challengeStatus === 'correct' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex flex-col items-center gap-2 text-center animate-in zoom-in-95">
                <div className="flex items-center gap-2 font-black text-sm text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Harika! Doğru Yanıt (+25 XP)</span>
                </div>
                <p className="text-xs text-emerald-700">{curCh.explanation}</p>
                <button
                  onClick={handleNextChallenge}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{currentChallengeIdx < CHALLENGES.length - 1 ? 'Sıradaki Göreve Geç' : 'Tüm Görevleri Tamamla 🎉'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {challengeStatus === 'wrong' && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-2 text-xs font-semibold animate-in shake">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Tekrar deneyin! Paydaları ortak bir kata eşitlemeyi unutmayın.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
