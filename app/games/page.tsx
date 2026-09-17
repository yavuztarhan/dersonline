'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import { MascotCharacter } from '@/components/mascot';
import { STANDALONE_GAMES, StandaloneGame } from '@/lib/standalone-games-data';
import {
  LESSON_GAMES,
  OUTCOME_FILTER_OPTIONS,
  getSystemGameStatistics,
  LessonGameItem
} from '@/lib/lesson-games-data';
import { getOutcomeById } from '@/lib/curriculum-data';
import { MultiplicationGame } from '@/components/games/multiplication-game';
import { MathWheelGame } from '@/components/games/math-wheel-game';
import { MemoryCardsGame } from '@/components/lesson-phases/memory-cards-game';
import { PuzzlePhase, PuzzleGameId } from '@/components/lesson-phases/puzzle-phase';
import { FeedbackModal } from '@/components/feedback/feedback-modal';
import { BoardStudentWidget } from '@/components/board/board-student-widget';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Outcome } from '@/types';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Star,
  Zap,
  Flame,
  Search,
  SlidersHorizontal,
  Play,
  Clock,
  Award,
  ChevronRight,
  Brain,
  Calculator,
  Compass,
  Layers,
  CheckCircle2,
  Lock,
  ArrowLeft,
  MessageSquarePlus,
  BookOpen,
  Filter,
  GraduationCap,
  ListFilter,
  Check
} from 'lucide-react';

