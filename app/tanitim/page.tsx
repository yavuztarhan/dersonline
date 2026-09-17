'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Tv,
  GraduationCap,
  Users,
  Gamepad2,
  QrCode,
  Award,
  Layers,
  BarChart3,
  ShieldCheck,
  Compass,
  Zap,
  Printer,
  Eye,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function TanitimPage() {
  const pdfUrl = '/downloads/maarif-akademi-meb-yenilikci-ogretmenler-tanitim.pdf';

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Top Header Banner */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>MEB Yenilikçi Öğretmenler ve Eğitimde İyi Örnekler Başvuru Kiti</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Maarif Akademi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-300">
              Web Sayfası & Platform Tanıtım Broşürü
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Türkiye Yüzyılı Maarif Modeli standartlarında hazırlanan <strong>4 aşamalı ders akışı</strong>, 
            <strong> dokunmatik akıllı tahta laboratuvarı</strong>, <strong>70+ kazanım oyunu</strong> ve 
            <strong> resmi MEB ders planı</strong> mimarisini içeren 5 sayfalık yüksek çözünürlüklü tanıtım kitapçığı.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href={pdfUrl}
            download="maarif-akademi-meb-yenilikci-ogretmenler-tanitim.pdf"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/30 transition-all flex items-center gap-2.5 active:scale-95 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>Yüksek Çözünürlüklü PDF İndir (A4)</span>
          </a>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-teal-400" />
            <span>Tarayıcıda İncele</span>
          </a>

          <Link
            href="/neler-yapabilirsiniz"
            className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm transition-all flex items-center gap-2"
          >
            <span>Neler Yapabilirsiniz Sayfası</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </div>

      {/* PDF Overview 5-Page Grid Highlights */}
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <FileText className="w-6 h-6 text-teal-400" />
          <span>Tanıtım Dosyası Sayfa Planı (5 Sayfa)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Sayfa 1 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-teal-950 border border-teal-500/40 text-teal-300">
                1. Sayfa
              </span>
              <span className="text-[11px] text-slate-400 font-mono">A4 Kapak & Özet</span>
            </div>
            <h3 className="text-base font-black text-white">Resmi Kapak & Yönetici Özeti</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Milli Eğitim Bakanlığı Yenilikçi Öğretmenler başvuru formatı, sahadaki temel problemler ve Maarif Akademi'nin geliştirdiği 5 temel yenilikçi çözüm.
            </p>
          </div>

          {/* Sayfa 2 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                2. Sayfa
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Ders Akış Kartları</span>
            </div>
            <h3 className="text-base font-black text-white">Hikâye, Atölye ve 70+ Oyun</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              1. Aşama Merak Kancası (Mimar Sinan Selimiye'den Gökbey'e), 2. Aşama Dokunmatik Cetvel-Pergel Laboratuvarı ve 3. Aşama Web Audio API destekli kazanım oyunları.
            </p>
          </div>

          {/* Sayfa 3 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                3. Sayfa
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Öğretmen Asistanı</span>
            </div>
            <h3 className="text-base font-black text-white">Ölçme & Öğretmen Süper Güçleri</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              MEB Uyumlu anlık değerlendirme & SDB öğrenme günlüğü, tek tıkla resmi A4 ders planı indirme ve tahta önünde şifre ifşasını engelleyen QR/PIN girişi.
            </p>
          </div>

          {/* Sayfa 4 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300">
                4. Sayfa
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Öğrenci & 81 İl</span>
            </div>
            <h3 className="text-base font-black text-white">Sınıf Hakimiyeti & Sıfır Maliyet</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Öğrenci kura çarkı, şeffaf tahta kalemi, şifresiz öğrenci masası, 81 il genelinde sıfır lisans maliyeti ve Fatih Projesi Faz 1-2-3 %100 uyumu.
            </p>
          </div>

          {/* Sayfa 5 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl md:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300">
                5. Sayfa
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Değerlendirme Matrisi</span>
            </div>
            <h3 className="text-base font-black text-white">MEB Yenilikçi Öğretmenler Kriterler Matrisi & Sonuç</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Özgünlük, Öğrenme Sürecine Katkı, Maarif Modeli Uyumu, Yaygınlaşma Potansiyeli ve Sürdürülebilirlik kriterlerinin tek tek ispatlandığı resmi değerlendirme matrisi ve canlı demo bağlantıları.
            </p>
          </div>
        </div>
      </div>

      {/* Embedded PDF Viewer Frame */}
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-teal-400" />
            <span>Canlı Belge Önizlemesi</span>
          </h3>
          <a
            href={pdfUrl}
            download="maarif-akademi-meb-yenilikci-ogretmenler-tanitim.pdf"
            className="text-xs text-teal-300 font-bold hover:underline flex items-center gap-1"
          >
            <span>Doğrudan İndir (.PDF)</span>
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="w-full h-[700px] rounded-3xl border-2 border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            className="w-full h-full border-none"
            title="Maarif Akademi MEB Tanıtım PDF"
          />
        </div>
      </div>
    </div>
  );
}
