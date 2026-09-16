import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Download, Trash2, AlertCircle, FileText, Clock, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, new_this_month: 0, waiting: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [ticketsRes, statsRes] = await Promise.all([
        fetch(`/api/v1/admin/tickets?t=${Date.now()}`, { headers }),
        fetch(`/api/v1/admin/statistics?t=${Date.now()}`, { headers })
      ]);
      
      if (!ticketsRes.ok) throw new Error('Gagal mengambil data tiket');
      
      const ticketsData = await ticketsRes.json();
      setTickets(ticketsData.data || []);
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = async (type = 'completed') => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`/api/v1/admin/tickets/export?type=${type}&t=${Date.now()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Gagal mengekspor data');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'all' ? 'rekap-semua-laporan-bem.csv' : 'rekap-laporan-selesai-bem.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!ticketToDelete) return;
    try {
      setDeleting(true);
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`/api/v1/admin/tickets/${ticketToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      
      // Close modal first
      setTicketToDelete(null);
      
      // Refetch all data to update both table and stats
      await fetchData();
    } catch (err) {
      alert(err.message || 'Gagal menghapus tiket');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'menunggu_verifikasi':
        return <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-amber-950 text-amber-300 border border-amber-700 shadow-sm">Menunggu</span>;
      case 'diproses':
      case 'sedang_diproses':
        return <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-blue-50 text-blue-800 border border-blue-700 shadow-sm">Diproses</span>;
      case 'tahap_audiensi':
        return <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-purple-50 text-purple-800 border border-purple-200 shadow-sm">Tahap Audiensi</span>;
      case 'selesai':
        return <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-navy-800 text-white border border-panel-600 shadow-sm">Selesai</span>;
      case 'ditolak':
        return <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-red-50 text-red-700 border border-red-200 shadow-sm">Ditolak</span>;
      default:
        return <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-panel-800 text-sky-200 border border-panel-600 shadow-sm">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center text-center gap-2 mb-8 mt-2">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
          Ringkasan Layanan Advokasi
        </h1>
        <p className="text-sm sm:text-base text-sky-200 font-medium max-w-2xl">
          Pantau seluruh aspirasi dan keluhan mahasiswa secara real-time
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-navy-800 overflow-hidden rounded-3xl shadow-neon hover:shadow-neon-md hover:-translate-y-1 transition-all duration-300 border border-panel-600 group">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-panel-800 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm border border-panel-600">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-bold text-sky-400 uppercase tracking-wider">Total Tiket</dt>
                  <dd className="text-2xl font-black text-white mt-1 flex items-baseline">
                    {stats.total}
                    <span className="ml-2 text-xs font-medium text-sky-400">Semua Waktu</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-navy-800 overflow-hidden rounded-3xl shadow-neon hover:shadow-neon-md hover:-translate-y-1 transition-all duration-300 border border-panel-600 group">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-sky-800 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm border border-sky-700">
                  <CheckCircle className="w-6 h-6 text-neon-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-bold text-sky-400 uppercase tracking-wider">Tiket Baru</dt>
                  <dd className="text-2xl font-black text-white mt-1 flex items-baseline">
                    {stats.new_this_month}
                    <span className="ml-2 text-xs font-medium text-sky-400">Bulan Ini</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-navy-800 overflow-hidden rounded-3xl shadow-neon hover:shadow-neon-md hover:-translate-y-1 transition-all duration-300 border border-panel-600 group">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-amber-900/40 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm border border-amber-700">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs font-bold text-sky-400 uppercase tracking-wider">Menunggu</dt>
                  <dd className="text-2xl font-black text-white mt-1 flex items-baseline">
                    {stats.waiting}
                    <span className="ml-2 text-xs font-medium text-sky-400">Verifikasi</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
          {error}
        </div>
      )}

      {/* Table Section */}
      {!loading && !error && (
      <div className="bg-navy-800 shadow-neon rounded-3xl border border-panel-600 overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-panel-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-800/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-white0" />
            Daftar Tiket Laporan
          </h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-sky-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border border-panel-600 rounded-full leading-5 bg-navy-800 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-neon-500/20 focus:border-neon-500 sm:text-sm transition-all"
                placeholder="Cari kode tiket..."
              />
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleExport('completed')} className="inline-flex items-center px-4 py-2 shadow-sm text-xs font-bold rounded-full text-white bg-neon-600 hover:bg-neon-700 focus:outline-none transition-all group">
                <Download className="h-3.5 w-3.5 mr-1.5 group-hover:-translate-y-0.5 transition-transform" />
                Rekap Selesai
              </button>
              <button onClick={() => handleExport('all')} className="btn-primary px-4 py-2 text-xs">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Rekap Semua
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-panel-800">
            <thead className="bg-navy-900/60">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Kode Tiket
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Pengirim
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Subjek / Kategori
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Tanggal
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3.5">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-navy-800 divide-y divide-panel-800">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-sky-400">
                    Belum ada tiket yang masuk.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr 
                    key={ticket.id || ticket.ticket_code} 
                    className="hover:bg-navy-800/80 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold font-mono text-neon-600">{ticket.ticket_code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white font-semibold">{ticket.student_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{ticket.subject}</div>
                      <div className="text-xs text-sky-300">{ticket.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-sky-300 font-medium">
                      {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="text-white bg-navy-800 hover:bg-panel-800 p-1.5 px-2.5 rounded-xl border border-panel-600 flex items-center transition-all text-xs font-bold"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/tickets/${ticket.id}`);
                          }}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>Detail</span>
                        </button>
                        <button 
                          className="text-sky-400 hover:text-red-600 bg-navy-800 hover:bg-red-50 p-1.5 rounded-xl border border-panel-600 hover:border-red-200 transition-all"
                          title="Hapus Tiket"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTicketToDelete(ticket);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Delete Confirmation Modal */}
      {ticketToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setTicketToDelete(null)}>
              <div className="absolute inset-0 bg-navy-950 opacity-50"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-navy-800 rounded-3xl text-left overflow-hidden shadow-neon-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-panel-600">
              <div className="bg-navy-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-2xl bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-bold text-white">Hapus Tiket</h3>
                    <div className="mt-2">
                      <p className="text-sm text-sky-300">
                        Apakah Anda yakin ingin menghapus tiket <strong>{ticketToDelete.ticket_code}</strong>? Aksi ini permanen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-navy-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-panel-800">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="w-full inline-flex justify-center rounded-full shadow-sm px-5 py-2.5 bg-red-600 text-sm font-bold text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto disabled:opacity-50"
                >
                  {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setTicketToDelete(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-full border border-panel-600 shadow-sm px-5 py-2.5 bg-navy-800 text-sm font-semibold text-sky-200 hover:bg-navy-900 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto disabled:opacity-50"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
