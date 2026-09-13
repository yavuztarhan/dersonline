'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import { MathFraction } from '@/components/ui/math-fraction';
import { getStoredActiveBoardStudent, saveBoardParticipation } from '@/lib/board-participation-store';
import confetti from 'canvas-confetti';
import {
  Scale,
  Ruler,
  Thermometer,
  Wind,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Layers,
  ChevronRight,
  Zap,
  Info,
  Sliders,
  Award
} from 'lucide-react';

/* ========================================================================= */
/* MAT.7.1.2: RASYONEL SAYILARI KARŞILAŞTIRMA VE SIRALAMA ATÖLYESİ (LAB BENCH) */
/* ========================================================================= */

interface ScalePairPreset {
  id: string;
  name: string;
  leftNum: number;
  leftDen: number;
  rightNum: number;
  rightDen: number;
  strategy: string;
  explanation: string;
}

const PRESET_SCALE_PAIRS: ScalePairPreset[] = [
  {
    id: 'p1',
    name: 'Paylar Eşit Durumu',
    leftNum: 4,
    leftDen: 7,
    rightNum: 4,
    rightDen: 9,
    strategy: 'Payları Eşitleme (Birim Kesir Genişliği)',
    explanation: 'Paylar eşitken paydası küçük olan birimler daha geniştir. Bir bütün 7 eşit parçaya bölündüğünde her parça, 9 eşit parçaya bölünene göre daha büyüktür. Dolayısıyla 4/7 > 4/9!'
  },
  {
    id: 'p2',
    name: 'Paydalar Eşit Durumu',
    leftNum: 5,
    leftDen: 12,
    rightNum: 7,
    rightDen: 12,
    strategy: 'Paydaları Eşitleme (Dilim Sayısı)',
    explanation: 'Paydalar eşitken birim dilim büyüklükleri aynıdır (1/12). 7 adet dilim, 5 adet dilimden daha fazladır: 5/12 < 7/12!'
  },
  {
    id: 'p3',
    name: 'Yarıma (1/2) Yakınlık Referansı',
    leftNum: 13,
    leftDen: 28,
    rightNum: 17,
    rightDen: 32,
    strategy: 'Yarıma (1/2) Referans Alma',
    explanation: '28\'in yarısı 14 olduğundan 13/28 < 1/2. 32\'nin yarısı 16 olduğundan 17/32 > 1/2. Yarımdan büyük olan kesir, yarımdan küçük olandan daima büyüktür: 13/28 < 17/32!'
  },
  {
    id: 'p4',
    name: 'Bütüne (1) Yakınlık Referansı',
    leftNum: 9,
    leftDen: 10,
    rightNum: 7,
    rightDen: 8,
    strategy: 'Bütüne (1) Eksiklik Referansı',
    explanation: '1 - 9/10 = 1/10 ve 1 - 7/8 = 1/8. 1/10 < 1/8 olduğu için 9/10\'un bütüne eksiği daha küçüktür, yani bütüne daha yakındır (9/10 > 7/8)!'
  },
  {
    id: 'p5',
    name: 'Negatif Rasyonel Sayılar (Payda Eşit)',
    leftNum: -2,
    leftDen: 3,
    rightNum: -5,
    rightDen: 6,
    strategy: 'Negatif Sayılarda Sıfıra Yakınlık',
    explanation: '-2/3 kesri 2 ile genişletilirse -4/6 olur. Sayı doğrusunda -4 sayısı -5\'ten sıfıra daha yakın olduğu için -4/6 > -5/6 (yani -2/3 > -5/6)!'
  },
  {
    id: 'p6',
    name: 'Negatif Basit Kesirler',
    leftNum: -3,
    leftDen: 4,
    rightNum: -1,
    rightDen: 4,
    strategy: 'Negatif Payda Eşitliği & Mutlak Değer',
    explanation: 'Negatif sayılarda mutlak değeri küçük olan (sıfıra yakın olan) daha büyüktür. -1/4 sıfıra -3/4\'ten daha yakındır: -3/4 < -1/4!'
  }
];

