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
        localStorage.setItem('adminToken', data.data.token);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a0505] to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/5 backdrop-blur-md p-10 rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.2)] border border-white/10 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-600/20 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col items-center relative z-10">
          <img src="/logo-bem.png" alt="Logo BEM" className="h-20 w-auto mb-2 drop-shadow-lg" />
          <h2 className="mt-2 text-center text-3xl font-black text-white uppercase tracking-wider">
            Admin <span className="text-red-500">Login</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Portal Layanan BEM UMS
          </p>
        </div>
        
        {error && (
          <div className="bg-red-950/50 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg relative text-sm z-10" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors sm:text-sm"
                placeholder="Masukkan username admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors sm:text-sm"
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
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all disabled:opacity-50"
            >
              {isLoading ? 'Sedang Masuk...' : 'Masuk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
