'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import {
  RubricSubmissionRecord,
  getStoredSubmissions,
  calculateClassAnalytics,
  calculateOutcomeCrossClassAnalytics,
  updateTeacherFeedbackInStore
} from '@/lib/rubric-store';
import { getRubricForOutcome } from '@/lib/rubric-data';
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
  School,
  Calendar,
  Layers,
  Check,
  HelpCircle,
  Printer,
  FileSpreadsheet
} from 'lucide-react';

interface TeacherRubricAnalyticsProps {
  teacherClasses?: string[];
  teacherSchool?: string;
}

export function TeacherRubricAnalytics({
  teacherClasses = ['5-A', '5-B', '5-C'],
  teacherSchool = 'Edirne Selimiye İmam Hatip Ortaokulu'
}: TeacherRubricAnalyticsProps) {
  const { playSound } = useApp();

  const [submissions, setSubmissions] = useState<RubricSubmissionRecord[]>([]);
  const [activeViewMode, setActiveViewMode] = useState<'class_based' | 'outcome_based'>('class_based');

  // Mode A: Class-based selection
  const [selectedClass, setSelectedClass] = useState<string>(teacherClasses[0] || '5-A');

  // Mode B: Outcome-based selection
  const [selectedOutcomeCode, setSelectedOutcomeCode] = useState<string>('MAT.5.3.3');

  // Student Detail Modal state
  const [inspectingSubmission, setInspectingSubmission] = useState<RubricSubmissionRecord | null>(null);
  const [teacherFeedbackInput, setTeacherFeedbackInput] = useState<string>('');
  const [feedbackSavedNotice, setFeedbackSavedNotice] = useState(false);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'Mükemmel' | 'Başarılı' | 'Orta' | 'Geliştirilmeli'>('all');

  // Load submissions on mount
  useEffect(() => {
    setSubmissions(getStoredSubmissions());
  }, []);

  const refreshData = () => {
    setSubmissions(getStoredSubmissions());
  };

  // Distinct Outcomes in DB
  const availableOutcomes = [
    { code: 'MAT.5.3.3', title: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme' },
    { code: 'MAT.5.3.1', title: 'Doğru, Doğru Parçası ve Işın ile İlgili Temel Geometrik Çizimler' }
  ];

  // Mode A Calculations
  const classAnalytics = calculateClassAnalytics(selectedClass);

  // Mode B Calculations
  const outcomeAnalytics = calculateOutcomeCrossClassAnalytics(selectedOutcomeCode);

  // Global KPIs
  const totalSubmissionsCount = submissions.length;
  const overallAveragePercent = totalSubmissionsCount > 0
    ? Math.round(submissions.reduce((acc, cur) => acc + cur.percentage, 0) / totalSubmissionsCount)
    : 0;
  const excellentCount = submissions.filter((s) => s.performanceLevel === 'Mükemmel').length;
  const needSupportCount = submissions.filter((s) => s.performanceLevel === 'Geliştirilmeli' || s.performanceLevel === 'Orta').length;

  const handleOpenInspector = (sub: RubricSubmissionRecord) => {
    playSound('click');
    setInspectingSubmission(sub);
    setTeacherFeedbackInput(sub.teacherFeedback || '');
    setFeedbackSavedNotice(false);
  };

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
      
      {/* 1. Header Banner & Mode Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-black uppercase tracking-wider">
              <ClipboardCheck className="w-4 h-4 text-teal-600" />
              <span>Maarif Modeli • Öğretmen Öz Değerlendirme Takip & Rapor Paneli</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Kazanım & Sınıf Öz Değerlendirme Raporları
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Öğrencilerinizin her öğrenme çıktısında doldurduğu 4 kademeli analitik rubrik sonuçlarını sınıf bazında ve kazanım karşılaştırmalı olarak inceleyiniz.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => {
                playSound('click');
                setActiveViewMode('class_based');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeViewMode === 'class_based'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Sınıf Bazlı Analiz (Şube Seçimi)</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                setActiveViewMode('outcome_based');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeViewMode === 'outcome_based'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Kazanım Bazlı Şube Kıyaslaması</span>
            </button>
          </div>
        </div>

        {/* Global KPI Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Toplam Form</div>
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
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Takip / Destek</div>
              <div className="text-2xl font-black text-amber-600 mt-0.5">{needSupportCount} Öğrenci</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
              💡
            </div>
          </div>
        </div>
      </div>

      {/* 2. VIEW MODE A: SINIF BAZLI KAZANIM TAKİBİ */}
      {activeViewMode === 'class_based' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Class Selector Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
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
              </div>
            ))}
          </div>

          {/* Submissions Table for Selected Class */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {selectedClass} Şubesi Öğrenci Öz Değerlendirme Formları
                </h3>
                <p className="text-xs text-slate-500">
                  Öğrencinin puanına ve kişisel yansıtma notuna bakmak için satıra veya &quot;İncele&quot; butonuna tıklayınız.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Öğrenci Ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-teal-500"
                  />
                </div>

                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value as any)}
                  className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold outline-none"
                >
                  <option value="all">Tüm Düzeyler</option>
                  <option value="Mükemmel">🌟 Mükemmel</option>
                  <option value="Başarılı">🎯 Başarılı</option>
                  <option value="Orta">🔄 Orta</option>
                  <option value="Geliştirilmeli">💡 Geliştirilmeli</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                    <th className="py-2.5 px-3">No & Öğrenci</th>
                    <th className="py-2.5 px-3">Kazanım</th>
                    <th className="py-2.5 px-3 text-center">Ölçüt Puanları (c1-c5)</th>
                    <th className="py-2.5 px-3 text-center">Toplam Puan</th>
                    <th className="py-2.5 px-3">Düzey</th>
                    <th className="py-2.5 px-3">Öğretmen Notu</th>
                    <th className="py-2.5 px-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classAnalytics.allClassSubmissions
                    .filter((s) => !searchTerm || s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentNumber.includes(searchTerm))
                    .filter((s) => levelFilter === 'all' || s.performanceLevel === levelFilter)
                    .map((sub) => (
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
                            <span className="text-teal-700 font-bold flex items-center gap-1 truncate max-w-[120px]" title={sub.teacherFeedback}>
                              <MessageSquare className="w-3 h-3 text-teal-600 shrink-0" />
                              <span>{sub.teacherFeedback}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Geri bildirim yok</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleOpenInspector(sub)}
                            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>İncele</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 3. VIEW MODE B: KAZANIM BAZLI ŞUBELER KARŞILAŞTIRMASI */}
      {activeViewMode === 'outcome_based' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Outcome Selector Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
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
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-102'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {out.code} ({out.code === 'MAT.5.3.3' ? 'Açılar & İletki' : 'Temel Çizimler'})
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-bold text-slate-500">
              Tüm Şubeler Ortalama Başarısı: <strong className="text-teal-700 font-black text-sm">%{outcomeAnalytics.overallAvgPercent}</strong>
            </div>
          </div>

          {/* Cross-Class Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {outcomeAnalytics.classStats.map((cStat) => (
              <div
                key={cStat.classSection}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-teal-400 transition-all shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-black uppercase text-teal-700 tracking-wider">Şube Raporu</span>
                    <h3 className="text-xl font-black text-slate-900">{cStat.classSection} Şubesi</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{cStat.studentCount} Öğrenci Değerlendirdi</p>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-black text-teal-600 font-mono">%{cStat.avgPercent}</div>
                    <div className="text-[10px] font-bold text-slate-400">Ortalama Skor: {cStat.avgScore}/20</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
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
            ))}
          </div>

          {/* Diagnostic Advisory Banner */}
          <div className="bg-gradient-to-r from-teal-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-teal-500/30 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center text-2xl shrink-0">
              💡
            </div>
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-wider text-teal-300">
                Maarif Pedagojik Teşhis & Öğretmen Rehberliği
              </div>
              <h4 className="text-base font-black text-white">
                {selectedOutcomeCode} Kazanımı Şubeler Arası Analiz Raporu
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                5-A şubesinde öğrencilerin %80&apos;i <strong>İletki Kullanımı (c2)</strong> ve <strong>Kavram Yanılgısı (c4)</strong> ölçütlerinde üst düzey başarı gösterirken, 5-B şubesinde ters ölçekten okuma (iç/dış cetvel) konusunda laboratuvar ortamında ek bir simülasyon tekrarı tavsiye edilmektedir.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* 4. DETAILED STUDENT RUBRIC INSPECTOR MODAL */}
      {inspectingSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
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

              <button
                onClick={() => setInspectingSubmission(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
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

    </div>
  );
}
