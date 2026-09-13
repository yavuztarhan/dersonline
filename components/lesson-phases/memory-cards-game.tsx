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
import { MathText } from '@/components/ui/math-fraction';

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
    concept: 'KESEN DOĞRU',
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

// ---------------------------------------------------------------------------
// 6. MAT.6.1.1: Bir Doğal Sayının Çarpanları ve Katları (6. Sınıf)
// ---------------------------------------------------------------------------
const MAT_6_1_1_PAIRS: MemoryPair[] = [
  {
    id: 'mat6-p1',
    concept: 'ÇARPAN (BÖLEN)',
    symbol: 'a | c',
    badge: '📦 Çarpan',
    definition: 'Bir doğal sayıyı kalansız olarak bölebilen pozitif tam sayıların her biridir.',
    example: '24\'ün çarpanları: 1, 2, 3, 4, 6, 8, 12, 24.',
    color: '#f59e0b'
  },
  {
    id: 'mat6-p2',
    concept: 'DOĞAL SAYININ KATI',
    symbol: 'k · n (k ∈ Z⁺)',
    badge: '🚀 Katlar',
    definition: 'Bir doğal sayının 1, 2, 3, 4... gibi pozitif tam sayılarla çarpılmasıyla elde edilen sonsuz sayılar kümesidir.',
    example: '12\'nin katları: 12, 24, 36, 48, 60, 72, 84, 96...',
    color: '#0284c7'
  },
  {
    id: 'mat6-p3',
    concept: 'ÇARPAN GÖKKUŞAĞI',
    symbol: '1·n = a·b = c·d',
    badge: '🌈 Gökkuşağı',
    definition: 'Çarpanların küçükten büyüğe sıralanıp baştan ve sondan eşit uzaklıktaki çiftlerin yaylarla eşleştirildiği simetrik modeldir.',
    example: '36 için: 1-36, 2-18, 3-12, 4-9 ve merkezde 6-6.',
    color: '#8b5cf6'
  },
  {
    id: 'mat6-p4',
    concept: 'ALAN MODELİ',
    symbol: 'A = w · h',
    badge: '📐 Alan Modeli',
    definition: 'Birim karelerle firesiz dikdörtgenler oluşturarak kenar uzunluklarından sayının çarpanlarını bulma yöntemidir.',
    example: '24 birimkarelik kutular: 1×24, 2×12, 3×8, 4×6 tabanları.',
    color: '#10b981'
  },
  {
    id: 'mat6-p5',
    concept: 'TAM KARE SAYI',
    symbol: 'n = a²',
    badge: '⭐ Tam Kare',
    definition: 'Kendisiyle çarpımı sayıyı veren ve pozitif çarpan sayısı tek olan özel doğal sayılardır.',
    example: '36 = 6×6 (9 çarpan), 25 = 5×5 (3 çarpan).',
    color: '#ec4899'
  },
  {
    id: 'mat6-p6',
    concept: 'ORTAK KAT',
    symbol: 'EKOK (Ortak Seferler)',
    badge: '🤝 Ortak Kat',
    definition: 'İki veya daha fazla doğal sayının katları arasında aynı anda ortak bulunan buluşma duraklarıdır.',
    example: '6 ve 8 dakikada kalkan araçların ortak kalkışları: 24, 48, 72. dakikalardır.',
    color: '#14b8a6'
  },
  {
    id: 'mat6-p7',
    concept: 'EN KÜÇÜK VE EN BÜYÜK ÇARPAN',
    symbol: '1 ve n',
    badge: '🎯 Sınır Çarpanlar',
    definition: 'Her pozitif doğal sayının en küçük pozitif çarpanı 1, en büyük çarpanı ise sayının KENDİSİDİR.',
    example: '48\'in en küçük çarpanı 1, en büyük çarpanı 48\'dir.',
    color: '#6366f1'
  },
  {
    id: 'mat6-p8',
    concept: 'ÇİFT VE TEK ÇARPANLAR',
    symbol: '2k / 2k+1',
    badge: '⚖️ Çift & Tek',
    definition: 'Bir sayının çarpanları arasından 2\'ye tam bölünenlere çift çarpan, bölünemeyenlere tek çarpan denir.',
    example: '48\'in tek çarpanları: {1, 3}, çift çarpanları: {2, 4, 6, 8, 12, 16, 24, 48}.',
    color: '#ef4444'
  }
];

