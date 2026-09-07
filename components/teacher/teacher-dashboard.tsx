'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import Link from 'next/link';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  School,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  Plus,
  Trash2,
  Award,
  ChevronRight,
  MonitorPlay,
  TrendingUp,
  BarChart2,
  Calendar
} from 'lucide-react';

export function TeacherDashboard() {
  const { currentUser, getVisibleStudents, addStudent, deleteStudent, addClassToTeacher } = useAuth();
  const { setSelectedOutcome, playSound } = useApp();

  // If current user is teacher
  const teacher = currentUser && currentUser.role === 'teacher' ? (currentUser as any) : null;
  const teacherClasses = teacher?.assignedClasses && teacher.assignedClasses.length > 0
    ? teacher.assignedClasses
    : ['5-A', '5-B'];

  const [selectedClass, setSelectedClass] = useState(teacherClasses[0] || '5-A');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNumber, setNewStudentNumber] = useState('');
  const [newStudentClass, setNewStudentClass] = useState(selectedClass);
  const [showAddModal, setShowAddModal] = useState(false);

  // Sınıf Ekleme Modalı State
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassNameInput, setNewClassNameInput] = useState('');

  // Keep selectedClass synchronized if classes change
  useEffect(() => {
    if (!teacherClasses.includes(selectedClass)) {
      setSelectedClass(teacherClasses[0] || '5-A');
    }
  }, [teacherClasses, selectedClass]);

  // Students visible to this teacher (only students in same school / added by teacher)
  const visibleStudents = getVisibleStudents(currentUser);
  const classStudents = visibleStudents.filter((s) => s.classSection === selectedClass);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentNumber.trim()) return;

    const targetClass = newStudentClass || selectedClass;

    const newStudent = {
      id: `stu-${Date.now()}`,
      name: newStudentName.trim(),
      email: `${newStudentNumber.trim()}@okul.meb.k12.tr`,
      role: 'student' as const,
      avatar: '🎓',
      studentNumber: newStudentNumber.trim(),
      gradeLevel: parseInt(targetClass.charAt(0)) || 5,
      classSection: targetClass,
      city: teacher?.city || 'Edirne',
      district: teacher?.district || 'Merkez',
      school: teacher?.school || 'Edirne Selimiye İmam Hatip Ortaokulu',
      teacherId: teacher?.id,
      points: 100,
      unlockedBadges: ['first-step'],
      createdAt: new Date().toISOString().split('T')[0]
    };

    addStudent(newStudent);
    playSound('success');
    setNewStudentName('');
    setNewStudentNumber('');
    setShowAddModal(false);
    setSelectedClass(targetClass);
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newClassNameInput.trim().toUpperCase();
    if (!trimmed) return;

    if (teacher?.id) {
      addClassToTeacher(teacher.id, trimmed);
    }
    playSound('click');
    setSelectedClass(trimmed);
    setNewClassNameInput('');
    setShowAddClassModal(false);
  };

  const handleDeleteStudent = (stuId: string, stuName: string) => {
    if (window.confirm(`${stuName} adlı öğrenciyi silmek istediğinize emin misiniz?`)) {
      deleteStudent(stuId);
      playSound('clear');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl border border-teal-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <UserAvatar
            avatar={teacher?.avatar}
            name={teacher?.name}
            size="xl"
            className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-teal-400 bg-teal-500/20 text-teal-200 shadow-inner"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black">{teacher?.name || 'Öğretmen Masası'}</h1>
              {teacher?.status === 'approved' && (
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Onaylı MEB Öğretmeni</span>
                </span>
              )}
              {teacher?.status === 'pending_admin_approval' && (
                <span className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Onayı Bekleniyor</span>
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 flex-wrap">
              <span className="flex items-center gap-1">
                <School className="w-4 h-4 text-teal-400" />
                <strong className="text-white">{teacher?.school || 'Okul Belirtilmedi'}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{teacher?.city || 'İl'} / {teacher?.district || 'İlçe'}</span>
              </span>
              <span>•</span>
              <span className="text-teal-300 font-bold">Branş: {teacher?.branch || 'Matematik'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/profile"
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
            title="Kişisel Bilgileri ve Okulu Düzenle"
          >
            <span>⚙️ Profilimi Düzenle</span>
          </Link>

          <Link
            href="/lesson/MAT.5.3.1"
            className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 active:scale-95 shrink-0"
          >
            <MonitorPlay className="w-4 h-4" />
            <span>Akıllı Tahtada Dersi Başlat</span>
          </Link>
        </div>
      </div>

      {/* PENDING APPROVAL NOTICE IF APPLICABLE */}
      {teacher?.status === 'pending_admin_approval' && (
        <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center text-xl shrink-0">
              ⏳
            </div>
            <div>
              <div className="font-black text-sm">Başvurunuz Yönetici (Admin) Onayı Bekliyor</div>
              <div className="text-xs text-amber-800">
                E-posta onayınız tamamlandı. Okulunuzdaki öğrencileri yönetebilir ve akıllı tahta derslerini başlatabilirsiniz.
              </div>
            </div>
          </div>
          <Link
            href="/profile"
            className="px-3.5 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs transition-colors"
          >
            Bilgilerimi Görüntüle
          </Link>
        </div>
      )}

      {/* Main Grid: Classrooms & Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Sınıf & Öğrenci Yönetimi (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  <span>Sınıfım ve Öğrenci Listesi</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {teacher?.school ? `📍 ${teacher.school} bünyesindeki kayıtlı öğrencileriniz` : 'Öğrencilerinizin başarı ve puan durumu.'}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Dynamic Class Selector */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl flex-wrap gap-1">
                  {teacherClasses.map((cls: string) => (
                    <button
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        selectedClass === cls
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}

                  {/* Sınıf Ekle Butonu */}
                  <button
                    onClick={() => setShowAddClassModal(true)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-teal-700 hover:bg-teal-100/70 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Yeni Sınıf / Şube Ekle"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Sınıf Ekle</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setNewStudentClass(selectedClass);
                    setShowAddModal(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Öğrenci Ekle</span>
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Öğrenci Adı</th>
                    <th className="py-2.5 px-3">Okul</th>
                    <th className="py-2.5 px-3">Puan (XP)</th>
                    <th className="py-2.5 px-3">İlerleme</th>
                    <th className="py-2.5 px-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        <div className="space-y-2">
                          <div className="text-2xl">🎓</div>
                          <p className="font-bold text-xs text-slate-600">
                            {selectedClass} şubesinde henüz kayıtlı öğrenci bulunmuyor.
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Yukarıdaki &quot;Öğrenci Ekle&quot; butonuna basarak sınıfınıza öğrenci tanımlayabilirsiniz.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    classStudents.map((stu) => (
                      <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono font-black text-slate-900">#{stu.studentNumber}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{stu.name}</div>
                          <div className="text-[10px] text-slate-400">{stu.classSection} Şubesi</div>
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-600 truncate max-w-[140px]">
                          {stu.school || teacher?.school}
                        </td>
                        <td className="py-3 px-3 font-black text-amber-600">+{stu.points} XP</td>
                        <td className="py-3 px-3">
                          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-teal-500 h-full rounded-full"
                              style={{ width: `${Math.min(100, (stu.points / 500) * 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(stu.id, stu.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Öğrenciyi Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* SINIF EKLE MODAL */}
          {showAddClassModal && (
            <div className="p-5 rounded-3xl bg-teal-950 text-white space-y-4 animate-in fade-in border border-teal-800 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-teal-300">Yeni Sınıf / Şube Tanımla</h4>
                <button
                  onClick={() => setShowAddClassModal(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕ Kapat
                </button>
              </div>

              <form onSubmit={handleAddClass} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="Sınıf Adı (Örn: 5-C, 6-A, 7-B)"
                  value={newClassNameInput}
                  onChange={(e) => setNewClassNameInput(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-slate-800 border border-teal-700 text-xs text-white outline-none focus:border-teal-400 uppercase font-bold"
                />
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Sınıfı Ekle</span>
                </button>
              </form>
            </div>
          )}

          {/* ADD STUDENT MODAL */}
          {showAddModal && (
            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4 animate-in fade-in border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-teal-300">Yeni Öğrenci Tanımla</h4>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕ Kapat
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Okul No (Örn: 105)"
                  value={newStudentNumber}
                  onChange={(e) => setNewStudentNumber(e.target.value)}
                  className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-teal-400"
                />
                <input
                  type="text"
                  required
                  placeholder="Ad Soyad (Örn: Beren Kurt)"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="sm:col-span-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-teal-400"
                />
                <select
                  value={newStudentClass}
                  onChange={(e) => setNewStudentClass(e.target.value)}
                  className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-teal-400"
                >
                  {teacherClasses.map((cls: string) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>

                <div className="sm:col-span-4 flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-bold"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Öğrenciyi Kaydet</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Right Column: Active Curriculum Outcomes */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Ders Planı & Kazanımlar</span>
            </h3>

            {/* Outcome 1 Card */}
            <Link
              href="/lesson/MAT.5.3.1"
              className="p-4 rounded-2xl bg-teal-50/50 border-2 border-teal-200 hover:border-teal-400 transition-all flex flex-col justify-between block space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-teal-600 text-white">
                  MAT.5.3.1 (1. Hafta)
                </span>
                <span className="text-xs text-teal-800 font-bold group-hover:translate-x-1 transition-transform">
                  Derse Git ➔
                </span>
              </div>
              <div className="font-extrabold text-xs text-slate-900">
                Temel Geometrik Çizimler ve Sembolik Gösterimler
              </div>
              <div className="text-[11px] text-slate-500">
                4 Aşama: Hikaye, Çizim Atölyesi, Kelime Avı, 8 Soru Test
              </div>
            </Link>

            {/* Outcome 2 Card */}
            <Link
              href="/lesson/MAT.5.3.2"
              className="p-4 rounded-2xl bg-indigo-50/50 border-2 border-indigo-200 hover:border-indigo-400 transition-all flex flex-col justify-between block space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-indigo-600 text-white">
                  MAT.5.3.2 (2. Hafta)
                </span>
                <span className="text-xs text-indigo-800 font-bold group-hover:translate-x-1 transition-transform">
                  Derse Git ➔
                </span>
              </div>
              <div className="font-extrabold text-xs text-slate-900">
                Geometrinin İzinde: Çıkarım ve Keşif Atölyesi
              </div>
              <div className="text-[11px] text-slate-500">
                Selimiye Planı, 3 Deney Masası, Çıkarım Terazisi, Öğrenme Günlüğü
              </div>
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}
