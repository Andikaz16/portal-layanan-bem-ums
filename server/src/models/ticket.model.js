const db = require('../config/database');

/**
 * ═══════════════════════════════════════════════════
 * Ticket Model
 * Handles all database operations for the tickets table
 * ═══════════════════════════════════════════════════
 */

class TicketModel {
  /**
   * Generate a unique ticket code in format: ADV-YYMM-XXX
   * Uses a database-level sequence to avoid race conditions.
   *
   * @returns {Promise<string>} The generated ticket code (e.g., "ADV-2608-001")
   */
  static async generateTicketCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous I, O, 0, 1
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const ticketCode = `BEM-${code}`;

    const result = await db.query('SELECT id FROM tickets WHERE ticket_code = $1', [ticketCode]);
    if (result.rowCount > 0) {
      return this.generateTicketCode(); // Collision, try again
    }
    
    return ticketCode;
  }

  /**
   * Create a new ticket (report).
   *
   * @param {object} data - The report data
   * @param {string} data.student_name
   * @param {string} data.student_nim
   * @param {string} [data.student_email]
   * @param {string} [data.student_phone]
   * @param {string} [data.student_faculty]
   * @param {string} [data.student_program]
   * @param {boolean} [data.is_anonymous=false]
   * @param {number} data.category_id
   * @param {string} data.subject
   * @param {string} data.description
   * @returns {Promise<object>} The created ticket record
   */
  static async create(data) {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // 1. Generate ticket code (inside transaction for safety)
      const ticketCode = await this.generateTicketCode();

      // 2. Insert the ticket
      const insertQuery = `
        INSERT INTO tickets (
          ticket_code,
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
          status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'menunggu_verifikasi'
        )
        RETURNING 
          id,
          ticket_code,
          subject,
          status,
          is_anonymous,
          category_id,
          created_at
      `;

      const values = [
        ticketCode,
        data.student_name,
        data.student_nim,
        data.student_email || null,
        data.student_phone || null,
        data.student_faculty || null,
        data.student_program || null,
        data.is_anonymous || false,
        data.category_id,
        data.subject,
        data.description,
      ];

      const result = await client.query(insertQuery, values);
      const ticket = result.rows[0];

      // 3. Create initial status log entry
      await client.query(
        `INSERT INTO status_logs (ticket_id, previous_status, new_status, note)
         VALUES ($1, NULL, 'menunggu_verifikasi', 'Laporan baru diterima oleh sistem')`,
        [ticket.id]
      );

      await client.query('COMMIT');
      return ticket;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Find a ticket by its unique ticket code.
   * Used for public tracking (GET /reports/track/:ticketCode).
   *
   * @param {string} ticketCode - e.g., "ADV-2608-001"
   * @returns {Promise<object|null>} The ticket record or null
   */
  static async findByTicketCode(ticketCode) {
    const result = await db.query(
      `SELECT 
        t.id,
        t.ticket_code,
        t.subject,
        t.description,
        t.status,
        t.is_anonymous,
        t.student_name,
        t.student_nim,
        t.resolution_note,
        t.resolved_at,
        t.created_at,
        t.updated_at,
        c.name AS category_name,
        c.slug AS category_slug
       FROM tickets t
       JOIN categories c ON c.id = t.category_id
       WHERE t.ticket_code = $1`,
      [ticketCode]
    );

    return result.rows[0] || null;
  }

  /**
   * Get the status timeline (status_logs) for a given ticket.
   *
   * @param {string} ticketId - UUID of the ticket
   * @returns {Promise<Array>} Array of status log entries, ordered chronologically
   */
  static async getStatusTimeline(ticketId) {
    const result = await db.query(
      `SELECT 
        sl.new_status AS status,
        sl.note,
        sl.created_at AS timestamp
       FROM status_logs sl
       WHERE sl.ticket_id = $1
       ORDER BY sl.created_at ASC`,
      [ticketId]
    );

    return result.rows;
  }

  /**
   * Get public responses (non-internal admin notes) for a given ticket.
   *
   * @param {string} ticketId - UUID of the ticket
   * @returns {Promise<Array>} Array of public admin notes
   */
  static async getPublicResponses(ticketId) {
    const result = await db.query(
      `SELECT 
        an.content,
        an.created_at
       FROM admin_notes an
       WHERE an.ticket_id = $1
         AND an.is_internal = FALSE
       ORDER BY an.created_at ASC`,
      [ticketId]
    );

    return result.rows;
  }

  /**
   * Check if a category exists and is active.
   *
   * @param {number} categoryId
   * @returns {Promise<boolean>}
   */
  static async categoryExists(categoryId) {
    const result = await db.query(
      `SELECT id FROM categories WHERE id = $1 AND is_active = TRUE`,
      [categoryId]
    );
    return result.rowCount > 0;
  }

  /**
   * Admin: Get all tickets with basic details
   *
   * @returns {Promise<Array>} List of tickets
   */
  static async adminGetAll() {
    const result = await db.query(
      `SELECT 
        t.id,
        t.ticket_code,
        t.subject,
        t.status,
        t.student_name,
        t.created_at,
        c.name AS category_name
       FROM tickets t
       LEFT JOIN categories c ON c.id = t.category_id
       ORDER BY t.created_at DESC`
    );
    return result.rows;
  }

  /**
   * Admin: Get all tickets with full details for export
   *
   * @returns {Promise<Array>} List of tickets
   */
  static async getAllTicketsForExport() {
    const result = await db.query(
      `SELECT 
        t.ticket_code,
        t.student_name,
        t.student_nim,
        t.student_email,
        t.student_phone,
        t.student_faculty,
        t.student_program,
        t.is_anonymous,
        c.name AS category_name,
        t.subject,
        t.description,
        t.status,
        t.created_at
       FROM tickets t
       LEFT JOIN categories c ON c.id = t.category_id
       WHERE t.status = 'selesai'
       ORDER BY t.created_at DESC`
    );
    return result.rows;
  }

  /**
   * Admin: Delete a ticket and all its related records (handled by CASCADE)
   */
  static async deleteTicket(id) {
    const result = await db.query(
      `DELETE FROM tickets WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rowCount > 0;
  }

  /**
   * Admin: Get single ticket detail by ID
   */
  static async adminGetById(id) {
    const result = await db.query(
      `SELECT 
        t.*,
        c.name AS category_name
       FROM tickets t
       LEFT JOIN categories c ON c.id = t.category_id
       WHERE t.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Admin: Update ticket status
   */
  static async updateStatus(id, newStatus, note = null) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      
      const updateResult = await client.query(
        `UPDATE tickets 
         SET status = $1, updated_at = NOW() 
         WHERE id = $2 RETURNING status`,
        [newStatus, id]
      );
      
      if (updateResult.rowCount === 0) {
        throw new Error('Ticket not found');
      }

      await client.query(
        `INSERT INTO status_logs (ticket_id, new_status, note)
         VALUES ($1, $2, $3)`,
        [id, newStatus, note]
      );

      await client.query('COMMIT');
      return updateResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Admin: Add a note/response to a ticket
   */
  static async addAdminNote(ticketId, content, isInternal = false) {
    const result = await db.query(
      `INSERT INTO admin_notes (ticket_id, admin_id, content, is_internal)
       VALUES ($1, NULL, $2, $3)
       RETURNING *`,
      [ticketId, content, isInternal]
    );
    return result.rows[0];
  }

  /**
   * Add attachment to a ticket
   */
  static async addAttachment(ticketId, fileUrl, fileName = 'lampiran') {
    // Some databases might not have file_name column or have it as nullable,
    // but others (like the Vercel Neon DB) have it as NOT NULL.
    // We try to insert with file_name, and if it fails because column doesn't exist, we fall back.
    try {
      const result = await db.query(
        `INSERT INTO ticket_attachments (ticket_id, file_url, file_name)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [ticketId, fileUrl, fileName]
      );
      return result.rows[0];
    } catch (err) {
      if (err.code === '42703') { // column "file_name" of relation "ticket_attachments" does not exist
        const result = await db.query(
          `INSERT INTO ticket_attachments (ticket_id, file_url)
           VALUES ($1, $2)
           RETURNING *`,
          [ticketId, fileUrl]
        );
        return result.rows[0];
      }
      throw err;
    }
  }

  /**
   * Get attachments for a ticket
   */
  static async getAttachments(ticketId) {
    const result = await db.query(
      `SELECT id, file_url, created_at
       FROM ticket_attachments
       WHERE ticket_id = $1
       ORDER BY created_at ASC`,
      [ticketId]
    );
    return result.rows;
  }

  /**
   * Get a single attachment by its ID
   */
  static async getAttachmentById(attachmentId) {
    const result = await db.query(
      `SELECT id, ticket_id, file_url, created_at
       FROM ticket_attachments
       WHERE id = $1`,
      [attachmentId]
    );
    return result.rows[0] || null;
  }

  /**
   * Admin: Get statistics
   */
  static async getStatistics() {
    const totalResult = await db.query('SELECT COUNT(*) as count FROM tickets');
    
    // new this month using date_trunc for PostgreSQL
    const newMonthResult = await db.query(
      "SELECT COUNT(*) as count FROM tickets WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)"
    );

    const waitingResult = await db.query(
      "SELECT COUNT(*) as count FROM tickets WHERE status = 'menunggu_verifikasi'"
    );

    return {
      total: parseInt(totalResult.rows[0].count, 10),
      new_this_month: parseInt(newMonthResult.rows[0].count, 10),
      waiting: parseInt(waitingResult.rows[0].count, 10)
    };
  }
}

module.exports = TicketModel;
