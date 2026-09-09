'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import { Outcome } from '@/types';
import { getAnnualPlanByOutcomeCode, AnnualPlanItem } from '@/lib/annual-plan-data';
import { getAcademicWeekLabel } from '@/lib/academic-calendar';
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  School,
  User,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface LessonPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  outcome: Outcome;
}

export function LessonPlanModal({ isOpen, onClose, outcome }: LessonPlanModalProps) {
  const { currentUser, updateTeacherProfile } = useAuth();
  const { playSound } = useApp();

  const teacher = currentUser && currentUser.role === 'teacher' ? (currentUser as any) : null;
  const admin = currentUser && currentUser.role === 'admin' ? (currentUser as any) : null;

  // Determine grade level dynamically (5, 6, etc.)
  const gradeLevel = outcome.gradeId === 'grade-6' || outcome.code.startsWith('MAT.6') ? 6 : 5;
  const gradeLabel = `${gradeLevel}. SINIF`;
  const gradeKademe = `${gradeLevel}. Sınıf`;

  // Retrieve annual plan metadata for this outcome code
  const annualPlan: AnnualPlanItem | undefined = getAnnualPlanByOutcomeCode(outcome.code, gradeLevel);

  // Form states for customization
  const [schoolName, setSchoolName] = useState('ATATÜRK ORTAOKULU');
  const [schoolFontSize, setSchoolFontSize] = useState(13); // Default compact point size
  const [teacherName, setTeacherName] = useState('Ahmet YILMAZ');
  const [teacherBranch, setTeacherBranch] = useState('Matematik');
  const [principalName, setPrincipalName] = useState('Mehmet GÜNGÖR');
  const [selectedClassSection, setSelectedClassSection] = useState(`${gradeKademe} (${gradeLevel}-A)`);
  const [lessonDateInfo, setLessonDateInfo] = useState('');
  const [pageLayoutMode, setPageLayoutMode] = useState<'single' | 'multi'>('single');

  const [isGenerating, setIsGenerating] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const singlePageRef = useRef<HTMLDivElement>(null);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  // Initialize values from teacher profile & outcome
  useEffect(() => {
    if (teacher) {
      if (teacher.school) setSchoolName(teacher.school.toUpperCase());
      if (teacher.name) setTeacherName(teacher.name);
      if (teacher.branch) setTeacherBranch(teacher.branch);
      if (teacher.principalName) setPrincipalName(teacher.principalName);
      if (teacher.assignedClasses && teacher.assignedClasses.length > 0) {
        setSelectedClassSection(`${gradeKademe} (${teacher.assignedClasses.join(', ')})`);
      } else {
        setSelectedClassSection(`${gradeKademe} (${gradeLevel}-A)`);
      }
    } else if (admin) {
      if (admin.school) setSchoolName(admin.school.toUpperCase());
      if (admin.name) setTeacherName(admin.name);
      if (admin.branch) setTeacherBranch(admin.branch || 'Matematik');
      if (admin.principalName) setPrincipalName(admin.principalName);
      setSelectedClassSection(`${gradeKademe} (${gradeLevel}-A)`);
    } else {
      setSelectedClassSection(`${gradeKademe} (${gradeLevel}-A)`);
    }

    if (annualPlan) {
      setLessonDateInfo(annualPlan.hafta);
    } else {
      setLessonDateInfo(getAcademicWeekLabel(1));
    }
  }, [teacher, admin, annualPlan, isOpen, outcome.code, gradeLevel]);

  if (!isOpen) return null;

  // Download PDF Handler: Zero character-cut guarantee
  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      // Save changes to teacher profile if checked
      if (saveToProfile && teacher && teacher.id) {
        updateTeacherProfile(teacher.id, {
          school: schoolName,
          principalName: principalName,
          branch: teacherBranch
        });
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Standard A4 dimensions and safe printable margins
      const marginX = 10; // 10mm left & right margin
      const marginTop = 12; // 12mm top margin
      const marginBottom = 12; // 12mm bottom margin
      const printableWidth = 210 - (2 * marginX); // 190mm
      const printableHeight = 297 - marginTop - marginBottom; // 273mm

      if (pageLayoutMode === 'single') {
        if (!singlePageRef.current) return;

        const canvas = await html2canvas(singlePageRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const totalImgHeightMm = (canvas.height * printableWidth) / canvas.width;
        
        // Auto-fit scale if height slightly exceeds printable area (guarantees single A4 page with 0 cuts)
        const scale = totalImgHeightMm > printableHeight ? (printableHeight / totalImgHeightMm) : 1;
        const finalWidth = printableWidth * scale;
        const finalHeight = totalImgHeightMm * scale;
        const offsetX = marginX + (printableWidth - finalWidth) / 2;

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(imgData, 'JPEG', offsetX, marginTop, finalWidth, finalHeight, '', 'FAST');

        const safeOutcome = outcome.code.replace(/[^a-zA-Z0-9]/g, '_');
        pdf.save(`MEB_Maarif_Gunluk_Plan_${safeOutcome}.pdf`);
      } else {
        // 2-Page Mode: Discrete page capturing (Never slices text)
        if (!page1Ref.current || !page2Ref.current) return;

        // Page 1
        const canvas1 = await html2canvas(page1Ref.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        const imgHeight1 = (canvas1.height * printableWidth) / canvas1.width;
        const scale1 = imgHeight1 > printableHeight ? (printableHeight / imgHeight1) : 1;
        const finalWidth1 = printableWidth * scale1;
        const finalHeight1 = imgHeight1 * scale1;
        const offsetX1 = marginX + (printableWidth - finalWidth1) / 2;
        pdf.addImage(canvas1.toDataURL('image/jpeg', 0.98), 'JPEG', offsetX1, marginTop, finalWidth1, finalHeight1, '', 'FAST');

        // Page 2
        pdf.addPage();
        const canvas2 = await html2canvas(page2Ref.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        const imgHeight2 = (canvas2.height * printableWidth) / canvas2.width;
        const scale2 = imgHeight2 > printableHeight ? (printableHeight / imgHeight2) : 1;
        const finalWidth2 = printableWidth * scale2;
        const finalHeight2 = imgHeight2 * scale2;
        const offsetX2 = marginX + (printableWidth - finalWidth2) / 2;
        pdf.addImage(canvas2.toDataURL('image/jpeg', 0.98), 'JPEG', offsetX2, marginTop, finalWidth2, finalHeight2, '', 'FAST');

        const safeOutcome = outcome.code.replace(/[^a-zA-Z0-9]/g, '_');
        pdf.save(`MEB_Maarif_Gunluk_Plan_${safeOutcome}_2Sayfa.pdf`);
      }

      playSound('success');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-teal-500 text-slate-950 font-black text-xs">
                  {outcome.code}
                </span>
                <span className="text-xs font-semibold text-teal-200">
                  MEB Türkiye Yüzyılı Maarif Modeli
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Resmi Günlük Ders Planı İndir (PDF)
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split into Left Form Controls & Right Live Plan Preview */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Input Verification Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Resmi Belge Bilgileri Doğrulama</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Aşağıdaki bilgileri kontrol edip gerekirse düzenleyebilirsiniz. İndirilen resmi PDF belgesinin başlık ve imza kısımlarında bu veriler yer alacaktır.
              </p>

              {/* Okul Adı & Punto Ayarlama */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <School className="w-3.5 h-3.5 text-teal-600" />
                    <span>OKUL ADI:</span>
                  </label>
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-semibold text-slate-400 mr-0.5">Punto:</span>
                    {/* Punto Büyüt (Büyük A) */}
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setSchoolFontSize((prev) => Math.min(24, prev + 1));
                      }}
                      className="px-1.5 py-0.5 rounded hover:bg-teal-50 text-slate-900 hover:text-teal-700 font-black text-sm flex items-center justify-center transition-colors cursor-pointer"
                      title="Başlık Puntosunu Büyüt (A+)"
                    >
                      A
                    </button>
                    {/* Punto Küçült (Küçük A) */}
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setSchoolFontSize((prev) => Math.max(9, prev - 1));
                      }}
                      className="px-1.5 py-0.5 rounded hover:bg-teal-50 text-slate-600 hover:text-teal-700 font-bold text-[11px] flex items-center justify-center transition-colors cursor-pointer"
                      title="Başlık Puntosunu Küçült (A-)"
                    >
                      A
                    </button>
                    <span className="text-[10px] font-mono text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded ml-0.5">
                      {schoolFontSize}pt
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Örn: ATATÜRK ORTAOKULU"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 uppercase bg-white outline-none focus:border-teal-500"
                />
              </div>

              {/* Öğretmen Adı ve Branşı */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>Öğretmen Adı:</span>
                  </label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="Örn: Ahmet YILMAZ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                    <span>Branş:</span>
                  </label>
                  <input
                    type="text"
                    value={teacherBranch}
                    onChange={(e) => setTeacherBranch(e.target.value)}
                    placeholder="Örn: Matematik"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Okul Müdürü Adı ve Soyadı */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>Okul Müdürü Adı ve Soyadı:</span>
                </label>
                <input
                  type="text"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  placeholder="Örn: Mehmet GÜNGÖR"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white outline-none focus:border-teal-500"
                />
              </div>

              {/* Hafta / Tarih Bilgisi */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>Hafta ve Tarih Bilgisi:</span>
                </label>
                <input
                  type="text"
                  value={lessonDateInfo}
                  onChange={(e) => setLessonDateInfo(e.target.value)}
                  placeholder="Örn: 1. HAFTA (14-20 EYLÜL)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white outline-none focus:border-teal-500"
                />
              </div>

              {/* Sayfa Düzeni Seçimi */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Sayfa Düzeni:</span>
                  </span>
                  <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    {pageLayoutMode === 'single' ? '1 Sayfa (A4 Tam Sığdır)' : '2 Sayfa (Geniş Format)'}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setPageLayoutMode('single');
                    }}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                      pageLayoutMode === 'single'
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>📄 Tek Sayfa (Önerilen)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setPageLayoutMode('multi');
                    }}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                      pageLayoutMode === 'multi'
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>📑 2 Sayfalı Format</span>
                  </button>
                </div>
                <p className="text-[10.5px] text-slate-500">
                  {pageLayoutMode === 'single'
                    ? '💡 Tek Sayfa modu, resmi ders planını tek bir A4 sayfasına orantılı sığdırır, sayfa bölünmesi ve yazı kesilmesi yaşanmaz.'
                    : '💡 2 Sayfalı mod, aşamaları mantıksal olarak 2 ayrı sayfaya böler ve yazıların bölünmeden basılmasını sağlar.'}
                </p>
              </div>

              {/* Save checkbox */}
              {teacher && (
                <label className="flex items-center gap-2 pt-1 text-[11px] text-slate-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveToProfile}
                    onChange={(e) => setSaveToProfile(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Bu okul ve müdür bilgilerini profilime kalıcı kaydet</span>
                </label>
              )}
            </div>

            {/* Notification alert */}
            {downloadSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Ders planı PDF formatında başarıyla indirildi!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGenerating}
                className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-lg shadow-teal-600/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>PDF Hazırlanıyor...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>ONAYLA VE PDF DERS PLANINI İNDİR ({pageLayoutMode === 'single' ? 'Tek Sayfa' : '2 Sayfa'})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Printable Official Lesson Plan Sheet Preview (7 cols) */}
          <div className="lg:col-span-7 bg-slate-200 p-3 sm:p-4 rounded-2xl overflow-x-auto flex flex-col items-center">
            <div className="text-[10px] font-bold text-slate-600 mb-2 w-full max-w-[740px] flex items-center justify-between">
              <span>📄 MEB Standartlarında Resmi Belge Önizlemesi (A4)</span>
              <span>{pageLayoutMode === 'single' ? '1/1 Sayfa (Tam Sığdırma)' : '1/2 ve 2/2 Sayfalar'}</span>
            </div>

            {/* SINGLE PAGE MODE CONTAINER */}
            {pageLayoutMode === 'single' ? (
              <div
                ref={singlePageRef}
                className="bg-white text-black p-5 sm:p-6 rounded-lg shadow-md w-full max-w-[740px] space-y-2.5 font-serif text-[10px] leading-snug border border-slate-300"
                style={{ color: '#111827' }}
              >
                {/* TOP HEADER */}
                <div className="text-center space-y-1 border-b-2 border-black pb-2">
                  <h1
                    className="font-black uppercase tracking-wider text-black transition-all"
                    style={{
                      fontSize: `${schoolFontSize}pt`,
                      lineHeight: '1.2'
                    }}
                  >
                    {schoolName || 'ATATÜRK ORTAOKULU'}
                  </h1>
                  <h2
                    className="font-bold uppercase tracking-wide text-black transition-all"
                    style={{
                      fontSize: `${schoolFontSize}pt`,
                      lineHeight: '1.2'
                    }}
                  >
                    {gradeLabel} {teacherBranch ? teacherBranch.toUpperCase() : 'MATEMATİK'} DERSİ GÜNLÜK PLANI
                  </h2>
                  <div className="text-[9.5px] font-bold text-slate-800 bg-slate-100 inline-block px-2.5 py-0.5 rounded border border-slate-300">
                    {lessonDateInfo || (annualPlan?.hafta ?? getAcademicWeekLabel(1))}
                  </div>
                </div>

                {/* TABLE 1: GENERAL INFORMATION */}
                <div className="border border-black overflow-hidden">
                  <table className="w-full text-left text-[9px] border-collapse">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black w-32">Ders / Kademe</td>
                        <td className="p-1 px-1.5 border-r border-black">{teacherBranch || 'Matematik'} / {gradeKademe}</td>
                        <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black w-20">Süre</td>
                        <td className="p-1 px-1.5">{annualPlan?.saat || '5 SAAT'} (40 dk x 5)</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black">Öğrenme Alanı / Ünite</td>
                        <td colSpan={3} className="p-1 px-1.5 font-bold uppercase">{annualPlan?.unite || (gradeLevel === 6 ? 'SAYILAR VE NİCELİKLER' : 'GEOMETRİK ŞEKİLLER')}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black">Konu</td>
                        <td colSpan={3} className="p-1 px-1.5">{annualPlan?.konu || outcome.shortTitle}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black">Öğrenme Çıktısı (Kazanım)</td>
                        <td colSpan={3} className="p-1 px-1.5 font-bold">
                          {annualPlan?.ogrenme_ciktisi || `${outcome.code} - ${outcome.title}`}
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black">Süreç Bileşenleri</td>
                        <td colSpan={3} className="p-1 px-1.5 text-[8.5px]">
                          {annualPlan?.surec_bilesenleri || outcome.pedagogyGuide.processComponents.join(' • ')}
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black">Sosyal-Duygusal Beceriler</td>
                        <td colSpan={3} className="p-1 px-1.5 text-[8.5px]">
                          {annualPlan?.sosyal_ve_duygusal_beceriler || outcome.pedagogyGuide.maarifSDBs.join(' • ')}
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black">Değerler & Okuryazarlık</td>
                        <td colSpan={3} className="p-1 px-1.5 text-[8.5px]">
                          <strong>Değerler:</strong> {annualPlan?.degerler || 'D7. Estetik, D19. Vatanseverlik'} &nbsp;|&nbsp; 
                          <strong>Okuryazarlık:</strong> {annualPlan?.okuryazarlik_becerileri || 'OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black">Öğrenme Kanıtları (Ölçme)</td>
                        <td colSpan={3} className="p-1 px-1.5 text-[8.5px]">
                          {annualPlan?.ogrenme_kanitlari || 'Gözlem formu, Çalışma kâğıdı, Kontrol listesi, İzleme testi, Öğrenme günlüğü'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 4 PHASES COMPACT */}
                <div className="space-y-1.5 pt-0.5">
                  <h3 className="font-bold text-[10.5px] uppercase border-b border-black pb-0.5">
                    ÖĞRENME-ÖĞRETME YAŞANTILARI VE 4 AŞAMALI DERS AKIŞI
                  </h3>

                  {/* 1. Aşama */}
                  <div className="border-l-2 border-black pl-2 py-0.5 space-y-0.5">
                    <div className="font-bold text-[9.5px]">
                      1. Aşama: Hikâye ve Kavramsal Keşif (Giriş & Merak Uyandırma)
                    </div>
                    <p className="text-[9px] text-justify">
                      <strong>Etkinlik & Senaryo:</strong> {outcome.phases.story.title} ({outcome.phases.story.character.name}). {outcome.phases.story.scenario}
                    </p>
                    <p className="text-[8.5px] text-slate-800">
                      <strong>Günlük Hayat İlişkisi:</strong> {outcome.phases.story.realLifeConnection}
                    </p>
                  </div>

                  {/* 2. Aşama */}
                  <div className="border-l-2 border-black pl-2 py-0.5 space-y-0.5">
                    <div className="font-bold text-[9.5px]">
                      2. Aşama: İnteraktif Laboratuvar ve Çizim Atölyesi (Deneyimleme & Modelleme)
                    </div>
                    <p className="text-[9px] text-justify">
                      <strong>Etkinlik & Araç:</strong> {outcome.phases.lab.title}. {outcome.phases.lab.instructions}
                    </p>
                    <p className="text-[8.5px] text-slate-800">
                      <strong>Uygulama Hedefi:</strong> {outcome.phases.lab.taskGoal}
                    </p>
                  </div>

                  {/* 3. Aşama */}
                  <div className="border-l-2 border-black pl-2 py-0.5 space-y-0.5">
                    <div className="font-bold text-[9.5px]">
                      3. Aşama: Kavram Bulmacası & Oyunlaştırma (Derinleştirme & Pekiştirme)
                    </div>
                    <p className="text-[9px] text-justify">
                      <strong>Etkinlik:</strong> {outcome.phases.puzzle.title}. {outcome.phases.puzzle.instructions}
                    </p>
                    <p className="text-[8.5px] text-slate-800">
                      <strong>Pekiştirilen Kavramlar:</strong> {outcome.phases.puzzle.items.map(i => `${i.concept} (${i.symbol})`).join(', ')}
                    </p>
                  </div>

                  {/* 4. Aşama */}
                  <div className="border-l-2 border-black pl-2 py-0.5 space-y-0.5">
                    <div className="font-bold text-[9.5px]">
                      4. Aşama: Değerlendirme & Yansıtma (Ölçme & Sonuçlandırma)
                    </div>
                    <p className="text-[9px] text-justify">
                      <strong>Ölçme Yöntemi:</strong> {outcome.phases.assessment.title}. {outcome.phases.assessment.questions.length} adet çoktan seçmeli soru ve öğrenme günlüğü çalışması uygulanır.
                    </p>
                    <p className="text-[8.5px] text-slate-800">
                      <strong>Pedagojik Vurgu:</strong> {outcome.pedagogyGuide.teacherTips[0] || 'Kendi çizimlerini kontrol etme ve hatalarını düzeltme'}
                    </p>
                  </div>
                </div>

                {/* SIGNATURE SECTION */}
                <div className="pt-3 mt-2 border-t border-slate-300 grid grid-cols-2 text-center text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-[10px]">{teacherName || 'Ahmet YILMAZ'}</div>
                    <div className="text-[9px] text-slate-700">{teacherBranch || 'Matematik'} Öğretmeni</div>
                    <div className="text-[8.5px] text-slate-400 italic pt-3">İmza</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-[10px]">{principalName || 'Mehmet GÜNGÖR'}</div>
                    <div className="text-[9px] font-bold text-slate-900 uppercase">OKUL MÜDÜRÜ</div>
                    <div className="text-[8.5px] text-slate-400 italic pt-3">Mühür / İmza</div>
                  </div>
                </div>
              </div>
            ) : (
              /* 2-PAGE MODE CONTAINERS */
              <div className="space-y-6 w-full max-w-[740px]">
                {/* PAGE 1 */}
                <div
                  ref={page1Ref}
                  className="bg-white text-black p-6 rounded-lg shadow-md space-y-4 font-serif text-[10.5px] leading-relaxed border border-slate-300"
                  style={{ minHeight: '620px', color: '#111827' }}
                >
                  <div className="text-center space-y-1 border-b-2 border-black pb-2.5">
                    <h1
                      className="font-black uppercase tracking-wider text-black transition-all"
                      style={{
                        fontSize: `${schoolFontSize}pt`,
                        lineHeight: '1.25'
                      }}
                    >
                      {schoolName || 'ATATÜRK ORTAOKULU'}
                    </h1>
                    <h2
                      className="font-bold uppercase tracking-wide text-black transition-all"
                      style={{
                        fontSize: `${schoolFontSize}pt`,
                        lineHeight: '1.25'
                      }}
                    >
                      {gradeLabel} {teacherBranch ? teacherBranch.toUpperCase() : 'MATEMATİK'} DERSİ GÜNLÜK PLANI
                    </h2>
                    <div className="text-[10px] font-bold text-slate-800 bg-slate-100 inline-block px-2.5 py-0.5 rounded border border-slate-300">
                      {lessonDateInfo || (annualPlan?.hafta ?? getAcademicWeekLabel(1))}
                    </div>
                  </div>

                  {/* Table 1 */}
                  <div className="border border-black overflow-hidden">
                    <table className="w-full text-left text-[9.5px] border-collapse">
                      <tbody>
                        <tr className="border-b border-black">
                          <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black w-32">Ders / Kademe</td>
                          <td className="p-1 px-1.5 border-r border-black">{teacherBranch || 'Matematik'} / {gradeKademe}</td>
                          <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black w-20">Süre</td>
                          <td className="p-1 px-1.5">{annualPlan?.saat || '5 SAAT'} (40 dk x 5)</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black">Öğrenme Alanı / Ünite</td>
                          <td colSpan={3} className="p-1 px-1.5 font-bold uppercase">{annualPlan?.unite || (gradeLevel === 6 ? 'SAYILAR VE NİCELİKLER' : 'GEOMETRİK ŞEKİLLER')}</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black">Konu</td>
                          <td colSpan={3} className="p-1 px-1.5">{annualPlan?.konu || outcome.shortTitle}</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black">Öğrenme Çıktısı (Kazanım)</td>
                          <td colSpan={3} className="p-1 px-1.5 font-bold">
                            {annualPlan?.ogrenme_ciktisi || `${outcome.code} - ${outcome.title}`}
                          </td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black">Süreç Bileşenleri</td>
                          <td colSpan={3} className="p-1 px-1.5 text-[9px]">
                            {annualPlan?.surec_bilesenleri || outcome.pedagogyGuide.processComponents.join(' • ')}
                          </td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black">Sosyal-Duygusal Beceriler</td>
                          <td colSpan={3} className="p-1 px-1.5 text-[9px]">
                            {annualPlan?.sosyal_ve_duygusal_beceriler || outcome.pedagogyGuide.maarifSDBs.join(' • ')}
                          </td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black">Değerler & Okuryazarlık</td>
                          <td colSpan={3} className="p-1 px-1.5 text-[9px]">
                            <strong>Değerler:</strong> {annualPlan?.degerler || 'D7. Estetik, D19. Vatanseverlik'} &nbsp;|&nbsp; 
                            <strong>Okuryazarlık:</strong> {annualPlan?.okuryazarlik_becerileri || 'OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık'}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-1 px-1.5 font-bold bg-slate-100 border-r border-black">Öğrenme Kanıtları (Ölçme)</td>
                          <td colSpan={3} className="p-1 px-1.5 text-[9px]">
                            {annualPlan?.ogrenme_kanitlari || 'Gözlem formu, Çalışma kâğıdı, Kontrol listesi, İzleme testi, Öğrenme günlüğü'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Phases 1 & 2 */}
                  <div className="space-y-2.5 pt-1">
                    <h3 className="font-bold text-[11px] uppercase border-b border-black pb-0.5">
                      ÖĞRENME-ÖĞRETME YAŞANTILARI (GİRİŞ & DENEYİMLEME)
                    </h3>

                    {/* 1. Aşama */}
                    <div className="border-l-2 border-black pl-2.5 py-1 space-y-1">
                      <div className="font-bold text-[10.5px]">
                        1. Aşama: Hikâye ve Kavramsal Keşif (Giriş & Merak Uyandırma)
                      </div>
                      <p className="text-[10px] text-justify">
                        <strong>Etkinlik & Senaryo:</strong> {outcome.phases.story.title} ({outcome.phases.story.character.name}). {outcome.phases.story.scenario}
                      </p>
                      <p className="text-[9.5px] text-slate-800">
                        <strong>Günlük Hayat İlişkisi:</strong> {outcome.phases.story.realLifeConnection}
                      </p>
                    </div>

                    {/* 2. Aşama */}
                    <div className="border-l-2 border-black pl-2.5 py-1 space-y-1">
                      <div className="font-bold text-[10.5px]">
                        2. Aşama: İnteraktif Laboratuvar ve Çizim Atölyesi (Deneyimleme & Modelleme)
                      </div>
                      <p className="text-[10px] text-justify">
                        <strong>Etkinlik & Araç:</strong> {outcome.phases.lab.title}. {outcome.phases.lab.instructions}
                      </p>
                      <p className="text-[9.5px] text-slate-800">
                        <strong>Uygulama Hedefi:</strong> {outcome.phases.lab.taskGoal}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[9px] text-slate-400 italic pt-2">
                    Sayfa 1 / 2
                  </div>
                </div>

                {/* PAGE 2 */}
                <div
                  ref={page2Ref}
                  className="bg-white text-black p-6 rounded-lg shadow-md space-y-4 font-serif text-[10.5px] leading-relaxed border border-slate-300"
                  style={{ minHeight: '620px', color: '#111827' }}
                >
                  {/* Phases 3 & 4 */}
                  <div className="space-y-3 pt-1">
                    <h3 className="font-bold text-[11px] uppercase border-b border-black pb-0.5">
                      DERİNLEŞTİRME ve DEĞERLENDİRME
                    </h3>

                    {/* 3. Aşama */}
                    <div className="border-l-2 border-black pl-2.5 py-1 space-y-1">
                      <div className="font-bold text-[10.5px]">
                        3. Aşama: Kavram Bulmacası & Oyunlaştırma (Derinleştirme & Pekiştirme)
                      </div>
                      <p className="text-[10px] text-justify">
                        <strong>Etkinlik:</strong> {outcome.phases.puzzle.title}. {outcome.phases.puzzle.instructions}
                      </p>
                      <p className="text-[9.5px] text-slate-800">
                        <strong>Pekiştirilen Kavramlar:</strong> {outcome.phases.puzzle.items.map(i => `${i.concept} (${i.symbol})`).join(', ')}
                      </p>
                    </div>

                    {/* 4. Aşama */}
                    <div className="border-l-2 border-black pl-2.5 py-1 space-y-1">
                      <div className="font-bold text-[10.5px]">
                        4. Aşama: Değerlendirme & Yansıtma (Ölçme & Sonuçlandırma)
                      </div>
                      <p className="text-[10px] text-justify">
                        <strong>Ölçme Yöntemi:</strong> {outcome.phases.assessment.title}. {outcome.phases.assessment.questions.length} adet çoktan seçmeli gerçek yaşam senaryolu soru ve öğrenme günlüğü yansıtma çalışması uygulanır.
                      </p>
                      <p className="text-[9.5px] text-slate-800">
                        <strong>Pedagojik Vurgu:</strong> {outcome.pedagogyGuide.teacherTips[0] || 'Kendi çizimlerini kontrol etme ve hatalarını düzeltme'}
                      </p>
                    </div>

                    {/* Ek Pedagojik Farklılaştırma Notu */}
                    <div className="border-l-2 border-black pl-2.5 py-1 space-y-1 bg-slate-50 p-2 rounded">
                      <div className="font-bold text-[10px] text-black">
                        Farklılaştırma (Zenginleştirme & Destekleme Notu):
                      </div>
                      <p className="text-[9.5px] text-slate-800">
                        <strong>Destekleme:</strong> Çizim laboratuvarında kılavuz ızgaralar ve sembol kartları ile bireysel rehberlik sağlanır.
                        <br />
                        <strong>Zenginleştirme:</strong> Kavramların mimari yapılardaki (fener kuleleri, köprü kirişleri) simetri ve doğrultu ilişkilerini modelleme görevi verilir.
                      </p>
                    </div>
                  </div>

                  {/* SIGNATURE SECTION */}
                  <div className="pt-8 mt-6 border-t border-slate-300 grid grid-cols-2 text-center text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-[11px]">{teacherName || 'Ahmet YILMAZ'}</div>
                      <div className="text-[10px] text-slate-700">{teacherBranch || 'Matematik'} Öğretmeni</div>
                      <div className="text-[9px] text-slate-400 italic pt-6">İmza</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-[11px]">{principalName || 'Mehmet GÜNGÖR'}</div>
                      <div className="text-[10px] font-bold text-slate-900 uppercase">OKUL MÜDÜRÜ</div>
                      <div className="text-[9px] text-slate-400 italic pt-6">Mühür / İmza</div>
                    </div>
                  </div>

                  <div className="text-right text-[9px] text-slate-400 italic pt-2">
                    Sayfa 2 / 2
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
