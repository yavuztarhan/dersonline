'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  getStoredBoardParticipations,
  BoardParticipationRecord
} from '@/lib/board-participation-store';
import { downloadStudentBoardReportPDF } from '@/lib/board-pdf-generator';
import { getNormalizedPercent } from '@/components/teacher/teacher-student-board-history-modal';
import { StudentUser } from '@/types/auth';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Activity,
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
  Flame,
  Star
} from 'lucide-react';

export function StudentBoardHistoryCard() {
  const { currentUser } = useAuth();
  const { playSound } = useApp();
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'game' | 'test' | 'rubric' | 'journal'>('all');

  const student = currentUser && currentUser.role === 'student' ? (currentUser as StudentUser) : null;
  const studentNumber = student?.studentNumber || '104';
  const studentId = student?.id;

  const [allRecords, setAllRecords] = useState<BoardParticipationRecord[]>(() =>
    getStoredBoardParticipations()
  );

  useEffect(() => {
    const handleUpdate = () => {
      setAllRecords(getStoredBoardParticipations());
    };
    window.addEventListener('maarif_board_participation_added', handleUpdate);
    return () => window.removeEventListener('maarif_board_participation_added', handleUpdate);
  }, []);

  // Filter records strictly for the current student
  const studentRecords = useMemo(() => {
    return allRecords.filter(
      (r) =>
        (studentNumber && r.studentNumber === studentNumber) ||
        (studentId && r.studentId === studentId)
    );
  }, [allRecords, studentNumber, studentId]);

  // Chronological ascending for trend & chart
  const chronologicalRecords = useMemo(() => {
    return [...studentRecords].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [studentRecords]);

  // Filtered descending for list
  const displayRecords = useMemo(() => {
    let list = [...studentRecords].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    if (filterType !== 'all') {
      list = list.filter((r) => r.activityType === filterType);
    }
    return list;
  }, [studentRecords, filterType]);

  // Metrics
  const totalCount = studentRecords.length;
  const totalXp = studentRecords.reduce((sum, r) => sum + (r.xpEarned || 0), 0);
  const scoredRecords = studentRecords.filter((r) => r.score !== undefined && r.score !== null);
  
  const averageScore = scoredRecords.length > 0
    ? Math.min(100, Math.max(0, Math.round(
        scoredRecords.reduce((sum, r) => sum + getNormalizedPercent(r.score, r.maxScore), 0) / scoredRecords.length
      )))
    : 0;

  // Trend detection
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

  // Activity type counts
  const gameCount = studentRecords.filter((r) => r.activityType === 'game').length;
  const testCount = studentRecords.filter((r) => r.activityType === 'test').length;
  const rubricCount = studentRecords.filter((r) => r.activityType === 'rubric').length;
  const journalCount = studentRecords.filter((r) => r.activityType === 'journal').length;

  const handleDownloadPDF = async () => {
    if (!student) return;
    try {
      setIsDownloadingPdf(true);
      playSound('select');
      await downloadStudentBoardReportPDF(student, studentRecords, {
        schoolName: student.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
        teacherName: 'Matematik Öğretmeni',
        teacherBranch: 'Matematik'
      });
      playSound('success');
    } catch (err) {
      console.error('PDF error:', err);
      alert('Rapor PDF oluşturulurken bir hata oluştu.');
    } finally {
      setIsDownloadingPdf(false);
    }
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
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-black">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Bireysel Akıllı Tahta & Derse Katılım Karnem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Tahtaya Kalkma & Başarı Geçmişim</span>
              <span className="text-xs px-2.5 py-1 rounded-xl bg-teal-500/20 text-teal-300 font-bold border border-teal-400/30">
                Kişisel Portfolyo
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              Sınıfta akıllı tahtada NumPad ile giriş yaparak çözdüğün matematik oyunları, kazanım testleri ve öz değerlendirmelerinden kazandığın puanlar ve gelişim çizelgen.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPdf}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-xs shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-teal-100" />
              )}
              <span>{isDownloadingPdf ? 'PDF Hazırlanıyor...' : '📥 Raporumu PDF İndir'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase text-slate-500">Tahtaya Kalkışım</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-black">
              🎯
            </div>
          </div>
          <div className="text-3xl font-black text-teal-700 mt-2">
            {totalCount} Kez
          </div>
          <div className="text-[11px] font-bold text-slate-400 mt-0.5">
            Tamamlanan Tahta Etkinliği
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase text-slate-500">Tahtadan XP Puanım</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              ⚡
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 mt-2">
            +{totalXp} XP
          </div>
          <div className="text-[11px] font-bold text-amber-800 mt-0.5">
            Hesabına Eklenen Toplam Puan
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase text-slate-500">Ortalama Başarım</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              🏆
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-700 mt-2">
            {scoredRecords.length > 0 ? `%${averageScore}` : '-'}
          </div>
          <div className="text-[11px] font-bold text-slate-400 mt-0.5">
            Test & Oyun Başarı Oranı
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase text-slate-500">Gelişim Durumu</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              📈
            </div>
          </div>
          <div className="text-sm font-black text-slate-800 mt-2 flex items-center gap-1.5">
            {trendInfo.direction === 'up' ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Yükseliş Trendi</span>
              </span>
            ) : trendInfo.direction === 'down' ? (
              <span className="text-rose-700 flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-rose-600" />
                <span>Daha Fazla Pratik</span>
              </span>
            ) : (
              <span className="text-teal-700 flex items-center gap-1">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Dengeli & İstikrarlı</span>
              </span>
            )}
          </div>
          <div className="text-[11px] font-bold text-slate-500 mt-0.5">
            {trendInfo.label}
          </div>
        </div>

      </div>

      {/* 3. Visual Progression Trend Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-base">
              📈
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Zamana Göre Başarı ve Katılım İlerleme Grafiğim
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tahtada çözdüğün etkinliklerdeki başarı yüzdelerinin (%0 - %100) zamana bağlı gelişim eğrisi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-black">
            <span className="flex items-center gap-1.5 text-teal-700">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
              Başarı Oranı (%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Kazanılan XP
            </span>
          </div>
        </div>

        {/* SVG Chart */}
        {chronologicalRecords.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            Henüz tahtada tamamlanan bir etkinliğin bulunmuyor. Derste tahtaya kalkarak ilk puanlarını kazanabilirsin! 🎯
          </div>
        ) : chronologicalRecords.length === 1 ? (
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center space-y-2">
            <div className="text-xs font-bold text-slate-700">
              İlk tahta etkinliğini başarıyla tamamladın! 🎉
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 font-black text-sm">
              <span>🎯 {chartPoints[0].title}</span>
              <span className="text-teal-600">• %{chartPoints[0].score} Başarı</span>
              <span className="text-amber-600 font-black">+{chartPoints[0].xp} XP</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Yeni etkinlikler yaptıkça ilerleme grafiğin burada otomatik olarak oluşacaktır.
            </p>
          </div>
        ) : (
          <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200 overflow-x-auto">
            <div className="min-w-[500px]">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-44 overflow-visible"
              >
                <defs>
                  <linearGradient id="studentTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="studentLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0f766e" />
                    <stop offset="50%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 25, 50, 75, 100].map((gridVal) => {
                  const y = chartHeight - paddingY - (gridVal / 100) * (chartHeight - paddingY * 2);
                  return (
                    <g key={gridVal}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={chartWidth - paddingX}
                        y2={y}
                        stroke="#cbd5e1"
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

                {/* Area Fill */}
                {areaPath && <path d={areaPath} fill="url(#studentTrendGradient)" />}

                {/* Curve Line */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="url(#studentLineGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {chartPoints.map((pt, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="7"
                      fill="#0d9488"
                      fillOpacity="0.15"
                      className="transition-all group-hover:scale-150"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill="#ffffff"
                      stroke="#0f766e"
                      strokeWidth="3"
                      className="transition-all group-hover:scale-125"
                    />
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

        {/* Activity Distribution */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="p-3 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-between">
            <span className="text-xs font-bold text-violet-900 flex items-center gap-1.5">
              🎮 Oyunlar
            </span>
            <span className="font-black text-violet-700 text-xs">{gameCount} Kez</span>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              📝 Testler
            </span>
            <span className="font-black text-blue-700 text-xs">{testCount} Kez</span>
          </div>
          <div className="p-3 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-between">
            <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
              📋 Rubrikler
            </span>
            <span className="font-black text-teal-700 text-xs">{rubricCount} Kez</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              📖 Günlükler
            </span>
            <span className="font-black text-amber-700 text-xs">{journalCount} Kez</span>
          </div>
        </div>
      </div>

      {/* 4. Filterable History Records List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              Tahtadaki Tüm Etkinlik Geçmişim ({displayRecords.length})
            </h3>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs font-bold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tümü ({studentRecords.length})
            </button>
            <button
              onClick={() => setFilterType('game')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                filterType === 'game'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
              }`}
            >
              Oyun ({gameCount})
            </button>
            <button
              onClick={() => setFilterType('test')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                filterType === 'test'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Test ({testCount})
            </button>
            <button
              onClick={() => setFilterType('rubric')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                filterType === 'rubric'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
              }`}
            >
              Rubrik ({rubricCount})
            </button>
            <button
              onClick={() => setFilterType('journal')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                filterType === 'journal'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Günlük ({journalCount})
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
          {displayRecords.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-bold text-xs">
              Bu kategoride kayıtlı tahta aktiviten bulunmuyor.
            </div>
          ) : (
            displayRecords.map((item) => {
              const normalizedPct = getNormalizedPercent(item.score, item.maxScore);

              return (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-teal-50/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
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
                          <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                            {item.outcomeCode}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
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
                        <div className="text-xs sm:text-sm font-black text-slate-800">
                          %{normalizedPct} Başarı
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">Başarı Oranı</div>
                      </div>
                    )}
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-black text-amber-600">
                        +{item.xpEarned} XP
                      </div>
                      <div className="text-[10px] font-bold text-teal-600">Hesabına Eklendi</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
