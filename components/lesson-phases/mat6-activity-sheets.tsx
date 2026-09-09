'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Package,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Check,
  HelpCircle,
  Lightbulb,
  Truck,
  Grid,
  Layers,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

/* ========================================================================= */
/* 1. ETKİNLİK: ALAN MODELLERİ İLE ÇARPAN AVCILIĞI (MAT.6.1.1)               */
/* ========================================================================= */
export function AreaModelsActivityView() {
  const { playSound, addPoints, unlockBadge, role, showAnswers } = useApp();

  const [answers, setAnswers] = useState({
    rect2: '',
    rect3: '',
    rect4: '',
    totalCount24: '',
    div5_quot: '',
    div5_rem: '',
    div5_rect: '',
    div7_quot: '',
    div7_rem: '',
    div7_rect: '',
    count36: '',
    parity36: '',
    count48: '',
    parity48: ''
  });

  const [activeAreaModel, setActiveAreaModel] = useState<'1x24' | '2x12' | '3x8' | '4x6'>('2x12');
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [revealSolutions, setRevealSolutions] = useState(false);

  const handleCheck = () => {
    let earned = 0;
    // Section A (40 pts)
    if (answers.rect2.trim() === '12') earned += 10;
    if (answers.rect3.trim() === '8') earned += 10;
    if (answers.rect4.trim() === '6') earned += 10;
    if (answers.totalCount24.trim() === '8') earned += 10;

    // Section B (30 pts)
    if (answers.div5_quot.trim() === '4') earned += 5;
    if (answers.div5_rem.trim() === '4') earned += 5;
    if (answers.div5_rect.toLowerCase() === 'hayir') earned += 5;
    if (answers.div7_quot.trim() === '3') earned += 5;
    if (answers.div7_rem.trim() === '3') earned += 5;
    if (answers.div7_rect.toLowerCase() === 'hayir') earned += 5;

    // Section C (30 pts)
    if (answers.count36.trim() === '9') earned += 7.5;
    if (answers.parity36.toLowerCase() === 'tek') earned += 7.5;
    if (answers.count48.trim() === '10') earned += 7.5;
    if (answers.parity48.toLowerCase() === 'cift') earned += 7.5;

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
      rect2: '',
      rect3: '',
      rect4: '',
      totalCount24: '',
      div5_quot: '',
      div5_rem: '',
      div5_rect: '',
      div7_quot: '',
      div7_rem: '',
      div7_rect: '',
      count36: '',
      parity36: '',
      count48: '',
      parity48: ''
    });
    setIsChecked(false);
    setScore(0);
    setRevealSolutions(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* İNTERAKTİF DİKDÖRTGEN ALAN SİMÜLATÖRÜ BANNER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-orange-200 dark:border-orange-900/60 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center font-bold">
              📦
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                24 Birimkarelik Dikdörtgen Alan Simülatörü
              </h3>
              <p className="text-xs text-slate-500">
                Farklı çarpan ikililerini seçerek firesiz dikdörtgen modellerini inceleyiniz:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: '1x24', label: '1 × 24', w: 24, h: 1 },
              { id: '2x12', label: '2 × 12', w: 12, h: 2 },
              { id: '3x8', label: '3 × 8', w: 8, h: 3 },
              { id: '4x6', label: '4 × 6', w: 6, h: 4 }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  playSound('click');
                  setActiveAreaModel(m.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  activeAreaModel === m.id
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2D Grid Görseli */}
        <div className="bg-orange-50/50 dark:bg-slate-950/50 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex flex-col items-center justify-center overflow-x-auto min-h-[140px]">
          <div className="text-center mb-2">
            <span className="text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-100/80 dark:bg-orange-950/80 px-2.5 py-1 rounded-lg">
              {activeAreaModel === '1x24' && '1 Sıra × 24 Kutu = 24 Birimkare (En: 1, Boy: 24)'}
              {activeAreaModel === '2x12' && '2 Sıra × 12 Kutu = 24 Birimkare (En: 2, Boy: 12)'}
              {activeAreaModel === '3x8' && '3 Sıra × 8 Kutu = 24 Birimkare (En: 3, Boy: 8)'}
              {activeAreaModel === '4x6' && '4 Sıra × 6 Kutu = 24 Birimkare (En: 4, Boy: 6)'}
            </span>
          </div>

          {/* Grid Box */}
          <div
            className="grid gap-1 p-2 bg-white dark:bg-slate-800 rounded-xl border border-orange-300 dark:border-orange-700 shadow-inner"
            style={{
              gridTemplateColumns:
                activeAreaModel === '1x24'
                  ? 'repeat(24, minmax(10px, 16px))'
                  : activeAreaModel === '2x12'
                  ? 'repeat(12, minmax(18px, 24px))'
                  : activeAreaModel === '3x8'
                  ? 'repeat(8, minmax(24px, 32px))'
                  : 'repeat(6, minmax(32px, 40px))'
            }}
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-orange-400 to-amber-500 rounded-sm flex items-center justify-center text-[8px] font-black text-white shadow-xs"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* A BÖLÜMÜ: 24 BİRİMKARELİK ALAN MODELLERİ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs">
              A
            </span>
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm">
              24 Birimkarelik Alan Modelleri ve Çarpan İkilileri
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">
            40 Puan
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          24 adet özdeş yardım kutusu, tabanı dikdörtgen olacak şekilde firesiz dizilecektir. Boşlukları tamamlayınız:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* 1 */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-slate-800 dark:text-slate-200">1. Dikdörtgen:</div>
            <div className="text-slate-600 dark:text-slate-400 font-mono">1 sıra × 24 kutu ⟹ <strong>1 × 24 = 24</strong></div>
            <div className="text-orange-700 dark:text-orange-400 text-[11px] font-semibold">Çarpan Çifti: ( 1 , 24 )</div>
          </div>

          {/* 2 */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-slate-800 dark:text-slate-200">2. Dikdörtgen:</div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono">
              <span>2 sıra ×</span>
              <input
                type="text"
                placeholder="?"
                value={answers.rect2}
                onChange={(e) => setAnswers((prev) => ({ ...prev, rect2: e.target.value }))}
                className="w-12 px-2 py-0.5 text-center font-black bg-white dark:bg-slate-900 border-2 border-orange-300 rounded-lg outline-none focus:border-orange-500"
              />
              <span>kutu ⟹ 2 × {answers.rect2 || '..'} = 24</span>
            </div>
            <div className="text-orange-700 dark:text-orange-400 text-[11px] font-semibold">
              Çarpan Çifti: ( 2 , {answers.rect2 || '..'} )
            </div>
          </div>

          {/* 3 */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-slate-800 dark:text-slate-200">3. Dikdörtgen:</div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono">
              <span>3 sıra ×</span>
              <input
                type="text"
                placeholder="?"
                value={answers.rect3}
                onChange={(e) => setAnswers((prev) => ({ ...prev, rect3: e.target.value }))}
                className="w-12 px-2 py-0.5 text-center font-black bg-white dark:bg-slate-900 border-2 border-orange-300 rounded-lg outline-none focus:border-orange-500"
              />
              <span>kutu ⟹ 3 × {answers.rect3 || '..'} = 24</span>
            </div>
            <div className="text-orange-700 dark:text-orange-400 text-[11px] font-semibold">
              Çarpan Çifti: ( 3 , {answers.rect3 || '..'} )
            </div>
          </div>

          {/* 4 */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-slate-800 dark:text-slate-200">4. Dikdörtgen:</div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono">
              <span>4 sıra ×</span>
              <input
                type="text"
                placeholder="?"
                value={answers.rect4}
                onChange={(e) => setAnswers((prev) => ({ ...prev, rect4: e.target.value }))}
                className="w-12 px-2 py-0.5 text-center font-black bg-white dark:bg-slate-900 border-2 border-orange-300 rounded-lg outline-none focus:border-orange-500"
              />
              <span>kutu ⟹ 4 × {answers.rect4 || '..'} = 24</span>
            </div>
            <div className="text-orange-700 dark:text-orange-400 text-[11px] font-semibold">
              Çarpan Çifti: ( 4 , {answers.rect4 || '..'} )
            </div>
          </div>
        </div>

        {/* 24'ün tüm çarpanları */}
        <div className="p-3.5 bg-orange-50/70 dark:bg-orange-950/40 rounded-2xl border border-orange-200 dark:border-orange-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-700 dark:text-slate-300 font-medium">
            24 sayısının tüm pozitif çarpanları (küçükten büyüğe):{' '}
            <strong className="text-orange-900 dark:text-orange-300 font-mono">
              {'{'} 1, 2, 3, 4, 6, 8, 12, 24 {'}'}
            </strong>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-slate-700 dark:text-slate-300">Toplam Çarpan Sayısı:</span>
            <input
              type="text"
              placeholder="adet"
              value={answers.totalCount24}
              onChange={(e) => setAnswers((prev) => ({ ...prev, totalCount24: e.target.value }))}
              className="w-16 px-2 py-1 text-center font-black bg-white dark:bg-slate-900 border-2 border-orange-300 rounded-lg outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* B BÖLÜMÜ: FİRELİ ALAN DEDEKTİFİ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-black text-xs">
              B
            </span>
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm">
              Fireli Alan Dedektifi: Neden Çarpan Değildir?
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
            30 Puan
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          24 kutuyu 5'erli veya 7'şerli sıralar halinde dizmeye çalıştığımızda oluşan durumları analiz ediniz:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* 5'erli deneme */}
          <div className="p-4 bg-rose-50/40 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/60 space-y-3">
            <div className="font-black text-rose-900 dark:text-rose-300">5'erli Sıra Denemesi:</div>
            
            <div className="flex items-center gap-2 font-mono">
              <span>24 ÷ 5 =</span>
              <input
                type="text"
                placeholder="bölüm"
                value={answers.div5_quot}
                onChange={(e) => setAnswers((prev) => ({ ...prev, div5_quot: e.target.value }))}
                className="w-14 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-rose-300 rounded-md"
              />
              <span>(Kalan:</span>
              <input
                type="text"
                placeholder="kalan"
                value={answers.div5_rem}
                onChange={(e) => setAnswers((prev) => ({ ...prev, div5_rem: e.target.value }))}
                className="w-14 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-rose-300 rounded-md"
              />
              <span>)</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-rose-100 dark:border-rose-900/40">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Tam Dikdörtgen Oluşur mu?</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, div5_rect: 'evet' }))}
                  className={`px-3 py-1 rounded-lg font-bold text-xs ${
                    answers.div5_rect === 'evet' ? 'bg-rose-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700'
                  }`}
                >
                  Evet
                </button>
                <button
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, div5_rect: 'hayir' }))}
                  className={`px-3 py-1 rounded-lg font-bold text-xs ${
                    answers.div5_rect === 'hayir' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700'
                  }`}
                >
                  Hayır
                </button>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 italic">
              * Çıkarım: 5 sayısı 24'ü kalansız bölmediği (kalan 4 olduğu) için 24'ün bir çarpanı/böleni değildir.
            </div>
          </div>

          {/* 7'şerli deneme */}
          <div className="p-4 bg-rose-50/40 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/60 space-y-3">
            <div className="font-black text-rose-900 dark:text-rose-300">7'şerli Sıra Denemesi:</div>
            
            <div className="flex items-center gap-2 font-mono">
              <span>24 ÷ 7 =</span>
              <input
                type="text"
                placeholder="bölüm"
                value={answers.div7_quot}
                onChange={(e) => setAnswers((prev) => ({ ...prev, div7_quot: e.target.value }))}
                className="w-14 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-rose-300 rounded-md"
              />
              <span>(Kalan:</span>
              <input
                type="text"
                placeholder="kalan"
                value={answers.div7_rem}
                onChange={(e) => setAnswers((prev) => ({ ...prev, div7_rem: e.target.value }))}
                className="w-14 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-rose-300 rounded-md"
              />
              <span>)</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-rose-100 dark:border-rose-900/40">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Tam Dikdörtgen Oluşur mu?</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, div7_rect: 'evet' }))}
                  className={`px-3 py-1 rounded-lg font-bold text-xs ${
                    answers.div7_rect === 'evet' ? 'bg-rose-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700'
                  }`}
                >
                  Evet
                </button>
                <button
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, div7_rect: 'hayir' }))}
                  className={`px-3 py-1 rounded-lg font-bold text-xs ${
                    answers.div7_rect === 'hayir' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700'
                  }`}
                >
                  Hayır
                </button>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 italic">
              * Çıkarım: 7 sayısı 24'ü kalansız bölmediği (kalan 3 olduğu) için 24'ün bir çarpanı/böleni değildir.
            </div>
          </div>
        </div>
      </div>

      {/* C BÖLÜMÜ: 36 VE 48 ÇARPAN KARŞILAŞTIRMASI */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-black text-xs">
              C
            </span>
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm">
              36 ve 48 Sayılarının Çarpan ve Alan Karşılaştırması
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
            30 Puan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="p-3">Doğal Sayı</th>
                <th className="p-3">Tüm Pozitif Çarpanları</th>
                <th className="p-3 text-center">Çarpan Sayısı</th>
                <th className="p-3 text-center">Tek mi Çift mi?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <tr>
                <td className="p-3 font-bold text-teal-700 dark:text-teal-400">36 (Zeytinyağı)</td>
                <td className="p-3 text-slate-600 dark:text-slate-400">1, 2, 3, 4, 6, 9, 12, 18, 36</td>
                <td className="p-3 text-center">
                  <input
                    type="text"
                    placeholder="adet"
                    value={answers.count36}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, count36: e.target.value }))}
                    className="w-14 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-teal-300 rounded-md"
                  />
                </td>
                <td className="p-3 text-center">
                  <select
                    value={answers.parity36}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, parity36: e.target.value }))}
                    className="px-2 py-0.5 font-bold bg-white dark:bg-slate-900 border border-teal-300 rounded-md text-xs"
                  >
                    <option value="">Seçiniz</option>
                    <option value="tek">Tek</option>
                    <option value="cift">Çift</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-700 dark:text-blue-400">48 (Mercimek)</td>
                <td className="p-3 text-slate-600 dark:text-slate-400">1, 2, 3, 4, 6, 8, 12, 16, 24, 48</td>
                <td className="p-3 text-center">
                  <input
                    type="text"
                    placeholder="adet"
                    value={answers.count48}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, count48: e.target.value }))}
                    className="w-14 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-blue-300 rounded-md"
                  />
                </td>
                <td className="p-3 text-center">
                  <select
                    value={answers.parity48}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, parity48: e.target.value }))}
                    className="px-2 py-0.5 font-bold bg-white dark:bg-slate-900 border border-blue-300 rounded-md text-xs"
                  >
                    <option value="">Seçiniz</option>
                    <option value="tek">Tek</option>
                    <option value="cift">Çift</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-900 dark:text-amber-300">
          💡 <strong>Neden 36'nın çarpan sayısı tektir?</strong> Çünkü 36 tam kare bir sayıdır ($6\times 6=36$). Ortadaki 6 sayısı kendisiyle eşleştiği için çarpan kümesinde yalnızca bir kez yazılır.
        </div>
      </div>

      {/* PUANLAMA & KONTROL EYLEM BARI */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCheck}
            className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Etkinliği Kontrol Et & Puanla</span>
          </button>

          {(role === 'teacher' || showAnswers) && (
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setRevealSolutions(!revealSolutions);
              }}
              className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>{revealSolutions ? 'Cevapları Gizle' : 'Cevap Anahtarı'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all"
            title="Sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {isChecked && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 text-xs font-black text-orange-900 dark:text-orange-300 animate-in fade-in">
            <Award className="w-4 h-4 text-orange-600" />
            <span>Puanınız: {score} / 100</span>
          </div>
        )}
      </div>

      {revealSolutions && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-2xl text-xs space-y-1.5 animate-in fade-in text-slate-800 dark:text-slate-200">
          <div className="font-black text-amber-900 dark:text-amber-300 uppercase tracking-wide">
            🔑 Cevap Anahtarı:
          </div>
          <div>• 2. Dikdörtgen: 12 (2×12=24) | 3. Dikdörtgen: 8 (3×8=24) | 4. Dikdörtgen: 6 (4×6=24) | Toplam: 8 adet</div>
          <div>• 5'e bölme: Bölüm 4, Kalan 4 (Tam dikdörtgen: Hayır) | 7'ye bölme: Bölüm 3, Kalan 3 (Tam dikdörtgen: Hayır)</div>
          <div>• 36'nın çarpan sayısı: 9 (Tek) | 48'in çarpan sayısı: 10 (Çift)</div>
        </div>
      )}

    </div>
  );
}

