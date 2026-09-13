import * as XLSX from 'xlsx';

export interface ParsedEOkulStudent {
  studentNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender?: 'Kız' | 'Erkek' | string;
  sNo?: number;
}

export interface ParseEOkulResult {
  success: boolean;
  error?: string;
  students: ParsedEOkulStudent[];
  totalDetected: number;
  girlsCount: number;
  boysCount: number;
  sheetName?: string;
  detectedClass?: string;
}

/**
 * Extracts class section name from arbitrary text (e.g. headers, sheet name, file name).
 * Returns standardized format like '7-A', '5-B', etc.
 */
export function extractClassFromText(text: string): string | null {
  if (!text) return null;
  const str = text.trim();

  // Pattern 1: Sınıf[ı] ... Şube[si] : 7 / A or 7/A or 7 - A
  const p1 = /(?:sınıf[ı]?\s*(?:\/|\s*ve\s*)?\s*şube[si]?)\s*[:=\-]?\s*([5-8]|9|1[0-2])\s*(?:\.|\s*sınıf)?\s*[\/\-\s]\s*([A-Za-zÇĞİÖŞÜçğıöşü])/i;
  const m1 = str.match(p1);
  if (m1) {
    return `${m1[1]}-${m1[2].toLocaleUpperCase('tr-TR')}`;
  }

  // Pattern 2: "7. Sınıf / A Şubesi" or "7. Sınıf A Şubesi" or "7.Sınıf A Şubesi"
  const p2 = /\b([5-8]|9|1[0-2])\s*\.?\s*sınıf\s*(?:\/|\s*)\s*([A-Za-zÇĞİÖŞÜçğıöşü])\s*(?:şubesi)?\b/i;
  const m2 = str.match(p2);
  if (m2) {
    return `${m2[1]}-${m2[2].toLocaleUpperCase('tr-TR')}`;
  }

  // Pattern 3: Standalone "7/A", "7-A", "7 - A", "7 / A" with word boundary
  const p3 = /(?:^|[^\wçğıöşü])([5-8]|9|1[0-2])\s*[\/\-]\s*([A-Za-zÇĞİÖŞÜçğıöşü])(?:$|[^\wçğıöşü])/i;
  const m3 = str.match(p3);
  if (m3) {
    return `${m3[1]}-${m3[2].toLocaleUpperCase('tr-TR')}`;
  }

  // Pattern 4: "7A" when followed by "Sınıfı" or "Şubesi"
  const p4 = /(?:^|[^\wçğıöşü])([5-8]|9|1[0-2])\s*([A-Za-zÇĞİÖŞÜçğıöşü])\s*(?:sınıf|şube)/i;
  const m4 = str.match(p4);
  if (m4) {
    return `${m4[1]}-${m4[2].toLocaleUpperCase('tr-TR')}`;
  }

  // Pattern 5: Filenames / sheet names tokens like "7A_...", "7-A_...", "(7A)", "eokul_8B.xlsx"
  const p5 = /(?:^|[\s_\-\(\[])([5-8]|9|1[0-2])\s*[\/\-_]?\s*([A-Za-zÇĞİÖŞÜçğıöşü])(?:[\s_\-\)\]\.]|$)/i;
  const m5 = str.match(p5);
  if (m5) {
    return `${m5[1]}-${m5[2].toLocaleUpperCase('tr-TR')}`;
  }

  // Pattern 6: Exact or isolated class like "7A", "7-A", "7_A", "7/A"
  const p6 = /^\s*([5-8]|9|1[0-2])\s*[\/\-_ ]?\s*([A-Za-zÇĞİÖŞÜçğıöşü])\s*$/i;
  const m6 = str.match(p6);
  if (m6) {
    return `${m6[1]}-${m6[2].toLocaleUpperCase('tr-TR')}`;
  }

  return null;
}

/**
 * Converts text to Turkish title case handling 'İ'/'i' and 'I'/'ı' correctly.
 */
