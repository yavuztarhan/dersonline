'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-store';
import { UserRole } from '@/types/auth';
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
  School,
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Trash2,
  Award,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Plus,
  Crown,
  ChevronDown,
  UserCog,
  Check
} from 'lucide-react';
import { UserAvatar } from '@/components/ui/user-avatar';
import { FeedbackButton } from '@/components/feedback/feedback-button';
import confetti from 'canvas-confetti';

export function AdminDashboard() {
  const {
    admins,
    teachers,
    students,
    currentUser,
    approveTeacher,
    rejectTeacher,
    deleteTeacher,
    deleteAdmin,
    deleteStudent,
    changeUserRole,
    startTeacherRegistration
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'pending' | 'admins' | 'teachers' | 'students'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('Tümü');
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const pendingTeachers = teachers.filter((t) => t.status === 'pending_admin_approval');
  const approvedTeachers = teachers.filter((t) => t.status === 'approved');

  const showNotification = (text: string, type: 'success' | 'info' = 'success') => {
    setNotificationMsg({ text, type });
    try {
      if (type === 'success') {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      }
    } catch (e) {}
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  const handleApprove = (id: string, name: string) => {
    approveTeacher(id);
    showNotification(`"${name}" adlı öğretmenin başvurusu başarıyla onaylandı.`);
  };

  const handleReject = (id: string, name: string) => {
    rejectTeacher(id, 'Okul veya kimlik doğrulaması tamamlanamadı.');
    showNotification(`"${name}" adlı öğretmenin başvurusu reddedildi.`, 'info');
  };

  const handleRoleChange = (userId: string, userName: string, currentRole: UserRole, newRole: UserRole) => {
    if (currentRole === newRole) return;
    
    const roleLabels: Record<UserRole, string> = {
      admin: '👑 Yönetici (Admin)',
      teacher: '👨‍🏫 Öğretmen',
      student: '🎓 Öğrenci'
    };

    const ok = changeUserRole(userId, newRole);
    if (ok) {
      showNotification(
        `"${userName}" kullanıcısının rolü başarıyla ${roleLabels[newRole]} olarak güncellendi!`
      );
    }
  };

  const handleCreateMockPendingTeacher = () => {
    const randomNum = Math.floor(10 + Math.random() * 90);
    const mockPayload = {
      firstName: 'Selin',
      lastName: `Aktaş ${randomNum}`,
      name: `Selin Aktaş ${randomNum}`,
      email: `selin.aktas${randomNum}@meb.k12.tr`,
      phone: `0533 555 ${randomNum} 00`,
      city: 'İzmir',
      district: 'Bornova',
      school: 'Bornova Batıçim Ortaokulu',
      branch: 'Matematik'
    };
    startTeacherRegistration(mockPayload);
    setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem('maarif_teachers') || '[]');
      const updated = saved.map((t: any) =>
        t.email === mockPayload.email ? { ...t, status: 'pending_admin_approval' } : t
      );
      localStorage.setItem('maarif_teachers', JSON.stringify(updated));
      window.location.reload();
    }, 100);
  };

  const filteredAdmins = admins.filter((a) => {
    return (
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredTeachers = teachers.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCity = selectedCityFilter === 'Tümü' || t.city === selectedCityFilter;
    return matchSearch && matchCity;
  });

  const filteredStudents = students.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentNumber.includes(searchTerm) ||
      s.classSection.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Maarif Akademi Yönetici Masası</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Admin Kontrol & Rol Yönetim Paneli
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Kullanıcı rollerini anında değiştirebilir (öğretmeni admin yapma, yetkilendirme), başvuruları onaylayabilir ve tüm veritabanını yönetebilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <FeedbackButton
            contextTitle="Yönetici Paneli"
            tooltip="Yönetim Paneli & Sistem Hakkında Görüş / Not Bırak"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm transition-all cursor-pointer flex items-center justify-center active:scale-95"
            iconClassName="w-4 h-4 text-indigo-300"
          />

          <button
            onClick={handleCreateMockPendingTeacher}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Test Başvurusu Ekle</span>
          </button>
        </div>
      </div>

      {/* Notification Toast Alert */}
      {notificationMsg && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5 text-xs font-black">
            <CheckCircle2 className="w-5 h-5 text-emerald-100" />
            <span>{notificationMsg.text}</span>
          </div>
          <button
            onClick={() => setNotificationMsg(null)}
            className="text-white/80 hover:text-white text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Pending Approvals */}
        <div
          onClick={() => setActiveTab('pending')}
          className={`p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200 ${
            activeTab === 'pending'
              ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-300 shadow-md'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800">Onay Bekleyenler</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
              ⏳
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-950 mt-2">
            {pendingTeachers.length}
          </div>
          <div className="text-[11px] text-amber-700 font-bold mt-0.5">
            {pendingTeachers.length > 0 ? 'İnceleme bekleyen başvuru' : 'Bekleyen başvuru yok'}
          </div>
        </div>

        {/* Card 2: Admins */}
        <div
          onClick={() => setActiveTab('admins')}
          className={`p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200 ${
            activeTab === 'admins'
              ? 'bg-purple-50/80 border-purple-600 ring-2 ring-purple-300 shadow-md'
              : 'bg-white border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-purple-800">Yöneticiler</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
              👑
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {admins.length}
          </div>
          <div className="text-[11px] text-purple-700 font-bold mt-0.5">
            Yetkili Sistem Yöneticisi
          </div>
        </div>

        {/* Card 3: Teachers */}
        <div
          onClick={() => setActiveTab('teachers')}
          className={`p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200 ${
            activeTab === 'teachers'
              ? 'bg-teal-50/80 border-teal-600 ring-2 ring-teal-300 shadow-md'
              : 'bg-white border-slate-200 hover:border-teal-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-teal-800">Öğretmenler</span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black">
              👨‍🏫
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {teachers.length}
          </div>
          <div className="text-[11px] text-teal-700 font-bold mt-0.5">
            {approvedTeachers.length} aktif öğretmen
          </div>
        </div>

        {/* Card 4: Students */}
        <div
          onClick={() => setActiveTab('students')}
          className={`p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200 ${
            activeTab === 'students'
              ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-300 shadow-md'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-blue-800">Öğrenciler</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
              🎓
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {students.length}
          </div>
          <div className="text-[11px] text-blue-700 font-bold mt-0.5">
            Kayıtlı öğrenci sayısı
          </div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 flex-wrap">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Onay Bekleyen Başvurular ({pendingTeachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'admins'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Sistem Yöneticileri (Adminler) ({admins.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'teachers'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tüm Öğretmenler ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'students'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Öğrenci Veritabanı ({students.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING TEACHERS APPROVAL QUEUE */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>⏳ Onay Bekleyen Öğretmen Başvuruları</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
                {pendingTeachers.length} Başvuru
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              E-posta kodunu doğrulayan öğretmenlerin okul ve kimlik bilgileri aşağıdadır. Onaylanan öğretmenler sisteme tam yetkiyle giriş yapabilir veya direkt Admin olarak atanabilir.
            </p>
          </div>

          {pendingTeachers.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <div className="text-4xl">🎉</div>
              <div className="text-sm font-black text-slate-800">
                Şu anda onay bekleyen öğretmen başvurusu bulunmuyor.
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Yeni bir öğretmen e-posta koduyla kayıt olduğunda burada listelenecektir.
              </p>
              <button
                onClick={handleCreateMockPendingTeacher}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-all"
              >
                + Simülasyon İçin Yeni Başvuru Üret
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="p-5 rounded-2xl bg-amber-50/40 border-2 border-amber-200 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar
                          avatar={teacher.avatar}
                          name={teacher.name}
                          size="md"
                          className="bg-amber-100 text-amber-900 border border-amber-300"
                        />
                        <div>
                          <div className="font-extrabold text-sm text-slate-900">{teacher.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{teacher.email}</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                        E-posta Onaylandı ✅
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-amber-100 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-bold">{teacher.city} / {teacher.district}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <School className="w-3.5 h-3.5 text-teal-600" />
                        <span className="font-extrabold">{teacher.school}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>Branş: <strong>{teacher.branch}</strong></span>
                        <span>Kayıt: {teacher.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Role Promotions */}
                  <div className="space-y-2 pt-2 border-t border-amber-200/60">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(teacher.id, teacher.name)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Öğretmen Olarak Onayla</span>
                      </button>

                      <button
                        onClick={() => handleRoleChange(teacher.id, teacher.name, 'teacher', 'admin')}
                        className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                        title="Bu öğretmeni onaylayıp doğrudan Admin yap"
                      >
                        <Crown className="w-4 h-4" />
                        <span>Admin Yap 👑</span>
                      </button>

                      <button
                        onClick={() => handleReject(teacher.id, teacher.name)}
                        className="py-2.5 px-3 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs border border-rose-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Başvuruyu Reddet"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reddet</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SYSTEM ADMINS DIRECTORY & ROLE MANAGEMENT */}
      {activeTab === 'admins' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-600" />
                <span>Sistem Yöneticileri (Adminler)</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-black">
                  {admins.length} Yönetici
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin yetkisine sahip tüm hesaplar. Buradan adminlerin rolünü değiştirebilir veya yetkilerini yönetebilirsiniz.
              </p>
            </div>

            <div className="relative sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Admin adı veya e-posta ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="bg-purple-50/60 text-purple-900 uppercase font-black tracking-wider text-[10px] border-b border-purple-100">
                  <th className="py-3 px-4">Yönetici Adı</th>
                  <th className="py-3 px-4">E-Posta Adresi</th>
                  <th className="py-3 px-4">Yetki Alanı</th>
                  <th className="py-3 px-4">Mevcut Rol</th>
                  <th className="py-3 px-4">Rolü Değiştir</th>
                  <th className="py-3 px-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAdmins.map((adm) => {
                  const isSuperAdmin = adm.email.toLowerCase() === 'admin@maarif.gov.tr' || adm.email.toLowerCase() === 'powerose@gmail.com';
                  return (
                    <tr key={adm.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar
                            avatar={adm.avatar || '👑'}
                            name={adm.name}
                            size="sm"
                            className="bg-purple-100 text-purple-900 border border-purple-300"
                          />
                          <div>
                            <div className="font-extrabold text-slate-900">{adm.name}</div>
                            {adm.school && <div className="text-[10px] text-slate-400">{adm.school}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        {adm.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-extrabold text-[10px] border border-purple-200">
                          ⚡ Tam Yetkili Admin
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white font-black text-[10px] inline-flex items-center gap-1 shadow-xs">
                          <Crown className="w-3 h-3 text-amber-300" />
                          <span>Admin (Yönetici)</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isSuperAdmin ? (
                          <span className="text-[11px] font-bold text-slate-400 italic">Ana Süper Admin</span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <select
                              value="admin"
                              onChange={(e) => handleRoleChange(adm.id, adm.name, 'admin', e.target.value as UserRole)}
                              className="px-2.5 py-1 rounded-lg border border-purple-200 text-xs font-bold text-purple-950 bg-purple-50/50 hover:bg-white focus:border-purple-500 outline-none cursor-pointer"
                            >
                              <option value="admin">👑 Admin (Yönetici)</option>
                              <option value="teacher">👨‍🏫 Öğretmen Yap</option>
                              <option value="student">🎓 Öğrenci Yap</option>
                            </select>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isSuperAdmin && (
                          <button
                            onClick={() => deleteAdmin(adm.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                            title="Admin Yetkisini Kaldır / Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ALL TEACHERS DIRECTORY & ROLE CONVERTER */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                <span>Kayıtlı Öğretmen Listesi</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 text-xs font-black">
                  {teachers.length} Öğretmen
                </span>
              </h3>
              <p className="text-xs text-slate-500">Tüm onaylı ve bekleyen öğretmen profilleri. Buradan herhangi bir öğretmeni anında <strong>Admin</strong> yapabilirsiniz.</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="İsim, okul veya e-posta ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-teal-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-3 px-4">Öğretmen</th>
                  <th className="py-3 px-4">İl / İlçe</th>
                  <th className="py-3 px-4">Okul Adı</th>
                  <th className="py-3 px-4">Branş</th>
                  <th className="py-3 px-4">Durum</th>
                  <th className="py-3 px-4">Rol Değiştir</th>
                  <th className="py-3 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((tch) => (
                  <tr key={tch.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{tch.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{tch.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{tch.city} / {tch.district}</td>
                    <td className="py-3.5 px-4 font-extrabold text-teal-900">{tch.school}</td>
                    <td className="py-3.5 px-4">{tch.branch}</td>
                    <td className="py-3.5 px-4">
                      {tch.status === 'approved' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Onaylandı</span>
                        </span>
                      )}
                      {tch.status === 'pending_admin_approval' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Onay Bekliyor</span>
                        </span>
                      )}
                      {tch.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 font-bold text-[10px] inline-flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>Reddedildi</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {/* Dynamic Role Switcher Dropdown */}
                      <div className="flex items-center gap-1.5">
                        <select
                          value="teacher"
                          onChange={(e) => handleRoleChange(tch.id, tch.name, 'teacher', e.target.value as UserRole)}
                          className="px-2.5 py-1 rounded-lg border border-teal-300 text-xs font-extrabold text-teal-950 bg-teal-50/50 hover:bg-white focus:border-teal-600 outline-none cursor-pointer"
                        >
                          <option value="teacher">👨‍🏫 Öğretmen</option>
                          <option value="admin">👑 Admin Yap (Yönetici)</option>
                          <option value="student">🎓 Öğrenci Yap</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {tch.status === 'pending_admin_approval' && (
                        <button
                          onClick={() => handleApprove(tch.id, tch.name)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                        >
                          Onayla
                        </button>
                      )}
                      <button
                        onClick={() => deleteTeacher(tch.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                        title="Öğretmeni Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 4: ALL STUDENTS DIRECTORY & ROLE CONVERTER */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>Öğrenci Veritabanı</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-black">
                  {students.length} Öğrenci
                </span>
              </h3>
              <p className="text-xs text-slate-500">Sistemdeki kayıtlı öğrenciler. Gerekirse rolü <strong>Öğretmen</strong> veya <strong>Admin</strong> olarak değiştirilebilir.</p>
            </div>

            <div className="relative sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Öğrenci adı, no veya sınıf..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-3 px-4">Okul No</th>
                  <th className="py-3 px-4">Öğrenci Adı</th>
                  <th className="py-3 px-4">Sınıf & Şube</th>
                  <th className="py-3 px-4">Okulu</th>
                  <th className="py-3 px-4">Puan (XP)</th>
                  <th className="py-3 px-4">Rol Değiştir</th>
                  <th className="py-3 px-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900">#{stu.studentNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>🎓</span>
                        <div>
                          <div>{stu.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{stu.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-indigo-700">{stu.classSection}</td>
                    <td className="py-3.5 px-4 font-medium">{stu.school}</td>
                    <td className="py-3.5 px-4 font-black text-amber-600">+{stu.points} XP</td>
                    <td className="py-3.5 px-4">
                      {/* Dynamic Role Switcher Dropdown */}
                      <select
                        value="student"
                        onChange={(e) => handleRoleChange(stu.id, stu.name, 'student', e.target.value as UserRole)}
                        className="px-2.5 py-1 rounded-lg border border-blue-200 text-xs font-bold text-blue-950 bg-blue-50/50 hover:bg-white focus:border-blue-500 outline-none cursor-pointer"
                      >
                        <option value="student">🎓 Öğrenci</option>
                        <option value="teacher">👨‍🏫 Öğretmen Yap</option>
                        <option value="admin">👑 Admin Yap (Yönetici)</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteStudent(stu.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                        title="Öğrenciyi Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
