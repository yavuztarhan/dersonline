'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  FlaskConical,
  Ruler,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Zap,
  HelpCircle,
  Layers,
  Compass
} from 'lucide-react';

export function ExperimentBench() {
  const { playSound, addPoints, unlockBadge, role } = useApp();

  const [activeExp, setActiveExp] = useState<1 | 2 | 3>(1);

  // Exp 1: Measurability State
  const [exp1SelectedObject, setExp1SelectedObject] = useState<'line' | 'ray' | 'segment' | null>(null);
  const [exp1Tested, setExp1Tested] = useState<{ line: boolean; ray: boolean; segment: boolean }>({
    line: false,
    ray: false,
    segment: false
  });
  const [exp1Completed, setExp1Completed] = useState(false);

  // Exp 2: Angle Creation State
  const [exp2Angle, setExp2Angle] = useState(60);
  const [exp2Completed, setExp2Completed] = useState(false);

  // Exp 3: Parallel Perpendicular State
  const [exp3Distance, setExp3Distance] = useState(140);
  const [exp3Height, setExp3Height] = useState(160);
  const [exp3Completed, setExp3Completed] = useState(false);

  const handleTestExp1 = (type: 'line' | 'ray' | 'segment') => {
    playSound('click');
    setExp1SelectedObject(type);
    const nextTested = { ...exp1Tested, [type]: true };
    setExp1Tested(nextTested);

    if (nextTested.line && nextTested.ray && nextTested.segment && !exp1Completed) {
      setExp1Completed(true);
      playSound('success');
      addPoints(25);
    }
  };

  const handleSliderExp2 = (val: number) => {
    setExp2Angle(val);
    if (!exp2Completed && (val === 90 || val > 120)) {
      setExp2Completed(true);
      playSound('success');
      addPoints(25);
    }
  };

  const handleSliderExp3 = (val: number) => {
    setExp3Distance(val);
    if (!exp3Completed) {
      setExp3Completed(true);
      playSound('success');
      addPoints(25);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Experiment Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Exp 1 Tab */}
        <button
          onClick={() => {
            setActiveExp(1);
            playSound('select');
          }}
          className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
            activeExp === 1
              ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-400 shadow-md'
              : 'bg-white border-slate-200 hover:border-teal-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black">
              1
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">1. Deney Masası</div>
              <div className="text-[11px] text-slate-500">Ölçülebilirlik Hipotezi</div>
            </div>
          </div>
          {exp1Completed && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        </button>

        {/* Exp 2 Tab */}
        <button
          onClick={() => {
            setActiveExp(2);
            playSound('select');
          }}
          className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
            activeExp === 2
              ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-400 shadow-md'
              : 'bg-white border-slate-200 hover:border-teal-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
              2
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">2. Deney Masası</div>
              <div className="text-[11px] text-slate-500">Açı ve Doğrultu Oluşumu</div>
            </div>
          </div>
          {exp2Completed && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        </button>

        {/* Exp 3 Tab */}
        <button
          onClick={() => {
            setActiveExp(3);
            playSound('select');
          }}
          className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
            activeExp === 3
              ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-400 shadow-md'
              : 'bg-white border-slate-200 hover:border-teal-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
              3
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">3. Deney Masası</div>
              <div className="text-[11px] text-slate-500">Çifte Dikme & Paralellik</div>
            </div>
          </div>
          {exp3Completed && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        </button>

      </div>

      {/* EXPERIMENT 1: MEASURABILITY & BOUNDS */}
      {activeExp === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-extrabold text-teal-700 uppercase">1. Kritik Deney</span>
              <h3 className="text-xl font-black text-slate-900">Ölçülebilirlik & Sınırlılık Çıkarımı</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Aşağıdaki 3 geometrik modelin üzerine cetveli koyarak hangisinin uzunluğunun ölçülebildiğini test ediniz.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Ruler className="w-4 h-4 text-teal-600" />
              <span>Test Edilen: {Object.values(exp1Tested).filter(Boolean).length} / 3</span>
            </div>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Object 1: DOĞRU */}
            <div
              onClick={() => handleTestExp1('line')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 text-center flex flex-col justify-between space-y-4 ${
                exp1SelectedObject === 'line'
                  ? 'bg-slate-900 text-white ring-2 ring-teal-400 border-slate-900 shadow-lg scale-102'
                  : 'bg-slate-50 border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="font-extrabold text-sm">↔️ DOĞRU (AB)</div>
              
              {/* SVG Graphic */}
              <div className="h-28 bg-slate-950 rounded-xl flex items-center justify-center p-2 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 200 80">
                  <line x1="20" y1="40" x2="180" y2="40" stroke="#f59e0b" strokeWidth="4" />
                  <polygon points="10,40 25,33 25,47" fill="#f59e0b" />
                  <polygon points="190,40 175,33 175,47" fill="#f59e0b" />
                  <circle cx="60" cy="40" r="4" fill="#ffffff" />
                  <circle cx="140" cy="40" r="4" fill="#ffffff" />
                  <text fill="#ffffff" fontSize="11" fontWeight="bold" x="60" y="28" textAnchor="middle">A</text>
                  <text fill="#ffffff" fontSize="11" fontWeight="bold" x="140" y="28" textAnchor="middle">B</text>
                </svg>
              </div>

              {exp1Tested.line ? (
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-black border border-rose-400/30">
                  Cetvel Sonucu: ∞ (Sonsuz / Ölçülemez)
                </div>
              ) : (
                <button className="py-2 px-3 rounded-xl bg-teal-600 text-white text-xs font-bold">
                  Cetvelle Test Et 📏
                </button>
              )}
            </div>

            {/* Object 2: IŞIN */}
            <div
              onClick={() => handleTestExp1('ray')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 text-center flex flex-col justify-between space-y-4 ${
                exp1SelectedObject === 'ray'
                  ? 'bg-slate-900 text-white ring-2 ring-teal-400 border-slate-900 shadow-lg scale-102'
                  : 'bg-slate-50 border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="font-extrabold text-sm">🔦 IŞIN [AB</div>
              
              {/* SVG Graphic */}
              <div className="h-28 bg-slate-950 rounded-xl flex items-center justify-center p-2 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 200 80">
                  <circle cx="35" cy="40" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                  <line x1="35" y1="40" x2="175" y2="40" stroke="#38bdf8" strokeWidth="4" />
                  <polygon points="185,40 170,33 170,47" fill="#38bdf8" />
                  <circle cx="120" cy="40" r="4" fill="#ffffff" />
                  <text fill="#38bdf8" fontSize="11" fontWeight="bold" x="35" y="26" textAnchor="middle">[A</text>
                  <text fill="#ffffff" fontSize="11" fontWeight="bold" x="120" y="26" textAnchor="middle">B</text>
                </svg>
              </div>

              {exp1Tested.ray ? (
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-black border border-rose-400/30">
                  Cetvel Sonucu: ∞ (Sonsuz / Ölçülemez)
                </div>
              ) : (
                <button className="py-2 px-3 rounded-xl bg-teal-600 text-white text-xs font-bold">
                  Cetvelle Test Et 📏
                </button>
              )}
            </div>

            {/* Object 3: DOĞRU PARÇASI */}
            <div
              onClick={() => handleTestExp1('segment')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 text-center flex flex-col justify-between space-y-4 ${
                exp1SelectedObject === 'segment'
                  ? 'bg-slate-900 text-white ring-2 ring-teal-400 border-slate-900 shadow-lg scale-102'
                  : 'bg-slate-50 border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="font-extrabold text-sm">📏 DOĞRU PARÇASI [AB]</div>
              
              {/* SVG Graphic */}
              <div className="h-28 bg-slate-950 rounded-xl flex items-center justify-center p-2 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 200 80">
                  <circle cx="40" cy="40" r="6" fill="#10b396" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="160" cy="40" r="6" fill="#10b396" stroke="#ffffff" strokeWidth="2" />
                  <line x1="40" y1="40" x2="160" y2="40" stroke="#10b396" strokeWidth="5" />
                  <text fill="#5ee7cc" fontSize="11" fontWeight="bold" x="40" y="26" textAnchor="middle">[A]</text>
                  <text fill="#5ee7cc" fontSize="11" fontWeight="bold" x="160" y="26" textAnchor="middle">[B]</text>
                </svg>
              </div>

              {exp1Tested.segment ? (
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">
                  Cetvel Sonucu: Net 8 cm ✅
                </div>
              ) : (
                <button className="py-2 px-3 rounded-xl bg-teal-600 text-white text-xs font-bold">
                  Cetvelle Test Et 📏
                </button>
              )}
            </div>

          </div>

          {/* Opened Deduction Card */}
          {exp1Completed && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg space-y-2 animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-200">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>1. Deney Mantıksal Çıkarım Kartı:</span>
              </div>
              <p className="text-sm sm:text-base font-bold leading-relaxed">
                "Doğru parçasının her iki ucu da sınırlandırıldığı için uzunluğu cetvelle tam olarak ölçülebilir (|AB| = 8 cm). Doğru ve ışın ise sonsuza uzandığı için kesin bir uzunluğa sahip olamaz!"
              </p>
            </div>
          )}

        </div>
      )}

      {/* EXPERIMENT 2: ANGLE AND DIRECTION CREATION */}
      {activeExp === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in duration-200">
          
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-extrabold text-indigo-700 uppercase">2. Kritik Deney</span>
            <h3 className="text-xl font-black text-slate-900">Açı ve Doğrultu İnşası Masası</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Aşağıdaki sürgüyü kaydırarak iki ışının başlangıç noktası (O) birleştiğinde oluşan açıyı inceleyiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Interactive SVG Angle Simulator */}
            <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-4 h-[300px] flex items-center justify-center relative overflow-hidden shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 360 260">
                {/* Fixed Ray [OA */}
                <line x1="180" y1="200" x2="330" y2="200" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                <polygon points="340,200 325,193 325,207" fill="#38bdf8" />
                <circle cx="280" cy="200" r="4" fill="#ffffff" />
                <text fill="#38bdf8" fontSize="12" fontWeight="900" x="280" y="222" textAnchor="middle">A</text>

                {/* Rotating Ray [OB */}
                {(() => {
                  const rad = (exp2Angle * Math.PI) / 180;
                  const endX = 180 + 150 * Math.cos(-rad);
                  const endY = 200 + 150 * Math.sin(-rad);
                  const tipX = 180 + 160 * Math.cos(-rad);
                  const tipY = 200 + 160 * Math.sin(-rad);

                  return (
                    <>
                      <line x1="180" y1="200" x2={endX} y2={endY} stroke="#fde047" strokeWidth="4" strokeLinecap="round" />
                      <circle cx={180 + 110 * Math.cos(-rad)} cy={200 + 110 * Math.sin(-rad)} r="4" fill="#ffffff" />
                      <text fill="#fde047" fontSize="12" fontWeight="900" x={180 + 110 * Math.cos(-rad) - 10} y={200 + 110 * Math.sin(-rad) - 10}>B</text>

                      {/* Arc */}
                      <path
                        d={`M 220 200 A 40 40 0 0 0 ${180 + 40 * Math.cos(-rad)} ${200 + 40 * Math.sin(-rad)}`}
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="3"
                      />
                    </>
                  );
                })()}

                {/* Common Origin O */}
                <circle cx="180" cy="200" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
                <text fill="#ffffff" fontSize="14" fontWeight="900" x="180" y="235" textAnchor="middle">Ortak Başlangıç (O)</text>

                {/* Degree Display */}
                <rect x="135" y="20" width="90" height="32" rx="8" fill="#1e1b4b" stroke="#4f46e5" />
                <text fill="#a5b4fc" fontSize="14" fontWeight="900" x="180" y="42" textAnchor="middle">
                  ∠AOB = {exp2Angle}°
                </text>
              </svg>
            </div>

            {/* Angle Controls & Classification */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex justify-between">
                  <span>Açı Derecesi (Açıklık):</span>
                  <span className="text-indigo-600 font-black">{exp2Angle}°</span>
                </label>
                <input
                  type="range"
                  min="15"
                  max="165"
                  step="5"
                  value={exp2Angle}
                  onChange={(e) => handleSliderExp2(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Angle Type Card */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
                <div className="text-xs font-extrabold text-indigo-900 uppercase">Açı Çeşidi:</div>
                <div className="text-lg font-black text-indigo-700">
                  {exp2Angle < 90 ? '📐 Dar Açı (< 90°)' : exp2Angle === 90 ? '🎯 Dik Açı (= 90°)' : '🌟 Geniş Açı (> 90°)'}
                </div>
              </div>

              {/* Deduction */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-1">
                <div className="font-black text-indigo-300">💡 2. Çıkarım İlkesi:</div>
                <p className="text-slate-300">
                  Başlangıç noktaları aynı olan iki ışının birleşmesi bir açı oluşturur. Işınların yönü açının ölçüsünü belirler.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* EXPERIMENT 3: DOUBLE PERPENDICULAR & PARALLELISM */}
      {activeExp === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in duration-200">
          
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-extrabold text-purple-700 uppercase">3. Kritik Deney</span>
            <h3 className="text-xl font-black text-slate-900">Çifte Dikme ve Paralellik Çıkarımı</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Taban doğrusuna indirilen iki dikme arasındaki mesafeyi değiştirin ve hiçbir zaman kesişmediklerini gözlemleyin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Interactive SVG Simulator */}
            <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-4 h-[300px] flex items-center justify-center relative overflow-hidden shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 360 260">
                {/* Base ground line */}
                <line x1="20" y1="210" x2="340" y2="210" stroke="#64748b" strokeWidth="4" />
                <text fill="#94a3b8" fontSize="11" fontWeight="bold" x="345" y="214">Taban (t)</text>

                {/* Left Perpendicular d1 */}
                <line x1="100" y1="210" x2="100" y2={210 - exp3Height} stroke="#10b396" strokeWidth="4" />
                <polygon points={`100,${195 - exp3Height} 94,${210 - exp3Height} 106,${210 - exp3Height}`} fill="#10b396" />
                <rect x="100" y="194" width="16" height="16" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="108" cy="202" r="2" fill="#f59e0b" />
                <text fill="#10b396" fontSize="12" fontWeight="900" x="100" y="235" textAnchor="middle">d1 ⊥ t</text>

                {/* Right Perpendicular d2 (dynamic distance) */}
                <line x1={100 + exp3Distance} y1="210" x2={100 + exp3Distance} y2={210 - exp3Height} stroke="#10b396" strokeWidth="4" />
                <polygon points={`${100 + exp3Distance},${195 - exp3Height} ${94 + exp3Distance},${210 - exp3Height} ${106 + exp3Distance},${210 - exp3Height}`} fill="#10b396" />
                <rect x={100 + exp3Distance} y="194" width="16" height="16" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx={108 + exp3Distance} cy="202" r="2" fill="#f59e0b" />
                <text fill="#10b396" fontSize="12" fontWeight="900" x={100 + exp3Distance} y="235" textAnchor="middle">d2 ⊥ t</text>

                {/* Constant Distance Indicator */}
                <line x1="100" y1="80" x2={100 + exp3Distance} y2="80" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" />
                <rect x={100 + exp3Distance / 2 - 40} y="65" width="80" height="24" rx="6" fill="#0369a1" />
                <text fill="#e0f2fe" fontSize="11" fontWeight="900" x={100 + exp3Distance / 2} y="81" textAnchor="middle">
                  Mesafe Sabit
                </text>
              </svg>
            </div>

            {/* Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex justify-between">
                  <span>Dikmeler Arası Mesafe:</span>
                  <span className="text-purple-600 font-black">{exp3Distance} px</span>
                </label>
                <input
                  type="range"
                  min="60"
                  max="200"
                  step="5"
                  value={exp3Distance}
                  onChange={(e) => handleSliderExp3(Number(e.target.value))}
                  className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <div className="text-xs font-extrabold text-purple-900 uppercase">İlişki Durumu:</div>
                <div className="text-lg font-black text-purple-700">
                  d1 ∥ d2 (Birbirine Paralel & Kesişmez)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-1">
                <div className="font-black text-purple-300">💡 3. Çıkarım İlkesi:</div>
                <p className="text-slate-300">
                  Aynı taban doğrusuna 90° dik açı yapan iki doğru asla kesişmez; aralarındaki mesafe sonsuza kadar sabit kalır (Paralel doğrular).
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
