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
      a: "Setelah mengirim laporan, kode tiket unik (contoh: BEM-X9A2) akan dikirimkan ke email yang Anda daftarkan saat melapor (harap cek folder Spam/Junk jika tidak ada). Anda juga akan menerima pemberitahuan melalui email setiap kali ada perkembangan atau tindak lanjut dari tim BEM. Selain itu, Anda dapat menggunakan kode tiket tersebut di halaman 'Lacak Laporan' untuk melihat status terkini secara langsung."
    },
    {
      q: "Apakah saya bisa melapor lebih dari satu kali?",
      a: "Ya, Anda dapat mengirimkan laporan sebanyak yang diperlukan untuk kategori yang berbeda. Setiap laporan akan mendapatkan kode tiket tersendiri dan diproses secara independen."
    },
    {
      q: "Apa yang terjadi setelah saya melapor?",
      a: "Laporan Anda akan melewati 4 tahap: Menunggu Verifikasi → Sedang Diproses → Tahap Audiensi → Selesai. Tim kementerian akan memverifikasi laporan, melakukan investigasi, dan mengawal proses audiensi dengan pihak kampus terkait. Setiap perubahan status akan diberitahukan melalui email Anda."
    },
    {
      q: "Mengapa harus mengisi email yang benar saat melapor?",
      a: "Email digunakan untuk mengirimkan kode tiket laporan dan pemberitahuan setiap ada perkembangan atau tindak lanjut terhadap laporan Anda. Pastikan menggunakan email aktif agar Anda tidak kehilangan informasi penting terkait laporan."
    },
    {
      q: "Siapa yang mengelola portal ini?",
      a: "Layanan BEM UMS dikelola oleh Pengurus Badan Eksekutif Mahasiswa (BEM) Universitas Muhammadiyah Surakarta."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-canvas text-charcoal-900 relative">
      
      {/* SECTION 1: HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-20 overflow-hidden">
        {/* Soft Organic Ambient Blobs & Sage Asymmetric Backdrop */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          {/* Organic Ambient Glows */}
          <div className="absolute top-12 right-[10%] w-[450px] h-[450px] bg-sage-300/30 rounded-full blur-[110px]"></div>
          <div className="absolute bottom-12 left-[5%] w-[400px] h-[400px] bg-terracotta-100/60 rounded-full blur-[90px]"></div>
          
          {/* Subtle Organic Curved Motif Lines */}
          <svg className="absolute top-1/4 right-[2%] w-96 h-96 text-sage-400/20 stroke-current fill-none pointer-events-none" viewBox="0 0 200 200">
            <path d="M 20,100 C 40,20 160,20 180,100 C 160,180 40,180 20,100 Z" strokeWidth="1" />
            <path d="M 40,100 C 55,40 145,40 160,100 C 145,160 55,160 40,100 Z" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 60,100 C 70,60 130,60 140,100 C 130,140 70,140 60,100 Z" strokeWidth="1" />
          </svg>

          {/* Organic Leaf / Botanical Line Art Accent */}
          <svg className="absolute bottom-8 right-[38%] w-32 h-32 text-forest-800/10 stroke-current fill-none pointer-events-none hidden lg:block" viewBox="0 0 100 100">
            <path d="M 50,90 Q 50,45 85,25 Q 55,35 50,90 Z" strokeWidth="1.5" />
            <path d="M 50,90 Q 45,55 20,40 Q 42,50 50,90 Z" strokeWidth="1.5" />
            <path d="M 50,90 L 50,15" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left mt-6 lg:mt-0 lg:ml-8 xl:ml-16 max-w-3xl z-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sage-100 border border-sage-200 text-forest-900 rounded-full text-xs sm:text-sm font-bold mb-6 shadow-sm">
                <Megaphone size={15} className="text-forest-800" />
                <span>Layanan Resmi BEM UMS</span>
              </div>
              
              <h1 className="text-6xl sm:text-7xl lg:text-7xl xl:text-8xl font-black text-forest-900 italic tracking-tight uppercase mb-6 leading-none">
                LAPOR<br/>
                <span className="text-terracotta-500">PRES!!</span>
              </h1>
              
              <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-charcoal-600 mb-8 leading-relaxed font-normal">
                Kanal resmi Badan Eksekutif Mahasiswa untuk menampung keluhan dan aspirasi mahasiswa. Laporanmu aman, terlacak, dan ditindaklanjuti.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/lapor" className="btn-primary w-full sm:w-auto text-base py-3.5 px-8 flex items-center justify-center gap-2.5">
                  <FileEdit size={18} />
                  Buat Laporan
                </Link>
                <Link to="/lacak" className="btn-secondary w-full sm:w-auto text-base py-3.5 px-8 flex items-center justify-center gap-2.5">
                  <Search size={18} />
                  Lacak Laporan
                </Link>
              </div>
            </div>

            {/* Right Decorative Graphic with Abstract Organic Container */}
            <div className="hidden lg:flex lg:flex-1 justify-center items-center relative z-10 min-h-[400px]">
              
              {/* Multi-layered Abstract Blob Backgrounds */}
              <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
                {/* Blob 1 - Light Sage */}
                <div className="absolute w-[500px] h-[500px] bg-sage-200/60 mix-blend-multiply filter blur-2xl opacity-70 animate-[pulse_8s_ease-in-out_infinite] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] transform translate-x-10"></div>
                
                {/* Blob 2 - Soft Terracotta */}
                <div className="absolute w-[400px] h-[400px] bg-terracotta-100/50 mix-blend-multiply filter blur-2xl opacity-60 animate-[pulse_10s_ease-in-out_infinite_reverse] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] transform -translate-x-10 translate-y-10"></div>
                
                {/* Blob 3 - Cream Accent */}
                <div className="absolute w-[350px] h-[350px] bg-cream-300/50 mix-blend-multiply filter blur-xl opacity-80 animate-[pulse_12s_ease-in-out_infinite] rounded-[50%_50%_20%_80%/25%_80%_20%_75%] transform -translate-y-12"></div>
                
                {/* Sharp Vector Abstract Element (Fluid Shape SVG) */}
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute w-[450px] h-[450px] text-sage-300/40 fill-current transform rotate-12 transition-transform duration-1000 ease-in-out hover:rotate-45">
                  <path d="M47.7,-57.2C59.4,-45.3,64.8,-27.1,65.8,-9.6C66.8,7.9,63.5,24.8,53.4,37.3C43.3,49.8,26.4,57.9,8.5,59.8C-9.4,61.7,-28.4,57.5,-42.6,46.1C-56.8,34.7,-66.2,16,-66.5,-2.5C-66.8,-21,-58,-39.3,-43.8,-51.7C-29.6,-64.1,-10,-70.6,4.6,-76C19.2,-81.4,36,-69.1,47.7,-57.2Z" transform="translate(100 100)" />
                </svg>
              </div>

              {/* Raw Transparent Logo LAPOR PRES floating on the abstract background */}
              <div className="relative animate-fade-in group z-10">
                <img 
                  src="/logo-lapor-pres.png" 
                  alt="Logo LAPOR PRES" 
                  className="w-72 xl:w-[420px] h-auto object-contain filter brightness-0 opacity-90 drop-shadow-[0_10px_25px_rgba(32,54,43,0.15)] group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500 ease-out" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Smooth Organic Fluid Wave Transition to Next Section */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 pointer-events-none">
          <svg className="relative block w-full h-8 text-canvas fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C300,60 600,0 900,45 C1050,65 1150,30 1200,20 L1200,120 L0,120 Z" opacity="0.4" />
          </svg>
        </div>
      </section>

      {/* SECTION 1.5: STATS BENTO CARDS */}
      <section className="py-8 relative z-10">
        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white border border-cream-300 rounded-3xl p-6 flex flex-col items-start shadow-warm hover:shadow-warm-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-sage-100 text-forest-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <TrendingUp size={22} />
              </div>
              <div className="text-3xl font-black text-forest-900 mb-1">500+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Laporan Diterima</div>
            </div>
            
            <div className="bg-white border border-cream-300 rounded-3xl p-6 flex flex-col items-start shadow-warm hover:shadow-warm-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <CheckCircle size={22} />
              </div>
              <div className="text-3xl font-black text-forest-900 mb-1">430+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Laporan Selesai</div>
            </div>
            
            <div className="bg-white border border-cream-300 rounded-3xl p-6 flex flex-col items-start shadow-warm hover:shadow-warm-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-sage-100 text-forest-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Clock size={22} />
              </div>
              <div className="text-3xl font-black text-forest-900 mb-1">3 Hari</div>
              <div className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Rata-rata Respon</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: ABOUT / VALUE PROPOSITION */}
      <section className="py-20 relative overflow-hidden">
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sage-100 border border-sage-200 text-forest-900 rounded-full text-xs font-bold mb-4 shadow-sm">
              <Info size={14} className="text-forest-800" />
              <span>Tentang Portal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-forest-900 uppercase tracking-tight mb-4">
              Apa Itu Layanan BEM UMS?
            </h2>
            <p className="max-w-2xl mx-auto text-base text-charcoal-600">
              Layanan BEM UMS adalah kanal resmi BEM yang menghubungkan suara mahasiswa dengan kebijakan kampus. Setiap laporan ditangani secara profesional dan transparan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white border border-cream-300 rounded-3xl p-8 flex flex-col items-center text-center shadow-warm hover:shadow-warm-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-sage-100 text-forest-800 flex items-center justify-center mb-5">
                <Shield size={28} />
              </div>
              <h3 className="text-lg font-bold text-forest-900 mb-2">Aman & Anonim</h3>
              <p className="text-sm text-charcoal-500 leading-relaxed">
                Identitas Anda terlindungi. Opsi anonim tersedia agar Anda bisa melapor tanpa rasa khawatir.
              </p>
            </div>
            <div className="bg-white border border-cream-300 rounded-3xl p-8 flex flex-col items-center text-center shadow-warm hover:shadow-warm-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center mb-5">
                <Eye size={28} />
              </div>
              <h3 className="text-lg font-bold text-forest-900 mb-2">Transparan & Terlacak</h3>
              <p className="text-sm text-charcoal-500 leading-relaxed">
                Pantau progres laporan Anda secara real-time menggunakan kode tiket unik.
              </p>
            </div>
            <div className="bg-white border border-cream-300 rounded-3xl p-8 flex flex-col items-center text-center shadow-warm hover:shadow-warm-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-sage-100 text-forest-800 flex items-center justify-center mb-5">
                <Handshake size={28} />
              </div>
              <h3 className="text-lg font-bold text-forest-900 mb-2">Ditindaklanjuti</h3>
              <p className="text-sm text-charcoal-500 leading-relaxed">
                Setiap laporan diproses hingga tahap audiensi dengan pihak kampus untuk mencapai resolusi.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="py-20 relative bg-cream-100/70 border-y border-cream-300">
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sage-100 border border-sage-200 text-forest-900 rounded-full text-xs font-bold mb-4 shadow-sm">
              <Workflow size={14} className="text-forest-800" />
              <span>Cara Kerja</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-forest-900 uppercase tracking-tight mb-3">
              Bagaimana Cara Kerjanya?
            </h2>
            <p className="max-w-2xl mx-auto text-base text-charcoal-600">
              Empat langkah sederhana untuk menyuarakan aspirasimu
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-[2px]">
              <div className="w-full h-full border-t-2 border-dashed border-cream-400"></div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-terracotta-500 text-white font-bold text-lg flex items-center justify-center mb-5 shadow-terracotta group-hover:scale-105 transition-transform">
                  01
                </div>
                <FileEdit className="text-terracotta-500 mb-2" size={24} />
                <h3 className="text-base font-bold text-forest-900 mb-1">Isi Formulir</h3>
                <p className="text-charcoal-500 text-xs leading-relaxed">Sampaikan keluhan melalui form pelaporan yang mudah digunakan</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-forest-800 text-white font-bold text-lg flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform">
                  02
                </div>
                <Ticket className="text-forest-800 mb-2" size={24} />
                <h3 className="text-base font-bold text-forest-900 mb-1">Dapatkan Kode Tiket</h3>
                <p className="text-charcoal-500 text-xs leading-relaxed">Kode unik BEM-XXXX dikirim ke email Anda untuk melacak status laporan</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-sage-500 text-white font-bold text-lg flex items-center justify-center mb-5 shadow-sage group-hover:scale-105 transition-transform">
                  03
                </div>
                <Settings className="text-sage-600 mb-2" size={24} />
                <h3 className="text-base font-bold text-forest-900 mb-1">Tim BEM Bergerak</h3>
                <p className="text-charcoal-500 text-xs leading-relaxed">Laporan diverifikasi, diproses, dan dikawal oleh kementerian</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-forest-900 text-white font-bold text-lg flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform">
                  04
                </div>
                <CheckCircle2 className="text-forest-900 mb-2" size={24} />
                <h3 className="text-base font-bold text-forest-900 mb-1">Masalah Selesai</h3>
                <p className="text-charcoal-500 text-xs leading-relaxed">Resolusi dicapai melalui audiensi dengan pihak kampus</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 4: CATEGORIES */}
      <section className="py-20 relative overflow-hidden">
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-forest-900 uppercase tracking-tight mb-3">
              Kategori Pengaduan
            </h2>
            <p className="max-w-2xl mx-auto text-base text-charcoal-600">
              Pilih kategori yang sesuai dengan permasalahan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories.map((cat, idx) => (
              <Link 
                to="/lapor" 
                key={idx} 
                className="bg-white border border-cream-300 rounded-3xl p-6 flex flex-col shadow-warm hover:shadow-warm-md hover:border-sage-400 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-sage-50 border border-sage-100 text-forest-800 group-hover:bg-sage-100 group-hover:text-forest-900 flex items-center justify-center mb-4 transition-colors">
                  <cat.icon size={22} />
                </div>
                <h3 className="text-base font-bold text-forest-900 mb-1.5">{cat.name}</h3>
                <p className="text-charcoal-500 text-xs leading-relaxed">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 5: QUICK TRACK */}
      <section className="py-16 relative">
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto bg-sage-100/60 border border-sage-200 rounded-3xl p-8 sm:p-12 text-center shadow-warm">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-forest-900 uppercase tracking-tight mb-2">
              Lacak Laporan Anda
            </h2>
            <p className="text-sm sm:text-base text-charcoal-600 mb-8 max-w-xl mx-auto">
              Masukkan kode tiket untuk melihat perkembangan laporan Anda secara real-time
            </p>

            <form onSubmit={handleTrackSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal-400 z-10">
                  <Ticket size={20} />
                </div>
                <input
                  type="text"
                  value={trackCode}
                  onChange={(e) => setTrackCode(e.target.value)}
                  placeholder="BEM-XXXX"
                  className="w-full pl-12 pr-4 py-3.5 rounded-full text-forest-900 bg-white border border-cream-400 placeholder-charcoal-400 focus:outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 transition-all uppercase font-mono tracking-wider text-sm"
                  required
                />
              </div>
              <button type="submit" className="btn-primary py-3.5 px-8 text-sm whitespace-nowrap">
                <span>Lacak Sekarang</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </motion.div>
      </section>

      {/* SECTION 6: FAQ */}
      <section className="py-20">
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-forest-900 uppercase tracking-tight mb-3">
              Tanya Jawab
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 border shadow-sm ${
                    isOpen ? 'border-terracotta-400 bg-cream-50/50' : 'border-cream-300 hover:border-sage-400'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none"
                  >
                    <span className="font-bold text-forest-900 text-sm sm:text-base pr-4">{faq.q}</span>
                    <ChevronDown 
                      className={`text-terracotta-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
                      size={18} 
                    />
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-charcoal-600 text-sm leading-relaxed pt-2 border-t border-cream-200">{faq.a}</p>
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
