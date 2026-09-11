'use client';

import React, { useState, useMemo } from 'react';
import { BoardParticipationRecord, setStoredActiveBoardStudent } from '@/lib/board-participation-store';
import { StudentUser } from '@/types/auth';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import { downloadStudentBoardReportPDF } from '@/lib/board-pdf-generator';
import {
  X,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Calendar,
  Clock,
  Award,
  Trophy,
  Zap,
  Target,
  CheckCircle2,
  Gamepad2,
  FileCheck2,
  BookOpen,
  ClipboardCheck,
  Download,
  Loader2,
  ChevronRight,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface TeacherStudentBoardHistoryModalProps {
  student: StudentUser;
  records: BoardParticipationRecord[];
  onClose: () => void;
  onActivateForBoard?: (student: StudentUser) => void;
}

/**
 * Normalizes any score/maxScore pair or raw score into a valid 0-100 percentage.
 * Prevents technical impossibilities like >100% score rates.
 */
export function getNormalizedPercent(score?: number, maxScore?: number): number {
  if (score === undefined || score === null) return 80;
  if (maxScore && maxScore > 0) {
    const calculated = Math.round((score / maxScore) * 100);
    return Math.min(100, Math.max(0, calculated));
  }
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function TeacherStudentBoardHistoryModal({
  student,
  records,
  onClose,
  onActivateForBoard
}: TeacherStudentBoardHistoryModalProps) {
  const { playSound } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'game' | 'test' | 'rubric' | 'journal'>('all');

  // Sorted ascending for chronological trend calculation
  const chronologicalRecords = useMemo(() => {
    return [...records].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [records]);

  // Sorted descending for history list
  const displayRecords = useMemo(() => {
    let list = [...records].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    if (filterType !== 'all') {
      list = list.filter((r) => r.activityType === filterType);
    }
    return list;
  }, [records, filterType]);

  // Metrics calculation
  const totalCount = records.length;
  const totalXp = records.reduce((sum, r) => sum + (r.xpEarned || 0), 0);
  const scoredRecords = records.filter((r) => r.score !== undefined && r.score !== null);
  
  const averageScore = scoredRecords.length > 0
    ? Math.min(100, Math.max(0, Math.round(
        scoredRecords.reduce((sum, r) => sum + getNormalizedPercent(r.score, r.maxScore), 0) / scoredRecords.length
      )))
    : 0;

  // Trend detection (comparing second half with first half if multiple records exist)
  const trendInfo = useMemo(() => {
    if (chronologicalRecords.length < 2) {
      return { direction: 'neutral', label: 'İlk Katılım Verisi', diff: 0 };
    }
    const mid = Math.floor(chronologicalRecords.length / 2);
    const firstHalf = chronologicalRecords.slice(0, mid);
    const secondHalf = chronologicalRecords.slice(mid);

    const avg1 = Math.min(100, Math.max(0, firstHalf.reduce((s, r) => s + getNormalizedPercent(r.score, r.maxScore), 0) / firstHalf.length));
    const avg2 = Math.min(100, Math.max(0, secondHalf.reduce((s, r) => s + getNormalizedPercent(r.score, r.maxScore), 0) / secondHalf.length));
    const diff = Math.min(100, Math.max(-100, Math.round(avg2 - avg1)));

    if (diff > 0) {
      return { direction: 'up', label: `+${diff}% Başarı Artışı`, diff };
    } else if (diff < 0) {
      return { direction: 'down', label: `-${Math.abs(diff)}% Başarı Değişimi`, diff };
    } else {
      return { direction: 'steady', label: 'Dengeli & İstikrarlı Performans', diff: 0 };
    }
  }, [chronologicalRecords]);

  const { currentUser } = useAuth();
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Count by activity type
  const gameCount = records.filter((r) => r.activityType === 'game').length;
  const testCount = records.filter((r) => r.activityType === 'test').length;
  const rubricCount = records.filter((r) => r.activityType === 'rubric').length;
  const journalCount = records.filter((r) => r.activityType === 'journal').length;

  const handleDownloadPDF = async () => {
    try {
      setIsDownloadingPdf(true);
      playSound('select');
      await downloadStudentBoardReportPDF(student, records, {
        schoolName: student.school || (currentUser as any)?.school,
        teacherName: currentUser?.name || 'Ahmet Yılmaz',
        teacherBranch: (currentUser as any)?.branch || 'Matematik'
      });
      playSound('success');
    } catch (err) {
      console.error('PDF download error:', err);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleStartBoardSession = () => {
    if (onActivateForBoard) {
      onActivateForBoard(student);
    } else {
      setStoredActiveBoardStudent({
        id: student.id,
        name: student.name,
        studentNumber: student.studentNumber,
        classSection: student.classSection,
        school: student.school,
        points: student.points || 0
      });
      playSound('success');
    }
    onClose();
  };

  // SVG Chart Dimensions & Data
  const chartWidth = 600;
  const chartHeight = 160;
  const paddingX = 45;
  const paddingY = 25;

  const chartPoints = useMemo(() => {
    if (chronologicalRecords.length === 0) return [];
    if (chronologicalRecords.length === 1) {
      const r = chronologicalRecords[0];
      const val = getNormalizedPercent(r.score, r.maxScore);
      return [
        {
          x: chartWidth / 2,
          y: chartHeight - paddingY - (val / 100) * (chartHeight - paddingY * 2),
          score: val,
          xp: r.xpEarned,
          date: new Date(r.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
          title: r.activityTitle,
          type: r.activityType
        }
      ];
    }

    const count = chronologicalRecords.length;
    const stepX = (chartWidth - paddingX * 2) / (count - 1);

    return chronologicalRecords.map((r, i) => {
      const val = getNormalizedPercent(r.score, r.maxScore);
      const x = paddingX + i * stepX;
      // y maps score 0..100 to chartHeight - paddingY .. paddingY
      const normalizedScore = Math.max(0, Math.min(100, val));
      const y = chartHeight - paddingY - (normalizedScore / 100) * (chartHeight - paddingY * 2);
      return {
        x,
        y,
        score: val,
        xp: r.xpEarned,
        date: new Date(r.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
        title: r.activityTitle,
        type: r.activityType
      };
    });
  }, [chronologicalRecords]);

  // Construct SVG Path String for Smooth Bezier Curve
  const { linePath, areaPath } = useMemo(() => {
    if (chartPoints.length < 2) {
      return { linePath: '', areaPath: '' };
    }

    let d = `M ${chartPoints[0].x} ${chartPoints[0].y}`;
    for (let i = 0; i < chartPoints.length - 1; i++) {
      const p0 = chartPoints[i];
      const p1 = chartPoints[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    const last = chartPoints[chartPoints.length - 1];
    const first = chartPoints[0];
    const baseY = chartHeight - paddingY;
    const a = `${d} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;

    return { linePath: d, areaPath: a };
  }, [chartPoints]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col my-auto animate-in zoom-in-95">
        
        {/* 1. Header Section */}
        <div className="bg-gradient-to-r from-teal-900 via-indigo-950 to-slate-900 text-white p-6 relative shrink-0">
          <div className="flex items-start justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
                🎓
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {student.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-xl bg-teal-500/20 text-teal-300 font-mono font-bold text-xs border border-teal-400/30">
                    No: #{student.studentNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-400/30">
                    {student.classSection} Şubesi
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  {student.school || 'Edirne Selimiye İmam Hatip Ortaokulu'} • Bireysel Tahtaya Kalkma & Performans Geçmişi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloadingPdf}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="PDF Olarak İndir"
              >
                {isDownloadingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-teal-200" />
                )}
                <span>{isDownloadingPdf ? 'İndiriliyor...' : 'PDF İndir'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Quick Action & Top Bar */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Veri Tabanı Kayıtlı Akıllı Tahta Geçmişi</span>
            </div>

            <button
              onClick={handleStartBoardSession}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
            >
              <Target className="w-4 h-4" />
              <span>🎯 Bu Öğrenciyi Tahtaya Çağır</span>
            </button>
          </div>
        </div>

        {/* 2. Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* A. KPI Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="text-[11px] font-black uppercase text-slate-500">Tahtaya Kalkış</div>
              <div className="text-2xl font-black text-teal-700 mt-1">{totalCount} Kez</div>
              <div className="text-[10px] font-bold text-slate-400 mt-0.5">Toplam Etkinlik</div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="text-[11px] font-black uppercase text-slate-500">Tahtadan XP</div>
              <div className="text-2xl font-black text-amber-600 mt-1">+{totalXp} XP</div>
              <div className="text-[10px] font-bold text-amber-700 mt-0.5">Kazanılan Puan</div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="text-[11px] font-black uppercase text-slate-500">Ortalama Başarı</div>
              <div className="text-2xl font-black text-indigo-700 mt-1">
                {scoredRecords.length > 0 ? `%${averageScore}` : '-'}
              </div>
              <div className="text-[10px] font-bold text-slate-400 mt-0.5">Maks. %100 Ortalama</div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="text-[11px] font-black uppercase text-slate-500">Katılım Durumu</div>
              <div className="text-sm font-black text-slate-800 mt-2 flex items-center gap-1.5">
                {trendInfo.direction === 'up' ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Yükseliş Trendi</span>
                  </span>
                ) : trendInfo.direction === 'down' ? (
                  <span className="text-rose-700 flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-rose-600" />
                    <span>Takip Edilmeli</span>
                  </span>
                ) : (
                  <span className="text-teal-700 flex items-center gap-1">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <span>Dengeli</span>
                  </span>
                )}
              </div>
              <div className="text-[10px] font-bold text-slate-500 mt-0.5">{trendInfo.label}</div>
            </div>

          </div>

          {/* B. Visual Progression Trend Chart */}
          <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
                  📈
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Zamana Göre Tahtaya Kalkma & Başarı İlerleme Grafiği (Maks. %100)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Öğrencinin tahtadaki etkinlik skorları ve katılım sıklığının artış/azalış eğrisi
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-black">
                <span className="flex items-center gap-1.5 text-teal-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
                  Başarı Oranı (%0 - %100)
                </span>
                <span className="flex items-center gap-1.5 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  Kazanılan XP
                </span>
              </div>
            </div>

            {/* SVG Visual Chart */}
            {chronologicalRecords.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-bold text-xs bg-white rounded-2xl border border-dashed border-slate-200">
                Bu öğrenci için henüz grafik oluşturulacak katılım verisi bulunmuyor.
              </div>
            ) : chronologicalRecords.length === 1 ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-2">
                <div className="text-xs font-bold text-slate-600">
                  Öğrenci ilk tahta etkinliğini başarıyla tamamladı!
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 font-black text-sm">
                  <span>🎯 {chartPoints[0].title}</span>
                  <span className="text-teal-600">• %{chartPoints[0].score}</span>
                  <span className="text-amber-600 font-black">+{chartPoints[0].xp} XP</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Yeni etkinlikler yapıldıkça artış ve azalış çizgi grafiği burada otomatik çizilecektir.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-4 border border-slate-200 overflow-x-auto">
                <div className="min-w-[500px]">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-44 overflow-visible"
                  >
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0f766e" />
                        <stop offset="50%" stopColor="#0d9488" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[0, 25, 50, 75, 100].map((gridVal) => {
                      const y = chartHeight - paddingY - (gridVal / 100) * (chartHeight - paddingY * 2);
                      return (
                        <g key={gridVal}>
                          <line
                            x1={paddingX}
                            y1={y}
                            x2={chartWidth - paddingX}
                            y2={y}
                            stroke="#e2e8f0"
                            strokeDasharray="3 3"
                            strokeWidth="1"
                          />
                          <text
                            x={paddingX - 8}
                            y={y + 3}
                            textAnchor="end"
                            fontSize="9"
                            fontWeight="bold"
                            fill="#94a3b8"
                          >
                            %{gridVal}
                          </text>
                        </g>
                      );
                    })}

                    {/* Area fill */}
                    {areaPath && <path d={areaPath} fill="url(#trendGradient)" />}

                    {/* Smooth curve line */}
                    {linePath && (
                      <path
                        d={linePath}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Data Points */}
                    {chartPoints.map((pt, i) => (
                      <g key={i} className="group cursor-pointer">
                        {/* Glow halo */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="7"
                          fill="#0d9488"
                          fillOpacity="0.15"
                          className="transition-all group-hover:scale-150"
                        />
                        {/* Point dot */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="4.5"
                          fill="#ffffff"
                          stroke="#0f766e"
                          strokeWidth="3"
                          className="transition-all group-hover:scale-125"
                        />

                        {/* Top Label (Score) */}
                        <text
                          x={pt.x}
                          y={pt.y - 10}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="900"
                          fill="#0f766e"
                        >
                          %{pt.score}
                        </text>

                        {/* Bottom Label (Date) */}
                        <text
                          x={pt.x}
                          y={chartHeight - 6}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="bold"
                          fill="#64748b"
                        >
                          {pt.date}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            )}

            {/* Distribution Bar of Activity Types */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-between">
                <span className="text-xs font-bold text-violet-900 flex items-center gap-1.5">
                  🎮 Oyunlar
                </span>
                <span className="font-black text-violet-700 text-xs">{gameCount} Kez</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  📝 Testler
                </span>
                <span className="font-black text-blue-700 text-xs">{testCount} Kez</span>
              </div>
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  📋 Rubrikler
                </span>
                <span className="font-black text-teal-700 text-xs">{rubricCount} Kez</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  📖 Günlükler
                </span>
                <span className="font-black text-amber-700 text-xs">{journalCount} Kez</span>
              </div>
            </div>

          </div>

          {/* C. History Activity Log Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Tahtaya Kalkma Geçmişi Kayıtları ({displayRecords.length})
                </h3>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 flex-wrap text-[11px] font-bold">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tümü ({records.length})
                </button>
                <button
                  onClick={() => setFilterType('game')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterType === 'game'
                      ? 'bg-violet-600 text-white'
                      : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
                  }`}
                >
                  Oyun ({gameCount})
                </button>
                <button
                  onClick={() => setFilterType('test')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterType === 'test'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Test ({testCount})
                </button>
                <button
                  onClick={() => setFilterType('rubric')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterType === 'rubric'
                      ? 'bg-teal-600 text-white'
                      : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                  }`}
                >
                  Rubrik ({rubricCount})
                </button>
                <button
                  onClick={() => setFilterType('journal')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterType === 'journal'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  Günlük ({journalCount})
                </button>
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              {displayRecords.length === 0 ? (
                <div className="py-8 text-center text-slate-400 font-bold text-xs">
                  Seçilen filtrede kayıtlı tahta aktivitesi bulunamadı.
                </div>
              ) : (
                displayRecords.map((item) => {
                  const normalizedPct = getNormalizedPercent(item.score, item.maxScore);

                  return (
                    <div
                      key={item.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">
                          {item.activityType === 'game'
                            ? '🎮'
                            : item.activityType === 'test'
                            ? '📝'
                            : item.activityType === 'rubric'
                            ? '📋'
                            : '📖'}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                            <span>{item.activityTitle}</span>
                            {item.outcomeCode && (
                              <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                                {item.outcomeCode}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {new Date(item.timestamp).toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}{' '}
                              •{' '}
                              {new Date(item.timestamp).toLocaleTimeString('tr-TR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        {item.score !== undefined && item.score !== null && (
                          <div className="text-right">
                            <div className="text-xs font-black text-slate-800">
                              %{normalizedPct} Başarı
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">Başarı Oranı</div>
                          </div>
                        )}
                        <div className="text-right">
                          <div className="text-xs sm:text-sm font-black text-amber-600">
                            +{item.xpEarned} XP
                          </div>
                          <div className="text-[10px] font-bold text-teal-600">Kazanıldı</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

        {/* 3. Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Öğrenci: <strong className="text-slate-800 font-black">{student.name} (#{student.studentNumber})</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPdf}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isDownloadingPdf ? 'İndiriliyor...' : 'PDF İndir'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs transition-all cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
