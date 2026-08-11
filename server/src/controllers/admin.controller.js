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

module.exports = {
  adminLogin,
  getAllTickets,
  getTicketDetail,
  updateTicketStatus,
  addTicketNote,
  getStatistics
};
