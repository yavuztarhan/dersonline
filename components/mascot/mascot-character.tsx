"use client";

import React from "react";
import Image from "next/image";
import { MASCOT_CONFIG, MascotPose, isMascotEnabled } from "@/lib/mascot-config";

export interface MascotCharacterProps {
  pose?: MascotPose;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  bubble?: string | React.ReactNode;
  bubblePosition?: "top" | "bottom" | "left" | "right";
  animate?: boolean;
  className?: string;
  onClick?: () => void;
  showBadge?: boolean;
  badgeText?: string;
}

const SIZE_MAP = {
  xs: { width: 36, height: 36, container: 'w-9 h-9' },
  sm: { width: 56, height: 56, container: 'w-14 h-14' },
  md: { width: 80, height: 80, container: 'w-20 h-20' },
  lg: { width: 120, height: 120, container: 'w-28 h-28 sm:w-32 sm:h-32' },
  xl: { width: 160, height: 160, container: 'w-36 h-36 sm:w-44 sm:h-44' },
  '2xl': { width: 220, height: 220, container: 'w-48 h-48 sm:w-56 sm:h-56' },
  '3xl': { width: 300, height: 300, container: 'w-64 h-64 sm:w-72 sm:h-72' },
};

export function MascotCharacter({
  pose = 'proud',
  size = 'md',
  bubble,
  bubblePosition = 'right',
  animate = true,
  className = '',
  onClick,
  showBadge = false,
  badgeText = MASCOT_CONFIG.name,
}: MascotCharacterProps) {
  if (!isMascotEnabled()) return null;

  const imageSrc = MASCOT_CONFIG.poses[pose] || MASCOT_CONFIG.poses.proud;
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  const bubbleClasses = {
    right: 'left-full ml-3 top-1/2 -translate-y-1/2',
    left: 'right-full mr-3 top-1/2 -translate-y-1/2',
    top: 'bottom-full mb-3 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-3 left-1/2 -translate-x-1/2',
  }[bubblePosition];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        onClick ? 'cursor-pointer group ' : ''
      }${className}`}
      onClick={onClick}
    >
      <div
        className={`relative shrink-0 flex items-center justify-center ${sizeConfig.container} ${
          animate ? 'hover:scale-105 transition-transform duration-300' : ''
        }`}
      >
        <Image
          src={imageSrc}
          alt={`${MASCOT_CONFIG.name} - ${pose}`}
          width={sizeConfig.width}
          height={sizeConfig.height}
          className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-md"
          priority={size === 'xl' || size === '2xl'}
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
