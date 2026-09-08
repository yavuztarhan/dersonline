'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Compass,
  Ruler,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Play,
  Scale,
  Award,
  ChevronRight,
  Train,
  Check,
  HelpCircle,
  Flame
} from 'lucide-react';

interface ConstructionDeductionGameProps {
  onGameComplete?: (score: number) => void;
  onBackToMenu?: () => void;
}

type TaskId = 1 | 2 | 3;

interface BalanceStatement {
  id: number;
  statement: string;
  isCorrect: boolean;
  explanation: string;
  toolHint: string;
}

const BALANCE_STATEMENTS: BalanceStatement[] = [
  {
    id: 1,
    statement: 'Bir noktadan bir doğruya 2 farklı dikme indirilebilir.',
    isCorrect: false,
    explanation: 'YANLIŞ! Bir doğruya dışındaki sabit bir noktadan yalnız ve yalnız 1 adet dikme (90°) çizilebilir.',
    toolHint: '📐 Gönye Kuralı: Bir noktadan tabana sadece tek bir dik açı inebilir.'
  },
  {
    id: 2,
    statement: 'Bir doğruya eşit uzaklıktaki noktaların birleşimi paralel bir doğru oluşturur.',
    isCorrect: true,
    explanation: 'DOĞRU! Bir taban doğrusuna dik mesafesi hep eşit (h) olan tüm noktalar birleştirildiğinde paralel bir doğru (d₁ ∥ d₂) oluşur.',
    toolHint: '🚂 Tren Rayı Kuralı: Raylar arasındaki dik mesafe her noktada sabittir.'
  },
  {
    id: 3,
    statement: 'Yarıçapları eşit iki çember birbirine eştir.',
    isCorrect: true,
    explanation: 'DOĞRU! Çemberin büyüklüğünü ve şeklini belirleyen tek ölçü yarıçapıdır (r). Yarıçapları eşit olan çemberler birbirine eşittir (C₁ ≅ C₂).',
    toolHint: '⭕ Pergel Kuralı: Pergel açıklığı aynı kaldıkça çizilen tüm çemberler eştir.'
  }
];

