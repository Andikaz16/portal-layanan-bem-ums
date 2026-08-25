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
            const base64Data = file.buffer.toString('base64');
            const fileUrl = `data:${file.mimetype};base64,${base64Data}`;
            await TicketModel.addAttachment(ticket.id, fileUrl);
          } catch (fileErr) {
            console.error('Error processing attachment:', fileErr);
            await TicketModel.addAdminNote(ticket.id, 'SYSTEM ERROR UPLOADING ATTACHMENT: ' + fileErr.message + ' | ' + (fileErr.stack || ''), true);
          }
        }
      }

      // Handle JSON base64 attachments (preferred for Vercel)
      if (req.body.attachments_base64) {
        let base64Array = req.body.attachments_base64;
        if (typeof base64Array === 'string') {
          try { base64Array = JSON.parse(base64Array); } catch(e) { base64Array = []; }
        }
        if (Array.isArray(base64Array)) {
          for (const base64String of base64Array) {
            if (base64String && base64String.startsWith('data:')) {
              const mimeMatch = base64String.match(/^data:([^;]+);base64,/);
              let ext = '.png';
              if (mimeMatch) {
                const mime = mimeMatch[1];
                if (mime === 'application/pdf') ext = '.pdf';
                else if (mime === 'image/jpeg') ext = '.jpg';
                else if (mime.includes('word')) ext = '.docx';
              }
              const fileName = `lampiran-${Date.now()}${ext}`;
              await TicketModel.addAttachment(ticket.id, base64String, fileName);
            }
          }
        }
      }

      // 4. Send Email Notification
      // Since student_email might be null, we check it.
      if (ticket.student_email) {
        const { sendTicketEmail } = require('../utils/email');
        // We MUST await this in Vercel, otherwise the serverless function 
        // freezes before the email is sent out.
        try {
          await sendTicketEmail(
            ticket.student_email, 
            ticket.ticket_code, 
            ticket.student_name, 
            ticket.subject
          );
        } catch (err) {
          console.error('[Email] Failed to send email, but continuing:', err);
        }
      }

      // 5. Send WhatsApp Notification to Admin (Fonnte)
      const waPhone = process.env.ADMIN_WA_PHONE;
      const fonnteToken = process.env.FONNTE_TOKEN;
      if (waPhone && fonnteToken) {
        const reporterName = ticket.is_anonymous ? 'Anonim' : ticket.student_name;
        const messageText = `🚨 *LAPORAN BARU MASUK!* 🚨\n\n*Kode Tiket:* ${ticket.ticket_code}\n*Pengirim:* ${reporterName}\n*Subjek:* ${ticket.subject}\n\nSilakan cek detailnya di Dashboard Admin BEM UMS!`;
        
        try {
          // We MUST await this so Vercel Serverless Function doesn't terminate before it finishes
          const waRes = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': fonnteToken
            },
            body: JSON.stringify({
              target: waPhone,
              message: messageText
            })
          });
          
          const waResult = await waRes.json();
          if (!waRes.ok || !waResult.status) {
            console.error('[WhatsApp] Fonnte failed to send notification:', waResult);
          } else {
            console.log(`[WhatsApp] Admin notification sent successfully via Fonnte for ${ticket.ticket_code}`);
          }
        } catch (err) {
          console.error('[WhatsApp] Error sending Fonnte notification:', err.message);
        }
      }

      // 6. Return success response with ticket code
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
   * GET /api/v1/reports/attachments/:attachmentId
   * Public route to view attachments via URL (e.g., from CSV exports)
   */
  static async viewAttachment(req, res, next) {
    try {
      const { attachmentId } = req.params;
      const attachment = await TicketModel.getAttachmentById(attachmentId);

      if (!attachment) {
        throw new NotFoundError('Lampiran tidak ditemukan');
      }

      const fileUrl = attachment.file_url;

      // Handle base64 data URI
      if (fileUrl.startsWith('data:')) {
        const matches = fileUrl.match(/^data:(.+);base64,(.+)$/);
        if (!matches) {
          throw new BadRequestError('Format lampiran tidak valid');
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

      throw new NotFoundError('File lampiran tidak tersedia di server ini');
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
