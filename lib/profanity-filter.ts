/**
 * Türkçe Küfür, Hakaret ve Uygunsuz İçerik Filtreleme Motoru
 * Maarif Akademi İletişim Güvenlik Modülü
 */

// Temel uygunsuz kök ve kelime listesi
const FORBIDDEN_WORDS_LIST: string[] = [
  'küfür',
  'aptal',
  'salak',
  'gerizekalı',
  'mal',
  'ahmak',
  'dangalak',
  'şerefsiz',
  'haysiyetsiz',
  'terbiyesiz',
  'pislik',
  'lan',
  'lanet',
  'ulan',
  'öküz',
  'eşek',
  'köpek',
  'it',
  'moron',
  'ahmak',
  'defol',
  'zıkkım',
  'zavallı',
  'sahtekar',
  'dolandırıcı',
  'hırsız',
  'orospu',
  'piç',
  'sik',
  'siktir',
  'amk',
  'aq',
  'oç',
  'sg',
  'yavşak',
  'göt',
  'ibne',
  'puşt',
  'kahpe',
  'pezevenk',
  'ananı',
  'bacını',
  'avradını',
  'sikerim',
  'sikeyim',
  'gavat',
  'dalyarak',
  'amcık',
  'yarrak',
  'taşak',
  'meme',
  'pezevenk'
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
 */
export function checkContentSafety(text: string): ContentSafetyResult {
  if (!text || typeof text !== 'string') {
    return { isClean: true, censoredText: '', detectedWords: [] };
  }

  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/);
  const detectedWords: string[] = [];
  let censored = text;

  // 1. Kelime bazlı tam eşleşme ve içerik taraması
  for (const forbidden of FORBIDDEN_WORDS_LIST) {
    const forbiddenNorm = normalizeText(forbidden);
    if (!forbiddenNorm) continue;

    // Kelime içinde veya tam kelime olarak geçiyor mu
    const wordRegex = new RegExp(`\\b${forbiddenNorm}\\b`, 'i');
    const directRegex = new RegExp(forbiddenNorm, 'i');

    if (wordRegex.test(normalized) || directRegex.test(normalized)) {
      if (!detectedWords.includes(forbidden)) {
        detectedWords.push(forbidden);
      }

      // Yıldızlama (Censorship)
      const censorRegex = new RegExp(forbidden, 'gi');
      censored = censored.replace(censorRegex, '***');
    }
  }

  const isClean = detectedWords.length === 0;

  return {
    isClean,
    censoredText: censored,
    detectedWords,
    warningMessage: !isClean
      ? 'Mesajınız topluluk kurallarına aykırı veya uygunsuz ifadeler içerdiği için iletilemez. Lütfen nezaket kurallarına uygun bir dil kullanınız.'
      : undefined
  };
}
