'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  getAllProvinces,
  getDistrictsByProvince,
  getSchoolsByDistrict,
  fetchDistrictsApi,
  fetchSchoolsApi
} from '@/lib/turkey-locations';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  User,
  Mail,
  Phone,
  School,
  MapPin,
  BookOpen,
  Lock,
  CheckCircle2,
  Sparkles,
  Save,
  ArrowLeft,
  Plus,
  ShieldCheck,
  Building2,
  AlertCircle,
  Search,
  Loader2,
  RefreshCw
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

export default function ProfilePage() {
  const { currentUser, updateTeacherProfile } = useAuth();
  const { playSound } = useApp();
  const router = useRouter();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [branch, setBranch] = useState('Matematik');
  const [city, setCity] = useState('Edirne');
  const [district, setDistrict] = useState('Merkez');
  const [school, setSchool] = useState('Edirne Selimiye İmam Hatip Ortaokulu');
  const [principalName, setPrincipalName] = useState('Mehmet GÜNGÖR');
  const [isCustomSchool, setIsCustomSchool] = useState(false);
  const [customSchoolName, setCustomSchoolName] = useState('');
  const [assignedClasses, setAssignedClasses] = useState<string[]>(['5-A', '5-B']);
  const [newClassInput, setNewClassInput] = useState('');

  // Live API States
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [schoolsList, setSchoolsList] = useState<{ id: string; name: string; type: string }[]>([]);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All 81 Turkish Provinces
  const allProvinces = getAllProvinces();

  // Initialize form with currentUser data
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');

      if (currentUser.role === 'teacher') {
        const tch = currentUser as any;
        setPhone(tch.phone || '');
        setBranch(tch.branch || 'Matematik');
        setPrincipalName(tch.principalName || 'Mehmet GÜNGÖR');
        const initialCity = tch.city || 'Edirne';
        const initialDistrict = tch.district || 'Merkez';
        setCity(initialCity);
        setDistrict(initialDistrict);
        setSchool(tch.school || 'Edirne Selimiye İmam Hatip Ortaokulu');
        setAssignedClasses(tch.assignedClasses && tch.assignedClasses.length > 0 ? tch.assignedClasses : ['5-A', '5-B']);
      }
    }
  }, [currentUser]);

  // Load districts when city changes
  useEffect(() => {
    let isMounted = true;
    async function loadDistricts() {
      setLoadingDistricts(true);
      try {
        const districts = await fetchDistrictsApi(city);
        if (isMounted) {
          setDistrictsList(districts);
          if (!districts.includes(district)) {
            setDistrict(districts[0] || 'Merkez');
          }
        }
      } catch (err) {
        console.warn('Districts load error:', err);
        if (isMounted) {
          const fallback = getDistrictsByProvince(city);
          setDistrictsList(fallback);
        }
      } finally {
        if (isMounted) setLoadingDistricts(false);
      }
    }
    loadDistricts();
    return () => {
      isMounted = false;
    };
  }, [city]);

  // Load schools when city or district changes
  useEffect(() => {
    let isMounted = true;
    async function loadSchools() {
      if (!district) return;
      setLoadingSchools(true);
      try {
        const schools = await fetchSchoolsApi(city, district);
        if (isMounted) {
          setSchoolsList(schools);
          // If current school is not in list and not custom, set to first school
          if (schools.length > 0 && !isCustomSchool) {
            const exists = schools.some((s) => s.name.toLocaleLowerCase('tr') === school.toLocaleLowerCase('tr'));
            if (!exists) {
              setSchool(schools[0].name);
            }
          }
        }
      } catch (err) {
        console.warn('Schools load error:', err);
        if (isMounted) {
          const fallback = getSchoolsByDistrict(city, district);
          setSchoolsList(fallback);
        }
      } finally {
        if (isMounted) setLoadingSchools(false);
      }
    }
    loadSchools();
    return () => {
      isMounted = false;
    };
  }, [city, district]);

  // Handle City Change
  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setIsCustomSchool(false);
    setCustomSchoolName('');
    setSchoolSearchQuery('');
  };

  // Handle District Change
  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    setIsCustomSchool(false);
    setCustomSchoolName('');
    setSchoolSearchQuery('');
  };

  // Filtered schools according to search query
  const filteredSchools = schoolsList.filter((s) =>
    s.name.toLocaleLowerCase('tr').includes(schoolSearchQuery.trim().toLocaleLowerCase('tr'))
  );

  // Add Class tag
  const handleAddClass = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newClassInput.trim().toUpperCase();
    if (!trimmed) return;
    if (!assignedClasses.includes(trimmed)) {
      setAssignedClasses([...assignedClasses, trimmed]);
    }
    setNewClassInput('');
  };

  // Remove Class tag
  const handleRemoveClass = (cls: string) => {
    if (assignedClasses.length <= 1) {
      setErrorMsg('En az bir sınıf/şube seçili olmalıdır.');
      return;
    }
    setAssignedClasses(assignedClasses.filter((c) => c !== cls));
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSavedSuccess(false);

    if (!name.trim()) {
      setErrorMsg('Lütfen ad ve soyadınızı giriniz.');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('Lütfen iletişim telefon numaranızı giriniz.');
      return;
    }

    const finalSchoolName = isCustomSchool && customSchoolName.trim()
      ? customSchoolName.trim()
      : school;

    if (!finalSchoolName.trim()) {
      setErrorMsg('Lütfen okulunuzu seçiniz veya adını yazınız.');
      return;
    }

    setIsSubmitting(true);
    playSound('success');

    if (currentUser && currentUser.role === 'teacher') {
      updateTeacherProfile(currentUser.id, {
        name: name.trim(),
        phone: phone.trim(),
        branch,
        city,
        district,
        school: finalSchoolName,
        principalName: principalName.trim(),
        assignedClasses,
        isProfileComplete: true
      });
    }

    setSavedSuccess(true);
    setIsSubmitting(false);

    // Redirect to home page after 1.2s as requested
    setTimeout(() => {
      router.push('/');
    }, 1200);
  };

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mx-auto">
          ⚠️
        </div>
        <h2 className="text-xl font-black text-slate-900">Oturum Açmanız Gerekiyor</h2>
        <p className="text-xs text-slate-500">
          Profil bilgilerinizi düzenlemek için lütfen öncelikle sisteme giriş yapınız.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-2xs"
            title="Ana Sayfaya Dön"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Kişisel Profil & Okul Bilgileri</span>
              <Sparkles className="w-5 h-5 text-teal-500" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              MEB Maarif Modeli kurum ve öğretmen bilgilerinizi buradan güncelleyebilirsiniz.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-black flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>{currentUser.role === 'admin' ? 'Yönetici' : currentUser.role === 'teacher' ? 'Öğretmen' : 'Öğrenci'}</span>
          </span>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 flex items-center justify-between gap-3 shadow-md animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-sm">Profil Bilgileriniz Başarıyla Kaydedildi!</div>
              <div className="text-xs text-emerald-800">
                Ana sayfaya ve ders paneline yönlendiriliyorsunuz...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="text-xs font-bold">{errorMsg}</span>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <UserAvatar
            avatar={currentUser.avatar}
            name={currentUser.name}
            size="xl"
            className="w-20 h-20 border-2 border-teal-400 bg-teal-500/20 shadow-inner shrink-0"
          />
          <div className="space-y-1 text-center sm:text-left flex-1">
            <h2 className="text-xl sm:text-2xl font-black">{name || currentUser.name}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-teal-200 font-medium flex-wrap">
              <span className="flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-teal-400" />
                <span>{school || 'Okul Belirtilmedi'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{city} / {district}</span>
              </span>
            </div>
            <div className="pt-2 text-[11px] text-slate-300">
              🔒 Google Hesabı ile oturum açıldı. E-posta adresi güvenli şekilde doğrulanmıştır.
            </div>
          </div>
        </div>

        {/* Inputs Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Adı Soyadı */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Adı ve Soyadı</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Mimar Sinan"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
              />
            </div>

            {/* Google Mail Adresi (Disabled / Read Only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Google E-Posta Adresi</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Değiştirilemez</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  readOnly
                  value={email}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-500 cursor-not-allowed select-none"
                />
                <div className="absolute right-3.5 top-3.5 flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>OAuth Doğrulandı</span>
                </div>
              </div>
            </div>

            {/* Telefon Numarası */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>İletişim Telefon No</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Örn: 0555 123 45 67"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
              />
            </div>

            {/* Branş */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>Öğretmenlik Branşı</span>
                <span className="text-rose-500">*</span>
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 bg-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all cursor-pointer"
              >
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Location & School Selection (Provinces -> Districts -> Schools) */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>Görev Yaptığınız Okul ve Konum Bilgileri</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                MEB / ÖğretmenEvrak Okul Veritabanı
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* İl Seçimi (81 İl) */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">
                  İl (Şehir) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 bg-white outline-none focus:border-teal-500 transition-all cursor-pointer"
                >
                  {allProvinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* İlçe Seçimi (Live) */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
                  <span>İlçe <span className="text-rose-500">*</span></span>
                  {loadingDistricts && <Loader2 className="w-3 h-3 text-teal-600 animate-spin" />}
                </label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={loadingDistricts}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 bg-white outline-none focus:border-teal-500 transition-all cursor-pointer disabled:bg-slate-100"
                >
                  {districtsList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Okul Dropdown / Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span>Okul Adı <span className="text-rose-500">*</span></span>
                    {loadingSchools && <Loader2 className="w-3 h-3 text-teal-600 animate-spin" />}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCustomSchool(!isCustomSchool)}
                    className="text-[10px] font-bold text-teal-600 hover:underline cursor-pointer"
                  >
                    {isCustomSchool ? 'Listeden Seç' : '+ Farklı Okul Yaz'}
                  </button>
                </label>

                {!isCustomSchool ? (
                  <div className="space-y-2">
                    {/* Filter search if schools count is high */}
                    {schoolsList.length > 5 && (
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder={`${schoolsList.length} okul arasında ara...`}
                          value={schoolSearchQuery}
                          onChange={(e) => setSchoolSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-800 outline-none focus:border-teal-500 bg-slate-50"
                        />
                      </div>
                    )}

                    <select
                      value={school}
                      onChange={(e) => {
                        if (e.target.value === 'CUSTOM_NEW') {
                          setIsCustomSchool(true);
                        } else {
                          setSchool(e.target.value);
                        }
                      }}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 bg-white outline-none focus:border-teal-500 transition-all cursor-pointer"
                    >
                      {filteredSchools.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.type})
                        </option>
                      ))}
                      <option value="CUSTOM_NEW">➕ Listede Yoksa Yeni Okul Ekle...</option>
                    </select>
                  </div>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Okulunuzun tam adını yazınız..."
                    value={customSchoolName}
                    onChange={(e) => setCustomSchoolName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-teal-500 text-xs font-bold text-slate-900 outline-none"
                  />
                )}
              </div>

            </div>

            {/* Okul Müdürü Adı ve Soyadı (Günlük Ders Planı PDF İmzası İçin) */}
            <div className="pt-2 space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>Okul Müdürü Adı ve Soyadı</span>
                  <span className="text-teal-600 font-normal text-[11px]">(Resmi Günlük Plan PDF Onayı İçin)</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Ders Planı İmzası
                </span>
              </label>
              <input
                type="text"
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                placeholder="Örn: Mehmet GÜNGÖR"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
              />
              <p className="text-[11px] text-slate-400">
                📄 İndireceğiniz MEB Maarif Modeli Günlük Ders Planı PDF çıktılarının sol/sağ alt imza bölümünde &quot;Okul Müdürü&quot; unvanıyla yer alır.
              </p>
            </div>
          </div>

          {/* Sınıflarım & Şubelerim */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-slate-900">Girdiğiniz Sınıflar & Şubeler</h3>
                <p className="text-xs text-slate-500">
                  Ders vereceğiniz şubeleri belirleyin (Örn: 5-A, 5-B, 6-C).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Yeni Şube (Örn: 5-C)"
                  value={newClassInput}
                  onChange={(e) => setNewClassInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddClass();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 uppercase w-36"
                />
                <button
                  type="button"
                  onClick={handleAddClass}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ekle</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {assignedClasses.map((cls) => (
                <span
                  key={cls}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 font-extrabold text-xs flex items-center gap-2 shadow-2xs group"
                >
                  <span>📚 {cls}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveClass(cls)}
                    className="w-4 h-4 rounded-full bg-slate-200 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors text-[10px]"
                    title="Şubeyi Kaldır"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center transition-colors"
            >
              Vazgeç / Ana Sayfa
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Kaydediliyor...' : 'Bilgileri Kaydet ve Ana Sayfaya Dön'}</span>
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
