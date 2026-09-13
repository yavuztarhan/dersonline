'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOnboarding } from './onboarding-context';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  ArrowRight,
  Zap,
  Rocket
} from 'lucide-react';

export function DropboxChecklistWidget() {
  const {
    isEligibleUser,
    checklistItems,
    toggleChecklistItem,
    isChecklistOpen,
    setIsChecklistOpen,
    isChecklistDismissed,
    setIsChecklistDismissed,
    startTour
  } = useOnboarding();

  const [expandedItemId, setExpandedItemId] = useState<string | null>('explore_lesson');

  if (!isEligibleUser || isChecklistDismissed) return null;

  const completedCount = checklistItems.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

  // If minimized into small floating pill in bottom-left
  if (!isChecklistOpen) {
    return (
      <div className="fixed bottom-5 left-5 z-[9990] animate-in slide-in-from-bottom duration-300">
        <button
          type="button"
          onClick={() => setIsChecklistOpen(true)}
          className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-900 text-white shadow-2xl border border-slate-700/80 backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <div className="relative w-7 h-7 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0">
            <Rocket className="w-4 h-4 text-teal-400 group-hover:animate-bounce" />
            {progressPercent === 100 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border border-slate-950" />
            )}
          </div>

          <div className="text-left space-y-0.5">
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>Hızlı Başlangıç</span>
              <span className="text-[10px] font-bold text-teal-400">%{progressPercent}</span>
            </div>
            <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-300 rounded-full"
              />
            </div>
          </div>

          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </button>
      </div>
    );
  }

  // Expanded Dropbox-Style Checklist Box
  return (
    <div className="fixed bottom-5 left-5 z-[9990] w-[340px] max-w-[calc(100vw-32px)] rounded-3xl bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/90 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
      
      {/* Header */}
      <div className="p-4 sm:p-5 pb-3 border-b border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-sm font-black text-white tracking-tight">
              Maarif Akademi’ye Başlarken
            </h4>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsChecklistOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Küçült"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsChecklistDismissed(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>{completedCount} / {checklistItems.length} tamamlandı</span>
            <span className="text-teal-400 font-black">%{progressPercent}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 transition-all duration-300 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="p-3 space-y-1.5 max-h-[300px] overflow-y-auto">
        {checklistItems.map((item) => {
          const isExpanded = expandedItemId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all ${
                item.completed
                  ? 'bg-slate-950/40 border-slate-800/80'
                  : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div
                onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                className="p-3 flex items-start justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChecklistItem(item.id);
                    }}
                    className="mt-0.5 text-teal-400 hover:text-teal-300 cursor-pointer transition-transform active:scale-90"
                    title={item.completed ? 'Tamamlanmadı olarak işaretle' : 'Tamamlandı olarak işaretle'}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 hover:text-teal-400" />
                    )}
                  </button>

                  <span
                    className={`text-xs font-bold leading-tight ${
                      item.completed ? 'line-through text-slate-400' : 'text-slate-100'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>

                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                    isExpanded ? 'rotate-180 text-teal-400' : ''
                  }`}
                />
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 pt-0 pl-9 space-y-2 text-[11px] text-slate-400 leading-relaxed animate-in fade-in duration-200">
                  <p>{item.description}</p>
                  
                  {item.actionHref && (
                    <div className="pt-1">
                      <Link
                        href={item.actionHref}
                        onClick={() => {
                          toggleChecklistItem(item.id);
                          setIsChecklistOpen(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-black text-[11px] border border-teal-500/30 transition-all cursor-pointer active:scale-95"
                      >
                        <span>{item.actionText || 'Git'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer: Restart tour anytime button */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            startTour();
            setIsChecklistOpen(false);
          }}
          className="text-xs font-bold text-teal-300 hover:text-teal-200 flex items-center gap-1.5 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Sayfa Turunu Başlat</span>
        </button>

        <span className="text-[10px] text-slate-500">Dropbox Onboarding</span>
      </div>

    </div>
  );
}
