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
  Radio
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
  goalDesc: string;
  targetShape: 'circle-rosette' | 'eight-point-star' | 'grand-mosaic';
  steps: {
    instruction: string;
    tool: 'compass' | 'ruler' | 'setsquare' | 'color';
    checkKey: string;
  }[];
}

const SELJUK_LEVELS: SeljukLevel[] = [
  {
    id: 1,
    title: '1. Aşama: Kubbe Rozeti (Pergel & Eş Çemberler)',
    subtitle: 'Sabit merkez noktadan eş yarıçaplı çember yayları çizerek 4 yapraklı Selçuklu rozetini inşa et.',
    goalDesc: 'Pergelin ayağını merkez noktaya (M) sabitle ve 4 yönde eş yarıçaplı çemberleri döndür.',
    targetShape: 'circle-rosette',
    steps: [
      { instruction: 'Pergel açıklığını kilitle ve Merkez (M) etrafında 4 ana çember yayını tamamla.', tool: 'compass', checkKey: 'circlesDone' },
      { instruction: 'Turkuaz sırlama rengini seçerek rozet dilimlerini renklendir.', tool: 'color', checkKey: 'colored' }
    ]
  },
  {
    id: 2,
    title: '2. Aşama: Sekiz Köşeli Selçuklu Yıldızı (Kesişen Doğrular & Dikmeler)',
    subtitle: 'Yatay ve dikey doğruları dik kesiştir (d1 ⊥ d2), ardından 45° açılı ışınlarla 8 köşeli yıldızı birleştir.',
    goalDesc: 'Gönye ile 90° dik eksenleri oluştur ve doğru parçalarıyla tepe noktalarını birleştir.',
    targetShape: 'eight-point-star',
    steps: [
      { instruction: 'Yatay ve dikey eksenleri 90° dik kesiştir (Gönye ile d1 ⊥ d2 inşası).', tool: 'setsquare', checkKey: 'axisDone' },
      { instruction: 'Çizgeç ile 8 köşeyi doğru parçaları [AB], [BC]... olarak bağla.', tool: 'ruler', checkKey: 'starLinesDone' },
      { instruction: 'Kobalt mavisi ve altın sarısı sır ile yıldızı aydınlat.', tool: 'color', checkKey: 'colored' }
    ]
  },
  {
    id: 3,
    title: '3. Aşama: Büyük Divan Çinisi (Açısal Simetri & Geometrik Rosetta)',
    subtitle: 'Çember, ışın ve dikmelerin muhteşem uyumuyla saray baş mimarı rozetini tamamla.',
    goalDesc: 'Tüm geometrik araçları bir araya getirerek tam simetrili saray panosunu üret.',
    targetShape: 'grand-mosaic',
    steps: [
      { instruction: 'Dış çemberi ve iç çemberi pergel kilidiyle çiz.', tool: 'compass', checkKey: 'circlesDone' },
      { instruction: 'Merkezden 8 yöne ışınlar göndererek açıları eşitle.', tool: 'ruler', checkKey: 'raysDone' },
      { instruction: 'Saray sırlama fırınını ateşle ve panoyu tamamla!', tool: 'color', checkKey: 'colored' }
    ]
  }
];

