import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Ticket,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Clock,
  Settings,
  Users,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Calendar,
  Tag,
  Shield,
  ChevronRight,
  Mail,
} from 'lucide-react';

// ─── Status Configuration ───
const STATUS_CONFIG = {
  menunggu_verifikasi: { label: 'Menunggu Verifikasi', color: 'amber', icon: Clock },
  sedang_diproses: { label: 'Sedang Diproses', color: 'blue', icon: Settings },
  tahap_audiensi: { label: 'Tahap Audiensi', color: 'amber', icon: Users },
  selesai: { label: 'Selesai', color: 'emerald', icon: CheckCircle2 },
};

const STATUS_ORDER = ['menunggu_verifikasi', 'sedang_diproses', 'tahap_audiensi', 'selesai'];

const STATUS_BADGE_STYLES = {
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const STATUS_DOT_STYLES = {
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

const formatDateShort = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

const getMockResult = (ticketCode) => ({
  ticket_code: ticketCode,
  subject: 'Permohonan Keringanan UKT Semester Genap 2026',
  category: 'UKT',
  status: 'sedang_diproses',
  is_anonymous: true,
  student_name: null,
  student_nim: null,
  created_at: '2026-08-10T09:30:00Z',
  updated_at: '2026-08-11T14:00:00Z',
  resolution_note: null,
  timeline: [
    { status: 'menunggu_verifikasi', note: 'Laporan baru diterima oleh sistem', timestamp: '2026-08-10T09:30:00Z' },
    { status: 'sedang_diproses', note: 'Laporan sedang ditinjau oleh Pengurus BEM UMS', timestamp: '2026-08-11T14:00:00Z' },
  ],
  public_responses: [
    { content: 'Laporan Anda sedang kami proses. Tim BEM UMS telah menjadwalkan pertemuan dengan Bagian Keuangan untuk membahas permohonan keringanan UKT Anda.', created_at: '2026-08-11T14:05:00Z' },
  ],
});

export default function TrackPage() {
  const { ticketCode: paramCode } = useParams();
  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState(paramCode || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (paramCode) {
      setInputCode(paramCode);
      doSearch(paramCode);
    }
  }, [paramCode]);

  const doSearch = async (code) => {
    const searchCode = (code || inputCode).trim().toUpperCase();
    if (!searchCode) { setError('Masukkan kode tiket terlebih dahulu'); return; }
    if (!/^BEM-[A-Z0-9]{4}$/.test(searchCode)) { setError('Format kode tiket tidak valid (contoh: BEM-X9A2)'); return; }

    setError('');
    setIsLoading(true);
    setResult(null);


    try {
      const response = await fetch(`/api/v1/reports/track/${searchCode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Tiket tidak ditemukan');
      }

      setResult(data.data);
      if (!paramCode || paramCode !== searchCode) navigate(`/lacak/${searchCode}`, { replace: true });
    } catch (err) { setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.'); }
    finally { setIsLoading(false); }
  };

  const handleReset = () => { setResult(null); setError(''); setInputCode(''); navigate('/lacak', { replace: true }); };

  const buildFullTimeline = () => {
    if (!result) return [];
    const map = {};
    result.timeline.forEach((e) => { map[e.status] = e; });
    const currentIdx = STATUS_ORDER.indexOf(result.status);
    return STATUS_ORDER.map((s, i) => ({
      ...STATUS_CONFIG[s], status: s,
      note: map[s]?.note || null, timestamp: map[s]?.timestamp || null,
      isCompleted: i < currentIdx, isCurrent: i === currentIdx, isUpcoming: i > currentIdx,
    }));
  };

  return (
    <div className="min-h-screen font-sans bg-canvas text-charcoal-900 relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Soft Organic Ambient Blobs */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-10 right-[5%] w-[450px] h-[450px] bg-sage-200/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 left-[5%] w-[400px] h-[400px] bg-terracotta-100/40 rounded-full blur-[90px]"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">

        {/* ─── Search Form ─── */}
        {!result && !isLoading && (
          <div className="animate-slide-up">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sage-100 border border-sage-200 text-forest-900 rounded-full text-xs font-bold mb-4 shadow-sm">
                <Search size={14} className="text-forest-800" />
                <span>Lacak Laporan</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-forest-900 mb-3 uppercase tracking-tight">
                Lacak Status{' '}
                <span className="text-terracotta-500">Laporan Anda</span>
              </h1>
              <p className="text-charcoal-600 max-w-lg mx-auto text-sm sm:text-base">
                Masukkan kode tiket yang Anda terima saat mengirim laporan untuk melihat status dan perkembangan terkini.
              </p>
            </div>

            <div className="bg-white border border-cream-300 rounded-3xl p-8 sm:p-10 shadow-warm">
              <div className="space-y-4">
                <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider">Kode Tiket</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400 z-10"><Ticket size={20} /></div>
                    <input 
                      type="text" 
                      value={inputCode}
                      onChange={(e) => { setInputCode(e.target.value.toUpperCase()); setError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                      placeholder="BEM-XXXX"
                      className="w-full pl-12 pr-4 py-3.5 rounded-full text-forest-900 bg-cream-100 border border-cream-400 placeholder-charcoal-400 focus:outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 transition-colors uppercase font-mono tracking-wider text-sm" 
                    />
                  </div>
                  <button onClick={() => doSearch()} className="btn-primary py-3.5 px-8 text-sm whitespace-nowrap">
                    Lacak <ArrowRight size={18} />
                  </button>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-700 text-sm animate-fade-in bg-red-50 p-3.5 rounded-2xl border border-red-200">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-charcoal-400 text-xs font-mono">Format: BEM-XXXX</p>
                </div>
                <div className="flex items-start gap-2.5 mt-4 p-3.5 bg-sage-50/80 border border-sage-200 rounded-2xl">
                  <Mail size={15} className="text-sage-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-forest-800 leading-relaxed">
                    Kode tiket telah dikirimkan ke email yang Anda daftarkan saat melapor. Anda juga akan menerima pemberitahuan melalui email setiap ada perkembangan tindak lanjut laporan. 
                    <span className="block mt-1 font-medium italic">Jangan lupa cek folder Spam/Junk jika email tidak ditemukan.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Loading ─── */}
        {isLoading && (
          <div className="text-center py-20 animate-fade-in">
            <Loader2 size={44} className="animate-spin text-terracotta-500 mx-auto mb-4" />
            <p className="text-charcoal-500 font-medium">Mencari laporan Anda...</p>
          </div>
        )}

        {/* ─── Result ─── */}
        {result && !isLoading && (
          <div className="animate-slide-up space-y-6">
            <button onClick={handleReset} className="flex items-center gap-2 text-sm font-semibold text-charcoal-600 hover:text-forest-900 transition-colors py-2">
              <ArrowLeft size={16} /> Cari tiket lain
            </button>

            {/* Header Card */}
            <div className="bg-white border border-cream-300 rounded-3xl p-6 sm:p-8 shadow-warm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mb-1">Kode Tiket</p>
                  <p className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-forest-900">{result.ticket_code}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {(() => {
                    const c = STATUS_CONFIG[result.status] || { label: result.status, color: 'amber', icon: Clock };
                    const s = STATUS_BADGE_STYLES[c.color] || 'bg-amber-100 text-amber-700 border-amber-200';
                    const I = c.icon;
                    return <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${s}`}><I size={14} />{c.label}</span>;
                  })()}
                  {result.is_anonymous && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
                      <Shield size={12} /> Anonim
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-4 pt-5 border-t border-cream-200">
                <div className="flex items-start gap-3"><Tag size={16} className="text-charcoal-400 mt-0.5 shrink-0" /><div><p className="text-xs text-charcoal-400 font-bold uppercase tracking-wider">Kategori</p><p className="text-sm font-bold text-forest-900">{result.category}</p></div></div>
                <div className="flex items-start gap-3"><MessageSquare size={16} className="text-charcoal-400 mt-0.5 shrink-0" /><div><p className="text-xs text-charcoal-400 font-bold uppercase tracking-wider">Perihal</p><p className="text-sm font-bold text-forest-900">{result.subject}</p></div></div>
                <div className="flex items-start gap-3"><Calendar size={16} className="text-charcoal-400 mt-0.5 shrink-0" /><div><p className="text-xs text-charcoal-400 font-bold uppercase tracking-wider">Tanggal Pelaporan</p><p className="text-sm font-medium text-charcoal-600">{formatDate(result.created_at)}</p></div></div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-cream-300 rounded-3xl p-6 sm:p-8 shadow-warm">
              <h3 className="text-base sm:text-lg font-bold text-forest-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
                <Clock size={18} className="text-terracotta-500" /> Timeline Perkembangan
              </h3>
              <div className="relative">
                {buildFullTimeline().map((step, index, arr) => {
                  const Icon = step.icon;
                  const isLast = index === arr.length - 1;
                  let dotClass, lineClass;
                  if (step.isCompleted) { dotClass = 'bg-sage-500 text-white shadow-sage'; lineClass = 'bg-sage-400'; }
                  else if (step.isCurrent) { dotClass = 'bg-terracotta-500 text-white shadow-terracotta ring-4 ring-terracotta-100'; lineClass = 'bg-cream-300'; }
                  else { dotClass = 'bg-cream-300 text-charcoal-400'; lineClass = 'bg-cream-300'; }

                  return (
                    <div key={step.status} className="flex gap-4 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 z-10 ${dotClass}`}>
                          {step.isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                        </div>
                        {!isLast && <div className={`w-0.5 flex-1 min-h-[40px] my-1 ${lineClass}`} />}
                      </div>
                      <div className={isLast ? 'pb-0 pt-2' : 'pb-8 pt-2'}>
                        <p className={`text-sm font-bold tracking-wide ${step.isCurrent ? 'text-forest-900' : step.isCompleted ? 'text-forest-800' : 'text-charcoal-400'}`}>
                          {step.label}
                          {step.isCurrent && <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-terracotta-50 border border-terracotta-200 text-terracotta-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Saat ini</span>}
                        </p>
                        {step.note && <p className="text-sm text-charcoal-600 mt-1">{step.note}</p>}
                        {step.timestamp && <p className="text-xs text-charcoal-400 mt-1">{formatDateShort(step.timestamp)}</p>}
                        {step.isUpcoming && <p className="text-xs text-charcoal-400 italic mt-1">Menunggu...</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Public Responses */}
            {result.public_responses?.length > 0 && (
              <div className="bg-white border border-cream-300 rounded-3xl p-6 sm:p-8 shadow-warm">
                <h3 className="text-base sm:text-lg font-bold text-forest-900 mb-5 flex items-center gap-2 uppercase tracking-wide">
                  <MessageSquare size={18} className="text-terracotta-500" /> Respon Tim BEM
                </h3>
                <div className="space-y-4">
                  {result.public_responses.map((resp, idx) => (
                    <div key={idx} className="p-5 bg-cream-50/70 border border-cream-300 border-l-4 border-l-terracotta-500 rounded-r-2xl relative overflow-hidden">
                      <p className="text-sm text-charcoal-700 leading-relaxed">{resp.content}</p>
                      <p className="text-xs text-charcoal-400 mt-3 flex items-center gap-1 font-mono"><Calendar size={12} /> {formatDateShort(resp.created_at)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/lapor" className="btn-primary flex-1 py-3.5">Buat Laporan Baru <ChevronRight size={18} /></Link>
              <Link to="/" className="btn-secondary flex-1 py-3.5">Kembali ke Beranda</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