export default function GamesPage() {
  const { currentUser } = useAuth();
  const { studentPoints, playSound, setSelectedOutcome } = useApp();

  // 0. AUTHENTICATION GUARD: Giriş yapmamış kullanıcıların oyunları görmesini ve oynamasını engelle
  if (!currentUser) {
    return (
      <AuthGuard
        title="Maarif Oyun Salonuna Giriş Yapın"
        description="Matematik oyun salonundaki zeka ve ders oyunlarını oynamak, seviyeleri tamamlayıp puan ve rozet kazanmak için lütfen öğrenci veya öğretmen hesabınızla giriş yapınız."
      >
        <div />
      </AuthGuard>
    );
  }

  // 1. MAIN TAB: 'general' (Genel Oyunlar) vs 'curriculum' (Ders Oyunları)
  const [mainTab, setMainTab] = useState<'general' | 'curriculum'>('general');

  // 2. Active Game Players
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [activeLessonGame, setActiveLessonGame] = useState<{
    outcome: Outcome;
    gameId: PuzzleGameId;
    gameTitle: string;
  } | null>(null);

  // 3. Genel Oyunlar Sekmesi Filtreleri
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [generalSearchQuery, setGeneralSearchQuery] = useState<string>('');
  const [gameRequestModalOpen, setGameRequestModalOpen] = useState<boolean>(false);

  // 4. Ders Oyunları Sekmesi Filtreleri
  const [selectedGrade, setSelectedGrade] = useState<0 | 5 | 6 | 7>(0); // 0: Tümü
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string>('all');
  const [selectedGameType, setSelectedGameType] = useState<string>('all');
  const [curriculumSearchQuery, setCurriculumSearchQuery] = useState<string>('');

  const stats = useMemo(() => getSystemGameStatistics(), []);

  // Handler for grade filter change (clears outcome if not matching)
  const handleGradeChange = (grade: 0 | 5 | 6 | 7) => {
    playSound('click');
    setSelectedGrade(grade);
    if (grade !== 0 && selectedOutcomeId !== 'all') {
      const opt = OUTCOME_FILTER_OPTIONS.find((o) => o.id === selectedOutcomeId);
      if (opt && opt.grade !== grade) {
        setSelectedOutcomeId('all');
      }
    }
  };

  // Launch a Lesson Game in the hub
  const handleLaunchLessonGame = (game: LessonGameItem) => {
    playSound('select');
    const outcome = getOutcomeById(game.outcomeId);
    if (outcome && outcome.phases?.puzzle) {
      setSelectedOutcome(outcome);
      setActiveLessonGame({
        outcome,
        gameId: game.gameType,
        gameTitle: game.title
      });
    }
  };

  // ---------------------------------------------------------------------------
  // ACTIVE GAME PLAYERS RENDERING
  // ---------------------------------------------------------------------------

  // Active Standalone Game 1: Matematik Çarkı
  if (activeGameId === 'matematik-carki') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MathWheelGame onBackToHub={() => setActiveGameId(null)} />
      </div>
    );
  }

  // Active Standalone Game 2: Çarpım Tablosu
  if (activeGameId === 'carpim-tablosu') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MultiplicationGame onBackToHub={() => setActiveGameId(null)} />
      </div>
    );
  }

  // Active Standalone Game 3: 3D Hafıza Kartları
  if (activeGameId === 'hafiza-kartlari') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveGameId(null)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-extrabold text-xs sm:text-sm border border-teal-200 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-teal-700" />
            <span>⬅️ Genel Oyunlar Salonuna Dön</span>
          </button>
          <span className="font-black text-slate-800 text-sm">3D Kavram & Hafıza Kartları</span>
        </div>
        <MemoryCardsGame onBackToMenu={() => setActiveGameId(null)} />
      </div>
    );
  }

  // Active Lesson Game (Ders Akışı Oyunu)
  if (activeLessonGame) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
        {/* Top Header Bar with return and lesson flow deep-link */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
          <button
            onClick={() => {
              playSound('click');
              setActiveLessonGame(null);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-extrabold text-xs sm:text-sm border border-teal-200 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-teal-700" />
            <span>⬅️ Ders Oyunları Kataloğuna Dön</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-black">
              {activeLessonGame.outcome.gradeId === 'grade-5'
                ? '5. Sınıf'
                : activeLessonGame.outcome.gradeId === 'grade-6'
                ? '6. Sınıf'
                : '7. Sınıf'}{' '}
              • {activeLessonGame.outcome.code}
            </div>

            <Link
              href={`/lesson/${activeLessonGame.outcome.id}?phase=puzzle`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tam Ders Akışında Aç</span>
            </Link>
          </div>
        </div>

        {/* Render PuzzlePhase in direct focus */}
        <PuzzlePhase
          data={activeLessonGame.outcome.phases.puzzle}
          initialGameId={activeLessonGame.gameId}
          onBackToHub={() => setActiveLessonGame(null)}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // FILTERING LOGIC
  // ---------------------------------------------------------------------------

  // Filter General Games (Var olan bağımsız oyunlar)
  const generalCategories = [
    { id: 'all', label: 'Tümü', icon: '🌟' },
    { id: 'math', label: 'Matematik & Mantık', icon: '🔢' },
    { id: 'logic', label: 'Zeka & Strateji', icon: '🧠' },
    { id: 'memory', label: 'Hafıza & Eşleştirme', icon: '🃏' },
    { id: 'speed', label: 'Hız & Dikkat', icon: '⚡' }
  ];

  const filteredGeneralGames = STANDALONE_GAMES.filter((game) => {
    const matchesCat = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch =
      !generalSearchQuery ||
      game.title.toLowerCase().includes(generalSearchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(generalSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filter Lesson Games (Ders Akışlarındaki Oyunlar)
  const availableOutcomeOptions = OUTCOME_FILTER_OPTIONS.filter((opt) => {
    if (opt.id === 'all') return true;
    if (selectedGrade === 0) return true;
    return opt.grade === selectedGrade;
  });

  const lessonTypeFilters = [
    { id: 'all', label: 'Tüm Formatlar' },
    { id: 'arcade', label: '🕹️ Arcade & Simülasyon' },
    { id: 'memory', label: '🃏 3D Hafıza' },
    { id: 'puzzle', label: '🧩 Eşleştirme & Bulmaca' },
    { id: 'speed', label: '⚡ Hız & D/Y Testi' }
  ];

  const filteredLessonGames = LESSON_GAMES.filter((game) => {
    const matchesGrade = selectedGrade === 0 || game.grade === selectedGrade;
    const matchesOutcome =
      selectedOutcomeId === 'all' || game.outcomeId === selectedOutcomeId;
    const matchesType =
      selectedGameType === 'all' ||
      (selectedGameType === 'arcade' &&
        (game.category === 'arcade' || game.category === 'simulation' || game.category === 'strategy')) ||
      (selectedGameType === 'memory' && game.category === 'memory') ||
      (selectedGameType === 'puzzle' && game.category === 'puzzle') ||
      (selectedGameType === 'speed' && game.category === 'speed');
    const matchesSearch =
      !curriculumSearchQuery ||
      game.title.toLowerCase().includes(curriculumSearchQuery.toLowerCase()) ||
      game.tagline.toLowerCase().includes(curriculumSearchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(curriculumSearchQuery.toLowerCase()) ||
      game.outcomeCode.toLowerCase().includes(curriculumSearchQuery.toLowerCase()) ||
      game.outcomeTitle.toLowerCase().includes(curriculumSearchQuery.toLowerCase());

    return matchesGrade && matchesOutcome && matchesType && matchesSearch;
  });

  return (
    <AuthGuard
      title="Maarif Oyun Salonuna Giriş Yapın"
      description="Matematik oyun salonundaki zeka ve ders oyunlarını oynamak, seviyeleri tamamlayıp puan ve rozet kazanmak için lütfen öğrenci veya öğretmen hesabınızla giriş yapınız."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Top Navigation / Breadcrumb */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-all hover:border-slate-300 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Ana Sayfaya Dön</span>
        </Link>

        {currentUser?.role === 'student' && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black shadow-xs">
            <Award className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Kazanılan Puan: {studentPoints} XP</span>
          </div>
        )}
      </div>

      {/* Teacher Smart Board Student Delegation Widget */}
      <BoardStudentWidget activityTitle="Maarif Oyun Salonu" />

      {/* 2. Hero Banner: Maarif Oyun Salonu & Dynamic Stats */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl border border-indigo-900/50">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-[radial-gradient(circle,rgba(99,102,241,0.18)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-80 h-80 bg-[radial-gradient(circle,rgba(20,184,166,0.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black uppercase tracking-wider">
                <Gamepad2 className="w-4 h-4 text-indigo-400" />
                <span>Maarif Oyun Salonu • Zeka & Beceri Laboratuvarı</span>
              </div>

              {/* Dynamic Overall Games Highlight Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-400/20 border border-teal-300/40 text-teal-200 text-xs font-black tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{stats.totalOutcomes} KAZANIMDA {stats.totalGames} OYUN</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Eğlenerek Öğren, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-300">
                Mantık & Hızını Geliştir!
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Ders akışlarındaki kazanım simülasyonları ve bağımsız zeka oyunlarıyla matematiksel düşünme, refleks ve problem çözme becerilerinizi zirveye taşıyın.
            </p>

            {/* Quick Sınıf Dağılım Çubuğu */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 text-slate-200 font-bold">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>5. Sınıf: <strong>{stats.grade5Games} Oyun</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 text-slate-200 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>6. Sınıf: <strong>{stats.grade6Games} Oyun</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 text-slate-200 font-bold">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>7. Sınıf: <strong>{stats.grade7Games} Oyun</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 text-amber-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Genel Salon: <strong>{stats.standaloneGames} Oyun</strong></span>
              </div>
            </div>
          </div>

          {/* Selim Mascot with Game Controller Pose */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 shadow-2xl shrink-0 max-w-sm w-full lg:w-auto">
            <div className="relative shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-teal-400/30 rounded-full blur-xl animate-pulse" />
              <MascotCharacter pose="success" size="lg" showBadge badgeText="Selim" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 inline-block">
                Oyun Rehberi
              </div>
              <p className="text-xs text-slate-100 font-bold leading-relaxed">
                "Oyunları tamamlayarak matematiksel zekanı parlat ve liderlik tablosunda yerini al!"
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. System Statistics Cards (Tepedeki İstatistik Paneli) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Stat 1: Toplam Oyun */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-13 h-13 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-black shrink-0 border border-teal-100">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Sistemdeki Toplam Oyun
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {stats.totalGames} <span className="text-xs font-bold text-teal-600">Oyun</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {stats.totalLessonGames} Ders + {stats.standaloneGames} Genel
            </div>
          </div>
        </div>

        {/* Stat 2: Kapsanan Kazanım */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-13 h-13 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shrink-0 border border-indigo-100">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Kapsanan Kazanım
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {stats.totalOutcomes} <span className="text-xs font-bold text-indigo-600">Kazanım</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              5, 6 ve 7. Sınıf Müfredatı
            </div>
          </div>
        </div>

        {/* Stat 3: Oyun Formatları */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black shrink-0 border border-amber-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Oyun Formatları
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              6 <span className="text-xs font-bold text-amber-600">Farklı Mod</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Arcade, Denge, 3D Kart vb.
            </div>
          </div>
        </div>

        {/* Stat 4: Ödül Havuzu */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black shrink-0 border border-emerald-100">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Kazanılabilir Başarı
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {stats.totalPointsAvailable}+ <span className="text-xs font-bold text-emerald-600">XP</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {stats.totalBadgesCount} Özel Başarı Rozeti
            </div>
          </div>
        </div>

      </div>

      {/* 4. PRIMARY 2-TAB SWITCHER (GENEL OYUNLAR - DERS OYUNLARI) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        
        <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1.5 shadow-inner w-full sm:w-auto">
          {/* Tab 1: GENEL OYUNLAR */}
          <button
            onClick={() => {
              playSound('click');
              setMainTab('general');
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              mainTab === 'general'
                ? 'bg-white text-teal-900 shadow-md shadow-slate-200 border border-slate-200/80 scale-101'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Gamepad2
              className={`w-4 h-4 ${
                mainTab === 'general' ? 'text-teal-600' : 'text-slate-500'
              }`}
            />
            <span>GENEL OYUNLAR</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                mainTab === 'general'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {stats.standaloneGames} Oyun
            </span>
          </button>

          {/* Tab 2: DERS OYUNLARI */}
          <button
            onClick={() => {
              playSound('click');
              setMainTab('curriculum');
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              mainTab === 'curriculum'
                ? 'bg-white text-teal-900 shadow-md shadow-slate-200 border border-slate-200/80 scale-101'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <BookOpen
              className={`w-4 h-4 ${
                mainTab === 'curriculum' ? 'text-teal-600' : 'text-slate-500'
              }`}
            />
            <span>DERS OYUNLARI</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                mainTab === 'curriculum'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {stats.totalLessonGames} Oyun • {stats.totalOutcomes} Kazanım
            </span>
          </button>
        </div>

        {/* Tab Context Subtitle */}
        <div className="text-xs text-slate-500 font-bold hidden md:block">
          {mainTab === 'general'
            ? 'Genel matematik becerilerini, refleks ve hızını ölçen bağımsız arcade oyunları'
            : 'Müfredat ders akışlarında yer alan interaktif kazanım oyunları ve modelleri'}
        </div>

      </div>

      {/* =====================================================================
          TAB 1: GENEL OYUNLAR GÖRÜNÜMÜ
          ===================================================================== */}
      {mainTab === 'general' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* General Filters & Search */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {generalCategories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      playSound('click');
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-102'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Genel oyun veya kategori ara..."
                value={generalSearchQuery}
                onChange={(e) => setGeneralSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>

          </div>

          {/* Standalone Games Grid (Matematik Çarkı & Çarpım Tablosu) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredGeneralGames.map((game) => (
              <div
                key={game.id}
                className="relative bg-white rounded-3xl border-2 border-slate-200/80 hover:border-teal-400/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Top Accent Gradient Bar */}
                <div className={`h-3 w-full bg-gradient-to-r ${game.gradient}`} />

                <div className="p-6 space-y-4 flex-1">
                  {/* Header: Category & Badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                      <span>{game.categoryIcon}</span>
                      <span>{game.categoryLabel}</span>
                    </div>

                    <span
                      className={`text-[11px] font-black px-2.5 py-1 rounded-lg border ${game.badgeColor}`}
                    >
                      {game.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  {/* Game Meta Indicators */}
                  <div className="pt-2 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Zorluk
                      </div>
                      <div className="font-black text-slate-800 mt-0.5">
                        {game.difficulty}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Süre
                      </div>
                      <div className="font-black text-slate-800 mt-0.5">
                        {game.duration}
                      </div>
                    </div>
                    <div className="bg-amber-50/70 p-2.5 rounded-2xl border border-amber-200/60">
                      <div className="text-[10px] text-amber-600 font-bold uppercase">
                        Ödül
                      </div>
                      <div className="font-black text-amber-900 mt-0.5 flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        +{game.xpReward} XP
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-6 pt-0">
                  {game.isAvailable ? (
                    <button
                      onClick={() => {
                        playSound('click');
                        setActiveGameId(game.id);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Hemen Oyna</span>
                    </button>
                  ) : (
                    <div className="w-full py-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Çok Yakında Yayında</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Custom Game Design Notice / Feedback Box */}
          <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 border-2 border-teal-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-200/60 text-teal-900 font-extrabold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>Özel Oyun Geliştirme Alanı</span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-teal-950">
                Yeni Bağımsız Oyunumuzu Birlikte Tasarlayalım
              </h4>
              <p className="text-xs sm:text-sm text-teal-800 max-w-2xl leading-relaxed">
                Hangi matematiksel beceriyi, mantık bulmacasını veya zeka oyununu eklemek istersiniz? Kuralları, mekaniği ve görsel temayı belirleyerek yeni bir oyun hayata geçirebiliriz.
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setGameRequestModalOpen(true);
                }}
                className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md shadow-teal-600/25 transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <Gamepad2 className="w-5 h-5 text-teal-200" />
                <span>🎮 İstek Oyun / Yeni Oyun Fikri Bildir</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 2: DERS OYUNLARI GÖRÜNÜMÜ (SINIF & KAZANIM FİLTRELİ)
          ===================================================================== */}
      {mainTab === 'curriculum' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Controls & Filter Panel */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            
            {/* Top Row: Grade Filter Pills & Search */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              
              {/* Sınıf Filtresi (Grade Pills) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <span>Sınıf:</span>
                </span>

                {/* Grade All */}
                <button
                  onClick={() => handleGradeChange(0)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    selectedGrade === 0
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-102'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>Tüm Sınıflar</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedGrade === 0 ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {stats.totalLessonGames}
                  </span>
                </button>

                {/* Grade 5 */}
                <button
                  onClick={() => handleGradeChange(5)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    selectedGrade === 5
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20 scale-102'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>5. Sınıf</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedGrade === 5 ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {stats.grade5Games}
                  </span>
                </button>

                {/* Grade 6 */}
                <button
                  onClick={() => handleGradeChange(6)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    selectedGrade === 6
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-102'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>6. Sınıf</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedGrade === 6 ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {stats.grade6Games}
                  </span>
                </button>

                {/* Grade 7 */}
                <button
                  onClick={() => handleGradeChange(7)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    selectedGrade === 7
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 scale-102'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>7. Sınıf</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedGrade === 7 ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {stats.grade7Games}
                  </span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ders oyunu veya kazanım ara..."
                  value={curriculumSearchQuery}
                  onChange={(e) => setCurriculumSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

            </div>

            {/* Bottom Row: Outcome Dropdown & Format Filter */}
            <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Kazanım Seçimi (Outcome Dropdown Filter) */}
              <div className="flex items-center gap-2 flex-1 max-w-xl">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <ListFilter className="w-4 h-4 text-slate-500" />
                  <span>Kazanım:</span>
                </span>

                <select
                  value={selectedOutcomeId}
                  onChange={(e) => {
                    playSound('select');
                    setSelectedOutcomeId(e.target.value);
                  }}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
                >
                  {availableOutcomeOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.id === 'all'
                        ? `🌟 Tüm Kazanımlar (${opt.count} Oyun)`
                        : `${opt.code} • ${opt.shortTitle} (${opt.count} Oyun)`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Format Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {lessonTypeFilters.map((fmt) => {
                  const isActive = selectedGameType === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => {
                        playSound('click');
                        setSelectedGameType(fmt.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Results Summary Counter */}
          <div className="flex items-center justify-between px-1">
            <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>
                Filtreye uygun <strong>{filteredLessonGames.length}</strong> ders oyunu listeleniyor
              </span>
            </div>

            {(selectedGrade !== 0 || selectedOutcomeId !== 'all' || selectedGameType !== 'all' || curriculumSearchQuery) && (
              <button
                onClick={() => {
                  playSound('click');
                  setSelectedGrade(0);
                  setSelectedOutcomeId('all');
                  setSelectedGameType('all');
                  setCurriculumSearchQuery('');
                }}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline cursor-pointer"
              >
                Filtreleri Sıfırla
              </button>
            )}
          </div>

          {/* Lesson Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessonGames.map((game) => (
              <div
                key={game.id}
                className="relative bg-white rounded-3xl border-2 border-slate-200/80 hover:border-teal-500 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                {/* Top Accent Gradient Bar */}
                <div className={`h-2.5 w-full bg-gradient-to-r ${game.gradient}`} />

                <div className="p-6 space-y-4 flex-1">
                  
                  {/* Top Meta: Grade, Outcome Code & Format Badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${
                        game.grade === 5
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : game.grade === 6
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-purple-50 text-purple-800 border-purple-200'
                      }`}
                    >
                      {game.gradeLabel} • {game.outcomeCode}
                    </span>

                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.8 rounded-lg flex items-center gap-1">
                      <span>{game.categoryIcon}</span>
                      <span>{game.categoryLabel}</span>
                    </span>
                  </div>

                  {/* Outcome Title Context */}
                  <div className="text-[11px] font-bold text-slate-400 line-clamp-1">
                    {game.outcomeTitle}
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-black uppercase tracking-wider text-teal-600">
                      {game.tagline}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                      {game.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {game.description}
                  </p>

                  {/* Bottom Mini Meta Badge */}
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                    <span className="font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-[11px] flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>{game.reward}</span>
                    </span>

                    <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                      {game.badge}
                    </span>
                  </div>

                </div>

                {/* Bottom Actions: Hemen Oyna + Ders Akışında Aç */}
                <div className="p-6 pt-0 space-y-2">
                  <button
                    onClick={() => handleLaunchLessonGame(game)}
                    className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Hemen Oyna</span>
                  </button>

                  <Link
                    href={`/lesson/${game.outcomeId}?phase=puzzle`}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ders Akışında Gör</span>
                  </Link>
                </div>

              </div>
            ))}
          </div>

          {/* Empty state if search or filter yields nothing */}
          {filteredLessonGames.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h4 className="text-lg font-black text-slate-800">
                Aramanıza Uygun Ders Oyunu Bulunamadı
              </h4>
              <p className="text-xs text-slate-500">
                Seçtiğiniz sınıf veya kazanım filtresinde aradığınız kriterlere uyan oyun bulunamadı. Filtreleri temizleyerek tekrar deneyebilirsiniz.
              </p>
              <button
                onClick={() => {
                  setSelectedGrade(0);
                  setSelectedOutcomeId('all');
                  setSelectedGameType('all');
                  setCurriculumSearchQuery('');
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-black text-xs hover:bg-teal-700 transition-all cursor-pointer"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}

        </div>
      )}

      {/* Game Request Modal */}
      {gameRequestModalOpen && (
        <FeedbackModal
          isOpen={gameRequestModalOpen}
          onClose={() => setGameRequestModalOpen(false)}
          contextTitle="Maarif Oyun Salonu (Oyunlar Sayfası)"
          type="game_request"
          defaultSubject="[İstek Oyun] Maarif Oyun Salonu Yeni Oyun Önerisi"
          description="Oynamak istediğiniz veya matematik öğrenimini daha eğlenceli hale getirecek yeni bir oyun fikrini tarif edin. Sistem Yöneticimiz önerinizi inceleyip oyun geliştirme takvimine alacaktır."
          placeholder="Örn: Kesirlerle pizza dilimleme yarışı olsun, doğru kesri seçtikçe puan katlansın ve zamana karşı kombo yapalım..."
        />
      )}

      </div>
    </AuthGuard>
  );
}
