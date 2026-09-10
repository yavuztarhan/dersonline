'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { FeedbackModal } from '@/components/feedback/feedback-modal';
import { MessageSquarePlus } from 'lucide-react';

export interface FeedbackButtonProps {
  contextTitle: string; // e.g. "MAT.5.3.3 Ders Akışı", "Öğrenci Paneli"
  tooltip?: string;
  className?: string;
  iconClassName?: string;
}

/**
 * Text-free icon-only feedback button for placing anywhere in lesson flows and dashboard pages.
 */
export function FeedbackButton({
  contextTitle,
  tooltip = 'Görüş & Geri Bildirim Bildir',
  className = 'p-2 rounded-xl bg-white/90 hover:bg-teal-50 text-slate-600 hover:text-teal-700 border border-slate-200 hover:border-teal-300 shadow-2xs transition-all cursor-pointer',
  iconClassName = 'w-4 h-4 text-teal-600'
}: FeedbackButtonProps) {
  const { playSound } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          playSound('click');
          setModalOpen(true);
        }}
        className={className}
        title={tooltip}
        aria-label={tooltip}
      >
        <MessageSquarePlus className={iconClassName} />
      </button>

      {modalOpen && (
        <FeedbackModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          contextTitle={contextTitle}
          type="feedback"
        />
      )}
    </>
  );
}
