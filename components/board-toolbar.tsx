'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { LessonPhaseId, Outcome } from '@/types';
import { getOutcomeById } from '@/lib/curriculum-data';
import { WhiteboardModal } from '@/components/whiteboard/whiteboard-modal';
import { FeedbackButton } from '@/components/feedback/feedback-button';
import {
  PenTool,
  Highlighter,
  Eraser,
  Trash2,
  Users,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Eye,
  EyeOff,
  Palette,
  Download,
  FileText,
  Presentation
} from 'lucide-react';

interface BoardToolbarProps {
  currentPhase: LessonPhaseId;
  onSelectPhase: (phase: LessonPhaseId) => void;
  outcomeCode: string;
  outcomeTitle: string;
  outcome?: Outcome;
}

const PHASES: Array<{ id: LessonPhaseId; number: number; label: string; icon: string }> = [
  { id: 'story', number: 1, label: 'Hikâye & Bağlam', icon: '📖' },
  { id: 'lab', number: 2, label: 'Atölye', icon: '📐' },
  { id: 'puzzle', number: 3, label: 'Kavram Bulmacası', icon: '🧩' },
  { id: 'assessment', number: 4, label: 'Değerlendirme', icon: '📝' },
];

const PEN_COLORS = ['#ef4444', '#10b396', '#3b82f6', '#f59e0b', '#8b5cf6', '#0f172a'];

