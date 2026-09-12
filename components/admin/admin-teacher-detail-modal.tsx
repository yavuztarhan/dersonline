'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Calendar,
  LogIn,
  Monitor,
  Smartphone,
  Tv,
  Users,
  Award,
  BookMarked,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Ban,
  PlayCircle,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/lib/auth-store';
import { TeacherUser } from '@/types/auth';
import { AdminSendMessageModal } from '@/components/admin/admin-send-message-modal';
import { AdminDeleteTeacherModal } from '@/components/admin/admin-delete-teacher-modal';

interface AdminTeacherDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherUser | null;
}

export function AdminTeacherDetailModal({
  isOpen,
  onClose,
  teacher,
}: AdminTeacherDetailModalProps) {
  const { students: localStudents, suspendTeacher, unsuspendTeacher } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [studentSearch, setStudentSearch] = useState('');
  const [onlyAtRisk, setOnlyAtRisk] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch teacher details from API
  const fetchTeacherDetails = async () => {
    if (!teacher) return;
    setLoading(true);
    try {
      const url = `/api/admin/teacher-details?email=${encodeURIComponent(teacher.email || '')}&teacherId=${encodeURIComponent(teacher.id || '')}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.success) {
        setApiData(data);
        if (data.classrooms && data.classrooms.length > 0) {
          setSelectedClass((prev) => prev || data.classrooms[0].name);
        }
      }
    } catch (err) {
      console.warn('Teacher details fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && teacher) {
      setApiData(null);
      setSelectedClass('');
      setStudentSearch('');
      setOnlyAtRisk(false);
      fetchTeacherDetails();
    }
  }, [isOpen, teacher?.id, teacher?.email]);

  if (!isOpen || !teacher || !mounted) return null;

  // Merged info from API + Teacher object
  const teacherInfo = apiData?.teacher || {
    name: teacher.name,
    email: teacher.email,
    phone: teacher.phone,
    school: teacher.school,
    branch: teacher.branch,
    city: teacher.city,
    district: teacher.district,
    principalName: teacher.principalName,
    status: teacher.status,
    accountStatus: (teacher as any).accountStatus || (teacher.status === 'suspended' ? 'beklemede' : 'aktif'),
    registeredAt: teacher.createdAt || new Date().toISOString(),
    lastLoginAt: null,
    loginCount: 0,
    deviceBreakdown: { smartboard: 0, mobile: 0, desktop: 0, windows: 0 },
    totalClasses: teacher.assignedClasses?.length || 0,
    totalStudents: 0,
    feedbackGivenCount: 0,
  };

  const isSuspended = teacherInfo.accountStatus === 'beklemede' || teacherInfo.status === 'suspended' || teacherInfo.status === 'SUSPENDED';

  // Classrooms list: prefer API classrooms, fallback to teacher.assignedClasses
  const classroomsList = apiData?.classrooms?.length > 0
    ? apiData.classrooms
    : (teacher.assignedClasses || []).map((cls: string) => ({
        id: `cls-${cls}`,
        name: cls,
        code: `MRF${cls.replace(/[^A-Z0-9]/g, '')}`,
        gradeLevel: parseInt(cls.charAt(0)) || 5,
        school: teacher.school || '',
        totalStudents: 0,
        activeStudents: 0,
        totalXp: 0,
        students: [],
      }));

  const activeClassroom = classroomsList.find(
    (c: any) => c.name.toUpperCase() === (selectedClass || classroomsList[0]?.name || '').toUpperCase()
  ) || classroomsList[0];

  // Merge students from API and local store for this classroom
  const apiStudents = activeClassroom?.students || [];
  const localClassStudents = localStudents.filter(
    (s) => s.classSection?.toUpperCase() === activeClassroom?.name?.toUpperCase() &&
      (!s.teacherId || s.teacherId === teacher.id || (teacher.school && s.school === teacher.school))
  );

  // Combine unique by studentNumber or id
  const studentMap = new Map<string, any>();
  
  // 1. Add local students first
  localClassStudents.forEach((ls) => {
    const key = ls.studentNumber || ls.id;
    studentMap.set(key, {
      id: ls.id,
      studentNumber: ls.studentNumber || '—',
      name: ls.name,
      classSection: ls.classSection,
      classCode: ls.classCode || activeClassroom?.code,
      points: ls.points || 0,
      lastLoginAt: null,
      loginCount: 0,
      rubricCount: 0,
      journalCount: 0,
      boardParticipationCount: 0,
      isAtRisk: false,
    });
  });

  // 2. Overlay API students (which have real DB login counts and activity counts)
  apiStudents.forEach((as: any) => {
    const key = as.studentNumber || as.id;
    studentMap.set(key, {
      ...studentMap.get(key),
      ...as,
    });
  });

  const allDisplayStudents = Array.from(studentMap.values());

  // Filtered by search and at-risk
  const filteredStudents = allDisplayStudents.filter((s) => {
    const matchesSearch =
      !studentSearch.trim() ||
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentNumber.includes(studentSearch.trim());
    const matchesRisk = !onlyAtRisk || s.isAtRisk;
    return matchesSearch && matchesRisk;
  });

  // Format date
  const formatDate = (dStr?: string | null) => {
    if (!dStr) return 'Giriş kaydı yok';
    try {
      const d = new Date(dStr);
      return d.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dStr;
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-2xl shadow-inner">
              {teacher.avatar || '👨‍🏫'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">{teacherInfo.name}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isSuspended
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : teacherInfo.status === 'approved' || teacherInfo.status === 'APPROVED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {isSuspended
                    ? '⏸ Askıda (Beklemede)'
                    : teacherInfo.status === 'approved' || teacherInfo.status === 'APPROVED'
                    ? '✓ Onaylı Öğretmen'
                    : '⏳ Onay Bekliyor'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-black">
                  {teacherInfo.branch}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  {teacherInfo.email}
                </span>
                {teacherInfo.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                    {teacherInfo.phone}
                  </span>
                )}
                <span className="flex items-center gap-1 text-slate-400">
                  <Building2 className="w-3.5 h-3.5 text-teal-400" />
                  {teacherInfo.school} ({teacherInfo.city} / {teacherInfo.district})
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchTeacherDetails}
              disabled={loading}
              title="Verileri Yenile"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SUSPENSION ALERT BANNER */}
        {isSuspended && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 flex items-center justify-between text-xs text-rose-900 font-bold">
            <div className="flex items-center gap-2">
              <Ban className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>Bu öğretmenin hesabı askıya alınmıştır (beklemede). Öğretmen sisteme giriş yapabilir ancak ders veya sınıf yönetimini kullanamaz; yalnızca yöneticiyle mesajlaşabilir.</span>
            </div>
            <button
              onClick={() => {
                unsuspendTeacher(teacher.id, teacher.email);
                setApiData((prev: any) => prev ? { ...prev, teacher: { ...prev.teacher, status: 'approved', accountStatus: 'aktif' } } : null);
              }}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-black shrink-0 transition-colors shadow-sm ml-4"
            >
              Askıyı Kaldır
            </button>
          </div>
        )}

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {/* SECTION 1: KEY PERFORMANCE INDICATORS (KPIs) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* 1. Registration Date */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Kayıt Tarihi</span>
                <Calendar className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-base font-black text-slate-900">
                {new Date(teacherInfo.registeredAt).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              <p className="text-[10px] text-slate-400">
                Saat: {new Date(teacherInfo.registeredAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* 2. Total Logins */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Toplam Oturum</span>
                <LogIn className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-base font-black text-slate-900">
                {teacherInfo.loginCount} Giriş
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Son: {formatDate(teacherInfo.lastLoginAt)}
              </p>
            </div>

            {/* 3. Total Classes & Students */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Sınıf & Öğrenci</span>
                <Users className="w-4 h-4 text-teal-500" />
              </div>
              <div className="text-base font-black text-slate-900">
                {classroomsList.length} Şube / {allDisplayStudents.length} Öğrenci
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {classroomsList.map((c: any) => c.name).join(', ') || 'Şube yok'}
              </p>
            </div>

            {/* 4. Feedback & Activity */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Öğrenci Dönütü</span>
                <MessageSquare className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-base font-black text-slate-900">
                {teacherInfo.feedbackGivenCount} Dönüt Verildi
              </div>
              <p className="text-[10px] text-slate-400">
                Pedagojik Etkileşim İndeksi
              </p>
            </div>
          </div>

          {/* SECTION 2: DEVICE LOGIN BREAKDOWN */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-slate-600" />
              <span>Giriş Yapılan Cihaz Dağılımı (Ders İçi Akıllı Tahta & Mobil)</span>
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">
                    {teacherInfo.deviceBreakdown?.smartboard || 0} Oturum
                  </div>
                  <div className="text-[10px] text-indigo-700 font-semibold">
                    Akıllı Tahta (Pardus / ETAP)
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500 text-white flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">
                    {teacherInfo.deviceBreakdown?.mobile || 0} Oturum
                  </div>
                  <div className="text-[10px] text-purple-700 font-semibold">
                    Mobil (Telefon & Tablet)
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">
                    {(teacherInfo.deviceBreakdown?.desktop || 0) + (teacherInfo.deviceBreakdown?.windows || 0)} Oturum
                  </div>
                  <div className="text-[10px] text-teal-700 font-semibold">
                    Masaüstü & Laptop Web
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: CLASSROOM SELECTION & STUDENT DIRECTORY */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Classroom Tabs Navigation */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-teal-600" />
                  <span>Öğretmenin Sınıfları & Kayıtlı Öğrenciler</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Öğrencilerin giriş istatistiklerini ve süreç odaklı gelişimlerini görmek için şube seçiniz.
                </p>
              </div>

              {/* Class Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {classroomsList.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">Kayıtlı sınıf bulunmuyor</span>
                ) : (
                  classroomsList.map((cls: any) => {
                    const isSelected = cls.name.toUpperCase() === activeClassroom?.name?.toUpperCase();
                    return (
                      <button
                        key={cls.id || cls.name}
                        onClick={() => setSelectedClass(cls.name)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 ring-2 ring-teal-600/30'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <span>{cls.name}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                            isSelected ? 'bg-teal-800 text-teal-100' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          Kod: {cls.code || 'MRF...'}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Students Search & Filter Bar */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Öğrenci adı veya okul no ara..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs focus:border-teal-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyAtRisk}
                    onChange={(e) => setOnlyAtRisk(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                  />
                  <span className="flex items-center gap-1 text-rose-600 font-extrabold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    İnaktif / Takip Gerekenler
                  </span>
                </label>

                <div className="text-xs text-slate-500 font-bold">
                  {filteredStudents.length} / {allDisplayStudents.length} Öğrenci
                </div>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-200 sticky top-0 z-10">
                    <th className="py-2.5 px-4">No</th>
                    <th className="py-2.5 px-4">Öğrenci Adı</th>
                    <th className="py-2.5 px-4">Sınıf Kodu</th>
                    <th className="py-2.5 px-4">Sisteme Giriş & Son Görülme</th>
                    <th className="py-2.5 px-4">XP Puanı</th>
                    <th className="py-2.5 px-4">Rubrik</th>
                    <th className="py-2.5 px-4">Günlük</th>
                    <th className="py-2.5 px-4">Tahta Katılımı</th>
                    <th className="py-2.5 px-4 text-center">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-slate-400">
                        {allDisplayStudents.length === 0 ? (
                          <div className="space-y-1">
                            <Users className="w-8 h-8 text-slate-300 mx-auto" />
                            <p className="font-bold">Bu şubede henüz kayıtlı öğrenci bulunmuyor.</p>
                            <p className="text-[11px]">Öğretmen panelinden tekli veya Excel ile öğrenci eklenebilir.</p>
                          </div>
                        ) : (
                          <p>Arama kriterlerine uygun öğrenci bulunamadı.</p>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-4 font-black text-slate-500">
                          {s.studentNumber}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          {s.name}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-[10px] text-slate-700">
                            {s.classCode || activeClassroom?.code || '—'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="font-bold text-slate-800">
                            {s.loginCount ? `${s.loginCount} kez girdi` : '1+ oturum'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {s.lastLoginAt ? formatDate(s.lastLoginAt) : 'Yeni oturum'}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-black text-amber-600 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          <span>{s.points} XP</span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-teal-700">
                          {s.rubricCount} Teslim
                        </td>
                        <td className="py-2.5 px-4 font-bold text-indigo-700">
                          {s.journalCount} Günlük
                        </td>
                        <td className="py-2.5 px-4 font-bold text-purple-700">
                          {s.boardParticipationCount} Katılım
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {s.isAtRisk ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[10px] inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              <span>Takip Gerekli</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Aktif</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Öğretmen ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">{teacher.id}</code>
          </div>

          <div className="flex items-center gap-2">
            {/* Mesaj Gönder */}
            <button
              onClick={() => setShowMessageModal(true)}
              className="px-3 py-2 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 font-extrabold text-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Mesaj Gönder</span>
            </button>

            {/* Askıya Al / Askıyı Kaldır */}
            {isSuspended ? (
              <button
                onClick={() => {
                  unsuspendTeacher(teacher.id, teacher.email);
                  setApiData((prev: any) => prev ? { ...prev, teacher: { ...prev.teacher, status: 'approved', accountStatus: 'aktif' } } : null);
                }}
                className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-extrabold text-xs inline-flex items-center gap-1.5 transition-colors"
              >
                <PlayCircle className="w-4 h-4 text-emerald-600" />
                <span>Askıyı Kaldır (Aktif Et)</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (confirm(`${teacher.name} adlı öğretmeni askıya almak istediğinize emin misiniz? Öğretmen sisteme giriş yapabilecek ancak dersleri kullanamayacak ve sadece yöneticiye mesaj yazabilecektir.`)) {
                    suspendTeacher(teacher.id, teacher.email);
                    setApiData((prev: any) => prev ? { ...prev, teacher: { ...prev.teacher, status: 'suspended', accountStatus: 'beklemede' } } : null);
                  }
                }}
                className="px-3 py-2 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-extrabold text-xs inline-flex items-center gap-1.5 transition-colors"
              >
                <Ban className="w-4 h-4 text-amber-600" />
                <span>Askıya Al</span>
              </button>
            )}

            {/* Kalıcı Olarak Sil (Doğrulama Kodlu) */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-extrabold text-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Öğretmeni Sil</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-colors shadow-sm ml-2"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>

      {/* Sub-modals for Action buttons */}
      <AdminSendMessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        teacher={teacher}
      />

      <AdminDeleteTeacherModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        teacher={teacher}
        onDeleted={() => {
          setShowDeleteModal(false);
          onClose();
        }}
      />
    </div>,
    document.body
  );
}
