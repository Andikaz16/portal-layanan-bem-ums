const { Router } = require('express');
const ReportController = require('../controllers/report.controller');
const { validate, createReportSchema, trackReportSchema } = require('../middleware/validate');
const upload = require('../middleware/upload');

const router = Router();

/**
 * ═══════════════════════════════════════════════════
 * Public Routes — No Authentication Required
 * ═══════════════════════════════════════════════════
 */

// GET /api/v1/categories
// Fetch all active report categories
router.get('/categories', ReportController.getCategories);

// POST /api/v1/reports
// Submit a new advocacy report
router.post(
  '/reports',
  upload.array('attachments'),
  validate(createReportSchema),
  ReportController.createReport
);

// GET /api/v1/reports/track/:ticketCode
// Track report status by ticket code
router.get(
  '/reports/track/:ticketCode',
  validate(trackReportSchema, 'params'),
  ReportController.trackReport
);

module.exports = router;
