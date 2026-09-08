'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Users,
  Dices,
  Sparkles,
  X,
  Plus,
  Trash2,
  Volume2,
  Trophy,
  RotateCw
} from 'lucide-react';

export function RandomStudentPickerModal() {
  const {
    randomPickerOpen,
    setRandomPickerOpen,
    students,
    addStudent,
    removeStudent,
    playSound,
  } = useApp();

  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [showRoster, setShowRoster] = useState(false);

  if (!randomPickerOpen) return null;

  const spinWheel = () => {
    if (students.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setSelectedStudent(null);

    let counter = 0;
    const totalTicks = 28;
    const intervalTime = 80;

    const interval = setInterval(() => {
      counter++;
      const randomIndex = Math.floor(Math.random() * students.length);
      setSelectedStudent(students[randomIndex]);
      playSound('click');

      if (counter >= totalTicks) {
        clearInterval(interval);
        const finalWinner = students[Math.floor(Math.random() * students.length)];
        setSelectedStudent(finalWinner);
        setIsSpinning(false);
        playSound('bell');

        // Confetti celebration
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }, intervalTime);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      addStudent(newStudentName.trim());
      setNewStudentName('');
      playSound('click');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Dices className="w-7 h-7 text-white animate-bounce" />
            </div>
            <div>
              <h3 className="text-xl font-black">Sınıf Kura & Söz Hakkı Çarkı</h3>
              <p className="text-xs text-teal-100">
                Akıllı tahtada rastgele öğrenci seçimi ({students.length} Öğrenci)
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

        {/* Body */}
        <div className="p-6 space-y-6 text-center">
          
          {/* Winner Display Area */}
          <div className="min-h-[160px] flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-slate-50 to-teal-50/40 border-2 border-dashed border-teal-200 p-6 relative overflow-hidden">
            {isSpinning ? (
              <div className="space-y-3">
                <RotateCw className="w-10 h-10 text-teal-600 animate-spin mx-auto" />
                <div className="text-2xl font-black text-slate-700 animate-pulse">
                  {selectedStudent || 'Seçiliyor...'}
                </div>
                <p className="text-xs font-semibold text-teal-600">Çark dönüyor...</p>
              </div>
            ) : selectedStudent ? (
              <div className="space-y-3 animate-in zoom-in duration-300">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Sıradaki Söz Hakkı</span>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {selectedStudent}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Tahtada soruyu cevaplamak için hazır!
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-slate-400">
                <Users className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">
                  Kura çekmek için aşağıdaki butona basın
                </p>
                <p className="text-xs text-slate-400">
                  Listedeki {students.length} öğrenci arasından adil seçim yapılır.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={spinWheel}
              disabled={isSpinning || students.length === 0}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 text-white font-extrabold text-lg shadow-lg shadow-teal-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isSpinning ? 'Kura Çekiliyor...' : 'Kura Çek / Seç'}</span>
            </button>

            <button
              onClick={() => setShowRoster(!showRoster)}
              className="py-4 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
            >
              {showRoster ? 'Listeyi Kapat' : 'Öğrenci Listesi'}
            </button>
          </div>

          {/* Student Roster Section (Expandable) */}
          {showRoster && (
            <div className="border-t border-slate-200 pt-4 text-left space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Sınıf Mevcudu ({students.length})</span>
              </div>

              {/* Add form */}
              <form onSubmit={handleAdd} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Öğrenci Adı Soyadı..."
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ekle</span>
                </button>
              </form>

              {/* List */}
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {students.map((student) => (
                  <div
                    key={student}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
                  >
                    <span>{student}</span>
                    <button
                      onClick={() => removeStudent(student)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Listeden Çıkar"
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
