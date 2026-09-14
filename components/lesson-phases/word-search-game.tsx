'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Search,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Lightbulb,
  Award,
  Zap,
  Eye,
  EyeOff,
  Shuffle
} from 'lucide-react';
import { MathText } from '@/components/ui/math-fraction';

interface WordClue {
  id: string;
  question: string;
  word: string;
  hint: string;
  color: string;
}

// 0. MAT.5.1.1 Clues (5. Sınıf: Doğal Sayılar, Bölükler ve Basamak Değeri)
const MAT_5_1_1_CLUES: WordClue[] = [
  {
    id: 'mat511-c1',
    question: 'Büyük doğal sayıların kolay okunup yazılabilmesi için sağdan sola doğru ayrılan üçerli basamak gruplarına ne ad verilir?',
    word: 'BÖLÜK',
    hint: '5 Harfli • Birler, binler, milyonlar',
    color: '#0284c7'
  },
  {
    id: 'mat511-c2',
    question: '7, 8 ve 9 basamaklı doğal sayılarda en solda yer alan ve büyük miktarları belirten bölüğe ne denir?',
    word: 'MİLYONLAR',
    hint: '9 Harfli • Milyonlar basamağının olduğu bölük',
    color: '#10b981'
  },
  {
    id: 'mat511-c3',
    question: 'Bir rakamın bulunduğu haneye ve konumuna göre kazandığı sayısal değere ne denir?',
    word: 'BASAMAK',
    hint: '7 Harfli • Basamak Değeri',
    color: '#f59e0b'
  },
  {
    id: 'mat511-c4',
    question: 'Bir doğal sayının tüm basamak değerlerinin toplamı biçiminde ayrıntılı olarak yazılmasına ne ad verilir?',
    word: 'ÇÖZÜMLEME',
    hint: '9 Harfli • Basamak değerleri toplamı',
    color: '#8b5cf6'
  },
  {
    id: 'mat511-c5',
    question: 'Birler bölüğü ile milyonlar bölüğü arasında yer alan (4, 5 ve 6. basamaklar) bölüğe ne ad verilir?',
    word: 'BİNLER',
    hint: '6 Harfli • 1.000\'ler bölüğü',
    color: '#ec4899'
  },
  {
    id: 'mat511-c6',
    question: 'Bir doğal sayının en sağında yer alan birler, onlar ve yüzler basamağının oluşturduğu temel bölüğe ne denir?',
    word: 'BİRLER',
    hint: '6 Harfli • En sağdaki temel bölük',
    color: '#ef4444'
  }
];

// 1. MAT.5.3.1 Clues (Temel Çizimler)
const MAT_5_3_1_CLUES: WordClue[] = [
  {
    id: 'c1',
    question: 'İki ucu da sınırlı olan ve boyu cetvelle ölçülebilen düz çizgi modeline ne denir?',
    word: 'DOĞRUPARÇASI',
    hint: '12 Harfli • Sembolü [AB]',
    color: '#10b396'
  },
  {
    id: 'c2',
    question: 'Başlangıç noktası sabit olup diğer ucu uzayda sonsuza uzanan fener ışığı modeline ne denir?',
    word: 'IŞIN',
    hint: '4 Harfli • Sembolü [AB>',
    color: '#3b82f6'
  },
  {
    id: 'c3',
    question: 'Her iki yönden de sınırsızca uzayan ve iki ucuna ok konulan çizgi modeline ne denir?',
    word: 'DOĞRU',
    hint: '5 Harfli • Sembolü AB',
    color: '#f59e0b'
  },
  {
    id: 'c4',
    question: 'Boyutu, eni veya boyu olmayan, uzayda sadece bir konum belirten geometrik ize ne denir?',
    word: 'NOKTA',
    hint: '5 Harfli • Büyük harfle isimlendirilir',
    color: '#8b5cf6'
  },
  {
    id: 'c5',
    question: 'Doğru parçasının iki ucu arasındaki mesafeyi ölçmek için kullanılan araca ne denir?',
    word: 'CETVEL',
    hint: '6 Harfli • Üzerinde santimetre çizgileri vardır',
    color: '#ec4899'
  },
  {
    id: 'c6',
    question: 'Doğru ve ışın modellerinin sınırsız uzandığını belirtmek için uçlarına konulan işarete ne denir?',
    word: 'OK',
    hint: '2 Harfli • Yön belirtir',
    color: '#ef4444'
  }
];

// 2. MAT.5.3.2 Clues (Temel Çizim Araçları ve Çıkarımlar)
const MAT_5_3_2_CLUES: WordClue[] = [
  {
    id: 'mat2-c1',
    question: 'Çember çizmek, yarıçap uzunluğunu aktarmak ve ışın üzerinde eşit parçalar kesmek için kullanılan iki kollu çizim aracına ne denir?',
    word: 'PERGEL',
    hint: '6 Harfli • Sabit iğnesi ve kalem ayağı vardır',
    color: '#10b396'
  },
  {
    id: 'mat2-c2',
    question: 'Bir doğruya dışındaki bir noktadan dikme çizmek ve 90 derecelik dik açıları oluşturmak için kullanılan üçgen araca ne denir?',
    word: 'GÖNYE',
    hint: '5 Harfli • 90° dik köşesi olan üçgen çizim aracı',
    color: '#0284c7'
  },
  {
    id: 'mat2-c3',
    question: 'İki noktayı birleştirerek üzerinden düz bir doğru geçirmek için kullanılan ölçeksiz düz çizim aracına ne denir?',
    word: 'CETVEL',
    hint: '6 Harfli • Düz çizgi çizme aracı',
    color: '#f59e0b'
  },
  {
    id: 'mat2-c4',
    question: 'Bir çemberin merkezinden çember üzerindeki herhangi bir noktaya çizilen ve pergel açıklığı kadar olan doğru parçasına ne denir?',
    word: 'YARIÇAP',
    hint: '7 Harfli • Sembolü (r) • Tüm yarıçaplar eşittir',
    color: '#8b5cf6'
  },
  {
    id: 'mat2-c5',
    question: 'Bir doğruya eşit uzaklıktaki dikmelerin birleştirilmesiyle elde edilen ve uzatıldığında hiçbir zaman kesişmeyen doğrulara ne denir?',
    word: 'PARALEL',
    hint: '7 Harfli • Sembolü (//) • Tren rayı modeli',
    color: '#ec4899'
  },
  {
    id: 'mat2-c6',
    question: 'Bir doğruya dışındaki veya üzerindeki bir noktadan gönye yardımıyla 90 derecelik açıyla çizilen çizgiye ne denir?',
    word: 'DİKME',
    hint: '5 Harfli • Sembolü (⊥) • 90° dik açı yapar',
    color: '#ef4444'
  }
];

