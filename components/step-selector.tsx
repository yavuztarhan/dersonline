'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import {
  CURRICULUM_DATA,
  isSubjectMatchingBranch,
  isGradeMatchingStudent
} from '@/lib/curriculum-data';
import { Grade, Subject, Unit, Topic, Outcome } from '@/types';
import {
  GraduationCap,
  Calculator,
  Microscope,
  Shapes,
  Hash,
  Compass,
  Layers,
  Trophy,
  ChevronRight,
  Play,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Tv,
  FileCheck,
  Award,
  ArrowLeft,
  FileText,
  Download,
  ShieldCheck
} from 'lucide-react';
import { LessonPlanModal } from '@/components/lesson-plan-modal';

const ICON_MAP: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-8 h-8" />,
  Calculator: <Calculator className="w-8 h-8" />,
  Microscope: <Microscope className="w-8 h-8" />,
  Shapes: <Shapes className="w-8 h-8" />,
  Hash: <Hash className="w-8 h-8" />,
  Compass: <Compass className="w-8 h-8" />,
  Layers: <Layers className="w-8 h-8" />,
  Trophy: <Trophy className="w-8 h-8" />,
};

export function StepSelector() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [planModalOutcome, setPlanModalOutcome] = useState<Outcome | null>(null);

  const {
    role,
    playSound,
    selectedGrade,
    setSelectedGrade,
    selectedSubject,
    setSelectedSubject,
    selectedUnit,
    setSelectedUnit,
    selectedTopic,
    setSelectedTopic,
    selectedOutcome,
    setSelectedOutcome,
    resetSelection
  } = useApp();

  // Role details
  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';
  const isStudent = currentUser?.role === 'student';
  const teacherUser = isTeacher ? (currentUser as any) : null;
  const teacherBranch = teacherUser?.branch || 'Matematik';
  const studentUser = isStudent ? (currentUser as any) : null;
  const studentGradeLevel = studentUser?.gradeLevel || parseInt(studentUser?.classSection?.charAt(0), 10) || 5;

  // 1. Available Grades based on user profile and role
  const availableGrades = useMemo(() => {
    if (!currentUser || isAdmin) {
      return CURRICULUM_DATA;
    }

    if (isStudent) {
      const filtered = CURRICULUM_DATA.filter((g) => isGradeMatchingStudent(g, studentUser));
      return filtered.length > 0 ? filtered : CURRICULUM_DATA;
    }

    if (isTeacher) {
      const filtered = CURRICULUM_DATA.filter((g) =>
        g.subjects.some((s) => isSubjectMatchingBranch(s, teacherBranch))
      );
      return filtered.length > 0 ? filtered : CURRICULUM_DATA;
    }

    return CURRICULUM_DATA;
  }, [currentUser, isAdmin, isStudent, isTeacher, teacherBranch, studentUser]);

  // 2. Available Subjects for the currently selected grade
  const availableSubjectsForGrade = useMemo(() => {
    if (!selectedGrade) return [];
    if (!currentUser || isAdmin || !isTeacher) return selectedGrade.subjects;

    const filtered = selectedGrade.subjects.filter((s) => isSubjectMatchingBranch(s, teacherBranch));
    return filtered.length > 0 ? filtered : selectedGrade.subjects;
  }, [selectedGrade, currentUser, isAdmin, isTeacher, teacherBranch]);

  // 3. Teacher Auto-Selection:
  // When a teacher selects a grade, if only 1 subject matches their branch, automatically select it!
  useEffect(() => {
    if (isTeacher && selectedGrade) {
      const matching = availableSubjectsForGrade;
      if (matching.length === 1) {
        if (!selectedSubject || selectedSubject.id !== matching[0].id) {
          setSelectedSubject(matching[0]);
        }
      }
    }
  }, [isTeacher, selectedGrade, availableSubjectsForGrade, selectedSubject, setSelectedSubject]);

  // 4. Student Auto-Selection:
  // If a student only has 1 grade available and no grade is currently selected, auto-select it.
  useEffect(() => {
    if (isStudent && availableGrades.length === 1 && !selectedGrade) {
      setSelectedGrade(availableGrades[0]);
    }
  }, [isStudent, availableGrades, selectedGrade, setSelectedGrade]);

  // Current active step calculation:
  // 1: Grade, 2: Subject, 3: Unit, 4: Topic/Outcome, 5: Ready to launch
  let currentStep = 1;
  if (selectedGrade) currentStep = 2;
  if (selectedGrade && selectedSubject) currentStep = 3;
  if (selectedGrade && selectedSubject && selectedUnit) currentStep = 4;
  if (selectedGrade && selectedSubject && selectedUnit && selectedOutcome) currentStep = 5;

  const handleSelectGrade = (grade: Grade) => {
    playSound('select');
    setSelectedGrade(grade);
    setSelectedUnit(null);
    setSelectedTopic(null);
    setSelectedOutcome(null);

    // If teacher with 1 matching branch subject, auto-select subject immediately
    if (isTeacher) {
      const matching = grade.subjects.filter((s) => isSubjectMatchingBranch(s, teacherBranch));
      if (matching.length === 1) {
        setSelectedSubject(matching[0]);
        return;
      }
    }

    setSelectedSubject(null);
  };

  const handleSelectSubject = (subject: Subject) => {
    playSound('select');
    setSelectedSubject(subject);
    setSelectedUnit(null);
    setSelectedTopic(null);
    setSelectedOutcome(null);
  };

  const handleSelectUnit = (unit: Unit) => {
    playSound('select');
    setSelectedUnit(unit);
    setSelectedTopic(null);
    setSelectedOutcome(null);
  };

  const handleSelectOutcome = (topic: Topic, outcome: Outcome) => {
    playSound('select');
    setSelectedTopic(topic);
    setSelectedOutcome(outcome);
  };

  const handleLaunchLesson = () => {
    if (!selectedOutcome) return;
    playSound('success');
    router.push(`/lesson/${selectedOutcome.id}`);
  };

  // Check if highlight box matches user scope
  const showHighlightBox = useMemo(() => {
    if (isAdmin || !currentUser) return true;
    if (isStudent) return studentGradeLevel === 5;
    if (isTeacher) return isSubjectMatchingBranch({ id: 'mat-5', title: 'Matematik', code: 'MAT-5' } as Subject, teacherBranch);
    return true;
  }, [isAdmin, currentUser, isStudent, studentGradeLevel, isTeacher, teacherBranch]);

  return (
    <div className="w-full space-y-6">
      
      {/* Dynamic Breadcrumb Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            onClick={() => {
              playSound('click');
              resetSelection();
            }}
            className={`font-semibold flex items-center gap-1.5 transition-colors ${
              currentStep === 1
                ? 'text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200'
                : 'text-slate-600 hover:text-teal-600'
            }`}
          >
            <span>1. Sınıf Seçimi</span>
          </button>

          {selectedGrade && (
            <>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button
                onClick={() => {
                  playSound('click');
                  if (isTeacher || availableSubjectsForGrade.length <= 1) {
                    // Stay on grade units
                    setSelectedUnit(null);
                    setSelectedTopic(null);
                    setSelectedOutcome(null);
                  } else {
                    setSelectedSubject(null);
                    setSelectedUnit(null);
                    setSelectedTopic(null);
                    setSelectedOutcome(null);
                  }
                }}
                className={`font-semibold flex items-center gap-1.5 transition-colors ${
                  currentStep === 2 || (isTeacher && currentStep === 3)
                    ? 'text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200'
                    : 'text-slate-600 hover:text-teal-600'
                }`}
              >
                <span>2. {selectedGrade.title}</span>
              </button>
            </>
          )}

          {selectedSubject && !isTeacher && (
            <>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button
                onClick={() => {
                  playSound('click');
                  setSelectedUnit(null);
                  setSelectedTopic(null);
                  setSelectedOutcome(null);
                }}
                className={`font-semibold flex items-center gap-1.5 transition-colors ${
                  currentStep === 3
                    ? 'text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200'
                    : 'text-slate-600 hover:text-teal-600'
                }`}
              >
                <span>3. {selectedSubject.title}</span>
              </button>
            </>
          )}

          {selectedSubject && isTeacher && (
            <>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-teal-800 bg-teal-50/80 px-2.5 py-1 rounded-md border border-teal-200 text-xs flex items-center gap-1">
                <span>{selectedSubject.title}</span>
                <span className="text-[10px] text-teal-600 font-bold bg-teal-100 px-1.5 py-0.5 rounded">Branş</span>
              </span>
            </>
          )}

          {selectedUnit && (
            <>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button
                onClick={() => {
                  playSound('click');
                  setSelectedTopic(null);
                  setSelectedOutcome(null);
                }}
                className={`font-semibold flex items-center gap-1.5 transition-colors ${
                  currentStep === 4
                    ? 'text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200'
                    : 'text-slate-600 hover:text-teal-600'
                }`}
              >
                <span>{isTeacher ? '3. ' : '4. '}{selectedUnit.title.split(':')[0]}</span>
              </button>
            </>
          )}

          {selectedOutcome && (
            <>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-teal-800 bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                {selectedOutcome.code}
              </span>
            </>
          )}
        </div>
      </div>

      {/* STEP 1: GRADE SELECTION */}
      {currentStep === 1 && (
        <div className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {availableGrades.map((grade) => {
              const matchingSubjects = isTeacher
                ? grade.subjects.filter((s) => isSubjectMatchingBranch(s, teacherBranch))
                : grade.subjects;

              return (
                <button
                  key={grade.id}
                  onClick={() => handleSelectGrade(grade)}
                  className="group relative text-left bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-200 active:scale-98 flex flex-col justify-between min-h-[220px]"
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${grade.color} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                      {ICON_MAP[grade.icon] || <GraduationCap className="w-7 h-7" />}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {grade.title}
                    </h3>
                    <p className="text-xs font-medium text-teal-600 mb-2">
                      {grade.subtitle}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {grade.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-teal-600">
                    <span>
                      {isTeacher
                        ? `${matchingSubjects.length} Branş Dersi (${matchingSubjects.map((s) => s.title).join(', ')})`
                        : `${grade.subjects.length} Ders Mevcut`}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-teal-500 group-hover:text-white flex items-center justify-center transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Highlight Box (Only shown if relevant to current user) */}
          {showHighlightBox && (
            <div className="mt-8 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                    Öne Çıkan İnteraktif Ders
                  </span>
                  <span className="text-xs text-teal-100">MAT.5.3.1</span>
                </div>
                <h4 className="text-lg font-bold">
                  5. Sınıf Matematik: Doğru, Doğru Parçası ve Işın Çizim Atölyesi
                </h4>
                <p className="text-xs text-teal-100">
                  4 aşamalı Maarif akıllı tahta ders odasını tek tıkla doğrudan başlatabilirsiniz.
                </p>
              </div>
              <button
                onClick={() => {
                  const g5 = CURRICULUM_DATA.find((g) => g.id === 'grade-5');
                  const m5 = g5?.subjects.find((s) => s.id === 'mat-5');
                  const uGeo = m5?.units.find((u) => u.id === 'unit-5-geo');
                  const tGeo1 = uGeo?.topics.find((t) => t.id === 'topic-5-geo-1');
                  const out1 = tGeo1?.outcomes.find((o) => o.id === 'MAT.5.3.1');
                  if (g5 && m5 && uGeo && tGeo1 && out1) {
                    setSelectedGrade(g5);
                    setSelectedSubject(m5);
                    setSelectedUnit(uGeo);
                    setSelectedTopic(tGeo1);
                    setSelectedOutcome(out1);
                    playSound('success');
                    router.push('/lesson/MAT.5.3.1');
                  }
                }}
                className="whitespace-nowrap px-6 py-3 rounded-xl bg-white text-teal-800 font-extrabold text-sm shadow-md hover:bg-teal-50 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-teal-800" />
                <span>Dersi Doğrudan Başlat</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: SUBJECT SELECTION (Shown for multiple subjects / admins) */}
      {currentStep === 2 && selectedGrade && (
        <div className="space-y-4">
          <div className="flex items-center">
            <button
              onClick={() => {
                playSound('click');
                resetSelection();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-semibold cursor-pointer"
              title="Geri"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri Dön</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableSubjectsForGrade.map((subject) => (
              <button
                key={subject.id}
                onClick={() => handleSelectSubject(subject)}
                className="group text-left bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-200 active:scale-98 flex flex-col justify-between min-h-[190px]"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${subject.color} flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-105 transition-transform`}>
                    {ICON_MAP[subject.icon] || <Calculator className="w-6 h-6" />}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {subject.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {subject.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-teal-600">
                  <span>{subject.units.length} Ünite Hazır</span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-teal-500 group-hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: UNIT SELECTION */}
      {currentStep === 3 && selectedGrade && selectedSubject && (
        <div className="space-y-4">
          <div className="flex items-center">
            <button
              onClick={() => {
                playSound('click');
                if (isTeacher || availableSubjectsForGrade.length <= 1) {
                  // Single subject -> go back to grade selection
                  setSelectedGrade(null);
                  setSelectedSubject(null);
                  setSelectedUnit(null);
                  setSelectedTopic(null);
                  setSelectedOutcome(null);
                } else {
                  setSelectedSubject(null);
                  setSelectedUnit(null);
                  setSelectedTopic(null);
                  setSelectedOutcome(null);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-semibold cursor-pointer"
              title="Geri"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri Dön</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {selectedSubject.units.map((unit) => (
              <button
                key={unit.id}
                onClick={() => handleSelectUnit(unit)}
                className="group text-left bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-200 active:scale-98 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                    style={{ backgroundColor: unit.themeColor }}
                  >
                    {ICON_MAP[unit.icon] || <Shapes className="w-7 h-7" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {unit.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {unit.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-teal-600">
                  <span>
                    {unit.topics.reduce((acc, t) => acc + t.outcomes.length, 0)} Kazanım / Öğrenme Çıktısı
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-teal-500 group-hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4 & 5: TOPIC, OUTCOME AND LAUNCH */}
      {currentStep >= 4 && selectedGrade && selectedSubject && selectedUnit && (
        <div className="space-y-6">
          <div className="flex items-center">
            <button
              onClick={() => {
                playSound('click');
                setSelectedUnit(null);
                setSelectedOutcome(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-semibold cursor-pointer"
              title="Geri"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri Dön</span>
            </button>
          </div>

          <div className="space-y-6">
            {selectedUnit.topics.map((topic) => (
              <div key={topic.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-600" />
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{topic.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topic.outcomes.map((outcome) => {
                    const isSelected = selectedOutcome?.id === outcome.id;
                    return (
                      <div
                        key={outcome.id}
                        onClick={() => handleSelectOutcome(topic, outcome)}
                        className={`cursor-pointer rounded-xl p-5 border-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50/50 shadow-md shadow-teal-500/10 ring-2 ring-teal-400'
                            : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-teal-600 text-white">
                              {outcome.code}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{outcome.durationMinutes} dk</span>
                            </div>
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm">
                            {outcome.title}
                          </h4>

                          <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                            {outcome.description}
                          </p>
                        </div>

                        {/* Maarif Modeli Tags & Action Button */}
                        <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                              4 Fazlı Ders Odası
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                              İnteraktif Lab
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playSound('select');
                              setPlanModalOutcome(outcome);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Bu kazanımın resmi Maarif Modeli Günlük Planını PDF olarak indir"
                          >
                            <FileText className="w-3.5 h-3.5 text-teal-600" />
                            <span>Plan İndir (PDF)</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* STEP 5: LAUNCH BAR */}
          {selectedOutcome && (
            <div className="sticky bottom-4 z-30 bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md">
                  <Tv className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-teal-800 text-teal-200 text-xs font-bold">
                      {selectedOutcome.code}
                    </span>
                    <span className="text-xs text-slate-300">Ders Başlatılmaya Hazır</span>
                  </div>
                  <h4 className="font-bold text-base text-white">
                    {selectedOutcome.shortTitle}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                <button
                  type="button"
                  onClick={() => {
                    playSound('select');
                    setPlanModalOutcome(selectedOutcome);
                  }}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span>Ders Planı (PDF)</span>
                </button>

                <button
                  onClick={handleLaunchLesson}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>Dersi Başlat</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lesson Plan PDF Modal */}
      {planModalOutcome && (
        <LessonPlanModal
          isOpen={!!planModalOutcome}
          onClose={() => setPlanModalOutcome(null)}
          outcome={planModalOutcome}
        />
      )}

    </div>
  );
}
