'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { useDemoMode } from '@/lib/demo-mode-store';
import { TourStep, ChecklistItem } from './onboarding-types';

export const HOME_TOUR_STEPS: TourStep[] = [
  {
    id: 'home-hero',
    targetSelector: '#onboarding-home-hero',
    title: 'Maarif Akademi’ye Hoş Geldiniz! 👋',
    description: 'Türkiye Yüzyılı Maarif Modeli ile uyumlu akıllı sınıf platformunuz hazır. Öğrenme yoldaşınız Selim ile matematik dersleri artık formül ezberinden uzak, capcanlı!',
    placement: 'bottom'
  },
  {
    id: 'home-step-selector',
    targetSelector: '#onboarding-home-step-selector',
    title: 'Ders ve Kazanım Seçimi 📐',
    description: 'Buradan sınıf seviyesini, tema ve öğrenme çıktısını seçerek 4 aşamalı ders döngüsünü (Hikâye, Atölye, Oyun, Rubrik) anında başlatabilirsiniz.',
    placement: 'top'
  },
  {
    id: 'home-direct-launch',
    targetSelector: '#onboarding-home-direct-launch',
    title: 'Hızlı Ders Başlatma 🚀',
    description: 'Öne çıkan veya MEB takvimine en uygun ders istasyonlarına buradan tek tıkla doğrudan geçiş yapabilirsiniz.',
    placement: 'top'
  },
  {
    id: 'nav-drawer',
    targetSelector: '#onboarding-nav-drawer',
    title: 'Kişisel Menü & Akıllı Tahta Araçları 🖥️',
    description: 'Sol üstteki menüden akıllı tahta çizim araçlarına, oyun salonuna ve öğretmen modüllerine dilediğiniz zaman erişebilirsiniz.',
    placement: 'bottom'
  }
];

export const TEACHER_TOUR_STEPS: TourStep[] = [
  {
    id: 'teacher-banner',
    targetSelector: '#onboarding-teacher-banner',
    title: 'Öğretmen Kokpitiniz 👨‍🏫',
    description: 'Burası sınıfınızı, öğrencilerinizi, e-Okul listelerinizi ve süreç rubriklerinizi tek ekrandan yönettiğiniz ana kumanda merkezinizdir.',
    placement: 'bottom'
  },
  {
    id: 'teacher-nav-tabs',
    targetSelector: '#onboarding-teacher-nav-tabs',
    title: '7 Temel Öğretmen Modülü 📊',
    description: 'Tahtaya kalkma çarkı, öğrenci formları, Maarif rubrik analizleri, sınıf listeleri, grup çalışmaları ve sınıf dosyalarına buradan geçiş yapabilirsiniz.',
    placement: 'bottom'
  },
  {
    id: 'teacher-students-tab',
    targetSelector: '#onboarding-teacher-students-tab',
    title: 'Sınıfım & e-Okul Yönetimi 📂',
    description: 'Şubelerinizi yönetebilir, e-Okul Excel listesi yükleyebilir ve A4 baskıya hazır öğrenci giriş kartlarını tek tıkla indirebilirsiniz.',
    placement: 'bottom'
  },
  {
    id: 'teacher-start-lesson',
    targetSelector: '#onboarding-teacher-start-lesson',
    title: 'Akıllı Tahtada Dersi Başlatın 🎬',
    description: 'Sınıfınız hazır olduğunda bu butona basarak akıllı tahtada 4 aşamalı etkileşimli ders akışını başlatabilirsiniz.',
    placement: 'bottom'
  },
  {
    id: 'nav-drawer',
    targetSelector: '#onboarding-nav-drawer',
    title: 'Kişisel Menü & Hızlı Araçlar 🖥️',
    description: 'Sol üstteki menüden eğitici oyunlar salonuna, öğrenci çarkına ve hesap ayarlarınıza dilediğiniz zaman erişebilirsiniz.',
    placement: 'bottom'
  }
];

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'explore_lesson',
    title: 'İlk Dersi & 4 Fazlı Döngüyü Keşfet',
    description: 'Hikâye, Atölye, Oyun ve Rubrik aşamalarından oluşan örnek dersi açın.',
    completed: false,
    actionHref: '/lesson/MAT.5.3.1',
    actionText: 'Dersi Aç'
  },
  {
    id: 'explore_whiteboard',
    title: 'Akıllı Tahta Araçlarını İncele',
    description: 'Sınıf içi katılım çarkı ve çizim araçlarını deneyin.',
    completed: false,
    actionHref: '/teacher',
    actionText: 'Aracı Gör'
  },
  {
    id: 'setup_classroom',
    title: 'Sınıfını & Öğrenci Listeni Belirle',
    description: 'Öğretmen kokpitinden sınıfınızı oluşturun veya e-Okul listenizi aktarın.',
    completed: false,
    actionHref: '/teacher',
    actionText: 'Panele Git'
  },
  {
    id: 'review_rubric',
    title: 'Maarif Süreç Rubriğini Görüntüle',
    description: '4 düzeyli süreç değerlendirme ölçeğini inceleyin.',
    completed: false,
    actionHref: '/lesson/MAT.5.3.1?phase=assessment',
    actionText: 'Rubriği Gör'
  }
];

