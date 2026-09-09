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
  BookOpen,
  RotateCcw
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

  const isAreaModelsActivity =
    selectedSheetId.includes('area-models') ||
    fileRecord?.id?.includes('area-models') ||
    fileRecord?.title?.includes('Alan Modelleri');

  const isRhythmicJumpsActivity =
    selectedSheetId.includes('rhythmic-jumps') ||
    fileRecord?.id?.includes('rhythmic-jumps') ||
    fileRecord?.title?.includes('Ritmik Sıçrama');

  const isRainbowCipherActivity =
    selectedSheetId.includes('rainbow-cipher') ||
    fileRecord?.id?.includes('rainbow-cipher') ||
    fileRecord?.title?.includes('Gökkuşağı Şifresi');

  const isTableHypothesisActivity =
    !isAreaModelsActivity &&
    !isRhythmicJumpsActivity &&
    !isRainbowCipherActivity &&
    (selectedSheetId.includes('table-hypothesis') ||
      fileRecord?.id?.includes('table-hypothesis') ||
      fileRecord?.title?.includes('Varsayım ve Tablo'));

  const isIntersectionChallengeActivity =
    !isTableHypothesisActivity &&
    (selectedSheetId.includes('intersection-challenge') ||
      fileRecord?.id?.includes('intersection-challenge') ||
      fileRecord?.title?.includes('Kavşak Şifresi'));

  const isLinesRelationsActivity =
    !isTableHypothesisActivity &&
    !isIntersectionChallengeActivity &&
    (selectedSheetId.includes('lines-relations') ||
      selectedSheetId.includes('5-3-4') ||
      fileRecord?.id?.includes('lines-relations') ||
      fileRecord?.title?.includes('Doğruların Birbirine Göre Durumları') ||
      (outcomeCode === 'MAT.5.3.4' &&
        !selectedSheetId.includes('table-hypothesis') &&
        !selectedSheetId.includes('intersection-challenge')));

  const isRailwayActivity =
    !isTableHypothesisActivity &&
    !isIntersectionChallengeActivity &&
    !isLinesRelationsActivity &&
    (selectedSheetId.includes('railway') ||
      fileRecord?.id?.includes('railway') ||
      fileRecord?.title?.includes('Tren Rayı'));

  const isBridgeActivity =
    !isTableHypothesisActivity &&
    !isIntersectionChallengeActivity &&
    !isLinesRelationsActivity &&
    !isRailwayActivity &&
    (selectedSheetId.includes('bridge') ||
      fileRecord?.id?.includes('bridge') ||
      fileRecord?.title?.includes('Köprü'));

  const isSteppingWorkshop =
    !isTableHypothesisActivity &&
    !isIntersectionChallengeActivity &&
    !isLinesRelationsActivity &&
    !isRailwayActivity &&
    !isBridgeActivity &&
    (selectedSheetId.includes('stepping') ||
      fileRecord?.id?.includes('stepping') ||
      fileRecord?.title?.includes('Adımlama'));

  const isErrorDetectiveActivity =
    !isTableHypothesisActivity &&
    !isIntersectionChallengeActivity &&
    !isLinesRelationsActivity &&
    !isRailwayActivity &&
    !isBridgeActivity &&
    !isSteppingWorkshop &&
    (selectedSheetId.includes('error-detective') ||
      selectedSheetId.includes('hata-dedektifi') ||
      fileRecord?.id?.includes('error-detective') ||
      fileRecord?.title?.includes('Hata Dedektifi'));

  const isAngleConstructionActivity =
    !isTableHypothesisActivity &&
    !isIntersectionChallengeActivity &&
    !isLinesRelationsActivity &&
    !isRailwayActivity &&
    !isBridgeActivity &&
    !isSteppingWorkshop &&
    !isErrorDetectiveActivity &&
    (selectedSheetId.includes('angle-construction') ||
      selectedSheetId.includes('rotani-kendin-ciz') ||
      fileRecord?.id?.includes('angle-construction') ||
      fileRecord?.title?.includes('Rotanı Kendin Çiz'));

  const isMeasuringStationsActivity =
    !isTableHypothesisActivity &&
    !isIntersectionChallengeActivity &&
    !isLinesRelationsActivity &&
    !isRailwayActivity &&
    !isBridgeActivity &&
    !isSteppingWorkshop &&
    !isErrorDetectiveActivity &&
    !isAngleConstructionActivity &&
    (selectedSheetId.includes('stations') ||
      fileRecord?.id?.includes('stations') ||
      fileRecord?.title?.includes('Açı Ölçüm İstasyonları'));

  const isProtractorAnatomyActivity =
    !isTableHypothesisActivity &&
    !isIntersectionChallengeActivity &&
    !isLinesRelationsActivity &&
    !isRailwayActivity &&
    !isBridgeActivity &&
    !isSteppingWorkshop &&
    !isErrorDetectiveActivity &&
    !isMeasuringStationsActivity &&
    !isAngleConstructionActivity &&
    (selectedSheetId.includes('anatomy') ||
      fileRecord?.id?.includes('anatomy') ||
      fileRecord?.title?.includes('İletkinin Anatomisi') ||
      (outcomeCode === 'MAT.5.3.3' &&
        !selectedSheetId.includes('stations') &&
        !selectedSheetId.includes('angle-construction') &&
        !selectedSheetId.includes('error-detective')));

  const isDeductionDetective =
    !isTableHypothesisActivity &&
    !isIntersectionChallengeActivity &&
    !isLinesRelationsActivity &&
    !isRailwayActivity &&
    !isBridgeActivity &&
    !isSteppingWorkshop &&
    !isErrorDetectiveActivity &&
    !isAngleConstructionActivity &&
    !isMeasuringStationsActivity &&
    !isProtractorAnatomyActivity &&
    (selectedSheetId.includes('deduction-detective') ||
      fileRecord?.id?.includes('5-3-2') ||
      fileRecord?.title?.includes('Çıkarım Dedektifi') ||
      (outcomeCode === 'MAT.5.3.2' &&
        !selectedSheetId.includes('stepping') &&
        !selectedSheetId.includes('railway')));

  // Interactive state for MAT.5.3.4 Varsayım ve Tablo Temsili
  const [tableHypoAnswers, setTableHypoAnswers] = useState<{
    egik_dar: string;
    egik_genis: string;
    egik_dik: string;
    dik_dar: string;
    dik_genis: string;
    dik_dik: string;
    paralel_dar: string;
    paralel_genis: string;
    paralel_dik: string;
    b1: string;
    b2: string;
    b3: string;
    b4: string;
  }>({
    egik_dar: '',
    egik_genis: '',
    egik_dik: '',
    dik_dar: '',
    dik_genis: '',
    dik_dik: '',
    paralel_dar: '',
    paralel_genis: '',
    paralel_dik: '',
    b1: '',
    b2: '',
    b3: '',
    b4: ''
  });
  const [tableHypoChecked, setTableHypoChecked] = useState<boolean>(false);
  const [tableHypoScore, setTableHypoScore] = useState<number>(0);
  const [tableHypoPointsAwarded, setTableHypoPointsAwarded] = useState<boolean>(false);

  const handleCheckTableHypo = () => {
    let score = 0;
    if (tableHypoAnswers.egik_dar.trim() === '2') score += 5.5;
    if (tableHypoAnswers.egik_genis.trim() === '2') score += 5.5;
    if (tableHypoAnswers.egik_dik.trim() === '0') score += 5.5;
    if (tableHypoAnswers.dik_dar.trim() === '0') score += 5.5;
    if (tableHypoAnswers.dik_genis.trim() === '0') score += 5.5;
    if (tableHypoAnswers.dik_dik.trim() === '4') score += 6;
    if (tableHypoAnswers.paralel_dar.trim() === '0') score += 5.5;
    if (tableHypoAnswers.paralel_genis.trim() === '0') score += 5.5;
    if (tableHypoAnswers.paralel_dik.trim() === '0') score += 5.5;

    if (tableHypoAnswers.b1 === 'mumkun') score += 12.5;
    if (tableHypoAnswers.b2 === 'mumkun') score += 12.5;
    if (tableHypoAnswers.b3 === 'mumkun') score += 12.5;
    if (tableHypoAnswers.b4 === 'imkansiz') score += 12.5;

    const finalScore = Math.min(100, Math.round(score));
    setTableHypoScore(finalScore);
    setTableHypoChecked(true);

    if (finalScore >= 75) {
      playSound('success');
      if (!tableHypoPointsAwarded) {
        addPoints(finalScore);
        setTableHypoPointsAwarded(true);
        if (finalScore === 100) {
          unlockBadge('maarif-genius');
        }
        try {
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      playSound('click');
    }
  };

  // Interactive state for MAT.5.3.4 Kavşak Şifresi ve Çıkarım Meydan Okuması
  const [kavsakAnswers, setKavsakAnswers] = useState<{
    q1_ters: string;
    q2_butunler: string;
    q3_toplam: string;
    p1: string;
    p2: string;
    p3: string;
    p4: string;
  }>({
    q1_ters: '',
    q2_butunler: '',
    q3_toplam: '',
    p1: '',
    p2: '',
    p3: '',
    p4: ''
  });
  const [kavsakChecked, setKavsakChecked] = useState<boolean>(false);
  const [kavsakScore, setKavsakScore] = useState<number>(0);
  const [kavsakPointsAwarded, setKavsakPointsAwarded] = useState<boolean>(false);

  const handleCheckKavsak = () => {
    let score = 0;
    if (kavsakAnswers.q1_ters.trim() === '50') score += 16.6;
    if (kavsakAnswers.q2_butunler.trim() === '130') score += 16.7;
    if (kavsakAnswers.q3_toplam.trim() === '360') score += 16.7;

    if (kavsakAnswers.p1 === 'D') score += 12.5;
    if (kavsakAnswers.p2 === 'D') score += 12.5;
    if (kavsakAnswers.p3 === 'D') score += 12.5;
    if (kavsakAnswers.p4 === 'Y') score += 12.5;

    const finalScore = Math.min(100, Math.round(score));
    setKavsakScore(finalScore);
    setKavsakChecked(true);

    if (finalScore >= 75) {
      playSound('success');
      if (!kavsakPointsAwarded) {
        addPoints(finalScore);
        setKavsakPointsAwarded(true);
        if (finalScore === 100) {
          unlockBadge('maarif-genius');
        }
        try {
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      playSound('click');
    }
  };

  // Interactive state for MAT.5.3.4 "DOĞRULARIN BİRBİRİNE GÖRE DURUMLARI"
  const [linesActiveTab, setLinesActiveTab] = useState<'overview' | 'intersecting' | 'perpendicular' | 'parallel' | 'transversal'>('overview');
  const [intersectingAngle, setIntersectingAngle] = useState<number>(60);
  const [parallelDistance, setParallelDistance] = useState<number>(45);
  const [transversalAngle, setTransversalAngle] = useState<number>(65);
  const [showRightAngles, setShowRightAngles] = useState<boolean>(true);
  const [highlightTransversalAngles, setHighlightTransversalAngles] = useState<'all' | 'alternate' | 'corresponding'>('all');
  const [linesAnswers, setLinesAnswers] = useState<{
    q1_angles: string;
    q1_points: string;
    q2_deg: string;
    q2_sym: string;
    q3_points: string;
    q3_sym: string;
    q4_name: string;
    q4_angles: string;
  }>({
    q1_angles: '',
    q1_points: '',
    q2_deg: '',
    q2_sym: '',
    q3_points: '',
    q3_sym: '',
    q4_name: '',
    q4_angles: ''
  });
  const [linesChecked, setLinesChecked] = useState<boolean>(false);
  const [linesScore, setLinesScore] = useState<number>(0);
  const [linesPointsAwarded, setLinesPointsAwarded] = useState<boolean>(false);

  const handleCheckLinesAnswers = () => {
    let score = 0;
    if (linesAnswers.q1_angles === '4') score += 12.5;
    if (linesAnswers.q1_points === '1') score += 12.5;
    if (linesAnswers.q2_deg === '90') score += 12.5;
    if (linesAnswers.q2_sym === 'perp') score += 12.5;
    if (linesAnswers.q3_points === '0') score += 12.5;
    if (linesAnswers.q3_sym === 'parallel') score += 12.5;
    if (linesAnswers.q4_name === 'kesen') score += 12.5;
    if (linesAnswers.q4_angles === '8') score += 12.5;

    const finalScore = Math.round(score);
    setLinesScore(finalScore);
    setLinesChecked(true);

    if (finalScore >= 75) {
      playSound('success');
      if (!linesPointsAwarded) {
        addPoints(finalScore);
        setLinesPointsAwarded(true);
        if (finalScore === 100) {
          unlockBadge('maarif-genius');
        }
        try {
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      playSound('click');
    }
  };

  // Interactive state for MAT.5.3.3 "HATA DEDEKTİFİ" VE ÖZ DEĞERLENDİRME
  const [detectiveError1Answer, setDetectiveError1Answer] = useState<string>('');
  const [detectiveError2Answer, setDetectiveError2Answer] = useState<string>('');
  const [detectiveNotes, setDetectiveNotes] = useState<string>('');
  const [detectiveCheckSubmitted, setDetectiveCheckSubmitted] = useState<boolean>(false);
  const [detectiveHighlight, setDetectiveHighlight] = useState<'all' | 'center' | 'scale'>('all');
  const [selfRatings, setSelfRatings] = useState<{ [key: number]: number }>({
    1: 0,
    2: 0,
    3: 0,
    4: 0
  });
  const [selfReflectionRule, setSelfReflectionRule] = useState<string>('');
  const [detectiveScoreAwarded, setDetectiveScoreAwarded] = useState<boolean>(false);

  // Interactive state for MAT.5.3.3 Rotanı Kendin Çiz (İletki ile Açı İnşası)
  const [task1Angle, setTask1Angle] = useState<number>(0);
  const [task1Color, setTask1Color] = useState<string>('#0284c7');
  const [showTask1Protractor, setShowTask1Protractor] = useState<boolean>(true);
  const [task1Completed, setTask1Completed] = useState<boolean>(false);

  const [task2Angle, setTask2Angle] = useState<number>(0);
  const [task2Color, setTask2Color] = useState<string>('#7c3aed');
  const [showTask2Protractor, setShowTask2Protractor] = useState<boolean>(true);
  const [task2Completed, setTask2Completed] = useState<boolean>(false);

  const [constructionChecklist, setConstructionChecklist] = useState<{
    c1: boolean;
    c2: boolean;
    c3: boolean;
    c4: boolean;
  }>({
    c1: false,
    c2: false,
    c3: false,
    c4: false
  });

  const [constructionPointsAwarded, setConstructionPointsAwarded] = useState<{ task1?: boolean; task2?: boolean }>({});

  const handleTask1AngleChange = (newDeg: number) => {
    setTask1Angle(newDeg);
    if (newDeg === 50 && !task1Completed) {
      setTask1Completed(true);
      playSound('success');
      if (!constructionPointsAwarded.task1) {
        addPoints(50);
        setConstructionPointsAwarded((p) => ({ ...p, task1: true }));
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      }
    }
  };

  const handleTask2AngleChange = (newDeg: number) => {
    setTask2Angle(newDeg);
    if (newDeg === 140 && !task2Completed) {
      setTask2Completed(true);
      playSound('success');
      if (!constructionPointsAwarded.task2) {
        addPoints(50);
        setConstructionPointsAwarded((p) => ({ ...p, task2: true }));
        unlockBadge('maarif-genius');
        try {
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    }
  };

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

  // Interactive state for MAT.5.3.3 Aşamalı Açı Ölçüm İstasyonları
  const [stationAInputs, setStationAInputs] = useState<{ a1: string; a2: string; a3: string }>({
    a1: '',
    a2: '',
    a3: ''
  });
  const [stationASubmitted, setStationASubmitted] = useState<{ a1?: boolean; a2?: boolean; a3?: boolean }>({});
  const [stationACorrect, setStationACorrect] = useState<{ a1?: boolean; a2?: boolean; a3?: boolean }>({});
  const [showProtractorA, setShowProtractorA] = useState<{ a1?: boolean; a2?: boolean; a3?: boolean }>({
    a1: true,
    a2: true,
    a3: true
  });

  const [stationBInputs, setStationBInputs] = useState<{ a4: string; a5: string }>({
    a4: '',
    a5: ''
  });
  const [stationBSubmitted, setStationBSubmitted] = useState<{ a4?: boolean; a5?: boolean }>({});
  const [stationBCorrect, setStationBCorrect] = useState<{ a4?: boolean; a5?: boolean }>({});
  const [protractorRotations, setProtractorRotations] = useState<{ a4: number; a5: number }>({
    a4: 0,
    a5: 0
  });
  const [showProtractorB, setShowProtractorB] = useState<{ a4?: boolean; a5?: boolean }>({
    a4: true,
    a5: true
  });

  const [estimateTable, setEstimateTable] = useState<{
    scissors: { type: string; est: string; measured: boolean };
    clock: { type: string; est: string; measured: boolean };
    roof: { type: string; est: string; measured: boolean };
  }>({
    scissors: { type: '', est: '', measured: false },
    clock: { type: '', est: '', measured: false },
    roof: { type: '', est: '', measured: false }
  });

  const [stationsPointsAwarded, setStationsPointsAwarded] = useState<{
    stationA?: boolean;
    stationB?: boolean;
    stationC?: boolean;
  }>({});

  const handleCheckStationA = (key: 'a1' | 'a2' | 'a3', expected: number) => {
    playSound('select');
    const val = parseInt(stationAInputs[key].trim(), 10);
    const isCorrect = val === expected;
    const nextSubmitted = { ...stationASubmitted, [key]: true };
    const nextCorrect = { ...stationACorrect, [key]: isCorrect };
    setStationASubmitted(nextSubmitted);
    setStationACorrect(nextCorrect);

    if (isCorrect) {
      playSound('success');
      const allCorrect =
        (key === 'a1' ? true : nextCorrect.a1) &&
        (key === 'a2' ? true : nextCorrect.a2) &&
        (key === 'a3' ? true : nextCorrect.a3);
      if (allCorrect && !stationsPointsAwarded.stationA) {
        addPoints(35);
        setStationsPointsAwarded((p) => ({ ...p, stationA: true }));
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      playSound('click');
    }
  };

  const handleCheckStationB = (key: 'a4' | 'a5', expected: number) => {
    playSound('select');
    const val = parseInt(stationBInputs[key].trim(), 10);
    const isCorrect = val === expected;
    const nextSubmitted = { ...stationBSubmitted, [key]: true };
    const nextCorrect = { ...stationBCorrect, [key]: isCorrect };
    setStationBSubmitted(nextSubmitted);
    setStationBCorrect(nextCorrect);

    if (isCorrect) {
      playSound('success');
      const allCorrect = (key === 'a4' ? true : nextCorrect.a4) && (key === 'a5' ? true : nextCorrect.a5);
      if (allCorrect && !stationsPointsAwarded.stationB) {
        addPoints(35);
        setStationsPointsAwarded((p) => ({ ...p, stationB: true }));
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      playSound('click');
    }
  };

  const handleMeasureStationC = (key: 'scissors' | 'clock' | 'roof') => {
    playSound('select');
    setEstimateTable((prev) => {
      const next = {
        ...prev,
        [key]: { ...prev[key], measured: true }
      };
      if (next.scissors.measured && next.clock.measured && next.roof.measured && !stationsPointsAwarded.stationC) {
        playSound('success');
        addPoints(30);
        setStationsPointsAwarded((p) => ({ ...p, stationC: true }));
        unlockBadge('maarif-genius');
        try {
          confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
        } catch (e) {}
      }
      return next;
    });
  };

  // Interactive state for MAT.5.3.3 İletkinin Anatomisi
  const [placedAnatomyLabels, setPlacedAnatomyLabels] = useState<Record<string, boolean>>({});
  const [selectedAnatomyLabelKey, setSelectedAnatomyLabelKey] = useState<string | null>(null);
  const [anatomyQuizAnswers, setAnatomyQuizAnswers] = useState<Record<number, string>>({});
  const [anatomyQuizSubmitted, setAnatomyQuizSubmitted] = useState<Record<number, boolean>>({});
  const [anatomyQuizStatus, setAnatomyQuizStatus] = useState<Record<number, boolean>>({});
  const [anatomyPointsAwarded, setAnatomyPointsAwarded] = useState<{ labels?: boolean; quiz?: boolean }>({});

  const handleSelectAnatomyLabel = (key: string) => {
    playSound('select');
    setSelectedAnatomyLabelKey(selectedAnatomyLabelKey === key ? null : key);
  };

  const handlePlaceAnatomyLabel = (slotKey: string) => {
    if (!selectedAnatomyLabelKey) {
      playSound('click');
      return;
    }
    if (selectedAnatomyLabelKey === slotKey) {
      playSound('success');
      const nextPlaced = { ...placedAnatomyLabels, [slotKey]: true };
      setPlacedAnatomyLabels(nextPlaced);
      setSelectedAnatomyLabelKey(null);

      // Check if all 4 labels are placed
      const count = Object.keys(nextPlaced).length;
      if (count === 4 && !anatomyPointsAwarded.labels) {
        addPoints(60);
        setAnatomyPointsAwarded((p) => ({ ...p, labels: true }));
        if (anatomyPointsAwarded.quiz) {
          unlockBadge('maarif-genius');
          try {
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          } catch (e) {}
        }
      }
    } else {
      playSound('click');
    }
  };

  const handleAnswerAnatomyQuiz = (qIdx: number, choice: string, correctChoice: string) => {
    playSound('select');
    setAnatomyQuizAnswers((prev) => ({ ...prev, [qIdx]: choice }));
    setAnatomyQuizSubmitted((prev) => ({ ...prev, [qIdx]: true }));
    const isCorrect = choice === correctChoice;
    setAnatomyQuizStatus((prev) => ({ ...prev, [qIdx]: isCorrect }));

    if (isCorrect) {
      playSound('success');
      const nextStatus = { ...anatomyQuizStatus, [qIdx]: true };
      if (nextStatus[0] && nextStatus[1] && nextStatus[2] && !anatomyPointsAwarded.quiz) {
        addPoints(40);
        setAnatomyPointsAwarded((p) => ({ ...p, quiz: true }));
        unlockBadge('maarif-genius');
        try {
          confetti({ particleCount: 100, spread: 85, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      playSound('click');
    }
  };

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
              const isTableHypo =
                sheet.id.includes('table-hypothesis') || sheet.title.includes('Varsayım ve Tablo');
              const isIntersectionChallenge =
                sheet.id.includes('intersection-challenge') || sheet.title.includes('Kavşak Şifresi');
              const isLinesRelations =
                (sheet.id.includes('lines-relations') ||
                  sheet.id.includes('5-3-4') ||
                  sheet.title.includes('Doğruların Birbirine Göre Durumları') ||
                  sheet.title.includes('Doğruların Durumları')) &&
                !isTableHypo &&
                !isIntersectionChallenge;
              const isErrorDetective =
                (sheet.id.includes('error-detective') || sheet.id.includes('hata-dedektifi') || sheet.title.includes('Hata Dedektifi')) && !isLinesRelations && !isTableHypo && !isIntersectionChallenge;
              const isDetective =
                (sheet.id.includes('5-3-2') || sheet.title.includes('Çıkarım')) && !isStepping && !isRailway && !isErrorDetective && !isLinesRelations && !isTableHypo && !isIntersectionChallenge;
              const isConstruction =
                (sheet.id.includes('angle-construction') || sheet.id.includes('rotani-kendin-ciz') || sheet.title.includes('Rotanı Kendin Çiz')) && !isErrorDetective && !isLinesRelations && !isTableHypo && !isIntersectionChallenge;
              const isStations =
                (sheet.id.includes('stations') || sheet.title.includes('İstasyon') || sheet.title.includes('Açı Ölçüm')) && !isConstruction && !isErrorDetective && !isLinesRelations && !isTableHypo && !isIntersectionChallenge;
              const isAnatomy =
                (sheet.id.includes('anatomy') || sheet.title.includes('İletkinin Anatomisi')) && !isStations && !isConstruction && !isErrorDetective && !isLinesRelations && !isTableHypo && !isIntersectionChallenge;
              const isActive = sheet.id === (fileRecord?.id || selectedSheetId);

              const icon = isTableHypo
                ? '📊'
                : isIntersectionChallenge
                ? '🚦'
                : isLinesRelations
                ? '📐'
                : isRailway
                ? '🚆'
                : isBridge
                ? '🏛️'
                : isStepping
                ? '⭕'
                : isErrorDetective
                ? '🕵️‍♂️'
                : isDetective
                ? '🔍'
                : isConstruction
                ? '🎯'
                : isStations
                ? '🧭'
                : isAnatomy
                ? '📐'
                : '📏';
              const title = isTableHypo
                ? 'Varsayım & Tablo Temsili'
                : isIntersectionChallenge
                ? 'Kavşak Şifresi & İspat'
                : isLinesRelations
                ? 'Doğruların Durumları'
                : isRailway
                ? 'Tren Rayı Mühendisliği'
                : isBridge
                ? 'Tarihi Köprü Restorasyonu'
                : isStepping
                ? 'Pergel ile Adımlama'
                : isErrorDetective
                ? 'Hata Dedektifi & Öz Değerlendirme'
                : isDetective
                ? 'Çıkarım Dedektifi'
                : isConstruction
                ? 'Rotanı Kendin Çiz'
                : isStations
                ? 'Açı Ölçüm İstasyonları'
                : isAnatomy
                ? 'İletkinin Anatomisi'
                : 'Aşamalı İnşa İstasyonları';

              const badge = isTableHypo
                ? 'Tablo Analizi'
                : isIntersectionChallenge
                ? 'Meydan Okuma'
                : isLinesRelations
                ? 'Gözlem & Sınıflandırma'
                : isRailway
                ? 'Büyük Görev'
                : isBridge
                ? 'Büyük Görev'
                : isStepping
                ? 'Atölye 2'
                : isErrorDetective
                ? 'Dedektiflik'
                : isDetective
                ? 'Etkinlik 1'
                : isConstruction
                ? 'Açı İnşası'
                : isStations
                ? 'Uygulama 2'
                : isAnatomy
                ? 'Aracı Tanıma'
                : `Etkinlik ${index + 1}`;

              const tag = isTableHypo
                ? 'İki ve Üç Doğru (6 Açı)'
                : isIntersectionChallenge
                ? '50° Ters & Komşu Bütünler'
                : isLinesRelations
                ? '4 Temel Durum (//, ⊥, Kesen)'
                : isRailway
                ? 'Gönye ile Paralel Doğru'
                : isBridge
                ? '4 Restorasyon Adımı'
                : isStepping
                ? 'Eşit Parçalar Kesme'
                : isErrorDetective
                ? '2 Büyük Hata & Rubrik'
                : isDetective
                ? '3 Deney Kutusu'
                : isConstruction
                ? '50° & 140° Hassas Çizim'
                : isStations
                ? '6 Ölçüm Kutusu & Radar'
                : isAnatomy
                ? 'Çift Ölçek Tuzağı'
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
                      ? isTableHypo
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md scale-[1.01]'
                        : isIntersectionChallenge
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md scale-[1.01]'
                        : isLinesRelations
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md scale-[1.01]'
                        : isRailway
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md scale-[1.01]'
                        : isBridge
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-[1.01]'
                        : isStepping
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md scale-[1.01]'
                        : isErrorDetective
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md scale-[1.01]'
                        : isDetective
                        ? 'bg-sky-600 text-white border-sky-500 shadow-md scale-[1.01]'
                        : isConstruction
                        ? 'bg-teal-600 text-white border-teal-500 shadow-md scale-[1.01]'
                        : isStations
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md scale-[1.01]'
                        : isAnatomy
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-[1.01]'
                        : 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-[1.01]'
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
          isTableHypothesisActivity
            ? 'bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950'
            : isIntersectionChallengeActivity
            ? 'bg-gradient-to-br from-rose-950 via-red-950 to-slate-950'
            : isLinesRelationsActivity
            ? 'bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950'
            : isRailwayActivity
            ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950'
            : isBridgeActivity
            ? 'bg-gradient-to-br from-amber-950 via-amber-900 to-slate-950'
            : isSteppingWorkshop
            ? 'bg-gradient-to-br from-purple-950 via-purple-900 to-slate-950'
            : isErrorDetectiveActivity
            ? 'bg-gradient-to-br from-rose-950 via-red-950 to-slate-950'
            : isDeductionDetective
            ? 'bg-gradient-to-br from-sky-950 via-sky-900 to-slate-950'
            : isAngleConstructionActivity
            ? 'bg-gradient-to-br from-teal-950 via-sky-950 to-slate-950'
            : isMeasuringStationsActivity
            ? 'bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950'
            : isProtractorAnatomyActivity
            ? 'bg-gradient-to-br from-teal-950 via-emerald-950 to-slate-950'
            : 'bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900'
        }`}
      >
        {/* Background Decorative Patterns */}
        <div
          className={`absolute right-0 top-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
            isTableHypothesisActivity
              ? 'bg-purple-500/20'
              : isIntersectionChallengeActivity
              ? 'bg-rose-500/20'
              : isLinesRelationsActivity
              ? 'bg-blue-500/20'
              : isRailwayActivity
              ? 'bg-indigo-500/20'
              : isBridgeActivity
              ? 'bg-amber-500/10'
              : isSteppingWorkshop
              ? 'bg-purple-500/15'
              : isErrorDetectiveActivity
              ? 'bg-rose-500/20'
              : isDeductionDetective
              ? 'bg-sky-500/15'
              : isAngleConstructionActivity
              ? 'bg-teal-500/20'
              : isMeasuringStationsActivity
              ? 'bg-blue-500/20'
              : isProtractorAnatomyActivity
              ? 'bg-teal-500/20'
              : 'bg-teal-500/10'
          }`}
        />
        <div
          className={`absolute left-1/3 bottom-0 w-64 h-64 rounded-full blur-2xl pointer-events-none ${
            isTableHypothesisActivity
              ? 'bg-indigo-500/20'
              : isIntersectionChallengeActivity
              ? 'bg-red-500/20'
              : isLinesRelationsActivity
              ? 'bg-indigo-500/20'
              : isRailwayActivity
              ? 'bg-amber-500/15'
              : isBridgeActivity
              ? 'bg-orange-500/10'
              : isSteppingWorkshop
              ? 'bg-indigo-500/20'
              : isErrorDetectiveActivity
              ? 'bg-red-500/20'
              : isDeductionDetective
              ? 'bg-indigo-500/15'
              : isAngleConstructionActivity
              ? 'bg-sky-500/20'
              : isMeasuringStationsActivity
              ? 'bg-indigo-500/20'
              : isProtractorAnatomyActivity
              ? 'bg-emerald-500/15'
              : 'bg-indigo-500/10'
          }`}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                isTableHypothesisActivity
                  ? 'bg-purple-400/20 border-purple-300/30 text-purple-200'
                  : isIntersectionChallengeActivity
                  ? 'bg-rose-400/20 border-rose-300/30 text-rose-200'
                  : isLinesRelationsActivity
                  ? 'bg-blue-400/20 border-blue-300/30 text-blue-200'
                  : isRailwayActivity
                  ? 'bg-indigo-400/20 border-indigo-300/30 text-indigo-200'
                  : isBridgeActivity
                  ? 'bg-amber-400/20 border-amber-300/30 text-amber-200'
                  : isSteppingWorkshop
                  ? 'bg-purple-400/20 border-purple-300/30 text-purple-200'
                  : isErrorDetectiveActivity
                  ? 'bg-rose-400/20 border-rose-300/30 text-rose-200'
                  : isDeductionDetective
                  ? 'bg-sky-400/20 border-sky-300/30 text-sky-200'
                  : isAngleConstructionActivity
                  ? 'bg-teal-400/20 border-teal-300/30 text-teal-200'
                  : isMeasuringStationsActivity
                  ? 'bg-blue-400/20 border-blue-300/30 text-blue-200'
                  : isProtractorAnatomyActivity
                  ? 'bg-teal-400/20 border-teal-300/30 text-teal-200'
                  : 'bg-teal-400/20 border-teal-300/30 text-teal-200'
              }`}
            >
              {isTableHypothesisActivity ? (
                <>
                  <Layers className="w-3.5 h-3.5 text-purple-300" />
                  <span>Varsayım & Tablo Temsili (4. Hafta - MAT.5.3.4)</span>
                </>
              ) : isIntersectionChallengeActivity ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                  <span>Kavşak Şifresi & Mantıksal Çıkarım (4. Hafta - MAT.5.3.4)</span>
                </>
              ) : isLinesRelationsActivity ? (
                <>
                  <Layers className="w-3.5 h-3.5 text-blue-300" />
                  <span>Gözlem & Sınıflandırma (4. Hafta - MAT.5.3.4)</span>
                </>
              ) : isRailwayActivity ? (
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
              ) : isErrorDetectiveActivity ? (
                <>
                  <Search className="w-3.5 h-3.5 text-rose-300" />
                  <span>Eleştirel Düşünme & Hata Analizi (SDB1.2 / SB1.1)</span>
                </>
              ) : isDeductionDetective ? (
                <>
                  <Search className="w-3.5 h-3.5 text-sky-300" />
                  <span>Gözlem & Mantıksal Çıkarım (SDB3.3 / E3.7)</span>
                </>
              ) : isAngleConstructionActivity ? (
                <>
                  <Compass className="w-3.5 h-3.5 text-teal-300" />
                  <span>Hassas Açı İnşası & İletki Becerisi (SDB1.2 / SB1.1)</span>
                </>
              ) : isMeasuringStationsActivity ? (
                <>
                  <Compass className="w-3.5 h-3.5 text-blue-300" />
                  <span>Uygulama & Ölçme Becerisi (SDB1.2 / SB1.1)</span>
                </>
              ) : isProtractorAnatomyActivity ? (
                <>
                  <Compass className="w-3.5 h-3.5 text-teal-300" />
                  <span>Aracı Tanıma & Ölçme Becerisi (SDB1.2 / SB1.1)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Süreç Değerlendirme & Geometrik İnşa İstasyonları</span>
                </>
              )}
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {isTableHypothesisActivity
                ? 'Etkinlik: "VARSAYIM VE TABLO TEMSİLİ" (İki ve Üç Doğru Analizi)'
                : isIntersectionChallengeActivity
                ? 'Etkinlik: "KAVŞAK ŞİFRESİ VE ÇIKARIM MEYDAN OKUMASI"'
                : isLinesRelationsActivity
                ? 'Etkinlik: "DOĞRULARIN BİRBİRİNE GÖRE DURUMLARI" (Gözlem ve Sınıflandırma)'
                : isRailwayActivity
                ? 'Büyük Görev: "TREN RAYI MÜHENDİSLİĞİ" (Gönye ile Paralel Doğru İnşası)'
                : isBridgeActivity
                ? 'Büyük Görev: Tarihi Köprü Restorasyonu'
                : isSteppingWorkshop
                ? 'Atölye: "PERGEL İLE ADIMLAMA" (Eşit Parçalar Kesme)'
                : isErrorDetectiveActivity
                ? 'Etkinlik: "HATA DEDEKTİFİ" VE ÖZ DEĞERLENDİRME'
                : isDeductionDetective
                ? 'Etkinlik: "ÇIKARIM DEDEKTİFİ" (Gözlem ve Temel Kurallar)'
                : isAngleConstructionActivity
                ? 'Etkinlik: "ROTANI KENDİN ÇİZ" (İletki ile Açı İnşası)'
                : isMeasuringStationsActivity
                ? 'Etkinlik: "AŞAMALI AÇI ÖLÇÜM İSTASYONLARI" (Uygulama - MAT.5.3.3)'
                : isProtractorAnatomyActivity
                ? 'Etkinlik: "İLETKİNİN ANATOMİSİ" (Aracı Tanıma & Çift Ölçek Tuzağı)'
                : 'Etkinlik 1: Aşamalı İnşa İstasyonları'}
            </h2>
            
            {/* Kurgu Paneli / Açıklama */}
            {isTableHypothesisActivity ? (
              <div className="p-3 bg-purple-950/60 border border-purple-500/40 rounded-2xl backdrop-blur-sm">
                <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
                  📊 <strong>Tablo &amp; Mantık Analizi:</strong> &ldquo;İki ve üç doğrunun kesişim durumlarını incele, açı sayılarını tabloya yerleştir ve 6 açı bölgesi için olası durumları (Mümkün/İmkânsız) kanıtla!&rdquo;
                </p>
              </div>
            ) : isIntersectionChallengeActivity ? (
              <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-2xl backdrop-blur-sm">
                <p className="text-xs sm:text-sm text-rose-100 font-medium leading-relaxed">
                  🚦 <strong>Kavşak Açı Meydan Okuması:</strong> &ldquo;50°'lik kavşak açısını baz alarak ters açıyı, komşu bütünler açıyı ve 360°'lik tam açıyı çöz, çıkarım önermelerini değerlendir!&rdquo;
                </p>
              </div>
            ) : isLinesRelationsActivity ? (
              <div className="p-3 bg-blue-950/60 border border-blue-500/40 rounded-2xl backdrop-blur-sm">
                <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
                  📐 <strong>Doğruların Konum Rehberi:</strong> &ldquo;Düzlemde iki veya üç doğrunun birbirine göre durumlarını inceleyerek ortak nokta sayılarını, açı özelliklerini ve matematiksel sembollerini keşfet!&rdquo;
                </p>
              </div>
            ) : isRailwayActivity ? (
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
            ) : isErrorDetectiveActivity ? (
              <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-2xl backdrop-blur-sm">
                <p className="text-xs sm:text-sm text-rose-100 font-medium leading-relaxed">
                  🕵️‍♂️ <strong>Dedektiflik Görevi:</strong> Yanlış ölçüm yapan öğrencinin çizimini incele, 2 büyük ölçüm hatasını (merkez kayması ve ters ölçek tuzağı) tespit et ve öz değerlendirme kontrolünü tamamla!
                </p>
              </div>
            ) : isDeductionDetective ? (
              <div className="p-3 bg-sky-950/60 border border-sky-500/40 rounded-2xl backdrop-blur-sm">
                <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
                  🕵️‍♂️ <strong>Dedektif Görevi:</strong> Verilen 3 geometrik durumu incele, cetvel, pergel ve gönye ile deneylerini gerçekleştir ve temel aksiyom çıkarımlarını tamamla!
                </p>
              </div>
            ) : isAngleConstructionActivity ? (
              <div className="p-3 bg-teal-950/60 border border-teal-500/40 rounded-2xl backdrop-blur-sm">
                <p className="text-xs sm:text-sm text-teal-100 font-medium leading-relaxed">
                  🧭 <strong>İnşa Görevi:</strong> Verilen başlangıç ışınları üzerinde iletkinin merkezini hizalayarak tam 50°'lik dar açıyı ve 140°'lik geniş açıyı sıfırdan inşa et!
                </p>
              </div>
            ) : isMeasuringStationsActivity ? (
              <div className="p-3 bg-blue-950/60 border border-blue-500/40 rounded-2xl backdrop-blur-sm">
                <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
                  🧭 <strong>İstasyon Görevi:</strong> Farklı yönlere bakan 6 açıyı iletki ile ölç, dönen radarları kol hizasına göre ayarla ve tahminlerini gerçek ölçümlerle karşılaştır!
                </p>
              </div>
            ) : isProtractorAnatomyActivity ? (
              <div className="p-3 bg-teal-950/60 border border-teal-500/40 rounded-2xl backdrop-blur-sm">
                <p className="text-xs sm:text-sm text-teal-100 font-medium leading-relaxed">
                  📐 <strong>Etkinlik Görevi:</strong> Açıölçerin 4 kritik parçasını şema üzerinde etiketle ve çift ölçek tuzağına düşmeden açıları doğru oku!
                </p>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed">
                Öğrencilerin cetvel, iletki, pergel ve gönye araçlarını kullanarak temel geometrik yapıları inşa etme ve çıkarım yapma becerilerini pekiştiren 4 mini istasyon çalışmasıdır.
              </p>
            )}

            <div
              className={`flex items-center gap-3 pt-2 text-[11px] font-mono ${
                isTableHypothesisActivity
                  ? 'text-purple-200/70'
                  : isIntersectionChallengeActivity
                  ? 'text-rose-200/70'
                  : isLinesRelationsActivity
                  ? 'text-blue-200/70'
                  : isRailwayActivity
                  ? 'text-indigo-200/70'
                  : isBridgeActivity
                  ? 'text-amber-200/70'
                  : isSteppingWorkshop
                  ? 'text-purple-200/70'
                  : isErrorDetectiveActivity
                  ? 'text-rose-200/70'
                  : isDeductionDetective
                  ? 'text-sky-200/70'
                  : isAngleConstructionActivity
                  ? 'text-teal-200/70'
                  : isMeasuringStationsActivity
                  ? 'text-blue-200/70'
                  : isProtractorAnatomyActivity
                  ? 'text-teal-200/70'
                  : 'text-teal-200/70'
              }`}
            >
              <span>{outcomeCode}</span>
              <span>•</span>
              <span>
                {isTableHypothesisActivity
                  ? 'Tablo & 4 Hipotez (100 Puan)'
                  : isIntersectionChallengeActivity
                  ? '3 Hesaplama & 4 Önerme (100 Puan)'
                  : isLinesRelationsActivity
                  ? '4 Doğru Durumu & Sınıflandırma (100 Puan)'
                  : isRailwayActivity
                  ? '3 İnşa Adımı (100 Puan)'
                  : isBridgeActivity
                  ? '4 Restorasyon Adımı (100 Puan)'
                  : isSteppingWorkshop
                  ? '2 Ana Görev (100 Puan)'
                  : isErrorDetectiveActivity
                  ? 'Dedektiflik & Öz Değerlendirme (100 Puan)'
                  : isDeductionDetective
                  ? '3 Mini Deney (100 Puan)'
                  : isAngleConstructionActivity
                  ? '2 Açı İnşası (100 Puan)'
                  : isMeasuringStationsActivity
                  ? '3 İstasyon & 6 Açı (100 Puan)'
                  : isProtractorAnatomyActivity
                  ? '4 Parça & Çift Ölçek (100 Puan)'
                  : '4 İstasyon (100 Puan)'}
              </span>
              <span>•</span>
              <span>
                {isTableHypothesisActivity
                  ? 'İki ve Üç Doğru (6 Açı)'
                  : isIntersectionChallengeActivity
                  ? '50° Ters & Bütünler Açılar'
                  : isLinesRelationsActivity
                  ? 'd // k, ⊥, Kesen'
                  : isRailwayActivity
                  ? 'd // k Paralel Doğrular'
                  : isBridgeActivity
                  ? 'Geniş Milimetrik Grid'
                  : isSteppingWorkshop
                  ? 'Pergel ile Mesafe Koruma'
                  : isErrorDetectiveActivity
                  ? '2 Büyük Hata & Rubrik Kontrolü'
                  : isDeductionDetective
                  ? 'Aksiyom & Mantıksal Çıkarım'
                  : isProtractorAnatomyActivity
                  ? '180° Standart Açıölçer'
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
                  isTableHypothesisActivity
                    ? 'text-purple-300'
                    : isIntersectionChallengeActivity
                    ? 'text-rose-300'
                    : isLinesRelationsActivity
                    ? 'text-blue-300'
                    : isRailwayActivity
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
                isTableHypothesisActivity
                  ? 'bg-purple-400 hover:bg-purple-300 text-slate-950 shadow-purple-500/20'
                  : isIntersectionChallengeActivity
                  ? 'bg-rose-400 hover:bg-rose-300 text-slate-950 shadow-rose-500/20'
                  : isLinesRelationsActivity
                  ? 'bg-blue-400 hover:bg-blue-300 text-slate-950 shadow-blue-500/20'
                  : isRailwayActivity
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
                      isTableHypothesisActivity
                        ? 'text-purple-400'
                        : isIntersectionChallengeActivity
                        ? 'text-rose-400'
                        : isLinesRelationsActivity
                        ? 'text-blue-400'
                        : isRailwayActivity
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
                Dikmelerin tepe noktalarını (<code>A', B', C'</code>) cetvelle birleştirerek yeni bir <code>k</code> doğrusu çiz (<code>d // k</code>).
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
                      d // k (Paralel)
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
                  <span className="font-bold text-xs">B) Paralel Doğrular (d // k)</span>
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
                    ? 'Bir doğru üzerindeki noktalardan aynı yöne çıkılan eşit uzunluktaki dikmelerin (h = 4 br) uç noktaları birleştirildiğinde elde edilen doğru, ilk doğruya PARALELDİR (d // k). Aralarındaki dik uzaklık sabit olduğu için sonsuza kadar uzatılsalar bile hiçbir zaman kesişmezler!'
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
      ) : isTableHypothesisActivity ? (
        /* ========================================================================= */
        /* ETKİNLİK: "VARSAYIM VE TABLO TEMSİLİ (İki ve Üç Doğru Analizi)" (MAT.5.3.4)*/
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Üst Kontrol ve Başlık Paneli */}
          <div className="bg-slate-900 border-2 border-purple-500/50 rounded-3xl p-6 shadow-xl space-y-4 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-2xl">📊</span>
                <span className="text-base sm:text-lg font-black text-white tracking-wide">
                  VARSAYIM VE TABLO TEMSİLİ: &ldquo;İKİ VE ÜÇ DOĞRU ANALİZİ&rdquo;
                </span>
                <span className="bg-purple-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-purple-400">
                  4. Hafta • MAT.5.3.4
                </span>
              </div>
              <div className="flex items-center gap-3">
                {tableHypoChecked && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tableHypoScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-amber-500/20 text-amber-300 border-amber-500/50'}`}>
                    Başarı Puanı: %{Math.round(tableHypoScore)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleCheckTableHypo}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{tableHypoChecked ? 'Yeniden Değerlendir' : 'Tablo ve Varsayımları Kontrol Et'}</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Doğruların düzlemdeki kesişim durumlarını matematiksel olarak modelleyiniz. İki doğrunun kesişim açılarını tabloya doldurunuz; ardından tek bir merkezde kesişen üç doğrunun oluşturduğu 6 açıyı hipotezlerle analiz ediniz.
            </p>
          </div>

          {/* BÖLÜM A: İKİ DOĞRUNUN KESİŞİMİ TABLOSU */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-purple-500/30 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-black text-xs">
                    A
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    İki Doğrunun Kesişimi Durumu (Açı Çeşitleri Tablosu)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Aşağıdaki üç duruma ait oluşan açı sayılarını kutucuklara yazınız:
                </p>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Tablo Değeri: 50 Puan
              </span>
            </div>

            {/* Tablo Grid */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-purple-50/80 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-black border-b-2 border-purple-200 dark:border-purple-800">
                    <th className="p-3 text-left">Kesişim Durumu</th>
                    <th className="p-3 text-center">Dar Açı Sayısı</th>
                    <th className="p-3 text-center">Geniş Açı Sayısı</th>
                    <th className="p-3 text-center">Dik Açı Sayısı (90°)</th>
                    <th className="p-3 text-center">Toplam Açı Sayısı</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                  {/* Satır 1: Eğik Kesişme */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span>1. Eğik Kesişme</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="text"
                        maxLength={2}
                        value={tableHypoAnswers.egik_dar}
                        onChange={(e) => setTableHypoAnswers({ ...tableHypoAnswers, egik_dar: e.target.value })}
                        placeholder="..."
                        className={`w-14 h-9 text-center rounded-lg border font-black text-sm transition-all ${
                          tableHypoChecked
                            ? tableHypoAnswers.egik_dar.trim() === '2'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-purple-500'
                        }`}
                      />
                      {tableHypoChecked && tableHypoAnswers.egik_dar.trim() !== '2' && (
                        <div className="text-[10px] font-bold text-rose-600 mt-1">Doğru: 2</div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="text"
                        maxLength={2}
                        value={tableHypoAnswers.egik_genis}
                        onChange={(e) => setTableHypoAnswers({ ...tableHypoAnswers, egik_genis: e.target.value })}
                        placeholder="..."
                        className={`w-14 h-9 text-center rounded-lg border font-black text-sm transition-all ${
                          tableHypoChecked
                            ? tableHypoAnswers.egik_genis.trim() === '2'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-purple-500'
                        }`}
                      />
                      {tableHypoChecked && tableHypoAnswers.egik_genis.trim() !== '2' && (
                        <div className="text-[10px] font-bold text-rose-600 mt-1">Doğru: 2</div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="text"
                        maxLength={2}
                        value={tableHypoAnswers.egik_dik}
                        onChange={(e) => setTableHypoAnswers({ ...tableHypoAnswers, egik_dik: e.target.value })}
                        placeholder="..."
                        className={`w-14 h-9 text-center rounded-lg border font-black text-sm transition-all ${
                          tableHypoChecked
                            ? tableHypoAnswers.egik_dik.trim() === '0'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-purple-500'
                        }`}
                      />
                      {tableHypoChecked && tableHypoAnswers.egik_dik.trim() !== '0' && (
                        <div className="text-[10px] font-bold text-rose-600 mt-1">Doğru: 0</div>
                      )}
                    </td>
                    <td className="p-3 text-center font-black text-sm text-slate-700 dark:text-slate-300">
                      4
                    </td>
                  </tr>

                  {/* Satır 2: Dik Kesişme */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>2. Dik Kesişme (⊥)</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="text"
                        maxLength={2}
                        value={tableHypoAnswers.dik_dar}
                        onChange={(e) => setTableHypoAnswers({ ...tableHypoAnswers, dik_dar: e.target.value })}
                        placeholder="..."
                        className={`w-14 h-9 text-center rounded-lg border font-black text-sm transition-all ${
                          tableHypoChecked
                            ? tableHypoAnswers.dik_dar.trim() === '0'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-purple-500'
                        }`}
                      />
                      {tableHypoChecked && tableHypoAnswers.dik_dar.trim() !== '0' && (
                        <div className="text-[10px] font-bold text-rose-600 mt-1">Doğru: 0</div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="text"
                        maxLength={2}
                        value={tableHypoAnswers.dik_genis}
                        onChange={(e) => setTableHypoAnswers({ ...tableHypoAnswers, dik_genis: e.target.value })}
                        placeholder="..."
                        className={`w-14 h-9 text-center rounded-lg border font-black text-sm transition-all ${
                          tableHypoChecked
                            ? tableHypoAnswers.dik_genis.trim() === '0'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-purple-500'
                        }`}
                      />
                      {tableHypoChecked && tableHypoAnswers.dik_genis.trim() !== '0' && (
                        <div className="text-[10px] font-bold text-rose-600 mt-1">Doğru: 0</div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="text"
                        maxLength={2}
                        value={tableHypoAnswers.dik_dik}
                        onChange={(e) => setTableHypoAnswers({ ...tableHypoAnswers, dik_dik: e.target.value })}
                        placeholder="..."
                        className={`w-14 h-9 text-center rounded-lg border font-black text-sm transition-all ${
                          tableHypoChecked
                            ? tableHypoAnswers.dik_dik.trim() === '4'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-purple-500'
                        }`}
                      />
                      {tableHypoChecked && tableHypoAnswers.dik_dik.trim() !== '4' && (
                        <div className="text-[10px] font-bold text-rose-600 mt-1">Doğru: 4</div>
                      )}
                    </td>
                    <td className="p-3 text-center font-black text-sm text-slate-700 dark:text-slate-300">
                      4
                    </td>
                  </tr>

                  {/* Satır 3: Paralel Olma */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>3. Paralel Olma (//)</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="text"
                        maxLength={2}
                        value={tableHypoAnswers.paralel_dar}
                        onChange={(e) => setTableHypoAnswers({ ...tableHypoAnswers, paralel_dar: e.target.value })}
                        placeholder="..."
                        className={`w-14 h-9 text-center rounded-lg border font-black text-sm transition-all ${
                          tableHypoChecked
                            ? tableHypoAnswers.paralel_dar.trim() === '0'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-purple-500'
                        }`}
                      />
                      {tableHypoChecked && tableHypoAnswers.paralel_dar.trim() !== '0' && (
                        <div className="text-[10px] font-bold text-rose-600 mt-1">Doğru: 0</div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="text"
                        maxLength={2}
                        value={tableHypoAnswers.paralel_genis}
                        onChange={(e) => setTableHypoAnswers({ ...tableHypoAnswers, paralel_genis: e.target.value })}
                        placeholder="..."
                        className={`w-14 h-9 text-center rounded-lg border font-black text-sm transition-all ${
                          tableHypoChecked
                            ? tableHypoAnswers.paralel_genis.trim() === '0'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-purple-500'
                        }`}
                      />
                      {tableHypoChecked && tableHypoAnswers.paralel_genis.trim() !== '0' && (
                        <div className="text-[10px] font-bold text-rose-600 mt-1">Doğru: 0</div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="text"
                        maxLength={2}
                        value={tableHypoAnswers.paralel_dik}
                        onChange={(e) => setTableHypoAnswers({ ...tableHypoAnswers, paralel_dik: e.target.value })}
                        placeholder="..."
                        className={`w-14 h-9 text-center rounded-lg border font-black text-sm transition-all ${
                          tableHypoChecked
                            ? tableHypoAnswers.paralel_dik.trim() === '0'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-purple-500'
                        }`}
                      />
                      {tableHypoChecked && tableHypoAnswers.paralel_dik.trim() !== '0' && (
                        <div className="text-[10px] font-bold text-rose-600 mt-1">Doğru: 0</div>
                      )}
                    </td>
                    <td className="p-3 text-center font-black text-sm text-slate-700 dark:text-slate-300">
                      0
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* BÖLÜM B: ÜÇ DOĞRUNUN TEK MERKEZDE KESİŞİMİ */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-indigo-500/30 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-black text-xs">
                    B
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Üç Doğrunun Tek Bir Noktada Kesişimi Durumu (6 Açı Bölgesi)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Üç doğru aynı merkez noktadan (O) geçtiğinde 6 açı bölgesi oluşur. Durumların gerçekleşebilirliğini seçiniz:
                </p>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Mantıksal Çıkarım: 50 Puan
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Sol: 6 Açı SVG Modeli */}
              <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                <div className="w-full max-w-[280px] aspect-square relative">
                  <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible">
                    <circle cx="120" cy="120" r="100" fill="none" stroke="#cbd5e1" strokeDasharray="3 3" />
                    
                    {/* Doğru 1 (d1 - Yatay) */}
                    <line x1="20" y1="120" x2="220" y2="120" stroke="#6366f1" strokeWidth="2.5" />
                    <text x="225" y="124" fontSize="11" fontWeight="bold" fill="#6366f1">d₁</text>

                    {/* Doğru 2 (d2 - 60 derece) */}
                    <line x1="70" y1="33" x2="170" y2="207" stroke="#a855f7" strokeWidth="2.5" />
                    <text x="175" y="215" fontSize="11" fontWeight="bold" fill="#a855f7">d₂</text>

                    {/* Doğru 3 (d3 - 120 derece) */}
                    <line x1="170" y1="33" x2="70" y2="207" stroke="#ec4899" strokeWidth="2.5" />
                    <text x="65" y="220" fontSize="11" fontWeight="bold" fill="#ec4899">d₃</text>

                    {/* Merkez O */}
                    <circle cx="120" cy="120" r="4.5" fill="#1e293b" />
                    <text x="127" y="115" fontSize="11" fontWeight="bold" fill="#1e293b">O</text>

                    {/* 6 Açı Numaraları */}
                    <text x="145" y="95" fontSize="10" fontWeight="bold" fill="#4f46e5">1</text>
                    <text x="120" y="80" fontSize="10" fontWeight="bold" fill="#4f46e5">2</text>
                    <text x="95" y="95" fontSize="10" fontWeight="bold" fill="#4f46e5">3</text>
                    <text x="95" y="150" fontSize="10" fontWeight="bold" fill="#4f46e5">4</text>
                    <text x="120" y="165" fontSize="10" fontWeight="bold" fill="#4f46e5">5</text>
                    <text x="145" y="150" fontSize="10" fontWeight="bold" fill="#4f46e5">6</text>
                  </svg>
                </div>
                <div className="mt-2 text-center text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  6 Açının Toplamı = 360° (Tam Açı)
                </div>
              </div>

              {/* Sağ: 4 Hipotez Seçenek Kartı */}
              <div className="lg:col-span-7 space-y-3">
                {[
                  {
                    id: 'b1',
                    text: '1. 6 adet dar açı oluşması',
                    correct: 'mumkun',
                    proof: 'Mümkündür. Örneğin 6 açının her biri 60° olabilir (6 × 60° = 360°).'
                  },
                  {
                    id: 'b2',
                    text: '2. 2 geniş açı ve 4 dar açı oluşması',
                    correct: 'mumkun',
                    proof: 'Mümkündür. Örneğin 2 adet 120° (240°) ve 4 adet 30° (120°) → Toplam 360°.'
                  },
                  {
                    id: 'b3',
                    text: '3. 2 dik açı ve 4 dar açı oluşması',
                    correct: 'mumkun',
                    proof: 'Mümkündür. Örneğin 2 adet 90° (180°) ve 4 adet 45° (180°) → Toplam 360°.'
                  },
                  {
                    id: 'b4',
                    text: '4. 6 adet geniş açı oluşması',
                    correct: 'imkansiz',
                    proof: 'İmkânsızdır! Geniş açı >90° olduğundan 6 geniş açının toplamı >540° olur ve 360°’yi aşar.'
                  }
                ].map((item) => {
                  const currentVal = tableHypoAnswers[item.id as keyof typeof tableHypoAnswers];
                  const isCorrect = currentVal === item.correct;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        tableHypoChecked
                          ? isCorrect
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-400'
                            : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-400'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {item.text}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              playSound('select');
                              setTableHypoAnswers({ ...tableHypoAnswers, [item.id]: 'mumkun' });
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                              currentVal === 'mumkun'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            Mümkün
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playSound('select');
                              setTableHypoAnswers({ ...tableHypoAnswers, [item.id]: 'imkansiz' });
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                              currentVal === 'imkansiz'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            İmkânsız
                          </button>
                        </div>
                      </div>

                      {tableHypoChecked && (
                        <div className={`mt-2 pt-2 border-t text-[11px] font-semibold flex items-center gap-1.5 ${isCorrect ? 'border-emerald-200 text-emerald-800 dark:text-emerald-300' : 'border-rose-200 text-rose-800 dark:text-rose-300'}`}>
                          <span>{isCorrect ? '✓ Doğru:' : '✗ Açıklama:'}</span>
                          <span>{item.proof}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : isIntersectionChallengeActivity ? (
        /* ========================================================================= */
        /* ETKİNLİK: "KAVŞAK ŞİFRESİ VE ÇIKARIM MEYDAN OKUMASI" (MAT.5.3.4)          */
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Üst Kontrol ve Başlık Paneli */}
          <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 shadow-xl space-y-4 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-2xl">🚦</span>
                <span className="text-base sm:text-lg font-black text-white tracking-wide">
                  KAVŞAK ŞİFRESİ: &ldquo;ÇIKARIM MEYDAN OKUMASI&rdquo;
                </span>
                <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-rose-400">
                  4. Hafta • MAT.5.3.4
                </span>
              </div>
              <div className="flex items-center gap-3">
                {kavsakChecked && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${kavsakScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-amber-500/20 text-amber-300 border-amber-500/50'}`}>
                    Puan: %{Math.round(kavsakScore)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleCheckKavsak}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{kavsakChecked ? 'Yeniden Değerlendir' : 'Şifreyi ve Önermeleri Kontrol Et'}</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kavşakta kesişen iki caddenin oluşturduğu açıları ters açı ve komşu bütünler açı kurallarıyla çözünüz. Ardından geometrik çıkarım önermelerini Doğru (D) veya Yanlış (Y) olarak değerlendiriniz.
            </p>
          </div>

          {/* BÖLÜM 1: KAVŞAK MODELİ VE AÇI HESAPLARI */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-rose-500/30 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center justify-center font-black text-xs">
                    1
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Kavşak Açısı Analizi (50° Modeli)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Şehir kavşağında kesişen iki yoldan bir açının ölçüsü 50° olarak verilmiştir.
                </p>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                50 Puan
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Sol: İnteraktif Kavşak SVG */}
              <div className="lg:col-span-5 bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col items-center shadow-inner">
                <div className="w-full max-w-[280px] aspect-square relative">
                  <svg viewBox="0 0 260 260" className="w-full h-full overflow-visible">
                    {/* Yollar (Gri asfalt) */}
                    <line x1="30" y1="60" x2="230" y2="200" stroke="#334155" strokeWidth="32" strokeLinecap="round" />
                    <line x1="30" y1="200" x2="230" y2="60" stroke="#334155" strokeWidth="32" strokeLinecap="round" />
                    
                    {/* Yol Şeritleri (Sarı kesikli) */}
                    <line x1="30" y1="60" x2="230" y2="200" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 6" />
                    <line x1="30" y1="200" x2="230" y2="60" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 6" />

                    {/* Cadde İsimleri */}
                    <text x="35" y="45" fontSize="10" fontWeight="bold" fill="#94a3b8">Atatürk Cd.</text>
                    <text x="210" y="45" fontSize="10" fontWeight="bold" fill="#94a3b8">Cumhuriyet Cd.</text>

                    {/* Merkez Noktası O */}
                    <circle cx="130" cy="130" r="5" fill="#f8fafc" />
                    <text x="138" y="134" fontSize="12" fontWeight="bold" fill="#f8fafc">O</text>

                    {/* Üst Açı: 50° */}
                    <path d="M 112 112 A 25 25 0 0 1 148 112" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <g transform="translate(130, 95)">
                      <rect x="-24" y="-10" width="48" height="20" rx="6" fill="#f43f5e" />
                      <text x="0" y="4" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">50°</text>
                    </g>

                    {/* Alt Açı: Ters Açı (?) */}
                    <path d="M 148 148 A 25 25 0 0 1 112 148" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <g transform="translate(130, 168)">
                      <rect x="-26" y="-10" width="52" height="20" rx="6" fill={kavsakChecked ? (kavsakAnswers.q1_ters.trim() === '50' ? '#10b981' : '#f43f5e') : '#475569'} />
                      <text x="0" y="4" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                        {kavsakChecked ? '50°' : 'Ters: ?'}
                      </text>
                    </g>

                    {/* Sol Açı: Bütünler (?) */}
                    <g transform="translate(70, 130)">
                      <rect x="-24" y="-10" width="48" height="20" rx="6" fill={kavsakChecked ? (kavsakAnswers.q2_butunler.trim() === '130' ? '#10b981' : '#475569') : '#334155'} />
                      <text x="0" y="4" fontSize="10" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                        {kavsakChecked ? '130°' : '?'}
                      </text>
                    </g>

                    {/* Sağ Açı: Bütünler (?) */}
                    <g transform="translate(190, 130)">
                      <rect x="-24" y="-10" width="48" height="20" rx="6" fill={kavsakChecked ? (kavsakAnswers.q2_butunler.trim() === '130' ? '#10b981' : '#475569') : '#334155'} />
                      <text x="0" y="4" fontSize="10" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                        {kavsakChecked ? '130°' : '?'}
                      </text>
                    </g>
                  </svg>
                </div>
              </div>

              {/* Sağ: 3 Soru Kartı */}
              <div className="lg:col-span-7 space-y-3.5">
                {/* Soru 1 */}
                <div className={`p-4 rounded-2xl border transition-all ${kavsakChecked ? (kavsakAnswers.q1_ters.trim() === '50' ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-400' : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-400') : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      1. 50°&apos;lik açının karşısındaki <strong className="text-rose-600 dark:text-rose-400">ters açı</strong> kaç derecedir?
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <input
                        type="text"
                        maxLength={3}
                        value={kavsakAnswers.q1_ters}
                        onChange={(e) => setKavsakAnswers({ ...kavsakAnswers, q1_ters: e.target.value })}
                        placeholder="..."
                        className="w-16 h-9 text-center font-black text-sm rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-rose-500"
                      />
                      <span className="font-bold text-xs">°</span>
                    </div>
                  </div>
                  {kavsakChecked && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      İpucu: Kesişen doğrularda ters yönlü açılar birbirine eşittir (50°).
                    </div>
                  )}
                </div>

                {/* Soru 2 */}
                <div className={`p-4 rounded-2xl border transition-all ${kavsakChecked ? (kavsakAnswers.q2_butunler.trim() === '130' ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-400' : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-400') : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      2. Bu açının hemen yanındaki <strong className="text-amber-600 dark:text-amber-400">komşu bütünler açı</strong> kaç derecedir?
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <input
                        type="text"
                        maxLength={3}
                        value={kavsakAnswers.q2_butunler}
                        onChange={(e) => setKavsakAnswers({ ...kavsakAnswers, q2_butunler: e.target.value })}
                        placeholder="..."
                        className="w-16 h-9 text-center font-black text-sm rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-rose-500"
                      />
                      <span className="font-bold text-xs">°</span>
                    </div>
                  </div>
                  {kavsakChecked && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      İpucu: Bir doğru üzerinde oluşan komşu açıların toplamı 180°&apos;dir (180° - 50° = 130°).
                    </div>
                  )}
                </div>

                {/* Soru 3 */}
                <div className={`p-4 rounded-2xl border transition-all ${kavsakChecked ? (kavsakAnswers.q3_toplam.trim() === '360' ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-400' : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-400') : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      3. Kavşakta oluşan 4 açının <strong className="text-indigo-600 dark:text-indigo-400">toplamı</strong> kaç derecedir?
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <input
                        type="text"
                        maxLength={3}
                        value={kavsakAnswers.q3_toplam}
                        onChange={(e) => setKavsakAnswers({ ...kavsakAnswers, q3_toplam: e.target.value })}
                        placeholder="..."
                        className="w-16 h-9 text-center font-black text-sm rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-rose-500"
                      />
                      <span className="font-bold text-xs">°</span>
                    </div>
                  </div>
                  {kavsakChecked && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      İpucu: Bir tam dönüşün açısı 360°&apos;dir (50° + 130° + 50° + 130° = 360°).
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* BÖLÜM 2: D/Y GEOMETRİK ÇIKARIM MEYDAN OKUMASI */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-amber-500/30 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-black text-xs">
                    2
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Geometrik Çıkarım Meydan Okuması (Doğru / Yanlış)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Aşağıdaki ifadelerin doğruluğunu değerlendirerek D (Doğru) veya Y (Yanlış) butonuna basınız:
                </p>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                50 Puan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'p1',
                  text: 'İki doğru kesiştiğinde oluşan ters açılar daima birbirine eşittir.',
                  correct: 'D',
                  explanation: 'Doğru. Kesişen doğruların oluşturduğu zıt yönlü açılar birbirine eşittir.'
                },
                {
                  id: 'p2',
                  text: 'Paralel iki doğru kesişmediği için aralarında açı oluşmaz.',
                  correct: 'D',
                  explanation: 'Doğru. Paralel doğruların ortak noktası yoktur (p // r), dolayısıyla açı 0’dır.'
                },
                {
                  id: 'p3',
                  text: 'Birbirini dik kesen iki doğru 4 adet 90°\'lik dik açı meydana getirir.',
                  correct: 'D',
                  explanation: 'Doğru. Dik kesişen doğrular (k ⊥ m) 4 dik açı oluşturur.'
                },
                {
                  id: 'p4',
                  text: 'Komşu tümler iki açının toplamı 180°\'dir.',
                  correct: 'Y',
                  explanation: 'Yanlış! Tümler açıların toplamı 90°\'dir. Toplamı 180° olan açılara Bütünler Açı denir.'
                }
              ].map((item) => {
                const currentVal = kavsakAnswers[item.id as keyof typeof kavsakAnswers];
                const isCorrect = currentVal === item.correct;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      kavsakChecked
                        ? isCorrect
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-400'
                          : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-400'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                        {item.text}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            playSound('select');
                            setKavsakAnswers({ ...kavsakAnswers, [item.id]: 'D' });
                          }}
                          className={`w-8 h-8 rounded-lg font-black text-xs transition-all cursor-pointer ${
                            currentVal === 'D'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          D
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playSound('select');
                            setKavsakAnswers({ ...kavsakAnswers, [item.id]: 'Y' });
                          }}
                          className={`w-8 h-8 rounded-lg font-black text-xs transition-all cursor-pointer ${
                            currentVal === 'Y'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Y
                        </button>
                      </div>
                    </div>

                    {kavsakChecked && (
                      <div className={`text-[11px] font-semibold pt-2 border-t flex items-center gap-1.5 ${isCorrect ? 'border-emerald-200 text-emerald-800 dark:text-emerald-300' : 'border-rose-200 text-rose-800 dark:text-rose-300'}`}>
                        <span>{isCorrect ? '✓' : '✗'}</span>
                        <span>{item.explanation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : isLinesRelationsActivity ? (
        /* ========================================================================= */
        /* ETKİNLİK: "DOĞRULARIN BİRBİRİNE GÖRE DURUMLARI" (MAT.5.3.4)               */
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* 1. Kontrol ve Mod Seçici Butonları */}
          <div className="bg-slate-900 dark:bg-slate-900 border-2 border-blue-500/50 rounded-3xl p-6 shadow-xl space-y-4 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-2xl">📐</span>
                <span className="text-base sm:text-lg font-black text-white tracking-wide">
                  GÖZLEM MASASI: &ldquo;DOĞRULARIN KONUM VE AÇI DEDEKTİFİ&rdquo;
                </span>
                <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-blue-400">
                  4. Hafta • MAT.5.3.4
                </span>
              </div>
              
              {/* Durum Filtresi */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-400 mr-1">İnceleme Modu:</span>
                {[
                  { id: 'overview', label: '🌟 Tümü (Özet)', icon: '📋' },
                  { id: 'intersecting', label: '1. Kesişen', icon: '✖️' },
                  { id: 'perpendicular', label: '2. Dik (⊥)', icon: '📐' },
                  { id: 'parallel', label: '3. Paralel (//)', icon: '🛤️' },
                  { id: 'transversal', label: '4. Kesen (t)', icon: '⚡' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setLinesActiveTab(tab.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      linesActiveTab === tab.id
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              💡 <strong>Temel Geometri İlkesi:</strong> Düzlemdeki iki doğru ya <strong>tek bir noktada kesişir</strong> (eğer açı 90° ise <strong>dik kesişir</strong>), ya da hiçbir noktada kesişmeyip aralarındaki mesafeyi koruyarak <strong>paralel</strong> kalır. Paralel doğruları farklı noktalarda kesen doğruya ise <strong>kesen doğru</strong> denir.
            </p>
          </div>

          {/* 2. DÖRT TEMEL DURUM KARTLARI (Simülatör & İnteraktif Deneyler) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* KART 1: KESİŞEN DOĞRULAR */}
            {(linesActiveTab === 'overview' || linesActiveTab === 'intersecting') && (
              <div className="bg-white rounded-3xl p-6 border-2 border-blue-500/40 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-blue-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm">
                        ✖️
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-blue-900">1. KESİŞEN DOĞRULAR</h3>
                        <span className="text-[10px] font-mono text-blue-600 font-bold">d₁ ∩ d₂ = {'{K}'}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-[10px] border border-blue-200">
                      1 Ortak Nokta • 4 Açı
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Düzlemde yalnız <strong>tek bir ortak noktası (K)</strong> olan iki doğruya kesişen doğrular denir. Kesiştikleri noktada 4 adet açı oluşur.
                  </p>

                  {/* İnteraktif Açı Simülatörü Slider */}
                  <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                      <span>Kesişme Açısını Ayarla (θ):</span>
                      <span className="font-mono bg-blue-600 text-white px-2 py-0.5 rounded-md text-[11px]">
                        {intersectingAngle}° (Dar) / {180 - intersectingAngle}° (Geniş)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={25}
                      max={155}
                      step={5}
                      value={intersectingAngle}
                      onChange={(e) => setIntersectingAngle(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* Dinamik İnteraktif SVG */}
                  <div className="border-2 border-dashed border-blue-200 rounded-2xl h-56 bg-slate-50 relative overflow-hidden flex items-center justify-center select-none">
                    <svg viewBox="0 0 340 220" width="100%" height="100%">
                      <defs>
                        <pattern id="grid_intersecting" width="16" height="16" patternUnits="userSpaceOnUse">
                          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#e2e8f0" stroke-width="0.8" />
                        </pattern>
                      </defs>
                      <rect width="340" height="220" fill="url(#grid_intersecting)" />

                      {/* Sabit Yatay Doğru d1 (Y=110) */}
                      <line x1="30" y1="110" x2="310" y2="110" stroke="#2563eb" stroke-width="3" />
                      <polygon points="305,106 315,110 305,114" fill="#2563eb" />
                      <polygon points="35,106 25,110 35,114" fill="#2563eb" />
                      <text x="318" y="114" font-family="monospace" font-size="12" font-weight="900" fill="#1d4ed8">d₁</text>

                      {/* Dönen Doğru d2 (Merkez: 170, 110) */}
                      {(() => {
                        const cx = 170;
                        const cy = 110;
                        const len = 120;
                        const rad = (intersectingAngle * Math.PI) / 180;
                        const x1 = cx - len * Math.cos(rad);
                        const y1 = cy + len * Math.sin(rad);
                        const x2 = cx + len * Math.cos(rad);
                        const y2 = cy - len * Math.sin(rad);

                        return (
                          <g>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0ea5e9" stroke-width="3" />
                            <circle cx={x2} cy={y2} r="3" fill="#0ea5e9" />
                            <text x={x2 + 8} y={y2 + 4} font-family="monospace" font-size="12" font-weight="900" fill="#0284c7">d₂</text>

                            {/* Kesişim Noktası K */}
                            <circle cx={cx} cy={cy} r="6" fill="#ef4444" stroke="#ffffff" stroke-width="2" />
                            <text x={cx} y={cy - 12} font-family="system-ui" font-size="12" font-weight="900" fill="#dc2626" text-anchor="middle">K</text>
                            
                            {/* Açı Yayları ve Değerler */}
                            <text x={cx + 38} y={cy - 10} font-family="system-ui" font-size="10" font-weight="bold" fill="#1e40af">
                              {intersectingAngle}°
                            </text>
                            <text x={cx - 55} y={cy - 10} font-family="system-ui" font-size="10" font-weight="bold" fill="#0369a1">
                              {180 - intersectingAngle}°
                            </text>
                            <text x={cx - 55} y={cy + 22} font-family="system-ui" font-size="10" font-weight="bold" fill="#1e40af">
                              {intersectingAngle}°
                            </text>
                            <text x={cx + 38} y={cy + 22} font-family="system-ui" font-size="10" font-weight="bold" fill="#0369a1">
                              {180 - intersectingAngle}°
                            </text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Soru Kontrol Alanı */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-700 font-bold">1. Kesiştiği noktada kaç açı oluşur?</span>
                      <select
                        value={linesAnswers.q1_angles}
                        onChange={(e) => setLinesAnswers((a) => ({ ...a, q1_angles: e.target.value }))}
                        className={`p-1.5 rounded-lg border text-xs font-bold ${
                          linesChecked
                            ? linesAnswers.q1_angles === '4'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                              : 'bg-rose-50 text-rose-900 border-rose-400'
                            : 'bg-slate-50 text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="">Seçiniz...</option>
                        <option value="2">2 Açı</option>
                        <option value="3">3 Açı</option>
                        <option value="4">4 Açı (Doğru)</option>
                        <option value="6">6 Açı</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-700 font-bold">2. Ortak nokta sayısı kaçtır?</span>
                      <select
                        value={linesAnswers.q1_points}
                        onChange={(e) => setLinesAnswers((a) => ({ ...a, q1_points: e.target.value }))}
                        className={`p-1.5 rounded-lg border text-xs font-bold ${
                          linesChecked
                            ? linesAnswers.q1_points === '1'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                              : 'bg-rose-50 text-rose-900 border-rose-400'
                            : 'bg-slate-50 text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="">Seçiniz...</option>
                        <option value="0">0 (Yoktur)</option>
                        <option value="1">1 (Yalnızca K)</option>
                        <option value="2">2 Nokta</option>
                        <option value="sonsuz">Sonsuz</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Geometrik Durum: <strong>Kesişen Doğrular</strong></span>
                  <span className="text-blue-700 font-bold">25 Puan</span>
                </div>
              </div>
            )}

            {/* KART 2: DİK DOĞRULAR */}
            {(linesActiveTab === 'overview' || linesActiveTab === 'perpendicular') && (
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/40 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm">
                        📐
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-emerald-900">2. DİK DOĞRULAR</h3>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold">m ⊥ n (90° Açılı Kesişim)</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                      4 Dik Açı (90°) • ⊥ Sembolü
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Kesişirken <strong>90°'lik dik açı</strong> oluşturan doğrulara dik doğrular denir. 4 açının her biri tam 90°'dir ve <code>⊥</code> sembolüyle gösterilir.
                  </p>

                  {/* Diklik Sembolü Açma/Kapama */}
                  <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">90° Diklik İşaretlerini Göster:</span>
                    <button
                      type="button"
                      onClick={() => {
                        playSound('select');
                        setShowRightAngles(!showRightAngles);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        showRightAngles
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-300'
                      }`}
                    >
                      {showRightAngles ? '✓ 4 Dik Açı Açık' : 'Kapalı'}
                    </button>
                  </div>

                  {/* Dinamik SVG */}
                  <div className="border-2 border-dashed border-emerald-200 rounded-2xl h-56 bg-slate-50 relative overflow-hidden flex items-center justify-center select-none">
                    <svg viewBox="0 0 340 220" width="100%" height="100%">
                      <defs>
                        <pattern id="grid_perp" width="16" height="16" patternUnits="userSpaceOnUse">
                          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#e2e8f0" stroke-width="0.8" />
                        </pattern>
                      </defs>
                      <rect width="340" height="220" fill="url(#grid_perp)" />

                      {/* Yatay Doğru m (Y=110) */}
                      <line x1="30" y1="110" x2="310" y2="110" stroke="#059669" stroke-width="3" />
                      <polygon points="305,106 315,110 305,114" fill="#059669" />
                      <polygon points="35,106 25,110 35,114" fill="#059669" />
                      <text x="318" y="114" font-family="monospace" font-size="12" font-weight="900" fill="#047857">m</text>

                      {/* Düşey Doğru n (X=170) */}
                      <line x1="170" y1="20" x2="170" y2="200" stroke="#10b981" stroke-width="3" />
                      <polygon points="166,28 170,18 174,28" fill="#10b981" />
                      <polygon points="166,192 170,202 174,192" fill="#10b981" />
                      <text x="176" y="28" font-family="monospace" font-size="12" font-weight="900" fill="#059669">n</text>

                      {/* 4 Köşedeki 90° Diklik Sembolleri */}
                      {showRightAngles && (
                        <g>
                          {/* 1. Bölge (Sağ Üst) */}
                          <rect x="170" y="86" width="24" height="24" fill="#ecfdf5" stroke="#059669" stroke-width="1.8" />
                          <circle cx="182" cy="98" r="2.5" fill="#059669" />
                          <text x="200" y="96" font-family="system-ui" font-size="10" font-weight="900" fill="#047857">90°</text>

                          {/* 2. Bölge (Sol Üst) */}
                          <rect x="146" y="86" width="24" height="24" fill="#ecfdf5" stroke="#059669" stroke-width="1.8" />
                          <circle cx="158" cy="98" r="2.5" fill="#059669" />
                          <text x="125" y="96" font-family="system-ui" font-size="10" font-weight="900" fill="#047857">90°</text>

                          {/* 3. Bölge (Sol Alt) */}
                          <rect x="146" y="110" width="24" height="24" fill="#ecfdf5" stroke="#059669" stroke-width="1.8" />
                          <circle cx="158" cy="122" r="2.5" fill="#059669" />
                          <text x="125" y="132" font-family="system-ui" font-size="10" font-weight="900" fill="#047857">90°</text>

                          {/* 4. Bölge (Sağ Alt) */}
                          <rect x="170" y="110" width="24" height="24" fill="#ecfdf5" stroke="#059669" stroke-width="1.8" />
                          <circle cx="182" cy="122" r="2.5" fill="#059669" />
                          <text x="200" y="132" font-family="system-ui" font-size="10" font-weight="900" fill="#047857">90°</text>
                        </g>
                      )}

                      {/* Merkez Vurgusu */}
                      <circle cx="170" cy="110" r="4" fill="#047857" />
                    </svg>
                  </div>

                  {/* Soru Kontrol Alanı */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-700 font-bold">1. Oluşan 4 açının her birinin ölçüsü:</span>
                      <select
                        value={linesAnswers.q2_deg}
                        onChange={(e) => setLinesAnswers((a) => ({ ...a, q2_deg: e.target.value }))}
                        className={`p-1.5 rounded-lg border text-xs font-bold ${
                          linesChecked
                            ? linesAnswers.q2_deg === '90'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                              : 'bg-rose-50 text-rose-900 border-rose-400'
                            : 'bg-slate-50 text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="">Seçiniz...</option>
                        <option value="45">45° (Dar Açı)</option>
                        <option value="60">60° (Dar Açı)</option>
                        <option value="90">90° (Dik Açı)</option>
                        <option value="180">180° (Doğru Açı)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-700 font-bold">2. Diklik sembolü ile gösterimi:</span>
                      <select
                        value={linesAnswers.q2_sym}
                        onChange={(e) => setLinesAnswers((a) => ({ ...a, q2_sym: e.target.value }))}
                        className={`p-1.5 rounded-lg border text-xs font-bold ${
                          linesChecked
                            ? linesAnswers.q2_sym === 'perp'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                              : 'bg-rose-50 text-rose-900 border-rose-400'
                            : 'bg-slate-50 text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="">Seçiniz...</option>
                        <option value="perp">m ⊥ n (Doğru)</option>
                        <option value="parallel">m // n</option>
                        <option value="equal">m = n</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Geometrik Durum: <strong>Dik Doğrular</strong></span>
                  <span className="text-emerald-700 font-bold">25 Puan</span>
                </div>
              </div>
            )}

            {/* KART 3: PARALEL DOĞRULAR */}
            {(linesActiveTab === 'overview' || linesActiveTab === 'parallel') && (
              <div className="bg-white rounded-3xl p-6 border-2 border-purple-500/40 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-purple-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm">
                        🛤️
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-purple-900">3. PARALEL DOĞRULAR</h3>
                        <span className="text-[10px] font-mono text-purple-600 font-bold">p // r (Sıfır Ortak Nokta)</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 font-bold text-[10px] border border-purple-200">
                      0 Ortak Nokta • // Sembolü
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Düzlemde <strong>birbirini hiçbir zaman kesmeyen</strong> ve aralarındaki dik mesafe daima sabit kalan iki doğruya paralel doğrular denir. <code>p // r</code> şeklinde gösterilir.
                  </p>

                  {/* Ray Mesafesi Ayar Kaydırıcısı */}
                  <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                      <span>Raylar Arası Dik Mesafeyi Değiştir:</span>
                      <span className="font-mono bg-purple-600 text-white px-2 py-0.5 rounded-md text-[11px]">
                        d = {parallelDistance} px (Sabit Mesafe)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={25}
                      max={65}
                      step={5}
                      value={parallelDistance}
                      onChange={(e) => setParallelDistance(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  {/* Dinamik SVG */}
                  <div className="border-2 border-dashed border-purple-200 rounded-2xl h-56 bg-slate-50 relative overflow-hidden flex items-center justify-center select-none">
                    <svg viewBox="0 0 340 220" width="100%" height="100%">
                      <defs>
                        <pattern id="grid_parallel" width="16" height="16" patternUnits="userSpaceOnUse">
                          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#e2e8f0" stroke-width="0.8" />
                        </pattern>
                      </defs>
                      <rect width="340" height="220" fill="url(#grid_parallel)" />

                      {/* Üst Doğru p (Y = 110 - d/2) */}
                      {(() => {
                        const yTop = 110 - parallelDistance;
                        const yBottom = 110 + parallelDistance;

                        return (
                          <g>
                            {/* Üst Ray */}
                            <line x1="30" y1={yTop} x2="310" y2={yTop} stroke="#7c3aed" stroke-width="3" />
                            <polygon points={`${305},${yTop-4} ${315},${yTop} ${305},${yTop+4}`} fill="#7c3aed" />
                            <polygon points={`${35},${yTop-4} ${25},${yTop} ${35},${yTop+4}`} fill="#7c3aed" />
                            <text x="318" y={yTop + 4} font-family="monospace" font-size="12" font-weight="900" fill="#6d28d9">p</text>

                            {/* Alt Ray */}
                            <line x1="30" y1={yBottom} x2="310" y2={yBottom} stroke="#8b5cf6" stroke-width="3" />
                            <polygon points={`${305},${yBottom-4} ${315},${yBottom} ${305},${yBottom+4}`} fill="#8b5cf6" />
                            <polygon points={`${35},${yBottom-4} ${25},${yBottom} ${35},${yBottom+4}`} fill="#8b5cf6" />
                            <text x="318" y={yBottom + 4} font-family="monospace" font-size="12" font-weight="900" fill="#6d28d9">r</text>

                            {/* Eşit Dik Mesafe Çizgileri */}
                            {/* Sol Dikme */}
                            <line x1="100" y1={yTop} x2="100" y2={yBottom} stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 2" />
                            <rect x="100" y={yTop} width="8" height="8" fill="none" stroke="#94a3b8" stroke-width="1" />
                            <rect x="100" y={yBottom - 8} width="8" height="8" fill="none" stroke="#94a3b8" stroke-width="1" />
                            
                            {/* Sağ Dikme */}
                            <line x1="240" y1={yTop} x2="240" y2={yBottom} stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 2" />
                            <rect x="240" y={yTop} width="8" height="8" fill="none" stroke="#94a3b8" stroke-width="1" />
                            <rect x="240" y={yBottom - 8} width="8" height="8" fill="none" stroke="#94a3b8" stroke-width="1" />

                            {/* Açıklama Kutusu Ortada */}
                            <rect x="130" y="96" width="80" height="28" rx="6" fill="#f5f3ff" stroke="#7c3aed" stroke-width="1.2" />
                            <text x="170" y="114" font-family="system-ui" font-size="10" font-weight="900" fill="#6d28d9" text-anchor="middle">
                              p // r (d = {parallelDistance})
                            </text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Soru Kontrol Alanı */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-700 font-bold">1. Bu doğruların ortak noktası var mıdır?</span>
                      <select
                        value={linesAnswers.q3_points}
                        onChange={(e) => setLinesAnswers((a) => ({ ...a, q3_points: e.target.value }))}
                        className={`p-1.5 rounded-lg border text-xs font-bold ${
                          linesChecked
                            ? linesAnswers.q3_points === '0'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                              : 'bg-rose-50 text-rose-900 border-rose-400'
                            : 'bg-slate-50 text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="">Seçiniz...</option>
                        <option value="0">Hayır (0 Ortak Nokta)</option>
                        <option value="1">Evet (1 Ortak Nokta)</option>
                        <option value="2">2 Ortak Nokta</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-700 font-bold">2. Paralellik sembolü ile gösterimi:</span>
                      <select
                        value={linesAnswers.q3_sym}
                        onChange={(e) => setLinesAnswers((a) => ({ ...a, q3_sym: e.target.value }))}
                        className={`p-1.5 rounded-lg border text-xs font-bold ${
                          linesChecked
                            ? linesAnswers.q3_sym === 'parallel'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                              : 'bg-rose-50 text-rose-900 border-rose-400'
                            : 'bg-slate-50 text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="">Seçiniz...</option>
                        <option value="parallel">p // r (Doğru)</option>
                        <option value="perp">p ⊥ r</option>
                        <option value="intersect">p ∩ r</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Geometrik Durum: <strong>Paralel Doğrular</strong></span>
                  <span className="text-purple-700 font-bold">25 Puan</span>
                </div>
              </div>
            )}

            {/* KART 4: KESEN DOĞRU */}
            {(linesActiveTab === 'overview' || linesActiveTab === 'transversal') && (
              <div className="bg-white rounded-3xl p-6 border-2 border-amber-500/40 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-sm">
                        ⚡
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-amber-900">4. KESEN DOĞRU</h3>
                        <span className="text-[10px] font-mono text-amber-600 font-bold">k₁ // k₂ ve t keseni</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200">
                      2 Kesim Noktası • 8 Açı (4+4)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Birbirine paralel iki doğruyu farklı noktalarda (A ve B) kesen üçüncü bir doğruya <strong>kesen doğru</strong> (transversal) denir. Kesen doğru toplam <strong>8 açı</strong> oluşturur.
                  </p>

                  {/* Eğim Açısı Ayar Kaydırıcısı */}
                  <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                      <span>Kesen Doğrunun (t) Eğim Açısı:</span>
                      <span className="font-mono bg-amber-600 text-white px-2 py-0.5 rounded-md text-[11px]">
                        θ = {transversalAngle}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min={35}
                      max={85}
                      step={5}
                      value={transversalAngle}
                      onChange={(e) => setTransversalAngle(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>

                  {/* Dinamik SVG */}
                  <div className="border-2 border-dashed border-amber-200 rounded-2xl h-56 bg-slate-50 relative overflow-hidden flex items-center justify-center select-none">
                    <svg viewBox="0 0 340 220" width="100%" height="100%">
                      <defs>
                        <pattern id="grid_trans" width="16" height="16" patternUnits="userSpaceOnUse">
                          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#e2e8f0" stroke-width="0.8" />
                        </pattern>
                      </defs>
                      <rect width="340" height="220" fill="url(#grid_trans)" />

                      {/* Üst Paralel k1 (Y=65) */}
                      <line x1="30" y1="65" x2="310" y2="65" stroke="#d97706" stroke-width="3" />
                      <polygon points="305,61 315,65 305,69" fill="#d97706" />
                      <polygon points="35,61 25,65 35,69" fill="#d97706" />
                      <text x="318" y="69" font-family="monospace" font-size="12" font-weight="900" fill="#b45309">k₁</text>

                      {/* Alt Paralel k2 (Y=155) */}
                      <line x1="30" y1="155" x2="310" y2="155" stroke="#d97706" stroke-width="3" />
                      <polygon points="305,151 315,155 305,159" fill="#d97706" />
                      <polygon points="35,151 25,155 35,159" fill="#d97706" />
                      <text x="318" y="159" font-family="monospace" font-size="12" font-weight="900" fill="#b45309">k₂</text>

                      {/* Kesen Doğru t (A=(xA, 65), B=(xB, 155)) */}
                      {(() => {
                        const cyA = 65;
                        const cyB = 155;
                        const midY = 110;
                        const midX = 170;
                        const dy = (cyB - cyA) / 2; // 45
                        const rad = (transversalAngle * Math.PI) / 180;
                        const dx = dy / Math.tan(rad);
                        const cxA = midX - dx;
                        const cxB = midX + dx;

                        // Uzatılmış hat
                        const extLen = 35;
                        const extDx = extLen / Math.tan(rad);
                        const topX = cxA - extDx;
                        const topY = cyA - extLen;
                        const botX = cxB + extDx;
                        const botY = cyB + extLen;

                        return (
                          <g>
                            <line x1={topX} y1={topY} x2={botX} y2={botY} stroke="#dc2626" stroke-width="3" />
                            <polygon points={`${botX-6},${botY-4} ${botX+4},${botY+4} ${botX-2},${botY-8}`} fill="#dc2626" />
                            <polygon points={`${topX+6},${topY+4} ${topX-4},${topY-4} ${topX+2},${topY+8}`} fill="#dc2626" />
                            <text x={botX + 8} y={botY + 4} font-family="monospace" font-size="12" font-weight="900" fill="#dc2626">t (Kesen)</text>

                            {/* A Noktası */}
                            <circle cx={cxA} cy={cyA} r="5" fill="#dc2626" stroke="#ffffff" stroke-width="1.5" />
                            <text x={cxA - 12} y={cyA - 8} font-family="system-ui" font-size="11" font-weight="900" fill="#dc2626">A</text>
                            
                            {/* B Noktası */}
                            <circle cx={cxB} cy={cyB} r="5" fill="#dc2626" stroke="#ffffff" stroke-width="1.5" />
                            <text x={cxB + 10} y={cyB + 16} font-family="system-ui" font-size="11" font-weight="900" fill="#dc2626">B</text>

                            {/* A ve B etrafındaki 4+4 Açı Yayları */}
                            <text x={cxA + 16} y={cyA - 4} font-family="system-ui" font-size="9" font-weight="bold" fill="#0369a1">1</text>
                            <text x={cxA - 18} y={cyA - 4} font-family="system-ui" font-size="9" font-weight="bold" fill="#0369a1">2</text>
                            <text x={cxA - 18} y={cyA + 14} font-family="system-ui" font-size="9" font-weight="bold" fill="#0369a1">3</text>
                            <text x={cxA + 16} y={cyA + 14} font-family="system-ui" font-size="9" font-weight="bold" fill="#0369a1">4</text>

                            <text x={cxB + 16} y={cyB - 4} font-family="system-ui" font-size="9" font-weight="bold" fill="#b45309">5</text>
                            <text x={cxB - 18} y={cyB - 4} font-family="system-ui" font-size="9" font-weight="bold" fill="#b45309">6</text>
                            <text x={cxB - 18} y={cyB + 14} font-family="system-ui" font-size="9" font-weight="bold" fill="#b45309">7</text>
                            <text x={cxB + 16} y={cyB + 14} font-family="system-ui" font-size="9" font-weight="bold" fill="#b45309">8</text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Soru Kontrol Alanı */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-700 font-bold">1. İki paralel doğruyu kesen 3. doğruya ne ad verilir?</span>
                      <select
                        value={linesAnswers.q4_name}
                        onChange={(e) => setLinesAnswers((a) => ({ ...a, q4_name: e.target.value }))}
                        className={`p-1.5 rounded-lg border text-xs font-bold ${
                          linesChecked
                            ? linesAnswers.q4_name === 'kesen'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                              : 'bg-rose-50 text-rose-900 border-rose-400'
                            : 'bg-slate-50 text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="">Seçiniz...</option>
                        <option value="kesen">Kesen Doğru (Transversal)</option>
                        <option value="dikme">Dikme</option>
                        <option value="paralel">Paralel Doğru</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-700 font-bold">2. Kesen doğrunun oluşturduğu toplam açı sayısı:</span>
                      <select
                        value={linesAnswers.q4_angles}
                        onChange={(e) => setLinesAnswers((a) => ({ ...a, q4_angles: e.target.value }))}
                        className={`p-1.5 rounded-lg border text-xs font-bold ${
                          linesChecked
                            ? linesAnswers.q4_angles === '8'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                              : 'bg-rose-50 text-rose-900 border-rose-400'
                            : 'bg-slate-50 text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="">Seçiniz...</option>
                        <option value="4">4 Açı</option>
                        <option value="6">6 Açı</option>
                        <option value="8">8 Açı (4+4 Doğru)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Geometrik Durum: <strong>Kesen Doğru</strong></span>
                  <span className="text-amber-700 font-bold">25 Puan</span>
                </div>
              </div>
            )}

          </div>

          {/* 3. ÖĞRENCİ KONTROL VE DEĞERLENDİRME MASASI */}
          <div className="bg-white rounded-3xl p-6 border-2 border-blue-500/30 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-lg">
                  🏆
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">ÖĞRENCİ KONTROL &amp; ETKİNLİK PUANLAMA MASASI</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Yukarıdaki 4 geometrik durumun sorularını cevaplayıp &ldquo;Cevapları Kontrol Et&rdquo; butonuna basınız.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {linesChecked && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 border border-blue-200 font-black text-blue-900 text-sm">
                    <span>Puan:</span>
                    <span className="text-base text-blue-700">{linesScore} / 100</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCheckLinesAnswers}
                  className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Cevapları Kontrol Et &amp; Puanla</span>
                </button>
              </div>
            </div>

            {/* Başarı Bildirimi */}
            {linesChecked && (
              <div
                className={`p-4 rounded-2xl border text-xs font-semibold leading-relaxed flex items-center gap-3 animate-in fade-in ${
                  linesScore === 100
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : linesScore >= 75
                    ? 'bg-blue-50 text-blue-900 border-blue-200'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}
              >
                <span className="text-xl">
                  {linesScore === 100 ? '🎉' : linesScore >= 75 ? '👏' : '💡'}
                </span>
                <div>
                  {linesScore === 100 ? (
                    <div>
                      <strong>TEBRİKLER! 100 TAM PUAN!</strong> Düzlemde iki ve üç doğrunun tüm durumlarını (Kesişen, Dik, Paralel, Kesen), ortak nokta sayılarını ve açı kurallarını eksiksiz öğrendiniz!
                    </div>
                  ) : linesScore >= 75 ? (
                    <div>
                      <strong>ÇOK İYİ! {linesScore} Puan aldınız.</strong> Yanlış veya boş bıraktığınız soruları kontrol ederek düzeltip tekrar deneyebilirsiniz.
                    </div>
                  ) : (
                    <div>
                      <strong>{linesScore} Puan aldınız.</strong> Doğruların durumlarını ve ortak nokta sayılarını simülatörden tekrar inceleyip cevaplarınızı güncelleyiniz.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. SONUÇ VE KARŞILAŞTIRMA MATRİSİ TABLOSU */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <h4 className="text-sm font-black text-slate-900">4. HAFTA GEOMETRİ MATRİSİ: DOĞRULARIN ÖZETİ</h4>
              </div>
              <span className="text-[11px] font-bold text-slate-500 font-mono">MAT.5.3.4</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black">
                    <th className="p-3">Doğru Durumu</th>
                    <th className="p-3">Ortak Nokta</th>
                    <th className="p-3">Oluşan Açı Özelliği</th>
                    <th className="p-3">Sembolik Gösterim</th>
                    <th className="p-3">Gerçek Yaşam Örneği</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-3 font-bold text-blue-900 flex items-center gap-1.5">
                      <span>✖️</span> 1. Kesişen Doğrular
                    </td>
                    <td className="p-3 font-bold text-blue-700">1 Ortak Nokta (K)</td>
                    <td className="p-3">4 Açı (Karşılıklı ters açılar birbirine eşit)</td>
                    <td className="p-3 font-mono font-bold text-blue-800">d₁ ∩ d₂ = {'{K}'}</td>
                    <td className="p-3 text-slate-500">Açık Makas, Dörtyol Kavşağı</td>
                  </tr>
                  <tr className="hover:bg-emerald-50/40 transition-colors">
                    <td className="p-3 font-bold text-emerald-900 flex items-center gap-1.5">
                      <span>📐</span> 2. Dik Doğrular
                    </td>
                    <td className="p-3 font-bold text-emerald-700">1 Ortak Nokta</td>
                    <td className="p-3">4 Açının her biri tam 90° (Dik Açı)</td>
                    <td className="p-3 font-mono font-bold text-emerald-800">m ⊥ n</td>
                    <td className="p-3 text-slate-500">Kapı/Pencere Köşeleri, Artı (+) İşareti</td>
                  </tr>
                  <tr className="hover:bg-purple-50/40 transition-colors">
                    <td className="p-3 font-bold text-purple-900 flex items-center gap-1.5">
                      <span>🛤️</span> 3. Paralel Doğrular
                    </td>
                    <td className="p-3 font-bold text-purple-700">0 (Yoktur)</td>
                    <td className="p-3">Kesişmedikleri için aralarında açı oluşmaz</td>
                    <td className="p-3 font-mono font-bold text-purple-800">p // r</td>
                    <td className="p-3 text-slate-500">Tren Rayları, Elektrik Telleri, Merdiven Kolları</td>
                  </tr>
                  <tr className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3 font-bold text-amber-900 flex items-center gap-1.5">
                      <span>⚡</span> 4. Kesen Doğru
                    </td>
                    <td className="p-3 font-bold text-amber-700">2 Nokta (A ve B)</td>
                    <td className="p-3">Toplam 8 Açı (4 A noktasında, 4 B noktasında)</td>
                    <td className="p-3 font-mono font-bold text-amber-800">k₁ // k₂ ve t keseni</td>
                    <td className="p-3 text-slate-500">Rayları kesen yaya geçidi / Karayolu köprüsü</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Alt Bilgi & Puanlama */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-semibold">
              <Award className="w-4 h-4 text-blue-500" />
              <span>
                <strong>Değerlendirme:</strong> 4 Bölüm x 25 Puan = Toplam 100 Puan (SDB3.3 / E3.7 Maarif Geometri Modeli)
              </span>
            </span>
            <span className="font-mono font-bold text-slate-400">www.maarifakademi.com.tr</span>
          </div>

        </div>
      ) : isErrorDetectiveActivity ? (
        /* ========================================================================= */
        /* ETKİNLİK: "HATA DEDEKTİFİ" VE ÖZ DEĞERLENDİRME (MAT.5.3.3)                 */
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Üst Bilgilendirme ve Büyüteç Kontrolleri (Yüksek Kontrastlı Tasarım) */}
          <div className="bg-slate-900 dark:bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 shadow-xl space-y-4 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-2xl">🕵️‍♂️</span>
                <span className="text-base sm:text-lg font-black text-white tracking-wide">
                  DEDEKTİFLİK MASASI: &ldquo;ÖLÇÜM HATASINI ÇÖZ&rdquo;
                </span>
                <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-rose-400">
                  Dedektif Dosyası
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-400 mr-1">Büyüteç Odağı:</span>
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setDetectiveHighlight('all');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    detectiveHighlight === 'all'
                      ? 'bg-rose-600 text-white border-rose-400 shadow-md scale-105'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  🔍 Genel Görünüm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setDetectiveHighlight('center');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    detectiveHighlight === 'center'
                      ? 'bg-sky-600 text-white border-sky-400 shadow-md scale-105'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  📍 1. Odak: Merkez Bölgesi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setDetectiveHighlight('scale');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    detectiveHighlight === 'scale'
                      ? 'bg-amber-600 text-white border-amber-400 shadow-md scale-105'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  🎯 2. Odak: Ölçek Bölgesi
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 dark:text-slate-200 leading-relaxed font-normal">
              Aşağıdaki çizimde bir öğrenci dar açıyı iletkiyle ölçmüş ancak <strong className="text-white font-bold">2 kritik hata</strong> yaparak sonucu yanlış bulmuştur. Şemayı dikkatle incele, büyüteç araçlarıyla odaklan ve bu 2 hatayı kendi gözleminle tespit et!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* SOL KOLON: İNTERAKTİF DEDEKTİF SVG ALANI (lg:col-span-6) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border-2 border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold flex items-center justify-center text-xs">
                      🔍
                    </span>
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      İncelenecek Ölçüm Çizimi
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    Öğrencinin Okuduğu Değer: 140°
                  </span>
                </div>

                {/* Konuşma Balonu */}
                <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5">
                  <span className="text-xl shrink-0">🧑‍🎓</span>
                  <div>
                    <strong className="block font-bold text-slate-900 dark:text-white">Öğrenci Can:</strong>
                    <em>&ldquo;İletkiyi kâğıdın üzerine koydum, ibrenin kolu 140 çizgisini gösteriyordu. Bu yüzden açının ölçüsüne 140° yazdım.&rdquo;</em>
                  </div>
                </div>

                {/* Hatalı Ölçüm İnteraktif SVG (İpuçsuz / Net Şema) */}
                <div className="h-72 bg-slate-900 rounded-2xl p-2 border border-slate-800 relative overflow-hidden flex items-center justify-center select-none shadow-inner">
                  <svg viewBox="0 0 460 260" className="w-full h-full">
                    <defs>
                      <pattern id="det_grid" width="16" height="16" patternUnits="userSpaceOnUse">
                        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#334155" strokeWidth="0.6" opacity="0.4" />
                      </pattern>
                      <radialGradient id="detProtGlass" cx="50%" cy="100%" r="90%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                        <stop offset="80%" stopColor="#0284c7" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#0369a1" stopOpacity="0.55" />
                      </radialGradient>
                    </defs>
                    <rect width="460" height="260" fill="url(#det_grid)" />

                    {/* 40°'lik Dar Açı (Tepe Noktası O=(110, 215)) */}
                    {/* Taban Kolu OA */}
                    <line x1="110" y1="215" x2="410" y2="215" stroke="#f8fafc" strokeWidth="3.5" />
                    <polygon points="405,210 417,215 405,220" fill="#f8fafc" />
                    <circle cx="360" cy="215" r="4" fill="#f8fafc" />
                    <text x="360" y="235" fontFamily="system-ui" fontSize="12" fontWeight="800" fill="#94a3b8" textAnchor="middle">A</text>

                    {/* 40° Eğik Kol OB */}
                    <line x1="110" y1="215" x2="317" y2="41.5" stroke="#f8fafc" strokeWidth="3.5" />
                    <polygon points="310,38 322,37 319,50" fill="#f8fafc" />
                    <circle cx="265" cy="85" r="4" fill="#f8fafc" />
                    <text x="280" y="82" fontFamily="system-ui" fontSize="12" fontWeight="800" fill="#94a3b8">B</text>

                    {/* Açının Köşesi [O */}
                    <circle cx="110" cy="215" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                    <text x="90" y="220" textAnchor="end" fontFamily="system-ui" fontSize="14" fontWeight="900" fill="#38bdf8">[O</text>
                    <text x="110" y="248" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="800" fill="#38bdf8">
                      Açının Köşesi (O)
                    </text>

                    {/* İLETKİ (Merkez (110, 165)) */}
                    <g transform="translate(0, 0)" opacity="0.92">
                      {/* İletki Yarım Daire Gövdesi */}
                      <path d="M 20 165 A 110 110 0 0 1 240 165 Z" fill="url(#detProtGlass)" stroke="#38bdf8" strokeWidth="2" />
                      <line x1="20" y1="165" x2="240" y2="165" stroke="#38bdf8" strokeWidth="1.8" />

                      {/* İletkinin Merkez Noktası (110, 165) */}
                      <circle cx="110" cy="165" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                      <line x1="102" y1="165" x2="118" y2="165" stroke="#ffffff" strokeWidth="1.2" />
                      <line x1="110" y1="157" x2="110" y2="173" stroke="#ffffff" strokeWidth="1.2" />
                      <text x="45" y="158" textAnchor="end" fontFamily="system-ui" fontSize="9.5" fontWeight="800" fill="#7dd3fc">
                        İletki Merkez Noktası
                      </text>

                      {/* İletki Derece Yayları ve Rakamları */}
                      <path d="M 40 165 A 90 90 0 0 1 220 165" fill="none" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="2 2" />
                      <text x="225" y="161" fontFamily="system-ui" fontSize="9" fontWeight="bold" fill="#bae6fd">0° / 180°</text>
                      <text x="110" y="70" fontFamily="system-ui" fontSize="10" fontWeight="bold" fill="#bae6fd" textAnchor="middle">90°</text>
                      <text x="35" y="161" fontFamily="system-ui" fontSize="9" fontWeight="bold" fill="#bae6fd">180° / 0°</text>

                      {/* 140° / 40° Derece Çizgisi */}
                      <circle cx="50" cy="98" r="7" fill="none" stroke="#fcd34d" strokeWidth="1.8" />
                      <text x="46" y="80" fontFamily="system-ui" fontSize="10" fontWeight="800" fill="#fde047" textAnchor="middle">
                        140° / 40°
                      </text>
                    </g>

                    {/* BÜYÜTEÇ ODAĞI 1: MERKEZ BÖLGESİ VURGUSU */}
                    {detectiveHighlight === 'center' && (
                      <g className="animate-in fade-in duration-200">
                        <circle cx="110" cy="190" r="32" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 3" className="animate-pulse" />
                        <rect x="150" y="178" width="165" height="26" rx="6" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.2" />
                        <text x="158" y="195" fontFamily="system-ui" fontSize="10" fontWeight="900" fill="#e0f2fe">
                          🔍 Odak 1: İletki Merkezi vs Köşe
                        </text>
                      </g>
                    )}

                    {/* BÜYÜTEÇ ODAĞI 2: ÖLÇEK BÖLGESİ VURGUSU */}
                    {detectiveHighlight === 'scale' && (
                      <g className="animate-in fade-in duration-200">
                        <circle cx="50" cy="98" r="24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 3" className="animate-pulse" />
                        <rect x="180" y="55" width="190" height="26" rx="6" fill="#451a03" stroke="#f59e0b" strokeWidth="1.2" />
                        <text x="188" y="72" fontFamily="system-ui" fontSize="10" fontWeight="900" fill="#fef3c7">
                          🔍 Odak 2: Açı Türü vs İbre Değeri
                        </text>
                      </g>
                    )}
                  </svg>
                </div>
              </div>

              {/* Alt Bilgi */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                💡 <em>İletkinin konumunu ve okunan 140° değerini açının dar/geniş durumuyla karşılaştırarak aşağıdaki soruları yanıtla.</em>
              </div>
            </div>

            {/* SAĞ KOLON: DEDEKTİF TEŞHİS FORMU & ÖZ DEĞERLENDİRME (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* GÖREV 1: 2 BÜYÜK HATAYI TESPİT ET */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border-2 border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold flex items-center justify-center text-xs">
                      1
                    </span>
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      GÖREV 1: 2 Büyük Hatayı Teşhis Et
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-black ${
                      detectiveCheckSubmitted && detectiveError1Answer === 'center' && detectiveError2Answer === 'scale'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {detectiveCheckSubmitted && detectiveError1Answer === 'center' && detectiveError2Answer === 'scale'
                      ? '✅ 50 Puan'
                      : '50 Puan'}
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  ❓ <strong>Dedektiflik Sorusu:</strong> Çizimdeki <strong>2 büyük hatayı</strong> tespit et ve doğru seçenekleri işaretle:
                </p>

                {/* HATA 1 TEŞHİSİ */}
                <div className="space-y-2 p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>🚩</span> <span>1. HATA (Merkez Konumu ile İlgili Hata):</span>
                  </span>
                  
                  <div className="space-y-1.5">
                    {[
                      {
                        id: 'center',
                        text: 'İletkinin merkezi açının tepe noktasına (O) oturtulmamış, yukarı kaydırılmıştır.'
                      },
                      {
                        id: 'arms',
                        text: 'Açının kolları cetvel kullanılmadan kısa çizilmiştir.'
                      },
                      {
                        id: 'rotate',
                        text: 'İletki 180 derece ters çevrilip tutulmuştur.'
                      }
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          detectiveError1Answer === opt.id
                            ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="error1"
                          checked={detectiveError1Answer === opt.id}
                          onChange={() => {
                            playSound('click');
                            setDetectiveError1Answer(opt.id);
                          }}
                          className="mt-0.5 shrink-0"
                        />
                        <span>{opt.text}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* HATA 2 TEŞHİSİ */}
                <div className="space-y-2 p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>🚩</span> <span>2. HATA (Ölçek Okuma ile İlgili Hata):</span>
                  </span>
                  
                  <div className="space-y-1.5">
                    {[
                      {
                        id: 'scale',
                        text: 'Açı dar açı (90°\'den küçük) iken geniş açı gösteren dış ölçekten 140° okunmuştur.'
                      },
                      {
                        id: 'straight',
                        text: 'Açı geniş açı olduğu halde dik açı (90°) olarak adlandırılmıştır.'
                      },
                      {
                        id: 'baseline',
                        text: 'Taban çizgisi 0° yerine tam 90° çizgisine hizalanmıştır.'
                      }
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          detectiveError2Answer === opt.id
                            ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="error2"
                          checked={detectiveError2Answer === opt.id}
                          onChange={() => {
                            playSound('click');
                            setDetectiveError2Answer(opt.id);
                          }}
                          className="mt-0.5 shrink-0"
                        />
                        <span>{opt.text}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Öğrencinin Kendi Cümleleriyle Dedektif Raporu (Opsiyonel Yazma Alanı) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    ✍️ Kendi Cümlelerinle Dedektif Notun:
                  </label>
                  <textarea
                    value={detectiveNotes}
                    onChange={(e) => setDetectiveNotes(e.target.value)}
                    placeholder="Örn: İletkinin merkez deliği O köşesiyle tam çakışmalıydı ve açı dar olduğu için iç ölçekten 40° okunmalıydı..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[55px]"
                  />
                </div>

                {/* Onay Butonu */}
                <button
                  type="button"
                  onClick={() => {
                    setDetectiveCheckSubmitted(true);
                    if (detectiveError1Answer === 'center' && detectiveError2Answer === 'scale') {
                      playSound('success');
                      if (!detectiveScoreAwarded) {
                        addPoints(50);
                        setDetectiveScoreAwarded(true);
                        unlockBadge('hata-dedektifi');
                      }
                    } else {
                      playSound('bell');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dedektiflik Teşhisini Onayla (+50 Puan)</span>
                </button>

                {detectiveCheckSubmitted && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs space-y-2 animate-in fade-in ${
                      detectiveError1Answer === 'center' && detectiveError2Answer === 'scale'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 border-2 border-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 border-2 border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    {detectiveError1Answer === 'center' && detectiveError2Answer === 'scale' ? (
                      <>
                        <div className="flex items-center gap-2 font-black text-emerald-800 dark:text-emerald-300 text-sm">
                          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Tebrikler Dedektif! 2 Hatayı da Kusursuz Çözdün (+50 Puan)</span>
                        </div>
                        <div className="space-y-1 text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
                          <div><strong>✓ 1. Hatanın Doğrusu:</strong> İletkinin merkez deliği açının köşe noktasına (O) sıfıra sıfır oturtulmalıdır.</div>
                          <div><strong>✓ 2. Hatanın Doğrusu:</strong> Çizilen açı dik açıdan dar olduğu için iç ölçekteki <strong>40°</strong> okunmalıdır. (140° çift ölçek tuzağıdır!)</div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
                        <RotateCcw className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Bazı teşhislerin hatalı görünüyor. Lütfen yukarıdaki büyüteç odaklarını inceleyerek tekrar dene!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* GÖREV 2: ÖZ DEĞERLENDİRME TABLOSU (KENDİNİ DEĞERLENDİR) */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border-2 border-teal-500/30 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-teal-100 dark:border-teal-900/50">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-xs">
                      2
                    </span>
                    <span className="font-black text-sm text-teal-950 dark:text-teal-100">
                      GÖREV 2: Kendini Değerlendir (Öz Değerlendirme)
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-teal-50 text-teal-800 border border-teal-200">
                    50 Puan
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Açı ölçme ve çizme sürecindeki kendi becerilerini dürüstçe değerlendir:
                </p>

                {/* 4 Kriter Matrisi */}
                <div className="space-y-2.5">
                  {[
                    { id: 1, text: '1. İletkinin merkez noktasını açının köşesine tam oturturum.' },
                    { id: 2, text: '2. Taban çizgisini (0° hattını) açının bir koluyla tam çakıştırırım.' },
                    { id: 3, text: '3. Açının dar/geniş durumuna göre doğru ölçeği (iç/dış) seçip okurum.' },
                    { id: 4, text: '4. İletki ile verilen derecede açıyı sıfırdan hatasız inşa edebilirim.' }
                  ].map((crit) => (
                    <div
                      key={crit.id}
                      className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {crit.text}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {[
                          { val: 1, label: 'Geliştirilmeli', stars: '⭐' },
                          { val: 2, label: 'Başarılı', stars: '⭐⭐' },
                          { val: 3, label: 'Mükemmel', stars: '⭐⭐⭐' }
                        ].map((lvl) => (
                          <button
                            key={lvl.val}
                            type="button"
                            onClick={() => {
                              playSound('click');
                              setSelfRatings((prev) => ({ ...prev, [crit.id]: lvl.val }));
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer ${
                              selfRatings[crit.id] === lvl.val
                                ? 'bg-teal-600 text-white border-teal-500 shadow-xs scale-105'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{lvl.stars}</span>
                            <span className="hidden sm:inline ml-1">{lvl.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Öz Çıkarım Cümlesi */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-teal-900 dark:text-teal-300">
                    ✍️ Öz Çıkarımım (Açı ölçerken en çok dikkat edeceğim kural):
                  </label>
                  <input
                    type="text"
                    value={selfReflectionRule}
                    onChange={(e) => setSelfReflectionRule(e.target.value)}
                    placeholder="Örn: Merkezin tam köşede olduğundan ve 90 dereceden küçükse dar ölçekten okuduğumdan emin olacağım..."
                    className="w-full text-xs p-2.5 rounded-xl border border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Öz Değerlendirme Tamamlama */}
                {Object.values(selfRatings).every((v) => v > 0) && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 font-bold flex items-center justify-between animate-in fade-in">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Öz Değerlendirme Tamamlandı! (+50 Puan)</span>
                    </span>
                    <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[10px]">
                      50 / 50 Puan
                    </span>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      ) : isAngleConstructionActivity ? (
        /* ========================================================================= */
        /* ETKİNLİK: "ROTANI KENDİN ÇİZ" (İLETKİ İLE AÇI İNŞASI - MAT.5.3.3)         */
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Üst Kılavuz & İpuçları Kutusu */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-500/30 rounded-3xl p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black text-sm">
              <span className="text-lg">📐</span>
              <span>HASSAS AÇI İNŞA KILAVUZU (4 ADIMDA TAM DERECE)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-amber-950 dark:text-amber-200">
              <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/50">
                <span className="font-bold text-amber-800 dark:text-amber-400">1. Orijin Hizala:</span> İletkinin merkezini açının köşe noktasına (A veya K) oturt.
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/50">
                <span className="font-bold text-amber-800 dark:text-amber-400">2. Taban 0° Hattı:</span> Başlangıç ışınını 0° çizgisiyle tam çakıştır.
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/50">
                <span className="font-bold text-amber-800 dark:text-amber-400">3. Dereceyi Belirle:</span> İletki ölçeğinden 50° veya 140°'yi bulup nokta koy.
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/50">
                <span className="font-bold text-amber-800 dark:text-amber-400">4. Kolu Birleştir:</span> Cetvelle köşeyi ve noktayı birleştirerek ışını çiz.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* GÖREV 1: 50° DAR AÇI İNŞASI */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-sky-500/30 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-sky-100 dark:border-sky-900/50">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center text-xs">
                      1
                    </span>
                    <span className="font-black text-sm text-sky-950 dark:text-sky-100">
                      GÖREV 1: [AB Işınından 50° Dar Açı İnşası
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-black ${
                      task1Completed
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-sky-50 text-sky-800 border border-sky-200'
                    }`}
                  >
                    {task1Completed ? '✅ 50 Puan' : '50 Puan'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>Yönerge:</strong> Verilen <code>[AB</code> ışınının <code>A</code> noktasını köşe kabul ederek iletkinle <strong>tam 50°'lik</strong> bir dar açı çiz ve <code>[AC</code> ışını ile birleştir.
                </p>

                {/* İnteraktif Çizim Alanı (Görev 1) */}
                <div className="bg-slate-900 rounded-2xl p-3 border border-slate-800 relative overflow-hidden flex flex-col items-center">
                  <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-300 mb-2">
                    <span className="text-sky-400 font-mono">
                      Mevcut Açı: {task1Angle}° {task1Angle === 50 ? '🎯 (Tam Hedef!)' : task1Angle < 50 ? '(Daha Genişlet)' : '(Daha Daralt)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTask1Protractor(!showTask1Protractor)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        showTask1Protractor
                          ? 'bg-sky-600 text-white border-sky-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {showTask1Protractor ? 'İletkiyi Gizle' : 'Sanal İletkiyi Aç'}
                    </button>
                  </div>

                  <div className="w-full h-56 relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 340 200" className="w-full h-full select-none">
                      {/* Milimetrik Grid */}
                      <defs>
                        <pattern id="grid_task1_sim" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                        </pattern>
                      </defs>
                      <rect width="340" height="200" fill="url(#grid_task1_sim)" />

                      {/* Sanal İletki Şablonu (A(60, 160) Merkezli) */}
                      {showTask1Protractor && (
                        <g transform="translate(60, 160)" opacity="0.45" className="transition-opacity">
                          {/* İletki Yarım Dairesi */}
                          <path d="M -100 0 A 100 100 0 0 1 100 0 Z" fill="#0284c7" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="1.5" />
                          <circle cx="0" cy="0" r="10" fill="none" stroke="#38bdf8" strokeWidth="1" />
                          <line x1="-95" y1="0" x2="95" y2="0" stroke="#38bdf8" strokeWidth="1.5" />
                          <line x1="0" y1="0" x2="0" y2="-95" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />

                          {/* Derece İşaretleri (Her 10°) */}
                          {Array.from({ length: 19 }).map((_, i) => {
                            const deg = i * 10;
                            const rad = (deg * Math.PI) / 180;
                            const is50 = deg === 50;
                            const is90 = deg === 90;
                            const r1 = is50 || is90 ? 82 : 88;
                            const r2 = 98;
                            const x1 = r1 * Math.cos(rad);
                            const y1 = -r1 * Math.sin(rad);
                            const x2 = r2 * Math.cos(rad);
                            const y2 = -r2 * Math.sin(rad);
                            return (
                              <g key={deg}>
                                <line
                                  x1={x1}
                                  y1={y1}
                                  x2={x2}
                                  y2={y2}
                                  stroke={is50 ? '#38bdf8' : is90 ? '#f59e0b' : '#94a3b8'}
                                  strokeWidth={is50 || is90 ? 2 : 1}
                                />
                                {(deg % 30 === 0 || is50) && (
                                  <text
                                    x={(r1 - 10) * Math.cos(rad)}
                                    y={-(r1 - 10) * Math.sin(rad) + 3}
                                    fontFamily="system-ui"
                                    fontSize="7.5"
                                    fontWeight={is50 ? '900' : 'bold'}
                                    fill={is50 ? '#38bdf8' : '#94a3b8'}
                                    textAnchor="middle"
                                  >
                                    {deg}°
                                  </text>
                                )}
                              </g>
                            );
                          })}
                        </g>
                      )}

                      {/* Başlangıç [AB Işını (Yatay, A(60, 160) -> B(260, 160)) */}
                      <line x1="60" y1="160" x2="290" y2="160" stroke="#f8fafc" strokeWidth="3" />
                      <polygon points="285,156 295,160 285,164" fill="#f8fafc" />

                      {/* İnşa Edilen [AC Işını (Dinamik Açı) */}
                      {task1Angle > 0 && (() => {
                        const rad = (task1Angle * Math.PI) / 180;
                        const len = 140;
                        const endX = 60 + len * Math.cos(rad);
                        const endY = 160 - len * Math.sin(rad);
                        const arcR = 40;
                        const arcEndX = 60 + arcR * Math.cos(rad);
                        const arcEndY = 160 - arcR * Math.sin(rad);

                        return (
                          <g>
                            {/* Açı Yayı Dolgusu */}
                            <path
                              d={`M 60 160 L ${60 + arcR} 160 A ${arcR} ${arcR} 0 0 0 ${arcEndX} ${arcEndY} Z`}
                              fill={task1Color}
                              fillOpacity="0.25"
                            />
                            {/* Açı Yayı Sınırı */}
                            <path
                              d={`M ${60 + arcR} 160 A ${arcR} ${arcR} 0 0 0 ${arcEndX} ${arcEndY}`}
                              fill="none"
                              stroke={task1Color}
                              strokeWidth="2"
                            />
                            {/* Işın [AC */}
                            <line x1="60" y1="160" x2={endX} y2={endY} stroke={task1Color} strokeWidth="3" />
                            {/* Işın Ucu Oku */}
                            <circle cx={endX} cy={endY} r="4" fill={task1Color} />
                            <text
                              x={endX + 8}
                              y={endY + 4}
                              fontFamily="system-ui"
                              fontSize="12"
                              fontWeight="900"
                              fill={task1Color}
                            >
                              C
                            </text>
                            {/* Derece Etiketi */}
                            <text
                              x={60 + (arcR + 18) * Math.cos(rad / 2)}
                              y={160 - (arcR + 18) * Math.sin(rad / 2) + 4}
                              fontFamily="system-ui"
                              fontSize="11"
                              fontWeight="900"
                              fill="#f8fafc"
                              textAnchor="middle"
                            >
                              {task1Angle}°
                            </text>
                          </g>
                        );
                      })()}

                      {/* Vertex A & Nokta B */}
                      <circle cx="60" cy="160" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                      <text x="44" y="165" textAnchor="end" fontFamily="system-ui" fontSize="13" fontWeight="900" fill="#38bdf8">
                        [A
                      </text>
                      <circle cx="230" cy="160" r="4.5" fill="#f8fafc" />
                      <text x="230" y="180" fontFamily="system-ui" fontSize="12" fontWeight="800" fill="#f8fafc" textAnchor="middle">
                        B
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Açı Ayar Kontrolleri */}
                <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Açı Ayarı: <strong className="font-mono text-sky-600 dark:text-sky-400">{task1Angle}°</strong></span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleTask1AngleChange(Math.max(0, task1Angle - 1))}
                        className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        -1°
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTask1AngleChange(Math.min(180, task1Angle + 1))}
                        className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        +1°
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTask1AngleChange(50)}
                        className="px-2 py-0.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] cursor-pointer"
                      >
                        50°'ye Hizala
                      </button>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={task1Angle}
                    onChange={(e) => handleTask1AngleChange(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Durum Bildirimi */}
              {task1Completed ? (
                <div className="mt-3 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <span>🎉</span>
                  <span>Harika! Tam 50°'lik dar açı başarıyla inşa edildi ve [AC ışını birleştirildi.</span>
                </div>
              ) : (
                <div className="mt-3 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-slate-500 dark:text-slate-400 text-xs text-center font-medium">
                  🎯 İletkiyi kullanarak açıyı <strong>tam 50°'ye</strong> getiriniz.
                </div>
              )}
            </div>

            {/* GÖREV 2: 140° GENİŞ AÇI İNŞASI */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-purple-500/30 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-purple-900/50">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-xs">
                      2
                    </span>
                    <span className="font-black text-sm text-purple-950 dark:text-purple-100">
                      GÖREV 2: [KL Işınından 140° Geniş Açı İnşası
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-black ${
                      task2Completed
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-purple-50 text-purple-800 border border-purple-200'
                    }`}
                  >
                    {task2Completed ? '✅ 50 Puan' : '50 Puan'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>Yönerge:</strong> Verilen <code>[KL</code> ışınını kullanarak <strong>tam 140°'lik</strong> bir geniş açı çiz. Açının yayını renkli kalemle belirle.
                </p>

                {/* İnteraktif Çizim Alanı (Görev 2) */}
                <div className="bg-slate-900 rounded-2xl p-3 border border-slate-800 relative overflow-hidden flex flex-col items-center">
                  <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-300 mb-2">
                    <span className="text-purple-400 font-mono">
                      Mevcut Açı: {task2Angle}° {task2Angle === 140 ? '🎯 (Tam Hedef!)' : task2Angle < 140 ? '(Daha Genişlet)' : '(Daha Daralt)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTask2Protractor(!showTask2Protractor)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        showTask2Protractor
                          ? 'bg-purple-600 text-white border-purple-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {showTask2Protractor ? 'İletkiyi Gizle' : 'Sanal İletkiyi Aç'}
                    </button>
                  </div>

                  <div className="w-full h-56 relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 340 200" className="w-full h-full select-none">
                      {/* Milimetrik Grid */}
                      <defs>
                        <pattern id="grid_task2_sim" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                        </pattern>
                      </defs>
                      <rect width="340" height="200" fill="url(#grid_task2_sim)" />

                      {/* Sanal İletki Şablonu (K(180, 160) veya K(60, 160) Merkezli) */}
                      {showTask2Protractor && (
                        <g transform="translate(60, 160)" opacity="0.45" className="transition-opacity">
                          {/* İletki Yarım Dairesi */}
                          <path d="M -100 0 A 100 100 0 0 1 100 0 Z" fill="#7c3aed" fillOpacity="0.15" stroke="#a855f7" strokeWidth="1.5" />
                          <circle cx="0" cy="0" r="10" fill="none" stroke="#a855f7" strokeWidth="1" />
                          <line x1="-95" y1="0" x2="95" y2="0" stroke="#a855f7" strokeWidth="1.5" />
                          <line x1="0" y1="0" x2="0" y2="-95" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" />

                          {/* Derece İşaretleri */}
                          {Array.from({ length: 19 }).map((_, i) => {
                            const deg = i * 10;
                            const rad = (deg * Math.PI) / 180;
                            const is140 = deg === 140;
                            const is90 = deg === 90;
                            const r1 = is140 || is90 ? 82 : 88;
                            const r2 = 98;
                            const x1 = r1 * Math.cos(rad);
                            const y1 = -r1 * Math.sin(rad);
                            const x2 = r2 * Math.cos(rad);
                            const y2 = -r2 * Math.sin(rad);
                            return (
                              <g key={deg}>
                                <line
                                  x1={x1}
                                  y1={y1}
                                  x2={x2}
                                  y2={y2}
                                  stroke={is140 ? '#c084fc' : is90 ? '#f59e0b' : '#94a3b8'}
                                  strokeWidth={is140 || is90 ? 2 : 1}
                                />
                                {(deg % 30 === 0 || is140) && (
                                  <text
                                    x={(r1 - 10) * Math.cos(rad)}
                                    y={-(r1 - 10) * Math.sin(rad) + 3}
                                    fontFamily="system-ui"
                                    fontSize="7.5"
                                    fontWeight={is140 ? '900' : 'bold'}
                                    fill={is140 ? '#c084fc' : '#94a3b8'}
                                    textAnchor="middle"
                                  >
                                    {deg}°
                                  </text>
                                )}
                              </g>
                            );
                          })}
                        </g>
                      )}

                      {/* Başlangıç [KL Işını (Yatay, K(60, 160) -> L(260, 160)) */}
                      <line x1="60" y1="160" x2="290" y2="160" stroke="#f8fafc" strokeWidth="3" />
                      <polygon points="285,156 295,160 285,164" fill="#f8fafc" />

                      {/* İnşa Edilen [KM Işını (Dinamik Geniş Açı) */}
                      {task2Angle > 0 && (() => {
                        const rad = (task2Angle * Math.PI) / 180;
                        const len = 140;
                        const endX = 60 + len * Math.cos(rad);
                        const endY = 160 - len * Math.sin(rad);
                        const arcR = 40;
                        const arcEndX = 60 + arcR * Math.cos(rad);
                        const arcEndY = 160 - arcR * Math.sin(rad);

                        return (
                          <g>
                            {/* Açı Yayı Dolgusu */}
                            <path
                              d={`M 60 160 L ${60 + arcR} 160 A ${arcR} ${arcR} 0 0 0 ${arcEndX} ${arcEndY} Z`}
                              fill={task2Color}
                              fillOpacity="0.25"
                            />
                            {/* Açı Yayı Sınırı */}
                            <path
                              d={`M ${60 + arcR} 160 A ${arcR} ${arcR} 0 0 0 ${arcEndX} ${arcEndY}`}
                              fill="none"
                              stroke={task2Color}
                              strokeWidth="2"
                            />
                            {/* Işın [KM */}
                            <line x1="60" y1="160" x2={endX} y2={endY} stroke={task2Color} strokeWidth="3" />
                            <circle cx={endX} cy={endY} r="4" fill={task2Color} />
                            <text
                              x={endX - 16}
                              y={endY + 4}
                              fontFamily="system-ui"
                              fontSize="12"
                              fontWeight="900"
                              fill={task2Color}
                            >
                              M
                            </text>
                            {/* Derece Etiketi */}
                            <text
                              x={60 + (arcR + 18) * Math.cos(rad / 2)}
                              y={160 - (arcR + 18) * Math.sin(rad / 2) + 4}
                              fontFamily="system-ui"
                              fontSize="11"
                              fontWeight="900"
                              fill="#f8fafc"
                              textAnchor="middle"
                            >
                              {task2Angle}°
                            </text>
                          </g>
                        );
                      })()}

                      {/* Vertex K & Nokta L */}
                      <circle cx="60" cy="160" r="6" fill="#7c3aed" stroke="#ffffff" strokeWidth="2" />
                      <text x="44" y="165" textAnchor="end" fontFamily="system-ui" fontSize="13" fontWeight="900" fill="#a855f7">
                        [K
                      </text>
                      <circle cx="230" cy="160" r="4.5" fill="#f8fafc" />
                      <text x="230" y="180" fontFamily="system-ui" fontSize="12" fontWeight="800" fill="#f8fafc" textAnchor="middle">
                        L
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Açı Ayar Kontrolleri */}
                <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Açı Ayarı: <strong className="font-mono text-purple-600 dark:text-purple-400">{task2Angle}°</strong></span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleTask2AngleChange(Math.max(0, task2Angle - 1))}
                        className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        -1°
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTask2AngleChange(Math.min(180, task2Angle + 1))}
                        className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        +1°
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTask2AngleChange(140)}
                        className="px-2 py-0.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] cursor-pointer"
                      >
                        140°'ye Hizala
                      </button>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={task2Angle}
                    onChange={(e) => handleTask2AngleChange(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Durum Bildirimi */}
              {task2Completed ? (
                <div className="mt-3 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <span>🎉</span>
                  <span>Kusursuz! Tam 140°'lik geniş açı başarıyla inşa edildi ve renkli yayla belirlendi.</span>
                </div>
              ) : (
                <div className="mt-3 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-slate-500 dark:text-slate-400 text-xs text-center font-medium">
                  🎯 İletkiyi kullanarak açıyı <strong>tam 140°'ye</strong> getiriniz.
                </div>
              )}
            </div>

          </div>

          {/* Tartış & Kendini Değerlendir Kontrol Listesi */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm">
                <span className="text-emerald-500 text-lg">✅</span>
                <span>GEOMETRİK ÇIKARIM &amp; KENDİNİ DEĞERLENDİRME KONTROL LİSTESİ</span>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {Object.values(constructionChecklist).filter(Boolean).length} / 4 İşaretlendi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'c1', label: '1. İletkinin merkezini köşe noktasına (A ve K) tam oturttum.' },
                { id: 'c2', label: '2. Taban çizgisini 0° çizgisi ile tam çakıştırdım.' },
                { id: 'c3', label: '3. 50° dar açımın dik açıdan (90°) daha dar olduğunu doğruladım.' },
                { id: 'c4', label: '4. 140° geniş açımın dik açıdan (90°) daha geniş olduğunu doğruladım.' }
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    constructionChecklist[item.id as keyof typeof constructionChecklist]
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 text-emerald-950 dark:text-emerald-200 font-bold'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={constructionChecklist[item.id as keyof typeof constructionChecklist]}
                    onChange={(e) => {
                      playSound('click');
                      setConstructionChecklist((prev) => ({ ...prev, [item.id]: e.target.checked }));
                    }}
                    className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      ) : isMeasuringStationsActivity ? (
        /* ========================================================================= */
        /* ETKİNLİK: "AŞAMALI AÇI ÖLÇÜM İSTASYONLARI" (UYGULAMA - MAT.5.3.3)         */
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* İSTASYON A: STANDART YATAY AÇILAR (Tabanı Düz Durumlar) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-sky-500/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2 text-sky-900 font-black text-sm sm:text-base">
                <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold text-sm">
                  📍
                </div>
                <span>İSTASYON A: STANDART YATAY AÇILAR (Tabanı Düz Durumlar)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-50 text-sky-800 border border-sky-200">
                  {Object.values(stationACorrect).filter(Boolean).length} / 3 Tamamlandı (35 Puan)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Aşağıdaki 3 standart açının köşe ve kollarını incele. Sanal iletkiyi açarak açının kollarını hizala ve ölçtüğün dereceyi kutucuğa yaz.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* AÇI 1: 45° DAR AÇI */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-sky-900">AÇI 1: Dar Açı</span>
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setShowProtractorA((p) => ({ ...p, a1: !p.a1 }));
                      }}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                        showProtractorA.a1
                          ? 'bg-sky-600 text-white border-sky-500 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {showProtractorA.a1 ? 'İletkiyi Gizle' : 'İletkiyi Göster'}
                    </button>
                  </div>

                  <div className="h-36 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 240 140" className="w-full h-full select-none">
                      {/* Vertex O1 */}
                      <circle cx="40" cy="110" r="4" fill="#38bdf8" />
                      <text x="25" y="115" fill="#bae6fd" fontSize="9" fontWeight="bold">O₁</text>
                      
                      {/* Taban Kolu (Sağa) */}
                      <line x1="40" y1="110" x2="200" y2="110" stroke="#f8fafc" strokeWidth="2.5" />
                      <polygon points="195,106 205,110 195,114" fill="#f8fafc" />
                      
                      {/* 45° Kolu */}
                      <line x1="40" y1="110" x2="135" y2="15" stroke="#38bdf8" strokeWidth="2.5" />
                      <polygon points="128,15 139,12 136,23" fill="#38bdf8" />

                      {/* Açı Yayı */}
                      <path d="M 85 110 A 45 45 0 0 0 72 78" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
                      <text x="85" y="95" fill="#38bdf8" fontSize="10" fontWeight="900">?</text>

                      {/* Sanal İletki Şeffaf Katmanı */}
                      {showProtractorA.a1 && (
                        <g opacity="0.85">
                          <path d="M -30 110 A 70 70 0 0 1 110 110 Z" fill="#0284c7" fillOpacity="0.25" stroke="#0ea5e9" strokeWidth="1.5" />
                          <circle cx="40" cy="110" r="2.5" fill="#ef4444" />
                          {/* 0° tick */}
                          <line x1="110" y1="110" x2="102" y2="110" stroke="#f8fafc" strokeWidth="1.5" />
                          <text x="100" y="106" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="end">0°</text>
                          {/* 45° tick */}
                          <line x1="89.5" y1="60.5" x2="84" y2="66" stroke="#fbbf24" strokeWidth="2" />
                          <text x="96" y="58" fill="#fbbf24" fontSize="8.5" fontWeight="900">45°</text>
                          {/* 90° tick */}
                          <line x1="40" y1="40" x2="40" y2="48" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="2 2" />
                          <text x="40" y="36" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="middle">90°</text>
                          {/* 135° tick */}
                          <line x1="-9.5" y1="60.5" x2="-4" y2="66" stroke="#f8fafc" strokeWidth="1" />
                          <text x="-8" y="58" fill="#94a3b8" fontSize="7">135°</text>
                        </g>
                      )}
                    </svg>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="Derece (örn: 45)"
                        value={stationAInputs.a1}
                        onChange={(e) => setStationAInputs((p) => ({ ...p, a1: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <span className="absolute right-3 top-2 font-mono text-xs font-bold text-slate-400">°</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCheckStationA('a1', 45)}
                      className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      Kontrol Et
                    </button>
                  </div>

                  {stationASubmitted.a1 && (
                    <div
                      className={`p-2 rounded-xl text-[11px] font-semibold leading-snug animate-in fade-in ${
                        stationACorrect.a1
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {stationACorrect.a1
                        ? '✓ DOĞRU! 45° dar açıdır. İç ölçekten 0°den 45°ye kadar olan açıklık okundu.'
                        : '✗ DİKKAT! Açı 90°den dar bir dar açıdır. İletkinin 0° hizasından başlayarak 45°yi okumalısın.'}
                    </div>
                  )}
                </div>
              </div>

              {/* AÇI 2: 90° DİK AÇI */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-teal-900">AÇI 2: Dik Açı</span>
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setShowProtractorA((p) => ({ ...p, a2: !p.a2 }));
                      }}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                        showProtractorA.a2
                          ? 'bg-teal-600 text-white border-teal-500 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {showProtractorA.a2 ? 'İletkiyi Gizle' : 'İletkiyi Göster'}
                    </button>
                  </div>

                  <div className="h-36 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 240 140" className="w-full h-full select-none">
                      {/* Vertex O2 */}
                      <circle cx="50" cy="110" r="4" fill="#14b8a6" />
                      <text x="35" y="115" fill="#99f6e4" fontSize="9" fontWeight="bold">O₂</text>
                      
                      {/* Taban Kolu */}
                      <line x1="50" y1="110" x2="200" y2="110" stroke="#f8fafc" strokeWidth="2.5" />
                      <polygon points="195,106 205,110 195,114" fill="#f8fafc" />
                      
                      {/* 90° Dikey Kol */}
                      <line x1="50" y1="110" x2="50" y2="20" stroke="#14b8a6" strokeWidth="2.5" />
                      <polygon points="46,25 50,15 54,25" fill="#14b8a6" />

                      {/* Diklik Sembolü Kutusu (⊾) */}
                      <rect x="50" y="92" width="18" height="18" fill="#14b8a6" fillOpacity="0.2" stroke="#14b8a6" strokeWidth="1.8" />
                      <circle cx="59" cy="101" r="2.5" fill="#14b8a6" />

                      {/* Sanal İletki Şeffaf Katmanı */}
                      {showProtractorA.a2 && (
                        <g opacity="0.85">
                          <path d="M -20 110 A 70 70 0 0 1 120 110 Z" fill="#0d9488" fillOpacity="0.25" stroke="#14b8a6" strokeWidth="1.5" />
                          <circle cx="50" cy="110" r="2.5" fill="#ef4444" />
                          {/* 0° tick */}
                          <line x1="120" y1="110" x2="112" y2="110" stroke="#f8fafc" strokeWidth="1.5" />
                          <text x="110" y="106" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="end">0°</text>
                          {/* 90° tick */}
                          <line x1="50" y1="40" x2="50" y2="48" stroke="#fbbf24" strokeWidth="2.5" />
                          <text x="50" y="35" fill="#fbbf24" fontSize="9" fontWeight="900" textAnchor="middle">90° (DİK)</text>
                        </g>
                      )}
                    </svg>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="Derece (örn: 90)"
                        value={stationAInputs.a2}
                        onChange={(e) => setStationAInputs((p) => ({ ...p, a2: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <span className="absolute right-3 top-2 font-mono text-xs font-bold text-slate-400">°</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCheckStationA('a2', 90)}
                      className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      Kontrol Et
                    </button>
                  </div>

                  {stationASubmitted.a2 && (
                    <div
                      className={`p-2 rounded-xl text-[11px] font-semibold leading-snug animate-in fade-in ${
                        stationACorrect.a2
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {stationACorrect.a2
                        ? '✓ KUSURSUZ! 90° tam dik açıdır. İletkinin tam tepe dikme hizasında okunur.'
                        : '✗ DİKKAT! Dik açının ölçüsü tam 90° olmalıdır.'}
                    </div>
                  )}
                </div>
              </div>

              {/* AÇI 3: 135° GENİŞ AÇI */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-amber-900">AÇI 3: Geniş Açı</span>
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setShowProtractorA((p) => ({ ...p, a3: !p.a3 }));
                      }}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                        showProtractorA.a3
                          ? 'bg-amber-600 text-white border-amber-500 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {showProtractorA.a3 ? 'İletkiyi Gizle' : 'İletkiyi Göster'}
                    </button>
                  </div>

                  <div className="h-36 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 240 140" className="w-full h-full select-none">
                      {/* Vertex O3 */}
                      <circle cx="160" cy="110" r="4" fill="#f59e0b" />
                      <text x="175" y="115" fill="#fde68a" fontSize="9" fontWeight="bold">O₃</text>
                      
                      {/* Taban Kolu (Sağa) */}
                      <line x1="160" y1="110" x2="225" y2="110" stroke="#f8fafc" strokeWidth="2.5" />
                      <polygon points="220,106 230,110 220,114" fill="#f8fafc" />
                      
                      {/* 135° Kolu (Sola Yukarı) */}
                      <line x1="160" y1="110" x2="65" y2="15" stroke="#f59e0b" strokeWidth="2.5" />
                      <polygon points="62,23 60,10 72,14" fill="#f59e0b" />

                      {/* Açı Yayı */}
                      <path d="M 205 110 A 45 45 0 0 0 128 78" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
                      <text x="160" y="80" fill="#f59e0b" fontSize="10" fontWeight="900">?</text>

                      {/* Sanal İletki Şeffaf Katmanı */}
                      {showProtractorA.a3 && (
                        <g opacity="0.85">
                          <path d="M 90 110 A 70 70 0 0 1 230 110 Z" fill="#d97706" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1.5" />
                          <circle cx="160" cy="110" r="2.5" fill="#ef4444" />
                          {/* 0° tick */}
                          <line x1="230" y1="110" x2="222" y2="110" stroke="#f8fafc" strokeWidth="1.5" />
                          <text x="220" y="106" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="end">0°</text>
                          {/* 90° tick */}
                          <line x1="160" y1="40" x2="160" y2="48" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="2 2" />
                          <text x="160" y="36" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="middle">90°</text>
                          {/* 135° tick */}
                          <line x1="110.5" y1="60.5" x2="116" y2="66" stroke="#fbbf24" strokeWidth="2" />
                          <text x="100" y="58" fill="#fbbf24" fontSize="8.5" fontWeight="900">135°</text>
                        </g>
                      )}
                    </svg>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="Derece (örn: 135)"
                        value={stationAInputs.a3}
                        onChange={(e) => setStationAInputs((p) => ({ ...p, a3: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="absolute right-3 top-2 font-mono text-xs font-bold text-slate-400">°</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCheckStationA('a3', 135)}
                      className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      Kontrol Et
                    </button>
                  </div>

                  {stationASubmitted.a3 && (
                    <div
                      className={`p-2 rounded-xl text-[11px] font-semibold leading-snug animate-in fade-in ${
                        stationACorrect.a3
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {stationACorrect.a3
                        ? '✓ TEBRİKLER! 135° geniş açıdır. 45° tuzağına düşmeyip doğru iç ölçeği okudun!'
                        : '✗ DİKKAT! Açı 90°den bariz biçimde geniştir. 45° dar açıdır, doğru değer 135° olmalıdır.'}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* 2. İSTASYON B: DÖNEN RADARLAR (Eğik ve Baş Aşağı Açılar) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-purple-500/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2 text-purple-900 font-black text-sm sm:text-base">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm">
                  🔄
                </div>
                <span>İSTASYON B: DÖNEN RADARLAR (Eğik ve Baş Aşağı Açılar)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-800 border border-purple-200">
                  {Object.values(stationBCorrect).filter(Boolean).length} / 2 Tamamlandı (35 Puan)
                </span>
              </div>
            </div>

            {/* Kritik Yönerge Kutusu */}
            <div className="p-3.5 bg-purple-50 border-2 border-purple-200 rounded-2xl flex items-center gap-3">
              <span className="text-2xl">🧭</span>
              <div>
                <div className="text-xs font-black text-purple-900 uppercase">
                  RADAR YÖNERGESİ:
                </div>
                <p className="text-xs text-purple-800 font-medium">
                  &ldquo;Açıların tabanı yatay değil! İletkini veya kâğıdını çevirerek iletkinin taban çizgisini açının koluna tam hizala.&rdquo;
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* AÇI 4: SAĞA EĞİK 60° */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-purple-900">AÇI 4: Sağa Eğik Radar (60°)</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click');
                          setProtractorRotations((p) => ({ ...p, a4: p.a4 === 30 ? 0 : 30 }));
                        }}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300 hover:bg-purple-200 transition-all cursor-pointer"
                      >
                        {protractorRotations.a4 === 30 ? '0° Sıfırla' : 'Kol 1\'e Hizala (30° Döndür)'}
                      </button>
                    </div>
                  </div>

                  <div className="h-44 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 240 150" className="w-full h-full select-none">
                      {/* Vertex O4 */}
                      <circle cx="60" cy="115" r="4" fill="#a855f7" />
                      <text x="45" y="125" fill="#e9d5ff" fontSize="9" fontWeight="bold">O₄</text>
                      
                      {/* Kol 1 (30° eğimle sağa yukarı: dx=140*cos(30)=121, dy=-140*sin(30)=-70 -> (181, 45)) */}
                      <line x1="60" y1="115" x2="195" y2="37" stroke="#f8fafc" strokeWidth="2.5" />
                      <polygon points="188,35 198,35 194,45" fill="#f8fafc" />
                      <text x="200" y="50" fill="#94a3b8" fontSize="8" fontWeight="bold">Kol 1 (30°)</text>

                      {/* Kol 2 (90° dikey yukarı -> (60, 20)) */}
                      <line x1="60" y1="115" x2="60" y2="20" stroke="#c084fc" strokeWidth="2.5" />
                      <polygon points="56,25 60,15 64,25" fill="#c084fc" />
                      <text x="68" y="25" fill="#c084fc" fontSize="8" fontWeight="bold">Kol 2 (90°)</text>

                      {/* Açı Yayı (30° to 90° -> 60° açıklık) */}
                      <path d="M 103 90 A 50 50 0 0 0 60 65" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="3 2" />
                      <text x="85" y="75" fill="#c084fc" fontSize="10" fontWeight="900">?</text>

                      {/* Dönen İletki Katmanı (Merkez 60, 115) */}
                      {showProtractorB.a4 && (
                        <g transform={`rotate(${-protractorRotations.a4}, 60, 115)`} opacity="0.85" className="transition-transform duration-500 ease-out">
                          <path d="M -10 115 A 70 70 0 0 1 130 115 Z" fill="#7c3aed" fillOpacity="0.25" stroke="#a855f7" strokeWidth="1.5" />
                          <circle cx="60" cy="115" r="2.5" fill="#ef4444" />
                          {/* Taban Çizgisi */}
                          <line x1="-10" y1="115" x2="130" y2="115" stroke="#fbbf24" strokeWidth="1.5" />
                          {/* 0° tick */}
                          <text x="125" y="111" fill="#fbbf24" fontSize="7" fontWeight="bold" textAnchor="end">0°</text>
                          {/* 60° tick */}
                          <line x1="95" y1="54.4" x2="90" y2="63" stroke="#38bdf8" strokeWidth="2" />
                          <text x="100" y="52" fill="#38bdf8" fontSize="8.5" fontWeight="900">60°</text>
                          {/* 90° tick */}
                          <line x1="60" y1="45" x2="60" y2="53" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="2 2" />
                          <text x="60" y="41" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="middle">90°</text>
                        </g>
                      )}
                    </svg>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="Derece (örn: 60)"
                        value={stationBInputs.a4}
                        onChange={(e) => setStationBInputs((p) => ({ ...p, a4: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="absolute right-3 top-2 font-mono text-xs font-bold text-slate-400">°</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCheckStationB('a4', 60)}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      Kontrol Et
                    </button>
                  </div>

                  {stationBSubmitted.a4 && (
                    <div
                      className={`p-2 rounded-xl text-[11px] font-semibold leading-snug animate-in fade-in ${
                        stationBCorrect.a4
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {stationBCorrect.a4
                        ? '✓ BRAVO! İletkiyi 30° döndürüp tabanını Kol 1 ile hizaladın ve Kol 2\'nin 60° olduğunu tam olarak ölçtün!'
                        : '✗ DİKKAT! "Kol 1\'e Hizala" butonuna basarak iletkiyi döndür. Taban Kol 1\'deyken Kol 2 kaç dereceyi gösteriyor?'}
                    </div>
                  )}
                </div>
              </div>

              {/* AÇI 5: BAŞ AŞAĞI 120° */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-rose-900">AÇI 5: Baş Aşağı Radar (120°)</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click');
                          setProtractorRotations((p) => ({ ...p, a5: p.a5 === 180 ? 0 : 180 }));
                        }}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 transition-all cursor-pointer"
                      >
                        {protractorRotations.a5 === 180 ? '0° Sıfırla' : 'Tabana Hizala (180° Ters Çevir)'}
                      </button>
                    </div>
                  </div>

                  <div className="h-44 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 240 150" className="w-full h-full select-none">
                      {/* Vertex O5 */}
                      <circle cx="120" cy="30" r="4" fill="#f43f5e" />
                      <text x="120" y="20" fill="#fecdd3" fontSize="9" fontWeight="bold" textAnchor="middle">O₅ (Tepe)</text>
                      
                      {/* Sol Aşağı Kol (120° açılma -> (40, 110)) */}
                      <line x1="120" y1="30" x2="40" y2="110" stroke="#f43f5e" strokeWidth="2.5" />
                      <polygon points="38,98 35,114 49,108" fill="#f43f5e" />
                      <text x="30" y="125" fill="#f43f5e" fontSize="8" fontWeight="bold">Kol A</text>

                      {/* Sağ Aşağı Kol -> (200, 110) */}
                      <line x1="120" y1="30" x2="200" y2="110" stroke="#f8fafc" strokeWidth="2.5" />
                      <polygon points="191,108 205,114 202,98" fill="#f8fafc" />
                      <text x="205" y="125" fill="#94a3b8" fontSize="8" fontWeight="bold">Kol B</text>

                      {/* Açı Yayı (Aşağı doğru) */}
                      <path d="M 85 65 A 50 50 0 0 0 155 65" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 2" />
                      <text x="120" y="75" fill="#f43f5e" fontSize="10" fontWeight="900" textAnchor="middle">?</text>

                      {/* Dönen / Ters İletki Katmanı (Merkez 120, 30) */}
                      {showProtractorB.a5 && (
                        <g transform={`rotate(${protractorRotations.a5}, 120, 30)`} opacity="0.85" className="transition-transform duration-500 ease-out">
                          <path d="M 50 30 A 70 70 0 0 1 190 30 Z" fill="#e11d48" fillOpacity="0.25" stroke="#f43f5e" strokeWidth="1.5" />
                          <circle cx="120" cy="30" r="2.5" fill="#fbbf24" />
                          {/* Taban Çizgisi */}
                          <line x1="50" y1="30" x2="190" y2="30" stroke="#fbbf24" strokeWidth="1.5" />
                          {/* 0° tick */}
                          <text x="185" y="26" fill="#fbbf24" fontSize="7" fontWeight="bold" textAnchor="end">0°</text>
                          {/* 120° tick */}
                          <line x1="85" y1="-30.6" x2="90" y2="-22" stroke="#38bdf8" strokeWidth="2" />
                          <text x="75" y="-32" fill="#38bdf8" fontSize="8.5" fontWeight="900">120°</text>
                        </g>
                      )}
                    </svg>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="Derece (örn: 120)"
                        value={stationBInputs.a5}
                        onChange={(e) => setStationBInputs((p) => ({ ...p, a5: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <span className="absolute right-3 top-2 font-mono text-xs font-bold text-slate-400">°</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCheckStationB('a5', 120)}
                      className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      Kontrol Et
                    </button>
                  </div>

                  {stationBSubmitted.a5 && (
                    <div
                      className={`p-2 rounded-xl text-[11px] font-semibold leading-snug animate-in fade-in ${
                        stationBCorrect.a5
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {stationBCorrect.a5
                        ? '✓ MÜKEMMEL! İletkiyi ters çevirerek açının kollarını tam kavradın ve 120° geniş açıyı doğru okudun!'
                        : '✗ DİKKAT! "180° Ters Çevir" butonuna basarak iletkinin açılış yönünü kollarla eşle ve 120° değerini doğrula.'}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* 3. İSTASYON C: TAHMİN ET ➔ ÖLÇ ➔ KARŞILAŞTIR TABLOSU */}
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm sm:text-base">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  📊
                </div>
                <span>İSTASYON C: "TAHMİN ET ➔ ÖLÇ ➔ KARŞILAŞTIR" TABLOSU</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {[estimateTable.scissors.measured, estimateTable.clock.measured, estimateTable.roof.measured].filter(Boolean).length} / 3 Tamamlandı (30 Puan)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Aşağıdaki gerçek yaşam nesnelerinin açı türünü ve tahmini dereceni yaz. Ardından <strong>"İletkiyle Ölç"</strong> butonuna basarak gerçek açı ile karşılaştır ve hata payını incele!
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-emerald-50/80 text-emerald-950 border-b-2 border-emerald-200">
                    <th className="p-3 font-black w-1/4">Gerçek Yaşam Şekli</th>
                    <th className="p-3 font-black w-1/3">1. Göz Kararı Tahminim (Tür & Derece)</th>
                    <th className="p-3 font-black w-1/5 text-center">2. İletki ile Gerçek Ölçüm</th>
                    <th className="p-3 font-black w-1/5 text-center">3. Fark (Hata Payı)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  
                  {/* Satır 1: Açık Makas (35°) */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 p-1 flex items-center justify-center shrink-0">
                          <svg viewBox="0 0 60 60" className="w-full h-full">
                            {/* Makas Kolları (35° açıklık) */}
                            <circle cx="20" cy="30" r="3" fill="#38bdf8" />
                            <line x1="20" y1="30" x2="52" y2="18" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="20" y1="30" x2="52" y2="40" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M 38 23 A 20 20 0 0 1 38 36" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-black text-slate-800 text-xs">✂️ Açık Makas Açısı</div>
                          <div className="text-[10px] text-slate-400">Kesici ağız açıklığı</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={estimateTable.scissors.type}
                          onChange={(e) =>
                            setEstimateTable((p) => ({
                              ...p,
                              scissors: { ...p.scissors, type: e.target.value }
                            }))
                          }
                          className="px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Tür Seç...</option>
                          <option value="dar">Dar Açı (&lt;90°)</option>
                          <option value="dik">Dik Açı (90°)</option>
                          <option value="genis">Geniş Açı (&gt;90°)</option>
                        </select>
                        <div className="relative w-24">
                          <input
                            type="number"
                            placeholder="Tahmin"
                            value={estimateTable.scissors.est}
                            onChange={(e) =>
                              setEstimateTable((p) => ({
                                ...p,
                                scissors: { ...p.scissors, est: e.target.value }
                              }))
                            }
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <span className="absolute right-2 top-1.5 font-mono text-slate-400 font-bold">°</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      {estimateTable.scissors.measured ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-mono font-black text-sm border border-emerald-300 animate-in zoom-in-95">
                          <span>35°</span>
                          <span className="text-[9px] font-sans font-bold">(Dar)</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleMeasureStationC('scissors')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                        >
                          İletkiyle Ölç
                        </button>
                      )}
                    </td>

                    <td className="p-3 text-center font-mono">
                      {estimateTable.scissors.measured ? (
                        (() => {
                          const est = parseInt(estimateTable.scissors.est, 10);
                          if (isNaN(est)) {
                            return <span className="text-slate-400 text-[11px]">- (Tahmin girilmedi)</span>;
                          }
                          const diff = Math.abs(est - 35);
                          return (
                            <div className="space-y-0.5">
                              <span className={`font-black text-xs ${diff === 0 ? 'text-emerald-700' : diff <= 5 ? 'text-teal-700' : 'text-amber-700'}`}>
                                |{est}° - 35°| = {diff}°
                              </span>
                              <div>
                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${diff === 0 ? 'bg-emerald-100 text-emerald-800' : diff <= 5 ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'}`}>
                                  {diff === 0 ? '🎯 Tam İsabet' : diff <= 5 ? '🌟 Harika' : '👍 Başarılı'}
                                </span>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>

                  {/* Satır 2: Saat 15:00 (90°) */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 p-1 flex items-center justify-center shrink-0">
                          <svg viewBox="0 0 60 60" className="w-full h-full">
                            {/* Saat Kadranı & Akrep-Yelkovan (90°) */}
                            <circle cx="30" cy="30" r="22" fill="none" stroke="#f8fafc" strokeWidth="2" />
                            <circle cx="30" cy="30" r="2.5" fill="#f59e0b" />
                            <line x1="30" y1="30" x2="30" y2="14" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="30" y1="30" x2="44" y2="30" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                            <rect x="30" y="24" width="6" height="6" fill="none" stroke="#f59e0b" strokeWidth="1" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-black text-slate-800 text-xs">🕒 Saat 15:00 Açısı</div>
                          <div className="text-[10px] text-slate-400">Akrep ile Yelkovan Arası</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={estimateTable.clock.type}
                          onChange={(e) =>
                            setEstimateTable((p) => ({
                              ...p,
                              clock: { ...p.clock, type: e.target.value }
                            }))
                          }
                          className="px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Tür Seç...</option>
                          <option value="dar">Dar Açı (&lt;90°)</option>
                          <option value="dik">Dik Açı (90°)</option>
                          <option value="genis">Geniş Açı (&gt;90°)</option>
                        </select>
                        <div className="relative w-24">
                          <input
                            type="number"
                            placeholder="Tahmin"
                            value={estimateTable.clock.est}
                            onChange={(e) =>
                              setEstimateTable((p) => ({
                                ...p,
                                clock: { ...p.clock, est: e.target.value }
                              }))
                            }
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <span className="absolute right-2 top-1.5 font-mono text-slate-400 font-bold">°</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      {estimateTable.clock.measured ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-mono font-black text-sm border border-emerald-300 animate-in zoom-in-95">
                          <span>90°</span>
                          <span className="text-[9px] font-sans font-bold">(Dik)</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleMeasureStationC('clock')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                        >
                          İletkiyle Ölç
                        </button>
                      )}
                    </td>

                    <td className="p-3 text-center font-mono">
                      {estimateTable.clock.measured ? (
                        (() => {
                          const est = parseInt(estimateTable.clock.est, 10);
                          if (isNaN(est)) {
                            return <span className="text-slate-400 text-[11px]">- (Tahmin girilmedi)</span>;
                          }
                          const diff = Math.abs(est - 90);
                          return (
                            <div className="space-y-0.5">
                              <span className={`font-black text-xs ${diff === 0 ? 'text-emerald-700' : diff <= 5 ? 'text-teal-700' : 'text-amber-700'}`}>
                                |{est}° - 90°| = {diff}°
                              </span>
                              <div>
                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${diff === 0 ? 'bg-emerald-100 text-emerald-800' : diff <= 5 ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'}`}>
                                  {diff === 0 ? '🎯 Tam İsabet' : diff <= 5 ? '🌟 Harika' : '👍 Başarılı'}
                                </span>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>

                  {/* Satır 3: Çatı Eğimi (120°) */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 p-1 flex items-center justify-center shrink-0">
                          <svg viewBox="0 0 60 60" className="w-full h-full">
                            {/* Çatı Makası (120° tepe açısı) */}
                            <polygon points="30,16 8,44 52,44" fill="#334155" opacity="0.4" />
                            <line x1="30" y1="16" x2="8" y2="44" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="30" y1="16" x2="52" y2="44" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="8" y1="44" x2="52" y2="44" stroke="#94a3b8" strokeWidth="1.5" />
                            <path d="M 22 26 A 14 14 0 0 0 38 26" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-black text-slate-800 text-xs">🏠 Çatı Eğimi Açısı</div>
                          <div className="text-[10px] text-slate-400">Ev çatı makası tepe açısı</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={estimateTable.roof.type}
                          onChange={(e) =>
                            setEstimateTable((p) => ({
                              ...p,
                              roof: { ...p.roof, type: e.target.value }
                            }))
                          }
                          className="px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Tür Seç...</option>
                          <option value="dar">Dar Açı (&lt;90°)</option>
                          <option value="dik">Dik Açı (90°)</option>
                          <option value="genis">Geniş Açı (&gt;90°)</option>
                        </select>
                        <div className="relative w-24">
                          <input
                            type="number"
                            placeholder="Tahmin"
                            value={estimateTable.roof.est}
                            onChange={(e) =>
                              setEstimateTable((p) => ({
                                ...p,
                                roof: { ...p.roof, est: e.target.value }
                              }))
                            }
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <span className="absolute right-2 top-1.5 font-mono text-slate-400 font-bold">°</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      {estimateTable.roof.measured ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-mono font-black text-sm border border-emerald-300 animate-in zoom-in-95">
                          <span>120°</span>
                          <span className="text-[9px] font-sans font-bold">(Geniş)</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleMeasureStationC('roof')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                        >
                          İletkiyle Ölç
                        </button>
                      )}
                    </td>

                    <td className="p-3 text-center font-mono">
                      {estimateTable.roof.measured ? (
                        (() => {
                          const est = parseInt(estimateTable.roof.est, 10);
                          if (isNaN(est)) {
                            return <span className="text-slate-400 text-[11px]">- (Tahmin girilmedi)</span>;
                          }
                          const diff = Math.abs(est - 120);
                          return (
                            <div className="space-y-0.5">
                              <span className={`font-black text-xs ${diff === 0 ? 'text-emerald-700' : diff <= 5 ? 'text-teal-700' : 'text-amber-700'}`}>
                                |{est}° - 120°| = {diff}°
                              </span>
                              <div>
                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${diff === 0 ? 'bg-emerald-100 text-emerald-800' : diff <= 5 ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'}`}>
                                  {diff === 0 ? '🎯 Tam İsabet' : diff <= 5 ? '🌟 Harika' : '👍 Başarılı'}
                                </span>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Alt Bilgi & Toplam Puan */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-semibold">
              <Award className="w-4 h-4 text-amber-500" />
              <span>
                <strong>Değerlendirme:</strong> İstasyon A (35P) + İstasyon B (35P) + İstasyon C (30P) = Toplam 100 Puan
              </span>
            </span>
            <span className="font-mono font-bold text-slate-400">www.maarifakademi.com.tr</span>
          </div>

        </div>
      ) : isProtractorAnatomyActivity ? (
        /* ========================================================================= */
        /* ETKİNLİK: "İLETKİNİN ANATOMİSİ" (ARACI TANIMA & ÇİFT ÖLÇEK TUZAĞI)        */
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* 1. 4 KRİTİK PARÇA BİLGİ & SEÇİLEBİLİR ETİKETLEME KARTLARI */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-teal-600" />
                <span>1. Aşama: 4 Kritik Parçayı Seç ve İletki Üzerine Yerleştir</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                {Object.keys(placedAnatomyLabels).length} / 4 Parça Yerleşti
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  key: 'origin',
                  num: '1',
                  title: 'Merkez Noktası (Orijin)',
                  desc: 'Açının köşesinin tam oturması gereken yer.',
                  role: 'Köşe Yuvası',
                  color: 'red',
                  themeBg: 'bg-red-50 hover:bg-red-100/80 border-red-300 text-red-950',
                  activeRing: 'ring-2 ring-red-500 border-red-500 bg-red-100',
                  badgeBg: 'bg-red-100 text-red-800 border-red-200'
                },
                {
                  key: 'baseline',
                  num: '2',
                  title: 'Taban Çizgisi (0° Hattı)',
                  desc: 'Açının bir koluyla çakışması gereken çizgi.',
                  role: 'Kol Hizası',
                  color: 'sky',
                  themeBg: 'bg-sky-50 hover:bg-sky-100/80 border-sky-300 text-sky-950',
                  activeRing: 'ring-2 ring-sky-500 border-sky-500 bg-sky-100',
                  badgeBg: 'bg-sky-100 text-sky-800 border-sky-200'
                },
                {
                  key: 'innerScale',
                  num: '3',
                  title: 'İç Ölçek (Saat Yönü)',
                  desc: '0° → 180° sağdan sola ilerleyen dereceler.',
                  role: 'İç Halka',
                  color: 'amber',
                  themeBg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-300 text-amber-950',
                  activeRing: 'ring-2 ring-amber-500 border-amber-500 bg-amber-100',
                  badgeBg: 'bg-amber-100 text-amber-800 border-amber-200'
                },
                {
                  key: 'outerScale',
                  num: '4',
                  title: 'Dış Ölçek (Ters Yön)',
                  desc: '0° → 180° soldan sağa ilerleyen dereceler.',
                  role: 'Dış Halka',
                  color: 'emerald',
                  themeBg: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-300 text-emerald-950',
                  activeRing: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-100',
                  badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }
              ].map((item) => {
                const isPlaced = placedAnatomyLabels[item.key];
                const isSelected = selectedAnatomyLabelKey === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      if (!isPlaced) handleSelectAnatomyLabel(item.key);
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isPlaced
                        ? 'bg-emerald-50/50 border-emerald-300 opacity-80 cursor-default'
                        : isSelected
                        ? item.activeRing + ' shadow-md scale-[1.02]'
                        : item.themeBg + ' shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 font-black text-xs">
                        <span className="w-5 h-5 rounded-full bg-white shadow-xs border flex items-center justify-center text-[10px]">
                          {item.num}
                        </span>
                        <span className="truncate">{item.title}</span>
                      </div>
                      {isPlaced ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 text-white flex items-center gap-0.5">
                          ✓ Yerleşti
                        </span>
                      ) : (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${item.badgeBg}`}>
                          {isSelected ? 'Seçildi • Hedefe Tıkla' : item.role}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium leading-tight opacity-90">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. GENİŞ İNTERAKTİF ÇİZİM ALANI (SVG 180° İLETKİ ANATOMİSİ) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <span>📐 Şematik İletki Çizim Alanı (180° Standart Açıölçer)</span>
                  {Object.keys(placedAnatomyLabels).length === 4 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs animate-bounce">
                      ✓ 4 Parça Tamamlandı! (+60P)
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedAnatomyLabelKey
                    ? 'Yukarıdan seçtiğiniz etiketin iletki üzerindeki hedef noktasına tıklayınız.'
                    : 'Yukarıdaki kartlardan birine tıklayıp ardından iletki üzerindeki ilgili hedef noktasına dokunun.'}
                </p>
              </div>

              {Object.keys(placedAnatomyLabels).length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setPlacedAnatomyLabels({});
                    setSelectedAnatomyLabelKey(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all"
                >
                  Sıfırla
                </button>
              )}
            </div>

            {/* Interactive SVG Protractor Canvas */}
            <div className="relative w-full h-[280px] sm:h-[320px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-2 select-none">
              <svg viewBox="0 0 760 300" className="w-full h-full" style={{ display: 'block' }}>
                <defs>
                  <radialGradient id="protGlassInteractive" cx="50%" cy="100%" r="90%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                    <stop offset="70%" stopColor="#0f172a" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.25" />
                  </radialGradient>
                  <pattern id="gridProt" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.8" fill="#334155" />
                  </pattern>
                </defs>

                <rect width="760" height="300" fill="url(#gridProt)" />

                {/* Protractor Body Semi-Circle (Center at 380, 240) */}
                <path
                  d="M 140 240 A 240 240 0 0 1 620 240 Z"
                  fill="url(#protGlassInteractive)"
                  stroke="#0ea5e9"
                  strokeWidth="3"
                />
                <path
                  d="M 260 240 A 120 120 0 0 1 500 240 Z"
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />

                {/* Radial Degree Ticks & Numbers (0° to 180°) */}
                {Array.from({ length: 19 }).map((_, i) => {
                  const deg = i * 10;
                  const rad = (deg * Math.PI) / 180;
                  const cos = Math.cos(rad);
                  const sin = Math.sin(rad);

                  // Outer tick mark
                  const x1 = 380 - 240 * cos;
                  const y1 = 240 - 240 * sin;
                  const x2 = 380 - (deg % 30 === 0 ? 220 : deg % 10 === 0 ? 226 : 232) * cos;
                  const y2 = 240 - (deg % 30 === 0 ? 220 : deg % 10 === 0 ? 226 : 232) * sin;

                  // Outer text (0 to 180 counter-clockwise)
                  const txOuter = 380 - 208 * cos;
                  const tyOuter = 240 - 208 * sin + 4;

                  // Inner text (180 to 0 counter-clockwise / 0 to 180 clockwise)
                  const txInner = 380 - 150 * cos;
                  const tyInner = 240 - 150 * sin + 4;

                  return (
                    <g key={deg}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={deg === 90 ? '#ef4444' : '#38bdf8'}
                        strokeWidth={deg % 30 === 0 ? 2.5 : 1.2}
                      />
                      {deg % 30 === 0 && (
                        <>
                          <text
                            x={txOuter}
                            y={tyOuter}
                            fill="#38bdf8"
                            fontSize="10"
                            fontWeight="900"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            {deg}°
                          </text>
                          <text
                            x={txInner}
                            y={tyInner}
                            fill="#f59e0b"
                            fontSize="10"
                            fontWeight="900"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            {180 - deg}°
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}

                {/* Baseline (0° Line) */}
                <line x1="140" y1="240" x2="620" y2="240" stroke="#f8fafc" strokeWidth="3" />

                {/* 90° Perpendicular Center Guide */}
                <line x1="380" y1="240" x2="380" y2="0" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                <text x="380" y="15" fill="#ef4444" fontSize="10" fontWeight="900" textAnchor="middle">
                  90° DİK AÇI HATTI
                </text>

                {/* ========================================================= */}
                {/* 4 INTERACTIVE TARGET SLOTS                                */}
                {/* ========================================================= */}

                {/* TARGET 1: MERKEZ NOKTASI (ORİJİN) */}
                <g
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => handlePlaceAnatomyLabel('origin')}
                >
                  <circle
                    cx="380"
                    cy="240"
                    r={placedAnatomyLabels.origin ? 12 : selectedAnatomyLabelKey === 'origin' ? 14 : 9}
                    fill={placedAnatomyLabels.origin ? '#10b981' : '#ef4444'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className={selectedAnatomyLabelKey === 'origin' ? 'animate-pulse' : ''}
                  />
                  <line x1="380" y1="225" x2="380" y2="255" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="365" y1="240" x2="395" y2="240" stroke="#ffffff" strokeWidth="1.5" />
                  
                  {/* Callout Box */}
                  <line x1="380" y1="255" x2="380" y2="275" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                  <rect
                    x="270"
                    y="265"
                    width="220"
                    height="24"
                    rx="6"
                    fill={placedAnatomyLabels.origin ? '#065f46' : selectedAnatomyLabelKey === 'origin' ? '#7f1d1d' : '#1e293b'}
                    stroke={placedAnatomyLabels.origin ? '#34d399' : '#ef4444'}
                    strokeWidth={selectedAnatomyLabelKey === 'origin' ? 2 : 1.2}
                  />
                  <text x="380" y="281" fill="#ffffff" fontSize="10.5" fontWeight="900" textAnchor="middle">
                    {placedAnatomyLabels.origin ? '✓ 1. MERKEZ NOKTASI (ORİJİN)' : '📍 1. Hedef: Merkez Noktası'}
                  </text>
                </g>

                {/* TARGET 2: TABAN ÇİZGİSİ (0° HATTI) */}
                <g
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handlePlaceAnatomyLabel('baseline')}
                >
                  <rect
                    x="510"
                    y="232"
                    width="100"
                    height="16"
                    rx="4"
                    fill={placedAnatomyLabels.baseline ? '#0284c7' : selectedAnatomyLabelKey === 'baseline' ? '#0369a1' : 'transparent'}
                    stroke="#38bdf8"
                    strokeWidth={selectedAnatomyLabelKey === 'baseline' ? 2.5 : 1.5}
                    strokeDasharray={placedAnatomyLabels.baseline ? 'none' : '3 3'}
                    className={selectedAnatomyLabelKey === 'baseline' ? 'animate-pulse' : ''}
                  />
                  {/* Callout Box */}
                  <line x1="560" y1="248" x2="560" y2="275" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                  <rect
                    x="500"
                    y="265"
                    width="200"
                    height="24"
                    rx="6"
                    fill={placedAnatomyLabels.baseline ? '#0c4a6e' : selectedAnatomyLabelKey === 'baseline' ? '#075985' : '#1e293b'}
                    stroke={placedAnatomyLabels.baseline ? '#38bdf8' : '#0284c7'}
                    strokeWidth={selectedAnatomyLabelKey === 'baseline' ? 2 : 1.2}
                  />
                  <text x="600" y="281" fill="#ffffff" fontSize="10.5" fontWeight="900" textAnchor="middle">
                    {placedAnatomyLabels.baseline ? '✓ 2. TABAN ÇİZGİSİ (0°)' : '📍 2. Hedef: Taban Çizgisi'}
                  </text>
                </g>

                {/* TARGET 3: İÇ ÖLÇEK (SAAT YÖNÜ) */}
                <g
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handlePlaceAnatomyLabel('innerScale')}
                >
                  <path
                    d="M 500 230 A 150 150 0 0 0 390 90"
                    fill="none"
                    stroke={placedAnatomyLabels.innerScale ? '#f59e0b' : '#d97706'}
                    strokeWidth={selectedAnatomyLabelKey === 'innerScale' ? 6 : 3.5}
                    strokeDasharray={placedAnatomyLabels.innerScale ? 'none' : '4 3'}
                    className={selectedAnatomyLabelKey === 'innerScale' ? 'animate-pulse' : ''}
                  />
                  {/* Callout Box */}
                  <rect
                    x="450"
                    y="70"
                    width="190"
                    height="24"
                    rx="6"
                    fill={placedAnatomyLabels.innerScale ? '#78350f' : selectedAnatomyLabelKey === 'innerScale' ? '#b45309' : '#1e293b'}
                    stroke={placedAnatomyLabels.innerScale ? '#fbbf24' : '#f59e0b'}
                    strokeWidth={selectedAnatomyLabelKey === 'innerScale' ? 2 : 1.2}
                  />
                  <text x="545" y="86" fill="#ffffff" fontSize="10.5" fontWeight="900" textAnchor="middle">
                    {placedAnatomyLabels.innerScale ? '✓ 3. İÇ ÖLÇEK (0°→180°)' : '📍 3. Hedef: İç Ölçek'}
                  </text>
                </g>

                {/* TARGET 4: DIŞ ÖLÇEK (TERS YÖN) */}
                <g
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handlePlaceAnatomyLabel('outerScale')}
                >
                  <path
                    d="M 240 230 A 210 210 0 0 1 370 30"
                    fill="none"
                    stroke={placedAnatomyLabels.outerScale ? '#10b981' : '#059669'}
                    strokeWidth={selectedAnatomyLabelKey === 'outerScale' ? 6 : 3.5}
                    strokeDasharray={placedAnatomyLabels.outerScale ? 'none' : '4 3'}
                    className={selectedAnatomyLabelKey === 'outerScale' ? 'animate-pulse' : ''}
                  />
                  {/* Callout Box */}
                  <rect
                    x="120"
                    y="40"
                    width="190"
                    height="24"
                    rx="6"
                    fill={placedAnatomyLabels.outerScale ? '#064e3b' : selectedAnatomyLabelKey === 'outerScale' ? '#047857' : '#1e293b'}
                    stroke={placedAnatomyLabels.outerScale ? '#34d399' : '#10b981'}
                    strokeWidth={selectedAnatomyLabelKey === 'outerScale' ? 2 : 1.2}
                  />
                  <text x="215" y="56" fill="#ffffff" fontSize="10.5" fontWeight="900" textAnchor="middle">
                    {placedAnatomyLabels.outerScale ? '✓ 4. DIŞ ÖLÇEK (0°→180°)' : '📍 4. Hedef: Dış Ölçek'}
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* 3. GÖZLEMCİNİN KRİTİK NOTU (ÇİFT ÖLÇEK TUZAĞI PANELİ) */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-400/80 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-2xl font-black shrink-0 shadow-md shadow-amber-500/20">
              🕵️‍♂️
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                  Altın Kural
                </span>
                <h4 className="font-black text-amber-950 dark:text-amber-200 text-sm sm:text-base">
                  Gözlemcinin Kritik Notu (Çift Ölçek Tuzağına Düşme!)
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-300 leading-relaxed font-semibold">
                &ldquo;Ölçtüğün açı dik açıdan (90°) dar mı, geniş mi? Gözünle önce açının türünü tahmin et! Açı dar ise 130° değil, 50° olan ölçeği okumalısın!&rdquo;
              </p>
            </div>
          </div>

          {/* 4. "ÇİFT ÖLÇEK TUZAĞI" İNTERAKTİF MİNİ TESTİ (3 DENEY KUTUSU) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>2. Aşama: Çift Ölçek Tuzağı Deneyleri (Doğru Dereceyi Seç)</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                {Object.values(anatomyQuizStatus).filter(Boolean).length} / 3 Soru Doğrulandı
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* DENEY 1: 50° DAR AÇI */}
              <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800">
                      1. Durum: Dar Açı Modeli
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">#1</span>
                  </div>

                  {/* Mini Canvas SVG */}
                  <div className="h-32 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 220 120" className="w-full h-full">
                      {/* Protractor Ghost */}
                      <path d="M 20 100 A 90 90 0 0 1 200 100 Z" fill="#0284c7" fillOpacity="0.15" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2 2" />
                      {/* Vertex O */}
                      <circle cx="110" cy="100" r="4" fill="#ef4444" />
                      <text x="110" y="115" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">O</text>
                      {/* Base Arm right */}
                      <line x1="110" y1="100" x2="195" y2="100" stroke="#f8fafc" strokeWidth="3" />
                      {/* Angle Arm at 50 deg (from right, 50 deg counter-clockwise) */}
                      {(() => {
                        const rad = (50 * Math.PI) / 180;
                        const ax = 110 + 85 * Math.cos(rad);
                        const ay = 100 - 85 * Math.sin(rad);
                        return (
                          <>
                            <line x1="110" y1="100" x2={ax} y2={ay} stroke="#f59e0b" strokeWidth="3" />
                            <path d={`M 135 100 A 25 25 0 0 0 ${110 + 25 * Math.cos(rad)} ${100 - 25 * Math.sin(rad)}`} fill="none" stroke="#f59e0b" strokeWidth="2" />
                          </>
                        );
                      })()}
                      {/* Scale labels on pointer */}
                      <text x="160" y="30" fill="#f59e0b" fontSize="9" fontWeight="900">50° (İç)</text>
                      <text x="160" y="42" fill="#94a3b8" fontSize="8" fontWeight="bold">130° (Dış)</text>
                    </svg>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    Kol 1 tabanda, Kol 2 hem <strong>50°</strong> hem <strong>130°</strong> hizasında. Açı 90°den <strong>dar</strong> olduğuna göre doğru okuma hangisidir?
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAnswerAnatomyQuiz(0, '50', '50')}
                      className={`p-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        anatomyQuizAnswers[0] === '50'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      50° (İç Ölçek)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnswerAnatomyQuiz(0, '130', '50')}
                      className={`p-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        anatomyQuizAnswers[0] === '130'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      130° (Dış Ölçek)
                    </button>
                  </div>

                  {anatomyQuizSubmitted[0] && (
                    <div
                      className={`p-2 rounded-xl text-[11px] font-semibold leading-snug animate-in fade-in ${
                        anatomyQuizStatus[0]
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {anatomyQuizStatus[0]
                        ? '✓ DOĞRU! Açı 90°den dar (dar açı) olduğu için 130° tuzağına düşmeyip 50° seçilmelidir.'
                        : '✗ DİKKAT! Açı 90°den dar görünüyor. 130° geniş açı değeridir, doğru cevap 50°dir.'}
                    </div>
                  )}
                </div>
              </div>

              {/* DENEY 2: 120° GENİŞ AÇI */}
              <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                      2. Durum: Geniş Açı Modeli
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">#2</span>
                  </div>

                  {/* Mini Canvas SVG */}
                  <div className="h-32 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 220 120" className="w-full h-full">
                      {/* Protractor Ghost */}
                      <path d="M 20 100 A 90 90 0 0 1 200 100 Z" fill="#0284c7" fillOpacity="0.15" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2 2" />
                      {/* Vertex O */}
                      <circle cx="110" cy="100" r="4" fill="#ef4444" />
                      <text x="110" y="115" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">O</text>
                      {/* Base Arm right */}
                      <line x1="110" y1="100" x2="195" y2="100" stroke="#f8fafc" strokeWidth="3" />
                      {/* Angle Arm at 120 deg (from right, 120 deg counter-clockwise) */}
                      {(() => {
                        const rad = (120 * Math.PI) / 180;
                        const ax = 110 + 85 * Math.cos(rad);
                        const ay = 100 - 85 * Math.sin(rad);
                        return (
                          <>
                            <line x1="110" y1="100" x2={ax} y2={ay} stroke="#38bdf8" strokeWidth="3" />
                            <path d={`M 135 100 A 25 25 0 0 0 ${110 + 25 * Math.cos(rad)} ${100 - 25 * Math.sin(rad)}`} fill="none" stroke="#38bdf8" strokeWidth="2" />
                          </>
                        );
                      })()}
                      {/* Scale labels on pointer */}
                      <text x="60" y="25" fill="#38bdf8" fontSize="9" fontWeight="900">120° (İç)</text>
                      <text x="60" y="37" fill="#94a3b8" fontSize="8" fontWeight="bold">60° (Dış)</text>
                    </svg>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    Kol 1 tabanda, Kol 2 hem <strong>120°</strong> hem <strong>60°</strong> hizasında. Açı 90°den <strong>geniş</strong> olduğuna göre doğru okuma hangisidir?
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAnswerAnatomyQuiz(1, '120', '120')}
                      className={`p-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        anatomyQuizAnswers[1] === '120'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      120° (İç Ölçek)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnswerAnatomyQuiz(1, '60', '120')}
                      className={`p-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        anatomyQuizAnswers[1] === '60'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      60° (Dış Ölçek)
                    </button>
                  </div>

                  {anatomyQuizSubmitted[1] && (
                    <div
                      className={`p-2 rounded-xl text-[11px] font-semibold leading-snug animate-in fade-in ${
                        anatomyQuizStatus[1]
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {anatomyQuizStatus[1]
                        ? '✓ KUSURSUZ! Açı 90°den geniş (geniş açı) olduğu için 60° tuzağına düşmeyip 120° seçildi.'
                        : '✗ DİKKAT! Açı 90°den bariz biçimde geniştir. 60° dar açı değeridir, doğru cevap 120°dir.'}
                    </div>
                  )}
                </div>
              </div>

              {/* DENEY 3: 35° DAR AÇI (SOLA AÇILAN TABAN) */}
              <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800">
                      3. Durum: Sola Bakan Kol
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">#3</span>
                  </div>

                  {/* Mini Canvas SVG */}
                  <div className="h-32 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 220 120" className="w-full h-full">
                      {/* Protractor Ghost */}
                      <path d="M 20 100 A 90 90 0 0 1 200 100 Z" fill="#0284c7" fillOpacity="0.15" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2 2" />
                      {/* Vertex O */}
                      <circle cx="110" cy="100" r="4" fill="#ef4444" />
                      <text x="110" y="115" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">O</text>
                      {/* Base Arm Left */}
                      <line x1="110" y1="100" x2="25" y2="100" stroke="#f8fafc" strokeWidth="3" />
                      {/* Angle Arm at 35 deg (from left, 35 deg clockwise) */}
                      {(() => {
                        const rad = (35 * Math.PI) / 180;
                        const ax = 110 - 85 * Math.cos(rad);
                        const ay = 100 - 85 * Math.sin(rad);
                        return (
                          <>
                            <line x1="110" y1="100" x2={ax} y2={ay} stroke="#a855f7" strokeWidth="3" />
                            <path d={`M 85 100 A 25 25 0 0 1 ${110 - 25 * Math.cos(rad)} ${100 - 25 * Math.sin(rad)}`} fill="none" stroke="#a855f7" strokeWidth="2" />
                          </>
                        );
                      })()}
                      {/* Scale labels on pointer */}
                      <text x="55" y="45" fill="#a855f7" fontSize="9" fontWeight="900">35° (Dış)</text>
                      <text x="55" y="57" fill="#94a3b8" fontSize="8" fontWeight="bold">145° (İç)</text>
                    </svg>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    Açının taban kolu <strong>sol taraftaki 0°ye</strong> dayanıyor. Açı dar olduğuna göre hangi değer okunmalıdır?
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAnswerAnatomyQuiz(2, '35', '35')}
                      className={`p-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        anatomyQuizAnswers[2] === '35'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      35° (Dış Ölçek)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnswerAnatomyQuiz(2, '145', '35')}
                      className={`p-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        anatomyQuizAnswers[2] === '145'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      145° (İç Ölçek)
                    </button>
                  </div>

                  {anatomyQuizSubmitted[2] && (
                    <div
                      className={`p-2 rounded-xl text-[11px] font-semibold leading-snug animate-in fade-in ${
                        anatomyQuizStatus[2]
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {anatomyQuizStatus[2]
                        ? '✓ TEBRİKLER! Sol taraftan başlandığı için dış ölçekteki 0°den 35°ye kadar olan açıklık okunmalıdır.'
                        : '✗ DİKKAT! Sol koldan başladığımızda dış ölçekteki 0°den saymaya başlarız. Doğru cevap 35°dir.'}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* 5. Alt Bilgi & Puanlama */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-semibold">
              <Award className="w-4 h-4 text-amber-500" />
              <span>
                <strong>Değerlendirme:</strong> 4 Kritik Parça Etiketleme (60 Puan) + Çift Ölçek Tuzağı Deneyleri (40 Puan) = Toplam 100 Puan
              </span>
            </span>
            <span className="font-mono font-bold text-slate-400">www.maarifakademi.com.tr</span>
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
            {isAreaModelsActivity
              ? 'Alan Modelleri ile Çarpan Avcılığı adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi çarpan ve bölen bulma becerilerinizi değerlendiriniz.'
              : isRhythmicJumpsActivity
              ? 'Ritmik Sıçrama ve Katlar Çizgisi adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi katlar ve ortak kat hesaplama becerilerinizi değerlendiriniz.'
              : isRainbowCipherActivity
              ? 'Çarpan Gökkuşağı Şifresi ve Problem Çözme adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi problem çözme ve akıl yürütme becerilerinizi değerlendiriniz.'
              : isTableHypothesisActivity
              ? 'Varsayım ve Tablo Temsili (İki ve Üç Doğru Analizi) adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi geometrik çıkarım becerilerinizi değerlendiriniz.'
              : isIntersectionChallengeActivity
              ? 'Kavşak Şifresi ve Çıkarım Meydan Okuması adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi açı ve ispat becerilerinizi değerlendiriniz.'
              : isLinesRelationsActivity
              ? 'Doğruların Birbirine Göre Durumları (Kesişen, Dik, Paralel, Kesen) gözlem ve sınıflandırma adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi geometrik çıkarım becerilerinizi değerlendiriniz.'
              : isErrorDetectiveActivity
              ? 'Hata Dedektifi ve Öz Değerlendirme adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi açı ölçüm ve analiz becerilerinizi değerlendiriniz.'
              : isAngleConstructionActivity
              ? 'Rotanı Kendin Çiz açı inşası adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi açı çizim becerilerinizi değerlendiriniz.'
              : isMeasuringStationsActivity
              ? 'Aşamalı Açı Ölçüm İstasyonları adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi açı ölçüm ve tahmin becerilerinizi değerlendiriniz.'
              : isProtractorAnatomyActivity
              ? 'İletkinin Anatomisi ve Çift Ölçek Tuzağı adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi ölçüm becerilerinizi değerlendiriniz.'
              : isRailwayActivity
              ? 'Tren Rayı Mühendisliği adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi çizimlerinizi değerlendiriniz.'
              : isBridgeActivity
              ? 'Tarihi Köprü Restorasyonu adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi çizimlerinizi değerlendiriniz.'
              : 'Etkinlik kağıdındaki inşa adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi çizimlerinizi değerlendiriniz.'}
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
