'use client';

import React, { useState, useEffect } from 'react';
import {
  ClassroomFileRecord,
  getStoredClassroomFiles,
  deleteClassroomFile
} from '@/lib/class-files-store';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
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
  BookOpen
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
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);

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

    return matchesOutcome && matchesClass && matchesSearch;
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

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < file.pages.length; i++) {
        const page = file.pages[i];

        // Create virtual DOM page container
        const pageContainer = document.createElement('div');
        pageContainer.style.width = '794px';
        pageContainer.style.minHeight = '1123px';
        pageContainer.style.padding = '40px';
        pageContainer.style.backgroundColor = page.backgroundType === 'dark' ? '#0f172a' : '#ffffff';
        pageContainer.style.color = page.backgroundType === 'dark' ? '#f8fafc' : '#0f172a';
        pageContainer.style.fontFamily = 'Inter, sans-serif';
        pageContainer.style.boxSizing = 'border-box';
        pageContainer.style.position = 'relative';

        // Page Header
        pageContainer.innerHTML = `
          <div style="border-bottom: 2px solid #0d9488; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
              <div style="font-size: 10px; font-weight: 800; color: #0f766e; text-transform: uppercase;">
                ${file.school || 'Edirne Selimiye İmam Hatip Ortaokulu'} • ${file.classSection} Şubesi
              </div>
              <div style="font-size: 14px; font-weight: 900; color: #0f172a; margin-top: 2px;">
                ${file.title}
              </div>
              <div style="font-size: 10px; color: #64748b; font-weight: 600;">
                Kazanım: ${file.outcomeCode} - ${file.outcomeTitle}
              </div>
            </div>
            <div style="text-align: right; font-size: 10px; font-weight: 700; color: #64748b;">
              Sayfa ${page.pageNumber} / ${file.pageCount}
            </div>
          </div>

          <div style="min-height: 850px; font-size: 13px; line-height: 1.6;">
            ${page.textContent || ''}
          </div>

          <div style="border-top: 1px solid #cbd5e1; padding-top: 10px; margin-top: 20px; display: flex; justify-content: space-between; font-size: 9.5px; color: #64748b;">
            <span>Hazırlayan: <strong>${file.authorName}</strong></span>
            <span>Tarih: ${new Date(file.createdAt).toLocaleDateString('tr-TR')}</span>
          </div>
        `;

        // If page has drawing canvas data, append canvas image
        if (page.drawingDataUrl) {
          const img = document.createElement('img');
          img.src = page.drawingDataUrl;
          img.style.position = 'absolute';
          img.style.top = '0';
          img.style.left = '0';
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.pointerEvents = 'none';
          pageContainer.appendChild(img);
        }

        document.body.appendChild(pageContainer);

        const canvas = await html2canvas(pageContainer, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: page.backgroundType === 'dark' ? '#0f172a' : '#ffffff'
        });

        document.body.removeChild(pageContainer);

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage('a4', 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      const cleanTitle = file.title.trim().replace(/\s+/g, '_');
      pdf.save(`${file.classSection}_${file.outcomeCode}_${cleanTitle}.pdf`);
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
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          
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
              <h3 className="font-black text-base text-slate-700">Henüz Kayıtlı Ders Notu Bulunamadı</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Beyaz tahta üzerinde hazırladığınız ders notlarını &quot;Sınıf Dosyalarına Kaydet&quot; butonuna basarak bu arşive ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFiles.map((file) => (
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
                        <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 font-bold text-[11px] border border-indigo-200">
                          {file.classSection} Şubesi
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
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    
                    {onLoadFileToWhiteboard && (
                      <button
                        type="button"
                        onClick={() => {
                          onLoadFileToWhiteboard(file);
                          onClose();
                          playSound('select');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Bu notu Beyaz Tahtaya yükle ve düzenle"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Tahtada Aç</span>
                      </button>
                    )}

                    <div className="flex items-center gap-1.5 ml-auto">
                      {/* PDF Download */}
                      <button
                        type="button"
                        onClick={() => handleDownloadPDF(file)}
                        disabled={downloadingFileId === file.id}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Bu ders notunu PDF olarak indir"
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

                      {/* Delete button (Teacher/Admin only) */}
                      {isTeacherOrAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDelete(file.id, file.title)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Dosyayı Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>💡 Ders notları öğretmenler tarafından sisteme kaydedilir, öğrenciler diledikleri zaman PDF olarak indirebilir.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
