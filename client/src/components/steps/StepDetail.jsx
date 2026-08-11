import React, { useState, useRef } from 'react';
import {
  Banknote,
  Building2,
  GraduationCap,
  Users,
  FileStack,
  MoreHorizontal,
  Pencil,
  AlignLeft,
  Upload,
  X,
  FileImage,
  FileText,
  Paperclip,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: 'UKT', icon: 'Banknote', description: 'Uang Kuliah Tunggal, keringanan, pembayaran' },
  { id: 2, name: 'Fasilitas Kampus', icon: 'Building2', description: 'Gedung, lab, WiFi, sarana prasarana' },
  { id: 3, name: 'Akademik', icon: 'GraduationCap', description: 'Perkuliahan, dosen, kurikulum, nilai' },
  { id: 4, name: 'Kemahasiswaan', icon: 'Users', description: 'Organisasi, beasiswa, kegiatan' },
  { id: 5, name: 'Birokrasi', icon: 'FileStack', description: 'Pelayanan administrasi kampus' },
  { id: 6, name: 'Lainnya', icon: 'MoreHorizontal', description: 'Kategori lain' },
];

const CATEGORY_ICONS = {
  Banknote,
  Building2,
  GraduationCap,
  Users,
  FileStack,
  MoreHorizontal,
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];

