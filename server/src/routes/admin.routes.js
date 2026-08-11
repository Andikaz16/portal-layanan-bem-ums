const { Router } = require('express');
const { adminLogin, getAllTickets, getTicketDetail, updateTicketStatus, addTicketNote, getStatistics } = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth');

const router = Router();

/**
 * ═══════════════════════════════════════════════════
 * Admin Routes
 * Base: /api/v1/admin
 * ═══════════════════════════════════════════════════
 */

// POST /api/v1/admin/login
router.post('/login', adminLogin);

// Protect all routes below with Auth Middleware
router.use(authMiddleware);

// GET /api/v1/admin/statistics
router.get('/statistics', getStatistics);

// GET /api/v1/admin/tickets
router.get('/tickets', getAllTickets);

// GET /api/v1/admin/tickets/:id
router.get('/tickets/:id', getTicketDetail);

// PATCH /api/v1/admin/tickets/:id/status
router.patch('/tickets/:id/status', updateTicketStatus);

// POST /api/v1/admin/tickets/:id/notes
router.post('/tickets/:id/notes', addTicketNote);

module.exports = router;
