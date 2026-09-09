'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Brain,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Timer,
  Trophy,
  Award,
  Zap,
  HelpCircle,
  Layers,
  ArrowRight,
  Eye,
  Shuffle,
  Star,
  BookOpen
} from 'lucide-react';

export interface MemoryPair {
  id: string;
  concept: string;
  symbol: string;
  badge: string;
  definition: string;
  example: string;
  color: string;
}

// ---------------------------------------------------------------------------
// 1. MAT.5.3.1: Temel Geometrik Kavramlar ve Çizimler
// ---------------------------------------------------------------------------
const MAT_5_3_1_PAIRS: MemoryPair[] = [
  {
    id: 'mat1-p1',
    concept: 'NOKTA',
    symbol: '• A',
    badge: '📍 Nokta',
    definition: 'Kalemin ucunun kâğıtta bıraktığı ölçüsüz izdir. Boyutu (eni, boyu, yüksekliği) yoktur; büyük harfle adlandırılır.',
    example: 'Haritadaki şehir konumları, cümlenin sonundaki nokta.',
    color: '#10b981' // Emerald
  },
  {
    id: 'mat1-p2',
    concept: 'DOĞRU',
    symbol: '↔ AB veya d',
    badge: '↔ Doğru',
    definition: 'Her iki yönden de sınırsızca sonsuza uzayan, başlangıcı ve bitişi olmayan dümdüz çizgi modelidir.',
    example: 'İki yöne sonsuz uzayan tren rayları, ufuk çizgisi.',
    color: '#0284c7' // Sky Blue
  },
  {
    id: 'mat1-p3',
    concept: 'DOĞRU PARÇASI',
    symbol: '[AB]',
    badge: '📏 Doğru Parçası',
    definition: 'Bir doğrunun iki noktası arasında kalan sınırlı parçasıdır. İki ucu da kapalıdır ve uzunluğu cetvelle ölçülebilir.',
    example: 'Kurşun kalem, cetvelin kenarı, masa çıtası.',
    color: '#f59e0b' // Amber
  },
  {
    id: 'mat1-p4',
    concept: 'IŞIN',
    symbol: '[AB>',
    badge: '🔦 Işın',
    definition: 'Başlangıç noktası sabit olup diğer ucu bir yönde sonsuza kadar uzayan çizgi modelidir.',
    example: 'El fenerinden çıkan ışık huzmesi, çivi, güneş ışını.',
    color: '#8b5cf6' // Purple
  },
  {
    id: 'mat1-p5',
    concept: 'AÇI',
    symbol: 'm(AOB) veya B̂',
    badge: '📐 Açı',
    definition: 'Başlangıç noktaları aynı olan iki ışının birleşmesiyle oluşan açıklıktır.',
    example: 'Açılan makas kolları, saatteki akrep ile yelkovan arası.',
    color: '#ec4899' // Pink
  },
  {
    id: 'mat1-p6',
    concept: 'PARALEL DOĞRULAR',
    symbol: 'd₁ // d₂',
    badge: '🛤️ Paralel',
    definition: 'Aynı düzlemde bulunan, hiçbir zaman kesişmeyen ve aralarındaki mesafe hep eşit kalan doğrulardır.',
    example: 'Karşılıklı tren rayları, defter çizgileri.',
    color: '#6366f1' // Indigo
  },
  {
    id: 'mat1-p7',
    concept: 'DİK DOĞRULAR',
    symbol: 'd₁ ⊥ d₂',
    badge: '➕ Dik Doğrular',
    definition: 'Birbirini tam 90 derecelik dik açıyla kesen iki doğru modelidir.',
    example: 'Artı (+) işareti, duvar ile tabanın birleştiği köşe.',
    color: '#14b8a6' // Teal
  },
  {
    id: 'mat1-p8',
    concept: 'KESİŞEN DOĞRULAR',
    symbol: 'd₁ ∩ d₂ = {K}',
    badge: '✖️ Kesişen Doğrular',
    definition: 'Aynı düzlemde yalnız ve yalnız bir tek ortak noktada birbirini kesen doğrulardır.',
    example: 'Çarpı (X) işareti, kavşakta kesişen iki cadde.',
    color: '#ef4444' // Rose
  }
];

