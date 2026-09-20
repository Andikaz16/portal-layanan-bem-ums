import React from 'react';
import {
  User,
  CreditCard,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Tag,
  FileText,
  AlignLeft,
  Paperclip,
  Lock,
  Info,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const CATEGORY_MAP = {
  1: 'UKT',
  2: 'Fasilitas Kampus',
  3: 'Akademik',
  4: 'Kemahasiswaan',
  5: 'Birokrasi',
  6: 'Lainnya',
};

const CATEGORY_STYLES = {
  1: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  2: 'bg-blue-50 text-[#0066FF] border-blue-200',
  3: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  4: 'bg-amber-50 text-amber-700 border-amber-200',
  5: 'bg-sky-50 text-sky-700 border-sky-200',
  6: 'bg-slate-100 text-slate-700 border-slate-200',
};

/**
 * Format bytes into human readable string (KB, MB)
 */
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const StepKonfirmasi = ({ formData = {}, attachments = [] }) => {
  const isAnonymous = Boolean(formData.is_anonymous);
  const categoryId = formData.category_id;
  const categoryName = CATEGORY_MAP[categoryId] || (typeof categoryId === 'string' ? categoryId : 'Lainnya');
  const categoryStyle = CATEGORY_STYLES[categoryId] || 'bg-slate-100 text-slate-700 border-slate-200';

  const identityFields = [
    {
      key: 'student_name',
      label: 'Nama Lengkap',
      value: formData.student_name,
      icon: User,
    },
    {
      key: 'student_nim',
      label: 'NIM',
      value: formData.student_nim,
      icon: CreditCard,
    },
    {
      key: 'student_email',
      label: 'Email Student',
      value: formData.student_email,
      icon: Mail,
    },
    {
      key: 'student_phone',
      label: 'Nomor WhatsApp / HP',
      value: formData.student_phone,
      icon: Phone,
    },
    {
      key: 'student_faculty',
      label: 'Fakultas',
      value: formData.student_faculty,
      icon: Building,
    },
    {
      key: 'student_program',
      label: 'Program Studi',
      value: formData.student_program,
      icon: GraduationCap,
    },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-[#0066FF] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-600">
          <p className="font-bold text-slate-900 mb-0.5">Tinjau Laporan Anda</p>
          <p className="text-slate-600 leading-relaxed">
            Harap periksa kembali seluruh detail informasi di bawah ini sebelum mengirimkan laporan Anda.
          </p>
        </div>
      </div>

      {/* Section 1: Identitas Pelapor */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Identitas Pelapor</h3>
              <p className="text-xs text-slate-500">Data verifikasi pelapor</p>
            </div>
          </div>

          {isAnonymous && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-bold shadow-sm animate-fade-in">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Mode Anonim</span>
            </div>
          )}
        </div>

        {/* Anonymous Warning Box */}
        {isAnonymous && (
          <div className="mb-5 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5 leading-relaxed">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Identitas Anda Terlindungi</span>
              Data pribadi Anda tetap dicatat untuk keperluan konfirmasi internal BEM, namun <strong>identitas Anda akan disembunyikan secara publik</strong> dari pihak terlapor.
            </div>
          </div>
        )}

        {/* Identity Rows */}
        <div className="space-y-1">
          {identityFields.map((field, idx) => {
            const IconComponent = field.icon;
            const isLast = idx === identityFields.length - 1;
            const displayVal = field.value && String(field.value).trim() !== '' ? field.value : '-';

            return (
              <div
                key={field.key}
                className={`flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-1 sm:gap-4 ${
                  !isLast ? 'border-b border-slate-100' : ''
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-[160px]">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-[#0066FF] flex items-center justify-center shrink-0">
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{field.label}</span>
                </div>
                <div className="flex items-center gap-2 pl-9 sm:pl-0">
                  <span className="text-sm font-bold text-slate-800 break-all sm:text-right">
                    {displayVal}
                  </span>
                  {isAnonymous && (field.key === 'student_name' || field.key === 'student_nim') && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md shrink-0">
                      Disembunyikan
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Detail Laporan */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Detail Laporan</h3>
            <p className="text-xs text-slate-500">Ringkasan isi pengaduan</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Category */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 border-b border-slate-100 gap-1 sm:gap-4">
            <div className="flex items-center gap-2.5 min-w-[160px]">
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-[#0066FF] flex items-center justify-center shrink-0">
                <Tag className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-500">Kategori</span>
            </div>
            <div className="pl-9 sm:pl-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${categoryStyle}`}>
                {categoryName}
              </span>
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between py-2.5 border-b border-slate-100 gap-1 sm:gap-4">
            <div className="flex items-center gap-2.5 min-w-[160px]">
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-[#0066FF] flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-500">Judul Laporan</span>
            </div>
            <div className="pl-9 sm:pl-0 sm:text-right flex-1">
              <span className="text-sm font-bold text-slate-800 break-words">
                {formData.subject || '-'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="py-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-[#0066FF] flex items-center justify-center shrink-0">
                <AlignLeft className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-500">Deskripsi Laporan</span>
            </div>
            <div className="mt-2 p-4 bg-slate-50 border-l-4 border-[#0066FF] rounded-r-2xl border border-slate-200 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {formData.description ? (
                formData.description
              ) : (
                <span className="italic text-slate-400">Tidak ada deskripsi.</span>
              )}
            </div>
          </div>

          {/* Attachments */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-[#0066FF] flex items-center justify-center shrink-0">
                  <Paperclip className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-500">Lampiran</span>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                {attachments && attachments.length > 0 ? `${attachments.length} File` : '0 File'}
              </span>
            </div>

            {attachments && attachments.length > 0 ? (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl text-xs hover:border-blue-200 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
                        <Paperclip className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate font-semibold text-slate-800">
                        {file.name || `Lampiran ${idx + 1}`}
                      </span>
                    </div>
                    <span className="text-slate-400 shrink-0 text-[11px] font-mono">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 p-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
                <span className="text-xs text-slate-400 italic">Tidak ada berkas/lampiran yang diunggah</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 leading-relaxed shadow-sm">
        <Info className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
        <p>
          Dengan mengirim laporan ini, Anda menyetujui bahwa informasi yang diberikan adalah benar. Laporan palsu dapat dikenakan sanksi sesuai ketentuan yang berlaku.
        </p>
      </div>
    </div>
  );
};

export default StepKonfirmasi;
