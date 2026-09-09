'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Compass,
  Zap,
  RotateCw,
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Flame,
  Volume2,
  VolumeX,
  RotateCcw as ResetIcon,
  Play,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Unlock,
  ShieldCheck,
  Car,
  Move,
  Sliders,
  Maximize2,
  Award,
  Layers,
  Info,
  Check,
  Shuffle
} from 'lucide-react';

interface JunctionArchitectGameProps {
  onGameComplete?: (score: number) => void;
  onBackToMenu?: () => void;
}

type ActiveTab = 'lab' | 'lock' | 'arcade';

interface LockSector {
  id: number;
  label: string;
  angleDeg: number;
  isInitialRevealed: boolean;
  isUnlocked: boolean;
  type: 'given' | 'opposite' | 'adjacent';
  relationHint: string;
}

interface ArcadePair {
  id: string;
  a: number;
  b: number;
  sum: number;
  type: 'tumler' | 'butunler';
  x: number; // 20..80 percent
  y: number; // 0..100 percent
  speed: number;
}

const TUMLER_PRESETS: Array<[number, number]> = [
  [30, 60],
  [45, 45],
  [35, 55],
  [20, 70],
  [15, 75],
  [40, 50],
  [25, 65],
  [10, 80],
  [48, 42],
  [63, 27],
  [72, 18],
  [85, 5]
];

const BUTUNLER_PRESETS: Array<[number, number]> = [
  [120, 60],
  [135, 45],
  [150, 30],
  [100, 80],
  [110, 70],
  [140, 40],
  [90, 90],
  [105, 75],
  [125, 55],
  [148, 32],
  [162, 18],
  [118, 62]
];

