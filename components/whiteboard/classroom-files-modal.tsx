'use client';

import React, { useState, useEffect } from 'react';
import {
  ClassroomFileRecord,
  getStoredClassroomFiles,
  deleteClassroomFile,
  exportClassroomFileToPdf
} from '@/lib/class-files-store';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import { WhiteboardViewerModal } from '@/components/whiteboard/whiteboard-viewer-modal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  FolderOpen,
  FileText,
  Download,
  Trash2,
  Calendar,
  Layers,
  School,
  User,
  Search,
  Filter,
  Eye,
  Plus,
  Loader2,
  CheckCircle2,
  BookOpen,
  MonitorPlay
} from 'lucide-react';

interface ClassroomFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  outcomeCode?: string;
  classSection?: string;
  onLoadFileToWhiteboard?: (file: ClassroomFileRecord) => void;
}

export function ClassroomFilesModal({
  isOpen,
  onClose,
  outcomeCode,
  classSection,
  onLoadFileToWhiteboard
}: ClassroomFilesModalProps) {
  const { currentUser } = useAuth();
  const { playSound } = useApp();

  const [files, setFiles] = useState<ClassroomFileRecord[]>([]);
  const [selectedOutcomeFilter, setSelectedOutcomeFilter] = useState<string>(outcomeCode || 'all');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>(classSection || 'all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<ClassroomFileRecord | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFiles(getStoredClassroomFiles());
      if (outcomeCode) setSelectedOutcomeFilter(outcomeCode);
      if (classSection) setSelectedClassFilter(classSection);
    }
  }, [isOpen, outcomeCode, classSection]);

  if (!isOpen) return null;

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const filteredFiles = files.filter((f) => {
    const isSheet =
      f.fileType === 'activity_sheet' ||
      f.tags?.includes('Etkinlik Kağıdı') ||
      f.id?.startsWith('file-activity-') ||
      f.title.toLowerCase().includes('etkinlik');
    const matchesType =
      selectedTypeFilter === 'all' ||
      (selectedTypeFilter === 'activity_sheet' && isSheet) ||
      (selectedTypeFilter === 'whiteboard_note' && !isSheet);
    const matchesOutcome = selectedOutcomeFilter === 'all' || f.outcomeCode === selectedOutcomeFilter;
    const matchesClass =
      selectedClassFilter === 'all' ||
      f.classSection === selectedClassFilter ||
      f.classSection === 'Tümü';
    const matchesSearch =
      !searchQuery ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesOutcome && matchesClass && matchesSearch;
  });

  const handleDelete = (fileId: string, title: string) => {
    if (window.confirm(`"${title}" isimli ders notunu silmek istediğinize emin misiniz?`)) {
      deleteClassroomFile(fileId);
      setFiles(getStoredClassroomFiles());
      playSound('clear');
    }
  };

  const handleDownloadPDF = async (file: ClassroomFileRecord) => {
    try {
      setDownloadingFileId(file.id);
      playSound('select');
      await exportClassroomFileToPdf(file, currentUser?.school);
      playSound('success');
    } catch (err) {
      console.error('PDF indirme hatası:', err);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setDownloadingFileId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold">
                  Sınıf Arşivi & Dosya Sistemi
                </span>
                <span className="text-xs text-slate-300">
                  {filteredFiles.length} Dosya Bulundu
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                Kayıtlı Beyaz Tahta & Ders Notları
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 shrink-0">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Ders notu veya konu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 outline-none focus:border-teal-500 shadow-2xs font-medium"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 outline-none focus:border-teal-500 shadow-2xs"
          >
            <option value="all">Tüm Türler</option>
            <option value="whiteboard_note">📐 Beyaz Tahta Notları</option>
            <option value="activity_sheet">📝 Etkinlik Kağıtları</option>
          </select>

          {/* Outcome Filter */}
          <select
            value={selectedOutcomeFilter}
            onChange={(e) => setSelectedOutcomeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 outline-none focus:border-teal-500 shadow-2xs"
          >
            <option value="all">Tüm Kazanımlar</option>
            <option value="MAT.5.3.4">MAT.5.3.4 (Doğruların Durumları & Açılar)</option>
            <option value="MAT.5.3.3">MAT.5.3.3 (Açılar & İletki Ölçümü)</option>
            <option value="MAT.5.3.2">MAT.5.3.2 (Geometrik İnşa: Cetvel, Pergel)</option>
            <option value="MAT.5.3.1">MAT.5.3.1 (Temel Çizimler & Semboller)</option>
          </select>

          {/* Class Filter */}
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 outline-none focus:border-teal-500 shadow-2xs"
          >
            <option value="all">Tüm Şubeler</option>
            <option value="5-A">5-A Şubesi</option>
            <option value="5-B">5-B Şubesi</option>
            <option value="5-C">5-C Şubesi</option>
          </select>

        </div>

        {/* Files Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-100/60">
          {filteredFiles.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3 bg-white rounded-3xl border border-slate-200 p-8">
              <FolderOpen className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="font-black text-base text-slate-700">Henüz Kayıtlı Dosya Bulunamadı</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Arama kriterlerine uygun ders notu veya etkinlik kağıdı bulunamadı.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFiles.map((file) => {
                const isSheet =
                  file.fileType === 'activity_sheet' ||
                  file.tags?.includes('Etkinlik Kağıdı') ||
                  file.id?.startsWith('file-activity-') ||
                  file.title.toLowerCase().includes('etkinlik');

                return (
                  <div
                    key={file.id}
                    className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-teal-400 transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      
                      {/* Top Badges */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-800 font-mono font-black text-[11px] border border-teal-200">
                            {file.outcomeCode}
                          </span>
                          {/* Distinct Type Badge */}
                          {isSheet ? (
                            <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-black text-[10px] border border-amber-300 flex items-center gap-1">
                              <span>📝</span>
                              <span>Etkinlik Kağıdı</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-lg bg-teal-100 text-teal-900 font-black text-[10px] border border-teal-300 flex items-center gap-1">
                              <span>📐</span>
                              <span>Beyaz Tahta Notu</span>
                            </span>
                          )}
                          <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 font-bold text-[11px] border border-indigo-200">
                            {file.classSection}
                          </span>
                        </div>
                        
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-teal-600" />
                          <span>{file.pageCount} Sayfa A4</span>
                        </span>
                      </div>

                    {/* Title */}
                    <h3 className="font-black text-base text-slate-900 leading-snug">
                      {file.title}
                    </h3>

                    {/* Meta info */}
                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Öğretmen: <strong>{file.authorName}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{new Date(file.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {file.tags && file.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {file.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    {/* Primary Action for Teacher: Tahtaya Yükle & Düzenle */}
                    {isTeacherOrAdmin && onLoadFileToWhiteboard && (
                      <button
                        type="button"
                        onClick={() => {
                          onLoadFileToWhiteboard(file);
                          onClose();
                          playSound('select');
                        }}
                        className="w-full py-2.5 px-3 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-black text-xs shadow-sm shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        title="Bu notu Beyaz Tahtaya yükle ve düzenle"
                      >
                        <Layers className="w-4 h-4 text-teal-200" />
                        <span>Tahtaya Yükle & Düzenle</span>
                      </button>
                    )}

                    {/* Secondary Action Row: Görüntüle, PDF İndir, Sil */}
                    <div className="grid grid-cols-12 gap-2">
                      {/* 1. Görüntüle */}
                      <button
                        type="button"
                        onClick={() => {
                          playSound('select');
                          setViewingFile(file);
                        }}
                        className={`${isTeacherOrAdmin ? 'col-span-5' : 'col-span-6'} py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200 hover:border-teal-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
                        title="Ders notunu salt okunur olarak görüntüle"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>Görüntüle</span>
                      </button>

                      {/* 2. PDF İndir */}
                      <button
                        type="button"
                        onClick={() => handleDownloadPDF(file)}
                        disabled={downloadingFileId === file.id}
                        className={`${isTeacherOrAdmin ? 'col-span-5' : 'col-span-6'} py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50`}
                        title="Bu ders notunu PDF olarak indir"
                      >
                        {downloadingFileId === file.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600 shrink-0" />
                            <span>İndiriliyor</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>PDF İndir</span>
                          </>
                        )}
                      </button>

                      {/* 3. Sil (Teacher/Admin only) */}
                      {isTeacherOrAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDelete(file.id, file.title)}
                          className="col-span-2 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 transition-all cursor-pointer flex items-center justify-center"
                          title="Dosyayı Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>💡 Ders notları öğretmenler tarafından sisteme kaydedilir, öğrenciler diledikleri zaman görüntüleyebilir veya PDF olarak indirebilir.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>

      {/* Read-Only Whiteboard Viewer Modal */}
      <WhiteboardViewerModal
        isOpen={!!viewingFile}
        onClose={() => setViewingFile(null)}
        file={viewingFile}
      />
    </div>
  );
}
