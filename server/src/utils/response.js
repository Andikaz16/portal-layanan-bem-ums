/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {object} options
 * @param {number} [options.statusCode=200]
 * @param {string} [options.message='Berhasil']
 * @param {any} [options.data=null]
 * @param {object} [options.meta=null] - Pagination metadata
 */
const sendSuccess = (res, { statusCode = 200, message = 'Berhasil', data = null, meta = null } = {}) => {
  const response = {
    success: true,
    message,
  };
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  return res.status(statusCode).json(response);
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {object} options
 * @param {number} [options.statusCode=500]
 * @param {string} [options.message='Terjadi kesalahan']
 * @param {Array} [options.errors=null] - Validation errors
 */
const sendError = (res, { statusCode = 500, message = 'Terjadi kesalahan', errors = null } = {}) => {
  const response = {
    success: false,
    message,
  };
  if (errors !== null) response.errors = errors;
  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
