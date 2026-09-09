'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  WhiteboardPageData,
  WhiteboardImageItem,
  saveClassroomFile,
  ClassroomFileRecord
} from '@/lib/class-files-store';
import { WebImageSearchModal } from '@/components/whiteboard/web-image-search-modal';
import { ClassroomFilesModal } from '@/components/whiteboard/classroom-files-modal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  PenTool,
  Highlighter,
  Eraser,
  Trash2,
  Plus,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image as ImageIcon,
  Globe,
  Upload,
  Download,
  Save,
  FolderOpen,
  X,
  Maximize2,
  Minimize2,
  Copy,
  ChevronDown,
  Sparkles,
  Layers,
  Palette,
  Square,
  Circle,
  Triangle,
  MoveRight,
  Minus,
  Check,
  Loader2,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

interface WhiteboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  outcomeCode?: string;
  outcomeTitle?: string;
  classSection?: string;
}

const FONTS = [
  { id: 'Inter, sans-serif', label: 'Inter (Modern)' },
  { id: '"Comic Sans MS", "Comic Sans", cursive', label: 'Comic (El Yazısı)' },
  { id: 'Arial, sans-serif', label: 'Arial' },
  { id: '"Times New Roman", serif', label: 'Times New Roman' },
  { id: '"Courier New", monospace', label: 'Courier (Daktilo)' },
  { id: 'Caveat, cursive', label: 'Caveat (Kaligrafi)' }
];

const FONT_SIZES = [
  { pt: '12pt', label: '12' },
  { pt: '14pt', label: '14' },
  { pt: '16pt', label: '16' },
  { pt: '18pt', label: '18' },
  { pt: '20pt', label: '20' },
  { pt: '24pt', label: '24' },
  { pt: '32pt', label: '32' },
  { pt: '40pt', label: '40' },
  { pt: '48pt', label: '48' }
];

const PEN_COLORS = ['#0f172a', '#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff'];
const TEXT_COLORS = ['#0f172a', '#b91c1c', '#047857', '#1d4ed8', '#b45309', '#6d28d9', '#be185d'];
const HIGHLIGHT_COLORS = ['transparent', '#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa'];

const MATH_SYMBOLS = ['°', '∠', '∡', '∥', '⊥', '△', '≅', '≠', '≤', '≥', 'π', '√', '≈', 'α', 'β', 'θ'];

