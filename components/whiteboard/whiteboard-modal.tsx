'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  WhiteboardPageData,
  WhiteboardImageItem,
  WhiteboardShapeItem,
  GeometricShapeType,
  saveClassroomFile,
  renderShapeSvgString
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
  Copy,
  ChevronDown,
  Sparkles,
  Layers,
  Palette,
  Check,
  Loader2,
  Shapes,
  Maximize2,
  Move,
  Lock,
  Unlock
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
  { pt: '12pt', label: '12', cmd: '2' },
  { pt: '14pt', label: '14', cmd: '3' },
  { pt: '16pt', label: '16', cmd: '4' },
  { pt: '18pt', label: '18', cmd: '5' },
  { pt: '24pt', label: '24', cmd: '6' },
  { pt: '32pt', label: '32', cmd: '7' }
];

const PEN_COLORS = ['#0f172a', '#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff'];
const TEXT_COLORS = ['#0f172a', '#b91c1c', '#047857', '#1d4ed8', '#b45309', '#6d28d9', '#be185d'];
const FILL_COLORS = [
  { id: 'transparent', label: 'Şeffaf (Boş)' },
  { id: '#14b8a625', label: 'Açık Turkuaz' },
  { id: '#3b82f625', label: 'Açık Mavi' },
  { id: '#f59e0b25', label: 'Açık Sarı' },
  { id: '#10b98125', label: 'Açık Yeşil' },
  { id: '#8b5cf625', label: 'Açık Mor' },
  { id: '#ef444425', label: 'Açık Kırmızı' },
  { id: '#ffffff', label: 'Beyaz Dolgu' }
];

const MATH_SYMBOLS = [
  '°', '∠', '∡', '∥', '⊥', '△', '≅', '≠',
  '≤', '≥', 'π', '√', '≈', 'α', 'β', 'θ',
  'λ', 'Δ', '±', '÷', '×', '∞', '∑', '∫',
  '‰', '∈', '∉', '⊂', '⊆', '∪', '∩', '∅'
];

// 12 Geometrik Şekil Tanımları
const GEOMETRIC_SHAPES_DATA: {
  type: GeometricShapeType;
  label: string;
  category: string;
  defaultW: number;
  defaultH: number;
  previewSvg: React.ReactNode;
}[] = [
  {
    type: 'square',
    label: 'Kare',
    category: 'Dörtgenler',
    defaultW: 160,
    defaultH: 160,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    )
  },
  {
    type: 'triangle',
    label: 'Genel Üçgen',
    category: 'Üçgenler',
    defaultW: 180,
    defaultH: 160,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 3 21 21 3 21" />
      </svg>
    )
  },
  {
    type: 'right_triangle',
    label: 'Dik Üçgen (90°)',
    category: 'Üçgenler',
    defaultW: 180,
    defaultH: 160,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="3 3 21 21 3 21" />
        <path d="M3 16 h5 v5" />
      </svg>
    )
  },
  {
    type: 'equilateral_triangle',
    label: 'Eşkenar Üçgen',
    category: 'Üçgenler',
    defaultW: 180,
    defaultH: 160,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 3 21 21 3 21" />
        <line x1="8" y1="12" x2="6" y2="12" />
        <line x1="16" y1="12" x2="18" y2="12" />
      </svg>
    )
  },
  {
    type: 'circle',
    label: 'Çember (Boş)',
    category: 'Dairesel',
    defaultW: 160,
    defaultH: 160,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
      </svg>
    )
  },
  {
    type: 'disc',
    label: 'Daire (Dolu)',
    category: 'Dairesel',
    defaultW: 160,
    defaultH: 160,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
        <circle cx="12" cy="12" r="9" />
      </svg>
    )
  },
  {
    type: 'ellipse',
    label: 'Elips',
    category: 'Dairesel',
    defaultW: 200,
    defaultH: 130,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="12" rx="10" ry="6" />
      </svg>
    )
  },
  {
    type: 'pentagon',
    label: 'Düzgün Beşgen',
    category: 'Çokgenler',
    defaultW: 170,
    defaultH: 170,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 22 9 18 21 6 21 2 9" />
      </svg>
    )
  },
  {
    type: 'hexagon',
    label: 'Düzgün Altıgen',
    category: 'Çokgenler',
    defaultW: 180,
    defaultH: 160,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" />
      </svg>
    )
  },
  {
    type: 'parallelogram',
    label: 'Paralelkenar',
    category: 'Dörtgenler',
    defaultW: 200,
    defaultH: 130,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="6 4 21 4 18 20 3 20" />
      </svg>
    )
  },
  {
    type: 'trapezoid',
    label: 'Yamuk',
    category: 'Dörtgenler',
    defaultW: 200,
    defaultH: 140,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="6 4 18 4 22 20 2 20" />
      </svg>
    )
  },
  {
    type: 'rhombus',
    label: 'Eşkenar Dörtgen',
    category: 'Dörtgenler',
    defaultW: 160,
    defaultH: 160,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 22 12 12 22 2 12" />
      </svg>
    )
  }
];

