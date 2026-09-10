'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  RubricSubmissionRecord,
  getStoredSubmissions,
  calculateClassAnalytics,
  calculateOutcomeCrossClassAnalytics,
  updateTeacherFeedbackInStore
} from '@/lib/rubric-store';
import {
  LearningJournalEntry,
  getStoredJournalEntries,
  updateTeacherJournalFeedback
} from '@/lib/journal-store';
import { getRubricForOutcome } from '@/lib/rubric-data';
import {
  downloadStudentRubricPDF,
  downloadBulkClassRubricPDF
} from '@/lib/pdf-report-generator';
import { useAuth } from '@/lib/auth-store';
import { OutcomeSubmissionModal } from '@/components/teacher/outcome-submission-modal';
import { StudentOutcomeDetailModal } from '@/components/gamification/student-outcome-detail-modal';
import {
  ClipboardCheck,
  Users,
  Target,
  BarChart2,
  TrendingUp,
  Award,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  School,
  Calendar,
  Layers,
  Check,
  HelpCircle,
  Download,
  FileText,
  Loader2,
  BookOpen,
  Heart,
  RefreshCw
} from 'lucide-react';

interface TeacherRubricAnalyticsProps {
  teacherClasses?: string[];
  teacherSchool?: string;
  teacherName?: string;
  teacherBranch?: string;
  onOpenStudentDetail?: (student: any) => void;
}

type MainTabMode = 'outcome_cards' | 'student_table' | 'learning_journals' | 'cross_class';

