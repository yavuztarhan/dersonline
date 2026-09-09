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
  | 'heptagon' // Düzgün Yedigen
  | 'octagon' // Düzgün Sekizgen
  | 'parallelogram' // Paralelkenar
  | 'trapezoid' // Yamuk
  | 'rhombus' // Eşkenar Dörtgen
  // 3 Boyutlu Cisimlerin 2D Görünümleri
  | 'cylinder' // Silindir
  | 'cube' // Küp
  | 'rectangular_prism' // Dikdörtgenler Prizması
  | 'cone' // Koni
  | 'square_prism' // Kare Prizma
  | 'square_pyramid' // Kare Piramit
  | 'triangular_pyramid' // Üçgen Piramit
  | 'rectangular_pyramid' // Dikdörtgen Piramit
  | 'pentagonal_pyramid' // Beşgen Piramit
  | 'hexagonal_pyramid'; // Altıgen Piramit

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
  },
  {
    id: 'file-activity-mat-5-3-3-angle-construction',
    title: 'Etkinlik: "Rotanı Kendin Çiz" (İletki ile Açı İnşası - MAT.5.3.3)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 1,
    createdAt: '2026-09-09T15:00:00Z',
    fileSizeKb: 240,
    tags: ['Etkinlik Kağıdı', 'Rotanı Kendin Çiz', 'Açı İnşası', 'İletki', 'Dar Açı', 'Geniş Açı', 'MAT.5.3.3', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <!-- Başlık Banner -->
  <div style="text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #f0fdfa, #ccfbf1); padding: 12px; border-radius: 12px; border: 1px solid #99f6e4;">
    <div style="display: inline-block; background: #0d9488; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 4px;">
      🧭 GEOMETRİK İNŞA İSTASYONU (MAT.5.3.3)
    </div>
    <h2 style="color: #115e59; font-size: 17px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
      ETKİNLİK: "ROTANI KENDİN ÇİZ" (İletki ile Açı İnşası)
    </h2>
    <p style="color: #334155; font-size: 11px; margin: 4px 0 0 0; font-weight: 600;">
      Ölçülü iletkin ve cetvelini kullanarak verilen başlangıç ışınları üzerinde sıfırdan 50° ve 140°'lik açıları inşa et!
    </p>
  </div>

  <!-- Açı İnşa Kılavuzu & İpuçları Kutusu -->
  <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 10px; padding: 8px 12px; margin-bottom: 12px; font-size: 10.5px; color: #92400e; line-height: 1.45;">
    <strong>📐 Adım Adım Açı Çizim Rehberi:</strong><br/>
    1. İletkinin <strong>merkez noktasını (orijin)</strong> açının köşe noktasına ($A$ veya $K$) tam oturt.<br/>
    2. Taban kolunu iletkinin <strong>0° çizgisiyle</strong> tam çakıştır.<br/>
    3. Hedef dereceyi ($50^\circ$ veya $140^\circ$) iletkinin doğru ölçeğinden bularak milimetrik kâğıda bir nokta koy.<br/>
    4. Cetvelinle köşe noktası ile işaretlediğin noktayı birleştirerek yeni ışını çiz ve açının yayını belirle.
  </div>

  <!-- Görev Alanları Grid (2 Sütun) -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
    
    <!-- GÖREV 1: 50° DAR AÇI İNŞASI -->
    <div style="border: 2px solid #0284c7; border-radius: 12px; padding: 12px; background: #ffffff;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #e0f2fe; padding-bottom: 6px; margin-bottom: 8px;">
        <span style="font-weight: 900; color: #0369a1; font-size: 12px;">
          📍 GÖREV 1: 50° Dar Açı İnşası
        </span>
        <span style="font-size: 9.5px; font-weight: bold; background: #f0f9ff; color: #0284c7; padding: 2px 6px; border-radius: 4px; border: 1px solid #bae6fd;">
          50 Puan
        </span>
      </div>
      
      <p style="font-size: 11px; color: #1e293b; line-height: 1.4; margin: 0 0 8px 0; font-weight: 600;">
        <strong>Yönerge:</strong> Verilen <code>[AB</code> ışınının <code>A</code> noktasını köşe kabul ederek iletkinle <strong>tam 50°'lik</strong> bir dar açı çiz ve <code>[AC</code> ışını ile birleştir.
      </p>

      <!-- Milimetrik Çizim Alanı (Görev 1) -->
      <div style="border: 1.5px dashed #cbd5e1; border-radius: 8px; height: 180px; background: #f8fafc; position: relative; overflow: hidden;">
        <svg viewBox="0 0 320 180" width="100%" height="100%" style="display: block;">
          <defs>
            <pattern id="mm_grid_g1" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#e2e8f0" stroke-width="0.8" />
            </pattern>
          </defs>
          <rect width="320" height="180" fill="url(#mm_grid_g1)" />
          
          <!-- Başlangıç [AB Işını -->
          <!-- Vertex A (50, 140) -->
          <line x1="50" y1="140" x2="270" y2="140" stroke="#0f172a" stroke-width="2.5" />
          <polygon points="265,136 275,140 265,144" fill="#0f172a" />
          
          <circle cx="50" cy="140" r="4.5" fill="#0284c7" />
          <text x="36" y="145" text-anchor="end" font-family="system-ui" font-size="12" font-weight="900" fill="#0369a1">[A</text>
          
          <circle cx="210" cy="140" r="3.5" fill="#0f172a" />
          <text x="210" y="156" font-family="system-ui" font-size="11" font-weight="800" fill="#0f172a" text-anchor="middle">B</text>

          <!-- Çizim Kılavuz İpucu -->
          <text x="160" y="30" font-family="system-ui" font-size="10" font-weight="700" fill="#94a3b8" text-anchor="middle">
            [ İletkini A noktasına yerleştirip 50°'de C noktasını işaretle ]
          </text>
        </svg>
      </div>

      <div style="margin-top: 8px; font-size: 10px; color: #475569; font-weight: 600;">
        💡 <em>Açı Türü: <strong>Dar Açı</strong> (0° &lt; s(BAC) = 50° &lt; 90°)</em>
      </div>
    </div>

    <!-- GÖREV 2: 140° GENİŞ AÇI İNŞASI -->
    <div style="border: 2px solid #7c3aed; border-radius: 12px; padding: 12px; background: #ffffff;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ede9fe; padding-bottom: 6px; margin-bottom: 8px;">
        <span style="font-weight: 900; color: #6d28d9; font-size: 12px;">
          📍 GÖREV 2: 140° Geniş Açı İnşası
        </span>
        <span style="font-size: 9.5px; font-weight: bold; background: #f5f3ff; color: #7c3aed; padding: 2px 6px; border-radius: 4px; border: 1px solid #ddd6fe;">
          50 Puan
        </span>
      </div>
      
      <p style="font-size: 11px; color: #1e293b; line-height: 1.4; margin: 0 0 8px 0; font-weight: 600;">
        <strong>Yönerge:</strong> Verilen <code>[KL</code> ışınını kullanarak <strong>tam 140°'lik</strong> bir geniş açı çiz. Açının yayını renkli kalemle belirle.
      </p>

      <!-- Milimetrik Çizim Alanı (Görev 2) -->
      <div style="border: 1.5px dashed #cbd5e1; border-radius: 8px; height: 180px; background: #f8fafc; position: relative; overflow: hidden;">
        <svg viewBox="0 0 320 180" width="100%" height="100%" style="display: block;">
          <defs>
            <pattern id="mm_grid_g2" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#e2e8f0" stroke-width="0.8" />
            </pattern>
          </defs>
          <rect width="320" height="180" fill="url(#mm_grid_g2)" />
          
          <!-- Başlangıç [KL Işını -->
          <!-- Vertex K (180, 140) sağa doğru L veya (50, 140) -->
          <line x1="50" y1="140" x2="270" y2="140" stroke="#0f172a" stroke-width="2.5" />
          <polygon points="265,136 275,140 265,144" fill="#0f172a" />
          
          <circle cx="50" cy="140" r="4.5" fill="#7c3aed" />
          <text x="36" y="145" text-anchor="end" font-family="system-ui" font-size="12" font-weight="900" fill="#6d28d9">[K</text>
          
          <circle cx="210" cy="140" r="3.5" fill="#0f172a" />
          <text x="210" y="156" font-family="system-ui" font-size="11" font-weight="800" fill="#0f172a" text-anchor="middle">L</text>

          <!-- Çizim Kılavuz İpucu -->
          <text x="160" y="30" font-family="system-ui" font-size="10" font-weight="700" fill="#94a3b8" text-anchor="middle">
            [ İletkini K noktasına yerleştirip 140°'de M noktasını işaretle ]
          </text>
        </svg>
      </div>

      <div style="margin-top: 8px; font-size: 10px; color: #475569; font-weight: 600;">
        💡 <em>Açı Türü: <strong>Geniş Açı</strong> (90° &lt; s(LKM) = 140° &lt; 180°)</em>
      </div>
    </div>

  </div>

  <!-- Kendini Değerlendir & Kontrol Listesi -->
  <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; margin-bottom: 8px;">
    <div style="font-size: 11px; font-weight: 900; color: #0f766e; margin-bottom: 6px;">
      ✅ GEOMETRİK ÇIKARIM &amp; KENDİNİ DEĞERLENDİRME LİSTESİ:
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 10px; color: #334155;">
      <div>[ ] 1. İletkinin merkezini köşe noktasına ($A$ ve $K$) tam oturttum.</div>
      <div>[ ] 2. Taban çizgisini 0° çizgisi ile tam çakıştırdım.</div>
      <div>[ ] 3. 50° dar açımın dik açıdan (90°) daha dar olduğunu kontrol ettim.</div>
      <div>[ ] 4. 140° geniş açımın dik açıdan (90°) daha geniş olduğunu kontrol ettim.</div>
    </div>
  </div>

  <!-- Alt Bilgi / Puanlama -->
  <div style="padding: 8px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 10px; color: #166534; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Görev 1 (50P) + Görev 2 (50P) = 100 Puan. (SDB1.2 / SB1.1 Maarif Geometri Atölyesi)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-5-3-3-error-detective',
    title: 'Etkinlik: "Hata Dedektifi" ve Öz Değerlendirme (MAT.5.3.3)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 1,
    createdAt: '2026-09-09T18:00:00Z',
    fileSizeKb: 260,
    tags: ['Etkinlik Kağıdı', 'Hata Dedektifi', 'Öz Değerlendirme', 'İletki', 'Ölçme Hataları', 'Çift Ölçek Tuzağı', 'MAT.5.3.3', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <!-- Başlık Banner -->
  <div style="text-align: center; border-bottom: 2px solid #ef4444; padding-bottom: 8px; margin-bottom: 10px; background: linear-gradient(135deg, #fef2f2, #fee2e2); padding: 10px; border-radius: 12px; border: 1px solid #fca5a5;">
    <div style="display: inline-block; background: #dc2626; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      🕵️‍♂️ ELEŞTİREL DÜŞÜNME &amp; HATA ANALİZİ (SDB1.2 / SB1.1)
    </div>
    <h2 style="color: #991b1b; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
      ETKİNLİK: "HATA DEDEKTİFİ" VE ÖZ DEĞERLENDİRME
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      Hatalı ölçüm görselini incele, 2 büyük ölçüm hatasını tespit et, doğrusunu yaz ve öz değerlendirme kontrolünü tamamla!
    </p>
  </div>

  <!-- BÖLÜM 1: DEDEKTİFLİK GÖREVİ (HATALI ÇİZİMİ BUL) -->
  <div style="border: 2px solid #ef4444; border-radius: 12px; padding: 12px; background: #ffffff; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #fee2e2; padding-bottom: 6px; margin-bottom: 8px;">
      <span style="font-weight: 900; color: #b91c1c; font-size: 12px; display: flex; align-items: center; gap: 4px;">
        🔍 DEDEKTİFLİK GÖREVİ: "HATALI ÇİZİMİ BUL"
      </span>
      <span style="font-size: 9.5px; font-weight: bold; background: #fef2f2; color: #dc2626; padding: 2px 6px; border-radius: 4px; border: 1px solid #fecaca;">
        50 Puan
      </span>
    </div>

    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 6px 10px; margin-bottom: 8px; font-size: 10.5px; color: #92400e; font-weight: 600;">
      🗣️ <strong>Öğrenci Can:</strong> <em>"İletkiyi kâğıdın üzerine koydum, ibrenin kolu 140 çizgisini gösteriyordu. Bu yüzden açının ölçüsüne 140° yazdım."</em>
    </div>

    <!-- Hatalı Ölçüm SVG Görseli (İpuçsuz / Öğrencinin İncelemesi İçin Net Şema) -->
    <div style="border: 1.5px dashed #cbd5e1; border-radius: 8px; height: 210px; background: #f8fafc; position: relative; overflow: hidden; margin-bottom: 10px;">
      <svg viewBox="0 0 520 210" width="100%" height="100%" style="display: block;">
        <defs>
          <pattern id="mm_grid_detective" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#e2e8f0" stroke-width="0.8" />
          </pattern>
        </defs>
        <rect width="520" height="210" fill="url(#mm_grid_detective)" />

        <!-- 40°'lik Gerçek Dar Açı (Tepe Noktası O=(130, 180)) -->
        <!-- Taban Kolu OA -->
        <line x1="130" y1="180" x2="440" y2="180" stroke="#0f172a" stroke-width="3" />
        <polygon points="435,176 445,180 435,184" fill="#0f172a" />
        <circle cx="380" cy="180" r="3.5" fill="#0f172a" />
        <text x="380" y="196" font-family="system-ui" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">A</text>

        <!-- 40° Eğik Kol OB (Tepe (130, 180), len=260 -> dx=199, dy=-167 -> (329, 13)) -->
        <line x1="130" y1="180" x2="330" y2="13" stroke="#0f172a" stroke-width="3" />
        <polygon points="323,12 334,10 332,22" fill="#0f172a" />
        <circle cx="280" cy="54" r="3.5" fill="#0f172a" />
        <text x="294" y="52" font-family="system-ui" font-size="11" font-weight="bold" fill="#0f172a">B</text>

        <!-- Tepe Noktası O (130, 180) -->
        <circle cx="130" cy="180" r="5" fill="#0284c7" />
        <text x="110" y="185" text-anchor="end" font-family="system-ui" font-size="12" font-weight="900" fill="#0369a1">[O</text>
        <text x="130" y="200" font-family="system-ui" font-size="9.5" font-weight="800" fill="#0284c7" text-anchor="middle">Açının Köşesi (O)</text>

        <!-- YERLEŞTİRİLMİŞ İLETKİ (Merkez (130, 140)) -->
        <g opacity="0.9">
          <!-- İletki Gövdesi -->
          <path d="M 30 140 A 100 100 0 0 1 230 140 Z" fill="#ecfeff" stroke="#0891b2" stroke-width="1.8" />
          <line x1="30" y1="140" x2="230" y2="140" stroke="#0891b2" stroke-width="1.5" />
          
          <!-- İletki Merkez İşareti (130, 140) -->
          <circle cx="130" cy="140" r="3.5" fill="#0891b2" />
          <line x1="124" y1="140" x2="136" y2="140" stroke="#0891b2" stroke-width="1.2" />
          <line x1="130" y1="134" x2="130" y2="146" stroke="#0891b2" stroke-width="1.2" />
          <text x="120" y="132" font-family="system-ui" font-size="8.5" font-weight="700" fill="#0891b2" text-anchor="end">İletki Merkez Noktası</text>

          <!-- İletki Ölçek Çizgileri ve Rakamları -->
          <path d="M 50 140 A 80 80 0 0 1 210 140" fill="none" stroke="#0891b2" stroke-width="0.8" />
          <text x="215" y="136" font-family="system-ui" font-size="7.5" font-weight="bold" fill="#0891b2">0° / 180°</text>
          <text x="130" y="55" font-family="system-ui" font-size="8" font-weight="bold" fill="#0891b2" text-anchor="middle">90°</text>
          <text x="45" y="136" font-family="system-ui" font-size="7.5" font-weight="bold" fill="#0891b2">180° / 0°</text>

          <!-- İletki Üzerindeki 140°/40° Hattı -->
          <circle cx="69" cy="76" r="6" fill="none" stroke="#0891b2" stroke-width="1.5" />
          <text x="69" y="66" font-family="system-ui" font-size="8.5" font-weight="bold" fill="#0891b2" text-anchor="middle">140° / 40°</text>
        </g>

        <!-- Can'ın Ölçüm Notu Kutusu (Sağ Üst) -->
        <rect x="345" y="25" width="165" height="55" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2" />
        <text x="355" y="42" font-family="system-ui" font-size="9.5" font-weight="900" fill="#1e293b">📋 ÖĞRENCİ ÖLÇÜMÜ:</text>
        <text x="355" y="58" font-family="system-ui" font-size="9" font-weight="600" fill="#334155">Okunan Değer: <strong>s(AOB) = 140°</strong></text>
        <text x="355" y="70" font-family="system-ui" font-size="8" font-weight="600" fill="#64748b">Durum: Dedektif incelemesi bekleniyor</text>
      </svg>
    </div>

    <!-- Soru & Boş Tespit Yazma Alanları -->
    <p style="font-size: 11px; color: #0f172a; font-weight: 800; margin: 0 0 8px 0;">
      ❓ <strong>Dedektiflik Sorusu:</strong> Yukarıdaki çizimi ve iletkinin konumunu dikkatle inceleyiniz. Can'ın yaptığı <strong>2 büyük hatayı</strong> tespit edip doğrularını yazınız.
    </p>

    <div style="space-y: 8px; font-size: 11px;">
      <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; margin-bottom: 8px;">
        <div style="font-weight: 900; color: #b91c1c; margin-bottom: 4px;">🚩 1. HATA (Merkez Konumu ile İlgili Hata):</div>
        <div style="font-size: 10px; color: #334155; margin-bottom: 3px;">Hata: ......................................................................................................................................................................................................................</div>
        <div style="font-size: 10px; color: #0f766e;">Doğrusu: .................................................................................................................................................................................................................</div>
      </div>

      <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px 10px;">
        <div style="font-weight: 900; color: #b91c1c; margin-bottom: 4px;">🚩 2. HATA (Ölçek Okuma ile İlgili Hata):</div>
        <div style="font-size: 10px; color: #334155; margin-bottom: 3px;">Hata: ......................................................................................................................................................................................................................</div>
        <div style="font-size: 10px; color: #0f766e;">Doğrusu: .................................................................................................................................................................................................................</div>
      </div>
    </div>
  </div>

  <!-- BÖLÜM 2: ÖZ DEĞERLENDİRME TABLOSU (KENDİNİ DEĞERLENDİR) -->
  <div style="border: 2px solid #0d9488; border-radius: 12px; padding: 12px; background: #ffffff; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ccfbf1; padding-bottom: 6px; margin-bottom: 8px;">
      <span style="font-weight: 900; color: #0f766e; font-size: 12px; display: flex; align-items: center; gap: 4px;">
        ✅ KENDİNİ DEĞERLENDİR (ÖZ DEĞERLENDİRME ÖLÇEĞİ)
      </span>
      <span style="font-size: 9.5px; font-weight: bold; background: #f0fdfa; color: #0d9488; padding: 2px 6px; border-radius: 4px; border: 1px solid #99f6e4;">
        50 Puan
      </span>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 10.5px; text-align: left;">
      <thead>
        <tr style="background: #f0fdfa; color: #115e59; font-weight: 900; border-bottom: 1.5px solid #99f6e4;">
          <th style="padding: 6px 8px; border: 1px solid #ccfbf1;">Ölçme &amp; Çizim Becerisi Kriteri</th>
          <th style="padding: 6px 4px; border: 1px solid #ccfbf1; text-align: center; width: 85px;">Geliştirilmeli (1)</th>
          <th style="padding: 6px 4px; border: 1px solid #ccfbf1; text-align: center; width: 75px;">Başarılı (2)</th>
          <th style="padding: 6px 4px; border: 1px solid #ccfbf1; text-align: center; width: 75px;">Mükemmel (3)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">
            1. İletkinin merkez noktasını açının köşesine tam oturturum.
          </td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: center; color: #64748b;">[ &nbsp; ]</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: center; color: #64748b;">[ &nbsp; ]</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: center; color: #64748b;">[ &nbsp; ]</td>
        </tr>
        <tr style="background: #f8fafc;">
          <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">
            2. Taban çizgisini (0° hattını) açının bir koluyla tam çakıştırırım.
          </td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: center; color: #64748b;">[ &nbsp; ]</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: center; color: #64748b;">[ &nbsp; ]</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: center; color: #64748b;">[ &nbsp; ]</td>
        </tr>
        <tr>
          <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">
            3. Açının dar/geniş durumuna göre doğru ölçeği (iç/dış) seçip okurum.
          </td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: center; color: #64748b;">[ &nbsp; ]</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: center; color: #64748b;">[ &nbsp; ]</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: center; color: #64748b;">[ &nbsp; ]</td>
        </tr>
        <tr style="background: #f8fafc;">
          <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">
            4. İletki ile verilen derecede açıyı sıfırdan hatasız inşa edebilirim.
          </td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: center; color: #64748b;">[ &nbsp; ]</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: center; color: #64748b;">[ &nbsp; ]</td>
          <td style="padding: 6px 4px; border: 1px solid #e2e8f0; text-align: center; color: #64748b;">[ &nbsp; ]</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 8px; font-size: 10px; color: #0f766e; font-weight: 600;">
      ✍️ <strong>Öz Çıkarımım:</strong> Açı ölçerken en çok dikkat edeceğim kural: .....................................................................................
    </div>
  </div>

  <!-- Alt Bilgi / Puanlama -->
  <div style="padding: 8px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 10px; color: #166534; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Dedektiflik Görevi (50P) + Öz Değerlendirme (50P) = 100 Puan. (SDB1.2 / SB1.1 Maarif Modeli)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-5-3-4-lines-relations',
    title: 'Etkinlik: "Doğruların Birbirine Göre Durumları" (Gözlem ve Sınıflandırma - MAT.5.3.4)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.5.3.4',
    outcomeTitle: 'Düzlemde İki veya Üç Doğrunun Durumuna Bağlı Olarak Oluşabilecek Açılara Dair Çıkarım Yapabilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 1,
    createdAt: '2026-09-10T08:00:00Z',
    fileSizeKb: 275,
    tags: ['Etkinlik Kağıdı', 'Doğruların Durumları', 'Kesişen Doğrular', 'Dik Doğrular', 'Paralel Doğrular', 'Kesen Doğru', 'MAT.5.3.4', 'Gözlem ve Sınıflandırma', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <!-- Başlık Banner -->
  <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #eff6ff, #dbeafe); padding: 10px; border-radius: 12px; border: 1px solid #bfdbfe;">
    <div style="display: inline-block; background: #2563eb; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      🔍 GÖZLEM &amp; SINIFLANDIRMA (4. HAFTA - MAT.5.3.4)
    </div>
    <h2 style="color: #1e40af; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
      DOĞRULARIN BİRBİRİNE GÖRE DURUMLARI (GÖZLEM VE SINIFLANDIRMA)
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      Aşağıda verilen doğru çiftlerini inceleyerek ortak nokta sayılarını ve açı durumlarını belirleyiniz.
    </p>
  </div>

  <!-- 4 Doğru Durumu (2x2 Grid) -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
    
    <!-- 1. KESİŞEN DOĞRULAR -->
    <div style="border: 2px solid #3b82f6; border-radius: 10px; padding: 10px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #dbeafe; padding-bottom: 4px; margin-bottom: 6px;">
          <span style="font-weight: 900; color: #1d4ed8; font-size: 11.5px;">1. KESİŞEN DOĞRULAR</span>
          <span style="font-size: 9px; font-weight: bold; background: #eff6ff; color: #2563eb; padding: 1px 5px; border-radius: 4px; border: 1px solid #bfdbfe;">25 Puan</span>
        </div>
        <p style="font-size: 10px; color: #334155; line-height: 1.35; margin: 0 0 6px 0;">
          Düzlemde yalnız tek bir ortak noktası olan iki doğru:
        </p>

        <!-- SVG Çizim Alanı -->
        <div style="border: 1px dashed #cbd5e1; border-radius: 6px; height: 110px; background: #f8fafc; position: relative; overflow: hidden; margin-bottom: 6px;">
          <svg viewBox="0 0 240 110" width="100%" height="100%">
            <!-- Grid çizgileri -->
            <line x1="20" y1="85" x2="220" y2="25" stroke="#2563eb" stroke-width="2.5" />
            <polygon points="215,22 225,24 220,32" fill="#2563eb" />
            <polygon points="25,78 15,86 20,94" fill="#2563eb" />
            <text x="228" y="28" font-family="monospace" font-size="10" font-weight="bold" fill="#1d4ed8">d₁</text>

            <line x1="30" y1="20" x2="210" y2="90" stroke="#0ea5e9" stroke-width="2.5" />
            <polygon points="205,82 215,92 205,96" fill="#0ea5e9" />
            <polygon points="35,16 25,18 30,26" fill="#0ea5e9" />
            <text x="218" y="96" font-family="monospace" font-size="10" font-weight="bold" fill="#0284c7">d₂</text>

            <!-- Kesişim Noktası K (120, 55) -->
            <circle cx="120" cy="55" r="4" fill="#ef4444" />
            <text x="120" y="44" font-family="system-ui" font-size="10" font-weight="900" fill="#dc2626" text-anchor="middle">K</text>

            <!-- Açı Yayları -->
            <path d="M 140 49 A 20 20 0 0 0 135 61" fill="none" stroke="#64748b" stroke-width="1.2" />
            <path d="M 100 61 A 20 20 0 0 0 105 49" fill="none" stroke="#64748b" stroke-width="1.2" />
          </svg>
        </div>
      </div>

      <!-- Sorular & Cevap Alanı -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; font-size: 9.5px; color: #1e293b;">
        <div style="font-weight: 700; margin-bottom: 3px;">❓ <strong>Sorular:</strong></div>
        <div style="margin-bottom: 2px;">• Kesiştiği noktada oluşan açı sayısı: <span style="border-bottom: 1.5px solid #3b82f6; min-width: 40px; display: inline-block;">&nbsp;</span></div>
        <div>• Doğruların ortak nokta sayısı: <span style="border-bottom: 1.5px solid #3b82f6; min-width: 40px; display: inline-block;">&nbsp;</span></div>
      </div>
    </div>

    <!-- 2. DİK DOĞRULAR -->
    <div style="border: 2px solid #10b981; border-radius: 10px; padding: 10px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #d1fae5; padding-bottom: 4px; margin-bottom: 6px;">
          <span style="font-weight: 900; color: #047857; font-size: 11.5px;">2. DİK DOĞRULAR</span>
          <span style="font-size: 9px; font-weight: bold; background: #ecfdf5; color: #059669; padding: 1px 5px; border-radius: 4px; border: 1px solid #a7f3d0;">25 Puan</span>
        </div>
        <p style="font-size: 10px; color: #334155; line-height: 1.35; margin: 0 0 6px 0;">
          Kesişirken 90°'lik açı oluşturan iki doğru:
        </p>

        <!-- SVG Çizim Alanı -->
        <div style="border: 1px dashed #cbd5e1; border-radius: 6px; height: 110px; background: #f8fafc; position: relative; overflow: hidden; margin-bottom: 6px;">
          <svg viewBox="0 0 240 110" width="100%" height="100%">
            <!-- Yatay Doğru m -->
            <line x1="20" y1="55" x2="220" y2="55" stroke="#059669" stroke-width="2.5" />
            <polygon points="215,51 225,55 215,59" fill="#059669" />
            <polygon points="25,51 15,55 25,59" fill="#059669" />
            <text x="228" y="59" font-family="monospace" font-size="10" font-weight="bold" fill="#047857">m</text>

            <!-- Düşey Doğru n -->
            <line x1="120" y1="12" x2="120" y2="98" stroke="#10b981" stroke-width="2.5" />
            <polygon points="116,18 120,8 124,18" fill="#10b981" />
            <polygon points="116,92 120,102 124,92" fill="#10b981" />
            <text x="126" y="16" font-family="monospace" font-size="10" font-weight="bold" fill="#047857">n</text>

            <!-- 90° Diklik Sembolü (120, 55) -->
            <rect x="120" y="37" width="16" height="18" fill="none" stroke="#047857" stroke-width="1.5" />
            <circle cx="128" cy="46" r="2" fill="#047857" />
          </svg>
        </div>
      </div>

      <!-- Sorular & Cevap Alanı -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; font-size: 9.5px; color: #1e293b;">
        <div style="font-weight: 700; margin-bottom: 3px;">❓ <strong>Sorular:</strong></div>
        <div style="margin-bottom: 2px;">• Oluşan 4 açının ölçüsü: <span style="border-bottom: 1.5px solid #10b981; min-width: 40px; display: inline-block;">&nbsp;</span></div>
        <div>• Diklik sembolü (⊥) ile gösterimi: <span style="border-bottom: 1.5px solid #10b981; min-width: 50px; display: inline-block;">&nbsp;</span></div>
      </div>
    </div>

    <!-- 3. PARALEL DOĞRULAR -->
    <div style="border: 2px solid #8b5cf6; border-radius: 10px; padding: 10px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ede9fe; padding-bottom: 4px; margin-bottom: 6px;">
          <span style="font-weight: 900; color: #6d28d9; font-size: 11.5px;">3. PARALEL DOĞRULAR</span>
          <span style="font-size: 9px; font-weight: bold; background: #f5f3ff; color: #7c3aed; padding: 1px 5px; border-radius: 4px; border: 1px solid #ddd6fe;">25 Puan</span>
        </div>
        <p style="font-size: 10px; color: #334155; line-height: 1.35; margin: 0 0 6px 0;">
          Birbirini hiçbir zaman kesmeyen iki doğru:
        </p>

        <!-- SVG Çizim Alanı -->
        <div style="border: 1px dashed #cbd5e1; border-radius: 6px; height: 110px; background: #f8fafc; position: relative; overflow: hidden; margin-bottom: 6px;">
          <svg viewBox="0 0 240 110" width="100%" height="100%">
            <!-- Üst Doğru p -->
            <line x1="20" y1="35" x2="220" y2="35" stroke="#7c3aed" stroke-width="2.5" />
            <polygon points="215,31 225,35 215,39" fill="#7c3aed" />
            <polygon points="25,31 15,35 25,39" fill="#7c3aed" />
            <text x="228" y="39" font-family="monospace" font-size="10" font-weight="bold" fill="#6d28d9">p</text>

            <!-- Alt Doğru r -->
            <line x1="20" y1="75" x2="220" y2="75" stroke="#8b5cf6" stroke-width="2.5" />
            <polygon points="215,71 225,75 215,79" fill="#8b5cf6" />
            <polygon points="25,71 15,75 25,79" fill="#8b5cf6" />
            <text x="228" y="79" font-family="monospace" font-size="10" font-weight="bold" fill="#6d28d9">r</text>

            <!-- Sabit Mesafe Göstergesi (d) -->
            <line x1="120" y1="35" x2="120" y2="75" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3 2" />
            <rect x="120" y="35" width="6" height="6" fill="none" stroke="#94a3b8" stroke-width="1" />
            <rect x="120" y="69" width="6" height="6" fill="none" stroke="#94a3b8" stroke-width="1" />
            <text x="130" y="58" font-family="system-ui" font-size="8.5" font-weight="bold" fill="#64748b">Eşit Mesafe</text>
          </svg>
        </div>
      </div>

      <!-- Sorular & Cevap Alanı -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; font-size: 9.5px; color: #1e293b;">
        <div style="font-weight: 700; margin-bottom: 3px;">❓ <strong>Sorular:</strong></div>
        <div style="margin-bottom: 2px;">• Ortak noktası var mıdır? (Kaç adet?): <span style="border-bottom: 1.5px solid #8b5cf6; min-width: 40px; display: inline-block;">&nbsp;</span></div>
        <div style="margin-bottom: 2px;">• Aralarında açı oluşur mu? Neden?: <span style="border-bottom: 1.5px solid #8b5cf6; min-width: 50px; display: inline-block;">&nbsp;</span></div>
        <div>• Paralellik sembolü ile gösterimi: <span style="border-bottom: 1.5px solid #8b5cf6; min-width: 40px; display: inline-block;">&nbsp;</span> <em>(Örn: p // r)</em></div>
      </div>
    </div>

    <!-- 4. KESEN DOĞRU -->
    <div style="border: 2px solid #f59e0b; border-radius: 10px; padding: 10px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #fef3c7; padding-bottom: 4px; margin-bottom: 6px;">
          <span style="font-weight: 900; color: #d97706; font-size: 11.5px;">4. KESEN DOĞRU</span>
          <span style="font-size: 9px; font-weight: bold; background: #fffbeb; color: #d97706; padding: 1px 5px; border-radius: 4px; border: 1px solid #fde68a;">25 Puan</span>
        </div>
        <p style="font-size: 10px; color: #334155; line-height: 1.35; margin: 0 0 6px 0;">
          Birbirine paralel iki doğruyu farklı noktalarda kesen üçüncü bir doğru:
        </p>

        <!-- SVG Çizim Alanı -->
        <div style="border: 1px dashed #cbd5e1; border-radius: 6px; height: 110px; background: #f8fafc; position: relative; overflow: hidden; margin-bottom: 6px;">
          <svg viewBox="0 0 240 110" width="100%" height="100%">
            <!-- Paralel Doğru k1 -->
            <line x1="20" y1="35" x2="220" y2="35" stroke="#d97706" stroke-width="2.5" />
            <polygon points="215,31 225,35 215,39" fill="#d97706" />
            <polygon points="25,31 15,35 25,39" fill="#d97706" />
            <text x="228" y="39" font-family="monospace" font-size="10" font-weight="bold" fill="#b45309">k₁</text>

            <!-- Paralel Doğru k2 -->
            <line x1="20" y1="80" x2="220" y2="80" stroke="#d97706" stroke-width="2.5" />
            <polygon points="215,76 225,80 215,84" fill="#d97706" />
            <polygon points="25,76 15,80 25,84" fill="#d97706" />
            <text x="228" y="84" font-family="monospace" font-size="10" font-weight="bold" fill="#b45309">k₂</text>

            <!-- Kesen Doğru t -->
            <line x1="60" y1="15" x2="180" y2="100" stroke="#dc2626" stroke-width="2.5" />
            <polygon points="175,93 185,103 172,103" fill="#dc2626" />
            <polygon points="65,12 55,10 68,22" fill="#dc2626" />
            <text x="188" y="102" font-family="monospace" font-size="10" font-weight="bold" fill="#dc2626">t</text>

            <!-- Kesişim Noktaları A ve B -->
            <circle cx="88" cy="35" r="3.5" fill="#dc2626" />
            <text x="80" y="30" font-family="system-ui" font-size="9.5" font-weight="900" fill="#dc2626">A</text>

            <circle cx="152" cy="80" r="3.5" fill="#dc2626" />
            <text x="160" y="93" font-family="system-ui" font-size="9.5" font-weight="900" fill="#dc2626">B</text>
          </svg>
        </div>
      </div>

      <!-- Sorular & Cevap Alanı -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; font-size: 9.5px; color: #1e293b;">
        <div style="font-weight: 700; margin-bottom: 3px;">❓ <strong>Sorular:</strong></div>
        <div style="margin-bottom: 2px;">• İki paralel doğruyu kesen 3. doğruya ne ad verilir?: <span style="border-bottom: 1.5px solid #f59e0b; min-width: 50px; display: inline-block;">&nbsp;</span></div>
        <div>• Kesen doğrunun oluşturduğu toplam açı sayısı: <span style="border-bottom: 1.5px solid #f59e0b; min-width: 40px; display: inline-block;">&nbsp;</span></div>
      </div>
    </div>

  </div>

  <!-- Sonuç / Karşılaştırma Matrisi -->
  <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 8px 12px; margin-bottom: 8px;">
    <div style="font-size: 10.5px; font-weight: 900; color: #1e293b; margin-bottom: 6px; display: flex; align-items: center; gap: 4px;">
      📊 <strong>SONUÇ &amp; ÇIKARIM TABLOSU:</strong>
    </div>
    <table style="width: 100%; border-collapse: collapse; font-size: 9.5px; text-align: center;">
      <thead>
        <tr style="background: #f1f5f9; color: #334155; font-weight: bold; border-bottom: 1px solid #cbd5e1;">
          <th style="padding: 4px 6px; text-align: left;">Doğru Durumu</th>
          <th style="padding: 4px 6px;">Ortak Nokta Sayısı</th>
          <th style="padding: 4px 6px;">Açı Özelliği</th>
          <th style="padding: 4px 6px;">Sembolik Gösterim</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 4px 6px; text-align: left; font-weight: 700; color: #1d4ed8;">1. Kesişen Doğrular</td>
          <td style="padding: 4px 6px;">1</td>
          <td style="padding: 4px 6px;">4 Açı Oluşur (Karşılıklı ters açılar eşit)</td>
          <td style="padding: 4px 6px; font-family: monospace;">d₁ ∩ d₂ = {K}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #ffffff;">
          <td style="padding: 4px 6px; text-align: left; font-weight: 700; color: #047857;">2. Dik Doğrular</td>
          <td style="padding: 4px 6px;">1</td>
          <td style="padding: 4px 6px;">4 Açı da 90° (Dik Açı)</td>
          <td style="padding: 4px 6px; font-family: monospace;">m ⊥ n</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 4px 6px; text-align: left; font-weight: 700; color: #6d28d9;">3. Paralel Doğrular</td>
          <td style="padding: 4px 6px;">0 (Yoktur)</td>
          <td style="padding: 4px 6px;">Kesişmedikleri için açı oluşmaz</td>
          <td style="padding: 4px 6px; font-family: monospace;">p // r</td>
        </tr>
        <tr style="background: #ffffff;">
          <td style="padding: 4px 6px; text-align: left; font-weight: 700; color: #d97706;">4. Kesen Doğru</td>
          <td style="padding: 4px 6px;">2 (A ve B)</td>
          <td style="padding: 4px 6px;">Toplam 8 Açı Oluşur (4 + 4)</td>
          <td style="padding: 4px 6px; font-family: monospace;">k₁ // k₂, t kesen</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Alt Bilgi / Puanlama -->
  <div style="padding: 8px 12px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; font-size: 10px; color: #1e40af; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> 4 Bölüm x 25P = 100 Puan. (SDB3.3 / E3.7 Maarif Geometri Atölyesi)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-5-3-4-table-hypothesis',
    title: 'Etkinlik: "Varsayım ve Tablo Temsili" (İki ve Üç Doğru Analizi - MAT.5.3.4)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.5.3.4',
    outcomeTitle: 'Düzlemde İki veya Üç Doğrunun Durumuna Bağlı Olarak Oluşabilecek Açılara Dair Çıkarım Yapabilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 1,
    createdAt: '2026-09-10T09:00:00Z',
    fileSizeKb: 280,
    tags: ['Etkinlik Kağıdı', 'Varsayım ve Tablo', 'İki ve Üç Doğru', 'Açı Çeşitleri', 'Mümkün İmkansız', 'MAT.5.3.4', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <!-- Başlık Banner -->
  <div style="text-align: center; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #f5f3ff, #ede9fe); padding: 10px; border-radius: 12px; border: 1px solid #ddd6fe;">
    <div style="display: inline-block; background: #7c3aed; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      📊 VARSAYIM &amp; TABLO TEMSİLİ (4. HAFTA - MAT.5.3.4)
    </div>
    <h2 style="color: #5b21b6; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
      VARSAYIM VE TABLO TEMSİLİ (İKİ VE ÜÇ DOĞRU ANALİZİ)
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      Aşağıdaki durumları inceleyerek açı çeşitlerini ve sayılarını tabloya yerleştiriniz.
    </p>
  </div>

  <!-- A BÖLÜMÜ: İKİ DOĞRUNUN KESİŞİMİ DURUMU -->
  <div style="border: 2px solid #8b5cf6; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ede9fe; padding-bottom: 4px; margin-bottom: 6px;">
      <span style="font-weight: 900; color: #6d28d9; font-size: 11.5px;">
        📌 A) İKİ DOĞRUNUN KESİŞİMİ DURUMU
      </span>
      <span style="font-size: 9px; font-weight: bold; background: #f5f3ff; color: #7c3aed; padding: 1px 5px; border-radius: 4px; border: 1px solid #ddd6fe;">
        50 Puan
      </span>
    </div>
    <p style="font-size: 10.5px; color: #334155; line-height: 1.35; margin: 0 0 8px 0;">
      İki doğru düzlemde kesiştirildiğinde oluşabilecek açı türlerini ve sayılarını tablodaki boşluklara yazınız:
    </p>

    <!-- Tablo -->
    <table style="width: 100%; border-collapse: collapse; font-size: 10px; text-align: center; margin-bottom: 4px;">
      <thead>
        <tr style="background: #f5f3ff; color: #5b21b6; font-weight: 900; border-bottom: 2px solid #ddd6fe;">
          <th style="padding: 6px 8px; text-align: left; width: 30%;">Durum</th>
          <th style="padding: 6px 8px; width: 18%;">Dar Açı Sayısı</th>
          <th style="padding: 6px 8px; width: 18%;">Geniş Açı Sayısı</th>
          <th style="padding: 6px 8px; width: 18%;">Dik Açı Sayısı</th>
          <th style="padding: 6px 8px; width: 16%;">Toplam Açı</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 6px 8px; text-align: left; font-weight: 700; color: #1e293b;">
            1. Eğik Kesişme
          </td>
          <td style="padding: 6px 8px; font-weight: 700; color: #6d28d9;">( ........ )</td>
          <td style="padding: 6px 8px; font-weight: 700; color: #6d28d9;">( ........ )</td>
          <td style="padding: 6px 8px; font-weight: 700; color: #6d28d9;">( ........ )</td>
          <td style="padding: 6px 8px; font-weight: 900; color: #0f172a; background: #f8fafc;">4</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #faf5ff;">
          <td style="padding: 6px 8px; text-align: left; font-weight: 700; color: #047857;">
            2. Dik Kesişme (⊥)
          </td>
          <td style="padding: 6px 8px; font-weight: 700; color: #047857;">( ........ )</td>
          <td style="padding: 6px 8px; font-weight: 700; color: #047857;">( ........ )</td>
          <td style="padding: 6px 8px; font-weight: 700; color: #047857;">( ........ )</td>
          <td style="padding: 6px 8px; font-weight: 900; color: #0f172a; background: #f1f5f9;">4</td>
        </tr>
        <tr style="background: #ffffff;">
          <td style="padding: 6px 8px; text-align: left; font-weight: 700; color: #b45309;">
            3. Paralel Olma (//)
          </td>
          <td style="padding: 6px 8px; font-weight: 700; color: #b45309;">( ........ )</td>
          <td style="padding: 6px 8px; font-weight: 700; color: #b45309;">( ........ )</td>
          <td style="padding: 6px 8px; font-weight: 700; color: #b45309;">( ........ )</td>
          <td style="padding: 6px 8px; font-weight: 900; color: #0f172a; background: #f8fafc;">0</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- B BÖLÜMÜ: ÜÇ DOĞRUNUN TEK BİR NOKTADA KESİŞİMİ DURUMU -->
  <div style="border: 2px solid #0284c7; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #e0f2fe; padding-bottom: 4px; margin-bottom: 6px;">
      <span style="font-weight: 900; color: #0369a1; font-size: 11.5px;">
        📌 B) ÜÇ DOĞRUNUN TEK BİR NOKTADA KESİŞİMİ DURUMU (6 AÇI BÖLGESİ)
      </span>
      <span style="font-size: 9px; font-weight: bold; background: #f0f9ff; color: #0284c7; padding: 1px 5px; border-radius: 4px; border: 1px solid #bae6fd;">
        50 Puan
      </span>
    </div>
    
    <div style="display: grid; grid-template-columns: 140px 1fr; gap: 10px; align-items: center; margin-bottom: 6px;">
      <!-- Mini 6 Açı SVG Şeması -->
      <div style="border: 1px dashed #cbd5e1; border-radius: 8px; height: 115px; background: #f8fafc; position: relative; overflow: hidden;">
        <svg viewBox="0 0 140 115" width="100%" height="100%">
          <!-- Doğru 1 (Yatay) -->
          <line x1="10" y1="57" x2="130" y2="57" stroke="#0284c7" stroke-width="2" />
          <!-- Doğru 2 (60°) -->
          <line x1="35" y1="14" x2="105" y2="101" stroke="#7c3aed" stroke-width="2" />
          <!-- Doğru 3 (120°) -->
          <line x1="105" y1="14" x2="35" y2="101" stroke="#d97706" stroke-width="2" />
          <!-- Merkez O -->
          <circle cx="70" cy="57" r="4" fill="#dc2626" />
          <text x="70" y="47" font-family="system-ui" font-size="9" font-weight="900" fill="#dc2626" text-anchor="middle">O</text>
          <text x="70" y="70" font-family="system-ui" font-size="7.5" font-weight="bold" fill="#64748b" text-anchor="middle">6 Açı Bölgesi</text>
        </svg>
      </div>

      <p style="font-size: 10.5px; color: #334155; line-height: 1.35; margin: 0;">
        Üç doğru aynı merkez noktadan geçtiğinde merkez etrafında <strong>toplam 6 açı bölgesi</strong> (tam açı = 360°) oluşur. Aşağıdaki durumların gerçekleşip gerçekleşemeyeceğini <strong>(Mümkün / İmkânsız)</strong> olarak belirtiniz:
      </p>
    </div>

    <!-- 4 Önerme Satırı -->
    <div style="space-y: 4px; font-size: 10px; color: #1e293b;">
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 5px 8px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
        <span>• <strong>6 adet dar açı</strong> oluşması:</span>
        <span style="font-weight: 800; color: #0284c7;">[ &nbsp; ] Mümkün &nbsp; / &nbsp; [ &nbsp; ] İmkânsız</span>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 5px 8px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
        <span>• <strong>2 geniş açı ve 4 dar açı</strong> oluşması:</span>
        <span style="font-weight: 800; color: #0284c7;">[ &nbsp; ] Mümkün &nbsp; / &nbsp; [ &nbsp; ] İmkânsız</span>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 5px 8px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
        <span>• <strong>2 dik açı ve 4 dar açı</strong> oluşması:</span>
        <span style="font-weight: 800; color: #0284c7;">[ &nbsp; ] Mümkün &nbsp; / &nbsp; [ &nbsp; ] İmkânsız</span>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 5px 8px; display: flex; justify-content: space-between; align-items: center;">
        <span>• <strong>6 adet geniş açı</strong> oluşması:</span>
        <span style="font-weight: 800; color: #0284c7;">[ &nbsp; ] Mümkün &nbsp; / &nbsp; [ &nbsp; ] İmkânsız</span>
      </div>
    </div>
  </div>

  <!-- Alt Bilgi / Puanlama -->
  <div style="padding: 8px 12px; background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 8px; font-size: 10px; color: #5b21b6; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Bölüm A (50P) + Bölüm B (50P) = 100 Puan. (SDB3.3 / E3.7 Mantıksal Çıkarım)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-5-3-4-intersection-challenge',
    title: 'Etkinlik: "Kavşak Şifresi ve Çıkarım Meydan Okuması" (MAT.5.3.4)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.5.3.4',
    outcomeTitle: 'Düzlemde İki veya Üç Doğrunun Durumuna Bağlı Olarak Oluşabilecek Açılara Dair Çıkarım Yapabilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    pageCount: 1,
    createdAt: '2026-09-10T10:00:00Z',
    fileSizeKb: 285,
    tags: ['Etkinlik Kağıdı', 'Kavşak Şifresi', 'Ters Açılar', 'Komşu Bütünler', 'Tam Açı 360', 'MAT.5.3.4', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <!-- Başlık Banner -->
  <div style="text-align: center; border-bottom: 2px solid #ef4444; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #fef2f2, #fee2e2); padding: 10px; border-radius: 12px; border: 1px solid #fca5a5;">
    <div style="display: inline-block; background: #dc2626; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      🚦 AÇI ŞİFRESİ &amp; MEYDAN OKUMA (4. HAFTA - MAT.5.3.4)
    </div>
    <h2 style="color: #991b1b; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
      KAVŞAK ŞİFRESİ VE ÇIKARIM MEYDAN OKUMASI
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      Verilen 50°'lik kavşak açısını inceleyerek ters açı, komşu bütünler ve 4 açının toplamını bulunuz.
    </p>
  </div>

  <!-- KAVŞAK GÖRSELİ & HESAPLAMA ALANI (GRID) -->
  <div style="display: grid; grid-template-columns: 200px 1fr; gap: 12px; margin-bottom: 10px;">
    
    <!-- Sol SVG: Çapraz Kavşak Şeması -->
    <div style="border: 2px solid #ef4444; border-radius: 10px; padding: 8px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="font-size: 10.5px; font-weight: 900; color: #b91c1c; margin-bottom: 4px; text-align: center;">
        🚦 'O' MERKEZLİ KAVŞAK
      </div>
      <div style="border: 1px dashed #cbd5e1; border-radius: 6px; height: 160px; background: #f8fafc; position: relative; overflow: hidden;">
        <svg viewBox="0 0 200 160" width="100%" height="100%">
          <!-- Doğru 1 (40° Eğim) -->
          <line x1="20" y1="130" x2="180" y2="30" stroke="#0284c7" stroke-width="3" />
          <!-- Doğru 2 (-40° Eğim) -->
          <line x1="20" y1="30" x2="180" y2="130" stroke="#0ea5e9" stroke-width="3" />
          
          <!-- Merkez O (100, 80) -->
          <circle cx="100" cy="80" r="5" fill="#dc2626" />
          <text x="100" y="74" font-family="system-ui" font-size="9.5" font-weight="900" fill="#dc2626" text-anchor="middle">O</text>

          <!-- Üst Açı = 50° (Verilen) -->
          <path d="M 85 68 A 20 20 0 0 1 115 68" fill="none" stroke="#dc2626" stroke-width="2" />
          <rect x="75" y="42" width="50" height="18" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="1" />
          <text x="100" y="55" font-family="system-ui" font-size="10.5" font-weight="900" fill="#991b1b" text-anchor="middle">50° (Üst)</text>

          <!-- Alt Açı = ? -->
          <path d="M 85 92 A 20 20 0 0 0 115 92" fill="none" stroke="#64748b" stroke-width="1.5" />
          <text x="100" y="112" font-family="monospace" font-size="11" font-weight="900" fill="#0284c7" text-anchor="middle">? (Alt)</text>

          <!-- Sol Açı = ? -->
          <text x="45" y="84" font-family="monospace" font-size="10" font-weight="900" fill="#6d28d9" text-anchor="middle">? (Sol)</text>

          <!-- Sağ Açı = ? -->
          <text x="155" y="84" font-family="monospace" font-size="10" font-weight="900" fill="#6d28d9" text-anchor="middle">? (Sağ)</text>
        </svg>
      </div>
      <div style="font-size: 9px; color: #64748b; text-align: center; margin-top: 4px; font-weight: 600;">
        (İki doğrunun 'O' noktasındaki kesişimi)
      </div>
    </div>

    <!-- Sağ: 3 Soru & İşlem Alanı -->
    <div style="border: 2px solid #ef4444; border-radius: 10px; padding: 10px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="font-size: 11px; font-weight: 900; color: #b91c1c; border-bottom: 1.5px solid #fee2e2; padding-bottom: 4px; margin-bottom: 6px;">
        🔍 AÇI HESAPLAMA ADIMLARI (50 Puan)
      </div>

      <div style="space-y: 6px; font-size: 10.5px; color: #1e293b;">
        <!-- Soru 1 -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px;">
          <div style="font-weight: 700;">1. Verilen 50°'lik açının tam karşısındaki <strong>ters açının</strong> ölçüsü kaç derecedir?</div>
          <div style="margin-top: 3px; font-weight: 800; color: #0284c7;">
            Ters Açı Ölçüsü: <span style="border-bottom: 1.5px solid #0284c7; min-width: 60px; display: inline-block;">( ..........° )</span>
          </div>
        </div>

        <!-- Soru 2 -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px;">
          <div style="font-weight: 700;">2. Verilen 50°'lik açının yan tarafında bulunan <strong>komşu bütünler açının</strong> ölçüsü kaç derecedir?</div>
          <div style="margin-top: 3px; font-weight: 800; color: #6d28d9;">
            Komşu Bütünler Açı Ölçüsü: <span style="border-bottom: 1.5px solid #6d28d9; min-width: 60px; display: inline-block;">( ..........° )</span>
          </div>
        </div>

        <!-- Soru 3 -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px;">
          <div style="font-weight: 700;">3. Kavşakta oluşan <strong>4 açının ölçüleri toplamı</strong> kaç derecedir?</div>
          <div style="margin-top: 3px; font-weight: 800; color: #dc2626;">
            Toplam: <span style="border-bottom: 1.5px solid #dc2626; min-width: 60px; display: inline-block;">( ..........° )</span> (Tam Açı)
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- BÖLÜM 4: ÇIKARIM ÖNERMELERİNİ DEĞERLENDİRİNİZ (D / Y) -->
  <div style="border: 2px solid #0d9488; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 8px;">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ccfbf1; padding-bottom: 4px; margin-bottom: 6px;">
      <span style="font-weight: 900; color: #0f766e; font-size: 11.5px;">
        ⚖️ ÇIKARIM ÖNERMELERİNİ DEĞERLENDİRİNİZ (50 Puan - Doğru [D] / Yanlış [Y])
      </span>
      <span style="font-size: 9px; font-weight: bold; background: #f0fdfa; color: #0d9488; padding: 1px 5px; border-radius: 4px; border: 1px solid #99f6e4;">
        4 x 12.5P = 50P
      </span>
    </div>

    <div style="space-y: 4px; font-size: 10px; color: #1e293b;">
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 5px 8px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
        <span>[ &nbsp;&nbsp;&nbsp; ] 1. İki doğru kesiştiğinde oluşan karşılıklı açıların (ters açıların) ölçüleri daima birbirine eşittir.</span>
        <span style="font-weight: 800; color: #0f766e;">( D / Y )</span>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 5px 8px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
        <span>[ &nbsp;&nbsp;&nbsp; ] 2. Paralel iki doğru birbiriyle kesişmediği için aralarında açı oluşmaz.</span>
        <span style="font-weight: 800; color: #0f766e;">( D / Y )</span>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 5px 8px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
        <span>[ &nbsp;&nbsp;&nbsp; ] 3. Birbirini dik kesen iki doğru 4 adet 90°'lik dik açı meydana getirir.</span>
        <span style="font-weight: 800; color: #0f766e;">( D / Y )</span>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 5px 8px; display: flex; justify-content: space-between; align-items: center;">
        <span>[ &nbsp;&nbsp;&nbsp; ] 4. Komşu tümler iki açının ölçüleri toplamı 180°'dir.</span>
        <span style="font-weight: 800; color: #0f766e;">( D / Y )</span>
      </div>
    </div>
  </div>

  <!-- Alt Bilgi / Puanlama -->
  <div style="padding: 8px 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; font-size: 10px; color: #991b1b; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Hesaplama Adımları (50P) + Önerme Değerlendirme (50P) = 100 Puan. (SDB3.3 / E3.7 Açı İspatı)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-6-1-1-area-models',
    title: 'Etkinlik 1: "Alan Modelleri ile Çarpan Avcılığı" (MAT.6.1.1)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.6.1.1',
    outcomeTitle: 'Bir Doğal Sayının Çarpanlarını ve Katlarını Belirleyebilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Maarif Matematik ve İyilik Lojistiği Atölyesi',
    pageCount: 1,
    createdAt: '2026-09-10T10:00:00Z',
    fileSizeKb: 290,
    tags: ['Etkinlik Kağıdı', 'Alan Modelleri', 'Çarpan İkilileri', 'Bölenler', 'MAT.6.1.1', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <!-- Başlık Banner -->
  <div style="text-align: center; border-bottom: 2px solid #ea580c; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #fff7ed, #ffedd5); padding: 10px; border-radius: 12px; border: 1px solid #fed7aa;">
    <div style="display: inline-block; background: #ea580c; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      📦 ALAN MODELLERİ &amp; ÇARPAN İKİLİLERİ (6. SINIF - MAT.6.1.1)
    </div>
    <h2 style="color: #9a3412; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
      ALAN MODELLERİ İLE ÇARPAN AVCILIĞI
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      Birim karelerle firesiz dikdörtgenler oluşturarak çarpan çiftlerini keşfediniz.
    </p>
  </div>

  <!-- A BÖLÜMÜ: 24 BİRİMKARELİK KOLİ TABANLARI -->
  <div style="border: 2px solid #ea580c; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ffedd5; padding-bottom: 4px; margin-bottom: 6px;">
      <span style="font-weight: 900; color: #c2410c; font-size: 11.5px;">
        📌 A) 24 BİRİMKARELİK ALAN MODELLERİ VE ÇARPAN İKİLİLERİ
      </span>
      <span style="font-size: 9px; font-weight: bold; background: #fff7ed; color: #ea580c; padding: 1px 5px; border-radius: 4px; border: 1px solid #fed7aa;">
        40 Puan
      </span>
    </div>
    <p style="font-size: 10.5px; color: #334155; line-height: 1.35; margin: 0 0 8px 0;">
      24 adet özdeş yardım kutusu, tabanı dikdörtgen olacak şekilde firesiz dizilecektir. Oluşturulabilecek tüm farklı dikdörtgen boyutlarını ve çarpan ikililerini yazınız:
    </p>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 10.5px;">
      <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 8px;">
        <span style="font-weight: 800; color: #9a3412;">1. Dikdörtgen:</span> 1 sıra x 24 kutu ⟹ <strong>1 × 24 = 24</strong>
        <div style="color: #64748b; font-size: 9.5px; margin-top: 2px;">Çarpan Çifti: ( 1 , 24 )</div>
      </div>
      <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 8px;">
        <span style="font-weight: 800; color: #9a3412;">2. Dikdörtgen:</span> 2 sıra x ..... kutu ⟹ <strong>2 × ..... = 24</strong>
        <div style="color: #64748b; font-size: 9.5px; margin-top: 2px;">Çarpan Çifti: ( 2 , ..... )</div>
      </div>
      <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 8px;">
        <span style="font-weight: 800; color: #9a3412;">3. Dikdörtgen:</span> 3 sıra x ..... kutu ⟹ <strong>3 × ..... = 24</strong>
        <div style="color: #64748b; font-size: 9.5px; margin-top: 2px;">Çarpan Çifti: ( 3 , ..... )</div>
      </div>
      <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 8px;">
        <span style="font-weight: 800; color: #9a3412;">4. Dikdörtgen:</span> 4 sıra x ..... kutu ⟹ <strong>4 × ..... = 24</strong>
        <div style="color: #64748b; font-size: 9.5px; margin-top: 2px;">Çarpan Çifti: ( 4 , ..... )</div>
      </div>
    </div>
    <div style="margin-top: 8px; padding: 6px 10px; background: #f8fafc; border-radius: 6px; font-size: 10px; font-weight: 700; color: #334155;">
      Sonuç: 24 sayısının tüm pozitif çarpanları (küçükten büyüğe): <strong>{ ............................................................................ }</strong> (Toplam: ..... adet)
    </div>
  </div>

  <!-- B BÖLÜMÜ: FİRELİ ALAN DEDEKTİFİ -->
  <div style="border: 2px solid #dc2626; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #fee2e2; padding-bottom: 4px; margin-bottom: 6px;">
      <span style="font-weight: 900; color: #b91c1c; font-size: 11.5px;">
        🔍 B) FİRELİ ALAN DEDEKTİFİ: NEDEN ÇARPAN DEĞİLDİR?
      </span>
      <span style="font-size: 9px; font-weight: bold; background: #fef2f2; color: #dc2626; padding: 1px 5px; border-radius: 4px; border: 1px solid #fecaca;">
        30 Puan
      </span>
    </div>
    <p style="font-size: 10.5px; color: #334155; line-height: 1.35; margin: 0 0 6px 0;">
      24 kutuyu 5'erli veya 7'şerli sıralar halinde dizmeye çalıştığımızda ne olduğunu inceleyiniz:
    </p>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 10px;">
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 8px;">
        <strong style="color: #991b1b;">5'erli Dizilim Denemesi:</strong>
        <div style="margin-top: 4px; color: #475569;">
          24 ÷ 5 = ..... (Kalan: .....)<br/>
          Tam dikdörtgen oluşur mu? <strong>[ Evet / Hayır ]</strong><br/>
          Gerekçe: 5 sayısı 24'ü kalansız .................................... için çarpanı ....................................
        </div>
      </div>
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 8px;">
        <strong style="color: #991b1b;">7'şerli Dizilim Denemesi:</strong>
        <div style="margin-top: 4px; color: #475569;">
          24 ÷ 7 = ..... (Kalan: .....)<br/>
          Tam dikdörtgen oluşur mu? <strong>[ Evet / Hayır ]</strong><br/>
          Gerekçe: 7 sayısı 24'ü kalansız .................................... için çarpanı ....................................
        </div>
      </div>
    </div>
  </div>

  <!-- C BÖLÜMÜ: 36 VE 48 SAYILARININ ÇARPAN KARŞILAŞTIRMASI -->
  <div style="border: 2px solid #0d9488; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ccfbf1; padding-bottom: 4px; margin-bottom: 6px;">
      <span style="font-weight: 900; color: #0f766e; font-size: 11.5px;">
        ⚖️ C) 36 VE 48 SAYILARININ ÇARPAN VE ALAN KARŞILAŞTIRMASI
      </span>
      <span style="font-size: 9px; font-weight: bold; background: #f0fdf4; color: #0d9488; padding: 1px 5px; border-radius: 4px; border: 1px solid #99f6e4;">
        30 Puan
      </span>
    </div>
    <table style="width: 100%; border-collapse: collapse; font-size: 10px; text-align: center;">
      <thead>
        <tr style="background: #f0fdfa; color: #115e59; font-weight: 900; border-bottom: 2px solid #99f6e4;">
          <th style="padding: 6px; text-align: left; width: 25%;">Doğal Sayı</th>
          <th style="padding: 6px; text-align: left; width: 45%;">Tüm Pozitif Çarpanları</th>
          <th style="padding: 6px; width: 15%;">Çarpan Sayısı</th>
          <th style="padding: 6px; width: 15%;">Tek mi Çift mi?</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 6px; text-align: left; font-weight: bold; color: #0f766e;">36 (Zeytinyağı)</td>
          <td style="padding: 6px; text-align: left;">1, 2, 3, 4, 6, 9, 12, 18, 36</td>
          <td style="padding: 6px; font-weight: bold;">( ..... )</td>
          <td style="padding: 6px; font-weight: bold; color: #ea580c;">( ..... )</td>
        </tr>
        <tr style="background: #fafafa;">
          <td style="padding: 6px; text-align: left; font-weight: bold; color: #0f766e;">48 (Mercimek)</td>
          <td style="padding: 6px; text-align: left;">1, 2, 3, 4, 6, 8, 12, 16, 24, 48</td>
          <td style="padding: 6px; font-weight: bold;">( ..... )</td>
          <td style="padding: 6px; font-weight: bold; color: #0284c7;">( ..... )</td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top: 6px; font-size: 9.5px; color: #475569; font-style: italic;">
      * Neden 36'nın çarpan sayısı tektir? Açıklayınız: ..........................................................................................................................
    </div>
  </div>

  <!-- Alt Bilgi / Puanlama -->
  <div style="padding: 8px 12px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; font-size: 10px; color: #9a3412; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Alan Modelleri (40P) + Fire Dedektifi (30P) + Tablo Analizi (30P) = 100 Puan. (SDB1.2 / E3.3 Maarif Modeli)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-6-1-1-rhythmic-jumps',
    title: 'Etkinlik 2: "Ritmik Sıçrama ve Katlar Çizgisi" (MAT.6.1.1)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.6.1.1',
    outcomeTitle: 'Bir Doğal Sayının Çarpanlarını ve Katlarını Belirleyebilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Maarif Matematik ve İyilik Lojistiği Atölyesi',
    pageCount: 1,
    createdAt: '2026-09-10T10:00:00Z',
    fileSizeKb: 285,
    tags: ['Etkinlik Kağıdı', 'Katlar', 'Sayı Doğrusu', 'Ritmik Sayma', 'MAT.6.1.1', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <!-- Başlık Banner -->
  <div style="text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #f0fdfa, #ccfbf1); padding: 10px; border-radius: 12px; border: 1px solid #99f6e4;">
    <div style="display: inline-block; background: #0d9488; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      🐸 RİTMİK SIÇRAMA &amp; KATLAR (6. SINIF - MAT.6.1.1)
    </div>
    <h2 style="color: #115e59; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
      RİTMİK SIÇRAMA VE KATLAR ÇİZGİSİ
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      Sayı doğrusu üzerinde ritmik adımlarla ilerleyerek katlar kümesini ve ortak durakları belirleyiniz.
    </p>
  </div>

  <!-- A BÖLÜMÜ: 12'NİN VE 8'İN KATLARI -->
  <div style="border: 2px solid #0d9488; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ccfbf1; padding-bottom: 4px; margin-bottom: 6px;">
      <span style="font-weight: 900; color: #0f766e; font-size: 11.5px;">
        📌 A) SAYI DOĞRUSUNDA 12'NİN VE 8'İN İLK 10 KATI
      </span>
      <span style="font-size: 9px; font-weight: bold; background: #f0fdfa; color: #0d9488; padding: 1px 5px; border-radius: 4px; border: 1px solid #99f6e4;">
        40 Puan
      </span>
    </div>
    <p style="font-size: 10.5px; color: #334155; line-height: 1.35; margin: 0 0 8px 0;">
      Her 12 dakikada bir kalkan yardım tırlarının kalkış dakikalarını ve 8'er metrelik aralıklarla dikilen fidan noktalarını tamamlayınız:
    </p>

    <div style="space-y: 6px; font-size: 10px;">
      <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 6px 10px; margin-bottom: 6px;">
        <strong style="color: #0f766e;">12'nin Pozitif Katları:</strong> 12, 24, ....., 48, ....., 72, ....., 96, ....., 120...
        <div style="color: #64748b; font-size: 9px; margin-top: 2px;">12'nin 100'den küçük en büyük katı: <strong>( ..... )</strong></div>
      </div>
      <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 6px 10px;">
        <strong style="color: #0f766e;">8'in Pozitif Katları:</strong> 8, 16, ....., 32, ....., 48, ....., 64, ....., 80...
        <div style="color: #64748b; font-size: 9px; margin-top: 2px;">8'in 50 ile 90 arasındaki katları: <strong>( ...................................................... )</strong></div>
      </div>
    </div>
  </div>

  <!-- B BÖLÜMÜ: ORTAK İYİLİK SEFERLERİ -->
  <div style="border: 2px solid #7c3aed; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ede9fe; padding-bottom: 4px; margin-bottom: 6px;">
      <span style="font-weight: 900; color: #6d28d9; font-size: 11.5px;">
        🤝 B) ORTAK İYİLİK SEFERLERİ (ORTAK KAT KEŞFİ)
      </span>
      <span style="font-size: 9px; font-weight: bold; background: #f5f3ff; color: #7c3aed; padding: 1px 5px; border-radius: 4px; border: 1px solid #ddd6fe;">
        30 Puan
      </span>
    </div>
    <p style="font-size: 10.5px; color: #334155; line-height: 1.35; margin: 0 0 6px 0;">
      Aşevinden sıcak yemek servisi yapan Minibüs 1 her 6 dakikada bir, Minibüs 2 her 8 dakikada bir merkezden hareket etmektedir.
    </p>
    <div style="background: #faf5ff; border: 1px solid #ddd6fe; border-radius: 8px; padding: 8px; font-size: 10px;">
      <div>1. Birlikte ilk aynı anda hareket dakikası: <strong>( ..... ) . dakika</strong></div>
      <div style="margin-top: 3px;">2. Birlikte ikinci aynı anda hareket dakikası: <strong>( ..... ) . dakika</strong></div>
      <div style="margin-top: 3px;">3. Birlikte üçüncü aynı anda hareket dakikası: <strong>( ..... ) . dakika</strong></div>
      <div style="margin-top: 5px; color: #6d28d9; font-weight: bold;">
        Sonuç Çıkarımı: İki sayının ortak katları, en küçük ortak katın katları şeklinde devam eder: [ Doğru / Yanlış ]
      </div>
    </div>
  </div>

  <!-- C BÖLÜMÜ: ÇARPAN VE KAT KARŞILAŞTIRMA ÖNERMELERİ -->
  <div style="border: 2px solid #0284c7; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #e0f2fe; padding-bottom: 4px; margin-bottom: 6px;">
      <span style="font-weight: 900; color: #0369a1; font-size: 11.5px;">
        💡 C) MATEMATİKSEL AKIL YÜRÜTME (DOĞRU / YANLIŞ)
      </span>
      <span style="font-size: 9px; font-weight: bold; background: #f0f9ff; color: #0284c7; padding: 1px 5px; border-radius: 4px; border: 1px solid #bae6fd;">
        30 Puan
      </span>
    </div>
    <div style="space-y: 4px; font-size: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; background: #f8fafc; border-radius: 4px; margin-bottom: 4px;">
        <span>[ &nbsp;&nbsp;&nbsp; ] 1. Bir doğal sayının pozitif çarpan sayısı sınırlıdır fakat pozitif katları sonsuzdur.</span>
        <strong style="color: #0369a1;">( D / Y )</strong>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; background: #f8fafc; border-radius: 4px; margin-bottom: 4px;">
        <span>[ &nbsp;&nbsp;&nbsp; ] 2. Bir doğal sayının en küçük pozitif katı 0'dır.</span>
        <strong style="color: #0369a1;">( D / Y )</strong>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; background: #f8fafc; border-radius: 4px; margin-bottom: 4px;">
        <span>[ &nbsp;&nbsp;&nbsp; ] 3. 7 × 9 = 63 eşitliğinde 63 sayısı 7 ve 9'un bir katıdır.</span>
        <strong style="color: #0369a1;">( D / Y )</strong>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; background: #f8fafc; border-radius: 4px;">
        <span>[ &nbsp;&nbsp;&nbsp; ] 4. 15 sayısının 100'den küçük kat sayısı toplam 6 adettir.</span>
        <strong style="color: #0369a1;">( D / Y )</strong>
      </div>
    </div>
  </div>

  <!-- Alt Bilgi / Puanlama -->
  <div style="padding: 8px 12px; background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; font-size: 10px; color: #115e59; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Ritmik Katlar (40P) + Ortak Seferler (30P) + Akıl Yürütme (30P) = 100 Puan. (SDB3.3 / E3.3 Maarif Modeli)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-6-1-1-rainbow-cipher',
    title: 'Etkinlik 3: "Çarpan Gökkuşağı Şifresi ve Problem Çözme" (MAT.6.1.1)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.6.1.1',
    outcomeTitle: 'Bir Doğal Sayının Çarpanlarını ve Katlarını Belirleyebilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Maarif Matematik ve İyilik Lojistiği Atölyesi',
    pageCount: 1,
    createdAt: '2026-09-10T10:00:00Z',
    fileSizeKb: 295,
    tags: ['Etkinlik Kağıdı', 'Çarpan Gökkuşağı', 'Şifre Çözme', 'Problem Çözme', 'MAT.6.1.1', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <!-- Başlık Banner -->
  <div style="text-align: center; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #f5f3ff, #ede9fe); padding: 10px; border-radius: 12px; border: 1px solid #ddd6fe;">
    <div style="display: inline-block; background: #8b5cf6; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      🌈 GÖKKUŞAĞI ŞİFRESİ &amp; PROBLEM ÇÖZME (6. SINIF - MAT.6.1.1)
    </div>
    <h2 style="color: #5b21b6; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
      ÇARPAN GÖKKUŞAĞI ŞİFRESİ VE PROBLEM ÇÖZME
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      Çarpan gökkuşağındaki simetri sırrını kullanarak kilitleri açınız ve günlük hayat problemlerini çözünüz.
    </p>
  </div>

  <!-- A BÖLÜMÜ: 60 SAYISININ ÇARPAN GÖKKUŞAĞI -->
  <div style="border: 2px solid #8b5cf6; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ede9fe; padding-bottom: 4px; margin-bottom: 6px;">
      <span style="font-weight: 900; color: #6d28d9; font-size: 11.5px;">
        📌 A) 60 SAYISININ ÇARPAN GÖKKUŞAĞI VE HARF ŞİFRESİ
      </span>
      <span style="font-size: 9px; font-weight: bold; background: #f5f3ff; color: #8b5cf6; padding: 1px 5px; border-radius: 4px; border: 1px solid #ddd6fe;">
        40 Puan
      </span>
    </div>
    <p style="font-size: 10.5px; color: #334155; line-height: 1.35; margin: 0 0 8px 0;">
      60 sayısının tüm çarpanları küçükten büyüğe sıralanmış ancak bazıları harflerle gizlenmiştir:
    </p>

    <!-- Dizilim -->
    <div style="text-align: center; padding: 10px; background: #faf5ff; border: 1.5px dashed #c084fc; border-radius: 10px; margin-bottom: 8px;">
      <span style="font-family: monospace; font-size: 13px; font-weight: 900; color: #581c87; letter-spacing: 2px;">
        1 , 2 , 3 , <span style="color: #dc2626; background: #fee2e2; padding: 2px 6px; border-radius: 4px;">A</span> , 5 , 6 , 10 , 12 , <span style="color: #0284c7; background: #e0f2fe; padding: 2px 6px; border-radius: 4px;">B</span> , 20 , <span style="color: #16a34a; background: #dcfce7; padding: 2px 6px; border-radius: 4px;">C</span> , 60
      </span>
    </div>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 10.5px; text-align: center;">
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 6px;">
        <strong style="color: #dc2626;">A Çarpanı:</strong> ( ..... )
      </div>
      <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 6px;">
        <strong style="color: #0284c7;">B Çarpanı:</strong> ( ..... )
      </div>
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 6px;">
        <strong style="color: #16a34a;">C Çarpanı:</strong> ( ..... )
      </div>
    </div>
    <div style="margin-top: 8px; padding: 6px 10px; background: #f8fafc; border-radius: 6px; font-size: 10.5px; font-weight: bold; color: #334155; text-align: center;">
      Şifre Hesaplama: <strong>A + B + C = ..... + ..... + ..... = ( ..... )</strong>
    </div>
  </div>

  <!-- B BÖLÜMÜ: GERÇEK HAYAT PROBLEM ÇÖZÜMLERİ -->
  <div style="border: 2px solid #ea580c; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #ffedd5; padding-bottom: 4px; margin-bottom: 6px;">
      <span style="font-weight: 900; color: #c2410c; font-size: 11.5px;">
        🛒 B) GERÇEK HAYAT PROBLEM ÇÖZÜMLERİ
      </span>
      <span style="font-size: 9px; font-weight: bold; background: #fff7ed; color: #ea580c; padding: 1px 5px; border-radius: 4px; border: 1px solid #fed7aa;">
        60 Puan
      </span>
    </div>

    <!-- Problem 1 -->
    <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 8px; font-size: 10px; margin-bottom: 8px;">
      <strong style="color: #9a3412;">Problem 1 (Aşevi Pirinç Paylaşımı):</strong><br/>
      45 kg pirinç hiç artmayacak şekilde eşit ağırlıkta torbalara doldurulacaktır. Torbalar 3 kg'dan ağır ve 15 kg'dan hafif olacağına göre, bir torbanın alabileceği ağırlıkları bulunuz.<br/>
      <div style="margin-top: 4px; color: #475569;">
        45'in bölenleri: 1, 3, 5, 9, 15, 45<br/>
        Şarta uygun torba ağırlıkları: <strong>( .................................................... )</strong> (Toplam: ..... farklı değer)
      </div>
    </div>

    <!-- Problem 2 -->
    <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 8px; font-size: 10px;">
      <strong style="color: #9a3412;">Problem 2 (Dikdörtgen Bahçe Çiti):</strong><br/>
      Alanı 40 m² olan dikdörtgen şeklindeki bir yardım deposu tabanının kenar uzunlukları birer doğal sayıdır. Bu tabanın çevre uzunluğu EN AZ kaç metre olabilir?<br/>
      <div style="margin-top: 4px; color: #475569;">
        Kenar çarpan çiftleri: (1,40), (2,20), (4,10), (5,8)<br/>
        Çevre = 2 × (Kısa Kenar + Uzun Kenar)<br/>
        En küçük çevre için seçilen kenarlar: ..... m ve ..... m ⟹ Çevre = 2 × ( ..... + ..... ) = <strong>( ..... ) m</strong>
      </div>
    </div>
  </div>

  <!-- Alt Bilgi / Puanlama -->
  <div style="padding: 8px 12px; background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 8px; font-size: 10px; color: #5b21b6; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Gökkuşağı Şifresi (40P) + Problemler (60P) = 100 Puan. (SDB3.3 / E3.3 Maarif Modeli)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  // =========================================================================
  // 6. SINIF: MAT.6.1.2 BÖLÜNEBİLME KRİTERLERİ ETKİNLİK KAĞITLARI
  // =========================================================================
  {
    id: 'file-activity-mat-6-1-2-lastdigit',
    title: 'Etkinlik 1: "Son Basamak Dedektifi (2, 5, 10 Kriterleri)" (MAT.6.1.2)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.6.1.2',
    outcomeTitle: 'Bölünebilme Kriterlerini Doğal Sayıların Özellikleri ile İlişkilendirebilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Maarif Matematik ve Basamak Analiz Atölyesi',
    pageCount: 1,
    createdAt: '2026-09-10T10:00:00Z',
    fileSizeKb: 295,
    tags: ['Etkinlik Kağıdı', 'Bölünebilme', 'Son Basamak', '2-5-10 Kriterleri', 'MAT.6.1.2', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <div style="text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 10px; border-radius: 12px; border: 1px solid #bae6fd;">
    <div style="display: inline-block; background: #0284c7; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      🔍 BASAMAK ANALİZİ (6. SINIF - MAT.6.1.2)
    </div>
    <h2 style="color: #0369a1; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase;">
      SON BASAMAK DEDEKTİFİ: 2, 5 VE 10 İLE BÖLÜNEBİLME
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      Birler basamağının özelliklerine bakarak kalansız bölünebilme ve kalan bulma kurallarını uygulayınız.
    </p>
  </div>

  <div style="border: 2px solid #0284c7; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #0369a1; margin-bottom: 6px;">
      A BÖLÜMÜ: Son Basamak İnceleme Tablosu (40 Puan)
    </div>
    <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: center;">
      <thead>
        <tr style="background: #f0f9ff; color: #0369a1; border-bottom: 2px solid #bae6fd;">
          <th style="padding: 6px; border: 1px solid #e2e8f0;">Sayı</th>
          <th style="padding: 6px; border: 1px solid #e2e8f0;">Birler Basamağı</th>
          <th style="padding: 6px; border: 1px solid #e2e8f0;">2 ile Bölünür mü?</th>
          <th style="padding: 6px; border: 1px solid #e2e8f0;">5 ile Bölünür mü?</th>
          <th style="padding: 6px; border: 1px solid #e2e8f0;">10 ile Bölünür mü?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 800;">4.870</td>
          <td style="padding: 6px; border: 1px solid #e2e8f0;">0</td>
          <td style="padding: 6px; border: 1px solid #e2e8f0; color: #16a34a; font-weight: 700;">EVET</td>
          <td style="padding: 6px; border: 1px solid #e2e8f0; color: #16a34a; font-weight: 700;">EVET</td>
          <td style="padding: 6px; border: 1px solid #e2e8f0; color: #16a34a; font-weight: 700;">EVET</td>
        </tr>
        <tr>
          <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 800;">7.325</td>
          <td style="padding: 6px; border: 1px solid #e2e8f0;">5</td>
          <td style="padding: 6px; border: 1px solid #e2e8f0;">( ..... )</td>
          <td style="padding: 6px; border: 1px solid #e2e8f0;">( ..... )</td>
          <td style="padding: 6px; border: 1px solid #e2e8f0;">( ..... )</td>
        </tr>
        <tr>
          <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 800;">6.148</td>
          <td style="padding: 6px; border: 1px solid #e2e8f0;">8</td>
          <td style="padding: 6px; border: 1px solid #e2e8f0;">( ..... )</td>
          <td style="padding: 6px; border: 1px solid #e2e8f0;">( ..... )</td>
          <td style="padding: 6px; border: 1px solid #e2e8f0;">( ..... )</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style="border: 2px solid #0284c7; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #0369a1; margin-bottom: 6px;">
      B BÖLÜMÜ: Eksik Basamak ve Kalan Problemleri (60 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      <strong>1. Soru:</strong> Dört basamaklı <strong>3.54A</strong> sayısı 2 ile kalansız bölünebilen bir doğal sayıdır. A yerine yazılabilecek rakamların toplamı kaçtır?<br/>
      A = { 0, 2, 4, 6, 8 } ⟹ Toplam = <strong>( ..... )</strong><br/><br/>
      <strong>2. Soru:</strong> Beş basamaklı <strong>82.71B</strong> sayısı 5 ile bölündüğünde 3 kalanını veren tek bir doğal sayıdır. Buna göre B rakamı kaçtır?<br/>
      B yerine 3 veya 8 gelebilir. Tek sayı şartı olduğundan B = <strong>( ..... )</strong>
    </div>
  </div>

  <div style="padding: 8px 12px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; font-size: 10px; color: #0369a1; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Tablo (40P) + Problemler (60P) = 100 Puan. (MAT.6.1.2)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-6-1-2-sumdigits',
    title: 'Etkinlik 2: "Rakamlar Toplamı ve 10\'luk Ayrıştırma (3 ve 9 Kriterleri)" (MAT.6.1.2)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.6.1.2',
    outcomeTitle: 'Bölünebilme Kriterlerini Doğal Sayıların Özellikleri ile İlişkilendirebilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Maarif Matematik ve Basamak Analiz Atölyesi',
    pageCount: 1,
    createdAt: '2026-09-10T10:00:00Z',
    fileSizeKb: 300,
    tags: ['Etkinlik Kağıdı', 'Bölünebilme', 'Rakamlar Toplamı', '3 ve 9 Kriterleri', 'MAT.6.1.2', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <div style="text-align: center; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #f5f3ff, #ede9fe); padding: 10px; border-radius: 12px; border: 1px solid #ddd6fe;">
    <div style="display: inline-block; background: #8b5cf6; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      🧮 10'LUK AYRIŞTIRMA & İSPAT (6. SINIF - MAT.6.1.2)
    </div>
    <h2 style="color: #6d28d9; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase;">
      RAKAMLAR TOPLAMI: 3 VE 9 İLE BÖLÜNEBİLME
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      100=99+1 ve 10=9+1 açılımı üzerinden rakamlar toplamı kuralını ispatlayıp uygulayınız.
    </p>
  </div>

  <div style="border: 2px solid #8b5cf6; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #6d28d9; margin-bottom: 6px;">
      A BÖLÜMÜ: Rakamlar Toplamı ve Bölünebilme Analizi (40 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      <strong>432 Sayısı:</strong> 4 + 3 + 2 = 9 ⟹ 3'e TAM BÖLÜNÜR, 9'a TAM BÖLÜNÜR.<br/>
      <strong>7.125 Sayısı:</strong> 7 + 1 + 2 + 5 = 15 ⟹ 3'e ( ..... ), 9 ile bölündüğünde kalan ( ..... )<br/>
      <strong>9.468 Sayısı:</strong> 9 + 4 + 6 + 8 = 27 ⟹ 3'e ( ..... ), 9'a ( ..... )
    </div>
  </div>

  <div style="border: 2px solid #8b5cf6; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #6d28d9; margin-bottom: 6px;">
      B BÖLÜMÜ: Gizli Rakam ve Kasa Problemleri (60 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      <strong>1. Soru:</strong> Dört basamaklı <strong>5.A24</strong> sayısı 9 ile kalansız bölünebilmektedir. Buna göre A rakamı kaçtır?<br/>
      5 + A + 2 + 4 = 11 + A ⟹ 11 + A = 18 ⟹ A = <strong>( ..... )</strong><br/><br/>
      <strong>2. Soru:</strong> Dört basamaklı <strong>4.2B1</strong> sayısının 3 ile kalansız bölünebilmesi için B yerine gelebilecek EN BÜYÜK rakam kaçtır?<br/>
      4 + 2 + B + 1 = 7 + B ⟹ B ∈ {2, 5, 8} ⟹ En Büyük B = <strong>( ..... )</strong>
    </div>
  </div>

  <div style="padding: 8px 12px; background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 8px; font-size: 10px; color: #6d28d9; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Analiz (40P) + Problemler (60P) = 100 Puan. (MAT.6.1.2)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-6-1-2-composite',
    title: 'Etkinlik 3: "Birleşik Kriterler ve Kasa Şifresi (4 ve 6 Kriterleri)" (MAT.6.1.2)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.6.1.2',
    outcomeTitle: 'Bölünebilme Kriterlerini Doğal Sayıların Özellikleri ile İlişkilendirebilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Maarif Matematik ve Basamak Analiz Atölyesi',
    pageCount: 1,
    createdAt: '2026-09-10T10:00:00Z',
    fileSizeKb: 305,
    tags: ['Etkinlik Kağıdı', 'Bölünebilme', '4 ve 6 Kriterleri', 'Kasa Şifresi', 'MAT.6.1.2', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <div style="text-align: center; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: 10px; border-radius: 12px; border: 1px solid #a7f3d0;">
    <div style="display: inline-block; background: #059669; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      🔐 BİRLEŞİK KRİTERLER (6. SINIF - MAT.6.1.2)
    </div>
    <h2 style="color: #047857; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase;">
      BİRLEŞİK KRİTERLER: 4 VE 6 İLE BÖLÜNEBİLME
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      Son iki basamak analizi ve hem 2 hem 3 şartlarını birleştirerek şifreli görevleri tamamlayınız.
    </p>
  </div>

  <div style="border: 2px solid #059669; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #047857; margin-bottom: 6px;">
      A BÖLÜMÜ: 4 ve 6 İle Bölünebilme Kriter Kontrolü (40 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      <strong>7.324 Sayısı:</strong> Son iki basamak: 24 (4'ün katı) ⟹ 4'e TAM BÖLÜNÜR.<br/>
      <strong>5.812 Sayısı:</strong> Son iki basamak 12 (4'ün katı) ⟹ 4'e ( ..... ); Rakamlar toplamı: 16 (3'ün katı değil) ⟹ 6'ya ( ..... )<br/>
      <strong>4.875 Sayısı:</strong> Tek sayı olduğundan 6'ya ( ..... )
    </div>
  </div>

  <div style="border: 2px solid #059669; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #047857; margin-bottom: 6px;">
      B BÖLÜMÜ: Kasa Şifresi Çözme Görevi (60 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      <strong>Kasa Görevi:</strong> Dört basamaklı <strong>2.A7B</strong> sayısı hem 5'e hem de 6'ya kalansız bölünebilen bir doğal sayıdır. Buna göre A rakamı en çok kaç olabilir?<br/>
      1. 5 ile bölünebilmesi ve 6 ile bölünmesi için çift olması gerektiğinden <strong>B = 0</strong>'dır.<br/>
      2. 2 + A + 7 + 0 = 9 + A ⟹ 3'ün katı olmalı: A ∈ {0, 3, 6, 9}<br/>
      3. A'nın alabileceği EN BÜYÜK değer = <strong>( ..... )</strong>
    </div>
  </div>

  <div style="padding: 8px 12px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; font-size: 10px; color: #047857; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Kriterler (40P) + Kasa Görevi (60P) = 100 Puan. (MAT.6.1.2)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  // =========================================================================
  // 6. SINIF: MAT.6.1.3 ASAL SAYILAR VE ASAL ÇARPANLAR ETKİNLİK KAĞITLARI
  // =========================================================================
  {
    id: 'file-activity-mat-6-1-3-sieve',
    title: 'Etkinlik 1: "Eratosthenes Asal Kalburu (1-100 Asal Sayı Keşfi)" (MAT.6.1.3)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.6.1.3',
    outcomeTitle: 'Asal Sayıları ve Asal Çarpanları Belirleyebilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Maarif Matematik ve Asallık Laboratuvarı',
    pageCount: 1,
    createdAt: '2026-09-10T10:00:00Z',
    fileSizeKb: 310,
    tags: ['Etkinlik Kağıdı', 'Asal Sayılar', 'Eratosthenes Kalburu', '1-100 Asallar', 'MAT.6.1.3', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <div style="text-align: center; border-bottom: 2px solid #d97706; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #fffbeb, #fef3c7); padding: 10px; border-radius: 12px; border: 1px solid #fde68a;">
    <div style="display: inline-block; background: #d97706; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      🛡️ ASAL SAYI KALBURU (6. SINIF - MAT.6.1.3)
    </div>
    <h2 style="color: #b45309; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase;">
      ERATOSTHENES KALBURU VE 1-100 ASAL SAYILARI
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      1'den 100'e kadar olan sayılarda asal olmayanları eleyerek 25 asal sayıyı belirleyiniz.
    </p>
  </div>

  <div style="border: 2px solid #d97706; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #b45309; margin-bottom: 6px;">
      A BÖLÜMÜ: Kalbur Eleme Adımları ve İlk 10 Asal (40 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      1. 1 sayısı asal sayı DEĞİLDİR (çünkü sadece 1 pozitif böleni vardır).<br/>
      2. 2 tek ÇİFT asal sayıdır. 2'nin 2 dışındaki tüm katları elenir.<br/>
      3. 50'den küçük ilk 10 asal sayıyı yazınız:<br/>
      <strong>{ 2, 3, 5, 7, 11, 13, 17, 19, ( ..... ), ( ..... ) }</strong>
    </div>
  </div>

  <div style="border: 2px solid #d97706; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #b45309; margin-bottom: 6px;">
      B BÖLÜMÜ: Asal Sayı Kavramı ve Doğru-Yanlış Analizi (60 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      <strong>1. İfade:</strong> Bütün tek sayılar asal sayıdır. ⟹ <strong>( YANLIŞ - Örn: 9, 15, 21 )</strong><br/>
      <strong>2. İfade:</strong> İki basamaklı en küçük asal sayı <strong>( ..... )</strong>'dir.<br/>
      <strong>3. İfade:</strong> İki basamaklı en büyük asal sayı <strong>( ..... )</strong>'dir.<br/>
      <strong>4. Soru:</strong> 1 ile 100 arasında toplam kaç tane asal sayı vardır? ⟹ <strong>( ..... ) Adet</strong>
    </div>
  </div>

  <div style="padding: 8px 12px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-size: 10px; color: #b45309; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Kalbur (40P) + Analiz (60P) = 100 Puan. (MAT.6.1.3)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-6-1-3-tree-algorithm',
    title: 'Etkinlik 2: "Çarpan Ağacı ve Asal Çarpan Algoritması" (MAT.6.1.3)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.6.1.3',
    outcomeTitle: 'Asal Sayıları ve Asal Çarpanları Belirleyebilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Maarif Matematik ve Asallık Laboratuvarı',
    pageCount: 1,
    createdAt: '2026-09-10T10:00:00Z',
    fileSizeKb: 315,
    tags: ['Etkinlik Kağıdı', 'Çarpan Ağacı', 'Bölme Algoritması', 'Üslü Gösterim', 'MAT.6.1.3', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <div style="text-align: center; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: 10px; border-radius: 12px; border: 1px solid #a7f3d0;">
    <div style="display: inline-block; background: #059669; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      🌳 ÇARPAN AĞACI & ALGORİTMA (6. SINIF - MAT.6.1.3)
    </div>
    <h2 style="color: #047857; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase;">
      ASAL ÇARPANLARA AYIRMA VE ÜSLÜ GÖSTERİM
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      Çarpan ağacı ve bölme algoritması yöntemleriyle sayıları asal çarpanlarının çarpımı şeklinde ifade ediniz.
    </p>
  </div>

  <div style="border: 2px solid #059669; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #047857; margin-bottom: 6px;">
      A BÖLÜMÜ: Çarpan Ağacı Modeli (40 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      <strong>60 Sayısı İçin:</strong><br/>
      60 = 6 × 10 ⟹ (2 × 3) × (2 × 5) ⟹ <strong>60 = 2² · 3 · 5</strong><br/>
      Asal çarpanları: <strong>{ 2, 3, 5 }</strong> (3 farklı asal çarpan)<br/><br/>
      <strong>84 Sayısı İçin Çarpan Ağacını Tamamlayınız:</strong><br/>
      84 = 4 × 21 ⟹ ( ..... × ..... ) × ( ..... × ..... ) ⟹ <strong>84 = 2² · ( ..... ) · ( ..... )</strong>
    </div>
  </div>

  <div style="border: 2px solid #059669; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #047857; margin-bottom: 6px;">
      B BÖLÜMÜ: Bölme Çizgisi Algoritması (60 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      <strong>72 Sayısı İçin:</strong> 72 | 2 ⟹ 36 | 2 ⟹ 18 | 2 ⟹ 9 | 3 ⟹ 3 | 3 ⟹ 1 ⟹ <strong>72 = 2³ · 3²</strong><br/><br/>
      <strong>120 Sayısı İçin Algoritmayı Uygulayınız:</strong><br/>
      120 sayısının asal çarpanlarına ayrılmış üslü biçimi = <strong>2^(.....) · 3^(.....) · 5^(.....)</strong><br/>
      120 sayısının asal çarpanlarının toplamı = 2 + 3 + 5 = <strong>( ..... )</strong>
    </div>
  </div>

  <div style="padding: 8px 12px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; font-size: 10px; color: #047857; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Ağaç (40P) + Algoritma (60P) = 100 Puan. (MAT.6.1.3)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-6-1-3-crypto',
    title: 'Etkinlik 3: "Asal Şifreleme ve Kripto Kasa Görevi" (MAT.6.1.3)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.6.1.3',
    outcomeTitle: 'Asal Sayıları ve Asal Çarpanları Belirleyebilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Maarif Matematik ve Asallık Laboratuvarı',
    pageCount: 1,
    createdAt: '2026-09-10T10:00:00Z',
    fileSizeKb: 320,
    tags: ['Etkinlik Kağıdı', 'Kriptografi', 'Asal Şifreleme', 'Problem Çözme', 'MAT.6.1.3', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <div style="text-align: center; border-bottom: 2px solid #7c3aed; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #f5f3ff, #ede9fe); padding: 10px; border-radius: 12px; border: 1px solid #ddd6fe;">
    <div style="display: inline-block; background: #7c3aed; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      🔐 KRİPTOGRAFİ LABORATUVARI (6. SINIF - MAT.6.1.3)
    </div>
    <h2 style="color: #6d28d9; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase;">
      ASAL ŞİFRELEME VE KRİPTO KASA GÖREVİ
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      İki asal sayının çarpımı ile oluşturulan güvenlik kodlarını asal çarpanlarına ayırarak çözünüz.
    </p>
  </div>

  <div style="border: 2px solid #7c3aed; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #6d28d9; margin-bottom: 6px;">
      A BÖLÜMÜ: Kripto Şifre Çözme Tablosu (40 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      <strong>Kasa 1 Kodu:</strong> 221 ⟹ Asal Anahtarlar: <strong>13 × 17</strong><br/>
      <strong>Kasa 2 Kodu:</strong> 119 ⟹ Asal Anahtarlar: <strong>7 × ( ..... )</strong><br/>
      <strong>Kasa 3 Kodu:</strong> 323 ⟹ Asal Anahtarlar: <strong>17 × ( ..... )</strong>
    </div>
  </div>

  <div style="border: 2px solid #7c3aed; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #6d28d9; margin-bottom: 6px;">
      B BÖLÜMÜ: Asal Çarpanlı Gerçek Hayat Problemleri (60 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      <strong>Problem 1:</strong> Bir yardım deposundaki kolilerin üzerinde yazan sayı 180'dir. Bu sayının asal çarpanlarının toplamı olan yaşındaki gönüllü öğrenci depoda görev almaktadır. Bu öğrenci kaç yaşındadır?<br/>
      180 = 2² · 3² · 5 ⟹ Asal Çarpanlar: { 2, 3, 5 } ⟹ Yaş = 2 + 3 + 5 = <strong>( ..... )</strong><br/><br/>
      <strong>Problem 2:</strong> Bir dijital kasanın şifresi, 90 sayısının asal çarpanlarının küçükten büyüğe sırasıyla üsleri yazılarak oluşturulmuştur (90 = 2^a · 3^b · 5^c ⟹ Şifre abc). Kasa şifresi kaçtır?<br/>
      90 = 2¹ · 3² · 5¹ ⟹ Şifre = <strong>( ..... )</strong>
    </div>
  </div>

  <div style="padding: 8px 12px; background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 8px; font-size: 10px; color: #6d28d9; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Kasa (40P) + Problemler (60P) = 100 Puan. (MAT.6.1.3)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  // =========================================================================
  // 6. SINIF: MAT.6.1.4 ORTAK BÖLEN VE ORTAK KAT ETKİNLİK KAĞITLARI
  // =========================================================================
  {
    id: 'file-activity-mat-6-1-4-common-divisors',
    title: 'Etkinlik 1: "Zeytinyağı ve Nar Ekşisi Ortak Bidonlama (Ortak Bölenler)" (MAT.6.1.4)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.6.1.4',
    outcomeTitle: 'Doğal Sayıların Ortak Bölenleri ile Ortak Katlarını Belirleyebilme ve Problem Çözebilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Maarif Matematik ve Paylaşım Atölyesi',
    pageCount: 1,
    createdAt: '2026-09-10T10:00:00Z',
    fileSizeKb: 310,
    tags: ['Etkinlik Kağıdı', 'Ortak Bölenler', 'Paylaşım', 'Bidonlama', 'MAT.6.1.4', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <div style="text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #f0fdfa, #ccfbf1); padding: 10px; border-radius: 12px; border: 1px solid #99f6e4;">
    <div style="display: inline-block; background: #0d9488; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      🛢️ ORTAK BÖLENLER KÜMESİ (6. SINIF - MAT.6.1.4)
    </div>
    <h2 style="color: #0f766e; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase;">
      ZEYTİNYAĞI VE NAR EKŞİSİ ORTAK BİDONLAMA
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      İki farklı sayının bölen kümelerini listeleyip kesişim kümesini (ortak bölenleri) bulunuz.
    </p>
  </div>

  <div style="border: 2px solid #0d9488; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #0f766e; margin-bottom: 6px;">
      A BÖLÜMÜ: Bölen Kümeleri ve Kesişim Analizi (40 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      24 Litre Zeytinyağının Bölenleri: <strong>A = { 1, 2, 3, 4, 6, 8, 12, 24 }</strong><br/>
      36 Litre Nar Ekşisinin Bölenleri: <strong>B = { 1, 2, 3, 4, 6, 9, 12, 18, 36 }</strong><br/>
      Her İki Sıvı İçin Kullanılabilecek Ortak Kap Hacimleri (A ∩ B):<br/>
      <strong>A ∩ B = { ( ..... ), ( ..... ), ( ..... ), ( ..... ), ( ..... ), ( ..... ) }</strong> Litre
    </div>
  </div>

  <div style="border: 2px solid #0d9488; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #0f766e; margin-bottom: 6px;">
      B BÖLÜMÜ: Eşit Paylaştırma ve En Büyük Kap Problemi (60 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      <strong>1. Soru:</strong> Zeytinyağı ve nar ekşisi hiç artmayacak ve birbirine karışmayacak şekilde EN BÜYÜK hacimli eşit bidonlara doldurulacaktır. Bir bidon kaç litre olmalıdır?<br/>
      Ortak bölenlerin en büyüğü = <strong>( ..... ) Litre</strong><br/><br/>
      <strong>2. Soru:</strong> Bu iş için TOPLAM kaç adet bidon kullanılır?<br/>
      Zeytinyağı için: 24 ÷ 12 = 2 bidon<br/>
      Nar ekşisi için: 36 ÷ 12 = 3 bidon<br/>
      Toplam = 2 + 3 = <strong>( ..... ) Adet Bidon</strong>
    </div>
  </div>

  <div style="padding: 8px 12px; background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; font-size: 10px; color: #0f766e; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Kümeler (40P) + Problemler (60P) = 100 Puan. (MAT.6.1.4)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-6-1-4-common-multiples',
    title: 'Etkinlik 2: "Periyodik Seferler ve Durak Buluşması (Ortak Katlar)" (MAT.6.1.4)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.6.1.4',
    outcomeTitle: 'Doğal Sayıların Ortak Bölenleri ile Ortak Katlarını Belirleyebilme ve Problem Çözebilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Maarif Matematik ve Paylaşım Atölyesi',
    pageCount: 1,
    createdAt: '2026-09-10T10:00:00Z',
    fileSizeKb: 315,
    tags: ['Etkinlik Kağıdı', 'Ortak Katlar', 'Periyodik Olaylar', 'Sayı Doğrusu', 'MAT.6.1.4', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <div style="text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 10px; border-radius: 12px; border: 1px solid #bae6fd;">
    <div style="display: inline-block; background: #0284c7; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      🚌 PERİYODİK ORTAK KATLAR (6. SINIF - MAT.6.1.4)
    </div>
    <h2 style="color: #0369a1; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase;">
      PERİYODİK SEFERLER VE DURAK BULUŞMASI
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      Ritmik olarak tekrarlanan periyotların ortak katlarını sayı doğrusu üzerinde belirleyiniz.
    </p>
  </div>

  <div style="border: 2px solid #0284c7; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #0369a1; margin-bottom: 6px;">
      A BÖLÜMÜ: Ortak Katlar Tablosu (40 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      A Otobüsü: Her 6 dakikada bir sefer yapıyor (6, 12, 18, 24, 30, 36, 42, 48, 54, 60...)<br/>
      B Otobüsü: Her 8 dakikada bir sefer yapıyor (8, 16, 24, 32, 40, 48, 56, 64, 72...)<br/>
      İki otobüsün ilk 3 ortak kalkış dakikalarını yazınız:<br/>
      <strong>1. Buluşma: ( ..... ). dk | 2. Buluşma: ( ..... ). dk | 3. Buluşma: ( ..... ). dk</strong>
    </div>
  </div>

  <div style="border: 2px solid #0284c7; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #0369a1; margin-bottom: 6px;">
      B BÖLÜMÜ: Periyodik Problem Çözme (60 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      <strong>1. Soru:</strong> İki hemşireden biri 4 günde bir, diğeri 6 günde bir nöbet tutmaktadır. Birlikte ilk nöbetlerini tuttuktan sonra EN AZ kaç gün sonra tekrar birlikte nöbet tutarlar?<br/>
      4'ün katları: 4, 8, 12, 16... | 6'nın katları: 6, 12, 18...<br/>
      Birlikte nöbet = <strong>( ..... ) Gün Sonra</strong><br/><br/>
      <strong>2. Soru:</strong> Bir limandaki iki deniz fenerinden biri 15 saniyede, diğeri 20 saniyede bir yanıp sönmektedir. Birlikte yandıktan sonra 2 dakika (120 saniye) içinde kaç kez daha birlikte yanarlar?<br/>
      Ortak kat: 60 saniye ⟹ 120 saniye içinde = 120 ÷ 60 = <strong>( ..... ) Kez Daha</strong>
    </div>
  </div>

  <div style="padding: 8px 12px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; font-size: 10px; color: #0369a1; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Katlar (40P) + Problemler (60P) = 100 Puan. (MAT.6.1.4)</span>
    <span style="font-weight: 800; font-family: monospace;">www.maarifakademi.com.tr</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: 'file-activity-mat-6-1-4-coprime-garden',
    title: 'Etkinlik 3: "Merhamet Bahçesi ve Aralarında Asallık Testi" (MAT.6.1.4)',
    classSection: 'Tümü',
    outcomeCode: 'MAT.6.1.4',
    outcomeTitle: 'Doğal Sayıların Ortak Bölenleri ile Ortak Katlarını Belirleyebilme ve Problem Çözebilme',
    authorName: 'Millî Eğitim Bakanlığı',
    authorRole: 'teacher',
    school: 'Maarif Matematik ve Paylaşım Atölyesi',
    pageCount: 1,
    createdAt: '2026-09-10T10:00:00Z',
    fileSizeKb: 320,
    tags: ['Etkinlik Kağıdı', 'Aralarında Asallık', 'Bahçe Parselleme', 'Ortak Bölen', 'MAT.6.1.4', 'Değerlendirme'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        backgroundType: 'grid',
        textContent: `<div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
  <div style="text-align: center; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: 10px; border-radius: 12px; border: 1px solid #a7f3d0;">
    <div style="display: inline-block; background: #059669; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 3px;">
      🌱 ARALARINDA ASALLIK & MERHAMET BAHÇESİ (6. SINIF - MAT.6.1.4)
    </div>
    <h2 style="color: #047857; font-size: 16px; font-weight: 900; margin: 0; text-transform: uppercase;">
      MERHAMET BAHÇESİ VE ARALARINDA ASALLIK TESTİ
    </h2>
    <p style="color: #475569; font-size: 11px; margin: 3px 0 0 0; font-weight: 600;">
      1'den başka ortak böleni olmayan sayı çiftlerini keşfederek bahçe parselleme ve ağaçlandırma problemlerini çözünüz.
    </p>
  </div>

  <div style="border: 2px solid #059669; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #047857; margin-bottom: 6px;">
      A BÖLÜMÜ: Aralarında Asallık Test Tablosu (40 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      <strong>8 ve 15:</strong> 8'in bölenleri {1,2,4,8}, 15'in bölenleri {1,3,5,15} ⟹ Ortak bölen: {1} ⟹ <strong>ARALARINDA ASALDIR.</strong><br/>
      <strong>9 ve 21:</strong> Ortak bölenleri {1, 3} ⟹ <strong>( ARALARINDA ASAL DEĞİLDİR )</strong><br/>
      <strong>14 ve 25:</strong> 14'ün bölenleri {1,2,7,14}, 25'in bölenleri {1,5,25} ⟹ <strong>( ..... )</strong><br/>
      <strong>12 ve 35:</strong> Ortak böleni yalnızca 1 olduğundan ⟹ <strong>( ..... )</strong>
    </div>
  </div>

  <div style="border: 2px solid #059669; border-radius: 10px; padding: 10px; background: #ffffff; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 900; color: #047857; margin-bottom: 6px;">
      B BÖLÜMÜ: Merhamet Bahçesi Ağaç Dikim Problemi (60 Puan)
    </div>
    <div style="font-size: 11px; line-height: 1.6; color: #334155;">
      <strong>Problem:</strong> Kenar uzunlukları 40 metre ve 60 metre olan dikdörtgen şeklindeki Merhamet Bahçesi'nin etrafına köşelere de gelmek şartıyla eşit aralıklarla fidan dikilecektir.<br/>
      1. İki fidan arasındaki mesafe kaç farklı tam sayı değeri alabilir? (40 ve 60'ın ortak bölenleri: 1, 2, 4, 5, 10, 20) ⟹ <strong>( ..... ) Farklı Değer</strong><br/>
      2. En az sayıda fidan kullanmak için fidanlar kaçar metre aralıkla dikilmelidir? ⟹ <strong>( ..... ) Metre</strong><br/>
      3. Bu durumda toplam kaç adet fidan gerekir? (Çevre = 200m ⟹ 200 ÷ 20) = <strong>( ..... ) Adet Fidan</strong>
    </div>
  </div>

  <div style="padding: 8px 12px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; font-size: 10px; color: #047857; display: flex; justify-content: space-between; align-items: center;">
    <span>🎯 <strong>Toplam Puan:</strong> Test (40P) + Bahçe Problemi (60P) = 100 Puan. (MAT.6.1.4)</span>
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

    case 'heptagon': {
      const pts: string[] = [];
      for (let i = 0; i < 7; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 7;
        const x = W / 2 + (W / 2 - sw / 2) * Math.cos(angle);
        const y = H / 2 + (H / 2 - sw / 2) * Math.sin(angle);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      innerSvg = `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${dashAttr} />`;
      break;
    }

    case 'octagon': {
      const pts: string[] = [];
      for (let i = 0; i < 8; i++) {
        const angle = -Math.PI / 2 + Math.PI / 8 + (i * 2 * Math.PI) / 8;
        const x = W / 2 + (W / 2 - sw / 2) * Math.cos(angle);
        const y = H / 2 + (H / 2 - sw / 2) * Math.sin(angle);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      innerSvg = `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${dashAttr} />`;
      break;
    }

    case 'cylinder': {
      const cx = W / 2;
      const rx = Math.max(10, W * 0.45 - sw);
      const ry = Math.max(6, H * 0.14);
      const topY = ry + sw;
      const botY = H - ry - sw;
      const bodyFill = fill === 'transparent' ? '#0d948815' : fill;
      const topFill = fill === 'transparent' ? '#0d948825' : fill;
      innerSvg = `
        <path d="M ${cx - rx} ${topY} L ${cx - rx} ${botY} A ${rx} ${ry} 0 0 0 ${cx + rx} ${botY} L ${cx + rx} ${topY} A ${rx} ${ry} 0 0 1 ${cx - rx} ${topY} Z" fill="${bodyFill}" />
        <path d="M ${cx - rx} ${botY} A ${rx} ${ry} 0 0 1 ${cx + rx} ${botY}" fill="none" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <path d="M ${cx - rx} ${botY} A ${rx} ${ry} 0 0 0 ${cx + rx} ${botY}" fill="none" stroke="${stroke}" stroke-width="${sw}" />
        <line x1="${cx - rx}" y1="${topY}" x2="${cx - rx}" y2="${botY}" stroke="${stroke}" stroke-width="${sw}" />
        <line x1="${cx + rx}" y1="${topY}" x2="${cx + rx}" y2="${botY}" stroke="${stroke}" stroke-width="${sw}" />
        <ellipse cx="${cx}" cy="${topY}" rx="${rx}" ry="${ry}" fill="${topFill}" stroke="${stroke}" stroke-width="${sw}" />
      `;
      break;
    }

    case 'cube': {
      const size = Math.min(W * 0.62, H * 0.62);
      const x0 = W * 0.12;
      const y0 = H - size - H * 0.08;
      const dx = size * 0.45;
      const dy = -size * 0.35;
      const cubeFill = fill === 'transparent' ? '#0284c715' : fill;
      const topFill = fill === 'transparent' ? '#0284c725' : fill;
      const sideFill = fill === 'transparent' ? '#0284c720' : fill;
      innerSvg = `
        <polygon points="${x0},${y0} ${x0 + dx},${y0 + dy} ${x0 + size + dx},${y0 + dy} ${x0 + size},${y0}" fill="${topFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <polygon points="${x0 + size},${y0} ${x0 + size + dx},${y0 + dy} ${x0 + size + dx},${y0 + size + dy} ${x0 + size},${y0 + size}" fill="${sideFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <polygon points="${x0},${y0} ${x0 + size},${y0} ${x0 + size},${y0 + size} ${x0},${y0 + size}" fill="${cubeFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <line x1="${x0 + dx}" y1="${y0 + dy}" x2="${x0 + dx}" y2="${y0 + size + dy}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${x0 + dx}" y1="${y0 + size + dy}" x2="${x0 + size + dx}" y2="${y0 + size + dy}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${x0}" y1="${y0 + size}" x2="${x0 + dx}" y2="${y0 + size + dy}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
      `;
      break;
    }

    case 'rectangular_prism': {
      const fw = W * 0.65;
      const fh = H * 0.52;
      const x0 = W * 0.1;
      const y0 = H - fh - H * 0.08;
      const dx = W * 0.22;
      const dy = -H * 0.22;
      const pFill = fill === 'transparent' ? '#6366f115' : fill;
      const topFill = fill === 'transparent' ? '#6366f125' : fill;
      const sideFill = fill === 'transparent' ? '#6366f120' : fill;
      innerSvg = `
        <polygon points="${x0},${y0} ${x0 + dx},${y0 + dy} ${x0 + fw + dx},${y0 + dy} ${x0 + fw},${y0}" fill="${topFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <polygon points="${x0 + fw},${y0} ${x0 + fw + dx},${y0 + dy} ${x0 + fw + dx},${y0 + fh + dy} ${x0 + fw},${y0 + fh}" fill="${sideFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <polygon points="${x0},${y0} ${x0 + fw},${y0} ${x0 + fw},${y0 + fh} ${x0},${y0 + fh}" fill="${pFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <line x1="${x0 + dx}" y1="${y0 + dy}" x2="${x0 + dx}" y2="${y0 + fh + dy}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${x0 + dx}" y1="${y0 + fh + dy}" x2="${x0 + fw + dx}" y2="${y0 + fh + dy}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${x0}" y1="${y0 + fh}" x2="${x0 + dx}" y2="${y0 + fh + dy}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
      `;
      break;
    }

    case 'cone': {
      const apexX = W / 2;
      const apexY = H * 0.1;
      const cx = W / 2;
      const rx = Math.max(10, W * 0.44 - sw);
      const ry = Math.max(6, H * 0.15);
      const botY = H - ry - sw;
      const coneFill = fill === 'transparent' ? '#f59e0b15' : fill;
      innerSvg = `
        <path d="M ${cx - rx} ${botY} L ${apexX} ${apexY} L ${cx + rx} ${botY} A ${rx} ${ry} 0 0 1 ${cx - rx} ${botY} Z" fill="${coneFill}" />
        <path d="M ${cx - rx} ${botY} A ${rx} ${ry} 0 0 1 ${cx + rx} ${botY}" fill="none" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <path d="M ${cx - rx} ${botY} A ${rx} ${ry} 0 0 0 ${cx + rx} ${botY}" fill="none" stroke="${stroke}" stroke-width="${sw}" />
        <line x1="${cx - rx}" y1="${botY}" x2="${apexX}" y2="${apexY}" stroke="${stroke}" stroke-width="${sw}" />
        <line x1="${cx + rx}" y1="${botY}" x2="${apexX}" y2="${apexY}" stroke="${stroke}" stroke-width="${sw}" />
        <line x1="${apexX}" y1="${apexY}" x2="${cx}" y2="${botY}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.7)}" stroke-dasharray="3,3" opacity="0.45" />
      `;
      break;
    }

    case 'square_prism': {
      const cx = W / 2;
      const rx = W * 0.38;
      const ry = H * 0.14;
      const topY = H * 0.22;
      const botY = H * 0.78;
      const topDiamond = `${cx},${topY - ry} ${cx + rx},${topY} ${cx},${topY + ry} ${cx - rx},${topY}`;
      const prFill = fill === 'transparent' ? '#10b98115' : fill;
      const topFill = fill === 'transparent' ? '#10b98125' : fill;
      innerSvg = `
        <polygon points="${cx - rx},${topY} ${cx},${topY + ry} ${cx},${botY + ry} ${cx - rx},${botY}" fill="${prFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <polygon points="${cx},${topY + ry} ${cx + rx},${topY} ${cx + rx},${botY} ${cx},${botY + ry}" fill="${prFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <polygon points="${topDiamond}" fill="${topFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <line x1="${cx},${topY - ry}" x2="${cx},${botY - ry}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${cx - rx},${botY}" x2="${cx},${botY - ry}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${cx + rx},${botY}" x2="${cx},${botY - ry}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
      `;
      break;
    }

    case 'triangular_pyramid': {
      const apexX = W / 2;
      const apexY = H * 0.12;
      const ptLeft = { x: W * 0.14, y: H * 0.74 };
      const ptFront = { x: W * 0.48, y: H * 0.90 };
      const ptRight = { x: W * 0.86, y: H * 0.76 };
      const pyFill = fill === 'transparent' ? '#ec489915' : fill;
      innerSvg = `
        <polygon points="${apexX},${apexY} ${ptLeft.x},${ptLeft.y} ${ptFront.x},${ptFront.y}" fill="${pyFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <polygon points="${apexX},${apexY} ${ptFront.x},${ptFront.y} ${ptRight.x},${ptRight.y}" fill="${pyFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <line x1="${ptLeft.x}" y1="${ptLeft.y}" x2="${ptRight.x}" y2="${ptRight.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
      `;
      break;
    }

    case 'square_pyramid': {
      const apexX = W / 2;
      const apexY = H * 0.1;
      const ptBL = { x: W * 0.26, y: H * 0.65 };
      const ptBR = { x: W * 0.82, y: H * 0.65 };
      const ptFR = { x: W * 0.72, y: H * 0.88 };
      const ptFL = { x: W * 0.18, y: H * 0.88 };
      const pyFill = fill === 'transparent' ? '#f9731615' : fill;
      innerSvg = `
        <polygon points="${apexX},${apexY} ${ptFL.x},${ptFL.y} ${ptFR.x},${ptFR.y}" fill="${pyFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <polygon points="${apexX},${apexY} ${ptFR.x},${ptFR.y} ${ptBR.x},${ptBR.y}" fill="${pyFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <line x1="${ptFL.x}" y1="${ptFL.y}" x2="${ptBL.x}" y2="${ptBL.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${apexX}" y1="${apexY}" x2="${ptBL.x}" y2="${ptBL.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${ptBL.x}" y1="${ptBL.y}" x2="${ptBR.x}" y2="${ptBR.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
      `;
      break;
    }

    case 'rectangular_pyramid': {
      const apexX = W / 2;
      const apexY = H * 0.1;
      const ptBL = { x: W * 0.22, y: H * 0.62 };
      const ptBR = { x: W * 0.88, y: H * 0.62 };
      const ptFR = { x: W * 0.78, y: H * 0.88 };
      const ptFL = { x: W * 0.12, y: H * 0.88 };
      const pyFill = fill === 'transparent' ? '#8b5cf615' : fill;
      innerSvg = `
        <polygon points="${apexX},${apexY} ${ptFL.x},${ptFL.y} ${ptFR.x},${ptFR.y}" fill="${pyFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <polygon points="${apexX},${apexY} ${ptFR.x},${ptFR.y} ${ptBR.x},${ptBR.y}" fill="${pyFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <line x1="${apexX}" y1="${apexY}" x2="${ptBL.x}" y2="${ptBL.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${ptBL.x}" y1="${ptBL.y}" x2="${ptBR.x}" y2="${ptBR.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${ptFL.x}" y1="${ptFL.y}" x2="${ptBL.x}" y2="${ptBL.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
      `;
      break;
    }

    case 'pentagonal_pyramid': {
      const apexX = W / 2;
      const apexY = H * 0.1;
      const cx = W / 2;
      const cy = H * 0.78;
      const rx = W * 0.42;
      const ry = H * 0.15;
      const v0 = { x: cx - rx, y: cy };
      const v1 = { x: cx - rx * 0.62, y: cy + ry * 0.82 };
      const v2 = { x: cx + rx * 0.62, y: cy + ry * 0.82 };
      const v3 = { x: cx + rx, y: cy };
      const v4 = { x: cx, y: cy - ry };
      const pyFill = fill === 'transparent' ? '#14b8a615' : fill;
      innerSvg = `
        <polygon points="${apexX},${apexY} ${v0.x},${v0.y} ${v1.x},${v1.y}" fill="${pyFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <polygon points="${apexX},${apexY} ${v1.x},${v1.y} ${v2.x},${v2.y}" fill="${pyFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <polygon points="${apexX},${apexY} ${v2.x},${v2.y} ${v3.x},${v3.y}" fill="${pyFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <line x1="${apexX}" y1="${apexY}" x2="${v4.x}" y2="${v4.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${v0.x}" y1="${v0.y}" x2="${v4.x}" y2="${v4.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${v3.x}" y1="${v3.y}" x2="${v4.x}" y2="${v4.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
      `;
      break;
    }

    case 'hexagonal_pyramid': {
      const apexX = W / 2;
      const apexY = H * 0.1;
      const cx = W / 2;
      const cy = H * 0.78;
      const rx = W * 0.42;
      const ry = H * 0.15;
      const v0 = { x: cx - rx, y: cy };
      const v1 = { x: cx - rx * 0.5, y: cy + ry * 0.86 };
      const v2 = { x: cx + rx * 0.5, y: cy + ry * 0.86 };
      const v3 = { x: cx + rx, y: cy };
      const v4 = { x: cx + rx * 0.5, y: cy - ry * 0.86 };
      const v5 = { x: cx - rx * 0.5, y: cy - ry * 0.86 };
      const pyFill = fill === 'transparent' ? '#06b6d415' : fill;
      innerSvg = `
        <polygon points="${apexX},${apexY} ${v0.x},${v0.y} ${v1.x},${v1.y}" fill="${pyFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <polygon points="${apexX},${apexY} ${v1.x},${v1.y} ${v2.x},${v2.y}" fill="${pyFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <polygon points="${apexX},${apexY} ${v2.x},${v2.y} ${v3.x},${v3.y}" fill="${pyFill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" />
        <line x1="${apexX}" y1="${apexY}" x2="${v4.x}" y2="${v4.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${apexX}" y1="${apexY}" x2="${v5.x}" y2="${v5.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${v3.x}" y1="${v3.y}" x2="${v4.x}" y2="${v4.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${v4.x}" y1="${v4.y}" x2="${v5.x}" y2="${v5.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
        <line x1="${v5.x}" y1="${v5.y}" x2="${v0.x}" y2="${v0.y}" stroke="${stroke}" stroke-width="${Math.max(1, sw * 0.8)}" stroke-dasharray="4,4" opacity="0.6" />
      `;
      break;
    }

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
