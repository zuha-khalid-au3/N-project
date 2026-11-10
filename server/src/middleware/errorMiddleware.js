import { failure } from '../utils/response.js';

export function notFoundHandler(req, res) {
  return failure(res, 'NOT_FOUND', `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ZodError') {
    const fields = {};
    for (const issue of err.issues || []) {
      const key = issue.path?.join('.') || 'form';
      fields[key] = issue.message;
    }
    return failure(res, 'VALIDATION_ERROR', 'Please correct the highlighted fields', 400, fields);
  }

  if (err.name === 'ValidationError') {
    const fields = {};
    for (const [key, value] of Object.entries(err.errors || {})) {
      fields[key] = value.message;
    }
    return failure(res, 'VALIDATION_ERROR', 'Please correct the highlighted fields', 400, fields);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return failure(res, 'DUPLICATE_ERROR', `${field} already exists`, 409, {
      [field]: `${field} already exists`,
    });
  }

  if (err.name === 'CastError') {
    return failure(res, 'INVALID_ID', 'Invalid identifier', 400);
  }

  if (err.statusCode === 413 || err.type === 'entity.too.large') {
    return failure(res, 'PAYLOAD_TOO_LARGE', 'Request body is too large', 413);
  }

  const status = err.statusCode || 500;
  const message =
    status === 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message || 'An unexpected error occurred';

  return failure(res, err.code || 'SERVER_ERROR', message, status);
}
