'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  ClassroomFileRecord,
  WhiteboardPageData,
  WhiteboardImageItem,
  WhiteboardShapeItem,
  GeometricShapeType,
  saveClassroomFile,
  updateClassroomFile,
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
  Undo2,
  Redo2,
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
  Unlock,
  RotateCw,
  RotateCcw,
  Compass,
  CircleDot
} from 'lucide-react';

interface WhiteboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  outcomeCode?: string;
  outcomeTitle?: string;
  classSection?: string;
  initialFile?: ClassroomFileRecord | null;
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

const COLOR_PALETTES = [
  {
    category: 'Mürekkep & Kalem Renkleri',
    colors: [
      { hex: '#0f172a', label: 'Koyu Siyah' },
      { hex: '#334155', label: 'Grafit Gri' },
      { hex: '#1d4ed8', label: 'Ders Mavisi' },
      { hex: '#0284c7', label: 'Gökyüzü Mavisi' },
      { hex: '#0d9488', label: 'Maarif Turkuazı' },
      { hex: '#16a34a', label: 'Tahta Yeşili' },
      { hex: '#d97706', label: 'Amber / Altın' },
      { hex: '#dc2626', label: 'Uyarı Kırmızısı' },
      { hex: '#7c3aed', label: 'Geometri Moru' },
      { hex: '#db2777', label: 'Gül Pembesi' },
      { hex: '#ea580c', label: 'Canlı Turuncu' },
      { hex: '#ffffff', label: 'Saf Beyaz' }
    ]
  },
  {
    category: 'Fosforlu & Vurgu Tonları',
    colors: [
      { hex: '#fef08a', label: 'Fosforlu Sarı' },
      { hex: '#bbf7d0', label: 'Fosforlu Yeşil' },
      { hex: '#bae6fd', label: 'Fosforlu Mavi' },
      { hex: '#fbcfe8', label: 'Fosforlu Pembe' },
      { hex: '#fed7aa', label: 'Fosforlu Turuncu' },
      { hex: '#ddd6fe', label: 'Fosforlu Lavanta' }
    ]
  }
];

const PEN_WIDTH_PRESETS = [
  { width: 1, label: '1px', desc: 'İnce Çizim (İğne Uç)' },
  { width: 2, label: '2px', desc: 'Standart Kalem (Önerilen)' },
  { width: 4, label: '4px', desc: 'Belirgin Çizgi' },
  { width: 6, label: '6px', desc: 'Kalın Başlık Ucu' },
  { width: 10, label: '10px', desc: 'Keçeli Kalem' },
  { width: 16, label: '16px', desc: 'Vurgulayıcı & Marker' },
  { width: 24, label: '24px', desc: 'Geniş Fosforlu Şerit' }
];

const CATEGORIZED_MATH_SYMBOLS = [
  {
    category: 'Geometri & Açılar',
    symbols: ['°', '∠', '∡', '//', '⊥', '△', '≅', '∼', '⊾', '∦']
  },
  {
    category: 'İşlemler & Karşılaştırma',
    symbols: ['±', '×', '÷', '≠', '≤', '≥', '≈', '≡', '∝', '∓']
  },
  {
    category: 'Sayılar & Cebir',
    symbols: ['√', '∛', 'π', '∞', '‰', '%', '∑', '∫', 'Δ', '∂']
  },
  {
    category: 'Yunan Harfleri (Açı İsimleri)',
    symbols: ['α', 'β', 'γ', 'θ', 'λ', 'μ', 'φ', 'ω', 'Δ', 'Ω']
  },
  {
    category: 'Kümeler & Mantık',
    symbols: ['∈', '∉', '⊂', '⊆', '∪', '∩', '∅', '∀', '∃', '⇒', '⇔']
  }
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
  '°', '∠', '∡', '//', '⊥', '△', '≅', '≠',
  '≤', '≥', 'π', '√', '≈', 'α', 'β', 'θ',
  'λ', 'Δ', '±', '÷', '×', '∞', '∑', '∫',
  '‰', '∈', '∉', '⊂', '⊆', '∪', '∩', '∅'
];

