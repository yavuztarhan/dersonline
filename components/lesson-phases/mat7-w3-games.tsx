'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Scale,
  Thermometer,
  Wind,
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
  Compass,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { getStoredActiveBoardStudent, clearActiveBoardStudent, saveBoardParticipation } from '@/lib/board-participation-store';
import { useAuth } from '@/lib/auth-store';
import { MathFraction } from '@/components/ui/math-fraction';

// =================================================================
// 1. OYUN: RASYONEL DENGE TERAZİSİ (HIZLI KARŞILAŞTIRMA ARCADE)
// =================================================================
interface ScaleQuestion {
  id: number;
  leftFraction: string;
  rightFraction: string;
  leftVal: number;
  rightVal: number;
  correctSign: '<' | '=' | '>';
  strategy: string;
  explanation: string;
}

const SCALE_QUESTIONS: ScaleQuestion[] = [
  {
    id: 1,
    leftFraction: '4/7',
    rightFraction: '4/9',
    leftVal: 4 / 7,
    rightVal: 4 / 9,
    correctSign: '>',
    strategy: 'Payları Eşit Kuralı',
    explanation: 'Payları eşit pozitif kesirlerde paydası küçük olan büyüktür (7 < 9 olduğundan 4/7 > 4/9). Dilimler 7\'ye bölündüğünde daha büyüktür.'
  },
  {
    id: 2,
    leftFraction: '7/12',
    rightFraction: '11/12',
    leftVal: 7 / 12,
    rightVal: 11 / 12,
    correctSign: '<',
    strategy: 'Paydaları Eşit Kuralı',
    explanation: 'Paydaları eşit pozitif kesirlerde payı büyük olan büyüktür (7 < 11 olduğundan 7/12 < 11/12).'
  },
  {
    id: 3,
    leftFraction: '-1/4',
    rightFraction: '-3/4',
    leftVal: -0.25,
    rightVal: -0.75,
    correctSign: '>',
    strategy: 'Negatif Sayılarda Sıfıra Yakınlık',
    explanation: 'Negatif rasyonel sayılarda sayı doğrusunda 0\'a daha yakın olan (daha sağdaki) sayı daha büyüktür (-1/4 > -3/4).'
  },
  {
    id: 4,
    leftFraction: '13/28',
    rightFraction: '17/32',
    leftVal: 13 / 28,
    rightVal: 17 / 32,
    correctSign: '<',
    strategy: 'Yarıma (1/2) Yakınlık Referansı',
    explanation: '13/28 < 1/2 iken 17/32 > 1/2\'dir. Yarımdan büyük olan kesir, yarımdan küçük olandan daima büyüktür: 13/28 < 17/32!'
  },
  {
    id: 5,
    leftFraction: '9/10',
    rightFraction: '7/8',
    leftVal: 9 / 10,
    rightVal: 7 / 8,
    correctSign: '>',
    strategy: 'Bütüne (1) Yakınlık Referansı',
    explanation: '1 - 9/10 = 1/10 ve 1 - 7/8 = 1/8. 1/10 < 1/8 olduğundan 9/10\'un eksiği daha azdır ve bütüne daha yakındır (9/10 > 7/8).'
  },
  {
    id: 6,
    leftFraction: '-2/3',
    rightFraction: '-5/6',
    leftVal: -2 / 3,
    rightVal: -5 / 6,
    correctSign: '>',
    strategy: 'Payda Eşitleme & Negatif Kuralı',
    explanation: '-2/3 = -4/6 olur. -4/6 ile -5/6 kıyaslandığında -4 > -5 olduğundan -2/3 > -5/6\'dır.'
  }
];

