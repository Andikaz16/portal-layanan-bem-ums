const Joi = require('joi');

/**
 * Create a validation middleware from a Joi schema.
 * @param {Joi.ObjectSchema} schema - Joi validation schema
 * @param {'body'|'query'|'params'} source - Request property to validate
 * @returns {import('express').RequestHandler}
 */
const validate = (schema, source = 'body') => {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,      // Collect all errors, not just the first
      stripUnknown: true,     // Remove unknown fields
      errors: {
        wrap: { label: false }, // Don't wrap labels in quotes
      },
    });

    if (error) {
      // Pass Joi error to the global error handler
      return next(error);
    }

    // Replace request source with validated & sanitized data
    req[source] = value;
    return next();
  };
};

// ════════════════════════════════════════════════════════
// Validation Schemas
// ════════════════════════════════════════════════════════

/**
 * Schema for POST /api/v1/reports — Create new report
 */
const createReportSchema = Joi.object({
  student_name: Joi.string()
    .trim()
    .min(3)
    .max(150)
    .required()
    .messages({
      'string.empty': 'Nama lengkap wajib diisi',
      'string.min': 'Nama lengkap minimal 3 karakter',
      'string.max': 'Nama lengkap maksimal 150 karakter',
      'any.required': 'Nama lengkap wajib diisi',
    }),

  student_nim: Joi.string()
    .trim()
    .pattern(/^[A-Za-z0-9]{8,15}$/)
    .required()
    .messages({
      'string.empty': 'NIM wajib diisi',
      'string.pattern.base': 'NIM harus berupa 8-15 digit huruf dan angka',
      'any.required': 'NIM wajib diisi',
    }),

  student_email: Joi.string()
    .trim()
    .email()
    .max(150)
    .required()
    .messages({
      'string.empty': 'Email kampus wajib diisi',
      'string.email': 'Format email tidak valid',
      'string.max': 'Email maksimal 150 karakter',
      'any.required': 'Email kampus wajib diisi',
    }),

  student_phone: Joi.string()
    .trim()
    .pattern(/^(\+62|62|0)8[1-9][0-9]{6,11}$/)
    .required()
    .messages({
      'string.empty': 'No. WhatsApp wajib diisi',
      'string.pattern.base': 'Format nomor telepon tidak valid (contoh: 081234567890)',
      'any.required': 'No. WhatsApp wajib diisi',
    }),

  student_faculty: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.empty': 'Fakultas wajib diisi',
      'string.max': 'Fakultas maksimal 100 karakter',
      'any.required': 'Fakultas wajib diisi',
    }),

  student_program: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.empty': 'Program studi wajib diisi',
      'string.max': 'Program studi maksimal 100 karakter',
      'any.required': 'Program studi wajib diisi',
    }),

  is_anonymous: Joi.boolean()
    .default(false),

  category_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Kategori harus berupa angka',
      'any.required': 'Kategori laporan wajib dipilih',
    }),

  subject: Joi.string()
    .trim()
    .min(10)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Judul laporan wajib diisi',
      'string.min': 'Judul laporan minimal 10 karakter',
      'string.max': 'Judul laporan maksimal 255 karakter',
      'any.required': 'Judul laporan wajib diisi',
    }),

  description: Joi.string()
    .trim()
    .min(50)
    .required()
    .messages({
      'string.empty': 'Isi laporan wajib diisi',
      'string.min': 'Isi laporan minimal 50 karakter',
      'any.required': 'Isi laporan wajib diisi',
    }),

  attachments_base64: Joi.array()
    .items(Joi.string())
    .optional(),
});

/**
 * Schema for GET /api/v1/reports/track/:ticketCode
 */
const trackReportSchema = Joi.object({
  ticketCode: Joi.string()
    .trim()
    .pattern(/^BEM-[A-Za-z0-9]{4}$/)
    .required()
    .messages({
      'string.pattern.base': 'Format kode tiket tidak valid (contoh: BEM-X9A2)',
      'any.required': 'Kode tiket wajib diisi',
    }),
});

module.exports = {
  validate,
  createReportSchema,
  trackReportSchema,
};
