'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Rocket,
  Fuel,
  Compass,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Award,
  ArrowRight,
  Zap,
  Play,
  Flame,
  ShieldCheck,
  Plus,
  Minus,
  Layers,
  ChevronRight
} from 'lucide-react';
import { getStoredActiveBoardStudent, clearActiveBoardStudent, saveBoardParticipation } from '@/lib/board-participation-store';
import { useAuth } from '@/lib/auth-store';

// =================================================================
// 1. OYUN: GÖKBEY YAKIT TANKI DOLDURMA-BOŞALTMA YARIŞI
// =================================================================
interface TankMission {
  id: number;
  initialFraction: string;
  initialNum: number;
  initialDen: number;
  targetFraction: string;
  targetNum: number;
  targetDen: number;
  options: Array<{
    id: string;
    label: string;
    num: number;
    den: number;
    op: '+' | '-';
    isCorrect: boolean;
    explanation: string;
  }>;
}

const TANK_MISSIONS: TankMission[] = [
  {
    id: 1,
    initialFraction: '1/4',
    initialNum: 1,
    initialDen: 4,
    targetFraction: '5/8',
    targetNum: 5,
    targetDen: 8,
    options: [
      { id: 'opt1', label: '+ 3/8 ton', num: 3, den: 8, op: '+', isCorrect: true, explanation: '1/4 = 2/8. 2/8 + 3/8 = 5/8 ton. Hedef seviyeye tam ulaşıldı!' },
      { id: 'opt2', label: '+ 1/2 ton', num: 1, den: 2, op: '+', isCorrect: false, explanation: '1/4 + 1/2 = 2/8 + 4/8 = 6/8 ton (Depo taştı!).' },
      { id: 'opt3', label: '- 1/8 ton', num: 1, den: 8, op: '-', isCorrect: false, explanation: '2/8 - 1/8 = 1/8 ton (Seviye azaldı!).' }
    ]
  },
  {
    id: 2,
    initialFraction: '7/10',
    initialNum: 7,
    initialDen: 10,
    targetFraction: '1/5',
    targetNum: 1,
    targetDen: 5,
    options: [
      { id: 'opt1', label: '- 1/2 ton', num: 1, den: 2, op: '-', isCorrect: true, explanation: '7/10 - 1/2 = 7/10 - 5/10 = 2/10 = 1/5 ton. Mükemmel boşaltım!' },
      { id: 'opt2', label: '- 3/10 ton', num: 3, den: 10, op: '-', isCorrect: false, explanation: '7/10 - 3/10 = 4/10 = 2/5 ton (Hedef 1/5 tondu).' },
      { id: 'opt3', label: '+ 1/5 ton', num: 1, den: 5, op: '+', isCorrect: false, explanation: '7/10 + 2/10 = 9/10 ton (Yakıt arttı, hedef azalmaktı).' }
    ]
  },
  {
    id: 3,
    initialFraction: '1/6',
    initialNum: 1,
    initialDen: 6,
    targetFraction: '1 tam (6/6)',
    targetNum: 6,
    targetDen: 6,
    options: [
      { id: 'opt1', label: '+ 5/6 ton', num: 5, den: 6, op: '+', isCorrect: true, explanation: '1/6 + 5/6 = 6/6 = 1 tam depo! Kalkışa hazır!' },
      { id: 'opt2', label: '+ 2/3 ton', num: 2, den: 3, op: '+', isCorrect: false, explanation: '1/6 + 4/6 = 5/6 ton (Depo tam dolmadı).' },
      { id: 'opt3', label: '+ 3/4 ton', num: 3, den: 4, op: '+', isCorrect: false, explanation: '2/12 + 9/12 = 11/12 ton (Az kaldı ama 1 tam değil).' }
    ]
  },
  {
    id: 4,
    initialFraction: '2/5',
    initialNum: 2,
    initialDen: 5,
    targetFraction: '17/20',
    targetNum: 17,
    targetDen: 20,
    options: [
      { id: 'opt1', label: '+ 9/20 ton', num: 9, den: 20, op: '+', isCorrect: true, explanation: '2/5 = 8/20. 8/20 + 9/20 = 17/20 ton! Yörünge itkisi hazır.' },
      { id: 'opt2', label: '+ 1/2 ton', num: 1, den: 2, op: '+', isCorrect: false, explanation: '8/20 + 10/20 = 18/20 ton (Hedef 17/20 idi).' },
      { id: 'opt3', label: '+ 3/10 ton', num: 3, den: 10, op: '+', isCorrect: false, explanation: '8/20 + 6/20 = 14/20 ton (Yetersiz itki).' }
    ]
  }
];

