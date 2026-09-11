'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { signIn } from 'next-auth/react';
import { X, ArrowRight, Loader2 } from 'lucide-react';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount?: (account: { name: string; email: string; avatar?: string }) => void;
  mode?: 'login' | 'register';
}

export function GoogleSignInModal({
  isOpen,
  onClose,
  mode = 'login'
}: GoogleSignInModalProps) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleLiveOAuth = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (e) {
      console.error('NextAuth Google Error:', e);
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Google Logo */}
        <div className="p-6 border-b border-slate-100 text-center space-y-3 bg-gradient-to-b from-slate-50 to-white">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm mx-auto">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.43 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.57 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {mode === 'register' ? 'Google ile Kayıt Ol' : 'Google ile Giriş Yap'}
          </h3>
          <p className="text-xs text-slate-500">
            Maarif Akademi platformuna resmi Google hesabınızla doğrudan bağlanın.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-center">
          <button
            onClick={handleLiveOAuth}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Google'a Yönlendiriliyor...</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.43 7.34 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.57 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </div>
                <span>
                  {mode === 'register'
                    ? 'Google Hesabı İle Kayıt Ol'
                    : 'Google Hesabı İle Giriş Yap'}
                </span>
                <ArrowRight className="w-4 h-4 ml-auto opacity-70" />
              </>
            )}
          </button>
        </div>

        {/* Security Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            🔒 Google OAuth 2.0 Güvenlik Protokolü ile korunmaktadır.
          </p>
        </div>

      </div>
    </div>,
    document.body
  );
}
