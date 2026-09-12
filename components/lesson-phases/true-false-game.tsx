'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  XCircle,
  Sparkles,
  RotateCcw,
  Zap,
  Award,
  ArrowRight
} from 'lucide-react';

interface TFQuestion {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

// 1. MAT.5.3.1 (Temel Çizimler)
const MAT_5_3_1_TF: TFQuestion[] = [
  {
    id: 'tf-1',
    statement: 'Bir doğrunun iki ucu da sonsuza kadar uzadığı için boyu cetvelle ölçülemez.',
    isTrue: true,
    explanation: 'Doğru iki yönde sınırsızdır. Sadece iki ucu kapalı olan Doğru Parçası ölçülebilir.'
  },
  {
    id: 'tf-2',
    statement: 'Işının hem başlangıç hem de bitiş noktası kapalıdır.',
    isTrue: false,
    explanation: 'Işının başlangıç noktası sabittir ancak diğer ucu tek yönde sonsuza gider ([AB>).'
  },
  {
    id: 'tf-3',
    statement: '[AB] sembolik gösterimi bir Doğru Parçasını ifade eder.',
    isTrue: true,
    explanation: 'Köşeli parantezler iki ucun da sınırlandırıldığını gösterir.'
  },
  {
    id: 'tf-4',
    statement: 'Noktanın alanı ve kalınlığı hesaplanabilir.',
    isTrue: false,
    explanation: 'Noktanın boyutu, eni, boyu veya yüksekliği yoktur; sadece konum belirtir.'
  },
  {
    id: 'tf-5',
    statement: 'Doğrunun her iki ucuna da yön ve sınırsızlığı belirtmek için ok çizilir.',
    isTrue: true,
    explanation: 'Çift yönlü ok, çizginin iki tarafa da kesintisiz uzadığını ifade eder.'
  }
];

// 2. MAT.5.3.2 (Temel Çizim Araçları ve Çıkarımlar)
const MAT_5_3_2_TF: TFQuestion[] = [
  {
    id: 'tf-mat2-1',
    statement: 'Ölçüsüz düz bir cetvel kullanılarak iki farklı noktadan yalnız ve yalnız 1 tane düz doğru çizilebilir.',
    isTrue: true,
    explanation: 'İki noktadan geçen yalnızca tek bir düz doğru vardır; bu iki noktadan 2. bir düz doğru geçirilemez.'
  },
  {
    id: 'tf-mat2-2',
    statement: 'Bir çemberin merkezinden çember üzerindeki noktalara çizilen tüm doğru parçalarının (yarıçap) uzunlukları birbirine eşittir.',
    isTrue: true,
    explanation: 'Pergel açıklığı sabit kaldığı için merkezden çember üzerindeki her noktaya olan mesafe eşit yarıçaptır (r).'
  },
  {
    id: 'tf-mat2-3',
    statement: 'Pergel açıklığı değiştirilmeden bir ışının başlangıç noktasından itibaren adımlayarak yan yana eşit parçalar kesilebilir.',
    isTrue: true,
    explanation: 'Pergel açıklığı sabit tutularak ışın üzerinde [AB] = [BC] = [CD] eşit doğru parçaları inşa edilebilir.'
  },
  {
    id: 'tf-mat2-4',
    statement: 'Bir doğruya dışındaki sabit bir noktadan gönye yardımıyla birden fazla farklı dikme çizilebilir.',
    isTrue: false,
    explanation: 'Bir doğruya dışındaki sabit bir noktadan YALNIZ BİR dikme indirilebilir.'
  },
  {
    id: 'tf-mat2-5',
    statement: 'Bir doğruya eşit uzaklıktaki dikmelerin uç noktaları birleştirildiğinde oluşan yeni doğru, ilk doğruya paraleldir (d1 // d2) ve asla kesişmez.',
    isTrue: true,
    explanation: 'Aralarındaki dik mesafe sabit kalan doğrular paraleldir; tren rayları gibi sonsuza uzatılsa bile kesişmezler.'
  }
];

// 3. MAT.5.3.3 (Açı Ölçme ve İletki)
const MAT_5_3_3_TF: TFQuestion[] = [
  {
    id: 'tf-ang-1',
    statement: 'Ölçüsü 89° olan bir açı Dar Açıdır.',
    isTrue: true,
    explanation: '0° ile 90° arasındaki tüm açılar Dar Açı olarak sınıflandırılır (89° < 90°).'
  },
  {
    id: 'tf-ang-2',
    statement: 'Bir açının kollarını cetvelle uzatırsak açının derecesi de büyür.',
    isTrue: false,
    explanation: 'Açının derecesi kolların boyuna değil, kollar arasındaki dönme açıklığına bağlıdır; kollar uzatılsa da derece kesinlikle değişmez.'
  },
  {
    id: 'tf-ang-3',
    statement: 'İletki (açıölçer) ile açı ölçülürken iletkinin merkezi açının köşe noktasına oturtulur.',
    isTrue: true,
    explanation: 'Kusursuz ölçüm için iletki merkezi açının köşesine, taban çizgisi ise bir koluna tam çakıştırılmalıdır.'
  },
  {
    id: 'tf-ang-4',
    statement: 'Saat tam 15:00 (3:00) iken akrep ve yelkovan arasındaki açı 90 derecelik Dik Açıdır.',
    isTrue: true,
    explanation: 'Akrep 3te, yelkovan 12dedir. Aradaki 3 saatlik fark 3 × 30° = 90°lik tam dik açı oluşturur.'
  },
  {
    id: 'tf-ang-5',
    statement: 'Ölçüsü 135° olan açı bir Dar Açıdır.',
    isTrue: false,
    explanation: '135° açısı 90°den büyük ve 180°den küçük olduğu için bir Geniş Açıdır (90° < 135° < 180°).'
  }
];

// 4. MAT.5.3.4 (Doğruların Durumları ve Açı Çıkarımları)
const MAT_5_3_4_TF: TFQuestion[] = [
  {
    id: 'tf-mat4-1',
    statement: 'Kesişen iki doğrunun oluşturduğu karşılıklı zıt yönlü ters açıların ölçüleri daima birbirine eşittir.',
    isTrue: true,
    explanation: 'Doğrular hangi açıyla kesişirse kesişsin, karşılıklı duran ters açıların ölçüleri kesinlikle eşittir (a = c, b = d).'
  },
  {
    id: 'tf-mat4-2',
    statement: 'Ölçüleri toplamı 90° olan iki açıya Bütünler Açılar denir.',
    isTrue: false,
    explanation: 'Ölçüleri toplamı 90° olan açılara TÜMLER açılar; 180° olanlara ise BÜTÜNLER açılar denir.'
  },
  {
    id: 'tf-mat4-3',
    statement: 'Bir doğru üzerinde yan yana duran ve ortak bir kolu olan komşu bütünler açıların toplamı daima 180°dir.',
    isTrue: true,
    explanation: 'Bir doğru üzerindeki komşu iki açı bir doğru açıyı tamamladığı için toplamları daima 180° eder.'
  },
  {
    id: 'tf-mat4-4',
    statement: 'Aynı düzlemde bulunan paralel iki doğru uzatıldığında ileride bir noktada kesişerek dar açı oluşturur.',
    isTrue: false,
    explanation: 'Paralel doğruların hiçbir ortak noktası yoktur; sonsuza uzatılsalar bile asla kesişmez ve açı oluşturmazlar.'
  },
  {
    id: 'tf-mat4-5',
    statement: 'Düzlemde iki veya daha fazla doğruyu farklı noktalarda kesen üçüncü bir doğruya kesen doğru denir.',
    isTrue: true,
    explanation: 'İki paralel doğruyu kesen üçüncü doğruya kesen denir ve paralel hatlar üzerinde yöndeş, ters ve eş açılar meydana getirir.'
  }
];

// 5. MAT.6.1.1 (6. Sınıf: Bir Doğal Sayının Çarpanları ve Katları)
const MAT_6_1_1_TF: TFQuestion[] = [
  {
    id: 'tf-mat6-1',
    statement: 'Her pozitif doğal sayının en küçük çarpanı 1, en büyük çarpanı ise sayının KENDİSİDİR.',
    isTrue: true,
    explanation: '1 bütün pozitif sayıları kalansız böler; bir sayının kendisinden daha büyük bir pozitif böleni olamaz.'
  },
  {
    id: 'tf-mat6-2',
    statement: 'Bir doğal sayının "çarpanı" ile "böleni" ifadeleri tamamen aynı anlama gelir.',
    isTrue: true,
    explanation: 'Bir sayıyı kalansız bölen sayılar ile o sayının çarpanları tamamen özdeş bir kümedir.'
  },
  {
    id: 'tf-mat6-3',
    statement: 'Bir doğal sayının pozitif katlarının sayısı sınırlıdır ve sayının büyüklüğüne göre bir yerde biter.',
    isTrue: false,
    explanation: 'Bir sayının çarpanları sonlu/sınırlıdır, ancak pozitif tam sayı katları (12, 24, 36...) sonsuza kadar devam eder.'
  },
  {
    id: 'tf-mat6-4',
    statement: '36 sayısı tam kare bir sayı olduğu için pozitif çarpan sayısı TEKTİR (9 adettir).',
    isTrue: true,
    explanation: 'Ortadaki 6 çarpanı kendisiyle eşleştiği için (6×6=36), 36\'nın çarpanları 9 adettir (tek sayıdır).'
  },
  {
    id: 'tf-mat6-5',
    statement: 'Bir doğal sayının en küçük pozitif tam sayı katı 0\'dır.',
    isTrue: false,
    explanation: 'Pozitif katlar 1 ile çarpılarak başlar (12×1=12). Dolayısıyla en küçük pozitif kat sayının KENDİSİDİR.'
  },
  {
    id: 'tf-mat6-6',
    statement: '6 × 8 = 48 eşitliğinde 48 sayısı hem 6\'nın hem 8\'in bir KATI, 6 ve 8 ise 48\'in bir ÇARPANIDIR.',
    isTrue: true,
    explanation: 'Çarpma işleminde çarpanlar parçaları, çarpım ise ortak katı oluşturur.'
  },
  {
    id: 'tf-mat6-7',
    statement: 'Büyük sayıların çarpan sayısı her zaman küçük sayılardan daha fazladır.',
    isTrue: false,
    explanation: 'Örneğin 24\'ün 8 çarpanı varken, 24\'ten daha büyük olan 25\'in sadece 3 çarpanı vardır (1, 5, 25).'
  }
];

// 6. MAT.6.1.2 (6. Sınıf: Bölünebilme Kriterleri)
const MAT_6_1_2_TF: TFQuestion[] = [
  {
    id: 'tf-mat62-1',
    statement: 'Birler basamağı çift (0, 2, 4, 6, 8) olan tüm doğal sayılar 2 ile kalansız bölünür.',
    isTrue: true,
    explanation: '2 ile kalansız bölünebilmede sadece sayının birler basamağının çift olup olmadığına bakılır.'
  },
  {
    id: 'tf-mat62-2',
    statement: 'Birler basamağı 3 olan her doğal sayı 3 ile kalansız bölünür.',
    isTrue: false,
    explanation: '3 ile bölünebilmede birler basamağına değil, tüm rakamların toplamına bakılır (örn: 13 ve 23 üçe bölünmez).'
  },
  {
    id: 'tf-mat62-3',
    statement: 'Rakamları toplamı 9 veya 9\'un katı olan tüm doğal sayılar 9 ile kalansız bölünür.',
    isTrue: true,
    explanation: 'Basamak çözümlemesinde yüzlükler ve onluklar 99 ve 9\'un katı olduğu için geriye sadece rakamlar toplamı kalır.'
  },
  {
    id: 'tf-mat62-4',
    statement: 'Yüzlükler 4\'e tam bölündüğü için, bir sayının 4\'e bölünüp bölünmediğini anlamak için sadece son iki basamağına bakılır.',
    isTrue: true,
    explanation: '100, 200, 300... sayıları 4\'e tam bölündüğünden sadece son iki basamağın 00 veya 4\'ün katı olması yeterlidir.'
  },
  {
    id: 'tf-mat62-5',
    statement: 'Hem 2 hem de 4 ile kalansız bölünebilen bir sayı daima 8 ile de tam bölünür.',
    isTrue: false,
    explanation: 'Örneğin 12 ve 20 sayıları hem 2\'ye hem 4\'e tam bölünür ancak 8\'e kalansız bölünemez.'
  },
  {
    id: 'tf-mat62-6',
    statement: 'Hem 2 ile (çift) hem de 3 ile (rakamlar toplamı 3k) bölünebilen tüm doğal sayılar 6 ile de tam bölünür.',
    isTrue: true,
    explanation: '6 sayısı 2 ve 3\'ün çarpımı olduğu için, her iki kuralı da sağlayan sayılar 6\'ya tam bölünür.'
  },
  {
    id: 'tf-mat62-7',
    statement: 'Bir sayının 10 ile bölümünden kalan daima o sayının birler basamağındaki rakama eşittir.',
    isTrue: true,
    explanation: 'Onluklar ve yüzlükler 10\'un katı olduğundan geriye kalan kısım daima birler basamağıdır.'
  }
];

// 7. MAT.6.1.3 (6. Sınıf: Asal Sayılar ve Asal Çarpanlar)
const MAT_6_1_3_TF: TFQuestion[] = [
  {
    id: 'tf-mat63-1',
    statement: '1 sayısı sadece 1 pozitif böleni olduğu için asal sayı DEĞİLDİR.',
    isTrue: true,
    explanation: 'Asal sayıların tanımı gereği 1 ve kendisi olmak üzere tam olarak 2 farklı pozitif böleni olmalıdır.'
  },
  {
    id: 'tf-mat63-2',
    statement: 'En küçük asal sayı 2\'dir ve 2 haricinde hiçbir çift asal sayı yoktur.',
    isTrue: true,
    explanation: '2\'den büyük tüm çift sayılar 2\'ye bölünebildiği için asal olamazlar. 2 yegâne çift asaldır.'
  },
  {
    id: 'tf-mat63-3',
    statement: 'Tüm tek doğal sayılar birer asal sayıdır.',
    isTrue: false,
    explanation: '9 (3×3), 15 (3×5), 21 (3×7), 25 (5×5), 27 (3×9) tek sayıdır ancak asal sayı değildir.'
  },
  {
    id: 'tf-mat63-4',
    statement: 'Eratosthenes Kalburu yöntemiyle 1 ile 100 arasında toplam 25 adet asal sayı bulunur.',
    isTrue: true,
    explanation: '1-100 arasında 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97 olmak üzere 25 asal vardır.'
  },
  {
    id: 'tf-mat63-5',
    statement: '72 sayısının asal çarpan algoritması (bölen listesi) ile üslü gösterimi 2³ · 3² şeklindedir.',
    isTrue: true,
    explanation: '72 = 8 × 9 = 2³ · 3² ve asal çarpanları {2, 3} kümesidir.'
  },
  {
    id: 'tf-mat63-6',
    statement: 'Asal çarpan ağacında en alt seviyedeki tüm yapraklar birer asal sayıdır.',
    isTrue: true,
    explanation: 'Bileşik sayılar asal sayılara ulaşana kadar dallandırılır ve en altta asal sayılar kalır.'
  },
  {
    id: 'tf-mat63-7',
    statement: 'İki basamaklı en büyük asal sayı 99\'dur.',
    isTrue: false,
    explanation: '99 sayısı 3 ve 9\'a tam bölünür. İki basamaklı en büyük asal sayı 97\'dir.'
  }
];

// 8. MAT.6.1.4 (6. Sınıf: Ortak Kat ve Ortak Bölen)
const MAT_6_1_4_TF: TFQuestion[] = [
  {
    id: 'tf-mat64-1',
    statement: 'İki doğal sayının ortak bölenleri, her iki sayıyı da aynı anda kalansız bölebilen sayılardır.',
    isTrue: true,
    explanation: 'Ortak bölenler her iki sayının bölen listesindeki kesişim elemanlarıdır.'
  },
  {
    id: 'tf-mat64-2',
    statement: 'Ortak böleni yalnızca 1 olan pozitif doğal sayılara "aralarında asal" sayılar denir.',
    isTrue: true,
    explanation: '1\'den başka hiçbir ortak böleni olmayan sayılar aralarında asaldır (örn: 8 ve 15).'
  },
  {
    id: 'tf-mat64-3',
    statement: 'Aralarında asal olan iki sayının her ikisi de tek tek asal sayı olmak ZORUNDADIR.',
    isTrue: false,
    explanation: '8 ve 9 asal değildir ancak 1\'den başka ortak böleni olmadığı için aralarında asaldır.'
  },
  {
    id: 'tf-mat64-4',
    statement: 'İki sayının ortak katları, en küçük ortak kattan başlayarak ritmik olarak sonsuza kadar devam eder.',
    isTrue: true,
    explanation: 'Örneğin 6 ve 8\'in ortak katları 24, 48, 72, 96... şeklinde sonsuza kadar devam eder.'
  },
  {
    id: 'tf-mat64-5',
    statement: 'Eşit aralıklı fidan dikme ve mama paketleme gibi bölüştürme problemlerinde ortak bölenler kullanılır.',
    isTrue: true,
    explanation: 'Bütünü eşit parçalara ayırma ve paylaştırma durumlarında ortak bölenlerden yararlanılır.'
  },
  {
    id: 'tf-mat64-6',
    statement: 'Periyodik otobüs seferleri ve nöbetleşme gibi çakışma durumlarında ortak katlar kullanılır.',
    isTrue: true,
    explanation: 'Zamanın ritmik ilerlediği ve aynı ana denk gelen sefer saatleri ortak katlarla çözülür.'
  },
  {
    id: 'tf-mat64-7',
    statement: 'Ardışık iki doğal sayı (örneğin 14 ve 15) daima aralarında asaldır.',
    isTrue: true,
    explanation: 'Ardışık sayıların farkı 1 olduğu için 1\'den büyük hiçbir ortak böleni olamaz; daima aralarında asaldırlar.'
  }
];

// 6. MAT.7.1.1 (Tam Sayılardan Rasyonel Sayılara)
const MAT_7_1_1_TF: TFQuestion[] = [
  {
    id: 'tf-mat71-1',
    statement: 'Her tam sayı, paydasına 1 yazılarak bir rasyonel sayı olarak ifade edilebilir (Z ⊂ Q).',
    isTrue: true,
    explanation: 'Doğru! Her a tam sayısı a = a/1 şeklinde rasyonel olarak yazılabilir (Gizli Payda Kuralı).'
  },
  {
    id: 'tf-mat71-2',
    statement: 'Paydası sıfır olan kesirli bir ifade (örneğin 5/0) sıfıra eşittir.',
    isTrue: false,
    explanation: 'Yanlış! Payda sıfır olamaz. 5/0 ifadesi sıfır değil, matematiksel olarak TANIMSIZDIR (0/5 = 0\'dır).'
  },
  {
    id: 'tf-mat71-3',
    statement: '-3/4 rasyonel sayısı sayı doğrusunda 0 ile +1 tam sayıları arasındadır.',
    isTrue: false,
    explanation: 'Yanlış! -3/4 negatiftir; sayı doğrusunda sıfırın solunda, yani 0 ile -1 tam sayıları arasındadır.'
  },
  {
    id: 'tf-mat71-4',
    statement: '-12/3 sayısı hem bir tam sayı (Z) hem de bir rasyonel sayıdır (Q).',
    isTrue: true,
    explanation: 'Doğru! -12/3 = -4 eder. -4 bir tam sayıdır ve aynı zamanda paydası 1 olan bir rasyonel sayıdır.'
  },
  {
    id: 'tf-mat71-5',
    statement: 'İki sayının başlangıç noktasına (0) olan uzaklıkları eşitse mutlak değerleri de eşittir (|-a| = |+a|).',
    isTrue: true,
    explanation: 'Doğru! Mutlak değer uzaklık belirtir. Yönü ne olursa olsun sıfıra uzaklık pozitiftir (örn: |-4| = |+4| = 4).'
  },
  {
    id: 'tf-mat71-6',
    statement: '-2 tam 1/3 rasyonel sayısı sayı doğrusunda -1 ile -2 tam sayıları arasındadır.',
    isTrue: false,
    explanation: 'Yanlış! -2 tam 1/3, sıfırdan sola doğru -2\'yi geçip -3\'e doğru ilerler; dolayısıyla -2 ile -3 arasındadır.'
  },
  {
    id: 'tf-mat71-7',
    statement: 'Doğal sayılar (N), tam sayıların (Z); tam sayılar da rasyonel sayıların (Q) bir alt kümesidir (N ⊂ Z ⊂ Q).',
    isTrue: true,
    explanation: 'Doğru! Sayı kümeleri içiçe genişler: Bütün doğal sayılar tam sayı, bütün tam sayılar da rasyonel sayıdır.'
  }
];

export function TrueFalseGame() {
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

  const questions = isMat711
    ? MAT_7_1_1_TF
    : isMat614
    ? MAT_6_1_4_TF
    : isMat613
    ? MAT_6_1_3_TF
    : isMat612
    ? MAT_6_1_2_TF
    : isMat611
    ? MAT_6_1_1_TF
    : isLinesAnglesTopic
    ? MAT_5_3_4_TF
    : isAngleTopic
    ? MAT_5_3_3_TF
    : isSelimiyeTopic
    ? MAT_5_3_2_TF
    : MAT_5_3_1_TF;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, boolean>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = questions[currentIndex] || questions[0];
  const isAnswered = userAnswers[currentQ?.id] !== undefined;

  const handleAnswer = (answer: boolean) => {
    if (isAnswered) return;
    const isCorrect = answer === currentQ.isTrue;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: answer }));

    if (isCorrect) {
      playSound('success');
      setScore((prev) => prev + 20);
      addPoints(20);
    } else {
      playSound('click');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      playSound('select');
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
      playSound('bell');
      if (score >= 80) {
        unlockBadge('puzzle-pro');
        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }
  };

  const resetGame = () => {
    playSound('clear');
    setCurrentIndex(0);
    setUserAnswers({});
    setShowResult(false);
    setScore(0);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-700 to-slate-900 rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-purple-200 text-xs font-bold uppercase">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>Hızlı Geometri Doğru / Yanlış Testi</span>
          </div>
          <h3 className="text-xl font-black text-white">Önermeleri Değerlendir</h3>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-yellow-300">{score} Puan</div>
          <div className="text-xs text-purple-200">Soru {currentIndex + 1} / {questions.length}</div>
        </div>
      </div>

      {!showResult ? (
        <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs space-y-6">
          
          {/* Statement */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-lg font-bold text-slate-800 text-center leading-relaxed">
            "{currentQ.statement}"
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(true)}
              disabled={isAnswered}
              className={`py-5 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all border-2 active:scale-98 ${
                isAnswered
                  ? currentQ.isTrue
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                    : userAnswers[currentQ.id] === true
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-500 hover:text-white hover:border-emerald-600 shadow-xs'
              }`}
            >
              <CheckCircle className="w-6 h-6" />
              <span>DOĞRU</span>
            </button>

            <button
              onClick={() => handleAnswer(false)}
              disabled={isAnswered}
              className={`py-5 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all border-2 active:scale-98 ${
                isAnswered
                  ? !currentQ.isTrue
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                    : userAnswers[currentQ.id] === false
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                  : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-500 hover:text-white hover:border-rose-600 shadow-xs'
              }`}
            >
              <XCircle className="w-6 h-6" />
              <span>YANLIŞ</span>
            </button>
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs sm:text-sm text-teal-950 space-y-1 animate-in fade-in">
              <div className="font-bold flex items-center gap-1.5 text-teal-900">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Pedagojik Gerekçe:</span>
              </div>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>{currentIndex === questions.length - 1 ? 'Sonuçları Gör' : 'Sonraki Soru'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs text-center space-y-5 animate-in zoom-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🏆
          </div>
          <h4 className="text-2xl font-black text-slate-900">Testi Tamamladın!</h4>
          <p className="text-slate-600 text-sm">
            Toplam <strong>{score} Puan</strong> topladın.
          </p>

          <button
            onClick={resetGame}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Oyna</span>
          </button>
        </div>
      )}

    </div>
  );
}
