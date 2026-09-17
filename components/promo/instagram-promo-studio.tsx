'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Download,
  Copy,
  Check,
  Share2,
  Tv,
  Layers,
  Award,
  FlaskConical,
  Gamepad2,
  FileCheck2,
  Users,
  Eye,
  Grid,
  Maximize2,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Scale,
  Compass,
  CheckCircle2,
  Flame,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { Instagram, Globe } from 'lucide-react';

import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

export interface PromoSlide {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  category: string;
  bullets: { icon: string; title: string; desc: string }[];
  visualType: 'cover' | 'cycle' | 'story' | 'lab' | 'games' | 'rubric' | 'activity' | 'teacher' | 'demo' | 'cta';
  mascotImage?: string;
  footerCallout: string;
}

export const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 1,
    badge: 'TÜRKİYE YÜZYILI MAARİF MODELİ • %100 UYUMLU',
    badgeColor: 'from-amber-400 to-orange-500',
    title: 'Matematik Dersini Sıkıcı Olmaktan Çıkaran Akıllı Sınıf Platformu!',
    subtitle: 'Görsel Hikâye, Sanal Laboratuvar, Akıllı Tahta Oyunları ve Süreç Rubriği tek ekranda.',
    category: 'Giriş & Genel Tanıtım',
    mascotImage: '/mascot/selim-success.png',
    footerCallout: 'Neler var? Kaydırın 👉',
    bullets: [
{ icon: '✨', title: '%100 Yeni Müfredat', desc: 'TYMM öğrenme çıktıları, SDB becerileri ve okuryazarlık alanları.' },
      { icon: '🖥️', title: 'Akıllı Tahta Tasarımı', desc: 'Büyük butonlar, yüksek kontrast, dokunmatik deney ve akıllı tahta çarkı.' },
      { icon: '🚀', title: 'Kayıtsız Canlı Demo', desc: 'Öğretmenlerimizin anında deneyebilmesi için tek tıkla izole test imkanı.' }
    ],
    visualType: 'cover'
  },
  {
    id: 2,
    badge: 'YENİ NESİL PEDAGOJİK YAKLAŞIM',
    badgeColor: 'from-teal-400 to-emerald-500',
    title: 'Ezberci Değil, Keşfederek Öğreten \n4 Aşamalı Ders Döngüsü',
    subtitle: 'Her kazanım tesadüflere bırakılmayan 4 pedagojik istasyondan geçer.',
    category: 'Pedagojik Model',
    mascotImage: '/mascot/selim-thinking.png',
    footerCallout: 'Aşamaları keşfet 👉',
    bullets: [
      { icon: '1️⃣', title: 'Görsel Hikâye (Giriş)', desc: 'Gerçek yaşam kurguları ile derse merak ve motivasyon kazandırma.' },
      { icon: '2️⃣', title: 'Sanal Atölye (Keşif)', desc: 'Öğrencinin serbestçe manipüle ettiği dijital deney tezgahları.' },
      { icon: '3️⃣', title: 'Oyunlar Arenası (Pekiştirme)', desc: 'Akıllı tahtada heyecanlı sınıf içi rekabet ve puanlama.' },
      { icon: '4️⃣', title: 'Süreç Rubriği (Değerlendirme)', desc: '4 düzeyli Maarif ölçeğiyle öğrenci öz ve akran değerlendirmesi.' }
    ],
    visualType: 'cycle'
  },
  {
    id: 3,
    badge: 'AŞAMA 01 • DERSE GİRİŞ & MOTİVASYON',
    badgeColor: 'from-indigo-400 to-purple-500',
    title: '"Hocam Bu Gerçek Hayatta Nerede Karşımıza Çıkacak?" Sorusuna Son!',
    subtitle: 'Tarih, doğa ve mühendislikle matematiği buluşturan zengin illüstrasyonlar.',
    category: '1. Aşama: Hikaye',
    mascotImage: '/mascot/selim-curious.png',
    footerCallout: 'Laboratuvara geçelim 👉',
    bullets: [
      { icon: '🏛️', title: 'Selimiye\'den Gökyüzüne', desc: 'Mimar Sinan’ın kubbe mimarisinden uzay geometrisine sürükleyici kurgular.' },
      { icon: '❄️', title: 'Palandöken Kış Köyü', desc: 'Dondurucu kutup soğuklarında rasyonel sayı sıralaması ve rüzgar türbinleri.' },
      { icon: '🌱', title: 'Sosyal-Duygusal Beceriler', desc: 'Tasarruf, dayanışma, karar verme ve eleştirel düşünme odaklı hikayeler.' }
    ],
    visualType: 'story'
  },
  {
    id: 4,
    badge: 'AŞAMA 02 • DENEY & MANİPÜLASYON',
    badgeColor: 'from-blue-400 to-cyan-500',
    title: 'Matematiğe Dokunun: \nDinamik Laboratuvar Masası',
    subtitle: 'Öğrenci formül ezberlemez; kefeleri hareket ettirip dengeyi keşfeder.',
    category: '2. Aşama: Laboratuvar',
    mascotImage: '/mascot/selim-measuring.png',
    footerCallout: 'Oyunlar başlıyor 👉',
    bullets: [
      { icon: '⚖️', title: 'Dinamik Rasyonel Terazi', desc: 'Kesir ağırlığı simülasyonu, otomatik eğim açısı ve zihinsel strateji analizi.' },
      { icon: '📏', title: 'Referans Lazer Metresi', desc: '0, 1/2 ve 1 referans noktalarına olan mesafeyle zihinden kıyaslama.' },
      { icon: '🔬', title: 'Yoğunluk Mikroskobu', desc: 'İki rasyonel sayı arasındaki sonsuz nokta derinliğini görselleştirme.' }
    ],
    visualType: 'lab'
  },
  {
    id: 5,
    badge: 'AŞAMA 03 • AKILLI TAHTA OYUNLAŞTIRMA',
    badgeColor: 'from-amber-400 to-pink-500',
    title: 'Sınıfı Heyecana Boğan \nEğitici Oyunlar Arenası',
    subtitle: 'Akıllı tahtada parmak kaldıran her öğrenci bir matematik kahramanı.',
    category: '3. Aşama: Oyunlar',
    mascotImage: '/mascot/selim-running.png',
    footerCallout: 'Değerlendirmeye bak 👉',
    bullets: [
      { icon: '🎮', title: 'Özel Kurgulanmış Oyunlar', desc: 'Rasyonel Terazi Oyunu, Kutup Soğuğu Sıralama Parkuru ve Türbin Sürat Yarışı.' },
      { icon: '🔍', title: 'Kelime Avı & D/Y Arenası', desc: 'Ünite kavramları bulmacası ve pedagojik Bloom taksonomili doğru/yanlış soruları.' },
      { icon: '🔥', title: 'Streak Çarpanı & Rozetler', desc: 'Hatasız serilerde katlanan XP puanları ve tahtaya kalkan öğrenciye anında ödül.' }
    ],
    visualType: 'games'
  },
  {
    id: 6,
    badge: 'AŞAMA 04 • ÖLÇME & DEĞERLENDİRME',
    badgeColor: 'from-rose-400 to-red-500',
    title: 'Yalnızca Not Değil; \nBeceriyi Ölçen Maarif Rubriği',
    subtitle: 'Türkiye Yüzyılı Maarif Modeli 4 düzeyli yetkinlik ve süreç ölçeği.',
    category: '4. Aşama: Rubrik',
    mascotImage: '/mascot/selim-proud.png',
    footerCallout: 'Çalışma yaprakları 👉',
    bullets: [
      { icon: '📊', title: 'Konuya Özel 5 Kriter', desc: 'Kavramsal anlama, matematiksel modelleme, strateji çeşitliliği ve hata dedektifliği.' },
      { icon: '👥', title: 'Öz & Akran Değerlendirme', desc: 'Öğrencinin hem kendi performansını hem de takım arkadaşını puanlayabilmesi.' },
      { icon: '📝', title: 'Öğretmen Gözlemi & Karne', desc: 'Eksik öğrenmeleri anında tespit eden analitik süreç değerlendirme raporu.' }
    ],
    visualType: 'rubric'
  },
  {
    id: 7,
    badge: 'A4 BASKIYA HAZIR • SINIF MATERYALİ',
    badgeColor: 'from-emerald-400 to-teal-500',
    title: '1 Tıkla İndir & Çoğalt: \nÇift Taraflı Çalışma Yaprağı',
    subtitle: 'Ön yüz keşif ve modelleme, arka yüz dedektiflik ve Maarif rubriği!',
    category: 'Etkinlik Kağıtları',
    mascotImage: '/mascot/selim-pointing.png',
    footerCallout: 'Öğretmen paneli 👉',
    bullets: [
      { icon: '📄', title: 'Ön Yüz (İç - Keşif):', desc: 'Strateji rehber kartları, terazi simülasyonu ve sayı doğrusu modelleme alıştırmaları.' },
      { icon: '📑', title: 'Arka Yüz (Dış - Analiz):', desc: 'Kavram yanılgısı hata dedektifi, gerçek yaşam senaryosu ve 4\'lü süreç rubriği.' },
      { icon: '🖨️', title: 'Mürekkep Dostu PDF', desc: 'Sınıfta anında fotokopiye uygun, A4 standartlarında tek tıkla indirme.' }
    ],
    visualType: 'activity'
  },
  {
    id: 8,
    badge: 'ÖĞRETMEN ASİSTANI • SINIF YÖNETİMİ',
    badgeColor: 'from-violet-400 to-indigo-500',
    title: 'Öğretmenin Zamanını Kurtaran \nAkıllı Sınıf Konsepti',
    subtitle: 'Sınıf yönetimi, ödev takibi ve e-Okul listeleri parmaklarınızın ucunda.',
    category: 'Öğretmen Kokpiti',
    mascotImage: '/mascot/selim-pointing.png',
    footerCallout: 'Hemen dene 👉',
    bullets: [
      { icon: '📂', title: 'e-Okul Excel Entegrasyonu', desc: 'Sınıf listenizi saniyeler içinde yükleyin, tüm öğrencileri otomatik kaydedin.' },
      { icon: '🎫', title: 'Giriş Kartı & Barkod', desc: 'Şifre unutma derdine son; tek tıkla yazdırılabilir öğrenci giriş kartları.' },
      { icon: '🎡', title: 'Akıllı Tahta Katılım Çarkı', desc: 'Tahtaya rastgele öğrenci seçimi ve parmak kaldıran öğrenciye canlı XP ödülü.' }
    ],
    visualType: 'teacher'
  },
  {
    id: 9,
    badge: 'SIFIR BEKLEME • FORM VE KART YOK',
    badgeColor: 'from-amber-400 to-yellow-500',
    title: 'Kayıt Olmadan Hemen Şimdi Canlı Deneyimleyin!',
    subtitle: 'Form doldurmak, SMS kodu beklemek veya kart girmek yok.',
    category: 'Canlı Demo Deneyimi',
    mascotImage: '/mascot/selim-success.png',
    footerCallout: 'Harekete geç 👉',
    bullets: [
      { icon: '⚡', title: 'Tek Tıkla Giriş', desc: 'Doğrudan demo butonuyla tüm platformu sınırsızca keşfedin.' },
      { icon: '👨‍🏫', title: 'Öğretmen Görünümü', desc: 'Hazır doldurulmuş rubrikler, öğrenci karneleri ve sınıf yönetim araçları.' },
      { icon: '🎒', title: 'Öğrenci Görünümü', desc: 'Hikayeyi oku, laboratuvarda deneyi yap, oyunları oyna ve puan topla.' }
    ],
    visualType: 'demo'
  },
  {
    id: 10,
    badge: 'GELECEĞİN AKILLI SINIFI BURADA',
    badgeColor: 'from-teal-300 via-emerald-400 to-amber-300',
    title: 'Sınıfınızda Eğitimin Geleceğini Bugün Başlatın!',
    subtitle: 'Yeni Maarif Modeli ile matematiği sevdiren yolculuğa siz de katılın.',
    category: 'Harekete Geçirici Çağrı (CTA)',
    mascotImage: '/mascot/selim-farewell.png',
    footerCallout: 'Takipte kalın! ❤️',
    bullets: [
      { icon: '🔗', title: 'Profildeki Linke Tıklayın', desc: 'Platformu canlı olarak hemen tarayıcınızda test edin.' },
      { icon: '💬', title: 'Yoruma "MAARİF" Yazın', desc: 'Demo giriş bağlantısını ve öğretmen rehberini DM ile anında yollayalım.' },
      { icon: '📌', title: 'Kaydet & Paylaş', desc: 'Zümre arkadaşlarınızla paylaşmayı ve daha sonra incelemek için kaydetmeyi unutmayın!' }
    ],
    visualType: 'cta'
  }
];

