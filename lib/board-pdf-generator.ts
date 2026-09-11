'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BoardParticipationRecord } from '@/lib/board-participation-store';
import { StudentUser } from '@/types/auth';

export interface BoardReportMetaOptions {
  schoolName?: string;
  teacherName?: string;
  teacherBranch?: string;
  academicYear?: string;
}

function getNormalizedPercent(score?: number, maxScore?: number): number {
  if (score === undefined || score === null) return 80;
  if (maxScore && maxScore > 0) {
    const calculated = Math.round((score / maxScore) * 100);
    return Math.min(100, Math.max(0, calculated));
  }
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Creates HTML element for Individual Student Board Participation PDF Report.
 */
export function createStudentBoardReportHTML(
  student: StudentUser,
  records: BoardParticipationRecord[],
  options?: BoardReportMetaOptions
): HTMLDivElement {
  const school = options?.schoolName || student.school || 'Edirne Selimiye İmam Hatip Ortaokulu';
  const teacher = options?.teacherName || 'Ahmet Yılmaz';
  const rawBranch = options?.teacherBranch || 'Matematik';
  const teacherBranch = rawBranch.toLowerCase().includes('öğretmen') ? rawBranch : `${rawBranch} Öğretmeni`;
  const year = options?.academicYear || '2026 - 2027 Eğitim-Öğretim Yılı';
  const formattedDate = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const totalCount = records.length;
  const totalXp = records.reduce((sum, r) => sum + (r.xpEarned || 0), 0);
  const scoredRecords = records.filter((r) => r.score !== undefined && r.score !== null);
  const averageScore = scoredRecords.length > 0
    ? Math.min(100, Math.max(0, Math.round(
        scoredRecords.reduce((sum, r) => sum + getNormalizedPercent(r.score, r.maxScore), 0) / scoredRecords.length
      )))
    : 0;

  const gameCount = records.filter((r) => r.activityType === 'game').length;
  const testCount = records.filter((r) => r.activityType === 'test').length;
  const rubricCount = records.filter((r) => r.activityType === 'rubric').length;
  const journalCount = records.filter((r) => r.activityType === 'journal').length;

  // Sort descending for chronological list
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const rowsHTML = sortedRecords.length === 0
    ? `<tr><td colspan="6" style="padding: 16px; text-align: center; color: #64748b; font-size: 11px;">Kayıtlı tahta katılımı bulunmamaktadır.</td></tr>`
    : sortedRecords
        .map((r, idx) => {
          const normScore = r.score !== undefined && r.score !== null ? `%${getNormalizedPercent(r.score, r.maxScore)}` : '-';
          const typeBadge =
            r.activityType === 'game'
              ? '🎮 Oyun'
              : r.activityType === 'test'
              ? '📝 Test'
              : r.activityType === 'rubric'
              ? '📋 Rubrik'
              : '📖 Günlük';

          const rDate = new Date(r.timestamp).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
          const rTime = new Date(r.timestamp).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
          });

          return `
            <tr style="border-bottom: 1px solid #e2e8f0; font-size: 10px;">
              <td style="padding: 7px 6px; text-align: center; font-weight: 700; color: #64748b; width: 24px;">${idx + 1}</td>
              <td style="padding: 7px 8px; width: 85px;">
                <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: 800; font-size: 9px; background-color: #f1f5f9; color: #334155;">
                  ${typeBadge}
                </span>
              </td>
              <td style="padding: 7px 8px;">
                <div style="font-weight: 800; color: #0f172a; font-size: 10.5px;">${r.activityTitle}</div>
                ${r.outcomeCode ? `<span style="font-size: 9px; color: #0d9488; font-family: monospace; font-weight: 700;">${r.outcomeCode}</span>` : ''}
              </td>
              <td style="padding: 7px 8px; text-align: center; font-weight: 800; color: #0f766e; width: 80px;">
                ${normScore}
              </td>
              <td style="padding: 7px 8px; text-align: center; font-weight: 800; color: #d97706; width: 75px;">
                +${r.xpEarned} XP
              </td>
              <td style="padding: 7px 8px; text-align: right; color: #475569; font-size: 9.5px; width: 100px;">
                ${rDate} ${rTime}
              </td>
            </tr>
          `;
        })
        .join('');

  const container = document.createElement('div');
  container.style.width = '794px'; // Standard A4 width in px at 96 DPI
  container.style.minHeight = '1123px'; // Standard A4 height in px
  container.style.padding = '36px 40px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.boxSizing = 'border-box';
  container.style.position = 'relative';

  container.innerHTML = `
    <!-- TOP HEADER -->
    <div style="text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 12px; margin-bottom: 14px;">
      <div style="font-size: 11.5px; font-weight: 900; letter-spacing: 0.8px; color: #b91c1c; text-transform: uppercase;">
        T.C. MİLLÎ EĞİTİM BAKANLIĞI
      </div>
      <div style="font-size: 14px; font-weight: 900; color: #0f172a; margin-top: 2px;">
        ${school}
      </div>
      <div style="font-size: 11px; font-weight: 800; color: #0d9488; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
        TÜRKİYE YÜZYILI MAARİF MODELİ • AKILLI TAHTA & DERSE KATILIM RAPORU
      </div>
      <div style="font-size: 9.5px; color: #64748b; font-weight: 600; margin-top: 2px;">
        ${year} • Matematik Dersi • Rapor Tarihi: ${formattedDate}
      </div>
    </div>

    <!-- STUDENT META CARD -->
    <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px 16px; margin-bottom: 14px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 11px;">
      <div>
        <div style="color: #64748b; font-size: 9.5px; font-weight: 700; text-transform: uppercase;">Öğrenci Adı Soyadı</div>
        <div style="font-weight: 900; color: #0f172a; font-size: 12px; margin-top: 1px;">${student.name}</div>
      </div>
      <div>
        <div style="color: #64748b; font-size: 9.5px; font-weight: 700; text-transform: uppercase;">Sınıf / Şube / No</div>
        <div style="font-weight: 800; color: #0f172a; margin-top: 1px;">${student.classSection} Şubesi • No: #${student.studentNumber}</div>
      </div>
      <div>
        <div style="color: #64748b; font-size: 9.5px; font-weight: 700; text-transform: uppercase;">Tahtadan Toplam XP</div>
        <div style="font-weight: 800; color: #d97706; margin-top: 1px;">⚡ +${totalXp} XP</div>
      </div>
      <div>
        <div style="color: #64748b; font-size: 9.5px; font-weight: 700; text-transform: uppercase;">Ders / Branş</div>
        <div style="font-weight: 800; color: #0f172a; margin-top: 1px;">${teacherBranch}</div>
      </div>
    </div>

    <!-- KPI STRIP -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px;">
      <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 8px 10px; text-align: center;">
        <div style="font-size: 9px; font-weight: 700; color: #0f766e; text-transform: uppercase;">Tahtaya Kalkma</div>
        <div style="font-size: 16px; font-weight: 900; color: #115e59; margin-top: 2px;">${totalCount} Kez</div>
      </div>
      <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 8px 10px; text-align: center;">
        <div style="font-size: 9px; font-weight: 700; color: #92400e; text-transform: uppercase;">Kazanılan XP</div>
        <div style="font-size: 16px; font-weight: 900; color: #b45309; margin-top: 2px;">+${totalXp} XP</div>
      </div>
      <div style="background-color: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 8px 10px; text-align: center;">
        <div style="font-size: 9px; font-weight: 700; color: #3730a3; text-transform: uppercase;">Ortalama Başarı</div>
        <div style="font-size: 16px; font-weight: 900; color: #4338ca; margin-top: 2px;">%${averageScore}</div>
      </div>
      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 10px; text-align: center;">
        <div style="font-size: 9px; font-weight: 700; color: #475569; text-transform: uppercase;">Etkinlik Türleri</div>
        <div style="font-size: 10.5px; font-weight: 800; color: #0f172a; margin-top: 4px;">
          🎮 ${gameCount} | 📝 ${testCount} | 📋 ${rubricCount} | 📖 ${journalCount}
        </div>
      </div>
    </div>

    <!-- PARTICIPATION TABLE -->
    <div style="margin-bottom: 16px;">
      <div style="font-size: 11px; font-weight: 800; color: #0f172a; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
        AKILLI TAHTA ETKİNLİK GEÇMİŞİ VE BAŞARI LİSTESİ
      </div>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; font-size: 9.5px; font-weight: 800; color: #475569; text-align: left;">
            <th style="padding: 7px 6px; text-align: center; width: 24px;">#</th>
            <th style="padding: 7px 8px; width: 85px;">Tür</th>
            <th style="padding: 7px 8px;">Etkinlik Adı / Kazanım</th>
            <th style="padding: 7px 8px; text-align: center; width: 80px;">Başarı</th>
            <th style="padding: 7px 8px; text-align: center; width: 75px;">Kazanılan XP</th>
            <th style="padding: 7px 8px; text-align: right; width: 100px;">Tarih / Saat</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    </div>

    <!-- TEACHER NOTE -->
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; margin-bottom: 18px; font-size: 10.5px; line-height: 1.45;">
      <div style="font-weight: 800; color: #166534; text-transform: uppercase; font-size: 9.5px; margin-bottom: 3px;">
        ÖĞRETMEN DEĞERLENDİRME & GELİŞİM NOTU
      </div>
      <div style="color: #14532d;">
        Öğrenci, akıllı tahtada uygulanan interaktif matematik etkinliklerine, kazanım testlerine ve öz değerlendirme süreçlerine etkin katılım göstermiştir. Elde ettiği başarı skorları Türkiye Yüzyılı Maarif Modeli kazanım hedefleri doğrultusunda kayıt altına alınmıştır.
      </div>
    </div>

    <!-- SIGNATURE BLOCK -->
    <div style="border-top: 1px solid #cbd5e1; padding-top: 14px; margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; font-size: 10.5px; color: #334155;">
      <div style="text-align: center; width: 220px;">
        <div style="font-weight: 800; color: #0f172a; font-size: 11px;">${student.name}</div>
        <div style="font-size: 9.5px; color: #64748b;">Öğrenci İmzası</div>
        <div style="margin-top: 24px; border-bottom: 1px dashed #94a3b8; width: 140px; margin-left: auto; margin-right: auto;"></div>
      </div>

      <div style="text-align: center; width: 220px;">
        <div style="font-weight: 800; color: #0f172a; font-size: 11px;">${teacher}</div>
        <div style="font-size: 9.5px; color: #475569; margin-top: 1px; font-weight: 600;">${teacherBranch}</div>
        <div style="margin-top: 16px; border-bottom: 1px dashed #94a3b8; width: 140px; margin-left: auto; margin-right: auto;"></div>
      </div>
    </div>
  `;

  return container;
}

