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
  const [appliedFilters, setAppliedFilters] = useState<Set<number>>(new Set());

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
    setAppliedFilters((prev) => {
      const next = new Set(prev);
      next.add(p);
      if (next.size === 4) {
        addPoints(20);
      }
      return next;
    });
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
    setAppliedFilters(new Set());
  };

  const sieveButtons = [
    { prime: 2, label: "2'nin Katlarını Ele" },
    { prime: 3, label: "3'ün Katlarını Ele" },
    { prime: 5, label: "5'in Katlarını Ele" },
    { prime: 7, label: "7'nin Katlarını Ele" }
  ];

  const allFiltersApplied = sieveButtons.every((b) => appliedFilters.has(b.prime));

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

  // Step-by-step reveal for Factor Tree (starts from step 0 / first step)
  const [revealedTreeRow, setRevealedTreeRow] = useState<number | null>(0);

  // Factor Tree Generator (MEB Textbook Model)
  const treeData = useMemo(() => {
    const n = Math.max(2, Math.min(999, primeTargetNumber || 2));

    const getSmallestPrimeFactor = (num: number) => {
      for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return i;
      }
      return num;
    };

    const checkIsPrime = (num: number) => num > 1 && getSmallestPrimeFactor(num) === num;

    type RawTreeNode = {
      id: string;
      value: number;
      isPrime: boolean;
      isLeaf: boolean;
      row: number;
      col: number;
      parentId?: string;
      branchType: 'root' | 'left' | 'right' | 'continue';
      childrenIds: string[];
    };

    const rawRows: RawTreeNode[][] = [];

    // Row 0 (Root)
    const rootNode: RawTreeNode = {
      id: 'r0-c0',
      value: n,
      isPrime: checkIsPrime(n),
      isLeaf: checkIsPrime(n),
      row: 0,
      col: 0,
      branchType: 'root',
      childrenIds: []
    };
    rawRows.push([rootNode]);

    if (!rootNode.isPrime) {
      let rowIdx = 0;
      while (rowIdx < 10) {
        const prevRow = rawRows[rowIdx];
        const hasComposite = prevRow.some((node) => !node.isPrime);
        if (!hasComposite) break;

        const nextRow: RawTreeNode[] = [];
        let colIdx = 0;

        for (const parent of prevRow) {
          if (parent.isPrime) {
            const child: RawTreeNode = {
              id: `r${rowIdx + 1}-c${colIdx++}`,
              value: parent.value,
              isPrime: true,
              isLeaf: false,
              row: rowIdx + 1,
              col: nextRow.length,
              parentId: parent.id,
              branchType: 'continue',
              childrenIds: []
            };
            parent.childrenIds.push(child.id);
            nextRow.push(child);
          } else {
            const p = getSmallestPrimeFactor(parent.value);
            const q = Math.floor(parent.value / p);

            const leftChild: RawTreeNode = {
              id: `r${rowIdx + 1}-c${colIdx++}`,
              value: p,
              isPrime: true,
              isLeaf: false,
              row: rowIdx + 1,
              col: nextRow.length,
              parentId: parent.id,
              branchType: 'left',
              childrenIds: []
            };
            parent.childrenIds.push(leftChild.id);
            nextRow.push(leftChild);

            const rightChild: RawTreeNode = {
              id: `r${rowIdx + 1}-c${colIdx++}`,
              value: q,
              isPrime: checkIsPrime(q),
              isLeaf: false,
              row: rowIdx + 1,
              col: nextRow.length,
              parentId: parent.id,
              branchType: 'right',
              childrenIds: []
            };
            parent.childrenIds.push(rightChild.id);
            nextRow.push(rightChild);
          }
        }

        rawRows.push(nextRow);
        rowIdx++;
      }
    }

    // Mark leaves in last row
    const lastRow = rawRows[rawRows.length - 1];
    lastRow.forEach((node) => {
      node.isLeaf = true;
    });

    const numLeaves = lastRow.length;
    const colSpacing = Math.max(56, Math.min(85, 520 / Math.max(1, numLeaves)));
    const totalWidth = Math.max(380, numLeaves * colSpacing + 120);
    const rowHeight = 72;
    const paddingX = 60;
    const paddingY = 45;
    const totalHeight = rawRows.length * rowHeight + paddingY + 30;

    type PlacedNode = RawTreeNode & { x: number; y: number };
    const nodeMap = new Map<string, PlacedNode>();

    // Assign x coordinates to leaves first
    lastRow.forEach((leaf, idx) => {
      let x = totalWidth / 2;
      if (numLeaves > 1) {
        x = paddingX + (idx * (totalWidth - 2 * paddingX)) / (numLeaves - 1);
      }
      const y = paddingY + leaf.row * rowHeight;
      nodeMap.set(leaf.id, { ...leaf, x, y });
    });

    // Assign x coordinates bottom-up
    for (let r = rawRows.length - 2; r >= 0; r--) {
      const row = rawRows[r];
      for (const node of row) {
        let x = totalWidth / 2;
        if (node.childrenIds.length === 1) {
          const childPos = nodeMap.get(node.childrenIds[0]);
          if (childPos) x = childPos.x;
        } else if (node.childrenIds.length === 2) {
          const leftPos = nodeMap.get(node.childrenIds[0]);
          const rightPos = nodeMap.get(node.childrenIds[1]);
          if (leftPos && rightPos) {
            x = (leftPos.x + rightPos.x) / 2;
          }
        }
        const y = paddingY + node.row * rowHeight;
        nodeMap.set(node.id, { ...node, x, y });
      }
    }

    // Generate directed connecting edges
    const edges: Array<{ fromId: string; toId: string; fromRow: number; toRow: number; x1: number; y1: number; x2: number; y2: number }> = [];
    rawRows.forEach((row) => {
      row.forEach((parent) => {
        const parentPos = nodeMap.get(parent.id);
        if (!parentPos) return;
        parent.childrenIds.forEach((childId) => {
          const childPos = nodeMap.get(childId);
          if (!childPos) return;
          edges.push({
            fromId: parent.id,
            toId: childId,
            fromRow: parent.row,
            toRow: childPos.row,
            x1: parentPos.x,
            y1: parentPos.y + 14,
            x2: childPos.x,
            y2: childPos.y - 14
          });
        });
      });
    });

    const allNodes = Array.from(nodeMap.values());
    const rowEquations = rawRows.map((r) => r.map((n) => n.value).join(' · '));
    const finalFactorsList = lastRow.map((n) => n.value);

    return {
      rows: rawRows,
      nodes: allNodes,
      edges,
      width: totalWidth,
      height: totalHeight,
      rowEquations,
      finalFactorsList,
      maxRow: rawRows.length - 1
    };
  }, [primeTargetNumber]);

  const activeTreeStep = revealedTreeRow === null ? treeData.maxRow : Math.min(revealedTreeRow, treeData.maxRow);


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
              {sieveButtons.map(({ prime: p, label }) => {
                const isApplied = appliedFilters.has(p);
                return (
                  <button
                    key={p}
                    onClick={() => handleSieveFilter(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      isApplied
                        ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400 scale-102'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    }`}
                  >
                    <span>{label}</span>
                    <span>{isApplied ? '✓' : '✖'}</span>
                  </button>
                );
              })}
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
              const isOne = n === 1;
              const isEliminated = sieveCrossed.has(n);

              return (
                <div
                  key={n}
                  className={`h-8 sm:h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs transition-all ${
                    isOne
                      ? 'bg-slate-800/80 text-slate-500 line-through opacity-50'
                      : isEliminated
                      ? 'bg-slate-800/80 text-slate-500 line-through opacity-50'
                      : allFiltersApplied
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105 ring-2 ring-amber-300'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {n}
                </div>
              );
            })}
          </div>

          {allFiltersApplied ? (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs text-emerald-950 font-bold flex items-center gap-3 animate-in fade-in duration-300">
              <span className="text-2xl">🎉</span>
              <div>
                <strong>Tebrikler!</strong> 2, 3, 5 ve 7'nin tüm katlarını elediniz. 1-100 arasında kalan <strong>25 sayının tamamı ASAL SAYIDIR</strong> ve altın sarısı ile parlatılmıştır!
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950 font-medium flex items-center justify-between gap-2">
              <div>
                💡 <strong>Görev:</strong> Sırasıyla 2, 3, 5 ve 7 eleme butonlarına basarak asal sayıları keşfedin. Tüm eleme adımları tamamlandığında asal sayılar altın sarısı renkte parlayacaktır!
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-200/80 text-amber-900 font-bold font-mono">
                {appliedFilters.size} / 4 Adım
              </span>
            </div>
          )}
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
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-amber-600" />
                <span>{primeTargetNumber} Sayısının Asal Çarpan Ağacı Modeli</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Bileşik sayılar asal çarpanlarına ayrılır, bulunan asal sayılar ağacın en altındaki kırmızı yapraklara kadar taşınır.
              </p>
            </div>

            {/* Target number and quick presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 pl-2">Sayı:</span>
                <input
                  type="number"
                  value={primeTargetNumber}
                  min={2}
                  max={999}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 2;
                    setPrimeTargetNumber(Math.max(2, Math.min(999, val)));
                    setRevealedTreeRow(0);
                  }}
                  className="w-20 p-1.5 rounded-xl border border-slate-300 font-mono font-black text-sm text-center bg-white"
                />
              </div>

              {/* Step Navigation */}
              <div className="flex items-center gap-1 bg-amber-50 p-1.5 rounded-2xl border border-amber-200">
                <button
                  onClick={() => {
                    playSound('select');
                    setRevealedTreeRow(0);
                  }}
                  disabled={activeTreeStep === 0}
                  className="p-1.5 rounded-xl hover:bg-amber-200 disabled:opacity-40 text-amber-900 font-bold text-xs cursor-pointer"
                  title="İlk Adım"
                >
                  ⏮
                </button>
                <button
                  onClick={() => {
                    playSound('select');
                    setRevealedTreeRow(Math.max(0, activeTreeStep - 1));
                  }}
                  disabled={activeTreeStep === 0}
                  className="px-2 py-1 rounded-xl bg-white hover:bg-amber-100 border border-amber-300 disabled:opacity-40 text-amber-900 font-bold text-xs cursor-pointer"
                >
                  ◀ Geri
                </button>
                <span className="px-2 text-xs font-mono font-bold text-amber-950">
                  Adım {activeTreeStep + 1} / {treeData.rows.length}
                </span>
                <button
                  onClick={() => {
                    playSound('select');
                    setRevealedTreeRow(Math.min(treeData.maxRow, activeTreeStep + 1));
                  }}
                  disabled={activeTreeStep >= treeData.maxRow}
                  className="px-2 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 disabled:opacity-40 font-black text-xs cursor-pointer"
                >
                  İleri ▶
                </button>
                <button
                  onClick={() => {
                    playSound('select');
                    setRevealedTreeRow(null);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs cursor-pointer ml-1"
                >
                  Tüm Ağaç
                </button>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Örnek Sayılar:</span>
            {[24, 36, 48, 60, 72, 84, 90, 108, 120, 144, 180].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setPrimeTargetNumber(num);
                  setRevealedTreeRow(0);
                  playSound('select');
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  primeTargetNumber === num
                    ? 'bg-amber-600 text-white shadow-md scale-105 ring-2 ring-amber-400'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* SVG Factor Tree Canvas */}
          <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-inner overflow-x-auto flex justify-center items-center min-h-[360px]">
            <svg
              viewBox={`0 0 ${treeData.width} ${treeData.height}`}
              className="w-full max-w-2xl h-auto select-none"
              style={{ minWidth: `${Math.min(treeData.width, 360)}px` }}
            >
              <defs>
                <marker
                  id="tree-arrow-marker"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#f59e0b" />
                </marker>
              </defs>

              {/* Connecting Branch Directed Arrows */}
              {treeData.edges
                .filter((e) => e.toRow <= activeTreeStep)
                .map((edge, idx) => (
                  <line
                    key={`edge-${idx}`}
                    x1={edge.x1}
                    y1={edge.y1}
                    x2={edge.x2}
                    y2={edge.y2}
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    markerEnd="url(#tree-arrow-marker)"
                    opacity="0.9"
                  />
                ))}

              {/* Multiplication Dots Between Nodes in Each Row */}
              {treeData.rows.map((row, rIdx) => {
                if (rIdx > activeTreeStep) return null;
                const rowNodes = row
                  .map((rn) => treeData.nodes.find((n) => n.id === rn.id))
                  .filter(Boolean) as typeof treeData.nodes;

                return rowNodes.slice(0, -1).map((leftNode, idx) => {
                  const rightNode = rowNodes[idx + 1];
                  if (!leftNode || !rightNode) return null;
                  const dotX = (leftNode.x + rightNode.x) / 2;
                  const dotY = leftNode.y;
                  return (
                    <text
                      key={`dot-${rIdx}-${idx}`}
                      x={dotX}
                      y={dotY + 4}
                      textAnchor="middle"
                      fontSize="18"
                      fontWeight="900"
                      fill="#64748b"
                    >
                      ·
                    </text>
                  );
                });
              })}

              {/* Tree Nodes */}
              {treeData.nodes
                .filter((node) => node.row <= activeTreeStep)
                .map((node) => {
                  const isBottomLeaf = node.row === activeTreeStep && (node.isLeaf || node.isPrime);
                  const isRoot = node.row === 0;

                  if (isBottomLeaf && (node.isLeaf || activeTreeStep === treeData.maxRow)) {
                    // Final Prime Leaf: Circled in Red/Crimson (MEB Textbook Style)
                    return (
                      <g key={node.id} className="transition-all duration-300">
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="18"
                          fill="#450a0a"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          className="drop-shadow-md"
                        />
                        <text
                          x={node.x}
                          y={node.y + 5}
                          textAnchor="middle"
                          fontSize="15"
                          fontWeight="900"
                          fill="#fecaca"
                          fontFamily="monospace"
                        >
                          {node.value}
                        </text>
                      </g>
                    );
                  }

                  if (isRoot) {
                    // Root Node (72)
                    return (
                      <g key={node.id}>
                        <rect
                          x={node.x - 26}
                          y={node.y - 18}
                          width="52"
                          height="36"
                          rx="12"
                          fill="#f59e0b"
                          stroke="#d97706"
                          strokeWidth="2"
                          className="shadow-lg"
                        />
                        <text
                          x={node.x}
                          y={node.y + 6}
                          textAnchor="middle"
                          fontSize="17"
                          fontWeight="900"
                          fill="#0f172a"
                          fontFamily="monospace"
                        >
                          {node.value}
                        </text>
                      </g>
                    );
                  }

                  // Intermediate Node (2, 36, 18, 9...)
                  return (
                    <g key={node.id}>
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        fontSize="16"
                        fontWeight="800"
                        fill={node.isPrime ? '#38bdf8' : '#f1f5f9'}
                        fontFamily="monospace"
                      >
                        {node.value}
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>

          {/* Step Breakdown & Final Equation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2">
              <div className="text-xs uppercase font-black text-amber-800 tracking-wider">
                {activeTreeStep === treeData.maxRow ? 'Sonuç: Asal Çarpanlar Çarpımı' : `Mevcut Adım (${activeTreeStep + 1}. Satır)`}
              </div>
              <div className="text-xl sm:text-2xl font-mono font-black text-amber-950">
                {primeTargetNumber} = {treeData.rowEquations[activeTreeStep] || primeTargetNumber}
              </div>
              {activeTreeStep === treeData.maxRow && (
                <div className="text-sm font-mono font-bold text-amber-800 pt-1 border-t border-amber-200">
                  Üslü Gösterim: <span className="text-base font-black text-slate-900">{primeTargetNumber} = {exponentialForm}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 text-xs text-slate-700">
              <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Çarpan Ağacı Modeli Kuralları</span>
              </div>
              <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-600">
                <li>Ağacın her satırındaki sayıların çarpımı daima <strong className="text-slate-900">{primeTargetNumber}</strong> sayısını verir.</li>
                <li>Bileşik sayılar asal sayılara bölünerek dallanır.</li>
                <li>Kırmızı halkalı sayılar <strong className="text-rose-700">asal yapraklar</strong>dır ve sayının tüm asal çarpanlarını oluşturur.</li>
              </ul>
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
