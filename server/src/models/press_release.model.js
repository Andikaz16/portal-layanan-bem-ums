const db = require('../config/database');

/**
 * ═══════════════════════════════════════════════════
 * Press Release Model
 * Handles database operations for press_releases table
 * ═══════════════════════════════════════════════════
 */

class PressReleaseModel {
  /**
   * Ensure press_releases table exists
   */
  static async ensureTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS press_releases (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100) DEFAULT 'Advokasi',
        summary TEXT,
        content TEXT NOT NULL,
        author VARCHAR(100) DEFAULT 'BEM UMS',
        thumbnail TEXT,
        is_published BOOLEAN DEFAULT true,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_press_releases_slug ON press_releases(slug);
      CREATE INDEX IF NOT EXISTS idx_press_releases_published ON press_releases(is_published);
    `;
    try {
      await db.query(query);
    } catch (err) {
      console.error('[PressReleaseModel] Error ensuring table:', err.message);
    }
  }

  /**
   * Helper to generate URL-friendly slug
   */
  static slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove non-word chars
      .replace(/[\s_-]+/g, '-')  // collapse dashes
      .replace(/^-+|-+$/g, '');  // trim starting/ending dashes
  }

  /**
   * Generate a unique slug
   */
  static async generateUniqueSlug(title, currentId = null) {
    let baseSlug = this.slugify(title);
    if (!baseSlug) baseSlug = 'press-release';

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const res = await db.query(
        'SELECT id FROM press_releases WHERE slug = $1 AND ($2::INTEGER IS NULL OR id != $2)',
        [slug, currentId]
      );
      if (res.rowCount === 0) {
        return slug;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  /**
   * Fetch all press releases (Public or Admin)
   */
  static async getAll({ isPublishedOnly = false, category = null, search = '', limit = null, offset = 0 } = {}) {
    await this.ensureTable();

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (isPublishedOnly) {
      conditions.push(`is_published = true`);
    }

    if (category && category !== 'Semua') {
      conditions.push(`category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    if (search && search.trim()) {
      conditions.push(`(title ILIKE $${paramIndex} OR summary ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`);
      params.push(`%${search.trim()}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total count query
    const countRes = await db.query(`SELECT COUNT(*) as total FROM press_releases ${whereClause}`, params);
    const total = parseInt(countRes.rows[0].total, 10);

    // List query
    let listQuery = `
      SELECT id, title, slug, category, summary, author, thumbnail, is_published, views, created_at, updated_at
      FROM press_releases
      ${whereClause}
      ORDER BY created_at DESC
    `;

    if (limit) {
      listQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);
    }

    const result = await db.query(listQuery, params);

    return {
      total,
      data: result.rows
    };
  }

  /**
   * Fetch a single press release by slug (and increment views)
   */
  static async getBySlug(slug, incrementView = true) {
    await this.ensureTable();

    const result = await db.query(
      'SELECT * FROM press_releases WHERE slug = $1 AND is_published = true',
      [slug]
    );

    if (result.rows.length === 0) return null;

    if (incrementView) {
      // Background increment view
      db.query('UPDATE press_releases SET views = views + 1 WHERE slug = $1', [slug]).catch(() => {});
    }

    return result.rows[0];
  }

  /**
   * Fetch single press release by ID (Admin)
   */
  static async getById(id) {
    await this.ensureTable();

    const result = await db.query(
      'SELECT * FROM press_releases WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Create a new press release
   */
  static async create({ title, category, summary, content, author, thumbnail, is_published = true }) {
    await this.ensureTable();

    const slug = await this.generateUniqueSlug(title);

    const query = `
      INSERT INTO press_releases (title, slug, category, summary, content, author, thumbnail, is_published, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      title.trim(),
      slug,
      category || 'Advokasi',
      summary ? summary.trim() : null,
      content.trim(),
      author ? author.trim() : 'BEM UMS',
      thumbnail || null,
      is_published === undefined ? true : Boolean(is_published)
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Update an existing press release
   */
  static async update(id, { title, category, summary, content, author, thumbnail, is_published }) {
    await this.ensureTable();

    // Check existing
    const existing = await this.getById(id);
    if (!existing) return null;

    let slug = existing.slug;
    if (title && title.trim() !== existing.title) {
      slug = await this.generateUniqueSlug(title, id);
    }

    const query = `
      UPDATE press_releases
      SET 
        title = COALESCE($1, title),
        slug = $2,
        category = COALESCE($3, category),
        summary = COALESCE($4, summary),
        content = COALESCE($5, content),
        author = COALESCE($6, author),
        thumbnail = COALESCE($7, thumbnail),
        is_published = COALESCE($8, is_published),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;

    const values = [
      title ? title.trim() : null,
      slug,
      category || null,
      summary !== undefined ? summary : null,
      content ? content.trim() : null,
      author ? author.trim() : null,
      thumbnail !== undefined ? thumbnail : null,
      is_published !== undefined ? Boolean(is_published) : null,
      id
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete a press release
   */
  static async delete(id) {
    await this.ensureTable();

    const result = await db.query(
      'DELETE FROM press_releases WHERE id = $1 RETURNING id',
      [id]
    );

    return result.rowCount > 0;
  }
}

// Auto-run ensureTable on module load
PressReleaseModel.ensureTable().catch((err) => {
  console.error('[PressReleaseModel] Initialization warning:', err.message);
});

module.exports = PressReleaseModel;
