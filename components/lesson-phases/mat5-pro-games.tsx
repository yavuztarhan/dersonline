'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Trophy,
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Zap,
  Rocket,
  Layers,
  Crosshair,
  Gauge,
  Sliders,
  Check,
  Flame,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Compass,
  Train,
  Anchor,
  HelpCircle,
  Timer,
  Heart,
  Volume2,
  VolumeX,
  Play,
  ArrowRight,
  Target,
  Maximize2,
  Palette,
  Navigation,
  Sun,
  Moon,
  Move,
  Eye,
  Radio,
  Minus,
  Plus
} from 'lucide-react';
import { getStoredActiveBoardStudent, clearActiveBoardStudent, saveBoardParticipation } from '@/lib/board-participation-store';
import { useAuth } from '@/lib/auth-store';

// =================================================================
// WEB AUDIO SYNTHESIZER FOR PRO GAMES
// =================================================================
class ProSoundSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playTileGlaze() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Seljuk chimes)
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.2, this.ctx!.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.06 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.06);
      osc.stop(this.ctx!.currentTime + idx * 0.06 + 0.4);
    });
  }

  playRadarPing() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playStarConnect() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playBridgeSnap() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc2.frequency.setValueAtTime(440, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.3);
    osc2.stop(this.ctx.currentTime + 0.3);
  }

  playSuccess() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.2, this.ctx!.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.35);
    });
  }

  playError() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.28);
  }
}

const synth = new ProSoundSynth();

// =================================================================
// 1. OYUN: SELÇUKLU SARAYI ÇİNİ USTASI (D7.1 Sanat & Geometrik İnşalar)
// =================================================================
interface SeljukLevel {
  id: number;
  title: string;
  subtitle: string;
  targetShape: 'circle-rosette' | 'eight-point-star' | 'grand-mosaic';
}

const SELJUK_LEVELS: SeljukLevel[] = [
  {
    id: 1,
    title: '1. Aşama: Kubbe Rozeti (Pergel & Eş Çember Yayları)',
    subtitle: 'Merkez (M) ve 4 ana yöndeki merkezlerden pergel ile eş yarıçaplı yaylar çizerek 4 yapraklı Selçuklu gülbezek rozetini inşa et.',
    targetShape: 'circle-rosette'
  },
  {
    id: 2,
    title: '2. Aşama: Sekiz Köşeli Selçuklu Yıldızı (Gönye ile Dik Eksenler & Çizgeç)',
    subtitle: 'Gönye ile 90° dik eksenleri (d1 ⊥ d2) oluştur, ardından çizgeç ile 8 tepe noktasını birleştirerek 8 köşeli yıldızı tamamla.',
    targetShape: 'eight-point-star'
  },
  {
    id: 3,
    title: '3. Aşama: Saray Baş Mimarı Çini Başyapıtı (Büyük Divan Çinisi)',
    subtitle: 'Pergel çemberleri, gönye dikmeleri ve çizgeç ışınlarını birleştir, çinini sırlayıp 1000°C saray fırınında fırınla!',
    targetShape: 'grand-mosaic'
  }
];

