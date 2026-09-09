'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Grid,
  Sparkles,
  Layers,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  Sliders,
  Play,
  Zap,
  Info
} from 'lucide-react';

export function FactorsMultiplesBench() {
  const { playSound, addPoints, unlockBadge } = useApp();

  const [activeTab, setActiveTab] = useState<'area' | 'rainbow' | 'numberline'>('area');

  // AREA MODEL BENCH STATE
  const [targetNumber, setTargetNumber] = useState<number>(24);
  const [columnCount, setColumnCount] = useState<number>(4);
  const [discoveredPairs, setDiscoveredPairs] = useState<Array<{ w: number; h: number }>>([
    { w: 4, h: 6 }
  ]);

  // RAINBOW SIMULATOR STATE
  const [rainbowTarget, setRainbowTarget] = useState<number>(24);
  const [selectedArcIndex, setSelectedArcIndex] = useState<number | null>(null);

  // NUMBER LINE BENCH STATE
  const [jumpStep1, setJumpStep1] = useState<number>(6);
  const [jumpStep2, setJumpStep2] = useState<number>(8);
  const [showMultiples2, setShowMultiples2] = useState<boolean>(false);
  const [maxLineLimit, setMaxLineLimit] = useState<number>(60);

  // Calculate actual factors of a number
  const getFactors = (n: number): number[] => {
    const factors: number[] = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) factors.push(i);
    }
    return factors;
  };

  const getFactorPairs = (n: number): Array<[number, number]> => {
    const pairs: Array<[number, number]> = [];
    for (let i = 1; i * i <= n; i++) {
      if (n % i === 0) {
        pairs.push([i, n / i]);
      }
    }
    return pairs;
  };

  // Area Model Math
  const rowCount = Math.floor(targetNumber / columnCount);
  const remainder = targetNumber % columnCount;
  const isCleanRectangle = remainder === 0;

  const handleTestDimensions = () => {
    playSound('select');
    if (isCleanRectangle) {
      playSound('success');
      const w = columnCount;
      const h = rowCount;
      const exists = discoveredPairs.some(
        (p) => (p.w === w && p.h === h) || (p.w === h && p.h === w)
      );
      if (!exists) {
        const next = [...discoveredPairs, { w, h }];
        setDiscoveredPairs(next);
        addPoints(15);
        const totalPossiblePairs = getFactorPairs(targetNumber).length;
        if (next.length === totalPossiblePairs) {
          unlockBadge('maarif-genius');
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch (e) {}
        }
      }
    } else {
      playSound('click');
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-teal-500/40 shadow-2xl space-y-6 select-none">
      
      {/* Top Header & Bench Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-black uppercase tracking-wider">
              2. Aşama: Dijital Dinamik Manipülatif Atölyesi
            </span>
            <span className="text-xs text-slate-400 font-bold">MAT.6.1.1</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>🔬</span>
            <span>DİNAMİK ÇARPAN ALANI VE SAYI IŞINI LABORATUVARI</span>
          </h2>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
          {[
            { id: 'area', label: '1. Dikdörtgensel Alan', icon: '🔲' },
            { id: 'rainbow', label: '2. Çarpan Gökkuşağı', icon: '🌈' },
            { id: 'numberline', label: '3. Zıplayan Sayı Doğrusu', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab(tab.id as any);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DİKDÖRTGENSEL ALAN MODELLEME MASASI (GeoGebra / Mathygon Mantığı)       */}
      {/* ========================================================================= */}
      {activeTab === 'area' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Controls Bar */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {/* Target Number Preset */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400">Hedef Birim Kare Sayısı:</span>
              {[12, 18, 24, 30, 36, 48].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    playSound('select');
                    setTargetNumber(num);
                    setColumnCount(num >= 24 ? 4 : 3);
                    setDiscoveredPairs([]);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    targetNumber === num
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Column Width Slider */}
            <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300">Sütun Genişliği:</span>
              <input
                type="range"
                min={1}
                max={Math.min(targetNumber, 24)}
                value={columnCount}
                onChange={(e) => {
                  playSound('select');
                  setColumnCount(parseInt(e.target.value, 10));
                }}
                className="w-32 accent-teal-400 cursor-pointer"
              />
              <span className="font-mono text-teal-300 font-black text-sm w-6 text-center">
                {columnCount}
              </span>
            </div>
          </div>

          {/* Main Visual Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Canvas: Unit Squares Arrangement */}
            <div className="lg:col-span-8 bg-slate-950 rounded-3xl p-6 border-2 border-slate-800 shadow-inner flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              
              {/* Dynamic Grid Layout */}
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 mb-2">
                  <span>Boyut: {columnCount} (Sütun) × {rowCount} (Tam Satır)</span>
                  {remainder > 0 && <span className="text-rose-400 font-bold">+ {remainder} Artan Kare</span>}
                </div>

                {/* Grid Visual Display */}
                <div className="flex flex-col gap-1 items-center justify-center p-3 bg-slate-900/60 rounded-2xl border border-slate-800 max-h-[280px] overflow-auto">
                  {/* Full Rows */}
                  {Array.from({ length: rowCount }).map((_, rIdx) => (
                    <div key={`row-${rIdx}`} className="flex gap-1">
                      {Array.from({ length: columnCount }).map((_, cIdx) => (
                        <div
                          key={`cell-${rIdx}-${cIdx}`}
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md border flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                            isCleanRectangle
                              ? 'bg-emerald-500/80 border-emerald-400 text-slate-950 shadow-xs'
                              : 'bg-teal-800/60 border-teal-600 text-teal-100'
                          }`}
                        >
                          {rIdx * columnCount + cIdx + 1}
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Remainder Row (if any) */}
                  {remainder > 0 && (
                    <div className="flex gap-1 pt-1">
                      {Array.from({ length: remainder }).map((_, remIdx) => (
                        <div
                          key={`rem-${remIdx}`}
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-md border-2 border-rose-500 bg-rose-500/30 text-rose-300 flex items-center justify-center text-[10px] font-mono font-black animate-pulse"
                        >
                          {rowCount * columnCount + remIdx + 1}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Alert Banner */}
              <div className="mt-4 w-full">
                {isCleanRectangle ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 flex items-center justify-between gap-3 text-xs text-emerald-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        <strong>Kusursuz Dikdörtgen!</strong> {columnCount} × {rowCount} = {targetNumber}. O halde <strong>{columnCount}</strong> ve <strong>{rowCount}</strong> sayıları {targetNumber}'ün çarpanıdır.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleTestDimensions}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-sm active:scale-95"
                    >
                      Listeye Ekle
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/60 flex items-center gap-2 text-xs text-rose-200">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      <strong>Artan {remainder} kare var!</strong> {targetNumber} sayısı {columnCount}'ye kalansız bölünemez ({targetNumber} = {columnCount} × {rowCount} + {remainder}). Dolayısıyla <strong>{columnCount}</strong> bir çarpan (bölen) değildir.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Discovered Factor Pairs & Complete List */}
            <div className="lg:col-span-4 bg-slate-950 rounded-3xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  Bulunan Dikdörtgen Boyutları
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {discoveredPairs.length} / {getFactorPairs(targetNumber).length} Çift
                </span>
              </div>

              {/* Pairs List */}
              <div className="space-y-2 max-h-[160px] overflow-auto">
                {discoveredPairs.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-900 border border-dashed border-slate-700 text-center text-xs text-slate-500">
                    Henüz dikdörtgen boyutu kaydedilmedi. Sütun genişliğini ayarlayıp tam dikdörtgenler oluşturunuz.
                  </div>
                ) : (
                  discoveredPairs.map((pair, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900 border border-teal-500/40 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-slate-300">
                        {idx + 1}. Dikdörtgen:
                      </span>
                      <span className="font-mono font-black text-teal-300">
                        {pair.w} × {pair.h} = {targetNumber}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Full Factor Sequence */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-2">
                <div className="text-[11px] font-black text-slate-300 uppercase">
                  {targetNumber} Sayısının Tüm Çarpanları:
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {getFactors(targetNumber).map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-black font-mono"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ÇARPAN GÖKKUŞAĞI SİMÜLATÖRÜ (Rainbow Multiplier Visualizer)             */}
      {/* ========================================================================= */}
      {activeTab === 'rainbow' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Target Selector */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">İncelenecek Sayı:</span>
              {[20, 24, 28, 36, 40, 48, 60].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    playSound('select');
                    setRainbowTarget(num);
                    setSelectedArcIndex(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    rainbowTarget === num
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <span className="text-xs text-purple-300 font-bold">
              Uçlardaki çarpanların çarpımı daima {rainbowTarget}'i verir!
            </span>
          </div>

          {/* Rainbow SVG Canvas */}
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-10 border-2 border-purple-500/40 shadow-inner flex flex-col items-center">
            {(() => {
              const factors = getFactors(rainbowTarget);
              const n = factors.length;
              const spacing = Math.min(60, 600 / (n + 1));
              const startX = (700 - (n - 1) * spacing) / 2;
              const baseY = 180;

              return (
                <div className="w-full max-w-[700px] overflow-x-auto">
                  <svg viewBox="0 0 700 240" className="w-full h-auto overflow-visible select-none">
                    {/* Rainbow Arcs connecting pairs */}
                    {Array.from({ length: Math.floor(n / 2) }).map((_, i) => {
                      const leftX = startX + i * spacing;
                      const rightX = startX + (n - 1 - i) * spacing;
                      const radius = (rightX - leftX) / 2;
                      const colors = ['#ec4899', '#a855f7', '#6366f1', '#3b82f6', '#10b981', '#f59e0b'];
                      const color = colors[i % colors.length];
                      const isSelected = selectedArcIndex === i;

                      return (
                        <g key={`arc-${i}`} className="cursor-pointer" onClick={() => setSelectedArcIndex(i)}>
                          <path
                            d={`M ${leftX} ${baseY} A ${radius} ${radius * 0.75} 0 0 1 ${rightX} ${baseY}`}
                            fill="none"
                            stroke={color}
                            strokeWidth={isSelected ? 4.5 : 2.5}
                            strokeDasharray={isSelected ? 'none' : 'none'}
                            opacity={selectedArcIndex === null || isSelected ? 1 : 0.3}
                            className="transition-all"
                          />
                          {/* Top Arc Multiplication Tag */}
                          <g transform={`translate(${(leftX + rightX) / 2}, ${baseY - radius * 0.75 - 12})`}>
                            <rect
                              x="-38"
                              y="-10"
                              width="76"
                              height="20"
                              rx="6"
                              fill="#0f172a"
                              stroke={color}
                              strokeWidth={1.5}
                            />
                            <text
                              x="0"
                              y="4"
                              fontSize="10"
                              fontWeight="bold"
                              fill={color}
                              textAnchor="middle"
                              fontFamily="monospace"
                            >
                              {factors[i]} × {factors[n - 1 - i]}
                            </text>
                          </g>
                        </g>
                      );
                    })}

                    {/* Middle Odd Factor (if square number like 36 -> 6x6) */}
                    {n % 2 === 1 && (
                      <g transform={`translate(${startX + Math.floor(n / 2) * spacing}, ${baseY - 45})`}>
                        <circle cx="0" cy="0" r="14" fill="#f59e0b" opacity="0.2" />
                        <text x="0" y="4" fontSize="10" fontWeight="bold" fill="#f59e0b" textAnchor="middle">
                          {factors[Math.floor(n / 2)]}²
                        </text>
                      </g>
                    )}

                    {/* Number Base Dots and Labels */}
                    {factors.map((f, i) => {
                      const cx = startX + i * spacing;
                      const isPair =
                        selectedArcIndex !== null &&
                        (i === selectedArcIndex || i === n - 1 - selectedArcIndex);

                      return (
                        <g key={`dot-${i}`} transform={`translate(${cx}, ${baseY})`}>
                          <circle
                            cx="0"
                            cy="0"
                            r={isPair ? 8 : 6}
                            fill={isPair ? '#ec4899' : '#38bdf8'}
                            stroke="#0f172a"
                            strokeWidth="2"
                          />
                          <text
                            x="0"
                            y="24"
                            fontSize="13"
                            fontWeight="900"
                            fill={isPair ? '#f472b6' : '#f8fafc'}
                            textAnchor="middle"
                            fontFamily="monospace"
                          >
                            {f}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              );
            })()}

            {/* Explanation Note */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 text-center max-w-lg leading-relaxed">
              💡 <strong>Gökkuşağı Kuralı:</strong> Bir doğal sayının tüm çarpanları küçükten büyüğe sıralandığında, en baştaki ile en sondaki, ikinci ile sondan ikinci çarpanların çarpımı daima sayının kendisini verir!
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ZIPLAYAN SAYI DOĞRUSU (Katlar Çizgisi Simülasyonu)                       */}
      {/* ========================================================================= */}
      {activeTab === 'numberline' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Controls Bar */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">1. Sayı Adımı (Zıplama):</span>
              <select
                value={jumpStep1}
                onChange={(e) => setJumpStep1(parseInt(e.target.value, 10))}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-teal-300 font-black text-xs border border-slate-700 outline-none"
              >
                {[3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((s) => (
                  <option key={s} value={s}>{s}&apos;er Zıpla</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                <input
                  type="checkbox"
                  checked={showMultiples2}
                  onChange={(e) => setShowMultiples2(e.target.checked)}
                  className="rounded accent-indigo-500 w-4 h-4 cursor-pointer"
                />
                <span>2. Sayıyı Ekle (Ortak Kat Kesişimi)</span>
              </label>

              {showMultiples2 && (
                <select
                  value={jumpStep2}
                  onChange={(e) => setJumpStep2(parseInt(e.target.value, 10))}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-indigo-300 font-black text-xs border border-slate-700 outline-none"
                >
                  {[3, 4, 5, 6, 8, 9, 10, 12].map((s) => (
                    <option key={s} value={s}>{s}&apos;er Zıpla</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Number Line Visualizer */}
          <div className="bg-slate-950 rounded-3xl p-6 border-2 border-indigo-500/40 shadow-inner space-y-6">
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[720px] p-4 relative">
                {/* Main Axis Line */}
                <div className="h-1 bg-slate-700 rounded-full w-full relative my-12" />

                {/* Number Ticks */}
                <div className="flex justify-between relative -top-14">
                  {Array.from({ length: 13 }).map((_, idx) => {
                    const num = idx * 5;
                    const isMult1 = num > 0 && num % jumpStep1 === 0;
                    const isMult2 = showMultiples2 && num > 0 && num % jumpStep2 === 0;
                    const isCommon = isMult1 && isMult2;

                    return (
                      <div key={idx} className="flex flex-col items-center">
                        {/* Number Dot */}
                        <div
                          className={`w-4 h-4 rounded-full border-2 transition-all ${
                            isCommon
                              ? 'bg-amber-400 border-amber-300 scale-125 shadow-lg shadow-amber-500/40'
                              : isMult1
                              ? 'bg-teal-400 border-teal-300 scale-110'
                              : isMult2
                              ? 'bg-indigo-400 border-indigo-300 scale-110'
                              : 'bg-slate-800 border-slate-600'
                          }`}
                        />
                        {/* Number Label */}
                        <span className={`text-xs font-mono font-bold mt-2 ${
                          isCommon ? 'text-amber-300 font-black' : isMult1 ? 'text-teal-300' : isMult2 ? 'text-indigo-300' : 'text-slate-500'
                        }`}>
                          {num}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Multiples Lists Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-teal-500/30 space-y-1.5">
                <span className="text-[11px] font-black text-teal-400 uppercase">
                  {jumpStep1}&apos;in 60&apos;a Kadar Olan Katları:
                </span>
                <div className="text-xs font-mono font-bold text-slate-200 flex flex-wrap gap-1.5">
                  {Array.from({ length: Math.floor(60 / jumpStep1) }).map((_, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-teal-950 border border-teal-800 text-teal-300">
                      {(i + 1) * jumpStep1}
                    </span>
                  ))}
                </div>
              </div>

              {showMultiples2 && (
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-1.5">
                  <span className="text-[11px] font-black text-indigo-400 uppercase">
                    {jumpStep2}&apos;nin 60&apos;a Kadar Olan Katları:
                  </span>
                  <div className="text-xs font-mono font-bold text-slate-200 flex flex-wrap gap-1.5">
                    {Array.from({ length: Math.floor(60 / jumpStep2) }).map((_, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">
                        {(i + 1) * jumpStep2}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
