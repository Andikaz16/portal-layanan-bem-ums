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

// GET /api/v1/reports/attachments/:attachmentId
// Public route to view attachments via URL
router.get('/reports/attachments/:attachmentId', ReportController.viewAttachment);

// Temporary diagnostic route to test email on Vercel
router.get('/test-email', async (req, res) => {
  const nodemailer = require('nodemailer');
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify SMTP connection
    await transporter.verify();

    // Send a test email to the configured sender address itself
    const info = await transporter.sendMail({
      from: `"Test Portal BEM" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "Test Email Vercel",
      text: "Jika Anda menerima ini, maka SMTP berjalan lancar di Vercel!"
    });

    res.json({ 
      success: true, 
      message: 'SMTP Connection and Test Email Successful!', 
      info,
      user: process.env.SMTP_USER,
      pass_length: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message, 
      stack: error.stack,
      user: process.env.SMTP_USER,
      pass_length: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0
    });
  }
});

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
