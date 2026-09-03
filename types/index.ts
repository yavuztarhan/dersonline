export type Role = 'teacher' | 'student';

export type LessonPhaseId = 'story' | 'lab' | 'puzzle' | 'assessment';

export interface LessonPhaseInfo {
  id: LessonPhaseId;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
}

export interface PedagogyGuide {
  maarifSDBs: string[]; // Sosyal Duygusal Beceriler ve Değerler
  processComponents: string[]; // Maarif Modeli Süreç Bileşenleri
  learningGoals: string[];
  teacherTips: string[];
  misconceptions: string[];
  keyQuestions: string[];
}

export interface StorybookPage {
  id: string;
  pageNumber: number;
  chapterTitle: string;
  conceptTitle: string;
  conceptBadge: string;
  narrativeText: string;
  characterDialogue?: {
    speaker: string;
    text: string;
  };
  visualScene: {
    type: 'point-map' | 'lighthouse-ray' | 'bridge-segment' | 'horizon-line' | 'summary-chart';
    caption: string;
  };
  interactiveAction: {
    prompt: string;
    actionLabel: string;
    feedbackRevealed: string;
  };
  mathTakeaway: string;
  symbolicCode?: string;
}

export interface StoryPhaseData {
  title: string;
  character: {
    name: string;
    role: string;
    avatar: string;
  };
  scenario: string;
  realLifeConnection: string;
  reflectionQuestion: string;
  keyTakeaway: string;
  pages?: StorybookPage[];
}

export interface GeometryToolState {
  mode: 'point' | 'line' | 'segment' | 'ray' | 'angle' | 'measure' | 'select' | 'clear';
}

export interface LabPhaseData {
  title: string;
  toolType: 'geometry-canvas' | 'angle-protractor' | 'number-line' | 'fraction-wall';
  instructions: string;
  taskGoal: string;
  interactiveTips: string[];
  presetObjects?: Array<{
    id: string;
    type: 'point' | 'line' | 'segment' | 'ray';
    label: string;
    x1: number;
    y1: number;
    x2?: number;
    y2?: number;
    color?: string;
  }>;
}

export interface PuzzleItem {
  id: string;
  concept: string; // e.g. "Doğru", "Doğru Parçası", "Işın", "Nokta"
  symbol: string; // e.g. "AB", "[AB]", "[AB", "A"
  definition: string;
  visualType: 'point' | 'line' | 'segment' | 'ray' | 'angle';
  matched?: boolean;
}

export interface PuzzlePhaseData {
  title: string;
  instructions: string;
  items: PuzzleItem[];
}

export interface AssessmentQuestion {
  id: string;
  questionText: string;
  context?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  bloomLevel?: string;
}

export interface AssessmentPhaseData {
  title: string;
  instructions: string;
  questions: AssessmentQuestion[];
}

export interface OutcomePhases {
  story: StoryPhaseData;
  lab: LabPhaseData;
  puzzle: PuzzlePhaseData;
  assessment: AssessmentPhaseData;
}

export interface Outcome {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  gradeId: string;
  subjectId: string;
  unitId: string;
  topicId: string;
  durationMinutes: number;
  pedagogyGuide: PedagogyGuide;
  phases: OutcomePhases;
}

export interface Topic {
  id: string;
  unitId: string;
  title: string;
  description: string;
  outcomes: Outcome[];
}

export interface Unit {
  id: string;
  subjectId: string;
  unitNumber: number;
  title: string;
  description: string;
  icon: string;
  themeColor: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  gradeId: string;
  title: string;
  code: string;
  icon: string;
  color: string;
  description?: string;
  units: Unit[];
}

export interface Grade {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
  subjects: Subject[];
}

export interface StudentBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  earnedAt?: string;
}