export function BoardToolbar({
  currentPhase,
  onSelectPhase,
  outcomeCode,
  outcomeTitle,
  outcome
}: BoardToolbarProps) {
  const {
    role,
    drawingActive,
    setDrawingActive,
    drawingTool,
    setDrawingTool,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    triggerClearCanvas,
    randomPickerOpen,
    setRandomPickerOpen,
    teacherDrawerOpen,
    setTeacherDrawerOpen,
    showAnswers,
    setShowAnswers,
    playSound,
    isFullscreen,
    toggleFullscreen,
  } = useApp();

  const targetOutcome = outcome || getOutcomeById(outcomeCode);

  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);

  // Küçük ekranlarda veya mobil cihazlarda kalem aracını başlangıçta saklı konuma al
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setToolbarCollapsed(true);
    }
  }, []);

  const handleToolSelect = (tool: 'pen' | 'highlighter' | 'eraser') => {
    playSound('click');
    if (drawingActive && drawingTool === tool) {
      setDrawingActive(false);
    } else {
      setDrawingActive(true);
      setDrawingTool(tool);
    }
  };

  return (
    <>
      {/* Top Smart Board Header Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Outcome Info */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-teal-700 text-white font-black text-xs">
                {outcomeCode}
              </span>
              <span className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 max-w-[200px] sm:max-w-xs">
                {outcomeTitle}
              </span>
            </div>
          </div>

          {/* Right Actions: 4 Phases Stepper & Lesson Plan PDF Button */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* 4 Phases Stepper Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto max-w-full">
              {PHASES.map((phase) => {
                const isActive = currentPhase === phase.id;
                return (
                  <button
                    key={phase.id}
                    onClick={() => {
                      playSound('select');
                      onSelectPhase(phase.id);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-102'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                      {phase.number}
                    </span>
                    <span>{phase.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Fullscreen (Tam Ekran) Button for Smart Board */}
            <button
              onClick={() => {
                playSound('click');
                toggleFullscreen();
              }}
              title={isFullscreen ? 'Tam Ekrandan Çık (Küçült)' : 'Ders Akışını Tam Ekran Yap (Akıllı Tahta)'}
              className={`px-3.5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
                isFullscreen
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10'
              }`}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Küçült</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-teal-400" />
                  <span className="hidden sm:inline">Tam Ekran</span>
                </>
              )}
            </button>

            {/* Görüş & Geri Bildirim Butonu (Sadece İkon) */}
            <FeedbackButton
              contextTitle={`${outcomeCode} (${outcomeTitle}) Ders Akışı`}
              tooltip="Bu ders akışı hakkında görüş / geri bildirim ilet"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-300 shadow-2xs transition-all cursor-pointer flex items-center justify-center active:scale-95"
              iconClassName="w-4 h-4 text-teal-700"
            />
          </div>

        </div>
      </div>

      {/* Floating Smart Board Pen & Teaching Tools (Left Side) */}
      <div
        className={`fixed left-4 bottom-6 z-50 transition-all duration-300 ${
          toolbarCollapsed ? '-translate-x-[calc(100%+1.25rem)]' : 'translate-x-0'
        }`}
      >
        <div className="relative bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-3xl shadow-2xl border border-slate-700/80 flex flex-col items-center gap-2.5">
          
          {/* Collapse/Expand Toggle Tab */}
          <button
            onClick={() => setToolbarCollapsed(!toolbarCollapsed)}
            className="absolute -right-7 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-1.5 rounded-r-xl border border-l-0 border-slate-700 shadow-lg hover:bg-slate-800 cursor-pointer flex items-center justify-center"
            title={toolbarCollapsed ? 'Araç Çubuğunu Göster' : 'Araç Çubuğunu Gizle'}
          >
            {toolbarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Whiteboard Studio Trigger Button (NEW) */}
          <button
            onClick={() => {
              playSound('click');
              setWhiteboardOpen(true);
            }}
            className="p-3 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 hover:from-teal-300 hover:to-emerald-500 text-slate-950 font-black shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer relative group"
            title="Beyaz Tahta (A4 Defter & Çizim Stüdyosu)"
          >
            <Presentation className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </button>

          <div className="w-6 h-[1px] bg-slate-700 my-0.5" />

          {/* Canvas Mode Toggle */}
          <div className="p-1 bg-slate-800 rounded-2xl flex flex-col items-center gap-1.5 w-full">
            
            {/* Pen Tool */}
            <button
              onClick={() => handleToolSelect('pen')}
              className={`p-3 rounded-2xl transition-all relative ${
                drawingActive && drawingTool === 'pen'
                  ? 'bg-teal-500 text-slate-950 shadow-md scale-105'
                  : 'hover:bg-slate-700 text-slate-300'
              }`}
              title="Dijital Kalem"
            >
              <PenTool className="w-5 h-5" />
            </button>

            {/* Highlighter Tool */}
            <button
              onClick={() => handleToolSelect('highlighter')}
              className={`p-3 rounded-2xl transition-all relative ${
                drawingActive && drawingTool === 'highlighter'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'hover:bg-slate-700 text-slate-300'
              }`}
              title="Fosforlu Kalem"
            >
              <Highlighter className="w-5 h-5" />
            </button>

            {/* Eraser Tool */}
            <button
              onClick={() => handleToolSelect('eraser')}
              className={`p-3 rounded-2xl transition-all relative ${
                drawingActive && drawingTool === 'eraser'
                  ? 'bg-rose-500 text-white shadow-md scale-105'
                  : 'hover:bg-slate-700 text-slate-300'
              }`}
              title="Silgi"
            >
              <Eraser className="w-5 h-5" />
            </button>

            {/* Toggle Drawing Layer Off */}
            {drawingActive && (
              <button
                onClick={() => {
                  playSound('click');
                  setDrawingActive(false);
                }}
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-900 text-teal-300 hover:bg-teal-800"
                title="Çizim Modundan Çık"
              >
                Kapat
              </button>
            )}
          </div>

          {/* Pen Color Selector Button & Popover */}
          <div className="relative">
            <button
              onClick={() => setColorMenuOpen(!colorMenuOpen)}
              className="p-3 rounded-2xl hover:bg-slate-800 text-slate-300 transition-colors relative"
              title="Kalem Rengi"
            >
              <div
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: brushColor }}
              />
            </button>

            {colorMenuOpen && (
              <div className="absolute left-14 bottom-0 bg-slate-900 border border-slate-700 p-2.5 rounded-2xl shadow-xl flex flex-col gap-2 z-[60] animate-in fade-in zoom-in-95">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Renkler</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {PEN_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setBrushColor(c);
                        setColorMenuOpen(false);
                        playSound('click');
                      }}
                      className={`w-6 h-6 rounded-full border border-white/20 transition-transform ${
                        brushColor === c ? 'scale-125 ring-2 ring-teal-400' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Kalınlık</span>
                  <div className="flex items-center justify-between gap-1">
                    {[2, 4, 8].map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setBrushSize(size);
                          playSound('click');
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          brushSize === size ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {size}px
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clear Canvas */}
          <button
            onClick={() => {
              playSound('clear');
              triggerClearCanvas();
            }}
            className="p-3 rounded-2xl hover:bg-rose-900/60 text-rose-400 hover:text-rose-300 transition-colors"
            title="Tüm Çizimleri Temizle"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <div className="w-6 h-[1px] bg-slate-700 my-0.5" />

          {/* Random Student Picker */}
          <button
            onClick={() => {
              playSound('click');
              setRandomPickerOpen(true);
            }}
            className="p-3 rounded-2xl hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors"
            title="Kura / Söz Hakkı Çarkı"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* Teacher Guide Drawer Trigger */}
          <button
            onClick={() => {
              playSound('click');
              setTeacherDrawerOpen(true);
            }}
            className="p-3 rounded-2xl hover:bg-slate-800 text-teal-400 hover:text-teal-300 transition-colors"
            title="Öğretmen Kılavuzu & Maarif İpuçları"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          {/* Teacher Answer Key Toggle */}
          {role === 'teacher' && (
            <button
              onClick={() => {
                playSound('click');
                setShowAnswers(!showAnswers);
              }}
              className={`p-3 rounded-2xl transition-colors ${
                showAnswers ? 'bg-amber-500 text-slate-950' : 'hover:bg-slate-800 text-slate-400'
              }`}
              title={showAnswers ? 'Cevapları Gizle' : 'Cevapları Göster'}
            >
              {showAnswers ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}

        </div>
      </div>

      {/* Multi-Page A4 Whiteboard Studio Modal */}
      <WhiteboardModal
        isOpen={whiteboardOpen}
        onClose={() => setWhiteboardOpen(false)}
        outcomeCode={outcomeCode}
        outcomeTitle={outcomeTitle}
      />
    </>
  );
}