/**
 * Downloads Individual Student Board Report as PDF.
 */
export async function downloadStudentBoardReportPDF(
  student: StudentUser,
  records: BoardParticipationRecord[],
  options?: BoardReportMetaOptions
): Promise<void> {
  const container = createStudentBoardReportHTML(student, records, options);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
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

    const cleanName = student.name.trim().replace(/\s+/g, '_');
    const fileName = `${cleanName}_${student.classSection}_Tahtaya_Kalkma_Raporu.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Creates HTML element for Class-Wide Board Participation PDF Report.
 */
export function createClassBoardReportHTML(
  classSection: string,
  stats: Array<{
    student: StudentUser;
    count: number;
    totalXp: number;
    gameCount: number;
    testCount: number;
    rubricCount: number;
    journalCount: number;
    lastDate: string | null;
    participationLevel: string;
  }>,
  summary: {
    totalParticipations: number;
    participationRate: number;
    totalXp: number;
    neverParticipatedCount: number;
  },
  options?: BoardReportMetaOptions
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

  const rowsHTML = stats
    .map((item, idx) => {
      const lastFormatted = item.lastDate
        ? `${new Date(item.lastDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} ${new Date(item.lastDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
        : '-';

      let statusBadge = '<span style="color: #be123c; font-weight: 700;">Henüz Kalkmadı</span>';
      if (item.participationLevel === 'high') {
        statusBadge = '<span style="color: #15803d; font-weight: 800;">🌟 Çok Aktif</span>';
      } else if (item.participationLevel === 'medium') {
        statusBadge = '<span style="color: #0f766e; font-weight: 700;">👍 Katıldı</span>';
      }

      return `
        <tr style="border-bottom: 1px solid #e2e8f0; font-size: 10px;">
          <td style="padding: 6px 6px; text-align: center; font-weight: 700; color: #64748b; width: 24px;">${idx + 1}</td>
          <td style="padding: 6px 8px;">
            <div style="font-weight: 800; color: #0f172a; font-size: 10.5px;">${item.student.name}</div>
            <div style="font-size: 9px; color: #64748b; font-family: monospace;">No: #${item.student.studentNumber}</div>
          </td>
          <td style="padding: 6px 8px; text-align: center; font-weight: 800; color: #4338ca;">
            ${item.student.classSection}
          </td>
          <td style="padding: 6px 8px; text-align: center; font-weight: 900; color: ${item.count > 0 ? '#0f766e' : '#94a3b8'}; font-size: 11px;">
            ${item.count} Kez
          </td>
          <td style="padding: 6px 8px; text-align: center; font-size: 9.5px; font-weight: 700; color: #334155;">
            🎮${item.gameCount} 📝${item.testCount} 📋${item.rubricCount} 📖${item.journalCount}
          </td>
          <td style="padding: 6px 8px; text-align: center; font-weight: 800; color: #d97706;">
            +${item.totalXp} XP
          </td>
          <td style="padding: 6px 8px; text-align: center; font-size: 9.5px;">
            ${statusBadge}
          </td>
          <td style="padding: 6px 8px; text-align: right; color: #475569; font-size: 9px;">
            ${lastFormatted}
          </td>
        </tr>
      `;
    })
    .join('');

  const container = document.createElement('div');
  container.style.width = '794px';
  container.style.minHeight = '1123px';
  container.style.padding = '36px 40px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.boxSizing = 'border-box';
  container.style.position = 'relative';

  container.innerHTML = `
    <!-- HEADER -->
    <div style="text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 12px; margin-bottom: 14px;">
      <div style="font-size: 11.5px; font-weight: 900; letter-spacing: 0.8px; color: #b91c1c; text-transform: uppercase;">
        T.C. MİLLÎ EĞİTİM BAKANLIĞI
      </div>
      <div style="font-size: 14px; font-weight: 900; color: #0f172a; margin-top: 2px;">
        ${school}
      </div>
      <div style="font-size: 11px; font-weight: 800; color: #0d9488; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
        TÜRKİYE YÜZYILI MAARİF MODELİ • SINIF GENELİ TAHTAYA KALKMA & DERSE KATILIM RAPORU
      </div>
      <div style="font-size: 9.5px; color: #64748b; font-weight: 600; margin-top: 2px;">
        ${year} • Matematik Dersi (${classSection} Şubesi) • Rapor Tarihi: ${formattedDate}
      </div>
    </div>

    <!-- SUMMARY KPI CARDS -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px;">
      <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 8px 10px; text-align: center;">
        <div style="font-size: 9px; font-weight: 700; color: #0f766e; text-transform: uppercase;">Toplam Tahtaya Kalkma</div>
        <div style="font-size: 16px; font-weight: 900; color: #115e59; margin-top: 2px;">${summary.totalParticipations} Etkinlik</div>
      </div>
      <div style="background-color: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 8px 10px; text-align: center;">
        <div style="font-size: 9px; font-weight: 700; color: #3730a3; text-transform: uppercase;">Sınıf Katılım Oranı</div>
        <div style="font-size: 16px; font-weight: 900; color: #4338ca; margin-top: 2px;">%${summary.participationRate}</div>
      </div>
      <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 8px 10px; text-align: center;">
        <div style="font-size: 9px; font-weight: 700; color: #92400e; text-transform: uppercase;">Tahtadan Toplam XP</div>
        <div style="font-size: 16px; font-weight: 900; color: #b45309; margin-top: 2px;">+${summary.totalXp} XP</div>
      </div>
      <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 8px 10px; text-align: center;">
        <div style="font-size: 9px; font-weight: 700; color: #9f1239; text-transform: uppercase;">Teşvik Listesi</div>
        <div style="font-size: 16px; font-weight: 900; color: #be123c; margin-top: 2px;">${summary.neverParticipatedCount} Öğrenci</div>
      </div>
    </div>

    <!-- PARTICIPATION TABLE -->
    <div style="margin-bottom: 16px;">
      <div style="font-size: 11px; font-weight: 800; color: #0f172a; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
        ŞUBE ÖĞRENCİ KATILIM VE PERFORMANS SIRALAMASI
      </div>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; font-size: 9px; font-weight: 800; color: #475569; text-align: left;">
            <th style="padding: 6px 6px; text-align: center; width: 24px;">#</th>
            <th style="padding: 6px 8px;">Öğrenci Adı / No</th>
            <th style="padding: 6px 8px; text-align: center; width: 50px;">Şube</th>
            <th style="padding: 6px 8px; text-align: center; width: 80px;">Kalkış</th>
            <th style="padding: 6px 8px; text-align: center; width: 130px;">Etkinlik Dağılımı</th>
            <th style="padding: 6px 8px; text-align: center; width: 75px;">XP</th>
            <th style="padding: 6px 8px; text-align: center; width: 90px;">Durum</th>
            <th style="padding: 6px 8px; text-align: right; width: 95px;">Son Katılım</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    </div>

    <!-- SIGNATURE BLOCK -->
    <div style="border-top: 1px solid #cbd5e1; padding-top: 14px; margin-top: auto; display: flex; justify-content: flex-end; align-items: flex-end; font-size: 10.5px; color: #334155;">
      <div style="text-align: center; width: 220px;">
        <div style="font-weight: 800; color: #0f172a; font-size: 11px;">${teacher}</div>
        <div style="font-size: 9.5px; color: #475569; margin-top: 1px; font-weight: 600;">${teacherBranch}</div>
        <div style="margin-top: 16px; border-bottom: 1px dashed #94a3b8; width: 140px; margin-left: auto; margin-right: auto;"></div>
      </div>
    </div>
  `;

  return container;
}

/**
 * Downloads Class-Wide Board Report as PDF.
 */
export async function downloadClassBoardReportPDF(
  classSection: string,
  stats: Array<{
    student: StudentUser;
    count: number;
    totalXp: number;
    gameCount: number;
    testCount: number;
    rubricCount: number;
    journalCount: number;
    lastDate: string | null;
    participationLevel: string;
  }>,
  summary: {
    totalParticipations: number;
    participationRate: number;
    totalXp: number;
    neverParticipatedCount: number;
  },
  options?: BoardReportMetaOptions
): Promise<void> {
  const container = createClassBoardReportHTML(classSection, stats, summary, options);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
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

    const fileName = `${classSection}_Sinif_Tahtaya_Kalkma_Raporu.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}
