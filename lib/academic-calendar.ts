/**
 * DERS TAKVİMİ & AKADEMİK HAFTALIK VERİ TABANI (ACADEMIC CALENDAR DATABASE)
 * 
 * Bu veri tabanı, Türkiye Yüzyılı Maarif Modeli ve MEB Çalışma Takvimine uygun 
 * 36 haftalık eğitim-öğretim yılının tüm tarih aralıklarını, aylarını, dönemlerini ve 
 * belirli gün/hafta/sınav takvimini merkezi olarak yönetir.
 * 
 * Tüm sınıflar (5. Sınıf, 6. Sınıf, 7. Sınıf, 8. Sınıf...) ve branşlar (Matematik, Fen, Türkçe...)
 * haftalık tarih ve dönem bilgilerini bu merkezi veri tabanından çeker.
 * İlerleyen yıllarda yalnızca bu dosyadaki tarih konfigürasyonunu güncellemek yeterlidir.
 */

export interface AcademicWeek {
  weekNo: number; // 1 - 36
  month: string; // "EYLÜL", "EKİM", "KASIM-ARALIK", vb.
  dateRange: string; // "14-18", "28-02", vb.
  formattedDateRange: string; // "14-18 EYLÜL", "28 EYLÜL - 02 EKİM", vb.
  label: string; // "1. HAFTA (14-18 EYLÜL)", "3. HAFTA (28 EYLÜL - 02 EKİM)", vb.
  specialEvent: string; // "2026-2027 Eğitim-Öğretim yılı başlangıcı", "Cumhuriyet Bayramı", "SINAV HAFTASI", vb.
  term: 1 | 2; // 1. Dönem (1-18), 2. Dönem (19-36)
  lessonHours: string; // Varsayılan "5 SAAT"
}

export interface AcademicCalendarConfig {
  academicYear: string; // "2026-2027"
  firstTermWeeks: number; // 18 hafta (1-18)
  secondTermWeeks: number; // 18 hafta (19-36)
  totalWeeks: number; // 36 hafta
  weeks: AcademicWeek[];
}

/**
 * 36 Haftalık Merkezi Akademik Takvim Verisi
 */
