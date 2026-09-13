'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Gamepad2,
  PenTool,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  ArrowRight,
  BellRing,
  Megaphone,
  CheckCircle2
} from 'lucide-react';
import { LATEST_ANNOUNCEMENTS, AnnouncementItem } from '@/lib/announcements-data';
import { useApp } from '@/lib/store';

export function TopAnnouncementDrawer() {
  const { playSound } = useApp();
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    // Check if user previously minimized the announcements in this session
    try {
      const savedState = sessionStorage.getItem('maarif_announcements_collapsed');
      if (savedState === 'true') {
        setIsOpen(false);
      }
    } catch {
      // default open
    }
  }, []);

  const handleToggle = () => {
    try {
      playSound('select');
    } catch {}
    const nextState = !isOpen;
    setIsOpen(nextState);
    try {
      sessionStorage.setItem('maarif_announcements_collapsed', (!nextState).toString());
    } catch {}
  };

  const handleClose = () => {
    try {
      playSound('select');
    } catch {}
    setIsOpen(false);
    try {
      sessionStorage.setItem('maarif_announcements_collapsed', 'true');
    } catch {}
  };

  const renderIcon = (iconType: AnnouncementItem['icon']) => {
    switch (iconType) {
      case 'book':
        return <BookOpen className="w-5 h-5 text-indigo-400" />;
      case 'game':
        return <Gamepad2 className="w-5 h-5 text-emerald-400" />;
      case 'pen':
        return <PenTool className="w-5 h-5 text-amber-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-teal-400" />;
    }
  };

  const getBadgeStyle = (color: AnnouncementItem['badgeColor']) => {
    switch (color) {
      case 'indigo':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'amber':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
    }
  };

  return (
    <div className="w-full relative z-30 mb-4 transition-all duration-300">
      {/* 1. Collapsed Pull Tab (Visible when closed) */}
      {!isOpen && (
        <div className="flex justify-center -mt-2 sm:-mt-1 animate-in fade-in slide-in-from-top-2 duration-300">
          <button
            onClick={handleToggle}
            type="button"
            className="group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-500/40 text-teal-200 hover:text-white hover:border-teal-400 text-xs sm:text-sm font-bold shadow-lg hover:shadow-teal-500/20 transition-all cursor-pointer backdrop-blur-md"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500" />
            </span>
            <Megaphone className="w-4 h-4 text-teal-300 group-hover:rotate-12 transition-transform" />
            <span>Son Yenilikler & Güncellemeler ({LATEST_ANNOUNCEMENTS.length})</span>
            <ChevronDown className="w-4 h-4 text-teal-400 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* 2. Slide Down Notification Panel (Expanded) */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen
            ? 'max-h-[850px] opacity-100 translate-y-0'
            : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-teal-500/30 text-white shadow-2xl p-4 sm:p-6 overflow-hidden">
          {/* Subtle Ambient Glows */}
          <div className="absolute -left-10 -top-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-0 -bottom-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Bar */}
          <div className="relative z-10 flex items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                    📢 Maarif Akademi – Son Yenilikler & Güncellemeler
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    Canlı Yayında
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Platformumuza eklenen yeni ders akışları, interaktif oyunlar ve sistem geliştirmeleri.
                </p>
              </div>
            </div>

            {/* Quick Slide-Up / Close Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleClose}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-sm"
                title="Pencereyi yukarı kapat"
              >
                <span>Yukarı Kapat</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleClose}
                type="button"
                className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 border border-slate-700 flex items-center justify-center transition-all cursor-pointer"
                title="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 mt-4">
            {LATEST_ANNOUNCEMENTS.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/70 hover:border-teal-500/50 p-4 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md hover:shadow-teal-500/10"
              >
                <div>
                  {/* Card Header: Icon & Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-700/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {renderIcon(item.icon)}
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${getBadgeStyle(
                          item.badgeColor
                        )}`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    {item.isNew && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        {item.date}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-teal-300 transition-colors leading-snug">
                    {item.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Card Action Link */}
                {item.link && (
                  <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                    <Link
                      href={item.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:text-teal-300 group-hover:translate-x-1 transition-all cursor-pointer"
                    >
                      <span>{item.linkText || 'İncele'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Pull-Up Bar */}
          <div className="relative z-10 mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                Yeni güncellemeler düzenli olarak bildirilmektedir. İhtiyacınız olduğunda üst sekmeden tekrar açabilirsiniz.
              </span>
            </div>

            <button
              onClick={handleClose}
              type="button"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white font-medium transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-slate-800"
            >
              <ChevronUp className="w-4 h-4" />
              <span>Yukarı Kaydır ve Gizle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
