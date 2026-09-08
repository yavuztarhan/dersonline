'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Crosshair,
  Zap,
  RotateCw,
  Trophy,
  Target,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Compass,
  HelpCircle,
  Eye,
  EyeOff,
  Flame,
  Volume2,
  VolumeX,
  RotateCcw as ResetIcon
} from 'lucide-react';

interface AngleRadarGameProps {
  onGameComplete?: (score: number) => void;
  onBackToMenu?: () => void;
}

type LevelId = 1 | 2 | 3;
type GameMode = 'single' | 'team';
type AngleType = 'dar' | 'dik' | 'genis' | 'dogru';

interface RadarTarget {
  id: string;
  baseAngle: number; // Angle of base ray [OV) in degrees (0..360)
  degree: number; // True angle opening in degrees (15..175)
  satelliteName: string;
  codeName: string;
}

const SATELLITE_NAMES = [
  'TÜRKSAT-6A',
  'GÖKTÜRK-3',
  'RASAT-II',
  'İMECE-PRO',
  'ALPER-1',
  'SİNAN-X',
  'KUŞÇU-RADAR',
  'BİLGİN-5'
];

function getAngleTypeInfo(deg: number): { type: AngleType; title: string; color: string } {
  if (deg < 90) return { type: 'dar', title: 'Dar Açı (<90°)', color: '#06b6d4' };
  if (deg === 90) return { type: 'dik', title: 'Dik Açı (90°)', color: '#10b981' };
  if (deg < 180) return { type: 'genis', title: 'Geniş Açı (>90°)', color: '#f59e0b' };
  return { type: 'dogru', title: 'Doğru Açı (180°)', color: '#a855f7' };
}

