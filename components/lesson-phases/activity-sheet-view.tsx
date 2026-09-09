'use client';

import React, { useState, useEffect } from 'react';
import {
  ClassroomFileRecord,
  getActivitySheetForOutcome,
  getActivitySheetsForOutcome,
  exportClassroomFileToPdf
} from '@/lib/class-files-store';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import { WhiteboardViewerModal } from '@/components/whiteboard/whiteboard-viewer-modal';
import { WhiteboardModal } from '@/components/whiteboard/whiteboard-modal';
import confetti from 'canvas-confetti';
import {
  FileText,
  Eye,
  MonitorPlay,
  Download,
  CheckCircle2,
  XCircle,
  Sparkles,
  Award,
  ChevronRight,
  Compass,
  CircleDot,
  PenTool,
  Ruler,
  Layers,
  ArrowRight,
  Loader2,
  Landmark,
  Hammer,
  Search,
  Check,
  HelpCircle,
  Lightbulb,
  BookOpen
} from 'lucide-react';

interface ActivitySheetViewProps {
  outcomeCode?: string;
  outcomeTitle?: string;
  onGoToRubric?: () => void;
}

export function ActivitySheetView({
  outcomeCode = 'MAT.5.3.1',
  outcomeTitle = 'Temel Geometrik Çizimler ve Geometrik Araçların Kullanımı',
  onGoToRubric
}: ActivitySheetViewProps) {
  const { currentUser } = useAuth();
  const { playSound, addPoints, unlockBadge } = useApp();

  // Retrieve all activity sheets for this outcome
  const availableSheets = getActivitySheetsForOutcome(outcomeCode);
  const [selectedSheetId, setSelectedSheetId] = useState<string>(
    availableSheets.length > 0 ? availableSheets[0].id : 'file-activity-mat-5-3-1'
  );

  // Sync selectedSheetId when outcome changes
  useEffect(() => {
    const sheets = getActivitySheetsForOutcome(outcomeCode);
    if (sheets.length > 0) {
      setSelectedSheetId(sheets[0].id);
    }
  }, [outcomeCode]);

  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [whiteboardModalOpen, setWhiteboardModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Active activity sheet file record
  const fileRecord = getActivitySheetForOutcome(outcomeCode, selectedSheetId);
  const isRailwayActivity =
    selectedSheetId.includes('railway') ||
    fileRecord?.id?.includes('railway') ||
    fileRecord?.title?.includes('Tren Rayı');
  const isBridgeActivity =
    !isRailwayActivity && (fileRecord?.id?.includes('bridge') || fileRecord?.title?.includes('Köprü'));
  const isSteppingWorkshop =
    !isRailwayActivity &&
    (selectedSheetId.includes('stepping') ||
      fileRecord?.id?.includes('stepping') ||
      fileRecord?.title?.includes('Adımlama'));
  const isDeductionDetective =
    !isRailwayActivity &&
    !isSteppingWorkshop &&
    (outcomeCode === 'MAT.5.3.2' ||
      fileRecord?.id?.includes('5-3-2') ||
      fileRecord?.title?.includes('Çıkarım'));

  // Interactive deduction state for MAT.5.3.2 Çıkarım Dedektifi
  const [deductionAnswers, setDeductionAnswers] = useState({
    exp1: '',
    exp2: '',
    exp3: ''
  });
  const [deductionStatus, setDeductionStatus] = useState<{
    exp1?: boolean;
    exp2?: boolean;
    exp3?: boolean;
  }>({});
  const [revealedSolutions, setRevealedSolutions] = useState<{
    exp1?: boolean;
    exp2?: boolean;
    exp3?: boolean;
  }>({});

  // Interactive stepping workshop state for MAT.5.3.2 Pergel ile Adımlama Atölyesi
  const [rayStep, setRayStep] = useState<number>(0); // 0 = initial, 1 = A, 2 = B, 3 = C (complete)
  const [angleStep, setAngleStep] = useState<number>(0); // 0 = initial, 1 = arc & P1, P2
  const [steppingCompleted, setSteppingCompleted] = useState<{ ray?: boolean; angle?: boolean }>({});

  // Interactive railway state for MAT.5.3.2 Tren Rayı Mühendisliği
  const [railStep, setRailStep] = useState<number>(0); // 0: base d line, 1: points A,B,C, 2: 3 perpendiculars [AA', BB', CC'], 3: parallel line k & sleepers
  const [railQuestionAnswer, setRailQuestionAnswer] = useState<string | null>(null);
  const [railQuestionSubmitted, setRailQuestionSubmitted] = useState<boolean>(false);
  const [railwayCompleted, setRailwayCompleted] = useState<boolean>(false);

  const handleAdvanceRailStep = () => {
    playSound('click');
    setRailStep((prev) => {
      const next = prev < 3 ? prev + 1 : 3;
      if (next === 3 && !railwayCompleted) {
        playSound('success');
        addPoints(50);
        if (railQuestionSubmitted && railQuestionAnswer === 'parallel') {
          unlockBadge('maarif-genius');
          try {
            confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
          } catch (e) {}
        }
      }
      return next;
    });
  };

  const handleSelectRailAnswer = (choice: string) => {
    if (railQuestionSubmitted) return;
    playSound('select');
    setRailQuestionAnswer(choice);
  };

  const handleSubmitRailAnswer = () => {
    if (!railQuestionAnswer) return;
    setRailQuestionSubmitted(true);
    if (railQuestionAnswer === 'parallel') {
      playSound('success');
      addPoints(50);
      setRailwayCompleted(true);
      unlockBadge('maarif-genius');
      try {
        confetti({ particleCount: 100, spread: 85, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      playSound('click');
    }
  };

  const handleAdvanceRayStep = () => {
    playSound('click');
    setRayStep((prev) => {
      const next = prev < 3 ? prev + 1 : 3;
      if (next === 3 && !steppingCompleted.ray) {
        playSound('success');
        addPoints(50);
        setSteppingCompleted((p) => ({ ...p, ray: true }));
        if (steppingCompleted.angle) {
          unlockBadge('maarif-genius');
          try {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          } catch (e) {}
        }
      }
      return next;
    });
  };

  const handleAdvanceAngleStep = () => {
    playSound('click');
    setAngleStep(1);
    if (!steppingCompleted.angle) {
      playSound('success');
      addPoints(50);
      setSteppingCompleted((p) => ({ ...p, angle: true }));
      if (steppingCompleted.ray || rayStep === 3) {
        unlockBadge('maarif-genius');
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      }
    }
  };

  const handleCheckDeduction = (expKey: 'exp1' | 'exp2' | 'exp3') => {
    const rawVal = deductionAnswers[expKey].trim().toLowerCase();
    let isCorrect = false;

    if (expKey === 'exp1') {
      isCorrect = ['1', 'bir', 'tek bir', 'tek 1', 'yalnız 1', 'yalnız bir', 'sadece bir'].includes(rawVal);
    } else if (expKey === 'exp2') {
      isCorrect = ['eşit', 'aynı', 'eş', 'esit', 'ayni', 'eşittir', 'esittir'].includes(rawVal);
    } else if (expKey === 'exp3') {
      isCorrect = ['1', 'bir', 'tek bir', 'tek 1', 'yalnız 1', 'yalnız bir', 'sadece bir'].includes(rawVal);
    }

    const nextStatus = { ...deductionStatus, [expKey]: isCorrect };
    setDeductionStatus(nextStatus);

    if (isCorrect) {
      playSound('success');
      addPoints(33);

      const allCorrect =
        (expKey === 'exp1' ? true : nextStatus.exp1) &&
        (expKey === 'exp2' ? true : nextStatus.exp2) &&
        (expKey === 'exp3' ? true : nextStatus.exp3);

      if (allCorrect) {
        unlockBadge('maarif-genius');
        try {
          confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      playSound('click');
    }
  };

  const handleDownloadPDF = async () => {
    if (!fileRecord) return;
    try {
      setIsDownloadingPdf(true);
      playSound('select');
      await exportClassroomFileToPdf(fileRecord, currentUser?.school);
      playSound('success');
    } catch (err) {
      console.error('Etkinlik PDF indirme hatası:', err);
      alert('Etkinlik kağıdı PDF oluşturulurken bir hata meydana geldi.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 0. Multi-Activity Tab Switcher (Responsive Grid without horizontal scroll) */}
      {availableSheets.length > 1 && (
        <div className="bg-slate-100/90 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div
            className={`grid gap-2 ${
              availableSheets.length === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {availableSheets.map((sheet, index) => {
              const isRailway = sheet.id.includes('railway') || sheet.title.includes('Tren Rayı');
              const isBridge = sheet.id.includes('bridge') || sheet.title.includes('Köprü');
              const isStepping = sheet.id.includes('stepping') || sheet.title.includes('Adımlama');
              const isDetective =
                (sheet.id.includes('5-3-2') || sheet.title.includes('Çıkarım')) && !isStepping && !isRailway;
              const isActive = sheet.id === (fileRecord?.id || selectedSheetId);

              const icon = isRailway ? '🚆' : isBridge ? '🏛️' : isStepping ? '⭕' : isDetective ? '🔍' : '📐';
              const title = isRailway
                ? 'Tren Rayı Mühendisliği'
                : isBridge
                ? 'Tarihi Köprü Restorasyonu'
                : isStepping
                ? 'Pergel ile Adımlama'
                : isDetective
                ? 'Çıkarım Dedektifi'
                : 'Aşamalı İnşa İstasyonları';

              const badge = isRailway
                ? 'Büyük Görev'
                : isBridge
                ? 'Büyük Görev'
                : isStepping
                ? 'Atölye 2'
                : isDetective
                ? 'Etkinlik 1'
                : `Etkinlik ${index + 1}`;

              const tag = isRailway
                ? 'Gönye ile Paralel Doğru'
                : isBridge
                ? '4 Restorasyon Adımı'
                : isStepping
                ? 'Eşit Parçalar Kesme'
                : isDetective
                ? '3 Deney Kutusu'
                : '4 Mini İstasyon';

              return (
                <button
                  key={sheet.id}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setSelectedSheetId(sheet.id);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left border ${
                    isActive
                      ? isRailway
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md scale-[1.01]'
                        : isBridge
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-[1.01]'
                        : isStepping
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md scale-[1.01]'
                        : isDetective
                        ? 'bg-sky-600 text-white border-sky-500 shadow-md scale-[1.01]'
                        : 'bg-teal-600 text-white border-teal-500 shadow-md scale-[1.01]'
                      : 'bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base sm:text-lg shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <div className="font-black text-xs truncate">{title}</div>
                      <div
                        className={`text-[10px] font-medium truncate ${
                          isActive
                            ? isBridge
                              ? 'text-amber-950/80'
                              : 'text-white/80'
                            : 'text-slate-400 dark:text-slate-400'
                        }`}
                      >
                        {tag}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shrink-0 ml-2 ${
                      isActive
                        ? isBridge
                          ? 'bg-amber-950/20 text-slate-950'
                          : 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. Header Banner & Quick Action Buttons */}
      <div
        className={`text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-colors duration-300 ${
          isRailwayActivity
            ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950'
            : isBridgeActivity
            ? 'bg-gradient-to-br from-amber-950 via-amber-900 to-slate-950'
            : isSteppingWorkshop
            ? 'bg-gradient-to-br from-purple-950 via-purple-900 to-slate-950'
            : isDeductionDetective
            ? 'bg-gradient-to-br from-sky-950 via-sky-900 to-slate-950'
            : 'bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900'
        }`}
      >
        {/* Background Decorative Patterns */}
        <div
          className={`absolute right-0 top-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
            isRailwayActivity
              ? 'bg-indigo-500/20'
              : isBridgeActivity
              ? 'bg-amber-500/10'
              : isSteppingWorkshop
              ? 'bg-purple-500/15'
              : isDeductionDetective
              ? 'bg-sky-500/15'
              : 'bg-teal-500/10'
          }`}
        />
        <div
          className={`absolute left-1/3 bottom-0 w-64 h-64 rounded-full blur-2xl pointer-events-none ${
            isRailwayActivity
              ? 'bg-amber-500/15'
              : isBridgeActivity
              ? 'bg-orange-500/10'
              : isSteppingWorkshop
              ? 'bg-indigo-500/20'
              : isDeductionDetective
              ? 'bg-indigo-500/15'
              : 'bg-indigo-500/10'
          }`}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                isRailwayActivity
                  ? 'bg-indigo-400/20 border-indigo-300/30 text-indigo-200'
                  : isBridgeActivity
                  ? 'bg-amber-400/20 border-amber-300/30 text-amber-200'
                  : isSteppingWorkshop
                  ? 'bg-purple-400/20 border-purple-300/30 text-purple-200'
                  : isDeductionDetective
                  ? 'bg-sky-400/20 border-sky-300/30 text-sky-200'
                  : 'bg-teal-400/20 border-teal-300/30 text-teal-200'
              }`}
            >
              {isRailwayActivity ? (
                <>
                  <Layers className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Büyük Görev • Gönye ile Paralel Doğru İnşası (SDB2.2 / E3.7)</span>
                </>
              ) : isBridgeActivity ? (
                <>
                  <Landmark className="w-3.5 h-3.5 text-amber-300" />
                  <span>Büyük Görev • Mimari Restorasyon & Geometrik İnşa</span>
                </>
              ) : isSteppingWorkshop ? (
                <>
                  <CircleDot className="w-3.5 h-3.5 text-purple-300" />
                  <span>Pergel İnşası & Eşit Mesafe Aktarımı (SDB1.2 / OB2)</span>
                </>
              ) : isDeductionDetective ? (
                <>
                  <Search className="w-3.5 h-3.5 text-sky-300" />
                  <span>Gözlem & Mantıksal Çıkarım (SDB3.3 / E3.7)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Süreç Değerlendirme & Geometrik İnşa İstasyonları</span>
                </>
              )}
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {isRailwayActivity
                ? 'Büyük Görev: "TREN RAYI MÜHENDİSLİĞİ" (Gönye ile Paralel Doğru İnşası)'
                : isBridgeActivity
                ? 'Büyük Görev: Tarihi Köprü Restorasyonu'
                : isSteppingWorkshop
                ? 'Atölye: "PERGEL İLE ADIMLAMA" (Eşit Parçalar Kesme)'
                : isDeductionDetective
                ? 'Etkinlik: "ÇIKARIM DEDEKTİFİ" (Gözlem ve Temel Kurallar)'
                : 'Etkinlik 1: Aşamalı İnşa İstasyonları'}
            </h2>
            
            {/* Kurgu Paneli / Açıklama */}
            {isRailwayActivity ? (
              <div className="p-3 bg-indigo-950/60 border border-indigo-500/40 rounded-2xl backdrop-blur-sm">
                <p className="text-xs sm:text-sm text-indigo-100 font-medium italic leading-relaxed">
                  🚂 <strong>Kurgu Paneli:</strong> &ldquo;Tren raylarının birbirine çarpmaması ve trenin raydan çıkmaması için rayların aralarındaki dik mesafenin her noktada aynı olması gerekir. Kendi tren rayını gönye ve cetvelle inşa et!&rdquo;
                </p>
              </div>
            ) : isBridgeActivity ? (
              <div className="p-3 bg-amber-950/60 border border-amber-500/40 rounded-2xl backdrop-blur-sm">
                <p className="text-xs sm:text-sm text-amber-100 font-medium italic leading-relaxed">
                  📜 <strong>Kurgu Paneli:</strong> &ldquo;Mimar Sinan'ın Kanuni Köprüsü'nün çizimi hasar gördü! Kemerleri ve ayakları aletlerinle tamamla.&rdquo;
                </p>
              </div>
            ) : isSteppingWorkshop ? (
              <div className="p-3 bg-purple-950/60 border border-purple-500/40 rounded-2xl backdrop-blur-sm">
                <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
                  ⭕ <strong>Atölye Görevi:</strong> Ölçülü cetvel (santimetre) kullanmadan, sadece pergel açıklığı ile mesafeyi sabit tutarak ışın ve açı kollarından eşit uzunlukta parçalar inşa et!
                </p>
              </div>
            ) : isDeductionDetective ? (
              <div className="p-3 bg-sky-950/60 border border-sky-500/40 rounded-2xl backdrop-blur-sm">
                <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
                  🕵️‍♂️ <strong>Dedektif Görevi:</strong> Verilen 3 geometrik durumu incele, cetvel, pergel ve gönye ile deneylerini gerçekleştir ve temel aksiyom çıkarımlarını tamamla!
                </p>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed">
                Öğrencilerin cetvel, iletki, pergel ve gönye araçlarını kullanarak temel geometrik yapıları inşa etme ve çıkarım yapma becerilerini pekiştiren 4 mini istasyon çalışmasıdır.
              </p>
            )}

            <div
              className={`flex items-center gap-3 pt-2 text-[11px] font-mono ${
                isRailwayActivity
                  ? 'text-indigo-200/70'
                  : isBridgeActivity
                  ? 'text-amber-200/70'
                  : isSteppingWorkshop
                  ? 'text-purple-200/70'
                  : isDeductionDetective
                  ? 'text-sky-200/70'
                  : 'text-teal-200/70'
              }`}
            >
              <span>{outcomeCode}</span>
              <span>•</span>
              <span>
                {isRailwayActivity
                  ? '3 İnşa Adımı (100 Puan)'
                  : isBridgeActivity
                  ? '4 Restorasyon Adımı (100 Puan)'
                  : isSteppingWorkshop
                  ? '2 Ana Görev (100 Puan)'
                  : isDeductionDetective
                  ? '3 Deney Kutusu (100 Puan)'
                  : '4 İstasyon (100 Puan)'}
              </span>
              <span>•</span>
              <span>
                {isRailwayActivity
                  ? 'd ∥ k Paralel Doğrular'
                  : isBridgeActivity
                  ? 'Geniş Milimetrik Grid'
                  : isSteppingWorkshop
                  ? 'Pergel ile Mesafe Koruma'
                  : isDeductionDetective
                  ? 'Aksiyom & Mantıksal Çıkarım'
                  : 'Sistem Beyaz Tahta Notu'}
              </span>
            </div>
          </div>

          {/* Action Button Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            
            {/* Görüntüle */}
            <button
              type="button"
              onClick={() => {
                playSound('select');
                setViewerModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              title="Etkinlik kağıdını tam ekran salt okunur modda incele"
            >
              <Eye
                className={`w-4 h-4 ${
                  isRailwayActivity
                    ? 'text-indigo-300'
                    : isBridgeActivity
                    ? 'text-amber-300'
                    : isSteppingWorkshop
                    ? 'text-purple-300'
                    : isDeductionDetective
                    ? 'text-sky-300'
                    : 'text-teal-300'
                }`}
              />
              <span>Görüntüle</span>
            </button>

            {/* Akıllı Tahtada Aç & Çiz */}
            <button
              type="button"
              onClick={() => {
                playSound('select');
                setWhiteboardModalOpen(true);
              }}
              className={`px-4 py-2.5 rounded-xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                isRailwayActivity
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
                  : isBridgeActivity
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
                  : isSteppingWorkshop
                  ? 'bg-purple-400 hover:bg-purple-300 text-slate-950 shadow-purple-500/20'
                  : isDeductionDetective
                  ? 'bg-sky-400 hover:bg-sky-300 text-slate-950 shadow-sky-500/20'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/20'
              }`}
              title="Bu etkinlik kağıdını Akıllı Tahtaya yükle ve üzerinde çizim yap"
            >
              <MonitorPlay className="w-4 h-4 text-slate-950" />
              <span>Tahtada Aç & Çiz</span>
            </button>

            {/* PDF İndir */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloadingPdf}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
              title="Etkinlik kağıdını A4 PDF olarak indir"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2
                    className={`w-4 h-4 animate-spin ${
                      isRailwayActivity
                        ? 'text-indigo-400'
                        : isBridgeActivity
                        ? 'text-amber-400'
                        : isSteppingWorkshop
                        ? 'text-purple-400'
                        : isDeductionDetective
                        ? 'text-sky-400'
                        : 'text-teal-400'
                    }`}
                  />
                  <span>İndiriliyor...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-300" />
                  <span>A4 PDF İndir</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>

      {/* 2. BODY CONTENT: RAILWAY ENGINEERING OR STEPPING WORKSHOP OR DEDUCTION DETECTIVE OR BRIDGE OR 4-STATIONS */}
      {isRailwayActivity ? (
        /* ========================================================================= */
        /* BÜYÜK GÖREV: "TREN RAYI MÜHENDİSLİĞİ" (PARALEL DOĞRU İNŞASI - MAT.5.3.2)  */
        /* ========================================================================= */
        <div className="space-y-6">
          
          {/* 3 Aşamalı Çizim Kılavuzu Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* 1. Adım: Noktalar */}
            <div
              className={`bg-white rounded-2xl p-4 border-2 transition-all space-y-2 cursor-pointer ${
                railStep >= 1
                  ? 'border-sky-500 bg-sky-50/30 shadow-md ring-2 ring-sky-200'
                  : 'border-slate-200 hover:border-sky-300'
              }`}
              onClick={() => {
                if (railStep === 0) handleAdvanceRailStep();
              }}
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 font-bold flex items-center justify-center text-xs">
                  📏
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                    railStep >= 1
                      ? 'bg-sky-500 text-white border-sky-600'
                      : 'bg-sky-50 text-sky-800 border-sky-200'
                  }`}
                >
                  {railStep >= 1 ? '✓ 1. Adım Tamam' : '1. Adım: Cetvel'}
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-xs">Doğru Üzerinde Noktalar</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Verilen <code>d</code> doğrusu üzerinde aralarında belirli mesafeler olan <code>A</code>, <code>B</code> ve <code>C</code> noktalarını belirle.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-sky-700">
                <span>Araç: Cetvel</span>
                <span>30 Puan</span>
              </div>
            </div>

            {/* 2. Adım: Gönye 90° Eşit Dikmeler */}
            <div
              className={`bg-white rounded-2xl p-4 border-2 transition-all space-y-2 cursor-pointer ${
                railStep >= 2
                  ? 'border-amber-500 bg-amber-50/30 shadow-md ring-2 ring-amber-200'
                  : 'border-slate-200 hover:border-amber-300'
              }`}
              onClick={() => {
                if (railStep === 1) handleAdvanceRailStep();
              }}
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-bold flex items-center justify-center text-xs">
                  📐
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                    railStep >= 2
                      ? 'bg-amber-500 text-slate-950 border-amber-600'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {railStep >= 2 ? '✓ 2. Adım Tamam' : '2. Adım: Gönye (90°)'}
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-xs">Eşit Uzunlukta 3 Dikme</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Gönyenin dik köşesini kullanarak <code>A, B, C</code> noktalarından doğrunun üst tarafına eşit uzunlukta (4 br) 3 dikme çık (<code>[AA'], [BB'], [CC']</code>).
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-amber-700">
                <span>Araç: Gönye (⊥ 90°)</span>
                <span>35 Puan</span>
              </div>
            </div>

            {/* 3. Adım: Cetvel ile Birleştirme */}
            <div
              className={`bg-white rounded-2xl p-4 border-2 transition-all space-y-2 cursor-pointer ${
                railStep >= 3
                  ? 'border-indigo-500 bg-indigo-50/30 shadow-md ring-2 ring-indigo-200'
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
              onClick={() => {
                if (railStep === 2) handleAdvanceRailStep();
              }}
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  📏
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                    railStep >= 3
                      ? 'bg-indigo-600 text-white border-indigo-700'
                      : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                  }`}
                >
                  {railStep >= 3 ? '✓ 3. Adım Tamam' : '3. Adım: Cetvel'}
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-xs">Paralel Ray Doğrusu (k)</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Dikmelerin tepe noktalarını (<code>A', B', C'</code>) cetvelle birleştirerek yeni bir <code>k</code> doğrusu çiz (<code>d ∥ k</code>).
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-indigo-700">
                <span>Araç: Ölçüsüz Cetvel</span>
                <span>35 Puan</span>
              </div>
            </div>

          </div>

          {/* Geniş İnteraktif Çizim Alanı (Milimetrik Grid Canvas) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-500/40 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  <span>🚆</span>
                  <span>Geniş Çizim Alanı (İnteraktif Ray İnşası Simülatörü)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Aşağıdaki çizim alanında adımları tek tek uygulayarak tren rayının paralel iki kolunu inşa ediniz.
                </p>
              </div>

              {/* Simülatör Adım Kontrol Butonları */}
              <div className="flex items-center gap-2">
                {railStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleAdvanceRailStep}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>
                      {railStep === 0
                        ? '1. Adım: Noktaları Belirle'
                        : railStep === 1
                        ? '2. Adım: 3 Dikme Çık (Gönye 90°)'
                        : '3. Adım: Rayı Tamamla (k Doğrusu)'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ray İnşası Tamamlandı! (+50 XP)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setRailStep(0);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                    >
                      Yeniden Başlat
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Büyük İnteraktif Blueprint Canvas */}
            <div className="border-2 border-dashed border-indigo-300 rounded-2xl bg-[#fafafa] p-3 sm:p-5 relative overflow-hidden select-none shadow-inner">
              <svg viewBox="0 0 800 280" width="100%" height="100%" className="w-full h-auto overflow-visible select-none">
                <defs>
                  <pattern id="grid_railway_sim" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.2" fill="#cbd5e1" />
                  </pattern>
                  <linearGradient id="railGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>

                <rect width="800" height="280" fill="url(#grid_railway_sim)" />

                {/* Ray Zemin Çakılları / Ballast Alanı (Adım 3'te görünür) */}
                {railStep >= 3 && (
                  <rect
                    x="40"
                    y="75"
                    width="720"
                    height="120"
                    rx="12"
                    fill="#f1f5f9"
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                    className="animate-in fade-in duration-500"
                  />
                )}

                {/* Ray Traversleri (Sleepers - Adım 3'te rayı birbirine bağlar) */}
                {railStep >= 3 && (
                  <g className="animate-in fade-in duration-500">
                    {[90, 140, 190, 240, 290, 340, 390, 440, 490, 540, 590, 640, 690].map((x) => (
                      <rect
                        key={x}
                        x={x - 4}
                        y="80"
                        width="8"
                        height="110"
                        rx="2"
                        fill="#b45309"
                        opacity="0.8"
                        stroke="#78350f"
                        strokeWidth="1"
                      />
                    ))}
                  </g>
                )}

                {/* ALT DOĞRU d (Y = 190) */}
                <line x1="40" y1="190" x2="740" y2="190" stroke="#1e293b" strokeWidth="3.5" />
                <polygon points="40,185 24,190 40,195" fill="#1e293b" />
                <polygon points="740,185 756,190 740,195" fill="#1e293b" />
                <text x="765" y="195" font-family="monospace" font-size="14" font-weight="900" fill="#1e293b">
                  d
                </text>

                {/* ADIM 1: A, B, C Noktaları */}
                {railStep >= 1 && (
                  <g className="animate-in fade-in zoom-in-95 duration-300">
                    {/* A Noktası (X = 200, Y = 190) */}
                    <circle cx="200" cy="190" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
                    <text x="200" y="215" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#0369a1" text-anchor="middle">
                      A
                    </text>

                    {/* B Noktası (X = 390, Y = 190) */}
                    <circle cx="390" cy="190" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
                    <text x="390" y="215" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#0369a1" text-anchor="middle">
                      B
                    </text>

                    {/* C Noktası (X = 580, Y = 190) */}
                    <circle cx="580" cy="190" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
                    <text x="580" y="215" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#0369a1" text-anchor="middle">
                      C
                    </text>
                  </g>
                )}

                {/* ADIM 2: 3 Eşit Dikme [AA'], [BB'], [CC'] (h = 100px = 4 br) */}
                {railStep >= 2 && (
                  <g className="animate-in fade-in zoom-in-95 duration-400">
                    {/* Dikme 1: A -> A' */}
                    <line x1="200" y1="190" x2="200" y2="90" stroke="#f59e0b" strokeWidth="3" />
                    {/* Diklik sembolü A */}
                    <path d="M 200 176 L 214 176 L 214 190" fill="none" stroke="#d97706" strokeWidth="2" />
                    <circle cx="207" cy="183" r="2" fill="#d97706" />
                    <circle cx="200" cy="90" r="7" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
                    <text x="200" y="74" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#3730a3" text-anchor="middle">
                      A'
                    </text>
                    <text x="170" y="145" font-family="monospace" font-size="11" font-weight="900" fill="#d97706">
                      h = 4 br
                    </text>

                    {/* Dikme 2: B -> B' */}
                    <line x1="390" y1="190" x2="390" y2="90" stroke="#f59e0b" strokeWidth="3" />
                    {/* Diklik sembolü B */}
                    <path d="M 390 176 L 404 176 L 404 190" fill="none" stroke="#d97706" strokeWidth="2" />
                    <circle cx="397" cy="183" r="2" fill="#d97706" />
                    <circle cx="390" cy="90" r="7" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
                    <text x="390" y="74" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#3730a3" text-anchor="middle">
                      B'
                    </text>
                    <text x="360" y="145" font-family="monospace" font-size="11" font-weight="900" fill="#d97706">
                      h = 4 br
                    </text>

                    {/* Dikme 3: C -> C' */}
                    <line x1="580" y1="190" x2="580" y2="90" stroke="#f59e0b" strokeWidth="3" />
                    {/* Diklik sembolü C */}
                    <path d="M 580 176 L 594 176 L 594 190" fill="none" stroke="#d97706" strokeWidth="2" />
                    <circle cx="587" cy="183" r="2" fill="#d97706" />
                    <circle cx="580" cy="90" r="7" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
                    <text x="580" y="74" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#3730a3" text-anchor="middle">
                      C'
                    </text>
                    <text x="550" y="145" font-family="monospace" font-size="11" font-weight="900" fill="#d97706">
                      h = 4 br
                    </text>
                  </g>
                )}

                {/* ADIM 3: ÜST PARALEL DOĞRU k (Y = 90) & TREN */}
                {railStep >= 3 && (
                  <g className="animate-in fade-in duration-500">
                    <line x1="40" y1="90" x2="740" y2="90" stroke="#4f46e5" strokeWidth="3.5" />
                    <polygon points="40,85 24,90 40,95" fill="#4f46e5" />
                    <polygon points="740,85 756,90 740,95" fill="#4f46e5" />
                    <text x="765" y="95" font-family="monospace" font-size="14" font-weight="900" fill="#4f46e5">
                      k
                    </text>

                    {/* Paralellik Rozeti */}
                    <rect x="635" y="125" width="130" height="34" rx="8" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2" />
                    <text x="700" y="147" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#3730a3" text-anchor="middle">
                      d ∥ k (Paralel)
                    </text>

                    {/* Ray Üzerinde Hareket Eden Tren Emojisi / İkonu */}
                    <g transform="translate(680, 52)">
                      <text font-size="28" text-anchor="middle">🚂</text>
                    </g>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Tartış-Yaz & Çoktan Seçmeli Soru Paneli */}
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-500/30 shadow-md space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-900 font-black text-sm">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  💬
                </div>
                <span>TARTIŞ-YAZ: GEOMETRİK ÇIKARIM VE İLİŞKİ SORUSU</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-bold text-[11px] border border-indigo-200">
                100 Puan
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm text-slate-800 font-semibold leading-relaxed">
              &ldquo;Oluşturduğun yeni doğru (<code>k</code>) ile ilk doğru (<code>d</code>) hiç kesişir mi? Bu doğruların arasındaki geometrik ilişkiye ne ad verilir?&rdquo;
            </div>

            {/* 3 Seçenek Kartı */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Seçenek 1: Kesişen */}
              <button
                type="button"
                onClick={() => handleSelectRailAnswer('intersecting')}
                disabled={railQuestionSubmitted}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                  railQuestionAnswer === 'intersecting'
                    ? railQuestionSubmitted
                      ? 'border-rose-400 bg-rose-50 text-rose-900 ring-2 ring-rose-200'
                      : 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs">A) Kesişen Doğrular</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                      railQuestionAnswer === 'intersecting'
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {railQuestionAnswer === 'intersecting' && '●'}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">Doğrular bir noktada buluşup kesişir.</p>
              </button>

              {/* Seçenek 2: Paralel Doğrular (DOĞRU) */}
              <button
                type="button"
                onClick={() => handleSelectRailAnswer('parallel')}
                disabled={railQuestionSubmitted}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                  railQuestionAnswer === 'parallel'
                    ? railQuestionSubmitted
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-300'
                      : 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs">B) Paralel Doğrular (d ∥ k)</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                      railQuestionAnswer === 'parallel'
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {railQuestionAnswer === 'parallel' && '●'}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">Aralarındaki dik mesafe her noktada eşittir, asla kesişmezler.</p>
              </button>

              {/* Seçenek 3: Çakışık Doğrular */}
              <button
                type="button"
                onClick={() => handleSelectRailAnswer('coincident')}
                disabled={railQuestionSubmitted}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                  railQuestionAnswer === 'coincident'
                    ? railQuestionSubmitted
                      ? 'border-rose-400 bg-rose-50 text-rose-900 ring-2 ring-rose-200'
                      : 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs">C) Çakışık Doğrular</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                      railQuestionAnswer === 'coincident'
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {railQuestionAnswer === 'coincident' && '●'}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">Tüm noktaları ortak olan üst üste doğrular.</p>
              </button>

            </div>

            {/* Yanıtı Gönder & Kontrol Butonu */}
            {!railQuestionSubmitted ? (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSubmitRailAnswer}
                  disabled={!railQuestionAnswer}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  <span>Yanıtı Onayla ve Puanı Al</span>
                </button>
              </div>
            ) : (
              <div
                className={`p-4 rounded-2xl border-2 space-y-2 animate-in fade-in duration-300 ${
                  railQuestionAnswer === 'parallel'
                    ? 'border-emerald-300 bg-emerald-50/90 text-emerald-950'
                    : 'border-rose-300 bg-rose-50/90 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs flex items-center gap-1.5">
                    {railQuestionAnswer === 'parallel' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Tebrikler! Doğru Yanıt (+50 XP)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Yanlış Yanıt! Tekrar Düşünelim</span>
                      </>
                    )}
                  </span>
                  {railQuestionAnswer !== 'parallel' && (
                    <button
                      type="button"
                      onClick={() => {
                        setRailQuestionSubmitted(false);
                        setRailQuestionAnswer(null);
                      }}
                      className="text-xs font-bold underline text-rose-700 hover:text-rose-900 cursor-pointer"
                    >
                      Tekrar Dene
                    </button>
                  )}
                </div>

                <p className="text-xs leading-relaxed font-medium">
                  {railQuestionAnswer === 'parallel'
                    ? 'Bir doğru üzerindeki noktalardan aynı yöne çıkılan eşit uzunluktaki dikmelerin (h = 4 br) uç noktaları birleştirildiğinde elde edilen doğru, ilk doğruya PARALELDİR (d ∥ k). Aralarındaki dik uzaklık sabit olduğu için sonsuza kadar uzatılsalar bile hiçbir zaman kesişmezler!'
                    : 'Çıktığımız 3 dikme de aynı uzunlukta (4 birim) olduğundan, rayların arasındaki dik mesafe hiçbir noktada değişmez. Bu iki doğru birbirine ne yaklaşır ne de uzaklaşır.'}
                </p>
              </div>
            )}

            {/* Matematiksel Çıkarım Notu */}
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-start gap-3">
              <span className="text-lg">✨</span>
              <div className="text-xs text-indigo-950 leading-relaxed">
                <strong>Matematiksel İlke:</strong> Bir düzlemde iki doğrunun paralel olması için aralarındaki dik mesafenin her noktada sabit kalması gerekir. Gönye ile dik açı (90°) ve cetvelle eşit uzunluk aktarımı bu paralelliğin garantisidir.
              </div>
            </div>

          </div>

          {/* Alt Bilgi & Değerlendirme */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-semibold">
              <Award className="w-4 h-4 text-amber-500" />
              <span>
                <strong>Değerlendirme:</strong> Çizim Simülasyonu (50 Puan) + Mantıksal Çıkarım (50 Puan) = 100 Puan
              </span>
            </span>
            <span className="font-mono font-bold text-slate-400">www.maarifakademi.com.tr</span>
          </div>

        </div>
      ) : isSteppingWorkshop ? (
        /* ========================================================================= */
        /* ATÖLYE: "PERGEL İLE ADIMLAMA" (EŞİT PARÇALAR KESME - MAT.5.3.2)            */
        /* ========================================================================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* GÖREV A: IŞIN ÜZERİNDE ADIMLAMA */}
            <div className="bg-white rounded-3xl p-6 border-2 border-purple-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-purple-900 font-black text-sm">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm">
                      🧭
                    </div>
                    <span>GÖREV A: IŞIN ÜZERİNDE ADIMLAMA</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 font-bold text-[11px] border border-purple-200">
                    50 Puan
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                  <strong>Yönerge:</strong> Pergelini bir miktar aç ve açıklığını hiç bozma. İğnesini <code>K</code> noktasına batırıp ışını kesen bir yay çiz (<code>A</code> noktası). Şimdi iğneyi <code>A</code> noktasına batırıp ikinci bir yay çiz (<code>B</code> noktası). Yan yana 3 eşit parça oluştur.
                </div>

                {/* SVG İnşa Çizim Alanı */}
                <div className="border-2 border-dashed border-purple-300/80 rounded-2xl h-52 bg-slate-50/70 relative overflow-hidden flex items-center justify-center select-none">
                  <svg viewBox="0 0 380 180" width="100%" height="100%" className="w-full h-full">
                    <pattern id="grid_step_ray" width="16" height="16" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
                    </pattern>
                    <rect width="380" height="180" fill="url(#grid_step_ray)" />

                    {/* Işın Çizgisi [K --> */}
                    <line x1="30" y1="100" x2="350" y2="100" stroke="#334155" strokeWidth="2.5" />
                    <polygon points="350,95 365,100 350,105" fill="#334155" />
                    <text x="355" y="125" font-family="monospace" font-size="10" font-weight="bold" fill="#334155">[K Işını</text>

                    {/* K Başlangıç Noktası */}
                    <circle cx="50" cy="100" r="6" fill="#7c3aed" stroke="#ffffff" strokeWidth="2" />
                    <text x="50" y="130" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#6d28d9" text-anchor="middle">
                      K
                    </text>

                    {/* Adım 1: A Noktası ve Yayı */}
                    {rayStep >= 1 && (
                      <g className="animate-in fade-in zoom-in-95 duration-200">
                        <path d="M 130 65 A 75 75 0 0 1 130 135" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="4 3" />
                        <circle cx="130" cy="100" r="5" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="130" y="130" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#6d28d9" text-anchor="middle">
                          A
                        </text>
                        {/* Eşitlik Tırnağı 1 */}
                        <line x1="88" y1="94" x2="92" y2="106" stroke="#6d28d9" strokeWidth="2" />
                        <text x="90" y="85" font-family="monospace" font-size="9" font-weight="bold" fill="#7c3aed" text-anchor="middle">d_pergel</text>
                      </g>
                    )}

                    {/* Adım 2: B Noktası ve Yayı */}
                    {rayStep >= 2 && (
                      <g className="animate-in fade-in zoom-in-95 duration-200">
                        <path d="M 210 65 A 75 75 0 0 1 210 135" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="4 3" />
                        <circle cx="210" cy="100" r="5" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="210" y="130" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#6d28d9" text-anchor="middle">
                          B
                        </text>
                        {/* Eşitlik Tırnağı 2 */}
                        <line x1="168" y1="94" x2="172" y2="106" stroke="#6d28d9" strokeWidth="2" />
                        <text x="170" y="85" font-family="monospace" font-size="9" font-weight="bold" fill="#7c3aed" text-anchor="middle">d_pergel</text>
                      </g>
                    )}

                    {/* Adım 3: C Noktası ve Yayı */}
                    {rayStep >= 3 && (
                      <g className="animate-in fade-in zoom-in-95 duration-200">
                        <path d="M 290 65 A 75 75 0 0 1 290 135" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="4 3" />
                        <circle cx="290" cy="100" r="5" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="290" y="130" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#6d28d9" text-anchor="middle">
                          C
                        </text>
                        {/* Eşitlik Tırnağı 3 */}
                        <line x1="248" y1="94" x2="252" y2="106" stroke="#6d28d9" strokeWidth="2" />
                        <text x="250" y="85" font-family="monospace" font-size="9" font-weight="bold" fill="#7c3aed" text-anchor="middle">d_pergel</text>
                      </g>
                    )}

                    {/* İpuçları */}
                    {rayStep === 0 && (
                      <text x="190" y="45" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#94a3b8" text-anchor="middle">
                        📍 1. Adıma tıkla: İğneyi K'ye batır ve ilk yayı çiz
                      </text>
                    )}
                  </svg>
                </div>
              </div>

              {/* Etkileşimli Adımlama Kontrolleri */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="p-3.5 bg-purple-50/80 border-2 border-purple-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-purple-900 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-purple-600" />
                      <span>İnşa Simülatörü (Adım {rayStep}/3):</span>
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-200">
                      {rayStep === 3 ? 'Tamamlandı (+50 Puan)' : `${Math.round(rayStep * 16.6)} Puan`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleAdvanceRayStep}
                      disabled={rayStep >= 3}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                    >
                      <CircleDot className="w-3.5 h-3.5" />
                      <span>
                        {rayStep === 0
                          ? '1. Adım: İğneyi K\'ye Batır & A Yayını Çiz'
                          : rayStep === 1
                          ? '2. Adım: İğneyi A\'ya Batır & B Yayını Çiz'
                          : rayStep === 2
                          ? '3. Adım: İğneyi B\'ye Batır & C Yayını Çiz'
                          : '3 Eşit Parça Tamamlandı! 🎉'}
                      </span>
                    </button>

                    {rayStep > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click');
                          setRayStep(0);
                        }}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
                      >
                        Sıfırla
                      </button>
                    )}
                  </div>

                  {rayStep === 3 && (
                    <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Harika! |KA| = |AB| = |BC| eşitliği pergel açıklığı ile santimetre cetveli olmadan garanti edildi.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* GÖREV B: AÇININ KOLLARINI EŞİTLEME */}
            <div className="bg-white rounded-3xl p-6 border-2 border-teal-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-teal-900 font-black text-sm">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-sm">
                      📐
                    </div>
                    <span>GÖREV B: AÇININ KOLLARINI EŞİTLEME</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-bold text-[11px] border border-teal-200">
                    50 Puan
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                  <strong>Yönerge:</strong> Verilen rastgele bir açının her iki kolu üzerinde, aynı pergel açıklığı ile tepe noktasından (<code>O</code>) eşit uzaklıkta noktalar (<code>P₁</code> ve <code>P₂</code>) işaretle.
                </div>

                {/* SVG İnşa Çizim Alanı */}
                <div className="border-2 border-dashed border-teal-300/80 rounded-2xl h-52 bg-slate-50/70 relative overflow-hidden flex items-center justify-center select-none">
                  <svg viewBox="0 0 380 180" width="100%" height="100%" className="w-full h-full">
                    <pattern id="grid_step_angle" width="16" height="16" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
                    </pattern>
                    <rect width="380" height="180" fill="url(#grid_step_angle)" />

                    {/* Açının Tepe Noktası O */}
                    <circle cx="50" cy="135" r="6" fill="#0d9488" stroke="#ffffff" strokeWidth="2" />
                    <text x="35" y="152" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#0f766e">
                      O (Tepe)
                    </text>

                    {/* Yatay Kol k1 */}
                    <line x1="50" y1="135" x2="330" y2="135" stroke="#334155" strokeWidth="2.5" />
                    <polygon points="330,130 345,135 330,140" fill="#334155" />
                    <text x="340" y="152" font-family="monospace" font-size="10" font-weight="bold" fill="#334155">k₁</text>

                    {/* Eğik Kol k2 (50 deg) */}
                    <line x1="50" y1="135" x2="235" y2="25" stroke="#334155" strokeWidth="2.5" />
                    <polygon points="230,20 245,19 240,34" fill="#334155" />
                    <text x="250" y="32" font-family="monospace" font-size="10" font-weight="bold" fill="#334155">k₂</text>

                    {/* Pergel Yayı ve Kesim Noktaları P1, P2 */}
                    {angleStep >= 1 && (
                      <g className="animate-in fade-in zoom-in-95 duration-200">
                        {/* O Merkezli Pergel Yayı (R = 130) */}
                        <path d="M 180 135 A 130 130 0 0 0 133 36" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeDasharray="5 4" />
                        
                        {/* P1 Noktası */}
                        <circle cx="180" cy="135" r="5" fill="#0d9488" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="180" y="155" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#0f766e" text-anchor="middle">
                          P₁
                        </text>

                        {/* P2 Noktası */}
                        <circle cx="133" cy="51" r="5" fill="#0d9488" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="115" y="52" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#0f766e" text-anchor="middle">
                          P₂
                        </text>

                        {/* Eşitlik Çift Tırnakları */}
                        <text x="120" y="125" font-family="monospace" font-size="9.5" font-weight="bold" fill="#0f766e" text-anchor="middle">
                          r_pergel
                        </text>
                        <text x="85" y="80" font-family="monospace" font-size="9.5" font-weight="bold" fill="#0f766e" text-anchor="middle">
                          r_pergel
                        </text>

                        <text x="280" y="80" font-family="monospace" font-size="10" font-weight="bold" fill="#0d9488" text-anchor="middle">
                          |OP₁| = |OP₂|
                        </text>
                      </g>
                    )}

                    {angleStep === 0 && (
                      <text x="190" y="45" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#94a3b8" text-anchor="middle">
                        📍 Pergeli O köşesine batır ve iki kolu kesen yayı çiz
                      </text>
                    )}
                  </svg>
                </div>
              </div>

              {/* Etkileşimli Kontroller */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="p-3.5 bg-teal-50/80 border-2 border-teal-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-teal-900 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-teal-600" />
                      <span>İnşa Simülatörü:</span>
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 bg-white px-2 py-0.5 rounded-md border border-teal-200">
                      {angleStep === 1 ? 'Tamamlandı (+50 Puan)' : '0 Puan'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleAdvanceAngleStep}
                      disabled={angleStep === 1}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                    >
                      <CircleDot className="w-3.5 h-3.5" />
                      <span>
                        {angleStep === 0
                          ? 'Pergeli O Köşesine Batır & Yay Çiz'
                          : 'Kollar Eşitlendi! (|OP₁|=|OP₂|) 🎉'}
                      </span>
                    </button>

                    {angleStep > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click');
                          setAngleStep(0);
                        }}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
                      >
                        Sıfırla
                      </button>
                    )}
                  </div>

                  {angleStep === 1 && (
                    <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Kusursuz! Açının her iki kolundan tepe noktasından eşit uzaklıkta noktalar kesildi.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : isDeductionDetective ? (
        /* ========================================================================= */
        /* ETKİNLİK: "ÇIKARIM DEDEKTİFİ" (GÖZLEM VE TEMEL KURALLAR - MAT.5.3.2)       */
        /* ========================================================================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. DENEY KUTUSU: İKİ NOKTA - BİR DOĞRU */}
            <div className="bg-white rounded-3xl p-6 border-2 border-sky-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sky-900 font-black text-sm">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold text-sm">
                      📏
                    </div>
                    <span>DENEY 1: İKİ NOKTA - BİR DOĞRU</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 font-bold text-[11px] border border-sky-200">
                    Cetvel
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                  <strong>Soru &amp; Yönerge:</strong> Cetvelini bu iki noktaya koy. Bu noktalardan aynı anda geçen kaç farklı düz çizgi çizebilirsin? Dene ve sonucu yaz.
                </div>

                {/* SVG Çizim Alanı */}
                <div className="border-2 border-dashed border-sky-300/80 rounded-2xl h-44 bg-slate-50/70 relative overflow-hidden flex items-center justify-center select-none">
                  <svg viewBox="0 0 280 150" width="100%" height="100%" className="w-full h-full">
                    <pattern id="grid_exp1" width="16" height="16" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
                    </pattern>
                    <rect width="280" height="150" fill="url(#grid_exp1)" />

                    {/* Düz Doğru Çizgisi d */}
                    <line x1="20" y1="75" x2="260" y2="75" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="6 3" />
                    
                    {/* A Noktası */}
                    <circle cx="70" cy="75" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                    <text x="70" y="56" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#0369a1" text-anchor="middle">
                      A
                    </text>

                    {/* B Noktası */}
                    <circle cx="210" cy="75" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                    <text x="210" y="56" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#0369a1" text-anchor="middle">
                      B
                    </text>

                    {/* Çizgi Etiketi */}
                    <text x="140" y="115" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#64748b" text-anchor="middle">
                      (Cetvel ile A ve B'yi birleştir)
                    </text>
                    <text x="140" y="132" font-family="monospace" font-size="10" font-weight="bold" fill="#0284c7" text-anchor="middle">
                      d doğrusu (Yalnız 1 Doğru)
                    </text>
                  </svg>
                </div>
              </div>

              {/* Çıkarım Cümlesi & İnteraktif Doldurma */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="p-3.5 bg-sky-50/80 border-2 border-sky-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-black text-sky-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-sky-600" />
                      <span>Dedektif Çıkarım Cümlesi:</span>
                    </span>
                    <span className="text-[10px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded-md border border-sky-200">
                      33.3 Puan
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                    &ldquo;Düzlemde farklı iki noktadan yalnız{' '}
                    <input
                      type="text"
                      placeholder="buraya yaz"
                      value={deductionAnswers.exp1}
                      onChange={(e) =>
                        setDeductionAnswers((prev) => ({ ...prev, exp1: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCheckDeduction('exp1');
                      }}
                      className={`w-28 px-2 py-1 text-center font-black text-xs rounded-lg border-2 outline-none transition-all ${
                        deductionStatus.exp1 === true
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200'
                          : deductionStatus.exp1 === false
                          ? 'border-rose-400 bg-rose-50 text-rose-900'
                          : 'border-sky-300 bg-white text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
                      }`}
                    />{' '}
                    doğru geçer.&rdquo;
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCheckDeduction('exp1')}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-[11px] transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Kontrol Et</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setRevealedSolutions((prev) => ({ ...prev, exp1: !prev.exp1 }))
                      }
                      className="text-[10.5px] font-bold text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>{revealedSolutions.exp1 ? 'İpucunu Gizle' : 'Doğru Cevap'}</span>
                    </button>
                  </div>

                  {deductionStatus.exp1 === true && (
                    <div className="p-2 bg-emerald-100 border border-emerald-300 rounded-xl text-[11px] text-emerald-900 font-bold flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Harika Dedektif Çıkarımı! (+33.3 Puan)</span>
                    </div>
                  )}

                  {revealedSolutions.exp1 && (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-[10.5px] text-amber-900 leading-tight animate-in fade-in">
                      💡 <strong>Doğru Cevap:</strong> <code>"bir"</code> veya <code>"1"</code> (Aksiyom: İki noktadan tek bir doğru geçer).
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. DENEY KUTUSU: ÇEMBERİN YARIÇAP SIRRI */}
            <div className="bg-white rounded-3xl p-6 border-2 border-purple-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-purple-900 font-black text-sm">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm">
                      ⭕
                    </div>
                    <span>DENEY 2: ÇEMBERİN YARIÇAP SIRRI</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 font-bold text-[11px] border border-purple-200">
                    Pergel
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                  <strong>Soru &amp; Yönerge:</strong> Merkezden çember yayına uzanan bu doğru parçalarının uzunluklarını karşılaştır.
                </div>

                {/* SVG Çizim Alanı */}
                <div className="border-2 border-dashed border-purple-300/80 rounded-2xl h-44 bg-slate-50/70 relative overflow-hidden flex items-center justify-center select-none">
                  <svg viewBox="0 0 280 150" width="100%" height="100%" className="w-full h-full">
                    <pattern id="grid_exp2" width="16" height="16" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
                    </pattern>
                    <rect width="280" height="150" fill="url(#grid_exp2)" />

                    {/* Çember M Merkezli */}
                    <circle cx="140" cy="75" r="50" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
                    
                    {/* Merkez M */}
                    <circle cx="140" cy="75" r="5" fill="#6d28d9" stroke="#ffffff" strokeWidth="2" />
                    <text x="130" y="70" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#5b21b6">
                      M
                    </text>

                    {/* r1 to A (Right 0 deg) */}
                    <line x1="140" y1="75" x2="190" y2="75" stroke="#8b5cf6" strokeWidth="2" />
                    <circle cx="190" cy="75" r="3.5" fill="#6d28d9" />
                    <text x="198" y="79" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#6d28d9">A</text>
                    <text x="165" y="68" font-family="monospace" font-size="9" font-weight="bold" fill="#7c3aed">r₁</text>

                    {/* r2 to B (Top-Left 135 deg) */}
                    <line x1="140" y1="75" x2="105" y2="40" stroke="#8b5cf6" strokeWidth="2" />
                    <circle cx="105" cy="40" r="3.5" fill="#6d28d9" />
                    <text x="94" y="35" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#6d28d9">B</text>
                    <text x="115" y="52" font-family="monospace" font-size="9" font-weight="bold" fill="#7c3aed">r₂</text>

                    {/* r3 to C (Bottom-Left 225 deg) */}
                    <line x1="140" y1="75" x2="105" y2="110" stroke="#8b5cf6" strokeWidth="2" />
                    <circle cx="105" cy="110" r="3.5" fill="#6d28d9" />
                    <text x="94" y="118" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#6d28d9">C</text>
                    <text x="115" y="100" font-family="monospace" font-size="9" font-weight="bold" fill="#7c3aed">r₃</text>

                    {/* Eşitlik Formülü */}
                    <text x="215" y="132" font-family="monospace" font-size="9" font-weight="bold" fill="#6d28d9" text-anchor="middle">
                      |MA| = |MB| = |MC| = r
                    </text>
                  </svg>
                </div>
              </div>

              {/* Çıkarım Cümlesi & İnteraktif Doldurma */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="p-3.5 bg-purple-50/80 border-2 border-purple-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-black text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-purple-600" />
                      <span>Dedektif Çıkarım Cümlesi:</span>
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-200">
                      33.3 Puan
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                    &ldquo;Çemberin merkezinden üzerindeki tüm noktalara çizilen doğru parçaları{' '}
                    <input
                      type="text"
                      placeholder="buraya yaz"
                      value={deductionAnswers.exp2}
                      onChange={(e) =>
                        setDeductionAnswers((prev) => ({ ...prev, exp2: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCheckDeduction('exp2');
                      }}
                      className={`w-28 px-2 py-1 text-center font-black text-xs rounded-lg border-2 outline-none transition-all ${
                        deductionStatus.exp2 === true
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200'
                          : deductionStatus.exp2 === false
                          ? 'border-rose-400 bg-rose-50 text-rose-900'
                          : 'border-purple-300 bg-white text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                      }`}
                    />{' '}
                    uzunluktadır.&rdquo;
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCheckDeduction('exp2')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-[11px] transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Kontrol Et</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setRevealedSolutions((prev) => ({ ...prev, exp2: !prev.exp2 }))
                      }
                      className="text-[10.5px] font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>{revealedSolutions.exp2 ? 'İpucunu Gizle' : 'Doğru Cevap'}</span>
                    </button>
                  </div>

                  {deductionStatus.exp2 === true && (
                    <div className="p-2 bg-emerald-100 border border-emerald-300 rounded-xl text-[11px] text-emerald-900 font-bold flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Kusursuz Dedektif Çıkarımı! (+33.3 Puan)</span>
                    </div>
                  )}

                  {revealedSolutions.exp2 && (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-[10.5px] text-amber-900 leading-tight animate-in fade-in">
                      💡 <strong>Doğru Cevap:</strong> <code>"eşit"</code> veya <code>"aynı"</code> (Tüm yarıçaplar birbirine eşittir).
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. DENEY KUTUSU: TEK DİKME KURALI */}
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-sm">
                      📐
                    </div>
                    <span>DENEY 3: TEK DİKME KURALI</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200">
                    Gönye
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                  <strong>Soru &amp; Yönerge:</strong> P noktasından aşağıdaki doğruya gönyenle kaç tane 90° dikme indirebilirsin?
                </div>

                {/* SVG Çizim Alanı */}
                <div className="border-2 border-dashed border-amber-300/80 rounded-2xl h-44 bg-slate-50/70 relative overflow-hidden flex items-center justify-center select-none">
                  <svg viewBox="0 0 280 150" width="100%" height="100%" className="w-full h-full">
                    <pattern id="grid_exp3" width="16" height="16" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
                    </pattern>
                    <rect width="280" height="150" fill="url(#grid_exp3)" />

                    {/* Zemin Doğrusu d */}
                    <line x1="20" y1="110" x2="260" y2="110" stroke="#334155" strokeWidth="2.5" />
                    <text x="250" y="102" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#334155">
                      d
                    </text>

                    {/* Dış Nokta P */}
                    <circle cx="140" cy="30" r="6" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                    <text x="140" y="18" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#c2410c" text-anchor="middle">
                      P (Dış Nokta)
                    </text>

                    {/* İndirilen Dikme [PH] */}
                    <line x1="140" y1="30" x2="140" y2="110" stroke="#ea580c" strokeWidth="2.5" strokeDasharray="5 3" />
                    <circle cx="140" cy="110" r="4" fill="#c2410c" />
                    <text x="140" y="128" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#c2410c" text-anchor="middle">
                      H
                    </text>

                    {/* 90° Diklik Sembolü */}
                    <path d="M 140 96 L 154 96 L 154 110" fill="none" stroke="#ea580c" strokeWidth="2" />
                    <circle cx="147" cy="103" r="1.8" fill="#ea580c" />

                    <text x="205" y="65" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#ea580c">
                      [PH] ⊥ d (90°)
                    </text>
                  </svg>
                </div>
              </div>

              {/* Çıkarım Cümlesi & İnteraktif Doldurma */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="p-3.5 bg-amber-50/80 border-2 border-amber-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-black text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-amber-600" />
                      <span>Dedektif Çıkarım Cümlesi:</span>
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200">
                      33.4 Puan
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                    &ldquo;Bir doğruya dışındaki bir noktadan yalnız{' '}
                    <input
                      type="text"
                      placeholder="buraya yaz"
                      value={deductionAnswers.exp3}
                      onChange={(e) =>
                        setDeductionAnswers((prev) => ({ ...prev, exp3: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCheckDeduction('exp3');
                      }}
                      className={`w-28 px-2 py-1 text-center font-black text-xs rounded-lg border-2 outline-none transition-all ${
                        deductionStatus.exp3 === true
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200'
                          : deductionStatus.exp3 === false
                          ? 'border-rose-400 bg-rose-50 text-rose-900'
                          : 'border-amber-300 bg-white text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                      }`}
                    />{' '}
                    dikme çizilebilir.&rdquo;
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCheckDeduction('exp3')}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-[11px] transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Kontrol Et</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setRevealedSolutions((prev) => ({ ...prev, exp3: !prev.exp3 }))
                      }
                      className="text-[10.5px] font-bold text-amber-700 hover:text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>{revealedSolutions.exp3 ? 'İpucunu Gizle' : 'Doğru Cevap'}</span>
                    </button>
                  </div>

                  {deductionStatus.exp3 === true && (
                    <div className="p-2 bg-emerald-100 border border-emerald-300 rounded-xl text-[11px] text-emerald-900 font-bold flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Mükemmel Dedektif Çıkarımı! (+33.4 Puan)</span>
                    </div>
                  )}

                  {revealedSolutions.exp3 && (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-[10.5px] text-amber-900 leading-tight animate-in fade-in">
                      💡 <strong>Doğru Cevap:</strong> <code>"bir"</code> veya <code>"1"</code> (Dış noktadan yalnız 1 dikme çizilebilir).
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : isBridgeActivity ? (
        /* ========================================================================= */
        /* BÜYÜK GÖREV: TARİHİ KÖPRÜ RESTORASYONU VIEW                               */
        /* ========================================================================= */
        <div className="space-y-6">
          
          {/* 4 Restorasyon Adımı Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Adım 1: Cetvel */}
            <div className="bg-white rounded-2xl p-4 border-2 border-teal-500/30 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 font-bold flex items-center justify-center text-xs">
                  📏
                </span>
                <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-bold text-[10px] border border-teal-200">
                  Adım 1: Cetvel
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-xs">Düz Nehir Zemin Doğrusu</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Cetvelini kullanarak su seviyesi hizasındaki düz nehir tabanı doğrusunu çiz.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-teal-700">
                <span>Araç: Cetvel</span>
                <span>25 Puan</span>
              </div>
            </div>

            {/* Adım 2: Gönye */}
            <div className="bg-white rounded-2xl p-4 border-2 border-orange-500/30 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-bold flex items-center justify-center text-xs">
                  📐
                </span>
                <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-800 font-bold text-[10px] border border-orange-200">
                  Adım 2: Gönye
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-xs">90° Dik İki Köprü Ayağı</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Zemine 90° dik iki taşıyıcı köprü ayağı indir. Diklik sembolünü (⊥) yerleştir.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-orange-700">
                <span>Araç: Gönye (⊥ 90°)</span>
                <span>25 Puan</span>
              </div>
            </div>

            {/* Adım 3: Pergel */}
            <div className="bg-white rounded-2xl p-4 border-2 border-purple-500/30 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-bold flex items-center justify-center text-xs">
                  ⭕
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-bold text-[10px] border border-purple-200">
                  Adım 3: Pergel
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-xs">Dairesel Kemer Yayı</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Pergel ucunu 'K' kemer merkezine sabitleyip iki ayak arasına dairesel kemer yayı kondur.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-purple-700">
                <span>Araç: Pergel (r=5 cm)</span>
                <span>25 Puan</span>
              </div>
            </div>

            {/* Adım 4: İletki */}
            <div className="bg-white rounded-2xl p-4 border-2 border-blue-500/30 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-xs">
                  🧭
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold text-[10px] border border-blue-200">
                  Adım 4: İletki
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-xs">Kule Çatı Açısı Kontrolü</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                İletki ile gözetleme kulesinin çatı eğimini (60°/45°) kontrol et ve açıyı yaz.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-blue-700">
                <span>Araç: İletki (Açıölçer)</span>
                <span>25 Puan</span>
              </div>
            </div>

          </div>

          {/* Geniş Çizim Alanı: Milimetrik Grid Canvas */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-500/40 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-bottom border-slate-200 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  <span>🏛️</span>
                  <span>Geniş Çizim Alanı (Milimetrik Grid Canvas)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Mimar Sinan'ın Kanuni Köprüsü restorasyon şablonu üzerinde çizim araçlarını uygulayınız.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200">
                Ölçek: 1 birim = 1 cm • Çift Kemer Hizası
              </span>
            </div>

            {/* Büyük İnteraktif Blueprint Canvas (SVG Destekli ve Matematiksel Olarak K Merkezli) */}
            <div className="border-2 border-dashed border-amber-400 rounded-2xl bg-[#fcfbf7] p-3 sm:p-5 relative overflow-hidden select-none shadow-inner">
              <svg viewBox="0 0 800 320" width="100%" height="100%" className="w-full h-auto overflow-visible select-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid_view" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.2" fill="#cbd5e1" />
                  </pattern>
                  <linearGradient id="pierGrad_view" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#fde68a" />
                    <stop offset="50%" stop-color="#fef3c7" />
                    <stop offset="100%" stop-color="#fde68a" />
                  </linearGradient>
                  <linearGradient id="waterGrad_view" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#bae6fd" stop-opacity="0.3" />
                  </linearGradient>
                </defs>

                <rect x="0" y="0" width="800" height="320" fill="#fcfbf7" />
                <rect x="0" y="0" width="800" height="320" fill="url(#grid_view)" />

                {/* Su Alanı (Nehir Yatağı) */}
                <rect x="30" y="250" width="740" height="60" fill="url(#waterGrad_view)" rx="8" />
                <path d="M 50 280 Q 90 273 130 280 T 210 280 T 290 280 T 370 280 T 450 280 T 530 280 T 610 280 T 690 280 T 750 280" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.7" />
                <text x="400" y="298" font-family="system-ui, sans-serif" font-size="11" fill="#0284c7" text-anchor="middle" font-weight="600">
                  ~~~~ Tunca / Meriç Nehri Su Yatağı ~~~~
                </text>

                {/* ADIM 1: NEHİR ZEMİN DOĞRUSU (CETVEL) */}
                <line x1="40" y1="250" x2="760" y2="250" stroke="#0d9488" stroke-width="3" stroke-dasharray="8 5" stroke-linecap="round" />
                <polygon points="36,250 48,245 48,255" fill="#0d9488" />
                <polygon points="764,250 752,245 752,255" fill="#0d9488" />
                <text x="50" y="240" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#0f766e">
                  ◄ Düz Nehir Zemin Doğrusu (Cetvel)
                </text>
                <text x="750" y="240" font-family="monospace" font-size="11" font-weight="900" fill="#0f766e" text-anchor="end">
                  d_nehir ►
                </text>

                {/* Cetvel Çentikleri */}
                <g stroke="#0f766e" stroke-width="1" opacity="0.6">
                  <line x1="100" y1="247" x2="100" y2="253" />
                  <line x1="250" y1="245" x2="250" y2="255" stroke-width="2" />
                  <line x1="400" y1="245" x2="400" y2="255" stroke-width="2" />
                  <line x1="550" y1="245" x2="550" y2="255" stroke-width="2" />
                  <line x1="700" y1="247" x2="700" y2="253" />
                </g>

                {/* ADIM 4: KULE GÖZETLEME ÇATISI (İLETKİ) */}
                <g>
                  <rect x="90" y="90" width="60" height="160" fill="#fef3c7" stroke="#b45309" stroke-width="2" rx="2" />
                  <rect x="110" y="120" width="20" height="30" rx="10" fill="#78350f" opacity="0.7" />
                  <polygon points="120,25 80,90 160,90" fill="#fed7aa" stroke="#ea580c" stroke-width="2" />
                  <circle cx="120" cy="25" r="5" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
                  <text x="120" y="16" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#1d4ed8" text-anchor="middle">
                    T (Tepe Noktası)
                  </text>
                  <path d="M 100 57 A 38 38 0 0 0 140 57" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="3 3" />
                  <text x="120" y="72" font-family="monospace" font-size="10" font-weight="900" fill="#2563eb" text-anchor="middle">
                    60° (İletki)
                  </text>
                </g>

                {/* ADIM 2: SOL AYAK İNŞA HEDEFİ (AYAK 1 - GÖNYE İLE ÇİZİLECEK) */}
                <g>
                  {/* Öğrencinin gönye ile çizeceği kılavuz hattı */}
                  <line x1="250" y1="150" x2="250" y2="250" stroke="#ea580c" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.45" />
                  
                  {/* Taban Noktası Z1 */}
                  <circle cx="250" cy="250" r="5" fill="#ea580c" stroke="#ffffff" stroke-width="1.5" />
                  <text x="250" y="270" font-family="monospace" font-size="10.5" font-weight="900" fill="#c2410c" text-anchor="middle">
                    Z1 (Taban)
                  </text>

                  {/* Tepe Noktası A1 */}
                  <circle cx="250" cy="150" r="5" fill="#ea580c" stroke="#ffffff" stroke-width="1.5" />
                  <text x="215" y="145" font-family="monospace" font-size="10.5" font-weight="900" fill="#c2410c">
                    A1
                  </text>

                  {/* Gönye 90° Diklik Hedef Kutusu (Zeminde) */}
                  <path d="M 250 236 L 264 236 L 264 250" fill="none" stroke="#ea580c" stroke-width="1.8" />
                  <circle cx="257" cy="243" r="1.5" fill="#ea580c" />
                  
                  <text x="250" y="195" font-family="system-ui, sans-serif" font-size="9.5" font-weight="900" fill="#c2410c" text-anchor="middle">
                    [Z1-A1] ⊥ d
                  </text>
                  <text x="250" y="208" font-family="system-ui, sans-serif" font-size="8.5" font-weight="700" fill="#ea580c" text-anchor="middle">
                    (Gönye ile Çiz)
                  </text>
                </g>

                {/* ADIM 2: SAĞ AYAK İNŞA HEDEFİ (AYAK 2 - GÖNYE İLE ÇİZİLECEK) */}
                <g>
                  {/* Öğrencinin gönye ile çizeceği kılavuz hattı */}
                  <line x1="550" y1="150" x2="550" y2="250" stroke="#ea580c" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.45" />

                  {/* Taban Noktası Z2 */}
                  <circle cx="550" cy="250" r="5" fill="#ea580c" stroke="#ffffff" stroke-width="1.5" />
                  <text x="550" y="270" font-family="monospace" font-size="10.5" font-weight="900" fill="#c2410c" text-anchor="middle">
                    Z2 (Taban)
                  </text>

                  {/* Tepe Noktası A2 */}
                  <circle cx="550" cy="150" r="5" fill="#ea580c" stroke="#ffffff" stroke-width="1.5" />
                  <text x="568" y="145" font-family="monospace" font-size="10.5" font-weight="900" fill="#c2410c">
                    A2
                  </text>

                  {/* Gönye 90° Diklik Hedef Kutusu (Zeminde) */}
                  <path d="M 550 236 L 536 236 L 536 250" fill="none" stroke="#ea580c" stroke-width="1.8" />
                  <circle cx="543" cy="243" r="1.5" fill="#ea580c" />

                  <text x="550" y="195" font-family="system-ui, sans-serif" font-size="9.5" font-weight="900" fill="#c2410c" text-anchor="middle">
                    [Z2-A2] ⊥ d
                  </text>
                  <text x="550" y="208" font-family="system-ui, sans-serif" font-size="8.5" font-weight="700" fill="#ea580c" text-anchor="middle">
                    (Gönye ile Çiz)
                  </text>
                </g>

                {/* ADIM 3: KEMER MERKEZİ K VE KEMER YAYI (PERGEL) */}
                {/* 1. Kesik Çizgili Kemer Yayı (Merkezi K=(400,150) olan tam yarıçap R=150 dairesel yay) */}
                <path d="M 250 150 A 150 150 0 0 1 550 150" fill="none" stroke="#7c3aed" stroke-width="3" stroke-dasharray="6 4" />

                {/* 2. Kemer Üst Taş Sınırı (Korkuluk Yolu) */}
                <path d="M 80 90 L 250 130 A 165 165 0 0 1 550 130 L 720 90" fill="none" stroke="#b45309" stroke-width="2" stroke-dasharray="4 4" opacity="0.5" />

                {/* 3. Yarıçap (Radius) Çizgileri */}
                <line x1="400" y1="150" x2="400" y2="0" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3 3" />
                <line x1="400" y1="150" x2="506" y2="44" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3 3" />
                <circle cx="506" cy="44" r="3" fill="#7c3aed" />

                {/* Yarıçap Etiketi */}
                <g transform="translate(460, 90)">
                  <rect x="-4" y="-12" width="90" height="18" fill="#ffffff" stroke="#ddd6fe" rx="4" />
                  <text x="41" y="1" font-family="monospace" font-size="10" font-weight="bold" fill="#6d28d9" text-anchor="middle">
                    r = 5 cm (Pergel)
                  </text>
                </g>

                {/* Kemer Tepe Etiketi */}
                <g transform="translate(400, 20)">
                  <rect x="-80" y="-14" width="160" height="22" fill="#ffffff" stroke="#7c3aed" stroke-width="1.5" rx="6" />
                  <text x="0" y="1" font-family="system-ui, sans-serif" font-size="10.5" font-weight="900" fill="#6d28d9" text-anchor="middle">
                    Dairesel Kemer Yayı (Yay Tepe: P)
                  </text>
                </g>

                {/* 4. K Noktası (Kemer Merkezi - Pergel Batırma İğnesi) */}
                <line x1="250" y1="150" x2="550" y2="150" stroke="#6d28d9" stroke-width="1" stroke-dasharray="2 2" opacity="0.4" />
                <circle cx="400" cy="150" r="14" fill="#ede9fe" stroke="#6d28d9" stroke-width="2" />
                <circle cx="400" cy="150" r="4" fill="#6d28d9" />
                <line x1="388" y1="150" x2="412" y2="150" stroke="#6d28d9" stroke-width="1.5" />
                <line x1="400" y1="138" x2="400" y2="162" stroke="#6d28d9" stroke-width="1.5" />

                {/* K Noktası Etiketi */}
                <g transform="translate(400, 180)">
                  <rect x="-75" y="-12" width="150" height="24" fill="#f5f3ff" stroke="#6d28d9" stroke-width="1.5" rx="6" />
                  <text x="0" y="3" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#5b21b6" text-anchor="middle">
                    K (Kemer Merkezi)
                  </text>
                  <text x="0" y="24" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#7c3aed" text-anchor="middle">
                    📍 Pergel İğnesi Batırma Noktası
                  </text>
                </g>
              </svg>
            </div>
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* ETKİNLİK 1: AŞAMALI İNŞA İSTASYONLARI (4 Mini Çizim Alanı)                */
        /* ========================================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* İSTASYON 1: CETVEL */}
          <div className="bg-white rounded-3xl p-6 border-2 border-teal-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-teal-800 font-black text-sm">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-sm">
                    📏
                  </div>
                  <span>İSTASYON 1: CETVEL</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-bold text-[11px] border border-teal-200">
                  Doğru Parçası & Işın
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <strong>Yönerge:</strong> Cetvelini kullanarak <strong>6 cm</strong> uzunluğunda bir <code>[AB]</code> doğru parçası çiz. Ardından başlangıcı <code>C</code> olan bir <code>[CD</code> ışını inşa et.
              </div>

              {/* Station Canvas Simulation Area */}
              <div className="border-2 border-dashed border-teal-300/80 rounded-2xl h-48 bg-slate-50/70 p-4 relative flex flex-col justify-between overflow-hidden select-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono font-black text-teal-900 text-xs">
                    <span className="w-3 h-3 rounded-full bg-teal-600 inline-block"></span>
                    <span>A Noktası</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">(6 cm → B noktası)</span>
                </div>

                <div className="my-auto py-2 border-y border-slate-200/80 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span>0 cm</span>
                  <span>2 cm</span>
                  <span>4 cm</span>
                  <span className="font-bold text-teal-700">6 cm [AB]</span>
                  <span>8 cm</span>
                  <span>10 cm</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono font-black text-teal-900 text-xs">
                    <span className="w-3 h-3 rounded-full bg-teal-600 inline-block"></span>
                    <span>C Noktası</span>
                  </div>
                  <span className="text-[11px] text-teal-700 font-bold flex items-center gap-1">
                    <span>[CD Işını</span>
                    <span>──────►</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Hedef Araç: <strong>Santimetre Cetveli</strong></span>
              <span className="text-teal-700 font-bold">25 Puan</span>
            </div>
          </div>

          {/* İSTASYON 2: İLETKİ */}
          <div className="bg-white rounded-3xl p-6 border-2 border-blue-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-blue-900 font-black text-sm">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm">
                    🧭
                  </div>
                  <span>İSTASYON 2: İLETKİ</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-200">
                  60° Dar Açı İnşası
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <strong>Yönerge:</strong> Verilen yatay kolun başlangıç noktasına iletkini yerleştirerek <strong>60°'lik</strong> bir dar açı inşa et. Açının yayını çiz.
              </div>

              <div className="border-2 border-dashed border-blue-300/80 rounded-2xl h-48 bg-slate-50/70 p-4 relative flex flex-col justify-between overflow-hidden select-none">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-36 h-20 border-t-2 border-x-2 border-dashed border-blue-200 rounded-t-full flex items-center justify-center opacity-60">
                  <span className="text-[10px] font-mono font-bold text-blue-600 mt-2">60° Hizası</span>
                </div>

                <div className="flex justify-end text-[10px] text-slate-400 font-mono">
                  m(O) = 60°
                </div>

                <div className="relative mt-auto pt-6 flex items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-100 shrink-0"></div>
                  <span className="absolute -bottom-5 left-0 font-bold text-blue-900 text-[11px]">O (Köşe)</span>
                  <div className="flex-1 h-0.5 bg-slate-800 ml-2 relative">
                    <span className="absolute right-0 -top-2 text-slate-800 text-xs">►</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Hedef Araç: <strong>İletki (Açıölçer)</strong></span>
              <span className="text-blue-700 font-bold">25 Puan</span>
            </div>
          </div>

          {/* İSTASYON 3: PERGEL */}
          <div className="bg-white rounded-3xl p-6 border-2 border-purple-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-purple-900 font-black text-sm">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm">
                    ⭕
                  </div>
                  <span>İSTASYON 3: PERGEL</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 font-bold text-[11px] border border-purple-200">
                  Çember & Selçuklu Motifi
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <strong>Yönerge:</strong> Pergelini <strong>4 cm</strong> aç. <code>'M'</code> merkezine batırarak tam bir çember çiz. Çember yayından merkeze doğru ikinci bir yay çizerek çiçek motifi oluştur.
              </div>

              <div className="border-2 border-dashed border-purple-300/80 rounded-2xl h-48 bg-slate-50/70 p-4 relative flex items-center justify-center select-none">
                <div className="w-28 h-28 rounded-full border-2 border-dashed border-purple-300/80 flex items-center justify-center relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-purple-600 ring-4 ring-purple-100"></div>
                  <span className="absolute -bottom-6 font-bold text-purple-900 text-[11px]">M (Merkez)</span>
                  <div className="absolute top-1/2 left-1/2 w-14 h-0.5 bg-purple-400 -translate-y-1/2 origin-left rotate-45 border-t border-dashed border-purple-600">
                    <span className="absolute -top-4 right-0 text-[9px] font-mono text-purple-700 font-bold">r = 4 cm</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Hedef Araç: <strong>Pergel (Çember Çizimi)</strong></span>
              <span className="text-purple-700 font-bold">25 Puan</span>
            </div>
          </div>

          {/* İSTASYON 4: GÖNYE */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-sm">
                    📐
                  </div>
                  <span>İSTASYON 4: GÖNYE</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200">
                  Dikme İndirme (⊥)
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <strong>Yönerge:</strong> Aşağıdaki <code>d</code> doğrusuna, dışındaki <code>P</code> noktasından gönye yardımıyla bir dikme indir. Diklik sembolünü (<code>⊥</code>) koy.
              </div>

              <div className="border-2 border-dashed border-amber-300/80 rounded-2xl h-48 bg-slate-50/70 p-4 relative flex flex-col justify-between overflow-hidden select-none">
                <div className="flex items-center gap-1.5 ml-12 mt-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-600 ring-4 ring-amber-100"></div>
                  <span className="font-black text-amber-900 text-xs">P (Dış Nokta)</span>
                </div>

                <div className="relative mt-auto mb-4">
                  <div className="w-full h-1 bg-slate-700 -rotate-3 transform origin-left"></div>
                  <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-slate-500">
                    <span>d doğrusu</span>
                    <span className="font-bold text-amber-800">[PH] ⊥ d (90°)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Hedef Araç: <strong>Gönye (Dik Açılı Çizim)</strong></span>
              <span className="text-amber-700 font-bold">25 Puan</span>
            </div>
          </div>

        </div>
      )}

      {/* 3. Bottom Next Step Banner (Go to Rubric) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black text-teal-800 uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Sıradaki Aşama: Öz Değerlendirme Rubriği</span>
          </div>
          <p className="text-xs text-slate-500">
            {isBridgeActivity
              ? 'Tarihi Köprü Restorasyonu adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi çizimlerinizi değerlendiriniz.'
              : 'Etkinlik kağıdındaki 4 inşa istasyonunu tamamladıktan sonra bir sonraki adıma geçerek kendi çizimlerinizi değerlendiriniz.'}
          </p>
        </div>

        {onGoToRubric && (
          <button
            type="button"
            onClick={() => {
              playSound('select');
              onGoToRubric();
            }}
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
          >
            <span>Öz Değerlendirme Formuna Geç</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Whiteboard Pure Read-Only Viewer Modal */}
      {fileRecord && (
        <WhiteboardViewerModal
          isOpen={viewerModalOpen}
          onClose={() => setViewerModalOpen(false)}
          file={fileRecord}
        />
      )}

      {/* Interactive Whiteboard Modal with File Loaded */}
      {fileRecord && (
        <WhiteboardModal
          isOpen={whiteboardModalOpen}
          onClose={() => setWhiteboardModalOpen(false)}
          initialFile={fileRecord}
          outcomeCode={outcomeCode}
          outcomeTitle={outcomeTitle}
          classSection="Tümü"
        />
      )}

    </div>
  );
}
