'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, splitFullName, formatFullName } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  getAllProvinces,
  getDistrictsByProvince,
  getSchoolsByDistrict,
  fetchDistrictsApi,
  fetchSchoolsApi
} from '@/lib/turkey-locations';
import { validatePassword } from '@/lib/password-validator';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  User,
  Mail,
  Phone,
  School,
  MapPin,
  BookOpen,
  Lock,
  KeyRound,
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
  RefreshCw,
  Eye,
  EyeOff
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

export default function ProfilePage() {
  const { currentUser, updateUserProfile, setUserPassword } = useAuth();
  const { playSound } = useApp();
  const router = useRouter();

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
  
  // Dropdown Class Selector States
  const [selectedGrade, setSelectedGrade] = useState<'5' | '6' | '7' | '8'>('5');
  const [selectedSection, setSelectedSection] = useState<string>('A');

  // Password Setup States
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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
  const [hasLoadedInitialUser, setHasLoadedInitialUser] = useState(false);

  // Initialize form with currentUser data (for Admin, Teacher, Student)
  useEffect(() => {
    if (currentUser && !hasLoadedInitialUser) {
      const parts = splitFullName(currentUser.name || '');
      setFirstName(currentUser.firstName || parts.firstName || '');
      setLastName(currentUser.lastName || parts.lastName || '');
      setEmail(currentUser.email || '');

      const userObj = currentUser as any;
      const rawPhone = (userObj.phone || '').replace(/\D/g, '');
      const cleanInitialPhone = rawPhone.startsWith('90') ? rawPhone.slice(2) : rawPhone.startsWith('0') ? rawPhone.slice(1) : rawPhone;
      setPhone(cleanInitialPhone.slice(0, 10));
      setBranch(userObj.branch || 'Matematik');
      setPrincipalName(userObj.principalName || 'Mehmet GÜNGÖR');
      setCity(userObj.city || 'Edirne');
      setDistrict(userObj.district || 'Merkez');
      setSchool(userObj.school || 'Edirne Selimiye İmam Hatip Ortaokulu');
      if (userObj.assignedClasses && Array.isArray(userObj.assignedClasses) && userObj.assignedClasses.length > 0) {
        setAssignedClasses(userObj.assignedClasses);
      }
      setHasLoadedInitialUser(true);
    }
  }, [currentUser, hasLoadedInitialUser]);

  const handlePhoneChange = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    if (digits.startsWith('90') && digits.length > 10) {
      digits = digits.slice(2);
    }
    setPhone(digits.slice(0, 10));
  };

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
          // Only pick first school if school is currently empty
          if (schools.length > 0 && !isCustomSchool && !school) {
            setSchool(schools[0].name);
          }
        }
      } catch (err) {
        console.warn('Schools load error:', err);
        if (isMounted) {
          const fallback = getSchoolsByDistrict(city, district);
          setSchoolsList(fallback);
          if (fallback.length > 0 && !isCustomSchool && !school) {
            setSchool(fallback[0].name);
          }
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

  // Add Class tag via Dropdowns
  const handleAddClass = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const tag = `${selectedGrade}-${selectedSection}`;
    if (!assignedClasses.includes(tag)) {
      setAssignedClasses([...assignedClasses, tag]);
    }
  };

  // Remove Class tag
  const handleRemoveClass = (cls: string) => {
    if (assignedClasses.length <= 1) {
      setErrorMsg('En az bir sınıf/şube seçili olmalıdır.');
      return;
    }
    setAssignedClasses(assignedClasses.filter((c) => c !== cls));
  };

  // Handle Password Direct Update
  const handleUpdatePassword = () => {
    setPasswordMsg(null);
    if (!password) {
      setPasswordMsg({ text: 'Lütfen bir şifre giriniz.', type: 'error' });
      return;
    }
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setPasswordMsg({ text: validation.errorMessage || 'Şifre kurallara uymuyor.', type: 'error' });
      return;
    }
    if (password !== passwordConfirm) {
      setPasswordMsg({ text: 'Girdiğiniz şifreler eşleşmiyor.', type: 'error' });
      return;
    }

    if (currentUser) {
      const ok = setUserPassword(currentUser.id, password);
      if (ok) {
        playSound('success');
        setPasswordMsg({ text: 'Giriş şifreniz başarıyla kaydedildi! Artık e-posta ve şifrenizle giriş yapabilirsiniz.', type: 'success' });
        setPassword('');
        setPasswordConfirm('');
      }
    }
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSavedSuccess(false);

    if (!firstName.trim()) {
      setErrorMsg('Lütfen adınızı giriniz.');
      return;
    }

    if (!lastName.trim()) {
      setErrorMsg('Lütfen soyadınızı giriniz.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (currentUser?.role === 'teacher' && (!cleanPhone || cleanPhone.length !== 10)) {
      setErrorMsg('Lütfen 10 haneli geçerli bir cep telefonu numarası giriniz (Örn: 5051234567).');
      return;
    }

    if (password) {
      const validation = validatePassword(password);
      if (!validation.isValid) {
        setErrorMsg(validation.errorMessage || 'Şifre kurallara uymuyor.');
        return;
      }
      if (password !== passwordConfirm) {
        setErrorMsg('Girdiğiniz şifreler eşleşmiyor.');
        return;
      }
    }

    const finalSchoolName = isCustomSchool && customSchoolName.trim()
      ? customSchoolName.trim()
      : (school || '').trim();

    if (currentUser?.role === 'teacher' && !finalSchoolName) {
      setErrorMsg('Lütfen okulunuzu seçiniz veya adını yazınız.');
      return;
    }

    setIsSubmitting(true);
    playSound('success');

    if (currentUser) {
      const formatted = formatFullName(firstName, lastName, `${firstName.trim()} ${lastName.trim()}`);
      updateUserProfile(currentUser.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: formatted,
        phone: phone.trim(),
        branch,
        city,
        district,
        school: finalSchoolName,
        principalName: principalName.trim(),
        assignedClasses,
        isProfileComplete: true
      });

      if (password && validatePassword(password).isValid && password === passwordConfirm) {
        setUserPassword(currentUser.id, password);
      }
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

  const currentFullName = formatFullName(firstName, lastName, currentUser.name);

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
              Ad, soyad, şifre ve kurum bilgilerinizi buradan güncelleyebilirsiniz.
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

      {/* Mandatory Incomplete Profile Warning Banner */}
      {currentUser.role === 'teacher' && !(currentUser as any).isProfileComplete && (
        <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-md">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-black text-amber-900 text-sm">Zorunlu Profil Bilgilerini Tamamlayınız</div>
            <div className="text-amber-800 leading-relaxed font-medium">
              Maarif platformunun akıllı tahta derslerini, öğrenci kayıtlarını ve materyallerini kullanabilmek için lütfen ad, soyad, telefon ve okul bilgilerinizi eksiksiz doldurup aşağıdaki <strong>"Değişiklikleri Kaydet"</strong> butonuna basınız.
            </div>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <UserAvatar
            avatar={currentUser.avatar}
            name={currentFullName}
            size="xl"
            className="w-20 h-20 border-2 border-teal-400 bg-teal-500/20 shadow-inner shrink-0"
          />
          <div className="space-y-1 text-center sm:text-left flex-1">
            <h2 className="text-xl sm:text-2xl font-black">{currentFullName}</h2>
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
              🔒 Güvenli Kullanıcı Hesabı. E-posta adresi doğrulanmıştır.
            </div>
          </div>
        </div>

        {/* Inputs Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Ad & Soyad Grid (Ayrı Ayrı) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Ad */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Ad (İsim)</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Örn: Ahmet"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
              />
            </div>

            {/* Soyad */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Soyad</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Örn: Yılmaz"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* E-Posta Adresi (Disabled / Read Only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kayıtlı E-Posta Adresi</span>
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
                  <span>Doğrulandı</span>
                </div>
              </div>
            </div>

            {/* Telefon Numarası */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>İletişim Cep Telefonu</span>
                  <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400">10 Hane (5XX...)</span>
              </label>
              <div className="flex rounded-2xl border border-slate-200 overflow-hidden focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/10 transition-all bg-white">
                <span className="inline-flex items-center px-4 py-3 bg-slate-100 border-r border-slate-200 text-slate-700 font-black text-xs select-none">
                  🇹🇷 +90
                </span>
                <input
                  type="tel"
                  required={currentUser.role === 'teacher'}
                  maxLength={10}
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="5051234567"
                  className="w-full px-4 py-3 text-xs font-bold text-slate-900 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Branş */}
            <div className="space-y-1.5 md:col-span-2">
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

          {/* PASSWORD MANAGEMENT CARD (GOOGLE İLE GİRİŞ YAPANLAR İÇİN ŞİFRE BELİRLEME) */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/60 to-indigo-50/40 border-2 border-indigo-100 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  <span>Giriş Şifresi Belirleme / Güncelleme</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Google veya başka yöntemle girmiş olsanız bile buradan şifre belirleyerek sonraki girişlerinizde <strong>e-posta ve şifrenizle</strong> giriş yapabilirsiniz.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-black shrink-0">
                Şifreli Giriş
              </span>
            </div>

            {passwordMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {passwordMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Yeni Şifre</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="En az 6 karakter (Büyük, küçük harf ve rakam)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
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

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Yeni Şifre (Tekrar)</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Şifreyi tekrar yazınız"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Live Password Criteria Badges */}
            {password.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-bold select-none animate-in fade-in">
                {(() => {
                  const passVal = validatePassword(password);
                  return (
                    <>
                      <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${passVal.hasMinLength ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                        <span>{passVal.hasMinLength ? '✓' : '○'}</span>
                        <span>En az 6 karakter</span>
                      </div>
                      <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${passVal.hasUpperCase ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                        <span>{passVal.hasUpperCase ? '✓' : '○'}</span>
                        <span>1 Büyük Harf</span>
                      </div>
                      <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${passVal.hasLowerCase ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                        <span>{passVal.hasLowerCase ? '✓' : '○'}</span>
                        <span>1 Küçük Harf</span>
                      </div>
                      <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${passVal.hasNumber ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                        <span>{passVal.hasNumber ? '✓' : '○'}</span>
                        <span>1 Rakam (0-9)</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleUpdatePassword}
                disabled={!password || !passwordConfirm}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Sadece Şifreyi Kaydet</span>
              </button>
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
                    required={isCustomSchool}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">Girdiğiniz Sınıflar & Şubeler</h3>
                <p className="text-xs text-slate-500">
                  Ders vereceğiniz sınıf seviyesi ve şubeleri seçip ekleyiniz.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* 1. Menü: Sınıf Seviyesi (5, 6, 7, 8) */}
                <div className="flex items-center gap-1">
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 bg-white cursor-pointer shadow-2xs"
                  >
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}. Sınıf
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Menü: Şube Seçimi (A - Z) */}
                <div className="flex items-center gap-1">
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 bg-white cursor-pointer min-w-[85px] shadow-2xs"
                  >
                    {SECTION_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s} Şubesi
                      </option>
                    ))}
                  </select>
                </div>

                {/* + Şube Ekle Butonu */}
                <button
                  type="button"
                  onClick={handleAddClass}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Şube Ekle</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {assignedClasses.map((cls) => (
                <span
                  key={cls}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 font-extrabold text-xs flex items-center gap-2 shadow-2xs group hover:border-teal-300 transition-colors"
                >
                  <span>📚 {cls}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveClass(cls)}
                    className="w-4 h-4 rounded-full bg-slate-200 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors text-[10px] cursor-pointer"
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
              disabled={isSubmitting || savedSuccess}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-white font-black text-xs transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 ${
                savedSuccess ? 'bg-emerald-600 hover:bg-emerald-600' : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Başarıyla Kaydedildi! ✓</span>
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Bilgileri Kaydet ve Ana Sayfaya Dön</span>
                </>
              )}
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
