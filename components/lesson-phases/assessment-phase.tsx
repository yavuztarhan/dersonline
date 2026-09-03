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
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Zap,
  BookCheck,
  Check
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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [isTestFinished, setIsTestFinished] = useState(false);

  const questions = data.questions;
  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  const handleSelectOption = (question: AssessmentQuestion, optIndex: number) => {
    playSound('click');
    const isFirstTime = !submitted[question.id];
    
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
      if (isFirstTime) {
        addPoints(20);
      }
    } else {
      playSound('click');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      playSound('select');
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishTest();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      playSound('click');
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const finishTest = () => {
    setIsTestFinished(true);
    playSound('bell');

    const correctCount = questions.filter(
      (q) => selectedAnswers[q.id] === q.correctOptionIndex
    ).length;

    if (correctCount >= Math.ceil(questions.length * 0.7)) {
      unlockBadge('maarif-genius');
      addPoints(100);
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  const resetTest = () => {
    playSound('clear');
    setSelectedAnswers({});
    setSubmitted({});
    setCurrentQuestionIndex(0);
    setIsTestFinished(false);
  };

  const answeredCount = Object.keys(submitted).length;
  const correctCount = questions.filter(
    (q) => selectedAnswers[q.id] === q.correctOptionIndex
  ).length;
  const scorePercent = Math.round((correctCount / questions.length) * 100);

  const currentAnswer = selectedAnswers[currentQuestion.id];
  const isCurrentAnswered = submitted[currentQuestion.id];
  const isCurrentCorrect = currentAnswer === currentQuestion.correctOptionIndex;

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
          <p className="text-xs text-slate-500 mt-1">
            Soruları tek tek inceleyerek gerçek hayat modellerini analiz ediniz.
          </p>
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
              <span>{showAnswers ? 'Cevapları Gizle' : 'Cevap Anahtarı'}</span>
            </button>
          )}

          <button
            onClick={resetTest}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            title="Testi Baştan Başlat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QUESTION NAVIGATOR PILLS (1, 2, 3, 4, 5, 6, 7, 8) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-400 mr-2">Sorular:</span>
          {questions.map((q, idx) => {
            const isSelected = currentQuestionIndex === idx;
            const isAns = submitted[q.id];
            const isCor = selectedAnswers[q.id] === q.correctOptionIndex;

            let pillStyle = 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200';

            if (isSelected) {
              pillStyle = 'bg-teal-600 text-white font-black ring-2 ring-teal-400 shadow-md scale-105';
            } else if (isAns) {
              pillStyle = isCor
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                : 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  playSound('select');
                  setCurrentQuestionIndex(idx);
                  setIsTestFinished(false);
                }}
                className={`w-9 h-9 rounded-xl text-xs flex items-center justify-center border transition-all duration-150 ${pillStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-extrabold text-slate-600">
          Çözülen: <span className="text-teal-700">{answeredCount} / {questions.length}</span>
        </div>
      </div>

      {/* MAIN SINGLE-QUESTION CARD VIEW */}
      {!isTestFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in duration-200">
          
          {/* Question Header & Context Badges */}
          <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-2xl bg-teal-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                {currentQuestionIndex + 1}
              </span>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Soru {currentQuestionIndex + 1} / {questions.length}</div>
                {currentQuestion.context && (
                  <div className="text-xs font-extrabold text-teal-800">
                    🌍 {currentQuestion.context}
                  </div>
                )}
              </div>
            </div>

            {currentQuestion.bloomLevel && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                🎯 {currentQuestion.bloomLevel}
              </span>
            )}
          </div>

          {/* Question Text */}
          <div className="text-lg sm:text-xl font-black text-slate-900 leading-relaxed">
            {currentQuestion.questionText}
          </div>

          {/* Options Grid (Large touch friendly cards for smart board) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = currentAnswer === optIdx;
              const isThisCorrect = optIdx === currentQuestion.correctOptionIndex;
              const showAsCorrect = showAnswers || (isCurrentAnswered && isThisCorrect);
              const showAsWrong = isCurrentAnswered && isSelected && !isCurrentCorrect;

              let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-teal-300';

              if (showAsCorrect) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400 font-black shadow-xs';
              } else if (showAsWrong) {
                btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-400 font-black';
              } else if (isSelected) {
                btnStyle = 'bg-teal-50 border-teal-600 text-teal-950 ring-2 ring-teal-400 font-black';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQuestion, optIdx)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all duration-150 flex items-center justify-between active:scale-98 text-sm sm:text-base ${btnStyle}`}
                >
                  <span className="font-bold">{option}</span>
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

          {/* Pedagogical Explanation Box */}
          {(showAnswers || isCurrentAnswered) && (
            <div
              className={`p-5 rounded-2xl border text-xs sm:text-sm animate-in fade-in duration-200 space-y-1.5 ${
                isCurrentCorrect || showAnswers
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="font-extrabold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Çözüm & Pedagojik Açıklama:</span>
              </div>
              <p className="leading-relaxed font-medium">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Bottom Navigation Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Önceki Soru</span>
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={finishTest}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <BookCheck className="w-4 h-4" />
                <span>Testi Tamamla & Sonuçları Gör</span>
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Sonraki Soru</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* TEST FINISHED SCORECARD VIEW */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in duration-300">
          
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-4xl mx-auto shadow-lg">
            🏆
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              Değerlendirme Testini Tamamladınız!
            </h3>
            <p className="text-sm text-slate-500">
              Türkiye Yüzyılı Maarif Modeli Temel Geometri kazanımını başarıyla değerlendirdiniz.
            </p>
          </div>

          {/* Score Stats Grid */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl font-black text-teal-600">{correctCount} / {questions.length}</div>
              <div className="text-xs text-slate-500 font-bold mt-0.5">Doğru Sayısı</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl font-black text-indigo-600">%{scorePercent}</div>
              <div className="text-xs text-slate-500 font-bold mt-0.5">Başarı Oranı</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl font-black text-amber-600">+{correctCount * 20} XP</div>
              <div className="text-xs text-slate-500 font-bold mt-0.5">Kazanılan Puan</div>
            </div>
          </div>

          {/* SDB1.3: Digital Reflection Journal / Exit Ticket */}
          <div className="bg-gradient-to-tr from-teal-50 to-indigo-50/50 p-6 rounded-3xl border-2 border-teal-200/80 text-left space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-black text-teal-900 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Öğrenme Günlüğü & Yansıtma (SDB1.3: Öz Yansıtma)</span>
              </div>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-100/80 px-2.5 py-0.5 rounded-full">
                Ders Çıkış Bileti (Exit Ticket)
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-800">
              "{data.reflectionPrompt || 'Bugün öğrendiğim en şaşırtıcı geometrik özellik ve çıkarım şuydu:'}"
            </p>

            <div className="space-y-3">
              <textarea
                placeholder="Örnek: Doğru parçasının iki ucunun kapalı olması sayesinde boyunun ölçülebildiğini, fener ışığının ise tek yönde sonsuza uzayan bir ışın olduğunu keşfettim..."
                rows={3}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs sm:text-sm text-slate-800 bg-white shadow-xs resize-none"
              />

              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] text-slate-500 font-medium">
                  💡 Bu cümle sınıfın öğrenme panosuna ve öğrenci karnesine yansıtılacaktır.
                </span>
                <button
                  onClick={() => {
                    playSound('success');
                    unlockBadge('maarif-genius');
                    addPoints(30);
                    try {
                      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                    } catch (e) {}
                  }}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Award className="w-4 h-4" />
                  <span>Günlüğü Kaydet (+30 XP)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                playSound('click');
                setIsTestFinished(false);
                setCurrentQuestionIndex(0);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Soruları Tekrar İncele</span>
            </button>

            <button
              onClick={resetTest}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Testi Baştan Çöz</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
