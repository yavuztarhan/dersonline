'use client';

import React, { useState } from 'react';
import { PuzzlePhaseData, PuzzleItem } from '@/types';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import { WordSearchGame } from '@/components/lesson-phases/word-search-game';
import { TrueFalseGame } from '@/components/lesson-phases/true-false-game';
import { AngleRadarGame } from '@/components/lesson-phases/angle-radar-game';
import { ConstructionDeductionGame } from '@/components/lesson-phases/construction-deduction-game';
import { JunctionArchitectGame } from '@/components/lesson-phases/junction-architect-game';
import { MemoryCardsGame } from '@/components/lesson-phases/memory-cards-game';
import { KolilemeFactoryGame } from '@/components/lesson-phases/kolileme-factory-game';
import { FrogJumpGame } from '@/components/lesson-phases/frog-jump-game';
import { RainbowVaultGame } from '@/components/lesson-phases/rainbow-vault-game';
import {
  SetSortingGame,
  RationalParachuteGame,
  ZeroBalanceCenterGame
} from '@/components/lesson-phases/mat7-games';
import { BoardStudentWidget } from '@/components/board/board-student-widget';
import { useAuth } from '@/lib/auth-store';
import {
  getStoredActiveBoardStudent,
  clearActiveBoardStudent,
  saveBoardParticipation
} from '@/lib/board-participation-store';
import {
  Puzzle,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Search,
  Zap,
  Gamepad2,
  ChevronRight,
  Play,
  Crosshair,
  Compass,
  Layers,
  Package,
  Activity
} from 'lucide-react';

interface PuzzlePhaseProps {
  data: PuzzlePhaseData;
  onNextPhase: () => void;
}

interface MatchCard {
  id: string;
  itemId: string;
  type: 'concept' | 'symbol' | 'definition';
  text: string;
  subtext?: string;
  matched: boolean;
}

export type PuzzleGameId = 
  | 'setsorting'
  | 'rationalparachute'
  | 'zerobalance'
  | 'kolilemefactory'
  | 'frogjump'
  | 'rainbowvault'
  | 'memorycards'
  | 'junctiongame'
  | 'radargame'
  | 'constructiongame'
  | 'matching'
  | 'wordsearch'
  | 'truefalse';