// 7. MAT.6.1.2: Bölünebilme Kriterleri (6. Sınıf)
const MAT_6_1_2_PAIRS: MemoryPair[] = [
  {
    id: 'mat62-p1',
    concept: '2 İLE BÖLÜNEBİLME',
    symbol: 'Sonu: 0, 2, 4, 6, 8',
    badge: '🔢 Çift Sayılar',
    definition: 'Birler basamağı çift olan tüm doğal sayılar 2 ile kalansız bölünür.',
    example: '4.856 sayısının son basamağı 6 (çift) olduğu için 2\'ye tam bölünür.',
    color: '#0284c7'
  },
  {
    id: 'mat62-p2',
    concept: '3 İLE BÖLÜNEBİLME',
    symbol: '∑ Rakamlar = 3k',
    badge: '➕ Rakamlar Toplamı',
    definition: 'Rakamları toplamı 3 veya 3\'ün katı olan doğal sayılar 3 ile kalansız bölünür.',
    example: '7.413 ⟹ 7+4+1+3 = 15 (3\'ün katı), 3\'e tam bölünür.',
    color: '#10b396'
  },
  {
    id: 'mat62-p3',
    concept: '4 İLE BÖLÜNEBİLME',
    symbol: 'Son 2 Basamak = 4k',
    badge: '🎯 Son İki Basamak',
    definition: 'Son iki basamağı 00 veya 4\'ün katı (04, 08, 12... 96) olan sayılar 4 ile tam bölünür.',
    example: '125.836 sayısında son iki basamak 36 (4×9) olduğundan 4\'e tam bölünür.',
    color: '#f59e0b'
  },
  {
    id: 'mat62-p4',
    concept: '5 İLE BÖLÜNEBİLME',
    symbol: 'Sonu: 0 veya 5',
    badge: '🖐️ 5\'in Katları',
    definition: 'Birler basamağı 0 veya 5 olan tüm doğal sayılar 5 ile kalansız bölünür.',
    example: '8.345 (sonu 5) ve 9.210 (sonu 0) sayıları 5\'e kalansız bölünür.',
    color: '#8b5cf6'
  },
  {
    id: 'mat62-p5',
    concept: '6 İLE BÖLÜNEBİLME',
    symbol: '2 ∩ 3 = 6',
    badge: '⚡ Çift & 3\'ün Katı',
    definition: 'Hem 2 ile (çift) hem de 3 ile (rakamlar toplamı 3k) bölünebilen sayılar 6 ile tam bölünür.',
    example: '4.512 sayısı çifttir ve rakamlar toplamı 12\'dir; 6\'ya tam bölünür.',
    color: '#ec4899'
  },
  {
    id: 'mat62-p6',
    concept: '9 İLE BÖLÜNEBİLME',
    symbol: '∑ Rakamlar = 9k',
    badge: '🌟 9\'un Katı',
    definition: 'Rakamları toplamı 9 veya 9\'un katı olan tüm doğal sayılar 9 ile kalansız bölünür.',
    example: '5.418 ⟹ 5+4+1+8 = 18 (9\'un katı), 9\'a tam bölünür.',
    color: '#ef4444'
  },
  {
    id: 'mat62-p7',
    concept: '10 İLE BÖLÜNEBİLME',
    symbol: 'Sonu: 0',
    badge: '🔟 Birler: 0',
    definition: 'Birler basamağı 0 olan sayılar 10 ile kalansız bölünür; son basamak kalanı verir.',
    example: '7.850 sayısı 10\'a tam bölünür; 7.854\'ün 10\'a bölümünden kalan 4\'tür.',
    color: '#6366f1'
  },
  {
    id: 'mat62-p8',
    concept: 'BASAMAK ÇÖZÜMLEMESİ',
    symbol: '100 = 99 + 1',
    badge: '📐 Mantıksal İspat',
    definition: 'Yüzlük ve onluklar 99 ve 9\'un katı olduğundan 3 ve 9\'da sadece rakamlar toplamı kalır.',
    example: '423 = 4×(99+1) + 2×(9+1) + 3 = 9k + (4+2+3).',
    color: '#14b8a6'
  }
];

