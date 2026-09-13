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
  ShieldAlert
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