export function RationalScaleGame() {
  const { playSound, addPoints, unlockBadge, selectedOutcome } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSign, setSelectedSign] = useState<'<' | '=' | '>' | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const currentQ = SCALE_QUESTIONS[currentIndex];

  const handleChooseSign = (sign: '<' | '=' | '>') => {
    if (answered) return;

    setSelectedSign(sign);
    setAnswered(true);

    const correct = sign === currentQ.correctSign;
    setIsCorrect(correct);

    if (correct) {
      playSound('success');
      const newScore = score + 20;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      addPoints(20);

      // Smart Board Student Integration
      const activeStu = getStoredActiveBoardStudent();
      if (activeStu) {
        awardPointsToStudent(activeStu.id, 20);
        saveBoardParticipation({
          studentId: activeStu.id,
          studentName: activeStu.name,
          studentNumber: activeStu.studentNumber,
          classSection: activeStu.classSection,
          school: activeStu.school,
          teacherId: currentUser?.id,
          teacherName: currentUser?.name,
          activityType: 'game',
          activityTitle: 'Rasyonel Denge Terazisi',
          outcomeCode: selectedOutcome?.code || 'MAT.7.1.2',
          subject: 'Matematik',
          score: 100,
          maxScore: 100,
          xpEarned: 20
        });
      }

      if (newStreak >= 3) {
        unlockBadge('rational-scale-master');
      }

      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    } else {
      playSound('bell');
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    playSound('click');
    if (currentIndex < SCALE_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedSign(null);
      setAnswered(false);
      setIsCorrect(false);
    } else {
      setGameOver(true);
      playSound('bell');
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    playSound('select');
    setCurrentIndex(0);
    setSelectedSign(null);
    setAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setStreak(0);
    setGameOver(false);
  };

  // Dinamik Terazi Eğim Açısı
  const getTiltDeg = () => {
    if (!answered) return 0;
    if (currentQ.correctSign === '>') return -9;
    if (currentQ.correctSign === '<') return 9;
    return 0;
  };

  if (gameOver) {
    return (
      <div className="bg-slate-900 border-2 border-violet-500/50 rounded-3xl p-6 sm:p-8 text-white text-center space-y-5 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-3xl bg-violet-500/20 border-2 border-violet-400 text-violet-300 flex items-center justify-center mx-auto shadow-lg shadow-violet-500/20">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <span className="px-3 py-1 rounded-full bg-violet-900/80 border border-violet-400/40 text-violet-200 text-xs font-black uppercase tracking-wider">
            Tebrikler! Denge Ustası
          </span>
          <h3 className="text-2xl font-black text-white mt-2">Rasyonel Denge Terazisi Tamamlandı!</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Tüm rasyonel karşılaştırma sorularını çözdünüz. Pay, payda, referans ve negatif sıralama kurallarını ustaca uyguladınız!
          </p>
        </div>

        <div className="inline-flex items-center gap-6 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Toplam Puan</div>
            <div className="text-2xl font-black text-amber-400 font-mono">+{score} XP</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Doğruluk Oranı</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              %{Math.round((score / (SCALE_QUESTIONS.length * 20)) * 100)}
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-sm shadow-lg shadow-violet-600/30 transition-all cursor-pointer flex items-center gap-2 mx-auto active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Oyna</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white space-y-5">
      {/* Üst Başlık & Skor */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Rasyonel Denge Terazisi</h3>
            <span className="text-[11px] text-slate-400">
              Soru {currentIndex + 1} / {SCALE_QUESTIONS.length} • Strateji: <strong className="text-violet-300">{currentQ.strategy}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {streak >= 2 && (
            <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black flex items-center gap-1">
              <Flame className="w-3 h-3" /> {streak} Seri!
            </span>
          )}
          <span className="px-3 py-1 rounded-xl bg-violet-950 border border-violet-500/40 text-violet-300 font-mono font-black text-xs">
            {score} XP
          </span>
        </div>
      </div>

      {/* Terazi Sahnesi */}
      <div className="bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden">
        
        {/* Ortada Beklenen Sembol veya Soru İşareti */}
        <div className="absolute top-3 px-4 py-1.5 rounded-full bg-slate-900/90 border border-violet-500/40 text-amber-300 font-mono text-sm font-black shadow-lg flex items-center gap-3">
          <MathFraction value={currentQ.leftFraction} />
          <span className="text-violet-300 text-base font-black px-1">
            {answered ? currentQ.correctSign : '?'}
          </span>
          <MathFraction value={currentQ.rightFraction} />
        </div>

        {/* Terazi Gövdesi */}
        <div className="w-full max-w-sm relative flex flex-col items-center pt-10">
          
          {/* Kol */}
          <div
            className="w-full h-2.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full shadow-lg relative transition-transform duration-700 ease-out origin-center"
            style={{ transform: `rotate(${getTiltDeg()}deg)` }}
          >
            {/* Sol Kefe */}
            <div className="absolute -left-2 top-2.5 flex flex-col items-center">
              <div className="w-0.5 h-12 bg-slate-400" />
              <div className={`w-28 h-12 rounded-b-2xl border-2 shadow-xl flex flex-col items-center justify-center -mt-1 p-1 transition-all ${
                answered && currentQ.correctSign === '>'
                  ? 'bg-emerald-950/80 border-emerald-400 shadow-emerald-500/20'
                  : 'bg-slate-900 border-amber-400/80'
              }`}>
                <span className="font-mono text-sm font-black text-amber-300">
                  <MathFraction value={currentQ.leftFraction} />
                </span>
                {answered && (
                  <span className="text-[9px] text-slate-400 font-mono">
                    ({currentQ.leftVal > 0 ? '+' : ''}{currentQ.leftVal.toFixed(2)})
                  </span>
                )}
              </div>
            </div>

            {/* Sağ Kefe */}
            <div className="absolute -right-2 top-2.5 flex flex-col items-center">
              <div className="w-0.5 h-12 bg-slate-400" />
              <div className={`w-28 h-12 rounded-b-2xl border-2 shadow-xl flex flex-col items-center justify-center -mt-1 p-1 transition-all ${
                answered && currentQ.correctSign === '<'
                  ? 'bg-emerald-950/80 border-emerald-400 shadow-emerald-500/20'
                  : 'bg-slate-900 border-slate-600'
              }`}>
                <span className="font-mono text-sm font-black text-slate-300">
                  <MathFraction value={currentQ.rightFraction} />
                </span>
                {answered && (
                  <span className="text-[9px] text-slate-400 font-mono">
                    ({currentQ.rightVal > 0 ? '+' : ''}{currentQ.rightVal.toFixed(2)})
                  </span>
                )}
              </div>
            </div>

            {/* Merkez İbre */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-950 shadow-md" />
          </div>

          {/* Dayanak Üçgeni */}
          <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[45px] border-b-slate-700 z-0" />
          <div className="w-32 h-3.5 bg-slate-800 rounded-full border border-slate-700 shadow-md -mt-0.5" />
        </div>
      </div>

      {/* Seçenek Butonları (< , = , >) */}
      {!answered ? (
        <div className="space-y-2 text-center">
          <div className="text-xs text-slate-300 font-bold">
            İki rasyonel sayı arasına hangi sembol gelmelidir?
          </div>
          <div className="flex items-center justify-center gap-3">
            {[
              { sign: '<' as const, label: '< (Küçüktür)' },
              { sign: '=' as const, label: '= (Eşittir)' },
              { sign: '>' as const, label: '> (Büyüktür)' }
            ].map((btn) => (
              <button
                key={btn.sign}
                type="button"
                onClick={() => handleChooseSign(btn.sign)}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-violet-600 hover:text-white border-2 border-slate-700 hover:border-violet-400 font-mono font-black text-base transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in duration-300">
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isCorrect ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-100' : 'bg-rose-950/50 border-rose-500/50 text-rose-100'
          }`}>
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <div className="font-bold">
                {isCorrect ? 'Harika! Doğru Seçim (+20 XP)' : `Hatalı! Doğru cevap "${currentQ.correctSign}" olmalıydı.`}
              </div>
              <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextQuestion}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <span>{currentIndex < SCALE_QUESTIONS.length - 1 ? 'Sıradaki Soruya Geç' : 'Sonuçları Gör'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// =================================================================
// 2. OYUN: PALANDÖKEN DONDURUCU SOĞUK SIRALAMA PARKURU
// =================================================================
interface FreezeLevel {
  id: number;
  title: string;
  items: Array<{ id: string; name: string; temp: string; val: number }>;
  strategyTip: string;
}

const FREEZE_LEVELS: FreezeLevel[] = [
  {
    id: 1,
    title: '1. Aşama: Zirveden Vadiye 4 Pist Sıcaklığı',
    items: [
      { id: 'f1', name: 'Ejder Tepesi', temp: '-3/4 °C', val: -0.75 },
      { id: 'f2', name: 'Vadi Kapısı', temp: '-1/4 °C', val: -0.25 },
      { id: 'f3', name: 'Gondol İstasyonu', temp: '-1/2 °C', val: -0.50 },
      { id: 'f4', name: 'Buzul Sırtı', temp: '-5/6 °C', val: -0.833 }
    ],
    strategyTip: 'Negatif sayılarda 0\'a en uzak olan (en soldaki) sayı en küçüktür ve en soğuk pisttir!'
  },
  {
    id: 2,
    title: '2. Aşama: Paydaları Eşit Negatif Sıcaklıklar',
    items: [
      { id: 'f5', name: 'Kuzey Yamacı', temp: '-7/8 °C', val: -0.875 },
      { id: 'f6', name: 'Güney Pisti', temp: '-3/8 °C', val: -0.375 },
      { id: 'f7', name: 'Merkez Kafe', temp: '-1/8 °C', val: -0.125 },
      { id: 'f8', name: 'Rüzgar Boğazı', temp: '-5/8 °C', val: -0.625 }
    ],
    strategyTip: 'Paydalar eşitse payı en küçük olan negatif sayı (-7) en küçüktür: -7/8 < -5/8 < -3/8 < -1/8.'
  },
  {
    id: 3,
    title: '3. Aşama: Pozitif & Negatif Karışık Sapmalar',
    items: [
      { id: 'f9', name: 'Kar Tüneli', temp: '-2/3 °C', val: -0.667 },
      { id: 'f10', name: 'Kayak Evi', temp: '+1/2 °C', val: 0.500 },
      { id: 'f11', name: 'Gözlem Kulesi', temp: '-1/6 °C', val: -0.167 },
      { id: 'f12', name: 'Güneşli Teras', temp: '+3/4 °C', val: 0.750 }
    ],
    strategyTip: 'Negatif sayılar daima pozitif sayılardan küçüktür: -2/3 < -1/6 < +1/2 < +3/4.'
  }
];

export function NegativeFreezeGame() {
  const { playSound, addPoints, unlockBadge, selectedOutcome } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = FREEZE_LEVELS[currentLevelIdx];

  const [orderedItems, setOrderedItems] = useState<Array<{ id: string; name: string; temp: string; val: number }>>(() => {
    return [...currentLevel.items].sort(() => Math.random() - 0.5);
  });

  const [validated, setValidated] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [completedAll, setCompletedAll] = useState(false);

  const moveItem = (index: number, direction: 'left' | 'right') => {
    playSound('click');
    const newItems = [...orderedItems];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setOrderedItems(newItems);
    setValidated(false);
  };

  const handleCheckOrder = () => {
    let correct = true;
    for (let i = 0; i < orderedItems.length - 1; i++) {
      if (orderedItems[i].val > orderedItems[i + 1].val) {
        correct = false;
        break;
      }
    }

    setValidated(true);
    setIsSuccess(correct);

    if (correct) {
      playSound('success');
      setScore((s) => s + 30);
      addPoints(30);

      const activeStu = getStoredActiveBoardStudent();
      if (activeStu) {
        awardPointsToStudent(activeStu.id, 30);
        saveBoardParticipation({
          studentId: activeStu.id,
          studentName: activeStu.name,
          studentNumber: activeStu.studentNumber,
          classSection: activeStu.classSection,
          school: activeStu.school,
          teacherId: currentUser?.id,
          teacherName: currentUser?.name,
          activityType: 'game',
          activityTitle: 'Palandöken Dondurucu Sıralama',
          outcomeCode: selectedOutcome?.code || 'MAT.7.1.2',
          subject: 'Matematik',
          score: 100,
          maxScore: 100,
          xpEarned: 30
        });
      }

      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      playSound('bell');
    }
  };

  const handleNextLevel = () => {
    playSound('click');
    if (currentLevelIdx < FREEZE_LEVELS.length - 1) {
      const nextIdx = currentLevelIdx + 1;
      setCurrentLevelIdx(nextIdx);
      setOrderedItems([...FREEZE_LEVELS[nextIdx].items].sort(() => Math.random() - 0.5));
      setValidated(false);
      setIsSuccess(false);
    } else {
      setCompletedAll(true);
      playSound('bell');
      unlockBadge('freezer-sort-master');
      try {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    playSound('select');
    setCurrentLevelIdx(0);
    setOrderedItems([...FREEZE_LEVELS[0].items].sort(() => Math.random() - 0.5));
    setValidated(false);
    setIsSuccess(false);
    setScore(0);
    setCompletedAll(false);
  };

  if (completedAll) {
    return (
      <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 text-white text-center space-y-5 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <span className="px-3 py-1 rounded-full bg-cyan-900/80 border border-cyan-400/40 text-cyan-200 text-xs font-black uppercase tracking-wider">
            Zirve Şampiyonu!
          </span>
          <h3 className="text-2xl font-black text-white mt-2">Dondurucu Sıralama Parkuru Tamamlandı!</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Negatif rasyonel sayıları en soğuktan en sıcağa kusursuz şekilde sıraladınız. Sıfıra yakın olanın büyük olduğunu kanıtladınız!
          </p>
        </div>

        <div className="inline-flex items-center gap-6 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Kazanılan Puan</div>
            <div className="text-2xl font-black text-amber-400 font-mono">+{score} XP</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Tamamlanan Aşama</div>
            <div className="text-2xl font-black text-cyan-400 font-mono">3 / 3</div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm shadow-lg shadow-cyan-600/30 transition-all cursor-pointer flex items-center gap-2 mx-auto active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Sırala</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white space-y-5">
      {/* Üst Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Dondurucu Soğuk Sıralama Parkuru</h3>
            <span className="text-[11px] text-slate-400">
              Aşama {currentLevelIdx + 1} / {FREEZE_LEVELS.length} • {currentLevel.title}
            </span>
          </div>
        </div>

        <div className="px-3 py-1 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-black text-xs">
          {score} XP
        </div>
      </div>

      {/* Yönerge Kartı */}
      <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-cyan-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Pist sıcaklıklarını <strong>EN SOĞUKTAN EN SIÇAĞA (Küçükten Büyüğe: &lt;)</strong> doğru sıralayınız!
          </span>
        </div>
        <span className="text-[10px] text-cyan-300 font-bold hidden sm:inline">Ok butonlarıyla yer değiştirin</span>
      </div>

      {/* İnteraktif Kartlar Dizisi */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {orderedItems.map((item, idx) => (
          <div
            key={item.id}
            className={`rounded-2xl p-4 border flex flex-col items-center justify-between text-center transition-all ${
              validated
                ? isSuccess
                  ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-rose-950/40 border-rose-500/60'
                : 'bg-slate-950 border-slate-800 hover:border-cyan-500/40'
            }`}
          >
            {/* Sıra Numarası */}
            <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-black flex items-center justify-center mb-2">
              {idx + 1}
            </div>

            {/* Pist Adı */}
            <div className="text-xs font-bold text-slate-300 truncate max-w-full">
              {item.name}
            </div>

            {/* Sıcaklık */}
            <div className="my-3 text-lg font-mono font-black text-cyan-300 flex items-center gap-1">
              <MathFraction value={item.temp.replace(' °C', '')} />
              <span>°C</span>
            </div>

            <div className="text-[10px] font-mono text-slate-500">
              ({item.val > 0 ? '+' : ''}{item.val.toFixed(2)})
            </div>

            {/* Değiştirme Butonları */}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80 w-full justify-center">
              <button
                type="button"
                disabled={idx === 0 || validated}
                onClick={() => moveItem(idx, 'left')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 disabled:opacity-30 disabled:hover:bg-slate-800 text-white transition-all cursor-pointer"
                title="Sola Kaydır"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
              <button
                type="button"
                disabled={idx === orderedItems.length - 1 || validated}
                onClick={() => moveItem(idx, 'right')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 disabled:opacity-30 disabled:hover:bg-slate-800 text-white transition-all cursor-pointer"
                title="Sağa Kaydır"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Kontrol & İlerleme Butonu */}
      <div className="space-y-3">
        {!validated ? (
          <button
            type="button"
            onClick={handleCheckOrder}
            className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm shadow-lg shadow-cyan-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sıralamayı Doğrula</span>
          </button>
        ) : (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isSuccess ? 'bg-emerald-950/50 border-emerald-500 text-emerald-100' : 'bg-rose-950/50 border-rose-500 text-rose-100'
            }`}>
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1">
                <div className="font-bold">
                  {isSuccess ? 'Mükemmel Sıralama! (+30 XP)' : 'Hatalı Sıralama! Tekrar düzenleyin.'}
                </div>
                <p className="text-slate-300 leading-relaxed">{currentLevel.strategyTip}</p>
              </div>
            </div>

            {isSuccess ? (
              <button
                type="button"
                onClick={handleNextLevel}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <span>{currentLevelIdx < FREEZE_LEVELS.length - 1 ? 'Sıradaki Aşamaya Geç' : 'Tüm Sonuçları Gör'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setValidated(false)}
                className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tekrar Sırala</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// =================================================================
// 3. OYUN: RÜZGAR TÜRBİNLERİ SÜRAT YARIŞI
// =================================================================
interface TurbineRaceQuestion {
  id: number;
  title: string;
  targetMode: 'fastest_to_slowest' | 'slowest_to_fastest';
  turbines: Array<{ id: string; name: string; speedFrac: string; speedDec: number; commonFrac: string }>;
  correctOrder: string[]; // ids in correct order
  commonDenominator: number;
  explanation: string;
}

const TURBINE_RACES: TurbineRaceQuestion[] = [
  {
    id: 1,
    title: '1. Yarış: Ortak Payda (12) ile Sürat Sıralaması',
    targetMode: 'slowest_to_fastest',
    turbines: [
      { id: 'tb1', name: 'Kuzey Türbini', speedFrac: '7/12', speedDec: 7 / 12, commonFrac: '7/12' },
      { id: 'tb2', name: 'Doğu Türbini', speedFrac: '3/4', speedDec: 3 / 4, commonFrac: '9/12' },
      { id: 'tb3', name: 'Zirve Türbini', speedFrac: '5/6', speedDec: 5 / 6, commonFrac: '10/12' }
    ],
    correctOrder: ['tb1', 'tb2', 'tb3'],
    commonDenominator: 12,
    explanation: '12 paydasında eşitledik: 7/12 < 9/12 (3/4) < 10/12 (5/6). En yavaş Kuzey (7/12), en hızlı Zirve (5/6) türbinidir.'
  },
  {
    id: 2,
    title: '2. Yarış: Yarıma Yakınlık ile Hız Sıralaması',
    targetMode: 'slowest_to_fastest',
    turbines: [
      { id: 'tb4', name: 'Vadi Türbini', speedFrac: '9/20', speedDec: 9 / 20, commonFrac: 'Yarımdan Küçük (< 1/2)' },
      { id: 'tb5', name: 'Baraj Türbini', speedFrac: '1/2', speedDec: 1 / 2, commonFrac: 'Tam Yarım (= 1/2)' },
      { id: 'tb6', name: 'Geçit Türbini', speedFrac: '13/24', speedDec: 13 / 24, commonFrac: 'Yarımdan Büyük (> 1/2)' }
    ],
    correctOrder: ['tb4', 'tb5', 'tb6'],
    commonDenominator: 0,
    explanation: '20\'nin yarısı 10 olduğundan 9/20 < 1/2. 24\'ün yarısı 12 olduğundan 13/24 > 1/2. Sıralama: 9/20 < 1/2 < 13/24!'
  },
  {
    id: 3,
    title: '3. Yarış: Bütüne (1) Yakınlık & En Yüksek Sürat',
    targetMode: 'slowest_to_fastest',
    turbines: [
      { id: 'tb7', name: 'Fırtına Türbini', speedFrac: '11/12', speedDec: 11 / 12, commonFrac: '1/12 Eksik' },
      { id: 'tb8', name: 'Kanyon Türbini', speedFrac: '5/6', speedDec: 5 / 6, commonFrac: '1/6 Eksik' },
      { id: 'tb9', name: 'Plato Türbini', speedFrac: '7/8', speedDec: 7 / 8, commonFrac: '1/8 Eksik' }
    ],
    correctOrder: ['tb8', 'tb9', 'tb7'],
    commonDenominator: 24,
    explanation: 'Bütüne eksikler: 5/6 (1/6 eksik), 7/8 (1/8 eksik), 11/12 (1/12 eksik). Eksik parçası en küçük olan (1/12) bütüne en yakındır ve en hızlıdır: 5/6 < 7/8 < 11/12!'
  }
];

export function TurbineSpeedSortGame() {
  const { playSound, addPoints, unlockBadge, selectedOutcome } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [raceIndex, setRaceIndex] = useState(0);
  const currentRace = TURBINE_RACES[raceIndex];

  const [userOrder, setUserOrder] = useState<string[]>(() => {
    return [...currentRace.turbines].map((t) => t.id).sort(() => Math.random() - 0.5);
  });

  const [launched, setLaunched] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [completedAll, setCompletedAll] = useState(false);

  const moveTurbine = (index: number, dir: 'left' | 'right') => {
    playSound('click');
    const newOrder = [...userOrder];
    const target = dir === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[target];
    newOrder[target] = temp;
    setUserOrder(newOrder);
    setLaunched(false);
  };

  const handleLaunchRace = () => {
    const correct = userOrder.every((id, idx) => id === currentRace.correctOrder[idx]);

    setLaunched(true);
    setIsSuccess(correct);

    if (correct) {
      playSound('success');
      setScore((s) => s + 35);
      addPoints(35);

      const activeStu = getStoredActiveBoardStudent();
      if (activeStu) {
        awardPointsToStudent(activeStu.id, 35);
        saveBoardParticipation({
          studentId: activeStu.id,
          studentName: activeStu.name,
          studentNumber: activeStu.studentNumber,
          classSection: activeStu.classSection,
          school: activeStu.school,
          teacherId: currentUser?.id,
          teacherName: currentUser?.name,
          activityType: 'game',
          activityTitle: 'Türbin Sürat Yarışı',
          outcomeCode: selectedOutcome?.code || 'MAT.7.1.2',
          subject: 'Matematik',
          score: 100,
          maxScore: 100,
          xpEarned: 35
        });
      }

      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      playSound('bell');
    }
  };

  const handleNextRace = () => {
    playSound('click');
    if (raceIndex < TURBINE_RACES.length - 1) {
      const nextIdx = raceIndex + 1;
      setRaceIndex(nextIdx);
      setUserOrder([...TURBINE_RACES[nextIdx].turbines].map((t) => t.id).sort(() => Math.random() - 0.5));
      setLaunched(false);
      setIsSuccess(false);
    } else {
      setCompletedAll(true);
      playSound('bell');
      unlockBadge('turbine-speed-hero');
      try {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    playSound('select');
    setRaceIndex(0);
    setUserOrder([...TURBINE_RACES[0].turbines].map((t) => t.id).sort(() => Math.random() - 0.5));
    setLaunched(false);
    setIsSuccess(false);
    setScore(0);
    setCompletedAll(false);
  };

  if (completedAll) {
    return (
      <div className="bg-slate-900 border-2 border-teal-500/50 rounded-3xl p-6 sm:p-8 text-white text-center space-y-5 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-3xl bg-teal-500/20 border-2 border-teal-400 text-teal-300 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <span className="px-3 py-1 rounded-full bg-teal-900/80 border border-teal-400/40 text-teal-200 text-xs font-black uppercase tracking-wider">
            Rüzgar Şampiyonu!
          </span>
          <h3 className="text-2xl font-black text-white mt-2">Türbin Sürat Yarışı Tamamlandı!</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Türbinleri hızlarına göre payda eşitleme ve referans stratejileriyle başarıyla sıraladınız!
          </p>
        </div>

        <div className="inline-flex items-center gap-6 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Toplam Skor</div>
            <div className="text-2xl font-black text-amber-400 font-mono">+{score} XP</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Kazanılan Rozet</div>
            <div className="text-sm font-black text-teal-300">Rüzgar Mühendisi 🌀</div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm shadow-lg shadow-teal-600/30 transition-all cursor-pointer flex items-center gap-2 mx-auto active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Yarış</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white space-y-5">
      {/* Üst Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Rüzgar Türbinleri Sürat Yarışı</h3>
            <span className="text-[11px] text-slate-400">
              Yarış {raceIndex + 1} / {TURBINE_RACES.length} • {currentRace.title}
            </span>
          </div>
        </div>

        <div className="px-3 py-1 rounded-xl bg-teal-950 border border-teal-500/40 text-teal-300 font-mono font-black text-xs">
          {score} XP
        </div>
      </div>

      {/* Yönerge */}
      <div className="p-3 bg-teal-950/40 border border-teal-500/30 rounded-xl text-xs text-teal-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            Türbinleri <strong>EN YAVAŞTAN EN HIZLIYA (Küçükten Büyüğe: &lt;)</strong> doğru sıralayınız ve kanatları ateşleyiniz!
          </span>
        </div>
        <span className="text-[10px] text-teal-300 font-bold hidden sm:inline">Ok butonlarını kullanın</span>
      </div>

      {/* Türbin Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {userOrder.map((turbineId, idx) => {
          const t = currentRace.turbines.find((item) => item.id === turbineId)!;
          const spinDuration = `${Math.max(0.6, 2.5 - t.speedDec * 2)}s`;

          return (
            <div
              key={t.id}
              className={`rounded-2xl p-4 border flex flex-col items-center justify-between text-center transition-all ${
                launched
                  ? isSuccess
                    ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-rose-950/40 border-rose-500/60'
                  : 'bg-slate-950 border-slate-800 hover:border-teal-500/40'
              }`}
            >
              {/* Sıralama Konumu */}
              <div className="flex items-center justify-between w-full mb-2">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {idx === 0 ? 'En Yavaş' : idx === userOrder.length - 1 ? 'En Hızlı' : 'Ortanca'}
                </span>
              </div>

              {/* Dönen Türbin */}
              <div className="relative w-16 h-16 flex items-center justify-center my-2">
                <div
                  className="w-14 h-14 text-teal-400 animate-spin"
                  style={{ animationDuration: launched && isSuccess ? spinDuration : '3s' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 12c0-3 2-6 5-6s3 3 0 6c-3 0-5 0-5 0z" fill="currentColor" opacity="0.8" />
                    <path d="M12 12c-2.5 1.5-5 3.5-3.5 6s4.5 1.5 6-1.5c.5-1.5-1-3-2.5-4.5z" fill="currentColor" opacity="0.8" />
                    <path d="M12 12c-.5-3-3.5-5-6-3.5s-1.5 4.5 1.5 6c1.5.5 3.5-.5 4.5-2.5z" fill="currentColor" opacity="0.8" />
                  </svg>
                </div>
                <div className="absolute w-3 h-3 rounded-full bg-slate-950 border border-teal-400" />
              </div>

              {/* Türbin İsmi */}
              <div className="text-xs font-bold text-slate-200 mt-1">{t.name}</div>

              {/* Hız Kesri */}
              <div className="my-2 text-base font-mono font-black text-amber-300">
                <MathFraction value={t.speedFrac} unit="m/s" />
              </div>

              {/* Ortak Payda / Referans Notu */}
              <div className="text-[10px] text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/30 font-mono">
                {t.commonFrac}
              </div>

              {/* Değiştirme Butonları */}
              <div className="flex items-center gap-2 mt-4 pt-2 border-t border-slate-800/80 w-full justify-center">
                <button
                  type="button"
                  disabled={idx === 0 || launched}
                  onClick={() => moveTurbine(idx, 'left')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-teal-600 disabled:opacity-30 disabled:hover:bg-slate-800 text-white transition-all cursor-pointer"
                  title="Sola Kaydır"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
                <button
                  type="button"
                  disabled={idx === userOrder.length - 1 || launched}
                  onClick={() => moveTurbine(idx, 'right')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-teal-600 disabled:opacity-30 disabled:hover:bg-slate-800 text-white transition-all cursor-pointer"
                  title="Sağa Kaydır"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kontrol & İlerleme Butonları */}
      <div className="space-y-3">
        {!launched ? (
          <button
            type="button"
            onClick={handleLaunchRace}
            className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm shadow-lg shadow-teal-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Yarışı Başlat &amp; Doğrula</span>
          </button>
        ) : (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isSuccess ? 'bg-emerald-950/50 border-emerald-500 text-emerald-100' : 'bg-rose-950/50 border-rose-500 text-rose-100'
            }`}>
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1">
                <div className="font-bold">
                  {isSuccess ? 'Tebrikler! Kusursuz Hız Sıralaması (+35 XP)' : 'Hatalı Sıralama! Türbin devirlerini tekrar kontrol edin.'}
                </div>
                <p className="text-slate-300 leading-relaxed">{currentRace.explanation}</p>
              </div>
            </div>

            {isSuccess ? (
              <button
                type="button"
                onClick={handleNextRace}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <span>{raceIndex < TURBINE_RACES.length - 1 ? 'Sıradaki Yarışa Geç' : 'Sonuçları Gör'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLaunched(false)}
                className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tekrar Sırala</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