// ---------------------------------------------------------------------------
// 2. MAT.5.3.2: Geometrik İnşa ve Çıkarım (Cetvel, Pergel, Gönye)
// ---------------------------------------------------------------------------
const MAT_5_3_2_PAIRS: MemoryPair[] = [
  {
    id: 'mat2-p1',
    concept: 'ÖLÇEKSİZ CETVEL',
    symbol: 'AB Doğrusu',
    badge: '📏 Düz Cetvel',
    definition: 'İki noktayı birleştirerek üzerinden düz bir doğru geçirmek için kullanılan ölçüsüz düz çizim aracıdır.',
    example: 'İki nokta arasını birleştirerek tek doğru çizme.',
    color: '#f59e0b'
  },
  {
    id: 'mat2-p2',
    concept: 'PERGEL',
    symbol: '○ Sabit Açıklık',
    badge: '🧭 Pergel',
    definition: 'Çember çizmek ve belirli bir uzunluğu kâğıt üzerinde birebir kopyalayıp aktarmak için kullanılan iki kollu araçtır.',
    example: 'Eşit uzunlukta doğru parçaları oluşturma, çember inşası.',
    color: '#0284c7'
  },
  {
    id: 'mat2-p3',
    concept: 'GÖNYE',
    symbol: '90° Diklik',
    badge: '📐 Gönye',
    definition: 'Bir doğruya dışındaki bir noktadan dikme indirmek ve 90 derecelik dik açıları oluşturmak için kullanılan üçgen araçtır.',
    example: 'Kavşak ve bina köşelerinin dikliğini kontrol etme.',
    color: '#10b981'
  },
  {
    id: 'mat2-p4',
    concept: 'ÇEMBER YARIÇAPI',
    symbol: '|OA| = r',
    badge: '🔵 Yarıçap (r)',
    definition: 'Çemberin merkezinden üzerindeki tüm noktalara çizilen ve uzunlukları birbirine eşit olan doğru parçalarıdır.',
    example: 'Pergel ayaklarının açıklığı kadar olan sabit mesafe.',
    color: '#8b5cf6'
  },
  {
    id: 'mat2-p5',
    concept: 'DIŞ NOKTADAN DİKME',
    symbol: '[PH] ⊥ d',
    badge: '⬇️ Tek Dikme',
    definition: 'Bir doğruya dışındaki sabit tek bir noktadan indirilebilen ve 90° dik açı oluşturan yalnız tek bir dikme çizilebilir.',
    example: 'Tavandan sarkan çekül ipi, dik duran direk.',
    color: '#ec4899'
  },
  {
    id: 'mat2-p6',
    concept: 'IŞINDAN EŞİT PARÇA KESME',
    symbol: '|AB| = |BC|',
    badge: '✂️ Eşit Parça',
    definition: 'Pergel açıklığını hiç bozmadan ışının başlangıç noktasından itibaren art arda eşit mesafeler kopyalama işlemidir.',
    example: 'Işın üzerinde pergel adımlarıyla eşit bölmeler işaretleme.',
    color: '#6366f1'
  },
  {
    id: 'mat2-p7',
    concept: 'PARALEL DOĞRU İNŞASI',
    symbol: 'd₁ // d₂',
    badge: '🛤️ Paralel İnşa',
    definition: 'Gönye yardımıyla bir doğruya eşit uzaklıktaki dik noktaları belirleyip birleştirerek elde edilen doğru modelidir.',
    example: 'Tren raylarının iki demirinin eşit aralıklarla döşenmesi.',
    color: '#14b8a6'
  },
  {
    id: 'mat2-p8',
    concept: 'İKİ NOKTADAN TEK DOĞRU',
    symbol: 'A • —— • B',
    badge: '🎯 Tek Doğru',
    definition: 'Düzlemde verilen farklı iki noktadan yalnız ve yalnız tek bir düz doğru çizilebilir temel aksiyomudur.',
    example: 'İki kazık arasına gerilen tek düz ip.',
    color: '#ef4444'
  }
];

