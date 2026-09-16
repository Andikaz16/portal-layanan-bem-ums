import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col font-sans">
      {/* Top Navigation Bar - Deep Pine / Forest Green Theme */}
      <header className="bg-navy-950 border-b border-navy-800 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 py-3">
            
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/admin/dashboard" className="flex items-center group">
                <img 
                  src="/logo-nvbar.png" 
                  alt="BEM UMS Logo" 
                  className="w-32 sm:w-44 h-auto max-h-12 object-contain group-hover:scale-105 transition-transform duration-300 brightness-0 invert" 
                />
              </Link>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/admin/dashboard"
                className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  location.pathname === '/admin/dashboard' 
                    ? 'bg-panel-800/15 text-white border border-panel-400/30' 
                    : 'text-neon-200 hover:text-white hover:bg-navy-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              <div className="h-6 w-px bg-navy-900 hidden sm:block"></div>

              <button
                onClick={() => {
                  sessionStorage.removeItem('adminToken');
                  window.location.href = '/admin/login';
                }}
                className="flex items-center px-4 py-2 rounded-full text-sm font-semibold text-neon-200 hover:text-sky-400 hover:bg-navy-900 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
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
