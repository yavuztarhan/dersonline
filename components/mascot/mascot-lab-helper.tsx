"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MASCOT_CONFIG, isMascotEnabled } from "@/lib/mascot-config";
import { ChevronRight, X, Compass } from "lucide-react";

export interface MascotLabHelperProps {
  hint?: string;
  toolName?: string;
  defaultOpen?: boolean;
}

export function MascotLabHelper({
  hint = MASCOT_CONFIG.quotes.labCompass,
  toolName = "Geometri & Çizim Atölyesi",
  defaultOpen = false,
}: MascotLabHelperProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!isMascotEnabled()) return null;

  return (
    <div className="relative">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-50 to-teal-50 border border-amber-300/80 hover:border-amber-400 text-slate-800 font-black text-xs shadow-xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
        >
          <div className="relative w-8 h-8 rounded-xl bg-white p-0.5 shadow-2xs border border-amber-200">
            <Image
              src={MASCOT_CONFIG.poses.measuring}
              alt={MASCOT_CONFIG.name}
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-amber-700 uppercase font-black tracking-wide">
              {MASCOT_CONFIG.name}'den Tüyo
            </div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <span>Atölye İpucu</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </button>
      ) : (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-50/95 via-teal-50/90 to-emerald-50/90 border-2 border-amber-300 shadow-xl max-w-md animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl bg-white p-1 shadow-sm border border-amber-200 shrink-0">
                <Image
                  src={MASCOT_CONFIG.poses.measuring}
                  alt={MASCOT_CONFIG.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                  <span>{MASCOT_CONFIG.name} • {toolName}</span>
                </div>
                <div className="text-[10px] font-semibold text-teal-800">
                  {MASCOT_CONFIG.title}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-2.5 text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed bg-white/80 p-3 rounded-2xl border border-amber-200/60">
            "{hint}"
          </p>
        </div>
      )}
    </div>
  );
}
