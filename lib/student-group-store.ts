'use client';

export interface StudentGroupMember {
  id: string;
  name: string;
  studentNumber: string;
  avatar: string;
  classSection: string;
}

export interface StudentGroup {
  id: string;
  name: string;
  classSection: string;
  teacherId: string;
  teacherName: string;
  colorGradient: string;
  members: StudentGroupMember[];
  peerEvaluationEnabled?: boolean;
  peerEvaluationOutcomeCode?: string;
  peerEvaluationOutcomeTitle?: string;
  createdAt: string;
}

export interface GroupTask {
  id: string;
  groupId: string;
  groupName: string;
  classSection: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  outcomeCode: string;
  outcomeTitle: string;
  dueDate: string;
  xpReward: number;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved';
  submissionNote?: string;
  submittedByStudentName?: string;
  submittedAt?: string;
  teacherFeedback?: string;
  createdAt: string;
}

const STORAGE_GROUPS_KEY = 'maarif_student_groups_v1';
const STORAGE_GROUP_TASKS_KEY = 'maarif_group_tasks_v1';

const GROUP_NAMES_POOL = [
  'Pisagor Kaşifleri',
  'Harezmi Ekibi',
  'Öklid Mimarları',
  'Ali Kuşçu Yıldızları',
  'Cahit Arf Dahileri',
  'Bîrûnî Bilginleri',
  'İbn Heysem Optikçileri',
  'Mimar Sinan Geometrisi'
];

const GROUP_GRADIENTS = [
  'from-teal-600 to-emerald-600',
  'from-indigo-600 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-600 to-pink-600',
  'from-cyan-600 to-blue-600',
  'from-violet-600 to-indigo-700',
  'from-emerald-600 to-teal-700',
  'from-fuchsia-600 to-rose-600'
];

// Seed Groups
const SEED_GROUPS: StudentGroup[] = [
  {
    id: 'grp-seed-1',
    name: 'Pisagor Kaşifleri',
    classSection: '5-A',
    teacherId: 'tch-101',
    teacherName: 'Ayşe Yılmaz',
    colorGradient: 'from-teal-600 to-emerald-600',
    peerEvaluationEnabled: true,
    peerEvaluationOutcomeCode: 'MAT.5.3.3',
    peerEvaluationOutcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    createdAt: '2026-09-08T10:00:00Z',
    members: [
      { id: 'stu-201', name: 'Çırak Hasan', studentNumber: '104', avatar: '👦', classSection: '5-A' },
      { id: 'stu-101', name: 'Ahmet Yılmaz', studentNumber: '101', avatar: '👦', classSection: '5-A' },
      { id: 'stu-102', name: 'Zeynep Kaya', studentNumber: '102', avatar: '👧', classSection: '5-A' }
    ]
  },
  {
    id: 'grp-seed-2',
    name: 'Harezmi Ekibi',
    classSection: '5-A',
    teacherId: 'tch-101',
    teacherName: 'Ayşe Yılmaz',
    colorGradient: 'from-indigo-600 to-purple-600',
    peerEvaluationEnabled: true,
    peerEvaluationOutcomeCode: 'MAT.5.3.3',
    peerEvaluationOutcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    createdAt: '2026-09-08T10:00:00Z',
    members: [
      { id: 'stu-103', name: 'Mustafa Demir', studentNumber: '103', avatar: '👦', classSection: '5-A' },
      { id: 'stu-104', name: 'Elif Çelik', studentNumber: '105', avatar: '👧', classSection: '5-A' },
      { id: 'stu-105', name: 'Mehmet Şahin', studentNumber: '106', avatar: '👦', classSection: '5-A' }
    ]
  }
];

