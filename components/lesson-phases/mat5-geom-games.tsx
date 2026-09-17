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
  Minus,
  Plus
} from 'lucide-react';
import { getStoredActiveBoardStudent, clearActiveBoardStudent, saveBoardParticipation } from '@/lib/board-participation-store';
import { useAuth } from '@/lib/auth-store';

// =================================================================
// WEB AUDIO API SOUND SYNTHESIZER (No external audio file dependency)
// =================================================================
class GeometrySoundSynth {
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

  playSnap() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playLaserReflect() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.28);
  }

  playCompass() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(680, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playTrainWhistle() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
    osc2.frequency.setValueAtTime(739.99, this.ctx.currentTime); // F#5
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.45);
    osc2.stop(this.ctx.currentTime + 0.45);
  }

  playFoghorn() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(130, this.ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }

  playSuccessFanfare() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.2, this.ctx!.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.25);
    });
  }

  playError() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }
}

const soundSynth = new GeometrySoundSynth();

// =================================================================
// =================================================================
// 1. OYUN: LAZER KALKANI: DİKME SAVUNMASI (Profesyonel Sanal Gönye Simülasyonu)
// =================================================================
interface LaserLevel {
  id: number;
  name: string;
  sub: string;
  laserAngle: number;
  laserP1: { x: number; y: number };
  laserP2: { x: number; y: number };
  towerPos: { x: number; y: number };
  targetPerpAngle: number; // angle of perpendicular ray from tower to line
  dronePos: { x: number; y: number };
}

const LASER_LEVELS: LaserLevel[] = [
  {
    id: 1,
    name: 'Seviye 1: Düz Hat Savunması (0° Yatay Lazer)',
    sub: 'Yatay lazer doğrusuna (d) savunma kulesinden (K) tam 90° dikme indir!',
    laserAngle: 0,
    laserP1: { x: 30, y: 280 },
    laserP2: { x: 570, y: 280 },
    towerPos: { x: 300, y: 80 },
    targetPerpAngle: 90,
    dronePos: { x: 50, y: 280 }
  },
  {
    id: 2,
    name: 'Seviye 2: Çapraz Saldırı (45° Eğimli Lazer)',
    sub: '45° eğik gelen lazer doğrusuna gönyeyi döndürüp (135°) yaslayarak 90° dikme indir!',
    laserAngle: -45,
    laserP1: { x: 70, y: 370 },
    laserP2: { x: 490, y: 50 },
    towerPos: { x: 390, y: 80 },
    targetPerpAngle: 135,
    dronePos: { x: 90, y: 350 }
  },
  {
    id: 3,
    name: 'Seviye 3: Kritik Ters Eğim (30° Eğimli Lazer)',
    sub: '30° eğimle aşağı inen lazer doğrusuna gönyeyi yaslayıp (30°) kuleden dikme indir!',
    laserAngle: 30,
    laserP1: { x: 50, y: 110 },
    laserP2: { x: 550, y: 399 },
    towerPos: { x: 320, y: 360 },
    targetPerpAngle: 30,
    dronePos: { x: 70, y: 122 }
  }
];