// 8. MAT.6.1.3: Asal Sayılar ve Asal Çarpanlar (6. Sınıf)
const MAT_6_1_3_PAIRS: MemoryPair[] = [
  {
    id: 'mat63-p1',
    concept: 'ASAL SAYI TANIMI',
    symbol: 'P = {2, 3, 5, 7...}',
    badge: '🏛️ Bölünemez Yapı Taşı',
    definition: 'Sadece 1\'e ve kendisine kalansız bölünebilen 1\'den büyük doğal sayılara asal sayı denir.',
    example: '13 sayısı sadece 1 ve 13\'e bölünür, dolayısıyla asaldır.',
    color: '#f59e0b'
  },
  {
    id: 'mat63-p2',
    concept: 'EN KÜÇÜK ASAL SAYI',
    symbol: '2',
    badge: '👑 Yegâne Çift Asal',
    definition: 'En küçük asal sayı 2\'dir ve 2 haricindeki tüm asal sayılar tektir.',
    example: '2\'den büyük çift sayılar 2\'ye bölündüğü için asal olamaz.',
    color: '#0284c7'
  },
  {
    id: 'mat63-p3',
    concept: '1 SAYISININ DURUMU',
    symbol: '1 ∉ Asal',
    badge: '❌ Asal Değildir',
    definition: '1 sayısı sadece 1 pozitif böleni olduğu için (2 bölen kuralını sağlamaz) asal değildir.',
    example: 'Asal sayıların tam 2 farklı pozitif böleni olmak zorundadır.',
    color: '#ef4444'
  },
  {
    id: 'mat63-p4',
    concept: 'ERATOSTHENES KALBURU',
    symbol: '1-100 Arası: 25 Asal',
    badge: '🌾 Antik Elek',
    definition: '1\'i ve asalların katlarını eleyerek 1-100 arasındaki 25 asal sayıyı bulan yöntemdir.',
    example: '2, 3, 5, 7 katları elendiğinde 1-100 arası tüm asallar parlar.',
    color: '#10b396'
  },
  {
    id: 'mat63-p5',
    concept: 'ASAL ÇARPAN AĞACI',
    symbol: 'Dallanma Modeli',
    badge: '🌳 Çarpan Ağacı',
    definition: 'Bileşik bir sayının dallara ayrılarak en altta asal yapraklara ulaşıldığı görsel modeldir.',
    example: '36 ⟹ 2 × 18 ⟹ 2 × 2 × 9 ⟹ 2 × 2 × 3 × 3 = 2² · 3².',
    color: '#8b5cf6'
  },
  {
    id: 'mat63-p6',
    concept: 'BÖLEN LİSTESİ ALGORİTMASI',
    symbol: 'A | 2, B | 3...',
    badge: '⚡ Dikey Çizgi',
    definition: 'Bir sayının dikey çizgi boyunca sırayla asal sayılara bölünerek 1\'e ulaşıldığı yöntemdir.',
    example: '72 | 2, 36 | 2, 18 | 2, 9 | 3, 3 | 3, 1  ⟹  72 = 2³ · 3².',
    color: '#ec4899'
  },
  {
    id: 'mat63-p7',
    concept: 'ARİTMETİĞİN TEMEL TEOREMİ',
    symbol: 'A = 2ᵃ · 3ᵇ · 5ᶜ',
    badge: '📜 Benzersiz Kod',
    definition: '1\'den büyük her doğal sayı asal sayıların çarpımı olarak tek bir şekilde yazılabilir.',
    example: '60 = 2² · 3 · 5 (Asal çarpanları: 2, 3, 5).',
    color: '#6366f1'
  },
  {
    id: 'mat63-p8',
    concept: 'KRİPTOGRAFİ & RSA',
    symbol: 'P₁ × P₂ = Şifre',
    badge: '🔐 Siber Kalkan',
    definition: 'İki dev asal sayının çarpımının çarpanlarına ayrılamamasıyla banka şifreleri korunur.',
    example: 'Asal sayılar günümüz siber güvenliğinin temelidir.',
    color: '#14b8a6'
  }
];

