'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  getStoredBoardParticipations,
  BoardParticipationRecord,
  setStoredActiveBoardStudent
} from '@/lib/board-participation-store';
import { StudentUser } from '@/types/auth';
import { TeacherStudentBoardHistoryModal } from '@/components/teacher/teacher-student-board-history-modal';
import { downloadClassBoardReportPDF } from '@/lib/board-pdf-generator';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Trophy,
  Award,
  Users,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Gamepad2,
  FileCheck2,
  BookOpen,
  ClipboardCheck,
  Download,
  Loader2,
  Zap,
  Dices,
  RotateCcw,
  Check,
  Activity,
  Layers,
  TrendingUp,
  LineChart,
  Eye
} from 'lucide-react';
import { getSubjectFromOutcomeOrRecord } from '@/lib/board-participation-store';

interface TeacherBoardParticipationReportProps {
  teacherBranch?: string;
}

export function TeacherBoardParticipationReport({ teacherBranch }: TeacherBoardParticipationReportProps = {}) {
  const { currentUser, students, getVisibleStudents } = useAuth();
  const { playSound } = useApp();

  const teacher = currentUser && currentUser.role === 'teacher' ? (currentUser as any) : null;
  const activeBranch = teacherBranch || teacher?.branch || 'Matematik';
  const teacherClasses: string[] = teacher?.assignedClasses || ['5-A', '5-B'];

  const [selectedClass, setSelectedClass] = useState<string>(teacherClasses[0] || '5-A');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ranking' | 'timeline'>('ranking');
  const [pickedStudent, setPickedStudent] = useState<StudentUser | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isDownloadingClassPdf, setIsDownloadingClassPdf] = useState(false);

  // Selected student for history modal & graph
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<StudentUser | null>(null);

  // Read live stored board records
  const [boardRecords, setBoardRecords] = useState<BoardParticipationRecord[]>(() =>
    getStoredBoardParticipations()
  );

  // Refresh records on event
  React.useEffect(() => {
    const updateRecords = () => {
      setBoardRecords(getStoredBoardParticipations());
    };
    window.addEventListener('maarif_board_participation_added', updateRecords);
    return () => window.removeEventListener('maarif_board_participation_added', updateRecords);
  }, []);

  // Only use students visible to this teacher (no unassigned demo students)
  const visibleStudents = useMemo(() => {
    return getVisibleStudents(currentUser);
  }, [currentUser, getVisibleStudents, students]);

  const visibleStudentIds = useMemo(() => new Set(visibleStudents.map((s) => s.id)), [visibleStudents]);
  const visibleStudentNumbers = useMemo(() => new Set(visibleStudents.map((s) => s.studentNumber)), [visibleStudents]);

  // Filter boardRecords so only records of visible students and matching the teacher's branch are considered
  const teacherBoardRecords = useMemo(() => {
    return boardRecords.filter((r) => {
      const isVisible = visibleStudentIds.has(r.studentId) || visibleStudentNumbers.has(r.studentNumber);
      if (!isVisible) return false;
      if (activeBranch) {
        return getSubjectFromOutcomeOrRecord(r) === activeBranch;
      }
      return true;
    });
  }, [boardRecords, visibleStudentIds, visibleStudentNumbers, activeBranch]);

  // Filter students for selected class
  const classStudents = useMemo(() => {
    return visibleStudents.filter((s) => {
      if (selectedClass === 'Tümü') return true;
      return s.classSection === selectedClass;
    });
  }, [visibleStudents, selectedClass]);

  // Aggregate participation metrics per student
  const studentStats = useMemo(() => {
    return classStudents.map((stu) => {
      const recordsForStudent = teacherBoardRecords.filter(
        (r) => r.studentNumber === stu.studentNumber || r.studentId === stu.id
      );

      const count = recordsForStudent.length;
      const totalXp = recordsForStudent.reduce((acc, r) => acc + (r.xpEarned || 0), 0);
      
      const gameCount = recordsForStudent.filter((r) => r.activityType === 'game').length;
      const testCount = recordsForStudent.filter((r) => r.activityType === 'test').length;
      const rubricCount = recordsForStudent.filter((r) => r.activityType === 'rubric').length;
      const journalCount = recordsForStudent.filter((r) => r.activityType === 'journal').length;

      // Last participation date
      const lastRecord = recordsForStudent.length > 0
        ? [...recordsForStudent].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
        : null;

      let participationLevel: 'high' | 'medium' | 'none' = 'none';
      if (count >= 3) participationLevel = 'high';
      else if (count >= 1) participationLevel = 'medium';

      return {
        student: stu,
        count,
        totalXp,
        gameCount,
        testCount,
        rubricCount,
        journalCount,
        lastDate: lastRecord ? lastRecord.timestamp : null,
        participationLevel
      };
    }).sort((a, b) => b.count - a.count || (b.student.points || 0) - (a.student.points || 0));
  }, [classStudents, teacherBoardRecords]);

  // Summary KPIs
  const totalBoardParticipations = useMemo(() => {
    return studentStats.reduce((sum, s) => sum + s.count, 0);
  }, [studentStats]);

  const activeBoardStudentsCount = useMemo(() => {
    return studentStats.filter((s) => s.count > 0).length;
  }, [studentStats]);

  const totalClassStudentsCount = classStudents.length;
  const participationRate = totalClassStudentsCount > 0 ? Math.round((activeBoardStudentsCount / totalClassStudentsCount) * 100) : 0;

  const totalBoardXp = useMemo(() => {
    return studentStats.reduce((sum, s) => sum + s.totalXp, 0);
  }, [studentStats]);

  const neverParticipatedList = useMemo(() => {
    return studentStats.filter((s) => s.count === 0);
  }, [studentStats]);

  // Filtered list by search keyword
  const filteredStats = useMemo(() => {
    if (!searchTerm.trim()) return studentStats;
    const term = searchTerm.toLocaleLowerCase('tr');
    return studentStats.filter(
      (s) =>
        s.student.name.toLocaleLowerCase('tr').includes(term) ||
        s.student.studentNumber.includes(term) ||
        s.student.classSection.toLocaleLowerCase('tr').includes(term)
    );
  }, [studentStats, searchTerm]);

  // Filtered timeline records (only for visible students)
  const filteredTimelineRecords = useMemo(() => {
    return teacherBoardRecords.filter((r) => {
      if (selectedClass !== 'Tümü' && r.classSection !== selectedClass) return false;
      if (!searchTerm) return true;
      const term = searchTerm.toLocaleLowerCase('tr');
      return (
        r.studentName.toLocaleLowerCase('tr').includes(term) ||
        r.studentNumber.includes(term) ||
        r.activityTitle.toLocaleLowerCase('tr').includes(term)
      );
    });
  }, [teacherBoardRecords, selectedClass, searchTerm]);

  // Get records for the modal-selected student
  const selectedStudentRecords = useMemo(() => {
    if (!selectedStudentForHistory) return [];
    return teacherBoardRecords.filter(
      (r) =>
        r.studentNumber === selectedStudentForHistory.studentNumber ||
        r.studentId === selectedStudentForHistory.id
    );
  }, [teacherBoardRecords, selectedStudentForHistory]);

  // Random Student Smart Picker (Prioritizes low-participation students)
  const handlePickRandomStudent = () => {
    if (classStudents.length === 0) return;
    setIsSpinning(true);
    setPickedStudent(null);
    playSound('select');

    // Pool weighted: students with 0 participation get 5x chance, with 1 get 2x chance
    const pool: StudentUser[] = [];
    studentStats.forEach((st) => {
      const weight = st.count === 0 ? 5 : st.count === 1 ? 2 : 1;
      for (let i = 0; i < weight; i++) {
        pool.push(st.student);
      }
    });

    setTimeout(() => {
      const randomStu = pool[Math.floor(Math.random() * pool.length)] || classStudents[0];
      setPickedStudent(randomStu);
      setIsSpinning(false);
      playSound('success');

      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }, 900);
  };

  const handleActivatePickedStudent = (stu: StudentUser) => {
    setStoredActiveBoardStudent({
      id: stu.id,
      name: stu.name,
      studentNumber: stu.studentNumber,
      classSection: stu.classSection,
      school: stu.school || teacher?.school,
      points: stu.points || 0
    });
    playSound('success');
  };

  const handleOpenStudentHistory = (stu: StudentUser) => {
    setSelectedStudentForHistory(stu);
    playSound('select');
  };

  const handleDownloadClassPDF = async () => {
    try {
      setIsDownloadingClassPdf(true);
      playSound('select');
      await downloadClassBoardReportPDF(
        selectedClass,
        studentStats,
        {
          totalParticipations: totalBoardParticipations,
          participationRate,
          totalXp: totalBoardXp,
          neverParticipatedCount: neverParticipatedList.length
        },
        {
          schoolName: teacher?.school,
          teacherName: teacher?.name || currentUser?.name,
          teacherBranch: teacher?.branch || 'Matematik'
        }
      );
      playSound('success');
    } catch (err) {
      console.error('Class PDF download error:', err);
      alert('Sınıf raporu PDF oluşturulurken bir hata oluştu.');
    } finally {
      setIsDownloadingClassPdf(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-black">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Sınıf İçi Akıllı Tahta & Derse Katılım Raporu</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Tahtaya Kalkma & Aktiflik Analizi</span>
              <span className="text-xs px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/30">
                Veri Tabanı Entegre
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              Öğrencilerin akıllı tahtada NumPad tuşlayarak çözdüğü oyunlar, kazanım testleri, öz değerlendirme ve günlük etkinliklerinin gerçek zamanlı katılım dökümü. Öğrenci isimlerine tıklayarak bireysel artış/azalış grafiklerini ve geçmişini inceleyebilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={handlePickRandomStudent}
              disabled={isSpinning}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Dices className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Öğrenci Seçiliyor...' : '🎲 Rastgele Öğrenci Kaldır'}</span>
            </button>

            <button
              onClick={handleDownloadClassPDF}
              disabled={isDownloadingClassPdf}
              className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDownloadingClassPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-teal-200" />
              )}
              <span>{isDownloadingClassPdf ? 'Hazırlanıyor...' : 'PDF İndir'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Random Picker Result Modal / Card */}
      {pickedStudent && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-3xl p-5 border-2 border-amber-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
              🎯
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">
                Sıradaki Tahta Oyuncusu Seçildi!
              </span>
              <h3 className="text-lg font-black text-slate-900">
                #{pickedStudent.studentNumber} • {pickedStudent.name} ({pickedStudent.classSection})
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Öğrenci tahtaya kalkarak derse katılmaya hazır.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleActivatePickedStudent(pickedStudent)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tahtada Oturumu Başlat</span>
            </button>
            <button
              onClick={() => handleOpenStudentHistory(pickedStudent)}
              className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Geçmiş & Grafik</span>
            </button>
            <button
              onClick={() => setPickedStudent(null)}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200 cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* 2. Class Selector & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Class Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black text-slate-700 mr-1 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-teal-600" />
            <span>Şube Seçimi:</span>
          </span>

          {teacherClasses.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                selectedClass === cls
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cls} Şubesi
            </button>
          ))}

          <button
            onClick={() => setSelectedClass('Tümü')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              selectedClass === 'Tümü'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tüm Şubeler
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Öğrenci veya numara ara..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-500 outline-none transition-all"
          />
        </div>

      </div>

      {/* 3. Executive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* KPI 1: Toplam Tahtaya Kalkma */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase text-slate-500">Tahtaya Kalkma</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-black">
              🎯
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {totalBoardParticipations}
          </div>
          <div className="text-[11px] font-bold text-teal-700 mt-0.5">
            Tamamlanan akıllı tahta etkinliği
          </div>
        </div>

        {/* KPI 2: Sınıf Katılım Oranı */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase text-slate-500">Sınıf Katılımı</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              👥
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-900 mt-2">
            %{participationRate}
          </div>
          <div className="text-[11px] font-bold text-slate-500 mt-0.5">
            {activeBoardStudentsCount} / {totalClassStudentsCount} öğrenci tahtaya kalktı
          </div>
        </div>

        {/* KPI 3: Tahtada Kazanılan XP */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase text-slate-500">Kazanılan XP</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              ⚡
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 mt-2">
            +{totalBoardXp.toLocaleString('tr-TR')} XP
          </div>
          <div className="text-[11px] font-bold text-amber-800 mt-0.5">
            Öğrenci hesaplarına işlenen puan
          </div>
        </div>

        {/* KPI 4: Teşvik Listesi (Henüz Kalkmayanlar) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase text-slate-500">Teşvik Listesi</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
              ⏳
            </div>
          </div>
          <div className="text-3xl font-black text-rose-900 mt-2">
            {neverParticipatedList.length}
          </div>
          <div className="text-[11px] font-bold text-rose-700 mt-0.5">
            Henüz tahtaya kalkmamış öğrenci
          </div>
        </div>

      </div>

      {/* 4. Tab Navigation (Ranking vs Timeline) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ranking'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Öğrenci Katılım Sıralaması & Dağılımı ({filteredStats.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'timeline'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Canlı Katılım Zaman Günlüğü ({filteredTimelineRecords.length})</span>
        </button>
      </div>

      {/* TAB 1: RANKING TABLE */}
      {activeTab === 'ranking' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>İpucu: Öğrencinin geçmişini ve artış/azalış grafiğini görmek için ismine veya satırına tıklayın.</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-black uppercase text-slate-600 tracking-wider">
                  <th className="py-3 px-4 rounded-l-2xl">Sıra & Öğrenci</th>
                  <th className="py-3 px-4">Şube</th>
                  <th className="py-3 px-4 text-center">Tahtaya Kalkma</th>
                  <th className="py-3 px-4 text-center">Etkinlik Türleri</th>
                  <th className="py-3 px-4 text-center">Kazanılan XP</th>
                  <th className="py-3 px-4 text-center">Durum</th>
                  <th className="py-3 px-4 text-center">Son Katılım</th>
                  <th className="py-3 px-4 text-right rounded-r-2xl">Grafik & Geçmiş</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredStats.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="space-y-2">
                        <div className="text-3xl">🎓</div>
                        <div className="font-bold text-xs text-slate-700">
                          {selectedClass === 'Tümü' ? 'Kayıtlı öğrenciniz bulunmuyor.' : `${selectedClass} şubesinde henüz kayıtlı öğrenci bulunmuyor.`}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          e-Okul sınıf listenizi yüklemek veya yeni öğrenci eklemek için &quot;Sınıfım &amp; Öğrenciler&quot; sekmesini kullanabilirsiniz.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStats.map((item, index) => (
                  <tr
                    key={item.student.id}
                    onClick={() => handleOpenStudentHistory(item.student)}
                    className="hover:bg-teal-50/50 transition-colors font-medium cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-black text-slate-900 flex items-center gap-2.5">
                      <span className="w-6 text-center text-slate-400 font-bold text-xs group-hover:text-teal-700">
                        #{index + 1}
                      </span>
                      <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        🎓
                      </div>
                      <div>
                        <div className="group-hover:text-teal-900 group-hover:underline">{item.student.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-bold">
                          No: #{item.student.studentNumber}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-indigo-700">
                      {item.student.classSection}
                    </td>

                    <td className="py-3.5 px-4 text-center font-black text-base text-slate-900">
                      {item.count > 0 ? (
                        <span className="text-teal-700 font-black">{item.count} Kez</span>
                      ) : (
                        <span className="text-slate-300 font-bold">0</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold">
                        {item.gameCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-800" title="Oyun">
                            🎮 {item.gameCount}
                          </span>
                        )}
                        {item.testCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800" title="Test">
                            📝 {item.testCount}
                          </span>
                        )}
                        {item.rubricCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-800" title="Rubrik">
                            📋 {item.rubricCount}
                          </span>
                        )}
                        {item.journalCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800" title="Günlük">
                            📖 {item.journalCount}
                          </span>
                        )}
                        {item.count === 0 && (
                          <span className="text-slate-400 font-bold">-</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-black text-amber-600">
                      +{item.totalXp} XP
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {item.participationLevel === 'high' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          🌟 Çok Aktif
                        </span>
                      ) : item.participationLevel === 'medium' ? (
                        <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black">
                          👍 Katıldı
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
                          ⚠️ Henüz Kalkmadı
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center text-slate-500 font-bold text-[11px]">
                      {item.lastDate ? (
                        <span>{new Date(item.lastDate).toLocaleDateString('tr-TR')} {new Date(item.lastDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenStudentHistory(item.student);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <LineChart className="w-3.5 h-3.5" />
                        <span>Grafik & Geçmiş</span>
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TIMELINE ACTIVITY LOG */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="divide-y divide-slate-100">
            {filteredTimelineRecords.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-bold text-xs">
                Kayıtlı tahta aktivitesi bulunamadı.
              </div>
            ) : (
              filteredTimelineRecords.map((record) => {
                const stuObj = students.find((s) => s.studentNumber === record.studentNumber || s.id === record.studentId);

                return (
                  <div
                    key={record.id}
                    onClick={() => {
                      if (stuObj) handleOpenStudentHistory(stuObj);
                    }}
                    className="py-4 flex items-center justify-between gap-4 hover:bg-teal-50/40 px-3 rounded-2xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-base shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        {record.activityType === 'game'
                          ? '🎮'
                          : record.activityType === 'test'
                          ? '📝'
                          : record.activityType === 'rubric'
                          ? '📋'
                          : '📖'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-xs sm:text-sm group-hover:text-teal-900 group-hover:underline">
                            {record.studentName}
                          </span>
                          <span className="font-mono text-[11px] text-indigo-600 font-black">
                            #{record.studentNumber}
                          </span>
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-extrabold text-slate-600">
                            {record.classSection}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                          <span>{record.activityTitle}</span>
                          {record.outcomeCode && (
                            <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded font-bold">
                              {record.outcomeCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-black text-amber-600 text-xs sm:text-sm">
                          +{record.xpEarned} XP
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                          {new Date(record.timestamp).toLocaleDateString('tr-TR')} • {new Date(record.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-100 text-slate-400 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 5. Student Board History Modal & Progress Chart */}
      {selectedStudentForHistory && (
        <TeacherStudentBoardHistoryModal
          student={selectedStudentForHistory}
          records={selectedStudentRecords}
          onClose={() => setSelectedStudentForHistory(null)}
          onActivateForBoard={(stu) => {
            handleActivatePickedStudent(stu);
            setSelectedStudentForHistory(null);
          }}
        />
      )}

    </div>
  );
}
