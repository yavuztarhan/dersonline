"use client";

import React from "react";
import Image from "next/image";
import { MASCOT_CONFIG, isMascotEnabled } from "@/lib/mascot-config";
import { Sparkles, Trophy } from "lucide-react";

export interface MascotCelebrationProps {
  title?: string;
  message?: string;
  pointsEarned?: number;
  badgeName?: string;
  className?: string;
}

export function MascotCelebration({
  title = "Harika Bir Başarı!",
  message = MASCOT_CONFIG.quotes.celebrateXP,
  pointsEarned,
  badgeName,
  className = "",
}: MascotCelebrationProps) {
  if (!isMascotEnabled()) return null;

  return (
    <div
      className={"relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-teal-700 rounded-3xl p-6 text-white shadow-2xl flex flex-col sm:flex-row items-center gap-6 " + className}
    >
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 bg-white/15 rounded-3xl p-2 border-2 border-white/30 shadow-inner flex items-center justify-center">
        <Image
          src={MASCOT_CONFIG.poses.success}
          alt={MASCOT_CONFIG.name}
          width={140}
          height={140}
          className="w-full h-full object-contain drop-shadow-lg animate-bounce"
        />
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400 shadow-md whitespace-nowrap">
          {MASCOT_CONFIG.name} Kutluyor 🎉
        </span>
      </div>

      <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{title}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
          {badgeName ? `"${badgeName}" Rozetini Kazandın!` : "Tebrikler!"}
        </h3>

        <p className="text-xs sm:text-sm font-medium text-amber-50 leading-relaxed max-w-md">
          "{message}"
        </p>

        {pointsEarned !== undefined && (
          <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 text-amber-300 font-black text-sm flex items-center gap-1.5 shadow-md border border-amber-400/40">
              <Trophy className="w-4 h-4 text-amber-400" />
              +{pointsEarned} Maarif XP
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
