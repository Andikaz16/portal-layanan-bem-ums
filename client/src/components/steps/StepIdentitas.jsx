import React from 'react';
import {
  User,
  CreditCard,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Shield,
  ShieldCheck,
} from 'lucide-react';

const FACULTIES = [
  'Fakultas Agama Islam',
  'Fakultas Ekonomi dan Bisnis',
  'Fakultas Farmasi',
  'Fakultas Geografi',
  'Fakultas Hukum',
  'Fakultas Kedokteran',
  'Fakultas Kedokteran Gigi',
  'Fakultas Keguruan dan Ilmu Pendidikan',
  'Fakultas Ilmu Kesehatan',
  'Fakultas Komunikasi dan Informatika',
  'Fakultas Psikologi',
  'Fakultas Teknik',
];

const StepIdentitas = ({ formData = {}, errors = {}, updateField }) => {
  const isAnonymous = Boolean(formData.is_anonymous);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Anonymous Card */}
      <div
        className={`p-5 rounded-2xl border transition-all duration-300 ${
          isAnonymous
            ? 'bg-amber-50/80 border-amber-300 shadow-sm'
            : 'bg-cream-50/80 border-cream-300 hover:border-cream-400 shadow-sm'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div className="pt-0.5">
            <input
              type="checkbox"
              id="is_anonymous"
              checked={isAnonymous}
              onChange={(e) => updateField('is_anonymous', e.target.checked)}
              className="checkbox-custom"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="is_anonymous"
              className="flex items-center gap-2 text-sm font-bold text-forest-900 cursor-pointer select-none"
            >
              {isAnonymous ? (
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              ) : (
                <Shield className="w-5 h-5 text-charcoal-400" />
              )}
              <span>Laporkan secara anonim</span>
            </label>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1 leading-relaxed">
              Identitas Anda (Nama & NIM) akan disembunyikan dari tampilan publik, namun tetap tersimpan aman untuk keperluan validasi internal.
            </p>
          </div>
        </div>

        {/* Warning Alert Box when Anonymous mode is enabled */}
        {isAnonymous && (
          <div className="mt-4 p-3.5 bg-amber-100/80 border border-amber-200/90 rounded-xl text-amber-900 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in">
            <span className="text-base leading-none select-none">⚠️</span>
            <div className="flex-1 leading-snug">
              <strong>Mode Anonim Aktif</strong> — Identitas Anda hanya dapat diakses oleh pejabat BEM yang berwenang.
            </div>
          </div>
        )}
      </div>

      {/* Form Fields Grid */}
      <div className="space-y-5">
        {/* Row 1: Nama Lengkap + NIM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nama Lengkap */}
          <div>
            <label className="form-label" htmlFor="student_name">
              Nama Lengkap <span className="text-terracotta-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none">
                <User size={18} />
              </div>
              <input
                id="student_name"
                type="text"
                className={`form-input pl-10 ${errors.student_name ? 'form-input-error' : ''}`}
                placeholder="Masukkan nama lengkap"
                value={formData.student_name || ''}
                onChange={(e) => updateField('student_name', e.target.value)}
              />
            </div>
            {errors.student_name && <p className="form-error">{errors.student_name}</p>}
          </div>

          {/* NIM */}
          <div>
            <label className="form-label" htmlFor="student_nim">
              NIM <span className="text-terracotta-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none">
                <CreditCard size={18} />
              </div>
              <input
                id="student_nim"
                type="text"
                className={`form-input pl-10 ${errors.student_nim ? 'form-input-error' : ''}`}
                placeholder="Contoh: L200240229"
                value={formData.student_nim || ''}
                onChange={(e) => updateField('student_nim', e.target.value.toUpperCase())}
              />
            </div>
            {errors.student_nim && <p className="form-error">{errors.student_nim}</p>}
          </div>
        </div>

        {/* Row 2: Email Kampus + No. WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Email Kampus */}
          <div>
            <label className="form-label" htmlFor="student_email">
              Email Kampus <span className="text-terracotta-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none">
                <Mail size={18} />
              </div>
              <input
                id="student_email"
                type="email"
                className={`form-input pl-10 ${errors.student_email ? 'form-input-error' : ''}`}
                placeholder="contoh@student.ac.id"
                value={formData.student_email || ''}
                onChange={(e) => updateField('student_email', e.target.value)}
              />
            </div>
            {errors.student_email && <p className="form-error">{errors.student_email}</p>}
          </div>

          {/* No. WhatsApp */}
          <div>
            <label className="form-label" htmlFor="student_phone">
              No. WhatsApp <span className="text-terracotta-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none">
                <Phone size={18} />
              </div>
              <input
                id="student_phone"
                type="tel"
                className={`form-input pl-10 ${errors.student_phone ? 'form-input-error' : ''}`}
                placeholder="081234567890"
                value={formData.student_phone || ''}
                onChange={(e) => updateField('student_phone', e.target.value)}
              />
            </div>
            {errors.student_phone && <p className="form-error">{errors.student_phone}</p>}
          </div>
        </div>

        {/* Full-width Email Notice */}
        <div className="flex items-start gap-2.5 p-3.5 bg-terracotta-50/70 border border-terracotta-100 rounded-xl">
          <Mail size={16} className="text-terracotta-500 mt-0.5 shrink-0" />
          <p className="text-xs text-terracotta-800 leading-relaxed">
            <span className="font-bold">Penting:</span> Gunakan email aktif yang benar. Kode tiket laporan dan pemberitahuan tindak lanjut akan dikirimkan melalui email ini. 
            <span className="block mt-1 text-terracotta-700 italic">Harap cek folder <span className="font-semibold">Spam/Junk</span> jika email tidak masuk ke kotak masuk utama Anda.</span>
          </p>
        </div>

        {/* Row 3: Fakultas + Program Studi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Fakultas */}
          <div>
            <label className="form-label" htmlFor="student_faculty">
              Fakultas <span className="text-terracotta-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none">
                <Building size={18} />
              </div>
              <select
                id="student_faculty"
                className={`form-input pl-10 ${errors.student_faculty ? 'form-input-error' : ''}`}
                value={formData.student_faculty || ''}
                onChange={(e) => updateField('student_faculty', e.target.value)}
              >
                <option value="" className="bg-white text-charcoal-900">-- Pilih Fakultas --</option>
                {FACULTIES.map((faculty) => (
                  <option key={faculty} value={faculty} className="bg-white text-charcoal-900">
                    {faculty}
                  </option>
                ))}
              </select>
            </div>
            {errors.student_faculty && <p className="form-error">{errors.student_faculty}</p>}
          </div>

          {/* Program Studi */}
          <div>
            <label className="form-label" htmlFor="student_program">
              Program Studi <span className="text-terracotta-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none">
                <GraduationCap size={18} />
              </div>
              <input
                id="student_program"
                type="text"
                className={`form-input pl-10 ${errors.student_program ? 'form-input-error' : ''}`}
                placeholder="Contoh: Teknik Informatika"
                value={formData.student_program || ''}
                onChange={(e) => updateField('student_program', e.target.value)}
              />
            </div>
            {errors.student_program && <p className="form-error">{errors.student_program}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepIdentitas;