export function AngleRadarGame({ onGameComplete, onBackToMenu }: AngleRadarGameProps) {
  const { addPoints, unlockBadge } = useApp();

  // Audio Context Synthesizer for high-tech sci-fi sound effects
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [soundMuted, setSoundMuted] = useState(false);

  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSynthesizerSound = (type: 'laser' | 'hit' | 'miss' | 'lock' | 'fanfare' | 'click') => {
    if (soundMuted) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'laser') {
        // Sci-Fi Laser Zap: Sawtooth with rapid pitch drop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.28);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'hit') {
        // Target Locked Hit Explosion
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.08); // A5
        osc.frequency.setValueAtTime(1174.66, now + 0.16); // D6

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'fanfare') {
        // High Score Fanfare (Major Triad)
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.09);
          gain.gain.setValueAtTime(0.2, now + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.09 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.36);
        });
      } else if (type === 'miss') {
        // Low Frequency Error Buzz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.25);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      } else if (type === 'lock') {
        // Quick high radar ping
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {}
  };

  // Game Mode & Level Configuration
  const [level, setLevel] = useState<LevelId>(1);
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [activeTeam, setActiveTeam] = useState<'teamA' | 'teamB'>('teamA');
  const [teamScores, setTeamScores] = useState({ teamA: 0, teamB: 0 });

  // Score, Streaks & Progress
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [levelTargetCount, setLevelTargetCount] = useState(0); // Targets done in current level
  const TARGETS_PER_LEVEL = 5;

  // Level 3 Timer (90s)
  const [timeLeft, setTimeLeft] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimeOver, setIsTimeOver] = useState(false);

  // Radar Target State
  const [currentTarget, setCurrentTarget] = useState<RadarTarget>({
    id: 'target-1',
    baseAngle: 0,
    degree: 60,
    satelliteName: 'TÜRKSAT-6A',
    codeName: 'TK-01'
  });

  // User input degrees
  const [inputDegree, setInputDegree] = useState<string>('');
  const [isFiringLaser, setIsFiringLaser] = useState(false);
  const [laserShotAngle, setLaserShotAngle] = useState<number | null>(null);
  const [laserHitResult, setLaserHitResult] = useState<'hit' | 'miss' | null>(null);
  const [feedbackDialog, setFeedbackDialog] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Assistant & Guide overlays
  const [showGuideLine, setShowGuideLine] = useState(false);
  const [showAnswerCard, setShowAnswerCard] = useState(false);

  // SANAL İLETKİ (Interactive Protractor) State
  // The center of radar canvas is (380, 260)
  const RADAR_CENTER = { x: 380, y: 260 };
  const [protractorPos, setProtractorPos] = useState<{ x: number; y: number }>({ x: 220, y: 150 });
  const [protractorAngle, setProtractorAngle] = useState<number>(0); // 0 to 360 degrees
  
  // Dragging states
  const [isDraggingProtractor, setIsDraggingProtractor] = useState(false);
  const [isRotatingProtractor, setIsRotatingProtractor] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startPosX: number; startPosY: number }>({ x: 0, y: 0, startPosX: 0, startPosY: 0 });
  const rotateStartAngleRef = useRef<number>(0);
  const initialProtractorAngleRef = useRef<number>(0);

  const svgCanvasRef = useRef<SVGSVGElement | null>(null);

  // Generate target based on level
  const generateNewTarget = useCallback((targetLevel: LevelId) => {
    let base = 0;
    let deg = 60;

    if (targetLevel === 1) {
      // Level 1: Base is strictly horizontal (0° or 180°), standard angles
      base = Math.random() > 0.5 ? 0 : 180;
      const commonAngles = [30, 45, 60, 75, 90, 105, 120, 135, 150];
      deg = commonAngles[Math.floor(Math.random() * commonAngles.length)];
    } else if (targetLevel === 2) {
      // Level 2: Random base rotation (e.g. 15°, 35°, 60°, 130°, 210°, 285°)
      const step = 15;
      base = Math.floor(Math.random() * (360 / step)) * step;
      // Degree between 20° and 165°
      deg = 20 + Math.floor(Math.random() * 29) * 5; // steps of 5°
    } else {
      // Level 3: Fully random arbitrary degrees
      base = Math.floor(Math.random() * 360);
      deg = 15 + Math.floor(Math.random() * 155);
    }

    const satIndex = Math.floor(Math.random() * SATELLITE_NAMES.length);
    const codeNum = Math.floor(10 + Math.random() * 90);

    const newT: RadarTarget = {
      id: `sat-${Date.now()}-${codeNum}`,
      baseAngle: base,
      degree: deg,
      satelliteName: SATELLITE_NAMES[satIndex],
      codeName: `ORBIT-${codeNum}`
    };

    setCurrentTarget(newT);
    setInputDegree('');
    setIsFiringLaser(false);
    setLaserShotAngle(null);
    setLaserHitResult(null);
    setFeedbackDialog(null);
    setShowAnswerCard(false);
    playSynthesizerSound('lock');
  }, []);

  // Initialize level
  useEffect(() => {
    generateNewTarget(level);
    if (level === 3) {
      setTimeLeft(90);
      setIsTimerRunning(true);
      setIsTimeOver(false);
    } else {
      setIsTimerRunning(false);
    }
  }, [level, generateNewTarget]);

  // Timer countdown for Level 3
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (level === 3 && isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsTimeOver(true);
            playSynthesizerSound('fanfare');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [level, isTimerRunning, timeLeft]);

  // Snap Protractor to Radar Origin (Magnet Helper)
  const snapProtractorToCenter = () => {
    playSynthesizerSound('click');
    setProtractorPos({ x: RADAR_CENTER.x, y: RADAR_CENTER.y });
  };

  // Align Protractor Rotation to Base Ray
  const alignProtractorToBase = () => {
    playSynthesizerSound('click');
    setProtractorAngle(currentTarget.baseAngle);
    setProtractorPos({ x: RADAR_CENTER.x, y: RADAR_CENTER.y });
  };

  // Pointer Handlers for Protractor Dragging and Rotating
  const getCanvasCoords = (e: React.PointerEvent) => {
    if (!svgCanvasRef.current) return { x: 0, y: 0 };
    const rect = svgCanvasRef.current.getBoundingClientRect();
    const scaleX = 760 / rect.width;
    const scaleY = 520 / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleProtractorPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    initAudio();
    const coords = getCanvasCoords(e);
    setIsDraggingProtractor(true);
    dragStartRef.current = {
      x: coords.x,
      y: coords.y,
      startPosX: protractorPos.x,
      startPosY: protractorPos.y
    };
    playSynthesizerSound('click');
  };

  const handleRotationHandlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    initAudio();
    const coords = getCanvasCoords(e);
    setIsRotatingProtractor(true);
    // Calculate initial pointer angle relative to protractor origin
    const dx = coords.x - protractorPos.x;
    const dy = coords.y - protractorPos.y;
    rotateStartAngleRef.current = Math.atan2(dy, dx) * (180 / Math.PI);
    initialProtractorAngleRef.current = protractorAngle;
    playSynthesizerSound('click');
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const coords = getCanvasCoords(e);

    if (isDraggingProtractor) {
      const dx = coords.x - dragStartRef.current.x;
      const dy = coords.y - dragStartRef.current.y;
      setProtractorPos({
        x: Math.round(dragStartRef.current.startPosX + dx),
        y: Math.round(dragStartRef.current.startPosY + dy)
      });
    } else if (isRotatingProtractor) {
      const dx = coords.x - protractorPos.x;
      const dy = coords.y - protractorPos.y;
      const currentPointerAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      const angleDiff = currentPointerAngle - rotateStartAngleRef.current;
      let newAngle = (initialProtractorAngleRef.current + angleDiff) % 360;
      if (newAngle < 0) newAngle += 360;
      setProtractorAngle(Math.round(newAngle));
    }
  };

  const handleCanvasPointerUp = () => {
    setIsDraggingProtractor(false);
    setIsRotatingProtractor(false);
  };

  // Laser Firing Logic
  const handleFireLaser = () => {
    const entered = parseFloat(inputDegree);
    if (isNaN(entered) || entered < 0 || entered > 180) {
      playSynthesizerSound('miss');
      setFeedbackDialog({
        title: 'Geçersiz Açı Değeri!',
        message: 'Lütfen 0° ile 180° arasında geçerli bir derece giriniz.',
        type: 'error'
      });
      return;
    }

    setIsFiringLaser(true);
    playSynthesizerSound('laser');

    // Calculate actual laser ray in world degrees
    const firedAbsoluteAngle = currentTarget.baseAngle - entered;
    setLaserShotAngle(firedAbsoluteAngle);

    const diff = Math.abs(entered - currentTarget.degree);
    const isHit = diff <= 1.0; // 1° tolerance

    setTimeout(() => {
      if (isHit) {
        // HIT!
        setLaserHitResult('hit');
        playSynthesizerSound('hit');
        playSynthesizerSound('fanfare');

        const newStreak = streak + 1;
        setStreak(newStreak);
        const multiplier = newStreak >= 3 ? 3 : newStreak >= 2 ? 2 : 1;
        const pts = 100 * multiplier;
        setScore((prev) => prev + pts);
        addPoints(pts);

        if (gameMode === 'team') {
          setTeamScores((prev) => ({
            ...prev,
            [activeTeam]: prev[activeTeam] + pts
          }));
        }

        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        const typeInfo = getAngleTypeInfo(currentTarget.degree);
        setFeedbackDialog({
          title: '🎯 HEDEF KİLİTLENDİ VE VURULDU!',
          message: `Mükemmel atış! ${currentTarget.satelliteName} uydusu ${currentTarget.degree}° (${typeInfo.title}) açıyla başarıyla hizalandı! (+${pts} Puan${multiplier > 1 ? ` • ${multiplier}x Kombo!` : ''})`,
          type: 'success'
        });

        const nextCount = levelTargetCount + 1;
        setLevelTargetCount(nextCount);

        // Check level completion
        if (level < 3 && nextCount >= TARGETS_PER_LEVEL) {
          setTimeout(() => {
            unlockBadge('maarif-genius');
            setLevel((prev) => (prev + 1) as LevelId);
            setLevelTargetCount(0);
            setStreak(0);
          }, 2000);
        } else {
          // Auto load next target after 2s
          setTimeout(() => {
            if (gameMode === 'team') {
              setActiveTeam((prev) => (prev === 'teamA' ? 'teamB' : 'teamA'));
            }
            generateNewTarget(level);
          }, 2200);
        }
      } else {
        // MISS!
        setLaserHitResult('miss');
        playSynthesizerSound('miss');
        setStreak(0);

        const supplementary = 180 - currentTarget.degree;
        const enteredType = getAngleTypeInfo(entered);
        const actualType = getAngleTypeInfo(currentTarget.degree);

        let hint = '';
        if (Math.abs(entered - supplementary) <= 2) {
          hint = `⚠️ Ters Ölçek Yanılgısı! Açımız ${currentTarget.degree}° (${actualType.title}), fakat sen ${entered}° girdin. İletkinin iç ve dış cetvelini karıştırdın. Kolun başladığı 0° cetvelinden okuma yapmalısın!`;
        } else if (enteredType.type !== actualType.type) {
          hint = `🔍 Açımız ${currentTarget.degree}° (${actualType.title}), ancak girdiğin ${entered}° bir ${enteredType.title}. Açının 90° dik açıdan küçük mü büyük mü olduğuna dikkat et!`;
        } else {
          hint = `Açıyı yaklaşık ${Math.round(diff)}° farkla ıskaladın. İletkiyi açının köşe noktasına tam merkezleyip taban koluyla sıfırla!`;
        }

        setFeedbackDialog({
          title: '❌ ISKALANDI! RADAR HİZALANAMADI',
          message: hint,
          type: 'error'
        });

        if (gameMode === 'team') {
          setTimeout(() => {
            setActiveTeam((prev) => (prev === 'teamA' ? 'teamB' : 'teamA'));
          }, 2500);
        }
      }
      setIsFiringLaser(false);
    }, 450);
  };

  // Satellite position calculations
  const satRadius = 210;
  const baseRad = (currentTarget.baseAngle * Math.PI) / 180;
  const targetRad = ((currentTarget.baseAngle - currentTarget.degree) * Math.PI) / 180;

  const baseRayEnd = {
    x: RADAR_CENTER.x + satRadius * Math.cos(baseRad),
    y: RADAR_CENTER.y + satRadius * Math.sin(baseRad)
  };

  const satellitePos = {
    x: RADAR_CENTER.x + satRadius * Math.cos(targetRad),
    y: RADAR_CENTER.y + satRadius * Math.sin(targetRad)
  };

  // Laser beam end point (when fired)
  const laserAngleRad = laserShotAngle !== null ? (laserShotAngle * Math.PI) / 180 : 0;
  const laserBeamEnd = {
    x: RADAR_CENTER.x + 360 * Math.cos(laserAngleRad),
    y: RADAR_CENTER.y + 360 * Math.sin(laserAngleRad)
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none font-sans text-slate-100">
      
      {/* 1. TOP HEADER & RADAR CONTROL BAR */}
      <div className="bg-slate-950/90 backdrop-blur-md rounded-3xl p-5 border border-cyan-500/30 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Title & Level Tag */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-black uppercase tracking-wider">
              <Crosshair className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>AÇI RADARI: HEDEF KİLİTLENDİ</span>
            </span>

            {/* Level Badge */}
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold">
              Seviye {level}: {level === 1 ? 'Çırak Gözlemci' : level === 2 ? 'Dönen Radarlar' : 'Zamana Karşı Av'}
            </span>

            {streak >= 2 && (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black flex items-center gap-1 animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{streak >= 3 ? '3x SÜPER KOMBO' : '2x KOMBO'}</span>
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>📡 Derin Uzay Radar İstasyonu</span>
          </h2>
        </div>

        {/* Center/Right Stats: Score, Team, Sound & Back */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Level Progress Indicator */}
          {level < 3 && (
            <div className="bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-2xl flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <div className="text-xs">
                <span className="text-slate-400">Hedef: </span>
                <span className="font-mono font-black text-cyan-300">{levelTargetCount} / {TARGETS_PER_LEVEL}</span>
              </div>
            </div>
          )}

          {/* Level 3 Countdown Timer */}
          {level === 3 && (
            <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 font-mono font-black text-sm ${
              timeLeft <= 15 ? 'bg-rose-500/20 border-rose-400 text-rose-300 animate-pulse' : 'bg-slate-900 border-slate-700 text-amber-300'
            }`}>
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          )}

          {/* Score Badge */}
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-inner">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div className="text-xs">
              <span className="text-amber-200/80">Skor: </span>
              <span className="font-mono font-black text-amber-300 text-sm">{score} XP</span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all active:scale-95"
            title={soundMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Back to Games Menu */}
          {onBackToMenu && (
            <button
              onClick={onBackToMenu}
              className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition-all active:scale-95"
            >
              Menüye Dön
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN RADAR GAME BOARD & CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT/CENTER (Col 8): RADAR SVG CANVAS WITH INTERACTIVE PROTRACTOR */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="relative bg-[#060b19] rounded-3xl border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
            
            {/* Top Canvas Bar with Target Specs */}
            <div className="bg-slate-950/80 border-b border-cyan-500/30 px-5 py-3 flex items-center justify-between text-xs z-20 relative">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono font-bold text-cyan-300 tracking-wider">
                  KİLİTLENEN HEDEF: <strong className="text-white">{currentTarget.satelliteName}</strong> ({currentTarget.codeName})
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>Taban Açısı: <strong className="text-cyan-300 font-mono">{currentTarget.baseAngle}°</strong></span>
              </div>
            </div>

            {/* SVG RADAR & INTERACTIVE PROTRACTOR VIEWPORT */}
            <svg
              ref={svgCanvasRef}
              viewBox="0 0 760 520"
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              className="w-full h-[460px] sm:h-[500px] select-none touch-none cursor-default"
              style={{ background: 'radial-gradient(circle at 50% 50%, #0a1733 0%, #050a17 100%)' }}
            >
              <defs>
                {/* Radar Grid Glow Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="laserGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* Hologram gradient */}
                <linearGradient id="protGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.82" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.75" />
                </linearGradient>
              </defs>

              {/* 1. Radar Grid Background Lines & Concentric Rings */}
              <g className="opacity-30 pointer-events-none">
                {[60, 120, 180, 240, 300].map((r) => (
                  <circle
                    key={r}
                    cx={RADAR_CENTER.x}
                    cy={RADAR_CENTER.y}
                    r={r}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="1"
                    strokeDasharray="4,6"
                  />
                ))}
                {/* Crosshairs */}
                <line x1="0" y1={RADAR_CENTER.y} x2="760" y2={RADAR_CENTER.y} stroke="#0284c7" strokeWidth="1" />
                <line x1={RADAR_CENTER.x} y1="0" x2={RADAR_CENTER.x} y2="520" stroke="#0284c7" strokeWidth="1" />
                {/* Radial Lines every 45 deg */}
                {[45, 135, 225, 315].map((ang) => {
                  const rad = (ang * Math.PI) / 180;
                  return (
                    <line
                      key={ang}
                      x1={RADAR_CENTER.x - 300 * Math.cos(rad)}
                      y1={RADAR_CENTER.y - 300 * Math.sin(rad)}
                      x2={RADAR_CENTER.x + 300 * Math.cos(rad)}
                      y2={RADAR_CENTER.y + 300 * Math.sin(rad)}
                      stroke="#0284c7"
                      strokeWidth="0.8"
                      strokeDasharray="2,6"
                    />
                  );
                })}
              </g>

              {/* 2. Angle Arms & Target Visual */}
              {/* Guidance Arc (if enabled) */}
              {showGuideLine && (
                <g className="animate-in fade-in duration-200">
                  <path
                    d={`M ${baseRayEnd.x} ${baseRayEnd.y} A ${satRadius} ${satRadius} 0 0 0 ${satellitePos.x} ${satellitePos.y}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="6,4"
                  />
                  <text
                    x={(baseRayEnd.x + satellitePos.x) / 2}
                    y={(baseRayEnd.y + satellitePos.y) / 2 - 10}
                    fill="#f59e0b"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {currentTarget.degree}° ({getAngleTypeInfo(currentTarget.degree).title})
                  </text>
                </g>
              )}

              {/* Base Ray [OV) */}
              <line
                x1={RADAR_CENTER.x}
                y1={RADAR_CENTER.y}
                x2={baseRayEnd.x}
                y2={baseRayEnd.y}
                stroke="#06b6d4"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow)"
              />
              <circle cx={baseRayEnd.x} cy={baseRayEnd.y} r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
              <text
                x={baseRayEnd.x + 14 * Math.cos(baseRad)}
                y={baseRayEnd.y + 14 * Math.sin(baseRad) + 4}
                fill="#06b6d4"
                fontSize="11"
                fontWeight="900"
                textAnchor="middle"
              >
                0° Taban
              </text>

              {/* Target Ray [OS) pointing to Satellite */}
              <line
                x1={RADAR_CENTER.x}
                y1={RADAR_CENTER.y}
                x2={satellitePos.x}
                y2={satellitePos.y}
                stroke="#ec4899"
                strokeWidth="3.5"
                strokeDasharray="6,4"
                className="animate-pulse"
              />

              {/* Radar Center Origin [O] */}
              <circle cx={RADAR_CENTER.x} cy={RADAR_CENTER.y} r="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
              <text x={RADAR_CENTER.x - 12} y={RADAR_CENTER.y + 18} fill="#f59e0b" fontSize="12" fontWeight="900">
                O (Köşe)
              </text>

              {/* SATELLITE ICON & ORBIT PULSE AT SATELLITE POSITION */}
              <g transform={`translate(${satellitePos.x}, ${satellitePos.y})`} className="cursor-pointer">
                {/* Pulsing signal rings */}
                <circle cx="0" cy="0" r="22" fill="none" stroke="#ec4899" strokeWidth="1.5" className="animate-ping opacity-60" />
                <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
                
                {/* Satellite Body & Solar Panels */}
                <rect x="-14" y="-4" width="28" height="8" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                <rect x="-5" y="-8" width="10" height="16" rx="2" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="2.5" fill="#ef4444" className="animate-pulse" />

                {/* Satellite Name Tag */}
                <g transform="translate(0, -22)">
                  <rect x="-42" y="-12" width="84" height="18" rx="6" fill="#090d16" stroke="#ec4899" strokeWidth="1.2" />
                  <text x="0" y="1" fill="#f472b6" fontSize="9" fontWeight="900" textAnchor="middle">
                    📡 {currentTarget.codeName}
                  </text>
                </g>
              </g>

              {/* 3. FIRED LASER BEAM ANIMATION */}
              {isFiringLaser && laserShotAngle !== null && (
                <g filter="url(#laserGlow)">
                  <line
                    x1={RADAR_CENTER.x}
                    y1={RADAR_CENTER.y}
                    x2={laserBeamEnd.x}
                    y2={laserBeamEnd.y}
                    stroke={laserHitResult === 'hit' ? '#10b981' : '#f43f5e'}
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  {laserHitResult === 'hit' && (
                    <circle cx={satellitePos.x} cy={satellitePos.y} r="28" fill="#10b981" fillOpacity="0.5" className="animate-ping" />
                  )}
                </g>
              )}

              {/* 4. SANAL İLETKİ (INTERACTIVE PROTRACTOR) */}
              <g
                transform={`translate(${protractorPos.x}, ${protractorPos.y}) rotate(${protractorAngle})`}
                className="cursor-move select-none"
              >
                {/* Protractor Semi-Circle Glass Body */}
                <path
                  d="M 0 0 L 155 0 A 155 155 0 0 0 -155 0 Z"
                  fill="url(#protGrad)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  onPointerDown={handleProtractorPointerDown}
                  className="transition-opacity hover:opacity-95"
                />

                {/* Inner Cutout */}
                <path
                  d="M 0 0 L 68 0 A 68 68 0 0 0 -68 0 Z"
                  fill="#060b19"
                  fillOpacity="0.88"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  onPointerDown={handleProtractorPointerDown}
                />

                {/* Degree Tick Marks & Numbers (Both Clockwise and Counter-Clockwise) */}
                {[0, 10, 20, 30, 40, 45, 50, 60, 70, 80, 90, 100, 110, 120, 130, 135, 140, 150, 160, 170, 180].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  const isMajor = deg % 30 === 0 || deg === 45 || deg === 90 || deg === 135;
                  const isRight = deg === 90;
                  const tickLen = isRight ? 16 : isMajor ? 12 : 7;
                  
                  const x1 = (155 - tickLen) * Math.cos(-rad);
                  const y1 = (155 - tickLen) * Math.sin(-rad);
                  const x2 = 155 * Math.cos(-rad);
                  const y2 = 155 * Math.sin(-rad);

                  // Outer scale text (0 to 180 CCW)
                  const txOut = (155 - 24) * Math.cos(-rad);
                  const tyOut = (155 - 24) * Math.sin(-rad);

                  // Inner scale text (180 to 0 CW)
                  const txIn = (75 + 14) * Math.cos(-rad);
                  const tyIn = (75 + 14) * Math.sin(-rad);

                  return (
                    <g key={deg} className="pointer-events-none">
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isRight ? '#fbbf24' : '#e0f2fe'}
                        strokeWidth={isMajor ? 2 : 1}
                      />
                      {isMajor && (
                        <>
                          {/* Outer reading (White) */}
                          <text
                            x={txOut}
                            y={tyOut + 3}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="8"
                            fontWeight="900"
                          >
                            {deg}°
                          </text>
                          {/* Inner reading (Cyan / Reverse) */}
                          <text
                            x={txIn}
                            y={tyIn + 3}
                            textAnchor="middle"
                            fill="#67e8f9"
                            fontSize="7"
                            fontWeight="bold"
                          >
                            {180 - deg}°
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}

                {/* Center Crosshair Marker (+) */}
                <g className="pointer-events-none">
                  <line x1="-12" y1="0" x2="12" y2="0" stroke="#fbbf24" strokeWidth="2" />
                  <line x1="0" y1="-12" x2="0" y2="4" stroke="#fbbf24" strokeWidth="2" />
                  <circle cx="0" cy="0" r="3" fill="#fbbf24" stroke="#000" strokeWidth="1" />
                </g>

                {/* 360° ROTATION PIVOT HANDLE (AT THE TOP OF SEMI-CIRCLE) */}
                <g
                  transform="translate(0, -165)"
                  onPointerDown={handleRotationHandlePointerDown}
                  className="cursor-grab active:cursor-grabbing group"
                >
                  <circle cx="0" cy="0" r="16" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" className="shadow-lg animate-pulse" />
                  <RotateCw className="w-5 h-5 text-slate-950 pointer-events-none" style={{ transform: 'translate(-10px, -10px)' }} />
                  <text x="0" y="-20" fill="#fde68a" fontSize="9" fontWeight="900" textAnchor="middle">
                    Döndür ({protractorAngle}°)
                  </text>
                </g>
              </g>

            </svg>

            {/* Quick Helper Floating Bar inside Canvas */}
            <div className="bg-slate-950/90 border-t border-slate-800 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={snapProtractorToCenter}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1.5 active:scale-95"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Köşeye Mıknatısla</span>
                </button>

                {level >= 2 && (
                  <button
                    onClick={alignProtractorToBase}
                    className="px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 font-bold flex items-center gap-1.5 active:scale-95"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Tabana Hizala ({currentTarget.baseAngle}°)</span>
                  </button>
                )}

                <button
                  onClick={() => setShowGuideLine(!showGuideLine)}
                  className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all ${
                    showGuideLine
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {showGuideLine ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showGuideLine ? 'Rehber Çizgiyi Kapat' : 'Rehber Çizgiyi Aç'}</span>
                </button>
              </div>

              {/* Angle Rotation Step Controls */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400 font-bold mr-1">İletki Açısı:</span>
                <button
                  onClick={() => setProtractorAngle((prev) => (prev - 15 + 360) % 360)}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 text-xs font-mono font-bold"
                >
                  -15°
                </button>
                <button
                  onClick={() => setProtractorAngle((prev) => (prev - 1 + 360) % 360)}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 text-xs font-mono font-bold"
                >
                  -1°
                </button>
                <span className="font-mono font-black text-cyan-300 px-1.5 text-xs">{protractorAngle}°</span>
                <button
                  onClick={() => setProtractorAngle((prev) => (prev + 1) % 360)}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 text-xs font-mono font-bold"
                >
                  +1°
                </button>
                <button
                  onClick={() => setProtractorAngle((prev) => (prev + 15) % 360)}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 text-xs font-mono font-bold"
                >
                  +15°
                </button>
              </div>
            </div>

          </div>

          {/* Diagnostic Feedback Alert Dialog */}
          {feedbackDialog && (
            <div
              className={`p-4 rounded-3xl border-2 text-xs flex items-start gap-3 shadow-lg animate-in slide-in-from-top-2 ${
                feedbackDialog.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100'
                  : 'bg-rose-950/80 border-rose-500 text-rose-100'
              }`}
            >
              {feedbackDialog.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 flex-1">
                <div className="font-black text-sm">{feedbackDialog.title}</div>
                <div className="leading-relaxed text-xs">{feedbackDialog.message}</div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN (Col 4): LASER FIRING CONSOLE & DEGREE CONTROLS */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Main Firing Console */}
          <div className="bg-slate-950/90 rounded-3xl p-6 border-2 border-cyan-500/30 shadow-xl space-y-5">
            
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Hedefleme & Ateşleme Konsolu</span>
              </div>
              <h3 className="text-lg font-black text-white">Ölçülen Açıyı Giriniz</h3>
              <p className="text-xs text-slate-400">
                İletkiyle ölçtüğünüz açıyı derece olarak kutuya yazın ve lazeri ateşleyin.
              </p>
            </div>

            {/* Big Degree Input with Stepper Buttons */}
            <div className="space-y-3">
              
              <div className="flex items-center justify-center gap-2">
                
                {/* -10 Step */}
                <button
                  onClick={() => {
                    playSynthesizerSound('click');
                    const val = Math.max(0, (parseFloat(inputDegree) || 0) - 10);
                    setInputDegree(val.toString());
                  }}
                  className="w-11 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs active:scale-95"
                >
                  -10°
                </button>

                {/* -1 Step */}
                <button
                  onClick={() => {
                    playSynthesizerSound('click');
                    const val = Math.max(0, (parseFloat(inputDegree) || 0) - 1);
                    setInputDegree(val.toString());
                  }}
                  className="w-10 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs active:scale-95"
                >
                  -1°
                </button>

                {/* The Input Box with prominent degree symbol */}
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={inputDegree}
                    onChange={(e) => setInputDegree(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFireLaser();
                    }}
                    placeholder="?"
                    className="w-28 h-14 text-center font-mono font-black text-3xl rounded-2xl bg-slate-900 border-2 border-cyan-400 text-cyan-300 focus:ring-4 focus:ring-cyan-500/30 outline-none shadow-inner"
                  />
                  <span className="absolute right-3 top-3.5 text-xl font-bold text-cyan-500 pointer-events-none">°</span>
                </div>

                {/* +1 Step */}
                <button
                  onClick={() => {
                    playSynthesizerSound('click');
                    const val = Math.min(180, (parseFloat(inputDegree) || 0) + 1);
                    setInputDegree(val.toString());
                  }}
                  className="w-10 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs active:scale-95"
                >
                  +1°
                </button>

                {/* +10 Step */}
                <button
                  onClick={() => {
                    playSynthesizerSound('click');
                    const val = Math.min(180, (parseFloat(inputDegree) || 0) + 10);
                    setInputDegree(val.toString());
                  }}
                  className="w-11 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs active:scale-95"
                >
                  +10°
                </button>
              </div>

              {/* Range Slider for rapid adjustment */}
              <div className="space-y-1 pt-1">
                <input
                  type="range"
                  min="0"
                  max="180"
                  value={parseFloat(inputDegree) || 0}
                  onChange={(e) => setInputDegree(e.target.value)}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0° (Sıfır)</span>
                  <span>90° (Dik)</span>
                  <span>180° (Doğru)</span>
                </div>
              </div>

              {/* Quick Preset Buttons for Common Angles */}
              <div className="pt-2">
                <div className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-wider">
                  Hızlı Seçim Tuşları:
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[30, 45, 60, 90, 120, 135, 150, 180].map((deg) => (
                    <button
                      key={deg}
                      onClick={() => {
                        playSynthesizerSound('click');
                        setInputDegree(deg.toString());
                      }}
                      className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 font-mono text-xs font-bold transition-all active:scale-95"
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* BIG LAZERİ ATEŞLE BUTTON */}
            <button
              onClick={handleFireLaser}
              disabled={isFiringLaser || !inputDegree.trim()}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:via-teal-400 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-sm tracking-wide uppercase shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>{isFiringLaser ? 'Lazer Ateşleniyor...' : 'LAZERİ ATEŞLE 🚀'}</span>
            </button>

            {/* Answer Reveal & Reset Tools */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setShowAnswerCard(!showAnswerCard)}
                className="text-xs text-slate-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showAnswerCard ? 'Cevabı Gizle' : 'Cevabı Göster'}</span>
              </button>

              <button
                onClick={() => generateNewTarget(level)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
              >
                <ResetIcon className="w-3.5 h-3.5" />
                <span>Yeni Hedef Türet</span>
              </button>
            </div>

            {/* Answer Reveal Card */}
            {showAnswerCard && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs space-y-1.5 animate-in fade-in">
                <div className="font-black text-amber-300 flex items-center justify-between">
                  <span>Doğru Açı: {currentTarget.degree}°</span>
                  <span className="bg-amber-400/20 px-2 py-0.5 rounded text-[10px]">
                    {getAngleTypeInfo(currentTarget.degree).title}
                  </span>
                </div>
                <p className="text-[11px] text-amber-100/80 leading-relaxed">
                  Taban kolu {currentTarget.baseAngle}° yönünde hizalıdır. İletkinin merkezini köşe noktasına koyup taban kolundan hedefe doğru sayıldığında {currentTarget.degree}° ölçülür.
                </p>
              </div>
            )}

          </div>

          {/* Level Switcher & Challenge Modes */}
          <div className="bg-slate-950/80 rounded-3xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Seviye Seçimi
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 1, label: '1. Seviye', sub: 'Yatay' },
                { id: 2, label: '2. Seviye', sub: 'Eğik / 360°' },
                { id: 3, label: '3. Seviye', sub: '90s Zaman' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => {
                    playSynthesizerSound('click');
                    setLevel(lvl.id as LevelId);
                    setLevelTargetCount(0);
                  }}
                  className={`p-2.5 rounded-2xl text-left border transition-all ${
                    level === lvl.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-black'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">{lvl.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{lvl.sub}</div>
                </button>
              ))}
            </div>

            {/* Optional Team Mode (A Takımı vs B Takımı) */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sınıf / Takım Modu:</span>
              </span>
              <button
                onClick={() => {
                  playSynthesizerSound('click');
                  setGameMode(gameMode === 'single' ? 'team' : 'single');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                  gameMode === 'team'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-900 text-slate-500 border border-slate-700'
                }`}
              >
                {gameMode === 'team' ? 'Açık 👥' : 'Kapalı'}
              </button>
            </div>

            {gameMode === 'team' && (
              <div className="grid grid-cols-2 gap-2 pt-1 animate-in fade-in">
                <div className={`p-2.5 rounded-xl border text-center ${activeTeam === 'teamA' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  <div className="text-[11px]">A Takımı</div>
                  <div className="text-sm font-mono font-bold mt-0.5">{teamScores.teamA} XP</div>
                </div>
                <div className={`p-2.5 rounded-xl border text-center ${activeTeam === 'teamB' ? 'bg-pink-500/20 border-pink-400 text-pink-300 font-black' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  <div className="text-[11px]">B Takımı</div>
                  <div className="text-sm font-mono font-bold mt-0.5">{teamScores.teamB} XP</div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
