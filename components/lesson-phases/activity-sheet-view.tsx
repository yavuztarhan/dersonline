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

            {/* Büyük İnteraktif / Temsili Blueprint Canvas */}
            <div className="border-2 border-dashed border-amber-300 rounded-2xl min-h-[380px] bg-[#fcfbf7] p-6 relative flex flex-col justify-between overflow-hidden select-none shadow-inner">
              
              {/* Milimetrik Arka Plan Izgarası */}
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#d4d4d8 1.5px, transparent 1.5px)',
                  backgroundSize: '20px 20px'
                }}
              />

              {/* 1. Kule ve Açı Kontrol Alanı (Sol Üst) */}
              <div className="relative z-10 flex items-start justify-between">
                <div className="bg-white/90 backdrop-blur-sm border-2 border-blue-400 p-3 rounded-2xl shadow-sm max-w-xs">
                  <div className="flex items-center gap-1.5 text-blue-900 font-black text-xs mb-1">
                    <span>🏰</span>
                    <span>Kule Gözetleme Çatısı</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight">
                    İletki merkezini 'T' tepe noktasına koyarak çatı açısını (60°) doğrula.
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-blue-700 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                    <span>T Tepe Noktası (m(T) = 60°)</span>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="px-3 py-1 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-mono text-xs font-bold">
                    Mimar Sinan Kanuni Köprüsü Çizimi
                  </span>
                </div>
              </div>

              {/* 2. Köprü Kemer ve Ayak Yapısı (Orta / Zemin Alanı) */}
              <div className="relative z-10 my-8 py-6">
                
                {/* Sol Ayak (Gönye) */}
                <div className="absolute bottom-10 left-[22%] -translate-x-1/2 text-center">
                  <div className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-black text-[10px] border border-orange-300 mb-1 inline-block">
                    Ayak 1: [A1-Z1] ⊥ Zemin (90°)
                  </div>
                  <div className="w-6 h-24 bg-gradient-to-b from-amber-200 to-amber-300 border-2 border-dashed border-orange-500 rounded-t-md mx-auto relative flex items-center justify-center">
                    <span className="text-[9px] font-bold text-orange-900 rotate-90">GÖNYE</span>
                  </div>
                </div>

                {/* Kemer Merkezi K ve Kemer Yayı (Pergel) */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  {/* Kemer Kılavuz Yayı */}
                  <div className="w-56 h-28 border-t-4 border-x-4 border-dashed border-purple-500 rounded-t-full relative -mb-2 opacity-80 flex items-center justify-center">
                    <span className="text-[10px] font-black text-purple-900 bg-white/80 px-2 py-0.5 rounded-full border border-purple-300 -mt-8">
                      Pergel Kemer Yayı (r = 5 cm)
                    </span>
                  </div>

                  {/* Pergel Batırma İğnesi Noktası K */}
                  <div className="flex items-center gap-1.5 bg-purple-100 border border-purple-300 px-3 py-1 rounded-xl mt-1 shadow-sm">
                    <span className="w-3 h-3 rounded-full bg-purple-600 ring-2 ring-purple-200 animate-ping"></span>
                    <span className="text-[11px] font-mono font-black text-purple-900">K (Kemer Merkezi)</span>
                  </div>
                </div>

                {/* Sağ Ayak (Gönye) */}
                <div className="absolute bottom-10 right-[22%] translate-x-1/2 text-center">
                  <div className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-black text-[10px] border border-orange-300 mb-1 inline-block">
                    Ayak 2: [A2-Z2] ⊥ Zemin (90°)
                  </div>
                  <div className="w-6 h-24 bg-gradient-to-b from-amber-200 to-amber-300 border-2 border-dashed border-orange-500 rounded-t-md mx-auto relative flex items-center justify-center">
                    <span className="text-[9px] font-bold text-orange-900 rotate-90">GÖNYE</span>
                  </div>
                </div>

              </div>

              {/* 3. Nehir Tabanı Doğrusu (Cetvel) & Su Seviyesi */}
              <div className="relative z-10 pt-4">
                
                {/* Nehir Zemin Doğrusu */}
                <div className="h-1 bg-teal-600 rounded-full w-full relative">
                  <div className="absolute left-0 -top-5 flex items-center gap-1 font-black text-teal-800 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                    <span>◄ Düz Nehir Zemin Doğrusu (Cetvel ile Çiz)</span>
                  </div>
                  <div className="absolute right-0 -top-5 font-mono font-black text-teal-800 text-[11px]">
                    d_nehir Doğrusu ►
                  </div>

                  {/* Cetvel Cetvel Ölçüm Kılavuzları */}
                  <div className="w-full flex justify-between pt-1.5 text-[9px] font-mono text-slate-400">
                    <span>0 cm</span>
                    <span>5 cm</span>
                    <span>10 cm</span>
                    <span className="font-bold text-teal-700">15 cm (Ayak 1)</span>
                    <span className="font-bold text-purple-700">20 cm (Merkez K)</span>
                    <span className="font-bold text-teal-700">25 cm (Ayak 2)</span>
                    <span>30 cm</span>
                    <span>35 cm</span>
                  </div>
                </div>

                {/* Tunca / Meriç Nehri Dalgaları */}
                <div className="pt-6 flex justify-around text-sky-500/70 text-xs font-serif tracking-widest">
                  <span>~~~~ Tunca Nehri Su Yatağı ~~~~</span>
                  <span className="hidden sm:inline">~~~~ Meriç Kolu ~~~~</span>
                </div>

              </div>

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