// Seed Group Tasks
const SEED_GROUP_TASKS: GroupTask[] = [
  {
    id: 'gtask-seed-1',
    groupId: 'grp-seed-1',
    groupName: 'Pisagor Kaşifleri',
    classSection: '5-A',
    teacherId: 'tch-101',
    teacherName: 'Ayşe Yılmaz',
    title: 'Düzlemde Doğruların Durumları Maketi & Sunumu',
    description: 'Grup olarak pipetler, ipler veya karton kullanarak paralel, kesişen, dik ve çakışık doğruları modelleyen bir sınıf panosu hazırlayın ve açı özelliklerini listeleyin.',
    outcomeCode: 'MAT.5.3.4',
    outcomeTitle: 'Düzlemde İki ve Üç Doğrunun Durumları ve Açı Çıkarımları',
    dueDate: '2026-09-18',
    xpReward: 150,
    status: 'in_progress',
    createdAt: '2026-09-09T11:00:00Z'
  },
  {
    id: 'gtask-seed-2',
    groupId: 'grp-seed-2',
    groupName: 'Harezmi Ekibi',
    classSection: '5-A',
    teacherId: 'tch-101',
    teacherName: 'Ayşe Yılmaz',
    title: 'Okul Bahçesinde Açı & Gönye Haritası',
    description: 'Bahçedeki basketbol sahası, merdiven korkulukları ve bina köşelerindeki açıları iletki ve gönye ile ölçüp fotoğraflayarak ortak bir mini rapor hazırlayınız.',
    outcomeCode: 'MAT.5.3.3',
    outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
    dueDate: '2026-09-20',
    xpReward: 150,
    status: 'pending',
    createdAt: '2026-09-09T11:00:00Z'
  }
];

export function getStoredGroups(): StudentGroup[] {
  if (typeof window === 'undefined') return SEED_GROUPS;
  try {
    const raw = localStorage.getItem(STORAGE_GROUPS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_GROUPS_KEY, JSON.stringify(SEED_GROUPS));
      return SEED_GROUPS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_GROUPS;
  } catch (err) {
    console.warn('Gruplar okunurken hata oluştu:', err);
    return SEED_GROUPS;
  }
}

function saveStoredGroups(groups: StudentGroup[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_GROUPS_KEY, JSON.stringify(groups));
  } catch (err) {
    console.warn('Gruplar kaydedilirken hata oluştu:', err);
  }
}

export function getStoredGroupTasks(): GroupTask[] {
  if (typeof window === 'undefined') return SEED_GROUP_TASKS;
  try {
    const raw = localStorage.getItem(STORAGE_GROUP_TASKS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_GROUP_TASKS_KEY, JSON.stringify(SEED_GROUP_TASKS));
      return SEED_GROUP_TASKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_GROUP_TASKS;
  } catch (err) {
    console.warn('Grup ödevleri okunurken hata oluştu:', err);
    return SEED_GROUP_TASKS;
  }
}

function saveStoredGroupTasks(tasks: GroupTask[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_GROUP_TASKS_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.warn('Grup ödevleri kaydedilirken hata oluştu:', err);
  }
}

/**
 * Otomatik Gruplama Motoru:
 * Seçilen sınıftaki öğrencileri belirtilen grup büyüklüğüne göre (örn: 2'şer, 3'er, 4'er kişi)
 * rastgele karıştırarak adil ve dengeli gruplara ayırır.
 */
export function createGroupsAuto(
  classSection: string,
  groupSize: number,
  studentsList: any[],
  teacherId: string,
  teacherName: string
): StudentGroup[] {
  // Sadece ilgili sınıftaki öğrencileri filtrele
  const classStudents = studentsList.filter((s) => (s?.classSection || '5-A') === classSection);

  if (classStudents.length === 0) return [];

  // Öğrencileri rastgele karıştır (Fisher-Yates Shuffle)
  const shuffled = [...classStudents].sort(() => Math.random() - 0.5);

  const safeGroupSize = Math.max(2, Math.min(10, groupSize));
  const totalGroups = Math.ceil(shuffled.length / safeGroupSize);

  const newGroups: StudentGroup[] = [];

  for (let i = 0; i < totalGroups; i++) {
    const chunk = shuffled.slice(i * safeGroupSize, (i + 1) * safeGroupSize);
    if (chunk.length === 0) continue;

    const groupName = GROUP_NAMES_POOL[i % GROUP_NAMES_POOL.length] || `Grup ${i + 1}`;
    const colorGradient = GROUP_GRADIENTS[i % GROUP_GRADIENTS.length];

    const members: StudentGroupMember[] = chunk.map((s) => ({
      id: String(s.id || `stu-${s.studentNumber}`),
      name: String(s.name || 'Öğrenci'),
      studentNumber: String(s.studentNumber || '-'),
      avatar: String(s.avatar || '🎓'),
      classSection: s.classSection || classSection
    }));

    newGroups.push({
      id: `grp-${Date.now()}-${i}`,
      name: `${groupName} (${classSection})`,
      classSection,
      teacherId,
      teacherName,
      colorGradient,
      members,
      createdAt: new Date().toISOString()
    });
  }

  // Mevcut diğer sınıfların gruplarını koruyup bu sınıfınkileri güncelle
  const allGroups = getStoredGroups().filter((g) => g.classSection !== classSection);
  const updated = [...allGroups, ...newGroups];
  saveStoredGroups(updated);

  return newGroups;
}

