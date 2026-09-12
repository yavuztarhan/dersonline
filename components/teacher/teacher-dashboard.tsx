'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAuth, splitFullName, generateRandomStudentPassword } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import Link from 'next/link';
import { UserAvatar } from '@/components/ui/user-avatar';
import { TeacherRubricAnalytics } from '@/components/teacher/teacher-rubric-analytics';
import { TeacherFormsAnalyticsReport } from '@/components/teacher/teacher-forms-analytics-report';
import { TeacherGroupsPanel } from '@/components/teacher/teacher-groups-panel';
import { TeacherBoardParticipationReport } from '@/components/teacher/teacher-board-participation-report';
import {
  ClassroomFileRecord,
  getStoredClassroomFiles,
  getVisibleClassroomFilesForTeacher,
  deleteClassroomFile,
  publishFileToClass,
  exportClassroomFileToPdf
} from '@/lib/class-files-store';
import { WhiteboardModal } from '@/components/whiteboard/whiteboard-modal';
import { WhiteboardViewerModal } from '@/components/whiteboard/whiteboard-viewer-modal';
import { ClassLeaderboard } from '@/components/gamification/class-leaderboard';
import { StudentOutcomeDetailModal } from '@/components/gamification/student-outcome-detail-modal';
import { FeedbackButton } from '@/components/feedback/feedback-button';
import { ExcelStudentImportModal } from '@/components/teacher/excel-student-import-modal';
import { SuspendedTeacherView } from '@/components/teacher/suspended-teacher-view';
import { downloadStudentCardsPDF } from '@/lib/student-cards-pdf-generator';
import { MessageInboxModal } from '@/components/messages/message-inbox-modal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import {
  FileSpreadsheet,
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
  Trophy,
  Flame,
  KeyRound,
  Copy,
  Check,
  Lock,
  ChevronDown,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  X
} from 'lucide-react';


const GRADE_OPTIONS = ['5', '6', '7', '8'];
const BRANCH_OPTIONS = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'H', 'I', 'İ',
  'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş',
  'T', 'U', 'Ü', 'V', 'Y', 'Z'
];

