'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import {
  KVKK_AGREEMENT_TITLE,
  KVKK_AGREEMENT_TEXT,
  KVKK_AGREEMENT_VERSION,
  KVKK_LAST_UPDATED
} from '@/lib/kvkk-agreement';
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  Sparkles,
  School
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface KvkkConsentModalProps {
  isOpen: boolean;
  onAccepted?: () => void;
}

export function KvkkConsentModal({ isOpen, onAccepted }: KvkkConsentModalProps) {
  const { currentUser, acceptKvkk } = useAuth();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || !currentUser) return null;

  const handleAccept = () => {
    if (!agreed) return;
    setIsSubmitting(true);

    acceptKvkk(currentUser.id);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    if (onAccepted) {
      onAccepted();
    } else {
      router.push('/profile');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden relative my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Yasal Zorunluluk & Veri Güvenliği</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Sürüm: {KVKK_AGREEMENT_VERSION}
            </span>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              KVKK Aydınlatma Metni & Öğretmen Veri İşleme Taahhütnamesi
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Platformu kullanmaya başlamadan önce lütfen aşağıdaki yasal taahhütnameyi ve veri işleme şartlarını inceleyip onaylayınız.
            </p>
          </div>
        </div>

        {/* Warning Highlight Box */}
        <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-black text-amber-950">
              ÖĞRENCİ VERİLERİ VE VELİ İZİN TAAHHÜDÜ (6698 Sayılı KVKK Uyarınca):
            </p>
            <p className="leading-relaxed">
              Öğretmen; platforma öğrencilerin ad, soyad ve okul numaralarını kaydetmeden önce <strong>öğrenci ve velilerinden mevzuata uygun yazılı muvafakat/açık rıza alacağını</strong>, yazılı izin olmadan kayıt yapmayacağını taahhüt eder.
            </p>
          </div>
        </div>

        {/* Scrollable Agreement Text Body */}
        <div className="p-6 max-h-[45vh] overflow-y-auto bg-slate-50/50 border-b border-slate-200 text-xs text-slate-700 leading-relaxed space-y-4 font-normal select-text">
          <div className="whitespace-pre-line prose prose-slate prose-sm max-w-none">
            {KVKK_AGREEMENT_TEXT}
          </div>
        </div>

        {/* Action & Consent Checkbox Footer */}
        <div className="p-6 bg-white space-y-4">
          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 cursor-pointer hover:bg-teal-50 transition-colors select-none group">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded-lg border-2 border-teal-500 text-teal-600 focus:ring-teal-500 cursor-pointer shrink-0"
            />
            <span className="text-xs font-bold text-slate-900 group-hover:text-teal-950 leading-snug">
              Yukarıdaki <strong>KVKK Aydınlatma Metni'ni</strong> ve <strong>Öğretmen Veri İşleme & Veli İzin Taahhütnamesi'ni</strong> okudum, anladım; öğrencilerin yasal velilerinden yazılı izin alacağımı gayrikabili rücu kabul ve taahhüt ediyorum. <span className="text-rose-600 font-black">*</span>
            </span>
          </label>

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-400">
              🔒 6698 sayılı KVKK kapsamında kayıt altına alınacaktır.
            </span>

            <button
              type="button"
              disabled={!agreed || isSubmitting}
              onClick={handleAccept}
              className="py-3 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-xs shadow-lg shadow-teal-600/20 disabled:shadow-none transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>OKUDUM, ANLADIM VE ONAYLIYORUM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