// 3. MAT.5.3.3 Clues (Açı Ölçme ve İletki)
const MAT_5_3_3_CLUES: WordClue[] = [
  {
    id: 'ang-c1',
    question: 'Ölçüsü 0° ile 90° arasında olan dar geometrik açıklığa ne denir?',
    word: 'DARAÇI',
    hint: '6 Harfli • Sembolü < 90°',
    color: '#0284c7'
  },
  {
    id: 'ang-c2',
    question: 'Ölçüsü tam 90° olan ve köşesine diklik sembolü konulan açı türüne ne denir?',
    word: 'DİKAÇI',
    hint: '6 Harfli • Sembolü [⊥] (90°)',
    color: '#10b396'
  },
  {
    id: 'ang-c3',
    question: 'Ölçüsü 90° ile 180° arasında olan geniş açıklıklı açıya ne denir?',
    word: 'GENİŞAÇI',
    hint: '8 Harfli • 90° < s(A) < 180°',
    color: '#f59e0b'
  },
  {
    id: 'ang-c4',
    question: 'Ölçüsü tam 180° olan ve dümdüz bir doğru oluşturan açıya ne denir?',
    word: 'DOĞRUAÇI',
    hint: '8 Harfli • 180°',
    color: '#a855f7'
  },
  {
    id: 'ang-c5',
    question: 'Açıları derece cinsinden ölçmeye yarayan yarım daire şeklindeki matematiksel araca ne denir?',
    word: 'İLETKİ',
    hint: '6 Harfli • Açıölçer',
    color: '#ec4899'
  },
  {
    id: 'ang-c6',
    question: 'Açı ölçme standart birimine ne ad verilir?',
    word: 'DERECE',
    hint: '6 Harfli • Sembolü (°)',
    color: '#ef4444'
  }
];

// 4. MAT.5.3.4 Clues (Doğruların Durumları ve Açı Çıkarımları)
const MAT_5_3_4_CLUES: WordClue[] = [
  {
    id: 'mat4-c1',
    question: 'Kesişen iki doğrunun oluşturduğu, karşılıklı ve ölçüleri birbirine daima eşit olan açılara ne denir?',
    word: 'TERSAÇI',
    hint: '7 Harfli • a = c, b = d',
    color: '#10b396'
  },
  {
    id: 'mat4-c2',
    question: 'Ölçüleri toplamı 90° (dik açı) olan iki açıya ne ad verilir?',
    word: 'TÜMLER',
    hint: '6 Harfli • x + y = 90°',
    color: '#0284c7'
  },
  {
    id: 'mat4-c3',
    question: 'Ölçüleri toplamı 180° (doğru açı) olan iki açıya ne ad verilir?',
    word: 'BÜTÜNLER',
    hint: '8 Harfli • a + b = 180°',
    color: '#f59e0b'
  },
  {
    id: 'mat4-c4',
    question: 'Bir köşesi ve bir kolu ortak olup iç bölgeleri ayrık olan yan yana açılara ne denir?',
    word: 'KOMŞU',
    hint: '5 Harfli • Yan yana açılar',
    color: '#8b5cf6'
  },
  {
    id: 'mat4-c5',
    question: 'İki veya daha fazla doğruyu farklı noktalarda kesen üçüncü doğruya ne ad verilir?',
    word: 'KESEN',
    hint: '5 Harfli • İki doğruyu kesen doğru',
    color: '#ec4899'
  },
  {
    id: 'mat4-c6',
    question: 'Aynı düzlemde bulunan ve uzatıldığında hiçbir zaman kesişmeyip açı oluşturmayan doğrulara ne denir?',
    word: 'PARALEL',
    hint: '7 Harfli • Sembolü (//)',
    color: '#ef4444'
  }
];

// 5. MAT.6.1.1 Clues (6. Sınıf: Bir Doğal Sayının Çarpanları ve Katları)
const MAT_6_1_1_CLUES: WordClue[] = [
  {
    id: 'mat6-c1',
    question: 'Bir doğal sayıyı kalansız bölebilen pozitif tam sayılara ne denir?',
    word: 'ÇARPAN',
    hint: '6 Harfli • Bölen ile eş anlamlıdır',
    color: '#f59e0b'
  },
  {
    id: 'mat6-c2',
    question: 'Bir sayının çarpanları ile tamamen aynı anlama gelen matematiksel kavrama ne ad verilir?',
    word: 'BÖLEN',
    hint: '5 Harfli • Kalansız bölme yapar',
    color: '#10b396'
  },
  {
    id: 'mat6-c3',
    question: 'Bir doğal sayının pozitif tam sayılarla (1, 2, 3...) çarpılmasıyla elde edilen sayılara o sayının neyi denir?',
    word: 'KAT',
    hint: '3 Harfli • Ritmik ilerleyen sonsuz sayılar',
    color: '#0284c7'
  },
  {
    id: 'mat6-c4',
    question: 'Bir sayının çarpanlarının küçükten büyüğe dizilip dıştan içe eşleştirildiği simetrik modele ne denir?',
    word: 'GÖKKUŞAĞI',
    hint: '9 Harfli • Çarpan yayları',
    color: '#8b5cf6'
  },
  {
    id: 'mat6-c5',
    question: 'Kenar uzunlukları çarpan çiftleri olan bir dikdörtgenin kapsadığı toplam birimkare büyüklüğüne ne denir?',
    word: 'ALAN',
    hint: '4 Harfli • Dikdörtgensel koli tabanı',
    color: '#ec4899'
  },
  {
    id: 'mat6-c6',
    question: 'Aynı iki çarpanın çarpımı olan (örn. 6×6=36) ve pozitif çarpan sayısı tek olan sayılara ne denir?',
    word: 'TAMKARE',
    hint: '7 Harfli • a² modeli',
    color: '#ef4444'
  }
];

