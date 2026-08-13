const TicketModel = require('../models/ticket.model');
const { sendSuccess, sendError } = require('../utils/response');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const fs = require('fs');

/**
 * ═══════════════════════════════════════════════════
 * Report Controller
 * Handles public-facing report endpoints
 * ═══════════════════════════════════════════════════
 */

class ReportController {
  /**
   * POST /api/v1/reports
   * Submit a new advocacy report.
   *
   * Request body is pre-validated by Joi middleware (createReportSchema).
   * On success, returns the generated ticket_code for public tracking.
   */
  static async createReport(req, res, next) {
    try {
      const {
        student_name,
        student_nim,
        student_email,
        student_phone,
        student_faculty,
        student_program,
        is_anonymous,
        category_id,
        subject,
        description,
      } = req.body;

      // 1. Verify category exists and is active
      const categoryExists = await TicketModel.categoryExists(category_id);
      if (!categoryExists) {
        throw new BadRequestError(
          `Kategori dengan ID ${category_id} tidak ditemukan atau tidak aktif`
        );
      }

      // Parse is_anonymous from string since it comes from FormData
      const isAnonymousBool = is_anonymous === 'true' || is_anonymous === true;

      // 2. Create the ticket (generates ticket_code + initial status log)
      const ticket = await TicketModel.create({
        student_name,
        student_nim,
        student_email,
        student_phone,
        student_faculty,
        student_program,
        is_anonymous: isAnonymousBool,
        category_id,
        subject,
        description,
      });

      // 3. Save attachments if any (convert to Base64 for Serverless persistence)
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            const fileData = fs.readFileSync(file.path);
            const base64Data = fileData.toString('base64');
            const fileUrl = `data:${file.mimetype};base64,${base64Data}`;
            await TicketModel.addAttachment(ticket.id, fileUrl);
            
            // Clean up temporary file from /tmp
            fs.unlinkSync(file.path);
          } catch (fileErr) {
            console.error('Error processing attachment:', fileErr);
            // Non-fatal, we continue to save the ticket itself
          }
        }
      }

      // 4. Return success response with ticket code
      return sendSuccess(res, {
        statusCode: 201,
        message: 'Laporan berhasil dikirim',
        data: {
          ticket_code: ticket.ticket_code,
          status: ticket.status,
          created_at: ticket.created_at,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reports/track/:ticketCode
   * Track a report's status by ticket code (public, no auth needed).
   *
   * - If report is anonymous, student identity is masked (null).
   * - Returns status timeline and any public admin responses.
   */
  static async trackReport(req, res, next) {
    try {
      const { ticketCode } = req.params;

      // 1. Find the ticket by code
      const ticket = await TicketModel.findByTicketCode(ticketCode);
      if (!ticket) {
        throw new NotFoundError(
          `Laporan dengan kode tiket "${ticketCode}" tidak ditemukan`
        );
      }

      // 2. Get status timeline
      const timeline = await TicketModel.getStatusTimeline(ticket.id);

      // 3. Get public admin responses (is_internal = false)
      const publicResponses = await TicketModel.getPublicResponses(ticket.id);

      // 4. Build response — mask identity if anonymous
      const responseData = {
        ticket_code: ticket.ticket_code,
        subject: ticket.subject,
        category: ticket.category_name,
        category_slug: ticket.category_slug,
        status: ticket.status,
        is_anonymous: ticket.is_anonymous,
        // Mask identity on public view (always hidden for tracking)
        student_name: ticket.is_anonymous ? null : ticket.student_name,
        student_nim: ticket.is_anonymous ? null : ticket.student_nim,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        resolution_note: ticket.resolution_note,
        resolved_at: ticket.resolved_at,
        timeline,
        public_responses: publicResponses,
      };

      return sendSuccess(res, {
        message: 'Data laporan berhasil ditemukan',
        data: responseData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/categories
   * Get all active categories for the report form.
   */
  static async getCategories(_req, res, next) {
    try {
      const db = require('../config/database');
      const result = await db.query(
        `SELECT id, name, slug, description, icon, display_order
         FROM categories
         WHERE is_active = TRUE
         ORDER BY display_order ASC`
      );

      return sendSuccess(res, {
        message: 'Daftar kategori berhasil dimuat',
        data: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReportController;