export function TeacherDashboard() {
  const {
    currentUser,
    students,
    teachers,
    getVisibleStudents,
    addStudent,
    deleteStudent,
    resetStudentPassword,
    addClassToTeacher,
    addClassesToTeacher,
    getSchoolClasses,
    deleteClassFromTeacher,
    awardPointsToStudent,
    classrooms,
    getClassCodeForClass
  } = useAuth();
  const { setSelectedOutcome, playSound } = useApp();
  const [activeSection, setActiveSection] = useState<'analytics' | 'forms' | 'students' | 'groups' | 'leaderboard' | 'files' | 'board'>('board');
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<any | null>(null);

  // Class code & password copy state
  const [copiedClassCode, setCopiedClassCode] = useState(false);
  const [copiedPasswordStuId, setCopiedPasswordStuId] = useState<string | null>(null);
  const [lastAddedStudent, setLastAddedStudent] = useState<{
    name: string;
    number: string;
    classCode: string;
    password: string;
  } | null>(null);

  // Student password reset states
  const [confirmResetStudent, setConfirmResetStudent] = useState<any | null>(null);
  const [resetSuccessModal, setResetSuccessModal] = useState<{
    name: string;
    number: string;
    classCode: string;
    password: string;
  } | null>(null);

  // Direct student message state (öğrenci listesindeki mesaj ikonu)
  const [messageTargetStudentId, setMessageTargetStudentId] = useState<string | null>(null);



  // Classroom Files State
  const [classroomFiles, setClassroomFiles] = useState<ClassroomFileRecord[]>([]);
  const [dashboardWhiteboardOpen, setDashboardWhiteboardOpen] = useState(false);
  const [editingFileInWhiteboard, setEditingFileInWhiteboard] = useState<ClassroomFileRecord | null>(null);
  const [viewingFile, setViewingFile] = useState<ClassroomFileRecord | null>(null);
  const [filesSearchTerm, setFilesSearchTerm] = useState('');
  const [filesTypeFilter, setFilesTypeFilter] = useState<'all' | 'whiteboard_note' | 'activity_sheet'>('all');
  const [filesClassFilter, setFilesClassFilter] = useState('all');
  const [filesOutcomeFilter, setFilesOutcomeFilter] = useState('all');
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);

  useEffect(() => {
    setClassroomFiles(getStoredClassroomFiles());
  }, []);

  // Sınıf dosyaları sekmesinde sadece bu öğretmenin oluşturduğu, düzenlediği veya kaydettiği beyaz tahta ders notları ve sınıfa gönderilen etkinlik kağıtları gösterilir.
  // Yeni kayıtlı öğretmenin sınıf dosyaları boştur.
  const visibleClassFiles = getVisibleClassroomFilesForTeacher(
    currentUser?.id,
    currentUser?.name,
    classroomFiles
  );

  // If current user is teacher
  const teacher = currentUser && currentUser.role === 'teacher' ? (currentUser as any) : null;
  const rawClasses: string[] = teacher?.assignedClasses && Array.isArray(teacher.assignedClasses)
    ? (teacher.assignedClasses as string[])
    : [];

  // Sınıfları alfabetik / doğal sırada (5-A, 5-B, 5-C, 6-A, 6-B... A-Z) sırala
  const teacherClasses: string[] = useMemo(() => {
    return [...rawClasses].sort((a, b) => a.localeCompare(b, 'tr-TR', { numeric: true }));
  }, [rawClasses]);

  const [selectedClass, setSelectedClass] = useState(teacherClasses[0] || '');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNumber, setNewStudentNumber] = useState('');
  const [newStudentClass, setNewStudentClass] = useState(selectedClass);
  const [newStudentGender, setNewStudentGender] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExcelImportModal, setShowExcelImportModal] = useState(false);

  // Sınıf Ekleme Modalı State (Okul Havuzu ve Yeni Sınıf Açma)
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [selectedPoolClasses, setSelectedPoolClasses] = useState<string[]>([]);
  const [newClassGrade, setNewClassGrade] = useState('5');
  const [newClassBranch, setNewClassBranch] = useState('A');
  const [addStudentError, setAddStudentError] = useState<string | null>(null);
  const [isGeneratingCardsPdf, setIsGeneratingCardsPdf] = useState(false);
  const [dbSchoolClasses, setDbSchoolClasses] = useState<string[]>([]);
  const [isLoadingSchoolClasses, setIsLoadingSchoolClasses] = useState(false);

  // Sınıf Silme Modalı State (Yüksek Güvenlikli)
  const [showDeleteClassModal, setShowDeleteClassModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState('');
  const [isDeleteRiskAccepted, setIsDeleteRiskAccepted] = useState(false);
  const [deleteSecurityCode, setDeleteSecurityCode] = useState('');
  const [inputDeleteSecurityCode, setInputDeleteSecurityCode] = useState('');

  // Veritabanından il, ilçe ve okul ile eşleşen tüm sınıfları canlı sorgula
  useEffect(() => {
    if (showAddClassModal && teacher?.school) {
      setIsLoadingSchoolClasses(true);
      fetch(`/api/classrooms?school=${encodeURIComponent(teacher.school)}&city=${encodeURIComponent(teacher.city || '')}&district=${encodeURIComponent(teacher.district || '')}&email=${encodeURIComponent(currentUser?.email || '')}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.schoolClasses)) {
            setDbSchoolClasses(data.schoolClasses);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingSchoolClasses(false));
    }
  }, [showAddClassModal, teacher?.school, teacher?.city, teacher?.district, currentUser?.email]);

  // Okulun tüm kayıtlı sınıfları (Ortak Havuz - Veritabanı ve Yerel Kayıtlar Birleştirilmiş)
  const schoolPoolClasses: string[] = useMemo(() => {
    const local = getSchoolClasses ? getSchoolClasses(teacher?.school) : [];
    const merged = Array.from(new Set([...dbSchoolClasses, ...local]));
    return merged.sort((a, b) => a.localeCompare(b, 'tr-TR', { numeric: true }));
  }, [getSchoolClasses, teacher?.school, dbSchoolClasses, classrooms, teachers, students]);


  // Keep selectedClass synchronized if classes change
  useEffect(() => {
    if (teacherClasses.length > 0) {
      if (!teacherClasses.includes(selectedClass)) {
        setSelectedClass(teacherClasses[0]);
      }
    } else {
      if (selectedClass !== '') {
        setSelectedClass('');
      }
    }
  }, [teacherClasses, selectedClass]);

  // Students visible to this teacher (only students in same school / added by teacher)
  const visibleStudents = getVisibleStudents(currentUser);
  const classStudents = useMemo(() => {
    return visibleStudents
      .filter((s) => s.classSection === selectedClass)
      .sort((a, b) => {
        const numA = parseInt(a.studentNumber || '0', 10);
        const numB = parseInt(b.studentNumber || '0', 10);
        if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
          return numA - numB;
        }
        return (a.name || '').localeCompare(b.name || '', 'tr-TR');
      });
  }, [visibleStudents, selectedClass]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setAddStudentError(null);
    if (!newStudentName.trim() || !newStudentNumber.trim()) return;

    const targetClass = newStudentClass || selectedClass;
    const { firstName, lastName } = splitFullName(newStudentName.trim());
    const avatar = newStudentGender === 'Kız' ? '👩‍🎓' : newStudentGender === 'Erkek' ? '👨‍🎓' : '🎓';
    const classCode = getClassCodeForClass(targetClass, teacher?.id);
    const generatedPassword = generateRandomStudentPassword(6);
    const activeBranch = teacher?.branch || 'Matematik';

    const newStudent = {
      id: `stu-${Date.now()}`,
      firstName: firstName || 'Öğrenci',
      lastName: lastName || '',
      name: newStudentName.trim(),
      role: 'student' as const,
      avatar,
      studentNumber: newStudentNumber.trim(),
      classCode,
      password: generatedPassword,
      gender: newStudentGender || undefined,
      gradeLevel: parseInt(targetClass.charAt(0)) || 5,
      classSection: targetClass,
      city: teacher?.city || 'Edirne',
      district: teacher?.district || 'Merkez',
      school: teacher?.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
      teacherId: teacher?.id,
      points: 100,
      subjectPoints: { [activeBranch]: 100 },
      unlockedBadges: ['first-step'],
      createdAt: new Date().toISOString().split('T')[0]
    };

    const res = addStudent(newStudent);
    if (res && !res.success) {
      playSound('clear');
      setAddStudentError(res.error || 'Bu öğrenci eklenemedi!');
      return;
    }

    playSound('success');
    setLastAddedStudent({
      name: newStudentName.trim(),
      number: newStudentNumber.trim(),
      classCode,
      password: generatedPassword
    });
    setNewStudentName('');
    setNewStudentNumber('');
    setNewStudentGender('');
    setAddStudentError(null);
    setShowAddModal(false);
    setSelectedClass(targetClass);
  };

  const targetNewClassName = `${newClassGrade}-${newClassBranch}`;
  const isClassAlreadyAdded = teacherClasses.includes(targetNewClassName);
  const isClassInSchoolPool = schoolPoolClasses.includes(targetNewClassName);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    const target = `${newClassGrade}-${newClassBranch}`;
    if (!target || isClassAlreadyAdded) return;

    if (teacher?.id) {
      addClassToTeacher(teacher.id, target);
    }
    playSound('click');
    setSelectedClass(target);
    setShowAddClassModal(false);
  };

  const handleAddPoolClasses = () => {
    if (!teacher?.id || selectedPoolClasses.length === 0) return;
    addClassesToTeacher(teacher.id, selectedPoolClasses);
    playSound('success');
    setSelectedClass(selectedPoolClasses[0]);
    setSelectedPoolClasses([]);
    setShowAddClassModal(false);
  };

  const handleTogglePoolClass = (className: string) => {
    setSelectedPoolClasses((prev) =>
      prev.includes(className) ? prev.filter((c) => c !== className) : [...prev, className]
    );
  };

  const handleDownloadStudentCardsPDF = async () => {
    if (classStudents.length === 0) {
      alert(`${selectedClass} şubesinde kayıtlı öğrenci bulunmuyor.`);
      return;
    }

    try {
      setIsGeneratingCardsPdf(true);
      playSound('select');
      const classCode = getClassCodeForClass(selectedClass, teacher?.id);

      await downloadStudentCardsPDF({
        schoolName: teacher?.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
        classSection: selectedClass,
        classCode: classCode || selectedClass,
        teacherName: teacher?.name,
        students: classStudents
      });

      playSound('success');
    } catch (err: any) {
      console.error('Öğrenci giriş kartları PDF hatası:', err);
      alert('Öğrenci giriş kartları PDF dosyası oluşturulurken bir hata meydana geldi.');
    } finally {
      setIsGeneratingCardsPdf(false);
    }
  };

  const generateRandomSecurityCode = (className: string) => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const cleanClass = className.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    return `SIL-${cleanClass}-${suffix}`;
  };

  const handleOpenDeleteClassModal = (className?: string) => {
    const target = className || selectedClass || teacherClasses[0] || '';
    if (!target) return;
    setClassToDelete(target);
    setIsDeleteRiskAccepted(false);
    setInputDeleteSecurityCode('');
    setDeleteSecurityCode(generateRandomSecurityCode(target));
    setShowDeleteClassModal(true);
  };

  const handleConfirmDeleteClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher?.id || !classToDelete) return;
    if (!isDeleteRiskAccepted) return;
    if (inputDeleteSecurityCode.trim().toUpperCase() !== deleteSecurityCode) return;

    const result = deleteClassFromTeacher(teacher.id, classToDelete);
    playSound('clear');

    const remainingClasses = teacherClasses.filter((c: string) => c !== classToDelete);
    setSelectedClass(remainingClasses[0] || '');

    setShowDeleteClassModal(false);
    setClassToDelete('');
    setIsDeleteRiskAccepted(false);
    setInputDeleteSecurityCode('');
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

  // Suspension Guard: If teacher account is suspended, render restricted appeal view
  if (currentUser?.role === 'teacher' && (currentUser?.accountStatus === 'beklemede' || currentUser?.status === 'suspended' || (currentUser as any)?.status === 'SUSPENDED')) {
    return <SuspendedTeacherView />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl border border-teal-800/40 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4 flex-1">
          <UserAvatar
            avatar={teacher?.avatar}
            name={teacher?.name}
            size="xl"
            className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-teal-400 bg-teal-500/20 text-teal-200 shadow-inner shrink-0"
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <FeedbackButton
            contextTitle="Öğretmen Paneli"
            tooltip="Öğretmen Paneli Hakkında Görüş & Geri Bildirim İlet"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm transition-all cursor-pointer flex items-center justify-center active:scale-95"
            iconClassName="w-4 h-4 text-teal-300"
          />

          <Link
            href="/profile"
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
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

      {/* Executive Module Switcher (7 Primary Sections) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2.5 p-2 bg-slate-200/60 rounded-3xl border border-slate-300/70 shadow-inner">
        {/* 0. Tahtaya Kalkma & Derse Katılım Raporu (NumPad) */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveSection('board');
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeSection === 'board'
              ? 'bg-white shadow-md border-amber-500 ring-2 ring-amber-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === 'board' ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-50 text-amber-700'
              }`}
            >
              <Flame className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider border border-amber-200">
              NumPad
            </span>
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeSection === 'board' ? 'text-amber-950' : 'text-slate-800'}`}>
              Tahtaya Kalkma
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Katılım & Analiz
            </div>
          </div>
          {activeSection === 'board' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-amber-500 rounded-full" />
          )}
        </button>

        {/* 1. Öz & Akran Değerlendirme Korelasyon Raporları */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveSection('forms');
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeSection === 'forms'
              ? 'bg-white shadow-md border-teal-500 ring-2 ring-teal-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === 'forms' ? 'bg-teal-600 text-white shadow-sm' : 'bg-teal-50 text-teal-700'
              }`}
            >
              <BarChart2 className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
              3D Rapor
            </span>
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeSection === 'forms' ? 'text-teal-950' : 'text-slate-800'}`}>
              Öğrenci Formları
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Akran & Korelasyon
            </div>
          </div>
          {activeSection === 'forms' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-teal-600 rounded-full" />
          )}
        </button>

        {/* 2. Öz Değerlendirme Rubrik Raporları */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveSection('analytics');
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeSection === 'analytics'
              ? 'bg-white shadow-md border-indigo-500 ring-2 ring-indigo-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === 'analytics' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-indigo-50 text-indigo-700'
              }`}
            >
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold border border-indigo-200">
              Rubrik
            </span>
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeSection === 'analytics' ? 'text-indigo-950' : 'text-slate-800'}`}>
              Öz Değerlendirme
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Rubrik Detayları
            </div>
          </div>
          {activeSection === 'analytics' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-indigo-600 rounded-full" />
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

        {/* 3. Öğrenci Grupları & Ortak Görevler */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveSection('groups');
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeSection === 'groups'
              ? 'bg-white shadow-md border-teal-600 ring-2 ring-teal-600/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === 'groups' ? 'bg-teal-600 text-white shadow-sm' : 'bg-teal-50 text-teal-700'
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black border border-teal-200">
              Takımlar
            </span>
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeSection === 'groups' ? 'text-teal-950' : 'text-slate-800'}`}>
              Gruplar & Ödevler
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Takım Çalışması
            </div>
          </div>
          {activeSection === 'groups' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-teal-600 rounded-full" />
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

        {/* Sınıf Dosyaları & Ders Notları */}
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
              {visibleClassFiles.length} Dosya
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

      {/* SECTION: SMART BOARD PARTICIPATION & NUMPAD ANALYTICS */}
      {activeSection === 'board' && (
        <TeacherBoardParticipationReport teacherBranch={teacher?.branch} />
      )}

      {/* SECTION: CLASS LEADERBOARD & XP RANKINGS */}
      {activeSection === 'leaderboard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <ClassLeaderboard
            initialClassSection={selectedClass}
            showTeacherControls={true}
            availableClasses={teacherClasses}
            activeSubject={teacher?.branch || 'Matematik'}
          />
        </div>
      )}

      {/* SECTION: GROUPS & COLLABORATIVE TASKS */}
      {activeSection === 'groups' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <TeacherGroupsPanel
            selectedClass={selectedClass}
            onSelectClass={(cls) => setSelectedClass(cls)}
            availableClasses={teacherClasses}
          />
        </div>
      )}

      {/* SECTION: FORMS & 3-WAY CORRELATION ANALYTICS */}
      {activeSection === 'forms' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <TeacherFormsAnalyticsReport
            teacherClasses={teacherClasses}
            teacherSchool={teacher?.school}
            teacherName={teacher?.name}
            teacherBranch={teacher?.branch}
          />
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
            onOpenStudentDetail={(stu) => setSelectedStudentForDetail(stu)}
          />
        </div>
      )}

      {/* SECTION 2: CLASS & STUDENT MANAGEMENT */}
      {activeSection === 'students' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {teacherClasses.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center space-y-4 max-w-xl mx-auto my-8 animate-in fade-in">
              <div className="w-16 h-16 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center text-3xl mx-auto text-teal-600 shadow-inner">
                🏫
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900">
                  Henüz Tanımlı Bir Sınıfınız Bulunmamaktadır
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                  Öğrencilerinizi ve ders akışlarını yönetebilmek için okulunuzun mevcut sınıflarından seçebilir veya yeni bir sınıf ekleyebilirsiniz.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Sınıf Ekle</span>
                </button>
              </div>
            </div>
          ) : (
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

                    {/* Sınıf Sil Butonu */}
                    {teacherClasses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleOpenDeleteClassModal(selectedClass)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-100/70 transition-colors flex items-center gap-1 cursor-pointer"
                        title={`${selectedClass} Sınıfını ve Tüm Verilerini Sil`}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sınıfı Sil</span>
                      </button>
                    )}
                  </div>

                  {/* Sınıf Kodu Rozeti */}
                  {(() => {
                    const code = getClassCodeForClass(selectedClass, teacher?.id);
                    return (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-xs font-bold shadow-xs">
                        <KeyRound className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="text-[11px] text-indigo-600 font-semibold">{selectedClass} Kodu:</span>
                        <span className="font-mono font-black tracking-widest text-indigo-950 bg-white px-2 py-0.5 rounded border border-indigo-200">
                          {code}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(code);
                            }
                            playSound('click');
                            setCopiedClassCode(true);
                            setTimeout(() => setCopiedClassCode(false), 2000);
                          }}
                          className="p-1 hover:bg-indigo-100 rounded text-indigo-600 transition-colors cursor-pointer"
                          title="Sınıf Kodunu Kopyala"
                        >
                          {copiedClassCode ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    );
                  })()}

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Giriş Kartları PDF İndir Butonu */}
                    <button
                      type="button"
                      onClick={handleDownloadStudentCardsPDF}
                      disabled={isGeneratingCardsPdf || classStudents.length === 0}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={`${selectedClass} şubesindeki ${classStudents.length} öğrenci için kesilebilir giriş yönergeli şifre kartları PDF'i indir`}
                    >
                      {isGeneratingCardsPdf ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      ) : (
                        <Download className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                      <span>{isGeneratingCardsPdf ? 'PDF Hazırlanıyor...' : 'Giriş Kartları (PDF)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowExcelImportModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="e-Okul Excel dosyasından sınıf listesini otomatik yükle"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Excel&apos;den Yükle (e-Okul)</span>
                    </button>

                    <button
                      type="button"
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
              </div>

              {/* Son Eklenen Öğrenci Şifre Kartı */}
              {lastAddedStudent && (
                <div className="p-4 bg-indigo-50/90 border border-indigo-200 rounded-2xl flex items-start justify-between gap-3 animate-in fade-in">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                      🎓
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-indigo-950">
                        Öğrenci Başarıyla Eklendi: {lastAddedStudent.name}
                      </h5>
                      <p className="text-[11px] text-indigo-700 mt-0.5">
                        Öğrenci sisteme e-posta olmadan bu 3 parametre ile giriş yapabilir:
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                        <span className="bg-white px-2.5 py-1 rounded-lg border border-indigo-200 text-slate-800">
                          <strong className="text-slate-500">1. Sınıf Kodu:</strong>{' '}
                          <code className="font-mono font-black text-indigo-900 ml-1">{lastAddedStudent.classCode}</code>
                        </span>
                        <span className="bg-white px-2.5 py-1 rounded-lg border border-indigo-200 text-slate-800">
                          <strong className="text-slate-500">2. Okul No:</strong>{' '}
                          <code className="font-mono font-bold text-slate-900 ml-1">{lastAddedStudent.number}</code>
                        </span>
                        <span className="bg-white px-2.5 py-1 rounded-lg border border-indigo-200 text-slate-800">
                          <strong className="text-slate-500">3. Şifre:</strong>{' '}
                          <code className="font-mono font-black text-emerald-700 ml-1">{lastAddedStudent.password}</code>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLastAddedStudent(null)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer p-1"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                      <th className="py-2.5 px-3">No</th>
                      <th className="py-2.5 px-3">Öğrenci Adı</th>
                      <th className="py-2.5 px-3">Sınıf Kodu</th>
                      <th className="py-2.5 px-3">Giriş Şifresi</th>
                      <th className="py-2.5 px-3">Okul</th>
                      <th className="py-2.5 px-3">Puan (XP)</th>
                      <th className="py-2.5 px-3">İlerleme</th>
                      <th className="py-2.5 px-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classStudents.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          <div className="space-y-3">
                            <div className="text-3xl">🎓</div>
                            <div className="space-y-1">
                              <p className="font-bold text-xs text-slate-700">
                                {selectedClass} şubesinde henüz kayıtlı öğrenci bulunmuyor.
                              </p>
                              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                                e-Okul&apos;dan indirdiğiniz sınıf listesi Excel dosyasını tek tıkla yükleyebilir veya manuel öğrenci ekleyebilirsiniz.
                              </p>
                            </div>
                            <div className="pt-2 flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setShowExcelImportModal(true)}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                              >
                                <FileSpreadsheet className="w-4 h-4" />
                                <span>e-Okul Excel ile Sınıf Yükle</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setNewStudentClass(selectedClass);
                                  setShowAddModal(true);
                                }}
                                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Manuel Ekle</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      classStudents.map((stu) => {
                        const studentCode = stu.classCode || getClassCodeForClass(selectedClass, teacher?.id);
                        const stuPass = stu.password || 'admin';
                        return (
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
                              <div className="font-bold text-slate-900 group-hover:text-teal-800 transition-colors flex items-center gap-1.5 flex-wrap">
                                <span>{stu.name}</span>
                                {stu.gender && (
                                  <span
                                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                                      stu.gender === 'Kız'
                                        ? 'bg-pink-100 text-pink-700'
                                        : stu.gender === 'Erkek'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                                    title={`Cinsiyet: ${stu.gender}`}
                                  >
                                    {stu.gender}
                                  </span>
                                )}
                                <BarChart2 className="w-3 h-3 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="text-[10px] text-slate-400">{stu.classSection} Şubesi</div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-mono font-black tracking-widest text-[11px] bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-md">
                                {studentCode}
                              </span>
                            </td>
                            <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                              {stu.isPasswordChangedByStudent ? (
                                <div className="inline-flex items-center gap-1.5 flex-wrap">
                                  <span className="inline-flex items-center gap-1 font-black text-[10px] bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md shadow-2xs">
                                    <Lock className="w-3 h-3 text-amber-600" />
                                    <span>DEĞİŞTİRİLDİ</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmResetStudent(stu)}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md text-[10px] font-black transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                                    title="Yeni Şifre Üret"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Şifre Üret</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                                  <Lock className="w-3 h-3 text-slate-400" />
                                  <span className="font-mono font-bold text-xs text-slate-800 tracking-wider">
                                    {stuPass}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (navigator.clipboard) {
                                        navigator.clipboard.writeText(stuPass);
                                      }
                                      playSound('click');
                                      setCopiedPasswordStuId(stu.id);
                                      setTimeout(() => setCopiedPasswordStuId(null), 2000);
                                    }}
                                    className="p-0.5 hover:bg-slate-200 rounded text-slate-500 transition-colors cursor-pointer"
                                    title="Şifreyi Kopyala"
                                  >
                                    {copiedPasswordStuId === stu.id ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              )}
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
                                    playSound('click');
                                    setMessageTargetStudentId(stu.id);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
                                  title={`${stu.name} adlı öğrenciye mesaj gönder`}
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
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
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SINIF EKLE POP-UP MODAL (OKUL ORTAK HAVUZU + YENİ TANIMLAMA) */}
            {showAddClassModal && typeof document !== 'undefined' && createPortal(
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
                {/* Arka Plan Karartması (Backdrop) */}
                <div
                  className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
                  onClick={() => setShowAddClassModal(false)}
                />

                {/* Pop-up Kartı */}
                <div className="relative w-full max-w-lg bg-slate-900 text-white rounded-3xl border border-teal-700/80 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                  {/* Başlık Alanı */}
                  <div className="px-6 py-5 border-b border-teal-800/80 bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-xl shadow-inner">
                        🏫
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">Sınıf / Şube Ekle</h3>
                        <p className="text-xs text-teal-300/80">
                          {teacher?.city ? `${teacher.city} / ${teacher.district} • ` : ''}{teacher?.school || 'Okulunuz'} • Sınıf Yönetimi
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddClassModal(false)}
                      className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Kapat"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6 overflow-y-auto">
                    {/* BÖLÜM 1: OKULUNUZDA KAYITLI SINIFLAR (ORTAK HAVUZ) */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-teal-400" />
                            <span>1. Okulunuzda Kayıtlı Sınıflar (Ortak Havuz)</span>
                            {isLoadingSchoolClasses && (
                              <Loader2 className="w-3 h-3 text-teal-400 animate-spin" />
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Okulunuzdaki öğretmenlerin açtığı sınıfları işaretleyerek listenize ekleyin:
                          </p>

                        </div>
                        {selectedPoolClasses.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-400 text-teal-300 font-black text-[11px]">
                            {selectedPoolClasses.length} Seçildi
                          </span>
                        )}
                      </div>

                      {schoolPoolClasses.length > 0 ? (
                        <div className="space-y-2.5">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-1 bg-slate-950/40 rounded-2xl border border-slate-800">
                            {schoolPoolClasses.map((cName) => {
                              const isAlreadyInMyList = teacherClasses.includes(cName);
                              const isSelected = selectedPoolClasses.includes(cName);

                              if (isAlreadyInMyList) {
                                return (
                                  <div
                                    key={cName}
                                    className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs text-slate-400 select-none"
                                  >
                                    <span className="font-black text-slate-300">{cName}</span>
                                    <span className="text-[10px] bg-teal-950 text-teal-400 border border-teal-800/80 px-2 py-0.5 rounded-md font-bold">
                                      ✓ Ekli
                                    </span>
                                  </div>
                                );
                              }

                              return (
                                <button
                                  key={cName}
                                  type="button"
                                  onClick={() => handleTogglePoolClass(cName)}
                                  className={`p-2.5 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-teal-500/20 border-2 border-teal-400 text-white shadow-md'
                                      : 'bg-slate-800 border border-slate-700 hover:border-teal-500/60 text-slate-200'
                                  }`}
                                >
                                  <span className="font-black">{cName}</span>
                                  <div
                                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? 'bg-teal-400 text-slate-950'
                                        : 'bg-slate-700 text-transparent'
                                    }`}
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {selectedPoolClasses.length > 0 && (
                            <button
                              type="button"
                              onClick={handleAddPoolClasses}
                              className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20 animate-in fade-in"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Seçilen Sınıfları Listeme Ekle ({selectedPoolClasses.length})</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-center text-xs text-slate-400">
                          Okulunuzda henüz kayıtlı ortak bir sınıf yok. Aşağıdan ilk sınıfı tanımlayabilirsiniz.
                        </div>
                      )}
                    </div>

                    {/* AYIRAÇ */}
                    <div className="relative flex items-center justify-center my-2">
                      <div className="border-t border-slate-800 w-full" />
                      <span className="bg-slate-900 px-3 text-[11px] font-black uppercase text-slate-500 absolute">
                        veya
                      </span>
                    </div>

                    {/* BÖLÜM 2: YENİ SINIF / ŞUBE TANIMLA (HAVUZDA YOKSA) */}
                    <form onSubmit={handleAddClass} className="space-y-4">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>2. Yeni Sınıf / Şube Tanımla (Havuzda Yoksa)</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Aradığınız şube okul havuzunda bulunmuyorsa yeni sınıf açarak havuza ekleyin:
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Seviye Seçimi */}
                        <div>
                          <label className="block text-[11px] font-bold text-teal-200/90 mb-1">
                            Sınıf Seviyesi
                          </label>
                          <div className="relative">
                            <select
                              value={newClassGrade}
                              onChange={(e) => setNewClassGrade(e.target.value)}
                              className="w-full p-2.5 rounded-xl bg-slate-800 border border-teal-700/80 text-xs font-bold text-white outline-none focus:border-teal-400 appearance-none cursor-pointer pr-8"
                            >
                              {GRADE_OPTIONS.map((grade) => (
                                <option key={grade} value={grade} className="bg-slate-900 text-white">
                                  {grade}. Sınıf
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-teal-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        {/* Şube Seçimi */}
                        <div>
                          <label className="block text-[11px] font-bold text-teal-200/90 mb-1">
                            Şube Seçimi
                          </label>
                          <div className="relative">
                            <select
                              value={newClassBranch}
                              onChange={(e) => setNewClassBranch(e.target.value)}
                              className="w-full p-2.5 rounded-xl bg-slate-800 border border-teal-700/80 text-xs font-bold text-white outline-none focus:border-teal-400 appearance-none cursor-pointer pr-8"
                            >
                              {BRANCH_OPTIONS.map((branch) => (
                                <option key={branch} value={branch} className="bg-slate-900 text-white">
                                  {branch} Şubesi
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-teal-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Önizleme & Durum */}
                      <div className="p-3 rounded-2xl bg-teal-950/60 border border-teal-800/60 flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-medium">Oluşturulacak Sınıf:</span>
                        <span className="font-black px-3 py-1 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs">
                          {targetNewClassName}
                        </span>
                      </div>

                      {isClassAlreadyAdded ? (
                        <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center gap-2">
                          <span>⚠️ Bu sınıf ({targetNewClassName}) listenizde zaten mevcut!</span>
                        </div>
                      ) : isClassInSchoolPool ? (
                        <div className="p-2.5 rounded-xl bg-blue-950/50 border border-blue-500/50 text-blue-300 text-xs font-bold flex items-center gap-2">
                          <span>ℹ️ {targetNewClassName} okul havuzunda zaten kayıtlı. Yukarıdaki listeden işaretleyerek ekleyebilirsiniz.</span>
                        </div>
                      ) : null}

                      {/* Butonlar */}
                      <div className="flex items-center justify-end gap-3 pt-2 border-t border-teal-800/60">
                        <button
                          type="button"
                          onClick={() => setShowAddClassModal(false)}
                          className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                        >
                          Kapat
                        </button>
                        <button
                          type="submit"
                          disabled={isClassAlreadyAdded || isClassInSchoolPool}
                          className={`py-2.5 px-5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                            isClassAlreadyAdded || isClassInSchoolPool
                              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                              : 'bg-teal-500 hover:bg-teal-400 text-slate-950 cursor-pointer shadow-lg shadow-teal-500/20'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          <span>{targetNewClassName} Sınıfını Aç ve Listeme Ekle</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>,
              document.body
            )}

            {/* SINIF SİL POP-UP MODAL (YÜKSEK GÜVENLİKLİ VE KOD DOĞRULAMALI) */}
            {showDeleteClassModal && typeof document !== 'undefined' && createPortal(
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                  onClick={() => setShowDeleteClassModal(false)}
                />

                <div className="relative w-full max-w-lg bg-slate-950 text-white rounded-3xl border-2 border-rose-600/80 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 animate-pulse" />
                  
                  <div className="p-5 sm:p-6 pb-4 border-b border-rose-900/40 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-rose-400">
                          Sınıfı ve Tüm Verilerini Kalıcı Olarak Sil
                        </h4>
                        <p className="text-xs text-slate-400">
                          Bu işlem geri alınamaz ve sınıfa ait tüm verileri siler.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDeleteClassModal(false)}
                      className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Kapat"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* Sınıf Seçimi / Teyidi */}
                    <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs text-slate-300 font-bold">Silinecek Sınıf / Şube:</span>
                        <select
                          value={classToDelete}
                          onChange={(e) => {
                            const newTarget = e.target.value;
                            setClassToDelete(newTarget);
                            setDeleteSecurityCode(generateRandomSecurityCode(newTarget));
                            setInputDeleteSecurityCode('');
                            setIsDeleteRiskAccepted(false);
                          }}
                          className="p-2 rounded-xl bg-slate-900 border border-rose-700 text-xs font-black text-rose-300 outline-none cursor-pointer"
                        >
                          {teacherClasses.map((cls: string) => (
                            <option key={cls} value={cls}>
                              {cls} Şubesi
                            </option>
                          ))}
                        </select>
                      </div>

                      {(() => {
                        const studentsInTarget = visibleStudents.filter((s) => s.classSection === classToDelete);
                        return (
                          <div className="text-xs text-rose-200/90 leading-relaxed bg-rose-950/70 p-3 rounded-xl border border-rose-900/80">
                            ⚠️ <strong>{classToDelete}</strong> şubesinde kayıtlı toplam <span className="font-black underline text-white">{studentsInTarget.length} öğrenci</span> bulunmaktadır. Sınıf silindiğinde bu öğrencilerin tüm hesapları, şifreleri, ders içi XP puanları, öz değerlendirme/rubrik karneleri ve akıllı tahta katılım geçmişleri <span className="underline font-bold">kalıcı olarak silinecektir</span>.
                          </div>
                        );
                      })()}
                    </div>

                    <form onSubmit={handleConfirmDeleteClass} className="space-y-4">
                      {/* ADIM 1: Risk Kabul Onay Kutusu */}
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          id="acceptClassDeleteRisk"
                          checked={isDeleteRiskAccepted}
                          onChange={(e) => setIsDeleteRiskAccepted(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-rose-600 text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600"
                        />
                        <label htmlFor="acceptClassDeleteRisk" className="text-xs text-slate-300 font-semibold cursor-pointer select-none">
                          <strong className="text-rose-400 font-bold">{classToDelete}</strong> şubesindeki tüm öğrenci hesaplarının ve geçmiş etkinlik verilerinin geri getirilemeyecek şekilde silineceğini anladım ve kabul ediyorum.
                        </label>
                      </div>

                      {/* ADIM 2: Güvenlik Kodu Doğrulaması */}
                      <div className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isDeleteRiskAccepted
                          ? 'bg-slate-900/90 border-teal-700/60 shadow-md'
                          : 'bg-slate-900/40 border-slate-800 opacity-60 pointer-events-none'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-xs font-bold text-slate-300">
                            Güvenlik Doğrulama Kodu:
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm tracking-widest px-3 py-1 rounded-xl bg-amber-400 text-slate-950 shadow-sm select-all">
                              {deleteSecurityCode}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteSecurityCode(generateRandomSecurityCode(classToDelete));
                                setInputDeleteSecurityCode('');
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
                              title="Yeni Kod Üret"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] text-slate-400 mb-1.5">
                            Silme işlemini onaylamak için yukarıdaki güvenlik kodunu kutucuğa aynen yazınız:
                          </p>
                          <input
                            type="text"
                            disabled={!isDeleteRiskAccepted}
                            placeholder={deleteSecurityCode}
                            value={inputDeleteSecurityCode}
                            onChange={(e) => setInputDeleteSecurityCode(e.target.value.toUpperCase().trim())}
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono font-bold tracking-wider text-white outline-none focus:border-rose-500 uppercase"
                          />
                        </div>

                        {/* Kod Eşleşme Durumu */}
                        {inputDeleteSecurityCode && (
                          <div className="text-[11px] font-bold flex items-center gap-1.5">
                            {inputDeleteSecurityCode === deleteSecurityCode ? (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Güvenlik kodu doğrulandı, silme işlemi yapılabilir.
                              </span>
                            ) : (
                              <span className="text-rose-400">
                                ✕ Girilen kod güvenlik koduyla eşleşmiyor.
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Butonlar */}
                      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setShowDeleteClassModal(false)}
                          className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                        >
                          İptal Et
                        </button>
                        <button
                          type="submit"
                          disabled={!isDeleteRiskAccepted || inputDeleteSecurityCode !== deleteSecurityCode}
                          className={`w-full sm:w-auto py-2.5 px-6 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                            isDeleteRiskAccepted && inputDeleteSecurityCode === deleteSecurityCode
                              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 cursor-pointer animate-pulse'
                              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>{classToDelete} Sınıfını ve Tüm Verilerini Kalıcı Olarak Sil</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>,
              document.body
            )}

            {/* RESET STUDENT PASSWORD CONFIRMATION MODAL */}
            {confirmResetStudent && typeof document !== 'undefined' && createPortal(
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
                <div
                  className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
                  onClick={() => setConfirmResetStudent(null)}
                />
                <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 z-10 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-amber-600 font-black text-sm">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <span>Şifre Sıfırlama Onayı</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConfirmResetStudent(null)}
                      className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                      <p className="text-xs font-bold text-amber-950">
                        Öğrenci: <span className="font-extrabold text-amber-900">{confirmResetStudent.name}</span> (#{confirmResetStudent.studentNumber})
                      </p>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Sınıf / Şube: {confirmResetStudent.classSection} Şubesi
                      </p>
                    </div>
                    <p className="text-sm font-bold text-slate-800 leading-relaxed">
                      Öğrenci şifresini değiştirmiş yeni şifre üretmek istediğinizden emin misiniz?
                    </p>
                    <p className="text-xs text-slate-500">
                      Onaylarsanız öğrenci için sistem tarafından harf ve rakamlardan oluşan 6 haneli rastgele yeni bir şifre üretilecek ve öğrencinin kendi belirlediği şifre silinecektir.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setConfirmResetStudent(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const stu = confirmResetStudent;
                        const res = resetStudentPassword(stu.id);
                        if (res.success && res.newPassword) {
                          playSound('success');
                          setResetSuccessModal({
                            name: stu.name,
                            number: stu.studentNumber || '',
                            classCode: stu.classCode || '',
                            password: res.newPassword
                          });
                        }
                        setConfirmResetStudent(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Yeni Şifre Üret</span>
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )}

            {/* RESET STUDENT PASSWORD SUCCESS MODAL */}
            {resetSuccessModal && typeof document !== 'undefined' && createPortal(
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
                <div
                  className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
                  onClick={() => setResetSuccessModal(null)}
                />
                <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 z-10 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span>Yeni Şifre Üretildi!</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResetSuccessModal(null)}
                      className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                    <div className="text-xs font-bold text-slate-700">
                      <span className="text-slate-500">Öğrenci:</span> {resetSuccessModal.name} (#{resetSuccessModal.number})
                    </div>
                    <div className="flex items-center justify-between bg-white border border-emerald-200 p-3.5 rounded-xl shadow-2xs">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Yeni Giriş Şifresi</div>
                        <div className="font-mono font-black text-xl text-emerald-700 tracking-widest">{resetSuccessModal.password}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(resetSuccessModal.password);
                          }
                          playSound('click');
                        }}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopyala</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Öğrencinin kendi belirlediği şifre silindi. Yeni şifre tabloda gösterilmektedir ve öğrenci artık bu şifre ile giriş yapabilir.
                    </p>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setResetSuccessModal(null)}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Tamam
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )}

            {/* ADD STUDENT MODAL */}
            {showAddModal && (
              <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4 animate-in fade-in border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-teal-300">Yeni Öğrenci Tanımla</h4>
                  <button
                    onClick={() => {
                      setAddStudentError(null);
                      setShowAddModal(false);
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ✕ Kapat
                  </button>
                </div>

                {addStudentError && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{addStudentError}</span>
                  </div>
                )}

                <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
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
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value)}
                    className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-teal-400 cursor-pointer"
                  >
                    <option value="">Cinsiyet (İsteğe Bağlı)</option>
                    <option value="Kız">Kız</option>
                    <option value="Erkek">Erkek</option>
                  </select>
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

                  <div className="sm:col-span-5 flex items-center justify-between gap-2 pt-1 flex-wrap">
                    <div className="text-[11px] text-teal-300 flex items-center gap-1.5 font-medium">
                      <KeyRound className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>Sistem öğrenci için otomatik şifre ve 6 haneli sınıf kodu üretecektir. E-posta gerekmez.</span>
                    </div>
                    <div className="flex items-center gap-2">
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
                  </div>
                </form>
              </div>
            )}
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
                Akıllı tahtada ders esnasında yazılıp çizilen veya sınıfa gönderilen düzenlenmiş A4 etkinlik kağıtları ve ders notları, öğrenme çıktısı ve şube etiketleriyle burada arşivlenir. Öğrenciler de kendi panellerinden bu notları PDF olarak indirebilir.
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
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filesSearchTerm}
                onChange={(e) => setFilesSearchTerm(e.target.value)}
                placeholder="Ders notu başlığı, etiket veya konu ara..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>

            {/* File Type Filter */}
            <div className="sm:col-span-3">
              <select
                value={filesTypeFilter}
                onChange={(e) => setFilesTypeFilter(e.target.value as any)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none focus:border-teal-500"
              >
                <option value="all">Tüm Türler</option>
                <option value="whiteboard_note">📐 Beyaz Tahta Notları</option>
                <option value="activity_sheet">📝 Sınıfa Gönderilen Etkinlik Kağıtları</option>
              </select>
            </div>

            <div className="sm:col-span-2">
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

            <div className="sm:col-span-2">
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
            const filtered = visibleClassFiles.filter((f) => {
              const isSheet =
                f.fileType === 'activity_sheet' ||
                f.tags?.includes('Etkinlik Kağıdı') ||
                f.id?.startsWith('file-activity-') ||
                f.title.toLowerCase().includes('etkinlik');
              const matchType =
                filesTypeFilter === 'all' ||
                (filesTypeFilter === 'activity_sheet' && isSheet) ||
                (filesTypeFilter === 'whiteboard_note' && !isSheet);
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
              return matchType && matchOutcome && matchClass && matchSearch;
            });

            if (filtered.length === 0) {
              return (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-xl font-bold">
                    📂
                  </div>
                  <div className="text-sm font-black text-slate-800">
                    Aramanıza Uygun Dosya Bulunamadı
                  </div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Henüz bu filtreye ait bir beyaz tahta ders notu veya sınıfa gönderilmiş etkinlik kağıdı kaydedilmemiş.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFilesSearchTerm('');
                      setFilesTypeFilter('all');
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
                {filtered.map((file) => {
                  const isSheet =
                    file.fileType === 'activity_sheet' ||
                    file.tags?.includes('Etkinlik Kağıdı') ||
                    file.id?.startsWith('file-activity-') ||
                    file.title.toLowerCase().includes('etkinlik');

                  return (
                    <div
                      key={file.id}
                      className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-black text-[11px] border border-teal-200">
                              {file.outcomeCode} • {file.classSection}
                            </span>
                            {/* Distinct Type Badge */}
                            {isSheet ? (
                              <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-black text-[10px] border border-amber-300 flex items-center gap-1">
                                <span>📝</span>
                                <span>Etkinlik Kağıdı</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-lg bg-teal-100 text-teal-900 font-black text-[10px] border border-teal-300 flex items-center gap-1">
                                <span>📐</span>
                                <span>Beyaz Tahta Notu</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-extrabold flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" />
                            <span>{file.pageCount} Sayfa</span>
                          </span>
                        </div>

                        {/* Publish Status for Activity Sheets */}
                        {isSheet && (
                          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <span className="text-[11px] font-bold text-slate-600">Sınıf Dosyaları Durumu:</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newStatus = !file.isPublishedToClass;
                                publishFileToClass(file.id, newStatus, currentUser?.id);
                                setClassroomFiles(getStoredClassroomFiles());
                                playSound(newStatus ? 'success' : 'click');
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition-all ${
                                file.isPublishedToClass
                                  ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              }`}
                              title={file.isPublishedToClass ? 'Öğrenciler görüyor. Gizlemek için tıklayın.' : 'Sınıfa göndermek için tıklayın.'}
                            >
                              {file.isPublishedToClass ? '✅ Sınıfa Gönderildi' : '🔒 Taslak (Sınıfa Gönder)'}
                            </button>
                          </div>
                        )}

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

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      {/* Primary Action: Akıllı Tahtada Aç & Düzenle */}
                      <button
                        type="button"
                        onClick={() => {
                          playSound('select');
                          setEditingFileInWhiteboard(file);
                          setDashboardWhiteboardOpen(true);
                        }}
                        className="w-full py-2.5 px-3 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-black text-xs shadow-sm shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        title="Bu notu Akıllı Tahtaya yükle ve üzerinde çizim yap"
                      >
                        <MonitorPlay className="w-4 h-4 text-teal-200" />
                        <span>Akıllı Tahtada Aç & Düzenle</span>
                      </button>

                      {/* Secondary Action Row: Görüntüle, PDF İndir, Sil */}
                      <div className="grid grid-cols-12 gap-2">
                        {/* 1. Görüntüle */}
                        <button
                          type="button"
                          onClick={() => {
                            playSound('select');
                            setViewingFile(file);
                          }}
                          className="col-span-5 py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200 hover:border-teal-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          title="Ders notunu salt okunur modda tam ekran görüntüle"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>Görüntüle</span>
                        </button>

                        {/* 2. PDF İndir */}
                        <button
                          type="button"
                          onClick={() => handleDownloadFilePDF(file)}
                          disabled={downloadingFileId === file.id}
                          className="col-span-5 py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                          title="Bu ders notunu PDF olarak indir"
                        >
                          {downloadingFileId === file.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600 shrink-0" />
                              <span>İndiriliyor</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>PDF İndir</span>
                            </>
                          )}
                        </button>

                        {/* 3. Sil */}
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file.id, file.title)}
                          className="col-span-2 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 transition-all cursor-pointer flex items-center justify-center"
                          title="Notu Arşivden Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            );
          })()}

        </div>
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

      {/* e-Okul Excel Sınıf İçe Aktarma Modalı */}
      <ExcelStudentImportModal
        isOpen={showExcelImportModal}
        onClose={() => setShowExcelImportModal(false)}
        defaultClass={selectedClass}
        onImportSuccess={(targetClass) => {
          setSelectedClass(targetClass);
          setShowExcelImportModal(false);
        }}
      />

      {/* Öğrenci Listesinden Doğrudan Mesaj Gönderme Modalı */}
      <MessageInboxModal
        isOpen={!!messageTargetStudentId}
        onClose={() => setMessageTargetStudentId(null)}
        defaultTab="compose"
        lockedRecipientId={messageTargetStudentId || undefined}
      />

    </div>

  );
}