// 9. MAT.6.1.4: Ortak Kat ve Ortak Bölen (6. Sınıf)
const MAT_6_1_4_PAIRS: MemoryPair[] = [
  {
    id: 'mat64-p1',
    concept: 'ORTAK BÖLEN',
    symbol: 'A ∩ B (Bölenler)',
    badge: '📦 Eşit Paylaşım',
    definition: 'İki veya daha fazla doğal sayıyı aynı anda kalansız bölebilen sayılar kümesidir.',
    example: '24 ve 36\'nın ortak bölenleri: {1, 2, 3, 4, 6, 12}.',
    color: '#0284c7'
  },
  {
    id: 'mat64-p2',
    concept: 'ORTAK KAT',
    symbol: 'A ∩ B (Katlar)',
    badge: '⏱️ Periyodik Buluşma',
    definition: 'İki veya daha fazla doğal sayının katları arasında ortak olan sayılardır.',
    example: '6 ve 8\'in ortak katları: 24, 48, 72, 96...',
    color: '#f59e0b'
  },
  {
    id: 'mat64-p3',
    concept: 'ARALARINDA ASAL SAYILAR',
    symbol: 'Ortak Bölen = {1}',
    badge: '🤝 Tek Ortak: 1',
    definition: '1\'den başka pozitif ortak böleni olmayan iki doğal sayıdır (örn: 8 ve 15).',
    example: '8 ve 15 asal değildir ancak ortak bölenleri sadece 1 olduğu için aralarında asaldır.',
    color: '#10b396'
  },
  {
    id: 'mat64-p4',
    concept: 'EN KÜÇÜK ORTAK KAT',
    symbol: 'İlk Ortak Kat',
    badge: '🎯 İlk Çakışma',
    definition: 'İki sayının pozitif ortak katlarının en küçüğüdür; diğer ortak katlar bunun katıdır.',
    example: '15 ve 20\'nin ilk ortak katı 60\'tır (60, 120, 180...).',
    color: '#8b5cf6'
  },
  {
    id: 'mat64-p5',
    concept: 'EŞİT ARALIK & FİDAN DİKİMİ',
    symbol: 'Mesafe = Ortak Bölen',
    badge: '🌱 Yeşil Vatan',
    definition: 'Yol kenarlarına eşit aralıklarla fidan dikme problemlerinde ortak bölenler kullanılır.',
    example: '30 m ve 45 m kenarlara en az fidan için 15 m aralık seçilir.',
    color: '#14b8a6'
  },
  {
    id: 'mat64-p6',
    concept: 'SEFERLER & NÖBETLER',
    symbol: 'Zaman = Ortak Kat',
    badge: '🚌 Sefer Koordinasyonu',
    definition: 'Farklı aralıklarla kalkan araçların aynı anda hareket ettiği saatler ortak katla bulunur.',
    example: '20 dk ve 25 dk kalkan vapurlar 100 dk sonra birlikte kalkar.',
    color: '#ec4899'
  },
  {
    id: 'mat64-p7',
    concept: 'ARDIŞIK SAYILARIN ASALLIĞI',
    symbol: '(n, n+1) = Aralarında Asal',
    badge: '🔢 Ardışık Kural',
    definition: 'Ardışık iki doğal sayı (örneğin 14 ve 15) daima aralarında asaldır.',
    example: 'Farkları 1 olduğu için 1\'den büyük ortak bölenleri olamaz.',
    color: '#6366f1'
  },
  {
    id: 'mat64-p8',
    concept: 'MERHAMET & ADİL PAYLAŞIM',
    symbol: 'D9 Değeri',
    badge: '🐾 Barınak Seferberliği',
    definition: 'Sokak hayvanlarına kuru ve yaş mamaları eşit kaplara paylaştırma erdemidir.',
    example: '24 kg ve 36 kg mama 12 kg\'lık paketlerle en az kapta dağıtılır.',
    color: '#ef4444'
  }
];

