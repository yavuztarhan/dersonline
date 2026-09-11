'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  QrCode,
  KeyRound,
  RefreshCw,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Tv,
  AlertCircle
} from 'lucide-react';

interface BoardQrLoginProps {
  onSuccess: () => void;
}

export function BoardQrLogin({ onSuccess }: BoardQrLoginProps) {
  const { loginWithBoardSession } = useAuth();
  const { playSound } = useApp();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [pin, setPin] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(150);
  const [isExpired, setIsExpired] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [approvedTeacherName, setApprovedTeacherName] = useState<string>('');

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNewSession = async () => {
    setLoading(true);
    setError(null);
    setIsExpired(false);
    setIsApproved(false);

    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    try {
      const res = await fetch('/api/auth/board-session/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientHint: 'smartboard' })
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Oturum oluşturulamadı.');
        setLoading(false);
        return;
      }

      setChannelId(data.channelId);
      setPin(data.pin);
      setQrDataUrl(data.qrDataUrl);
      setExpiresAt(data.expiresAt);

      const secondsLeft = Math.max(0, Math.floor((data.expiresAt - Date.now()) / 1000));
      setRemainingSeconds(secondsLeft);
      setLoading(false);

      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsExpired(true);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start polling status
      pollIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/auth/board-session/status?channelId=${data.channelId}`);
          const statusData = await statusRes.json();

          if (statusData.status === 'approved' && statusData.user) {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

            setIsApproved(true);
            setApprovedTeacherName(statusData.user.name || 'Öğretmen');
            playSound('success');

            // Complete local auth store login
            if (loginWithBoardSession) {
              loginWithBoardSession(
                statusData.user,
                statusData.sessionToken,
                statusData.expiresAt,
                statusData.deviceCategory || 'smartboard'
              );
            }

            setTimeout(() => {
              onSuccess();
            }, 1200);
          } else if (statusData.status === 'expired') {
            setIsExpired(true);
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          }
        } catch (pollErr) {
          console.warn('Status poll note:', pollErr);
        }
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Bağlantı hatası oluştu.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewSession();

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Smart Board Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-teal-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 flex items-center gap-2">
              <span>Şifresiz Akıllı Tahta Girişi</span>
              <span className="text-[10px] uppercase font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                Öğrenci Korumalı
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Şifrenizi tahtaya yazmadan cep telefonunuzdan QR veya PIN ile anında onaylayın.
            </p>
          </div>
        </div>
      </div>

      {/* Approved State */}
      {isApproved ? (
        <div className="py-10 text-center space-y-3 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Giriş Başarıyla Onaylandı!</h3>
          <p className="text-xs text-slate-600 font-medium">
            Hoş geldiniz, <span className="font-black text-teal-700">{approvedTeacherName}</span>.
            Tahtanız hazırlanıyor...
          </p>
        </div>
      ) : loading ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Akıllı tahta için güvenli QR ve PIN üretiliyor...</p>
        </div>
      ) : error ? (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <div className="text-xs font-bold">{error}</div>
          <button
            type="button"
            onClick={fetchNewSession}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tekrar Dene</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          {/* Method 1: QR Code Card */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 text-center space-y-3 relative group">
            <div className="text-xs font-black text-slate-800 flex items-center justify-center gap-1.5">
              <QrCode className="w-4 h-4 text-teal-600" />
              <span>1. Yöntem: QR Kod Taratın</span>
            </div>

            <div className="relative mx-auto w-52 h-52 bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
              {qrDataUrl && !isExpired ? (
                <Image
                  src={qrDataUrl}
                  alt="Giriş QR Kodu"
                  width={196}
                  height={196}
                  className="w-full h-full object-contain"
                  priority
                />
              ) : (
                <div className="text-center p-4 space-y-2">
                  <div className="text-2xl">⏳</div>
                  <div className="text-xs font-bold text-slate-600">Süre Doldu</div>
                  <p className="text-[10px] text-slate-400">Yeni bir QR kod üretmek için butona tıklayın.</p>
                </div>
              )}

              {isExpired && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white text-center space-y-2 animate-in fade-in">
                  <Clock className="w-6 h-6 text-amber-400" />
                  <span className="text-xs font-bold">Kodun Süresi Doldu</span>
                  <button
                    type="button"
                    onClick={fetchNewSession}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Yenile</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              Telefonunuzdan sisteme girip üst menüdeki{' '}
              <strong className="text-teal-700">"QR Tara"</strong> butonuna tıklayarak bu kodu okutun.
            </p>
          </div>

          {/* Method 2: 4-digit PIN Card */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 text-center space-y-4 flex flex-col justify-between h-full">
            <div>
              <div className="text-xs font-black text-slate-800 flex items-center justify-center gap-1.5">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>2. Yöntem: 4 Haneli PIN</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Kamera açmak istemiyorsanız aşağıdaki kodu telefonunuzdan girin:
              </p>
            </div>

            {/* Big PIN Display */}
            <div className="py-4 px-3 bg-white rounded-2xl border-2 border-indigo-200 shadow-inner flex items-center justify-center gap-2">
              {pin.split('').map((char, i) => (
                <div
                  key={i}
                  className="w-12 h-14 rounded-xl bg-gradient-to-b from-indigo-50 to-white border-2 border-indigo-300 font-mono text-2xl sm:text-3xl font-black text-indigo-950 flex items-center justify-center shadow-xs select-all"
                >
                  {isExpired ? '•' : char}
                </div>
              ))}
            </div>

            {/* Timer & Refresh Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
                <Clock className={`w-4 h-4 ${remainingSeconds <= 30 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                <span>Kalan Süre:</span>
                <span
                  className={`font-mono font-black ${
                    remainingSeconds <= 30 ? 'text-rose-600' : 'text-teal-700'
                  }`}
                >
                  {formatTime(remainingSeconds)}
                </span>
              </div>

              <button
                type="button"
                onClick={fetchNewSession}
                className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Kodu ve PIN'i Yenile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How it works info footer */}
      <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200 text-teal-950 text-[11px] flex items-start gap-2.5 leading-relaxed">
        <Smartphone className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <strong>Nasıl Çalışır?</strong> Cep telefonunuzdan <strong>maarifakademi.com.tr</strong> adresine
          giriniz. Üst kısımdaki <strong>"Tahta QR Tara"</strong> veya <strong>"PIN Gir"</strong>{' '}
          düğmesine tıklayarak tahtadaki girişi onaylayabilirsiniz. Şifreniz öğrenciler tarafından görülemez.
        </div>
      </div>
    </div>
  );
}