/* ========================================================================= */
/* 2. ETKİNLİK: RİTMİK SIÇRAMA VE KATLAR ÇİZGİSİ (MAT.6.1.1)                 */
/* ========================================================================= */
export function RhythmicJumpsActivityView() {
  const { playSound, addPoints, unlockBadge, role, showAnswers } = useApp();

  const [answers, setAnswers] = useState({
    mult12_3: '',
    mult12_5: '',
    mult12_7: '',
    mult12_9: '',
    max12_100: '',
    mult8_3: '',
    mult8_5: '',
    mult8_7: '',
    mult8_9: '',
    mult8_range: '',
    bus1: '',
    bus2: '',
    bus3: '',
    busRule: '',
    tf1: '',
    tf2: '',
    tf3: '',
    tf4: ''
  });

  const [selectedJumpStep, setSelectedJumpStep] = useState<number>(12);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [revealSolutions, setRevealSolutions] = useState(false);

  const handleCheck = () => {
    let earned = 0;
    // Section A (40 pts)
    if (answers.mult12_3.trim() === '36') earned += 4;
    if (answers.mult12_5.trim() === '60') earned += 4;
    if (answers.mult12_7.trim() === '84') earned += 4;
    if (answers.mult12_9.trim() === '108') earned += 4;
    if (answers.max12_100.trim() === '96') earned += 4;

    if (answers.mult8_3.trim() === '24') earned += 4;
    if (answers.mult8_5.trim() === '40') earned += 4;
    if (answers.mult8_7.trim() === '56') earned += 4;
    if (answers.mult8_9.trim() === '72') earned += 4;
    if (answers.mult8_range.trim().includes('56') || answers.mult8_range.trim().includes('64') || answers.mult8_range.trim().includes('72')) earned += 4;

    // Section B (30 pts)
    if (answers.bus1.trim() === '24') earned += 7.5;
    if (answers.bus2.trim() === '48') earned += 7.5;
    if (answers.bus3.trim() === '72') earned += 7.5;
    if (answers.busRule.toLowerCase() === 'dogru') earned += 7.5;

    // Section C (30 pts)
    if (answers.tf1 === 'D') earned += 7.5;
    if (answers.tf2 === 'Y') earned += 7.5;
    if (answers.tf3 === 'D') earned += 7.5;
    if (answers.tf4 === 'D') earned += 7.5;

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
      mult12_3: '',
      mult12_5: '',
      mult12_7: '',
      mult12_9: '',
      max12_100: '',
      mult8_3: '',
      mult8_5: '',
      mult8_7: '',
      mult8_9: '',
      mult8_range: '',
      bus1: '',
      bus2: '',
      bus3: '',
      busRule: '',
      tf1: '',
      tf2: '',
      tf3: '',
      tf4: ''
    });
    setIsChecked(false);
    setScore(0);
    setRevealSolutions(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* İNTERAKTİF SAYI DOĞRUSU SIÇRAMA SİMÜLATÖRÜ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-teal-200 dark:border-teal-900/60 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center font-bold">
              🐸
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                Sayı Doğrusunda Ritmik Sıçrama Simülatörü
              </h3>
              <p className="text-xs text-slate-500">
                Adım büyüklüğünü seçerek sayı doğrusundaki kat duraklarını takip ediniz:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[6, 8, 12].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => {
                  playSound('click');
                  setSelectedJumpStep(step);
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  selectedJumpStep === step
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {step}'şar Adım
              </button>
            ))}
          </div>
        </div>

        {/* Sayı Doğrusu Çizimi */}
        <div className="bg-teal-50/50 dark:bg-slate-950/50 p-4 rounded-2xl border border-teal-100 dark:border-teal-900/30 overflow-x-auto">
          <div className="min-w-[600px] py-4">
            <div className="relative h-16 flex items-center">
              {/* Ana Çizgi */}
              <div className="absolute left-0 right-0 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
              
              {/* Duraklar */}
              {Array.from({ length: 11 }).map((_, i) => {
                const val = i * selectedJumpStep;
                const isCommon = val > 0 && val % 24 === 0;
                return (
                  <div
                    key={i}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${(i / 10) * 94 + 3}%` }}
                  >
                    {/* Zıplayan ikon */}
                    {i > 0 && (
                      <span className="text-xs mb-1 animate-bounce">
                        {isCommon ? '⭐' : '📍'}
                      </span>
                    )}
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 ${
                        isCommon
                          ? 'bg-purple-600 border-white ring-2 ring-purple-400'
                          : 'bg-teal-500 border-white ring-2 ring-teal-200'
                      }`}
                    />
                    <span className="text-[10px] font-black font-mono mt-1 text-slate-700 dark:text-slate-300">
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-center text-[11px] text-teal-800 dark:text-teal-300 font-semibold mt-2">
            ⭐ Mor yıldızlı duraklar (24, 48, 72...) 6, 8 ve 12 sayılarının ORTAK KATLARIDIR.
          </div>
        </div>
      </div>

      {/* A BÖLÜMÜ: 12 VE 8'İN KATLARI */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-black text-xs">
              A
            </span>
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm">
              Sayı Doğrusunda 12'nin ve 8'in İlk 10 Katı
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
            40 Puan
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Her 12 dakikada bir kalkan yardım tırlarının kalkış dakikalarını ve 8'er metrelik fidan noktalarını tamamlayınız:
        </p>

        <div className="space-y-3 text-xs">
          {/* 12'nin Katları */}
          <div className="p-4 bg-teal-50/60 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-900/50 space-y-2">
            <div className="font-bold text-teal-900 dark:text-teal-200">12'nin Pozitif Katları:</div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-slate-700 dark:text-slate-300">
              <span>12, 24,</span>
              <input
                type="text"
                placeholder="?"
                value={answers.mult12_3}
                onChange={(e) => setAnswers((prev) => ({ ...prev, mult12_3: e.target.value }))}
                className="w-12 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-teal-400 rounded-md"
              />
              <span>, 48,</span>
              <input
                type="text"
                placeholder="?"
                value={answers.mult12_5}
                onChange={(e) => setAnswers((prev) => ({ ...prev, mult12_5: e.target.value }))}
                className="w-12 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-teal-400 rounded-md"
              />
              <span>, 72,</span>
              <input
                type="text"
                placeholder="?"
                value={answers.mult12_7}
                onChange={(e) => setAnswers((prev) => ({ ...prev, mult12_7: e.target.value }))}
                className="w-12 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-teal-400 rounded-md"
              />
              <span>, 96,</span>
              <input
                type="text"
                placeholder="?"
                value={answers.mult12_9}
                onChange={(e) => setAnswers((prev) => ({ ...prev, mult12_9: e.target.value }))}
                className="w-12 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-teal-400 rounded-md"
              />
              <span>, 120...</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-slate-600 dark:text-slate-400">12'nin 100'den küçük en büyük katı:</span>
              <input
                type="text"
                placeholder="sayı"
                value={answers.max12_100}
                onChange={(e) => setAnswers((prev) => ({ ...prev, max12_100: e.target.value }))}
                className="w-14 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-teal-400 rounded-md"
              />
            </div>
          </div>

          {/* 8'in Katları */}
          <div className="p-4 bg-teal-50/60 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-900/50 space-y-2">
            <div className="font-bold text-teal-900 dark:text-teal-200">8'in Pozitif Katları:</div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-slate-700 dark:text-slate-300">
              <span>8, 16,</span>
              <input
                type="text"
                placeholder="?"
                value={answers.mult8_3}
                onChange={(e) => setAnswers((prev) => ({ ...prev, mult8_3: e.target.value }))}
                className="w-12 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-teal-400 rounded-md"
              />
              <span>, 32,</span>
              <input
                type="text"
                placeholder="?"
                value={answers.mult8_5}
                onChange={(e) => setAnswers((prev) => ({ ...prev, mult8_5: e.target.value }))}
                className="w-12 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-teal-400 rounded-md"
              />
              <span>, 48,</span>
              <input
                type="text"
                placeholder="?"
                value={answers.mult8_7}
                onChange={(e) => setAnswers((prev) => ({ ...prev, mult8_7: e.target.value }))}
                className="w-12 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-teal-400 rounded-md"
              />
              <span>, 64,</span>
              <input
                type="text"
                placeholder="?"
                value={answers.mult8_9}
                onChange={(e) => setAnswers((prev) => ({ ...prev, mult8_9: e.target.value }))}
                className="w-12 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-teal-400 rounded-md"
              />
              <span>, 80...</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-slate-600 dark:text-slate-400">8'in 50 ile 90 arasındaki katları:</span>
              <input
                type="text"
                placeholder="Örn: 56, 64, 72, 80, 88"
                value={answers.mult8_range}
                onChange={(e) => setAnswers((prev) => ({ ...prev, mult8_range: e.target.value }))}
                className="w-64 px-2 py-0.5 text-center font-bold bg-white dark:bg-slate-900 border border-teal-400 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* B BÖLÜMÜ: ORTAK İYİLİK SEFERLERİ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs">
              B
            </span>
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm">
              Ortak İyilik Seferleri (Ortak Kat Keşfi)
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            30 Puan
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Aşevinden sıcak yemek servisi yapan Minibüs 1 her 6 dakikada bir, Minibüs 2 her 8 dakikada bir merkezden hareket etmektedir:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900/50 space-y-2">
            <div className="font-bold text-purple-900 dark:text-purple-300">1. Ortak Sefer Dakikası:</div>
            <div className="flex items-center gap-1.5 font-mono">
              <input
                type="text"
                placeholder="dk"
                value={answers.bus1}
                onChange={(e) => setAnswers((prev) => ({ ...prev, bus1: e.target.value }))}
                className="w-16 px-2 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-purple-300 rounded-md"
              />
              <span>. dakika</span>
            </div>
          </div>

          <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900/50 space-y-2">
            <div className="font-bold text-purple-900 dark:text-purple-300">2. Ortak Sefer Dakikası:</div>
            <div className="flex items-center gap-1.5 font-mono">
              <input
                type="text"
                placeholder="dk"
                value={answers.bus2}
                onChange={(e) => setAnswers((prev) => ({ ...prev, bus2: e.target.value }))}
                className="w-16 px-2 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-purple-300 rounded-md"
              />
              <span>. dakika</span>
            </div>
          </div>

          <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900/50 space-y-2">
            <div className="font-bold text-purple-900 dark:text-purple-300">3. Ortak Sefer Dakikası:</div>
            <div className="flex items-center gap-1.5 font-mono">
              <input
                type="text"
                placeholder="dk"
                value={answers.bus3}
                onChange={(e) => setAnswers((prev) => ({ ...prev, bus3: e.target.value }))}
                className="w-16 px-2 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-purple-300 rounded-md"
              />
              <span>. dakika</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Sonuç Çıkarımı: İki sayının ortak katları, en küçük ortak katın (24) katları şeklinde (24, 48, 72...) devam eder:
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setAnswers((prev) => ({ ...prev, busRule: 'dogru' }))}
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
                answers.busRule === 'dogru' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700'
              }`}
            >
              Doğru
            </button>
            <button
              type="button"
              onClick={() => setAnswers((prev) => ({ ...prev, busRule: 'yanlis' }))}
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
                answers.busRule === 'yanlis' ? 'bg-rose-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700'
              }`}
            >
              Yanlış
            </button>
          </div>
        </div>
      </div>

      {/* C BÖLÜMÜ: DOĞRU / YANLIŞ ÖNERMELERİ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs">
              C
            </span>
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm">
              Matematiksel Akıl Yürütme (Doğru / Yanlış)
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            30 Puan
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {[
            {
              id: 'tf1',
              text: '1. Bir doğal sayının pozitif çarpan sayısı sınırlıdır fakat pozitif katları sonsuzdur.'
            },
            {
              id: 'tf2',
              text: '2. Bir doğal sayının en küçük pozitif katı 0\'dır.'
            },
            {
              id: 'tf3',
              text: '3. 7 × 9 = 63 eşitliğinde 63 sayısı 7 ve 9\'un bir katıdır.'
            },
            {
              id: 'tf4',
              text: '4. 15 sayısının 100\'den küçük kat sayısı toplam 6 adettir (15, 30, 45, 60, 75, 90).'
            }
          ].map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
            >
              <span className="text-slate-700 dark:text-slate-300 font-medium">{item.text}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: 'D' }))}
                  className={`w-8 h-7 rounded-lg font-black text-xs ${
                    answers[item.id as keyof typeof answers] === 'D'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 border border-slate-300'
                  }`}
                >
                  D
                </button>
                <button
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: 'Y' }))}
                  className={`w-8 h-7 rounded-lg font-black text-xs ${
                    answers[item.id as keyof typeof answers] === 'Y'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 border border-slate-300'
                  }`}
                >
                  Y
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PUANLAMA & KONTROL EYLEM BARI */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCheck}
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Etkinliği Kontrol Et & Puanla</span>
          </button>

          {(role === 'teacher' || showAnswers) && (
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setRevealSolutions(!revealSolutions);
              }}
              className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>{revealSolutions ? 'Cevapları Gizle' : 'Cevap Anahtarı'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all"
            title="Sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {isChecked && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 text-xs font-black text-teal-900 dark:text-teal-300 animate-in fade-in">
            <Award className="w-4 h-4 text-teal-600" />
            <span>Puanınız: {score} / 100</span>
          </div>
        )}
      </div>

      {revealSolutions && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-2xl text-xs space-y-1.5 animate-in fade-in text-slate-800 dark:text-slate-200">
          <div className="font-black text-amber-900 dark:text-amber-300 uppercase tracking-wide">
            🔑 Cevap Anahtarı:
          </div>
          <div>• 12'nin katları: 36, 60, 84, 108 (100'den küçük en büyük: 96)</div>
          <div>• 8'in katları: 24, 40, 56, 72 (50-90 arası: 56, 64, 72, 80, 88)</div>
          <div>• Minibüs ortak seferleri: 24, 48, 72. dakika (Kural: Doğru)</div>
          <div>• Doğru/Yanlış: 1. D, 2. Y (en küçük pozitif kat kendisidir), 3. D, 4. D</div>
        </div>
      )}

    </div>
  );
}