interface WhiteboardTextEditorProps {
  pageId: string;
  initialContent: string;
  activeMode: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  onSelectionChange: () => void;
  onContentChange: (html: string) => void;
  setEditorRef: (el: HTMLDivElement | null) => void;
}

const WhiteboardTextEditor = React.forwardRef<HTMLDivElement, WhiteboardTextEditorProps>(
  (
    {
      pageId,
      initialContent,
      activeMode,
      fontFamily,
      fontSize,
      textColor,
      onSelectionChange,
      onContentChange,
      setEditorRef
    },
    ref
  ) => {
    const innerRef = useRef<HTMLDivElement | null>(null);

    // Initial content synchronization when mounted or page changes
    useEffect(() => {
      if (innerRef.current) {
        if (document.activeElement !== innerRef.current) {
          if (innerRef.current.innerHTML !== (initialContent || '')) {
            innerRef.current.innerHTML = initialContent || '';
          }
        }
      }
    }, [pageId, initialContent]);

    return (
      <div
        ref={(el) => {
          innerRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
          setEditorRef(el);
        }}
        contentEditable
        suppressContentEditableWarning
        onMouseUp={onSelectionChange}
        onKeyUp={onSelectionChange}
        onFocus={onSelectionChange}
        onInput={(e) => {
          onSelectionChange();
          onContentChange(e.currentTarget.innerHTML);
        }}
        onBlur={(e) => {
          onSelectionChange();
          onContentChange(e.currentTarget.innerHTML);
        }}
        className="p-6 sm:p-8 outline-none min-h-[900px] text-slate-900 relative z-0"
        style={{
          fontFamily: fontFamily,
          fontSize: fontSize,
          color: textColor,
          lineHeight: '1.6',
          cursor: activeMode === 'text' ? 'text' : 'default',
          pointerEvents: activeMode === 'text' ? 'auto' : 'none'
        }}
      />
    );
  }
);
WhiteboardTextEditor.displayName = 'WhiteboardTextEditor';

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
      textContent: '',
      images: [],
      shapes: []
    }
  ]);

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [activeMode, setActiveMode] = useState<'pen' | 'text'>('pen');
  const [selectedClass, setSelectedClass] = useState<string>(defaultClass);
  const [documentTitle, setDocumentTitle] = useState<string>(`${defaultClass} ${outcomeCode} Ders Notları`);

  // Drawing Tools State
  const [drawingTool, setDrawingTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState<string>('#0f172a');
  const [penWidth, setPenWidth] = useState<number>(3);

  // Text / Typography State
  const [fontFamily, setFontFamily] = useState<string>('Inter, sans-serif');
  const [fontSize, setFontSize] = useState<string>('16pt');
  const [textColor, setTextColor] = useState<string>('#0f172a');

  // Selected Object (Image or Geometric Shape)
  const [selectedObjectId, setSelectedObjectId] = useState<{ type: 'image' | 'shape'; id: string } | null>(null);
  const [shapesDropdownOpen, setShapesDropdownOpen] = useState(false);
  const [symbolsDropdownOpen, setSymbolsDropdownOpen] = useState(false);

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
  const savedRangeRef = useRef<Range | null>(null);

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
  }, [activePageIndex, isOpen, activePage?.drawingDataUrl]);

  // Save selection range on selection change in editor
  const saveCurrentSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const editorEl = textEditorRefs.current[`page-${activePageIndex}`];
      if (editorEl && editorEl.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  }, [activePageIndex]);

  // Keyboard Delete handler for selected shapes/images
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedObjectId) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const target = e.target as HTMLElement;
        if (target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }
        if (selectedObjectId.type === 'shape') {
          const shape = activePage.shapes?.find((s) => s.id === selectedObjectId.id);
          if (shape?.isLocked) return;
          handleDeleteShape(selectedObjectId.id);
        } else if (selectedObjectId.type === 'image') {
          const img = activePage.images?.find((i) => i.id === selectedObjectId.id);
          if (img?.isLocked) return;
          handleDeleteImage(selectedObjectId.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObjectId, activePageIndex, activePage]);

  if (!isOpen) return null;

  // --- PAGE OPERATIONS ---
  const handleAddPage = () => {
    playSound('select');
    const newPageNumber = pages.length + 1;
    const newPage: WhiteboardPageData = {
      id: `page-${Date.now()}`,
      pageNumber: newPageNumber,
      backgroundType: activePage.backgroundType || 'grid',
      textContent: '',
      images: [],
      shapes: []
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
    if (window.confirm('Bu sayfadaki tüm çizimleri, şekilleri ve metinleri temizlemek istiyor musunuz?')) {
      playSound('clear');
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      const editorEl = textEditorRefs.current[`page-${activePageIndex}`];
      if (editorEl) {
        editorEl.innerHTML = '';
      }
      const updated = pages.map((p, i) =>
        i === activePageIndex
          ? { ...p, drawingDataUrl: undefined, textContent: '', images: [], shapes: [] }
          : p
      );
      setPages(updated);
      setSelectedObjectId(null);
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
    const editorEl = textEditorRefs.current[`page-${activePageIndex}`];
    const html = editorEl ? editorEl.innerHTML : undefined;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setPages((prev) =>
        prev.map((p, i) =>
          i === activePageIndex
            ? { ...p, drawingDataUrl: dataUrl, ...(html !== undefined ? { textContent: html } : {}) }
            : p
        )
      );
    } else if (html !== undefined) {
      setPages((prev) =>
        prev.map((p, i) =>
          i === activePageIndex ? { ...p, textContent: html } : p
        )
      );
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeMode !== 'pen') return;
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

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
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (drawingTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = penWidth * 5;
      ctx.stroke();
    } else if (drawingTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor + '55'; // semi-transparent
      ctx.lineWidth = penWidth * 4;
      ctx.stroke();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      ctx.stroke();
    }

    lastX.current = currentX;
    lastY.current = currentY;
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    saveCurrentCanvasData();
  };

  // --- TEXT FORMATTING & WORD COMMANDS ---
  const applyTextCommand = (command: string, value: string = '') => {
    const editorEl = textEditorRefs.current[`page-${activePageIndex}`];
    if (editorEl) editorEl.focus();
    document.execCommand(command, false, value);
    playSound('click');
    if (editorEl) {
      const currentHtml = editorEl.innerHTML;
      setPages((prev) =>
        prev.map((p, i) => (i === activePageIndex ? { ...p, textContent: currentHtml } : p))
      );
    }
  };

  const handleFontChange = (font: string) => {
    setFontFamily(font);
    playSound('click');
    const editorEl = textEditorRefs.current[`page-${activePageIndex}`];
    if (editorEl) {
      editorEl.focus();
      document.execCommand('fontName', false, font);
      const currentHtml = editorEl.innerHTML;
      setPages((prev) =>
        prev.map((p, i) => (i === activePageIndex ? { ...p, textContent: currentHtml } : p))
      );
    }
  };

  const handleFontSizeChange = (size: string, cmdVal: string) => {
    setFontSize(size);
    playSound('click');
    const editorEl = textEditorRefs.current[`page-${activePageIndex}`];
    if (editorEl) {
      editorEl.focus();
      document.execCommand('fontSize', false, cmdVal);
      const currentHtml = editorEl.innerHTML;
      setPages((prev) =>
        prev.map((p, i) => (i === activePageIndex ? { ...p, textContent: currentHtml } : p))
      );
    }
  };

  // Math Symbol Insertion Right At Cursor & Cursor Advances Reliably
  const insertMathSymbol = (sym: string) => {
    playSound('click');
    setActiveMode('text');

    const editorEl = textEditorRefs.current[`page-${activePageIndex}`];
    if (!editorEl) return;

    editorEl.focus();

    const sel = window.getSelection();
    let hasValidRange = false;

    if (sel && sel.rangeCount > 0) {
      const activeRange = sel.getRangeAt(0);
      if (editorEl.contains(activeRange.commonAncestorContainer)) {
        hasValidRange = true;
      }
    }

    if (!hasValidRange && savedRangeRef.current && editorEl.contains(savedRangeRef.current.commonAncestorContainer)) {
      try {
        sel?.removeAllRanges();
        sel?.addRange(savedRangeRef.current);
        hasValidRange = true;
      } catch (e) {
        hasValidRange = false;
      }
    }

    if (!hasValidRange) {
      const endRange = document.createRange();
      endRange.selectNodeContents(editorEl);
      endRange.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(endRange);
      savedRangeRef.current = endRange.cloneRange();
    }

    let inserted = false;
    try {
      inserted = document.execCommand('insertText', false, sym);
    } catch (e) {
      inserted = false;
    }

    if (!inserted && sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(sym);
      range.insertNode(textNode);

      const afterRange = document.createRange();
      afterRange.setStartAfter(textNode);
      afterRange.setEndAfter(textNode);
      afterRange.collapse(true);

      sel.removeAllRanges();
      sel.addRange(afterRange);
      savedRangeRef.current = afterRange.cloneRange();
    } else if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }

    const currentHtml = editorEl.innerHTML;
    setPages((prev) =>
      prev.map((p, i) => (i === activePageIndex ? { ...p, textContent: currentHtml } : p))
    );
  };

  // --- IMAGE MANAGEMENT & 8-HANDLE RESIZING ---
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
      x: 60,
      y: 120,
      width: 240,
      height: 180,
      isLocked: false
    };

    setPages((prev) =>
      prev.map((p, i) =>
        i === activePageIndex ? { ...p, images: [...(p.images || []), newImage] } : p
      )
    );
    setSelectedObjectId({ type: 'image', id: newImage.id });
  };

  const handleDeleteImage = (imgId: string) => {
    playSound('clear');
    setPages((prev) =>
      prev.map((p, i) =>
        i === activePageIndex ? { ...p, images: (p.images || []).filter((img) => img.id !== imgId) } : p
      )
    );
    if (selectedObjectId?.id === imgId) setSelectedObjectId(null);
  };

  const updateImageTransform = (imgId: string, updates: Partial<WhiteboardImageItem>) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === activePageIndex
          ? {
              ...p,
              images: (p.images || []).map((img) => (img.id === imgId ? { ...img, ...updates } : img))
            }
          : p
      )
    );
  };

  const handleToggleLockImage = (imgId: string) => {
    playSound('click');
    setPages((prev) =>
      prev.map((p, i) =>
        i === activePageIndex
          ? {
              ...p,
              images: (p.images || []).map((img) =>
                img.id === imgId ? { ...img, isLocked: !img.isLocked } : img
              )
            }
          : p
      )
    );
  };

  // --- GEOMETRIC SHAPES MANAGEMENT & 8-HANDLE RESIZING ---
  const handleInsertShape = (shapeData: typeof GEOMETRIC_SHAPES_DATA[0]) => {
    playSound('success');
    const newShape: WhiteboardShapeItem = {
      id: `shape-${Date.now()}`,
      type: shapeData.type,
      x: 80,
      y: 140,
      width: shapeData.defaultW,
      height: shapeData.defaultH,
      strokeColor: penColor === '#ffffff' ? '#0f172a' : penColor,
      strokeWidth: penWidth > 1 ? penWidth : 3,
      fillColor: shapeData.type === 'disc' ? '#14b8a625' : 'transparent',
      isDashed: false,
      label: shapeData.label,
      isLocked: false
    };

    setPages((prev) =>
      prev.map((p, i) =>
        i === activePageIndex ? { ...p, shapes: [...(p.shapes || []), newShape] } : p
      )
    );

    setSelectedObjectId({ type: 'shape', id: newShape.id });
    setShapesDropdownOpen(false);
  };

  const handleDeleteShape = (shapeId: string) => {
    playSound('clear');
    setPages((prev) =>
      prev.map((p, i) =>
        i === activePageIndex ? { ...p, shapes: (p.shapes || []).filter((s) => s.id !== shapeId) } : p
      )
    );
    if (selectedObjectId?.id === shapeId) setSelectedObjectId(null);
  };

  const handleDuplicateShape = (shapeId: string) => {
    const shape = activePage.shapes?.find((s) => s.id === shapeId);
    if (!shape) return;
    playSound('select');
    const cloned: WhiteboardShapeItem = {
      ...shape,
      id: `shape-${Date.now()}`,
      x: shape.x + 30,
      y: shape.y + 30
    };
    setPages((prev) =>
      prev.map((p, i) =>
        i === activePageIndex ? { ...p, shapes: [...(p.shapes || []), cloned] } : p
      )
    );
    setSelectedObjectId({ type: 'shape', id: cloned.id });
  };

  const updateShapeTransform = (shapeId: string, updates: Partial<WhiteboardShapeItem>) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === activePageIndex
          ? {
              ...p,
              shapes: (p.shapes || []).map((s) => (s.id === shapeId ? { ...s, ...updates } : s))
            }
          : p
      )
    );
  };

  const handleToggleLockShape = (shapeId: string) => {
    playSound('click');
    setPages((prev) =>
      prev.map((p, i) =>
        i === activePageIndex
          ? {
              ...p,
              shapes: (p.shapes || []).map((s) =>
                s.id === shapeId ? { ...s, isLocked: !s.isLocked } : s
              )
            }
          : p
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

  // --- PDF EXPORT (All pages, shapes, text, images, drawings) ---
  const handleDownloadPDF = async () => {
    try {
      setIsExportingPdf(true);
      playSound('select');
      setSelectedObjectId(null);
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
          backgroundImage:
            'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        };
      case 'lined':
        return {
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '100% 28px'
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
          backgroundImage:
            'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          color: '#f8fafc'
        };
      case 'blank':
      default:
        return {
          backgroundColor: '#ffffff'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex flex-col select-none animate-in fade-in duration-200">
      
      {/* 1. TOP WORD-STYLE TOOLBAR & HEADER */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2 shadow-xl flex flex-col gap-2 shrink-0 z-50 relative overflow-visible">
        
        {/* Top Row: Title, Class, Mode Switch, Save & PDF */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          
          {/* Left: Branding & Editable Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 font-black shadow-inner text-base">
              📐
            </div>
            <div>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-black text-white hover:bg-slate-800/60 focus:bg-slate-800 px-2 py-0.5 rounded-lg outline-none border border-transparent focus:border-teal-400 max-w-[260px] sm:max-w-md"
                title="Belge Başlığı (Düzenlemek için tıklayın)"
              />
              <div className="flex items-center gap-2 text-[10px] text-teal-300 font-mono px-2">
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
                setSelectedObjectId(null);
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

          {/* Right: Actions (Class, Archive, Save, PDF, Close) */}
          <div className="flex items-center gap-2 flex-wrap">
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

            <button
              type="button"
              onClick={handleSaveToClassroomFiles}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Bu ders notunu sınıfa kaydet ve öğrencilerle paylaş"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Sınıfa Kaydet</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isExportingPdf}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Tüm Sayfaları Çok Sayfalı A4 PDF Olarak İndir"
            >
              {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>PDF İndir</span>
            </button>

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

        {/* Bottom Row: Context Ribbon (Pen vs Word Typography + Geometric Shapes + Media) */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-800 text-xs relative overflow-visible">
          
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
                onChange={(e) => handleFontChange(e.target.value)}
                className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-teal-400"
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
                  const targetObj = FONT_SIZES.find((s) => s.pt === e.target.value) || FONT_SIZES[2];
                  handleFontSizeChange(targetObj.pt, targetObj.cmd);
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
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('bold')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                  title="Kalın (Ctrl+B)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('italic')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 italic cursor-pointer"
                  title="İtalik (Ctrl+I)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('underline')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 underline cursor-pointer"
                  title="Altı Çizili (Ctrl+U)"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('strikeThrough')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title="Üstü Çizili"
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Text Alignment */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('justifyLeft')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title="Sola Hizala"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('justifyCenter')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title="Ortala"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('justifyRight')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title="Sağa Hizala"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('justifyFull')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title="İki Yana Yasla"
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lists */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('insertUnorderedList')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title="Madde İşaretli Liste"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('insertOrderedList')}
                  className="p-1.5 rounded hover:bg-slate-700 text-slate-300 cursor-pointer"
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
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setTextColor(tc);
                      applyTextCommand('foreColor', tc);
                    }}
                    className="w-4 h-4 rounded-full border border-white/20 cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: tc }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Shared Tools: 12 Geometric Shapes Dropdown + Math Symbols + Images */}
          <div className="flex items-center gap-2 flex-wrap shrink-0 relative overflow-visible">
            
            {/* GEOMETRIC SHAPES DROPDOWN (12 Shapes) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShapesDropdownOpen(!shapesDropdownOpen);
                  playSound('click');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  shapesDropdownOpen
                    ? 'bg-teal-500 text-slate-950 shadow-md ring-2 ring-teal-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40'
                }`}
                title="Geometrik Şekil Ekle (Kare, Üçgenler, Daire, Çokgenler vb.)"
              >
                <Shapes className="w-4 h-4 text-teal-300" />
                <span>Geometrik Şekiller</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>

              {/* 12 Shapes Grid Popover (Fixed Overlay over canvas) */}
              {shapesDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[110]"
                    onClick={() => setShapesDropdownOpen(false)}
                  />
                  <div className="absolute top-full right-0 sm:left-0 mt-2 z-[120] w-72 sm:w-80 bg-slate-900 border-2 border-teal-400/80 rounded-2xl p-3 shadow-2xl animate-in zoom-in-95 space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] font-black text-teal-300">
                      <span>Geometrik Şekil Seç & Ekle</span>
                      <button
                        type="button"
                        onClick={() => setShapesDropdownOpen(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-72 overflow-y-auto pr-1">
                      {GEOMETRIC_SHAPES_DATA.map((shapeItem) => (
                        <button
                          key={shapeItem.type}
                          type="button"
                          onClick={() => handleInsertShape(shapeItem)}
                          className="p-2 rounded-xl bg-slate-800/90 hover:bg-teal-500/20 hover:border-teal-400 border border-slate-700/80 flex flex-col items-center justify-center gap-1 text-center transition-all group cursor-pointer"
                        >
                          <div className="p-1.5 rounded-lg bg-slate-900/80 group-hover:scale-110 transition-transform">
                            {shapeItem.previewSvg}
                          </div>
                          <span className="text-[10px] font-bold text-slate-200 group-hover:text-teal-300 leading-tight">
                            {shapeItem.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="text-[9.5px] text-slate-400 pt-1 border-t border-slate-800 text-center">
                      💡 Şekli ekledikten sonra köşelerinden tutup büyütebilir ve kilitleyebilirsiniz.
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Math Symbols Quick Chips & All Symbols Popover */}
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl border border-slate-700 relative">
              <span className="text-[10px] text-teal-300 font-bold mr-1">Sembol:</span>
              {MATH_SYMBOLS.slice(0, 8).map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => insertMathSymbol(sym)}
                  className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 text-[11px] font-bold text-white flex items-center justify-center font-mono cursor-pointer transition-transform hover:scale-110"
                  title={`İmlecin Olduğu Yere Ekle: ${sym}`}
                >
                  {sym}
                </button>
              ))}

              {/* All Symbols Popover Button */}
              <div className="relative">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setSymbolsDropdownOpen(!symbolsDropdownOpen);
                    playSound('click');
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all flex items-center gap-0.5 ${
                    symbolsDropdownOpen
                      ? 'bg-teal-500 text-slate-950 font-black'
                      : 'bg-slate-700 hover:bg-slate-600 text-teal-300'
                  }`}
                  title="Tüm Matematik Sembolleri"
                >
                  <span>Tümü</span>
                  <ChevronDown className="w-2.5 h-2.5" />
                </button>

                {symbolsDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[110]"
                      onClick={() => setSymbolsDropdownOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 z-[120] w-64 bg-slate-900 border-2 border-teal-400/80 rounded-2xl p-3 shadow-2xl animate-in zoom-in-95 space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] font-black text-teal-300">
                        <span>Matematik Sembolleri</span>
                        <button
                          type="button"
                          onClick={() => setSymbolsDropdownOpen(false)}
                          className="text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-6 gap-1.5 max-h-56 overflow-y-auto pr-1">
                        {MATH_SYMBOLS.map((sym) => (
                          <button
                            key={sym}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              insertMathSymbol(sym);
                            }}
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-teal-500/20 hover:border-teal-400 border border-slate-700 text-sm font-bold text-white flex items-center justify-center font-mono cursor-pointer transition-all hover:scale-110"
                            title={`Ekle: ${sym}`}
                          >
                            {sym}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
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
        <div className="fixed top-24 right-8 z-[100] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>Ders notu başarıyla &quot;{selectedClass}&quot; sınıf arşivine kaydedildi!</span>
        </div>
      )}

      {/* 2. MAIN SCROLLABLE WORKSPACE WITH MULTI-PAGE A4 SHEETS */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedObjectId(null);
        }}
        className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/90 flex flex-col items-center gap-8"
      >
        
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

              {/* Standard A4 Paper Container (794 x 1123 px) */}
              <div
                ref={(el) => {
                  pageContainerRefs.current[`page-${pIdx}`] = el;
                }}
                onClick={() => {
                  setActivePageIndex(pIdx);
                }}
                className={`relative w-[794px] min-h-[1123px] rounded-2xl shadow-2xl overflow-hidden transition-all ${
                  isCurrentActive ? 'ring-4 ring-teal-500/80' : 'ring-1 ring-slate-700'
                }`}
                style={{
                  ...getBackgroundStyle(page.backgroundType),
                  boxSizing: 'border-box'
                }}
              >
                
                {/* Compact Minimalist Maarif Header on Page 1 */}
                {pIdx === 0 && (
                  <div className="px-6 py-2 border-b border-slate-200/60 flex items-center justify-between pointer-events-none select-none bg-slate-50/40">
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/logo-192.png"
                        alt="Logo"
                        className="w-6 h-6 rounded-md object-cover border border-amber-500/30 shrink-0"
                      />
                      <div>
                        <div className="text-[9px] font-black text-teal-800 uppercase tracking-wide">
                          MEB • TÜRKİYE YÜZYILI MAARİF MODELİ
                        </div>
                        <div className="text-xs font-extrabold text-slate-900 leading-tight">
                          Matematik Dersi Beyaz Tahta Notları • {outcomeCode}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[9px] text-slate-400 font-bold flex items-center gap-2">
                      <span>{selectedClass} Şubesi</span>
                      <span>•</span>
                      <span>{new Date().toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                )}

                {/* ContentEditable Rich Text Area via WhiteboardTextEditor */}
                <WhiteboardTextEditor
                  key={page.id}
                  pageId={page.id}
                  initialContent={page.textContent || ''}
                  activeMode={activeMode}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  textColor={textColor}
                  onSelectionChange={saveCurrentSelection}
                  onContentChange={(html) => {
                    setPages((prev) =>
                      prev.map((p, i) => (i === pIdx ? { ...p, textContent: html } : p))
                    );
                  }}
                  setEditorRef={(el) => {
                    textEditorRefs.current[`page-${pIdx}`] = el;
                  }}
                />

                {/* 12 GEOMETRIC SHAPES WITH 8-HANDLE SCALING & LOCK FEATURE */}
                {page.shapes &&
                  page.shapes.map((shape) => {
                    const isSelected =
                      selectedObjectId?.type === 'shape' && selectedObjectId.id === shape.id;

                    return (
                      <TransformableObjectWrapper
                        key={shape.id}
                        x={shape.x}
                        y={shape.y}
                        width={shape.width}
                        height={shape.height}
                        isSelected={isSelected}
                        isLocked={shape.isLocked}
                        onSelect={() => {
                          setSelectedObjectId({ type: 'shape', id: shape.id });
                          playSound('click');
                        }}
                        onChangeTransform={(newTransform) => {
                          updateShapeTransform(shape.id, newTransform);
                        }}
                      >
                        <div
                          className="w-full h-full relative"
                          dangerouslySetInnerHTML={{ __html: renderShapeSvgString(shape) }}
                        />

                        {/* Floating Shape Customizer Toolbar when Selected */}
                        {isSelected && (
                          <div
                            className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-3 py-1.5 rounded-xl border border-teal-400 shadow-2xl flex items-center gap-2 text-xs shrink-0 whitespace-nowrap animate-in fade-in"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="font-bold text-teal-300 text-[10px]">
                              {shape.label || 'Şekil'}
                            </span>

                            {/* Lock / Unlock Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleLockShape(shape.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${
                                shape.isLocked
                                  ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300'
                                  : 'bg-slate-800 text-slate-300 hover:text-white'
                              }`}
                              title={shape.isLocked ? 'Kilidi Kaldır' : 'Şekli Kilitle (Hareketi ve Boyutlandırmayı Sabitle)'}
                            >
                              {shape.isLocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                              <span>{shape.isLocked ? 'Kilitli' : 'Kilitle'}</span>
                            </button>

                            {!shape.isLocked && (
                              <>
                                {/* Border Color */}
                                <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
                                  {['#0f172a', '#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'].map((c) => (
                                    <button
                                      key={c}
                                      type="button"
                                      onClick={() => updateShapeTransform(shape.id, { strokeColor: c })}
                                      className={`w-3.5 h-3.5 rounded-full border border-white/40 ${
                                        shape.strokeColor === c ? 'scale-125 ring-2 ring-teal-400' : ''
                                      }`}
                                      style={{ backgroundColor: c }}
                                      title="Çerçeve Rengi"
                                    />
                                  ))}
                                </div>

                                {/* Fill Color Picker */}
                                <select
                                  value={shape.fillColor}
                                  onChange={(e) => updateShapeTransform(shape.id, { fillColor: e.target.value })}
                                  className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-teal-300 outline-none"
                                  title="Dolgu Rengi"
                                >
                                  {FILL_COLORS.map((fc) => (
                                    <option key={fc.id} value={fc.id}>
                                      {fc.label}
                                    </option>
                                  ))}
                                </select>

                                {/* Thickness */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextWidth = shape.strokeWidth >= 6 ? 2 : shape.strokeWidth + 2;
                                    updateShapeTransform(shape.id, { strokeWidth: nextWidth });
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300 hover:text-white"
                                  title="Çizgi Kalınlığı"
                                >
                                  {shape.strokeWidth}px
                                </button>

                                {/* Dashed toggle */}
                                <button
                                  type="button"
                                  onClick={() => updateShapeTransform(shape.id, { isDashed: !shape.isDashed })}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    shape.isDashed ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                                  }`}
                                  title="Kesikli Çizgi"
                                >
                                  - - -
                                </button>

                                {/* Duplicate */}
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateShape(shape.id)}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                  title="Şekli Çoğalt"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteShape(shape.id)}
                                  className="p-1 rounded bg-rose-900/80 hover:bg-rose-700 text-rose-200"
                                  title="Şekli Sil"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </TransformableObjectWrapper>
                    );
                  })}

                {/* EMBEDDED IMAGES WITH 8-HANDLE SCALING & LOCK FEATURE */}
                {page.images &&
                  page.images.map((img) => {
                    const isSelected =
                      selectedObjectId?.type === 'image' && selectedObjectId.id === img.id;

                    return (
                      <TransformableObjectWrapper
                        key={img.id}
                        x={img.x}
                        y={img.y}
                        width={img.width}
                        height={img.height}
                        isSelected={isSelected}
                        isLocked={img.isLocked}
                        onSelect={() => {
                          setSelectedObjectId({ type: 'image', id: img.id });
                          playSound('click');
                        }}
                        onChangeTransform={(newTransform) => {
                          updateImageTransform(img.id, newTransform);
                        }}
                      >
                        <img
                          src={img.url}
                          alt="Ders Görseli"
                          className="w-full h-full object-contain pointer-events-none"
                          crossOrigin="anonymous"
                        />

                        {/* Floating Image Action Toolbar */}
                        {isSelected && (
                          <div
                            className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-3 py-1 rounded-xl border border-teal-400 shadow-2xl flex items-center gap-2 text-xs shrink-0 whitespace-nowrap animate-in fade-in"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="font-bold text-teal-300 text-[10px]">
                              {Math.round(img.width)} × {Math.round(img.height)} px
                            </span>

                            {/* Lock / Unlock Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleLockImage(img.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${
                                img.isLocked
                                  ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300'
                                  : 'bg-slate-800 text-slate-300 hover:text-white'
                              }`}
                              title={img.isLocked ? 'Görsel Kilidini Kaldır' : 'Görseli Kilitle'}
                            >
                              {img.isLocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                              <span>{img.isLocked ? 'Kilitli' : 'Kilitle'}</span>
                            </button>

                            {!img.isLocked && (
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(img.id)}
                                className="p-1 rounded bg-rose-900/80 hover:bg-rose-700 text-rose-200"
                                title="Resmi Sil"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </TransformableObjectWrapper>
                    );
                  })}

                {/* Freehand Drawing Overlay Canvas (Rendered at z-30 ON TOP of images & shapes when drawing) */}
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
                    className={`absolute inset-0 z-30 ${
                      activeMode === 'pen' ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
                    }`}
                  />
                ) : (
                  page.drawingDataUrl && (
                    <img
                      src={page.drawingDataUrl}
                      alt="Drawing Layer"
                      className="absolute inset-0 w-full h-full pointer-events-none z-25"
                    />
                  )
                )}

                {/* Page Footer */}
                <div className="absolute bottom-2 left-6 right-6 border-t border-slate-200/60 pt-1.5 flex items-center justify-between text-[9px] text-slate-400 pointer-events-none">
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
      <WebImageSearchModal
        isOpen={webImageModalOpen}
        onClose={() => setWebImageModalOpen(false)}
        onSelectImage={(url) => insertImageToActivePage(url)}
      />

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

// ---------------------------------------------------------------------------
// 8-HANDLE TRANSFORMABLE OBJECT WRAPPER (Word "Kare" Serbest Ölçeklendirme & Kilit)
// ---------------------------------------------------------------------------
interface TransformableObjectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  isLocked?: boolean;
  onSelect: () => void;
  onChangeTransform: (updates: { x?: number; y?: number; width?: number; height?: number }) => void;
  children: React.ReactNode;
}

type HandleDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

function TransformableObjectWrapper({
  x,
  y,
  width,
  height,
  isSelected,
  isLocked = false,
  onSelect,
  onChangeTransform,
  children
}: TransformableObjectProps) {
  const isDragging = useRef(false);
  const resizeHandle = useRef<HandleDirection | null>(null);
  const startPos = useRef({ clientX: 0, clientY: 0, x, y, width, height });

  // Drag start from body
  const handleMouseDownBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    if (isLocked) return;

    isDragging.current = true;
    startPos.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      x,
      y,
      width,
      height
    };

    const handleMouseMove = (moveEvt: MouseEvent) => {
      if (!isDragging.current || isLocked) return;
      const deltaX = moveEvt.clientX - startPos.current.clientX;
      const deltaY = moveEvt.clientY - startPos.current.clientY;

      onChangeTransform({
        x: Math.max(0, Math.min(794 - width, startPos.current.x + deltaX)),
        y: Math.max(0, Math.min(1123 - height, startPos.current.y + deltaY))
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Resize start from any of the 8 handles
  const handleMouseDownResize = (e: React.MouseEvent, handle: HandleDirection) => {
    e.stopPropagation();
    if (isLocked) return;

    resizeHandle.current = handle;
    startPos.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      x,
      y,
      width,
      height
    };

    const handleMouseMove = (moveEvt: MouseEvent) => {
      if (!resizeHandle.current || isLocked) return;
      const deltaX = moveEvt.clientX - startPos.current.clientX;
      const deltaY = moveEvt.clientY - startPos.current.clientY;
      const dir = resizeHandle.current;

      let newX = startPos.current.x;
      let newY = startPos.current.y;
      let newW = startPos.current.width;
      let newH = startPos.current.height;

      const MIN_SIZE = 30;

      // Handle calculations
      if (dir.includes('e')) {
        newW = Math.max(MIN_SIZE, startPos.current.width + deltaX);
      }
      if (dir.includes('s')) {
        newH = Math.max(MIN_SIZE, startPos.current.height + deltaY);
      }
      if (dir.includes('w')) {
        const potentialW = startPos.current.width - deltaX;
        if (potentialW >= MIN_SIZE) {
          newW = potentialW;
          newX = startPos.current.x + deltaX;
        }
      }
      if (dir.includes('n')) {
        const potentialH = startPos.current.height - deltaY;
        if (potentialH >= MIN_SIZE) {
          newH = potentialH;
          newY = startPos.current.y + deltaY;
        }
      }

      onChangeTransform({ x: newX, y: newY, width: newW, height: newH });
    };

    const handleMouseUp = () => {
      resizeHandle.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      onMouseDown={handleMouseDownBody}
      className={`absolute z-20 group/obj transition-shadow ${
        isSelected
          ? isLocked
            ? 'ring-2 ring-amber-400 ring-offset-2'
            : 'ring-2 ring-teal-500 ring-offset-2'
          : 'hover:ring-1 hover:ring-teal-400/60'
      }`}
      style={{
        top: `${y}px`,
        left: `${x}px`,
        width: `${width}px`,
        height: `${height}px`,
        cursor: isLocked ? 'default' : isSelected ? 'move' : 'pointer'
      }}
    >
      {children}

      {/* Lock Badge indicator if locked */}
      {isLocked && (
        <div className="absolute top-1 right-1 w-5 h-5 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-[10px] shadow-md z-30 font-bold">
          🔒
        </div>
      )}

      {/* 8 RESIZE HANDLES (Corners + Midpoints) - Only active when NOT locked */}
      {isSelected && !isLocked && (
        <>
          {/* Top-Left (NW) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'nw')}
            className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-nwse-resize z-30 hover:scale-125 transition-transform"
            title="Köşeden Ölçekle"
          />

          {/* Top-Middle (N) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'n')}
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-ns-resize z-30 hover:scale-125 transition-transform"
            title="Dikey Boyutlandır"
          />

          {/* Top-Right (NE) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'ne')}
            className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-nesw-resize z-30 hover:scale-125 transition-transform"
            title="Köşeden Ölçekle"
          />

          {/* Middle-Right (E) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'e')}
            className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-ew-resize z-30 hover:scale-125 transition-transform"
            title="Yatay Boyutlandır"
          />

          {/* Bottom-Right (SE) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'se')}
            className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-nwse-resize z-30 hover:scale-125 transition-transform"
            title="Köşeden Ölçekle"
          />

          {/* Bottom-Middle (S) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 's')}
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-ns-resize z-30 hover:scale-125 transition-transform"
            title="Dikey Boyutlandır"
          />

          {/* Bottom-Left (SW) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'sw')}
            className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-nesw-resize z-30 hover:scale-125 transition-transform"
            title="Köşeden Ölçekle"
          />

          {/* Middle-Left (W) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'w')}
            className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-ew-resize z-30 hover:scale-125 transition-transform"
            title="Yatay Boyutlandır"
          />
        </>
      )}
    </div>
  );
}
