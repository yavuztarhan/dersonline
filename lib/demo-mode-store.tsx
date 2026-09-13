'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ALLOWED_DEMO_OUTCOMES, isDemoOutcome, DEMO_TEACHER_USER, DEMO_STUDENT_USER, DEMO_RUBRIC_SUBMISSIONS, DEMO_PEER_EVALUATIONS, DEMO_WHITEBOARD_FILES } from './demo-seed-data';

export type DemoRole = 'teacher' | 'student';

export interface LockedOutcomeInfo {
  code: string;
  title: string;
}

interface DemoModeContextType {
  isDemoMode: boolean;
  demoRole: DemoRole | null;
  startTeacherDemo: () => void;
  startStudentDemo: () => void;
  switchDemoRole: (role: DemoRole) => void;
  resetDemoData: () => void;
  exitDemo: () => void;
  lockedOutcomeInfo: LockedOutcomeInfo | null;
  showLockedOutcomeModal: (code: string, title?: string) => void;
  closeLockedOutcomeModal: () => void;
}

const DEMO_ACTIVE_ROLE_KEY = 'demo_maarif_active_role';
export const DEMO_RUBRICS_STORAGE_KEY = 'demo_maarif_rubric_submissions_v1';
export const DEMO_PEER_STORAGE_KEY = 'demo_maarif_peer_evaluations_v1';
export const DEMO_WHITEBOARD_STORAGE_KEY = 'demo_maarif_classroom_files_v1';

export function isDemoModeActive(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return !!localStorage.getItem(DEMO_ACTIVE_ROLE_KEY);
  } catch {
    return false;
  }
}

export function getDemoActiveRole(): DemoRole | null {
  if (typeof window === 'undefined') return null;
  try {
    const role = localStorage.getItem(DEMO_ACTIVE_ROLE_KEY);
    if (role === 'teacher' || role === 'student') return role;
    return null;
  } catch {
    return null;
  }
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [demoRole, setDemoRole] = useState<DemoRole | null>(null);
  const [lockedOutcomeInfo, setLockedOutcomeInfo] = useState<LockedOutcomeInfo | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize from localStorage on client mount
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem(DEMO_ACTIVE_ROLE_KEY);
      if (storedRole === 'teacher' || storedRole === 'student') {
        setDemoRole(storedRole);
      }
    } catch (e) {
      console.warn('[DemoMode] Failed reading initial demo role:', e);
    } finally {
      setInitialized(true);
    }
  }, []);

  // Initialize demo data in localStorage if missing
  const ensureSeedData = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      if (!localStorage.getItem(DEMO_RUBRICS_STORAGE_KEY)) {
        localStorage.setItem(DEMO_RUBRICS_STORAGE_KEY, JSON.stringify(DEMO_RUBRIC_SUBMISSIONS));
      }
      if (!localStorage.getItem(DEMO_PEER_STORAGE_KEY)) {
        localStorage.setItem(DEMO_PEER_STORAGE_KEY, JSON.stringify(DEMO_PEER_EVALUATIONS));
      }
      if (!localStorage.getItem(DEMO_WHITEBOARD_STORAGE_KEY)) {
        localStorage.setItem(DEMO_WHITEBOARD_STORAGE_KEY, JSON.stringify(DEMO_WHITEBOARD_FILES));
      }
    } catch (e) {
      console.warn('[DemoMode] Error ensuring seed data:', e);
    }
  }, []);

  const startTeacherDemo = useCallback(() => {
    try {
      localStorage.setItem(DEMO_ACTIVE_ROLE_KEY, 'teacher');
      ensureSeedData();
      setDemoRole('teacher');
      window.dispatchEvent(new CustomEvent('maarif:demo-change', { detail: { isDemo: true, role: 'teacher' } }));
    } catch (e) {
      console.error('[DemoMode] Error starting teacher demo:', e);
    }
  }, [ensureSeedData]);

  const startStudentDemo = useCallback(() => {
    try {
      localStorage.setItem(DEMO_ACTIVE_ROLE_KEY, 'student');
      ensureSeedData();
      setDemoRole('student');
      window.dispatchEvent(new CustomEvent('maarif:demo-change', { detail: { isDemo: true, role: 'student' } }));
    } catch (e) {
      console.error('[DemoMode] Error starting student demo:', e);
    }
  }, [ensureSeedData]);

  const switchDemoRole = useCallback((newRole: DemoRole) => {
    try {
      localStorage.setItem(DEMO_ACTIVE_ROLE_KEY, newRole);
      setDemoRole(newRole);
      window.dispatchEvent(new CustomEvent('maarif:demo-change', { detail: { isDemo: true, role: newRole } }));
    } catch (e) {
      console.error('[DemoMode] Error switching demo role:', e);
    }
  }, []);

  const resetDemoData = useCallback(() => {
    try {
      localStorage.setItem(DEMO_RUBRICS_STORAGE_KEY, JSON.stringify(DEMO_RUBRIC_SUBMISSIONS));
      localStorage.setItem(DEMO_PEER_STORAGE_KEY, JSON.stringify(DEMO_PEER_EVALUATIONS));
      localStorage.setItem(DEMO_WHITEBOARD_STORAGE_KEY, JSON.stringify(DEMO_WHITEBOARD_FILES));
      window.dispatchEvent(new CustomEvent('maarif:demo-reset'));
    } catch (e) {
      console.error('[DemoMode] Error resetting demo data:', e);
    }
  }, []);

  const exitDemo = useCallback(() => {
    try {
      localStorage.removeItem(DEMO_ACTIVE_ROLE_KEY);
      setDemoRole(null);
      setLockedOutcomeInfo(null);
      window.dispatchEvent(new CustomEvent('maarif:demo-change', { detail: { isDemo: false, role: null } }));
    } catch (e) {
      console.error('[DemoMode] Error exiting demo:', e);
    }
  }, []);

  const showLockedOutcomeModal = useCallback((code: string, title?: string) => {
    setLockedOutcomeInfo({
      code,
      title: title || 'Müfredat Kazanımı'
    });
  }, []);

  const closeLockedOutcomeModal = useCallback(() => {
    setLockedOutcomeInfo(null);
  }, []);

  const isDemoMode = initialized && demoRole !== null;

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        demoRole,
        startTeacherDemo,
        startStudentDemo,
        switchDemoRole,
        resetDemoData,
        exitDemo,
        lockedOutcomeInfo,
        showLockedOutcomeModal,
        closeLockedOutcomeModal
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (!context) {
    return {
      isDemoMode: false,
      demoRole: null,
      startTeacherDemo: () => {},
      startStudentDemo: () => {},
      switchDemoRole: () => {},
      resetDemoData: () => {},
      exitDemo: () => {},
      lockedOutcomeInfo: null,
      showLockedOutcomeModal: () => {},
      closeLockedOutcomeModal: () => {}
    };
  }
  return context;
}
