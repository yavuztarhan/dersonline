'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { useAuth, splitFullName } from '@/lib/auth-store';
import { StudentUser, TeacherUser } from '@/types/auth';
import confetti from 'canvas-confetti';
import {
  Users,
  Dices,
  Sparkles,
  X,
  Plus,
  Trash2,
  Trophy,
  RotateCw,
  Filter,
  GraduationCap,
  School,
  AlertCircle
} from 'lucide-react';

export function RandomStudentPickerModal() {
  const { randomPickerOpen, setRandomPickerOpen, playSound } = useApp();
  const { currentUser, getVisibleStudents, addStudent, deleteStudent } = useAuth();

  const [selectedStudent, setSelectedStudent] = useState<StudentUser | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNumber, setNewStudentNumber] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('5-A');
  const [showRoster, setShowRoster] = useState(false);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');

  // Teacher's registered students from system
  const visibleStudents: StudentUser[] = useMemo(() => {
    return getVisibleStudents(currentUser);
  }, [getVisibleStudents, currentUser]);

  // Extract distinct classes available for this teacher
  const teacherClasses = useMemo(() => {
    const classSet = new Set<string>();
    if (currentUser && currentUser.role === 'teacher') {
      const tch = currentUser as TeacherUser;
      if (tch.assignedClasses && tch.assignedClasses.length > 0) {
        tch.assignedClasses.forEach((c) => classSet.add(c));
      }
    }
    visibleStudents.forEach((s) => {
      if (s.classSection) classSet.add(s.classSection);
    });

    if (classSet.size === 0) {
      classSet.add('5-A');
      classSet.add('5-B');
    }

    return Array.from(classSet).sort();
  }, [currentUser, visibleStudents]);

  // Active student list based on selected class filter
  const activeStudents = useMemo(() => {
    if (selectedClassFilter === 'ALL') {
      return visibleStudents;
    }
    return visibleStudents.filter((s) => s.classSection === selectedClassFilter);
  }, [visibleStudents, selectedClassFilter]);

  if (!randomPickerOpen) return null;

  const spinWheel = () => {
    if (activeStudents.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setSelectedStudent(null);

    let counter = 0;
    const totalTicks = 26;
    const intervalTime = 75;

    const interval = setInterval(() => {
      counter++;
      const randomIndex = Math.floor(Math.random() * activeStudents.length);
      setSelectedStudent(activeStudents[randomIndex]);
      playSound('click');

      if (counter >= totalTicks) {
        clearInterval(interval);
        const finalWinner = activeStudents[Math.floor(Math.random() * activeStudents.length)];
        setSelectedStudent(finalWinner);
        setIsSpinning(false);
        playSound('bell');

        // Confetti celebration
        try {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }, intervalTime);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const tch = currentUser && currentUser.role === 'teacher' ? (currentUser as TeacherUser) : null;
    const targetClass = newStudentClass || (selectedClassFilter !== 'ALL' ? selectedClassFilter : '5-A');
    const { firstName, lastName } = splitFullName(newStudentName.trim());

    const newStudentObj: StudentUser = {
      id: `stu-${Date.now()}`,
      firstName: firstName || 'Öğrenci',
      lastName: lastName || '',
      name: newStudentName.trim(),
      email: `${newStudentNumber.trim() || Date.now()}@okul.meb.k12.tr`,
      role: 'student',
      avatar: '🎓',
      studentNumber: newStudentNumber.trim() || `${Math.floor(Math.random() * 800) + 100}`,
      gradeLevel: parseInt(targetClass.charAt(0)) || 5,
      classSection: targetClass,
      city: tch?.city || 'Edirne',
      district: tch?.district || 'Merkez',
      school: tch?.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
      teacherId: tch?.id,
      points: 100,
      unlockedBadges: ['first-step'],
      createdAt: new Date().toISOString().split('T')[0]
    };

    addStudent(newStudentObj);
    setNewStudentName('');
    setNewStudentNumber('');
    playSound('click');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <Dices className="w-7 h-7 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-teal-100 border border-white/20">
                  Öğretmen Sınıf Listesi
                </span>
              </div>
              <h3 className="text-xl font-black">Rastgele Öğrenci Seçimi & Kura</h3>
              <p className="text-xs text-teal-100">
                {currentUser ? `${currentUser.name} • ` : ''}{activeStudents.length} Kayıtlı Öğrenci
              </p>
            </div>
          </div>

          <button
            onClick={() => setRandomPickerOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Class Filter Bar */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-teal-600" />
            <span>Sınıf Filtresi:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setSelectedClassFilter('ALL');
                setSelectedStudent(null);
                playSound('select');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                selectedClassFilter === 'ALL'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Tüm Sınıflar ({visibleStudents.length})
            </button>

            {teacherClasses.map((cls) => {
              const count = visibleStudents.filter((s) => s.classSection === cls).length;
              return (
                <button
                  key={cls}
                  onClick={() => {
                    setSelectedClassFilter(cls);
                    setSelectedStudent(null);
                    playSound('select');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                    selectedClassFilter === cls
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cls} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-center">
          
          {/* Winner Display Area */}
          <div className="min-h-[160px] flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-slate-50 to-teal-50/40 border-2 border-dashed border-teal-200 p-6 relative overflow-hidden">
            {isSpinning ? (
              <div className="space-y-3">
                <RotateCw className="w-10 h-10 text-teal-600 animate-spin mx-auto" />
                <div className="text-2xl font-black text-slate-700 animate-pulse">
                  {selectedStudent ? selectedStudent.name : 'Seçiliyor...'}
                </div>
                {selectedStudent?.classSection && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                    Sınıf: {selectedStudent.classSection}
                  </span>
                )}
                <p className="text-xs font-semibold text-teal-600">Kura çarkı dönüyor...</p>
              </div>
            ) : selectedStudent ? (
              <div className="space-y-2 animate-in zoom-in duration-300">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Sıradaki Söz Hakkı</span>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {selectedStudent.name}
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                    Sınıf: {selectedStudent.classSection || '5-A'}
                  </span>
                  {selectedStudent.studentNumber && (
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
                      No: #{selectedStudent.studentNumber}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium pt-1">
                  Tahtada soruyu cevaplamak için hazır!
                </p>
              </div>
            ) : activeStudents.length > 0 ? (
              <div className="space-y-2 text-slate-400">
                <Users className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">
                  Kura çekmek için aşağıdaki butona basın
                </p>
                <p className="text-xs text-slate-500">
                  {selectedClassFilter === 'ALL' ? 'Tüm sınıflarınızdaki' : `${selectedClassFilter} sınıfındaki`}{' '}
                  <strong>{activeStudents.length} kayıtlı öğrenci</strong> arasından adil seçim yapılır.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-amber-800">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <p className="text-sm font-bold">Bu sınıfta kayıtlı öğrenci bulunamadı</p>
                <p className="text-xs text-slate-500">
                  Aşağıdaki "Öğrenci Listesi & Ekle" butonuna tıklayarak yeni öğrenciler ekleyebilirsiniz.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={spinWheel}
              disabled={isSpinning || activeStudents.length === 0}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-40 text-white font-extrabold text-lg shadow-lg shadow-teal-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isSpinning ? 'Kura Çekiliyor...' : 'Kura Çek / Seç'}</span>
            </button>

            <button
              onClick={() => setShowRoster(!showRoster)}
              className="py-4 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
            >
              {showRoster ? 'Listeyi Kapat' : `Öğrenci Listesi (${activeStudents.length})`}
            </button>
          </div>

          {/* Student Roster Section (Expandable) */}
          {showRoster && (
            <div className="border-t border-slate-200 pt-4 text-left space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>
                  Sisteme Kayıtlı Öğrenciler ({activeStudents.length}{' '}
                  {selectedClassFilter !== 'ALL' ? `/ ${selectedClassFilter}` : ''})
                </span>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddStudent} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Öğrenci Adı Soyadı..."
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="text"
                  placeholder="Okul No (Örn: 104)"
                  value={newStudentNumber}
                  onChange={(e) => setNewStudentNumber(e.target.value)}
                  className="w-full sm:w-28 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <select
                  value={newStudentClass}
                  onChange={(e) => setNewStudentClass(e.target.value)}
                  className="w-full sm:w-24 px-2 py-2 text-xs rounded-xl border border-slate-300 bg-white font-bold"
                >
                  {teacherClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ekle</span>
                </button>
              </form>

              {/* List */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {activeStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 hover:bg-teal-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-[10px]">
                        {student.avatar || '🎓'}
                      </span>
                      <span className="font-bold text-slate-900">{student.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
                        {student.classSection || '5-A'}
                      </span>
                      {student.studentNumber && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          #{student.studentNumber}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        deleteStudent(student.id);
                        playSound('click');
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      title="Listeden Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
