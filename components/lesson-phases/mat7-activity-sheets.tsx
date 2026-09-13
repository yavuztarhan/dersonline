'use client';

import React, { useState } from 'react';
import { MathFraction } from '@/components/ui/math-fraction';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Check,
  Lightbulb,
  Droplets,
  Microscope,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Scale,
  Thermometer,
  Wind,
  ArrowUpDown,
  FileText,
  Sparkles,
  AlertTriangle,
  Printer,
  BookOpen,
  Layers,
  Award
} from 'lucide-react';

/* ========================================================================= */
/* 1. ETKİNLİK: BİLEŞİK KESİRLERDEN SAYI DOĞRUSUNA VE DİLİMLEME (MAT.7.1.1) */
/* ========================================================================= */
export function FractionRulerActivityView() {
  const { playSound, addPoints, unlockBadge } = useApp();

  const [answers, setAnswers] = useState({
    // Bölüm A: -11/4 Su Açığı Analizi (40P)
    whole: '',
    num: '',
    den: '',
    range_start: '',
    range_end: '',
    slices: '',
    steps: '',

    // Bölüm B: Sayı Doğrusunda Nokta Eşleme (60P)
    a_whole: '',
    a_range: '',
    b_whole: '',
    b_range: '',
    c_whole: '',
    c_range: ''
  });

  const [activeFractionPreview, setActiveFractionPreview] = useState<'-11/4' | '-7/2' | '+13/4' | '-5/3'>('-11/4');
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [revealSolutions, setRevealSolutions] = useState(false);

  const handleCheck = () => {
    let earned = 0;

    // Bölüm A: -11/4 Dönüşümü (40 Puan)
    // -11/4 = -2 tam 3/4
    if (answers.whole.trim() === '-2' || answers.whole.trim() === '2') earned += 6;
    if (answers.num.trim() === '3') earned += 6;
    if (answers.den.trim() === '4') earned += 6;
    // Aralık: -2 ile -3 arası
    const rStart = answers.range_start.trim();
    const rEnd = answers.range_end.trim();
    if ((rStart === '-2' && rEnd === '-3') || (rStart === '-3' && rEnd === '-2')) earned += 8;
    // 4 eşit parça
    if (answers.slices.trim() === '4') earned += 7;
    // Sola 3 adım
    if (answers.steps.trim() === '3') earned += 7;

    // Bölüm B: Nokta Eşleme (60 Puan)
    // A = -7/2 = -3 tam 1/2 (Aralık: -3 ile -4)
    if (answers.a_whole.trim() === '-3 tam 1/2' || answers.a_whole.trim() === '-3 1/2' || answers.a_whole.trim().includes('3')) earned += 10;
    if (answers.a_range.includes('-3') && answers.a_range.includes('-4')) earned += 10;

    // B = +13/4 = +3 tam 1/4 (Aralık: +3 ile +4)
    if (answers.b_whole.trim() === '3 tam 1/4' || answers.b_whole.trim() === '+3 tam 1/4' || answers.b_whole.trim().includes('3')) earned += 10;
    if (answers.b_range.includes('3') && answers.b_range.includes('4')) earned += 10;

    // C = -5/3 = -1 tam 2/3 (Aralık: -1 ile -2)
    if (answers.c_whole.trim() === '-1 tam 2/3' || answers.c_whole.trim() === '-1 2/3' || answers.c_whole.trim().includes('1')) earned += 10;
    if (answers.c_range.includes('-1') && answers.c_range.includes('-2')) earned += 10;

    const finalScore = Math.min(100, Math.round(earned));
    setScore(finalScore);
    setIsChecked(true);

    if (finalScore >= 75) {
      playSound('success');
      if (!pointsAwarded) {
        addPoints(finalScore);
        setPointsAwarded(true);
        if (finalScore === 100) {
          unlockBadge('maarif-genius');
        }
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      playSound('click');
    }
  };

  const handleReset = () => {
    playSound('clear');
    setAnswers({
      whole: '',
      num: '',
      den: '',
      range_start: '',
      range_end: '',
      slices: '',
      steps: '',
      a_whole: '',
      a_range: '',
      b_whole: '',
      b_range: '',
      c_whole: '',
      c_range: ''
    });
    setIsChecked(false);
    setScore(0);
    setRevealSolutions(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. İNTERAKTİF SAYI DOĞRUSU VE SU REZERVİ SİMÜLATÖRÜ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-sky-200 dark:border-sky-900/60 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center font-bold">
              <Droplets className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                Akıllı Su Deposu Rezerv ve Sayı Doğrusu Dilimleme Cetveli
              </h3>
              <p className="text-xs text-slate-500">
                Aşağıdaki kesir butonlarına basarak sayı doğrusundaki aralık dilimleme modelini inceleyiniz:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: '-11/4', frac: '-11/4', label: 'Açık', unit: 'Ton' },
              { id: '-7/2', frac: '-7/2', label: '', unit: 'Ton' },
              { id: '+13/4', frac: '+13/4', label: 'Fazlalık', unit: 'Ton' },
              { id: '-5/3', frac: '-5/3', label: '', unit: 'Ton' }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  playSound('click');
                  setActiveFractionPreview(m.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  activeFractionPreview === m.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <MathFraction value={m.frac} unit={m.unit} />
                {m.label && <span className="text-[10px] opacity-90 font-normal">({m.label})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* İnteraktif SVG Sayı Doğrusu Görseli */}
        <div className="bg-sky-50/50 dark:bg-slate-950/50 p-5 rounded-2xl border border-sky-100 dark:border-sky-900/30 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
                <span>Seçili Değer:</span>
                <MathFraction value={activeFractionPreview} />
                <span>=</span>
                {activeFractionPreview === '-11/4' ? (
                  <span className="inline-flex items-center gap-1"><MathFraction value="-2 tam 3/4" /> (-2.75 ton)</span>
                ) : activeFractionPreview === '-7/2' ? (
                  <span className="inline-flex items-center gap-1"><MathFraction value="-3 tam 1/2" /> (-3.50 ton)</span>
                ) : activeFractionPreview === '+13/4' ? (
                  <span className="inline-flex items-center gap-1"><MathFraction value="+3 tam 1/4" /> (+3.25 ton)</span>
                ) : (
                  <span className="inline-flex items-center gap-1"><MathFraction value="-1 tam 2/3" /> (-1.67 ton)</span>
                )}
              </span>
              <span className="text-slate-500 font-sans text-[11px]">
                Hedef Aralık: <strong>{
                  activeFractionPreview === '-11/4' ? '-2 ile -3 arası (4 dilim)' :
                  activeFractionPreview === '-7/2' ? '-3 ile -4 arası (2 dilim)' :
                  activeFractionPreview === '+13/4' ? '+3 ile +4 arası (4 dilim)' :
                  '-1 ile -2 arası (3 dilim)'
                }</strong>
              </span>
            </div>

            {/* Sayı Doğrusu Grafiği */}
            <div className="relative py-6 px-4">
              <div className="h-1.5 w-full bg-slate-300 dark:bg-slate-700 rounded-full relative">
                {/* Tam Sayı Çizgileri (-4, -3, -2, -1, 0, 1, 2, 3, 4) */}
                {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((num) => {
                  const leftPercent = ((num + 4) / 8) * 100;
                  return (
                    <div
                      key={num}
                      className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                      style={{ left: `${leftPercent}%` }}
                    >
                      <div className={`w-0.5 ${num === 0 ? 'h-6 bg-rose-500' : 'h-4 bg-slate-500 dark:bg-slate-400'}`} />
                      <span className={`text-[11px] font-mono mt-1 font-black ${num === 0 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        {num}
                      </span>
                    </div>
                  );
                })}

                {/* Dinamik Konum İbresi */}
                {(() => {
                  const val =
                    activeFractionPreview === '-11/4' ? -2.75 :
                    activeFractionPreview === '-7/2' ? -3.5 :
                    activeFractionPreview === '+13/4' ? 3.25 : -1.67;
                  const posPercent = ((val + 4) / 8) * 100;

                  return (
                    <div
                      className="absolute -top-7 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out z-10"
                      style={{ left: `${posPercent}%` }}
                    >
                      <div className="px-2 py-0.5 bg-sky-600 text-white font-mono font-black text-[10px] rounded-md shadow-md inline-flex items-center">
                        <MathFraction value={activeFractionPreview} />
                      </div>
                      <div className="w-2.5 h-2.5 bg-sky-600 rotate-45 -mt-1" />
                      <div className="w-3 h-3 rounded-full bg-sky-500 ring-4 ring-sky-300/60 mt-1 animate-pulse" />
                    </div>
                  );
                })()}
              </div>
            </div>
            
            <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
              💡 <strong>Kritik Kural:</strong> Negatif rasyonel sayılarda 0 başlangıç noktasından <strong>SOLA</strong> doğru gidilir. Örneğin -11/4 için önce -2 tam sayısına varılır, ardından [-2, -3] aralığı 4 eş parçaya bölünüp sola doğru 3 dilim ilerlenir.
            </div>
          </div>
        </div>
      </div>

      {/* 2. ETKİNLİK GÖREVLERİ & FORM GİRİŞLERİ */}
      <div className="space-y-6">

        {/* GÖREV 1 (40 Puan) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-black text-xs flex items-center justify-center">
                A
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  GÖREV 1: Akıllı Depo Rezerv Açığı (<MathFraction value="-11/4" unit="Ton" />) Sayı Doğrusu Analizi
                </h4>
                <p className="text-xs text-slate-500">
                  15 Temmuz Demokrasi Parkı ana su deposundaki rezerv açığını adım adım çözümleyiniz:
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-black font-mono">
              40 Puan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Adım 1 & 2 */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                1. Adım: Tam Sayılı Kesir Dönüşümü
              </div>
              <p className="text-xs text-slate-500">
                <span className="inline-flex items-center gap-1"><MathFraction value="-11/4" /> bileşik kesrini tam sayılı kesir biçiminde yazınız:</span>
              </p>
              <div className="flex items-center gap-2 font-mono text-sm">
                <span>- (</span>
                <input
                  type="text"
                  placeholder="Tam"
                  value={answers.whole}
                  onChange={(e) => setAnswers({ ...answers, whole: e.target.value })}
                  className="w-14 px-2 py-1.5 text-center font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
                <span>tam</span>
                <div className="inline-flex flex-col items-center">
                  <input
                    type="text"
                    placeholder="Pay"
                    value={answers.num}
                    onChange={(e) => setAnswers({ ...answers, num: e.target.value })}
                    className="w-12 px-1.5 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs mb-1"
                  />
                  <div className="w-full h-0.5 bg-slate-400" />
                  <input
                    type="text"
                    placeholder="Payda"
                    value={answers.den}
                    onChange={(e) => setAnswers({ ...answers, den: e.target.value })}
                    className="w-12 px-1.5 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs mt-1"
                  />
                </div>
                <span>)</span>
              </div>
              {revealSolutions && (
                <div className="text-[11px] text-emerald-600 font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg">
                  ✓ Doğru Çözüm: 11 ÷ 4 = 2 (kalan 3) ⟹ <MathFraction value="-2 tam 3/4" />
                </div>
              )}
            </div>

            {/* Adım 3 & 4 */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                2. Adım: Aralık &amp; Dilimleme Parametreleri
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 dark:text-slate-400">Hangi ardışık tam sayılar arasındadır?</span>
                  <div className="flex items-center gap-1 font-mono">
                    <input
                      type="text"
                      placeholder="-2"
                      value={answers.range_start}
                      onChange={(e) => setAnswers({ ...answers, range_start: e.target.value })}
                      className="w-12 px-1.5 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                    <span>ile</span>
                    <input
                      type="text"
                      placeholder="-3"
                      value={answers.range_end}
                      onChange={(e) => setAnswers({ ...answers, range_end: e.target.value })}
                      className="w-12 px-1.5 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 dark:text-slate-400">Aralık kaç eş parçaya bölünecek? (Payda)</span>
                  <input
                    type="text"
                    placeholder="4"
                    value={answers.slices}
                    onChange={(e) => setAnswers({ ...answers, slices: e.target.value })}
                    className="w-14 px-2 py-1 text-center font-bold font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 dark:text-slate-400">-2&apos;den sola doğru kaç adım gidilecek? (Pay)</span>
                  <input
                    type="text"
                    placeholder="3"
                    value={answers.steps}
                    onChange={(e) => setAnswers({ ...answers, steps: e.target.value })}
                    className="w-14 px-2 py-1 text-center font-bold font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              {revealSolutions && (
                <div className="text-[11px] text-emerald-600 font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg">
                  ✓ Doğru Çözüm: -2 ile -3 arasında, 4 eşit dilim, sola 3 adım.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GÖREV 2 (60 Puan) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-xs flex items-center justify-center">
                B
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  GÖREV 2: Park Rezerv Sayılarını Tam Sayılı Kesre Çevirip Aralığını Belirleyiniz
                </h4>
                <p className="text-xs text-slate-500">
                  Aşağıdaki 3 rasyonel sayıyı sayı doğrusundaki doğru aralık ve dilimlerle eşleştiriniz:
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-black font-mono">
              60 Puan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Sayı A: -7/2 */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-black font-mono rounded">
                  A = <MathFraction value="-7/2" unit="Ton" />
                </span>
                <span className="text-[10px] text-slate-400">20 Puan</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-600 dark:text-slate-400">Tam Sayılı Hali:</label>
                <input
                  type="text"
                  placeholder="örn: -3 tam 1/2"
                  value={answers.a_whole}
                  onChange={(e) => setAnswers({ ...answers, a_whole: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-bold font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
                <label className="text-slate-600 dark:text-slate-400">Bulunduğu Aralık:</label>
                <input
                  type="text"
                  placeholder="örn: -3 ile -4"
                  value={answers.a_range}
                  onChange={(e) => setAnswers({ ...answers, a_range: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-bold font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>
              {revealSolutions && (
                <div className="text-[10px] text-emerald-600 font-mono font-bold">
                  ✓ <MathFraction value="-3 tam 1/2" /> ( -3 ile -4 arası )
                </div>
              )}
            </div>

            {/* Sayı B: +13/4 */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black font-mono rounded">
                  B = <MathFraction value="+13/4" unit="Ton" />
                </span>
                <span className="text-[10px] text-slate-400">20 Puan</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-600 dark:text-slate-400">Tam Sayılı Hali:</label>
                <input
                  type="text"
                  placeholder="örn: +3 tam 1/4"
                  value={answers.b_whole}
                  onChange={(e) => setAnswers({ ...answers, b_whole: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-bold font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
                <label className="text-slate-600 dark:text-slate-400">Bulunduğu Aralık:</label>
                <input
                  type="text"
                  placeholder="örn: 3 ile 4"
                  value={answers.b_range}
                  onChange={(e) => setAnswers({ ...answers, b_range: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-bold font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>
              {revealSolutions && (
                <div className="text-[10px] text-emerald-600 font-mono font-bold">
                  ✓ <MathFraction value="+3 tam 1/4" /> ( 3 ile 4 arası )
                </div>
              )}
            </div>

            {/* Sayı C: -5/3 */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-black font-mono rounded">
                  C = <MathFraction value="-5/3" unit="Ton" />
                </span>
                <span className="text-[10px] text-slate-400">20 Puan</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-600 dark:text-slate-400">Tam Sayılı Hali:</label>
                <input
                  type="text"
                  placeholder="örn: -1 tam 2/3"
                  value={answers.c_whole}
                  onChange={(e) => setAnswers({ ...answers, c_whole: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-bold font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
                <label className="text-slate-600 dark:text-slate-400">Bulunduğu Aralık:</label>
                <input
                  type="text"
                  placeholder="örn: -1 ile -2"
                  value={answers.c_range}
                  onChange={(e) => setAnswers({ ...answers, c_range: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-bold font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>
              {revealSolutions && (
                <div className="text-[10px] text-emerald-600 font-mono font-bold">
                  ✓ <MathFraction value="-1 tam 2/3" /> ( -1 ile -2 arası )
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* 3. DEĞERLENDİRME & KONTROL BUTONLARI */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isChecked ? (
            <div className={`px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-2 ${
              score >= 75 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}>
              {score >= 75 ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-rose-600" />}
              <span>Etkinlik Puanı: {score} / 100</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-medium">
              Cevaplarınızı girdikten sonra &ldquo;Etkinliği Kontrol Et&rdquo; butonuna basınız.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Temizle</span>
          </button>

          <button
            type="button"
            onClick={() => setRevealSolutions(!revealSolutions)}
            className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>{revealSolutions ? 'Çözümleri Gizle' : 'Çözümleri İncele'}</span>
          </button>

          <button
            type="button"
            onClick={handleCheck}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-md shadow-sky-600/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Etkinliği Kontrol Et</span>
          </button>
        </div>
      </div>

    </div>
  );
}

/* ========================================================================= */
/* 2. ETKİNLİK: RASYONEL SAYILARIN YOĞUNLUĞU VE MİKROSKOP (MAT.7.1.1)        */
/* ========================================================================= */
export function DensityMicroscopeActivityView() {
  const { playSound, addPoints, unlockBadge } = useApp();

  const [answers, setAnswers] = useState({
    // Bölüm A: 1/3 ile 2/3 Arası Genişletme (50P)
    w2_lower: '',
    w2_upper: '',
    w2_mid: '',
    w10_count: '',
    w10_example: '',
    w100_count: '',

    // Bölüm B: Yoğunluk Önermeleri D/Y (50P)
    q1: '',
    q2: '',
    q3: '',
    q4: ''
  });

  const [zoomPreviewMultiplier, setZoomPreviewMultiplier] = useState<number>(2);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [revealSolutions, setRevealSolutions] = useState(false);

  const handleCheck = () => {
    let earned = 0;

    // Bölüm A (50 Puan)
    // 2x genişletme: 2/6 ve 4/6 -> ortanca: 3/6 veya 1/2
    if (answers.w2_lower.trim() === '2/6' || answers.w2_lower.trim() === '2') earned += 8;
    if (answers.w2_upper.trim() === '4/6' || answers.w2_upper.trim() === '4') earned += 8;
    if (answers.w2_mid.trim() === '3/6' || answers.w2_mid.trim() === '1/2') earned += 10;
    // 10x genişletme: 10/30 ile 20/30 arası 9 adet
    if (answers.w10_count.trim() === '9') earned += 8;
    if (answers.w10_example.includes('/30')) earned += 8;
    // 100x genişletme: 100/300 ile 200/300 arası 99 adet
    if (answers.w100_count.trim() === '99') earned += 8;

    // Bölüm B (50 Puan - Her soru 12.5 Puan)
    if (answers.q1 === 'Y') earned += 12.5;
    if (answers.q2 === 'D') earned += 12.5;
    if (answers.q3 === 'D') earned += 12.5;
    if (answers.q4 === 'D') earned += 12.5;

    const finalScore = Math.min(100, Math.round(earned));
    setScore(finalScore);
    setIsChecked(true);

    if (finalScore >= 75) {
      playSound('success');
      if (!pointsAwarded) {
        addPoints(finalScore);
        setPointsAwarded(true);
        if (finalScore === 100) {
          unlockBadge('maarif-genius');
        }
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      playSound('click');
    }
  };

  const handleReset = () => {
    playSound('clear');
    setAnswers({
      w2_lower: '',
      w2_upper: '',
      w2_mid: '',
      w10_count: '',
      w10_example: '',
      w100_count: '',
      q1: '',
      q2: '',
      q3: '',
      q4: ''
    });
    setIsChecked(false);
    setScore(0);
    setRevealSolutions(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. İNTERAKTİF SONSUZ NOKTA MİKROSKOBU SİMÜLATÖRÜ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
              <Microscope className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                Akıllı Park Basınç Sensörleri: Sonsuz Nokta Mikroskobu
              </h3>
              <p className="text-xs text-slate-500">
                1/3 bar ile 2/3 bar arasını yakınlaştırma butonlarıyla büyüterek gizli ara noktaları ortaya çıkarınız:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { mult: 2, label: '2x Zoom (Payda 6)' },
              { mult: 5, label: '5x Zoom (Payda 15)' },
              { mult: 10, label: '10x Zoom (Payda 30)' },
              { mult: 100, label: '100x Zoom (Payda 300)' }
            ].map((m) => (
              <button
                key={m.mult}
                type="button"
                onClick={() => {
                  playSound('click');
                  setZoomPreviewMultiplier(m.mult);
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  zoomPreviewMultiplier === m.mult
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mikroskop Camı Görseli */}
        <div className="bg-indigo-50/50 dark:bg-slate-950/50 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-inner space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-2.5 py-1 rounded-md">
                Genişletme Çarpanı: {zoomPreviewMultiplier}x
              </span>
              <span className="text-slate-600 dark:text-slate-300 font-sans text-xs">
                Aralık: <MathFraction numerator={zoomPreviewMultiplier} denominator={3 * zoomPreviewMultiplier} /> ile <MathFraction numerator={2 * zoomPreviewMultiplier} denominator={3 * zoomPreviewMultiplier} />
              </span>
            </div>

            {/* Yakınlaştırılmış Cetvel Görseli */}
            <div className="relative py-4 px-3 bg-slate-950 text-white rounded-xl p-4 overflow-x-auto">
              <div className="flex items-center justify-between mb-2 text-xs font-mono">
                <span className="text-emerald-400 font-bold">
                  Sol Sınır: <MathFraction numerator={zoomPreviewMultiplier} denominator={3 * zoomPreviewMultiplier} unit="(1/3 bar)" />
                </span>
                <span className="text-rose-400 font-bold">
                  Sağ Sınır: <MathFraction numerator={2 * zoomPreviewMultiplier} denominator={3 * zoomPreviewMultiplier} unit="(2/3 bar)" />
                </span>
              </div>

              {/* Ara Çizgiler */}
              <div className="h-10 w-full bg-slate-900 border border-indigo-500/40 rounded-lg relative flex items-center px-3">
                <div className="w-full h-1 bg-indigo-500/40 relative">
                  {/* Baş ve Son Nokta */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-emerald-200" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-400 ring-2 ring-rose-200" />

                  {/* Örnek Ara Noktalar */}
                  {zoomPreviewMultiplier === 2 && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-[10px] font-mono text-amber-300 mt-1 font-bold inline-flex items-center gap-1"><MathFraction value="3/6" /> (<MathFraction value="1/2" />)</span>
                    </div>
                  )}

                  {zoomPreviewMultiplier === 5 && (
                    [7, 8, 9].map((val, idx) => (
                      <div
                        key={val}
                        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                        style={{ left: `${(idx + 1) * 25}%` }}
                      >
                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                        <span className="text-[9px] font-mono text-indigo-200 mt-1">{val}/15</span>
                      </div>
                    ))
                  )}

                  {zoomPreviewMultiplier >= 10 && (
                    <div className="absolute inset-0 flex items-center justify-around px-4">
                      {Array.from({ length: 9 }).map((_, idx) => (
                        <div key={idx} className="w-1.5 h-1.5 rounded-full bg-indigo-300 opacity-80" />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2 text-center text-[11px] text-indigo-300 font-mono">
                {zoomPreviewMultiplier === 2 && <span className="inline-flex items-center gap-1">🔍 2x yakınlaştırmada 1 adet ortanca rasyonel sayı ortaya çıktı: <MathFraction value="3/6" /> = <MathFraction value="1/2" /></span>}
                {zoomPreviewMultiplier === 5 && '🔍 5x yakınlaştırmada aralığa tam 4 yeni rasyonel sensör değeri yerleşti.'}
                {zoomPreviewMultiplier === 10 && '🔍 10x yakınlaştırmada aralığa tam 9 yeni rasyonel sensör değeri yerleşti.'}
                {zoomPreviewMultiplier === 100 && '🔍 100x yakınlaştırmada 99 yeni rasyonel nokta belirdi. Sonsuza kadar sürdürülebilir!'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ETKİNLİK GÖREVLERİ & FORM GİRİŞLERİ */}
      <div className="space-y-6">

        {/* GÖREV 1 (50 Puan) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-xs flex items-center justify-center">
                A
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  GÖREV 1: Payda Genişletme ile Ara Noktaları Hesaplayınız
                </h4>
                <p className="text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1"><MathFraction value="1/3" /> ile <MathFraction value="2/3" unit="bar" /> basınç değerleri arasındaki sensör noktalarını bulunuz:</span>
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-black font-mono">
              50 Puan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 2x Genişletme */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200">1. Kademe: 2 ile Genişletme</div>
              <p className="text-slate-500"><span className="inline-flex items-center gap-1"><MathFraction value="1/3" /> ve <MathFraction value="2/3" /> kesirlerini 2 ile genişletiniz:</span></p>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="text"
                  placeholder="2/6"
                  value={answers.w2_lower}
                  onChange={(e) => setAnswers({ ...answers, w2_lower: e.target.value })}
                  className="w-16 px-2 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
                <span>ile</span>
                <input
                  type="text"
                  placeholder="4/6"
                  value={answers.w2_upper}
                  onChange={(e) => setAnswers({ ...answers, w2_upper: e.target.value })}
                  className="w-16 px-2 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>
              <p className="text-slate-500 pt-1">Bu iki değerin tam ortasındaki sayı:</p>
              <input
                type="text"
                placeholder="3/6 veya 1/2"
                value={answers.w2_mid}
                onChange={(e) => setAnswers({ ...answers, w2_mid: e.target.value })}
                className="w-full px-3 py-1.5 font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
              />
            </div>

            {/* 10x Genişletme */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200">2. Kademe: 10 ile Genişletme</div>
              <p className="text-slate-500"><span className="inline-flex items-center gap-1"><MathFraction value="10/30" /> ile <MathFraction value="20/30" /> arasında kaç adet rasyonel sayı vardır?</span></p>
              <input
                type="text"
                placeholder="Adet (örn: 9)"
                value={answers.w10_count}
                onChange={(e) => setAnswers({ ...answers, w10_count: e.target.value })}
                className="w-full px-3 py-1.5 font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
              />
              <p className="text-slate-500 pt-1">Bu aralıktan 1 örnek rasyonel sayı yazınız:</p>
              <input
                type="text"
                placeholder="örn: 11/30"
                value={answers.w10_example}
                onChange={(e) => setAnswers({ ...answers, w10_example: e.target.value })}
                className="w-full px-3 py-1.5 font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
              />
            </div>

            {/* 100x Genişletme */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200">3. Kademe: 100 ile Genişletme</div>
              <p className="text-slate-500"><span className="inline-flex items-center gap-1"><MathFraction value="100/300" /> ile <MathFraction value="200/300" /> arasında kaç adet rasyonel sayı vardır?</span></p>
              <input
                type="text"
                placeholder="Adet (örn: 99)"
                value={answers.w100_count}
                onChange={(e) => setAnswers({ ...answers, w100_count: e.target.value })}
                className="w-full px-3 py-1.5 font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
              />
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold pt-1">
                📌 Sonuç: Genişletme katsayısı büyüdükçe iki değer arasına sonsuz sayıda yeni rasyonel sayı sığar!
              </p>
            </div>
          </div>
        </div>

        {/* GÖREV 2 (50 Puan) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black text-xs flex items-center justify-center">
                B
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  GÖREV 2: Yoğunluk İlkesi Doğru / Yanlış Önermeleri
                </h4>
                <p className="text-xs text-slate-500">
                  Rasyonel sayıların yoğunluk özelliği hakkındaki hükümleri değerlendiriniz (Her biri 12.5 Puan):
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-black font-mono">
              50 Puan
            </span>
          </div>

          <div className="space-y-3">
            {[
              { id: 'q1', text: '1. İki ardışık tam sayı (örn. 2 ile 3) arasında sonsuz çoklukta tam sayı vardır.' },
              { id: 'q2', text: '2. İki farklı rasyonel sayı arasında daima en az bir ve dolayısıyla sonsuz sayıda rasyonel sayı vardır.' },
              { id: 'q3', text: '3. Kesirlerin pay ve paydası aynı sayıyla genişletildikçe, aradaki boşluğa yerleştirilebilecek rasyonel nokta adedi katlanarak artar.' },
              { id: 'q4', text: '4. Rasyonel sayılar sayı doğrusunda "yoğundur"; yani sayı doğrusundaki herhangi bir aralıkta asla boşluk bırakmazlar.' }
            ].map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <span className="text-slate-800 dark:text-slate-200 font-medium max-w-xl">
                  {item.text}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, [item.id]: 'D' })}
                    className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer ${
                      (answers as any)[item.id] === 'D'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    DOĞRU (D)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, [item.id]: 'Y' })}
                    className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer ${
                      (answers as any)[item.id] === 'Y'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    YANLIŞ (Y)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. DEĞERLENDİRME & KONTROL BUTONLARI */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isChecked ? (
            <div className={`px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-2 ${
              score >= 75 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}>
              {score >= 75 ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-rose-600" />}
              <span>Etkinlik Puanı: {score} / 100</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-medium">
              Cevaplarınızı girdikten sonra &ldquo;Etkinliği Kontrol Et&rdquo; butonuna basınız.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Temizle</span>
          </button>

          <button
            type="button"
            onClick={() => setRevealSolutions(!revealSolutions)}
            className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>{revealSolutions ? 'Çözümleri Gizle' : 'Çözümleri İncele'}</span>
          </button>

          <button
            type="button"
            onClick={handleCheck}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Etkinliği Kontrol Et</span>
          </button>
        </div>
      </div>

    </div>
  );
}

/* ========================================================================= */
/* 3. ETKİNLİK: MUTLAK DEĞER LAZER METRESİ VE TOLERANS ANALİZİ (MAT.7.1.1)    */
/* ========================================================================= */
export function LaserToleranceActivityView() {
  const { playSound, addPoints, unlockBadge } = useApp();

  const [answers, setAnswers] = useState({
    // Bölüm A: Mutlak Değer Mesafeleri (40P)
    dist_west: '',
    dist_east: '',
    dist_c: '',
    is_equal: '',

    // Bölüm B: Debi Tolerans Tablosu |x| <= 3/4 m/s (60P)
    flow1: '',
    flow2: '',
    flow3: '',
    flow4: '',
    flow5: '',
    flow6: ''
  });

  const [activeLaserCoord, setActiveLaserCoord] = useState<number>(-2.75);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [revealSolutions, setRevealSolutions] = useState(false);

  const handleCheck = () => {
    let earned = 0;

    // Bölüm A: 40 Puan
    // |-11/4| = 11/4 veya 2.75
    if (answers.dist_west.trim() === '11/4' || answers.dist_west.trim() === '2.75' || answers.dist_west.trim() === '2,75') earned += 10;
    // |+7/2| = 7/2 veya 3.5
    if (answers.dist_east.trim() === '7/2' || answers.dist_east.trim() === '3.5' || answers.dist_east.trim() === '3,5') earned += 10;
    // |-5/4| = 5/4 veya 1.25
    if (answers.dist_c.trim() === '5/4' || answers.dist_c.trim() === '1.25' || answers.dist_c.trim() === '1,25') earned += 10;
    // |-11/4| ile |+11/4| mesafeleri eşit mi? -> EVET
    if (answers.is_equal.toLowerCase().includes('evet') || answers.is_equal.toLowerCase().includes('esit')) earned += 10;

    // Bölüm B: Debi Toleransı |x| <= 3/4 (0.75 m/s) (60 Puan - Her soru 10P)
    if (answers.flow1 === 'guvenli') earned += 10;
    if (answers.flow2 === 'guvenli') earned += 10;
    if (answers.flow3 === 'tehlikeli') earned += 10;
    if (answers.flow4 === 'guvenli') earned += 10;
    if (answers.flow5 === 'tehlikeli') earned += 10;
    if (answers.flow6 === 'tehlikeli') earned += 10;

    const finalScore = Math.min(100, Math.round(earned));
    setScore(finalScore);
    setIsChecked(true);

    if (finalScore >= 75) {
      playSound('success');
      if (!pointsAwarded) {
        addPoints(finalScore);
        setPointsAwarded(true);
        if (finalScore === 100) {
          unlockBadge('maarif-genius');
        }
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      playSound('click');
    }
  };

  const handleReset = () => {
    playSound('clear');
    setAnswers({
      dist_west: '',
      dist_east: '',
      dist_c: '',
      is_equal: '',
      flow1: '',
      flow2: '',
      flow3: '',
      flow4: '',
      flow5: '',
      flow6: ''
    });
    setIsChecked(false);
    setScore(0);
    setRevealSolutions(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. İNTERAKTİF MUTLAK DEĞER LAZER METRESİ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-amber-200 dark:border-amber-900/60 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                Akıllı Park Çift Yönlü Lazer Metresi &amp; Tolerans Analizi
              </h3>
              <p className="text-xs text-slate-500">
                0 referans noktasından zıt yönlerdeki depolara lazer tutarak mutlak mesafenin yönsüzlüğünü gözlemleyiniz:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { val: -2.75, name: 'Batı Deposu', frac: '-11/4' },
              { val: 2.75, name: 'Doğu Deposu', frac: '+11/4' },
              { val: -3.5, name: 'Kuzey Rezervi', frac: '-7/2' },
              { val: 0.5, name: 'Tolerans Sınırı', frac: '+1/2' }
            ].map((btn) => (
              <button
                key={btn.val}
                type="button"
                onClick={() => {
                  playSound('click');
                  setActiveLaserCoord(btn.val);
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer inline-flex items-center gap-1 ${
                  activeLaserCoord === btn.val
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{btn.name}</span>
                <span className="opacity-90">(<MathFraction value={btn.frac} />)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lazer Görsel Simülatörü */}
        <div className="bg-amber-50/50 dark:bg-slate-950/50 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-200 dark:border-amber-800 shadow-inner space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2.5 py-1 rounded-md">
                Hedef Koordinat: {activeLaserCoord > 0 ? `+${activeLaserCoord}` : activeLaserCoord} Ton
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                Lazer Mesafesi: |{activeLaserCoord}| = {Math.abs(activeLaserCoord)} Metre / Ton
              </span>
            </div>

            {/* Lazer Işını Çizimi */}
            <div className="relative py-6 px-4 bg-slate-950 rounded-xl">
              <div className="h-1.5 w-full bg-slate-800 rounded-full relative">
                {/* 0 Merkezi */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 ring-4 ring-amber-500/40 z-20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
                </div>
                <div className="absolute left-1/2 top-6 -translate-x-1/2 text-[10px] font-mono text-amber-300 font-black">
                  0 (Başlangıç)
                </div>

                {/* Hedef Noktası */}
                {(() => {
                  const targetLeft = ((activeLaserCoord + 4) / 8) * 100;
                  const isNegative = activeLaserCoord < 0;
                  const startLeft = 50;
                  const beamWidth = Math.abs(targetLeft - startLeft);
                  const beamLeft = isNegative ? targetLeft : startLeft;

                  return (
                    <>
                      {/* Lazer Işını */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-300 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.8)] z-10 animate-pulse"
                        style={{
                          left: `${beamLeft}%`,
                          width: `${beamWidth}%`
                        }}
                      />

                      {/* Hedef Pin */}
                      <div
                        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
                        style={{ left: `${targetLeft}%` }}
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-rose-500 ring-4 ring-rose-400/50 shadow-md" />
                        <span className="text-[10px] font-mono text-rose-300 font-bold mt-2">
                          {activeLaserCoord}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
              ⚡ <strong>Mutlak Değerin Temel İlkesi:</strong> Uzaklık fiziksel olarak negatif olamaz! Hem Batı Deposu ($-11/4$) hem de Doğu Deposu ($+11/4$) ana kontrol merkezine tam olarak <strong>$2,75$ ton (birim)</strong> eşit mesafededir.
            </div>
          </div>
        </div>
      </div>

      {/* 2. ETKİNLİK GÖREVLERİ & FORM GİRİŞLERİ */}
      <div className="space-y-6">

        {/* GÖREV 1 (40 Puan) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-black text-xs flex items-center justify-center">
                A
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  GÖREV 1: Sıfıra Olan Yönsüz Mesafeleri (Mutlak Değer) Hesaplayınız
                </h4>
                <p className="text-xs text-slate-500">
                  Depoların sıfır denge çizgisine olan fiziksel mutlak uzaklıklarını giriniz:
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-black font-mono">
              40 Puan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-200">Batı Deposu: <MathFraction value="-11/4" isAbsolute /> = ?</span>
                <span className="text-slate-400">10 Puan</span>
              </div>
              <input
                type="text"
                placeholder="örn: 11/4 veya 2.75"
                value={answers.dist_west}
                onChange={(e) => setAnswers({ ...answers, dist_west: e.target.value })}
                className="w-full px-3 py-1.5 font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-slate-700 dark:text-slate-200">Doğu Deposu: <MathFraction value="+7/2" isAbsolute /> = ?</span>
                <span className="text-slate-400">10 Puan</span>
              </div>
              <input
                type="text"
                placeholder="örn: 7/2 veya 3.5"
                value={answers.dist_east}
                onChange={(e) => setAnswers({ ...answers, dist_east: e.target.value })}
                className="w-full px-3 py-1.5 font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-200">Rezerv Vanası: <MathFraction value="-5/4" isAbsolute /> = ?</span>
                <span className="text-slate-400">10 Puan</span>
              </div>
              <input
                type="text"
                placeholder="örn: 5/4 veya 1.25"
                value={answers.dist_c}
                onChange={(e) => setAnswers({ ...answers, dist_c: e.target.value })}
                className="w-full px-3 py-1.5 font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-slate-700 dark:text-slate-200"><MathFraction value="-11/4" isAbsolute /> ile <MathFraction value="+11/4" isAbsolute /> mesafeleri eşit midir?</span>
                <span className="text-slate-400">10 Puan</span>
              </div>
              <input
                type="text"
                placeholder="Evet / Hayır"
                value={answers.is_equal}
                onChange={(e) => setAnswers({ ...answers, is_equal: e.target.value })}
                className="w-full px-3 py-1.5 font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* GÖREV 2 (60 Puan) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-black text-xs flex items-center justify-center">
                B
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  GÖREV 2: Debi Tolerans Güvenlik Tablosu (|x| &le; <MathFraction value="3/4" unit="m/s" />)
                </h4>
                <p className="text-xs text-slate-500">
                  Kural: Hız sapması mutlak değerce 0.75 m/s veya altında ise sistem GÜVENLİ, üzerinde ise TEHLİKELİ&apos;dir.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-black font-mono">
              60 Puan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: 'flow1', rate: '+1/2 m/s', dec: '0.50' },
              { id: 'flow2', rate: '-5/8 m/s', dec: '0.625' },
              { id: 'flow3', rate: '+4/5 m/s', dec: '0.80' },
              { id: 'flow4', rate: '-1/4 m/s', dec: '0.25' },
              { id: 'flow5', rate: '+7/8 m/s', dec: '0.875' },
              { id: 'flow6', rate: '-1 m/s', dec: '1.00' }
            ].map((f) => (
              <div
                key={f.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-slate-800 dark:text-slate-100"><MathFraction value={f.rate} /></span>
                  <span className="text-[10px] text-slate-500">|x| = {f.dec} m/s</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, [f.id]: 'guvenli' })}
                    className={`py-1.5 px-2 rounded-lg font-black text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      (answers as any)[f.id] === 'guvenli'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>GÜVENLİ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, [f.id]: 'tehlikeli' })}
                    className={`py-1.5 px-2 rounded-lg font-black text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      (answers as any)[f.id] === 'tehlikeli'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>TEHLİKELİ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. DEĞERLENDİRME & KONTROL BUTONLARI */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isChecked ? (
            <div className={`px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-2 ${
              score >= 75 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}>
              {score >= 75 ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-rose-600" />}
              <span>Etkinlik Puanı: {score} / 100</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-medium">
              Cevaplarınızı girdikten sonra &ldquo;Etkinliği Kontrol Et&rdquo; butonuna basınız.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Temizle</span>
          </button>

          <button
            type="button"
            onClick={() => setRevealSolutions(!revealSolutions)}
            className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>{revealSolutions ? 'Çözümleri Gizle' : 'Çözümleri İncele'}</span>
          </button>

          <button
            type="button"
            onClick={handleCheck}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md shadow-amber-600/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Etkinliği Kontrol Et</span>
          </button>
        </div>
      </div>

    </div>
  );
}

/* ========================================================================= */
/* 4. ETKİNLİK: RASYONEL SAYILARI KARŞILAŞTIRMA VE SIRALAMA (MAT.7.1.2)      */
/* ÇİFT YÜZ (ÖN YÜZ / İÇ - ARKA YÜZ / DIŞ) MAARİF MODELİ ETKİNLİK KAĞIDI    */
/* ========================================================================= */
export function RationalComparisonActivityView() {
  const { playSound, addPoints, unlockBadge } = useApp();

  // Yüz Seçimi: 'front' (Ön Yüz / İç), 'back' (Arka Yüz / Dış), 'both' (Çift Taraflı Baskı / Tam Görünüm)
  const [activeFace, setActiveFace] = useState<'front' | 'back' | 'both'>('front');

  // İnteraktif Terazi Simülatörü Seçimi
  const [activeScalePair, setActiveScalePair] = useState<{
    left: string;
    right: string;
    leftVal: number;
    rightVal: number;
    title: string;
  }>({
    left: '4/7',
    right: '4/9',
    leftVal: 4 / 7,
    rightVal: 4 / 9,
    title: 'Paylar Eşit Durumu'
  });

  // Öğrenci Bilgileri
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    classNum: '',
    date: new Date().toLocaleDateString('tr-TR')
  });

  // Cevaplar
  const [answers, setAnswers] = useState({
    // Ön Yüz - Görev 1: Karşılaştırma Sembolleri (30P - her biri 5P)
    comp1: '', // 4/7 > 4/9
    comp2: '', // 5/12 < 7/12
    comp3: '', // 13/28 < 17/32 (Yarıma referans)
    comp4: '', // 9/10 > 7/8 (Bütüne referans)
    comp5: '', // -2/3 > -5/6
    comp6: '', // -3/4 < -1/4

    // Ön Yüz - Görev 2: Sıralama Kutuları (20P - her biri 5P)
    // Verilenler: -3/4, -1/2, +1/3, +5/6 -> Sıralama: -3/4 < -1/2 < +1/3 < +5/6
    ord1: '',
    ord2: '',
    ord3: '',
    ord4: '',

    // Arka Yüz - Görev 3: Hata Dedektifi (20P - her biri 10P)
    det1: '', // Ali'nin yanılgı analizi: 'B' seçeneği
    det2: '', // Ceren'in negatif yanılgı analizi: 'A' seçeneği

    // Arka Yüz - Görev 4: Gerçek Yaşam Mühendislik Problemleri (30P - her biri 15P)
    prob_turbine: '', // 'B' (7/12 < 5/8 < 3/4 -> B < A < C)
    prob_temp: '', // 'C' (-7/8 < -5/6 < -2/3 -> Kuzey < Ejder < Güney)

    // Maarif Süreç Değerlendirme & Beceri Rubriği
    rubric_sdb12: 4, // Kendini tanıma
    rubric_sdb22: 4, // Sorumluluk
    rubric_sdb33: 4, // Eleştirel düşünme
    teacherFeedback: ''
  });

  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [revealSolutions, setRevealSolutions] = useState(false);

  // Kontrol Etme Fonksiyonu
  const handleCheck = () => {
    let earned = 0;

    // Görev 1 Kontrolleri (30P)
    if (answers.comp1 === '>') earned += 5;
    if (answers.comp2 === '<') earned += 5;
    if (answers.comp3 === '<') earned += 5;
    if (answers.comp4 === '>') earned += 5;
    if (answers.comp5 === '>') earned += 5;
    if (answers.comp6 === '<') earned += 5;

    // Görev 2 Kontrolleri (20P)
    // Küçükten büyüğe: -3/4 < -1/2 < 1/3 < 5/6
    const cleanOrd = (v: string) => v.trim().replace('+', '');
    if (cleanOrd(answers.ord1) === '-3/4') earned += 5;
    if (cleanOrd(answers.ord2) === '-1/2') earned += 5;
    if (cleanOrd(answers.ord3) === '1/3' || cleanOrd(answers.ord3) === '+1/3') earned += 5;
    if (cleanOrd(answers.ord4) === '5/6' || cleanOrd(answers.ord4) === '+5/6') earned += 5;

    // Görev 3 Hata Dedektifi (20P)
    if (answers.det1 === 'B') earned += 10;
    if (answers.det2 === 'A') earned += 10;

    // Görev 4 Gerçek Yaşam Problemleri (30P)
    if (answers.prob_turbine === 'B') earned += 15;
    if (answers.prob_temp === 'C') earned += 15;

    const finalScore = Math.min(100, Math.round(earned));
    setScore(finalScore);
    setIsChecked(true);

    if (finalScore >= 75) {
      playSound('success');
      if (!pointsAwarded) {
        addPoints(finalScore);
        setPointsAwarded(true);
        if (finalScore === 100) {
          unlockBadge('rational-comparison-hero');
        }
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      playSound('click');
    }
  };

  const handleReset = () => {
    playSound('select');
    setAnswers({
      comp1: '',
      comp2: '',
      comp3: '',
      comp4: '',
      comp5: '',
      comp6: '',
      ord1: '',
      ord2: '',
      ord3: '',
      ord4: '',
      det1: '',
      det2: '',
      prob_turbine: '',
      prob_temp: '',
      rubric_sdb12: 4,
      rubric_sdb22: 4,
      rubric_sdb33: 4,
      teacherFeedback: ''
    });
    setIsChecked(false);
    setScore(0);
    setRevealSolutions(false);
  };

  // Terazi Açısı Hesabı
  const scaleTilt = (() => {
    const diff = activeScalePair.leftVal - activeScalePair.rightVal;
    if (Math.abs(diff) < 0.0001) return 0;
    return diff > 0 ? -9 : 9; // Sol ağırsa sola yatar (-9deg), sağ ağırsa sağa yatar (9deg)
  })();

  return (
    <div className="space-y-6">

      {/* 1. ÜST ETKİNLİK KONTROLÜ VE YÜZ SEÇİCİ (ÖN YÜZ / ARKA YÜZ / BASKI) */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-sky-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs font-black tracking-wider uppercase">
                MAT.7.1.2 • Sayılar ve Nicelikler
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                Çift Yüzlü Çalışma Yaprağı
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
              <Scale className="w-6 h-6 text-sky-400" />
              Rasyonel Sayıları Karşılaştırma & Sıralama
            </h3>
            <p className="text-xs text-sky-200/80 mt-1 max-w-2xl">
              Erzurum Palandöken Meteoroloji İstasyonu ve Rüzgar Santrali Kurgusu Üzerinden Keşif, Temsil, Hata Dedektifliği ve Süreç Değerlendirmesi
            </p>
          </div>

          {/* Sayfa Geçiş Sekmeleri (Ön Yüz - Arka Yüz - Çift Yüz) */}
          <div className="flex items-center bg-slate-900/80 p-1.5 rounded-2xl border border-sky-500/30 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveFace('front');
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                activeFace === 'front'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ön Yüz (İç / Keşif)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveFace('back');
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                activeFace === 'back'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Arka Yüz (Dış / Dedektiflik)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveFace('both');
              }}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeFace === 'both'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Her iki yüzü alt alta tam sayfa olarak inceleyin"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Çift Taraflı Baskı</span>
            </button>
          </div>
        </div>

        {/* Öğrenci Bilgi Alanı */}
        <div className="mt-4 pt-4 border-t border-sky-500/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-sky-200 font-bold uppercase block mb-1">Öğrenci Adı Soyadı</label>
            <input
              type="text"
              placeholder="Ad Soyad giriniz..."
              value={studentInfo.name}
              onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950/60 border border-sky-500/30 text-white text-xs font-medium placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="text-[10px] text-sky-200 font-bold uppercase block mb-1">Sınıf / Okul No</label>
            <input
              type="text"
              placeholder="Örn: 7/A - 412"
              value={studentInfo.classNum}
              onChange={(e) => setStudentInfo({ ...studentInfo, classNum: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950/60 border border-sky-500/30 text-white text-xs font-medium placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="text-[10px] text-sky-200 font-bold uppercase block mb-1">Uygulama Tarihi</label>
            <input
              type="text"
              value={studentInfo.date}
              onChange={(e) => setStudentInfo({ ...studentInfo, date: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950/60 border border-sky-500/30 text-white text-xs font-medium placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ÖN YÜZ (İÇ YÜZ): KEŞİF, STRATEJİLER, TERAZİ VE SEMBOL YERLEŞTİRME         */}
      {/* ========================================================================= */}
      {(activeFace === 'front' || activeFace === 'both') && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Ön Yüz Başlık Rozeti */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-800">
            <span className="text-xs font-black text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-sky-600" />
              SAYFA 1 / ÖN YÜZ (İÇ): Rasyonel Denge, Strateji Kılavuzu & Karşılaştırma Modeli
            </span>
            <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
              50 Puan (30P Karşılaştırma + 20P Sıralama)
            </span>
          </div>

          {/* 4 Temel Strateji Kartı (Öğrenci Kılavuzu) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-sky-700 dark:text-sky-400">
                <span className="w-5 h-5 rounded-md bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-[10px]">1</span>
                Payda Eşitleme
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                Pozitif kesirlerde paydalar eşitlendiğinde payı büyük olan daha büyüktür. (<MathFraction value="5/12" /> &lt; <MathFraction value="7/12" />)
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-700 dark:text-indigo-400">
                <span className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-[10px]">2</span>
                Payları Eşitleme
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                Payları eşit olan pozitif kesirlerde paydası küçük olan birim daha büyüktür. (<MathFraction value="4/7" /> &gt; <MathFraction value="4/9" />)
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400">
                <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[10px]">3</span>
                Yarıma / Bütüne Yakınlık
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                İşlem yapmadan 1/2 veya 1 referans alınır. (<MathFraction value="13/28" /> &lt; 1/2 iken <MathFraction value="17/32" /> &gt; 1/2&apos;dir)
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-rose-700 dark:text-rose-400">
                <span className="w-5 h-5 rounded-md bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-[10px]">4</span>
                Negatif Sayı Kuralı
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                Sıfıra daha yakın olan (mutlak değeri küçük olan) daha büyüktür. (-<MathFraction value="2/3" /> &gt; -<MathFraction value="5/6" />)
              </p>
            </div>
          </div>

          {/* İnteraktif Denge Terazisi Simülasyon Alanı */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-5 sm:p-6 border border-slate-800 text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-black text-white">İnteraktif Terazi Modeli: Referans Deney İstasyonu</h4>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Seçili Durum: <strong className="text-amber-300">{activeScalePair.title}</strong>
              </span>
            </div>

            {/* Önceden Tanımlı Karşılaştırma Düğmeleri */}
            <div className="flex flex-wrap gap-2">
              {[
                { title: 'Paylar Eşit', left: '4/7', right: '4/9', leftVal: 4 / 7, rightVal: 4 / 9 },
                { title: 'Paydalar Eşit', left: '5/12', right: '7/12', leftVal: 5 / 12, rightVal: 7 / 12 },
                { title: 'Yarıma (1/2) Yakınlık', left: '13/28', right: '17/32', leftVal: 13 / 28, rightVal: 17 / 32 },
                { title: 'Bütüne (1) Yakınlık', left: '9/10', right: '7/8', leftVal: 9 / 10, rightVal: 7 / 8 },
                { title: 'Negatif Sıralama', left: '-2/3', right: '-5/6', leftVal: -2 / 3, rightVal: -5 / 6 }
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    playSound('select');
                    setActiveScalePair(preset);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeScalePair.title === preset.title
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {preset.title} (<MathFraction value={preset.left} /> vs <MathFraction value={preset.right} />)
                </button>
              ))}
            </div>

            {/* Denge Terazisi Görseli */}
            <div className="py-6 px-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center min-h-[190px]">
              {/* Yatay Kol & Kefeler */}
              <div
                className="w-full max-w-sm transition-transform duration-500 ease-out flex items-center justify-between relative"
                style={{ transform: `rotate(${scaleTilt}deg)` }}
              >
                {/* Sol Kefe */}
                <div
                  className="flex flex-col items-center transition-transform duration-500"
                  style={{ transform: `rotate(${-scaleTilt}deg)` }}
                >
                  <div className="w-20 h-16 rounded-2xl bg-sky-950/80 border-2 border-sky-400/60 shadow-lg shadow-sky-500/20 flex flex-col items-center justify-center p-2">
                    <span className="text-[10px] text-sky-300 font-black uppercase">Sol Kefe</span>
                    <span className="text-base font-black text-white font-mono mt-0.5">
                      <MathFraction value={activeScalePair.left} />
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                      &asymp; {activeScalePair.leftVal.toFixed(3)}
                    </span>
                  </div>
                  <div className="w-0.5 h-6 bg-slate-600" />
                </div>

                {/* Terazi Kolu */}
                <div className="flex-1 h-2 bg-gradient-to-r from-sky-400 via-amber-400 to-indigo-400 rounded-full mx-2 shadow-sm" />

                {/* Sağ Kefe */}
                <div
                  className="flex flex-col items-center transition-transform duration-500"
                  style={{ transform: `rotate(${-scaleTilt}deg)` }}
                >
                  <div className="w-20 h-16 rounded-2xl bg-indigo-950/80 border-2 border-indigo-400/60 shadow-lg shadow-indigo-500/20 flex flex-col items-center justify-center p-2">
                    <span className="text-[10px] text-indigo-300 font-black uppercase">Sağ Kefe</span>
                    <span className="text-base font-black text-white font-mono mt-0.5">
                      <MathFraction value={activeScalePair.right} />
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                      &asymp; {activeScalePair.rightVal.toFixed(3)}
                    </span>
                  </div>
                  <div className="w-0.5 h-6 bg-slate-600" />
                </div>
              </div>

              {/* Terazi Dayanağı (Piramit) */}
              <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[32px] border-b-amber-500 -mt-2" />
              <div className="w-24 h-2.5 bg-slate-700 rounded-full mt-1" />

              {/* Denge Sonuç Yorumu */}
              <div className="mt-4 text-xs font-mono font-bold text-center">
                {activeScalePair.leftVal > activeScalePair.rightVal ? (
                  <span className="text-sky-300">
                    Sol Kefe Daha Ağır: <MathFraction value={activeScalePair.left} /> &gt; <MathFraction value={activeScalePair.right} />
                  </span>
                ) : activeScalePair.leftVal < activeScalePair.rightVal ? (
                  <span className="text-indigo-300">
                    Sağ Kefe Daha Ağır: <MathFraction value={activeScalePair.left} /> &lt; <MathFraction value={activeScalePair.right} />
                  </span>
                ) : (
                  <span className="text-amber-300">Kefeler Dengede: Eşit Değerler!</span>
                )}
              </div>
            </div>
          </div>

          {/* GÖREV 1: SEMBOL YERLEŞTİRME (30 PUAN) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-black text-xs flex items-center justify-center">
                  1
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    GÖREV 1: Rasyonel Çiftleri Arasına Uygun Sembolü (&lt;, &gt;, =) Yerleştiriniz
                  </h4>
                  <p className="text-xs text-slate-500">
                    Stratejileri kullanarak kutucuklara tıklayıp doğru sembolü seçiniz (Her doğru 5 puan):
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-black font-mono">
                30 Puan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'comp1', left: '4/7', right: '4/9', correct: '>', note: 'Paylar eşit; paydası küçük olan büyüktür.' },
                { id: 'comp2', left: '5/12', right: '7/12', correct: '<', note: 'Paydalar eşit; payı büyük olan büyüktür.' },
                { id: 'comp3', left: '13/28', right: '17/32', correct: '<', note: '13/28 < 1/2 iken 17/32 > 1/2\'dir.' },
                { id: 'comp4', left: '9/10', right: '7/8', correct: '>', note: 'Bütüne eksikler: 1/10 < 1/8 olduğu için 9/10 bütüne daha yakındır.' },
                { id: 'comp5', left: '-2/3', right: '-5/6', correct: '>', note: '-2/3 = -4/6 olur. -4 > -5 olduğundan -2/3 > -5/6\'dır.' },
                { id: 'comp6', left: '-3/4', right: '-1/4', correct: '<', note: 'Negatiflerde 0\'a yakın olan daha büyüktür: -3 < -1.' }
              ].map((item, idx) => {
                const currentVal = (answers as any)[item.id];
                const isItemCorrect = currentVal === item.correct;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isChecked
                        ? isItemCorrect
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase font-mono">Soru 1.{idx + 1}</span>
                      <span className="text-[10px] text-slate-500 font-bold">5 Puan</span>
                    </div>

                    <div className="flex items-center justify-center gap-3 font-mono font-black text-sm">
                      <div className="min-w-[40px] text-center">
                        <MathFraction value={item.left} />
                      </div>

                      {/* Sembol Seçim Butonları */}
                      <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-300 dark:border-slate-700 gap-1 shadow-inner">
                        {['<', '=', '>'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              playSound('click');
                              setAnswers({ ...answers, [item.id]: s });
                            }}
                            className={`w-7 h-7 rounded-lg text-xs font-black transition-all cursor-pointer ${
                              currentVal === s
                                ? 'bg-sky-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>

                      <div className="min-w-[40px] text-center">
                        <MathFraction value={item.right} />
                      </div>
                    </div>

                    {revealSolutions && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-400">
                        <strong className="text-sky-600 dark:text-sky-400">Çözüm:</strong> Doğru: <strong>{item.correct}</strong> &bull; {item.note}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* GÖREV 2: RASYONEL SAYILARI SIRALAMA & SAYI DOĞRUSU (20 PUAN) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    GÖREV 2: Karışık Verilen Rasyonel Sayıları Küçükten Büyüğe Sıralayınız
                  </h4>
                  <p className="text-xs text-slate-500">
                    Sayılar: <strong className="font-mono text-slate-800 dark:text-slate-200">-3/4 , +1/3 , -1/2 , +5/6</strong>
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-black font-mono">
                20 Puan
              </span>
            </div>

            {/* Sayı Doğrusu Çizimi */}
            <div className="p-4 bg-slate-950 rounded-2xl text-white space-y-2">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Referans Sayı Doğrusu Modeli</span>
                <span className="font-mono text-indigo-300 font-bold">-1 &le; x &le; +1</span>
              </div>
              <div className="relative py-4">
                <div className="h-1 bg-slate-700 w-full rounded-full relative">
                  {/* -1 Noktası */}
                  <div className="absolute left-[5%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span className="text-[10px] font-mono text-slate-400 font-bold mt-1">-1</span>
                  </div>
                  {/* -3/4 */}
                  <div className="absolute left-[17.5%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-400/50" />
                    <span className="text-[10px] font-mono text-rose-300 font-bold mt-1">-3/4</span>
                  </div>
                  {/* -1/2 */}
                  <div className="absolute left-[30%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-400/50" />
                    <span className="text-[10px] font-mono text-amber-300 font-bold mt-1">-1/2</span>
                  </div>
                  {/* 0 Noktası */}
                  <div className="absolute left-[50%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-white ring-2 ring-slate-400" />
                    <span className="text-[10px] font-mono text-white font-black mt-1">0</span>
                  </div>
                  {/* +1/3 */}
                  <div className="absolute left-[66.6%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-sky-500 ring-2 ring-sky-400/50" />
                    <span className="text-[10px] font-mono text-sky-300 font-bold mt-1">+1/3</span>
                  </div>
                  {/* +5/6 */}
                  <div className="absolute left-[91.6%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-400/50" />
                    <span className="text-[10px] font-mono text-emerald-300 font-bold mt-1">+5/6</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sıralama Giriş Kutuları */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              {[
                { id: 'ord1', placeholder: 'En Küçük', expected: '-3/4' },
                { id: 'ord2', placeholder: '2. Sıra', expected: '-1/2' },
                { id: 'ord3', placeholder: '3. Sıra', expected: '1/3' },
                { id: 'ord4', placeholder: 'En Büyük', expected: '5/6' }
              ].map((box, bIdx) => (
                <React.Fragment key={box.id}>
                  <div className="flex-1 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder={box.placeholder}
                      value={(answers as any)[box.id]}
                      onChange={(e) => setAnswers({ ...answers, [box.id]: e.target.value })}
                      className={`w-full text-center font-mono font-bold text-sm px-3 py-2 rounded-xl border transition-all ${
                        isChecked
                          ? (answers as any)[box.id].trim().replace('+', '') === box.expected
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 text-emerald-800 dark:text-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 text-rose-800 dark:text-rose-200'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700'
                      }`}
                    />
                  </div>
                  {bIdx < 3 && (
                    <span className="font-mono font-black text-slate-400 text-lg px-1">&lt;</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {revealSolutions && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                <strong>Doğru Sıralama:</strong> -3/4 &lt; -1/2 &lt; 1/3 &lt; 5/6.
                (Negatiflerde -3/4 = -0.75, -1/2 = -0.50 olduğundan -0.75 daha küçüktür. Pozitiflerde 1/3 = 0.33 &lt; 5/6 = 0.83).
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ARKA YÜZ (DIŞ YÜZ): HATA DEDEKTİFİ, MÜHENDİSLİK PROBLEMİ & MAARİF RUBRİĞİ */}
      {/* ========================================================================= */}
      {(activeFace === 'back' || activeFace === 'both') && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* Arka Yüz Başlık Rozeti */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <span className="text-xs font-black text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              SAYFA 2 / ARKA YÜZ (DIŞ): Hata Dedektifi, Mühendislik Problemleri & Maarif Öz Değerlendirme
            </span>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              50 Puan (20P Dedektiflik + 30P Gerçek Yaşam)
            </span>
          </div>

          {/* GÖREV 3: HATA DEDEKTİFİ (KAVRAM YANILGILARI) (20 PUAN) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-black text-xs flex items-center justify-center">
                  3
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    GÖREV 3: Hata Dedektifi (Matematiksel Yanılgıyı Yakala)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Aşağıdaki öğrenci akıl yürütmelerindeki yanılgıyı tespit edip doğru açıklamayı işaretleyiniz:
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-black font-mono">
                20 Puan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Yanılgı 1 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black uppercase">
                    Dedektif Vakası #1
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">10 Puan</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-rose-300 dark:border-rose-800 text-xs text-slate-700 dark:text-slate-300 italic">
                  &ldquo;Ali diyor ki: <MathFraction value="2/7" /> kesri <MathFraction value="2/5" /> kesrinden büyüktür çünkü 7 sayısı 5&apos;ten büyüktür.&rdquo;
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                    Ali nerede hata yapmıştır?
                  </span>
                  {[
                    { key: 'A', text: 'Ali haklıdır, paydası büyük olan kesir her zaman daha büyüktür.' },
                    { key: 'B', text: 'Ali hata yapmıştır. Paylar eşitken bir bütün daha fazla parçaya bölündükçe her bir dilim küçülür; dolayısıyla 2/5 > 2/7 olmalıdır.' },
                    { key: 'C', text: 'Ali hata yapmıştır çünkü paydaları çarpmayı unutmuştur.' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setAnswers({ ...answers, det1: opt.key });
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-start gap-2 cursor-pointer ${
                        answers.det1 === opt.key
                          ? 'bg-sky-600 text-white font-bold shadow-sm'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                        answers.det1 === opt.key ? 'bg-sky-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Yanılgı 2 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black uppercase">
                    Dedektif Vakası #2
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">10 Puan</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-rose-300 dark:border-rose-800 text-xs text-slate-700 dark:text-slate-300 italic">
                  &ldquo;Ceren diyor ki: -4/5 sayısı -2/5 sayısından büyüktür çünkü 4 sayısı 2&apos;den büyüktür.&rdquo;
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                    Ceren nerede hata yapmıştır?
                  </span>
                  {[
                    { key: 'A', text: 'Ceren hata yapmıştır. Negatif sayılarda sıfıra daha yakın olan sayı daha büyüktür. Sayı doğrusunda -2/5 sıfıra daha yakındır (-2/5 > -4/5).' },
                    { key: 'B', text: 'Ceren haklıdır, pozitiflerdeki kural aynen geçerlidir.' },
                    { key: 'C', text: 'Ceren hata yapmıştır çünkü paydalar 5 olduğu için kesirler birbirine eşittir.' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setAnswers({ ...answers, det2: opt.key });
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-start gap-2 cursor-pointer ${
                        answers.det2 === opt.key
                          ? 'bg-sky-600 text-white font-bold shadow-sm'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                        answers.det2 === opt.key ? 'bg-sky-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* GÖREV 4: GERÇEK YAŞAM MÜHENDİSLİK PROBLEMLERİ (30 PUAN) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center justify-center">
                  4
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-emerald-600" />
                    GÖREV 4: Palandöken Mühendislik & İklim Problemleri
                  </h4>
                  <p className="text-xs text-slate-500">
                    Gerçek yaşam verileriyle sıralama yapıp doğru seçeneği işaretleyiniz:
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-black font-mono">
                30 Puan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Problem 1: Rüzgar Santrali Türbin Hızları */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-black uppercase flex items-center gap-1">
                    <Wind className="w-3 h-3" /> Problem 1: Türbin Kapasite Hızları
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">15 Puan</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Palandöken rüzgar santralinde 3 türbinin kapasite dönüş oranları ölçülmüştür:
                  <br />
                  &bull; <strong>A Türbini:</strong> <MathFraction value="5/8" /> kapasite
                  <br />
                  &bull; <strong>B Türbini:</strong> <MathFraction value="7/12" /> kapasite
                  <br />
                  &bull; <strong>C Türbini:</strong> <MathFraction value="3/4" /> kapasite
                  <br />
                  Türbinleri <strong>en yavaştan en hızlıya</strong> doğru sıralayınız:
                </p>
                <div className="space-y-2">
                  {[
                    { key: 'A', text: 'A < B < C (5/8 < 7/12 < 3/4)' },
                    { key: 'B', text: 'B < A < C (7/12 < 5/8 < 3/4)' },
                    { key: 'C', text: 'C < A < B (3/4 < 5/8 < 7/12)' },
                    { key: 'D', text: 'B < C < A (7/12 < 3/4 < 5/8)' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setAnswers({ ...answers, prob_turbine: opt.key });
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                        answers.prob_turbine === opt.key
                          ? 'bg-emerald-600 text-white font-bold shadow-sm'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                        answers.prob_turbine === opt.key ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Problem 2: Kayak Pisti Dondurucu Sıcaklıkları */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase flex items-center gap-1">
                    <Thermometer className="w-3 h-3" /> Problem 2: Pist Donma Dereceleri
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">15 Puan</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Palandöken kayak merkezindeki üç istasyonun gece sıcaklıkları şöyledir:
                  <br />
                  &bull; <strong>Kuzey Çanağı:</strong> -<MathFraction value="7/8" /> &deg;C
                  <br />
                  &bull; <strong>Ejder Zirvesi:</strong> -<MathFraction value="5/6" /> &deg;C
                  <br />
                  &bull; <strong>Güney Yamacı:</strong> -<MathFraction value="2/3" /> &deg;C
                  <br />
                  İstasyonları <strong>en soğuktan en ılık olana</strong> (küçükten büyüğe) doğru sıralayınız:
                </p>
                <div className="space-y-2">
                  {[
                    { key: 'A', text: 'Güney (-2/3) < Ejder (-5/6) < Kuzey (-7/8)' },
                    { key: 'B', text: 'Ejder (-5/6) < Kuzey (-7/8) < Güney (-2/3)' },
                    { key: 'C', text: 'Kuzey (-7/8) < Ejder (-5/6) < Güney (-2/3)' },
                    { key: 'D', text: 'Kuzey (-7/8) < Güney (-2/3) < Ejder (-5/6)' }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setAnswers({ ...answers, prob_temp: opt.key });
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                        answers.prob_temp === opt.key
                          ? 'bg-indigo-600 text-white font-bold shadow-sm'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                        answers.prob_temp === opt.key ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {revealSolutions && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div><strong>Türbin Çözümü (B):</strong> Payda 24&apos;te eşitlenir: B (14/24) &lt; A (15/24) &lt; C (18/24) &rArr; B &lt; A &lt; C.</div>
                <div><strong>Sıcaklık Çözümü (C):</strong> Payda 24&apos;te eşitlenir: -21/24 (Kuzey) &lt; -20/24 (Ejder) &lt; -16/24 (Güney). En soğuk olan -7/8&apos;dir.</div>
              </div>
            )}
          </div>

          {/* MAARİF MODELİ SÜREÇ & ÖZ DEĞERLENDİRME RUBRİĞİ */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Award className="w-5 h-5 text-amber-500" />
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  Türkiye Yüzyılı Maarif Modeli: Beceri ve Süreç Değerlendirme Rubriği
                </h4>
                <p className="text-xs text-slate-500">
                  Öğrencinin öz değerlendirmesi ve öğretmenin süreç gözlem notları (1: Geliştirilmeli, 4: Yetkin):
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { id: 'rubric_sdb12', code: 'SDB1.2', title: 'Kendini Tanıma & Öz Yansıtma', desc: 'Rasyonel sayılarda referans noktası (0, 1/2, 1) seçerken stratejilerimin farkındayım.' },
                { id: 'rubric_sdb22', code: 'SDB2.2', title: 'Sorumluluk & Süreç Yönetimi', desc: 'Negatif rasyonel sayıların sıfıra yakınlık ilkesini eksiksiz ve dikkatle uyguluyorum.' },
                { id: 'rubric_sdb33', code: 'SDB3.3', title: 'Eleştirel Düşünme & Akıl Yürütme', desc: 'Ezbere payda eşitlemek yerine durumun gerektirdiği en hızlı ve pratik yöntemi seçebiliyorum.' }
              ].map((crit) => (
                <div key={crit.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5 font-black text-slate-800 dark:text-slate-200">
                      <span className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-mono">{crit.code}</span>
                      <span>{crit.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{crit.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setAnswers({ ...answers, [crit.id]: level })}
                        className={`w-7 h-7 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          (answers as any)[crit.id] === level
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Öğretmen Gözlem Notu */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Öğretmen Değerlendirme & Geri Bildirim Notu:
              </label>
              <textarea
                rows={2}
                placeholder="Öğrencinin kavram yanılgılarını aşma düzeyi, akıl yürütme becerisi ve süreç notları..."
                value={answers.teacherFeedback}
                onChange={(e) => setAnswers({ ...answers, teacherFeedback: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

        </div>
      )}

      {/* 3. ALT DEĞERLENDİRME VE KONTROL AKSİYON BARI */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isChecked ? (
            <div className={`px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-2 ${
              score >= 75
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}>
              {score >= 75 ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-rose-600" />}
              <span>Etkinlik Puanı: {score} / 100</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-medium">
              Ön ve arka yüzdeki görevleri tamamladıktan sonra &ldquo;Etkinliği Kontrol Et&rdquo; butonuna basınız.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Temizle</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              setRevealSolutions(!revealSolutions);
            }}
            className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>{revealSolutions ? 'Çözümleri Gizle' : 'Çözümleri İncele'}</span>
          </button>

          <button
            type="button"
            onClick={handleCheck}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-md shadow-sky-600/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Etkinliği Kontrol Et</span>
          </button>
        </div>
      </div>

    </div>
  );
}

