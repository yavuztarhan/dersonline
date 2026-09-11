'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  getStoredActiveBoardStudent,
  setStoredActiveBoardStudent,
  clearActiveBoardStudent
} from '@/lib/board-participation-store';
import { StudentUser } from '@/types/auth';
import confetti from 'canvas-confetti';
import {
  User,
  Hash,
  Sparkles,
  CheckCircle2,
  X,
  XCircle,
  Delete,
  ChevronRight,
  GraduationCap,
  Users,
  Trophy,
  Zap,
  ArrowRight
} from 'lucide-react';

interface BoardStudentWidgetProps {
  activityTitle?: string;
  className?: string;
}

export function BoardStudentWidget({ activityTitle, className = '' }: BoardStudentWidgetProps) {
  const { currentUser, students } = useAuth();
  const { playSound } = useApp();

  const [activeBoardStudent, setActiveBoardStudentState] = useState<{
    id: string;
    name: string;
    studentNumber: string;
    classSection: string;
    school?: string;
    points?: number;
  } | null>(null);

  const [isNumPadOpen, setIsNumPadOpen] = useState(false);
  const [enteredNumber, setEnteredNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successStudent, setSuccessStudent] = useState<StudentUser | null>(null);

  // Synchronize active board student
  useEffect(() => {
    setActiveBoardStudentState(getStoredActiveBoardStudent());

    const handleStorageChange = (e: any) => {
      if (e.detail !== undefined) {
        setActiveBoardStudentState(e.detail);
      } else {
        setActiveBoardStudentState(getStoredActiveBoardStudent());
      }
    };

    window.addEventListener('maarif_active_board_student_changed', handleStorageChange);
    return () => {
      window.removeEventListener('maarif_active_board_student_changed', handleStorageChange);
    };
  }, []);

  // Only teachers have this board delegation feature
  if (!currentUser || currentUser.role !== 'teacher') {
    return null;
  }

  // Teacher's classes
  const teacher = currentUser as any;
  const teacherClasses: string[] = teacher?.assignedClasses || ['5-A', '5-B'];

  // Students belonging to teacher's classes
  const classStudents = students.filter((s) => {
    if (!s.classSection) return true;
    return teacherClasses.includes(s.classSection);
  });

  const handleOpenNumPad = () => {
    setEnteredNumber('');
    setErrorMessage(null);
    setSuccessStudent(null);
    setIsNumPadOpen(true);
    playSound('select');
  };

  const handleKeyPress = (digit: string) => {
    if (enteredNumber.length >= 6) return;
    playSound('click');
    setErrorMessage(null);
    setEnteredNumber((prev) => prev + digit);
  };

  const handleDelete = () => {
    playSound('click');
    setErrorMessage(null);
    setEnteredNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    playSound('clear');
    setErrorMessage(null);
    setEnteredNumber('');
  };

  const handleConfirmStudent = (targetNumber?: string) => {
    const numToSearch = (targetNumber || enteredNumber).trim();
    if (!numToSearch) {
      setErrorMessage('Lütfen bir okul numarası giriniz.');
      playSound('clear');
      return;
    }

    // Search for student in full student roster
    const matched = students.find(
      (s) => (s.studentNumber || '').trim() === numToSearch
    );

    if (matched) {
      playSound('success');
      setSuccessStudent(matched);
      setErrorMessage(null);

      const boardObj = {
        id: matched.id,
        name: matched.name,
        studentNumber: matched.studentNumber,
        classSection: matched.classSection,
        school: matched.school || teacher.school,
        points: matched.points || 0
      };

      setStoredActiveBoardStudent(boardObj);
      setActiveBoardStudentState(boardObj);

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      } catch (e) {}

      setTimeout(() => {
        setIsNumPadOpen(false);
        setSuccessStudent(null);
      }, 700);
    } else {
      playSound('clear');
      setErrorMessage(`"${numToSearch}" numaralı öğrenci bulunamadı. Lütfen kontrol ediniz.`);
    }
  };

  const handleRemoveBoardStudent = () => {
    playSound('clear');
    clearActiveBoardStudent();
    setActiveBoardStudentState(null);
  };

  // Keyboard event handler for NumPad
  useEffect(() => {
    if (!isNumPadOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleConfirmStudent();
      } else if (e.key === 'Escape') {
        setIsNumPadOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNumPadOpen, enteredNumber]);

  return (
    <>
      {/* 1. COMPACT BOARD BANNER / WIDGET */}
      <div
        className={`rounded-2xl p-3 sm:p-3.5 border transition-all duration-200 ${
          activeBoardStudent
            ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-300 shadow-xs'
            : 'bg-gradient-to-r from-indigo-50/70 via-slate-50 to-indigo-50/70 border-indigo-200/80 shadow-xs'
        } ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Left Info Section */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black shrink-0 shadow-xs ${
                activeBoardStudent
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {activeBoardStudent ? '🎯' : '🔢'}
            </div>

            <div>
              {activeBoardStudent ? (
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                      Tahtadaki Öğrenci
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      #{activeBoardStudent.studentNumber} • {activeBoardStudent.name}
                    </span>
                    <span className="text-xs font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                      {activeBoardStudent.classSection}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>Bu etkinlikten kazanılacak puanlar doğrudan öğrencinin hesabına yazılacaktır.</span>
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-indigo-950">
                      Sınıf İçi Tahtaya Kaldırma & Puan Aktarımı
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      İsteğe Bağlı
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Tahtaya kalkan öğrenci NumPad ile numarasını girdiğinde kazandığı XP kendi hesabına işlenir.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {activeBoardStudent ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenNumPad}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-emerald-900 border border-emerald-300 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Öğrenciyi Değiştir
                </button>
                <button
                  onClick={handleRemoveBoardStudent}
                  className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                  title="Tahtadaki Öğrenciyi Çıkar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleOpenNumPad}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-black shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Hash className="w-4 h-4" />
                <span>NumPad ile Öğrenci Çağır</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. SMART BOARD NUMPAD MODAL */}
      {isNumPadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg">
                  🔢
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Akıllı Tahta • Öğrenci Numara Girişi
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Öğrenci tahtada numarasını tuşlayarak oturum açabilir.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNumPadOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Large Digital Display */}
            <div className="bg-slate-900 rounded-2xl p-4 text-center space-y-1 shadow-inner relative overflow-hidden">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                GİRİLEN OKUL NUMARASI
              </span>
              <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-widest min-h-[52px] flex items-center justify-center">
                {enteredNumber || (
                  <span className="text-slate-600 font-sans text-xl font-bold tracking-normal">
                    Numara Tuşlayınız...
                  </span>
                )}
              </div>
            </div>

            {/* Error / Success Toast Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in shake">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successStudent && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-black flex items-center gap-2 animate-in zoom-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Öğrenci Doğrulandı: #{successStudent.studentNumber} {successStudent.name} ({successStudent.classSection})</span>
              </div>
            )}

            {/* Touch-Friendly Large Virtual NumPad Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeyPress(digit)}
                  className="py-4 rounded-2xl bg-slate-100 hover:bg-indigo-50 active:bg-indigo-600 active:text-white border-2 border-slate-200/80 hover:border-indigo-400 text-2xl font-black text-slate-800 transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center select-none"
                >
                  {digit}
                </button>
              ))}

              {/* Clear / Delete Button */}
              <button
                onClick={handleDelete}
                className="py-4 rounded-2xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border-2 border-amber-200 text-amber-900 font-black text-sm sm:text-base transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1 select-none"
                title="Tek Rakam Sil"
              >
                <Delete className="w-5 h-5" />
                <span>Sil</span>
              </button>

              {/* 0 Button */}
              <button
                onClick={() => handleKeyPress('0')}
                className="py-4 rounded-2xl bg-slate-100 hover:bg-indigo-50 active:bg-indigo-600 active:text-white border-2 border-slate-200/80 hover:border-indigo-400 text-2xl font-black text-slate-800 transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center select-none"
              >
                0
              </button>

              {/* Confirm / Submit Button */}
              <button
                onClick={() => handleConfirmStudent()}
                className="py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 select-none"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Giriş</span>
              </button>
            </div>

            {/* Quick One-Tap Student Roster Helper */}
            {classStudents.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>Hızlı Liste ({teacherClasses.join(', ')}):</span>
                  <span className="text-slate-400 text-[10px]">İsme tıklayarak da seçebilirsiniz</span>
                </div>
                
                <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                  {classStudents.slice(0, 10).map((stu) => (
                    <button
                      key={stu.id}
                      onClick={() => handleConfirmStudent(stu.studentNumber)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-300 text-xs font-bold text-slate-700 hover:text-indigo-950 flex items-center justify-between transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-indigo-600">#{stu.studentNumber}</span>
                        <span>{stu.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-extrabold">{stu.classSection}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Modal Close Button */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                onClick={handleClear}
                className="text-slate-500 hover:text-slate-700 font-bold cursor-pointer"
              >
                Temizle
              </button>
              <button
                onClick={() => setIsNumPadOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
              >
                Numara Girmeden Kapat
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
