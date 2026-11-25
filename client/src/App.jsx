import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

// Lazy-load non-critical routes to drastically reduce initial JS payload
const TrackPage = lazy(() => import('./pages/TrackPage'));
const ReportForm = lazy(() => import('./components/ReportForm'));
const PressReleasePage = lazy(() => import('./pages/PressReleasePage'));
const PressReleaseDetail = lazy(() => import('./pages/PressReleaseDetail'));
const BreachCheckPage = lazy(() => import('./pages/BreachCheckPage'));

// Lazy-load admin layout and views
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminTicketDetail = lazy(() => import('./pages/admin/AdminTicketDetail'));
const AdminPressRelease = lazy(() => import('./pages/admin/AdminPressRelease'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8" aria-live="polite" aria-busy="true">
    <div className="w-10 h-10 border-3 border-blue-200 border-t-[#0066FF] rounded-full animate-spin mb-4" />
    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Memuat halaman...</span>
  </div>
);

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/lapor" element={<ReportForm />} />
            <Route path="/lacak" element={<TrackPage />} />
            <Route path="/lacak/:ticketCode" element={<TrackPage />} />
            <Route path="/press-release" element={<PressReleasePage />} />
            <Route path="/press-release/:slug" element={<PressReleaseDetail />} />
            <Route path="/cek-akun" element={<BreachCheckPage />} />
            <Route path="/cek-kebocoran" element={<Navigate to="/cek-akun" replace />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tickets/:id" element={<AdminTicketDetail />} />
            <Route path="press-releases" element={<AdminPressRelease />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
