'use client';

import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  X,
  Camera,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tv,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface TeacherBoardAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'camera' | 'pin';
}

export function TeacherBoardAuthModal({
  isOpen,
  onClose,
  defaultMode = 'camera'
}: TeacherBoardAuthModalProps) {
  const { currentUser } = useAuth();
  const { playSound } = useApp();

  const [mode, setMode] = useState<'camera' | 'pin'>(defaultMode);

  // Camera State
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessingCamera, setIsProcessingCamera] = useState(false);

  // PIN State
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '']);
  const [isSubmittingPin, setIsSubmittingPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // General Status
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Camera Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // PIN Input Refs
  const inputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null)
  ];

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    setIsProcessingCamera(false);

    try {
      const isSecure = typeof window !== 'undefined' && (window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      if (!isSecure) {
        setCameraError('Mobil tarayıcılarda kamera için HTTPS gereklidir (yerel IP bağlantılarında tarayıcı güvenlik amacıyla kamerayı engeller). Lütfen aşağıdaki 4 haneli PIN kodunu kullanınız.');
        setHasCameraPermission(false);
        setMode('pin');
        return;
      }

      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraError('Cihazınızın tarayıcısında kamera erişimi desteklenmiyor. Lütfen 4 Haneli PIN ile giriş yapınız.');
        setHasCameraPermission(false);
        setMode('pin');
        return;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false
        });
      } catch (e1) {
        // Fallback constraint
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('muted', 'true');
        videoRef.current.muted = true;
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Video play note:', playErr);
        }
        scanFrame();
      }
    } catch (err: any) {
      console.error('Camera open error:', err);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setCameraError('Kamera izni verilmedi. Aşağıdan 4 Haneli PIN ile hızlıca giriş yapabilirsiniz.');
      } else {
        setCameraError('Kamera başlatılamadı. Lütfen 4 Haneli PIN kodunu kullanınız.');
      }
      setHasCameraPermission(false);
      setMode('pin');
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        handleQrDetected(code.data);
        return;
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  const handleQrDetected = async (qrContent: string) => {
    stopCamera();
    setIsProcessingCamera(true);
    playSound('click');

    let channelId = '';
    try {
      if (qrContent.includes('channelId=')) {
        const urlObj = new URL(qrContent);
        channelId = urlObj.searchParams.get('channelId') || '';
      } else {
        const parsed = JSON.parse(qrContent);
        channelId = parsed.channelId || '';
      }
    } catch (e) {
      if (qrContent.startsWith('bs_')) {
        channelId = qrContent;
      }
    }

    if (!channelId) {
      setCameraError('Geçersiz QR kod formatı. Lütfen tahtadaki Maarif Akademi QR kodunu taratınız.');
      setIsProcessingCamera(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/board-session/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId,
          teacherUser: currentUser
        })
      });

      const data = await res.json();
      if (data.success) {
        playSound('success');
        setSuccessMessage('Akıllı Tahta Girişi Başarılı! Tahta açıldı.');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setCameraError(data.error || 'Oturum onaylanamadı. QR kodunun süresi dolmuş olabilir.');
        setIsProcessingCamera(false);
      }
    } catch (err: any) {
      setCameraError('Sunucu bağlantı hatası oluştu.');
      setIsProcessingCamera(false);
    }
  };

  // PIN Operations
  const handleDigitChange = (index: number, val: string) => {
    const char = val.slice(-1).toUpperCase();
    const nextDigits = [...pinDigits];
    nextDigits[index] = char;
    setPinDigits(nextDigits);
    setPinError(null);

    if (char && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

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
      setPinError('Lütfen 4 haneli PIN kodunu eksiksiz giriniz.');
      return;
    }

    setIsSubmittingPin(true);
    setPinError(null);

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
      if (data.success) {
        playSound('success');
        setSuccessMessage('Akıllı Tahta Girişi Başarılı! Tahta açıldı.');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setPinError(data.error || 'Geçersiz veya süresi dolmuş PIN kodu.');
        setIsSubmittingPin(false);
      }
    } catch (err: any) {
      setPinError('Sunucu bağlantı hatası oluştu.');
      setIsSubmittingPin(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSuccessMessage(null);
      setCameraError(null);
      setPinError(null);
      setPinDigits(['', '', '', '']);
      if (mode === 'camera') {
        startCamera();
      } else {
        stopCamera();
        setTimeout(() => inputRefs[0].current?.focus(), 150);
      }
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, mode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Tv className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="text-sm font-black flex items-center gap-2">
                <span>Akıllı Tahta Girişi</span>
                <span className="text-[10px] uppercase font-bold bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full">
                  Hızlı Onay
                </span>
              </div>
              <p className="text-xs text-teal-100/90 mt-0.5">
                Şifrenizi tahtada girmeden telefonunuzdan onaylayın
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Tab Selector: QR Tara vs PIN Gir */}
        <div className="p-3 bg-slate-100 border-b border-slate-200">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/80 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setMode('camera');
              }}
              className={`py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'camera'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-teal-600" />
              <span>Kamera ile QR Tara</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setMode('pin');
              }}
              className={`py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'pin'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span>4 Haneli PIN Gir</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {successMessage ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900">{successMessage}</h3>
              <p className="text-xs text-slate-500">
                Akıllı tahtada oturumunuz açıldı, iyi dersler dileriz!
              </p>
            </div>
          ) : mode === 'camera' ? (
            /* CAMERA MODE */
            <div className="space-y-4">
              <div className="relative mx-auto w-full max-w-[280px] aspect-square rounded-3xl overflow-hidden bg-slate-950 border-4 border-slate-800 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Target Overlay Corners */}
                <div className="absolute inset-8 pointer-events-none border-2 border-dashed border-teal-400/80 rounded-2xl flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-teal-400 -mt-1 -ml-1 rounded-tl" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-teal-400 -mt-1 -mr-1 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-teal-400 -mb-1 -ml-1 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-teal-400 -mb-1 -mr-1 rounded-br" />

                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse" />
                </div>

                {isProcessingCamera && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white">
                    <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
                    <span className="text-xs font-bold">Tahta Girişi Onaylanıyor...</span>
                  </div>
                )}
              </div>

              {cameraError ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs text-center space-y-2">
                  <div className="font-bold flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{cameraError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMode('pin')}
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>PIN Koduna Geç</span>
                  </button>
                </div>
              ) : (
                <p className="text-center text-xs text-slate-500">
                  Kamerayı akıllı tahtadaki <strong>QR koda</strong> tutunuz, otomatik taranacaktır.
                </p>
              )}
            </div>
          ) : (
            /* PIN MODE - Mobile Responsive */
            <div className="space-y-4">
              <p className="text-center text-xs text-slate-600 font-medium">
                Akıllı tahtanın sağında gösterilen <strong className="text-indigo-950 font-bold">4 haneli PIN kodunu</strong> giriniz:
              </p>

              {/* 4 Digit Boxes */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 my-1">
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
                    className="w-12 h-13 sm:w-14 sm:h-16 text-center font-mono text-xl sm:text-2xl font-black bg-slate-50 border-2 border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl sm:rounded-2xl outline-none transition-all shadow-xs uppercase select-all"
                  />
                ))}
              </div>

              {pinError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs text-center font-bold flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="button"
                disabled={pinDigits.join('').length !== 4 || isSubmittingPin}
                onClick={() => submitPin(pinDigits.join(''))}
                className="w-full py-3 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
              >
                {isSubmittingPin ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Onaylanıyor...</span>
                  </>
                ) : (
                  <>
                    <span>Akıllı Tahtada Oturumu Aç</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
