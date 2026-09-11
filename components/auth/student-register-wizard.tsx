'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  getAllProvinces,
  getDistrictsByProvince,
  getSchoolsByDistrict,
  fetchDistrictsApi,
  fetchSchoolsApi
} from '@/lib/turkey-locations';
import {
  GraduationCap,
  User,
  Hash,
  School,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentRegisterWizardProps {
  onComplete: () => void;
  onSwitchToLogin: () => void;
}

export function StudentRegisterWizard({ onComplete, onSwitchToLogin }: StudentRegisterWizardProps) {
  const router = useRouter();
  const { registerStudent } = useAuth();
  const { setRole } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentNumber: '',
    gradeLevel: 5,
    classSection: 'A',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    customSchool: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  // Location states
  const [provinces] = useState<string[]>(getAllProvinces());
  const [districts, setDistricts] = useState<string[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string; type: string }[]>([]);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [isSearchingSchool, setIsSearchingSchool] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);

  // Fetch districts when city changes
  useEffect(() => {
    let isCancelled = false;
    const loadDistricts = async () => {
      setLoadingDistricts(true);
      try {
        const list = await fetchDistrictsApi(formData.city);
        if (!isCancelled) {
          setDistricts(list.length > 0 ? list : getDistrictsByProvince(formData.city));
          const firstDist = list.length > 0 ? list[0] : 'Merkez';
          setFormData((prev) => ({
            ...prev,
            district: prev.district && list.includes(prev.district) ? prev.district : firstDist
          }));
        }
      } catch {
        if (!isCancelled) {
          const fallback = getDistrictsByProvince(formData.city);
          setDistricts(fallback);
          setFormData((prev) => ({ ...prev, district: fallback[0] || 'Merkez' }));
        }
      } finally {
        if (!isCancelled) setLoadingDistricts(false);
      }
    };
    loadDistricts();
    return () => {
      isCancelled = true;
    };
  }, [formData.city]);

  // Fetch schools when district changes
  useEffect(() => {
    let isCancelled = false;
    const loadSchools = async () => {
      if (!formData.district) return;
      setLoadingSchools(true);
      try {
        const list = await fetchSchoolsApi(formData.city, formData.district);
        if (!isCancelled) {
          const finalSchools = list.length > 0 ? list : getSchoolsByDistrict(formData.city, formData.district);
          setSchools(finalSchools);
          if (finalSchools.length > 0 && !formData.customSchool) {
            setFormData((prev) => ({
              ...prev,
              school: finalSchools.some((s) => s.name === prev.school) ? prev.school : finalSchools[0].name
            }));
          }
        }
      } catch {
        if (!isCancelled) {
          const fallback = getSchoolsByDistrict(formData.city, formData.district);
          setSchools(fallback);
        }
      } finally {
        if (!isCancelled) setLoadingSchools(false);
      }
    };
    loadSchools();
    return () => {
      isCancelled = true;
    };
  }, [formData.city, formData.district]);

  const filteredSchools = schools.filter((s) =>
    s.name.toLocaleLowerCase('tr').includes(schoolSearch.toLocaleLowerCase('tr'))
  );

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.firstName.trim()) {
      setErrorMessage('Lütfen adınızı giriniz.');
      return;
    }
    if (!formData.lastName.trim()) {
      setErrorMessage('Lütfen soyadınızı giriniz.');
      return;
    }
    if (!formData.studentNumber.trim()) {
      setErrorMessage('Lütfen okul numaranızı giriniz.');
      return;
    }

    const selectedSchool = formData.customSchool.trim() || formData.school;
    if (!selectedSchool.trim()) {
      setErrorMessage('Lütfen okulunuzu seçiniz veya belirtiniz.');
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password && formData.password.length < 4) {
      setErrorMessage('Şifreniz en az 4 karakter olmalıdır.');
      return;
    }

    if (formData.password && formData.password !== formData.passwordConfirm) {
      setErrorMessage('Girdiğiniz şifreler birbiriyle eşleşmiyor.');
      return;
    }

    setLoading(true);

    try {
      const fullSection = `${formData.gradeLevel}-${formData.classSection.toUpperCase()}`;
      const finalSchool = formData.customSchool.trim() || formData.school;

      registerStudent({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        studentNumber: formData.studentNumber.trim(),
        gradeLevel: formData.gradeLevel,
        classSection: fullSection,
        city: formData.city,
        district: formData.district,
        school: finalSchool,
        email: formData.email.trim() || undefined,
        password: formData.password || '123456'
      });

      setRole('student');

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setTimeout(() => {
        onComplete();
        router.push('/student');
      }, 600);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Kayıt sırasında bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
          <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
          <span>Öğrenci Kayıt Formu</span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Maarif Öğrenci Hesabı Oluştur
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Okul numaranız ve sınıf bilgilerinizle sisteme anında katılın.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              step === 1 ? 'w-10 bg-amber-500' : 'w-4 bg-emerald-500'
            }`}
          />
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              step === 2 ? 'w-10 bg-amber-500' : 'w-4 bg-slate-200'
            }`}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-800 text-xs font-bold animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleStep1Next} className="space-y-4">
          {/* Ad & Soyad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Adınız <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Örn: Hasan"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Soyadınız <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Çırak"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Okul No & Sınıf/Şube */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Okul No <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Örn: 142"
                  value={formData.studentNumber}
                  onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sınıf <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.gradeLevel}
                onChange={(e) => setFormData({ ...formData, gradeLevel: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              >
                <option value={5}>5. Sınıf</option>
                <option value={6}>6. Sınıf</option>
                <option value={7}>7. Sınıf</option>
                <option value={8}>8. Sınıf</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Şube <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.classSection}
                onChange={(e) => setFormData({ ...formData, classSection: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              >
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((sec) => (
                  <option key={sec} value={sec}>
                    {sec} Şubesi ({formData.gradeLevel}-{sec})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* İl & İlçe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                İl <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              >
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                İlçe <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.district}
                disabled={loadingDistricts}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all disabled:opacity-50"
              >
                {districts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Okul Seçimi */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Okulunuz <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsSearchingSchool(!isSearchingSchool)}
                className="text-[11px] text-amber-700 hover:text-amber-800 font-bold"
              >
                {isSearchingSchool ? 'Listeden Seç' : '🔍 Okul Ara / Manuel Yaz'}
              </button>
            </div>

            {!isSearchingSchool ? (
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.school}
                  disabled={loadingSchools}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value, customSchool: '' })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all disabled:opacity-50 truncate"
                >
                  {schools.map((sch) => (
                    <option key={sch.id} value={sch.name}>
                      {sch.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Okul adını yazınız..."
                    value={formData.customSchool || schoolSearch}
                    onChange={(e) => {
                      setSchoolSearch(e.target.value);
                      setFormData({ ...formData, customSchool: e.target.value });
                    }}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
                {filteredSchools.length > 0 && (
                  <div className="max-h-28 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50">
                    {filteredSchools.slice(0, 5).map((sch) => (
                      <button
                        key={sch.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, school: sch.name, customSchool: sch.name });
                          setSchoolSearch(sch.name);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-amber-100 transition-colors truncate"
                      >
                        {sch.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-xs text-slate-600 hover:text-slate-900 font-bold"
            >
              Zaten hesabınız var mı? Giriş Yapın
            </button>

            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md shadow-amber-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Devam Et</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleFinalSubmit} className="space-y-4">
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>🎓 {formData.firstName} {formData.lastName}</span>
              <span className="text-[10px] px-2 py-0.5 bg-amber-200 rounded-full font-black">
                {formData.gradeLevel}-{formData.classSection} • No: {formData.studentNumber}
              </span>
            </div>
            <div className="text-[11px] text-amber-800 truncate">
              {formData.customSchool || formData.school} ({formData.district} / {formData.city})
            </div>
          </div>

          {/* İsteğe Bağlı E-Posta */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              E-Posta Adresi <span className="text-slate-400 font-normal">(İsteğe bağlı)</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="ornek@ogrenci.meb.k12.tr veya gmail"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Boş bırakırsanız okul numaranızla otomatik tanımlanacaktır.
            </p>
          </div>

          {/* Şifre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Giriş Şifresi <span className="text-slate-400 font-normal">(Varsayılan: 123456)</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="En az 4 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Şifre Tekrar
              </label>
              <input
                type="password"
                placeholder="Şifreyi tekrar yazınız"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Geri</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md shadow-amber-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Öğrenci Kaydını Tamamla</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
