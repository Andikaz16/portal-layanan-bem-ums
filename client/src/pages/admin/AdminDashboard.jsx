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

  const handleExport = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`/api/v1/admin/tickets/export?t=${Date.now()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Gagal mengekspor data');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rekap-laporan-bem.csv';
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
        return <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-orange-100 text-orange-700 border border-orange-200 shadow-sm">Menunggu</span>;
      case 'diproses':
        return <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">Diproses</span>;
      case 'selesai':
        return <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200 shadow-sm">Selesai</span>;
      case 'ditolak':
        return <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200 shadow-sm">Ditolak</span>;
      default:
        return <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200 shadow-sm">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center text-center gap-2 mb-12 mt-8">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.15em] text-white drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
          Ringkasan Layanan Advokasi
        </h1>
        <p className="text-base text-red-100 font-medium max-w-2xl mt-3 tracking-wide">
          Pantau seluruh aspirasi dan keluhan mahasiswa secara real-time
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-red-50">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-500 truncate uppercase tracking-wider">Total Tiket</dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1 flex items-baseline">
                    {stats.total}
                    <span className="ml-2 text-xs font-medium text-gray-400">Semua Waktu</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-50">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-500 truncate uppercase tracking-wider">Tiket Baru</dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1 flex items-baseline">
                    {stats.new_this_month}
                    <span className="ml-2 text-xs font-medium text-gray-400">Bulan Ini</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-orange-50">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-500 truncate uppercase tracking-wider">Menunggu</dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1 flex items-baseline">
                    {stats.waiting}
                    <span className="ml-2 text-xs font-medium text-gray-400">Verifikasi</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Table Section */}
      {!loading && !error && (
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            Daftar Tiket Laporan
          </h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 sm:text-sm transition-all"
                placeholder="Cari kode tiket..."
              />
            </div>
            <div className="flex space-x-2">
              <button className="inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                Filter
              </button>
              <button onClick={handleExport} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all group">
                <Download className="h-4 w-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                Unduh Rekap
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kode Tiket
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengirim
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subjek / Kategori
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Belum ada tiket yang masuk.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr 
                    key={ticket.id || ticket.ticket_code} 
                    className="hover:bg-red-50/40 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-red-700">{ticket.ticket_code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{ticket.student_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{ticket.subject}</div>
                      <div className="text-sm text-gray-500">{ticket.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          className="text-gray-400 hover:text-red-700 bg-white hover:bg-red-50 p-1.5 rounded-lg border border-transparent hover:border-red-100 flex items-center transition-all shadow-sm group-hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/tickets/${ticket.id}`);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          <span className="ml-1.5 font-semibold">Detail</span>
                        </button>
                        <button 
                          className="text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 p-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all shadow-sm"
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
              <div className="absolute inset-0 bg-black opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Hapus Tiket</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Apakah Anda yakin ingin menghapus tiket <strong>{ticketToDelete.ticket_code}</strong>? Aksi ini permanen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setTicketToDelete(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
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
