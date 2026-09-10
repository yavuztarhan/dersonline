'use client';

import React, { useState, useEffect } from 'react';
import {
  StudentActivityScore,
  StudentPerformanceProfile
} from '@/lib/student-performance-store';
import Link from 'next/link';
import {
  X,
  Gamepad2,
  Trophy,
  Zap,
  Sparkles,
  Calendar,
  CheckCircle2,
  Search,
  Target,
  Compass,
  Layers,
  ExternalLink
} from 'lucide-react';

interface StudentGameHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentPerformanceProfile | null;
  initialOutcomeFilter?: string | null;
}

export function StudentGameHistoryModal({
  isOpen,
  onClose,
  profile,
  initialOutcomeFilter = null
}: StudentGameHistoryModalProps) {
  const [selectedOutcomeFilter, setSelectedOutcomeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialOutcomeFilter) {
      setSelectedOutcomeFilter(initialOutcomeFilter);
    } else {
      setSelectedOutcomeFilter('all');
    }
  }, [initialOutcomeFilter, isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !profile) return null;

  const allActivities = profile.allActivities || [];

  // Filter activities
  const filteredActivities = allActivities.filter((act) => {
    const matchesOutcome =
      selectedOutcomeFilter === 'all' || act.outcomeCode === selectedOutcomeFilter;
    const matchesSearch =
      !searchQuery ||
      act.gameTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.outcomeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.outcomeTitle && act.outcomeTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesOutcome && matchesSearch;
  });

  // Aggregate stats
  const totalGamesCount = allActivities.length;
  const totalXpEarned = allActivities.reduce((acc, cur) => acc + (cur.xpEarned || 0), 0);
  const avgScore =
    totalGamesCount > 0
      ? Math.round(
          allActivities.reduce((acc, cur) => acc + (cur.percentage || 0), 0) / totalGamesCount
        )
      : 0;

  const getGameIcon = (gameType: string) => {
    switch (gameType) {
      case 'angle-radar':
        return <Target className="w-5 h-5 text-teal-600" />;
      case 'construction-bench':
        return <Compass className="w-5 h-5 text-indigo-600" />;
      case 'junction-architect':
        return <Layers className="w-5 h-5 text-purple-600" />;
      case 'memory-cards':
        return <Sparkles className="w-5 h-5 text-amber-600" />;
      default:
        return <Gamepad2 className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getScoreBadgeColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (percentage >= 75) return 'bg-teal-100 text-teal-900 border-teal-300';
    if (percentage >= 50) return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-rose-100 text-rose-900 border-rose-300';
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Distinct outcomes from profile
  const outcomeOptions = profile.outcomes || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div
        className="bg-slate-50 w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-5 sm:p-6 relative border-b border-emerald-800/40">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-10"
            title="Kapat (ESC)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 pr-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🎮
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Oyun & Etkinlik Geçmişi
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                  {profile.studentName} (#{profile.studentNumber})
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Öğrencinin atölye oyunlarında, interaktif simülasyonlarda ve mini testlerde elde ettiği tüm skor ve XP geçmişi.
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5 mt-5">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
              <div className="text-[10px] uppercase font-bold text-slate-300">Toplam Oyun</div>
              <div className="text-lg sm:text-xl font-black text-white flex items-center gap-1.5 mt-0.5">
                <Gamepad2 className="w-4 h-4 text-emerald-400" />
                <span>{totalGamesCount} Oyun</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
              <div className="text-[10px] uppercase font-bold text-slate-300">Ortalama Başarı</div>
              <div className="text-lg sm:text-xl font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>%{avgScore}</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
              <div className="text-[10px] uppercase font-bold text-slate-300">Kazanılan XP</div>
              <div className="text-lg sm:text-xl font-black text-amber-300 flex items-center gap-1.5 mt-0.5">
                <Zap className="w-4 h-4 fill-amber-300" />
                <span>+{totalXpEarned} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Oyun veya kazanım ara..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 shrink-0">Kazanım:</span>
            <select
              value={selectedOutcomeFilter}
              onChange={(e) => setSelectedOutcomeFilter(e.target.value)}
              aria-label="Kazanım Filtresi"
              className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">Tüm Kazanımlar ({allActivities.length})</option>
              {outcomeOptions.map((o) => (
                <option key={o.outcomeCode} value={o.outcomeCode}>
                  {o.outcomeCode} - {o.outcomeTitle.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Activities List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-2">
              <Gamepad2 className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-sm font-black text-slate-800">
                Oyun & Etkinlik Kaydı Bulunamadı
              </div>
              <div className="text-xs text-slate-500 max-w-sm mx-auto">
                {selectedOutcomeFilter !== 'all' || searchQuery
                  ? 'Seçtiğiniz filtreye uygun bir etkinlik kaydı bulunamadı. Filtreyi sıfırlayabilirsiniz.'
                  : 'Öğrencinin henüz tamamlanmış oyun veya etkinlik kaydı bulunmamaktadır.'}
              </div>
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-4 shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                    {getGameIcon(act.gameType)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-slate-900">
                        {act.gameTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-900 font-mono text-[10px] font-black">
                        {act.outcomeCode}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 leading-snug line-clamp-1">
                      {act.outcomeTitle}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(act.completedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Action Right */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-black text-xs ${getScoreBadgeColor(act.percentage)}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>%{act.percentage} Doğruluk</span>
                    </div>
                    <div className="text-[11px] text-amber-600 font-bold mt-0.5">
                      +{act.xpEarned} XP Kazanıldı
                    </div>
                  </div>

                  <Link
                    href={`/lesson/${act.outcomeCode}`}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-teal-500 hover:text-white text-slate-700 transition-all shadow-xs cursor-pointer"
                    title="Bu Kazanımın Dersi & Oyun Odasına Git"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100/90 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="font-semibold">
            {filteredActivities.length} / {allActivities.length} Etkinlik Listeleniyor
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
