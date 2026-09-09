'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import Link from 'next/link';
import { UserAvatar } from '@/components/ui/user-avatar';
import { getOutcomeById } from '@/lib/curriculum-data';
import { LessonPlanModal } from '@/components/lesson-plan-modal';
import { TeacherRubricAnalytics } from '@/components/teacher/teacher-rubric-analytics';
import {
  ClassroomFileRecord,
  getStoredClassroomFiles,
  deleteClassroomFile,
  exportClassroomFileToPdf
} from '@/lib/class-files-store';
import { WhiteboardModal } from '@/components/whiteboard/whiteboard-modal';
import { WhiteboardViewerModal } from '@/components/whiteboard/whiteboard-viewer-modal';
import { ClassLeaderboard } from '@/components/gamification/class-leaderboard';
import { StudentOutcomeDetailModal } from '@/components/gamification/student-outcome-detail-modal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  School,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  Plus,
  Trash2,
  Award,
  ChevronRight,
  MonitorPlay,
  TrendingUp,
  BarChart2,
  Calendar,
  FileText,
  Download,
  ClipboardCheck,
  FolderOpen,
  Layers,
  Presentation,
  Loader2,
  Search,
  Filter,
  Eye,
  Trophy
} from 'lucide-react';

export function TeacherDashboard() {
  const { currentUser, students, getVisibleStudents, addStudent, deleteStudent, addClassToTeacher, awardPointsToStudent } = useAuth();
  const { setSelectedOutcome, playSound } = useApp();
  const [activePlanOutcome, setActivePlanOutcome] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<'analytics' | 'students' | 'leaderboard' | 'plans' | 'files'>('analytics');
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<any | null>(null);

  // Classroom Files State
  const [classroomFiles, setClassroomFiles] = useState<ClassroomFileRecord[]>([]);
  const [dashboardWhiteboardOpen, setDashboardWhiteboardOpen] = useState(false);
  const [editingFileInWhiteboard, setEditingFileInWhiteboard] = useState<ClassroomFileRecord | null>(null);
  const [viewingFile, setViewingFile] = useState<ClassroomFileRecord | null>(null);
  const [filesSearchTerm, setFilesSearchTerm] = useState('');
  const [filesClassFilter, setFilesClassFilter] = useState('all');
  const [filesOutcomeFilter, setFilesOutcomeFilter] = useState('all');
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);

  useEffect(() => {
    setClassroomFiles(getStoredClassroomFiles());
  }, []);

  // If current user is teacher
  const teacher = currentUser && currentUser.role === 'teacher' ? (currentUser as any) : null;
  const teacherClasses = teacher?.assignedClasses && teacher.assignedClasses.length > 0
    ? teacher.assignedClasses
    : ['5-A', '5-B'];

  const [selectedClass, setSelectedClass] = useState(teacherClasses[0] || '5-A');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNumber, setNewStudentNumber] = useState('');
  const [newStudentClass, setNewStudentClass] = useState(selectedClass);
  const [showAddModal, setShowAddModal] = useState(false);

  // Sınıf Ekleme Modalı State
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassNameInput, setNewClassNameInput] = useState('');

  // Keep selectedClass synchronized if classes change
  useEffect(() => {
    if (!teacherClasses.includes(selectedClass)) {
      setSelectedClass(teacherClasses[0] || '5-A');
    }
  }, [teacherClasses, selectedClass]);

  // Students visible to this teacher (only students in same school / added by teacher)
  const visibleStudents = getVisibleStudents(currentUser);
  const classStudents = visibleStudents.filter((s) => s.classSection === selectedClass);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentNumber.trim()) return;

    const targetClass = newStudentClass || selectedClass;

    const newStudent = {
      id: `stu-${Date.now()}`,
      name: newStudentName.trim(),
      email: `${newStudentNumber.trim()}@okul.meb.k12.tr`,
      role: 'student' as const,
      avatar: '🎓',
      studentNumber: newStudentNumber.trim(),
      gradeLevel: parseInt(targetClass.charAt(0)) || 5,
      classSection: targetClass,
      city: teacher?.city || 'Edirne',
      district: teacher?.district || 'Merkez',
      school: teacher?.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
      teacherId: teacher?.id,
      points: 100,
      unlockedBadges: ['first-step'],
      createdAt: new Date().toISOString().split('T')[0]
    };

    addStudent(newStudent);
    playSound('success');
    setNewStudentName('');
    setNewStudentNumber('');
    setShowAddModal(false);
    setSelectedClass(targetClass);
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newClassNameInput.trim().toUpperCase();
    if (!trimmed) return;

    if (teacher?.id) {
      addClassToTeacher(teacher.id, trimmed);
    }
    playSound('click');
    setSelectedClass(trimmed);
    setNewClassNameInput('');
    setShowAddClassModal(false);
  };

  const handleDeleteStudent = (stuId: string, stuName: string) => {
    if (window.confirm(`${stuName} adlı öğrenciyi silmek istediğinize emin misiniz?`)) {
      deleteStudent(stuId);
      playSound('clear');
    }
  };

  const handleDeleteFile = (fileId: string, title: string) => {
    if (window.confirm(`"${title}" isimli ders notunu silmek istediğinize emin misiniz?`)) {
      deleteClassroomFile(fileId);
      setClassroomFiles(getStoredClassroomFiles());
      playSound('clear');
    }
  };

  const handleDownloadFilePDF = async (file: ClassroomFileRecord) => {
    try {
      setDownloadingFileId(file.id);
      playSound('select');
      await exportClassroomFileToPdf(file, teacher?.school);
      playSound('success');
    } catch (err) {
      console.error('PDF indirme hatası:', err);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setDownloadingFileId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl border border-teal-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <UserAvatar
            avatar={teacher?.avatar}
            name={teacher?.name}
            size="xl"
            className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-teal-400 bg-teal-500/20 text-teal-200 shadow-inner"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black">{teacher?.name || 'Öğretmen Masası'}</h1>
              {teacher?.status === 'approved' && (
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Onaylı MEB Öğretmeni</span>
                </span>
              )}
              {teacher?.status === 'pending_admin_approval' && (
                <span className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Onayı Bekleniyor</span>
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 flex-wrap">
              <span className="flex items-center gap-1">
                <School className="w-4 h-4 text-teal-400" />
                <strong className="text-white">{teacher?.school || 'Okul Belirtilmedi'}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{teacher?.city || 'İl'} / {teacher?.district || 'İlçe'}</span>
              </span>
              <span>•</span>
              <span className="text-teal-300 font-bold">Branş: {teacher?.branch || 'Matematik'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/profile"
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
            title="Kişisel Bilgileri ve Okulu Düzenle"
          >
            <span>⚙️ Profilimi Düzenle</span>
          </Link>

          <Link
            href="/lesson/MAT.5.3.1"
            className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 active:scale-95 shrink-0"
          >
            <MonitorPlay className="w-4 h-4" />
            <span>Akıllı Tahtada Dersi Başlat</span>
          </Link>
        </div>
      </div>

      {/* PENDING APPROVAL NOTICE IF APPLICABLE */}
      {teacher?.status === 'pending_admin_approval' && (
        <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center text-xl shrink-0">
              ⏳
            </div>
            <div>
              <div className="font-black text-sm">Başvurunuz Yönetici (Admin) Onayı Bekliyor</div>
              <div className="text-xs text-amber-800">
                E-posta onayınız tamamlandı. Okulunuzdaki öğrencileri yönetebilir ve akıllı tahta derslerini başlatabilirsiniz.
              </div>
            </div>
          </div>
          <Link
            href="/profile"
            className="px-3.5 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs transition-colors"
          >
            Bilgilerimi Görüntüle
          </Link>
        </div>
      )}

      {/* Executive Module Switcher (5 Primary Sections) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 p-2 bg-slate-200/60 rounded-3xl border border-slate-300/70 shadow-inner">
        {/* 1. Öz Değerlendirme Rubrik Raporları */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveSection('analytics');
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeSection === 'analytics'
              ? 'bg-white shadow-md border-teal-500 ring-2 ring-teal-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === 'analytics' ? 'bg-teal-600 text-white shadow-sm' : 'bg-teal-50 text-teal-700'
              }`}
            >
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              Yeni
            </span>
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeSection === 'analytics' ? 'text-teal-950' : 'text-slate-800'}`}>
              Öz Değerlendirme
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Rubrik Raporları
            </div>
          </div>
          {activeSection === 'analytics' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-teal-600 rounded-full" />
          )}
        </button>

        {/* 2. Sınıfım & Öğrenci Listesi */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveSection('students');
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeSection === 'students'
              ? 'bg-white shadow-md border-indigo-500 ring-2 ring-indigo-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === 'students' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-indigo-50 text-indigo-700'
              }`}
            >
              <Users className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold border border-indigo-200">
              {classStudents.length} Öğrenci
            </span>
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeSection === 'students' ? 'text-indigo-950' : 'text-slate-800'}`}>
              Sınıfım & Öğrenciler
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Öğrenci Yönetimi
            </div>
          </div>
          {activeSection === 'students' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-indigo-600 rounded-full" />
          )}
        </button>

        {/* 3. Sınıf XP Lider Tablosu */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveSection('leaderboard');
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeSection === 'leaderboard'
              ? 'bg-white shadow-md border-amber-500 ring-2 ring-amber-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === 'leaderboard' ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-50 text-amber-600'
              }`}
            >
              <Trophy className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black border border-amber-200">
              Liderler
            </span>
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeSection === 'leaderboard' ? 'text-amber-950' : 'text-slate-800'}`}>
              Sınıf XP Tablosu
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Sıralama Panosu
            </div>
          </div>
          {activeSection === 'leaderboard' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-amber-500 rounded-full" />
          )}
        </button>

        {/* 4. Ders Planları & Akıllı Tahta Akışları */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveSection('plans');
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeSection === 'plans'
              ? 'bg-white shadow-md border-emerald-500 ring-2 ring-emerald-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === 'plans' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              5. Sınıf
            </span>
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeSection === 'plans' ? 'text-emerald-950' : 'text-slate-800'}`}>
              Ders Planları
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Akıllı Tahta Akışları
            </div>
          </div>
          {activeSection === 'plans' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-emerald-600 rounded-full" />
          )}
        </button>

        {/* 5. Sınıf Dosyaları & Ders Notları */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveSection('files');
            setClassroomFiles(getStoredClassroomFiles());
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeSection === 'files'
              ? 'bg-white shadow-md border-teal-500 ring-2 ring-teal-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === 'files' ? 'bg-teal-600 text-white shadow-sm' : 'bg-teal-50 text-teal-700'
              }`}
            >
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase border border-teal-200">
              {classroomFiles.length} Dosya
            </span>
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeSection === 'files' ? 'text-teal-950' : 'text-slate-800'}`}>
              Sınıf Dosyaları
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Ders Notları & PDF
            </div>
          </div>
          {activeSection === 'files' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-teal-600 rounded-full" />
          )}
        </button>
      </div>

      {/* SECTION: CLASS LEADERBOARD & XP RANKINGS */}
      {activeSection === 'leaderboard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <ClassLeaderboard initialClassSection={selectedClass} showTeacherControls={true} />
        </div>
      )}

      {/* SECTION 1: RUBRIC ANALYTICS & REPORTS */}
      {activeSection === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <TeacherRubricAnalytics
            teacherClasses={teacherClasses}
            teacherSchool={teacher?.school}
            teacherName={teacher?.name}
            teacherBranch={teacher?.branch}
          />
        </div>
      )}

      {/* SECTION 2: CLASS & STUDENT MANAGEMENT */}
      {activeSection === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          
          {/* Left Column: Sınıf & Öğrenci Yönetimi (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-600" />
                    <span>Sınıfım ve Öğrenci Listesi</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {teacher?.school ? `📍 ${teacher.school} bünyesindeki kayıtlı öğrencileriniz` : 'Öğrencilerinizin başarı ve puan durumu.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Dynamic Class Selector */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl flex-wrap gap-1">
                    {teacherClasses.map((cls: string) => (
                      <button
                        key={cls}
                        onClick={() => setSelectedClass(cls)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          selectedClass === cls
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {cls}
                      </button>
                    ))}

                    {/* Sınıf Ekle Butonu */}
                    <button
                      onClick={() => setShowAddClassModal(true)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-teal-700 hover:bg-teal-100/70 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Yeni Sınıf / Şube Ekle"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Sınıf Ekle</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setNewStudentClass(selectedClass);
                      setShowAddModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Öğrenci Ekle</span>
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                      <th className="py-2.5 px-3">No</th>
                      <th className="py-2.5 px-3">Öğrenci Adı</th>
                      <th className="py-2.5 px-3">Okul</th>
                      <th className="py-2.5 px-3">Puan (XP)</th>
                      <th className="py-2.5 px-3">İlerleme</th>
                      <th className="py-2.5 px-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          <div className="space-y-2">
                            <div className="text-2xl">🎓</div>
                            <p className="font-bold text-xs text-slate-600">
                              {selectedClass} şubesinde henüz kayıtlı öğrenci bulunmuyor.
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Yukarıdaki &quot;Öğrenci Ekle&quot; butonuna basarak sınıfınıza öğrenci tanımlayabilirsiniz.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      classStudents.map((stu) => (
                        <tr
                          key={stu.id}
                          onClick={() => {
                            playSound('select');
                            setSelectedStudentForDetail(stu);
                          }}
                          className="hover:bg-teal-50/50 transition-colors cursor-pointer group"
                          title="Öğrencinin Detaylı Kazanım ve Rubrik Karnesini Aç"
                        >
                          <td className="py-3 px-3 font-mono font-black text-slate-900">#{stu.studentNumber}</td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 group-hover:text-teal-800 transition-colors flex items-center gap-1.5">
                              <span>{stu.name}</span>
                              <BarChart2 className="w-3 h-3 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-[10px] text-slate-400">{stu.classSection} Şubesi</div>
                          </td>
                          <td className="py-3 px-3 text-[11px] text-slate-600 truncate max-w-[140px]">
                            {stu.school || teacher?.school}
                          </td>
                          <td className="py-3 px-3 font-black text-amber-600">+{stu.points} XP</td>
                          <td className="py-3 px-3">
                            <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-teal-500 h-full rounded-full"
                                style={{ width: `${Math.min(100, (stu.points / 500) * 100)}%` }}
                              />
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playSound('select');
                                  setSelectedStudentForDetail(stu);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                title="Kazanım Karnesini Aç"
                              >
                                <BarChart2 className="w-3 h-3 text-teal-600" />
                                <span>Karne</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteStudent(stu.id, stu.name);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Öğrenciyi Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* SINIF EKLE MODAL */}
            {showAddClassModal && (
              <div className="p-5 rounded-3xl bg-teal-950 text-white space-y-4 animate-in fade-in border border-teal-800 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-teal-300">Yeni Sınıf / Şube Tanımla</h4>
                  <button
                    onClick={() => setShowAddClassModal(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ✕ Kapat
                  </button>
                </div>

                <form onSubmit={handleAddClass} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Sınıf Adı (Örn: 5-C, 6-A, 7-B)"
                    value={newClassNameInput}
                    onChange={(e) => setNewClassNameInput(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl bg-slate-800 border border-teal-700 text-xs text-white outline-none focus:border-teal-400 uppercase font-bold"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Sınıfı Ekle</span>
                  </button>
                </form>
              </div>
            )}

            {/* ADD STUDENT MODAL */}
            {showAddModal && (
              <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4 animate-in fade-in border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-teal-300">Yeni Öğrenci Tanımla</h4>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ✕ Kapat
                  </button>
                </div>

                <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Okul No (Örn: 105)"
                    value={newStudentNumber}
                    onChange={(e) => setNewStudentNumber(e.target.value)}
                    className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-teal-400"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Ad Soyad (Örn: Beren Kurt)"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="sm:col-span-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-teal-400"
                  />
                  <select
                    value={newStudentClass}
                    onChange={(e) => setNewStudentClass(e.target.value)}
                    className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-teal-400"
                  >
                    {teacherClasses.map((cls: string) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>

                  <div className="sm:col-span-4 flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-bold"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Öğrenciyi Kaydet</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

          {/* Right Column: Quick info & stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-teal-600" />
                <span>Sınıf İstatistikleri</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100 text-center">
                  <div className="text-xl font-black text-teal-800">{classStudents.length}</div>
                  <div className="text-[11px] font-bold text-teal-600">{selectedClass} Mevcudu</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                  <div className="text-xl font-black text-indigo-800">{teacherClasses.length}</div>
                  <div className="text-[11px] font-bold text-indigo-600">Toplam Şube</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="font-bold text-slate-900">💡 Hızlı İpuçları</div>
                <p>
                  Öğrenciler dersin 4. Aşamasındaki &quot;Öz Değerlendirme Formunu&quot; doldurduklarında sonuçlar anında Rubrik Raporları sekmesine yansır.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 3: LESSON PLANS & CURRICULUM */}
      {activeSection === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          
          {/* Outcome 1 Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-teal-600 text-white">
                  MAT.5.3.1 (1. Hafta)
                </span>
                <Link
                  href="/lesson/MAT.5.3.1"
                  className="text-xs text-teal-800 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Derse Git</span>
                  <span>➔</span>
                </Link>
              </div>
              <div className="font-black text-sm text-slate-900">
                Temel Geometrik Çizimler ve Sembolik Gösterimler
              </div>
              <div className="text-xs text-slate-500">
                4 Aşama: Hikaye, Çizim Atölyesi, Kelime Avı, 8 Soru Test, Rubrik Öz Değerlendirme
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  const out = getOutcomeById('MAT.5.3.1');
                  if (out) {
                    playSound('select');
                    setActivePlanOutcome(out);
                  }
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Günlük Planı İndir (PDF)</span>
              </button>
            </div>
          </div>

          {/* Outcome 2 Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-indigo-600 text-white">
                  MAT.5.3.2 (2. Hafta)
                </span>
                <Link
                  href="/lesson/MAT.5.3.2"
                  className="text-xs text-indigo-800 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Derse Git</span>
                  <span>➔</span>
                </Link>
              </div>
              <div className="font-black text-sm text-slate-900">
                Geometrik İnşa ve Çıkarım: Cetvel, Pergel, Gönye
              </div>
              <div className="text-xs text-slate-500">
                Ölçüsüz Cetvel, Pergel ile Eşit Parçalar, Gönye ile Tek Dikme & Paralellik
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  const out = getOutcomeById('MAT.5.3.2');
                  if (out) {
                    playSound('select');
                    setActivePlanOutcome(out);
                  }
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Günlük Planı İndir (PDF)</span>
              </button>
            </div>
          </div>

          {/* Outcome 3 Card: MAT.5.3.3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-amber-600 text-white">
                  MAT.5.3.3 (3. Hafta)
                </span>
                <Link
                  href="/lesson/MAT.5.3.3"
                  className="text-xs text-amber-800 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Derse Git</span>
                  <span>➔</span>
                </Link>
              </div>
              <div className="font-black text-sm text-slate-900">
                Açı Çeşitleri, İletki ile Ölçüm & Radar Simülasyonu
              </div>
              <div className="text-xs text-slate-500">
                İnteraktif Açı Laboratuvarı, Açı Radarı Oyunu, 5 Düzeyli Öz Değerlendirme Rubriği
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  const out = getOutcomeById('MAT.5.3.3');
                  if (out) {
                    playSound('select');
                    setActivePlanOutcome(out);
                  }
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Günlük Planı İndir (PDF)</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 4: CLASSROOM FILES & WHITEBOARD NOTES */}
      {activeSection === 'files' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header & Quick Action */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-teal-600" />
                <span>Sınıf Dosyaları & Dijital Beyaz Tahta Notları</span>
              </h3>
              <p className="text-xs text-slate-500">
                Akıllı tahtada ders esnasında yazılıp çizilen veya sisteme eklenen A4 ders notları, öğrenme çıktısı ve şube etiketleriyle burada arşivlenir. Öğrenciler de kendi panellerinden bu notları PDF olarak indirebilir.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setDashboardWhiteboardOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
            >
              <Presentation className="w-4 h-4" />
              <span>Yeni Beyaz Tahta Notu Oluştur</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filesSearchTerm}
                onChange={(e) => setFilesSearchTerm(e.target.value)}
                placeholder="Ders notu başlığı, etiket veya konu ara..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={filesOutcomeFilter}
                onChange={(e) => setFilesOutcomeFilter(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none focus:border-teal-500"
              >
                <option value="all">Tüm Kazanımlar</option>
                <option value="MAT.5.3.1">MAT.5.3.1 (1. Hafta)</option>
                <option value="MAT.5.3.2">MAT.5.3.2 (2. Hafta)</option>
                <option value="MAT.5.3.3">MAT.5.3.3 (3. Hafta)</option>
                <option value="MAT.5.3.4">MAT.5.3.4 (4. Hafta)</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={filesClassFilter}
                onChange={(e) => setFilesClassFilter(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none focus:border-teal-500"
              >
                <option value="all">Tüm Şubeler</option>
                {teacherClasses.map((cls: string) => (
                  <option key={cls} value={cls}>
                    {cls} Şubesi
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Files Grid */}
          {(() => {
            const filtered = classroomFiles.filter((f) => {
              const matchOutcome = filesOutcomeFilter === 'all' || f.outcomeCode === filesOutcomeFilter;
              const matchClass =
                filesClassFilter === 'all' ||
                f.classSection === filesClassFilter ||
                f.classSection === 'Tümü';
              const matchSearch =
                !filesSearchTerm ||
                f.title.toLowerCase().includes(filesSearchTerm.toLowerCase()) ||
                f.tags.some((t) => t.toLowerCase().includes(filesSearchTerm.toLowerCase())) ||
                f.authorName.toLowerCase().includes(filesSearchTerm.toLowerCase());
              return matchOutcome && matchClass && matchSearch;
            });

            if (filtered.length === 0) {
              return (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-xl font-bold">
                    📂
                  </div>
                  <div className="text-sm font-black text-slate-800">
                    Aramanıza Uygun Ders Notu Bulunamadı
                  </div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Henüz bu filtreye ait bir beyaz tahta ders notu kaydedilmemiş veya arama kriteriyle eşleşen sonuç yok.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFilesSearchTerm('');
                      setFilesOutcomeFilter('all');
                      setFilesClassFilter('all');
                    }}
                    className="text-xs font-bold text-teal-600 hover:underline"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((file) => (
                  <div
                    key={file.id}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-black text-[11px] border border-teal-200">
                          {file.outcomeCode} • {file.classSection}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          <span>{file.pageCount} Sayfa</span>
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-sm text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                          {file.title}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          {file.outcomeTitle}
                        </div>
                      </div>

                      {file.tags && file.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {file.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-semibold">{file.authorName}</span>
                        <span>{new Date(file.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap flex-1">
                        {/* 1. Görüntüle */}
                        <button
                          type="button"
                          onClick={() => {
                            playSound('select');
                            setViewingFile(file);
                          }}
                          className="px-2.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Ders notunu salt okunur modda tam ekran görüntüle"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-600" />
                          <span>Görüntüle</span>
                        </button>

                        {/* 2. PDF İndir */}
                        <button
                          type="button"
                          onClick={() => handleDownloadFilePDF(file)}
                          disabled={downloadingFileId === file.id}
                          className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          title="Bu ders notunu PDF olarak indir"
                        >
                          {downloadingFileId === file.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
                              <span className="hidden sm:inline">İndiriliyor...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5 text-slate-600" />
                              <span>İndir</span>
                            </>
                          )}
                        </button>

                        {/* 3. Tahtada Aç (Öğretmen için düzenlenebilir) */}
                        <button
                          type="button"
                          onClick={() => {
                            playSound('select');
                            setEditingFileInWhiteboard(file);
                            setDashboardWhiteboardOpen(true);
                          }}
                          className="px-2.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          title="Bu notu Akıllı Tahtaya yükle ve üzerinde çizim yap"
                        >
                          <MonitorPlay className="w-3.5 h-3.5" />
                          <span>Tahtada Aç</span>
                        </button>
                      </div>

                      {/* 4. Sil */}
                      <button
                        type="button"
                        onClick={() => handleDeleteFile(file.id, file.title)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer shrink-0"
                        title="Notu Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

        </div>
      )}

      {/* Lesson Plan PDF Modal */}
      {activePlanOutcome && (
        <LessonPlanModal
          isOpen={!!activePlanOutcome}
          onClose={() => setActivePlanOutcome(null)}
          outcome={activePlanOutcome}
        />
      )}

      {/* Dashboard Whiteboard Modal (Editable Mode) */}
      {dashboardWhiteboardOpen && (
        <WhiteboardModal
          isOpen={dashboardWhiteboardOpen}
          onClose={() => {
            setDashboardWhiteboardOpen(false);
            setEditingFileInWhiteboard(null);
            setClassroomFiles(getStoredClassroomFiles());
          }}
          initialFile={editingFileInWhiteboard}
          outcomeCode={editingFileInWhiteboard?.outcomeCode || "MAT.5.3.4"}
          outcomeTitle={editingFileInWhiteboard?.outcomeTitle || "Doğruların Birbirine Göre Durumları & Açı İlişkileri"}
          classSection={editingFileInWhiteboard?.classSection || selectedClass}
        />
      )}

      {/* Whiteboard Pure Read-Only Viewer Modal */}
      {viewingFile && (
        <WhiteboardViewerModal
          isOpen={!!viewingFile}
          onClose={() => setViewingFile(null)}
          file={viewingFile}
        />
      )}

      {/* Student Detailed Outcome & Rubric Comparison Modal */}
      {selectedStudentForDetail && (
        <StudentOutcomeDetailModal
          isOpen={!!selectedStudentForDetail}
          onClose={() => setSelectedStudentForDetail(null)}
          student={selectedStudentForDetail}
          allStudents={students}
          onAwardXp={(studentId, amount) => {
            awardPointsToStudent(studentId, amount);
            playSound('bell');
          }}
          isTeacher={true}
        />
      )}

    </div>
  );
}
