'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/lib/auth-store';
import { validatePassword } from '@/lib/password-validator';
import {
  X,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Info
} from 'lucide-react';

interface AdminCreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated?: (userEmail: string, role: string) => void;
}

export function AdminCreateUserModal({ isOpen, onClose, onUserCreated }: AdminCreateUserModalProps) {
  const { adminCreateUser } = useAuth();

  const [role, setRole] = useState<'teacher' | 'admin'>('teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setErrorMsg('');
      setRole('teacher');
    }
  }, [isOpen]);

  // Live Password check
  const passValidation = validatePassword(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    if (!passValidation.isValid) {
      setErrorMsg(passValidation.errorMessage || 'Şifre kurallara uymuyor.');
      return;
    }

    setIsSubmitting(true);

    const res = adminCreateUser({
      email: cleanEmail,
      password: password,
      role: role
    });

    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Kullanıcı oluşturulurken bir hata oluştu.');
      return;
    }

    if (onUserCreated) {
      onUserCreated(cleanEmail, role === 'admin' ? 'Yönetici' : 'Öğretmen');
    }
    onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg my-8 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold">
            <UserPlus className="w-3.5 h-3.5 text-teal-400" />
            <span>Yönetici Paneli Hızlı Kullanıcı Kaydı</span>
          </div>
          <h2 className="text-xl font-black">Yeni Kullanıcı Ekle</h2>
          <p className="text-xs text-slate-300">
            Sadece e-posta ve şifre belirleyerek yeni bir öğretmen veya yönetici hesabı oluşturun.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Role Selector Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800">Kullanıcı Rolü</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'teacher' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>👨‍🏫 Öğretmen</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'admin' ? 'bg-white text-indigo-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>👑 Yönetici (Admin)</span>
              </button>
            </div>
          </div>

          {/* E-Posta */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>E-Posta Adresi *</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kullanici@meb.k12.tr veya e-posta adresi"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {/* Şifre */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Geçici Şifre *</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400">En az 4 karakter</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre belirleyiniz"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-900 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px] font-medium">
              Kullanıcı ilk kez giriş yaptığında ad, soyad, telefon, il, ilçe, okul ve branş bilgilerini profil tamamlama ekranından kendisi girecektir.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !email.trim() || !password.trim()}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Kullanıcıyı Oluştur</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>,
    document.body
  );
}
