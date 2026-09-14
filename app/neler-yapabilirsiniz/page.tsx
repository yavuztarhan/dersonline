'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuth } from '@/lib/auth-store';
import { useDemoMode } from '@/lib/demo-mode-store';
import { AuthModal } from '@/components/auth/auth-modal';
import { IntroVideoModal } from '@/components/landing/intro-video-modal';
import {
  Sparkles,
  Play,
  ArrowRight,
  CheckCircle2,
  Tv,
  GraduationCap,
  Users,
  Gamepad2,
  FileText,
  QrCode,
  Award,
  Layers,
  BarChart3,
  ShieldCheck,
  Compass,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  School,
  Flame,
  MousePointerClick,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';

type RoleCategory = 'all' | 'teacher' | 'student' | 'admin' | 'board';

interface FeatureCardProps {
  category: 'teacher' | 'student' | 'admin' | 'board';
  badge: string;
  badgeColor: string;
  icon: string;
  title: string;
  tagline: string;
  whatIsIt: string;
  howToUse: string[];
  whyItMatters: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
}

export default function NelerYapabilirsinizPage() {
  const router = useRouter();
  const { playSound } = useApp();
  const { currentUser } = useAuth();
  const { isDemoMode, startTeacherDemo } = useDemoMode();

  const [activeTab, setActiveTab] = useState<RoleCategory>('all');
  const [introVideoOpen, setIntroVideoOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'student' | 'login' | 'register'>('login');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleOpenLogin = () => {
    playSound('click');
    setAuthModalTab('login');
    setAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    playSound('click');
    setAuthModalTab('register');
    setAuthModalOpen(true);
  };

  const handleOpenStudentLogin = () => {
    playSound('click');
    setAuthModalTab('student');
    setAuthModalOpen(true);
  };

  const handleStartDemo = () => {
    playSound('click');
    startTeacherDemo();
    router.push('/');
  };

  // Feature cards data
  const features: FeatureCardProps[] = [
    // 1. DERS AKIŞI - HİKAYE
    {
      category: 'board',
      badge: '1. Aşama • Merak Kancası',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: '📖',
      title: 'Milli Kültür & Çizgi Roman Hikâye Girişi',
      tagline: 'Mimar Sinan Selimiye\'den Gökbey Havacılığına!',
      whatIsIt: 'Klasik "Tanım: Doğru parçası şudur..." sıkıcılığını yıkan; Edirne Selimiye Camii\'nin kemerlerinden Türk havacılığının göklerine uzanan çizgi roman estetiğinde sinematik ders başlangıç senaryosu.',
      howToUse: [
        'Akıllı tahtada ders başladığında "1. Aşama: Hikâye" butonuna dokunun.',
        'Öğrencilerle birlikte Mimar Sinan\'ın şantiyesine veya uzay üssüne konuk olun.',
        'Hikâye sonundaki interaktif merak sorusunu sınıfa yönelterek tartışmayı ateşleyin.'
      ],
      whyItMatters: '"Hocam bu matematik gerçek hayatta ne işimize yarayacak?" sorusunu ilk 10 saniyede tarihe gömer. Öğrencinin dikkatini mıknatıs gibi çeker ve merak duygusunu zirveye taşır.',
      actionText: 'Ders Odasını Keşfet',
      onAction: handleOpenLogin
    },

    // 2. DERS AKIŞI - ATÖLYE & LABORATUVAR
    {
      category: 'board',
      badge: '2. Aşama • Somutlaştırma',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      icon: '📐',
      title: 'Dokunmatik Geometri Atölyesi & Sanal Cetvel-Pergel',
      tagline: 'Soyut matematiğe parmak uçlarıyla dokunun!',
      whatIsIt: 'Akıllı tahtanın 4K dokunmatik ekranı için sıfırdan geliştirilen; parmakla açılan pergel, milimetrik dönebilen cetvel, dinamik açıölçer ve Selimiye kubbe kemer çizim laboratuvarı.',
      howToUse: [
        'Tahtaya bir öğrenci davet edin (Kura çarkıyla seçebilirsiniz!).',
        'Öğrenci parmağıyla pergelin ayağını açsın, cetvelle doğru parçasını ölçsün.',
        'Eş doğru parçalarını ve paralel doğruları tahtada sürükleyerek anında test etsin.'
      ],
      whyItMatters: 'Ezberi bitirir, "yaparak ve yaşayarak öğrenme" modelini sınıfta %100 hayata geçirir. Öğrencinin soyut kavramları zihninde görselleştirmesini ve kalıcı kılmasını sağlar.',
      actionText: 'Atölyeyi İncele',
      onAction: handleOpenLogin
    },

    // 3. DERS AKIŞI - OYUNLAŞTIRMA
    {
      category: 'student',
      badge: '3. Aşama • Eğlenceli Pekiştirme',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      icon: '🎮',
      title: '70+ Kazanım Odaklı Zeka & Refleks Oyunu',
      tagline: 'Oyun salonu değil, müfredatla kurgulanmış öğrenme arenası!',
      whatIsIt: 'MAT 5.1\'den MAT 7.3\'e kadar her kazanıma özel tasarlanmış 3D hafıza kartları, çengel bulmaca, kelime avı, hız labirenti, hedef tahtası ve kura çarkı.',
      howToUse: [
        'Dersin pekiştirme bölümünde veya serbest etkinlik saatinde "Oyunlar" sekmesine geçin.',
        'Sınıfı kızlar-erkekler veya gruplar halinde 2 takıma ayırarak tahtada yarışma başlatın.',
        'Öğrenciler evden kendi telefon veya tabletleriyle de bu oyunları oynayarak tekrar yapabilir.'
      ],
      whyItMatters: 'Ders stresini yok eder, sınıf içi katılımı %100\'e çıkarır. Öğrenciler farkında bile olmadan onlarca soru çözer, geometrik terimleri hafızasına kazır.',
      actionText: 'Oyunlar Sayfasına Git',
      actionHref: '/games'
    },

    // 4. DERS AKIŞI - DEĞERLENDİRME & YANSITMA
    {
      category: 'teacher',
      badge: '4. Aşama • Süreç Odaklı Ölçme',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      icon: '📝',
      title: 'MEB Uyumlu Anlık Değerlendirme & Akran Formu',
      tagline: 'Not korkusu yok, gelişim ve anlık geri bildirim var!',
      whatIsIt: 'Türkiye Yüzyılı Maarif Modeli standartlarında; çoktan seçmeli anlık kavrama soruları, 3 yıldızlı akran değerlendirme ve öğrencinin kendi duygusunu yazdığı SDB1.3 öğrenme günlüğü.',
      howToUse: [
        'Dersin son 5 dakikasında tahtada anlık mini testi açın veya öğrenci panellerine gönderin.',
        'Öğrenciler tahtada veya telefonlarında soruları yanıtlasın.',
        'Öğretmen panelinde sınıfın kavrama oranı ve analitik grafiği saniyeler içinde oluşsun.'
      ],
      whyItMatters: 'Öğretmene "Sınıfım bugün ne kadar anladı?" sorusunun net cevabını verir. Eksik kalan noktaları bir sonraki derse taşımadan anında tespit etmenizi sağlar.',
      actionText: 'Öğretmen Girişi',
      onAction: handleOpenLogin
    },

    // 5. ÖĞRETMEN SÜPER GÜCÜ: DERS PLANI PDF
    {
      category: 'teacher',
      badge: 'Öğretmen Asistanı • Zamandan %100 Tasarruf',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: '📄',
      title: 'Tek Tıkla Resmi MEB Maarif Modeli Günlük Ders Planı (PDF)',
      tagline: 'Saatler süren plan hazırlama zahmetine elveda deyin!',
      whatIsIt: 'Milli Eğitim Bakanlığı müfettiş ve okul müdürlüğü formatına tam uyumlu; kazanım kodları, SDB sosyal-duygusal becerileri, öğretim yöntemleri ve ders aşamalarını içeren A4 baskıya hazır resmi plan.',
      howToUse: [
        'İlgili dersin sayfasına girin.',
        'Sağ üst köşedeki "Ders Planı (PDF)" butonuna tıklayın.',
        'Saniyeler içinde resmi formatta hazırlanan A4 belgenizi indirin veya doğrudan yazdırın.'
      ],
      whyItMatters: 'Öğretmenlerimizi akşamları ve hafta sonları saatlerce plan yazma kırtasiyeciliğinden kurtarır. Haftada en az 3 saat serbest zaman kazandırır!',
      actionText: 'Demo ile İncele',
      onAction: handleStartDemo
    },

    // 6. ÖĞRETMEN SÜPER GÜCÜ: ŞİFRESİZ TAHTA GİRİŞİ
    {
      category: 'teacher',
      badge: 'Akıllı Tahta Güvenliği • Şifresiz Erişim',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      icon: '📱',
      title: 'QR Kod & 4 Haneli PIN ile Anında Akıllı Tahta Girişi',
      tagline: 'Tahta başında öğrencilerin önünde klavye açıp şifre girmeye son!',
      whatIsIt: 'Öğretmenin akıllı tahta önünde şifresini ifşa etmesini engelleyen, mobil cihazdan QR kod taratarak veya ekrandaki 4 haneli PIN ile 3 saniyede oturum açan teknoloji.',
      howToUse: [
        'Sınıftaki akıllı tahtada siteyi açıp "Tahta Girişi" butonuna dokunun.',
        'Ekranda tek kullanımlık bir QR kod ve 4 haneli PIN belirir.',
        'Telefonunuzun kamerasıyla QR kodu okutun veya öğretmen panelinizden PIN\'i onaylayın. Tahta anında sizin adınıza açılır!'
      ],
      whyItMatters: 'Şifrenizin öğrenciler tarafından görülme riskini sıfırlar. Teneffüsten derse geçerken 1 saniye bile kaybetmeden sınıfı derse odaklar.',
      actionText: 'Hemen Başla',
      onAction: handleOpenLogin
    },

    // 7. ÖĞRETMEN SÜPER GÜCÜ: E-OKUL EXCEL AKTARIM
    {
      category: 'teacher',
      badge: 'Otomasyon • 2 Saniyede Sınıf Kurulumu',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      icon: '📊',
      title: 'e-Okul Excel Listesi Tek Tıkla Aktarım',
      tagline: '35 öğrenciyi tek tek yazmak yok, sürükle-bırak var!',
      whatIsIt: 'e-Okul sisteminden indirdiğiniz resmi sınıf listesi Excel dosyasını otomatik olarak ayrıştıran ve öğrenci hesaplarını şifresiz giriş için hazır hale getiren akıllı yükleyici.',
      howToUse: [
        'e-Okul\'dan sınıf listenizi (.xlsx / .xls) indirin.',
        'Öğretmen panelinizde "Sınıf Yönetimi ➔ Excel Yükle" alanına dosyayı sürükleyip bırakın.',
        'Öğrenci numaraları, adları ve şubeleri saniyeler içinde sisteme tanımlansın.'
      ],
      whyItMatters: 'Yeni eğitim-öğretim yılı başında veya nakil gelen öğrencilerde saatlerce veri girişi yapma çilesini yok eder.',
      actionText: 'Öğretmen Kaydı',
      onAction: handleOpenRegister
    },

    // 8. TAHTA ARAÇLARI: KURA ÇARKI & TAHTA KALEMİ
    {
      category: 'board',
      badge: 'Sınıf Hakimiyeti • Canlı Araçlar',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      icon: '🎡',
      title: 'Öğrenci Seçim Kura Çarkı & Şeffaf Tahta Kalemi',
      tagline: 'Adil kura heyecanı ve ekranın üzerine dilediğin gibi çizim özgürlüğü!',
      whatIsIt: 'Sınıftaki tüm öğrencileri eğlenceli ve adil bir animasyonla tahtaya kaldıran ses efektli kura çarkı ve sunumdan çıkmadan ekranın her yerine not alabileceğiniz dijital tahta kalemi katmanı.',
      howToUse: [
        'Tahta araç çubuğundaki çarka dokunun; çark dönsün ve tahtaya kalkacak şanslı öğrenciyi alkışlarla seçsin.',
        'Kalem simgesine dokunun; renk ve kalınlık seçerek dersin ya da oyunun üzerine serbestçe çizim yapın.'
      ],
      whyItMatters: '"Hocam hep aynı kişileri kaldırıyorsunuz!" itirazlarını tamamen bitirir. Sınıftaki tüm öğrencileri tetikte ve heyecanlı tutar.',
      actionText: 'Demo Modunda Dene',
      onAction: handleStartDemo
    },

    // 9. ÖĞRENCİ DÜNYASI: ŞİFRESİZ GİRİŞ & XP ROZETLER
    {
      category: 'student',
      badge: 'Öğrenci Masası • Çocuk Dostu Arayüz',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: '🏆',
      title: 'Şifresiz Kolay Giriş, XP Puanları ve Maarif Rozetleri',
      tagline: 'Şifre unutma derdine son, başarı rozetleriyle zirveye koş!',
      whatIsIt: 'Öğrencilerin e-posta ve karmaşık şifrelerle uğraşmadan, sadece sınıf kodu (örn: 5-A) ve okul numarasıyla girdikleri; çözdükçe XP ve Maarif rozetleri kazandıkları motivasyon sistemi.',
      howToUse: [
        'Ana sayfada "Öğrenci Girişi"ne dokunun.',
        'Sınıfınızı seçin ve okul numaranızı yazın.',
        'Dersleri tamamlayın, bulmacaları çözün; profilinizde parlayan rozetleri toplayın!'
      ],
      whyItMatters: '"Şifremi unuttum" krizlerini kökten çözer. Çocuklara bilgisayar oyunu oynar gibi ders çalıştırma ve başarı hissi aşılama gücü verir.',
      actionText: 'Öğrenci Girişi Yap',
      onAction: handleOpenStudentLogin
    },

    // 10. OKUL VE İLÇE YÖNETİMİ: 81 İL AĞI VE SIFIR MALİYET
    {
      category: 'admin',
      badge: 'Yöneticiler İçin • 81 İl Ağı',
      badgeColor: 'bg-slate-100 text-slate-900 border-slate-300',
      icon: '🏛️',
      title: 'Sıfır Ek Maliyet & Tüm Akıllı Tahtalarla %100 Uyum',
      tagline: 'Pardus, Windows, Tablet... Ek donanım yok, kurulum yok!',
      whatIsIt: 'Türkiye genelindeki tüm Fatih Projesi Faz 1, Faz 2 ve Faz 3 akıllı tahtalarda internet tarayıcısı üzerinden anında çalışan; sıfır sunucu ve sıfır lisans maliyetli bulut mimarisi.',
      howToUse: [
        'Akıllı tahtanın tarayıcısını (Chrome, Edge veya Pardus Chromium) açın.',
        'Adrese girin ve dersi başlatın. Hiçbir .exe, .deb veya sürücü kurmanıza gerek yoktur.',
        'Okul yöneticileri panelden şube ve öğretmen süreç raporlarını tek ekranda görebilir.'
      ],
      whyItMatters: 'Okul bütçelerine tek kuruş masraf çıkarmaz, BT formatör öğretmenlerine ve teknisyenlere kurulum iş yükü yüklemez.',
      actionText: 'Tanıtım Videosunu İzle',
      onAction: () => setIntroVideoOpen(true)
    }
  ];

  // Filter cards by category
  const filteredFeatures = features.filter((feat) => {
    if (activeTab === 'all') return true;
    return feat.category === activeTab;
  });

  // FAQ items
  const faqs = [
    {
      q: 'Akıllı tahtamıza veya bilgisayarımıza herhangi bir program kurmamız gerekiyor mu?',
      a: 'Kesinlikle hayır! Maarif Akademi %100 bulut ve web tabanlıdır. MEB Fatih Projesi kapsamında dağıtılan tüm akıllı tahtalarda (Pardus, Windows, Arçelik, Vestel vb.) kurulu olan internet tarayıcısını (Chromium, Chrome, Edge) açıp adrese gitmeniz yeterlidir.'
    },
    {
      q: 'Öğretmenler için ders planı çıktısı MEB Maarif Modeli müfredatına gerçekten uygun mu?',
      a: 'Evet, %100 uyumludur. Sistemdeki tüm ders planları Türkiye Yüzyılı Maarif Modeli Matematik Dersi Öğretim Programı\'na göre hazırlanmıştır. Kazanım kodları (örn: MAT.5.3.1), alan becerileri, kavramsal beceriler, SDB (Sosyal Duygusal Beceriler), araç-gereçler ve ölçme-değerlendirme adımları resmi formata eksiksiz yansıtılır.'
    },
    {
      q: 'Öğrenciler ders dışında evden de erişebilir mi?',
      a: 'Evet! Öğrencilerimiz okul dışındayken de evlerindeki bilgisayar, tablet veya cep telefonlarından "Öğrenci Girişi" yaparak sınıf kodu ve okul numaralarıyla sisteme girebilir, geometri atölyesinde çizim yapabilir ve 70+ oyunu oynayarak pekiştirebilir.'
    },
    {
      q: 'Okulumuzun internet bağlantısı zayıfsa donma veya kasma yaşar mıyız?',
      a: 'Maarif Akademi, hafifletilmiş SVG vektörleri ve optimize edilmiş modern web mimarisiyle inşa edilmiştir. MEB Güvenli İnternet Ağı\'nda ve düşük kotalı bağlantılarda dahi yüksek hızda ve kesintisiz çalışacak şekilde optimize edilmiştir.'
    },
    {
      q: 'Platformu denemek için kayıt olmak zorunda mıyım?',
      a: 'Hayır, yukarıdaki "Demo Modu" butonuna veya tanıtım kartlarındaki demo butonuna tıklayarak tek tıkla öğretmen ve öğrenci panellerinin tümünü şifresiz olarak anında deneyimleyebilirsiniz!'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-6 sm:py-10 space-y-12 sm:space-y-16 animate-in fade-in duration-300">
      
      {/* 1. HERO BANNER: HIGH-IMPACT PERSUASIVE COPY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 border border-teal-800/40 p-6 sm:p-10 lg:p-14 text-white shadow-2xl">
          
          {/* Background Ambient Lights */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-black uppercase tracking-wider shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Geleceğin Akıllı Sınıfı • Özellikler & Kullanım Rehberi</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
              Sıradan Bir Akıllı Tahtayı, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-300">
                Öğrenme Şölenine
              </span>{' '}
              Dönüştürün!
            </h1>

            {/* Sub-headline with advertising flair */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
              Ders zili çaldığında tebeşir tozu ve sıkıcı slaytlar geride kaldı. 
              Mimar Sinan Selimiye'nin kubbesinden Gökbey havacılığına uzanan <strong>4 aşamalı ders akışı</strong>, 
              dokunmatik <strong>geometri laboratuvarı</strong>, <strong>70+ zeka oyunu</strong> ve <strong>tek tıkla resmi MEB ders planı</strong> ile sınıfınızda devrim yaratın.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleOpenRegister}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/30 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Öğretmen Olarak Ücretsiz Katıl</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound('select');
                  setIntroVideoOpen(true);
                }}
                className="px-5 py-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-extrabold text-sm transition-all flex items-center gap-2.5 shadow-lg active:scale-95 cursor-pointer group"
              >
                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow group-hover:scale-110 transition-transform">
                  <Play className="w-3 h-3 fill-slate-950 translate-x-0.5" />
                </span>
                <span>1 Dakikalık Tanıtımı İzle</span>
              </button>

              {!isDemoMode && (
                <button
                  type="button"
                  onClick={handleStartDemo}
                  className="px-4 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold text-sm border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Şifresiz Demo Modu</span>
                </button>
              )}
            </div>

            {/* Quick Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300 border-t border-slate-800/80">
              <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <Tv className="w-4 h-4 text-teal-400 shrink-0" />
                <span>%100 Akıllı Tahta Uyumlu</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>MEB Maarif Planı (PDF)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <QrCode className="w-4 h-4 text-amber-400 shrink-0" />
                <span>QR ile Şifresiz Tahta Girişi</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <Gamepad2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>70+ Eğitici Mantık Oyunu</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. BEFORE / AFTER COMPARISON (REKLAMCI KARŞILAŞTIRMASI) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Neden Maarif Akademi?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Eski Usul Tahta vs. Maarif Akademi Devrimi
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Sınıfınızdaki değişimi sadece 1 derste bile hissedeceksiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4">
            {/* Eski Usul */}
            <div className="rounded-2xl p-5 sm:p-6 bg-rose-50/60 border border-rose-200/80 space-y-4">
              <div className="flex items-center gap-2 text-rose-800 font-black text-base">
                <span className="text-xl">❌</span>
                <span>Geleneksel & Zorlayıcı Süreç</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-rose-950 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span><strong>Soyut ve Sıkıcı:</strong> "Nokta tanımsızdır" gibi ezber tanımlar; öğrencilerin ilgisi 5. dakikada dağılır.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span><strong>Kaybolan Araçlar:</strong> Kırılan ahşap pergeller, kayıp gönyeler ve tahtada düz çizgi çekememe stresi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span><strong>Kırtasiye Yükü:</strong> Akşamları saatlerce resmi MEB ders planı hazırlamakla vakit kaybetmek.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span><strong>Tahtada Şifre Tehlikesi:</strong> Öğrencilerin gözü önünde tahta klavyesinde e-posta ve şifre girmeye çalışmak.</span>
                </li>
              </ul>
            </div>

            {/* Maarif Akademi */}
            <div className="rounded-2xl p-5 sm:p-6 bg-teal-50/80 border-2 border-teal-400 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-teal-900 font-black text-base">
                <span className="text-xl">✨</span>
                <span>Maarif Akademi ile Yeni Nesil Sınıf</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-teal-950 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Kültürel Merak Kancası:</strong> Selimiye kubbesi ve Türk havacılığı hikayesiyle ilk saniyeden coşkulu dikkat.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Dokunmatik Sanal Atölye:</strong> Parmakla çalışan sanal cetvel, pergel ve açıölçerle sıfır masraflı geometri laboratuvarı.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Tek Tıkla PDF Planı:</strong> MEB Maarif Modeli onaylı günlük ders planını 1 saniyede indirme özgürlüğü.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>QR Kod & PIN Güvenliği:</strong> Tahtaya şifre yazmadan cep telefonuyla 3 saniyede şifresiz oturum açma.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE ROLE CATEGORY TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-teal-600">
              Adım Adım Yetenekler
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Platformda Neler Yapabilirsiniz?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Her özelliğin <strong>Neyi</strong>, <strong>Nasıl</strong> kullanacağınızı ve <strong>Size ne kazandıracağını</strong> keşfedin.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl overflow-x-auto shrink-0 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab('all');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌟 Tümü ({features.length})
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab('board');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'board'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📺 Akıllı Tahta & Ders Akışı
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab('teacher');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'teacher'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👨‍🏫 Öğretmen Asistanı
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab('student');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎮 Öğrenci & Oyunlar
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab('admin');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏛️ Okul & Yöneticiler
            </button>
          </div>
        </div>

        {/* 4. FEATURE CARDS GRID (NEYİ, NASIL, NE İŞE YARAR) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFeatures.map((feat, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-6 group relative overflow-hidden"
            >
              {/* Card Top Pill & Icon */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${feat.badgeColor}`}>
                    {feat.badge}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-teal-700 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs font-bold text-teal-600 mt-0.5">
                  {feat.tagline}
                </p>

                {/* 3 Pillars: NEYİ, NASIL, NE İŞE YARAR */}
                <div className="mt-5 space-y-4 text-xs">
                  
                  {/* 1. Neyi Kullanacaksınız? */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <div className="font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[10.5px]">
                      <span className="text-teal-600">🎯</span>
                      <span>Neyi Kullanacaksınız?</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {feat.whatIsIt}
                    </p>
                  </div>

                  {/* 2. Nasıl Kullanılır? */}
                  <div className="bg-teal-50/50 p-3.5 rounded-2xl border border-teal-100/80 space-y-1.5">
                    <div className="font-black text-teal-950 flex items-center gap-1.5 uppercase tracking-wider text-[10.5px]">
                      <span className="text-teal-600">🚀</span>
                      <span>Nasıl Kullanılır?</span>
                    </div>
                    <ul className="space-y-1 text-slate-700 font-medium">
                      {feat.howToUse.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="font-bold text-teal-600 shrink-0">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 3. Ne İşe Yarar / Size Ne Kazandırır? */}
                  <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 space-y-1">
                    <div className="font-black text-amber-950 flex items-center gap-1.5 uppercase tracking-wider text-[10.5px]">
                      <span className="text-amber-600">💎</span>
                      <span>Ne İşe Yarar? (Katma Değeri)</span>
                    </div>
                    <p className="text-amber-900 leading-relaxed font-medium">
                      {feat.whyItMatters}
                    </p>
                  </div>

                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">
                  Türkiye Yüzyılı Maarif Modeli
                </span>

                {feat.actionHref ? (
                  <Link
                    href={feat.actionHref}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer group-hover:bg-teal-600"
                  >
                    <span>{feat.actionText || 'İncele'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                ) : feat.onAction ? (
                  <button
                    type="button"
                    onClick={feat.onAction}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer group-hover:bg-teal-600 active:scale-95"
                  >
                    <span>{feat.actionText || 'Dene'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* 5. 4 FAZLI DERS AKIŞI GÖRSEL ZAMAN TÜNELİ (YOL HARİTASI) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white space-y-8 shadow-xl border border-teal-800/40">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-teal-400 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-400/30">
              Pedagojik İskelet
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              40 Dakikalık Dersin Kusursuz Akışı
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Öğretmenin ders temposunu hiç düşürmeyen, öğrenciyi pasif dinleyicilikten aktif üreticiye dönüştüren 4 halkalı zincir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Adım 1 */}
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 font-black text-base flex items-center justify-center">
                01
              </div>
              <h4 className="font-black text-base text-white">Hikâye & Merak</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                İlk 5-8 dakika. Mimar Sinan ve Selimiye Camii hikayesiyle merak uyandırılır. Çocuk "Bu ders benim hayatımda nerede var?" sorusunu kavrar.
              </p>
              <div className="text-[11px] font-bold text-amber-300">⏱️ Süre: 5 - 8 Dk</div>
            </div>

            {/* Adım 2 */}
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300 font-black text-base flex items-center justify-center">
                02
              </div>
              <h4 className="font-black text-base text-white">Sanal Atölye</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                15-20 dakika. Tahtada sanal gönye, cetvel ve pergel ile öğrenciler somut çizimler yapar, kemerleri oluşturur, kavramı yaşar.
              </p>
              <div className="text-[11px] font-bold text-teal-300">⏱️ Süre: 15 - 20 Dk</div>
            </div>

            {/* Adım 3 */}
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-black text-base flex items-center justify-center">
                03
              </div>
              <h4 className="font-black text-base text-white">Oyun & Refleks</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                8-10 dakika. Sınıf içi kura çarkıyla takımlar yarışır; 3D hafıza kartları ve bulmacalarla kavramlar yüksek enerjiyle pekişir.
              </p>
              <div className="text-[11px] font-bold text-indigo-300">⏱️ Süre: 8 - 10 Dk</div>
            </div>

            {/* Adım 4 */}
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-300 font-black text-base flex items-center justify-center">
                04
              </div>
              <h4 className="font-black text-base text-white">Ölçme & Günlük</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Son 5 dakika. MEB formatında mini kavrama testi, akran puanlaması ve dijital öğrenme günlüğüyle süreç raporlanır.
              </p>
              <div className="text-[11px] font-bold text-rose-300">⏱️ Süre: 5 Dk</div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FAQ (SIKÇA SORULAN SORULAR) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Aklınızdaki Sorular
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Öğretmenlerimizin ve yöneticilerimizin en çok merak ettiği konuları yanıtladık.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setOpenFaqIndex(isOpen ? null : index);
                  }}
                  className="w-full p-4 sm:p-5 text-left font-black text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-teal-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Sınıfınızda Yeni Nesil Bir Matematik Deneyimi Başlatın!
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed font-normal">
              Türkiye Yüzyılı Maarif Modeli ile derslerinizi akıllı tahtada görsel bir şölene dönüştürün. 
              Öğretmen hesabı oluşturmak tamamen ücretsizdir ve 30 saniye sürer.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleOpenRegister}
                className="px-6 py-3.5 rounded-2xl bg-white text-teal-950 hover:bg-teal-50 font-black text-xs sm:text-sm shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                Hemen Öğretmen Olarak Kaydol
              </button>

              <button
                type="button"
                onClick={handleOpenStudentLogin}
                className="px-5 py-3.5 rounded-2xl bg-teal-900/60 hover:bg-teal-900 text-teal-200 font-bold text-xs sm:text-sm border border-teal-400/30 transition-all cursor-pointer"
              >
                Öğrenci Girişi Yap
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound('select');
                  setIntroVideoOpen(true);
                }}
                className="px-4 py-3.5 rounded-2xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-extrabold text-xs sm:text-sm border border-amber-400/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-amber-300" />
                <span>Tanıtımı İzle</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />

      {/* Intro Video Modal */}
      <IntroVideoModal
        isOpen={introVideoOpen}
        onClose={() => setIntroVideoOpen(false)}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
      />

    </div>
  );
}
