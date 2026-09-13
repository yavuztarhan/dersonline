'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useOnboarding } from './onboarding-context';
import { Lightbulb, Sparkles } from 'lucide-react';

export function OnboardingNavbarButton() {
  const pathname = usePathname();
  const { isEligibleUser, startTour, activeTour } = useOnboarding();

  const isTourPage = pathname === '/' || pathname === '/teacher';
  if (!isEligibleUser || activeTour || !isTourPage) return null;

  return (
    <button
      type="button"
      id="onboarding-tour-trigger"
      onClick={() => startTour()}
      className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100/90 text-teal-900 border border-teal-200/90 text-xs font-black shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
      title="Sayfa Tanıtım Turunu Yeniden Başlat"
    >
      <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
      <span className="hidden sm:inline">Sayfa Rehberi</span>
    </button>
  );
}
