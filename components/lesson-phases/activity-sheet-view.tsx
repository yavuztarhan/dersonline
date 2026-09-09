'use client';

import React, { useState } from 'react';
import { ClassroomFileRecord, getActivitySheetForOutcome, getActivitySheetsForOutcome, exportClassroomFileToPdf } from '@/lib/class-files-store';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import { WhiteboardViewerModal } from '@/components/whiteboard/whiteboard-viewer-modal';
import { WhiteboardModal } from '@/components/whiteboard/whiteboard-modal';
import {
  FileText,
  Eye,
  MonitorPlay,
  Download,
  CheckCircle2,
  Sparkles,
  Award,
  ChevronRight,
  Compass,
  CircleDot,
  PenTool,
  Ruler,
  Layers,
  ArrowRight,
  Loader2,
  Landmark,
  Hammer
} from 'lucide-react';

interface ActivitySheetViewProps {
  outcomeCode?: string;
  outcomeTitle?: string;
  onGoToRubric?: () => void;
}

export function ActivitySheetView({
  outcomeCode = 'MAT.5.3.1',
  outcomeTitle = 'Temel Geometrik Çizimler ve Geometrik Araçların Kullanımı',
  onGoToRubric
}: ActivitySheetViewProps) {
  const { currentUser } = useAuth();
  const { playSound } = useApp();

  // Retrieve all activity sheets for this outcome
  const availableSheets = getActivitySheetsForOutcome(outcomeCode);
  const [selectedSheetId, setSelectedSheetId] = useState<string>(
    availableSheets.length > 0 ? availableSheets[0].id : 'file-activity-mat-5-3-1'
  );

  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [whiteboardModalOpen, setWhiteboardModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Active activity sheet file record
  const fileRecord = getActivitySheetForOutcome(outcomeCode, selectedSheetId);
  const isBridgeActivity = fileRecord?.id?.includes('bridge') || fileRecord?.title?.includes('Köprü');

  const handleDownloadPDF = async () => {
    if (!fileRecord) return;
    try {
      setIsDownloadingPdf(true);
      playSound('select');
      await exportClassroomFileToPdf(fileRecord, currentUser?.school);
      playSound('success');
    } catch (err) {
      console.error('Etkinlik PDF indirme hatası:', err);
      alert('Etkinlik kağıdı PDF oluşturulurken bir hata meydana geldi.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 0. Multi-Activity Tab Switcher (if multiple activities exist for outcome) */}
      {availableSheets.length > 1 && (
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-300 dark:border-slate-700 overflow-x-auto">
          {availableSheets.map((sheet, index) => {
            const isBridge = sheet.id.includes('bridge') || sheet.title.includes('Köprü');
            const isActive = sheet.id === (fileRecord?.id || selectedSheetId);
            return (
              <button
                key={sheet.id}
                type="button"
                onClick={() => {
                  playSound('click');
                  setSelectedSheetId(sheet.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? isBridge
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
                      : 'bg-teal-600 text-white shadow-md scale-102'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span>{isBridge ? '🏛️' : '📐'}</span>
                <span>{sheet.title.replace(' (MAT.5.3.1)', '')}</span>
                {isBridge && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-950/20 text-[9px] font-black uppercase">
                    Büyük Görev
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 1. Header Banner & Quick Action Buttons */}
      <div
        className={`text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-colors duration-300 ${
          isBridgeActivity
            ? 'bg-gradient-to-br from-amber-950 via-amber-900 to-slate-950'
            : 'bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900'
        }`}
      >
        {/* Background Decorative Patterns */}
        <div
          className={`absolute right-0 top-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
            isBridgeActivity ? 'bg-amber-500/10' : 'bg-teal-500/10'
          }`}
        />
        <div
          className={`absolute left-1/3 bottom-0 w-64 h-64 rounded-full blur-2xl pointer-events-none ${
            isBridgeActivity ? 'bg-orange-500/10' : 'bg-indigo-500/10'
          }`}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                isBridgeActivity
                  ? 'bg-amber-400/20 border-amber-300/30 text-amber-200'
                  : 'bg-teal-400/20 border-teal-300/30 text-teal-200'
              }`}
            >
              {isBridgeActivity ? (
                <>
                  <Landmark className="w-3.5 h-3.5 text-amber-300" />
                  <span>Büyük Görev • Mimari Restorasyon & Geometrik İnşa</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Süreç Değerlendirme & Geometrik İnşa İstasyonları</span>
                </>
              )}
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {isBridgeActivity
                ? 'Büyük Görev: Tarihi Köprü Restorasyonu'
                : 'Etkinlik 1: Aşamalı İnşa İstasyonları'}
            </h2>
            
            {/* Kurgu Paneli (Story Banner) */}
            {isBridgeActivity ? (
              <div className="p-3 bg-amber-950/60 border border-amber-500/40 rounded-2xl backdrop-blur-sm">
                <p className="text-xs sm:text-sm text-amber-100 font-medium italic leading-relaxed">
                  📜 <strong>Kurgu Paneli:</strong> &ldquo;Mimar Sinan'ın Kanuni Köprüsü'nün çizimi hasar gördü! Kemerleri ve ayakları aletlerinle tamamla.&rdquo;
                </p>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed">
                Öğrencilerin cetvel, iletki, pergel ve gönye araçlarını kullanarak temel geometrik yapıları inşa etme ve çıkarım yapma becerilerini pekiştiren 4 mini istasyon çalışmasıdır.
              </p>
            )}

            <div
              className={`flex items-center gap-3 pt-2 text-[11px] font-mono ${
                isBridgeActivity ? 'text-amber-200/70' : 'text-teal-200/70'
              }`}
            >
              <span>{outcomeCode}</span>
              <span>•</span>
              <span>{isBridgeActivity ? '4 Restorasyon Adımı (100 Puan)' : '4 İstasyon (100 Puan)'}</span>
              <span>•</span>
              <span>{isBridgeActivity ? 'Geniş Milimetrik Grid' : 'Sistem Beyaz Tahta Notu'}</span>
            </div>
          </div>

          {/* Action Button Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            
            {/* Görüntüle */}
            <button
              type="button"
              onClick={() => {
                playSound('select');
                setViewerModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              title="Etkinlik kağıdını tam ekran salt okunur modda incele"
            >
              <Eye className={`w-4 h-4 ${isBridgeActivity ? 'text-amber-300' : 'text-teal-300'}`} />
              <span>Görüntüle</span>
            </button>

            {/* Akıllı Tahtada Aç & Çiz */}
            <button
              type="button"
              onClick={() => {
                playSound('select');
                setWhiteboardModalOpen(true);
              }}
              className={`px-4 py-2.5 rounded-xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                isBridgeActivity
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/20'
              }`}
              title="Bu etkinlik kağıdını Akıllı Tahtaya yükle ve üzerinde çizim yap"
            >
              <MonitorPlay className="w-4 h-4 text-slate-950" />
              <span>Tahtada Aç & Çiz</span>
            </button>

            {/* PDF İndir */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloadingPdf}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
              title="Etkinlik kağıdını A4 PDF olarak indir"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className={`w-4 h-4 animate-spin ${isBridgeActivity ? 'text-amber-400' : 'text-teal-400'}`} />
                  <span>İndiriliyor...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-300" />
                  <span>A4 PDF İndir</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>

      {/* 2. BODY CONTENT: EITHER BRIDGE RESTORATION (BÜYÜK GÖREV) OR 4-STATION GRID */}
      {isBridgeActivity ? (
        /* ========================================================================= */
        /* BÜYÜK GÖREV: TARİHİ KÖPRÜ RESTORASYONU VIEW                               */
        /* ========================================================================= */
        <div className="space-y-6">
          
          {/* 4 Restorasyon Adımı Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Adım 1: Cetvel */}
            <div className="bg-white rounded-2xl p-4 border-2 border-teal-500/30 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 font-bold flex items-center justify-center text-xs">
                  📏
                </span>
                <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-bold text-[10px] border border-teal-200">
                  Adım 1: Cetvel
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-xs">Düz Nehir Zemin Doğrusu</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Cetvelini kullanarak su seviyesi hizasındaki düz nehir tabanı doğrusunu çiz.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-teal-700">
                <span>Araç: Cetvel</span>
                <span>25 Puan</span>
              </div>
            </div>

            {/* Adım 2: Gönye */}
            <div className="bg-white rounded-2xl p-4 border-2 border-orange-500/30 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-bold flex items-center justify-center text-xs">
                  📐
                </span>
                <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-800 font-bold text-[10px] border border-orange-200">
                  Adım 2: Gönye
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-xs">90° Dik İki Köprü Ayağı</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Zemine 90° dik iki taşıyıcı köprü ayağı indir. Diklik sembolünü (⊥) yerleştir.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-orange-700">
                <span>Araç: Gönye (⊥ 90°)</span>
                <span>25 Puan</span>
              </div>
            </div>

            {/* Adım 3: Pergel */}
            <div className="bg-white rounded-2xl p-4 border-2 border-purple-500/30 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-bold flex items-center justify-center text-xs">
                  ⭕
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-bold text-[10px] border border-purple-200">
                  Adım 3: Pergel
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-xs">Dairesel Kemer Yayı</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Pergel ucunu 'K' kemer merkezine sabitleyip iki ayak arasına dairesel kemer yayı kondur.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-purple-700">
                <span>Araç: Pergel (r=5 cm)</span>
                <span>25 Puan</span>
              </div>
            </div>

            {/* Adım 4: İletki */}
            <div className="bg-white rounded-2xl p-4 border-2 border-blue-500/30 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-xs">
                  🧭
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold text-[10px] border border-blue-200">
                  Adım 4: İletki
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-xs">Kule Çatı Açısı Kontrolü</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                İletki ile gözetleme kulesinin çatı eğimini (60°/45°) kontrol et ve açıyı yaz.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-blue-700">
                <span>Araç: İletki (Açıölçer)</span>
                <span>25 Puan</span>
              </div>
            </div>

          </div>

          {/* Geniş Çizim Alanı: Milimetrik Grid Canvas */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-500/40 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-bottom border-slate-200 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  <span>🏛️</span>
                  <span>Geniş Çizim Alanı (Milimetrik Grid Canvas)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Mimar Sinan'ın Kanuni Köprüsü restorasyon şablonu üzerinde çizim araçlarını uygulayınız.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200">
                Ölçek: 1 birim = 1 cm • Çift Kemer Hizası
              </span>
            </div>

            {/* Büyük İnteraktif Blueprint Canvas (SVG Destekli ve Matematiksel Olarak K Merkezli) */}
            <div className="border-2 border-dashed border-amber-400 rounded-2xl bg-[#fcfbf7] p-3 sm:p-5 relative overflow-hidden select-none shadow-inner">
              <svg viewBox="0 0 800 320" width="100%" height="100%" className="w-full h-auto overflow-visible select-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid_view" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.2" fill="#cbd5e1" />
                  </pattern>
                  <linearGradient id="pierGrad_view" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#fde68a" />
                    <stop offset="50%" stop-color="#fef3c7" />
                    <stop offset="100%" stop-color="#fde68a" />
                  </linearGradient>
                  <linearGradient id="waterGrad_view" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#bae6fd" stop-opacity="0.3" />
                  </linearGradient>
                </defs>

                <rect x="0" y="0" width="800" height="320" fill="#fcfbf7" />
                <rect x="0" y="0" width="800" height="320" fill="url(#grid_view)" />

                {/* Su Alanı (Nehir Yatağı) */}
                <rect x="30" y="250" width="740" height="60" fill="url(#waterGrad_view)" rx="8" />
                <path d="M 50 280 Q 90 273 130 280 T 210 280 T 290 280 T 370 280 T 450 280 T 530 280 T 610 280 T 690 280 T 750 280" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.7" />
                <text x="400" y="298" font-family="system-ui, sans-serif" font-size="11" fill="#0284c7" text-anchor="middle" font-weight="600">
                  ~~~~ Tunca / Meriç Nehri Su Yatağı ~~~~
                </text>

                {/* ADIM 1: NEHİR ZEMİN DOĞRUSU (CETVEL) */}
                <line x1="40" y1="250" x2="760" y2="250" stroke="#0d9488" stroke-width="3.5" stroke-linecap="round" />
                <polygon points="36,250 48,245 48,255" fill="#0d9488" />
                <polygon points="764,250 752,245 752,255" fill="#0d9488" />
                <text x="50" y="240" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#0f766e">
                  ◄ Düz Nehir Zemin Doğrusu (Cetvel)
                </text>
                <text x="750" y="240" font-family="monospace" font-size="11" font-weight="900" fill="#0f766e" text-anchor="end">
                  d_nehir ►
                </text>

                {/* Cetvel Çentikleri */}
                <g stroke="#0f766e" stroke-width="1" opacity="0.6">
                  <line x1="100" y1="247" x2="100" y2="253" />
                  <line x1="250" y1="245" x2="250" y2="255" stroke-width="2" />
                  <line x1="400" y1="245" x2="400" y2="255" stroke-width="2" />
                  <line x1="550" y1="245" x2="550" y2="255" stroke-width="2" />
                  <line x1="700" y1="247" x2="700" y2="253" />
                </g>

                {/* ADIM 4: KULE GÖZETLEME ÇATISI (İLETKİ) */}
                <g>
                  <rect x="90" y="90" width="60" height="160" fill="#fef3c7" stroke="#b45309" stroke-width="2" rx="2" />
                  <rect x="110" y="120" width="20" height="30" rx="10" fill="#78350f" opacity="0.7" />
                  <polygon points="120,25 80,90 160,90" fill="#fed7aa" stroke="#ea580c" stroke-width="2" />
                  <circle cx="120" cy="25" r="5" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
                  <text x="120" y="16" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#1d4ed8" text-anchor="middle">
                    T (Tepe Noktası)
                  </text>
                  <path d="M 100 57 A 38 38 0 0 0 140 57" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="3 3" />
                  <text x="120" y="72" font-family="monospace" font-size="10" font-weight="900" fill="#2563eb" text-anchor="middle">
                    60° (İletki)
                  </text>
                </g>

                {/* ADIM 2: SOL AYAK (AYAK 1 - GÖNYE) */}
                <g>
                  <rect x="235" y="150" width="30" height="100" fill="url(#pierGrad_view)" stroke="#d97706" stroke-width="2" rx="2" />
                  <text x="250" y="205" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#92400e" text-anchor="middle">
                    AYAK 1
                  </text>
                  <circle cx="250" cy="150" r="4" fill="#c2410c" />
                  <text x="228" y="145" font-family="monospace" font-size="10" font-weight="900" fill="#c2410c">
                    A1
                  </text>
                  <path d="M 265 240 L 275 240 L 275 250" fill="none" stroke="#ea580c" stroke-width="1.8" />
                  <circle cx="270" cy="245" r="1.5" fill="#ea580c" />
                  <text x="250" y="125" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#c2410c" text-anchor="middle">
                    [A1-Z1] ⊥ d (90°)
                  </text>
                </g>

                {/* ADIM 2: SAĞ AYAK (AYAK 2 - GÖNYE) */}
                <g>
                  <rect x="535" y="150" width="30" height="100" fill="url(#pierGrad_view)" stroke="#d97706" stroke-width="2" rx="2" />
                  <text x="550" y="205" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#92400e" text-anchor="middle">
                    AYAK 2
                  </text>
                  <circle cx="550" cy="150" r="4" fill="#c2410c" />
                  <text x="568" y="145" font-family="monospace" font-size="10" font-weight="900" fill="#c2410c">
                    A2
                  </text>
                  <path d="M 535 240 L 525 240 L 525 250" fill="none" stroke="#ea580c" stroke-width="1.8" />
                  <circle cx="530" cy="245" r="1.5" fill="#ea580c" />
                  <text x="550" y="125" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#c2410c" text-anchor="middle">
                    [A2-Z2] ⊥ d (90°)
                  </text>
                </g>

                {/* ADIM 3: KEMER MERKEZİ K VE KEMER YAYI (PERGEL) */}
                {/* 1. Kesik Çizgili Kemer Yayı (Merkezi K=(400,150) olan tam yarıçap R=150 dairesel yay) */}
                <path d="M 250 150 A 150 150 0 0 1 550 150" fill="none" stroke="#7c3aed" stroke-width="3" stroke-dasharray="6 4" />

                {/* 2. Kemer Üst Taş Sınırı (Korkuluk Yolu) */}
                <path d="M 80 90 L 250 130 A 165 165 0 0 1 550 130 L 720 90" fill="none" stroke="#b45309" stroke-width="2" stroke-dasharray="4 4" opacity="0.5" />

                {/* 3. Yarıçap (Radius) Çizgileri */}
                <line x1="400" y1="150" x2="400" y2="0" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3 3" />
                <line x1="400" y1="150" x2="506" y2="44" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3 3" />
                <circle cx="506" cy="44" r="3" fill="#7c3aed" />

                {/* Yarıçap Etiketi */}
                <g transform="translate(460, 90)">
                  <rect x="-4" y="-12" width="90" height="18" fill="#ffffff" stroke="#ddd6fe" rx="4" />
                  <text x="41" y="1" font-family="monospace" font-size="10" font-weight="bold" fill="#6d28d9" text-anchor="middle">
                    r = 5 cm (Pergel)
                  </text>
                </g>

                {/* Kemer Tepe Etiketi */}
                <g transform="translate(400, 20)">
                  <rect x="-80" y="-14" width="160" height="22" fill="#ffffff" stroke="#7c3aed" stroke-width="1.5" rx="6" />
                  <text x="0" y="1" font-family="system-ui, sans-serif" font-size="10.5" font-weight="900" fill="#6d28d9" text-anchor="middle">
                    Dairesel Kemer Yayı (Yay Tepe: P)
                  </text>
                </g>

                {/* 4. K Noktası (Kemer Merkezi - Pergel Batırma İğnesi) */}
                <line x1="250" y1="150" x2="550" y2="150" stroke="#6d28d9" stroke-width="1" stroke-dasharray="2 2" opacity="0.4" />
                <circle cx="400" cy="150" r="14" fill="#ede9fe" stroke="#6d28d9" stroke-width="2" />
                <circle cx="400" cy="150" r="4" fill="#6d28d9" />
                <line x1="388" y1="150" x2="412" y2="150" stroke="#6d28d9" stroke-width="1.5" />
                <line x1="400" y1="138" x2="400" y2="162" stroke="#6d28d9" stroke-width="1.5" />

                {/* K Noktası Etiketi */}
                <g transform="translate(400, 180)">
                  <rect x="-75" y="-12" width="150" height="24" fill="#f5f3ff" stroke="#6d28d9" stroke-width="1.5" rx="6" />
                  <text x="0" y="3" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#5b21b6" text-anchor="middle">
                    K (Kemer Merkezi)
                  </text>
                  <text x="0" y="24" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#7c3aed" text-anchor="middle">
                    📍 Pergel İğnesi Batırma Noktası
                  </text>
                </g>
              </svg>
            </div>
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* ETKİNLİK 1: AŞAMALI İNŞA İSTASYONLARI (4 Mini Çizim Alanı)                */
        /* ========================================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* İSTASYON 1: CETVEL */}
          <div className="bg-white rounded-3xl p-6 border-2 border-teal-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-teal-800 font-black text-sm">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-sm">
                    📏
                  </div>
                  <span>İSTASYON 1: CETVEL</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-bold text-[11px] border border-teal-200">
                  Doğru Parçası & Işın
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <strong>Yönerge:</strong> Cetvelini kullanarak <strong>6 cm</strong> uzunluğunda bir <code>[AB]</code> doğru parçası çiz. Ardından başlangıcı <code>C</code> olan bir <code>[CD</code> ışını inşa et.
              </div>

              {/* Station Canvas Simulation Area */}
              <div className="border-2 border-dashed border-teal-300/80 rounded-2xl h-48 bg-slate-50/70 p-4 relative flex flex-col justify-between overflow-hidden select-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono font-black text-teal-900 text-xs">
                    <span className="w-3 h-3 rounded-full bg-teal-600 inline-block"></span>
                    <span>A Noktası</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">(6 cm → B noktası)</span>
                </div>

                <div className="my-auto py-2 border-y border-slate-200/80 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span>0 cm</span>
                  <span>2 cm</span>
                  <span>4 cm</span>
                  <span className="font-bold text-teal-700">6 cm [AB]</span>
                  <span>8 cm</span>
                  <span>10 cm</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono font-black text-teal-900 text-xs">
                    <span className="w-3 h-3 rounded-full bg-teal-600 inline-block"></span>
                    <span>C Noktası</span>
                  </div>
                  <span className="text-[11px] text-teal-700 font-bold flex items-center gap-1">
                    <span>[CD Işını</span>
                    <span>──────►</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Hedef Araç: <strong>Santimetre Cetveli</strong></span>
              <span className="text-teal-700 font-bold">25 Puan</span>
            </div>
          </div>

          {/* İSTASYON 2: İLETKİ */}
          <div className="bg-white rounded-3xl p-6 border-2 border-blue-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-blue-900 font-black text-sm">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm">
                    🧭
                  </div>
                  <span>İSTASYON 2: İLETKİ</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-200">
                  60° Dar Açı İnşası
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <strong>Yönerge:</strong> Verilen yatay kolun başlangıç noktasına iletkini yerleştirerek <strong>60°'lik</strong> bir dar açı inşa et. Açının yayını çiz.
              </div>

              <div className="border-2 border-dashed border-blue-300/80 rounded-2xl h-48 bg-slate-50/70 p-4 relative flex flex-col justify-between overflow-hidden select-none">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-36 h-20 border-t-2 border-x-2 border-dashed border-blue-200 rounded-t-full flex items-center justify-center opacity-60">
                  <span className="text-[10px] font-mono font-bold text-blue-600 mt-2">60° Hizası</span>
                </div>

                <div className="flex justify-end text-[10px] text-slate-400 font-mono">
                  m(O) = 60°
                </div>

                <div className="relative mt-auto pt-6 flex items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-100 shrink-0"></div>
                  <span className="absolute -bottom-5 left-0 font-bold text-blue-900 text-[11px]">O (Köşe)</span>
                  <div className="flex-1 h-0.5 bg-slate-800 ml-2 relative">
                    <span className="absolute right-0 -top-2 text-slate-800 text-xs">►</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Hedef Araç: <strong>İletki (Açıölçer)</strong></span>
              <span className="text-blue-700 font-bold">25 Puan</span>
            </div>
          </div>

          {/* İSTASYON 3: PERGEL */}
          <div className="bg-white rounded-3xl p-6 border-2 border-purple-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-purple-900 font-black text-sm">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm">
                    ⭕
                  </div>
                  <span>İSTASYON 3: PERGEL</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 font-bold text-[11px] border border-purple-200">
                  Çember & Selçuklu Motifi
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <strong>Yönerge:</strong> Pergelini <strong>4 cm</strong> aç. <code>'M'</code> merkezine batırarak tam bir çember çiz. Çember yayından merkeze doğru ikinci bir yay çizerek çiçek motifi oluştur.
              </div>

              <div className="border-2 border-dashed border-purple-300/80 rounded-2xl h-48 bg-slate-50/70 p-4 relative flex items-center justify-center select-none">
                <div className="w-28 h-28 rounded-full border-2 border-dashed border-purple-300/80 flex items-center justify-center relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-purple-600 ring-4 ring-purple-100"></div>
                  <span className="absolute -bottom-6 font-bold text-purple-900 text-[11px]">M (Merkez)</span>
                  <div className="absolute top-1/2 left-1/2 w-14 h-0.5 bg-purple-400 -translate-y-1/2 origin-left rotate-45 border-t border-dashed border-purple-600">
                    <span className="absolute -top-4 right-0 text-[9px] font-mono text-purple-700 font-bold">r = 4 cm</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Hedef Araç: <strong>Pergel (Çember Çizimi)</strong></span>
              <span className="text-purple-700 font-bold">25 Puan</span>
            </div>
          </div>

          {/* İSTASYON 4: GÖNYE */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-sm">
                    📐
                  </div>
                  <span>İSTASYON 4: GÖNYE</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200">
                  Dikme İndirme (⊥)
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <strong>Yönerge:</strong> Aşağıdaki <code>d</code> doğrusuna, dışındaki <code>P</code> noktasından gönye yardımıyla bir dikme indir. Diklik sembolünü (<code>⊥</code>) koy.
              </div>

              <div className="border-2 border-dashed border-amber-300/80 rounded-2xl h-48 bg-slate-50/70 p-4 relative flex flex-col justify-between overflow-hidden select-none">
                <div className="flex items-center gap-1.5 ml-12 mt-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-600 ring-4 ring-amber-100"></div>
                  <span className="font-black text-amber-900 text-xs">P (Dış Nokta)</span>
                </div>

                <div className="relative mt-auto mb-4">
                  <div className="w-full h-1 bg-slate-700 -rotate-3 transform origin-left"></div>
                  <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-slate-500">
                    <span>d doğrusu</span>
                    <span className="font-bold text-amber-800">[PH] ⊥ d (90°)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Hedef Araç: <strong>Gönye (Dik Açılı Çizim)</strong></span>
              <span className="text-amber-700 font-bold">25 Puan</span>
            </div>
          </div>

        </div>
      )}

      {/* 3. Bottom Next Step Banner (Go to Rubric) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black text-teal-800 uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Sıradaki Aşama: Öz Değerlendirme Rubriği</span>
          </div>
          <p className="text-xs text-slate-500">
            {isBridgeActivity
              ? 'Tarihi Köprü Restorasyonu adımlarını tamamladıktan sonra bir sonraki adıma geçerek kendi çizimlerinizi değerlendiriniz.'
              : 'Etkinlik kağıdındaki 4 inşa istasyonunu tamamladıktan sonra bir sonraki adıma geçerek kendi çizimlerinizi değerlendiriniz.'}
          </p>
        </div>

        {onGoToRubric && (
          <button
            type="button"
            onClick={() => {
              playSound('select');
              onGoToRubric();
            }}
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
          >
            <span>Öz Değerlendirme Formuna Geç</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Whiteboard Pure Read-Only Viewer Modal */}
      {fileRecord && (
        <WhiteboardViewerModal
          isOpen={viewerModalOpen}
          onClose={() => setViewerModalOpen(false)}
          file={fileRecord}
        />
      )}

      {/* Interactive Whiteboard Modal with File Loaded */}
      {fileRecord && (
        <WhiteboardModal
          isOpen={whiteboardModalOpen}
          onClose={() => setWhiteboardModalOpen(false)}
          initialFile={fileRecord}
          outcomeCode={outcomeCode}
          outcomeTitle={outcomeTitle}
          classSection="Tümü"
        />
      )}

    </div>
  );
}