export default function StepDetail({
  formData = {},
  errors = {},
  updateField,
  attachments = [],
  setAttachments,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Helper for formatting file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Helper to determine file icon
  const getFileIcon = (file) => {
    const type = file.type || '';
    const name = file.name || '';
    const ext = name.split('.').pop()?.toLowerCase() || '';

    if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
      return <FileImage className="w-5 h-5 text-indigo-600 flex-shrink-0" />;
    }
    if (type.includes('pdf') || ['pdf', 'doc', 'docx'].includes(ext)) {
      return <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />;
    }
    return <Paperclip className="w-5 h-5 text-indigo-600 flex-shrink-0" />;
  };

  // Validate and handle adding files
  const handleFilesAdded = (incomingFiles) => {
    setUploadError('');
    if (!incomingFiles || incomingFiles.length === 0) return;

    const currentFiles = Array.isArray(attachments) ? attachments : [];
    const newFilesArray = Array.from(incomingFiles);

    if (currentFiles.length + newFilesArray.length > MAX_FILES) {
      setUploadError(`Maksimal ${MAX_FILES} file lampiran yang dapat diunggah.`);
      return;
    }

    const validFiles = [];
    for (const file of newFilesArray) {
      // Check size limit (5MB)
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`File "${file.name}" melebihi batas ukuran maksimal 5MB.`);
        return;
      }

      // Check extension
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setUploadError(
          `Format file "${file.name}" tidak didukung. Harap unggah gambar (JPG, PNG), PDF, atau Word (DOC, DOCX).`
        );
        return;
      }

      // Check duplicate
      const isDuplicate = currentFiles.some(
        (f) => f.name === file.name && f.size === file.size
      );
      if (!isDuplicate) {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0 && typeof setAttachments === 'function') {
      setAttachments([...currentFiles, ...validFiles]);
    }
  };

  // Handle removing a file
  const handleRemoveFile = (indexToRemove) => {
    if (typeof setAttachments !== 'function') return;
    const currentFiles = Array.isArray(attachments) ? attachments : [];
    const updated = currentFiles.filter((_, idx) => idx !== indexToRemove);
    setAttachments(updated);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  // Counter styling helpers
  const subjectLength = formData.subject?.length || 0;
  const getSubjectCounterClass = () => {
    if (subjectLength >= 255) return 'text-red-500 font-semibold';
    if (subjectLength >= 230) return 'text-amber-600 font-medium';
    return 'text-surface-400';
  };

  const descLength = formData.description?.length || 0;
  const getDescCounterClass = () => {
    if (descLength < 50) return 'text-amber-600 font-medium';
    return 'text-emerald-600 font-medium';
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* 1. Kategori Laporan */}
      <div>
        <div className="mb-3">
          <label className="form-label flex items-center justify-between text-base">
            <span>
              Kategori Laporan <span className="text-red-500">*</span>
            </span>
          </label>
          <p className="text-xs text-surface-500">
            Pilih kategori yang paling sesuai dengan permasalahan yang Anda laporkan.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.icon] || Paperclip;
            const isSelected = Number(formData.category_id) === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => updateField('category_id', cat.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    updateField('category_id', cat.id);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`group relative p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-pointer flex flex-col justify-between select-none ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-md text-indigo-950'
                    : 'border-surface-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 text-surface-700 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-2.5 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-surface-100 text-surface-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 animate-fade-in flex-shrink-0" />
                  )}
                </div>

                <div>
                  <h4
                    className={`font-semibold text-sm mb-1 ${
                      isSelected ? 'text-indigo-950 font-bold' : 'text-surface-900'
                    }`}
                  >
                    {cat.name}
                  </h4>
                  <p
                    className={`text-xs leading-relaxed line-clamp-2 ${
                      isSelected ? 'text-indigo-800/90' : 'text-surface-500'
                    }`}
                  >
                    {cat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {errors.category_id && (
          <p className="form-error flex items-center gap-1 mt-2">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.category_id}
          </p>
        )}
      </div>

      {/* 2. Perihal / Judul Laporan */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="subject-input" className="form-label mb-0">
            Perihal / Judul Laporan <span className="text-red-500">*</span>
          </label>
          <span className={`text-xs transition-colors ${getSubjectCounterClass()}`}>
            {subjectLength} / 255
          </span>
        </div>

        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
            <Pencil className="w-4 h-4" />
          </div>
          <input
            id="subject-input"
            type="text"
            maxLength={255}
            value={formData.subject || ''}
            onChange={(e) => updateField('subject', e.target.value)}
            placeholder="Contoh: Permohonan Keringanan Pembayaran UKT Semester Genap"
            className={`form-input pl-10 ${errors.subject ? 'form-input-error' : ''}`}
          />
        </div>

        {errors.subject ? (
          <p className="form-error flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.subject}
          </p>
        ) : (
          <p className="form-helper">
            Buat judul yang ringkas dan jelas menggambarkan inti masalah.
          </p>
        )}
      </div>

      {/* 3. Isi Laporan */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="description-input" className="form-label mb-0 flex items-center gap-1.5">
            <AlignLeft className="w-4 h-4 text-surface-500" />
            <span>
              Isi Laporan <span className="text-red-500">*</span>
            </span>
          </label>
          <span className={`text-xs transition-colors ${getDescCounterClass()}`}>
            {descLength} / 50 min. karakter
          </span>
        </div>

        <div className="relative">
          <textarea
            id="description-input"
            rows={6}
            value={formData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Jelaskan secara detail kronologi kejadian, lokasi, waktu, pihak yang terlibat, serta dampak dari permasalahan yang Anda alami..."
            className={`form-input resize-y min-h-[140px] ${
              errors.description ? 'form-input-error' : ''
            }`}
          />
        </div>

        {errors.description ? (
          <p className="form-error flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.description}
          </p>
        ) : (
          <p className="form-helper">
            Jelaskan kronologi masalah selengkap mungkin agar proses penanganan lebih efektif.
          </p>
        )}
      </div>

      {/* 4. Lampiran Bukti */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="form-label mb-0">
            Lampiran Bukti <span className="text-surface-400 font-normal text-xs">(Opsional)</span>
          </label>
          <span className="text-xs text-surface-400">
            {attachments?.length || 0} / {MAX_FILES} file
          </span>
        </div>

        {/* Drag & Drop Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`upload-zone text-center ${
            isDragging ? 'upload-zone-active' : ''
          } ${errors.attachments || uploadError ? 'border-red-400 bg-red-50/10' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              handleFilesAdded(e.target.files);
              e.target.value = null; // reset input
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1 transition-transform group-hover:scale-110">
              <Upload className="w-6 h-6" />
            </div>

            <div className="text-sm text-surface-700">
              <span className="font-semibold text-indigo-600">Klik untuk mengunggah</span> atau
              tarik & lepas file di sini
            </div>

            <p className="text-xs text-surface-400">
              Format: JPG, PNG, PDF, DOC, DOCX (Maks. 5MB per file, maksimal 5 file)
            </p>
          </div>
        </div>

        {/* Custom Upload Error Notice */}
        {uploadError && (
          <p className="form-error flex items-center gap-1 mt-2">
            <AlertCircle className="w-3.5 h-3.5" />
            {uploadError}
          </p>
        )}

        {/* Validation Prop Error Notice */}
        {errors.attachments && (
          <p className="form-error flex items-center gap-1 mt-2">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.attachments}
          </p>
        )}

        {/* Attached Files List */}
        {Array.isArray(attachments) && attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            <h5 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
              File Terlampir ({attachments.length})
            </h5>
            <div className="space-y-2">
              {attachments.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="animate-fade-in flex items-center justify-between p-3 rounded-xl border border-surface-200 bg-white hover:border-surface-300 transition-all shadow-sm group"
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    <div className="p-2 rounded-lg bg-indigo-50">
                      {getFileIcon(file)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-surface-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-surface-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(idx);
                    }}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    title="Hapus file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
