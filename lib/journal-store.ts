'use client';

export interface LearningJournalEntry {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  gradeLevel: number;
  classSection: string; // '5-A', '5-B', '6-A'
  school?: string;
  outcomeId: string;
  outcomeCode: string;
  outcomeTitle: string;
  prompt: string;
  studentReflection: string;
  teacherFeedback?: string;
  teacherLiked?: boolean;
  submittedAt: string;
}

import { isDemoModeActive, DEMO_JOURNAL_STORAGE_KEY } from '@/lib/demo-mode-store';
import { DEMO_JOURNAL_ENTRIES } from '@/lib/demo-seed-data';

const STORAGE_KEY = 'maarif_learning_journals_v1';

function getActiveJournalKey(): string {
  return isDemoModeActive() ? DEMO_JOURNAL_STORAGE_KEY : STORAGE_KEY;
}

// Initial pre-populated rich data for learning journals
const INITIAL_JOURNAL_ENTRIES: LearningJournalEntry[] = [];

export function getStoredJournalEntries(): LearningJournalEntry[] {
  if (typeof window === 'undefined') {
    return isDemoModeActive() ? DEMO_JOURNAL_ENTRIES : INITIAL_JOURNAL_ENTRIES;
  }
  try {
    const key = getActiveJournalKey();
    const raw = localStorage.getItem(key);
    if (!raw) {
      const fallback = isDemoModeActive() ? DEMO_JOURNAL_ENTRIES : INITIAL_JOURNAL_ENTRIES;
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : (isDemoModeActive() ? DEMO_JOURNAL_ENTRIES : INITIAL_JOURNAL_ENTRIES);
  } catch (err) {
    console.error('Error loading learning journal entries:', err);
    return isDemoModeActive() ? DEMO_JOURNAL_ENTRIES : INITIAL_JOURNAL_ENTRIES;
  }
}

export function saveJournalEntry(entry: Omit<LearningJournalEntry, 'id' | 'submittedAt'>): LearningJournalEntry {
  const all = getStoredJournalEntries();
  const newEntry: LearningJournalEntry = {
    ...entry,
    id: `jrn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    submittedAt: new Date().toISOString()
  };

  const updated = [newEntry, ...all];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(getActiveJournalKey(), JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving journal entry to localStorage:', err);
    }
  }

  // Asynchronously persist to database API (disabled in demo mode)
  if (typeof window !== 'undefined' && !isDemoModeActive()) {
    fetch('/api/learning-journals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    }).catch((err) => console.warn('[journal-store] Background API sync note:', err));
  }

  return newEntry;
}

export function updateTeacherJournalFeedback(entryId: string, feedback: string, liked?: boolean): void {
  const all = getStoredJournalEntries();
  const index = all.findIndex((e) => e.id === entryId);
  if (index !== -1) {
    all[index] = {
      ...all[index],
      teacherFeedback: feedback,
      ...(liked !== undefined ? { teacherLiked: liked } : {})
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(getActiveJournalKey(), JSON.stringify(all));
      } catch (err) {
        console.error('Error updating journal feedback in localStorage:', err);
      }

      // Asynchronously update feedback on database API (disabled in demo mode)
      if (!isDemoModeActive()) {
        fetch('/api/learning-journals', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: entryId, teacherFeedback: feedback, teacherLiked: liked })
        }).catch((err) => console.warn('[journal-store] Background feedback API sync note:', err));
      }
    }
  }
}

/**
 * Synchronizes learning journals from PostgreSQL database API into localStorage.
 */
export async function syncJournalsFromApi(classSection?: string): Promise<LearningJournalEntry[]> {
  if (typeof window === 'undefined' || isDemoModeActive()) return getStoredJournalEntries();

  try {
    const url = classSection && classSection !== 'Tümü'
      ? `/api/learning-journals?classSection=${encodeURIComponent(classSection)}`
      : '/api/learning-journals';
    const res = await fetch(url);
    const data = await res.json();
    if (data?.success && Array.isArray(data.journals) && data.journals.length > 0) {
      const local = getStoredJournalEntries();
      // Merge DB records with local records avoiding duplicates
      const mergedMap = new Map<string, LearningJournalEntry>();
      local.forEach((item) => mergedMap.set(item.id, item));
      data.journals.forEach((dbItem: any) => {
        mergedMap.set(dbItem.id, {
          id: dbItem.id,
          studentId: dbItem.studentId || '',
          studentName: dbItem.studentName || 'Öğrenci',
          studentNumber: dbItem.studentNumber || '',
          gradeLevel: dbItem.gradeLevel || 5,
          classSection: dbItem.classSection || '5-A',
          school: dbItem.school || '',
          outcomeId: dbItem.outcomeId || '',
          outcomeCode: dbItem.outcomeCode || '',
          outcomeTitle: dbItem.outcomeTitle || '',
          prompt: dbItem.prompt || '',
          studentReflection: dbItem.studentReflection || '',
          teacherFeedback: dbItem.teacherFeedback || undefined,
          teacherLiked: Boolean(dbItem.teacherLiked),
          submittedAt: typeof dbItem.submittedAt === 'string' ? dbItem.submittedAt : new Date(dbItem.submittedAt).toISOString()
        });
      });
      const merged = Array.from(mergedMap.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('[journal-store] syncJournalsFromApi note:', err);
  }
  return getStoredJournalEntries();
}
