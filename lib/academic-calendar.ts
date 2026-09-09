/**
 * DERS TAKVİMİ & AKADEMİK HAFTALIK VERİ TABANI (ACADEMIC CALENDAR DATABASE)
 * 
 * Bu veri tabanı, Türkiye Yüzyılı Maarif Modeli ve MEB Çalışma Takvimine uygun 
 * 37 haftalık eğitim-öğretim yılının tüm tarih aralıklarını, aylarını, dönemlerini ve 
 * belirli gün/hafta/sınav takvimini merkezi olarak yönetir.
 * 
 * Tüm sınıflar (5. Sınıf, 6. Sınıf, 7. Sınıf, 8. Sınıf...) ve branşlar (Matematik, Fen, Türkçe...)
 * haftalık tarih ve dönem bilgilerini bu merkezi veri tabanından çeker.
 * İlerleyen yıllarda yalnızca bu dosyadaki tarih konfigürasyonunu güncellemek yeterlidir.
 */

export interface AcademicWeek {
  weekNo: number; // 1 - 37
  month: string; // "EYLÜL", "EKİM", "KASIM-ARALIK", vb.
  dateRange: string; // "14-20", "28-04", vb.
  formattedDateRange: string; // "14-20 EYLÜL", "28 EYLÜL - 04 EKİM", vb.
  label: string; // "1. HAFTA (14-20 EYLÜL)", "3. HAFTA (28 EYLÜL - 04 EKİM)", vb.
  specialEvent: string; // "2026-2027 Eğitim-Öğretim yılı başlangıcı", "Cumhuriyet Bayramı", "SINAV HAFTASI", vb.
  term: 1 | 2; // 1. Dönem (1-18), 2. Dönem (19-37)
  lessonHours: string; // Varsayılan "5 SAAT"
}

export interface AcademicCalendarConfig {
  academicYear: string; // "2026-2027"
  firstTermWeeks: number; // 18 hafta
  secondTermWeeks: number; // 19 hafta (19-37)
  totalWeeks: number; // 37 hafta
  weeks: AcademicWeek[];
}

/**
 * 37 Haftalık Merkezi Akademik Takvim Verisi
 */
