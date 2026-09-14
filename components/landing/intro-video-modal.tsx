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
  GraduationCap
} from 'lucide-react';

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

  useEffect(() => {
    setMounted(true);
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
  }, [isOpen]);

  // Autoplay or pause on open/close
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy might require user gesture or muted
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  const handleClose = () => {
    playSound('click');
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
                  Tanıtım Videosu
                </span>
                <span className="text-[11px] font-bold text-teal-300">
                  Maarif Modeli Matematik Platformu
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
                Selim ile 1 Dakikada Geleceğin Sınıfını Keşfedin
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Kapat (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative bg-black aspect-video w-full flex items-center justify-center overflow-hidden group">
          <video
            ref={videoRef}
            src="/media/intro.mp4"
            controls
            playsInline
            className="w-full h-full object-contain max-h-[65vh]"
          >
            Tarayıcınız video oynatmayı desteklemiyor.
          </video>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left space-y-0.5">
            <div className="text-xs font-black text-white flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ders Odalarını ve Akıllı Tahtayı Hemen Deneyimleyin</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Kayıt olmadan da şifresiz demo modunu açabilir veya ücretsiz öğretmen kaydı oluşturabilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
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
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