// 6. MAT.6.1.2 Clues (6. Sınıf: Bölünebilme Kriterleri)
const MAT_6_1_2_CLUES: WordClue[] = [
  {
    id: 'mat62-c1',
    question: '2 ile kalansız bölünebilen sayıların birler basamağındaki (0, 2, 4, 6, 8) rakam türüne ne denir?',
    word: 'ÇİFT',
    hint: '4 Harfli • 2\'nin katı sayılar',
    color: '#0284c7'
  },
  {
    id: 'mat62-c2',
    question: 'Bir sayının basamaklarındaki değerlerin sayısal konumuna ne ad verilir?',
    word: 'BASAMAK',
    hint: '7 Harfli • Birler, onlar, yüzler',
    color: '#10b396'
  },
  {
    id: 'mat62-c3',
    question: '3 ve 9 ile bölünebilmede incelenen tüm rakamların bir araya getirilme işlemine ne denir?',
    word: 'TOPLAM',
    hint: '6 Harfli • Rakamlar toplamı kuralı',
    color: '#f59e0b'
  },
  {
    id: 'mat62-c4',
    question: 'Bir bölme işleminde bölünen sayı tam paylaştırılamadığında artan miktara ne denir?',
    word: 'KALAN',
    hint: '5 Harfli • Kalansız bölmede sıfırdır',
    color: '#ec4899'
  },
  {
    id: 'mat62-c5',
    question: 'Bir sayının başka bir sayıya tam bölünüp bölünmediğini belirleyen matematiksel kurala ne denir?',
    word: 'KRİTER',
    hint: '6 Harfli • Bölünebilme kuralı',
    color: '#8b5cf6'
  },
  {
    id: 'mat62-c6',
    question: 'Hem 2 ile hem de 5 ile kalansız bölünebilen sayıların tam olarak bölündüğü sayı hangisidir?',
    word: 'ONLUK',
    hint: '5 Harfli • Sonu 0 ile biter',
    color: '#ef4444'
  }
];

// 7. MAT.6.1.3 Clues (6. Sınıf: Asal Sayılar ve Asal Çarpanlar)
const MAT_6_1_3_CLUES: WordClue[] = [
  {
    id: 'mat63-c1',
    question: 'Sadece 1\'e ve kendisine kalansız bölünebilen 1\'den büyük doğal sayılara ne denir?',
    word: 'ASAL',
    hint: '4 Harfli • Sayıların bölünemez yapı taşı',
    color: '#f59e0b'
  },
  {
    id: 'mat63-c2',
    question: 'Antik Yunan matematikçisi Eratosthenes\'in asal sayıları bulmak için geliştirdiği eleğe ne ad verilir?',
    word: 'KALBUR',
    hint: '6 Harfli • Eratosthenes eleği',
    color: '#0284c7'
  },
  {
    id: 'mat63-c3',
    question: 'Bileşik sayıları dallara ayırarak en alttaki asal yapraklara ulaştıran modele ne denir?',
    word: 'AĞAÇ',
    hint: '4 Harfli • Çarpan ağacı',
    color: '#10b396'
  },
  {
    id: 'mat63-c4',
    question: 'Asal çarpan algoritmasında dikey çizginin sağına yazılan dikey sayı dizisine ne denir?',
    word: 'BÖLEN',
    hint: '5 Harfli • Asal bölen listesi',
    color: '#8b5cf6'
  },
  {
    id: 'mat63-c5',
    question: 'Asal çarpanların kuvvetler biçiminde (örn: 2³ · 3²) çarpım olarak yazılmasına ne ad verilir?',
    word: 'ÜSLÜ',
    hint: '4 Harfli • Kuvvet gösterimi',
    color: '#ec4899'
  },
  {
    id: 'mat63-c6',
    question: 'Büyük asal sayıların çarpımıyla oluşturulan kırılması imkânsız dijital şifreleme bilimine ne denir?',
    word: 'KRİPTO',
    hint: '6 Harfli • Siber güvenlik kalkanı',
    color: '#ef4444'
  }
];

// 8. MAT.6.1.4 Clues (6. Sınıf: Ortak Kat ve Ortak Bölen)
const MAT_6_1_4_CLUES: WordClue[] = [
  {
    id: 'mat64-c1',
    question: 'İki veya daha fazla doğal sayının her ikisinde de bulunan bölen veya katlara ne denir?',
    word: 'ORTAK',
    hint: '5 Harfli • Kesişim elemanları',
    color: '#0284c7'
  },
  {
    id: 'mat64-c2',
    question: 'İki sayıyı aynı anda kalansız bölen ve eşit paketleme sağlayan sayılara ne ad verilir?',
    word: 'BÖLEN',
    hint: '5 Harfli • Eşit parça boyutu',
    color: '#10b396'
  },
  {
    id: 'mat64-c3',
    question: 'İki sayının ritmik sayma basamaklarında aynı ana denk gelen çakışma sayılarına ne denir?',
    word: 'KAT',
    hint: '3 Harfli • Periyodik sefer durağı',
    color: '#f59e0b'
  },
  {
    id: 'mat64-c4',
    question: '1\'den başka hiçbir pozitif ortak böleni olmayan iki sayının arasındaki duruma ne denir?',
    word: 'ASALLIK',
    hint: '7 Harfli • Aralarında asallık',
    color: '#8b5cf6'
  },
  {
    id: 'mat64-c5',
    question: 'Düzenli aralıklarla tekrarlanan nöbet ve otobüs sefer sürelerine ne ad verilir?',
    word: 'PERİYOT',
    hint: '7 Harfli • Ritmik döngü',
    color: '#ec4899'
  },
  {
    id: 'mat64-c6',
    question: 'Sokak hayvanlarına eşit mama paylaştırma bağlamında öne çıkan temel ahlaki değere ne denir?',
    word: 'MERHAMET',
    hint: '8 Harfli • D9 Maarif erdemi',
    color: '#ef4444'
  }
];

