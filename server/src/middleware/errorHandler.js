const { AppError } = require('../utils/errors');
const { sendError } = require('../utils/response');

/**
 * Global error handler middleware.
 * Catches all errors thrown in routes and middleware.
 */
const errorHandler = (err, req, res, _next) => {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('\n❌ Error:', err);
  } else {
    console.error('❌ Error:', err.message);
  }

  // Handle Joi validation errors
  if (err.isJoi || err.name === 'ValidationError') {
    const validationErrors = err.details
      ? err.details.map((detail) => ({
          field: detail.path?.join('.') || 'unknown',
          message: detail.message.replace(/"/g, ''),
        }))
      : [{ field: 'unknown', message: err.message }];

    return sendError(res, {
      statusCode: 400,
      message: 'Validasi gagal',
      errors: validationErrors,
    });
  }

  // Handle known operational errors (AppError and subclasses)
  if (err instanceof AppError && err.isOperational) {
    return sendError(res, {
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // Handle PostgreSQL unique constraint violations
  if (err.code === '23505') {
    return sendError(res, {
      statusCode: 409,
      message: 'Data duplikat terdeteksi',
    });
  }

  // Handle PostgreSQL foreign key violations
  if (err.code === '23503') {
    return sendError(res, {
      statusCode: 400,
      message: 'Referensi data tidak valid (foreign key)',
    });
  }

  // Handle unexpected errors
  return sendError(res, {
    statusCode: 500,
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Terjadi kesalahan internal server',
  });
};

module.exports = errorHandler;
