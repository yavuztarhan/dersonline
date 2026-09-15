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
/**
 * Creates an HTML element formatted as an official MEB Türkiye Yüzyılı Maarif Modeli Full Rubric Evaluation Scale (Dereceli Değerlendirme Ölçeği).
 */
/**
 * Creates an HTML element formatted as an official MEB Türkiye Yüzyılı Maarif Modeli Full Rubric Evaluation Scale (Dereceli Değerlendirme Ölçeği).
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
  // Landscape A4 calibrated dimensions: 1100px width with compact margins
  container.style.width = '1100px';
  container.style.padding = '16px 22px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.boxSizing = 'border-box';
  container.style.position = 'relative';

  // Criteria Matrix Rows HTML (All 4 Levels side-by-side)
  const criteriaRowsHTML = rubric.criteria
    .map((cr, idx) => {
      const selectedScore = sub.ratings[cr.id] || 0;

      const levelCells = [1, 2, 3, 4].map((lvl) => {
        const isSelected = selectedScore === lvl;
        const desc = cr.levelDescriptions[lvl as 1 | 2 | 3 | 4] || '-';

        let cellBg = isSelected ? '#f0fdf4' : '#ffffff';
        let cellBorder = isSelected ? '2px solid #059669' : '1px solid #cbd5e1';
        let badgeBg = isSelected ? '#15803d' : '#f1f5f9';
        let badgeText = isSelected ? '#ffffff' : '#64748b';

        return `
          <td style="padding: 5px 6px; vertical-align: top; background-color: ${cellBg}; border: ${cellBorder}; border-collapse: collapse; font-size: 8.5px; line-height: 1.25; color: ${isSelected ? '#064e3b' : '#334155'}; position: relative;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px; padding-bottom: 2px; border-bottom: 1px solid ${isSelected ? '#bbf7d0' : '#f1f5f9'};">
              <span style="font-size: 8px; font-weight: 800; padding: 1px 4px; border-radius: 3px; background-color: ${badgeBg}; color: ${badgeText};">
                ${lvl}. Düzey (${lvl}P)
              </span>
              ${isSelected ? `<span style="font-size: 8px; font-weight: 900; color: #15803d; background-color: #dcfce7; padding: 1px 4px; border-radius: 3px; border: 1px solid #86efac;">✓ SEÇİLDİ</span>` : `<span style="font-size: 8px; color: #94a3b8;">[ &nbsp; ]</span>`}
            </div>
            <div style="font-style: normal; font-weight: ${isSelected ? '600' : '400'};">
              ${desc}
            </div>
          </td>
        `;
      }).join('');

      return `
        <tr style="border-bottom: 1px solid #cbd5e1;">
          <!-- Criterion Name & Category -->
          <td style="padding: 5px 6px; vertical-align: top; width: 165px; background-color: #f8fafc; border: 1px solid #cbd5e1;">
            <div style="display: flex; align-items: flex-start; gap: 4px;">
              <span style="display: inline-block; width: 16px; height: 16px; line-height: 16px; text-align: center; border-radius: 4px; background-color: #0d9488; color: #ffffff; font-weight: 800; font-size: 8.5px; flex-shrink: 0;">
                ${idx + 1}
              </span>
              <div>
                <div style="font-weight: 800; color: #0f172a; font-size: 9.5px; line-height: 1.2;">
                  ${cr.title}
                </div>
                <div style="font-size: 8px; color: #0f766e; font-weight: 700; margin-top: 1px;">
                  ${cr.category}
                </div>
              </div>
            </div>
          </td>
          <!-- 4 Level Columns -->
          ${levelCells}
          <!-- Score Column -->
          <td style="padding: 5px 3px; vertical-align: middle; text-align: center; width: 50px; background-color: ${selectedScore > 0 ? '#f0fdf4' : '#ffffff'}; border: 1px solid #cbd5e1; font-family: monospace;">
            ${selectedScore > 0 ? `
              <div style="font-size: 11px; font-weight: 900; color: #15803d;">${selectedScore}</div>
              <div style="font-size: 7.5px; color: #166534; font-weight: 700;">/ 4 Puan</div>
            ` : `
              <span style="color: #94a3b8; font-size: 9px;">-</span>
            `}
          </td>
        </tr>
      `;
    })
    .join('');

  // Checklist items HTML if present
  let checklistHTML = '';
  if (rubric.checklistItems && rubric.checklistItems.length > 0) {
    const itemsCols = rubric.checklistItems
      .map((chk, i) => {
        return `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 3px 6px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 8px;">
            <div style="display: flex; align-items: center; gap: 3px; flex: 1; margin-right: 4px;">
              <span style="font-weight: 800; color: #0d9488;">${i + 1}.</span>
              <span style="color: #334155; line-height: 1.15;">${chk.text}</span>
            </div>
            <div style="display: flex; gap: 3px; flex-shrink: 0; font-size: 7.5px; font-weight: 700;">
              <span style="padding: 1px 3px; border-radius: 3px; border: 1px solid #cbd5e1; color: #475569;">[ ] Evet</span>
              <span style="padding: 1px 3px; border-radius: 3px; border: 1px solid #cbd5e1; color: #475569;">[ ] Kısmen</span>
              <span style="padding: 1px 3px; border-radius: 3px; border: 1px solid #cbd5e1; color: #475569;">[ ] Hayır</span>
            </div>
          </div>
        `;
      })
      .join('');

    checklistHTML = `
      <div style="margin-top: 6px; margin-bottom: 6px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 8px;">
        <div style="font-size: 8.5px; font-weight: 800; color: #0f766e; text-transform: uppercase; margin-bottom: 3px; display: flex; align-items: center; justify-content: space-between;">
          <span>✓ ÖĞRENCİ ÖZ DENETİM KONTROL LİSTESİ</span>
          <span style="font-size: 7.5px; color: #64748b; font-weight: 600;">(Hedef Beceriler)</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          ${itemsCols}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <!-- TOP OFFICIAL MEB MAARİF HEADER -->
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0d9488; padding-bottom: 5px; margin-bottom: 7px;">
      <div style="text-align: left;">
        <div style="font-size: 10px; font-weight: 900; letter-spacing: 0.6px; color: #b91c1c; text-transform: uppercase;">
          T.C. MİLLÎ EĞİTİM BAKANLIĞI
        </div>
        <div style="font-size: 8.5px; font-weight: 800; color: #0f766e; margin-top: 1px; text-transform: uppercase;">
          TÜRKİYE YÜZYILI MAARİF MODELİ
        </div>
      </div>

      <div style="text-align: center;">
        <div style="font-size: 12px; font-weight: 900; color: #0f172a; letter-spacing: 0.4px; text-transform: uppercase;">
          DERECELİ ÖZ DEĞERLENDİRME ÖLÇEĞİ (RUBRİK)
        </div>
        <div style="font-size: 8.5px; color: #475569; font-weight: 600; margin-top: 1px;">
          Matematik Dersi • Süreç Odaklı Ölçme ve Değerlendirme Aracı
        </div>
      </div>

      <div style="text-align: right;">
        <div style="font-size: 8.5px; font-weight: 800; color: #0f172a;">
          ${year}
        </div>
        <div style="font-size: 8px; color: #64748b; font-weight: 600; margin-top: 1px;">
          Tarih: ${formattedDate}
        </div>
      </div>
    </div>

    <!-- STUDENT & OUTCOME METADATA TABLE -->
    <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 8px; margin-bottom: 7px; font-size: 8.5px;">
      <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr; gap: 6px; margin-bottom: 4px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
        <div>
          <span style="font-weight: 800; color: #475569;">Okul:</span>
          <span style="font-weight: 700; color: #0f172a; margin-left: 3px;">${school}</span>
        </div>
        <div>
          <span style="font-weight: 800; color: #475569;">Öğrenci:</span>
          <span style="font-weight: 900; color: #0f766e; margin-left: 3px;">${sub.studentName}</span>
        </div>
        <div>
          <span style="font-weight: 800; color: #475569;">Sınıf / No:</span>
          <span style="font-weight: 700; color: #0f172a; margin-left: 3px;">${sub.classSection} • No: ${sub.studentNumber}</span>
        </div>
        <div>
          <span style="font-weight: 800; color: #475569;">Puan / Düzey:</span>
          <span style="font-weight: 900; color: #15803d; margin-left: 3px;">${sub.totalScore} / ${sub.maxScore} (%${sub.percentage})</span>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="background-color: #0d9488; color: #ffffff; font-family: monospace; font-size: 8px; font-weight: 900; padding: 1px 5px; border-radius: 3px; flex-shrink: 0;">
          ${sub.outcomeCode}
        </span>
        <span style="font-weight: 800; color: #0f172a; font-size: 9px; line-height: 1.2;">
          ${sub.outcomeTitle}
        </span>
      </div>
    </div>

    <!-- RUBRIC MATRIX TABLE -->
    <div style="border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; margin-bottom: 6px;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background-color: #0f766e; color: #ffffff; font-size: 8px; font-weight: 900; text-transform: uppercase;">
            <th style="padding: 5px 6px; width: 165px; border-right: 1px solid #115e59;">Ölçüt / Değerlendirme Alanı</th>
            <th style="padding: 5px 6px; width: 215px; border-right: 1px solid #115e59;">1. Düzey: Geliştirilmeli (1P)</th>
            <th style="padding: 5px 6px; width: 215px; border-right: 1px solid #115e59;">2. Düzey: Kısmen Başarılı (2P)</th>
            <th style="padding: 5px 6px; width: 215px; border-right: 1px solid #115e59;">3. Düzey: Başarılı (3P)</th>
            <th style="padding: 5px 6px; width: 215px; border-right: 1px solid #115e59;">4. Düzey: Çok Başarılı (4P)</th>
            <th style="padding: 5px 3px; width: 50px; text-align: center;">Puan</th>
          </tr>
        </thead>
        <tbody>
          ${criteriaRowsHTML}
        </tbody>
      </table>
    </div>

    <!-- OPTIONAL CHECKLIST -->
    ${checklistHTML}

    <!-- REFLECTION NOTES & SIGNATURE STRIP -->
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-top: 6px; font-size: 8px;">
      <!-- Student Reflection -->
      <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 5px; padding: 5px 7px;">
        <div style="font-weight: 800; color: #92400e; text-transform: uppercase; font-size: 7.5px; margin-bottom: 2px;">
          📝 Öğrenci Öz Yansıtma & Hedef Notu:
        </div>
        <div style="color: #78350f; font-style: italic; line-height: 1.2;">
          "${sub.studentNote || 'Özel bir gelişim notu girilmemiştir.'}"
        </div>
      </div>

      <!-- Teacher Feedback -->
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 5px; padding: 5px 7px;">
        <div style="font-weight: 800; color: #166534; text-transform: uppercase; font-size: 7.5px; margin-bottom: 2px;">
          👨‍🏫 Öğretmen Değerlendirme & Yönlendirme Notu:
        </div>
        <div style="color: #14532d; line-height: 1.2;">
          ${sub.teacherFeedback || 'Öğrenci hedeflenen beceri düzeyine ulaşmıştır.'}
        </div>
      </div>

      <!-- Rubric Scale Legend & Signatures -->
      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 5px; padding: 5px 7px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="font-weight: 800; color: #334155; text-transform: uppercase; font-size: 7.5px; margin-bottom: 1px;">
            📊 Derecelendirme Skalası:
          </div>
          <div style="color: #475569; font-size: 7.5px; line-height: 1.15;">
            1-8P: Geliştirilmeli • 9-12P: Kısmen Başarılı<br/>
            13-16P: Başarılı • 17-20P: Çok Başarılı
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 3px; border-top: 1px dashed #cbd5e1; margin-top: 3px;">
          <div style="text-align: center;">
            <div style="font-weight: 700; color: #0f172a; font-size: 7.5px;">Öğrenci İmzası</div>
            <div style="margin-top: 8px; border-bottom: 1px dashed #94a3b8; width: 55px;"></div>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: 700; color: #0f172a; font-size: 7.5px;">${teacher}</div>
            <div style="font-size: 7px; color: #64748b;">${teacherBranch}</div>
            <div style="margin-top: 3px; border-bottom: 1px dashed #94a3b8; width: 55px;"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  return container;
}

/**
 * Downloads an individual student's evaluation as an official Landscape MEB Rubric Scale PDF.
 * Calibrated with safe printable margins (8mm) and aspect-fit scaling to prevent any overflow or page clipping.
 */
