'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { KvkkConsentModal } from './kvkk-consent-modal';

export function EnforceProfileGuard() {
  const { currentUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isTeacher = currentUser?.role === 'teacher';
  const hasAcceptedKvkk = Boolean(currentUser?.kvkkAcceptedAt);
  const isProfileComplete = Boolean((currentUser as any)?.isProfileComplete && (currentUser as any)?.school && (currentUser as any)?.phone);

  useEffect(() => {
    if (!currentUser) return;

    // If teacher hasn't completed profile and not on profile page (and has accepted KVKK)
    if (isTeacher && hasAcceptedKvkk && !isProfileComplete) {
      if (pathname !== '/profile') {
        router.push('/profile');
      }
    }
  }, [currentUser, isTeacher, hasAcceptedKvkk, isProfileComplete, pathname, router]);

  if (!currentUser) return null;

  // Show KVKK modal if user is teacher and hasn't accepted KVKK yet
  if (isTeacher && !hasAcceptedKvkk) {
    return (
      <KvkkConsentModal
        isOpen={true}
        onAccepted={() => {
          router.push('/profile');
        }}
      />
    );
  }

  return null;
}