// 6. MAT.7.1.1 Clues (Tam Sayılardan Rasyonel Sayılara)
const MAT_7_1_1_CLUES: WordClue[] = [
  {
    id: 'mat71-c1',
    question: 'a ve b tam sayı, b ≠ 0 olmak üzere a/b şeklinde yazılabilen sayılara ne ad verilir?',
    word: 'RASYONEL',
    hint: '8 Harfli • Sembolü ℚ',
    color: '#8b5cf6'
  },
  {
    id: 'mat71-c2',
    question: 'Bir sayının sayı doğrusunda başlangıç noktasına (0) olan yönsüz gerçek mesafesine ne denir?',
    word: 'MUTLAKDEĞER',
    hint: '11 Harfli • Sembolü |x|',
    color: '#10b981'
  },
  {
    id: 'mat71-c3',
    question: 'Paydası sıfır olan kesirli bir ifadenin (örneğin a/0) matematiksel durumu nedir?',
    word: 'TANIMSIZ',
    hint: '8 Harfli • Sayı belirtmez',
    color: '#ef4444'
  },
  {
    id: 'mat71-c4',
    question: '0\'dan başlayıp birer birer sonsuza kadar giden pozitif sayılar ve sıfırın oluşturduğu kümeye ne denir?',
    word: 'DOĞALSAYI',
    hint: '9 Harfli • Sembolü ℕ',
    color: '#f59e0b'
  },
  {
    id: 'mat71-c5',
    question: 'Her tam sayının paydasında bulunan ve onu rasyonel yapan görünmez sayıya ne denir?',
    word: 'GİZLİPAYDA',
    hint: '10 Harfli • Değeri 1\'dir',
    color: '#0284c7'
  },
  {
    id: 'mat71-c6',
    question: 'İç içe geçmiş sayı kümelerini (N ⊂ Z ⊂ Q) gösteren halka diyagramına kimin adı verilmiştir?',
    word: 'EULER',
    hint: '5 Harfli • Euler Şeması',
    color: '#ec4899'
  }
];

// 7. MAT.7.1.1-2 Clues (Rasyonel Sayıların Sayı Doğrusunda Derinleşmesi)
const MAT_7_1_1_W2_CLUES: WordClue[] = [
  {
    id: 'mat712-c1',
    question: 'Payı paydasına eşit ya da paydasından büyük olan rasyonel kesir türüne ne ad verilir?',
    word: 'BİLEŞİK',
    hint: '7 Harfli • Sayı doğrusunda tam sayılıya çevrilir',
    color: '#8b5cf6'
  },
  {
    id: 'mat712-c2',
    question: 'Bir tam sayı ve basit kesirden oluşan, sayı doğrusundaki aralığı doğrudan veren gösterim türü nedir?',
    word: 'TAMSAYILI',
    hint: '9 Harfli • -2 tam 3/4 gibi gösterilir',
    color: '#10b981'
  },
  {
    id: 'mat712-c3',
    question: 'Rasyonel sayıların ardışık tam sayılar arasına payda kadar dilimlenerek gösterildiği cetvel çizgisine ne denir?',
    word: 'SAYIDOĞRUSU',
    hint: '11 Harfli • Payda kadar dilimlenir',
    color: '#0284c7'
  },
  {
    id: 'mat712-c4',
    question: 'Bir sayının sayı doğrusunda başlangıç noktasına (0) olan yönsüz gerçek mesafesine ne denir?',
    word: 'MUTLAKDEĞER',
    hint: '11 Harfli • Sembolü |x| ≥ 0',
    color: '#f59e0b'
  },
  {
    id: 'mat712-c5',
    question: 'Genişletme veya sadeleştirme yapıldığında sayı doğrusunda aynı noktaya karşılık gelen kesirlere ne denir?',
    word: 'DENKKESİR',
    hint: '9 Harfli • 1/3 = 2/6 denkliği',
    color: '#ec4899'
  },
  {
    id: 'mat712-c6',
    question: 'Sayı doğrusunda pozitif ve negatif sayıları birbirinden ayıran 0 referans noktasına ne ad verilir?',
    word: 'BAŞLANGIÇ',
    hint: '9 Harfli • 0 referans noktası',
    color: '#06b6d4'
  }
];

// 8. MAT.7.1.2 Clues (Rasyonel Sayıları Karşılaştırma ve Sıralama)
const MAT_7_1_2_CLUES: WordClue[] = [
  {
    id: 'mat712-k1',
    question: 'Payları eşit pozitif kesirlerde bu değeri küçük olan kesir daha büyük dilimlere sahiptir ve daha büyüktür:',
    word: 'PAYDA',
    hint: '5 Harfli • Kesir çizgisinin altındaki sayı',
    color: '#8b5cf6'
  },
  {
    id: 'mat712-k2',
    question: '1/2 kesrini temsil eden ve büyük paydalı kesirleri kıyaslarken zihinsel kılavuz olarak kullanılan değer:',
    word: 'YARIM',
    hint: '5 Harfli • 1/2 referans noktası',
    color: '#06b6d4'
  },
  {
    id: 'mat712-k3',
    question: '1 tam değerine karşılık gelen ve eksik parça kıyaslamasında kullanılan temel büyüklük:',
    word: 'BÜTÜN',
    hint: '5 Harfli • 1 tam referansı',
    color: '#10b981'
  },
  {
    id: 'mat712-k4',
    question: 'Sayı doğrusunda sıfırın solunda kalan ve sıfıra yaklaştıkça değeri büyüyen sayılar:',
    word: 'NEGATİF',
    hint: '7 Harfli • Eksi (-) işaretli sayılar',
    color: '#f59e0b'
  },
  {
    id: 'mat712-k5',
    question: 'Rasyonel sayıları küçükten büyüğe (<) veya büyükten küçüğe (>) doğru ardışık dizme işlemi:',
    word: 'SIRALAMA',
    hint: '8 Harfli • Karşılaştırma dizilimi',
    color: '#ec4899'
  },
  {
    id: 'mat712-k6',
    question: 'Payda eşitlemek yerine 0, 1/2 veya 1 gibi bilinen sabit değerlere göre kıyaslama yapma yöntemi:',
    word: 'REFERANS',
    hint: '8 Harfli • Kılavuz dayanak noktası',
    color: '#3b82f6'
  }
];

