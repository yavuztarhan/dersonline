'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  X,
  Trash2,
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
  Users,
  GraduationCap,
  FileText,
  Building2
} from 'lucide-react';
import { TeacherUser } from '@/types/auth';
import { useAuth } from '@/lib/auth-store';

interface AdminDeleteTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherUser | null;
  onDeleted?: (teacherName: string) => void;
}

export function AdminDeleteTeacherModal({
  isOpen,
  onClose,
  teacher,
  onDeleted,
}: AdminDeleteTeacherModalProps) {
  const { deleteTeacher, classrooms, students } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [riskAccepted, setRiskAccepted] = useState(false);
  const [securityCode, setSecurityCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Generate a random confirmation code when modal opens or teacher changes
  const generateNewSecurityCode = () => {
    if (!teacher) return '';
    const cleanName = (teacher.firstName || teacher.name || 'OGRETMEN')
      .replace(/[^A-Za-z0-9]/g, '')
      .toUpperCase()
      .substring(0, 6);
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let randomPart = '';
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `SIL-${cleanName}-${randomPart}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && teacher) {
      setRiskAccepted(false);
      setInputCode('');
      setErrorMsg('');
      setIsDeleting(false);
      setSecurityCode(generateNewSecurityCode());
    }
  }, [isOpen, teacher]);

  if (!isOpen || !teacher || !mounted) return null;

  // Impacted data counts
  const teacherClasses = teacher.assignedClasses || [];
  const impactedStudents = students.filter(
    (s) =>
      (!s.teacherId || s.teacherId === teacher.id || (teacher.school && s.school === teacher.school)) &&
      (teacherClasses.includes(s.classSection) || s.teacherId === teacher.id)
  );

  const isCodeCorrect = inputCode.trim().toUpperCase() === securityCode;
  const canDelete = riskAccepted && isCodeCorrect && !isDeleting;

  const handleDelete = async () => {
    if (!canDelete) return;
    setIsDeleting(true);
    setErrorMsg('');

    try {
      // 1. Call backend API for complete PostgreSQL cascade deletion
      const res = await fetch('/api/admin/teachers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: teacher.id,
          email: teacher.email,
        }),
      });

      const data = await res.json();
      if (!data?.success) {
        console.warn('Backend teacher deletion note:', data?.error);
      }

      // 2. Cascade cleanup on client stores (local storage & state)
      // Delete teacher from auth-store
      deleteTeacher(teacher.id);

      // Clean related students from local store
      try {
        const studentIds = new Set(impactedStudents.map((s) => s.id));
        const studentsRaw = localStorage.getItem('maarif_students');
        if (studentsRaw) {
          const parsed = JSON.parse(studentsRaw);
          const next = parsed.filter((s: any) => !studentIds.has(s.id) && s.teacherId !== teacher.id);
          localStorage.setItem('maarif_students', JSON.stringify(next));
        }

        // Clean classrooms
        const classroomsRaw = localStorage.getItem('maarif_classrooms');
        if (classroomsRaw) {
          const parsed = JSON.parse(classroomsRaw);
          const next = parsed.filter((c: any) => c.teacherId !== teacher.id);
          localStorage.setItem('maarif_classrooms', JSON.stringify(next));
        }
      } catch (e) {}

      if (onDeleted) {
        onDeleted(teacher.name);
      }
      onClose();
    } catch (err: any) {
      console.error('Delete teacher error:', err);
      setErrorMsg(err.message || 'Öğretmen silinirken bir hata oluştu.');
      setIsDeleting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-rose-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 text-white flex items-center justify-between border-b border-rose-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black">Öğretmen Hesabını ve Tüm Verilerini Sil</h3>
              <p className="text-xs text-rose-200">Yüksek güvenlikli kalıcı veri temizliği</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {/* TEACHER SUMMARY CARD */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
              {teacher.avatar || '👨‍🏫'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-sm text-slate-900 truncate">{teacher.name}</h4>
              <p className="text-xs text-slate-600 truncate flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-rose-600" />
                {teacher.school} • {teacher.branch}
              </p>
              <p className="text-[11px] text-slate-400 font-mono truncate">{teacher.email}</p>
            </div>
          </div>

          {/* WARNING & IMPACT LIST */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs text-amber-900">
            <div className="flex items-center gap-2 font-black text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>DİKKAT: Bu işlem GERİ ALINAMAZ ve şu verileri kalıcı olarak siler:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-amber-900">
              <li>
                <strong>Öğretmenin {teacherClasses.length} Sınıfı:</strong>{' '}
                {teacherClasses.join(', ') || 'Kayıtlı sınıf yok'}
              </li>
              <li>
                <strong>{impactedStudents.length} Öğrenci Hesabı:</strong> Bu sınıflardaki tüm öğrencilerin giriş şifreleri ve profilleri silinir.
              </li>
              <li>
                <strong>Tüm Süreç Verileri:</strong> Öğrencilere ait tüm rubrik teslimleri, yansıtıcı öğrenme günlükleri, akıllı tahta katılım puanları ve akran formları.
              </li>
              <li>
                <strong>Ders Notları & Dosyalar:</strong> Öğretmenin beyaz tahtada kaydettiği tüm ders notları arşivden silinir.
              </li>
            </ul>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: RISK ACCEPTANCE CHECKBOX */}
          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors select-none">
            <input
              type="checkbox"
              checked={riskAccepted}
              onChange={(e) => setRiskAccepted(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer"
            />
            <span className="text-xs text-slate-700 leading-relaxed font-semibold">
              Bu öğretmene ait <strong>tüm sınıfların, öğrenci hesaplarının, şifrelerinin ve geçmiş verilerinin</strong> kalıcı olarak silineceğini ve bu işlemin geri alınamayacağını onaylıyorum.
            </span>
          </label>

          {/* STEP 2: SECURITY CODE CONFIRMATION */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-700">Güvenlik Doğrulama Kodu:</span>
              <button
                type="button"
                onClick={() => {
                  setSecurityCode(generateNewSecurityCode());
                  setInputCode('');
                }}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                title="Yeni kod üret"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Yenile</span>
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 text-rose-400 font-mono font-black text-center text-sm tracking-wider select-all">
              {securityCode}
            </div>

            <div>
              <input
                type="text"
                placeholder="Yukarıdaki kodu harfi harfine buraya yazınız..."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                disabled={!riskAccepted}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono font-bold outline-none transition-all ${
                  !riskAccepted
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : isCodeCorrect
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-300 focus:border-rose-500 bg-white'
                }`}
              />
              {inputCode && !isCodeCorrect && riskAccepted && (
                <p className="text-[11px] text-rose-600 font-bold mt-1">
                  Güvenlik kodu eşleşmiyor. Lütfen büyük/küçük harflere dikkat ediniz.
                </p>
              )}
              {isCodeCorrect && (
                <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Kod doğrulandı. Silme işlemi onaylandı.
                </p>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              İptal Et
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={!canDelete}
              className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black hover:bg-rose-700 transition-all flex items-center gap-2 shadow-md shadow-rose-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? 'Kalıcı Olarak Siliniyor...' : 'Öğretmeni ve Tüm Verilerini Sil'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
