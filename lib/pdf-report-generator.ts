'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { RubricSubmissionRecord } from '@/lib/rubric-store';
import { getRubricForOutcome } from '@/lib/rubric-data';

export interface ReportMetaOptions {
  schoolName?: string;
  teacherName?: string;
  teacherBranch?: string;
  academicYear?: string;
}

/**
 * Creates an HTML element formatted as an official MEB Türkiye Yüzyılı Maarif Modeli Student Evaluation Report.
 */
export function createStudentReportHTML(
  sub: RubricSubmissionRecord,
  options?: ReportMetaOptions
): HTMLDivElement {
  const school = options?.schoolName || sub.school || 'Edirne Selimiye İmam Hatip Ortaokulu';
  const teacher = options?.teacherName || 'Ahmet Yılmaz';
  const rawBranch = options?.teacherBranch || 'Matematik';
  const teacherBranch = rawBranch.toLowerCase().includes('öğretmen') ? rawBranch : `${rawBranch} Öğretmeni`;
  const year = options?.academicYear || '2026 - 2027 Eğitim-Öğretim Yılı';
  const formattedDate = new Date(sub.submittedAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const rubric = getRubricForOutcome(sub.outcomeId, sub.outcomeTitle, sub.outcomeCode);

  const container = document.createElement('div');
  container.style.width = '794px'; // Standard A4 width in px at 96 DPI
  container.style.minHeight = '1123px'; // Standard A4 height in px
  container.style.padding = '36px 40px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.boxSizing = 'border-box';
  container.style.position = 'relative';

  // Criteria Rows HTML
  const criteriaRowsHTML = rubric.criteria
    .map((cr, idx) => {
      const score = sub.ratings[cr.id] || 0;
      const desc = cr.levelDescriptions[score as 1 | 2 | 3 | 4] || 'Değerlendirilmedi';

      let badgeBg = '#f1f5f9';
      let badgeColor = '#475569';
      let levelLabel = `${score} / 4 Puan`;

      if (score === 4) {
        badgeBg = '#dcfce7';
        badgeColor = '#15803d';
        levelLabel = '4/4 - Çok Başarılı';
      } else if (score === 3) {
        badgeBg = '#ccfbf1';
        badgeColor = '#0f766e';
        levelLabel = '3/4 - Başarılı';
      } else if (score === 2) {
        badgeBg = '#fef3c7';
        badgeColor = '#b45309';
        levelLabel = '2/4 - Kısmen Başarılı';
      } else if (score === 1) {
        badgeBg = '#ffe4e6';
        badgeColor = '#be123c';
        levelLabel = '1/4 - Geliştirilmeli';
      }

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 9px 8px; font-weight: 700; color: #334155; font-size: 11px; vertical-align: top; width: 28px; text-align: center;">
            ${idx + 1}
          </td>
          <td style="padding: 9px 10px; vertical-align: top; width: 170px;">
            <div style="font-weight: 800; color: #0f172a; font-size: 11.5px; line-height: 1.3;">${cr.title}</div>
            <div style="font-size: 9.5px; color: #64748b; font-weight: 600; margin-top: 2px;">${cr.category}</div>
          </td>
          <td style="padding: 9px 8px; vertical-align: top; width: 105px; text-align: center;">
            <span style="display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; background-color: ${badgeBg}; color: ${badgeColor};">
              ${levelLabel}
            </span>
          </td>
          <td style="padding: 9px 10px; font-size: 10.5px; color: #334155; line-height: 1.4; vertical-align: top;">
            <em>"${desc}"</em>
          </td>
        </tr>
      `;
    })
    .join('');

  container.innerHTML = `
    <!-- TOP HEADER -->
    <div style="text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 12px; margin-bottom: 14px;">
      <div style="font-size: 12px; font-weight: 900; letter-spacing: 0.8px; color: #b91c1c; text-transform: uppercase;">
        T.C. MİLLÎ EĞİTİM BAKANLIĞI
      </div>
      <div style="font-size: 11px; font-weight: 800; color: #0f766e; margin-top: 2px; text-transform: uppercase;">
        TÜRKİYE YÜZYILI MAARİF MODELİ
      </div>
      <div style="font-size: 14px; font-weight: 900; color: #0f172a; margin-top: 4px;">
        ÖĞRENCİ KAZANIM & ÖZ DEĞERLENDİRME GELİŞİM RAPORU
      </div>
      <div style="font-size: 10px; color: #64748b; font-weight: 600; margin-top: 2px;">
        ${year} • Matematik Dersi (5. Sınıf)
      </div>
    </div>

    <!-- METADATA INFORMATION GRID -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
      <!-- School & Course Info -->
      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; font-size: 11px;">
        <div style="display: flex; margin-bottom: 4px;">
          <span style="font-weight: 800; color: #475569; width: 90px;">Okulun Adı:</span>
          <span style="font-weight: 700; color: #0f172a; flex: 1;">${school}</span>
        </div>
        <div style="display: flex; margin-bottom: 4px;">
          <span style="font-weight: 800; color: #475569; width: 90px;">Ders / Sınıf:</span>
          <span style="font-weight: 700; color: #0f172a; flex: 1;">Matematik • ${sub.classSection} Şubesi</span>
        </div>
        <div style="display: flex;">
          <span style="font-weight: 800; color: #475569; width: 90px;">Rapor Tarihi:</span>
          <span style="font-weight: 600; color: #0f172a; flex: 1;">${formattedDate}</span>
        </div>
      </div>

      <!-- Student Info -->
      <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 10px 12px; font-size: 11px;">
        <div style="display: flex; margin-bottom: 4px;">
          <span style="font-weight: 800; color: #0f766e; width: 95px;">Öğrenci Adı:</span>
          <span style="font-weight: 900; color: #134e4a; flex: 1; font-size: 12px;">${sub.studentName}</span>
        </div>
        <div style="display: flex; margin-bottom: 4px;">
          <span style="font-weight: 800; color: #0f766e; width: 95px;">Öğrenci No:</span>
          <span style="font-weight: 700; color: #134e4a; flex: 1;">No: ${sub.studentNumber}</span>
        </div>
        <div style="display: flex;">
          <span style="font-weight: 800; color: #0f766e; width: 95px;">Değerlendirme:</span>
          <span style="font-weight: 700; color: #0f766e; flex: 1;">Öğrenci Öz Değerlendirmesi</span>
        </div>
      </div>
    </div>

    <!-- LEARNING OUTCOME BANNER (LIGHT & TONER-FRIENDLY) -->
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
      <div style="flex: 1;">
        <div style="font-size: 9.5px; font-weight: 900; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
          HEDEF ÖĞRENME ÇIKTISI / KAZANIM:
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span style="background-color: #dcfce7; color: #15803d; border: 1px solid #86efac; padding: 2px 7px; border-radius: 5px; font-family: monospace; font-size: 11px; font-weight: 900; line-height: 1.2; display: inline-block;">${sub.outcomeCode}</span>
          <span style="font-size: 11.5px; font-weight: 800; color: #0f172a; line-height: 1.35;">${sub.outcomeTitle}</span>
        </div>
      </div>
      <div style="text-align: right; background-color: #ffffff; padding: 6px 12px; border-radius: 8px; border: 1px solid #bbf7d0; flex-shrink: 0;">
        <div style="font-size: 8.5px; color: #166534; font-weight: 800; text-transform: uppercase;">Toplam Skor</div>
        <div style="font-size: 13.5px; font-weight: 900; color: #15803d; font-family: monospace; margin-top: 1px;">${sub.totalScore} / ${sub.maxScore} (%${sub.percentage})</div>
      </div>
    </div>

    <!-- RUBRIC CRITERIA TABLE -->
    <div style="margin-bottom: 14px; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #475569;">
            <th style="padding: 8px 8px; text-align: center; width: 28px;">No</th>
            <th style="padding: 8px 10px; width: 170px;">Ölçüt / Kategori</th>
            <th style="padding: 8px 8px; text-align: center; width: 105px;">Öğrenci Puanı</th>
            <th style="padding: 8px 10px;">Seçilen Düzey Açıklaması & Kanıt</th>
          </tr>
        </thead>
        <tbody>
          ${criteriaRowsHTML}
        </tbody>
      </table>
    </div>

    <!-- PERFORMANCE SUMMARY & REFLECTION NOTES -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
      <!-- Student Note -->
      <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 10px 12px;">
        <div style="font-size: 10px; font-weight: 900; color: #92400e; text-transform: uppercase; margin-bottom: 4px;">
          📝 Öğrencinin Kişisel Öğrenme Notu & Hedefi:
        </div>
        <div style="font-size: 10.5px; color: #78350f; line-height: 1.4; font-style: italic;">
          "${sub.studentNote || 'Öğrenci tarafından özel bir gelişim notu girilmemiştir.'}"
        </div>
      </div>

      <!-- Teacher Feedback -->
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 10px 12px;">
        <div style="font-size: 10px; font-weight: 900; color: #166534; text-transform: uppercase; margin-bottom: 4px;">
          👨‍🏫 Öğretmen Değerlendirme & Yönlendirme Notu:
        </div>
        <div style="font-size: 10.5px; color: #14532d; line-height: 1.4;">
          ${sub.teacherFeedback || 'Öğrenci belirlenen ölçütlerde yetkinliğini tamamlamış olup kazanım hedeflerine ulaşmıştır.'}
        </div>
      </div>
    </div>

    <!-- SIGNATURE BLOCK -->
    <div style="border-top: 1px solid #cbd5e1; padding-top: 14px; margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; font-size: 10.5px; color: #334155;">
      <div style="text-align: center; width: 220px;">
        <div style="font-weight: 800; color: #0f172a; font-size: 11px;">${sub.studentName}</div>
        <div style="margin-top: 26px; border-bottom: 1px dashed #94a3b8; width: 140px; margin-left: auto; margin-right: auto;"></div>
      </div>

      <div style="text-align: center; width: 220px;">
        <div style="font-weight: 800; color: #0f172a; font-size: 11px;">${teacher}</div>
        <div style="font-size: 9.5px; color: #475569; margin-top: 2px; font-weight: 600;">${teacherBranch}</div>
        <div style="margin-top: 16px; border-bottom: 1px dashed #94a3b8; width: 140px; margin-left: auto; margin-right: auto;"></div>
      </div>
    </div>
  `;

  return container;
}

/**
 * Downloads an individual student's evaluation as an official PDF.
 */
export async function downloadStudentRubricPDF(
  sub: RubricSubmissionRecord,
  options?: ReportMetaOptions
): Promise<void> {
  const container = createStudentReportHTML(sub, options);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    const cleanStudentName = sub.studentName.trim().replace(/\s+/g, '_');
    const fileName = `${cleanStudentName}_${sub.classSection}_${sub.outcomeCode}_Oz_Degerlendirme.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Creates and downloads a combined multi-page PDF containing reports for all students in the list.
 */
export async function downloadBulkClassRubricPDF(
  submissions: RubricSubmissionRecord[],
  options?: ReportMetaOptions & { classSection?: string; outcomeCode?: string; outcomeTitle?: string }
): Promise<void> {
  if (!submissions || submissions.length === 0) {
    alert('İndirilecek öğrenci değerlendirme kaydı bulunamadı.');
    return;
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Sequential generation for each student
  for (let i = 0; i < submissions.length; i++) {
    const sub = submissions[i];
    const container = createStudentReportHTML(sub, options);
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    } finally {
      document.body.removeChild(container);
    }
  }

  const classSec = options?.classSection || submissions[0]?.classSection || 'Sinif';
  const outCode = options?.outcomeCode || submissions[0]?.outcomeCode || 'Kazanim';
  const fileName = `${classSec}_${outCode}_Toplu_Ogrenci_Raporlari.pdf`;
  pdf.save(fileName);
}
