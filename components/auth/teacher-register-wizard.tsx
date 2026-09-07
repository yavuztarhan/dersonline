'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';
import {
  getAllProvinces,
  getDistrictsByProvince,
  getSchoolsByDistrict
} from '@/lib/turkey-locations';
import {
  CheckCircle2,
  Mail,
  Building2,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Copy,
  RefreshCw,
  School
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TeacherRegisterWizardProps {
  onComplete: () => void;
  onSwitchToLogin: () => void;
}

export function TeacherRegisterWizard({ onComplete, onSwitchToLogin }: TeacherRegisterWizardProps) {
  const {
    startTeacherRegistration,
    verifyTeacherEmail,
    resendVerificationCode,
    activeVerificationCode
  } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    city: 'Edirne',
    district: 'Merkez',
    school: 'Edirne Selimiye İmam Hatip Ortaokulu',
    customSchool: '',
    branch: 'Matematik'
  });

  const [codeDigits, setCodeDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [simulatedCodeReceived, setSimulatedCodeReceived] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Available districts and schools based on selection
  const allProvinces = getAllProvinces();
  const availableDistricts = getDistrictsByProvince(formData.city);
  const availableSchools = getSchoolsByDistrict(formData.city, formData.district);

  // When city changes, update district and school
  const handleCityChange = (newCity: string) => {
    const districts = getDistrictsByProvince(newCity);
    const firstDistrict = districts[0] || '';
    const schools = getSchoolsByDistrict(newCity, firstDistrict);
    const firstSchool = schools[0]?.name || 'Diğer / Özel Okul';

    setFormData({
      ...formData,
      city: newCity,
      district: firstDistrict,
      school: firstSchool,
      customSchool: ''
    });
  };

  // When district changes, update school
  const handleDistrictChange = (newDistrict: string) => {
    const schools = getSchoolsByDistrict(formData.city, newDistrict);
    const firstSchool = schools[0]?.name || 'Diğer / Özel Okul';

    setFormData({
      ...formData,
      district: newDistrict,
      school: firstSchool,
      customSchool: ''
    });
  };

  // Step 1 Submit -> Send Verification Code
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Lütfen adınızı ve soyadınızı giriniz.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      setErrorMessage('Girdiğiniz şifreler birbiriyle eşleşmiyor.');
      return;
    }

    const res = startTeacherRegistration({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      city: formData.city,
      district: formData.district,
      school: formData.school === 'custom' ? formData.customSchool : formData.school,
      branch: formData.branch
    });

    if (res.success) {
      setSimulatedCodeReceived(res.code);
      setStep(2);
    }
  };

  // Step 2 Digit Input Handle
  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...codeDigits];
    newDigits[index] = clean;
    setCodeDigits(newDigits);

    // Auto-focus next input
    if (clean && index < 5) {
      const nextInput = document.getElementById(`code-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      const prevInput = document.getElementById(`code-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Verify Code
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const fullCode = codeDigits.join('');

    if (fullCode.length !== 6) {
      setErrorMessage('Lütfen 6 haneli güvenlik kodunu eksiksiz giriniz.');
      return;
    }

    const ok = verifyTeacherEmail(formData.email, fullCode);
    if (ok) {
      setStep(3);
    } else {
      setErrorMessage('Girdiğiniz 6 haneli kod hatalı veya süresi dolmuş. Lütfen tekrar deneyiniz.');
    }
  };

  // Auto fill simulated code shortcut
  const handleAutoFillCode = () => {
    if (simulatedCodeReceived && simulatedCodeReceived.length === 6) {
      setCodeDigits(simulatedCodeReceived.split(''));
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Resend code
  const handleResend = () => {
    const newCode = resendVerificationCode(formData.email);
    if (newCode) {
      setSimulatedCodeReceived(newCode);
      setCodeDigits(['', '', '', '', '', '']);
      setErrorMessage('');
    }
  };

  // Step 3 Submit -> Finalize Registration with School info
  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const finalSchool = formData.school === 'custom' ? formData.customSchool.trim() : formData.school;
    if (!finalSchool) {
      setErrorMessage('Lütfen okul adınızı seçiniz veya yazınız.');
      return;
    }

    // Update teacher info with finalized school in store
    startTeacherRegistration({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      city: formData.city,
      district: formData.district,
      school: finalSchool,
      branch: formData.branch
    });

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    setStep(4);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Step Indicator Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-teal-800">
          <span>Öğretmen Kayıt Sihirbazı</span>
          <span>Adım {step} / 4</span>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-teal-600' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in shake">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: PERSONAL & ACCOUNT INFO */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-4 animate-in fade-in">
          <div>
            <h3 className="text-xl font-black text-slate-900">1. Adım: Hesap Bilgileri</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Maarif Akademi öğretmen hesabınızı oluşturmak için bilgilerinizi giriniz.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ad Soyad <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Örn: Ayşe Yılmaz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-xs sm:text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                E-Posta Adresi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="ayse.ogretmen@meb.k12.tr veya gmail"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-xs sm:text-sm outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Bu adrese 6 haneli güvenlik onay kodu gönderilecektir.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Şifre <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="En az 6 karakter"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-xs sm:text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Şifre Tekrar <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Şifreyi tekrar giriniz"
                    value={formData.passwordConfirm}
                    onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-xs sm:text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Telefon Numarası (İsteğe Bağlı)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-xs sm:text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Zaten hesabınız var mı? Giriş Yapın
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Devam Et: Onay Kodu Gönder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: 6-DIGIT EMAIL VERIFICATION CODE */}
      {step === 2 && (
        <form onSubmit={handleVerifyCode} className="space-y-5 animate-in fade-in">
          <div>
            <h3 className="text-xl font-black text-slate-900">2. Adım: E-Posta Doğrulama</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              <strong className="text-slate-800">{formData.email}</strong> adresinize gönderilen 6 haneli güvenlik kodunu giriniz.
            </p>
          </div>

          {/* SIMULATED INBOX NOTIFICATION BANNER */}
          {simulatedCodeReceived && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span>📩 Gelen Kutusu Simülatörü:</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  Canlı Mesaj
                </span>
              </div>
              <div className="text-xs text-amber-950 font-medium">
                "Sayın {formData.name}, Maarif Akademi öğretmen kaydı onay kodunuz: <strong className="text-sm font-black text-slate-900 tracking-wider bg-white px-2 py-0.5 rounded border border-amber-300">{simulatedCodeReceived}</strong>"
              </div>
              <button
                type="button"
                onClick={handleAutoFillCode}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 underline pt-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedCode ? 'Kopyalandı ve Dolduruldu! ✅' : 'Kodu Otomatik Doldur'}</span>
              </button>
            </div>
          )}

          {/* 6 Digit Inputs */}
          <div className="space-y-2">
            <label className="block text-center text-xs font-bold text-slate-700">
              6 Haneli Güvenlik Kodunu Giriniz:
            </label>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {codeDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`code-digit-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-black rounded-2xl border-2 border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-200 outline-none bg-slate-50 transition-all text-slate-900"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <span>Kodu almadınız mı?</span>
            <button
              type="button"
              onClick={handleResend}
              className="text-teal-700 font-extrabold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tekrar Gönder</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri Dön</span>
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Kodu Doğrula & Okul Seç</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: CITY, DISTRICT, SCHOOL DROPDOWNS */}
      {step === 3 && (
        <form onSubmit={handleStep3Submit} className="space-y-4 animate-in fade-in">
          <div>
            <h3 className="text-xl font-black text-slate-900">3. Adım: Okul & Görev Bilgileri</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Görev yaptığınız il, ilçe ve okulunuzu seçiniz (MEB veri tabanına uygun).
            </p>
          </div>

          <div className="space-y-3.5">
            {/* 1. İL SEÇİMİ (DROPDOWN) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                İl (Türkiye Cumhuriyeti) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-xs sm:text-sm font-bold text-slate-800 bg-white outline-none cursor-pointer"
              >
                {allProvinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. İLÇE SEÇİMİ (DROPDOWN) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                İlçe ({formData.city}) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-xs sm:text-sm font-bold text-slate-800 bg-white outline-none cursor-pointer"
              >
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. OKUL SEÇİMİ (DROPDOWN + CUSTOM ENTRY) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Okul Adı ({formData.city} / {formData.district}) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-xs sm:text-sm font-bold text-slate-800 bg-white outline-none cursor-pointer"
              >
                {availableSchools.map((sch) => (
                  <option key={sch.id} value={sch.name}>
                    {sch.name} ({sch.type})
                  </option>
                ))}
                <option value="custom">✏️ Listede Yoksa Manuel Yaz...</option>
              </select>
            </div>

            {/* Custom School Input if selected */}
            {formData.school === 'custom' && (
              <div className="animate-in fade-in">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Özel / Belirtilmeyen Okul Adını Yazınız:
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Örn: Edirne Selimiye Ortaokulu"
                    value={formData.customSchool}
                    onChange={(e) => setFormData({ ...formData, customSchool: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-teal-300 focus:border-teal-600 text-xs sm:text-sm outline-none"
                  />
                </div>
              </div>
            )}

            {/* Branş */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Branş / Alan
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-xs sm:text-sm font-bold text-slate-800 bg-white outline-none cursor-pointer"
              >
                <option value="Matematik">Matematik</option>
                <option value="Sınıf Öğretmenliği">Sınıf Öğretmenliği</option>
                <option value="Fen Bilimleri">Fen Bilimleri</option>
                <option value="Bilişim Teknolojileri">Bilişim Teknolojileri</option>
                <option value="Türkçe">Türkçe</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>

            <button
              type="submit"
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-xs shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kaydı Tamamla & Onaya Gönder</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: REGISTRATION COMPLETED & PENDING APPROVAL */}
      {step === 4 && (
        <div className="text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center text-4xl mx-auto shadow-inner">
            ⏳
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl font-black text-slate-900">
              Başvurunuz Başarıyla Alındı!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              E-posta adresiniz doğrulandı. Güvenlik gereği öğretmen hesabınız sistem yöneticisi (Admin) onayına iletilmiştir.
            </p>
          </div>

          {/* Teacher Info Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Öğretmen:</span>
              <span className="font-extrabold text-slate-900">{formData.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">E-Posta:</span>
              <span className="font-extrabold text-slate-900">{formData.email}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Görev Yeri:</span>
              <span className="font-extrabold text-teal-800">
                {formData.city} / {formData.district} - {formData.school === 'custom' ? formData.customSchool : formData.school}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500 font-medium">Durum:</span>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-[11px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Yönetici Onayı Bekleniyor</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onComplete}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Platforma Devam Et</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
