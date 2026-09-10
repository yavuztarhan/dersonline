import { AssessmentQuestion } from '@/types';

// ============================================================================
// MATHEMATICAL HELPER FUNCTIONS
// ============================================================================

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function getDivisors(n: number): number[] {
  const divisors: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) divisors.push(i);
  }
  return divisors;
}

function getCommonDivisors(a: number, b: number): number[] {
  const divA = new Set(getDivisors(a));
  return getDivisors(b).filter((d) => divA.has(d));
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function getPrimeFactorsWithExponents(n: number): Record<number, number> {
  const counts: Record<number, number> = {};
  let d = 2;
  while (n > 1) {
    if (n % d === 0) {
      counts[d] = (counts[d] || 0) + 1;
      n = n / d;
    } else {
      d++;
    }
  }
  return counts;
}

function formatExponential(counts: Record<number, number>): string {
  return Object.entries(counts)
    .map(([base, exp]) => (exp === 1 ? `${base}` : `${base}^${exp}`))
    .join(' · ');
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom<T>(items: T[], exclude?: T): T {
  const filtered = exclude ? items.filter((it) => it !== exclude) : items;
  return filtered[Math.floor(Math.random() * filtered.length)] || items[0];
}

// ============================================================================
// DYNAMIC QUESTION VARIANT HANDLERS
// ============================================================================

export function generateQuestionVariant(q: AssessmentQuestion): AssessmentQuestion {
  const text = q.questionText.trim();

  // 1. Ortak Bölenler Sorusunu Değiştirme (Örn: 18 ve 24 sayılarının ORTAK BÖLENLERİ...)
  if (/ORTAK\s+BÖLENLERİ/i.test(text)) {
    const pairs: Array<[number, number]> = [
      [12, 16],
      [12, 18],
      [16, 24],
      [18, 24],
      [20, 30],
      [24, 32],
      [20, 28],
      [30, 45],
      [36, 48],
      [15, 25],
      [18, 27],
      [24, 36],
      [16, 20],
      [24, 40]
    ];

    const [a, b] = pickRandom(pairs);
    const common = getCommonDivisors(a, b);
    const correctStr = common.join(', ');

    // Generate plausible distractors
    const d1 = [...common.filter((x) => x !== 2), common[common.length - 1] + 2].join(', ');
    const d2 = [1, ...common.slice(1, -1), common[common.length - 1] * 2].slice(0, common.length).join(', ');
    const d3 = common.slice(1).join(', ');

    const rawOptions = [correctStr, d1, d2, d3];
    const uniqueOptions = Array.from(new Set(rawOptions));
    while (uniqueOptions.length < 4) {
      uniqueOptions.push(`1, 2, ${uniqueOptions.length + 2}`);
    }

    const shuffled = shuffle(uniqueOptions);
    const correctIndex = shuffled.indexOf(correctStr);

    return {
      ...q,
      questionText: `${a} ve ${b} sayılarının ORTAK BÖLENLERİ aşağıdakilerden hangisidir?`,
      options: shuffled,
      correctOptionIndex: correctIndex,
      explanation: `${a}'nın bölenleri: ${getDivisors(a).join(', ')}. ${b}'nin bölenleri: ${getDivisors(b).join(', ')}. Her ikisini de kalansız bölen ortak sayılar: ${correctStr}'dir.`
    };
  }

  // 2. Ortak Katlar Sorusunu Değiştirme (Örn: 6 ve 8 sayılarının 50'den küçük ORTAK KATLARI...)
  if (/ORTAK\s+KATLARI/i.test(text)) {
    const candidates: Array<[number, number, number]> = [
      [4, 6, 40],
      [6, 8, 50],
      [6, 9, 60],
      [8, 12, 60],
      [4, 10, 50],
      [5, 6, 70],
      [8, 10, 70],
      [6, 10, 60],
      [9, 12, 80]
    ];

    const [a, b, limit] = pickRandom(candidates);
    const step = lcm(a, b);
    const multiples: number[] = [];
    for (let m = step; m < limit; m += step) {
      multiples.push(m);
    }
    const correctStr = multiples.join(' ve ');

    const d1 = [step / 2, step].filter((x) => Number.isInteger(x)).join(' ve ') || `${step}`;
    const d2 = [step, step + a].join(' ve ');
    const d3 = [step * 2, step * 3].join(' ve ');

    const rawOptions = Array.from(new Set([correctStr, d1, d2, d3]));
    while (rawOptions.length < 4) {
      rawOptions.push(`${step + rawOptions.length * 10} ve ${step * 2}`);
    }

    const shuffled = shuffle(rawOptions);
    const correctIndex = shuffled.indexOf(correctStr);

    return {
      ...q,
      questionText: `${a} ve ${b} sayılarının ${limit}'den küçük ORTAK KATLARI hangileridir?`,
      options: shuffled,
      correctOptionIndex: correctIndex,
      explanation: `${a} ve ${b}'nin en küçük ortak katı EKOK(${a}, ${b}) = ${step}'dir. ${limit}'den küçük ortak katlar: ${correctStr}'dir.`
    };
  }

  // 3. Aralarında Asallık (Örn: Aşağıdaki sayı çiftlerinden hangisi ARALARINDA ASALDIR?)
  if (/ARALARINDA\s+ASAL/i.test(text)) {
    const coprimePairs: Array<[number, number]> = [
      [8, 15],
      [9, 16],
      [14, 25],
      [15, 28],
      [21, 22],
      [10, 21],
      [12, 35],
      [9, 20],
      [16, 27],
      [25, 36]
    ];

    const nonCoprimePairs: Array<[number, number]> = [
      [6, 9],
      [12, 18],
      [14, 21],
      [15, 20],
      [18, 24],
      [20, 25],
      [21, 28],
      [16, 24],
      [24, 30],
      [27, 36]
    ];

    const correctPair = pickRandom(coprimePairs);
    const distractors = shuffle(nonCoprimePairs).slice(0, 3);

    const correctStr = `${correctPair[0]} ve ${correctPair[1]}`;
    const rawOptions = [
      correctStr,
      `${distractors[0][0]} ve ${distractors[0][1]}`,
      `${distractors[1][0]} ve ${distractors[1][1]}`,
      `${distractors[2][0]} ve ${distractors[2][1]}`
    ];

    const shuffled = shuffle(rawOptions);
    const correctIndex = shuffled.indexOf(correctStr);

    return {
      ...q,
      questionText: `Aşağıdaki sayı çiftlerinden hangisi ARALARINDA ASALDIR?`,
      options: shuffled,
      correctOptionIndex: correctIndex,
      explanation: `${correctPair[0]} ve ${correctPair[1]} sayılarının 1'den başka hiçbir ortak pozitif tam sayı böleni olmadığı için aralarında asaldır. Diğer seçeneklerdeki çiftlerin 1'den büyük ortak bölenleri vardır.`
    };
  }

  // 4. EBOB Torba Paylaştırma Problemi (Örn: 30 kg nohut ve 45 kg mercimek... Bir torba kaç kg OLA-MAZ?)
  if (/torbalara\s+doldurulacaktır.*OLA-MAZ/i.test(text) || (/nohut/i.test(text) && /mercimek/i.test(text))) {
    const items: Array<[number, number]> = [
      [24, 36],
      [30, 45],
      [36, 48],
      [40, 60],
      [28, 42],
      [32, 48]
    ];

    const [a, b] = pickRandom(items);
    const common = getCommonDivisors(a, b);

    // Pick 3 valid common divisors
    const validSizes = shuffle(common).slice(0, 3).sort((x, y) => x - y);
    // Pick 1 invalid size
    const invalidSizes = [7, 8, 9, 10, 11, 14, 16, 18, 20].filter((s) => a % s !== 0 || b % s !== 0);
    const invalidSize = pickRandom(invalidSizes);

    const correctStr = `${invalidSize} kg`;
    const rawOptions = [...validSizes.map((v) => `${v} kg`), correctStr];
    const shuffled = shuffle(rawOptions);
    const correctIndex = shuffled.indexOf(correctStr);

    return {
      ...q,
      questionText: `${a} kg nohut ve ${b} kg mercimek birbirine karıştırılmadan ve hiç artmayacak şekilde eşit büyüklükte torbalara doldurulacaktır. Bir torba kaç kg OLA-MAZ?`,
      options: shuffled,
      correctOptionIndex: correctIndex,
      explanation: `Torba ağırlığı ${a} ve ${b}'nin ortak böleni olmalıdır. Ortak bölenler: ${common.join(', ')} kg'dır. ${invalidSize} kg her iki sayıyı kalansız bölmediği için torba ${invalidSize} kg olamaz.`
    };
  }

  // 5. EKOK Nöbet Problemi (Örn: İki doktordan biri ... günde bir, diğeri ... günde bir...)
  if (/nöbet/i.test(text) || /otobüs.*sefer/i.test(text)) {
    const pairs: Array<[number, number]> = [
      [3, 4],
      [4, 6],
      [6, 8],
      [4, 5],
      [5, 6],
      [6, 9],
      [8, 12],
      [6, 10]
    ];

    const [a, b] = pickRandom(pairs);
    const ekokVal = lcm(a, b);
    const correctStr = `${ekokVal} gün sonra`;

    const d1 = `${a * b} gün sonra`;
    const d2 = `${ekokVal + a} gün sonra`;
    const d3 = `${ekokVal - a > 0 ? ekokVal - a : ekokVal * 2} gün sonra`;

    const rawOptions = Array.from(new Set([correctStr, d1, d2, d3]));
    while (rawOptions.length < 4) {
      rawOptions.push(`${ekokVal + rawOptions.length * 4} gün sonra`);
    }

    const shuffled = shuffle(rawOptions);
    const correctIndex = shuffled.indexOf(correctStr);

    return {
      ...q,
      questionText: `İki hemşireden biri ${a} günde bir, diğeri ${b} günde bir nöbet tutmaktadır. Birlikte nöbet tuttuktan sonra en erken kaç gün sonra tekrar birlikte nöbet tutarlar?`,
      options: shuffled,
      correctOptionIndex: correctIndex,
      explanation: `Birlikte tekrar nöbet tutacakları gün sayısı ${a} ve ${b}'nin en küçük ortak katı olmalıdır: EKOK(${a}, ${b}) = ${ekokVal} gün sonra.`
    };
  }

  // 6. Asal Çarpanlara Ayırma / Üslü Gösterim
  if (/asal\s+çarpan/i.test(text) && /üslü/i.test(text)) {
    const numbers = [36, 48, 60, 72, 84, 90, 108, 120, 144, 180];
    const n = pickRandom(numbers);
    const counts = getPrimeFactorsWithExponents(n);
    const correctStr = formatExponential(counts);

    // generate distractors
    const d1 = Object.entries(counts)
      .map(([base, exp]) => `${base}^${exp + 1}`)
      .join(' · ');
    const d2 = Object.entries(counts)
      .map(([base]) => `${base}`)
      .join(' · ');
    const d3 = Object.entries(counts)
      .map(([base, exp], i) => (i === 0 ? `${base}^${Math.max(1, exp - 1)}` : `${base}^${exp + 1}`))
      .join(' · ');

    const rawOptions = Array.from(new Set([correctStr, d1, d2, d3]));
    while (rawOptions.length < 4) {
      rawOptions.push(`2^${rawOptions.length} · 3^2`);
    }

    const shuffled = shuffle(rawOptions);
    const correctIndex = shuffled.indexOf(correctStr);

    return {
      ...q,
      questionText: `${n} sayısının asal çarpanlarına ayrılmış biçimi (üslü gösterimi) aşağıdakilerden hangisidir?`,
      options: shuffled,
      correctOptionIndex: correctIndex,
      explanation: `${n} sayısını asal çarpan algoritması ile böldüğümüzde: ${n} = ${correctStr} olarak bulunur.`
    };
  }

  // 7. Çember Çevresi (Örn: Yarıçapı ... cm olan çemberin çevresi)
  if (/çember.*çevresi/i.test(text) || (/yarıçapı/i.test(text) && /çevre/i.test(text))) {
    const radii = [4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 20];
    const r = pickRandom(radii);
    const pi = 3;
    const circ = 2 * pi * r;
    const correctStr = `${circ} cm`;

    const d1 = `${pi * r} cm`;
    const d2 = `${circ + 6} cm`;
    const d3 = `${circ - 6} cm`;

    const rawOptions = Array.from(new Set([correctStr, d1, d2, d3]));
    while (rawOptions.length < 4) {
      rawOptions.push(`${circ + rawOptions.length * 8} cm`);
    }

    const shuffled = shuffle(rawOptions);
    const correctIndex = shuffled.indexOf(correctStr);

    return {
      ...q,
      questionText: `Yarıçapı r = ${r} cm olan bir çemberin çevre uzunluğu kaç cm'dir? (π = 3 alınız)`,
      options: shuffled,
      correctOptionIndex: correctIndex,
      explanation: `Çemberin çevre formülü Ç = 2 · π · r'dir. Ç = 2 · 3 · ${r} = ${circ} cm bulunur.`
    };
  }

  // 8. Tümler / Bütünler Açı
  if (/tümler/i.test(text) || /bütünler/i.test(text)) {
    const isTumler = /tümler/i.test(text);
    const targetSum = isTumler ? 90 : 180;
    const angles = isTumler ? [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70] : [40, 50, 60, 70, 80, 100, 110, 120, 130, 140, 150];
    const given = pickRandom(angles);
    const other = targetSum - given;

    const correctStr = `${other}°`;
    const d1 = `${other + 10}°`;
    const d2 = `${other - 10}°`;
    const d3 = `${targetSum === 90 ? 180 - given : 90 - (given % 90)}°`;

    const rawOptions = Array.from(new Set([correctStr, d1, d2, d3]));
    while (rawOptions.length < 4) {
      rawOptions.push(`${other + rawOptions.length * 5}°`);
    }

    const shuffled = shuffle(rawOptions);
    const correctIndex = shuffled.indexOf(correctStr);

    return {
      ...q,
      questionText: `${isTumler ? 'Tümler' : 'Bütünler'} iki açıdan birinin ölçüsü ${given}° olduğuna göre, diğer açının ölçüsü kaç derecedir?`,
      options: shuffled,
      correctOptionIndex: correctIndex,
      explanation: `${isTumler ? 'Tümler açıların toplamı 90°' : 'Bütünler açıların toplamı 180°'}'dir. ${targetSum}° - ${given}° = ${other}° olarak hesaplanır.`
    };
  }

  // 9. Genel Sayısal Değiştirici (General Numeric Shift Fallback)
  const numbersInText = text.match(/\b\d+\b/g);
  if (numbersInText && numbersInText.length >= 1) {
    const delta = pickRandom([2, 3, 4, 5, -2, -3]);
    let newText = text;
    numbersInText.forEach((numStr) => {
      const val = parseInt(numStr);
      if (val > 3 && val < 500) {
        newText = newText.replace(new RegExp(`\\b${val}\\b`), `${val + delta}`);
      }
    });

    // Shift numeric options consistently
    const newOptions = q.options.map((opt) => {
      return opt.replace(/\b\d+\b/g, (match) => {
        const num = parseInt(match);
        return `${Math.max(1, num + delta)}`;
      });
    });

    return {
      ...q,
      id: `${q.id}-var-${Math.floor(Math.random() * 1000)}`,
      questionText: newText,
      options: newOptions,
      explanation: q.explanation.replace(/\b\d+\b/g, (match) => {
        const num = parseInt(match);
        return `${Math.max(1, num + delta)}`;
      })
    };
  }

  // If no mutation rule matched, return question as is
  return q;
}

export function generateTestVariant(questions: AssessmentQuestion[]): AssessmentQuestion[] {
  return questions.map((q) => generateQuestionVariant(q));
}
