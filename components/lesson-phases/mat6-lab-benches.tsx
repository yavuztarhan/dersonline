'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Layers,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  Sliders,
  Play,
  Zap,
  Info,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Cpu,
  GitBranch,
  ListTree,
  Share2,
  Check
} from 'lucide-react';

/* ========================================================================= */
/* 1. BÖLÜNEBİLME DEDEKTİFİ VE BASAMAK ANALİZ LABORATUVARI (MAT.6.1.2)       */
/* ========================================================================= */
export function DivisibilityBench() {
  const { playSound, addPoints, unlockBadge } = useApp();

  const [inputNumber, setInputNumber] = useState<number>(48750);
  const [activeTab, setActiveTab] = useState<'rules' | 'proof' | 'missing'>('rules');

  // Missing digit solver state: e.g. 4 A 2 sayısı 3 ile tam bölünecek
  const [missingPrefix, setMissingPrefix] = useState('4');
  const [missingSuffix, setMissingSuffix] = useState('2');
  const [missingRule, setMissingRule] = useState<number>(3);

  const numStr = inputNumber.toString();
  const digits = numStr.split('').map(Number);
  const sumDigits = digits.reduce((a, b) => a + b, 0);
  const lastDigit = digits[digits.length - 1];
  const lastTwoDigits = inputNumber % 100;

  // Divisibility checks
  const isDiv2 = lastDigit % 2 === 0;
  const isDiv3 = sumDigits % 3 === 0;
  const isDiv4 = lastTwoDigits % 4 === 0;
  const isDiv5 = lastDigit === 0 || lastDigit === 5;
  const isDiv6 = isDiv2 && isDiv3;
  const isDiv9 = sumDigits % 9 === 0;
  const isDiv10 = lastDigit === 0;

  const rulesList = [
    { rule: 2, name: '2 ile Bölünebilme', isDiv: isDiv2, rem: inputNumber % 2, reason: `Son basamak (${lastDigit}) ${isDiv2 ? 'çifttir' : 'tektir'}.` },
    { rule: 3, name: '3 ile Bölünebilme', isDiv: isDiv3, rem: inputNumber % 3, reason: `Rakamlar toplamı ${sumDigits} ${isDiv3 ? '3\'ün katıdır' : '3\'ün katı değildir'}.` },
    { rule: 4, name: '4 ile Bölünebilme', isDiv: isDiv4, rem: inputNumber % 4, reason: `Son iki basamak (${lastTwoDigits}) ${isDiv4 ? '4\'ün katıdır' : '4\'ün katı değildir'}.` },
    { rule: 5, name: '5 ile Bölünebilme', isDiv: isDiv5, rem: inputNumber % 5, reason: `Son basamak (${lastDigit}) ${isDiv5 ? '0 veya 5\'tir' : '0 veya 5 değildir'}.` },
    { rule: 6, name: '6 ile Bölünebilme', isDiv: isDiv6, rem: inputNumber % 6, reason: `Sayı ${isDiv2 ? 'çifttir' : 'tek'} ve rakamlar toplamı ${sumDigits} ${isDiv3 ? '3k\'dır' : '3k değildir'}.` },
    { rule: 9, name: '9 ile Bölünebilme', isDiv: isDiv9, rem: inputNumber % 9, reason: `Rakamlar toplamı ${sumDigits} ${isDiv9 ? '9\'un katıdır' : '9\'un katı değildir'}.` },
    { rule: 10, name: '10 ile Bölünebilme', isDiv: isDiv10, rem: inputNumber % 10, reason: `Son basamak ${lastDigit} ${isDiv10 ? '0\'dır' : '0 değildir (kalan ' + (inputNumber % 10) + ')'}.` }
  ];

  // Missing digit calculations
  const possibleDigits = useMemo(() => {
    const res: number[] = [];
    for (let d = 0; d <= 9; d++) {
      const fullNum = parseInt(`${missingPrefix}${d}${missingSuffix}`, 10);
      if (isNaN(fullNum)) continue;
      if (missingRule === 2 && fullNum % 2 === 0) res.push(d);
      if (missingRule === 3 && fullNum % 3 === 0) res.push(d);
      if (missingRule === 4 && fullNum % 4 === 0) res.push(d);
      if (missingRule === 5 && fullNum % 5 === 0) res.push(d);
      if (missingRule === 6 && fullNum % 6 === 0) res.push(d);
      if (missingRule === 9 && fullNum % 9 === 0) res.push(d);
      if (missingRule === 10 && fullNum % 10 === 0) res.push(d);
    }
    return res;
  }, [missingPrefix, missingSuffix, missingRule]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-blue-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-black uppercase tracking-wider mb-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>2. Aşama: Dinamik Bölünebilme Dedektifi (MAT.6.1.2)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Bölünebilme Kriterleri ve Basamak Analiz Laboratuvarı
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Herhangi bir sayının 2, 3, 4, 5, 6, 9 ve 10 ile bölünebilirlik durumunu canlı filtrelerle inceleyin, basamak çözümlemesiyle kural ispatlarını keşfedin.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap bg-slate-900/90 p-2 rounded-2xl border border-blue-400/30">
          <span className="text-[10px] font-bold text-slate-400 px-2">Örnekler:</span>
          {[24, 75, 120, 1536, 6234, 7215, 48750].map((num) => (
            <button
              key={num}
              onClick={() => {
                setInputNumber(num);
                playSound('select');
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                inputNumber === num
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'rules', label: '🔍 Canlı Bölünebilme Lambaları & Kalan', icon: Zap },
          { id: 'proof', label: '📐 3 & 9 Basamak İspat Simülatörü', icon: Layers },
          { id: 'missing', label: '🧩 Bilinmeyen Basamak Dedektifi (A)', icon: Search }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                playSound('select');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-102'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: RULES & LIGHTS */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          {/* Number Input & Live Stats */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                İncelenecek Doğal Sayıyı Giriniz:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={inputNumber}
                  onChange={(e) => setInputNumber(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-2xl sm:text-3xl font-mono font-black text-blue-950 bg-slate-50 border-2 border-blue-200 focus:border-blue-500 rounded-2xl p-3.5 outline-none"
                />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl text-center min-w-[110px]">
                <div className="text-[10px] uppercase font-bold text-blue-700">Rakamlar Toplamı</div>
                <div className="text-xl font-mono font-black text-blue-900">{digits.join('+')} = {sumDigits}</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-center min-w-[110px]">
                <div className="text-[10px] uppercase font-bold text-amber-700">Son Basamak</div>
                <div className="text-xl font-mono font-black text-amber-900">{lastDigit} ({lastDigit % 2 === 0 ? 'Çift' : 'Tek'})</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl text-center min-w-[110px]">
                <div className="text-[10px] uppercase font-bold text-purple-700">Son İki Basamak</div>
                <div className="text-xl font-mono font-black text-purple-900">{lastTwoDigits}</div>
              </div>
            </div>
          </div>

          {/* 7 Divisibility Signal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {rulesList.map((item) => (
              <div
                key={item.rule}
                className={`p-4 rounded-3xl border-2 transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  item.isDiv
                    ? 'bg-emerald-50/80 border-emerald-400 shadow-md ring-1 ring-emerald-400/20'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-800 font-black text-sm flex items-center justify-center shadow-xs">
                    {item.rule}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1 ${
                      item.isDiv
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {item.isDiv ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{item.isDiv ? 'Tam Bölünür' : `Kalan: ${item.rem}`}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-black text-slate-900">{item.name}</div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.reason}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] font-mono font-bold text-slate-500">
                  {inputNumber} = {item.rule} × {Math.floor(inputNumber / item.rule)} + {item.rem}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROOF SIMULATOR (100 = 99 + 1) */}
      {activeTab === 'proof' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900">
              3 ve 9 ile Bölünebilme Kuralının Matematiksel İspatı
            </h3>
            <p className="text-xs text-slate-600">
              Onluk tabandaki basamak çözümlemesinde $10 = 9 + 1$, $100 = 99 + 1$, $1000 = 999 + 1$ şeklinde ayrıldığında 9 ve 99 zaten 3 ve 9'a tam bölünür!
            </p>
          </div>

          {/* Animated Equation Breakdown */}
          <div className="bg-slate-950 text-white p-6 rounded-2xl font-mono text-xs sm:text-sm space-y-3 border border-slate-800">
            <div className="text-amber-400 font-bold">
              Sayımız: {inputNumber} = {digits.map((d, i) => `${d} × 10^${digits.length - 1 - i}`).join(' + ')}
            </div>
            <div className="text-slate-300 leading-relaxed">
              Basamakları (9k + 1) biçiminde ayıralım:
              <br />
              = {digits.map((d, i) => {
                const power = digits.length - 1 - i;
                if (power === 0) return `${d}`;
                const nines = '9'.repeat(power);
                return `${d}×(${nines} + 1)`;
              }).join(' + ')}
            </div>
            <div className="text-cyan-300">
              9'un katlarını paranteze alalım:
              <br />
              = [9'un Katları Olan Kısım] + ({digits.join(' + ')})
            </div>
            <div className="text-emerald-400 font-bold text-sm sm:text-base border-t border-slate-800 pt-2">
              Sonuç: Sayının 9 ve 3'e bölümünden kalan, doğrudan rakamları toplamı olan ({sumDigits}) değerine eşittir!
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MISSING DIGIT SOLVER */}
      {activeTab === 'missing' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900">
              Gizli Rakam Bulucu: Bilinmeyen "A" Rakamını Hesaplayın
            </h3>
            <p className="text-xs text-slate-600">
              Örn: Üç basamaklı <span className="font-mono font-bold text-blue-600">{missingPrefix}A{missingSuffix}</span> sayısı {missingRule} ile kalansız bölünecektir. A yerine gelebilecek rakamları test ediniz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Ön Basamaklar (Örn: 4)</label>
              <input
                type="text"
                value={missingPrefix}
                onChange={(e) => setMissingPrefix(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-slate-200 font-mono font-bold text-lg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Bölünebilme Kuralı</label>
              <select
                value={missingRule}
                onChange={(e) => setMissingRule(Number(e.target.value))}
                className="w-full p-3 rounded-xl border-2 border-slate-200 font-bold text-sm bg-white"
              >
                {[2, 3, 4, 5, 6, 9, 10].map((r) => (
                  <option key={r} value={r}>{r} ile Bölünebilme</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Son Basamaklar (Örn: 2)</label>
              <input
                type="text"
                value={missingSuffix}
                onChange={(e) => setMissingSuffix(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-slate-200 font-mono font-bold text-lg"
              />
            </div>
          </div>

          {/* Possible Values Display */}
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl space-y-3">
            <div className="text-xs font-black text-blue-900 uppercase tracking-wider">
              A Yerine Gelebilecek Rakamlar ({possibleDigits.length} Adet):
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {possibleDigits.length > 0 ? (
                possibleDigits.map((d) => (
                  <span
                    key={d}
                    className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-black text-base flex items-center justify-center shadow-sm"
                  >
                    {d}
                  </span>
                ))
              ) : (
                <span className="text-xs text-rose-600 font-bold">Uygun rakam bulunamadı!</span>
              )}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Oluşan geçerli sayılar: {possibleDigits.map((d) => `${missingPrefix}${d}${missingSuffix}`).join(', ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 2. ERATOSTHENES KALBURU VE ASAL ÇARPAN LABORATUVARI (MAT.6.1.3)          */
/* ========================================================================= */
export function PrimeFactorsBench() {
  const { playSound, addPoints } = useApp();

  const [activeTab, setActiveTab] = useState<'sieve' | 'tree' | 'algorithm'>('sieve');
  const [sieveCrossed, setSieveCrossed] = useState<Set<number>>(new Set([1]));
  const [activePrimeFilter, setActivePrimeFilter] = useState<number | null>(null);

  // TREE & ALGORITHM NUMBER
  const [primeTargetNumber, setPrimeTargetNumber] = useState<number>(72);

  // Prime check helper
  const isPrime = (n: number) => {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) return false;
    }
    return true;
  };

  // Sieve Step Click
  const handleSieveFilter = (p: number) => {
    playSound('select');
    setActivePrimeFilter(p);
    setSieveCrossed((prev) => {
      const next = new Set(prev);
      for (let i = p * 2; i <= 100; i += p) {
        next.add(i);
      }
      return next;
    });
  };

  const handleResetSieve = () => {
    playSound('clear');
    setSieveCrossed(new Set([1]));
    setActivePrimeFilter(null);
  };

  // Algorithm Division Steps
  const algorithmSteps = useMemo(() => {
    let n = primeTargetNumber;
    const steps: Array<{ current: number; divisor: number }> = [];
    let d = 2;
    while (n > 1) {
      if (n % d === 0) {
        steps.push({ current: n, divisor: d });
        n = n / d;
      } else {
        d++;
      }
    }
    steps.push({ current: 1, divisor: 1 });
    return steps;
  }, [primeTargetNumber]);

  // Prime Factors Exponential Form
  const exponentialForm = useMemo(() => {
    let n = primeTargetNumber;
    const counts: Record<number, number> = {};
    let d = 2;
    while (n > 1) {
      if (n % d === 0) {
        counts[d] = (counts[d] || 0) + 1;
        n = n / d;
      } else {
        d++;
      }
    }
    return Object.entries(counts)
      .map(([base, exp]) => (exp === 1 ? `${base}` : `${base}^${exp}`))
      .join(' · ');
  }, [primeTargetNumber]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 text-white rounded-3xl p-6 border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>2. Aşama: Eratosthenes Kalburu & Asal Çarpan Laboratuvarı (MAT.6.1.3)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Asal Sayılar, Kalbur Eleği ve Çarpan Ağacı Laboratuvarı
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            1-100 arasındaki 25 asal sayıyı eleyerek bulun, bileşik sayıları çarpan ağacı ve bölen listesi algoritmasıyla asal çarpanlarına ayırın.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap bg-slate-900/90 p-2 rounded-2xl border border-amber-400/30">
          <span className="text-[10px] font-bold text-slate-400 px-2">Sayılar:</span>
          {[36, 48, 60, 72, 90, 120, 180].map((num) => (
            <button
              key={num}
              onClick={() => {
                setPrimeTargetNumber(num);
                playSound('select');
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                primeTargetNumber === num
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'sieve', label: '🌾 Eratosthenes Kalburu (1-100 Izgarası)', icon: Filter },
          { id: 'algorithm', label: '⚡ Bölen Listesi Algoritması & Üslü Gösterim', icon: ListTree },
          { id: 'tree', label: '🌳 Asal Çarpan Ağacı Modeli', icon: GitBranch }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                playSound('select');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 scale-102'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SIEVE */}
      {activeTab === 'sieve' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Eratosthenes Kalburu: Adım Adım Asal Sayı Eleme
              </h3>
              <p className="text-xs text-slate-600">
                Sırasıyla 2, 3, 5 ve 7'nin katlarını eleyerek kalan 25 asal sayıyı parlatın.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[2, 3, 5, 7].map((p) => (
                <button
                  key={p}
                  onClick={() => handleSieveFilter(p)}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-black transition-all cursor-pointer"
                >
                  {p}'nin Katlarını Ele ✖
                </button>
              ))}
              <button
                onClick={handleResetSieve}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Sıfırla
              </button>
            </div>
          </div>

          {/* 100 Grid */}
          <div className="grid grid-cols-10 gap-1.5 p-3 bg-slate-900 rounded-2xl border border-slate-800">
            {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => {
              const isEliminated = sieveCrossed.has(n);
              const isPrimeNum = isPrime(n);

              return (
                <div
                  key={n}
                  className={`h-8 sm:h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs transition-all ${
                    n === 1
                      ? 'bg-slate-800 text-slate-500 line-through'
                      : isEliminated
                      ? 'bg-slate-800/80 text-slate-500 line-through opacity-50'
                      : isPrimeNum
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105 ring-2 ring-amber-300'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {n}
                </div>
              );
            })}
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950 font-medium">
            💡 <strong>Keşif:</strong> 1-100 arasında toplam <strong>25 adet</strong> asal sayı vardır. 2 en küçük ve tek çift asaldır!
          </div>
        </div>
      )}

      {/* TAB 2: ALGORITHM */}
      {activeTab === 'algorithm' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Bölen Listesi (Asal Çarpan Algoritması)
              </h3>
              <p className="text-xs text-slate-600">
                Girilen sayıyı en küçük asaldan başlayarak 1'e ulaşana kadar dikey çizgide asal sayılara bölün.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Hedef Sayı:</label>
              <input
                type="number"
                value={primeTargetNumber}
                onChange={(e) => setPrimeTargetNumber(Math.max(2, parseInt(e.target.value) || 2))}
                className="w-24 p-2 rounded-xl border-2 border-amber-300 font-mono font-bold text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Division Ladder Visual */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex justify-center">
              <div className="font-mono text-sm sm:text-base space-y-1">
                {algorithmSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="w-16 text-right font-black text-amber-400">{step.current}</span>
                    <span className="w-0.5 h-6 bg-slate-600" />
                    <span className="w-10 text-left font-black text-cyan-400">
                      {step.current === 1 ? '' : step.divisor}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Results & Exponential Form */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-2xl shadow-md space-y-2">
                <div className="text-xs uppercase font-black tracking-wider text-amber-100">
                  Üslü Çarpım Gösterimi:
                </div>
                <div className="text-2xl font-mono font-black">
                  {primeTargetNumber} = {exponentialForm}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-700 space-y-1">
                <div className="font-bold text-slate-900">Asal Çarpanlar Kümesi:</div>
                <div className="font-mono text-sm text-amber-700 font-black">
                  &#123;{Array.from(new Set(algorithmSteps.filter(s => s.current > 1).map(s => s.divisor))).join(', ')}&#125;
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TREE */}
      {activeTab === 'tree' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 text-center">
          <div>
            <h3 className="text-base font-black text-slate-900">
              {primeTargetNumber} Sayısının Asal Çarpan Ağacı
            </h3>
            <p className="text-xs text-slate-600">
              Dalların ucundaki asal sayılar yaprakları oluşturur; yaprakların çarpımı ana sayıyı verir.
            </p>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-6">
            {/* Root Node */}
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-mono font-black text-xl flex items-center justify-center shadow-lg ring-4 ring-amber-400/40">
              {primeTargetNumber}
            </div>

            {/* Branches preview */}
            <div className="text-xs font-mono text-slate-400">
              Dallar: {primeTargetNumber} = {exponentialForm}
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950 px-4 py-2 rounded-xl border border-emerald-500/40">
              <span>🍃 Asal Yapraklar: {exponentialForm}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 3. ORTAK KAT VE ORTAK BÖLEN LABORATUVARI (MAT.6.1.4)                      */
/* ========================================================================= */
export function CommonMultiplesDivisorsBench() {
  const { playSound } = useApp();

  const [activeTab, setActiveTab] = useState<'divisors' | 'multiples' | 'coprime'>('divisors');

  const [num1, setNum1] = useState<number>(24);
  const [num2, setNum2] = useState<number>(36);

  // Common Divisors calculation
  const divisors1 = useMemo(() => {
    const res: number[] = [];
    for (let i = 1; i <= num1; i++) if (num1 % i === 0) res.push(i);
    return res;
  }, [num1]);

  const divisors2 = useMemo(() => {
    const res: number[] = [];
    for (let i = 1; i <= num2; i++) if (num2 % i === 0) res.push(i);
    return res;
  }, [num2]);

  const commonDivisors = useMemo(() => {
    return divisors1.filter((d) => divisors2.includes(d));
  }, [divisors1, divisors2]);

  // Common Multiples calculation
  const multiplesLimit = 120;
  const multiples1 = useMemo(() => {
    const res: number[] = [];
    for (let m = num1; m <= multiplesLimit; m += num1) res.push(m);
    return res;
  }, [num1]);

  const multiples2 = useMemo(() => {
    const res: number[] = [];
    for (let m = num2; m <= multiplesLimit; m += num2) res.push(m);
    return res;
  }, [num2]);

  const commonMultiples = useMemo(() => {
    return multiples1.filter((m) => multiples2.includes(m));
  }, [multiples1, multiples2]);

  const isCoprime = commonDivisors.length === 1 && commonDivisors[0] === 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 border border-teal-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-black uppercase tracking-wider mb-2">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>2. Aşama: Ortak Bölen ve Ortak Kat Laboratuvarı (MAT.6.1.4)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Dinamik Ortak Bölen Izgarası ve Çift Sayı Doğrusu
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            İki sayının ortak bölenlerini Venn şeması ile modelleyin; periyodik sefer saatlerini çift sayı doğrusunda ortak kat bayraklarıyla inceleyin.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap bg-slate-900/90 p-2 rounded-2xl border border-teal-400/30">
          <span className="text-[10px] font-bold text-slate-400 px-2">Çiftler:</span>
          {[
            { n1: 24, n2: 36, label: '24 & 36' },
            { n1: 15, n2: 20, label: '15 & 20' },
            { n1: 12, n2: 18, label: '12 & 18' },
            { n1: 8, n2: 15, label: '8 & 15 (Asal)' }
          ].map((pair) => (
            <button
              key={pair.label}
              onClick={() => {
                setNum1(pair.n1);
                setNum2(pair.n2);
                playSound('select');
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                num1 === pair.n1 && num2 === pair.n2
                  ? 'bg-teal-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {pair.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'divisors', label: '📦 Ortak Bölenler & Venn Şeması', icon: Layers },
          { id: 'multiples', label: '⏱️ Çift Sayı Doğrusunda Ortak Katlar', icon: TrendingUp },
          { id: 'coprime', label: '🤝 Aralarında Asallık Dedektörü', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                playSound('select');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-102'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Inputs Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <label className="text-xs font-black uppercase text-slate-600">1. Sayı (A):</label>
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 p-2.5 rounded-xl border-2 border-teal-300 font-mono font-black text-base text-center"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-black uppercase text-slate-600">2. Sayı (B):</label>
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 p-2.5 rounded-xl border-2 border-emerald-300 font-mono font-black text-base text-center"
          />
        </div>
        <div className="text-xs font-bold text-slate-500">
          Aralarında Asal mı?{' '}
          <span className={`px-2 py-0.5 rounded-full font-black ${isCoprime ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
            {isCoprime ? 'Evet (Tek Ortak Bölen: 1)' : 'Hayır'}
          </span>
        </div>
      </div>

      {/* TAB 1: DIVISORS VENN */}
      {activeTab === 'divisors' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900">
              {num1} ve {num2} Sayılarının Ortak Bölenleri (Kesişim Kümesi)
            </h3>
            <p className="text-xs text-slate-600">
              Her iki sayıyı da kalansız bölen paket boyutları mor kesişim kümesinde toplanmıştır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {/* Only A */}
            <div className="bg-teal-50 border border-teal-200 p-5 rounded-2xl space-y-2">
              <div className="text-xs font-black text-teal-800 uppercase">Sadece {num1}'in Bölenleri</div>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {divisors1.filter(d => !divisors2.includes(d)).map(d => (
                  <span key={d} className="px-2.5 py-1 rounded-lg bg-teal-200 text-teal-900 font-mono font-bold text-xs">{d}</span>
                ))}
              </div>
            </div>

            {/* Intersection (COMMON) */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 rounded-2xl shadow-md space-y-2">
              <div className="text-xs font-black uppercase text-indigo-100">ORTAK BÖLENLER ({commonDivisors.length} Adet)</div>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {commonDivisors.map(d => (
                  <span key={d} className="px-3 py-1 rounded-xl bg-white text-indigo-950 font-mono font-black text-sm shadow-xs">{d}</span>
                ))}
              </div>
              <div className="text-[11px] text-indigo-100 font-bold mt-1">
                En Büyük Ortak Bölen = {Math.max(...commonDivisors)}
              </div>
            </div>

            {/* Only B */}
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-2">
              <div className="text-xs font-black text-emerald-800 uppercase">Sadece {num2}'nin Bölenleri</div>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {divisors2.filter(d => !divisors1.includes(d)).map(d => (
                  <span key={d} className="px-2.5 py-1 rounded-lg bg-emerald-200 text-emerald-900 font-mono font-bold text-xs">{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MULTIPLES NUMBER LINE */}
      {activeTab === 'multiples' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Çift Sayı Doğrusunda Ortak Katlar ({num1} & {num2})
            </h3>
            <p className="text-xs text-slate-600">
              Her iki servis aracının aynı dakikalara denk gelen ortak durakları parlamaktadır.
            </p>
          </div>

          {/* Number Lines Visual */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-white space-y-6">
            {/* Line 1 */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-teal-400">1. Servis ({num1} dk arayla):</div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                {multiples1.map(m => (
                  <span
                    key={m}
                    className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold shrink-0 ${
                      commonMultiples.includes(m)
                        ? 'bg-purple-500 text-white ring-2 ring-purple-300 font-black scale-105'
                        : 'bg-teal-900/80 text-teal-200'
                    }`}
                  >
                    {m} dk
                  </span>
                ))}
              </div>
            </div>

            {/* Line 2 */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-emerald-400">2. Servis ({num2} dk arayla):</div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                {multiples2.map(m => (
                  <span
                    key={m}
                    className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold shrink-0 ${
                      commonMultiples.includes(m)
                        ? 'bg-purple-500 text-white ring-2 ring-purple-300 font-black scale-105'
                        : 'bg-emerald-900/80 text-emerald-200'
                    }`}
                  >
                    {m} dk
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl text-xs text-purple-950 space-y-1 font-medium">
            <div className="font-bold">✨ Ortak Sefer Dakikaları (Ortak Katlar):</div>
            <div className="font-mono text-sm font-black text-purple-800">
              {commonMultiples.join(' dk, ')} dk...
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COPRIME */}
      {activeTab === 'coprime' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
            {isCoprime ? '🤝' : '🔢'}
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-black text-slate-900">
              {num1} ve {num2} {isCoprime ? 'Aralarında Asaldır!' : 'Aralarında Asal Değildir!'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isCoprime
                ? `Çünkü ${num1} ve ${num2} sayılarının 1'den başka hiçbir ortak pozitif böleni yoktur!`
                : `Çünkü ortak bölenleri {${commonDivisors.join(', ')}} kümesidir (1'den farklı ortak bölenleri vardır).`}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-700 max-w-lg mx-auto text-left space-y-1.5 font-medium">
            <div className="font-bold text-slate-900">Önemli Kurallar:</div>
            <div>• Ardışık sayılar (örn: 14 ve 15) DAİMA aralarında asaldır.</div>
            <div>• Sayıların kendilerinin asal olması gerekmez (örn: 8 ve 9).</div>
          </div>
        </div>
      )}
    </div>
  );
}
