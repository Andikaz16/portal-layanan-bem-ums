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
    <footer className="bg-navy-950 text-sage-100 border-t border-navy-800 relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-neon-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <img 
                src="/logo-nvbar.png" 
                alt="Logo BEM UMS" 
                className="w-48 sm:w-60 h-auto max-h-16 object-contain origin-left -ml-2 brightness-0 invert" 
              />
            </div>
            <p className="text-sm text-neon-200 leading-relaxed max-w-xs">
              Kanal resmi Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta untuk menampung keluhan dan aspirasi mahasiswa secara aman, transparan, dan akuntabel.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest text-sky-400">Navigasi</h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-neon-200 hover:text-sky-400 transition-colors flex items-center gap-2 group"
                  >
                    <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform text-neon-400 group-hover:text-sky-400" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest text-sky-400">Hubungi Kami</h4>
            <ul className="space-y-3.5">
              <li className="flex items-center gap-3 text-sm text-neon-200">
                <Mail size={16} className="text-sky-400 shrink-0" />
                <span>bem@universitas.ac.id</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neon-200">
                <AtSign size={16} className="text-sky-400 shrink-0" />
                <span>@bem_universitas</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-neon-200">
                <MapPin size={16} className="text-sky-400 shrink-0 mt-0.5" />
                <span>Griya Mahasiswa Lt. 2, Sekretariat BEM U</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-navy-800 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neon-400">
            © {currentYear} Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta
          </p>
          <p className="text-xs text-neon-400 flex items-center gap-1.5">
            Dibuat dengan <Heart size={13} className="text-white0 fill-terracotta-500" /> untuk mahasiswa
          </p>
        </div>
      </div>
    </footer>
  );
}
