"use client";

import React from "react";
import Image from "next/image";
import { MASCOT_CONFIG, isMascotEnabled } from "@/lib/mascot-config";
import { Sparkles, Compass } from "lucide-react";

export interface MascotEmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function MascotEmptyState({
  title = "Henüz Veri Bulunmuyor",
  description = "Matematik keşif yolculuğuna başlamak için ilk dersi açabilirsin!",
  actionText,
  onAction,
  className = "",
}: MascotEmptyStateProps) {
  if (!isMascotEnabled()) {
    return (
      <div className={"text-center p-8 bg-slate-50 rounded-3xl border border-slate-200 " + className}>
        <h4 className="text-base font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{description}</p>
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="mt-4 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
          >
            {actionText}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={"text-center p-8 sm:p-10 bg-gradient-to-b from-slate-50/90 to-teal-50/50 rounded-3xl border-2 border-dashed border-teal-200/80 shadow-xs flex flex-col items-center justify-center " + className}
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3">
        <Image
          src={MASCOT_CONFIG.poses.curious}
          alt={MASCOT_CONFIG.name}
          width={112}
          height={112}
          className="w-full h-full object-contain drop-shadow-sm"
        />
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-teal-700 text-white text-[9px] font-black uppercase tracking-wider shadow-xs whitespace-nowrap">
          {MASCOT_CONFIG.name}
        </span>
      </div>

      <h4 className="text-base sm:text-lg font-black text-slate-900">{title}</h4>
      <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
        "{description}"
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-6 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