interface OnboardingContextType {
  activeTour: 'home' | 'teacher' | null;
  currentStepIndex: number;
  currentSteps: TourStep[];
  currentStep: TourStep | null;
  startTour: (tourName?: 'home' | 'teacher') => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  isEligibleUser: boolean;
  checklistItems: ChecklistItem[];
  toggleChecklistItem: (id: string) => void;
  isChecklistOpen: boolean;
  setIsChecklistOpen: (open: boolean) => void;
  isChecklistDismissed: boolean;
  setIsChecklistDismissed: (dismissed: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

const STORAGE_HOME_SEEN = 'maarif_onboarding_tour_home_v2';
const STORAGE_TEACHER_SEEN = 'maarif_onboarding_tour_teacher_v2';
const STORAGE_CHECKLIST_KEY = 'maarif_onboarding_checklist_v2';
const STORAGE_CHECKLIST_DISMISSED = 'maarif_onboarding_checklist_dismissed_v2';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const { isDemoMode } = useDemoMode();

  const [activeTour, setActiveTour] = useState<'home' | 'teacher' | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isChecklistDismissed, setIsChecklistDismissed] = useState(false);

  // Eligibility Rule:
  // User is logged in, KVKK accepted, and profile complete (or demo mode)
  const isTeacher = currentUser?.role === 'teacher';
  const hasAcceptedKvkk = Boolean(currentUser?.isKvkkAccepted || currentUser?.kvkkAcceptedAt);
  const isProfileComplete = isTeacher
    ? Boolean((currentUser as any)?.isProfileComplete || ((currentUser as any)?.school && (currentUser as any)?.city))
    : Boolean(currentUser);

  const isEligibleUser = Boolean(
    isDemoMode ||
    (currentUser && hasAcceptedKvkk && isProfileComplete)
  );

  // Load checklist and dismissed status from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedChecklist = localStorage.getItem(STORAGE_CHECKLIST_KEY);
      if (storedChecklist) {
        const completedIds: string[] = JSON.parse(storedChecklist);
        setChecklistItems((prev) =>
          prev.map((item) => ({ ...item, completed: completedIds.includes(item.id) }))
        );
      }
      const dismissed = localStorage.getItem(STORAGE_CHECKLIST_DISMISSED);
      if (dismissed === 'true') {
        setIsChecklistDismissed(true);
      }
    } catch (e) {
      console.error('Error loading onboarding checklist state', e);
    }
  }, []);

  const currentSteps = activeTour === 'home' ? HOME_TOUR_STEPS : activeTour === 'teacher' ? TEACHER_TOUR_STEPS : [];
  const currentStep = currentSteps[currentStepIndex] || null;

  // Start Tour
  const startTour = useCallback((tourName?: 'home' | 'teacher') => {
    const targetTour = tourName || (pathname === '/teacher' ? 'teacher' : 'home');
    setActiveTour(targetTour);
    setCurrentStepIndex(0);
  }, [pathname]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < currentSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Tour completed
      if (activeTour === 'home') {
        try { localStorage.setItem(STORAGE_HOME_SEEN, 'true'); } catch {}
      } else if (activeTour === 'teacher') {
        try { localStorage.setItem(STORAGE_TEACHER_SEEN, 'true'); } catch {}
      }
      setActiveTour(null);
      setCurrentStepIndex(0);
    }
  }, [currentStepIndex, currentSteps.length, activeTour]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTour = useCallback(() => {
    if (activeTour === 'home') {
      try { localStorage.setItem(STORAGE_HOME_SEEN, 'true'); } catch {}
    } else if (activeTour === 'teacher') {
      try { localStorage.setItem(STORAGE_TEACHER_SEEN, 'true'); } catch {}
    }
    setActiveTour(null);
    setCurrentStepIndex(0);
  }, [activeTour]);

  const toggleChecklistItem = useCallback((id: string) => {
    setChecklistItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item));
      try {
        const completedIds = updated.filter((i) => i.completed).map((i) => i.id);
        localStorage.setItem(STORAGE_CHECKLIST_KEY, JSON.stringify(completedIds));
      } catch {}
      return updated;
    });
  }, []);

  // Automatic Trigger on First Visit for Eligible Users
  useEffect(() => {
    if (!isEligibleUser || typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      if (pathname === '/' && !activeTour) {
        const homeSeen = localStorage.getItem(STORAGE_HOME_SEEN);
        if (!homeSeen) {
          startTour('home');
        }
      } else if (pathname === '/teacher' && !activeTour) {
        const teacherSeen = localStorage.getItem(STORAGE_TEACHER_SEEN);
        if (!teacherSeen) {
          startTour('teacher');
        }
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname, isEligibleUser, activeTour, startTour]);

  return (
    <OnboardingContext.Provider
      value={{
        activeTour,
        currentStepIndex,
        currentSteps,
        currentStep,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        isEligibleUser,
        checklistItems,
        toggleChecklistItem,
        isChecklistOpen,
        setIsChecklistOpen,
        isChecklistDismissed,
        setIsChecklistDismissed: (dismissed: boolean) => {
          setIsChecklistDismissed(dismissed);
          try {
            localStorage.setItem(STORAGE_CHECKLIST_DISMISSED, dismissed ? 'true' : 'false');
          } catch {}
        }
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
