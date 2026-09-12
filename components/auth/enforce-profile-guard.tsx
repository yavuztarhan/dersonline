'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { KvkkConsentModal } from './kvkk-consent-modal';
import { SuspendedTeacherView } from '@/components/teacher/suspended-teacher-view';

export function EnforceProfileGuard() {
  const { currentUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isTeacher = currentUser?.role === 'teacher';
  const isSuspended =
    currentUser?.accountStatus === 'beklemede' ||
    currentUser?.status === 'suspended' ||
    (currentUser as any)?.status === 'SUSPENDED';

  const hasAcceptedKvkk = Boolean(currentUser?.isKvkkAccepted || currentUser?.kvkkAcceptedAt);
  const isProfileComplete = Boolean((currentUser as any)?.isProfileComplete && (currentUser as any)?.school && (currentUser as any)?.phone);

  useEffect(() => {
    if (!currentUser || isSuspended) return;

    // If teacher hasn't completed profile and not on profile page (and has accepted KVKK)
    if (isTeacher && hasAcceptedKvkk && !isProfileComplete) {
      if (pathname !== '/profile') {
        router.push('/profile');
      }
    }
  }, [currentUser, isTeacher, hasAcceptedKvkk, isProfileComplete, isSuspended, pathname, router]);

  if (!currentUser) return null;

  // 1. GLOBAL SUSPENSION LOCK: If account is suspended (beklemede), strictly lock entire platform
  if (isSuspended) {
    return (
      <div className="fixed inset-0 z-[999999] bg-slate-900 overflow-y-auto">
        <SuspendedTeacherView />
      </div>
    );
  }

  // 2. Show KVKK modal if user is teacher and hasn't accepted KVKK yet
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