export function toTurkishTitleCase(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .toLocaleLowerCase('tr-TR')
    .split(/\s+/)
    .map((word) => (word ? word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1) : ''))
    .join(' ');
}

/**
 * Parses an e-Okul student list Excel file (.xlsx / .xls).
 * Handles standard MEB e-Okul table format where headers might be located at
 * row 0 or within the first 20 rows, skipping footer summaries (e.g. Kız/Erkek öğrenci sayısı).
 */
export function parseEOkulExcel(data: ArrayBuffer | Uint8Array, fileName?: string): ParseEOkulResult {
  try {
    const workbook = XLSX.read(data, { type: 'array' });
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return {
        success: false,
        error: 'Excel dosyası içerisinde herhangi bir çalışma sayfası (sheet) bulunamadı.',
        students: [],
        totalDetected: 0,
        girlsCount: 0,
        boysCount: 0
      };
    }

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (!rawRows || rawRows.length === 0) {
      return {
        success: false,
        error: 'Excel dosyası boş görünüyor.',
        students: [],
        totalDetected: 0,
        girlsCount: 0,
        boysCount: 0
      };
    }

    // Try detecting class section from file name or sheet name first
    let detectedClass: string | undefined = undefined;
    if (fileName) {
      const fromFile = extractClassFromText(fileName);
      if (fromFile) detectedClass = fromFile;
    }
    if (!detectedClass && firstSheetName) {
      const fromSheet = extractClassFromText(firstSheetName);
      if (fromSheet) detectedClass = fromSheet;
    }

    // Locate header row by searching common Turkish e-Okul headers
    let headerRowIdx = -1;
    let colNo = -1;
    let colAd = -1;
    let colSoyad = -1;
    let colFullName = -1;
    let colCinsiyet = -1;
    let colSNo = -1;

    for (let r = 0; r < Math.min(rawRows.length, 25); r++) {
      const row = rawRows[r];
      if (!row || !Array.isArray(row)) continue;

      // Scan row for potential class section info if not yet detected
      if (!detectedClass) {
        const rowJoined = row.map((c) => String(c ?? '')).join(' ');
        const foundClass = extractClassFromText(rowJoined);
        if (foundClass) {
          detectedClass = foundClass;
        }
      }

      for (let c = 0; c < row.length; c++) {
        const cellRaw = String(row[c] || '').trim();
        const cell = cellRaw.toLocaleLowerCase('tr-TR');

        if (!detectedClass) {
          const singleCellClass = extractClassFromText(cellRaw);
          if (singleCellClass) {
            detectedClass = singleCellClass;
          }
        }
        if (
          cell === 'öğrenci no' ||
          cell === 'öğrenci no.' ||
          cell === 'okul no' ||
          cell === 'okul no.' ||
          cell === 'ogr no' ||
          cell === 'öğr no' ||
          cell === 'no' ||
          cell === 'no.'
        ) {
          colNo = c;
        } else if (cell === 'adı' || cell === 'ad' || cell === 'öğrenci adı') {
          colAd = c;
        } else if (cell === 'soyadı' || cell === 'soyad' || cell === 'öğrenci soyadı') {
          colSoyad = c;
        } else if (
          cell === 'adı soyadı' ||
          cell === 'ad soyad' ||
          cell === 'adı ve soyadı' ||
          cell === 'öğrenci adı soyadı'
        ) {
          colFullName = c;
        } else if (cell === 'cinsiyeti' || cell === 'cinsiyet') {
          colCinsiyet = c;
        } else if (cell === 's.no' || cell === 'sno' || cell === 'sıra no') {
          colSNo = c;
        }
      }

      // Check if we found the minimum required columns (student number + name)
      if (colNo !== -1 && (colFullName !== -1 || (colAd !== -1 && colSoyad !== -1))) {
        headerRowIdx = r;
        break;
      }
    }

    if (headerRowIdx === -1) {
      return {
        success: false,
        error:
          'e-Okul Excel başlıkları tespit edilemedi. Dosyada "Öğrenci No", "Adı" ve "Soyadı" sütunlarının bulunduğundan emin olun.',
        students: [],
        totalDetected: 0,
        girlsCount: 0,
        boysCount: 0
      };
    }

    const students: ParsedEOkulStudent[] = [];
    const seenNumbers = new Set<string>();
    let girlsCount = 0;
    let boysCount = 0;

    for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
      const row = rawRows[r];
      if (!row || row.length === 0) continue;

      // Filter out footer rows (e.g. "Kız Öğrenci Sayısı :", "Erkek Öğrenci Sayısı :", "Toplam Öğrenci Sayısı :")
      const rowText = row
        .map((c) => String(c ?? ''))
        .join(' ')
        .toLocaleLowerCase('tr-TR');

      if (
        rowText.includes('öğrenci sayısı') ||
        rowText.includes('toplam öğrenci') ||
        rowText.includes('sayfa :') ||
        rowText.includes('sayfa:')
      ) {
        continue;
      }

      const rawNo = row[colNo];
      if (rawNo === undefined || rawNo === null || String(rawNo).trim() === '') continue;

      const studentNumber = String(rawNo).trim();
      // Skip if non-numeric header residue
      if (isNaN(Number(studentNumber)) && !/^[A-Za-z0-9-]+$/.test(studentNumber)) continue;
      if (['s.no', 'no', 'sıra', 'toplam'].includes(studentNumber.toLocaleLowerCase('tr-TR'))) continue;

      let rawFirstName = '';
      let rawLastName = '';

      if (colFullName !== -1) {
        const full = String(row[colFullName] || '').trim();
        const parts = full.split(/\s+/);
        rawLastName = parts.length > 1 ? parts.pop() || '' : '';
        rawFirstName = parts.join(' ');
      } else {
        rawFirstName = String(row[colAd] || '').trim();
        rawLastName = String(row[colSoyad] || '').trim();
      }

      if (!rawFirstName && !rawLastName) continue;

      const cleanFirstName = toTurkishTitleCase(rawFirstName);
      const cleanLastName = toTurkishTitleCase(rawLastName);
      const fullName = cleanLastName ? `${cleanFirstName} ${cleanLastName}` : cleanFirstName;

      let gender: string | undefined = undefined;
      if (colCinsiyet !== -1 && row[colCinsiyet]) {
        const rawGender = String(row[colCinsiyet]).trim().toLocaleLowerCase('tr-TR');
        if (rawGender.startsWith('k')) {
          gender = 'Kız';
          girlsCount++;
        } else if (rawGender.startsWith('e')) {
          gender = 'Erkek';
          boysCount++;
        } else {
          gender = String(row[colCinsiyet]).trim();
        }
      }

      // Avoid duplicate numbers in same file
      if (seenNumbers.has(studentNumber)) continue;
      seenNumbers.add(studentNumber);

      const sNoVal = colSNo !== -1 && row[colSNo] ? Number(row[colSNo]) : students.length + 1;

      students.push({
        studentNumber,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        fullName,
        gender,
        sNo: isNaN(sNoVal) ? students.length + 1 : sNoVal
      });
    }

    if (students.length === 0) {
      return {
        success: false,
        error: 'Excel dosyasında geçerli öğrenci kaydı bulunamadı.',
        students: [],
        totalDetected: 0,
        girlsCount: 0,
        boysCount: 0
      };
    }

    return {
      success: true,
      students,
      totalDetected: students.length,
      girlsCount,
      boysCount,
      sheetName: firstSheetName,
      detectedClass
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Excel dosyası okunurken hata oluştu: ${err?.message || 'Bilinmeyen hata'}`,
      students: [],
      totalDetected: 0,
      girlsCount: 0,
      boysCount: 0
    };
  }
}
