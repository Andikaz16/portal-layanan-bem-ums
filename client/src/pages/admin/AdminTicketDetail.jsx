import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, Clock, AlertCircle, MessageCircle, Paperclip, ExternalLink, Image, Trash2 } from 'lucide-react';

export default function AdminTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    fetchTicketDetail();
  }, [id]);

  const fetchTicketDetail = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
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
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`/api/v1/admin/tickets/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Gagal memperbarui status');
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
      const token = sessionStorage.getItem('adminToken');
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
      await fetchTicketDetail();
      setReplyContent('');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`/api/v1/admin/tickets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.message || 'Gagal menghapus tiket');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'menunggu_verifikasi':
        return { label: 'Menunggu Verifikasi', color: 'bg-amber-950 text-amber-300 border-amber-700', icon: Clock };
      case 'sedang_diproses':
        return { label: 'Sedang Diproses', color: 'bg-blue-50 text-blue-800 border-blue-700', icon: AlertCircle };
      case 'tahap_audiensi':
        return { label: 'Tahap Audiensi', color: 'bg-purple-50 text-purple-800 border-purple-200', icon: MessageCircle };
      case 'selesai':
        return { label: 'Selesai', color: 'bg-navy-800 text-white border-panel-600', icon: CheckCircle2 };
      default:
        return { label: status, color: 'bg-panel-800 text-sky-200 border-panel-600', icon: Clock };
    }
  };

  const getAttachmentViewUrl = (attachmentId) => {
    const token = sessionStorage.getItem('adminToken');
    return `/api/v1/admin/attachments/${attachmentId}?token=${token}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-500"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-3xl text-center max-w-lg mx-auto">
        <p className="font-bold text-base">{error || 'Tiket tidak ditemukan'}</p>
        <Link to="/admin/dashboard" className="btn-secondary mt-4 inline-flex text-xs py-2 px-4">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const StatusIcon = getStatusConfig(ticket.status).icon;
  const attachmentCount = ticket.attachments?.length || 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-panel-600 pb-4">
        <div className="flex items-center space-x-4">
          <Link to="/admin/dashboard" className="p-2 hover:bg-panel-800 rounded-full transition-colors text-sky-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-white font-mono">{ticket.ticket_code}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusConfig(ticket.status).color}`}>
                <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                {getStatusConfig(ticket.status).label}
              </span>
            </div>
            <p className="mt-1 text-xs text-sky-400">
              Dilaporkan pada {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <label htmlFor="status-update" className="text-xs font-bold text-sky-300 uppercase tracking-wider">Status:</label>
          <select
            id="status-update"
            value={ticket.status}
            onChange={handleStatusChange}
            disabled={updating}
            className="block w-48 pl-3 pr-8 py-2 text-xs font-bold rounded-full bg-navy-800 border border-panel-600 text-white focus:outline-none focus:ring-2 focus:ring-neon-500/20 focus:border-neon-500 shadow-sm disabled:opacity-50"
          >
            <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
            <option value="sedang_diproses">Sedang Diproses</option>
            <option value="tahap_audiensi">Tahap Audiensi</option>
            <option value="selesai">Selesai</option>
          </select>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center p-2 text-sky-400 hover:text-red-600 bg-navy-800 hover:bg-red-50 rounded-full border border-panel-600 transition-colors shadow-sm"
            title="Hapus Tiket"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Ticket Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-navy-800 rounded-3xl shadow-neon border border-panel-600 overflow-hidden">
            <div className="px-6 py-5 border-b border-panel-800 bg-navy-800/50">
              <h2 className="text-lg font-bold text-white">{ticket.subject}</h2>
              <div className="mt-1.5 flex items-center space-x-2 text-xs text-sky-300">
                <span className="font-bold text-neon-600">{ticket.category_name || ticket.category}</span>
                <span>&bull;</span>
                <span>Oleh: {ticket.student_name} ({ticket.student_nim})</span>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="prose max-w-none text-sky-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {ticket.description}
              </div>
              
              {/* Lampiran Bukti - Link Style */}
              {attachmentCount > 0 && (
                <div className="mt-6 pt-4 border-t border-panel-800">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-sky-400" />
                    Lampiran Bukti ({attachmentCount} file)
                  </h3>
                  <div className="space-y-2">
                    {ticket.attachments.map((attachment, index) => (
                      <a
                        key={attachment.id || index}
                        href={getAttachmentViewUrl(attachment.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-2xl border border-panel-600 bg-navy-800/50 hover:bg-navy-800/50 hover:border-neon-300 transition-all group"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-panel-800 flex items-center justify-center group-hover:bg-panel-700 transition-colors">
                          <Image className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-white transition-colors">
                            📎 Lampiran #{index + 1}
                          </p>
                          <p className="text-[11px] text-sky-400">
                            Diunggah {new Date(attachment.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-sky-400 group-hover:text-white flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-navy-800/60 border-t border-panel-800 text-xs text-sky-300 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block font-bold text-white uppercase tracking-wider mb-0.5">Fakultas</span>
                {ticket.student_faculty || '-'}
              </div>
              <div>
                <span className="block font-bold text-white uppercase tracking-wider mb-0.5">Program Studi</span>
                {ticket.student_program || '-'}
              </div>
              <div>
                <span className="block font-bold text-white uppercase tracking-wider mb-0.5">Kontak (WA/HP)</span>
                {ticket.student_phone || '-'}
              </div>
              <div>
                <span className="block font-bold text-white uppercase tracking-wider mb-0.5">Email</span>
                {ticket.student_email || '-'}
              </div>
              {ticket.is_anonymous && (
                <div className="sm:col-span-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-900/40 text-amber-300 border border-amber-700">
                    🔒 Dilaporkan secara anonim
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Reply Form Area */}
          <div className="bg-navy-800 rounded-3xl shadow-neon border border-panel-600 overflow-hidden">
            <div className="px-6 py-4 border-b border-panel-800 font-bold text-white text-sm uppercase tracking-wide">
              Beri Tanggapan / Update
            </div>
            <div className="px-6 py-5">
              <form onSubmit={handleReplySubmit}>
                <div>
                  <label htmlFor="reply" className="sr-only">Balasan</label>
                  <textarea
                    id="reply"
                    rows={4}
                    className="block w-full rounded-2xl border-panel-600 shadow-sm focus:border-neon-500 focus:ring-2 focus:ring-neon-500/20 text-sm p-3.5 border bg-navy-800 text-white placeholder-charcoal-400"
                    placeholder="Tulis tanggapan atau update perkembangan tiket ini..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReply || !replyContent.trim()}
                    className="btn-primary py-2.5 px-6 text-xs"
                  >
                    {submittingReply ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Kirim Balasan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Aktivitas & Catatan Card */}
          <div className="bg-navy-800 rounded-3xl shadow-neon border border-panel-600 overflow-hidden">
            <div className="px-6 py-4 border-b border-panel-800 font-bold text-white text-xs uppercase tracking-wider flex justify-between items-center">
              <span>Aktivitas & Catatan</span>
              <span className="text-[11px] bg-panel-800 text-sky-200 px-2.5 py-0.5 rounded-full font-bold">
                {(ticket.timeline?.length || 0) + (ticket.public_responses?.length || 0)}
              </span>
            </div>
            <div className="px-6 py-5 max-h-[600px] overflow-y-auto">
              {(ticket.timeline && ticket.timeline.length > 0) || (ticket.public_responses && ticket.public_responses.length > 0) ? (
                <div className="space-y-4">
                  {ticket.timeline?.map((entry, idx) => (
                    <div key={`tl-${idx}`} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-xl flex items-center justify-center bg-panel-800 text-white flex-shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white">
                          {getStatusConfig(entry.status).label}
                        </p>
                        {entry.note && <p className="text-xs text-sky-200 mt-0.5">{entry.note}</p>}
                        <p className="text-[11px] text-sky-400 mt-1 font-mono">
                          {new Date(entry.timestamp).toLocaleDateString('id-ID', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {ticket.public_responses?.map((resp, idx) => (
                    <div key={`resp-${idx}`} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-xl flex items-center justify-center bg-sky-800 text-sky-300 flex-shrink-0 mt-0.5">
                        <span className="font-bold text-xs">A</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-sky-200 leading-relaxed">{resp.content}</p>
                        <p className="text-[11px] text-sky-400 mt-1 font-mono">
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
                  <MessageCircle className="mx-auto h-8 w-8 text-sky-300" />
                  <p className="mt-2 text-xs text-sky-400">Belum ada catatan atau aktivitas</p>
                </div>
              )}
            </div>
          </div>

          {/* Lampiran Bukti Card */}
          <div className="bg-navy-800 rounded-3xl shadow-neon border border-panel-600 overflow-hidden">
            <div className="px-6 py-4 border-b border-panel-800 font-bold text-white text-xs uppercase tracking-wider flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-sky-400" />
                Lampiran Bukti
              </span>
              <span className="text-[11px] bg-panel-800 text-sky-200 px-2.5 py-0.5 rounded-full font-bold">
                {attachmentCount}
              </span>
            </div>
            <div className="px-6 py-5">
              {attachmentCount > 0 ? (
                <div className="space-y-2.5">
                  {ticket.attachments.map((attachment, index) => (
                    <a
                      key={attachment.id || index}
                      href={getAttachmentViewUrl(attachment.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-2xl border border-panel-600 bg-navy-800/50 hover:bg-navy-800/50 hover:border-neon-300 transition-all group cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-panel-800 flex items-center justify-center group-hover:bg-panel-700 transition-colors">
                        <Image className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white group-hover:text-white transition-colors truncate">
                          📎 Lampiran #{index + 1}
                        </p>
                        <p className="text-[11px] text-sky-400">
                          Klik untuk melihat
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:text-white flex-shrink-0 transition-colors" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Paperclip className="mx-auto h-8 w-8 text-sky-300" />
                  <p className="mt-2 text-xs text-sky-400">Tidak ada lampiran</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowDeleteConfirm(false)}>
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
                        Apakah Anda yakin ingin menghapus tiket <strong>{ticket.ticket_code}</strong> ini? Aksi ini bersifat permanen dan tidak dapat dibatalkan.
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
                  onClick={() => setShowDeleteConfirm(false)}
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
