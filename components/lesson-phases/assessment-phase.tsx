'use client';

import React, { useState, useEffect } from 'react';
import { AssessmentPhaseData, AssessmentQuestion } from '@/types';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import { generateTestVariant } from '@/lib/question-variation-engine';
import { saveJournalEntry } from '@/lib/journal-store';
import { useAuth } from '@/lib/auth-store';
import { SelfAssessmentRubricComponent } from '@/components/lesson-phases/self-assessment-rubric';
import { ActivitySheetView } from '@/components/lesson-phases/activity-sheet-view';
import { BoardStudentWidget } from '@/components/board/board-student-widget';
import {
  getStoredActiveBoardStudent,
  clearActiveBoardStudent,
  saveBoardParticipation
} from '@/lib/board-participation-store';
import {
  FileCheck2,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  EyeOff,
  RotateCcw,
  PlusCircle,
  Trophy,
  Award,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Zap,
  BookCheck,
  Check,
  ClipboardCheck,
  BookOpen,
  Ruler,
  Layers,
  Download,
  Printer
} from 'lucide-react';
import { MathText } from '@/components/ui/math-fraction';

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
    selectedOutcome
  } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  const [activeAssessmentTab, setActiveAssessmentTab] = useState<'test' | 'worksheet' | 'rubric' | 'journal'>('test');
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(data.questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [isDynamicTest, setIsDynamicTest] = useState(false);

  // Learning Journal state
  const [journalText, setJournalText] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  // Sync questions when data changes
  useEffect(() => {
    setQuestions(data.questions);
    setSelectedAnswers({});
    setSubmitted({});
    setIsTestFinished(false);
    setCurrentQuestionIndex(0);
    setIsDynamicTest(false);
    setJournalSaved(false);
  }, [data.questions]);

  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  const handleSaveJournal = () => {
    if (!journalText.trim()) return;
    playSound('success');
    unlockBadge('maarif-genius');
    addPoints(30);

    const activeBoardStu = getStoredActiveBoardStudent();
    if (activeBoardStu) {
      awardPointsToStudent(activeBoardStu.id, 30);
      saveBoardParticipation({
        studentId: activeBoardStu.id,
        studentName: activeBoardStu.name,
        studentNumber: activeBoardStu.studentNumber,
        classSection: activeBoardStu.classSection,
        school: activeBoardStu.school,
        teacherId: currentUser?.id,
        teacherName: currentUser?.name,
        activityType: 'journal',
        activityTitle: 'Öğrenme Günlüğü & Yansıtma',
        outcomeCode: selectedOutcome?.code || 'MAT',
        xpEarned: 30
      });
      clearActiveBoardStudent();
    }

    saveJournalEntry({
      studentId: currentUser?.id || 'stu-curr',
      studentName: currentUser?.name || 'Öğrenci',
      studentNumber: (currentUser as any)?.studentNumber || '101',
      gradeLevel: selectedOutcome?.gradeId === 'grade-6' ? 6 : 5,
      classSection: (currentUser as any)?.classSection || '5-A',
      school: (currentUser as any)?.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
      outcomeId: selectedOutcome?.id || data.title,
      outcomeCode: selectedOutcome?.code || 'MAT',
      outcomeTitle: selectedOutcome?.title || data.title,
      prompt: data.reflectionPrompt || 'Bugün öğrendiğim en şaşırtıcı özellik ve çıkarım şuydu:',
      studentReflection: journalText.trim()
    });
    setJournalSaved(true);
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleResetCurrentTest = () => {
    playSound('clear');
    setSelectedAnswers({});
    setSubmitted({});
    setCurrentQuestionIndex(0);
    setIsTestFinished(false);
  };

  const handleGenerateNewTestVariant = () => {
    playSound('success');
    const newVariants = generateTestVariant(data.questions);
    setQuestions(newVariants);
    setSelectedAnswers({});
    setSubmitted({});
    setCurrentQuestionIndex(0);
    setIsTestFinished(false);
    setIsDynamicTest(true);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.3 } });
    } catch (e) {}
  };

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
    const scorePct = Math.round((correctCount / questions.length) * 100);

    const activeBoardStu = getStoredActiveBoardStudent();
    if (activeBoardStu) {
      const earnedPoints = Math.max(30, Math.round((scorePct / 100) * 100));
      awardPointsToStudent(activeBoardStu.id, earnedPoints);
      saveBoardParticipation({
        studentId: activeBoardStu.id,
        studentName: activeBoardStu.name,
        studentNumber: activeBoardStu.studentNumber,
        classSection: activeBoardStu.classSection,
        school: activeBoardStu.school,
        teacherId: currentUser?.id,
        teacherName: currentUser?.name,
        activityType: 'test',
        activityTitle: 'Kazanım Değerlendirme Testi',
        outcomeCode: selectedOutcome?.code || 'MAT',
        score: scorePct,
        maxScore: 100,
        xpEarned: earnedPoints
      });
      clearActiveBoardStudent();
    }

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

        {activeAssessmentTab === 'test' && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Teacher Show Answers Toggle */}
            {role === 'teacher' && (
              <button
                onClick={() => {
                  setShowAnswers(!showAnswers);
                  playSound('click');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  showAnswers
                    ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showAnswers ? 'Cevapları Gizle' : 'Cevap Anahtarı'}</span>
              </button>
            )}

            {/* YENİLE: Oklu çember butonu - Mevcut testi aynı sorularla baştan başlatır */}
            <button
              onClick={handleResetCurrentTest}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Testi Aynı Sorularla Baştan Başlat"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
              <span>Yenile</span>
            </button>

            {/* YENİ TEST: Çember içinde + butonu - Aynı testi yeni sayılarla dinamik üretir */}
            <button
              onClick={handleGenerateNewTestVariant}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-black shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Aynı Kazanımda Yeni Sayılarla Yeni Bir Test Oluştur"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yeni Test</span>
            </button>
          </div>
        )}
      </div>

      {/* Teacher Smart Board Student Delegation Widget */}
      <BoardStudentWidget activityTitle="Kazanım Değerlendirmesi" />

      {/* Mode Navigation Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-1.5">
        {/* Tab 1: Kazanım Testi */}
        <button
          onClick={() => {
            playSound('click');
            setActiveAssessmentTab('test');
          }}
          className={`flex-1 min-w-[150px] py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeAssessmentTab === 'test'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>1. Kazanım Testi</span>
        </button>

        {/* Tab 2: Etkinlik Kağıdı (Öz Değerlendirme Öncesi) */}
        <button
          onClick={() => {
            playSound('click');
            setActiveAssessmentTab('worksheet');
          }}
          className={`flex-1 min-w-[150px] py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeAssessmentTab === 'worksheet'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>2. Etkinlik Kağıdı</span>
        </button>

        {/* Tab 3: Öz Değerlendirme Formu (Rubrik) */}
        <button
          onClick={() => {
            playSound('click');
            setActiveAssessmentTab('rubric');
          }}
          className={`flex-1 min-w-[150px] py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeAssessmentTab === 'rubric'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>3. Öz Değerlendirme (Rubrik)</span>
        </button>

        {/* Tab 4: Öğrenme Günlüğü & Yansıtma */}
        <button
          onClick={() => {
            playSound('click');
            setActiveAssessmentTab('journal');
          }}
          className={`flex-1 min-w-[150px] py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeAssessmentTab === 'journal'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>4. Öğrenme Günlüğü</span>
        </button>
      </div>

      {/* TAB 2: ETKİNLİK KAĞIDI (AŞAMALI İNŞA İSTASYONLARI) */}
      {activeAssessmentTab === 'worksheet' && (
        <ActivitySheetView
          outcomeCode={selectedOutcome?.code || 'MAT.5.3.1'}
          outcomeTitle={selectedOutcome?.title}
          onGoToRubric={() => {
            playSound('click');
            setActiveAssessmentTab('rubric');
          }}
        />
      )}

      {/* TAB 3: SELF ASSESSMENT RUBRIC FORM */}
      {activeAssessmentTab === 'rubric' && (
        <SelfAssessmentRubricComponent
          outcomeId={selectedOutcome?.id}
          outcomeTitle={selectedOutcome?.title}
          outcomeCode={selectedOutcome?.code}
        />
      )}

      {/* TAB 3: LEARNING JOURNAL & REFLECTION */}
      {activeAssessmentTab === 'journal' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-black text-teal-900 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Öğrenme Günlüğü & Yansıtma (SDB1.3: Öz Yansıtma)</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">
              Bugünkü Dersten Ne Öğrendim?
            </h3>
            <p className="text-xs text-slate-500">
              Ders sonunda kendi çıkarımlarınızı ve en çok dikkatinizi çeken matematiksel kuralı yazınız.
            </p>
          </div>

          <div className="bg-teal-50/70 p-5 rounded-2xl border border-teal-200 space-y-3">
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              "{data.reflectionPrompt || 'Bugün öğrendiğim en şaşırtıcı özellik ve çıkarım şuydu:'}"
            </p>
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Örnek: Açının kollarının uzatılmasının açıyı kesinlikle büyütmediğini ve iletkiyi doğru yönden okumanın önemini keşfettim..."
              rows={4}
              className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs sm:text-sm text-slate-800 bg-white shadow-xs resize-none"
            />
            {journalSaved && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Öğrenme Günlüğünüz başarıyla kaydedildi ve öğretmeninizin paneline iletildi! (+30 XP)</span>
              </div>
            )}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <span className="text-[11px] text-slate-500 font-medium">
                💡 Bu cümle öğrenci gelişim panosuna kaydedilir ve öğretmeniniz tarafından incelenir.
              </span>
              <button
                onClick={handleSaveJournal}
                disabled={!journalText.trim()}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>{journalSaved ? 'Güncellendi ✓' : 'Günlüğü Kaydet (+30 XP)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: 8 BLOOM QUESTIONS TEST */}
      {activeAssessmentTab === 'test' && (
        <>
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

            <div className="flex items-center gap-2">
              {isDynamicTest && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dinamik Sayılar</span>
                </span>
              )}
              {currentQuestion.bloomLevel && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  🎯 {currentQuestion.bloomLevel}
                </span>
              )}
            </div>
          </div>

          {/* Question Text */}
          <div className="text-lg sm:text-xl font-black text-slate-900 leading-relaxed">
            <MathText text={currentQuestion.questionText} />
          </div>

          {/* Options Grid (Large touch friendly cards for smart board) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = currentAnswer === optIdx;
              const isThisCorrect = optIdx === currentQuestion.correctOptionIndex;
              const showAsCorrect = (showAnswers && isThisCorrect) || (isCurrentAnswered && isThisCorrect);
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
                  <span className="font-bold"><MathText text={option} /></span>
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
              <p className="leading-relaxed font-medium"><MathText text={currentQuestion.explanation} /></p>
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
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Örnek: Doğru parçasının iki ucunun kapalı olması sayesinde boyunun ölçülebildiğini, fener ışığının ise tek yönde sonsuza uzayan bir ışın olduğunu keşfettim..."
                rows={3}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs sm:text-sm text-slate-800 bg-white shadow-xs resize-none"
              />

              {journalSaved && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Öğrenme Günlüğünüz başarıyla kaydedildi ve öğretmeninizin paneline iletildi! (+30 XP)</span>
                </div>
              )}

              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] text-slate-500 font-medium">
                  💡 Bu cümle sınıfın öğrenme panosuna ve öğretmeninizin değerlendirme paneline yansıtılacaktır.
                </span>
                <button
                  onClick={handleSaveJournal}
                  disabled={!journalText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>{journalSaved ? 'Güncellendi ✓' : 'Günlüğü Kaydet (+30 XP)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Next Step Call To Action: Fill Self Assessment Rubric Form */}
          <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-teal-400/40 p-6 rounded-3xl text-teal-950 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider">
                <ClipboardCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>Sıradaki Maarif Adımı</span>
              </div>
              <h4 className="text-base font-black text-slate-900">
                Öğrenci Öz Değerlendirme Formu'nu Doldur
              </h4>
              <p className="text-xs text-slate-600 max-w-md">
                Kazanım hedeflerinizi 4 kademeli dereceli rubrik üzerinden değerlendirin ve ekstra +50 XP kazanın!
              </p>
            </div>
            <button
              onClick={() => {
                playSound('select');
                setActiveAssessmentTab('rubric');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Öz Değerlendirmeye Geç ➔</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                playSound('click');
                setIsTestFinished(false);
                setCurrentQuestionIndex(0);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Soruları Tekrar İncele</span>
            </button>

            <button
              onClick={handleResetCurrentTest}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yenile (Aynı Test)</span>
            </button>

            <button
              onClick={handleGenerateNewTestVariant}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs shadow-md shadow-teal-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yeni Test (Farklı Sayılar)</span>
            </button>
          </div>

        </div>
      )}
        </>
      )}

    </div>
  );
}
