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
  Compass,
  Move,
  Check,
  Target,
  Sliders
} from 'lucide-react';

export function ExperimentBench() {
  const { playSound, addPoints, unlockBadge, role } = useApp();

  const [activeExp, setActiveExp] = useState<1 | 2 | 3>(1);

  // ==========================================
  // EXP 1: Straightedge & Two Points (Ölçüsüz Cetvel)
  // ==========================================
  const [exp1PtA, setExp1PtA] = useState({ x: 120, y: 160 });
  const [exp1PtB, setExp1PtB] = useState({ x: 440, y: 240 });
  const [exp1LineDrawn, setExp1LineDrawn] = useState(false);
  const [exp1TriedSecond, setExp1TriedSecond] = useState(false);
  const [exp1Completed, setExp1Completed] = useState(false);

  // ==========================================
  // EXP 2: Compass (Pergel ile Çember, Işın & Açı)
  // ==========================================
  const [exp2Mode, setExp2Mode] = useState<'circle' | 'ray' | 'angle'>('circle');
  const [exp2Radius, setExp2Radius] = useState(90);
  // Circle points
  const [exp2CirclePoints, setExp2CirclePoints] = useState<Array<{ id: string; label: string; deg: number }>>([
    { id: 'p1', label: 'A', deg: 30 },
    { id: 'p2', label: 'B', deg: 120 }
  ]);
  // Ray steps
  const [exp2RaySteps, setExp2RaySteps] = useState(1);
  // Angle arm cut
  const [exp2AngleCut, setExp2AngleCut] = useState(false);
  const [exp2Completed, setExp2Completed] = useState(false);

  // ==========================================
  // EXP 3: Set Square & Parallel Lines (Gönye & Paralellik - OB2)
  // ==========================================
  const [exp3PerpPoint, setExp3PerpPoint] = useState({ x: 260, y: 80 });
  const [exp3PerpDrawn, setExp3PerpDrawn] = useState(false);
  const [exp3ParallelDistance, setExp3ParallelDistance] = useState(120);
  const [exp3ParallelDrawn, setExp3ParallelDrawn] = useState(false);
  const [exp3Completed, setExp3Completed] = useState(false);

  // Dragging point tracking across experiment benches
  const [draggingPoint, setDraggingPoint] = useState<'exp1A' | 'exp1B' | 'exp3P' | null>(null);

  const handleStartDrag = (pointKey: 'exp1A' | 'exp1B' | 'exp3P', e: React.PointerEvent) => {
    e.stopPropagation();
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch (_) {}
    setDraggingPoint(pointKey);
    playSound('select');
  };

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>, svgWidth = 600, svgHeight = 320) => {
    if (!draggingPoint) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    const scaleX = svgWidth / rect.width;
    const scaleY = svgHeight / rect.height;

    const x = Math.round(rawX * scaleX);
    const y = Math.round(rawY * scaleY);

    if (draggingPoint === 'exp1A') {
      setExp1PtA({
        x: Math.max(50, Math.min(550, x)),
        y: Math.max(40, Math.min(280, y))
      });
    } else if (draggingPoint === 'exp1B') {
      setExp1PtB({
        x: Math.max(50, Math.min(550, x)),
        y: Math.max(40, Math.min(280, y))
      });
    } else if (draggingPoint === 'exp3P') {
      setExp3PerpPoint({
        x: Math.max(80, Math.min(520, x)),
        y: Math.max(40, Math.min(195, y)) // Keep P above base line at y=240
      });
    }
  };

  const handleEndDrag = (e: React.PointerEvent) => {
    if (draggingPoint) {
      try {
        (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
      } catch (_) {}
      setDraggingPoint(null);
    }
  };

  // Handlers for Exp 1
  const handleExp1DrawLine = () => {
    playSound('select');
    setExp1LineDrawn(true);
    if (!exp1Completed && exp1TriedSecond) {
      setExp1Completed(true);
      playSound('success');
      addPoints(25);
    }
  };

  const handleExp1TrySecond = () => {
    playSound('click');
    setExp1TriedSecond(true);
    if (!exp1Completed && exp1LineDrawn) {
      setExp1Completed(true);
      playSound('success');
      addPoints(25);
    }
  };

  // Handlers for Exp 2
  const handleAddCirclePoint = () => {
    playSound('select');
    const labels = ['C', 'D', 'E', 'F'];
    const nextLabel = labels[exp2CirclePoints.length - 2] || 'K';
    const nextDeg = (exp2CirclePoints.length * 75 + 45) % 360;
    setExp2CirclePoints((prev) => [...prev, { id: `pt-${Date.now()}`, label: nextLabel, deg: nextDeg }]);

    if (!exp2Completed) {
      setExp2Completed(true);
      playSound('success');
      addPoints(25);
    }
  };

  const handleStepRay = () => {
    playSound('select');
    const nextSteps = exp2RaySteps >= 4 ? 1 : exp2RaySteps + 1;
    setExp2RaySteps(nextSteps);
    if (!exp2Completed && nextSteps >= 3) {
      setExp2Completed(true);
      playSound('success');
      addPoints(25);
    }
  };

  const handleCutAngle = () => {
    playSound('select');
    setExp2AngleCut(!exp2AngleCut);
    if (!exp2Completed) {
      setExp2Completed(true);
      playSound('success');
      addPoints(25);
    }
  };

  // Handlers for Exp 3
  const handleDrawPerp = () => {
    playSound('select');
    setExp3PerpDrawn(true);
  };

  const handleDrawParallel = () => {
    playSound('select');
    setExp3ParallelDrawn(true);
    if (!exp3Completed) {
      setExp3Completed(true);
      playSound('success');
      addPoints(25);
    }
  };

  const handleClearExp3 = () => {
    playSound('click');
    setExp3PerpDrawn(false);
    setExp3ParallelDrawn(false);
    setExp3PerpPoint({ x: 260, y: 80 });
    setExp3ParallelDistance(120);
  };

  const handleClearExp1 = () => {
    playSound('click');
    setExp1LineDrawn(false);
    setExp1TriedSecond(false);
    setExp1PtA({ x: 120, y: 160 });
    setExp1PtB({ x: 440, y: 240 });
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
              <div className="text-[11px] text-slate-500">Ölçüsüz Cetvel & İki Nokta</div>
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
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black">
              2
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">2. Deney Masası</div>
              <div className="text-[11px] text-slate-500">Pergel ile Eşit Parça Kesme</div>
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
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black">
              3
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">3. Deney Masası</div>
              <div className="text-[11px] text-slate-500">Gönye, Dikme & Paralel Raylar</div>
            </div>
          </div>
          {exp3Completed && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        </button>

      </div>

      {/* ======================================================== */}
      {/* 1. DENEY MASASI: ÖLÇÜSÜZ CETVEL VE İKİ NOKTADAN TEK DOĞRU */}
      {/* ======================================================== */}
      {activeExp === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-teal-600 uppercase tracking-wider">
                Aksiyomatik Geometri Deneyi
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Ölçüsüz Cetvel ile İki Noktadan Geçen Doğru
              </h3>
              <p className="text-xs text-slate-500 max-w-xl">
                A ve B noktalarını serbestçe sürükleyin. Ölçüsüz cetveli bu iki noktaya hizalayın ve aralarından kaç tane farklı düz doğru geçebileceğini test edin.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExp1DrawLine}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Ruler className="w-4 h-4" />
                <span>Ölçüsüz Cetveli Hizala & Çiz</span>
              </button>

              <button
                onClick={handleExp1TrySecond}
                className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>2. Bir Düz Doğru Dene?</span>
              </button>

              <button
                onClick={handleClearExp1}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="Çizimleri ve noktaları sıfırla"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Ekranı Temizle</span>
              </button>
            </div>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden min-h-[340px] flex items-center justify-center p-4">
            <svg
              className="w-full h-[320px] select-none touch-none math-grid-bg opacity-90"
              viewBox="0 0 600 320"
              onPointerMove={(e) => handleSvgPointerMove(e, 600, 320)}
              onPointerUp={handleEndDrag}
              onPointerLeave={handleEndDrag}
            >
              {/* Top Hint Text */}
              <text x="300" y="22" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
                💡 A ve B noktalarını istediğiniz yere sürükleyip bırakabilirsiniz.
              </text>

              {/* Straight Line through A and B */}
              {exp1LineDrawn && (() => {
                const dx = exp1PtB.x - exp1PtA.x;
                const dy = exp1PtB.y - exp1PtA.y;
                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                const ext1X = exp1PtA.x - (dx / len) * 260;
                const ext1Y = exp1PtA.y - (dy / len) * 260;
                const ext2X = exp1PtB.x + (dx / len) * 260;
                const ext2Y = exp1PtB.y + (dy / len) * 260;

                return (
                  <g className="animate-in fade-in duration-300">
                    <line
                      x1={ext1X}
                      y1={ext1Y}
                      x2={ext2X}
                      y2={ext2Y}
                      stroke="#10b396"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <text x={Math.min(520, Math.max(80, ext2X - 20))} y={Math.min(290, Math.max(35, ext2Y - 10))} fill="#10b396" fontSize="12" fontWeight="bold">
                      AB Doğrusu ↔
                    </text>
                  </g>
                );
              })()}

              {/* Attempted second line animation */}
              {exp1TriedSecond && (
                <g className="animate-pulse">
                  <path
                    d={`M ${exp1PtA.x - 120} ${exp1PtA.y - 40} Q ${(exp1PtA.x + exp1PtB.x) / 2} ${
                      (exp1PtA.y + exp1PtB.y) / 2 - 50
                    } ${exp1PtB.x + 120} ${exp1PtB.y + 40}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeDasharray="6,4"
                  />
                  <text
                    x={(exp1PtA.x + exp1PtB.x) / 2}
                    y={(exp1PtA.y + exp1PtB.y) / 2 - 60}
                    fill="#f59e0b"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    ⚠️ Düz çizgi eğrilemez! İki noktadan 2. bir düz doğru geçemez.
                  </text>
                </g>
              )}

              {/* Point A (Draggable) */}
              <g
                transform={`translate(${exp1PtA.x}, ${exp1PtA.y})`}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => handleStartDrag('exp1A', e)}
              >
                <circle cx="0" cy="0" r="24" fill="#f59e0b" fillOpacity={draggingPoint === 'exp1A' ? '0.35' : '0.15'} className="animate-pulse" />
                <circle cx="0" cy="0" r="11" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" />
                <text x="0" y="-16" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
                  A Noktası
                </text>
                <text x="0" y="24" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ✋ Sürükle
                </text>
              </g>

              {/* Point B (Draggable) */}
              <g
                transform={`translate(${exp1PtB.x}, ${exp1PtB.y})`}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => handleStartDrag('exp1B', e)}
              >
                <circle cx="0" cy="0" r="24" fill="#0284c7" fillOpacity={draggingPoint === 'exp1B' ? '0.35' : '0.15'} className="animate-pulse" />
                <circle cx="0" cy="0" r="11" fill="#0284c7" stroke="#ffffff" strokeWidth="3" />
                <text x="0" y="-16" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
                  B Noktası
                </text>
                <text x="0" y="24" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ✋ Sürükle
                </text>
              </g>
            </svg>
          </div>

          {/* Maarif Deduction Card */}
          <div className="bg-teal-50 border-2 border-teal-300 p-5 rounded-2xl flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-black text-teal-950 text-sm">
                💡 Maarif Çıkarımı 1: İki Nokta — Tek Doğru İlkesi
              </h4>
              <p className="text-xs text-teal-900 leading-relaxed">
                Ölçüsüz düz bir cetvel ile düzlemde alınan herhangi farklı iki noktadan (A ve B) <strong>yalnız ve yalnız 1 tane düz doğru</strong> çizilebilir.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. DENEY MASASI: PERGEL İLE ÇEMBER VE EŞİT PARÇA KESME   */}
      {/* ======================================================== */}
      {activeExp === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-teal-600 uppercase tracking-wider">
                Pergel ile Geometrik İnşa
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Pergel ile Çember Yarıçapı ve Eşit Parça Kesme
              </h3>
              <p className="text-xs text-slate-500 max-w-xl">
                Pergel açıklığını (r yarıçapı) kullanarak çemberin tüm yarıçaplarının eşitliğini inceleyin; bir ışının veya açının kollarından eşit parçalar kesin.
              </p>
            </div>

            {/* Sub-mode selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setExp2Mode('circle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  exp2Mode === 'circle' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Çember (r)
              </button>
              <button
                onClick={() => setExp2Mode('ray')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  exp2Mode === 'ray' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Işında Parça Kes
              </button>
              <button
                onClick={() => setExp2Mode('angle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  exp2Mode === 'angle' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Açı Kolu Kes
              </button>
            </div>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden min-h-[360px] flex items-center justify-center p-4">
            <svg className="w-full h-[340px] select-none touch-none math-grid-bg opacity-95">
              
              {/* MODE A: CIRCLE RADIUS EQUALITY */}
              {exp2Mode === 'circle' && (
                <g transform="translate(300, 170)">
                  {/* Circle Body */}
                  <circle cx="0" cy="0" r={exp2Radius} fill="#0284c7" fillOpacity="0.12" stroke="#0284c7" strokeWidth="3" />
                  {/* Center O */}
                  <circle cx="0" cy="0" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
                  <text x="0" y="-12" fill="#f59e0b" fontSize="12" fontWeight="900" textAnchor="middle">
                    Merkez (O)
                  </text>

                  {/* Radii lines to circumference points */}
                  {exp2CirclePoints.map((pt) => {
                    const rad = (pt.deg * Math.PI) / 180;
                    const px = exp2Radius * Math.cos(rad);
                    const py = exp2Radius * Math.sin(rad);

                    return (
                      <g key={pt.id}>
                        <line x1="0" y1="0" x2={px} y2={py} stroke="#10b396" strokeWidth="3" />
                        <circle cx={px} cy={py} r="6" fill="#10b396" stroke="#ffffff" strokeWidth="2" />
                        <text x={px * 1.18} y={py * 1.18 + 4} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                          {pt.label} (r=8 cm)
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* MODE B: RAY STEP CUTTING */}
              {exp2Mode === 'ray' && (
                <g transform="translate(100, 170)">
                  {/* Base Ray Line */}
                  <line x1="0" y1="0" x2="440" y2="0" stroke="#0284c7" strokeWidth="4.5" strokeLinecap="round" />
                  <polygon points="440,0 426,-6 426,6" fill="#0284c7" />
                  <circle cx="0" cy="0" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <text x="0" y="-14" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">
                    [O Başlangıç
                  </text>

                  {/* Steps with Compass Arcs */}
                  {[1, 2, 3, 4].slice(0, exp2RaySteps).map((step) => {
                    const stepX = step * 85;
                    const label = ['A', 'B', 'C', 'D'][step - 1];

                    return (
                      <g key={step} className="animate-in zoom-in">
                        {/* Compass tick arc */}
                        <path
                          d={`M ${stepX - 10} -20 A 25 25 0 0 1 ${stepX + 10} 20`}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2.5"
                          strokeDasharray="4,2"
                        />
                        <circle cx={stepX} cy="0" r="6" fill="#10b396" stroke="#ffffff" strokeWidth="2" />
                        <text x={stepX} y="-26" fill="#10b396" fontSize="11" fontWeight="black" textAnchor="middle">
                          {label} (Adım {step})
                        </text>
                        {/* Segment measure badge */}
                        <text x={stepX - 42} y="22" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                          = r (Eşit)
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* MODE C: ANGLE ARM CUTTING */}
              {exp2Mode === 'angle' && (
                <g transform="translate(160, 200)">
                  {/* Base Arm */}
                  <line x1="0" y1="0" x2="300" y2="0" stroke="#0284c7" strokeWidth="4" />
                  {/* Top Arm at 50 deg */}
                  <line
                    x1="0"
                    y1="0"
                    x2={300 * Math.cos((-50 * Math.PI) / 180)}
                    y2={300 * Math.sin((-50 * Math.PI) / 180)}
                    stroke="#0284c7"
                    strokeWidth="4"
                  />
                  <circle cx="0" cy="0" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <text x="0" y="24" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Köşe O
                  </text>

                  {/* Compass Arc cutting both arms */}
                  {exp2AngleCut && (
                    <g className="animate-in fade-in duration-300">
                      <path
                        d={`M ${140} 0 A 140 140 0 0 0 ${140 * Math.cos((-50 * Math.PI) / 180)} ${
                          140 * Math.sin((-50 * Math.PI) / 180)
                        }`}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3.5"
                        strokeDasharray="6,3"
                      />
                      {/* Point P1 on arm 1 */}
                      <circle cx="140" cy="0" r="6" fill="#10b396" stroke="#ffffff" strokeWidth="2" />
                      <text x="140" y="20" fill="#10b396" fontSize="11" fontWeight="bold" textAnchor="middle">
                        A (|OA| = r)
                      </text>

                      {/* Point P2 on arm 2 */}
                      <circle
                        cx={140 * Math.cos((-50 * Math.PI) / 180)}
                        cy={140 * Math.sin((-50 * Math.PI) / 180)}
                        r="6"
                        fill="#10b396"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <text
                        x={140 * Math.cos((-50 * Math.PI) / 180) - 10}
                        y={140 * Math.sin((-50 * Math.PI) / 180) - 12}
                        fill="#10b396"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        B (|OB| = r)
                      </text>
                    </g>
                  )}
                </g>
              )}

            </svg>
          </div>

          {/* Action buttons per mode */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600 font-bold">
              {exp2Mode === 'circle' && '🔵 Çember üzerindeki tüm noktaların merkeze uzaklığı yarıçap (r) kadardır.'}
              {exp2Mode === 'ray' && '🔦 Pergel açıklığını bozmadan ışın üzerinde eşit doğru parçaları kesilir.'}
              {exp2Mode === 'angle' && '📐 Pergel açının köşesine batırılarak her iki koldan eşit parça (|OA|=|OB|) kesilir.'}
            </div>

            {exp2Mode === 'circle' && (
              <button
                onClick={handleAddCirclePoint}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all shadow-xs"
              >
                + Çember Üzerine Yeni Nokta Ekle (r Testi)
              </button>
            )}

            {exp2Mode === 'ray' && (
              <button
                onClick={handleStepRay}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all shadow-xs"
              >
                🧭 Pergel ile Bir Sonraki Eşit Parçayı Kes ({exp2RaySteps}/4)
              </button>
            )}

            {exp2Mode === 'angle' && (
              <button
                onClick={handleCutAngle}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all shadow-xs"
              >
                📐 Pergelle İki Kolu da Kes ({exp2AngleCut ? 'Kolları Temizle' : 'Kolları Eşitle'})
              </button>
            )}
          </div>

          {/* Maarif Deduction Card */}
          <div className="bg-teal-50 border-2 border-teal-300 p-5 rounded-2xl flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-black text-teal-950 text-sm">
                💡 Maarif Çıkarımı 2 & 3: Pergelin Rolü ve Eşit Mesafeler
              </h4>
              <p className="text-xs text-teal-900 leading-relaxed">
                Pergel, sabit açıklığı sayesinde <strong>eşit yarıçaplı çemberler çizmek</strong> ve bir ışın veya açının kollarından <strong>yan yana eşit uzunlukta doğru parçaları kesmek</strong> için temel inşa aletidir.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 3. DENEY MASASI: GÖNYE İLE DİKME VE PARALEL RAYLAR (OB2)  */}
      {/* ======================================================== */}
      {activeExp === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-teal-600 uppercase tracking-wider">
                Dinamik Geometri Yazılımı (OB2)
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Gönye ile Dikme ve Paralel Doğrular (d₁ ∥ d₂)
              </h3>
              <p className="text-xs text-slate-500 max-w-xl">
                Taban doğrusuna dışarıdaki bir noktadan gönye ile tek dikme indirin; eşit uzaklıktaki noktaları birleştirip paralel rayları simüle edin.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDrawPerp}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>Gönyeyle Tek Dikme İndir (⊥)</span>
              </button>

              <button
                onClick={handleDrawParallel}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>Paralel Doğruyu İnşa Et (∥)</span>
              </button>

              <button
                onClick={handleClearExp3}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="Çizimleri ve ayarları sıfırla"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Ekranı Temizle</span>
              </button>
            </div>
          </div>

          {/* Distance Slider (Dinamik Mesafe) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>Paralel Doğrular Arası Dik Mesafe (h):</span>
            </span>
            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <input
                type="range"
                min="60"
                max="160"
                value={exp3ParallelDistance}
                onChange={(e) => setExp3ParallelDistance(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <span className="font-mono font-black text-xs text-teal-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                {exp3ParallelDistance} px ({Math.round(exp3ParallelDistance / 10)} cm)
              </span>
            </div>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden min-h-[360px] flex items-center justify-center p-4">
            <svg
              className="w-full h-[340px] select-none touch-none math-grid-bg opacity-95"
              viewBox="0 0 600 340"
              onPointerMove={(e) => handleSvgPointerMove(e, 600, 340)}
              onPointerUp={handleEndDrag}
              onPointerLeave={handleEndDrag}
            >
              {/* Dragging hint */}
              <text x="300" y="22" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
                💡 Dışarıdaki P noktasını istediğiniz yere sürükleyerek dikme ve paralelliği test edin.
              </text>
              
              {/* Base Line d1 (Taban Doğrusu) */}
              <line x1="50" y1="240" x2="550" y2="240" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" />
              <text x="555" y="245" fill="#0284c7" fontSize="13" fontWeight="900">
                d₁ (Taban)
              </text>

              {/* Perpendicular Line from P to d1 */}
              {exp3PerpDrawn && (
                <g className="animate-in fade-in duration-300">
                  <line x1={exp3PerpPoint.x} y1={exp3PerpPoint.y} x2={exp3PerpPoint.x} y2="240" stroke="#f59e0b" strokeWidth="3.5" />
                  {/* Right Angle Square at base */}
                  <rect x={exp3PerpPoint.x} y="222" width="18" height="18" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1.5" />
                  <circle cx={exp3PerpPoint.x + 9} cy="231" r="2.5" fill="#f59e0b" />
                  <text x={exp3PerpPoint.x + 12} y={(exp3PerpPoint.y + 240) / 2} fill="#f59e0b" fontSize="11" fontWeight="bold">
                    Tek Dikme (90°)
                  </text>
                </g>
              )}

              {/* Point P (Draggable Dış Nokta) */}
              <g
                transform={`translate(${exp3PerpPoint.x}, ${exp3PerpPoint.y})`}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => handleStartDrag('exp3P', e)}
              >
                <circle cx="0" cy="0" r="22" fill="#f59e0b" fillOpacity={draggingPoint === 'exp3P' ? '0.35' : '0.15'} className="animate-pulse" />
                <circle cx="0" cy="0" r="9" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
                <text x="0" y="-14" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                  P (Dış Nokta)
                </text>
                <text x="0" y="22" fill="#fde047" fontSize="9" fontWeight="bold" textAnchor="middle">
                  ✋ Sürükle
                </text>
              </g>

              {/* Parallel Line d2 at distance exp3ParallelDistance */}
              {exp3ParallelDrawn && (() => {
                const parallelY = 240 - exp3ParallelDistance;
                return (
                  <g className="animate-in slide-in-from-top-2 duration-300">
                    {/* Parallel Line d2 */}
                    <line x1="60" y1={parallelY} x2="540" y2={parallelY} stroke="#10b396" strokeWidth="5" strokeLinecap="round" />
                    <text x="548" y={parallelY + 5} fill="#10b396" fontSize="13" fontWeight="900">
                      d₂ (Paralel)
                    </text>

                    {/* 3 Equidistant Perpendicular Height Markers */}
                    {[140, 300, 460].map((xPos, idx) => (
                      <g key={xPos}>
                        <line x1={xPos} y1={parallelY} x2={xPos} y2="240" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5,3" />
                        {/* Right Angle Square */}
                        <rect x={xPos} y="224" width="14" height="14" fill="#38bdf8" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1" />
                        <circle cx={xPos + 7} cy="231" r="2" fill="#38bdf8" />
                        <circle cx={xPos} cy={parallelY} r="5" fill="#10b396" stroke="#ffffff" strokeWidth="1.5" />
                        <text x={xPos + 8} y={(parallelY + 240) / 2 + 4} fill="#38bdf8" fontSize="10" fontWeight="bold">
                          h={Math.round(exp3ParallelDistance / 10)} cm
                        </text>
                      </g>
                    ))}

                    {/* Train track sleepers simulation */}
                    <text x="300" y={parallelY - 14} fill="#10b396" fontSize="12" fontWeight="black" textAnchor="middle">
                      🚂 Tren Rayları Modeli: d₁ ∥ d₂ (Kesişmez)
                    </text>
                  </g>
                );
              })()}

            </svg>
          </div>

          {/* Maarif Deduction Card */}
          <div className="bg-teal-50 border-2 border-teal-300 p-5 rounded-2xl flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-black text-teal-950 text-sm">
                💡 Maarif Çıkarımı 4 & 5: Tek Dikme ve Paralel Doğrular (d₁ ∥ d₂)
              </h4>
              <p className="text-xs text-teal-900 leading-relaxed">
                Bir doğruya dışındaki sabit bir noktadan <strong>yalnız 1 dikme</strong> çizilebilir. Bir doğruya eşit dik uzaklıktaki tüm noktaların birleşimi ise ilk doğruya <strong>paralel bir doğru (d₁ ∥ d₂)</strong> oluşturur. Tren rayları gibi hiçbir zaman kesişmezler.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
