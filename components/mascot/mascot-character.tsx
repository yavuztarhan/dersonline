"use client";

import React from "react";
import Image from "next/image";
import { MASCOT_CONFIG, MascotPose, isMascotEnabled } from "@/lib/mascot-config";

export interface MascotCharacterProps {
  pose?: MascotPose;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  bubble?: string | React.ReactNode;
  bubblePosition?: "top" | "bottom" | "left" | "right";
  animate?: boolean;
  className?: string;
  onClick?: () => void;
  showBadge?: boolean;
  badgeText?: string;
}

const SIZE_MAP = {
  xs: { width: 36, height: 36, container: "w-9 h-9" },
  sm: { width: 48, height: 48, container: "w-12 h-12" },
  md: { width: 72, height: 72, container: "w-18 h-18" },
  lg: { width: 110, height: 110, container: "w-28 h-28" },
  xl: { width: 150, height: 150, container: "w-36 h-36" },
  "2xl": { width: 220, height: 220, container: "w-52 h-52" },
};

export function MascotCharacter({
  pose = "proud",
  size = "md",
  bubble,
  bubblePosition = "right",
  animate = true,
  className = "",
  onClick,
  showBadge = false,
  badgeText = MASCOT_CONFIG.name,
}: MascotCharacterProps) {
  if (!isMascotEnabled()) return null;

  const imageSrc = MASCOT_CONFIG.poses[pose] || MASCOT_CONFIG.poses.proud;
  const sizeConfig = SIZE_MAP[size];

  const bubbleClasses = {
    right: "left-full ml-3 top-1/2 -translate-y-1/2",
    left: "right-full mr-3 top-1/2 -translate-y-1/2",
    top: "bottom-full mb-3 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-3 left-1/2 -translate-x-1/2",
  }[bubblePosition];

  return (
    <div
      className={"relative inline-flex items-center justify-center select-none " + (onClick ? "cursor-pointer group " : "") + className}
      onClick={onClick}
    >
      <div
        className={"relative shrink-0 " + sizeConfig.container + (animate ? " hover:scale-105 transition-transform duration-300" : "")}
      >
        <Image
          src={imageSrc}
          alt={MASCOT_CONFIG.name + " - " + pose}
          width={sizeConfig.width}
          height={sizeConfig.height}
          className="w-full h-full object-contain drop-shadow-md"
          priority={size === "xl" || size === "2xl"}
        />

        {showBadge && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm border border-white whitespace-nowrap">
            {badgeText}
          </span>
        )}
      </div>

      {bubble && (
        <div
          className={"absolute z-20 pointer-events-auto bg-white/95 backdrop-blur-md text-slate-800 text-xs font-semibold px-3.5 py-2.5 rounded-2xl shadow-xl border border-teal-100 max-w-xs animate-in fade-in zoom-in-95 duration-200 " + bubbleClasses}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-black text-teal-800 uppercase tracking-wide mb-1 border-b border-teal-50 pb-0.5">
            <span>✨ {MASCOT_CONFIG.name}</span>
          </div>
          <div className="leading-relaxed">{bubble}</div>
        </div>
      )}
    </div>
  );
}
