'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LabPhaseData } from '@/types';
import { useApp } from '@/lib/store';
import { ExperimentBench } from '@/components/lesson-phases/experiment-bench';
import { LinesAnglesBench } from '@/components/lesson-phases/lines-angles-bench';
import { FactorsMultiplesBench } from '@/components/lesson-phases/factors-multiples-bench';
import {
  DivisibilityBench,
  PrimeFactorsBench,
  CommonMultiplesDivisorsBench
} from '@/components/lesson-phases/mat6-lab-benches';
import { RationalNumbersBench } from '@/components/lesson-phases/rational-numbers-bench';
import { RationalRulerDensityBench } from '@/components/lesson-phases/rational-ruler-density-bench';
import { RationalComparisonBench } from '@/components/lesson-phases/rational-comparison-bench';
import { RationalOperationsBench } from '@/components/lesson-phases/rational-operations-bench';
import confetti from 'canvas-confetti';
import {
  Shapes,
  Dot,
  Minus,
  ArrowRight,
  Maximize2,
  Trash2,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Info,
  Layers,
  HelpCircle,
  Award,
  Undo2,
  FlaskConical,
  Compass,
  Move,
  Target,
  Sliders,
  Eye,
  EyeOff,
  Zap,
  XCircle,
  Check,
  Ruler,
  Palette,
  Star,
  Eraser,
  Magnet,
  RotateCw,
  Trophy
} from 'lucide-react';
import { MascotLabHelper } from '@/components/mascot';
import { GeometryFlowSelector, GeometryStationId } from '@/components/lesson-phases/geometry-flow-selector';

interface LabPhaseProps {
  data: LabPhaseData;
  onNextPhase: () => void;
}

interface GeoPoint {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  hideLabel?: boolean;
}

interface GeoObject {
  id: string;
  type: 'segment' | 'ray' | 'line' | 'circle' | 'perpendicular' | 'art-motif' | 'distance';
  p1: GeoPoint;
  p2?: GeoPoint;
  symbol: string;
  label: string;
  length?: number;
  radius?: number;
  isDisk?: boolean;
  distance?: number;
  color: string;
  motifType?: 'seljuk-star' | 'tile' | 'maritime';
  hideLength?: boolean;
  hideLabel?: boolean;
  baseLineId?: string;
}

interface GeoAngle {
  id: string;
  vertex: GeoPoint;
  p1: GeoPoint; // Base arm end point (e.g. A)
  p2: GeoPoint; // Rotating arm end point (e.g. B)
  degree: number;
  type: 'sifir' | 'dar' | 'dik' | 'genis' | 'dogru';
  label: string;
  color: string;
  hideLabel?: boolean;
}

export interface GeoPolygon {
  id: string;
  points: GeoPoint[];
  label: string;
  color: string;
  fillOpacity: number;
  perimeter: number;
  area: number;
  hideLabel?: boolean;
}

const GRID_SIZE = 30; // 30px = 1 cm in GeoGebra coordinate grid

function snapCoordinate(val: number, isSnapActive = true): number {
  if (!isSnapActive) return val;
  return Math.max(0, Math.round(val / GRID_SIZE) * GRID_SIZE);
}

// Shoelace formula (Gauss Area Formula) for polygon area in cm²
function calculatePolygonArea(pts: GeoPoint[]): number {
  if (pts.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    sum += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
  }
  const pixelArea = Math.abs(sum) / 2;
  // Convert from px² to cm² (30px = 1cm => 900px² = 1cm²)
  return Math.round((pixelArea / (GRID_SIZE * GRID_SIZE)) * 10) / 10;
}

function calculatePolygonPerimeter(pts: GeoPoint[]): number {
  if (pts.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    total += Math.hypot(pts[j].x - pts[i].x, pts[j].y - pts[i].y);
  }
  return Math.round((total / GRID_SIZE) * 10) / 10;
}

const POINT_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'O'];
const COLORS = ['#10b396', '#0284c7', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444'];

export interface MotifGuideElement {
  id: string;
  name: string;
  requiredTool: 'compass' | 'line' | 'setsquare' | 'ray' | 'segment';
  toolTitle: string;
  toolIcon: string;
  type: 'circle' | 'line' | 'perpendicular' | 'ray' | 'segment';
  p1Label: string;
  p2Label?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  r?: number;
  instruction: string;
}

export const MOTIF_1_GUIDES: MotifGuideElement[] = [
  {
    id: 'motif-circle',
    name: 'Selçuklu Çemberi',
    requiredTool: 'compass',
    toolTitle: 'Pergel',
    toolIcon: '⭕',
    type: 'circle',
    cx: 380,
    cy: 225,
    r: 115,
    p1Label: 'M',
    p2Label: 'A',
    instruction: 'Pergel aracını seçerek M merkezli ve A noktasından geçen çemberi çizin.'
  },
  {
    id: 'motif-line-h',
    name: 'Yatay Eksen Doğrusu',
    requiredTool: 'line',
    toolTitle: 'Doğru',
    toolIcon: '↔️',
    type: 'line',
    x1: 195,
    y1: 225,
    x2: 565,
    y2: 225,
    p1Label: 'D',
    p2Label: 'B',
    instruction: 'Doğru aracını seçerek D ve B noktalarından geçen doğruyu çizin.'
  },
  {
    id: 'motif-perp-v',
    name: 'Düşey Dikme Ekseni (90°)',
    requiredTool: 'setsquare',
    toolTitle: 'Gönye & Dikme',
    toolIcon: '⊥',
    type: 'perpendicular',
    x1: 380,
    y1: 65,
    x2: 380,
    y2: 385,
    p1Label: 'A',
    p2Label: 'M',
    instruction: 'Gönye & Dikme aracını seçerek 90° dikme eksenini oluşturun.'
  },
  {
    id: 'motif-ray-diag',
    name: 'Yıldız Köşe Işını [ME>',
    requiredTool: 'ray',
    toolTitle: 'Işın',
    toolIcon: '⚡',
    type: 'ray',
    x1: 380,
    y1: 225,
    x2: 515,
    y2: 90,
    p1Label: 'M',
    p2Label: 'E',
    instruction: 'Işın aracını seçerek M noktasından E köşesine uzanan ışını çizin.'
  },
  {
    id: 'motif-seg-ab',
    name: 'Doğru Parçası [AB]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 380,
    y1: 110,
    x2: 495,
    y2: 225,
    p1Label: 'A',
    p2Label: 'B',
    instruction: 'Doğru Parçası aracını seçerek A ve B noktalarını birleştirin.'
  },
  {
    id: 'motif-seg-bc',
    name: 'Doğru Parçası [BC]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 495,
    y1: 225,
    x2: 380,
    y2: 340,
    p1Label: 'B',
    p2Label: 'C',
    instruction: 'Doğru Parçası aracını seçerek B ve C noktalarını birleştirin.'
  },
  {
    id: 'motif-seg-cd',
    name: 'Doğru Parçası [CD]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 380,
    y1: 340,
    x2: 265,
    y2: 225,
    p1Label: 'C',
    p2Label: 'D',
    instruction: 'Doğru Parçası aracını seçerek C ve D noktalarını birleştirin.'
  },
  {
    id: 'motif-seg-da',
    name: 'Doğru Parçası [DA]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 265,
    y1: 225,
    x2: 380,
    y2: 110,
    p1Label: 'D',
    p2Label: 'A',
    instruction: 'Doğru Parçası aracını seçerek D ve A noktalarını birleştirin.'
  },
  {
    id: 'motif-seg-ef',
    name: 'Doğru Parçası [EF]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 461,
    y1: 144,
    x2: 461,
    y2: 306,
    p1Label: 'E',
    p2Label: 'F',
    instruction: 'Doğru Parçası aracını seçerek E ve F noktalarını birleştirin.'
  },
  {
    id: 'motif-seg-fg',
    name: 'Doğru Parçası [FG]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 461,
    y1: 306,
    x2: 299,
    y2: 306,
    p1Label: 'F',
    p2Label: 'G',
    instruction: 'Doğru Parçası aracını seçerek F ve G noktalarını birleştirin.'
  },
  {
    id: 'motif-seg-gh',
    name: 'Doğru Parçası [GH]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 299,
    y1: 306,
    x2: 299,
    y2: 144,
    p1Label: 'G',
    p2Label: 'H',
    instruction: 'Doğru Parçası aracını seçerek G ve H noktalarını birleştirin.'
  },
  {
    id: 'motif-seg-he',
    name: 'Doğru Parçası [HE]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 299,
    y1: 144,
    x2: 461,
    y2: 144,
    p1Label: 'H',
    p2Label: 'E',
    instruction: 'Doğru Parçası aracını seçerek H ve E noktalarını birleştirin.'
  }
];

export const MOTIF_2_GUIDES: MotifGuideElement[] = [
  {
    id: 'm2-seg-ta',
    name: 'Tepe - Sağ Köşe [TA]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 380,
    y1: 45,
    x2: 550,
    y2: 215,
    p1Label: 'T',
    p2Label: 'A',
    instruction: 'Doğru Parçası aracını seçerek T ve A noktalarını birleştirin.'
  },
  {
    id: 'm2-seg-ab',
    name: 'Sağ Kol Dışı [AB]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 550,
    y1: 215,
    x2: 490,
    y2: 275,
    p1Label: 'A',
    p2Label: 'B',
    instruction: 'Doğru Parçası aracını seçerek A ve B noktalarını birleştirin.'
  },
  {
    id: 'm2-seg-bc',
    name: 'Sağ Dirsek İçi [BC]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 490,
    y1: 275,
    x2: 430,
    y2: 215,
    p1Label: 'B',
    p2Label: 'C',
    instruction: 'Doğru Parçası aracını seçerek B ve C noktalarını birleştirin.'
  },
  {
    id: 'm2-seg-cd',
    name: 'Sağ El [CD]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 430,
    y1: 215,
    x2: 490,
    y2: 215,
    p1Label: 'C',
    p2Label: 'D',
    instruction: 'Doğru Parçası aracını seçerek C ve D noktalarını yatay birleştirin.'
  },
  {
    id: 'm2-seg-de',
    name: 'Sağ El - Koltuk [DE]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 490,
    y1: 215,
    x2: 445,
    y2: 170,
    p1Label: 'D',
    p2Label: 'E',
    instruction: 'Doğru Parçası aracını seçerek D ve E noktalarını birleştirin.'
  },
  {
    id: 'm2-seg-ef',
    name: 'Sağ Koltuk - Bel [EF]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 445,
    y1: 170,
    x2: 400,
    y2: 215,
    p1Label: 'E',
    p2Label: 'F',
    instruction: 'Doğru Parçası aracını seçerek E ve F noktalarını birleştirin.'
  },
  {
    id: 'm2-seg-fg',
    name: 'Sağ Bel - Etek [FG]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 400,
    y1: 215,
    x2: 490,
    y2: 305,
    p1Label: 'F',
    p2Label: 'G',
    instruction: 'Doğru Parçası aracını seçerek F ve G noktalarını birleştirin.'
  },
  {
    id: 'm2-seg-gs',
    name: 'Sağ Etek - Taban [GS]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 490,
    y1: 305,
    x2: 380,
    y2: 415,
    p1Label: 'G',
    p2Label: 'S',
    instruction: 'Doğru Parçası aracını seçerek G ve S noktalarını birleştirin.'
  },
  {
    id: 'm2-seg-sh',
    name: 'Taban - Sol Etek [SH]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 380,
    y1: 415,
    x2: 270,
    y2: 305,
    p1Label: 'S',
    p2Label: 'H',
    instruction: 'Doğru Parçası aracını seçerek S ve H noktalarını birleştirin.'
  },
  {
    id: 'm2-seg-hk',
    name: 'Sol Etek - Bel [HK]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 270,
    y1: 305,
    x2: 360,
    y2: 215,
    p1Label: 'H',
    p2Label: 'K',
    instruction: 'Doğru Parçası aracını seçerek H ve K noktalarını birleştirin.'
  },
  {
    id: 'm2-seg-kl',
    name: 'Sol Bel - Koltuk [KL]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 360,
    y1: 215,
    x2: 315,
    y2: 170,
    p1Label: 'K',
    p2Label: 'L',
    instruction: 'Doğru Parçası aracını seçerek K ve L noktalarını birleştirin.'
  },
  {
    id: 'm2-seg-lm',
    name: 'Sol Koltuk - El [LM]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 315,
    y1: 170,
    x2: 270,
    y2: 215,
    p1Label: 'L',
    p2Label: 'M',
    instruction: 'Doğru Parçası aracını seçerek L ve M noktalarını birleştirin.'
  },
  {
    id: 'm2-seg-mn',
    name: 'Sol El [MN]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 270,
    y1: 215,
    x2: 330,
    y2: 215,
    p1Label: 'M',
    p2Label: 'N',
    instruction: 'Doğru Parçası aracını seçerek M ve N noktalarını yatay birleştirin.'
  },
  {
    id: 'm2-seg-np',
    name: 'Sol El - Dirsek İçi [NP]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 330,
    y1: 215,
    x2: 270,
    y2: 275,
    p1Label: 'N',
    p2Label: 'P',
    instruction: 'Doğru Parçası aracını seçerek N ve P noktalarını birleştirin.'
  },
  {
    id: 'm2-seg-pr',
    name: 'Sol Kol Dışı [PR]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 270,
    y1: 275,
    x2: 210,
    y2: 215,
    p1Label: 'P',
    p2Label: 'R',
    instruction: 'Doğru Parçası aracını seçerek P ve R noktalarını birleştirin.'
  },
  {
    id: 'm2-seg-rt',
    name: 'Sol Köşe - Tepe [RT]',
    requiredTool: 'segment',
    toolTitle: 'Doğru Parçası',
    toolIcon: '📏',
    type: 'segment',
    x1: 210,
    y1: 215,
    x2: 380,
    y2: 45,
    p1Label: 'R',
    p2Label: 'T',
    instruction: 'Doğru Parçası aracını seçerek R ve T noktalarını birleştirin.'
  }
];

// Angle calculation between [vertex -> p1] and [vertex -> p2]
function getAngleDegree(vertex: { x: number; y: number }, p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const ang1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
  const ang2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);
  let diff = Math.abs((ang1 - ang2) * (180 / Math.PI));
  if (diff > 180) diff = 360 - diff;
  return Math.round(diff);
}

function getAngleType(deg: number): { type: 'sifir' | 'dar' | 'dik' | 'genis' | 'dogru'; title: string; color: string } {
  if (deg === 0) return { type: 'sifir', title: 'Sıfır Açı (0°)', color: '#64748b' };
  if (deg < 90) return { type: 'dar', title: 'Dar Açı (<90°)', color: '#0284c7' };
  if (deg === 90) return { type: 'dik', title: 'Dik Açı (90°)', color: '#059669' };
  if (deg < 180) return { type: 'genis', title: 'Geniş Açı (>90°)', color: '#d97706' };
  return { type: 'dogru', title: 'Doğru Açı (180°)', color: '#7c3aed' };
}

