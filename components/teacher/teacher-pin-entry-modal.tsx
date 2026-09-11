'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  X,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Tv
} from 'lucide-react';

interface TeacherPinEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeacherPinEntryModal({ isOpen, onClose }: TeacherPinEntryModalProps) {
  const { currentUser } = useAuth();
  const { playSound } = useApp();

  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const inputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null)
  ];

  useEffect(() => {
    if (isOpen) {
      setPinDigits(['', '', '', '']);
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsSubmitting(false);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, val: string) => {
    const char = val.slice(-1).toUpperCase();
    const nextDigits = [...pinDigits];
    nextDigits[index] = char;
    setPinDigits(nextDigits);
    setErrorMessage(null);

    // Auto-advance to next box if filled
    if (char && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // If all 4 filled, automatically submit
    if (char && index === 3) {
      const fullPin = nextDigits.join('');
      if (fullPin.length === 4) {
        submitPin(fullPin);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (pasted.length >= 4) {
      const chars = pasted.slice(0, 4).split('');
      setPinDigits(chars);
      submitPin(chars.join(''));
    }
  };

  const submitPin = async (pinString: string) => {
    if (pinString.length !== 4) {
      setErrorMessage('Lütfen 4 haneli PIN kodunu eksiksiz giriniz.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/board-session/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: pinString,
          teacherUser: currentUser
        })
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMessage(data.error || 'PIN kodu geçersiz veya süresi dolmuş.');
        playSound('clear');
        setIsSubmitting(false);
        return;
      }

      // Success
      playSound('success');
      setSuccessMessage(data.message || 'Akıllı Tahta Girişi Başarıyla Onaylandı!');
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMessage(`Bağlantı hatası: ${err?.message || 'Bilinmeyen hata'}`);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPin(pinDigits.join(''));
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-teal-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black">Tahta PIN Kodu Onayla</h3>
              <p className="text-[10px] text-indigo-100">Tahtada yazan 4 haneli kodu giriniz</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 text-center space-y-5">
          {successMessage ? (
            <div className="py-6 space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-base font-black">Tahta Girişi Açıldı!</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium px-4">
                {successMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-center gap-2.5">
                {pinDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    inputMode="text"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    className="w-11 h-13 sm:w-12 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-center font-mono text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white outline-none transition-all shadow-inner select-all"
                  />
                ))}
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 animate-in shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Akıllı tahtanın sağ tarafındaki 4 haneli PIN kodunu yazınız. Kod tamamlandığında tahta anında açılır.
              </p>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all text-slate-600 dark:text-slate-300"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={pinDigits.join('').length !== 4 || isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Onaylanıyor...</span>
                    </>
                  ) : (
                    <>
                      <span>Tahtayı Aç</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
