"use client";

import React from "react";
import Image from "next/image";
import { MASCOT_CONFIG, MascotPose, isMascotEnabled } from "@/lib/mascot-config";
import { Sparkles, MessageCircle } from "lucide-react";

export interface MascotDialogueBoxProps {
  pose?: MascotPose;
  speaker?: string;
  dialogue?: string;
  className?: string;
  highlightText?: string;
}

export function MascotDialogueBox({
  pose = "curious",
  speaker = MASCOT_CONFIG.name + " (" + MASCOT_CONFIG.title + ")",
  dialogue,
  className = "",
  highlightText,
}: MascotDialogueBoxProps) {
  if (!isMascotEnabled()) {
    return (
      <div className={"flex items-start gap-3 bg-teal-50/70 p-4 rounded-2xl border border-teal-200/80 " + className}>
        <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-black text-teal-900">{speaker}</div>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 italic leading-relaxed">
            "{dialogue}"
          </p>
        </div>
      </div>
    );
  }

  const imageSrc = MASCOT_CONFIG.poses[pose] || MASCOT_CONFIG.poses.curious;

  return (
    <div
      className={"flex items-center gap-4 bg-gradient-to-r from-amber-50/90 via-teal-50/70 to-emerald-50/60 p-4 sm:p-4.5 rounded-3xl border-2 border-amber-200/80 shadow-xs relative overflow-hidden " + className}
    >
      <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-amber-200 to-teal-100 rounded-2xl p-1 shadow-sm border border-white flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={MASCOT_CONFIG.name}
          width={80}
          height={80}
          className="w-full h-full object-contain drop-shadow-sm"
        />
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-teal-700 text-white text-[9px] font-black uppercase tracking-wider border border-white">
          {MASCOT_CONFIG.name}
        </span>
      </div>

      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            {speaker}
          </span>
          {highlightText && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
              {highlightText}
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-800 italic leading-relaxed">
          "{dialogue || MASCOT_CONFIG.quotes.storyIntro}"
        </p>
      </div>
    </div>
  );
}
