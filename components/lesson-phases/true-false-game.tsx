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

const TF_QUESTIONS: TFQuestion[] = [
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
    explanation: 'Işının başlangıç noktası sabittir ancak diğer ucu tek yönde sonsuza gider ([AB).'
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

export function TrueFalseGame() {
  const { playSound, addPoints, unlockBadge } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, boolean>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = TF_QUESTIONS[currentIndex];
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
    if (currentIndex < TF_QUESTIONS.length - 1) {
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
          <div className="text-xs text-purple-200">Soru {currentIndex + 1} / {TF_QUESTIONS.length}</div>
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
                <span>{currentIndex === TF_QUESTIONS.length - 1 ? 'Sonuçları Gör' : 'Sonraki Soru'}</span>
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
