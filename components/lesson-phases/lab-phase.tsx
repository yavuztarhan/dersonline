'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LabPhaseData } from '@/types';
import { useApp } from '@/lib/store';
import { ExperimentBench } from '@/components/lesson-phases/experiment-bench';
import {
  Shapes,
  Dot,
  Minus,
  ArrowRight,
  Maximize2,
  Trash2,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Info,
  Layers,
  HelpCircle,
  Award,
  Undo2,
  FlaskConical,
  Compass
} from 'lucide-react';

interface LabPhaseProps {
  data: LabPhaseData;
  onNextPhase: () => void;
}

interface GeoPoint {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

interface GeoObject {
  id: string;
  type: 'segment' | 'ray' | 'line';
  p1: GeoPoint;
  p2: GeoPoint;
  symbol: string;
  label: string;
  length?: number;
  color: string;
}

const POINT_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T'];
const COLORS = ['#10b396', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444'];

export function LabPhase({ data, onNextPhase }: LabPhaseProps) {
  const { playSound, unlockBadge, addPoints, role } = useApp();

  const [labMode, setLabMode] = useState<'experiment' | 'canvas'>(
    data.toolType === 'experiment-bench' ? 'experiment' : 'canvas'
  );
  
  const [activeTool, setActiveTool] = useState<'point' | 'segment' | 'ray' | 'line'>('point');
  // Starts completely empty as requested
  const [points, setPoints] = useState<GeoPoint[]>([]);
  const [objects, setObjects] = useState<GeoObject[]>([]);
  const [selectedPointForLink, setSelectedPointForLink] = useState<GeoPoint | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [activeColor, setActiveColor] = useState('#10b396');
  const [showGrid, setShowGrid] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('Çizim yapmak için tahtaya tıklayınız.');

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Check achievements when objects change
  useEffect(() => {
    const hasSegment = objects.some((o) => o.type === 'segment');
    const hasRay = objects.some((o) => o.type === 'ray');
    const hasLine = objects.some((o) => o.type === 'line');

    if (hasSegment && hasRay && hasLine) {
      unlockBadge('geometry-master');
      addPoints(30);
    }
  }, [objects]);

  const loadPresets = () => {
    playSound('click');
    const pA: GeoPoint = { id: 'pA', label: 'A', x: 120, y: 150, color: '#10b396' };
    const pB: GeoPoint = { id: 'pB', label: 'B', x: 340, y: 150, color: '#10b396' };
    const pC: GeoPoint = { id: 'pC', label: 'C', x: 120, y: 280, color: '#3b82f6' };
    const pD: GeoPoint = { id: 'pD', label: 'D', x: 420, y: 280, color: '#3b82f6' };
    const pE: GeoPoint = { id: 'pE', label: 'E', x: 220, y: 400, color: '#f59e0b' };
    const pF: GeoPoint = { id: 'pF', label: 'F', x: 540, y: 400, color: '#f59e0b' };

    setPoints([pA, pB, pC, pD, pE, pF]);

    const seg: GeoObject = {
      id: 'seg-1',
      type: 'segment',
      p1: pA,
      p2: pB,
      symbol: '[AB]',
      label: 'Doğru Parçası [AB]',
      length: 220,
      color: '#10b396'
    };

    const ray: GeoObject = {
      id: 'ray-1',
      type: 'ray',
      p1: pC,
      p2: pD,
      symbol: '[CD',
      label: 'Işın [CD',
      length: 300,
      color: '#3b82f6'
    };

    const line: GeoObject = {
      id: 'line-1',
      type: 'line',
      p1: pE,
      p2: pF,
      symbol: 'EF Doğrusu',
      label: 'Doğru EF',
      color: '#f59e0b'
    };

    setObjects([seg, ray, line]);
    setSelectedPointForLink(null);
    setFeedbackMsg('Örnek geometrik modeller yüklendi: [AB] Doğru Parçası, [CD Işını ve EF Doğrusu.');
  };

  const clearAll = () => {
    playSound('clear');
    setPoints([]);
    setObjects([]);
    setSelectedPointForLink(null);
    setFeedbackMsg('Tahta temizlendi. Yeni çizim yapabilirsiniz.');
  };

  const undoLast = () => {
    playSound('click');
    if (objects.length > 0) {
      setObjects(objects.slice(0, -1));
      setFeedbackMsg('Son çizilen geometrik şekil geri alındı.');
    } else if (points.length > 0) {
      setPoints(points.slice(0, -1));
      setSelectedPointForLink(null);
      setFeedbackMsg('Son oluşturulan nokta geri alındı.');
    }
  };

  // Find if a point exists near (x, y)
  const getPointNear = (x: number, y: number, currentPoints: GeoPoint[], radius = 24): GeoPoint | null => {
    for (const pt of currentPoints) {
      const dx = pt.x - x;
      const dy = pt.y - y;
      if (Math.sqrt(dx * dx + dy * dy) <= radius) {
        return pt;
      }
    }
    return null;
  };

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current || !selectedPointForLink) return;
    const rect = svgRef.current.getBoundingClientRect();
    setHoverPos({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // MODE 1: POINT TOOL
    if (activeTool === 'point') {
      const nextLabel = POINT_LABELS[points.length % POINT_LABELS.length];
      const newPoint: GeoPoint = {
        id: `pt-${Date.now()}-${Math.random()}`,
        label: nextLabel,
        x,
        y,
        color: activeColor
      };
      setPoints([...points, newPoint]);
      playSound('click');
      setFeedbackMsg(`📍 ${nextLabel} noktası oluşturuldu. (X: ${x}, Y: ${y})`);
      return;
    }

    // MODE 2, 3, 4: SEGMENT, RAY, OR LINE TOOLS
    // 1. Check if clicking on or near an existing point
    let targetPoint = getPointNear(x, y, points);
    let updatedPoints = [...points];

    // If no existing point near click, create a brand new point automatically!
    if (!targetPoint) {
      const nextLabel = POINT_LABELS[points.length % POINT_LABELS.length];
      targetPoint = {
        id: `pt-${Date.now()}-${Math.random()}`,
        label: nextLabel,
        x,
        y,
        color: activeColor
      };
      updatedPoints.push(targetPoint);
      setPoints(updatedPoints);
    }

    // Now handle connection between 1st point and 2nd point
    if (!selectedPointForLink) {
      // First point chosen
      setSelectedPointForLink(targetPoint);
      playSound('select');
      const toolName = activeTool === 'segment' ? 'Doğru Parçası' : activeTool === 'ray' ? 'Işın' : 'Doğru';
      setFeedbackMsg(`1. Nokta (${targetPoint.label}) belirlendi. Şimdi 2. noktaya tıklayarak ${toolName} tamamlayın.`);
    } else {
      // Second point chosen
      if (selectedPointForLink.id === targetPoint.id) {
        // Clicked same point -> cancel selection
        setSelectedPointForLink(null);
        setHoverPos(null);
        setFeedbackMsg('Nokta seçimi iptal edildi.');
        return;
      }

      const p1 = selectedPointForLink;
      const p2 = targetPoint;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.round(Math.sqrt(dx * dx + dy * dy));

      let newObj: GeoObject;
      if (activeTool === 'segment') {
        newObj = {
          id: `obj-${Date.now()}`,
          type: 'segment',
          p1,
          p2,
          symbol: `[${p1.label}${p2.label}]`,
          label: `Doğru Parçası [${p1.label}${p2.label}]`,
          length: dist,
          color: activeColor
        };
        setFeedbackMsg(`📏 [${p1.label}${p2.label}] Doğru Parçası başarıyla çizildi! (Uzunluk: ${dist} birim)`);
      } else if (activeTool === 'ray') {
        newObj = {
          id: `obj-${Date.now()}`,
          type: 'ray',
          p1,
          p2,
          symbol: `[${p1.label}${p2.label}`,
          label: `Işın [${p1.label}${p2.label}`,
          length: dist,
          color: activeColor
        };
        setFeedbackMsg(`🔦 [${p1.label}${p2.label} Işını çizildi! Başlangıç: ${p1.label}, ${p2.label} yönünde sonsuza uzanır.`);
      } else {
        newObj = {
          id: `obj-${Date.now()}`,
          type: 'line',
          p1,
          p2,
          symbol: `${p1.label}${p2.label} Doğrusu`,
          label: `Doğru ${p1.label}${p2.label}`,
          color: activeColor
        };
        setFeedbackMsg(`↔️ ${p1.label}${p2.label} Doğrusu çizildi! İki yönden de sınırsız uzanır.`);
      }

      setObjects([...objects, newObj]);
      setSelectedPointForLink(null);
      setHoverPos(null);
      playSound('success');
    }
  };

  const handleToolChange = (tool: 'point' | 'segment' | 'ray' | 'line') => {
    setActiveTool(tool);
    setSelectedPointForLink(null);
    setHoverPos(null);
    playSound('click');

    if (tool === 'point') {
      setFeedbackMsg('Nokta aracı seçildi. Tahtaya tıklayarak noktalar oluşturun.');
    } else if (tool === 'segment') {
      setFeedbackMsg('Doğru Parçası aracı seçildi. 1. noktaya ve ardından 2. noktaya tıklayınız.');
    } else if (tool === 'ray') {
      setFeedbackMsg('Işın aracı seçildi. Başlangıç noktasına ve ardından yön noktasına tıklayınız.');
    } else if (tool === 'line') {
      setFeedbackMsg('Doğru aracı seçildi. Çizgi üzerindeki iki noktaya tıklayınız.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Shapes className="w-3.5 h-3.5 text-teal-600" />
            <span>2. Aşama: İnteraktif Geometri Laboratuvarı</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800">{data.title}</h2>
          <p className="text-xs text-slate-500 mt-1">{data.taskGoal}</p>
        </div>

        {/* View Mode Switcher (Experiment Bench vs Freehand Canvas) */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => {
              setLabMode('experiment');
              playSound('click');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              labMode === 'experiment'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>🧪 Hipotez Masası</span>
          </button>

          <button
            onClick={() => {
              setLabMode('canvas');
              playSound('click');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              labMode === 'canvas'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>📐 Serbest Çizim</span>
          </button>
        </div>
      </div>

      {/* EXPERIMENT BENCH MODE */}
      {labMode === 'experiment' ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <ExperimentBench />

          {/* Jump to Phase 3 */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="text-xs text-slate-500 font-bold">
              3 Deneyi de tamamladıktan sonra kavram bulmacasına geçebilirsiniz.
            </div>
            <button
              onClick={() => {
                playSound('select');
                onNextPhase();
              }}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>3. Aşamaya Geç: Bulmaca & Oyunlar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* FREEHAND CANVAS MODE */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-200">
        
        {/* Left Toolbar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Geometri Araçları
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleToolChange('point')}
                className={`p-3.5 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                  activeTool === 'point'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-102'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-sm font-black">
                  •
                </div>
                <span>Nokta (•)</span>
              </button>

              <button
                onClick={() => handleToolChange('segment')}
                className={`p-3.5 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                  activeTool === 'segment'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-102'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="w-7 h-7 flex items-center justify-center font-black text-sm">
                  [—]
                </div>
                <span>Doğru Parçası</span>
              </button>

              <button
                onClick={() => handleToolChange('ray')}
                className={`p-3.5 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                  activeTool === 'ray'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-102'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="w-7 h-7 flex items-center justify-center font-black text-sm">
                  [—&gt;
                </div>
                <span>Işın</span>
              </button>

              <button
                onClick={() => handleToolChange('line')}
                className={`p-3.5 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                  activeTool === 'line'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-102'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="w-7 h-7 flex items-center justify-center font-black text-sm">
                  &lt;—&gt;
                </div>
                <span>Doğru</span>
              </button>
            </div>

            {/* Colors */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-500">Çizim Rengi</span>
              <div className="flex items-center gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      activeColor === c ? 'scale-125 ring-2 ring-slate-800 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Grid Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Matematik Izgarası</span>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  showGrid ? 'bg-teal-100 text-teal-800 border-teal-300' : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                {showGrid ? 'Açık' : 'Kapalı'}
              </button>
            </div>

          </div>

          {/* Guidance Box */}
          <div className="bg-teal-50/70 border border-teal-200 rounded-3xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-teal-900">
              <Info className="w-4 h-4 text-teal-600" />
              <span>Nasıl Kullanılır?</span>
            </div>
            <p className="text-teal-950 font-medium leading-relaxed">
              {activeTool === 'point' && 'Tahtada herhangi bir yere tıklayarak yeni nokta oluşturun.'}
              {activeTool === 'segment' && 'İki noktaya ardı ardına tıklayarak [AB] Doğru Parçası oluşturun. (Nokta yoksa doğrudan tahtaya tıklayabilirsiniz).'}
              {activeTool === 'ray' && 'Önce başlangıç noktasına, sonra yön noktasına tıklayarak [AB Işını oluşturun.'}
              {activeTool === 'line' && 'İki noktaya tıklayarak iki ucu sonsuza uzanan doğru oluşturun.'}
            </p>
          </div>
        </div>

        {/* Center: The Geometry Board */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="relative bg-white rounded-3xl border-2 border-slate-200 shadow-inner overflow-hidden min-h-[460px] flex flex-col justify-between">
            
            {/* Live Status Bar */}
            <div className="bg-slate-900/90 text-white px-5 py-2.5 flex items-center justify-between text-xs font-medium z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{feedbackMsg}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span>Noktalar: {points.length}</span>
                <span>Şekiller: {objects.length}</span>
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <svg
              ref={svgRef}
              onClick={handleCanvasClick}
              onPointerMove={handleSvgPointerMove}
              className={`w-full h-[420px] cursor-crosshair select-none ${showGrid ? 'math-grid-bg' : ''}`}
            >
              {/* Defs for arrow markers */}
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
                </marker>
                <marker
                  id="arrow-line-start"
                  viewBox="0 0 10 10"
                  refX="4"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 10 1 L 0 5 L 10 9 z" fill="#f59e0b" />
                </marker>
                <marker
                  id="arrow-line-end"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
                </marker>
              </defs>

              {/* Empty state hint when no points exist */}
              {points.length === 0 && (
                <g className="pointer-events-none">
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="15"
                    fontWeight="600"
                  >
                    ✨ Çizim alanı hazır. Nokta veya şekil oluşturmak için tahtaya tıklayınız.
                  </text>
                </g>
              )}

              {/* Live Preview Line while connecting */}
              {selectedPointForLink && hoverPos && (
                <line
                  x1={selectedPointForLink.x}
                  y1={selectedPointForLink.y}
                  x2={hoverPos.x}
                  y2={hoverPos.y}
                  stroke={activeColor}
                  strokeWidth="2.5"
                  strokeDasharray="6,4"
                  className="animate-pulse"
                />
              )}

              {/* Draw Geometric Objects */}
              {objects.map((obj) => {
                const { p1, p2, type, color, id } = obj;
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                const angle = Math.atan2(dy, dx);
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;

                const getArrowPoints = (x: number, y: number, dirAngle: number, arrowLen = 14, arrowWidth = 7) => {
                  const cos = Math.cos(dirAngle);
                  const sin = Math.sin(dirAngle);
                  const leftX = x - arrowLen * cos - arrowWidth * sin;
                  const leftY = y - arrowLen * sin + arrowWidth * cos;
                  const rightX = x - arrowLen * cos + arrowWidth * sin;
                  const rightY = y - arrowLen * sin - arrowWidth * cos;
                  return `${x},${y} ${leftX},${leftY} ${rightX},${rightY}`;
                };

                if (type === 'segment') {
                  return (
                    <g key={id}>
                      <line
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke={color}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      {/* Segment Bounds visualizer */}
                      <circle cx={p1.x} cy={p1.y} r="5" fill={color} stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx={p2.x} cy={p2.y} r="5" fill={color} stroke="#ffffff" strokeWidth="1.5" />
                      {/* Label badge */}
                      <rect
                        x={midX - 25}
                        y={midY - 24}
                        width="50"
                        height="18"
                        rx="6"
                        fill="#0f172a"
                        opacity="0.85"
                      />
                      <text
                        x={midX}
                        y={midY - 11}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        [{p1.label}{p2.label}]
                      </text>
                    </g>
                  );
                }

                if (type === 'ray') {
                  // Extend line past p2 in direction angle
                  const extendLen = Math.max(len + 45, 80);
                  const extX = p1.x + (dx / len) * extendLen;
                  const extY = p1.y + (dy / len) * extendLen;
                  const rayArrow = getArrowPoints(extX, extY, angle);

                  return (
                    <g key={id}>
                      <line
                        x1={p1.x}
                        y1={p1.y}
                        x2={extX}
                        y2={extY}
                        stroke={color}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <polygon points={rayArrow} fill={color} />
                      {/* Closed start point */}
                      <circle cx={p1.x} cy={p1.y} r="6" fill={color} stroke="#ffffff" strokeWidth="2" />
                      {/* Label badge */}
                      <rect
                        x={midX - 32}
                        y={midY - 24}
                        width="64"
                        height="18"
                        rx="6"
                        fill="#0f172a"
                        opacity="0.85"
                      />
                      <text
                        x={midX}
                        y={midY - 11}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        [{p1.label}{p2.label} Işını
                      </text>
                    </g>
                  );
                }

                if (type === 'line') {
                  // Line extends both sides away from p1 and p2
                  const extendBy = 55;
                  const ext1X = p1.x - (dx / len) * extendBy;
                  const ext1Y = p1.y - (dy / len) * extendBy;
                  const ext2X = p2.x + (dx / len) * extendBy;
                  const ext2Y = p2.y + (dy / len) * extendBy;

                  // Arrow 1 at ext1 points backward (angle + PI)
                  const arrow1 = getArrowPoints(ext1X, ext1Y, angle + Math.PI);
                  // Arrow 2 at ext2 points forward (angle)
                  const arrow2 = getArrowPoints(ext2X, ext2Y, angle);

                  return (
                    <g key={id}>
                      <line
                        x1={ext1X}
                        y1={ext1Y}
                        x2={ext2X}
                        y2={ext2Y}
                        stroke={color}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <polygon points={arrow1} fill={color} />
                      <polygon points={arrow2} fill={color} />
                      {/* Label badge centered between points */}
                      <rect
                        x={midX - 38}
                        y={midY - 24}
                        width="76"
                        height="18"
                        rx="6"
                        fill="#0f172a"
                        opacity="0.85"
                      />
                      <text
                        x={midX}
                        y={midY - 11}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {p1.label}{p2.label} Doğrusu
                      </text>
                    </g>
                  );
                }

                return null;
              })}

              {/* Render Points on top */}
              {points.map((pt) => {
                const isSelected = selectedPointForLink?.id === pt.id;
                return (
                  <g
                    key={pt.id}
                    className="cursor-pointer group pointer-events-none"
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="18"
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="2.5"
                        className="animate-ping"
                      />
                    )}

                    {/* Point circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 9 : 7}
                      fill={pt.color}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-all hover:scale-125 shadow-sm"
                    />

                    {/* Point Label */}
                    <text
                      x={pt.x}
                      y={pt.y - 12}
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize="14"
                      fontWeight="900"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Inspector Bar */}
            <div className="bg-slate-50 border-t border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-slate-700">Sembolik Temsil Tablosu:</span>
                {objects.length === 0 ? (
                  <span className="text-slate-400 italic">Henüz şekil çizilmedi</span>
                ) : (
                  objects.map((obj) => (
                    <span
                      key={obj.id}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 font-black text-slate-800 shadow-2xs"
                    >
                      {obj.symbol}
                    </span>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  playSound('select');
                  onNextPhase();
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span>3. Aşamaya Geç: Bulmaca & Eşleştirme</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    )}

  </div>
);
}
