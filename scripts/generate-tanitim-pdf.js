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

function tr(text) {
  if (!text) return '';
  return text
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C')
    .replace(/•/g, '-');
}

function generatePromotionalPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const darkNavy = [15, 23, 42];      // #0f172a
  const tealPrimary = [13, 148, 136];  // #0d9488
  const tealDark = [17, 94, 89];      // #115e59
  const amberAccent = [245, 158, 11]; // #f59e0b
  const slateGray = [100, 116, 139];   // #64748b
  const slateLight = [241, 245, 249];  // #f1f5f9
  const emeraldGreen = [16, 185, 129];// #10b981
  const white = [255, 255, 255];

  function addPageHeaderFooter(doc, pageNum, totalPages, title) {
    doc.setFillColor(...slateLight);
    doc.rect(margin, 8, contentWidth, 10, 'F');
    doc.setDrawColor(...tealPrimary);
    doc.setLineWidth(0.4);
    doc.line(margin, 18, margin + contentWidth, 18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...tealDark);
    doc.text(tr('MAARIF AKADEMI | TURKIYE YUZYILI MAARIF MODELI'), margin + 3, 14.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...slateGray);
    doc.text(tr(title), margin + contentWidth - 3, 14.5, { align: 'right' });

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 14, margin + contentWidth, pageHeight - 14);

    doc.setFontSize(7.5);
    doc.setTextColor(...slateGray);
    doc.text(tr('Yenilikci Egitim Uygulamalari ve Akilli Tahta Egitim Kiti'), margin, pageHeight - 9);
    doc.text(tr(`Sayfa ${pageNum} / ${totalPages}`), margin + contentWidth, pageHeight - 9, { align: 'right' });
  }

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  doc.setFillColor(...darkNavy);
  doc.rect(0, 0, pageWidth, 110, 'F');

  doc.setFillColor(...tealPrimary);
  doc.rect(0, 108, pageWidth, 3.5, 'F');

  doc.setFillColor(...amberAccent);
  doc.rect(0, 111.5, pageWidth, 1.5, 'F');

  const logo = getBase64Image('public/brand/maarif-logo.png') || getBase64Image('public/logo-192.png');
  if (logo) {
    doc.addImage(logo.dataUri, logo.format, margin, 14, 20, 20, undefined, 'FAST');
  }

  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin + 25, 16, 95, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...amberAccent);
  doc.text(tr('TURKIYE YUZYILI MAARIF MODELI UYUMLU'), margin + 27, 20.8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...white);
  doc.text(tr('MAARIF AKADEMI'), margin, 48);

  doc.setFontSize(14);
  doc.setTextColor(...tealPrimary);
  doc.text(tr('Akilli Tahta & Web Tabanli Interaktif Matematik Ekosistemi'), margin, 58);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225);
  const coverSub = tr('5. ve 7. Sinif Matematik Mufredati Icin 4 Fazli Ders Akisi, Dokunmatik Sanal Geometri Laboratuvari, Web Audio API Destekli Egitim Oyunlari ve Surec Odakli Analitik Rubrik Sistemi.');
  const coverSubLines = doc.splitTextToSize(coverSub, contentWidth - 40);
  doc.text(coverSubLines, margin, 68);

  const mascot = getBase64Image('public/mascot/selim-pointing.png');
  if (mascot) {
    doc.addImage(mascot.dataUri, mascot.format, pageWidth - margin - 48, 40, 46, 65, undefined, 'FAST');
  }

  let cardY = 122;
  const cardH = 22;

  const features = [
    {
      title: '4 Fazli Pedagojik Ders Mimarisi',
      desc: 'Baglam & Hikaye -> Model & Kesif Atolyesi -> Egitici Oyun & Simulasyon -> Surec Odakli Olcme & Rubrik',
      color: tealPrimary
    },
    {
      title: 'Dokunmatik Sanal Geometri Laboratuvari',
      desc: 'Akilli tahtada gercek zamanli Sanal Gonye, Aciolcer ve Pergel simulasyonu (Web Audio API efektli).',
      color: amberAccent
    },
    {
      title: 'Resmi Standartlarda Analitik Rubrik & PDF Karne',
      desc: 'MEB SDB Becerilerine tam uyumlu 4 duzeyli olcek ve tek tikla indirilebilir A4 basvuru/ogrenci karnesi.',
      color: emeraldGreen
    }
  ];

  features.forEach((feat) => {
    doc.setFillColor(...slateLight);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, cardY, contentWidth, cardH, 3, 3, 'FD');

    doc.setFillColor(...feat.color);
    doc.roundedRect(margin, cardY, 3.5, cardH, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...darkNavy);
    doc.text(tr(feat.title), margin + 8, cardY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...slateGray);
    doc.text(tr(feat.desc), margin + 8, cardY + 14);

    cardY += cardH + 5;
  });

  const heroShot = getBase64Image('public/screenshots/media_1789487029942.png') || getBase64Image('public/story/rational-mult-story.jpg');
  if (heroShot) {
    const shotBoxY = cardY + 3;
    const shotBoxH = 68;
    doc.setDrawColor(...tealPrimary);
    doc.setLineWidth(0.8);
    doc.roundedRect(margin, shotBoxY, contentWidth, shotBoxH, 3, 3, 'D');
    doc.addImage(heroShot.dataUri, heroShot.format, margin + 0.5, shotBoxY + 0.5, contentWidth - 1, shotBoxH - 1, undefined, 'FAST');

    doc.setFillColor(...darkNavy);
    doc.roundedRect(margin + 4, shotBoxY + 4, 60, 6, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...amberAccent);
    doc.text(tr('CANLI UYGULAMA EKRAN GORUNTUSU'), margin + 6, shotBoxY + 8.2);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...tealDark);
  doc.text(tr('T.C. MILLI EGITIM BAKANLIGI YENILIKCI EGITIM UYGULAMALARI TANITIM DOSYASI'), margin, pageHeight - 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateGray);
  doc.text(tr('2026 - 2027 Egitim Ogretim Yili'), margin + contentWidth, pageHeight - 10, { align: 'right' });

  // ==========================================
  // PAGE 2: PEDAGOGICAL ARCHITECTURE & 4 PHASES
  // ==========================================
  doc.addPage();
  addPageHeaderFooter(doc, 2, 5, '4 Fazli Pedagojik Ders Modeli');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...darkNavy);
  doc.text(tr('1. PEDAGOJIK MIMARI: 4 FAZLI DERS AKISI'), margin, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateGray);
  doc.text(tr('Turkiye Yuzyili Maarif Modeli temele alinarak her kazanim 4 butunlesik faz uzerinde kurgulanmistir:'), margin, 34);

  const phases = [
    {
      badge: 'FAZ 1',
      title: 'Hikaye & Baglam Odasi',
      desc: 'Tarihi ve kulturel mirasla (Selimiye, Gobeklitepe, Uzay) matematik kavramlarini gorsel hikayelerle karsilar.',
      img: 'public/screenshots/media_1789496069386.png',
      color: tealPrimary
    },
    {
      badge: 'FAZ 2',
      title: 'Kesif & Model Atolyesi',
      desc: 'Kesirler, alan ve acilarin interaktif bloklar ve geometrik sembollerle somutlastirildigi deney alani.',
      img: 'public/screenshots/media_1789492550639.png',
      color: emeraldGreen
    },
    {
      badge: 'FAZ 3',
      title: 'Oyunlastirma & Simulasyon',
      desc: 'Akilli tahtada Web Audio API destekli, dokunmatik sanal gonye ve aci oyunlariyla kinetik pekistirme.',
      img: 'public/screenshots/media_1789491566596.png',
      color: amberAccent
    },
    {
      badge: 'FAZ 4',
      title: 'Surec Odakli Olcme & Rubrik',
      desc: 'MEB SDB standartlarinda 4 duzeyli analitik rubrik, anlik donut ve tek tikla resmi A4 karne ciktisi.',
      img: 'public/screenshots/media_1789490897367.png',
      color: darkNavy
    }
  ];

  let gridY = 40;
  const boxW = (contentWidth - 6) / 2;
  const boxH = 92;

  phases.forEach((p, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = margin + col * (boxW + 6);
    const y = gridY + row * (boxH + 6);

    doc.setFillColor(...slateLight);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, y, boxW, boxH, 3, 3, 'FD');

    doc.setFillColor(...p.color);
    doc.roundedRect(x + 3, y + 3, 16, 5, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...white);
    doc.text(p.badge, x + 5, y + 6.7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkNavy);
    doc.text(tr(p.title), x + 22, y + 7);

    const pImg = getBase64Image(p.img);
    if (pImg) {
      const imgH = 50;
      doc.setDrawColor(...tealDark);
      doc.setLineWidth(0.3);
      doc.rect(x + 3, y + 11, boxW - 6, imgH, 'D');
      doc.addImage(pImg.dataUri, pImg.format, x + 3.2, y + 11.2, boxW - 6.4, imgH - 0.4, undefined, 'FAST');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...slateGray);
    const descLines = doc.splitTextToSize(tr(p.desc), boxW - 6);
    doc.text(descLines, x + 3, y + 66);
  });

  const summaryY = gridY + 2 * (boxH + 6) + 2;
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(...tealPrimary);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, summaryY, contentWidth, 38, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...tealDark);
  doc.text(tr('Pedagojik Fark ve Ogrenci Deneyimi:'), margin + 5, summaryY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...darkNavy);
  const pedText = tr(
    'Geleneksel duz anlatimin aksine ogrenciler kavrami hikaye ile hisseder, model ile kesfeder, oyun ile kinestetik olarak deneyimler ve analitik rubrik ile kendi ogrenmesini degerlendirir. Bu surec, matematik kaygisini azaltip basariyi ve kalici ogrenmeyi en ust duzeye tasir.'
  );
  doc.text(doc.splitTextToSize(pedText, contentWidth - 10), margin + 5, summaryY + 14);

  // ==========================================
  // PAGE 3: GEOMETRY GAMES & SIMULATIONS
  // ==========================================
  doc.addPage();
  addPageHeaderFooter(doc, 3, 5, 'Interaktif Geometri Oyunlari');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...darkNavy);
  doc.text(tr('2. INTERAKTIF GEOMETRI OYUNLARI & SIMULASYONLAR'), margin, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateGray);
  doc.text(tr('MAT.5.3.1 ve MAT.7 Kazanimlari Icin Gelistirilen Web Audio API ve Dokunmatik Tahta Oyunlari:'), margin, 34);

  const g1Y = 40;
  doc.setFillColor(...slateLight);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, g1Y, contentWidth, 68, 3, 3, 'FD');

  doc.setFillColor(...darkNavy);
  doc.roundedRect(margin + 3, g1Y + 3, contentWidth - 6, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...amberAccent);
  doc.text(tr('OYUN 1: LAZER KALKANI: DIKME SAVUNMASI (Sanal Gonye Laboratuvari)'), margin + 6, g1Y + 8.5);

  const laserImg = getBase64Image('public/screenshots/media_1789503417232.png');
  if (laserImg) {
    doc.setDrawColor(...tealPrimary);
    doc.rect(margin + 5, g1Y + 14, 75, 48, 'D');
    doc.addImage(laserImg.dataUri, laserImg.format, margin + 5.2, g1Y + 14.2, 74.6, 47.6, undefined, 'FAST');
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkNavy);
  doc.text(tr('Oyun Mekanigi & Ozellikleri:'), margin + 85, g1Y + 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateGray);
  const g1Desc = tr(
    '- Sanal Gonyeyi dondurerek ve surukleyerek hedef lazer dogrusuna tam 90 derece dikme indirme.\n- Akilli tahta icin "Miknatisla Yasla (Auto-Snap)" ve +-15 derece hassas ayar butonlari.\n- 3 Kademeli Seviye: Yatay lazer (0 derece), Capraz lazer (45 derece) ve Ters egimli lazer (-30 derece).\n- 90 derece kilitlendiginde [KH] _|_ d diklik sembolu neon yesil yanar, lazeri geri yansitir.'
  );
  doc.text(doc.splitTextToSize(g1Desc, contentWidth - 90), margin + 85, g1Y + 25);

  const g2Y = 112;
  doc.setFillColor(...slateLight);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, g2Y, contentWidth, 68, 3, 3, 'FD');

  doc.setFillColor(...darkNavy);
  doc.roundedRect(margin + 3, g2Y + 3, contentWidth - 6, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...tealPrimary);
  doc.text(tr('OYUN 2: FENER BEKCISI: ACI KISKANCI (Dar, Dik ve Genis Aci Simulasyonu)'), margin + 6, g2Y + 8.5);

  const angleImg = getBase64Image('public/screenshots/media_1789491566596.png');
  if (angleImg) {
    doc.setDrawColor(...tealPrimary);
    doc.rect(margin + 5, g2Y + 14, 75, 48, 'D');
    doc.addImage(angleImg.dataUri, angleImg.format, margin + 5.2, g2Y + 14.2, 74.6, 47.6, undefined, 'FAST');
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkNavy);
  doc.text(tr('Oyun Mekanigi & Ozellikleri:'), margin + 85, g2Y + 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateGray);
  const g2Desc = tr(
    '- Fener isigini 0 dereceden baslayarak dinamik aci cubugu ile ayarlama.\n- Dar Aci (<90), Dik Aci (90) ve Genis Aci (90-180) bolgelerinde gemileri sis icinde aydinlatma.\n- Sesli gemi dudugu (Web Audio API sis kornasi) ve konfeti animasyonlari.\n- Surekli anlik aci derecesi ve aci siniflandirma gostergesi.'
  );
  doc.text(doc.splitTextToSize(g2Desc, contentWidth - 90), margin + 85, g2Y + 25);

  const techY = 184;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...slateGray);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, techY, contentWidth, 88, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...darkNavy);
  doc.text(tr('Teknolojik Altyapi ve Donanim Uyumlulugu:'), margin + 5, techY + 7);

  const techItems = [
    { label: 'Web Audio API:', desc: 'Harici MP3/WAV ses dosyasi indirmeden tarayicinin yerel synthesizer mimarisi ile sifir gecikmeli efektler.' },
    { label: 'Pointer & Touch Events:', desc: 'Fatih Projesi Faz 2/Faz 3 akilli tahtalar, tabletler ve fare ile tam uyumlu coklu dokunmatik girdi.' },
    { label: 'Vektor SVG & Canvas:', desc: '4K tahtalarda dahi sifir bulaniklik ile matematiksel dogrulukta piksel-geometrik cizim.' },
    { label: 'Oyunlastirma & Rozet:', desc: 'XP puani, Selim Basari Rozetleri ve anlik sinif katilim takip sistemi.' }
  ];

  let techItemY = techY + 15;
  techItems.forEach((t) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...tealDark);
    doc.text(tr(`* ${t.label}`), margin + 6, techItemY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...darkNavy);
    doc.text(tr(t.desc), margin + 45, techItemY, { maxWidth: contentWidth - 52 });
    techItemY += 16;
  });

  // ==========================================
  // PAGE 4: RUBRIC & MEASUREMENT/ASSESSMENT
  // ==========================================
  doc.addPage();
  addPageHeaderFooter(doc, 4, 5, 'Surec Odakli Olcme ve Rubrikler');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...darkNavy);
  doc.text(tr('3. SUREC ODAKLI OLCME, ANALITIK RUBRIK & RAPORLAMA'), margin, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateGray);
  doc.text(tr('Turkiye Yuzyili Maarif Modeli Olcme ve Degerlendirme Yonetmeligine Uygun Yapilanma:'), margin, 34);

  const rubImg = getBase64Image('public/screenshots/media_1789490897367.png');
  const rCardY = 40;
  if (rubImg) {
    doc.setDrawColor(...tealPrimary);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, rCardY, contentWidth, 75, 3, 3, 'D');
    doc.addImage(rubImg.dataUri, rubImg.format, margin + 0.5, rCardY + 0.5, contentWidth - 1, 74, undefined, 'FAST');
  }

  const karImg = getBase64Image('public/screenshots/media_1789494083642.png');
  const karY = 120;
  if (karImg) {
    doc.setDrawColor(...emeraldGreen);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, karY, 80, 68, 3, 3, 'D');
    doc.addImage(karImg.dataUri, karImg.format, margin + 0.5, karY + 0.5, 79, 67, undefined, 'FAST');
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...darkNavy);
  doc.text(tr('Rubrik ve Olcme Ozellikleri:'), margin + 86, karY + 6);

  const rubFeatures = [
    { title: '4 Duzeyli Analitik Matris', desc: 'Gelistirilmeli (1), Kabul Edilebilir (2), Iyi (3) ve Mukemmel (4) olcegi.' },
    { title: 'MEB SDB Becerileri Eslestirmesi', desc: 'Her olcut SDB1.2 (Kendini Duzenleme) ve SDB2.1 (Iletisim) becerilerine baglidir.' },
    { title: 'Tek Tikla A4 Resmi PDF Ciktisi', desc: 'Ogrenci, veli ve idare icin resmi MEB baslikli, imzalanabilir A4 rapor ciktisi.' },
    { title: 'QR Kod ile Sinif Esleme', desc: 'Ogrenciler QR okutarak sonuclarini anlik ogretmen paneline iletir.' }
  ];

  let rubFtrY = karY + 14;
  rubFeatures.forEach((rf) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...tealDark);
    doc.text(tr(rf.title), margin + 86, rubFtrY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...slateGray);
    doc.text(tr(rf.desc), margin + 86, rubFtrY + 4.5, { maxWidth: contentWidth - 88 });
    rubFtrY += 13;
  });

  const anaY = 194;
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(...tealPrimary);
  doc.roundedRect(margin, anaY, contentWidth, 78, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...tealDark);
  doc.text(tr('Ogretmen ve Yonetici Dashboardu:'), margin + 5, anaY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...darkNavy);
  const anaText = tr(
    'Ogretmenler siniflarindaki tum ogrencilerin katilim oranlarini, kazanilan rozetleri, rubrik basari ortalamalarini ve sinif ici etkilesim skorlarini grafiklerle anlik olarak gorebilir. Veriler Excel/PDF formatinda disa aktarilarak e-Portfolyo sureclerine dogrudan eklenebilir.'
  );
  doc.text(doc.splitTextToSize(anaText, contentWidth - 10), margin + 5, anaY + 14);

  // ==========================================
  // PAGE 5: INNOVATION APPLICATION SUMMARY & ACCESS
  // ==========================================
  doc.addPage();
  addPageHeaderFooter(doc, 5, 5, 'Yenilikci Ogretmenler Basvuru Ozeti');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...darkNavy);
  doc.text(tr('4. YENILIKCI OGRETMENLER BASVURU VE KULLANIM REHBERI'), margin, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateGray);
  doc.text(tr('Projenin Yenilikcilik, Ozgunluk ve Surdurulebilirlik Ozet Tablosu:'), margin, 34);

  const tableData = [
    { k: 'Proje Adi', v: 'Maarif Akademi - Interaktif Matematik Ekosistemi' },
    { k: 'Hedef Kitle', v: '5. ve 7. Sinif Ogrencileri, Matematik ve BTR Ogretmenleri' },
    { k: 'Temel Yaklasim', v: 'Turkiye Yuzyili Maarif Modeli 4 Fazli Butunlesik Egitim' },
    { k: 'Teknoloji', v: 'Next.js 14, Web Audio API, SVG/Canvas, Touch Events, Prisma' },
    { k: 'Maliyet & Kurulum', v: 'Sifir Ek Maliyet / Kurulumsuz Dogrudan Web & Akilli Tahta' },
    { k: 'Yayginlastirma', v: 'Tum kademelere ve 81 ildeki Fatih Projesi tahtalarina acik' }
  ];

  let tY = 40;
  tableData.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 252 : 255);
    doc.rect(margin, tY, contentWidth, 7.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, tY + 7.5, margin + contentWidth, tY + 7.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...darkNavy);
    doc.text(tr(row.k), margin + 3, tY + 5.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...tealDark);
    doc.text(tr(row.v), margin + 45, tY + 5.2);

    tY += 7.5;
  });

  tY += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkNavy);
  doc.text(tr('Sinifta ve Akilli Tahtada Nasil Kullanilir?'), margin, tY);

  tY += 6;
  const steps = [
    { step: '1', title: 'Platforma Erisin', desc: 'Tarayicidan Maarif Akademi adresini acin, "Sifresiz Demo" veya Ogretmen Girisi yapin.' },
    { step: '2', title: 'Kazanim Odasini Secin', desc: 'MAT.5.3.1 (Aci & Dikme) veya MAT.7.1.4 ders akisini akilli tahtaya yansitin.' },
    { step: '3', title: 'Tahta & Ogrenci Etkilesimi', desc: 'Ogrenciyi tahtaya kaldirarak Sanal Gonye ve Fener Bekcisi simulasyonlarini tamamlatain.' },
    { step: '4', title: 'Rubrik & PDF Karne Alin', desc: 'Ders sonunda ogrenci oz degerlendirme olcegini doldurun ve A4 PDF olarak kaydedin.' }
  ];

  steps.forEach((s) => {
    doc.setFillColor(...slateLight);
    doc.roundedRect(margin, tY, contentWidth, 14, 2, 2, 'F');

    doc.setFillColor(...tealPrimary);
    doc.circle(margin + 7, tY + 7, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...white);
    doc.text(s.step, margin + 5.8, tY + 9.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...darkNavy);
    doc.text(tr(s.title), margin + 15, tY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...slateGray);
    doc.text(tr(s.desc), margin + 15, tY + 10.5);

    tY += 16;
  });

  tY += 3;
  doc.setFillColor(...darkNavy);
  doc.roundedRect(margin, tY, contentWidth, 38, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...amberAccent);
  doc.text(tr('Gelecegin Sinifini Bugun Deneyimleyin!'), margin + 8, tY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  const finalDesc = tr(
    'Maarif Akademi, ogretmenlerimizin ders hazirlama yukunu hafifleten, ogrencileri pasif dinleyici olmaktan cikarip aktif kesfedicilere donusturen yerli ve milli bir egitim teknolojisi adimidir.'
  );
  doc.text(doc.splitTextToSize(finalDesc, contentWidth - 16), margin + 8, tY + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...tealPrimary);
  doc.text(tr('Erisim: dersonline web platformu | Iletisim & Destek: Maarif Akademi AR-GE'), margin + 8, tY + 32);

  const outPath = path.resolve('public/downloads/maarif-akademi-tanitim-rehberi.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(outPath, pdfBuffer);
  console.log('PDF generated successfully at:', outPath, 'Bytes:', pdfBuffer.byteLength);

  return outPath;
}

generatePromotionalPDF();