export function LabPhase({ data, onNextPhase }: LabPhaseProps) {
  const { playSound, unlockBadge, addPoints, selectedOutcome } = useApp();

  const isRationalOperationsBench =
    selectedOutcome?.id === 'MAT.7.1.3' ||
    selectedOutcome?.code?.includes('7.1.3') ||
    data.toolType === 'rational-operations-bench' ||
    data.title.toLowerCase().includes('toplama ve çıkarma') ||
    data.title.toLowerCase().includes('yakıt tankı');

  const isRationalComparisonBench =
    !isRationalOperationsBench &&
    (selectedOutcome?.id === 'MAT.7.1.2' ||
      selectedOutcome?.code?.includes('7.1.2') ||
      data.toolType === 'rational-comparison-bench' ||
      data.title.toLowerCase().includes('karşılaştırma') ||
      data.title.toLowerCase().includes('rasyonel terazi'));

  const isRationalNumbersWeek2 =
    !isRationalComparisonBench &&
    (selectedOutcome?.id === 'MAT.7.1.1-2' ||
      selectedOutcome?.code?.includes('7.1.1-2') ||
      data.toolType === 'rational-ruler-density-bench');

  const isRationalNumbersOutcome =
    !isRationalComparisonBench &&
    !isRationalNumbersWeek2 &&
    (selectedOutcome?.id === 'MAT.7.1.1' ||
      selectedOutcome?.code?.includes('7.1.1') ||
      data.toolType === 'rational-numbers-bench');

  const isDivisibilityOutcome =
    !isRationalComparisonBench &&
    !isRationalNumbersWeek2 &&
    !isRationalNumbersOutcome &&
    (selectedOutcome?.id === 'MAT.6.1.2' ||
      selectedOutcome?.code?.includes('6.1.2') ||
      data.toolType === 'divisibility-bench');

  const isPrimeFactorsOutcome =
    !isRationalComparisonBench &&
    (selectedOutcome?.id === 'MAT.6.1.3' ||
      selectedOutcome?.code?.includes('6.1.3') ||
      data.toolType === 'prime-factors-bench');

  const isCommonMultiplesDivisorsOutcome =
    !isRationalComparisonBench &&
    (selectedOutcome?.id === 'MAT.6.1.4' ||
      selectedOutcome?.code?.includes('6.1.4') ||
      data.toolType === 'common-multiples-divisors-bench');

  const isFactorsMultiplesOutcome =
    !isRationalComparisonBench &&
    !isDivisibilityOutcome &&
    !isPrimeFactorsOutcome &&
    !isCommonMultiplesDivisorsOutcome &&
    (selectedOutcome?.id === 'MAT.6.1.1' ||
      selectedOutcome?.code?.includes('6.1.1') ||
      data.toolType === 'factors-multiples-bench' ||
      data.title.toLowerCase().includes('çarpan') ||
      data.title.toLowerCase().includes('katlar'));

  const isLinesAnglesOutcome =
    !isRationalComparisonBench &&
    !isDivisibilityOutcome &&
    !isPrimeFactorsOutcome &&
    !isCommonMultiplesDivisorsOutcome &&
    !isFactorsMultiplesOutcome &&
    (selectedOutcome?.id === 'MAT.5.3.4' ||
      selectedOutcome?.code?.includes('5.3.4') ||
      data.title.toLowerCase().includes('doğru ve açı') ||
      data.title.toLowerCase().includes('kesişen'));

  const isExperimentBench =
    !isRationalComparisonBench &&
    !isRationalNumbersWeek2 &&
    !isRationalNumbersOutcome &&
    !isDivisibilityOutcome &&
    !isPrimeFactorsOutcome &&
    !isCommonMultiplesDivisorsOutcome &&
    !isFactorsMultiplesOutcome &&
    !isLinesAnglesOutcome &&
    (data.toolType === 'experiment-bench' || selectedOutcome?.id === 'MAT.5.3.2');

  const isAngleTopic =
    !isRationalComparisonBench &&
    !isRationalNumbersWeek2 &&
    !isRationalNumbersOutcome &&
    !isDivisibilityOutcome &&
    !isPrimeFactorsOutcome &&
    !isCommonMultiplesDivisorsOutcome &&
    !isFactorsMultiplesOutcome &&
    !isLinesAnglesOutcome &&
    (selectedOutcome?.id === 'MAT.5.3.3' ||
      selectedOutcome?.code?.includes('5.3.3') ||
      data.title.toLowerCase().includes('iletki') ||
      (data.title.toLowerCase().includes('açı') && !data.title.toLowerCase().includes('geometri')));

  // Active Tool: 'angle' | 'measure-angle' | 'measure-length' | 'three-point-angle' for MAT.5.3.3, or geometry tools for MAT.5.3.1
  const [activeTool, setActiveTool] = useState<
    'angle' | 'measure-angle' | 'measure-length' | 'three-point-angle' | 'ray' | 'segment' | 'line' | 'point' | 'compass' | 'setsquare' | 'artmotif' | 'polygon' | 'drag' | 'eraser' | 'protractor'
  >(isAngleTopic ? 'angle' : 'point');

  // Professional digital toolbar active category
  const [activeToolCategory, setActiveToolCategory] = useState<'all' | 'basic' | 'lines' | 'angle' | 'shapes' | 'motifs' | 'special'>('lines');

  // Multi-station Flow for MAT.5.3.1
  const [activeStation, setActiveStation] = useState<GeometryStationId>('lines');
  const [compassCenterPoint, setCompassCenterPoint] = useState<GeoPoint | null>(null);

  const [points, setPoints] = useState<GeoPoint[]>([]);
  const [objects, setObjects] = useState<GeoObject[]>([]);
  const [angles, setAngles] = useState<GeoAngle[]>([]);
  const [polygons, setPolygons] = useState<GeoPolygon[]>([]);
  const [polygonDraft, setPolygonDraft] = useState<GeoPoint[]>([]);
  const [measureAnglePoints, setMeasureAnglePoints] = useState<GeoPoint[]>([]);
  const [threePointAnglePoints, setThreePointAnglePoints] = useState<GeoPoint[]>([]);
  const [measureLengthPoints, setMeasureLengthPoints] = useState<GeoPoint[]>([]);
  const [isSnapToGrid, setIsSnapToGrid] = useState<boolean>(true);
  const [snapCandidate, setSnapCandidate] = useState<{ x: number; y: number; isPoint: boolean; label?: string } | null>(null);

  // Motif Görevleri (Selçuklu Yıldızı & Eli Belinde) State
  const [isMotif1Active, setIsMotif1Active] = useState<boolean>(false);
  const [isMotif2Active, setIsMotif2Active] = useState<boolean>(false);
  const [motifCompletedGuides, setMotifCompletedGuides] = useState<string[]>([]);
  const [motifCelebrated, setMotifCelebrated] = useState<boolean>(false);
  const [motifHintGuideId, setMotifHintGuideId] = useState<string | null>(null);

  // Açı Tahmin ve İletki Ölçüm Oyunu State
  const [isAngleGameActive, setIsAngleGameActive] = useState<boolean>(false);
  const [angleGameStage, setAngleGameStage] = useState<'estimate' | 'measure' | 'result'>('estimate');
  const [angleGameTarget, setAngleGameTarget] = useState<{
    vertex: { x: number; y: number };
    p1: { x: number; y: number };
    p2: { x: number; y: number };
    angleDeg: number;
    baseDeg: number;
    type: 'dar' | 'dik' | 'genis' | 'dogru';
  } | null>(null);
  const [angleGameEstimate, setAngleGameEstimate] = useState<string>('');
  const [angleGameMeasurement, setAngleGameMeasurement] = useState<string>('');
  const [angleGameRound, setAngleGameRound] = useState<number>(1);
  const [angleGameTotalScore, setAngleGameTotalScore] = useState<number>(0);
  const [angleGameResult, setAngleGameResult] = useState<{
    trueDeg: number;
    estimate: number;
    measurement: number;
    estimateAccuracy: number;
    measureAccuracy: number;
    totalRoundScore: number;
    message: string;
  } | null>(null);
  const [angleMeasureError, setAngleMeasureError] = useState<string | null>(null);
  const [angleMeasureAttempts, setAngleMeasureAttempts] = useState<number>(0);

  // İnteraktif İletki (Açıölçer) State
  const [protractorCenter, setProtractorCenter] = useState<{ x: number; y: number }>({ x: 380, y: 350 });
  const [protractorRotation, setProtractorRotation] = useState<number>(0);
  const [isDraggingProtractorCenter, setIsDraggingProtractorCenter] = useState<boolean>(false);
  const [isRotatingProtractor, setIsRotatingProtractor] = useState<boolean>(false);
  const [isProtractorOnCanvas, setIsProtractorOnCanvas] = useState<boolean>(false);

  // İnteraktif Gönye (Dik Üçgen Cetveli) State
  const [setSquareOrigin, setSetSquareOrigin] = useState<{ x: number; y: number }>({ x: 320, y: 300 }); // 90° dik köşe H
  const [setSquareRotation, setSetSquareRotation] = useState<number>(0);
  const [isDraggingSetSquare, setIsDraggingSetSquare] = useState<boolean>(false);
  const [isRotatingSetSquare, setIsRotatingSetSquare] = useState<boolean>(false);
  const [isSetSquareOnCanvas, setIsSetSquareOnCanvas] = useState<boolean>(false);
  const [snappedLineInfo, setSnappedLineInfo] = useState<{
    lineId: string;
    lineSymbol: string;
    footPt: { x: number; y: number };
  } | null>(null);

  const [selectedPointForLink, setSelectedPointForLink] = useState<GeoPoint | null>(null);
  const [angleStepPoint1, setAngleStepPoint1] = useState<GeoPoint | null>(null); // Vertex O
  const [angleStepPoint2, setAngleStepPoint2] = useState<GeoPoint | null>(null); // Base point A
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const [draggingPointId, setDraggingPointId] = useState<string | null>(null);
  const touchDrawStartRef = useRef<{
    x: number;
    y: number;
    point: GeoPoint;
    tool: string;
  } | null>(null);
  const [activeColor, setActiveColor] = useState('#0284c7');
  const [showGrid, setShowGrid] = useState(true);
  const [showProtractor, setShowProtractor] = useState(true);
  const [armScaleMultiplier, setArmScaleMultiplier] = useState(1.0); // Misconception scale
  const [armScaleNotice, setArmScaleNotice] = useState<string | null>(null);

  // Missions state for Angle Lab
  const [activeMission, setActiveMission] = useState<number | null>(90);
  const [missionDone, setMissionDone] = useState<{ [deg: number]: boolean }>({
    90: false,
    45: false,
    135: false,
    180: false
  });

  // Geometry Lab Missions state (MAT.5.3.1 - 7 Maarif İstasyon Görevi)
  const [geoMissionsDone, setGeoMissionsDone] = useState({
    point: false,
    segment: false,
    rayLine: false,
    angle: false,
    circle: false,
    perpendicular: false,
    art: false
  });

  const [feedbackMsg, setFeedbackMsg] = useState(
    isAngleTopic
      ? 'Açı oluşturmak için tahtaya tıklayarak 1. Başlangıç Köşesi (O), 2. Taban Kolu (A) ve 3. Dönen Kolu (B) belirleyin.'
      : 'Tahtaya tıklayarak Nokta, Çizgeç (Doğru Parçası), Işın, Doğru, Açı, Pergel, Gönye veya Sanat araçlarını kullanabilirsiniz.'
  );

  // Angle Naming & Hat Verification state (MAT.5.3.3)
  const [angleNameInput, setAngleNameInput] = useState('');
  const [angleNameStatus, setAngleNameStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [angleNameFeedback, setAngleNameFeedback] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Reset & load defaults when outcome changes
  useEffect(() => {
    setActiveTool(isAngleTopic ? 'angle' : 'point');
    setPoints([]);
    setObjects([]);
    setAngles([]);
    setSelectedPointForLink(null);
    setAngleStepPoint1(null);
    setAngleStepPoint2(null);

    if (isAngleTopic) {
      loadPresetAngle(60);
    }
  }, [isAngleTopic, isExperimentBench, data.title]);

  // Recalculate angles when points move/change
  useEffect(() => {
    if (angles.length > 0) {
      setAngles((prevAngles) =>
        prevAngles.map((ang) => {
          const v = points.find((p) => p.id === ang.vertex.id) || ang.vertex;
          const p1 = points.find((p) => p.id === ang.p1.id) || ang.p1;
          const p2 = points.find((p) => p.id === ang.p2.id) || ang.p2;
          const deg = getAngleDegree(v, p1, p2);
          const typeInfo = getAngleType(deg);
          return {
            ...ang,
            vertex: v,
            p1,
            p2,
            degree: deg,
            type: typeInfo.type,
            label: `s(∠${p1.label}${v.label}${p2.label}) = ${deg}° (${typeInfo.title})`,
            color: typeInfo.color
          };
        })
      );
    }
  }, [points]);

  // Check missions for Angle Lab
  useEffect(() => {
    if (activeMission && angles.length > 0) {
      const currentAngle = angles[0]?.degree;
      if (
        (activeMission === 90 && currentAngle === 90) ||
        (activeMission === 45 && Math.abs(currentAngle - 45) <= 1) ||
        (activeMission === 135 && Math.abs(currentAngle - 135) <= 1) ||
        (activeMission === 180 && currentAngle === 180)
      ) {
        if (!missionDone[activeMission]) {
          setMissionDone((prev) => ({ ...prev, [activeMission]: true }));
          playSound('success');
          addPoints(30);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {}
        }
      }
    }
  }, [angles, activeMission]);

  // Check missions for Geometry Drawing Lab (MAT.5.3.1)
  useEffect(() => {
    if (!isAngleTopic && !isExperimentBench) {
      const hasPoint = points.length >= 1;
      const hasSegment = objects.some((o) => o.type === 'segment');
      const hasRayLine = objects.some((o) => o.type === 'ray' || o.type === 'line');
      const hasAngle = angles.length >= 1;
      const hasCircle = objects.some((o) => o.type === 'circle');
      const hasPerpendicular = objects.some((o) => o.type === 'perpendicular');
      const hasArt = objects.some((o) => o.type === 'art-motif');

      setGeoMissionsDone({
        point: hasPoint,
        segment: hasSegment,
        rayLine: hasRayLine,
        angle: hasAngle,
        circle: hasCircle,
        perpendicular: hasPerpendicular,
        art: hasArt
      });

      if (hasPoint && hasSegment && (hasRayLine || hasAngle) && (hasCircle || hasPerpendicular) && !geoMissionsDone.art) {
        unlockBadge('geo-master');
        addPoints(50);
      }
    }
  }, [points, objects, angles, isAngleTopic, isExperimentBench]);

  // Preset Angle Loader for MAT.5.3.3
  const loadPresetAngle = (deg: number) => {
    playSound('click');
    const v: GeoPoint = { id: 'pt-O', label: 'O', x: 260, y: 240, color: '#f59e0b' };
    const pA: GeoPoint = { id: 'pt-A', label: 'A', x: 440, y: 240, color: '#0284c7' };

    const rad = (deg * Math.PI) / 180;
    const pB: GeoPoint = {
      id: 'pt-B',
      label: 'B',
      x: Math.round(v.x + 180 * Math.cos(-rad)),
      y: Math.round(v.y + 180 * Math.sin(-rad)),
      color: '#10b396'
    };

    setPoints([v, pA, pB]);

    const ray1: GeoObject = {
      id: `ray-1-${Date.now()}`,
      type: 'ray',
      p1: v,
      p2: pA,
      symbol: '[OA',
      label: 'Taban Kolu [OA',
      color: '#0284c7'
    };

    const ray2: GeoObject = {
      id: `ray-2-${Date.now()}`,
      type: 'ray',
      p1: v,
      p2: pB,
      symbol: '[OB',
      label: 'Dönen Kol [OB',
      color: '#10b396'
    };

    setObjects([ray1, ray2]);

    const typeInfo = getAngleType(deg);
    const newAngle: GeoAngle = {
      id: `ang-${Date.now()}`,
      vertex: v,
      p1: pA,
      p2: pB,
      degree: deg,
      type: typeInfo.type,
      label: `s(∠AOB) = ${deg}° (${typeInfo.title})`,
      color: typeInfo.color
    };

    setAngles([newAngle]);
    setAngleStepPoint1(null);
    setAngleStepPoint2(null);
    setSelectedPointForLink(null);
    setAngleNameInput('');
    setAngleNameStatus('idle');
    setAngleNameFeedback(null);
    setFeedbackMsg(`📐 ${deg}°lik ${typeInfo.title} oluşturuldu! Noktaları sürükleyerek açıyı değiştirebilirsiniz.`);
  };

  // Preset Geometric Elements for MAT.5.3.1
  const loadDefaultGeometricPresets = () => {
    playSound('click');
    const pA: GeoPoint = { id: 'pt-A', label: 'A', x: 120, y: 140, color: '#10b396' };
    const pB: GeoPoint = { id: 'pt-B', label: 'B', x: 320, y: 140, color: '#10b396' };
    const pC: GeoPoint = { id: 'pt-C', label: 'C', x: 120, y: 260, color: '#0284c7' };
    const pD: GeoPoint = { id: 'pt-D', label: 'D', x: 320, y: 260, color: '#0284c7' };
    const pE: GeoPoint = { id: 'pt-E', label: 'E', x: 120, y: 380, color: '#8b5cf6' };
    const pF: GeoPoint = { id: 'pt-F', label: 'F', x: 320, y: 380, color: '#8b5cf6' };

    setPoints([pA, pB, pC, pD, pE, pF]);

    const seg: GeoObject = {
      id: 'obj-seg-1',
      type: 'segment',
      p1: pA,
      p2: pB,
      symbol: '[AB]',
      label: 'Doğru Parçası [AB]',
      color: '#10b396'
    };

    const ray: GeoObject = {
      id: 'obj-ray-1',
      type: 'ray',
      p1: pC,
      p2: pD,
      symbol: '[CD>',
      label: 'Işın [CD>',
      color: '#0284c7'
    };

    const line: GeoObject = {
      id: 'obj-line-1',
      type: 'line',
      p1: pE,
      p2: pF,
      symbol: 'EF',
      label: 'Doğru EF',
      color: '#8b5cf6'
    };

    setObjects([seg, ray, line]);
    setAngles([]);
    setSelectedPointForLink(null);
    setFeedbackMsg('🎨 Örnek geometrik modeller yüklendi: Doğru Parçası [AB], Işın [CD> ve Doğru EF.');
  };

  const loadAngleStationPreset = () => {
    playSound('click');
    const v: GeoPoint = { id: 'pt-O', label: 'B', x: 240, y: 280, color: '#f59e0b' };
    const pA: GeoPoint = { id: 'pt-A', label: 'A', x: 440, y: 280, color: '#0284c7' };
    const pC: GeoPoint = { id: 'pt-C', label: 'C', x: 240, y: 100, color: '#10b396' };
    setPoints([v, pA, pC]);

    const ray1: GeoObject = {
      id: 'ray-base',
      type: 'ray',
      p1: v,
      p2: pA,
      symbol: '[BA>',
      label: 'Taban Kolu [BA>',
      color: '#0284c7'
    };
    const ray2: GeoObject = {
      id: 'ray-rot',
      type: 'ray',
      p1: v,
      p2: pC,
      symbol: '[BC>',
      label: 'Dönen Kol [BC>',
      color: '#10b396'
    };
    const rightAngle: GeoAngle = {
      id: 'ang-right-90',
      vertex: v,
      p1: pA,
      p2: pC,
      degree: 90,
      type: 'dik',
      label: 's(∠ABC) = 90° (Dik Açı 📐)',
      color: '#ef4444'
    };
    setObjects([ray1, ray2]);
    setAngles([rightAngle]);
    setFeedbackMsg('📐 Dinamik 90° Dik Açı yüklendi: Ortak B köşesinden çıkan [BA> ve [BC> ışınları.');
  };

  const loadCircleStationPreset = () => {
    playSound('click');
    const m1: GeoPoint = { id: 'pt-M1', label: 'M1', x: 180, y: 220, color: '#0284c7' };
    const r1Pt: GeoPoint = { id: 'pt-R1', label: 'A', x: 245, y: 220, color: '#0284c7' };
    const m2: GeoPoint = { id: 'pt-M2', label: 'M2', x: 420, y: 220, color: '#10b396' };
    const r2Pt: GeoPoint = { id: 'pt-R2', label: 'B', x: 485, y: 220, color: '#10b396' };
    setPoints([m1, r1Pt, m2, r2Pt]);

    const circ1: GeoObject = {
      id: 'circ-1',
      type: 'circle',
      p1: m1,
      p2: r1Pt,
      symbol: 'Çember M1',
      label: '1. Çember (M1, r=5 cm, R=10 cm)',
      radius: 65,
      length: 5,
      isDisk: false,
      color: '#0284c7'
    };
    const circ2: GeoObject = {
      id: 'circ-2',
      type: 'circle',
      p1: m2,
      p2: r2Pt,
      symbol: 'Eş Çember M2',
      label: '2. Eş Çember (M2, r=5 cm, R=10 cm)',
      radius: 65,
      length: 5,
      isDisk: true,
      color: '#10b396'
    };
    setObjects([circ1, circ2]);
    setAngles([]);
    setFeedbackMsg('⭕ Pergel Kilidi ile Eş Çemberler yüklendi! r1 = r2 = 5 cm (Pergel açıklığı bozulmadan çizilen çemberler eştir).');
  };

  const loadPerpendicularStationPreset = () => {
    playSound('click');
    const pD1: GeoPoint = { id: 'pt-d1', label: 'E', x: 80, y: 320, color: '#38bdf8' };
    const pD2: GeoPoint = { id: 'pt-d2', label: 'F', x: 560, y: 320, color: '#38bdf8' };
    const pTop: GeoPoint = { id: 'pt-P', label: 'P', x: 300, y: 170, color: '#f43f5e' };
    const pH: GeoPoint = { id: 'pt-H', label: 'H', x: 300, y: 320, color: '#10b396' };
    const pSlant: GeoPoint = { id: 'pt-S', label: 'S', x: 450, y: 320, color: '#94a3b8' };
    setPoints([pD1, pD2, pTop, pH, pSlant]);

    const dLine: GeoObject = {
      id: 'line-d-base',
      type: 'line',
      p1: pD1,
      p2: pD2,
      symbol: 'd Doğrusu',
      label: 'Kıyı d Doğrusu',
      color: '#38bdf8'
    };
    const perpSeg: GeoObject = {
      id: 'perp-ph',
      type: 'perpendicular',
      p1: pTop,
      p2: pH,
      symbol: '[PH] ⊥ d',
      label: 'En Kısa Yol: Dikme [PH] ⊥ d (15 cm)',
      distance: 15,
      color: '#f43f5e',
      baseLineId: 'line-d-base'
    };
    const slantSeg: GeoObject = {
      id: 'slant-ps',
      type: 'segment',
      p1: pTop,
      p2: pSlant,
      symbol: '[PS]',
      label: 'Eğik Yol [PS] (23 cm - Daha Uzun)',
      length: 23,
      color: '#94a3b8'
    };
    const angle90: GeoAngle = {
      id: 'ang-ph-90',
      vertex: pH,
      p1: pD2,
      p2: pTop,
      degree: 90,
      type: 'dik',
      label: 's(∠FHP) = 90°',
      color: '#10b981'
    };
    setObjects([dLine, perpSeg, slantSeg]);
    setAngles([angle90]);
    setIsSetSquareOnCanvas(true);
    setSetSquareOrigin({ x: 300, y: 320 });
    setSetSquareRotation(0);
    setSnappedLineInfo({ lineId: 'line-d-base', lineSymbol: 'd Doğrusu', footPt: { x: 300, y: 320 } });
    setActiveTool('setsquare');
    setActiveToolCategory('lines');
    setFeedbackMsg('📐 İnteraktif Gönye tuvale yerleştirildi: [PH] ⊥ d dikmesi (15 cm) ve 90° dik açı incelenebilir.');
  };

  // Motif 1 (Selçuklu Yıldızı) Mission Handlers
  const loadMotif1Mission = () => {
    playSound('click');
    setIsMotif1Active(true);
    setIsMotif2Active(false);
    setMotifCompletedGuides([]);
    setMotifCelebrated(false);
    setMotifHintGuideId(null);

    // 8 star vertices + 1 center point M
    // Center: (380, 225), R = 115
    const pM: GeoPoint = { id: 'pt-m1-M', label: 'M', x: 380, y: 225, color: '#f59e0b' };
    const pA: GeoPoint = { id: 'pt-m1-A', label: 'A', x: 380, y: 110, color: '#0284c7' };
    const pB: GeoPoint = { id: 'pt-m1-B', label: 'B', x: 495, y: 225, color: '#0284c7' };
    const pC: GeoPoint = { id: 'pt-m1-C', label: 'C', x: 380, y: 340, color: '#0284c7' };
    const pD: GeoPoint = { id: 'pt-m1-D', label: 'D', x: 265, y: 225, color: '#0284c7' };

    const pE: GeoPoint = { id: 'pt-m1-E', label: 'E', x: 461, y: 144, color: '#10b396' };
    const pF: GeoPoint = { id: 'pt-m1-F', label: 'F', x: 461, y: 306, color: '#10b396' };
    const pG: GeoPoint = { id: 'pt-m1-G', label: 'G', x: 299, y: 306, color: '#10b396' };
    const pH: GeoPoint = { id: 'pt-m1-H', label: 'H', x: 299, y: 144, color: '#10b396' };

    setPoints([pM, pA, pB, pC, pD, pE, pF, pG, pH]);
    setObjects([]);
    setAngles([]);
    setPolygons([]);
    setPolygonDraft([]);
    setMeasureAnglePoints([]);
    setMeasureLengthPoints([]);
    setSelectedPointForLink(null);
    setCompassCenterPoint(null);
    setAngleStepPoint1(null);
    setAngleStepPoint2(null);
    setActiveToolCategory('motifs');
    setActiveTool('segment');
    setFeedbackMsg('⭐ Motif 1 Başladı! Kesik çizgilerle verilen Selçuklu Yıldızı modelini tamamlamak için uygun araçları (Doğru Parçası, Pergel, Doğru, Işın, Gönye) seçip şekli tamamlayın.');
  };

  // Motif 2 (Eli Belinde - Anadolu Kilimi) Mission Handlers
  const loadMotif2Mission = () => {
    playSound('click');
    setIsMotif1Active(false);
    setIsMotif2Active(true);
    setIsSnapToGrid(false);
    setMotifCompletedGuides([]);
    setMotifCelebrated(false);
    setMotifHintGuideId(null);

    // 16 Symmetrical Points for Eli Belinde Contour (Center X0 = 380) with labels hidden by default
    const pT: GeoPoint = { id: 'pt-m2-T', label: 'T', x: 380, y: 45, color: '#0284c7', hideLabel: true }; // Tepe
    const pA: GeoPoint = { id: 'pt-m2-A', label: 'A', x: 550, y: 215, color: '#06b6d4', hideLabel: true }; // Sağ Dış Köşe
    const pB: GeoPoint = { id: 'pt-m2-B', label: 'B', x: 490, y: 275, color: '#06b6d4', hideLabel: true }; // Sağ Alt Dirsek
    const pC: GeoPoint = { id: 'pt-m2-C', label: 'C', x: 430, y: 215, color: '#06b6d4', hideLabel: true }; // Sağ El İçi
    const pD: GeoPoint = { id: 'pt-m2-D', label: 'D', x: 490, y: 215, color: '#06b6d4', hideLabel: true }; // Sağ Kol Dışı
    const pE: GeoPoint = { id: 'pt-m2-E', label: 'E', x: 445, y: 170, color: '#06b6d4', hideLabel: true }; // Sağ Koltuk
    const pF: GeoPoint = { id: 'pt-m2-F', label: 'F', x: 400, y: 215, color: '#06b6d4', hideLabel: true }; // Sağ Bel
    const pG: GeoPoint = { id: 'pt-m2-G', label: 'G', x: 490, y: 305, color: '#0284c7', hideLabel: true }; // Sağ Etek
    const pS: GeoPoint = { id: 'pt-m2-S', label: 'S', x: 380, y: 415, color: '#0284c7', hideLabel: true }; // Taban
    const pH: GeoPoint = { id: 'pt-m2-H', label: 'H', x: 270, y: 305, color: '#0284c7', hideLabel: true }; // Sol Etek
    const pK: GeoPoint = { id: 'pt-m2-K', label: 'K', x: 360, y: 215, color: '#06b6d4', hideLabel: true }; // Sol Bel
    const pL: GeoPoint = { id: 'pt-m2-L', label: 'L', x: 315, y: 170, color: '#06b6d4', hideLabel: true }; // Sol Koltuk
    const pM: GeoPoint = { id: 'pt-m2-M', label: 'M', x: 270, y: 215, color: '#06b6d4', hideLabel: true }; // Sol Kol Dışı
    const pN: GeoPoint = { id: 'pt-m2-N', label: 'N', x: 330, y: 215, color: '#06b6d4', hideLabel: true }; // Sol El İçi
    const pP: GeoPoint = { id: 'pt-m2-P', label: 'P', x: 270, y: 275, color: '#06b6d4', hideLabel: true }; // Sol Alt Dirsek
    const pR: GeoPoint = { id: 'pt-m2-R', label: 'R', x: 210, y: 215, color: '#06b6d4', hideLabel: true }; // Sol Dış Köşe

    setPoints([pT, pA, pB, pC, pD, pE, pF, pG, pS, pH, pK, pL, pM, pN, pP, pR]);
    setObjects([]);
    setAngles([]);
    setPolygons([]);
    setPolygonDraft([]);
    setMeasureAnglePoints([]);
    setMeasureLengthPoints([]);
    setSelectedPointForLink(null);
    setCompassCenterPoint(null);
    setAngleStepPoint1(null);
    setAngleStepPoint2(null);
    setActiveToolCategory('motifs');
    setActiveTool('segment');
    setFeedbackMsg('🌸 Motif 2 Başladı! Anadolu kilimlerinin analık ve bereket simgesi "Eli Belinde" figürünün dış hatlarını Doğru Parçası aracıyla noktaları sırayla birleştirerek tamamlayın.');
  };

  const completeMotifGuide = (guideId: string) => {
    if (motifCompletedGuides.includes(guideId)) return;
    const newCompleted = [...motifCompletedGuides, guideId];
    setMotifCompletedGuides(newCompleted);
    playSound('success');
    addPoints(15);

    const guides = isMotif2Active ? MOTIF_2_GUIDES : MOTIF_1_GUIDES;
    const guide = guides.find((g) => g.id === guideId);
    if (guide) {
      setFeedbackMsg(`✨ Harika! ${guide.name} başarıyla tamamlandı! (${newCompleted.length}/${guides.length})`);
    }

    if (newCompleted.length === guides.length) {
      setMotifCelebrated(true);
      playSound('success');
      addPoints(100);
      unlockBadge(isMotif2Active ? 'kilim-artisan' : 'seljuk-architect');
      try {
        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.55 }
        });
      } catch (e) {}
    }
  };

  const checkAndCompleteMotifObject = (newObj: GeoObject) => {
    if (!isMotif1Active && !isMotif2Active) return;
    const l1 = newObj.p1?.label;
    const l2 = newObj.p2?.label;

    if (isMotif1Active) {
      if (newObj.type === 'segment' && l1 && l2) {
        const pair = [l1, l2].sort().join('-');
        if (pair === 'A-B') completeMotifGuide('motif-seg-ab');
        else if (pair === 'B-C') completeMotifGuide('motif-seg-bc');
        else if (pair === 'C-D') completeMotifGuide('motif-seg-cd');
        else if (pair === 'A-D') completeMotifGuide('motif-seg-da');
        else if (pair === 'E-F') completeMotifGuide('motif-seg-ef');
        else if (pair === 'F-G') completeMotifGuide('motif-seg-fg');
        else if (pair === 'G-H') completeMotifGuide('motif-seg-gh');
        else if (pair === 'E-H') completeMotifGuide('motif-seg-he');
      } else if (newObj.type === 'circle' && (l1 === 'M' || l2 === 'M')) {
        completeMotifGuide('motif-circle');
      } else if (newObj.type === 'line' && l1 && l2) {
        const pair = [l1, l2].sort().join('-');
        if (pair === 'B-D' || l1 === 'M' || l2 === 'M') {
          completeMotifGuide('motif-line-h');
        }
      } else if (newObj.type === 'ray' && (l1 === 'M' || l2 === 'M' || l1 === 'E' || l2 === 'E')) {
        completeMotifGuide('motif-ray-diag');
      } else if (newObj.type === 'perpendicular') {
        completeMotifGuide('motif-perp-v');
      }
    } else if (isMotif2Active) {
      if (newObj.type === 'segment' && l1 && l2) {
        const pair = [l1, l2].sort().join('-');
        if (pair === 'A-T') completeMotifGuide('m2-seg-ta');
        else if (pair === 'A-B') completeMotifGuide('m2-seg-ab');
        else if (pair === 'B-C') completeMotifGuide('m2-seg-bc');
        else if (pair === 'C-D') completeMotifGuide('m2-seg-cd');
        else if (pair === 'D-E') completeMotifGuide('m2-seg-de');
        else if (pair === 'E-F') completeMotifGuide('m2-seg-ef');
        else if (pair === 'F-G') completeMotifGuide('m2-seg-fg');
        else if (pair === 'G-S') completeMotifGuide('m2-seg-gs');
        else if (pair === 'H-S') completeMotifGuide('m2-seg-sh');
        else if (pair === 'H-K') completeMotifGuide('m2-seg-hk');
        else if (pair === 'K-L') completeMotifGuide('m2-seg-kl');
        else if (pair === 'L-M') completeMotifGuide('m2-seg-lm');
        else if (pair === 'M-N') completeMotifGuide('m2-seg-mn');
        else if (pair === 'N-P') completeMotifGuide('m2-seg-np');
        else if (pair === 'P-R') completeMotifGuide('m2-seg-pr');
        else if (pair === 'R-T') completeMotifGuide('m2-seg-rt');
      }
    }
  };

  const giveMotifNextHint = () => {
    if (!isMotif1Active && !isMotif2Active) return;
    const guides = isMotif2Active ? MOTIF_2_GUIDES : MOTIF_1_GUIDES;
    const remaining = guides.find((g) => !motifCompletedGuides.includes(g.id));
    if (!remaining) {
      setFeedbackMsg(`⭐ Tebrikler! Tüm ${isMotif2Active ? 'Eli Belinde' : 'Selçuklu'} motifi çizgilerini zaten tamamladınız!`);
      return;
    }
    setMotifHintGuideId(remaining.id);
    setActiveTool(remaining.requiredTool);
    playSound('click');
    setFeedbackMsg(`💡 İpucu: Sıradaki parça "${remaining.name}". Sol menüden "${remaining.toolTitle}" aracını seçip kesik çizgiye tıklayın veya noktaları birleştirin.`);
  };

  const autoCompleteMotifMission = () => {
    if (!isMotif1Active && !isMotif2Active) return;
    const guides = isMotif2Active ? MOTIF_2_GUIDES : MOTIF_1_GUIDES;
    const allIds = guides.map((g) => g.id);
    setMotifCompletedGuides(allIds);
    setMotifCelebrated(true);
    playSound('success');
    addPoints(100);
    unlockBadge(isMotif2Active ? 'kilim-artisan' : 'seljuk-architect');
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.55 }
      });
    } catch (e) {}
    setFeedbackMsg(`🎉 Harika! ${isMotif2Active ? 'Eli Belinde' : 'Selçuklu Yıldızı'} motifinin tüm kesik çizgileri başarıyla tamamlandı!`);
  };

  // ==========================================
  // AÇI TAHMİN VE İLETKİ ÖLÇÜM OYUNU FONKSİYONLARI
  // ==========================================
  const generateRandomAngleTarget = () => {
    const anglesPool = [
      25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
      95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155
    ];
    const targetDeg = anglesPool[Math.floor(Math.random() * anglesPool.length)];
    const vertex = { x: 380, y: 240 };
    const baseTilts = [0, 0, 0, 15, -15, 20, -20];
    const baseDeg = baseTilts[Math.floor(Math.random() * baseTilts.length)];
    const armLen = 170;

    const baseRad = (baseDeg * Math.PI) / 180;
    const p1 = {
      x: Math.round(vertex.x + armLen * Math.cos(baseRad)),
      y: Math.round(vertex.y + armLen * Math.sin(baseRad))
    };

    // Second arm sweeps counter-clockwise (upwards on screen, so baseDeg - targetDeg)
    const secondRad = ((baseDeg - targetDeg) * Math.PI) / 180;
    const p2 = {
      x: Math.round(vertex.x + armLen * Math.cos(secondRad)),
      y: Math.round(vertex.y + armLen * Math.sin(secondRad))
    };

    let type: 'dar' | 'dik' | 'genis' | 'dogru' = 'dar';
    if (targetDeg === 90) type = 'dik';
    else if (targetDeg > 90) type = 'genis';

    return {
      vertex,
      p1,
      p2,
      angleDeg: targetDeg,
      baseDeg,
      type
    };
  };

  const getProtractorDegreeAtPoint = (pt: { x: number; y: number }) => {
    const dx = pt.x - protractorCenter.x;
    const dy = pt.y - protractorCenter.y;
    const rad = (protractorRotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const xLocal = dx * cos + dy * sin;
    const yLocal = -dx * sin + dy * cos;
    let deg = (Math.atan2(-yLocal, xLocal) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    return Math.round(deg);
  };

  const startAngleGame = () => {
    playSound('click');
    setIsMotif1Active(false);
    setIsMotif2Active(false);
    setIsAngleGameActive(true);
    setAngleGameRound(1);
    setAngleGameTotalScore(0);
    loadAngleGameRound(1);
  };

  const loadAngleGameRound = (roundNum: number) => {
    const target = generateRandomAngleTarget();
    setAngleGameTarget(target);
    setAngleGameStage('estimate');
    setAngleGameEstimate('');
    setAngleGameMeasurement('');
    setAngleGameResult(null);
    setAngleMeasureError(null);
    setAngleMeasureAttempts(0);

    // Position protractor parked below canvas
    setProtractorCenter({ x: 380, y: 350 });
    setProtractorRotation(0);

    // Clear normal workshop items so canvas is focused on the game
    setPoints([]);
    setObjects([]);
    setAngles([]);
    setPolygons([]);
    setPolygonDraft([]);
    setMeasureAnglePoints([]);
    setMeasureLengthPoints([]);
    setSelectedPointForLink(null);

    setFeedbackMsg(`🎯 Tur ${roundNum}: Ekranda çizili olan açının ölçüsünü göz kararı tahmin edin ve onaylayın.`);
  };

  const submitAngleEstimate = () => {
    const est = parseInt(angleGameEstimate, 10);
    if (isNaN(est) || est <= 0 || est >= 180) {
      playSound('click');
      setFeedbackMsg('⚠️ Lütfen 1° ile 179° arasında geçerli bir açı tahmini girin.');
      return;
    }

    playSound('success');
    setAngleGameStage('measure');
    setAngleMeasureError(null);
    setAngleMeasureAttempts(0);
    setFeedbackMsg('📐 Harika! Şimdi iletkiyi merkezinden (turuncu) açının O köşesine taşıyın, mavi halkadan taban koluna dayayın ve doğru ölçümü girin.');
  };

  const submitAngleMeasurement = () => {
    if (!angleGameTarget) return;
    const meas = parseInt(angleGameMeasurement, 10);
    if (isNaN(meas) || meas <= 0 || meas >= 180) {
      playSound('click');
      setAngleMeasureError('Lütfen 1° ile 179° arasında bir sayı girin.');
      setFeedbackMsg('⚠️ Lütfen iletkinin gösterdiği 1° ile 179° arasında geçerli bir ölçüm değeri girin.');
      return;
    }

    const trueDeg = angleGameTarget.angleDeg;

    // 1. İletki açının O köşesine yerleştirildi mi?
    const distToVertex = Math.hypot(
      protractorCenter.x - angleGameTarget.vertex.x,
      protractorCenter.y - angleGameTarget.vertex.y
    );
    if (distToVertex > 35) {
      playSound('click');
      setAngleMeasureError('İletki açının O köşesine yerleştirilmedi!');
      setFeedbackMsg('⚠️ İletkiyi açının O köşesine yerleştirmediniz! Turuncu merkez halkasından tutarak O köşesine taşıyın veya "Köşeye Dayat" butonuna basın.');
      return;
    }

    // 2. İletki taban çizgisine hizalandı mı?
    const baseDegNorm = ((angleGameTarget.baseDeg % 360) + 360) % 360;
    const rotNorm = ((protractorRotation % 360) + 360) % 360;
    const diffRot = Math.abs(rotNorm - baseDegNorm);
    const isAligned = diffRot <= 4 || Math.abs(diffRot - 360) <= 4;
    if (!isAligned) {
      playSound('click');
      setAngleMeasureError('İletki taban koluna hizalanmadı!');
      setFeedbackMsg('⚠️ İletkinin taban çizgisi açının koluna hizalanmadı! Mavi halkadan çevirerek taban çizgisine tam oturtun.');
      return;
    }

    // 3. Ölçüm Doğruluk Kontrolü (Hatalıysa İlerleme Yapma!)
    if (meas !== trueDeg && Math.abs(meas - trueDeg) > 1) {
      playSound('click');
      setAngleMeasureAttempts((prev) => prev + 1);

      // Ters skala kontrolü (180 - trueDeg)
      if (Math.abs(meas - (180 - trueDeg)) <= 1) {
        const typeStr = trueDeg < 90 ? 'Dar Açı (<90°)' : 'Geniş Açı (>90°)';
        setAngleMeasureError(`Ters skala okundu (${meas}°). Doğru değer için 0°'dan başlayan tarafı okuyun.`);
        setFeedbackMsg(`⚠️ Ters yöndeki skalayı okudunuz (${meas}°)! Açınız ${typeStr} olduğundan 0°'dan başlayan doğru skala tarafını okumalısınız.`);
        return;
      }

      const directionHint = meas < trueDeg ? 'daha büyük' : 'daha küçük';
      setAngleMeasureError(`Hatalı Ölçüm: ${meas}°. Doğru açı bundan ${directionHint}!`);
      setFeedbackMsg(`❌ Hatalı Ölçüm! Girdiğiniz ${meas}° doğru değil. İletkide diğer kolun denk geldiği sayıyı dikkatle okuyun (İpucu: Açı ${meas}°'den ${directionHint}).`);
      return;
    }

    // 4. ÖLÇÜM KUSURSUZ VEYA ±1° TOLERANSTA DOĞRU
    setAngleMeasureError(null);
    const est = parseInt(angleGameEstimate, 10);
    const estDiff = Math.abs(est - trueDeg);
    const estAcc = Math.max(0, Math.round(100 - estDiff * 2.5));
    const measAcc = 100; // İletki ölçümü doğrulanarak kabul edildi!

    // Skor hesaplama: Tahmin (%40) + Kusursuz Ölçüm (%60)
    const penalty = Math.min(20, angleMeasureAttempts * 5);
    const totalRoundScore = Math.max(10, Math.round(estAcc * 0.4 + measAcc * 0.6) - penalty);

    let message = '';
    if (estAcc >= 90) {
      message = `🏆 Muhteşem Ölçüm! Açıyı hem göz kararı harika tahmin ettiniz (%${estAcc}) hem de iletkiyle tam doğru (${trueDeg}°) ölçtünüz!`;
    } else if (estAcc >= 70) {
      message = `🌟 Çok Başarılı! İletkiyle doğru ölçümü (${trueDeg}°) buldunuz. Göz kararı tahmininiz de gayet iyiydi (%${estAcc}).`;
    } else {
      message = `👏 Tebrikler! İletkiyi doğru kullanarak açının gerçek ölçüsünü (${trueDeg}°) başarıyla buldunuz!`;
    }

    setAngleGameResult({
      trueDeg,
      estimate: est,
      measurement: trueDeg,
      estimateAccuracy: estAcc,
      measureAccuracy: 100,
      totalRoundScore,
      message
    });

    setAngleGameTotalScore((prev) => prev + totalRoundScore);
    addPoints(totalRoundScore);
    setAngleGameStage('result');
    playSound('success');

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 }
      });
    } catch (e) {}

    setFeedbackMsg(`🎉 Tebrikler! Açıyı başarıyla ve doğru olarak ${trueDeg}° ölçtünüz!`);
  };

  const nextAngleGameRound = () => {
    playSound('click');
    const nextR = angleGameRound + 1;
    setAngleGameRound(nextR);
    loadAngleGameRound(nextR);
  };

  const exitAngleGame = () => {
    playSound('click');
    setIsAngleGameActive(false);
    setAngleGameTarget(null);
    setAngleGameStage('estimate');
    setFeedbackMsg('Geometri Atölyesine geri dönüldü.');
  };

  const snapProtractorToVertex = () => {
    if (!angleGameTarget) return;
    playSound('click');
    setProtractorCenter({ ...angleGameTarget.vertex });
    setProtractorRotation(angleGameTarget.baseDeg);
    setFeedbackMsg('🧲 İletki doğrudan açının O köşesine ve taban koluna hizalandı!');
  };

  // İnteraktif Gönye (Dik Üçgen Cetveli) Yardımcıları
  const SET_SQUARE_BASE_WIDTH = 210; // 7 cm
  const SET_SQUARE_HEIGHT = 150;     // 5 cm

  const getSetSquareFreeTip = (origin = setSquareOrigin, rot = setSquareRotation) => {
    const rad = (rot * Math.PI) / 180;
    return {
      x: Math.round(origin.x + SET_SQUARE_HEIGHT * Math.sin(rad)),
      y: Math.round(origin.y - SET_SQUARE_HEIGHT * Math.cos(rad))
    };
  };

  const getSetSquareBaseTip = (origin = setSquareOrigin, rot = setSquareRotation) => {
    const rad = (rot * Math.PI) / 180;
    return {
      x: Math.round(origin.x + SET_SQUARE_BASE_WIDTH * Math.cos(rad)),
      y: Math.round(origin.y + SET_SQUARE_BASE_WIDTH * Math.sin(rad))
    };
  };

  const findNearestLineSnap = (x: number, y: number, snapThreshold = 35) => {
    const straightLines = objects.filter(
      (o) => o.p2 && (o.type === 'segment' || o.type === 'line' || o.type === 'ray' || o.type === 'distance' || o.type === 'perpendicular')
    );
    let bestMatch: {
      line: GeoObject;
      proj: { x: number; y: number };
      dist: number;
      angleDeg: number;
    } | null = null;

    for (const line of straightLines) {
      const p1 = points.find((p) => p.id === line.p1.id) || line.p1;
      const p2 = points.find((p) => p.id === line.p2?.id) || line.p2!;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.hypot(dx, dy);
      if (len < 1) continue;

      const ux = dx / len;
      const uy = dy / len;
      const vx = x - p1.x;
      const vy = y - p1.y;
      let t = vx * ux + vy * uy;

      if (line.type === 'segment') {
        t = Math.max(-10, Math.min(len + 10, t));
      } else if (line.type === 'ray') {
        t = Math.max(-10, t);
      }

      const proj = {
        x: Math.round(p1.x + t * ux),
        y: Math.round(p1.y + t * uy)
      };
      const dist = Math.hypot(x - proj.x, y - proj.y);

      if (dist <= snapThreshold && (!bestMatch || dist < bestMatch.dist)) {
        const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
        bestMatch = { line, proj, dist, angleDeg };
      }
    }

    return bestMatch;
  };

  const createPerpendicularBetween = (ptP: GeoPoint, ptH: GeoPoint) => {
    const lineName = snappedLineInfo ? snappedLineInfo.lineSymbol : 'd Doğrusu';
    const distCm = Math.round((SET_SQUARE_HEIGHT / 30) * 10) / 10;

    const perpObj: GeoObject = {
      id: `perp-${Date.now()}`,
      type: 'perpendicular',
      p1: ptP,
      p2: ptH,
      symbol: `[${ptP.label}${ptH.label}] ⊥ ${lineName}`,
      label: `Dikme [${ptP.label}${ptH.label}] ⊥ ${lineName} (${distCm} cm)`,
      distance: distCm,
      color: activeColor || '#f43f5e',
      baseLineId: snappedLineInfo?.lineId
    };

    setObjects((prev) => [...prev, perpObj]);
    checkAndCompleteMotifObject(perpObj);
    playSound('success');
    addPoints(25);
    setFeedbackMsg(
      `🎉 Harika! Gönyeyi kullanarak [${ptP.label}${ptH.label}] ⊥ ${lineName} dikmesini kendiniz çizdiniz! Kesişim yerinde 90° diklik sembolü (⊾) oluşturuldu.`
    );
  };

  const handleSetSquarePointClick = (which: 'freeTip' | 'foot') => {
    const freeTip = getSetSquareFreeTip();
    const foot = setSquareOrigin;

    // Reuse existing points or create new ones
    let ptP = getPointNear(freeTip.x, freeTip.y, points, 24);
    let createdP = false;
    if (!ptP) {
      ptP = {
        id: `pt-P-${Date.now()}`,
        label: 'P',
        x: freeTip.x,
        y: freeTip.y,
        color: '#f43f5e'
      };
      createdP = true;
    }

    let ptH = getPointNear(foot.x, foot.y, points, 24);
    let createdH = false;
    if (!ptH) {
      ptH = {
        id: `pt-H-${Date.now()}`,
        label: 'H',
        x: foot.x,
        y: foot.y,
        color: '#10b396'
      };
      createdH = true;
    }

    const newPointsToAdd: GeoPoint[] = [];
    if (createdP) newPointsToAdd.push(ptP);
    if (createdH) newPointsToAdd.push(ptH);
    if (newPointsToAdd.length > 0) {
      setPoints((prev) => [...prev, ...newPointsToAdd]);
    }

    const clickedPoint = which === 'freeTip' ? ptP : ptH;
    const targetPoint = which === 'freeTip' ? ptH : ptP;

    // If student already selected the other end of the set square vertical edge
    if (selectedPointForLink) {
      const isOppositeSelected =
        selectedPointForLink.id === targetPoint.id ||
        Math.hypot(selectedPointForLink.x - targetPoint.x, selectedPointForLink.y - targetPoint.y) <= 28;

      if (isOppositeSelected) {
        createPerpendicularBetween(ptP, ptH);
        setSelectedPointForLink(null);
        setHoverPos(null);
        touchDrawStartRef.current = null;
        return;
      }

      if (selectedPointForLink.id === clickedPoint.id) {
        setSelectedPointForLink(null);
        setHoverPos(null);
        touchDrawStartRef.current = null;
        playSound('click');
        return;
      }
    }

    // 1st point clicked: start drawing line from this magnetic point
    setSelectedPointForLink(clickedPoint);
    setHoverPos({ x: clickedPoint.x, y: clickedPoint.y });
    touchDrawStartRef.current = { x: clickedPoint.x, y: clickedPoint.y, point: clickedPoint, tool: activeTool };
    if (activeTool !== 'segment' && activeTool !== 'ray' && activeTool !== 'line') {
      setActiveTool('segment');
    }
    playSound('select');
    if (which === 'freeTip') {
      setFeedbackMsg(
        `🧲 Mıknatıslı tepe noktasına (${ptP.label}) kilitlendi! Şimdi kesişim noktasına (${ptH.label}) doğru çizginizi uzatınız veya kesişim noktasına tıklayınız.`
      );
    } else {
      setFeedbackMsg(
        `🧲 Mıknatıslı kesişim noktasına (${ptH.label}) kilitlendi! Şimdi tepe noktasına (${ptP.label}) doğru çizginizi uzatınız veya tepe noktasına tıklayınız.`
      );
    }
  };

  const loadArtMotifStationPreset = () => {
    playSound('click');
    const m: GeoPoint = { id: 'pt-art-center', label: 'M', x: 320, y: 220, color: '#f59e0b' };
    setPoints([m]);

    const motifObj: GeoObject = {
      id: 'art-seljuk-1',
      type: 'art-motif',
      p1: m,
      symbol: 'Selçuklu Çinisi',
      label: '8 Köşeli Selçuklu Geometrik Çini Deseni [D7.1]',
      radius: 80,
      color: '#f59e0b',
      motifType: 'seljuk-star'
    };
    setObjects([motifObj]);
    setAngles([]);
    setPolygons([]);
    setPolygonDraft([]);
    setFeedbackMsg('🎨 [D7.1] Selçuklu Yıldızı & Sanat Panosu yüklendi: Çember, dikme ve doğruların kusursuz estetik birleşimi.');
  };

  // 6. İstasyon: GeoGebra Çokgen, Çevre & Alan Hazır Modeli
  const loadPolygonStationPreset = () => {
    playSound('click');
    const pA: GeoPoint = { id: 'pt-poly-A', label: 'A', x: 150, y: 300, color: '#10b396' };
    const pB: GeoPoint = { id: 'pt-poly-B', label: 'B', x: 330, y: 300, color: '#10b396' };
    const pC: GeoPoint = { id: 'pt-poly-C', label: 'C', x: 330, y: 150, color: '#10b396' };
    const trianglePts = [pA, pB, pC];

    const pD: GeoPoint = { id: 'pt-poly-D', label: 'D', x: 420, y: 300, color: '#0284c7' };
    const pE: GeoPoint = { id: 'pt-poly-E', label: 'E', x: 570, y: 300, color: '#0284c7' };
    const pF: GeoPoint = { id: 'pt-poly-F', label: 'F', x: 570, y: 180, color: '#0284c7' };
    const pG: GeoPoint = { id: 'pt-poly-G', label: 'G', x: 420, y: 180, color: '#0284c7' };
    const rectPts = [pD, pE, pF, pG];

    setPoints([pA, pB, pC, pD, pE, pF, pG]);

    const triPoly: GeoPolygon = {
      id: `poly-tri-${Date.now()}`,
      points: trianglePts,
      label: 'Dik Üçgen ABC',
      color: '#10b396',
      fillOpacity: 0.22,
      perimeter: calculatePolygonPerimeter(trianglePts),
      area: calculatePolygonArea(trianglePts)
    };

    const rectPoly: GeoPolygon = {
      id: `poly-rect-${Date.now()}`,
      points: rectPts,
      label: 'Dikdörtgen DEFG',
      color: '#0284c7',
      fillOpacity: 0.22,
      perimeter: calculatePolygonPerimeter(rectPts),
      area: calculatePolygonArea(rectPts)
    };

    setPolygons([triPoly, rectPoly]);
    setObjects([]);
    setAngles([]);
    setPolygonDraft([]);
    playSound('success');
    addPoints(25);
    setFeedbackMsg('📐 GeoGebra Çokgen Şablonu yüklendi: Dik Üçgen ABC ve Dikdörtgen DEFG. Köşeleri sürükleyerek çevre ve alanın canlı değişimini izleyin!');
  };

  const closePolygonDraft = () => {
    if (polygonDraft.length < 3) {
      setFeedbackMsg('⚠️ Çokgen oluşturmak için en az 3 köşe noktası gereklidir.');
      return;
    }
    const polyLabel = polygonDraft.map((p) => p.label).join('');
    const newPoly: GeoPolygon = {
      id: `poly-${Date.now()}`,
      points: [...polygonDraft],
      label: `Çokgen ${polyLabel}`,
      color: activeColor,
      fillOpacity: 0.22,
      perimeter: calculatePolygonPerimeter(polygonDraft),
      area: calculatePolygonArea(polygonDraft)
    };
    setPolygons((prev) => [...prev, newPoly]);
    setPolygonDraft([]);
    playSound('success');
    addPoints(30);
    setFeedbackMsg(`🎉 Çokgen ${polyLabel} tamamlandı! Çevre: ${newPoly.perimeter} cm, Alan: ${newPoly.area} cm²`);
  };

  const deletePolygon = (id: string) => {
    playSound('click');
    setPolygons((prev) => prev.filter((p) => p.id !== id));
    setFeedbackMsg('Çokgen silindi.');
  };

  const deleteObject = (id: string) => {
    playSound('click');
    setObjects((prev) => prev.filter((o) => o.id !== id));
    setFeedbackMsg('Geometrik nesne silindi.');
  };

  const toggleObjectLengthVisibility = (id: string) => {
    playSound('click');
    setObjects((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          if (o.type === 'ray' || o.type === 'line') {
            const nextHidden = !o.hideLabel;
            setFeedbackMsg(
              nextHidden
                ? `👁️‍🗨️ ${o.symbol} üzerindeki yazı etiketi gizlendi.`
                : `👁️ ${o.symbol} üzerindeki yazı etiketi görünür yapıldı.`
            );
            return { ...o, hideLabel: nextHidden, hideLength: nextHidden };
          }
          const nextHidden = !o.hideLength;
          setFeedbackMsg(
            nextHidden
              ? o.type === 'circle'
                ? `👁️‍🗨️ ${o.symbol} çemberinin yarıçap (r) ifadesi gizlendi.`
                : `👁️‍🗨️ ${o.symbol} üzerindeki uzunluk bilgisi gizlendi.`
              : o.type === 'circle'
                ? `👁️ ${o.symbol} çemberinin yarıçap (r) ifadesi görünür yapıldı.`
                : `👁️ ${o.symbol} üzerindeki uzunluk bilgisi görünür yapıldı.`
          );
          return { ...o, hideLength: nextHidden };
        }
        return o;
      })
    );
  };

  const toggleObjectLabelVisibility = (id: string) => {
    playSound('click');
    setObjects((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const nextHidden = !o.hideLabel;
          setFeedbackMsg(
            nextHidden
              ? `👁️‍🗨️ ${o.symbol} üzerindeki yazı etiketi gizlendi.`
              : `👁️ ${o.symbol} üzerindeki yazı etiketi görünür yapıldı.`
          );
          return { ...o, hideLabel: nextHidden };
        }
        return o;
      })
    );
  };

  const toggleAngleLabelVisibility = (id: string) => {
    playSound('click');
    setAngles((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextHidden = !a.hideLabel;
          setFeedbackMsg(
            nextHidden
              ? `👁️‍🗨️ ${a.label} açı etiketi gizlendi.`
              : `👁️ ${a.label} açı etiketi görünür yapıldı.`
          );
          return { ...a, hideLabel: nextHidden };
        }
        return a;
      })
    );
  };

  const togglePolygonLabelVisibility = (id: string) => {
    playSound('click');
    setPolygons((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextHidden = !p.hideLabel;
          setFeedbackMsg(
            nextHidden
              ? `👁️‍🗨️ ${p.label} çokgen etiketi gizlendi.`
              : `👁️ ${p.label} çokgen etiketi görünür yapıldı.`
          );
          return { ...p, hideLabel: nextHidden };
        }
        return p;
      })
    );
  };

  const togglePointLabelVisibility = (id: string) => {
    playSound('click');
    setPoints((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextHidden = !p.hideLabel;
          setFeedbackMsg(
            nextHidden
              ? `👁️‍🗨️ ${p.label} noktası etiketi gizlendi.`
              : `👁️ ${p.label} noktası etiketi görünür yapıldı.`
          );
          return { ...p, hideLabel: nextHidden };
        }
        return p;
      })
    );
  };

  const hasAnyElement = points.length > 0 || objects.length > 0 || angles.length > 0 || polygons.length > 0;

  const areAllLabelsHidden = Boolean(
    hasAnyElement &&
      (points.length === 0 || points.every((p) => p.hideLabel)) &&
      (objects.length === 0 || objects.every((o) => o.hideLabel && o.hideLength)) &&
      (angles.length === 0 || angles.every((a) => a.hideLabel)) &&
      (polygons.length === 0 || polygons.every((p) => p.hideLabel))
  );

  const toggleAllLabelsVisibility = () => {
    playSound('click');
    if (!hasAnyElement) {
      setFeedbackMsg('Tahtada henüz etiket içeren bir geometrik eleman bulunmuyor.');
      return;
    }
    if (areAllLabelsHidden) {
      setPoints((prev) => prev.map((p) => ({ ...p, hideLabel: false })));
      setObjects((prev) => prev.map((o) => ({ ...o, hideLabel: false, hideLength: false })));
      setAngles((prev) => prev.map((a) => ({ ...a, hideLabel: false })));
      setPolygons((prev) => prev.map((p) => ({ ...p, hideLabel: false })));
      setFeedbackMsg('👁️ Tahtadaki tüm etiketler ve ölçü yazıları görünür yapıldı.');
    } else {
      setPoints((prev) => prev.map((p) => ({ ...p, hideLabel: true })));
      setObjects((prev) => prev.map((o) => ({ ...o, hideLabel: true, hideLength: true })));
      setAngles((prev) => prev.map((a) => ({ ...a, hideLabel: true })));
      setPolygons((prev) => prev.map((p) => ({ ...p, hideLabel: true })));
      setFeedbackMsg('👁️‍🗨️ Tahtadaki tüm etiketler ve ölçü yazıları kaldırıldı.');
    }
  };

  const deletePoint = (id: string) => {
    playSound('click');
    setPoints((prev) => prev.filter((p) => p.id !== id));
    setObjects((prev) => prev.filter((o) => o.p1.id !== id && o.p2?.id !== id));
    setPolygons((prev) => prev.filter((poly) => !poly.points.some((p) => p.id === id)));
    setAngles((prev) => prev.filter((a) => a.vertex.id !== id && a.p1.id !== id && a.p2.id !== id));
    setFeedbackMsg('Nokta ve bağlı tüm şekiller silindi.');
  };

  const deleteAngle = (id: string) => {
    playSound('click');
    setAngles((prev) => prev.filter((a) => a.id !== id));
    setFeedbackMsg('Açı silindi.');
  };

  const clearAll = () => {
    playSound('clear');
    setPoints([]);
    setObjects([]);
    setAngles([]);
    setPolygons([]);
    setPolygonDraft([]);
    setMeasureAnglePoints([]);
    setThreePointAnglePoints([]);
    setMeasureLengthPoints([]);
    setSelectedPointForLink(null);
    setCompassCenterPoint(null);
    setAngleStepPoint1(null);
    setAngleStepPoint2(null);
    setHoverPos(null);
    setSnapCandidate(null);
    if (touchDrawStartRef.current) touchDrawStartRef.current = null;
    setAngleNameInput('');
    setAngleNameStatus('idle');
    setAngleNameFeedback(null);
    setIsMotif1Active(false);
    setIsMotif2Active(false);
    setMotifCompletedGuides([]);
    setMotifCelebrated(false);
    setMotifHintGuideId(null);
    setIsAngleGameActive(false);
    setAngleGameTarget(null);
    setAngleMeasureError(null);
    setIsProtractorOnCanvas(false);
    setIsSetSquareOnCanvas(false);
    setSnappedLineInfo(null);
    setFeedbackMsg('Tahta temizlendi. Yeni geometrik şekil, açı veya çokgen inşa edebilirsiniz.');
  };

  const undoLast = () => {
    playSound('click');
    if (threePointAnglePoints.length > 0) {
      setThreePointAnglePoints((prev) => prev.slice(0, -1));
      setFeedbackMsg('3 noktadan açı oluşturma için son seçilen nokta geri alındı.');
    } else if (measureLengthPoints.length > 0) {
      setMeasureLengthPoints((prev) => prev.slice(0, -1));
      setFeedbackMsg('Uzunluk ölçümü için seçilen nokta geri alındı.');
    } else if (measureAnglePoints.length > 0) {
      setMeasureAnglePoints((prev) => prev.slice(0, -1));
      setFeedbackMsg('Açı ölçümü için son seçilen nokta geri alındı.');
    } else if (polygonDraft.length > 0) {
      setPolygonDraft(polygonDraft.slice(0, -1));
      setFeedbackMsg('Son çokgen köşesi geri alındı.');
    } else if (polygons.length > 0) {
      setPolygons(polygons.slice(0, -1));
      setFeedbackMsg('Son çizilen çokgen geri alındı.');
    } else if (angles.length > 0) {
      setAngles(angles.slice(0, -1));
      setObjects(objects.slice(0, -2));
      setFeedbackMsg('Son oluşturulan açı geri alındı.');
    } else if (objects.length > 0) {
      setObjects(objects.slice(0, -1));
      setFeedbackMsg('Son çizilen şekil geri alındı.');
    } else if (points.length > 0) {
      setPoints(points.slice(0, -1));
      setFeedbackMsg('Son nokta geri alındı.');
    }
  };

  // Misconception test: extend arm lengths
  const toggleArmScale = () => {
    playSound('select');
    const nextScale = armScaleMultiplier === 1.0 ? 1.6 : armScaleMultiplier === 1.6 ? 2.0 : 1.0;
    setArmScaleMultiplier(nextScale);
    if (nextScale > 1.0) {
      setArmScaleNotice(
        `💡 Maarif İlkesi: Işınların kollarını ${nextScale}x uzattınız! Açıklık ve açıölçer derecesi (${angles[0]?.degree || 60}°) kesinlikle DEĞİŞMEDİ.`
      );
      addPoints(15);
    } else {
      setArmScaleNotice(null);
    }
  };

  // Check Angle Name Input Handler
  const handleCheckAngleName = () => {
    if (angles.length === 0) return;
    const ang = angles[0];
    const raw = angleNameInput.trim().toUpperCase().replace(/[^A-Z]/g, '');

    const correctFull1 = `${ang.p1.label}${ang.vertex.label}${ang.p2.label}`;
    const correctFull2 = `${ang.p2.label}${ang.vertex.label}${ang.p1.label}`;
    const correctVertexOnly = ang.vertex.label;

    if (raw === correctFull1 || raw === correctFull2 || raw === correctVertexOnly) {
      setAngleNameStatus('correct');
      setAngleNameFeedback(
        `🎉 Harika! Doğru isimlendirme: s(∠${correctFull1}) = ${ang.degree}° veya s(∠${ang.vertex.label}) = ${ang.degree}°. Köşe noktası (${ang.vertex.label}) daima ortada yer alır!`
      );
      playSound('success');
      addPoints(20);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    } else {
      setAngleNameStatus('wrong');
      playSound('click');
      if (raw.includes(ang.vertex.label) && raw.length === 3) {
        setAngleNameFeedback(
          `⚠️ Dikkat: Açının köşe noktası (${ang.vertex.label}) daima ortada yer almalıdır. Geçerli isimler: ${correctFull1}, ${correctFull2} veya sadece ${correctVertexOnly}.`
        );
      } else {
        setAngleNameFeedback(
          `❌ Yanlış isimlendirme. Bu açı ${correctFull1}, ${correctFull2} veya ${correctVertexOnly} şeklinde adlandırılır.`
        );
      }
    }
  };

  // Find point near coordinate
  const getPointNear = (x: number, y: number, currentPoints: GeoPoint[], radius = 26): GeoPoint | null => {
    for (const pt of currentPoints) {
      const dx = pt.x - x;
      const dy = pt.y - y;
      if (Math.sqrt(dx * dx + dy * dy) <= radius) {
        return pt;
      }
    }
    return null;
  };

  // Pointer Down on Canvas
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    try {
      (e.currentTarget as SVGElement)?.setPointerCapture?.(e.pointerId);
    } catch {}

    const rect = svgRef.current.getBoundingClientRect();
    const rawX = Math.round(e.clientX - rect.left);
    const rawY = Math.round(e.clientY - rect.top);

    // If Angle Game is active, canvas is controlled by game
    if (isAngleGameActive) {
      return;
    }

    // If near existing point (within 28px), snap to that point (point reuse / chaining)
    const hitPoint = getPointNear(rawX, rawY, points, 28);

    // Otherwise apply grid snap if enabled (precisely to grid intersection)
    const x = hitPoint ? hitPoint.x : isSnapToGrid ? snapCoordinate(rawX) : rawX;
    const y = hitPoint ? hitPoint.y : isSnapToGrid ? snapCoordinate(rawY) : rawY;

    // 0. PROTRACTOR TOOL (İletki / Açıölçer Konumlandırma)
    if (activeTool === 'protractor') {
      const targetPt = hitPoint ? { x: hitPoint.x, y: hitPoint.y } : { x, y };
      setProtractorCenter(targetPt);
      setIsProtractorOnCanvas(true);
      setActiveTool('drag');
      setSelectedPointForLink(null);
      setMeasureAnglePoints([]);
      setMeasureLengthPoints([]);
      playSound('click');
      if (hitPoint) {
        setFeedbackMsg(`📐 İletki ${hitPoint.label} noktasına yerleştirildi. Taşıma aracı aktif: Turuncu merkezden taşıyabilir, mavi tutamaktan döndürebilirsiniz.`);
      } else {
        setFeedbackMsg(`📐 İletki tuvale bırakıldı. Taşıma aracı aktif: Turuncu merkezden taşıyabilir, mavi tutamaktan döndürebilirsiniz.`);
      }
      return;
    }

    // 1. ERASER TOOL (Tekil Silme Aracı)
    if (activeTool === 'eraser') {
      if (hitPoint) {
        deletePoint(hitPoint.id);
        playSound('click');
        setFeedbackMsg(`🗑️ ${hitPoint.label} noktası ve bağlı şekiller silindi.`);
        return;
      }

      // Check if clicked near any object (segment, line, ray, circle, perpendicular, distance)
      const hitObj = objects.find((obj) => {
        const p1 = points.find((p) => p.id === obj.p1.id) || obj.p1;
        const p2 = obj.p2 ? (points.find((p) => p.id === obj.p2?.id) || obj.p2) : undefined;

        if (p1 && p2) {
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const lenSq = dx * dx + dy * dy;
          if (lenSq === 0) return Math.hypot(rawX - p1.x, rawY - p1.y) <= 18;
          let t = ((rawX - p1.x) * dx + (rawY - p1.y) * dy) / lenSq;
          if (obj.type === 'segment' || obj.type === 'perpendicular' || obj.type === 'distance') {
            t = Math.max(0, Math.min(1, t));
          } else if (obj.type === 'ray') {
            t = Math.max(0, t);
          }
          const projX = p1.x + t * dx;
          const projY = p1.y + t * dy;
          return Math.hypot(rawX - projX, rawY - projY) <= 18;
        } else if (obj.type === 'circle' && p1) {
          const rad = p2 ? Math.hypot(p2.x - p1.x, p2.y - p1.y) : (obj.radius || 60);
          const distToCenter = Math.hypot(rawX - p1.x, rawY - p1.y);
          return Math.abs(distToCenter - rad) <= 18;
        } else if (obj.type === 'art-motif' && p1) {
          const rad = obj.radius || 65;
          return Math.hypot(rawX - p1.x, rawY - p1.y) <= rad;
        }
        return false;
      });

      if (hitObj) {
        deleteObject(hitObj.id);
        playSound('click');
        setFeedbackMsg(`🗑️ ${hitObj.label || hitObj.symbol} silindi.`);
        return;
      }

      // Check if clicked inside/near any polygon
      const hitPoly = polygons.find((poly) => {
        const pts = poly.points.map((p) => points.find((pt) => pt.id === p.id) || p);
        let inside = false;
        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
          const xi = pts[i].x, yi = pts[i].y;
          const xj = pts[j].x, yj = pts[j].y;
          const intersect = ((yi > rawY) !== (yj > rawY)) && (rawX < (xj - xi) * (rawY - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
        }
        return inside;
      });

      if (hitPoly) {
        deletePolygon(hitPoly.id);
        playSound('click');
        setFeedbackMsg(`🗑️ ${hitPoly.label} çokgeni silindi.`);
        return;
      }

      // Check if clicked near any angle vertex
      const hitAngle = angles.find((ang) => {
        const v = points.find((p) => p.id === ang.vertex.id) || ang.vertex;
        return Math.hypot(rawX - v.x, rawY - v.y) <= 30;
      });

      if (hitAngle) {
        deleteAngle(hitAngle.id);
        playSound('click');
        setFeedbackMsg(`🗑️ ${hitAngle.label} açısı silindi.`);
        return;
      }

      return;
    }

    // 1. DRAG TOOL: Move existing points
    if (activeTool === 'drag') {
      if (hitPoint) {
        setDraggingPointId(hitPoint.id);
        playSound('click');
      }
      return;
    }

    // 2. POLYGON TOOL: Build vertices and close upon clicking first vertex
    if (activeTool === 'polygon') {
      if (polygonDraft.length >= 3) {
        const firstPt = polygonDraft[0];
        const distToFirst = Math.hypot(rawX - firstPt.x, rawY - firstPt.y);
        if (distToFirst <= 34 || (hitPoint && hitPoint.id === firstPt.id)) {
          closePolygonDraft();
          return;
        }
      }

      // Add vertex to polygon draft
      const pt: GeoPoint = hitPoint || {
        id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        label: POINT_LABELS[points.length % POINT_LABELS.length],
        x,
        y,
        color: activeColor
      };

      if (!hitPoint) {
        setPoints((prev) => [...prev, pt]);
      }

      // Avoid consecutive duplicate clicks on the exact same vertex
      if (polygonDraft.length > 0 && polygonDraft[polygonDraft.length - 1].id === pt.id) {
        return;
      }

      const nextDraft = [...polygonDraft, pt];
      setPolygonDraft(nextDraft);
      playSound('select');
      addPoints(5);
      if (nextDraft.length >= 3) {
        setFeedbackMsg(`⬡ ${nextDraft.length}. Köşe (${pt.label}) eklendi. Çokgeni kapatmak için 1. köşeye (${nextDraft[0].label}) tıklayınız veya 'Çokgeni Kapat' butonuna basınız.`);
      } else {
        setFeedbackMsg(`⬡ ${nextDraft.length}. Köşe (${pt.label}) eklendi. Çokgen için en az 3 köşe gereklidir.`);
      }
      return;
    }

    // 3. POINT TOOL (MAT.5.3.1)
    if (activeTool === 'point') {
      if (hitPoint) {
        setFeedbackMsg(`📍 Bu konumda zaten ${hitPoint.label} noktası var.`);
        return;
      }
      const nextLabel = POINT_LABELS[points.length % POINT_LABELS.length];
      const newPt: GeoPoint = {
        id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        label: nextLabel,
        x,
        y,
        color: activeColor
      };
      setPoints((prev) => [...prev, newPt]);
      playSound('select');
      addPoints(5);
      setFeedbackMsg(`📍 ${nextLabel} Noktası eklendi (Konum: x:${x}, y:${y}). Noktanın boyutu yoktur, sadece konum belirtir.`);
      return;
    }

    // 4. ANGLE TOOL (MAT.5.3.3)
    if (activeTool === 'angle') {
      const pt: GeoPoint = hitPoint || {
        id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        label: !angleStepPoint1 ? 'O' : !angleStepPoint2 ? 'A' : 'B',
        x,
        y,
        color: !angleStepPoint1 ? '#f59e0b' : !angleStepPoint2 ? '#0284c7' : '#10b396'
      };

      if (!hitPoint) {
        setPoints((prev) => [...prev, pt]);
      }

      if (!angleStepPoint1) {
        setAngleStepPoint1(pt);
        setHoverPos({ x: rawX, y: rawY });
        touchDrawStartRef.current = { x: pt.x, y: pt.y, point: pt, tool: 'angle-step-1' };
        playSound('select');
        setFeedbackMsg(`📍 Açının Köşesi (${pt.label}) belirlendi. Taban kolu için sürükleyip bırakınız veya tahtaya tıklayınız.`);
      } else if (!angleStepPoint2) {
        if (angleStepPoint1.id === pt.id) return;
        setAngleStepPoint2(pt);
        setHoverPos({ x: rawX, y: rawY });
        touchDrawStartRef.current = { x: pt.x, y: pt.y, point: pt, tool: 'angle-step-2' };
        playSound('select');

        const ray1: GeoObject = {
          id: `ray-1-${Date.now()}`,
          type: 'ray',
          p1: angleStepPoint1,
          p2: pt,
          symbol: `[${angleStepPoint1.label}${pt.label}`,
          label: `Taban Kolu [${angleStepPoint1.label}${pt.label}`,
          color: '#0284c7'
        };
        setObjects((prev) => [...prev, ray1]);
        setFeedbackMsg(`📐 [${angleStepPoint1.label}${pt.label} Taban Işını çizildi. Şimdi dönen kolu çizmek için sürükleyip bırakınız veya tıklayınız!`);
      } else {
        if (angleStepPoint1.id === pt.id || angleStepPoint2.id === pt.id) return;

        const ray2: GeoObject = {
          id: `ray-2-${Date.now()}`,
          type: 'ray',
          p1: angleStepPoint1,
          p2: pt,
          symbol: `[${angleStepPoint1.label}${pt.label}`,
          label: `Dönen Kol [${angleStepPoint1.label}${pt.label}`,
          color: '#10b396'
        };

        const deg = getAngleDegree(angleStepPoint1, angleStepPoint2, pt);
        const typeInfo = getAngleType(deg);

        const newAngle: GeoAngle = {
          id: `ang-${Date.now()}`,
          vertex: angleStepPoint1,
          p1: angleStepPoint2,
          p2: pt,
          degree: deg,
          type: typeInfo.type,
          label: `s(∠${angleStepPoint2.label}${angleStepPoint1.label}${pt.label}) = ${deg}° (${typeInfo.title})`,
          color: typeInfo.color
        };

        setObjects((prev) => [...prev, ray2]);
        setAngles((prev) => [...prev, newAngle]);
        setAngleStepPoint1(null);
        setAngleStepPoint2(null);
        setHoverPos(null);
        touchDrawStartRef.current = null;
        playSound('success');
        addPoints(25);
        setFeedbackMsg(`🎉 ∠${angleStepPoint2.label}${angleStepPoint1.label}${pt.label} Açısı oluşturuldu! Ölçü: ${deg}° (${typeInfo.title}).`);
      }
      return;
    }

    // 4b. MEASURE ANGLE TOOL (AÇI ÖLÇ: 3 Nokta Seçerek Aralarındaki Açıyı Ölç)
    if (activeTool === 'measure-angle') {
      const pt: GeoPoint = hitPoint || {
        id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        label: POINT_LABELS[points.length % POINT_LABELS.length],
        x,
        y,
        color: activeColor
      };

      if (!hitPoint) {
        setPoints((prev) => [...prev, pt]);
      }

      const currentPts = [...measureAnglePoints];

      // Avoid clicking the exact same point consecutively
      if (currentPts.length > 0 && currentPts[currentPts.length - 1].id === pt.id) {
        setFeedbackMsg(`⚠️ ${pt.label} noktası zaten seçildi. Lütfen farklı bir nokta seçiniz.`);
        return;
      }

      if (currentPts.length === 0) {
        setMeasureAnglePoints([pt]);
        playSound('select');
        setFeedbackMsg(`📍 [1/3] 1. Kol Noktası (${pt.label}) seçildi. Şimdi açının KÖŞE (Tepe) noktasını seçiniz.`);
      } else if (currentPts.length === 1) {
        setMeasureAnglePoints([currentPts[0], pt]);
        playSound('select');
        setFeedbackMsg(`📍 [2/3] Açının Köşesi (${pt.label}) belirlendi! Şimdi 2. Kol Noktasını seçiniz.`);
      } else if (currentPts.length === 2) {
        const p1 = currentPts[0];
        const vertex = currentPts[1];
        const p2 = pt;

        if (p1.id === p2.id) {
          setFeedbackMsg(`⚠️ 2. Kol noktası, 1. Kol noktası (${p1.label}) ile aynı olamaz. Lütfen farklı bir nokta seçiniz.`);
          return;
        }

        const deg = getAngleDegree(vertex, p1, p2);
        const typeInfo = getAngleType(deg);

        const newAngle: GeoAngle = {
          id: `ang-${Date.now()}`,
          vertex,
          p1,
          p2,
          degree: deg,
          type: typeInfo.type,
          label: `s(∠${p1.label}${vertex.label}${p2.label}) = ${deg}° (${typeInfo.title})`,
          color: typeInfo.color
        };

        setAngles((prev) => [...prev, newAngle]);
        setMeasureAnglePoints([]);
        setHoverPos(null);
        playSound('success');
        addPoints(30);
        setFeedbackMsg(`🎉 ∠${p1.label}${vertex.label}${p2.label} Açısı Ölçüldü: ${deg}° (${typeInfo.title})!`);
      }
      return;
    }

    // 4c. THREE-POINT ANGLE CREATION TOOL (3 Noktadan Açı Oluştur)
    if (activeTool === 'three-point-angle') {
      const pt: GeoPoint = hitPoint || {
        id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        label: POINT_LABELS[points.length % POINT_LABELS.length],
        x,
        y,
        color: activeColor
      };

      if (!hitPoint) {
        setPoints((prev) => [...prev, pt]);
      }

      const currentPts = [...threePointAnglePoints];

      // Avoid clicking the exact same point consecutively
      if (currentPts.length > 0 && currentPts[currentPts.length - 1].id === pt.id) {
        setFeedbackMsg(`⚠️ ${pt.label} noktası zaten seçildi. Lütfen farklı bir nokta seçiniz.`);
        return;
      }

      if (currentPts.length === 0) {
        setThreePointAnglePoints([pt]);
        playSound('select');
        setFeedbackMsg(`📍 [1/3] 1. Kol Noktası (${pt.label}) seçildi. Şimdi açının KÖŞE (Tepe) noktasını seçiniz.`);
      } else if (currentPts.length === 1) {
        setThreePointAnglePoints([currentPts[0], pt]);
        playSound('select');

        // Draw ray from vertex pt to first arm currentPts[0]
        const ray1: GeoObject = {
          id: `ray-1-${Date.now()}`,
          type: 'ray',
          p1: pt,
          p2: currentPts[0],
          symbol: `[${pt.label}${currentPts[0].label}>`,
          label: `[${pt.label}${currentPts[0].label}> Kolu`,
          color: '#0284c7'
        };
        setObjects((prev) => [...prev, ray1]);
        setFeedbackMsg(`📍 [2/3] Açının Köşesi (${pt.label}) belirlendi ve [${pt.label}${currentPts[0].label}> kolu çizildi! Şimdi 2. Kol Noktasını seçiniz.`);
      } else if (currentPts.length === 2) {
        const p1 = currentPts[0];
        const vertex = currentPts[1];
        const p2 = pt;

        if (p1.id === p2.id) {
          setFeedbackMsg(`⚠️ 2. Kol noktası, 1. Kol noktası (${p1.label}) ile aynı olamaz. Lütfen farklı bir nokta seçiniz.`);
          return;
        }

        // Draw ray from vertex to second arm p2
        const ray2: GeoObject = {
          id: `ray-2-${Date.now()}`,
          type: 'ray',
          p1: vertex,
          p2,
          symbol: `[${vertex.label}${p2.label}>`,
          label: `[${vertex.label}${p2.label}> Kolu`,
          color: '#10b396'
        };

        const deg = getAngleDegree(vertex, p1, p2);
        const typeInfo = getAngleType(deg);

        const newAngle: GeoAngle = {
          id: `ang-${Date.now()}`,
          vertex,
          p1,
          p2,
          degree: deg,
          type: typeInfo.type,
          label: `s(∠${p1.label}${vertex.label}${p2.label}) = ${deg}° (${typeInfo.title})`,
          color: typeInfo.color
        };

        setObjects((prev) => [...prev, ray2]);
        setAngles((prev) => [...prev, newAngle]);
        setThreePointAnglePoints([]);
        setHoverPos(null);
        playSound('success');
        addPoints(35);
        try {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.65 }
          });
        } catch {}
        setFeedbackMsg(`🎉 3 Noktadan ∠${p1.label}${vertex.label}${p2.label} Açısı ve kollar başarıyla oluşturuldu! Köşe: ${vertex.label}, Ölçü: ${deg}° (${typeInfo.title}).`);
      }
      return;
    }

    // 4d. MEASURE LENGTH TOOL (UZUNLUK ÖLÇ: Seçilen 2 Noktanın Uzunluğunu |AB| = 12 cm Göster)
    if (activeTool === 'measure-length') {
      const pt: GeoPoint = hitPoint || {
        id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        label: POINT_LABELS[points.length % POINT_LABELS.length],
        x,
        y,
        color: activeColor
      };

      if (!hitPoint) {
        setPoints((prev) => [...prev, pt]);
      }

      const currentPts = [...measureLengthPoints];

      if (currentPts.length === 0) {
        setMeasureLengthPoints([pt]);
        playSound('select');
        setFeedbackMsg(`📍 [1/2] 1. Nokta (${pt.label}) seçildi. Şimdi uzunluğu ölçülecek 2. noktayı seçiniz.`);
      } else if (currentPts.length === 1) {
        const p1 = currentPts[0];
        const p2 = pt;

        if (p1.id === p2.id) {
          setFeedbackMsg(`⚠️ Lütfen 1. noktadan (${p1.label}) farklı bir 2. nokta seçiniz.`);
          return;
        }

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const pixelLen = Math.hypot(dx, dy);
        const distCm = Math.round((pixelLen / GRID_SIZE) * 10) / 10;

        const newDistObj: GeoObject = {
          id: `dist-${Date.now()}`,
          type: 'distance',
          p1,
          p2,
          symbol: `|${p1.label}${p2.label}|`,
          label: `|${p1.label}${p2.label}| = ${distCm} cm`,
          length: distCm,
          color: activeColor
        };

        setObjects((prev) => [...prev, newDistObj]);
        setMeasureLengthPoints([]);
        setHoverPos(null);
        playSound('success');
        addPoints(20);
        setFeedbackMsg(`🎉 [${p1.label}${p2.label}] Uzunluğu Ölçüldü: |${p1.label}${p2.label}| = ${distCm} cm!`);
      }
      return;
    }

    // 5. SEGMENT / RAY / LINE TOOLS (MAT.5.3.1)
    if (activeTool === 'segment' || activeTool === 'ray' || activeTool === 'line') {
      const toolName = activeTool === 'segment' ? 'Doğru Parçası' : activeTool === 'ray' ? 'Işın' : 'Doğru';

      // Check if user is clicking on or near the set square magnetic free tip or 90° foot corner
      if (isSetSquareOnCanvas) {
        const freeTip = getSetSquareFreeTip();
        const distFreeTip = Math.hypot(rawX - freeTip.x, rawY - freeTip.y);
        const foot = setSquareOrigin;
        const distFoot = Math.hypot(rawX - foot.x, rawY - foot.y);

        if (distFreeTip <= 28) {
          handleSetSquarePointClick('freeTip');
          return;
        }

        if (distFoot <= 28) {
          handleSetSquarePointClick('foot');
          return;
        }
      }

      if (!selectedPointForLink) {
        // First point (1. Nokta - dokununca nokta koyar / var olan noktayı seçer)
        const p1: GeoPoint = hitPoint || {
          id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          label: POINT_LABELS[points.length % POINT_LABELS.length],
          x,
          y,
          color: activeColor
        };

        if (!hitPoint) {
          setPoints((prev) => [...prev, p1]);
        }

        setSelectedPointForLink(p1);
        setHoverPos({ x: rawX, y: rawY });
        touchDrawStartRef.current = { x: p1.x, y: p1.y, point: p1, tool: activeTool };
        playSound('select');
        setFeedbackMsg(`📍 1. Nokta (${p1.label}) seçildi. Sürükleyip parmağınızı kaldırarak veya 2. noktaya dokunarak ${toolName} çizebilirsiniz.`);
      } else {
        // Second point via tap / click mode
        const p1 = selectedPointForLink;
        if (hitPoint && hitPoint.id === p1.id) {
          setSelectedPointForLink(null);
          setHoverPos(null);
          touchDrawStartRef.current = null;
          return;
        }

        const p2: GeoPoint = hitPoint || {
          id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          label: POINT_LABELS[points.length % POINT_LABELS.length],
          x,
          y,
          color: activeColor
        };

        if (!hitPoint) {
          setPoints((prev) => [...prev, p2]);
        }

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const pixelLen = Math.round(Math.hypot(dx, dy));
        const cmLen = Math.round((pixelLen / 30) * 10) / 10;

        let symbolText = '';
        let labelText = '';

        if (activeTool === 'segment') {
          symbolText = `[${p1.label}${p2.label}]`;
          labelText = `Doğru Parçası [${p1.label}${p2.label}] (${cmLen} cm)`;
        } else if (activeTool === 'ray') {
          symbolText = `[${p1.label}${p2.label}>`;
          labelText = `Işın [${p1.label}${p2.label}>`;
        } else {
          symbolText = `${p1.label}${p2.label}`;
          labelText = `Doğru ${p1.label}${p2.label}`;
        }

        const newObj: GeoObject = {
          id: `obj-${Date.now()}`,
          type: activeTool,
          p1,
          p2,
          symbol: symbolText,
          label: labelText,
          length: cmLen,
          color: activeColor,
          hideLabel: isMotif2Active ? true : undefined,
          hideLength: (isMotif1Active || isMotif2Active) ? true : false
        };

        setObjects((prev) => [...prev, newObj]);
        checkAndCompleteMotifObject(newObj);
        setSelectedPointForLink(null);
        setHoverPos(null);
        touchDrawStartRef.current = null;
        playSound('success');
        addPoints(15);
        setFeedbackMsg(`✨ ${labelText} başarıyla çizildi! Başka bir doğru parçası eklemek için bu noktaya veya herhangi bir noktaya tıklayabilirsiniz.`);
      }
      return;
    }

    // 6. COMPASS & CIRCLE TOOL (MAT.5.3.1)
    if (activeTool === 'compass') {
      if (!compassCenterPoint) {
        // Center point M
        const pCenter: GeoPoint = hitPoint || {
          id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          label: 'M',
          x,
          y,
          color: activeColor
        };

        if (!hitPoint) {
          setPoints((prev) => [...prev, pCenter]);
        }

        setCompassCenterPoint(pCenter);
        setHoverPos({ x: rawX, y: rawY });
        touchDrawStartRef.current = { x: pCenter.x, y: pCenter.y, point: pCenter, tool: 'compass' };
        playSound('select');
        setFeedbackMsg(`⭕ Pergelin iğnesi ${pCenter.label} (Merkez) noktasına sabitlendi. Yarıçapı belirlemek için sürükleyip parmağınızı kaldırınız veya bir noktaya tıklayınız.`);
      } else {
        // Boundary point via tap / click mode
        const pCenter = compassCenterPoint;
        if (hitPoint && hitPoint.id === pCenter.id) return;

        const p2: GeoPoint = hitPoint || {
          id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          label: POINT_LABELS[points.length % POINT_LABELS.length],
          x,
          y,
          color: activeColor
        };

        if (!hitPoint) {
          setPoints((prev) => [...prev, p2]);
        }

        const dx = p2.x - pCenter.x;
        const dy = p2.y - pCenter.y;
        const radPix = Math.round(Math.hypot(dx, dy)) || 45;
        const radCm = Math.round((radPix / GRID_SIZE) * 10) / 10;

        const newCircle: GeoObject = {
          id: `circ-${Date.now()}`,
          type: 'circle',
          p1: pCenter,
          p2,
          symbol: `Çember (${pCenter.label})`,
          label: `Çember (Merkez: ${pCenter.label}, r = ${radCm} cm, R = ${Math.round(radCm * 2 * 10) / 10} cm)`,
          radius: radPix,
          length: radCm,
          isDisk: false,
          color: activeColor
        };

        setObjects((prev) => [...prev, newCircle]);
        checkAndCompleteMotifObject(newCircle);
        setCompassCenterPoint(null);
        setHoverPos(null);
        touchDrawStartRef.current = null;
        playSound('success');
        addPoints(20);
        setFeedbackMsg(`⭕ ${pCenter.label} merkezli çember çizildi! Yarıçap r = ${radCm} cm, Çap R = ${Math.round(radCm * 2 * 10) / 10} cm.`);
      }
      return;
    }

    // 7. SET SQUARE / PERPENDICULAR TOOL (MAT.5.3.1)
    if (activeTool === 'setsquare') {
      const targetPt = hitPoint ? { x: hitPoint.x, y: hitPoint.y } : { x, y };
      const snap = findNearestLineSnap(targetPt.x, targetPt.y, 40);
      if (snap) {
        setSetSquareOrigin(snap.proj);
        setSetSquareRotation(snap.angleDeg);
        setSnappedLineInfo({ lineId: snap.line.id, lineSymbol: snap.line.symbol, footPt: snap.proj });
        setFeedbackMsg(`🧲 Gönye ${snap.line.symbol} çizgisine yapıştı! Mıknatıslı ucundan 90° dikme indirebilirsiniz.`);
      } else {
        setSetSquareOrigin(targetPt);
        setSnappedLineInfo(null);
        setFeedbackMsg('📐 Gönye tuvale bırakıldı. Çizgilere yaklaştırarak yapıştırabilir veya tutamaçlardan yönetebilirsiniz.');
      }
      setIsSetSquareOnCanvas(true);
      playSound('click');
      return;
    }

    // 8. ART MOTIF TOOL [D7.1] (MAT.5.3.1)
    if (activeTool === 'artmotif') {
      const centerPt: GeoPoint = {
        id: `pt-motif-${Date.now()}`,
        label: 'M',
        x,
        y,
        color: '#f59e0b'
      };
      setPoints([...points, centerPt]);

      const artObj: GeoObject = {
        id: `art-${Date.now()}`,
        type: 'art-motif',
        p1: centerPt,
        symbol: 'Selçuklu Çinisi [D7.1]',
        label: 'Görsel Sanatlar: 8 Köşeli Selçuklu Geometrik Deseni',
        radius: 65,
        color: activeColor,
        motifType: 'seljuk-star'
      };

      setObjects([...objects, artObj]);
      playSound('success');
      addPoints(30);
      setFeedbackMsg(`🎨 [D7.1] Görsel Sanatlar: Çember ve dikmelerden türetilen Selçuklu Yıldızı motifi tuvale eklendi!`);
      return;
    }
  };

  // Pointer Move (Dragging, Touch-Draw Live Stretching & Preview Lines)
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const rawX = Math.round(e.clientX - rect.left);
    const rawY = Math.round(e.clientY - rect.top);

    // Interactive Protractor Dragging & Rotation
    if (isDraggingProtractorCenter) {
      let nextX = rawX;
      let nextY = rawY;
      if (angleGameTarget) {
        const d = Math.hypot(rawX - angleGameTarget.vertex.x, rawY - angleGameTarget.vertex.y);
        if (d <= 28) {
          nextX = angleGameTarget.vertex.x;
          nextY = angleGameTarget.vertex.y;
        }
      } else {
        // Free workshop mode: snap center to any existing point in points if within 25px
        const nearPt = getPointNear(rawX, rawY, points, 25);
        if (nearPt) {
          nextX = nearPt.x;
          nextY = nearPt.y;
        }
      }
      setProtractorCenter({ x: nextX, y: nextY });
      return;
    }

    if (isRotatingProtractor) {
      const dx = rawX - protractorCenter.x;
      const dy = rawY - protractorCenter.y;
      let deg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
      if (deg < 0) deg += 360;

      // Auto-snap rotation to base arm angle if within 6 degrees
      if (angleGameTarget) {
        const baseDegNorm = ((angleGameTarget.baseDeg % 360) + 360) % 360;
        const diff = Math.abs(deg - baseDegNorm);
        if (diff <= 6 || Math.abs(diff - 360) <= 6) {
          deg = baseDegNorm;
        }
      } else {
        // Free workshop mode: snap to cardinal angles (0, 45, 90, 135, 180, 225, 270, 315) if within 4 degrees
        const cardinalAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
        for (const card of cardinalAngles) {
          if (Math.abs(deg - card) <= 4 || Math.abs(deg - card + 360) <= 4) {
            deg = card % 360;
            break;
          }
        }
        // Also snap to any ray formed by protractorCenter to another point
        for (const pt of points) {
          const pdx = pt.x - protractorCenter.x;
          const pdy = pt.y - protractorCenter.y;
          if (Math.hypot(pdx, pdy) >= 20) {
            let ptDeg = Math.round((Math.atan2(pdy, pdx) * 180) / Math.PI);
            if (ptDeg < 0) ptDeg += 360;
            if (Math.abs(deg - ptDeg) <= 4 || Math.abs(deg - ptDeg + 360) <= 4) {
              deg = ptDeg;
              break;
            }
          }
        }
      }
      setProtractorRotation(deg);
      return;
    }

    // Interactive Set Square Dragging & Rotation
    if (isDraggingSetSquare) {
      const snap = findNearestLineSnap(rawX, rawY, 38);
      if (snap) {
        const normRot = ((setSquareRotation % 360) + 360) % 360;
        const normA1 = ((snap.angleDeg % 360) + 360) % 360;
        const normA2 = (((snap.angleDeg + 180) % 360) + 360) % 360;
        const diff1 = Math.min(Math.abs(normRot - normA1), 360 - Math.abs(normRot - normA1));
        const diff2 = Math.min(Math.abs(normRot - normA2), 360 - Math.abs(normRot - normA2));
        const targetRot = diff1 <= diff2 ? normA1 : normA2;

        setSetSquareOrigin(snap.proj);
        setSetSquareRotation(targetRot);
        setSnappedLineInfo({
          lineId: snap.line.id,
          lineSymbol: snap.line.symbol,
          footPt: snap.proj
        });
      } else {
        setSetSquareOrigin({ x: rawX, y: rawY });
        setSnappedLineInfo(null);
      }
      return;
    }

    if (isRotatingSetSquare) {
      const dx = rawX - setSquareOrigin.x;
      const dy = rawY - setSquareOrigin.y;
      let deg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
      if (deg < 0) deg += 360;

      const cardinal = [0, 45, 90, 135, 180, 225, 270, 315, 360];
      for (const card of cardinal) {
        if (Math.abs(deg - card) <= 4 || Math.abs(deg - card + 360) <= 4) {
          deg = card % 360;
          break;
        }
      }
      setSetSquareRotation(deg);
      return;
    }

    // Snap candidate calculation for visual feedback
    let snapTarget: { x: number; y: number; isPoint: boolean; label?: string } | null = null;

    if (isSetSquareOnCanvas) {
      const freeTip = getSetSquareFreeTip();
      const foot = setSquareOrigin;
      if (Math.hypot(rawX - freeTip.x, rawY - freeTip.y) <= 24) {
        snapTarget = { x: freeTip.x, y: freeTip.y, isPoint: true, label: 'P (Mıknatıs)' };
      } else if (Math.hypot(rawX - foot.x, rawY - foot.y) <= 24) {
        snapTarget = { x: foot.x, y: foot.y, isPoint: true, label: 'H (Kesişim)' };
      }
    }

    if (!snapTarget) {
      const nearPt = getPointNear(rawX, rawY, points, 20);
      if (nearPt) {
        snapTarget = { x: nearPt.x, y: nearPt.y, isPoint: true, label: nearPt.label };
      } else if (isSnapToGrid) {
        const gx = snapCoordinate(rawX);
        const gy = snapCoordinate(rawY);
        const dist = Math.hypot(rawX - gx, rawY - gy);
        if (dist <= 18) {
          snapTarget = { x: gx, y: gy, isPoint: false };
        }
      }
    }

    setSnapCandidate(snapTarget);

    if (draggingPointId) {
      const targetX = isSnapToGrid ? snapCoordinate(rawX) : rawX;
      const targetY = isSnapToGrid ? snapCoordinate(rawY) : rawY;

      setPoints((prev) =>
        prev.map((pt) => (pt.id === draggingPointId ? { ...pt, x: targetX, y: targetY } : pt))
      );
      setObjects((prev) =>
        prev.map((obj) => {
          const isP1 = obj.p1.id === draggingPointId;
          const isP2 = obj.p2?.id === draggingPointId;
          if (!isP1 && !isP2) return obj;

          const updatedP1 = isP1 ? { ...obj.p1, x: targetX, y: targetY } : (points.find((p) => p.id === obj.p1.id) || obj.p1);
          const updatedP2 = obj.p2
            ? isP2
              ? { ...obj.p2, x: targetX, y: targetY }
              : (points.find((p) => p.id === obj.p2!.id) || obj.p2)
            : undefined;

          if (obj.type === 'segment' && updatedP2) {
            const dx = updatedP2.x - updatedP1.x;
            const dy = updatedP2.y - updatedP1.y;
            const pixelLen = Math.hypot(dx, dy);
            const currentCm = Math.round((pixelLen / GRID_SIZE) * 10) / 10;
            return {
              ...obj,
              p1: updatedP1,
              p2: updatedP2,
              length: currentCm,
              label: `Doğru Parçası [${updatedP1.label}${updatedP2.label}] (${currentCm} cm)`
            };
          }

          if (obj.type === 'distance' && updatedP2) {
            const dx = updatedP2.x - updatedP1.x;
            const dy = updatedP2.y - updatedP1.y;
            const pixelLen = Math.hypot(dx, dy);
            const currentCm = Math.round((pixelLen / GRID_SIZE) * 10) / 10;
            return {
              ...obj,
              p1: updatedP1,
              p2: updatedP2,
              length: currentCm,
              symbol: `|${updatedP1.label}${updatedP2.label}|`,
              label: `|${updatedP1.label}${updatedP2.label}| = ${currentCm} cm`
            };
          }

          if (obj.type === 'circle') {
            const rad = updatedP2
              ? Math.round(Math.hypot(updatedP2.x - updatedP1.x, updatedP2.y - updatedP1.y))
              : (obj.radius || 60);
            const radCm = Math.round((rad / GRID_SIZE) * 10) / 10;
            return {
              ...obj,
              p1: updatedP1,
              p2: updatedP2,
              radius: rad,
              length: radCm,
              label: `Çember (Merkez: ${updatedP1.label}, r = ${radCm} cm, R = ${Math.round(radCm * 2 * 10) / 10} cm)`
            };
          }

          return {
            ...obj,
            p1: updatedP1,
            ...(updatedP2 ? { p2: updatedP2 } : {})
          };
        })
      );

      // Recalculate polygons dynamically when vertices are dragged!
      setPolygons((prev) =>
        prev.map((poly) => {
          if (!poly.points.some((p) => p.id === draggingPointId)) return poly;
          const updatedPts = poly.points.map((p) =>
            p.id === draggingPointId ? { ...p, x: targetX, y: targetY } : p
          );
          return {
            ...poly,
            points: updatedPts,
            perimeter: calculatePolygonPerimeter(updatedPts),
            area: calculatePolygonArea(updatedPts)
          };
        })
      );
      return;
    }

    if (selectedPointForLink || angleStepPoint1 || compassCenterPoint || touchDrawStartRef.current || polygonDraft.length > 0 || measureAnglePoints.length > 0 || threePointAnglePoints.length > 0 || measureLengthPoints.length > 0) {
      let targetHoverX = rawX;
      let targetHoverY = rawY;
      if (snapTarget) {
        targetHoverX = snapTarget.x;
        targetHoverY = snapTarget.y;
      } else if (isSnapToGrid) {
        targetHoverX = snapCoordinate(rawX);
        targetHoverY = snapCoordinate(rawY);
      }
      setHoverPos({ x: targetHoverX, y: targetHoverY });
    }
  };

  // Pointer Up (Complete Drag-to-Draw Shape upon Finger Release)
  const handlePointerUp = (e?: React.PointerEvent<SVGSVGElement>) => {
    if (e && svgRef.current) {
      try {
        (e.currentTarget as SVGElement)?.releasePointerCapture?.(e.pointerId);
      } catch {}
    }

    if (draggingPointId) {
      setDraggingPointId(null);
      playSound('click');
    }

    if (isDraggingProtractorCenter) {
      setIsDraggingProtractorCenter(false);
      playSound('click');
    }

    if (isRotatingProtractor) {
      setIsRotatingProtractor(false);
      playSound('click');
    }

    if (isDraggingSetSquare) {
      setIsDraggingSetSquare(false);
      playSound('click');
      if (snappedLineInfo) {
        playSound('select');
        setFeedbackMsg(`🧲 Gönye ${snappedLineInfo.lineSymbol} üzerine yapıştı! Şimdi mıknatıslı ucundan 90° dikme indirebilirsiniz.`);
      }
    }

    if (isRotatingSetSquare) {
      setIsRotatingSetSquare(false);
      playSound('click');
    }

    if (!touchDrawStartRef.current || !svgRef.current) {
      return;
    }

    const startInfo = touchDrawStartRef.current;
    touchDrawStartRef.current = null;

    let upX = hoverPos?.x ?? startInfo.x;
    let upY = hoverPos?.y ?? startInfo.y;

    if (e && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const rawUpX = Math.round(e.clientX - rect.left);
      const rawUpY = Math.round(e.clientY - rect.top);
      const nearPt = getPointNear(rawUpX, rawUpY, points.filter((p) => p.id !== startInfo.point.id), 28);
      upX = nearPt ? nearPt.x : isSnapToGrid ? snapCoordinate(rawUpX) : rawUpX;
      upY = nearPt ? nearPt.y : isSnapToGrid ? snapCoordinate(rawUpY) : rawUpY;
    }

    const dist = Math.hypot(upX - startInfo.x, upY - startInfo.y);

    // If dragged at least 20 pixels, complete drawing immediately on finger release!
    if (dist >= 20) {
      const p1 = startInfo.point;

      // Check if user dragged between set square magnetic free tip and foot
      if (isSetSquareOnCanvas) {
        const freeTip = getSetSquareFreeTip();
        const foot = setSquareOrigin;
        const startedAtFree = Math.hypot(p1.x - freeTip.x, p1.y - freeTip.y) <= 28;
        const endedAtFoot = Math.hypot(upX - foot.x, upY - foot.y) <= 32;
        const startedAtFoot = Math.hypot(p1.x - foot.x, p1.y - foot.y) <= 28;
        const endedAtFree = Math.hypot(upX - freeTip.x, upY - freeTip.y) <= 32;

        if ((startedAtFree && endedAtFoot) || (startedAtFoot && endedAtFree)) {
          let ptP = getPointNear(freeTip.x, freeTip.y, points, 24);
          if (!ptP) {
            ptP = { id: `pt-P-${Date.now()}`, label: 'P', x: freeTip.x, y: freeTip.y, color: '#f43f5e' };
            setPoints((prev) => [...prev, ptP!]);
          }
          let ptH = getPointNear(foot.x, foot.y, points, 24);
          if (!ptH) {
            ptH = { id: `pt-H-${Date.now()}`, label: 'H', x: foot.x, y: foot.y, color: '#10b396' };
            setPoints((prev) => [...prev, ptH!]);
          }
          createPerpendicularBetween(ptP, ptH);
          setSelectedPointForLink(null);
          setHoverPos(null);
          touchDrawStartRef.current = null;
          return;
        }
      }

      // Check if finger lifted over an existing point (snap)
      const hitPoint = getPointNear(upX, upY, points.filter((p) => p.id !== p1.id), 28);

      const nextLabel = POINT_LABELS[points.length % POINT_LABELS.length];
      const p2: GeoPoint = hitPoint || {
        id: `pt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        label: nextLabel,
        x: upX,
        y: upY,
        color: activeColor
      };

      if (!hitPoint) {
        setPoints((prev) => [...prev, p2]);
      }

      if (startInfo.tool === 'segment' || startInfo.tool === 'ray' || startInfo.tool === 'line') {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const pixelLen = Math.round(Math.hypot(dx, dy));
        const cmLen = Math.round((pixelLen / GRID_SIZE) * 10) / 10;

        let symbolText = '';
        let labelText = '';

        if (startInfo.tool === 'segment') {
          symbolText = `[${p1.label}${p2.label}]`;
          labelText = `Doğru Parçası [${p1.label}${p2.label}] (${cmLen} cm)`;
        } else if (startInfo.tool === 'ray') {
          symbolText = `[${p1.label}${p2.label}>`;
          labelText = `Işın [${p1.label}${p2.label}>`;
        } else {
          symbolText = `${p1.label}${p2.label}`;
          labelText = `Doğru ${p1.label}${p2.label}`;
        }

        const newObj: GeoObject = {
          id: `obj-${Date.now()}`,
          type: startInfo.tool as any,
          p1,
          p2,
          symbol: symbolText,
          label: labelText,
          length: cmLen,
          color: activeColor,
          hideLabel: isMotif2Active ? true : undefined,
          hideLength: (isMotif1Active || isMotif2Active) ? true : false
        };

        setObjects((prev) => [...prev, newObj]);
        checkAndCompleteMotifObject(newObj);
        setSelectedPointForLink(null);
        setHoverPos(null);
        playSound('success');
        addPoints(15);
        setFeedbackMsg(`✨ ${labelText} başarıyla çizildi!`);
      } else if (startInfo.tool === 'compass') {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const radPix = Math.round(Math.hypot(dx, dy)) || 45;
        const radCm = Math.round((radPix / GRID_SIZE) * 10) / 10;

        const newCircle: GeoObject = {
          id: `circ-${Date.now()}`,
          type: 'circle',
          p1,
          p2,
          symbol: `Çember (${p1.label})`,
          label: `Çember (Merkez: ${p1.label}, r = ${radCm} cm, R = ${Math.round(radCm * 2 * 10) / 10} cm)`,
          radius: radPix,
          length: radCm,
          isDisk: false,
          color: activeColor
        };

        setObjects((prev) => [...prev, newCircle]);
        checkAndCompleteMotifObject(newCircle);
        setCompassCenterPoint(null);
        setHoverPos(null);
        playSound('success');
        addPoints(20);
        setFeedbackMsg(`⭕ ${p1.label} merkezli çember çizildi! Yarıçap r = ${radCm} cm, Çap R = ${Math.round(radCm * 2 * 10) / 10} cm.`);
      } else if (startInfo.tool === 'angle-step-1') {
        setAngleStepPoint2(p2);
        const ray1: GeoObject = {
          id: `ray-1-${Date.now()}`,
          type: 'ray',
          p1,
          p2,
          symbol: `[${p1.label}${p2.label}`,
          label: `Taban Kolu [${p1.label}${p2.label}`,
          color: '#0284c7'
        };
        setObjects((prev) => [...prev, ray1]);
        setFeedbackMsg(`📐 [${p1.label}${p2.label} Taban Işını çizildi. Şimdi dönen 2. kolu çizmek için sürükleyip bırakınız veya tıklayınız!`);
        playSound('select');
      } else if (startInfo.tool === 'angle-step-2' && angleStepPoint1) {
        const vertex = angleStepPoint1;
        const arm1 = startInfo.point;
        const arm2 = p2;

        const ray2: GeoObject = {
          id: `ray-2-${Date.now()}`,
          type: 'ray',
          p1: vertex,
          p2: arm2,
          symbol: `[${vertex.label}${arm2.label}`,
          label: `Dönen Kol [${vertex.label}${arm2.label}`,
          color: '#10b396'
        };

        const deg = getAngleDegree(vertex, arm1, arm2);
        const typeInfo = getAngleType(deg);

        const newAngle: GeoAngle = {
          id: `ang-${Date.now()}`,
          vertex,
          p1: arm1,
          p2: arm2,
          degree: deg,
          type: typeInfo.type,
          label: `s(∠${arm1.label}${vertex.label}${arm2.label}) = ${deg}° (${typeInfo.title})`,
          color: typeInfo.color
        };

        setObjects((prev) => [...prev, ray2]);
        setAngles((prev) => [...prev, newAngle]);
        setAngleStepPoint1(null);
        setAngleStepPoint2(null);
        setHoverPos(null);
        playSound('success');
        addPoints(25);
        setFeedbackMsg(`🎉 ∠${arm1.label}${vertex.label}${arm2.label} Açısı oluşturuldu! Ölçü: ${deg}° (${typeInfo.title}).`);
      }
    }
  };

  // Render Angle Arc & Dynamic Badge
  const renderAngleVisual = (ang: GeoAngle) => {
    const v = points.find((p) => p.id === ang.vertex.id) || ang.vertex;
    const p1 = points.find((p) => p.id === ang.p1.id) || ang.p1;
    const p2 = points.find((p) => p.id === ang.p2.id) || ang.p2;

    const liveDeg = getAngleDegree(v, p1, p2);
    const liveTypeInfo = getAngleType(liveDeg);

    const baseAng = Math.atan2(p1.y - v.y, p1.x - v.x);
    const armAng = Math.atan2(p2.y - v.y, p2.x - v.x);

    let sweep = armAng - baseAng;
    while (sweep < -Math.PI) sweep += 2 * Math.PI;
    while (sweep > Math.PI) sweep -= 2 * Math.PI;

    const arcRadius = 48;
    const arcX1 = v.x + arcRadius * Math.cos(baseAng);
    const arcY1 = v.y + arcRadius * Math.sin(baseAng);
    const arcX2 = v.x + arcRadius * Math.cos(armAng);
    const arcY2 = v.y + arcRadius * Math.sin(armAng);

    const midBisectorAng = baseAng + sweep / 2;
    const labelDist = arcRadius + 38;
    const labelX = v.x + labelDist * Math.cos(midBisectorAng);
    const labelY = v.y + labelDist * Math.sin(midBisectorAng);

    const isRightAngle = liveDeg === 90;

    return (
      <g
        key={ang.id}
        className={`animate-in fade-in duration-200 ${activeTool === 'eraser' ? 'cursor-pointer hover:opacity-50 transition-opacity' : ''}`}
        onClick={(e) => {
          if (activeTool === 'eraser') {
            e.stopPropagation();
            deleteAngle(ang.id);
            playSound('click');
            setFeedbackMsg(`🗑️ ${ang.label} silindi.`);
          }
        }}
      >
        {/* Right Angle Square or Arc */}
        {isRightAngle ? (
          <g>
            {(() => {
              const sqSize = 22;
              const cosB = Math.cos(baseAng);
              const sinB = Math.sin(baseAng);
              const cosA = Math.cos(armAng);
              const sinA = Math.sin(armAng);

              const ptA = { x: v.x + sqSize * cosB, y: v.y + sqSize * sinB };
              const pCorner = {
                x: v.x + sqSize * cosB + sqSize * cosA,
                y: v.y + sqSize * sinB + sqSize * sinA
              };
              const ptB = { x: v.x + sqSize * cosA, y: v.y + sqSize * sinA };

              return (
                <>
                  <polygon
                    points={`${v.x},${v.y} ${ptA.x},${ptA.y} ${pCorner.x},${pCorner.y} ${ptB.x},${ptB.y}`}
                    fill="#059669"
                    fillOpacity="0.25"
                    stroke="#059669"
                    strokeWidth="2"
                  />
                  <circle
                    cx={v.x + (sqSize / 2) * cosB + (sqSize / 2) * cosA}
                    cy={v.y + (sqSize / 2) * sinB + (sqSize / 2) * sinA}
                    r="3"
                    fill="#059669"
                  />
                </>
              );
            })()}
          </g>
        ) : (
          <path
            d={`M ${arcX1} ${arcY1} A ${arcRadius} ${arcRadius} 0 0 ${sweep > 0 ? 1 : 0} ${arcX2} ${arcY2}`}
            fill="none"
            stroke={liveTypeInfo.color}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}

        {/* Dynamic Arc Fill Wedge */}
        {!isRightAngle && (
          <path
            d={`M ${v.x} ${v.y} L ${arcX1} ${arcY1} A ${arcRadius} ${arcRadius} 0 0 ${sweep > 0 ? 1 : 0} ${arcX2} ${arcY2} Z`}
            fill={liveTypeInfo.color}
            fillOpacity="0.12"
          />
        )}

        {/* Floating Angle Badge */}
        {!ang.hideLabel && (
          <g transform={`translate(${labelX}, ${labelY})`}>
            <rect
              x="-70"
              y="-16"
              width="140"
              height="32"
              rx="10"
              fill="#0f172a"
              stroke={liveTypeInfo.color}
              strokeWidth="2"
              className="shadow-lg"
            />
            <text
              x="0"
              y="-2"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontWeight="900"
            >
              ∠{p1.label}{v.label}{p2.label} = {liveDeg}°
            </text>
            <text
              x="0"
              y="10"
              textAnchor="middle"
              fill={liveTypeInfo.color}
              fontSize="9"
              fontWeight="bold"
            >
              {liveTypeInfo.title}
            </text>
          </g>
        )}
      </g>
    );
  };

  // Virtual Protractor (İletki) SVG Overlay for MAT.5.3.3
  const renderProtractorOverlay = (ang: GeoAngle) => {
    if (!showProtractor) return null;
    const v = points.find((p) => p.id === ang.vertex.id) || ang.vertex;
    const p1 = points.find((p) => p.id === ang.p1.id) || ang.p1;
    const baseAng = Math.atan2(p1.y - v.y, p1.x - v.x);
    const radius = 135;

    return (
      <g
        transform={`translate(${v.x}, ${v.y}) rotate(${(baseAng * 180) / Math.PI})`}
        className="pointer-events-none opacity-90 transition-all duration-200"
      >
        {/* Semi-Circle Plastic Body */}
        <path
          d={`M 0 0 L ${radius} 0 A ${radius} ${radius} 0 0 0 ${-radius} 0 Z`}
          fill="#0284c7"
          fillOpacity="0.12"
          stroke="#0284c7"
          strokeWidth="2"
        />
        {/* Inner cutout */}
        <path
          d={`M 0 0 L ${radius * 0.45} 0 A ${radius * 0.45} ${radius * 0.45} 0 0 0 ${-radius * 0.45} 0 Z`}
          fill="#0f172a"
          fillOpacity="0.08"
          stroke="#0284c7"
          strokeWidth="1.2"
        />

        {/* Degree Ticks & Numbers */}
        {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const isMajor = deg % 30 === 0 || deg === 45 || deg === 90 || deg === 135;
          const tickLen = isMajor ? 12 : 6;
          const x1 = (radius - tickLen) * Math.cos(-rad);
          const y1 = (radius - tickLen) * Math.sin(-rad);
          const x2 = radius * Math.cos(-rad);
          const y2 = radius * Math.sin(-rad);

          const tx = (radius - 22) * Math.cos(-rad);
          const ty = (radius - 22) * Math.sin(-rad);

          return (
            <g key={deg}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0369a1" strokeWidth={isMajor ? 2 : 1} />
              {isMajor && (
                <text
                  x={tx}
                  y={ty + 3}
                  textAnchor="middle"
                  fill="#0c4a6e"
                  fontSize="8"
                  fontWeight="900"
                >
                  {deg}°
                </text>
              )}
            </g>
          );
        })}

        {/* Center Origin Mark */}
        <circle cx="0" cy="0" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
      </g>
    );
  };

  // ==========================================
  // İNTERAKTİF İLETKİ (AÇIÖLÇER) OYUN ARACI
  // ==========================================
  const renderInteractiveProtractor = () => {
    const isProtractorVisible = (isAngleGameActive && angleGameStage !== 'estimate') || isProtractorOnCanvas;
    if (!isProtractorVisible) return null;

    const radius = 150;
    const innerRadius = 55;

    // Check distance to vertex and baseline alignment
    let isNearVertex = false;
    let isAligned = false;
    let interceptedList: Array<{
      deg: number;
      label: string;
      angleName?: string;
      pt: { x: number; y: number };
    }> = [];

    if (angleGameTarget) {
      const distToVertex = Math.hypot(protractorCenter.x - angleGameTarget.vertex.x, protractorCenter.y - angleGameTarget.vertex.y);
      isNearVertex = distToVertex <= 32;

      const baseDegNorm = ((angleGameTarget.baseDeg % 360) + 360) % 360;
      const rotNorm = ((protractorRotation % 360) + 360) % 360;
      const diffRot = Math.abs(rotNorm - baseDegNorm);
      isAligned = isNearVertex && (diffRot <= 3 || Math.abs(diffRot - 360) <= 3);

      if (isNearVertex) {
        const rawDeg = getProtractorDegreeAtPoint(angleGameTarget.p2);
        if (rawDeg >= 0 && rawDeg <= 180) {
          interceptedList.push({ deg: rawDeg, label: 'B', angleName: '∠AOB', pt: angleGameTarget.p2 });
        }
      }
    } else {
      // Free workshop mode: check points and angles on the canvas
      const nearVertexPt = getPointNear(protractorCenter.x, protractorCenter.y, points, 28);
      isNearVertex = !!nearVertexPt;

      if (nearVertexPt) {
        // Find all points that are geometrically connected to nearVertexPt (arms of angles or lines)
        const connectedPointIds = new Set<string>();

        // 1. From existing angles with vertex at nearVertexPt
        angles.forEach((ang) => {
          if (ang.vertex.id === nearVertexPt.id) {
            connectedPointIds.add(ang.p1.id);
            connectedPointIds.add(ang.p2.id);
          }
        });

        // 2. From lines, rays, segments, perpendiculars
        objects.forEach((o) => {
          if (o.p1.id === nearVertexPt.id && o.p2) {
            connectedPointIds.add(o.p2.id);
          } else if (o.p2 && o.p2.id === nearVertexPt.id) {
            connectedPointIds.add(o.p1.id);
          } else if (o.type === 'line' && o.p2) {
            // Check if nearVertexPt lies on this infinite line
            const pA = points.find((p) => p.id === o.p1.id) || o.p1;
            const pB = points.find((p) => p.id === o.p2!.id) || o.p2!;
            const dx = pB.x - pA.x;
            const dy = pB.y - pA.y;
            const len = Math.hypot(dx, dy);
            if (len > 0) {
              const dist = Math.abs((nearVertexPt.x - pA.x) * dy - (nearVertexPt.y - pA.y) * dx) / len;
              if (dist <= 18) {
                connectedPointIds.add(pA.id);
                connectedPointIds.add(pB.id);
              }
            }
          }
        });

        // 3. From polygons
        polygons.forEach((poly) => {
          const idx = poly.points.findIndex((p) => p.id === nearVertexPt.id);
          if (idx !== -1) {
            const prev = poly.points[(idx - 1 + poly.points.length) % poly.points.length];
            const next = poly.points[(idx + 1) % poly.points.length];
            if (prev) connectedPointIds.add(prev.id);
            if (next) connectedPointIds.add(next.id);
          }
        });

        // Identify baseline points along 0° or 180°
        let basePt0: GeoPoint | null = null;
        let basePt180: GeoPoint | null = null;

        for (const pt of points) {
          if (pt.id === nearVertexPt.id) continue;
          if (connectedPointIds.size > 0 && !connectedPointIds.has(pt.id)) continue;

          const d = Math.hypot(pt.x - protractorCenter.x, pt.y - protractorCenter.y);
          if (d < 20) continue;

          const deg = getProtractorDegreeAtPoint(pt);
          if (Math.abs(deg - 0) <= 4 || Math.abs(deg - 360) <= 4) {
            if (!basePt0 || d < Math.hypot(basePt0.x - protractorCenter.x, basePt0.y - protractorCenter.y)) {
              basePt0 = pt;
            }
          } else if (Math.abs(deg - 180) <= 4) {
            if (!basePt180 || d < Math.hypot(basePt180.x - protractorCenter.x, basePt180.y - protractorCenter.y)) {
              basePt180 = pt;
            }
          }
        }

        isAligned = !!(basePt0 || basePt180);

        // Find candidate angle arm points (exclude points not connected to nearVertexPt)
        for (const pt of points) {
          if (pt.id === nearVertexPt.id) continue;
          // Unrelated points (like A or B not connected to vertex G) must be ignored
          if (connectedPointIds.size > 0 && !connectedPointIds.has(pt.id)) continue;

          const d = Math.hypot(pt.x - protractorCenter.x, pt.y - protractorCenter.y);
          if (d < 25 || d > 600) continue;

          const rawDeg = getProtractorDegreeAtPoint(pt);
          // Only measure angle arms on the scale (do not show redundant badges directly on baseline 0°/180°)
          if (rawDeg > 3 && rawDeg < 177) {
            const matchingAngle = angles.find(
              (a) => a.vertex.id === nearVertexPt.id && (a.p1.id === pt.id || a.p2.id === pt.id)
            );

            let angleName = '';
            if (matchingAngle) {
              const otherArm = matchingAngle.p1.id === pt.id ? matchingAngle.p2 : matchingAngle.p1;
              angleName = `∠${pt.label}${nearVertexPt.label}${otherArm.label}`;
            } else if (basePt0) {
              angleName = `∠${pt.label}${nearVertexPt.label}${basePt0.label}`;
            } else if (basePt180) {
              angleName = `∠${pt.label}${nearVertexPt.label}${basePt180.label}`;
            } else {
              angleName = `∠${pt.label}${nearVertexPt.label}`;
            }

            interceptedList.push({
              deg: rawDeg,
              label: pt.label,
              angleName,
              pt
            });
          }
        }
      }
    }

    return (
      <g
        transform={`translate(${protractorCenter.x}, ${protractorCenter.y}) rotate(${protractorRotation})`}
        className="select-none"
      >
        {/* Semi-Circle Plastic Transparent Body with Soft Shadow */}
        <path
          d={`M ${-radius} 0 A ${radius} ${radius} 0 0 1 ${radius} 0 Z`}
          fill="#0284c7"
          fillOpacity="0.16"
          stroke={isAligned ? '#10b981' : isNearVertex ? '#f59e0b' : '#0284c7'}
          strokeWidth={isAligned ? '3' : '2'}
          className={`transition-colors duration-200 ${activeTool === 'eraser' ? 'cursor-pointer hover:opacity-50' : ''}`}
          pointerEvents={activeTool === 'eraser' ? 'auto' : 'none'}
          onPointerDown={(e) => {
            if (activeTool === 'eraser') {
              e.stopPropagation();
              setIsProtractorOnCanvas(false);
              playSound('click');
              setFeedbackMsg('🗑️ İletki tuvalden silindi.');
            }
          }}
        />

        {/* Inner Arch Cutout */}
        <path
          d={`M ${-innerRadius} 0 A ${innerRadius} ${innerRadius} 0 0 1 ${innerRadius} 0 Z`}
          fill="#ffffff"
          fillOpacity="0.65"
          stroke="#0284c7"
          strokeWidth="1.2"
        />

        {/* Baseline Line with Millimeter Ticks */}
        <line
          x1={-radius}
          y1="0"
          x2={radius}
          y2="0"
          stroke={isAligned ? '#10b981' : '#0369a1'}
          strokeWidth="2.5"
        />

        {/* Protractor Scale Ticks & Numbers (0° to 180°) */}
        {Array.from({ length: 181 }).map((_, deg) => {
          if (deg % 5 !== 0 && deg % 10 !== 0 && deg % 1 !== 0) return null;
          // Filter to save SVG DOM elements: render every 1 degree only for major ticks, or 2 degrees
          if (deg % 2 !== 0 && deg % 5 !== 0) return null;

          const isMajor = deg % 10 === 0;
          const isMedium = deg % 5 === 0 && !isMajor;
          const tickLen = isMajor ? 14 : isMedium ? 9 : 5;

          const rad = (deg * Math.PI) / 180;
          // In SVG upper semi-circle: angle -rad
          const cos = Math.cos(-rad);
          const sin = Math.sin(-rad);

          const x1 = (radius - tickLen) * cos;
          const y1 = (radius - tickLen) * sin;
          const x2 = radius * cos;
          const y2 = radius * sin;

          const outerTextX = (radius - 23) * cos;
          const outerTextY = (radius - 23) * sin;

          const innerTextX = (radius - 36) * cos;
          const innerTextY = (radius - 36) * sin;

          return (
            <g key={`deg-${deg}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMajor ? '#0f172a' : '#0369a1'}
                strokeWidth={isMajor ? 1.8 : isMedium ? 1.2 : 0.7}
              />
              {/* Outer Scale (0° right to 180° left) */}
              {isMajor && (
                <text
                  x={outerTextX}
                  y={outerTextY + 3}
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="7.5"
                  fontWeight="900"
                >
                  {deg}
                </text>
              )}
              {/* Inner Scale (180° right to 0° left) */}
              {isMajor && deg % 20 === 0 && deg > 0 && deg < 180 && (
                <text
                  x={innerTextX}
                  y={innerTextY + 2.5}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="6"
                  fontWeight="700"
                >
                  {180 - deg}
                </text>
              )}
            </g>
          );
        })}

        {/* Dynamic Second Arm Laser Intercept Line & Badge */}
        {interceptedList.map((item, idx) => {
          const rad = (item.deg * Math.PI) / 180;
          const cos = Math.cos(-rad);
          const sin = Math.sin(-rad);
          const lx = (radius + 20) * cos;
          const ly = (radius + 20) * sin;
          const badgeDist = radius + 38 + (idx * 28);
          const bx = badgeDist * cos;
          const by = badgeDist * sin;

          return (
            <g key={`intercept-${item.label}-${idx}`} className="animate-in fade-in duration-200">
              {/* Laser Sight Line from Vertex */}
              <line
                x1="0"
                y1="0"
                x2={lx}
                y2={ly}
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="4,3"
                className="animate-pulse"
              />
              {/* Laser Endpoint Marker */}
              <circle cx={lx} cy={ly} r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

              {/* Intercept Value Badge */}
              {(() => {
                const displayText = isAngleGameActive
                  ? `🎯 ${item.deg}° (Yaz)`
                  : `🎯 ${item.deg}° (${item.angleName || item.label})`;
                const badgeW = Math.max(92, displayText.length * 7 + 18);

                return (
                  <g
                    transform={`translate(${bx}, ${by})`}
                    className="cursor-pointer pointer-events-auto"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      if (isAngleGameActive) {
                        setAngleGameMeasurement(String(item.deg));
                        setAngleMeasureError(null);
                        playSound('click');
                        setFeedbackMsg(`🎯 İletkide okunan ${item.deg}° değeri ölçüm kutusuna aktarıldı. Şimdi "Ölçümü Onayla" butonuna basabilirsiniz.`);
                      } else {
                        playSound('click');
                        setFeedbackMsg(`🎯 İletki ile ölçülen ${item.angleName || item.label} açısı: ${item.deg}°. Taban: ${isAligned ? 'Hizalandı' : 'Serbest'}`);
                      }
                    }}
                  >
                    <rect
                      x={-badgeW / 2}
                      y="-13"
                      width={badgeW}
                      height="26"
                      rx="8"
                      fill="#0f172a"
                      stroke={isAligned ? '#10b981' : '#f59e0b'}
                      strokeWidth="2"
                      className="shadow-lg hover:scale-105 transition-transform"
                    />
                    <text
                      x="0"
                      y="4.5"
                      textAnchor="middle"
                      fill={isAligned ? '#34d399' : '#fde047'}
                      fontSize="10.5"
                      fontWeight="900"
                    >
                      {displayText}
                    </text>
                  </g>
                );
              })()}
            </g>
          );
        })}

        {/* Center Drag Grip Handle (Turuncu Halka) */}
        <g
          className="cursor-grab active:cursor-grabbing pointer-events-auto"
          onPointerDown={(e) => {
            e.stopPropagation();
            try {
              (e.currentTarget as SVGElement)?.setPointerCapture?.(e.pointerId);
            } catch {}
            setIsDraggingProtractorCenter(true);
            playSound('click');
          }}
        >
          <circle
            cx="0"
            cy="0"
            r="16"
            fill="#f59e0b"
            fillOpacity="0.25"
            stroke="#f59e0b"
            strokeWidth="2.5"
            className="animate-pulse"
          />
          <circle cx="0" cy="0" r="4.5" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" />
        </g>

        {/* Baseline Right End - Döndürme Tutamağı (Mavi Halka) */}
        <g
          transform={`translate(${radius + 14}, 0)`}
          className="cursor-pointer pointer-events-auto group"
          onPointerDown={(e) => {
            e.stopPropagation();
            try {
              (e.currentTarget as SVGElement)?.setPointerCapture?.(e.pointerId);
            } catch {}
            setIsRotatingProtractor(true);
            playSound('click');
          }}
        >
          {/* Geniş Görünmez Hedef Alanı */}
          <circle cx="0" cy="0" r="24" fill="transparent" />
          <circle
            cx="0"
            cy="0"
            r="16"
            fill="#0284c7"
            stroke="#ffffff"
            strokeWidth="2.5"
            className="shadow-lg transition-colors group-hover:fill-sky-500 group-hover:stroke-sky-200"
          />
          {/* Rotate icon text or glyph */}
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="12"
            fontWeight="bold"
            className="pointer-events-none"
          >
            🔄
          </text>
        </g>

        {/* Baseline Left End - Tuvalden Kaldırma (✕) Butonu */}
        {!isAngleGameActive && (
          <g
            transform={`translate(${-radius - 14}, 0)`}
            className="cursor-pointer pointer-events-auto group"
            onPointerDown={(e) => {
              e.stopPropagation();
              setIsProtractorOnCanvas(false);
              if (activeTool === 'protractor') setActiveTool('point');
              playSound('click');
              setFeedbackMsg('İletki tuvalden kaldırıldı.');
            }}
          >
            {/* Geniş Görünmez Hedef Alanı */}
            <circle cx="0" cy="0" r="22" fill="transparent" />
            <circle
              cx="0"
              cy="0"
              r="14"
              fill="#ef4444"
              stroke="#ffffff"
              strokeWidth="2"
              className="shadow-md transition-colors group-hover:fill-rose-600 group-hover:stroke-rose-200"
            />
            <text
              x="0"
              y="4.5"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="13"
              fontWeight="900"
              className="pointer-events-none"
            >
              ✕
            </text>
          </g>
        )}
      </g>
    );
  };

  // ==========================================
  // İNTERAKTİF GÖNYE (DİK ÜÇGEN CETVELİ) ARACI
  // ==========================================
  const renderInteractiveSetSquare = () => {
    if (!isSetSquareOnCanvas) return null;

    const W = SET_SQUARE_BASE_WIDTH; // 210 px = 7 cm
    const H = SET_SQUARE_HEIGHT;     // 150 px = 5 cm
    const isSnapped = !!snappedLineInfo;

    return (
      <g
        transform={`translate(${setSquareOrigin.x}, ${setSquareOrigin.y}) rotate(${setSquareRotation})`}
        className="select-none"
      >
        {/* Dik Üçgen Şeffaf Akrilik Gövde (30px = 1 cm) */}
        <polygon
          points={`0,0 ${W},0 0,${-H}`}
          fill="#059669"
          fillOpacity="0.18"
          stroke={isSnapped ? '#10b981' : '#059669'}
          strokeWidth={isSnapped ? '3.5' : '2'}
          className={`transition-colors duration-200 ${activeTool === 'eraser' ? 'cursor-pointer hover:opacity-50' : ''}`}
          pointerEvents={activeTool === 'eraser' ? 'auto' : 'none'}
          onPointerDown={(e) => {
            if (activeTool === 'eraser') {
              e.stopPropagation();
              setIsSetSquareOnCanvas(false);
              playSound('click');
              setFeedbackMsg('🗑️ Gönye tuvalden silindi.');
            }
          }}
        />

        {/* İç Üçgen Kesit (Şeffaf Beyaz) */}
        <polygon
          points={`32,-24 ${W - 65},-24 32,${-H + 45}`}
          fill="#ffffff"
          fillOpacity="0.72"
          stroke="#059669"
          strokeWidth="1.2"
        />

        {/* 90° Dik Açı Köşesi Sembolü (Kare & Yeşil Nokta) */}
        <rect
          x="0"
          y="-20"
          width="20"
          height="20"
          fill="#10b981"
          fillOpacity="0.3"
          stroke="#047857"
          strokeWidth="1.8"
        />
        <circle cx="10" cy="-10" r="3" fill="#047857" />
        <text
          x="28"
          y="-8"
          fill="#065f46"
          fontSize="10"
          fontWeight="900"
          className="pointer-events-none"
        >
          90°
        </text>

        {/* Taban Dik Kenarı Cetvel Çizgileri (0 to 7 cm) */}
        <line x1="0" y1="0" x2={W} y2="0" stroke={isSnapped ? '#10b981' : '#047857'} strokeWidth="2.5" />
        {Array.from({ length: 36 }).map((_, i) => {
          const x = i * 6;
          if (x > W) return null;
          const isCm = i % 5 === 0;
          const tickH = isCm ? 12 : 5;
          const cmNum = i / 5;
          return (
            <g key={`base-tick-${i}`}>
              <line x1={x} y1="0" x2={x} y2={-tickH} stroke="#0f172a" strokeWidth={isCm ? 1.5 : 0.8} />
              {isCm && (
                <text x={x} y={-15} textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="bold">
                  {cmNum}
                </text>
              )}
            </g>
          );
        })}

        {/* Dikey Dik Kenarı Cetvel Çizgileri (0 to 5 cm) */}
        <line x1="0" y1="0" x2="0" y2={-H} stroke={isSnapped ? '#10b981' : '#047857'} strokeWidth="2.5" />
        {Array.from({ length: 26 }).map((_, i) => {
          const y = -i * 6;
          if (-y > H) return null;
          const isCm = i % 5 === 0;
          const tickW = isCm ? 12 : 5;
          const cmNum = i / 5;
          return (
            <g key={`perp-tick-${i}`}>
              <line x1="0" y1={y} x2={tickW} y2={y} stroke="#0f172a" strokeWidth={isCm ? 1.5 : 0.8} />
              {isCm && cmNum > 0 && (
                <text x={16} y={y + 3} textAnchor="start" fill="#0f172a" fontSize="8" fontWeight="bold">
                  {cmNum}
                </text>
              )}
            </g>
          );
        })}

        {/* Değmeyen Uç (Mıknatıslı Tepe Noktası P) */}
        <g
          className="cursor-pointer pointer-events-auto group/magnet"
          onPointerDown={(e) => {
            e.stopPropagation();
            handleSetSquarePointClick('freeTip');
          }}
        >
          <title>Mıknatıslı Tepe Noktası (P) - Çizgi Başlangıç / Bitiş</title>
          {/* Geniş Görünmez Tıklama/Mıknatıs Alanı */}
          <circle cx="0" cy={-H} r="24" fill="transparent" />
          <circle
            cx="0"
            cy={-H}
            r="16"
            fill="#f43f5e"
            fillOpacity="0.25"
            stroke="#f43f5e"
            strokeWidth="2.5"
            className="animate-pulse"
          />
          <circle cx="0" cy={-H} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
        </g>

        {/* Kesişim Noktası (Mıknatıslı Ayak Noktası H - 90° Köşesi) */}
        <g
          className="cursor-pointer pointer-events-auto group/foot-magnet"
          onPointerDown={(e) => {
            e.stopPropagation();
            handleSetSquarePointClick('foot');
          }}
        >
          <title>Mıknatıslı Kesişim Noktası (H) - Çizgi Başlangıç / Bitiş</title>
          {/* Geniş Görünmez Tıklama/Mıknatıs Alanı */}
          <circle cx="0" cy="0" r="24" fill="transparent" />
          <circle
            cx="0"
            cy="0"
            r="16"
            fill="#10b396"
            fillOpacity="0.25"
            stroke="#10b396"
            strokeWidth="2.5"
            className="animate-pulse"
          />
          <circle cx="0" cy="0" r="5" fill="#10b396" stroke="#ffffff" strokeWidth="2" />
        </g>

        {/* Merkez Taşıma Tutamağı (Turuncu Halka - Centroid) */}
        <g
          transform="translate(70, -48)"
          className="cursor-grab active:cursor-grabbing pointer-events-auto group"
          onPointerDown={(e) => {
            e.stopPropagation();
            try {
              (e.currentTarget as SVGElement)?.setPointerCapture?.(e.pointerId);
            } catch {}
            setIsDraggingSetSquare(true);
            playSound('click');
          }}
        >
          <title>Gönyeyi Taşı</title>
          {/* Geniş Görünmez Tıklama/Sürükleme Alanı - Zıplamayı ve kaçırmayı engeller */}
          <circle cx="0" cy="0" r="26" fill="transparent" />
          <circle
            cx="0"
            cy="0"
            r="16"
            fill="#f59e0b"
            fillOpacity="0.25"
            stroke="#f59e0b"
            strokeWidth="2.5"
            className="transition-colors group-hover:fill-opacity-40 group-hover:stroke-amber-400"
          />
          <circle cx="0" cy="0" r="4.5" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" />
        </g>

        {/* Döndürme Tutamağı (Mavi Halka - Taban Ucu) */}
        <g
          transform={`translate(${W + 14}, 0)`}
          className="cursor-pointer pointer-events-auto group"
          onPointerDown={(e) => {
            e.stopPropagation();
            try {
              (e.currentTarget as SVGElement)?.setPointerCapture?.(e.pointerId);
            } catch {}
            setIsRotatingSetSquare(true);
            playSound('click');
          }}
        >
          <title>Gönyeyi Döndür</title>
          {/* Geniş Görünmez Tıklama/Tutma Alanı (48x48px hit target) - Asla zıplamaz */}
          <circle cx="0" cy="0" r="24" fill="transparent" />
          <circle
            cx="0"
            cy="0"
            r="16"
            fill="#0284c7"
            stroke="#ffffff"
            strokeWidth="2.5"
            className="shadow-lg transition-colors group-hover:fill-sky-500 group-hover:stroke-sky-200"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="12"
            fontWeight="bold"
            className="pointer-events-none"
          >
            🔄
          </text>
        </g>

        {/* Kaldırma (✕) Butonu */}
        <g
          transform={`translate(${W / 2 + 10}, ${-H / 2 - 20})`}
          className="cursor-pointer pointer-events-auto group"
          onPointerDown={(e) => {
            e.stopPropagation();
            setIsSetSquareOnCanvas(false);
            if (activeTool === 'setsquare') setActiveTool('point');
            playSound('click');
            setFeedbackMsg('Gönye tuvalden kaldırıldı.');
          }}
        >
          <title>Gönyeyi Tuvalden Kaldır</title>
          {/* Geniş Görünmez Tıklama Alanı (44x44px hit target) - Asla zıplamaz */}
          <circle cx="0" cy="0" r="22" fill="transparent" />
          <circle
            cx="0"
            cy="0"
            r="13"
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth="2"
            className="shadow-md transition-colors group-hover:fill-rose-600 group-hover:stroke-rose-200"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="12"
            fontWeight="900"
            className="pointer-events-none"
          >
            ✕
          </text>
        </g>
      </g>
    );
  };

  // ==========================================
  // OUTCOME: MAT.7.1.3 (RATIONAL OPERATIONS BENCH)
  // ==========================================
  if (isRationalOperationsBench) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        <RationalOperationsBench
          onComplete={() => addPoints(100)}
          onNextPhase={onNextPhase}
        />
      </div>
    );
  }

  // ==========================================
  // OUTCOME: MAT.7.1.2 (RATIONAL COMPARISON BENCH)
  // ==========================================
  if (isRationalComparisonBench) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
              <span>2. Aşama: Dinamik Rasyonel Terazi ve Referans Cetveli Laboratuvarı (MAT.7.1.2)</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{data.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Rasyonel terazi, 0 - 1/2 - 1 referans lazer metresi ve negatif sıcaklık sıralama masasıyla karşılaştırma stratejilerini keşfedin!
            </p>
          </div>
        </div>

        {/* Mascot Lab Helper */}
        <MascotLabHelper />

        {/* Rational Comparison Interactive Lab Bench */}
        <RationalComparisonBench />

        {/* Jump to Phase 3 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Atölye çalışmalarını tamamladıktan sonra 3. Aşama Oyunlar Arenası&apos;na geçebilirsiniz.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound('select');
              onNextPhase();
            }}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
          >
            <span>3. Aşama: Oyunlar Arenası</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // OUTCOME: MAT.7.1.1-2 (RATIONAL RULER DENSITY BENCH - WEEK 2)
  // ==========================================
  if (isRationalNumbersWeek2) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
              <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
              <span>2. Aşama: Dinamik Rasyonel Cetvel ve Yoğunluk Laboratuvarı (MAT.7.1.1 - 2. Hafta)</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{data.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Bileşik kesir konumlayıcı, denk temsiller mikroskobu ve mutlak değer mesafe lazeriyle rasyonel sayıları derinlemesine keşfedin!
            </p>
          </div>
        </div>

        {/* Rational Ruler & Density Interactive Lab Bench */}
        <RationalRulerDensityBench />

        {/* Jump to Phase 3 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Atölye çalışmalarını tamamladıktan sonra 3. Aşama Oyunlar Arenası&apos;na geçebilirsiniz.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound('select');
              onNextPhase();
            }}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
          >
            <span>3. Aşama: Oyunlar Arenası</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // OUTCOME: MAT.7.1.1 (RATIONAL NUMBERS BENCH - WEEK 1)
  // ==========================================
  if (isRationalNumbersOutcome) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
              <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
              <span>2. Aşama: Dinamik Sayı Doğrusu ve Sayı Kümeleri Laboratuvarı (MAT.7.1.1)</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{data.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Euler şeması (N ⊂ Z ⊂ Q), gizli payda mekanizması, dinamik sayı doğrusu ve mutlak değer lazer metresi ile rasyonel sayıları keşfedin!
            </p>
          </div>
        </div>

        {/* Rational Numbers Interactive Lab Bench */}
        <RationalNumbersBench />

        {/* Jump to Phase 3 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span>Atölye çalışmalarını tamamladıktan sonra 3. Aşama Oyunlar Arenası&apos;na geçebilirsiniz.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound('select');
              onNextPhase();
            }}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
          >
            <span>3. Aşama: Oyunlar Arenası</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // OUTCOME: MAT.6.1.2 (DIVISIBILITY CRITERIA BENCH)
  // ==========================================
  if (isDivisibilityOutcome) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
              <span>2. Aşama: Bölünebilme Dedektifi ve Basamak Analiz Laboratuvarı (MAT.6.1.2)</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{data.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Etkileşimli bölünebilme paneli, 3 ve 9 basamak ayrıştırma ispat laboratuvarı ve eksik basamak bulucu ile bölünebilme kurallarını keşfedin!
            </p>
          </div>
        </div>

        {/* Divisibility Interactive Lab Bench */}
        <DivisibilityBench />

        {/* Jump to Phase 3 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Atölye çalışmalarını tamamladıktan sonra 3. Aşama Oyunlar Arenası&apos;na geçebilirsiniz.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound('select');
              onNextPhase();
            }}
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
          >
            <span>3. Aşama: Oyunlar Arenası</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // OUTCOME: MAT.6.1.3 (PRIME NUMBERS & PRIME FACTORS BENCH)
  // ==========================================
  if (isPrimeFactorsOutcome) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
              <span>2. Aşama: Asal Sayı Kalburu ve Çarpan Algoritması Laboratuvarı (MAT.6.1.3)</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{data.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Eratosthenes kalburu (1-100), dinamik çarpan ağacı ve asal çarpanlar algoritması ile sayıların asal yapı taşlarını keşfedin!
            </p>
          </div>
        </div>

        {/* Prime Factors Interactive Lab Bench */}
        <PrimeFactorsBench />

        {/* Jump to Phase 3 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Atölye çalışmalarını tamamladıktan sonra 3. Aşama Oyunlar Arenası&apos;na geçebilirsiniz.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound('select');
              onNextPhase();
            }}
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
          >
            <span>3. Aşama: Oyunlar Arenası</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // OUTCOME: MAT.6.1.4 (COMMON MULTIPLES & COMMON DIVISORS BENCH)
  // ==========================================
  if (isCommonMultiplesDivisorsOutcome) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
              <span>2. Aşama: Ortak Bölen Venn Şeması ve Periyodik Kat Doğrusu Laboratuvarı (MAT.6.1.4)</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{data.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Venn şemalı ortak bölen alanı, çift sayı doğrusunda periyodik ortak katlar ve aralarında asallık dedektörü ile ortak özellikleri keşfedin!
            </p>
          </div>
        </div>

        {/* Common Multiples & Divisors Interactive Lab Bench */}
        <CommonMultiplesDivisorsBench />

        {/* Jump to Phase 3 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Atölye çalışmalarını tamamladıktan sonra 3. Aşama Oyunlar Arenası&apos;na geçebilirsiniz.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound('select');
              onNextPhase();
            }}
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
          >
            <span>3. Aşama: Oyunlar Arenası</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 0. OUTCOME: MAT.6.1.1 (FACTORS & MULTIPLES BENCH)
  // ==========================================
  if (isFactorsMultiplesOutcome) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
              <span>2. Aşama: Dinamik Çarpan Alanı ve Sayı Işını Laboratuvarı (MAT.6.1.1)</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{data.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Dikdörtgensel alan modelleme masası, çarpan gökkuşağı simülatörü ve zıplayan sayı doğrusu ile çarpan ve katları keşfedin!
            </p>
          </div>
        </div>

        {/* Factors & Multiples Interactive Lab Bench */}
        <FactorsMultiplesBench />

        {/* Jump to Phase 3 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Atölye çalışmalarını tamamladıktan sonra 3. Aşama Oyunlar Arenası&apos;na geçebilirsiniz.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound('select');
              onNextPhase();
            }}
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
          >
            <span>3. Aşama: Oyunlar Arenası</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 0. OUTCOME: MAT.5.3.4 (LINES & ANGLES EXPERIMENT BENCH)
  // ==========================================
  if (isLinesAnglesOutcome) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
              <span>2. Aşama: Dinamik Doğru ve Açı Laboratuvarı (OB2 & MAB3)</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{data.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Kesişen doğrular, ters açılar, dik kesişim & tümler açılar ve paralel hatları kesen doğruları 3 dinamik deney masasında inceleyin!
            </p>
          </div>
        </div>

        {/* 3 Experiment Tables */}
        <LinesAnglesBench />

        {/* Jump to Phase 3 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="text-xs text-slate-500 font-bold">
            3 Deneyi de tamamlayıp çıkarım kartlarını açtıktan sonra Oyun Zamanı aşamasına geçebilirsiniz.
          </div>
          <button
            onClick={() => {
              playSound('select');
              onNextPhase();
            }}
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>3. Aşamaya Geç: Oyun Zamanı</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 1. OUTCOME: MAT.5.3.2 (SELİMİYE EXPERIMENT BENCH)
  // ==========================================
  if (isExperimentBench) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
              <span>2. Aşama: Geometrik Çizim & İnşa Laboratuvarı</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{data.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Ölçüsüz cetvel, pergel ve gönye ile temel geometrik çizimleri ve aksiyomatik çıkarımları 3 canlı deney masasında keşfedin!
            </p>
          </div>
        </div>

        {/* 3 Experiment Tables */}
        <ExperimentBench />

        {/* Jump to Phase 3 */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="text-xs text-slate-500 font-bold">
            3 Deneyi de tamamladıktan sonra Oyun Zamanı aşamasına geçebilirsiniz.
          </div>
          <button
            onClick={() => {
              playSound('select');
              onNextPhase();
            }}
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>3. Aşamaya Geç: Oyun Zamanı</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. OUTCOME: MAT.5.3.3 (ANGLE & PROTRACTOR LAB)
  // ==========================================
  if (isAngleTopic) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        
        {/* Top Banner */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span>2. Aşama: İnteraktif Açı & İletki Laboratuvarı</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{data.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              İki ışının birleşimiyle açıyı oluşturun, iletkiyle dereceyi ölçün ve canlı tutamaçlarla açıları sınıflandırın.
            </p>
          </div>
        </div>

        {/* ANGLE CANVAS & TOOLS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT TOOLBAR */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* 1. Main Angle Tools */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Açı Çizim ve Ölçüm Araçları
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setActiveTool('three-point-angle');
                    setSelectedPointForLink(null);
                    setAngleStepPoint1(null);
                    setAngleStepPoint2(null);
                    setMeasureAnglePoints([]);
                    setMeasureLengthPoints([]);
                    setThreePointAnglePoints([]);
                    playSound('click');
                    setFeedbackMsg('📐 3 NOKTADAN AÇI: Sırasıyla 1. Kol (A), Köşe 📍 (B) ve 2. Kol (C) noktalarını seçiniz.');
                  }}
                  className={`p-2.5 rounded-2xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all relative ${
                    activeTool === 'three-point-angle'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20 scale-102 ring-2 ring-blue-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Shapes className="w-5 h-5" />
                  <span className="text-[11px] leading-tight">3 Noktadan Açı</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTool('angle');
                    setSelectedPointForLink(null);
                    setAngleStepPoint1(null);
                    setAngleStepPoint2(null);
                    setThreePointAnglePoints([]);
                    playSound('click');
                    setFeedbackMsg('Açı aracı seçildi: 1. Başlangıç köşesine (O), sonra 1. kola (A) ve 2. kola (B) tıklayınız.');
                  }}
                  className={`p-2.5 rounded-2xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                    activeTool === 'angle'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-102'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Compass className="w-5 h-5" />
                  <span className="text-[11px] leading-tight">Serbest Açı</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTool('drag');
                    setSelectedPointForLink(null);
                    setThreePointAnglePoints([]);
                    playSound('click');
                    setFeedbackMsg('🖐️ Tahtadaki açı kollarını veya köşesini sürükleyerek açıyı canlı değiştiriniz.');
                  }}
                  className={`p-2.5 rounded-2xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                    activeTool === 'drag'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-102'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Move className="w-5 h-5" />
                  <span className="text-[11px] leading-tight">Kolu Döndür</span>
                </button>
              </div>

              {/* Virtual Protractor & Scale Controls */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-teal-600" />
                    <span>Sanal İletki (Açıölçer)</span>
                  </span>
                  <button
                    onClick={() => {
                      setShowProtractor(!showProtractor);
                      playSound('click');
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                      showProtractor
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {showProtractor ? 'Açık 📐' : 'Kapalı'}
                  </button>
                </div>

                {/* Misconception: Arm Extension Button */}
                <button
                  onClick={toggleArmScale}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-600" />
                    <span>Kolları Uzat / Test Et</span>
                  </div>
                  <span className="font-mono font-black bg-amber-200 px-2 py-0.5 rounded text-[11px]">
                    {armScaleMultiplier}x
                  </span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={undoLast}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Geri Al</span>
                </button>
                <button
                  onClick={clearAll}
                  className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Temizle</span>
                </button>
              </div>

            </div>

            {/* 2. Quick Preset Angles */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Hızlı Açı Şablonları Yükle
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => loadPresetAngle(45)}
                  className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold text-center"
                >
                  🔹 45° Dar Açı
                </button>
                <button
                  onClick={() => loadPresetAngle(90)}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold text-center"
                >
                  🟩 90° Dik Açı
                </button>
                <button
                  onClick={() => loadPresetAngle(135)}
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold text-center"
                >
                  🔸 135° Geniş Açı
                </button>
                <button
                  onClick={() => loadPresetAngle(180)}
                  className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold text-center"
                >
                  🟣 180° Doğru Açı
                </button>
              </div>
            </div>

            {/* 3. Angle Mission Challenges */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-400">
                  <Target className="w-4 h-4" />
                  <span>Hedef Açı Görevleri</span>
                </div>
                <span className="text-[11px] text-indigo-200">
                  {Object.values(missionDone).filter(Boolean).length} / 4 Başarıldı
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { deg: 90, label: '90° Dik Açı' },
                  { deg: 45, label: '45° Dar Açı' },
                  { deg: 135, label: '135° Geniş Açı' },
                  { deg: 180, label: '180° Doğru Açı' }
                ].map((m) => (
                  <button
                    key={m.deg}
                    onClick={() => {
                      setActiveMission(m.deg);
                      playSound('select');
                    }}
                    className={`p-2 rounded-xl text-xs font-bold text-left flex items-center justify-between border transition-all ${
                      activeMission === m.deg
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-md'
                        : missionDone[m.deg]
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-white/10 border-white/15 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    <span>{m.label}</span>
                    {missionDone[m.deg] ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Target className="w-3 h-3 opacity-60" />}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: The Geometry Board */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="relative bg-white rounded-3xl border-2 border-slate-200 shadow-inner overflow-hidden min-h-[520px] flex flex-col justify-between">
              
              {/* Status & Feedback Bar */}
              <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs font-medium z-10 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                  <span>{feedbackMsg}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  {angles.length > 0 && (
                    <span className="font-black text-amber-300 bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                      Aktif Açı: {angles[0].degree}°
                    </span>
                  )}
                  <span>Noktalar: {points.length}</span>
                </div>
              </div>

              {/* Misconception Notice Banner */}
              {armScaleNotice && (
                <div className="bg-amber-500 text-slate-950 px-5 py-2 text-xs font-black flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>{armScaleNotice}</span>
                </div>
              )}

              {/* SVG Interactive Canvas */}
              <svg
                ref={svgRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="w-full h-[460px] cursor-crosshair select-none touch-none bg-white"
              >
                <defs>
                  <pattern id="lab-canvas-grid-angle" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                    <path
                      d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                      strokeOpacity="0.55"
                    />
                    <circle cx="0" cy="0" r="1.5" fill="#94a3b8" fillOpacity="0.75" />
                  </pattern>
                </defs>

                {/* Grid Background Pattern */}
                {showGrid && (
                  <rect width="100%" height="100%" fill="url(#lab-canvas-grid-angle)" pointerEvents="none" />
                )}

                {/* Empty State Hint */}
                {points.length === 0 && (
                  <g className="pointer-events-none">
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="14"
                      fontWeight="bold"
                    >
                      ✨ Tahtaya tıklayarak 1. Köşe (O) ve ışın kollarını (A, B) oluşturunuz.
                    </text>
                  </g>
                )}

                {/* Virtual Protractor Overlay */}
                {angles.map((ang) => renderProtractorOverlay(ang))}

                {/* Live connecting preview line */}
                {(selectedPointForLink || angleStepPoint1) && hoverPos && (
                  <line
                    x1={(selectedPointForLink || angleStepPoint1)!.x}
                    y1={(selectedPointForLink || angleStepPoint1)!.y}
                    x2={hoverPos.x}
                    y2={hoverPos.y}
                    stroke={activeColor}
                    strokeWidth="3"
                    strokeDasharray="6,4"
                    className="animate-pulse"
                  />
                )}

                {/* Geometric Objects (Rays) */}
                {objects.map((obj) => {
                  if (obj.type !== 'ray' || !obj.p2) return null;
                  const p1 = points.find((p) => p.id === obj.p1.id) || obj.p1;
                  const p2 = points.find((p) => p.id === obj.p2!.id) || obj.p2;
                  if (!p2) return null;
                  const { color, id } = obj;
                  const dx = p2.x - p1.x;
                  const dy = p2.y - p1.y;
                  const len = Math.sqrt(dx * dx + dy * dy) || 1;
                  const angle = Math.atan2(dy, dx);
                    const baseExtend = Math.max(len + 40, 80);
                    const extendLen = baseExtend * armScaleMultiplier;
                    const extX = p1.x + (dx / len) * extendLen;
                    const extY = p1.y + (dy / len) * extendLen;

                    const arrowLen = 14;
                    const arrowWidth = 7;
                    const tipX = extX;
                    const tipY = extY;
                    const leftX = tipX - arrowLen * Math.cos(angle) - arrowWidth * Math.sin(angle);
                    const leftY = tipY - arrowLen * Math.sin(angle) + arrowWidth * Math.cos(angle);
                    const rightX = tipX - arrowLen * Math.cos(angle) + arrowWidth * Math.sin(angle);
                    const rightY = tipY - arrowLen * Math.sin(angle) - arrowWidth * Math.cos(angle);

                    return (
                      <g key={id}>
                        <line
                          x1={p1.x}
                          y1={p1.y}
                          x2={extX}
                          y2={extY}
                          stroke={color}
                          strokeWidth="4.5"
                          strokeLinecap="round"
                        />
                        <polygon points={`${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`} fill={color} />
                        <circle cx={p1.x} cy={p1.y} r="6" fill={color} stroke="#ffffff" strokeWidth="2" />
                      </g>
                    );
                })}

                {/* Render Angles & Live Arc Labels */}
                {angles.map((ang) => renderAngleVisual(ang))}

                {/* Render Points on Top (with dragging handles) */}
                {points.map((pt) => {
                  const isVertex = angles.some((a) => a.vertex.id === pt.id) || angleStepPoint1?.id === pt.id;
                  const isDragging = draggingPointId === pt.id;

                  return (
                    <g
                      key={pt.id}
                      className="cursor-grab active:cursor-grabbing select-none"
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        try {
                          (e.currentTarget as SVGElement)?.setPointerCapture?.(e.pointerId);
                        } catch {}
                        setDraggingPointId(pt.id);
                        playSound('click');
                      }}
                      onPointerUp={(e) => {
                        e.stopPropagation();
                        try {
                          (e.currentTarget as SVGElement)?.releasePointerCapture?.(e.pointerId);
                        } catch {}
                        setDraggingPointId(null);
                      }}
                    >
                      {/* Pulse ring for active vertex */}
                      {isVertex && (
                        <circle cx={pt.x} cy={pt.y} r="16" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
                      )}

                      {/* Dragging glow halo */}
                      {isDragging && (
                        <circle cx={pt.x} cy={pt.y} r="15" fill={pt.color} fillOpacity="0.25" stroke={pt.color} strokeWidth="2" strokeDasharray="3,3" />
                      )}

                      {/* Invisible Large Hit Target (40px) for Touch / Smart Board */}
                      <circle cx={pt.x} cy={pt.y} r="20" fill="transparent" />

                      {/* Point Circle (Completely stable, NO CSS transform/scale jumping) */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isVertex ? 9 : 7.5}
                        fill={isVertex ? '#f59e0b' : pt.color}
                        stroke="#ffffff"
                        strokeWidth={isDragging ? '3.5' : '2.5'}
                      />

                      {/* Point Label */}
                      {!pt.hideLabel && (
                        <text
                          x={pt.x}
                          y={pt.y - 13}
                          textAnchor="middle"
                          fill="#0f172a"
                          fontSize="13"
                          fontWeight="900"
                          className="pointer-events-none select-none drop-shadow-xs"
                        >
                          {pt.label}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Three-Point Angle Creation Visual Overlay for Angle Topic */}
                {activeTool === 'three-point-angle' && threePointAnglePoints.length > 0 && (
                  <g className="pointer-events-none">
                    {/* Point 1 (Arm 1) indicator */}
                    {threePointAnglePoints[0] && (
                      <g transform={`translate(${threePointAnglePoints[0].x}, ${threePointAnglePoints[0].y})`}>
                        <circle cx="0" cy="0" r="18" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="4,3" className="animate-spin" />
                        <circle cx="0" cy="0" r="6" fill="#0284c7" />
                        <g transform="translate(0, -26)">
                          <rect x="-44" y="-11" width="88" height="20" rx="6" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
                          <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
                            1. Kol ({threePointAnglePoints[0].label})
                          </text>
                        </g>
                      </g>
                    )}

                    {/* Stretch Line from Arm 1 to Cursor if selecting vertex */}
                    {threePointAnglePoints.length === 1 && hoverPos && (
                      <line
                        x1={threePointAnglePoints[0].x}
                        y1={threePointAnglePoints[0].y}
                        x2={hoverPos.x}
                        y2={hoverPos.y}
                        stroke="#0284c7"
                        strokeWidth="2.5"
                        strokeDasharray="4,4"
                        className="animate-pulse"
                      />
                    )}

                    {/* Point 2 (Vertex) indicator */}
                    {threePointAnglePoints[1] && (
                      <g transform={`translate(${threePointAnglePoints[1].x}, ${threePointAnglePoints[1].y})`}>
                        <circle cx="0" cy="0" r="22" fill="none" stroke="#f59e0b" strokeWidth="3" className="animate-pulse" />
                        <circle cx="0" cy="0" r="7" fill="#f59e0b" />
                        <g transform="translate(0, -28)">
                          <rect x="-44" y="-11" width="88" height="20" rx="6" fill="#b45309" stroke="#fbbf24" strokeWidth="1" />
                          <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="black">
                            Köşe 📍 ({threePointAnglePoints[1].label})
                          </text>
                        </g>
                      </g>
                    )}

                    {/* Stretch Line from Vertex to Cursor if selecting arm 2 */}
                    {threePointAnglePoints.length === 2 && hoverPos && (
                      <>
                        <line
                          x1={threePointAnglePoints[1].x}
                          y1={threePointAnglePoints[1].y}
                          x2={hoverPos.x}
                          y2={hoverPos.y}
                          stroke="#10b396"
                          strokeWidth="2.5"
                          strokeDasharray="4,4"
                          className="animate-pulse"
                        />
                        {(() => {
                          const v = threePointAnglePoints[1];
                          const p1 = threePointAnglePoints[0];
                          const liveDeg = getAngleDegree(v, p1, hoverPos);
                          const typeInfo = getAngleType(liveDeg);
                          return (
                            <g transform={`translate(${hoverPos.x + 18}, ${hoverPos.y - 18})`}>
                              <rect x="-6" y="-14" width="84" height="24" rx="7" fill="#0f172a" stroke={typeInfo.color} strokeWidth="1.5" className="shadow-lg" />
                              <text x="36" y="2" textAnchor="middle" fill={typeInfo.color} fontSize="11" fontWeight="900">
                                ~{liveDeg}°
                              </text>
                            </g>
                          );
                        })()}
                      </>
                    )}
                  </g>
                )}

                {/* İnteraktif İletki & Gönye Araçları */}
                {renderInteractiveProtractor()}
                {renderInteractiveSetSquare()}
              </svg>

              {/* Angle Naming & Hat Symbol Verification Card */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-t border-slate-700 p-5 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* Title & Guidance */}
                  <div className="space-y-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase">
                        Açı İsimlendirme & Şapka Kontrolü
                      </span>
                      {angles.length > 0 && (
                        <span className="text-xs text-slate-300">
                          (Örn: <strong className="text-amber-300 font-mono">{angles[0].p1.label}{angles[0].vertex.label}{angles[0].p2.label}</strong> veya <strong className="text-amber-300 font-mono">{angles[0].vertex.label}</strong>)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 max-w-md">
                      Yukarıda oluşturulan açının adını yazıp kontrol edin. Köşe noktası daima ortada yer almalıdır.
                    </p>
                  </div>

                  {/* Input Box with Centered Angle Hat */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center">
                      {/* Angle Hat (Açı Şapkası) centered directly above text box */}
                      <div className="text-amber-400 -mb-1 flex items-center justify-center pointer-events-none select-none">
                        <svg
                          className="w-10 h-3.5 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse"
                          viewBox="0 0 40 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M 6 11 L 20 3 L 34 11"
                            stroke="#fbbf24"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* Text Input */}
                      <input
                        type="text"
                        value={angleNameInput}
                        onChange={(e) => {
                          setAngleNameInput(e.target.value.toUpperCase());
                          setAngleNameStatus('idle');
                          setAngleNameFeedback(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCheckAngleName();
                        }}
                        placeholder={angles.length > 0 ? `${angles[0].p1.label}${angles[0].vertex.label}${angles[0].p2.label}` : 'AOB'}
                        maxLength={6}
                        disabled={angles.length === 0}
                        className={`w-36 h-11 text-center font-mono font-black text-lg tracking-widest uppercase rounded-xl border-2 transition-all outline-none ${
                          angleNameStatus === 'correct'
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50'
                            : angleNameStatus === 'wrong'
                            ? 'bg-rose-950/80 border-rose-400 text-rose-200 ring-2 ring-rose-400/50'
                            : 'bg-slate-900 border-slate-600 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30'
                        }`}
                      />
                    </div>

                    {/* Kontrol Et Button */}
                    <button
                      onClick={handleCheckAngleName}
                      disabled={angles.length === 0 || !angleNameInput.trim()}
                      className="h-11 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center gap-1.5 active:scale-95 self-end"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Kontrol Et</span>
                    </button>
                  </div>
                </div>

                {/* Feedback Notification Box */}
                {angleNameFeedback && (
                  <div
                    className={`mt-4 p-3.5 rounded-2xl border text-xs flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
                      angleNameStatus === 'correct'
                        ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-100'
                        : 'bg-rose-950/70 border-rose-500/60 text-rose-100'
                    }`}
                  >
                    {angleNameStatus === 'correct' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="font-bold leading-relaxed">{angleNameFeedback}</div>
                      {angleNameStatus === 'correct' && angles.length > 0 && (
                        <div className="text-[11px] text-emerald-300 font-mono">
                          Sembolik Gösterim: <span className="underline font-bold">s(∠{angles[0].p1.label}{angles[0].vertex.label}{angles[0].p2.label})</span> veya <span className="underline font-bold">s(∠{angles[0].vertex.label})</span> = {angles[0].degree}°
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Inspection Bar */}
              <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-extrabold text-slate-700">Geometrik Temsil:</span>
                  {angles.length > 0 ? (
                    <span className="px-3 py-1 rounded-xl bg-white border border-slate-300 font-black text-slate-900 shadow-xs flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: angles[0].color }} />
                      <span>{angles[0].label}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Tahtada henüz açı oluşturulmadı</span>
                  )}
                </div>

                <button
                  onClick={() => {
                    playSound('select');
                    onNextPhase();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <span>3. Aşamaya Geç: Oyun Zamanı</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // 3. OUTCOME: MAT.5.3.1 (GEOMETRIC DRAWING LAB)
  // ==========================================
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Shapes className="w-3.5 h-3.5 text-teal-600" />
            <span>2. Aşama: Temel Geometrik Çizim Laboratuvarı</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">{data.title}</h2>
          <p className="text-xs text-slate-500 mt-1">
            Nokta, Doğru, Doğru Parçası ve Işın modellerini inşa edin, sembolik temsillerini ve uzunluklarını canlı inceleyin.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <MascotLabHelper
            toolName={data.title}
            hint="Pergel ve cetvel ile çizim yaparken uç noktaları hassas birleştirin. Her doğru parçasının iki ucu sınırlıdır!"
          />
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              showGrid ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            Izgara: {showGrid ? 'Açık 🔲' : 'Kapalı'}
          </button>
          {/* Magnetic Grid Snapping Toggle (Yazısız, Sadece İkon) */}
          <button
            onClick={() => {
              const nextVal = !isSnapToGrid;
              setIsSnapToGrid(nextVal);
              playSound('click');
              setFeedbackMsg(nextVal ? '🧲 Mıknatıs Açıldı (Izgara Çizgilerine Yapışma Aktif).' : '🧲 Mıknatıs Kapatıldı (Serbest Çizim Aktif).');
            }}
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
              isSnapToGrid
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-sm ring-2 ring-amber-200 scale-102'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-400 border-slate-300'
            }`}
            title={isSnapToGrid ? 'Mıknatıs Açık (Kapatmak için tıklayın)' : 'Mıknatıs Kapalı (Açmak için tıklayın)'}
            aria-label="Mıknatıs Aç/Kapa"
          >
            <Magnet className="w-4 h-4" />
          </button>
          {/* Polygon Draft Actions if in progress */}
          {polygonDraft.length >= 3 && (
            <button
              onClick={closePolygonDraft}
              className="px-3.5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 animate-pulse"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Çokgeni Kapat ⬡ ({polygonDraft.length} Köşe)</span>
            </button>
          )}
          {polygonDraft.length > 0 && (
            <button
              onClick={() => {
                setPolygonDraft([]);
                playSound('clear');
                setFeedbackMsg('Çokgen çizimi iptal edildi.');
              }}
              className="px-2.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
            >
              İptal ❌
            </button>
          )}
        </div>
      </div>

      {/* Geometry Station Flow Selector for MAT.5.3.1 */}
      <GeometryFlowSelector
        activeStation={activeStation}
        onSelectStation={(st) => {
          setActiveStation(st);
          playSound('click');
          if (st === 'lines') {
            setActiveTool('segment');
            setActiveToolCategory('lines');
            setFeedbackMsg('1. İstasyon: Çizgeç ile iki nokta arasında aynı hizada noktaları bağlayarak Doğru Parçası [AB], Işın veya Doğru inşa ediniz.');
          } else if (st === 'angle') {
            setActiveTool('angle');
            setActiveToolCategory('angle');
            setFeedbackMsg('2. İstasyon: Başlangıç noktası ortak iki ışınla Dinamik Açı (∠ABC) oluşturunuz veya Açı Ölç aracı ile ölçüm yapınız.');
          } else if (st === 'compass') {
            setActiveTool('compass');
            setActiveToolCategory('shapes');
            setFeedbackMsg('3. İstasyon: Pergel aracı ile merkez (M) ve yarıçap (r) belirleyerek Çember ve Eş Çemberler çiziniz.');
          } else if (st === 'perpendicular') {
            setActiveTool('setsquare');
            setIsSetSquareOnCanvas(true);
            setActiveToolCategory('lines');
            // If no lines on canvas, provide baseline d and point P so the set square immediately snaps to it
            if (!objects.some((o) => o.type === 'line' || o.type === 'segment')) {
              const pD1: GeoPoint = { id: 'pt-d1', label: 'E', x: 80, y: 320, color: '#38bdf8' };
              const pD2: GeoPoint = { id: 'pt-d2', label: 'F', x: 560, y: 320, color: '#38bdf8' };
              const pTop: GeoPoint = { id: 'pt-P', label: 'P', x: 300, y: 170, color: '#f43f5e' };
              setPoints((prev) => [...prev.filter((p) => p.id !== 'pt-d1' && p.id !== 'pt-d2' && p.id !== 'pt-P'), pD1, pD2, pTop]);
              const dLine: GeoObject = {
                id: 'line-d-base',
                type: 'line',
                p1: pD1,
                p2: pD2,
                symbol: 'd Doğrusu',
                label: 'Kıyı d Doğrusu',
                color: '#38bdf8'
              };
              setObjects((prev) => [...prev.filter((o) => o.id !== 'line-d-base'), dLine]);
              setSetSquareOrigin({ x: 300, y: 320 });
              setSetSquareRotation(0);
              setSnappedLineInfo({ lineId: 'line-d-base', lineSymbol: 'd Doğrusu', footPt: { x: 300, y: 320 } });
            }
            setFeedbackMsg('4. İstasyon: İnteraktif Gönye tuvalde! Doğruya yapışan gönyenin mıknatıslı ucundan (P) 90° dikme indiriniz.');
          } else if (st === 'art') {
            setActiveTool('artmotif');
            setActiveToolCategory('special');
            setFeedbackMsg('5. İstasyon: Görsel Sanatlar entegrasyonu [D7.1] ile Selçuklu çinisi ve logo tasarımınızı tahtaya yerleştiriniz.');
          }
        }}
        completedStations={{
          lines: geoMissionsDone.point && geoMissionsDone.segment,
          angle: geoMissionsDone.angle,
          compass: geoMissionsDone.circle,
          perpendicular: geoMissionsDone.perpendicular,
          art: geoMissionsDone.art
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT TOOLBAR */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Main Geometry Tools (Profesyonel Geometrik Dijital Araç Çubuğu) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            {/* Toolbar Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-teal-600" />
                  <span>Geometrik Araç Çubuğu</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Profesyonel dijital çizim & ölçüm menüleri</p>
              </div>
            </div>

            {/* Category Menus Ribbon (Menü Seçici Sekmeler) */}
            <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
              <button
                onClick={() => {
                  setActiveToolCategory('lines');
                  playSound('click');
                }}
                className={`py-1.5 px-1.5 rounded-xl text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 ${
                  activeToolCategory === 'lines'
                    ? 'bg-white text-sky-900 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📏</span>
                <span>Çizgiler</span>
              </button>

              <button
                onClick={() => {
                  setActiveToolCategory('angle');
                  playSound('click');
                }}
                className={`py-1.5 px-1.5 rounded-xl text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 relative ${
                  activeToolCategory === 'angle'
                    ? 'bg-white text-blue-900 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📐</span>
                <span>Açı</span>
              </button>

              <button
                onClick={() => {
                  setActiveToolCategory('basic');
                  playSound('click');
                }}
                className={`py-1.5 px-1.5 rounded-xl text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 ${
                  activeToolCategory === 'basic'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📍</span>
                <span>Temel</span>
              </button>

              <button
                onClick={() => {
                  setActiveToolCategory('shapes');
                  playSound('click');
                }}
                className={`py-1.5 px-1.5 rounded-xl text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 ${
                  activeToolCategory === 'shapes'
                    ? 'bg-white text-emerald-900 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>⬡</span>
                <span>Çokgen</span>
              </button>

              <button
                onClick={() => {
                  setActiveToolCategory('motifs');
                  playSound('click');
                }}
                className={`py-1.5 px-1.5 rounded-xl text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 ${
                  activeToolCategory === 'motifs'
                    ? 'bg-white text-amber-900 shadow-xs font-black ring-1 ring-amber-400/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🏛️</span>
                <span>Motifler</span>
              </button>

              <button
                onClick={() => {
                  setActiveToolCategory('special');
                  playSound('click');
                }}
                className={`py-1.5 px-1.5 rounded-xl text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 ${
                  activeToolCategory === 'special'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🎨</span>
                <span>Özel</span>
              </button>

              <button
                onClick={() => {
                  setActiveToolCategory('all');
                  playSound('click');
                }}
                className={`col-span-2 py-1.5 px-2 rounded-xl text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 ${
                  activeToolCategory === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🌐</span>
                <span>Tüm Araçlar</span>
              </button>
            </div>

            {/* TOOL SECTIONS */}
            <div className="space-y-4">
              {/* 1. ÇİZGİLER MENÜSÜ */}
              {(activeToolCategory === 'lines' || activeToolCategory === 'all') && (
                <div className="space-y-2 p-3 rounded-2xl bg-sky-50/50 border border-sky-100">
                  <div className="flex items-center justify-between text-[11px] font-black text-sky-800 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Minus className="w-3.5 h-3.5 text-sky-600 stroke-[3]" />
                      <span>📏 Çizgiler &amp; Uzunluk Ölçümü</span>
                    </span>
                    <span className="text-[10px] text-sky-600 font-semibold bg-white px-2 py-0.5 rounded-full border border-sky-200">
                      5 Araç
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Doğru Parçası */}
                    <button
                      onClick={() => {
                        setActiveTool('segment');
                        setSelectedPointForLink(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('📏 Doğru Parçası [AB]: İki noktayı bağlayan boyu ölçülebilir çizgi oluşturunuz.');
                      }}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTool === 'segment'
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm scale-102'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Minus className="w-4 h-4 stroke-[3]" />
                        <span className="text-xs font-bold">Parça [AB]</span>
                      </div>
                      <span className="text-[10px] font-normal opacity-85">İki nokta arası</span>
                    </button>

                    {/* Gönye (Dik Üçgen Cetveli) */}
                    <button
                      onClick={() => {
                        setIsSetSquareOnCanvas(true);
                        setActiveTool('setsquare');
                        setSelectedPointForLink(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('📐 İnteraktif Gönye tuvale bırakıldı! Cetveli çizgilere yaklaştırarak yapıştırabilir, mıknatıslı ucundan 90° dikme indirebilirsiniz.');
                      }}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all relative cursor-pointer ${
                        isSetSquareOnCanvas || activeTool === 'setsquare'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30 scale-102 ring-2 ring-emerald-300'
                          : 'bg-white border-emerald-300 text-emerald-950 hover:bg-emerald-50 hover:border-emerald-400'
                      }`}
                    >
                      <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 bg-emerald-500 text-white font-black text-[9px] rounded-full uppercase shadow-xs">
                        90° ⊥
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="font-black text-sm leading-none">📐</span>
                        <span className="text-xs font-extrabold">Gönye (Dikme)</span>
                      </div>
                      <span className="text-[10px] font-normal opacity-90">
                        {isSetSquareOnCanvas ? 'Tuvalde (Açık)' : '90° Dik Üçgen Cetveli'}
                      </span>
                    </button>

                    {/* Işın */}
                    <button
                      onClick={() => {
                        setActiveTool('ray');
                        setSelectedPointForLink(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('🔦 Işın [CD>: 1. Tıklanan nokta başlangıçtır [C], 2. nokta yönü belirler.');
                      }}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTool === 'ray'
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm scale-102'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        <span className="text-xs font-bold">Işın [CD&gt;</span>
                      </div>
                      <span className="text-[10px] font-normal opacity-85">Tek yön sonsuz</span>
                    </button>

                    {/* Doğru */}
                    <button
                      onClick={() => {
                        setActiveTool('line');
                        setSelectedPointForLink(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('↔️ Doğru EF (d): İki yönden de sonsuza uzayan çift oklu çizgi çiziniz.');
                      }}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTool === 'line'
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm scale-102'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="font-black text-xs leading-none">&lt;—&gt;</span>
                        <span className="text-xs font-bold">Doğru EF</span>
                      </div>
                      <span className="text-[10px] font-normal opacity-85">İki yön sonsuz</span>
                    </button>

                    {/* Uzunluk Ölç (Col span 2) */}
                    <button
                      onClick={() => {
                        setActiveTool('measure-length');
                        setSelectedPointForLink(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('📏 UZUNLUK ÖLÇ: Tahtadaki 2 noktayı seçin, aralarındaki mesafeyi |AB| = ... cm olarak gösterin.');
                      }}
                      className={`col-span-2 p-2.5 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-2 transition-all relative cursor-pointer ${
                        activeTool === 'measure-length'
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/20 scale-101'
                          : 'bg-white border-cyan-200 text-cyan-900 hover:bg-cyan-50'
                      }`}
                    >
                      <Ruler className="w-4 h-4" />
                      <span className="text-xs font-extrabold">Uzunluk Ölç (|AB| = cm göster)</span>
                    </button>
                  </div>


                  {/* Uzunluk Ölçüm Adım Rehberi */}
                  {activeTool === 'measure-length' && (
                    <div className="p-3 rounded-2xl bg-white border border-cyan-200 text-cyan-950 space-y-2 text-xs shadow-xs animate-in fade-in duration-200">
                      <div className="flex items-center justify-between font-black text-cyan-900">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                          Uzunluk Ölçüm Adımları ({measureLengthPoints.length}/2)
                        </span>
                        {measureLengthPoints.length > 0 && (
                          <button
                            onClick={() => {
                              setMeasureLengthPoints([]);
                              setHoverPos(null);
                              setFeedbackMsg('Uzunluk seçimi sıfırlandı. 1. Noktayı seçiniz.');
                            }}
                            className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
                          >
                            Sıfırla
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[10.5px] font-bold text-center">
                        <div className={`p-1.5 rounded-xl border ${measureLengthPoints.length >= 1 ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                          <div>1. Nokta</div>
                          <div className="text-[9.5px] font-normal">{measureLengthPoints[0] ? `✓ ${measureLengthPoints[0].label}` : 'Seçiniz'}</div>
                        </div>
                        <div className={`p-1.5 rounded-xl border ${measureLengthPoints.length === 1 ? 'bg-cyan-100 border-cyan-400 text-cyan-900 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                          <div>2. Nokta</div>
                          <div className="text-[9.5px] font-normal">{measureLengthPoints.length === 1 ? 'Tıklayın!' : 'Bekleniyor'}</div>
                        </div>
                      </div>
                      <p className="text-[10.5px] text-cyan-800 leading-tight">
                        💡 {measureLengthPoints.length === 0 ? 'Tahtadaki bir noktaya tıklayın veya yeni nokta belirleyin (1. Nokta).' : 'Şimdi uzunluğu ölçülecek 2. noktayı seçiniz.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 2. AÇI MENÜSÜ */}
              {(activeToolCategory === 'angle' || activeToolCategory === 'all') && (
                <div className="space-y-2 p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <div className="flex items-center justify-between text-[11px] font-black text-blue-800 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>📐 Açı Menüsü (Çiz &amp; Ölç)</span>
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold bg-white px-2 py-0.5 rounded-full border border-blue-200">
                      4 Araç
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* 3 Noktadan Açı Oluştur */}
                    <button
                      onClick={() => {
                        setActiveTool('three-point-angle');
                        setSelectedPointForLink(null);
                        setAngleStepPoint1(null);
                        setAngleStepPoint2(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('📐 3 NOKTADAN AÇI OLUŞTUR: Tahtada sırasıyla 1. Kol noktasını, 2. KÖŞE (Tepe) noktasını ve 3. İkinci Kol noktasını seçerek açıyı ve kollarını oluşturun.');
                      }}
                      className={`p-2.5 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all relative cursor-pointer ${
                        activeTool === 'three-point-angle'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20 scale-102 ring-2 ring-blue-300'
                          : 'bg-white border-blue-200 text-blue-900 hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 bg-blue-600 text-white font-black text-[9px] rounded-full uppercase shadow-xs">
                        Yeni
                      </span>
                      <div className="flex items-center gap-1">
                        <Shapes className="w-4 h-4" />
                        <span className="font-extrabold text-xs">3 Noktadan Açı</span>
                      </div>
                      <span className="text-[9.5px] font-normal opacity-85 text-center line-clamp-1">
                        A-Köşe-B ile oluştur
                      </span>
                    </button>

                    {/* Açı Çiz */}
                    <button
                      onClick={() => {
                        setActiveTool('angle');
                        setSelectedPointForLink(null);
                        setAngleStepPoint1(null);
                        setAngleStepPoint2(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('📐 AÇI ÇİZ: Tahtaya tıklayarak 1. Köşe (O), 2. Taban kolu (A) ve 3. Dönen kolu (B) belirleyip açı oluşturun.');
                      }}
                      className={`p-2.5 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTool === 'angle'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20 scale-102'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Maximize2 className="w-4 h-4" />
                        <span className="font-extrabold text-xs">Açı Çiz</span>
                      </div>
                      <span className="text-[9.5px] font-normal opacity-85 text-center line-clamp-1">
                        Köşe &amp; kol
                      </span>
                    </button>

                    {/* Açı Ölç */}
                    <button
                      onClick={() => {
                        setActiveTool('measure-angle');
                        setSelectedPointForLink(null);
                        setAngleStepPoint1(null);
                        setAngleStepPoint2(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('📏 AÇI ÖLÇ: Tahtadaki 3 noktayı sırayla seçin: 1. Kol noktası, 2. Köşe (Tepe) noktası, 3. İkinci Kol noktası.');
                      }}
                      className={`p-2.5 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all relative cursor-pointer ${
                        activeTool === 'measure-angle'
                          ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-102'
                          : 'bg-white border-teal-200 text-teal-800 hover:bg-teal-50 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Ruler className="w-4 h-4" />
                        <span className="font-extrabold text-xs">Açı Ölç</span>
                      </div>
                      <span className="text-[9.5px] font-normal opacity-85 text-center line-clamp-1">
                        3 nokta ile ölç
                      </span>
                    </button>

                    {/* İletki (Açıölçer) */}
                    <button
                      onClick={() => {
                        if (!isProtractorOnCanvas) {
                          setIsProtractorOnCanvas(true);
                          setActiveTool('drag');
                          setSelectedPointForLink(null);
                          setMeasureAnglePoints([]);
                          setMeasureLengthPoints([]);
                          setThreePointAnglePoints([]);
                          if (protractorCenter.y > 380 || protractorCenter.x < 80) {
                            setProtractorCenter({ x: 380, y: 240 });
                          }
                          playSound('click');
                          setFeedbackMsg('📐 İletki tuvale yerleştirildi. Taşıma aracı aktif: Turuncu merkezden taşıyabilir, mavi tutamaktan döndürebilirsiniz.');
                        } else {
                          // Already on canvas: toggle between drag tool and point tool
                          if (activeTool === 'drag') {
                            setActiveTool('point');
                            playSound('click');
                            setFeedbackMsg('📍 Nokta aracı seçildi. İletki tuvalde kalmaya devam ediyor.');
                          } else {
                            setActiveTool('drag');
                            playSound('click');
                            setFeedbackMsg('🖐️ Taşıma aracı aktif: İletkiyi turuncu merkezden taşıyabilir, mavi tutamaktan döndürebilirsiniz.');
                          }
                        }
                      }}
                      className={`p-2.5 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all relative cursor-pointer ${
                        isProtractorOnCanvas
                          ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30 scale-102 ring-2 ring-amber-300'
                          : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-50 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Compass className="w-4 h-4 text-current" />
                        <span className="font-extrabold text-xs">İletki</span>
                      </div>
                      <span className="text-[9.5px] font-normal opacity-85 text-center line-clamp-1">
                        {isProtractorOnCanvas ? 'Tuvalde (Açık)' : 'Açıölçer aracı'}
                      </span>
                    </button>
                  </div>

                  {/* 3 Noktadan Açı Oluşturma Adım Rehberi */}
                  {activeTool === 'three-point-angle' && (
                    <div className="p-3 rounded-2xl bg-white border border-blue-200 text-blue-950 space-y-2 text-xs shadow-xs animate-in fade-in duration-200">
                      <div className="flex items-center justify-between font-black text-blue-900">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                          3 Noktadan Açı Oluşturma ({threePointAnglePoints.length}/3)
                        </span>
                        {threePointAnglePoints.length > 0 && (
                          <button
                            onClick={() => {
                              setThreePointAnglePoints([]);
                              setHoverPos(null);
                              setFeedbackMsg('Açı oluşturma adımları sıfırlandı. 1. Kol noktasını seçiniz.');
                            }}
                            className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
                          >
                            Sıfırla
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-[10.5px] font-bold text-center">
                        <div className={`p-1.5 rounded-xl border ${threePointAnglePoints.length >= 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                          <div>1. Kol (A)</div>
                          <div className="text-[9.5px] font-normal">{threePointAnglePoints[0] ? `✓ ${threePointAnglePoints[0].label}` : 'Seçiniz'}</div>
                        </div>
                        <div className={`p-1.5 rounded-xl border ${threePointAnglePoints.length >= 2 ? 'bg-amber-500 text-white border-amber-500' : threePointAnglePoints.length === 1 ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                          <div>Köşe 📍 (B)</div>
                          <div className="text-[9.5px] font-normal">{threePointAnglePoints[1] ? `✓ ${threePointAnglePoints[1].label}` : threePointAnglePoints.length === 1 ? 'Tıklayın!' : 'Bekleniyor'}</div>
                        </div>
                        <div className={`p-1.5 rounded-xl border ${threePointAnglePoints.length === 3 ? 'bg-emerald-600 text-white border-emerald-600' : threePointAnglePoints.length === 2 ? 'bg-emerald-100 border-emerald-400 text-emerald-900 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                          <div>2. Kol (C)</div>
                          <div className="text-[9.5px] font-normal">{threePointAnglePoints[2] ? `✓ ${threePointAnglePoints[2].label}` : threePointAnglePoints.length === 2 ? 'Tıklayın!' : 'Bekleniyor'}</div>
                        </div>
                      </div>
                      <p className="text-[10.5px] text-blue-800 leading-tight">
                        💡 {threePointAnglePoints.length === 0 ? 'Tahtadaki bir noktaya tıklayın veya yeni nokta oluşturun (1. Kol).' : threePointAnglePoints.length === 1 ? 'Şimdi açının KÖŞE (Tepe) noktasını belirleyin.' : 'Son olarak 2. Kol noktasını seçerek açıyı ve kollarını oluşturun!'}
                      </p>
                    </div>
                  )}

                  {/* Açı Ölçüm Adım Rehberi */}
                  {activeTool === 'measure-angle' && (
                    <div className="p-3 rounded-2xl bg-white border border-teal-200 text-teal-950 space-y-2 text-xs shadow-xs animate-in fade-in duration-200">
                      <div className="flex items-center justify-between font-black text-teal-900">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                          Açı Ölçüm Adımları ({measureAnglePoints.length}/3)
                        </span>
                        {measureAnglePoints.length > 0 && (
                          <button
                            onClick={() => {
                              setMeasureAnglePoints([]);
                              setHoverPos(null);
                              setFeedbackMsg('Açı seçimi sıfırlandı. 1. Kol noktasını seçiniz.');
                            }}
                            className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
                          >
                            Sıfırla
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-[10.5px] font-bold text-center">
                        <div className={`p-1.5 rounded-xl border ${measureAnglePoints.length >= 1 ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                          <div>1. Kol</div>
                          <div className="text-[9.5px] font-normal">{measureAnglePoints[0] ? `✓ ${measureAnglePoints[0].label}` : 'Seçiniz'}</div>
                        </div>
                        <div className={`p-1.5 rounded-xl border ${measureAnglePoints.length >= 2 ? 'bg-blue-600 text-white border-blue-600' : measureAnglePoints.length === 1 ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                          <div>Köşe (O)</div>
                          <div className="text-[9.5px] font-normal">{measureAnglePoints[1] ? `✓ ${measureAnglePoints[1].label}` : measureAnglePoints.length === 1 ? 'Tıklayın!' : 'Bekleniyor'}</div>
                        </div>
                        <div className={`p-1.5 rounded-xl border ${measureAnglePoints.length === 3 ? 'bg-teal-600 text-white border-teal-600' : measureAnglePoints.length === 2 ? 'bg-teal-100 border-teal-400 text-teal-900 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                          <div>2. Kol</div>
                          <div className="text-[9.5px] font-normal">{measureAnglePoints[2] ? `✓ ${measureAnglePoints[2].label}` : measureAnglePoints.length === 2 ? 'Tıklayın!' : 'Bekleniyor'}</div>
                        </div>
                      </div>
                      <p className="text-[10.5px] text-teal-800 leading-tight">
                        💡 {measureAnglePoints.length === 0 ? 'Tahtadaki bir noktaya tıklayın veya yeni nokta belirleyin (1. Kol).' : measureAnglePoints.length === 1 ? 'Şimdi açının KÖŞE (Tepe) noktasını seçiniz.' : 'Son olarak 2. Kol noktasını seçerek açıyı ölçün!'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 3. TEMEL MENÜ (Nokta, Taşı & Silgi) */}
              {(activeToolCategory === 'basic' || activeToolCategory === 'all') && (
                <div className="space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Dot className="w-4 h-4 text-teal-600" />
                      <span>📍 Temel Araçlar (Nokta, Taşı & Silgi)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      3 Araç
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {/* Taşı / Düzenle */}
                    <button
                      onClick={() => {
                        setActiveTool('drag');
                        setSelectedPointForLink(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('🖐️ Taşıma Aracı: Tahtadaki noktaları sürükleyerek şekilleri dinamik boyutlandırın.');
                      }}
                      className={`p-2 rounded-xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTool === 'drag'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-102'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Move className="w-4 h-4" />
                      <span className="text-[11px]">Taşı</span>
                    </button>

                    {/* Nokta Ekle */}
                    <button
                      onClick={() => {
                        setActiveTool('point');
                        setSelectedPointForLink(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('📍 Nokta Aracı: Tahtaya tıklayarak isimlendirilmiş noktalar yerleştiriniz.');
                      }}
                      className={`p-2 rounded-xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTool === 'point'
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm scale-102'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Dot className="w-4 h-4" />
                      <span className="text-[11px]">Nokta (•)</span>
                    </button>

                    {/* Tekil Silgi */}
                    <button
                      onClick={() => {
                        setActiveTool('eraser');
                        setSelectedPointForLink(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('🧹 TEKİL SİLME ARACI: Tahtada silmek istediğiniz noktaya, doğru parçasına veya çembere tıklayın.');
                      }}
                      className={`p-2 rounded-xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTool === 'eraser'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm scale-102'
                          : 'bg-white border-rose-200 text-rose-700 hover:bg-rose-50'
                      }`}
                    >
                      <Eraser className="w-4 h-4" />
                      <span className="text-[11px]">Silgi</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 4. ÇOKGEN & ÇEMBER MENÜSÜ */}
              {(activeToolCategory === 'shapes' || activeToolCategory === 'all') && (
                <div className="space-y-2 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex items-center justify-between text-[11px] font-black text-emerald-800 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Shapes className="w-3.5 h-3.5 text-emerald-600" />
                      <span>⬡ Çokgen & Çember</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                      2 Araç
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Çokgen */}
                    <button
                      onClick={() => {
                        setActiveTool('polygon');
                        setSelectedPointForLink(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('⬡ Çokgen Aracı: Köşeleri sırayla ekleyin. Kapatmak için 1. köşeye tıklayın veya "Çokgeni Kapat" butonuna basın.');
                      }}
                      className={`p-3 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTool === 'polygon'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-102'
                          : 'bg-white border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      <Shapes className="w-5 h-5" />
                      <span className="font-extrabold text-xs text-center">Çokgen (Alan & Çevre)</span>
                    </button>

                    {/* Pergel & Çember */}
                    <button
                      onClick={() => {
                        setActiveTool('compass');
                        setSelectedPointForLink(null);
                        setCompassCenterPoint(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('⭕ Pergel: 1. Tıklama ile Merkez (M), 2. tıklama ile Yarıçap (r) belirleyip çember çizin.');
                      }}
                      className={`p-3 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTool === 'compass'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20 scale-102'
                          : 'bg-white border-purple-200 text-purple-800 hover:bg-purple-50'
                      }`}
                    >
                      <Compass className="w-5 h-5" />
                      <span className="font-extrabold text-xs text-center">Pergel & Çember</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 5. MOTİFLER MENÜSÜ (Kültürel Miras & Sanat [D7.1]) */}
              {(activeToolCategory === 'motifs' || activeToolCategory === 'all') && (
                <div className="space-y-2.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <div className="flex items-center justify-between text-[11px] font-black text-amber-900 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span>🏛️ Geleneksel Motifler [D7.1]</span>
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold bg-white px-2 py-0.5 rounded-full border border-amber-200">
                      2 Motif Etkinliği
                    </span>
                  </div>

                  {/* Motif 1: Selçuklu Yıldızı Görevi */}
                  <button
                    onClick={loadMotif1Mission}
                    className={`w-full p-2.5 rounded-2xl border text-left font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer shadow-xs ${
                      isMotif1Active
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/30 scale-[1.01]'
                        : 'bg-gradient-to-r from-amber-50 to-amber-100/70 border-amber-300 text-amber-950 hover:bg-amber-100 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-inner shrink-0 ${
                        isMotif1Active ? 'bg-white/20 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        ⭐
                      </span>
                      <div>
                        <div className="font-extrabold text-xs flex items-center gap-1.5">
                          <span>Motif 1: Selçuklu Yıldızı</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                            isMotif1Active ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'
                          }`}>
                            8 Köşeli
                          </span>
                        </div>
                        <div className={`text-[10px] font-normal line-clamp-1 ${
                          isMotif1Active ? 'text-amber-100' : 'text-amber-800'
                        }`}>
                          Türk-İslam sanatı: Kesik çizgileri tamamla!
                        </div>
                      </div>
                    </div>
                    <Sparkles className={`w-4 h-4 shrink-0 ${isMotif1Active ? 'text-white' : 'text-amber-600'}`} />
                  </button>

                  {/* Motif 2: Eli Belinde Görevi */}
                  <button
                    onClick={loadMotif2Mission}
                    className={`w-full p-2.5 rounded-2xl border text-left font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer shadow-xs ${
                      isMotif2Active
                        ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white border-cyan-600 shadow-md shadow-cyan-600/30 scale-[1.01]'
                        : 'bg-gradient-to-r from-cyan-50 to-sky-100/70 border-cyan-300 text-cyan-950 hover:bg-cyan-100 hover:border-cyan-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-inner shrink-0 ${
                        isMotif2Active ? 'bg-white/20 text-white' : 'bg-cyan-600 text-white'
                      }`}>
                        💠
                      </span>
                      <div>
                        <div className="font-extrabold text-xs flex items-center gap-1.5">
                          <span>Motif 2: Eli Belinde</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                            isMotif2Active ? 'bg-white/20 text-white' : 'bg-cyan-200 text-cyan-900'
                          }`}>
                            Anadolu Kilimi
                          </span>
                        </div>
                        <div className={`text-[10px] font-normal line-clamp-1 ${
                          isMotif2Active ? 'text-cyan-100' : 'text-cyan-800'
                        }`}>
                          Analık & bereket simgesi: 16 doğru parçası
                        </div>
                      </div>
                    </div>
                    <Sparkles className={`w-4 h-4 shrink-0 ${isMotif2Active ? 'text-white' : 'text-cyan-600'}`} />
                  </button>
                </div>
              )}

              {/* 6. ÖZEL & OYUN MENÜSÜ */}
              {(activeToolCategory === 'special' || activeToolCategory === 'all') && (
                <div className="space-y-2 p-3 rounded-2xl bg-slate-50/80 border border-slate-200">
                  <div className="flex items-center justify-between text-[11px] font-black text-slate-800 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-slate-600" />
                      <span>🎨 Özel & Oyun</span>
                    </span>
                    <span className="text-[10px] text-slate-600 font-semibold bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      2 Araç & Oyun
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Gönye (Dik Üçgen) */}
                    <button
                      onClick={() => {
                        setActiveTool('setsquare');
                        setIsSetSquareOnCanvas(true);
                        setSelectedPointForLink(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('📐 Gönye tuvale bırakıldı! Cetveli çizgilere yaklaştırarak yapıştırabilir, mıknatıslı ucundan 90° dikme indirebilirsiniz.');
                      }}
                      className={`p-3 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTool === 'setsquare' || isSetSquareOnCanvas
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-102'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50'
                      }`}
                    >
                      <span className="font-black text-sm">📐 ⊥</span>
                      <span className="font-bold text-xs text-center">Gönye (Dik Üçgen)</span>
                    </button>

                    {/* Sanat Motifi */}
                    <button
                      onClick={() => {
                        setActiveTool('artmotif');
                        setSelectedPointForLink(null);
                        setMeasureAnglePoints([]);
                        setThreePointAnglePoints([]);
                        setMeasureLengthPoints([]);
                        playSound('click');
                        setFeedbackMsg('🎨 Görsel Sanatlar: Tahtaya tıklayarak Selçuklu Çinisi motifi ekleyin.');
                      }}
                      className={`p-3 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTool === 'artmotif'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20 scale-102'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50'
                      }`}
                    >
                      <Palette className="w-5 h-5" />
                      <span className="font-bold text-xs text-center">Sanat [D7.1]</span>
                    </button>
                  </div>

                  {/* Açı Tahmin & İletki Oyunu Butonu */}
                  <button
                    onClick={startAngleGame}
                    className={`w-full p-2.5 rounded-2xl border text-left font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer shadow-xs ${
                      isAngleGameActive
                        ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-sky-500 shadow-md shadow-sky-600/30 scale-[1.01]'
                        : 'bg-gradient-to-r from-sky-50 to-indigo-50/80 border-sky-200 text-sky-950 hover:bg-sky-100 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shadow-inner shrink-0 ${
                        isAngleGameActive ? 'bg-white/20 text-white' : 'bg-sky-600 text-white'
                      }`}>
                        🎯
                      </span>
                      <div>
                        <div className="font-extrabold text-xs flex items-center gap-1.5">
                          <span>Açı Tahmin Oyunu</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                            isAngleGameActive ? 'bg-white/20 text-white' : 'bg-sky-200 text-sky-900'
                          }`}>
                            Oyun
                          </span>
                        </div>
                        <div className={`text-[10px] font-normal line-clamp-1 ${
                          isAngleGameActive ? 'text-sky-100' : 'text-sky-800'
                        }`}>
                          Göz kararı tahmin et &amp; iletkiyle ölç!
                        </div>
                      </div>
                    </div>
                    <Target className={`w-4 h-4 shrink-0 ${isAngleGameActive ? 'text-white' : 'text-sky-600'}`} />
                  </button>
                </div>
              )}
            </div>

            {/* Color Palette */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Çizim Rengi</span>
              <div className="flex items-center gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setActiveColor(c);
                      playSound('click');
                    }}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      activeColor === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Clear, Eraser, Magnet & Undo Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
              <button
                onClick={undoLast}
                className="flex-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                title="Son işlemi geri al"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Geri Al</span>
              </button>
              {/* Magnet Toggle Button (Yazısız Sadece İkon) */}
              <button
                onClick={() => {
                  const nextVal = !isSnapToGrid;
                  setIsSnapToGrid(nextVal);
                  playSound('click');
                  setFeedbackMsg(nextVal ? '🧲 Mıknatıs Açıldı (Izgaraya Yapışma Aktif).' : '🧲 Mıknatıs Kapatıldı (Serbest Çizim Aktif).');
                }}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                  isSnapToGrid
                    ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-sm ring-2 ring-amber-200 scale-102'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-400 border-slate-200'
                }`}
                title={isSnapToGrid ? 'Mıknatıs Açık (Kapatmak için tıklayın)' : 'Mıknatıs Kapalı (Açmak için tıklayın)'}
                aria-label="Mıknatıs Aç/Kapa"
              >
                <Magnet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  const nextTool = activeTool === 'eraser' ? 'point' : 'eraser';
                  setActiveTool(nextTool);
                  setSelectedPointForLink(null);
                  setMeasureAnglePoints([]);
                  setMeasureLengthPoints([]);
                  playSound('click');
                  if (nextTool === 'eraser') {
                    setFeedbackMsg('🧹 TEKİL SİLME ARACI: Tahtada silmek istediğiniz herhangi bir noktaya veya çizgiye tıklayın.');
                  } else {
                    setFeedbackMsg('📍 Nokta aracı seçildi.');
                  }
                }}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTool === 'eraser'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-300 scale-102'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                }`}
                title="Noktaları veya çizgileri tek tek sil"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Tekil Sil</span>
              </button>
              <button
                onClick={clearAll}
                className="py-2 px-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                title="Tüm tahtayı temizle"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Tümünü Sil</span>
              </button>
            </div>
          </div>

          {/* Quick Presets for MAT.5.3.1 (İstasyon Görev Kartları & Şablonlar) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                İstasyon Görev Kartları (6 Görev Şablonu)
              </h4>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                Maarif + GeoGebra
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Görev Kartı 1: Çizgi Modelleri */}
              <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-teal-950 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-black flex items-center justify-center">1</span>
                    <span>Temel Çizgiler [AB], [CD&gt;, EF</span>
                  </span>
                  <button
                    onClick={loadDefaultGeometricPresets}
                    className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Şablonu Yükle</span>
                  </button>
                </div>
                <p className="text-[11px] text-teal-800 leading-snug">
                  İki ucu kapalı doğru parçası [AB] ölçülebilir; tek yönlü ışın [CD&gt; ve iki yöne sonsuz doğru EF.
                </p>
              </div>

              {/* Görev Kartı 2: Dik Açı Modeli */}
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-950 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">2</span>
                    <span>Dinamik 90° Dik Açı Modeli</span>
                  </span>
                  <button
                    onClick={loadAngleStationPreset}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Şablonu Yükle</span>
                  </button>
                </div>
                <p className="text-[11px] text-blue-800 leading-snug">
                  Ortak başlangıç noktalı [BA&gt; ve [BC&gt; ışınlarıyla inşa edilen 90° dik açı (∠ABC).
                </p>
              </div>

              {/* Görev Kartı 3: Eş Çemberler */}
              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-purple-950 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[11px] font-black flex items-center justify-center">3</span>
                    <span>Pergel Kilidi: Eş Çemberler</span>
                  </span>
                  <button
                    onClick={loadCircleStationPreset}
                    className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Şablonu Yükle</span>
                  </button>
                </div>
                <p className="text-[11px] text-purple-800 leading-snug">
                  Pergel açıklığı bozulmadan çizilen eşit yarıçaplı (r1 = r2 = 5 cm) çemberler birbirine eştir.
                </p>
              </div>

              {/* Görev Kartı 4: En Kısa Yol (Dikme) */}
              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-rose-950 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-black flex items-center justify-center">4</span>
                    <span>Kıyıya En Kısa Dikme [PH] ⊥ d</span>
                  </span>
                  <button
                    onClick={loadPerpendicularStationPreset}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Şablonu Yükle</span>
                  </button>
                </div>
                <p className="text-[11px] text-rose-800 leading-snug">
                  Bir noktadan doğruya indirilen dikme mesafesi (15 cm), her eğik yoldan (23 cm) daha kısadır.
                </p>
              </div>

              {/* Görev Kartı 5: Geleneksel Motifler & Sanat [D7.1] */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-1.5">
                  <span className="font-extrabold text-amber-950 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-black flex items-center justify-center">5</span>
                    <span>Geleneksel Motifler & Sanat [D7.1]</span>
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={loadMotif1Mission}
                      className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Star className="w-3 h-3" />
                      <span>Selçuklu Yıldızı</span>
                    </button>
                    <button
                      onClick={loadMotif2Mission}
                      className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>🌸 Eli Belinde</span>
                    </button>
                    <button
                      onClick={loadArtMotifStationPreset}
                      className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Hazır Model</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-amber-800 leading-snug">
                  Türk-İslam ve Anadolu kültürel mirası: 8 köşeli Selçuklu Yıldızı ve kilimlerin bereket simgesi Eli Belinde motifleri.
                </p>
              </div>

              {/* Görev Kartı 6: GeoGebra Çokgen, Alan & Çevre Modeli */}
              <div className="p-3 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center">6</span>
                    <span>GeoGebra Çokgen, Alan & Çevre</span>
                  </span>
                  <button
                    onClick={loadPolygonStationPreset}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Şablonu Yükle</span>
                  </button>
                </div>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  Dik Üçgen ABC ve Dikdörtgen DEFG modelleri. Köşeleri sürükleyerek çevre (Ç) ve Gauss alanı (cm²) canlı izleyin!
                </p>
              </div>
            </div>
          </div>

          {/* Goals Checklist Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-400">
                <Target className="w-4 h-4" />
                <span>İstasyon Görevleri (7 Görev)</span>
              </div>
              <span className="text-[11px] text-indigo-200">
                {Object.values(geoMissionsDone).filter(Boolean).length} / 7 Tamamlandı
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className={`p-2 rounded-xl flex items-center justify-between border ${
                geoMissionsDone.point ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/10 border-white/15 text-slate-300'
              }`}>
                <span>📍 1. En az 1 Nokta (•) yerleştir</span>
                {geoMissionsDone.point ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Target className="w-3.5 h-3.5 opacity-40" />}
              </div>

              <div className={`p-2 rounded-xl flex items-center justify-between border ${
                geoMissionsDone.segment ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/10 border-white/15 text-slate-300'
              }`}>
                <span>📏 2. Doğru Parçası [AB] çiz (Çizgeç)</span>
                {geoMissionsDone.segment ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Target className="w-3.5 h-3.5 opacity-40" />}
              </div>

              <div className={`p-2 rounded-xl flex items-center justify-between border ${
                geoMissionsDone.rayLine ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/10 border-white/15 text-slate-300'
              }`}>
                <span>🔦 3. Işın [CD&gt; veya Doğru EF oluştur</span>
                {geoMissionsDone.rayLine ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Target className="w-3.5 h-3.5 opacity-40" />}
              </div>

              <div className={`p-2 rounded-xl flex items-center justify-between border ${
                geoMissionsDone.angle ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/10 border-white/15 text-slate-300'
              }`}>
                <span>📐 4. Dinamik Açı (∠ABC) oluştur</span>
                {geoMissionsDone.angle ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Target className="w-3.5 h-3.5 opacity-40" />}
              </div>

              <div className={`p-2 rounded-xl flex items-center justify-between border ${
                geoMissionsDone.circle ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/10 border-white/15 text-slate-300'
              }`}>
                <span>⭕ 5. Pergel ile Çember (r) çiz</span>
                {geoMissionsDone.circle ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Target className="w-3.5 h-3.5 opacity-40" />}
              </div>

              <div className={`p-2 rounded-xl flex items-center justify-between border ${
                geoMissionsDone.perpendicular ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/10 border-white/15 text-slate-300'
              }`}>
                <span>📐 6. Gönye ile Dikme (d ⊥ k) indir</span>
                {geoMissionsDone.perpendicular ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Target className="w-3.5 h-3.5 opacity-40" />}
              </div>

              <div className={`p-2 rounded-xl flex items-center justify-between border ${
                geoMissionsDone.art ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/10 border-white/15 text-slate-300'
              }`}>
                <span>🎨 7. Estetik Sanat Motifi ekle [D7.1]</span>
                {geoMissionsDone.art ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Target className="w-3.5 h-3.5 opacity-40" />}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Geometry Canvas */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="relative bg-white rounded-3xl border-2 border-slate-200 shadow-inner overflow-hidden min-h-[520px] flex flex-col justify-between">
            
            {/* Status & Feedback Bar */}
            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-medium z-10 border-b border-slate-800 gap-3">
              <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${activeTool === 'eraser' ? 'bg-rose-500 animate-ping' : 'bg-teal-400 animate-pulse'}`} />
                <span className="truncate text-slate-200 font-medium" title={feedbackMsg}>{feedbackMsg}</span>
                {activeTool === 'eraser' && (
                  <span className="shrink-0 px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full font-bold text-[10px] animate-pulse">
                    🧹 Silgi Aktif
                  </span>
                )}
                {isProtractorOnCanvas && (
                  <span className="shrink-0 px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold text-[10px] flex items-center gap-1">
                    📐 İletki
                    <button
                      onClick={() => {
                        setIsProtractorOnCanvas(false);
                        playSound('click');
                        setFeedbackMsg('İletki tuvalden kaldırıldı.');
                      }}
                      className="text-amber-400 hover:text-white font-black ml-0.5 cursor-pointer"
                      title="İletkiyi Tuvalden Kaldır"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {isSetSquareOnCanvas && (
                  <span className="shrink-0 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-bold text-[10px] flex items-center gap-1">
                    📐 Gönye
                    <button
                      onClick={() => {
                        setIsSetSquareOnCanvas(false);
                        playSound('click');
                        setFeedbackMsg('Gönye tuvalden kaldırıldı.');
                      }}
                      className="text-emerald-400 hover:text-white font-black ml-0.5 cursor-pointer"
                      title="Gönyeyi Tuvalden Kaldır"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-300 shrink-0">
                <span className="hidden sm:inline-block text-[11px] text-slate-400">Noktalar: {points.length}</span>
                <span className="hidden sm:inline-block text-[11px] text-slate-400">Şekiller: {objects.length}</span>
                {angles.length > 0 && <span className="hidden md:inline-block text-[11px] text-slate-400">Açılar: {angles.length}</span>}

                {/* Taşı (Move / Drag) Simgesi */}
                <button
                  onClick={() => {
                    const nextTool = activeTool === 'drag' ? 'point' : 'drag';
                    setActiveTool(nextTool);
                    setSelectedPointForLink(null);
                    setMeasureAnglePoints([]);
                    setMeasureLengthPoints([]);
                    playSound('click');
                    setFeedbackMsg(
                      nextTool === 'drag'
                        ? '🖐️ Taşıma Aracı: Tahtadaki noktaları ve nesneleri sürükleyerek taşıyabilirsiniz.'
                        : '📍 Nokta Aracı Aktif.'
                    );
                  }}
                  className={`p-1.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                    activeTool === 'drag'
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-indigo-500/30 ring-2 ring-indigo-300'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                  }`}
                  title={activeTool === 'drag' ? '🖐️ Taşıma Aracı Açık (Kapatmak için tıklayın)' : '🖐️ Taşıma Aracı (Taşımak için tıklayın)'}
                  aria-label="Taşıma Aracı"
                >
                  <Move className="w-4 h-4" />
                </button>

                {/* Mıknatıs Toggle Simgesi (Izgara Yapışması) */}
                <button
                  onClick={() => {
                    const nextVal = !isSnapToGrid;
                    setIsSnapToGrid(nextVal);
                    playSound('click');
                    setFeedbackMsg(nextVal ? '🧲 Mıknatıs Açıldı (Izgara Yapışması Aktif).' : '🧲 Mıknatıs Kapatıldı (Serbest Çizim Aktif).');
                  }}
                  className={`p-1.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                    isSnapToGrid
                      ? 'bg-amber-500 text-white border-amber-400 shadow-amber-500/30 ring-2 ring-amber-300'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                  }`}
                  title={isSnapToGrid ? '🧲 Mıknatıs Açık (Izgara Yapışmasını Kapat)' : '🧲 Mıknatıs Kapalı (Izgara Yapışmasını Aç)'}
                  aria-label="Izgara Mıknatısı Aç/Kapa"
                >
                  <Magnet className="w-4 h-4" />
                </button>

                {/* Çöp Sepeti Simgesi (Tümünü Temizle) */}
                <button
                  onClick={() => {
                    clearAll();
                    setFeedbackMsg('🗑️ Tahtadaki tüm çizimler ve noktalar silindi.');
                  }}
                  className="p-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-rose-300 hover:border-rose-500/50 hover:bg-rose-950/60 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                  title="🗑️ Tümünü Temizle (Her Şeyi Sil)"
                  aria-label="Tümünü Temizle"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Motif 1: Selçuklu Yıldızı Görev Paneli (HUD) */}
            {isMotif1Active && (
              <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white p-3.5 border-b border-amber-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md z-10 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-amber-950" />
                      <span>Motif 1 Görevi</span>
                    </span>
                    <h4 className="font-extrabold text-sm text-amber-100 flex items-center gap-1.5">
                      <span>🏛️ 8 Köşeli Selçuklu Yıldızı</span>
                      <span className="text-[10px] bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                        Maarif [D7.1]
                      </span>
                    </h4>
                  </div>
                  <p className="text-[11px] text-amber-200/90 leading-snug">
                    Kesik çizgileri sol menüden uygun araçları seçerek tamamlayın (Doğru Parçası, Pergel, Doğru, Işın, Gönye).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Progress Badge */}
                  <div className="flex items-center gap-2 bg-amber-950/70 border border-amber-600/50 px-3 py-1.5 rounded-xl">
                    <div className="text-right">
                      <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">İlerleme</div>
                      <div className="text-xs font-black text-white">
                        {motifCompletedGuides.length} / {MOTIF_1_GUIDES.length} (%{Math.round((motifCompletedGuides.length / MOTIF_1_GUIDES.length) * 100)})
                      </div>
                    </div>
                    <div className="w-16 bg-amber-950 h-2.5 rounded-full overflow-hidden border border-amber-700/50">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300 rounded-full"
                        style={{ width: `${(motifCompletedGuides.length / MOTIF_1_GUIDES.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Magnet Toggle Button (Yazısız Sadece İkon) */}
                    <button
                      onClick={() => {
                        const nextVal = !isSnapToGrid;
                        setIsSnapToGrid(nextVal);
                        playSound('click');
                        setFeedbackMsg(nextVal ? '🧲 Mıknatıs Açıldı (Izgaraya Yapışma Aktif).' : '🧲 Mıknatıs Kapatıldı (Serbest Çizim Aktif).');
                      }}
                      className={`p-1.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                        isSnapToGrid
                          ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-sm ring-2 ring-amber-300'
                          : 'bg-amber-950/60 text-amber-400/50 border-amber-700/60 hover:text-amber-200'
                      }`}
                      title={isSnapToGrid ? 'Mıknatıs Açık (Izgara Yapışmasını Kapatmak İçin Tıklayın)' : 'Mıknatıs Kapalı (Serbest Çizim - Açmak İçin Tıklayın)'}
                      aria-label="Mıknatıs Aç/Kapa"
                    >
                      <Magnet className="w-4 h-4" />
                    </button>
                    <button
                      onClick={giveMotifNextHint}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                      title="Sıradaki tamamlanacak parçayı ve aracını göster"
                    >
                      <span>💡 İpucu</span>
                    </button>
                    <button
                      onClick={autoCompleteMotifMission}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                      title="Tüm çizgileri otomatik tamamla"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tamamla</span>
                    </button>
                    <button
                      onClick={loadMotif1Mission}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 transition-all cursor-pointer"
                      title="Görevi Sıfırla"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsMotif1Active(false)}
                      className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
                      title="Motif 1 Görevinden Çık"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Motif 2: Eli Belinde Görev Paneli (HUD) */}
            {isMotif2Active && (
              <div className="bg-gradient-to-r from-slate-950 via-cyan-950 to-sky-950 text-white p-3.5 border-b border-cyan-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md z-10 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-cyan-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3 fill-cyan-950" />
                      <span>Motif 2 Görevi</span>
                    </span>
                    <h4 className="font-extrabold text-sm text-cyan-100 flex items-center gap-1.5">
                      <span>💠 Eli Belinde (Anadolu Kilimi)</span>
                      <span className="text-[10px] bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-bold">
                        Maarif [D7.1]
                      </span>
                    </h4>
                  </div>
                  <p className="text-[11px] text-cyan-200/90 leading-snug">
                    Analık ve bereket sembolü "Eli Belinde": Doğru Parçası aracıyla noktaları sırayla birleştirip dış hatları tamamlayın.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Progress Badge */}
                  <div className="flex items-center gap-2 bg-slate-950/70 border border-cyan-600/50 px-3 py-1.5 rounded-xl">
                    <div className="text-right">
                      <div className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">İlerleme</div>
                      <div className="text-xs font-black text-white">
                        {motifCompletedGuides.length} / {MOTIF_2_GUIDES.length} (%{Math.round((motifCompletedGuides.length / MOTIF_2_GUIDES.length) * 100)})
                      </div>
                    </div>
                    <div className="w-16 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-cyan-700/50">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-sky-400 transition-all duration-300 rounded-full"
                        style={{ width: `${(motifCompletedGuides.length / MOTIF_2_GUIDES.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Magnet Toggle Button */}
                    <button
                      onClick={() => {
                        const nextVal = !isSnapToGrid;
                        setIsSnapToGrid(nextVal);
                        playSound('click');
                        setFeedbackMsg(nextVal ? '🧲 Mıknatıs Açıldı (Izgaraya Yapışma Aktif).' : '🧲 Mıknatıs Kapatıldı (Serbest Çizim Aktif).');
                      }}
                      className={`p-1.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                        isSnapToGrid
                          ? 'bg-cyan-400 text-cyan-950 border-cyan-300 shadow-sm ring-2 ring-cyan-300'
                          : 'bg-cyan-950/60 text-cyan-400/50 border-cyan-700/60 hover:text-cyan-200'
                      }`}
                      title={isSnapToGrid ? 'Mıknatıs Açık (Izgara Yapışmasını Kapatmak İçin Tıklayın)' : 'Mıknatıs Kapalı (Serbest Çizim - Açmak İçin Tıklayın)'}
                      aria-label="Mıknatıs Aç/Kapa"
                    >
                      <Magnet className="w-4 h-4" />
                    </button>
                    <button
                      onClick={giveMotifNextHint}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                      title="Sıradaki tamamlanacak parçayı ve aracını göster"
                    >
                      <span>💡 İpucu</span>
                    </button>
                    <button
                      onClick={autoCompleteMotifMission}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                      title="Tüm çizgileri otomatik tamamla"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tamamla</span>
                    </button>
                    <button
                      onClick={loadMotif2Mission}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-200 transition-all cursor-pointer"
                      title="Görevi Sıfırla"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsMotif2Active(false)}
                      className="p-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer"
                      title="Motif 2 Görevinden Çık"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Açı Tahmin ve İletki Ölçüm Oyunu HUD Paneli */}
            {isAngleGameActive && (
              <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white p-3.5 border-b border-sky-600/40 shadow-lg z-10 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Sol Bilgi & Talimat */}
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <Target className="w-3 h-3 text-amber-950" />
                        <span>Açı Oyunu • Tur {angleGameRound}</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border border-sky-400/30 bg-sky-500/20 text-sky-200">
                        {angleGameStage === 'estimate'
                          ? '1. Aşama: Göz Kararı Tahmin'
                          : angleGameStage === 'measure'
                          ? '2. Aşama: İletki ile Ölçüm'
                          : '3. Aşama: Sonuç & Başarı Skoru'}
                      </span>
                      {angleGameTotalScore > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-400" />
                          <span>Toplam: {angleGameTotalScore} Puan</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-sky-100/90 leading-snug">
                      {angleGameStage === 'estimate' && (
                        <>Ekranda verilen açıyı inceleyin. Açının kaç derece olduğunu <strong>göz kararı tahmin edin</strong> ve aşağıdaki kutuya yazıp <em>&quot;Tahmini Onayla&quot;</em> butonuna basın.</>
                      )}
                      {angleGameStage === 'measure' && (
                        <>İletkiyi merkezindeki turuncu halkadan tutup açının <strong>O köşesine</strong> yerleştirin. Mavi halkadan döndürüp <strong>taban koluna</strong> dayayın. Diğer kolun gösterdiği dereceyi kutuya yazıp onaylayın.</>
                      )}
                      {angleGameStage === 'result' && angleGameResult && (
                        <span>{angleGameResult.message}</span>
                      )}
                    </p>
                  </div>

                  {/* Sağ Kontroller & Giriş Alanları */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* AŞAMA 1: TAHMİN GİRİŞİ */}
                    {angleGameStage === 'estimate' && (
                      <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 px-3 rounded-2xl border border-sky-500/30">
                        <div className="flex items-center gap-1.5">
                          <label htmlFor="angle-estimate-input" className="text-[11px] font-bold text-sky-200">
                            Tahminin:
                          </label>
                          <div className="relative flex items-center">
                            <input
                              id="angle-estimate-input"
                              type="number"
                              min="1"
                              max="179"
                              placeholder="Örn: 65"
                              value={angleGameEstimate}
                              onChange={(e) => setAngleGameEstimate(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && submitAngleEstimate()}
                              className="w-20 px-2.5 py-1 text-sm font-black text-center bg-slate-900 border border-sky-400/60 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-500"
                            />
                            <span className="ml-1 font-black text-sky-300 text-xs">°</span>
                          </div>
                        </div>
                        <button
                          onClick={submitAngleEstimate}
                          disabled={!angleGameEstimate.trim()}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-xs transition-all shadow-md shadow-sky-600/30 flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Tahmini Onayla</span>
                        </button>
                      </div>
                    )}

                    {/* AŞAMA 2: İLETKİ İLE ÖLÇÜM GİRİŞİ */}
                    {angleGameStage === 'measure' && (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 flex-wrap bg-slate-800/80 p-1.5 px-3 rounded-2xl border border-sky-500/30">
                          {/* Hızlı Köşeye Oturt Butonu (Öğrenciye kolaylık) */}
                          <button
                            onClick={snapProtractorToVertex}
                            className="px-2 py-1 rounded-xl bg-sky-900/60 hover:bg-sky-800/80 border border-sky-400/40 text-sky-200 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                            title="İletkiyi otomatik olarak açının köşesine ve tabanına hizalar"
                          >
                            <Magnet className="w-3 h-3 text-sky-300" />
                            <span>Köşeye Dayat</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <label htmlFor="angle-meas-input" className="text-[11px] font-bold text-sky-200">
                              İletki Ölçümün:
                            </label>
                            <div className="relative flex items-center">
                              <input
                                id="angle-meas-input"
                                type="number"
                                min="1"
                                max="179"
                                placeholder="Örn: 70"
                                value={angleGameMeasurement}
                                onChange={(e) => {
                                  setAngleGameMeasurement(e.target.value);
                                  setAngleMeasureError(null);
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && submitAngleMeasurement()}
                                className={`w-20 px-2.5 py-1 text-sm font-black text-center bg-slate-900 border rounded-xl text-white focus:outline-none focus:ring-2 placeholder:text-slate-500 transition-all ${
                                  angleMeasureError
                                    ? 'border-rose-500 ring-2 ring-rose-500/50'
                                    : 'border-emerald-400/60 focus:ring-emerald-400'
                                }`}
                              />
                              <span className="ml-1 font-black text-emerald-300 text-xs">°</span>
                            </div>
                          </div>

                          <button
                            onClick={submitAngleMeasurement}
                            disabled={!angleGameMeasurement.trim()}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-black text-xs transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Ölçümü Onayla</span>
                          </button>
                        </div>

                        {/* Hata ve Doğrulama Bildirimi (Yanlış ölçüm girildiğinde engeller ve uyarır) */}
                        {angleMeasureError && (
                          <div className="text-[11px] font-bold text-rose-300 bg-rose-950/90 border border-rose-600/70 px-3 py-1.5 rounded-xl flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-1 duration-200 shadow-sm">
                            <span className="flex items-center gap-1.5">
                              <span className="text-sm">⚠️</span>
                              <span>{angleMeasureError}</span>
                            </span>
                            {angleMeasureAttempts >= 2 && angleGameTarget && (
                              <button
                                onClick={() => {
                                  snapProtractorToVertex();
                                  setAngleGameMeasurement(String(angleGameTarget.angleDeg));
                                  setAngleMeasureError(null);
                                  playSound('click');
                                  setFeedbackMsg(`💡 İletki açının köşesine yerleştirildi ve doğru ölçüm (${angleGameTarget.angleDeg}°) kutuya aktarıldı. Şimdi onaylayabilirsiniz.`);
                                }}
                                className="px-2 py-0.5 rounded-lg bg-amber-500/30 hover:bg-amber-500/40 border border-amber-400/60 text-amber-200 text-[10px] font-bold cursor-pointer whitespace-nowrap"
                              >
                                İpucu: {angleGameTarget.angleDeg}° Yaz
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* AŞAMA 3: SONUÇ RAPORU & SIRADAKİ TUR */}
                    {angleGameStage === 'result' && angleGameResult && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Özet Skor Rozeti */}
                        <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-600 px-3 py-1 rounded-xl text-xs">
                          <div className="text-center border-r border-slate-700 pr-2">
                            <div className="text-[9px] text-slate-400 font-bold uppercase">Gerçek</div>
                            <div className="font-black text-amber-400 text-xs">{angleGameResult.trueDeg}°</div>
                          </div>
                          <div className="text-center border-r border-slate-700 pr-2">
                            <div className="text-[9px] text-slate-400 font-bold uppercase">Tahmin</div>
                            <div className="font-black text-sky-300 text-xs">
                              {angleGameResult.estimate}° (%{angleGameResult.estimateAccuracy})
                            </div>
                          </div>
                          <div className="text-center border-r border-slate-700 pr-2">
                            <div className="text-[9px] text-slate-400 font-bold uppercase">İletki</div>
                            <div className="font-black text-emerald-300 text-xs">
                              {angleGameResult.measurement}° (%{angleGameResult.measureAccuracy})
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-[9px] text-emerald-400 font-bold uppercase">Başarı</div>
                            <div className="font-black text-emerald-400 text-xs">
                              %{angleGameResult.totalRoundScore}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={nextAngleGameRound}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/30 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Sonraki Açı</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    )}

                    {/* Çıkış Butonu */}
                    <button
                      onClick={exitAngleGame}
                      className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-900/60 border border-slate-700 hover:border-rose-500/60 text-slate-400 hover:text-rose-200 transition-all cursor-pointer"
                      title="Oyundan Çık ve Atölyeye Dön"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SVG Interactive Canvas */}
            <svg
              ref={svgRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`w-full h-[470px] ${activeTool === 'eraser' ? 'cursor-pointer' : activeTool === 'drag' ? 'cursor-grab' : activeTool === 'protractor' ? 'cursor-default' : 'cursor-crosshair'} select-none touch-none bg-white`}
            >
              <defs>
                <pattern id="lab-canvas-grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                  <path
                    d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeOpacity="0.55"
                  />
                  <circle cx="0" cy="0" r="1.5" fill="#94a3b8" fillOpacity="0.75" />
                </pattern>
              </defs>

              {/* Grid Background Pattern */}
              {showGrid && (
                <rect width="100%" height="100%" fill="url(#lab-canvas-grid)" pointerEvents="none" />
              )}

              {/* MOTIF 1: SELÇUKLU YILDIZI REHBER VE MODEL KATMANI */}
              {isMotif1Active && (
                <g id="motif-1-layer">
                  {/* Outer decorative dashed boundary */}
                  <circle
                    cx="380"
                    cy="225"
                    r="125"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeDasharray="2,4"
                    opacity="0.4"
                    className="pointer-events-none"
                  />

                  {/* Translucent Star Fill */}
                  <polygon
                    points="380,110 495,225 380,340 265,225"
                    fill="#0284c7"
                    fillOpacity={motifCompletedGuides.length >= 8 ? 0.2 : 0.04}
                    stroke="#0284c7"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                    className="transition-all duration-500 pointer-events-none"
                  />
                  <polygon
                    points="461,144 461,306 299,306 299,144"
                    fill="#10b396"
                    fillOpacity={motifCompletedGuides.length >= 8 ? 0.2 : 0.04}
                    stroke="#10b396"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                    className="transition-all duration-500 pointer-events-none"
                  />

                  {/* Center Medallion */}
                  <circle
                    cx="380"
                    cy="225"
                    r="24"
                    fill="#f59e0b"
                    fillOpacity={motifCompletedGuides.length === MOTIF_1_GUIDES.length ? 0.3 : 0.08}
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                    className="pointer-events-none"
                  />
                  <text
                    x="380"
                    y="229"
                    textAnchor="middle"
                    fill="#d97706"
                    fontSize="11"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    ✦
                  </text>

                  {/* Render the 12 Dashed or Completed Guide Elements */}
                  {MOTIF_1_GUIDES.map((guide) => {
                    const isDone = motifCompletedGuides.includes(guide.id);
                    const isHinted = motifHintGuideId === guide.id;

                    const handleGuideClick = (e: React.MouseEvent) => {
                      e.stopPropagation();
                      if (activeTool === guide.requiredTool) {
                        completeMotifGuide(guide.id);
                      } else {
                        playSound('click');
                        setFeedbackMsg(`💡 Bu kesik çizgi bir ${guide.toolTitle} gerektirir! Lütfen sol menüden "${guide.toolTitle}" aracını seçip çizgiyi tamamlayın.`);
                        setMotifHintGuideId(guide.id);
                      }
                    };

                    if (guide.type === 'circle' && guide.cx !== undefined && guide.cy !== undefined && guide.r !== undefined) {
                      return (
                        <g key={guide.id} onClick={handleGuideClick} onPointerDown={(e) => e.stopPropagation()} className="cursor-pointer group">
                          {/* Invisible wide hit target for easy clicking */}
                          <circle cx={guide.cx} cy={guide.cy} r={guide.r} fill="none" stroke="transparent" strokeWidth="26" />
                          {/* Visual circle */}
                          <circle
                            cx={guide.cx}
                            cy={guide.cy}
                            r={guide.r}
                            fill="none"
                            stroke={isDone ? '#f59e0b' : isHinted ? '#f97316' : '#94a3b8'}
                            strokeWidth={isDone ? '3.5' : isHinted ? '3.5' : '2.2'}
                            strokeDasharray={isDone ? 'none' : '7,5'}
                            strokeOpacity={isDone ? 1 : 0.85}
                            className={isHinted ? 'animate-pulse' : ''}
                          />
                          {!isDone && (
                            <g transform={`translate(${guide.cx}, ${guide.cy - guide.r - 12})`} className="pointer-events-none">
                              <rect x="-52" y="-10" width="104" height="20" rx="5" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                              <text x="0" y="3" textAnchor="middle" fill="#fde047" fontSize="9.5" fontWeight="bold">
                                ⭕ Pergel Çemberi
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    }

                    if (guide.type === 'line' && guide.x1 !== undefined && guide.y1 !== undefined && guide.x2 !== undefined && guide.y2 !== undefined) {
                      return (
                        <g key={guide.id} onClick={handleGuideClick} onPointerDown={(e) => e.stopPropagation()} className="cursor-pointer group">
                          <line x1={guide.x1} y1={guide.y1} x2={guide.x2} y2={guide.y2} stroke="transparent" strokeWidth="26" />
                          <line
                            x1={guide.x1}
                            y1={guide.y1}
                            x2={guide.x2}
                            y2={guide.y2}
                            stroke={isDone ? '#0284c7' : isHinted ? '#f97316' : '#94a3b8'}
                            strokeWidth={isDone ? '3.5' : isHinted ? '3.5' : '2.2'}
                            strokeDasharray={isDone ? 'none' : '7,5'}
                            strokeOpacity={isDone ? 1 : 0.8}
                            className={isHinted ? 'animate-pulse' : ''}
                          />
                          {!isDone && (
                            <g transform={`translate(${(guide.x1 + guide.x2) / 2}, ${guide.y1 - 12})`} className="pointer-events-none">
                              <rect x="-44" y="-10" width="88" height="20" rx="5" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
                              <text x="0" y="3" textAnchor="middle" fill="#38bdf8" fontSize="9.5" fontWeight="bold">
                                ↔️ Eksen Doğrusu
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    }

                    if (guide.type === 'perpendicular' && guide.x1 !== undefined && guide.y1 !== undefined && guide.x2 !== undefined && guide.y2 !== undefined) {
                      return (
                        <g key={guide.id} onClick={handleGuideClick} onPointerDown={(e) => e.stopPropagation()} className="cursor-pointer group">
                          <line x1={guide.x1} y1={guide.y1} x2={guide.x2} y2={guide.y2} stroke="transparent" strokeWidth="26" />
                          <line
                            x1={guide.x1}
                            y1={guide.y1}
                            x2={guide.x2}
                            y2={guide.y2}
                            stroke={isDone ? '#f43f5e' : isHinted ? '#f97316' : '#94a3b8'}
                            strokeWidth={isDone ? '3.5' : isHinted ? '3.5' : '2.2'}
                            strokeDasharray={isDone ? 'none' : '7,5'}
                            strokeOpacity={isDone ? 1 : 0.8}
                            className={isHinted ? 'animate-pulse' : ''}
                          />
                          {!isDone && (
                            <g transform={`translate(${guide.x1 + 46}, ${guide.y1 + 30})`} className="pointer-events-none">
                              <rect x="-46" y="-10" width="92" height="20" rx="5" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
                              <text x="0" y="3" textAnchor="middle" fill="#fda4af" fontSize="9.5" fontWeight="bold">
                                ⊥ Düşey Dikme
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    }

                    if (guide.type === 'ray' && guide.x1 !== undefined && guide.y1 !== undefined && guide.x2 !== undefined && guide.y2 !== undefined) {
                      return (
                        <g key={guide.id} onClick={handleGuideClick} onPointerDown={(e) => e.stopPropagation()} className="cursor-pointer group">
                          <line x1={guide.x1} y1={guide.y1} x2={guide.x2} y2={guide.y2} stroke="transparent" strokeWidth="26" />
                          <line
                            x1={guide.x1}
                            y1={guide.y1}
                            x2={guide.x2}
                            y2={guide.y2}
                            stroke={isDone ? '#10b396' : isHinted ? '#f97316' : '#94a3b8'}
                            strokeWidth={isDone ? '3.5' : isHinted ? '3.5' : '2.2'}
                            strokeDasharray={isDone ? 'none' : '7,5'}
                            strokeOpacity={isDone ? 1 : 0.8}
                            className={isHinted ? 'animate-pulse' : ''}
                          />
                          {!isDone && (
                            <g transform={`translate(${(guide.x1 + guide.x2) / 2 + 10}, ${(guide.y1 + guide.y2) / 2 - 12})`} className="pointer-events-none">
                              <rect x="-40" y="-10" width="80" height="20" rx="5" fill="#0f172a" stroke="#10b396" strokeWidth="1" />
                              <text x="0" y="3" textAnchor="middle" fill="#6ee7b7" fontSize="9.5" fontWeight="bold">
                                ⚡ Köşe Işını
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    }

                    if (guide.type === 'segment' && guide.x1 !== undefined && guide.y1 !== undefined && guide.x2 !== undefined && guide.y2 !== undefined) {
                      const midX = (guide.x1 + guide.x2) / 2;
                      const midY = (guide.y1 + guide.y2) / 2;
                      return (
                        <g key={guide.id} onClick={handleGuideClick} onPointerDown={(e) => e.stopPropagation()} className="cursor-pointer group">
                          <line x1={guide.x1} y1={guide.y1} x2={guide.x2} y2={guide.y2} stroke="transparent" strokeWidth="24" />
                          <line
                            x1={guide.x1}
                            y1={guide.y1}
                            x2={guide.x2}
                            y2={guide.y2}
                            stroke={isDone ? '#0284c7' : isHinted ? '#f97316' : '#cbd5e1'}
                            strokeWidth={isDone ? '4' : isHinted ? '3.5' : '2.5'}
                            strokeDasharray={isDone ? 'none' : '6,4'}
                            strokeLinecap="round"
                            strokeOpacity={isDone ? 1 : 0.85}
                            className={isHinted ? 'animate-pulse' : ''}
                          />
                          {!isDone && isHinted && (
                            <g transform={`translate(${midX}, ${midY})`} className="pointer-events-none">
                              <rect x="-32" y="-9" width="64" height="18" rx="4" fill="#0f172a" stroke="#f97316" strokeWidth="1" />
                              <text x="0" y="3" textAnchor="middle" fill="#fdba74" fontSize="9" fontWeight="bold">
                                📏 [{guide.p1Label}{guide.p2Label}]
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    }

                    return null;
                  })}
                </g>
              )}

              {/* MOTIF 2: ELİ BELİNDE (ANADOLU KİLİMİ) REHBER VE MODEL KATMANI */}
              {isMotif2Active && (
                <g id="motif-2-layer">
                  {/* Outer decorative dashed frame */}
                  <rect
                    x="180"
                    y="25"
                    width="400"
                    height="410"
                    rx="18"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="1"
                    strokeDasharray="3,5"
                    opacity="0.3"
                    className="pointer-events-none"
                  />

                  {/* Translucent Silhouette Fill for Eli Belinde with Inner Cutouts */}
                  <path
                    d="M 380,45 L 550,215 L 490,275 L 430,215 L 490,215 L 445,170 L 400,215 L 490,305 L 380,415 L 270,305 L 360,215 L 315,170 L 270,215 L 330,215 L 270,275 L 210,215 Z M 380,105 L 410,135 L 380,165 L 350,135 Z M 380,260 L 425,305 L 380,350 L 335,305 Z"
                    fillRule="evenodd"
                    fill="#00d2ff"
                    fillOpacity={motifCompletedGuides.length === MOTIF_2_GUIDES.length ? 0.35 : 0.08}
                    stroke="#0284c7"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                    className="transition-all duration-500 pointer-events-none"
                  />

                  {/* Decorative Inner Diamond Outlines */}
                  <polygon
                    points="380,105 410,135 380,165 350,135"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    opacity="0.6"
                    className="pointer-events-none"
                  />
                  <polygon
                    points="380,260 425,305 380,350 335,305"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    opacity="0.6"
                    className="pointer-events-none"
                  />

                  {/* Render the 16 Dashed or Completed Guide Segments */}
                  {MOTIF_2_GUIDES.map((guide) => {
                    const isDone = motifCompletedGuides.includes(guide.id);
                    const isHinted = motifHintGuideId === guide.id;

                    const handleGuideClick = (e: React.MouseEvent) => {
                      e.stopPropagation();
                      if (activeTool === guide.requiredTool) {
                        completeMotifGuide(guide.id);
                      } else {
                        playSound('click');
                        setFeedbackMsg(`💡 Bu kesik çizgi bir ${guide.toolTitle} gerektirir! Lütfen sol menüden "${guide.toolTitle}" aracını seçip çizgiyi tamamlayın.`);
                        setMotifHintGuideId(guide.id);
                      }
                    };

                    if (guide.type === 'segment' && guide.x1 !== undefined && guide.y1 !== undefined && guide.x2 !== undefined && guide.y2 !== undefined) {
                      const midX = (guide.x1 + guide.x2) / 2;
                      const midY = (guide.y1 + guide.y2) / 2;
                      return (
                        <g key={guide.id} onClick={handleGuideClick} onPointerDown={(e) => e.stopPropagation()} className="cursor-pointer group">
                          <line x1={guide.x1} y1={guide.y1} x2={guide.x2} y2={guide.y2} stroke="transparent" strokeWidth="24" />
                          <line
                            x1={guide.x1}
                            y1={guide.y1}
                            x2={guide.x2}
                            y2={guide.y2}
                            stroke={isDone ? '#0284c7' : isHinted ? '#f97316' : '#94a3b8'}
                            strokeWidth={isDone ? '4' : isHinted ? '3.5' : '2.5'}
                            strokeDasharray={isDone ? 'none' : '6,4'}
                            strokeLinecap="round"
                            strokeOpacity={isDone ? 1 : 0.85}
                            className={isHinted ? 'animate-pulse' : ''}
                          />
                          {!isDone && isHinted && (
                            <g transform={`translate(${midX}, ${midY})`} className="pointer-events-none">
                              <rect x="-32" y="-9" width="64" height="18" rx="4" fill="#0f172a" stroke="#f97316" strokeWidth="1" />
                              <text x="0" y="3" textAnchor="middle" fill="#fdba74" fontSize="9" fontWeight="bold">
                                📏 [{guide.p1Label}{guide.p2Label}]
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    }

                    return null;
                  })}
                </g>
              )}

              {/* AÇI TAHMİN OYUNU: HEDEF AÇI ÇİZİM KATMANI */}
              {isAngleGameActive && angleGameTarget && (
                <g id="angle-game-target-layer">
                  {/* Angle Arc Fill Wedge */}
                  {(() => {
                    const v = angleGameTarget.vertex;
                    const r = 52;
                    const baseRad = (angleGameTarget.baseDeg * Math.PI) / 180;
                    const secondRad = ((angleGameTarget.baseDeg - angleGameTarget.angleDeg) * Math.PI) / 180;
                    const ax1 = v.x + r * Math.cos(baseRad);
                    const ay1 = v.y + r * Math.sin(baseRad);
                    const ax2 = v.x + r * Math.cos(secondRad);
                    const ay2 = v.y + r * Math.sin(secondRad);

                    const midRad = (baseRad + secondRad) / 2;
                    const bx = v.x + 75 * Math.cos(midRad);
                    const by = v.y + 75 * Math.sin(midRad);

                    // Path for the sector arc
                    const arcD = `M ${v.x} ${v.y} L ${ax1} ${ay1} A ${r} ${r} 0 0 0 ${ax2} ${ay2} Z`;

                    return (
                      <g key="angle-game-arc">
                        <path
                          d={arcD}
                          fill="#0284c7"
                          fillOpacity="0.16"
                          stroke="#0284c7"
                          strokeWidth="2"
                        />
                        {/* Question Mark Badge or Revealed Degree Badge */}
                        <g transform={`translate(${bx}, ${by})`} className="pointer-events-none">
                          <rect
                            x="-24"
                            y="-12"
                            width="48"
                            height="24"
                            rx="7"
                            fill={angleGameStage === 'result' ? '#065f46' : '#1e1b4b'}
                            stroke={angleGameStage === 'result' ? '#34d399' : '#818cf8'}
                            strokeWidth="1.5"
                            className="shadow-md"
                          />
                          <text
                            x="0"
                            y="4.5"
                            textAnchor="middle"
                            fill={angleGameStage === 'result' ? '#6ee7b7' : '#c7d2fe'}
                            fontSize="11"
                            fontWeight="900"
                          >
                            {angleGameStage === 'result' ? `${angleGameTarget.angleDeg}°` : '?°'}
                          </text>
                        </g>
                      </g>
                    );
                  })()}

                  {/* Taban Işını (OA) */}
                  <line
                    x1={angleGameTarget.vertex.x}
                    y1={angleGameTarget.vertex.y}
                    x2={angleGameTarget.p1.x}
                    y2={angleGameTarget.p1.y}
                    stroke="#0284c7"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Dönen Diğer Kol Işını (OB) */}
                  <line
                    x1={angleGameTarget.vertex.x}
                    y1={angleGameTarget.vertex.y}
                    x2={angleGameTarget.p2.x}
                    y2={angleGameTarget.p2.y}
                    stroke="#0284c7"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Kol Ok Başları (Rays) */}
                  {(() => {
                    const v = angleGameTarget.vertex;
                    const p1 = angleGameTarget.p1;
                    const p2 = angleGameTarget.p2;
                    const ang1 = Math.atan2(p1.y - v.y, p1.x - v.x);
                    const ang2 = Math.atan2(p2.y - v.y, p2.x - v.x);
                    const arrowLen = 12;

                    return (
                      <g key="angle-game-arrows">
                        <polygon
                          points={`
                            ${p1.x},${p1.y}
                            ${p1.x - arrowLen * Math.cos(ang1 - 0.45)},${p1.y - arrowLen * Math.sin(ang1 - 0.45)}
                            ${p1.x - arrowLen * Math.cos(ang1 + 0.45)},${p1.y - arrowLen * Math.sin(ang1 + 0.45)}
                          `}
                          fill="#0284c7"
                        />
                        <polygon
                          points={`
                            ${p2.x},${p2.y}
                            ${p2.x - arrowLen * Math.cos(ang2 - 0.45)},${p2.y - arrowLen * Math.sin(ang2 - 0.45)}
                            ${p2.x - arrowLen * Math.cos(ang2 + 0.45)},${p2.y - arrowLen * Math.sin(ang2 + 0.45)}
                          `}
                          fill="#0284c7"
                        />
                      </g>
                    );
                  })()}

                  {/* Köşe O Noktası */}
                  <circle
                    cx={angleGameTarget.vertex.x}
                    cy={angleGameTarget.vertex.y}
                    r="6.5"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                  <text
                    x={angleGameTarget.vertex.x - 14}
                    y={angleGameTarget.vertex.y + 16}
                    fill="#0f172a"
                    fontSize="13"
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    O
                  </text>

                  {/* Kol Uç Noktaları A ve B */}
                  <circle cx={angleGameTarget.p1.x} cy={angleGameTarget.p1.y} r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                  <text
                    x={angleGameTarget.p1.x + 14}
                    y={angleGameTarget.p1.y + 12}
                    fill="#0369a1"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    A
                  </text>

                  <circle cx={angleGameTarget.p2.x} cy={angleGameTarget.p2.y} r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                  <text
                    x={angleGameTarget.p2.x + 14}
                    y={angleGameTarget.p2.y - 8}
                    fill="#0369a1"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    B
                  </text>
                </g>
              )}

              {/* Empty State Hint */}
              {points.length === 0 && objects.length === 0 && angles.length === 0 && polygons.length === 0 && !isMotif1Active && !isMotif2Active && !isAngleGameActive && (
                <g className="pointer-events-none">
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    ✨ İstasyon araçlarından birini seçip tahtaya tıklayarak geometrik çizim yapınız.
                  </text>
                </g>
              )}

              {/* 1. Snap Candidate Visual Highlight (Nokta & Izgara Mıknatısı) */}
              {snapCandidate && (
                <g className="pointer-events-none">
                  {snapCandidate.isPoint ? (
                    <>
                      <circle
                        cx={snapCandidate.x}
                        cy={snapCandidate.y}
                        r="18"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2.5"
                        strokeDasharray="4,3"
                        className="animate-spin"
                      />
                      {snapCandidate.label && (
                        <g transform={`translate(${snapCandidate.x}, ${snapCandidate.y - 24})`}>
                          <rect x="-42" y="-12" width="84" height="20" rx="6" fill="#0f172a" stroke="#f97316" strokeWidth="1" />
                          <text x="0" y="2" textAnchor="middle" fill="#fdba74" fontSize="9.5" fontWeight="bold">
                            🧲 {snapCandidate.label} Noktası
                          </text>
                        </g>
                      )}
                    </>
                  ) : (
                    <>
                      <circle
                        cx={snapCandidate.x}
                        cy={snapCandidate.y}
                        r="11"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="2"
                        strokeDasharray="3,3"
                        className="animate-pulse"
                      />
                      <line x1={snapCandidate.x - 7} y1={snapCandidate.y} x2={snapCandidate.x + 7} y2={snapCandidate.y} stroke="#0284c7" strokeWidth="1.5" />
                      <line x1={snapCandidate.x} y1={snapCandidate.y - 7} x2={snapCandidate.x} y2={snapCandidate.y + 7} stroke="#0284c7" strokeWidth="1.5" />
                    </>
                  )}
                </g>
              )}

              {/* 2. Render Polygons (GeoGebra Çokgenler, Canlı Kenar Ölçüleri, Çevre & Gauss Alan) */}
              {polygons.map((poly) => {
                const polyPoints = poly.points.map((p) => points.find((pt) => pt.id === p.id) || p);
                const pointsString = polyPoints.map((p) => `${p.x},${p.y}`).join(' ');

                // Centroid calculation for the polygon label and area badge
                const centroidX = Math.round(polyPoints.reduce((acc, p) => acc + p.x, 0) / polyPoints.length);
                const centroidY = Math.round(polyPoints.reduce((acc, p) => acc + p.y, 0) / polyPoints.length);

                return (
                  <g
                    key={poly.id}
                    className={`animate-in fade-in duration-200 ${activeTool === 'eraser' ? 'cursor-pointer hover:opacity-50 transition-opacity' : ''}`}
                    onClick={(e) => {
                      if (activeTool === 'eraser') {
                        e.stopPropagation();
                        deletePolygon(poly.id);
                        playSound('click');
                        setFeedbackMsg(`🗑️ ${poly.label} çokgeni silindi.`);
                      }
                    }}
                  >
                    {/* Translucent Polygon Fill & Outline */}
                    <polygon
                      points={pointsString}
                      fill={poly.color}
                      fillOpacity={poly.fillOpacity || 0.22}
                      stroke={poly.color}
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />

                    {/* Edge Length Badges */}
                    {!poly.hideLabel &&
                      polyPoints.map((ptA, i) => {
                        const ptB = polyPoints[(i + 1) % polyPoints.length];
                        const edgeLenPix = Math.hypot(ptB.x - ptA.x, ptB.y - ptA.y);
                        const edgeLenCm = Math.round((edgeLenPix / 30) * 10) / 10;
                        const midX = (ptA.x + ptB.x) / 2;
                        const midY = (ptA.y + ptB.y) / 2;

                        return (
                          <g key={`edge-${poly.id}-${i}`} transform={`translate(${midX}, ${midY})`} className="pointer-events-none">
                            <rect x="-32" y="-10" width="64" height="18" rx="5" fill="#0f172a" stroke={poly.color} strokeWidth="1" />
                            <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                              |{ptA.label}{ptB.label}|={edgeLenCm}
                            </text>
                          </g>
                        );
                      })}

                    {/* Centroid Badge: Label, Perimeter & Area */}
                    {!poly.hideLabel && (
                      <g transform={`translate(${centroidX}, ${centroidY})`} className="cursor-pointer">
                        <rect
                          x="-70"
                          y="-22"
                          width="140"
                          height="44"
                          rx="10"
                          fill="#0f172a"
                          stroke={poly.color}
                          strokeWidth="2"
                          className="drop-shadow-lg"
                        />
                        <text x="0" y="-6" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="900">
                          {poly.label}
                        </text>
                        <text x="0" y="7" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                          Ç = {poly.perimeter} cm
                        </text>
                        <text x="0" y="18" textAnchor="middle" fill="#4ade80" fontSize="9.5" fontWeight="black">
                          Alan = {poly.area} cm²
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* 3. Render Polygon Draft (Çokgen Çizim Aşaması & Kapatma Hedefi) */}
              {polygonDraft.length > 0 && (
                <g className="pointer-events-none">
                  {/* Draft Edges */}
                  {polygonDraft.map((pt, i) => {
                    if (i === 0) return null;
                    const prevPt = polygonDraft[i - 1];
                    return (
                      <line
                        key={`draft-line-${i}`}
                        x1={prevPt.x}
                        y1={prevPt.y}
                        x2={pt.x}
                        y2={pt.y}
                        stroke={activeColor}
                        strokeWidth="3"
                        strokeDasharray="5,3"
                      />
                    );
                  })}

                  {/* Stretch Line to Cursor / HoverPos */}
                  {hoverPos && polygonDraft.length > 0 && (
                    <line
                      x1={polygonDraft[polygonDraft.length - 1].x}
                      y1={polygonDraft[polygonDraft.length - 1].y}
                      x2={hoverPos.x}
                      y2={hoverPos.y}
                      stroke={activeColor}
                      strokeWidth="2.5"
                      strokeDasharray="4,4"
                      className="animate-pulse"
                    />
                  )}

                  {/* Closing Target Indicator on 1st Point when 3+ vertices */}
                  {polygonDraft.length >= 3 && (
                    <g
                      transform={`translate(${polygonDraft[0].x}, ${polygonDraft[0].y})`}
                      className="cursor-pointer pointer-events-auto"
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        closePolygonDraft();
                      }}
                    >
                      <circle cx="0" cy="0" r="28" fill="#10b396" fillOpacity="0.2" stroke="#10b396" strokeWidth="3" strokeDasharray="5,3" className="animate-spin" />
                      <circle cx="0" cy="0" r="14" fill="#10b396" fillOpacity="0.4" />
                      <g transform="translate(0, -32)">
                        <rect x="-52" y="-14" width="104" height="26" rx="8" fill="#064e3b" stroke="#34d399" strokeWidth="2" className="shadow-lg" />
                        <text x="0" y="3" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="900">
                          Kapat 🎯 ({polygonDraft[0].label})
                        </text>
                      </g>
                    </g>
                  )}
                </g>
              )}

              {/* Connecting line / compass radius preview */}
              {selectedPointForLink && hoverPos && (
                <g className="pointer-events-none">
                  <line
                    x1={selectedPointForLink.x}
                    y1={selectedPointForLink.y}
                    x2={hoverPos.x}
                    y2={hoverPos.y}
                    stroke={activeColor}
                    strokeWidth="3.5"
                    strokeDasharray="6,4"
                    className="animate-pulse"
                  />
                  {/* Endpoint Preview Circle */}
                  <circle cx={hoverPos.x} cy={hoverPos.y} r="6" fill={activeColor} fillOpacity="0.4" stroke={activeColor} strokeWidth="2" />

                  {/* Dynamic Ray Arrow Preview if activeTool is ray */}
                  {activeTool === 'ray' && (() => {
                    const dx = hoverPos.x - selectedPointForLink.x;
                    const dy = hoverPos.y - selectedPointForLink.y;
                    const ang = Math.atan2(dy, dx);
                    const tipX = hoverPos.x;
                    const tipY = hoverPos.y;
                    const aLen = 14;
                    const aW = 7;
                    const lX = tipX - aLen * Math.cos(ang) - aW * Math.sin(ang);
                    const lY = tipY - aLen * Math.sin(ang) + aW * Math.cos(ang);
                    const rX = tipX - aLen * Math.cos(ang) + aW * Math.sin(ang);
                    const rY = tipY - aLen * Math.sin(ang) - aW * Math.cos(ang);
                    return <polygon points={`${tipX},${tipY} ${lX},${lY} ${rX},${rY}`} fill={activeColor} />;
                  })()}
                </g>
              )}
              {compassCenterPoint && hoverPos && (
                <g>
                  <circle
                    cx={compassCenterPoint.x}
                    cy={compassCenterPoint.y}
                    r={Math.round(Math.sqrt((hoverPos.x - compassCenterPoint.x) ** 2 + (hoverPos.y - compassCenterPoint.y) ** 2)) || 10}
                    fill="none"
                    stroke={activeColor}
                    strokeWidth="2"
                    strokeDasharray="5,4"
                    className="animate-pulse"
                  />
                  <line
                    x1={compassCenterPoint.x}
                    y1={compassCenterPoint.y}
                    x2={hoverPos.x}
                    y2={hoverPos.y}
                    stroke={activeColor}
                    strokeWidth="2"
                  />
                </g>
              )}

              {/* Measure Angle Draft Visual Overlay */}
              {activeTool === 'measure-angle' && measureAnglePoints.length > 0 && (
                <g className="pointer-events-none">
                  {/* Point 1: 1. Kol Indicator */}
                  {measureAnglePoints[0] && (
                    <g transform={`translate(${measureAnglePoints[0].x}, ${measureAnglePoints[0].y})`}>
                      <circle cx="0" cy="0" r="16" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="4,3" className="animate-spin" />
                      <g transform="translate(0, -26)">
                        <rect x="-38" y="-11" width="76" height="20" rx="6" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
                        <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
                          1. Kol ({measureAnglePoints[0].label})
                        </text>
                      </g>
                    </g>
                  )}

                  {/* Point 2: Köşe Indicator */}
                  {measureAnglePoints[1] && (
                    <g transform={`translate(${measureAnglePoints[1].x}, ${measureAnglePoints[1].y})`}>
                      <circle cx="0" cy="0" r="20" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="3" className="animate-pulse" />
                      <circle cx="0" cy="0" r="5" fill="#f59e0b" />
                      <g transform="translate(0, -28)">
                        <rect x="-44" y="-12" width="88" height="22" rx="7" fill="#b45309" stroke="#fcd34d" strokeWidth="1.5" />
                        <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">
                          Köşe 📍 ({measureAnglePoints[1].label})
                        </text>
                      </g>
                    </g>
                  )}

                  {/* Arm line from Vertex to Kol 1 */}
                  {measureAnglePoints.length >= 2 && (
                    <line
                      x1={measureAnglePoints[1].x}
                      y1={measureAnglePoints[1].y}
                      x2={measureAnglePoints[0].x}
                      y2={measureAnglePoints[0].y}
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      strokeDasharray="4,4"
                    />
                  )}

                  {/* Stretch Line from Vertex to Cursor / HoverPos */}
                  {measureAnglePoints.length === 2 && hoverPos && (
                    <>
                      <line
                        x1={measureAnglePoints[1].x}
                        y1={measureAnglePoints[1].y}
                        x2={hoverPos.x}
                        y2={hoverPos.y}
                        stroke="#10b396"
                        strokeWidth="2.5"
                        strokeDasharray="4,4"
                        className="animate-pulse"
                      />
                      {(() => {
                        const v = measureAnglePoints[1];
                        const p1 = measureAnglePoints[0];
                        const liveDeg = getAngleDegree(v, p1, hoverPos);
                        const typeInfo = getAngleType(liveDeg);
                        return (
                          <g transform={`translate(${hoverPos.x + 18}, ${hoverPos.y - 18})`}>
                            <rect x="-6" y="-14" width="84" height="24" rx="7" fill="#0f172a" stroke={typeInfo.color} strokeWidth="1.5" className="shadow-lg" />
                            <text x="36" y="2" textAnchor="middle" fill={typeInfo.color} fontSize="11" fontWeight="900">
                              ~{liveDeg}°
                            </text>
                          </g>
                        );
                      })()}
                    </>
                  )}
                </g>
              )}

              {/* Three-Point Angle Creation Visual Overlay */}
              {activeTool === 'three-point-angle' && threePointAnglePoints.length > 0 && (
                <g className="pointer-events-none">
                  {/* Point 1 (Arm 1) indicator */}
                  {threePointAnglePoints[0] && (
                    <g transform={`translate(${threePointAnglePoints[0].x}, ${threePointAnglePoints[0].y})`}>
                      <circle cx="0" cy="0" r="18" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="4,3" className="animate-spin" />
                      <circle cx="0" cy="0" r="6" fill="#0284c7" />
                      <g transform="translate(0, -26)">
                        <rect x="-44" y="-11" width="88" height="20" rx="6" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
                        <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
                          1. Kol ({threePointAnglePoints[0].label})
                        </text>
                      </g>
                    </g>
                  )}

                  {/* Stretch Line from Arm 1 to Cursor if selecting vertex */}
                  {threePointAnglePoints.length === 1 && hoverPos && (
                    <line
                      x1={threePointAnglePoints[0].x}
                      y1={threePointAnglePoints[0].y}
                      x2={hoverPos.x}
                      y2={hoverPos.y}
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      strokeDasharray="4,4"
                      className="animate-pulse"
                    />
                  )}

                  {/* Point 2 (Vertex) indicator */}
                  {threePointAnglePoints[1] && (
                    <g transform={`translate(${threePointAnglePoints[1].x}, ${threePointAnglePoints[1].y})`}>
                      <circle cx="0" cy="0" r="22" fill="none" stroke="#f59e0b" strokeWidth="3" className="animate-pulse" />
                      <circle cx="0" cy="0" r="7" fill="#f59e0b" />
                      <g transform="translate(0, -28)">
                        <rect x="-44" y="-11" width="88" height="20" rx="6" fill="#b45309" stroke="#fbbf24" strokeWidth="1" />
                        <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="black">
                          Köşe 📍 ({threePointAnglePoints[1].label})
                        </text>
                      </g>
                    </g>
                  )}

                  {/* Stretch Line from Vertex to Cursor if selecting arm 2 */}
                  {threePointAnglePoints.length === 2 && hoverPos && (
                    <>
                      <line
                        x1={threePointAnglePoints[1].x}
                        y1={threePointAnglePoints[1].y}
                        x2={hoverPos.x}
                        y2={hoverPos.y}
                        stroke="#10b396"
                        strokeWidth="2.5"
                        strokeDasharray="4,4"
                        className="animate-pulse"
                      />
                      {(() => {
                        const v = threePointAnglePoints[1];
                        const p1 = threePointAnglePoints[0];
                        const liveDeg = getAngleDegree(v, p1, hoverPos);
                        const typeInfo = getAngleType(liveDeg);
                        return (
                          <g transform={`translate(${hoverPos.x + 18}, ${hoverPos.y - 18})`}>
                            <rect x="-6" y="-14" width="84" height="24" rx="7" fill="#0f172a" stroke={typeInfo.color} strokeWidth="1.5" className="shadow-lg" />
                            <text x="36" y="2" textAnchor="middle" fill={typeInfo.color} fontSize="11" fontWeight="900">
                              ~{liveDeg}°
                            </text>
                          </g>
                        );
                      })()}
                    </>
                  )}
                </g>
              )}

              {/* Measure Length Draft Visual Overlay */}
              {activeTool === 'measure-length' && measureLengthPoints.length > 0 && (
                <g className="pointer-events-none">
                  {measureLengthPoints[0] && (
                    <g transform={`translate(${measureLengthPoints[0].x}, ${measureLengthPoints[0].y})`}>
                      <circle cx="0" cy="0" r="18" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="4,3" className="animate-spin" />
                      <circle cx="0" cy="0" r="6" fill="#0284c7" />
                      <g transform="translate(0, -26)">
                        <rect x="-42" y="-11" width="84" height="20" rx="6" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
                        <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
                          1. Nokta ({measureLengthPoints[0].label})
                        </text>
                      </g>
                    </g>
                  )}

                  {measureLengthPoints.length === 1 && hoverPos && (
                    <>
                      <line
                        x1={measureLengthPoints[0].x}
                        y1={measureLengthPoints[0].y}
                        x2={hoverPos.x}
                        y2={hoverPos.y}
                        stroke="#0284c7"
                        strokeWidth="2.5"
                        strokeDasharray="4,4"
                        className="animate-pulse"
                      />
                      {(() => {
                        const p1 = measureLengthPoints[0];
                        const dx = hoverPos.x - p1.x;
                        const dy = hoverPos.y - p1.y;
                        const pixelLen = Math.hypot(dx, dy);
                        const liveCm = Math.round((pixelLen / GRID_SIZE) * 10) / 10;
                        const midX = (p1.x + hoverPos.x) / 2;
                        const midY = (p1.y + hoverPos.y) / 2;
                        return (
                          <g transform={`translate(${midX}, ${midY - 14})`}>
                            <rect x="-50" y="-12" width="100" height="24" rx="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" className="shadow-lg" />
                            <text x="0" y="3" textAnchor="middle" fill="#38bdf8" fontSize="10.5" fontWeight="900">
                              |{p1.label}...| = ~{liveCm} cm
                            </text>
                          </g>
                        );
                      })()}
                    </>
                  )}
                </g>
              )}

              {/* Render Angles */}
              {angles.map((ang) => renderAngleVisual(ang))}

              {/* Render Geometric Objects */}
              {objects.map((obj) => {
                const p1 = points.find((p) => p.id === obj.p1.id) || obj.p1;
                const p2 = obj.p2 ? (points.find((p) => p.id === obj.p2?.id) || obj.p2) : undefined;
                const { type, color, id, length, symbol } = obj;

                const eraserProps = activeTool === 'eraser' ? {
                  className: "cursor-pointer hover:opacity-50 transition-opacity",
                  onClick: (e: React.MouseEvent) => {
                    e.stopPropagation();
                    deleteObject(id);
                    playSound('click');
                    setFeedbackMsg(`🗑️ ${obj.label || obj.symbol || 'Geometrik nesne'} silindi.`);
                  }
                } : {};

                // 1. SEGMENT: Two closed boundary dots + length badge
                if (type === 'segment' && p2) {
                  const dx = p2.x - p1.x;
                  const dy = p2.y - p1.y;
                  const len = Math.hypot(dx, dy) || 1;
                  const currentCm = Math.round((len / 30) * 10) / 10;
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;

                  return (
                    <g key={id} {...eraserProps}>
                      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth="4.5" strokeLinecap="round" />
                      <circle cx={p1.x} cy={p1.y} r="5.5" fill={color} stroke="#ffffff" strokeWidth="2" />
                      <circle cx={p2.x} cy={p2.y} r="5.5" fill={color} stroke="#ffffff" strokeWidth="2" />
                      {(!obj.hideLength || !obj.hideLabel) && (
                        <g transform={`translate(${midX}, ${midY - 14})`}>
                          <rect x="-46" y="-12" width="92" height="22" rx="6" fill="#0f172a" stroke={color} strokeWidth="1.5" />
                          <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                            {!obj.hideLabel && !obj.hideLength
                              ? `|${p1.label}${p2.label}| = ${currentCm} cm`
                              : !obj.hideLabel
                              ? `[${p1.label}${p2.label}]`
                              : `${currentCm} cm`}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                }

                // 2. RAY: Closed start point + One directional arrow
                if (type === 'ray' && p2) {
                  const dx = p2.x - p1.x;
                  const dy = p2.y - p1.y;
                  const len = Math.sqrt(dx * dx + dy * dy) || 1;
                  const angle = Math.atan2(dy, dx);
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;
                  const extLen = len + 40;
                  const extX = p1.x + (dx / len) * extLen;
                  const extY = p1.y + (dy / len) * extLen;

                  const arrowLen = 14;
                  const arrowWidth = 7;
                  const tipX = extX;
                  const tipY = extY;
                  const leftX = tipX - arrowLen * Math.cos(angle) - arrowWidth * Math.sin(angle);
                  const leftY = tipY - arrowLen * Math.sin(angle) + arrowWidth * Math.cos(angle);
                  const rightX = tipX - arrowLen * Math.cos(angle) + arrowWidth * Math.sin(angle);
                  const rightY = tipY - arrowLen * Math.sin(angle) - arrowWidth * Math.cos(angle);

                  return (
                    <g key={id} {...eraserProps}>
                      <line x1={p1.x} y1={p1.y} x2={extX} y2={extY} stroke={color} strokeWidth="4.5" strokeLinecap="round" />
                      <polygon points={`${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`} fill={color} />
                      <circle cx={p1.x} cy={p1.y} r="6.5" fill={color} stroke="#ffffff" strokeWidth="2" />
                      {!obj.hideLabel && (
                        <g transform={`translate(${midX}, ${midY - 14})`}>
                          <rect x="-30" y="-12" width="60" height="22" rx="6" fill="#0f172a" stroke={color} strokeWidth="1.5" />
                          <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                            [{p1.label}{p2.label}&gt;
                          </text>
                        </g>
                      )}
                    </g>
                  );
                }

                // 3. LINE: Double arrows on both sides
                if (type === 'line' && p2) {
                  const dx = p2.x - p1.x;
                  const dy = p2.y - p1.y;
                  const len = Math.sqrt(dx * dx + dy * dy) || 1;
                  const angle = Math.atan2(dy, dx);
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;

                  const ext1X = p1.x - (dx / len) * 45;
                  const ext1Y = p1.y - (dy / len) * 45;
                  const ext2X = p2.x + (dx / len) * 45;
                  const ext2Y = p2.y + (dy / len) * 45;

                  const arrowLen = 13;
                  const arrowWidth = 6.5;

                  const tip2X = ext2X;
                  const tip2Y = ext2Y;
                  const left2X = tip2X - arrowLen * Math.cos(angle) - arrowWidth * Math.sin(angle);
                  const left2Y = tip2Y - arrowLen * Math.sin(angle) + arrowWidth * Math.cos(angle);
                  const right2X = tip2X - arrowLen * Math.cos(angle) + arrowWidth * Math.sin(angle);
                  const right2Y = tip2Y - arrowLen * Math.sin(angle) - arrowWidth * Math.cos(angle);

                  const oppAngle = angle + Math.PI;
                  const tip1X = ext1X;
                  const tip1Y = ext1Y;
                  const left1X = tip1X - arrowLen * Math.cos(oppAngle) - arrowWidth * Math.sin(oppAngle);
                  const left1Y = tip1Y - arrowLen * Math.sin(oppAngle) + arrowWidth * Math.cos(oppAngle);
                  const right1X = tip1X - arrowLen * Math.cos(oppAngle) + arrowWidth * Math.sin(oppAngle);
                  const right1Y = tip1Y - arrowLen * Math.sin(oppAngle) - arrowWidth * Math.cos(oppAngle);

                  return (
                    <g key={id} {...eraserProps}>
                      <line x1={ext1X} y1={ext1Y} x2={ext2X} y2={ext2Y} stroke={color} strokeWidth="4.5" strokeLinecap="round" />
                      <polygon points={`${tip2X},${tip2Y} ${left2X},${left2Y} ${right2X},${right2Y}`} fill={color} />
                      <polygon points={`${tip1X},${tip1Y} ${left1X},${left1Y} ${right1X},${right1Y}`} fill={color} />
                      {!obj.hideLabel && (
                        <g transform={`translate(${midX}, ${midY - 14})`}>
                          <rect x="-24" y="-12" width="48" height="22" rx="6" fill="#0f172a" stroke={color} strokeWidth="1.5" />
                          <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                            {p1.label}{p2.label}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                }

                // 4. CIRCLE: Compass circle with center M, radius line r, diameter R
                if (type === 'circle') {
                  const rad = p2 ? Math.round(Math.hypot(p2.x - p1.x, p2.y - p1.y)) : (obj.radius || 60);
                  const rCm = Math.round((rad / GRID_SIZE) * 10) / 10;
                  const dCm = Math.round(rCm * 2 * 10) / 10;

                  return (
                    <g key={id} {...eraserProps}>
                      {obj.isDisk && (
                        <circle cx={p1.x} cy={p1.y} r={rad} fill={color} fillOpacity="0.2" />
                      )}
                      <circle cx={p1.x} cy={p1.y} r={rad} fill="none" stroke={color} strokeWidth="3.5" />
                      {/* Radius line r & measurement text */}
                      {!obj.hideLength && (
                        <>
                          <line x1={p1.x} y1={p1.y} x2={p1.x + rad} y2={p1.y} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4,2" />
                          <circle cx={p1.x + rad} cy={p1.y} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                          <text x={p1.x + rad / 2} y={p1.y - 6} fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
                            r = {rCm} cm
                          </text>
                        </>
                      )}
                      {/* Center dot */}
                      <circle cx={p1.x} cy={p1.y} r="5" fill={color} stroke="#ffffff" strokeWidth="2" />
                      {!obj.hideLabel && (
                        <>
                          <text x={p1.x} y={p1.y + 16} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                            {p1.label} (Merkez)
                          </text>
                          {/* Badge */}
                          <g transform={`translate(${p1.x}, ${p1.y - rad - 14})`}>
                            <rect x="-65" y="-12" width="130" height="24" rx="6" fill="#0f172a" stroke={color} strokeWidth="1.2" />
                            <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                              ⭕ Çember (R = {dCm} cm)
                            </text>
                          </g>
                        </>
                      )}
                    </g>
                  );
                }

                // 5. PERPENDICULAR: Point dropped to line with 90° right angle mark
                if (type === 'perpendicular' && p2) {
                  // Find the baseline this perpendicular was dropped to
                  const baseLine =
                    (obj.baseLineId && objects.find((o) => o.id === obj.baseLineId)) ||
                    objects.find(
                      (o) =>
                        o.id !== id &&
                        o.p2 &&
                        (o.type === 'line' || o.type === 'segment' || o.type === 'ray') &&
                        (() => {
                          const bp1 = points.find((p) => p.id === o.p1.id) || o.p1;
                          const bp2 = points.find((p) => p.id === o.p2!.id) || o.p2!;
                          const dx = bp2.x - bp1.x;
                          const dy = bp2.y - bp1.y;
                          const len = Math.hypot(dx, dy);
                          if (len < 1) return false;
                          const dist = Math.abs((p2.x - bp1.x) * dy - (p2.y - bp1.y) * dx) / len;
                          return dist <= 20;
                        })()
                    );

                  // Calculate current angle between perpendicular [p2 -> p1] and baseline
                  let isRightAngle = false;
                  let baseDirX = 1;
                  let baseDirY = 0;
                  const pdx = p1.x - p2.x;
                  const pdy = p1.y - p2.y;
                  const plen = Math.hypot(pdx, pdy) || 1;
                  const perpUnitX = pdx / plen;
                  const perpUnitY = pdy / plen;

                  if (baseLine && baseLine.p2) {
                    const bp1 = points.find((p) => p.id === baseLine.p1.id) || baseLine.p1;
                    const bp2 = points.find((p) => p.id === baseLine.p2!.id) || baseLine.p2!;
                    const bdx = bp2.x - bp1.x;
                    const bdy = bp2.y - bp1.y;
                    const blen = Math.hypot(bdx, bdy) || 1;
                    baseDirX = bdx / blen;
                    baseDirY = bdy / blen;

                    // Dot product: cos(theta) = dot / (blen * plen)
                    const dot = (bdx * pdx + bdy * pdy) / (blen * plen);
                    // If perpendicular, dot product is ~0 (dot <= 0.05 corresponds to approx 87° to 93°)
                    if (Math.abs(dot) <= 0.05) {
                      isRightAngle = true;
                    }
                  } else {
                    // Check if there is an angle in angles for this vertex and arm
                    const relAngle = angles.find(
                      (ang) => ang.vertex.id === p2.id && (ang.p1.id === p1.id || ang.p2.id === p1.id)
                    );
                    if (relAngle) {
                      const v = points.find((p) => p.id === relAngle.vertex.id) || relAngle.vertex;
                      const ap1 = points.find((p) => p.id === relAngle.p1.id) || relAngle.p1;
                      const ap2 = points.find((p) => p.id === relAngle.p2.id) || relAngle.p2;
                      const liveDeg = getAngleDegree(v, ap1, ap2);
                      if (liveDeg === 90) {
                        isRightAngle = true;
                        const adx = (relAngle.p1.id === p1.id ? ap2.x : ap1.x) - v.x;
                        const ady = (relAngle.p1.id === p1.id ? ap2.y : ap1.y) - v.y;
                        const alen = Math.hypot(adx, ady) || 1;
                        baseDirX = adx / alen;
                        baseDirY = ady / alen;
                      }
                    } else {
                      // Standalone: if vertical (|p1.x - p2.x| <= 3), it's 90° to horizontal
                      if (Math.abs(p1.x - p2.x) <= 3 && Math.abs(p1.y - p2.y) > 5) {
                        isRightAngle = true;
                        baseDirX = 1;
                        baseDirY = 0;
                      }
                    }
                  }

                  // Check if angles already has a visual angle for this foot H
                  const hasAngleVisualInAngles = angles.some(
                    (ang) => ang.vertex.id === p2.id && (ang.p1.id === p1.id || ang.p2.id === p1.id)
                  );

                  // Calculate square corners oriented along baseline and perpendicular
                  const sqSize = 16;
                  const bSign = (baseDirX * perpUnitY - baseDirY * perpUnitX) >= 0 ? 1 : -1;
                  const effBaseX = baseDirX * bSign;
                  const effBaseY = baseDirY * bSign;

                  const ptA = { x: p2.x + sqSize * effBaseX, y: p2.y + sqSize * effBaseY };
                  const ptB = { x: p2.x + sqSize * perpUnitX, y: p2.y + sqSize * perpUnitY };
                  const pCorner = {
                    x: p2.x + sqSize * effBaseX + sqSize * perpUnitX,
                    y: p2.y + sqSize * effBaseY + sqSize * perpUnitY
                  };
                  const dotCenter = {
                    x: p2.x + (sqSize / 2) * (effBaseX + perpUnitX),
                    y: p2.y + (sqSize / 2) * (effBaseY + perpUnitY)
                  };

                  const currentDistCm = Math.round((plen / GRID_SIZE) * 10) / 10;
                  const lineName = baseLine ? baseLine.symbol : 'd';

                  return (
                    <g key={id} {...eraserProps}>
                      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth="4" strokeLinecap="round" />
                      <circle cx={p1.x} cy={p1.y} r="6" fill={color} stroke="#ffffff" strokeWidth="2" />
                      <circle cx={p2.x} cy={p2.y} r="6" fill="#10b396" stroke="#ffffff" strokeWidth="2" />
                      {/* 90° Square symbol at foot H - SADECE AÇI 90° İSE GÖRÜNÜR */}
                      {isRightAngle && !hasAngleVisualInAngles && (
                        <g>
                          <polygon
                            points={`${p2.x},${p2.y} ${ptA.x},${ptA.y} ${pCorner.x},${pCorner.y} ${ptB.x},${ptB.y}`}
                            fill="#10b981"
                            fillOpacity="0.25"
                            stroke="#059669"
                            strokeWidth="1.8"
                          />
                          <circle cx={dotCenter.x} cy={dotCenter.y} r="2.5" fill="#059669" />
                        </g>
                      )}
                      {/* Shortest distance badge */}
                      {(!obj.hideLength || !obj.hideLabel) && (
                        <g transform={`translate(${p1.x + 50}, ${(p1.y + p2.y) / 2})`}>
                          <rect x="-48" y="-12" width="96" height="24" rx="6" fill="#0f172a" stroke={color} strokeWidth="1.2" />
                          <text x="0" y="4" textAnchor="middle" fill="#fb7185" fontSize="10" fontWeight="bold">
                            {isRightAngle
                              ? (!obj.hideLabel && !obj.hideLength
                                ? `|${p1.label}${p2.label}| ⊥ ${lineName} (${currentDistCm} cm)`
                                : !obj.hideLabel
                                ? `|${p1.label}${p2.label}| ⊥ ${lineName}`
                                : `${currentDistCm} cm`)
                              : `${p1.label}${p2.label} (${currentDistCm} cm)`}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                }

                // 6. ART MOTIF: Seljuk Star & Tile Pattern
                if (type === 'art-motif') {
                  const rad = obj.radius || 65;
                  return (
                    <g key={id} transform={`translate(${p1.x}, ${p1.y})`} {...eraserProps}>
                      <circle cx="0" cy="0" r={rad} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
                      <circle cx="0" cy="0" r={rad * 0.7} fill="none" stroke="#94a3b8" strokeWidth="1" />
                      <rect x={-rad * 0.55} y={-rad * 0.55} width={rad * 1.1} height={rad * 1.1} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                      <rect x={-rad * 0.55} y={-rad * 0.55} width={rad * 1.1} height={rad * 1.1} fill="none" stroke="#10b396" strokeWidth="2.5" transform="rotate(45)" />
                      <circle cx="0" cy="0" r="7" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
                      {!obj.hideLabel && (
                        <g transform={`translate(0, ${rad + 16})`}>
                          <rect x="-65" y="-10" width="130" height="20" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
                          <text x="0" y="4" textAnchor="middle" fill="#fde047" fontSize="9.5" fontWeight="bold">
                            🎨 Selçuklu Çinisi [D7.1]
                          </text>
                        </g>
                      )}
                    </g>
                  );
                }

                // 7. DISTANCE MEASUREMENT: Dimension line with end ticks + |AB| = X cm badge
                if (type === 'distance' && p2) {
                  const dx = p2.x - p1.x;
                  const dy = p2.y - p1.y;
                  const len = Math.hypot(dx, dy) || 1;
                  const currentCm = Math.round((len / GRID_SIZE) * 10) / 10;
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;

                  // Normal vector for end ticks
                  const nx = -dy / len;
                  const ny = dx / len;
                  const tickLen = 9;

                  return (
                    <g key={id} className={`transition-all duration-150 ${activeTool === 'eraser' ? 'cursor-pointer hover:opacity-50' : ''}`} onClick={eraserProps.onClick}>
                      {/* Dimension guide line */}
                      <line
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke={color || '#0284c7'}
                        strokeWidth="3"
                        strokeDasharray="5,3"
                      />
                      {/* End tick 1 */}
                      <line
                        x1={p1.x - nx * tickLen}
                        y1={p1.y - ny * tickLen}
                        x2={p1.x + nx * tickLen}
                        y2={p1.y + ny * tickLen}
                        stroke={color || '#0284c7'}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* End tick 2 */}
                      <line
                        x1={p2.x - nx * tickLen}
                        y1={p2.y - ny * tickLen}
                        x2={p2.x + nx * tickLen}
                        y2={p2.y + ny * tickLen}
                        stroke={color || '#0284c7'}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* End point markers */}
                      <circle cx={p1.x} cy={p1.y} r="5" fill={color || '#0284c7'} stroke="#ffffff" strokeWidth="2" />
                      <circle cx={p2.x} cy={p2.y} r="5" fill={color || '#0284c7'} stroke="#ffffff" strokeWidth="2" />

                      {/* Dimension Badge: |AB| = 12 cm */}
                      {(!obj.hideLength || !obj.hideLabel) && (
                        <g transform={`translate(${midX}, ${midY - 14})`}>
                          <rect
                            x="-56"
                            y="-13"
                            width="112"
                            height="26"
                            rx="8"
                            fill="#0f172a"
                            stroke={color || '#38bdf8'}
                            strokeWidth="2"
                            className="shadow-md"
                          />
                          <text
                            x="0"
                            y="4"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="bold"
                            letterSpacing="0.5"
                          >
                            {!obj.hideLabel && !obj.hideLength
                              ? `|${p1.label}${p2.label}| = ${currentCm} cm`
                              : !obj.hideLabel
                              ? `|${p1.label}${p2.label}|`
                              : `${currentCm} cm`}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                }

                return null;
              })}

              {/* Render Points */}
              {points.map((pt) => {
                const isSelected = selectedPointForLink?.id === pt.id;
                const isDragging = draggingPointId === pt.id;
                const isFirstPolyPoint = polygonDraft.length >= 3 && polygonDraft[0].id === pt.id;

                return (
                  <g
                    key={pt.id}
                    className={`${activeTool === 'eraser' ? 'cursor-pointer hover:opacity-50 transition-opacity' : activeTool === 'drag' ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} select-none`}
                    onPointerDown={(e) => {
                      if (activeTool === 'eraser') {
                        e.stopPropagation();
                        deletePoint(pt.id);
                        playSound('click');
                        setFeedbackMsg(`🗑️ ${pt.label} noktası ve bağlı şekiller silindi.`);
                        return;
                      }

                      if (activeTool === 'drag') {
                        e.stopPropagation();
                        try {
                          (e.currentTarget as SVGElement)?.setPointerCapture?.(e.pointerId);
                        } catch {}
                        setDraggingPointId(pt.id);
                        playSound('click');
                        return;
                      }

                      // If activeTool is polygon and this is the first vertex with >=3 vertices, close the polygon immediately!
                      if (activeTool === 'polygon' && polygonDraft.length >= 3 && polygonDraft[0].id === pt.id) {
                        e.stopPropagation();
                        closePolygonDraft();
                        return;
                      }

                      // Otherwise, DO NOT stopPropagation and DO NOT drag!
                      // Event bubbles naturally to <svg onPointerDown> so active tools (polygon, segment, angle, compass) receive hitPoint correctly.
                    }}
                    onPointerUp={(e) => {
                      if (activeTool === 'drag') {
                        e.stopPropagation();
                        try {
                          (e.currentTarget as SVGElement)?.releasePointerCapture?.(e.pointerId);
                        } catch {}
                        setDraggingPointId(null);
                      }
                    }}
                  >
                    {/* Active Link selection ring */}
                    {isSelected && (
                      <circle cx={pt.x} cy={pt.y} r="16" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="animate-pulse" />
                    )}

                    {/* Dragging glow halo */}
                    {isDragging && (
                      <circle cx={pt.x} cy={pt.y} r="15" fill={pt.color} fillOpacity="0.25" stroke={pt.color} strokeWidth="2" strokeDasharray="3,3" />
                    )}

                    {/* Invisible Large Hit Target (40px) for Touch / Smart Board */}
                    <circle cx={pt.x} cy={pt.y} r="20" fill="transparent" />

                    {/* Point Circle (Completely stable, NO CSS transform/scale jumping) */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="8"
                      fill={pt.color}
                      stroke="#ffffff"
                      strokeWidth={isDragging ? '3.5' : '2.5'}
                    />

                    {/* Point Label */}
                    {!pt.hideLabel && (
                      <text
                        x={pt.x}
                        y={pt.y - 13}
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="13"
                        fontWeight="900"
                        className="pointer-events-none select-none drop-shadow-xs"
                      >
                        {pt.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* İnteraktif İletki (Açıölçer) Aracı */}
              {renderInteractiveProtractor()}

              {/* İnteraktif Gönye (Dik Üçgen Cetveli) Aracı */}
              {renderInteractiveSetSquare()}
            </svg>

            {/* Motif 1: Tamamlama & Kutlama Kartı (Türk-İslam Selçuklu Sanatı) */}
            {isMotif1Active && motifCelebrated && (
              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-30 animate-in fade-in zoom-in-95 duration-300">
                <div className="max-w-md w-full bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-2xl space-y-4 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-white flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30 animate-bounce">
                    ⭐
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      Maarif Modeli [D7.1] Kültürel Miras
                    </span>
                    <h3 className="text-xl font-black text-slate-900">
                      Selçuklu Yıldızını Tamamladın!
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      Tebrikler! Çember, iki eş kare (doğru parçaları), dikme, eksen doğrusu ve ışın araçlarını kullanarak Türk-İslam medeniyetinin 800 yıllık Selçuklu Yıldızı geometrik motifini inşa ettiniz.
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-left space-y-2 text-xs">
                    <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                      <span>✨ Selçuklu Yıldızı'nın 8 Erdemi:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-amber-800 font-medium">
                      <span>1. Merhamet</span>
                      <span>5. Sır Tutma</span>
                      <span>2. Şefkat</span>
                      <span>6. Sadakat</span>
                      <span>3. Sabır</span>
                      <span>7. Cömertlik</span>
                      <span>4. Doğruluk</span>
                      <span>8. Şükür</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> +100 Başarı Puanı
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Selçuklu Mimarı
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={loadMotif1Mission}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Tekrar İnşa Et</span>
                    </button>
                    <button
                      onClick={() => setMotifCelebrated(false)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Motifi İncele</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Motif 2: Tamamlama & Kutlama Kartı (Eli Belinde - Anadolu Kilim Sanatı) */}
            {isMotif2Active && motifCelebrated && (
              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-30 animate-in fade-in zoom-in-95 duration-300">
                <div className="max-w-md w-full bg-white rounded-3xl p-6 border-2 border-cyan-300 shadow-2xl space-y-4 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-sky-400 text-white flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/30 animate-bounce">
                    💠
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      Maarif Modeli [D7.1] Kültürel Miras
                    </span>
                    <h3 className="text-xl font-black text-slate-900">
                      "Eli Belinde" Motifini Tamamladın!
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      Tebrikler! Doğru parçalarıyla simetrik 16 noktayı birleştirerek Anadolu kilim dokuma sanatının simgesi olan "Eli Belinde" figürünün dış hatlarını başarıyla inşa ettiniz.
                    </p>
                  </div>

                  <div className="p-3 bg-cyan-50/80 rounded-2xl border border-cyan-200 text-left space-y-2 text-xs">
                    <div className="font-extrabold text-cyan-950 flex items-center gap-1.5">
                      <span>🌾 "Eli Belinde" Motifinin Kültürel Anlamı:</span>
                    </div>
                    <p className="text-[11px] text-cyan-900 font-medium leading-relaxed">
                      Anadolu kilim ve halı dokuma geleneğinde "Eli Belinde", analığın, doğurganlığın, bereketin, kısmet ve yaşam sevincinin sembolüdür. İki elini beline koymuş kadın silüeti, aileyi ve yuvayı temsil eder.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> +100 Başarı Puanı
                    </span>
                    <span className="text-xs font-bold text-cyan-900 bg-cyan-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Kilim Ustası
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={loadMotif2Mission}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Tekrar İnşa Et</span>
                    </button>
                    <button
                      onClick={() => setMotifCelebrated(false)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md shadow-cyan-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Motifi İncele</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Table: GeoGebra Cebir Görünümü & Nesne Denetçisi */}
            <div className="bg-slate-900 text-white border-t border-slate-700 p-4 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-black uppercase text-teal-300 tracking-wider flex items-center gap-1.5">
                    <Shapes className="w-4 h-4" />
                    <span>GeoGebra Cebir Görünümü & Nesne Denetçisi</span>
                  </span>

                  <button
                    type="button"
                    onClick={toggleAllLabelsVisibility}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs border ${
                      areAllLabelsHidden
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border-rose-500/40'
                    }`}
                    title={
                      areAllLabelsHidden
                        ? 'Tahtadaki tüm etiketleri ve ölçüleri tekrar göster'
                        : 'Tahtadaki tüm etiketleri ve ölçü yazılarını kaldır/gizle'
                    }
                  >
                    {areAllLabelsHidden ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tüm Etiketleri Göster</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                        <span>Tüm Etiketleri Kaldır</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300 font-bold flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Çokgen: {polygons.length}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Nesne: {objects.length}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Açı: {angles.length}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Nokta: {points.length}
                  </span>
                </div>
              </div>

              {polygons.length === 0 && objects.length === 0 && angles.length === 0 && points.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-2">
                  Tahtada henüz geometrik eleman bulunmuyor. Sol paneldeki araçları kullanarak çizim yapabilir veya hazır şablonları yükleyebilirsiniz.
                </div>
              ) : (
                <div className="space-y-3">
                  {/* 1. Çokgenler (Polygons) */}
                  {polygons.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <span>⬡ Çokgenler (Çevre & Gauss Alanı)</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {polygons.map((poly) => (
                          <div
                            key={poly.id}
                            className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3"
                          >
                            <button
                              type="button"
                              onClick={() => togglePolygonLabelVisibility(poly.id)}
                              className="space-y-1 text-left p-1 -m-1 rounded-xl hover:bg-emerald-900/30 transition-all cursor-pointer group/polylabel"
                              title={poly.hideLabel ? 'Çokgen etiketini tahtada göster' : 'Çokgen etiketini tahtada gizle'}
                            >
                              <div
                                className={`font-extrabold text-sm flex items-center gap-2 transition-colors ${
                                  poly.hideLabel
                                    ? 'text-slate-500 line-through'
                                    : 'text-emerald-200 group-hover/polylabel:text-emerald-100'
                                }`}
                              >
                                <span>{poly.label}</span>
                                {poly.hideLabel && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-400 font-sans font-bold px-1 py-0.2 rounded bg-amber-500/15 border border-amber-500/30">
                                    <EyeOff className="w-2.5 h-2.5" /> Gizli
                                  </span>
                                )}
                                <span className={`text-[10px] font-mono ${poly.hideLabel ? 'text-slate-600' : 'text-emerald-400'}`}>
                                  ({poly.points.map((p) => p.label).join(' - ')})
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-[11px]">
                                <span className="text-sky-300 font-bold">
                                  Çevre: <strong>{poly.perimeter} cm</strong>
                                </span>
                                <span className="text-emerald-400 font-black">
                                  Alan: <strong>{poly.area} cm²</strong>
                                </span>
                              </div>
                            </button>
                            <button
                              onClick={() => deletePolygon(poly.id)}
                              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-all cursor-pointer shrink-0"
                              title="Çokgeni Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Geometrik Nesneler (Doğru, Işın, Parça, Çember, Dikme, Sanat) */}
                  {objects.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-black text-sky-400 uppercase tracking-wider flex items-center gap-1">
                        <span>📏 Çizgiler, Çemberler & Dikmeler</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        {objects.map((obj) => (
                          <div
                            key={obj.id}
                            className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-2"
                          >
                            <button
                              type="button"
                              onClick={() => toggleObjectLabelVisibility(obj.id)}
                              className="min-w-0 text-left p-1 -m-1 rounded-lg hover:bg-slate-700/50 transition-all cursor-pointer group/label"
                              title={obj.hideLabel ? 'Yazı etiketini tahtada göster' : 'Yazı etiketini tahtada gizle'}
                            >
                              <div
                                className={`font-mono font-black text-sm flex items-center gap-1.5 transition-colors ${
                                  obj.hideLabel
                                    ? 'text-slate-500 line-through'
                                    : 'text-amber-300 group-hover/label:text-amber-200'
                                }`}
                              >
                                <span>{obj.symbol}</span>
                                {obj.hideLabel && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-400 font-sans font-bold px-1 py-0.2 rounded bg-amber-500/15 border border-amber-500/30">
                                    <EyeOff className="w-2.5 h-2.5" /> Gizli
                                  </span>
                                )}
                              </div>
                              <div
                                className={`text-[11px] line-clamp-1 transition-colors ${
                                  obj.hideLabel ? 'text-slate-600 line-through' : 'text-slate-300'
                                }`}
                              >
                                {obj.label}
                              </div>
                            </button>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => toggleObjectLengthVisibility(obj.id)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                  obj.hideLength
                                    ? 'bg-slate-700/60 hover:bg-slate-700 text-slate-400 border border-slate-600 line-through opacity-80'
                                    : obj.type === 'segment'
                                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                                    : obj.type === 'distance'
                                    ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                                    : obj.type === 'circle'
                                    ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40'
                                    : obj.type === 'perpendicular'
                                    ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                                    : obj.type === 'art-motif'
                                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                                    : 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40'
                                }`}
                                title={obj.hideLength ? 'Uzunluk/değer etiketini göster' : 'Uzunluk/değer etiketini gizle'}
                              >
                                {obj.hideLength && <EyeOff className="w-2.5 h-2.5" />}
                                <span>
                                  {obj.type === 'segment' || obj.type === 'distance'
                                    ? `${obj.length} cm`
                                    : obj.type === 'circle'
                                    ? `r=${obj.length} cm`
                                    : obj.type === 'perpendicular'
                                    ? `${obj.distance} cm ⊥`
                                    : obj.type === 'art-motif'
                                    ? 'Sanat'
                                    : 'Sonsuz (∞)'}
                                </span>
                              </button>
                              <button
                                onClick={() => deleteObject(obj.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
                                title="Nesneyi Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Dinamik Açılar */}
                  {angles.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-black text-blue-400 uppercase tracking-wider flex items-center gap-1">
                        <span>📐 Dinamik Açılar</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {angles.map((ang) => (
                          <div
                            key={ang.id}
                            className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-2"
                          >
                            <button
                              type="button"
                              onClick={() => toggleAngleLabelVisibility(ang.id)}
                              className="min-w-0 text-left p-1 -m-1 rounded-lg hover:bg-slate-700/50 transition-all cursor-pointer group/anglabel"
                              title={ang.hideLabel ? 'Açı etiketini tahtada göster' : 'Açı etiketini tahtada gizle'}
                            >
                              <div
                                className={`font-mono font-black text-sm flex items-center gap-1.5 transition-colors ${
                                  ang.hideLabel
                                    ? 'text-slate-500 line-through'
                                    : 'text-amber-300 group-hover/anglabel:text-amber-200'
                                }`}
                              >
                                <span>
                                  s(∠{ang.p1.label}{ang.vertex.label}{ang.p2.label}) = {ang.degree}°
                                </span>
                                {ang.hideLabel && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-400 font-sans font-bold px-1 py-0.2 rounded bg-amber-500/15 border border-amber-500/30">
                                    <EyeOff className="w-2.5 h-2.5" /> Gizli
                                  </span>
                                )}
                              </div>
                              <div
                                className={`text-[11px] transition-colors ${
                                  ang.hideLabel ? 'text-slate-600 line-through' : 'text-slate-300'
                                }`}
                              >
                                {ang.label}
                              </div>
                            </button>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                {ang.type.toUpperCase()} AÇI
                              </span>
                              <button
                                onClick={() => deleteAngle(ang.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
                                title="Açıyı Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Noktalar Listesi (Points) */}
                  {points.length > 0 && (
                    <div className="space-y-1.5 pt-1 border-t border-slate-800">
                      <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center justify-between">
                        <span>📍 Noktalar ({points.length} Nokta Koordinatları)</span>
                        <span className="text-[10px] text-slate-400 font-normal">Noktaları sürükleyerek şekilleri canlı değiştirebilirsiniz</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {points.map((pt) => (
                          <div
                            key={pt.id}
                            className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2"
                          >
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: pt.color }} />
                            <span className={`font-black ${pt.hideLabel ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                              {pt.label}
                            </span>
                            {pt.hideLabel && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-400 font-sans font-bold px-1 py-0.2 rounded bg-amber-500/15 border border-amber-500/30">
                                <EyeOff className="w-2.5 h-2.5" /> Gizli
                              </span>
                            )}
                            <span className="font-mono text-[10px] text-slate-400">({pt.x}, {pt.y})</span>
                            <button
                              type="button"
                              onClick={() => togglePointLabelVisibility(pt.id)}
                              className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                              title={pt.hideLabel ? `${pt.label} etiketini tahtada göster` : `${pt.label} etiketini tahtada gizle`}
                            >
                              {pt.hideLabel ? <EyeOff className="w-3 h-3 text-amber-400" /> : <Eye className="w-3 h-3 text-slate-400" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => deletePoint(pt.id)}
                              className="p-0.5 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                              title={`${pt.label} Noktasını Sil`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between gap-3 text-xs">
              <div className="text-slate-600 text-xs">
                💡 <strong className="text-slate-800">Maarif İlkesi:</strong> İki ucu kapalı doğru parçaları <span className="font-mono font-bold text-teal-700">[AB]</span> ölçülebilir; pergel sabit noktaya eşit uzaklık çizer, en kısa çizgi ise dikmedir (d ⊥ k).
              </div>

              <button
                onClick={() => {
                  playSound('select');
                  onNextPhase();
                }}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
              >
                <span>3. Aşamaya Geç: Oyun Zamanı</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
