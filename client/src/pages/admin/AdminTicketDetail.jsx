import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, Clock, AlertCircle, MessageCircle } from 'lucide-react';

export default function AdminTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    fetchTicketDetail();
  }, [id]);

  const fetchTicketDetail = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/v1/admin/tickets/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Gagal mengambil data detail tiket');
      }
      const data = await response.json();
      setTicket(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/v1/admin/tickets/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Gagal memperbarui status');
      
      // Re-fetch ticket detail to get updated data including new timeline entry
      await fetchTicketDetail();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmittingReply(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/v1/admin/tickets/${id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: replyContent,
          is_internal: false
        }),
      });
      
      if (!response.ok) throw new Error('Gagal mengirim balasan');
      
      // Refresh ticket detail to get new notes
      await fetchTicketDetail();
      setReplyContent('');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReply(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'menunggu_verifikasi':
        return { label: 'Menunggu Verifikasi', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock };
      case 'sedang_diproses':
        return { label: 'Sedang Diproses', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: AlertCircle };
      case 'tahap_audiensi':
        return { label: 'Tahap Audiensi', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: MessageCircle };
      case 'selesai':
        return { label: 'Selesai', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
        {error || 'Tiket tidak ditemukan'}
        <br />
        <Link to="/admin/dashboard" className="text-red-700 font-medium hover:underline mt-2 inline-block">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const StatusIcon = getStatusConfig(ticket.status).icon;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-800/50 pb-4">
        <div className="flex items-center space-x-4">
          <Link to="/admin/dashboard" className="p-2 hover:bg-red-900/50 rounded-full transition-colors text-gray-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white drop-shadow-sm">{ticket.ticket_code}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusConfig(ticket.status).color}`}>
                <StatusIcon className="w-3.5 h-3.5 mr-1" />
                {getStatusConfig(ticket.status).label}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-300">
              Dilaporkan pada {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <label htmlFor="status-update" className="text-sm font-medium text-gray-200">Update Status:</label>
          <select
            id="status-update"
            value={ticket.status}
            onChange={handleStatusChange}
            disabled={updating}
            className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md bg-white text-gray-900 shadow-sm border disabled:opacity-50"
          >
            <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
            <option value="sedang_diproses">Sedang Diproses</option>
            <option value="tahap_audiensi">Tahap Audiensi</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Ticket Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900">{ticket.subject}</h2>
              <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                <span className="font-medium text-red-600">{ticket.category_name}</span>
                <span>&bull;</span>
                <span>Oleh: {ticket.student_name} ({ticket.student_nim})</span>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {ticket.description}
              </div>
              
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Lampiran</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {ticket.attachments.map((attachment, index) => (
                      <a 
                        key={attachment.id || index} 
                        href={`${attachment.file_url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block group rounded-lg overflow-hidden border border-gray-200"
                      >
                        <img 
                          src={`${attachment.file_url}`} 
                          alt="Lampiran" 
                          className="w-full h-32 object-cover group-hover:opacity-75 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500 grid grid-cols-2 gap-4">
              <div>
                <span className="block font-medium text-gray-700 text-xs uppercase tracking-wider mb-1">Fakultas</span>
                {ticket.student_faculty || '-'}
              </div>
              <div>
                <span className="block font-medium text-gray-700 text-xs uppercase tracking-wider mb-1">Program Studi</span>
                {ticket.student_program || '-'}
              </div>
              <div>
                <span className="block font-medium text-gray-700 text-xs uppercase tracking-wider mb-1">Kontak (Line/WA)</span>
                {ticket.student_phone || '-'}
              </div>
              <div>
                <span className="block font-medium text-gray-700 text-xs uppercase tracking-wider mb-1">Email</span>
                {ticket.student_email || '-'}
              </div>
              {ticket.is_anonymous && (
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Dilaporkan secara anonim
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Reply Form Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 font-medium text-gray-900">
              Beri Tanggapan / Update
            </div>
            <div className="px-6 py-5">
              <form onSubmit={handleReplySubmit}>
                <div>
                  <label htmlFor="reply" className="sr-only">Balasan</label>
                  <textarea
                    id="reply"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-3 border"
                    placeholder="Tulis tanggapan atau update perkembangan tiket ini..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReply || !replyContent.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submittingReply ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Kirim Balasan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar - Timeline/Notes */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            <div className="px-6 py-4 border-b border-gray-100 font-medium text-gray-900 flex justify-between items-center">
              <span>Aktivitas & Catatan</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {(ticket.timeline?.length || 0) + (ticket.public_responses?.length || 0)} entri
              </span>
            </div>
            <div className="px-6 py-5 max-h-[600px] overflow-y-auto">
              {/* Timeline entries */}
              {(ticket.timeline && ticket.timeline.length > 0) || (ticket.public_responses && ticket.public_responses.length > 0) ? (
                <div className="space-y-4">
                  {/* Status Timeline */}
                  {ticket.timeline?.map((entry, idx) => (
                    <div key={`tl-${idx}`} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center bg-blue-100 flex-shrink-0 mt-0.5">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          Status → {getStatusConfig(entry.status).label}
                        </p>
                        {entry.note && <p className="text-xs text-gray-500 mt-0.5">{entry.note}</p>}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(entry.timestamp).toLocaleDateString('id-ID', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Admin Responses */}
                  {ticket.public_responses?.map((resp, idx) => (
                    <div key={`resp-${idx}`} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center bg-red-100 flex-shrink-0 mt-0.5">
                        <span className="text-red-600 font-bold text-xs">A</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{resp.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Admin • {new Date(resp.created_at).toLocaleDateString('id-ID', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">Belum ada catatan atau aktivitas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
