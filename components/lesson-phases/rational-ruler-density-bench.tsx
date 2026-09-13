'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { MathFraction } from '@/components/ui/math-fraction';
import {
  Ruler,
  Search,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Info,
  CheckCircle2,
  Droplets,
  Layers,
  Compass,
  Sliders,
  Scale
} from 'lucide-react';

export function RationalRulerDensityBench() {
  const { playSound, addPoints, unlockBadge } = useApp();

  const [activeTab, setActiveTab] = useState<'positioner' | 'microscope' | 'laser'>('positioner');

  // ==========================================
  // BİLEŞEN 1: BİLEŞİK KESİRDEN SAYI DOĞRUSUNA KONUMLAYICI
  // ==========================================
  const [inputFraction, setInputFraction] = useState<string>('-11/4');
  const [customNum, setCustomNum] = useState<string>('-11');
  const [customDen, setCustomDen] = useState<string>('4');
  const [inputError, setInputError] = useState<string | null>(null);
  const [parsedFraction, setParsedFraction] = useState<{
    numerator: number;
    denominator: number;
    wholePart: number;
    remainderNumerator: number;
    leftInt: number;
    rightInt: number;
    decimal: number;
  }>({
    numerator: -11,
    denominator: 4,
    wholePart: -2,
    remainderNumerator: 3,
    leftInt: -3,
    rightInt: -2,
    decimal: -2.75
  });

  const PRESET_FRACTIONS = ['-11/4', '-7/4', '+9/4', '-8/3', '+13/5', '-5/2'];

  const handleCalculatePosition = (val: string) => {
    playSound('click');
    setInputFraction(val);
    const parts = val.trim().split('/');
    if (parts.length === 2) {
      setCustomNum(parts[0]);
      setCustomDen(parts[1]);
      let num = parseInt(parts[0], 10);
      let den = parseInt(parts[1], 10);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        if (den < 0) {
          num = -num;
          den = -den;
        }
        const sign = num < 0 ? -1 : 1;
        const absNum = Math.abs(num);
        const absDen = Math.abs(den);
        const whole = Math.floor(absNum / absDen) * sign;
        const remainder = absNum % absDen;

        const decimal = num / den;
        const left = Math.floor(decimal);
        const right = left + 1;

        setParsedFraction({
          numerator: num,
          denominator: den,
          wholePart: whole,
          remainderNumerator: remainder,
          leftInt: left,
          rightInt: right,
          decimal: decimal
        });
        addPoints(10);
      }
    }
  };

  const handleCustomFractionSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setInputError(null);
    const trimmedNum = customNum.trim();
    const trimmedDen = customDen.trim();

    const num = parseInt(trimmedNum, 10);
    const den = parseInt(trimmedDen, 10);

    if (isNaN(num)) {
      setInputError('Lütfen geçerli bir pay (tam sayı) girin.');
      return;
    }
    if (isNaN(den) || den === 0) {
      setInputError('Payda 0 veya tanımsız olamaz!');
      return;
    }
    if (Math.abs(den) > 30) {
      setInputError('Sayı doğrusunda net gösterim için payda en fazla 30 olmalıdır.');
      return;
    }

    let finalNum = num;
    let finalDen = den;
    if (finalDen < 0) {
      finalNum = -finalNum;
      finalDen = -finalDen;
    }

    const formatted = `${finalNum >= 0 && trimmedNum.startsWith('+') ? `+${finalNum}` : finalNum}/${finalDen}`;
    handleCalculatePosition(formatted);
  };

  // ==========================================
  // BİLEŞEN 2: DENK TEMSİLLER & SONSUZ NOKTA MİKROSKOBU
  // ==========================================
  const [selectedPointForMicroscope, setSelectedPointForMicroscope] = useState<string>('1/2');

  const MICROSCOPE_POINTS: Record<
    string,
    {
      base: string;
      value: number;
      equivalents: string[];
      decimal: string;
      description: string;
    }
  > = {
    '1/2': {
      base: '1/2',
      value: 0.5,
      equivalents: ['2/4', '3/6', '4/8', '5/10', '50/100'],
      decimal: '0,5',
      description: 'Sayı doğrusunda 0 ile 1\'in tam ortasındaki tek bir geometrik noktadır. Sonsuz sayıda denk kesirle yazılabilir.'
    },
    '-3/4': {
      base: '-3/4',
      value: -0.75,
      equivalents: ['-6/8', '-9/12', '-15/20', '-75/100'],
      decimal: '-0,75',
      description: '0 ile -1 arası 4 parçaya bölündüğünde sıfırın solundaki 3. noktadır. Noktanın yeri sabittir, denk temsilleri sonsuzdur.'
    },
    '+2/3': {
      base: '+2/3',
      value: 0.666,
      equivalents: ['4/6', '6/9', '8/12', '20/30'],
      decimal: '0,66...',
      description: '0 ile 1 arası 3 parçaya bölünüp 2 parçası alınır. Genişletildikçe sonsuz denk kart üst üste biner.'
    }
  };

  // ==========================================
  // BİLEŞEN 3: MUTLAK DEĞER MESAFE LAZERİ
  // ==========================================
  const [negVal, setNegVal] = useState<number>(-1.66); // -5/3
  const [posVal, setPosVal] = useState<number>(1.33); // +4/3

  const negDist = Math.abs(negVal);
  const posDist = Math.abs(posVal);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        <button
          type="button"
          onClick={() => {
            playSound('click');
            setActiveTab('positioner');
          }}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'positioner'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>1. Bileşen: Bileşik Kesir Konumlayıcı</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            setActiveTab('microscope');
          }}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'microscope'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>2. Bileşen: Denk Temsil Mikroskobu</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            setActiveTab('laser');
          }}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'laser'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>3. Bileşen: Mutlak Değer Lazeri</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. BİLEŞEN: BİLEŞİK KESİRDEN SAYI DOĞRUSUNA KONUMLAYICI */}
      {/* ========================================================= */}
      {activeTab === 'positioner' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-black text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-blue-400" />
                  <span>Bileşik Kesirden Sayı Doğrusuna Konumlayıcı</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  İstediğiniz rasyonel sayıyı yazın veya hazır örneklerden seçin. Sistem adım adım tam sayılı kesre dönüştürüp sayı doğrusunda kilitler!
                </p>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-bold mr-1">Hazır Örnekler:</span>
                {PRESET_FRACTIONS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleCalculatePosition(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                      inputFraction === p ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <MathFraction value={p} />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Fraction Input Form */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <form onSubmit={handleCustomFractionSubmit} className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-300">Özel Kesir Gir:</span>

                {/* Vertical Pay / Payda inputs with horizontal line */}
                <div className="inline-flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700 shadow-inner">
                  <div className="inline-flex flex-col items-center justify-center w-20">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={customNum}
                      onChange={(e) => {
                        setCustomNum(e.target.value);
                        setInputError(null);
                      }}
                      placeholder="Pay (-11)"
                      aria-label="Pay (Pay Değeri)"
                      className="w-full text-center bg-transparent border-b border-slate-600 focus:border-blue-400 pb-0.5 text-sm font-black text-white outline-none font-mono"
                    />
                    <div className="w-full h-[1.5px] bg-slate-400 my-0.5 rounded-full" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={customDen}
                      onChange={(e) => {
                        setCustomDen(e.target.value);
                        setInputError(null);
                      }}
                      placeholder="Payda (4)"
                      aria-label="Payda (Payda Değeri)"
                      className="w-full text-center bg-transparent border-t border-slate-600 focus:border-blue-400 pt-0.5 text-sm font-black text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Sayı Doğrusunda Konumla</span>
                </button>
              </form>

              {inputError && (
                <div className="text-xs text-rose-400 font-bold bg-rose-950/60 border border-rose-500/30 px-3 py-1.5 rounded-lg animate-in fade-in duration-150">
                  ⚠️ {inputError}
                </div>
              )}
            </div>

            {/* Step-by-Step Conversion Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-blue-400 font-bold uppercase">1. Adım: Giriş Kesri</div>
                <div className="text-2xl font-black text-white mt-1 flex items-center"><MathFraction value={inputFraction} /></div>
                <div className="text-xs text-slate-400 mt-1">Rasyonel ifade</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-blue-500/30">
                <div className="text-[10px] text-amber-400 font-bold uppercase">2. Adım: Tam Sayılı Dönüşüm</div>
                <div className="text-2xl font-black text-amber-300 mt-1 flex items-center">
                  {parsedFraction.remainderNumerator === 0 ? (
                    <span>{parsedFraction.wholePart} <span className="text-xs font-normal text-slate-400">(Tam Sayı)</span></span>
                  ) : parsedFraction.wholePart !== 0 ? (
                    <MathFraction whole={`${parsedFraction.wholePart} tam`} numerator={parsedFraction.remainderNumerator} denominator={parsedFraction.denominator} />
                  ) : (
                    <MathFraction numerator={parsedFraction.remainderNumerator} denominator={parsedFraction.denominator} />
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-1">Ondalık Değer: {parsedFraction.decimal.toFixed(2)}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30">
                <div className="text-[10px] text-emerald-400 font-bold uppercase">3. Adım: Sayı Doğrusu Aralığı</div>
                <div className="text-2xl font-black text-emerald-300 mt-1">
                  {parsedFraction.leftInt} ile {parsedFraction.rightInt} arası
                </div>
                <div className="text-xs text-slate-400 mt-1">{parsedFraction.denominator} eşit parçaya bölünür</div>
              </div>
            </div>

            {/* Dynamic Zoomed Number Line Visual */}
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Sol Tam Sayı: {parsedFraction.leftInt}</span>
                <span className="text-blue-400 font-bold">
                  Bayrak Kilidi: {parsedFraction.decimal.toFixed(2)}
                </span>
                <span>Sağ Tam Sayı: {parsedFraction.rightInt}</span>
              </div>

              <div className="relative py-12 px-8 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                {/* Main Axis Line */}
                <div className="absolute left-8 right-8 h-2 bg-slate-700 rounded-full" />
                <div className="absolute left-8 right-8 h-0.5 bg-blue-500/60" />

                {/* Left Border */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-5 h-10 bg-amber-500 rounded-md border-2 border-white shadow-md" />
                  <span className="text-base font-black text-amber-300 mt-1 font-mono">{parsedFraction.leftInt}</span>
                </div>

                {/* Subdivision Ticks */}
                <div className="flex-1 flex justify-evenly relative z-10 px-4">
                  {Array.from({ length: parsedFraction.denominator - 1 }).map((_, idx) => {
                    const stepNum = idx + 1;
                    const showLabel = parsedFraction.denominator <= 10;
                    return (
                      <div key={stepNum} className="flex flex-col items-center">
                        <div className={`bg-slate-500 rounded-full ${parsedFraction.denominator > 15 ? 'w-1 h-4' : 'w-1.5 h-6'}`} />
                        {showLabel && (
                          <span className="text-[10px] text-slate-500 font-mono mt-1 flex items-center justify-center">
                            <MathFraction numerator={stepNum} denominator={parsedFraction.denominator} />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right Border */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-5 h-10 bg-amber-500 rounded-md border-2 border-white shadow-md" />
                  <span className="text-base font-black text-amber-300 mt-1 font-mono">{parsedFraction.rightInt}</span>
                </div>

                {/* Moving Locking Flag (Calculated position) */}
                {(() => {
                  const range = parsedFraction.rightInt - parsedFraction.leftInt;
                  const percent = Math.max(0, Math.min(100, ((parsedFraction.decimal - parsedFraction.leftInt) / (range || 1)) * 100));
                  return (
                    <div
                      className="absolute z-20 top-2 -translate-x-1/2 flex flex-col items-center transition-all duration-700 ease-out"
                      style={{ left: `${8 + (percent * (100 - 16)) / 100}%` }}
                    >
                      <div className="px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-xs shadow-lg border border-blue-300 flex items-center gap-1 animate-bounce">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span><MathFraction value={inputFraction} /></span>
                      </div>
                      <div className="w-1 h-8 bg-blue-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400 shadow-md ring-2 ring-white" />
                    </div>
                  );
                })()}
              </div>

              <div className="text-xs text-slate-400 text-center flex items-center justify-center gap-1.5 flex-wrap">
                <span>💡 Sayı doğrusunda</span>
                <span className="font-bold text-amber-300">{parsedFraction.leftInt}</span>
                <span>ile</span>
                <span className="font-bold text-amber-300">{parsedFraction.rightInt}</span>
                <span>arası</span>
                <span className="font-bold text-blue-300">{parsedFraction.denominator}</span>
                <span>eş parçaya bölünmüş olup hareketli bayrak tam</span>
                <span className="text-amber-300 font-bold inline-flex items-center"><MathFraction value={inputFraction} /></span>
                <span>({parsedFraction.decimal >= 0 ? '+' : ''}{parsedFraction.decimal.toFixed(2)}) noktasına kilitlenir.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. BİLEŞEN: DENK TEMSİLLER VE SONSUZ NOKTA MİKROSKOBU */}
      {/* ========================================================= */}
      {activeTab === 'microscope' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
            <div>
              <h4 className="text-lg font-black text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-teal-400" />
                <span>Denk Temsiller ve Sonsuz Nokta Mikroskobu</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Sayı doğrusunda tek bir geometrik nokta seçin. Mikroskopla bu noktaya denk gelen sonsuz sayıda kesir kartını inceleyin!
              </p>
            </div>

            {/* Target Selection Points */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-400 font-bold">İncelenecek Nokta:</span>
              {Object.keys(MICROSCOPE_POINTS).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    playSound('select');
                    setSelectedPointForMicroscope(key);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${
                    selectedPointForMicroscope === key
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30 ring-2 ring-teal-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="inline-flex items-center gap-1"><MathFraction value={key} /> Noktası</span>
                </button>
              ))}
            </div>

            {/* Microscope Inspection View */}
            {(() => {
              const currentP = MICROSCOPE_POINTS[selectedPointForMicroscope];
              return (
                <div className="p-6 bg-slate-900 rounded-2xl border-2 border-teal-500/40 space-y-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center text-teal-300 text-2xl font-black">
                        <MathFraction value={currentP.base} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Geometrik Konum Değeri: {currentP.decimal}</div>
                        <div className="text-xs text-slate-400 max-w-md mt-0.5">{currentP.description}</div>
                      </div>
                    </div>

                    <div className="px-4 py-2 rounded-xl bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-bold">
                      ✓ Konum Sabit • Temsil Sayısı: Sonsuz
                    </div>
                  </div>

                  {/* Stacked Equivalent Cards (Üst Üste Binen Denk Kartlar) */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-300">
                      Bu Noktaya Denk Gelen Genişletilmiş / Sadeleştirilmiş Kartlar:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
                      <div className="p-4 rounded-2xl bg-teal-600 text-slate-950 font-black text-center shadow-lg border-2 border-white flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase font-bold opacity-80">Ana Kesir</span>
                        <span className="text-2xl mt-1 flex items-center justify-center"><MathFraction value={currentP.base} /></span>
                      </div>

                      {currentP.equivalents.map((eq, i) => (
                        <div
                          key={eq}
                          className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-teal-400 text-center transition-all flex flex-col items-center justify-center group hover:scale-105"
                        >
                          <span className="text-[10px] text-slate-500 group-hover:text-teal-400">×{i + 2} Katı</span>
                          <span className="text-xl font-bold text-amber-300 mt-1 flex items-center justify-center"><MathFraction value={eq} /></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
                    <Info className="w-5 h-5 text-teal-400 shrink-0" />
                    <span>
                      <strong>Önemli Çıkarım:</strong> Sayı doğrusundaki bir noktanın üzerine sonsuz sayıda denk kart konabilir. Kesrin pay ve paydasını aynı sayıyla çarpmak ya da bölmek (denk kesir) noktanın koordinatını asla değiştirmez!
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. BİLEŞEN: MUTLAK DEĞER MESAFE LAZERİ */}
      {/* ========================================================= */}
      {activeTab === 'laser' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div>
              <h4 className="text-lg font-black text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-400" />
                <span>Mutlak Değer Mesafe Lazeri</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                0 referans noktasından iki yöne uzanan lazer ışınlarıyla mutlak uzaklıkları ölçün. Su tasarrufu açığı ve fazlalıklarını karşılaştırın!
              </p>
            </div>

            {/* Sliders for Negative and Positive cursors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Negative Point Controller */}
              <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300">Negatif İmleç (Su Deposu Açığı)</span>
                  <span className="text-lg font-black text-rose-400 font-mono">{negVal.toFixed(2)} ton</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="0"
                  step="0.25"
                  value={negVal}
                  onChange={(e) => setNegVal(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>-3.0 ton</span>
                  <span>-1.5 ton</span>
                  <span>0.0 ton</span>
                </div>
                <div className="pt-2 text-xs font-bold text-rose-300">
                  Lazer Ölçümü: |{negVal.toFixed(2)}| = <span className="text-white text-sm">{negDist.toFixed(2)} birim</span>
                </div>
              </div>

              {/* Positive Point Controller */}
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300">Pozitif İmleç (Kullanılabilir Su)</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">+{posVal.toFixed(2)} ton</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.25"
                  value={posVal}
                  onChange={(e) => setPosVal(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.0 ton</span>
                  <span>+1.5 ton</span>
                  <span>+3.0 ton</span>
                </div>
                <div className="pt-2 text-xs font-bold text-emerald-300">
                  Lazer Ölçümü: |+{posVal.toFixed(2)}| = <span className="text-white text-sm">{posDist.toFixed(2)} birim</span>
                </div>
              </div>
            </div>

            {/* Laser Visualizer Beam */}
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
              <div className="text-xs font-bold text-slate-300 text-center">
                0 Referans Merkezinden İki Yöne Uzanan Lazer Işınları
              </div>

              <div className="relative py-12 px-6 bg-slate-950 rounded-xl border border-slate-800">
                {/* Axis */}
                <div className="absolute left-6 right-6 h-2 bg-slate-700 rounded-full" />

                {/* Center 0 Marker */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                  <div className="w-5 h-8 bg-amber-400 rounded-md border-2 border-white shadow-lg" />
                  <span className="text-xs font-black text-amber-300 mt-1">0 (Merkez)</span>
                </div>

                {/* Left Laser Beam (Red/Rose) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-2 bg-rose-500 shadow-lg shadow-rose-500/80 transition-all duration-300"
                  style={{
                    right: '50%',
                    width: `${(negDist / 3) * 45}%`
                  }}
                />

                {/* Right Laser Beam (Green/Emerald) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-2 bg-emerald-500 shadow-lg shadow-emerald-500/80 transition-all duration-300"
                  style={{
                    left: '50%',
                    width: `${(posDist / 3) * 45}%`
                  }}
                />

                {/* Left Pointer */}
                <div
                  className="absolute top-4 -translate-x-1/2 flex flex-col items-center transition-all duration-300 z-30"
                  style={{
                    left: `${50 - (negDist / 3) * 45}%`
                  }}
                >
                  <div className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-mono font-bold shadow-md">
                    {negVal.toFixed(2)}
                  </div>
                  <div className="w-0.5 h-6 bg-rose-400" />
                </div>

                {/* Right Pointer */}
                <div
                  className="absolute top-4 -translate-x-1/2 flex flex-col items-center transition-all duration-300 z-30"
                  style={{
                    left: `${50 + (posDist / 3) * 45}%`
                  }}
                >
                  <div className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-mono font-bold shadow-md">
                    +{posVal.toFixed(2)}
                  </div>
                  <div className="w-0.5 h-6 bg-emerald-400" />
                </div>
              </div>

              {/* Conclusion Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <strong>Mesafe Karşılaştırması: </strong>
                  {negDist > posDist ? (
                    <span className="text-rose-400 font-bold">
                      Negatif açık (|{negVal.toFixed(2)}| = {negDist.toFixed(2)} br), pozitif fazlalıktan sıfıra daha uzaktır!
                    </span>
                  ) : negDist < posDist ? (
                    <span className="text-emerald-400 font-bold">
                      Pozitif fazlalık (|{posVal.toFixed(2)}| = {posDist.toFixed(2)} br), negatif açıktan sıfıra daha uzaktır!
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold">
                      Her iki değerin de sıfır noktasına olan mutlak uzaklıkları birbirine tam eşittir ({negDist.toFixed(2)} br)!
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Fark: {Math.abs(negDist - posDist).toFixed(2)} br
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