/**
 * Manuel Grup Oluşturma:
 * Öğretmenin seçtiği öğrencilerle özel bir grup oluşturur.
 */
export function createGroupManual(
  name: string,
  classSection: string,
  selectedStudents: any[],
  teacherId: string,
  teacherName: string
): StudentGroup {
  const colorGradient = GROUP_GRADIENTS[Math.floor(Math.random() * GROUP_GRADIENTS.length)];

  const members: StudentGroupMember[] = selectedStudents.map((s) => ({
    id: String(s.id || `stu-${s.studentNumber}`),
    name: String(s.name || 'Öğrenci'),
    studentNumber: String(s.studentNumber || '-'),
    avatar: String(s.avatar || '🎓'),
    classSection: s.classSection || classSection
  }));

  const newGroup: StudentGroup = {
    id: `grp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: name.trim() || 'Özel Çalışma Grubu',
    classSection,
    teacherId,
    teacherName,
    colorGradient,
    members,
    createdAt: new Date().toISOString()
  };

  const current = getStoredGroups();
  const updated = [newGroup, ...current];
  saveStoredGroups(updated);

  return newGroup;
}

export function deleteGroup(groupId: string): void {
  const current = getStoredGroups();
  const updated = current.filter((g) => g.id !== groupId);
  saveStoredGroups(updated);

  // İlgili görevleri de temizle veya güncelle
  const tasks = getStoredGroupTasks().filter((t) => t.groupId !== groupId);
  saveStoredGroupTasks(tasks);
}

export function assignTaskToGroup(payload: Omit<GroupTask, 'id' | 'createdAt' | 'status'>): GroupTask {
  const newTask: GroupTask = {
    ...payload,
    id: `gtask-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const current = getStoredGroupTasks();
  const updated = [newTask, ...current];
  saveStoredGroupTasks(updated);

  return newTask;
}

export function submitGroupTask(taskId: string, studentName: string, note: string): void {
  const tasks = getStoredGroupTasks();
  const updated = tasks.map((t) =>
    t.id === taskId
      ? {
          ...t,
          status: 'submitted' as const,
          submissionNote: note.trim(),
          submittedByStudentName: studentName,
          submittedAt: new Date().toISOString()
        }
      : t
  );
  saveStoredGroupTasks(updated);
}

export function gradeGroupTask(taskId: string, feedback: string, isApproved: boolean): void {
  const tasks = getStoredGroupTasks();
  const updated = tasks.map((t) =>
    t.id === taskId
      ? {
          ...t,
          status: isApproved ? ('approved' as const) : ('in_progress' as const),
          teacherFeedback: feedback.trim()
        }
      : t
  );
  saveStoredGroupTasks(updated);
}

export function getGroupsForClass(classSection: string): StudentGroup[] {
  const all = getStoredGroups();
  return all.filter((g) => g.classSection === classSection || classSection === 'Tümü');
}

export function getGroupForStudent(studentId: string, studentNumber?: string): StudentGroup | null {
  const all = getStoredGroups();
  return (
    all.find((g) =>
      g.members.some((m) => m.id === studentId || (studentNumber && m.studentNumber === studentNumber))
    ) || null
  );
}

export function toggleGroupPeerEvaluation(
  groupId: string,
  enabled: boolean,
  outcomeCode: string = 'MAT.5.3.3',
  outcomeTitle: string = 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme'
): StudentGroup | null {
  const groups = getStoredGroups();
  let updatedGroup: StudentGroup | null = null;
  const updated = groups.map((g) => {
    if (g.id === groupId) {
      updatedGroup = {
        ...g,
        peerEvaluationEnabled: enabled,
        peerEvaluationOutcomeCode: enabled ? outcomeCode : undefined,
        peerEvaluationOutcomeTitle: enabled ? outcomeTitle : undefined
      };
      return updatedGroup;
    }
    return g;
  });
  saveStoredGroups(updated);
  return updatedGroup;
}

export function getTasksForGroup(groupId: string): GroupTask[] {
  const all = getStoredGroupTasks();
  return all.filter((t) => t.groupId === groupId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
