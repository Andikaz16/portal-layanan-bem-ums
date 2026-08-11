const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { sendError } = require('./utils/response');

/**
 * ═══════════════════════════════════════════════════
 * Express Application Setup
 * ═══════════════════════════════════════════════════
 */

const app = express();
const path = require('path');

// ─── Security Headers ───
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ─── CORS ───
app.use(
  cors({
    origin: env.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─── Static Uploads ───
// Served after CORS but before strict helmet policies
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Request Logging ───
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Body Parsers ───
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Rate Limiting (public endpoints) ───
const publicLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
  },
});

// Stricter rate limit specifically for report submission
const reportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 submissions per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Anda telah mengirim terlalu banyak laporan. Silakan tunggu 15 menit.',
  },
});

// Apply general limiter to all API routes
app.use('/api/', publicLimiter);

// Apply stricter limiter to report submission endpoint
app.use('/api/v1/reports', reportLimiter);

// ─── Health Check ───
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Portal Advokasi API is running',
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  });
});

// ─── API Routes ───
app.use('/api/v1', routes);

// ─── 404 Handler ───
app.use((_req, res) => {
  sendError(res, {
    statusCode: 404,
    message: 'Endpoint tidak ditemukan',
  });
});

// ─── Global Error Handler ───
app.use(errorHandler);

module.exports = app;
