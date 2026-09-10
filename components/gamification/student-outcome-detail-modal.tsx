'use client';

import React, { useState, useEffect } from 'react';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  StudentPerformanceProfile,
  OutcomePerformanceItem,
  getStudentPerformanceProfile
} from '@/lib/student-performance-store';
import { downloadStudentDevelopmentReportPDF } from '@/lib/pdf-report-generator';
import { StudentGameHistoryModal } from '@/components/gamification/student-game-history-modal';
import { useAuth } from '@/lib/auth-store';
import {
  X,
  Trophy,
  Award,
  Zap,
  Sparkles,
  Gamepad2,
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileQuestion,
  ChevronRight,
  TrendingUp,
  Info,
  Calendar,
  Layers,
  GraduationCap,
  ShieldCheck,
  BarChart3,
  BookmarkCheck,
  MinusCircle,
  ExternalLink,
  Percent,
  Download,
  FileText,
  Loader2,
  BookOpen,
  MessageSquare,
  Heart
} from 'lucide-react';
import Link from 'next/link';

interface StudentOutcomeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any; // Raw student object from auth-store or leaderboard
  allStudents?: any[];
  onAwardXp?: (studentId: string, amount: number) => void;
  isTeacher?: boolean;
}

export function StudentOutcomeDetailModal({
  isOpen,
  onClose,
  student,
  allStudents = [],
  onAwardXp,
  isTeacher = false
}: StudentOutcomeDetailModalProps) {
  const { currentUser } = useAuth();
  const [filterMode, setFilterMode] = useState<'all' | 'completed' | 'missing'>('all');
  const [profile, setProfile] = useState<StudentPerformanceProfile | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isGameHistoryModalOpen, setIsGameHistoryModalOpen] = useState(false);
  const [gameHistoryOutcomeFilter, setGameHistoryOutcomeFilter] = useState<string | null>(null);

  const handleOpenGameHistory = (outcomeCode?: string) => {
    setGameHistoryOutcomeFilter(outcomeCode || null);
    setIsGameHistoryModalOpen(true);
  };

  // Load and calculate profile defensively
  useEffect(() => {
    if (student) {
      try {
        const perf = getStudentPerformanceProfile(student, allStudents);
        setProfile(perf);
      } catch (err) {
        console.error('Error generating student performance profile:', err);
        // Fallback profile
        setProfile({
          studentId: student?.id || 'unknown',
          studentName: student?.name || 'Öğrenci',
          studentNumber: student?.studentNumber || '-',
          classSection: student?.classSection || '5-A',
          avatar: student?.avatar || '🎓',
          totalPoints: student?.points || 0,
          rank: 1,
          totalBadges: Array.isArray(student?.unlockedBadges) ? student.unlockedBadges.length : 0,
          overallSuccessRate: 0,
          overallRubricRate: 0,
          totalJournalsCount: 0,
          allActivities: [],
          completedOutcomesCount: 0,
          totalOutcomesCount: 5,
          outcomes: []
        });
      }
    } else {
      setProfile(null);
    }
  }, [student, allStudents]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isGameHistoryModalOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isGameHistoryModalOpen]);

  if (!isOpen || !student) return null;

  // Safe Fallback Data
  const safeProfile = profile ?? {
    studentId: String(student?.id ?? ''),
    studentName: String(student?.name ?? 'Öğrenci'),
    studentNumber: String(student?.studentNumber ?? '-'),
    classSection: String(student?.classSection ?? '5-A'),
    avatar: String(student?.avatar ?? '🎓'),
    totalPoints: Number(student?.points ?? 0),
    rank: 1,
    totalBadges: Array.isArray(student?.unlockedBadges) ? student.unlockedBadges.length : 0,
    overallSuccessRate: 0,
    overallRubricRate: 0,
    totalJournalsCount: 0,
    allActivities: [],
    completedOutcomesCount: 0,
    totalOutcomesCount: 5,
    outcomes: []
  };

  const outcomesList = Array.isArray(safeProfile.outcomes) ? safeProfile.outcomes : [];

  const filteredOutcomes = outcomesList.filter((item) => {
    if (filterMode === 'completed') {
      return item.comparisonStatus === 'both_present' || item.hasActivityData || item.hasRubricData;
    }
    if (filterMode === 'missing') {
      return item.comparisonStatus === 'no_data' || !item.hasActivityData || !item.hasRubricData;
    }
    return true;
  });

  // Level & Title helper
  const getRankBadge = (points: number) => {
    if (points >= 600) return { title: 'Maarif Dehası', level: 'Seviye 6', color: 'bg-amber-500 text-slate-950', icon: '👑' };
    if (points >= 450) return { title: 'Geometri Mimarı', level: 'Seviye 5', color: 'bg-indigo-600 text-white', icon: '💎' };
    if (points >= 300) return { title: 'Açı Ustası', level: 'Seviye 4', color: 'bg-teal-600 text-white', icon: '⭐' };
    if (points >= 150) return { title: 'Matematik Kâşifi', level: 'Seviye 3', color: 'bg-blue-600 text-white', icon: '🚀' };
    return { title: 'Genç Çırak', level: 'Seviye 1', color: 'bg-slate-600 text-white', icon: '🌱' };
  };

  const rankInfo = getRankBadge(safeProfile.totalPoints);

  const handleDownloadDevelopmentCardPDF = async () => {
    if (!profile) return;
    try {
      setIsDownloadingPdf(true);
      await downloadStudentDevelopmentReportPDF(profile, {
        schoolName: (currentUser as any)?.school || (student as any)?.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
        teacherName: (currentUser?.role === 'teacher' ? currentUser?.name : undefined) || 'Ahmet Yılmaz',
        teacherBranch: (currentUser as any)?.branch || 'Matematik',
        academicYear: '2025 - 2026 Eğitim Öğretim Yılı'
      });
    } catch (err) {
      console.error('Öğrenci Gelişim Kartı PDF hatası:', err);
      alert('Gelişim kartı PDF dosyası oluşturulurken bir hata oluştu.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div
        className="bg-slate-50 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-300/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. MODAL HEADER: Student Profile Hero */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 text-white p-6 sm:p-7 relative border-b border-teal-800/50">
          
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-10"
            title="Kapat (ESC)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pr-8">
            <div className="flex items-center gap-4">
              <UserAvatar
                avatar={safeProfile.avatar}
                name={safeProfile.studentName}
                size="xl"
                className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-teal-400 bg-teal-500/20 text-teal-200 shadow-xl shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white">{safeProfile.studentName}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30">
                    {safeProfile.classSection} Şubesi
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Okul No: #{safeProfile.studentNumber}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                  <span className="flex items-center gap-1 font-bold text-amber-300">
                    <span>{rankInfo.icon}</span>
                    <span>{rankInfo.title}</span>
                  </span>
                  <span>•</span>
                  <span className="text-slate-300 font-medium">
                    Sınıf Sıralaması: <strong className="text-white">#{safeProfile.rank}</strong>
                  </span>
                  <span>•</span>
                  <span className="text-slate-300 font-medium">
                    Kazanılan Rozetler: <strong className="text-teal-300">🏆 {safeProfile.totalBadges} Rozet</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Total Points Card & PDF Download Button */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm shrink-0">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Toplam XP Puanı</div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-5 h-5 fill-amber-400" />
                  <span>{safeProfile.totalPoints} XP</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadDevelopmentCardPDF}
                disabled={isDownloadingPdf}
                className="px-4 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95 shrink-0"
                title="MEB Türkiye Yüzyılı Maarif Modeli Öğrenci Gelişim Kartını Resmi PDF Olarak İndir"
              >
                {isDownloadingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>PDF Hazırlanıyor...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-slate-950" />
                    <span>Gelişim Kartı İndir (PDF)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 2. EXECUTIVE METRICS BAR */}
        <div className="bg-white p-4 sm:p-6 border-b border-slate-200 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Metric 1: Kazanım Başarı Oranı (Oyunlar) - Clickable for detailed history */}
            <button
              type="button"
              onClick={() => handleOpenGameHistory()}
              className="p-3.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/90 border border-emerald-200/80 hover:border-emerald-400 flex flex-col justify-between text-left transition-all shadow-xs hover:shadow-md active:scale-[0.99] group cursor-pointer"
              title="Öğrencinin tüm oyun ve etkinlik geçmişini detaylı incelemek için tıklayın"
            >
              <div className="flex items-center justify-between text-xs text-emerald-900 font-bold mb-1 w-full">
                <span>Oyun Başarı Ort.</span>
                <Gamepad2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-700">
                  %{safeProfile.overallSuccessRate || 0}
                </span>
                <span className="text-[11px] text-emerald-800 font-semibold">Doğruluk</span>
              </div>
              <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, safeProfile.overallSuccessRate || 0)}%` }}
                />
              </div>
            </button>

            {/* Metric 2: Öz Değerlendirme Rubrik Ortalaması */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-indigo-900 font-bold mb-1">
                <span>Rubrik Ortalaması</span>
                <ClipboardCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-indigo-700">
                  %{safeProfile.overallRubricRate || 0}
                </span>
                <span className="text-[11px] text-indigo-800 font-semibold">Öz Algı</span>
              </div>
              <div className="w-full bg-indigo-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, safeProfile.overallRubricRate || 0)}%` }}
                />
              </div>
            </div>

            {/* Metric 3: Kazanım İlerleme Durumu */}
            <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-teal-900 font-bold mb-1">
                <span>Tamamlanan Kazanım</span>
                <BookmarkCheck className="w-4 h-4 text-teal-600" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-teal-800">
                  {safeProfile.completedOutcomesCount} / {safeProfile.totalOutcomesCount}
                </span>
                <span className="text-[11px] text-teal-700 font-bold">Kazanım</span>
              </div>
              <div className="w-full bg-teal-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.round((safeProfile.completedOutcomesCount / (safeProfile.totalOutcomesCount || 1)) * 100))}%`
                  }}
                />
              </div>
            </div>

            {/* Metric 4: Algı & Başarı Uyum Puanı */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-amber-900 font-bold mb-1">
                <span>Öz Farkındalık</span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-amber-800">
                  {safeProfile.overallRubricRate && safeProfile.overallSuccessRate
                    ? `%${Math.max(0, 100 - Math.abs(safeProfile.overallRubricRate - safeProfile.overallSuccessRate))}`
                    : 'Hesaplanıyor'}
                </span>
                <span className="text-[11px] text-amber-700 font-bold">Uyum</span>
              </div>
              <div className="text-[10px] text-amber-900/80 font-bold truncate mt-2">
                Oyun vs. Rubrik Uyumu
              </div>
            </div>

          </div>
        </div>

        {/* 3. FILTER TABS & SUB-HEADER */}
        <div className="p-4 sm:px-6 bg-slate-100/80 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <span>Kazanım Bazlı Başarı & Rubrik Kıyaslaması</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-xs font-bold">
                {filteredOutcomes.length} Kazanım
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Her bir kazanımda öğrencinin oyun/test performansı ile kendi doldurduğu rubrik puanının karşılaştırması.
            </p>
          </div>

          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs self-stretch sm:self-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü ({outcomesList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterMode === 'completed'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tamamlananlar
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('missing')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterMode === 'missing'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Eksik Olanlar
            </button>
          </div>
        </div>

        {/* 4. OUTCOMES LIST (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredOutcomes.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-2">
              <FileQuestion className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-black text-slate-800">Seçilen filtrede kazanım bulunamadı</div>
              <div className="text-xs text-slate-500">Tüm kazanımları görüntülemek için yukarıdan &apos;Tümü&apos; seçeneğine tıklayınız.</div>
            </div>
          ) : (
            filteredOutcomes.map((item) => {
              return (
                <div
                  key={item.outcomeCode}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4 hover:border-slate-300 transition-all"
                >
                  {/* Outcome Title & Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-lg bg-teal-100 text-teal-900 font-black text-xs font-mono border border-teal-200">
                          {item.outcomeCode}
                        </span>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900">
                        {item.outcomeTitle}
                      </h4>
                    </div>

                    {/* Overall Outcome Status Badge */}
                    <div className="self-start sm:self-auto shrink-0">
                      {item.comparisonStatus === 'both_present' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Etkinlik + Rubrik Tamam</span>
                        </span>
                      )}
                      {item.comparisonStatus === 'only_activity' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-black">
                          <Gamepad2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Sadece Oyun Tamamlandı</span>
                        </span>
                      )}
                      {item.comparisonStatus === 'only_rubric' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-black">
                          <ClipboardCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span>Sadece Rubrik Kaydı Var</span>
                        </span>
                      )}
                      {item.comparisonStatus === 'no_data' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-black">
                          <MinusCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Henüz Kayıt Yok</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2-COLUMN COMPARISON BENCH */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Column 1: Oyun / Etkinlik / Test Başarısı */}
                    <div className={`p-4 rounded-2xl border transition-all ${
                      item.hasActivityData
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-slate-50/80 border-dashed border-slate-300 text-slate-400'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                          <Gamepad2 className={`w-4 h-4 ${item.hasActivityData ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span>Oyun & Etkinlik Başarısı</span>
                        </div>
                        {item.hasActivityData && (
                          <button
                            type="button"
                            onClick={() => handleOpenGameHistory(item.outcomeCode)}
                            className="text-[11px] font-black text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded transition-colors cursor-pointer"
                            title="Bu kazanıma ait oyun geçmişini incele"
                          >
                            +{item.activityXp} XP
                          </button>
                        )}
                      </div>

                      {item.hasActivityData && item.activitySuccessRate !== null ? (
                        <div className="space-y-2">
                          <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-black text-emerald-700">
                              %{item.activitySuccessRate}
                            </span>
                            <span className="text-xs text-slate-600 font-bold">
                              {item.activitiesCount} Tamamlanan Etkinlik
                            </span>
                          </div>

                          <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full transition-all"
                              style={{ width: `${item.activitySuccessRate}%` }}
                            />
                          </div>

                          {/* Completed games chips */}
                          {item.completedGames.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1">
                              {item.completedGames.map((game, gIdx) => (
                                <button
                                  key={gIdx}
                                  type="button"
                                  onClick={() => handleOpenGameHistory(item.outcomeCode)}
                                  className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-[10px] font-bold shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Bu oyunu geçmişte filtrele"
                                >
                                  <span>🎮</span>
                                  <span>{game}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Missing Game Activity Guard */
                        <div className="py-4 flex flex-col items-center justify-center text-center space-y-1">
                          <HelpCircle className="w-6 h-6 text-slate-300" />
                          <div className="text-xs font-black text-slate-600">Oyun / Test Kaydı Bulunmuyor</div>
                          <div className="text-[11px] text-slate-400 max-w-xs">
                            Öğrenci bu kazanımdaki hafıza kartı, bulmaca veya testleri henüz sisteme kaydetmemiştir.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Column 2: Öz Değerlendirme Rubrik Sonucu */}
                    <div className={`p-4 rounded-2xl border transition-all ${
                      item.hasRubricData
                        ? 'bg-indigo-50/40 border-indigo-200'
                        : 'bg-slate-50/80 border-dashed border-slate-300 text-slate-400'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                          <ClipboardCheck className={`w-4 h-4 ${item.hasRubricData ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span>Öz Değerlendirme Rubriği</span>
                        </div>
                        {item.hasRubricData && item.rubricLevel && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                            item.rubricLevel === 'Mükemmel'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : item.rubricLevel === 'Başarılı'
                              ? 'bg-teal-100 text-teal-800 border-teal-200'
                              : item.rubricLevel === 'Orta'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-rose-100 text-rose-800 border-rose-200'
                          }`}>
                            {item.rubricLevel}
                          </span>
                        )}
                      </div>

                      {item.hasRubricData && item.rubricScore !== null ? (
                        <div className="space-y-2">
                          <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-black text-indigo-700">
                              %{item.rubricScore}
                            </span>
                            <span className="text-xs text-slate-600 font-bold">
                              {item.rubricSubmission?.totalScore || 0} / {item.rubricSubmission?.maxScore || 20} Puan
                            </span>
                          </div>

                          <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-600 h-full rounded-full transition-all"
                              style={{ width: `${item.rubricScore}%` }}
                            />
                          </div>

                          {/* Student Self Note if present */}
                          {item.rubricSubmission?.studentNote && (
                            <div className="p-2 rounded-xl bg-white border border-indigo-100 text-[11px] text-slate-700 italic">
                              &ldquo;{item.rubricSubmission.studentNote}&rdquo;
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Missing Rubric Guard */
                        <div className="py-4 flex flex-col items-center justify-center text-center space-y-1">
                          <AlertCircle className="w-6 h-6 text-amber-400" />
                          <div className="text-xs font-black text-slate-600">Rubrik Doldurulmadı</div>
                          <div className="text-[11px] text-slate-400 max-w-xs">
                            Öğrenci bu kazanım için henüz öz değerlendirme rubriğini doldurmamıştır.
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* 3. LEARNING JOURNAL (ÖĞRENME GÜNLÜĞÜ / ÇIKIŞ BİLETİ) SECTION */}
                  {item.hasJournalData && item.journalEntry && (
                    <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          <span>Öğrenme Günlüğü (Çıkış Bileti Yansıtması)</span>
                        </div>
                        {item.journalEntry.teacherLiked && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold flex items-center gap-1">
                            <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>Öğretmen Yıldızlı</span>
                          </span>
                        )}
                      </div>

                      {item.journalEntry.prompt && (
                        <div className="text-[11px] text-indigo-900 font-semibold">
                          💡 <em>&quot;{item.journalEntry.prompt}&quot;</em>
                        </div>
                      )}

                      <div className="p-3 rounded-xl bg-white border border-indigo-100 text-xs text-slate-800 italic leading-relaxed">
                        &ldquo;{item.journalEntry.studentReflection}&rdquo;
                      </div>

                      {item.journalEntry.teacherFeedback && (
                        <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-0.5">
                          <div className="text-[10px] font-bold text-teal-800 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-teal-600" />
                            <span>Öğretmen Geri Bildirimi:</span>
                          </div>
                          <p className="italic text-teal-900">&ldquo;{item.journalEntry.teacherFeedback}&rdquo;</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. COMPARATIVE PEDAGOGICAL INSIGHT BANNER */}
                  <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${item.alignmentInsight.badgeClass}`}>
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded-lg bg-white/80 shrink-0 mt-0.5">
                        {item.comparisonStatus === 'both_present' ? (
                          <Sparkles className="w-4 h-4 text-emerald-700" />
                        ) : (
                          <Info className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-black">
                          {item.alignmentInsight.title}
                        </div>
                        <div className="text-[11px] opacity-90 leading-relaxed">
                          {item.alignmentInsight.description}
                        </div>
                      </div>
                    </div>

                    {/* Comparison Delta Tag */}
                    {item.comparisonStatus === 'both_present' && item.alignmentDelta !== null && (
                      <div className="self-end sm:self-auto px-3 py-1 rounded-xl bg-white/90 border border-slate-300 text-slate-900 font-black text-xs shrink-0 flex items-center gap-1 shadow-xs">
                        <span>Δ Fark:</span>
                        <span className={item.alignmentDelta === 0 ? 'text-emerald-600' : 'text-indigo-600'}>
                          {item.alignmentDelta > 0 ? `+${item.alignmentDelta}%` : `${item.alignmentDelta}%`}
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* 5. MODAL FOOTER */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Türkiye Yüzyılı Maarif Modeli • Öğrenci Bireysel Başarı & Öz Değerlendirme Takip Sistemi
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              type="button"
              onClick={handleDownloadDevelopmentCardPDF}
              disabled={isDownloadingPdf}
              className="px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-700" />
              ) : (
                <Download className="w-3.5 h-3.5 text-teal-700" />
              )}
              <span>PDF İndir</span>
            </button>

            {isTeacher && onAwardXp && (
              <button
                type="button"
                onClick={() => {
                  onAwardXp(safeProfile.studentId, 25);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>+25 XP Başarı Ödülü Ver</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>

      </div>

      {/* Dedicated Student Game & Activity History Modal */}
      <StudentGameHistoryModal
        isOpen={isGameHistoryModalOpen}
        onClose={() => setIsGameHistoryModalOpen(false)}
        profile={profile}
        initialOutcomeFilter={gameHistoryOutcomeFilter}
      />
    </div>
  );
}
