'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '@/lib/store';
import { MASCOT_CONFIG } from '@/lib/mascot-config';
import Image from 'next/image';
import {
  X,
  Play,
  Sparkles,
  ArrowRight,
  GraduationCap,
  EyeOff,
  Check,
  FileText
} from 'lucide-react';

export const HIDE_INTRO_VIDEO_STORAGE_KEY = 'maarif_hide_intro_video';

interface IntroVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
}

export function IntroVideoModal({
  isOpen,
  onClose,
  onOpenLogin,
  onOpenRegister
}: IntroVideoModalProps) {
  const { playSound } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(HIDE_INTRO_VIDEO_STORAGE_KEY);
        if (saved === 'true') {
          setDontShowAgain(true);
        }
      }
    } catch (e) {}
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dontShowAgain]);

  // Autoplay or pause on open/close
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy might require muted fallback
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  const saveDontShowPreference = (value: boolean) => {
    try {
      if (typeof window !== 'undefined') {
        if (value) {
          localStorage.setItem(HIDE_INTRO_VIDEO_STORAGE_KEY, 'true');
        } else {
          localStorage.removeItem(HIDE_INTRO_VIDEO_STORAGE_KEY);
        }
      }
    } catch (e) {}
  };

  const handleClose = () => {
    playSound('click');
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (dontShowAgain) {
      saveDontShowPreference(true);
    }
    onClose();
  };

  const handleDismissForever = () => {
    playSound('click');
    setDontShowAgain(true);
    saveDontShowPreference(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border-b border-teal-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 overflow-hidden flex items-center justify-center shrink-0">
              <Image
                src={MASCOT_CONFIG.poses.pointing}
                alt="Selim"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Karşılama & Tanıtım
                </span>
                <span className="text-[11px] font-bold text-teal-300 hidden sm:inline">
                  Türkiye Yüzyılı Maarif Modeli
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
                Selim ile 1 Dakikada Geleceğin Sınıfını Keşfedin
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Kapat (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="relative bg-black aspect-video w-full flex items-center justify-center overflow-hidden group">
          <video
            ref={videoRef}
            src="/media/intro.mp4"
            controls
            playsInline
            className="w-full h-full object-contain max-h-[62vh]"
          >
            Tarayıcınız video oynatmayı desteklemiyor.
          </video>
        </div>

        {/* Bottom Action & Preferences Footer */}
        <div className="p-4 sm:p-5 bg-slate-900/95 border-t border-slate-800 flex flex-col gap-3">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Left: Don't show again toggle & quick hint */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer select-none bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-teal-500/40 transition-colors">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setDontShowAgain(val);
                    saveDontShowPreference(val);
                  }}
                  className="w-4 h-4 rounded border-slate-600 text-teal-500 focus:ring-teal-400 bg-slate-900 cursor-pointer accent-teal-500"
                />
                <span className="text-slate-200">Bir daha otomatik gösterme</span>
              </label>

              <button
                type="button"
                onClick={handleDismissForever}
                className="text-[11px] text-slate-400 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer hidden sm:inline"
              >
                Bir daha gösterme ve kapat
              </button>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
              {onOpenLogin && (
                <button
                  onClick={() => {
                    handleClose();
                    onOpenLogin();
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Giriş Yap / Başla</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {onOpenRegister && (
                <button
                  onClick={() => {
                    handleClose();
                    onOpenRegister();
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                  <span>Öğretmen Kaydı</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleClose}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
              >
                Kapat
              </button>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Tanıtım videosunu anasayfadaki <strong>"Tanıtımı İzle"</strong> butonundan dilediğiniz zaman tekrar izleyebilirsiniz.</span>
            </span>

            {/* Tanıtım Kitapçığı PDF İndirme Linki (Daha sonra aktif edilecek):
            <a
              href="/downloads/maarif-akademi-tanitim-rehberi.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="maarif-akademi-tanitim-rehberi.pdf"
              className="inline-flex items-center gap-1.5 text-teal-300 hover:text-teal-200 font-bold underline underline-offset-2 shrink-0 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tanıtım Kitapçığı (PDF) İndir</span>
            </a>
            */}
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
}
