const PressReleaseModel = require('../models/press_release.model');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * ═══════════════════════════════════════════════════
 * Press Release Controller
 * Handles Public & Admin requests for press releases
 * ═══════════════════════════════════════════════════
 */

// ─── Public Endpoints ───

/**
 * GET /api/v1/press-releases
 * Fetch published press releases with optional filtering
 */
const getPublicPressReleases = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 9));
    const offset = (page - 1) * limit;
    const category = req.query.category || null;
    const search = req.query.search || '';

    const { total, data } = await PressReleaseModel.getAll({
      isPublishedOnly: true,
      category,
      search,
      limit,
      offset
    });

    return sendSuccess(res, {
      message: 'Daftar press release berhasil dimuat',
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/press-releases/:slug
 * Fetch a single published press release by slug
 */
const getPublicPressReleaseBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const pressRelease = await PressReleaseModel.getBySlug(slug, true);

    if (!pressRelease) {
      return sendError(res, {
        statusCode: 404,
        message: 'Press release tidak ditemukan atau belum dipublikasikan'
      });
    }

    return sendSuccess(res, {
      message: 'Detail press release berhasil dimuat',
      data: pressRelease
    });
  } catch (error) {
    next(error);
  }
};

// ─── Admin Endpoints ───

/**
 * GET /api/v1/admin/press-releases
 * Admin list all press releases (including drafts)
 */
const adminGetAll = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;
    const category = req.query.category || null;
    const search = req.query.search || '';

    const { total, data } = await PressReleaseModel.getAll({
      isPublishedOnly: false,
      category,
      search,
      limit,
      offset
    });

    return sendSuccess(res, {
      message: 'Data press release admin berhasil dimuat',
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/admin/press-releases/:id
 * Get single press release for admin editing
 */
const adminGetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pressRelease = await PressReleaseModel.getById(id);

    if (!pressRelease) {
      return sendError(res, {
        statusCode: 404,
        message: 'Press release tidak ditemukan'
      });
    }

    return sendSuccess(res, {
      data: pressRelease
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/admin/press-releases
 * Create a new press release
 */
const adminCreate = async (req, res, next) => {
  try {
    const { title, category, summary, content, author, thumbnail, is_published } = req.body;

    if (!title || !title.trim()) {
      return sendError(res, {
        statusCode: 400,
        message: 'Judul press release wajib diisi'
      });
    }

    if (!content || !content.trim()) {
      return sendError(res, {
        statusCode: 400,
        message: 'Konten/isi press release wajib diisi'
      });
    }

    const created = await PressReleaseModel.create({
      title,
      category,
      summary,
      content,
      author,
      thumbnail,
      is_published: is_published !== undefined ? is_published : true
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Press release berhasil dibuat',
      data: created
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/admin/press-releases/:id
 * Update an existing press release
 */
const adminUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, summary, content, author, thumbnail, is_published } = req.body;

    const updated = await PressReleaseModel.update(id, {
      title,
      category,
      summary,
      content,
      author,
      thumbnail,
      is_published
    });

    if (!updated) {
      return sendError(res, {
        statusCode: 404,
        message: 'Press release tidak ditemukan'
      });
    }

    return sendSuccess(res, {
      message: 'Press release berhasil diperbarui',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/admin/press-releases/:id
 * Delete a press release
 */
const adminDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await PressReleaseModel.delete(id);

    if (!deleted) {
      return sendError(res, {
        statusCode: 404,
        message: 'Press release tidak ditemukan'
      });
    }

    return sendSuccess(res, {
      message: 'Press release berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicPressReleases,
  getPublicPressReleaseBySlug,
  adminGetAll,
  adminGetById,
  adminCreate,
  adminUpdate,
  adminDelete
};
