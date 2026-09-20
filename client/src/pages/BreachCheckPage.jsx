import { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Mail, 
  KeyRound, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw, 
  Info, 
  FileText, 
  Laptop,
  ShieldQuestion,
  Calendar,
  Users,
  Building,
  Globe,
  Database,
  Radio,
  Clock,
  Shield,
  BadgeAlert,
  ChevronDown,
  ChevronUp,
  Zap,
  Activity,
  CheckSquare,
  Square,
  HelpCircle,
  EyeOff,
  Cpu,
  Camera,
  MessageCircle,
  Video
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BreachCheckPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Interactive Checklist State (Self-Assessment Cyber Hygiene)
  const [checklist, setChecklist] = useState({
    use2FA: false,
    uniquePassword: false,
    noPublicWifi: false,
    noAutoSaveBrowser: false,
    regularCheck: false,
  });

  // Interactive FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const toggleChecklist = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateScore = () => {
    const total = Object.keys(checklist).length;
    const completed = Object.values(checklist).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Masukkan alamat email yang valid.');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/v1/cyber/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Gagal memeriksa kebocoran data. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kendala jaringan saat menghubungkan ke server pemindai.');
    } finally {
      setLoading(false);
    }
  };

  const recentIncidents = [
    {
      name: 'Cutout.Pro AI Breached',
      date: 'Februari 2024',
      records: '20 Juta Akun',
      type: 'Names, Passwords, IP, Emails',
      risk: 'Tinggi',
      impact: 'Banyak mahasiswa pengguna tool AI foto terkena dampak.'
    },
    {
      name: 'AlienStealer Botnet Logs',
      date: 'Februari 2025',
      records: '299 Juta Kredensial',
      type: 'Browser Logins, Cookies, Passwords',
      risk: 'Kritis',
      impact: 'Pencurian riwayat password dari PC yang terinfeksi file bajakan.'
    },
    {
      name: 'Canva Design Platform',
      date: 'Mei 2019',
      records: '137 Juta Akun',
      type: 'Usernames, Passwords (Crypt), Emails',
      risk: 'Sedang',
      impact: 'Mempengaruhi akun desain mahasiswa yang belum pernah ganti password.'
    },
    {
      name: 'Wattpad Global Database',
      date: 'Juni 2020',
      records: '270 Juta Akun',
      type: 'Emails, Passwords, IP Addresses',
      risk: 'Tinggi',
      impact: 'Sering menjadi celah pembajakan karena memakai password lama.'
    }
  ];

  const faqs = [
    {
      q: 'Bagaimana Lapor Pres bisa mengetahui bahwa akun email saya terkena insiden peretasan?',
      a: 'Lapor Pres terhubung dengan basis data pemantau intelijen ancaman siber global (seperti XposedOrNot dan database kebocoran publik terverifikasi). Sistem ini mengindeks rekaman data yang pernah terekspos di forum peretas underground, dark web, dan paste sites. Ketika Anda memasukkan email, sistem mencocokkannya dengan database riwayat insiden tanpa pernah meminta kata sandi Anda.'
    },
    {
      q: 'Apakah mengecek email di situs ini aman bagi privasi saya?',
      a: 'Sangat aman. Sistem Lapor Pres tidak pernah meminta, melihat, atau menyimpan kata sandi Anda. Pengecekan dilakukan murni dengan mencocokkan alamat email publik ke daftar insiden peretasan masa lalu.'
    },
    {
      q: 'Apa yang harus saya lakukan jika hasil diagnosa menunjukkan STATUS KRITIS atau WASPADA?',
      a: 'Prioritas pertama adalah segera mengganti kata sandi email utama (Gmail/Yahoo/Email Kampus) dan akun media sosial yang menggunakan kata sandi serupa. Aktifkan autentikasi 2 faktor (2FA) menggunakan aplikasi Google Authenticator, dan periksa riwayat sesi login aktif di pengaturan akun Anda.'
    },
    {
      q: 'Kenapa hacker bisa membobol akun saya jika yang bocor adalah situs lain (bukan Instagram/TikTok langsung)?',
      a: 'Ini disebut teknik Credential Stuffing. Hacker menyadari bahwa sebagian besar orang menggunakan kata sandi yang sama untuk berbagai akun. Begitu sebuah situs belanja atau aplikasi edit foto bobol, hacker akan otomatis menggunakan bot untuk mencoba kombinasi email & password tersebut ke Instagram, Google, dan media sosial lainnya.'
    }
  ];

  const score = calculateScore();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 right-5 w-[600px] h-[600px] bg-sky-100/50 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Title Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-[#0066FF] mb-4 shadow-sm">
            <Radio size={14} className="text-[#0066FF] animate-pulse" />
            <span>Pusat Forensik & Pemantau Intelijen Ancaman Siber Mahasiswa</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase mb-4 leading-tight text-slate-900">
            Scanner Kebocoran <span className="text-[#0066FF]">Data & Forensik Akun</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Deteksi apakah kredensial email dan kata sandi Anda pernah bocor di database peretasan internasional. Lindungi akun media sosial, email induk, dan perbankan digital Anda sebelum terjadi pemerasan.
          </p>
        </div>

        {/* Global Threat Stats Bar (Kompleksitas Data) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-sky-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[#0066FF] mb-1">
              <Database size={16} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Data Terpantau</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">15 Miliar+</div>
            <div className="text-[11px] text-slate-500">Kredensial publik global</div>
          </div>

          <div className="bg-white border border-sky-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[#0066FF] mb-1">
              <KeyRound size={16} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pola Serangan</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">84.2%</div>
            <div className="text-[11px] text-slate-500">Akibat Password Reuse</div>
          </div>

          <div className="bg-white border border-sky-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[#0066FF] mb-1">
              <Activity size={16} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Waktu Eksploitasi</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">&lt; 24 Jam</div>
            <div className="text-[11px] text-slate-500">Dari bocor hingga dibobol</div>
          </div>

          <div className="bg-white border border-sky-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <ShieldCheck size={16} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Keamanan Pengguna</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">100% Aman</div>
            <div className="text-[11px] text-slate-500">Tanpa simpan kata sandi</div>
          </div>
        </div>

        {/* Search / Scanner Input Card */}
        <div className="bg-white border border-sky-100 rounded-3xl p-6 sm:p-10 shadow-sm relative">
          <form onSubmit={handleCheck} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Alamat Email Akun / Medsos Anda
              </label>
              <span className="text-[11px] text-[#0066FF] font-mono flex items-center gap-1 font-bold">
                <Radio size={12} />
                <span>Live Query Intelligence</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#0066FF]">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan alamat email (cth: student@mail.com)"
                  className="w-full pl-11 pr-4 py-4 bg-white border border-sky-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] text-sm transition-all shadow-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary py-4 px-8 flex items-center justify-center gap-2 text-sm font-bold bg-[#0066FF] hover:bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin text-white" />
                    <span>Memindai Basis Data...</span>
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    <span>Pindai Sekarang</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-700 mt-2 bg-red-50 p-3 rounded-xl border border-red-200">
                <AlertTriangle size={14} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 pt-2 gap-2 border-t border-slate-100 mt-3">
              <p className="flex items-center gap-1.5">
                <Lock size={12} className="text-[#0066FF]" />
                <span>Pemeriksaan ini aman. Sistem tidak pernah meminta atau menyimpan kata sandi Anda.</span>
              </p>
              <span className="text-slate-500 font-mono flex items-center gap-1">
                <Database size={12} className="text-[#0066FF]" />
                <span>Pencocokan Identitas Terbuka</span>
              </span>
            </div>
          </form>
        </div>

        {/* Loading Radar Animation */}
        {loading && (
          <div className="text-center py-16 animate-fade-in bg-white border border-sky-100 rounded-3xl p-8 shadow-sm">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping"></div>
              <div className="absolute inset-3 rounded-full border-2 border-[#0066FF] animate-pulse"></div>
              <div className="w-24 h-24 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
                <ShieldQuestion size={36} className="text-[#0066FF] animate-bounce" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Menganalisis Riwayat Pelanggaran Siber...</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Mencocokkan alamat email dengan miliaran rekaman kebocoran data di forum underground, paste sites, dan kanal intelijen global.
            </p>
          </div>
        )}

        {/* Result Area (Rendered after query) */}
        {result && !loading && (
          <div className="space-y-8 animate-fade-in">
            {/* Verdict Status Card */}
            {result.isBreached ? (
              <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                      <ShieldAlert size={30} />
                    </div>
                    <div>
                      <div className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 mb-1">
                        TINGKAT RISIKO: {result.riskLevel} (Skor: {result.riskScore}/100)
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-red-950">
                        Kredensial Anda Terdeteksi Pernah Bocor!
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-red-200 shadow-sm">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Total Insiden</div>
                      <div className="text-xl font-black text-red-600">{result.totalBreaches} Insiden</div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-red-950 leading-relaxed mb-6">
                  Alamat email <strong className="text-slate-900 font-mono bg-white px-2 py-0.5 rounded border border-red-200">{result.email}</strong> ditemukan dalam rekaman peretasan pihak ketiga. Peretas menggunakan kredensial ini untuk membajak akun media sosial yang menggunakan kata sandi serupa (*credential stuffing*).
                </p>

                {/* Exposed Data Classes */}
                {result.exposedData && result.exposedData.length > 0 && (
                  <div className="pt-4 border-t border-red-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-3 flex items-center gap-1.5">
                      <KeyRound size={14} /> Kategori Data yang Terekspos ke Publik:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.exposedData.map((d, idx) => (
                        <span 
                          key={idx} 
                          className={`text-xs font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                            d.toLowerCase().includes('password') 
                              ? 'bg-red-100 border-red-300 text-red-700 font-bold shadow-sm' 
                              : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                          }`}
                        >
                          {d.toLowerCase().includes('password') && <BadgeAlert size={13} className="text-red-600" />}
                          <span>{d}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <ShieldCheck size={30} />
                  </div>
                  <div>
                    <div className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 mb-1">
                      STATUS: AMAN
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
                      Tidak Ada Kebocoran Publik Ditemukan!
                    </h2>
                  </div>
                </div>
                <p className="text-sm text-emerald-900 leading-relaxed">
                  Kabar baik! Email <strong className="text-slate-900 font-mono bg-white px-2 py-0.5 rounded border border-emerald-200">{result.email}</strong> tidak terdaftar dalam catatan kebocoran data siber besar yang tercatat di jaringan intelijen ancaman.
                </p>
              </div>
            )}

            {/* List of Breaches with In-depth Information */}
            {result.breaches && result.breaches.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={18} className="text-[#0066FF]" />
                    Rincian Lengkap Insiden Kebocoran Terkait:
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {result.breaches.length} sumber data terverifikasi
                  </span>
                </div>

                <div className="grid gap-5">
                  {result.breaches.map((b, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white border border-sky-100 hover:border-blue-300 rounded-3xl p-6 transition-all duration-300 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          {b.logo ? (
                            <img 
                              src={b.logo} 
                              alt={b.name} 
                              className="w-10 h-10 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200 shrink-0" 
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0066FF] shrink-0">
                              <Building size={20} />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base sm:text-lg font-bold text-slate-900">{b.name}</h4>
                              {b.verified && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 size={11} /> Terverifikasi
                                </span>
                              )}
                            </div>
                            {b.domain && (
                              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <Globe size={11} />
                                <span>{b.domain}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#0066FF]">
                            <Calendar size={13} />
                            <span>Tahun Insiden: {b.year}</span>
                          </div>
                          {b.addedDate && (
                            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                              <Clock size={13} />
                              <span>Tercatat: {b.addedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {b.details.replace(/<[^>]*>?/gm, '')}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-0.5">Total Akun Terdampak</span>
                          <span className="font-bold text-slate-900 flex items-center gap-1">
                            <Users size={13} className="text-[#0066FF]" />
                            {b.recordsCount ? `${b.recordsCount} Akun` : 'Jutaan Akun'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-0.5">Sektor Industri</span>
                          <span className="font-bold text-slate-900">{b.industry}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-0.5">Risiko Kata Sandi</span>
                          <span className={`font-bold inline-block px-2 py-0.5 rounded text-[11px] ${
                            b.passwordRisk.toLowerCase().includes('sangat bahaya') || b.passwordRisk.toLowerCase().includes('plaintext') 
                              ? 'bg-red-100 text-red-700 border border-red-200' 
                              : b.passwordRisk.toLowerCase().includes('mudah') || b.passwordRisk.toLowerCase().includes('easy') 
                              ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {b.passwordRisk.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {b.dataClasses && b.dataClasses.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
                          <span className="text-slate-500 font-semibold text-[11px] mr-1">Data bocor:</span>
                          {b.dataClasses.map((item, i) => (
                            <span 
                              key={i} 
                              className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-medium ${
                                item.toLowerCase().includes('password') || item.toLowerCase().includes('sandi')
                                  ? 'bg-red-100 border-red-200 text-red-700'
                                  : 'bg-slate-100 border-slate-200 text-slate-700'
                              }`}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}

                      {b.referenceUrl && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Laporan Berita / Referensi Resmi:</span>
                          <a 
                            href={b.referenceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#0066FF] hover:underline flex items-center gap-1 font-semibold transition-colors"
                          >
                            <span>Baca Investigasi Lengkap</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SOCIAL MEDIA RISK RADAR (Diletakkan setelah insiden agar user paham konteksnya) */}
            {result.socialMediaImpact && (
              <div className="bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 text-[#0066FF] mb-1 text-xs font-bold uppercase tracking-wider">
                  <Activity size={16} />
                  <span>Dampak Langsung ke Akun Media Sosial Anda</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                  Bagaimana Kebocoran Ini Mempengaruhi Akun Medsos Anda?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                  Berdasarkan temuan insiden di atas, berikut analisis risiko langsung terhadap akun media sosial utama yang sering diserang peretas:
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {result.socialMediaImpact.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`p-5 rounded-2xl border transition-all ${
                        item.statusType === 'danger' 
                          ? 'bg-red-50/70 border-red-200 hover:border-red-400' 
                          : item.statusType === 'warning'
                          ? 'bg-amber-50/70 border-amber-200 hover:border-amber-400'
                          : 'bg-slate-50 border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                            item.statusType === 'danger' ? 'bg-red-100 text-red-700 border border-red-200' :
                            item.statusType === 'warning' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            'bg-blue-50 text-[#0066FF] border border-blue-100'
                          }`}>
                            {item.platform === 'Instagram' ? <Camera size={18} /> :
                             item.platform === 'TikTok' ? <Video size={18} /> :
                             item.platform === 'WhatsApp' ? <MessageCircle size={18} /> :
                             <Mail size={18} />}
                          </div>
                          <h4 className="text-base font-bold text-slate-900">{item.platform}</h4>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          item.statusType === 'danger' ? 'bg-red-100 text-red-700 border-red-200' :
                          item.statusType === 'warning' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {item.explanation}
                      </p>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700 leading-relaxed">
                        <span className="font-bold text-slate-900 block mb-0.5">Saran Aksi Penyelamatan:</span>
                        {item.actionTip}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actionable Recommendations */}
            <div className="bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-[#0066FF]" />
                Langkah Penanganan & Proteksi Diri:
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {result.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        rec.priority === 'HIGH' ? 'bg-red-500' : rec.priority === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}></span>
                      <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rec.detail}</p>
                  </div>
                ))}
              </div>

              {/* Emergency Link to Report */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Sedang mengalami ancaman atau pemerasan?</h4>
                  <p className="text-xs text-slate-600">Buat laporan pengaduan langsung ke tim Advokasi BEM untuk pendampingan.</p>
                </div>
                <Link
                  to="/lapor"
                  className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052FF] text-white"
                >
                  <span>Lapor ke Advokasi</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* SOURCE & TRANSPARENCY CARD */}
            {result.dataSource && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-6 sm:p-8 relative shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-blue-200 flex items-center justify-center text-[#0066FF] shrink-0 shadow-sm">
                    <Shield size={24} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        Dari Mana Lapor Pres Mengetahui Data Kebocoran Ini?
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Sumber data: <a href={result.dataSource.url} target="_blank" rel="noopener noreferrer" className="text-[#0066FF] underline font-semibold">{result.dataSource.name}</a>
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {result.dataSource.description}
                    </p>
                    <div className="p-3.5 bg-white border border-blue-100 rounded-2xl text-[11px] text-slate-700 leading-relaxed flex items-start gap-2 shadow-xs">
                      <Lock size={14} className="text-[#0066FF] shrink-0 mt-0.5" />
                      <span>{result.dataSource.transparency}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* COMPREHENSIVE SECTIONS BELOW THE SCANNER (Rich & Informative)   */}
        {/* ════════════════════════════════════════════════════════════════ */}

        {/* SECTION 1: ANATOMI PEMBAJAKAN AKUN MAHASISWA */}
        <div className="bg-white border border-sky-100 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2 text-[#0066FF]">
            <Zap size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Edukasi Keamanan Digital</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
            Anatomi Peretasan: Bagaimana Akun Mahasiswa Bisa Dibobol?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-8 max-w-3xl">
            Banyak mahasiswa mengira peretasan terjadi secara langsung pada aplikasi Instagram atau WhatsApp mereka. Padahal, peretasan hampir selalu melalui 3 tahapan eksploitasi data berikut:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#0066FF] flex items-center justify-center mb-4 font-black shadow-xs">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Kebocoran di Situs Lain</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mahasiswa mendaftar di situs belanja, game, forum kampus, atau tools AI gratis. Saat situs tersebut dibobol hacker, data email dan kata sandi terekspos ke forum underground.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
                Celah: Password Reuse
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-sky-600 flex items-center justify-center mb-4 font-black shadow-xs">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Bot Credential Stuffing</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Peretas menggunakan bot otomatis untuk mencoba ribuan kombinasi email dan password hasil bocoran tersebut ke Instagram, TikTok, dan Google secara bersamaan.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
                Metode: Automated Brute-Force
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-red-500 flex items-center justify-center mb-4 font-black shadow-xs">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Pengambilalihan & Pemerasan</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Begitu berhasil masuk, pelaku langsung mengganti email pemulihan, mengaktifkan 2FA milik pelaku, lalu mulai memeras korban atau menipu teman-teman di kontak korban.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-red-500 font-mono">
                Dampak: Pemerasan / Penipuan
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: INTERACTIVE CYBER HYGIENE CALCULATOR */}
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-sky-50/80 border border-sky-100 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-[#0066FF] mb-1 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={16} />
                <span>Kalkulator Ketahanan Siber Mandiri</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Seberapa Kebal Akun Anda dari Ancaman Peretasan?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Centang kebiasaan keamanan digital yang sudah Anda terapkan di bawah ini untuk melihat skor ketahanan akun Anda.
              </p>
            </div>

            {/* Score Radial Indicator */}
            <div className="bg-white border-2 border-sky-100 p-4 rounded-2xl flex items-center gap-4 min-w-[220px] shadow-sm">
              <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-[#0066FF] flex items-center justify-center font-black text-2xl text-[#0066FF]">
                {score}%
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Skor Ketahanan</div>
                <div className={`text-sm font-bold ${
                  score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {score >= 80 ? 'Kuat & Terlindungi' : score >= 50 ? 'Cukup Waspada' : 'Rentan Diretas'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { key: 'use2FA', label: 'Saya sudah mengaktifkan Autentikasi Dua Faktor (2FA) dengan aplikasi Authenticator (bukan hanya SMS).' },
              { key: 'uniquePassword', label: 'Kata sandi email utama saya berbeda total dengan kata sandi akun media sosial atau aplikasi lain.' },
              { key: 'noPublicWifi', label: 'Saya tidak pernah login ke akun perbankan/medsos di jaringan WiFi publik tanpa proteksi VPN.' },
              { key: 'noAutoSaveBrowser', label: 'Saya tidak menyimpan kata sandi perbankan atau email penting di fitur auto-save browser laptop umum.' },
              { key: 'regularCheck', label: 'Saya rutin memeriksa daftar perangkat yang sedang login (Active Sessions) di akun Instagram/Google.' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleChecklist(item.key)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 ${
                  checklist[item.key]
                    ? 'bg-white border-[#0066FF] text-slate-900 shadow-sm ring-1 ring-blue-500/20'
                    : 'bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {checklist[item.key] ? (
                  <CheckSquare size={20} className="text-[#0066FF] shrink-0" />
                ) : (
                  <Square size={20} className="text-slate-400 shrink-0" />
                )}
                <span className="text-xs sm:text-sm leading-relaxed">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 3: RECENT NOTABLE BREACHES AFFECTING STUDENTS */}
        <div className="bg-white border border-sky-100 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-[#0066FF] mb-1 text-xs font-bold uppercase tracking-wider">
                <Clock size={16} />
                <span>Pemantauan Insiden Nyata</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Insiden Peretasan Populer yang Sering Menimpa Mahasiswa
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Basis Data Intelijen Terbuka</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {recentIncidents.map((inc, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl hover:border-sky-300 transition-all">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-slate-900">{inc.name}</h3>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    inc.risk === 'Kritis' ? 'bg-red-100 text-red-700 border-red-200' :
                    inc.risk === 'Tinggi' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-blue-100 text-[#0066FF] border-blue-200'
                  }`}>
                    Risiko {inc.risk}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-2 flex items-center gap-3">
                  <span>Waktu: {inc.date}</span>
                  <span>Skala: {inc.records}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {inc.impact}
                </p>
                <div className="text-[11px] text-[#0066FF] font-mono bg-white p-2 rounded-xl border border-slate-200">
                  Data: {inc.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <div className="bg-white border border-sky-100 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-[#0066FF] mb-2">
              <HelpCircle size={14} />
              <span>Pusat Pertanyaan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Pertanyaan Seputar Keamanan & Kebocoran Data
            </h2>
          </div>

          <div className="space-y-3 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:text-[#0066FF] transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp size={18} className="text-[#0066FF] shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA: REPORT TO ADVOCACY */}
        <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 border-2 border-blue-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3">
            Akun Anda Sedang Dibajak dan Mengalami Pemerasan?
          </h2>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Tim Advokasi BEM siap membantu mendampingi Anda membuat klarifikasi darurat, pengamanan identitas, dan eskalasi kasus ke pihak berwenang.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/lapor"
              className="btn-primary py-4 px-10 rounded-full text-sm font-bold bg-[#0066FF] hover:bg-[#0052FF] text-white shadow-md flex items-center gap-2"
            >
              <span>Buat Laporan Advokasi Sekarang</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/"
              className="btn-secondary py-4 px-8 rounded-full text-sm font-bold flex items-center gap-2 bg-white text-slate-800 border border-slate-200 hover:bg-slate-50"
            >
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