export const ACADEMIC_WEEKS_DATA: AcademicWeek[] = [
  {
    weekNo: 1,
    month: "EYLÜL",
    dateRange: "14-20",
    formattedDateRange: "14-20 EYLÜL",
    label: "1. HAFTA (14-20 EYLÜL)",
    specialEvent: "2026-2027 Eğitim-Öğretim yılı başlangıcı",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 2,
    month: "EYLÜL",
    dateRange: "21-27",
    formattedDateRange: "21-27 EYLÜL",
    label: "2. HAFTA (21-27 EYLÜL)",
    specialEvent: "",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 3,
    month: "EYLÜL-EKİM",
    dateRange: "28-04",
    formattedDateRange: "28 EYLÜL - 04 EKİM",
    label: "3. HAFTA (28 EYLÜL - 04 EKİM)",
    specialEvent: "",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 4,
    month: "EKİM",
    dateRange: "05-11",
    formattedDateRange: "05-11 EKİM",
    label: "4. HAFTA (05-11 EKİM)",
    specialEvent: "",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 5,
    month: "EKİM",
    dateRange: "12-18",
    formattedDateRange: "12-18 EKİM",
    label: "5. HAFTA (12-18 EKİM)",
    specialEvent: "",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 6,
    month: "EKİM",
    dateRange: "19-25",
    formattedDateRange: "19-25 EKİM",
    label: "6. HAFTA (19-25 EKİM)",
    specialEvent: "",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 7,
    month: "EKİM-KASIM",
    dateRange: "26-01",
    formattedDateRange: "26 EKİM - 01 KASIM",
    label: "7. HAFTA (26 EKİM - 01 KASIM)",
    specialEvent: "Cumhuriyet Bayramı (29 Ekim)",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 8,
    month: "KASIM",
    dateRange: "02-08",
    formattedDateRange: "02-08 KASIM",
    label: "8. HAFTA (02-08 KASIM)",
    specialEvent: "Kızılay Haftası",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 9,
    month: "KASIM",
    dateRange: "09-15",
    formattedDateRange: "09-15 KASIM",
    label: "9. HAFTA (09-15 KASIM)",
    specialEvent: "Atatürk Haftası (10 Kasım)",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 10,
    month: "KASIM",
    dateRange: "23-29",
    formattedDateRange: "23-29 KASIM",
    label: "10. HAFTA (23-29 KASIM)",
    specialEvent: "Öğretmenler Günü (24 Kasım)",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 11,
    month: "KASIM-ARALIK",
    dateRange: "30-06",
    formattedDateRange: "30 KASIM - 06 ARALIK",
    label: "11. HAFTA (30 KASIM - 06 ARALIK)",
    specialEvent: "",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 12,
    month: "ARALIK",
    dateRange: "07-13",
    formattedDateRange: "07-13 ARALIK",
    label: "12. HAFTA (07-13 ARALIK)",
    specialEvent: "",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 13,
    month: "ARALIK",
    dateRange: "14-20",
    formattedDateRange: "14-20 ARALIK",
    label: "13. HAFTA (14-20 ARALIK)",
    specialEvent: "",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 14,
    month: "ARALIK",
    dateRange: "21-27",
    formattedDateRange: "21-27 ARALIK",
    label: "14. HAFTA (21-27 ARALIK)",
    specialEvent: "",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 15,
    month: "ARALIK-OCAK",
    dateRange: "28-03",
    formattedDateRange: "28 ARALIK - 03 OCAK",
    label: "15. HAFTA (28 ARALIK - 03 OCAK)",
    specialEvent: "Yılbaşı Tatili (1 Ocak)",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 16,
    month: "OCAK",
    dateRange: "04-10",
    formattedDateRange: "04-10 OCAK",
    label: "16. HAFTA (04-10 OCAK)",
    specialEvent: "SINAV HAFTASI (1. Dönem Ortak Sınavlar)",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 17,
    month: "OCAK",
    dateRange: "11-17",
    formattedDateRange: "11-17 OCAK",
    label: "17. HAFTA (11-17 OCAK)",
    specialEvent: "",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 18,
    month: "OCAK",
    dateRange: "18-24",
    formattedDateRange: "18-24 OCAK",
    label: "18. HAFTA (18-24 OCAK)",
    specialEvent: "Birinci Dönemin Sona Ermesi (Yarıyıl Tatili)",
    term: 1,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 19,
    month: "ŞUBAT",
    dateRange: "08-14",
    formattedDateRange: "08-14 ŞUBAT",
    label: "19. HAFTA (08-14 ŞUBAT)",
    specialEvent: "İkinci Yarıyıl Başlangıcı",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 20,
    month: "ŞUBAT",
    dateRange: "15-21",
    formattedDateRange: "15-21 ŞUBAT",
    label: "20. HAFTA (15-21 ŞUBAT)",
    specialEvent: "",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 21,
    month: "ŞUBAT",
    dateRange: "22-28",
    formattedDateRange: "22-28 ŞUBAT",
    label: "21. HAFTA (22-28 ŞUBAT)",
    specialEvent: "",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 22,
    month: "MART",
    dateRange: "01-07",
    formattedDateRange: "01-07 MART",
    label: "22. HAFTA (01-07 MART)",
    specialEvent: "Yeşilay Haftası",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 23,
    month: "MART",
    dateRange: "15-21",
    formattedDateRange: "15-21 MART",
    label: "23. HAFTA (15-21 MART)",
    specialEvent: "18 Mart Çanakkale Zaferi ve Şehitleri Anma Günü",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 24,
    month: "MART",
    dateRange: "22-28",
    formattedDateRange: "22-28 MART",
    label: "24. HAFTA (22-28 MART)",
    specialEvent: "Orman Haftası",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 25,
    month: "MART-NİSAN",
    dateRange: "29-04",
    formattedDateRange: "29 MART - 04 NİSAN",
    label: "25. HAFTA (29 MART - 04 NİSAN)",
    specialEvent: "SINAV HAFTASI (2. Dönem 1. Ortak Sınavlar)",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 26,
    month: "NİSAN",
    dateRange: "05-11",
    formattedDateRange: "05-11 NİSAN",
    label: "26. HAFTA (05-11 NİSAN)",
    specialEvent: "",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 27,
    month: "NİSAN",
    dateRange: "12-18",
    formattedDateRange: "12-18 NİSAN",
    label: "27. HAFTA (12-18 NİSAN)",
    specialEvent: "",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 28,
    month: "NİSAN",
    dateRange: "19-25",
    formattedDateRange: "19-25 NİSAN",
    label: "28. HAFTA (19-25 NİSAN)",
    specialEvent: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 29,
    month: "NİSAN-MAYIS",
    dateRange: "26-02",
    formattedDateRange: "26 NİSAN - 02 MAYIS",
    label: "29. HAFTA (26 NİSAN - 02 MAYIS)",
    specialEvent: "1 Mayıs Emek ve Dayanışma Günü",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 30,
    month: "MAYIS",
    dateRange: "03-09",
    formattedDateRange: "03-09 MAYIS",
    label: "30. HAFTA (03-09 MAYIS)",
    specialEvent: "Bilişim Haftası",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 31,
    month: "MAYIS",
    dateRange: "10-16",
    formattedDateRange: "10-16 MAYIS",
    label: "31. HAFTA (10-16 MAYIS)",
    specialEvent: "Engelliler Haftası",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 32,
    month: "MAYIS",
    dateRange: "17-23",
    formattedDateRange: "17-23 MAYIS",
    label: "32. HAFTA (17-23 MAYIS)",
    specialEvent: "19 Mayıs Atatürk’ü Anma, Gençlik ve Spor Bayramı",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 33,
    month: "MAYIS",
    dateRange: "24-30",
    formattedDateRange: "24-30 MAYIS",
    label: "33. HAFTA (24-30 MAYIS)",
    specialEvent: "İstanbul'un Fethi (29 Mayıs)",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 34,
    month: "MAYIS-HAZİRAN",
    dateRange: "31-06",
    formattedDateRange: "31 MAYIS - 06 HAZİRAN",
    label: "34. HAFTA (31 MAYIS - 06 HAZİRAN)",
    specialEvent: "Çevre Koruma Haftası",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 35,
    month: "HAZİRAN",
    dateRange: "07-13",
    formattedDateRange: "07-13 HAZİRAN",
    label: "35. HAFTA (07-13 HAZİRAN)",
    specialEvent: "SINAV HAFTASI (2. Dönem 2. Ortak Sınavlar)",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 36,
    month: "HAZİRAN",
    dateRange: "14-20",
    formattedDateRange: "14-20 HAZİRAN",
    label: "36. HAFTA (14-20 HAZİRAN)",
    specialEvent: "Yıl Sonu Etkinlikleri Haftası",
    term: 2,
    lessonHours: "5 SAAT"
  },
  {
    weekNo: 37,
    month: "HAZİRAN",
    dateRange: "21-27",
    formattedDateRange: "21-27 HAZİRAN",
    label: "37. HAFTA (21-27 HAZİRAN)",
    specialEvent: "Ders Yılının Sona Ermesi (Karnelerin Verilmesi)",
    term: 2,
    lessonHours: "5 SAAT"
  }
];

