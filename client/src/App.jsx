import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/HomePage';
import TrackPage from './pages/TrackPage';
import ReportForm from './components/ReportForm';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTicketDetail from './pages/admin/AdminTicketDetail';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/lapor" element={<ReportForm />} />
          <Route path="/lacak" element={<TrackPage />} />
          <Route path="/lacak/:ticketCode" element={<TrackPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="tickets/:id" element={<AdminTicketDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}
