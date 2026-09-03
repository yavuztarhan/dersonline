'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
  Search,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Lightbulb,
  Award,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';

interface WordClue {
  id: string;
  question: string;
  word: string; // Turkish uppercase without special accents if needed or standard TR uppercase
  hint: string;
  color: string;
}

const CLUES: WordClue[] = [
  {
    id: 'c1',
    question: 'İki ucu da sınırlı olan ve boyu cetvelle ölçülebilen düz çizgi modeline ne denir?',
    word: 'DOGRUPARCASI',
    hint: '12 Harfli • Sembolü [AB]',
    color: '#10b396'
  },
  {
    id: 'c2',
    question: 'Başlangıç noktası sabit olup diğer ucu uzayda sonsuza uzanan fener ışığı modeline ne denir?',
    word: 'ISIN',
    hint: '4 Harfli • Sembolü [AB',
    color: '#3b82f6'
  },
  {
    id: 'c3',
    question: 'Her iki yönden de sınırsızca uzayan ve iki ucuna ok konulan çizgi modeline ne denir?',
    word: 'DOGRU',
    hint: '5 Harfli • Sembolü AB',
    color: '#f59e0b'
  },
  {
    id: 'c4',
    question: 'Boyutu, eni veya boyu olmayan, uzayda sadece bir konum belirten geometrik ize ne denir?',
    word: 'NOKTA',
    hint: '5 Harfli • Büyük harfle isimlendirilir',
    color: '#8b5cf6'
  },
  {
    id: 'c5',
    question: 'Doğru parçasının iki ucu arasındaki mesafeyi ölçmek için kullanılan araca ne denir?',
    word: 'CETVEL',
    hint: '6 Harfli • Üzerinde santimetre ve milimetre çizgileri vardır',
    color: '#ec4899'
  },
  {
    id: 'c6',
    question: 'Doğru ve ışın modellerinin sınırsız uzandığını belirtmek için uçlarına konulan işarete ne denir?',
    word: 'OK',
    hint: '2 Harfli • Yön belirtir',
    color: '#ef4444'
  }
];

