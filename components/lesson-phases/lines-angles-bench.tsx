'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  FlaskConical,
  Ruler,
  Maximize2,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Zap,
  HelpCircle,
  Layers,
  Compass,
  Move,
  Check,
  Target,
  Sliders,
  Table,
  Eye,
  Info
} from 'lucide-react';

export function LinesAnglesBench() {
  const { playSound, addPoints, unlockBadge } = useApp();

  const [activeExp, setActiveExp] = useState<1 | 2 | 3>(1);

  // ==========================================
  // EXP 1: Kesişen İki Doğru & Ters Açılar (MAB3 Tablo Temsili)
  // ==========================================
  const [exp1AngleDeg, setExp1AngleDeg] = useState(65); // Angle between d1 and d2
  const [exp1DeductionRevealed, setExp1DeductionRevealed] = useState(false);
  const [exp1Completed, setExp1Completed] = useState(false);

  // ==========================================
  // EXP 2: Dik Doğrular & Tümler Açılar (d1 ⊥ d2)
  // ==========================================
  const [exp2SplitDeg, setExp2SplitDeg] = useState(35); // Splitting ray angle within 90°
  const [exp2DeductionRevealed, setExp2DeductionRevealed] = useState(false);
  const [exp2Completed, setExp2Completed] = useState(false);

  // ==========================================
  // EXP 3: İki Paralel Doğru ve Bir Kesen Doğru (8 Açı)
  // ==========================================
  const [exp3TransversalDeg, setExp3TransversalDeg] = useState(55); // Angle of transversal d3
  const [exp3ParallelDist, setExp3ParallelDist] = useState(110);
  const [exp3ParallelAngleChecked, setExp3ParallelAngleChecked] = useState(false);
  const [exp3DeductionRevealed, setExp3DeductionRevealed] = useState(false);
  const [exp3Completed, setExp3Completed] = useState(false);

  // Complete Exp 1
  const handleCompleteExp1 = () => {
    if (exp1Completed) return;
    setExp1Completed(true);
    setExp1DeductionRevealed(true);
    playSound('success');
    addPoints(40);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}
  };

  // Complete Exp 2
  const handleCompleteExp2 = () => {
    if (exp2Completed) return;
    setExp2Completed(true);
    setExp2DeductionRevealed(true);
    playSound('success');
    addPoints(40);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}
  };

  // Complete Exp 3
  const handleCompleteExp3 = () => {
    if (exp3Completed) return;
    setExp3Completed(true);
    setExp3DeductionRevealed(true);
    playSound('success');
    addPoints(40);
    unlockBadge('badge-lines-angles-master');
    try {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    } catch (_) {}
  };

  // Angles for Exp 1
  const a1 = exp1AngleDeg;
  const a2 = 180 - exp1AngleDeg;
  const a3 = exp1AngleDeg;
  const a4 = 180 - exp1AngleDeg;

  // Angles for Exp 2
  const comp1 = exp2SplitDeg;
  const comp2 = 90 - exp2SplitDeg;

  // Angles for Exp 3
  const t1 = exp3TransversalDeg;
  const t2 = 180 - exp3TransversalDeg;

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setActiveExp(1);
              playSound('click');
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeExp === 1
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Move className="w-4 h-4" />
            <span>1. Deney: Kesişen Doğrular & Ters Açılar</span>
            {exp1Completed && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
          </button>

          <button
            onClick={() => {
              setActiveExp(2);
              playSound('click');
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeExp === 2
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>2. Deney: Dik Doğrular & Tümler Açılar</span>
            {exp2Completed && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
          </button>

          <button
            onClick={() => {
              setActiveExp(3);
              playSound('click');
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeExp === 3
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>3. Deney: İki Paralel & Bir Kesen (8 Açı)</span>
            {exp3Completed && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
          </button>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>OB2 Dinamik Geometri & MAB3 Tablo Temsili</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* EXPERIMENT 1: Kesişen İki Doğru & Ters Açılar (MAB3 Tablosu) */}
      {/* ============================================================== */}
      {activeExp === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Canvas */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Move className="w-5 h-5 text-teal-600" />
                  Kesişen İki Doğru Dinamik Simülasyonu
                </h3>
                <p className="text-xs text-slate-500">
                  Açı sürgüsünü kaydırarak doğruların eğimini değiştirin ve oluşan 4 açıyı gözlemleyin.
                </p>
              </div>
              <button
                onClick={() => {
                  setExp1AngleDeg(65);
                  setExp1DeductionRevealed(false);
                  playSound('click');
                }}
                className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Sıfırla
              </button>
            </div>

            {/* Interactive SVG Display */}
            <div className="relative w-full h-[320px] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
              <svg width="560" height="300" viewBox="0 0 560 300" className="w-full h-full select-none">
                {/* Grid Background */}
                <defs>
                  <pattern id="grid1" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="560" height="300" fill="url(#grid1)" />

                {/* Center intersection Point O (280, 150) */}
                {/* Horizontal line d1 */}
                <line x1="40" y1="150" x2="520" y2="150" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
                <text x="530" y="154" fill="#0ea5e9" fontSize="13" fontWeight="bold">d₁</text>

                {/* Rotating line d2 passing through (280, 150) */}
                {(() => {
                  const rad = (exp1AngleDeg * Math.PI) / 180;
                  const len = 220;
                  const x1 = 280 - len * Math.cos(rad);
                  const y1 = 150 + len * Math.sin(rad);
                  const x2 = 280 + len * Math.cos(rad);
                  const y2 = 150 - len * Math.sin(rad);

                  return (
                    <>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                      <text x={x2 + 10} y={y2} fill="#f59e0b" fontSize="13" fontWeight="bold">d₂</text>

                      {/* Angle Arcs */}
                      {/* a1: Angle 1 (Right-Top, between positive d1 and top d2) */}
                      <path
                        d={`M 330 150 A 50 50 0 0 0 ${280 + 50 * Math.cos(rad)} ${150 - 50 * Math.sin(rad)}`}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                      />
                      <text x={280 + 75 * Math.cos(rad / 2)} y={150 - 75 * Math.sin(rad / 2)} fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
                        ∠1 = {a1}°
                      </text>

                      {/* a2: Angle 2 (Left-Top) */}
                      <text x={240} y={110} fill="#ec4899" fontSize="13" fontWeight="bold" textAnchor="middle">
                        ∠2 = {a2}°
                      </text>

                      {/* a3: Angle 3 (Left-Bottom, opposite to a1) */}
                      <path
                        d={`M 230 150 A 50 50 0 0 0 ${280 - 50 * Math.cos(rad)} ${150 + 50 * Math.sin(rad)}`}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                      />
                      <text x={280 - 75 * Math.cos(rad / 2)} y={150 + 75 * Math.sin(rad / 2) + 10} fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
                        ∠3 = {a3}°
                      </text>

                      {/* a4: Angle 4 (Right-Bottom, opposite to a2) */}
                      <text x={320} y={190} fill="#ec4899" fontSize="13" fontWeight="bold" textAnchor="middle">
                        ∠4 = {a4}°
                      </text>
                    </>
                  );
                })()}

                {/* Intersection Point O */}
                <circle cx="280" cy="150" r="6" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                <text x="280" y="172" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">O</text>
              </svg>
            </div>

            {/* Angle Slider Control */}
            <div className="mt-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Dönüş Açısı (d₁ ile d₂ Arasındaki Dar Açı):</span>
                <span className="text-teal-700 text-sm font-black">{exp1AngleDeg}°</span>
              </div>
              <input
                type="range"
                min="20"
                max="160"
                value={exp1AngleDeg}
                onChange={(e) => {
                  setExp1AngleDeg(Number(e.target.value));
                  playSound('click');
                }}
                className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>20° (Dar)</span>
                <span>90° (Dik Kesişim)</span>
                <span>160° (Geniş)</span>
              </div>
            </div>
          </div>

          {/* Right MAB3 Live Table & Deductions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* MAB3 Live Comparison Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Table className="w-5 h-5 text-teal-600" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Canlı Açı İlişki Tablosu (MAB3)</h4>
                  <p className="text-xs text-slate-500">Ölçüm verileri anlık olarak güncellenir.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-2">Açı Çifti</th>
                      <th className="p-2">Ölçüler</th>
                      <th className="p-2">İlişki / Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-emerald-50/50">
                      <td className="p-2 font-bold text-emerald-800">∠1 ve ∠3</td>
                      <td className="p-2 font-semibold text-slate-700">{a1}° ve {a3}°</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <Check className="w-3.5 h-3.5" /> Ters Açılar (Eşit)
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-pink-50/50">
                      <td className="p-2 font-bold text-pink-800">∠2 ve ∠4</td>
                      <td className="p-2 font-semibold text-slate-700">{a2}° ve {a4}°</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-1 text-pink-700 font-bold">
                          <Check className="w-3.5 h-3.5" /> Ters Açılar (Eşit)
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-blue-50/50">
                      <td className="p-2 font-bold text-blue-800">∠1 + ∠2</td>
                      <td className="p-2 font-semibold text-slate-700">{a1}° + {a2}° = {a1 + a2}°</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-1 text-blue-700 font-bold">
                          <Check className="w-3.5 h-3.5" /> Komşu Bütünler (180°)
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-amber-50/50">
                      <td className="p-2 font-bold text-amber-800">4 Açının Toplamı</td>
                      <td className="p-2 font-semibold text-slate-700">{a1 + a2 + a3 + a4}°</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                          <Check className="w-3.5 h-3.5" /> Tam Açı (360°)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Deduction Card */}
            <div className="bg-linear-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h4 className="font-bold text-teal-900 text-sm">Matematiksel Çıkarım Kartı</h4>
              </div>

              {exp1DeductionRevealed ? (
                <div className="space-y-2 text-xs text-slate-700 animate-in fade-in">
                  <p className="font-semibold text-teal-950">
                    💡 <strong>Ters Açı Eşitliği Aksiyomu:</strong> Kesişen iki doğru zıt yönlü iki çift ters açı oluşturur. Doğruların eğimi nasıl değişirse değişsin karşılıklı ters açılar daima birbirine eşittir (∠1 = ∠3 ve ∠2 = ∠4).
                  </p>
                  <p className="text-slate-600">
                    💡 <strong>Komşu Bütünler İlkesi:</strong> Doğru üzerinde yan yana duran açılar bir doğru açı oluşturur ve toplamları daima 180° eder.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-600">
                  Doğruların açısını değiştirip tabloyu inceledikten sonra çıkarım kartını açarak deneyi tamamlayınız.
                </p>
              )}

              <button
                onClick={handleCompleteExp1}
                disabled={exp1Completed}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  exp1Completed
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20'
                }`}
              >
                {exp1Completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> 1. Deney Doğrulandı (+40 XP)
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Çıkarımı Doğrula & Kartı Aç
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* EXPERIMENT 2: Dik Kesişen Doğrular & Tümler Açılar (d1 ⊥ d2) */}
      {/* ============================================================== */}
      {activeExp === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Canvas */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Compass className="w-5 h-5 text-teal-600" />
                  Dik Doğrular (d₁ ⊥ d₂) ve Tümler Açılar
                </h3>
                <p className="text-xs text-slate-500">
                  90°lik dik açıyı bölen [OC ışınını hareket ettirerek tümler açıların toplamını test edin.
                </p>
              </div>
              <button
                onClick={() => {
                  setExp2SplitDeg(35);
                  setExp2DeductionRevealed(false);
                  playSound('click');
                }}
                className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Sıfırla
              </button>
            </div>

            {/* Interactive SVG Display */}
            <div className="relative w-full h-[320px] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
              <svg width="560" height="300" viewBox="0 0 560 300" className="w-full h-full select-none">
                <defs>
                  <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="560" height="300" fill="url(#grid2)" />

                {/* Perpendicular Lines intersecting at (280, 200) */}
                {/* Horizontal line d1 */}
                <line x1="60" y1="200" x2="500" y2="200" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
                <text x="510" y="204" fill="#0ea5e9" fontSize="13" fontWeight="bold">d₁</text>

                {/* Vertical line d2 */}
                <line x1="280" y1="40" x2="280" y2="280" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
                <text x="280" y="30" fill="#0ea5e9" fontSize="13" fontWeight="bold" textAnchor="middle">d₂ (⊥)</text>

                {/* Right angle symbol at bottom left (280, 200) */}
                <rect x="260" y="180" width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2" />
                <circle cx="270" cy="190" r="2.5" fill="#10b981" />

                {/* Splitting Ray [OC in the first quadrant (Right-Top) */}
                {(() => {
                  const rad = (exp2SplitDeg * Math.PI) / 180;
                  const len = 150;
                  const cx = 280 + len * Math.cos(rad);
                  const cy = 200 - len * Math.sin(rad);

                  return (
                    <>
                      <line x1="280" y1="200" x2={cx} y2={cy} stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,5" />
                      <circle cx={cx} cy={cy} r="5" fill="#f59e0b" />
                      <text x={cx + 10} y={cy} fill="#f59e0b" fontSize="12" fontWeight="bold">C (Işın)</text>

                      {/* comp1 arc (bottom part) */}
                      <path
                        d={`M 330 200 A 50 50 0 0 0 ${280 + 50 * Math.cos(rad)} ${200 - 50 * Math.sin(rad)}`}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="3"
                      />
                      <text x={315} y={190} fill="#06b6d4" fontSize="12" fontWeight="bold">
                        a = {comp1}°
                      </text>

                      {/* comp2 arc (top part) */}
                      <path
                        d={`M ${280 + 50 * Math.cos(rad)} ${200 - 50 * Math.sin(rad)} A 50 50 0 0 0 280 150`}
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="3"
                      />
                      <text x={295} y={145} fill="#ec4899" fontSize="12" fontWeight="bold">
                        b = {comp2}°
                      </text>
                    </>
                  );
                })()}

                {/* Center Vertex O */}
                <circle cx="280" cy="200" r="5" fill="#ffffff" />
                <text x="265" y="220" fill="#ffffff" fontSize="12" fontWeight="bold">O</text>
              </svg>
            </div>

            {/* Split Slider */}
            <div className="mt-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>[OC Işını Bölme Açısı (a):</span>
                <span className="text-teal-700 text-sm font-black">{exp2SplitDeg}°</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={exp2SplitDeg}
                onChange={(e) => {
                  setExp2SplitDeg(Number(e.target.value));
                  playSound('click');
                }}
                className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>10° (Küçük a, Büyük b)</span>
                <span>45° (Eşit Bölünme)</span>
                <span>80° (Büyük a, Küçük b)</span>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Table className="w-5 h-5 text-teal-600" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Tümler Açı Tablosu</h4>
                  <p className="text-xs text-slate-500">Ölçüleri toplamı 90° olan açılar</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 flex justify-between items-center">
                  <span className="font-bold text-cyan-900 text-xs">Açı 1 (a)</span>
                  <span className="font-black text-cyan-700 text-sm">{comp1}°</span>
                </div>
                <div className="p-3 bg-pink-50 rounded-xl border border-pink-200 flex justify-between items-center">
                  <span className="font-bold text-pink-900 text-xs">Açı 2 (b)</span>
                  <span className="font-black text-pink-700 text-sm">{comp2}°</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
                  <span className="font-bold text-emerald-900 text-xs">Toplam (a + b)</span>
                  <span className="font-black text-emerald-700 text-sm">{comp1 + comp2}° (Dik Açı ⊥)</span>
                </div>
              </div>
            </div>

            {/* Deduction */}
            <div className="bg-linear-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h4 className="font-bold text-teal-900 text-sm">Matematiksel Çıkarım Kartı</h4>
              </div>

              {exp2DeductionRevealed ? (
                <div className="space-y-2 text-xs text-slate-700 animate-in fade-in">
                  <p className="font-semibold text-teal-950">
                    💡 <strong>Dik Doğrular (⊥):</strong> Kesişirken 90°lik dik açı oluşturan doğrulara dik doğrular denir ve 4 adet 90° açı üretirler.
                  </p>
                  <p className="text-slate-600">
                    💡 <strong>Tümler Açılar:</strong> Ölçüleri toplamı 90° olan iki açıya tümler açılar denir (a + b = 90°). Ortak kolu varsa bunlara <em>komşu tümler açılar</em> denir.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-600">
                  Işını kaydırarak açılar toplamının daima 90° kaldığını gözlemleyin ve kartı açın.
                </p>
              )}

              <button
                onClick={handleCompleteExp2}
                disabled={exp2Completed}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  exp2Completed
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20'
                }`}
              >
                {exp2Completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> 2. Deney Doğrulandı (+40 XP)
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Çıkarımı Doğrula & Kartı Aç
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* EXPERIMENT 3: İki Paralel Doğru ve Bir Kesen (8 Açı Modeli) */}
      {/* ============================================================== */}
      {activeExp === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Canvas */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-teal-600" />
                  İki Paralel Doğru (d₁ ∥ d₂) ve d₃ Keseni
                </h3>
                <p className="text-xs text-slate-500">
                  Kesen doğrunun açısını değiştirerek paralel hatlar üzerinde oluşan 8 açıyı karşılaştırın.
                </p>
              </div>
              <button
                onClick={() => {
                  setExp3TransversalDeg(55);
                  setExp3ParallelAngleChecked(false);
                  setExp3DeductionRevealed(false);
                  playSound('click');
                }}
                className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Sıfırla
              </button>
            </div>

            {/* Interactive SVG Display */}
            <div className="relative w-full h-[320px] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
              <svg width="560" height="300" viewBox="0 0 560 300" className="w-full h-full select-none">
                <defs>
                  <pattern id="grid3" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="560" height="300" fill="url(#grid3)" />

                {/* Parallel line d1 (y = 90) */}
                <line x1="50" y1="90" x2="510" y2="90" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
                <text x="520" y="94" fill="#0ea5e9" fontSize="13" fontWeight="bold">d₁</text>

                {/* Parallel line d2 (y = 210) */}
                <line x1="50" y1="210" x2="510" y2="210" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
                <text x="520" y="214" fill="#0ea5e9" fontSize="13" fontWeight="bold">d₂ (∥ d₁)</text>

                {/* Transversal line d3 cutting at (240, 90) and (320, 210) approx depending on angle */}
                {(() => {
                  const rad = (exp3TransversalDeg * Math.PI) / 180;
                  const cot = 1 / Math.tan(rad);
                  const dy = 60; // half distance
                  const midX = 280;
                  const midY = 150;

                  const p1X = midX - 60 * cot; // intersection with d1 (y=90)
                  const p1Y = 90;

                  const p2X = midX + 60 * cot; // intersection with d2 (y=210)
                  const p2Y = 210;

                  const len = 160;
                  const lineTopX = p1X - len * Math.cos(rad);
                  const lineTopY = p1Y - len * Math.sin(rad);
                  const lineBotX = p2X + len * Math.cos(rad);
                  const lineBotY = p2Y + len * Math.sin(rad);

                  return (
                    <>
                      <line x1={lineTopX} y1={lineTopY} x2={lineBotX} y2={lineBotY} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                      <text x={lineBotX + 10} y={lineBotY} fill="#f59e0b" fontSize="13" fontWeight="bold">d₃ (Kesen)</text>

                      {/* Top Intersection Angles */}
                      <circle cx={p1X} cy={p1Y} r="5" fill="#ffffff" />
                      <text x={p1X + 25} y={p1Y - 15} fill="#10b981" fontSize="12" fontWeight="bold">
                        {t1}°
                      </text>
                      <text x={p1X - 35} y={p1Y - 15} fill="#ec4899" fontSize="12" fontWeight="bold">
                        {t2}°
                      </text>

                      {/* Bottom Intersection Angles */}
                      <circle cx={p2X} cy={p2Y} r="5" fill="#ffffff" />
                      <text x={p2X + 25} y={p2Y - 15} fill="#10b981" fontSize="12" fontWeight="bold">
                        {t1}°
                      </text>
                      <text x={p2X - 35} y={p2Y - 15} fill="#ec4899" fontSize="12" fontWeight="bold">
                        {t2}°
                      </text>
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Controls */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Kesen Doğru Eğimi:</span>
                  <span className="text-teal-700 text-sm font-black">{exp3TransversalDeg}°</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="145"
                  value={exp3TransversalDeg}
                  onChange={(e) => {
                    setExp3TransversalDeg(Number(e.target.value));
                    playSound('click');
                  }}
                  className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <button
                onClick={() => {
                  setExp3ParallelAngleChecked(true);
                  playSound('success');
                }}
                className="px-4 py-2.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-sky-200"
              >
                <Ruler className="w-4 h-4 text-sky-600" />
                Paraleller Arası Açıyı Ölç
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Table className="w-5 h-5 text-teal-600" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Kesen Doğru & 8 Açı Tablosu</h4>
                  <p className="text-xs text-slate-500">Üst ve alt kavşak açıları eşleşir.</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
                  <span className="font-bold text-emerald-900">Dar Açı Grupları (4 Adet)</span>
                  <span className="font-black text-emerald-700">{t1}° (Hepsi Eşit)</span>
                </div>
                <div className="p-2.5 bg-pink-50 rounded-xl border border-pink-200 flex justify-between items-center">
                  <span className="font-bold text-pink-900">Geniş Açı Grupları (4 Adet)</span>
                  <span className="font-black text-pink-700">{t2}° (Hepsi Eşit)</span>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Komşu Bütünler Toplamı</span>
                  <span className="font-black text-slate-700">{t1 + t2}° = 180°</span>
                </div>

                {exp3ParallelAngleChecked && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 animate-in fade-in">
                    <p className="font-bold text-xs flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-amber-600 shrink-0" />
                      Önemli Çıkarım: Paralel Doğrular Arasında Açı Yoktur!
                    </p>
                    <p className="text-[11px] text-amber-800 mt-1">
                      d₁ ve d₂ hiçbir noktada kesişmediği için aralarında açı derecesi oluşmaz (Açı = 0° / Yok).
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Deduction */}
            <div className="bg-linear-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h4 className="font-bold text-teal-900 text-sm">Matematiksel Çıkarım Kartı</h4>
              </div>

              {exp3DeductionRevealed ? (
                <div className="space-y-2 text-xs text-slate-700 animate-in fade-in">
                  <p className="font-semibold text-teal-950">
                    💡 <strong>Kesen Doğru:</strong> Düzlemdeki iki veya daha fazla doğruyu farklı noktalarda kesen üçüncü doğruya kesen denir.
                  </p>
                  <p className="text-slate-600">
                    💡 <strong>Açı Uyumu:</strong> Paralel iki doğruyu kesen bir doğru üst ve alt kesişim noktalarında birbirine eşit yöndeş, ters ve bütünler açılar meydana getirir.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-600">
                  Deneyleri tamamlayıp çıkarım kartını onaylayınız.
                </p>
              )}

              <button
                onClick={handleCompleteExp3}
                disabled={exp3Completed}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  exp3Completed
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20'
                }`}
              >
                {exp3Completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> 3. Deney Tamamlandı (+40 XP & Rozet)
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Çıkarımı Doğrula & Rozeti Al
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
