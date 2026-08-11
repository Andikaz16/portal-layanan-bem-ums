const { Router } = require('express');
const publicRoutes = require('./public.routes');
const adminRoutes = require('./admin.routes');

const router = Router();

/**
 * ═══════════════════════════════════════════════════
 * Route Aggregator
 * All route modules are mounted here under /api/v1
 * ═══════════════════════════════════════════════════
 */

// ─── Public Routes (no auth) ───
router.use('/', publicRoutes);

// ─── Admin Routes (auth required) ───
router.use('/admin', adminRoutes);

// ─── Auth Routes ───
// TODO: Mount auth routes when implemented
// router.use('/auth', authRoutes);

module.exports = router;
