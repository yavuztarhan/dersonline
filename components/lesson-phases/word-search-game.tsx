'use client';

import React, { useState, useEffect } from 'react';
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

interface WordClue {
  id: string;
  question: string;
  word: string;
  hint: string;
  color: string;
}

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

const TURKISH_CHARS = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 'I', 'İ',
  'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U',
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

const GRID_SIZE = 11;

function generateWordGrid(clues: WordClue[], size = GRID_SIZE): { grid: string[][]; placed: PlacedWord[] } {
  const directions = [
    { dr: 0, dc: 1 }, // Horizontal right
    { dr: 1, dc: 0 }, // Vertical down
    { dr: 1, dc: 1 }, // Diagonal down-right
    { dr: 0, dc: -1 }, // Horizontal left
    { dr: -1, dc: 0 } // Vertical up
  ];

  const sortedClues = [...clues].sort((a, b) => b.word.length - a.word.length);

  for (let attempt = 0; attempt < 50; attempt++) {
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

  const fallbackGrid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => TURKISH_CHARS[Math.floor(Math.random() * TURKISH_CHARS.length)])
  );
  return { grid: fallbackGrid, placed: [] };
}

export function WordSearchGame() {
  const { playSound, addPoints, unlockBadge, selectedOutcome } = useApp();

  const id = selectedOutcome?.id || '';
  const code = selectedOutcome?.code || '';
  const title = (selectedOutcome?.title || '').toLowerCase();

  const isMat711 = id === 'MAT.7.1.1' || code.includes('7.1.1') || title.includes('rasyonel');
  const isMat611 = id === 'MAT.6.1.1' || code.includes('6.1.1') || title.includes('çarpanları ve katları');
  const isMat612 = id === 'MAT.6.1.2' || code.includes('6.1.2') || title.includes('bölünebilme');
  const isMat613 = id === 'MAT.6.1.3' || code.includes('6.1.3') || title.includes('asal');
  const isMat614 = id === 'MAT.6.1.4' || code.includes('6.1.4') || title.includes('ortak kat') || title.includes('ortak bölen');

  const isLinesAnglesTopic = id === 'MAT.5.3.4' || code.includes('5.3.4');
  const isAngleTopic = id === 'MAT.5.3.3' || code.includes('5.3.3');
  const isSelimiyeTopic = id === 'MAT.5.3.2' || code.includes('5.3.2');

  const activeClues = isMat711
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
  const [isSelecting, setIsSelecting] = useState(false);
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [foundCellColors, setFoundCellColors] = useState<Record<string, string>>({});

  useEffect(() => {
    initRandomGrid();
  }, [selectedOutcome?.id]);

  const initRandomGrid = () => {
    const generated = generateWordGrid(activeClues, GRID_SIZE);
    setGridMatrix(generated.grid);
    setPlacedWords(generated.placed);
    setFoundWordIds([]);
    setSelectedCells([]);
    setFoundCellColors({});
    setRevealedHints({});
  };

  const isCellSelected = (r: number, c: number) => {
    return selectedCells.some((cell) => cell.row === r && cell.col === c);
  };

  const isCellFound = (r: number, c: number) => {
    return foundCellColors[`${r},${c}`];
  };

  const handleCellMouseDown = (r: number, c: number) => {
    setIsSelecting(true);
    setSelectedCells([{ row: r, col: c }]);
    playSound('select');
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (!isSelecting) return;
    const start = selectedCells[0];
    if (!start) return;

    const dr = r - start.row;
    const dc = c - start.col;
    const stepR = dr === 0 ? 0 : dr > 0 ? 1 : -1;
    const stepC = dc === 0 ? 0 : dc > 0 ? 1 : -1;

    if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
      const length = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
      const newSelection: CellPos[] = [];
      for (let i = 0; i < length; i++) {
        newSelection.push({ row: start.row + i * stepR, col: start.col + i * stepC });
      }
      setSelectedCells(newSelection);
    }
  };

  const handleCellMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);

    const selectedWordLetters = selectedCells.map((c) => gridMatrix[c.row]?.[c.col] || '').join('');
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
    } else {
      playSound('click');
    }

    setSelectedCells([]);
  };

  const toggleHint = (clueId: string) => {
    playSound('select');
    setRevealedHints((prev) => ({ ...prev, [clueId]: !prev[clueId] }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold uppercase">
            <Search className="w-3.5 h-3.5 text-blue-300" />
            <span>Matematiksel Kelime Avı Bulmacası</span>
          </div>
          <h3 className="text-xl font-black text-white">Gizli Geometrik Kavramları Yakala!</h3>
          <p className="text-xs text-blue-200 max-w-lg">
            Aşağıdaki soruları oku, harf ızgarasında gizlenen doğru kavramı fare veya dokunmatik ekranla sürükleyerek seç!
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
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">Yeni Izgara</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: WORD SEARCH GRID */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-center">
          <div
            className="grid gap-1.5 select-none touch-none"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            onMouseLeave={handleCellMouseUp}
          >
            {gridMatrix.map((row, r) =>
              row.map((letter, c) => {
                const selected = isCellSelected(r, c);
                const foundColor = isCellFound(r, c);

                return (
                  <button
                    key={`${r}-${c}`}
                    onMouseDown={() => handleCellMouseDown(r, c)}
                    onMouseEnter={() => handleCellMouseEnter(r, c)}
                    onMouseUp={handleCellMouseUp}
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl font-black text-xs sm:text-sm font-mono flex items-center justify-center transition-all ${
                      selected
                        ? 'bg-amber-400 text-slate-950 scale-110 shadow-md ring-2 ring-amber-500 z-10'
                        : foundColor
                        ? 'text-white font-black shadow-xs scale-102'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                    style={foundColor && !selected ? { backgroundColor: foundColor } : {}}
                  >
                    {letter}
                  </button>
                );
              })
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
                          <span>{clue.question}</span>
                        </div>

                        {/* Hint box */}
                        {isHintOpen && (
                          <div className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-1 rounded-md border border-amber-300 animate-in fade-in">
                            💡 İpucu: {clue.hint}
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
