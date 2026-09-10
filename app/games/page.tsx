'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import { MascotCharacter } from '@/components/mascot';
import { STANDALONE_GAMES, StandaloneGame } from '@/lib/standalone-games-data';
import { MultiplicationGame } from '@/components/games/multiplication-game';
import { MathWheelGame } from '@/components/games/math-wheel-game';
import { FeedbackModal } from '@/components/feedback/feedback-modal';
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
  MessageSquarePlus
} from 'lucide-react';

export default function GamesPage() {
  const { currentUser } = useAuth();
  const { studentPoints, playSound } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [gameRequestModalOpen, setGameRequestModalOpen] = useState<boolean>(false);

  // If a game is currently active, render that game directly!
  if (activeGameId === 'matematik-carki') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MathWheelGame onBackToHub={() => setActiveGameId(null)} />
      </div>
    );
  }

  if (activeGameId === 'carpim-tablosu') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MultiplicationGame onBackToHub={() => setActiveGameId(null)} />
      </div>
    );
  }

  const categories = [
    { id: 'all', label: 'Tümü', icon: '🌟' },
    { id: 'math', label: 'Matematik & Mantık', icon: '🔢' },
    { id: 'logic', label: 'Zeka & Strateji', icon: '🧠' },
    { id: 'memory', label: 'Hafıza & Eşleştirme', icon: '🃏' },
    { id: 'speed', label: 'Hız & Dikkat', icon: '⚡' },
  ];

  const filteredGames = STANDALONE_GAMES.filter((game) => {
    const matchesCat = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
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

      {/* 2. Hero Banner: Maarif Oyun Salonu */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl border border-indigo-900/50">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4 text-indigo-400" />
              <span>Maarif Oyun Salonu • Zeka & Beceri Laboratuvarı</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Eğlenerek Öğren, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-300">
                Mantık & Hızını Geliştir!
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Ders akışlarındaki kazanım oyunlarının haricinde, genel matematiksel düşünme, uzamsal beceri, mantık yürütme ve problem çözme reflekslerinizi geliştirecek bağımsız eğitici oyunlar dünyası.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/15 text-slate-200 font-semibold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Her Yaşa ve Seviyeye Uygun</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/15 text-slate-200 font-semibold">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>XP ve Başarı Rozetleri</span>
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

      {/* 3. Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
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
            placeholder="Oyun veya kategori ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>

      </div>

      {/* 4. Standalone Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredGames.map((game) => (
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

                <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg border ${game.badgeColor}`}>
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
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Zorluk</div>
                  <div className="font-black text-slate-800 mt-0.5">{game.difficulty}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Süre</div>
                  <div className="font-black text-slate-800 mt-0.5">{game.duration}</div>
                </div>
                <div className="bg-amber-50/70 p-2.5 rounded-2xl border border-amber-200/60">
                  <div className="text-[10px] text-amber-600 font-bold uppercase">Ödül</div>
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
                  <span>İlk Oyunumuz Çok Yakında Yayında</span>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* 5. Custom Game Design Notice / Workspace Box */}
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
            Hangi matematiksel beceriyi, mantık bulmacasını veya zeka oyununu eklemek istersiniz? Kuralları, mekaniği ve görsel temayı belirleyerek ilk oyunumuzu hayata geçirebiliriz.
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
  );
}
