'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ClassroomFileRecord, renderShapeSvgString, exportClassroomFileToPdf } from '@/lib/class-files-store';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Calendar,
  User,
  School,
  Loader2,
  FileText,
  Printer,
  Maximize2,
  Minimize2,
  BookOpen
} from 'lucide-react';

interface WhiteboardViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: ClassroomFileRecord | null;
}

export function WhiteboardViewerModal({
  isOpen,
  onClose,
  file
}: WhiteboardViewerModalProps) {
  const { currentUser } = useAuth();
  const { playSound } = useApp();

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset page and zoom on file change or modal open
  useEffect(() => {
    if (isOpen) {
      setCurrentPageIndex(0);
      setZoomLevel(1);
    }
  }, [isOpen, file]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (e.key === 'ArrowRight' && isOpen) {
        handleNextPage();
      }
      if (e.key === 'ArrowLeft' && isOpen) {
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, currentPageIndex, file]);

  if (!isOpen || !file) return null;

  const pages = Array.isArray(file.pages) && file.pages.length > 0 ? file.pages : [];
  const totalPages = pages.length > 0 ? pages.length : 1;
  const safePageIndex = Math.min(Math.max(0, currentPageIndex), totalPages - 1);
  const currentPage = pages[safePageIndex] || {
    id: 'p-default',
    pageNumber: 1,
    backgroundType: 'grid',
    textContent: '',
    shapes: [],
    images: []
  };

  const handlePrevPage = () => {
    if (safePageIndex > 0) {
      playSound('select');
      setCurrentPageIndex(safePageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (safePageIndex < totalPages - 1) {
      playSound('select');
      setCurrentPageIndex(safePageIndex + 1);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(2.0, Number((prev + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.6, Number((prev - 0.15).toFixed(2))));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPdf(true);
      playSound('select');
      await exportClassroomFileToPdf(file, currentUser?.school);
      playSound('success');
    } catch (err) {
      console.error('PDF indirme hatası:', err);
      alert('PDF oluşturulurken bir hata meydana geldi.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Background pattern helper
  const getBackgroundStyle = (bgType: string) => {
    switch (bgType) {
      case 'grid':
        return {
          backgroundColor: '#ffffff',
          backgroundImage:
            'linear-gradient(to right, rgba(15, 23, 42, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        };
      case 'lined':
        return {
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(to bottom, transparent 27px, rgba(15, 23, 42, 0.12) 28px)',
          backgroundSize: '100% 28px'
        };
      case 'dotted':
        return {
          backgroundColor: '#ffffff',
          backgroundImage: 'radial-gradient(rgba(15, 23, 42, 0.2) 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px'
        };
      case 'dark':
        return {
          backgroundColor: '#0f172a',
          backgroundImage:
            'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        };
      case 'blank':
      default:
        return {
          backgroundColor: '#ffffff',
          backgroundImage: 'none'
        };
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-between p-2 sm:p-4 animate-in fade-in select-none"
    >
      {/* 1. TOP VIEWER HEADER BAR */}
      <div className="w-full max-w-6xl bg-slate-900/95 text-white rounded-2xl sm:rounded-3xl border border-slate-700/80 shadow-2xl p-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 shrink-0">
        
        {/* Left: Document Info */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-teal-500/20 border border-teal-400/40 text-teal-300 font-mono font-black text-[10px]">
                {file.outcomeCode}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-bold text-[10px]">
                {file.classSection} Şubesi
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                👀 Salt Okunur Görüntüleme Modu
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-black text-white truncate mt-0.5">
              {file.title}
            </h3>
          </div>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 px-2.5 py-1.5 rounded-xl border border-slate-700 shrink-0">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={safePageIndex <= 0}
            className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Önceki Sayfa (Sol Ok)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-black text-white px-2">
            {safePageIndex + 1} / {totalPages}
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={safePageIndex >= totalPages - 1}
            className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Sonraki Sayfa (Sağ Ok)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Zoom, PDF Download & Close */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Zoom controls (hidden on tiny mobile) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Uzaklaştır"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px] font-bold text-slate-300">
              %{Math.round(zoomLevel * 100)}
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Yakınlaştır"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Yakınlaştırmayı Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* PDF Download Button */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloadingPdf}
            className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Ders Notunu PDF Olarak İndir"
          >
            {downloadingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">İndiriliyor...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PDF İndir</span>
              </>
            )}
          </button>

          {/* Prominent KAPAT (Close) Button */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            title="Görüntüleme Modunu Kapat (ESC)"
          >
            <X className="w-4 h-4" />
            <span>KAPAT</span>
          </button>
        </div>

      </div>

      {/* 2. MAIN WHITEBOARD CANVAS / PAGE CONTAINER */}
      <div className="flex-1 w-full max-w-6xl overflow-auto my-3 flex items-center justify-center p-2 rounded-2xl sm:rounded-3xl bg-slate-900/40 border border-slate-800">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out'
          }}
          className="relative w-full max-w-[960px] min-h-[560px] sm:min-h-[640px] rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-300 flex flex-col justify-between"
        >
          {/* Dynamic Whiteboard Background */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={getBackgroundStyle(currentPage.backgroundType || 'grid')}
          />

          {/* Whiteboard Header Stamp in View Mode */}
          <div className="relative z-10 p-4 sm:p-5 border-b border-slate-200/60 bg-white/70 backdrop-blur-xs flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-black text-teal-900 text-sm">{file.title}</span>
              <span className="text-slate-400">•</span>
              <span className="font-bold text-slate-600">{file.classSection} Şubesi</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-slate-500 text-[11px]">
              <span>Öğretmen: <strong>{file.authorName}</strong></span>
              <span>•</span>
              <span>Sayfa {safePageIndex + 1} / {totalPages}</span>
            </div>
          </div>

          {/* Page Body Content */}
          <div className="relative z-10 flex-1 p-6 sm:p-8 space-y-6">
            
            {/* HTML Text Content if present */}
            {currentPage.textContent ? (
              <div
                className="prose prose-slate max-w-none text-slate-900 font-medium text-sm leading-relaxed [&_h1]:text-2xl [&_h1]:font-black [&_h2]:text-xl [&_h2]:font-extrabold [&_h3]:text-lg [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-teal-500 [&_blockquote]:pl-3 [&_code]:bg-slate-150 [&_code]:p-1 [&_code]:rounded"
                dangerouslySetInnerHTML={{ __html: currentPage.textContent }}
              />
            ) : null}

            {/* Render Shapes if any */}
            {Array.isArray(currentPage.shapes) && currentPage.shapes.length > 0 && (
              <div className="relative w-full min-h-[220px] my-4 pointer-events-none">
                {currentPage.shapes.map((shape) => (
                  <div
                    key={shape.id}
                    style={{
                      position: 'absolute',
                      left: `${shape.x}px`,
                      top: `${shape.y}px`,
                      width: `${shape.width}px`,
                      height: `${shape.height}px`,
                      transform: shape.rotation ? `rotate(${shape.rotation}deg)` : undefined
                    }}
                    dangerouslySetInnerHTML={{ __html: renderShapeSvgString(shape) }}
                  />
                ))}
              </div>
            )}

            {/* Render Canvas Drawing DataUrl if present */}
            {currentPage.drawingDataUrl && (
              <div className="relative w-full my-4 pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentPage.drawingDataUrl}
                  alt="Tahta El Çizimleri"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            )}

            {/* Render Images if any */}
            {Array.isArray(currentPage.images) && currentPage.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                {currentPage.images.map((img) => (
                  <div key={img.id} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt="Ders Görseli"
                      className="w-full h-auto max-h-[300px] object-contain rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Whiteboard Footer Watermark */}
          <div className="relative z-10 p-3 sm:px-6 border-t border-slate-200/60 bg-white/75 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-600">
              <span>🏛️ {file.school || currentUser?.school || 'Millî Eğitim Bakanlığı'}</span>
              <span>•</span>
              <span className="text-teal-800 font-bold">{file.outcomeTitle}</span>
            </div>
            <div className="font-mono font-bold text-teal-900/80">
              www.maarifakademi.com.tr
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM HELPER STRIP */}
      <div className="w-full max-w-6xl bg-slate-900/90 text-white rounded-2xl p-2.5 px-5 flex items-center justify-between text-xs text-slate-400 shrink-0 border border-slate-800">
        <div className="flex items-center gap-2">
          <span>💡 İpucu: Klavye yön tuşlarıyla (← / →) sayfalar arasında geçiş yapabilir, <strong>ESC</strong> ile kapatabilirsiniz.</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-300">
            Sayfa {safePageIndex + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>

    </div>
  );
}