// 7. MAT.7.1.1 Pairs (Tam Sayılardan Rasyonel Sayılara)
const MAT_7_1_1_PAIRS: MemoryPair[] = [
  {
    id: 'mat71-p1',
    concept: 'RASYONEL SAYILAR',
    symbol: 'ℚ (a/b, b ≠ 0)',
    badge: 'ℚ Rasyonel Sayı',
    definition: 'a ve b tam sayı ve b sıfırdan farklı olmak üzere a/b şeklinde yazılabilen sayılar kümesidir.',
    example: '3/4, -5/2, 0, 7 gibi sayılar rasyonel sayıdır.',
    color: '#8b5cf6'
  },
  {
    id: 'mat71-p2',
    concept: 'GİZLİ PAYDA KURALI',
    symbol: 'a = a/1',
    badge: '🔮 Gizli Payda',
    definition: 'Her tam sayının paydasında görünmeyen 1 vardır; bu yüzden her tam sayı bir rasyonel sayıdır.',
    example: '-4 = -4/1 = 4/(-1) = -(4/1)',
    color: '#0284c7'
  },
  {
    id: 'mat71-p3',
    concept: 'TANIMSIZ KESİR',
    symbol: 'a / 0 (b = 0)',
    badge: '🚫 Tanımsız',
    definition: 'Paydası sıfır olan kesirli ifadeler matematiksel olarak tanımsızdır ve sayı belirtmez.',
    example: '5/0 tanımsızdır; ancak 0/5 = 0 bir rasyonel sayıdır.',
    color: '#ef4444'
  },
  {
    id: 'mat71-p4',
    concept: 'MUTLAK DEĞER',
    symbol: '|x| ≥ 0',
    badge: '📏 Uzaklık Metresi',
    definition: 'Bir sayının sayı doğrusundaki başlangıç noktasına (0) olan yönsüz gerçek uzaklığıdır.',
    example: '|-4| = |+4| = 4 birim mesafe.',
    color: '#10b981'
  },
  {
    id: 'mat71-p5',
    concept: 'SAYI KÜMELERİ EULER ŞEMASI',
    symbol: 'ℕ ⊂ ℤ ⊂ ℚ',
    badge: '⭕ Kümeler Hiyerarşisi',
    definition: 'Doğal sayılar tam sayıların, tam sayılar da rasyonel sayıların bir alt kümesidir.',
    example: '5 hem ℕ, hem ℤ, hem ℚ elemanıdır; -3 ise ℤ ve ℚ elemanıdır.',
    color: '#f59e0b'
  },
  {
    id: 'mat71-p6',
    concept: 'SAYI DOĞRUSU DİLİMLEME',
    symbol: 'Aralık / Payda',
    badge: '📐 Eşit Dilim',
    definition: 'Ardışık iki tam sayı arasını kesrin paydası kadar eşit parçaya bölerek rasyonel noktayı bulma.',
    example: '0 ile -1 arasını 4 eşit parçaya bölüp sola 1 adım giderek -1/4 bulunur.',
    color: '#06b6d4'
  },
  {
    id: 'mat71-p7',
    concept: 'AKILLI EV ENERJİ DENGESİ',
    symbol: '0 kWh = Denge',
    badge: '🏡 Tasarruf (D17)',
    definition: 'Güneş üretimini pozitif (+), şebeke çekimini negatif (-) alarak sıfır referansına göre bütçeleme.',
    example: '+120 kWh solar ve -150 kWh şebeke çekimi ile net bakiye -30 kWh olur.',
    color: '#eab308'
  },
  {
    id: 'mat71-p8',
    concept: 'NEGATİF İŞARET KONUMU',
    symbol: '-a/b = (-a)/b = a/(-b)',
    badge: '⚖️ Eşit Temsil',
    definition: 'Negatif bir rasyonel sayıda eksi işareti kesir çizgisinin önüne, paya veya paydaya yazılabilir.',
    example: '-2/3 kesri (-2)/3 veya 2/(-3) ile tamamen aynı değere sahiptir.',
    color: '#ec4899'
  }
];

