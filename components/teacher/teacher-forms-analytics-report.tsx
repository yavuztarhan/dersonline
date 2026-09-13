'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  getTriangulatedCorrelationData,
  StudentTriangulatedData,
  PeerEvaluationRecord,
  syncPeerEvaluationsFromApi
} from '@/lib/peer-evaluation-store';
import { UserAvatar } from '@/components/ui/user-avatar';
import { OUTCOME_RUBRICS, getRubricForOutcome } from '@/lib/rubric-data';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  ClipboardCheck,
  Users,
  Target,
  BarChart2,
  TrendingUp,
  Award,
  Star,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Sparkles,
  ChevronRight,
  School,
  Download,
  FileText,
  Loader2,
  Zap,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  Layers,
  Heart,
  Gamepad2,
  ArrowUpRight,
  Check,
  X
} from 'lucide-react';

interface TeacherFormsAnalyticsReportProps {
  teacherClasses?: string[];
  teacherSchool?: string;
  teacherName?: string;
  teacherBranch?: string;
}

export function TeacherFormsAnalyticsReport({
  teacherClasses = [],
  teacherSchool = '',
  teacherName = '',
  teacherBranch = 'Matematik'
}: TeacherFormsAnalyticsReportProps) {
  const { currentUser, students, getVisibleStudents } = useAuth();
  const { playSound } = useApp();

  const [selectedClass, setSelectedClass] = useState<string>(teacherClasses[0] || '7-A');
  const [selectedOutcomeCode, setSelectedOutcomeCode] = useState<string>(
    teacherClasses[0]?.startsWith('7') ? 'MAT.7.1.1' :
    teacherClasses[0]?.startsWith('6') ? 'MAT.6.1.1' : 'MAT.5.3.1'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentTriangulatedData | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const OUTCOMES_LIST = [
    { code: 'MAT.7.1.1', title: 'Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi' },
    { code: 'MAT.6.1.1', title: 'Asal Sayılar ve Doğal Sayıların Asal Çarpanları' },
    { code: 'MAT.5.3.1', title: 'Doğru, Doğru Parçası ve Işın ile İlgili Temel Geometrik Çizimler' },
    { code: 'MAT.5.3.3', title: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme' },
    { code: 'MAT.5.3.2', title: 'Geometrik Şekillerin İnşası ve Pergel/Gönye Kullanımı' }
  ];

  // Auto-switch outcome when selected class changes
  useEffect(() => {
    if (selectedClass.startsWith('7')) {
      setSelectedOutcomeCode('MAT.7.1.1');
    } else if (selectedClass.startsWith('6')) {
      setSelectedOutcomeCode('MAT.6.1.1');
    } else if (selectedClass.startsWith('5')) {
      setSelectedOutcomeCode('MAT.5.3.1');
    }
  }, [selectedClass]);

  // Restrict to students visible to this teacher (no unassigned demo students)
  const visibleStudents = useMemo(() => {
    return getVisibleStudents(currentUser);
  }, [currentUser, getVisibleStudents, students]);

  const [syncVersion, setSyncVersion] = useState(0);

  useEffect(() => {
    syncPeerEvaluationsFromApi().then(() => setSyncVersion((v) => v + 1));
  }, []);

  // Fetch Triangulated Data
  const { studentsData, classStats } = useMemo(() => {
    return getTriangulatedCorrelationData(selectedClass, selectedOutcomeCode, visibleStudents);
  }, [selectedClass, selectedOutcomeCode, visibleStudents, syncVersion]);

  // Filtered student list by search
  const filteredStudents = useMemo(() => {
    return studentsData.filter((s) => {
      const q = searchQuery.toLowerCase();
      return (
        !searchQuery ||
        s.studentName.toLowerCase().includes(q) ||
        s.studentNumber.includes(q)
      );
    });
  }, [studentsData, searchQuery]);

  const activeOutcome = OUTCOMES_LIST.find((o) => o.code === selectedOutcomeCode) || OUTCOMES_LIST[0];
  const rubric = getRubricForOutcome(selectedOutcomeCode, activeOutcome.title, selectedOutcomeCode);

  // PDF Export
  const handleExportPDF = async () => {
    try {
      setIsExportingPdf(true);
      playSound('select');

      const element = document.getElementById('forms-analytics-report-container');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Maarif_Oz_Akran_Oyun_Korelasyon_Raporu_${selectedClass}_${selectedOutcomeCode}.pdf`);
      playSound('success');
    } catch (err) {
      console.error('PDF aktarım hatası:', err);
      alert('PDF raporu oluşturulurken bir hata oluştu.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div id="forms-analytics-report-container" className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. TOP HEADER & FILTER BAR */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Öğrenci Formları & Profesyonel Korelasyon Raporu</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                Türkiye Yüzyılı Maarif Modeli
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Öz Değerlendirme • Akran Değerlendirme • Oyun Başarısı Korelasyonu
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
              Öğrencilerin kendi öz değerlendirme puanları, takım arkadaşlarının verdiği akran değerlendirmeleri ve süreç içi oyun/etkinlik başarıları arasındaki <strong>3 boyutlu korelasyonu</strong> ve bilişsel uyumu inceleyiniz.
            </p>
          </div>

          {/* Export PDF Button */}
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={isExportingPdf}
            className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
            title="Sınıf Korelasyon Raporunu PDF Olarak İndir"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>PDF Hazırlanıyor...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Korelasyon Raporunu İndir (PDF)</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Class & Outcome Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          
          {/* Class Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>Sınıf / Şube Seçiniz</span>
            </label>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl flex-wrap gap-1">
              {[...teacherClasses, 'Tümü'].map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => {
                    playSound('select');
                    setSelectedClass(cls);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    selectedClass === cls
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cls === 'Tümü' ? 'Tüm Sınıflar' : `${cls}`}
                </button>
              ))}
            </div>
          </div>

          {/* Outcome Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>Öğrenim Çıktısı (Kazanım)</span>
            </label>
            <select
              value={selectedOutcomeCode}
              onChange={(e) => {
                playSound('select');
                setSelectedOutcomeCode(e.target.value);
              }}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
            >
              {OUTCOMES_LIST.map((out) => (
                <option key={out.code} value={out.code}>
                  {out.code} - {out.title}
                </option>
              ))}
            </select>
          </div>

          {/* Search Student */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Öğrenci Arama</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Öğrenci adı veya numarası..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

        </div>

      </div>

      {/* 2. 4-WAY TRIANGULATION STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Öz Değerlendirme */}
        <div className="p-5 rounded-3xl bg-white border border-teal-200/80 shadow-xs space-y-2 relative overflow-hidden group hover:border-teal-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-teal-700">Öz Değerlendirme</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black">
              <ClipboardCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            %{classStats.selfAverage}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Öğrencilerin kendine verdiği ortalama başarı puanı
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-teal-600 rounded-full" style={{ width: `${classStats.selfAverage}%` }} />
          </div>
        </div>

        {/* Card 2: Akran Değerlendirme */}
        <div className="p-5 rounded-3xl bg-white border border-indigo-200/80 shadow-xs space-y-2 relative overflow-hidden group hover:border-indigo-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-indigo-700">Akran Değerlendirme</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            %{classStats.peerAverage}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Takım arkadaşlarının verdiği ortalama başarı puanı
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${classStats.peerAverage}%` }} />
          </div>
        </div>

        {/* Card 3: Oyun & Etkinlik Başarısı */}
        <div className="p-5 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-2 relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-amber-700">Kazanım Oyun Başarısı</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black">
              <Gamepad2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            %{classStats.activityAverage}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Ders içi interaktif oyun ve simülasyon puanı
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${classStats.activityAverage}%` }} />
          </div>
        </div>

        {/* Card 4: 3'lü Korelasyon Uyum Oranı */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-teal-300">Korelasyon & Uyum</span>
            <div className="w-9 h-9 rounded-xl bg-white/10 text-teal-300 flex items-center justify-center font-black">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            %{classStats.overallAgreementRate}
          </div>
          <div className="text-[11px] text-slate-300 font-medium">
            {classStats.highAgreementCount} / {classStats.totalStudents} öğrencide yüksek tutarlılık
          </div>
          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-teal-400 rounded-full" style={{ width: `${classStats.overallAgreementRate}%` }} />
          </div>
        </div>

      </div>

      {/* 3. CORRELATION DISTRIBUTION PILLS */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="text-xs font-black uppercase tracking-wider text-slate-400">
          Sınıf İçi Değerlendirme & Algı Dağılımı
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                <span>🎯 Yüksek Tutarlılık</span>
              </div>
              <div className="text-[10px] text-emerald-800">Öz, akran ve oyun dengeli</div>
            </div>
            <span className="text-lg font-black text-emerald-700 bg-white px-2.5 py-1 rounded-xl shadow-2xs">
              {classStats.highAgreementCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                <span>💡 Mütevazı / Çekingen</span>
              </div>
              <div className="text-[10px] text-blue-800">Başarılı ama kendine az puan vermiş</div>
            </div>
            <span className="text-lg font-black text-blue-700 bg-white px-2.5 py-1 rounded-xl shadow-2xs">
              {classStats.modestCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <span>⚠️ Aşırı Özgüvenli</span>
              </div>
              <div className="text-[10px] text-amber-800">Kendine çok, oyunda daha düşük</div>
            </div>
            <span className="text-lg font-black text-amber-700 bg-white px-2.5 py-1 rounded-xl shadow-2xs">
              {classStats.overconfidentCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-black text-rose-950 flex items-center gap-1.5">
                <span>🚨 Gelişim Desteği</span>
              </div>
              <div className="text-[10px] text-rose-800">Ek çalışma ve pekiştirme gereken</div>
            </div>
            <span className="text-lg font-black text-rose-700 bg-white px-2.5 py-1 rounded-xl shadow-2xs">
              {classStats.needsSupportCount}
            </span>
          </div>

        </div>
      </div>

      {/* 4. DETAILED STUDENT CORRELATION MATRIX TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-teal-600" />
              <span>Öğrenci Bazlı 3 Boyutlu Karşılaştırma Matrisi</span>
            </h3>
            <p className="text-xs text-slate-500">
              {activeOutcome.code} • {activeOutcome.title}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Toplam {filteredStudents.length} Öğrenci
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 sm:px-6">Öğrenci Bilgisi</th>
                <th className="py-3.5 px-4 text-center">Öz Değerlendirme</th>
                <th className="py-3.5 px-4 text-center">Akran Değerlendirme</th>
                <th className="py-3.5 px-4 text-center">Oyun Başarısı</th>
                <th className="py-3.5 px-4 text-center">Korelasyon & Uyum Durumu</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Bu kriterlere uygun öğrenci verisi bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  return (
                    <tr
                      key={stu.studentId}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* 1. Student Identity */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            avatar="🎓"
                            name={stu.studentName}
                            size="sm"
                            className="w-9 h-9 border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-black text-slate-900">{stu.studentName}</div>
                            <div className="text-[10px] text-slate-400 font-semibold">
                              {stu.classSection} • No: #{stu.studentNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Self Score */}
                      <td className="py-3.5 px-4 text-center">
                        {stu.selfScore !== null ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                              %{stu.selfScore}
                            </span>
                            <span className="text-[9px] text-slate-400 mt-0.5">
                              {stu.selfSubmission?.performanceLevel}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Doldurulmadı</span>
                        )}
                      </td>

                      {/* 3. Peer Average Score */}
                      <td className="py-3.5 px-4 text-center">
                        {stu.peerAverageScore !== null ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                              %{stu.peerAverageScore}
                            </span>
                            <span className="text-[9px] text-slate-400 mt-0.5">
                              {stu.peerReviewerCount} akran değerlendirdi
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Bekleniyor</span>
                        )}
                      </td>

                      {/* 4. Activity / Game Score */}
                      <td className="py-3.5 px-4 text-center">
                        {stu.activityScore !== null ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                              %{stu.activityScore}
                            </span>
                            <span className="text-[9px] text-slate-400 mt-0.5">
                              {stu.activityCount} oyun/etkinlik
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Oynamadı</span>
                        )}
                      </td>

                      {/* 5. Correlation & Alignment Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${stu.statusBadge.badgeClass}`}>
                            {stu.statusBadge.icon} {stu.statusBadge.title}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            Uyum Katsayısı: %{stu.overallCorrelationIndex}
                          </span>
                        </div>
                      </td>

                      {/* 6. Action Button */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            playSound('select');
                            setSelectedStudentDetail(stu);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-600" />
                          <span>Korelasyon Detayı</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 5. STUDENT DETAILED 3-WAY COMPARISON MODAL */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 flex items-start justify-between gap-4 shrink-0">
              <div className="flex items-center gap-4">
                <UserAvatar
                  avatar="🎓"
                  name={selectedStudentDetail.studentName}
                  size="lg"
                  className="w-14 h-14 border-2 border-teal-400 bg-teal-950 text-white shadow-md shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">
                      {selectedStudentDetail.studentName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-bold text-xs border border-teal-400/40">
                      {selectedStudentDetail.classSection} • No: #{selectedStudentDetail.studentNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {selectedStudentDetail.outcomeCode} - {selectedStudentDetail.outcomeTitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudentDetail(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Top 3 Score Comparison Pills */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
                  <div className="text-[10px] uppercase font-black text-teal-700">Öz Değerlendirme</div>
                  <div className="text-2xl font-black text-teal-950">
                    %{selectedStudentDetail.selfScore || 0}
                  </div>
                  <div className="text-[10px] text-slate-500">Kendine verdiği puan</div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
                  <div className="text-[10px] uppercase font-black text-indigo-700">Akran Ortalaması</div>
                  <div className="text-2xl font-black text-indigo-950">
                    %{selectedStudentDetail.peerAverageScore || 0}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {selectedStudentDetail.peerReviewerCount} arkadaşının ortalaması
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <div className="text-[10px] uppercase font-black text-amber-700">Oyun & Etkinlik</div>
                  <div className="text-2xl font-black text-amber-950">
                    %{selectedStudentDetail.activityScore || 0}
                  </div>
                  <div className="text-[10px] text-slate-500">Pratik oyun başarısı</div>
                </div>
              </div>

              {/* Status & Pedagogical Insight Card */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${selectedStudentDetail.statusBadge.badgeClass}`}>
                    {selectedStudentDetail.statusBadge.icon} {selectedStudentDetail.statusBadge.title}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Uyum Katsayısı: %{selectedStudentDetail.overallCorrelationIndex}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedStudentDetail.statusBadge.description}
                </p>
              </div>

              {/* Criteria-by-Criteria Breakdown (Öz vs Akran) */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>Kriter Bazında Karşılaştırma (Öz vs Akran)</span>
                </h4>

                <div className="space-y-3">
                  {rubric.criteria.map((crit, idx) => {
                    const selfCritRating = selectedStudentDetail.selfSubmission?.ratings?.[crit.id] || null;
                    
                    // Average peer rating for this criterion
                    const peerRatings = selectedStudentDetail.peerSubmissions
                      .map((p) => p.ratings?.[crit.id])
                      .filter(Boolean);
                    const peerCritAvg =
                      peerRatings.length > 0
                        ? (peerRatings.reduce((a, b) => a + b, 0) / peerRatings.length).toFixed(1)
                        : null;

                    return (
                      <div
                        key={crit.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-800">
                            {idx + 1}. {crit.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">
                            {crit.category}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                          {/* Self Score */}
                          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                            <span className="font-bold text-teal-900">Öz Değerlendirme:</span>
                            <span className="font-black text-teal-800">
                              {selfCritRating ? `${selfCritRating} / 4 Puan` : 'Doldurulmadı'}
                            </span>
                          </div>

                          {/* Peer Score */}
                          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
                            <span className="font-bold text-indigo-900">Akran Ortalaması:</span>
                            <span className="font-black text-indigo-800">
                              {peerCritAvg ? `${peerCritAvg} / 4 Puan` : 'Yok'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Peer Comments / Notes */}
              {selectedStudentDetail.peerSubmissions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <span>Takım Arkadaşlarının Yazdığı Akran Görüşleri</span>
                  </h4>

                  <div className="space-y-2">
                    {selectedStudentDetail.peerSubmissions.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold text-indigo-950">
                          <span>{p.evaluatorStudentName} (#{p.evaluatorStudentNumber})</span>
                          <span className="text-[10px] text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 font-black">
                            Verilen Puan: %{p.percentage} ({p.totalScore}/20)
                          </span>
                        </div>
                        {p.evaluatorNote ? (
                          <p className="text-slate-700 italic bg-white p-2.5 rounded-xl border border-indigo-100">
                            "{p.evaluatorNote}"
                          </p>
                        ) : (
                          <p className="text-slate-400 text-[11px]">Ek görüş belirtilmedi.</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudentDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
