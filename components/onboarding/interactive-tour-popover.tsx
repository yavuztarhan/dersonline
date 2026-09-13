'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useOnboarding } from './onboarding-context';
import { ArrowRight, ArrowLeft, X, Sparkles, Check } from 'lucide-react';

export function InteractiveTourPopover() {
  const {
    activeTour,
    currentStep,
    currentStepIndex,
    currentSteps,
    nextStep,
    prevStep,
    skipTour
  } = useOnboarding();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Find target element and measure bounds
  useEffect(() => {
    if (!currentStep) {
      setTargetRect(null);
      return;
    }

    const updatePosition = () => {
      const el = document.querySelector(currentStep.targetSelector);
      if (el) {
        // Scroll into view if needed
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        // Fallback: center in viewport
        setTargetRect(null);
      }
    };

    // Run after scroll & render
    const timer = setTimeout(updatePosition, 100);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [currentStep]);

  if (!mounted || !activeTour || !currentStep) return null;

  // Calculate popover coordinates
  let popoverTop = 0;
  let popoverLeft = 0;
  const isLastStep = currentStepIndex === currentSteps.length - 1;

  if (targetRect) {
    const popoverWidth = 360;
    const popoverHeight = 220;
    const padding = 16;

    // Center horizontally relative to target, but keep inside viewport
    popoverLeft = Math.max(
      padding,
      Math.min(
        window.innerWidth - popoverWidth - padding,
        targetRect.left + (targetRect.width - popoverWidth) / 2
      )
    );

    // Prefer bottom placement; if not enough space, place on top
    if (targetRect.bottom + popoverHeight + padding < window.innerHeight) {
      popoverTop = targetRect.bottom + 12;
    } else if (targetRect.top - popoverHeight - padding > 0) {
      popoverTop = targetRect.top - popoverHeight - 12;
    } else {
      // If neither fits, place in middle of screen
      popoverTop = Math.max(padding, (window.innerHeight - popoverHeight) / 2);
    }
  } else {
    // Center of screen fallback
    popoverTop = typeof window !== 'undefined' ? window.innerHeight / 2 - 110 : 200;
    popoverLeft = typeof window !== 'undefined' ? window.innerWidth / 2 - 180 : 200;
  }

  return createPortal(
    <div className="fixed inset-0 z-[99999] pointer-events-none transition-all">
      
      {/* 1. Backdrop Overlay with target focus */}
      <div
        onClick={skipTour}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] pointer-events-auto transition-opacity duration-300 animate-in fade-in"
      />

      {/* 2. Target Spotlight Highlight Frame */}
      {targetRect && (
        <div
          style={{
            top: Math.max(0, targetRect.top - 6),
            left: Math.max(0, targetRect.left - 6),
            width: targetRect.width + 12,
            height: targetRect.height + 12
          }}
          className="fixed rounded-2xl border-2 border-teal-400 shadow-[0_0_0_9999px_rgba(15,23,42,0.65),0_0_30px_rgba(45,212,191,0.5)] pointer-events-none transition-all duration-300 z-[99999]"
        >
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-lg animate-pulse">
            {currentStepIndex + 1}
          </div>
        </div>
      )}

      {/* 3. The Dropbox-style Dark Popover Tooltip Card */}
      <div
        ref={popoverRef}
        style={{
          top: popoverTop,
          left: popoverLeft
        }}
        className="fixed w-[360px] max-w-[calc(100vw-32px)] bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-6 shadow-2xl border border-slate-700/90 pointer-events-auto transition-all duration-300 z-[100000] animate-in zoom-in-95 duration-200"
      >
        {/* Header: Badge & Close Button */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-black uppercase tracking-wider border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Sayfa Rehberi</span>
          </div>

          <button
            type="button"
            onClick={skipTour}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Turu Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-2">
          <h4 className="text-base font-black text-white tracking-tight leading-snug">
            {currentStep.title}
          </h4>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Footer Controls: Step Counter & Next/Prev (Dropbox Style) */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 font-bold">
            {currentStepIndex + 1} / {currentSteps.length}
          </span>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
              >
                Geri
              </button>
            )}

            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>{isLastStep ? 'Tamamla' : 'Sonraki'}</span>
              {isLastStep ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

    </div>,
    document.body
  );
}