// ---------------------------------------------------------------------------
// 3. MAT.5.3.3: Açı Ölçme ve İletki (Açıölçer) Kullanımı
// ---------------------------------------------------------------------------
const MAT_5_3_3_PAIRS: MemoryPair[] = [
  {
    id: 'mat3-p1',
    concept: 'DAR AÇI',
    symbol: '0° < s(Â) < 90°',
    badge: '📐 Dar Açı',
    definition: 'Ölçüsü 0 derece ile 90 derece arasında olan, dik açıdan daha küçük açıklığa sahip açıdır.',
    example: 'Hafif aralanmış makas ağzı, çatı tepe açısı.',
    color: '#0284c7'
  },
  {
    id: 'mat3-p2',
    concept: 'DİK AÇI',
    symbol: 's(Â) = 90°',
    badge: '➕ Dik Açı (90°)',
    definition: 'Ölçüsü tam olarak 90 derece olan ve köşesinde kare-nokta simgesiyle gösterilen dik açıklıktır.',
    example: 'Oda duvarının tabanla yaptığı açı, kitabın köşesi.',
    color: '#10b981'
  },
  {
    id: 'mat3-p3',
    concept: 'GENİŞ AÇI',
    symbol: '90° < s(Â) < 180°',
    badge: '🪭 Geniş Açı',
    definition: 'Ölçüsü 90 derece ile 180 derece arasında olan, dik açıdan daha büyük geometrik açıklıktır.',
    example: 'Genişçe açılmış yelpaze, saat 16.00’da akrep-yelkovan arası.',
    color: '#f59e0b'
  },
  {
    id: 'mat3-p4',
    concept: 'DOĞRU AÇI',
    symbol: 's(Â) = 180°',
    badge: '➖ Doğru Açı (180°)',
    definition: 'Ölçüsü tam olarak 180 derece olan ve kolları zıt yönde dümdüz bir çizgi oluşturan açıdır.',
    example: 'Saat 18.00’de akrep ile yelkovanın duruşu, ufuk düzlüğü.',
    color: '#8b5cf6'
  },
  {
    id: 'mat3-p5',
    concept: 'TAM AÇI',
    symbol: 's(Â) = 360°',
    badge: '🔄 Tam Açı (360°)',
    definition: 'Ölçüsü tam olarak 360 derece olan ve tam bir dairesel turu tamamlayan dönme açısıdır.',
    example: 'Yelkovanın 1 tam saatte yaptığı 360 derecelik tam tur.',
    color: '#ec4899'
  },
  {
    id: 'mat3-p6',
    concept: 'İLETKİ / AÇIÖLÇER',
    symbol: '0° - 180° Skalası',
    badge: '🧭 İletki',
    definition: 'Açıların ölçüsünü derece (°) cinsinden hassas ölçmeye ve açı çizmeye yarayan yarım daire araçtır.',
    example: 'Açıların derecesini belirleme ve mimari çizimler yapma.',
    color: '#6366f1'
  },
  {
    id: 'mat3-p7',
    concept: 'DERECE',
    symbol: '° Sembolü',
    badge: '🏷️ Derece (°)',
    definition: 'Açı ölçüsünün temel standart birimidir; bir tam çemberin 360’ta birine karşılık gelen açıklıktır.',
    example: '30°, 45°, 90°, 180° açı ölçüleri.',
    color: '#14b8a6'
  },
  {
    id: 'mat3-p8',
    concept: 'AÇININ KÖŞESİ & KOLLARI',
    symbol: 'O Köşesi, [OA, [OB',
    badge: '📍 Köşe ve Kollar',
    definition: 'Açıyı oluşturan iki ışının ortak başlangıç noktasına köşe, bu ışınlara ise açının kolları denir.',
    example: 'Makasın vidası köşe, kesen demirleri ise kollardır.',
    color: '#ef4444'
  }
];

