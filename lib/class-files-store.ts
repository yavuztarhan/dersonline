'use client';

export type GeometricShapeType =
  | 'square' // Kare
  | 'triangle' // Genel Üçgen
  | 'right_triangle' // Dik Üçgen
  | 'equilateral_triangle' // Eşkenar Üçgen
  | 'circle' // Çember (Boş)
  | 'disc' // Daire (Dolu)
  | 'ellipse' // Elips
  | 'pentagon' // Beşgen
  | 'hexagon' // Altıgen
  | 'parallelogram' // Paralelkenar
  | 'trapezoid' // Yamuk
  | 'rhombus'; // Eşkenar Dörtgen

export interface WhiteboardShapeItem {
  id: string;
  type: GeometricShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  isDashed?: boolean;
  label?: string;
}

export interface WhiteboardImageItem {
  id: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export interface WhiteboardPageData {
  id: string;
  pageNumber: number;
  backgroundType: 'blank' | 'grid' | 'lined' | 'dotted' | 'dark';
  drawingDataUrl?: string; // Stored canvas image data
  textContent?: string; // HTML content from rich text editor
  images?: WhiteboardImageItem[];
  shapes?: WhiteboardShapeItem[];
}

export interface ClassroomFileRecord {
  id: string;
  title: string;
  classSection: string; // '5-A', '5-B', '5-C', 'Tümü'
  outcomeCode: string; // 'MAT.5.3.4', 'MAT.5.3.3', 'MAT.5.3.2', 'MAT.5.3.1'
  outcomeTitle: string;
  authorName: string;
  authorRole: 'teacher' | 'student';
  school?: string;
  pageCount: number;
  pages: WhiteboardPageData[];
  thumbnailUrl?: string;
  createdAt: string;
  fileSizeKb?: number;
  tags: string[];
}

const STORAGE_KEY = 'maarif_classroom_files_v1';

// Seed Classroom Files for instant demo & rich student/teacher experience
const INITIAL_FILES: ClassroomFileRecord[] = [
  {
    id: 'file-001',
    title: '5-A Doğruların Durumları ve Açı İspat Notları',
    classSection: '5-A',
    outcomeCode: 'MAT.5.3.4',
    outcomeTitle: 'Düzlemde İki veya Üç Doğrunun Durumuna Bağlı Olarak Oluşabilecek Açılara Dair Çıkarım Yapabilme',
    authorName: 'Ahmet Yılmaz',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 2,
    createdAt: '2026-09-08T14:30:00Z',
    fileSizeKb: 142,
    tags: ['Ters Açılar', 'Komşu Bütünler', 'Paralel Kesen', 'Tahta Çizimleri'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: '<h2 style="color: #0f766e; font-weight: 800;">📐 DÜZLEMDE KESİŞEN DOĞRULAR & TERS AÇILAR</h2><p><strong>Kural 1:</strong> Kesişen iki doğrudan oluşan karşılıklı açılara <em>ters açılar</em> denir. <u>Ters açıların ölçüleri birbirine daima eşittir.</u></p><p><strong>Örnek:</strong> <code>a = c = 120°</code> ve <code>b = d = 60°</code></p><p><strong>Komşu Bütünler:</strong> Bir doğru üzerindeki komşu iki açının toplamı <code>180°</code> dir (<code>a + b = 180°</code>).</p>',
        images: []
      },
      {
        id: 'p2',
        pageNumber: 2,
        backgroundType: 'blank',
        textContent: '<h3 style="color: #1e3a8a; font-weight: 800;">🧩 3 DOĞRUNUN BİRBİRİNE GÖRE DURUMLARI</h3><ul><li><strong>1. Durum:</strong> Üç doğru tek bir noktada kesişebilir (Noktadaş doğrular - 6 açı).</li><li><strong>2. Durum:</strong> İki doğru paralel, üçüncü doğru onları kesebilir (Yöndeş, iç ters, dış ters açılar).</li><li><strong>3. Durum:</strong> Üç doğru ikişer ikişer kesişerek bir <strong>üçgen</strong> oluşturur.</li></ul>',
        images: []
      }
    ]
  },
  {
    id: 'file-002',
    title: '5-A Açıölçer (İletki) Kullanımı & Radar İpuçları',
    classSection: '5-A',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    authorName: 'Ahmet Yılmaz',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 1,
    createdAt: '2026-09-07T11:20:00Z',
    fileSizeKb: 98,
    tags: ['İletki', 'Açı Çeşitleri', 'Radar Simülasyonu'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: '<h2 style="color: #0f766e;">🎯 İLETKİ İLE AÇI ÖLÇME REHBERİ</h2><p>1. İletkinin merkez noktasını açının köşesine tam oturtunuz.<br>2. Taban kolunu 0° çizgisine hizalayınız.<br>3. Açının baktığı yöne göre iç veya dış cetveli doğru seçiniz!</p><p><strong>Önemli Maarif İlkesi:</strong> Açının kollarının uzunluğu açının ölçüsünü <u>asla değiştirmez!</u></p>',
        images: []
      }
    ]
  },
  {
    id: 'file-003',
    title: '5-B Geometrik İnşa: Cetvel, Pergel ve Gönye Çizimleri',
    classSection: '5-B',
    outcomeCode: 'MAT.5.3.2',
    outcomeTitle: 'Geometrik İnşa ve Çıkarım: Cetvel, Pergel, Gönye',
    authorName: 'Ahmet Yılmaz',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 1,
    createdAt: '2026-09-05T10:15:00Z',
    fileSizeKb: 115,
    tags: ['Pergel', 'Gönye', 'Paralel Ray', 'Tek Dikme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'lined',
        textContent: '<h2 style="color: #4338ca;">📏 TEMEL GEOMETRİK İNŞA İLKELERİ</h2><p>• İki farklı noktadan yalnız ve yalnız <strong>tek bir doğru</strong> geçer.<br>• Pergel ile bir çember çizildiğinde merkezden çembere olan tüm mesafeler (yarıçap) eşittir.<br>• Bir doğruya dışındaki bir noktadan sadece <strong>1 adet dikme</strong> indirilebilir.</p>',
        images: []
      }
    ]
  }
];