// 17 Geometrik Şekil ve Temel Kavram Tanımları
const GEOMETRIC_SHAPES_DATA: {
  type: GeometricShapeType;
  label: string;
  category: string;
  defaultW: number;
  defaultH: number;
  previewSvg: React.ReactNode;
}[] = [
  // 1. Temel Geometrik Kavramlar
  {
    type: 'point',
    label: 'Nokta (• A)',
    category: 'Temel Kavramlar',
    defaultW: 70,
    defaultH: 70,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="5" fill="currentColor" />
        <text x="17" y="10" fontSize="9" fontWeight="900" fill="currentColor">A</text>
      </svg>
    )
  },
  {
    type: 'line',
    label: 'Doğru (↔ AB)',
    category: 'Temel Kavramlar',
    defaultW: 240,
    defaultH: 60,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="12" x2="21" y2="12" />
        <polyline points="6 9 3 12 6 15" />
        <polyline points="18 9 21 12 18 15" />
        <circle cx="8" cy="12" r="1.5" fill="currentColor" />
        <circle cx="16" cy="12" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    type: 'segment',
    label: 'Doğru Parçası [AB]',
    category: 'Temel Kavramlar',
    defaultW: 220,
    defaultH: 60,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="4" y1="12" x2="20" y2="12" />
        <circle cx="4" cy="12" r="2.5" fill="currentColor" />
        <circle cx="20" cy="12" r="2.5" fill="currentColor" />
      </svg>
    )
  },
  {
    type: 'ray',
    label: 'Işın [AB →',
    category: 'Temel Kavramlar',
    defaultW: 220,
    defaultH: 60,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="4" y1="12" x2="21" y2="12" />
        <circle cx="4" cy="12" r="2.5" fill="currentColor" />
        <polyline points="18 9 21 12 18 15" />
      </svg>
    )
  },
  {
    type: 'angle',
    label: 'Açı (Ayarlanabilir Kol)',
    category: 'Temel Kavramlar',
    defaultW: 200,
    defaultH: 200,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="4" y1="20" x2="20" y2="20" />
        <line x1="4" y1="20" x2="16" y2="6" />
        <path d="M 10 20 A 6 6 0 0 0 8 15" stroke="currentColor" fill="none" />
        <circle cx="4" cy="20" r="2" fill="currentColor" />
      </svg>
    )
  },
  // 2. Üçgenler
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
  // 3. Dörtgenler
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
  },
  // 4. Çokgenler
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
    type: 'heptagon',
    label: 'Düzgün Yedigen',
    category: 'Çokgenler',
    defaultW: 180,
    defaultH: 180,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 20 6 22 15 17 22 7 22 2 15 4 6" />
      </svg>
    )
  },
  {
    type: 'octagon',
    label: 'Düzgün Sekizgen',
    category: 'Çokgenler',
    defaultW: 180,
    defaultH: 180,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="8 2 16 2 22 8 22 16 16 22 8 22 2 16 2 8" />
      </svg>
    )
  },
  // 5. Dairesel
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
  // 6. 3 Boyutlu Cisimler (2D Görünümler)
  {
    type: 'cylinder',
    label: 'Silindir',
    category: '3 Boyutlu Cisimler',
    defaultW: 160,
    defaultH: 200,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="6" rx="8" ry="3" />
        <path d="M4 6 v12 a8 3 0 0 0 16 0 V6" />
      </svg>
    )
  },
  {
    type: 'cube',
    label: 'Küp',
    category: '3 Boyutlu Cisimler',
    defaultW: 180,
    defaultH: 180,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="8" width="12" height="12" />
        <path d="M3 8 L9 3 L21 3 L15 8 M21 3 L21 15 L15 20" />
      </svg>
    )
  },
  {
    type: 'rectangular_prism',
    label: 'Dikdörtgenler Prizması',
    category: '3 Boyutlu Cisimler',
    defaultW: 220,
    defaultH: 160,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="9" width="14" height="11" />
        <path d="M2 9 L7 4 L21 4 L16 9 M21 4 L21 15 L16 20" />
      </svg>
    )
  },
  {
    type: 'cone',
    label: 'Koni',
    category: '3 Boyutlu Cisimler',
    defaultW: 160,
    defaultH: 200,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3 L4 18 a8 3 0 0 0 16 0 Z" />
      </svg>
    )
  },
  {
    type: 'square_prism',
    label: 'Kare Prizma',
    category: '3 Boyutlu Cisimler',
    defaultW: 160,
    defaultH: 220,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 20 6 12 10 4 6" />
        <path d="M4 6 v12 L12 22 L20 18 V6 M12 10 v12" />
      </svg>
    )
  },
  {
    type: 'square_pyramid',
    label: 'Kare Piramit',
    category: '3 Boyutlu Cisimler',
    defaultW: 180,
    defaultH: 190,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3 L3 19 L15 22 L21 17 Z M12 3 L15 22" />
      </svg>
    )
  },
  {
    type: 'triangular_pyramid',
    label: 'Üçgen Piramit',
    category: '3 Boyutlu Cisimler',
    defaultW: 180,
    defaultH: 180,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 3 3 19 12 22 21 19" />
        <line x1="12" y1="3" x2="12" y2="22" />
      </svg>
    )
  },
  {
    type: 'rectangular_pyramid',
    label: 'Dikdörtgen Piramit',
    category: '3 Boyutlu Cisimler',
    defaultW: 200,
    defaultH: 180,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3 L2 18 L16 22 L22 16 Z M12 3 L16 22" />
      </svg>
    )
  },
  {
    type: 'pentagonal_pyramid',
    label: 'Beşgen Piramit',
    category: '3 Boyutlu Cisimler',
    defaultW: 190,
    defaultH: 190,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3 L3 17 L8 22 L16 22 L21 17 Z M12 3 L8 22 M12 3 L16 22" />
      </svg>
    )
  },
  {
    type: 'hexagonal_pyramid',
    label: 'Altıgen Piramit',
    category: '3 Boyutlu Cisimler',
    defaultW: 190,
    defaultH: 190,
    previewSvg: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3 L2 16 L7 22 L12 22 L17 22 L22 16 Z M12 3 L7 22 M12 3 L12 22 M12 3 L17 22" />
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
        className="p-6 sm:p-8 outline-none min-h-[900px] text-slate-900 relative z-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_li]:my-1 [&_li]:leading-relaxed"
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
  classSection,
  initialFile
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
  const [loadedFileId, setLoadedFileId] = useState<string | null>(initialFile?.id || null);

  // Load initial file if provided
  useEffect(() => {
    if (isOpen && initialFile) {
      if (Array.isArray(initialFile.pages) && initialFile.pages.length > 0) {
        setPages(initialFile.pages);
      }
      if (initialFile.title) setDocumentTitle(initialFile.title);
      if (initialFile.classSection) setSelectedClass(initialFile.classSection);
      setLoadedFileId(initialFile.id);
      setActivePageIndex(0);
    } else if (isOpen && !initialFile) {
      setLoadedFileId(null);
    }
  }, [isOpen, initialFile]);

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
  const [penColorDropdownOpen, setPenColorDropdownOpen] = useState(false);
  const [penWidthDropdownOpen, setPenWidthDropdownOpen] = useState(false);
  const [textColorDropdownOpen, setTextColorDropdownOpen] = useState(false);
  const [imageDropdownOpen, setImageDropdownOpen] = useState(false);
  const [bgDropdownOpen, setBgDropdownOpen] = useState(false);
  const [activeSymbolCategory, setActiveSymbolCategory] = useState<string>(CATEGORIZED_MATH_SYMBOLS[0].category);
  const [showHeader, setShowHeader] = useState<boolean>(true);

  // Mounted state for portal
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Undo / Redo stacks for Canvas Freehand Drawing
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const strokeStartState = useRef<string | null>(null);

  // Clear undo/redo stacks on page switch or document change
  useEffect(() => {
    setUndoStack([]);
    setRedoStack([]);
  }, [activePageIndex, loadedFileId]);

  // Modals & UI States
  const [webImageModalOpen, setWebImageModalOpen] = useState(false);
  const [classroomFilesModalOpen, setClassroomFilesModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');

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

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentSnapshot = canvas.toDataURL('image/png');
    const previousSnapshot = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, currentSnapshot]);

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      setPages((prev) =>
        prev.map((p, i) => (i === activePageIndex ? { ...p, drawingDataUrl: dataUrl } : p))
      );
    };
    img.src = previousSnapshot;
    playSound('click');
  }, [undoStack, activePageIndex, playSound]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentSnapshot = canvas.toDataURL('image/png');
    const nextSnapshot = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, currentSnapshot]);

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      setPages((prev) =>
        prev.map((p, i) => (i === activePageIndex ? { ...p, drawingDataUrl: dataUrl } : p))
      );
    };
    img.src = nextSnapshot;
    playSound('click');
  }, [redoStack, activePageIndex, playSound]);

  // Undo / Redo keyboard shortcuts for drawing mode
  useEffect(() => {
    if (!isOpen) return;
    const handleUndoRedoKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleUndoRedoKeyDown);
    return () => window.removeEventListener('keydown', handleUndoRedoKeyDown);
  }, [isOpen, handleUndo, handleRedo]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeMode !== 'pen') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Save snapshot before new stroke
    strokeStartState.current = canvas.toDataURL('image/png');
    isDrawing.current = true;
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
    if (strokeStartState.current) {
      setUndoStack((prev) => [...prev.slice(-25), strokeStartState.current!]);
      setRedoStack([]);
      strokeStartState.current = null;
    }
    saveCurrentCanvasData();
  };

  if (!isOpen || !mounted) return null;
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

  // --- TEXT FORMATTING & WORD COMMANDS ---
  const applyTextCommand = (command: string, value: string = '') => {
    const editorEl = textEditorRefs.current[`page-${activePageIndex}`];
    if (editorEl) {
      editorEl.focus();
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || !editorEl.contains(selection.anchorNode)) {
        const range = document.createRange();
        range.selectNodeContents(editorEl);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
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
    setActiveMode('text');
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
    setActiveMode('text');
    const newShape: WhiteboardShapeItem = {
      id: `shape-${Date.now()}`,
      type: shapeData.type,
      x: 100,
      y: 160,
      width: shapeData.defaultW,
      height: shapeData.defaultH,
      rotation: 0,
      strokeColor: penColor === '#ffffff' ? '#0f172a' : penColor,
      strokeWidth: penWidth > 1 ? penWidth : 3,
      fillColor: shapeData.type === 'disc' ? '#14b8a625' : 'transparent',
      isDashed: false,
      label: shapeData.label,
      isLocked: false,
      angleDegrees: shapeData.type === 'angle' ? 60 : undefined,
      pointName: shapeData.type === 'point' ? 'A' : undefined
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
    setActiveMode('text');
    const cloned: WhiteboardShapeItem = {
      ...shape,
      id: `shape-${Date.now()}`,
      x: Math.min(650, shape.x + 20),
      y: Math.min(950, shape.y + 20)
    };
    setPages((prev) =>
      prev.map((p, i) => (i === activePageIndex ? { ...p, shapes: [...(p.shapes || []), cloned] } : p))
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

  // --- UPDATE EXISTING CLASSROOM FILE (Overwrites existing file & title) ---
  const handleUpdateExistingFile = async () => {
    if (!loadedFileId) {
      handleSaveAsNewFile();
      return;
    }
    try {
      setIsSaving(true);
      playSound('select');
      saveCurrentCanvasData();

      const teacherName = currentUser?.name || 'Ahmet Yılmaz';
      const teacherSchool = (currentUser as any)?.school || 'Edirne Selimiye İmam Hatip Ortaokulu';

      updateClassroomFile(loadedFileId, {
        title: documentTitle || `${selectedClass} ${outcomeCode} Ders Notları`,
        classSection: selectedClass,
        outcomeCode,
        outcomeTitle,
        authorName: teacherName,
        school: teacherSchool,
        pages,
        tags: [outcomeCode, `${selectedClass} Şubesi`, 'Ders Notu', 'Beyaz Tahta']
      });

      playSound('success');
      setToastMessage(`"${documentTitle}" ders notu ve değişiklikler başarıyla güncellendi!`);
      setSaveSuccessToast(true);
      setTimeout(() => setSaveSuccessToast(false), 3500);
    } catch (err) {
      console.error('Dosya güncelleme hatası:', err);
      alert('Ders notu güncellenirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- SAVE AS NEW CLASSROOM FILE ---
  const handleSaveAsNewFile = async () => {
    try {
      setIsSaving(true);
      playSound('select');
      saveCurrentCanvasData();

      const teacherName = currentUser?.name || 'Ahmet Yılmaz';
      const teacherSchool = (currentUser as any)?.school || 'Edirne Selimiye İmam Hatip Ortaokulu';

      const newRecord = saveClassroomFile({
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

      setLoadedFileId(newRecord.id);
      playSound('success');
      setToastMessage(`"${newRecord.title}" yeni ders notu olarak sınıf arşivine eklendi!`);
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

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex flex-col select-none animate-in fade-in duration-200">
      
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
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-black text-white hover:bg-slate-800/60 focus:bg-slate-800 px-2 py-0.5 rounded-lg outline-none border border-transparent focus:border-teal-400 max-w-[240px] sm:max-w-md"
                  title="Belge Başlığı (Değiştirmek için tıklayın)"
                />
                {loadedFileId && (
                  <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-[9px]">
                    <span>✏️</span>
                    <span>Mevcut Not</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-teal-300 font-mono px-2">
                <span>{outcomeCode}</span>
                <span>•</span>
                <span>{pages.length} Sayfa A4</span>
              </div>
            </div>
          </div>

          {/* Center: Mode Switch (Çizim vs Metin) & Üstbilgi Toggle */}
          <div className="flex items-center gap-2">
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

            {/* Üstbilgi (Header) Onay Butonu / Checkbox */}
            <label
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all select-none ${
                showHeader
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title={showHeader ? 'Sayfa üst bilgisini gizle (Komple boş sayfa)' : 'Sayfa üst bilgisini göster'}
            >
              <input
                type="checkbox"
                checked={showHeader}
                onChange={(e) => {
                  setShowHeader(e.target.checked);
                  playSound('click');
                }}
                className="w-3.5 h-3.5 rounded accent-teal-500 cursor-pointer"
              />
              <span>Üstbilgi</span>
            </label>
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

            {loadedFileId ? (
              <>
                {/* 1. Update Existing File */}
                <button
                  type="button"
                  onClick={handleUpdateExistingFile}
                  disabled={isSaving}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Yapılan tüm değişiklikleri ve yeni başlığı mevcut ders notunun üzerine kaydet"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Kaydet</span>
                </button>

                {/* 2. Save As New File */}
                <button
                  type="button"
                  onClick={handleSaveAsNewFile}
                  disabled={isSaving}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Bu ders notunu yeni ve ayrı bir ders notu olarak arşive kaydet"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Farklı Kaydet</span>
                </button>
              </>
            ) : (
              /* Brand New File: Save to Classroom */
              <button
                type="button"
                onClick={handleSaveAsNewFile}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Bu ders notunu sınıfa kaydet ve öğrencilerle paylaş"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Sınıfa Kaydet</span>
              </button>
            )}

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
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-800 text-xs relative overflow-visible flex-wrap sm:flex-nowrap">
          
          {/* Mode A: Drawing Tools Ribbon */}
          {activeMode === 'pen' ? (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Segmented Drawing Tools (Kalem, Vurgu, Silgi) */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 shadow-sm">
                <button
                  type="button"
                  onClick={() => setDrawingTool('pen')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    drawingTool === 'pen' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-700/80 hover:text-white'
                  }`}
                  title="Normal Çizim Kalemi"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Kalem</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDrawingTool('highlighter')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    drawingTool === 'highlighter' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-700/80 hover:text-white'
                  }`}
                  title="Fosforlu Vurgu Kalemi (Yarı Şeffaf)"
                >
                  <Highlighter className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Vurgu</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDrawingTool('eraser')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    drawingTool === 'eraser' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-700/80 hover:text-white'
                  }`}
                  title="Silgi"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Silgi</span>
                </button>
              </div>

              {/* Undo / Redo Buttons */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 shadow-sm">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all text-xs font-semibold cursor-pointer ${
                    undoStack.length === 0
                      ? 'text-slate-600 cursor-not-allowed opacity-40'
                      : 'text-slate-200 hover:bg-slate-700 hover:text-white active:scale-95'
                  }`}
                  title="Geri Al (Ctrl+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Geri</span>
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all text-xs font-semibold cursor-pointer ${
                    redoStack.length === 0
                      ? 'text-slate-600 cursor-not-allowed opacity-40'
                      : 'text-slate-200 hover:bg-slate-700 hover:text-white active:scale-95'
                  }`}
                  title="İleri Al (Ctrl+Y / Cmd+Shift+Z)"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">İleri</span>
                </button>
              </div>

              {/* AÇILIR RENK PALETİ (POPOVER) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setPenColorDropdownOpen(!penColorDropdownOpen);
                    setPenWidthDropdownOpen(false);
                    playSound('click');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                    penColorDropdownOpen
                      ? 'bg-slate-700 text-white ring-2 ring-teal-400'
                      : 'bg-slate-800 hover:bg-slate-700/90 text-slate-200 border border-slate-700'
                  }`}
                  title="Kalem Rengi Seç"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/40 shadow-inner inline-block shrink-0"
                    style={{ backgroundColor: penColor }}
                  />
                  <span>Renk</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {penColorDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[110]"
                      onClick={() => setPenColorDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 z-[120] w-64 bg-slate-900 border border-slate-700 rounded-2xl p-3 shadow-2xl animate-in zoom-in-95 space-y-3">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] font-black text-teal-300">
                        <span className="flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-teal-400" />
                          <span>Mürekkep & Kalem Rengi</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setPenColorDropdownOpen(false)}
                          className="text-slate-400 hover:text-white p-0.5"
                        >
                          ✕
                        </button>
                      </div>

                      {COLOR_PALETTES.map((paletteGroup) => (
                        <div key={paletteGroup.category} className="space-y-1.5">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {paletteGroup.category}
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {paletteGroup.colors.map((c) => (
                              <button
                                key={c.hex}
                                type="button"
                                onClick={() => {
                                  setPenColor(c.hex);
                                  setPenColorDropdownOpen(false);
                                  playSound('click');
                                }}
                                className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all cursor-pointer ${
                                  penColor === c.hex
                                    ? 'border-teal-400 bg-teal-500/20 shadow-sm scale-105'
                                    : 'border-slate-800 hover:border-slate-600 hover:bg-slate-800'
                                }`}
                                title={c.label}
                              >
                                <span
                                  className="w-5 h-5 rounded-full border border-white/30 shadow-sm shrink-0"
                                  style={{ backgroundColor: c.hex }}
                                />
                                <span className="text-[9px] text-slate-300 font-medium truncate w-full text-center">
                                  {c.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Özel Renk Seçici */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-bold">Özel Renk:</span>
                        <input
                          type="color"
                          value={penColor.startsWith('#') && penColor.length === 7 ? penColor : '#0f172a'}
                          onChange={(e) => setPenColor(e.target.value)}
                          className="w-7 h-7 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                          title="Renk Paletinden Özel Renk Seç"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* AÇILIR KALEM KALINLIĞI PALETİ (POPOVER) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setPenWidthDropdownOpen(!penWidthDropdownOpen);
                    setPenColorDropdownOpen(false);
                    playSound('click');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                    penWidthDropdownOpen
                      ? 'bg-slate-700 text-white ring-2 ring-teal-400'
                      : 'bg-slate-800 hover:bg-slate-700/90 text-slate-200 border border-slate-700'
                  }`}
                  title="Kalem Kalınlığı Ayarla"
                >
                  <span
                    className="rounded-full bg-teal-400 inline-block shrink-0"
                    style={{ width: Math.max(4, Math.min(10, penWidth)), height: Math.max(4, Math.min(10, penWidth)) }}
                  />
                  <span>{penWidth} px</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {penWidthDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[110]"
                      onClick={() => setPenWidthDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 z-[120] w-56 bg-slate-900 border border-slate-700 rounded-2xl p-3 shadow-2xl animate-in zoom-in-95 space-y-3">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] font-black text-teal-300">
                        <span>Kalem Kalınlığı</span>
                        <button
                          type="button"
                          onClick={() => setPenWidthDropdownOpen(false)}
                          className="text-slate-400 hover:text-white p-0.5"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Presets List */}
                      <div className="space-y-1">
                        {PEN_WIDTH_PRESETS.map((preset) => (
                          <button
                            key={preset.width}
                            type="button"
                            onClick={() => {
                              setPenWidth(preset.width);
                              setPenWidthDropdownOpen(false);
                              playSound('click');
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                              penWidth === preset.width
                                ? 'bg-teal-500/20 border border-teal-400 text-teal-300 font-bold'
                                : 'hover:bg-slate-800 text-slate-300 border border-transparent'
                            }`}
                          >
                            <span className="text-xs">{preset.label}</span>
                            <div className="flex items-center gap-2">
                              <div
                                className="bg-teal-400 rounded-full"
                                style={{ width: 28, height: Math.min(14, preset.width) }}
                              />
                              <span className="text-[10px] font-mono text-slate-400 w-7 text-right">
                                {preset.width}px
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Fine Slider */}
                      <div className="pt-2 border-t border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Hassas Ayar:</span>
                          <span className="font-mono text-teal-300 font-bold">{penWidth} px</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="32"
                          value={penWidth}
                          onChange={(e) => setPenWidth(Number(e.target.value))}
                          className="w-full accent-teal-400 cursor-pointer"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Clear Page Drawings Button */}
              <button
                type="button"
                onClick={handleClearPage}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 transition-colors cursor-pointer"
                title="Sayfadaki Tüm Çizimleri Temizle"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Mode B: Word Typography Ribbon */
            <div className="flex items-center gap-2 flex-wrap">
              {/* Font Family Selector */}
              <select
                value={fontFamily}
                onChange={(e) => handleFontChange(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-teal-400 cursor-pointer"
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
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-teal-400 font-mono cursor-pointer"
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
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 font-bold cursor-pointer transition-colors"
                  title="Kalın (Ctrl+B)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('italic')}
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 italic cursor-pointer transition-colors"
                  title="İtalik (Ctrl+I)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('underline')}
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 underline cursor-pointer transition-colors"
                  title="Altı Çizili (Ctrl+U)"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('strikeThrough')}
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
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
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
                  title="Sola Hizala"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('justifyCenter')}
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
                  title="Ortala"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('justifyRight')}
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
                  title="Sağa Hizala"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('justifyFull')}
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
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
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
                  title="Madde İşaretli Liste"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyTextCommand('insertOrderedList')}
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
                  title="Numaralı Liste"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* AÇILIR YAZI RENGİ PALETİ */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setTextColorDropdownOpen(!textColorDropdownOpen);
                    playSound('click');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    textColorDropdownOpen
                      ? 'bg-slate-700 text-white ring-2 ring-teal-400'
                      : 'bg-slate-800 hover:bg-slate-700/90 text-slate-200 border border-slate-700'
                  }`}
                  title="Metin Yazı Rengi Seç"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-inner inline-block shrink-0"
                    style={{ backgroundColor: textColor }}
                  />
                  <span>Yazı Rengi</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {textColorDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[110]"
                      onClick={() => setTextColorDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 z-[120] w-52 bg-slate-900 border border-slate-700 rounded-2xl p-3 shadow-2xl animate-in zoom-in-95 space-y-2.5">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] font-black text-teal-300">
                        <span>Yazı Rengi</span>
                        <button
                          type="button"
                          onClick={() => setTextColorDropdownOpen(false)}
                          className="text-slate-400 hover:text-white p-0.5"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {TEXT_COLORS.map((tc) => (
                          <button
                            key={tc}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setTextColor(tc);
                              applyTextCommand('foreColor', tc);
                              setTextColorDropdownOpen(false);
                            }}
                            className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                              textColor === tc
                                ? 'border-teal-400 bg-teal-500/20 scale-110 shadow-sm'
                                : 'border-slate-800 hover:border-slate-600 bg-slate-800'
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full border border-white/30"
                              style={{ backgroundColor: tc }}
                            />
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-bold">Özel Renk:</span>
                        <input
                          type="color"
                          value={textColor.startsWith('#') && textColor.length === 7 ? textColor : '#0f172a'}
                          onChange={(e) => {
                            setTextColor(e.target.value);
                            applyTextCommand('foreColor', e.target.value);
                          }}
                          className="w-7 h-7 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                          title="Özel Yazı Rengi Seç"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Shared Tools: 17 Geometric Shapes Dropdown + Categorized Math Symbols + Media + Background */}
          <div className="flex items-center gap-2 flex-wrap shrink-0 relative overflow-visible">
            
            {/* GEOMETRIC SHAPES DROPDOWN (17 Shapes & Basic Concepts) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShapesDropdownOpen(!shapesDropdownOpen);
                  setSymbolsDropdownOpen(false);
                  setImageDropdownOpen(false);
                  setBgDropdownOpen(false);
                  playSound('click');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  shapesDropdownOpen
                    ? 'bg-teal-500 text-slate-950 shadow-md ring-2 ring-teal-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40'
                }`}
                title="Geometrik Şekil Ekle (Nokta, Doğru, Işın, Üçgenler, Daire, Çokgenler vb.)"
              >
                <Shapes className="w-4 h-4 text-teal-300" />
                <span>Geometrik Şekiller</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>

              {/* 17 Shapes Categorized Grid Popover */}
              {shapesDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[110]"
                    onClick={() => setShapesDropdownOpen(false)}
                  />
                  <div className="absolute top-full right-0 sm:left-auto sm:right-0 mt-2 z-[120] w-80 sm:w-96 bg-slate-900 border-2 border-teal-400/80 rounded-2xl p-3.5 shadow-2xl animate-in zoom-in-95 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-black text-teal-300">
                      <span className="flex items-center gap-1.5">
                        <Shapes className="w-4 h-4 text-teal-400" />
                        <span>Geometrik Şekiller & Temel Kavramlar</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShapesDropdownOpen(false)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {['Temel Kavramlar', 'Üçgenler', 'Dörtgenler', 'Çokgenler', 'Dairesel', '3 Boyutlu Cisimler'].map((cat) => {
                        const items = GEOMETRIC_SHAPES_DATA.filter((s) => s.category === cat);
                        if (!items.length) return null;

                        return (
                          <div key={cat} className="space-y-1.5">
                            <div className="text-[10px] font-black uppercase text-amber-300/90 tracking-wider flex items-center gap-1">
                              <span>•</span>
                              <span>{cat}</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                              {items.map((shapeItem) => (
                                <button
                                  key={shapeItem.type}
                                  type="button"
                                  onClick={() => handleInsertShape(shapeItem)}
                                  className="p-2 rounded-xl bg-slate-800/90 hover:bg-teal-500/20 hover:border-teal-400 border border-slate-700/80 flex flex-col items-center justify-center gap-1 text-center transition-all group cursor-pointer"
                                >
                                  <div className="p-1 rounded-lg bg-slate-900/80 group-hover:scale-110 transition-transform">
                                    {shapeItem.previewSvg}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-200 group-hover:text-teal-300 leading-tight">
                                    {shapeItem.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-[9.5px] text-slate-400 pt-1.5 border-t border-slate-800 text-center">
                      💡 Şekilleri köşelerinden büyütüp küçültebilir, tepe tutamacından 🔄 döndürebilir ve kilitleyebilirsiniz.
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* AÇILIR MATEMATİK & GEOMETRİ SEMBOLLERİ PALETİ */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setSymbolsDropdownOpen(!symbolsDropdownOpen);
                  setShapesDropdownOpen(false);
                  setImageDropdownOpen(false);
                  setBgDropdownOpen(false);
                  playSound('click');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  symbolsDropdownOpen
                    ? 'bg-teal-500 text-slate-950 font-black ring-2 ring-teal-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700'
                }`}
                title="Açı, Paralel Doğru, Denklem ve Matematik Sembolleri"
              >
                <span className="font-mono text-sm">°//π</span>
                <span>Semboller</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>

              {symbolsDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[110]"
                    onClick={() => setSymbolsDropdownOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 z-[120] w-80 bg-slate-900 border-2 border-teal-400/80 rounded-2xl p-3.5 shadow-2xl animate-in zoom-in-95 space-y-3">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-xs font-black text-teal-300">
                      <span>Matematik & Geometri Sembolleri</span>
                      <button
                        type="button"
                        onClick={() => setSymbolsDropdownOpen(false)}
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                      {CATEGORIZED_MATH_SYMBOLS.map((cat) => (
                        <button
                          key={cat.category}
                          type="button"
                          onClick={() => setActiveSymbolCategory(cat.category)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                            activeSymbolCategory === cat.category
                              ? 'bg-teal-500 text-slate-950 shadow-sm'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                          }`}
                        >
                          {cat.category}
                        </button>
                      ))}
                    </div>

                    {/* Active Category Symbol Grid */}
                    <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {(CATEGORIZED_MATH_SYMBOLS.find((c) => c.category === activeSymbolCategory)?.symbols || []).map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            insertMathSymbol(sym);
                            playSound('click');
                          }}
                          className="h-9 rounded-xl bg-slate-800 hover:bg-teal-500/20 hover:border-teal-400 border border-slate-700 text-sm font-bold text-white flex items-center justify-center font-mono cursor-pointer transition-all hover:scale-110 active:scale-95"
                          title={`Metne / Başlığa Ekle: ${sym}`}
                        >
                          {sym}
                        </button>
                      ))}
                    </div>

                    <div className="text-[9.5px] text-slate-400 pt-1.5 border-t border-slate-800 text-center">
                      💡 Tıkladığınız sembol, yazı alanında imlecin olduğu yere eklenir.
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* AÇILIR GÖRSEL & MEDYA BUTONU */}
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLocalImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => {
                  setImageDropdownOpen(!imageDropdownOpen);
                  setShapesDropdownOpen(false);
                  setSymbolsDropdownOpen(false);
                  setBgDropdownOpen(false);
                  playSound('click');
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  imageDropdownOpen
                    ? 'bg-slate-700 text-white ring-2 ring-teal-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
                title="Görsel Yükle veya İnternetten Ara"
              >
                <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                <span>Görsel</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {imageDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[110]"
                    onClick={() => setImageDropdownOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 z-[120] w-56 bg-slate-900 border border-slate-700 rounded-2xl p-2.5 shadow-2xl animate-in zoom-in-95 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setImageDropdownOpen(false);
                        fileInputRef.current?.click();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-teal-400" />
                      <span>Cihazdan Yükle</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageDropdownOpen(false);
                        setWebImageModalOpen(true);
                        playSound('click');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                    >
                      <Globe className="w-4 h-4 text-sky-400" />
                      <span>İnternetten Görsel Ara</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* AÇILIR ARKA PLAN SEÇİCİ */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setBgDropdownOpen(!bgDropdownOpen);
                  setShapesDropdownOpen(false);
                  setSymbolsDropdownOpen(false);
                  setImageDropdownOpen(false);
                  playSound('click');
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  bgDropdownOpen
                    ? 'bg-slate-700 text-white ring-2 ring-teal-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
                title="Sayfa Arka Plan Düzeni (Kareli, Çizgili, Düz)"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {activePage.backgroundType === 'grid'
                    ? 'Kareli'
                    : activePage.backgroundType === 'lined'
                    ? 'Çizgili'
                    : 'Düz Beyaz'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {bgDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[110]"
                    onClick={() => setBgDropdownOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 z-[120] w-48 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl animate-in zoom-in-95 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        handleChangeBackground('grid');
                        setBgDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        activePage.backgroundType === 'grid'
                          ? 'bg-teal-500/20 text-teal-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>📐 Kareli Defter</span>
                      {activePage.backgroundType === 'grid' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleChangeBackground('lined');
                        setBgDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        activePage.backgroundType === 'lined'
                          ? 'bg-teal-500/20 text-teal-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>📝 Çizgili Defter</span>
                      {activePage.backgroundType === 'lined' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleChangeBackground('blank');
                        setBgDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        activePage.backgroundType === 'blank'
                          ? 'bg-teal-500/20 text-teal-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>⬜ Düz Beyaz Sayfa</span>
                      {activePage.backgroundType === 'blank' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Save Toast Notification */}
      {saveSuccessToast && (
        <div className="fixed top-24 right-8 z-[100] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage || `Ders notu başarıyla "${selectedClass}" sınıf arşivine kaydedildi!`}</span>
        </div>
      )}

      {/* 2. MAIN SCROLLABLE WORKSPACE WITH MULTI-PAGE A4 SHEETS */}
      <div
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (!target.closest('.group\\/obj') && !target.closest('.z-50')) {
            setSelectedObjectId(null);
          }
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
                onClick={(e) => {
                  setActivePageIndex(pIdx);
                  const target = e.target as HTMLElement;
                  if (!target.closest('.group\\/obj') && !target.closest('.z-50')) {
                    setSelectedObjectId(null);
                  }
                }}
                className={`relative w-[794px] min-h-[1123px] rounded-2xl shadow-2xl overflow-hidden transition-all ${
                  isCurrentActive ? 'ring-4 ring-teal-500/80' : 'ring-1 ring-slate-700'
                }`}
                style={{
                  ...getBackgroundStyle(page.backgroundType),
                  boxSizing: 'border-box'
                }}
              >
                
                {/* Compact Minimalist Maarif Header on Page 1 (Can be toggled via Üstbilgi checkbox) */}
                {pIdx === 0 && showHeader && (
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

                    <div className="text-right flex flex-col items-end justify-center">
                      <div className="text-[9px] text-slate-400 font-bold leading-tight">
                        {currentUser?.name || 'Ahmet Yılmaz'}
                      </div>
                      <div className="text-[9px] text-slate-400 font-bold flex items-center gap-1.5 leading-tight">
                        <span>{selectedClass} Şubesi</span>
                        <span>•</span>
                        <span>{new Date().toLocaleDateString('tr-TR')}</span>
                      </div>
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

                {/* 17 GEOMETRIC SHAPES WITH 8-HANDLE SCALING, ROTATION, ANGLE ARMS & LOCK FEATURE */}
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
                        rotation={shape.rotation || 0}
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

                        {/* Interactive Arm Handle for Angle Shape */}
                        {shape.type === 'angle' && isSelected && !shape.isLocked && (
                          <AngleArmControlHandle
                            shape={shape}
                            onAngleChange={(deg) => {
                              updateShapeTransform(shape.id, { angleDegrees: deg });
                            }}
                          />
                        )}

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
                                {/* Quick Rotation Buttons */}
                                <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextRot = ((shape.rotation || 0) + 90) % 360;
                                      updateShapeTransform(shape.id, { rotation: nextRot });
                                    }}
                                    className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 text-[10px] font-bold flex items-center gap-1"
                                    title="90° Sağa Döndür"
                                  >
                                    <RotateCw className="w-3 h-3" />
                                    <span>90°</span>
                                  </button>
                                  {shape.rotation ? (
                                    <button
                                      type="button"
                                      onClick={() => updateShapeTransform(shape.id, { rotation: 0 })}
                                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                                      title="Döndürmeyi Sıfırla (0°)"
                                    >
                                      0°
                                    </button>
                                  ) : null}
                                </div>

                                {/* Special Angle Controls if shape is 'angle' */}
                                {shape.type === 'angle' && (
                                  <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
                                    <span className="font-mono text-amber-300 font-black text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-amber-500/40">
                                      ∠ {Math.round(shape.angleDegrees ?? 60)}°
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const cur = shape.angleDegrees ?? 60;
                                        const next = Math.max(5, cur - 5);
                                        updateShapeTransform(shape.id, { angleDegrees: next });
                                      }}
                                      className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                                      title="Açıyı 5° Azalt"
                                    >
                                      -5°
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const cur = shape.angleDegrees ?? 60;
                                        const next = Math.min(355, cur + 5);
                                        updateShapeTransform(shape.id, { angleDegrees: next });
                                      }}
                                      className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                                      title="Açıyı 5° Artır"
                                    >
                                      +5°
                                    </button>
                                    <select
                                      value={shape.angleDegrees ?? 60}
                                      onChange={(e) => updateShapeTransform(shape.id, { angleDegrees: Number(e.target.value) })}
                                      className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-amber-300 outline-none"
                                      title="Örnek Açı Seç"
                                    >
                                      {[30, 45, 60, 90, 120, 135, 150, 180, 270].map((deg) => (
                                        <option key={deg} value={deg}>
                                          {deg}°
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}

                                {/* Special Point Label if shape is 'point' */}
                                {shape.type === 'point' && (
                                  <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
                                    <span className="text-[10px] text-slate-400">Nokta:</span>
                                    {['A', 'B', 'C', 'P', 'O', 'M'].map((pt) => (
                                      <button
                                        key={pt}
                                        type="button"
                                        onClick={() => updateShapeTransform(shape.id, { pointName: pt, label: `Nokta (${pt})` })}
                                        className={`w-4 h-4 rounded text-[9px] font-bold ${
                                          (shape.pointName || 'A') === pt
                                            ? 'bg-teal-500 text-slate-950 font-black'
                                            : 'bg-slate-800 text-slate-300 hover:text-white'
                                        }`}
                                      >
                                        {pt}
                                      </button>
                                    ))}
                                  </div>
                                )}

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

                                {/* Fill Color Picker (only for 2D closed shapes) */}
                                {!['point', 'line', 'segment', 'ray', 'angle'].includes(shape.type) && (
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
                                )}

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

                                {/* Dashed toggle (only for lines / shapes) */}
                                {shape.type !== 'point' && (
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
                                )}

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

                {/* EMBEDDED IMAGES WITH 8-HANDLE SCALING, ROTATION & LOCK FEATURE */}
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
                        rotation={img.rotation || 0}
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
                              <>
                                {/* Quick Rotation Buttons */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextRot = ((img.rotation || 0) + 90) % 360;
                                    updateImageTransform(img.id, { rotation: nextRot });
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 text-[10px] font-bold flex items-center gap-1"
                                  title="90° Sağa Döndür"
                                >
                                  <RotateCw className="w-3 h-3" />
                                  <span>90°</span>
                                </button>
                                {img.rotation ? (
                                  <button
                                    type="button"
                                    onClick={() => updateImageTransform(img.id, { rotation: 0 })}
                                    className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                                    title="Döndürmeyi Sıfırla (0°)"
                                  >
                                    0°
                                  </button>
                                ) : null}

                                <button
                                  type="button"
                                  onClick={() => handleDeleteImage(img.id)}
                                  className="p-1 rounded bg-rose-900/80 hover:bg-rose-700 text-rose-200"
                                  title="Resmi Sil"
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
                  <span>Maarif Dijital Defteri • www.maarifakademi.com.tr</span>
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
          if (Array.isArray(file.pages) && file.pages.length > 0) {
            setPages(file.pages);
          }
          if (file.title) setDocumentTitle(file.title);
          if (file.classSection) setSelectedClass(file.classSection);
          setLoadedFileId(file.id);
          setActivePageIndex(0);
          playSound('select');
        }}
      />

    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// DYNAMIC ANGLE ARM CONTROL HANDLE (Açı Kollarını Açma / Kapatma Tutamacı)
// ---------------------------------------------------------------------------
interface AngleArmControlHandleProps {
  shape: WhiteboardShapeItem;
  onAngleChange: (deg: number) => void;
}

function AngleArmControlHandle({ shape, onAngleChange }: AngleArmControlHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentDeg, setCurrentDeg] = useState<number>(shape.angleDegrees ?? 60);

  useEffect(() => {
    setCurrentDeg(shape.angleDegrees ?? 60);
  }, [shape.angleDegrees]);

  const deg = currentDeg;
  const rad = (deg * Math.PI) / 180;
  const sw = shape.strokeWidth || 3;
  const vX = Math.max(25, sw * 2 + 15);
  const vY = shape.height - Math.max(25, sw * 2 + 15);
  const armLen = Math.min(shape.width - vX - 25, vY - 25);

  const armTipX = vX + armLen * Math.cos(rad);
  const armTipY = vY - armLen * Math.sin(rad);

  const startArmDrag = (clientX: number, clientY: number, targetEl: HTMLElement) => {
    setIsDragging(true);
    const parent = targetEl.closest('.group\\/obj') as HTMLElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const vertexClientX = parentRect.left + vX;
    const vertexClientY = parentRect.top + vY;

    const calculateAngle = (curX: number, curY: number, shift: boolean) => {
      const deltaX = curX - vertexClientX;
      const deltaY = vertexClientY - curY; // Inverted Y for Cartesian angle

      let calculatedDeg = Math.round(Math.atan2(deltaY, deltaX) * (180 / Math.PI));
      if (calculatedDeg < 0) {
        calculatedDeg += 360;
      }
      if (shift) {
        calculatedDeg = Math.round(calculatedDeg / 15) * 15;
      }
      const bounded = Math.max(5, Math.min(355, calculatedDeg));
      setCurrentDeg(bounded);
      onAngleChange(bounded);
    };

    const handleMouseMove = (moveEvt: MouseEvent) => {
      moveEvt.preventDefault();
      calculateAngle(moveEvt.clientX, moveEvt.clientY, moveEvt.shiftKey);
    };

    const handleTouchMove = (touchEvt: TouchEvent) => {
      if (touchEvt.touches.length > 0) {
        touchEvt.preventDefault();
        calculateAngle(touchEvt.touches[0].clientX, touchEvt.touches[0].clientY, false);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    startArmDrag(e.clientX, e.clientY, e.currentTarget as HTMLElement);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length > 0) {
      startArmDrag(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget as HTMLElement);
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: 'absolute',
        left: `${armTipX}px`,
        top: `${armTipY}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 40,
        cursor: 'grab'
      }}
      className="group/arm flex items-center justify-center touch-none select-none"
      title="Açı Kolunu Tut ve Çevir (Kolları Aç / Kapat)"
    >
      <div
        className={`w-7 h-7 rounded-full bg-amber-400 border-2 border-slate-950 shadow-2xl flex items-center justify-center transition-all ${
          isDragging ? 'scale-125 ring-4 ring-amber-400/50 bg-amber-300' : 'hover:scale-125 active:scale-125'
        }`}
      >
        <span className="text-xs select-none pointer-events-none font-bold">📐</span>
      </div>

      {isDragging && (
        <div className="absolute -top-8 px-2 py-0.5 bg-slate-900 text-amber-300 text-[11px] font-black rounded-md shadow-2xl border border-amber-400 whitespace-nowrap pointer-events-none">
          {Math.round(currentDeg)}°
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 8-HANDLE TRANSFORMABLE OBJECT WRAPPER (Word "Kare" Serbest Ölçeklendirme, Döndürme & Çift Tık Düzenleme)
// ---------------------------------------------------------------------------
interface TransformableObjectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  isSelected: boolean;
  isLocked?: boolean;
  onSelect: () => void;
  onChangeTransform: (updates: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    rotation?: number;
  }) => void;
  children: React.ReactNode;
}

type HandleDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

function TransformableObjectWrapper({
  x,
  y,
  width,
  height,
  rotation = 0,
  isSelected,
  isLocked = false,
  onSelect,
  onChangeTransform,
  children
}: TransformableObjectProps) {
  const isDragging = useRef(false);
  const resizeHandle = useRef<HandleDirection | null>(null);
  const isRotating = useRef(false);
  const [liveRotation, setLiveRotation] = useState<number | null>(null);
  const startPos = useRef({ clientX: 0, clientY: 0, x, y, width, height, rotation });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchTime = useRef<number>(0);

  // Double click handler to select / unlock for editing
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  // Drag start from body (only when isSelected)
  const handleMouseDownBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSelected || isLocked) return;

    isDragging.current = true;
    startPos.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      x,
      y,
      width,
      height,
      rotation
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

  // Touch start from body (handles double-tap to select and drag when selected)
  const handleTouchStartBody = (e: React.TouchEvent) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastTouchTime.current < 350) {
      // Double tap detected
      onSelect();
      lastTouchTime.current = 0;
      return;
    }
    lastTouchTime.current = now;

    if (!isSelected || isLocked || e.touches.length === 0) return;

    isDragging.current = true;
    const touch = e.touches[0];
    startPos.current = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      x,
      y,
      width,
      height,
      rotation
    };

    const handleTouchMove = (moveEvt: TouchEvent) => {
      if (!isDragging.current || isLocked || moveEvt.touches.length === 0) return;
      moveEvt.preventDefault();
      const curTouch = moveEvt.touches[0];
      const deltaX = curTouch.clientX - startPos.current.clientX;
      const deltaY = curTouch.clientY - startPos.current.clientY;

      onChangeTransform({
        x: Math.max(0, Math.min(794 - width, startPos.current.x + deltaX)),
        y: Math.max(0, Math.min(1123 - height, startPos.current.y + deltaY))
      });
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
  };

  // Continuous Free Rotation Handle Drag (Mouse & Touch)
  const startRotateDrag = (clientX: number, clientY: number) => {
    if (isLocked) return;
    isRotating.current = true;
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const processAngle = (curX: number, curY: number) => {
      const deltaX = curX - centerX;
      const deltaY = curY - centerY;

      // Handle is positioned at the bottom, so atan2 - 90° gives 0° when pointing straight down
      let deg = Math.atan2(deltaY, deltaX) * (180 / Math.PI) - 90;
      deg = ((deg % 360) + 360) % 360;

      const finalDeg = Math.round(deg) % 360;
      setLiveRotation(finalDeg);
      onChangeTransform({ rotation: finalDeg });
    };

    const handleMouseMove = (moveEvt: MouseEvent) => {
      if (!isRotating.current) return;
      moveEvt.preventDefault();
      processAngle(moveEvt.clientX, moveEvt.clientY);
    };

    const handleTouchMove = (touchEvt: TouchEvent) => {
      if (!isRotating.current || touchEvt.touches.length === 0) return;
      touchEvt.preventDefault();
      processAngle(touchEvt.touches[0].clientX, touchEvt.touches[0].clientY);
    };

    const handleEnd = () => {
      isRotating.current = false;
      setLiveRotation(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);
  };

  const handleMouseDownRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    startRotateDrag(e.clientX, e.clientY);
  };

  const handleTouchStartRotate = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length > 0) {
      startRotateDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Resize start from any of the 8 handles (Mouse & Touch)
  const startResizeDrag = (clientX: number, clientY: number, handle: HandleDirection) => {
    if (isLocked) return;
    resizeHandle.current = handle;
    startPos.current = {
      clientX,
      clientY,
      x,
      y,
      width,
      height,
      rotation
    };

    const processResize = (curX: number, curY: number) => {
      if (!resizeHandle.current || isLocked) return;
      const deltaX = curX - startPos.current.clientX;
      const deltaY = curY - startPos.current.clientY;
      const dir = resizeHandle.current;

      let newX = startPos.current.x;
      let newY = startPos.current.y;
      let newW = startPos.current.width;
      let newH = startPos.current.height;

      const MIN_SIZE = 25;

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

    const handleMouseMove = (moveEvt: MouseEvent) => {
      processResize(moveEvt.clientX, moveEvt.clientY);
    };

    const handleTouchMove = (touchEvt: TouchEvent) => {
      if (touchEvt.touches.length > 0) {
        touchEvt.preventDefault();
        processResize(touchEvt.touches[0].clientX, touchEvt.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      resizeHandle.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);
  };

  const handleMouseDownResize = (e: React.MouseEvent, handle: HandleDirection) => {
    e.stopPropagation();
    e.preventDefault();
    startResizeDrag(e.clientX, e.clientY, handle);
  };

  const handleTouchStartResize = (e: React.TouchEvent, handle: HandleDirection) => {
    e.stopPropagation();
    if (e.touches.length > 0) {
      startResizeDrag(e.touches[0].clientX, e.touches[0].clientY, handle);
    }
  };

  const currentRotation = liveRotation !== null ? liveRotation : (rotation || 0);

  return (
    <div
      ref={containerRef}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDownBody}
      onTouchStart={handleTouchStartBody}
      className={`absolute z-20 group/obj transition-shadow ${
        isSelected
          ? 'ring-2 ring-teal-500 ring-offset-2'
          : 'ring-0'
      }`}
      style={{
        top: `${y}px`,
        left: `${x}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: currentRotation ? `rotate(${currentRotation}deg)` : undefined,
        transformOrigin: 'center center',
        cursor: isSelected ? (isLocked ? 'default' : 'move') : 'default'
      }}
    >
      {children}

      {/* ROTATION HANDLE (Çember şeklindeki ok tutamacı - Altta Konumlandırılmış) */}
      {isSelected && !isLocked && (
        <div className="absolute -bottom-11 left-1/2 -translate-x-1/2 flex flex-col items-center z-40 pointer-events-auto touch-none select-none">
          <div className="w-0.5 h-3.5 bg-teal-400/80" />
          <div
            onMouseDown={handleMouseDownRotate}
            onTouchStart={handleTouchStartRotate}
            className="w-7 h-7 rounded-full bg-slate-900 text-teal-300 border-2 border-teal-400 shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-125 active:scale-125 transition-transform"
            title="Döndür (Serbest Açılı Döndürme)"
          >
            <RotateCw className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>

          {liveRotation !== null && (
            <div className="absolute -bottom-7 px-2 py-0.5 bg-slate-900 text-teal-300 text-[10px] font-black rounded-md shadow-2xl border border-teal-400 whitespace-nowrap pointer-events-none">
              {liveRotation}°
            </div>
          )}
        </div>
      )}

      {/* 8 RESIZE HANDLES (Corners + Midpoints) - Only active when Selected & NOT locked */}
      {isSelected && !isLocked && (
        <>
          {/* Top-Left (NW) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'nw')}
            onTouchStart={(e) => handleTouchStartResize(e, 'nw')}
            className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-nwse-resize z-30 hover:scale-125 transition-transform touch-none"
            title="Köşeden Ölçekle"
          />

          {/* Top-Middle (N) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'n')}
            onTouchStart={(e) => handleTouchStartResize(e, 'n')}
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-ns-resize z-30 hover:scale-125 transition-transform touch-none"
            title="Dikey Boyutlandır"
          />

          {/* Top-Right (NE) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'ne')}
            onTouchStart={(e) => handleTouchStartResize(e, 'ne')}
            className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-nesw-resize z-30 hover:scale-125 transition-transform touch-none"
            title="Köşeden Ölçekle"
          />

          {/* Middle-Right (E) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'e')}
            onTouchStart={(e) => handleTouchStartResize(e, 'e')}
            className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-ew-resize z-30 hover:scale-125 transition-transform touch-none"
            title="Yatay Boyutlandır"
          />

          {/* Bottom-Right (SE) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'se')}
            onTouchStart={(e) => handleTouchStartResize(e, 'se')}
            className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-nwse-resize z-30 hover:scale-125 transition-transform touch-none"
            title="Köşeden Ölçekle"
          />

          {/* Bottom-Middle (S) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 's')}
            onTouchStart={(e) => handleTouchStartResize(e, 's')}
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-ns-resize z-30 hover:scale-125 transition-transform touch-none"
            title="Dikey Boyutlandır"
          />

          {/* Bottom-Left (SW) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'sw')}
            onTouchStart={(e) => handleTouchStartResize(e, 'sw')}
            className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-nesw-resize z-30 hover:scale-125 transition-transform touch-none"
            title="Köşeden Ölçekle"
          />

          {/* Middle-Left (W) */}
          <div
            onMouseDown={(e) => handleMouseDownResize(e, 'w')}
            onTouchStart={(e) => handleTouchStartResize(e, 'w')}
            className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-teal-600 rounded-sm shadow-sm cursor-ew-resize z-30 hover:scale-125 transition-transform touch-none"
            title="Yatay Boyutlandır"
          />
        </>
      )}
    </div>
  );
}
