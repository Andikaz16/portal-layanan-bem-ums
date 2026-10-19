const { Router } = require('express');
const { adminLogin, getAllTickets, getTicketDetail, updateTicketStatus, addTicketNote, getStatistics, viewAttachment, deleteTicket, exportTickets } = require('../controllers/admin.controller');
const PressReleaseController = require('../controllers/press_release.controller');
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

// GET /api/v1/admin/tickets/export - MUST be before /tickets/:id
router.get('/tickets/export', exportTickets);

// GET /api/v1/admin/tickets
router.get('/tickets', getAllTickets);

// GET /api/v1/admin/tickets/:id
router.get('/tickets/:id', getTicketDetail);

// DELETE /api/v1/admin/tickets/:id
router.delete('/tickets/:id', deleteTicket);

// PATCH /api/v1/admin/tickets/:id/status
router.patch('/tickets/:id/status', updateTicketStatus);

// POST /api/v1/admin/tickets/:id/notes
router.post('/tickets/:id/notes', addTicketNote);

// GET /api/v1/admin/attachments/:attachmentId — View attachment file
router.get('/attachments/:attachmentId', viewAttachment);

// ─── Press Release Admin Routes ───
// GET /api/v1/admin/press-releases
router.get('/press-releases', PressReleaseController.adminGetAll);

// POST /api/v1/admin/press-releases
router.post('/press-releases', PressReleaseController.adminCreate);

// GET /api/v1/admin/press-releases/:id
router.get('/press-releases/:id', PressReleaseController.adminGetById);

// PUT /api/v1/admin/press-releases/:id
router.put('/press-releases/:id', PressReleaseController.adminUpdate);

// DELETE /api/v1/admin/press-releases/:id
router.delete('/press-releases/:id', PressReleaseController.adminDelete);

module.exports = router;

