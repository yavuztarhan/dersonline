'use client';

export type GeometricShapeType =
  | 'point' // Nokta
  | 'line' // Doğru
  | 'segment' // Doğru Parçası
  | 'ray' // Işın
  | 'angle' // Açı (Ayarlanabilir kollar)
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
  rotation?: number; // 0 - 360 in degrees
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  isDashed?: boolean;
  label?: string;
  isLocked?: boolean;
  // Angle specific properties:
  angleDegrees?: number; // e.g. 60° (5° to 355°)
  armLength?: number;
  pointName?: string;
}

export interface WhiteboardImageItem {
  id: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  isLocked?: boolean;
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
  updatedAt?: string;
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
  },
  {
    id: 'file-activity-mat-5-3-1',
    title: 'Etkinlik 1: Aşamalı İnşa İstasyonları (MAT.5.3.1)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.5.3.1',
    outcomeTitle: 'Temel Geometrik Çizimler ve Geometrik Araçların Kullanımı',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 1,
    createdAt: '2026-09-09T08:00:00Z',
    fileSizeKb: 180,
    tags: ['Etkinlik Kağıdı', 'Aşamalı İnşa', 'Cetvel', 'İletki', 'Pergel', 'Gönye', 'MAT.5.3.1', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif;">
  <div style="text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 8px; margin-bottom: 16px;">
    <h2 style="color: #0f766e; font-size: 18px; font-weight: 900; margin: 0; text-transform: uppercase;">
      📐 ETKİNLİK 1: AŞAMALI İNŞA İSTASYONLARI (MAT.5.3.1)
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 4px 0 0 0; font-weight: 600;">
      Aşağıdaki 4 ayrı istasyon alanında verilen yönergeleri uygun geometrik araçları (Cetvel, İletki, Pergel, Gönye) kullanarak tamamlayınız.
    </p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
    
    <!-- İSTASYON 1: CETVEL -->
    <div style="border: 2px solid #0d9488; border-radius: 12px; padding: 12px; background: #ffffff;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ccfbf1; padding-bottom: 6px; margin-bottom: 8px;">
        <span style="font-weight: 900; color: #0f766e; font-size: 12px;">📏 İSTASYON 1: CETVEL</span>
        <span style="font-size: 10px; font-weight: bold; background: #f0fdfa; color: #0d9488; padding: 2px 6px; border-radius: 4px; border: 1px solid #99f6e4;">Doğru Parçası & Işın</span>
      </div>
      <p style="font-size: 11px; color: #1e293b; line-height: 1.4; margin: 0 0 8px 0; font-weight: 600;">
        <strong>Yönerge:</strong> Cetvelini kullanarak <strong>6 cm</strong> uzunluğunda bir <code>[AB]</code> doğru parçası çiz. Ardından başlangıcı <code>C</code> olan bir <code>[CD</code> ışını inşa et.
      </p>
      <div style="border: 1.5px dashed #cbd5e1; border-radius: 8px; height: 160px; background: #f8fafc; position: relative; padding: 8px;">
        <div style="position: absolute; top: 16px; left: 16px; font-size: 11px; font-weight: 900; color: #0f766e;">• A</div>
        <div style="position: absolute; top: 16px; left: 160px; font-size: 10px; color: #94a3b8;">(6 cm → B noktası)</div>
        <div style="position: absolute; bottom: 28px; left: 16px; font-size: 11px; font-weight: 900; color: #0f766e;">• C</div>
        <div style="position: absolute; bottom: 28px; left: 180px; font-size: 10px; color: #94a3b8;">([CD Işını →)</div>
        <div style="position: absolute; bottom: 6px; right: 10px; font-size: 9px; color: #64748b; font-family: monospace;">Cetvel Kılavuzu: 0 ... 6 ... 10 cm</div>
      </div>
    </div>

    <!-- İSTASYON 2: İLETKİ -->
    <div style="border: 2px solid #3b82f6; border-radius: 12px; padding: 12px; background: #ffffff;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #dbeafe; padding-bottom: 6px; margin-bottom: 8px;">
        <span style="font-weight: 900; color: #1d4ed8; font-size: 12px;">🧭 İSTASYON 2: İLETKİ</span>
        <span style="font-size: 10px; font-weight: bold; background: #eff6ff; color: #2563eb; padding: 2px 6px; border-radius: 4px; border: 1px solid #bfdbfe;">60° Açı İnşası</span>
      </div>
      <p style="font-size: 11px; color: #1e293b; line-height: 1.4; margin: 0 0 8px 0; font-weight: 600;">
        <strong>Yönerge:</strong> Verilen yatay kolun başlangıç noktasına iletkini yerleştirerek <strong>60°'lik</strong> bir dar açı inşa et. Açının yayını çiz.
      </p>
      <div style="border: 1.5px dashed #cbd5e1; border-radius: 8px; height: 160px; background: #f8fafc; position: relative; padding: 8px;">
        <div style="position: absolute; bottom: 32px; left: 24px; width: 140px; height: 2px; background: #1e293b;"></div>
        <div style="position: absolute; bottom: 26px; left: 18px; font-size: 11px; font-weight: 900; color: #1d4ed8;">• O</div>
        <div style="position: absolute; bottom: 27px; left: 168px; font-size: 11px; font-weight: 900; color: #1e293b;">►</div>
        <div style="position: absolute; top: 16px; left: 70px; font-size: 10px; color: #94a3b8;">(İletki ile 60° hizası)</div>
        <div style="position: absolute; bottom: 6px; right: 10px; font-size: 9px; color: #64748b; font-family: monospace;">Açı Ölçüsü: m(O) = 60°</div>
      </div>
    </div>

    <!-- İSTASYON 3: PERGEL -->
    <div style="border: 2px solid #8b5cf6; border-radius: 12px; padding: 12px; background: #ffffff;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ede9fe; padding-bottom: 6px; margin-bottom: 8px;">
        <span style="font-weight: 900; color: #6d28d9; font-size: 12px;">⭕ İSTASYON 3: PERGEL</span>
        <span style="font-size: 10px; font-weight: bold; background: #f5f3ff; color: #7c3aed; padding: 2px 6px; border-radius: 4px; border: 1px solid #ddd6fe;">Çember & Selçuklu Motifi</span>
      </div>
      <p style="font-size: 11px; color: #1e293b; line-height: 1.4; margin: 0 0 8px 0; font-weight: 600;">
        <strong>Yönerge:</strong> Pergelini <strong>4 cm</strong> aç. <code>'M'</code> merkezine batırarak tam bir çember çiz. Çember yayından merkeze doğru ikinci bir yay çizerek çiçek motifi oluştur.
      </p>
      <div style="border: 1.5px dashed #cbd5e1; border-radius: 8px; height: 160px; background: #f8fafc; position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="width: 10px; height: 10px; border-radius: 50%; background: #6d28d9; border: 2px solid #ffffff; box-shadow: 0 0 0 1.5px #6d28d9;"></div>
        <span style="position: absolute; margin-top: 24px; font-size: 11px; font-weight: 900; color: #6d28d9;">M (Merkez Noktası)</span>
        <div style="position: absolute; width: 110px; height: 110px; border-radius: 50%; border: 1px dotted #cbd5e1; pointer-events: none;"></div>
        <div style="position: absolute; bottom: 6px; right: 10px; font-size: 9px; color: #64748b; font-family: monospace;">Yarıçap r = 4 cm</div>
      </div>
    </div>

    <!-- İSTASYON 4: GÖNYE -->
    <div style="border: 2px solid #ea580c; border-radius: 12px; padding: 12px; background: #ffffff;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ffedd5; padding-bottom: 6px; margin-bottom: 8px;">
        <span style="font-weight: 900; color: #c2410c; font-size: 12px;">📐 İSTASYON 4: GÖNYE</span>
        <span style="font-size: 10px; font-weight: bold; background: #fff7ed; color: #ea580c; padding: 2px 6px; border-radius: 4px; border: 1px solid #fed7aa;">Dikme İndirme (⊥)</span>
      </div>
      <p style="font-size: 11px; color: #1e293b; line-height: 1.4; margin: 0 0 8px 0; font-weight: 600;">
        <strong>Yönerge:</strong> Aşağıdaki <code>d</code> doğrusuna, dışındaki <code>P</code> noktasından gönye yardımıyla bir dikme indir. Diklik sembolünü (<code>⊥</code>) koy.
      </p>
      <div style="border: 1.5px dashed #cbd5e1; border-radius: 8px; height: 160px; background: #f8fafc; position: relative; padding: 8px;">
        <div style="position: absolute; top: 20px; left: 90px; font-size: 12px; font-weight: 900; color: #c2410c;">• P (Dış Nokta)</div>
        <div style="position: absolute; bottom: 35px; left: 16px; width: 190px; height: 2px; background: #334155; transform: rotate(-8deg);"></div>
        <div style="position: absolute; bottom: 42px; right: 20px; font-size: 11px; font-weight: 900; color: #334155;">d doğrusu</div>
        <div style="position: absolute; bottom: 6px; right: 10px; font-size: 9px; color: #64748b; font-family: monospace;">Diklik: [PH] ⊥ d (90°)</div>
      </div>
    </div>

  </div>

  <div style="margin-top: 14px; padding: 8px 12px; background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 8px; font-size: 10px; color: #0f766e; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Değerlendirme:</strong> Her istasyon 25 puan değerindedir. Toplam 100 Puan.</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-5-3-1-bridge',
    title: 'Büyük Görev: Tarihi Köprü Restorasyonu (MAT.5.3.1)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.5.3.1',
    outcomeTitle: 'Temel Geometrik Çizimler ve Geometrik Araçların Kullanımı',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 1,
    createdAt: '2026-09-09T09:00:00Z',
    fileSizeKb: 210,
    tags: ['Etkinlik Kağıdı', 'Büyük Görev', 'Tarihi Köprü Restorasyonu', 'Mimar Sinan', 'Cetvel', 'İletki', 'Pergel', 'Gönye', 'MAT.5.3.1', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b;">
  <div style="text-align: center; border-bottom: 2px solid #b45309; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #fffbeb, #fef3c7); padding: 12px; border-radius: 12px; border: 1px solid #fde68a;">
    <div style="display: inline-block; background: #b45309; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 4px;">
      🏛️ MİMARİ RESTORASYON &amp; GEOMETRİK İNŞA
    </div>
    <h2 style="color: #78350f; font-size: 17px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
      BÜYÜK GÖREV: TARİHİ KÖPRÜ RESTORASYONU (MAT.5.3.1)
    </h2>
    <div style="margin-top: 6px; padding: 6px 12px; background: #ffffff; border-radius: 8px; border: 1px dashed #d97706; display: inline-block;">
      <p style="color: #92400e; font-size: 11px; margin: 0; font-weight: 700; font-style: italic;">
        📜 <strong>Kurgu Paneli:</strong> &ldquo;Mimar Sinan'ın Kanuni Köprüsü'nün çizimi hasar gördü! Kemerleri ve ayakları aletlerinle tamamla.&rdquo;
      </p>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px;">
    <div style="background: #ffffff; border: 1.5px solid #0d9488; border-radius: 8px; padding: 6px 8px;">
      <div style="font-size: 10px; font-weight: 900; color: #0f766e;">📏 ADIM 1: CETVEL</div>
      <div style="font-size: 9.5px; color: #334155; margin-top: 2px;">Düz nehir zemin doğrusunu çiz.</div>
    </div>
    <div style="background: #ffffff; border: 1.5px solid #ea580c; border-radius: 8px; padding: 6px 8px;">
      <div style="font-size: 10px; font-weight: 900; color: #c2410c;">📐 ADIM 2: GÖNYE</div>
      <div style="font-size: 9.5px; color: #334155; margin-top: 2px;">Zemine 90° dik iki köprü ayağı indir.</div>
    </div>
    <div style="background: #ffffff; border: 1.5px solid #7c3aed; border-radius: 8px; padding: 6px 8px;">
      <div style="font-size: 10px; font-weight: 900; color: #6d28d9;">⭕ ADIM 3: PERGEL</div>
      <div style="font-size: 9.5px; color: #334155; margin-top: 2px;">İki ayak arasına dairesel kemer yayı kondur.</div>
    </div>
    <div style="background: #ffffff; border: 1.5px solid #2563eb; border-radius: 8px; padding: 6px 8px;">
      <div style="font-size: 10px; font-weight: 900; color: #1d4ed8;">🧭 ADIM 4: İLETKİ</div>
      <div style="font-size: 9.5px; color: #334155; margin-top: 2px;">Köprü kulesinin açısını kontrol et.</div>
    </div>
  </div>

  <div style="border: 2px solid #78350f; border-radius: 12px; background: #ffffff; padding: 12px; position: relative; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">
      <span style="font-size: 11px; font-weight: 900; color: #78350f; display: flex; align-items: center; gap: 4px;">
        🏛️ GENİŞ ÇİZİM ALANI: MİLİMETRİK GRID CANVAS
      </span>
      <span style="font-size: 9px; font-family: monospace; color: #64748b; background: #f8fafc; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0;">
        Ölçek: 1 birim = 1 cm • Kılavuz Grid Aktif
      </span>
    </div>

    <div style="border: 1.5px dashed #94a3b8; border-radius: 8px; min-height: 320px; background-color: #fcfbf7; padding: 6px; position: relative;">
      <svg viewBox="0 0 800 320" width="100%" height="100%" style="display: block; overflow: visible;" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid_store" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#cbd5e1" />
          </pattern>
          <linearGradient id="pierGrad_store" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#fde68a" />
            <stop offset="50%" stop-color="#fef3c7" />
            <stop offset="100%" stop-color="#fde68a" />
          </linearGradient>
          <linearGradient id="waterGrad_store" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#bae6fd" stop-opacity="0.3" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="800" height="320" fill="#fcfbf7" />
        <rect x="0" y="0" width="800" height="320" fill="url(#grid_store)" />

        <!-- Su Alanı (Nehir Yatağı) -->
        <rect x="30" y="250" width="740" height="60" fill="url(#waterGrad_store)" rx="8" />
        <path d="M 50 280 Q 90 273 130 280 T 210 280 T 290 280 T 370 280 T 450 280 T 530 280 T 610 280 T 690 280 T 750 280" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.7" />
        <text x="400" y="298" font-family="system-ui, sans-serif" font-size="11" fill="#0284c7" text-anchor="middle" font-weight="600">
          ~~~~ Tunca / Meriç Nehri Su Yatağı ~~~~
        </text>

        <!-- ADIM 1: NEHİR ZEMİN DOĞRUSU (CETVEL) -->
        <line x1="40" y1="250" x2="760" y2="250" stroke="#0d9488" stroke-width="3" stroke-dasharray="8 5" stroke-linecap="round" />
        <polygon points="36,250 48,245 48,255" fill="#0d9488" />
        <polygon points="764,250 752,245 752,255" fill="#0d9488" />
        <text x="50" y="240" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#0f766e">
          ◄ Düz Nehir Zemin Doğrusu (Cetvel)
        </text>
        <text x="750" y="240" font-family="monospace" font-size="11" font-weight="900" fill="#0f766e" text-anchor="end">
          d_nehir ►
        </text>

        <!-- Cetvel Çentikleri -->
        <g stroke="#0f766e" stroke-width="1" opacity="0.6">
          <line x1="100" y1="247" x2="100" y2="253" />
          <line x1="250" y1="245" x2="250" y2="255" stroke-width="2" />
          <line x1="400" y1="245" x2="400" y2="255" stroke-width="2" />
          <line x1="550" y1="245" x2="550" y2="255" stroke-width="2" />
          <line x1="700" y1="247" x2="700" y2="253" />
        </g>

        <!-- ADIM 4: KULE GÖZETLEME ÇATISI (İLETKİ) -->
        <g>
          <rect x="90" y="90" width="60" height="160" fill="#fef3c7" stroke="#b45309" stroke-width="2" rx="2" />
          <rect x="110" y="120" width="20" height="30" rx="10" fill="#78350f" opacity="0.7" />
          <polygon points="120,25 80,90 160,90" fill="#fed7aa" stroke="#ea580c" stroke-width="2" />
          <circle cx="120" cy="25" r="5" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
          <text x="120" y="16" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#1d4ed8" text-anchor="middle">
            T (Tepe Noktası)
          </text>
          <path d="M 100 57 A 38 38 0 0 0 140 57" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="3 3" />
          <text x="120" y="72" font-family="monospace" font-size="10" font-weight="900" fill="#2563eb" text-anchor="middle">
            60° (İletki)
          </text>
        </g>

        <!-- ADIM 2: SOL AYAK (AYAK 1 - GÖNYE) -->
        <g>
          <rect x="235" y="150" width="30" height="100" fill="url(#pierGrad_store)" stroke="#d97706" stroke-width="2" rx="2" />
          <text x="250" y="205" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#92400e" text-anchor="middle">
            AYAK 1
          </text>
          <circle cx="250" cy="150" r="4" fill="#c2410c" />
          <text x="228" y="145" font-family="monospace" font-size="10" font-weight="900" fill="#c2410c">
            A1
          </text>
          <path d="M 265 240 L 275 240 L 275 250" fill="none" stroke="#ea580c" stroke-width="1.8" />
          <circle cx="270" cy="245" r="1.5" fill="#ea580c" />
          <text x="250" y="125" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#c2410c" text-anchor="middle">
            [A1-Z1] ⊥ d (90°)
          </text>
        </g>

        <!-- ADIM 2: SAĞ AYAK (AYAK 2 - GÖNYE) -->
        <g>
          <rect x="535" y="150" width="30" height="100" fill="url(#pierGrad_store)" stroke="#d97706" stroke-width="2" rx="2" />
          <text x="550" y="205" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#92400e" text-anchor="middle">
            AYAK 2
          </text>
          <circle cx="550" cy="150" r="4" fill="#c2410c" />
          <text x="568" y="145" font-family="monospace" font-size="10" font-weight="900" fill="#c2410c">
            A2
          </text>
          <path d="M 535 240 L 525 240 L 525 250" fill="none" stroke="#ea580c" stroke-width="1.8" />
          <circle cx="530" cy="245" r="1.5" fill="#ea580c" />
          <text x="550" y="125" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#c2410c" text-anchor="middle">
            [A2-Z2] ⊥ d (90°)
          </text>
        </g>

        <!-- ADIM 3: KEMER MERKEZİ K VE KEMER YAYI (PERGEL) -->
        <!-- 1. Kesik Çizgili Kemer Yayı (Merkezi K=(400,150) olan tam yarıçap R=150 dairesel yay) -->
        <path d="M 250 150 A 150 150 0 0 1 550 150" fill="none" stroke="#7c3aed" stroke-width="3" stroke-dasharray="6 4" />

        <!-- 2. Kemer Üst Taş Sınırı (Korkuluk Yolu) -->
        <path d="M 80 90 L 250 130 A 165 165 0 0 1 550 130 L 720 90" fill="none" stroke="#b45309" stroke-width="2" stroke-dasharray="4 4" opacity="0.5" />

        <!-- 3. Yarıçap (Radius) Çizgileri -->
        <line x1="400" y1="150" x2="400" y2="0" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3 3" />
        <line x1="400" y1="150" x2="506" y2="44" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3 3" />
        <circle cx="506" cy="44" r="3" fill="#7c3aed" />

        <!-- Yarıçap Etiketi -->
        <g transform="translate(460, 90)">
          <rect x="-4" y="-12" width="90" height="18" fill="#ffffff" stroke="#ddd6fe" rx="4" />
          <text x="41" y="1" font-family="monospace" font-size="10" font-weight="bold" fill="#6d28d9" text-anchor="middle">
            r = 5 cm (Pergel)
          </text>
        </g>

        <!-- Kemer Tepe Etiketi -->
        <g transform="translate(400, 20)">
          <rect x="-80" y="-14" width="160" height="22" fill="#ffffff" stroke="#7c3aed" stroke-width="1.5" rx="6" />
          <text x="0" y="1" font-family="system-ui, sans-serif" font-size="10.5" font-weight="900" fill="#6d28d9" text-anchor="middle">
            Dairesel Kemer Yayı (Yay Tepe: P)
          </text>
        </g>

        <!-- 4. K Noktası (Kemer Merkezi - Pergel Batırma İğnesi) -->
        <line x1="250" y1="150" x2="550" y2="150" stroke="#6d28d9" stroke-width="1" stroke-dasharray="2 2" opacity="0.4" />
        <circle cx="400" cy="150" r="14" fill="#ede9fe" stroke="#6d28d9" stroke-width="2" />
        <circle cx="400" cy="150" r="4" fill="#6d28d9" />
        <line x1="388" y1="150" x2="412" y2="150" stroke="#6d28d9" stroke-width="1.5" />
        <line x1="400" y1="138" x2="400" y2="162" stroke="#6d28d9" stroke-width="1.5" />

        <!-- K Noktası Etiketi -->
        <g transform="translate(400, 180)">
          <rect x="-75" y="-12" width="150" height="24" fill="#f5f3ff" stroke="#6d28d9" stroke-width="1.5" rx="6" />
          <text x="0" y="3" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#5b21b6" text-anchor="middle">
            K (Kemer Merkezi)
          </text>
          <text x="0" y="24" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#7c3aed" text-anchor="middle">
            📍 Pergel İğnesi Batırma Noktası
          </text>
        </g>
      </svg>
    </div>
  </div>

  <div style="margin-top: 10px; padding: 8px 12px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-size: 10px; color: #92400e; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Puanlama:</strong> Her restorasyon adımı 25 puandır. (1. Cetvel: 25P, 2. Gönye: 25P, 3. Pergel: 25P, 4. İletki: 25P) Toplam: 100 Puan.</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
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
    const parsed: ClassroomFileRecord[] = JSON.parse(raw);
    
    // Always keep system seed activity files up-to-date
    const initialMap = new Map(INITIAL_FILES.map((f) => [f.id, f]));
    let hasChange = false;

    // Update existing system files with latest code templates
    const updatedList = parsed.map((file) => {
      if (initialMap.has(file.id)) {
        const seed = initialMap.get(file.id)!;
        initialMap.delete(file.id);
        // If system template was updated, sync it
        if (JSON.stringify(file.pages) !== JSON.stringify(seed.pages) || file.title !== seed.title) {
          hasChange = true;
          return { ...seed, createdAt: file.createdAt };
        }
      }
      return file;
    });

    // Add any new seed files not yet in localStorage
    initialMap.forEach((remainingSeed) => {
      updatedList.unshift(remainingSeed);
      hasChange = true;
    });

    if (hasChange) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    }
    return updatedList;
  } catch (e) {
    return INITIAL_FILES;
  }
}

export function getActivitySheetsForOutcome(outcomeCode: string): ClassroomFileRecord[] {
  const files = getStoredClassroomFiles();
  return files.filter(
    (f) =>
      f.outcomeCode === outcomeCode &&
      (f.tags?.includes('Etkinlik Kağıdı') || f.title.toLowerCase().includes('etkinlik') || f.title.toLowerCase().includes('görev'))
  );
}

export function getActivitySheetForOutcome(outcomeCode: string, activityId?: string): ClassroomFileRecord | null {
  const sheets = getActivitySheetsForOutcome(outcomeCode);
  if (activityId) {
    const found = sheets.find((s) => s.id === activityId);
    if (found) return found;
  }
  return sheets[0] || null;
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

export function updateClassroomFile(
  fileId: string,
  updates: Partial<Omit<ClassroomFileRecord, 'id' | 'createdAt'>>
): ClassroomFileRecord | null {
  const current = getStoredClassroomFiles();
  const index = current.findIndex((f) => f.id === fileId);
  if (index === -1) return null;

  const existing = current[index];
  const updatedRecord: ClassroomFileRecord = {
    ...existing,
    ...updates,
    pageCount: updates.pages ? updates.pages.length : (updates.pageCount ?? existing.pageCount),
    updatedAt: new Date().toISOString()
  };

  const updatedList = [...current];
  updatedList[index] = updatedRecord;

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  }
  return updatedRecord;
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
    case 'point': {
      const r = Math.max(5, Math.min(W, H) * 0.18);
      const ptName = shape.pointName || shape.label || 'A';
      const fontSize = Math.max(14, Math.min(W, H) * 0.35);
      innerSvg = `
        <circle cx="${W / 2}" cy="${H / 2}" r="${r}" fill="${stroke}" />
        <circle cx="${W / 2}" cy="${H / 2}" r="${r + 4}" fill="none" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.6)}" opacity="0.3" />
        <text x="${W / 2 + r + 6}" y="${H / 2 - r / 2 + 2}" font-family="system-ui, sans-serif" font-weight="900" font-size="${fontSize}" fill="${stroke}">${ptName}</text>
      `;
      break;
    }

    case 'line': {
      const midY = H / 2;
      const arrSize = Math.max(9, sw * 2.8);
      const pad = arrSize + 4;
      const x1 = pad;
      const x2 = W - pad;
      const ptA_X = x1 + (x2 - x1) * 0.28;
      const ptB_X = x1 + (x2 - x1) * 0.72;
      const dotR = Math.max(3.5, sw * 1.2);
      const fontSize = Math.max(12, Math.min(18, H * 0.35));
      innerSvg = `
        <line x1="${x1 + 2}" y1="${midY}" x2="${x2 - 2}" y2="${midY}" stroke="${stroke}" stroke-width="${sw}" ${dashAttr} />
        <!-- Left Arrow Pointing Strictly LEFT (<) -->
        <polygon points="${x1},${midY} ${x1 + arrSize},${midY - arrSize * 0.55} ${x1 + arrSize * 0.65},${midY} ${x1 + arrSize},${midY + arrSize * 0.55}" fill="${stroke}" />
        <!-- Right Arrow Pointing Strictly RIGHT (>) -->
        <polygon points="${x2},${midY} ${x2 - arrSize},${midY - arrSize * 0.55} ${x2 - arrSize * 0.65},${midY} ${x2 - arrSize},${midY + arrSize * 0.55}" fill="${stroke}" />
        <circle cx="${ptA_X}" cy="${midY}" r="${dotR}" fill="${stroke}" />
        <text x="${ptA_X}" y="${midY - dotR - 4}" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="${fontSize}" fill="${stroke}">A</text>
        <circle cx="${ptB_X}" cy="${midY}" r="${dotR}" fill="${stroke}" />
        <text x="${ptB_X}" y="${midY - dotR - 4}" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="${fontSize}" fill="${stroke}">B</text>
        <text x="${x2 + 4}" y="${midY + fontSize * 0.4}" font-family="system-ui, sans-serif" font-weight="900" font-style="italic" font-size="${fontSize * 1.1}" fill="${stroke}">d</text>
      `;
      break;
    }

    case 'segment': {
      const midY = H / 2;
      const dotR = Math.max(4.5, sw * 1.4);
      const x1 = dotR + 6;
      const x2 = W - dotR - 6;
      const fontSize = Math.max(12, Math.min(18, H * 0.35));
      innerSvg = `
        <line x1="${x1}" y1="${midY}" x2="${x2}" y2="${midY}" stroke="${stroke}" stroke-width="${sw}" ${dashAttr} />
        <circle cx="${x1}" cy="${midY}" r="${dotR}" fill="${stroke}" />
        <text x="${x1}" y="${midY - dotR - 4}" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="${fontSize}" fill="${stroke}">[A</text>
        <circle cx="${x2}" cy="${midY}" r="${dotR}" fill="${stroke}" />
        <text x="${x2}" y="${midY - dotR - 4}" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="${fontSize}" fill="${stroke}">B]</text>
      `;
      break;
    }

    case 'ray': {
      const midY = H / 2;
      const arrSize = Math.max(9, sw * 2.8);
      const dotR = Math.max(4.5, sw * 1.4);
      const x1 = dotR + 6;
      const x2 = W - arrSize - 4;
      const ptB_X = x1 + (x2 - x1) * 0.65;
      const fontSize = Math.max(12, Math.min(18, H * 0.35));
      innerSvg = `
        <line x1="${x1}" y1="${midY}" x2="${x2 - 2}" y2="${midY}" stroke="${stroke}" stroke-width="${sw}" ${dashAttr} />
        <!-- Right Arrow Pointing Strictly RIGHT (>) -->
        <polygon points="${x2},${midY} ${x2 - arrSize},${midY - arrSize * 0.55} ${x2 - arrSize * 0.65},${midY} ${x2 - arrSize},${midY + arrSize * 0.55}" fill="${stroke}" />
        <circle cx="${x1}" cy="${midY}" r="${dotR}" fill="${stroke}" />
        <text x="${x1}" y="${midY - dotR - 4}" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="${fontSize}" fill="${stroke}">[A</text>
        <circle cx="${ptB_X}" cy="${midY}" r="${dotR * 0.85}" fill="${stroke}" />
        <text x="${ptB_X}" y="${midY - dotR - 4}" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="${fontSize}" fill="${stroke}">B</text>
      `;
      break;
    }

    case 'angle': {
      const deg = shape.angleDegrees !== undefined ? shape.angleDegrees : 60;
      const rad = (deg * Math.PI) / 180;
      const vX = Math.max(25, sw * 2 + 15);
      const vY = H - Math.max(25, sw * 2 + 15);
      const armLen = Math.min(W - vX - 25, vY - 25);
      const arrSize = Math.max(7, sw * 2.4);

      const baseEndX = vX + armLen;
      const baseEndY = vY;

      const armEndX = vX + armLen * Math.cos(rad);
      const armEndY = vY - armLen * Math.sin(rad);

      const arcR = Math.min(45, Math.max(25, armLen * 0.35));
      const arcStartX = vX + arcR;
      const arcStartY = vY;
      const arcEndX = vX + arcR * Math.cos(rad);
      const arcEndY = vY - arcR * Math.sin(rad);

      const largeArc = deg > 180 ? 1 : 0;
      const midRad = rad / 2;
      const textR = arcR + 18;
      const textX = vX + textR * Math.cos(midRad);
      const textY = vY - textR * Math.sin(midRad);

      const isRightAngle = Math.abs(deg - 90) < 0.5;

      let arcElement = '';
      if (isRightAngle) {
        const sq = Math.min(20, arcR * 0.65);
        arcElement = `
          <path d="M ${vX + sq} ${vY} L ${vX + sq} ${vY - sq} L ${vX} ${vY - sq}" fill="none" stroke="${stroke}" stroke-width="${Math.max(1.5, sw * 0.8)}" />
          <circle cx="${vX + sq / 2}" cy="${vY - sq / 2}" r="${Math.max(1.5, sw * 0.5)}" fill="${stroke}" />
          <text x="${vX + sq + 14}" y="${vY - sq - 4}" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="${stroke}">90°</text>
        `;
      } else {
        arcElement = `
          <path d="M ${vX} ${vY} L ${arcStartX} ${arcStartY} A ${arcR} ${arcR} 0 ${largeArc} 0 ${arcEndX} ${arcEndY} Z" fill="${fill === 'transparent' ? '#14b8a625' : fill}" opacity="0.85" />
          <path d="M ${arcStartX} ${arcStartY} A ${arcR} ${arcR} 0 ${largeArc} 0 ${arcEndX} ${arcEndY}" fill="none" stroke="${stroke}" stroke-width="${Math.max(1.5, sw * 0.8)}" />
          <text x="${textX}" y="${textY + 4}" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="${stroke}">${Math.round(deg)}°</text>
        `;
      }

      // Base arm arrow
      const baseArrow = `<polygon points="${baseEndX},${baseEndY} ${baseEndX - arrSize},${baseEndY - arrSize * 0.55} ${baseEndX - arrSize * 0.65},${baseEndY} ${baseEndX - arrSize},${baseEndY + arrSize * 0.55}" fill="${stroke}" />`;

      // Rotating arm arrow
      const cosA = Math.cos(rad);
      const sinA = -Math.sin(rad); // Screen coordinate direction (y is down)
      const p1X = armEndX - arrSize * cosA - arrSize * 0.55 * sinA;
      const p1Y = armEndY - arrSize * sinA + arrSize * 0.55 * cosA;
      const p2X = armEndX - arrSize * 0.65 * cosA;
      const p2Y = armEndY - arrSize * 0.65 * sinA;
      const p3X = armEndX - arrSize * cosA + arrSize * 0.55 * sinA;
      const p3Y = armEndY - arrSize * sinA - arrSize * 0.55 * cosA;
      const rotArmArrow = `<polygon points="${armEndX},${armEndY} ${p1X},${p1Y} ${p2X},${p2Y} ${p3X},${p3Y}" fill="${stroke}" />`;

      innerSvg = `
        ${arcElement}
        <line x1="${vX}" y1="${vY}" x2="${baseEndX - 2}" y2="${baseEndY}" stroke="${stroke}" stroke-width="${sw}" ${dashAttr} />
        ${baseArrow}
        <line x1="${vX}" y1="${vY}" x2="${armEndX - 2 * cosA}" y2="${armEndY - 2 * sinA}" stroke="${stroke}" stroke-width="${sw}" ${dashAttr} />
        ${rotArmArrow}
        <circle cx="${vX}" cy="${vY}" r="${Math.max(4, sw * 1.2)}" fill="${stroke}" />
        <text x="${vX - 12}" y="${vY + 14}" font-family="system-ui, sans-serif" font-weight="800" font-size="13" fill="${stroke}">B</text>
        <circle cx="${vX + armLen * 0.7}" cy="${vY}" r="${Math.max(3, sw * 0.9)}" fill="${stroke}" />
        <text x="${vX + armLen * 0.7}" y="${vY + 16}" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="${stroke}">C</text>
        <circle cx="${vX + armLen * 0.7 * Math.cos(rad)}" cy="${vY - armLen * 0.7 * Math.sin(rad)}" r="${Math.max(3, sw * 0.9)}" fill="${stroke}" />
        <text x="${vX + armLen * 0.7 * Math.cos(rad) - 12}" y="${vY - armLen * 0.7 * Math.sin(rad) - 6}" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="${stroke}">A</text>
      `;
      break;
    }

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

      <div style="border-top: 1px solid #cbd5e1; padding-top: 10px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #64748b;">
        <span>Hazırlayan: <strong>${file.authorName}</strong></span>
        <span>Tarih: ${new Date(file.createdAt).toLocaleDateString('tr-TR')}</span>
        <span style="font-weight: 800; color: #0f766e; font-family: monospace;">www.maarifakademi.com.tr</span>
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
