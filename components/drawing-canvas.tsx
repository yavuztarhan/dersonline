'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/lib/store';
import { PenTool, Highlighter, Eraser, X, Trash2 } from 'lucide-react';

export function DrawingCanvas() {
  const {
    drawingActive,
    setDrawingActive,
    drawingTool,
    brushColor,
    brushSize,
    clearCanvasTrigger,
    triggerClearCanvas,
    playSound
  } = useApp();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const lastX = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);

  // Resize canvas to full viewport maintaining devicePixelRatio resolution
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const w = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const h = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const targetW = Math.round(w * dpr);
    const targetH = Math.round(h * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx && canvas.width > 0 && canvas.height > 0) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = targetW;
      canvas.height = targetH;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext('2d');
      if (ctx && tempCanvas.width > 0 && tempCanvas.height > 0) {
        ctx.drawImage(tempCanvas, 0, 0, targetW, targetH);
      }
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    if (drawingActive) {
      resizeCanvas();
    }
  }, [drawingActive, resizeCanvas]);

  // Clear canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [clearCanvasTrigger]);

  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: clientX, y: clientY, scaleX: 1, scaleY: 1 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width > 0 ? canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? canvas.height / rect.height : 1;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
      scaleX,
      scaleY
    };
  };

  const handleStart = (clientX: number, clientY: number) => {
    if (!drawingActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawing.current = true;
    const { x, y, scaleX } = getCanvasCoords(clientX, clientY);
    lastX.current = x;
    lastY.current = y;

    // Draw initial dot on down/tap
    ctx.beginPath();
    const radius =
      drawingTool === 'eraser'
        ? brushSize * 4 * scaleX
        : drawingTool === 'highlighter'
        ? brushSize * 2.5 * scaleX
        : Math.max((brushSize * scaleX) / 2, 2);

    ctx.arc(x, y, radius, 0, Math.PI * 2);

    if (drawingTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fill();
    } else if (drawingTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = brushColor.length === 7 ? `${brushColor}55` : brushColor;
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = brushColor;
      ctx.fill();
    }
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDrawing.current || !drawingActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y, scaleX } = getCanvasCoords(clientX, clientY);
    const prevX = lastX.current !== null ? lastX.current : x;
    const prevY = lastY.current !== null ? lastY.current : y;

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (drawingTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 8 * scaleX;
      ctx.stroke();
    } else if (drawingTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor.length === 7 ? `${brushColor}55` : brushColor;
      ctx.lineWidth = brushSize * 5 * scaleX;
      ctx.stroke();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize * scaleX;
      ctx.stroke();
    }

    lastX.current = x;
    lastY.current = y;
  };

  const handleEnd = () => {
    isDrawing.current = false;
    lastX.current = null;
    lastY.current = null;
  };

  // Mouse Handlers
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleStart(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleMove(e.clientX, e.clientY);
  };

  // Touch Handlers
  const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawingActive) return;
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawingActive || !isDrawing.current) return;
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  };

  // Pointer Handlers (Stylus / Apple Pencil / Smart Board Stylus)
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    handleStart(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    handleMove(e.clientX, e.clientY);
  };

  // Attach global mouseup / touchend so dragging off canvas doesn't get stuck
  useEffect(() => {
    const onGlobalUp = () => handleEnd();
    window.addEventListener('mouseup', onGlobalUp);
    window.addEventListener('touchend', onGlobalUp);
    window.addEventListener('pointerup', onGlobalUp);
    return () => {
      window.removeEventListener('mouseup', onGlobalUp);
      window.removeEventListener('touchend', onGlobalUp);
      window.removeEventListener('pointerup', onGlobalUp);
    };
  }, []);

  // Update body cursor when drawingActive
  useEffect(() => {
    if (drawingActive) {
      document.body.style.cursor = 'crosshair';
    } else {
      document.body.style.cursor = '';
    }
    return () => {
      document.body.style.cursor = '';
    };
  }, [drawingActive]);

  return (
    <>
      {/* 1. Fullscreen Transparent Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={handleEnd}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        style={{ touchAction: 'none' }}
        className={`fixed inset-0 z-[48] touch-none select-none transition-opacity duration-150 ${
          drawingActive
            ? 'pointer-events-auto cursor-crosshair opacity-100'
            : 'pointer-events-none opacity-100'
        }`}
      />

      {/* 2. Top Banner Notification when Drawing Mode is Active */}
      {drawingActive && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[51] animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-auto">
          <div className="bg-slate-950/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 font-black">
              {drawingTool === 'pen' && <PenTool className="w-4 h-4 text-teal-400" />}
              {drawingTool === 'highlighter' && <Highlighter className="w-4 h-4 text-amber-400" />}
              {drawingTool === 'eraser' && <Eraser className="w-4 h-4 text-rose-400" />}
              <span>
                {drawingTool === 'pen'
                  ? 'Dijital Kalem Aktif'
                  : drawingTool === 'highlighter'
                  ? 'Fosforlu Kalem Aktif'
                  : 'Silgi Aktif'}
              </span>
            </div>

            <div
              className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs shrink-0"
              style={{ backgroundColor: brushColor }}
              title="Aktif Renk"
            />

            <span className="text-slate-400 text-[11px] hidden sm:inline">
              (Ekrana serbestçe çizebilirsiniz)
            </span>

            <button
              type="button"
              onClick={() => {
                playSound('clear');
                triggerClearCanvas();
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title="Çizimleri Temizle"
            >
              <Trash2 className="w-3 h-3 text-slate-400" />
              <span>Temizle</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setDrawingActive(false);
              }}
              className="px-2.5 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
              title="Çizim Modunu Kapat (Sayfayla Etkileşime Geç)"
            >
              <X className="w-3.5 h-3.5" />
              <span>Çizimi Kapat</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
