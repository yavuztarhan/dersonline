'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-store';
import { AuthModal } from '@/components/auth/auth-modal';
import {
  Lock,
  ShieldAlert,
  LogIn,
  UserPlus,
  Home,
  ArrowRight,
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'teacher' | 'student';
  title?: string;
  description?: string;
}

export function AuthGuard({
  children,
  requiredRole,
  title = 'Bu İçeriğe Erişmek İçin Giriş Yapmalısınız',
  description = 'Türkiye Yüzyılı Maarif Modeli interaktif akıllı tahta ders odaları ve yönetim panellerine erişmek için lütfen giriş yapın veya yeni öğretmen kaydı oluşturun.'
}: AuthGuardProps) {
  const { currentUser } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'login' | 'register'>('login');

  // 1. Not logged in -> Show Auth Gate
  if (!currentUser) {
    return (
      <>
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
            
            {/* Lock Icon */}
            <div className="relative mx-auto w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-600 flex items-center justify-center shadow-inner">
              <Lock className="w-10 h-10" />
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-black shadow-sm">
                !
              </div>
            </div>

            {/* Header */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Korumalı Alan</span>
              </span>
              <h2 className="text-xl font-black text-slate-900">{title}</h2>
              <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setDefaultTab('login');
                  setAuthModalOpen(true);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <LogIn className="w-4 h-4" />
                <span>Giriş Yap / Google ile Bağlan</span>
              </button>

              <button
                onClick={() => {
                  setDefaultTab('register');
                  setAuthModalOpen(true);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-slate-500" />
                <span>Yeni Öğretmen Kaydı Oluştur</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 pt-2 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Tanıtım Ana Sayfasına Dön</span>
              </Link>
            </div>

          </div>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab={defaultTab}
        />
      </>
    );
  }

  // 2. Role Mismatch check (if specific role is strictly required)
  if (requiredRole && currentUser.role !== requiredRole && currentUser.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Yetkisiz Erişim</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bu panel yalnızca{' '}
              <strong className="text-slate-800">
                {requiredRole === 'admin' ? 'Yöneticiler' : requiredRole === 'teacher' ? 'Öğretmenler' : 'Öğrenciler'}
              </strong>{' '}
              tarafından görüntülenebilir. Mevcut oturumunuz: <strong>{currentUser.role}</strong>.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                setDefaultTab('login');
                setAuthModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all"
            >
              Farklı Hesap ile Giriş Yap
            </button>
            <Link
              href="/"
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab={defaultTab}
        />
      </div>
    );
  }

  // 3. User is authenticated and authorized -> render children
  return <>{children}</>;
}
