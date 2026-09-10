'use client';

import React, { useState, useEffect } from 'react';
import { StoryPhaseData, StorybookPage } from '@/types';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Sparkles,
  Compass,
  MessageCircle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Layers,
  HelpCircle,
  Eye,
  Award,
  Zap,
  Volume2,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { MascotDialogueBox } from '@/components/mascot';

interface StoryPhaseProps {
  data: StoryPhaseData;
  onNextPhase: () => void;
}

export function StoryPhase({ data, onNextPhase }: StoryPhaseProps) {
  const { playSound } = useApp();
  
  const [viewMode, setViewMode] = useState<'storybook' | 'overview'>('storybook');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [reflectionRevealed, setReflectionRevealed] = useState(false);

  // Interactive local states for scenes
  const [scene1PointPlaced, setScene1PointPlaced] = useState(false);
  const [scene2LighthouseOn, setScene2LighthouseOn] = useState(false);
  const [scene3RulerMeasured, setScene3RulerMeasured] = useState(false);
  const [scene4HorizonExtended, setScene4HorizonExtended] = useState(false);
  const [scene41Tested, setScene41Tested] = useState(false);
  const [scene42Tested, setScene42Tested] = useState(false);
  const [scene43Tested, setScene43Tested] = useState(false);
  const [scene44Tested, setScene44Tested] = useState(false);
  const [scene45Tested, setScene45Tested] = useState(false);
  // 6. Sınıf MAT.6.1.1 interactive states
  const [selectedFactorAreaIndex, setSelectedFactorAreaIndex] = useState(3); // 0: 1x36, 1: 2x18, 2: 3x12, 3: 4x9, 4: 6x6
  const [activeRainbowPair, setActiveRainbowPair] = useState<number | null>(3); // 0: 1-36, 1: 2-18, 2: 3-12, 3: 4-9, 4: 6-6
  const [selectedMultipleIndex, setSelectedMultipleIndex] = useState(4); // 12x5 = 60
  const [dualityFlipped, setDualityFlipped] = useState(false);

  // 6. Sınıf MAT.6.1.2 interactive states
  const [selectedDivisibilityNumber, setSelectedDivisibilityNumber] = useState<number>(48750);
  const [activeDivisibilityRule, setActiveDivisibilityRule] = useState<number>(3); // 2, 3, 4, 5, 6, 9, 10

  // 6. Sınıf MAT.6.1.3 interactive states
  const [sieveSelectedPrime, setSieveSelectedPrime] = useState<number>(2);
  const [activeTreeStep, setActiveTreeStep] = useState<number>(2); // 0, 1, 2

  // 6. Sınıf MAT.6.1.4 interactive states
  const [selectedCommonNumberPair, setSelectedCommonNumberPair] = useState<[number, number]>([24, 36]);
  const [activeMultipleStop, setActiveMultipleStop] = useState<number>(24);

  const pages: StorybookPage[] = data.pages || [
    {
      id: 'default-p1',
      pageNumber: 1,
      chapterTitle: '1. Bölüm: Haritadaki İşaret',
      conceptTitle: 'Nokta Kavramı',
      conceptBadge: 'Nokta (•)',
      symbolicCode: 'A, B...',
      narrativeText: data.scenario,
      characterDialogue: {
        speaker: data.character.name,
        text: 'Nokta sadece bir konum belirtir. Boyutu, eni veya boyu yoktur.'
      },
      visualScene: {
        type: 'point-map',
        caption: 'Harita üzerindeki A Noktası.'
      },
      mathTakeaway: data.keyTakeaway
    }
  ];

  const currentPage = pages[currentPageIndex] || pages[0];

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      playSound('select');
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      playSound('success');
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      playSound('click');
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Mode Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>1. Aşama: Hayatla Bağlantı & Hikâye Kitabı</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">{data.title}</h2>
          <p className="text-xs text-slate-500 mt-1">
            Matematiğin günlük yaşamdaki doğuşunu interaktif hikaye kitabı ile keşfedelim.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => {
              setViewMode('storybook');
              playSound('click');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              viewMode === 'storybook'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 İnteraktif Kitap</span>
          </button>

          <button
            onClick={() => {
              setViewMode('overview');
              playSound('click');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              viewMode === 'overview'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>📋 Genel Bakış</span>
          </button>
        </div>
      </div>

      {/* STORYBOOK MODE */}
      {viewMode === 'storybook' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Storybook Navigation Top Bar */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 font-black text-sm flex items-center justify-center">
                {currentPage.pageNumber}
              </span>
              <div>
                <div className="text-xs text-teal-300 font-bold">{currentPage.chapterTitle}</div>
                <div className="text-sm font-extrabold text-white">{currentPage.conceptTitle}</div>
              </div>
            </div>

            {/* Page Dots Selector */}
            <div className="flex items-center gap-2">
              {pages.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    playSound('select');
                    setCurrentPageIndex(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    currentPageIndex === idx
                      ? 'w-8 bg-teal-400'
                      : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={p.chapterTitle}
                />
              ))}
            </div>

            <div className="text-xs font-bold text-slate-300">
              Sayfa {currentPageIndex + 1} / {pages.length}
            </div>
          </div>

          {/* Dual-Page Interactive Book Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-b from-slate-50 to-teal-50/20 rounded-3xl p-6 border-2 border-slate-200/80 shadow-lg min-h-[500px]">
            
            {/* LEFT PAGE: Interactive Illustration Scene */}
            <div className="lg:col-span-6 bg-white rounded-2xl border-2 border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-extrabold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  {currentPage.conceptBadge}
                </span>
                {currentPage.symbolicCode && (
                  <span className="text-xs font-mono font-black bg-slate-900 text-white px-2.5 py-0.5 rounded-lg">
                    {currentPage.symbolicCode}
                  </span>
                )}
              </div>

              {/* Dynamic SVG Visual Scenes */}
              <div className="relative w-full h-[300px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center select-none shadow-inner">
                
                {/* SCENE 1: POINT MAP */}
                {currentPage.visualScene.type === 'point-map' && (
                  <svg className="w-full h-full" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#0f172a" />
                    {/* Sea grid */}
                    <path d="M 0 50 Q 100 40 200 50 T 400 50" stroke="#1e293b" fill="none" strokeWidth="2" />
                    <path d="M 0 120 Q 100 110 200 120 T 400 120" stroke="#1e293b" fill="none" strokeWidth="2" />
                    <path d="M 0 190 Q 100 180 200 190 T 400 190" stroke="#1e293b" fill="none" strokeWidth="2" />

                    {/* Island contours */}
                    <path d="M 50 180 Q 90 140 160 170 Q 180 220 120 240 Q 60 230 50 180 Z" fill="#134e4a" opacity="0.8" />
                    <path d="M 240 70 Q 290 40 340 70 Q 360 110 310 130 Q 250 120 240 70 Z" fill="#1e3a8a" opacity="0.6" />

                    {/* Ship */}
                    <g transform="translate(70, 80)">
                      <text fontSize="28" x="0" y="0">⛵</text>
                      <text fill="#94a3b8" fontSize="10" fontWeight="bold" x="-10" y="16">Kaptan Bilge</text>
                    </g>

                    {/* Lighthouse location (Point B) */}
                    <circle cx="300" cy="85" r="5" fill="#f59e0b" />
                    <text fill="#f59e0b" fontSize="12" fontWeight="900" x="312" y="90">B (Fener)</text>

                    {/* Target Port Dock (Point A) */}
                    <g
                      className="cursor-pointer"
                      onClick={() => {
                        setScene1PointPlaced(true);
                        playSound('success');
                      }}
                    >
                      {scene1PointPlaced ? (
                        <>
                          <circle cx="120" cy="190" r="18" fill="none" stroke="#10b396" strokeWidth="2" className="animate-ping" />
                          <circle cx="120" cy="190" r="8" fill="#10b396" stroke="#ffffff" strokeWidth="2.5" />
                          <text fill="#ffffff" fontSize="16" fontWeight="900" x="120" y="175" textAnchor="middle">A Noktası</text>
                          <text fill="#5ee7cc" fontSize="10" fontWeight="bold" x="120" y="215" textAnchor="middle">📍 Liman İskelesi</text>
                        </>
                      ) : (
                        <>
                          <rect x="85" y="165" width="70" height="45" rx="8" fill="#042f2e" stroke="#14b8a6" strokeDasharray="4,4" className="animate-pulse" />
                          <text fill="#5ee7cc" fontSize="11" fontWeight="bold" x="120" y="192" textAnchor="middle">Buraya Tıkla 📍</text>
                        </>
                      )}
                    </g>
                  </svg>
                )}

                {/* SCENE 2: LIGHTHOUSE RAY */}
                {currentPage.visualScene.type === 'lighthouse-ray' && (
                  <svg className="w-full h-full" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#090d16" />
                    {/* Stars */}
                    <circle cx="40" cy="30" r="1.5" fill="#ffffff" opacity="0.8" />
                    <circle cx="120" cy="50" r="1" fill="#ffffff" opacity="0.6" />
                    <circle cx="280" cy="30" r="2" fill="#ffffff" opacity="0.9" />
                    <circle cx="350" cy="60" r="1.5" fill="#ffffff" opacity="0.7" />

                    {/* Cliff & Lighthouse */}
                    <path d="M 0 280 L 100 280 L 80 180 L 0 200 Z" fill="#1e293b" />
                    <rect x="55" y="110" width="26" height="70" fill="#e2e8f0" rx="3" />
                    <rect x="51" y="95" width="34" height="15" fill="#dc2626" rx="2" />
                    <polygon points="68,75 51,95 85,95" fill="#991b1b" />

                    {/* Start point A at lighthouse lamp */}
                    <circle cx="68" cy="102" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                    <text fill="#fde047" fontSize="12" fontWeight="900" x="68" y="70" textAnchor="middle">Başlangıç [A]</text>

                    {/* Ray Beam */}
                    {scene2LighthouseOn ? (
                      <>
                        <polygon points="68,102 400,20 400,180" fill="url(#ray-gradient)" opacity="0.55" />
                        <line x1="68" y1="102" x2="385" y2="102" stroke="#fde047" strokeWidth="4" strokeLinecap="round" />
                        <polygon points="398,102 380,95 380,109" fill="#fde047" />
                        <text fill="#ffffff" fontSize="13" fontWeight="900" x="240" y="90" textAnchor="middle">[AB Işını</text>
                        <text fill="#fde047" fontSize="10" fontWeight="bold" x="380" y="130" textAnchor="end">Sonsuza gidiş (B) ➔</text>
                      </>
                    ) : (
                      <g
                        className="cursor-pointer"
                        onClick={() => {
                          setScene2LighthouseOn(true);
                          playSound('success');
                        }}
                      >
                        <circle cx="240" cy="102" r="30" fill="#f59e0b" opacity="0.2" className="animate-ping" />
                        <rect x="180" y="82" width="120" height="40" rx="12" fill="#f59e0b" />
                        <text fill="#0f172a" fontSize="12" fontWeight="900" x="240" y="107" textAnchor="middle">Işığı Aç 🔦</text>
                      </g>
                    )}

                    <defs>
                      <linearGradient id="ray-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fde047" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}

                {/* SCENE 3: BRIDGE SEGMENT */}
                {currentPage.visualScene.type === 'bridge-segment' && (
                  <svg className="w-full h-full" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#0f172a" />
                    {/* Gorge / Sea below */}
                    <path d="M 0 280 L 100 280 L 80 140 L 0 140 Z" fill="#334155" />
                    <path d="M 400 280 L 300 280 L 320 140 L 400 140 Z" fill="#334155" />

                    {/* Left Pillar C and Right Pillar D */}
                    <rect x="70" y="110" width="20" height="40" fill="#64748b" rx="2" />
                    <rect x="310" y="110" width="20" height="40" fill="#64748b" rx="2" />

                    {/* Bounds circles */}
                    <circle cx="80" cy="120" r="7" fill="#10b396" stroke="#ffffff" strokeWidth="2" />
                    <text fill="#5ee7cc" fontSize="13" fontWeight="900" x="80" y="100" textAnchor="middle">[C] Sınırı</text>

                    <circle cx="320" cy="120" r="7" fill="#10b396" stroke="#ffffff" strokeWidth="2" />
                    <text fill="#5ee7cc" fontSize="13" fontWeight="900" x="320" y="100" textAnchor="middle">[D] Sınırı</text>

                    {/* Bridge Beam Line */}
                    <line x1="80" y1="120" x2="320" y2="120" stroke="#10b396" strokeWidth="6" strokeLinecap="round" />

                    {scene3RulerMeasured ? (
                      <g className="animate-in fade-in duration-300">
                        {/* Ruler graphic */}
                        <rect x="80" y="138" width="240" height="24" fill="#fbbf24" rx="4" stroke="#d97706" />
                        <line x1="120" y1="138" x2="120" y2="148" stroke="#000" strokeWidth="1.5" />
                        <line x1="160" y1="138" x2="160" y2="148" stroke="#000" strokeWidth="1.5" />
                        <line x1="200" y1="138" x2="200" y2="152" stroke="#000" strokeWidth="2" />
                        <line x1="240" y1="138" x2="240" y2="148" stroke="#000" strokeWidth="1.5" />
                        <line x1="280" y1="138" x2="280" y2="148" stroke="#000" strokeWidth="1.5" />

                        <rect x="155" y="172" width="90" height="26" rx="8" fill="#042f2e" stroke="#10b396" />
                        <text fill="#5ee7cc" fontSize="12" fontWeight="900" x="200" y="190" textAnchor="middle">Uzunluk: 24 Metre</text>
                        <text fill="#ffffff" fontSize="14" fontWeight="900" x="200" y="80" textAnchor="middle">[CD] Doğru Parçası</text>
                      </g>
                    ) : (
                      <g
                        className="cursor-pointer"
                        onClick={() => {
                          setScene3RulerMeasured(true);
                          playSound('success');
                        }}
                      >
                        <rect x="140" y="145" width="120" height="36" rx="10" fill="#f59e0b" />
                        <text fill="#0f172a" fontSize="12" fontWeight="900" x="200" y="168" textAnchor="middle">Cetvelle Ölç 📏</text>
                      </g>
                    )}
                  </svg>
                )}

                {/* SCENE 4: HORIZON LINE */}
                {currentPage.visualScene.type === 'horizon-line' && (
                  <svg className="w-full h-full" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#0f172a" />
                    {/* Sky Gradient */}
                    <rect x="0" y="0" width="400" height="140" fill="url(#sky-grad)" />
                    {/* Sun */}
                    <circle cx="200" cy="140" r="38" fill="#fb923c" opacity="0.9" />
                    {/* Sea */}
                    <rect x="0" y="140" width="400" height="140" fill="#0369a1" />

                    {/* Horizon line */}
                    <line x1="20" y1="140" x2="380" y2="140" stroke="#fde047" strokeWidth="5" />
                    <polygon points="10,140 28,132 28,148" fill="#fde047" />
                    <polygon points="390,140 372,132 372,148" fill="#fde047" />

                    {/* Points on line */}
                    <circle cx="120" cy="140" r="6" fill="#fde047" stroke="#000" strokeWidth="1.5" />
                    <text fill="#ffffff" fontSize="13" fontWeight="900" x="120" y="125" textAnchor="middle">E</text>

                    <circle cx="280" cy="140" r="6" fill="#fde047" stroke="#000" strokeWidth="1.5" />
                    <text fill="#ffffff" fontSize="13" fontWeight="900" x="280" y="125" textAnchor="middle">F</text>

                    <rect x="145" y="165" width="110" height="26" rx="8" fill="#0f172a" opacity="0.9" />
                    <text fill="#fde047" fontSize="13" fontWeight="900" x="200" y="183" textAnchor="middle">EF Doğrusu ↔️</text>

                    <defs>
                      <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#312e81" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}

                {/* SCENE: SELIMIYE PLAN (MAT.5.3.2) */}
                {currentPage.visualScene.type === 'selimiye-plan' && (
                  <svg className="w-full h-full" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#0f172a" />
                    {/* Architectural Blueprint Grid */}
                    <defs>
                      <pattern id="arch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="400" height="280" fill="url(#arch-grid)" />

                    {/* Central Dome Circle */}
                    <circle cx="200" cy="140" r="75" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="4,4" />
                    <circle cx="200" cy="140" r="50" fill="#0369a1" opacity="0.3" />
                    <circle cx="200" cy="140" r="25" fill="none" stroke="#38bdf8" strokeWidth="1.5" />

                    {/* Octagonal Pillars */}
                    <rect x="120" y="80" width="12" height="12" fill="#f59e0b" rx="2" />
                    <rect x="268" y="80" width="12" height="12" fill="#f59e0b" rx="2" />
                    <rect x="120" y="188" width="12" height="12" fill="#f59e0b" rx="2" />
                    <rect x="268" y="188" width="12" height="12" fill="#f59e0b" rx="2" />

                    {/* Radial Ray Lines from Center */}
                    <line x1="200" y1="140" x2="350" y2="40" stroke="#fde047" strokeWidth="2" strokeDasharray="3,3" />
                    <line x1="200" y1="140" x2="50" y2="40" stroke="#fde047" strokeWidth="2" strokeDasharray="3,3" />
                    <line x1="200" y1="140" x2="350" y2="240" stroke="#fde047" strokeWidth="2" strokeDasharray="3,3" />
                    <line x1="200" y1="140" x2="50" y2="240" stroke="#fde047" strokeWidth="2" strokeDasharray="3,3" />

                    {/* Interactive Dome Center */}
                    <circle cx="200" cy="140" r="8" fill="#10b396" stroke="#ffffff" strokeWidth="2.5" className="animate-pulse" />
                    <text fill="#ffffff" fontSize="13" fontWeight="900" x="200" y="125" textAnchor="middle">Merkez (O) Noktası</text>
                    <text fill="#38bdf8" fontSize="10" fontWeight="bold" x="200" y="245" textAnchor="middle">🏛️ Selimiye Kubbe Planı ve Işınsal Doğrultular</text>
                  </svg>
                )}

                {/* SCENE: RAY ANGLE (MAT.5.3.2) */}
                {currentPage.visualScene.type === 'ray-angle' && (
                  <svg className="w-full h-full" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#090d16" />
                    {/* Dome Arch */}
                    <path d="M 60 260 C 60 100, 340 100, 340 260" fill="none" stroke="#334155" strokeWidth="4" />
                    {/* Window Lamp O */}
                    <circle cx="200" cy="200" r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                    <text fill="#fde047" fontSize="13" fontWeight="900" x="200" y="230" textAnchor="middle">Ortak Başlangıç (O)</text>

                    {/* Ray 1 [OA */}
                    <line x1="200" y1="200" x2="70" y2="70" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                    <polygon points="60,60 78,65 72,82" fill="#38bdf8" />
                    <text fill="#38bdf8" fontSize="12" fontWeight="900" x="90" y="60">[OA Işını</text>

                    {/* Ray 2 [OB */}
                    <line x1="200" y1="200" x2="330" y2="70" stroke="#fde047" strokeWidth="4" strokeLinecap="round" />
                    <polygon points="340,60 322,65 328,82" fill="#fde047" />
                    <text fill="#fde047" fontSize="12" fontWeight="900" x="310" y="60">[OB Işını</text>

                    {/* Dynamic Angle Arc */}
                    <path d="M 160 160 Q 200 135 240 160" fill="none" stroke="#ec4899" strokeWidth="3" />
                    <rect x="165" y="110" width="70" height="24" rx="6" fill="#831843" />
                    <text fill="#fbcfe8" fontSize="11" fontWeight="900" x="200" y="126" textAnchor="middle">Açı ∠AOB</text>

                    <text fill="#94a3b8" fontSize="10" fontStyle="italic" x="200" y="260" textAnchor="middle">İki ışının başlangıcı birleşince AÇI oluşur</text>
                  </svg>
                )}

                {/* SCENE: PERPENDICULAR PARALLEL MINARETS */}
                {currentPage.visualScene.type === 'perpendicular-parallel' && (
                  <svg className="w-full h-full" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#0f172a" />
                    {/* Base ground line */}
                    <line x1="20" y1="230" x2="380" y2="230" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
                    <text fill="#94a3b8" fontSize="11" fontWeight="bold" x="385" y="234">Taban Doğrusu (t)</text>

                    {/* Left Minaret Line d1 */}
                    <line x1="120" y1="230" x2="120" y2="40" stroke="#10b396" strokeWidth="5" />
                    <polygon points="120,25 113,42 127,42" fill="#10b396" />
                    <rect x="120" y="212" width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="129" cy="221" r="2" fill="#f59e0b" />
                    <text fill="#10b396" fontSize="13" fontWeight="900" x="120" y="20" textAnchor="middle">Minare 1 (d1)</text>

                    {/* Right Minaret Line d2 */}
                    <line x1="280" y1="230" x2="280" y2="40" stroke="#10b396" strokeWidth="5" />
                    <polygon points="280,25 273,42 287,42" fill="#10b396" />
                    <rect x="280" y="212" width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="289" cy="221" r="2" fill="#f59e0b" />
                    <text fill="#10b396" fontSize="13" fontWeight="900" x="280" y="20" textAnchor="middle">Minare 2 (d2)</text>

                    {/* Parallel Distance Arrows */}
                    <line x1="125" y1="120" x2="275" y2="120" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" />
                    <rect x="160" y="105" width="80" height="26" rx="8" fill="#0c4a6e" stroke="#0284c7" />
                    <text fill="#38bdf8" fontSize="11" fontWeight="900" x="200" y="122" textAnchor="middle">d1 // d2 (Paralel)</text>

                    <text fill="#fde047" fontSize="10" fontWeight="bold" x="200" y="260" textAnchor="middle">Aynı tabana dik (90°) olan minareler asla kesişmez!</text>
                  </svg>
                )}

                {/* SCENE: MAT.5.3.2 - STRAIGHTEDGE TWO POINTS */}
                {currentPage.visualScene.type === 'straightedge-twopoints' && (
                  <svg className="w-full h-full" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#0f172a" />
                    {/* Grid */}
                    <defs>
                      <pattern id="grid-p1" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="400" height="280" fill="url(#grid-p1)" />

                    {/* Straightedge Body (Wood texture styling) */}
                    <rect x="30" y="125" width="340" height="32" rx="4" fill="#78350f" stroke="#d97706" strokeWidth="2" opacity="0.85" />
                    <text fill="#fbbf24" fontSize="10" fontWeight="900" x="200" y="145" textAnchor="middle">📏 ÖLÇÜSÜZ CETVEL (Çizim Doğrultusu)</text>

                    {/* Extended Line through A and B */}
                    <line x1="20" y1="125" x2="380" y2="125" stroke="#38bdf8" strokeWidth="4" />
                    <polygon points="10,125 25,120 25,130" fill="#38bdf8" />
                    <polygon points="390,125 375,120 375,130" fill="#38bdf8" />

                    {/* Point A */}
                    <circle cx="110" cy="125" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                    <text fill="#ffffff" fontSize="14" fontWeight="900" x="110" y="105" textAnchor="middle">A</text>

                    {/* Point B */}
                    <circle cx="290" cy="125" r="7" fill="#10b396" stroke="#ffffff" strokeWidth="2" />
                    <text fill="#ffffff" fontSize="14" fontWeight="900" x="290" y="105" textAnchor="middle">B</text>

                    {/* Inference Badge */}
                    <rect x="70" y="180" width="260" height="36" rx="10" fill="#042f2e" stroke="#10b396" />
                    <text fill="#5ee7cc" fontSize="11" fontWeight="bold" x="200" y="202" textAnchor="middle">
                      ✨ A ve B noktalarından yalnız 1 doğru geçer!
                    </text>
                    <text fill="#94a3b8" fontSize="10" x="200" y="250" textAnchor="middle">
                      Cetvel yönü sabittir; 2. bir düz doğru çizilemez.
                    </text>
                  </svg>
                )}

                {/* SCENE: MAT.5.3.2 - COMPASS CIRCLE & RAY */}
                {currentPage.visualScene.type === 'compass-circle-ray' && (
                  <svg className="w-full h-full" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#0f172a" />
                    {/* Circle Center O */}
                    <circle cx="140" cy="130" r="70" fill="rgba(14, 165, 233, 0.12)" stroke="#38bdf8" strokeWidth="2.5" />
                    <circle cx="140" cy="130" r="6" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                    <text fill="#fde047" fontSize="12" fontWeight="900" x="140" y="115" textAnchor="middle">Merkez (O)</text>

                    {/* Radii r */}
                    <line x1="140" y1="130" x2="210" y2="130" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="210" cy="130" r="4" fill="#38bdf8" />
                    <text fill="#ffffff" fontSize="10" fontWeight="bold" x="220" y="134">K</text>
                    <text fill="#fde047" fontSize="10" fontWeight="bold" x="175" y="122">r</text>

                    <line x1="140" y1="130" x2="140" y2="60" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="140" cy="60" r="4" fill="#38bdf8" />
                    <text fill="#ffffff" fontSize="10" fontWeight="bold" x="140" y="52" textAnchor="middle">L</text>
                    <text fill="#fde047" fontSize="10" fontWeight="bold" x="148" y="95">r</text>

                    <line x1="140" y1="130" x2="90" y2="179" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="90" cy="179" r="4" fill="#38bdf8" />
                    <text fill="#ffffff" fontSize="10" fontWeight="bold" x="80" y="195">M</text>
                    <text fill="#fde047" fontSize="10" fontWeight="bold" x="110" y="160">r</text>

                    {/* Ray with stepped compass cuts */}
                    <g transform="translate(240, 60)">
                      <rect width="145" height="150" rx="10" fill="#1e293b" stroke="#334155" />
                      <text fill="#10b396" fontSize="10" fontWeight="900" x="72" y="20" textAnchor="middle">Işında Eşit Parçalar</text>
                      
                      {/* Ray line */}
                      <line x1="15" y1="70" x2="135" y2="70" stroke="#10b396" strokeWidth="3" />
                      <polygon points="140,70 130,66 130,74" fill="#10b396" />

                      {/* Marks A, B, C */}
                      <circle cx="25" cy="70" r="4" fill="#f59e0b" />
                      <text fill="#fff" fontSize="9" fontWeight="bold" x="25" y="90" textAnchor="middle">A</text>

                      {/* Compass arc 1 */}
                      <path d="M 60 55 A 20 20 0 0 1 60 85" fill="none" stroke="#f43f5e" strokeWidth="2" />
                      <circle cx="60" cy="70" r="3.5" fill="#10b396" />
                      <text fill="#fff" fontSize="9" fontWeight="bold" x="60" y="90" textAnchor="middle">B</text>

                      {/* Compass arc 2 */}
                      <path d="M 95 55 A 20 20 0 0 1 95 85" fill="none" stroke="#f43f5e" strokeWidth="2" />
                      <circle cx="95" cy="70" r="3.5" fill="#10b396" />
                      <text fill="#fff" fontSize="9" fontWeight="bold" x="95" y="90" textAnchor="middle">C</text>

                      <text fill="#5ee7cc" fontSize="9" fontWeight="bold" x="72" y="120" textAnchor="middle">|AB| = |BC| = r</text>
                      <text fill="#94a3b8" fontSize="8" x="72" y="136" textAnchor="middle">Pergel açıklığı sabit</text>
                    </g>

                    <rect x="50" y="225" width="300" height="30" rx="8" fill="#042f2e" stroke="#10b396" />
                    <text fill="#5ee7cc" fontSize="11" fontWeight="bold" x="200" y="244" textAnchor="middle">
                      Pergel açıklığı yarıçapı korur: Tüm yarıçaplar eşittir (|OK|=|OL|=|OM|).
                    </text>
                  </svg>
                )}

                {/* SCENE: MAT.5.3.2 - ANGLE COMPASS CUT */}
                {currentPage.visualScene.type === 'angle-compass-cut' && (
                  <svg className="w-full h-full" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#0f172a" />
                    {/* Angle Arms from Vertex A */}
                    <circle cx="70" cy="200" r="6" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                    <text fill="#fde047" fontSize="13" fontWeight="900" x="60" y="222">Köşe (A)</text>

                    {/* Bottom Arm */}
                    <line x1="70" y1="200" x2="350" y2="200" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                    <polygon points="360,200 345,195 345,205" fill="#38bdf8" />
                    <text fill="#38bdf8" fontSize="11" fontWeight="bold" x="350" y="220">1. Kol</text>

                    {/* Slanted Arm (40 deg) */}
                    <line x1="70" y1="200" x2="290" y2="50" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                    <polygon points="298,44 282,53 291,65" fill="#38bdf8" />
                    <text fill="#38bdf8" fontSize="11" fontWeight="bold" x="305" y="45">2. Kol</text>

                    {/* Compass Arc 1 (Radius 100) */}
                    <path d="M 170 200 A 100 100 0 0 0 146.6 123.4" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeDasharray="3,3" />
                    <circle cx="170" cy="200" r="5" fill="#ec4899" />
                    <text fill="#fbcfe8" fontSize="11" fontWeight="900" x="170" y="190">D</text>
                    <circle cx="146.6" cy="147.6" r="5" fill="#ec4899" />
                    <text fill="#fbcfe8" fontSize="11" fontWeight="900" x="135" y="145">E</text>

                    {/* Compass Arc 2 (Radius 180) */}
                    <path d="M 250 200 A 180 180 0 0 0 207.8 84.1" fill="none" stroke="#10b396" strokeWidth="2.5" strokeDasharray="3,3" />
                    <circle cx="250" cy="200" r="5" fill="#10b396" />
                    <text fill="#5ee7cc" fontSize="11" fontWeight="900" x="250" y="190">F</text>
                    <circle cx="207.8" cy="105.7" r="5" fill="#10b396" />
                    <text fill="#5ee7cc" fontSize="11" fontWeight="900" x="195" y="100">G</text>

                    {/* Badge */}
                    <rect x="60" y="235" width="280" height="32" rx="8" fill="#1e1e38" stroke="#ec4899" />
                    <text fill="#fbcfe8" fontSize="11" fontWeight="bold" x="200" y="255" textAnchor="middle">
                      Pergel ile her iki kolda |AD| = |AE| ve |DF| = |EG| eşitliği kurulur.
                    </text>
                  </svg>
                )}

                {/* SCENE: MAT.5.3.2 - SET SQUARE PERPENDICULAR */}
                {currentPage.visualScene.type === 'setsquare-perpendicular' && (
                  <svg className="w-full h-full" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#0f172a" />
                    
                    {/* Base Line d */}
                    <line x1="30" y1="210" x2="370" y2="210" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
                    <polygon points="20,210 35,205 35,215" fill="#64748b" />
                    <polygon points="380,210 365,205 365,215" fill="#64748b" />
                    <text fill="#94a3b8" fontSize="12" fontWeight="bold" x="385" y="214">Doğru (d)</text>

                    {/* Outside Point P */}
                    <circle cx="200" cy="65" r="7" fill="#f59e0b" stroke="#fff" strokeWidth="2" className="animate-pulse" />
                    <text fill="#fde047" fontSize="14" fontWeight="900" x="200" y="50" textAnchor="middle">Dış Nokta P</text>

                    {/* Set Square (Gönye) Overlay Shape */}
                    <polygon points="200,210 200,65 310,210" fill="rgba(14, 165, 233, 0.2)" stroke="#38bdf8" strokeWidth="2" />
                    <text fill="#38bdf8" fontSize="10" fontWeight="900" x="240" y="160">GÖNYE</text>

                    {/* Perpendicular Line PH */}
                    <line x1="200" y1="65" x2="200" y2="210" stroke="#10b396" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="200" cy="210" r="5" fill="#10b396" />
                    <text fill="#5ee7cc" fontSize="12" fontWeight="bold" x="212" y="225">H (Ayak)</text>

                    {/* 90 Degree Angle Square */}
                    <rect x="200" y="192" width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="209" cy="201" r="2.5" fill="#f59e0b" />
                    <text fill="#f59e0b" fontSize="10" fontWeight="900" x="225" y="200">90°</text>

                    {/* Badge */}
                    <rect x="50" y="238" width="300" height="30" rx="8" fill="#042f2e" stroke="#10b396" />
                    <text fill="#5ee7cc" fontSize="11" fontWeight="bold" x="200" y="257" textAnchor="middle">
                      Bir doğruya dışındaki P noktasından YALNIZ BİR dikme [PH] ⊥ d çizilebilir!
                    </text>
                  </svg>
                )}

                {/* SCENE: MAT.5.3.2 - PARALLEL TRACKS */}
                {currentPage.visualScene.type === 'parallel-tracks' && (
                  <svg className="w-full h-full" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#0f172a" />

                    {/* Rail 1 (Base Line d1) */}
                    <line x1="30" y1="180" x2="370" y2="180" stroke="#10b396" strokeWidth="5" />
                    <polygon points="20,180 35,175 35,185" fill="#10b396" />
                    <polygon points="380,180 365,175 365,185" fill="#10b396" />
                    <text fill="#10b396" fontSize="12" fontWeight="900" x="385" y="184">d1 (1. Ray)</text>

                    {/* Rail 2 (Parallel Line d2) */}
                    <line x1="30" y1="90" x2="370" y2="90" stroke="#38bdf8" strokeWidth="5" />
                    <polygon points="20,90 35,85 35,95" fill="#38bdf8" />
                    <polygon points="380,90 365,85 365,95" fill="#38bdf8" />
                    <text fill="#38bdf8" fontSize="12" fontWeight="900" x="385" y="94">d2 (2. Ray)</text>

                    {/* Equal Perpendicular Set Square Measurements */}
                    {[90, 200, 310].map((x, i) => (
                      <g key={i}>
                        {/* Tie line */}
                        <line x1={x} y1="90" x2={x} y2="180" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3,3" />
                        {/* 90 deg corner */}
                        <rect x={x} y="166" width="14" height="14" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                        <circle cx={x + 7} cy="173" r="1.5" fill="#f59e0b" />
                        {/* Point on d2 */}
                        <circle cx={x} cy="90" r="5" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" />
                        {/* Point on d1 */}
                        <circle cx={x} cy="180" r="5" fill="#10b396" stroke="#fff" strokeWidth="1.5" />
                        {/* Distance Label */}
                        <rect x={x - 18} y="125" width="36" height="18" rx="4" fill="#0f172a" stroke="#f59e0b" />
                        <text fill="#fde047" fontSize="9" fontWeight="900" x={x} y="137" textAnchor="middle">h=4 cm</text>
                      </g>
                    ))}

                    <text fill="#fde047" fontSize="14" fontWeight="900" x="200" y="45" textAnchor="middle">
                      🚂 Tren Rayı Modeli: d1 // d2 (Paralel Doğrular)
                    </text>

                    {/* Badge */}
                    <rect x="50" y="225" width="300" height="35" rx="10" fill="#042f2e" stroke="#10b396" />
                    <text fill="#5ee7cc" fontSize="11" fontWeight="bold" x="200" y="242" textAnchor="middle">
                      Eşit uzaklıktaki dikmeler birleştirilince paralel doğru oluşur.
                    </text>
                    <text fill="#94a3b8" fontSize="9" x="200" y="254" textAnchor="middle">
                      Doğrular uzatılsa bile aralarındaki mesafe (h) asla değişmez, kesişmezler.
                    </text>
                  </svg>
                )}

                {/* SCENE: PROTRACTOR TOOL (MAT.5.3.3) */}
                {currentPage.visualScene.type === 'protractor-tool' && (
                  <svg className="w-full h-full" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#0f172a" />
                    {/* Background Grid */}
                    <defs>
                      <pattern id="grid-proto" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="400" height="280" fill="url(#grid-proto)" />

                    {/* Protractor Semi-Circle Body */}
                    <path d="M 60 210 A 140 140 0 0 1 340 210 Z" fill="#0284c7" fillOpacity="0.18" stroke="#38bdf8" strokeWidth="2.5" />
                    <path d="M 120 210 A 80 80 0 0 1 280 210 Z" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />

                    {/* Protractor Radial Ticks & Degree Labels */}
                    {[0, 30, 45, 60, 90, 120, 135, 150, 180].map((deg) => {
                      const rad = (180 - deg) * (Math.PI / 180);
                      const x1 = 200 + 130 * Math.cos(rad);
                      const y1 = 210 - 130 * Math.sin(rad);
                      const x2 = 200 + 140 * Math.cos(rad);
                      const y2 = 210 - 140 * Math.sin(rad);
                      const tx = 200 + 112 * Math.cos(rad);
                      const ty = 210 - 112 * Math.sin(rad);
                      return (
                        <g key={deg}>
                          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={deg % 90 === 0 ? "2.5" : "1.5"} />
                          <text x={tx} y={ty + 4} fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">{deg}°</text>
                        </g>
                      );
                    })}

                    {/* Measured Angle: Ray OA (0°) */}
                    <line x1="200" y1="210" x2="360" y2="210" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                    <polygon points="365,210 350,205 350,215" fill="#f59e0b" />
                    <text fill="#f59e0b" fontSize="11" fontWeight="bold" x="350" y="230">[OA Kolu (0° Tabanı)</text>

                    {/* Measured Angle: Ray OB (60°) */}
                    <line x1="200" y1="210" x2="270" y2="88" stroke="#10b396" strokeWidth="4" strokeLinecap="round" />
                    <polygon points="274,80 260,90 272,97" fill="#10b396" />
                    <text fill="#10b396" fontSize="11" fontWeight="bold" x="280" y="78">[OB Kolu</text>

                    {/* Angle Arc 60° */}
                    <path d="M 245 210 A 45 45 0 0 0 222.5 171" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <rect x="235" y="155" width="48" height="22" rx="6" fill="#be123c" />
                    <text fill="#ffffff" fontSize="11" fontWeight="900" x="259" y="170" textAnchor="middle">60°</text>

                    {/* Center Point O */}
                    <circle cx="200" cy="210" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                    <text fill="#ffffff" fontSize="11" fontWeight="900" x="200" y="232" textAnchor="middle">Merkez (O)</text>
                    <text fill="#38bdf8" fontSize="11" fontWeight="bold" x="200" y="265" textAnchor="middle">📐 İletki ile Doğru Açı Ölçümü</text>
                  </svg>
                )}

                {/* SCENE: ANGLE CLASSIFICATION (MAT.5.3.3) */}
                {currentPage.visualScene.type === 'angle-classification' && (
                  <svg className="w-full h-full" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#0b1329" />
                    
                    {/* 4 Quadrants Grid */}
                    <line x1="200" y1="10" x2="200" y2="270" stroke="#1e293b" strokeWidth="2" strokeDasharray="3,3" />
                    <line x1="10" y1="140" x2="390" y2="140" stroke="#1e293b" strokeWidth="2" strokeDasharray="3,3" />

                    {/* 1. DAR AÇI (45°) - Top Left */}
                    <g transform="translate(20, 20)">
                      <rect width="165" height="105" rx="10" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
                      <text x="12" y="22" fill="#38bdf8" fontSize="11" fontWeight="900">🔹 DAR AÇI (45°)</text>
                      <text x="12" y="36" fill="#94a3b8" fontSize="9">0° &lt; Ölçü &lt; 90°</text>
                      {/* Angle Drawing */}
                      <line x1="40" y1="90" x2="130" y2="90" stroke="#38bdf8" strokeWidth="2.5" />
                      <line x1="40" y1="90" x2="105" y2="45" stroke="#38bdf8" strokeWidth="2.5" />
                      <path d="M 65 90 A 25 25 0 0 0 58 72" fill="none" stroke="#f43f5e" strokeWidth="2" />
                      <circle cx="40" cy="90" r="3.5" fill="#f59e0b" />
                    </g>

                    {/* 2. DİK AÇI (90°) - Top Right */}
                    <g transform="translate(215, 20)">
                      <rect width="165" height="105" rx="10" fill="#0f172a" stroke="#10b396" strokeWidth="1.5" />
                      <text x="12" y="22" fill="#34d399" fontSize="11" fontWeight="900">🟩 DİK AÇI (90°)</text>
                      <text x="12" y="36" fill="#94a3b8" fontSize="9">Ölçü = 90° [⊥]</text>
                      {/* Angle Drawing */}
                      <line x1="40" y1="90" x2="130" y2="90" stroke="#10b396" strokeWidth="2.5" />
                      <line x1="40" y1="90" x2="40" y2="35" stroke="#10b396" strokeWidth="2.5" />
                      <rect x="40" y="74" width="16" height="16" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                      <circle cx="48" cy="82" r="2" fill="#f59e0b" />
                      <circle cx="40" cy="90" r="3.5" fill="#f59e0b" />
                    </g>

                    {/* 3. GENİŞ AÇI (135°) - Bottom Left */}
                    <g transform="translate(20, 150)">
                      <rect width="165" height="105" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                      <text x="12" y="22" fill="#fbbf24" fontSize="11" fontWeight="900">🔸 GENİŞ AÇI (135°)</text>
                      <text x="12" y="36" fill="#94a3b8" fontSize="9">90° &lt; Ölçü &lt; 180°</text>
                      {/* Angle Drawing */}
                      <line x1="90" y1="90" x2="155" y2="90" stroke="#fbbf24" strokeWidth="2.5" />
                      <line x1="90" y1="90" x2="35" y2="45" stroke="#fbbf24" strokeWidth="2.5" />
                      <path d="M 115 90 A 25 25 0 0 0 72 72" fill="none" stroke="#f43f5e" strokeWidth="2" />
                      <circle cx="90" cy="90" r="3.5" fill="#f59e0b" />
                    </g>

                    {/* 4. DOĞRU AÇI (180°) - Bottom Right */}
                    <g transform="translate(215, 150)">
                      <rect width="165" height="105" rx="10" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
                      <text x="12" y="22" fill="#c084fc" fontSize="11" fontWeight="900">🟣 DOĞRU AÇI (180°)</text>
                      <text x="12" y="36" fill="#94a3b8" fontSize="9">Ölçü = 180° (Doğru)</text>
                      {/* Angle Drawing */}
                      <line x1="20" y1="75" x2="145" y2="75" stroke="#c084fc" strokeWidth="2.5" />
                      <path d="M 105 75 A 25 25 0 0 0 55 75" fill="none" stroke="#f43f5e" strokeWidth="2" />
                      <circle cx="80" cy="75" r="3.5" fill="#f59e0b" />
                      <text x="80" y="60" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">180°</text>
                    </g>
                  </svg>
                )}

                {/* SCENE 5: SUMMARY CHART */}
                {currentPage.visualScene.type === 'summary-chart' && (
                  <div className="w-full h-full p-3 grid grid-cols-2 gap-2 text-white overflow-hidden text-center text-xs">
                    <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700 flex flex-col justify-between">
                      <div className="font-extrabold text-teal-400">📏 ÖLÇÜLEBİLİRLİK</div>
                      <div className="text-[11px] text-slate-300">Yalnızca iki ucu sınırlı Doğru Parçası ölçülebilir.</div>
                      <div className="font-mono bg-slate-950 py-0.5 rounded text-[10px] text-teal-200">|AB| = net sayı</div>
                    </div>

                    <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700 flex flex-col justify-between">
                      <div className="font-extrabold text-amber-400">📐 AÇI İNŞASI</div>
                      <div className="text-[11px] text-slate-300">Ortak başlangıç noktalı iki ışın açı oluşturur.</div>
                      <div className="font-mono bg-slate-950 py-0.5 rounded text-[10px] text-amber-200">[OA ∪ [OB = ∠AOB</div>
                    </div>

                    <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700 flex flex-col justify-between">
                      <div className="font-extrabold text-blue-400">⊥ DİKLİK</div>
                      <div className="text-[11px] text-slate-300">Doğruya dik çizilen doğru 90° açı yapar.</div>
                      <div className="font-mono bg-slate-950 py-0.5 rounded text-[10px] text-blue-200">d1 ⊥ taban (90°)</div>
                    </div>

                    <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700 flex flex-col justify-between">
                      <div className="font-extrabold text-purple-400">// PARALELLİK</div>
                      <div className="text-[11px] text-slate-300">Aynı doğruya dik iki doğru asla kesişmez.</div>
                      <div className="font-mono bg-slate-950 py-0.5 rounded text-[10px] text-purple-200">d1 // d2</div>
                    </div>
                  </div>
                )}

                {/* SCENE 6: INTERSECTING LINES & VERTICAL/OPPOSITE ANGLES (MAT.5.3.4) */}
                {currentPage.visualScene.type === 'intersecting-lines' && (
                  <svg className="w-full h-full cursor-pointer" viewBox="0 0 400 280" onClick={() => { setScene41Tested(!scene41Tested); playSound('select'); }}>
                    <rect width="400" height="280" fill="#0b1329" />
                    {/* Background City/Blueprint Grid */}
                    <path d="M 0 70 L 400 70 M 0 140 L 400 140 M 0 210 L 400 210" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
                    <path d="M 100 0 L 100 280 M 200 0 L 200 280 M 300 0 L 300 280" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />

                    {/* Intersection Center (200, 140) */}
                    {/* Line 1 (d1 - Cyan) */}
                    <line x1="30" y1="140" x2="370" y2="140" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" />
                    <text x="375" y="144" fill="#00f0ff" fontSize="13" fontWeight="900">d₁</text>

                    {/* Line 2 (d2 - Amber, angle ~55 deg) */}
                    <line x1="90" y1="240" x2="310" y2="40" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                    <text x="315" y="38" fill="#f59e0b" fontSize="13" fontWeight="900">d₂</text>

                    {/* Angle Arcs */}
                    {/* a1 (Right-Top, 65°) */}
                    <path d="M 245 140 A 45 45 0 0 0 225 100" fill="none" stroke="#10b981" strokeWidth="3" />
                    <text x="250" y="125" fill="#10b981" fontSize="12" fontWeight="bold">a = 65°</text>

                    {/* a3 (Left-Bottom, 65° - Opposite / Ters) */}
                    <path d="M 155 140 A 45 45 0 0 0 175 180" fill="none" stroke="#10b981" strokeWidth="3" />
                    <text x="140" y="165" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="end">c = 65°</text>

                    {/* a2 (Left-Top, 115°) */}
                    <path d="M 160 140 A 40 40 0 0 1 225 100" fill="none" stroke="#ec4899" strokeWidth="3" />
                    <text x="175" y="105" fill="#ec4899" fontSize="12" fontWeight="bold" textAnchor="end">b = 115°</text>

                    {/* a4 (Right-Bottom, 115° - Opposite / Ters) */}
                    <path d="M 240 140 A 40 40 0 0 1 175 180" fill="none" stroke="#ec4899" strokeWidth="3" />
                    <text x="220" y="185" fill="#ec4899" fontSize="12" fontWeight="bold">d = 115°</text>

                    {/* Center Vertex O */}
                    <circle cx="200" cy="140" r="6" fill="#ffffff" stroke="#00f0ff" strokeWidth="2.5" />
                    <text x="200" y="160" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">O</text>

                    {/* Highlight Pill on Click */}
                    <g transform="translate(200, 255)">
                      <rect x="-140" y="-14" width="280" height="24" rx="8" fill="#042f2e" stroke="#10b981" strokeWidth="1.5" />
                      <text x="0" y="3" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
                        ✨ Ters Açılar: a = c (65°) ve b = d (115°) Eşittir!
                      </text>
                    </g>
                  </svg>
                )}

                {/* SCENE 7: SUPPLEMENTARY ANGLES (MAT.5.3.4) */}
                {currentPage.visualScene.type === 'supplementary-angles' && (
                  <svg className="w-full h-full cursor-pointer" viewBox="0 0 400 280" onClick={() => { setScene42Tested(!scene42Tested); playSound('select'); }}>
                    <rect width="400" height="280" fill="#0b1329" />
                    {/* Ground line d1 */}
                    <line x1="40" y1="180" x2="360" y2="180" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" />
                    <text x="365" y="184" fill="#00f0ff" fontSize="12" fontWeight="bold">d₁ (Doğru)</text>

                    {/* Splitting Ray [OC (Gold) */}
                    <line x1="200" y1="180" x2="130" y2="60" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="130" cy="60" r="5" fill="#f59e0b" />
                    <text x="120" y="50" fill="#f59e0b" fontSize="12" fontWeight="900">C [Ortak Kol]</text>

                    {/* Vertex O */}
                    <circle cx="200" cy="180" r="6" fill="#ffffff" stroke="#00f0ff" strokeWidth="2.5" />
                    <text x="200" y="202" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">O (Köşe)</text>

                    {/* Left Angle (120° - Cyan) */}
                    <path d="M 140 180 A 60 60 0 0 1 170 125" fill="none" stroke="#06b6d4" strokeWidth="3.5" />
                    <text x="145" y="145" fill="#06b6d4" fontSize="13" fontWeight="bold" textAnchor="middle">a = 120°</text>

                    {/* Right Angle (60° - Amber) */}
                    <path d="M 260 180 A 60 60 0 0 0 170 125" fill="none" stroke="#f59e0b" strokeWidth="3.5" />
                    <text x="235" y="150" fill="#f59e0b" fontSize="13" fontWeight="bold" textAnchor="middle">b = 60°</text>

                    {/* Semicircle 180° Top Arch */}
                    <path d="M 280 180 A 80 80 0 0 0 120 180" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" />
                    <text x="200" y="95" fill="#c084fc" fontSize="11" fontWeight="bold" textAnchor="middle">Doğru Açı (180°)</text>

                    {/* Bottom Formula Banner */}
                    <g transform="translate(200, 245)">
                      <rect x="-150" y="-14" width="300" height="26" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                      <text x="0" y="4" fill="#a5b4fc" fontSize="11" fontWeight="black" textAnchor="middle">
                        ➕ Komşu Bütünler: a + b = 120° + 60° = 180°
                      </text>
                    </g>
                  </svg>
                )}

                {/* SCENE 8: PERPENDICULAR & COMPLEMENTARY (MAT.5.3.4) */}
                {currentPage.visualScene.type === 'perpendicular-complementary' && (
                  <svg className="w-full h-full cursor-pointer" viewBox="0 0 400 280" onClick={() => { setScene43Tested(!scene43Tested); playSound('select'); }}>
                    <rect width="400" height="280" fill="#0b1329" />
                    
                    {/* Base ground d1 */}
                    <line x1="50" y1="200" x2="350" y2="200" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" />
                    <text x="355" y="204" fill="#00f0ff" fontSize="12" fontWeight="bold">d₁</text>

                    {/* Vertical Perpendicular Column d2 */}
                    <line x1="200" y1="40" x2="200" y2="240" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" />
                    <text x="200" y="30" fill="#00f0ff" fontSize="12" fontWeight="900" textAnchor="middle">d₂ (⊥ Dik)</text>

                    {/* Right Angle Marker (Square + Dot) */}
                    <rect x="180" y="180" width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2" />
                    <circle cx="190" cy="190" r="2.5" fill="#10b981" />

                    {/* Splitting Ray [OC in quadrant 1 */}
                    <line x1="200" y1="200" x2="290" y2="110" stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="5,5" />
                    <circle cx="290" cy="110" r="5" fill="#f59e0b" />
                    <text x="300" y="110" fill="#f59e0b" fontSize="12" fontWeight="bold">C [Işın]</text>

                    {/* Angle x (45°) and Angle y (45°) */}
                    <path d="M 250 200 A 50 50 0 0 0 265 135" fill="none" stroke="#06b6d4" strokeWidth="3" />
                    <text x="260" y="185" fill="#06b6d4" fontSize="12" fontWeight="bold">x = 35°</text>

                    <path d="M 265 135 A 50 50 0 0 0 200 150" fill="none" stroke="#ec4899" strokeWidth="3" />
                    <text x="235" y="140" fill="#ec4899" fontSize="12" fontWeight="bold">y = 55°</text>

                    {/* Center O */}
                    <circle cx="200" cy="200" r="6" fill="#ffffff" stroke="#00f0ff" strokeWidth="2.5" />
                    <text x="188" y="222" fill="#ffffff" fontSize="12" fontWeight="bold">O</text>

                    {/* Banner */}
                    <g transform="translate(200, 255)">
                      <rect x="-140" y="-14" width="280" height="24" rx="8" fill="#042f2e" stroke="#10b981" strokeWidth="1.5" />
                      <text x="0" y="3" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
                        📐 Dik Kesişim (⊥ 90°) • Tümler: x + y = 90°
                      </text>
                    </g>
                  </svg>
                )}

                {/* SCENE 9: PARALLEL LINES & NO ANGLE (MAT.5.3.4) */}
                {currentPage.visualScene.type === 'parallel-lines-noangle' && (
                  <svg className="w-full h-full cursor-pointer" viewBox="0 0 400 280" onClick={() => { setScene44Tested(!scene44Tested); playSound('select'); }}>
                    <rect width="400" height="280" fill="#0b1329" />
                    
                    {/* Upper Cable d1 */}
                    <line x1="40" y1="90" x2="360" y2="90" stroke="#00f0ff" strokeWidth="4.5" strokeLinecap="round" />
                    <text x="365" y="94" fill="#00f0ff" fontSize="13" fontWeight="900">d₁ (Üst Halat)</text>

                    {/* Lower Cable d2 */}
                    <line x1="40" y1="180" x2="360" y2="180" stroke="#00f0ff" strokeWidth="4.5" strokeLinecap="round" />
                    <text x="365" y="184" fill="#00f0ff" fontSize="13" fontWeight="900">d₂ (Alt Halat)</text>

                    {/* Vertical Suspension Wires / Distance Indicators */}
                    <line x1="100" y1="90" x2="100" y2="180" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
                    <text x="105" y="140" fill="#f59e0b" fontSize="10" fontWeight="bold">h = 15m</text>

                    <line x1="200" y1="90" x2="200" y2="180" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
                    <text x="205" y="140" fill="#f59e0b" fontSize="10" fontWeight="bold">h = 15m</text>

                    <line x1="300" y1="90" x2="300" y2="180" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
                    <text x="305" y="140" fill="#f59e0b" fontSize="10" fontWeight="bold">h = 15m</text>

                    {/* Extension Arrows */}
                    <text x="45" y="85" fill="#38bdf8" fontSize="14">◀──</text>
                    <text x="340" y="85" fill="#38bdf8" fontSize="14">──▶</text>
                    <text x="45" y="175" fill="#38bdf8" fontSize="14">◀──</text>
                    <text x="340" y="175" fill="#38bdf8" fontSize="14">──▶</text>

                    {/* Banner */}
                    <g transform="translate(200, 240)">
                      <rect x="-165" y="-16" width="330" height="30" rx="10" fill="#1e1b4b" stroke="#c084fc" strokeWidth="1.5" />
                      <text x="0" y="4" fill="#e9d5ff" fontSize="11" fontWeight="black" textAnchor="middle">
                        ⏸️ d₁ // d₂ (Paralel Doğrular Kesişmez • Açı Oluşmaz!)
                      </text>
                    </g>
                  </svg>
                )}

                {/* SCENE 10: TRANSVERSAL ANGLES & 8-ANGLE MODEL (MAT.5.3.4) */}
                {currentPage.visualScene.type === 'transversal-angles' && (
                  <svg className="w-full h-full cursor-pointer" viewBox="0 0 400 280" onClick={() => { setScene45Tested(!scene45Tested); playSound('select'); }}>
                    <rect width="400" height="280" fill="#0b1329" />

                    {/* Parallel line 1 */}
                    <line x1="40" y1="85" x2="360" y2="85" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" />
                    <text x="365" y="89" fill="#00f0ff" fontSize="12" fontWeight="bold">d₁</text>

                    {/* Parallel line 2 */}
                    <line x1="40" y1="185" x2="360" y2="185" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" />
                    <text x="365" y="189" fill="#00f0ff" fontSize="12" fontWeight="bold">d₂ (// d₁)</text>

                    {/* Transversal Line d3 (Amber) */}
                    <line x1="120" y1="240" x2="280" y2="30" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                    <text x="285" y="28" fill="#f59e0b" fontSize="13" fontWeight="900">d₃ (Kesen)</text>

                    {/* Top Intersection Node (235, 85) */}
                    <circle cx="235" cy="85" r="5" fill="#ffffff" />
                    {/* Angles 1, 2, 3, 4 */}
                    <text x="260" y="70" fill="#10b981" fontSize="11" fontWeight="bold">∠1 (65°)</text>
                    <text x="200" y="70" fill="#ec4899" fontSize="11" fontWeight="bold">∠2 (115°)</text>
                    <text x="205" y="105" fill="#10b981" fontSize="11" fontWeight="bold">∠3 (65°)</text>
                    <text x="260" y="105" fill="#ec4899" fontSize="11" fontWeight="bold">∠4 (115°)</text>

                    {/* Bottom Intersection Node (160, 185) */}
                    <circle cx="160" cy="185" r="5" fill="#ffffff" />
                    {/* Angles 5, 6, 7, 8 */}
                    <text x="185" y="170" fill="#10b981" fontSize="11" fontWeight="bold">∠5 (65°)</text>
                    <text x="125" y="170" fill="#ec4899" fontSize="11" fontWeight="bold">∠6 (115°)</text>
                    <text x="130" y="205" fill="#10b981" fontSize="11" fontWeight="bold">∠7 (65°)</text>
                    <text x="185" y="205" fill="#ec4899" fontSize="11" fontWeight="bold">∠8 (115°)</text>

                    {/* Banner */}
                    <g transform="translate(200, 255)">
                      <rect x="-155" y="-14" width="310" height="24" rx="8" fill="#042f2e" stroke="#10b981" strokeWidth="1.5" />
                      <text x="0" y="3" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
                        🌐 Kesen Doğru Paraleller Üzerinde 8 Eş Açı Modeli Kurar!
                      </text>
                    </g>
                  </svg>
                )}

                {/* SCENE 9: 6. SINIF MAT.6.1.1 - KOLİLEME DÜZENİ & ALAN MODELLERİ */}
                {currentPage.visualScene.type === 'factors-area-model' && (
                  <div className="w-full h-full p-3 bg-slate-950 flex flex-col justify-between select-none">
                    {/* Top Configuration Selector */}
                    <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-black text-amber-400 flex items-center gap-1">
                        <span>📦 36 Şişe Koli Düzeni:</span>
                      </span>
                      <div className="flex items-center gap-1">
                        {[
                          { w: 1, h: 36, label: '1×36' },
                          { w: 2, h: 18, label: '2×18' },
                          { w: 3, h: 12, label: '3×12' },
                          { w: 4, h: 9, label: '4×9' },
                          { w: 6, h: 6, label: '6×6' }
                        ].map((cfg, idx) => (
                          <button
                            key={cfg.label}
                            onClick={() => {
                              setSelectedFactorAreaIndex(idx);
                              playSound('select');
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                              selectedFactorAreaIndex === idx
                                ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {cfg.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interactive 2D Grid Visual Scene */}
                    <div className="flex-1 flex items-center justify-center p-2">
                      {(() => {
                        const configs = [
                          { w: 1, h: 36, rows: 1, cols: 36 },
                          { w: 2, h: 18, rows: 2, cols: 18 },
                          { w: 3, h: 12, rows: 3, cols: 12 },
                          { w: 4, h: 9, rows: 4, cols: 9 },
                          { w: 6, h: 6, rows: 6, cols: 6 }
                        ];
                        const active = configs[selectedFactorAreaIndex] || configs[3];

                        return (
                          <div className="flex flex-col items-center gap-2">
                            {/* Dimension Labels */}
                            <div className="flex items-center gap-2 text-xs font-mono font-black text-slate-300">
                              <span className="text-amber-400">{active.rows} Sıra</span>
                              <span>×</span>
                              <span className="text-cyan-400">{active.cols} Sütun</span>
                              <span>=</span>
                              <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                                36 Şişe (Alan)
                              </span>
                            </div>

                            {/* Rendered Box Grid */}
                            <div
                              className="bg-slate-900 border-2 border-amber-500/50 rounded-xl p-2.5 shadow-xl flex flex-col gap-1 max-h-[140px] overflow-auto"
                              style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${active.cols}, minmax(0, 1fr))`,
                                gap: '3px'
                              }}
                            >
                              {Array.from({ length: 36 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[7px] font-bold ${
                                    selectedFactorAreaIndex === 4
                                      ? 'bg-purple-500 text-white'
                                      : 'bg-amber-400/90 text-slate-950'
                                  } shadow-xs transition-transform hover:scale-125`}
                                  title={`Şişe #${i + 1}`}
                                >
                                  🫒
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Bottom Fact Banner */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 text-center text-[10px] text-slate-300">
                      <span className="text-amber-300 font-bold">🎯 Çıkarım: </span>
                      36 sayısının çarpanları (bölenleri):{' '}
                      <span className="font-mono text-emerald-300 font-black">
                        {'{ 1, 2, 3, 4, 6, 9, 12, 18, 36 }'}
                      </span>{' '}
                      (9 Adet firesiz koli düzeni)
                    </div>
                  </div>
                )}

                {/* SCENE 10: 6. SINIF MAT.6.1.1 - ÇARPAN GÖKKUŞAĞI & SİMETRİ YAYLARI */}
                {currentPage.visualScene.type === 'factors-rainbow-arc' && (
                  <svg className="w-full h-full select-none" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#080c1a" />
                    
                    {/* Stars / Dust in Background */}
                    <circle cx="50" cy="40" r="1.5" fill="#fde047" opacity="0.4" />
                    <circle cx="350" cy="50" r="1.5" fill="#fde047" opacity="0.4" />
                    <circle cx="200" cy="20" r="2" fill="#38bdf8" opacity="0.5" />

                    {/* Title Tag */}
                    <rect x="100" y="12" width="200" height="24" rx="12" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.2" />
                    <text x="200" y="28" fill="#c7d2fe" fontSize="11" fontWeight="900" textAnchor="middle">
                      🌈 36 Sayısının Çarpan Gökkuşağı
                    </text>

                    {/* Interactive Rainbow Arcs */}
                    {/* Arc 0: 1 - 36 (Rose) */}
                    <path
                      d="M 50 195 A 150 130 0 0 1 350 195"
                      fill="none"
                      stroke={activeRainbowPair === 0 ? '#f43f5e' : '#f43f5e55'}
                      strokeWidth={activeRainbowPair === 0 ? '4' : '2'}
                      className="cursor-pointer transition-all"
                      onClick={() => { setActiveRainbowPair(0); playSound('select'); }}
                    />
                    {/* Arc 1: 2 - 18 (Amber) */}
                    <path
                      d="M 85 195 A 115 100 0 0 1 315 195"
                      fill="none"
                      stroke={activeRainbowPair === 1 ? '#f59e0b' : '#f59e0b55'}
                      strokeWidth={activeRainbowPair === 1 ? '4' : '2'}
                      className="cursor-pointer transition-all"
                      onClick={() => { setActiveRainbowPair(1); playSound('select'); }}
                    />
                    {/* Arc 2: 3 - 12 (Emerald) */}
                    <path
                      d="M 120 195 A 80 70 0 0 1 280 195"
                      fill="none"
                      stroke={activeRainbowPair === 2 ? '#10b981' : '#10b98155'}
                      strokeWidth={activeRainbowPair === 2 ? '4' : '2'}
                      className="cursor-pointer transition-all"
                      onClick={() => { setActiveRainbowPair(2); playSound('select'); }}
                    />
                    {/* Arc 3: 4 - 9 (Cyan) */}
                    <path
                      d="M 155 195 A 45 40 0 0 1 245 195"
                      fill="none"
                      stroke={activeRainbowPair === 3 ? '#06b6d4' : '#06b6d455'}
                      strokeWidth={activeRainbowPair === 3 ? '4' : '2'}
                      className="cursor-pointer transition-all"
                      onClick={() => { setActiveRainbowPair(3); playSound('select'); }}
                    />
                    {/* Loop 4: 6 x 6 (Purple Heart Loop) */}
                    <circle
                      cx="200"
                      cy="175"
                      r="16"
                      fill={activeRainbowPair === 4 ? '#8b5cf644' : 'none'}
                      stroke={activeRainbowPair === 4 ? '#a855f7' : '#8b5cf655'}
                      strokeWidth={activeRainbowPair === 4 ? '3.5' : '2'}
                      strokeDasharray="3,3"
                      className="cursor-pointer transition-all"
                      onClick={() => { setActiveRainbowPair(4); playSound('select'); }}
                    />

                    {/* Nodes & Factor Numbers along the line */}
                    {[
                      { num: 1, x: 50, pair: 0, color: '#f43f5e' },
                      { num: 2, x: 85, pair: 1, color: '#f59e0b' },
                      { num: 3, x: 120, pair: 2, color: '#10b981' },
                      { num: 4, x: 155, pair: 3, color: '#06b6d4' },
                      { num: 6, x: 200, pair: 4, color: '#a855f7' },
                      { num: 9, x: 245, pair: 3, color: '#06b6d4' },
                      { num: 12, x: 280, pair: 2, color: '#10b981' },
                      { num: 18, x: 315, pair: 1, color: '#f59e0b' },
                      { num: 36, x: 350, pair: 0, color: '#f43f5e' }
                    ].map((node) => {
                      const isActive = activeRainbowPair === node.pair;
                      return (
                        <g
                          key={node.num}
                          className="cursor-pointer"
                          onClick={() => {
                            setActiveRainbowPair(node.pair);
                            playSound('select');
                          }}
                        >
                          <circle
                            cx={node.x}
                            cy="195"
                            r={isActive ? '14' : '11'}
                            fill={isActive ? node.color : '#1e293b'}
                            stroke={node.color}
                            strokeWidth="2"
                            className="transition-all"
                          />
                          <text
                            x={node.x}
                            y="200"
                            fill={isActive ? '#0f172a' : '#ffffff'}
                            fontSize={isActive ? '13' : '11'}
                            fontWeight="900"
                            textAnchor="middle"
                          >
                            {node.num}
                          </text>
                        </g>
                      );
                    })}

                    {/* Active Equation Pill */}
                    <g transform="translate(200, 248)">
                      <rect x="-140" y="-14" width="280" height="28" rx="10" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.5" />
                      <text x="0" y="5" fill="#fbcfe8" fontSize="12" fontWeight="black" textAnchor="middle">
                        {activeRainbowPair === 0 && '✨ 1 × 36 = 36 (En Dış Yay)'}
                        {activeRainbowPair === 1 && '✨ 2 × 18 = 36 (2. Simetrik Yay)'}
                        {activeRainbowPair === 2 && '✨ 3 × 12 = 36 (3. Simetrik Yay)'}
                        {activeRainbowPair === 3 && '✨ 4 × 9 = 36 (4. Simetrik Yay)'}
                        {activeRainbowPair === 4 && '💖 6 × 6 = 36 (Tam Kare Kalbi / Tek Çarpan)'}
                      </text>
                    </g>
                  </svg>
                )}

                {/* SCENE 11: 6. SINIF MAT.6.1.1 - RİTMİK SEFERLER & SAYI DOĞRUSUNDA KATLAR */}
                {currentPage.visualScene.type === 'multiples-number-line' && (
                  <svg className="w-full h-full select-none" viewBox="0 0 400 280">
                    <rect width="400" height="280" fill="#0b132b" />
                    
                    {/* Title */}
                    <rect x="80" y="10" width="240" height="24" rx="12" fill="#042f2e" stroke="#10b981" strokeWidth="1.2" />
                    <text x="200" y="26" fill="#6ee7b7" fontSize="11" fontWeight="900" textAnchor="middle">
                      ⏱️ 12'nin Katları: İyilik Tırı Sefer Saatleri
                    </text>

                    {/* Road / Base Line (y = 180) */}
                    <line x1="20" y1="180" x2="380" y2="180" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                    <line x1="20" y1="180" x2="380" y2="180" stroke="#fde047" strokeWidth="2" strokeDasharray="8,6" strokeLinecap="round" />

                    {/* Arrow at the end (Infinite Multiples) */}
                    <polygon points="390,180 375,173 375,187" fill="#475569" />
                    <text x="385" y="165" fill="#fde047" fontSize="10" fontWeight="900">∞</text>

                    {/* Multiples Stops: 0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120 */}
                    {[
                      { step: 0, val: 0, x: 30, k: '0' },
                      { step: 1, val: 12, x: 65, k: '1k' },
                      { step: 2, val: 24, x: 100, k: '2k' },
                      { step: 3, val: 36, x: 135, k: '3k' },
                      { step: 4, val: 48, x: 170, k: '4k' },
                      { step: 5, val: 60, x: 205, k: '5k (1 Saat)' },
                      { step: 6, val: 72, x: 240, k: '6k' },
                      { step: 7, val: 84, x: 275, k: '7k' },
                      { step: 8, val: 96, x: 310, k: '8k' },
                      { step: 9, val: 108, x: 345, k: '9k' }
                    ].map((stop, idx) => {
                      const isSelected = selectedMultipleIndex === idx;
                      const prevX = idx > 0 ? 30 + (idx - 1) * 35 : 30;

                      return (
                        <g
                          key={stop.val}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedMultipleIndex(idx);
                            playSound('select');
                          }}
                        >
                          {/* Jump Arc from prev to current if > 0 */}
                          {idx > 0 && (
                            <path
                              d={`M ${prevX} 180 Q ${(prevX + stop.x) / 2} 120 ${stop.x} 180`}
                              fill="none"
                              stroke={isSelected ? '#10b981' : '#10b98144'}
                              strokeWidth={isSelected ? '3' : '1.5'}
                            />
                          )}

                          {/* Stop Node */}
                          <circle
                            cx={stop.x}
                            cy="180"
                            r={isSelected ? '7' : '4.5'}
                            fill={isSelected ? '#10b981' : '#334155'}
                            stroke={isSelected ? '#ffffff' : '#10b981'}
                            strokeWidth="2"
                          />

                          {/* Minute Label */}
                          <text
                            x={stop.x}
                            y="202"
                            fill={isSelected ? '#34d399' : '#94a3b8'}
                            fontSize={isSelected ? '11' : '9'}
                            fontWeight={isSelected ? '900' : 'bold'}
                            textAnchor="middle"
                          >
                            {stop.val}'
                          </text>
                        </g>
                      );
                    })}

                    {/* Relief Truck Animated Icon at Selected Stop */}
                    {(() => {
                      const stops = [30, 65, 100, 135, 170, 205, 240, 275, 310, 345];
                      const curX = stops[selectedMultipleIndex] || 205;
                      const curVal = selectedMultipleIndex * 12;

                      return (
                        <g transform={`translate(${curX - 16}, 90)`} className="transition-all duration-300">
                          <text fontSize="26">🚛</text>
                          <rect x="-10" y="-22" width="56" height="20" rx="6" fill="#042f2e" stroke="#10b981" />
                          <text x="18" y="-8" fill="#34d399" fontSize="10" fontWeight="900" textAnchor="middle">
                            {curVal}. dk
                          </text>
                        </g>
                      );
                    })()}

                    {/* Bottom Formula Banner */}
                    <g transform="translate(200, 248)">
                      <rect x="-155" y="-14" width="310" height="28" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                      <text x="0" y="5" fill="#6ee7b7" fontSize="11" fontWeight="black" textAnchor="middle">
                        🚚 {selectedMultipleIndex}. Sefer: 12 × {selectedMultipleIndex} = {selectedMultipleIndex * 12}. Dakika
                        {selectedMultipleIndex === 5 && ' (Tam 1 Saat!)'}
                        {selectedMultipleIndex === 8 && ' (100\'den küçük en büyük kat!)'}
                      </text>
                    </g>
                  </svg>
                )}

                {/* SCENE 12: 6. SINIF MAT.6.1.1 - LOJİSTİK ŞİFRESİ: ÇARPAN VE KATIN DANSI */}
                {currentPage.visualScene.type === 'factors-multiples-duality' && (
                  <div className="w-full h-full p-4 bg-slate-950 flex flex-col justify-between items-center select-none">
                    
                    {/* Header Seal Badge */}
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
                        🔐 Çarpan ve Katın Çift Yönlü Dengesi
                      </span>
                    </div>

                    {/* Central Interactive Duality Card */}
                    <div
                      onClick={() => {
                        setDualityFlipped(!dualityFlipped);
                        playSound('select');
                      }}
                      className="cursor-pointer w-full max-w-sm bg-gradient-to-br from-slate-900 to-indigo-950 border-2 border-amber-500/60 rounded-2xl p-4 shadow-2xl transition-all hover:scale-102 flex flex-col items-center justify-between text-center space-y-3"
                    >
                      {/* Main Formula */}
                      <div className="text-2xl sm:text-3xl font-mono font-black text-amber-400 tracking-wider">
                        6 × 8 = 48
                      </div>

                      {/* Dynamic Flip View */}
                      {!dualityFlipped ? (
                        <div className="space-y-1.5 animate-in fade-in duration-200">
                          <span className="px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-500/40">
                            1. BAKIŞ: PARÇALAR ⟹ BÖLENLER
                          </span>
                          <p className="text-xs font-extrabold text-white">
                            <span className="text-cyan-400 font-mono text-sm">6</span> ve{' '}
                            <span className="text-cyan-400 font-mono text-sm">8</span> sayıları,{' '}
                            <span className="text-amber-400 font-mono text-sm">48</span>'in{' '}
                            <span className="underline decoration-cyan-400">ÇARPANI (BÖLENİDİR)</span>.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1.5 animate-in fade-in duration-200">
                          <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/40">
                            2. BAKIŞ: BÜTÜN ⟹ KATLAR
                          </span>
                          <p className="text-xs font-extrabold text-white">
                            <span className="text-amber-400 font-mono text-sm">48</span> sayısı, hem{' '}
                            <span className="text-emerald-400 font-mono text-sm">6</span>'nın hem de{' '}
                            <span className="text-emerald-400 font-mono text-sm">8</span>'in bir{' '}
                            <span className="underline decoration-emerald-400">KATIDIR</span>.
                          </p>
                        </div>
                      )}

                      <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <span>🔄 Bakış Açısını Değiştirmek İçin Tıkla</span>
                      </div>
                    </div>

                    {/* Bottom Summary Pill */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-center text-[10px] text-slate-300">
                      <span className="text-amber-400 font-bold">a · b = c</span> eşitliğinde{' '}
                      <span className="text-cyan-300 font-bold">a ve b</span> çarpan,{' '}
                      <span className="text-emerald-300 font-bold">c</span> ise ortak kattır!
                    </div>

                  </div>
                )}

                {/* SCENE: MAT.6.1.2 - SON BASAMAK TESTİ (2, 5, 10) */}
                {currentPage.visualScene.type === 'divisibility-last-digit' && (
                  <div className="w-full h-full p-3 bg-slate-950 flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-black text-amber-400">🔍 Test Sayısı Seç:</span>
                      <div className="flex items-center gap-1">
                        {[48750, 1235, 7322, 9995, 3428].map((num) => (
                          <button
                            key={num}
                            onClick={() => {
                              setSelectedDivisibilityNumber(num);
                              playSound('select');
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                              selectedDivisibilityNumber === num
                                ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-2">
                      <div className="flex items-center gap-1 font-mono text-2xl font-black text-white bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 shadow-inner">
                        <span>{String(selectedDivisibilityNumber).slice(0, -1)}</span>
                        <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg shadow-md animate-pulse">
                          {String(selectedDivisibilityNumber).slice(-1)}
                        </span>
                        <span className="text-xs text-amber-400 ml-2 font-sans font-bold">← Son Basamak</span>
                      </div>

                      {(() => {
                        const lastDigit = selectedDivisibilityNumber % 10;
                        const div2 = lastDigit % 2 === 0;
                        const div5 = lastDigit === 0 || lastDigit === 5;
                        const div10 = lastDigit === 0;

                        return (
                          <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
                            <div className={`p-2 rounded-xl border text-center ${div2 ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-400'}`}>
                              <div className="text-[10px] font-bold">2 ile Bölünme</div>
                              <div className="text-xs font-black mt-0.5">{div2 ? '✓ Çift (Tam)' : '✗ Tek (Kalan: 1)'}</div>
                            </div>
                            <div className={`p-2 rounded-xl border text-center ${div5 ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-400'}`}>
                              <div className="text-[10px] font-bold">5 ile Bölünme</div>
                              <div className="text-xs font-black mt-0.5">{div5 ? '✓ 0 veya 5 (Tam)' : `✗ Kalan: ${lastDigit % 5}`}</div>
                            </div>
                            <div className={`p-2 rounded-xl border text-center ${div10 ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-400'}`}>
                              <div className="text-[10px] font-bold">10 ile Bölünme</div>
                              <div className="text-xs font-black mt-0.5">{div10 ? '✓ Son Bas: 0 (Tam)' : `✗ Kalan: ${lastDigit}`}</div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center text-[10px] text-slate-300">
                      <span className="text-amber-300 font-bold">💡 Püf Noktası:</span> 2, 5 ve 10 ile bölünebilmede sadece <span className="text-amber-400 font-bold">birler basamağı</span> belirleyicidir!
                    </div>
                  </div>
                )}

                {/* SCENE: MAT.6.1.2 - RAKAMLAR TOPLAMI (3 VE 9 KURALI) */}
                {currentPage.visualScene.type === 'divisibility-sum-digits' && (
                  <div className="w-full h-full p-3 bg-slate-950 flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-black text-cyan-400">🔢 Sayı Modeli:</span>
                      <div className="flex items-center gap-1">
                        {[432, 819, 526, 783].map((num) => (
                          <button
                            key={num}
                            onClick={() => {
                              setSelectedDivisibilityNumber(num);
                              playSound('select');
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                              selectedDivisibilityNumber === num
                                ? 'bg-cyan-500 text-slate-950 shadow-md scale-105'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-2">
                      {(() => {
                        const digits = String(selectedDivisibilityNumber).split('').map(Number);
                        const sum = digits.reduce((a, b) => a + b, 0);
                        const div3 = sum % 3 === 0;
                        const div9 = sum % 9 === 0;

                        return (
                          <div className="space-y-2 text-center w-full max-w-sm">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2">
                              <div className="text-[10px] text-slate-400">10'luk Taban Ayrıştırması & Rakamlar Toplamı:</div>
                              <div className="text-sm font-mono font-bold text-cyan-300 mt-1">
                                {digits.join(' + ')} = <span className="text-amber-400 font-black text-base">{sum}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className={`p-2 rounded-xl border ${div3 ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-400'}`}>
                                <div className="text-[10px] font-bold">3 ile Bölünme</div>
                                <div className="text-xs font-black mt-0.5">{sum} = 3×{Math.floor(sum/3)} {div3 ? '(Tam)' : `(Kalan: ${sum%3})`}</div>
                              </div>
                              <div className={`p-2 rounded-xl border ${div9 ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-400'}`}>
                                <div className="text-[10px] font-bold">9 ile Bölünme</div>
                                <div className="text-xs font-black mt-0.5">{sum} = 9×{Math.floor(sum/9)} {div9 ? '(Tam)' : `(Kalan: ${sum%9})`}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center text-[10px] text-slate-300">
                      <span className="text-cyan-300 font-bold">🧠 İspat:</span> 100=99+1 ve 10=9+1 olduğundan, kalanları yalnızca <span className="text-amber-400 font-bold">rakamların toplamı</span> belirler!
                    </div>
                  </div>
                )}

                {/* SCENE: MAT.6.1.2 - SON İKİ BASAMAK (4 KURALI) */}
                {currentPage.visualScene.type === 'divisibility-last-two' && (
                  <div className="w-full h-full p-3 bg-slate-950 flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-black text-purple-400">🎯 4 ile Bölünme Testi:</span>
                      <div className="flex items-center gap-1">
                        {[7324, 5812, 9048, 1235, 6700].map((num) => (
                          <button
                            key={num}
                            onClick={() => {
                              setSelectedDivisibilityNumber(num);
                              playSound('select');
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                              selectedDivisibilityNumber === num
                                ? 'bg-purple-500 text-white shadow-md scale-105'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-2">
                      {(() => {
                        const str = String(selectedDivisibilityNumber);
                        const lastTwo = Number(str.slice(-2));
                        const div4 = lastTwo % 4 === 0;

                        return (
                          <div className="space-y-2 text-center w-full max-w-sm">
                            <div className="flex items-center justify-center gap-1 font-mono text-2xl font-black text-white bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800">
                              <span className="text-slate-400">{str.slice(0, -2)}</span>
                              <span className="bg-purple-600 text-white px-2 py-0.5 rounded-lg shadow-md animate-pulse">
                                {str.slice(-2)}
                              </span>
                            </div>

                            <div className={`p-3 rounded-xl border ${div4 ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-400'}`}>
                              <div className="text-xs font-bold">Son İki Basamak: {lastTwo}</div>
                              <div className="text-sm font-black mt-1">
                                {div4 ? `✓ ${lastTwo} = 4 × ${lastTwo / 4} (4 ile Tam Bölünür)` : `✗ Kalan: ${lastTwo % 4}`}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center text-[10px] text-slate-300">
                      <span className="text-purple-300 font-bold">⚡ Neden?:</span> 100 sayısı 4'e tam bölündüğü için (100 = 4×25), yüzler ve binler basamağı kalanı etkilemez!
                    </div>
                  </div>
                )}

                {/* SCENE: MAT.6.1.2 - BİRLEŞİK KRİTER (6 KURALI) */}
                {currentPage.visualScene.type === 'divisibility-six-rule' && (
                  <div className="w-full h-full p-3 bg-slate-950 flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-black text-emerald-400">⚙️ 6 ile Bölünme (2 & 3 Kuralı):</span>
                      <div className="flex items-center gap-1">
                        {[48750, 312, 524, 715, 846].map((num) => (
                          <button
                            key={num}
                            onClick={() => {
                              setSelectedDivisibilityNumber(num);
                              playSound('select');
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                              selectedDivisibilityNumber === num
                                ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-2">
                      {(() => {
                        const num = selectedDivisibilityNumber;
                        const isEven = num % 2 === 0;
                        const sum = String(num).split('').reduce((a, b) => a + Number(b), 0);
                        const isDiv3 = sum % 3 === 0;
                        const isDiv6 = isEven && isDiv3;

                        return (
                          <div className="space-y-2 w-full max-w-sm">
                            <div className="grid grid-cols-2 gap-2 text-center">
                              <div className={`p-2 rounded-xl border ${isEven ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-400'}`}>
                                <div className="text-[10px] font-bold">1. Şart: Çift Sayı (2)</div>
                                <div className="text-xs font-black mt-0.5">{isEven ? '✓ Sağlandı' : '✗ Tek Sayı'}</div>
                              </div>
                              <div className={`p-2 rounded-xl border ${isDiv3 ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-400'}`}>
                                <div className="text-[10px] font-bold">2. Şart: Rakam Toplamı (3)</div>
                                <div className="text-xs font-black mt-0.5">Top: {sum} {isDiv3 ? '✓ Sağlandı' : '✗'}</div>
                              </div>
                            </div>

                            <div className={`p-2.5 rounded-xl border text-center ${isDiv6 ? 'bg-emerald-900/80 border-emerald-400 text-emerald-200' : 'bg-rose-900/60 border-rose-400 text-rose-200'}`}>
                              <div className="text-xs font-black">
                                {isDiv6 ? '🎉 HEM 2 HEM 3 → 6 İLE TAM BÖLÜNÜR!' : '❌ İki şarttan en az biri sağlanmadığı için 6\'ya tam bölünmez!'}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center text-[10px] text-slate-300">
                      <span className="text-emerald-300 font-bold">🔑 Kural:</span> 6 = 2 × 3 olduğundan, bir sayının 6 ile bölünmesi için <span className="text-amber-400 font-bold">aynı anda hem çift hem rakamlar toplamı 3'ün katı</span> olmalıdır!
                    </div>
                  </div>
                )}

                {/* SCENE: MAT.6.1.3 - ERATOSTHENES KALBURU */}
                {currentPage.visualScene.type === 'eratosthenes-sieve' && (
                  <div className="w-full h-full p-3 bg-slate-950 flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-black text-amber-400">🛡️ Asal Kalburu (1-30):</span>
                      <div className="flex items-center gap-1">
                        {[
                          { p: 2, label: "2'nin Katlarını Ele" },
                          { p: 3, label: "3'ün Katlarını Ele" },
                          { p: 5, label: "5'in Katlarını Ele" }
                        ].map(({ p, label }) => (
                          <button
                            key={p}
                            onClick={() => {
                              setSieveSelectedPrime(p);
                              playSound('select');
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                              sieveSelectedPrime === p
                                ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-2">
                      <div className="grid grid-cols-6 gap-1.5 max-w-xs">
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => {
                          const isPrime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29].includes(n);
                          const isOne = n === 1;
                          const isEliminated = !isOne && !isPrime && n % sieveSelectedPrime === 0;

                          return (
                            <div
                              key={n}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-black transition-all ${
                                isOne
                                  ? 'bg-slate-800 text-slate-500 line-through'
                                  : isPrime
                                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105 font-black'
                                  : isEliminated
                                  ? 'bg-rose-950/80 text-rose-400 border border-rose-500/40 line-through scale-90'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {n}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center text-[10px] text-slate-300">
                      <span className="text-amber-300 font-bold">⭐ Tanım:</span> Sadece 1'e ve kendisine bölünebilen 1'den büyük doğal sayılar <span className="text-amber-400 font-bold">ASAL SAYIDIR</span> (1 asal değildir, 2 tek çift asaldır).
                    </div>
                  </div>
                )}

                {/* SCENE: MAT.6.1.3 - ÇARPAN AĞACI */}
                {currentPage.visualScene.type === 'prime-factor-tree' && (
                  <div className="w-full h-full p-3 bg-slate-950 flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-black text-emerald-400">🌳 60 Sayısının Çarpan Ağacı:</span>
                      <div className="flex items-center gap-1">
                        {['Kök', '1. Dallar', 'Asal Yapraklar'].map((label, idx) => (
                          <button
                            key={label}
                            onClick={() => {
                              setActiveTreeStep(idx);
                              playSound('select');
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                              activeTreeStep === idx
                                ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center p-2">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-mono font-black text-sm flex items-center justify-center shadow-lg">
                          60
                        </div>

                        {activeTreeStep >= 1 && (
                          <div className="flex items-center gap-12">
                            <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white font-mono font-black text-xs flex items-center justify-center">6</div>
                            <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white font-mono font-black text-xs flex items-center justify-center">10</div>
                          </div>
                        )}

                        {activeTreeStep >= 2 && (
                          <div className="flex items-center gap-4">
                            <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center ring-2 ring-emerald-300">2</div>
                            <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center ring-2 ring-emerald-300">3</div>
                            <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center ring-2 ring-emerald-300">2</div>
                            <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center ring-2 ring-emerald-300">5</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center text-[10px] text-slate-300">
                      <span className="text-emerald-300 font-bold">🌿 Asal Çarpanlar:</span> 60 = 2 × 2 × 3 × 5 = <span className="text-amber-300 font-black font-mono">2² · 3 · 5</span>
                    </div>
                  </div>
                )}

                {/* SCENE: MAT.6.1.3 - ASAL ÇARPAN ALGORİTMASI */}
                {currentPage.visualScene.type === 'prime-factor-algorithm' && (
                  <div className="w-full h-full p-3 bg-slate-950 flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-black text-cyan-400">🪜 72 Sayısının Bölme Merdiveni:</span>
                      <span className="text-[10px] font-mono text-slate-400">En küçük asaldan başla</span>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-2">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-4 font-mono text-sm">
                        <div className="text-right space-y-1 font-bold text-white">
                          <div>72</div>
                          <div>36</div>
                          <div>18</div>
                          <div>9</div>
                          <div>3</div>
                          <div className="text-emerald-400 font-black">1</div>
                        </div>
                        <div className="w-0.5 h-36 bg-amber-500 rounded-full" />
                        <div className="text-left space-y-1 font-black text-amber-400">
                          <div>2</div>
                          <div>2</div>
                          <div>2</div>
                          <div>3</div>
                          <div>3</div>
                          <div className="text-slate-500 text-xs">Son</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center text-[10px] text-slate-300">
                      <span className="text-cyan-300 font-bold">📐 Üslü Gösterim:</span> 72 = <span className="text-amber-300 font-mono font-black">2³ · 3²</span> (Asal Çarpanları: 2 ve 3)
                    </div>
                  </div>
                )}

                {/* SCENE: MAT.6.1.3 - KRİPTOGRAFİ VE GÜVENLİK KASASI */}
                {currentPage.visualScene.type === 'prime-crypto-vault' && (
                  <div className="w-full h-full p-3 bg-slate-950 flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-black text-purple-400">🔐 Asal Sayı Kriptografi Kasası:</span>
                      <span className="text-[10px] font-mono text-emerald-400">RSA Şifreleme</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/50 text-center">
                          <div className="text-[9px] text-purple-300 font-bold">Asal Anahtar A</div>
                          <div className="text-lg font-mono font-black text-purple-200">17</div>
                        </div>
                        <span className="text-xl text-amber-400 font-black">×</span>
                        <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/50 text-center">
                          <div className="text-[9px] text-purple-300 font-bold">Asal Anahtar B</div>
                          <div className="text-lg font-mono font-black text-purple-200">19</div>
                        </div>
                        <span className="text-xl text-emerald-400 font-black">=</span>
                        <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-center shadow-lg">
                          <div className="text-[9px] text-emerald-300 font-bold">Kilitli Kasa Kodu</div>
                          <div className="text-lg font-mono font-black text-emerald-200">323</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center text-[10px] text-slate-300">
                      <span className="text-purple-300 font-bold">🛡️ Güvenlik İlkesi:</span> İki asal sayıyı çarpmak kolaydır, ancak 323 sayısının asal çarpanlarını anahtar olmadan bulmak zordur!
                    </div>
                  </div>
                )}

                {/* SCENE: MAT.6.1.4 - ORTAK BÖLENLER KAFESİ */}
                {currentPage.visualScene.type === 'common-divisors-grid' && (
                  <div className="w-full h-full p-3 bg-slate-950 flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-black text-teal-400">🛢️ Zeytinyağı & Nar Ekşisi (24L & 36L):</span>
                      <div className="flex items-center gap-1">
                        {([[24, 36], [18, 30], [40, 60]] as [number, number][]).map(([a, b]) => (
                          <button
                            key={`${a}-${b}`}
                            onClick={() => {
                              setSelectedCommonNumberPair([a, b]);
                              playSound('select');
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                              selectedCommonNumberPair[0] === a
                                ? 'bg-teal-500 text-slate-950 shadow-md scale-105'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {a}L & {b}L
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-2">
                      {(() => {
                        const [a, b] = selectedCommonNumberPair;
                        const divsA = Array.from({ length: a }, (_, i) => i + 1).filter((d) => a % d === 0);
                        const divsB = Array.from({ length: b }, (_, i) => i + 1).filter((d) => b % d === 0);
                        const common = divsA.filter((d) => divsB.includes(d));

                        return (
                          <div className="space-y-1.5 w-full max-w-sm text-center">
                            <div className="text-[10px] text-slate-400">
                              <span className="text-amber-300 font-bold">{a} Bölenleri:</span> {divsA.join(', ')}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              <span className="text-cyan-300 font-bold">{b} Bölenleri:</span> {divsB.join(', ')}
                            </div>
                            <div className="bg-teal-950/80 border border-teal-500/50 rounded-xl p-2 text-teal-200">
                              <div className="text-[10px] font-bold text-teal-300">Ortak Eşit Kap Hacimleri (Kesişim):</div>
                              <div className="text-sm font-mono font-black text-amber-300 mt-0.5">
                                {'{ ' + common.join(', ') + ' }'} Litre
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center text-[10px] text-slate-300">
                      <span className="text-teal-300 font-bold">🎯 Sonuç:</span> Her iki sıvıyı da artmadan ve eşit olarak {selectedCommonNumberPair[0] === 24 ? '1, 2, 3, 4, 6 veya 12' : 'ortak bölen'} litrelik bidonlara doldurabiliriz!
                    </div>
                  </div>
                )}

                {/* SCENE: MAT.6.1.4 - EŞİT ARALIKLI AĞAÇ DİKİMİ */}
                {currentPage.visualScene.type === 'trees-planting-model' && (
                  <div className="w-full h-full p-3 bg-slate-950 flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-black text-emerald-400">🌳 Merhamet Bahçesi Ağaçlandırma (40m × 60m):</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-2">
                      <div className="relative w-56 h-36 border-2 border-dashed border-emerald-500 rounded-2xl bg-emerald-950/30 flex items-center justify-center p-3">
                        <span className="absolute -top-3 bg-slate-950 px-2 text-xs font-mono font-black text-emerald-300">60 metre</span>
                        <span className="absolute -left-3 top-1/2 -translate-y-1/2 bg-slate-950 px-1 text-xs font-mono font-black text-emerald-300 rotate-90">40 metre</span>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>🌲</div>
                          <div>🌲</div>
                          <div>🌲</div>
                          <div>🌲</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center text-[10px] text-slate-300">
                      <span className="text-emerald-300 font-bold">📏 Ortak Aralıklar:</span> 40 ve 60'ın ortak bölenleri: <span className="text-amber-300 font-bold font-mono">1, 2, 4, 5, 10, 20 m</span> aralıklarla ağaç dikilebilir!
                    </div>
                  </div>
                )}

                {/* SCENE: MAT.6.1.4 - ÇİFT SAYI DOĞRUSU & ORTAK KATLAR */}
                {currentPage.visualScene.type === 'double-number-line-multiples' && (
                  <div className="w-full h-full p-3 bg-slate-950 flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-black text-cyan-400">🚌 Otobüs Seferleri (6 dk & 8 dk):</span>
                      <div className="flex items-center gap-1">
                        {[24, 48, 72].map((stop) => (
                          <button
                            key={stop}
                            onClick={() => {
                              setActiveMultipleStop(stop);
                              playSound('select');
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                              activeMultipleStop === stop
                                ? 'bg-cyan-500 text-slate-950 shadow-md scale-105'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {stop}. Dakika
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-2">
                      <div className="space-y-3 w-full max-w-sm">
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-amber-300">A Otobüsü (6'şar dk):</div>
                          <div className="flex items-center gap-1.5 text-xs font-mono">
                            {[6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72].map((m) => (
                              <span
                                key={m}
                                className={`px-1.5 py-0.5 rounded ${
                                  [24, 48, 72].includes(m)
                                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-cyan-300">B Otobüsü (8'er dk):</div>
                          <div className="flex items-center gap-1.5 text-xs font-mono">
                            {[8, 16, 24, 32, 40, 48, 56, 64, 72].map((m) => (
                              <span
                                key={m}
                                className={`px-1.5 py-0.5 rounded ${
                                  [24, 48, 72].includes(m)
                                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center text-[10px] text-slate-300">
                      <span className="text-cyan-300 font-bold">📍 Ortak Kalkış Anları:</span> İki otobüs her <span className="text-amber-300 font-black">24, 48, 72...</span> dakikada bir aynı anda duraktan kalkar!
                    </div>
                  </div>
                )}

                {/* SCENE: MAT.6.1.4 - ARALARINDA ASALLIK VENN ŞEMASI */}
                {currentPage.visualScene.type === 'coprime-venn-diagram' && (
                  <div className="w-full h-full p-3 bg-slate-950 flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-black text-amber-400">🤝 Aralarında Asallık (8 ve 15):</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-2">
                      <div className="flex items-center justify-center gap-4 w-full max-w-sm">
                        <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-center flex-1">
                          <div className="text-[10px] font-bold text-amber-300">8'in Bölenleri</div>
                          <div className="text-xs font-mono text-slate-300 mt-1">{'{ 1, 2, 4, 8 }'}</div>
                        </div>

                        <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex flex-col items-center justify-center font-mono font-black shadow-xl ring-4 ring-amber-400/30">
                          <span className="text-[8px] font-sans">Kesişim</span>
                          <span className="text-base font-black">1</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/50 text-center flex-1">
                          <div className="text-[10px] font-bold text-cyan-300">15'in Bölenleri</div>
                          <div className="text-xs font-mono text-slate-300 mt-1">{'{ 1, 3, 5, 15 }'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center text-[10px] text-slate-300">
                      <span className="text-amber-300 font-bold">✨ Altın Kural:</span> 8 ve 15 asal sayı değildir ancak <span className="text-amber-400 font-bold">1'den başka ortak bölenleri olmadığı için</span> ARALARINDA ASALDIR!
                    </div>
                  </div>
                )}

                {/* GENERIC GEOMETRIC CHALKBOARD SCENE FALLBACK (For any unexpected scene type) */}
                {![
                  'point-map',
                  'lighthouse-ray',
                  'bridge-segment',
                  'horizon-line',
                  'selimiye-plan',
                  'ray-angle',
                  'perpendicular-parallel',
                  'straightedge-twopoints',
                  'compass-circle-ray',
                  'angle-compass-cut',
                  'setsquare-perpendicular',
                  'parallel-tracks',
                  'protractor-tool',
                  'angle-classification',
                  'summary-chart',
                  'intersecting-lines',
                  'supplementary-angles',
                  'perpendicular-complementary',
                  'parallel-lines-noangle',
                  'transversal-angles',
                  'factors-area-model',
                  'factors-rainbow-arc',
                  'multiples-number-line',
                  'factors-multiples-duality',
                  'divisibility-last-digit',
                  'divisibility-sum-digits',
                  'divisibility-last-two',
                  'divisibility-six-rule',
                  'eratosthenes-sieve',
                  'prime-factor-tree',
                  'prime-factor-algorithm',
                  'prime-crypto-vault',
                  'common-divisors-grid',
                  'trees-planting-model',
                  'double-number-line-multiples',
                  'coprime-venn-diagram'
                ].includes(currentPage.visualScene.type) && (
                  <div className="w-full h-full p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border-2 border-teal-400 text-teal-300 flex items-center justify-center">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <span className="px-3 py-1 rounded-full bg-teal-900/80 border border-teal-500/50 text-teal-200 text-[11px] font-black">
                        {currentPage.conceptBadge}
                      </span>
                      <h4 className="text-lg font-black text-white">{currentPage.conceptTitle}</h4>
                      <p className="text-xs text-slate-400 max-w-sm">{currentPage.symbolicCode}</p>
                    </div>
                  </div>
                )}

              </div>

              <div className="text-center text-xs font-semibold text-slate-500 italic">
                {currentPage.visualScene.caption}
              </div>

            </div>

            {/* RIGHT PAGE: Story Narrative, Character Dialogue & Action */}
            <div className="lg:col-span-6 bg-white rounded-2xl border-2 border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-5">
              
              <div className="space-y-4">
                
                {/* Character Dialogue Bubble (Powered by Mascot Architecture) */}
                {currentPage.characterDialogue && (
                  <MascotDialogueBox
                    pose={currentPageIndex % 2 === 0 ? 'curious' : 'thinking'}
                    speaker={currentPage.characterDialogue.speaker}
                    dialogue={currentPage.characterDialogue.text}
                    highlightText={currentPage.conceptBadge}
                  />
                )}

                {/* Narrative Text */}
                <div className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                  {currentPage.narrativeText}
                </div>

                {/* Mathematical Takeaway Badge */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-4 rounded-2xl shadow-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-teal-100 text-xs font-black uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-teal-200" />
                    <span>Maarif Modeli Geometri İlkesi:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    {currentPage.mathTakeaway}
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Bottom Navigation & Phase Jump */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <button
              onClick={handlePrevPage}
              disabled={currentPageIndex === 0}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Önceki Sayfa</span>
            </button>

            {/* Quick Phase jump to Drawing Lab */}
            {currentPageIndex === pages.length - 1 ? (
              <button
                onClick={() => {
                  playSound('select');
                  onNextPhase();
                }}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-sm shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>2. Aşamaya Geç: Atölye</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleNextPage}
                className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Sonraki Sayfa</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>
      )}

      {/* OVERVIEW MODE (Summary & Class Discussion) */}
      {viewMode === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Scenario Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-teal-700 font-extrabold text-sm">
                <Compass className="w-5 h-5" />
                <span>Hikâyenin Genel Akışı</span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed bg-teal-50/40 p-4 rounded-2xl border border-teal-100">
                "{data.scenario}"
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                {pages.map((p, i) => (
                  <div key={p.id || i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div className="text-xl mb-1">
                      {i === 0 ? '📦' : i === 1 ? '🌈' : i === 2 ? '⏱️' : '🔐'}
                    </div>
                    <div className="font-black text-slate-900 text-xs line-clamp-1">{p.conceptBadge || p.conceptTitle}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{p.symbolicCode || `Bölüm ${i + 1}`}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Life Connection & Key takeaway */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-amber-700 font-extrabold text-sm">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span>Günlük Hayat Modelleri</span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {data.realLifeConnection}
                </p>
              </div>

              <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-md space-y-2">
                <div className="flex items-center gap-2 text-emerald-100 text-xs font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Kazanım Özeti (Ana Fikir)</span>
                </div>
                <p className="text-white font-bold text-sm sm:text-base leading-snug">
                  {data.keyTakeaway}
                </p>
              </div>
            </div>

          </div>

          {/* Sınıf İçi Düşünme & Tartışma */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold text-base">
                <MessageCircle className="w-5 h-5 text-teal-600" />
                <span>Sınıf İçi Düşünme ve Tartışma Sorusu</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Söz Hakkı Ver</span>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <p className="text-slate-800 font-bold text-base sm:text-lg">
                "{data.reflectionQuestion}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                onClick={() => {
                  playSound('click');
                  setReflectionRevealed(!reflectionRevealed);
                }}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-4 py-2.5 rounded-xl border border-teal-200 transition-colors flex items-center gap-1.5"
              >
                <Lightbulb className="w-4 h-4 text-teal-600" />
                <span>{reflectionRevealed ? 'İpuçlarını Gizle' : 'Tartışma İpuçlarını Aç'}</span>
              </button>

              <button
                onClick={() => {
                  playSound('select');
                  onNextPhase();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>2. Aşamaya Geç: Atölye</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {reflectionRevealed && (
              <div className="mt-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-in fade-in duration-200">
                <strong>Öğretmen İpucu:</strong> {data.keyTakeaway || 'Öğrencilerin kavramsal gerekçelerini günlük hayat modelleriyle ilişkilendirerek ifade etmelerini destekleyiniz.'}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