export function SeljukTileMasterGame({ onComplete }: { onComplete?: () => void }) {
  const { addPoints, unlockBadge } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [levelIdx, setLevelIdx] = useState(0);
  const [activeTool, setActiveTool] = useState<'compass' | 'ruler' | 'setsquare' | 'color'>('compass');
  const [stepStates, setStepStates] = useState<{ [key: string]: boolean }>({});
  const [selectedGlazeColor, setSelectedGlazeColor] = useState<string>('#0284c7');
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentLevel = SELJUK_LEVELS[levelIdx];

  const handleToolAction = (toolType: string) => {
    synth.playClick();
    if (toolType === 'compass') {
      setStepStates(prev => ({ ...prev, circlesDone: true }));
      synth.playStarConnect();
    } else if (toolType === 'setsquare') {
      setStepStates(prev => ({ ...prev, axisDone: true }));
      synth.playBridgeSnap();
    } else if (toolType === 'ruler') {
      setStepStates(prev => ({ ...prev, starLinesDone: true, raysDone: true }));
      synth.playStarConnect();
    } else if (toolType === 'color') {
      setStepStates(prev => ({ ...prev, colored: true }));
      synth.playTileGlaze();
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const isLevelReadyToAdvance = currentLevel.steps.every(s => stepStates[s.checkKey]);

  const handleNextLevel = () => {
    if (levelIdx < SELJUK_LEVELS.length - 1) {
      synth.playSuccess();
      setLevelIdx(prev => prev + 1);
      setStepStates({});
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
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      } catch (e) {}
      if (onComplete) onComplete();
    }
  };

  const handleReset = () => {
    setLevelIdx(0);
    setStepStates({});
    setIsCompleted(false);
  };

  return (
    <div className="bg-slate-950 border border-teal-500/30 rounded-3xl p-6 text-white shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-emerald-200 to-amber-300">
                Selçuklu Sarayı Çini Ustası
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-950 border border-teal-500/50 text-teal-300">
                Maarif D7.1 Sanat & Tasarım
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Çizgeç, pergel ve gönye ile sekizgen Selçuklu yıldızı ve çini mozaikleri inşa et!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Seviye {levelIdx + 1} / 3</span>
          </div>
          <button
            onClick={() => {
              synth.enabled = !soundEnabled;
              setSoundEnabled(!soundEnabled);
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Ses Aç/Kapat"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Level Info Banner */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-950 p-4 rounded-2xl border border-teal-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm font-black text-teal-300 flex items-center gap-2">
            <span>{currentLevel.title}</span>
          </div>
          <p className="text-xs text-slate-300">{currentLevel.subtitle}</p>
        </div>
        <div className="text-xs text-amber-300/90 font-mono bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-500/20">
          💡 Hedef: {currentLevel.goalDesc}
        </div>
      </div>

      {/* Main Interactive Studio Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left: Toolbelt & Steps Controls */}
        <div className="space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>Geometrik Mimari Araçları</span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setActiveTool('compass');
                handleToolAction('compass');
              }}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                activeTool === 'compass'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-md shadow-teal-500/10'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-6 h-6 text-teal-400" />
              <span>Sanal Pergel</span>
              <span className="text-[10px] font-normal text-slate-400">Çember & Yay</span>
            </button>

            <button
              onClick={() => {
                setActiveTool('setsquare');
                handleToolAction('setsquare');
              }}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                activeTool === 'setsquare'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-md shadow-teal-500/10'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gauge className="w-6 h-6 text-amber-400" />
              <span>Sanal Gönye</span>
              <span className="text-[10px] font-normal text-slate-400">90° Dik Eksen</span>
            </button>

            <button
              onClick={() => {
                setActiveTool('ruler');
                handleToolAction('ruler');
              }}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                activeTool === 'ruler'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-md shadow-teal-500/10'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Maximize2 className="w-6 h-6 text-indigo-400" />
              <span>Çizgeç & Cetvel</span>
              <span className="text-[10px] font-normal text-slate-400">Doğru & Işın</span>
            </button>

            <button
              onClick={() => {
                setActiveTool('color');
                handleToolAction('color');
              }}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                activeTool === 'color'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-md shadow-teal-500/10'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-6 h-6 text-rose-400" />
              <span>Çini Sırlama</span>
              <span className="text-[10px] font-normal text-slate-400">Fırın & Renk</span>
            </button>
          </div>

          {/* Color palette selector */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-[11px] font-bold text-slate-300">Geleneksel Sır Renkleri:</div>
            <div className="flex gap-2">
              {[
                { name: 'İznik Turkuazı', color: '#06b6d4' },
                { name: 'Kobalt Mavisi', color: '#1d4ed8' },
                { name: 'Saray Yakutu', color: '#e11d48' },
                { name: 'Selçuklu Altını', color: '#eab308' },
                { name: 'Zümrüt Yeşili', color: '#10b981' }
              ].map(c => (
                <button
                  key={c.color}
                  onClick={() => {
                    setSelectedGlazeColor(c.color);
                    synth.playClick();
                  }}
                  className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                    selectedGlazeColor === c.color ? 'scale-125 border-white shadow-lg' : 'border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Step Progress checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-[11px] font-bold text-slate-300">Aşama Görevleri:</div>
            {currentLevel.steps.map((st, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                  stepStates[st.checkKey]
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span>{st.instruction}</span>
                {stepStates[st.checkKey] ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-slate-600 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Action button to next level */}
          <button
            onClick={handleNextLevel}
            disabled={!isLevelReadyToAdvance}
            className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isLevelReadyToAdvance
                ? 'bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-teal-500/25 hover:scale-[1.02] active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
            }`}
          >
            <span>{levelIdx === SELJUK_LEVELS.length - 1 ? 'Çini Başyapıtını Tamamla 🏆' : 'Sonraki Aşama'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center & Right: SVG Geometric Tile Canvas */}
        <div className="lg:col-span-2 relative bg-slate-950 border-2 border-slate-800 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[380px] shadow-inner overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          <svg className="w-full max-w-[420px] aspect-square drop-shadow-2xl" viewBox="0 0 400 400">
            <defs>
              <radialGradient id="seljukGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={selectedGlazeColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>

            {/* Outer Ceramic Tile Frame */}
            <rect
              x="20"
              y="20"
              width="360"
              height="360"
              rx="24"
              fill="#090d16"
              stroke="url(#goldRim)"
              strokeWidth="4"
            />

            {/* Background Glow */}
            {stepStates.colored && (
              <circle cx="200" cy="200" r="160" fill="url(#seljukGlow)" className="animate-pulse" />
            )}

            {/* Center Reference Origin Point M */}
            <circle cx="200" cy="200" r="4" fill="#f8fafc" />
            <text x="200" y="190" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
              M (Merkez)
            </text>

            {/* LEVEL 1: CIRCLE ROSETTE */}
            {currentLevel.targetShape === 'circle-rosette' && (
              <g>
                <circle
                  cx="200"
                  cy="200"
                  r="120"
                  fill="none"
                  stroke={stepStates.circlesDone ? '#38bdf8' : '#334155'}
                  strokeWidth="2.5"
                  strokeDasharray={stepStates.circlesDone ? 'none' : '4 4'}
                />

                {[
                  { cx: 200, cy: 80 },
                  { cx: 200, cy: 320 },
                  { cx: 80, cy: 200 },
                  { cx: 320, cy: 200 }
                ].map((c, i) => (
                  <circle
                    key={i}
                    cx={c.cx}
                    cy={c.cy}
                    r="120"
                    fill={stepStates.colored ? selectedGlazeColor : 'none'}
                    fillOpacity={stepStates.colored ? '0.25' : '0'}
                    stroke={stepStates.circlesDone ? '#06b6d4' : '#1e3a5f'}
                    strokeWidth={stepStates.circlesDone ? '3' : '1.5'}
                    className="transition-all duration-500"
                  />
                ))}

                {stepStates.colored && (
                  <circle cx="200" cy="200" r="45" fill={selectedGlazeColor} fillOpacity="0.45" stroke="#fef08a" strokeWidth="2" />
                )}
              </g>
            )}

            {/* LEVEL 2: EIGHT-POINT SELJUK STAR */}
            {currentLevel.targetShape === 'eight-point-star' && (
              <g>
                {stepStates.axisDone && (
                  <g>
                    <line x1="40" y1="200" x2="360" y2="200" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="200" y1="40" x2="200" y2="360" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="85" y1="85" x2="315" y2="315" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="2 2" />
                    <line x1="85" y1="315" x2="315" y2="85" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="2 2" />

                    <rect x="200" y="186" width="14" height="14" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                    <circle cx="207" cy="193" r="1.5" fill="#f59e0b" />
                    <text x="218" y="180" fill="#f59e0b" fontSize="9" fontWeight="bold">d1 ⊥ d2 (90° Dikme)</text>
                  </g>
                )}

                {stepStates.starLinesDone && (
                  <g>
                    <rect
                      x="100"
                      y="100"
                      width="200"
                      height="200"
                      fill={stepStates.colored ? selectedGlazeColor : 'none'}
                      fillOpacity={stepStates.colored ? '0.3' : '0'}
                      stroke="#38bdf8"
                      strokeWidth="3"
                    />
                    <rect
                      x="100"
                      y="100"
                      width="200"
                      height="200"
                      transform="rotate(45 200 200)"
                      fill={stepStates.colored ? selectedGlazeColor : 'none'}
                      fillOpacity={stepStates.colored ? '0.3' : '0'}
                      stroke="#f59e0b"
                      strokeWidth="3"
                    />
                  </g>
                )}

                {stepStates.colored && (
                  <polygon
                    points="200,165 225,175 235,200 225,225 200,235 175,225 165,200 175,175"
                    fill="#facc15"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                )}
              </g>
            )}

            {/* LEVEL 3: GRAND MOSAIC */}
            {currentLevel.targetShape === 'grand-mosaic' && (
              <g>
                {stepStates.circlesDone && (
                  <g>
                    <circle cx="200" cy="200" r="150" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                    <circle cx="200" cy="200" r="90" fill="none" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="200" cy="200" r="40" fill="none" stroke="#ec4899" strokeWidth="2" />
                  </g>
                )}

                {stepStates.raysDone && (
                  <g>
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, idx) => {
                      const rad = (ang * Math.PI) / 180;
                      const x2 = 200 + 150 * Math.cos(rad);
                      const y2 = 200 + 150 * Math.sin(rad);
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

                {stepStates.colored && (
                  <g>
                    <polygon
                      points="200,80 285,115 320,200 285,285 200,320 115,285 80,200 115,115"
                      fill={selectedGlazeColor}
                      fillOpacity="0.4"
                      stroke="#fef08a"
                      strokeWidth="3"
                    />
                    <circle cx="200" cy="200" r="40" fill="#facc15" stroke="#fef08a" strokeWidth="2" />
                  </g>
                )}
              </g>
            )}
          </svg>

          {/* Mathematical Tooltip Overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-mono text-teal-300 flex items-center gap-2">
            <span>📐 Geometrik İlke:</span>
            <span className="text-slate-200 font-bold">
              {currentLevel.targetShape === 'circle-rosette' && 'Eş Yarıçaplı Çemberler (r1 = r2)'}
              {currentLevel.targetShape === 'eight-point-star' && 'Kesişen Doğrular ve Dikme (d1 ⊥ d2, 90°)'}
              {currentLevel.targetShape === 'grand-mosaic' && 'Işın Açıları & Düzlem Simetrisi'}
            </span>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {isCompleted && (
        <div className="bg-teal-950/90 border-2 border-teal-500 p-6 rounded-3xl text-center space-y-4 animate-in zoom-in duration-300">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
          <h3 className="text-2xl font-black text-white">Saray Baş Çini Mimarı Unvanını Kazandınız!</h3>
          <p className="text-sm text-teal-200 max-w-lg mx-auto">
            Doğru, doğru parçası, ışın, pergel ile çember ve gönye ile dikme inşalarını kullanarak tarihi Selçuklu mozaiklerini kusursuz tamamladınız (+100 XP).
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Yeniden Tasarla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =================================================================
// 2. OYUN: KUTUP YILDIZI SEYRÜSEFERİ (Işın, Doğru ve Doğru Parçası)
// =================================================================
interface SkyLevel {
  id: number;
  title: string;
  sub: string;
  conceptType: 'ray' | 'segment' | 'line';
  symbolGoal: string;
  stars: { id: string; name: string; x: number; y: number }[];
  requiredConnections: [string, string][];
}

const SKY_LEVELS: SkyLevel[] = [
  {
    id: 1,
    title: '1. Seviye: Kutup Yıldızı Işın Feneri ([PA>)',
    sub: 'Başlangıcı Kutup Yıldızı (P) olan ve sonsuza uzayan ışınlarla gemiye deniz feneri rotası çiz!',
    conceptType: 'ray',
    symbolGoal: '[PA> veya [PB> (Başlangıcı sabit, tek yönde sonsuz)',
    stars: [
      { id: 'P', name: 'Kutup Yıldızı (P)', x: 100, y: 100 },
      { id: 'A', name: 'Kuzey Feneri (A)', x: 450, y: 100 },
      { id: 'B', name: 'Doğu Şamandırası (B)', x: 380, y: 280 }
    ],
    requiredConnections: [['P', 'A'], ['P', 'B']]
  },
  {
    id: 2,
    title: '2. Seviye: Büyükayı Takımyıldızı ([AB], [BC]... Doğru Parçaları)',
    sub: 'İki ucu da sınırlı olan yıldızları ölçülü doğru parçalarıyla bağlayarak takımyıldız figürünü tamamla.',
    conceptType: 'segment',
    symbolGoal: '[AB], [BC], [CD] (İki ucu sınırlı, boyu ölçülebilir)',
    stars: [
      { id: 'A', name: 'Dubhe (A)', x: 120, y: 120 },
      { id: 'B', name: 'Merak (B)', x: 220, y: 140 },
      { id: 'C', name: 'Phecda (C)', x: 260, y: 240 },
      { id: 'D', name: 'Megrez (D)', x: 160, y: 220 },
      { id: 'E', name: 'Alioth (E)', x: 360, y: 250 },
      { id: 'F', name: 'Mizar (F)', x: 440, y: 210 }
    ],
    requiredConnections: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['C', 'E'], ['E', 'F']]
  },
  {
    id: 3,
    title: '3. Seviye: Ufuk Doğruları & Boğaz Geçidi (d1 ve d2 Doğruları)',
    sub: 'İki yönden sınırsız uzayan seyir doğrularını uzatarak kesişim noktasındaki güvenli geçidi bul.',
    conceptType: 'line',
    symbolGoal: 'd1 ve d2 doğruları (AB veya CD, iki yönden sınırsız)',
    stars: [
      { id: 'K1', name: 'Kuzey Burnu (K1)', x: 100, y: 80 },
      { id: 'K2', name: 'Fener Kulesi (K2)', x: 480, y: 260 },
      { id: 'G1', name: 'Güney Resifi (G1)', x: 120, y: 320 },
      { id: 'G2', name: 'Boğaz Girişi (G2)', x: 460, y: 100 }
    ],
    requiredConnections: [['K1', 'K2'], ['G1', 'G2']]
  }
];

export function PolarisNavigatorGame({ onComplete }: { onComplete?: () => void }) {
  const { addPoints, unlockBadge } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [levelIdx, setLevelIdx] = useState(0);
  const [selectedStartStar, setSelectedStartStar] = useState<string | null>(null);
  const [drawnConnections, setDrawnConnections] = useState<[string, string][]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentLevel = SKY_LEVELS[levelIdx];

  const handleStarClick = (starId: string) => {
    synth.playClick();
    if (!selectedStartStar) {
      setSelectedStartStar(starId);
    } else {
      if (selectedStartStar !== starId) {
        const newConn: [string, string] = [selectedStartStar, starId];
        const reverseConn: [string, string] = [starId, selectedStartStar];

        const alreadyExists = drawnConnections.some(
          c => (c[0] === newConn[0] && c[1] === newConn[1]) || (c[0] === reverseConn[0] && c[1] === reverseConn[1])
        );

        if (!alreadyExists) {
          setDrawnConnections(prev => [...prev, newConn]);
          synth.playStarConnect();
        }
      }
      setSelectedStartStar(null);
    }
  };

  const isLevelSuccess = currentLevel.requiredConnections.every(req =>
    drawnConnections.some(
      d => (d[0] === req[0] && d[1] === req[1]) || (d[0] === req[1] && d[1] === req[0])
    )
  );

  const handleNextLevel = () => {
    if (levelIdx < SKY_LEVELS.length - 1) {
      synth.playSuccess();
      setLevelIdx(prev => prev + 1);
      setSelectedStartStar(null);
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
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}
      if (onComplete) onComplete();
    }
  };

  const handleResetLevel = () => {
    setDrawnConnections([]);
    setSelectedStartStar(null);
  };

  return (
    <div className="bg-slate-950 border border-indigo-500/30 rounded-3xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-sky-200 to-purple-300">
                Kutup Yıldızı Seyrüseferi
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/50 text-indigo-300">
                Işın • Doğru • Doğru Parçası
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Yıldızları doğru geometrik modeller ve sembolik gösterimlerle bağlayarak rotayı çiz!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-sky-400 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Seviye {levelIdx + 1} / 3</span>
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

      {/* Info & Goals Bar */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 p-4 rounded-2xl border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm font-black text-indigo-300 flex items-center gap-2">
            <span>{currentLevel.title}</span>
          </div>
          <p className="text-xs text-slate-300">{currentLevel.sub}</p>
        </div>
        <div className="text-xs text-sky-300 font-mono bg-sky-950/40 px-3 py-1.5 rounded-xl border border-sky-500/20">
          Sembol: {currentLevel.symbolGoal}
        </div>
      </div>

      {/* Star Chart Canvas */}
      <div className="relative bg-slate-950 border-2 border-indigo-900/50 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[360px] shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        <svg className="w-full max-w-[580px] h-[340px] drop-shadow-2xl" viewBox="0 0 580 340">
          <circle cx="290" cy="170" r="160" fill="none" stroke="#1e1b4b" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="290" cy="170" r="100" fill="none" stroke="#1e1b4b" strokeWidth="1" strokeDasharray="3 3" />

          {drawnConnections.map((conn, idx) => {
            const s1 = currentLevel.stars.find(s => s.id === conn[0]);
            const s2 = currentLevel.stars.find(s => s.id === conn[1]);
            if (!s1 || !s2) return null;

            if (currentLevel.conceptType === 'ray') {
              const dx = s2.x - s1.x;
              const dy = s2.y - s1.y;
              const len = Math.sqrt(dx * dx + dy * dy);
              const extendedX = s1.x + (dx / len) * 500;
              const extendedY = s1.y + (dy / len) * 500;

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
                    className="drop-shadow-[0_0_8px_#38bdf8]"
                  />
                  <circle cx={s2.x} cy={s2.y} r="5" fill="#38bdf8" />
                  <polygon
                    points={`${extendedX},${extendedY} ${extendedX - 12},${extendedY - 6} ${extendedX - 12},${extendedY + 6}`}
                    fill="#38bdf8"
                  />
                </g>
              );
            } else if (currentLevel.conceptType === 'line') {
              const dx = s2.x - s1.x;
              const dy = s2.y - s1.y;
              const len = Math.sqrt(dx * dx + dy * dy);
              const ext1X = s1.x - (dx / len) * 200;
              const ext1Y = s1.y - (dy / len) * 200;
              const ext2X = s2.x + (dx / len) * 200;
              const ext2Y = s2.y + (dy / len) * 200;

              return (
                <g key={idx}>
                  <line
                    x1={ext1X}
                    y1={ext1Y}
                    x2={ext2X}
                    y2={ext2Y}
                    stroke="#a855f7"
                    strokeWidth="3"
                    className="drop-shadow-[0_0_8px_#a855f7]"
                  />
                  <text x={(s1.x + s2.x) / 2} y={(s1.y + s2.y) / 2 - 10} fill="#c084fc" fontSize="11" fontWeight="bold">
                    d Doğrusu (Sınırsız)
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
                    className="drop-shadow-[0_0_8px_#f59e0b]"
                  />
                  <text
                    x={(s1.x + s2.x) / 2}
                    y={(s1.y + s2.y) / 2 - 8}
                    fill="#fef08a"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    [{s1.id}{s2.id}]
                  </text>
                </g>
              );
            }
          })}

          {currentLevel.stars.map(star => {
            const isSelected = selectedStartStar === star.id;
            return (
              <g
                key={star.id}
                onClick={() => handleStarClick(star.id)}
                className="cursor-pointer group"
                transform={`translate(${star.x}, ${star.y})`}
              >
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 18 : 12}
                  fill={isSelected ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.15)'}
                  className={isSelected ? 'animate-ping' : 'group-hover:scale-125 transition-all'}
                />
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 8 : 6}
                  fill={star.id === 'P' ? '#facc15' : '#ffffff'}
                  stroke={isSelected ? '#38bdf8' : '#6366f1'}
                  strokeWidth="2.5"
                />
                <text
                  x="0"
                  y="22"
                  textAnchor="middle"
                  fill={star.id === 'P' ? '#fde047' : '#e2e8f0'}
                  fontSize="11"
                  fontWeight="900"
                  className="select-none pointer-events-none drop-shadow-md"
                >
                  {star.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Bottom Helper Bar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="text-slate-400">
            {selectedStartStar ? (
              <span className="text-sky-300 font-bold animate-pulse">
                ★ Başlangıç noktası seçildi: <strong className="text-white">{selectedStartStar}</strong>. Şimdi bağlanacak 2. yıldıza tıklayın.
              </span>
            ) : (
              <span>Bağlantı kurmak için bir yıldıza tıklayınız.</span>
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
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
              }`}
            >
              <span>{levelIdx === SKY_LEVELS.length - 1 ? 'Rotayı Tamamla ⛵' : 'Sonraki Yıldız Haritası'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Completion */}
      {isCompleted && (
        <div className="bg-indigo-950/90 border-2 border-indigo-500 p-6 rounded-3xl text-center space-y-4 animate-in zoom-in duration-300">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
          <h3 className="text-2xl font-black text-white">Gece Seyrüseferi Başarıyla Tamamlandı!</h3>
          <p className="text-sm text-indigo-200 max-w-lg mx-auto">
            Işın ([PA&gt;), Doğru Parçası ([AB]) ve Doğru (d) kavramlarını gökyüzünde kusursuz haritalandırıp gemiyi limana ulaştırdınız (+100 XP).
          </p>
          <button
            onClick={() => {
              setLevelIdx(0);
              setDrawnConnections([]);
              setIsCompleted(false);
            }}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Yeniden Keşfe Çık
          </button>
        </div>
      )}
    </div>
  );
}

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
  testedAngleOptions: { angle: number; label: string; lengthMeters: number; footPos: { x: number; y: number } }[];
}

const BRIDGE_LEVELS: BridgeLevel[] = [
  {
    id: 1,
    title: '1. Parkur: Düz Vadi Nehri (Yatay Kıyı)',
    sub: 'Kaleden (P) nehir doğrusuna (d) farklı açılarla halat çek; mesafeleri ölç ve EN KISA yolun 90° dikme olduğunu kanıtla!',
    towerPos: { x: 290, y: 70 },
    shoreLine: { x1: 50, y1: 270, x2: 530, y2: 270 },
    shortestFootPos: { x: 290, y: 270 },
    testedAngleOptions: [
      { angle: 30, label: '30° Eğik Halat', lengthMeters: 200, footPos: { x: 130, y: 270 } },
      { angle: 60, label: '60° Eğik Halat', lengthMeters: 135, footPos: { x: 200, y: 270 } },
      { angle: 90, label: '90° Tam Dikme (⊥)', lengthMeters: 100, footPos: { x: 290, y: 270 } },
      { angle: 120, label: '120° Eğik Halat', lengthMeters: 145, footPos: { x: 390, y: 270 } },
      { angle: 150, label: '150° Eğik Halat', lengthMeters: 215, footPos: { x: 470, y: 270 } }
    ]
  },
  {
    id: 2,
    title: '2. Parkur: Kanyon Eğimli Kıyısı (35° Açılı Nehir)',
    sub: 'Akan nehir eğik bir hat çiziyor. Gönyeyi kıyıya yaslayarak P noktasından 90° dikme köprüsünü indir!',
    towerPos: { x: 420, y: 80 },
    shoreLine: { x1: 60, y1: 340, x2: 520, y2: 120 },
    shortestFootPos: { x: 300, y: 220 },
    testedAngleOptions: [
      { angle: 45, label: '45° Eğik Halat', lengthMeters: 165, footPos: { x: 180, y: 280 } },
      { angle: 90, label: '90° Dikme Köprüsü (d ⊥ k)', lengthMeters: 110, footPos: { x: 300, y: 220 } },
      { angle: 135, label: '135° Eğik Halat', lengthMeters: 180, footPos: { x: 440, y: 155 } }
    ]
  }
];

export function ShortestPathBridgeGame({ onComplete }: { onComplete?: () => void }) {
  const { addPoints, unlockBadge } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [levelIdx, setLevelIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isBridgeConstructed, setIsBridgeConstructed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentLevel = BRIDGE_LEVELS[levelIdx];

  const handleSelectOption = (idx: number) => {
    synth.playClick();
    setSelectedOptionIdx(idx);
    const opt = currentLevel.testedAngleOptions[idx];

    if (opt.angle === 90) {
      synth.playBridgeSnap();
      setIsBridgeConstructed(true);
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      setIsBridgeConstructed(false);
    }
  };

  const handleNextLevel = () => {
    if (levelIdx < BRIDGE_LEVELS.length - 1) {
      synth.playSuccess();
      setLevelIdx(prev => prev + 1);
      setSelectedOptionIdx(null);
      setIsBridgeConstructed(false);
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

  return (
    <div className="bg-slate-950 border border-emerald-500/30 rounded-3xl p-6 text-white shadow-2xl space-y-6">
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
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300">
                Maarif SB2.3 Dikme (⊥) Kanıtı
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Bir doğruya dışındaki noktadan inilebilecek EN KISA doğru parçasının DİKME olduğunu kanıtla!
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
        <div className="text-xs font-mono bg-emerald-950/40 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          📐 Kural: [PH] ⊥ d ise |PH| minimumdur
        </div>
      </div>

      {/* River Simulation Canvas */}
      <div className="relative bg-slate-950 border-2 border-emerald-950 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[380px] shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#022c22,#0f172a)] opacity-60 pointer-events-none" />

        <svg className="w-full max-w-[580px] h-[340px] drop-shadow-2xl" viewBox="0 0 580 340">
          <path
            d="M 20 280 Q 150 260 300 280 T 560 280"
            fill="none"
            stroke="#0284c7"
            strokeWidth="20"
            opacity="0.35"
          />
          <path
            d="M 20 295 Q 150 275 300 295 T 560 295"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="10"
            opacity="0.4"
          />

          <line
            x1={currentLevel.shoreLine.x1}
            y1={currentLevel.shoreLine.y1}
            x2={currentLevel.shoreLine.x2}
            y2={currentLevel.shoreLine.y2}
            stroke="#10b981"
            strokeWidth="4"
          />
          <text
            x={currentLevel.shoreLine.x2 - 40}
            y={currentLevel.shoreLine.y2 - 12}
            fill="#34d399"
            fontSize="12"
            fontWeight="bold"
          >
            d Doğrusu (Nehir Kıyı Hattı)
          </text>

          {/* Tower Fortress at Point P */}
          <g transform={`translate(${currentLevel.towerPos.x}, ${currentLevel.towerPos.y})`}>
            <polygon points="-20,20 20,20 15,-20 -15,-20" fill="#334155" stroke="#e2e8f0" strokeWidth="2" />
            <rect x="-6" y="-8" width="12" height="16" fill="#0f172a" />
            <circle cx="0" cy="-24" r="8" fill="#f59e0b" className="animate-pulse" />
            <text x="0" y="-36" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="900">
              P Kalesi (Dış Nokta)
            </text>
          </g>

          {/* Render All Tested Options or Selected Option */}
          {currentLevel.testedAngleOptions.map((opt, idx) => {
            const isSelected = selectedOptionIdx === idx;
            const is90 = opt.angle === 90;

            return (
              <g key={idx} className="transition-all duration-300">
                <line
                  x1={currentLevel.towerPos.x}
                  y1={currentLevel.towerPos.y + 20}
                  x2={opt.footPos.x}
                  y2={opt.footPos.y}
                  stroke={isSelected ? (is90 ? '#10b981' : '#f59e0b') : '#475569'}
                  strokeWidth={isSelected ? (is90 ? '6' : '3') : '1.5'}
                  strokeDasharray={isSelected && is90 ? 'none' : '4 4'}
                  className={isSelected ? (is90 ? 'drop-shadow-[0_0_12px_#10b981]' : '') : ''}
                />

                <circle
                  cx={opt.footPos.x}
                  cy={opt.footPos.y}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? (is90 ? '#34d399' : '#f59e0b') : '#94a3b8'}
                />

                {isSelected && is90 && (
                  <g>
                    <rect
                      x={opt.footPos.x - 14}
                      y={opt.footPos.y - 14}
                      width="14"
                      height="14"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />
                    <circle cx={opt.footPos.x - 7} cy={opt.footPos.y - 7} r="2" fill="#10b981" />
                    <text
                      x={opt.footPos.x}
                      y={opt.footPos.y + 24}
                      textAnchor="middle"
                      fill="#34d399"
                      fontSize="11"
                      fontWeight="black"
                    >
                      H (Dikme Ayağı) • 90°
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Live Laser Rangefinder Telemetry Box */}
        {selectedOptionIdx !== null && (
          <div className="absolute top-4 right-4 bg-slate-900/90 border border-emerald-500/50 p-3.5 rounded-2xl text-xs space-y-1.5 backdrop-blur-md shadow-xl">
            <div className="text-[10px] uppercase font-bold text-slate-400">Lazer Telemetre Ölçümü:</div>
            <div className="text-base font-black text-white flex items-center gap-2">
              <span className="text-emerald-400">{currentLevel.testedAngleOptions[selectedOptionIdx].label}</span>
            </div>
            <div className="text-xs font-mono">
              Köprü Mesafesi:{' '}
              <strong className={currentLevel.testedAngleOptions[selectedOptionIdx].angle === 90 ? 'text-emerald-300 text-sm font-black' : 'text-amber-300'}>
                {currentLevel.testedAngleOptions[selectedOptionIdx].lengthMeters} Metre
              </strong>
            </div>
            <div className="text-[11px] text-slate-300">
              {currentLevel.testedAngleOptions[selectedOptionIdx].angle === 90 ? (
                <span className="text-emerald-400 font-bold">✓ KANITLANDI: EN KISA MESAFE (DİKME)</span>
              ) : (
                <span className="text-amber-400">⚠️ Eğik çizgi hipotenüstür, dikmeden uzundur!</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Options Selection Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {currentLevel.testedAngleOptions.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectOption(idx)}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              selectedOptionIdx === idx
                ? opt.angle === 90
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20 scale-105'
                  : 'bg-amber-500/20 border-amber-400 text-amber-300 scale-105'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{opt.label}</span>
            <span className="font-mono text-[11px] opacity-80">{opt.lengthMeters} m</span>
          </button>
        ))}
      </div>

      {/* Next Level Action */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleNextLevel}
          disabled={!isBridgeConstructed}
          className={`px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
            isBridgeConstructed
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          <span>{levelIdx === BRIDGE_LEVELS.length - 1 ? 'Köprü İnşasını Tamamla 🌉' : 'Sonraki Parkur'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
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
              setSelectedOptionIdx(null);
              setIsBridgeConstructed(false);
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
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300">
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
                <circle cx="0" cy="0" r="12" fill="rgba(239, 68, 68, 0.3)" className="animate-ping" />
                <circle cx="0" cy="0" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
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
