'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-store';
import { MessageInboxModal } from '@/components/messages/message-inbox-modal';
import Link from 'next/link';
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';

export default function MessagesPage() {
  const { currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(true);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-4xl">🔒</div>
        <h2 className="text-xl font-black text-slate-900">Giriş Yapılması Gerekiyor</h2>
        <p className="text-xs text-slate-600">
          Gelen kutunuzu ve mesajlarınızı görüntülemek için lütfen hesabınızla giriş yapınız.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white font-black text-xs shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Ana Sayfaya Dön</span>
        </Link>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-teal-600 text-white font-black text-xs shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Mail className="w-4 h-4" />
          <span>Mesaj Merkezini Aç</span>
        </button>
      </div>

      <MessageInboxModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTab="inbox"
      />
    </div>
  );
}
