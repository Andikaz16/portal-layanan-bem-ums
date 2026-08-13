const TicketModel = require('../models/ticket.model');
const jwt = require('jsonwebtoken');

/**
 * Controller for Admin Panel
 */

const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  if (username === 'bem' && password === 'bemums') {
    const token = jwt.sign({ username: 'bem', role: 'admin' }, process.env.JWT_SECRET || 'secret-bem-ums-123', {
      expiresIn: '1d'
    });
    return res.status(200).json({ success: true, message: 'Login berhasil', data: { token } });
  }
  return res.status(401).json({ success: false, message: 'Username atau password salah' });
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await TicketModel.adminGetAll();

    res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error('[AdminController] Error getting all tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data tiket',
    });
  }
};

const getStatistics = async (req, res) => {
  try {
    const stats = await TicketModel.getStatistics();
    res.status(200).json({
      success: true,
      message: 'Statistik berhasil dimuat',
      data: stats,
    });
  } catch (error) {
    console.error('[AdminController] Error getting statistics:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil statistik' });
  }
};

const getTicketDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await TicketModel.adminGetById(id);
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan' });
    }

    const timeline = await TicketModel.getStatusTimeline(id);
    const publicResponses = await TicketModel.getPublicResponses(id);
    const attachments = await TicketModel.getAttachments(id);

    res.status(200).json({
      success: true,
      data: {
        ...ticket,
        timeline,
        public_responses: publicResponses,
        attachments
      }
    });
  } catch (error) {
    console.error('[AdminController] Error getting ticket detail:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail tiket' });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    
    await TicketModel.updateStatus(id, status, note);
    
    res.status(200).json({
      success: true,
      message: 'Status tiket berhasil diupdate'
    });
  } catch (error) {
    console.error('[AdminController] Error updating ticket status:', error);
    res.status(500).json({ success: false, message: 'Gagal mengubah status tiket' });
  }
};

const addTicketNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, is_internal } = req.body;
    
    const note = await TicketModel.addAdminNote(id, content, is_internal);
    
    res.status(201).json({
      success: true,
      message: 'Catatan berhasil ditambahkan',
      data: note
    });
  } catch (error) {
    console.error('[AdminController] Error adding ticket note:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan catatan' });
  }
};

const viewAttachment = async (req, res) => {
  try {
    const { attachmentId } = req.params;
    const attachment = await TicketModel.getAttachmentById(attachmentId);

    if (!attachment) {
      return res.status(404).json({ success: false, message: 'Lampiran tidak ditemukan' });
    }

    const fileUrl = attachment.file_url;

    // Handle base64 data URI
    if (fileUrl.startsWith('data:')) {
      const matches = fileUrl.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ success: false, message: 'Format lampiran tidak valid' });
      }
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(buffer);
    }

    // For old URL-based attachments, return info
    return res.status(404).json({ success: false, message: 'File lampiran tidak tersedia di server ini' });
  } catch (error) {
    console.error('[AdminController] Error viewing attachment:', error);
    res.status(500).json({ success: false, message: 'Gagal memuat lampiran' });
  }
};

/**
 * Delete a ticket and its associated records
 */
const deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if ticket exists
    const ticket = await TicketModel.adminGetById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan' });
    }
    
    await TicketModel.deleteTicket(id);
    
    return res.status(200).json({ success: true, message: 'Tiket berhasil dihapus' });
  } catch (error) {
    console.error('Delete Ticket Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus tiket' });
  }
};

/**
 * Export all tickets as CSV
 */
const exportTickets = async (req, res, next) => {
  try {
    const type = req.query.type || 'completed'; // 'completed' or 'all'
    const tickets = await TicketModel.getAllTicketsForExport(type);
    
    if (tickets.length === 0) {
      return res.status(404).json({ success: false, message: 'Belum ada data tiket untuk diekspor' });
    }

    // CSV Headers
    const headers = [
      'Kode Tiket',
      'Nama Mahasiswa',
      'NIM',
      'Email',
      'No. Telepon',
      'Fakultas',
      'Prodi',
      'Kategori',
      'Anonim?',
      'Subjek',
      'Deskripsi',
      'Status',
      'Tanggal Dibuat',
      'Lampiran'
    ];

    // Simple manual CSV stringifier for basic data
    // Simple manual CSV stringifier for basic data
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '';
      const stringified = String(str);
      // If it contains quote, comma, semicolon, or newline, wrap in quotes and escape quotes
      if (/[",;\n\r]/.test(stringified)) {
        return '"' + stringified.replace(/"/g, '""') + '"';
      }
      return stringified;
    };

    // UTF-8 BOM so Excel reads it as UTF-8
    const BOM = '\uFEFF';
    
    // Use semicolon (;) which is standard for Indonesian/European Excel locales
    let csvContent = BOM + headers.join(';') + '\r\n';

    tickets.forEach(t => {
      const row = [
        t.ticket_code,
        t.student_name,
        t.student_nim,
        t.student_email,
        t.student_phone,
        t.student_faculty,
        t.student_program,
        t.is_anonymous ? 'Ya' : 'Tidak',
        t.category_name,
        t.subject,
        t.description,
        t.status,
        new Date(t.created_at).toLocaleString('id-ID'),
        t.lampiran || 'Tidak ada'
      ];
      csvContent += row.map(escapeCsv).join(';') + '\r\n';
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="rekap-laporan-bem.csv"');
    
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengekspor tiket' });
  }
};

module.exports = {
  adminLogin,
  getAllTickets,
  getTicketDetail,
  updateTicketStatus,
  addTicketNote,
  getStatistics,
  viewAttachment,
  deleteTicket,
  exportTickets
};