export function ConstructionDeductionGame({
  onGameComplete,
  onBackToMenu
}: ConstructionDeductionGameProps) {
  const { addPoints, unlockBadge } = useApp();

  const [activeTask, setActiveTask] = useState<TaskId>(1);
  const [soundMuted, setSoundMuted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [gameFinished, setGameFinished] = useState(false);

  // Audio Synthesizer for instant rich sound effects without external files
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSynthesizerSound = (
    type: 'click' | 'place' | 'draw' | 'train' | 'success' | 'wrong' | 'scale' | 'fanfare'
  ) => {
    if (soundMuted) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'place') {
        // Metallic snap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'draw') {
        // Soft pencil drawing sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.35);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'train') {
        // Train Whistle (Dual tone)
        [587.33, 739.99].forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.linearRampToValueAtTime(freq * 1.05, now + 0.6);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.7);
        });
      } else if (type === 'scale') {
        // Scale balance bell chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(783.99, now); // G5
        osc.frequency.setValueAtTime(1046.5, now + 0.12); // C6
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'success') {
        // Arpeggio
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.2, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.3);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(160, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'fanfare') {
        [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0.3, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.5);
        });
      }
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  };

  // ==========================================
  // TASK 1: KAYIP RAYI DÖŞE (GÖNYE & CETVEL)
  // ==========================================
  const [railPointsPlaced, setRailPointsPlaced] = useState<number[]>([]); // indices 0, 1, 2
  const [railLineDrawn, setRailLineDrawn] = useState(false);
  const [trainRunning, setTrainRunning] = useState(false);
  const [task1Completed, setTask1Completed] = useState(false);

  const handlePlaceRailPerpendicular = (index: number) => {
    if (railPointsPlaced.includes(index) || railLineDrawn) return;
    playSynthesizerSound('place');
    const newPlaced = [...railPointsPlaced, index];
    setRailPointsPlaced(newPlaced);

    if (newPlaced.length === 3) {
      playSynthesizerSound('scale');
    }
  };

  const handleDrawParallelRail = () => {
    if (railPointsPlaced.length < 3 || railLineDrawn) return;
    playSynthesizerSound('draw');
    setRailLineDrawn(true);

    // Auto run train after rail is drawn
    setTimeout(() => {
      runTrain();
    }, 400);
  };

  const runTrain = () => {
    playSynthesizerSound('train');
    setTrainRunning(true);

    setTimeout(() => {
      setTrainRunning(false);
      setTask1Completed(true);
      playSynthesizerSound('success');
      addPoints(40);
      setTotalScore((prev) => prev + 40);
      if (!completedTasks.includes(1)) {
        setCompletedTasks((prev) => [...prev, 1]);
      }
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 2800);
  };

  const resetTask1 = () => {
    setRailPointsPlaced([]);
    setRailLineDrawn(false);
    setTrainRunning(false);
    setTask1Completed(false);
  };

  // ==========================================
  // TASK 2: AÇI KOLLARINI DENGELE (PERGEL)
  // ==========================================
  const [compassRadius, setCompassRadius] = useState<number>(130);
  const [compassArcDrawn, setCompassArcDrawn] = useState(false);
  const [task2Completed, setTask2Completed] = useState(false);

  const TARGET_RADIUS = 130; // Ideal radius
  const isRadiusCorrect = Math.abs(compassRadius - TARGET_RADIUS) <= 8;

  const handleDrawCompassArc = () => {
    if (!isRadiusCorrect) {
      playSynthesizerSound('wrong');
      return;
    }
    playSynthesizerSound('draw');
    setCompassArcDrawn(true);

    setTimeout(() => {
      setTask2Completed(true);
      playSynthesizerSound('success');
      addPoints(40);
      setTotalScore((prev) => prev + 40);
      if (!completedTasks.includes(2)) {
        setCompletedTasks((prev) => [...prev, 2]);
      }
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 900);
  };

  const resetTask2 = () => {
    setCompassRadius(80);
    setCompassArcDrawn(false);
    setTask2Completed(false);
  };

  // ==========================================
  // TASK 3: DOĞRU / YANLIŞ ÇIKARIM TERAZİSİ
  // ==========================================
  const [currentStatementIdx, setCurrentStatementIdx] = useState(0);
  const [scaleAngle, setScaleAngle] = useState(0); // -16 (left heavy), 0 (balanced), 16 (right heavy)
  const [answeredState, setAnsweredState] = useState<'correct' | 'wrong' | null>(null);
  const [balanceScores, setBalanceScores] = useState<Record<number, boolean>>({});
  const [task3Completed, setTask3Completed] = useState(false);

  const currentStatement = BALANCE_STATEMENTS[currentStatementIdx];

  const handleBalanceAnswer = (userSaysCorrect: boolean) => {
    if (answeredState !== null) return;

    const isMatch = userSaysCorrect === currentStatement.isCorrect;

    if (isMatch) {
      playSynthesizerSound('scale');
      setScaleAngle(0); // Perfect balance
      setAnsweredState('correct');
      setBalanceScores((prev) => ({ ...prev, [currentStatement.id]: true }));
      addPoints(20);
      setTotalScore((prev) => prev + 20);
    } else {
      playSynthesizerSound('wrong');
      // Tilt scale away from balance
      setScaleAngle(userSaysCorrect ? 16 : -16);
      setAnsweredState('wrong');
    }
  };

  const handleNextStatement = () => {
    setAnsweredState(null);
    setScaleAngle(0);

    if (currentStatementIdx < BALANCE_STATEMENTS.length - 1) {
      setCurrentStatementIdx((prev) => prev + 1);
    } else {
      // All 3 statements complete!
      setTask3Completed(true);
      setGameFinished(true);
      playSynthesizerSound('fanfare');
      unlockBadge('geometrik-insaat-ustasi');
      addPoints(50);
      setTotalScore((prev) => prev + 50);
      if (!completedTasks.includes(3)) {
        setCompletedTasks((prev) => [...prev, 3]);
      }
      try {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 }
        });
      } catch (e) {}

      if (onGameComplete) {
        onGameComplete(totalScore + 50);
      }
    }
  };

  const resetTask3 = () => {
    setCurrentStatementIdx(0);
    setScaleAngle(0);
    setAnsweredState(null);
    setBalanceScores({});
    setTask3Completed(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER & CONTROLS */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-teal-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
              MAT.5.3.2 Özel Atölye
            </span>
            <span className="text-xs text-slate-400">Adım Adım İnşa & Çıkarım</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <span>Adım Adım İnşa Oyunu ve Çıkarım Kartları</span>
            <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Ölçüsüz cetvel, pergel ve gönye ile 3 kritik geometrik görevi tamamla, çıkarım terazisini dengele!
          </p>
        </div>

        {/* Action badges & sound toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700/60">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Toplam Puan</div>
              <div className="text-base font-black text-amber-300">+{totalScore} XP</div>
            </div>
          </div>

          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title={soundMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {onBackToMenu && (
            <button
              onClick={onBackToMenu}
              className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Menüye Dön</span>
            </button>
          )}
        </div>
      </div>

      {/* TASK NAVIGATION TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            id: 1,
            title: '1. Görev: Kayıp Rayı Döşe',
            desc: 'Gönye & Cetvelle Paralel Ray',
            icon: <Train className="w-4 h-4" />,
            isDone: completedTasks.includes(1)
          },
          {
            id: 2,
            title: '2. Görev: Açı Kollarını Dengele',
            desc: 'Pergel ile Eşit Parça Kesme',
            icon: <Compass className="w-4 h-4" />,
            isDone: completedTasks.includes(2)
          },
          {
            id: 3,
            title: '3. Görev: Çıkarım Terazisi',
            desc: 'Doğru / Yanlış Aksiyom Terazisi',
            icon: <Scale className="w-4 h-4" />,
            isDone: completedTasks.includes(3)
          }
        ].map((t) => {
          const isActive = activeTask === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                playSynthesizerSound('click');
                setActiveTask(t.id as TaskId);
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
                isActive
                  ? 'bg-teal-50/90 border-teal-600 ring-2 ring-teal-400/50 shadow-md scale-101'
                  : t.isDone
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
                  <span className={isActive ? 'text-teal-700' : 'text-slate-600'}>{t.icon}</span>
                  <span>{t.title}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">{t.desc}</div>
              </div>
              {t.isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                  {t.id}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TASK 1: KAYIP RAYI DÖŞE (GÖNYE & CETVELLE PARALEL RAY İNŞASI) */}
      {/* ========================================================================= */}
      {activeTask === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          {/* Task Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black uppercase mb-1">
                <Train className="w-3.5 h-3.5 text-amber-600" />
                <span>Görev 1: Kayıp Rayı Döşe (Paralel Ray İnşası)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Gönye ve Cetvel ile Bozuk Tren Yolunu Onar
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                Bozuk bir tren yolunun alt rayı (<span className="font-mono font-bold text-teal-700">d₁</span>) verilmiştir.
                Gönyeyi taban noktalarına yerleştirerek eşit dikmeler (<span className="font-bold text-amber-700">h = 60 px / 10 cm</span>) çıkar ve tepe noktalarından cetvelle geçerek paralel rayı (<span className="font-mono font-bold text-teal-700">d₂ ∥ d₁</span>) tamamla!
              </p>
            </div>

            <button
              onClick={resetTask1}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Yeniden Başlat</span>
            </button>
          </div>

          {/* Interactive Railway Construction Canvas */}
          <div className="relative w-full bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-100/40 rounded-3xl border-2 border-slate-300/80 shadow-inner overflow-hidden min-h-[380px] p-4 flex flex-col justify-between">
            {/* Scenery Background SVGs: Mountains & Clouds */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <svg width="100%" height="100%">
                <path d="M 0 200 L 120 120 L 250 200 L 400 90 L 580 200 L 800 110 L 950 200 L 950 380 L 0 380 Z" fill="#cbd5e1" opacity="0.5" />
                <path d="M 60 220 L 220 140 L 360 220 L 520 120 L 700 220 L 880 130 L 950 220 L 950 380 L 0 380 Z" fill="#94a3b8" opacity="0.3" />
                {/* Sun */}
                <circle cx="80" cy="60" r="30" fill="#fef08a" />
              </svg>
            </div>

            {/* Instruction Banner Overlay */}
            <div className="relative z-10 flex items-center justify-between gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs max-w-xl mx-auto text-xs font-bold text-slate-800">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                  {railPointsPlaced.length < 3 ? '1' : !railLineDrawn ? '2' : '3'}
                </span>
                {railPointsPlaced.length < 3 ? (
                  <span>
                    Adım 1: Taban rayındaki <span className="text-teal-700 font-black">A, B ve C</span> noktalarına tıklayarak gönyeyle dikmeler çıkar! ({railPointsPlaced.length}/3)
                  </span>
                ) : !railLineDrawn ? (
                  <span>
                    Adım 2: Harika! Şimdi <span className="text-amber-700 font-black">Ölçüsüz Cetvel ile Tepe Noktalarını Birleştir</span> butonuna basarak paralel rayı çek!
                  </span>
                ) : (
                  <span className="text-emerald-700 font-black flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Paralel Ray İnşa Edildi (d₁ ∥ d₂)! Tren güvenle geçebilir.
                  </span>
                )}
              </span>
            </div>

            {/* Main Interactive SVG Railway Canvas */}
            <div className="relative z-10 w-full h-[260px]">
              <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="railSteel" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <linearGradient id="newRailSteel" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#0369a1" />
                  </linearGradient>
                </defs>

                {/* Ground Grass / Ballast Gravel Bed */}
                <rect x="20" y="90" width="760" height="105" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

                {/* Wooden Ties (Traversler) - only if rail line drawn or partially placed */}
                {railLineDrawn && (
                  <g className="animate-in fade-in duration-500">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <rect
                        key={`tie-${i}`}
                        x={40 + i * 31}
                        y={110}
                        width="8"
                        height="65"
                        rx="2"
                        fill="#78350f"
                        stroke="#451a03"
                        strokeWidth="1"
                      />
                    ))}
                  </g>
                )}

                {/* Base Rail Line (d1) at y = 175 */}
                <line x1="20" y1="175" x2="780" y2="175" stroke="url(#railSteel)" strokeWidth="8" strokeLinecap="round" />
                <text x="740" y="195" fill="#334155" fontSize="13" fontWeight="900" fontFamily="sans-serif">
                  d₁ (Taban Rayı)
                </text>

                {/* 3 Interactive Base Points: A(180, 175), B(400, 175), C(620, 175) */}
                {[
                  { index: 0, x: 180, label: 'A', topLabel: "A'" },
                  { index: 1, x: 400, label: 'B', topLabel: "B'" },
                  { index: 2, x: 620, label: 'C', topLabel: "C'" }
                ].map((pt) => {
                  const isPlaced = railPointsPlaced.includes(pt.index);
                  const topY = 115;
                  const baseY = 175;

                  return (
                    <g key={pt.index} className="cursor-pointer">
                      {/* If placed: Draw Gönye (Set Square) & Perpendicular Line */}
                      {isPlaced && (
                        <g className="animate-in zoom-in duration-300">
                          {/* Virtual Set Square (Gönye) Shape at base point */}
                          <polygon
                            points={`${pt.x - 30},${baseY} ${pt.x},${baseY} ${pt.x},${topY - 10}`}
                            fill="rgba(20, 184, 166, 0.25)"
                            stroke="#0d9488"
                            strokeWidth="2"
                            strokeDasharray="3 2"
                          />
                          {/* 90 degree right angle symbol */}
                          <rect x={pt.x - 12} y={baseY - 12} width="12" height="12" fill="none" stroke="#0f766e" strokeWidth="2" />
                          <circle cx={pt.x - 6} cy={baseY - 6} r="1.5" fill="#0f766e" />

                          {/* Perpendicular Line (h = 60 px) */}
                          <line
                            x1={pt.x}
                            y1={baseY}
                            x2={pt.x}
                            y2={topY}
                            stroke="#f59e0b"
                            strokeWidth="3"
                            strokeDasharray="4 3"
                          />
                          {/* Distance label */}
                          <rect x={pt.x + 6} y={(baseY + topY) / 2 - 10} width="60" height="18" rx="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="1" />
                          <text x={pt.x + 12} y={(baseY + topY) / 2 + 3} fill="#b45309" fontSize="10" fontWeight="900">
                            h = 10 cm
                          </text>

                          {/* Top Point Marker (A', B', C') */}
                          <circle cx={pt.x} cy={topY} r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                          <text x={pt.x - 8} y={topY - 10} fill="#0369a1" fontSize="12" fontWeight="900">
                            {pt.topLabel}
                          </text>
                        </g>
                      )}

                      {/* Clickable Target Button at Base Point */}
                      <g onClick={() => handlePlaceRailPerpendicular(pt.index)}>
                        <circle
                          cx={pt.x}
                          cy={baseY}
                          r={isPlaced ? 5 : 12}
                          fill={isPlaced ? '#0f766e' : '#f59e0b'}
                          stroke="#ffffff"
                          strokeWidth="2"
                          className={!isPlaced ? 'animate-bounce' : ''}
                        />
                        <text x={pt.x - 5} y={baseY + 20} fill="#1e293b" fontSize="12" fontWeight="900">
                          {pt.label}
                        </text>
                        {!isPlaced && (
                          <text x={pt.x - 22} y={baseY - 18} fill="#b45309" fontSize="10" fontWeight="bold">
                            📐 Gönye Koy
                          </text>
                        )}
                      </g>
                    </g>
                  );
                })}

                {/* Top Parallel Rail Line (d2) at y = 115 */}
                {railLineDrawn && (
                  <g className="animate-in slide-in-from-left duration-700">
                    <line x1="20" y1="115" x2="780" y2="115" stroke="url(#newRailSteel)" strokeWidth="8" strokeLinecap="round" />
                    <text x="740" y="105" fill="#0284c7" fontSize="13" fontWeight="900" fontFamily="sans-serif">
                      d₂ (Paralel Ray)
                    </text>
                    {/* Parallel symbol marker */}
                    <text x="390" y="95" fill="#0f766e" fontSize="13" fontWeight="900">
                      d₁ ∥ d₂ (Sabit 10 cm)
                    </text>
                  </g>
                )}

                {/* Animated Steam Train 🚂 */}
                {trainRunning && (
                  <g className="animate-train-drive">
                    {/* Steam Puffs */}
                    <circle cx="210" cy="55" r="10" fill="#ffffff" opacity="0.8" className="animate-ping" />
                    <circle cx="180" cy="45" r="14" fill="#ffffff" opacity="0.6" />
                    <circle cx="150" cy="35" r="18" fill="#ffffff" opacity="0.4" />

                    {/* Locomotive Body (Between y = 100 and 175) */}
                    <rect x="230" y="70" width="130" height="70" rx="8" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
                    <rect x="310" y="50" width="70" height="90" rx="6" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="2" />
                    {/* Cabin Window */}
                    <rect x="330" y="65" width="35" height="30" rx="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
                    {/* Chimney */}
                    <rect x="250" y="45" width="20" height="30" rx="2" fill="#1e293b" />
                    {/* Headlight */}
                    <circle cx="230" cy="115" r="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                    <polygon points="230,115 120,80 120,150" fill="rgba(254, 240, 138, 0.3)" />

                    {/* Rolling Wheels */}
                    <circle cx="260" cy="145" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="4" />
                    <circle cx="300" cy="145" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="4" />
                    <circle cx="350" cy="145" r="18" fill="#1e293b" stroke="#64748b" strokeWidth="4" />

                    {/* Passenger Wagon */}
                    <rect x="390" y="75" width="110" height="65" rx="6" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
                    <rect x="405" y="88" width="22" height="20" rx="2" fill="#bae6fd" />
                    <rect x="435" y="88" width="22" height="20" rx="2" fill="#bae6fd" />
                    <rect x="465" y="88" width="22" height="20" rx="2" fill="#bae6fd" />
                    <circle cx="415" cy="145" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
                    <circle cx="475" cy="145" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
                  </g>
                )}
              </svg>
            </div>

            {/* Task 1 Action Buttons */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Dikme Durumu:</span>
                <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 font-extrabold text-xs">
                  {railPointsPlaced.length} / 3 Nokta Belirlendi
                </span>
              </div>

              <div className="flex items-center gap-2">
                {railPointsPlaced.length === 3 && !railLineDrawn && (
                  <button
                    onClick={handleDrawParallelRail}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95 animate-bounce"
                  >
                    <Ruler className="w-4 h-4" />
                    <span>Ölçüsüz Cetvel ile Paralel Rayı Çek! 📏</span>
                  </button>
                )}

                {railLineDrawn && !trainRunning && (
                  <button
                    onClick={runTrain}
                    className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Treni Yeniden Sür 🚂</span>
                  </button>
                )}

                {task1Completed && (
                  <button
                    onClick={() => {
                      playSynthesizerSound('click');
                      setActiveTask(2);
                    }}
                    className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span>2. Göreve İlerle (Açı Kolları)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Pedagogy Takeaway Box */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-teal-900 leading-relaxed">
              <span className="font-extrabold">Geometrik Çıkarım: </span>
              Bir taban doğrusuna gönye yardımıyla eşit dik uzaklıktaki (<span className="font-bold">h = 10 cm</span>) noktalar belirlenip cetvelle birleştirildiğinde oluşan yeni doğru, taban doğrusuna <span className="font-black underline">paraleldir (d₁ ∥ d₂)</span> ve raylar boyunca mesafe hep sabittir!
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TASK 2: AÇI KOLLARINI DENGELE (PERGEL İLE EŞİT PARÇA KESİMİ) */}
      {/* ========================================================================= */}
      {activeTask === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          {/* Task Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-black uppercase mb-1">
                <Compass className="w-3.5 h-3.5 text-cyan-600" />
                <span>Görev 2: Açı Kollarını Dengele (Pergel ile Eşit Parça Kesme)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Açının Kollarından Eşit Uzunlukta Parçalar Kes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                Pergelin sivri iğnesini açının köşesine (<span className="font-mono font-bold text-teal-700">O</span>) batır. Pergel açıklığını ayarlayarak her iki koldaki hedef kristal halkalarını (<span className="font-mono font-bold text-amber-700">A ve B</span>) aynı yay ile kes ve eşitle (<span className="font-bold text-teal-700">|OA| = |OB|</span>)!
              </p>
            </div>

            <button
              onClick={resetTask2}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Yeniden Başlat</span>
            </button>
          </div>

          {/* Interactive Compass Angle Canvas */}
          <div className="relative w-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-3xl border-2 border-indigo-900/60 shadow-inner overflow-hidden min-h-[380px] p-4 flex flex-col justify-between text-white">
            {/* Instruction Overlay */}
            <div className="relative z-10 flex items-center justify-between gap-2 bg-slate-800/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 max-w-xl mx-auto text-xs font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                {!compassArcDrawn ? (
                  <span>
                    Aşağıdaki pergel kaydırıcısını hareket ettirerek yarıçapı hedefe (<span className="text-cyan-300 font-black">r = 130 mm</span>) ayarla ve yayı çiz!
                  </span>
                ) : (
                  <span className="text-emerald-300 font-black flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Harika İnşa! Açının her iki kolundan eşit uzunluk (|OA| = |OB| = 130 mm) kesildi.
                  </span>
                )}
              </span>
            </div>

            {/* Main Interactive SVG Angle & Compass Canvas */}
            <div className="relative z-10 w-full h-[260px]">
              <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Grid guidelines */}
                <circle cx="200" cy="180" r="60" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="200" cy="180" r="130" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="200" cy="180" r="180" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

                {/* Angle Ray Arms from Origin O(200, 180) */}
                {/* Arm 1 (OA) at angle -10 deg */}
                <line x1="200" y1="180" x2="520" y2="125" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                <polygon points="530,123 515,115 518,132" fill="#94a3b8" />
                <text x="540" y="130" fill="#cbd5e1" fontSize="13" fontWeight="900">
                  Kol 1 [OA)
                </text>

                {/* Arm 2 (OB) at angle -65 deg */}
                <line x1="200" y1="180" x2="350" y2="20" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                <polygon points="355,14 340,24 353,35" fill="#94a3b8" />
                <text x="360" y="22" fill="#cbd5e1" fontSize="13" fontWeight="900">
                  Kol 2 [OB)
                </text>

                {/* Vertex Point O (200, 180) */}
                <circle cx="200" cy="180" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                <text x="175" y="195" fill="#38bdf8" fontSize="14" fontWeight="900">
                  O (Köşe)
                </text>

                {/* Target Nodes on Arms at Target Radius = 130 */}
                {/* Point A on Arm 1: (200 + 130*cos(-10°), 180 + 130*sin(-10°)) = (328, 157) */}
                <g>
                  <circle cx="328" cy="157" r={isRadiusCorrect ? 14 : 9} fill={compassArcDrawn ? '#10b981' : 'url(#targetGlow)'} stroke="#38bdf8" strokeWidth="2" className={!compassArcDrawn ? 'animate-pulse' : ''} />
                  <circle cx="328" cy="157" r="4" fill="#ffffff" />
                  <text x="338" y="175" fill="#7dd3fc" fontSize="12" fontWeight="900">
                    A (|OA| = {TARGET_RADIUS}mm)
                  </text>
                </g>

                {/* Point B on Arm 2: (200 + 130*cos(-65°), 180 + 130*sin(-65°)) = (255, 62) */}
                <g>
                  <circle cx="255" cy="62" r={isRadiusCorrect ? 14 : 9} fill={compassArcDrawn ? '#10b981' : 'url(#targetGlow)'} stroke="#38bdf8" strokeWidth="2" className={!compassArcDrawn ? 'animate-pulse' : ''} />
                  <circle cx="255" cy="62" r="4" fill="#ffffff" />
                  <text x="210" y="55" fill="#7dd3fc" fontSize="12" fontWeight="900">
                    B (|OB| = {TARGET_RADIUS}mm)
                  </text>
                </g>

                {/* Current Active Compass Arc */}
                {/* Arc from -80° to +5° */}
                <path
                  d={`M ${200 + compassRadius * Math.cos((-75 * Math.PI) / 180)} ${
                    180 + compassRadius * Math.sin((-75 * Math.PI) / 180)
                  } A ${compassRadius} ${compassRadius} 0 0 1 ${
                    200 + compassRadius * Math.cos((0 * Math.PI) / 180)
                  } ${180 + compassRadius * Math.sin((0 * Math.PI) / 180)}`}
                  fill="none"
                  stroke={compassArcDrawn ? '#10b981' : isRadiusCorrect ? '#38bdf8' : '#f59e0b'}
                  strokeWidth={compassArcDrawn ? 4 : 2.5}
                  strokeDasharray={compassArcDrawn ? 'none' : '5 4'}
                />

                {/* Virtual Compass Instrument Overlay */}
                <g className="transition-all duration-150">
                  {/* Compass Needle Leg at O */}
                  <line x1="200" y1="180" x2="200" y2="100" stroke="#cbd5e1" strokeWidth="3" />
                  {/* Compass Pencil Leg to current radius */}
                  <line
                    x1="200"
                    y1="100"
                    x2={200 + compassRadius * Math.cos((-40 * Math.PI) / 180)}
                    y2={180 + compassRadius * Math.sin((-40 * Math.PI) / 180)}
                    stroke="#38bdf8"
                    strokeWidth="3"
                  />
                  {/* Compass Hinge Joint */}
                  <circle cx="200" cy="100" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                  {/* Pencil Tip */}
                  <circle
                    cx={200 + compassRadius * Math.cos((-40 * Math.PI) / 180)}
                    cy={180 + compassRadius * Math.sin((-40 * Math.PI) / 180)}
                    r="5"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>

                {/* Equal Length Tick Marks on Arms after arc drawn */}
                {compassArcDrawn && (
                  <g className="animate-in zoom-in duration-300">
                    {/* Tick on OA */}
                    <line x1="260" y1="165" x2="268" y2="173" stroke="#10b981" strokeWidth="3" />
                    <line x1="264" y1="163" x2="272" y2="171" stroke="#10b981" strokeWidth="3" />

                    {/* Tick on OB */}
                    <line x1="223" y1="117" x2="233" y2="123" stroke="#10b981" strokeWidth="3" />
                    <line x1="226" y1="113" x2="236" y2="119" stroke="#10b981" strokeWidth="3" />

                    <text x="360" y="210" fill="#34d399" fontSize="13" fontWeight="900">
                      ✓ |OA| = |OB| (Eşit Parçalar Kesildi)
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Slider & Actions for Task 2 */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              {/* Compass Radius Slider */}
              <div className="w-full sm:w-1/2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold">Pergel Açıklığı (Yarıçap r):</span>
                  <span className={`font-black font-mono px-2 py-0.5 rounded ${isRadiusCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-700 text-amber-300'}`}>
                    {compassRadius} mm {isRadiusCorrect && '🎯 (Hedefle Eşleşti!)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="190"
                  value={compassRadius}
                  disabled={compassArcDrawn}
                  onChange={(e) => {
                    playSynthesizerSound('click');
                    setCompassRadius(Number(e.target.value));
                  }}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {!compassArcDrawn ? (
                  <button
                    onClick={handleDrawCompassArc}
                    disabled={!isRadiusCorrect}
                    className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95 ${
                      isRadiusCorrect
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25 animate-pulse'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Pergel Yayını Çiz & Hedefleri Kes 📐</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      playSynthesizerSound('click');
                      setActiveTask(3);
                    }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span>3. Göreve İlerle (Çıkarım Terazisi)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Pedagogy Takeaway Box */}
          <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-cyan-900 leading-relaxed">
              <span className="font-extrabold">Geometrik Çıkarım: </span>
              Pergelin sivri ucu açının köşesine batırılıp kolları kesecek bir çember yayı çizildiğinde, açının kollarından köşe noktasına göre <span className="font-black underline">daima eşit uzunlukta doğru parçaları (|OA| = |OB|)</span> kesilmiş olur.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TASK 3: DOĞRU / YANLIŞ ÇIKARIM TERAZİSİ */}
      {/* ========================================================================= */}
      {activeTask === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          {/* Task Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-black uppercase mb-1">
                <Scale className="w-3.5 h-3.5 text-purple-600" />
                <span>Görev 3: Geometrik Çıkarım Terazisi</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Doğru / Yanlış Çıkarım Terazisi
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                Aşağıdaki aksiyomatik geometrik önermeleri değerlendir. Doğru kararlar vererek teraziyi kusursuz yatay dengeye ulaştır!
              </p>
            </div>

            <button
              onClick={resetTask3}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Yeniden Başlat</span>
            </button>
          </div>

          {/* Interactive Balance Scale Graphic */}
          <div className="relative w-full bg-gradient-to-b from-purple-50/70 via-indigo-50/40 to-slate-50 rounded-3xl border-2 border-purple-200/80 p-6 flex flex-col items-center justify-center min-h-[220px]">
            <div className="w-full max-w-md h-[150px]">
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid meet">
                {/* Central Fulcrum Stand */}
                <polygon points="190,140 210,140 203,75 197,75" fill="#334155" />
                <rect x="180" y="138" width="40" height="8" rx="2" fill="#1e293b" />
                <circle cx="200" cy="75" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />

                {/* Rotating Beam with scaleAngle */}
                <g
                  style={{
                    transform: `rotate(${scaleAngle}deg)`,
                    transformOrigin: '200px 75px',
                    transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  {/* Beam */}
                  <line x1="70" y1="75" x2="330" y2="75" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="70" cy="75" r="4" fill="#334155" />
                  <circle cx="330" cy="75" r="4" fill="#334155" />

                  {/* Left Pan (Yanlış / Taş Kefesi) */}
                  <line x1="70" y1="75" x2="50" y2="110" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="70" y1="75" x2="90" y2="110" stroke="#94a3b8" strokeWidth="1.5" />
                  <path d="M 45 110 Q 70 125 95 110 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
                  {scaleAngle < 0 && (
                    <circle cx="70" cy="106" r="8" fill="#f43f5e" className="animate-bounce" />
                  )}

                  {/* Right Pan (Doğru / Altın Kefesi) */}
                  <line x1="330" y1="75" x2="310" y2="110" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="330" y1="75" x2="350" y2="110" stroke="#94a3b8" strokeWidth="1.5" />
                  <path d="M 305 110 Q 330 125 355 110 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                  {scaleAngle === 0 && (
                    <circle cx="330" cy="104" r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  )}
                  {scaleAngle > 0 && (
                    <circle cx="330" cy="106" r="8" fill="#f43f5e" className="animate-bounce" />
                  )}
                </g>

                {/* Equilibrium indicator light */}
                <circle
                  cx="200"
                  cy="45"
                  r="6"
                  fill={scaleAngle === 0 && answeredState === 'correct' ? '#10b981' : '#94a3b8'}
                  className={scaleAngle === 0 && answeredState === 'correct' ? 'animate-ping' : ''}
                />
              </svg>
            </div>

            {/* Balance Status Indicator */}
            <div className="text-xs font-black uppercase tracking-wider mt-1">
              {answeredState === 'correct' ? (
                <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  ⚖️ Terazi Mükemmel Dengede! (Aksiyom Doğrulandı)
                </span>
              ) : answeredState === 'wrong' ? (
                <span className="text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
                  ⚠️ Terazi Dengesi Bozuldu! Tekrar Değerlendir.
                </span>
              ) : (
                <span className="text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  Önerme {currentStatementIdx + 1} / {BALANCE_STATEMENTS.length}
                </span>
              )}
            </div>
          </div>

          {/* Statement Card */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white border-2 border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider text-purple-400">
                Çıkarım Kartı #{currentStatement.id}
              </span>
              <span className="text-slate-400">{currentStatement.toolHint}</span>
            </div>

            {/* Statement Text */}
            <blockquote className="text-lg sm:text-xl font-black text-amber-300 border-l-4 border-amber-400 pl-4 py-1 leading-snug">
              "{currentStatement.statement}"
            </blockquote>

            {/* Answer Buttons */}
            {answeredState === null && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => handleBalanceAnswer(true)}
                  className="py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Check className="w-5 h-5" />
                  <span>DOĞRU</span>
                </button>

                <button
                  onClick={() => handleBalanceAnswer(false)}
                  className="py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm sm:text-base shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <XCircle className="w-5 h-5" />
                  <span>YANLIŞ</span>
                </button>
              </div>
            )}

            {/* Feedback & Pedagogical Explanation */}
            {answeredState !== null && (
              <div
                className={`p-4 rounded-2xl border ${
                  answeredState === 'correct'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-500 text-rose-200'
                } space-y-3 animate-in zoom-in duration-200`}
              >
                <div className="flex items-center gap-2 font-black text-sm">
                  {answeredState === 'correct' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Tebrikler! Doğru Değerlendirme (+20 XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>Dikkat! Çıkarımı Yeniden İncele:</span>
                    </>
                  )}
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-200 font-medium">
                  {currentStatement.explanation}
                </p>

                <div className="flex justify-end pt-1">
                  {answeredState === 'correct' ? (
                    <button
                      onClick={handleNextStatement}
                      className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-slate-100 transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <span>
                        {currentStatementIdx < BALANCE_STATEMENTS.length - 1
                          ? 'Sonraki Çıkarım Kartına Geç'
                          : 'Tüm Görevleri Tamamla! 🏆'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setAnsweredState(null)}
                      className="px-4 py-2 rounded-xl bg-rose-500/30 hover:bg-rose-500/40 text-rose-200 font-bold text-xs transition-colors"
                    >
                      Tekrar Dene
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Grand Completion Screen if gameFinished */}
          {gameFinished && (
            <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 animate-in zoom-in duration-300">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center text-4xl shadow-inner border border-white/30 shrink-0">
                  🏆
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-black uppercase">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>Tüm İnşa ve Çıkarım Görevleri Tamamlandı!</span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-black">
                    Usta Geometrik Mimar & Çıkarım Rozeti Kazanıldı!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">
                    Ölçüsüz cetvel, pergel ve gönye ile temel geometrik inşa kurallarını başarıyla uyguladın ve çıkarım terazisini tam dengeye ulaştırdın.
                  </p>
                </div>
              </div>

              {/* Summary of 3 master deductions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-xs space-y-1">
                  <div className="font-black text-amber-300">1. Çıkarım (Raylar & Paralellik)</div>
                  <div className="text-emerald-100">Bir doğruya eşit uzaklıktaki noktaların birleşimi paralel doğru oluşturur (d₁ ∥ d₂).</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-xs space-y-1">
                  <div className="font-black text-cyan-300">2. Çıkarım (Pergel & Kollar)</div>
                  <div className="text-emerald-100">Açının köşesine batırılan pergel kollarından eşit doğru parçaları keser (|OA| = |OB|).</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-xs space-y-1">
                  <div className="font-black text-purple-300">3. Çıkarım (Dikme & Eş Çember)</div>
                  <div className="text-emerald-100">Dış noktadan yalnız 1 dikme çizilir; yarıçapları eşit çemberler eştir.</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/20">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Kazanılan Toplam Ödül: +{totalScore} XP & Altın Rozet</span>
                </div>

                {onBackToMenu && (
                  <button
                    onClick={onBackToMenu}
                    className="px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-emerald-50 font-black text-xs sm:text-sm shadow-lg transition-all active:scale-95"
                  >
                    Oyun Menüsüne Dön ↩️
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