/* ========================================================================= */
/* 3. ETKİNLİK: ÇARPAN GÖKKUŞAĞI ŞİFRESİ VE PROBLEM ÇÖZME (MAT.6.1.1)        */
/* ========================================================================= */
export function RainbowCipherActivityView() {
  const { playSound, addPoints, unlockBadge, role, showAnswers } = useApp();

  const [answers, setAnswers] = useState({
    cipher_a: '',
    cipher_b: '',
    cipher_c: '',
    cipher_sum: '',
    prob1_can: '',
    prob2_count: '',
    sq100_center: '',
    sq100_parity: '',
    sq_rule: ''
  });

  const [activeArcIndex, setActiveArcIndex] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [revealSolutions, setRevealSolutions] = useState(false);

  const rainbowPairs = [
    { left: '1', right: '60', color: '#dc2626', label: '1 × 60 = 60' },
    { left: '2', right: '30 (C)', color: '#ea580c', label: '2 × C = 60 ⟹ C = 30' },
    { left: '3', right: '20', color: '#d97706', label: '3 × 20 = 60' },
    { left: '4 (A)', right: '15 (B)', color: '#16a34a', label: 'A × B = 60 ⟹ 4 × 15 = 60' },
    { left: '5', right: '12', color: '#0284c7', label: '5 × 12 = 60' },
    { left: '6', right: '10', color: '#7c3aed', label: '6 × 10 = 60' }
  ];

  const handleCheck = () => {
    let earned = 0;
    // Section A (40 pts)
    if (answers.cipher_a.trim() === '4') earned += 10;
    if (answers.cipher_b.trim() === '15') earned += 10;
    if (answers.cipher_c.trim() === '30') earned += 10;
    if (answers.cipher_sum.trim() === '49') earned += 10;

    // Section B (30 pts)
    if (answers.prob1_can.toLowerCase() === 'hayir') earned += 15;
    if (
      answers.prob2_count.includes('15') ||
      answers.prob2_count.includes('18') ||
      answers.prob2_count.includes('15, 18') ||
      answers.prob2_count.includes('15 ve 18')
    ) earned += 15;

    // Section C (30 pts)
    if (answers.sq100_center.trim() === '10') earned += 10;
    if (answers.sq100_parity.toLowerCase() === 'tek') earned += 10;
    if (answers.sq_rule.toLowerCase().includes('tam kare') || answers.sq_rule.toLowerCase().includes('tamkare')) earned += 10;

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
      cipher_a: '',
      cipher_b: '',
      cipher_c: '',
      cipher_sum: '',
      prob1_can: '',
      prob2_count: '',
      sq100_center: '',
      sq100_parity: '',
      sq_rule: ''
    });
    setIsChecked(false);
    setScore(0);
    setRevealSolutions(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* İNTERAKTİF GÖKKUŞAĞI SİMÜLATÖRÜ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-purple-200 dark:border-purple-900/60 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
              🌈
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                60 Sayısının Çarpan Gökkuşağı Simülatörü
              </h3>
              <p className="text-xs text-slate-500">
                Yayların üzerine tıklayarak eşleşen çarpan ikililerini keşfediniz:
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
            Tüm Çarpımlar = 60
          </span>
        </div>

        {/* SVG Rainbow Arc Visualizer */}
        <div className="bg-purple-50/40 dark:bg-slate-950/50 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/30">
          <svg viewBox="0 0 600 160" className="w-full h-auto select-none">
            {/* Arcs */}
            {[
              { d: 'M 40 130 Q 300 0 560 130', color: '#dc2626', idx: 0 },
              { d: 'M 80 130 Q 300 20 520 130', color: '#ea580c', idx: 1 },
              { d: 'M 120 130 Q 300 40 480 130', color: '#d97706', idx: 2 },
              { d: 'M 160 130 Q 300 60 440 130', color: '#16a34a', idx: 3 },
              { d: 'M 200 130 Q 300 80 400 130', color: '#0284c7', idx: 4 },
              { d: 'M 240 130 Q 300 100 360 130', color: '#7c3aed', idx: 5 }
            ].map((arc) => (
              <path
                key={arc.idx}
                d={arc.d}
                fill="none"
                stroke={arc.color}
                strokeWidth={activeArcIndex === arc.idx ? 4 : 2.5}
                strokeOpacity={activeArcIndex === null || activeArcIndex === arc.idx ? 1 : 0.25}
                className="cursor-pointer transition-all hover:stroke-[4.5px]"
                onClick={() => {
                  playSound('select');
                  setActiveArcIndex(arc.idx);
                }}
              />
            ))}

            {/* Sayı Durakları */}
            {[
              { x: 40, label: '1', sub: '1' },
              { x: 80, label: '2', sub: '2' },
              { x: 120, label: '3', sub: '3' },
              { x: 160, label: 'A', sub: '4', isHidden: true },
              { x: 200, label: '5', sub: '5' },
              { x: 240, label: '6', sub: '6' },
              { x: 360, label: '10', sub: '10' },
              { x: 400, label: '12', sub: '12' },
              { x: 440, label: 'B', sub: '15', isHidden: true },
              { x: 480, label: '20', sub: '20' },
              { x: 520, label: 'C', sub: '30', isHidden: true },
              { x: 560, label: '60', sub: '60' }
            ].map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={130}
                  r={12}
                  className={
                    pt.isHidden
                      ? 'fill-purple-600 stroke-white stroke-2'
                      : 'fill-white dark:fill-slate-800 stroke-slate-400 stroke-2'
                  }
                />
                <text
                  x={pt.x}
                  y={134}
                  textAnchor="middle"
                  className={`text-[11px] font-black font-mono ${
                    pt.isHidden ? 'fill-white' : 'fill-slate-800 dark:fill-slate-200'
                  }`}
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Aktif Yay Açıklama */}
          <div className="text-center mt-2">
            <span className="text-xs font-bold text-purple-900 dark:text-purple-200 bg-purple-100 dark:bg-purple-950/80 px-3 py-1 rounded-xl">
              {activeArcIndex !== null
                ? rainbowPairs[activeArcIndex].label
                : 'Yukarıdaki yaylardan birine tıklayarak çarpan eşitliğini inceleyiniz.'}
            </span>
          </div>
        </div>
      </div>

      {/* A BÖLÜMÜ: 60 SAYISININ ÇARPAN GÖKKUŞAĞI VE HARF ŞİFRESİ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs">
              A
            </span>
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm">
              60 Sayısının Çarpan Gökkuşağı ve Harf Şifresi
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            40 Puan
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          60 sayısının tüm çarpanları küçükten büyüğe sıralanmıştır. Gökkuşağı simetrisini kullanarak harflerin değerlerini bulunuz:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-rose-50/50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-2">
            <div className="font-bold text-rose-900 dark:text-rose-300">A Çarpanı (4. sıra):</div>
            <div className="flex items-center gap-2 font-mono">
              <span>A =</span>
              <input
                type="text"
                placeholder="değer"
                value={answers.cipher_a}
                onChange={(e) => setAnswers((prev) => ({ ...prev, cipher_a: e.target.value }))}
                className="w-16 px-2 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-rose-300 rounded-md"
              />
            </div>
            <div className="text-[10px] text-slate-500">15 ile eşleşir (4 × 15 = 60)</div>
          </div>

          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/50 space-y-2">
            <div className="font-bold text-blue-900 dark:text-blue-300">B Çarpanı (9. sıra):</div>
            <div className="flex items-center gap-2 font-mono">
              <span>B =</span>
              <input
                type="text"
                placeholder="değer"
                value={answers.cipher_b}
                onChange={(e) => setAnswers((prev) => ({ ...prev, cipher_b: e.target.value }))}
                className="w-16 px-2 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-blue-300 rounded-md"
              />
            </div>
            <div className="text-[10px] text-slate-500">4 ile eşleşir (4 × 15 = 60)</div>
          </div>

          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-2">
            <div className="font-bold text-emerald-900 dark:text-emerald-300">C Çarpanı (11. sıra):</div>
            <div className="flex items-center gap-2 font-mono">
              <span>C =</span>
              <input
                type="text"
                placeholder="değer"
                value={answers.cipher_c}
                onChange={(e) => setAnswers((prev) => ({ ...prev, cipher_c: e.target.value }))}
                className="w-16 px-2 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-emerald-300 rounded-md"
              />
            </div>
            <div className="text-[10px] text-slate-500">2 ile eşleşir (2 × 30 = 60)</div>
          </div>
        </div>

        {/* Şifre Toplamı */}
        <div className="p-3.5 bg-purple-50/70 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-purple-950 dark:text-purple-200">
            Şifre Kodu: <strong>A + B + C</strong> toplamını hesaplayınız:
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-600 dark:text-slate-400">
              {answers.cipher_a || '..'} + {answers.cipher_b || '..'} + {answers.cipher_c || '..'} =
            </span>
            <input
              type="text"
              placeholder="toplam"
              value={answers.cipher_sum}
              onChange={(e) => setAnswers((prev) => ({ ...prev, cipher_sum: e.target.value }))}
              className="w-16 px-2 py-1 text-center font-black bg-white dark:bg-slate-900 border-2 border-purple-400 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* B BÖLÜMÜ: GERÇEK HAYAT PROBLEM ÇÖZÜMLERİ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs">
              B
            </span>
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm">
              Gerçek Hayat Problem Çözümleri
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">
            30 Puan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Problem 1 */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="font-bold text-slate-900 dark:text-slate-100">
              1. Problem (72 Öğrenci Grubu):
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              72 öğrenci bir törende her grupta eşit sayıda öğrenci olacak şekilde sıralanacaktır. Grup sayısı 5 veya 7 olabilir mi?
            </p>
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-700 dark:text-slate-300">5 veya 7 olabilir mi?</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, prob1_can: 'evet' }))}
                  className={`px-3 py-1 rounded-lg font-bold text-xs ${
                    answers.prob1_can === 'evet' ? 'bg-rose-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-700'
                  }`}
                >
                  Evet
                </button>
                <button
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, prob1_can: 'hayir' }))}
                  className={`px-3 py-1 rounded-lg font-bold text-xs ${
                    answers.prob1_can === 'hayir' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-700'
                  }`}
                >
                  Hayır (Olamaz)
                </button>
              </div>
            </div>
            <div className="text-[10.5px] text-slate-500 italic">
              * Gerekçe: 5 ve 7, 72'nin kalansız böleni (çarpanı) değildir.
            </div>
          </div>

          {/* Problem 2 */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="font-bold text-slate-900 dark:text-slate-100">
              2. Problem (90 Kitaplık Raf):
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Bir kütüphaneci 90 kitabı her rafta eşit sayıda olacak şekilde diziyor. Raftaki kitap sayısı 10'dan fazla, 20'den az ise rafta kaç kitap vardır?
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Olası Kitap Sayıları:</span>
              <input
                type="text"
                placeholder="Örn: 15, 18"
                value={answers.prob2_count}
                onChange={(e) => setAnswers((prev) => ({ ...prev, prob2_count: e.target.value }))}
                className="w-36 px-2 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-orange-300 rounded-md"
              />
            </div>
            <div className="text-[10.5px] text-slate-500 italic">
              * 90'ın 10 ile 20 arasındaki çarpanları 15 ve 18'dir.
            </div>
          </div>
        </div>
      </div>

      {/* C BÖLÜMÜ: TAM KARE GİZEMİ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
              C
            </span>
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm">
              Tam Kare Gizemi ve Çarpan Sayısı Kuralı
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            30 Puan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-2">
            <div className="font-bold text-emerald-900 dark:text-emerald-300">100 Sayısının Ortadaki Çarpanı:</div>
            <div className="flex items-center gap-1.5 font-mono">
              <input
                type="text"
                placeholder="çarpan"
                value={answers.sq100_center}
                onChange={(e) => setAnswers((prev) => ({ ...prev, sq100_center: e.target.value }))}
                className="w-16 px-2 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-emerald-300 rounded-md"
              />
              <span>(10 × 10 = 100)</span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-2">
            <div className="font-bold text-emerald-900 dark:text-emerald-300">100'ün Çarpan Sayısı Türü:</div>
            <select
              value={answers.sq100_parity}
              onChange={(e) => setAnswers((prev) => ({ ...prev, sq100_parity: e.target.value }))}
              className="w-full px-2 py-1 font-bold bg-white dark:bg-slate-900 border border-emerald-300 rounded-md text-xs"
            >
              <option value="">Seçiniz</option>
              <option value="tek">Tek (9 Adet)</option>
              <option value="cift">Çift</option>
            </select>
          </div>

          <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-2">
            <div className="font-bold text-emerald-900 dark:text-emerald-300">Hangi Sayıların Çarpanı Tektir?</div>
            <input
              type="text"
              placeholder="Kuralı yazınız (Örn: Tam Kare)"
              value={answers.sq_rule}
              onChange={(e) => setAnswers((prev) => ({ ...prev, sq_rule: e.target.value }))}
              className="w-full px-2 py-1 font-bold bg-white dark:bg-slate-900 border border-emerald-300 rounded-md text-xs"
            />
          </div>
        </div>
      </div>

      {/* PUANLAMA & KONTROL EYLEM BARI */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCheck}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Etkinliği Kontrol Et & Puanla</span>
          </button>

          {(role === 'teacher' || showAnswers) && (
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setRevealSolutions(!revealSolutions);
              }}
              className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>{revealSolutions ? 'Cevapları Gizle' : 'Cevap Anahtarı'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all"
            title="Sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {isChecked && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 text-xs font-black text-purple-900 dark:text-purple-300 animate-in fade-in">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Puanınız: {score} / 100</span>
          </div>
        )}
      </div>

      {revealSolutions && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-2xl text-xs space-y-1.5 animate-in fade-in text-slate-800 dark:text-slate-200">
          <div className="font-black text-amber-900 dark:text-amber-300 uppercase tracking-wide">
            🔑 Cevap Anahtarı:
          </div>
          <div>• A = 4, B = 15, C = 30 ⟹ Toplam: 4 + 15 + 30 = 49</div>
          <div>• Problem 1: Hayır (5 ve 7, 72'yi kalansız bölmez) | Problem 2: 15 ve 18</div>
          <div>• 100'ün ortadaki çarpanı: 10 | Çarpan Sayısı: Tek (9 adet) | Kural: Tam Kare Sayılar</div>
        </div>
      )}

    </div>
  );
}
