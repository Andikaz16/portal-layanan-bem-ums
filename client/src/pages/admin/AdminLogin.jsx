import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem('adminToken', data.data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login gagal. Periksa kembali username dan password.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan. Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Soft Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-sage-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-terracotta-100/40 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-warm-lg border border-cream-300 relative z-10">
        
        <div className="flex flex-col items-center">
          <img src="/logo-nvbar.png" alt="Logo BEM" className="w-40 sm:w-52 h-auto max-h-16 mb-4 object-contain filter brightness-0 opacity-90" />
          <h2 className="mt-2 text-center text-3xl font-black text-forest-900 uppercase tracking-wider">
            Admin <span className="text-terracotta-500">Login</span>
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-charcoal-500">
            Portal Layanan BEM UMS
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm" role="alert">
            <span className="block">{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                className="appearance-none rounded-2xl relative block w-full px-4 py-3.5 bg-cream-100 border border-cream-400 placeholder-charcoal-400 text-forest-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/25 focus:border-terracotta-500 transition-colors sm:text-sm"
                placeholder="Masukkan username admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                className="appearance-none rounded-2xl relative block w-full px-4 py-3.5 bg-cream-100 border border-cream-400 placeholder-charcoal-400 text-forest-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/25 focus:border-terracotta-500 transition-colors sm:text-sm"
                placeholder="Masukkan password admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-sm"
            >
              {isLoading ? 'Sedang Masuk...' : 'Masuk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