export function WhiteboardModal({
  isOpen,
  onClose,
  outcomeCode = 'MAT.5.3.4',
  outcomeTitle = 'Düzlemde İki veya Üç Doğrunun Birbirine Göre Durumuna Bağlı Olarak Oluşabilecek Açılara Dair Çıkarım Yapabilme',
  classSection
}: WhiteboardModalProps) {
  const { currentUser } = useAuth();
  const { playSound } = useApp();

  const isTeacher = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
  const defaultClass = classSection || (isTeacher && (currentUser as any)?.assignedClasses?.[0]
    ? (currentUser as any).assignedClasses[0]
    : '5-A');

  // Modal State
  const [pages, setPages] = useState<WhiteboardPageData[]>([
    {
      id: 'page-1',
      pageNumber: 1,
      backgroundType: 'grid',
      textContent: `<h2 style="color: #0f766e; font-weight: 900;">📐 ${outcomeCode} - ${outcomeTitle}</h2><p>Ders Notları & Çizim Alanı</p><p>Buraya klavye ile yazabilir, üst araç çubuğundan kalemle çizim yapabilir ve görseller ekleyebilirsiniz.</p>`,
      images: []
    }
  ]);

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [activeMode, setActiveMode] = useState<'pen' | 'text'>('pen');
  const [selectedClass, setSelectedClass] = useState<string>(defaultClass);
  const [documentTitle, setDocumentTitle] = useState<string>(`${selectedClass} ${outcomeCode} Ders Notları`);

  // Drawing Tools State
  const [drawingTool, setDrawingTool] = useState<'pen' | 'highlighter' | 'eraser' | 'shape'>('pen');
  const [penColor, setPenColor] = useState<string>('#0f172a');
  const [penWidth, setPenWidth] = useState<number>(3);
  const [selectedShape, setSelectedShape] = useState<'line' | 'arrow' | 'rect' | 'circle' | 'triangle'>('line');

  // Text / Typography State
  const [fontFamily, setFontFamily] = useState<string>('Inter, sans-serif');
  const [fontSize, setFontSize] = useState<string>('16pt');
  const [textColor, setTextColor] = useState<string>('#0f172a');
  const [highlightColor, setHighlightColor] = useState<string>('transparent');

  // Modals & UI States
  const [webImageModalOpen, setWebImageModalOpen] = useState(false);
  const [classroomFilesModalOpen, setClassroomFilesModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  // File Input Ref for Local Upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // References for Drawing Canvas & Content Area
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textEditorRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const pageContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  const activePage = pages[activePageIndex] || pages[0];

  // Update canvas when active page changes
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (activePage?.drawingDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = activePage.drawingDataUrl;
    }
  }, [activePageIndex, isOpen]);

  if (!isOpen) return null;

  // --- PAGE OPERATIONS ---
  const handleAddPage = () => {
    playSound('select');
    const newPageNumber = pages.length + 1;
    const newPage: WhiteboardPageData = {
      id: `page-${Date.now()}`,
      pageNumber: newPageNumber,
      backgroundType: activePage.backgroundType || 'grid',
      textContent: `<p>Sayfa ${newPageNumber}</p>`,
      images: []
    };
    const updated = [...pages, newPage];
    setPages(updated);
    setActivePageIndex(updated.length - 1);
  };

  const handleDuplicatePage = (idx: number) => {
    playSound('select');
    const target = pages[idx];
    const newPage: WhiteboardPageData = {
      ...target,
      id: `page-${Date.now()}`,
      pageNumber: pages.length + 1
    };
    const updated = [...pages, newPage];
    setPages(updated);
    setActivePageIndex(updated.length - 1);
  };

  const handleDeletePage = (idx: number) => {
    if (pages.length <= 1) {
      alert('Beyaz tahtada en az 1 sayfa bulunmalıdır.');
      return;
    }
    if (window.confirm(`${idx + 1}. sayfayı silmek istediğinize emin misiniz?`)) {
      playSound('clear');
      const updated = pages.filter((_, i) => i !== idx).map((p, i) => ({ ...p, pageNumber: i + 1 }));
      setPages(updated);
      setActivePageIndex(Math.max(0, idx - 1));
    }
  };

  const handleClearPage = () => {
    if (window.confirm('Bu sayfadaki tüm çizimleri ve metinleri temizlemek istiyor musunuz?')) {
      playSound('clear');
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      const updated = pages.map((p, i) =>
        i === activePageIndex ? { ...p, drawingDataUrl: undefined, textContent: '<p></p>', images: [] } : p
      );
      setPages(updated);
    }
  };

  const handleChangeBackground = (bg: 'blank' | 'grid' | 'lined' | 'dotted' | 'dark') => {
    playSound('click');
    const updated = pages.map((p, i) => (i === activePageIndex ? { ...p, backgroundType: bg } : p));
    setPages(updated);
  };

  // --- DRAWING CANVAS HANDLERS ---
  const saveCurrentCanvasData = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setPages((prev) =>
      prev.map((p, i) => (i === activePageIndex ? { ...p, drawingDataUrl: dataUrl } : p))
    );
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeMode !== 'pen') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    isDrawing.current = true;
    lastX.current = (clientX - rect.left) * scaleX;
    lastY.current = (clientY - rect.top) * scaleY;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || activeMode !== 'pen') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const currentX = (clientX - rect.left) * scaleX;
    const currentY = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(currentX, currentY);

    if (drawingTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = penWidth * 4;
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else if (drawingTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = penWidth * 3;
      ctx.strokeStyle = penColor;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = penWidth;
      ctx.strokeStyle = penColor;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastX.current = currentX;
    lastY.current = currentY;
  };

  const stopDrawing = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      saveCurrentCanvasData();
    }
  };

  // --- RICH TEXT FORMATTING (WORD EXEC COMMANDS) ---
  const applyTextCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    playSound('click');
  };

  const insertMathSymbol = (sym: string) => {
    document.execCommand('insertText', false, sym);
    playSound('click');
  };

  // --- IMAGE MANAGEMENT ---
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (url) {
        insertImageToActivePage(url);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const insertImageToActivePage = (imageUrl: string) => {
    playSound('success');
    const newImage: WhiteboardImageItem = {
      id: `img-${Date.now()}`,
      url: imageUrl,
      x: 50,
      y: 100,
      width: 260,
      height: 180
    };

    setPages((prev) =>
      prev.map((p, i) =>
        i === activePageIndex ? { ...p, images: [...(p.images || []), newImage] } : p
      )
    );
  };

  const handleDeleteImage = (imgId: string) => {
    playSound('clear');
    setPages((prev) =>
      prev.map((p, i) =>
        i === activePageIndex ? { ...p, images: (p.images || []).filter((img) => img.id !== imgId) } : p
      )
    );
  };

  // --- SAVE TO CLASSROOM FILES ---
  const handleSaveToClassroomFiles = async () => {
    try {
      setIsSaving(true);
      playSound('select');
      saveCurrentCanvasData();

      const teacherName = currentUser?.name || 'Ahmet Yılmaz';
      const teacherSchool = (currentUser as any)?.school || 'Edirne Selimiye İmam Hatip Ortaokulu';

      saveClassroomFile({
        title: documentTitle || `${selectedClass} ${outcomeCode} Ders Notları`,
        classSection: selectedClass,
        outcomeCode,
        outcomeTitle,
        authorName: teacherName,
        authorRole: isTeacher ? 'teacher' : 'student',
        school: teacherSchool,
        pageCount: pages.length,
        pages,
        tags: [outcomeCode, `${selectedClass} Şubesi`, 'Ders Notu', 'Beyaz Tahta']
      });

      playSound('success');
      setSaveSuccessToast(true);
      setTimeout(() => setSaveSuccessToast(false), 3500);
    } catch (err) {
      console.error('Dosya kaydetme hatası:', err);
      alert('Ders notu kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- PDF EXPORT ---
  const handleDownloadPDF = async () => {
    try {
      setIsExportingPdf(true);
      playSound('select');
      saveCurrentCanvasData();

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const pRef = pageContainerRefs.current[`page-${i}`];
        if (!pRef) continue;

        const canvas = await html2canvas(pRef, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: pages[i].backgroundType === 'dark' ? '#0f172a' : '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage('a4', 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      const cleanTitle = (documentTitle || 'Beyaz_Tahta_Notlari').trim().replace(/\s+/g, '_');
      pdf.save(`${selectedClass}_${outcomeCode}_${cleanTitle}.pdf`);
      playSound('success');
    } catch (err) {
      console.error('PDF oluşturma hatası:', err);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const getBackgroundStyle = (type: string) => {
    switch (type) {
      case 'grid':
        return {
          backgroundColor: '#ffffff',
          backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px), radial-gradient(#cbd5e1 1.2px, #ffffff 1.2px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        };
      case 'lined':
        return {
          backgroundColor: '#ffffff',
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #cbd5e1 28px)',
          lineHeight: '28px'
        };
      case 'dotted':
        return {
          backgroundColor: '#ffffff',
          backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px'
        };
      case 'dark':
        return {
          backgroundColor: '#0f172a',
          color: '#f8fafc'
        };
      default:
        return { backgroundColor: '#ffffff', color: '#0f172a' };
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/85 backdrop-blur-md flex flex-col animate-in fade-in select-none">
      
      {/* 1. TOP WORD-LIKE RIBBON TOOLBAR */}
      <div className="bg-slate-900 border-b border-slate-700/80 text-white px-4 py-2.5 flex flex-col gap-2 shrink-0 shadow-xl z-20">
        
        {/* Top Row: File Title, Class Selector, Action Buttons */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          
          {/* Left: Branding & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
              📝
            </div>
            <div>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="bg-transparent border-b border-transparent hover:border-slate-500 focus:border-teal-400 font-black text-sm text-white outline-none px-1 py-0.5 rounded"
                title="Belge Başlığı (Düzenlemek için tıklayın)"
              />
              <div className="flex items-center gap-2 text-[10px] text-teal-300 font-mono">
                <span>{outcomeCode}</span>
                <span>•</span>
                <span>{pages.length} Sayfa A4</span>
              </div>
            </div>
          </div>

          {/* Center: Mode Switch (Çizim vs Metin) */}
          <div className="flex items-center bg-slate-800 p-1 rounded-2xl border border-slate-700 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setActiveMode('pen');
                playSound('click');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'pen'
                  ? 'bg-teal-500 text-slate-950 shadow-md scale-102'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Elle Çizim Modu</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('text');
                playSound('click');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'text'
                  ? 'bg-teal-500 text-slate-950 shadow-md scale-102'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Klavye & Metin Modu</span>
            </button>
          </div>

          {/* Right: Actions (Classroom Files, Save, PDF, Close) */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Target Class Selector */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-teal-300 outline-none focus:border-teal-400"
              title="Hedef Şube"
            >
              <option value="5-A">5-A Şubesi</option>
              <option value="5-B">5-B Şubesi</option>
              <option value="5-C">5-C Şubesi</option>
              <option value="Tümü">Tüm Şubeler</option>
            </select>

            {/* Classroom Files Modal Trigger */}
            <button
              type="button"
              onClick={() => {
                setClassroomFilesModalOpen(true);
                playSound('click');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              title="Kayıtlı Sınıf Dosyalarını Görüntüle"
            >
              <FolderOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Sınıf Arşivi</span>
            </button>

            {/* Save to Classroom Files */}
            <button
              type="button"
              onClick={handleSaveToClassroomFiles}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Bu ders notunu sınıfa kaydet ve öğrencilerle paylaş"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Sınıfa Kaydet</span>
            </button>

            {/* PDF Export */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isExportingPdf}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Tüm Sayfaları Çok Sayfalı A4 PDF Olarak İndir"
            >
              {isExportingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>PDF İndir</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              title="Beyaz Tahtayı Kapat"
            >
              ✕
            </button>
          </div>

        </div>

        {/* Bottom Row: Context-Sensitive Ribbon Controls (Pen vs Word Typography) */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pt-1 border-t border-slate-800 text-xs">
          
          {/* Mode A: Drawing Tools Ribbon */}
          {activeMode === 'pen' ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Çizim:</span>
              
              <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setDrawingTool('pen')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    drawingTool === 'pen' ? 'bg-teal-500 text-slate-950' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Kalem"
                >
                  <PenTool className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDrawingTool('highlighter')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    drawingTool === 'highlighter' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Fosforlu Vurgu Kalemi"
                >
                  <Highlighter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDrawingTool('eraser')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    drawingTool === 'eraser' ? 'bg-rose-500 text-white' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Silgi"
                >
                  <Eraser className="w-4 h-4" />
                </button>
              </div>

              {/* Color Palette */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                {PEN_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setPenColor(c);
                      playSound('click');
                    }}
                    className={`w-5 h-5 rounded-full border border-white/30 transition-transform ${
                      penColor === c ? 'scale-125 ring-2 ring-teal-400' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Pen Width */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                {[2, 4, 8, 14].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setPenWidth(w)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      penWidth === w ? 'bg-teal-500 text-slate-950' : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Mode B: Word Typography Ribbon */
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Yazı:</span>

              {/* Font Family Selector */}
              <select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  applyTextCommand('fontName', e.target.value);
                }}
                className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-teal-400 font-sans"
              >
                {FONTS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>

              {/* Font Size Selector */}
              <select
                value={fontSize}
                onChange={(e) => {
                  setFontSize(e.target.value);
                  applyTextCommand('fontSize', '4'); // ExecCommand standard proxy
                }}
                className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-teal-400 font-mono"
              >
                {FONT_SIZES.map((s) => (
                  <option key={s.pt} value={s.pt}>
                    {s.label} pt
                  </option>
                ))}
              </select>

              {/* Bold, Italic, Underline, Strikethrough */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => applyTextCommand('bold')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 font-bold"
                  title="Kalın (Ctrl+B)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextCommand('italic')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 italic"
                  title="İtalik (Ctrl+I)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextCommand('underline')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 underline"
                  title="Altı Çizili (Ctrl+U)"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextCommand('strikeThrough')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300"
                  title="Üstü Çizili"
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Text Alignment */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => applyTextCommand('justifyLeft')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300"
                  title="Sola Hizala"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextCommand('justifyCenter')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300"
                  title="Ortala"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextCommand('justifyRight')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300"
                  title="Sağa Hizala"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextCommand('justifyFull')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300"
                  title="İki Yana Yasla"
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lists */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => applyTextCommand('insertUnorderedList')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300"
                  title="Madde İşaretli Liste"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextCommand('insertOrderedList')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300"
                  title="Numaralı Liste"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Text Colors */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                {TEXT_COLORS.slice(0, 5).map((tc) => (
                  <button
                    key={tc}
                    type="button"
                    onClick={() => {
                      setTextColor(tc);
                      applyTextCommand('foreColor', tc);
                    }}
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: tc }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Shared Media & Geometry Tool Buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            
            {/* Math Symbols Quick Chips */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl border border-slate-700">
              <span className="text-[10px] text-teal-300 font-bold mr-1">Sembol:</span>
              {MATH_SYMBOLS.slice(0, 8).map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => insertMathSymbol(sym)}
                  className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 text-[11px] font-bold text-white flex items-center justify-center font-mono cursor-pointer"
                  title={`Sembol Ekle: ${sym}`}
                >
                  {sym}
                </button>
              ))}
            </div>

            {/* Local Image Upload Trigger */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLocalImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Bilgisayardan / Tabletten Resim Yükle"
            >
              <Upload className="w-3.5 h-3.5 text-teal-400" />
              <span>Resim Yükle</span>
            </button>

            {/* Web Image Search Trigger */}
            <button
              type="button"
              onClick={() => {
                setWebImageModalOpen(true);
                playSound('click');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="İnternetten & Kütüphaneden Görsel Ara"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>İnternetten Görsel</span>
            </button>

            {/* Background Pattern Selector */}
            <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => handleChangeBackground('grid')}
                className={`px-2 py-1 rounded text-[10px] font-bold ${
                  activePage.backgroundType === 'grid' ? 'bg-teal-500 text-slate-950' : 'text-slate-300'
                }`}
                title="Kareli Matematik Defteri"
              >
                Kareli
              </button>
              <button
                type="button"
                onClick={() => handleChangeBackground('lined')}
                className={`px-2 py-1 rounded text-[10px] font-bold ${
                  activePage.backgroundType === 'lined' ? 'bg-teal-500 text-slate-950' : 'text-slate-300'
                }`}
                title="Çizgili Defter"
              >
                Çizgili
              </button>
              <button
                type="button"
                onClick={() => handleChangeBackground('blank')}
                className={`px-2 py-1 rounded text-[10px] font-bold ${
                  activePage.backgroundType === 'blank' ? 'bg-teal-500 text-slate-950' : 'text-slate-300'
                }`}
                title="Düz Beyaz Sayfa"
              >
                Düz
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Save Toast Notification */}
      {saveSuccessToast && (
        <div className="fixed top-20 right-8 z-[100] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>Ders notu başarıyla &quot;{selectedClass}&quot; sınıf arşivine kaydedildi!</span>
        </div>
      )}

      {/* 2. MAIN SCROLLABLE WORKSPACE WITH MULTI-PAGE A4 SHEETS */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/90 flex flex-col items-center gap-8">
        
        {pages.map((page, pIdx) => {
          const isCurrentActive = pIdx === activePageIndex;

          return (
            <div key={page.id} className="relative group/page flex flex-col items-center">
              
              {/* Page Number & Quick Actions Header */}
              <div className="w-[794px] max-w-full flex items-center justify-between pb-2 text-xs text-slate-400 px-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-teal-300 font-bold font-mono">
                    Sayfa {page.pageNumber} / {pages.length}
                  </span>
                  {isCurrentActive && (
                    <span className="text-[10px] text-teal-400 font-extrabold uppercase tracking-wider">
                      ● Aktif Düzenlenen Sayfa
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 opacity-80 group-hover/page:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleDuplicatePage(pIdx)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Bu Sayfayı Çoğalt"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePage(pIdx)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-rose-900 text-rose-300"
                    title="Bu Sayfayı Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Standard A4 Paper Container (794 x 1123 px at 96 DPI) */}
              <div
                ref={(el) => {
                  pageContainerRefs.current[`page-${pIdx}`] = el;
                }}
                onClick={() => setActivePageIndex(pIdx)}
                className={`relative w-[794px] min-h-[1123px] rounded-2xl shadow-2xl overflow-hidden transition-all ${
                  isCurrentActive ? 'ring-4 ring-teal-500/80' : 'ring-1 ring-slate-700'
                }`}
                style={{
                  ...getBackgroundStyle(page.backgroundType),
                  boxSizing: 'border-box',
                  fontFamily: fontFamily
                }}
              >
                
                {/* Official Maarif Header on Page 1 */}
                {pIdx === 0 && (
                  <div className="p-6 border-b border-slate-200/80 flex items-center justify-between pointer-events-none select-none">
                    <div>
                      <div className="text-[10px] font-black text-teal-800 uppercase tracking-wider">
                        T.C. MİLLÎ EĞİTİM BAKANLIĞI • TÜRKİYE YÜZYILI MAARİF MODELİ
                      </div>
                      <div className="text-sm font-black text-slate-900 mt-0.5">
                        Matematik Dersi Akıllı Tahta & Beyaz Tahta Notları
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 font-mono">
                        Kazanım: {outcomeCode} • {selectedClass} Şubesi
                      </div>
                    </div>

                    <div className="text-right text-[10px] text-slate-400 font-bold">
                      <div>Tarih: {new Date().toLocaleDateString('tr-TR')}</div>
                      <div>Öğretmen: {currentUser?.name || 'Ahmet Yılmaz'}</div>
                    </div>
                  </div>
                )}

                {/* ContentEditable Rich Text Area */}
                <div
                  ref={(el) => {
                    textEditorRefs.current[`page-${pIdx}`] = el;
                  }}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const html = e.currentTarget.innerHTML;
                    setPages((prev) =>
                      prev.map((p, i) => (i === pIdx ? { ...p, textContent: html } : p))
                    );
                  }}
                  dangerouslySetInnerHTML={{ __html: page.textContent || '' }}
                  className="p-8 outline-none min-h-[900px] text-slate-900 font-sans"
                  style={{
                    fontSize: fontSize,
                    color: textColor,
                    lineHeight: '1.6',
                    cursor: activeMode === 'text' ? 'text' : 'default',
                    pointerEvents: activeMode === 'text' ? 'auto' : 'none'
                  }}
                />

                {/* Freehand Drawing Overlay Canvas (Only active for current page) */}
                {isCurrentActive ? (
                  <canvas
                    ref={canvasRef}
                    width={794}
                    height={1123}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className={`absolute inset-0 z-10 ${
                      activeMode === 'pen' ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
                    }`}
                  />
                ) : (
                  page.drawingDataUrl && (
                    <img
                      src={page.drawingDataUrl}
                      alt="Drawing Layer"
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    />
                  )
                )}

                {/* Embedded Floating Images */}
                {page.images &&
                  page.images.map((img) => (
                    <div
                      key={img.id}
                      className="absolute z-20 group/img border-2 border-transparent hover:border-teal-500 rounded-xl overflow-hidden shadow-lg transition-all"
                      style={{
                        top: `${img.y}px`,
                        left: `${img.x}px`,
                        width: `${img.width}px`,
                        height: `${img.height}px`
                      }}
                    >
                      <img
                        src={img.url}
                        alt="Inserted Media"
                        className="w-full h-full object-contain bg-white/90"
                        crossOrigin="anonymous"
                      />

                      {/* Delete Button on Hover */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(img.id);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs opacity-0 group-hover/img:opacity-100 transition-opacity shadow-md cursor-pointer"
                        title="Resmi Sil"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                {/* Page Footer */}
                <div className="absolute bottom-3 left-6 right-6 border-t border-slate-200/80 pt-2 flex items-center justify-between text-[10px] text-slate-400 pointer-events-none">
                  <span>Maarif Dijital Defteri • dersonline.meb</span>
                  <span>Sayfa {page.pageNumber}</span>
                </div>

              </div>
            </div>
          );
        })}

        {/* 3. BIG '+' ADD NEW A4 PAGE BUTTON AT BOTTOM */}
        <div className="w-[794px] max-w-full flex items-center justify-center py-4">
          <button
            type="button"
            onClick={handleAddPage}
            className="w-full py-4 px-6 rounded-3xl bg-slate-900/90 hover:bg-slate-800 text-teal-300 border-2 border-dashed border-teal-500/50 hover:border-teal-400 font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-98"
          >
            <div className="w-8 h-8 rounded-full bg-teal-500/20 group-hover:bg-teal-500 group-hover:text-slate-950 text-teal-300 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span>+ Yeni A4 Sayfası Ekle (Sayfa {pages.length + 1})</span>
          </button>
        </div>

      </div>

      {/* 4. MODALS */}
      {/* Web & Educational Image Search Picker */}
      <WebImageSearchModal
        isOpen={webImageModalOpen}
        onClose={() => setWebImageModalOpen(false)}
        onSelectImage={(url) => insertImageToActivePage(url)}
      />

      {/* Saved Classroom Files Drawer / Modal */}
      <ClassroomFilesModal
        isOpen={classroomFilesModalOpen}
        onClose={() => setClassroomFilesModalOpen(false)}
        outcomeCode={outcomeCode}
        classSection={selectedClass}
        onLoadFileToWhiteboard={(file) => {
          setPages(file.pages);
          setDocumentTitle(file.title);
          setSelectedClass(file.classSection);
          setActivePageIndex(0);
        }}
      />

    </div>
  );
}