export function TeacherRubricAnalytics({
  teacherClasses = ['5-A', '5-B', '6-A', '6-B'],
  teacherSchool,
  teacherName,
  teacherBranch,
  onOpenStudentDetail
}: TeacherRubricAnalyticsProps) {
  const { playSound } = useApp();
  const { currentUser, students } = useAuth();

  const currentTeacher = currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin') ? currentUser : null;
  const activeSchool = teacherSchool || (currentTeacher as any)?.school || 'Edirne Selimiye İmam Hatip Ortaokulu';
  const activeTeacherName = teacherName || currentTeacher?.name || 'Ahmet Yılmaz';
  const activeTeacherBranch = teacherBranch || (currentTeacher as any)?.branch || 'Matematik';

  // Navigation Sub-tab
  const [activeTab, setActiveTab] = useState<MainTabMode>('outcome_cards');

  // Submissions & Journals State
  const [submissions, setSubmissions] = useState<RubricSubmissionRecord[]>([]);
  const [journalEntries, setJournalEntries] = useState<LearningJournalEntry[]>([]);

  // Outcome Tracking Modal State
  const [selectedOutcomeForTracking, setSelectedOutcomeForTracking] = useState<{ code: string; title: string } | null>(null);
  const [localSelectedStudentForDetail, setLocalSelectedStudentForDetail] = useState<any | null>(null);

  // Filters for Class & Outcome
  const [selectedClass, setSelectedClass] = useState<string>(teacherClasses[0] || '5-A');
  const [selectedOutcomeCode, setSelectedOutcomeCode] = useState<string>('MAT.5.3.3');

  // Table Filters & Pagination
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [tableOutcomeFilter, setTableOutcomeFilter] = useState<string>('all');
  const [tableLevelFilter, setTableLevelFilter] = useState<'all' | 'Mükemmel' | 'Başarılı' | 'Orta' | 'Geliştirilmeli'>('all');
  const [tablePage, setTablePage] = useState<number>(1);
  const pageSize = 8;

  // Journal Filters & Feedback state
  const [journalSearchTerm, setJournalSearchTerm] = useState('');
  const [journalClassFilter, setJournalClassFilter] = useState<string>('all');
  const [journalOutcomeFilter, setJournalOutcomeFilter] = useState<string>('all');
  const [journalFeedbackEditingId, setJournalFeedbackEditingId] = useState<string | null>(null);
  const [journalFeedbackDraft, setJournalFeedbackDraft] = useState<string>('');
  const [journalSavedNoticeId, setJournalSavedNoticeId] = useState<string | null>(null);

  // PDF Generation loading state
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Student Rubric Detail Modal state
  const [inspectingSubmission, setInspectingSubmission] = useState<RubricSubmissionRecord | null>(null);
  const [teacherFeedbackInput, setTeacherFeedbackInput] = useState<string>('');
  const [feedbackSavedNotice, setFeedbackSavedNotice] = useState(false);

  // Load submissions & journals on mount
  useEffect(() => {
    setSubmissions(getStoredSubmissions());
    setJournalEntries(getStoredJournalEntries());
  }, []);

  const refreshData = () => {
    setSubmissions(getStoredSubmissions());
    setJournalEntries(getStoredJournalEntries());
  };

  // Distinct Available Outcomes
  const availableOutcomes = [
    { code: 'MAT.5.3.1', title: 'Doğru, Doğru Parçası ve Işın ile İlgili Temel Geometrik Çizimler', grade: 5 },
    { code: 'MAT.5.3.2', title: 'Geometrik İnşa ve Çıkarım (Cetvel, Pergel, Gönye)', grade: 5 },
    { code: 'MAT.5.3.3', title: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme', grade: 5 },
    { code: 'MAT.5.3.4', title: 'Düzlemde Doğruların Durumları ve Açı Çıkarımları', grade: 5 },
    { code: 'MAT.6.1.1', title: 'Doğal Sayılarla Dört İşlem İçeren Problemler', grade: 6 },
    { code: 'MAT.6.1.2', title: 'Bölünebilme Kuralları (2, 3, 4, 5, 6, 9, 10)', grade: 6 },
    { code: 'MAT.6.1.3', title: 'Asal Sayılar ve Asal Çarpanlara Ayırma', grade: 6 },
    { code: 'MAT.6.1.4', title: 'İki Doğal Sayının Ortak Bölenleri ve Ortak Katları', grade: 6 }
  ];

  // Calculations for Active Class
  const classAnalytics = useMemo(() => calculateClassAnalytics(selectedClass), [selectedClass, submissions]);

  // Calculations for Cross-Class Outcome Mode
  const outcomeAnalytics = useMemo(() => calculateOutcomeCrossClassAnalytics(selectedOutcomeCode), [selectedOutcomeCode, submissions]);

  // Global High-Level KPIs
  const totalSubmissionsCount = submissions.length;
  const overallAveragePercent = totalSubmissionsCount > 0
    ? Math.round(submissions.reduce((acc, cur) => acc + cur.percentage, 0) / totalSubmissionsCount)
    : 0;
  const excellentCount = submissions.filter((s) => s.performanceLevel === 'Mükemmel').length;
  const totalJournalCount = journalEntries.length;

  // Filtered Table Submissions
  const filteredTableSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchClass = selectedClass === 'all' || sub.classSection === selectedClass;
      const matchOutcome = tableOutcomeFilter === 'all' || sub.outcomeCode === tableOutcomeFilter;
      const matchLevel = tableLevelFilter === 'all' || sub.performanceLevel === tableLevelFilter;
      const matchSearch = !tableSearchTerm ||
        sub.studentName.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        sub.studentNumber.includes(tableSearchTerm) ||
        sub.outcomeCode.toLowerCase().includes(tableSearchTerm.toLowerCase());
      return matchClass && matchOutcome && matchLevel && matchSearch;
    });
  }, [submissions, selectedClass, tableOutcomeFilter, tableLevelFilter, tableSearchTerm]);

  // Table Pagination Slice
  const totalTablePages = Math.ceil(filteredTableSubmissions.length / pageSize) || 1;
  const paginatedTableSubmissions = useMemo(() => {
    const start = (tablePage - 1) * pageSize;
    return filteredTableSubmissions.slice(start, start + pageSize);
  }, [filteredTableSubmissions, tablePage]);

  // Filtered Journals
  const filteredJournals = useMemo(() => {
    return journalEntries.filter((j) => {
      const matchClass = journalClassFilter === 'all' || j.classSection === journalClassFilter;
      const matchOutcome = journalOutcomeFilter === 'all' || j.outcomeCode === journalOutcomeFilter;
      const matchSearch = !journalSearchTerm ||
        j.studentName.toLowerCase().includes(journalSearchTerm.toLowerCase()) ||
        j.studentNumber.includes(journalSearchTerm) ||
        j.studentReflection.toLowerCase().includes(journalSearchTerm.toLowerCase()) ||
        j.outcomeTitle.toLowerCase().includes(journalSearchTerm.toLowerCase());
      return matchClass && matchOutcome && matchSearch;
    });
  }, [journalEntries, journalClassFilter, journalOutcomeFilter, journalSearchTerm]);

  // Handler: Open Rubric Inspector Modal
  const handleOpenInspector = (sub: RubricSubmissionRecord) => {
    playSound('click');
    setInspectingSubmission(sub);
    setTeacherFeedbackInput(sub.teacherFeedback || '');
    setFeedbackSavedNotice(false);
  };

  // Handler: Save Rubric Teacher Feedback
  const handleSaveTeacherFeedback = () => {
    if (!inspectingSubmission) return;
    updateTeacherFeedbackInStore(inspectingSubmission.id, teacherFeedbackInput.trim());
    playSound('success');
    setFeedbackSavedNotice(true);
    refreshData();
    setInspectingSubmission({
      ...inspectingSubmission,
      teacherFeedback: teacherFeedbackInput.trim()
    });
  };

  // Handler: Save Journal Feedback
  const handleSaveJournalFeedback = (entry: LearningJournalEntry) => {
    updateTeacherJournalFeedback(entry.id, journalFeedbackDraft.trim(), entry.teacherLiked);
    playSound('success');
    setJournalSavedNoticeId(entry.id);
    setTimeout(() => setJournalSavedNoticeId(null), 3000);
    setJournalFeedbackEditingId(null);
    setJournalEntries(getStoredJournalEntries());
  };

  // Handler: Toggle Journal Star/Like
  const handleToggleJournalLike = (entry: LearningJournalEntry) => {
    const nextState = !entry.teacherLiked;
    updateTeacherJournalFeedback(entry.id, entry.teacherFeedback || '', nextState);
    playSound(nextState ? 'select' : 'clear');
    setJournalEntries(getStoredJournalEntries());
  };

  // Handler: Single Student PDF Download
  const handleDownloadSinglePDF = async (sub: RubricSubmissionRecord) => {
    try {
      setDownloadingId(sub.id);
      playSound('select');
      await downloadStudentRubricPDF(sub, {
        schoolName: activeSchool,
        teacherName: activeTeacherName,
        teacherBranch: activeTeacherBranch
      });
      playSound('success');
    } catch (err) {
      console.error('PDF indirme hatası:', err);
      alert('PDF raporu oluşturulurken bir hata oluştu.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Handler: Bulk Class PDF Download
  const handleDownloadBulkPDF = async (
    targetSubmissions: RubricSubmissionRecord[],
    loadingKey: string,
    meta?: { classSection?: string; outcomeCode?: string; outcomeTitle?: string }
  ) => {
    if (!targetSubmissions || targetSubmissions.length === 0) {
      alert('İndirilecek öğrenci değerlendirmesi bulunmuyor.');
      return;
    }
    try {
      setDownloadingId(loadingKey);
      playSound('select');
      await downloadBulkClassRubricPDF(targetSubmissions, {
        schoolName: activeSchool,
        teacherName: activeTeacherName,
        teacherBranch: activeTeacherBranch,
        ...meta
      });
      playSound('success');
    } catch (err) {
      console.error('Toplu PDF indirme hatası:', err);
      alert('Toplu PDF raporu oluşturulurken bir hata oluştu.');
    } finally {
      setDownloadingId(null);
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Mükemmel':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">🌟 Mükemmel (17-20)</span>;
      case 'Başarılı':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-teal-100 text-teal-800 border border-teal-300">🎯 Başarılı (13-16)</span>;
      case 'Orta':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">🔄 Orta (9-12)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">💡 Geliştirilmeli (5-8)</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans text-slate-800">
      
      {/* 1. Header Banner & High Level KPIs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-black uppercase tracking-wider">
              <ClipboardCheck className="w-4 h-4 text-teal-600" />
              <span>Türkiye Yüzyılı Maarif Modeli • Öğretmen Değerlendirme & Gelişim Paneli</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Öz Değerlendirme & Öğrenme Günlüğü Raporları
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Öğrencilerinizin her öğrenme çıktısında doldurduğu 4 kademeli analitik rubrik sonuçlarını, yansıtma çıkış biletlerini ve sınıf karşılaştırmalarını modüler olarak inceleyin.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              refreshData();
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start lg:self-center"
            title="Verileri Yenile"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Verileri Yenile</span>
          </button>
        </div>

        {/* Global KPI Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Toplam Rubrik Formu</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{totalSubmissionsCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-base">
              📋
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Genel Yetkinlik</div>
              <div className="text-2xl font-black text-teal-600 mt-0.5">%{overallAveragePercent}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-base">
              📈
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mükemmel Düzey</div>
              <div className="text-2xl font-black text-emerald-600 mt-0.5">{excellentCount} Öğrenci</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
              🌟
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Öğrenme Günlükleri</div>
              <div className="text-2xl font-black text-indigo-600 mt-0.5">{totalJournalCount} Kayıt</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-base">
              📖
            </div>
          </div>
        </div>
      </div>

      {/* 2. Professional Sub-Tab Navigation Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-2 bg-slate-200/60 rounded-3xl border border-slate-300/70 shadow-inner">
        {/* Tab 1: Kazanım Rapor Kartları */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            setActiveTab('outcome_cards');
          }}
          className={`relative p-3 rounded-2xl transition-all duration-200 cursor-pointer text-left flex items-center gap-3 border-2 ${
            activeTab === 'outcome_cards'
              ? 'bg-white shadow-md border-teal-500 ring-2 ring-teal-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
            activeTab === 'outcome_cards' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'
          }`}>
            <BarChart2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className={`font-black text-xs truncate ${activeTab === 'outcome_cards' ? 'text-teal-950' : 'text-slate-800'}`}>
              Kazanım Kartları
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              Özet & Ölçüt Dağılımı
            </div>
          </div>
        </button>

        {/* Tab 2: Öğrenci Formları Listesi */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            setActiveTab('student_table');
          }}
          className={`relative p-3 rounded-2xl transition-all duration-200 cursor-pointer text-left flex items-center gap-3 border-2 ${
            activeTab === 'student_table'
              ? 'bg-white shadow-md border-teal-500 ring-2 ring-teal-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
            activeTab === 'student_table' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'
          }`}>
            <ClipboardCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className={`font-black text-xs truncate ${activeTab === 'student_table' ? 'text-teal-950' : 'text-slate-800'}`}>
              Öğrenci Formları
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              Detaylı Tablo & PDF
            </div>
          </div>
        </button>

        {/* Tab 3: Öğrenci Öğrenme Günlükleri */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            setActiveTab('learning_journals');
          }}
          className={`relative p-3 rounded-2xl transition-all duration-200 cursor-pointer text-left flex items-center gap-3 border-2 ${
            activeTab === 'learning_journals'
              ? 'bg-white shadow-md border-indigo-500 ring-2 ring-indigo-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
            activeTab === 'learning_journals' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'
          }`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className={`font-black text-xs truncate ${activeTab === 'learning_journals' ? 'text-indigo-950' : 'text-slate-800'}`}>
              Öğrenme Günlükleri
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              Çıkış Bileti & Yansıtma
            </div>
          </div>
        </button>

        {/* Tab 4: Şubeler Arası Kıyaslama */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            setActiveTab('cross_class');
          }}
          className={`relative p-3 rounded-2xl transition-all duration-200 cursor-pointer text-left flex items-center gap-3 border-2 ${
            activeTab === 'cross_class'
              ? 'bg-white shadow-md border-amber-500 ring-2 ring-amber-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
            activeTab === 'cross_class' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'
          }`}>
            <Target className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className={`font-black text-xs truncate ${activeTab === 'cross_class' ? 'text-amber-950' : 'text-slate-800'}`}>
              Şube Kıyaslama
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              Kazanım Karşılaştırma
            </div>
          </div>
        </button>
      </div>

      {/* 3. SUB-TAB 1: KAZANIM RAPOR KARTLARI (ÖZET GÖRÜNÜM) */}
      {activeTab === 'outcome_cards' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Class Selector Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">İncelenen Şube:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {teacherClasses.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => {
                      playSound('click');
                      setSelectedClass(cls);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedClass === cls
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-102'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cls} Şubesi
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-bold text-slate-500">
              {selectedClass} Şubesi Genel Başarısı: <strong className="text-teal-700 font-black text-sm">%{classAnalytics.overallAvgPercent}</strong>
            </div>
          </div>

          {/* Outcomes Summary Cards for this Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classAnalytics.outcomeStats.map((stat) => (
              <div
                key={stat.outcomeCode}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-teal-400 transition-all shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-teal-600 text-white text-[10px] font-black uppercase font-mono">
                      {stat.outcomeCode}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">
                      {stat.outcomeTitle}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-teal-600 font-mono">%{stat.avgPercent}</div>
                    <div className="text-[10px] font-bold text-slate-400">Ortalama Başarı</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                    style={{ width: `${stat.avgPercent}%` }}
                  />
                </div>

                {/* 5 Criteria Average Indicators */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Ölçüt Bazlı Şube Ortalamaları (1.0 - 4.0):
                  </div>
                  <div className="grid grid-cols-5 gap-1 text-center font-mono text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[9px] text-slate-400 font-sans font-bold truncate">Kavram</div>
                      <div className="font-black text-slate-900 mt-0.5">{stat.criteriaAvgs['c1']}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[9px] text-slate-400 font-sans font-bold truncate">Araç / İletki</div>
                      <div className="font-black text-slate-900 mt-0.5">{stat.criteriaAvgs['c2']}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[9px] text-slate-400 font-sans font-bold truncate">Sınıflandırma</div>
                      <div className="font-black text-slate-900 mt-0.5">{stat.criteriaAvgs['c3']}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[9px] text-slate-400 font-sans font-bold truncate">Yanılgı</div>
                      <div className="font-black text-slate-900 mt-0.5">{stat.criteriaAvgs['c4']}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[9px] text-slate-400 font-sans font-bold truncate">Öz Düzenleme</div>
                      <div className="font-black text-slate-900 mt-0.5">{stat.criteriaAvgs['c5']}</div>
                    </div>
                  </div>
                </div>

                {/* Performance Distribution Badges */}
                <div className="flex items-center justify-between text-xs pt-1 text-slate-600">
                  <span>Değerlendiren Öğrenci: <strong>{stat.studentCount}</strong></span>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-700 font-bold">🌟 {stat.excellentCount}</span>
                    <span>•</span>
                    <span className="text-teal-700 font-bold">🎯 {stat.goodCount}</span>
                    <span>•</span>
                    <span className="text-amber-700 font-bold">🔄 {stat.mediumCount}</span>
                    <span>•</span>
                    <span className="text-rose-700 font-bold">💡 {stat.needSupportCount}</span>
                  </div>
                </div>

                {/* Action Buttons: Tracking Modal & Bulk PDF */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setSelectedOutcomeForTracking({
                        code: stat.outcomeCode,
                        title: stat.outcomeTitle
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title={`${selectedClass} şubesindeki öğrencilerin kimlerin doldurup doldurmadığını ve gelişimlerini incele`}
                  >
                    <Users className="w-3.5 h-3.5 text-teal-200" />
                    <span>Öğrenci Takibi & Formlar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadBulkPDF(
                      stat.submissions,
                      `bulk-${selectedClass}-${stat.outcomeCode}`,
                      { classSection: selectedClass, outcomeCode: stat.outcomeCode, outcomeTitle: stat.outcomeTitle }
                    )}
                    disabled={downloadingId !== null || stat.submissions.length === 0}
                    className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ml-auto"
                    title={`${selectedClass} şubesindeki ${stat.submissions.length} öğrencinin raporunu tek PDF olarak indir`}
                  >
                    {downloadingId === `bulk-${selectedClass}-${stat.outcomeCode}` ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                        <span>PDF Hazırlanıyor...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-teal-600" />
                        <span>Sınıf Raporunu Toplu PDF İndir</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 4. SUB-TAB 2: ÖĞRENCİ FORM VE DEĞERLENDİRME LİSTESİ (PAGINATED TABLO) */}
      {activeTab === 'student_table' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Öğrenci Öz Değerlendirme Formları Listesi
              </h3>
              <p className="text-xs text-slate-500">
                Öğrencinin puanına ve kişisel yansıtma notuna bakmak için &quot;İncele&quot; butonuna, resmi rapor çıktısı için &quot;PDF&quot; butonuna basınız.
              </p>
            </div>

            {/* Filters & Bulk PDF Button */}
            <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
              {/* Class Filter */}
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setTablePage(1);
                }}
                className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none"
              >
                {teacherClasses.map((cls) => (
                  <option key={cls} value={cls}>{cls} Şubesi</option>
                ))}
              </select>

              {/* Outcome Filter */}
              <select
                value={tableOutcomeFilter}
                onChange={(e) => {
                  setTableOutcomeFilter(e.target.value);
                  setTablePage(1);
                }}
                className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none max-w-[160px] truncate"
              >
                <option value="all">Tüm Kazanımlar</option>
                {availableOutcomes.map((out) => (
                  <option key={out.code} value={out.code}>{out.code}</option>
                ))}
              </select>

              {/* Level Filter */}
              <select
                value={tableLevelFilter}
                onChange={(e) => {
                  setTableLevelFilter(e.target.value as any);
                  setTablePage(1);
                }}
                className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none"
              >
                <option value="all">Tüm Düzeyler</option>
                <option value="Mükemmel">🌟 Mükemmel</option>
                <option value="Başarılı">🎯 Başarılı</option>
                <option value="Orta">🔄 Orta</option>
                <option value="Geliştirilmeli">💡 Geliştirilmeli</option>
              </select>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Öğrenci / No..."
                  value={tableSearchTerm}
                  onChange={(e) => {
                    setTableSearchTerm(e.target.value);
                    setTablePage(1);
                  }}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-teal-500 w-36"
                />
              </div>

              {/* Bulk Download for All Class Submissions */}
              <button
                type="button"
                onClick={() => handleDownloadBulkPDF(
                  filteredTableSubmissions,
                  `bulk-filtered-${selectedClass}`,
                  { classSection: selectedClass, outcomeCode: tableOutcomeFilter !== 'all' ? tableOutcomeFilter : 'Tum_Kazanimlar', outcomeTitle: `${selectedClass} Şubesi Öz Değerlendirme Formları` }
                )}
                disabled={downloadingId !== null || filteredTableSubmissions.length === 0}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title={`${selectedClass} şubesinin filtrelenen ${filteredTableSubmissions.length} formunu toplu PDF olarak indir`}
              >
                {downloadingId === `bulk-filtered-${selectedClass}` ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Hazırlanıyor...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Filtreyi Toplu İndir ({filteredTableSubmissions.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-2.5 px-3">No & Öğrenci</th>
                  <th className="py-2.5 px-3">Şube</th>
                  <th className="py-2.5 px-3">Kazanım</th>
                  <th className="py-2.5 px-3 text-center">Ölçüt Puanları (c1-c5)</th>
                  <th className="py-2.5 px-3 text-center">Toplam Puan</th>
                  <th className="py-2.5 px-3">Düzey</th>
                  <th className="py-2.5 px-3">Öğretmen Notu</th>
                  <th className="py-2.5 px-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedTableSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 font-medium text-xs">
                      Seçilen kriterlere uygun öğrenci öz değerlendirme formu bulunamadı.
                    </td>
                  </tr>
                ) : (
                  paginatedTableSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">
                          #{sub.studentNumber} {sub.studentName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(sub.submittedAt).toLocaleDateString('tr-TR')}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          {sub.classSection}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[10px]">
                          {sub.outcomeCode}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <div className="flex items-center justify-center gap-1">
                          {['c1', 'c2', 'c3', 'c4', 'c5'].map((cId) => (
                            <span
                              key={cId}
                              className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${
                                sub.ratings[cId] === 4
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : sub.ratings[cId] === 3
                                  ? 'bg-teal-100 text-teal-800'
                                  : sub.ratings[cId] === 2
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {sub.ratings[cId] || '-'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-black text-slate-900 text-sm">{sub.totalScore}</span>
                        <span className="text-slate-400 text-[10px]"> / 20</span>
                      </td>
                      <td className="py-3 px-3">
                        {getLevelBadge(sub.performanceLevel)}
                      </td>
                      <td className="py-3 px-3 text-[11px]">
                        {sub.teacherFeedback ? (
                          <span className="text-teal-700 font-bold flex items-center gap-1 truncate max-w-[130px]" title={sub.teacherFeedback}>
                            <MessageSquare className="w-3 h-3 text-teal-600 shrink-0" />
                            <span>{sub.teacherFeedback}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Geri bildirim yok</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Individual Student PDF Download Button */}
                          <button
                            onClick={() => handleDownloadSinglePDF(sub)}
                            disabled={downloadingId !== null}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            title="Öğrencinin Öz Değerlendirme Raporunu PDF Olarak İndir"
                          >
                            {downloadingId === sub.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                            ) : (
                              <Download className="w-3.5 h-3.5 text-teal-600" />
                            )}
                            <span>PDF</span>
                          </button>

                          <button
                            onClick={() => handleOpenInspector(sub)}
                            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Detaylı İncele ve Öğretmen Notu Ekle"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>İncele</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredTableSubmissions.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <div>
                Toplam <strong>{filteredTableSubmissions.length}</strong> kayıttan <strong>{(tablePage - 1) * pageSize + 1}</strong> - <strong>{Math.min(tablePage * pageSize, filteredTableSubmissions.length)}</strong> arası gösteriliyor.
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                  disabled={tablePage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalTablePages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setTablePage(pg)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      tablePage === pg
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setTablePage((p) => Math.min(totalTablePages, p + 1))}
                  disabled={tablePage === totalTablePages}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 5. SUB-TAB 3: ÖĞRENCİ ÖĞRENME GÜNLÜKLERİ (ÇIKIŞ BİLETLERİ - SDB1.3) */}
      {activeTab === 'learning_journals' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Journals Filter Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Şube:</span>
              <select
                value={journalClassFilter}
                onChange={(e) => setJournalClassFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none"
              >
                <option value="all">Tüm Şubeler</option>
                {teacherClasses.map((cls) => (
                  <option key={cls} value={cls}>{cls} Şubesi</option>
                ))}
              </select>

              <span className="text-xs font-black text-slate-400 uppercase tracking-wider ml-2">Kazanım:</span>
              <select
                value={journalOutcomeFilter}
                onChange={(e) => setJournalOutcomeFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none max-w-[200px] truncate"
              >
                <option value="all">Tüm Kazanımlar</option>
                {availableOutcomes.map((out) => (
                  <option key={out.code} value={out.code}>{out.code} - {out.title}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Günlüklerde veya öğrencide ara..."
                value={journalSearchTerm}
                onChange={(e) => setJournalSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Journal Entries Feed */}
          {filteredJournals.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-2">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-base font-black text-slate-700">Henüz Öğrenme Günlüğü Bulunamadı</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Öğrenciler dersin &quot;Değerlendirme&quot; aşamasındaki &quot;Öğrenme Günlüğü&quot; sekmesinde çıkış bileti yansıtmalarını kaydettikçe burada anlık olarak görüntülenecektir.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredJournals.map((entry) => (
                <div
                  key={entry.id}
                  className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-sm space-y-4 flex flex-col justify-between ${
                    entry.teacherLiked
                      ? 'border-amber-300 bg-amber-50/20 shadow-amber-100'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center">
                          🎓
                        </div>
                        <div>
                          <div className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                            <span>#{entry.studentNumber} {entry.studentName}</span>
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                              {entry.classSection}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(entry.submittedAt).toLocaleString('tr-TR')}
                          </div>
                        </div>
                      </div>

                      {/* Star / Like Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleJournalLike(entry)}
                        className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                          entry.teacherLiked
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-400'
                        }`}
                        title={entry.teacherLiked ? 'Öğretmen Yıldızı Eklendi (Kaldırmak için tıkla)' : 'Öğretmen Yıldızı Ver (Öne Çıkar)'}
                      >
                        <Star className={`w-4 h-4 ${entry.teacherLiked ? 'fill-amber-500 text-amber-500' : ''}`} />
                        {entry.teacherLiked && <span>Yıldızlı</span>}
                      </button>
                    </div>

                    {/* Outcome Tag */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                      <span className="font-mono text-indigo-600 font-black">{entry.outcomeCode}:</span>
                      <span className="truncate max-w-[280px]">{entry.outcomeTitle}</span>
                    </div>

                    {/* Prompt Box */}
                    {entry.prompt && (
                      <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 font-medium">
                        <span className="font-bold text-indigo-800 block text-[10px] uppercase tracking-wider mb-0.5">
                          💡 Günlük Yönergesi:
                        </span>
                        &quot;{entry.prompt}&quot;
                      </div>
                    )}

                    {/* Student Reflection Bubble */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                      <span className="font-bold text-slate-500 block text-[10px] uppercase tracking-wider mb-1">
                        📝 Öğrencinin Günlük Notu:
                      </span>
                      &quot;{entry.studentReflection}&quot;
                    </div>

                    {/* Teacher Feedback Section */}
                    {entry.teacherFeedback && journalFeedbackEditingId !== entry.id && (
                      <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
                        <div className="font-bold text-teal-800 flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                            <span>Öğretmen Geri Bildiriminiz:</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setJournalFeedbackEditingId(entry.id);
                              setJournalFeedbackDraft(entry.teacherFeedback || '');
                            }}
                            className="text-[10px] text-teal-700 underline font-bold cursor-pointer"
                          >
                            Düzenle
                          </button>
                        </div>
                        <p className="italic">{entry.teacherFeedback}</p>
                      </div>
                    )}

                    {/* Inline Editor if active */}
                    {journalFeedbackEditingId === entry.id && (
                      <div className="space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Öğretmen Geri Bildirimi Yazın:
                        </label>
                        <textarea
                          rows={2}
                          value={journalFeedbackDraft}
                          onChange={(e) => setJournalFeedbackDraft(e.target.value)}
                          placeholder="Öğrencinin yansıtmasına dair teşvik edici veya düzeltici notunuz..."
                          className="w-full p-2 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:border-indigo-500"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setJournalFeedbackEditingId(null)}
                            className="px-3 py-1 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-200 cursor-pointer"
                          >
                            İptal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveJournalFeedback(entry)}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 cursor-pointer"
                          >
                            Kaydet
                          </button>
                        </div>
                      </div>
                    )}

                    {journalSavedNoticeId === entry.id && (
                      <div className="text-xs text-emerald-600 font-bold animate-in fade-in">
                        ✓ Geri bildirim kaydedildi!
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  {!entry.teacherFeedback && journalFeedbackEditingId !== entry.id && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setJournalFeedbackEditingId(entry.id);
                          setJournalFeedbackDraft('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Geri Bildirim Ekle</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* 6. SUB-TAB 4: ŞUBELER ARASI KAZANIM KIYASLAMASI */}
      {activeTab === 'cross_class' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Outcome Selector Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Kazanım Seçimi:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {availableOutcomes.map((out) => (
                  <button
                    key={out.code}
                    onClick={() => {
                      playSound('click');
                      setSelectedOutcomeCode(out.code);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedOutcomeCode === out.code
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 scale-102'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {out.code} ({out.code === 'MAT.5.3.4' ? 'Doğruların Durumları' : out.code === 'MAT.5.3.3' ? 'Açılar & İletki' : out.code === 'MAT.6.1.3' ? 'Asal Sayılar' : out.code === 'MAT.6.1.4' ? 'EBOB & EKOK' : out.code})
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-bold text-slate-500">
              Tüm Şubeler Ortalama Başarısı: <strong className="text-amber-700 font-black text-sm">%{outcomeAnalytics.overallAvgPercent}</strong>
            </div>
          </div>

          {/* Cross-Class Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {outcomeAnalytics.classStats.map((cStat) => (
              <div
                key={cStat.classSection}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-amber-400 transition-all shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-black uppercase text-amber-700 tracking-wider">Şube Raporu</span>
                      <h3 className="text-xl font-black text-slate-900">{cStat.classSection} Şubesi</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{cStat.studentCount} Öğrenci Değerlendirdi</p>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-black text-amber-600 font-mono">%{cStat.avgPercent}</div>
                      <div className="text-[10px] font-bold text-slate-400">Ortalama Skor: {cStat.avgScore}/20</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      style={{ width: `${cStat.avgPercent}%` }}
                    />
                  </div>

                  {/* Criteria Breakdown */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Ölçüt Düzeyleri (1-4):
                    </div>
                    <div className="grid grid-cols-5 gap-1 text-center font-mono text-xs">
                      <div className="p-1.5 rounded-lg bg-slate-50 border">
                        <div className="text-[8px] text-slate-400">c1</div>
                        <div className="font-bold text-slate-800">{cStat.criteriaAvgs['c1']}</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-50 border">
                        <div className="text-[8px] text-slate-400">c2</div>
                        <div className="font-bold text-slate-800">{cStat.criteriaAvgs['c2']}</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-50 border">
                        <div className="text-[8px] text-slate-400">c3</div>
                        <div className="font-bold text-slate-800">{cStat.criteriaAvgs['c3']}</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-50 border">
                        <div className="text-[8px] text-slate-400">c4</div>
                        <div className="font-bold text-slate-800">{cStat.criteriaAvgs['c4']}</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-50 border">
                        <div className="text-[8px] text-slate-400">c5</div>
                        <div className="font-bold text-slate-800">{cStat.criteriaAvgs['c5']}</div>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-emerald-700 font-bold">🌟 {cStat.excellentCount} Mükemmel</span>
                    <span className="text-amber-700 font-bold">💡 {cStat.needSupportCount} Destek</span>
                  </div>
                </div>

                {/* Bulk Download for this Class in Outcome Mode */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Toplam {cStat.studentCount} Form</span>
                  <button
                    type="button"
                    onClick={() => handleDownloadBulkPDF(
                      cStat.submissions,
                      `bulk-cross-${cStat.classSection}-${selectedOutcomeCode}`,
                      { classSection: cStat.classSection, outcomeCode: selectedOutcomeCode, outcomeTitle: outcomeAnalytics.outcomeTitle }
                    )}
                    disabled={downloadingId !== null || cStat.submissions.length === 0}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ml-auto"
                    title={`${cStat.classSection} şubesinin ${selectedOutcomeCode} kazanımı için tüm öğrenci raporlarını tek PDF olarak indir`}
                  >
                    {downloadingId === `bulk-cross-${cStat.classSection}-${selectedOutcomeCode}` ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                        <span>Hazırlanıyor...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-amber-600" />
                        <span>Toplu PDF İndir</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Diagnostic Advisory Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-amber-500/30 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-2xl shrink-0">
              💡
            </div>
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                Maarif Pedagojik Teşhis & Öğretmen Rehberliği
              </div>
              <h4 className="text-base font-black text-white">
                {selectedOutcomeCode} Kazanımı Şubeler Arası Analiz Raporu
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                Öğrencilerin öz değerlendirme raporlarındaki ölçüt dağılımlarına göre şubeler arası kazanım pekiştirme ve ek laboratuvar etkinlikleri planlayabilirsiniz.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* 7. DETAILED STUDENT RUBRIC INSPECTOR MODAL */}
      {inspectingSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-mono font-bold text-xs">
                    {inspectingSubmission.classSection} • No: #{inspectingSubmission.studentNumber}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(inspectingSubmission.submittedAt).toLocaleString('tr-TR')}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {inspectingSubmission.studentName} - Öz Değerlendirme Formu
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {inspectingSubmission.outcomeTitle} ({inspectingSubmission.outcomeCode})
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* PDF Download Button inside Inspector */}
                <button
                  type="button"
                  onClick={() => handleDownloadSinglePDF(inspectingSubmission)}
                  disabled={downloadingId !== null}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Bu Değerlendirmeyi MEB Formatında PDF Olarak İndir"
                >
                  {downloadingId === inspectingSubmission.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>PDF Oluşturuluyor...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>PDF Raporu İndir</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setInspectingSubmission(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Score & Performance Banner */}
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-xs text-teal-800 font-bold">Öğrencinin Öz Değerlendirme Sonucu:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-teal-900 font-mono">
                    {inspectingSubmission.totalScore} / {inspectingSubmission.maxScore} Puan
                  </span>
                  <span className="text-sm font-bold text-teal-700 font-mono">(%{inspectingSubmission.percentage})</span>
                </div>
              </div>

              <div>
                {getLevelBadge(inspectingSubmission.performanceLevel)}
              </div>
            </div>

            {/* Criteria Breakdown with exact statements */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Ölçüt Bazlı Öğrenci Seçimleri:
              </h4>

              {(() => {
                const rubData = getRubricForOutcome(
                  inspectingSubmission.outcomeId,
                  inspectingSubmission.outcomeTitle,
                  inspectingSubmission.outcomeCode
                );

                return rubData.criteria.map((cr, i) => {
                  const rating = inspectingSubmission.ratings[cr.id] || 0;
                  const statement = cr.levelDescriptions[rating as 1 | 2 | 3 | 4] || 'Seçim yapılmadı';

                  return (
                    <div key={cr.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-900">{i + 1}. {cr.title}</span>
                        <span className="font-mono font-black text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                          {rating} / 4 Puan
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 italic">
                        &quot;{statement}&quot;
                      </p>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Student Personal Note */}
            {inspectingSubmission.studentNote && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Öğrencinin Kişisel Öğrenme Hedefi & Gelişim Notu:</span>
                </div>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  &quot;{inspectingSubmission.studentNote}&quot;
                </p>
              </div>
            )}

            {/* Teacher Feedback Editor */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>Öğretmen Geri Bildirimi & Yönlendirme Notu:</span>
                </label>
                {feedbackSavedNotice && (
                  <span className="text-xs text-emerald-600 font-bold animate-in fade-in">
                    ✓ Not kaydedildi!
                  </span>
                )}
              </div>

              <textarea
                value={teacherFeedbackInput}
                onChange={(e) => setTeacherFeedbackInput(e.target.value)}
                placeholder="Öğrencinin gelişimine yönelik öğretmen notunuzu buraya yazabilirsiniz..."
                rows={3}
                className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-teal-500 outline-none text-xs text-slate-800 bg-white"
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveTeacherFeedback}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Geri Bildirimi Kaydet</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 8. OUTCOME SUBMISSION & TRACKING MODAL (Kazanım Form Takip Paneli) */}
      {selectedOutcomeForTracking && (
        <OutcomeSubmissionModal
          isOpen={!!selectedOutcomeForTracking}
          onClose={() => setSelectedOutcomeForTracking(null)}
          outcomeCode={selectedOutcomeForTracking.code}
          outcomeTitle={selectedOutcomeForTracking.title}
          selectedClass={selectedClass}
          onOpenStudentDetail={(student) => {
            if (onOpenStudentDetail) {
              onOpenStudentDetail(student);
            } else {
              setLocalSelectedStudentForDetail(student);
            }
          }}
          onOpenRubricInspector={(sub) => {
            handleOpenInspector(sub);
          }}
        />
      )}

      {/* 9. LOCAL STUDENT OUTCOME DETAIL MODAL (Öğrenci Bütünsel Gelişim Kartı) */}
      {localSelectedStudentForDetail && (
        <StudentOutcomeDetailModal
          isOpen={!!localSelectedStudentForDetail}
          onClose={() => setLocalSelectedStudentForDetail(null)}
          student={localSelectedStudentForDetail}
          allStudents={students}
          isTeacher={true}
        />
      )}

    </div>
  );
}
