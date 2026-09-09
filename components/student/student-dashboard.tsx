'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import Link from 'next/link';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  ClassroomFileRecord,
  getStoredClassroomFiles,
  exportClassroomFileToPdf
} from '@/lib/class-files-store';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ClassLeaderboard } from '@/components/gamification/class-leaderboard';
import { WhiteboardViewerModal } from '@/components/whiteboard/whiteboard-viewer-modal';
import {
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  Flame,
  Star,
  CheckCircle2,
  Gamepad2,
  Compass,
  School,
  FolderOpen,
  Download,
  Layers,
  Loader2,
  Search,
  Calendar,
  FileText,
  Trophy,
  Eye
} from 'lucide-react';

export function StudentDashboard() {
  const { currentUser } = useAuth();
  const { studentPoints, studentBadges, playSound } = useApp();

  const [files, setFiles] = useState<ClassroomFileRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<ClassroomFileRecord | null>(null);

  useEffect(() => {
    setFiles(getStoredClassroomFiles());
  }, []);

  const student = currentUser && currentUser.role === 'student' ? currentUser : null;
  const studentClass = student?.classSection || '5-A';

  const relevantFiles = files.filter((f) => {
    const matchesClass = f.classSection === studentClass || f.classSection === 'Tümü';
    const matchesSearch =
      !searchQuery ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.outcomeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesClass && matchesSearch;
  });

  const handleDownloadFilePDF = async (file: ClassroomFileRecord) => {
    try {
      setDownloadingFileId(file.id);
      playSound('select');
      await exportClassroomFileToPdf(file, student?.school);
      playSound('success');
    } catch (err) {
      console.error('PDF indirme hatası:', err);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setDownloadingFileId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Student Gamified Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-blue-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <UserAvatar
            avatar={student?.avatar}
            name={student?.name}
            size="xl"
            className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-blue-400 bg-blue-500/20 text-blue-200 shadow-inner"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black">{student?.name || 'Çırak Hasan'}</h1>
              <span className="px-3 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 font-bold text-xs">
                {student?.classSection || '5-A Sınıfı'} • No: #{student?.studentNumber || '104'}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <School className="w-4 h-4 text-blue-400" />
                <span>{student?.school || 'Edirne Selimiye İmam Hatip Ortaokulu'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* XP / Point Pill */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg">
            ⚡
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300">Toplam Puanın:</div>
            <div className="text-xl sm:text-2xl font-black text-white">
              +{studentPoints || 450} XP
            </div>
          </div>
        </div>
      </div>

      {/* Badges & Active Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active Lessons Hub (2 Cols) */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <span>İnteraktif Maarif Derslerim</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">5. Sınıf Matematik</span>
          </div>

          {/* Lesson 1 Card */}
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-teal-400 transition-all shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-black border border-teal-200">
                1. Hafta Kazanımı (MAT.5.3.1)
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tamamlandı</span>
              </span>
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900">
                Doğru, Doğru Parçası ve Işın Çizimleri
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Kaptan Bilge ve Mimar Defne hikayesi, serbest çizim tahtası, kelime avı bulmacası ve 8 soruluk değerlendirme testi.
              </p>
            </div>

            <Link
              href="/lesson/MAT.5.3.1"
              className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Ders Aşamalarına Git</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Lesson 2 Card */}
          <div className="p-6 rounded-3xl bg-white border-2 border-indigo-200 hover:border-indigo-400 transition-all shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-black border border-indigo-200">
                2. Hafta Kazanımı (MAT.5.3.2)
              </span>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Flame className="w-4 h-4" />
                <span>Yeni Ders!</span>
              </span>
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900">
                Geometrik İnşa ve Çıkarım: Cetvel, Pergel, Gönye
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Ölçüsüz Cetvel, Pergel ile Yarıçap & Eşit Parça Kesme, Gönye ile Tek Dikme ve Paralel Raylar.
              </p>
            </div>

            <Link
              href="/lesson/MAT.5.3.2"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Keşif Atölyesini Başlat</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Lesson 3 Card */}
          <div className="p-6 rounded-3xl bg-white border-2 border-amber-200 hover:border-amber-400 transition-all shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-black border border-amber-200">
                3. Hafta Kazanımı (MAT.5.3.3)
              </span>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>Açı Laboratuvarı</span>
              </span>
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900">
                Açı Çeşitleri & İletki ile Ölçüm
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Açı Dedektifi hikayesi, dijital iletki simülasyonu, Açı Radarı oyunu ve rubrik öz değerlendirmesi.
              </p>
            </div>

            <Link
              href="/lesson/MAT.5.3.3"
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Açı Laboratuvarına Gir</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Gamified Badges Showcase (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 h-fit">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Rozet Vitrini</span>
            </h3>
            <span className="text-xs font-bold text-amber-600">
              {studentBadges.filter((b) => b.unlocked).length} / {studentBadges.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {studentBadges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                  badge.unlocked
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    badge.unlocked ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {badge.unlocked ? '🏆' : '🔒'}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-black text-slate-900">{badge.title}</div>
                  <div className="text-[10px] text-slate-500">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sınıf XP Liderlik Panosu & Sıralama */}
      <ClassLeaderboard initialClassSection={studentClass} />

      {/* Classroom Files & Whiteboard Notes for Students */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <FolderOpen className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-black text-slate-900">
                {studentClass} Sınıfımın Ders Notları & Beyaz Tahta Arşivi
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Öğretmeninin derste akıllı tahta üzerinde işlediği tüm çizimleri, formülleri ve özetleri buradan inceleyebilir ve PDF olarak cihazına indirebilirsin.
            </p>
          </div>

          {/* Mini Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Not veya konu ara..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>
        </div>

        {relevantFiles.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 space-y-2">
            <div className="text-2xl">📝</div>
            <div className="font-bold text-slate-700">Henüz paylaşılan ders notu bulunamadı</div>
            <p>Öğretmenin akıllı tahtada ders notu oluşturup kaydettiğinde burada görünecek.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relevantFiles.map((file) => (
              <div
                key={file.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[10px] font-black uppercase">
                      {file.outcomeCode}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>{file.pageCount} Sayfa</span>
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 line-clamp-2">
                    {file.title}
                  </h4>

                  <div className="text-[10px] text-slate-500 line-clamp-1">
                    {file.outcomeTitle}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>{file.authorName}</span>
                    <span>{new Date(file.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                  {/* 1. Görüntüle */}
                  <button
                    type="button"
                    onClick={() => {
                      playSound('select');
                      setViewingFile(file);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Ders notunu salt okunur modda tam ekran görüntüle"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-600" />
                    <span>Görüntüle</span>
                  </button>

                  {/* 2. PDF İndir */}
                  <button
                    type="button"
                    onClick={() => handleDownloadFilePDF(file)}
                    disabled={downloadingFileId === file.id}
                    className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    title="Bu ders notunu PDF olarak cihazına indir"
                  >
                    {downloadingFileId === file.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>İndiriliyor...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF İndir</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Whiteboard Pure Read-Only Viewer Modal */}
      {viewingFile && (
        <WhiteboardViewerModal
          isOpen={!!viewingFile}
          onClose={() => setViewingFile(null)}
          file={viewingFile}
        />
      )}

    </div>
  );
}