export function getStoredClassroomFiles(): ClassroomFileRecord[] {
  if (typeof window === 'undefined') return INITIAL_FILES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FILES));
      return INITIAL_FILES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_FILES;
  }
}

export function saveClassroomFile(
  fileData: Omit<ClassroomFileRecord, 'id' | 'createdAt'>
): ClassroomFileRecord {
  const current = getStoredClassroomFiles();
  const newRecord: ClassroomFileRecord = {
    ...fileData,
    id: `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString()
  };

  const updated = [newRecord, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return newRecord;
}

export function deleteClassroomFile(fileId: string): void {
  const current = getStoredClassroomFiles();
  const updated = current.filter((f) => f.id !== fileId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
}

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function renderShapeSvgString(shape: WhiteboardShapeItem): string {
  const { width: W, height: H, strokeColor, strokeWidth: sw, fillColor, isDashed, type } = shape;
  const dashAttr = isDashed ? `stroke-dasharray="${sw * 2},${sw * 2}"` : '';
  const fill = fillColor || 'transparent';
  const stroke = strokeColor || '#0f172a';

  let innerSvg = '';

  switch (type) {
    case 'square':
      innerSvg = `<rect x="${sw / 2}" y="${sw / 2}" width="${Math.max(1, W - sw)}" height="${Math.max(1, H - sw)}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${dashAttr} />`;
      break;

    case 'triangle':
      innerSvg = `<polygon points="${W / 2},${sw / 2} ${W - sw / 2},${H - sw / 2} ${sw / 2},${H - sw / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${dashAttr} />`;
      break;

    case 'right_triangle': {
      const sqSize = Math.min(22, Math.min(W, H) * 0.22);
      innerSvg = `
        <polygon points="${sw / 2},${sw / 2} ${W - sw / 2},${H - sw / 2} ${sw / 2},${H - sw / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${dashAttr} />
        <path d="M ${sw / 2} ${H - sw / 2 - sqSize} L ${sw / 2 + sqSize} ${H - sw / 2 - sqSize} L ${sw / 2 + sqSize} ${H - sw / 2}" fill="none" stroke="${stroke}" stroke-width="${Math.max(1.5, sw * 0.75)}" />
        <circle cx="${sw / 2 + sqSize / 2}" cy="${H - sw / 2 - sqSize / 2}" r="${Math.max(1.5, sw * 0.5)}" fill="${stroke}" />
      `;
      break;
    }

    case 'equilateral_triangle':
      innerSvg = `<polygon points="${W / 2},${sw / 2} ${W - sw / 2},${H - sw / 2} ${sw / 2},${H - sw / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${dashAttr} />`;
      break;

    case 'circle':
      innerSvg = `<ellipse cx="${W / 2}" cy="${H / 2}" rx="${Math.max(1, W / 2 - sw / 2)}" ry="${Math.max(1, H / 2 - sw / 2)}" fill="none" stroke="${stroke}" stroke-width="${sw}" ${dashAttr} />`;
      break;

    case 'disc':
      innerSvg = `<ellipse cx="${W / 2}" cy="${H / 2}" rx="${Math.max(1, W / 2 - sw / 2)}" ry="${Math.max(1, H / 2 - sw / 2)}" fill="${fill === 'transparent' ? '#14b8a625' : fill}" stroke="${stroke}" stroke-width="${sw}" ${dashAttr} />`;
      break;

    case 'ellipse':
      innerSvg = `<ellipse cx="${W / 2}" cy="${H / 2}" rx="${Math.max(1, W / 2 - sw / 2)}" ry="${Math.max(1, H / 2 - sw / 2)}" fill="${fill === 'transparent' ? '#3b82f625' : fill}" stroke="${stroke}" stroke-width="${sw}" ${dashAttr} />`;
      break;

    case 'pentagon': {
      const pts: string[] = [];
      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        const x = W / 2 + (W / 2 - sw / 2) * Math.cos(angle);
        const y = H / 2 + (H / 2 - sw / 2) * Math.sin(angle);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      innerSvg = `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${dashAttr} />`;
      break;
    }

    case 'hexagon': {
      const pts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
        const x = W / 2 + (W / 2 - sw / 2) * Math.cos(angle);
        const y = H / 2 + (H / 2 - sw / 2) * Math.sin(angle);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      innerSvg = `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${dashAttr} />`;
      break;
    }

    case 'parallelogram': {
      const skew = W * 0.25;
      innerSvg = `<polygon points="${skew},${sw / 2} ${W - sw / 2},${sw / 2} ${W - skew},${H - sw / 2} ${sw / 2},${H - sw / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${dashAttr} />`;
      break;
    }

    case 'trapezoid': {
      const topInset = W * 0.2;
      innerSvg = `<polygon points="${topInset},${sw / 2} ${W - topInset},${sw / 2} ${W - sw / 2},${H - sw / 2} ${sw / 2},${H - sw / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${dashAttr} />`;
      break;
    }

    case 'rhombus':
      innerSvg = `<polygon points="${W / 2},${sw / 2} ${W - sw / 2},${H / 2} ${W / 2},${H - sw / 2} ${sw / 2},${H / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${dashAttr} />`;
      break;

    default:
      innerSvg = `<rect x="${sw / 2}" y="${sw / 2}" width="${W - sw}" height="${H - sw}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="display:block; overflow:visible;">${innerSvg}</svg>`;
}

export async function exportClassroomFileToPdf(
  file: ClassroomFileRecord,
  defaultSchool?: string
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < file.pages.length; i++) {
    const page = file.pages[i];

    const pageContainer = document.createElement('div');
    pageContainer.style.width = '794px';
    pageContainer.style.minHeight = '1123px';
    pageContainer.style.padding = '40px';
    pageContainer.style.backgroundColor = page.backgroundType === 'dark' ? '#0f172a' : '#ffffff';
    pageContainer.style.color = page.backgroundType === 'dark' ? '#f8fafc' : '#0f172a';
    pageContainer.style.fontFamily = 'Inter, sans-serif';
    pageContainer.style.boxSizing = 'border-box';
    pageContainer.style.position = 'relative';

    pageContainer.innerHTML = `
      <div style="border-bottom: 2px solid #0d9488; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <div style="font-size: 10px; font-weight: 800; color: #0f766e; text-transform: uppercase;">
            ${file.school || defaultSchool || 'Edirne Selimiye İmam Hatip Ortaokulu'} • ${file.classSection} Şubesi
          </div>
          <div style="font-size: 14px; font-weight: 900; color: #0f172a; margin-top: 2px;">
            ${file.title}
          </div>
          <div style="font-size: 10px; color: #64748b; font-weight: 600;">
            Kazanım: ${file.outcomeCode} - ${file.outcomeTitle}
          </div>
        </div>
        <div style="text-align: right; font-size: 10px; font-weight: 700; color: #64748b;">
          Sayfa ${page.pageNumber} / ${file.pageCount}
        </div>
      </div>

      <div style="min-height: 850px; font-size: 13px; line-height: 1.6; position: relative; z-index: 1;">
        ${page.textContent || ''}
      </div>

      <div style="border-top: 1px solid #cbd5e1; padding-top: 10px; margin-top: 20px; display: flex; justify-content: space-between; font-size: 9.5px; color: #64748b;">
        <span>Hazırlayan: <strong>${file.authorName}</strong></span>
        <span>Tarih: ${new Date(file.createdAt).toLocaleDateString('tr-TR')}</span>
      </div>
    `;

    // Render Geometric Shapes
    if (page.shapes && page.shapes.length > 0) {
      page.shapes.forEach((shape) => {
        const shapeWrapper = document.createElement('div');
        shapeWrapper.style.position = 'absolute';
        shapeWrapper.style.left = `${shape.x}px`;
        shapeWrapper.style.top = `${shape.y}px`;
        shapeWrapper.style.width = `${shape.width}px`;
        shapeWrapper.style.height = `${shape.height}px`;
        shapeWrapper.style.zIndex = '5';
        shapeWrapper.innerHTML = renderShapeSvgString(shape);
        pageContainer.appendChild(shapeWrapper);
      });
    }

    // Render Floating Images
    if (page.images && page.images.length > 0) {
      page.images.forEach((img) => {
        const imgEl = document.createElement('img');
        imgEl.src = img.url;
        imgEl.style.position = 'absolute';
        imgEl.style.left = `${img.x}px`;
        imgEl.style.top = `${img.y}px`;
        imgEl.style.width = `${img.width}px`;
        imgEl.style.height = `${img.height}px`;
        imgEl.style.objectFit = 'contain';
        imgEl.style.zIndex = '10';
        pageContainer.appendChild(imgEl);
      });
    }

    // Render Canvas Drawing
    if (page.drawingDataUrl) {
      const drawingImg = document.createElement('img');
      drawingImg.src = page.drawingDataUrl;
      drawingImg.style.position = 'absolute';
      drawingImg.style.top = '0';
      drawingImg.style.left = '0';
      drawingImg.style.width = '100%';
      drawingImg.style.height = '100%';
      drawingImg.style.zIndex = '15';
      drawingImg.style.pointerEvents = 'none';
      pageContainer.appendChild(drawingImg);
    }

    document.body.appendChild(pageContainer);

    const canvas = await html2canvas(pageContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: page.backgroundType === 'dark' ? '#0f172a' : '#ffffff'
    });

    document.body.removeChild(pageContainer);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    if (i > 0) pdf.addPage('a4', 'portrait');
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  }

  const cleanTitle = file.title.trim().replace(/\s+/g, '_');
  pdf.save(`${file.classSection}_${file.outcomeCode}_${cleanTitle}.pdf`);
}

export function getFilesByClass(classSection: string): ClassroomFileRecord[] {
  const all = getStoredClassroomFiles();
  return all.filter((f) => f.classSection === classSection || f.classSection === 'Tümü');
}

export function getFilesByOutcome(outcomeCode: string): ClassroomFileRecord[] {
  const all = getStoredClassroomFiles();
  return all.filter((f) => f.outcomeCode === outcomeCode);
}
