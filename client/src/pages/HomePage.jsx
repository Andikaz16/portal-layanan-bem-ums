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
  ChevronDown,
  ShieldAlert,
  ShieldCheck,
  Mail,
  KeyRound,
  Database,
  Cpu
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
    <div className="flex flex-col min-h-screen font-sans bg-[#F8FAFC] text-slate-800 relative">
      
      {/* SECTION 1: HERO */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden bg-gradient-to-b from-[#0052FF] via-[#0070FF] to-[#00A6FF]">
        {/* Subtle Blueprint Grid & Contour Ripple Overlay */}
        <div className="absolute inset-0 pointer-events-none -z-0">
          {/* Blueprint Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          {/* Top Right Topographic / Contour Circles Motif */}
          <svg className="absolute -top-12 -right-12 w-[420px] h-[420px] text-white/15 stroke-current fill-none pointer-events-none" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="25" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="45" strokeWidth="1" />
            <circle cx="100" cy="100" r="65" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="85" strokeWidth="1" />
            <circle cx="100" cy="100" r="105" strokeWidth="1" strokeDasharray="5 5" />
            <circle cx="100" cy="100" r="125" strokeWidth="1" />
          </svg>

          {/* Concentric Water Waves on Mid-Screen */}
          <svg className="absolute -bottom-20 -left-20 w-[350px] h-[350px] text-white/10 stroke-current fill-none pointer-events-none" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="30" strokeWidth="1" />
            <circle cx="100" cy="100" r="60" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="90" strokeWidth="1" />
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left mt-6 lg:mt-0 lg:ml-8 xl:ml-16 max-w-3xl z-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full text-xs sm:text-sm font-bold mb-6 shadow-sm">
                <Megaphone size={15} className="text-white" />
                <span>Layanan Resmi BEM UMS</span>
              </div>
              
              <h1 className="text-6xl sm:text-7xl lg:text-7xl xl:text-8xl font-black text-white italic tracking-tight uppercase mb-6 leading-none drop-shadow-md">
                LAPOR<br/>
                <span className="text-white">PRES!!</span>
              </h1>
              
              <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-white/95 mb-8 leading-relaxed font-normal drop-shadow-sm">
                Kanal resmi Badan Eksekutif Mahasiswa untuk menampung keluhan dan aspirasi mahasiswa. Laporanmu aman, terlacak, dan ditindaklanjuti.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/lapor" className="btn-primary w-full sm:w-auto text-base py-3.5 px-8 flex items-center justify-center gap-2.5 bg-white text-[#0066FF] hover:bg-blue-50 font-bold rounded-full shadow-lg shadow-blue-900/20 border-none">
                  <FileEdit size={18} />
                  Buat Laporan
                </Link>
                <Link to="/lacak" className="btn-secondary w-full sm:w-auto text-base py-3.5 px-8 flex items-center justify-center gap-2.5 bg-white/15 backdrop-blur-md text-white hover:bg-white/25 border border-white/40 font-bold rounded-full">
                  <Search size={18} />
                  Lacak Laporan
                </Link>
              </div>
            </div>

            {/* Right Decorative Graphic with Abstract Organic Container */}
            <div className="hidden lg:flex lg:flex-1 justify-center items-center relative z-10 min-h-[400px]">
              {/* Multi-layered Abstract Blob Backgrounds */}
              <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
                <div className="absolute w-[450px] h-[450px] bg-white/15 filter blur-2xl rounded-full"></div>
              </div>

              {/* Raw Transparent Logo LAPOR PRES floating on the abstract background */}
              <div className="relative animate-fade-in group z-10">
                <img 
                  src="/logo-lapor-pres.png" 
                  alt="Logo LAPOR PRES" 
                  className="w-72 xl:w-[420px] h-auto object-contain filter brightness-0 invert opacity-95 drop-shadow-[0_10px_25px_rgba(0,0,0,0.15)] group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500 ease-out" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Smooth Organic Fluid Wave Transition to Next Section */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 pointer-events-none">
          <svg className="relative block w-full h-8 text-[#F8FAFC] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C300,60 600,0 900,45 C1050,65 1150,30 1200,20 L1200,120 L0,120 Z" />
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
            <div className="bg-white border border-sky-100 rounded-3xl p-6 flex flex-col items-start shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <TrendingUp size={22} />
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">500+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Laporan Diterima</div>
            </div>
            
            <div className="bg-white border border-sky-100 rounded-3xl p-6 flex flex-col items-start shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <CheckCircle size={22} />
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">430+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Laporan Selesai</div>
            </div>
            
            <div className="bg-white border border-sky-100 rounded-3xl p-6 flex flex-col items-start shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Clock size={22} />
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">3 Hari</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Rata-rata Respon</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: ABOUT / VALUE PROPOSITION */}
      <section className="py-20 relative overflow-hidden bg-slate-50">
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 text-[#0066FF] rounded-full text-xs font-bold mb-4 shadow-sm">
              <Info size={14} className="text-[#0066FF]" />
              <span>Tentang Portal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4">
              Apa Itu Layanan BEM UMS?
            </h2>
            <p className="max-w-2xl mx-auto text-base text-slate-600">
              Layanan BEM UMS adalah kanal resmi BEM yang menghubungkan suara mahasiswa dengan kebijakan kampus. Setiap laporan ditangani secara profesional dan transparan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white border border-sky-100 rounded-3xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center mb-5">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aman & Anonim</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Identitas Anda terlindungi. Opsi pelaporan anonim tersedia agar Anda dapat melapor tanpa rasa khawatir.
              </p>
            </div>

            <div className="bg-white border border-sky-100 rounded-3xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center mb-5">
                <Eye size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Transparan & Terlacak</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pantau progres laporan Anda secara real-time menggunakan kode tiket unik.
              </p>
            </div>

            <div className="bg-white border border-sky-100 rounded-3xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center mb-5">
                <Handshake size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ditindaklanjuti</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Setiap laporan diproses hingga ke tahap audiensi dengan pihak kampus untuk mencapai resolusi.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="py-20 relative bg-white border-y border-slate-100">
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 text-[#0066FF] rounded-full text-xs font-bold mb-4 shadow-sm">
              <Workflow size={14} className="text-[#0066FF]" />
              <span>Cara Kerja</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight mb-3">
              Bagaimana Cara Kerjanya?
            </h2>
            <p className="max-w-2xl mx-auto text-base text-slate-500">
              Empat langkah sederhana untuk menyuarakan aspirasimu
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-[2px]">
              <div className="w-full h-full border-t-2 border-dashed border-sky-300"></div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-[#0066FF] text-white font-bold text-lg flex items-center justify-center mb-5 shadow-md shadow-blue-500/30 group-hover:scale-105 transition-all">
                  01
                </div>
                <FileEdit className="text-[#0066FF] mb-2" size={24} />
                <h3 className="text-base font-bold text-slate-900 mb-1">Isi Formulir</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Sampaikan keluhan melalui form pelaporan yang mudah digunakan</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-[#0066FF] text-white font-bold text-lg flex items-center justify-center mb-5 shadow-md shadow-blue-500/30 group-hover:scale-105 transition-all">
                  02
                </div>
                <Ticket className="text-[#0066FF] mb-2" size={24} />
                <h3 className="text-base font-bold text-slate-900 mb-1">Dapatkan Kode Tiket</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Kode unik BEM-XXXX dikirim ke email Anda untuk melacak status laporan</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-[#0066FF] text-white font-bold text-lg flex items-center justify-center mb-5 shadow-md shadow-blue-500/30 group-hover:scale-105 transition-all">
                  03
                </div>
                <Settings className="text-[#0066FF] mb-2" size={24} />
                <h3 className="text-base font-bold text-slate-900 mb-1">Tim BEM Bergerak</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Laporan diverifikasi, diproses, dan dikawal oleh kementerian</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-[#0066FF] text-white font-bold text-lg flex items-center justify-center mb-5 shadow-md shadow-blue-500/30 group-hover:scale-105 transition-all">
                  04
                </div>
                <CheckCircle2 className="text-[#0066FF] mb-2" size={24} />
                <h3 className="text-base font-bold text-slate-900 mb-1">Masalah Selesai</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Resolusi dicapai melalui audiensi dengan pihak kampus</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION: CYBER FORENSIC & BREACH CHECKER */}
      <section className="py-20 relative bg-slate-50 border-b border-sky-100">
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 text-[#0066FF] rounded-full text-xs font-bold mb-4 shadow-sm">
              <ShieldAlert size={14} className="text-[#0066FF]" />
              <span>Proteksi & Bantuan Siber Mahasiswa</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4">
              Akun Medsos Kena Hack? <span className="text-[#0066FF]">Cek Sumber Kebocorannya</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Lebih dari 80% peretasan akun terjadi karena kata sandi pernah bocor di database publik. Temukan akar masalahnya dan selamatkan akun Anda sebelum terjadi pemerasan.
            </p>
          </div>

          {/* 4-Step Forensic Workflow Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {/* Step 1 */}
            <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Mail size={22} />
              </div>
              <div className="text-[11px] font-bold text-[#0066FF] uppercase tracking-wider mb-1">Tahap 01</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Input Identitas Akun</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Masukkan alamat email yang terhubung dengan akun media sosial Anda yang dicurigai dibobol.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Database size={22} />
              </div>
              <div className="text-[11px] font-bold text-[#0066FF] uppercase tracking-wider mb-1">Tahap 02</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Audit Intelijen Siber</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sistem mencocokkan kredensial secara real-time dengan ribuan riwayat insiden kebocoran data terverifikasi.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <KeyRound size={22} />
              </div>
              <div className="text-[11px] font-bold text-[#0066FF] uppercase tracking-wider mb-1">Tahap 03</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Analisis Akar Masalah</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mengetahui platform mana yang membocorkan kata sandi, nomor HP, atau data pribadi yang dimanfaatkan peretas.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck size={22} />
              </div>
              <div className="text-[11px] font-bold text-[#0066FF] uppercase tracking-wider mb-1">Tahap 04</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Langkah Penyelamatan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mendapatkan panduan terarah untuk mengamankan email induk, memutus sesi hacker, dan merebut kembali akun.
              </p>
            </div>
          </div>

          {/* Action CTA Box */}
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 border border-sky-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ingin Memeriksa Keamanan Akun Anda Sekarang?</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-xl mx-auto">
              Layanan ini gratis untuk seluruh mahasiswa. Tidak ada kata sandi yang diminta atau disimpan oleh sistem.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/cek-akun" 
                className="btn-primary py-3.5 px-8 flex items-center justify-center gap-2 text-sm font-bold bg-[#0066FF] hover:bg-blue-600 text-white rounded-full shadow-md shadow-blue-500/20"
              >
                <Search size={16} />
                <span>Pindai Akun Saya Sekarang</span>
              </Link>
              <Link 
                to="/lapor" 
                className="btn-secondary py-3.5 px-8 flex items-center justify-center gap-2 text-sm font-bold bg-white text-[#0066FF] hover:bg-blue-50 border border-blue-200 rounded-full shadow-sm"
              >
                <FileEdit size={16} />
                <span>Lapor Ancaman / Pemerasan</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 4: CATEGORIES */}
      <section className="py-20 relative overflow-hidden bg-white">
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight mb-3">
              Kategori Pengaduan
            </h2>
            <p className="max-w-2xl mx-auto text-base text-slate-600">
              Pilih kategori yang sesuai dengan permasalahan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories.map((cat, idx) => (
              <Link 
                to="/lapor" 
                key={idx} 
                className="bg-gradient-to-br from-[#0062FF] to-[#00A3FF] text-white rounded-3xl p-6 flex flex-col shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <cat.icon size={22} />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{cat.name}</h3>
                <p className="text-white/85 text-xs leading-relaxed">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 5: QUICK TRACK */}
      <section className="py-16 relative bg-slate-50 border-t border-slate-100">
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-sky-100/80 via-blue-50/90 to-sky-100/80 border border-sky-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">
              Lacak Laporan Anda
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-xl mx-auto">
              Masukkan kode tiket untuk melihat perkembangan laporan Anda secara real-time
            </p>

            <form onSubmit={handleTrackSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#0066FF] z-10">
                  <Ticket size={20} />
                </div>
                <input
                  type="text"
                  value={trackCode}
                  onChange={(e) => setTrackCode(e.target.value)}
                  placeholder="BEM-XXXX"
                  className="w-full pl-12 pr-4 py-3.5 rounded-full text-slate-900 bg-white border border-sky-200 placeholder-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all uppercase font-mono tracking-wider text-sm shadow-sm"
                  required
                />
              </div>
              <button type="submit" className="btn-primary py-3.5 px-8 text-sm whitespace-nowrap bg-[#0066FF] text-white hover:bg-blue-600 rounded-full font-bold shadow-md shadow-blue-500/20">
                <span>Lacak Sekarang</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </motion.div>
      </section>

      {/* SECTION 6: FAQ */}
      <section className="py-20 bg-white border-t border-slate-100">
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight mb-3">
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
                    isOpen ? 'border-[#0066FF] bg-blue-50/30 shadow-md' : 'border-sky-100 hover:border-sky-300'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none"
                  >
                    <span className="font-bold text-slate-900 text-sm sm:text-base pr-4">{faq.q}</span>
                    <ChevronDown 
                      className={`text-[#0066FF] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
                      size={18} 
                    />
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-slate-600 text-sm leading-relaxed pt-2 border-t border-sky-100">{faq.a}</p>
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