export const ACADEMIC_WEEKS_DATA: AcademicWeek[] = [
  {
    "weekNo": 1,
    "month": "EYLÜL",
    "dateRange": "14-18",
    "formattedDateRange": "14-18 EYLÜL",
    "label": "1. HAFTA (14-18 EYLÜL)",
    "specialEvent": "2026-2027 Eğitim-Öğretim yılı başlangıcı",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 2,
    "month": "EYLÜL",
    "dateRange": "21-25",
    "formattedDateRange": "21-25 EYLÜL",
    "label": "2. HAFTA (21-25 EYLÜL)",
    "specialEvent": "15 Temmuz Demokrasi ve Millî Birlik Günü",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 3,
    "month": "EYLÜL-EKİM",
    "dateRange": "28-02",
    "formattedDateRange": "28 EYLÜL - 02 EKİM",
    "label": "3. HAFTA (28 EYLÜL - 02 EKİM)",
    "specialEvent": "",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 4,
    "month": "EKİM",
    "dateRange": "05-09",
    "formattedDateRange": "05-09 EKİM",
    "label": "4. HAFTA (05-09 EKİM)",
    "specialEvent": "",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 5,
    "month": "EKİM",
    "dateRange": "12-16",
    "formattedDateRange": "12-16 EKİM",
    "label": "5. HAFTA (12-16 EKİM)",
    "specialEvent": "",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 6,
    "month": "EKİM",
    "dateRange": "19-23",
    "formattedDateRange": "19-23 EKİM",
    "label": "6. HAFTA (19-23 EKİM)",
    "specialEvent": "",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 7,
    "month": "EKİM",
    "dateRange": "26-30",
    "formattedDateRange": "26-30 EKİM",
    "label": "7. HAFTA (26-30 EKİM)",
    "specialEvent": "29 Ekim Cumhuriyet Bayramı",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 8,
    "month": "KASIM",
    "dateRange": "02-06",
    "formattedDateRange": "02-06 KASIM",
    "label": "8. HAFTA (02-06 KASIM)",
    "specialEvent": "Kızılay Haftası",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 9,
    "month": "KASIM",
    "dateRange": "09-13",
    "formattedDateRange": "09-13 KASIM",
    "label": "9. HAFTA (09-13 KASIM)",
    "specialEvent": "10 Kasım Atatürk'ü Anma Günü ve Atatürk Haftası (1. DÖNEM ARA TATİLİ: 16-20 Kasım)",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 10,
    "month": "KASIM",
    "dateRange": "23-27",
    "formattedDateRange": "23-27 KASIM",
    "label": "10. HAFTA (23-27 KASIM)",
    "specialEvent": "24 Kasım Öğretmenler Günü",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 11,
    "month": "KASIM-ARALIK",
    "dateRange": "30-04",
    "formattedDateRange": "30 KASIM - 04 ARALIK",
    "label": "11. HAFTA (30 KASIM - 04 ARALIK)",
    "specialEvent": "Dünya Engelliler Günü (3 Aralık)",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 12,
    "month": "ARALIK",
    "dateRange": "07-11",
    "formattedDateRange": "07-11 ARALIK",
    "label": "12. HAFTA (07-11 ARALIK)",
    "specialEvent": "İnsan Hakları ve Demokrasi Haftası",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 13,
    "month": "ARALIK",
    "dateRange": "14-18",
    "formattedDateRange": "14-18 ARALIK",
    "label": "13. HAFTA (14-18 ARALIK)",
    "specialEvent": "Tutum Yatırım ve Türk Malları Haftası",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 14,
    "month": "ARALIK",
    "dateRange": "21-25",
    "formattedDateRange": "21-25 ARALIK",
    "label": "14. HAFTA (21-25 ARALIK)",
    "specialEvent": "1. Dönem 1. Sınav Haftası",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 15,
    "month": "ARALIK",
    "dateRange": "28-31",
    "formattedDateRange": "28-31 ARALIK",
    "label": "15. HAFTA (28-31 ARALIK)",
    "specialEvent": "Yılbaşı Tatili (1 Ocak)",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 16,
    "month": "OCAK",
    "dateRange": "04-08",
    "formattedDateRange": "04-08 OCAK",
    "label": "16. HAFTA (04-08 OCAK)",
    "specialEvent": "1. Dönem 2. Sınav Haftası",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 17,
    "month": "OCAK",
    "dateRange": "11-15",
    "formattedDateRange": "11-15 OCAK",
    "label": "17. HAFTA (11-15 OCAK)",
    "specialEvent": "Dönem Sonu Değerlendirme",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 18,
    "month": "OCAK",
    "dateRange": "18-22",
    "formattedDateRange": "18-22 OCAK",
    "label": "18. HAFTA (18-22 OCAK)",
    "specialEvent": "1. Dönem Sonu - Karne Haftası (YARIYIL TATİLİ: 25 Ocak - 05 Şubat 2027)",
    "term": 1,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 19,
    "month": "ŞUBAT",
    "dateRange": "08-12",
    "formattedDateRange": "08-12 ŞUBAT",
    "label": "19. HAFTA (08-12 ŞUBAT)",
    "specialEvent": "2. Dönem Başlangıcı",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 20,
    "month": "ŞUBAT",
    "dateRange": "15-19",
    "formattedDateRange": "15-19 ŞUBAT",
    "label": "20. HAFTA (15-19 ŞUBAT)",
    "specialEvent": "",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 21,
    "month": "ŞUBAT",
    "dateRange": "22-26",
    "formattedDateRange": "22-26 ŞUBAT",
    "label": "21. HAFTA (22-26 ŞUBAT)",
    "specialEvent": "Vergi Haftası",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 22,
    "month": "MART",
    "dateRange": "01-05",
    "formattedDateRange": "01-05 MART",
    "label": "22. HAFTA (01-05 MART)",
    "specialEvent": "Yeşilay Haftası (2. DÖNEM ARA TATİLİ & RAMAZAN BAYRAMI: 08-12 Mart 2027)",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 23,
    "month": "MART",
    "dateRange": "15-19",
    "formattedDateRange": "15-19 MART",
    "label": "23. HAFTA (15-19 MART)",
    "specialEvent": "İstiklâl Marşı'nın Kabulü (12 Mart) ve Şehitler Günü (18 Mart)",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 24,
    "month": "MART",
    "dateRange": "22-26",
    "formattedDateRange": "22-26 MART",
    "label": "24. HAFTA (22-26 MART)",
    "specialEvent": "Orman Haftası / Kütüphaneler Haftası",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 25,
    "month": "MART-NİSAN",
    "dateRange": "29-02",
    "formattedDateRange": "29 MART - 02 NİSAN",
    "label": "25. HAFTA (29 MART - 02 NİSAN)",
    "specialEvent": "Otizm Farkındalık Günü",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 26,
    "month": "NİSAN",
    "dateRange": "05-09",
    "formattedDateRange": "05-09 NİSAN",
    "label": "26. HAFTA (05-09 NİSAN)",
    "specialEvent": "2. Dönem 1. Sınav Haftası",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 27,
    "month": "NİSAN",
    "dateRange": "12-16",
    "formattedDateRange": "12-16 NİSAN",
    "label": "27. HAFTA (12-16 NİSAN)",
    "specialEvent": "Turizm Haftası",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 28,
    "month": "NİSAN",
    "dateRange": "19-23",
    "formattedDateRange": "19-23 NİSAN",
    "label": "28. HAFTA (19-23 NİSAN)",
    "specialEvent": "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 29,
    "month": "NİSAN",
    "dateRange": "26-30",
    "formattedDateRange": "26-30 NİSAN",
    "label": "29. HAFTA (26-30 NİSAN)",
    "specialEvent": "29 Nisan Kût'ül Amâre Zaferi / 1 Mayıs Emek ve Dayanışma Günü",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 30,
    "month": "MAYIS",
    "dateRange": "03-07",
    "formattedDateRange": "03-07 MAYIS",
    "label": "30. HAFTA (03-07 MAYIS)",
    "specialEvent": "Bilişim Haftası / Trafik Haftası",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 31,
    "month": "MAYIS",
    "dateRange": "10-14",
    "formattedDateRange": "10-14 MAYIS",
    "label": "31. HAFTA (10-14 MAYIS)",
    "specialEvent": "Engelliler Haftası / Anneler Günü (KURBAN BAYRAMI TATİLİ: 15-19 Mayıs)",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 32,
    "month": "MAYIS",
    "dateRange": "20-21",
    "formattedDateRange": "20-21 MAYIS",
    "label": "32. HAFTA (20-21 MAYIS)",
    "specialEvent": "19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 33,
    "month": "MAYIS",
    "dateRange": "24-28",
    "formattedDateRange": "24-28 MAYIS",
    "label": "33. HAFTA (24-28 MAYIS)",
    "specialEvent": "İstanbul'un Fethi (29 Mayıs) / 2. Dönem 2. Sınav Haftası",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 34,
    "month": "MAYIS-HAZİRAN",
    "dateRange": "31-04",
    "formattedDateRange": "31 MAYIS - 04 HAZİRAN",
    "label": "34. HAFTA (31 MAYIS - 04 HAZİRAN)",
    "specialEvent": "Çevre Koruma Haftası",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 35,
    "month": "HAZİRAN",
    "dateRange": "07-11",
    "formattedDateRange": "07-11 HAZİRAN",
    "label": "35. HAFTA (07-11 HAZİRAN)",
    "specialEvent": "Dönem Sonu Değerlendirme",
    "term": 2,
    "lessonHours": "5 SAAT"
  },
  {
    "weekNo": 36,
    "month": "HAZİRAN",
    "dateRange": "14-18",
    "formattedDateRange": "14-18 HAZİRAN",
    "label": "36. HAFTA (14-18 HAZİRAN)",
    "specialEvent": "Eğitim-Öğretim Yılı Sonu - Karne Haftası",
    "term": 2,
    "lessonHours": "5 SAAT"
  }
];

