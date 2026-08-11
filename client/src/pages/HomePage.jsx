import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Megaphone,
  FileEdit,
  Search,
  TrendingUp,
  CheckCircle,
  Clock,
  Info,
  Shield,
  Eye,
  Handshake,
  Workflow,
  Ticket,
  Settings,
  CheckCircle2,
  Banknote,
  Building2,
  GraduationCap,
  Users,
  FileStack,
  MoreHorizontal,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [trackCode, setTrackCode] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackCode.trim()) {
      navigate(`/lacak/${trackCode.trim()}`);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const categories = [
    { name: 'UKT', icon: Banknote, desc: 'Uang Kuliah Tunggal, keringanan, dan pembayaran', color: 'emerald' },
    { name: 'Fasilitas Kampus', icon: Building2, desc: 'Gedung, laboratorium, WiFi, dan sarana prasarana', color: 'blue' },
    { name: 'Akademik', icon: GraduationCap, desc: 'Perkuliahan, dosen, kurikulum, dan nilai', color: 'red' },
    { name: 'Kemahasiswaan', icon: Users, desc: 'Organisasi, beasiswa, dan kegiatan mahasiswa', color: 'orange' },
    { name: 'Birokrasi', icon: FileStack, desc: 'Pelayanan administrasi dan birokrasi kampus', color: 'rose' },
    { name: 'Lainnya', icon: MoreHorizontal, desc: 'Keluhan lain yang tidak termasuk kategori di atas', color: 'slate' }
  ];

  const faqs = [
    {
      q: "Apakah laporan saya benar-benar anonim?",
      a: "Ya, jika Anda memilih opsi anonim saat melapor, identitas Anda (Nama dan NIM) akan disembunyikan dari tampilan publik dan admin tingkat kementerian. Hanya pejabat BEM yang berwenang (Presidium) yang dapat mengakses data identitas untuk keperluan validasi internal."
    },
    {
      q: "Berapa lama laporan saya akan diproses?",
      a: "Rata-rata laporan diproses dalam 3 hari kerja. Namun, waktu pemrosesan dapat bervariasi tergantung kompleksitas masalah dan ketersediaan pihak terkait untuk audiensi."
    },
    {
      q: "Bagaimana cara melacak status laporan?",
      a: "Setelah mengirim laporan, Anda akan mendapatkan kode tiket unik (contoh: BEM-X9A2). Gunakan kode tersebut di halaman 'Lacak Laporan' untuk melihat status terkini, timeline perkembangan, dan respon dari tim BEM."
    },
    {
      q: "Apakah saya bisa melapor lebih dari satu kali?",
      a: "Ya, Anda dapat mengirimkan laporan sebanyak yang diperlukan untuk kategori yang berbeda. Setiap laporan akan mendapatkan kode tiket tersendiri dan diproses secara independen."
    },
    {
      q: "Apa yang terjadi setelah saya melapor?",
      a: "Laporan Anda akan melewati 4 tahap: Menunggu Verifikasi → Sedang Diproses → Tahap Audiensi → Selesai. Tim kementerian akan memverifikasi laporan, melakukan investigasi, dan mengawal proses audiensi dengan pihak kampus terkait."
    },
    {
      q: "Siapa yang mengelola portal ini?",
      a: "Layanan BEM UMS dikelola oleh Pengurus Badan Eksekutif Mahasiswa (BEM) Universitas Muhammadiyah Surakarta."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-[#1a0505] via-black to-[#1a0505] text-gray-200 relative">
      
      {/* GLOBAL BACKGROUND PATTERN */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmurlCtncmlkKSIvPjwvc3ZnPg==')] opacity-40 z-0 pointer-events-none"></div>

      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-transparent">
        {/* Abstract Cyberpunk Background Elements */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-0 right-[10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-0 left-[10%] w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
        </div>

        {/* GIANT BACKGROUND LOGO */}
        <div className="absolute right-[-5%] lg:right-5 xl:right-20 top-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] lg:w-[600px] xl:w-[750px] opacity-70 pointer-events-none z-0">
          <div className="absolute inset-0 bg-red-600/20 blur-[100px] rounded-full"></div>
          <img 
            src="/logo-bem.png" 
            alt="BEM UMS Background Logo" 
            className="w-full h-auto object-contain drop-shadow-[0_0_40px_rgba(220,38,38,0.7)] mix-blend-lighten" 
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            
            {/* Left Content (Shifted Right) */}
            <div className="flex-1 text-center lg:text-left mt-8 lg:mt-0 lg:ml-12 xl:ml-24 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-950/40 border border-red-500/30 text-red-400 rounded-full text-sm font-bold mb-6 backdrop-blur-sm animate-fade-in">
                <Megaphone size={16} />
                <span>Layanan Resmi BEM UMS</span>
              </div>
              
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white italic tracking-tighter uppercase mb-4 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-slide-up">
                LAPOR<br/>PRES!!
              </h1>
              
              <p className="max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed font-medium animate-slide-up" style={{ animationDelay: '200ms' }}>
                Kanal resmi Badan Eksekutif Mahasiswa untuk menampung keluhan dan aspirasi mahasiswa. Laporanmu aman, terlacak, dan ditindaklanjuti.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <Link to="/lacak" className="w-full sm:w-auto px-8 py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-bold border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm">
                  <Search size={20} />
                  Lacak Laporan
                </Link>
                <Link to="/lapor" className="w-full sm:w-auto px-8 py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-bold bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all hover:scale-105">
                  <FileEdit size={20} />
                  Buat Laporan
                </Link>
              </div>
            </div>

            {/* Empty space to balance the flex layout and keep text on the left */}
            <div className="hidden lg:block flex-1"></div>
          </div>
        </div>
      </section>

      {/* SECTION 1.5: STATS CARDS (Moved below the fold) */}
      <section className="bg-transparent py-12 relative z-10">
        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 flex flex-col items-start hover:bg-white/10 transition-colors duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <div className="text-3xl font-black text-white mb-1">500+</div>
              <div className="text-sm text-gray-400 font-medium">Laporan Diterima</div>
            </div>
            
            <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 flex flex-col items-start hover:bg-white/10 transition-colors duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle size={24} />
              </div>
              <div className="text-3xl font-black text-white mb-1">430+</div>
              <div className="text-sm text-gray-400 font-medium">Laporan Selesai</div>
            </div>
            
            <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 flex flex-col items-start hover:bg-white/10 transition-colors duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
              <div className="text-3xl font-black text-white mb-1">3 Hari</div>
              <div className="text-sm text-gray-400 font-medium">Rata-rata Respon</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: ABOUT / VALUE PROPOSITION */}
      <section className="bg-transparent py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-full text-sm font-bold mb-6 backdrop-blur-sm">
              <Info size={16} />
              <span>Tentang Portal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">
              Apa Itu Layanan BEM UMS?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-400">
              Layanan BEM UMS adalah kanal resmi BEM yang menghubungkan suara mahasiswa dengan kebijakan kampus. Setiap laporan ditangani secara profesional dan transparan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center text-center hover:bg-white/10 hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Aman & Anonim</h3>
              <p className="text-gray-400">
                Identitas Anda terlindungi. Opsi anonim tersedia agar Anda bisa melapor tanpa rasa khawatir.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center text-center hover:bg-white/10 hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-6">
                <Eye size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Transparan & Terlacak</h3>
              <p className="text-gray-400">
                Pantau progres laporan Anda secara real-time menggunakan kode tiket unik.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center text-center hover:bg-white/10 hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-6">
                <Handshake size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ditindaklanjuti</h3>
              <p className="text-gray-400">
                Setiap laporan diproses hingga tahap audiensi dengan pihak kampus untuk mencapai resolusi.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="bg-transparent py-24 relative">
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-950/50 border border-red-500/30 text-red-400 rounded-full text-sm font-bold mb-6 backdrop-blur-sm">
              <Workflow size={16} />
              <span>Cara Kerja</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">
              Bagaimana Cara Kerjanya?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-400">
              Empat langkah sederhana untuk menyuarakan aspirasimu
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-[2px] overflow-hidden">
              <div className="absolute inset-0 border-t-2 border-dashed border-red-900/50"></div>
              {/* Animated Glowing Laser */}
              <motion.div 
                className="absolute top-0 w-32 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(220,38,38,1)]"
                initial={{ left: "-20%" }}
                animate={{ left: "120%" }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 0.5
                }}
              />
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-red-600 text-white font-bold text-lg flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform">
                  01
                </div>
                <FileEdit className="text-red-400 mb-3" size={28} />
                <h3 className="text-lg font-bold text-white mb-2">Isi Formulir</h3>
                <p className="text-gray-400 text-sm">Sampaikan keluhan melalui form pelaporan yang mudah digunakan</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-red-600 text-white font-bold text-lg flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform">
                  02
                </div>
                <Ticket className="text-red-400 mb-3" size={28} />
                <h3 className="text-lg font-bold text-white mb-2">Dapatkan Kode Tiket</h3>
                <p className="text-gray-400 text-sm">Simpan kode unik BEM-XXXX untuk melacak status laporan</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-red-600 text-white font-bold text-lg flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform">
                  03
                </div>
                <Settings className="text-red-400 mb-3" size={28} />
                <h3 className="text-lg font-bold text-white mb-2">Tim BEM Bergerak</h3>
                <p className="text-gray-400 text-sm">Laporan diverifikasi, diproses, dan dikawal oleh kementerian</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-red-600 text-white font-bold text-lg flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform">
                  04
                </div>
                <CheckCircle2 className="text-red-400 mb-3" size={28} />
                <h3 className="text-lg font-bold text-white mb-2">Masalah Selesai</h3>
                <p className="text-gray-400 text-sm">Resolusi dicapai melalui audiensi dengan pihak kampus</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 4: CATEGORIES */}
      <section className="bg-transparent py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>

        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">
              Kategori Pengaduan
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-400">
              Pilih kategori yang sesuai dengan permasalahan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories.map((cat, idx) => (
              <Link to="/lapor" key={idx} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 flex flex-col hover:bg-white/10 hover:border-red-500/30 hover:scale-[1.02] transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 text-gray-300 group-hover:bg-red-500/20 group-hover:text-red-400 flex items-center justify-center mb-4 transition-colors">
                  <cat.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{cat.name}</h3>
                <p className="text-gray-400 text-sm">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 5: QUICK TRACK */}
      <section className="relative py-24 overflow-hidden bg-transparent">
        <motion.div 
          className="container mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Lacak Laporan Anda
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-red-200 mb-10">
            Masukkan kode tiket untuk melihat perkembangan laporan Anda secara real-time
          </p>

          <form onSubmit={handleTrackSubmit} className="max-w-xl mx-auto relative flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 z-10">
                <Ticket size={20} />
              </div>
              <input
                type="text"
                value={trackCode}
                onChange={(e) => setTrackCode(e.target.value)}
                placeholder="BEM-XXXX"
                className="w-full pl-12 pr-4 py-4 rounded-xl text-white bg-white/10 border border-white/20 backdrop-blur-md placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors uppercase font-mono tracking-wider"
                required
              />
            </div>
            <button type="submit" className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] whitespace-nowrap">
              <span>Lacak Sekarang</span>
              <ArrowRight size={20} />
            </button>
          </form>
        </motion.div>
      </section>

      {/* SECTION 6: FAQ */}
      <section className="bg-transparent py-24">
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">
              Tanya Jawab
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`bg-white/5 backdrop-blur-md rounded-xl overflow-hidden transition-all duration-300 border ${isOpen ? 'border-red-500/50' : 'border-white/10'}`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none hover:bg-white/5"
                  >
                    <span className="font-bold text-gray-200 pr-4">{faq.q}</span>
                    <ChevronDown 
                      className={`text-red-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
                      size={20} 
                    />
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-gray-400 pt-2 border-t border-white/10">{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