export const INSTAGRAM_CAPTION_TEXT = `Matematik dersinde öğrencilerin gözlerindeki o merak ışığını yeniden yakalamak mümkün mü? 💡📐

MEB Türkiye Yüzyılı Maarif Modeli ile birlikte matematik eğitimi artık "formül ezberleten" değil; "bağlam kuran, keşfettiren ve üreten" bir yapıya büründü.

Biz de MAARİF AKADEMİ'yi öğretmenlerimizin sınıfta akıllı tahtada açıp öğrencileriyle birlikte nefes kesen bir matematik macerasına çıkabilmeleri için tasarladık:

🔹 1. Görsel Hikâyeler: Selimiye’nin kubbesinden Palandöken’in kutup soğuğuna gerçek yaşam bağlamları
🔹 2. Sanal Laboratuvar: Rasyonel terazi, açıölçer ve sonsuz nokta mikroskop simülasyonları
🔹 3. Oyunlar Arenası: Akıllı tahtaya tam uyumlu, sınıfı coşturan rekabetçi oyunlar
🔹 4. Süreç Rubriği: Not odaklı değil, beceri odaklı 4 düzeyli Maarif değerlendirme ölçeği
🔹 Çift Yüzlü Çalışma Yaprakları: 1 tıkla A4 PDF çıktı alabileceğiniz ön/arka yüz fotokopi şablonları

🚀 Kayıt olmadan, anında denemek ister misiniz?
Profilimizdeki linke tıklayarak "Canlı Demo" butonuna basabilir; ister Öğretmen ister Öğrenci gözüyle platformu saniyeler içinde test edebilirsiniz!

👇 Siz sınıfınızda en çok hangi aşamayı (Hikaye / Laboratuvar / Oyun / Rubrik) kullanmak isterdiniz? Yorumlarda buluşalım!

---
#matematik #maarifmodeli #türkiyeyüzyılımaarifmodeli #öğretmenler #matematiköğretmeni #ortaokulmatematik #akıllıtahta #eğitimdeiyiornekler #eğitimteknolojileri #dersmateryali #yenimüfredat #7sınıfmatematik #5sınıfmatematik #etkinlikkağıdı #maarifakademi #öğretmenpaylaşımı #akıllısınıf #stemturkiye #matematiketkinliği`;

