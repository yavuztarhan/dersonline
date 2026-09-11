'use client';

import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  X,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tv,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface TeacherCameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeacherCameraScannerModal({ isOpen, onClose }: TeacherCameraScannerModalProps) {
  const { currentUser } = useAuth();
  const { playSound } = useApp();

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
    setSuccessMessage(null);
    setIsProcessing(false);

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraError('Cihazınızın tarayıcısında kamera erişimi desteklenmiyor.');
        setHasCameraPermission(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      });

      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        scanFrame();
      }
    } catch (err: any) {
      console.error('Camera open error:', err);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setCameraError('Kamera izni verilmedi. Lütfen tarayıcı ayarlarından kamera iznini onaylayınız.');
      } else {
        setCameraError(`Kamera başlatılamadı: ${err?.message || 'Bilinmeyen hata'}`);
      }
      setHasCameraPermission(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data) {
          handleDetectedCode(code.data);
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  const handleDetectedCode = async (rawData: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      let channelId = '';
      let pin = '';

      // Check if rawData is our JSON format or URL format
      try {
        const parsed = JSON.parse(rawData);
        channelId = parsed.channelId || '';
        pin = parsed.pin || '';
      } catch (e) {
        if (rawData.includes('channel=')) {
          const urlParams = new URLSearchParams(rawData.split('?')[1]);
          channelId = urlParams.get('channel') || '';
        } else if (rawData.length === 4) {
          pin = rawData;
        } else {
          channelId = rawData;
        }
      }

      if (!channelId && !pin) {
        setCameraError('Okunan QR kod Maarif Akıllı Tahta sistemine ait değil.');
        setIsProcessing(false);
        // Resume scanning after 2 seconds
        setTimeout(() => {
          setCameraError(null);
          scanFrame();
        }, 2000);
        return;
      }

      playSound('select');

      const res = await fetch('/api/auth/board-session/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: channelId || undefined,
          pin: pin || undefined,
          teacherUser: currentUser
        })
      });

      const data = await res.json();
      if (!data.success) {
        setCameraError(data.error || 'Akıllı tahta oturumu onaylanamadı.');
        playSound('clear');
        setIsProcessing(false);
        setTimeout(() => {
          setCameraError(null);
          scanFrame();
        }, 2500);
        return;
      }

      // Success!
      stopCamera();
      playSound('success');
      setSuccessMessage(data.message || 'Akıllı Tahta Girişi Başarıyla Onaylandı!');

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setCameraError(`Onaylama hatası: ${err?.message || 'Bilinmeyen hata'}`);
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black">Akıllı Tahta QR Tara</h3>
              <p className="text-[10px] text-emerald-100">Kamerayı tahtadaki koda tutunuz</p>
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
        <div className="p-5 text-center space-y-4">
          {successMessage ? (
            <div className="py-8 space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30 shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-base font-black text-white">Tahta Girişi Açıldı!</h4>
              <p className="text-xs text-emerald-300 font-medium px-4">{successMessage}</p>
            </div>
          ) : cameraError ? (
            <div className="py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1 px-4">
                <div className="text-xs font-bold text-rose-300">Kamera Açılamadı</div>
                <div className="text-[11px] text-slate-400">{cameraError}</div>
              </div>
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tekrar Dene</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Video Viewport with Target Overlay */}
              <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Target Square Frame */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-emerald-400/80 rounded-2xl relative">
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-400" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-emerald-400" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-emerald-400" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-400" />
                    
                    {/* Laser Scanner Line Animation */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse absolute top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white">
                    <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
                    <span className="text-xs font-bold">Tahta Onaylanıyor...</span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-400 leading-tight">
                Akıllı tahtanın giriş ekranında yer alan karekodu vizörün içine denk getiriniz.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