export async function downloadStudentRubricPDF(
  sub: RubricSubmissionRecord,
  options?: ReportMetaOptions
): Promise<void> {
  const container = createStudentReportHTML(sub, options);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2, // High resolution for crisp print/view
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 297 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 210 mm

    // Safe printable margins (8mm) on all sides to prevent printer clipping
    const marginX = 8;
    const marginY = 8;
    const availWidth = pdfWidth - 2 * marginX; // 281 mm
    const availHeight = pdfHeight - 2 * marginY; // 194 mm

    // Proportional aspect-fit scale
    const scale = Math.min(availWidth / canvas.width, availHeight / canvas.height);
    const finalWidth = canvas.width * scale;
    const finalHeight = canvas.height * scale;

    // Center precisely within printable margins
    const posX = marginX + (availWidth - finalWidth) / 2;
    const posY = marginY + (availHeight - finalHeight) / 2;

    pdf.addImage(imgData, 'JPEG', posX, posY, finalWidth, finalHeight);

    const cleanStudentName = sub.studentName.trim().replace(/\s+/g, '_');
    const fileName = `${cleanStudentName}_${sub.classSection}_${sub.outcomeCode}_Dereceli_Degerlendirme_Olcegi.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Creates and downloads a combined multi-page PDF containing rubric scales for all students in the list.
 * Each student's rubric scale is guaranteed to fit precisely on its own landscape page without overflowing.
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
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const marginX = 8;
  const marginY = 8;
  const availWidth = pdfWidth - 2 * marginX;
  const availHeight = pdfHeight - 2 * marginY;

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

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const scale = Math.min(availWidth / canvas.width, availHeight / canvas.height);
      const finalWidth = canvas.width * scale;
      const finalHeight = canvas.height * scale;

      const posX = marginX + (availWidth - finalWidth) / 2;
      const posY = marginY + (availHeight - finalHeight) / 2;

      if (i > 0) {
        pdf.addPage('a4', 'landscape');
      }

      pdf.addImage(imgData, 'JPEG', posX, posY, finalWidth, finalHeight);
    } finally {
      document.body.removeChild(container);
    }
  }

  const classSec = options?.classSection || submissions[0]?.classSection || 'Sinif';
  const outCode = options?.outcomeCode || submissions[0]?.outcomeCode || 'Kazanim';
  const fileName = `${classSec}_${outCode}_Toplu_Dereceli_Olcekler.pdf`;
  pdf.save(fileName);
}

/**
 * Creates an HTML element formatted as an official MEB Student Development & Performance Card (Öğrenci Gelişim ve Başarı Karnesi).
 */
export function createStudentDevelopmentCardHTML(
  profile: import('@/lib/student-performance-store').StudentPerformanceProfile,
  options?: ReportMetaOptions
): HTMLDivElement {
  const school = options?.schoolName || 'Edirne Selimiye İmam Hatip Ortaokulu';
  const teacher = options?.teacherName || 'Ahmet Yılmaz';
  const rawBranch = options?.teacherBranch || 'Matematik';
  const teacherBranch = rawBranch.toLowerCase().includes('öğretmen') ? rawBranch : `${rawBranch} Öğretmeni`;
  const year = options?.academicYear || '2026 - 2027 Eğitim-Öğretim Yılı';
  const formattedDate = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const container = document.createElement('div');
  container.style.width = '794px'; // Standard A4 width in px at 96 DPI
  container.style.padding = '24px 30px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.boxSizing = 'border-box';
  container.style.position = 'relative';

  // Outcomes Rows
  const outcomeRowsHTML = profile.outcomes
    .map((item, idx) => {
      const actScore = item.hasActivityData && item.activitySuccessRate !== null ? `%${item.activitySuccessRate}` : '-';
      const rubricScore = item.hasRubricData && item.rubricScore !== null ? `%${item.rubricScore}` : '-';
      const rubricBadge = item.rubricLevel || 'Değerlendirilmedi';

      let rubricColor = '#64748b';
      let rubricBg = '#f1f5f9';
      if (item.rubricLevel === 'Mükemmel') {
        rubricColor = '#15803d';
        rubricBg = '#dcfce7';
      } else if (item.rubricLevel === 'Başarılı') {
        rubricColor = '#0f766e';
        rubricBg = '#ccfbf1';
      } else if (item.rubricLevel === 'Orta') {
        rubricColor = '#b45309';
        rubricBg = '#fef3c7';
      } else if (item.rubricLevel === 'Geliştirilmeli') {
        rubricColor = '#be123c';
        rubricBg = '#ffe4e6';
      }

      const journalText = item.journalEntry?.studentReflection
        ? `"${item.journalEntry.studentReflection.slice(0, 80)}..."`
        : item.rubricSubmission?.studentNote
        ? `"${item.rubricSubmission.studentNote.slice(0, 80)}..."`
        : '-';

      return `
        <tr style="border-bottom: 1px solid #e2e8f0; font-size: 9.5px;">
          <td style="padding: 6px 4px; font-weight: 700; text-align: center; color: #475569;">${idx + 1}</td>
          <td style="padding: 6px 6px;">
            <div style="font-weight: 800; color: #0d9488; font-size: 9.5px;">${item.outcomeCode}</div>
            <div style="font-weight: 700; color: #0f172a; line-height: 1.2; margin-top: 1px;">${item.outcomeTitle}</div>
          </td>
          <td style="padding: 6px 4px; text-align: center; font-weight: 800; color: #059669;">
            ${actScore}
          </td>
          <td style="padding: 6px 4px; text-align: center;">
            <div style="font-weight: 800; color: #4338ca;">${rubricScore}</div>
            <span style="display: inline-block; padding: 1px 5px; border-radius: 3px; font-size: 8.5px; font-weight: 800; background-color: ${rubricBg}; color: ${rubricColor}; margin-top: 1px;">
              ${rubricBadge}
            </span>
          </td>
          <td style="padding: 6px 6px; color: #334155; font-size: 9px; line-height: 1.25; font-style: italic;">
            ${journalText}
          </td>
          <td style="padding: 6px 4px; font-size: 9px; font-weight: 700; color: #1e293b;">
            ${item.alignmentInsight.title}
          </td>
        </tr>
      `;
    })
    .join('');

  container.innerHTML = `
    <!-- HEADER -->
    <div style="text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 10px; margin-bottom: 12px;">
      <div style="font-size: 11px; font-weight: 900; letter-spacing: 0.8px; color: #b91c1c; text-transform: uppercase;">
        T.C. MİLLÎ EĞİTİM BAKANLIĞI
      </div>
      <div style="font-size: 14px; font-weight: 900; color: #0f172a; margin-top: 2px;">
        ${school}
      </div>
      <div style="font-size: 10px; font-weight: 700; color: #0d9488; margin-top: 1px; text-transform: uppercase; letter-spacing: 0.5px;">
        TÜRKİYE YÜZYILI MAARİF MODELİ • ÖĞRENCİ BİREYSEL GELİŞİM VE BAŞARI KARNESİ
      </div>
      <div style="font-size: 9px; color: #64748b; font-weight: 600; margin-top: 1px;">
        ${year} • Düzenlenme Tarihi: ${formattedDate}
      </div>
    </div>

    <!-- STUDENT META CARD -->
    <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-size: 10px;">
      <div>
        <div style="color: #64748b; font-size: 8.5px; font-weight: 700; text-transform: uppercase;">Öğrenci Adı Soyadı</div>
        <div style="font-weight: 900; color: #0f172a; font-size: 11px; margin-top: 1px;">${profile.studentName}</div>
      </div>
      <div>
        <div style="color: #64748b; font-size: 8.5px; font-weight: 700; text-transform: uppercase;">Sınıf / Şube / No</div>
        <div style="font-weight: 800; color: #0f172a; margin-top: 1px;">${profile.classSection} Şubesi • No: #${profile.studentNumber}</div>
      </div>
      <div>
        <div style="color: #64748b; font-size: 8.5px; font-weight: 700; text-transform: uppercase;">Toplam XP & Sıralama</div>
        <div style="font-weight: 800; color: #d97706; margin-top: 1px;">⚡ ${profile.totalPoints} XP (Sınıf #${profile.rank})</div>
      </div>
      <div>
        <div style="color: #64748b; font-size: 8.5px; font-weight: 700; text-transform: uppercase;">Ders / Alan</div>
        <div style="font-weight: 800; color: #0f172a; margin-top: 1px;">${teacherBranch}</div>
      </div>
    </div>

    <!-- KPI SUMMARY STRIP -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px;">
      <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 6px 8px; text-align: center;">
        <div style="font-size: 8.5px; font-weight: 700; color: #065f46; text-transform: uppercase;">Oyun / Etkinlik Ort.</div>
        <div style="font-size: 14px; font-weight: 900; color: #047857; margin-top: 1px;">%${profile.overallSuccessRate || 0}</div>
      </div>
      <div style="background-color: #eef2ff; border: 1px solid #c7d2fe; border-radius: 6px; padding: 6px 8px; text-align: center;">
        <div style="font-size: 8.5px; font-weight: 700; color: #3730a3; text-transform: uppercase;">Öz Değerlendirme Rubrik Ort.</div>
        <div style="font-size: 14px; font-weight: 900; color: #4338ca; margin-top: 1px;">%${profile.overallRubricRate || 0}</div>
      </div>
      <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; border-radius: 6px; padding: 6px 8px; text-align: center;">
        <div style="font-size: 8.5px; font-weight: 700; color: #115e59; text-transform: uppercase;">Tamamlanan Kazanım</div>
        <div style="font-size: 14px; font-weight: 900; color: #0f766e; margin-top: 1px;">${profile.completedOutcomesCount} / ${profile.totalOutcomesCount}</div>
      </div>
      <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 6px 8px; text-align: center;">
        <div style="font-size: 8.5px; font-weight: 700; color: #92400e; text-transform: uppercase;">Öğrenme Günlüğü</div>
        <div style="font-size: 14px; font-weight: 900; color: #b45309; margin-top: 1px;">${profile.totalJournalsCount || 0} Günlük</div>
      </div>
    </div>

    <!-- OUTCOMES TABLE -->
    <div style="margin-bottom: 12px;">
      <div style="font-size: 10px; font-weight: 800; color: #0f172a; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">
        KAZANIM BAZLI BAŞARI, ÖZ DEĞERLENDİRME VE GELİŞİM TABLOSU
      </div>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; font-size: 9px; font-weight: 800; color: #475569; text-align: left;">
            <th style="padding: 6px 4px; width: 22px; text-align: center;">#</th>
            <th style="padding: 6px 6px; width: 210px;">Kazanım / Öğrenme Çıktısı</th>
            <th style="padding: 6px 4px; width: 55px; text-align: center;">Oyun (%)</th>
            <th style="padding: 6px 4px; width: 90px; text-align: center;">Rubrik / Düzey</th>
            <th style="padding: 6px 6px;">Öğrenci Yansıtması / Notu</th>
            <th style="padding: 6px 4px; width: 100px;">Gelişim Durumu</th>
          </tr>
        </thead>
        <tbody>
          ${outcomeRowsHTML}
        </tbody>
      </table>
    </div>

    <!-- TEACHER PEDAGOGICAL ASSESSMENT NOTE -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-bottom: 14px; font-size: 9.5px; line-height: 1.35;">
      <div style="font-weight: 800; color: #0d9488; text-transform: uppercase; font-size: 9px; margin-bottom: 2px;">
        ÖĞRETMENİN GENEL PEDAGOJİK DEĞERLENDİRMESİ VE GELİŞİM YORUMU
      </div>
      <div style="color: #334155;">
        Öğrenci, Türkiye Yüzyılı Maarif Modeli kapsamında tasarlanan kavram çıkarımı, çizim atölyesi ve matematiksel modelleme etkinliklerinde aktif katılım sağlamıştır. Öz değerlendirme rubriklerindeki farkındalık seviyesi genel başarıyla tutarlı olup, analitik düşünme ve problem çözme becerileri desteklenmeye devam edilmektedir.
      </div>
    </div>

    <!-- SIGNATURE BLOCK -->
    <div style="border-top: 1px solid #cbd5e1; padding-top: 10px; margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; font-size: 9.5px; color: #334155;">
      <div style="text-align: center; width: 200px;">
        <div style="font-weight: 800; color: #0f172a; font-size: 10px;">${profile.studentName}</div>
        <div style="font-size: 8.5px; color: #64748b;">Öğrenci İmzası</div>
        <div style="margin-top: 18px; border-bottom: 1px dashed #94a3b8; width: 120px; margin-left: auto; margin-right: auto;"></div>
      </div>

      <div style="text-align: center; width: 200px;">
        <div style="font-weight: 800; color: #0f172a; font-size: 10px;">${teacher}</div>
        <div style="font-size: 8.5px; color: #475569; margin-top: 1px; font-weight: 600;">${teacherBranch}</div>
        <div style="margin-top: 12px; border-bottom: 1px dashed #94a3b8; width: 120px; margin-left: auto; margin-right: auto;"></div>
      </div>
    </div>
  `;

  return container;
}

/**
 * Downloads a comprehensive Student Development Report Card (Gelişim Karnesi) as a PDF.
 * Calibrated with safe printable margins (8mm) and aspect-fit scaling to prevent any overflow.
 */
export async function downloadStudentDevelopmentReportPDF(
  profile: import('@/lib/student-performance-store').StudentPerformanceProfile,
  options?: ReportMetaOptions
): Promise<void> {
  const container = createStudentDevelopmentCardHTML(profile, options);
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

    // 8mm safe printable margins
    const marginX = 8;
    const marginY = 8;
    const availWidth = pdfWidth - 2 * marginX;
    const availHeight = pdfHeight - 2 * marginY;

    const scale = Math.min(availWidth / canvas.width, availHeight / canvas.height);
    const finalWidth = canvas.width * scale;
    const finalHeight = canvas.height * scale;

    const posX = marginX + (availWidth - finalWidth) / 2;
    const posY = marginY + (availHeight - finalHeight) / 2;

    pdf.addImage(imgData, 'JPEG', posX, posY, finalWidth, finalHeight);

    const cleanStudentName = profile.studentName.trim().replace(/\s+/g, '_');
    const fileName = `${cleanStudentName}_${profile.classSection}_Gelisim_Karnesi.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}
