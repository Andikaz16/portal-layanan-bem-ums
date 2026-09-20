import { Link } from 'react-router-dom';
import { Mail, MapPin, AtSign, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/lapor', label: 'Buat Laporan' },
    { to: '/lacak', label: 'Lacak Laporan' },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#0052FF] to-[#003db3] text-white border-t border-blue-400/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <img 
                src="/logo-nvbar.png" 
                alt="Logo BEM UMS" 
                className="w-48 sm:w-60 h-auto max-h-16 object-contain origin-left -ml-2 filter brightness-0 invert drop-shadow-sm" 
              />
            </div>
            <p className="text-sm text-white/85 leading-relaxed max-w-xs">
              Kanal resmi Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta untuk menampung keluhan dan aspirasi mahasiswa secara aman, transparan, dan akuntabel.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest text-sky-200">Navigasi</h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/85 hover:text-white transition-colors flex items-center gap-2 group font-medium"
                  >
                    <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform text-sky-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest text-sky-200">Hubungi Kami</h4>
            <ul className="space-y-3.5">
              <li className="flex items-center gap-3 text-sm text-white/85">
                <Mail size={16} className="text-sky-200 shrink-0" />
                <span>bem@universitas.ac.id</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/85">
                <AtSign size={16} className="text-sky-200 shrink-0" />
                <span>@bem_universitas</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/85">
                <MapPin size={16} className="text-sky-200 shrink-0 mt-0.5" />
                <span>Griya Mahasiswa Lt. 2, Sekretariat BEM U</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/15 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/70">
            © {currentYear} Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta
          </p>
          <p className="text-xs text-white/70 flex items-center gap-1.5">
            Dibuat dengan <Heart size={13} className="text-red-400 fill-red-400" /> untuk mahasiswa
          </p>
        </div>
      </div>
    </footer>
  );
}