export function LaserShieldDefenseGame({ onComplete }: { onComplete?: () => void }) {
  const { addPoints, unlockBadge } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [gonyeAngle, setGonyeAngle] = useState(0);
  const [gonyePos, setGonyePos] = useState({ x: 160, y: 260 });
  const [isAimingSnap, setIsAimingSnap] = useState(false);
  const [isPerpendicularDrawn, setIsPerpendicularDrawn] = useState(false);
  const [isReflected, setIsReflected] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDraggingGonye, setIsDraggingGonye] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const level = LASER_LEVELS[currentLevelIdx];

  // Laser line vector and angle
  const dx = level.laserP2.x - level.laserP1.x;
  const dy = level.laserP2.y - level.laserP1.y;
  const rawLineAngle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
  const normalizedLineAngle = Math.round(((rawLineAngle % 180) + 180) % 180);

  // Calculate perpendicular foot H on the laser line (orthogonal projection of tower K)
  const lenSq = dx * dx + dy * dy;
  const t = ((level.towerPos.x - level.laserP1.x) * dx + (level.towerPos.y - level.laserP1.y) * dy) / lenSq;
  const perpFoot = {
    x: level.laserP1.x + t * dx,
    y: level.laserP1.y + t * dy
  };

  // Cross product to find whether tower is above (-1) or below (+1) the line
  const cross = dx * (level.towerPos.y - level.laserP1.y) - dy * (level.towerPos.x - level.laserP1.x);
  const towerSide = cross >= 0 ? 1 : -1;

  // 1. Angle Alignment: Gönye base parallel to laser line d (either 0° or 180° difference)
  const angleDiff = Math.abs(((gonyeAngle - normalizedLineAngle) % 180 + 180) % 180);
  const isAngleAligned = angleDiff <= 8 || angleDiff >= 172;

  // 2. Position Alignment: Gönye 90° corner must be close to perpendicular foot H
  const distToFoot = Math.hypot(gonyePos.x - perpFoot.x, gonyePos.y - perpFoot.y);
  const isPositionAligned = distToFoot <= 38;

  // 3. Complete Alignment: Both angle and position must be aligned
  const isReadyToDefend = isAngleAligned && isPositionAligned;

  // Level reset effect
  useEffect(() => {
    const lvl = LASER_LEVELS[currentLevelIdx];
    const curDx = lvl.laserP2.x - lvl.laserP1.x;
    const curDy = lvl.laserP2.y - lvl.laserP1.y;

    // Initial position: sitting visibly on the left side of the laser line
    setGonyePos({
      x: Math.round(lvl.laserP1.x + 0.2 * curDx),
      y: Math.round(lvl.laserP1.y + 0.2 * curDy)
    });
    setGonyeAngle(0);
    setIsPerpendicularDrawn(false);
    setIsReflected(false);
    setIsAimingSnap(false);
    setActionFeedback(null);
  }, [currentLevelIdx]);

  // Convert screen coordinates to SVG viewBox (0..600, 0..400) coordinates
  const getSvgPoint = (clientX: number, clientY: number) => {
    if (!svgRef.current) return null;
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return null;
    return pt.matrixTransform(ctm.inverse());
  };

  // Auto snap Gönye to the exact perpendicular position on line d at point H
  const handleSnapGonye = () => {
    soundSynth.playSnap();
    setGonyeAngle(normalizedLineAngle);
    setGonyePos(perpFoot);
    setIsAimingSnap(true);
    setActionFeedback(null);
  };

  const handleQuickRotate = (delta: number) => {
    soundSynth.playCompass();
    setGonyeAngle((prev) => (prev + delta + 360) % 360);
    setIsAimingSnap(false);
    setActionFeedback(null);
  };

  const handleSetPresetAngle = (deg: number) => {
    soundSynth.playCompass();
    setGonyeAngle(deg);
    setIsAimingSnap(false);
    setActionFeedback(null);
  };

  const handlePointerDownGonye = (e: React.PointerEvent) => {
    if (isReflected) return;
    const pt = getSvgPoint(e.clientX, e.clientY);
    if (pt) {
      setIsDraggingGonye(true);
      setDragOffset({
        x: pt.x - gonyePos.x,
        y: pt.y - gonyePos.y
      });
      setActionFeedback(null);
    }
  };

  const handlePointerMoveContainer = (e: React.PointerEvent) => {
    if (!isDraggingGonye || isReflected) return;
    const pt = getSvgPoint(e.clientX, e.clientY);
    if (pt) {
      const newX = Math.max(30, Math.min(570, pt.x - dragOffset.x));
      const newY = Math.max(30, Math.min(370, pt.y - dragOffset.y));
      setGonyePos({ x: newX, y: newY });

      // Proximity auto-snap if near perpendicular foot H and aligned
      const curDist = Math.hypot(newX - perpFoot.x, newY - perpFoot.y);
      if (curDist < 25 && isAngleAligned) {
        setGonyePos(perpFoot);
        setGonyeAngle(normalizedLineAngle);
      }
    }
  };

  const handlePointerUpContainer = () => {
    setIsDraggingGonye(false);
  };

  const handleDropPerpendicular = () => {
    if (isReflected) return;

    if (!isAngleAligned) {
      soundSynth.playError();
      setActionFeedback('⚠️ Önce gönyeyi doğruya yaslayınız (açıyı ayarlayınız)!');
      setLives((prev) => {
        const next = prev - 1;
        if (next <= 0) setIsGameOver(true);
        return Math.max(0, next);
      });
      return;
    }

    if (!isPositionAligned) {
      soundSynth.playError();
      setActionFeedback('⚠️ Açı doğru! Şimdi gönyeyi kule hizasındaki dikme ayağına (H) sürükleyiniz!');
      return;
    }

    // Both angle and position are correctly aligned
    setActionFeedback(null);
    setGonyePos(perpFoot);
    setGonyeAngle(normalizedLineAngle);

    soundSynth.playSnap();
    soundSynth.playLaserReflect();
    setIsPerpendicularDrawn(true);
    setIsReflected(true);
    setScore((prev) => prev + 100);

    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    setTimeout(() => {
      if (currentLevelIdx < LASER_LEVELS.length - 1) {
        setCurrentLevelIdx((prev) => prev + 1);
      } else {
        setIsCompleted(true);
        soundSynth.playSuccessFanfare();
        addPoints(100);
        unlockBadge('laser-master');

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
            activityTitle: 'Lazer Kalkanı: Dikme Savunması',
            outcomeCode: 'MAT.5.3.1',
            score: 100,
            maxScore: 100,
            xpEarned: 100
          });
          clearActiveBoardStudent();
        }

        if (onComplete) onComplete();
      }
    }, 1800);
  };

  const handleReset = () => {
    setCurrentLevelIdx(0);
    setGonyeAngle(0);
    setIsPerpendicularDrawn(false);
    setIsReflected(false);
    setIsAimingSnap(false);
    setLives(3);
    setScore(0);
    setIsGameOver(false);
    setIsCompleted(false);
    setActionFeedback(null);
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-7 border-2 border-teal-500/40 shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-black uppercase">
            <Zap className="w-3.5 h-3.5" />
            <span>1. Oyun • Lazer Kalkanı: Dikme Savunması</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>🛡️</span> {level.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{level.sub}</p>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${
                  i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-600'
                }`}
              />
            ))}
          </div>
          <div className="bg-slate-900 px-3.5 py-1.5 rounded-xl border border-teal-500/30 font-mono font-black text-amber-400 text-sm">
            ⚡ {score} Puan
          </div>
        </div>
      </div>

      {/* Cyber City Arena Canvas */}
      <div
        className="relative w-full h-[370px] sm:h-[430px] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-2xl border-2 border-slate-800 overflow-hidden select-none touch-none"
      >
        <svg
          ref={svgRef}
          onPointerMove={handlePointerMoveContainer}
          onPointerUp={handlePointerUpContainer}
          className="w-full h-full cursor-crosshair select-none"
          viewBox="0 0 600 400"
        >
          <defs>
            <pattern id="cyber-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(13, 148, 136, 0.09)" strokeWidth="1" />
            </pattern>
            <linearGradient id="reflectLaser" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#cyber-grid)" />

          {/* Enemy Assault Drone */}
          <g transform={`translate(${level.dronePos.x}, ${level.dronePos.y})`}>
            <circle cx="0" cy="0" r="16" fill="#881337" stroke="#f43f5e" strokeWidth="2.5" className="animate-pulse" />
            <polygon points="-8,-6 8,0 -8,6" fill="#fecdd3" />
            <text x="0" y="-22" textAnchor="middle" fill="#fb7185" fontSize="10" fontWeight="900">
              Saldırı Dronu
            </text>
          </g>

          {/* TARGET LASER LINE (Always 100% visible with multi-layer high-contrast styling) */}
          {/* Layer 1: Broad Red Glow Aura */}
          <line
            x1={level.laserP1.x}
            y1={level.laserP1.y}
            x2={level.laserP2.x}
            y2={level.laserP2.y}
            stroke="#f43f5e"
            strokeWidth={isReflected ? '4' : '12'}
            strokeOpacity={isReflected ? '0.3' : '0.55'}
            strokeLinecap="round"
          />
          {/* Layer 2: Core Crimson Laser Beam */}
          <line
            x1={level.laserP1.x}
            y1={level.laserP1.y}
            x2={level.laserP2.x}
            y2={level.laserP2.y}
            stroke="#ef4444"
            strokeWidth={isReflected ? '2.5' : '6'}
            strokeDasharray={isReflected ? '6 6' : 'none'}
            strokeLinecap="round"
          />
          {/* Layer 3: Ultra-Bright White Core Beam */}
          {!isReflected && (
            <line
              x1={level.laserP1.x}
              y1={level.laserP1.y}
              x2={level.laserP2.x}
              y2={level.laserP2.y}
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.95"
              strokeLinecap="round"
            />
          )}

          {/* Pulsing Laser Core Particles */}
          {!isReflected && (
            <>
              <circle
                cx={level.laserP1.x + 0.35 * dx}
                cy={level.laserP1.y + 0.35 * dy}
                r="5"
                fill="#ffffff"
                className="animate-ping"
              />
              <circle
                cx={level.laserP1.x + 0.7 * dx}
                cy={level.laserP1.y + 0.7 * dy}
                r="5"
                fill="#ffffff"
                className="animate-ping"
              />
            </>
          )}

          {/* Laser Line Label (d Doğrusu) */}
          <text
            x={level.laserP2.x - 20}
            y={level.laserP2.y - 14}
            fill="#f43f5e"
            fontSize="12"
            fontWeight="900"
            fontFamily="monospace"
          >
            d Doğrusu (Lazer Hattı)
          </text>

          {/* Defense Tower (K Noktası) */}
          <g transform={`translate(${level.towerPos.x}, ${level.towerPos.y})`}>
            <circle cx="0" cy="0" r="22" fill="rgba(13, 148, 136, 0.25)" stroke="#14b8a6" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="9" fill="#2dd4bf" />
            <text x="0" y="5" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="900">
              K
            </text>
            <text x="0" y={towerSide > 0 ? 36 : -30} textAnchor="middle" fill="#5eead4" fontSize="11" fontWeight="900">
              Savunma Kulesi (K)
            </text>
          </g>

          {/* Alignment Target Foot Hint (shown when angle is aligned but position not yet reached) */}
          {isAngleAligned && !isPositionAligned && !isPerpendicularDrawn && (
            <g className="animate-pulse">
              {/* Dashed guide line from K to H */}
              <line
                x1={level.towerPos.x}
                y1={level.towerPos.y}
                x2={perpFoot.x}
                y2={perpFoot.y}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeOpacity="0.7"
              />
              {/* Target Foot H circle */}
              <circle cx={perpFoot.x} cy={perpFoot.y} r="14" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx={perpFoot.x} cy={perpFoot.y} r="5" fill="#38bdf8" />
              <text
                x={perpFoot.x + 16}
                y={perpFoot.y + (towerSide > 0 ? -12 : 16)}
                fill="#38bdf8"
                fontSize="11"
                fontWeight="900"
              >
                H (Buraya Kaydır)
              </text>
            </g>
          )}

          {/* Dropped Perpendicular (KH Doğru Parçası) */}
          {isPerpendicularDrawn && (
            <g>
              <line
                x1={level.towerPos.x}
                y1={level.towerPos.y}
                x2={perpFoot.x}
                y2={perpFoot.y}
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Foot Point H */}
              <circle cx={perpFoot.x} cy={perpFoot.y} r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <text
                x={perpFoot.x + 14}
                y={perpFoot.y + (towerSide > 0 ? -14 : 18)}
                fill="#34d399"
                fontSize="11"
                fontWeight="900"
              >
                H (Dikme Ayağı)
              </text>

              {/* 90° Right Angle Marker Box */}
              <g transform={`translate(${perpFoot.x}, ${perpFoot.y}) rotate(${rawLineAngle})`}>
                <rect
                  x="-14"
                  y={towerSide > 0 ? '0' : '-14'}
                  width="14"
                  height="14"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                />
                <circle cx="-7" cy={towerSide > 0 ? 7 : -7} r="2" fill="#22c55e" />
                <text
                  x="-7"
                  y={towerSide > 0 ? 28 : -20}
                  textAnchor="middle"
                  fill="#86efac"
                  fontSize="11"
                  fontWeight="900"
                >
                  90° [KH] ⊥ d
                </text>
              </g>

              {/* Energy Shield Barrier Bloom */}
              <circle cx={perpFoot.x} cy={perpFoot.y} r="35" fill="none" stroke="#22d3ee" strokeWidth="4" className="animate-ping" />
            </g>
          )}

          {/* Reflected Laser Ray */}
          {isReflected && (
            <line
              x1={perpFoot.x}
              y1={perpFoot.y}
              x2={level.dronePos.x}
              y2={level.dronePos.y}
              stroke="url(#reflectLaser)"
              strokeWidth="5"
              strokeLinecap="round"
            />
          )}

          {/* Virtual Set Square (Sanal Gönye) Rendered Inside SVG */}
          <g
            transform={`translate(${gonyePos.x}, ${gonyePos.y}) rotate(${gonyeAngle})`}
            className="cursor-grab active:cursor-grabbing pointer-events-auto select-none"
            onPointerDown={handlePointerDownGonye}
          >
            {/* Glow / Outline when Ready */}
            {isReadyToDefend && (
              <polygon
                points={`0,0 145,0 0,${towerSide > 0 ? 100 : -100}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeOpacity="0.5"
                className="animate-pulse"
              />
            )}

            {/* Outer Triangle Body */}
            <polygon
              points={`0,0 140,0 0,${towerSide > 0 ? 95 : -95}`}
              fill={
                isReadyToDefend
                  ? 'rgba(16, 185, 129, 0.45)'
                  : isAngleAligned
                  ? 'rgba(245, 158, 11, 0.35)'
                  : 'rgba(56, 189, 248, 0.30)'
              }
              stroke={
                isReadyToDefend
                  ? '#10b981'
                  : isAngleAligned
                  ? '#f59e0b'
                  : '#38bdf8'
              }
              strokeWidth="2.5"
            />

            {/* Inner Triangle Cutout */}
            <polygon
              points={`16,${towerSide > 0 ? 14 : -14} 95,${towerSide > 0 ? 14 : -14} 16,${towerSide > 0 ? 68 : -68}`}
              fill="rgba(15, 23, 42, 0.94)"
              stroke={isReadyToDefend ? '#059669' : '#0284c7'}
              strokeWidth="1.5"
            />

            {/* 90° Corner Symbol at (0, 0) */}
            <polyline
              points={`0,${towerSide > 0 ? 16 : -16} 16,${towerSide > 0 ? 16 : -16} 16,0`}
              fill="none"
              stroke={isReadyToDefend ? '#22c55e' : isAngleAligned ? '#f59e0b' : '#38bdf8'}
              strokeWidth="2.5"
            />
            <circle
              cx="8"
              cy={towerSide > 0 ? 8 : -8}
              r="2.5"
              fill={isReadyToDefend ? '#22c55e' : isAngleAligned ? '#f59e0b' : '#38bdf8'}
            />

            {/* Millimeter Ticks along Ruler Base */}
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={i}
                x1={15 + i * 11}
                y1="0"
                x2={15 + i * 11}
                y2={towerSide > 0 ? (i % 2 === 0 ? '8' : '5') : (i % 2 === 0 ? '-8' : '-5')}
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
            ))}

            {/* Label */}
            <text
              x="45"
              y={towerSide > 0 ? 32 : -32}
              fill="#f8fafc"
              fontSize="8.5"
              fontWeight="900"
              transform={`rotate(${towerSide > 0 ? 34 : -34}, 45, ${towerSide > 0 ? 32 : -32})`}
              textAnchor="middle"
            >
              SANAL GÖNYE (90°)
            </text>

            {/* 90° Corner Apex Dot */}
            <circle
              cx="0"
              cy="0"
              r="5.5"
              fill={isReadyToDefend ? '#22c55e' : isAngleAligned ? '#f59e0b' : '#38bdf8'}
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>
        </svg>

        {/* Live Alignment Status Badge */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-slate-900/95 border border-slate-700 px-3.5 py-2.5 rounded-xl text-xs flex flex-wrap items-center gap-2.5 backdrop-blur-md shadow-lg">
          <div
            className={`w-3 h-3 rounded-full shrink-0 ${
              isReadyToDefend
                ? 'bg-emerald-400 animate-ping'
                : isAngleAligned
                ? 'bg-amber-400'
                : 'bg-rose-400'
            }`}
          />
          <span className="font-bold text-slate-300">
            Açı: <span className="font-mono text-teal-300 font-extrabold">{gonyeAngle}°</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span
            className={
              isReadyToDefend
                ? 'text-emerald-400 font-black'
                : isAngleAligned
                ? 'text-amber-300 font-bold'
                : 'text-slate-400'
            }
          >
            {isReadyToDefend
              ? '✓ DİKLİK KİLİTLENDİ (90° Dikme İndirebilirsiniz!)'
              : isAngleAligned
              ? '👆 Açı Tamam! Gönyeyi Dikme Ayağına (H) Sürükleyiniz'
              : '1. Adım: Gönyeyi Lazer Doğrusuna Yaslayınız (Açıyı Ayarlayınız)'}
          </span>
        </div>
      </div>

      {/* Action Feedback Warning Banner */}
      {actionFeedback && (
        <div className="px-4 py-2.5 rounded-xl bg-amber-950/80 border border-amber-500 text-amber-200 text-xs font-bold animate-in fade-in flex items-center justify-between gap-2">
          <span>{actionFeedback}</span>
          <button
            onClick={() => setActionFeedback(null)}
            className="px-2 py-0.5 rounded-lg bg-amber-800 text-amber-100 text-[11px] font-bold"
          >
            Kapat
          </button>
        </div>
      )}

      {/* Interactive Controls Bar */}
      <div className="space-y-2.5 bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-800">
        {/* Preset Angle Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs font-bold text-slate-300">
          <span className="text-slate-400 text-[11px]">Hızlı Açı:</span>
          {[0, 30, 45, 60, 90, 120, 135, 150, 180].map((deg) => (
            <button
              key={deg}
              type="button"
              onClick={() => handleSetPresetAngle(deg)}
              disabled={isReflected}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                gonyeAngle % 180 === deg
                  ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {deg}°
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-center">
          {/* Rotation Wheel & Fine Slider (5 cols) */}
          <div className="lg:col-span-5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
                Gönye Açısı:
              </span>
              <span className="font-mono text-teal-300 font-extrabold">{gonyeAngle}°</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleQuickRotate(-15)}
                disabled={isReflected}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 active:scale-95 cursor-pointer"
                title="-15° Döndür"
              >
                -15°
              </button>
              <button
                onClick={() => handleQuickRotate(-5)}
                disabled={isReflected}
                className="px-1.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 active:scale-95 cursor-pointer"
                title="-5° Hassas Ayar"
              >
                -5°
              </button>
              <input
                type="range"
                min="0"
                max="180"
                value={gonyeAngle % 180}
                onChange={(e) => {
                  setGonyeAngle(Number(e.target.value));
                  soundSynth.playCompass();
                  setActionFeedback(null);
                }}
                disabled={isReflected}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
              <button
                onClick={() => handleQuickRotate(5)}
                disabled={isReflected}
                className="px-1.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 active:scale-95 cursor-pointer"
                title="+5° Hassas Ayar"
              >
                +5°
              </button>
              <button
                onClick={() => handleQuickRotate(15)}
                disabled={isReflected}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 active:scale-95 cursor-pointer"
                title="+15° Döndür"
              >
                +15°
              </button>
            </div>
          </div>

          {/* Magnetic Snap Helper Button (3 cols) */}
          <div className="lg:col-span-3">
            <button
              onClick={handleSnapGonye}
              disabled={isReflected}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40 text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Target className="w-4 h-4 text-teal-400" />
              <span>Mıknatıslı Oturt</span>
            </button>
          </div>

          {/* Drop Perpendicular Action Button (4 cols) */}
          <div className="lg:col-span-4">
            <button
              onClick={handleDropPerpendicular}
              disabled={isReflected}
              className={`w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isReadyToDefend
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-teal-500/30 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>90° Dikme İndir & Savun</span>
            </button>
          </div>
        </div>
      </div>

      {/* Game Over / Completed Banners */}
      {isGameOver && (
        <div className="bg-rose-950/90 border border-rose-500 p-6 rounded-2xl text-center space-y-3 animate-in zoom-in duration-300">
          <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h3 className="text-lg font-black text-white">Lazer Kalkanı Düştü!</h3>
          <p className="text-xs text-rose-200 max-w-md mx-auto">
            Savunma kulesinden doğruya tam 90° dikme çizilmelidir. Gönyeyi lazer hattına yaslayıp tekrar deneyiniz.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-all cursor-pointer"
          >
            Yeniden Başlat
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="bg-emerald-950/90 border border-emerald-500 p-6 rounded-2xl text-center space-y-3 animate-in zoom-in duration-300">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-xl font-black text-white">Tüm Lazer Tehditleri Savuşturuldu!</h3>
          <p className="text-xs text-emerald-200">
            Tebrikler! Gönye kullanarak bir noktadan doğruya 90° dikme indirme becerisini ustalıkla tamamladınız (+100 XP).
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all cursor-pointer"
          >
            Tekrar Oyna
          </button>
        </div>
      )}
    </div>
  );
}

// =================================================================
// 2. OYUN: YÖRÜNGE KURTARMA: PERGELİN DANSI (Sanal Pergel Çemberi)
// =================================================================
interface PlanetOrbitTask {
  id: number;
  planetName: string;
  radius: number; // in pixels
  satelliteAngle: number; // in degrees
}

const ORBIT_TASKS: PlanetOrbitTask[] = [
  { id: 1, planetName: 'Kırmızı Gezegen Ares (r = 80px)', radius: 80, satelliteAngle: 45 },
  { id: 2, planetName: 'Halka Gezegeni Kronos (r = 120px)', radius: 120, satelliteAngle: 135 },
  { id: 3, planetName: 'Buz Devi Poseidon (r = 150px)', radius: 150, satelliteAngle: 270 }
];

export function OrbitRescueCompassGame({ onComplete }: { onComplete?: () => void }) {
  const { addPoints, unlockBadge } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [needlePlaced, setNeedlePlaced] = useState(false);
  const [pergelRadius, setPergelRadius] = useState(60);
  const [drawnAngle, setDrawnAngle] = useState(0); // 0 to 360
  const [isOrbitLocked, setIsOrbitLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const task = ORBIT_TASKS[currentTaskIdx];
  const centerPoint = { x: 300, y: 190 };

  const isRadiusCorrect = Math.abs(pergelRadius - task.radius) <= 6;

  const handlePlaceNeedle = () => {
    soundSynth.playSnap();
    setNeedlePlaced(true);
  };

  const handleDrawProgress = (angle: number) => {
    if (!needlePlaced) return;
    setDrawnAngle(angle);
    soundSynth.playCompass();

    if (angle >= 355 && isRadiusCorrect) {
      soundSynth.playLaserReflect();
      setIsOrbitLocked(true);
      setScore((prev) => prev + 100);

      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}

      setTimeout(() => {
        if (currentTaskIdx < ORBIT_TASKS.length - 1) {
          setCurrentTaskIdx((prev) => prev + 1);
          setNeedlePlaced(false);
          setDrawnAngle(0);
          setIsOrbitLocked(false);
        } else {
          setIsCompleted(true);
          soundSynth.playSuccessFanfare();
          addPoints(100);
          unlockBadge('orbit-architect');

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
              activityTitle: 'Yörünge Kurtarma: Pergelin Dansı',
              outcomeCode: 'MAT.5.3.1',
              score: 100,
              maxScore: 100,
              xpEarned: 100
            });
            clearActiveBoardStudent();
          }

          if (onComplete) onComplete();
        }
      }, 1800);
    }
  };

  const handleReset = () => {
    setCurrentTaskIdx(0);
    setNeedlePlaced(false);
    setPergelRadius(60);
    setDrawnAngle(0);
    setIsOrbitLocked(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-7 border-2 border-indigo-500/40 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-black uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>2. Oyun • Yörünge Kurtarma: Pergelin Dansı</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>🛰️</span> {task.planetName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pergelin iğneli ucunu merkez noktaya batır, yarıçapı uydunun mesafesine ayarla ve 360° döndürerek çember yörüngeyi tamamla!
          </p>
        </div>

        <div className="bg-slate-900 px-4 py-2 rounded-xl border border-indigo-500/30 font-mono font-black text-indigo-400 text-sm">
          ⚡ {score} XP
        </div>
      </div>

      {/* Orbit Canvas SVG Screen */}
      <div className="relative w-full h-[380px] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-2xl border-2 border-slate-800 overflow-hidden select-none">
        <svg className="w-full h-full" viewBox="0 0 600 380">
          {/* Starfield */}
          <circle cx="60" cy="50" r="1.5" fill="#ffffff" opacity="0.6" />
          <circle cx="480" cy="80" r="1.5" fill="#ffffff" opacity="0.4" />
          <circle cx="120" cy="300" r="1" fill="#ffffff" opacity="0.5" />
          <circle cx="520" cy="310" r="2" fill="#ffffff" opacity="0.7" />

          {/* Target Orbit Ghost Guide */}
          <circle
            cx={centerPoint.x}
            cy={centerPoint.y}
            r={task.radius}
            fill="none"
            stroke="rgba(99, 102, 241, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Drawn Arc from Compass */}
          {drawnAngle > 0 && (
            <path
              d={`M ${centerPoint.x + pergelRadius} ${centerPoint.y} A ${pergelRadius} ${pergelRadius} 0 ${
                drawnAngle > 180 ? 1 : 0
              } 1 ${centerPoint.x + pergelRadius * Math.cos((drawnAngle * Math.PI) / 180)} ${
                centerPoint.y + pergelRadius * Math.sin((drawnAngle * Math.PI) / 180)
              }`}
              fill="none"
              stroke={isRadiusCorrect ? '#22d3ee' : '#f43f5e'}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Central Planet */}
          <g transform={`translate(${centerPoint.x}, ${centerPoint.y})`}>
            <circle cx="0" cy="0" r="28" fill="#4338ca" stroke="#818cf8" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="6" fill="#c7d2fe" />
            <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">
              M (0,0)
            </text>
            <text x="0" y="46" textAnchor="middle" fill="#a5b4fc" fontSize="10" fontWeight="800">
              Merkez Nokta
            </text>
          </g>

          {/* Satellite */}
          <g
            transform={`translate(${
              centerPoint.x + task.radius * Math.cos((task.satelliteAngle * Math.PI) / 180)
            }, ${centerPoint.y + task.radius * Math.sin((task.satelliteAngle * Math.PI) / 180)})`}
          >
            <circle cx="0" cy="0" r="10" fill="#f59e0b" stroke="#fef3c7" strokeWidth="2" />
            <text x="0" y="20" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="800">
              Uydu (r={task.radius}px)
            </text>
          </g>

          {/* Compass Graphic (Needle & Pencil Legs) */}
          {needlePlaced && (
            <g transform={`translate(${centerPoint.x}, ${centerPoint.y})`}>
              {/* Needle Leg */}
              <line x1="0" y1="0" x2="0" y2="-70" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
              <circle cx="0" cy="0" r="4" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
              {/* Pencil Leg */}
              <line
                x1="0"
                y1="-70"
                x2={pergelRadius * Math.cos((drawnAngle * Math.PI) / 180)}
                y2={pergelRadius * Math.sin((drawnAngle * Math.PI) / 180)}
                stroke="#60a5fa"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle
                cx={pergelRadius * Math.cos((drawnAngle * Math.PI) / 180)}
                cy={pergelRadius * Math.sin((drawnAngle * Math.PI) / 180)}
                r="5"
                fill="#38bdf8"
              />
            </g>
          )}

          {/* Locked Orbit Shield Effect */}
          {isOrbitLocked && (
            <circle
              cx={centerPoint.x}
              cy={centerPoint.y}
              r={task.radius}
              fill="rgba(34, 211, 238, 0.15)"
              stroke="#22d3ee"
              strokeWidth="4"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Needle Prompt */}
        {!needlePlaced && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
            <button
              onClick={handlePlaceNeedle}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <Target className="w-5 h-5" />
              <span>Pergelin İğnesini Merkeze Batır (M)</span>
            </button>
          </div>
        )}
      </div>

      {/* Compass Controls */}
      {needlePlaced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          {/* Radius (Yarıçap) Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Pergel Açıklığı (Yarıçap r):</span>
              <span className={`font-mono ${isRadiusCorrect ? 'text-emerald-400 font-extrabold' : 'text-amber-400'}`}>
                {pergelRadius} px {isRadiusCorrect && '✓ (Uydu Mesafesi)'}
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="180"
              value={pergelRadius}
              onChange={(e) => setPergelRadius(Number(e.target.value))}
              disabled={isOrbitLocked}
              className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
          </div>

          {/* 360° Rotation Sweep */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Pergeli Döndür (360° Çember Çiz):</span>
              <span className="font-mono text-cyan-400">%{Math.round((drawnAngle / 360) * 100)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={drawnAngle}
              onChange={(e) => handleDrawProgress(Number(e.target.value))}
              disabled={isOrbitLocked}
              className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      )}

      {/* Completion */}
      {isCompleted && (
        <div className="bg-indigo-950/90 border border-indigo-500 p-6 rounded-2xl text-center space-y-3 animate-in zoom-in duration-300">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-xl font-black text-white">Kusursuz Yörünge Mimarı Rozeti Kazanıldı!</h3>
          <p className="text-xs text-indigo-200">
            Pergelin iğneli ucunu merkezde sabit tutarak tam dairesel çemberler çizdiniz (+100 XP).
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all cursor-pointer"
          >
            Tekrar Oyna
          </button>
        </div>
      )}
    </div>
  );
}

// =================================================================
// 3. OYUN: GEOMETRİ MAKASI: DOĞRU, IŞIN, DOĞRU PARÇASI (Maglev Treni)
// =================================================================
interface TrackTask {
  id: number;
  towerSignal: string;
  targetType: 'segment' | 'ray' | 'line';
  title: string;
  explanation: string;
}

const TRACK_TASKS: TrackTask[] = [
  {
    id: 1,
    title: 'İki İstasyon Arası Sınırlı Ray',
    towerSignal: 'KONTROL KULESİ: "İki ucu kapalı, başlangıç ve bitişi kesin 8 metre sınırlı ray döşe!"',
    targetType: 'segment',
    explanation: 'Doğru Parçası: İki ucundan sınırlandırılmıştır [A, B] ve net uzunluğu ölçülebilir.'
  },
  {
    id: 2,
    title: 'Fener İstasyonundan Sonsuzluğa',
    towerSignal: 'KONTROL KULESİ: "Fener istasyonundan çıkıp tek yönde sonsuza uzanan ışık rayı döşe!"',
    targetType: 'ray',
    explanation: 'Işın: Bir ucu kapalı (başlangıç noktası), diğer ucu sonsuza uzanır [A, ->).'
  },
  {
    id: 3,
    title: 'Ana Hat Transit Geçişi',
    towerSignal: 'KONTROL KULESİ: "Her iki yönde engelsiz, sonsuza kadar uzanan ana hat rayı döşe!"',
    targetType: 'line',
    explanation: 'Doğru: Her iki yönde de sonsuza uzanan noktalar kümesidir (<- ->).'
  }
];

export function GeometryScissorsMaglevGame({ onComplete }: { onComplete?: () => void }) {
  const { addPoints, unlockBadge } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState<'segment' | 'ray' | 'line' | null>(null);
  const [isTrainMoving, setIsTrainMoving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const task = TRACK_TASKS[currentTaskIdx];

  const handleTestTrack = () => {
    if (!selectedEntity) return;

    if (selectedEntity === task.targetType) {
      soundSynth.playTrainWhistle();
      setIsTrainMoving(true);
      setIsSuccess(true);
      setErrorFeedback(null);
      setScore((prev) => prev + 100);

      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      setTimeout(() => {
        if (currentTaskIdx < TRACK_TASKS.length - 1) {
          setCurrentTaskIdx((prev) => prev + 1);
          setSelectedEntity(null);
          setIsTrainMoving(false);
          setIsSuccess(false);
        } else {
          setIsCompleted(true);
          soundSynth.playSuccessFanfare();
          addPoints(100);
          unlockBadge('maglev-conductor');

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
              activityTitle: 'Geometri Makası: Doğru, Işın, Doğru Parçası',
              outcomeCode: 'MAT.5.3.1',
              score: 100,
              maxScore: 100,
              xpEarned: 100
            });
            clearActiveBoardStudent();
          }

          if (onComplete) onComplete();
        }
      }, 2000);
    } else {
      soundSynth.playError();
      setErrorFeedback(`Hatalı Geometrik Terim! Sinyal "${task.title}" istiyor. ${task.explanation}`);
    }
  };

  const handleReset = () => {
    setCurrentTaskIdx(0);
    setSelectedEntity(null);
    setIsTrainMoving(false);
    setIsSuccess(false);
    setErrorFeedback(null);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-500/40 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase">
            <Train className="w-3.5 h-3.5" />
            <span>3. Oyun • Geometri Makası: Ray Döşeme</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>🚄</span> {task.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{task.towerSignal}</p>
        </div>

        <div className="bg-slate-900 px-4 py-2 rounded-xl border border-emerald-500/30 font-mono font-black text-emerald-400 text-sm">
          ⚡ {score} XP
        </div>
      </div>

      {/* Maglev Track Canvas SVG */}
      <div className="relative w-full h-[280px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden select-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 600 300"
        >
          <defs>
            <linearGradient id="trainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0369a1" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="trackGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
            </linearGradient>
            <pattern id="maglev-grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(14, 165, 233, 0.08)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Grid background & stars */}
          <rect width="600" height="300" fill="url(#maglev-grid)" />
          <circle cx="80" cy="40" r="1.5" fill="#ffffff" opacity="0.6" />
          <circle cx="250" cy="60" r="1" fill="#ffffff" opacity="0.4" />
          <circle cx="480" cy="35" r="1.5" fill="#ffffff" opacity="0.5" />
          <circle cx="540" cy="70" r="1" fill="#ffffff" opacity="0.4" />

          {/* Distant Cyber Cityscape Silhouette */}
          <path
            d="M 0 175 L 30 140 L 60 140 L 70 175 L 120 120 L 150 120 L 170 175 L 430 175 L 450 130 L 480 130 L 500 175 L 530 110 L 560 110 L 600 175 Z"
            fill="#0f172a"
            opacity="0.6"
          />

          {/* Scenery Concrete Track Pillars */}
          <rect x="70" y="175" width="14" height="100" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
          <rect x="130" y="175" width="14" height="100" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
          <rect x="450" y="175" width="14" height="100" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />
          <rect x="510" y="175" width="14" height="100" fill="#1e293b" rx="2" stroke="#334155" strokeWidth="1" />

          {/* Station A Pillar & Marker */}
          <rect x="173" y="175" width="14" height="105" fill="#0f766e" rx="3" stroke="#14b8a6" strokeWidth="1.5" />
          <circle cx="180" cy="175" r="14" fill="#0f172a" stroke="#14b8a6" strokeWidth="2" />
          <text x="180" y="179" textAnchor="middle" fill="#2dd4bf" fontSize="11" fontWeight="900">A</text>
          <text x="180" y="210" textAnchor="middle" fill="#99f6e4" fontSize="9" fontWeight="800">1. İstasyon</text>

          {/* Station B Pillar & Marker */}
          <rect x="413" y="175" width="14" height="105" fill="#0f766e" rx="3" stroke="#14b8a6" strokeWidth="1.5" />
          <circle cx="420" cy="175" r="14" fill="#0f172a" stroke="#14b8a6" strokeWidth="2" />
          <text x="420" y="179" textAnchor="middle" fill="#2dd4bf" fontSize="11" fontWeight="900">B</text>
          <text x="420" y="210" textAnchor="middle" fill="#99f6e4" fontSize="9" fontWeight="800">2. İstasyon</text>

          {/* Left Permanent Track Section */}
          <line x1="0" y1="175" x2="180" y2="175" stroke="#0369a1" strokeWidth="10" strokeLinecap="round" />
          <line x1="0" y1="175" x2="180" y2="175" stroke="#38bdf8" strokeWidth="3" />

          {/* Right Permanent Track Section */}
          <line x1="420" y1="175" x2="600" y2="175" stroke="#0369a1" strokeWidth="10" strokeLinecap="round" />
          <line x1="420" y1="175" x2="600" y2="175" stroke="#38bdf8" strokeWidth="3" />

          {/* GAP ZONE (x=180 to x=420) & GEOMETRIC ENTITY */}
          {!selectedEntity && (
            <g className="animate-pulse">
              {/* Dashed placeholder gap */}
              <line x1="180" y1="175" x2="420" y2="175" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 6" />
              <rect x="200" y="130" width="200" height="30" rx="8" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="300" y="150" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="900">
                ⚡ Ray Boşluğu (Aşağıdan Seçin)
              </text>
            </g>
          )}

          {/* Placed Geometric Entity */}
          {selectedEntity && (
            <g className="animate-in fade-in duration-300">
              {/* Glow Aura */}
              <line x1="180" y1="175" x2="420" y2="175" stroke="#10b981" strokeWidth="14" opacity="0.3" strokeLinecap="round" />
              {/* Core Rail */}
              <line x1="180" y1="175" x2="420" y2="175" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
              <line x1="180" y1="175" x2="420" y2="175" stroke="#6ee7b7" strokeWidth="3" />

              {/* 1. Doğru Parçası [AB] */}
              {selectedEntity === 'segment' && (
                <>
                  <circle cx="180" cy="175" r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" className="drop-shadow-[0_0_8px_#10b981]" />
                  <circle cx="420" cy="175" r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" className="drop-shadow-[0_0_8px_#10b981]" />
                  <rect x="195" y="125" width="210" height="28" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                  <text x="300" y="143" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="900">
                    [A, B] Doğru Parçası • İki ucu sınırlı
                  </text>
                </>
              )}

              {/* 2. Işın [AB) */}
              {selectedEntity === 'ray' && (
                <>
                  <circle cx="180" cy="175" r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" className="drop-shadow-[0_0_8px_#10b981]" />
                  <polygon points="420,166 438,175 420,184" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" className="drop-shadow-[0_0_8px_#10b981]" />
                  <rect x="195" y="125" width="210" height="28" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                  <text x="300" y="143" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="900">
                    [A, B) Işını • A'dan başlar, sonsuza uzanır
                  </text>
                </>
              )}

              {/* 3. Doğru (d) */}
              {selectedEntity === 'line' && (
                <>
                  <polygon points="180,166 162,175 180,184" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" className="drop-shadow-[0_0_8px_#10b981]" />
                  <polygon points="420,166 438,175 420,184" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" className="drop-shadow-[0_0_8px_#10b981]" />
                  <rect x="195" y="125" width="210" height="28" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                  <text x="300" y="143" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="900">
                    (d) Doğrusu • İki yönde sonsuza uzanır
                  </text>
                </>
              )}
            </g>
          )}

          {/* HIGH-SPEED MAGLEV TRAIN */}
          <g
            transform={isTrainMoving ? 'translate(440, 0)' : 'translate(30, 0)'}
            style={{
              transition: isTrainMoving ? 'transform 1.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 0.3s ease-out'
            }}
          >
            {/* Magnetic Hover Glow underneath */}
            <ellipse cx="60" cy="174" rx="55" ry="4" fill="rgba(56, 189, 248, 0.6)" className="animate-pulse" />

            {/* Aerodynamic Maglev Body */}
            <path
              d="M 5 146 Q 5 140 15 140 L 90 140 Q 115 140 128 158 Q 132 165 125 170 L 15 170 Q 5 170 5 162 Z"
              fill="url(#trainGrad)"
              stroke="#e0f2fe"
              strokeWidth="2"
            />

            {/* Cockpit & Passenger Windows */}
            <path d="M 92 145 L 115 156 L 92 156 Z" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1" />
            <rect x="25" y="146" width="16" height="9" rx="2" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1" />
            <rect x="47" y="146" width="16" height="9" rx="2" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1" />
            <rect x="69" y="146" width="16" height="9" rx="2" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1" />

            {/* Cyan LED Side Trim */}
            <line x1="12" y1="162" x2="118" y2="162" stroke="#22d3ee" strokeWidth="2" />

            {/* Headlight Beam Cone */}
            <polygon points="128,160 260,125 260,195" fill="rgba(56, 189, 248, 0.22)" pointerEvents="none" />
            <circle cx="127" cy="162" r="3.5" fill="#ffffff" className="drop-shadow-[0_0_6px_#ffffff]" />
          </g>
        </svg>
      </div>

      {/* Tool Selection Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'segment', title: 'Doğru Parçası [AB]', desc: 'İki ucu noktalı sınırlı ray', icon: '•——•' },
          { id: 'ray', title: 'Işın [AB)', desc: 'Bir ucu nokta, diğeri ok', icon: '•——►' },
          { id: 'line', title: 'Doğru (d)', desc: 'İki ucu sonsuza giden ok', icon: '◄——►' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              soundSynth.playSnap();
              setSelectedEntity(item.id as any);
              setErrorFeedback(null);
            }}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              selectedEntity === item.id
                ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/30'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="font-mono text-base font-black text-emerald-400 mb-1">{item.icon}</div>
            <div className="font-black text-sm text-white">{item.title}</div>
            <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
          </button>
        ))}
      </div>

      {/* Test Train Run Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {errorFeedback ? (
          <div className="text-xs text-rose-400 font-bold bg-rose-950/60 p-3 rounded-xl border border-rose-800 flex-1">
            ⚠️ {errorFeedback}
          </div>
        ) : (
          <div className="text-xs text-slate-400">
            Ray türünü seçip Maglev trenini boşluktan güvenle geçirin.
          </div>
        )}

        <button
          onClick={handleTestTrack}
          disabled={!selectedEntity || isTrainMoving}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Maglev Trenini Başlat</span>
        </button>
      </div>

      {/* Completed State */}
      {isCompleted && (
        <div className="bg-emerald-950/90 border border-emerald-500 p-6 rounded-2xl text-center space-y-3 animate-in zoom-in duration-300">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-xl font-black text-white">Maglev Geometri Hattı Tamamlandı!</h3>
          <p className="text-xs text-emerald-200">
            Doğru, Işın ve Doğru Parçası sembol ve özelliklerini hatasız uyguladınız (+100 XP).
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all cursor-pointer"
          >
            Tekrar Oyna
          </button>
        </div>
      )}
    </div>
  );
}

// =================================================================
// 4. OYUN: FENER BEKÇİSİ: AÇI KISKACI (Dar, Dik, Geniş Açı İletkisi)
// =================================================================
interface LighthouseTask {
  id: number;
  type: 'dar' | 'dik' | 'genis';
  title: string;
  targetMin: number;
  targetMax: number;
  prompt: string;
  symbol: string;
}

const LIGHTHOUSE_TASKS: LighthouseTask[] = [
  {
    id: 1,
    type: 'dar',
    title: 'Dar Açı Görevi: Filika Kurtarma (30° - 60°)',
    targetMin: 30,
    targetMax: 60,
    prompt: 'Işık açıklığını DAR AÇI (30° - 60°) arasına daraltarak tek bir filikayı sislerden kurtar!',
    symbol: '< 90°'
  },
  {
    id: 2,
    type: 'dik',
    title: 'Dik Açı Görevi: Liman Girişi Taraması (Tam 90°)',
    targetMin: 90,
    targetMax: 90,
    prompt: 'Işık kollarını tam DİK AÇIYA (90°) getir. Liman girişini kare-nokta diklik sembolüyle kilitle!',
    symbol: '= 90°'
  },
  {
    id: 3,
    type: 'genis',
    title: 'Geniş Açı Görevi: Tüm Körfez Taraması (120° - 150°)',
    targetMin: 120,
    targetMax: 150,
    prompt: 'Işık hüzmesini GENİŞ AÇI (120° - 150°) açıklığına getirerek körfezin tamamını sislerden temizle!',
    symbol: '> 90°'
  }
];

export function LighthouseAngleGame({ onComplete }: { onComplete?: () => void }) {
  const { addPoints, unlockBadge } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [angleValue, setAngleValue] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const task = LIGHTHOUSE_TASKS[currentTaskIdx];

  // Vertex point of the lighthouse
  const vertex = { x: 300, y: 70 };

  const isAngleInTarget = angleValue >= task.targetMin && angleValue <= task.targetMax;

  // Determine angle category
  const angleCategory =
    angleValue < 90 ? 'Dar Açı' : angleValue === 90 ? 'Dik Açı (90°)' : angleValue < 180 ? 'Geniş Açı' : 'Doğru Açı (180°)';

  const handleLockAngle = () => {
    if (isAngleInTarget) {
      soundSynth.playFoghorn();
      setIsLocked(true);
      setScore((prev) => prev + 100);

      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}

      setTimeout(() => {
        if (currentTaskIdx < LIGHTHOUSE_TASKS.length - 1) {
          setCurrentTaskIdx((prev) => prev + 1);
          setAngleValue(0);
          setIsLocked(false);
        } else {
          setIsCompleted(true);
          soundSynth.playSuccessFanfare();
          addPoints(100);
          unlockBadge('lighthouse-keeper');

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
              activityTitle: 'Fener Bekçisi: Açı Kıskacı',
              outcomeCode: 'MAT.5.3.1',
              score: 100,
              maxScore: 100,
              xpEarned: 100
            });
            clearActiveBoardStudent();
          }

          if (onComplete) onComplete();
        }
      }, 1800);
    } else {
      soundSynth.playError();
    }
  };

  const handleReset = () => {
    setCurrentTaskIdx(0);
    setAngleValue(0);
    setIsLocked(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-7 border-2 border-amber-500/40 shadow-2xl space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase">
            <Anchor className="w-3.5 h-3.5" />
            <span>4. Oyun • Fener Bekçisi: Açı Kıskacı</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>🗼</span> {task.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{task.prompt}</p>
        </div>

        <div className="bg-slate-900 px-4 py-2 rounded-xl border border-amber-500/30 font-mono font-black text-amber-400 text-sm">
          ⚡ {score} XP
        </div>
      </div>

      {/* Sea & Lighthouse Canvas SVG */}
      <div className="relative w-full h-[360px] bg-gradient-to-b from-slate-950 via-slate-900 to-sky-950/80 rounded-2xl border-2 border-slate-800 overflow-hidden select-none flex items-center justify-center p-2">
        <svg className="w-full h-full select-none drop-shadow-2xl" viewBox="0 0 600 360">
          {/* Waves background */}
          <path d="M 0 300 Q 150 290 300 300 T 600 300" fill="none" stroke="#0369a1" strokeWidth="2" opacity="0.3" />
          <path d="M 0 330 Q 150 320 300 330 T 600 330" fill="none" stroke="#0369a1" strokeWidth="2" opacity="0.4" />

          {/* Light Beam Cone emanating from Vertex */}
          {(() => {
            const halfAngleRad = ((angleValue / 2) * Math.PI) / 180;
            const length = 320;
            const p1 = {
              x: vertex.x - length * Math.sin(halfAngleRad),
              y: vertex.y + length * Math.cos(halfAngleRad)
            };
            const p2 = {
              x: vertex.x + length * Math.sin(halfAngleRad),
              y: vertex.y + length * Math.cos(halfAngleRad)
            };

            return (
              <g>
                <polygon
                  points={`${vertex.x},${vertex.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`}
                  fill={isAngleInTarget ? 'rgba(251, 191, 36, 0.35)' : 'rgba(148, 163, 184, 0.2)'}
                  stroke={isAngleInTarget ? '#f59e0b' : '#64748b'}
                  strokeWidth="2"
                />

                {/* Angle Arc at Vertex */}
                <path
                  d={`M ${vertex.x - 40 * Math.sin(halfAngleRad)} ${vertex.y + 40 * Math.cos(halfAngleRad)} A 40 40 0 0 1 ${
                    vertex.x + 40 * Math.sin(halfAngleRad)
                  } ${vertex.y + 40 * Math.cos(halfAngleRad)}`}
                  fill="none"
                  stroke={angleValue === 90 ? '#10b981' : '#f59e0b'}
                  strokeWidth="3"
                />

                {/* Right angle square if 90 degrees */}
                {angleValue === 90 && (
                  <rect
                    x={vertex.x - 12}
                    y={vertex.y + 15}
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                )}
              </g>
            );
          })()}

          {/* Lighthouse Tower Structure */}
          <g transform={`translate(${vertex.x}, ${vertex.y})`}>
            {/* Lamp / Lantern */}
            <circle cx="0" cy="0" r="14" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2.5" className="animate-pulse" />
            <circle cx="0" cy="0" r="6" fill="#ffffff" />
            {/* Tower Body */}
            <polygon points="-12,0 -20,60 20,60 12,0" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2" />
            <line x1="-15" y1="25" x2="15" y2="25" stroke="#ef4444" strokeWidth="6" />
            <line x1="-18" y1="45" x2="18" y2="45" stroke="#ef4444" strokeWidth="6" />
            <text x="0" y="-18" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="900">
              Açı Köşesi (Tepe Noktası)
            </text>
          </g>

          {/* Rescued Boat or Rocks depending on level */}
          <g transform="translate(300, 260)">
            <ellipse cx="0" cy="0" rx="20" ry="8" fill="#78350f" stroke="#d97706" strokeWidth="2" />
            <polygon points="0,-18 12,-4 0,-4" fill="#ffffff" />
            <line x1="0" y1="-18" x2="0" y2="0" stroke="#0f172a" strokeWidth="2" />
            <text x="0" y="24" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="800">
              Kurtarma Gemisi
            </text>
          </g>
        </svg>

        {/* Live Angle Indicator Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-xl text-xs backdrop-blur-sm flex items-center gap-3">
          <div className="font-mono text-base font-black text-amber-400">{angleValue}°</div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="font-bold text-slate-300">
            Tür: <span className="text-amber-300 font-extrabold">{angleCategory}</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className={isAngleInTarget ? 'text-emerald-400 font-black' : 'text-slate-400'}>
            {isAngleInTarget ? '✓ HEDEF AÇIKLIK SAĞLANDI' : 'Açıyı Ayarlayınız'}
          </div>
        </div>
      </div>

      {/* Angle Slider & Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="space-y-2 lg:col-span-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Sanal İletki / Açı Kolu Açıklığı:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-amber-400 font-black text-sm bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-700">
                {angleValue}°
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                angleValue === 90 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {angleCategory}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = Math.max(10, angleValue - 1);
                setAngleValue(next);
                soundSynth.playCompass();
              }}
              disabled={isLocked}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer disabled:opacity-50"
              title="1° Azalt"
            >
              <Minus className="w-4 h-4" />
            </button>

            <input
              type="range"
              min="10"
              max="170"
              step="1"
              value={angleValue}
              onChange={(e) => {
                setAngleValue(Number(e.target.value));
                soundSynth.playCompass();
              }}
              disabled={isLocked}
              className="flex-1 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />

            <button
              onClick={() => {
                const next = Math.min(170, angleValue + 1);
                setAngleValue(next);
                soundSynth.playCompass();
              }}
              disabled={isLocked}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer disabled:opacity-50"
              title="1° Artır"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
            <span>Dar Açı (10°-89°)</span>
            <span className="text-emerald-400 font-bold">Tam Dik (90°)</span>
            <span>Geniş Açı (91°-170°)</span>
          </div>
        </div>

        <button
          onClick={handleLockAngle}
          disabled={isLocked || !isAngleInTarget}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Açıyı Kilitle & Gemiyi Kurtar</span>
        </button>
      </div>

      {/* Completion */}
      {isCompleted && (
        <div className="bg-amber-950/90 border border-amber-500 p-6 rounded-2xl text-center space-y-3 animate-in zoom-in duration-300">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-xl font-black text-white">Fener Bekçisi Görevi Başarıyla Tamamlandı!</h3>
          <p className="text-xs text-amber-200">
            Dar, Dik ve Geniş açı türlerini iletki ve açı kolları üzerinden ustalıkla yönettiniz (+100 XP).
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 transition-all cursor-pointer"
          >
            Tekrar Oyna
          </button>
        </div>
      )}
    </div>
  );
}