// 9. MAT.7.1.3 Clues (Rasyonel Sayılarla Toplama ve Çıkarma İşlemleri)
const MAT_7_1_3_CLUES: WordClue[] = [
  {
    id: 'mat713-k1',
    question: 'Farklı paydalı rasyonel sayıları toplamak için kesrin hem payını hem paydasını aynı sayıyla çarpma işlemi:',
    word: 'GENİŞLETME',
    hint: '10 Harfli • Denk kesir elde etme',
    color: '#8b5cf6'
  },
  {
    id: 'mat713-k2',
    question: 'Rasyonel sayıları toplarken veya çıkarırken mutlaka eşitlenmesi gereken kesir çizgisi altındaki sayı:',
    word: 'PAYDA',
    hint: '5 Harfli • Kesrin altındaki sayı',
    color: '#06b6d4'
  },
  {
    id: 'mat713-k3',
    question: 'Bir rasyonel sayıyla toplandığında sonucu 0 yapan, o sayının zıt işaretlisi olan büyüklük:',
    word: 'TERS',
    hint: '4 Harfli • Ters eleman özelliği',
    color: '#10b981'
  },
  {
    id: 'mat713-k4',
    question: 'Rasyonel sayılarda toplama işleminde hangi sayıyla toplanırsa toplansın sonucu değiştirmeyen 0 elemanı:',
    word: 'ETKİSİZ',
    hint: '7 Harfli • Sıfır (0) elemanı',
    color: '#f59e0b'
  },
  {
    id: 'mat713-k5',
    question: 'Aynı birimdeki rasyonel parçaları bir araya getirme işlemi:',
    word: 'TOPLAMA',
    hint: '7 Harfli • Birleştirme işlemi',
    color: '#ec4899'
  },
  {
    id: 'mat713-k6',
    question: 'Eksilen sayıdan çıkan sayının ters işaretlisini ekleyerek yapılan işlem:',
    word: 'ÇIKARMA',
    hint: '7 Harfli • Fark bulma işlemi',
    color: '#ef4444'
  },
  {
    id: 'mat713-k7',
    question: 'Bulunan sonucun pay ve paydasını ortak bölenlerine bölerek en yalın hale getirme işlemi:',
    word: 'SADELEŞTİRME',
    hint: '12 Harfli • En sade biçim',
    color: '#3b82f6'
  }
];


const TURKISH_CHARS = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 'I', 'İ',
  'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U',
  'Ü', 'V', 'Y', 'Z'
];

interface CellPos {
  row: number;
  col: number;
}

interface PlacedWord {
  id: string;
  word: string;
  cells: CellPos[];
}

function generateWordGrid(clues: WordClue[], customSize?: number): { grid: string[][]; placed: PlacedWord[] } {
  const directions = [
    { dr: 0, dc: 1 },  // Yatay sağ
    { dr: 1, dc: 0 },  // Dikey aşağı
    { dr: 1, dc: 1 },  // Çapraz sağ-aşağı
    { dr: 0, dc: -1 }, // Yatay sol
    { dr: -1, dc: 0 }, // Dikey yukarı
    { dr: -1, dc: 1 }, // Çapraz sağ-yukarı
    { dr: 1, dc: -1 }  // Çapraz sol-aşağı
  ];

  // Calculate dynamic grid size: at least 12 and large enough for the longest word (+2 margin)
  const maxWordLen = Math.max(...clues.map((c) => c.word.length), 0);
  const size = customSize || Math.max(12, maxWordLen + 1);

  const sortedClues = [...clues].sort((a, b) => b.word.length - a.word.length);

  // 1. Randomized placement attempts (up to 120 attempts)
  for (let attempt = 0; attempt < 120; attempt++) {
    const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
    const placed: PlacedWord[] = [];
    let allPlaced = true;

    for (const clue of sortedClues) {
      const letters = Array.from(clue.word);
      const len = letters.length;
      let wordPlaced = false;

      const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);

      for (let tries = 0; tries < 250; tries++) {
        const dir = shuffledDirs[tries % shuffledDirs.length];
        const minR = dir.dr < 0 ? len - 1 : 0;
        const maxR = dir.dr > 0 ? size - len : size - 1;
        const minC = dir.dc < 0 ? len - 1 : 0;
        const maxC = dir.dc > 0 ? size - len : size - 1;

        if (minR > maxR || minC > maxC) continue;

        const r = Math.floor(Math.random() * (maxR - minR + 1)) + minR;
        const c = Math.floor(Math.random() * (maxC - minC + 1)) + minC;

        let canFit = true;
        const wordCells: CellPos[] = [];

        for (let i = 0; i < len; i++) {
          const currR = r + i * dir.dr;
          const currC = c + i * dir.dc;
          const currentCell = grid[currR][currC];
          if (currentCell !== '' && currentCell !== letters[i]) {
            canFit = false;
            break;
          }
          wordCells.push({ row: currR, col: currC });
        }

        if (canFit) {
          for (let i = 0; i < len; i++) {
            grid[wordCells[i].row][wordCells[i].col] = letters[i];
          }
          placed.push({ id: clue.id, word: clue.word, cells: wordCells });
          wordPlaced = true;
          break;
        }
      }

      if (!wordPlaced) {
        allPlaced = false;
        break;
      }
    }

    if (allPlaced && placed.length === clues.length) {
      // Fill blanks with random Turkish letters
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid[r][c] === '') {
            grid[r][c] = TURKISH_CHARS[Math.floor(Math.random() * TURKISH_CHARS.length)];
          }
        }
      }
      return { grid, placed };
    }
  }

  // 2. Guaranteed Deterministic Fallback:
  // Place every clue word in clean, non-conflicting dedicated rows/columns so 100% of words exist!
  const detGrid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
  const detPlaced: PlacedWord[] = [];

  sortedClues.forEach((clue, idx) => {
    const letters = Array.from(clue.word);
    const len = letters.length;
    // Alternate row and col placement to give variation
    if (idx % 2 === 0) {
      const row = Math.min((idx * 2), size - 1);
      const startCol = Math.max(0, Math.floor((size - len) / 2));
      const cells: CellPos[] = [];
      for (let i = 0; i < len; i++) {
        detGrid[row][startCol + i] = letters[i];
        cells.push({ row, col: startCol + i });
      }
      detPlaced.push({ id: clue.id, word: clue.word, cells });
    } else {
      const col = Math.min((idx * 2), size - 1);
      const startRow = Math.max(0, Math.floor((size - len) / 2));
      const cells: CellPos[] = [];
      for (let i = 0; i < len; i++) {
        detGrid[startRow + i][col] = letters[i];
        cells.push({ row: startRow + i, col });
      }
      detPlaced.push({ id: clue.id, word: clue.word, cells });
    }
  });

  // Fill empty spaces with random Turkish letters
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (detGrid[r][c] === '') {
        detGrid[r][c] = TURKISH_CHARS[Math.floor(Math.random() * TURKISH_CHARS.length)];
      }
    }
  }

  return { grid: detGrid, placed: detPlaced };
}

