'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoMode } from '@/lib/demo-mode-store';
import { ALLOWED_DEMO_OUTCOMES } from '@/lib/demo-seed-data';
import { getOutcomeByCode } from '@/lib/curriculum-data';
import { useApp } from '@/lib/store';
import {
  Sparkles,
  RefreshCw,
  X,
  Lock,
  ArrowRight,
  GraduationCap,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function DemoStatusBanner() {
  const router = useRouter();
  const {
    isDemoMode,
    demoRole,
    switchDemoRole,
    resetDemoData,
    exitDemo,
    lockedOutcomeInfo,
    closeLockedOutcomeModal
  } = useDemoMode();

  const { setSelectedOutcome, playSound } = useApp();
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isDemoMode) return null;

  const handleReset = () => {
    playSound('select');
    resetDemoData();
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      window.location.reload();
    }, 600);
  };

  const handleExit = () => {
    playSound('select');
    exitDemo();
    router.push('/');
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  const handleRoleToggle = () => {
    playSound('select');
    const newRole = demoRole === 'teacher' ? 'student' : 'teacher';
    switchDemoRole(newRole);
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  const handleSelectDemoOutcome = (code: string) => {
    const found = getOutcomeByCode(code);
    if (found) {
      setSelectedOutcome(found);
      closeLockedOutcomeModal();
      router.push(`/lesson/${found.id}`);
    }
  };

  return (
    <>
      {/* Top Floating Demo Notification Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white shadow-md border-b border-amber-400/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Left: Demo Indicator & Current Identity */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 bg-black/20 text-white px-2.5 py-1 rounded-full font-black uppercase tracking-wider text-[10px] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              <span>GÖSTERİM / DEMO MODU</span>
            </span>

            <span className="text-amber-100 font-medium">
              {demoRole === 'teacher' ? (
                <span>
                  Aktif Profil: <strong>Öğretmen</strong> (Ahmet Yılmaz • 5-A, 6-B, 7-A Sınıfları)
                </span>
              ) : (
                <span>
                  Aktif Profil: <strong>Öğrenci</strong> (Zeynep Kaya • 7-A Sınıfı, No: 104 • 840 XP)
                </span>
              )}
            </span>

            <span className="hidden lg:inline-block bg-amber-700/40 text-amber-100 px-2 py-0.5 rounded text-[11px]">
              Kapsam: 5, 6, 7. Sınıf 1. Kazanımları (İzole Bellek)
            </span>
          </div>

          {/* Right: Role Switch, Reset & Exit Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRoleToggle}
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="Öğretmen ve Öğrenci rolleri arasında anında geçiş yapın"
            >
              {demoRole === 'teacher' ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-amber-200" />
                  <span>Öğrenci Moduna Geç</span>
                </>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5 text-amber-200" />
                  <span>Öğretmen Moduna Geç</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={resetSuccess}
              className="px-2.5 py-1 rounded-lg bg-black/20 hover:bg-black/30 text-amber-100 hover:text-white font-semibold text-[11px] transition-colors flex items-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Demo verilerini (puanlar, değerlendirmeler, tahta) ilk haline sıfırlar"
            >
              <RefreshCw className={`w-3 h-3 ${resetSuccess ? 'animate-spin' : ''}`} />
              <span>{resetSuccess ? 'Sıfırlandı...' : 'Sıfırla'}</span>
            </button>

            <button
              type="button"
              onClick={handleExit}
              className="px-2.5 py-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
              title="Demo modundan çıkıp normal sisteme dön"
            >
              <X className="w-3.5 h-3.5" />
              <span>Demodan Çık</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demo Outcome Lock Modal */}
      {lockedOutcomeInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={closeLockedOutcomeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Lock Icon */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                  DEMO SÜRÜM BİLGİLENDİRMESİ
                </span>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  Bu Kazanım Tam Sürümde Aktiftir
                </h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[11px]">
                  {lockedOutcomeInfo.code}
                </span>
                <span>{lockedOutcomeInfo.title}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Gösterim / Demo sürümünde <strong>5, 6 ve 7. sınıfın ilk kazanımları</strong>; 4 fazlı ders akışı, interaktif laboratuvarlar, değerlendirme testleri ve Maarif Modeli rubrikleri ile tam erişime açıktır.
              </p>
            </div>

            {/* Quick Demo Outcomes List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Demo Modunda Açık Olan Kazanımlar:
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemoOutcome('MAT.5.3.1')}
                  className="w-full text-left p-3 rounded-xl border border-teal-200 bg-teal-50/60 hover:bg-teal-100/70 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-[11px] font-extrabold text-teal-800">5. Sınıf • MAT.5.3.1</div>
                    <div className="text-xs font-bold text-slate-800">Doğru, Doğru Parçası ve Işın</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemoOutcome('MAT.6.1.1')}
                  className="w-full text-left p-3 rounded-xl border border-teal-200 bg-teal-50/60 hover:bg-teal-100/70 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-[11px] font-extrabold text-teal-800">6. Sınıf • MAT.6.1.1</div>
                    <div className="text-xs font-bold text-slate-800">Asal Sayılar ve Doğal Sayıların Asal Çarpanları</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemoOutcome('MAT.7.1.1')}
                  className="w-full text-left p-3 rounded-xl border border-teal-200 bg-teal-50/60 hover:bg-teal-100/70 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-[11px] font-extrabold text-teal-800">7. Sınıf • MAT.7.1.1</div>
                    <div className="text-xs font-bold text-slate-800">Rasyonel Sayılar ve Sayı Doğrusunda Gösterimi</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Close action */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={closeLockedOutcomeModal}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
