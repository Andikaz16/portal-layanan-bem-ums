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

// Temporary migration endpoint to fix Vercel DB schema
router.get('/migrate', async (req, res) => {
  const db = require('../config/database');
  try {
    await db.query(`ALTER TABLE ticket_attachments ALTER COLUMN file_url TYPE TEXT;`);
    res.json({ success: true, message: 'Migration successful: file_url changed to TEXT' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
