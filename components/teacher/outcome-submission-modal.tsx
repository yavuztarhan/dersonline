'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import {
  RubricSubmissionRecord,
  getStoredSubmissions
} from '@/lib/rubric-store';
import {
  LearningJournalEntry,
  getStoredJournalEntries,
  updateTeacherJournalFeedback
} from '@/lib/journal-store';
import {
  downloadStudentRubricPDF,
  downloadBulkClassRubricPDF
} from '@/lib/pdf-report-generator';
import { UserAvatar } from '@/components/ui/user-avatar';
import { StudentUser } from '@/types/auth';
import {
  X,
  ClipboardCheck,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  FileText,
  Heart,
  MessageSquare,
  Sparkles,
  Users,
  Search,
  ChevronRight,
  Eye,
  Loader2,
  Award,
  Zap,
  BarChart2
} from 'lucide-react';

interface OutcomeSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  outcomeCode: string;
  outcomeTitle?: string;
  selectedClass: string;
  onOpenStudentDetail?: (student: any) => void;
  onOpenRubricInspector?: (sub: RubricSubmissionRecord) => void;
}

export function OutcomeSubmissionModal({
  isOpen,
  onClose,
  outcomeCode,
  outcomeTitle,
  selectedClass,
  onOpenStudentDetail,
  onOpenRubricInspector
}: OutcomeSubmissionModalProps) {
  const { playSound } = useApp();
  const { students, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'rubric' | 'journal'>('rubric');
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'missing'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Submissions & Journals from localStorage
  const [submissions, setSubmissions] = useState<RubricSubmissionRecord[]>([]);
  const [journalEntries, setJournalEntries] = useState<LearningJournalEntry[]>([]);

  // Journal Feedback Editing State
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [feedbackDraft, setFeedbackDraft] = useState<string>('');
  const [savedNoticeId, setSavedNoticeId] = useState<string | null>(null);

  // PDF Loading
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSubmissions(getStoredSubmissions());
      setJournalEntries(getStoredJournalEntries());
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 1. Class Students (All students in this class)
  const classStudents = useMemo(() => {
    return students.filter((s) => s.classSection === selectedClass);
  }, [students, selectedClass]);

  // 2. Submissions for this outcome and class
  const outcomeSubmissions = useMemo(() => {
    return submissions.filter(
      (s) => s.outcomeCode === outcomeCode && s.classSection === selectedClass
    );
  }, [submissions, outcomeCode, selectedClass]);

  // 3. Journals for this outcome and class
  const outcomeJournals = useMemo(() => {
    return journalEntries.filter(
      (j) => j.outcomeCode === outcomeCode && j.classSection === selectedClass
    );
  }, [journalEntries, outcomeCode, selectedClass]);

  // Combined Rubric Tracking Rows
  const rubricTrackingData = useMemo(() => {
    return classStudents.map((stu) => {
      const match = outcomeSubmissions.find(
        (sub) =>
          sub.studentId === stu.id ||
          sub.studentNumber === stu.studentNumber ||
          sub.studentName.trim().toLowerCase() === stu.name.trim().toLowerCase()
      );
      return {
        student: stu,
        isSubmitted: !!match,
        submission: match || null
      };
    });
  }, [classStudents, outcomeSubmissions]);

  // Combined Journal Tracking Rows
  const journalTrackingData = useMemo(() => {
    return classStudents.map((stu) => {
      const match = outcomeJournals.find(
        (j) =>
          j.studentId === stu.id ||
          j.studentNumber === stu.studentNumber ||
          j.studentName.trim().toLowerCase() === stu.name.trim().toLowerCase()
      );
      return {
        student: stu,
        isSubmitted: !!match,
        journal: match || null
      };
    });
  }, [classStudents, outcomeJournals]);

  // Counts
  const totalClassCount = classStudents.length || 1;
  const rubricSubmittedCount = rubricTrackingData.filter((r) => r.isSubmitted).length;
  const rubricMissingCount = totalClassCount - rubricSubmittedCount;
  const rubricRate = Math.round((rubricSubmittedCount / totalClassCount) * 100);

  const journalSubmittedCount = journalTrackingData.filter((j) => j.isSubmitted).length;
  const journalMissingCount = totalClassCount - journalSubmittedCount;
  const journalRate = Math.round((journalSubmittedCount / totalClassCount) * 100);

  // Filtered Rubric Rows
  const filteredRubricRows = useMemo(() => {
    return rubricTrackingData.filter((item) => {
      const matchesFilter =
        filterStatus === 'all' ||
        (filterStatus === 'submitted' && item.isSubmitted) ||
        (filterStatus === 'missing' && !item.isSubmitted);

      const matchesSearch =
        !searchTerm ||
        item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.student.studentNumber.includes(searchTerm);

      return matchesFilter && matchesSearch;
    });
  }, [rubricTrackingData, filterStatus, searchTerm]);

  // Filtered Journal Rows
  const filteredJournalRows = useMemo(() => {
    return journalTrackingData.filter((item) => {
      const matchesFilter =
        filterStatus === 'all' ||
        (filterStatus === 'submitted' && item.isSubmitted) ||
        (filterStatus === 'missing' && !item.isSubmitted);

      const matchesSearch =
        !searchTerm ||
        item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.student.studentNumber.includes(searchTerm) ||
        (item.journal?.studentReflection &&
          item.journal.studentReflection.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesFilter && matchesSearch;
    });
  }, [journalTrackingData, filterStatus, searchTerm]);

  // Handler: Single PDF Download
  const handleDownloadSinglePDF = async (sub: RubricSubmissionRecord) => {
    try {
      setDownloadingId(sub.id);
      playSound('select');
      await downloadStudentRubricPDF(sub, {
        schoolName: (currentUser as any)?.school,
        teacherName: currentUser?.name,
        teacherBranch: (currentUser as any)?.branch
      });
      playSound('success');
    } catch (err) {
      console.error('PDF indirme hatası:', err);
      alert('PDF raporu oluşturulurken hata oluştu.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Handler: Bulk PDF Download
  const handleDownloadBulkPDF = async () => {
    if (outcomeSubmissions.length === 0) {
      alert('İndirilecek doldurulmuş rubrik formu bulunmuyor.');
      return;
    }
    try {
      setDownloadingId('bulk');
      playSound('select');
      await downloadBulkClassRubricPDF(outcomeSubmissions, {
        schoolName: (currentUser as any)?.school,
        teacherName: currentUser?.name,
        teacherBranch: (currentUser as any)?.branch,
        classSection: selectedClass,
        outcomeCode,
        outcomeTitle
      });
      playSound('success');
    } catch (err) {
      console.error('Toplu PDF indirme hatası:', err);
      alert('Toplu PDF oluşturulurken hata oluştu.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Handler: Save Journal Feedback
  const handleSaveJournalFeedback = (entry: LearningJournalEntry) => {
    updateTeacherJournalFeedback(entry.id, feedbackDraft.trim(), entry.teacherLiked);
    playSound('success');
    setSavedNoticeId(entry.id);
    setTimeout(() => setSavedNoticeId(null), 3000);
    setEditingFeedbackId(null);
    setJournalEntries(getStoredJournalEntries());
  };

  // Handler: Toggle Journal Like
  const handleToggleLike = (entry: LearningJournalEntry) => {
    const nextState = !entry.teacherLiked;
    updateTeacherJournalFeedback(entry.id, entry.teacherFeedback || '', nextState);
    playSound(nextState ? 'select' : 'clear');
    setJournalEntries(getStoredJournalEntries());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div
        className="bg-slate-50 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-300/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 text-white p-6 relative border-b border-teal-800/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-10"
            title="Kapat (ESC)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-2 pr-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-teal-500 text-slate-950 font-black text-xs font-mono">
                {outcomeCode}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-teal-800/60 text-teal-200 font-bold text-xs border border-teal-700">
                {selectedClass} Şubesi
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Öğrenci Doldurma & Form Takip Durumu
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
              {outcomeTitle || 'Kazanım Değerlendirme & Gelişim Takip Paneli'}
            </h2>
          </div>
        </div>

        {/* SUMMARY KPI STRIP */}
        <div className="bg-white p-4 sm:p-5 border-b border-slate-200 shadow-xs shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Sınıf Mevcudu */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sınıf Mevcudu</div>
                <div className="text-xl font-black text-slate-900 mt-0.5">{classStudents.length} Öğrenci</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                <Users className="w-4 h-4" />
              </div>
            </div>

            {/* Rubrik Dolduran */}
            <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Rubrik Dolduran</div>
                <div className="text-xl font-black text-teal-800 mt-0.5">
                  {rubricSubmittedCount} / {classStudents.length} <span className="text-xs font-bold text-teal-600">(%{rubricRate})</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-teal-200 text-teal-900 flex items-center justify-center font-bold text-sm">
                <ClipboardCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Rubrik Doldurmayan */}
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Rubrik Bekleyen</div>
                <div className="text-xl font-black text-rose-800 mt-0.5">
                  {rubricMissingCount} Öğrenci
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-rose-200 text-rose-900 flex items-center justify-center font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>

            {/* Öğrenme Günlüğü */}
            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Günlük Yazan</div>
                <div className="text-xl font-black text-indigo-800 mt-0.5">
                  {journalSubmittedCount} / {classStudents.length} <span className="text-xs font-bold text-indigo-600">(%{journalRate})</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-200 text-indigo-900 flex items-center justify-center font-bold text-sm">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY SUB-TAB SELECTOR (Rubrik vs Öğrenme Günlüğü) */}
        <div className="bg-slate-100/90 p-3 sm:px-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab('rubric');
                setFilterStatus('all');
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'rubric'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Öz Değerlendirme Formları ({rubricSubmittedCount}/{classStudents.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab('journal');
                setFilterStatus('all');
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'journal'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Öğrenme Günlükleri ({journalSubmittedCount}/{classStudents.length})</span>
            </button>
          </div>

          {/* Bulk Download Action for Rubrics */}
          {activeTab === 'rubric' && outcomeSubmissions.length > 0 && (
            <button
              type="button"
              onClick={handleDownloadBulkPDF}
              disabled={downloadingId === 'bulk'}
              className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs border border-teal-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {downloadingId === 'bulk' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-teal-700" />
              )}
              <span>Toplu Sınıf PDF&apos;i İndir ({outcomeSubmissions.length})</span>
            </button>
          )}
        </div>

        {/* SECONDARY FILTER & SEARCH BAR */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü ({classStudents.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('submitted')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                filterStatus === 'submitted'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Dolduranlar ({activeTab === 'rubric' ? rubricSubmittedCount : journalSubmittedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('missing')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                filterStatus === 'missing'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              <span>Doldurmayanlar ({activeTab === 'rubric' ? rubricMissingCount : journalMissingCount})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Öğrenci adı veya no ara..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
            />
          </div>

        </div>

        {/* CONTENT AREA: LIST OF STUDENTS (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          
          {/* 1. RUBRIC TAB CONTENT */}
          {activeTab === 'rubric' && (
            <div className="space-y-3">
              {filteredRubricRows.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-2">
                  <div className="text-2xl">📋</div>
                  <div className="text-sm font-black text-slate-800">Filtreye uygun öğrenci bulunamadı</div>
                  <div className="text-xs text-slate-400">Arama teriminizi veya filtre durumunuzu değiştirin.</div>
                </div>
              ) : (
                filteredRubricRows.map(({ student, isSubmitted, submission }) => (
                  <div
                    key={student.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isSubmitted
                        ? 'bg-white border-slate-200 hover:border-teal-400 shadow-xs'
                        : 'bg-rose-50/40 border-rose-200/80'
                    }`}
                  >
                    {/* Student Identity */}
                    <div className="flex items-center gap-3.5">
                      <UserAvatar
                        avatar={student.avatar}
                        name={student.name}
                        size="md"
                        className="w-11 h-11 border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-xs text-slate-500">#{student.studentNumber}</span>
                          <h4 className="font-black text-slate-900 text-sm">{student.name}</h4>
                          {isSubmitted ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Doldurdu</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-300 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              <span>Form Bekleniyor</span>
                            </span>
                          )}
                        </div>

                        {isSubmitted && submission ? (
                          <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-teal-700">
                              Puan: {submission.totalScore} / {submission.maxScore} (%{submission.percentage})
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-slate-500">
                              Düzey: <strong className="text-slate-800">{submission.performanceLevel}</strong>
                            </span>
                            {submission.studentNote && (
                              <>
                                <span>•</span>
                                <span className="italic text-slate-500 truncate max-w-[200px]">
                                  &ldquo;{submission.studentNote}&rdquo;
                                </span>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-rose-600/80 font-medium mt-0.5">
                            Öğrenci bu kazanım için henüz öz değerlendirme rubriğini göndermemiştir.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto flex-wrap">
                      {isSubmitted && submission && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenRubricInspector) {
                                onOpenRubricInspector(submission);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Öğrencinin Rubrik Formunu İncele"
                          >
                            <Eye className="w-3.5 h-3.5 text-teal-600" />
                            <span>Rubriği İncele</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadSinglePDF(submission)}
                            disabled={downloadingId === submission.id}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title="Öğrenci Rubrik Raporunu PDF İndir"
                          >
                            {downloadingId === submission.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                            ) : (
                              <FileText className="w-4 h-4 text-slate-700" />
                            )}
                          </button>
                        </>
                      )}

                      {/* Gelişim Kartı Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenStudentDetail) {
                            onOpenStudentDetail(student);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                        title="Öğrencinin Bütünsel Gelişim Karnesini Aç"
                      >
                        <BarChart2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Gelişim Kartı ➔</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. LEARNING JOURNAL TAB CONTENT */}
          {activeTab === 'journal' && (
            <div className="space-y-3">
              {filteredJournalRows.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-2">
                  <div className="text-2xl">📖</div>
                  <div className="text-sm font-black text-slate-800">Filtreye uygun günlük kaydı bulunamadı</div>
                  <div className="text-xs text-slate-400">Arama teriminizi veya filtre durumunuzu kontrol edin.</div>
                </div>
              ) : (
                filteredJournalRows.map(({ student, isSubmitted, journal }) => (
                  <div
                    key={student.id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      isSubmitted
                        ? 'bg-white border-slate-200 shadow-xs'
                        : 'bg-rose-50/40 border-rose-200/80'
                    }`}
                  >
                    {/* Header: Student and Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          avatar={student.avatar}
                          name={student.name}
                          size="md"
                          className="w-10 h-10 border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs text-slate-500">#{student.studentNumber}</span>
                            <h4 className="font-black text-slate-900 text-sm">{student.name}</h4>
                            {isSubmitted ? (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black border border-indigo-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                                <span>Günlük Yazdı</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-300 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-rose-600" />
                                <span>Günlük Yazmadı</span>
                              </span>
                            )}
                          </div>
                          {isSubmitted && journal && (
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Teslim Tarihi: {new Date(journal.submittedAt).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {isSubmitted && journal && (
                          <button
                            type="button"
                            onClick={() => handleToggleLike(journal)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              journal.teacherLiked
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${journal.teacherLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span>{journal.teacherLiked ? 'Beğenildi' : 'Beğen'}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenStudentDetail) {
                              onOpenStudentDetail(student);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                          title="Öğrencinin Bütünsel Gelişim Karnesini Aç"
                        >
                          <BarChart2 className="w-3.5 h-3.5 text-teal-400" />
                          <span>Gelişim Kartı ➔</span>
                        </button>
                      </div>
                    </div>

                    {/* Body: Reflection and Feedback */}
                    {isSubmitted && journal ? (
                      <div className="space-y-3">
                        {/* Student Prompt and Reflection */}
                        <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100/80 space-y-1.5">
                          <div className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{journal.prompt}</span>
                          </div>
                          <div className="text-xs text-slate-800 font-medium leading-relaxed italic bg-white p-3 rounded-lg border border-indigo-100/60">
                            &ldquo;{journal.studentReflection}&rdquo;
                          </div>
                        </div>

                        {/* Teacher Feedback Box */}
                        <div className="space-y-1.5">
                          {editingFeedbackId === journal.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={feedbackDraft}
                                onChange={(e) => setFeedbackDraft(e.target.value)}
                                placeholder="Öğrencinin bu yansıtmasına teşvik edici öğretmen yorumunuzu yazınız..."
                                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                rows={2}
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingFeedbackId(null)}
                                  className="px-3 py-1 rounded-lg text-xs text-slate-600 hover:bg-slate-100 font-semibold"
                                >
                                  İptal
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveJournalFeedback(journal)}
                                  className="px-4 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                                >
                                  Kaydet
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                              <div className="text-xs text-slate-700 flex items-center gap-2">
                                <MessageSquare className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                {journal.teacherFeedback ? (
                                  <span><strong>Öğretmen Notu:</strong> &ldquo;{journal.teacherFeedback}&rdquo;</span>
                                ) : (
                                  <span className="text-slate-400 italic">Henüz öğretmen geri bildirimi yazılmadı.</span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingFeedbackId(journal.id);
                                  setFeedbackDraft(journal.teacherFeedback || '');
                                }}
                                className="text-[11px] font-bold text-teal-700 hover:text-teal-900 shrink-0 cursor-pointer"
                              >
                                {journal.teacherFeedback ? 'Düzenle' : '+ Yorum Ekle'}
                              </button>
                            </div>
                          )}

                          {savedNoticeId === journal.id && (
                            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Geri bildiriminiz başarıyla kaydedildi.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic">
                        Öğrenci bu kazanım için çıkış bileti & öğrenme günlüğü yansıtması yazmamıştır.
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Türkiye Yüzyılı Maarif Modeli • Öğretmen Değerlendirme & Gelişim Takip Sistemi
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