export function InstagramPromoStudio() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'studio' | 'grid' | 'caption'>('studio');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentSlide = PROMO_SLIDES[currentSlideIndex];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % PROMO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(INSTAGRAM_CAPTION_TEXT);
    setCopiedCaption(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 }
    });
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const handleExportPNG = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // 2x for sharp retina output (1080x1350 equivalent)
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0f172a',
        onclone: (clonedDoc) => {
          const badgeText = clonedDoc.querySelector('[data-promo-badge-text]') as HTMLElement | null;
          if (badgeText) {
            badgeText.style.position = 'relative';
            badgeText.style.top = '-2px';
          }
        }
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `maarifakademi-instagram-slayt-${currentSlide.id.toString().padStart(2, '0')}.png`;
      link.click();

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error('Slayt dışa aktarılırken hata oluştu:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. HEADER & TOP BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl">

        <div className="absolute right-1/4 -bottom-12 w-64 h-64 bg-[radial-gradient(circle,rgba(16,185,129,0.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Sosyal Medya & Tanıtım Stüdyosu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Instagram Tanıtım Gönderi Kiti <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-amber-300">
                10 Slaytlık Kaydırmalı Seri (4:5 Formatı)
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Platformun görsel kimliğine tam uyumlu, öğretmenleri ilk saniyede yakalayan 1080×1350 px Instagram kartları. Slaytları canlı inceleyin, dilediğinizi tek tıkla yüksek çözünürlükte PNG olarak indirin.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopyCaption}
              className="px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {copiedCaption ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCaption ? 'Metin Kopyalandı!' : 'Instagram Metnini Kopyala'}</span>
            </button>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ana Sayfaya Dön</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Slayt Stüdyosu (Canlı Önizleme)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grid')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'grid'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Tüm Slaytlar Galerisi ({PROMO_SLIDES.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('caption')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'caption'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Gönderi Metni & Hashtag Kiti</span>
          </button>
        </div>
      </div>

      {/* 2. TAB: STUDIO VIEW (INTERACTIVE CAROUSEL & DOWNLOAD) */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive 4:5 Instagram Slide Preview */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Aspect Ratio 4:5 Instagram Container */}
            <div className="w-full max-w-[480px] shadow-2xl rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-950">
              
              {/* THE EXPORTABLE SLIDE CANVAS (1080x1350 scaled) */}
              <div
                ref={cardRef}
                className="relative w-full aspect-[4/5] bg-gradient-to-b from-slate-900 via-teal-950 to-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between overflow-hidden select-none"
              >
                {/* Decorative background ambient glows */}

                
                <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

                {/* SLIDE TOP BAR: Brand Logo + Badge + Counter */}
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md border border-amber-500/40 bg-slate-950">
                        <Image
                          src="/logo-192.png"
                          alt="Maarif Akademi Logo"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-xs font-black tracking-wider uppercase text-white leading-none">
                            maarifakademi.com.tr
                          </span>
                          <span className="text-[10px] font-bold text-teal-400 leading-none mt-0.5">
                            MAARİF AKADEMİ
                          </span>
                        </div>
                    </div>


                  </div>

                  {/* Outcome / Feature Badge */}
                  <div className="inline-flex items-center">
                    <span
                      data-promo-badge="true"
                      className={`inline-flex items-center justify-center px-3.5 h-6 rounded-full text-[10px] font-black uppercase tracking-wider leading-none bg-gradient-to-r ${currentSlide.badgeColor} text-slate-950 shadow-sm`}
                    >
                      <span data-promo-badge-text="true" className="inline-block leading-none">
                        {currentSlide.badge}
                      </span>
                    </span>
                  </div>
                </div>

                {/* SLIDE MIDDLE: Dynamic Visual Illustration / Mockup */}
                <div className="relative z-10 my-auto py-3 space-y-4">
                  
                  {/* Title & Subtitle */}
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug whitespace-pre-line">
                      {currentSlide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                      {currentSlide.subtitle}
                    </p>
                  </div>

                  {/* Visual Stage Component according to slide type */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md shadow-inner space-y-3">
                    {currentSlide.bullets.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-sm shrink-0 shadow-xs">
                          {b.icon}
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="text-xs font-bold text-teal-200 leading-tight">
                            {b.title}
                          </h3>
                          <p className="text-[11px] text-slate-300 leading-tight">
                            {b.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SLIDE BOTTOM BAR: Mascot / Logo + Callout Indicator */}
<div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-center">
  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
    <Instagram className="inline-block w-4 h-4 mr-1" /> @maarifakademi.com.tr <Globe className="inline-block w-4 h-4 ml-1 mr-1" /> maarifakademi.com.tr
  </span>
</div>
              </div>
            </div>

            {/* Carousel Navigation & Download Controls */}
            <div className="w-full max-w-[480px] mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer border border-slate-700"
                title="Önceki Slayt (Sol Ok)"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Slide Counter Dots */}
              <div className="flex items-center gap-1.5 overflow-x-auto px-2">
                {PROMO_SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentSlideIndex
                        ? 'w-7 bg-teal-400'
                        : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`${s.id}. Slayt`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer border border-slate-700"
                title="Sonraki Slayt (Sağ Ok)"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Export PNG Button */}
            <div className="w-full max-w-[480px] mt-3">
              <button
                type="button"
                onClick={handleExportPNG}
                disabled={isExporting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>
                  {isExporting ? 'Görsel Hazırlanıyor...' : `Bu Slaytı İndir (${currentSlide.id}/10 PNG)`}
                </span>
              </button>
              <p className="text-[11px] text-center text-slate-500 mt-2">
                * Instagram 4:5 (1080×1350 px) oranında net ve yüksek çözünürlükte kaydedilir.
              </p>
            </div>
          </div>

          {/* Right: Slide Information & Direct Selector */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Slide Info Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-black">
                  <span>Slayt #{currentSlide.id} • {currentSlide.category}</span>
                </div>
                <span className="text-xs text-slate-400 font-bold">1080 × 1350 px</span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 leading-snug whitespace-pre-line">
                  {currentSlide.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {currentSlide.subtitle}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Vurgulanan Özellikler:
                </h4>
                {currentSlide.bullets.map((b, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs">
                    <span className="text-base leading-none shrink-0">{b.icon}</span>
                    <div>
                      <strong className="text-slate-900 block">{b.title}</strong>
                      <span className="text-slate-600">{b.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Slide Picker (List) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Slayt Seçimi (1 - 10)
                </h4>
                <span className="text-xs text-teal-600 font-bold">Tek tıkla geçiş</span>
              </div>

              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {PROMO_SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      idx === currentSlideIndex
                        ? 'bg-teal-600 text-white font-black shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                        idx === currentSlideIndex ? 'bg-white text-teal-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {s.id}
                      </span>
                      <span className="truncate">{s.title}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${idx === currentSlideIndex ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Highlights Link */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-md flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-black text-teal-300">Canlı Ders Deneyimi</div>
                <div className="text-xs text-slate-300">Bu slaytlarda anlatılan 4 aşamalı akışı hemen test edin.</div>
              </div>
              <Link
                href="/lesson/MAT.5.3.1"
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shrink-0 cursor-pointer"
              >
                <span>Derse Git ➔</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: GRID VIEW (ALL 10 SLIDES AT A GLANCE) */}
      {activeTab === 'grid' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">10 Slaytlık Seri Genel Görünümü</h2>
              <p className="text-xs text-slate-500">Instagram kaydırmalı (carousel) gönderisinde sıralanış akışı.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {PROMO_SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  setActiveTab('studio');
                }}
                className={`group cursor-pointer rounded-2xl p-4 bg-gradient-to-b from-slate-900 via-teal-950 to-slate-950 text-white border transition-all duration-200 flex flex-col justify-between aspect-[4/5] hover:shadow-xl hover:scale-[1.02] ${
                  idx === currentSlideIndex
                    ? 'border-teal-400 ring-2 ring-teal-400/50'
                    : 'border-slate-800 hover:border-teal-500/50'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Slayt #{slide.id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {slide.category}
                    </span>
                  </div>

                  <h3 className="text-xs font-black text-white line-clamp-3 leading-snug group-hover:text-teal-300 transition-colors">
                    {slide.title}
                  </h3>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="text-[10px] text-slate-300 line-clamp-2">
                    {slide.subtitle}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-teal-400 font-black">
                    <span>İncele / İndir</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB: CAPTION & HASHTAG KIT */}
      {activeTab === 'caption' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-900">Instagram Gönderi Açıklaması & Hashtag Listesi</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Gönderiyi paylaşırken doğrudan kullanabileceğiniz, yüksek etkileşim için kurgulanmış profesyonel metin.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyCaption}
              className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {copiedCaption ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCaption ? 'Tüm Metin Kopyalandı!' : 'Metni Tek Tıkla Kopyala'}</span>
            </button>
          </div>

          <div className="relative">
            <pre className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-slate-200 text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-wrap border border-slate-800 shadow-inner">
              {INSTAGRAM_CAPTION_TEXT}
            </pre>
          </div>

          {/* Social Media Tips Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 space-y-1">
              <div className="font-black text-xs flex items-center gap-1.5 text-teal-900">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>En İyi Paylaşım Saatleri</span>
              </div>
              <p className="text-[11px] text-teal-800 leading-relaxed">
                Öğretmen ve eğitim camiası için en yüksek etkileşim saatleri: Hafta içi <strong>17:30 - 20:30</strong> ve Pazar <strong>19:00 - 22:00</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
              <div className="font-black text-xs flex items-center gap-1.5 text-amber-900">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Kaydetme & DM Kancası</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                "Yoruma MAARİF yazana demo linki atıyoruz" kurgusu algoritmanın gönderiyi Keşfet'e düşürme şansını 4 kat artırır.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
              <div className="font-black text-xs flex items-center gap-1.5 text-emerald-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Görsel Formatı</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Görselleri <strong>1080×1350 px (4:5)</strong> olarak paylaşınız. Bu format telefonda tüm ekranı kaplar ve parmak kaydırmayı durdurur.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