// Fixed 10x12 Word Search Grid designed for the clues
// Words placed:
// Row 0: D O G R U P A R C A S I (DOGRUPARCASI - Horizontal across row 0)
// Row 2, Col 1-5: N O K T A (Horizontal)
// Row 4, Col 2-5: I S I N (Horizontal)
// Row 6, Col 1-5: D O G R U (Horizontal)
// Row 8, Col 2-7: C E T V E L (Horizontal)
// Row 5, Col 8-9: O K (Horizontal)
const FIXED_GRID = [
  ['D', 'O', 'G', 'R', 'U', 'P', 'A', 'R', 'C', 'A', 'S', 'I'],
  ['M', 'K', 'L', 'T', 'B', 'Z', 'Y', 'P', 'Q', 'E', 'F', 'H'],
  ['A', 'N', 'O', 'K', 'T', 'A', 'S', 'V', 'B', 'K', 'L', 'M'],
  ['B', 'R', 'P', 'S', 'F', 'G', 'H', 'M', 'N', 'A', 'C', 'E'],
  ['T', 'Y', 'I', 'S', 'I', 'N', 'K', 'L', 'P', 'O', 'K', 'Z'],
  ['K', 'M', 'A', 'B', 'C', 'D', 'E', 'F', 'O', 'K', 'S', 'T'],
  ['E', 'D', 'O', 'G', 'R', 'U', 'H', 'J', 'K', 'L', 'M', 'N'],
  ['F', 'G', 'H', 'P', 'R', 'S', 'T', 'Y', 'Z', 'A', 'B', 'C'],
  ['M', 'A', 'C', 'E', 'T', 'V', 'E', 'L', 'K', 'P', 'R', 'S'],
  ['X', 'Y', 'Z', 'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
];

interface CellPos {
  row: number;
  col: number;
}

export function WordSearchGame() {
  const { playSound, addPoints, unlockBadge, role } = useApp();

  const [foundWordIds, setFoundWordIds] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<CellPos[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  // Check if cell is in a found word
  // Map of cells to colors
  const [foundCellColors, setFoundCellColors] = useState<Record<string, string>>({});

  const isCellSelected = (r: number, c: number) => {
    return selectedCells.some((cell) => cell.row === r && cell.col === c);
  };

  const getCellColor = (r: number, c: number) => {
    const key = `${r}-${c}`;
    return foundCellColors[key] || null;
  };

  const startSelection = (r: number, c: number) => {
    setIsSelecting(true);
    setSelectedCells([{ row: r, col: c }]);
    playSound('click');
  };

  const updateSelection = (r: number, c: number) => {
    if (!isSelecting || selectedCells.length === 0) return;
    const start = selectedCells[0];
    const end = { row: r, col: c };

    // Calculate straight line cells (horizontal, vertical, diagonal)
    const newCells: CellPos[] = [];
    const dRow = end.row - start.row;
    const dCol = end.col - start.col;
    const steps = Math.max(Math.abs(dRow), Math.abs(dCol));

    if (steps === 0) {
      newCells.push(start);
    } else {
      const stepRow = dRow === 0 ? 0 : dRow / Math.abs(dRow);
      const stepCol = dCol === 0 ? 0 : dCol / Math.abs(dCol);

      // Only allow straight horizontal, vertical, or 45deg diagonal
      if (dRow === 0 || dCol === 0 || Math.abs(dRow) === Math.abs(dCol)) {
        for (let i = 0; i <= steps; i++) {
          newCells.push({
            row: start.row + i * stepRow,
            col: start.col + i * stepCol
          });
        }
      }
    }

    if (newCells.length > 0) {
      setSelectedCells(newCells);
    }
  };

  const endSelection = () => {
    if (!isSelecting) return;
    setIsSelecting(false);

    if (selectedCells.length < 2) {
      setSelectedCells([]);
      return;
    }

    // Build the string from selected cells
    const forwardWord = selectedCells.map((c) => FIXED_GRID[c.row][c.col]).join('');
    const reverseWord = forwardWord.split('').reverse().join('');

    // Check against clues
    const matchedClue = CLUES.find(
      (clue) =>
        !foundWordIds.includes(clue.id) &&
        (clue.word === forwardWord || clue.word === reverseWord)
    );

    if (matchedClue) {
      playSound('success');
      setFoundWordIds((prev) => [...prev, matchedClue.id]);
      addPoints(20);

      // Save colors for found cells
      const newColors = { ...foundCellColors };
      selectedCells.forEach((cell) => {
        newColors[`${cell.row}-${cell.col}`] = matchedClue.color;
      });
      setFoundCellColors(newColors);

      if (foundWordIds.length + 1 === CLUES.length) {
        unlockBadge('puzzle-pro');
        addPoints(60);
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    } else {
      playSound('click');
    }

    setSelectedCells([]);
  };

  const resetGame = () => {
    playSound('clear');
    setFoundWordIds([]);
    setSelectedCells([]);
    setFoundCellColors({});
    setRevealedHints({});
    setShowAllAnswers(false);
  };

  const toggleHint = (clueId: string) => {
    playSound('click');
    setRevealedHints((prev) => ({
      ...prev,
      [clueId]: !prev[clueId]
    }));
  };

  const isAllFound = foundWordIds.length === CLUES.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/30 text-teal-200 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-400/20">
            <Search className="w-3.5 h-3.5 text-teal-300" />
            <span>Soru Temelli Matematiksel Kelime Avı</span>
          </div>
          <h3 className="text-xl font-black text-white">Geometrik Kavramları Sorularla Keşfet</h3>
          <p className="text-xs text-teal-100 mt-1 max-w-xl">
            Sol paneldeki soruları dikkatlice okuyunuz; cevabı bulmaca tablosunda harfleri parmağınızla/fareyle seçerek işaretleyiniz!
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role === 'teacher' && (
            <button
              onClick={() => setShowAllAnswers(!showAllAnswers)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
            >
              {showAllAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showAllAnswers ? 'Cevapları Gizle' : 'Cevapları Göster'}</span>
            </button>
          )}

          <button
            onClick={resetGame}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            title="Yeniden Başlat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      {isAllFound && (
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in duration-300">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
              🎉
            </div>
            <div>
              <h4 className="text-xl font-black">Tebrikler! Tüm Kavramları Başarıyla Buldun</h4>
              <p className="text-xs text-emerald-100">
                6 gizli geometrik kavramın tamamını soruları çözerek buldun. +60 Puan kazandın!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid & Questions Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Questions & Clues (Width 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Sorular & İpuçları ({foundWordIds.length} / {CLUES.length} Bulundu)
              </span>
              <span className="text-xs font-bold text-teal-600">Her Doğru: +20 Puan</span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {CLUES.map((clue, idx) => {
                const isFound = foundWordIds.includes(clue.id);
                const isHintOpen = revealedHints[clue.id] || showAllAnswers;

                return (
                  <div
                    key={clue.id}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 space-y-2 ${
                      isFound
                        ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 shadow-2xs'
                        : 'bg-slate-50/70 border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded-lg text-white font-black text-xs flex items-center justify-center shrink-0"
                          style={{ backgroundColor: clue.color }}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">
                          Soru {idx + 1}
                        </span>
                      </div>

                      {isFound ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-extrabold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Çözüldü: {clue.word}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => toggleHint(clue.id)}
                          className="text-[10px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 flex items-center gap-1"
                        >
                          <Lightbulb className="w-3 h-3 text-teal-600" />
                          <span>{isHintOpen ? 'İpucu Kapat' : 'İpucu'}</span>
                        </button>
                      )}
                    </div>

                    <p className="text-xs font-medium text-slate-700 leading-relaxed">
                      "{clue.question}"
                    </p>

                    {/* Hint / Revealed Answer Box */}
                    {isHintOpen && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-semibold animate-in fade-in flex items-center justify-between">
                        <span>💡 {clue.hint}</span>
                        {showAllAnswers && (
                          <span className="font-mono font-black bg-amber-200 px-2 py-0.5 rounded text-amber-950">
                            {clue.word}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Word Grid (Width 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-center space-y-4">
            
            <div className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 border-b border-slate-100 pb-2">
              <span>Harflerin üzerinden basılı tutarak veya tıklayarak kelimeyi seçin</span>
              <span className="text-teal-700 font-bold">10 × 12 Izgara</span>
            </div>

            {/* Letter Grid Matrix */}
            <div
              className="grid grid-cols-12 gap-1.5 sm:gap-2 p-3 bg-slate-900 rounded-2xl select-none touch-none shadow-inner max-w-full overflow-x-auto"
              onPointerLeave={endSelection}
              onPointerUp={endSelection}
            >
              {FIXED_GRID.map((row, rIdx) =>
                row.map((letter, cIdx) => {
                  const selected = isCellSelected(rIdx, cIdx);
                  const foundColor = getCellColor(rIdx, cIdx);

                  let cellBg = 'bg-slate-800 text-white hover:bg-slate-700';

                  if (selected) {
                    cellBg = 'bg-teal-400 text-slate-950 font-black scale-105 ring-2 ring-white shadow-lg';
                  } else if (foundColor) {
                    cellBg = 'text-white font-black shadow-md';
                  }

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      onPointerDown={() => startSelection(rIdx, cIdx)}
                      onPointerEnter={() => updateSelection(rIdx, cIdx)}
                      className={`w-7 h-7 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-base font-black cursor-pointer transition-all duration-100 ${cellBg}`}
                      style={{
                        backgroundColor: !selected && foundColor ? foundColor : undefined
                      }}
                    >
                      {letter}
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Helper Legend */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-teal-500" /> Yatay & Çapraz Seçim Yapılabilir
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Bulunan Kelimeler Rengarenk Kilitlenir
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
