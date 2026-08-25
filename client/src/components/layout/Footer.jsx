import { Link } from 'react-router-dom';
import { Megaphone, Mail, MapPin, AtSign, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/lapor', label: 'Buat Laporan' },
    { to: '/lacak', label: 'Lacak Laporan' },
  ];

  return (
    <footer className="bg-black text-gray-300 border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-[600px] h-[300px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <img src="/logo-nvbar.png" alt="Logo BEM UMS" className="w-48 sm:w-64 h-auto max-h-20 object-contain origin-left -ml-2 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Kanal resmi Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta untuk menampung keluhan dan aspirasi mahasiswa secara aman, transparan, dan akuntabel.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 group"
                  >
                    <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-red-500 shrink-0" />
                <span>bem@universitas.ac.id</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <AtSign size={16} className="text-red-500 shrink-0" />
                <span>@bem_universitas</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span>Griya Mahasiswa Lt. 2, Sekretariat BEM U</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {currentYear} Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Dibuat dengan <Heart size={12} className="text-red-600 animate-pulse" /> untuk mahasiswa
          </p>
        </div>
      </div>
    </footer>
  );
}