const MAT_7_1_1_W2_PAIRS: MemoryPair[] = [
  {
    id: 'mat712-p1',
    concept: 'BİLEŞİK KESİR',
    symbol: '-11/4 = -2 tam 3/4',
    badge: '📐 Bileşik Kesir',
    definition: 'Payı paydasına eşit veya büyük olan kesirlerdir. Sayı doğrusundaki yerini bulmak için önce tam sayılı kesre çevrilir.',
    example: '-11/4 = -2 tam 3/4 (-2 ile -3 arasında 4 eşit parçadan 3. adım)',
    color: '#8b5cf6'
  },
  {
    id: 'mat712-p2',
    concept: 'TAM SAYILI KESİR',
    symbol: '-2 tam 3/4',
    badge: '🔢 Tam Sayılı Kesir',
    definition: 'Bir tam sayı ve bir basit kesirden oluşan rasyonel gösterimdir. Sayı doğrusunda hangi iki ardışık tam sayı arasında olduğunu doğrudan gösterir.',
    example: '-2 tam 3/4 sayısı -2 ile -3 arasındadır ve -3 tam sayısına daha yakındır.',
    color: '#10b981'
  },
  {
    id: 'mat712-p3',
    concept: 'SAYI DOĞRUSU DİLİMLEME',
    symbol: 'Payda = Parça, Pay = Adım',
    badge: '📏 Dilimleme',
    definition: 'Sayı doğrusunda ardışık iki tam sayının arası payda kadar eşit parçaya ayrılır, pay kadar sıfırdan itibaren adım atılır.',
    example: '-3 ile -4 arasını 5 eşit parçaya bölüp sola 2 adım gitmek: -17/5.',
    color: '#0284c7'
  },
  {
    id: 'mat712-p4',
    concept: 'MUTLAK DEĞER',
    symbol: '|-11/4| = |+11/4| = 11/4',
    badge: '⚡ Sıfıra Uzaklık',
    definition: 'Bir rasyonel sayının sayı doğrusunda başlangıç noktasına (0) olan yönsüz gerçek mesafesidir ve asla negatif olamaz.',
    example: '|-11/4| = |+11/4| = 11/4 birim uzaklıktadır.',
    color: '#f59e0b'
  },
  {
    id: 'mat712-p5',
    concept: 'DENK KESİR (GENİŞLETME)',
    symbol: '1/3 = 2/6, 2/3 = 4/6',
    badge: '🔄 Denk Temsil',
    definition: 'Pay ve paydanın aynı sayıyla çarpılmasıyla kesrin değeri değişmez; sayı doğrusunda aynı noktayı gösterir ve araya yeni sayılar yerleştirmeyi sağlar.',
    example: '1/3 ve 2/3 kesirleri genişletilerek ortadaki 3/6 = 1/2 sayısı bulunur.',
    color: '#06b6d4'
  },
  {
    id: 'mat712-p6',
    concept: 'BAŞLANGIÇ NOKTASI (0)',
    symbol: 'Referans = 0',
    badge: '🎯 Başlangıç Noktası',
    definition: 'Sayı doğrusunda pozitif ve negatif sayıları birbirinden ayıran referans noktasıdır; sağında pozitif, solunda negatif rasyonel sayılar bulunur.',
    example: 'Rezerv fazlası +7/2 ton sağda, rezerv açığı -11/4 ton soldadır.',
    color: '#ec4899'
  }
];

