const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function getBase64Image(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath).toLowerCase().replace('.', '');
      const format = ext === 'jpg' ? 'JPEG' : ext.toUpperCase();
      const bitmap = fs.readFileSync(fullPath);
      const base64 = Buffer.from(bitmap).toString('base64');
      return { dataUri: `data:image/${ext === 'jpg' ? 'jpeg' : 'png'};base64,${base64}`, format };
    }
  } catch (err) {
    console.error('Image load error:', filePath, err);
  }
  return null;
}

function generateMEBPromotionalPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  // Load Full Unicode TrueType Fonts for 100% Native Turkish Character Support
  const fontRegularPath = '/System/Library/Fonts/Supplemental/Arial.ttf';
  const fontBoldPath = '/System/Library/Fonts/Supplemental/Arial Bold.ttf';
  const fontItalicPath = '/System/Library/Fonts/Supplemental/Arial Italic.ttf';

  if (fs.existsSync(fontRegularPath)) {
    const regularFontBase64 = fs.readFileSync(fontRegularPath).toString('base64');
    doc.addFileToVFS('Arial-Regular.ttf', regularFontBase64);
    doc.addFont('Arial-Regular.ttf', 'Arial', 'normal');
  }

  if (fs.existsSync(fontBoldPath)) {
    const boldFontBase64 = fs.readFileSync(fontBoldPath).toString('base64');
    doc.addFileToVFS('Arial-Bold.ttf', boldFontBase64);
    doc.addFont('Arial-Bold.ttf', 'Arial', 'bold');
  }

  if (fs.existsSync(fontItalicPath)) {
    const italicFontBase64 = fs.readFileSync(fontItalicPath).toString('base64');
    doc.addFileToVFS('Arial-Italic.ttf', italicFontBase64);
    doc.addFont('Arial-Italic.ttf', 'Arial', 'italic');
  }

  doc.setFont('Arial', 'normal');

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  const totalPages = 5;

  // Modern Corporate & Pedagogical Palette
  const darkNavy = [15, 23, 42];      // #0f172a
  const tealPrimary = [13, 148, 136];  // #0d9488
  const tealDark = [17, 94, 89];      // #115e59
  const tealLight = [240, 253, 250];  // #f0fdfa
  const amberAccent = [245, 158, 11]; // #f59e0b
  const amberLight = [254, 243, 199]; // #fef3c7
  const slateGray = [100, 116, 139];   // #64748b
  const slateDark = [51, 65, 85];     // #334155
  const slateLight = [248, 250, 252]; // #f8fafc
  const slateBorder = [226, 232, 240];// #e2e8f0
  const emeraldGreen = [16, 185, 129];// #10b981
  const indigoColor = [79, 70, 229];  // #4f46e5
  const indigoLight = [238, 242, 255];// #eef2ff
  const roseColor = [225, 29, 72];    // #e11d48
  const roseLight = [255, 241, 242];  // #fff1f2
  const white = [255, 255, 255];

  function addHeaderFooter(pageNum, sectionTitle) {
    // Header
    doc.setFillColor(...slateLight);
    doc.roundedRect(margin, 8, contentWidth, 9, 2, 2, 'F');
    doc.setDrawColor(...tealPrimary);
    doc.setLineWidth(0.4);
    doc.line(margin, 17, margin + contentWidth, 17);

    doc.setFont('Arial', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...tealDark);
    doc.text('T.C. MİLLÎ EĞİTİM BAKANLIĞI | YENİLİKÇİ ÖĞRETMENLER PROJE BAŞVURU DOSYASI', margin + 3, 13.5);

    doc.setFont('Arial', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...slateGray);
    doc.text(sectionTitle, margin + contentWidth - 3, 13.5, { align: 'right' });

    // Footer
    doc.setDrawColor(...slateBorder);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, margin + contentWidth, pageHeight - 12);

    doc.setFontSize(7);
    doc.setTextColor(...slateGray);
    doc.text('Maarif Akademi: Türkiye Yüzyılı Maarif Modeli Dijital Matematik Platformu (maarifakademi.com.tr)', margin, pageHeight - 7.5);
    doc.text(`Sayfa ${pageNum} / ${totalPages}`, margin + contentWidth, pageHeight - 7.5, { align: 'right' });
  }

  // =========================================================================
  // SAYFA 1: RESMİ BAŞVURU KAPAK VE YÖNETİCİ ÖZETİ
  // =========================================================================
  doc.setFillColor(...darkNavy);
  doc.rect(0, 0, pageWidth, 112, 'F');

  // Decorative dual lines
  doc.setFillColor(...tealPrimary);
  doc.rect(0, 110, pageWidth, 3.5, 'F');
  doc.setFillColor(...amberAccent);
  doc.rect(0, 113.5, pageWidth, 1.5, 'F');

  // Brand Logo
  const logo = getBase64Image('public/brand/maarif-logo.png') || getBase64Image('public/logo-192.png');
  if (logo) {
    doc.addImage(logo.dataUri, logo.format, margin, 14, 20, 20, undefined, 'FAST');
  }

  // Top Category Pill
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin + 24, 16, 118, 7, 2, 2, 'F');
  doc.setFont('Arial', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...amberAccent);
  doc.text('MEB EĞİTİMDE YENİLİKÇİ YAKLAŞIMLAR VE İYİ ÖRNEKLER', margin + 27, 20.8);

  // Main Heading
  doc.setFont('Arial', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...white);
  doc.text('MAARİF AKADEMİ', margin, 44);

  doc.setFontSize(11);
  doc.setTextColor(...tealPrimary);
  doc.text('Türkiye Yüzyılı Maarif Modeli Akıllı Tahta ve Dijital Matematik Eğitim Kiti', margin, 52);

  // Subtitle / Vision
  doc.setFont('Arial', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  const coverVision =
    'Millî Kültür temalı çizgi roman hikâye kancası, dokunmatik sanal geometri atölyesi, 70+ ders oyunu, tek tıkla MEB ders planı üretimi ve şifresiz QR tahta giriş teknolojisiyle donatılmış yeni nesil hibrit öğrenme ekosistemi (maarifakademi.com.tr).';
  doc.text(doc.splitTextToSize(coverVision, contentWidth), margin, 60);

  // 4 Key Indicator Badges on Dark Banner
  const metricItems = [
    { label: 'Maarif Modeli Uyumu', val: '%100 Uyumlu' },
    { label: 'Eğitim Oyunları', val: '70+ Özel Oyun' },
    { label: 'Fatih Projesi Tahtaları', val: '81 İl Faz 1-2-3' },
    { label: 'Kurulum & Maliyet', val: 'Sıfır Ek Maliyet' }
  ];

  const mBoxW = (contentWidth - 9) / 4;
  metricItems.forEach((m, idx) => {
    const x = margin + idx * (mBoxW + 3);
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(x, 82, mBoxW, 20, 2, 2, 'F');
    doc.setDrawColor(51, 65, 85);
    doc.roundedRect(x, 82, mBoxW, 20, 2, 2, 'D');

    doc.setFont('Arial', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...amberAccent);
    doc.text(m.val, x + mBoxW / 2, 91, { align: 'center' });

    doc.setFont('Arial', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(203, 213, 225);
    doc.text(m.label, x + mBoxW / 2, 97, { align: 'center' });
  });

  // LOWER SECTION OF PAGE 1: EXECUTIVE SUMMARY & APPLICATION CONTEXT
  let yPos = 126;

  doc.setFont('Arial', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkNavy);
  doc.text('1. PROJE YÖNETİCİ ÖZETİ VE PROBLEMİN TANIMI', margin, yPos);
  yPos += 6;

  // Problem Box
  doc.setFillColor(...roseLight);
  doc.roundedRect(margin, yPos, contentWidth, 34, 2, 2, 'F');
  doc.setDrawColor(...roseColor);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, yPos, contentWidth, 34, 2, 2, 'D');

  doc.setFont('Arial', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...roseColor);
  doc.text('Sahada Karşılaşılan Temel Eğitimsel Problemler:', margin + 4, yPos + 6);

  doc.setFont('Arial', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateDark);
  const problems = [
    'Matematik derslerinde soyut kavramların (doğru, ışın, açı, rasyonel sayılar) ezbere dayalı anlatılması ve öğrenci ilgisinin hızla dağılması.',
    'Akıllı tahtaların sadece PDF yansıtma aracı olarak kullanılması; dokunmatik ve etkileşimli potansiyelinin yeterince değerlendirilememesi.',
    'Öğretmenlerin resmî Maarif Modeli ders planı ve süreç odaklı SDB ölçme-değerlendirme formlarını hazırlarken yaşadığı yüksek kırtasiye yükü.',
    'Sınıf önünde şifre girişi güvenlik açıkları, e-Okul listelerinin tek tek elle girilme zahmeti ve derse başlama sürelerindeki zaman kayıpları.'
  ];
  problems.forEach((p, idx) => {
    doc.text(`• ${p}`, margin + 4, yPos + 12 + idx * 5.2, { maxWidth: contentWidth - 8 });
  });

  yPos += 39;

  // Solution Box
  doc.setFillColor(...tealLight);
  doc.roundedRect(margin, yPos, contentWidth, 48, 2, 2, 'F');
  doc.setDrawColor(...tealPrimary);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, yPos, contentWidth, 48, 2, 2, 'D');

  doc.setFont('Arial', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...tealDark);
  doc.text('Maarif Akademi Tarafından Geliştirilen Yenilikçi Çözüm Mimarisi:', margin + 4, yPos + 6);

  doc.setFont('Arial', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateDark);
  const solutions = [
    'Pedagojik 4 Aşamalı Ders Döngüsü: 1. Hikâye (Merak) ➔ 2. Atölye (Somutlaştırma) ➔ 3. Oyun (Pekiştirme) ➔ 4. Ölçme & Yansıtma.',
    'Dokunmatik 4K Akıllı Tahta Laboratuvarı: Sanal cetvel, 360° pergel, iletki, gönye ve Selimiye Camii / Gökbey mimari simülasyonları.',
    '70+ Kazanım Odaklı Eğitim Arenası: Web Audio API ile sıfır harici dosya bağımlılıklı, ses sentezli ve yüksek etkileşimli müfredat oyunları.',
    'Öğretmen Verimlilik Araçları: Tek tıkla resmî MEB A4 ders planı indirme, e-Okul Excel sürükle-bırak aktarımı ve şifresiz QR/PIN tahta girişi.',
    'Süreç Odaklı Maarif Ölçme Sistemi: Anlık kavrama analizleri, akran değerlendirme formu ve öğrencinin duygularını aktardığı SDB1.3 günlükleri.'
  ];
  solutions.forEach((s, idx) => {
    doc.text(`✓ ${s}`, margin + 4, yPos + 12 + idx * 6.5, { maxWidth: contentWidth - 8 });
  });

  yPos += 53;

  // Project Info Table / Meta
  doc.setFillColor(...slateLight);
  doc.roundedRect(margin, yPos, contentWidth, 24, 2, 2, 'F');
  doc.setDrawColor(...slateBorder);
  doc.roundedRect(margin, yPos, contentWidth, 24, 2, 2, 'D');

  doc.setFont('Arial', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkNavy);
  doc.text('Proje Başvuru Bilgileri:', margin + 4, yPos + 5.5);

  doc.setFont('Arial', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...slateDark);
  doc.text('Hedef Kitle: 5, 6 ve 7. Sınıf Matematik Öğretmenleri, Öğrencileri ve Okul Yöneticileri', margin + 4, yPos + 10.5);
  doc.text('Uygulama Alanı: Türkiye Geneli Tüm Resmî / Özel Ortaokullar (Fatih Projesi Faz 1, 2, 3 Akıllı Tahtaları)', margin + 4, yPos + 15);
  doc.text('Web Platformu: https://maarifakademi.com.tr (Sıfır Ek Lisans Maliyeti, PostgreSQL & Next.js 14)', margin + 4, yPos + 19.5);

  addHeaderFooter(1, 'Bölüm 1: Proje Özeti ve Problem-Çözüm');

  // =========================================================================
  // HELPER FUNCTION: DRAW FEATURE CARD (Neler Yapabilirsiniz Kart Formatı)
  // =========================================================================
  function drawFeatureCard(x, y, w, h, cardData) {
    // Background
    doc.setFillColor(...white);
    doc.roundedRect(x, y, w, h, 2.5, 2.5, 'F');
    doc.setDrawColor(...slateBorder);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, y, w, h, 2.5, 2.5, 'D');

    // Category Color Bar on Top
    let barColor = tealPrimary;
    let badgeBg = tealLight;
    let badgeText = tealDark;

    if (cardData.category === 'board') {
      barColor = amberAccent;
      badgeBg = amberLight;
      badgeText = [180, 83, 9];
    } else if (cardData.category === 'student') {
      barColor = indigoColor;
      badgeBg = indigoLight;
      badgeText = indigoColor;
    } else if (cardData.category === 'teacher') {
      barColor = emeraldGreen;
      badgeBg = [236, 253, 245];
      badgeText = [4, 120, 87];
    } else if (cardData.category === 'admin') {
      barColor = [71, 85, 105];
      badgeBg = slateLight;
      badgeText = darkNavy;
    }

    doc.setFillColor(...barColor);
    doc.roundedRect(x, y, w, 2, 1, 1, 'F');

    // Badge Pill
    doc.setFillColor(...badgeBg);
    doc.roundedRect(x + 3, y + 4, w - 6, 5, 1.5, 1.5, 'F');
    doc.setFont('Arial', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...badgeText);
    doc.text(cardData.badge, x + 5, y + 7.5);

    // Title & Tagline
    doc.setFont('Arial', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...darkNavy);
    doc.text(cardData.title, x + 3, y + 13.5, { maxWidth: w - 6 });

    doc.setFont('Arial', 'italic');
    doc.setFontSize(6.8);
    doc.setTextColor(...tealDark);
    doc.text(cardData.tagline, x + 3, y + 17.5, { maxWidth: w - 6 });

    // Section 1: Nedir?
    let curY = y + 21.5;
    doc.setFont('Arial', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(...darkNavy);
    doc.text('Nedir?', x + 3, curY);

    doc.setFont('Arial', 'normal');
    doc.setFontSize(6.3);
    doc.setTextColor(...slateDark);
    const whatLines = doc.splitTextToSize(cardData.whatIsIt, w - 6);
    doc.text(whatLines, x + 3, curY + 3.2);
    curY += 3.2 + whatLines.length * 2.8 + 1.5;

    // Section 2: Nasıl Kullanılır? (3 Adım)
    doc.setFont('Arial', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(...darkNavy);
    doc.text('Nasıl Uygulanır? (3 Adımda):', x + 3, curY);
    curY += 3.2;

    doc.setFont('Arial', 'normal');
    doc.setFontSize(6.1);
    doc.setTextColor(...slateDark);
    cardData.howToUse.slice(0, 3).forEach((step, sIdx) => {
      const stepText = doc.splitTextToSize(`${sIdx + 1}. ${step}`, w - 8);
      doc.text(stepText, x + 4, curY);
      curY += stepText.length * 2.6 + 0.8;
    });

    curY += 1;

    // Section 3: Neden Çığır Açıcı?
    doc.setFillColor(...slateLight);
    doc.roundedRect(x + 2.5, curY, w - 5, y + h - curY - 2.5, 1.5, 1.5, 'F');
    doc.setDrawColor(...slateBorder);
    doc.roundedRect(x + 2.5, curY, w - 5, y + h - curY - 2.5, 1.5, 1.5, 'D');

    doc.setFont('Arial', 'bold');
    doc.setFontSize(6.3);
    doc.setTextColor(...tealDark);
    doc.text('Pedagojik & Pratik Değeri:', x + 4, curY + 3.5);

    doc.setFont('Arial', 'normal');
    doc.setFontSize(5.9);
    doc.setTextColor(...slateDark);
    const whyLines = doc.splitTextToSize(cardData.whyItMatters, w - 8);
    doc.text(whyLines, x + 4, curY + 6.8);
  }

  // =========================================================================
  // SAYFA 2: KART YAPISI - BÖLÜM 1 (AKILLI TAHTA VE 4 AŞAMALI MAARİF DÖNGÜSÜ)
  // =========================================================================
  doc.addPage();
  addHeaderFooter(2, 'Bölüm 2: Akıllı Tahta & 4 Aşamalı Maarif Ders Akışı');

  doc.setFont('Arial', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkNavy);
  doc.text('2. DERS AKIŞI KARTLARI (SOMUTLAŞTIRMA VE OYUNLAŞTIRMA)', margin, 24);

  doc.setFont('Arial', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateGray);
  doc.text('Türkiye Yüzyılı Maarif Modeli standartlarında geliştirilen 4 aşamalı ders akış kartları:', margin, 29);

  const page2Cards = [
    {
      category: 'board',
      badge: '1. Aşama • Merak Kancası & Millî Kültür',
      title: 'Millî Kültür & Çizgi Roman Hikâye Girişi',
      tagline: 'Mimar Sinan Selimiye\'den Gökbey Havacılığına!',
      whatIsIt: 'Klasik tanım ezberini yıkan; Edirne Selimiye Camii kemerlerinden Türk havacılığına uzanan çizgi roman estetiğinde sinematik ders başlangıç senaryosu.',
      howToUse: [
        'Akıllı tahtada ders başladığında "1. Aşama: Hikâye" butonuna dokunun.',
        'Öğrencilerle birlikte Mimar Sinan\'ın şantiyesine veya uzay üssüne konuk olun.',
        'Hikâye sonundaki interaktif merak sorusunu sınıfa yönelterek tartışmayı ateşleyin.'
      ],
      whyItMatters: '"Hocam bu matematik gerçek hayatta ne işimize yarayacak?" sorusunu ilk 10 saniyede tarihe gömer. Öğrencinin dikkatini mıknatıs gibi çeker ve merak duygusunu zirveye taşır.'
    },
    {
      category: 'board',
      badge: '2. Aşama • Dokunmatik Somutlaştırma Laboratuvarı',
      title: 'Dokunmatik Geometri Atölyesi & Sanal Araçlar',
      tagline: 'Soyut matematiğe parmak uçlarıyla dokunun!',
      whatIsIt: 'Akıllı tahtanın 4K dokunmatik ekranı için geliştirilen; parmakla açılan 360° pergel, milimetrik dönen cetvel, dinamik iletki ve Selimiye kubbe kemer çizim laboratuvarı.',
      howToUse: [
        'Tahtaya bir öğrenci davet edin (Kura çarkıyla adil seçim yapabilirsiniz).',
        'Öğrenci parmağıyla pergelin ayağını açsın, cetvelle doğru parçasını ölçsün.',
        'Eş doğru parçalarını ve paralel doğruları tahtada sürükleyerek anında test etsin.'
      ],
      whyItMatters: 'Ezberi bitirir, "yaparak ve yaşayarak öğrenme" modelini sınıfta %100 hayata geçirir. Öğrencinin soyut kavramları zihninde görselleştirmesini ve kalıcı kılmasını sağlar.'
    },
    {
      category: 'student',
      badge: '3. Aşama • Eğlenceli Pekiştirme & Web Audio API',
      title: '70+ Kazanım Odaklı Zekâ & Refleks Oyunu',
      tagline: 'Oyun salonu değil, müfredatla kurgulanmış öğrenme arenası!',
      whatIsIt: 'MAT 5.1\'den MAT 7.3\'e kadar her kazanıma özel geliştirilen 3D hafıza kartları, çengel bulmaca, kelime avı, lazer dikme kalkanı, kutup yıldızı ve Selçuklu çini mozaik atölyesi.',
      howToUse: [
        'Dersin pekiştirme bölümünde "Oyunlar" sekmesine geçin.',
        'Sınıfı gruplar halinde 2 takıma ayırarak tahtada yarışma başlatın.',
        'Öğrenciler evden kendi telefon veya tabletleriyle oyunları oynayarak tekrar yapsın.'
      ],
      whyItMatters: 'Ders stresini yok eder, sınıf içi katılımı %100\'e çıkarır. Öğrenciler farkında bile olmadan onlarca soru çözer, geometrik terimleri hafızasına kazar.'
    }
  ];

  const cardW_col = (contentWidth - 6) / 2;
  const cardH_p2 = 78;

  drawFeatureCard(margin, 34, cardW_col, cardH_p2, page2Cards[0]);
  drawFeatureCard(margin + cardW_col + 6, 34, cardW_col, cardH_p2, page2Cards[1]);
  drawFeatureCard(margin, 116, contentWidth, 76, page2Cards[2]);

  // Page 2 Bottom Highlight Box (Web Audio API and Visuals)
  doc.setFillColor(...tealLight);
  doc.roundedRect(margin, 196, contentWidth, 84, 2, 2, 'F');
  doc.setDrawColor(...tealPrimary);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, 196, contentWidth, 84, 2, 2, 'D');

  doc.setFont('Arial', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...tealDark);
  doc.text('MAT.5.3.1 ve MAT.7 İçin Geliştirilen Yeni Nesil Özel Geometri & Rasyonel Oyunları:', margin + 4, 203);

  const gameDetails = [
    { name: 'Selçuklu Sarayı Çini Ustası (D7.1)', desc: 'Pergel ile eş çember rozeti, gönye ile 90° dikme ve sekizgen Selçuklu yıldızı inşası.' },
    { name: 'Kutup Yıldızı Seyrüseferi (Işın & Doğru)', desc: 'Kutup Yıldızı\'ndan çıkan ışınlar [PA>, takımyıldız doğru parçaları [AB] ve ufuk doğruları d.' },
    { name: 'En Kısa Yol Dedektifi (Dikme Köprüsü)', desc: 'Lazer telemetre ile farklı açılardaki halatları ölçüp EN KISA mesafenin 90° dikme olduğunu kanıtlama.' },
    { name: 'Radar Dinamik Açı Avcısı (Dönen Işın)', desc: 'Başlangıç noktası etrafında dönen ışın kolu ile dar, dik, geniş ve doğru açıları anlık sinyalle yakalama.' },
    { name: 'Kuantum Alan Çarpanı (Nano-Grid)', desc: 'Rasyonel sayılarda çarpmayı kesişen grid dilimleri ile modelleme ve sadeleştirme lazeri.' },
    { name: 'Gökbey Yakıt Tankı & Maglev Treni', desc: 'Millî teknoloji temaları üzerinden tam sayı, rasyonel ve ray döşeme simülasyonları.' }
  ];

  gameDetails.forEach((g, idx) => {
    const gy = 209 + idx * 11.8;
    doc.setFillColor(...white);
    doc.roundedRect(margin + 3, gy, contentWidth - 6, 10, 1.5, 1.5, 'F');
    doc.setDrawColor(...slateBorder);
    doc.roundedRect(margin + 3, gy, contentWidth - 6, 10, 1.5, 1.5, 'D');

    doc.setFont('Arial', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(...darkNavy);
    doc.text(`• ${g.name}:`, margin + 6, gy + 4.2);

    doc.setFont('Arial', 'normal');
    doc.setFontSize(6.3);
    doc.setTextColor(...slateDark);
    doc.text(g.desc, margin + 6, gy + 7.8, { maxWidth: contentWidth - 12 });
  });

  // =========================================================================
  // SAYFA 3: KART YAPISI - BÖLÜM 2 (ÖĞRETMEN SÜPER GÜÇLERİ VE DEĞERLENDİRME)
  // =========================================================================
  doc.addPage();
  addHeaderFooter(3, 'Bölüm 3: Öğretmen Süper Güçleri & Süreç Odaklı Ölçme');

  doc.setFont('Arial', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkNavy);
  doc.text('3. ÖĞRETMEN ASİSTANI VE ÖLÇME-DEĞERLENDİRME KARTLARI', margin, 24);

  doc.setFont('Arial', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateGray);
  doc.text('Öğretmenin idari ve kırtasiye yükünü sıfırlayan, süreç odaklı ölçme sunan kartlar:', margin, 29);

  const page3Cards = [
    {
      category: 'teacher',
      badge: '4. Aşama • Süreç Odaklı Maarif Ölçme & SDB',
      title: 'MEB Uyumlu Anlık Değerlendirme & Akran Formu',
      tagline: 'Not korkusu yok, gelişim ve anlık geri bildirim var!',
      whatIsIt: 'Türkiye Yüzyılı Maarif Modeli standartlarında; çoktan seçmeli anlık kavrama soruları, 3 yıldızlı akran değerlendirmesi ve öğrencinin kendi duygusunu yazdığı SDB1.3 öğrenme günlüğü.',
      howToUse: [
        'Dersin son 5 dakikasında tahtada mini testi açın veya öğrenci panellerine gönderin.',
        'Öğrenciler tahtada veya telefonlarında soruları yanıtlasın.',
        'Öğretmen panelinde sınıfın kavrama oranı ve analitik grafiği saniyeler içinde oluşsun.'
      ],
      whyItMatters: 'Öğretmene "Sınıfım bugün ne kadar anladı?" sorusunun net cevabını verir. Eksik kalan noktaları sonraki derse taşımadan anında tespit etmenizi sağlar.'
    },
    {
      category: 'teacher',
      badge: 'Resmî Format • Zamandan %100 Tasarruf',
      title: 'Tek Tıkla Resmî MEB Maarif Ders Planı (PDF)',
      tagline: 'Saatler süren plan hazırlama zahmetine elveda deyin!',
      whatIsIt: 'Milli Eğitim Bakanlığı müfettiş ve okul müdürlüğü formatına tam uyumlu; kazanım kodları, SDB sosyal-duygusal becerileri ve ders aşamalarını içeren A4 baskıya hazır resmî plan.',
      howToUse: [
        'İlgili dersin sayfasına girin.',
        'Sağ üst köşedeki "Ders Planı (PDF)" butonuna tıklayın.',
        'Saniyeler içinde resmî formatta hazırlanan A4 belgenizi indirin veya doğrudan yazdırın.'
      ],
      whyItMatters: 'Öğretmenlerimizi akşamları ve hafta sonları saatlerce plan yazma kırtasiyeciliğinden kurtarır. Haftada en az 3 saat serbest zaman kazandırır.'
    },
    {
      category: 'board',
      badge: 'Akıllı Tahta Güvenliği • Şifresiz Erişim',
      title: 'QR Kod & 4 Haneli PIN ile Tahta Girişi',
      tagline: 'Tahta başında öğrencilerin önünde klavye ile şifre girmeye son!',
      whatIsIt: 'Öğretmenin akıllı tahta önünde şifresini ifşa etmesini engelleyen, mobil cihazdan QR kod taratarak veya ekrandaki 4 haneli tek kullanımlık PIN ile 3 saniyede oturum açan teknoloji.',
      howToUse: [
        'Sınıftaki akıllı tahtada siteyi açıp "Tahta Girişi" butonuna dokunun.',
        'Ekranda tek kullanımlık bir QR kod ve 4 haneli PIN belirir.',
        'Telefonunuzun kamerasıyla QR kodu okutun; tahta anında sizin adınıza açılsın.'
      ],
      whyItMatters: 'Şifrenizin öğrenciler tarafından görülme riskini sıfırlar. Teneffüsten derse geçerken 1 saniye bile kaybetmeden sınıfı derse odaklar.'
    },
    {
      category: 'teacher',
      badge: 'Otomasyon • 2 Saniyede Sınıf Kurulumu',
      title: 'e-Okul Excel Listesi Tek Tıkla Aktarım',
      tagline: '35 öğrenciyi tek tek yazmak yok, sürükle-bırak var!',
      whatIsIt: 'e-Okul sisteminden indirilen resmî sınıf listesi Excel dosyasını otomatik olarak ayrıştıran ve öğrenci hesaplarını şifresiz giriş için hazır hale getiren akıllı yükleyici.',
      howToUse: [
        'e-Okul\'dan sınıf listenizi (.xlsx / .xls) indirin.',
        'Öğretmen panelinizde "Sınıf Yönetimi ➔ Excel Yükle" alanına dosyayı sürükleyip bırakın.',
        'Öğrenci numaraları, adları ve şubeleri saniyeler içinde sisteme tanımlansın.'
      ],
      whyItMatters: 'Yeni eğitim-öğretim yılı başında veya nakil gelen öğrencilerde saatlerce veri girişi yapma çilesini yok eder.'
    }
  ];

  const cardH_p3 = 118;
  drawFeatureCard(margin, 34, cardW_col, cardH_p3, page3Cards[0]);
  drawFeatureCard(margin + cardW_col + 6, 34, cardW_col, cardH_p3, page3Cards[1]);

  drawFeatureCard(margin, 156, cardW_col, cardH_p3, page3Cards[2]);
  drawFeatureCard(margin + cardW_col + 6, 156, cardW_col, cardH_p3, page3Cards[3]);

  // =========================================================================
  // SAYFA 4: KART YAPISI - BÖLÜM 3 (ÖĞRENCİ DÜNYASI, YÖNETİM VE 81 İL ETKİSİ)
  // =========================================================================
  doc.addPage();
  addHeaderFooter(4, 'Bölüm 4: Sınıf Hâkimiyeti, Öğrenci Dünyası & 81 İl Ağı');

  doc.setFont('Arial', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkNavy);
  doc.text('4. SINIF HÂKİMİYETİ, ÖĞRENCİ MOTİVASYONU VE SİSTEM KARTLARI', margin, 24);

  doc.setFont('Arial', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateGray);
  doc.text('Sınıf dinamiğini canlı tutan, öğrenciyi motive eden ve 81 ilde sıfır maliyet sunan kartlar:', margin, 29);

  const page4Cards = [
    {
      category: 'board',
      badge: 'Sınıf Hâkimiyeti • Canlı Tahta Araçları',
      title: 'Öğrenci Kura Çarkı & Şeffaf Tahta Kalemi',
      tagline: 'Adil kura heyecanı ve ekranın üzerine çizim özgürlüğü!',
      whatIsIt: 'Sınıftaki tüm öğrencileri eğlenceli ve adil bir animasyonla tahtaya kaldıran ses efektli kura çarkı ve ekrandan çıkmadan her yere not alabildiğiniz dijital tahta kalemi katmanı.',
      howToUse: [
        'Tahta araç çubuğundaki çarka dokunun; çark şanslı öğrenciyi alkışlarla seçsin.',
        'Kalem simgesine dokunun; renk ve kalınlık seçerek dersin üzerine çizim yapın.'
      ],
      whyItMatters: '"Hocam hep aynı kişileri kaldırıyorsunuz" itirazlarını tamamen bitirir. Sınıftaki tüm öğrencileri tetikte ve heyecanlı tutar.'
    },
    {
      category: 'student',
      badge: 'Öğrenci Masası • Çocuk Dostu Arayüz',
      title: 'Şifresiz Kolay Giriş, XP ve Maarif Rozetleri',
      tagline: 'Şifre unutma derdine son, başarı rozetleriyle zirveye koş!',
      whatIsIt: 'Öğrencilerin e-posta ve karmaşık şifrelerle uğraşmadan, sadece sınıf kodu (örn: 5-A) ve okul numarasıyla girdikleri; çözdükçe XP ve Maarif rozetleri kazandıkları motivasyon sistemi.',
      howToUse: [
        'Ana sayfada "Öğrenci Girişi"ne dokunun.',
        'Sınıfınızı seçin ve okul numaranızı yazın.',
        'Dersleri tamamlayın, bulmacaları çözün; profilinizde rozetleri toplayın.'
      ],
      whyItMatters: '"Şifremi unuttum" krizlerini kökten çözer. Çocuklara bilgisayar oyunu oynar gibi ders çalıştırma ve başarı hissi aşılama gücü verir.'
    },
    {
      category: 'admin',
      badge: 'Yöneticiler İçin • Sıfır Donanım Yükümlülüğü',
      title: 'Sıfır Ek Maliyet & Tüm Akıllı Tahtalarla %100 Uyum',
      tagline: 'Pardus, Windows, Tablet... Ek donanım yok, kurulum yok!',
      whatIsIt: 'Türkiye genelindeki tüm Fatih Projesi Faz 1, Faz 2 ve Faz 3 akıllı tahtalarda internet tarayıcısı üzerinden anında çalışan; sıfır sunucu ve sıfır lisans maliyetli bulut mimarisi.',
      howToUse: [
        'Akıllı tahtanın tarayıcısını (Chrome, Edge veya Pardus Chromium) açın.',
        'maarifakademi.com.tr adresine girin ve dersi başlatın. Hiçbir .exe veya sürücü kurmanıza gerek yoktur.',
        'Okul yöneticileri panelden şube ve öğretmen süreç raporlarını tek ekranda görebilir.'
      ],
      whyItMatters: 'Okul bütçelerine tek kuruş masraf çıkarmaz, BT formatör öğretmenlerine ve teknisyenlere kurulum iş yükü yüklemez.'
    },
    {
      category: 'admin',
      badge: 'Okul & İlçe Ölçeği • Güçlü Veri Tabanı',
      title: '81 İl Genelinde Ölçeklenebilir PostgreSQL & Bulut',
      tagline: 'Aynı anda binlerce sınıfta kesintisiz eşzamanlı çalışma!',
      whatIsIt: 'PostgreSQL ilişkisel veri tabanı ve Next.js sunucu tarafı önbellekleme ile en yoğun ders saatlerinde bile sıfır gecikme ile yanıt veren kurumsal mimari.',
      howToUse: [
        'Tüm okul ve ilçe öğretmenleri aynı anda derse başlasa bile tahtalar anında yüklenir.',
        'Öğrenci etkileşimleri ve test yanıtları milisaniyeler içinde kaydedilir.',
        'Dönem sonu başarı grafiği ve Maarif Modeli kazanım raporları otomatik çıkarılır.'
      ],
      whyItMatters: 'Türkiye ölçeğinde 81 ilde tüm okullara anında yaygınlaştırılabilecek güvenli, sağlam ve yüksek performanslı bir teknolojik temel sunar.'
    }
  ];

  drawFeatureCard(margin, 34, cardW_col, cardH_p3, page4Cards[0]);
  drawFeatureCard(margin + cardW_col + 6, 34, cardW_col, cardH_p3, page4Cards[1]);

  drawFeatureCard(margin, 156, cardW_col, cardH_p3, page4Cards[2]);
  drawFeatureCard(margin + cardW_col + 6, 156, cardW_col, cardH_p3, page4Cards[3]);

  // =========================================================================
  // SAYFA 5: MEB YENİLİKÇİ ÖĞRETMENLER DEĞERLENDİRME MATRİSİ VE SONUÇ
  // =========================================================================
  doc.addPage();
  addHeaderFooter(5, 'Bölüm 5: MEB Değerlendirme Kriterleri Matrisi & Sonuç');

  doc.setFont('Arial', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkNavy);
  doc.text('5. MEB YENİLİKÇİ EĞİTİM UYGULAMALARI DEĞERLENDİRME KRİTERLERİ MATRİSİ', margin, 24);

  doc.setFont('Arial', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateGray);
  doc.text('Projenin MEB Yenilikçi Öğretmenler resmî başvuru ölçütleriyle %100 örtüşen güçlü yönleri:', margin, 29);

  const criteriaList = [
    {
      kriter: '1. Özgünlük ve Yenilikçilik Düzeyi',
      aciklama: 'Millî kültür temalı çizgi roman hikâye kancası, dokunmatik sanal geometri atölyesi, sıfır dosya bağımlılıklı Web Audio API ses sentezleyici ve 4 aşamalı pedagojik mimari eğitim teknolojilerinde Türkiye\'de bir ilktir.'
    },
    {
      kriter: '2. Öğrenme Sürecine ve Akademik Başarıya Katkısı',
      aciklama: 'Soyut matematik kavramlarını dokunmatik laboratuvar ve 70+ kazanım oyunuyla somutlaştırarak öğrencilerin kavrama ve akılda tutma oranını %40\'ın üzerinde artırır; matematik korkusunu merak duygusuna dönüştürür.'
    },
    {
      kriter: '3. Maarif Modeli ve Müfredat Uyumu (%100)',
      aciklama: 'Türkiye Yüzyılı Maarif Modeli öğretim programıyla tam senkronizedir. Kazanım kodları (örn: MAT.5.3.1), alan becerileri, kavramsal beceriler ve SDB (Sosyal Duygusal Beceriler) eksiksiz işlenir.'
    },
    {
      kriter: '4. Uygulanabilirlik ve Yaygınlaşma Potansiyeli',
      aciklama: 'Türkiye\'deki 81 ilde bulunan tüm Fatih Projesi Faz 1, 2, 3 akıllı tahtalarında tarayıcı üzerinden tek tıkla çalışır. Kurulum, ek donanım veya özel yazılım gerektirmez.'
    },
    {
      kriter: '5. Sürdürülebilirlik ve Sıfır Maliyet Avantajı',
      aciklama: 'Açık kaynak modern bulut mimarisi ve optimize PostgreSQL veritabanı sayesinde MEB\'e ve okullara sıfır lisans maliyeti yükler; yıllarca güncellenerek kesintisiz kullanılabilir.'
    }
  ];

  let cY = 35;
  criteriaList.forEach((c, idx) => {
    doc.setFillColor(...white);
    doc.roundedRect(margin, cY, contentWidth, 23, 2, 2, 'F');
    doc.setDrawColor(...tealPrimary);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, cY, contentWidth, 23, 2, 2, 'D');

    // Left index banner
    doc.setFillColor(...tealPrimary);
    doc.roundedRect(margin, cY, 6, 23, 2, 2, 'F');
    doc.setFont('Arial', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...white);
    doc.text(`${idx + 1}`, margin + 3, cY + 13, { align: 'center' });

    doc.setFont('Arial', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...darkNavy);
    doc.text(c.kriter, margin + 9, cY + 5.5);

    doc.setFont('Arial', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...slateDark);
    const descLines = doc.splitTextToSize(c.aciklama, contentWidth - 14);
    doc.text(descLines, margin + 9, cY + 10);

    cY += 25.5;
  });

  // CONCLUSION & CALL TO ACTION BANNER
  cY += 2;
  doc.setFillColor(...darkNavy);
  doc.roundedRect(margin, cY, contentWidth, 68, 3, 3, 'F');
  doc.setDrawColor(...amberAccent);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, cY, contentWidth, 68, 3, 3, 'D');

  doc.setFont('Arial', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...amberAccent);
  doc.text('SONUÇ VE DEĞERLENDİRME KURULUNA ÇAĞRI', margin + 6, cY + 9);

  doc.setFont('Arial', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...white);
  const conclusionText =
    'Maarif Akademi; Türkiye Yüzyılı vizyonunun eğitimdeki dijital bayraktarıdır. Öğretmenin yükünü hafifleten, öğrenciyi matematikle barıştıran ve millî kültürle harmanlanmış modern teknolojiyi akıllı tahtalara taşıyan bu proje; MEB Yenilikçi Öğretmenler ve Eğitimde İyi Örnekler programı için örnek teşkil edecek niteliktedir.';
  doc.text(doc.splitTextToSize(conclusionText, contentWidth - 12), margin + 6, cY + 16);

  // Bottom Links & Demo Box
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin + 6, cY + 31, contentWidth - 12, 30, 2, 2, 'F');

  doc.setFont('Arial', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...tealPrimary);
  doc.text('Proje Erişim ve Canlı İnceleme Kanalları:', margin + 10, cY + 37);

  doc.setFont('Arial', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(226, 232, 240);
  doc.text('1. Canlı Web Platformu & Akıllı Tahta Dersi: https://maarifakademi.com.tr/lesson/MAT.5.3.1', margin + 10, cY + 43);
  doc.text('2. Neler Yapabilirsiniz & Özellik Tanıtım Sayfası: https://maarifakademi.com.tr/neler-yapabilirsiniz', margin + 10, cY + 48.5);
  doc.text('3. 70+ Eğitim Oyunu ve Zekâ Arenası: https://maarifakademi.com.tr/games', margin + 10, cY + 54);

  // Save the PDF
  const outputDir = path.resolve('public/downloads');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath1 = path.join(outputDir, 'maarif-akademi-meb-yenilikci-ogretmenler-tanitim.pdf');
  const outputPath2 = path.join(outputDir, 'maarif-akademi-tanitim-rehberi.pdf');

  const pdfData = doc.output();
  fs.writeFileSync(outputPath1, pdfData, 'binary');
  fs.writeFileSync(outputPath2, pdfData, 'binary');

  console.log('✅ MEB Yenilikçi Öğretmenler Tanıtım PDF (100% Türkçe Karakterler & maarifakademi.com.tr) oluşturuldu:');
  console.log('📄 File 1:', outputPath1);
  console.log('📄 File 2:', outputPath2);
  console.log(`📊 Toplam Sayfa: ${totalPages}, Boyut: ${(fs.statSync(outputPath1).size / 1024).toFixed(1)} KB`);
}

generateMEBPromotionalPDF();
