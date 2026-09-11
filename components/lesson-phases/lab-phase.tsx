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
  Ruler
} from 'lucide-react';
import { MascotLabHelper } from '@/components/mascot';

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
}

interface GeoObject {
  id: string;
  type: 'segment' | 'ray' | 'line';
  p1: GeoPoint;
  p2: GeoPoint;
  symbol: string;
  label: string;
  length?: number;
  color: string;
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
}

const POINT_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'O'];
const COLORS = ['#10b396', '#0284c7', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444'];

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

  const isDivisibilityOutcome =
    selectedOutcome?.id === 'MAT.6.1.2' ||
    selectedOutcome?.code?.includes('6.1.2') ||
    data.toolType === 'divisibility-bench';

  const isPrimeFactorsOutcome =
    selectedOutcome?.id === 'MAT.6.1.3' ||
    selectedOutcome?.code?.includes('6.1.3') ||
    data.toolType === 'prime-factors-bench';

  const isCommonMultiplesDivisorsOutcome =
    selectedOutcome?.id === 'MAT.6.1.4' ||
    selectedOutcome?.code?.includes('6.1.4') ||
    data.toolType === 'common-multiples-divisors-bench';

  const isFactorsMultiplesOutcome =
    !isDivisibilityOutcome &&
    !isPrimeFactorsOutcome &&
    !isCommonMultiplesDivisorsOutcome &&
    (selectedOutcome?.id === 'MAT.6.1.1' ||
      selectedOutcome?.code?.includes('6.1.1') ||
      data.toolType === 'factors-multiples-bench' ||
      data.title.toLowerCase().includes('çarpan') ||
      data.title.toLowerCase().includes('katlar'));

  const isLinesAnglesOutcome =
    !isDivisibilityOutcome &&
    !isPrimeFactorsOutcome &&
    !isCommonMultiplesDivisorsOutcome &&
    !isFactorsMultiplesOutcome &&
    (selectedOutcome?.id === 'MAT.5.3.4' ||
      selectedOutcome?.code?.includes('5.3.4') ||
      data.title.toLowerCase().includes('doğru ve açı') ||
      data.title.toLowerCase().includes('kesişen'));

  const isExperimentBench =
    !isDivisibilityOutcome &&
    !isPrimeFactorsOutcome &&
    !isCommonMultiplesDivisorsOutcome &&
    !isFactorsMultiplesOutcome &&
    !isLinesAnglesOutcome &&
    (data.toolType === 'experiment-bench' || selectedOutcome?.id === 'MAT.5.3.2');

  const isAngleTopic =
    !isDivisibilityOutcome &&
    !isPrimeFactorsOutcome &&
    !isCommonMultiplesDivisorsOutcome &&
    !isFactorsMultiplesOutcome &&
    !isLinesAnglesOutcome &&
    (selectedOutcome?.id === 'MAT.5.3.3' ||
      selectedOutcome?.code?.includes('5.3.3') ||
      data.title.toLowerCase().includes('iletki') ||
      (data.title.toLowerCase().includes('açı') && !data.title.toLowerCase().includes('geometri')));

  // Active Tool: 'angle' for MAT.5.3.3, 'point' | 'segment' | 'ray' | 'line' for MAT.5.3.1
  const [activeTool, setActiveTool] = useState<'angle' | 'ray' | 'segment' | 'line' | 'point' | 'drag'>(
    isAngleTopic ? 'angle' : 'point'
  );

  const [points, setPoints] = useState<GeoPoint[]>([]);
  const [objects, setObjects] = useState<GeoObject[]>([]);
  const [angles, setAngles] = useState<GeoAngle[]>([]);

  const [selectedPointForLink, setSelectedPointForLink] = useState<GeoPoint | null>(null);
  const [angleStepPoint1, setAngleStepPoint1] = useState<GeoPoint | null>(null); // Vertex O
  const [angleStepPoint2, setAngleStepPoint2] = useState<GeoPoint | null>(null); // Base point A
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const [draggingPointId, setDraggingPointId] = useState<string | null>(null);
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

  // Geometry Lab Missions state (MAT.5.3.1)
  const [geoMissionsDone, setGeoMissionsDone] = useState({
    point: false,
    segment: false,
    ray: false,
    line: false
  });

  const [feedbackMsg, setFeedbackMsg] = useState(
    isAngleTopic
      ? 'Açı oluşturmak için tahtaya tıklayarak 1. Başlangıç Köşesi (O), 2. Taban Kolu (A) ve 3. Dönen Kolu (B) belirleyin.'
      : 'Tahtaya tıklayarak Nokta bırakabilir veya Doğru Parçası, Işın ve Doğru araçlarıyla geometrik şekiller çizebilirsiniz.'
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
      const hasRay = objects.some((o) => o.type === 'ray');
      const hasLine = objects.some((o) => o.type === 'line');

      setGeoMissionsDone({
        point: hasPoint,
        segment: hasSegment,
        ray: hasRay,
        line: hasLine
      });

      if (hasPoint && hasSegment && hasRay && hasLine && !geoMissionsDone.line) {
        unlockBadge('geo-master');
        addPoints(50);
      }
    }
  }, [points, objects, isAngleTopic, isExperimentBench]);

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

  const clearAll = () => {
    playSound('clear');
    setPoints([]);
    setObjects([]);
    setAngles([]);
    setSelectedPointForLink(null);
    setAngleStepPoint1(null);
    setAngleStepPoint2(null);
    setAngleNameInput('');
    setAngleNameStatus('idle');
    setAngleNameFeedback(null);
    setFeedbackMsg('Tahta temizlendi. Yeni geometrik şekil veya açı inşa edebilirsiniz.');
  };

  const undoLast = () => {
    playSound('click');
    if (angles.length > 0) {
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
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const hitPoint = getPointNear(x, y, points);

    // If Drag Tool active or hit existing point
    if (activeTool === 'drag' || hitPoint) {
      if (hitPoint) {
        setDraggingPointId(hitPoint.id);
        playSound('click');
        return;
      }
    }

    // POINT TOOL (MAT.5.3.1)
    if (activeTool === 'point') {
      const nextLabel = POINT_LABELS[points.length % POINT_LABELS.length];
      const newPt: GeoPoint = {
        id: `pt-${Date.now()}-${Math.random()}`,
        label: nextLabel,
        x,
        y,
        color: activeColor
      };
      setPoints([...points, newPt]);
      playSound('select');
      addPoints(5);
      setFeedbackMsg(`📍 ${nextLabel} Noktası eklendi (Konum: x:${x}, y:${y}). Noktanın boyutu yoktur, sadece konum belirtir.`);
      return;
    }

    // ANGLE TOOL (MAT.5.3.3)
    if (activeTool === 'angle') {
      const pt: GeoPoint = hitPoint || {
        id: `pt-${Date.now()}-${Math.random()}`,
        label: !angleStepPoint1 ? 'O' : !angleStepPoint2 ? 'A' : 'B',
        x,
        y,
        color: !angleStepPoint1 ? '#f59e0b' : !angleStepPoint2 ? '#0284c7' : '#10b396'
      };

      if (!hitPoint) {
        setPoints([...points, pt]);
      }

      if (!angleStepPoint1) {
        setAngleStepPoint1(pt);
        playSound('select');
        setFeedbackMsg(`📍 Açının Köşesi (${pt.label}) belirlendi. Şimdi taban kolunun yönünü belirlemek için tahtaya tıklayınız.`);
      } else if (!angleStepPoint2) {
        if (angleStepPoint1.id === pt.id) return;
        setAngleStepPoint2(pt);
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
        setObjects([...objects, ray1]);
        setFeedbackMsg(`📐 [${angleStepPoint1.label}${pt.label} Taban Işını çizildi. Şimdi dönen 2. kolu (${pt.label === 'A' ? 'B' : 'C'}) çizmek için tahtaya tıklayınız!`);
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
        playSound('success');
        addPoints(25);
        setFeedbackMsg(`🎉 ∠${angleStepPoint2.label}${angleStepPoint1.label}${pt.label} Açısı oluşturuldu! Ölçü: ${deg}° (${typeInfo.title}).`);
      }
      return;
    }

    // SEGMENT / RAY / LINE TOOLS (MAT.5.3.1)
    if (activeTool === 'segment' || activeTool === 'ray' || activeTool === 'line') {
      const pt: GeoPoint = hitPoint || {
        id: `pt-${Date.now()}-${Math.random()}`,
        label: POINT_LABELS[points.length % POINT_LABELS.length],
        x,
        y,
        color: activeColor
      };

      if (!hitPoint) {
        setPoints([...points, pt]);
      }

      if (!selectedPointForLink) {
        setSelectedPointForLink(pt);
        playSound('select');
        const toolName = activeTool === 'segment' ? 'Doğru Parçası' : activeTool === 'ray' ? 'Işın' : 'Doğru';
        setFeedbackMsg(`1. Nokta (${pt.label}) seçildi. ${toolName} çizimini tamamlamak için 2. noktaya tıklayınız.`);
      } else {
        if (selectedPointForLink.id === pt.id) {
          setSelectedPointForLink(null);
          return;
        }

        const dx = pt.x - selectedPointForLink.x;
        const dy = pt.y - selectedPointForLink.y;
        const pixelLen = Math.round(Math.sqrt(dx * dx + dy * dy));
        const cmLen = Math.round((pixelLen / 30) * 10) / 10; // Approx cm scale

        let symbolText = '';
        let labelText = '';

        if (activeTool === 'segment') {
          symbolText = `[${selectedPointForLink.label}${pt.label}]`;
          labelText = `Doğru Parçası [${selectedPointForLink.label}${pt.label}] (${cmLen} cm)`;
        } else if (activeTool === 'ray') {
          symbolText = `[${selectedPointForLink.label}${pt.label}>`;
          labelText = `Işın [${selectedPointForLink.label}${pt.label}>`;
        } else {
          symbolText = `${selectedPointForLink.label}${pt.label}`;
          labelText = `Doğru ${selectedPointForLink.label}${pt.label}`;
        }

        const newObj: GeoObject = {
          id: `obj-${Date.now()}`,
          type: activeTool,
          p1: selectedPointForLink,
          p2: pt,
          symbol: symbolText,
          label: labelText,
          length: cmLen,
          color: activeColor
        };

        setObjects([...objects, newObj]);
        setSelectedPointForLink(null);
        setHoverPos(null);
        playSound('success');
        addPoints(15);
        setFeedbackMsg(`✨ ${labelText} başarıyla çizildi!`);
      }
    }
  };

  // Pointer Move (Dragging & Preview Lines)
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (draggingPointId) {
      setPoints((prev) =>
        prev.map((pt) => (pt.id === draggingPointId ? { ...pt, x, y } : pt))
      );
      return;
    }

    if (selectedPointForLink || angleStepPoint1) {
      setHoverPos({ x, y });
    }
  };

  const handlePointerUp = () => {
    if (draggingPointId) {
      setDraggingPointId(null);
      playSound('click');
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
      <g key={ang.id} className="animate-in fade-in duration-200">
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

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveTool('angle');
                    setSelectedPointForLink(null);
                    setAngleStepPoint1(null);
                    setAngleStepPoint2(null);
                    playSound('click');
                    setFeedbackMsg('Açı aracı seçildi: 1. Başlangıç köşesine (O), sonra 1. kola (A) ve 2. kola (B) tıklayınız.');
                  }}
                  className={`p-3.5 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                    activeTool === 'angle'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-102'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Compass className="w-5 h-5" />
                  <span>📐 Açı İnşa Et</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTool('drag');
                    setSelectedPointForLink(null);
                    playSound('click');
                    setFeedbackMsg('🖐️ Tahtadaki açı kollarını veya köşesini sürükleyerek açıyı canlı değiştiriniz.');
                  }}
                  className={`p-3.5 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                    activeTool === 'drag'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-102'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Move className="w-5 h-5" />
                  <span>🖐️ Kolu Döndür</span>
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
                className={`w-full h-[460px] cursor-crosshair select-none touch-none ${showGrid ? 'math-grid-bg' : ''}`}
              >
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
                  const p1 = points.find((p) => p.id === obj.p1.id) || obj.p1;
                  const p2 = points.find((p) => p.id === obj.p2.id) || obj.p2;
                  const { type, color, id } = obj;
                  const dx = p2.x - p1.x;
                  const dy = p2.y - p1.y;
                  const len = Math.sqrt(dx * dx + dy * dy) || 1;
                  const angle = Math.atan2(dy, dx);

                  if (type === 'ray') {
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
                  }
                  return null;
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
                      className="cursor-grab active:cursor-grabbing"
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        setDraggingPointId(pt.id);
                        playSound('click');
                      }}
                    >
                      {/* Pulse ring for active vertex */}
                      {isVertex && (
                        <circle cx={pt.x} cy={pt.y} r="16" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
                      )}

                      {/* Point Circle */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isVertex ? 9 : 7.5}
                        fill={isVertex ? '#f59e0b' : pt.color}
                        stroke="#ffffff"
                        strokeWidth="3"
                        className={`transition-transform hover:scale-125 ${isDragging ? 'scale-125 ring-4 ring-teal-400' : ''}`}
                      />

                      {/* Point Label */}
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
                    </g>
                  );
                })}
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT TOOLBAR */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Main Geometry Tools */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Temel Geometrik Çizim Araçları
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActiveTool('point');
                  setSelectedPointForLink(null);
                  playSound('click');
                  setFeedbackMsg('📍 Nokta Aracı: Tahtaya tıklayarak isimlendirilmiş noktalar yerleştiriniz.');
                }}
                className={`p-3 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                  activeTool === 'point'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-102'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Dot className="w-6 h-6" />
                <span>📍 Nokta (•)</span>
              </button>

              <button
                onClick={() => {
                  setActiveTool('segment');
                  setSelectedPointForLink(null);
                  playSound('click');
                  setFeedbackMsg('📏 Doğru Parçası [AB]: İki noktayı birleştirerek boyu ölçülebilir çizgi oluşturunuz.');
                }}
                className={`p-3 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                  activeTool === 'segment'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-102'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Minus className="w-5 h-5 stroke-[3]" />
                <span>📏 Doğru Parçası [AB]</span>
              </button>

              <button
                onClick={() => {
                  setActiveTool('ray');
                  setSelectedPointForLink(null);
                  playSound('click');
                  setFeedbackMsg('🔦 Işın [CD>: 1. Tıklanan nokta başlangıçtır [C], 2. nokta yönü belirler.');
                }}
                className={`p-3 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                  activeTool === 'ray'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-102'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                <span>🔦 Işın [CD&gt;</span>
              </button>

              <button
                onClick={() => {
                  setActiveTool('line');
                  setSelectedPointForLink(null);
                  playSound('click');
                  setFeedbackMsg('↔️ Doğru EF: İki yönden de sonsuza uzayan çift oklu çizgi çiziniz.');
                }}
                className={`p-3 rounded-2xl border text-left font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                  activeTool === 'line'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-102'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-black text-sm tracking-tighter">&lt;—&gt;</span>
                <span>↔️ Doğru EF</span>
              </button>
            </div>

            {/* Drag Handle Tool */}
            <button
              onClick={() => {
                setActiveTool('drag');
                setSelectedPointForLink(null);
                playSound('click');
                setFeedbackMsg('🖐️ Taşıma Aracı: Tahtadaki noktaları sürükleyerek şekillerin konumunu ve boyutunu değiştirin.');
              }}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTool === 'drag'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Move className="w-4 h-4" />
              <span>🖐️ Noktaları Taşı & Boyutlandır</span>
            </button>

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

            {/* Clear & Undo Buttons */}
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

          {/* Quick Presets for MAT.5.3.1 */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Hazır Şablonlar
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={loadDefaultGeometricPresets}
                className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold text-left flex items-center justify-between"
              >
                <span>🌟 Tüm Temel Modelleri Yükle</span>
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              </button>
            </div>
          </div>

          {/* Goals Checklist Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-400">
                <Target className="w-4 h-4" />
                <span>Laboratuvar Görevleri</span>
              </div>
              <span className="text-[11px] text-indigo-200">
                {Object.values(geoMissionsDone).filter(Boolean).length} / 4 Tamamlandı
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className={`p-2 rounded-xl flex items-center justify-between border ${
                geoMissionsDone.point ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/10 border-white/15 text-slate-300'
              }`}>
                <span>📍 En az 1 Nokta (•) yerleştir</span>
                {geoMissionsDone.point ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Target className="w-3.5 h-3.5 opacity-40" />}
              </div>

              <div className={`p-2 rounded-xl flex items-center justify-between border ${
                geoMissionsDone.segment ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/10 border-white/15 text-slate-300'
              }`}>
                <span>📏 1 Doğru Parçası [AB] çiz</span>
                {geoMissionsDone.segment ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Target className="w-3.5 h-3.5 opacity-40" />}
              </div>

              <div className={`p-2 rounded-xl flex items-center justify-between border ${
                geoMissionsDone.ray ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/10 border-white/15 text-slate-300'
              }`}>
                <span>🔦 1 Işın [CD&gt; modeli oluştur</span>
                {geoMissionsDone.ray ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Target className="w-3.5 h-3.5 opacity-40" />}
              </div>

              <div className={`p-2 rounded-xl flex items-center justify-between border ${
                geoMissionsDone.line ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/10 border-white/15 text-slate-300'
              }`}>
                <span>↔️ 1 Doğru EF inşa et</span>
                {geoMissionsDone.line ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Target className="w-3.5 h-3.5 opacity-40" />}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Geometry Canvas */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="relative bg-white rounded-3xl border-2 border-slate-200 shadow-inner overflow-hidden min-h-[520px] flex flex-col justify-between">
            
            {/* Status & Feedback Bar */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs font-medium z-10 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <span>{feedbackMsg}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span>Noktalar: {points.length}</span>
                <span>Şekiller: {objects.length}</span>
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <svg
              ref={svgRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`w-full h-[460px] cursor-crosshair select-none touch-none ${showGrid ? 'math-grid-bg' : ''}`}
            >
              {/* Empty State Hint */}
              {points.length === 0 && objects.length === 0 && (
                <g className="pointer-events-none">
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    ✨ Nokta veya çizim aracını seçip tahtaya tıklayarak geometrik çizim yapınız.
                  </text>
                </g>
              )}

              {/* Connecting line preview */}
              {selectedPointForLink && hoverPos && (
                <line
                  x1={selectedPointForLink.x}
                  y1={selectedPointForLink.y}
                  x2={hoverPos.x}
                  y2={hoverPos.y}
                  stroke={activeColor}
                  strokeWidth="3"
                  strokeDasharray="6,4"
                  className="animate-pulse"
                />
              )}

              {/* Render Geometric Objects */}
              {objects.map((obj) => {
                const p1 = points.find((p) => p.id === obj.p1.id) || obj.p1;
                const p2 = points.find((p) => p.id === obj.p2.id) || obj.p2;
                const { type, color, id, length, symbol } = obj;

                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                const angle = Math.atan2(dy, dx);
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;

                // 1. SEGMENT: Two closed boundary dots + length badge
                if (type === 'segment') {
                  return (
                    <g key={id}>
                      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth="4.5" strokeLinecap="round" />
                      <circle cx={p1.x} cy={p1.y} r="5.5" fill={color} stroke="#ffffff" strokeWidth="2" />
                      <circle cx={p2.x} cy={p2.y} r="5.5" fill={color} stroke="#ffffff" strokeWidth="2" />
                      {/* Segment Length Badge */}
                      <g transform={`translate(${midX}, ${midY - 14})`}>
                        <rect x="-36" y="-12" width="72" height="22" rx="6" fill="#0f172a" stroke={color} strokeWidth="1.5" />
                        <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                          |{p1.label}{p2.label}| = {length || Math.round(len / 3)} cm
                        </text>
                      </g>
                    </g>
                  );
                }

                // 2. RAY: Closed start point + One directional arrow
                if (type === 'ray') {
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
                    <g key={id}>
                      <line x1={p1.x} y1={p1.y} x2={extX} y2={extY} stroke={color} strokeWidth="4.5" strokeLinecap="round" />
                      <polygon points={`${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`} fill={color} />
                      <circle cx={p1.x} cy={p1.y} r="6.5" fill={color} stroke="#ffffff" strokeWidth="2" />
                      {/* Ray Label Badge */}
                      <g transform={`translate(${midX}, ${midY - 14})`}>
                        <rect x="-30" y="-12" width="60" height="22" rx="6" fill="#0f172a" stroke={color} strokeWidth="1.5" />
                        <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                          [{p1.label}{p2.label}&gt;
                        </text>
                      </g>
                    </g>
                  );
                }

                // 3. LINE: Double arrows on both sides
                if (type === 'line') {
                  const ext1X = p1.x - (dx / len) * 45;
                  const ext1Y = p1.y - (dy / len) * 45;
                  const ext2X = p2.x + (dx / len) * 45;
                  const ext2Y = p2.y + (dy / len) * 45;

                  const arrowLen = 13;
                  const arrowWidth = 6.5;

                  // Arrow at ext2
                  const tip2X = ext2X;
                  const tip2Y = ext2Y;
                  const left2X = tip2X - arrowLen * Math.cos(angle) - arrowWidth * Math.sin(angle);
                  const left2Y = tip2Y - arrowLen * Math.sin(angle) + arrowWidth * Math.cos(angle);
                  const right2X = tip2X - arrowLen * Math.cos(angle) + arrowWidth * Math.sin(angle);
                  const right2Y = tip2Y - arrowLen * Math.sin(angle) - arrowWidth * Math.cos(angle);

                  // Arrow at ext1
                  const oppAngle = angle + Math.PI;
                  const tip1X = ext1X;
                  const tip1Y = ext1Y;
                  const left1X = tip1X - arrowLen * Math.cos(oppAngle) - arrowWidth * Math.sin(oppAngle);
                  const left1Y = tip1Y - arrowLen * Math.sin(oppAngle) + arrowWidth * Math.cos(oppAngle);
                  const right1X = tip1X - arrowLen * Math.cos(oppAngle) + arrowWidth * Math.sin(oppAngle);
                  const right1Y = tip1Y - arrowLen * Math.sin(oppAngle) - arrowWidth * Math.cos(oppAngle);

                  return (
                    <g key={id}>
                      <line x1={ext1X} y1={ext1Y} x2={ext2X} y2={ext2Y} stroke={color} strokeWidth="4.5" strokeLinecap="round" />
                      <polygon points={`${tip2X},${tip2Y} ${left2X},${left2Y} ${right2X},${right2Y}`} fill={color} />
                      <polygon points={`${tip1X},${tip1Y} ${left1X},${left1Y} ${right1X},${right1Y}`} fill={color} />
                      {/* Line Label Badge */}
                      <g transform={`translate(${midX}, ${midY - 14})`}>
                        <rect x="-24" y="-12" width="48" height="22" rx="6" fill="#0f172a" stroke={color} strokeWidth="1.5" />
                        <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                          {p1.label}{p2.label}
                        </text>
                      </g>
                    </g>
                  );
                }

                return null;
              })}

              {/* Render Points */}
              {points.map((pt) => {
                const isSelected = selectedPointForLink?.id === pt.id;
                const isDragging = draggingPointId === pt.id;

                return (
                  <g
                    key={pt.id}
                    className="cursor-grab active:cursor-grabbing"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setDraggingPointId(pt.id);
                      playSound('click');
                    }}
                  >
                    {/* Active Link selection ring */}
                    {isSelected && (
                      <circle cx={pt.x} cy={pt.y} r="15" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="animate-pulse" />
                    )}

                    {/* Point Circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="8"
                      fill={pt.color}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className={`transition-transform hover:scale-125 ${isDragging ? 'scale-125 ring-4 ring-teal-400' : ''}`}
                    />

                    {/* Point Label */}
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
                  </g>
                );
              })}
            </svg>

            {/* Bottom Table: Symbolic Representation & Principles */}
            <div className="bg-slate-900 text-white border-t border-slate-700 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-teal-300 tracking-wider flex items-center gap-1.5">
                  <Shapes className="w-4 h-4" />
                  <span>Sembolik Temsil & Ölçülebilirlik Tablosu</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {objects.length} Geometrik Nesne Çizildi
                </span>
              </div>

              {objects.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-2">
                  Henüz tahtaya bir doğru parçası, ışın veya doğru çizilmedi. Araçları kullanarak çizim yapabilirsiniz.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  {objects.map((obj) => (
                    <div
                      key={obj.id}
                      className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-mono font-black text-amber-300 text-sm">
                          {obj.symbol}
                        </div>
                        <div className="text-[11px] text-slate-300">{obj.label}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        obj.type === 'segment' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      }`}>
                        {obj.type === 'segment' ? 'Ölçülebilir 📏' : 'Sonsuz (∞)'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between gap-3 text-xs">
              <div className="text-slate-600 text-xs">
                💡 <strong className="text-slate-800">Maarif İlkesi:</strong> Yalnızca iki ucu kapalı doğru parçaları <span className="font-mono font-bold text-teal-700">[AB]</span> cetvelle ölçülebilir.
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
