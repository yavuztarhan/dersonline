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

        <!-- ADIM 2: SOL AYAK İNŞA HEDEFİ (AYAK 1 - GÖNYE İLE ÇİZİLECEK) -->
        <g>
          <!-- Öğrencinin gönye ile çizeceği kılavuz hattı -->
          <line x1="250" y1="150" x2="250" y2="250" stroke="#ea580c" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.45" />
          
          <!-- Taban Noktası Z1 -->
          <circle cx="250" cy="250" r="5" fill="#ea580c" stroke="#ffffff" stroke-width="1.5" />
          <text x="250" y="270" font-family="monospace" font-size="10.5" font-weight="900" fill="#c2410c" text-anchor="middle">
            Z1 (Taban)
          </text>

          <!-- Tepe Noktası A1 -->
          <circle cx="250" cy="150" r="5" fill="#ea580c" stroke="#ffffff" stroke-width="1.5" />
          <text x="215" y="145" font-family="monospace" font-size="10.5" font-weight="900" fill="#c2410c">
            A1
          </text>

          <!-- Gönye 90° Diklik Hedef Kutusu (Zeminde) -->
          <path d="M 250 236 L 264 236 L 264 250" fill="none" stroke="#ea580c" stroke-width="1.8" />
          <circle cx="257" cy="243" r="1.5" fill="#ea580c" />
          
          <text x="250" y="195" font-family="system-ui, sans-serif" font-size="9.5" font-weight="900" fill="#c2410c" text-anchor="middle">
            [Z1-A1] ⊥ d
          </text>
          <text x="250" y="208" font-family="system-ui, sans-serif" font-size="8.5" font-weight="700" fill="#ea580c" text-anchor="middle">
            (Gönye ile Çiz)
          </text>
        </g>

        <!-- ADIM 2: SAĞ AYAK İNŞA HEDEFİ (AYAK 2 - GÖNYE İLE ÇİZİLECEK) -->
        <g>
          <!-- Öğrencinin gönye ile çizeceği kılavuz hattı -->
          <line x1="550" y1="150" x2="550" y2="250" stroke="#ea580c" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.45" />

          <!-- Taban Noktası Z2 -->
          <circle cx="550" cy="250" r="5" fill="#ea580c" stroke="#ffffff" stroke-width="1.5" />
          <text x="550" y="270" font-family="monospace" font-size="10.5" font-weight="900" fill="#c2410c" text-anchor="middle">
            Z2 (Taban)
          </text>

          <!-- Tepe Noktası A2 -->
          <circle cx="550" cy="150" r="5" fill="#ea580c" stroke="#ffffff" stroke-width="1.5" />
          <text x="568" y="145" font-family="monospace" font-size="10.5" font-weight="900" fill="#c2410c">
            A2
          </text>

          <!-- Gönye 90° Diklik Hedef Kutusu (Zeminde) -->
          <path d="M 550 236 L 536 236 L 536 250" fill="none" stroke="#ea580c" stroke-width="1.8" />
          <circle cx="543" cy="243" r="1.5" fill="#ea580c" />

          <text x="550" y="195" font-family="system-ui, sans-serif" font-size="9.5" font-weight="900" fill="#c2410c" text-anchor="middle">
            [Z2-A2] ⊥ d
          </text>
          <text x="550" y="208" font-family="system-ui, sans-serif" font-size="8.5" font-weight="700" fill="#ea580c" text-anchor="middle">
            (Gönye ile Çiz)
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
  },
  {
    id: 'file-activity-mat-5-3-2',
    title: 'Çıkarım Dedektifi: Gözlem ve Temel Kurallar (MAT.5.3.2)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.5.3.2',
    outcomeTitle: 'Temel Geometrik Çizimlerin Özelliklerine Yönelik Çıkarımda Bulunabilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 1,
    createdAt: '2026-09-09T10:00:00Z',
    fileSizeKb: 195,
    tags: ['Etkinlik Kağıdı', 'Çıkarım Dedektifi', 'İki Nokta Tek Doğru', 'Çember Yarıçap Sırrı', 'Tek Dikme Kuralı', 'MAT.5.3.2', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <!-- Başlık Banner -->
  <div style="text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 14px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 12px; border-radius: 12px; border: 1px solid #bae6fd;">
    <div style="display: inline-block; background: #0284c7; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 4px;">
      🔍 GÖZLEM &amp; MANTIKSAL ÇIKARIM (SDB3.3 / E3.7)
    </div>
    <h2 style="color: #0369a1; font-size: 17px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
      ETKİNLİK: "ÇIKARIM DEDEKTİFİ" (GÖZLEM VE TEMEL KURALLAR) - MAT.5.3.2
    </h2>
    <p style="color: #334155; font-size: 11px; margin: 4px 0 0 0; font-weight: 600;">
      Aşağıdaki 3 deney kutusundaki geometrik durumları inceleyerek çizimlerini yap ve dedektif çıkarım cümlelerindeki boşlukları doldur.
    </p>
  </div>

  <!-- 3 Mini Deney Kutusu -->
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 12px;">
    
    <!-- DENEY 1: İKİ NOKTA - BİR DOĞRU -->
    <div style="border: 2px solid #0284c7; border-radius: 12px; padding: 10px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #e0f2fe; padding-bottom: 4px; margin-bottom: 6px;">
          <span style="font-weight: 900; color: #0369a1; font-size: 11.5px;">📏 DENEY 1: İKİ NOKTA - BİR DOĞRU</span>
          <span style="font-size: 9px; font-weight: bold; background: #f0f9ff; color: #0284c7; padding: 1px 5px; border-radius: 4px; border: 1px solid #bae6fd;">Cetvel</span>
        </div>
        <p style="font-size: 10.5px; color: #1e293b; line-height: 1.35; margin: 0 0 6px 0;">
          <strong>Soru &amp; Yönerge:</strong> Cetvelini bu iki noktaya koy. Bu noktalardan aynı anda geçen kaç farklı düz çizgi çizebilirsin? Dene ve sonucu yaz.
        </p>
        
        <!-- Çizim Alanı SVG -->
        <div style="border: 1.5px dashed #cbd5e1; border-radius: 8px; height: 140px; background: #f8fafc; position: relative; overflow: hidden;">
          <svg viewBox="0 0 240 140" width="100%" height="100%" style="display: block;">
            <!-- Noktalar A ve B -->
            <line x1="20" y1="70" x2="220" y2="70" stroke="#0284c7" stroke-width="2" stroke-dasharray="4 3" opacity="0.6" />
            <circle cx="60" cy="70" r="5" fill="#0284c7" stroke="#ffffff" stroke-width="1.5" />
            <text x="60" y="55" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#0369a1" text-anchor="middle">A</text>
            
            <circle cx="180" cy="70" r="5" fill="#0284c7" stroke="#ffffff" stroke-width="1.5" />
            <text x="180" y="55" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#0369a1" text-anchor="middle">B</text>

            <text x="120" y="105" font-family="system-ui, sans-serif" font-size="9.5" font-weight="700" fill="#64748b" text-anchor="middle">
              (Cetvel ile A ve B'yi birleştir)
            </text>
            <text x="120" y="125" font-family="monospace" font-size="9" font-weight="bold" fill="#0284c7" text-anchor="middle">
              d doğrusu
            </text>
          </svg>
        </div>
      </div>

      <!-- Çıkarım Cümlesi -->
      <div style="margin-top: 8px; padding: 6px 8px; background: #f0f9ff; border: 1.5px solid #0284c7; border-radius: 8px;">
        <span style="font-size: 9px; font-weight: 900; color: #0369a1; text-transform: uppercase;">🕵️‍♂️ Çıkarım Cümlesi:</span>
        <p style="font-size: 10px; color: #0f172a; margin: 3px 0 0 0; font-weight: 700; line-height: 1.35;">
          &ldquo;Düzlemde farklı iki noktadan yalnız <span style="display: inline-block; min-width: 60px; border-bottom: 2px solid #0284c7; text-align: center; color: #0369a1; font-weight: 900;">(............)</span> doğru geçer.&rdquo;
        </p>
      </div>
    </div>

    <!-- DENEY 2: ÇEMBERİN YARIÇAP SIRRI -->
    <div style="border: 2px solid #7c3aed; border-radius: 12px; padding: 10px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ede9fe; padding-bottom: 4px; margin-bottom: 6px;">
          <span style="font-weight: 900; color: #6d28d9; font-size: 11.5px;">⭕ DENEY 2: ÇEMBERİN YARIÇAP SIRRI</span>
          <span style="font-size: 9px; font-weight: bold; background: #f5f3ff; color: #7c3aed; padding: 1px 5px; border-radius: 4px; border: 1px solid #ddd6fe;">Pergel</span>
        </div>
        <p style="font-size: 10.5px; color: #1e293b; line-height: 1.35; margin: 0 0 6px 0;">
          <strong>Soru &amp; Yönerge:</strong> Merkezden çember yayına uzanan bu doğru parçalarının uzunluklarını karşılaştır.
        </p>

        <!-- Çizim Alanı SVG -->
        <div style="border: 1.5px dashed #cbd5e1; border-radius: 8px; height: 140px; background: #f8fafc; position: relative; overflow: hidden;">
          <svg viewBox="0 0 240 140" width="100%" height="100%" style="display: block;">
            <!-- Çember M merkezli -->
            <circle cx="120" cy="70" r="48" fill="none" stroke="#7c3aed" stroke-width="2" />
            <!-- Merkez M -->
            <circle cx="120" cy="70" r="4" fill="#6d28d9" stroke="#ffffff" stroke-width="1.5" />
            <text x="110" y="65" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#6d28d9">M</text>
            
            <!-- 3 Yarıçap -->
            <!-- r1 to A -->
            <line x1="120" y1="70" x2="168" y2="70" stroke="#8b5cf6" stroke-width="1.8" />
            <circle cx="168" cy="70" r="3" fill="#6d28d9" />
            <text x="175" y="73" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#6d28d9">A</text>
            <text x="144" y="64" font-family="monospace" font-size="8" font-weight="bold" fill="#7c3aed">r₁</text>

            <!-- r2 to B (top-left 135 deg) -->
            <line x1="120" y1="70" x2="86" y2="36" stroke="#8b5cf6" stroke-width="1.8" />
            <circle cx="86" cy="36" r="3" fill="#6d28d9" />
            <text x="76" y="32" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#6d28d9">B</text>
            <text x="96" y="48" font-family="monospace" font-size="8" font-weight="bold" fill="#7c3aed">r₂</text>

            <!-- r3 to C (bottom-left 225 deg) -->
            <line x1="120" y1="70" x2="86" y2="104" stroke="#8b5cf6" stroke-width="1.8" />
            <circle cx="86" cy="104" r="3" fill="#6d28d9" />
            <text x="76" y="112" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#6d28d9">C</text>
            <text x="96" y="94" font-family="monospace" font-size="8" font-weight="bold" fill="#7c3aed">r₃</text>

            <text x="185" y="125" font-family="monospace" font-size="8" font-weight="bold" fill="#6d28d9" text-anchor="middle">
              |MA|=|MB|=|MC|
            </text>
          </svg>
        </div>
      </div>

      <!-- Çıkarım Cümlesi -->
      <div style="margin-top: 8px; padding: 6px 8px; background: #f5f3ff; border: 1.5px solid #7c3aed; border-radius: 8px;">
        <span style="font-size: 9px; font-weight: 900; color: #6d28d9; text-transform: uppercase;">🕵️‍♂️ Çıkarım Cümlesi:</span>
        <p style="font-size: 10px; color: #0f172a; margin: 3px 0 0 0; font-weight: 700; line-height: 1.35;">
          &ldquo;Çemberin merkezinden üzerindeki tüm noktalara çizilen doğru parçaları <span style="display: inline-block; min-width: 70px; border-bottom: 2px solid #7c3aed; text-align: center; color: #6d28d9; font-weight: 900;">(...............)</span> uzunluktadır.&rdquo;
        </p>
      </div>
    </div>

    <!-- DENEY 3: TEK DİKME KURALI -->
    <div style="border: 2px solid #ea580c; border-radius: 12px; padding: 10px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ffedd5; padding-bottom: 4px; margin-bottom: 6px;">
          <span style="font-weight: 900; color: #c2410c; font-size: 11.5px;">📐 DENEY 3: TEK DİKME KURALI</span>
          <span style="font-size: 9px; font-weight: bold; background: #fff7ed; color: #ea580c; padding: 1px 5px; border-radius: 4px; border: 1px solid #fed7aa;">Gönye</span>
        </div>
        <p style="font-size: 10.5px; color: #1e293b; line-height: 1.35; margin: 0 0 6px 0;">
          <strong>Soru &amp; Yönerge:</strong> P noktasından aşağıdaki doğruya gönyenle kaç tane 90° dikme indirebilirsin?
        </p>

        <!-- Çizim Alanı SVG -->
        <div style="border: 1.5px dashed #cbd5e1; border-radius: 8px; height: 140px; background: #f8fafc; position: relative; overflow: hidden;">
          <svg viewBox="0 0 240 140" width="100%" height="100%" style="display: block;">
            <!-- Doğru d -->
            <line x1="20" y1="105" x2="220" y2="105" stroke="#334155" stroke-width="2" />
            <text x="215" y="98" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#334155">d</text>
            
            <!-- Dış Nokta P -->
            <circle cx="120" cy="30" r="5" fill="#ea580c" stroke="#ffffff" stroke-width="1.5" />
            <text x="120" y="20" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#c2410c" text-anchor="middle">P (Dış Nokta)</text>

            <!-- Dikme [PH] -->
            <line x1="120" y1="30" x2="120" y2="105" stroke="#ea580c" stroke-width="2" stroke-dasharray="4 3" />
            <circle cx="120" cy="105" r="3.5" fill="#c2410c" />
            <text x="120" y="122" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#c2410c" text-anchor="middle">H</text>

            <!-- 90° Diklik Sembolü -->
            <path d="M 120 93 L 132 93 L 132 105" fill="none" stroke="#ea580c" stroke-width="1.5" />
            <circle cx="126" cy="99" r="1.5" fill="#ea580c" />

            <text x="175" y="65" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#ea580c">
              [PH] ⊥ d (90°)
            </text>
          </svg>
        </div>
      </div>

      <!-- Çıkarım Cümlesi -->
      <div style="margin-top: 8px; padding: 6px 8px; background: #fff7ed; border: 1.5px solid #ea580c; border-radius: 8px;">
        <span style="font-size: 9px; font-weight: 900; color: #c2410c; text-transform: uppercase;">🕵️‍♂️ Çıkarım Cümlesi:</span>
        <p style="font-size: 10px; color: #0f172a; margin: 3px 0 0 0; font-weight: 700; line-height: 1.35;">
          &ldquo;Bir doğruya dışındaki bir noktadan yalnız <span style="display: inline-block; min-width: 60px; border-bottom: 2px solid #ea580c; text-align: center; color: #c2410c; font-weight: 900;">(............)</span> dikme çizilebilir.&rdquo;
        </p>
      </div>
    </div>

  </div>

  <!-- Alt Bilgi / Değerlendirme & Puanlama -->
  <div style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 10px; color: #475569; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Değerlendirme:</strong> Her çıkarım deneyi 33.3 puandır. Toplam: 100 Puan. (SDB3.3 / E3.7 Mantıksal Çıkarım)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-5-3-2-stepping',
    title: 'Pergel ile Adımlama Atölyesi: Eşit Parçalar Kesme (MAT.5.3.2)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.5.3.2',
    outcomeTitle: 'Temel Geometrik Çizimlerin Özelliklerine Yönelik Çıkarımda Bulunabilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 1,
    createdAt: '2026-09-09T11:00:00Z',
    fileSizeKb: 205,
    tags: ['Etkinlik Kağıdı', 'Pergel ile Adımlama', 'Eşit Parçalar Kesme', 'Işın Üzerinde Adımlama', 'Açı Kollarını Eşitleme', 'MAT.5.3.2', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <!-- Başlık Banner -->
  <div style="text-align: center; border-bottom: 2px solid #7c3aed; padding-bottom: 8px; margin-bottom: 14px; background: linear-gradient(135deg, #f5f3ff, #ede9fe); padding: 12px; border-radius: 12px; border: 1px solid #ddd6fe;">
    <div style="display: inline-block; background: #7c3aed; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 4px;">
      ⭕ PERGEL İNŞASI &amp; EŞİT MESAFE AKTARIMI (SDB1.2 / OB2)
    </div>
    <h2 style="color: #5b21b6; font-size: 17px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
      ATÖLYE: "PERGEL İLE ADIMLAMA" (EŞİT PARÇALAR KESME) - MAT.5.3.2
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 4px 0 0 0; font-weight: 600;">
      Ölçülü cetvel (santimetre) kullanmadan, sadece pergel açıklığı ile mesafeyi sabit tutarak eşit uzunluk üretme istasyonları.
    </p>
  </div>

  <!-- 2 Ana Görev Kutusu (Görev A ve Görev B) -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
    
    <!-- GÖREV A: IŞIN ÜZERİNDE ADIMLAMA -->
    <div style="border: 2px solid #7c3aed; border-radius: 12px; padding: 12px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ede9fe; padding-bottom: 6px; margin-bottom: 8px;">
          <span style="font-weight: 900; color: #6d28d9; font-size: 12px;">🧭 GÖREV A: IŞIN ÜZERİNDE ADIMLAMA</span>
          <span style="font-size: 10px; font-weight: bold; background: #f5f3ff; color: #7c3aed; padding: 2px 6px; border-radius: 4px; border: 1px solid #ddd6fe;">50 Puan</span>
        </div>
        <p style="font-size: 11px; color: #1e293b; line-height: 1.4; margin: 0 0 8px 0;">
          <strong>Yönerge:</strong> Pergelini bir miktar aç ve açıklığını hiç bozma. İğnesini <code>K</code> noktasına batırıp ışını kesen bir yay çiz (<code>A</code> noktası). Şimdi iğneyi <code>A</code> noktasına batırıp ikinci bir yay çiz (<code>B</code> noktası). Yan yana 3 eşit parça oluştur.
        </p>

        <!-- Çizim Alanı SVG -->
        <div style="border: 1.5px dashed #cbd5e1; border-radius: 8px; height: 170px; background: #faf5ff; position: relative; overflow: hidden;">
          <svg viewBox="0 0 360 170" width="100%" height="100%" style="display: block;">
            <!-- Işın Çizgisi [K -->
            <line x1="40" y1="100" x2="330" y2="100" stroke="#475569" stroke-width="2.5" />
            <polygon points="330,95 345,100 330,105" fill="#475569" />
            
            <!-- K Başlangıç Noktası -->
            <circle cx="50" cy="100" r="5.5" fill="#7c3aed" stroke="#ffffff" stroke-width="2" />
            <text x="50" y="125" font-family="system-ui, sans-serif" font-size="11.5" font-weight="900" fill="#6d28d9" text-anchor="middle">K (Başlangıç)</text>
            
            <!-- 1. Pergel Yayı & A Noktası -->
            <path d="M 125 70 A 80 80 0 0 1 125 130" fill="none" stroke="#7c3aed" stroke-width="2" stroke-dasharray="4 3" />
            <circle cx="125" cy="100" r="4.5" fill="#7c3aed" stroke="#ffffff" stroke-width="1.5" />
            <text x="125" y="125" font-family="system-ui, sans-serif" font-size="11.5" font-weight="900" fill="#6d28d9" text-anchor="middle">A</text>
            
            <!-- 2. Pergel Yayı & B Noktası -->
            <path d="M 200 70 A 80 80 0 0 1 200 130" fill="none" stroke="#7c3aed" stroke-width="2" stroke-dasharray="4 3" />
            <circle cx="200" cy="100" r="4.5" fill="#7c3aed" stroke="#ffffff" stroke-width="1.5" />
            <text x="200" y="125" font-family="system-ui, sans-serif" font-size="11.5" font-weight="900" fill="#6d28d9" text-anchor="middle">B</text>

            <!-- 3. Pergel Yayı & C Noktası -->
            <path d="M 275 70 A 80 80 0 0 1 275 130" fill="none" stroke="#7c3aed" stroke-width="2" stroke-dasharray="4 3" />
            <circle cx="275" cy="100" r="4.5" fill="#7c3aed" stroke="#ffffff" stroke-width="1.5" />
            <text x="275" y="125" font-family="system-ui, sans-serif" font-size="11.5" font-weight="900" fill="#6d28d9" text-anchor="middle">C</text>

            <!-- Eşitlik Tırnakları (Equal tick marks) -->
            <line x1="85" y1="94" x2="89" y2="106" stroke="#6d28d9" stroke-width="1.8" />
            <line x1="160" y1="94" x2="164" y2="106" stroke="#6d28d9" stroke-width="1.8" />
            <line x1="235" y1="94" x2="239" y2="106" stroke="#6d28d9" stroke-width="1.8" />

            <text x="87" y="85" font-family="monospace" font-size="9" font-weight="bold" fill="#7c3aed" text-anchor="middle">d (sabit)</text>
            <text x="162" y="85" font-family="monospace" font-size="9" font-weight="bold" fill="#7c3aed" text-anchor="middle">d (sabit)</text>
            <text x="237" y="85" font-family="monospace" font-size="9" font-weight="bold" fill="#7c3aed" text-anchor="middle">d (sabit)</text>
          </svg>
        </div>
      </div>

      <!-- Çıkarım Notu -->
      <div style="margin-top: 10px; padding: 8px 10px; background: #f5f3ff; border: 1.5px solid #7c3aed; border-radius: 8px;">
        <span style="font-size: 9.5px; font-weight: 900; color: #6d28d9; text-transform: uppercase;">✨ Matematiksel Çıkarım:</span>
        <p style="font-size: 10.5px; color: #0f172a; margin: 4px 0 0 0; font-weight: 700;">
          |KA| = |AB| = |BC| (Pergel açıklığı sabit tutulduğunda ardışık eşit doğru parçaları kesilir).
        </p>
      </div>
    </div>

    <!-- GÖREV B: AÇININ KOLLARINI EŞİTLEME -->
    <div style="border: 2px solid #0d9488; border-radius: 12px; padding: 12px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ccfbf1; padding-bottom: 6px; margin-bottom: 8px;">
          <span style="font-weight: 900; color: #0f766e; font-size: 12px;">📐 GÖREV B: AÇININ KOLLARINI EŞİTLEME</span>
          <span style="font-size: 10px; font-weight: bold; background: #f0fdfa; color: #0d9488; padding: 2px 6px; border-radius: 4px; border: 1px solid #99f6e4;">50 Puan</span>
        </div>
        <p style="font-size: 11px; color: #1e293b; line-height: 1.4; margin: 0 0 8px 0;">
          <strong>Yönerge:</strong> Verilen rastgele bir açının her iki kolu üzerinde, aynı pergel açıklığı ile tepe noktasından (<code>O</code>) eşit uzaklıkta noktalar (<code>P₁</code> ve <code>P₂</code>) işaretle.
        </p>

        <!-- Çizim Alanı SVG -->
        <div style="border: 1.5px dashed #cbd5e1; border-radius: 8px; height: 170px; background: #f0fdfa; position: relative; overflow: hidden;">
          <svg viewBox="0 0 360 170" width="100%" height="100%" style="display: block;">
            <!-- Açının Köşesi O -->
            <circle cx="50" cy="130" r="5.5" fill="#0d9488" stroke="#ffffff" stroke-width="2" />
            <text x="35" y="145" font-family="system-ui, sans-serif" font-size="11.5" font-weight="900" fill="#0f766e">O (Tepe)</text>
            
            <!-- Yatay Kol k1 -->
            <line x1="50" y1="130" x2="320" y2="130" stroke="#334155" stroke-width="2.5" />
            <polygon points="320,125 335,130 320,135" fill="#334155" />
            <text x="330" y="145" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#334155">k₁</text>

            <!-- Eğik Kol k2 (50 deg) -->
            <line x1="50" y1="130" x2="220" y2="25" stroke="#334155" stroke-width="2.5" />
            <polygon points="215,20 230,19 226,34" fill="#334155" />
            <text x="235" y="32" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#334155">k₂</text>

            <!-- O Merkezli Pergel Yayı (R = 120) -->
            <path d="M 170 130 A 120 120 0 0 0 127 30" fill="none" stroke="#0d9488" stroke-width="2" stroke-dasharray="4 3" />
            
            <!-- P1 Noktası (Yatay Kolda) -->
            <circle cx="170" cy="130" r="4.5" fill="#0d9488" stroke="#ffffff" stroke-width="1.5" />
            <text x="170" y="150" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#0f766e" text-anchor="middle">P₁</text>

            <!-- P2 Noktası (Eğik Kolda) -->
            <circle cx="127" cy="53" r="4.5" fill="#0d9488" stroke="#ffffff" stroke-width="1.5" />
            <text x="110" y="55" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#0f766e" text-anchor="middle">P₂</text>

            <!-- Eşitlik Çift Çizgisi -->
            <text x="115" y="120" font-family="monospace" font-size="9" font-weight="bold" fill="#0f766e" text-anchor="middle">r_pergel</text>
            <text x="80" y="80" font-family="monospace" font-size="9" font-weight="bold" fill="#0f766e" text-anchor="middle">r_pergel</text>
          </svg>
        </div>
      </div>

      <!-- Çıkarım Notu -->
      <div style="margin-top: 10px; padding: 8px 10px; background: #f0fdfa; border: 1.5px solid #0d9488; border-radius: 8px;">
        <span style="font-size: 9.5px; font-weight: 900; color: #0f766e; text-transform: uppercase;">✨ Matematiksel Çıkarım:</span>
        <p style="font-size: 10.5px; color: #0f172a; margin: 4px 0 0 0; font-weight: 700;">
          |OP₁| = |OP₂| (Açının kollarından pergel yardımıyla köşe noktasından eşit uzaklıkta noktalar kesildi).
        </p>
      </div>
    </div>

  </div>

  <!-- Alt Bilgi / Puanlama & Maarif İmzası -->
  <div style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 10px; color: #475569; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Değerlendirme:</strong> Görev A (50 Puan) + Görev B (50 Puan) = Toplam 100 Puan. (SDB1.2 / OB2 Pergel ile Mesafe Koruma)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-5-3-2-railway',
    title: 'Büyük Görev: Tren Rayı Mühendisliği (Gönye ile Paralel Doğru İnşası - MAT.5.3.2)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.5.3.2',
    outcomeTitle: 'Temel Geometrik Çizimlerin Özelliklerine Yönelik Çıkarımda Bulunabilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 1,
    createdAt: '2026-09-09T11:30:00Z',
    fileSizeKb: 225,
    tags: ['Etkinlik Kağıdı', 'Büyük Görev', 'Tren Rayı Mühendisliği', 'Paralel Doğrular', 'Gönye', 'Eşit Dikmeler', 'MAT.5.3.2', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <!-- Başlık Banner -->
  <div style="text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #eef2ff, #e0e7ff); padding: 12px; border-radius: 12px; border: 1px solid #c7d2fe;">
    <div style="display: inline-block; background: #4f46e5; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 4px;">
      🚆 BÜYÜK GÖREV: PARALEL DOĞRU İNŞASI (SDB2.2 / E3.7)
    </div>
    <h2 style="color: #3730a3; font-size: 17px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
      BÜYÜK GÖREV: "TREN RAYI MÜHENDİSLİĞİ" (GÖNYE İLE PARALEL DOĞRU İNŞASI)
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 4px 0 0 0; font-weight: 600;">
      Öğrencinin paralel doğruları eşit dikmeler yardımıyla bizzat inşa ettiği büyük mühendislik görevi.
    </p>
  </div>

  <!-- Kurgu Kutusu (Storyline Box) -->
  <div style="background: #fffbeb; border: 2px solid #f59e0b; border-radius: 10px; padding: 10px 14px; margin-bottom: 12px; display: flex; align-items: center; gap: 12px;">
    <span style="font-size: 24px;">🚂</span>
    <div>
      <div style="font-size: 11px; font-weight: 900; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;">
        KURGU PANOLARI &amp; MÜHENDİSLİK HEDEFİ:
      </div>
      <p style="font-size: 11.5px; color: #78350f; margin: 2px 0 0 0; font-style: italic; font-weight: 600; line-height: 1.4;">
        "Tren raylarının birbirine çarpmaması ve trenin raydan çıkmaması için rayların aralarındaki dik mesafenin her noktada aynı olması gerekir. Kendi tren rayını gönye ve cetvelle inşa et!"
      </p>
    </div>
  </div>

  <!-- 3 Aşamalı Çizim Kılavuzu Kartları -->
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 12px;">
    
    <!-- 1. Adım -->
    <div style="border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 10px; background: #ffffff; border-top: 3.5px solid #0284c7;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-size: 11px; font-weight: 900; color: #0369a1;">1. ADIM: CETVEL</span>
        <span style="font-size: 9px; font-weight: bold; background: #e0f2fe; color: #0284c7; padding: 1px 5px; border-radius: 4px;">Noktalar</span>
      </div>
      <p style="font-size: 10.5px; color: #334155; margin: 0; line-height: 1.35;">
        Verilen <code>d</code> doğrusu üzerinde aralarında belirli mesafeler olan <code>A</code>, <code>B</code> ve <code>C</code> noktalarını belirle.
      </p>
    </div>

    <!-- 2. Adım -->
    <div style="border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 10px; background: #ffffff; border-top: 3.5px solid #f59e0b;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-size: 11px; font-weight: 900; color: #d97706;">2. ADIM: GÖNYE (90°)</span>
        <span style="font-size: 9px; font-weight: bold; background: #fef3c7; color: #d97706; padding: 1px 5px; border-radius: 4px;">Eşit Dikmeler</span>
      </div>
      <p style="font-size: 10.5px; color: #334155; margin: 0; line-height: 1.35;">
        Gönyenin dik köşesini kullanarak bu üç noktadan doğrunun üst tarafına eşit uzunlukta (4 birim) 3 dikme çık (<code>[AA']</code>, <code>[BB']</code>, <code>[CC']</code>).
      </p>
    </div>

    <!-- 3. Adım -->
    <div style="border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 10px; background: #ffffff; border-top: 3.5px solid #4f46e5;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-size: 11px; font-weight: 900; color: #4338ca;">3. ADIM: CETVEL</span>
        <span style="font-size: 9px; font-weight: bold; background: #e0e7ff; color: #4f46e5; padding: 1px 5px; border-radius: 4px;">Paralel Doğru</span>
      </div>
      <p style="font-size: 10.5px; color: #334155; margin: 0; line-height: 1.35;">
        Çıktığın dikmelerin tepe noktalarını (<code>A'</code>, <code>B'</code>, <code>C'</code>) cetvelle birleştirerek yeni bir <code>k</code> doğrusu çiz.
      </p>
    </div>

  </div>

  <!-- Geniş Çizim Alanı (SVG Milimetrik Grid Canvas) -->
  <div style="border: 2px dashed #94a3b8; border-radius: 12px; height: 260px; background: #f8fafc; position: relative; overflow: hidden; margin-bottom: 12px;">
    <svg viewBox="0 0 760 260" width="100%" height="100%" style="display: block;">
      <!-- Grid Noktaları -->
      <defs>
        <pattern id="rail_grid_static" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#cbd5e1" />
        </pattern>
      </defs>
      <rect width="760" height="260" fill="url(#rail_grid_static)" />

      <!-- Alt Doğru d (Y = 190) -->
      <line x1="40" y1="190" x2="720" y2="190" stroke="#334155" stroke-width="3" />
      <polygon points="40,186 25,190 40,194" fill="#334155" />
      <polygon points="720,186 735,190 720,194" fill="#334155" />
      <text x="740" y="194" font-family="monospace" font-size="14" font-weight="bold" fill="#334155">d</text>

      <!-- Çizim Kılavuz Açıklaması -->
      <text x="380" y="235" font-family="system-ui, sans-serif" font-size="11.5" font-weight="700" fill="#64748b" text-anchor="middle">
        (1. Adım: Cetvelle A, B, C noktalarını belirle • 2. Adım: Gönyeyle eşit 3 dikme çık • 3. Adım: Cetvelle k paralel doğrusunu çiz)
      </text>
    </svg>
  </div>

  <!-- Alt Bilgi / Değerlendirme & Puanlama -->
  <div style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 10px; color: #475569; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Değerlendirme:</strong> Adım 1 (30P) + Adım 2 (35P) + Adım 3 (35P) = Toplam 100 Puan. (SDB2.2 / E3.7 Paralel İnşası)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-5-3-3-anatomy',
    title: 'Etkinlik: İletkinin Anatomisi (Aracı Tanıma & Çift Ölçek Tuzağı - MAT.5.3.3)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 1,
    createdAt: '2026-09-09T12:00:00Z',
    fileSizeKb: 240,
    tags: ['Etkinlik Kağıdı', 'İletkinin Anatomisi', 'Açıölçer', 'Çift Ölçek Tuzağı', 'Merkez Noktası', 'Taban Çizgisi', 'İç Ölçek', 'Dış Ölçek', 'MAT.5.3.3', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <!-- Başlık Banner -->
  <div style="text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #f0fdfa, #ccfbf1); padding: 12px; border-radius: 12px; border: 1px solid #99f6e4;">
    <div style="display: inline-block; background: #0d9488; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 4px;">
      📐 ARACI TANIMA &amp; ÖLÇME BECERİSİ (SDB1.2 / SB1.1)
    </div>
    <h2 style="color: #115e59; font-size: 17px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
      ETKİNLİK: "İLETKİNİN ANATOMİSİ" (ARACI TANIMA &amp; ÇİFT ÖLÇEK TUZAĞI)
    </h2>
    <p style="color: #334155; font-size: 11px; margin: 4px 0 0 0; font-weight: 600;">
      Açıölçerin 4 kritik parçasını şema üzerinde etiketle ve çift ölçek tuzağına düşmeden açıları doğru oku!
    </p>
  </div>

  <!-- Şematik İletki Görseli (180° SVG Protractor) -->
  <div style="border: 2px solid #cbd5e1; border-radius: 12px; background: #ffffff; padding: 10px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-size: 11px; font-weight: 900; color: #0f766e; text-transform: uppercase;">
        📐 ŞEMATİK İLETKİ ŞEMASI (180° STANDART AÇIÖLÇER)
      </span>
      <span style="font-size: 9.5px; font-weight: bold; background: #ccfbf1; color: #0f766e; padding: 2px 6px; border-radius: 4px;">
        4 Kritik Parçayı Tanı
      </span>
    </div>

    <!-- SVG Protractor Schematic -->
    <div style="width: 100%; height: 260px; background: #f8fafc; border-radius: 8px; border: 1px dashed #94a3b8; overflow: hidden; position: relative;">
      <svg viewBox="0 0 720 260" width="100%" height="100%" style="display: block;">
        <defs>
          <radialGradient id="protGlass" cx="50%" cy="100%" r="90%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
            <stop offset="70%" stop-color="#ccfbf1" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#99f6e4" stop-opacity="0.8" />
          </radialGradient>
        </defs>

        <!-- Protractor Body Semi-Circle (Center 360, 215, Radius 170) -->
        <path d="M 190 215 A 170 170 0 0 1 530 215 Z" fill="url(#protGlass)" stroke="#0d9488" stroke-width="3" />
        <path d="M 280 215 A 80 80 0 0 1 440 215 Z" fill="#f8fafc" stroke="#14b8a6" stroke-width="1.5" />

        <!-- Degree Tick Marks & Labels -->
        ${(() => {
          let ticks = '';
          for (let deg = 0; deg <= 180; deg += 10) {
            const rad = (deg * Math.PI) / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            const isMajor = deg % 30 === 0;
            const rTick = isMajor ? 150 : 158;
            // Outer tick
            const x1 = 360 - 170 * cos;
            const y1 = 215 - 170 * sin;
            const x2 = 360 - rTick * cos;
            const y2 = 215 - rTick * sin;
            ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#0f766e" stroke-width="${isMajor ? '2' : '1'}" />`;

            // Outer scale text (0 to 180 counter-clockwise)
            if (isMajor) {
              const tx = 360 - 136 * cos;
              const ty = 215 - 136 * sin + 3.5;
              ticks += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" font-family="monospace" font-size="9" font-weight="900" fill="#0369a1" text-anchor="middle">${deg}°</text>`;
            }

            // Inner scale text (180 to 0 counter-clockwise / 0 to 180 clockwise)
            if (isMajor) {
              const tx2 = 360 - 104 * cos;
              const ty2 = 215 - 104 * sin + 3.5;
              ticks += `<text x="${tx2.toFixed(1)}" y="${ty2.toFixed(1)}" font-family="monospace" font-size="9" font-weight="900" fill="#b45309" text-anchor="middle">${180 - deg}°</text>`;
            }
          }
          return ticks;
        })()}

        <!-- Baseline (0° Line) -->
        <line x1="140" y1="215" x2="580" y2="215" stroke="#0f172a" stroke-width="2.5" />

        <!-- 90° Perpendicular Center Guide -->
        <line x1="360" y1="215" x2="360" y2="35" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.5" />

        <!-- Center Crosshair (Origin) -->
        <circle cx="360" cy="215" r="5" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
        <line x1="360" y1="205" x2="360" y2="225" stroke="#ef4444" stroke-width="2" />
        <line x1="350" y1="215" x2="370" y2="215" stroke="#ef4444" stroke-width="2" />

        <!-- Callout 1: Merkez Noktası (Orijin) -->
        <line x1="360" y1="220" x2="360" y2="236" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="2 2" />
        <circle cx="360" cy="236" r="3" fill="#ef4444" />
        <rect x="260" y="235" width="200" height="20" rx="4" fill="#fef2f2" stroke="#ef4444" stroke-width="1" />
        <text x="360" y="249" font-family="system-ui" font-size="8.5" font-weight="900" fill="#991b1b" text-anchor="middle">
          [ 1. MERKEZ NOKTASI (ORİJİN) ]
        </text>

        <!-- Callout 2: Taban Çizgisi (0° Hattı) -->
        <line x1="510" y1="215" x2="510" y2="236" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="2 2" />
        <circle cx="510" cy="236" r="3" fill="#0284c7" />
        <rect x="475" y="235" width="190" height="20" rx="4" fill="#f0f9ff" stroke="#0284c7" stroke-width="1" />
        <text x="570" y="249" font-family="system-ui" font-size="8.5" font-weight="900" fill="#0369a1" text-anchor="middle">
          [ 2. TABAN ÇİZGİSİ (0° HATTI) ]
        </text>

        <!-- Callout 3: Dış Ölçek (0° -> 180° Soldan Sağa) -->
        <path d="M 250 75 Q 230 45 200 35" fill="none" stroke="#0284c7" stroke-width="1.5" />
        <rect x="80" y="10" width="190" height="22" rx="4" fill="#f0f9ff" stroke="#0284c7" stroke-width="1" />
        <text x="175" y="25" font-family="system-ui" font-size="8.5" font-weight="900" fill="#0369a1" text-anchor="middle">
          [ 4. DIŞ ÖLÇEK (0° → 180°) ]
        </text>

        <!-- Callout 4: İç Ölçek (0° -> 180° Sağdan Sola) -->
        <path d="M 470 95 Q 490 55 520 35" fill="none" stroke="#d97706" stroke-width="1.5" />
        <rect x="450" y="10" width="190" height="22" rx="4" fill="#fffbeb" stroke="#d97706" stroke-width="1" />
        <text x="545" y="25" font-family="system-ui" font-size="8.5" font-weight="900" fill="#92400e" text-anchor="middle">
          [ 3. İÇ ÖLÇEK (0° → 180°) ]
        </text>
      </svg>
    </div>
  </div>

  <!-- 4 Kritik Parça Açıklama & Etiketleme Kutuları -->
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 12px;">
    
    <!-- 1. Merkez Noktası -->
    <div style="border: 1.5px solid #fca5a5; border-radius: 10px; padding: 8px 10px; background: #fff5f5; border-left: 4px solid #ef4444;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
        <span style="font-size: 11px; font-weight: 900; color: #991b1b;">1. MERKEZ NOKTASI (ORİJİN)</span>
        <span style="font-size: 8.5px; font-weight: bold; background: #fee2e2; color: #991b1b; padding: 1px 5px; border-radius: 4px;">Köşe Yuvası</span>
      </div>
      <p style="font-size: 10.5px; color: #7f1d1d; margin: 0; line-height: 1.35; font-weight: 600;">
        Açının köşe noktasının tam oturması gereken yerdir. Bu nokta kayarsa açı ölçümü tamamen yanlış çıkar.
      </p>
    </div>

    <!-- 2. Taban Çizgisi -->
    <div style="border: 1.5px solid #bae6fd; border-radius: 10px; padding: 8px 10px; background: #f0f9ff; border-left: 4px solid #0284c7;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
        <span style="font-size: 11px; font-weight: 900; color: #0369a1;">2. TABAN ÇİZGİSİ (0° HATTI)</span>
        <span style="font-size: 8.5px; font-weight: bold; background: #e0f2fe; color: #0369a1; padding: 1px 5px; border-radius: 4px;">Kol Hizası</span>
      </div>
      <p style="font-size: 10.5px; color: #0c4a6e; margin: 0; line-height: 1.35; font-weight: 600;">
        Açının taban koluyla tam çakışması gereken düz çizgidir. Ölçüme her zaman bu çizgideki 0°den başlanır.
      </p>
    </div>

    <!-- 3. İç Ölçek -->
    <div style="border: 1.5px solid #fde68a; border-radius: 10px; padding: 8px 10px; background: #fffbeb; border-left: 4px solid #f59e0b;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
        <span style="font-size: 11px; font-weight: 900; color: #92400e;">3. İÇ ÖLÇEK (SAĞDAN SOLA)</span>
        <span style="font-size: 8.5px; font-weight: bold; background: #fef3c7; color: #92400e; padding: 1px 5px; border-radius: 4px;">Saat Yönü</span>
      </div>
      <p style="font-size: 10.5px; color: #78350f; margin: 0; line-height: 1.35; font-weight: 600;">
        Açının kolu sağ taraftaki 0°ye denk geliyorsa, saat yönünde (0° → 180°) ilerleyen iç dereceler okunur.
      </p>
    </div>

    <!-- 4. Dış Ölçek -->
    <div style="border: 1.5px solid #a7f3d0; border-radius: 10px; padding: 8px 10px; background: #f0fdf4; border-left: 4px solid #10b981;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
        <span style="font-size: 11px; font-weight: 900; color: #065f46;">4. DIŞ ÖLÇEK (SOLDAN SAĞA)</span>
        <span style="font-size: 8.5px; font-weight: bold; background: #d1fae5; color: #065f46; padding: 1px 5px; border-radius: 4px;">Ters Yön</span>
      </div>
      <p style="font-size: 10.5px; color: #064e3b; margin: 0; line-height: 1.35; font-weight: 600;">
        Açının kolu sol taraftaki 0°ye denk geliyorsa, saat yönünün tersinde (0° → 180°) ilerleyen dış dereceler okunur.
      </p>
    </div>

  </div>

  <!-- GÖZLEMCİNİN KRİTİK NOTU (Çift Ölçek Tuzağı Kutusu) -->
  <div style="background: linear-gradient(135deg, #fffbeb, #fef3c7); border: 2px solid #f59e0b; border-radius: 12px; padding: 10px 14px; margin-bottom: 12px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 4px rgba(245,158,11,0.1);">
    <span style="font-size: 26px;">🕵️‍♂️</span>
    <div>
      <div style="font-size: 11.5px; font-weight: 900; color: #b45309; text-transform: uppercase; letter-spacing: 0.5px;">
        💡 GÖZLEMCİNİN KRİTİK NOTU (ÇİFT ÖLÇEK TUZAĞINA DÜŞME!):
      </div>
      <p style="font-size: 11px; color: #78350f; margin: 2px 0 0 0; font-weight: 700; line-height: 1.4;">
        "Ölçtüğün açı dik açıdan (90°) dar mı, geniş mi? Gözünle önce açının türünü tahmin et! Açı dar ise 130° değil, 50° olan ölçeği okumalısın!"
      </p>
    </div>
  </div>

  <!-- Alt Bilgi / Değerlendirme & Puanlama -->
  <div style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 10px; color: #475569; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Değerlendirme:</strong> 4 Kritik Parça Etiketleme (60P) + Çift Ölçek Tuzağı Kontrolü (40P) = Toplam 100 Puan. (SDB1.2 / SB1.1 İletki Anatomisi)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-5-3-3-measuring-stations',
    title: 'Etkinlik: Aşamalı Açı Ölçüm İstasyonları (Uygulama - MAT.5.3.3)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 1,
    createdAt: '2026-09-09T14:00:00Z',
    fileSizeKb: 260,
    tags: ['Etkinlik Kağıdı', 'Açı Ölçüm İstasyonları', 'İletki', 'Dönen Radarlar', 'Tahmin Et Ölç', 'MAT.5.3.3', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <!-- Başlık Banner -->
  <div style="text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #f0fdfa, #ccfbf1); padding: 12px; border-radius: 12px; border: 1px solid #99f6e4;">
    <div style="display: inline-block; background: #0d9488; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 4px;">
      🧭 UYGULAMA &amp; ÖLÇME ATÖLYESİ (SDB1.2 / SB1.1)
    </div>
    <h2 style="color: #115e59; font-size: 17px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
      ETKİNLİK: "AŞAMALI AÇI ÖLÇÜM İSTASYONLARI" (MAT.5.3.3)
    </h2>
    <p style="color: #334155; font-size: 11px; margin: 4px 0 0 0; font-weight: 600;">
      Farklı zorluk seviyelerinde 3 istasyonda açıları iletki ile ölç, dönen radarları hizala ve tahminlerini gerçek ölçümlerle karşılaştır!
    </p>
  </div>

  <!-- İSTASYON A: STANDART YATAY AÇILAR (Tabanı Düz Durumlar) -->
  <div style="border: 2px solid #0284c7; border-radius: 12px; padding: 10px; background: #ffffff; margin-bottom: 12px;">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #e0f2fe; padding-bottom: 4px; margin-bottom: 8px;">
      <span style="font-weight: 900; color: #0369a1; font-size: 12px;">
        📍 İSTASYON A: STANDART YATAY AÇILAR (Tabanı Düz Durumlar)
      </span>
      <span style="font-size: 9.5px; font-weight: bold; background: #f0f9ff; color: #0284c7; padding: 2px 6px; border-radius: 4px; border: 1px solid #bae6fd;">
        35 Puan
      </span>
    </div>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
      <!-- Açı 1 -->
      <div style="border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px; background: #f8fafc; text-align: center;">
        <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 900; color: #0369a1; margin-bottom: 4px;">
          <span>AÇI 1</span>
          <span style="color: #64748b;">[İletkiyi Koy]</span>
        </div>
        <div style="height: 100px; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 6px; position: relative; overflow: hidden;">
          <svg viewBox="0 0 180 100" width="100%" height="100%">
            <!-- Vertex O1 (30, 80) -->
            <circle cx="30" cy="80" r="4" fill="#0284c7" />
            <text x="20" y="85" font-family="system-ui" font-size="9" font-weight="bold" fill="#0369a1">O₁</text>
            <!-- Taban Kolu -->
            <line x1="30" y1="80" x2="165" y2="80" stroke="#334155" stroke-width="2.5" />
            <polygon points="160,76 170,80 160,84" fill="#334155" />
            <!-- 45° Kolu -->
            <line x1="30" y1="80" x2="105" y2="5" stroke="#0284c7" stroke-width="2.5" />
            <polygon points="100,2 110,5 108,16" fill="#0284c7" />
            <!-- Açı Yayı -->
            <path d="M 65 80 A 35 35 0 0 0 55 55" fill="none" stroke="#0284c7" stroke-width="1.8" />
            <text x="70" y="65" font-family="monospace" font-size="8.5" font-weight="bold" fill="#0369a1">?</text>
          </svg>
        </div>
        <div style="margin-top: 6px; font-size: 10px; font-weight: 700; color: #1e293b;">
          Ölçülen Değer: <span style="display: inline-block; min-width: 55px; border-bottom: 1.5px solid #0284c7; color: #0369a1; font-weight: 900;">( ..........° )</span>
        </div>
      </div>

      <!-- Açı 2 -->
      <div style="border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px; background: #f8fafc; text-align: center;">
        <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 900; color: #0f766e; margin-bottom: 4px;">
          <span>AÇI 2</span>
          <span style="color: #64748b;">[İletkiyi Koy]</span>
        </div>
        <div style="height: 100px; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 6px; position: relative; overflow: hidden;">
          <svg viewBox="0 0 180 100" width="100%" height="100%">
            <!-- Vertex O2 (40, 80) -->
            <circle cx="40" cy="80" r="4" fill="#0d9488" />
            <text x="25" y="85" font-family="system-ui" font-size="9" font-weight="bold" fill="#0f766e">O₂</text>
            <!-- Taban Kolu -->
            <line x1="40" y1="80" x2="165" y2="80" stroke="#334155" stroke-width="2.5" />
            <polygon points="160,76 170,80 160,84" fill="#334155" />
            <!-- 90° Dikey Kol -->
            <line x1="40" y1="80" x2="40" y2="15" stroke="#0d9488" stroke-width="2.5" />
            <polygon points="36,20 40,10 44,20" fill="#0d9488" />
            <!-- Diklik Sembolü Kutusu (⊾) -->
            <rect x="40" y="65" width="15" height="15" fill="none" stroke="#0d9488" stroke-width="1.8" />
            <circle cx="47.5" cy="72.5" r="2" fill="#0d9488" />
          </svg>
        </div>
        <div style="margin-top: 6px; font-size: 10px; font-weight: 700; color: #1e293b;">
          Ölçülen Değer: <span style="display: inline-block; min-width: 55px; border-bottom: 1.5px solid #0d9488; color: #0f766e; font-weight: 900;">( ..........° )</span>
        </div>
      </div>

      <!-- Açı 3 -->
      <div style="border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px; background: #f8fafc; text-align: center;">
        <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 900; color: #b45309; margin-bottom: 4px;">
          <span>AÇI 3</span>
          <span style="color: #64748b;">[Çift Ölçek Ayrımı]</span>
        </div>
        <div style="height: 100px; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 6px; position: relative; overflow: hidden;">
          <svg viewBox="0 0 180 100" width="100%" height="100%">
            <!-- Vertex O3 (120, 80) -->
            <circle cx="120" cy="80" r="4" fill="#d97706" />
            <text x="130" y="85" font-family="system-ui" font-size="9" font-weight="bold" fill="#b45309">O₃</text>
            <!-- Taban Kolu (Sağa) -->
            <line x1="120" y1="80" x2="175" y2="80" stroke="#334155" stroke-width="2.5" />
            <polygon points="170,76 178,80 170,84" fill="#334155" />
            <!-- 135° Kolu (Sola Yukarı) -->
            <line x1="120" y1="80" x2="45" y2="15" stroke="#d97706" stroke-width="2.5" />
            <polygon points="43,23 40,10 52,14" fill="#d97706" />
            <!-- Açı Yayı -->
            <path d="M 155 80 A 35 35 0 0 0 95 55" fill="none" stroke="#d97706" stroke-width="1.8" />
            <text x="125" y="55" font-family="monospace" font-size="8.5" font-weight="bold" fill="#b45309">?</text>
          </svg>
        </div>
        <div style="margin-top: 6px; font-size: 10px; font-weight: 700; color: #1e293b;">
          Ölçülen Değer: <span style="display: inline-block; min-width: 55px; border-bottom: 1.5px solid #d97706; color: #b45309; font-weight: 900;">( ..........° )</span>
        </div>
      </div>
    </div>
  </div>

  <!-- İSTASYON B: DÖNEN RADARLAR (Eğik ve Baş Aşağı Açılar) -->
  <div style="border: 2px solid #7c3aed; border-radius: 12px; padding: 10px; background: #ffffff; margin-bottom: 12px;">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ede9fe; padding-bottom: 4px; margin-bottom: 6px;">
      <span style="font-weight: 900; color: #6d28d9; font-size: 12px;">
        🔄 İSTASYON B: DÖNEN RADARLAR (Eğik ve Baş Aşağı Açılar)
      </span>
      <span style="font-size: 9.5px; font-weight: bold; background: #f5f3ff; color: #7c3aed; padding: 2px 6px; border-radius: 4px; border: 1px solid #ddd6fe;">
        35 Puan
      </span>
    </div>

    <!-- Kritik Yönerge -->
    <div style="background: #faf5ff; border: 1px solid #c084fc; border-radius: 8px; padding: 6px 10px; margin-bottom: 8px; font-size: 10px; color: #581c87; font-weight: 700;">
      🧭 <strong>Yönerge:</strong> "Açıların tabanı yatay değil! İletkini veya kâğıdını çevirerek iletkinin taban çizgisini açının koluna tam hizala."
    </div>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
      <!-- Açı 4 -->
      <div style="border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px; background: #f8fafc; text-align: center;">
        <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 900; color: #6d28d9; margin-bottom: 4px;">
          <span>AÇI 4: Sağa Eğik Radar</span>
          <span style="color: #7c3aed;">İletkiyi Döndür</span>
        </div>
        <div style="height: 120px; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 6px; position: relative; overflow: hidden;">
          <svg viewBox="0 0 240 120" width="100%" height="100%">
            <!-- Vertex O4 (60, 95) -->
            <circle cx="60" cy="95" r="4" fill="#7c3aed" />
            <text x="45" y="105" font-family="system-ui" font-size="9" font-weight="bold" fill="#6d28d9">O₄</text>
            <!-- Eğik Kol 1 (30° eğimle sağa yukarı) -->
            <line x1="60" y1="95" x2="190" y2="40" stroke="#334155" stroke-width="2.5" />
            <polygon points="183,37 194,38 188,48" fill="#334155" />
            <text x="195" y="55" font-family="monospace" font-size="8" fill="#64748b">Kol 1</text>
            <!-- Kol 2 (90° dikey yukarı) -->
            <line x1="60" y1="95" x2="135" y2="10" stroke="#7c3aed" stroke-width="2.5" />
            <polygon points="127,10 137,7 137,18" fill="#7c3aed" />
            <text x="145" y="20" font-family="monospace" font-size="8" fill="#7c3aed">Kol 2</text>
            <!-- Açı Yayı -->
            <path d="M 95 80 A 40 40 0 0 0 78 58" fill="none" stroke="#7c3aed" stroke-width="1.8" />
            <text x="95" y="65" font-family="monospace" font-size="9" font-weight="bold" fill="#6d28d9">?</text>
          </svg>
        </div>
        <div style="margin-top: 6px; font-size: 10px; font-weight: 700; color: #1e293b;">
          Ölçülen Değer: <span style="display: inline-block; min-width: 55px; border-bottom: 1.5px solid #7c3aed; color: #6d28d9; font-weight: 900;">( ..........° )</span>
        </div>
      </div>

      <!-- Açı 5 -->
      <div style="border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px; background: #f8fafc; text-align: center;">
        <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 900; color: #e11d48; margin-bottom: 4px;">
          <span>AÇI 5: Baş Aşağı Radar</span>
          <span style="color: #e11d48;">Ters İletki</span>
        </div>
        <div style="height: 120px; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 6px; position: relative; overflow: hidden;">
          <svg viewBox="0 0 240 120" width="100%" height="100%">
            <!-- Vertex O5 (120, 25) -->
            <circle cx="120" cy="25" r="4" fill="#e11d48" />
            <text x="120" y="15" font-family="system-ui" font-size="9" font-weight="bold" fill="#be123c" text-anchor="middle">O₅ (Tepe)</text>
            <!-- Sol Aşağı Kol -->
            <line x1="120" y1="25" x2="45" y2="100" stroke="#e11d48" stroke-width="2.5" />
            <polygon points="43,90 40,105 53,100" fill="#e11d48" />
            <!-- Sağ Aşağı Kol -->
            <line x1="120" y1="25" x2="195" y2="100" stroke="#334155" stroke-width="2.5" />
            <polygon points="187,100 200,105 197,90" fill="#334155" />
            <!-- Açı Yayı -->
            <path d="M 90 55 A 40 40 0 0 0 150 55" fill="none" stroke="#e11d48" stroke-width="1.8" />
            <text x="120" y="65" font-family="monospace" font-size="9" font-weight="bold" fill="#e11d48" text-anchor="middle">?</text>
          </svg>
        </div>
        <div style="margin-top: 6px; font-size: 10px; font-weight: 700; color: #1e293b;">
          Ölçülen Değer: <span style="display: inline-block; min-width: 55px; border-bottom: 1.5px solid #e11d48; color: #be123c; font-weight: 900;">( ..........° )</span>
        </div>
      </div>
    </div>
  </div>

  <!-- İSTASYON C: TAHMİN ET ➔ ÖLÇ ➔ KARŞILAŞTIR TABLOSU -->
  <div style="border: 2px solid #059669; border-radius: 12px; padding: 10px; background: #ffffff; margin-bottom: 12px;">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #d1fae5; padding-bottom: 4px; margin-bottom: 8px;">
      <span style="font-weight: 900; color: #047857; font-size: 12px;">
        📊 İSTASYON C: "TAHMİN ET ➔ ÖLÇ ➔ KARŞILAŞTIR" TABLOSU
      </span>
      <span style="font-size: 9.5px; font-weight: bold; background: #ecfdf5; color: #059669; padding: 2px 6px; border-radius: 4px; border: 1px solid #a7f3d0;">
        30 Puan
      </span>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 10px; text-align: center;">
      <thead>
        <tr style="background: #f0fdf4; color: #065f46; border-bottom: 2px solid #a7f3d0;">
          <th style="padding: 6px 8px; text-align: left; width: 28%;">Gerçek Yaşam Şekli</th>
          <th style="padding: 6px 8px; width: 32%;">1. Göz Kararı Tahminim<br/><span style="font-weight: normal; font-size: 8.5px;">(Dar / Dik / Geniş &amp; Derece)</span></th>
          <th style="padding: 6px 8px; width: 20%;">2. İletki ile Gerçek Ölçüm</th>
          <th style="padding: 6px 8px; width: 20%;">3. Fark<br/><span style="font-weight: normal; font-size: 8.5px;">(Hata Payı: |Tahmin - Gerçek|)</span></th>
        </tr>
      </thead>
      <tbody>
        <!-- Satır 1: Açık Makas -->
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px; text-align: left; font-weight: 700; color: #1e293b;">
            ✂️ <strong>Açık Makas Açısı</strong><br/>
            <span style="font-size: 8.5px; color: #64748b;">(Kesici ağız açıklığı)</span>
          </td>
          <td style="padding: 8px; color: #047857; font-weight: 700;">
            [ Türü: ................ / Tahminim: .......° ]
          </td>
          <td style="padding: 8px; font-weight: 900; color: #0f766e; background: #f8fafc;">
            ( .........° )
          </td>
          <td style="padding: 8px; font-weight: 900; color: #64748b;">
            | ... - ... | = .....°
          </td>
        </tr>

        <!-- Satır 2: Saat 15:00 -->
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px; text-align: left; font-weight: 700; color: #1e293b;">
            🕒 <strong>Saat 15:00 Açısı</strong><br/>
            <span style="font-size: 8.5px; color: #64748b;">(Akrep ile Yelkovan)</span>
          </td>
          <td style="padding: 8px; color: #047857; font-weight: 700;">
            [ Türü: ................ / Tahminim: .......° ]
          </td>
          <td style="padding: 8px; font-weight: 900; color: #0f766e; background: #f8fafc;">
            ( .........° )
          </td>
          <td style="padding: 8px; font-weight: 900; color: #64748b;">
            | ... - ... | = .....°
          </td>
        </tr>

        <!-- Satır 3: Çatı Eğimi -->
        <tr>
          <td style="padding: 8px; text-align: left; font-weight: 700; color: #1e293b;">
            🏠 <strong>Çatı Eğimi Açısı</strong><br/>
            <span style="font-size: 8.5px; color: #64748b;">(Ev çatı makası açısı)</span>
          </td>
          <td style="padding: 8px; color: #047857; font-weight: 700;">
            [ Türü: ................ / Tahminim: .......° ]
          </td>
          <td style="padding: 8px; font-weight: 900; color: #0f766e; background: #f8fafc;">
            ( .........° )
          </td>
          <td style="padding: 8px; font-weight: 900; color: #64748b;">
            | ... - ... | = .....°
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Alt Bilgi / Değerlendirme & Puanlama -->
  <div style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 10px; color: #475569; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Değerlendirme:</strong> İstasyon A (35P) + İstasyon B (35P) + İstasyon C (30P) = Toplam 100 Puan. (SDB1.2 / SB1.1 Maarif Geometri Atölyesi)</span>
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
