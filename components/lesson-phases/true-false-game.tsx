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
    statement: 'Bir doğruya eşit uzaklıktaki dikmelerin uç noktaları birleştirildiğinde oluşan yeni doğru, ilk doğruya paraleldir (d1 ∥ d2) ve asla kesişmez.',
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
    statement: 'Düzlemde iki veya daha fazla doğruyu farklı noktalarda kesen üçüncü bir doğruya kesen (transversal) denir.',
    isTrue: true,
    explanation: 'İki paralel doğruyu kesen üçüncü doğruya kesen denir ve paralel hatlar üzerinde yöndeş, ters ve eş açılar meydana getirir.'
  }
];

export function TrueFalseGame() {
  const { playSound, addPoints, unlockBadge, selectedOutcome } = useApp();

  const isLinesAnglesTopic = selectedOutcome?.id === 'MAT.5.3.4' || selectedOutcome?.code?.includes('5.3.4');
  const isAngleTopic = selectedOutcome?.id === 'MAT.5.3.3' || selectedOutcome?.code?.includes('5.3.3');
  const isSelimiyeTopic = selectedOutcome?.id === 'MAT.5.3.2' || selectedOutcome?.code?.includes('5.3.2');

  const questions = isLinesAnglesTopic
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