const GLAZE_COLORS = [
  { name: 'İznik Turkuazı', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
  { name: 'Kobalt Mavisi', color: '#1d4ed8', glow: 'rgba(29, 78, 216, 0.4)' },
  { name: 'Selçuklu Altını', color: '#eab308', glow: 'rgba(234, 179, 8, 0.4)' },
  { name: 'Saray Yakutu', color: '#e11d48', glow: 'rgba(225, 29, 72, 0.4)' },
  { name: 'Zümrüt Yeşili', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  { name: 'Fildişi Beyazı', color: '#f8fafc', glow: 'rgba(248, 250, 252, 0.3)' }
];

export function SeljukTileMasterGame({ onComplete }: { onComplete?: () => void }) {
  const { addPoints, unlockBadge } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [levelIdx, setLevelIdx] = useState(0);
  const [activeTool, setActiveTool] = useState<'compass' | 'setsquare' | 'ruler' | 'glaze'>('compass');
  const [selectedGlazeColor, setSelectedGlazeColor] = useState<string>('#06b6d4');
  const [glazedParts, setGlazedParts] = useState<Record<string, string>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBaking, setIsBaking] = useState(false);

  // LEVEL 1: COMPASS ROSETTE STATE
  const [mainCircleDrawn, setMainCircleDrawn] = useState(false);
  const [drawnPetals, setDrawnPetals] = useState<number[]>([]); // indices 0..3 for N, S, E, W
  const [selectedCompassCenter, setSelectedCompassCenter] = useState<number | null>(null); // -1 for M, 0..3 for petals
  const [compassAngle, setCompassAngle] = useState(0);
  const [isDrawingArc, setIsDrawingArc] = useState(false);

  // LEVEL 2: EIGHT-POINT STAR STATE
  const [axesDrawn, setAxesDrawn] = useState(false);
  const [diagonalsDrawn, setDiagonalsDrawn] = useState(false);
  const [connectedStarNodes, setConnectedStarNodes] = useState<number[]>([]);
  const [lastSelectedNode, setLastSelectedNode] = useState<number | null>(null);

  // LEVEL 3: GRAND MOSAIC STATE
  const [l3CirclesDrawn, setL3CirclesDrawn] = useState(false);
  const [l3RaysDrawn, setL3RaysDrawn] = useState(false);
  const [l3StarDrawn, setL3StarDrawn] = useState(false);

  const currentLevel = SELJUK_LEVELS[levelIdx];

  // Level 1 Centers
  const L1_CENTERS = [
    { id: 0, label: 'K (Kuzey)', cx: 200, cy: 110, angle: 90 },
    { id: 1, label: 'G (Güney)', cx: 200, cy: 290, angle: 270 },
    { id: 2, label: 'D (Doğu)', cx: 290, cy: 200, angle: 0 },
    { id: 3, label: 'B (Batı)', cx: 110, cy: 200, angle: 180 }
  ];

  // Level 2 8-Star Vertices
  const STAR_NODES = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i * 45 - 90) * (Math.PI / 180);
    const r = 135;
    return {
      id: i,
      label: String.fromCharCode(65 + i), // A, B, C...
      x: Math.round(200 + r * Math.cos(angle)),
      y: Math.round(200 + r * Math.sin(angle))
    };
  });

  // --- LEVEL 1 INTERACTIVE ACTIONS ---
  const handleDrawMainCircle = () => {
    if (mainCircleDrawn) return;
    synth.playRadarPing();
    setIsDrawingArc(true);
    let cur = 0;
    const interval = setInterval(() => {
      cur += 30;
      setCompassAngle(cur);
      if (cur >= 360) {
        clearInterval(interval);
        setIsDrawingArc(false);
        setMainCircleDrawn(true);
        synth.playSuccess();
      }
    }, 40);
  };

  const handleDrawPetal = (centerIdx: number) => {
    if (drawnPetals.includes(centerIdx)) return;
    setSelectedCompassCenter(centerIdx);
    synth.playStarConnect();
    setIsDrawingArc(true);
    let cur = 0;
    const interval = setInterval(() => {
      cur += 40;
      setCompassAngle(cur);
      if (cur >= 360) {
        clearInterval(interval);
        setIsDrawingArc(false);
        setDrawnPetals(prev => [...prev, centerIdx]);
        synth.playBridgeSnap();
      }
    }, 30);
  };

  // --- LEVEL 2 INTERACTIVE ACTIONS ---
  const handleDrawAxes = () => {
    synth.playBridgeSnap();
    setAxesDrawn(true);
  };

  const handleDrawDiagonals = () => {
    synth.playBridgeSnap();
    setDiagonalsDrawn(true);
  };

  const handleNodeClick = (nodeId: number) => {
    synth.playStarConnect();
    if (lastSelectedNode === null) {
      setLastSelectedNode(nodeId);
      if (!connectedStarNodes.includes(nodeId)) {
        setConnectedStarNodes(prev => [...prev, nodeId]);
      }
    } else {
      if (!connectedStarNodes.includes(nodeId)) {
        setConnectedStarNodes(prev => [...prev, nodeId]);
      }
      setLastSelectedNode(nodeId);
      if (connectedStarNodes.length >= 7) {
        synth.playSuccess();
      }
    }
  };

  const handleAutoConnectStar = () => {
    synth.playSuccess();
    setConnectedStarNodes([0, 1, 2, 3, 4, 5, 6, 7]);
    setAxesDrawn(true);
    setDiagonalsDrawn(true);
  };

  // --- GLAZE / COLORING ACTION ---
  const handleGlazePart = (partKey: string) => {
    synth.playTileGlaze();
    setGlazedParts(prev => ({ ...prev, [partKey]: selectedGlazeColor }));
  };

  const handleAutoGlazeAll = () => {
    synth.playTileGlaze();
    if (levelIdx === 0) {
      setGlazedParts({
        'center-rosette': selectedGlazeColor,
        'petal-0': selectedGlazeColor,
        'petal-1': selectedGlazeColor,
        'petal-2': selectedGlazeColor,
        'petal-3': selectedGlazeColor
      });
    } else if (levelIdx === 1) {
      const parts: Record<string, string> = { 'star-center': selectedGlazeColor };
      for (let i = 0; i < 8; i++) {
        parts[`star-ray-${i}`] = i % 2 === 0 ? selectedGlazeColor : '#eab308';
      }
      setGlazedParts(parts);
    } else {
      const parts: Record<string, string> = { 'l3-core': '#eab308', 'l3-ring': selectedGlazeColor };
      for (let i = 0; i < 8; i++) {
        parts[`l3-petal-${i}`] = i % 2 === 0 ? selectedGlazeColor : '#1d4ed8';
      }
      setGlazedParts(parts);
    }
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  // --- LEVEL 3 ACTIONS ---
  const handleL3Circles = () => {
    synth.playRadarPing();
    setL3CirclesDrawn(true);
  };
  const handleL3Rays = () => {
    synth.playBridgeSnap();
    setL3RaysDrawn(true);
  };
  const handleL3Star = () => {
    synth.playStarConnect();
    setL3StarDrawn(true);
  };

  const handleBakeTile = () => {
    synth.playSuccess();
    setIsBaking(true);
    try {
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
    } catch (e) {}
    setTimeout(() => {
      setIsBaking(false);
      handleLevelComplete();
    }, 1200);
  };

  // --- LEVEL VALIDATION ---
  const isL1Ready = mainCircleDrawn && drawnPetals.length >= 4 && Object.keys(glazedParts).length >= 1;
  const isL2Ready = axesDrawn && diagonalsDrawn && (connectedStarNodes.length >= 6 || Object.keys(glazedParts).length >= 1);
  const isL3Ready = l3CirclesDrawn && l3RaysDrawn && l3StarDrawn && Object.keys(glazedParts).length >= 1;

  const isCurrentLevelReady = levelIdx === 0 ? isL1Ready : levelIdx === 1 ? isL2Ready : isL3Ready;

  const handleLevelComplete = () => {
    if (levelIdx < SELJUK_LEVELS.length - 1) {
      synth.playSuccess();
      setLevelIdx(prev => prev + 1);
      setGlazedParts({});
      setActiveTool('compass');
    } else {
      setIsCompleted(true);
      synth.playSuccess();
      addPoints(100);
      unlockBadge('seljuk-tile-master');

      const activeBoardStu = getStoredActiveBoardStudent();
      if (activeBoardStu) {
        awardPointsToStudent(activeBoardStu.id, 100);
        saveBoardParticipation({
          studentId: activeBoardStu.id,
          studentName: activeBoardStu.name,
          studentNumber: activeBoardStu.studentNumber,
          classSection: activeBoardStu.classSection,
          school: activeBoardStu.school,
          teacherId: currentUser?.id,
          teacherName: currentUser?.name,
          activityType: 'game',
          activityTitle: 'Selçuklu Çini Ustası Oyunu',
          outcomeCode: 'MAT.5.3.1',
          score: 100,
          maxScore: 100,
          xpEarned: 100
        });
        clearActiveBoardStudent();
      }
      try {
        confetti({ particleCount: 140, spread: 100, origin: { y: 0.5 } });
      } catch (e) {}
      if (onComplete) onComplete();
    }
  };

  const handleReset = () => {
    setLevelIdx(0);
    setMainCircleDrawn(false);
    setDrawnPetals([]);
    setAxesDrawn(false);
    setDiagonalsDrawn(false);
    setConnectedStarNodes([]);
    setLastSelectedNode(null);
    setL3CirclesDrawn(false);
    setL3RaysDrawn(false);
    setL3StarDrawn(false);
    setGlazedParts({});
    setIsCompleted(false);
  };

  return (
    <div className="bg-slate-950 border-2 border-teal-500/40 rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-600 to-amber-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-emerald-200 to-amber-300">
                Selçuklu Sarayı Çini Ustası
              </h2>
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-teal-950 border border-teal-500/50 text-teal-300">
                Geometrik Çizim & Çini Atölyesi
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pergel, gönye ve çizgeç ile tarihi sekizgen Selçuklu yıldızı ve çinileri interaktif inşa et!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-black text-amber-400 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Seviye {levelIdx + 1} / 3</span>
          </div>
          <button
            onClick={() => {
              synth.enabled = !soundEnabled;
              setSoundEnabled(!soundEnabled);
            }}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Ses Aç/Kapat"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
        </div>
      </div>

      {/* Level Info Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-950 p-4 rounded-2xl border border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm sm:text-base font-black text-teal-300 flex items-center gap-2">
            <span>🏛️</span>
            <span>{currentLevel.title}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{currentLevel.subtitle}</p>
        </div>
      </div>

      {/* Interactive Main Studio Studio (Left: Tools & Actions, Right: Real-time SVG Ceramic Canvas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Tool Selector, Interactive Tool Controls & Glazes (5 cols) */}
        <div className="lg:col-span-5 space-y-4 bg-slate-900/90 p-4 sm:p-5 rounded-3xl border border-slate-800">
          <h3 className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Mimari Çizim & Sır Araçları
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Aracı Seçin</span>
          </h3>

          {/* Tool Switching Tabs */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => {
                setActiveTool('compass');
                synth.playClick();
              }}
              className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                activeTool === 'compass'
                  ? 'bg-teal-500/25 border-teal-400 text-teal-300 shadow-md ring-2 ring-teal-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-5 h-5 text-teal-400" />
              <span className="text-[11px] font-black">Pergel</span>
            </button>

            <button
              onClick={() => {
                setActiveTool('setsquare');
                synth.playClick();
              }}
              className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                activeTool === 'setsquare'
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-md ring-2 ring-amber-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gauge className="w-5 h-5 text-amber-400" />
              <span className="text-[11px] font-black">Gönye</span>
            </button>

            <button
              onClick={() => {
                setActiveTool('ruler');
                synth.playClick();
              }}
              className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                activeTool === 'ruler'
                  ? 'bg-indigo-500/25 border-indigo-400 text-indigo-300 shadow-md ring-2 ring-indigo-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Maximize2 className="w-5 h-5 text-indigo-400" />
              <span className="text-[11px] font-black">Çizgeç</span>
            </button>

            <button
              onClick={() => {
                setActiveTool('glaze');
                synth.playClick();
              }}
              className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                activeTool === 'glaze'
                  ? 'bg-rose-500/25 border-rose-400 text-rose-300 shadow-md ring-2 ring-rose-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-5 h-5 text-rose-400" />
              <span className="text-[11px] font-black">Sırlama</span>
            </button>
          </div>

          {/* DYNAMIC INTERACTIVE TOOL CONTROLS PER LEVEL */}
          {/* LEVEL 1 TOOL CONTROLS */}
          {levelIdx === 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-teal-300">1. Aşama Görevleri:</div>
              
              {/* Step 1: Main Circle */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px]">1</span>
                    Merkez Çemberi Çiz (M, R=90)
                  </span>
                  {mainCircleDrawn ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Tamam
                    </span>
                  ) : (
                    <span className="text-amber-400 text-[11px]">Bekliyor</span>
                  )}
                </div>
                {!mainCircleDrawn && (
                  <button
                    onClick={handleDrawMainCircle}
                    disabled={isDrawingArc}
                    className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Pergeli Merkezde Döndür (360°)</span>
                  </button>
                )}
              </div>

              {/* Step 2: 4 Petal Arcs */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px]">2</span>
                    4 Yönde Eş Yayları Çiz ({drawnPetals.length}/4)
                  </span>
                  {drawnPetals.length >= 4 ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Tamam
                    </span>
                  ) : (
                    <span className="text-amber-400 text-[11px]">4 Noktayı Seç</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {L1_CENTERS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleDrawPetal(c.id)}
                      disabled={drawnPetals.includes(c.id) || !mainCircleDrawn}
                      className={`p-2 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer flex items-center justify-between ${
                        drawnPetals.includes(c.id)
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                          : mainCircleDrawn
                          ? 'bg-slate-900 border-teal-500/30 text-teal-200 hover:bg-teal-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <span>{c.label}</span>
                      {drawnPetals.includes(c.id) ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span>Çiz ✍️</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 2 TOOL CONTROLS */}
          {levelIdx === 1 && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-amber-300">2. Aşama Görevleri:</div>

              {/* Step 1: Orthogonal & Diagonal Axes */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">1</span>
                    Gönye ile Eksenleri İnşa Et
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDrawAxes}
                    disabled={axesDrawn}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      axesDrawn
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-amber-600/80 hover:bg-amber-500 text-slate-950 border-amber-400'
                    }`}
                  >
                    {axesDrawn ? '✓ 90° Dikme (d1 ⊥ d2)' : '90° Dik Eksen Çiz'}
                  </button>
                  <button
                    onClick={handleDrawDiagonals}
                    disabled={diagonalsDrawn}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      diagonalsDrawn
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-indigo-600/80 hover:bg-indigo-500 text-white border-indigo-400'
                    }`}
                  >
                    {diagonalsDrawn ? '✓ 45° Köşegenler' : '45° Çapraz Işınlar'}
                  </button>
                </div>
              </div>

              {/* Step 2: Connect 8 Star Nodes */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px]">2</span>
                    Çizgeç ile 8 Köşeyi Birleştir ({connectedStarNodes.length}/8)
                  </span>
                  {connectedStarNodes.length >= 8 ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Yıldız Hazır
                    </span>
                  ) : (
                    <span className="text-amber-400 text-[11px]">Noktaları Seç</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {STAR_NODES.map(n => (
                    <button
                      key={n.id}
                      onClick={() => handleNodeClick(n.id)}
                      className={`w-7 h-7 rounded-xl font-mono text-xs font-black border transition-all cursor-pointer ${
                        connectedStarNodes.includes(n.id)
                          ? 'bg-teal-500 border-teal-300 text-slate-950'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAutoConnectStar}
                  className="w-full py-1.5 px-3 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold cursor-pointer transition-all"
                >
                  ⚡ Tüm Yıldız Köşelerini Otomatik Birleştir
                </button>
              </div>
            </div>
          )}

          {/* LEVEL 3 TOOL CONTROLS */}
          {levelIdx === 2 && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-emerald-300">3. Aşama Saray Çinisi İnşası:</div>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={handleL3Circles}
                  disabled={l3CirclesDrawn}
                  className={`p-2 rounded-xl text-center text-xs font-extrabold border transition-all cursor-pointer ${
                    l3CirclesDrawn ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950 border-teal-500/30 text-teal-200'
                  }`}
                >
                  {l3CirclesDrawn ? '✓ Çemberler' : '1. Pergel Çemberi'}
                </button>
                <button
                  onClick={handleL3Rays}
                  disabled={l3RaysDrawn}
                  className={`p-2 rounded-xl text-center text-xs font-extrabold border transition-all cursor-pointer ${
                    l3RaysDrawn ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950 border-amber-500/30 text-amber-200'
                  }`}
                >
                  {l3RaysDrawn ? '✓ 8 Işın' : '2. 8 Işın Çek'}
                </button>
                <button
                  onClick={handleL3Star}
                  disabled={l3StarDrawn}
                  className={`p-2 rounded-xl text-center text-xs font-extrabold border transition-all cursor-pointer ${
                    l3StarDrawn ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950 border-indigo-500/30 text-indigo-200'
                  }`}
                >
                  {l3StarDrawn ? '✓ Selçuklu Yıldızı' : '3. Yıldız İnşa'}
                </button>
              </div>
            </div>
          )}

          {/* Authentic Seljuk Glaze Palette */}
          <div className="space-y-2.5 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-rose-400" />
                Geleneksel Saray Sır Paleti:
              </span>
              <button
                type="button"
                onClick={handleAutoGlazeAll}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-extrabold cursor-pointer"
              >
                ✨ Sihirli Sırla
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {GLAZE_COLORS.map(c => (
                <button
                  key={c.color}
                  onClick={() => {
                    setSelectedGlazeColor(c.color);
                    synth.playClick();
                  }}
                  className={`h-9 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center relative shadow-sm ${
                    selectedGlazeColor === c.color
                      ? 'scale-110 border-white ring-2 ring-white/50 z-10'
                      : 'border-slate-700 opacity-75 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.name}
                >
                  {selectedGlazeColor === c.color && (
                    <Check className={`w-4 h-4 ${c.color === '#f8fafc' ? 'text-slate-950' : 'text-white'} font-black`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action to advance or bake */}
          {levelIdx < 2 ? (
            <button
              onClick={handleLevelComplete}
              disabled={!isCurrentLevelReady}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                isCurrentLevelReady
                  ? 'bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 text-slate-950 shadow-teal-500/25 hover:scale-[1.02] active:scale-95 animate-pulse'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
              }`}
            >
              <span>{isCurrentLevelReady ? 'Sonraki Çini Aşamasına Geç ➔' : 'Aşama Görevlerini Tamamlayınız'}</span>
            </button>
          ) : (
            <button
              onClick={handleBakeTile}
              disabled={!isCurrentLevelReady || isBaking}
              className={`w-full py-4 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
                isCurrentLevelReady
                  ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 text-slate-950 shadow-amber-500/30 hover:scale-[1.02] active:scale-95 animate-pulse'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
              }`}
            >
              <Flame className="w-5 h-5 text-slate-950" />
              <span>{isBaking ? '🔥 1000°C Fırınlanıyor...' : '🔥 1000°C Saray Fırınında Pişir & Tamamla 🏆'}</span>
            </button>
          )}
        </div>

        {/* Right Panel: The Interactive Geometric Ceramic Tile SVG Studio (7 cols) */}
        <div className="lg:col-span-7 relative bg-slate-950 border-2 border-slate-800 rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[440px] shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

          {/* Glowing Seljuk Ceramic Canvas */}
          <svg className="w-full max-w-[440px] aspect-square drop-shadow-2xl select-none" viewBox="0 0 400 400">
            <defs>
              <linearGradient id="tileBorderGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
              <radialGradient id="glazeShine" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Seljuk Ceramic Outer Frame */}
            <rect
              x="16"
              y="16"
              width="368"
              height="368"
              rx="24"
              fill="#060911"
              stroke="url(#tileBorderGold)"
              strokeWidth="5"
            />
            {/* Inner Border Inlay */}
            <rect
              x="28"
              y="28"
              width="344"
              height="344"
              rx="18"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* Corner Seljuk Ornaments */}
            <polygon points="28,28 50,28 28,50" fill="#eab308" fillOpacity="0.4" />
            <polygon points="372,28 350,28 372,50" fill="#eab308" fillOpacity="0.4" />
            <polygon points="28,372 50,372 28,350" fill="#eab308" fillOpacity="0.4" />
            <polygon points="372,372 350,372 372,350" fill="#eab308" fillOpacity="0.4" />

            {/* ==================================================== */}
            {/* LEVEL 1: 4-PETAL COMPASS ROSETTE (Gülbezek) */}
            {/* ==================================================== */}
            {levelIdx === 0 && (
              <g>
                {/* Main Guide Circle */}
                {mainCircleDrawn && (
                  <circle
                    cx="200"
                    cy="200"
                    r="90"
                    fill={glazedParts['center-rosette'] || 'none'}
                    fillOpacity={glazedParts['center-rosette'] ? '0.35' : '0'}
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    className="transition-all cursor-pointer hover:opacity-80"
                    onClick={() => handleGlazePart('center-rosette')}
                  />
                )}

                {/* 4 Petal Circles */}
                {L1_CENTERS.map(c => {
                  const isDrawn = drawnPetals.includes(c.id);
                  const petalColor = glazedParts[`petal-${c.id}`];

                  return (
                    <g key={c.id}>
                      {isDrawn && (
                        <circle
                          cx={c.cx}
                          cy={c.cy}
                          r="90"
                          fill={petalColor || 'none'}
                          fillOpacity={petalColor ? '0.35' : '0'}
                          stroke={petalColor || '#06b6d4'}
                          strokeWidth="2.5"
                          className="transition-all cursor-pointer hover:opacity-80"
                          onClick={() => handleGlazePart(`petal-${c.id}`)}
                        />
                      )}
                      {/* Center Point Dots */}
                      <circle
                        cx={c.cx}
                        cy={c.cy}
                        r="5"
                        fill={isDrawn ? '#10b981' : '#f59e0b'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer"
                        onClick={() => handleDrawPetal(c.id)}
                      />
                      <text x={c.cx} y={c.cy > 200 ? c.cy + 18 : c.cy - 12} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="900">
                        {c.label.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}

                {/* Center M Point */}
                <circle cx="200" cy="200" r="6" fill="#f8fafc" stroke="#38bdf8" strokeWidth="2" />
                <text x="200" y="190" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="900">
                  M (Merkez)
                </text>

                {/* Live Compass Drawing Arm Animation */}
                {isDrawingArc && (
                  <g transform={`translate(200, 200) rotate(${compassAngle})`}>
                    <line x1="0" y1="0" x2="90" y2="0" stroke="#fef08a" strokeWidth="3" />
                    <circle cx="90" cy="0" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" className="drop-shadow-[0_0_8px_#f59e0b]" />
                  </g>
                )}
              </g>
            )}

            {/* ==================================================== */}
            {/* LEVEL 2: 8-POINT SELJUK STAR (Kare Döndürme & Dik Eksenler) */}
            {/* ==================================================== */}
            {levelIdx === 1 && (
              <g>
                {/* 90° Orthogonal Axes (d1 ⊥ d2) */}
                {axesDrawn && (
                  <g className="animate-in fade-in duration-300">
                    <line x1="40" y1="200" x2="360" y2="200" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="200" y1="40" x2="200" y2="360" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                    {/* 90° Marker at Center */}
                    <rect x="200" y="186" width="14" height="14" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                    <circle cx="207" cy="193" r="1.5" fill="#f59e0b" />
                    <text x="220" y="180" fill="#f59e0b" fontSize="10" fontWeight="900">d1 ⊥ d2 (90°)</text>
                  </g>
                )}

                {/* 45° Diagonal Rays */}
                {diagonalsDrawn && (
                  <g className="animate-in fade-in duration-300">
                    <line x1="85" y1="85" x2="315" y2="315" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="85" y1="315" x2="315" y2="85" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 3" />
                  </g>
                )}

                {/* Star Square 1 (0°) */}
                {axesDrawn && (
                  <rect
                    x="105"
                    y="105"
                    width="190"
                    height="190"
                    fill={glazedParts['star-center'] || 'none'}
                    fillOpacity={glazedParts['star-center'] ? '0.35' : '0'}
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    className="cursor-pointer"
                    onClick={() => handleGlazePart('star-center')}
                  />
                )}

                {/* Star Square 2 (45°) */}
                {diagonalsDrawn && (
                  <rect
                    x="105"
                    y="105"
                    width="190"
                    height="190"
                    transform="rotate(45 200 200)"
                    fill={glazedParts['star-center'] || 'none'}
                    fillOpacity={glazedParts['star-center'] ? '0.35' : '0'}
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    className="cursor-pointer"
                    onClick={() => handleGlazePart('star-center')}
                  />
                )}

                {/* 8 Star Vertices Nodes */}
                {STAR_NODES.map(n => {
                  const isConnected = connectedStarNodes.includes(n.id);
                  return (
                    <g key={n.id} onClick={() => handleNodeClick(n.id)} className="cursor-pointer group">
                      {/* Transparent wide click area to prevent accidental missed clicks */}
                      <circle cx={n.x} cy={n.y} r="20" fill="transparent" />
                      {/* Subtle hover ring */}
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r="12"
                        fill="none"
                        stroke={isConnected ? '#10b981' : '#38bdf8'}
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        className="opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-sm"
                      />
                      {/* Stable Node Core */}
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={isConnected ? 8 : 7}
                        fill={isConnected ? '#10b981' : '#f8fafc'}
                        stroke={isConnected ? '#ffffff' : '#0f172a'}
                        strokeWidth="2"
                        className="group-hover:stroke-teal-400 group-hover:stroke-[3px] transition-all drop-shadow-sm"
                      />
                      <text x={n.x} y={n.y > 200 ? n.y + 18 : n.y - 10} textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="900" className="pointer-events-none select-none">
                        {n.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* ==================================================== */}
            {/* LEVEL 3: GRAND MOSAIC MASTERPIECE */}
            {/* ==================================================== */}
            {levelIdx === 2 && (
              <g>
                {/* Concentric Circles */}
                {l3CirclesDrawn && (
                  <g className="animate-in fade-in duration-300">
                    <circle cx="200" cy="200" r="140" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                    <circle
                      cx="200"
                      cy="200"
                      r="90"
                      fill={glazedParts['l3-ring'] || 'none'}
                      fillOpacity={glazedParts['l3-ring'] ? '0.35' : '0'}
                      stroke="#f59e0b"
                      strokeWidth="2"
                      className="cursor-pointer"
                      onClick={() => handleGlazePart('l3-ring')}
                    />
                    <circle
                      cx="200"
                      cy="200"
                      r="40"
                      fill={glazedParts['l3-core'] || '#eab308'}
                      stroke="#fef08a"
                      strokeWidth="2"
                      className="cursor-pointer"
                      onClick={() => handleGlazePart('l3-core')}
                    />
                  </g>
                )}

                {/* 8 Rays */}
                {l3RaysDrawn && (
                  <g className="animate-in fade-in duration-300">
                    {Array.from({ length: 8 }).map((_, idx) => {
                      const rad = (idx * 45 * Math.PI) / 180;
                      const x2 = 200 + 140 * Math.cos(rad);
                      const y2 = 200 + 140 * Math.sin(rad);
                      return (
                        <line
                          key={idx}
                          x1="200"
                          y1="200"
                          x2={x2}
                          y2={y2}
                          stroke="#10b981"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </g>
                )}

                {/* 8 Star Petals on Perimeter */}
                {l3StarDrawn && (
                  <g className="animate-in fade-in duration-300">
                    <rect
                      x="115"
                      y="115"
                      width="170"
                      height="170"
                      fill="none"
                      stroke="#fef08a"
                      strokeWidth="2.5"
                    />
                    <rect
                      x="115"
                      y="115"
                      width="170"
                      height="170"
                      transform="rotate(45 200 200)"
                      fill="none"
                      stroke="#fef08a"
                      strokeWidth="2.5"
                    />
                    {Array.from({ length: 8 }).map((_, i) => {
                      const ang = (i * 45 - 90) * (Math.PI / 180);
                      const px = 200 + 115 * Math.cos(ang);
                      const py = 200 + 115 * Math.sin(ang);
                      const col = glazedParts[`l3-petal-${i}`];

                      return (
                        <circle
                          key={i}
                          cx={px}
                          cy={py}
                          r="18"
                          fill={col || selectedGlazeColor}
                          fillOpacity={col ? '0.6' : '0.35'}
                          stroke={col ? '#ffffff' : '#fef08a'}
                          strokeWidth={col ? '2.5' : '1.5'}
                          className="cursor-pointer hover:fill-opacity-80 hover:stroke-amber-300 hover:stroke-[2.5px] transition-all"
                          onClick={() => handleGlazePart(`l3-petal-${i}`)}
                        />
                      );
                    })}
                  </g>
                )}
              </g>
            )}

            {/* Gloss Surface Reflection */}
            <rect
              x="20"
              y="20"
              width="360"
              height="360"
              rx="20"
              fill="url(#glazeShine)"
              pointerEvents="none"
            />
          </svg>

          {/* Mathematical Tooltip Legend */}
          <div className="mt-4 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-2xl text-xs font-mono text-teal-300 flex items-center justify-between gap-3 w-full max-w-md">
            <span className="font-bold flex items-center gap-1.5">
              <span>📐</span> Maarif Geometri Kuralı:
            </span>
            <span className="text-slate-200 font-extrabold text-right">
              {levelIdx === 0 && 'Eş Çemberler: r1 = r2 (Rozet Simetrisi)'}
              {levelIdx === 1 && 'Kesişen Doğrular: d1 ⊥ d2 (90° Dikme)'}
              {levelIdx === 2 && 'Sekizgen Yıldız & Işın Açıları (45°)'}
            </span>
          </div>
        </div>

      </div>

      {/* Completion Modal */}
      {isCompleted && (
        <div className="bg-gradient-to-b from-teal-950/95 to-slate-950 border-2 border-teal-500 p-7 rounded-3xl text-center space-y-4 animate-in zoom-in duration-300 shadow-2xl">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce drop-shadow-lg" />
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Saray Baş Çini Mimarı Beratını Kazandınız! 🏆
          </h3>
          <p className="text-sm text-teal-200 max-w-xl mx-auto leading-relaxed">
            Tebrikler! Pergel ile eş çember yayları, gönye ile 90° dik eksenler ve çizgeç ile 8 köşeli Selçuklu yıldızı inşasını ustalıkla tamamlayıp saray çinisini fırınladınız (+100 XP).
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs transition-all cursor-pointer shadow-lg active:scale-95"
            >
              Atölyede Yeniden Çini Tasarla 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =================================================================
// 2. OYUN: KUTUP YILDIZI SEYRÜSEFERİ (Büyük Ayı, Küçük Ayı, Işın, Doğru ve Doğru Parçası)
// =================================================================
interface SkyLevel {
  id: number;
  title: string;
  constellationName: string;
  sub: string;
  conceptType: 'ray' | 'segment' | 'line';
  symbolGoal: string;
  lore: string;
  stars: { id: string; name: string; x: number; y: number; color?: string; isPolaris?: boolean; greekLetter?: string }[];
  requiredConnections: [string, string][];
  guideLines: [string, string][];
}

const SKY_LEVELS: SkyLevel[] = [
  {
    id: 1,
    title: '1. Seviye: Büyük Ayı (Ursa Major) Takımyıldızı',
    constellationName: 'Büyük Ayı (Büyük Cezve)',
    sub: 'Okyanusta pusulası bozulan kaşif gemisi yönünü bulmak için kuzey göğünün en belirgin takımyıldızı Büyük Ayı\'nın 7 yıldızını doğru parçalarıyla birleştiriyor.',
    conceptType: 'segment',
    symbolGoal: '[AB], [BC], [CD], [DA], [DE], [EF], [FG] (Doğru Parçaları)',
    lore: '💡 Astronomi Bilgisi: Büyük Ayı, gökyüzünde 7 parlak yıldızdan oluşan bir cezveye benzer. 4 yıldız cezvenin gövdesini ([AB], [BC], [CD], [DA]), 3 yıldız ise eğri sapını ([DE], [EF], [FG]) oluşturur.',
    stars: [
      { id: 'A', name: 'Dubhe (A)', greekLetter: 'α', x: 420, y: 110, color: '#38bdf8' },
      { id: 'B', name: 'Merak (B)', greekLetter: 'β', x: 440, y: 220, color: '#38bdf8' },
      { id: 'C', name: 'Phecda (C)', greekLetter: 'γ', x: 320, y: 240, color: '#818cf8' },
      { id: 'D', name: 'Megrez (D)', greekLetter: 'δ', x: 300, y: 140, color: '#818cf8' },
      { id: 'E', name: 'Alioth (E)', greekLetter: 'ε', x: 210, y: 170, color: '#a78bfa' },
      { id: 'F', name: 'Mizar (F)', greekLetter: 'ζ', x: 130, y: 200, color: '#a78bfa' },
      { id: 'G', name: 'Alkaid (G)', greekLetter: 'η', x: 50, y: 250, color: '#c084fc' }
    ],
    requiredConnections: [
      ['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'],
      ['D', 'E'], ['E', 'F'], ['F', 'G']
    ],
    guideLines: [
      ['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'],
      ['D', 'E'], ['E', 'F'], ['F', 'G']
    ]
  },
  {
    id: 2,
    title: '2. Seviye: İşaretçi Yıldızlar & Kutup Yıldızı Işını',
    constellationName: 'İşaretçi Işını (5x Kuralı)',
    sub: 'Büyük Ayı\'nın "İşaretçi Yıldızları" Merak (B) ve Dubhe (A) doğrultusunda 5 kat mesafeye uzanan IŞIN [BA fırlatarak Kutup Yıldızı\'nı (Polaris / P) keşfet!',
    conceptType: 'ray',
    symbolGoal: '[BA, [AP ve [PG Işınları (Başlangıç noktası sabit, tek yönde sonsuz)',
    lore: '⚓ Denizcilik Kuralı: Merak (B)\'tan Dubhe (A)\'ye çekilen çizgi 5 kat uzatıldığında tam olarak kuzey kutup noktasını gösteren Kutup Yıldızı\'na (Polaris / Demirkazık) ulaşır.',
    stars: [
      { id: 'B', name: 'Merak (B) [İşaretçi 1]', greekLetter: 'β', x: 480, y: 310, color: '#38bdf8' },
      { id: 'A', name: 'Dubhe (A) [İşaretçi 2]', greekLetter: 'α', x: 440, y: 220, color: '#38bdf8' },
      { id: 'P', name: 'Polaris / Kutup Yıldızı (P)', greekLetter: '★', x: 320, y: 50, color: '#facc15', isPolaris: true },
      { id: 'G', name: 'Kaşif Gemisi (G)', greekLetter: '⛵', x: 120, y: 320, color: '#34d399' }
    ],
    requiredConnections: [
      ['B', 'A'], ['A', 'P'], ['P', 'G']
    ],
    guideLines: [
      ['B', 'A'], ['A', 'P'], ['P', 'G']
    ]
  },
  {
    id: 3,
    title: '3. Seviye: Küçük Ayı (Ursa Minor) Takımyıldızı',
    constellationName: 'Küçük Ayı (Küçük Cezve & Demirkazık)',
    sub: 'Kutup Yıldızı (Polaris / P), Küçük Ayı takımyıldızının kuyruk ucudur! Yıldızları doğru parçalarıyla bağlayarak Küçük Ayı\'yı tamamla ve gökyüzü pusulanı kur.',
    conceptType: 'segment',
    symbolGoal: '[PY], [YU], [UA], [AK], [KH], [HW], [WA] (Doğru Parçaları)',
    lore: '🌌 Türk Mitolojisi & Astronomi: Küçük Ayı takımyıldızının en parlak yıldızı Kutup Yıldızı\'dır (Demirkazık). Gökyüzündeki tüm diğer takımyıldızlar Kutup Yıldızı etrafında döner.',
    stars: [
      { id: 'P', name: 'Polaris (P) [Kutup]', greekLetter: 'α', x: 160, y: 50, color: '#facc15', isPolaris: true },
      { id: 'Y', name: 'Yildun (Y)', greekLetter: 'δ', x: 230, y: 90, color: '#67e8f9' },
      { id: 'U', name: 'Urodelus (U)', greekLetter: 'ε', x: 300, y: 130, color: '#67e8f9' },
      { id: 'A', name: 'Ahfa (A)', greekLetter: 'ζ', x: 370, y: 170, color: '#818cf8' },
      { id: 'K', name: 'Pherkad (K) [Bekçi 1]', greekLetter: 'γ', x: 340, y: 260, color: '#a78bfa' },
      { id: 'H', name: 'Kochab (H) [Kuzey Yıldızı 2]', greekLetter: 'β', x: 460, y: 250, color: '#f59e0b' },
      { id: 'W', name: 'Anwar (W)', greekLetter: 'η', x: 480, y: 170, color: '#818cf8' }
    ],
    requiredConnections: [
      ['P', 'Y'], ['Y', 'U'], ['U', 'A'],
      ['A', 'K'], ['K', 'H'], ['H', 'W'], ['W', 'A']
    ],
    guideLines: [
      ['P', 'Y'], ['Y', 'U'], ['U', 'A'],
      ['A', 'K'], ['K', 'H'], ['H', 'W'], ['W', 'A']
    ]
  },
  {
    id: 4,
    title: '4. Seviye: Kuzey Meridyeni ve Ufuk Seyir Doğruları',
    constellationName: 'Meridyen ve Ufuk Doğruları (d1, d2)',
    sub: 'Kutup Yıldızı\'ndan denize inen Kuzey-Güney Meridyen Doğrusu (d1) ve güvenli liman boğazını belirleyen Ufuk Doğrusu (d2) ile gemiyi limana yanaştır!',
    conceptType: 'line',
    symbolGoal: 'd1 (Meridyen) ve d2 (Ufuk) Doğruları (İki yönde sonsuz)',
    lore: '🧭 Seyrüsefer Kuralı: İki sonsuz doğrunun kesiştiği güvenli kanal noktası, fırtınalı gecelerde gemilerin liman ağzını hatasız bulmasını sağlar.',
    stars: [
      { id: 'P', name: 'Polaris (P) [Kutup Yıldızı]', greekLetter: '★', x: 320, y: 50, color: '#facc15', isPolaris: true },
      { id: 'M', name: 'Kuzey Meridyeni (M)', greekLetter: 'N', x: 320, y: 300, color: '#38bdf8' },
      { id: 'L1', name: 'Batı Feneri (L1)', greekLetter: 'W', x: 80, y: 180, color: '#ec4899' },
      { id: 'L2', name: 'Liman Girişi (L2)', greekLetter: 'E', x: 560, y: 180, color: '#10b981' }
    ],
    requiredConnections: [
      ['P', 'M'], ['L1', 'L2']
    ],
    guideLines: [
      ['P', 'M'], ['L1', 'L2']
    ]
  }
];

export function PolarisNavigatorGame({ onComplete }: { onComplete?: () => void }) {
  const { addPoints, unlockBadge } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [levelIdx, setLevelIdx] = useState(0);
  const [selectedStartStar, setSelectedStartStar] = useState<string | null>(null);
  const [dragStartStar, setDragStartStar] = useState<string | null>(null);
  const [dragCurrentPos, setDragCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredTargetStar, setHoveredTargetStar] = useState<string | null>(null);
  const [drawnConnections, setDrawnConnections] = useState<[string, string][]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragStartCoordsRef = useRef<{ x: number; y: number } | null>(null);

  const currentLevel = SKY_LEVELS[levelIdx];

  const getSvgCoordinates = (clientX: number, clientY: number) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 640 / rect.width;
    const scaleY = 360 / rect.height;
    return {
      x: Math.max(0, Math.min(640, (clientX - rect.left) * scaleX)),
      y: Math.max(0, Math.min(360, (clientY - rect.top) * scaleY))
    };
  };

  const findStarNear = (x: number, y: number, radius = 38, excludeStarId?: string | null) => {
    return currentLevel.stars.find(s => {
      if (excludeStarId && s.id === excludeStarId) return false;
      const dx = s.x - x;
      const dy = s.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= radius;
    });
  };

  const createConnection = (star1Id: string, star2Id: string) => {
    if (star1Id === star2Id) return;
    const newConn: [string, string] = [star1Id, star2Id];
    const reverseConn: [string, string] = [star2Id, star1Id];

    const alreadyExists = drawnConnections.some(
      c => (c[0] === newConn[0] && c[1] === newConn[1]) || (c[0] === reverseConn[0] && c[1] === reverseConn[1])
    );

    if (!alreadyExists) {
      setDrawnConnections(prev => [...prev, newConn]);
      synth.playStarConnect();
    }
    setSelectedStartStar(null);
  };

  // Pointer / Touch Handlers for Drag-to-Draw
  const handleStarPointerDown = (starId: string, e: React.PointerEvent) => {
    e.preventDefault();
    synth.playClick();

    const starObj = currentLevel.stars.find(s => s.id === starId);
    if (!starObj) return;

    setDragStartStar(starId);
    dragStartCoordsRef.current = { x: starObj.x, y: starObj.y };
    setDragCurrentPos({ x: starObj.x, y: starObj.y });
    setHoveredTargetStar(null);

    // If there is already a clicked star, connecting right away is also supported
    if (selectedStartStar && selectedStartStar !== starId) {
      createConnection(selectedStartStar, starId);
      setDragStartStar(null);
      setDragCurrentPos(null);
    }
  };

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragStartStar) return;
    const coords = getSvgCoordinates(e.clientX, e.clientY);
    if (!coords) return;

    setDragCurrentPos(coords);

    const target = findStarNear(coords.x, coords.y, 42, dragStartStar);
    if (target) {
      setHoveredTargetStar(target.id);
    } else {
      setHoveredTargetStar(null);
    }
  };

  const handleSvgPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragStartStar) {
      const coords = getSvgCoordinates(e.clientX, e.clientY);
      const startPos = dragStartCoordsRef.current;
      const movedDistance = coords && startPos
        ? Math.hypot(coords.x - startPos.x, coords.y - startPos.y)
        : 0;

      const target = coords ? findStarNear(coords.x, coords.y, 44, dragStartStar) : null;

      if (target && target.id !== dragStartStar && movedDistance > 15) {
        // Successful drag & drop connection
        createConnection(dragStartStar, target.id);
      } else if (movedDistance <= 15) {
        // Tapped in place (Click mode)
        if (!selectedStartStar) {
          setSelectedStartStar(dragStartStar);
        } else if (selectedStartStar === dragStartStar) {
          setSelectedStartStar(null);
        } else {
          createConnection(selectedStartStar, dragStartStar);
        }
      }
    }

    setDragStartStar(null);
    setDragCurrentPos(null);
    setHoveredTargetStar(null);
    dragStartCoordsRef.current = null;
  };

  const handleSvgPointerCancel = () => {
    setDragStartStar(null);
    setDragCurrentPos(null);
    setHoveredTargetStar(null);
    dragStartCoordsRef.current = null;
  };

  const isLevelSuccess = currentLevel.requiredConnections.every(req =>
    drawnConnections.some(
      d => (d[0] === req[0] && d[1] === req[1]) || (d[0] === req[1] && d[1] === req[0])
    )
  );

  const completedConnectionsCount = currentLevel.requiredConnections.filter(req =>
    drawnConnections.some(
      d => (d[0] === req[0] && d[1] === req[1]) || (d[0] === req[1] && d[1] === req[0])
    )
  ).length;

  const handleNextLevel = () => {
    if (levelIdx < SKY_LEVELS.length - 1) {
      synth.playSuccess();
      setLevelIdx(prev => prev + 1);
      setSelectedStartStar(null);
      setDragStartStar(null);
      setDragCurrentPos(null);
      setHoveredTargetStar(null);
      setDrawnConnections([]);
    } else {
      setIsCompleted(true);
      synth.playSuccess();
      addPoints(100);
      unlockBadge('polaris-navigator');

      const activeBoardStu = getStoredActiveBoardStudent();
      if (activeBoardStu) {
        awardPointsToStudent(activeBoardStu.id, 100);
        saveBoardParticipation({
          studentId: activeBoardStu.id,
          studentName: activeBoardStu.name,
          studentNumber: activeBoardStu.studentNumber,
          classSection: activeBoardStu.classSection,
          school: activeBoardStu.school,
          teacherId: currentUser?.id,
          teacherName: currentUser?.name,
          activityType: 'game',
          activityTitle: 'Kutup Yıldızı Seyrüsefer Oyunu',
          outcomeCode: 'MAT.5.3.1',
          score: 100,
          maxScore: 100,
          xpEarned: 100
        });
        clearActiveBoardStudent();
      }
      try {
        confetti({ particleCount: 120, spread: 85, origin: { y: 0.5 } });
      } catch (e) {}
      if (onComplete) onComplete();
    }
  };

  const handleResetLevel = () => {
    setDrawnConnections([]);
    setSelectedStartStar(null);
    setDragStartStar(null);
    setDragCurrentPos(null);
    setHoveredTargetStar(null);
  };

  const dragStarObj = dragStartStar ? currentLevel.stars.find(s => s.id === dragStartStar) : null;
  const hoveredStarObj = hoveredTargetStar ? currentLevel.stars.find(s => s.id === hoveredTargetStar) : null;

  return (
    <div className="bg-slate-950 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-5 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Navigation className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-sky-200 to-amber-300">
                Kutup Yıldızı Seyrüseferi
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/50 text-indigo-300">
                Büyük Ayı • Küçük Ayı • Doğru &amp; Işın
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Yıldızları parmağınızla/farenizle basılı tutup birbirine çizerek gece okyanusunda rotanı kur!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Seviye {levelIdx + 1} / {SKY_LEVELS.length}</span>
          </div>
          <button
            onClick={() => {
              synth.enabled = !soundEnabled;
              setSoundEnabled(!soundEnabled);
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Info & Goals Bar */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 p-4 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
        <div className="space-y-1">
          <div className="text-sm font-black text-indigo-300 flex items-center gap-2">
            <span>{currentLevel.title}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold">
              {currentLevel.constellationName}
            </span>
          </div>
          <p className="text-xs text-slate-300">{currentLevel.sub}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-xs text-amber-300 font-mono bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-500/30 font-bold">
            Hedef: {currentLevel.symbolGoal}
          </div>
          <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300">
            {completedConnectionsCount} / {currentLevel.requiredConnections.length} Bağlantı
          </div>
        </div>
      </div>

      {/* Historical Lore / Astronomical Story Banner */}
      <div className="px-4 py-2 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-[11.5px] text-indigo-200/90 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{currentLevel.lore}</span>
      </div>

      {/* Star Chart Planetarium Canvas */}
      <div className="relative bg-slate-950 border-2 border-indigo-900/60 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[380px] shadow-2xl overflow-hidden touch-none">
        {/* Background Twinkling Night Sky */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-slate-950/90 pointer-events-none" />

        <svg
          ref={svgRef}
          className="w-full max-w-[640px] h-[360px] drop-shadow-2xl cursor-crosshair touch-none select-none"
          viewBox="0 0 640 360"
          onPointerMove={handleSvgPointerMove}
          onPointerUp={handleSvgPointerUp}
          onPointerLeave={handleSvgPointerCancel}
          onPointerCancel={handleSvgPointerCancel}
        >
          {/* Celestial Grid Circles */}
          <circle cx="320" cy="180" r="170" fill="none" stroke="#1e1b4b" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
          <circle cx="320" cy="180" r="110" fill="none" stroke="#1e1b4b" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
          <line x1="320" y1="10" x2="320" y2="350" stroke="#1e1b4b" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
          <line x1="10" y1="180" x2="630" y2="180" stroke="#1e1b4b" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

          {/* Faint Constellation Guide Lines (Kesik Rehber Çizgileri) */}
          {currentLevel.guideLines.map((guide, gIdx) => {
            const s1 = currentLevel.stars.find(s => s.id === guide[0]);
            const s2 = currentLevel.stars.find(s => s.id === guide[1]);
            if (!s1 || !s2) return null;

            const isDone = drawnConnections.some(
              d => (d[0] === guide[0] && d[1] === guide[1]) || (d[0] === guide[1] && d[1] === guide[0])
            );

            if (isDone) return null; // Drawn connection will be rendered on top

            return (
              <line
                key={`guide-${gIdx}`}
                x1={s1.x}
                y1={s1.y}
                x2={s2.x}
                y2={s2.y}
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="5 5"
                strokeOpacity="0.6"
                className="pointer-events-none"
              />
            );
          })}

          {/* Active / Drawn Connections */}
          {drawnConnections.map((conn, idx) => {
            const s1 = currentLevel.stars.find(s => s.id === conn[0]);
            const s2 = currentLevel.stars.find(s => s.id === conn[1]);
            if (!s1 || !s2) return null;

            if (currentLevel.conceptType === 'ray') {
              const dx = s2.x - s1.x;
              const dy = s2.y - s1.y;
              const len = Math.sqrt(dx * dx + dy * dy) || 1;
              const extendedX = s1.x + (dx / len) * 520;
              const extendedY = s1.y + (dy / len) * 520;

              return (
                <g key={idx}>
                  <line
                    x1={s1.x}
                    y1={s1.y}
                    x2={extendedX}
                    y2={extendedY}
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    strokeDasharray="none"
                    className="drop-shadow-[0_0_10px_#38bdf8]"
                  />
                  <circle cx={s1.x} cy={s1.y} r="5" fill="#38bdf8" />
                  <polygon
                    points={`${extendedX},${extendedY} ${extendedX - 14},${extendedY - 7} ${extendedX - 14},${extendedY + 7}`}
                    fill="#38bdf8"
                  />
                  <text
                    x={(s1.x + s2.x) / 2}
                    y={(s1.y + s2.y) / 2 - 10}
                    fill="#7dd3fc"
                    fontSize="11"
                    fontWeight="900"
                    textAnchor="middle"
                    className="drop-shadow-md pointer-events-none"
                  >
                    [{s1.id}{s2.id}&gt; Işını
                  </text>
                </g>
              );
            } else if (currentLevel.conceptType === 'line') {
              const dx = s2.x - s1.x;
              const dy = s2.y - s1.y;
              const len = Math.sqrt(dx * dx + dy * dy) || 1;
              const ext1X = s1.x - (dx / len) * 220;
              const ext1Y = s1.y - (dy / len) * 220;
              const ext2X = s2.x + (dx / len) * 220;
              const ext2Y = s2.y + (dy / len) * 220;

              return (
                <g key={idx}>
                  <line
                    x1={ext1X}
                    y1={ext1Y}
                    x2={ext2X}
                    y2={ext2Y}
                    stroke="#a855f7"
                    strokeWidth="3.5"
                    className="drop-shadow-[0_0_10px_#a855f7]"
                  />
                  <polygon
                    points={`${ext1X},${ext1Y} ${ext1X + 12},${ext1Y - 6} ${ext1X + 12},${ext1Y + 6}`}
                    fill="#a855f7"
                  />
                  <polygon
                    points={`${ext2X},${ext2Y} ${ext2X - 12},${ext2Y - 6} ${ext2X - 12},${ext2Y + 6}`}
                    fill="#a855f7"
                  />
                  <text
                    x={(s1.x + s2.x) / 2 + 10}
                    y={(s1.y + s2.y) / 2 - 12}
                    fill="#e9d5ff"
                    fontSize="11"
                    fontWeight="900"
                    className="drop-shadow-md pointer-events-none"
                  >
                    {s1.id === 'P' || s2.id === 'P' ? 'd1 Meridyen Doğrusu (↔)' : 'd2 Ufuk Doğrusu (↔)'}
                  </text>
                </g>
              );
            } else {
              return (
                <g key={idx}>
                  <line
                    x1={s1.x}
                    y1={s1.y}
                    x2={s2.x}
                    y2={s2.y}
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_#f59e0b]"
                  />
                  <text
                    x={(s1.x + s2.x) / 2}
                    y={(s1.y + s2.y) / 2 - 8}
                    fill="#fef08a"
                    fontSize="10.5"
                    fontWeight="900"
                    textAnchor="middle"
                    className="drop-shadow-md pointer-events-none"
                  >
                    [{s1.id}{s2.id}]
                  </text>
                </g>
              );
            }
          })}

          {/* Real-time Dynamic Dragging / Drawing Line Preview */}
          {dragStarObj && dragCurrentPos && (
            <g className="pointer-events-none">
              {(() => {
                const targetX = hoveredStarObj ? hoveredStarObj.x : dragCurrentPos.x;
                const targetY = hoveredStarObj ? hoveredStarObj.y : dragCurrentPos.y;

                if (currentLevel.conceptType === 'ray') {
                  const dx = targetX - dragStarObj.x;
                  const dy = targetY - dragStarObj.y;
                  const dist = Math.hypot(dx, dy) || 1;
                  const extX = dragStarObj.x + (dx / dist) * Math.max(dist, 180);
                  const extY = dragStarObj.y + (dy / dist) * Math.max(dist, 180);

                  return (
                    <>
                      <line
                        x1={dragStarObj.x}
                        y1={dragStarObj.y}
                        x2={extX}
                        y2={extY}
                        stroke="#38bdf8"
                        strokeWidth="3"
                        strokeDasharray="6 4"
                        className="animate-pulse drop-shadow-[0_0_12px_#38bdf8]"
                      />
                      <circle cx={dragStarObj.x} cy={dragStarObj.y} r="6" fill="#38bdf8" />
                      <circle cx={targetX} cy={targetY} r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="drop-shadow-[0_0_10px_#38bdf8]" />
                    </>
                  );
                } else if (currentLevel.conceptType === 'line') {
                  return (
                    <>
                      <line
                        x1={dragStarObj.x}
                        y1={dragStarObj.y}
                        x2={targetX}
                        y2={targetY}
                        stroke="#c084fc"
                        strokeWidth="3"
                        strokeDasharray="6 4"
                        className="animate-pulse drop-shadow-[0_0_12px_#a855f7]"
                      />
                      <circle cx={targetX} cy={targetY} r="7" fill="#c084fc" stroke="#ffffff" strokeWidth="2" className="drop-shadow-[0_0_10px_#a855f7]" />
                    </>
                  );
                } else {
                  return (
                    <>
                      <line
                        x1={dragStarObj.x}
                        y1={dragStarObj.y}
                        x2={targetX}
                        y2={targetY}
                        stroke="#fbbf24"
                        strokeWidth="3.5"
                        strokeDasharray="6 3"
                        strokeLinecap="round"
                        className="animate-pulse drop-shadow-[0_0_14px_#f59e0b]"
                      />
                      <circle cx={targetX} cy={targetY} r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" className="drop-shadow-[0_0_10px_#f59e0b]" />
                    </>
                  );
                }
              })()}
            </g>
          )}

          {/* Stars / Points */}
          {currentLevel.stars.map(star => {
            const isSelected = selectedStartStar === star.id || dragStartStar === star.id;
            const isHoveredTarget = hoveredTargetStar === star.id;

            return (
              <g
                key={star.id}
                onPointerDown={(e) => handleStarPointerDown(star.id, e)}
                className="cursor-pointer group touch-none"
                transform={`translate(${star.x}, ${star.y})`}
              >
                {/* Hit target expander circle for easier touch interaction */}
                <circle
                  cx="0"
                  cy="0"
                  r="30"
                  fill="transparent"
                  className="cursor-pointer"
                />

                {/* Target Snap Ring when hovering/dragging near this star */}
                {isHoveredTarget && (
                  <circle
                    cx="0"
                    cy="0"
                    r="24"
                    fill="rgba(56, 189, 248, 0.25)"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    className="drop-shadow-[0_0_12px_#38bdf8]"
                  />
                )}

                {/* Glow & Selection Ring */}
                <circle
                  cx="0"
                  cy="0"
                  r={star.isPolaris ? (isSelected ? 22 : 18) : (isSelected ? 18 : 14)}
                  fill={star.isPolaris ? 'rgba(250, 204, 21, 0.35)' : isSelected ? 'rgba(56, 189, 248, 0.45)' : 'rgba(255, 255, 255, 0.12)'}
                  stroke={isSelected ? '#38bdf8' : 'none'}
                  strokeWidth={isSelected ? '1.5' : '0'}
                  className={isSelected ? 'animate-pulse' : star.isPolaris ? 'animate-pulse' : 'group-hover:opacity-100 transition-opacity'}
                />

                {/* Star Point Core */}
                <circle
                  cx="0"
                  cy="0"
                  r={star.isPolaris ? (isHoveredTarget ? 10 : 9) : (isSelected || isHoveredTarget ? 8.5 : 7)}
                  fill={star.isPolaris ? '#facc15' : isHoveredTarget ? '#38bdf8' : (star.color || '#ffffff')}
                  stroke={isSelected || isHoveredTarget ? '#ffffff' : star.isPolaris ? '#ffffff' : '#6366f1'}
                  strokeWidth={star.isPolaris ? '2.5' : '2'}
                  className={star.isPolaris ? 'drop-shadow-[0_0_12px_#facc15]' : isHoveredTarget ? 'drop-shadow-[0_0_12px_#38bdf8]' : 'drop-shadow-sm'}
                />

                {/* Polaris Star Rays */}
                {star.isPolaris && (
                  <g className="animate-spin-slow pointer-events-none opacity-80">
                    <line x1="-14" y1="0" x2="14" y2="0" stroke="#fde047" strokeWidth="1.5" />
                    <line x1="0" y1="-14" x2="0" y2="14" stroke="#fde047" strokeWidth="1.5" />
                  </g>
                )}

                {/* Star Label */}
                <text
                  x="0"
                  y={star.y < 70 ? -14 : 22}
                  textAnchor="middle"
                  fill={star.isPolaris ? '#fde047' : isHoveredTarget ? '#38bdf8' : '#f1f5f9'}
                  fontSize="11"
                  fontWeight="900"
                  className="select-none pointer-events-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
                >
                  {star.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Bottom Helper Bar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="text-slate-300">
            {dragStarObj ? (
              <span className="text-amber-300 font-bold animate-pulse flex items-center gap-1.5">
                <span>🎨</span>
                <span>
                  <strong className="text-white bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-500/40">
                    {dragStarObj.name}
                  </strong> noktasından çiziyorsunuz... Bağlamak istediğiniz yıldıza sürükleyip bırakın!
                </span>
              </span>
            ) : selectedStartStar ? (
              <span className="text-sky-300 font-bold animate-pulse flex items-center gap-1.5">
                <span>★</span>
                <span>
                  Başlangıç yıldızı seçildi: <strong className="text-white bg-sky-950 px-2 py-0.5 rounded-lg border border-sky-500/40">{selectedStartStar}</strong>. Şimdi bağlanacak 2. yıldıza çekin veya tıklayın.
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-300">
                <span>✨</span>
                <span>Bir yıldıza <strong>basılı tutup diğer yıldıza çekerek</strong> çizin (veya sırayla tıklayın).</span>
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleResetLevel}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              Çizimleri Temizle
            </button>
            <button
              onClick={handleNextLevel}
              disabled={!isLevelSuccess}
              className={`px-5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isLevelSuccess
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
              }`}
            >
              <span>{levelIdx === SKY_LEVELS.length - 1 ? 'Rotayı Tamamla ⛵' : 'Sonraki Aşama'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Completion Dialog */}
      {isCompleted && (
        <div className="bg-gradient-to-b from-indigo-950/95 to-slate-950 border-2 border-amber-400 p-6 rounded-3xl text-center space-y-4 animate-in zoom-in duration-300 shadow-2xl">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce drop-shadow-[0_0_20px_#facc15]" />
          <h3 className="text-2xl font-black text-white">Kutup Yıldızı Seyrüseferi Başarıyla Tamamlandı!</h3>
          <p className="text-sm text-indigo-200 max-w-xl mx-auto leading-relaxed">
            Büyük Ayı ve Küçük Ayı takımyıldızlarını <strong>Doğru Parçaları ([AB])</strong> ile kurdunuz; İşaretçi Yıldızlardan <strong>Işın ([BA)</strong> fırlatarak Kutup Yıldızı&apos;nı (Polaris) buldunuz ve <strong>Ufuk Doğruları (d)</strong> ile kaşif gemisini güvenle limana ulaştırdınız (+100 XP)!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setLevelIdx(0);
                setDrawnConnections([]);
                setIsCompleted(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer border border-slate-700"
            >
              Yeniden Keşfe Çık
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =================================================================
// =================================================================
// 3. OYUN: EN KISA YOL DEDEKTİFİ: NEHİR KIYISI DİKME KÖPRÜSÜ (Gönye & ⊥)
// =================================================================
interface BridgeLevel {
  id: number;
  title: string;
  sub: string;
  towerPos: { x: number; y: number };
  shoreLine: { x1: number; y1: number; x2: number; y2: number };
  shortestFootPos: { x: number; y: number };
  baseMinMeters: number;
  initialAngle: number;
}

const BRIDGE_LEVELS: BridgeLevel[] = [
  {
    id: 1,
    title: '1. Parkur: Düz Vadi Nehri (Yatay Kıyı)',
    sub: 'Kaleden (P) nehir doğrusuna (d) ışın gönder; sürgüyü kaydırıp mesafeyi incele ve EN KISA yolun 90° dikme olduğunu keşfet!',
    towerPos: { x: 290, y: 70 },
    shoreLine: { x1: 50, y1: 270, x2: 530, y2: 270 },
    shortestFootPos: { x: 290, y: 270 },
    baseMinMeters: 100,
    initialAngle: 48
  },
  {
    id: 2,
    title: '2. Parkur: Kanyon Eğimli Kıyısı (Açılı Nehir Kıyı Hattı)',
    sub: 'Akan nehir eğik bir hat çiziyor. Kıyı hattına göre ışının açısını ayarla, mesafenin minimum olduğu dikme açısını bulup köprüyü inşa et!',
    towerPos: { x: 320, y: 60 },
    shoreLine: { x1: 50, y1: 300, x2: 530, y2: 140 },
    shortestFootPos: { x: 365, y: 195 },
    baseMinMeters: 110,
    initialAngle: 134
  }
];

export function ShortestPathBridgeGame({ onComplete }: { onComplete?: () => void }) {
  const { addPoints, unlockBadge } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [levelIdx, setLevelIdx] = useState(0);
  const [sliderAngle, setSliderAngle] = useState(BRIDGE_LEVELS[0].initialAngle);
  const [isBridgeConstructed, setIsBridgeConstructed] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'wrong'; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentLevel = BRIDGE_LEVELS[levelIdx];

  // Shore line rotation angle in degrees
  const lineAngleDeg = Math.atan2(
    currentLevel.shoreLine.y2 - currentLevel.shoreLine.y1,
    currentLevel.shoreLine.x2 - currentLevel.shoreLine.x1
  ) * (180 / Math.PI);

  // Angle in radians
  const thetaRad = (sliderAngle * Math.PI) / 180;

  // Live distance in meters: baseMinMeters / sin(theta)
  const sinVal = Math.sin(thetaRad);
  const currentDistanceMeters = Math.round((currentLevel.baseMinMeters / Math.max(0.1, sinVal)) * 10) / 10;

  // Calculate dynamic Foot Position on the Shore Line
  let footPos = { x: 290, y: 270 };
  if (levelIdx === 0) {
    const tanVal = Math.tan(thetaRad);
    const xFoot = 290 - 200 / tanVal;
    footPos = { x: Math.max(50, Math.min(530, xFoot)), y: 270 };
  } else {
    const tanVal = Math.tan(thetaRad);
    const xFoot = 365 - 135 / tanVal;
    const yFoot = 195 + 45 / tanVal;
    footPos = { x: Math.max(50, Math.min(530, xFoot)), y: Math.max(140, Math.min(300, yFoot)) };
  }

  // Handle angle slider change
  const handleAngleChange = (newAngle: number) => {
    const clamped = Math.max(35, Math.min(145, newAngle));
    setSliderAngle(clamped);
    if (isBridgeConstructed) {
      setIsBridgeConstructed(false);
    }
    if (feedback) {
      setFeedback(null);
    }
  };

  // Test & Build Bridge
  const handleBuildBridge = () => {
    synth.playClick();
    if (sliderAngle === 90) {
      synth.playBridgeSnap();
      setIsBridgeConstructed(true);
      setFeedback({
        type: 'success',
        text: `✓ HARİKA TESPİT! 90° Tam Dikme açısında köprü mesafesi ${currentDistanceMeters} m ile minimuma ulaştı. [PH] ⊥ d kuralı kanıtlandı!`
      });
      try {
        confetti({ particleCount: 75, spread: 85, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      setIsBridgeConstructed(false);
      setFeedback({
        type: 'wrong',
        text: `⚠️ Seçilen Açı: ${sliderAngle}°, Köprü Mesafesi: ${currentDistanceMeters} m. Bu en kısa yol değil! Sürgü ile mesafeyi en küçük yapan dikme açısını bulmaya çalış.`
      });
    }
  };

  const handleNextLevel = () => {
    if (levelIdx < BRIDGE_LEVELS.length - 1) {
      synth.playSuccess();
      const nextIdx = levelIdx + 1;
      setLevelIdx(nextIdx);
      setSliderAngle(BRIDGE_LEVELS[nextIdx].initialAngle);
      setIsBridgeConstructed(false);
      setFeedback(null);
    } else {
      setIsCompleted(true);
      synth.playSuccess();
      addPoints(100);
      unlockBadge('shortest-path-master');

      const activeBoardStu = getStoredActiveBoardStudent();
      if (activeBoardStu) {
        awardPointsToStudent(activeBoardStu.id, 100);
        saveBoardParticipation({
          studentId: activeBoardStu.id,
          studentName: activeBoardStu.name,
          studentNumber: activeBoardStu.studentNumber,
          classSection: activeBoardStu.classSection,
          school: activeBoardStu.school,
          teacherId: currentUser?.id,
          teacherName: currentUser?.name,
          activityType: 'game',
          activityTitle: 'En Kısa Yol Dedektifi Oyunu',
          outcomeCode: 'MAT.5.3.1',
          score: 100,
          maxScore: 100,
          xpEarned: 100
        });
        clearActiveBoardStudent();
      }
      try {
        confetti({ particleCount: 110, spread: 90, origin: { y: 0.5 } });
      } catch (e) {}
      if (onComplete) onComplete();
    }
  };

  // Arc dimensions
  const arcRadius = 34;
  const arcEndX = arcRadius * Math.cos(thetaRad);
  const arcEndY = -arcRadius * Math.sin(thetaRad);
  const labelRadius = arcRadius + 18;
  const labelAngleRad = thetaRad / 2;
  const labelX = labelRadius * Math.cos(labelAngleRad);
  const labelY = -labelRadius * Math.sin(labelAngleRad);

  return (
    <div className="bg-slate-950 border border-emerald-500/30 rounded-3xl p-6 text-white shadow-2xl space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Gauge className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
                En Kısa Yol Dedektifi: Dikme Köprüsü
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300">
                Maarif SB2.3 Dikme (⊥) Kanıtı
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Bir doğruya dışındaki noktadan inilebilecek EN KISA doğru parçasının DİKME olduğunu simülasyonla kanıtla!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Parkur {levelIdx + 1} / 2</span>
          </div>
          <button
            onClick={() => {
              synth.enabled = !soundEnabled;
              setSoundEnabled(!soundEnabled);
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 p-4 rounded-2xl border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm font-black text-emerald-300">{currentLevel.title}</div>
          <p className="text-xs text-slate-300">{currentLevel.sub}</p>
        </div>
        <div className="text-xs font-mono bg-emerald-950/40 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-bold">
          📐 Kural: [PH] ⊥ d ise |PH| minimumdur
        </div>
      </div>

      {/* River Simulation Canvas */}
      <div className="relative bg-slate-950 border-2 border-emerald-950 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[380px] shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#022c22,#0f172a)] opacity-60 pointer-events-none" />

        <svg className="w-full max-w-[580px] h-[340px] drop-shadow-2xl" viewBox="0 0 580 340">
          {/* Flowing Water Path */}
          {levelIdx === 0 ? (
            <>
              <path
                d="M 20 285 Q 150 270 300 285 T 560 285"
                fill="none"
                stroke="#0284c7"
                strokeWidth="24"
                opacity="0.35"
              />
              <path
                d="M 20 295 Q 150 280 300 295 T 560 295"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="12"
                opacity="0.4"
              />
            </>
          ) : (
            <>
              <path
                d="M 30 325 Q 290 235 550 160"
                fill="none"
                stroke="#0284c7"
                strokeWidth="26"
                opacity="0.35"
              />
              <path
                d="M 30 335 Q 290 245 550 170"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="14"
                opacity="0.4"
              />
            </>
          )}

          {/* Shoreline Line d */}
          <line
            x1={currentLevel.shoreLine.x1}
            y1={currentLevel.shoreLine.y1}
            x2={currentLevel.shoreLine.x2}
            y2={currentLevel.shoreLine.y2}
            stroke="#10b981"
            strokeWidth="4"
          />
          <text
            x={currentLevel.shoreLine.x2 - 30}
            y={currentLevel.shoreLine.y2 - 14}
            fill="#34d399"
            fontSize="12"
            fontWeight="bold"
            className="drop-shadow-md"
          >
            d Doğrusu (Nehir Kıyı Hattı)
          </text>

          {/* Set Square (Gönye) visual guide when bridge is constructed at 90° */}
          {isBridgeConstructed && (
            <g transform={`translate(${currentLevel.shortestFootPos.x}, ${currentLevel.shortestFootPos.y}) rotate(${lineAngleDeg})`} className="pointer-events-none opacity-40">
              <polygon
                points="0,0 -70,0 0,-140"
                fill="rgba(16, 185, 129, 0.2)"
                stroke="#34d399"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </g>
          )}

          {/* Simulated Beam / Built Bridge Line */}
          <line
            x1={currentLevel.towerPos.x}
            y1={currentLevel.towerPos.y + 20}
            x2={footPos.x}
            y2={footPos.y}
            stroke={isBridgeConstructed ? '#10b981' : '#38bdf8'}
            strokeWidth={isBridgeConstructed ? '6' : '3'}
            strokeDasharray={isBridgeConstructed ? 'none' : '5 4'}
            className={isBridgeConstructed ? 'drop-shadow-[0_0_14px_#10b981]' : 'drop-shadow-[0_0_8px_#38bdf8]'}
          />

          {/* Foot Connection Point */}
          <circle
            cx={footPos.x}
            cy={footPos.y}
            r={isBridgeConstructed ? 7 : 5}
            fill={isBridgeConstructed ? '#34d399' : '#38bdf8'}
            stroke="#0f172a"
            strokeWidth="2"
          />

          {/* Angle Arc & Angle Label at Foot Point */}
          <g transform={`translate(${footPos.x}, ${footPos.y}) rotate(${lineAngleDeg})`}>
            {isBridgeConstructed ? (
              /* 90° Right Angle Marker Box */
              <g>
                <rect
                  x="0"
                  y="-14"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
                <circle cx="7" cy="-7" r="2" fill="#10b981" />
                <text
                  x="0"
                  y="26"
                  textAnchor="middle"
                  fill="#34d399"
                  fontSize="11"
                  fontWeight="black"
                  transform={`rotate(${-lineAngleDeg})`}
                  className="drop-shadow-md"
                >
                  H (Dikme Ayağı) • 90°
                </text>
              </g>
            ) : (
              /* Dynamic Angle Arc without early color hints */
              <g>
                <path
                  d={`M ${arcRadius} 0 A ${arcRadius} ${arcRadius} 0 0 0 ${arcEndX} ${arcEndY}`}
                  fill="rgba(56, 189, 248, 0.15)"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#7dd3fc"
                  fontSize="11"
                  fontWeight="bold"
                  transform={`rotate(${-lineAngleDeg}, ${labelX}, ${labelY})`}
                  className="drop-shadow-md select-none"
                >
                  {sliderAngle}°
                </text>
              </g>
            )}
          </g>

          {/* Tower Fortress at Point P */}
          <g transform={`translate(${currentLevel.towerPos.x}, ${currentLevel.towerPos.y})`}>
            <polygon points="-20,20 20,20 15,-20 -15,-20" fill="#334155" stroke="#e2e8f0" strokeWidth="2" />
            <rect x="-6" y="-8" width="12" height="16" fill="#0f172a" />
            <circle cx="0" cy="-24" r="8" fill="#f59e0b" className="animate-pulse" />
            <text x="0" y="-36" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="900" className="drop-shadow-md">
              P Kalesi (Dış Nokta)
            </text>
          </g>
        </svg>

        {/* Live Laser Rangefinder Telemetry Box */}
        <div className="absolute top-4 right-4 bg-slate-900/90 border border-emerald-500/40 p-3.5 rounded-2xl text-xs space-y-1.5 backdrop-blur-md shadow-xl max-w-[240px]">
          <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Lazer Telemetre Ölçümü:</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-300 font-medium">Işın Açısı (α):</span>
            <span className="font-mono font-black text-cyan-300 text-sm">{sliderAngle}°</span>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-slate-800 pt-1">
            <span className="text-slate-300 font-medium">Köprü Mesafesi:</span>
            <strong className={`font-mono text-sm font-black ${isBridgeConstructed ? 'text-emerald-300' : 'text-amber-300'}`}>
              {currentDistanceMeters} m
            </strong>
          </div>
          <div className="text-[10.5px] text-slate-400 pt-1 border-t border-slate-800/80">
            {isBridgeConstructed ? (
              <span className="text-emerald-400 font-bold">✓ KANITLANDI: 90° DİKME EN KISA YOLDUR!</span>
            ) : (
              <span>💡 Mesafenin en küçük olduğu açıyı bul ve köprüyü inşa et.</span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Angle Slider & Control Panel */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-white">Işın Açı Ayarı (Kıyı Hattına Göre):</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono font-black text-sm">
              Açı: {sliderAngle}°
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono font-black text-sm">
              Mesafe: {currentDistanceMeters} m
            </span>
          </div>
        </div>

        {/* Slider with Step Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => handleAngleChange(sliderAngle - 5)}
            className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all cursor-pointer"
            title="5° Azalt"
          >
            -5°
          </button>
          <button
            onClick={() => handleAngleChange(sliderAngle - 1)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            title="1° Azalt"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            type="range"
            min={35}
            max={145}
            step={1}
            value={sliderAngle}
            onChange={(e) => handleAngleChange(Number(e.target.value))}
            className="flex-1 h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />

          <button
            onClick={() => handleAngleChange(sliderAngle + 1)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            title="1° Artır"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAngleChange(sliderAngle + 5)}
            className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all cursor-pointer"
            title="5° Artır"
          >
            +5°
          </button>
        </div>

        {/* Feedback Banner if any */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-200 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                : 'bg-amber-950/80 border border-amber-500/50 text-amber-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleBuildBridge}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-600/20 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Köprüyü Bu Açıyla İnşa Et ({sliderAngle}°)</span>
          </button>

          <button
            onClick={handleNextLevel}
            disabled={!isBridgeConstructed}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isBridgeConstructed
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
            }`}
          >
            <span>{levelIdx === BRIDGE_LEVELS.length - 1 ? 'Köprü İnşasını Tamamla 🌉' : 'Sonraki Parkura Geç'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Completion */}
      {isCompleted && (
        <div className="bg-emerald-950/90 border-2 border-emerald-500 p-6 rounded-3xl text-center space-y-4 animate-in zoom-in duration-300">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
          <h3 className="text-2xl font-black text-white">En Kısa Yol Kanıtlandı! Baş Mimar Oldunuz!</h3>
          <p className="text-sm text-emerald-200 max-w-lg mx-auto">
            Gönyeyi kullanarak bir doğruya dışındaki noktadan çizilebilecek en kısa mesafenin 90° dikme olduğunu matematiksel olarak kanıtladınız (+100 XP).
          </p>
          <button
            onClick={() => {
              setLevelIdx(0);
              setSliderAngle(BRIDGE_LEVELS[0].initialAngle);
              setIsBridgeConstructed(false);
              setFeedback(null);
              setIsCompleted(false);
            }}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Yeniden Oyna
          </button>
        </div>
      )}
    </div>
  );
}

// =================================================================
// 4. OYUN: RADAR DİNAMİK AÇI AVCISI (Dönen Işın ile Açı Modelleme)
// =================================================================
interface RadarSignalLevel {
  id: number;
  targetAngle: number;
  angleCategory: 'Dar Açı' | 'Dik Açı' | 'Geniş Açı' | 'Doğru Açı';
  description: string;
  aircraftName: string;
  tolerance: number;
}

const RADAR_LEVELS: RadarSignalLevel[] = [
  {
    id: 1,
    targetAngle: 45,
    angleCategory: 'Dar Açı',
    description: 'Kuzeydoğu sektöründen yaklaşan keşif uçağı sinyali: 45° Dar Açıya dön!',
    aircraftName: 'GÖKBEY Keşif Uçağı',
    tolerance: 5
  },
  {
    id: 2,
    targetAngle: 90,
    angleCategory: 'Dik Açı',
    description: 'Doğu sektöründen dik gelen kargo uçağı: Tam 90° DİK AÇI kilitlenmesi yap!',
    aircraftName: 'HÜRKUŞ Kargo Uçağı',
    tolerance: 3
  },
  {
    id: 3,
    targetAngle: 135,
    angleCategory: 'Geniş Açı',
    description: 'Güneydoğu sektöründen teğet geçen jet uçağı: 135° GENİŞ AÇIYA dön!',
    aircraftName: 'KAAN Jet Filosu',
    tolerance: 5
  },
  {
    id: 4,
    targetAngle: 180,
    angleCategory: 'Doğru Açı',
    description: 'Tam karşı ufuk çizgisinden sinyal: 180° DOĞRU AÇI hizalaması sağla!',
    aircraftName: 'Uzay Gözlem İstasyonu',
    tolerance: 5
  }
];

export function DynamicAngleRadarGame({ onComplete }: { onComplete?: () => void }) {
  const { addPoints, unlockBadge } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [levelIdx, setLevelIdx] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(15);
  const [selectedCategoryAnswer, setSelectedCategoryAnswer] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentLevel = RADAR_LEVELS[levelIdx];

  const isAngleOnTarget = Math.abs(currentAngle - currentLevel.targetAngle) <= currentLevel.tolerance;

  const handleLockSignal = () => {
    if (!isAngleOnTarget) {
      synth.playError();
      return;
    }

    if (selectedCategoryAnswer === currentLevel.angleCategory) {
      synth.playRadarPing();
      setIsLocked(true);
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      synth.playError();
    }
  };

  const handleNextLevel = () => {
    if (levelIdx < RADAR_LEVELS.length - 1) {
      synth.playSuccess();
      setLevelIdx(prev => prev + 1);
      setCurrentAngle(15);
      setSelectedCategoryAnswer(null);
      setIsLocked(false);
    } else {
      setIsCompleted(true);
      synth.playSuccess();
      addPoints(100);
      unlockBadge('dynamic-angle-radar-pro');

      const activeBoardStu = getStoredActiveBoardStudent();
      if (activeBoardStu) {
        awardPointsToStudent(activeBoardStu.id, 100);
        saveBoardParticipation({
          studentId: activeBoardStu.id,
          studentName: activeBoardStu.name,
          studentNumber: activeBoardStu.studentNumber,
          classSection: activeBoardStu.classSection,
          school: activeBoardStu.school,
          teacherId: currentUser?.id,
          teacherName: currentUser?.name,
          activityType: 'game',
          activityTitle: 'Radar Dinamik Açı Avcısı Oyunu',
          outcomeCode: 'MAT.5.3.1',
          score: 100,
          maxScore: 100,
          xpEarned: 100
        });
        clearActiveBoardStudent();
      }
      try {
        confetti({ particleCount: 110, spread: 90, origin: { y: 0.5 } });
      } catch (e) {}
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-300">
                Radar Dinamik Açı Avcısı
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                Maarif SB2.1 Dönen Işın & Açı
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Başlangıç noktası etrafında dönen ışın ile açıları modelle, sinyalleri yakala!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Hedef {levelIdx + 1} / 4</span>
          </div>
          <button
            onClick={() => {
              synth.enabled = !soundEnabled;
              setSoundEnabled(!soundEnabled);
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Target Brief */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-950 p-4 rounded-2xl border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm font-black text-cyan-300 flex items-center gap-2">
            <span>{currentLevel.aircraftName}</span>
          </div>
          <p className="text-xs text-slate-300">{currentLevel.description}</p>
        </div>
        <div className="text-xs font-mono bg-cyan-950/50 text-cyan-300 px-3 py-1.5 rounded-xl border border-cyan-500/20">
          🎯 Hedef Açı: {currentLevel.targetAngle}° ({currentLevel.angleCategory})
        </div>
      </div>

      {/* Main Radar Screen Canvas */}
      <div className="relative bg-slate-950 border-2 border-cyan-950 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[360px] shadow-2xl overflow-hidden">
        <svg className="w-full max-w-[420px] aspect-square drop-shadow-2xl" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="160" fill="#030712" stroke="#0e7490" strokeWidth="2" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="#155e75" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="80" fill="none" stroke="#155e75" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="40" fill="none" stroke="#155e75" strokeWidth="1" strokeDasharray="4 4" />

          <line x1="40" y1="200" x2="360" y2="200" stroke="#0e7490" strokeWidth="1.5" />
          <line x1="200" y1="40" x2="200" y2="360" stroke="#0e7490" strokeWidth="1.5" />

          {/* Base Ray [OA) */}
          <line x1="200" y1="200" x2="360" y2="200" stroke="#38bdf8" strokeWidth="4" />
          <text x="365" y="204" fill="#38bdf8" fontSize="10" fontWeight="black">
            [OA) Işını (0° Kolu)
          </text>

          {/* Dynamic Rotating Ray [OB) */}
          {(() => {
            const rad = ((currentAngle) * Math.PI) / 180;
            const x2 = 200 + 160 * Math.cos(-rad);
            const y2 = 200 + 160 * Math.sin(-rad);

            return (
              <g>
                <path
                  d={`M 200 200 L 360 200 A 160 160 0 ${currentAngle > 180 ? 1 : 0} 0 ${x2} ${y2} Z`}
                  fill={isAngleOnTarget ? 'rgba(6, 182, 212, 0.25)' : 'rgba(14, 116, 144, 0.12)'}
                  stroke="none"
                />

                <line
                  x1="200"
                  y1="200"
                  x2={x2}
                  y2={y2}
                  stroke={isAngleOnTarget ? '#22d3ee' : '#f59e0b'}
                  strokeWidth="4"
                  className={isAngleOnTarget ? 'drop-shadow-[0_0_10px_#22d3ee]' : ''}
                />

                <circle cx={x2} cy={y2} r="6" fill={isAngleOnTarget ? '#22d3ee' : '#f59e0b'} />

                <path
                  d={`M 250 200 A 50 50 0 0 0 ${200 + 50 * Math.cos(-rad)} ${200 + 50 * Math.sin(-rad)}`}
                  fill="none"
                  stroke={isAngleOnTarget ? '#22d3ee' : '#fbbf24'}
                  strokeWidth="3"
                />

                {currentAngle === 90 && (
                  <rect x="200" y="176" width="24" height="24" fill="none" stroke="#22d3ee" strokeWidth="2" />
                )}
              </g>
            );
          })()}

          {/* Target Beacon */}
          {(() => {
            const targetRad = (currentLevel.targetAngle * Math.PI) / 180;
            const tx = 200 + 130 * Math.cos(-targetRad);
            const ty = 200 + 130 * Math.sin(-targetRad);
            return (
              <g transform={`translate(${tx}, ${ty})`}>
                <circle cx="0" cy="0" r="14" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="0" cy="0" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" className="drop-shadow-[0_0_8px_#ef4444]" />
                <text x="0" y="-14" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="black">
                  ✈ {currentLevel.targetAngle}° Sinyal
                </text>
              </g>
            );
          })()}

          {/* Center Point O */}
          <circle cx="200" cy="200" r="6" fill="#ffffff" />
          <text x="188" y="215" fill="#f8fafc" fontSize="11" fontWeight="bold">
            O (Açı Köşesi)
          </text>
        </svg>

        {/* Live HUD telemetry */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-xl text-xs flex items-center gap-3 backdrop-blur-md">
          <div className="font-mono text-base font-black text-cyan-400">{currentAngle}°</div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="text-slate-300">
            Açı Sembolü: <strong className="text-white font-mono">s(AÔB) = {currentAngle}°</strong>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className={isAngleOnTarget ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
            {isAngleOnTarget ? '✓ SİNYAL HİZALANDI' : 'Işını Döndürünüz'}
          </div>
        </div>
      </div>

      {/* Angle Slider & Classification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 items-center">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Dinamik Işın Açıklığı:</span>
            <span className="font-mono text-cyan-400 font-black text-sm">{currentAngle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            value={currentAngle}
            onChange={e => {
              setCurrentAngle(Number(e.target.value));
              synth.playClick();
            }}
            disabled={isLocked}
            className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0° (Sıfır)</span>
            <span>45° (Dar)</span>
            <span className="text-cyan-300 font-bold">90° (Dik)</span>
            <span>135° (Geniş)</span>
            <span className="text-indigo-300 font-bold">180° (Doğru)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300">Açı Türünü Sınıflandır:</div>
          <div className="grid grid-cols-4 gap-2">
            {(['Dar Açı', 'Dik Açı', 'Geniş Açı', 'Doğru Açı'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategoryAnswer(cat);
                  synth.playClick();
                }}
                disabled={isLocked}
                className={`py-2 px-1 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                  selectedCategoryAnswer === cat
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lock Signal Action */}
      <div className="flex justify-end gap-3 pt-2">
        {!isLocked ? (
          <button
            onClick={handleLockSignal}
            disabled={!isAngleOnTarget || !selectedCategoryAnswer}
            className={`px-8 py-3.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
              isAngleOnTarget && selectedCategoryAnswer
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sinyali Doğrula & Kilitle</span>
          </button>
        ) : (
          <button
            onClick={handleNextLevel}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>{levelIdx === RADAR_LEVELS.length - 1 ? 'Tüm Sinyalleri Çöz 🛰️' : 'Sonraki Radar Sinyali'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Completion */}
      {isCompleted && (
        <div className="bg-cyan-950/90 border-2 border-cyan-500 p-6 rounded-3xl text-center space-y-4 animate-in zoom-in duration-300">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
          <h3 className="text-2xl font-black text-white">Radar Dinamik Açı Avcısı Tamamlandı!</h3>
          <p className="text-sm text-cyan-200 max-w-lg mx-auto">
            Bir ışının başlangıç noktası etrafında dönme hareketini, dar, dik, geniş ve doğru açı türlerini kusursuz modellediniz (+100 XP).
          </p>
          <button
            onClick={() => {
              setLevelIdx(0);
              setCurrentAngle(15);
              setSelectedCategoryAnswer(null);
              setIsLocked(false);
              setIsCompleted(false);
            }}
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Yeniden Oyna
          </button>
        </div>
      )}
    </div>
  );
}
