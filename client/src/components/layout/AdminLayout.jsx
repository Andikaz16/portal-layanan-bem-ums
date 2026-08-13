import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-black flex flex-col">
      {/* Top Navigation Bar - Dark Theme (Red/Black/White) */}
      <header className="bg-zinc-950 border-b-[3px] border-red-600 shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/admin/dashboard" className="flex items-center group">
                <img 
                  src="/logo-bem.png" 
                  alt="BEM UMS Logo" 
                  className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md" 
                />
              </Link>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-2 sm:space-x-6">
              <Link
                to="/admin/dashboard"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/admin/dashboard' 
                    ? 'text-white' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              <div className="h-6 w-px bg-zinc-800 hidden sm:block"></div>

              <button
                onClick={() => {
                  sessionStorage.removeItem('adminToken');
                  window.location.href = '/admin/login';
                }}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}
