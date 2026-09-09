'use client';

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

export function getFilesByClass(classSection: string): ClassroomFileRecord[] {
  const all = getStoredClassroomFiles();
  return all.filter((f) => f.classSection === classSection || f.classSection === 'Tümü');
}

export function getFilesByOutcome(outcomeCode: string): ClassroomFileRecord[] {
  const all = getStoredClassroomFiles();
  return all.filter((f) => f.outcomeCode === outcomeCode);
}
