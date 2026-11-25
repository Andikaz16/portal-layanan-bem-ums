import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileEdit, Search, Menu, X, ShieldCheck, Newspaper } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  // Detect scroll for glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Beranda', icon: Home },
    { to: '/lapor', label: 'Buat Laporan', icon: FileEdit },
    { to: '/lacak', label: 'Lacak Laporan', icon: Search },
    { to: '/press-release', label: 'Press Release', icon: Newspaper },
    { to: '/cek-akun', label: 'Cek Akun', icon: ShieldCheck },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent
        ? 'bg-transparent border-b border-white/10'
        : 'bg-white/85 backdrop-blur-xl shadow-sm border-b border-slate-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link to="/" aria-label="Beranda Portal Layanan BEM UMS" className="flex items-center gap-2.5 group">
            <picture className="flex items-center">
              <source srcSet="/logo-nvbar.webp" type="image/webp" />
              <img 
                src="/logo-nvbar.png" 
                alt="Logo BEM UMS" 
                width="176"
                height="48"
                fetchPriority="high"
                className={`w-32 sm:w-44 h-auto max-h-12 object-contain group-hover:scale-105 transition-all duration-300 origin-left ${
                  isTransparent 
                    ? 'filter brightness-0 invert drop-shadow-sm' 
                    : 'filter brightness-0 opacity-90 group-hover:opacity-100'
                }`} 
              />
            </picture>
          </Link>

          {/* Desktop Nav */}
          <div className={`hidden md:flex items-center gap-1.5 p-1.5 rounded-full transition-all duration-300 ${
            isTransparent
              ? 'bg-white/15 backdrop-blur-md border border-white/25 shadow-inner'
              : 'bg-slate-100/90 border border-slate-200/80 shadow-inner'
          }`}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive(link.to)
                      ? isTransparent
                        ? 'bg-white text-[#0066FF] shadow-sm font-bold'
                        : 'bg-white text-[#0066FF] shadow-sm font-bold border border-slate-200/60'
                      : isTransparent
                        ? 'text-white/90 hover:text-white hover:bg-white/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon 
                    size={16} 
                    className={
                      isActive(link.to) 
                        ? 'text-[#0066FF]' 
                        : isTransparent 
                          ? 'text-white/80' 
                          : 'text-slate-400'
                    } 
                  />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link 
              to="/lapor" 
              className={`text-sm py-2.5 px-5 font-bold rounded-full transition-all duration-300 flex items-center gap-2 ${
                isTransparent
                  ? 'bg-white text-[#0066FF] hover:bg-blue-50 shadow-md shadow-blue-900/20'
                  : 'bg-[#0066FF] text-white hover:bg-[#0052FF] shadow-md shadow-blue-500/20'
              }`}
            >
              <FileEdit size={16} />
              Lapor Sekarang
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-2xl transition-colors ${
              isTransparent
                ? 'text-white hover:bg-white/15'
                : 'text-slate-800 hover:bg-slate-100'
            }`}
            aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        id="mobile-navigation-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`px-4 py-4 space-y-1.5 shadow-xl backdrop-blur-xl border-t transition-colors duration-300 ${
          isTransparent
            ? 'bg-[#0052FF]/98 border-white/15'
            : 'bg-white/98 border-slate-200'
        }`}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive(link.to)
                    ? isTransparent
                      ? 'bg-white text-[#0066FF] font-bold shadow-sm'
                      : 'bg-blue-50 text-[#0066FF] font-bold shadow-xs border border-blue-100'
                    : isTransparent
                      ? 'text-white/90 hover:bg-white/15'
                      : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon 
                  size={18} 
                  className={
                    isActive(link.to) 
                      ? 'text-[#0066FF]' 
                      : isTransparent 
                        ? 'text-white/80' 
                        : 'text-slate-400'
                  } 
                />
                {link.label}
              </Link>
            );
          })}
          <div className={`pt-2 border-t ${isTransparent ? 'border-white/15' : 'border-slate-200'}`}>
            <Link 
              to="/lapor" 
              className={`w-full text-sm py-2.5 mt-1 font-bold rounded-full shadow-md flex items-center justify-center gap-2 transition-all duration-300 ${
                isTransparent
                  ? 'bg-white text-[#0066FF] hover:bg-blue-50'
                  : 'bg-[#0066FF] text-white hover:bg-[#0052FF]'
              }`}
            >
              <FileEdit size={16} />
              Lapor Sekarang
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
