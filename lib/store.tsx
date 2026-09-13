'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Grade, Subject, Unit, Topic, Outcome, StudentBadge } from '@/types';
import { useDemoMode } from '@/lib/demo-mode-store';
import { isDemoOutcome } from '@/lib/demo-seed-data';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playSound: (type: 'success' | 'click' | 'bell' | 'select' | 'clear') => void;
  
  // Selection Flow State
  selectedGrade: Grade | null;
  setSelectedGrade: (grade: Grade | null) => void;
  selectedSubject: Subject | null;
  setSelectedSubject: (subject: Subject | null) => void;
  selectedUnit: Unit | null;
  setSelectedUnit: (unit: Unit | null) => void;
  selectedTopic: Topic | null;
  setSelectedTopic: (topic: Topic | null) => void;
  selectedOutcome: Outcome | null;
  setSelectedOutcome: (outcome: Outcome | null) => void;
  resetSelection: () => void;

  // Teacher Classroom Controls
  showAnswers: boolean;
  setShowAnswers: (show: boolean) => void;
  teacherDrawerOpen: boolean;
  setTeacherDrawerOpen: (open: boolean) => void;
  randomPickerOpen: boolean;
  setRandomPickerOpen: (open: boolean) => void;
  
  // Board Drawing Tools
  drawingActive: boolean;
  setDrawingActive: (active: boolean) => void;
  drawingTool: 'pen' | 'highlighter' | 'eraser';
  setDrawingTool: (tool: 'pen' | 'highlighter' | 'eraser') => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  clearCanvasTrigger: number;
  triggerClearCanvas: () => void;

  // Student Gamification State
  studentPoints: number;
  addPoints: (pts: number) => void;
  studentBadges: StudentBadge[];
  unlockBadge: (badgeId: string) => void;
  
  // Student Roster
  students: string[];
  addStudent: (name: string) => void;
  removeStudent: (name: string) => void;
}

const DEFAULT_STUDENTS = [
  'Ahmet Yılmaz',
  'Zeynep Kaya',
  'Mustafa Demir',
  'Elif Çelik',
  'Mehmet Şahin',
  'Ayşe Yıldız',
  'Emir Öztürk',
  'Fatma Aydın',
  'Caner Arslan',
  'Beren Koç',
  'Burak Polat',
  'Selin Kurt'
];

const INITIAL_BADGES: StudentBadge[] = [
  {
    id: 'first-step',
    title: 'İlk Adım',
    description: 'İlk interaktif dersi başlattın!',
    icon: 'Sparkles',
    unlocked: true,
    earnedAt: 'Bugün'
  },
  {
    id: 'geometry-master',
    title: 'Geometri Kaşifi',
    description: 'Doğru, Işın ve Doğru Parçası çizimini tamamladın.',
    icon: 'Shapes',
    unlocked: false
  },
  {
    id: 'puzzle-pro',
    title: 'Bulmaca Ustası',
    description: 'Kavram eşleştirme bulmacasını hatasız bitirdin.',
    icon: 'Puzzle',
    unlocked: false
  },
  {
    id: 'maarif-genius',
    title: 'Maarif Yıldızı',
    description: 'Değerlendirme testinde tüm soruları doğru bildin.',
    icon: 'Trophy',
    unlocked: false
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isDemoMode, demoRole, showLockedOutcomeModal } = useDemoMode();
  const [role, setRole] = useState<Role>('teacher');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync role with active demo role
  useEffect(() => {
    if (isDemoMode && demoRole) {
      setRole(demoRole);
    }
  }, [isDemoMode, demoRole]);

  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome | null>(null);

  const handleSetSelectedOutcome = (outcome: Outcome | null) => {
    if (isDemoMode && outcome && !isDemoOutcome(outcome.code)) {
      showLockedOutcomeModal(outcome.code, outcome.title);
      return;
    }
    setSelectedOutcome(outcome);
  };

  const [showAnswers, setShowAnswers] = useState(false);
  const [teacherDrawerOpen, setTeacherDrawerOpen] = useState(false);
  const [randomPickerOpen, setRandomPickerOpen] = useState(false);

  const [drawingActive, setDrawingActive] = useState(false);
  const [drawingTool, setDrawingTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [brushColor, setBrushColor] = useState('#ef4444'); // Red default for teacher
  const [brushSize, setBrushSize] = useState(4);
  const [clearCanvasTrigger, setClearCanvasTrigger] = useState(0);

  const [studentPoints, setStudentPoints] = useState(50);
  const [studentBadges, setStudentBadges] = useState<StudentBadge[]>(INITIAL_BADGES);
  const [students, setStudents] = useState<string[]>(DEFAULT_STUDENTS);

  const triggerClearCanvas = () => {
    setClearCanvasTrigger((prev) => prev + 1);
  };

  const addPoints = (pts: number) => {
    setStudentPoints((prev) => prev + pts);
  };

  const unlockBadge = (badgeId: string) => {
    setStudentBadges((prev) =>
      prev.map((b) => (b.id === badgeId ? { ...b, unlocked: true, earnedAt: 'Şimdi' } : b))
    );
  };

  const addStudent = (name: string) => {
    if (name.trim() && !students.includes(name.trim())) {
      setStudents([...students, name.trim()]);
    }
  };

  const removeStudent = (name: string) => {
    setStudents(students.filter((s) => s !== name));
  };

  const resetSelection = () => {
    setSelectedGrade(null);
    setSelectedSubject(null);
    setSelectedUnit(null);
    setSelectedTopic(null);
    setSelectedOutcome(null);
  };

  const toggleFullscreen = () => {
    if (typeof window === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const playSound = (type: 'success' | 'click' | 'bell' | 'select' | 'clear') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else if (type === 'select') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, audioCtx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
      } else if (type === 'success') {
        // Chord
        const freqs = [523.25, 659.25, 783.99, 1046.5]; // C E G C
        freqs.forEach((f, i) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.06);
          g.gain.setValueAtTime(0.15, audioCtx.currentTime + i * 0.06);
          g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + i * 0.06 + 0.35);
          o.connect(g);
          g.connect(audioCtx.destination);
          o.start(audioCtx.currentTime + i * 0.06);
          o.stop(audioCtx.currentTime + i * 0.06 + 0.35);
        });
      } else if (type === 'bell') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } else if (type === 'clear') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      }
    } catch (e) {
      console.warn('AudioContext not supported or allowed', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isFullscreen,
        toggleFullscreen,
        soundEnabled,
        setSoundEnabled,
        playSound,
        selectedGrade,
        setSelectedGrade,
        selectedSubject,
        setSelectedSubject,
        selectedUnit,
        setSelectedUnit,
        selectedTopic,
        setSelectedTopic,
        selectedOutcome,
        setSelectedOutcome: handleSetSelectedOutcome,
        resetSelection,
        showAnswers,
        setShowAnswers,
        teacherDrawerOpen,
        setTeacherDrawerOpen,
        randomPickerOpen,
        setRandomPickerOpen,
        drawingActive,
        setDrawingActive,
        drawingTool,
        setDrawingTool,
        brushColor,
        setBrushColor,
        brushSize,
        setBrushSize,
        clearCanvasTrigger,
        triggerClearCanvas,
        studentPoints,
        addPoints,
        studentBadges,
        unlockBadge,
        students,
        addStudent,
        removeStudent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
