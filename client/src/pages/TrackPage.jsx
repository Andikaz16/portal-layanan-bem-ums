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
      const response = await fetch(`http://localhost:5000/api/v1/reports/track/${searchCode}`);
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
    <div className="min-h-screen font-sans bg-gradient-to-br from-[#1a0505] via-black to-[#1a0505] text-gray-200 relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* GLOBAL BACKGROUND PATTERN */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmurlCtncmlkKSIvPjwvc3ZnPg==')] opacity-40 z-0 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">

        {/* ─── Search Form ─── */}
        {!result && !isLoading && (
          <div className="animate-slide-up">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-950/40 border border-red-500/30 text-red-400 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
                <Search size={16} />
                <span>Lacak Laporan</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 uppercase tracking-tight">
                Lacak Status{' '}
                <span className="text-red-500">Laporan Anda</span>
              </h1>
              <p className="text-gray-400 max-w-lg mx-auto">
                Masukkan kode tiket yang Anda terima saat mengirim laporan untuk melihat status dan perkembangan terkini.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 sm:p-10">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-300 uppercase tracking-wide">Kode Tiket</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10"><Ticket size={20} /></div>
                    <input type="text" value={inputCode}
                      onChange={(e) => { setInputCode(e.target.value.toUpperCase()); setError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                      placeholder="BEM-XXXX"
                      className="w-full pl-12 pr-4 py-4 rounded-xl text-white bg-white/10 border border-white/20 backdrop-blur-md placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors uppercase font-mono tracking-wider" />
                  </div>
                  <button onClick={() => doSearch()} className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] whitespace-nowrap">
                    Lacak <ArrowRight size={20} />
                  </button>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm animate-fade-in bg-red-950/30 p-3 rounded-lg border border-red-500/20">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}
                <p className="text-gray-500 text-xs text-center mt-2 font-mono">Format: BEM-XXXX</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── Loading ─── */}
        {isLoading && (
          <div className="text-center py-20 animate-fade-in">
            <Loader2 size={48} className="animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Mencari laporan Anda...</p>
          </div>
        )}

        {/* ─── Result ─── */}
        {result && !isLoading && (
          <div className="animate-slide-up space-y-6">
            <button onClick={handleReset} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors py-2">
              <ArrowLeft size={16} /> Cari tiket lain
            </button>

            {/* Header Card */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kode Tiket</p>
                  <p className="text-2xl sm:text-3xl font-bold font-mono tracking-wider text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{result.ticket_code}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {(() => {
                    const c = STATUS_CONFIG[result.status]; const s = STATUS_BADGE_STYLES[c.color]; const I = c.icon;
                    return <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold border ${s}`}><I size={15} />{c.label}</span>;
                  })()}
                  {result.is_anonymous && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 text-gray-300 rounded-full text-xs font-medium border border-white/20">
                      <Shield size={12} /> Anonim
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-4 pt-5 border-t border-white/10">
                <div className="flex items-start gap-3"><Tag size={16} className="text-gray-500 mt-0.5 shrink-0" /><div><p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Kategori</p><p className="text-sm font-medium text-gray-200">{result.category}</p></div></div>
                <div className="flex items-start gap-3"><MessageSquare size={16} className="text-gray-500 mt-0.5 shrink-0" /><div><p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Perihal</p><p className="text-sm font-medium text-gray-200">{result.subject}</p></div></div>
                <div className="flex items-start gap-3"><Calendar size={16} className="text-gray-500 mt-0.5 shrink-0" /><div><p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Tanggal Pelaporan</p><p className="text-sm font-medium text-gray-200">{formatDate(result.created_at)}</p></div></div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
                <Clock size={20} className="text-red-500" /> Timeline Perkembangan
              </h3>
              <div className="relative">
                {buildFullTimeline().map((step, index, arr) => {
                  const Icon = step.icon;
                  const isLast = index === arr.length - 1;
                  let dotClass, lineClass;
                  if (step.isCompleted) { dotClass = 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'; lineClass = 'bg-emerald-500/50'; }
                  else if (step.isCurrent) { dotClass = `${STATUS_DOT_STYLES[step.color]} text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] ring-2 ring-white/20`; lineClass = 'bg-white/10'; }
                  else { dotClass = 'bg-white/10 text-gray-500'; lineClass = 'bg-white/10'; }

                  return (
                    <div key={step.status} className="flex gap-4 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 z-10 ${dotClass}`}>
                          {step.isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                        </div>
                        {!isLast && <div className={`w-0.5 flex-1 min-h-[40px] my-1 ${lineClass}`} />}
                      </div>
                      <div className={isLast ? 'pb-0 pt-2' : 'pb-8 pt-2'}>
                        <p className={`text-sm font-bold tracking-wide ${step.isCurrent ? 'text-white' : step.isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
                          {step.label}
                          {step.isCurrent && <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-red-950 border border-red-500/30 text-red-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Saat ini</span>}
                        </p>
                        {step.note && <p className="text-sm text-gray-400 mt-1">{step.note}</p>}
                        {step.timestamp && <p className="text-xs text-gray-500 mt-1">{formatDateShort(step.timestamp)}</p>}
                        {step.isUpcoming && <p className="text-xs text-gray-600 italic mt-1">Menunggu...</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Public Responses */}
            {result.public_responses?.length > 0 && (
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2 uppercase tracking-wide">
                  <MessageSquare size={20} className="text-red-500" /> Respon Tim BEM
                </h3>
                <div className="space-y-4">
                  {result.public_responses.map((resp, idx) => (
                    <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                      <p className="text-sm text-gray-300 leading-relaxed pl-2">{resp.content}</p>
                      <p className="text-xs text-gray-500 mt-3 pl-2 flex items-center gap-1 font-mono"><Calendar size={12} /> {formatDateShort(resp.created_at)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/lapor" className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]">Buat Laporan Baru <ChevronRight size={18} /></Link>
              <Link to="/" className="flex-1 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl flex items-center justify-center transition-all">Kembali ke Beranda</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
