'use client';

import React, { useState, useRef } from 'react';
import { useAuth, generateRandomStudentPassword } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import { StudentUser, TeacherUser } from '@/types/auth';
import {
  parseEOkulExcel,
  ParsedEOkulStudent,
  toTurkishTitleCase
} from '@/lib/eokul-excel-parser';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Users,
  Check,
  Plus,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface ExcelStudentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClass?: string;
  onImportSuccess?: (targetClass: string, count: number) => void;
}

export function ExcelStudentImportModal({
  isOpen,
  onClose,
  defaultClass,
  onImportSuccess
}: ExcelStudentImportModalProps) {
  const { currentUser, addStudentsBulk, addClassToTeacher, getClassCodeForClass } = useAuth();
  const { playSound } = useApp();
  const teacher = currentUser as TeacherUser | null;

  const teacherClasses = teacher?.assignedClasses || [];
  const [selectedClass, setSelectedClass] = useState<string>(
    defaultClass || teacherClasses[0] || ''
  );
  const [isCreatingNewClass, setIsCreatingNewClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [parsedStudents, setParsedStudents] = useState<ParsedEOkulStudent[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [titleCaseEnabled, setTitleCaseEnabled] = useState(true);
  const [rawStudents, setRawStudents] = useState<ParsedEOkulStudent[]>([]);
  const [stats, setStats] = useState<{ total: number; girls: number; boys: number }>({
    total: 0,
    girls: 0,
    boys: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{
    count: number;
    className: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setParsingError(null);
    setSuccessResult(null);

    // Validate file extension
    const fileName = file.name.toLowerCase();
    const isExcel =
      fileName.endsWith('.xlsx') ||
      fileName.endsWith('.xls') ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';

    if (!isExcel) {
      setParsingError(
        'Yalnızca Excel dosyaları (.xlsx veya .xls) kabul edilmektedir. Lütfen e-Okul üzerinden indirdiğiniz Excel dosyasını seçin.'
      );
      setSelectedFile(null);
      playSound('clear');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result as ArrayBuffer;
        if (!buffer) {
          setParsingError('Dosya içeriği okunamadı.');
          return;
        }

        const res = parseEOkulExcel(buffer);
        if (!res.success) {
          setParsingError(res.error || 'e-Okul Excel dosyası ayrıştırılamadı.');
          playSound('clear');
          return;
        }

        setRawStudents(res.students);
        setStats({
          total: res.totalDetected,
          girls: res.girlsCount,
          boys: res.boysCount
        });

        // Apply title case initially
        const processed = res.students.map((stu) => ({
          ...stu,
          firstName: titleCaseEnabled ? toTurkishTitleCase(stu.firstName) : stu.firstName,
          lastName: titleCaseEnabled ? toTurkishTitleCase(stu.lastName) : stu.lastName,
          fullName: titleCaseEnabled
            ? `${toTurkishTitleCase(stu.firstName)} ${toTurkishTitleCase(stu.lastName)}`.trim()
            : stu.fullName
        }));

        setParsedStudents(processed);
        // Select all by default
        setSelectedIndices(new Set(processed.map((_, i) => i)));
        playSound('select');
      } catch (err: any) {
        setParsingError(`Excel dosyası işlenirken hata meydana geldi: ${err?.message || ''}`);
      }
    };

    reader.onerror = () => {
      setParsingError('Dosya okunamadı. Lütfen tekrar deneyin.');
    };

    reader.readAsArrayBuffer(file);
  };

  const toggleTitleCase = (enabled: boolean) => {
    setTitleCaseEnabled(enabled);
    if (rawStudents.length === 0) return;

    setParsedStudents((prev) =>
      prev.map((stu, i) => {
        const raw = rawStudents[i] || stu;
        if (enabled) {
          const fn = toTurkishTitleCase(raw.firstName);
          const ln = toTurkishTitleCase(raw.lastName);
          return {
            ...stu,
            firstName: fn,
            lastName: ln,
            fullName: `${fn} ${ln}`.trim()
          };
        } else {
          return {
            ...stu,
            firstName: raw.firstName,
            lastName: raw.lastName,
            fullName: raw.fullName
          };
        }
      })
    );
  };

  const handleToggleSelect = (index: number) => {
    const next = new Set(selectedIndices);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelectedIndices(next);
  };

  const handleToggleAll = () => {
    if (selectedIndices.size === parsedStudents.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(parsedStudents.map((_, i) => i)));
    }
  };

  const handleCreateNewClass = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newClassName.trim().toUpperCase();
    if (!clean) return;
    if (teacher && addClassToTeacher) {
      addClassToTeacher(teacher.id, clean);
    }
    setSelectedClass(clean);
    setIsCreatingNewClass(false);
    setNewClassName('');
    playSound('success');
  };

  const handleImportStudents = () => {
    const targetClass = selectedClass.trim().toUpperCase();
    if (!targetClass) {
      setParsingError('Lütfen öğrencilerin aktarılacağı sınıfı/şubeyi seçin.');
      return;
    }

    const studentsToImport = parsedStudents.filter((_, i) => selectedIndices.has(i));
    if (studentsToImport.length === 0) {
      setParsingError('Lütfen aktarılacak en az bir öğrenci seçin.');
      return;
    }

    setIsSubmitting(true);

    try {
      const gradeLevel = parseInt(targetClass.charAt(0)) || 5;
      const schoolName = teacher?.school || 'Edirne Selimiye İmam Hatip Ortaokulu';
      const cityName = teacher?.city || 'Edirne';
      const districtName = teacher?.district || 'Merkez';
      const teacherId = teacher?.id;
      const todayStr = new Date().toISOString().split('T')[0];
      const classCode = getClassCodeForClass ? getClassCodeForClass(targetClass, teacherId) : undefined;

      const newStudentUsers: StudentUser[] = studentsToImport.map((s, idx) => {
        const avatar = s.gender === 'Kız' ? '👩‍🎓' : s.gender === 'Erkek' ? '👨‍🎓' : '🎓';
        const generatedPassword = generateRandomStudentPassword(6);

        return {
          id: `stu-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
          firstName: s.firstName,
          lastName: s.lastName,
          name: s.fullName,
          role: 'student',
          avatar,
          studentNumber: s.studentNumber,
          classCode,
          password: generatedPassword,
          gender: s.gender || undefined,
          gradeLevel,
          classSection: targetClass,
          city: cityName,
          district: districtName,
          school: schoolName,
          teacherId,
          points: 100,
          subjectPoints: { [teacher?.branch || 'Matematik']: 100 },
          unlockedBadges: ['first-step'],
          createdAt: todayStr
        };
      });

      // Bulk persist
      addStudentsBulk(newStudentUsers);

      // Auto ensure teacher has this class
      if (teacher && !teacherClasses.includes(targetClass) && addClassToTeacher) {
        addClassToTeacher(teacher.id, targetClass);
      }

      playSound('success');
      setSuccessResult({
        count: studentsToImport.length,
        className: targetClass
      });

      if (onImportSuccess) {
        onImportSuccess(targetClass, studentsToImport.length);
      }
    } catch (err: any) {
      setParsingError(`Öğrenciler kaydedilirken bir hata oluştu: ${err?.message || ''}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParsedStudents([]);
    setRawStudents([]);
    setSelectedIndices(new Set());
    setParsingError(null);
    setSuccessResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-wide flex items-center gap-2">
                <span>e-Okul Excel ile Sınıf Yükle</span>
                <span className="text-[10px] uppercase font-extrabold bg-emerald-400/30 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300/40">
                  MEB Formatı
                </span>
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                e-Okul&apos;dan indirilen standart Excel dosyasını yükleyip tüm sınıfı saniyeler içinde kaydedin.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Success State */}
          {successResult ? (
            <div className="py-12 px-6 text-center space-y-5 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Tebrikler! Sınıf Başarıyla Aktarıldı
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                    {successResult.count} öğrenci
                  </span>{' '}
                  başarıyla <span className="font-bold">{successResult.className}</span> şubesine
                  kaydedildi ve sistemde kullanıma hazır.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                >
                  Başka Sınıf Yükle
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Öğrenci Listesine Git</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Class Target Selection */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Öğrencilerin Aktarılacağı Sınıf / Şube</span>
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Yüklenecek öğrencilerin atanacağı sınıfı belirleyin.
                  </p>
                </div>

                {!isCreatingNewClass ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-500 shadow-sm"
                    >
                      {teacherClasses.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls} Şubesi
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewClass(true)}
                      className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Yeni Sınıf Tanımla"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Yeni Şube</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCreateNewClass} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="Örn: 5-C"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="w-24 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500 text-xs font-bold uppercase text-slate-800 dark:text-white outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Ekle</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewClass(false)}
                      className="px-2.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </form>
                )}
              </div>

              {/* Step 2: Upload Dropzone (if not parsed yet) */}
              {!selectedFile && (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 scale-[0.99]'
                      : 'border-slate-300 dark:border-slate-750 hover:border-emerald-400 hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4 shadow-sm">
                    <UploadCloud className="w-8 h-8" />
                  </div>

                  <h4 className="text-base font-black text-slate-800 dark:text-white">
                    e-Okul Excel Dosyasını Buraya Bırakın
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    ya da bilgisayarınızdan seçmek için{' '}
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold underline">
                      buraya tıklayın
                    </span>
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 font-bold">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Yalnızca .xlsx ve .xls formatları desteklenir</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {parsingError && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-black">Dosya İşlenemedi</h5>
                    <p className="text-xs">{parsingError}</p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="mt-2 text-xs font-bold text-rose-700 dark:text-rose-300 underline hover:opacity-80"
                    >
                      Farklı bir dosya seç
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Parsed Data Table & Controls */}
              {selectedFile && parsedStudents.length > 0 && (
                <div className="space-y-4 animate-in fade-in">
                  {/* File Stats Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-emerald-50/40 dark:from-slate-800/80 dark:to-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="truncate max-w-[200px] sm:max-w-xs">{selectedFile.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            ({(selectedFile.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                            {stats.total} Öğrenci Tespit Edildi
                          </span>
                          {stats.girls > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300">
                              {stats.girls} Kız
                            </span>
                          )}
                          {stats.boys > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                              {stats.boys} Erkek
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all"
                    >
                      Başka Dosya Seç
                    </button>
                  </div>

                  {/* Table Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleToggleAll}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>
                          {selectedIndices.size === parsedStudents.length
                            ? 'Tümünün Seçimini Kaldır'
                            : 'Tümünü Seç'}
                        </span>
                      </button>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {selectedIndices.size} / {parsedStudents.length} öğrenci seçili
                      </span>
                    </div>

                    {/* Title Case Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 select-none">
                      <input
                        type="checkbox"
                        checked={titleCaseEnabled}
                        onChange={(e) => toggleTitleCase(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                      />
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>İsimleri Düzgün Baş Harf Yap (Baş harfler büyük)</span>
                      </span>
                    </label>
                  </div>

                  {/* Student Preview Table */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                    <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                      <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-black text-[10px] tracking-wider z-10 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-2.5 px-3 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={
                                selectedIndices.size === parsedStudents.length &&
                                parsedStudents.length > 0
                              }
                              onChange={handleToggleAll}
                              className="w-3.5 h-3.5 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                            />
                          </th>
                          <th className="py-2.5 px-3 w-12 text-center">S.No</th>
                          <th className="py-2.5 px-3 w-28">Öğrenci No</th>
                          <th className="py-2.5 px-3">Adı Soyadı</th>
                          <th className="py-2.5 px-3 w-24">Cinsiyet</th>
                          <th className="py-2.5 px-3 w-24">Hedef Sınıf</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
                        {parsedStudents.map((stu, index) => {
                          const isChecked = selectedIndices.has(index);
                          return (
                            <tr
                              key={`${stu.studentNumber}-${index}`}
                              onClick={() => handleToggleSelect(index)}
                              className={`cursor-pointer transition-colors ${
                                isChecked
                                  ? 'hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20'
                                  : 'opacity-40 hover:opacity-75 bg-slate-50/50 dark:bg-slate-800/30'
                              }`}
                            >
                              <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleSelect(index)}
                                  className="w-3.5 h-3.5 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                                />
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono text-slate-400 text-[11px]">
                                {stu.sNo || index + 1}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-black text-slate-900 dark:text-white">
                                #{stu.studentNumber}
                              </td>
                              <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-100">
                                {stu.fullName}
                              </td>
                              <td className="py-2.5 px-3">
                                {stu.gender ? (
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      stu.gender === 'Kız'
                                        ? 'bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300'
                                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                    }`}
                                  >
                                    {stu.gender}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-bold text-emerald-700 dark:text-emerald-400">
                                {selectedClass}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Informational Tip */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200">
                    <Info className="w-4 h-4 flex-shrink-0 text-amber-600" />
                    <span>
                      Daha önce kaydedilmiş aynı okul numarasına sahip öğrenciler güncellenir, yeni
                      numaralar ise sınıfa otomatik eklenir. Her öğrenciye ilk giriş için başlangıç puanı
                      tanımlanır.
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!successResult && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Vazgeç
            </button>

            {selectedFile && parsedStudents.length > 0 && (
              <button
                type="button"
                disabled={selectedIndices.size === 0 || isSubmitting}
                onClick={handleImportStudents}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>
                      {selectedIndices.size} Öğrenciyi {selectedClass} Sınıfına Aktar
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
