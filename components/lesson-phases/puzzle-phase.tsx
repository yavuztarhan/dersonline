'use client';

import React, { useState } from 'react';
import { PuzzlePhaseData, PuzzleItem } from '@/types';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import { WordSearchGame } from '@/components/lesson-phases/word-search-game';
import { TrueFalseGame } from '@/components/lesson-phases/true-false-game';
import {
  Puzzle,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Trophy,
  Search,
  Zap,
  Gamepad2,
  ChevronRight
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

export type PuzzleGameId = 'matching' | 'wordsearch' | 'truefalse';

export function PuzzlePhase({ data, onNextPhase }: PuzzlePhaseProps) {
  const { playSound, unlockBadge, addPoints, role } = useApp();

  const [activeGame, setActiveGame] = useState<PuzzleGameId>('matching');

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

  const GAMES_LIST: Array<{
    id: PuzzleGameId;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge: string;
    color: string;
  }> = [
    {
      id: 'matching',
      title: 'Kavram & Sembol Eşleştirme',
      description: 'Geometrik modelleri, formülleri ve tanımları eşleştir.',
      icon: <Puzzle className="w-6 h-6" />,
      badge: '4 Çift • Eşleştirme',
      color: 'from-teal-500 to-emerald-600'
    },
    {
      id: 'wordsearch',
      title: 'Matematiksel Kelime Avı',
      description: 'Soruları oku, gizli geometrik kavramları bulmacada yakala!',
      icon: <Search className="w-6 h-6" />,
      badge: '6 Soru • Akıl Yürütme',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'truefalse',
      title: 'Hızlı Doğru / Yanlış Testi',
      description: 'Geometrik önermeleri hızlıca değerlendir, puanları topla!',
      icon: <Zap className="w-6 h-6" />,
      badge: '5 Önerme • Hız & Refleks',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Gamepad2 className="w-3.5 h-3.5 text-teal-600" />
            <span>3. Aşama: Eğitici Matematik Bulmacaları ve Oyunlar</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800">Kavram & Bulmaca İstasyonu</h2>
          <p className="text-xs text-slate-500 mt-1">
            İstediğiniz bulmaca veya oyunu kartlardan seçerek derse devam edebilirsiniz.
          </p>
        </div>

        <button
          onClick={() => {
            playSound('select');
            onNextPhase();
          }}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
        >
          <span>4. Aşamaya Geç (Değerlendirme)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* GAME SELECTION CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GAMES_LIST.map((game) => {
          const isSelected = activeGame === game.id;
          return (
            <button
              key={game.id}
              onClick={() => {
                setActiveGame(game.id);
                playSound('select');
              }}
              className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between space-y-3 active:scale-98 ${
                isSelected
                  ? 'bg-white border-teal-500 ring-2 ring-teal-400 shadow-lg scale-102'
                  : 'bg-white/80 border-slate-200 hover:border-teal-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-xs`}
                >
                  {game.icon}
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${
                    isSelected ? 'bg-teal-100 text-teal-900' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {game.badge}
                </span>
              </div>

              <div>
                <h3 className="font-black text-slate-900 text-base">{game.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{game.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                <span>{isSelected ? 'Şu An Açık' : 'Oyunu Başlat'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* GAME 1: MATCHING GAME CONTAINER */}
      {activeGame === 'matching' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-extrabold text-teal-700 uppercase">1. Oyun Modu</div>
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

              <button
                onClick={() => {
                  setActiveGame('wordsearch');
                  playSound('select');
                }}
                className="whitespace-nowrap px-6 py-3.5 rounded-2xl bg-white text-emerald-900 font-black text-sm shadow-md hover:bg-emerald-50 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>2. Oyuna Geç: Kelime Avı 🔍</span>
                <ArrowRight className="w-4 h-4" />
              </button>
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
                          : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="text-base font-black tracking-tight">{card.text}</div>
                        {card.subtext && (
                          <div className="text-xs text-slate-500 mt-0.5">{card.subtext}</div>
                        )}
                      </div>

                      {card.matched ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold">
                          ?
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Symbols & Descriptions */}
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
                          : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="inline-block px-3 py-1 rounded-lg bg-slate-900 text-white font-mono font-black text-sm">
                          {card.text}
                        </span>
                        {card.subtext && (
                          <p className="text-xs text-slate-600 leading-snug">{card.subtext}</p>
                        )}
                      </div>

                      {card.matched ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 ml-3">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0 ml-3">
                          🎯
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* GAME 2: QUESTION-BASED WORD SEARCH GAME */}
      {activeGame === 'wordsearch' && (
        <div className="animate-in fade-in duration-200">
          <WordSearchGame />
        </div>
      )}

      {/* GAME 3: TRUE / FALSE SPEED QUIZ */}
      {activeGame === 'truefalse' && (
        <div className="animate-in fade-in duration-200">
          <TrueFalseGame />
        </div>
      )}

    </div>
  );
}