// Helper to resolve pairs and topic info
function resolveOutcomePairs(outcomeId?: string, outcomeCode?: string, outcomeTitle?: string): { code: string; title: string; pairs: MemoryPair[] } {
  const id = outcomeId || '';
  const code = outcomeCode || '';
  const title = (outcomeTitle || '').toLowerCase();

  // 0. MAT.7.1.1-2 Check
  if (id === 'MAT.7.1.1-2' || id === 'MAT.7.1.1.2' || title.includes('derinleşme') || title.includes('yoğunluk')) {
    return {
      code: 'MAT.7.1.1',
      title: 'Rasyonel Sayıların Sayı Doğrusunda Derinleşmesi ve Yoğunluğu',
      pairs: MAT_7_1_1_W2_PAIRS
    };
  }

  // 0. MAT.7.1.1 Check
  if (id === 'MAT.7.1.1' || code.includes('7.1.1') || title.includes('rasyonel')) {
    return {
      code: 'MAT.7.1.1',
      title: 'Tam Sayılardan Rasyonel Sayılara',
      pairs: MAT_7_1_1_PAIRS
    };
  }

  // 1. Direct ID / Code Check (Exact topic matching)
  if (id === 'MAT.6.1.4' || code.includes('6.1.4') || title.includes('ortak kat') || title.includes('ortak bölen')) {
    return {
      code: 'MAT.6.1.4',
      title: 'Ortak Kat ve Ortak Bölen',
      pairs: MAT_6_1_4_PAIRS
    };
  }

  if (id === 'MAT.6.1.3' || code.includes('6.1.3') || title.includes('asal')) {
    return {
      code: 'MAT.6.1.3',
      title: 'Asal Sayılar ve Asal Çarpanlar',
      pairs: MAT_6_1_3_PAIRS
    };
  }

  if (id === 'MAT.6.1.2' || code.includes('6.1.2') || title.includes('bölünebilme')) {
    return {
      code: 'MAT.6.1.2',
      title: 'Bölünebilme Kriterleri (2, 3, 4, 5, 6, 9, 10)',
      pairs: MAT_6_1_2_PAIRS
    };
  }

  if (id === 'MAT.6.1.1' || code.includes('6.1.1') || title.includes('çarpanları ve katları')) {
    return {
      code: 'MAT.6.1.1',
      title: 'Bir Doğal Sayının Çarpanları ve Katları',
      pairs: MAT_6_1_1_PAIRS
    };
  }

  if (id === 'MAT.5.3.4' || code.includes('5.3.4')) {
    return {
      code: 'MAT.5.3.4',
      title: 'Doğruların Durumları ve Açı Çıkarımları',
      pairs: MAT_5_3_4_PAIRS
    };
  }

  if (id === 'MAT.5.3.3' || code.includes('5.3.3')) {
    return {
      code: 'MAT.5.3.3',
      title: 'Açı Ölçme ve İletki (Açıölçer) Kullanımı',
      pairs: MAT_5_3_3_PAIRS
    };
  }

  if (id === 'MAT.5.3.2' || code.includes('5.3.2')) {
    return {
      code: 'MAT.5.3.2',
      title: 'Geometrik İnşa ve Çıkarım: Cetvel, Pergel, Gönye',
      pairs: MAT_5_3_2_PAIRS
    };
  }

  if (id === 'MAT.5.1.1' || code.includes('5.1.1')) {
    return {
      code: 'MAT.5.1.1',
      title: 'Doğal Sayılar ve Basamak Değeri',
      pairs: MAT_5_1_1_PAIRS
    };
  }

  if (id === 'MAT.5.3.1' || code.includes('5.3.1')) {
    return {
      code: 'MAT.5.3.1',
      title: 'Temel Geometrik Kavramlar ve Çizimler',
      pairs: MAT_5_3_1_PAIRS
    };
  }

  // 2. Keyword fallback for 4. Hafta (MAT.5.3.4 - Kesişen Doğrular, Ters Açılar, Komşu, Tümler, Bütünler)
  if (
    title.includes('ters') ||
    title.includes('tümler') ||
    title.includes('bütünler') ||
    title.includes('komşu') ||
    title.includes('kesen') ||
    (title.includes('durumuna') && title.includes('açı'))
  ) {
    return {
      code: 'MAT.5.3.4',
      title: 'Doğruların Durumları ve Açı Çıkarımları',
      pairs: MAT_5_3_4_PAIRS
    };
  }

  // 3. Keyword fallback for 3. Hafta (MAT.5.3.3 - İletki, Açı Çeşitleri)
  if (title.includes('iletki') || title.includes('açıölçer') || (title.includes('açı') && !title.includes('doğru'))) {
    return {
      code: 'MAT.5.3.3',
      title: 'Açı Ölçme ve İletki (Açıölçer) Kullanımı',
      pairs: MAT_5_3_3_PAIRS
    };
  }

  // 4. Keyword fallback for 2. Hafta (MAT.5.3.2 - İnşa, Cetvel, Pergel, Gönye)
  if (title.includes('pergel') || title.includes('gönye') || title.includes('inşa') || title.includes('ray')) {
    return {
      code: 'MAT.5.3.2',
      title: 'Geometrik İnşa ve Çıkarım: Cetvel, Pergel, Gönye',
      pairs: MAT_5_3_2_PAIRS
    };
  }

  // 5. Keyword fallback for 1. Hafta (MAT.5.1.1 - Doğal Sayılar)
  if (title.includes('doğal sayı') || title.includes('basamak') || title.includes('bölük')) {
    return {
      code: 'MAT.5.1.1',
      title: 'Doğal Sayılar ve Basamak Değeri',
      pairs: MAT_5_1_1_PAIRS
    };
  }

  // 6. Default Fallback to MAT.5.3.1
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
  const [earnedXp, setEarnedXp] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [floatingToast, setFloatingToast] = useState<{ text: string; xp: number } | null>(null);

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
    setEarnedXp(0);
    setComboStreak(0);
    setFloatingToast(null);
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

          // XP Calculation with Combo
          const nextCombo = comboStreak + 1;
          setComboStreak(nextCombo);
          const baseMatchXp = 15;
          const comboBonus = nextCombo > 1 ? (nextCombo - 1) * 10 : 0;
          const totalMatchXp = baseMatchXp + comboBonus;

          setEarnedXp((prev) => prev + totalMatchXp);
          addPoints(totalMatchXp);

          setFloatingToast({
            text: nextCombo > 1 ? `${nextCombo}x Seri Kombo! 🔥` : 'Doğru Eşleşme! ✨',
            xp: totalMatchXp
          });
          setTimeout(() => setFloatingToast(null), 1600);

          // Check if all matched
          if (newMatchedCount === pairCount) {
            handleVictory(totalMatchXp);
          }
        }, 500);
      } else {
        // NO MATCH: reset combo streak, shake, and flip back
        setComboStreak(0);
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
  const handleVictory = (lastMatchXp: number = 15) => {
    setIsGameCompleted(true);
    setIsGameActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    playSound('bell');
    
    // Performance Bonus XP
    const starsEarned = calculateStars();
    const starBonus = starsEarned === 3 ? 30 : starsEarned === 2 ? 15 : 5;
    const timeBonus = gameTimeSeconds < 60 ? 25 : gameTimeSeconds < 90 ? 15 : 5;
    const completionBonus = 50;
    const totalBonus = completionBonus + starBonus + timeBonus;

    setEarnedXp((prev) => prev + totalBonus);
    addPoints(totalBonus);
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

      {/* Floating XP Toast */}
      {floatingToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-5 py-2.5 rounded-2xl bg-slate-950/95 text-white border border-amber-400/80 shadow-2xl flex items-center gap-2 font-black text-sm backdrop-blur-md">
            <span className="text-amber-400">⚡ +{floatingToast.xp} XP</span>
            <span className="text-slate-200 text-xs font-bold">• {floatingToast.text}</span>
          </div>
        </div>
      )}

      {/* 2. STATS & STATUS RIBBON (5 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        
        {/* Live XP Score */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl p-4 border border-amber-300 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
            ⚡
          </div>
          <div>
            <div className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
              <span>Kazanılan XP</span>
              {comboStreak > 1 && (
                <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white text-[9px] font-black animate-pulse">
                  {comboStreak}x
                </span>
              )}
            </div>
            <div className="text-lg font-black text-amber-600">
              +{earnedXp} <span className="text-xs font-bold text-amber-700">XP</span>
            </div>
          </div>
        </div>

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
        <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Hafıza Yıldızı</div>
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
                  {movesCount} hamlede ve {formatTime(gameTimeSeconds)} sürede tüm kavram ve tanımları başarıyla çözdün.
                </p>
                <div className="flex items-center gap-2 pt-1 flex-wrap justify-center sm:justify-start">
                  <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1">
                    ⚡ Toplam: +{earnedXp} XP Kazandın
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-white/20 text-white font-bold text-xs border border-white/30">
                    🎖️ Hafıza Ustası Rozeti
                  </span>
                </div>
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
                    <span className="font-mono text-[10px] text-white/70"><MathText text={p.symbol} /></span>
                  </div>
                  <div className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed">
                    <MathText text={p.definition} />
                  </div>
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
                        <MathText text={card.symbol} />
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
                        <MathText text={card.symbol} />
                      </div>
                    </div>
                  ) : (
                    // DEFINITION CARD LAYOUT
                    <div className="my-auto space-y-1.5 overflow-hidden">
                      <div className="text-xs sm:text-[13px] font-medium leading-snug text-slate-800 line-clamp-4">
                        <MathText text={card.text} />
                      </div>
                      {card.example && (
                        <div className="text-[9px] text-slate-500 font-semibold italic line-clamp-1 border-t border-slate-100 pt-1">
                          💡 <MathText text={card.example} />
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