export function JunctionArchitectGame({ onGameComplete, onBackToMenu }: JunctionArchitectGameProps) {
  const { addPoints, unlockBadge } = useApp();

  const [activeTab, setActiveTab] = useState<ActiveTab>('lab');

  // =========================================================================
  // AUDIO SYNTHESIZER (Web Audio API)
  // =========================================================================
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [soundMuted, setSoundMuted] = useState(false);

  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSynthesizerSound = (
    type: 'laser' | 'lock_click' | 'unlock_success' | 'car_zoom' | 'bell_ding' | 'bubble_pop' | 'error' | 'fanfare' | 'snap'
  ) => {
    if (soundMuted) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'laser') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'lock_click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.setValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'unlock_success') {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.25, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.25);
        });
      } else if (type === 'car_zoom') {
        // Low engine rev + horn
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(110, now);
        osc1.frequency.exponentialRampToValueAtTime(320, now + 0.4);
        osc1.frequency.exponentialRampToValueAtTime(140, now + 0.9);
        gain1.gain.setValueAtTime(0.25, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.9);

        // Siren chime
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.1);
        osc2.frequency.setValueAtTime(1174, now + 0.35);
        gain2.gain.setValueAtTime(0.18, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.6);
      } else if (type === 'bell_ding') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'bubble_pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.1);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'error') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.setValueAtTime(110, now + 0.12);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'snap') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'fanfare') {
        const melody = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        melody.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.3, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.4);
        });
      }
    } catch (_) {}
  };

  // =========================================================================
  // TAB 1: DİNAMİK KESİŞİM LABORATUVARI (Serbest Keşif Masası)
  // =========================================================================
  const [labLine1Angle, setLabLine1Angle] = useState(0); // degrees
  const [labLine2Angle, setLabLine2Angle] = useState(55); // degrees
  const [labLine3Angle, setLabLine3Angle] = useState(125); // degrees
  const [hasLine3, setHasLine3] = useState(false);
  const [line3Mode, setLine3Mode] = useState<'center' | 'transversal'>('center');
  const [isParallelMode, setIsParallelMode] = useState(false);
  const [parallelNotice, setParallelNotice] = useState<string | null>(null);
  const [draggingHandle, setDraggingHandle] = useState<'l1' | 'l2' | 'l3' | null>(null);
  const [showLabHelp, setShowLabHelp] = useState(false);

  // Calculate opening angle between d1 and d2 (normalized to 0..180)
  const getOpeningAngle = (a1: number, a2: number) => {
    let diff = Math.abs(a2 - a1) % 180;
    if (diff > 90) diff = 180 - diff;
    return Math.round(diff);
  };

  const acuteDeg = isParallelMode ? 0 : Math.max(5, Math.min(89, getOpeningAngle(labLine1Angle, labLine2Angle)));
  const obtuseDeg = 180 - acuteDeg;

  // Dragging logic for handles
  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingHandle) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const rad = Math.atan2(clickY - centerY, clickX - centerX);
    let deg = Math.round((rad * 180) / Math.PI);
    if (deg < 0) deg += 360;

    if (isParallelMode) setIsParallelMode(false);

    if (draggingHandle === 'l1') {
      setLabLine1Angle(deg % 180);
    } else if (draggingHandle === 'l2') {
      setLabLine2Angle(deg % 180);
    } else if (draggingHandle === 'l3') {
      setLabLine3Angle(deg % 180);
    }
  };

  const snapToPerpendicular = () => {
    setIsParallelMode(false);
    setLabLine1Angle(0);
    setLabLine2Angle(90);
    playSynthesizerSound('snap');
  };

  const snapToParallel = () => {
    setIsParallelMode(true);
    setLabLine1Angle(0);
    setLabLine2Angle(0);
    setParallelNotice('⚡ Paralel Doğrular (d₁ // d₂) Hiçbir Noktada Kesişmez ve Açı Oluşturmaz!');
    playSynthesizerSound('snap');
  };

  const randomizeLabAngles = () => {
    setIsParallelMode(false);
    const new1 = Math.floor(Math.random() * 40);
    const new2 = (new1 + 35 + Math.floor(Math.random() * 80)) % 180;
    setLabLine1Angle(new1);
    setLabLine2Angle(new2);
    playSynthesizerSound('laser');
  };

  // =========================================================================
  // TAB 2: KAVŞAK KİLİDİ (Bulmaca / Görev Modu)
  // =========================================================================
  const [lockLevel, setLockLevel] = useState<1 | 2 | 3>(1);
  const [lockSectors, setLockSectors] = useState<LockSector[]>([]);
  const [activeLockId, setActiveLockId] = useState<number | null>(null);
  const [customKeypadInput, setCustomKeypadInput] = useState('');
  const [keypadFeedback, setKeypadFeedback] = useState<{ msg: string; isError: boolean } | null>(null);
  const [isLevelCleared, setIsLevelCleared] = useState(false);
  const [carAnimationRunning, setCarAnimationRunning] = useState(false);

  // Initialize lock levels
  const initLockLevel = useCallback((level: 1 | 2 | 3) => {
    setIsLevelCleared(false);
    setCarAnimationRunning(false);
    setActiveLockId(null);
    setCustomKeypadInput('');
    setKeypadFeedback(null);

    let initialAngle = 60;
    if (level === 1) {
      const presets = [30, 45, 60, 120, 135, 150];
      initialAngle = presets[Math.floor(Math.random() * presets.length)];
    } else if (level === 2) {
      const presets = [38, 47, 73, 118, 142, 164];
      initialAngle = presets[Math.floor(Math.random() * presets.length)];
    } else {
      // Level 3 (Super 3-Line Junction)
      initialAngle = 40;
    }

    const acute = initialAngle > 90 ? 180 - initialAngle : initialAngle;
    const obtuse = 180 - acute;

    if (level === 1 || level === 2) {
      // 4 sectors
      // 0: Right-Top (Acute or Obtuse) -> GIVEN
      // 1: Left-Bottom -> OPPOSITE (Equal)
      // 2: Left-Top -> ADJACENT (180 - initial)
      // 3: Right-Bottom -> ADJACENT (180 - initial)
      const sectors: LockSector[] = [
        {
          id: 0,
          label: '1. Bölge (Sağ-Üst)',
          angleDeg: initialAngle,
          isInitialRevealed: true,
          isUnlocked: true,
          type: 'given',
          relationHint: 'Verilen Başlangıç Lazer Açısı'
        },
        {
          id: 1,
          label: '3. Bölge (Sol-Alt)',
          angleDeg: initialAngle,
          isInitialRevealed: false,
          isUnlocked: false,
          type: 'opposite',
          relationHint: 'Verilen açının tam karşısındadır (TERS AÇI). Ters açılar daima birbirine eşittir!'
        },
        {
          id: 2,
          label: '2. Bölge (Sol-Üst)',
          angleDeg: 180 - initialAngle,
          isInitialRevealed: false,
          isUnlocked: false,
          type: 'adjacent',
          relationHint: `Verilen açıyla aynı doğru üzerinde yan yanadır (KOMŞU BÜTÜNLER). Toplamları 180° eder (180° - ${initialAngle}°)!`
        },
        {
          id: 3,
          label: '4. Bölge (Sağ-Alt)',
          angleDeg: 180 - initialAngle,
          isInitialRevealed: false,
          isUnlocked: false,
          type: 'adjacent',
          relationHint: `Verilen açıyla aynı doğru üzerinde yan yanadır (KOMŞU BÜTÜNLER). Toplamları 180° eder (180° - ${initialAngle}°)!`
        }
      ];
      setLockSectors(sectors);
    } else {
      // Level 3: 6 sectors with 3 lines
      // 1 given (40°), 2nd angle is 60°, 3rd angle is 80°
      const a = 40;
      const b = 60;
      const c = 80;
      const sectors: LockSector[] = [
        {
          id: 0,
          label: '1. Bölge',
          angleDeg: a,
          isInitialRevealed: true,
          isUnlocked: true,
          type: 'given',
          relationHint: 'Verilen Açı'
        },
        {
          id: 1,
          label: '2. Bölge',
          angleDeg: b,
          isInitialRevealed: false,
          isUnlocked: false,
          type: 'adjacent',
          relationHint: `Komşu açılar toplamı bir doğru üzerinde 180° eder (180° - (${a}° + ${c}°) = ${b}°)!`
        },
        {
          id: 2,
          label: '3. Bölge',
          angleDeg: c,
          isInitialRevealed: false,
          isUnlocked: false,
          type: 'adjacent',
          relationHint: 'Doğru üzerindeki komşu açı ilişkisini kullanın.'
        },
        {
          id: 3,
          label: '4. Bölge (1.nin Tersi)',
          angleDeg: a,
          isInitialRevealed: false,
          isUnlocked: false,
          type: 'opposite',
          relationHint: '1. Bölgenin tam zıt yönündeki TERS AÇIDIR (Eşit = 40°)!'
        },
        {
          id: 4,
          label: '5. Bölge (2.nin Tersi)',
          angleDeg: b,
          isInitialRevealed: false,
          isUnlocked: false,
          type: 'opposite',
          relationHint: '2. Bölgenin tam zıt yönündeki TERS AÇIDIR (Eşit)!'
        },
        {
          id: 5,
          label: '6. Bölge (3.nün Tersi)',
          angleDeg: c,
          isInitialRevealed: false,
          isUnlocked: false,
          type: 'opposite',
          relationHint: '3. Bölgenin tam zıt yönündeki TERS AÇIDIR (Eşit)!'
        }
      ];
      setLockSectors(sectors);
    }
  }, []);

  useEffect(() => {
    initLockLevel(lockLevel);
  }, [lockLevel, initLockLevel]);

  // Handle lock solve attempt
  const handleSolveAttempt = (enteredAngle: number) => {
    if (activeLockId === null) return;
    const targetSector = lockSectors.find((s) => s.id === activeLockId);
    if (!targetSector) return;

    if (enteredAngle === targetSector.angleDeg) {
      // Success!
      playSynthesizerSound('unlock_success');
      const updated = lockSectors.map((s) => (s.id === activeLockId ? { ...s, isUnlocked: true } : s));
      setLockSectors(updated);
      setActiveLockId(null);
      setCustomKeypadInput('');
      setKeypadFeedback(null);
      addPoints(25);

      // Check if all unlocked
      if (updated.every((s) => s.isUnlocked)) {
        setIsLevelCleared(true);
        setCarAnimationRunning(true);
        playSynthesizerSound('car_zoom');
        addPoints(50);
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch (_) {}
      }
    } else {
      // Wrong
      playSynthesizerSound('error');
      setKeypadFeedback({
        msg: `Hatalı Derece! İpucu: ${targetSector.relationHint}`,
        isError: true
      });
    }
  };

  // =========================================================================
  // TAB 3: AÇI TERAZİSİ (Hızlı Arcade Oyunu)
  // =========================================================================
  const [arcadeActive, setArcadeActive] = useState(false);
  const [arcadeScore, setArcadeScore] = useState(0);
  const [arcadeCombo, setArcadeCombo] = useState(1);
  const [arcadeLives, setArcadeLives] = useState(3);
  const [arcadeTimeLeft, setArcadeTimeLeft] = useState(60);
  const [currentPair, setCurrentPair] = useState<ArcadePair | null>(null);
  const [arcadeGameOver, setArcadeGameOver] = useState(false);
  const [droppedFeedback, setDroppedFeedback] = useState<{ text: string; color: string } | null>(null);

  // Spawn new pair
  const spawnNewPair = useCallback(() => {
    const isTumler = Math.random() > 0.5;
    const list = isTumler ? TUMLER_PRESETS : BUTUNLER_PRESETS;
    const choice = list[Math.floor(Math.random() * list.length)];
    const newP: ArcadePair = {
      id: Math.random().toString(),
      a: choice[0],
      b: choice[1],
      sum: choice[0] + choice[1],
      type: isTumler ? 'tumler' : 'butunler',
      x: 30 + Math.floor(Math.random() * 40),
      y: 10,
      speed: 1.2
    };
    setCurrentPair(newP);
  }, []);

  // Arcade start
  const startArcadeGame = () => {
    setArcadeScore(0);
    setArcadeCombo(1);
    setArcadeLives(3);
    setArcadeTimeLeft(60);
    setArcadeGameOver(false);
    setArcadeActive(true);
    spawnNewPair();
    playSynthesizerSound('laser');
  };

  // Arcade timer & fall loop
  useEffect(() => {
    if (!arcadeActive || arcadeGameOver) return;

    const timer = setInterval(() => {
      setArcadeTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setArcadeActive(false);
          setArcadeGameOver(true);
          playSynthesizerSound('fanfare');
          addPoints(arcadeScore);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [arcadeActive, arcadeGameOver, arcadeScore, addPoints]);

  // Fall movement
  useEffect(() => {
    if (!arcadeActive || arcadeGameOver || !currentPair) return;

    const fallInterval = setInterval(() => {
      setCurrentPair((prev) => {
        if (!prev) return null;
        const newY = prev.y + prev.speed;
        if (newY >= 85) {
          // Hit bottom! Lose life
          playSynthesizerSound('bubble_pop');
          setArcadeLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setArcadeActive(false);
              setArcadeGameOver(true);
              playSynthesizerSound('error');
            }
            return Math.max(0, nextL);
          });
          setArcadeCombo(1);
          setDroppedFeedback({ text: '💥 Yere Çarptı! -1 Can', color: '#ef4444' });
          setTimeout(() => setDroppedFeedback(null), 800);
          spawnNewPair();
          return null;
        }
        return { ...prev, y: newY };
      });
    }, 50);

    return () => clearInterval(fallInterval);
  }, [arcadeActive, arcadeGameOver, currentPair, spawnNewPair]);

  // Sort pair to 90 or 180
  const handleSortPair = (targetType: 'tumler' | 'butunler') => {
    if (!currentPair || !arcadeActive || arcadeGameOver) return;

    if (currentPair.type === targetType) {
      // Correct!
      playSynthesizerSound('bell_ding');
      const earned = 50 * arcadeCombo;
      setArcadeScore((s) => s + earned);
      setArcadeCombo((c) => Math.min(5, c + 1));
      setDroppedFeedback({
        text: targetType === 'tumler' ? `✨ +${earned} (90° TÜMLER)` : `🔥 +${earned} (180° BÜTÜNLER)`,
        color: targetType === 'tumler' ? '#00f0ff' : '#f59e0b'
      });
      setTimeout(() => setDroppedFeedback(null), 700);
      spawnNewPair();
    } else {
      // Wrong!
      playSynthesizerSound('error');
      setArcadeLives((l) => {
        const nextL = l - 1;
        if (nextL <= 0) {
          setArcadeActive(false);
          setArcadeGameOver(true);
        }
        return Math.max(0, nextL);
      });
      setArcadeCombo(1);
      setDroppedFeedback({ text: '❌ Yanlış Hazne! -1 Can', color: '#ef4444' });
      setTimeout(() => setDroppedFeedback(null), 700);
      spawnNewPair();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5 select-none font-sans text-slate-100">
      {/* Top Cyberpunk Game Header */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>KAVŞAK MİMARI • SİBERPUNK AÇI LABORATUVARI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            Lazer Yolları ve Açı Kilidi
          </h2>
          <p className="text-xs text-slate-400">
            Kesişen doğruların ters açı eşitliğini, komşu bütünler toplamını (180°) ve tümler açı dengesini canlı siber simülasyonda keşfedin.
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95"
            title={soundMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {onBackToMenu && (
            <button
              onClick={onBackToMenu}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black border border-slate-700 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Menü</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Interactive Mode Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
        <button
          onClick={() => {
            setActiveTab('lab');
            playSynthesizerSound('lock_click');
          }}
          className={`py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'lab'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Move className="w-4 h-4 text-cyan-300" />
          <span className="hidden sm:inline">1. Bölüm:</span>
          <span>Dinamik Keşif Laboratuvarı</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('lock');
            playSynthesizerSound('lock_click');
          }}
          className={`py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'lock'
              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Lock className="w-4 h-4 text-emerald-300" />
          <span className="hidden sm:inline">2. Bölüm:</span>
          <span>Kavşak Kilidi Görevi</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('arcade');
            playSynthesizerSound('lock_click');
          }}
          className={`py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'arcade'
              ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-lg shadow-amber-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline">3. Bölüm:</span>
          <span>Açı Terazisi (Arcade)</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 1. TAB: DİNAMİK KESİŞİM LABORATUVARI                                */}
      {/* ===================================================================== */}
      {activeTab === 'lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          {/* Main Interactive Canvas */}
          <div className="lg:col-span-8 bg-slate-900 rounded-3xl border border-cyan-500/30 p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-bold flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5" /> Oklardan Tutup Döndürün
                </span>
                {isParallelMode && (
                  <span className="px-3 py-1 rounded-xl bg-amber-950 border border-amber-500 text-amber-300 text-xs font-black animate-pulse">
                    d₁ // d₂ (Paralel)
                  </span>
                )}
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={snapToPerpendicular}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                >
                  <span>Dik Yap (90° ⊥)</span>
                </button>

                <button
                  onClick={snapToParallel}
                  className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                >
                  <span>Paralel Yap (//)</span>
                </button>

                <button
                  onClick={() => setHasLine3(!hasLine3)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 active:scale-95 ${
                    hasLine3
                      ? 'bg-purple-950 border-purple-500 text-purple-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>3. Doğru: {hasLine3 ? 'AÇIK (d₃)' : 'KAPALI'}</span>
                </button>

                <button
                  onClick={randomizeLabAngles}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 transition-all active:scale-95"
                  title="Rastgele Açı"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Parallel Banner Notice */}
            {parallelNotice && isParallelMode && (
              <div className="mb-3 p-2.5 rounded-2xl bg-amber-950/90 border border-amber-500/60 text-amber-200 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top-2">
                <span>{parallelNotice}</span>
                <button onClick={() => setParallelNotice(null)} className="text-amber-400 hover:text-amber-100 text-xs">
                  ✕
                </button>
              </div>
            )}

            {/* SVG Laser Grid Stage */}
            <div className="relative w-full h-[380px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
              <svg
                width="600"
                height="380"
                viewBox="0 0 600 380"
                className="w-full h-full select-none"
                onPointerMove={handleSvgPointerMove}
                onPointerUp={() => setDraggingHandle(null)}
                onPointerLeave={() => setDraggingHandle(null)}
              >
                {/* Neon Cyber Grid Pattern */}
                <defs>
                  <pattern id="cybergrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#131c2e" strokeWidth="1" />
                  </pattern>
                  <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-pink" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <rect width="600" height="380" fill="url(#cybergrid)" />

                {/* Radar concentric rings */}
                <circle cx="300" cy="190" r="140" fill="none" stroke="#1e293b" strokeDasharray="4 6" />
                <circle cx="300" cy="190" r="80" fill="none" stroke="#1e293b" strokeDasharray="3 4" />

                {/* PARALLEL MODE RENDERING */}
                {isParallelMode ? (
                  <>
                    {/* d1 */}
                    <line x1="40" y1="130" x2="560" y2="130" stroke="#00f0ff" strokeWidth="5" filter="url(#glow-cyan)" />
                    <text x="570" y="135" fill="#00f0ff" fontSize="13" fontWeight="bold">d₁</text>
                    
                    {/* d2 */}
                    <line x1="40" y1="250" x2="560" y2="250" stroke="#00f0ff" strokeWidth="5" filter="url(#glow-cyan)" />
                    <text x="570" y="255" fill="#00f0ff" fontSize="13" fontWeight="bold">d₂ (// d₁)</text>

                    {/* Distance indicator */}
                    <line x1="300" y1="130" x2="300" y2="250" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="310" y="195" fill="#f59e0b" fontSize="11" fontWeight="bold">Sabit Mesafe (h)</text>
                    <text x="300" y="310" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">
                      Kesişme Noktası = YOK • Açı = 0° (Tanımsız)
                    </text>
                  </>
                ) : (
                  <>
                    {/* NORMAL INTERSECTING MODE */}
                    {/* Center O (300, 190) */}
                    {(() => {
                      const rad1 = (labLine1Angle * Math.PI) / 180;
                      const rad2 = (labLine2Angle * Math.PI) / 180;
                      const rad3 = (labLine3Angle * Math.PI) / 180;
                      const len = 210;

                      // Line 1 endpoints
                      const l1x1 = 300 - len * Math.cos(rad1);
                      const l1y1 = 190 - len * Math.sin(rad1);
                      const l1x2 = 300 + len * Math.cos(rad1);
                      const l1y2 = 190 + len * Math.sin(rad1);

                      // Line 2 endpoints
                      const l2x1 = 300 - len * Math.cos(rad2);
                      const l2y1 = 190 - len * Math.sin(rad2);
                      const l2x2 = 300 + len * Math.cos(rad2);
                      const l2y2 = 190 + len * Math.sin(rad2);

                      // Line 3 endpoints (if active)
                      const l3x1 = 300 - len * Math.cos(rad3);
                      const l3y1 = 190 - len * Math.sin(rad3);
                      const l3x2 = 300 + len * Math.cos(rad3);
                      const l3y2 = 190 + len * Math.sin(rad3);

                      // Calculate display angle positions
                      const midRadAcute = (rad1 + rad2) / 2;
                      const midRadObtuse = midRadAcute + Math.PI / 2;

                      return (
                        <>
                          {/* Colored Angle Sectors (Arcs) */}
                          {/* Acute pair (Cyan) */}
                          <circle cx="300" cy="190" r="50" fill="none" stroke="#00f0ff" strokeWidth="2.5" opacity="0.4" />
                          <circle cx="300" cy="190" r="75" fill="none" stroke="#ec4899" strokeWidth="2.5" opacity="0.4" />

                          {/* Line 1 (Cyan) */}
                          <line x1={l1x1} y1={l1y1} x2={l1x2} y2={l1y2} stroke="#00f0ff" strokeWidth="4" filter="url(#glow-cyan)" />
                          <text x={l1x2 + 10} y={l1y2} fill="#00f0ff" fontSize="13" fontWeight="bold">d₁</text>

                          {/* Line 2 (Pink/Magenta) */}
                          <line x1={l2x1} y1={l2y1} x2={l2x2} y2={l2y2} stroke="#ec4899" strokeWidth="4" filter="url(#glow-pink)" />
                          <text x={l2x2 + 10} y={l2y2} fill="#ec4899" fontSize="13" fontWeight="bold">d₂</text>

                          {/* Line 3 (Amber/Purple) if active */}
                          {hasLine3 && (
                            <>
                              <line x1={l3x1} y1={l3y1} x2={l3x2} y2={l3y2} stroke="#a855f7" strokeWidth="3.5" strokeDasharray="6 3" filter="url(#glow-amber)" />
                              <text x={l3x2 + 10} y={l3y2} fill="#a855f7" fontSize="13" fontWeight="bold">d₃</text>
                            </>
                          )}

                          {/* Perpendicular Square Indicator if 90° */}
                          {acuteDeg === 90 && (
                            <rect x="285" y="175" width="15" height="15" fill="none" stroke="#10b981" strokeWidth="2" />
                          )}

                          {/* Dynamic Angle Badges */}
                          {/* Acute Angle 1 (Right-Top) */}
                          <g transform={`translate(${300 + 75 * Math.cos(midRadAcute)}, ${190 - 75 * Math.sin(midRadAcute)})`}>
                            <rect x="-30" y="-14" width="60" height="26" rx="8" fill="#032638" stroke="#00f0ff" strokeWidth="1.5" />
                            <text x="0" y="4" fill="#00f0ff" fontSize="12" fontWeight="black" textAnchor="middle">
                              {acuteDeg}°
                            </text>
                          </g>

                          {/* Acute Angle 2 (Left-Bottom, Opposite / Ters Açı) */}
                          <g transform={`translate(${300 - 75 * Math.cos(midRadAcute)}, ${190 + 75 * Math.sin(midRadAcute)})`}>
                            <rect x="-30" y="-14" width="60" height="26" rx="8" fill="#032638" stroke="#00f0ff" strokeWidth="1.5" />
                            <text x="0" y="4" fill="#00f0ff" fontSize="12" fontWeight="black" textAnchor="middle">
                              {acuteDeg}°
                            </text>
                          </g>

                          {/* Obtuse Angle 1 (Left-Top, Adjacent / Bütünler) */}
                          <g transform={`translate(${300 - 95 * Math.cos(midRadObtuse)}, ${190 - 95 * Math.sin(midRadObtuse)})`}>
                            <rect x="-32" y="-14" width="64" height="26" rx="8" fill="#380325" stroke="#ec4899" strokeWidth="1.5" />
                            <text x="0" y="4" fill="#ec4899" fontSize="12" fontWeight="black" textAnchor="middle">
                              {obtuseDeg}°
                            </text>
                          </g>

                          {/* Obtuse Angle 2 (Right-Bottom, Opposite to Obtuse 1) */}
                          <g transform={`translate(${300 + 95 * Math.cos(midRadObtuse)}, ${190 + 95 * Math.sin(midRadObtuse)})`}>
                            <rect x="-32" y="-14" width="64" height="26" rx="8" fill="#380325" stroke="#ec4899" strokeWidth="1.5" />
                            <text x="0" y="4" fill="#ec4899" fontSize="12" fontWeight="black" textAnchor="middle">
                              {obtuseDeg}°
                            </text>
                          </g>

                          {/* Draggable Endpoint Handle for Line 1 */}
                          <circle
                            cx={l1x2}
                            cy={l1y2}
                            r="12"
                            fill="#00f0ff"
                            stroke="#ffffff"
                            strokeWidth="3"
                            className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
                              setDraggingHandle('l1');
                              playSynthesizerSound('lock_click');
                            }}
                          />

                          {/* Draggable Endpoint Handle for Line 2 */}
                          <circle
                            cx={l2x2}
                            cy={l2y2}
                            r="12"
                            fill="#ec4899"
                            stroke="#ffffff"
                            strokeWidth="3"
                            className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
                              setDraggingHandle('l2');
                              playSynthesizerSound('lock_click');
                            }}
                          />

                          {/* Handle for Line 3 */}
                          {hasLine3 && (
                            <circle
                              cx={l3x2}
                              cy={l3y2}
                              r="12"
                              fill="#a855f7"
                              stroke="#ffffff"
                              strokeWidth="3"
                              className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
                                setDraggingHandle('l3');
                                playSynthesizerSound('lock_click');
                              }}
                            />
                          )}

                          {/* Center Intersection Node O */}
                          <circle cx="300" cy="190" r="7" fill="#ffffff" stroke="#00f0ff" strokeWidth="3" />
                          <text x="290" y="215" fill="#ffffff" fontSize="13" fontWeight="bold">O</text>
                        </>
                      );
                    })()}
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Right Live Analytics & Mathematical Laws */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            {/* Live Angle Relationship Matrix */}
            <div className="bg-slate-900 rounded-3xl border border-cyan-500/30 p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Compass className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="font-black text-white text-sm">Canlı Açı ve İlişki Paneli</h4>
                  <p className="text-[11px] text-slate-400">Doğrular döndükçe gerçek zamanlı hesaplanır.</p>
                </div>
              </div>

              {/* Ters Açılar (Opposite Angles) */}
              <div className="p-3 bg-cyan-950/40 rounded-2xl border border-cyan-500/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300">Ters Açılar Çifti 1:</span>
                  <span className="text-sm font-black text-cyan-400">{acuteDeg}° = {acuteDeg}°</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-pink-300">Ters Açılar Çifti 2:</span>
                  <span className="text-sm font-black text-pink-400">{obtuseDeg}° = {obtuseDeg}°</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold">
                  <Check className="w-3 h-3" /> Karşılıklı Ters Açılar Daima Eşittir
                </div>
              </div>

              {/* Komşu Bütünler Sayacı (180°) */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Komşu Bütünler Toplamı:</span>
                  <span className="text-amber-400 font-black">{acuteDeg}° + {obtuseDeg}° = 180°</span>
                </div>
                {/* Progress bar to 180° */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                  <div style={{ width: `${(acuteDeg / 180) * 100}%` }} className="bg-cyan-400 h-full" />
                  <div style={{ width: `${(obtuseDeg / 180) * 100}%` }} className="bg-pink-500 h-full" />
                </div>
                <p className="text-[10px] text-slate-400">
                  Bir doğru boyunca yan yana duran açılar doğru açıyı (180°) tamamlar.
                </p>
              </div>

              {/* Tam Açı (360°) */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">4 Açının Toplamı:</span>
                <span className="font-black text-purple-400">{acuteDeg + obtuseDeg + acuteDeg + obtuseDeg}° (Tam Açı)</span>
              </div>
            </div>

            {/* Quick Rule Accordion / Help */}
            <div className="bg-gradient-to-br from-cyan-950/60 to-slate-900 rounded-3xl border border-cyan-500/40 p-4 space-y-2">
              <button
                onClick={() => setShowLabHelp(!showLabHelp)}
                className="w-full flex items-center justify-between text-xs font-bold text-cyan-300 hover:text-cyan-100"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Geometri Çıkarım Kuralları
                </span>
                <span>{showLabHelp ? '▲ Gizle' : '▼ Göster'}</span>
              </button>

              {showLabHelp && (
                <div className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800 animate-in fade-in">
                  <p>🔹 <strong>Ters Açılar:</strong> Kesişen iki doğrudan zıt yönlü olanlar eştir ($a = c, b = d$).</p>
                  <p>🔹 <strong>Komşu Bütünler:</strong> Bir doğru üzerinde ortak bir kolu olan açıların toplamı $180^\circ$dir.</p>
                  <p>🔹 <strong>Paralel Doğrular ($d_1 // d_2$):</strong> Hiçbir noktada kesişmez, açı oluşturmaz.</p>
                  <p>🔹 <strong>Dik Doğrular ($d_1 \perp d_2$):</strong> $90^\circ$lik dik açıyla kesişir.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. TAB: KAVŞAK KİLİDİ (Bulmaca / Görev Modu)                         */}
      {/* ===================================================================== */}
      {activeTab === 'lock' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          {/* Crossroads Visual Arena */}
          <div className="lg:col-span-8 bg-slate-900 rounded-3xl border border-emerald-500/30 p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden">
            {/* Mission Level Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Görev Seviyesi:</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setLockLevel(lvl as 1 | 2 | 3);
                        playSynthesizerSound('lock_click');
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                        lockLevel === lvl
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lvl === 1 ? '1: Kolay' : lvl === 2 ? '2: Hassas' : '3: Süper 3-Hat'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => initLockLevel(lockLevel)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1 active:scale-95"
              >
                <ResetIcon className="w-3.5 h-3.5" />
                <span>Yeni Şifre Türet</span>
              </button>
            </div>

            {/* Neon Crossroads Stage */}
            <div className="relative w-full h-[390px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
              <svg width="600" height="390" viewBox="0 0 600 390" className="w-full h-full select-none">
                <defs>
                  <pattern id="lockgrid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#0f172a" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="600" height="390" fill="url(#lockgrid)" />

                {/* Road Asphalts & Markings */}
                <rect x="250" y="0" width="100" height="390" fill="#090d16" />
                <rect x="0" y="145" width="600" height="100" fill="#090d16" />
                <line x1="300" y1="0" x2="300" y2="390" stroke="#334155" strokeWidth="2" strokeDasharray="8 6" />
                <line x1="0" y1="195" x2="600" y2="195" stroke="#334155" strokeWidth="2" strokeDasharray="8 6" />

                {/* Laser Road Barriers intersecting at (300, 195) */}
                <line
                  x1="60"
                  y1="340"
                  x2="540"
                  y2="50"
                  stroke={isLevelCleared ? '#10b981' : '#ef4444'}
                  strokeWidth="4"
                  strokeDasharray={isLevelCleared ? 'none' : '6 4'}
                />
                <line
                  x1="60"
                  y1="50"
                  x2="540"
                  y2="340"
                  stroke={isLevelCleared ? '#10b981' : '#ef4444'}
                  strokeWidth="4"
                  strokeDasharray={isLevelCleared ? 'none' : '6 4'}
                />

                {/* 3rd Line for Level 3 */}
                {lockLevel === 3 && (
                  <line
                    x1="300"
                    y1="20"
                    x2="300"
                    y2="370"
                    stroke={isLevelCleared ? '#10b981' : '#a855f7'}
                    strokeWidth="4"
                    strokeDasharray={isLevelCleared ? 'none' : '6 4'}
                  />
                )}

                {/* Animated Neon Cars passing when cleared */}
                {carAnimationRunning && (
                  <>
                    <g className="animate-[moveRight_2s_linear_infinite]">
                      <rect x="80" y="160" width="40" height="20" rx="6" fill="#00f0ff" />
                      <circle cx="90" cy="180" r="4" fill="#ffffff" />
                      <circle cx="110" cy="180" r="4" fill="#ffffff" />
                      {/* Headlights */}
                      <polygon points="120,165 170,155 170,185 120,175" fill="#00f0ff" opacity="0.3" />
                    </g>
                    <g className="animate-[moveDown_2s_linear_infinite]">
                      <rect x="310" y="40" width="20" height="40" rx="6" fill="#f59e0b" />
                      <circle cx="310" cy="50" r="4" fill="#ffffff" />
                      <circle cx="310" cy="70" r="4" fill="#ffffff" />
                    </g>
                  </>
                )}

                {/* Center Node */}
                <circle cx="300" cy="195" r="8" fill="#ffffff" stroke={isLevelCleared ? '#10b981' : '#00f0ff'} strokeWidth="3" />
              </svg>

              {/* Overlay HTML Lock Badges positioned around sectors */}
              {lockLevel < 3 ? (
                <>
                  {/* Sector 0: Right-Top (Given) */}
                  <div className="absolute top-[28%] right-[22%] translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="px-3.5 py-2 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 font-black text-sm shadow-xl flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{lockSectors[0]?.angleDeg}° (Açık)</span>
                    </div>
                  </div>

                  {/* Sector 1: Left-Bottom (Opposite / Ters Açı) */}
                  <div className="absolute bottom-[28%] left-[22%] -translate-x-1/2 translate-y-1/2 z-20">
                    <button
                      onClick={() => {
                        if (!lockSectors[1]?.isUnlocked) {
                          setActiveLockId(1);
                          playSynthesizerSound('lock_click');
                        }
                      }}
                      className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all shadow-xl flex items-center gap-2 active:scale-95 ${
                        lockSectors[1]?.isUnlocked
                          ? 'bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 cursor-default'
                          : activeLockId === 1
                          ? 'bg-cyan-900 border-2 border-cyan-400 text-cyan-200 animate-pulse'
                          : 'bg-slate-900/90 hover:bg-slate-800 border-2 border-rose-500/70 text-rose-300'
                      }`}
                    >
                      {lockSectors[1]?.isUnlocked ? (
                        <>
                          <Unlock className="w-4 h-4 text-emerald-400" />
                          <span>{lockSectors[1]?.angleDeg}° (Ters Açı)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-rose-400 animate-bounce" />
                          <span>🔒 1. Kilit (Ters Açı)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Sector 2: Left-Top (Adjacent / Komşu Bütünler) */}
                  <div className="absolute top-[28%] left-[22%] -translate-x-1/2 -translate-y-1/2 z-20">
                    <button
                      onClick={() => {
                        if (!lockSectors[2]?.isUnlocked) {
                          setActiveLockId(2);
                          playSynthesizerSound('lock_click');
                        }
                      }}
                      className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all shadow-xl flex items-center gap-2 active:scale-95 ${
                        lockSectors[2]?.isUnlocked
                          ? 'bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 cursor-default'
                          : activeLockId === 2
                          ? 'bg-cyan-900 border-2 border-cyan-400 text-cyan-200 animate-pulse'
                          : 'bg-slate-900/90 hover:bg-slate-800 border-2 border-rose-500/70 text-rose-300'
                      }`}
                    >
                      {lockSectors[2]?.isUnlocked ? (
                        <>
                          <Unlock className="w-4 h-4 text-emerald-400" />
                          <span>{lockSectors[2]?.angleDeg}° (Komşu)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-rose-400 animate-bounce" />
                          <span>🔒 2. Kilit (Komşu Bütünler)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Sector 3: Right-Bottom (Adjacent / Komşu Bütünler) */}
                  <div className="absolute bottom-[28%] right-[22%] translate-x-1/2 translate-y-1/2 z-20">
                    <button
                      onClick={() => {
                        if (!lockSectors[3]?.isUnlocked) {
                          setActiveLockId(3);
                          playSynthesizerSound('lock_click');
                        }
                      }}
                      className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all shadow-xl flex items-center gap-2 active:scale-95 ${
                        lockSectors[3]?.isUnlocked
                          ? 'bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 cursor-default'
                          : activeLockId === 3
                          ? 'bg-cyan-900 border-2 border-cyan-400 text-cyan-200 animate-pulse'
                          : 'bg-slate-900/90 hover:bg-slate-800 border-2 border-rose-500/70 text-rose-300'
                      }`}
                    >
                      {lockSectors[3]?.isUnlocked ? (
                        <>
                          <Unlock className="w-4 h-4 text-emerald-400" />
                          <span>{lockSectors[3]?.angleDeg}° (Komşu)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-rose-400 animate-bounce" />
                          <span>🔒 3. Kilit (Komşu Bütünler)</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                /* LEVEL 3: 6 SECTOR LOCKS */
                <div className="absolute inset-0 p-6 flex flex-wrap items-center justify-around z-20 pointer-events-none">
                  {lockSectors.map((sector) => (
                    <button
                      key={sector.id}
                      onClick={() => {
                        if (!sector.isUnlocked) {
                          setActiveLockId(sector.id);
                          playSynthesizerSound('lock_click');
                        }
                      }}
                      className={`pointer-events-auto px-3.5 py-2 m-2 rounded-2xl font-black text-xs transition-all shadow-xl flex items-center gap-1.5 active:scale-95 ${
                        sector.isUnlocked
                          ? 'bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300'
                          : activeLockId === sector.id
                          ? 'bg-cyan-900 border-2 border-cyan-400 text-cyan-200 animate-pulse'
                          : 'bg-slate-900/90 hover:bg-slate-800 border-2 border-rose-500/70 text-rose-300'
                      }`}
                    >
                      {sector.isUnlocked ? (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{sector.angleDeg}°</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-rose-400" />
                          <span>🔒 {sector.label}</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Lock Solver Keypad & Mission Status */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            {/* Solver Keypad Area */}
            <div className="bg-slate-900 rounded-3xl border border-emerald-500/30 p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Lock className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="font-black text-white text-sm">Lazer Bariyer Şifre Paneli</h4>
                  <p className="text-[11px] text-slate-400">
                    {activeLockId !== null
                      ? `Seçili Kilit: ${lockSectors.find((s) => s.id === activeLockId)?.label}`
                      : 'Çözmek için haritadaki 🔒 kilit simgelerinden birine tıklayın.'}
                  </p>
                </div>
              </div>

              {activeLockId !== null ? (
                <div className="space-y-4 animate-in fade-in">
                  {/* Context Hint */}
                  <div className="p-3 bg-cyan-950/50 rounded-2xl border border-cyan-500/40 text-xs text-cyan-200">
                    <p className="font-bold">
                      💡 {lockSectors.find((s) => s.id === activeLockId)?.relationHint}
                    </p>
                  </div>

                  {/* Fast Answer Choice Cards (Smartboard Friendly) */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 mb-1.5 block">Hızlı Seçenekler:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {(() => {
                        const target = lockSectors.find((s) => s.id === activeLockId);
                        if (!target) return null;
                        const correct = target.angleDeg;
                        const distractor1 = 180 - correct;
                        const distractor2 = (correct + 30) % 180 || 90;
                        const distractor3 = Math.abs(correct - 20) || 45;
                        const options = Array.from(new Set([correct, distractor1, distractor2, distractor3])).sort(
                          () => Math.random() - 0.5
                        );

                        return options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleSolveAttempt(opt)}
                            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 border border-slate-700 text-slate-200 font-black text-sm transition-all text-center"
                          >
                            {opt}°
                          </button>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Custom Input Display & Keypad */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-950 p-2.5 rounded-xl border border-slate-700 text-center font-mono font-black text-lg text-emerald-400">
                        {customKeypadInput ? `${customKeypadInput}°` : 'Derece Girin'}
                      </div>
                      <button
                        onClick={() => {
                          const val = Number(customKeypadInput);
                          if (!isNaN(val) && val > 0) {
                            handleSolveAttempt(val);
                          }
                        }}
                        disabled={!customKeypadInput}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-black text-xs transition-all"
                      >
                        AÇ
                      </button>
                    </div>

                    {/* Numeric Buttons */}
                    <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            if (customKeypadInput.length < 3) {
                              setCustomKeypadInput((prev) => prev + num);
                              playSynthesizerSound('lock_click');
                            }
                          }}
                          className="py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95"
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={() => setCustomKeypadInput('')}
                        className="col-span-2 py-2 rounded-lg bg-rose-950/80 text-rose-300 hover:bg-rose-900 active:scale-95"
                      >
                        Temizle
                      </button>
                    </div>
                  </div>

                  {keypadFeedback && (
                    <div
                      className={`p-2.5 rounded-xl text-xs font-bold ${
                        keypadFeedback.isError
                          ? 'bg-rose-950/80 border border-rose-500 text-rose-200'
                          : 'bg-emerald-950/80 border border-emerald-500 text-emerald-200'
                      }`}
                    >
                      {keypadFeedback.msg}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-400">
                    Bariyerleri kaldırmak için kavşaktaki kilitlerden birine tıklayıp açı ilişkisini çözün.
                  </p>
                </div>
              )}
            </div>

            {/* Level Cleared Banner & Proceed */}
            {isLevelCleared && (
              <div className="bg-gradient-to-r from-emerald-950 to-teal-950 rounded-3xl border-2 border-emerald-400 p-5 text-center space-y-3 animate-in zoom-in-95">
                <div className="inline-flex p-2 rounded-2xl bg-emerald-500 text-slate-950">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-white">Bariyerler Açıldı! Araçlar Geçiyor! 🚗💨</h3>
                <p className="text-xs text-emerald-200">Ters ve komşu bütünler açı şifrelerini başarıyla çözdünüz (+75 XP).</p>
                <div className="flex gap-2 justify-center pt-2">
                  {lockLevel < 3 ? (
                    <button
                      onClick={() => setLockLevel((l) => (l + 1) as 1 | 2 | 3)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-400/30"
                    >
                      <span>Sonraki Seviyeye Geç</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => initLockLevel(3)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-400/30"
                    >
                      <ResetIcon className="w-4 h-4" />
                      <span>Yeniden Oyna</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. TAB: AÇI TERAZİSİ (Hızlı Arcade Oyunu)                            */}
      {/* ===================================================================== */}
      {activeTab === 'arcade' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Arcade HUD Bar */}
          <div className="bg-slate-900 rounded-3xl p-4 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-6">
              {/* Score */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Puan</span>
                <div className="text-2xl font-black text-amber-400">{arcadeScore}</div>
              </div>

              {/* Multiplier Combo */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Kombo</span>
                <div className="text-xl font-black text-cyan-400">x{arcadeCombo}</div>
              </div>

              {/* Lives */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Canlar</span>
                <div className="flex items-center gap-1 text-rose-400 text-lg">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i}>{i < arcadeLives ? '❤️' : '🖤'}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Timer & Start */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-sm font-black">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{arcadeTimeLeft}s</span>
              </div>

              {!arcadeActive && (
                <button
                  onClick={startArcadeGame}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Play className="w-4 h-4" />
                  <span>{arcadeGameOver ? 'Tekrar Başlat' : 'Oyunu Başlat'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Arcade Play Arena */}
          <div className="relative w-full h-[420px] bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between p-6">
            {/* Falling Pair Bubble */}
            {arcadeActive && currentPair && (
              <div
                style={{
                  top: `${currentPair.y}%`,
                  left: `${currentPair.x}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute z-20 transition-all duration-75 cursor-pointer"
              >
                <div className="px-5 py-3 rounded-3xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 text-white font-black text-base sm:text-lg shadow-2xl border-2 border-white/40 flex items-center gap-2 animate-pulse hover:scale-110">
                  <Flame className="w-5 h-5 text-amber-300" />
                  <span>
                    [{currentPair.a}° ve {currentPair.b}°]
                  </span>
                </div>
              </div>
            )}

            {/* Dropped Floating Feedback */}
            {droppedFeedback && (
              <div
                style={{ color: droppedFeedback.color }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-lg font-black bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-700 animate-in zoom-in-95"
              >
                {droppedFeedback.text}
              </div>
            )}

            {/* Start Screen Overlay when not active */}
            {!arcadeActive && !arcadeGameOver && (
              <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                  <Flame className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white">Açı Terazisi: Tümler mi, Bütünler mi?</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Yukarıdan süzülen açı çiftlerini toplayın: Toplamı 90° ise <strong>Mavi Tümler</strong> haznesine, 180° ise <strong>Turuncu Bütünler</strong> haznesine gönderin!
                </p>
                <button
                  onClick={startArcadeGame}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-400/30 transition-all flex items-center gap-2 active:scale-95 hover:scale-105"
                >
                  <Play className="w-5 h-5" />
                  <span>Meydan Okumayı Başlat (60s)</span>
                </button>
              </div>
            )}

            {/* Game Over Screen */}
            {arcadeGameOver && (
              <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in zoom-in-95">
                <Trophy className="w-16 h-16 text-amber-400" />
                <h3 className="text-2xl font-black text-white">Süre Doldu! Skorunuz: {arcadeScore}</h3>
                <p className="text-xs text-slate-300">
                  Açıları hızla sınıflandırıp tümler ve bütünler dengesini başarıyla kurdunuz!
                </p>
                <button
                  onClick={startArcadeGame}
                  className="px-8 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl transition-all flex items-center gap-2"
                >
                  <ResetIcon className="w-4 h-4" />
                  <span>Tekrar Oyna</span>
                </button>
              </div>
            )}

            {/* Top Falling Guide */}
            <div className="text-center text-xs text-slate-500 font-bold">
              Yukarıdan gelen açıyı incele ➔ Aşağıdaki doğru enerji haznesine tıkla veya sürükle!
            </div>

            {/* Bottom 2 Energy Vessels */}
            <div className="grid grid-cols-2 gap-6 z-10">
              {/* Left: 90° TÜMLER Vessel */}
              <button
                onClick={() => handleSortPair('tumler')}
                disabled={!arcadeActive}
                className="py-6 px-4 rounded-3xl bg-gradient-to-b from-cyan-950/80 to-slate-900 border-2 border-cyan-400 hover:bg-cyan-900/40 active:scale-95 transition-all flex flex-col items-center justify-center space-y-2 shadow-2xl shadow-cyan-500/20 group"
              >
                <div className="text-cyan-400 font-black text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                  90° TÜMLER
                </div>
                <div className="text-[11px] font-bold text-cyan-200">
                  Toplamları 90° Eden Açı Çiftleri
                </div>
                <span className="px-3 py-1 rounded-xl bg-cyan-900/80 text-cyan-300 text-[10px] font-bold">
                  👈 SOL HAZNEYE AT
                </span>
              </button>

              {/* Right: 180° BÜTÜNLER Vessel */}
              <button
                onClick={() => handleSortPair('butunler')}
                disabled={!arcadeActive}
                className="py-6 px-4 rounded-3xl bg-gradient-to-b from-amber-950/80 to-slate-900 border-2 border-amber-400 hover:bg-amber-900/40 active:scale-95 transition-all flex flex-col items-center justify-center space-y-2 shadow-2xl shadow-amber-500/20 group"
              >
                <div className="text-amber-400 font-black text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                  180° BÜTÜNLER
                </div>
                <div className="text-[11px] font-bold text-amber-200">
                  Toplamları 180° Eden Açı Çiftleri
                </div>
                <span className="px-3 py-1 rounded-xl bg-amber-900/80 text-amber-300 text-[10px] font-bold">
                  👉 SAĞ HAZNEYE AT
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
