'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Info,
  Maximize2,
  Sliders,
  Layers,
  ArrowRight,
  Eye,
  Check,
  Compass,
  Search,
  Sun,
  BatteryCharging,
  Gauge
} from 'lucide-react';

export function RationalNumbersBench() {
  const { playSound, addPoints } = useApp();

  // Active sub-tool tab
  const [activeTab, setActiveTab] = useState<'euler' | 'numberline' | 'lasermeter'>('euler');

  // ==========================================================
  // TAB 1: EULER ŞEMASI & SAYI KÜMELERİ (N ⊂ Z ⊂ Q)
  // ==========================================================
  const PRESET_NUMBERS = [
    { label: '+5', num: 5, den: 1, text: '+5' },
    { label: '-4', num: -4, den: 1, text: '-4' },
    { label: '0', num: 0, den: 1, text: '0' },
    { label: '2/3', num: 2, den: 3, text: '2/3' },
    { label: '-7/4', num: -7, den: 4, text: '-7/4' },
    { label: '0/5', num: 0, den: 5, text: '0/5' },
    { label: '4/0', num: 4, den: 0, text: '4/0' },
    { label: '-18/6', num: -18, den: 6, text: '-18/6' },
    { label: '+5/2', num: 5, den: 2, text: '+5/2' },
    { label: '-3/4', num: -3, den: 4, text: '-3/4' }
  ];

  const [inputNumerator, setInputNumerator] = useState<string>('-4');
  const [inputDenominator, setInputDenominator] = useState<string>('1');
  const [showSecretDenominator, setShowSecretDenominator] = useState<boolean>(false);
  const [testedSetsCount, setTestedSetsCount] = useState<number>(0);

  // Evaluate tested number
  const numVal = parseInt(inputNumerator, 10);
  const denVal = parseInt(inputDenominator, 10);
  const isInvalidInput = isNaN(numVal) || isNaN(denVal);
  const isUndefined = !isInvalidInput && denVal === 0;

  // Simplification & Set membership
  const realVal = !isUndefined && !isInvalidInput ? numVal / denVal : null;
  const isInteger = realVal !== null && Number.isInteger(realVal);
  const isNatural = isInteger && realVal! >= 0;
  const isRational = !isUndefined && !isInvalidInput;

  const handleSelectPreset = (p: { num: number; den: number }) => {
    setInputNumerator(p.num.toString());
    setInputDenominator(p.den.toString());
    setShowSecretDenominator(false);
    playSound('select');
    setTestedSetsCount(prev => prev + 1);
  };

  // ==========================================================
  // TAB 2: DİNAMİK YAKINLAŞTIRMALI SAYI DOĞRUSU
  // ==========================================================
  const [zoomRange, setZoomRange] = useState<{ min: number; max: number; label: string }>({
    min: -1,
    max: 0,
    label: '-1 ile 0 Arası (Klima Tüketimi Odaklı)'
  });
  const [partitionCount, setPartitionCount] = useState<number>(4);
  const [selectedTickIndex, setSelectedTickIndex] = useState<number | null>(1);

  const ZOOM_RANGES = [
    { min: -3, max: -2, label: '-3 ile -2 Arası' },
    { min: -2, max: -1, label: '-2 ile -1 Arası' },
    { min: -1, max: 0, label: '-1 ile 0 Arası' },
    { min: 0, max: 1, label: '0 ile 1 Arası' },
    { min: 1, max: 2, label: '1 ile 2 Arası' },
    { min: 2, max: 3, label: '2 ile 3 Arası' }
  ];

  const selectedFraction = selectedTickIndex !== null ? {
    numerator: zoomRange.min * partitionCount + selectedTickIndex,
    denominator: partitionCount,
    decimal: (zoomRange.min + selectedTickIndex / partitionCount).toFixed(2),
    distanceFromZero: Math.abs(zoomRange.min + selectedTickIndex / partitionCount).toFixed(2)
  } : null;

  // ==========================================================
  // TAB 3: MUTLAK DEĞER LAZER METRESİ
  // ==========================================================
  const [laserVal, setLaserVal] = useState<number>(4);

  return (
    <div className="space-y-6">
      {/* Tab Navigation Header */}
      <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-xs flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('euler');
              playSound('select');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'euler'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Kümeler & Euler Şeması (N ⊂ Z ⊂ Q)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('numberline');
              playSound('select');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'numberline'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>2. Yakınlaştırmalı Sayı Doğrusu</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('lasermeter');
              playSound('select');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'lasermeter'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>3. Mutlak Değer Lazer Metresi</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 px-3 py-1 bg-slate-50 rounded-xl border border-slate-100">
          <Gauge className="w-4 h-4 text-purple-600" />
          <span>Akıllı Ev Enerji Laboratuvarı</span>
        </div>
      </div>

      {/* ========================================================== */}
      {/* TAB 1: EULER ŞEMASI & KÜMELER                              */}
      {/* ========================================================== */}
      {activeTab === 'euler' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls & Number Inspector */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-black text-slate-900">Sayı Girişi ve Analiz</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  İncelemek istediğiniz sayının pay ve paydasını girin veya hazır akıllı ev enerji ölçümlerinden birini seçin:
                </p>

                {/* Preset Chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hızlı Sayı Seçimi:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_NUMBERS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          inputNumerator === p.num.toString() && inputDenominator === p.den.toString()
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Fraction Input */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-center">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pay (a)</label>
                      <input
                        type="number"
                        value={inputNumerator}
                        onChange={(e) => {
                          setInputNumerator(e.target.value);
                          setShowSecretDenominator(false);
                        }}
                        className="w-20 px-3 py-2 text-center text-lg font-black bg-white rounded-xl border-2 border-purple-200 focus:border-purple-600 outline-hidden"
                      />
                    </div>
                    <div className="text-2xl font-black text-slate-400 pt-4">/</div>
                    <div className="text-center">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Payda (b)</label>
                      <input
                        type="number"
                        value={inputDenominator}
                        onChange={(e) => {
                          setInputDenominator(e.target.value);
                          setShowSecretDenominator(false);
                        }}
                        className={`w-20 px-3 py-2 text-center text-lg font-black bg-white rounded-xl border-2 outline-hidden ${
                          inputDenominator === '0'
                            ? 'border-red-500 text-red-600 animate-pulse'
                            : 'border-purple-200 focus:border-purple-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Secret Denominator Reveal Button (For integers) */}
                  {isInteger && denVal === 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowSecretDenominator(!showSecretDenominator);
                        playSound('click');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-purple-700" />
                      <span>{showSecretDenominator ? 'Gizli Paydayı Kapat' : 'Gizli Paydayı Göster (-4 = -4/1)'}</span>
                    </button>
                  )}
                </div>

                {/* Undefined Siren Alert */}
                {isUndefined && (
                  <div className="p-4 bg-red-50 border-2 border-red-500 rounded-2xl text-red-900 space-y-2 animate-pulse">
                    <div className="flex items-center gap-2 font-black text-sm text-red-700">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                      <span>SİSTEM UYARISI: TANIMSIZ!</span>
                    </div>
                    <p className="text-xs text-red-800 leading-relaxed font-medium">
                      Payda <strong>0</strong> olamaz! Bir enerjiyi veya niceliği sıfır eşit parçaya bölemezsiniz. 
                      Bu ifade <strong>rasyonel sayı belirtmez</strong> (b ≠ 0 şartı çiğnendi).
                    </p>
                  </div>
                )}

                {/* Secret Denominator Explanation Box */}
                {showSecretDenominator && isInteger && (
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2 animate-in fade-in">
                    <div className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Gizli Payda & Eşit Temsiller:</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-indigo-100 text-center font-mono font-bold text-sm text-indigo-800">
                      {numVal} = <span className="text-purple-600">{numVal}/1</span> = <span className="text-blue-600">{-numVal}/(-1)</span> = <span className="text-emerald-600">-({-numVal}/1)</span>
                    </div>
                    <p className="text-[11px] text-indigo-700 leading-relaxed">
                      Her tam sayının paydasında görünmeyen bir <strong>1</strong> vardır. Dolayısıyla bütün tam sayılar birer rasyonel sayıdır (Z ⊂ Q).
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Euler Diagram Canvas */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-600" />
                    <h3 className="text-base font-black text-slate-900">Euler Şeması (Kümelerin İçiçeliği)</h3>
                  </div>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
                    N ⊂ Z ⊂ Q
                  </span>
                </div>

                {/* Venn / Euler Diagram Visualization */}
                <div className="relative w-full aspect-16/10 bg-slate-900 rounded-3xl p-4 overflow-hidden flex items-center justify-center select-none shadow-inner border border-slate-800">
                  {/* Outer Set: Q (Rasyonel Sayılar) */}
                  <div className={`relative w-[92%] h-[90%] rounded-full border-2 transition-all duration-500 flex flex-col items-center justify-between p-4 ${
                    isRational
                      ? 'border-purple-500 bg-purple-950/40 shadow-lg shadow-purple-500/20'
                      : 'border-slate-700 bg-slate-900/60'
                  }`}>
                    {/* Q Label */}
                    <div className="w-full flex items-center justify-between px-4 text-purple-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-black">ℚ</span>
                        <span className="text-xs font-bold opacity-80">(Rasyonel Sayılar)</span>
                      </div>
                      <span className="text-[10px] font-mono text-purple-400">a/b, b ≠ 0</span>
                    </div>

                    {/* Middle Set: Z (Tam Sayılar) */}
                    <div className={`relative w-[78%] h-[78%] rounded-full border-2 transition-all duration-500 flex flex-col items-center justify-between p-3 ${
                      isInteger
                        ? 'border-blue-400 bg-blue-950/50 shadow-md shadow-blue-400/20'
                        : 'border-slate-700/60 bg-slate-900/40'
                    }`}>
                      {/* Z Label */}
                      <div className="w-full flex items-center justify-between px-3 text-blue-300">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg font-black">ℤ</span>
                          <span className="text-xs font-bold opacity-80">(Tam Sayılar)</span>
                        </div>
                        <span className="text-[10px] font-mono text-blue-400">... -2, -1, 0, 1, 2 ...</span>
                      </div>

                      {/* Inner Set: N (Doğal Sayılar) */}
                      <div className={`relative w-[65%] h-[68%] rounded-full border-2 transition-all duration-500 flex flex-col items-center justify-center p-2 text-center ${
                        isNatural
                          ? 'border-emerald-400 bg-emerald-950/60 shadow-md shadow-emerald-400/30'
                          : 'border-slate-700/40 bg-slate-900/30'
                      }`}>
                        <div className="flex items-center gap-1.5 text-emerald-300 mb-1">
                          <span className="text-lg font-black">ℕ</span>
                          <span className="text-xs font-bold opacity-80">(Doğal Sayılar)</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 mb-1">0, 1, 2, 3...</span>

                        {/* If current number is Natural, place it here! */}
                        {isNatural && !isUndefined && (
                          <div className="mt-1 px-3 py-1 bg-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-lg animate-bounce">
                            {inputNumerator === '0' && inputDenominator !== '1' ? `${inputNumerator}/${inputDenominator} = 0` : inputNumerator} ∈ ℕ
                          </div>
                        )}
                      </div>

                      {/* If current number is Integer but NOT Natural (Negative Integer), place in Z ring */}
                      {isInteger && !isNatural && !isUndefined && (
                        <div className="absolute top-10 px-3 py-1 bg-blue-400 text-slate-950 font-black text-sm rounded-xl shadow-lg animate-bounce">
                          {denVal !== 1 ? `${numVal}/${denVal} = ${realVal}` : numVal} ∈ ℤ
                        </div>
                      )}
                    </div>

                    {/* If current number is Rational but NOT Integer (Fractions/Decimals), place in Q ring */}
                    {isRational && !isInteger && !isUndefined && (
                      <div className="absolute top-4 right-10 px-3 py-1 bg-purple-400 text-slate-950 font-black text-sm rounded-xl shadow-lg animate-bounce">
                        {inputNumerator}/{inputDenominator} ∈ ℚ
                      </div>
                    )}
                  </div>

                  {/* Undefined overlay marker outside of Q */}
                  {isUndefined && (
                    <div className="absolute inset-0 bg-red-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-2 animate-in zoom-in-95">
                      <div className="w-12 h-12 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center text-red-300">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div className="text-lg font-black text-red-200">
                        {inputNumerator}/{inputDenominator} ∉ ℚ
                      </div>
                      <p className="text-xs text-red-300 max-w-sm">
                        Payda sıfır olduğu için bu ifade hiçbir sayı kümesine ait değildir! Euler evreninin tamamen dışındadır.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Real-time Mathematical Verdict */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Küme Aidiyet Raporu:</span>
                  <div className="text-xs font-bold text-slate-800">
                    {isUndefined ? (
                      <span className="text-red-600">Matematiksel olarak Tanımsız (Hiçbir kümede yer almaz)</span>
                    ) : isNatural ? (
                      <span className="text-emerald-700">Hem Doğal Sayı (ℕ), hem Tam Sayı (ℤ), hem de Rasyonel Sayıdır (ℚ)!</span>
                    ) : isInteger ? (
                      <span className="text-blue-700">Tam Sayı (ℤ) ve Rasyonel Sayıdır (ℚ), fakat Doğal Sayı (ℕ) değildir!</span>
                    ) : (
                      <span className="text-purple-700">Rasyonel Sayıdır (ℚ), fakat Tam Sayı (ℤ) veya Doğal Sayı (ℕ) değildir!</span>
                    )}
                  </div>
                </div>
                {!isUndefined && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`px-2 py-1 rounded-lg text-xs font-black ${isNatural ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-400 line-through'}`}>ℕ</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-black ${isInteger ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-400 line-through'}`}>ℤ</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-black ${isRational ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-400 line-through'}`}>ℚ</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 2: DİNAMİK YAKINLAŞTIRMALI SAYI DOĞRUSU                 */}
      {/* ========================================================== */}
      {activeTab === 'numberline' && (
        <div className="space-y-6">
          {/* Main Controls Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-black text-slate-900">Sonsuz Yakınlaştırmalı Sayı Doğrusu</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  İki ardışık tam sayı arasını seçin, aralığı istediğiniz kadar dilime bölün ve her rasyonel noktanın tam yerini keşfedin!
                </p>
              </div>

              {/* Range Selector Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {ZOOM_RANGES.map((r) => (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => {
                      setZoomRange(r);
                      setSelectedTickIndex(1);
                      playSound('select');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      zoomRange.min === r.min
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/40'
                    }`}
                  >
                    [{r.min}, {r.max}]
                  </button>
                ))}
              </div>
            </div>

            {/* Partition Slider */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-800">
                  Aralık Bölücü (Payda Ayarı): <span className="text-indigo-600 text-sm">{partitionCount} Eşit Parça</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  {zoomRange.min} ile {zoomRange.max} arasındaki mesafe {partitionCount} eşit dilime ayrılıyor.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[2, 3, 4, 5, 6, 8].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      setPartitionCount(count);
                      setSelectedTickIndex(1);
                      playSound('click');
                    }}
                    className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      partitionCount === count
                        ? 'bg-indigo-600 text-white shadow-xs scale-105'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Zoomed SVG Number Line */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative shadow-inner overflow-x-auto">
              <div className="min-w-[600px] h-48 relative flex flex-col justify-center">
                {/* Horizontal Baseline */}
                <div className="w-full h-1 bg-indigo-400/80 rounded-full relative">
                  {/* Left Arrow */}
                  <div className="absolute -left-3 -top-2 text-indigo-400 text-lg font-black">◀</div>
                  {/* Right Arrow */}
                  <div className="absolute -right-3 -top-2 text-indigo-400 text-lg font-black">▶</div>

                  {/* Left Integer Bound */}
                  <div className="absolute left-12 -top-6 flex flex-col items-center">
                    <div className="w-1.5 h-12 bg-white rounded-full"></div>
                    <span className="mt-2 text-xl font-black text-white">{zoomRange.min}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Tam Sayı</span>
                  </div>

                  {/* Right Integer Bound */}
                  <div className="absolute right-12 -top-6 flex flex-col items-center">
                    <div className="w-1.5 h-12 bg-white rounded-full"></div>
                    <span className="mt-2 text-xl font-black text-white">{zoomRange.max}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Tam Sayı</span>
                  </div>

                  {/* Subdivisions / Ticks */}
                  {Array.from({ length: partitionCount - 1 }).map((_, idx) => {
                    const step = idx + 1;
                    const leftPercent = 12 + (step / partitionCount) * 76;
                    const currentFracNum = zoomRange.min * partitionCount + step;
                    const isSelected = selectedTickIndex === step;

                    return (
                      <div
                        key={step}
                        style={{ left: `${leftPercent}%` }}
                        onClick={() => {
                          setSelectedTickIndex(step);
                          playSound('click');
                        }}
                        className={`absolute -top-4 flex flex-col items-center cursor-pointer transition-all duration-200 group ${
                          isSelected ? 'scale-115 z-20' : 'hover:scale-105 z-10'
                        }`}
                      >
                        {/* Tick Mark */}
                        <div className={`w-1 transition-all rounded-full ${
                          isSelected ? 'h-10 bg-amber-400 ring-4 ring-amber-400/30' : 'h-8 bg-indigo-300 group-hover:bg-amber-300'
                        }`} />

                        {/* Fractional Label */}
                        <div className={`mt-3 px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all text-center ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 shadow-lg font-black'
                            : 'bg-slate-800 text-indigo-200 group-hover:bg-slate-700'
                        }`}>
                          {currentFracNum}/{partitionCount}
                        </div>

                        {/* Energy Marker Tag (If relevant) */}
                        {zoomRange.min === -1 && zoomRange.max === 0 && step === 1 && partitionCount === 4 && (
                          <span className="absolute -top-7 text-[9px] font-bold bg-sky-500/90 text-white px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs">
                            ❄️ -1/4 Tüketim
                          </span>
                        )}
                        {zoomRange.min === -1 && zoomRange.max === 0 && step === 3 && partitionCount === 4 && (
                          <span className="absolute -top-7 text-[9px] font-bold bg-rose-500/90 text-white px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs">
                            ❄️ Klima -3/4 kWh
                          </span>
                        )}
                        {zoomRange.min === 2 && zoomRange.max === 3 && step === 1 && partitionCount === 2 && (
                          <span className="absolute -top-7 text-[9px] font-bold bg-amber-500/90 text-white px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs">
                            ☀️ Güneş +5/2 kWh
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected Point Inspection Card */}
            {selectedFraction && (
              <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex flex-col items-center justify-center font-mono font-black text-base shadow-xs">
                    <span>{selectedFraction.numerator}</span>
                    <div className="w-6 h-0.5 bg-white/80 my-0.5"></div>
                    <span>{selectedFraction.denominator}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-indigo-950">
                      Nokta Detayı: {selectedFraction.numerator}/{selectedFraction.denominator}
                    </h4>
                    <p className="text-xs text-indigo-800 mt-0.5">
                      Ondalık Karşılığı: <strong>{selectedFraction.decimal}</strong> | 
                      Sıfıra (0) Uzaklığı: <strong>{selectedFraction.distanceFromZero} birim</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-900 text-xs font-bold">
                    Konum: {zoomRange.min} ile {zoomRange.max} tam sayıları arasında
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 3: MUTLAK DEĞER LAZER METRESİ                           */}
      {/* ========================================================== */}
      {activeTab === 'lasermeter' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-black text-slate-900">Mutlak Değer Lazer Metresi</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Sıfır referans noktasından (0) iki yöne açılan lazer ışınlarıyla mesafeyi ölçün. 
                  Yönler farklı olsa da başlangıç noktasına olan uzaklıkların eşit olduğunu keşfedin!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Mesafe Ayarı:</span>
                {[2, 3, 4, 5, 6].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setLaserVal(val);
                      playSound('click');
                    }}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      laserVal === val
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/50'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Laser Visual Simulation */}
            <div className="bg-slate-950 rounded-3xl p-8 relative overflow-hidden border border-slate-800 text-white">
              {/* Zero Reference Beam Source */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 text-xs font-mono font-bold shadow-inner">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>Sıfır Referans Noktası: Hedef Enerji Dengesi (0 kWh)</span>
                </div>
              </div>

              <div className="relative h-32 flex items-center justify-center">
                {/* Center Baseline */}
                <div className="w-full h-1 bg-slate-800 rounded-full relative">
                  {/* Left Red Laser Beam: 0 to -laserVal */}
                  <div
                    style={{ width: `${laserVal * 8}%` }}
                    className="absolute right-1/2 top-0 h-1 bg-gradient-to-l from-emerald-500 to-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] transition-all duration-300"
                  >
                    {/* Left Laser Head */}
                    <div className="absolute -left-3 -top-2 w-5 h-5 rounded-full bg-rose-500 ring-4 ring-rose-500/30 flex items-center justify-center text-[10px] font-black">
                      ⚡
                    </div>
                    {/* Left Distance Label */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2.5 py-1 bg-rose-950/80 border border-rose-500/50 rounded-lg text-rose-300 text-xs font-mono font-bold">
                      |-{laserVal}| = {laserVal} birim
                    </div>
                    {/* Position Label */}
                    <div className="absolute -left-4 top-4 text-center">
                      <span className="text-sm font-black text-rose-400">-{laserVal}</span>
                      <span className="block text-[9px] text-slate-400">Şebeke</span>
                    </div>
                  </div>

                  {/* Center Zero Origin */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 border-4 border-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.9)] flex items-center justify-center text-slate-950 font-black text-xs">
                      0
                    </div>
                    <span className="mt-2 text-xs font-black text-emerald-400">Denge</span>
                  </div>

                  {/* Right Green Laser Beam: 0 to +laserVal */}
                  <div
                    style={{ width: `${laserVal * 8}%` }}
                    className="absolute left-1/2 top-0 h-1 bg-gradient-to-r from-emerald-500 to-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)] transition-all duration-300"
                  >
                    {/* Right Laser Head */}
                    <div className="absolute -right-3 -top-2 w-5 h-5 rounded-full bg-amber-400 ring-4 ring-amber-400/30 flex items-center justify-center text-[10px] font-black text-slate-950">
                      ☀️
                    </div>
                    {/* Right Distance Label */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2.5 py-1 bg-amber-950/80 border border-amber-500/50 rounded-lg text-amber-300 text-xs font-mono font-bold">
                      |+{laserVal}| = {laserVal} birim
                    </div>
                    {/* Position Label */}
                    <div className="absolute -right-4 top-4 text-center">
                      <span className="text-sm font-black text-amber-400">+{laserVal}</span>
                      <span className="block text-[9px] text-slate-400">Güneş</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Proof Card & Real Life Meaning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Matematiksel Eşitlik İspatı</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-100 font-mono font-black text-center text-emerald-800 text-base">
                  |-{laserVal}| = |+{laserVal}| = {laserVal} birim
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Mutlak değer, bir sayının sayı doğrusundaki <strong>başlangıç noktasına (0) olan uzaklığıdır</strong>. 
                  Uzaklık asla negatif olamaz! Bu yüzden her iki değer de sıfıra eşit mesafededir.
                </p>
              </div>

              <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>Akıllı Ev Enerji Yorumu (D17 - Tasarruf)</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Güneş panelinin ürettiği <strong>+{laserVal} kWh</strong> ile şebekeden tüketilen <strong>-{laserVal} kWh</strong> enerji, 
                  akıllı evin sıfır enerji dengesinden <strong>tam {laserVal} kWh</strong> sapmıştır. 
                  İsrafı ve sapmayı hesaplarken mutlak değer bize gerçek büyüklüğü gösterir.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
