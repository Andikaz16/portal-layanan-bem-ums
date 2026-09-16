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
  1: 'bg-emerald-50 text-emerald-800 border-emerald-700',
  2: 'bg-panel-800 text-white border-panel-600',
  3: 'bg-sky-900/50 text-sky-300 border-sky-700',
  4: 'bg-amber-950 text-amber-300 border-amber-700',
  5: 'bg-blue-50 text-blue-800 border-blue-700',
  6: 'bg-panel-800 text-sky-200 border-panel-600',
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
  const categoryStyle = CATEGORY_STYLES[categoryId] || 'bg-panel-800 text-white border-panel-600';

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
      <div className="p-4 bg-navy-800 border border-panel-600 rounded-2xl flex items-start gap-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-white shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-sky-200">
          <p className="font-bold text-white mb-0.5">Tinjau Laporan Anda</p>
          <p className="text-sky-300 leading-relaxed">
            Harap periksa kembali seluruh detail informasi di bawah ini sebelum mengirimkan laporan Anda.
          </p>
        </div>
      </div>

      {/* Section 1: Identitas Pelapor */}
      <div className="bg-navy-800/70 border border-panel-600 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-panel-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-panel-800 text-white flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Identitas Pelapor</h3>
              <p className="text-xs text-sky-300">Data verifikasi pelapor</p>
            </div>
          </div>

          {isAnonymous && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-900/40 border border-amber-300 text-amber-900 rounded-full text-xs font-bold shadow-sm animate-fade-in">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>🔒 Mode Anonim</span>
            </div>
          )}
        </div>

        {/* Anonymous Warning Box */}
        {isAnonymous && (
          <div className="mb-5 p-3.5 bg-amber-950 border border-amber-700 rounded-xl text-xs text-amber-900 flex items-start gap-2.5 leading-relaxed">
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
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
                  !isLast ? 'border-b border-panel-800' : ''
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-[160px]">
                  <div className="w-7 h-7 rounded-lg bg-navy-800 border border-panel-600 text-sky-300 flex items-center justify-center shrink-0">
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-sky-300">{field.label}</span>
                </div>
                <div className="flex items-center gap-2 pl-9 sm:pl-0">
                  <span className="text-sm font-bold text-white break-all sm:text-right">
                    {displayVal}
                  </span>
                  {isAnonymous && (field.key === 'student_name' || field.key === 'student_nim') && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-900/40 text-amber-300 border border-amber-700 rounded-md shrink-0">
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
      <div className="bg-navy-800/70 border border-panel-600 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-panel-800">
          <div className="w-9 h-9 rounded-xl bg-panel-800 text-white flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Detail Laporan</h3>
            <p className="text-xs text-sky-300">Ringkasan isi pengaduan</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Category */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 border-b border-panel-800 gap-1 sm:gap-4">
            <div className="flex items-center gap-2.5 min-w-[160px]">
              <div className="w-7 h-7 rounded-lg bg-navy-800 border border-panel-600 text-sky-300 flex items-center justify-center shrink-0">
                <Tag className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-sky-300">Kategori</span>
            </div>
            <div className="pl-9 sm:pl-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${categoryStyle}`}>
                {categoryName}
              </span>
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between py-2.5 border-b border-panel-800 gap-1 sm:gap-4">
            <div className="flex items-center gap-2.5 min-w-[160px]">
              <div className="w-7 h-7 rounded-lg bg-navy-800 border border-panel-600 text-sky-300 flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-sky-300">Judul Laporan</span>
            </div>
            <div className="pl-9 sm:pl-0 sm:text-right flex-1">
              <span className="text-sm font-bold text-white break-words">
                {formData.subject || '-'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="py-2.5 border-b border-panel-800">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-navy-800 border border-panel-600 text-sky-300 flex items-center justify-center shrink-0">
                <AlignLeft className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-sky-300">Deskripsi Laporan</span>
            </div>
            <div className="mt-2 p-4 bg-navy-800 border-l-4 border-neon-500 rounded-r-2xl border border-panel-600 text-sky-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {formData.description ? (
                formData.description
              ) : (
                <span className="italic text-sky-400">Tidak ada deskripsi.</span>
              )}
            </div>
          </div>

          {/* Attachments */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-navy-800 border border-panel-600 text-sky-300 flex items-center justify-center shrink-0">
                  <Paperclip className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-sky-300">Lampiran</span>
              </div>
              <span className="text-xs font-bold text-white bg-panel-800 border border-panel-600 px-2.5 py-0.5 rounded-full">
                {attachments && attachments.length > 0 ? `${attachments.length} File` : '0 File'}
              </span>
            </div>

            {attachments && attachments.length > 0 ? (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-navy-800 border border-panel-600 rounded-2xl text-xs hover:border-panel-400 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-7 h-7 rounded-lg bg-panel-800 text-white flex items-center justify-center shrink-0">
                        <Paperclip className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate font-semibold text-white">
                        {file.name || `Lampiran ${idx + 1}`}
                      </span>
                    </div>
                    <span className="text-sky-400 shrink-0 text-[11px] font-mono">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 p-3 bg-navy-800 border border-dashed border-panel-600 rounded-2xl text-center">
                <span className="text-xs text-sky-400 italic">Tidak ada berkas/lampiran yang diunggah</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="flex items-start gap-3 p-4 bg-navy-800 border border-panel-600 rounded-2xl text-xs text-sky-200 leading-relaxed shadow-sm">
        <Info className="w-4 h-4 text-white shrink-0 mt-0.5" />
        <p>
          Dengan mengirim laporan ini, Anda menyetujui bahwa informasi yang diberikan adalah benar. Laporan palsu dapat dikenakan sanksi sesuai ketentuan yang berlaku.
        </p>
      </div>
    </div>
  );
};

export default StepKonfirmasi;