// ---------------------------------------------------------------------------
// 4. MAT.5.3.4: Doğruların Durumları ve Açı Çıkarımları
// ---------------------------------------------------------------------------
const MAT_5_3_4_PAIRS: MemoryPair[] = [
  {
    id: 'mat4-p1',
    concept: 'TERS AÇILAR',
    symbol: 'a = c, b = d',
    badge: '✖️ Ters Açılar',
    definition: 'İki doğrunun kesişmesiyle oluşan, zıt yönlere bakan ve ölçüleri daima birbirine eşit olan açılardır.',
    example: 'Kesişen iki caddede karşılıklı duran açılar.',
    color: '#0284c7'
  },
  {
    id: 'mat4-p2',
    concept: 'KOMŞU AÇILAR',
    symbol: 'Ortak Kol [OB',
    badge: '👥 Komşu Açılar',
    definition: 'Ortak bir köşesi ve ortak bir kolu bulunan, ancak iç bölgeleri kesişmeyen yan yana açılardır.',
    example: 'Açık kitabın sol ve sağ sayfalarının oluşturduğu açılar.',
    color: '#10b981'
  },
  {
    id: 'mat4-p3',
    concept: 'TÜMLER AÇILAR',
    symbol: 'a + b = 90°',
    badge: '➕ Tümler (90°)',
    definition: 'Ölçüleri toplamı 90 derece eden iki açıdır; birbirini tam bir dik açıya tamamlarlar.',
    example: '30° ile 60° açılarının toplamının 90° etmesi.',
    color: '#f59e0b'
  },
  {
    id: 'mat4-p4',
    concept: 'BÜTÜNLER AÇILAR',
    symbol: 'x + y = 180°',
    badge: '➖ Bütünler (180°)',
    definition: 'Ölçüleri toplamı 180 derece eden iki açıdır; birbirini tam bir doğru açıya tamamlarlar.',
    example: '70° ile 110° açılarının toplamının 180° etmesi.',
    color: '#8b5cf6'
  },
  {
    id: 'mat4-p5',
    concept: 'KOMŞU BÜTÜNLER AÇILAR',
    symbol: 'Doğru Üzerinde 180°',
    badge: '📏 Komşu Bütünler',
    definition: 'Bir doğru üzerinde yan yana duran, ortak kolu olan ve toplamları daima 180° eden açılardır.',
    example: 'Düz bir cetvelin üzerine konan eğik kalemin ayırdığı iki açı.',
    color: '#ec4899'
  },
  {
    id: 'mat4-p6',
    concept: 'KESEN DOĞRU (TRANSVERSAL)',
    symbol: 'd₃ Keseni',
    badge: '⚡ Kesen Doğru',
    definition: 'Düzlemdeki iki veya daha fazla doğruyu farklı noktalarda keserek geçen üçüncü doğrudur.',
    example: 'İki paralel tren rayını çapraz kesen bakım yolu.',
    color: '#6366f1'
  },
  {
    id: 'mat4-p7',
    concept: 'PARALEL DOĞRULARDA AÇISIZLIK',
    symbol: 'Kesişim = ∅',
    badge: '🛤️ Paralel Durum',
    definition: 'Aynı düzlemde hiçbir zaman kesişmeyen paralel doğrular arasında kesişim ve açı meydana gelmez.',
    example: 'Hiçbir noktası çakışmayan karşılıklı tren rayları.',
    color: '#14b8a6'
  },
  {
    id: 'mat4-p8',
    concept: 'ÇAKIŞIK DOĞRULAR',
    symbol: 'd₁ ≡ d₂',
    badge: '🔀 Çakışık',
    definition: 'Tüm noktaları ortak olan ve düzlemde tamamen üst üste gelen iki doğrunun oluşturduğu durumdur.',
    example: 'Üst üste konulmuş aynı uzunluktaki iki çıtanın doğruları.',
    color: '#ef4444'
  }
];