export function GokbeyFuelTankGame() {
  const { playSound, addPoints, unlockBadge, selectedOutcome } = useApp();
  const { currentUser } = useAuth();
  const [missionIdx, setMissionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const curMission = TANK_MISSIONS[missionIdx];
  const selectedOpt = curMission.options.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (optId: string) => {
    if (selectedOptionId) return;
    setSelectedOptionId(optId);

    const opt = curMission.options.find((o) => o.id === optId);
    if (opt?.isCorrect) {
      playSound('success');
      setScore((s) => s + 25);
      addPoints(25);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      playSound('click');
    }

    const activeStudent = getStoredActiveBoardStudent();
    if (activeStudent && currentUser?.role === 'teacher') {
      saveBoardParticipation({
        studentId: activeStudent.id,
        studentName: activeStudent.name,
        studentNumber: activeStudent.studentNumber,
        classSection: activeStudent.classSection,
        school: activeStudent.school,
        teacherId: currentUser?.id,
        teacherName: currentUser?.name,
        activityType: 'game',
        activityTitle: 'Gökbey Yakıt Tankı Doldurma-Boşaltma',
        outcomeCode: selectedOutcome?.code || 'MAT.7.1.3',
        subject: 'Matematik',
        score: opt?.isCorrect ? 100 : 25,
        maxScore: 100,
        xpEarned: opt?.isCorrect ? 25 : 5
      });
      clearActiveBoardStudent();
    }
  };

  const handleNext = () => {
    if (missionIdx < TANK_MISSIONS.length - 1) {
      setMissionIdx((m) => m + 1);
      setSelectedOptionId(null);
    } else {
      setCompleted(true);
      playSound('bell');
      unlockBadge('mat7-fuel-commander');
      confetti({ particleCount: 120, spread: 80 });
    }
  };

  const handleRestart = () => {
    setMissionIdx(0);
    setSelectedOptionId(null);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="w-full bg-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-indigo-500/40 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white shadow-md">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base sm:text-lg text-white">
                Gökbey Yakıt Tankı Doldurma-Boşaltma Yarışı
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Hedef İtki
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Başlangıç seviyesindeki yakıtı hedef seviyeye getirmek için doğru rasyonel miktarı ekleyin veya çıkarın!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-500/30">
            Skor: {score} XP
          </span>
          <span className="text-xs text-slate-400 font-bold bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
            Görev {missionIdx + 1}/{TANK_MISSIONS.length}
          </span>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-6">
          {/* Tank Visual Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Mission Info */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="text-xs font-black text-indigo-300 uppercase tracking-wider block">
                  İstasyon Yakıt Durumu
                </span>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Mevcut Seviye:</span>
                  <span className="font-black text-amber-400 text-base">{curMission.initialFraction} ton</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Hedeflenen Seviye:</span>
                  <span className="font-black text-emerald-400 text-base">{curMission.targetFraction} ton</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
                💡 <strong>Taktik İpucu:</strong> Mevcut seviye ile hedef seviyeyi aynı ortak paydada buluşturun, aradaki farkı bulun ve doğru valf seçeneğini açın!
              </div>
            </div>

            {/* Right: Tank Level Graphic */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-3">
              <span className="text-xs font-bold text-slate-400">YAKIT TANKI GÖSTERGESİ</span>
              
              <div className="relative w-36 h-48 bg-slate-800 rounded-2xl border-4 border-slate-700 overflow-hidden flex flex-col justify-end p-1">
                {/* Target line indicator */}
                <div
                  className="absolute w-full border-b-2 border-dashed border-emerald-400 z-10 flex justify-end pr-1"
                  style={{ bottom: `${(curMission.targetNum / curMission.targetDen) * 100}%` }}
                >
                  <span className="text-[9px] font-black text-emerald-400 bg-slate-900/90 px-1 rounded">
                    Hedef
                  </span>
                </div>

                {/* Fluid Level Animation */}
                <div
                  className={`w-full rounded-xl transition-all duration-700 ${
                    selectedOpt?.isCorrect
                      ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-lg shadow-emerald-500/30'
                      : selectedOptionId
                      ? 'bg-gradient-to-t from-rose-600 to-amber-500'
                      : 'bg-gradient-to-t from-indigo-600 to-sky-400'
                  }`}
                  style={{
                    height: selectedOpt
                      ? selectedOpt.isCorrect
                        ? `${(curMission.targetNum / curMission.targetDen) * 100}%`
                        : `${Math.min(100, Math.max(10, ((curMission.initialNum / curMission.initialDen) + (selectedOpt.op === '+' ? (selectedOpt.num / selectedOpt.den) : -(selectedOpt.num / selectedOpt.den))) * 100))}%`
                      : `${(curMission.initialNum / curMission.initialDen) * 100}%`
                  }}
                />
              </div>

              <span className="text-xs text-slate-400 font-medium">
                {selectedOptionId ? (selectedOpt?.isCorrect ? '✅ Hedefe Ulaşıldı' : '❌ Hatalı Seviye') : 'Seçim Bekleniyor...'}
              </span>
            </div>
          </div>

          {/* Options Selection */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 block">
              Hangi yakıt aktarımı veya tahliyesi yapılmalıdır?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {curMission.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={Boolean(selectedOptionId)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer font-bold flex flex-col justify-between gap-2 ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                          : 'bg-rose-600/30 border-rose-500 text-rose-200'
                        : selectedOptionId
                        ? 'opacity-40 bg-slate-800 border-slate-700 text-slate-400'
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-indigo-500 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black">{opt.label}</span>
                      {isSelected && (
                        opt.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Next Step */}
          {selectedOptionId && (
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
              <p className="text-xs text-slate-300">
                {selectedOpt?.explanation}
              </p>
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
              >
                <span>{missionIdx < TANK_MISSIONS.length - 1 ? 'Sonraki Göreve Geç' : 'Sonuçları Gör'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completed Screen */
        <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-black text-white">Gökbey Yakıt Görevi Başarıyla Tamamlandı!</h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Toplam <strong>{score} XP</strong> kazandınız. Rasyonel sayılarda toplama ve çıkarma stratejilerini başarıyla uyguladınız!
          </p>
          <div className="pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
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
