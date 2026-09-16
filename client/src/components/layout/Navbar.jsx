import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Megaphone, FileEdit, Search, Home } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-panel-800/90 backdrop-blur-xl shadow-neon border-b border-panel-600'
        : 'bg-navy-900/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img 
              src="/logo-nvbar.png" 
              alt="Logo BEM UMS" 
              className="w-32 sm:w-44 h-auto max-h-12 object-contain group-hover:scale-105 transition-transform origin-left filter brightness-0 invert opacity-90" 
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5 bg-navy-800/70 border border-panel-600/80 p-1.5 rounded-full shadow-sm">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-panel-800 text-white border border-panel-600 shadow-sm'
                      : 'text-sky-200 hover:bg-panel-800 hover:text-white'
                  }`}
                >
                  <Icon size={16} className={isActive(link.to) ? 'text-white' : 'text-sky-400'} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link to="/lapor" className="btn-primary text-sm py-2.5 px-5">
              <FileEdit size={16} />
              Lapor Sekarang
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-2xl text-sky-200 hover:bg-panel-600/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
        isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-navy-900/98 backdrop-blur-xl border-t border-panel-600 px-4 py-4 space-y-1.5 shadow-neon">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive(link.to)
                    ? 'bg-panel-800 text-white border border-panel-600'
                    : 'text-sky-200 hover:bg-panel-800'
                }`}
              >
                <Icon size={18} className={isActive(link.to) ? 'text-white' : 'text-sky-400'} />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-panel-600">
            <Link to="/lapor" className="btn-primary w-full text-sm py-2.5 mt-1">
              <FileEdit size={16} />
              Lapor Sekarang
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