// ---------------------------------------------------------------------------
// 5. MAT.5.1.1: Doğal Sayılar ve Basamak Değeri
// ---------------------------------------------------------------------------
const MAT_5_1_1_PAIRS: MemoryPair[] = [
  {
    id: 'mat5-p1',
    concept: 'BÖLÜK',
    symbol: 'Üçerli Grup',
    badge: '📦 Bölük',
    definition: 'Büyük doğal sayıların kolay okunup yazılabilmesi için sağdan sola doğru üçerli gruplanan basamak takımıdır.',
    example: 'Birler bölüğü, binler bölüğü, milyonlar bölüğü.',
    color: '#0284c7'
  },
  {
    id: 'mat5-p2',
    concept: 'MİLYONLAR BÖLÜĞÜ',
    symbol: '7, 8 ve 9. Basamak',
    badge: '🌌 Milyonlar',
    definition: '9 basamaklı bir sayıda milyonlar, on milyonlar ve yüz milyonlar basamaklarının oluşturduğu en sol bölüktür.',
    example: '149.600.000 sayısındaki 149 sayısı milyonlar bölüğüdür.',
    color: '#10b981'
  },
  {
    id: 'mat5-p3',
    concept: 'BİNLER BÖLÜĞÜ',
    symbol: '4, 5 ve 6. Basamak',
    badge: '🔢 Binler Bölüğü',
    definition: 'Bir doğal sayıda binler, on binler ve yüz binler basamaklarının oluşturduğu orta bölüktür.',
    example: '708.045.002 sayısındaki 045 kısmı binler bölüğüdür.',
    color: '#f59e0b'
  },
  {
    id: 'mat5-p4',
    concept: 'BİRLER BÖLÜĞÜ',
    symbol: '1, 2 ve 3. Basamak',
    badge: '🎯 Birler Bölüğü',
    definition: 'Bir doğal sayının en sağındaki birler, onlar ve yüzler basamaklarından oluşan temel bölüğüdür.',
    example: '345.890.120 sayısındaki 120 kısmı birler bölüğüdür.',
    color: '#8b5cf6'
  },
  {
    id: 'mat5-p5',
    concept: 'BASAMAK DEĞERİ',
    symbol: 'Rakam × Basamak',
    badge: '💰 Basamak Değeri',
    definition: 'Bir rakamın sayıda bulunduğu haneye (birler, onlar, binler, milyonlar) göre kazandığı sayısal değerdir.',
    example: '520.000 sayısındaki 5 rakamının basamak değeri 500.000’dir.',
    color: '#ec4899'
  },
  {
    id: 'mat5-p6',
    concept: 'SAYI DEĞERİ',
    symbol: 'Rakamın Kendisi',
    badge: '🏷️ Sayı Değeri',
    definition: 'Bir rakamın bulunduğu basamağa bakılmaksızın tek başına ifade ettiği öz büyüklüğüdür.',
    example: '708.000 sayısındaki 7 rakamının sayı değeri yalnızca 7’dir.',
    color: '#6366f1'
  },
  {
    id: 'mat5-p7',
    concept: 'ÇÖZÜMLEME',
    symbol: 'Basamaklar Toplamı',
    badge: '🧩 Çözümleme',
    definition: 'Bir doğal sayının tüm basamak değerlerinin toplamı şeklinde açık ve ayrıntılı olarak yazılmasıdır.',
    example: '452 = (4×100) + (5×10) + (2×1) şeklinde yazılması.',
    color: '#14b8a6'
  },
  {
    id: 'mat5-p8',
    concept: 'DOKUZ BASAMAKLI SAYI',
    symbol: '999.999.999',
    badge: '🏆 9 Basamak',
    definition: 'Milyonlar, binler ve birler bölüklerinden oluşan, 100.000.000 ile 999.999.999 arasındaki büyük sayılardır.',
    example: 'Türkiye nüfusu veya uzay mesafelerinin yazımı.',
    color: '#ef4444'
  }
];

// Helper to resolve pairs and topic info
function resolveOutcomePairs(outcomeId?: string, outcomeCode?: string, outcomeTitle?: string): { code: string; title: string; pairs: MemoryPair[] } {
  const id = outcomeId || '';
  const code = outcomeCode || '';
  const title = (outcomeTitle || '').toLowerCase();

  if (id === 'MAT.5.3.2' || code.includes('5.3.2') || title.includes('inşa') || title.includes('çıkarım')) {
    return {
      code: 'MAT.5.3.2',
      title: 'Geometrik İnşa ve Çıkarım: Cetvel, Pergel, Gönye',
      pairs: MAT_5_3_2_PAIRS
    };
  }

  if (id === 'MAT.5.3.3' || code.includes('5.3.3') || title.includes('iletki') || (title.includes('açı') && !title.includes('doğru'))) {
    return {
      code: 'MAT.5.3.3',
      title: 'Açı Ölçme ve İletki (Açıölçer) Kullanımı',
      pairs: MAT_5_3_3_PAIRS
    };
  }

  if (id === 'MAT.5.3.4' || code.includes('5.3.4') || title.includes('ters') || title.includes('tümler') || title.includes('bütünler')) {
    return {
      code: 'MAT.5.3.4',
      title: 'Doğruların Durumları ve Açı Çıkarımları',
      pairs: MAT_5_3_4_PAIRS
    };
  }

  if (id === 'MAT.5.1.1' || code.includes('5.1.1') || title.includes('doğal sayı') || title.includes('basamak')) {
    return {
      code: 'MAT.5.1.1',
      title: 'Doğal Sayılar ve Basamak Değeri',
      pairs: MAT_5_1_1_PAIRS
    };
  }

  return {
    code: 'MAT.5.3.1',
    title: 'Temel Geometrik Kavramlar ve Çizimler',
    pairs: MAT_5_3_1_PAIRS
  };
}