export function RationalComparisonBench() {
  const { playSound, addPoints, unlockBadge, selectedOutcome } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [activeTab, setActiveTab] = useState<'scale' | 'benchmark' | 'multisort'>('scale');

  // =========================================================================
  // MODÜL 1: DİNAMİK TERAZİ & KIYASLAMA LABORATUVARI
  // =========================================================================
  const [leftNum, setLeftNum] = useState<number>(4);
  const [leftDen, setLeftDen] = useState<number>(7);
  const [rightNum, setRightNum] = useState<number>(4);
  const [rightDen, setRightDen] = useState<number>(9);
  const [scaleLocked, setScaleLocked] = useState<boolean>(false);
  const [userSignGuess, setUserSignGuess] = useState<'<' | '=' | '>' | null>(null);
  const [guessFeedback, setGuessFeedback] = useState<{ correct: boolean; msg: string } | null>(null);

  const leftVal = leftDen !== 0 ? leftNum / leftDen : 0;
  const rightVal = rightDen !== 0 ? rightNum / rightDen : 0;
  const realSign = leftVal > rightVal ? '>' : leftVal < rightVal ? '<' : '=';

  // Terazi Açısı (-10 ile +10 derece arası)
  const diffVal = leftVal - rightVal;
  const tiltDeg = Math.max(-12, Math.min(12, -diffVal * 30));

  const handleApplyPreset = (preset: ScalePairPreset) => {
    playSound('click');
    setLeftNum(preset.leftNum);
    setLeftDen(preset.leftDen);
    setRightNum(preset.rightNum);
    setRightDen(preset.rightDen);
    setUserSignGuess(null);
    setGuessFeedback(null);
    setScaleLocked(false);
  };

  const handleTestBalance = (sign: '<' | '=' | '>') => {
    playSound('click');
    setUserSignGuess(sign);
    setScaleLocked(true);

    const isCorrect = sign === realSign;
    if (isCorrect) {
      playSound('success');
      setGuessFeedback({
        correct: true,
        msg: `Harika! Terazi dengesi tahmininizi doğruladı: ${leftNum}/${leftDen} ${sign} ${rightNum}/${rightDen}.`
      });
      addPoints(15);
      unlockBadge('rational-scale-master');

      const activeStu = getStoredActiveBoardStudent();
      if (activeStu) {
        awardPointsToStudent(activeStu.id, 15);
        saveBoardParticipation({
          studentId: activeStu.id,
          studentName: activeStu.name,
          studentNumber: activeStu.studentNumber,
          classSection: activeStu.classSection,
          school: activeStu.school,
          teacherId: currentUser?.id,
          teacherName: currentUser?.name,
          activityType: 'game',
          activityTitle: 'Dinamik Terazi Deney Masası',
          outcomeCode: selectedOutcome?.code || 'MAT.7.1.2',
          subject: 'Matematik',
          score: 100,
          maxScore: 100,
          xpEarned: 15
        });
      }

      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      playSound('bell');
      setGuessFeedback({
        correct: false,
        msg: `Dikkat! Terazi kefelerine bakınız: Gerçekte ${leftNum}/${leftDen} ${realSign} ${rightNum}/${rightDen} olmalıdır.`
      });
    }
  };

  // Otomatik Strateji Açıklayıcı
  const detectedStrategy = (() => {
    if (leftNum > 0 && rightNum > 0) {
      if (leftNum === rightNum && leftDen !== rightDen) {
        return {
          title: 'Payları Eşit Kuralı',
          text: `Paylar eşit (${leftNum}). Paydası küçük olan (${Math.min(leftDen, rightDen)}) daha geniş dilimlere sahiptir ve daha büyüktür.`
        };
      }
      if (leftDen === rightDen && leftNum !== rightNum) {
        return {
          title: 'Paydaları Eşit Kuralı',
          text: `Paydalar eşit (${leftDen}). Payı büyük olan (${Math.max(leftNum, rightNum)}) daha fazla dilim barındırır ve daha büyüktür.`
        };
      }
      const leftHalf = leftDen / 2;
      const rightHalf = rightDen / 2;
      if ((leftNum < leftHalf && rightNum > rightHalf) || (leftNum > leftHalf && rightNum < rightHalf)) {
        return {
          title: 'Yarıma (1/2) Referans Kuralı',
          text: `Kesirlerden biri yarımdan küçük (${leftVal < 0.5 ? `${leftNum}/${leftDen}` : `${rightNum}/${rightDen}`}), diğeri yarımdan büyüktür. Yarımdan büyük olan her zaman daha büyüktür.`
        };
      }
      if (leftNum === leftDen - 1 && rightNum === rightDen - 1) {
        return {
          title: 'Bütüne (1) Yakınlık Kuralı',
          text: `İki kesrin de bütüne 1 birim kesir eksiği vardır. 1/${leftDen} ile 1/${rightDen} kıyaslandığında eksiği küçük olan bütüne daha yakındır ve büyüktür.`
        };
      }
    }
    if (leftNum < 0 || rightNum < 0) {
      if (leftNum < 0 && rightNum > 0) return { title: 'İşaret Kuralı', text: 'Negatif sayılar daima pozitif sayılardan küçüktür.' };
      if (leftNum > 0 && rightNum < 0) return { title: 'İşaret Kuralı', text: 'Pozitif sayılar daima negatif sayılardan büyüktür.' };
      return {
        title: 'Negatif Sayılarda Sıralama Kuralı',
        text: 'Negatif rasyonel sayılarda sayı doğrusunda 0\'a daha yakın olan (mutlak değeri daha küçük olan) sayı daha büyüktür.'
      };
    }
    return {
      title: 'Payda Eşitleme Kuralı',
      text: `Farklı paydalı kesirleri kıyaslamak için en genel strateji paydalarını ortak bir katta eşitlemektir (Ortak Kat: ${leftDen * rightDen}).`
    };
  })();

  // =========================================================================
  // MODÜL 2: 0, 1/2, 1 REFERANS LAZERİ VE MESAFELER CETVELİ
  // =========================================================================
  const [benchFracA, setBenchFracA] = useState<{ num: number; den: number }>({ num: 13, den: 28 });
  const [benchFracB, setBenchFracB] = useState<{ num: number; den: number }>({ num: 17, den: 32 });

  const valA = benchFracA.den > 0 ? benchFracA.num / benchFracA.den : 0;
  const valB = benchFracB.den > 0 ? benchFracB.num / benchFracB.den : 0;

  const distHalfA = Math.abs(valA - 0.5);
  const distHalfB = Math.abs(valB - 0.5);
  const distOneA = Math.abs(1 - valA);
  const distOneB = Math.abs(1 - valB);

  // =========================================================================
  // MODÜL 3: PALANDÖKEN SICAKLIKLARI & ÇOKLU SIRALAMA MASASI
  // =========================================================================
  interface StationTemp {
    id: string;
    station: string;
    tempFrac: string;
    val: number;
    altitude: string;
  }

  const STATIONS_LEVEL: StationTemp[] = [
    { id: 's1', station: 'Kuzey Çanağı', tempFrac: '-7/8', val: -7 / 8, altitude: '2800 m' },
    { id: 's2', station: 'Ejder Zirvesi', tempFrac: '-5/6', val: -5 / 6, altitude: '3176 m' },
    { id: 's3', station: 'Güney Yamacı', tempFrac: '-2/3', val: -2 / 3, altitude: '2400 m' },
    { id: 's4', station: 'Olimpiyat Oteli', tempFrac: '+1/4', val: 1 / 4, altitude: '1900 m' }
  ];

  const [sortItems, setSortItems] = useState<StationTemp[]>(() => {
    return [...STATIONS_LEVEL].sort(() => Math.random() - 0.5);
  });
  const [sortChecked, setSortChecked] = useState<boolean>(false);
  const [sortSuccess, setSortSuccess] = useState<boolean>(false);

  const moveSortItem = (index: number, dir: 'left' | 'right') => {
    playSound('click');
    const newItems = [...sortItems];
    const targetIdx = dir === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setSortItems(newItems);
    setSortChecked(false);
  };

  const handleVerifySort = () => {
    let ok = true;
    for (let i = 0; i < sortItems.length - 1; i++) {
      if (sortItems[i].val > sortItems[i + 1].val) {
        ok = false;
        break;
      }
    }
    setSortChecked(true);
    setSortSuccess(ok);

    if (ok) {
      playSound('success');
      addPoints(25);
      unlockBadge('freezer-sort-master');

      const activeStu = getStoredActiveBoardStudent();
      if (activeStu) {
        awardPointsToStudent(activeStu.id, 25);
        saveBoardParticipation({
          studentId: activeStu.id,
          studentName: activeStu.name,
          studentNumber: activeStu.studentNumber,
          classSection: activeStu.classSection,
          school: activeStu.school,
          teacherId: currentUser?.id,
          teacherName: currentUser?.name,
          activityType: 'game',
          activityTitle: 'Palandöken Sıcaklık Sıralama Masası',
          outcomeCode: selectedOutcome?.code || 'MAT.7.1.2',
          subject: 'Matematik',
          score: 100,
          maxScore: 100,
          xpEarned: 25
        });
      }

      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      playSound('bell');
    }
  };

  return (
    <div className="space-y-6">

      {/* Üst Sekmeler / Laboratuvar Modülleri */}
      <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-wrap sm:flex-nowrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            playSound('click');
            setActiveTab('scale');
          }}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'scale'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>1. Dinamik Terazi &amp; Kıyaslama Laboratuvarı</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            setActiveTab('benchmark');
          }}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'benchmark'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>2. 0, 1/2, 1 Referans Lazeri &amp; Mesafeler</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            setActiveTab('multisort');
          }}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'multisort'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          <span>3. Palandöken Sıcaklık &amp; Sıralama Masası</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. SEKME: DİNAMİK TERAZİ VE KIYASLAMA LABORATUVARI                        */}
      {/* ========================================================================= */}
      {activeTab === 'scale' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Hazır Kıyaslama İstasyonları (Presets) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Hazır Karşılaştırma Deney İstasyonları</span>
              </span>
              <span className="text-[11px] text-slate-500">Tek tıkla laboratuvar kefelerine yükleyiniz</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {PRESET_SCALE_PAIRS.map((p) => {
                const isSelected =
                  leftNum === p.leftNum &&
                  leftDen === p.leftDen &&
                  rightNum === p.rightNum &&
                  rightDen === p.rightDen;

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className={`p-2.5 rounded-2xl text-xs text-left transition-all border cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 text-sky-900 dark:text-sky-200 shadow-sm ring-2 ring-sky-200 dark:ring-sky-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-[11px] block truncate">{p.name}</span>
                    <div className="flex items-center gap-1.5 mt-1 font-mono font-black text-xs text-sky-700 dark:text-sky-400">
                      <MathFraction value={`${p.leftNum}/${p.leftDen}`} />
                      <span className="text-slate-400">vs</span>
                      <MathFraction value={`${p.rightNum}/${p.rightDen}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Denge Terazisi & Kefe Kontrolleri */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 rounded-3xl p-6 border border-slate-800 text-white space-y-6 shadow-xl">
            
            {/* Terazi Üst Bilgi Barı */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
                  <Scale className="w-3.5 h-3.5" />
                  <span>Dinamik Eğimli Denge Terazisi</span>
                </div>
                <h3 className="text-lg font-black text-white mt-1">
                  Kefeler Arası Ağırlık ve Değer Mukayesesi
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playSound('select');
                    setLeftNum(4);
                    setLeftDen(7);
                    setRightNum(4);
                    setRightDen(9);
                    setUserSignGuess(null);
                    setGuessFeedback(null);
                    setScaleLocked(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sıfırla</span>
                </button>
              </div>
            </div>

            {/* Kefe Kontrol Masası (Sol Kefe & Sağ Kefe Ayar Butonları) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Sol Kefe Kontrolü */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-sky-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-sky-300 uppercase tracking-wider">Sol Kefe Değeri</span>
                  <span className="text-xs font-mono font-bold text-slate-400">Ondalık: {leftVal.toFixed(3)}</span>
                </div>

                <div className="flex items-center justify-around gap-3 pt-1">
                  {/* Pay Ayarı */}
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Pay</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click');
                          setLeftNum((v) => v - 1);
                          setScaleLocked(false);
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-xs"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-mono font-black text-base text-white">{leftNum}</span>
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click');
                          setLeftNum((v) => v + 1);
                          setScaleLocked(false);
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-2xl text-slate-600 font-bold">/</div>

                  {/* Payda Ayarı */}
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Payda</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (leftDen > 1) {
                            playSound('click');
                            setLeftDen((v) => v - 1);
                            setScaleLocked(false);
                          }
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-xs"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-mono font-black text-base text-white">{leftDen}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (leftDen < 36) {
                            playSound('click');
                            setLeftDen((v) => v + 1);
                            setScaleLocked(false);
                          }
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sağ Kefe Kontrolü */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-300 uppercase tracking-wider">Sağ Kefe Değeri</span>
                  <span className="text-xs font-mono font-bold text-slate-400">Ondalık: {rightVal.toFixed(3)}</span>
                </div>

                <div className="flex items-center justify-around gap-3 pt-1">
                  {/* Pay Ayarı */}
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Pay</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click');
                          setRightNum((v) => v - 1);
                          setScaleLocked(false);
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-xs"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-mono font-black text-base text-white">{rightNum}</span>
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click');
                          setRightNum((v) => v + 1);
                          setScaleLocked(false);
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-2xl text-slate-600 font-bold">/</div>

                  {/* Payda Ayarı */}
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Payda</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (rightDen > 1) {
                            playSound('click');
                            setRightDen((v) => v - 1);
                            setScaleLocked(false);
                          }
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-xs"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-mono font-black text-base text-white">{rightDen}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (rightDen < 36) {
                            playSound('click');
                            setRightDen((v) => v + 1);
                            setScaleLocked(false);
                          }
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Dinamik Görsel Terazi Sahnesi */}
            <div className="relative py-12 px-4 bg-slate-950/90 rounded-3xl border border-slate-800 flex flex-col items-center justify-center min-h-[260px] overflow-hidden">
              
              {/* Terazi Kolu & Kefeleri (Dinamik Eğimli) */}
              <div
                className="w-full max-w-md transition-transform duration-700 ease-out flex items-center justify-between relative"
                style={{ transform: `rotate(${tiltDeg}deg)` }}
              >
                {/* Sol Kefe */}
                <div
                  className="flex flex-col items-center transition-transform duration-700"
                  style={{ transform: `rotate(${-tiltDeg}deg)` }}
                >
                  <div className="w-24 h-20 rounded-2xl bg-sky-950/90 border-2 border-sky-400 shadow-lg shadow-sky-500/25 flex flex-col items-center justify-center p-2">
                    <span className="text-[10px] text-sky-300 font-black uppercase">Sol Kefe</span>
                    <span className="text-xl font-black text-white font-mono mt-0.5">
                      <MathFraction value={`${leftNum}/${leftDen}`} />
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                      &asymp; {leftVal.toFixed(3)}
                    </span>
                  </div>
                  <div className="w-0.5 h-8 bg-slate-600" />
                </div>

                {/* Terazi Ana Kolu */}
                <div className="flex-1 h-3 bg-gradient-to-r from-sky-400 via-amber-400 to-indigo-400 rounded-full mx-2 shadow-md relative">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-400" />
                </div>

                {/* Sağ Kefe */}
                <div
                  className="flex flex-col items-center transition-transform duration-700"
                  style={{ transform: `rotate(${-tiltDeg}deg)` }}
                >
                  <div className="w-24 h-20 rounded-2xl bg-indigo-950/90 border-2 border-indigo-400 shadow-lg shadow-indigo-500/25 flex flex-col items-center justify-center p-2">
                    <span className="text-[10px] text-indigo-300 font-black uppercase">Sağ Kefe</span>
                    <span className="text-xl font-black text-white font-mono mt-0.5">
                      <MathFraction value={`${rightNum}/${rightDen}`} />
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                      &asymp; {rightVal.toFixed(3)}
                    </span>
                  </div>
                  <div className="w-0.5 h-8 bg-slate-600" />
                </div>
              </div>

              {/* Terazi Ayak Dayanağı (Piramit) */}
              <div className="w-0 h-0 border-l-[22px] border-l-transparent border-r-[22px] border-r-transparent border-b-[40px] border-b-amber-500 -mt-2" />
              <div className="w-32 h-3.5 bg-slate-700 rounded-full mt-1" />

              {/* Tahmin / Test Butonları */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <span className="text-xs text-slate-400 font-bold">
                  Tahmininizi seçip terazinin dengesini kontrol ediniz:
                </span>

                <div className="flex items-center gap-2">
                  {(['<', '=', '>'] as const).map((sign) => (
                    <button
                      key={sign}
                      type="button"
                      onClick={() => handleTestBalance(sign)}
                      className={`px-5 py-2.5 rounded-2xl font-black font-mono text-base transition-all cursor-pointer ${
                        userSignGuess === sign
                          ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/40 ring-2 ring-sky-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {sign}
                    </button>
                  ))}
                </div>

                {guessFeedback && (
                  <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 max-w-lg text-center ${
                    guessFeedback.correct
                      ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border border-rose-500 text-rose-200'
                  }`}>
                    {guessFeedback.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    <span>{guessFeedback.msg}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Otomatik Strateji Dedektörü Kartı */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-amber-500/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                  Otomatik Strateji Analizi: {detectedStrategy.title}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {detectedStrategy.text}
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SEKME: 0, 1/2, 1 REFERANS LAZERİ & MESAFELER CETVELİ                  */}
      {/* ========================================================================= */}
      {activeTab === 'benchmark' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Ruler className="w-3.5 h-3.5" />
                <span>0, 1/2 ve 1 Referans Lazer Metresi</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                Payda Eşitlemeden Zihinsel Karşılaştırma Modeli
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kesirlerin 1/2 (yarım) ve 1 (bütün) referans noktalarına olan uzaklıklarını ölçerek iki kesri işlem yapmadan sıralayınız.
              </p>
            </div>

            {/* Kesir Seçim Ön Ayarları */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: '13/28 vs 17/32 (Yarıma Yakınlık)', a: { num: 13, den: 28 }, b: { num: 17, den: 32 } },
                { label: '9/10 vs 7/8 (Bütüne Yakınlık)', a: { num: 9, den: 10 }, b: { num: 7, den: 8 } },
                { label: '5/11 vs 6/11 (Paydalar Eşit)', a: { num: 5, den: 11 }, b: { num: 6, den: 11 } },
                { label: '11/12 vs 19/20 (Çok Yakın Bütünler)', a: { num: 11, den: 12 }, b: { num: 19, den: 20 } }
              ].map((bPreset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    playSound('select');
                    setBenchFracA(bPreset.a);
                    setBenchFracB(bPreset.b);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                >
                  {bPreset.label}
                </button>
              ))}
            </div>

            {/* Görsel Lazer Çizgisi [0 ile 1 arası] */}
            <div className="bg-slate-950 p-6 rounded-3xl text-white space-y-8">
              
              {/* 1. Kesir A Lazer Hattı */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sky-400 font-mono flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    Kesir A: <MathFraction value={`${benchFracA.num}/${benchFracA.den}`} /> (&asymp; {valA.toFixed(3)})
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Yarıma Uzaklık: |{valA.toFixed(2)} - 0.50| = <strong className="text-amber-300 font-mono">{distHalfA.toFixed(3)}</strong>
                  </span>
                </div>

                <div className="relative py-4">
                  {/* Cetvel Çizgisi */}
                  <div className="h-2 bg-slate-800 rounded-full w-full relative">
                    {/* 0 Noktası */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-slate-400" />
                      <span className="text-[10px] font-mono text-slate-400 font-bold mt-1">0</span>
                    </div>
                    {/* 1/2 Noktası */}
                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-amber-500/40" />
                      <span className="text-[10px] font-mono text-amber-300 font-black mt-1">1/2 (Yarım)</span>
                    </div>
                    {/* 1 Noktası */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-slate-400" />
                      <span className="text-[10px] font-mono text-slate-400 font-bold mt-1">1 (Bütün)</span>
                    </div>

                    {/* A Noktası Pin & Lazer */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex flex-col items-center transition-all duration-500"
                      style={{ left: `${Math.max(0, Math.min(100, valA * 100))}%` }}
                    >
                      <div className="w-4 h-4 rounded-full bg-sky-400 ring-4 ring-sky-500/50 shadow-lg animate-pulse" />
                      <span className="text-[11px] font-mono text-sky-300 font-black mt-1">
                        <MathFraction value={`${benchFracA.num}/${benchFracA.den}`} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Kesir B Lazer Hattı */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-400 font-mono flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    Kesir B: <MathFraction value={`${benchFracB.num}/${benchFracB.den}`} /> (&asymp; {valB.toFixed(3)})
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Yarıma Uzaklık: |{valB.toFixed(2)} - 0.50| = <strong className="text-amber-300 font-mono">{distHalfB.toFixed(3)}</strong>
                  </span>
                </div>

                <div className="relative py-4">
                  {/* Cetvel Çizgisi */}
                  <div className="h-2 bg-slate-800 rounded-full w-full relative">
                    {/* 0 Noktası */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-slate-400" />
                      <span className="text-[10px] font-mono text-slate-400 font-bold mt-1">0</span>
                    </div>
                    {/* 1/2 Noktası */}
                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-amber-500/40" />
                      <span className="text-[10px] font-mono text-amber-300 font-black mt-1">1/2 (Yarım)</span>
                    </div>
                    {/* 1 Noktası */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-slate-400" />
                      <span className="text-[10px] font-mono text-slate-400 font-bold mt-1">1 (Bütün)</span>
                    </div>

                    {/* B Noktası Pin & Lazer */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex flex-col items-center transition-all duration-500"
                      style={{ left: `${Math.max(0, Math.min(100, valB * 100))}%` }}
                    >
                      <div className="w-4 h-4 rounded-full bg-indigo-400 ring-4 ring-indigo-500/50 shadow-lg animate-pulse" />
                      <span className="text-[11px] font-mono text-indigo-300 font-black mt-1">
                        <MathFraction value={`${benchFracB.num}/${benchFracB.den}`} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lazer Mukayese Yorumu */}
              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-slate-400">Sonuç: </span>
                  <strong className="text-amber-300">
                    <MathFraction value={`${benchFracA.num}/${benchFracA.den}`} /> {valA > valB ? '>' : valA < valB ? '<' : '='} <MathFraction value={`${benchFracB.num}/${benchFracB.den}`} />
                  </strong>
                </div>
                <div className="text-[11px] text-slate-400">
                  {valA < 0.5 && valB > 0.5
                    ? 'A yarımdan küçük (< 1/2), B yarımdan büyüktür (> 1/2).'
                    : valA > 0.5 && valB < 0.5
                    ? 'A yarımdan büyük (> 1/2), B yarımdan küçüktür (< 1/2).'
                    : 'İki kesir de yarıma aynı yönde yakın; mesafeleri inceleyiniz.'}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SEKME: PALANDÖKEN SICAKLIKLARI & ÇOKLU SIRALAMA MASASI                 */}
      {/* ========================================================================= */}
      {activeTab === 'multisort' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Thermometer className="w-3.5 h-3.5" />
                <span>Palandöken İklim Masası: Negatif Sayılarda Sıralama</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                En Soğuktan En Ilık Olana Doğru Sıralayınız
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kural: Negatif rasyonel sayılarda sıfıra daha yakın olan (mutlak değeri küçük olan) daha büyüktür / ılıktır.
              </p>
            </div>

            {/* Sıralama Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {sortItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    sortChecked
                      ? sortSuccess
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-400'
                        : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-400'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase">
                      {idx + 1}. Sıra
                    </span>
                    <span className="text-[10px] text-slate-400">{item.altitude}</span>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.station}</div>
                    <div className="text-2xl font-black font-mono text-sky-600 dark:text-sky-400">
                      <MathFraction value={item.tempFrac} /> &deg;C
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">&asymp; {item.val.toFixed(3)} &deg;C</div>
                  </div>

                  {/* Ok Butonları */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSortItem(idx, 'left')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        idx === 0
                          ? 'opacity-30 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
                          : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 cursor-pointer'
                      }`}
                    >
                      &larr; Sola
                    </button>

                    <button
                      type="button"
                      disabled={idx === sortItems.length - 1}
                      onClick={() => moveSortItem(idx, 'right')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        idx === sortItems.length - 1
                          ? 'opacity-30 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
                          : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 cursor-pointer'
                      }`}
                    >
                      Sağa &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Doğrulama Butonu */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500">
                {sortChecked ? (
                  sortSuccess ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Sıralama kusursuz! -7/8 &lt; -5/6 &lt; -2/3 &lt; +1/4 (+25 XP)
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Sıralama hatalı. Sayı doğrusunda sola gittikçe sayılar küçülür!
                    </span>
                  )
                ) : (
                  <span>Kartları oklarla kaydırarak en soğuktan en ılık olana doğru sıralayınız.</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerifySort}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sıralamayı Doğrula</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
