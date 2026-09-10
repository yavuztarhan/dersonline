/**
 * Türkçe Küfür, Hakaret ve Uygunsuz İçerik Filtreleme Motoru
 * Maarif Akademi İletişim Güvenlik Modülü
 */

// Temel uygunsuz tam kelimeler (yalnızca bağımsız kelime olarak eşleşir)
const FORBIDDEN_EXACT_WORDS = new Set([
  'kufur',
  'aptal',
  'salak',
  'gerizekali',
  'mal',
  'ahmak',
  'dangalak',
  'serefsiz',
  'haysiyetsiz',
  'terbiyesiz',
  'pislik',
  'lan',
  'lanet',
  'ulan',
  'okuz',
  'esek',
  'kopek',
  'it',
  'moron',
  'defol',
  'zikkim',
  'zavalli',
  'sahtekar',
  'dolandirici',
  'hirsiz',
  'orospu',
  'pic',
  'sik',
  'siktir',
  'amk',
  'aq',
  'oc',
  'sg',
  'yavsak',
  'got',
  'ibne',
  'pust',
  'kahpe',
  'pezevenk',
  'anani',
  'bacini',
  'avradini',
  'sikerim',
  'sikeyim',
  'gavat',
  'dalyarak',
  'amcik',
  'yarrak',
  'tasak'
]);

// Açıkça küfür olan ve ek alsa bile yasaklanması gereken kökler (en az 4 harfli belirgin küfürler)
const FORBIDDEN_ROOT_PATTERNS = [
  'orospu',
  'siktir',
  'pezevenk',
  'yavsak',
  'dalyarak',
  'amcik',
  'yarrak',
  'tasak',
  'sikerim',
  'sikeyim',
  'gerizekali',
  'haysiyetsiz'
];

/**
 * Metni harf benzerlikleri ve boşluk hilelerine karşı normalize eder.
 */
function normalizeText(input: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/@/g, 'a')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface ContentSafetyResult {
  isClean: boolean;
  censoredText: string;
  detectedWords: string[];
  warningMessage?: string;
}

/**
 * Mesaj içeriğini güvenlik ve ahlaki kurallara göre denetler.
 * Yanıt, eğitim, alan, vakit gibi eğitim kelimelerinin yanlışlıkla engellenmesini önler.
 */
export function checkContentSafety(text: string): ContentSafetyResult {
  if (!text || typeof text !== 'string') {
    return { isClean: true, censoredText: '', detectedWords: [] };
  }

  const normalized = normalizeText(text);
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const detectedWords: string[] = [];
  let censored = text;

  // 1. Bağımsız kelime kontrolü (Word-token matching)
  for (const token of tokens) {
    if (FORBIDDEN_EXACT_WORDS.has(token)) {
      if (!detectedWords.includes(token)) {
        detectedWords.push(token);
      }
      const tokenRegex = new RegExp(`\\b${token}\\b`, 'gi');
      censored = censored.replace(tokenRegex, '***');
    }
  }

  // 2. Belirgin ağır küfür kökleri kontrolü (yalnızca güvenli kökler)
  for (const root of FORBIDDEN_ROOT_PATTERNS) {
    if (normalized.includes(root)) {
      if (!detectedWords.includes(root)) {
        detectedWords.push(root);
      }
      const rootRegex = new RegExp(root, 'gi');
      censored = censored.replace(rootRegex, '***');
    }
  }

  const isClean = detectedWords.length === 0;

  return {
    isClean,
    censoredText: censored,
    detectedWords,
    warningMessage: !isClean
      ? 'Mesajınız uygunsuz ifadeler içerdiği için iletilemez. Lütfen nezaket kurallarına uygun bir dil kullanınız.'
      : undefined
  };
}