export const ACADEMIC_CALENDAR_CONFIG: AcademicCalendarConfig = {
  academicYear: "2026-2027",
  firstTermWeeks: 18,
  secondTermWeeks: 18,
  totalWeeks: 36,
  weeks: ACADEMIC_WEEKS_DATA
};

/**
 * Hafta numarasına göre takvim verisini getirir (1 - 36)
 */
export function getAcademicWeek(weekNo: number): AcademicWeek | undefined {
  return ACADEMIC_WEEKS_DATA.find((w) => w.weekNo === weekNo);
}

/**
 * Hafta numarasına göre takvim başlık etiketini döndürür (Örn: "1. HAFTA (14-18 EYLÜL)")
 */
export function getAcademicWeekLabel(weekNo: number): string {
  const week = getAcademicWeek(weekNo);
  if (!week) return `${weekNo}. HAFTA`;
  return week.label;
}

/**
 * Hafta numarasına göre sadece tarih aralığını döndürür (Örn: "14-18 EYLÜL" veya "28 EYLÜL - 02 EKİM")
 */
export function getAcademicDateRange(weekNo: number): string {
  const week = getAcademicWeek(weekNo);
  if (!week) return "";
  return week.formattedDateRange;
}

/**
 * Döneme ait tüm haftaları getirir (1 veya 2)
 */
