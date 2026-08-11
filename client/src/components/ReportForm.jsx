import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  FileText,
  Send,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Megaphone,
} from 'lucide-react';
import StepIndicator from './StepIndicator';
import StepIdentitas from './steps/StepIdentitas';
import StepDetail from './steps/StepDetail';
import StepKonfirmasi from './steps/StepKonfirmasi';
import SuccessModal from './SuccessModal';

const STEPS = [
  { number: 1, title: 'Identitas Pelapor', icon: User },
  { number: 2, title: 'Detail Laporan', icon: FileText },
  { number: 3, title: 'Konfirmasi & Kirim', icon: Send },
];

const INITIAL_FORM_DATA = {
  student_name: '',
  student_nim: '',
  student_email: '',
  student_phone: '',
  student_faculty: '',
  student_program: '',
  is_anonymous: false,
  category_id: '',
  subject: '',
  description: '',
};

export default function ReportForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketCode, setTicketCode] = useState('');

  // ─── Update single field ───
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // ─── Validation ───
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.student_name.trim()) {
      newErrors.student_name = 'Nama lengkap wajib diisi';
    }
    if (!formData.student_nim.trim()) {
      newErrors.student_nim = 'NIM wajib diisi';
    } else if (!/^[A-Za-z0-9]{8,15}$/.test(formData.student_nim.trim())) {
      newErrors.student_nim = 'NIM harus berupa 8-15 digit huruf dan angka';
    }
    if (!formData.student_email?.trim()) {
      newErrors.student_email = 'Email kampus wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.student_email)) {
      newErrors.student_email = 'Format email tidak valid';
    }
    if (!formData.student_phone?.trim()) {
      newErrors.student_phone = 'No. WhatsApp wajib diisi';
    } else if (!/^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(formData.student_phone.replace(/[\s-]/g, ''))) {
      newErrors.student_phone = 'Format nomor telepon tidak valid';
    }
    if (!formData.student_faculty) {
      newErrors.student_faculty = 'Fakultas wajib diisi';
    }
    if (!formData.student_program?.trim()) {
      newErrors.student_program = 'Program studi wajib diisi';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.category_id) {
      newErrors.category_id = 'Pilih salah satu kategori laporan';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Judul laporan wajib diisi';
    } else if (formData.subject.trim().length < 10) {
      newErrors.subject = 'Judul laporan minimal 10 karakter';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Isi laporan wajib diisi';
    } else if (formData.description.trim().length < 50) {
      newErrors.description = `Isi laporan minimal 50 karakter (${formData.description.trim().length}/50)`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Navigation ───
  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Submit ───
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const data = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        const formKey = key === 'student_id' ? 'student_nim' : key;
        data.append(formKey, value);
      });

      attachments.forEach((file) => {
        data.append('attachments', file);
      });

      const response = await fetch('http://localhost:5000/api/v1/reports', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengirim laporan');
      }

      setTicketCode(result.data.ticket_code);
      setShowSuccess(true);
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ submit: error.message || 'Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Reset ───
  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setAttachments([]);
    setErrors({});
    setCurrentStep(1);
    setShowSuccess(false);
    setTicketCode('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Render current step ───
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepIdentitas
            formData={formData}
            errors={errors}
            updateField={updateField}
          />
        );
      case 2:
        return (
          <StepDetail
            formData={formData}
            errors={errors}
            updateField={updateField}
            attachments={attachments}
            setAttachments={setAttachments}
          />
        );
      case 3:
        return (
          <StepKonfirmasi
            formData={formData}
            attachments={attachments}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen font-sans bg-gradient-to-br from-[#1a0505] via-black to-[#1a0505] text-gray-200 relative pt-20">
        {/* GLOBAL BACKGROUND PATTERN */}
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmurlCtncmlkKSIvPjwvc3ZnPg==')] opacity-40 z-0 pointer-events-none"></div>

        {/* ─── Main Content ─── */}
        <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
          {/* ─── Header ─── */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-950/40 border border-red-500/30 text-red-400 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
              <Megaphone size={16} />
              <span>Layanan BEM UMS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 uppercase tracking-tight">
              Form Pelaporan
              <span className="text-red-500">
                {' '}BEM UMS
              </span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Sampaikan keluhan atau aspirasi Anda terkait UKT, fasilitas kampus, akademik, dan lainnya.
              Laporan Anda akan ditindaklanjuti oleh BEM.
            </p>
          </div>

          {/* ─── Step Indicator ─── */}
          <StepIndicator currentStep={currentStep} steps={STEPS} />

          {/* ─── Form Card ─── */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-10">
              {/* Step Title */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                  {STEPS[currentStep - 1].title}
                </h2>
                <div className="w-12 h-1 bg-gradient-to-r from-red-600 to-red-900 rounded-full mt-2" />
              </div>

              {/* Step Content */}
              <div key={currentStep}>
                {renderStep()}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-fade-in">
                  {errors.submit}
                </div>
              )}

              {/* ─── Navigation Buttons ─── */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-100">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="btn-secondary"
                    disabled={isSubmitting}
                  >
                    <ChevronLeft size={18} />
                    Kembali
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary"
                  >
                    Selanjutnya
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn-primary min-w-[180px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Kirim Laporan
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* ─── Disclaimer ─── */}
            <p className="text-center text-xs text-surface-400 mt-6 px-4">
              Dengan mengirimkan laporan ini, saya menyatakan bahwa seluruh informasi yang diberikan adalah benar dan dapat dipertanggungjawabkan.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Success Modal ─── */}
      {showSuccess && (
        <SuccessModal 
          ticketCode={ticketCode} 
          onClose={handleReset} 
          onTrack={(code) => navigate(`/lacak/${code}`)}
        />
      )}
    </>
  );
}
