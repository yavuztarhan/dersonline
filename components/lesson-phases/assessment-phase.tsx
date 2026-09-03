'use client';

import React, { useState } from 'react';
import { AssessmentPhaseData, AssessmentQuestion } from '@/types';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  FileCheck2,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  EyeOff,
  RotateCcw,
  Trophy,
  Award,
  ChevronRight
} from 'lucide-react';

interface AssessmentPhaseProps {
  data: AssessmentPhaseData;
}

export function AssessmentPhase({ data }: AssessmentPhaseProps) {
  const {
    role,
    showAnswers,
    setShowAnswers,
    playSound,
    unlockBadge,
    addPoints,
  } = useApp();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleSelectOption = (question: AssessmentQuestion, optIndex: number) => {
    playSound('click');
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: optIndex,
    }));
    setSubmitted((prev) => ({
      ...prev,
      [question.id]: true,
    }));

    if (optIndex === question.correctOptionIndex) {
      playSound('success');
      addPoints(20);

      // Check if all answered correctly
      const nextAnswers = { ...selectedAnswers, [question.id]: optIndex };
      const allCorrect = data.questions.every(
        (q) => nextAnswers[q.id] === q.correctOptionIndex
      );

      if (allCorrect) {
        unlockBadge('maarif-genius');
        addPoints(50);
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    } else {
      playSound('click');
    }
  };

  const resetTest = () => {
    playSound('clear');
    setSelectedAnswers({});
    setSubmitted({});
  };

  const answeredCount = Object.keys(submitted).length;
  const correctCount = data.questions.filter(
    (q) => selectedAnswers[q.id] === q.correctOptionIndex
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
            <span>4. Aşama: Süreç ve Kazanım Değerlendirmesi</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800">{data.title}</h2>
          <p className="text-xs text-slate-500 mt-1">{data.instructions}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Teacher Show Answers Toggle */}
          {role === 'teacher' && (
            <button
              onClick={() => {
                setShowAnswers(!showAnswers);
                playSound('click');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                showAnswers
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showAnswers ? 'Cevapları Gizle' : 'Cevap Anahtarını Aç'}</span>
            </button>
          )}

          <button
            onClick={resetTest}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            title="Testi Sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between text-xs font-bold text-slate-600">
        <div>
          İlerleme: {answeredCount} / {data.questions.length} Soru Çözüldü
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 font-extrabold">{correctCount} Doğru</span>
          <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
              style={{
                width: `${(answeredCount / data.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {data.questions.map((question, qIdx) => {
          const userAnswer = selectedAnswers[question.id];
          const isAnswered = submitted[question.id];
          const isCorrect = userAnswer === question.correctOptionIndex;

          return (
            <div
              key={question.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5"
            >
              {/* Question Header & Bloom Tag */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center">
                    {qIdx + 1}
                  </span>
                  {question.context && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                      {question.context}
                    </span>
                  )}
                </div>

                {question.bloomLevel && (
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    🎯 {question.bloomLevel}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {question.questionText}
              </div>

              {/* Options Grid (Large Touch Targets for Smart Board) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((option, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  const isThisCorrect = optIdx === question.correctOptionIndex;
                  const showAsCorrect = showAnswers || (isAnswered && isThisCorrect);
                  const showAsWrong = isAnswered && isSelected && !isCorrect;

                  let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-teal-300';

                  if (showAsCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400 font-bold';
                  } else if (showAsWrong) {
                    btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-400 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-teal-50 border-teal-600 text-teal-950 ring-2 ring-teal-400 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(question, optIdx)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all duration-150 flex items-center justify-between active:scale-98 text-sm sm:text-base ${btnStyle}`}
                    >
                      <span className="font-semibold">{option}</span>
                      {showAsCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {showAsWrong && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {(showAnswers || isAnswered) && (
                <div
                  className={`p-4 rounded-2xl border text-xs sm:text-sm animate-in fade-in duration-200 space-y-1 ${
                    isCorrect || showAnswers
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="font-extrabold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Çözüm ve Pedagojik Açıklama:</span>
                  </div>
                  <p className="leading-relaxed">{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
