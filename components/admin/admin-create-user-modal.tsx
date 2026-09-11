'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/lib/auth-store';
import { validatePassword } from '@/lib/password-validator';
import { getAllProvinces, getDistrictsByProvince, fetchDistrictsApi, getSchoolsByDistrict, fetchSchoolsApi } from '@/lib/turkey-locations';
import {
  X,
  UserPlus,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Plus,
  Sparkles,
  Loader2
} from 'lucide-react';

const BRANCH_OPTIONS = [
  'Matematik',
  'Fen Bilimleri',
  'Türkçe',
  'Sosyal Bilgiler',
  'İngilizce',
  'Bilişim Teknolojileri ve Yazılım',
  'Din Kültürü ve Ahlak Bilgisi',
  'Görsel Sanatlar',
  'Müzik',
  'Beden Eğitimi',
  'Teknoloji ve Tasarım',
  'Rehberlik / Psikolojik Danışmanlık',
  'Sınıf Öğretmenliği',
  'Diğer'
];

const GRADE_OPTIONS = ['5', '6', '7', '8'];
const SECTION_OPTIONS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'İ',
  'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S',
  'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'
];

interface AdminCreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated?: (userName: string, role: string) => void;
}

export function AdminCreateUserModal({ isOpen, onClose, onUserCreated }: AdminCreateUserModalProps) {
  const { adminCreateUser } = useAuth();

  const [role, setRole] = useState<'teacher' | 'admin'>('teacher');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Edirne');
  const [district, setDistrict] = useState('Merkez');
  const [school, setSchool] = useState('Edirne Selimiye İmam Hatip Ortaokulu');
  const [principalName, setPrincipalName] = useState('Mehmet GÜNGÖR');
  const [branch, setBranch] = useState('Matematik');
  const [assignedClasses, setAssignedClasses] = useState<string[]>(['5-A', '5-B']);
  
  // Dual dropdown class selector
  const [selectedGrade, setSelectedGrade] = useState<'5' | '6' | '7' | '8'>('5');
  const [selectedSection, setSelectedSection] = useState<string>('A');

  // Location lists
  const allProvinces = getAllProvinces();
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [schoolsList, setSchoolsList] = useState<{ id: string; name: string; type: string }[]>([]);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Live Password check
  const passValidation = validatePassword(password);

  // Load districts
  useEffect(() => {
    let active = true;
    async function loadDistricts() {
      try {
        const d = await fetchDistrictsApi(city);
        if (active) {
          setDistrictsList(d);
          if (!d.includes(district)) setDistrict(d[0] || 'Merkez');
        }
      } catch (e) {
        if (active) setDistrictsList(getDistrictsByProvince(city));
      }
    }
    loadDistricts();
    return () => { active = false; };
  }, [city]);

  // Load schools
  useEffect(() => {
    let active = true;
    async function loadSchools() {
      try {
        const s = await fetchSchoolsApi(city, district);
        if (active) {
          setSchoolsList(s);
          if (s.length > 0 && !school) setSchool(s[0].name);
        }
      } catch (e) {
        if (active) setSchoolsList(getSchoolsByDistrict(city, district));
      }
    }
    loadSchools();
    return () => { active = false; };
  }, [city, district]);

  const handlePhoneChange = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = digits.slice(1);
    if (digits.startsWith('90') && digits.length > 10) digits = digits.slice(2);
    setPhone(digits.slice(0, 10));
  };

  const handleAddClass = () => {
    const tag = `${selectedGrade}-${selectedSection}`;
    if (!assignedClasses.includes(tag)) {
      setAssignedClasses([...assignedClasses, tag]);
    }
  };

  const handleRemoveClass = (cls: string) => {
    if (assignedClasses.length <= 1) return;
    setAssignedClasses(assignedClasses.filter((c) => c !== cls));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!firstName.trim()) {
      setErrorMsg('Lütfen ad giriniz.');
      return;
    }
    if (!lastName.trim()) {
      setErrorMsg('Lütfen soyad giriniz.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    if (!passValidation.isValid) {
      setErrorMsg(passValidation.errorMessage || 'Şifre kurallara uymuyor.');
      return;
    }

    setIsSubmitting(true);

    const res = adminCreateUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: role,
      phone: phone.trim(),
      city,
      district,
      school,
      branch,
      principalName,
      assignedClasses
    });

    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Kullanıcı oluşturulurken bir hata oluştu.');
      return;
    }

    if (onUserCreated) {
      onUserCreated(`${firstName} ${lastName}`.trim(), role === 'admin' ? 'Yönetici' : 'Öğretmen');
    }
    onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl my-8 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold">
            <UserPlus className="w-3.5 h-3.5 text-teal-400" />
            <span>Yönetici Paneli Manuel Kayıt Aracı</span>
          </div>
          <h2 className="text-xl font-black">Yeni Kullanıcı & Hesap Oluştur</h2>
          <p className="text-xs text-slate-300">
            Yönetici veya öğretmen hesabı oluşturup şifresini belirleyin. Hesap doğrudan onaylanacaktır.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Role Selector Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800">Kullanıcı Rolü / Yetki Türü</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'teacher' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>👨‍🏫 Öğretmen Hesabı</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'admin' ? 'bg-white text-indigo-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>👑 Yönetici (Admin) Hesabı</span>
              </button>
            </div>
          </div>

          {/* Ad & Soyad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Ad (İsim) *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Örn: Mehmet"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Soyad *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Örn: Kaya"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* E-Posta */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Giriş E-Posta Adresi *</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kullanici@okul.k12.tr veya gmail.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500"
            />
          </div>

          {/* Şifre ve Güvenlik Kuralları */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Kullanıcı Giriş Şifresi *</span>
                </span>
                <span className="text-[10px] text-slate-500">Zorunlu Güvenlik Kuralı</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter (Büyük, küçük harf ve rakam)"
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Password Criteria Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-bold select-none">
              <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${passValidation.hasMinLength ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                <span>{passValidation.hasMinLength ? '✓' : '○'}</span>
                <span>En az 6 karakter</span>
              </div>
              <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${passValidation.hasUpperCase ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                <span>{passValidation.hasUpperCase ? '✓' : '○'}</span>
                <span>1 Büyük Harf</span>
              </div>
              <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${passValidation.hasLowerCase ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                <span>{passValidation.hasLowerCase ? '✓' : '○'}</span>
                <span>1 Küçük Harf</span>
              </div>
              <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${passValidation.hasNumber ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                <span>{passValidation.hasNumber ? '✓' : '○'}</span>
                <span>1 Rakam (0-9)</span>
              </div>
            </div>
          </div>

          {/* Telefon & Branş */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">İletişim Telefonu (10 Hane)</label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white">
                <span className="px-3 py-2 bg-slate-100 text-slate-700 font-bold text-xs select-none border-r border-slate-200">
                  +90
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="5051234567"
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Branş</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white outline-none focus:border-teal-500 cursor-pointer"
              >
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Konum & Okul */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">İl</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white outline-none focus:border-teal-500 cursor-pointer"
              >
                {allProvinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">İlçe</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white outline-none focus:border-teal-500 cursor-pointer"
              >
                {districtsList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Okul Adı</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Okul adı"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Sınıflar & Şubeler (Dual Dropdown) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700">Gireceği Sınıflar ve Şubeler</label>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white outline-none focus:border-teal-500 cursor-pointer"
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}. Sınıf
                  </option>
                ))}
              </select>

              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white outline-none focus:border-teal-500 cursor-pointer min-w-[80px]"
              >
                {SECTION_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s} Şubesi
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddClass}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ekle</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {assignedClasses.map((cls) => (
                <span
                  key={cls}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5"
                >
                  <span>📚 {cls}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveClass(cls)}
                    className="text-slate-400 hover:text-rose-600 text-[10px] font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !passValidation.isValid}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Kullanıcı Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kullanıcıyı Kaydet ve Onayla</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>,
    document.body
  );
}