export interface CardItem {
  cardId: string;
  pairId: string;
  type: 'concept' | 'definition';
  conceptTitle: string;
  symbol: string;
  badge: string;
  text: string;
  example?: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryCardsGame({ onBackToMenu }: { onBackToMenu?: () => void }) {
  const { playSound, addPoints, unlockBadge, selectedOutcome } = useApp();

  // Dynamic Outcome Resolution
  const activeTopic = resolveOutcomePairs(selectedOutcome?.id, selectedOutcome?.code, selectedOutcome?.title);
  const allPairs = activeTopic.pairs;

  // Game Settings
  const [pairCount, setPairCount] = useState<6 | 8>(6);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // indexes of currently flipped (1 or 2)
  const [isProcessing, setIsProcessing] = useState(false);
  const [movesCount, setMovesCount] = useState(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [gameTimeSeconds, setGameTimeSeconds] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [wrongShakePair, setWrongShakePair] = useState<string[]>([]);
  const [previewAllMode, setPreviewAllMode] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Cards
  const initGame = (count: 6 | 8 = pairCount) => {
    playSound('select');
    const selectedPairs = allPairs.slice(0, count);

    const generatedCards: CardItem[] = [];

    selectedPairs.forEach((pair) => {
      // 1. Concept Card
      generatedCards.push({
        cardId: `card-${pair.id}-concept`,
        pairId: pair.id,
        type: 'concept',
        conceptTitle: pair.concept,
        symbol: pair.symbol,
        badge: pair.badge,
        text: pair.concept,
        example: pair.example,
        color: pair.color,
        isFlipped: false,
        isMatched: false
      });

      // 2. Definition Card
      generatedCards.push({
        cardId: `card-${pair.id}-def`,
        pairId: pair.id,
        type: 'definition',
        conceptTitle: pair.concept,
        symbol: pair.symbol,
        badge: pair.badge,
        text: pair.definition,
        example: pair.example,
        color: pair.color,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards randomly
    const shuffled = [...generatedCards].sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedCards([]);
    setIsProcessing(false);
    setMovesCount(0);
    setMatchedPairsCount(0);
    setGameTimeSeconds(0);
    setIsGameCompleted(false);
    setWrongShakePair([]);
    setIsGameActive(true);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setGameTimeSeconds((prev) => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    initGame(pairCount);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedOutcome?.id, pairCount]);

  // Handle Card Click
  const handleCardClick = (index: number) => {
    if (isProcessing || isGameCompleted || previewAllMode) return;

    const clickedCard = cards[index];
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    // Flip the clicked card
    playSound('click');
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    // If this is the second card flipped:
    if (newFlipped.length === 2) {
      setIsProcessing(true);
      setMovesCount((m) => m + 1);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      // Check Match: must have same pairId and different types (one concept, one definition)
      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // MATCH SUCCESS!
        setTimeout(() => {
          playSound('success');
          const matchedCards = [...newCards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setIsProcessing(false);

          const newMatchedCount = matchedPairsCount + 1;
          setMatchedPairsCount(newMatchedCount);

          // Check if all matched
          if (newMatchedCount === pairCount) {
            handleVictory();
          }
        }, 500);
      } else {
        // NO MATCH: brief delay, shake, and flip back
        setTimeout(() => {
          playSound('clear');
          setWrongShakePair([firstCard.cardId, secondCard.cardId]);
        }, 400);

        setTimeout(() => {
          const revertedCards = [...newCards];
          revertedCards[firstIdx].isFlipped = false;
          revertedCards[secondIdx].isFlipped = false;
          setCards(revertedCards);
          setFlippedCards([]);
          setWrongShakePair([]);
          setIsProcessing(false);
        }, 1200);
      }
    }
  };

  // Victory Celebration
  const handleVictory = () => {
    setIsGameCompleted(true);
    setIsGameActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    playSound('bell');
    addPoints(80);
    unlockBadge('hafiza_ustasi');

    // Confetti Fireworks
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);
    } catch (e) {}
  };

  // Temporary Peek Preview Feature (3 seconds)
  const handlePeekAll = () => {
    if (previewAllMode || isGameCompleted) return;
    playSound('select');
    setPreviewAllMode(true);
    const peeked = cards.map((c) => ({ ...c, isFlipped: true }));
    setCards(peeked);

    setTimeout(() => {
      const restored = cards.map((c) => ({ ...c, isFlipped: c.isMatched }));
      setCards(restored);
      setPreviewAllMode(false);
      setFlippedCards([]);
    }, 2500);
  };

  // Format Time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate Stars based on moves
  const calculateStars = () => {
    const perfectMoves = pairCount * 1.5;
    const goodMoves = pairCount * 2.2;
    if (movesCount <= perfectMoves) return 3;
    if (movesCount <= goodMoves) return 2;
    return 1;
  };

  const stars = calculateStars();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. TOP HEADER & DASHBOARD BAR */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-black uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5 text-teal-600" />
            <span>Kavram & Tanım Hafıza Kartları Oyunu</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex flex-wrap items-center gap-2">
            <span>Matematiksel Hafıza Meydan Okuması</span>
            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-200">
              {activeTopic.code}
            </span>
          </h3>
          <p className="text-xs text-slate-500 max-w-xl">
            <strong>{activeTopic.title}</strong> — Bir kartta <strong>Kavram Adı</strong>, diğer kartta ise <strong>Tanımı</strong> yer alır. Kartları çevirerek doğru kavram-tanım çiftlerini hafızandan bul!
          </p>
        </div>

        {/* Action Controls & Difficulty */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Card Count Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setPairCount(6);
                initGame(6);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                pairCount === 6 ? 'bg-teal-600 text-white shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              12 Kart (6 Çift)
            </button>
            <button
              type="button"
              onClick={() => {
                setPairCount(8);
                initGame(8);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                pairCount === 8 ? 'bg-teal-600 text-white shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              16 Kart (8 Çift)
            </button>
          </div>

          {/* Quick Peek Helper */}
          <button
            type="button"
            onClick={handlePeekAll}
            disabled={previewAllMode || isGameCompleted}
            className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="3 saniyeliğine tüm kartlara göz at"
          >
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">İpucu (3 sn)</span>
          </button>

          {/* Restart Button */}
          <button
            type="button"
            onClick={() => initGame(pairCount)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            title="Kartları yeniden karıştır ve baştan başla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Yeniden Başlat</span>
          </button>
        </div>

      </div>

      {/* 2. STATS & STATUS RIBBON */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Timer */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Geçen Süre</div>
            <div className="text-lg font-black text-slate-900 font-mono">
              {formatTime(gameTimeSeconds)}
            </div>
          </div>
        </div>

        {/* Moves Counter */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Hamle Sayısı</div>
            <div className="text-lg font-black text-slate-900">
              {movesCount} <span className="text-xs font-normal text-slate-400">Deneme</span>
            </div>
          </div>
        </div>

        {/* Matched Progress */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Eşleşen Çiftler</div>
            <div className="text-lg font-black text-emerald-700">
              {matchedPairsCount} / {pairCount} <span className="text-xs font-normal text-slate-400">Çift</span>
            </div>
          </div>
        </div>

        {/* Performance Stars */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Hafıza Performansı</div>
            <div className="flex items-center gap-1 mt-0.5">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. VICTORY CELEBRATION MODAL BANNER */}
      {isGameCompleted && (
        <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border-2 border-emerald-400 animate-in zoom-in-95 duration-300 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 flex items-center justify-center text-4xl sm:text-5xl shadow-inner shrink-0 border border-white/30 animate-bounce">
                🏆
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-400/30 text-emerald-200 text-xs font-black uppercase">
                  <Sparkles className="w-3 h-3" />
                  <span>Kusursuz Hafıza!</span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-black">
                  Tebrikler! Tüm Kavramları Eşleştirdin
                </h4>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                  {movesCount} hamlede ve {formatTime(gameTimeSeconds)} sürede tüm kavram ve tanımları başarıyla buldun. <strong>+80 XP</strong> ve <strong>Hafıza Ustası Rozeti</strong> kazandın!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => initGame(pairCount)}
                className="px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tekrar Oyna</span>
              </button>

              {onBackToMenu && (
                <button
                  type="button"
                  onClick={onBackToMenu}
                  className="px-6 py-3 rounded-2xl bg-white text-slate-950 hover:bg-emerald-50 font-black text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>Oyun Menüsüne Dön</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Review Accordion / Grid */}
          <div className="pt-4 border-t border-white/20">
            <div className="text-xs font-extrabold text-emerald-200 mb-3 uppercase flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Öğrenilen Kavramların Özeti (Hızlı Tekrar):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allPairs.slice(0, pairCount).map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-black text-emerald-300">
                    <span>{p.badge}</span>
                    <span className="font-mono text-[10px] text-white/70">{p.symbol}</span>
                  </div>
                  <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed">
                    {p.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 4. 3D FLIP MEMORY CARDS GRID */}
      <div
        className={`grid gap-4 sm:gap-5 ${
          pairCount === 6
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-4'
        }`}
      >
        {cards.map((card, index) => {
          const isFlipped = card.isFlipped || card.isMatched;
          const isWrong = wrongShakePair.includes(card.cardId);

          return (
            <div
              key={card.cardId}
              onClick={() => handleCardClick(index)}
              className={`relative h-44 sm:h-48 rounded-3xl select-none cursor-pointer transition-all duration-300 transform-gpu ${
                card.isMatched
                  ? 'cursor-default opacity-95 scale-98'
                  : isWrong
                  ? 'animate-shake'
                  : 'hover:-translate-y-1 hover:shadow-xl'
              }`}
              style={{
                perspective: '1000px'
              }}
            >
              {/* Inner 3D Card Container */}
              <div
                className={`relative w-full h-full rounded-3xl transition-transform duration-500 shadow-md ${
                  isFlipped ? '[transform:rotateY(180deg)]' : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d'
                }}
              >
                
                {/* BACK FACE (Kapalı Yüz - Gizli Desen) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-3xl p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 border-2 border-slate-700/80 hover:border-teal-400/80 flex flex-col items-center justify-between text-white [backface-visibility:hidden] shadow-md group transition-colors"
                >
                  {/* Decorative Header */}
                  <div className="w-full flex items-center justify-between text-[10px] font-mono text-teal-400/60">
                    <span>Maarif Akademi</span>
                    <span>#{index + 1}</span>
                  </div>

                  {/* Center Question / Math Mark */}
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 group-hover:bg-teal-500 group-hover:text-slate-950 text-teal-300 flex items-center justify-center text-2xl font-black transition-all shadow-inner group-hover:scale-110">
                    ?
                  </div>

                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-teal-300 transition-colors">
                    Çevirmek İçin Tıkla
                  </div>
                </div>

                {/* FRONT FACE (Açık Yüz - [transform:rotateY(180deg)]) */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-3xl p-4 sm:p-5 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 transition-all ${
                    card.isMatched
                      ? 'bg-emerald-50/95 border-emerald-500 shadow-emerald-500/20 shadow-lg text-emerald-950'
                      : isWrong
                      ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-rose-500/20 shadow-lg'
                      : 'bg-white border-teal-500 shadow-xl text-slate-900'
                  }`}
                >
                  
                  {/* Card Type Header Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wide flex items-center gap-1 ${
                        card.type === 'concept'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                      }`}
                    >
                      {card.type === 'concept' ? (
                        <>
                          <span>🏷️ KAVRAM</span>
                        </>
                      ) : (
                        <>
                          <span>📖 TANIM</span>
                        </>
                      )}
                    </span>

                    {card.isMatched ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[9px] font-mono font-bold text-slate-400">
                        {card.symbol}
                      </span>
                    )}
                  </div>

                  {/* Card Main Body Content */}
                  {card.type === 'concept' ? (
                    // CONCEPT CARD LAYOUT
                    <div className="my-auto text-center space-y-2">
                      <div className="text-2xl sm:text-3xl">{card.badge.split(' ')[0]}</div>
                      <h4 className="text-base sm:text-lg font-black tracking-tight text-slate-950">
                        {card.conceptTitle}
                      </h4>
                      <div className="inline-block font-mono font-black text-xs text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                        {card.symbol}
                      </div>
                    </div>
                  ) : (
                    // DEFINITION CARD LAYOUT
                    <div className="my-auto space-y-1.5 overflow-hidden">
                      <p className="text-xs sm:text-[13px] font-medium leading-snug text-slate-800 line-clamp-4">
                        {card.text}
                      </p>
                      {card.example && (
                        <div className="text-[9px] text-slate-500 font-semibold italic line-clamp-1 border-t border-slate-100 pt-1">
                          💡 {card.example}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Footer Indicator */}
                  <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 pt-1 border-t border-slate-100">
                    <span>{card.type === 'concept' ? 'Tanımını Bul' : 'Kavramı Bul'}</span>
                    <span className="font-mono text-teal-700 font-black">
                      {card.isMatched ? '✓ Eşleşti' : '●'}
                    </span>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