export function getAcademicWeeksByTerm(term: 1 | 2): AcademicWeek[] {
  return ACADEMIC_WEEKS_DATA.filter((w) => w.term === term);
}

/**
 * Tüm haftalık takvim listesini döndürür
 */
export function getAllAcademicWeeks(): AcademicWeek[] {
  return ACADEMIC_WEEKS_DATA;
}

/**
 * Aktif eğitim-öğretim yılı etiketini döndürür (Örn: "2026-2027")
 */
export function getActiveAcademicYear(): string {
  return ACADEMIC_CALENDAR_CONFIG.academicYear;
}

/**
 * 2026-2027 MEB Çalışma Takvimi 36 Haftalık Başlangıç Tarihleri (Pazartesi günleri)
 */
export const WEEK_START_DATES: Record<number, string> = {
  1: '2026-09-14',
  2: '2026-09-21',
  3: '2026-09-28',
  4: '2026-10-05',
  5: '2026-10-12',
  6: '2026-10-19',
  7: '2026-10-26',
  8: '2026-11-02',
  9: '2026-11-09',
  10: '2026-11-23',
  11: '2026-11-30',
  12: '2026-12-07',
  13: '2026-12-14',
  14: '2026-12-21',
  15: '2026-12-28',
  16: '2027-01-04',
  17: '2027-01-11',
  18: '2027-01-18',
  19: '2027-02-08',
  20: '2027-02-15',
  21: '2027-02-22',
  22: '2027-03-01',
  23: '2027-03-15',
  24: '2027-03-22',
  25: '2027-03-29',
  26: '2027-04-05',
  27: '2027-04-12',
  28: '2027-04-19',
  29: '2027-04-26',
  30: '2027-05-03',
  31: '2027-05-10',
  32: '2027-05-17',
  33: '2027-05-24',
  34: '2027-05-31',
  35: '2027-06-07',
  36: '2027-06-14',
};

/**
 * Sunucu/kullanıcı tarihine göre eşleşen akademik haftayı,
 * eğer tarih tatil veya başlangıç öncesiyse bir sonraki aktif haftayı döndürür.
 */
export function getCurrentOrNextAcademicWeek(currentDate: Date = new Date()): {
  week: AcademicWeek;
  isUpcoming: boolean;
  matchedExact: boolean;
} {
  const currentMs = currentDate.getTime();

  // 1. Mevcut tarih aktif bir akademik haftanın içinde mi? (Pazartesi 00:00 - Pazar 23:59:59)
  for (const week of ACADEMIC_WEEKS_DATA) {
    const startStr = WEEK_START_DATES[week.weekNo];
    if (!startStr) continue;
    const startDate = new Date(`${startStr}T00:00:00`);
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);

    if (currentMs >= startDate.getTime() && currentMs <= endDate.getTime()) {
      return {
        week,
        isUpcoming: false,
        matchedExact: true,
      };
    }
  }

  // 2. Eşleşmiyorsa (örn: okul başlamadan önce veya ara tatilde), ilk gelecek haftayı bul
  for (const week of ACADEMIC_WEEKS_DATA) {
    const startStr = WEEK_START_DATES[week.weekNo];
    if (!startStr) continue;
    const startDate = new Date(`${startStr}T00:00:00`);

    if (startDate.getTime() > currentMs) {
      return {
        week,
        isUpcoming: true,
        matchedExact: false,
      };
    }
  }

  // 3. Yıl sonu / yaz tatili sonrası için 1. Hafta varsayılan döner
  return {
    week: ACADEMIC_WEEKS_DATA[0],
    isUpcoming: true,
    matchedExact: false,
  };
}