export const ACADEMIC_CALENDAR_CONFIG: AcademicCalendarConfig = {
  academicYear: "2026-2027",
  firstTermWeeks: 18,
  secondTermWeeks: 19,
  totalWeeks: 37,
  weeks: ACADEMIC_WEEKS_DATA
};

// ============================================================================
// HELPER FONKSİYONLAR (ACADEMIC CALENDAR HELPERS)
// ============================================================================

/**
 * Belirtilen hafta numarasına göre hafta bilgilerini döndürür.
 * @param weekNo 1 ile 37 arasında hafta numarası
 */
export function getAcademicWeek(weekNo: number): AcademicWeek | undefined {
  return ACADEMIC_WEEKS_DATA.find((w) => w.weekNo === weekNo);
}

/**
 * Hafta numarasına göre standart başlık etiketini döndürür.
 * Örn: 1 -> "1. HAFTA (14-20 EYLÜL)", 3 -> "3. HAFTA (28 EYLÜL - 04 EKİM)"
 */
export function getAcademicWeekLabel(weekNo: number): string {
  const week = getAcademicWeek(weekNo);
  if (!week) return `${weekNo}. HAFTA`;
  return week.label;
}

/**
 * Hafta numarasına göre sadece tarih aralığı etiketini döndürür.
 * Örn: 1 -> "14-20 EYLÜL", 3 -> "28 EYLÜL - 04 EKİM"
 */
export function getAcademicDateRange(weekNo: number): string {
  const week = getAcademicWeek(weekNo);
  if (!week) return "";
  return week.formattedDateRange;
}

/**
 * Döneme göre (1 veya 2) haftaları listeler.
 */
export function getAcademicWeeksByTerm(term: 1 | 2): AcademicWeek[] {
  return ACADEMIC_WEEKS_DATA.filter((w) => w.term === term);
}

/**
 * Tüm 37 haftanın listesini döndürür.
 */
export function getAllAcademicWeeks(): AcademicWeek[] {
  return ACADEMIC_WEEKS_DATA;
}

/**
 * Aktif eğitim-öğretim yılını döndürür (Örn: "2026-2027").
 */
export function getActiveAcademicYear(): string {
  return ACADEMIC_CALENDAR_CONFIG.academicYear;
}
