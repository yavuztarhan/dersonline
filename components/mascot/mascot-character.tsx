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
  xs: { width: 32, height: 32, container: 'w-8 h-8' },
  sm: { width: 48, height: 48, container: 'w-12 h-12' },
  md: { width: 64, height: 64, container: 'w-16 h-16' },
  lg: { width: 96, height: 96, container: 'w-24 h-24' },
  xl: { width: 128, height: 128, container: 'w-32 h-32' },
  '2xl': { width: 180, height: 180, container: 'w-44 h-44' },
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
