'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { StudentUser } from '@/types/auth';

export interface StudentCardsPdfOptions {
  schoolName: string;
  classSection: string;
  classCode: string;
  teacherName?: string;
  students: StudentUser[];
}

const CARDS_PER_PAGE = 10; // 2 columns x 5 rows maximizes density on A4

/**
 * Creates an off-screen HTML page element formatted for A4 print.
 */
function createPageHTML(
  pageStudents: StudentUser[],
  pageIndex: number,
  totalPages: number,
  options: StudentCardsPdfOptions
): HTMLDivElement {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.height = '1131px'; // Exact 1 : 1.414 A4 Aspect Ratio
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  container.style.padding = '20px 24px';
  container.style.boxSizing = 'border-box';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'space-between';
  container.style.zIndex = '-9999';

  const todayStr = new Date().toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const cardsHtml = pageStudents
    .map((student) => {
      const stuName = student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Öğrenci';
      const stuNumber = student.studentNumber || '---';
      const password = student.password || stuNumber;
      const classCode = options.classCode || student.classCode || '------';
      const classSection = student.classSection || options.classSection || '5-A';

      return `
        <div style="
          border: 1.5px dashed #94a3b8;
          border-radius: 8px;
          background: #f8fafc;
          padding: 8px 10px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          overflow: hidden;
        ">
          <!-- Card Header & Website -->
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 3px;
            margin-bottom: 2px;
            border-bottom: 1px solid #e2e8f0;
          ">
            <span style="font-size: 10.5px; font-weight: 800; color: #0284c7;">
              maarifakademi.com.tr
            </span>
            <span style="font-size: 9px; font-weight: 800; color: #475569; background: #e2e8f0; padding: 1px 5px; border-radius: 4px;">
              Öğrenci Giriş Kartı
            </span>
          </div>

          <!-- Student Name -->
          <div style="
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-left: 4px solid #0284c7;
            border-radius: 6px;
            padding: 6px 8px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          ">
            <span style="
              font-size: 13px;
              font-weight: 900;
              color: #0f172a;
              line-height: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: block;
            ">
              ${stuName}
            </span>
          </div>

          <!-- Key Credentials Badges (4 parameters) -->
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr 1.2fr 1.2fr;
            gap: 5px;
            margin: 4px 0;
          ">
            <div style="
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              padding: 4px 2px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 38px;
              box-sizing: border-box;
            ">
              <div style="font-size: 7.5px; color: #64748b; font-weight: 800; text-transform: uppercase; line-height: 1.1; margin-bottom: 2px;">Şube</div>
              <div style="font-size: 11px; font-weight: 900; color: #0f172a; line-height: 1.1;">${classSection}</div>
            </div>

            <div style="
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              padding: 4px 2px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 38px;
              box-sizing: border-box;
            ">
              <div style="font-size: 7.5px; color: #64748b; font-weight: 800; text-transform: uppercase; line-height: 1.1; margin-bottom: 2px;">Okul No</div>
              <div style="font-size: 11px; font-weight: 900; color: #0f172a; line-height: 1.1;">#${stuNumber}</div>
            </div>

            <div style="
              background: #eff6ff;
              border: 1px solid #bfdbfe;
              border-radius: 6px;
              padding: 4px 2px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 38px;
              box-sizing: border-box;
            ">
              <div style="font-size: 7.5px; color: #1e40af; font-weight: 800; text-transform: uppercase; line-height: 1.1; margin-bottom: 2px;">Sınıf Kodu</div>
              <div style="font-size: 11.5px; font-weight: 900; font-family: monospace; color: #1e3a8a; line-height: 1.1;">${classCode}</div>
            </div>

            <div style="
              background: #ecfdf5;
              border: 1px solid #a7f3d0;
              border-radius: 6px;
              padding: 4px 2px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 38px;
              box-sizing: border-box;
            ">
              <div style="font-size: 7.5px; color: #065f46; font-weight: 800; text-transform: uppercase; line-height: 1.1; margin-bottom: 2px;">Şifre</div>
              <div style="font-size: 11.5px; font-weight: 900; font-family: monospace; color: #047857; line-height: 1.1;">${password}</div>
            </div>
          </div>

          <!-- Step-by-Step Instructions -->
          <div style="
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 6px 8px;
            font-size: 9px;
            line-height: 1.4;
            color: #334155;
            margin-top: 2px;
            box-sizing: border-box;
          ">
            <div style="font-weight: 800; color: #0f172a; font-size: 9.5px; margin-bottom: 2px;">
              Giriş Yönergesi:
            </div>
            <div>
              <strong>1.</strong> Tarayıcınızdan <strong style="color: #0284c7;">maarifakademi.com.tr</strong> adresine girin.
            </div>
            <div>
              <strong>2.</strong> <strong>Öğrenci Girişi</strong> ekranında <strong>Sınıf Kodu</strong> (${classCode}), <strong>Okul No</strong> (#${stuNumber}) ve <strong>Şifreniz</strong> ile sisteme giriş yapın.
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = `
    <!-- PAGE HEADER -->
    <div style="
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    ">
      <div>
        <div style="font-size: 9px; font-weight: 800; letter-spacing: 1px; color: #64748b; text-transform: uppercase;">
          T.C. MİLLÎ EĞİTİM BAKANLIĞI
        </div>
        <div style="font-size: 15px; font-weight: 900; color: #0f172a; margin-top: 1px;">
          ${options.schoolName || 'Okul Bilgisi'}
        </div>
        <div style="font-size: 11px; color: #334155; font-weight: 700; margin-top: 1px;">
          Sınıf / Şube: <span style="color: #0d9488; font-weight: 900;">${options.classSection}</span>
          • Sınıf Kodu: <span style="font-family: monospace; font-weight: 900; color: #1e3a8a;">${options.classCode}</span>
          ${options.teacherName ? `• Öğretmen: <span>${options.teacherName}</span>` : ''}
        </div>
      </div>

      <div style="text-align: right;">
        <div style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          color: #000000;
          border: 1.5px solid #000000;
          padding: 6px 14px;
          border-radius: 6px;
          box-sizing: border-box;
          text-align: center;
        ">
          <span style="
            font-weight: 900;
            font-size: 11px;
            line-height: 1;
            letter-spacing: 0.5px;
            display: block;
          ">
            ÖĞRENCİ GİRİŞ KARTLARI
          </span>
        </div>
        <div style="font-size: 9px; color: #64748b; margin-top: 4px; font-weight: 600;">
          Tarih: ${todayStr} • Sayfa ${pageIndex + 1} / ${totalPages}
        </div>
      </div>
    </div>

    <!-- CARDS GRID: 2 COLUMNS X 5 ROWS (10 CARDS) -->
    <div style="
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(5, 1fr);
      gap: 10px;
      flex: 1;
      min-height: 0;
    ">
      ${cardsHtml}
    </div>

    <!-- PAGE FOOTER -->
    <div style="
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 8.5px;
      color: #64748b;
      font-weight: 600;
    ">
      <div>
        <strong>Öğretmen Bilgilendirmesi:</strong> Lütfen her bir öğrenciye ait kartı kesikli çizgilerden ayırarak dağıtınız.
      </div>
      <div>
        <strong>maarifakademi.com.tr</strong>
      </div>
      <div>
        Sayfa ${pageIndex + 1} / ${totalPages} (Toplam ${options.students.length} Öğrenci)
      </div>
    </div>
  `;

  return container;
}

/**
 * Generates and triggers download of the student login credentials cards PDF.
 */
export async function downloadStudentCardsPDF(options: StudentCardsPdfOptions): Promise<void> {
  if (!options.students || options.students.length === 0) {
    alert('Bu sınıfta kayıtlı öğrenci bulunamadı.');
    return;
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Sort students naturally by number, then name
  const sortedStudents = [...options.students].sort((a, b) => {
    const numA = parseInt(a.studentNumber || '0', 10);
    const numB = parseInt(b.studentNumber || '0', 10);
    if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
      return numA - numB;
    }
    return (a.name || '').localeCompare(b.name || '', 'tr-TR');
  });

  // Split into chunks of CARDS_PER_PAGE (10 students per page)
  const chunks: StudentUser[][] = [];
  for (let i = 0; i < sortedStudents.length; i += CARDS_PER_PAGE) {
    chunks.push(sortedStudents.slice(i, i + CARDS_PER_PAGE));
  }

  const totalPages = chunks.length;

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    const pageStudents = chunks[pageIdx];
    const container = createPageHTML(pageStudents, pageIdx, totalPages, options);
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, {
        scale: 2, // High resolution for crisp printing
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (pageIdx > 0) {
        pdf.addPage('a4', 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    } finally {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
  }

  // Clean filename: e.g. Selimiye_Ortaokulu_5-A_Ogrenci_Giris_Kartlari.pdf
  const cleanSchool = (options.schoolName || 'Okul')
    .replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ]/gi, '_')
    .substring(0, 30);
  const cleanClass = (options.classSection || 'Sinif').replace(/[^a-zA-Z0-9-]/gi, '_');
  const fileName = `${cleanSchool}_${cleanClass}_Ogrenci_Giris_Kartlari.pdf`;

  pdf.save(fileName);
}
