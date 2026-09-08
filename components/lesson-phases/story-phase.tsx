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
                    <text fill="#38bdf8" fontSize="11" fontWeight="900" x="200" y="122" textAnchor="middle">d1 ∥ d2 (Paralel)</text>

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
                      🚂 Tren Rayı Modeli: d1 ∥ d2 (Paralel Doğrular)
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
                      <div className="font-extrabold text-purple-400">∥ PARALELLİK</div>
                      <div className="text-[11px] text-slate-300">Aynı doğruya dik iki doğru asla kesişmez.</div>
                      <div className="font-mono bg-slate-950 py-0.5 rounded text-[10px] text-purple-200">d1 ∥ d2</div>
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
                
                {/* Character Dialogue Bubble */}
                {currentPage.characterDialogue && (
                  <div className="flex items-start gap-3 bg-teal-50/70 p-4 rounded-2xl border border-teal-200/80">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                      {data.character.avatar}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-black text-teal-900">
                        {currentPage.characterDialogue.speaker}
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 italic leading-relaxed">
                        "{currentPage.characterDialogue.text}"
                      </p>
                    </div>
                  </div>
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
                <span>2. Aşamaya Geç: Çizim Atölyesi</span>
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

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xl mb-1">📍</div>
                  <div className="font-bold text-slate-800">Nokta</div>
                  <div className="text-[10px] text-slate-500">Konum / Başlangıç</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xl mb-1">📏</div>
                  <div className="font-bold text-slate-800">Doğru Parçası</div>
                  <div className="text-[10px] text-slate-500">Köprü Kirişi</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xl mb-1">🔦</div>
                  <div className="font-bold text-slate-800">Işın</div>
                  <div className="text-[10px] text-slate-500">Fener Işığı</div>
                </div>
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
                <span>2. Aşamaya Geç: Çizim Atölyesi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {reflectionRevealed && (
              <div className="mt-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-in fade-in duration-200">
                <strong>Öğretmen İpucu:</strong> Işığın uzayda kesintisiz devam ettiği için uzunluğunun sonlu olamayacağını, köprü kirişinin ise iki nokta arasında sabit kalarak ölçülebilir olduğunu vurgulayınız.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