export function PuzzlePhase({ data, onNextPhase }: PuzzlePhaseProps) {
  const { playSound, unlockBadge, addPoints, role, selectedOutcome } = useApp();
  const { currentUser, awardPointsToStudent } = useAuth();

  // null means showing the cards menu only
  const [selectedGameId, setSelectedGameId] = useState<PuzzleGameId | null>(null);

  // Matching game states
  const [conceptCards, setConceptCards] = useState<MatchCard[]>([]);
  const [targetCards, setTargetCards] = useState<MatchCard[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<MatchCard | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<MatchCard | null>(null);
  const [wrongPair, setWrongPair] = useState<string[]>([]);
  const [isMatchingCompleted, setIsMatchingCompleted] = useState(false);

  // Initialize matching game on mount or data change
  React.useEffect(() => {
    initMatchingGame();
  }, [data]);

  const initMatchingGame = () => {
    const concepts: MatchCard[] = data.items.map((item) => ({
      id: `concept-${item.id}`,
      itemId: item.id,
      type: 'concept',
      text: item.concept,
      subtext: `Geometrik Model: ${item.visualType.toUpperCase()}`,
      matched: false,
    }));

    const targets: MatchCard[] = data.items.map((item) => ({
      id: `target-${item.id}`,
      itemId: item.id,
      type: 'symbol',
      text: item.symbol,
      subtext: item.definition,
      matched: false,
    }));

    const shuffledTargets = [...targets].sort(() => Math.random() - 0.5);

    setConceptCards(concepts);
    setTargetCards(shuffledTargets);
    setSelectedConcept(null);
    setSelectedTarget(null);
    setWrongPair([]);
    setIsMatchingCompleted(false);
  };

  const handleConceptClick = (card: MatchCard) => {
    if (card.matched) return;
    playSound('select');
    setSelectedConcept(card);
    setWrongPair([]);

    if (selectedTarget) {
      checkMatch(card, selectedTarget);
    }
  };

  const handleTargetClick = (card: MatchCard) => {
    if (card.matched) return;
    playSound('select');
    setSelectedTarget(card);
    setWrongPair([]);

    if (selectedConcept) {
      checkMatch(selectedConcept, card);
    }
  };

  const checkMatch = (concept: MatchCard, target: MatchCard) => {
    if (concept.itemId === target.itemId) {
      // Correct match!
      playSound('success');
      const updatedConcepts = conceptCards.map((c) =>
        c.id === concept.id ? { ...c, matched: true } : c
      );
      const updatedTargets = targetCards.map((t) =>
        t.id === target.id ? { ...t, matched: true } : t
      );

      setConceptCards(updatedConcepts);
      setTargetCards(updatedTargets);
      setSelectedConcept(null);
      setSelectedTarget(null);
      addPoints(15);

      const allMatched = updatedConcepts.every((c) => c.matched);
      if (allMatched) {
        setIsMatchingCompleted(true);
        unlockBadge('puzzle-pro');
        addPoints(50);

        const activeBoardStu = getStoredActiveBoardStudent();
        if (activeBoardStu) {
          awardPointsToStudent(activeBoardStu.id, 65);
          saveBoardParticipation({
            studentId: activeBoardStu.id,
            studentName: activeBoardStu.name,
            studentNumber: activeBoardStu.studentNumber,
            classSection: activeBoardStu.classSection,
            school: activeBoardStu.school,
            teacherId: currentUser?.id,
            teacherName: currentUser?.name,
            activityType: 'game',
            activityTitle: 'Kavram Eşleştirme Bulmacası',
            outcomeCode: selectedOutcome?.code || 'MAT',
            score: 100,
            maxScore: 100,
            xpEarned: 65
          });
          clearActiveBoardStudent();
        }

        try {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    } else {
      // Wrong match
      playSound('click');
      setWrongPair([concept.id, target.id]);
      setTimeout(() => {
        setSelectedConcept(null);
        setSelectedTarget(null);
        setWrongPair([]);
      }, 700);
    }
  };

  const isRationalNumbersTopic =
    selectedOutcome?.id === 'MAT.7.1.1' ||
    selectedOutcome?.code?.includes('7.1.1') ||
    data.title?.toLowerCase().includes('rasyonel');

  const isDivisibilityTopic =
    !isRationalNumbersTopic &&
    (selectedOutcome?.id === 'MAT.6.1.2' ||
    selectedOutcome?.code?.includes('6.1.2') ||
    data.title?.toLowerCase().includes('bölünebilme'));

  const isPrimeFactorsTopic =
    selectedOutcome?.id === 'MAT.6.1.3' ||
    selectedOutcome?.code?.includes('6.1.3') ||
    data.title?.toLowerCase().includes('asal');

  const isCommonTopic =
    selectedOutcome?.id === 'MAT.6.1.4' ||
    selectedOutcome?.code?.includes('6.1.4') ||
    data.title?.toLowerCase().includes('ortak bölen') ||
    data.title?.toLowerCase().includes('ortak kat');

  const isFactorsMultiplesTopic =
    !isDivisibilityTopic &&
    !isPrimeFactorsTopic &&
    !isCommonTopic &&
    (selectedOutcome?.id === 'MAT.6.1.1' ||
      selectedOutcome?.code?.includes('6.1.1') ||
      data.title?.toLowerCase().includes('çarpan') ||
      data.title?.toLowerCase().includes('katlar'));

  const isLinesAnglesTopic =
    !isDivisibilityTopic &&
    !isPrimeFactorsTopic &&
    !isCommonTopic &&
    !isFactorsMultiplesTopic &&
    (selectedOutcome?.id === 'MAT.5.3.4' || selectedOutcome?.code?.includes('5.3.4'));

  const isAngleTopic =
    !isDivisibilityTopic &&
    !isPrimeFactorsTopic &&
    !isCommonTopic &&
    !isFactorsMultiplesTopic &&
    !isLinesAnglesTopic &&
    (data.title?.toLowerCase().includes('iletki') ||
      selectedOutcome?.id === 'MAT.5.3.3' ||
      (data.title?.toLowerCase().includes('açı') && !data.title?.toLowerCase().includes('doğru')));

  const isConstructionTopic =
    !isDivisibilityTopic &&
    !isPrimeFactorsTopic &&
    !isCommonTopic &&
    !isFactorsMultiplesTopic &&
    !isLinesAnglesTopic &&
    !isAngleTopic &&
    (selectedOutcome?.id === 'MAT.5.3.2' ||
      selectedOutcome?.code?.includes('5.3.2') ||
      data.title?.toLowerCase().includes('inşa') ||
      data.title?.toLowerCase().includes('cetvel') ||
      data.title?.toLowerCase().includes('gönye') ||
      data.title?.toLowerCase().includes('pergel') ||
      data.title?.toLowerCase().includes('ray'));

  const baseGamesList: Array<{
    id: PuzzleGameId;
    title: string;
    tagline: string;
    description: string;
    icon: React.ReactNode;
    badge: string;
    gradient: string;
    reward: string;
  }> = [];

  if (isRationalNumbersTopic) {
    baseGamesList.push(
      {
        id: 'setsorting',
        title: 'Küme Ayıklama İstasyonu (N ⊂ Z ⊂ Q)',
        tagline: 'Arcade Hızlı Sınıflandırma',
        description: 'Ekrana gelen pozitif, negatif, kesirli ve tanımsız sayıları hızla analiz et, doğru sepete (N, Z, Q veya Tanımsız) yerleştir!',
        icon: <Layers className="w-8 h-8" />,
        badge: '10 Soru • Hızlı Karar',
        gradient: 'from-purple-600 via-indigo-600 to-blue-700',
        reward: '+150 XP & Küme Dedektifi'
      },
      {
        id: 'rationalparachute',
        title: 'Rasyonel Paraşütçü: Sayı Doğrusu İnişi',
        tagline: 'Hassas Koordinat & İniş',
        description: 'Verilen rasyonel enerji değerini bulmak için doğru ardışık iki tam sayıyı seç, aralığı paydaya göre dilimle ve paraşütçüyü indir!',
        icon: <Compass className="w-8 h-8" />,
        badge: '3 Görev • Hassas İniş',
        gradient: 'from-indigo-500 via-blue-600 to-sky-700',
        reward: '+150 XP & Hassas Paraşütçü'
      },
      {
        id: 'zerobalance',
        title: 'Sıfır Denge Merkezi: Mutlak Değer Kilidi',
        tagline: 'Enerji Kristalleri & Uzaklık',
        description: 'Akıllı evdeki enerji kaçaklarını mutlak değer metresiyle ölç, sıfır noktasına eşit mesafedeki zıt kristallerle dengeyi sağla!',
        icon: <Zap className="w-8 h-8" />,
        badge: '2 Kademe • Denge Kilidi',
        gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
        reward: '+120 XP & Enerji Mimarı'
      }
    );
  } else if (isDivisibilityTopic) {
    baseGamesList.push(
      {
        id: 'kolilemefactory',
        title: 'Bölünebilme Lazer Tasnifi: Kural Eşleme',
        tagline: 'Son Basamak & Rakam Toplamı',
        description: 'Banttan gelen sayıların 2, 3, 4, 5, 6, 9 ve 10 bölünebilme kriterlerini hızla analiz et, doğru lazer kapısına yönlendir!',
        icon: <Package className="w-8 h-8" />,
        badge: '4 Seviye • Hızlı Kriter',
        gradient: 'from-sky-500 via-blue-600 to-indigo-800',
        reward: '+130 XP & Bölünebilme Dedektifi'
      },
      {
        id: 'frogjump',
        title: 'Kalan Avcısı Kurbağa: Basamak Parkuru',
        tagline: 'Kalan Bulma & Zıplama',
        description: 'Kurbağayı kalansız bölünen nilüferlere zıplat! Kalanlı sayılardan kaç, altın kriter böceklerini topla.',
        icon: <Activity className="w-8 h-8" />,
        badge: '4 Seviye • 3 Can',
        gradient: 'from-cyan-500 via-teal-600 to-emerald-800',
        reward: '+150 XP & Nilüfer Dedektifi'
      },
      {
        id: 'rainbowvault',
        title: 'Gizli Rakam Kasası: Eksik Basamak',
        tagline: 'Kasa Kilidi & Kriter Çözücü',
        description: 'Sayılardaki gizli A ve B rakamlarını bölünebilme kurallarına göre hesapla, çelik kasa kilidini aç!',
        icon: <Sparkles className="w-8 h-8" />,
        badge: '4 Kasa • Şifre Çözücü',
        gradient: 'from-purple-600 via-indigo-600 to-pink-600',
        reward: '+140 XP & Kasa Ustası'
      }
    );
  } else if (isPrimeFactorsTopic) {
    baseGamesList.push(
      {
        id: 'kolilemefactory',
        title: 'Asal Çarpan Fabrikası: Ağaç & Algoritma',
        tagline: 'Asal Yapı Taşları',
        description: 'Gelen sayıları asal çarpanlarına ayır, çarpan ağacını ve bölme merdivenini eksiksiz tamamla!',
        icon: <Package className="w-8 h-8" />,
        badge: '4 Seviye • Asal Bloklar',
        gradient: 'from-amber-500 via-orange-600 to-amber-800',
        reward: '+130 XP & Asal Mimarı'
      },
      {
        id: 'frogjump',
        title: 'Eratosthenes Asal Parkuru',
        tagline: 'Asal Nilüferler',
        description: 'Kurbağayı yalnızca asal sayılara zıplat! 1 ve bileşik sayılardan kaçarak kalburu tamamla.',
        icon: <Activity className="w-8 h-8" />,
        badge: '4 Seviye • 1-100 Kalbur',
        gradient: 'from-emerald-500 via-teal-600 to-cyan-800',
        reward: '+150 XP & Asal Şampiyonu'
      },
      {
        id: 'rainbowvault',
        title: 'Kripto Asal Kasa: RSA Şifresi',
        tagline: 'Asal Anahtar Çözme',
        description: 'İki asal sayının çarpımıyla kilitlenen şifreli kasaları asal çarpanlarını bularak çöz!',
        icon: <Sparkles className="w-8 h-8" />,
        badge: '4 Kasa • Kripto Kod',
        gradient: 'from-purple-600 via-indigo-600 to-pink-600',
        reward: '+140 XP & Kripto Uzmanı'
      }
    );
  } else if (isCommonTopic) {
    baseGamesList.push(
      {
        id: 'kolilemefactory',
        title: 'Merhamet Paylaşım Fabrikası: Ortak Bölen',
        tagline: 'Eşit Kap & Bidonlama',
        description: 'Zeytinyağı ve nar ekşisini hiç artmayacak şekilde ortak eşit bidonlara dağıt, firesiz lojistiği sağla!',
        icon: <Package className="w-8 h-8" />,
        badge: '4 Seviye • Ortak Bölen',
        gradient: 'from-teal-500 via-emerald-600 to-slate-800',
        reward: '+130 XP & Paylaşım Ustası'
      },
      {
        id: 'frogjump',
        title: 'Ortak Durak Parkuru: Periyodik Katlar',
        tagline: 'Çift Sayı Doğrusu',
        description: 'Farklı periyotlarla sefer yapan otobüslerin ve fenerlerin ortak buluşma anlarını yakala!',
        icon: <Activity className="w-8 h-8" />,
        badge: '4 Seviye • Ritmik Buluşma',
        gradient: 'from-blue-500 via-cyan-600 to-indigo-800',
        reward: '+150 XP & Periyot Kaptanı'
      },
      {
        id: 'rainbowvault',
        title: 'Aralarında Asallık Kasası',
        tagline: 'Ortak Böleni 1 Olan Çiftler',
        description: 'Aralarında asal sayı çiftlerini tespit et, 1 ortak bölen mührünü vurarak gizli hazineyi aç!',
        icon: <Sparkles className="w-8 h-8" />,
        badge: '4 Kasa • Altın Mühür',
        gradient: 'from-amber-600 via-purple-600 to-rose-600',
        reward: '+140 XP & Asallık Dedektifi'
      }
    );
  } else if (isFactorsMultiplesTopic) {
    baseGamesList.push(
      {
        id: 'kolilemefactory',
        title: 'Kolileme Fabrikası: Çarpan Eşleme',
        tagline: 'Arcade Çarpan Eşleme',
        description: 'Banttan gelen kolilerin ürün sayılarını bölen doğru çarpan paketlerini seç, kutuları eksiksiz ve firesiz doldur!',
        icon: <Package className="w-8 h-8" />,
        badge: '4 Seviye • Combo & Süre',
        gradient: 'from-amber-500 via-orange-600 to-amber-800',
        reward: '+120 XP & Usta Kolici Rozeti'
      },
      {
        id: 'frogjump',
        title: 'Kat Avcısı Kurbağa: Sayı Doğrusu',
        tagline: 'Ritmik Sıçrama Parkuru',
        description: 'Kurbağayı hedef sayının tam katlarına zıplat! Tuzak nilüfer yapraklarından kaç, çarpan sineklerini yakala.',
        icon: <Activity className="w-8 h-8" />,
        badge: '4 Seviye • 3 Can',
        gradient: 'from-emerald-500 via-teal-600 to-cyan-800',
        reward: '+150 XP & Nilüfer Şampiyonu'
      },
      {
        id: 'rainbowvault',
        title: 'Gökkuşağı Kasası: Eksik Çarpan',
        tagline: 'Gökkuşağı Yayı Şifresi',
        description: 'Gökkuşağı yayındaki simetrik çarpan eşlerini bul, kayıp çarpanı tuşlayarak çelik kasa kilidini aç!',
        icon: <Sparkles className="w-8 h-8" />,
        badge: '4 Kasa • Şifre Çözücü',
        gradient: 'from-purple-600 via-indigo-600 to-pink-600',
        reward: '+140 XP & Çarpan Dedektifi'
      }
    );
  }

  if (isLinesAnglesTopic) {
    baseGamesList.push({
      id: 'junctiongame',
      title: 'Kavşak Mimarı: Lazer Yolları & Açı Kilidi',
      tagline: 'Dinamik Kesişim, Şifre & Arcade',
      description: 'Lazer kavşağında ters açıları ve komşu bütünleri çöz, neon arabaları geçir! Açı terazisinde tümler ve bütünler enerjisini topla.',
      icon: <Zap className="w-8 h-8" />,
      badge: '3 Oyun Modu • Siberpunk',
      gradient: 'from-cyan-600 via-indigo-600 to-amber-600',
      reward: '+150 XP & Usta Rozeti'
    });
  }

  if (isAngleTopic) {
    baseGamesList.push({
      id: 'radargame',
      title: 'Açı Radarı: Hedef Kilitlendi!',
      tagline: '360° İletki & Lazer Atışı',
      description: 'Derin uzay radarında 360° dönebilen sanal iletkiyle açıları ölç, iletişim uydularına lazer antenini kilitle!',
      icon: <Crosshair className="w-8 h-8" />,
      badge: '3 Seviye • 360° İletki',
      gradient: 'from-cyan-500 via-blue-600 to-indigo-900',
      reward: '+100 XP & Rozet'
    });
  }

  if (isConstructionTopic) {
    baseGamesList.push({
      id: 'constructiongame',
      title: 'Adım Adım İnşa & Çıkarım Terazisi',
      tagline: 'Gönye, Cetvel, Pergel & Terazi',
      description: 'Kayıp tren rayını gönye ve cetvelle döşe, treni geçir! Açı kollarını pergelle dengele ve çıkarım terazisinde aksiyomları test et.',
      icon: <Compass className="w-8 h-8" />,
      badge: '3 Görev • İnşa & Terazi',
      gradient: 'from-amber-600 via-teal-700 to-slate-900',
      reward: '+130 XP & Usta Rozeti'
    });
  }

  baseGamesList.push(
    {
      id: 'memorycards',
      title: isRationalNumbersTopic
        ? 'Rasyonel Sayılar Hafıza Kartları'
        : isDivisibilityTopic
        ? 'Bölünebilme Kuralları Hafıza Kartları'
        : isPrimeFactorsTopic
        ? 'Asal Sayılar ve Çarpanlar Hafıza Kartları'
        : isCommonTopic
        ? 'Ortak Bölen & Kat Hafıza Kartları'
        : isFactorsMultiplesTopic
        ? 'Çarpanlar & Katlar Hafıza Kartları'
        : 'Kavram & Tanım Hafıza Kartları',
      tagline: 'Kavramsal Eşleştirme & Bellek',
      description: isRationalNumbersTopic
        ? 'Rasyonel sayı, mutlak değer, Euler şeması, gizli payda ve tanımsızlık kavramlarını tanımlarıyla 3D kartları çevirerek eşleştir.'
        : isDivisibilityTopic
        ? '2, 3, 4, 5, 6, 9, 10 bölünebilme kuralları ve basamak kavramlarını tanımlarıyla eşleştir.'
        : isPrimeFactorsTopic
        ? 'Asal sayı, kalbur, çarpan ağacı ve algoritma kavramlarını tanımlarıyla 3D kartları çevirerek eşleştir.'
        : isCommonTopic
        ? 'Ortak bölen, ortak kat, periyot ve aralarında asallık kavramlarını eşleştir.'
        : isFactorsMultiplesTopic
        ? 'Çarpan, kat, bölen, tam kare ve gökkuşağı kavramlarını tanımlarıyla 3D kartları çevirerek eşleştir.'
        : 'Bir kartta kavramın adı & sembolü, diğerinde tanımı! Kartları çevirerek geometrik kavram-tanım çiftlerini hafızanda eşleştir.',
      icon: <Layers className="w-8 h-8" />,
      badge: '12 / 16 Kart • 3D Çevirme',
      gradient: 'from-amber-500 via-rose-600 to-indigo-800',
      reward: '+80 XP & Rozet'
    },
    {
      id: 'matching',
      title: isRationalNumbersTopic
        ? 'Rasyonel Sayılar & Kümeler Eşleştirme'
        : isDivisibilityTopic
        ? 'Bölünebilme Kriterleri Eşleştirme'
        : isPrimeFactorsTopic
        ? 'Asal Çarpanlar & Ağaç Eşleştirme'
        : isCommonTopic
        ? 'Ortak Bölen & Kat Eşleştirme'
        : isFactorsMultiplesTopic
        ? 'Çarpanlar & Katlar Eşleştirme'
        : isLinesAnglesTopic
        ? 'Doğrular & Açı Çıkarımları Eşleştirme'
        : isAngleTopic
        ? 'Açı Çeşitleri & İletki Eşleştirme'
        : 'Kavram & Sembol Eşleştirme',
      tagline: isRationalNumbersTopic || isDivisibilityTopic || isPrimeFactorsTopic || isCommonTopic || isFactorsMultiplesTopic
        ? 'Matematiksel Modelleri Tanı'
        : 'Geometrik Modelleri Tanı',
      description: isRationalNumbersTopic
        ? 'Rasyonel sayılar, mutlak değer cetveli, Euler kümeleri ve tanımsızlık modellerini sembol ve tanımlarıyla eşleştirin.'
        : isDivisibilityTopic
        ? 'Bölünebilme kurallarını, basamak modellerini ve kalan formüllerini eşleştirin.'
        : isPrimeFactorsTopic
        ? 'Asal sayı kalburu, çarpan ağacı ve üslü gösterimleri tanımlarıyla eşleştirin.'
        : isCommonTopic
        ? 'Ortak bölen kümeleri, ortak kat doğruları ve aralarında asallık kurallarını eşleştirin.'
        : isFactorsMultiplesTopic
        ? 'Çarpan, kat, alan ve gökkuşağı kavramlarını sembol ve tanımlarıyla eşleştirin.'
        : isLinesAnglesTopic
        ? 'Ters, komşu, tümler, bütünler açıları ve doğruların durumlarını sembol ve tanımlarıyla eşleştirin.'
        : isAngleTopic
        ? 'Açı çeşitleri, ışın ve köşe kavramlarını görsel modelleri ve sembolik formülleriyle eşleştir.'
        : 'Geometrik kavramları görsel modelleri, tanımları ve sembolik gösterimleriyle eşleştirin.',
      icon: <Puzzle className="w-8 h-8" />,
      badge: `${data.items?.length || 4} Çift • Eşleştirme`,
      gradient: 'from-teal-600 via-teal-700 to-emerald-800',
      reward: '+50 XP & Rozet'
    },
    {
      id: 'wordsearch',
      title: isRationalNumbersTopic
        ? 'Rasyonel Sayılar Kelime Avı'
        : isDivisibilityTopic
        ? 'Bölünebilme Kelime Avı'
        : isPrimeFactorsTopic
        ? 'Asal Sayılar Kelime Avı'
        : isCommonTopic
        ? 'Ortak Kat & Bölen Kelime Avı'
        : isFactorsMultiplesTopic
        ? 'Çarpan & Kat Kelime Avı'
        : 'Matematiksel Kelime Avı',
      tagline: 'Soru Odaklı Akıl Yürütme',
      description: isRationalNumbersTopic
        ? 'İpuçlarını oku, gizli rasyonel sayı, mutlak değer, Euler ve gizli payda terimlerini bulmaca ızgarasında yakala!'
        : isDivisibilityTopic
        ? 'İpuçlarını oku, gizli bölünebilme, basamak ve kalan kavramlarını bulmaca ızgarasında yakala!'
        : isPrimeFactorsTopic
        ? 'İpuçlarını oku, asal sayı, kalbur, çarpan ağacı ve üslü gösterim kavramlarını yakala!'
        : isCommonTopic
        ? 'İpuçlarını oku, ortak bölen, ortak kat, periyot ve aralarında asallık terimlerini yakala!'
        : isFactorsMultiplesTopic
        ? 'İpuçlarını oku, gizli çarpan, kat, bölen ve gökkuşağı kavramlarını bulmaca ızgarasında yakala!'
        : 'Soruları ve ipuçlarını oku, gizli geometrik kavramları dinamik bulmaca ızgarasında bulup yakala!',
      icon: <Search className="w-8 h-8" />,
      badge: '6 Soru • Rastgele Izgara',
      gradient: 'from-blue-600 via-indigo-700 to-slate-900',
      reward: '+60 XP & Rozet'
    },
    {
      id: 'truefalse',
      title: isRationalNumbersTopic
        ? 'Rasyonel Sayılar Hızlı D/Y Testi'
        : isDivisibilityTopic
        ? 'Bölünebilme Hızlı D/Y Testi'
        : isPrimeFactorsTopic
        ? 'Asal Sayılar Hızlı D/Y Testi'
        : isCommonTopic
        ? 'Ortak Bölen & Kat Hızlı D/Y Testi'
        : isFactorsMultiplesTopic
        ? 'Çarpanlar & Katlar D/Y Testi'
        : 'Hızlı Doğru / Yanlış Testi',
      tagline: 'Hız ve Kavramsal Refleks',
      description: isRationalNumbersTopic
        ? 'Rasyonel sayı, sayı kümeleri ve mutlak değer önermelerini hızlıca değerlendir, matematiksel gerekçeleri öğren!'
        : isDivisibilityTopic
        ? 'Bölünebilme kriterleri önermelerini hızla değerlendir, matematiksel gerekçelerini öğren!'
        : isPrimeFactorsTopic
        ? 'Asal sayılar ve çarpan önermelerini hızlıca değerlendir, pedagojik gerekçeleri öğren!'
        : isCommonTopic
        ? 'Ortak kat, ortak bölen ve aralarında asallık önermelerini hızla değerlendir!'
        : isFactorsMultiplesTopic
        ? 'Çarpan ve kat önermelerini hızlıca değerlendir, matematiksel gerekçelerini öğren ve puanları topla!'
        : 'Geometrik önermeleri hızlıca değerlendir, pedagojik gerekçelerini öğren ve puanları topla!',
      icon: <Zap className="w-8 h-8" />,
      badge: '7 Önerme • Hız & Refleks',
      gradient: 'from-purple-600 via-pink-700 to-rose-800',
      reward: '+100 XP'
    }
  );

  const GAMES_LIST = baseGamesList;
  const currentGameInfo = GAMES_LIST.find((g) => g.id === selectedGameId);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* 1. VIEW: CARDS ONLY MENU (when selectedGameId === null) */}
      {selectedGameId === null ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Menu Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
                <Gamepad2 className="w-3.5 h-3.5 text-teal-600" />
                <span>3. Aşama: Eğitici Matematik Bulmacaları & Oyun İstasyonu</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Kavram Oyunları ve Bulmacalar
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                Öğrenilen geometrik kavramları pekiştirmek için aşağıdaki oyunlardan birini seçiniz.
              </p>
            </div>

            <button
              onClick={() => {
                playSound('select');
                onNextPhase();
              }}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95 shrink-0"
            >
              <span>4. Aşamaya Geç (Değerlendirme)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Teacher Smart Board Student Delegation Widget */}
          <BoardStudentWidget activityTitle="Kavram Oyunları & Bulmacalar" />

          {/* GAME CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {GAMES_LIST.map((game) => (
              <div
                key={game.id}
                className="bg-white rounded-3xl border-2 border-slate-200 hover:border-teal-400 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Top card icon badge */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${game.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                    >
                      {game.icon}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-200">
                      {game.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-teal-600">
                      {game.tagline}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {game.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold">Ödül:</span>
                    <span className="font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      🏆 {game.reward}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      playSound('select');
                      setSelectedGameId(game.id);
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Oyunu Başlat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* 2. VIEW: SELECTED GAME IN FULL FOCUS */
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Control Bar with Back Button */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            
            {/* BACK TO GAME CARDS BUTTON */}
            <button
              onClick={() => {
                playSound('click');
                setSelectedGameId(null);
              }}
              className="px-4 py-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-extrabold text-xs sm:text-sm border border-teal-200 transition-all flex items-center gap-2 active:scale-95 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-teal-700" />
              <span>⬅️ GERİ (Oyun Menüsü)</span>
            </button>

            {/* Current Game Title Tag */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">Aktif Oyun:</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-black text-xs sm:text-sm flex items-center gap-1.5">
                <span>{currentGameInfo?.title}</span>
              </span>
            </div>

            {/* Phase 4 Jump Button */}
            <button
              onClick={() => {
                playSound('select');
                onNextPhase();
              }}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>4. Aşamaya Geç</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Teacher Smart Board Student Delegation Widget */}
          <BoardStudentWidget activityTitle={currentGameInfo?.title || 'Aktif Oyun'} />

          {/* FEATURED GAME: KÜME AYIKLAMA İSTASYONU (MAT.7.1.1) */}
          {selectedGameId === 'setsorting' && (
            <div className="animate-in fade-in duration-200">
              <SetSortingGame />
            </div>
          )}

          {/* FEATURED GAME: RASYONEL PARAŞÜTÇÜ (MAT.7.1.1) */}
          {selectedGameId === 'rationalparachute' && (
            <div className="animate-in fade-in duration-200">
              <RationalParachuteGame />
            </div>
          )}

          {/* FEATURED GAME: SIFIR DENGE MERKEZİ (MAT.7.1.1) */}
          {selectedGameId === 'zerobalance' && (
            <div className="animate-in fade-in duration-200">
              <ZeroBalanceCenterGame />
            </div>
          )}

          {/* FEATURED GAME: KOLİLEME FABRİKASI (ÇARPAN EŞLEME ARCADE) */}
          {selectedGameId === 'kolilemefactory' && (
            <div className="animate-in fade-in duration-200">
              <KolilemeFactoryGame onBackToMenu={() => setSelectedGameId(null)} />
            </div>
          )}

          {/* FEATURED GAME: KAT AVCISI KURBAĞA (SAYI DOĞRUSU PARKURU) */}
          {selectedGameId === 'frogjump' && (
            <div className="animate-in fade-in duration-200">
              <FrogJumpGame onBackToMenu={() => setSelectedGameId(null)} />
            </div>
          )}

          {/* FEATURED GAME: GÖKKUŞAĞI KASASI (EKSİK ÇARPAN BULMACA) */}
          {selectedGameId === 'rainbowvault' && (
            <div className="animate-in fade-in duration-200">
              <RainbowVaultGame onBackToMenu={() => setSelectedGameId(null)} />
            </div>
          )}

          {/* FEATURED GAME: JUNCTION ARCHITECT (KAVŞAK MİMARI) */}
          {selectedGameId === 'junctiongame' && (
            <div className="animate-in fade-in duration-200">
              <JunctionArchitectGame onBackToMenu={() => setSelectedGameId(null)} />
            </div>
          )}

          {/* FEATURED GAME: ANGLE RADAR (HEDEF KİLİTLENDİ) */}
          {selectedGameId === 'radargame' && (
            <div className="animate-in fade-in duration-200">
              <AngleRadarGame onBackToMenu={() => setSelectedGameId(null)} />
            </div>
          )}

          {/* FEATURED GAME: CONSTRUCTION & DEDUCTION GAME */}
          {selectedGameId === 'constructiongame' && (
            <div className="animate-in fade-in duration-200">
              <ConstructionDeductionGame onBackToMenu={() => setSelectedGameId(null)} />
            </div>
          )}

          {/* FEATURED GAME: MEMORY CARDS (KAVRAM & TANIM HAFIZA KARTLARI) */}
          {selectedGameId === 'memorycards' && (
            <div className="animate-in fade-in duration-200">
              <MemoryCardsGame onBackToMenu={() => setSelectedGameId(null)} />
            </div>
          )}

          {/* GAME 1: MATCHING GAME */}
          {selectedGameId === 'matching' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-extrabold text-teal-700 uppercase">Eşleştirme Modu</div>
                  <h3 className="text-lg font-black text-slate-900">Kavram ve Sembol Eşleştirme</h3>
                  <p className="text-xs text-slate-500">
                    Sol kolondaki kavramı seçip sağ kolondaki doğru sembol/tanım ile eşleştiriniz.
                  </p>
                </div>

                <button
                  onClick={initMatchingGame}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Yeniden Karıştır</span>
                </button>
              </div>

              {/* Matching Completion Banner */}
              {isMatchingCompleted && (
                <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in duration-300">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
                      🏆
                    </div>
                    <div>
                      <h4 className="text-xl font-black">Harika İş! Tüm Eşleştirmeler Doğru</h4>
                      <p className="text-xs text-emerald-100">
                        Kavramlar ve sembolik gösterimleri başarıyla öğrendin. +50 Puan ve Rozet Kazandın!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        playSound('click');
                        setSelectedGameId(null);
                      }}
                      className="whitespace-nowrap px-5 py-3 rounded-xl bg-white/20 text-white font-black text-xs hover:bg-white/30 transition-all"
                    >
                      Oyun Menüsüne Dön
                    </button>

                    <button
                      onClick={() => {
                        setSelectedGameId('wordsearch');
                        playSound('select');
                      }}
                      className="whitespace-nowrap px-6 py-3 rounded-xl bg-white text-emerald-950 font-black text-xs shadow-md hover:bg-emerald-50 transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <span>Kelime Avı'na Geç 🔍</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Matching Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Concepts */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">
                      Geometrik Kavramlar
                    </h4>
                    <span className="text-xs text-slate-400">Sol Kolon</span>
                  </div>

                  <div className="space-y-3">
                    {conceptCards.map((card) => {
                      const isSelected = selectedConcept?.id === card.id;
                      const isWrong = wrongPair.includes(card.id);

                      return (
                        <button
                          key={card.id}
                          disabled={card.matched}
                          onClick={() => handleConceptClick(card)}
                          className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ${
                            card.matched
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900 opacity-90 shadow-2xs'
                              : isWrong
                              ? 'bg-rose-50 border-rose-400 text-rose-900 animate-shake'
                              : isSelected
                              ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-400 shadow-md scale-101'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                          }`}
                        >
                          <div>
                            <div className="font-black text-base">{card.text}</div>
                            {card.subtext && (
                              <div className="text-xs text-slate-500 mt-1 font-medium">
                                {card.subtext}
                              </div>
                            )}
                          </div>
                          {card.matched ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Symbols & Definitions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">
                      Semboller & Tanımlar
                    </h4>
                    <span className="text-xs text-slate-400">Sağ Kolon</span>
                  </div>

                  <div className="space-y-3">
                    {targetCards.map((card) => {
                      const isSelected = selectedTarget?.id === card.id;
                      const isWrong = wrongPair.includes(card.id);

                      return (
                        <button
                          key={card.id}
                          disabled={card.matched}
                          onClick={() => handleTargetClick(card)}
                          className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ${
                            card.matched
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900 opacity-90 shadow-2xs'
                              : isWrong
                              ? 'bg-rose-50 border-rose-400 text-rose-900 animate-shake'
                              : isSelected
                              ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-400 shadow-md scale-101'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                          }`}
                        >
                          <div>
                            <div className="font-mono font-black text-amber-700 text-base">
                              {card.text}
                            </div>
                            {card.subtext && (
                              <div className="text-xs text-slate-500 mt-1">
                                {card.subtext}
                              </div>
                            )}
                          </div>
                          {card.matched ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* GAME 2: WORD SEARCH */}
          {selectedGameId === 'wordsearch' && (
            <div className="animate-in fade-in duration-200">
              <WordSearchGame />
            </div>
          )}

          {/* GAME 3: TRUE / FALSE */}
          {selectedGameId === 'truefalse' && (
            <div className="animate-in fade-in duration-200">
              <TrueFalseGame />
            </div>
          )}

        </div>
      )}

    </div>
  );
}