export function WordSearchGame() {
  const { playSound, addPoints, unlockBadge, selectedOutcome } = useApp();

  const id = selectedOutcome?.id || '';
  const code = selectedOutcome?.code || '';
  const title = (selectedOutcome?.title || '').toLowerCase();

  const isMat511 =
    id === 'MAT.5.1.1' ||
    code.includes('5.1.1') ||
    id.includes('5-1-1') ||
    title.includes('doğal sayılar') ||
    title.includes('basamak') ||
    title.includes('bölük');

  const isMat713 =
    !isMat511 && (
      id === 'MAT.7.1.3' ||
      code.includes('7.1.3') ||
      title.includes('toplama') ||
      title.includes('çıkarma')
    );

  const isMat712 =
    !isMat511 &&
    !isMat713 && (
      id === 'MAT.7.1.2' ||
      code.includes('7.1.2') ||
      title.includes('karşılaştırma') ||
      title.includes('sıralama')
    );

  const isMat711W2 =
    !isMat511 &&
    !isMat713 &&
    !isMat712 && (
      id === 'MAT.7.1.1-2' ||
      id === 'MAT.7.1.1.2' ||
      title.includes('derinleşme') ||
      title.includes('yoğunluk')
    );
  const isMat711 = !isMat511 && !isMat713 && !isMat712 && !isMat711W2 && (id === 'MAT.7.1.1' || code.includes('7.1.1') || title.includes('rasyonel'));
  const isMat611 = !isMat511 && (id === 'MAT.6.1.1' || code.includes('6.1.1') || title.includes('çarpanları ve katları'));
  const isMat612 = !isMat511 && (id === 'MAT.6.1.2' || code.includes('6.1.2') || title.includes('bölünebilme'));
  const isMat613 = !isMat511 && (id === 'MAT.6.1.3' || code.includes('6.1.3') || title.includes('asal'));
  const isMat614 = !isMat511 && (id === 'MAT.6.1.4' || code.includes('6.1.4') || title.includes('ortak kat') || title.includes('ortak bölen'));

  const isLinesAnglesTopic = !isMat511 && (id === 'MAT.5.3.4' || code.includes('5.3.4'));
  const isAngleTopic = !isMat511 && (id === 'MAT.5.3.3' || code.includes('5.3.3'));
  const isSelimiyeTopic = !isMat511 && (id === 'MAT.5.3.2' || code.includes('5.3.2'));

  const activeClues = isMat511
    ? MAT_5_1_1_CLUES
    : isMat713
    ? MAT_7_1_3_CLUES
    : isMat712
    ? MAT_7_1_2_CLUES
    : isMat711W2
    ? MAT_7_1_1_W2_CLUES
    : isMat711
    ? MAT_7_1_1_CLUES
    : isMat614
    ? MAT_6_1_4_CLUES
    : isMat613
    ? MAT_6_1_3_CLUES
    : isMat612
    ? MAT_6_1_2_CLUES
    : isMat611
    ? MAT_6_1_1_CLUES
    : isLinesAnglesTopic
    ? MAT_5_3_4_CLUES
    : isAngleTopic
    ? MAT_5_3_3_CLUES
    : isSelimiyeTopic
    ? MAT_5_3_2_CLUES
    : MAT_5_3_1_CLUES;

  const [gridMatrix, setGridMatrix] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [foundWordIds, setFoundWordIds] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<CellPos[]>([]);
  const [tapStart, setTapStart] = useState<CellPos | null>(null);
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [foundCellColors, setFoundCellColors] = useState<Record<string, string>>({});

  // Refs for bulletproof touch & mouse interaction on mobile / smart board
  const selectedCellsRef = useRef<CellPos[]>([]);
  useEffect(() => {
    selectedCellsRef.current = selectedCells;
  }, [selectedCells]);

  const dragStartRef = useRef<CellPos | null>(null);
  const isDraggingRef = useRef(false);
  const startCoordsRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedRef = useRef(false);
  const isTouchActiveRef = useRef(false);

  useEffect(() => {
    initRandomGrid();
  }, [selectedOutcome?.id, selectedOutcome?.code, activeClues]);

  // Global mouseup listener so dragging outside the grid doesn't get stuck
  useEffect(() => {
    const onGlobalMouseUp = () => {
      if (isDraggingRef.current && hasMovedRef.current) {
        const cells = selectedCellsRef.current;
        if (cells.length > 1) {
          const matched = checkSelectedWord(cells);
          if (!matched) {
            playSound('click');
            setTimeout(() => {
              setSelectedCells([]);
              selectedCellsRef.current = [];
            }, 300);
          } else {
            setSelectedCells([]);
            selectedCellsRef.current = [];
          }
        } else {
          setSelectedCells([]);
          selectedCellsRef.current = [];
        }
        setTapStart(null);
      }
      isDraggingRef.current = false;
      dragStartRef.current = null;
      startCoordsRef.current = null;
      hasMovedRef.current = false;
    };

    window.addEventListener('mouseup', onGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', onGlobalMouseUp);
    };
  }, [placedWords, foundWordIds, activeClues, gridMatrix]);

  const initRandomGrid = () => {
    const generated = generateWordGrid(activeClues);
    setGridMatrix(generated.grid);
    setPlacedWords(generated.placed);
    setFoundWordIds([]);
    setSelectedCells([]);
    selectedCellsRef.current = [];
    setTapStart(null);
    dragStartRef.current = null;
    isDraggingRef.current = false;
    hasMovedRef.current = false;
    setFoundCellColors({});
    setRevealedHints({});
  };

  const isCellSelected = (r: number, c: number) => {
    return selectedCells.some((cell) => cell.row === r && cell.col === c);
  };

  const isCellFound = (r: number, c: number) => {
    return foundCellColors[`${r},${c}`];
  };

  const checkSelectedWord = (cells: CellPos[]): boolean => {
    if (cells.length === 0) return false;
    const selectedWordLetters = cells.map((c) => gridMatrix[c.row]?.[c.col] || '').join('');
    const reverseSelectedWord = selectedWordLetters.split('').reverse().join('');

    const matchedPlaced = placedWords.find(
      (pw) =>
        (pw.word === selectedWordLetters || pw.word === reverseSelectedWord) &&
        !foundWordIds.includes(pw.id)
    );

    if (matchedPlaced) {
      playSound('success');
      addPoints(20);
      setFoundWordIds((prev) => [...prev, matchedPlaced.id]);

      const clue = activeClues.find((c) => c.id === matchedPlaced.id);
      const color = clue?.color || '#10b396';

      setFoundCellColors((prev) => {
        const next = { ...prev };
        matchedPlaced.cells.forEach((cell) => {
          next[`${cell.row},${cell.col}`] = color;
        });
        return next;
      });

      if (foundWordIds.length + 1 === activeClues.length) {
        unlockBadge('puzzle-pro');
        addPoints(50);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
      return true;
    }
    return false;
  };

  // Helper to extract cell position from client coordinates (works on all touch screens & whiteboards)
  const getCellFromCoords = (clientX: number, clientY: number): CellPos | null => {
    if (typeof document === 'undefined') return null;
    const el = document.elementFromPoint(clientX, clientY);
    const cellEl = el?.closest('[data-cell-pos]');
    if (!cellEl) return null;
    const r = Number(cellEl.getAttribute('data-row'));
    const c = Number(cellEl.getAttribute('data-col'));
    if (isNaN(r) || isNaN(c)) return null;
    return { row: r, col: c };
  };

  // Helper to calculate a straight line between two cells (horizontal, vertical, diagonal)
  const calculateLine = (start: CellPos, end: CellPos): CellPos[] | null => {
    const dr = end.row - start.row;
    const dc = end.col - start.col;
    if (dr === 0 && dc === 0) {
      return [start];
    }
    if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
      const stepR = dr === 0 ? 0 : dr > 0 ? 1 : -1;
      const stepC = dc === 0 ? 0 : dc > 0 ? 1 : -1;
      const length = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
      const line: CellPos[] = [];
      for (let i = 0; i < length; i++) {
        line.push({ row: start.row + i * stepR, col: start.col + i * stepC });
      }
      return line;
    }
    return null;
  };

  // Two-tap selection: tap first letter, then tap last letter (Akıllı Tahta / Touch Friendly)
  const handleCellTap = (r: number, c: number) => {
    if (!tapStart) {
      // First tap
      setTapStart({ row: r, col: c });
      setSelectedCells([{ row: r, col: c }]);
      selectedCellsRef.current = [{ row: r, col: c }];
      playSound('select');
    } else if (tapStart.row === r && tapStart.col === c) {
      // Tap same cell cancels
      setTapStart(null);
      setSelectedCells([]);
      selectedCellsRef.current = [];
      playSound('click');
    } else {
      // Second tap: try to connect
      const line = calculateLine(tapStart, { row: r, col: c });
      if (line) {
        setSelectedCells(line);
        selectedCellsRef.current = line;
        const matched = checkSelectedWord(line);
        if (!matched) {
          playSound('click');
          setTimeout(() => {
            setSelectedCells([]);
            selectedCellsRef.current = [];
          }, 350);
        } else {
          setTimeout(() => {
            setSelectedCells([]);
            selectedCellsRef.current = [];
          }, 200);
        }
        setTapStart(null);
      } else {
        // Not aligned, switch start to this cell
        setTapStart({ row: r, col: c });
        setSelectedCells([{ row: r, col: c }]);
        selectedCellsRef.current = [{ row: r, col: c }];
        playSound('select');
      }
    }
  };

  // TOUCH EVENT HANDLERS (for touchscreens, iPads, Android, Akıllı Tahta)
  const handleTouchStart = (e: React.TouchEvent) => {
    isTouchActiveRef.current = true;
    const touch = e.touches[0];
    if (!touch) return;
    const cell = getCellFromCoords(touch.clientX, touch.clientY);
    if (!cell) return;

    dragStartRef.current = cell;
    startCoordsRef.current = { x: touch.clientX, y: touch.clientY };
    isDraggingRef.current = true;
    hasMovedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !dragStartRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;

    if (startCoordsRef.current) {
      const dist = Math.hypot(touch.clientX - startCoordsRef.current.x, touch.clientY - startCoordsRef.current.y);
      if (dist > 8) {
        hasMovedRef.current = true;
      }
    }

    if (hasMovedRef.current) {
      // Prevent browser screen scrolling while dragging across letters
      if (e.cancelable) e.preventDefault();

      const currentCell = getCellFromCoords(touch.clientX, touch.clientY);
      if (currentCell) {
        const line = calculateLine(dragStartRef.current, currentCell);
        if (line) {
          setSelectedCells(line);
          selectedCellsRef.current = line;
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (hasMovedRef.current) {
      // Drag gesture ended
      const cells = selectedCellsRef.current;
      if (cells.length > 1) {
        const matched = checkSelectedWord(cells);
        if (!matched) {
          playSound('click');
          setTimeout(() => {
            setSelectedCells([]);
            selectedCellsRef.current = [];
          }, 300);
        } else {
          setSelectedCells([]);
          selectedCellsRef.current = [];
        }
      } else {
        setSelectedCells([]);
        selectedCellsRef.current = [];
      }
      setTapStart(null);
    } else if (dragStartRef.current) {
      // Discrete tap (no drag movement)
      handleCellTap(dragStartRef.current.row, dragStartRef.current.col);
    }

    dragStartRef.current = null;
    startCoordsRef.current = null;
    hasMovedRef.current = false;

    setTimeout(() => {
      isTouchActiveRef.current = false;
    }, 400);
  };

  // MOUSE EVENT HANDLERS (for desktop / laptop mouse)
  const handleMouseDown = (r: number, c: number, e: React.MouseEvent) => {
    if (isTouchActiveRef.current) return;
    if (e.button !== 0) return;

    dragStartRef.current = { row: r, col: c };
    startCoordsRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = true;
    hasMovedRef.current = false;
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isTouchActiveRef.current) return;
    if (!isDraggingRef.current || !dragStartRef.current) return;

    hasMovedRef.current = true;
    const line = calculateLine(dragStartRef.current, { row: r, col: c });
    if (line) {
      setSelectedCells(line);
      selectedCellsRef.current = line;
    }
  };

  const handleMouseUp = (r: number, c: number) => {
    if (isTouchActiveRef.current) return;
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (hasMovedRef.current) {
      const cells = selectedCellsRef.current;
      if (cells.length > 1) {
        const matched = checkSelectedWord(cells);
        if (!matched) {
          playSound('click');
          setTimeout(() => {
            setSelectedCells([]);
            selectedCellsRef.current = [];
          }, 300);
        } else {
          setSelectedCells([]);
          selectedCellsRef.current = [];
        }
      } else {
        setSelectedCells([]);
        selectedCellsRef.current = [];
      }
      setTapStart(null);
    } else {
      handleCellTap(r, c);
    }

    dragStartRef.current = null;
    startCoordsRef.current = null;
    hasMovedRef.current = false;
  };

  const toggleHint = (clueId: string) => {
    playSound('select');
    setRevealedHints((prev) => ({ ...prev, [clueId]: !prev[clueId] }));
  };

  const gridSize = gridMatrix.length || 12;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold uppercase">
            <Search className="w-3.5 h-3.5 text-blue-300" />
            <span>
              {isMat511 ? '5. Sınıf MAT.5.1.1 • Kelime Avı' : 'Matematiksel Kelime Avı Bulmacası'}
            </span>
          </div>
          <h3 className="text-xl font-black text-white">
            {isMat511
              ? 'Doğal Sayılar & Bölükleri Yakala!'
              : isMat713 || isMat712 || isMat711 || isMat711W2
              ? 'Gizli Rasyonel Sayı Kavramlarını Yakala!'
              : isMat611 || isMat612 || isMat613 || isMat614
              ? 'Gizli Sayı & Çarpan Kavramlarını Yakala!'
              : 'Gizli Geometrik Kavramları Yakala!'}
          </h3>
          <p className="text-xs text-blue-200 max-w-lg">
            Soruları oku, harf ızgarasında gizlenen doğru kavramı fareyle sürükleyerek veya sırayla ilk ve son harfe dokunarak seç!
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="text-right">
            <div className="text-2xl font-black text-yellow-300">
              {foundWordIds.length} / {activeClues.length}
            </div>
            <div className="text-[11px] text-blue-200">Kavram Bulundu</div>
          </div>
          <button
            onClick={initRandomGrid}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">Yeni Izgara</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: WORD SEARCH GRID */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-center overflow-x-auto">
          <div
            className="grid gap-1 sm:gap-1.5 select-none touch-none"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            {gridMatrix.map((row, r) =>
              row.map((letter, c) => {
                const selected = isCellSelected(r, c);
                const foundColor = isCellFound(r, c);
                const isTapStartCell = tapStart?.row === r && tapStart?.col === c && selectedCells.length === 1;

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    data-cell-pos="true"
                    data-row={r}
                    data-col={c}
                    onMouseDown={(e) => handleMouseDown(r, c, e)}
                    onMouseEnter={() => handleMouseEnter(r, c)}
                    onMouseUp={() => handleMouseUp(r, c)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-9.5 lg:h-9.5 rounded-xl font-black text-xs sm:text-xs lg:text-sm font-mono flex items-center justify-center transition-all cursor-pointer touch-manipulation select-none ${
                      isTapStartCell
                        ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg ring-4 ring-amber-400/70 z-20 animate-pulse'
                        : selected
                        ? 'bg-amber-400 text-slate-950 scale-105 shadow-md ring-2 ring-amber-500 z-10'
                        : foundColor
                        ? 'text-white font-black shadow-xs scale-102'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95'
                    }`}
                    style={foundColor && !selected ? { backgroundColor: foundColor } : {}}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>

          {/* Interactive Touch / Smart Board Helper Banner */}
          <div className="w-full max-w-md">
            {tapStart ? (
              <div className="mt-4 px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                  <span>
                    1. harf seçildi (<strong>{gridMatrix[tapStart.row]?.[tapStart.col]}</strong>). Şimdi kelimenin <strong>son harfine</strong> dokunun veya sürükleyin!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTapStart(null);
                    setSelectedCells([]);
                    playSound('click');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 text-[11px] font-bold cursor-pointer transition-colors shrink-0"
                >
                  İptal
                </button>
              </div>
            ) : (
              <div className="mt-4 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] sm:text-xs flex items-center justify-between text-center sm:text-left">
                <span>💡 <strong>Akıllı Tahta & Mobil:</strong> Parmağınızı kaydırarak seçebilir ya da önce ilk, sonra son harfe dokunabilirsiniz.</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: CLUES / QUESTIONS LIST */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Sorular ve İpuçları</span>
              <span className="text-teal-600 font-bold">{foundWordIds.length}/{activeClues.length} Tamamlandı</span>
            </h4>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {activeClues.map((clue, idx) => {
                const isFound = foundWordIds.includes(clue.id);
                const isHintOpen = revealedHints[clue.id];

                return (
                  <div
                    key={clue.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isFound
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="text-xs font-black flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                            style={{ backgroundColor: clue.color }}
                          >
                            {idx + 1}
                          </span>
                          <span><MathText text={clue.question} /></span>
                        </div>

                        {/* Hint box */}
                        {isHintOpen && (
                          <div className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-1 rounded-md border border-amber-300 animate-in fade-in">
                            💡 İpucu: <MathText text={clue.hint} />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {isFound ? (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white font-mono font-black text-[11px]">
                            {clue.word}
                          </span>
                        ) : (
                          <button
                            onClick={() => toggleHint(clue.id)}
                            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
                            title="İpucu Göster"
                          >
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
