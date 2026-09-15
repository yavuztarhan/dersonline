'use client';

import React, { useState } from 'react';
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
  Grid
} from 'lucide-react';
import { getStoredActiveBoardStudent, clearActiveBoardStudent, saveBoardParticipation } from '@/lib/board-participation-store';
import { useAuth } from '@/lib/auth-store';
import { MathFraction, MathText } from '@/components/ui/math-fraction';

// =================================================================
// 1. OYUN: KUANTUM ALAN ÇARPANI (NANO-GRID MATRİSİ)
// =================================================================
interface AreaMultiplicationLevel {
  id: number;
  title: string;
  frac1: { num: number; den: number; label: string };
  frac2: { num: number; den: number; label: string };
  totalGridRows: number;
  totalGridCols: number;
  options: Array<{
    id: string;
    rawFrac: string;
    simplifiedFrac: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

const AREA_LEVELS: AreaMultiplicationLevel[] = [
  {
    id: 1,
    title: 'Mikroçip Güneş Paneli Matrisi',
    frac1: { num: 2, den: 3, label: '2/3' },
    frac2: { num: 3, den: 4, label: '3/4' },
    totalGridRows: 3,
    totalGridCols: 4,
    options: [
      { id: 'a1', rawFrac: '6/12', simplifiedFrac: '1/2', isCorrect: true, explanation: '2/3 x 3/4 = (2 x 3)/(3 x 4) = 6/12. 6 ile sadeleştirildiğinde 1/2 elde edilir!' },
      { id: 'a2', rawFrac: '5/7', simplifiedFrac: '5/7', isCorrect: false, explanation: 'Hata! Pay ve paydalar toplanmaz, karşılıklı çarpılır (2x3)/(3x4).' },
      { id: 'a3', rawFrac: '8/9', simplifiedFrac: '8/9', isCorrect: false, explanation: 'Hata! Çapraz işlem yapılmadı; pay 2x3=6, payda 3x4=12 olmalıdır.' }
    ]
  },
  {
    id: 2,
    title: 'Kuantum Lazer İletkeni',
    frac1: { num: 3, den: 5, label: '3/5' },
    frac2: { num: 2, den: 3, label: '2/3' },
    totalGridRows: 5,
    totalGridCols: 3,
    options: [
      { id: 'b1', rawFrac: '6/15', simplifiedFrac: '2/5', isCorrect: true, explanation: '3/5 x 2/3 = (3 x 2)/(5 x 3) = 6/15. 3 ile sadeleşince 2/5 kalır!' },
      { id: 'b2', rawFrac: '5/8', simplifiedFrac: '5/8', isCorrect: false, explanation: 'Paydalar toplanmaz! 5 x 3 = 15 olmalıdır.' },
      { id: 'b3', rawFrac: '9/10', simplifiedFrac: '9/10', isCorrect: false, explanation: 'Hatalı çarpım.' }
    ]
  },
  {
    id: 3,
    title: 'Sonsuzluk Çipi İvme Sensörü',
    frac1: { num: 4, den: 5, label: '4/5' },
    frac2: { num: 5, den: 6, label: '5/6' },
    totalGridRows: 5,
    totalGridCols: 6,
    options: [
      { id: 'c1', rawFrac: '20/30', simplifiedFrac: '2/3', isCorrect: true, explanation: '4/5 x 5/6 = 20/30 = 2/3. Çapraz 5\'ler birbirini 1 yapar, geriye 4/6 = 2/3 kalır!' },
      { id: 'c2', rawFrac: '9/11', simplifiedFrac: '9/11', isCorrect: false, explanation: 'Pay ve paydayı toplama hatası.' },
      { id: 'c3', rawFrac: '24/25', simplifiedFrac: '24/25', isCorrect: false, explanation: 'Pay ve paydalar yanlış çarpıldı.' }
    ]
  },
  {
    id: 4,
    title: 'Yörünge Enerji Rezervi (Negatif Çarpan)',
    frac1: { num: -3, den: 4, label: '-3/4' },
    frac2: { num: 2, den: 5, label: '2/5' },
    totalGridRows: 4,
    totalGridCols: 5,
    options: [
      { id: 'd1', rawFrac: '-6/20', simplifiedFrac: '-3/10', isCorrect: true, explanation: '(-3/4) x (2/5) = (-3 x 2)/(4 x 5) = -6/20 = -3/10. Zıt işaretlerin çarpımı negatiftir (-).' },
      { id: 'd2', rawFrac: '+6/20', simplifiedFrac: '+3/10', isCorrect: false, explanation: 'İşaret hatası! Eksi ile artının çarpımı eksidir.' },
      { id: 'd3', rawFrac: '-1/9', simplifiedFrac: '-1/9', isCorrect: false, explanation: 'Hatalı işlem.' }
    ]
  }
];

export function QuantumAreaMultiplierGame() {
  const { playSound } = useApp();
  const { currentUser } = useAuth();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const level = AREA_LEVELS[currentLevelIdx];
  const selectedOpt = level?.options.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (optId: string) => {
    if (selectedOptionId) return;
    setSelectedOptionId(optId);

    const opt = level.options.find((o) => o.id === optId);
    if (opt?.isCorrect) {
      playSound('success');
      setScore((prev) => prev + 25);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } else {
      playSound('bell');
    }
  };

  const handleNext = () => {
    if (currentLevelIdx < AREA_LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
      setSelectedOptionId(null);
    } else {
      setIsCompleted(true);
      playSound('success');
      confetti({ particleCount: 100, spread: 80 });

      const activeStudent = getStoredActiveBoardStudent();
      if (activeStudent && currentUser) {
        saveBoardParticipation({
          studentId: activeStudent.id,
          studentNumber: activeStudent.studentNumber,
          studentName: activeStudent.name,
          classSection: activeStudent.classSection,
          teacherId: currentUser.id,
          outcomeCode: 'MAT.7.1.4',
          activityTitle: 'Kuantum Alan Çarpanı (Rasyonel Çarpma)',
          activityType: 'game',
          xpEarned: score + (selectedOpt?.isCorrect ? 25 : 0)
        });
        clearActiveBoardStudent();
      }
    }
  };

  const handleRestart = () => {
    setCurrentLevelIdx(0);
    setSelectedOptionId(null);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white space-y-6">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black tracking-wider uppercase border border-teal-500/30">
                1. Oyun • Alan Modeli
              </span>
              <span className="text-xs text-slate-400 font-bold">Seviye {currentLevelIdx + 1} / {AREA_LEVELS.length}</span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">Kuantum Alan Çarpanı: Nano-Grid Matrisi</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-black text-teal-300">{score} XP</span>
          </div>
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Yeniden Başlat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isCompleted ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Mission Objective */}
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-teal-400 uppercase tracking-wider">{level.title}</span>
              <p className="text-sm text-slate-200 font-bold">
                İki rasyonel sayının çarpımını alan modeli üzerinde modelleyin:
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-teal-950 border border-teal-500/40 text-teal-300 font-bold text-base shrink-0 font-serif">
              <MathText text={`${level.frac1.label} × ${level.frac2.label} = ?`} />
            </div>
          </div>

          {/* Visual Interactive Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-6 rounded-3xl border border-slate-800 items-center">
            {/* Grid Visualization */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <span className="text-xs font-bold text-slate-400">
                Kesişen Alan: ({Math.abs(level.frac1.num)} satır × {level.frac2.num} sütun) / ({level.totalGridRows} × {level.totalGridCols})
              </span>
              <div
                className="grid gap-1.5 p-3 bg-slate-900 rounded-2xl border-2 border-slate-700 shadow-2xl"
                style={{
                  gridTemplateRows: `repeat(${level.totalGridRows}, minmax(0, 1fr))`,
                  gridTemplateColumns: `repeat(${level.totalGridCols}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: level.totalGridRows }).map((_, rIdx) =>
                  Array.from({ length: level.totalGridCols }).map((_, cIdx) => {
                    const inRow = rIdx < Math.abs(level.frac1.num);
                    const inCol = cIdx < level.frac2.num;
                    const isOverlap = inRow && inCol;

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-all duration-500 flex items-center justify-center font-bold text-[10px] ${
                          isOverlap
                            ? 'bg-gradient-to-br from-teal-400 to-emerald-500 text-slate-950 ring-2 ring-teal-300 shadow-lg shadow-teal-500/40 scale-105 font-black'
                            : inRow
                            ? 'bg-indigo-600/40 border border-indigo-400/40 text-indigo-200'
                            : inCol
                            ? 'bg-purple-600/40 border border-purple-400/40 text-purple-200'
                            : 'bg-slate-800/40 border border-slate-700/50 text-slate-600'
                        }`}
                      >
                        {isOverlap ? '⚡' : ''}
                      </div>
                    );
                  })
                )}
              </div>
              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-indigo-500/60" /> 1. Kesir Payı</span>
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-purple-500/60" /> 2. Kesir Payı</span>
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-teal-400" /> Çarpım Alanı</span>
              </div>
            </div>

            {/* Formula Explanation & Options */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-400">Kuantum Alan Çarpım Kuralı:</div>
                <div className="text-sm font-serif text-teal-300 font-bold">
                  (Pay × Pay) / (Payda × Payda)
                </div>
                <div className="text-xs text-slate-300">
                  {Math.abs(level.frac1.num)} × {level.frac2.num} = <strong>{Math.abs(level.frac1.num) * level.frac2.num}</strong> kesişen kare / {level.totalGridRows * level.totalGridCols} toplam kare.
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                <span className="text-xs font-black text-slate-300 block">En sade çarpım sonucu hangisidir?</span>
                <div className="grid grid-cols-1 gap-2.5">
                  {level.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        disabled={Boolean(selectedOptionId)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer font-bold flex items-center justify-between ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                              : 'bg-rose-600/30 border-rose-500 text-rose-200'
                            : selectedOptionId
                            ? 'opacity-40 bg-slate-800 border-slate-700 text-slate-400'
                            : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-teal-500 text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 font-serif">
                          <MathFraction value={opt.simplifiedFrac} className="text-lg font-bold" />
                          <span className="text-xs text-slate-400 font-sans flex items-center gap-1">
                            (<MathFraction value={opt.rawFrac} className="text-xs" />)
                          </span>
                        </div>
                        {isSelected && (
                          opt.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Feedback & Next */}
          {selectedOptionId && (
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
              <p className="text-xs text-slate-300">
                <MathText text={selectedOpt?.explanation} />
              </p>
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
              >
                <span>{currentLevelIdx < AREA_LEVELS.length - 1 ? 'Sonraki Seviyeye Geç' : 'Sonuçları Gör'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completed Screen */
        <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center text-teal-400 mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-black text-white">Kuantum Alan Çarpanı Tamamlandı!</h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Toplam <strong>{score} XP</strong> kazandınız. Alan modeliyle rasyonel çarpmanın mantığını ve sadeleştirmesini başarıyla çözdünüz!
          </p>
          <div className="pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yeniden Oyna</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =================================================================
// 2. OYUN: TERS TAKLA ROKET İTKİSİ (RASYONEL BÖLME YARIŞI)
// =================================================================
interface RocketMission {
  id: number;
  missionName: string;
  problem: string;
  firstFrac: { num: number; den: number; label: string };
  secondFrac: { num: number; den: number; label: string };
  invertedFrac: { num: number; den: number; label: string };
  correctProduct: string;
  targetOrbit: string;
  options: Array<{
    id: string;
    stepText: string;
    result: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

const ROCKET_MISSIONS: RocketMission[] = [
  {
    id: 1,
    missionName: 'Türksat 6A Yörünge İtkisi',
    problem: '(3/4) ÷ (2/5)',
    firstFrac: { num: 3, den: 4, label: '3/4' },
    secondFrac: { num: 2, den: 5, label: '2/5' },
    invertedFrac: { num: 5, den: 2, label: '5/2' },
    correctProduct: '15/8',
    targetOrbit: 'GEO Yörüngesi (+15/8 MHZ)',
    options: [
      { id: 'r1', stepText: '(3/4) × (5/2)', result: '15/8', isCorrect: true, explanation: 'Harika! 1. kesir aynen kaldı (3/4), 2. kesir ters çevrildi (5/2) ve çarpıldı: 3x5 / 4x2 = 15/8!' },
      { id: 'r2', stepText: '(4/3) × (2/5)', result: '8/15', isCorrect: false, explanation: 'Hata! 1. kesir değil, DAİMA 2. kesir (bölen) ters çevrilir.' },
      { id: 'r3', stepText: '(3/4) × (2/5)', result: '6/20 = 3/10', isCorrect: false, explanation: 'Hata! Bölme işleminde 2. kesir ters çevrilmeden çarpılamaz.' }
    ]
  },
  {
    id: 2,
    missionName: 'Gökbey Uydu İletişim Kanadı',
    problem: '(-4/7) ÷ (2/3)',
    firstFrac: { num: -4, den: 7, label: '-4/7' },
    secondFrac: { num: 2, den: 3, label: '2/3' },
    invertedFrac: { num: 3, den: 2, label: '3/2' },
    correctProduct: '-6/7',
    targetOrbit: 'Alçak Dünya Yörüngesi (-6/7 kW)',
    options: [
      { id: 'r4', stepText: '(-4/7) × (3/2)', result: '-12/14 = -6/7', isCorrect: true, explanation: 'Doğru! (-4/7) x (3/2) = -12/14 = -6/7. Negatif bölü pozitif negatiftir!' },
      { id: 'r5', stepText: '(-4/7) × (-3/2)', result: '+6/7', isCorrect: false, explanation: 'İşaret hatası! Sayı ters çevrilirken işareti değişmez (2/3 -> 3/2 olur, işaret değişmez).' },
      { id: 'r6', stepText: '(-7/4) × (2/3)', result: '-14/12', isCorrect: false, explanation: 'Hata! 1. kesir ters çevrilmez.' }
    ]
  },
  {
    id: 3,
    missionName: 'Ay Keşif Aracı Güç Bölücüsü',
    problem: '(-5/6) ÷ (-5/12)',
    firstFrac: { num: -5, den: 6, label: '-5/6' },
    secondFrac: { num: -5, den: 12, label: '-5/12' },
    invertedFrac: { num: -12, den: 5, label: '-12/5' },
    correctProduct: '+2',
    targetOrbit: 'Ay Yüzeyi Güvenli İniş (+2 bar)',
    options: [
      { id: 'r7', stepText: '(-5/6) × (-12/5)', result: '+60/30 = +2', isCorrect: true, explanation: 'Mükemmel! (-5/6) x (-12/5) = +60/30 = +2 tam. İki negatifin bölümü pozitiftir (+2)!' },
      { id: 'r8', stepText: '(-5/6) × (+12/5)', result: '-2', isCorrect: false, explanation: 'İşaret hatası! Eksi bölü eksi artıdır (+).' },
      { id: 'r9', stepText: '(-6/5) × (-5/12)', result: '+1/2', isCorrect: false, explanation: 'Yanlış ters çevirme uygulandı.' }
    ]
  },
  {
    id: 4,
    missionName: 'Derin Uzay Anteni Hız Ayarı (Tam Sayılı Bölme)',
    problem: '3 ÷ (3/4)',
    firstFrac: { num: 3, den: 1, label: '3/1' },
    secondFrac: { num: 3, den: 4, label: '3/4' },
    invertedFrac: { num: 4, den: 3, label: '4/3' },
    correctProduct: '4',
    targetOrbit: 'Güneş Rüzgarı İstasyonu (4 GHz)',
    options: [
      { id: 'r10', stepText: '(3/1) × (4/3)', result: '12/3 = 4', isCorrect: true, explanation: 'Süper! 3 tam sayısının gizli paydası 1\'dir (3/1). (3/1) x (4/3) = 12/3 = 4 tam!' },
      { id: 'r11', stepText: '(1/3) × (3/4)', result: '3/12 = 1/4', isCorrect: false, explanation: 'Tam sayı ters çevrilmez; gizli payda 1\'dir (3/1).' },
      { id: 'r12', stepText: '(3/1) × (3/4)', result: '9/4', isCorrect: false, explanation: 'Bölme çarpmaya dönerken 2. kesir ters çevrilmelidir.' }
    ]
  }
];

export function RocketInverterDivisionGame() {
  const { playSound } = useApp();
  const { currentUser } = useAuth();

  const [missionIdx, setMissionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFlippedAnimation, setIsFlippedAnimation] = useState(false);

  const curMission = ROCKET_MISSIONS[missionIdx];
  const selectedOpt = curMission?.options.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (optId: string) => {
    if (selectedOptionId) return;
    setSelectedOptionId(optId);

    const opt = curMission.options.find((o) => o.id === optId);
    if (opt?.isCorrect) {
      playSound('success');
      setScore((prev) => prev + 30);
      setIsFlippedAnimation(true);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } else {
      playSound('bell');
    }
  };

  const handleNext = () => {
    setIsFlippedAnimation(false);
    if (missionIdx < ROCKET_MISSIONS.length - 1) {
      setMissionIdx((prev) => prev + 1);
      setSelectedOptionId(null);
    } else {
      setIsCompleted(true);
      playSound('success');
      confetti({ particleCount: 120, spread: 90 });

      const activeStudent = getStoredActiveBoardStudent();
      if (activeStudent && currentUser) {
        saveBoardParticipation({
          studentId: activeStudent.id,
          studentNumber: activeStudent.studentNumber,
          studentName: activeStudent.name,
          classSection: activeStudent.classSection,
          teacherId: currentUser.id,
          outcomeCode: 'MAT.7.1.4',
          activityTitle: 'Ters Takla Roket İtkisi (Rasyonel Bölme)',
          activityType: 'game',
          xpEarned: score + (selectedOpt?.isCorrect ? 30 : 0)
        });
        clearActiveBoardStudent();
      }
    }
  };

  const handleRestart = () => {
    setMissionIdx(0);
    setSelectedOptionId(null);
    setScore(0);
    setIsCompleted(false);
    setIsFlippedAnimation(false);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black tracking-wider uppercase border border-indigo-500/30">
                2. Oyun • Bölme Kuralı
              </span>
              <span className="text-xs text-slate-400 font-bold">Görev {missionIdx + 1} / {ROCKET_MISSIONS.length}</span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">Ters Takla Roket İtkisi: Rasyonel Bölme</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-black text-indigo-300">{score} XP</span>
          </div>
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Yeniden Başlat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isCompleted ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Mission Display */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-wider">{curMission.missionName}</span>
              <h4 className="text-xl font-black text-white font-serif">
                <MathText text={curMission.problem} />
              </h4>
              <p className="text-xs text-slate-400">Hedef: {curMission.targetOrbit}</p>
            </div>

            {/* Inversion Mechanism Visualizer */}
            <div className="flex items-center gap-4 bg-slate-950/80 px-6 py-4 rounded-2xl border border-slate-800 font-serif">
              <div className="text-center">
                <div className="text-xs text-slate-400 font-sans">1. Kesir</div>
                <MathFraction value={curMission.firstFrac.label} className="text-xl font-bold text-teal-400" />
                <div className="text-[10px] text-teal-300 font-sans">Aynen Kalır</div>
              </div>

              <div className="text-xl font-bold text-amber-400 font-mono">÷ ➔ ×</div>

              <div className="text-center">
                <div className="text-xs text-slate-400 font-sans">2. Kesir (Bölen)</div>
                <div className={`transition-all duration-500 ${isFlippedAnimation ? 'text-emerald-400 scale-110' : 'text-purple-400'}`}>
                  <MathFraction value={isFlippedAnimation ? curMission.invertedFrac.label : curMission.secondFrac.label} className="text-xl font-bold" />
                </div>
                <div className="text-[10px] text-purple-300 font-sans">
                  {isFlippedAnimation ? '🔄 Ters Çevrildi!' : '🔄 Ters Çevrilmeli'}
                </div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 block">
              Hangi ters çevirip çarpma adımı roketi hedef yörüngeye fırlatır?
            </span>
            <div className="grid grid-cols-1 gap-3">
              {curMission.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={Boolean(selectedOptionId)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer font-bold flex items-center justify-between gap-4 ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-600/20'
                          : 'bg-rose-600/30 border-rose-500 text-rose-200'
                        : selectedOptionId
                        ? 'opacity-40 bg-slate-800 border-slate-700 text-slate-400'
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-indigo-500 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-4 font-serif">
                      <MathText text={opt.stepText} className="text-base font-bold" />
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-500/30 flex items-center gap-1 font-sans">
                        = <MathText text={opt.result} />
                      </span>
                    </div>
                    {isSelected && (
                      opt.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Next Step */}
          {selectedOptionId && (
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
              <p className="text-xs text-slate-300">
                <MathText text={selectedOpt?.explanation} />
              </p>
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
              >
                <span>{missionIdx < ROCKET_MISSIONS.length - 1 ? 'Sonraki Göreve Geç' : 'Sonuçları Gör'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completed Screen */
        <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center text-indigo-400 mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-black text-white">Ters Takla Roket İtkisi Tamamlandı!</h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Toplam <strong>{score} XP</strong> ve <strong>Takla Atan Kesirler Ustası Rozeti</strong> kazandınız. Bölme işleminde ters çevirip çarpma kuralını ustalıkla uyguladınız!
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tekrar Oyna</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =================================================================
// 3. OYUN: SADELEŞTİRME LAZERİ (ÇAPRAZ GÜÇ & TERS ELEMAN)
// =================================================================
interface LaserTarget {
  id: number;
  question: string;
  expression: string;
  crossSimplifications: Array<{ pair: string; simplified: string }>;
  options: Array<{
    id: string;
    finalFraction: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

const LASER_TARGETS: LaserTarget[] = [
  {
    id: 1,
    question: 'Çapraz Lazer Kilidi (15 ve 25, 14 ve 28)',
    expression: '(15/28) × (14/25)',
    crossSimplifications: [
      { pair: '15 ile 25', simplified: '5\'e böl ➔ 3 ve 5 kalır' },
      { pair: '14 ile 28', simplified: '14\'e böl ➔ 1 ve 2 kalır' }
    ],
    options: [
      { id: 'l1', finalFraction: '3/10', isCorrect: true, explanation: '(15/28) x (14/25) = (3/2) x (1/5) = (3x1)/(2x5) = 3/10. Çapraz lazer ile dev sayılar anında ufalır!' },
      { id: 'l2', finalFraction: '210/700', isCorrect: false, explanation: 'Büyük sayıları çarpmak yerine önce çapraz sadeleştirme yapmalısınız.' },
      { id: 'l3', finalFraction: '2/5', isCorrect: false, explanation: 'İşlem hatası.' }
    ]
  },
  {
    id: 2,
    question: 'Çarpmaya Göre Ters Eleman Kalkanı',
    expression: '(-7/9) × (-9/7) × (5/8)',
    crossSimplifications: [
      { pair: '(-7/9) × (-9/7)', simplified: '= +1 (Ters Eleman Etkisizleştirir)' }
    ],
    options: [
      { id: 'l4', finalFraction: '5/8', isCorrect: true, explanation: '(-7/9) x (-9/7) = +1 (Etkisiz eleman). 1 x (5/8) = 5/8. Çarpmaya göre tersiyle çarpılan sayılar 1 olur!' },
      { id: 'l5', finalFraction: '-5/8', isCorrect: false, explanation: 'İki negatifin çarpımı +1 olur, sonuç +5/8\'dir.' },
      { id: 'l6', finalFraction: '0', isCorrect: false, explanation: '0 yutan elemandır fakat çarpanların hiçbiri 0 değildir.' }
    ]
  },
  {
    id: 3,
    question: 'Zincirleme Lazer Dizisi',
    expression: '(2/3) × (3/4) × (4/5)',
    crossSimplifications: [
      { pair: '3 ile 3', simplified: 'Sadeleşir ➔ 1 kalır' },
      { pair: '4 ile 4', simplified: 'Sadeleşir ➔ 1 kalır' }
    ],
    options: [
      { id: 'l7', finalFraction: '2/5', isCorrect: true, explanation: '3\'ler ve 4\'ler birbirini 1 yapar! Geriye sadece en baştaki pay 2 ve en sondaki payda 5 kalır: 2/5!' },
      { id: 'l8', finalFraction: '24/60', isCorrect: false, explanation: 'Sadeleştirilmiş en son hali 2/5\'tir.' },
      { id: 'l9', finalFraction: '1/2', isCorrect: false, explanation: 'Hatalı sadeleştirme.' }
    ]
  },
  {
    id: 4,
    question: 'Ondalık Gösterim & Negatif Ters Eleman',
    expression: '0,4 × (-5/2)',
    crossSimplifications: [
      { pair: '0,4 = 4/10 = 2/5', simplified: '2/5 ile -5/2 birbirinin tersidir' }
    ],
    options: [
      { id: 'l10', finalFraction: '-1', isCorrect: true, explanation: '0,4 = 2/5. (2/5) x (-5/2) = -10/10 = -1 tam! Çarpmaya göre ters eleman ve negatif işaret -1 yapar!' },
      { id: 'l11', finalFraction: '+1', isCorrect: false, explanation: 'İşaret hatası; pozitif x negatif = negatiftir (-1).' },
      { id: 'l12', finalFraction: '-2/5', isCorrect: false, explanation: 'Hatalı işlem.' }
    ]
  }
];

export function SimplificationLaserGame() {
  const { playSound } = useApp();
  const { currentUser } = useAuth();

  const [targetIdx, setTargetIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [laserFired, setLaserFired] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const curTarget = LASER_TARGETS[targetIdx];
  const selectedOpt = curTarget?.options.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (optId: string) => {
    if (selectedOptionId) return;
    setSelectedOptionId(optId);
    setLaserFired(true);

    const opt = curTarget.options.find((o) => o.id === optId);
    if (opt?.isCorrect) {
      playSound('success');
      setScore((prev) => prev + 35);
      confetti({ particleCount: 60, spread: 75, origin: { y: 0.6 } });
    } else {
      playSound('bell');
    }
  };

  const handleNext = () => {
    if (targetIdx < LASER_TARGETS.length - 1) {
      setTargetIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setLaserFired(false);
    } else {
      setIsCompleted(true);
      playSound('success');
      confetti({ particleCount: 150, spread: 100 });

      const activeStudent = getStoredActiveBoardStudent();
      if (activeStudent && currentUser) {
        saveBoardParticipation({
          studentId: activeStudent.id,
          studentNumber: activeStudent.studentNumber,
          studentName: activeStudent.name,
          classSection: activeStudent.classSection,
          teacherId: currentUser.id,
          outcomeCode: 'MAT.7.1.4',
          activityTitle: 'Sadeleştirme Lazeri & Çapraz Güç',
          activityType: 'game',
          xpEarned: score + (selectedOpt?.isCorrect ? 35 : 0)
        });
        clearActiveBoardStudent();
      }
    }
  };

  const handleRestart = () => {
    setTargetIdx(0);
    setSelectedOptionId(null);
    setLaserFired(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black tracking-wider uppercase border border-rose-500/30">
                3. Oyun • Çapraz Sadeleştirme
              </span>
              <span className="text-xs text-slate-400 font-bold">Hedef {targetIdx + 1} / {LASER_TARGETS.length}</span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">Sadeleştirme Lazeri: Çapraz Güç & Ters Eleman</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2">
            <Award className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-black text-rose-300">{score} XP</span>
          </div>
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Yeniden Başlat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isCompleted ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Laser Target Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Lazer Kilitlenmesi: {curTarget.question}
              </span>
            </div>

            <div className="flex items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800 font-serif">
              <span className={`text-2xl sm:text-3xl font-bold tracking-wider transition-all duration-500 ${laserFired ? 'text-amber-400 scale-105' : 'text-white'}`}>
                <MathText text={curTarget.expression} />
              </span>
            </div>

            {/* Simplification Hints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {curTarget.crossSimplifications.map((s, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  <span><strong>{s.pair}:</strong> {s.simplified}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 block">
              Sadeleştirme lazeri ateşlendikten sonra kalan en sade değer nedir?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {curTarget.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={Boolean(selectedOptionId)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer font-bold flex flex-col items-center justify-center gap-2 ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/20'
                          : 'bg-rose-600/30 border-rose-500 text-rose-200'
                        : selectedOptionId
                        ? 'opacity-40 bg-slate-800 border-slate-700 text-slate-400'
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-rose-500 text-white'
                    }`}
                  >
                    <MathText text={opt.finalFraction} className="text-2xl font-bold font-serif" />
                    {isSelected && (
                      opt.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Next */}
          {selectedOptionId && (
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
              <p className="text-xs text-slate-300">
                <MathText text={selectedOpt?.explanation} />
              </p>
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
              >
                <span>{targetIdx < LASER_TARGETS.length - 1 ? 'Sonraki Hedefe Geç' : 'Sonuçları Gör'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completed Screen */
        <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-rose-400 mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-black text-white">Sadeleştirme Lazeri Görevi Tamamlandı!</h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Toplam <strong>{score} XP</strong> kazandınız. Çapraz sadeleştirme ve ters eleman özelliklerini refleks haline getirdiniz!
          </p>
          <div className="pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yeniden Oyna</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
