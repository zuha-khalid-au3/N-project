import { failure } from '../utils/response.js';

const FIELD_LABELS = {
  name: 'Product name',
  sku: 'SKU',
  category: 'Category',
  material: 'Material',
  color: 'Colour',
  shape: 'Shape',
  size: 'Size',
  finish: 'Finish',
  description: 'Description',
  moq: 'Minimum order quantity',
  priceLabel: 'Price label',
  stockStatus: 'Stock status',
  status: 'Status',
  featured: 'Featured',
  images: 'Images',
  'seo.title': 'SEO title',
  'seo.description': 'SEO description',
  email: 'Email',
  password: 'Password',
  phone: 'Phone',
  message: 'Message',
};

function labelForPath(path) {
  if (!path || path === 'form') return 'Form';
  if (FIELD_LABELS[path]) return FIELD_LABELS[path];

  const imageMatch = path.match(/^images\.(\d+)(?:\.(.+))?$/);
  if (imageMatch) {
    const index = Number(imageMatch[1]) + 1;
    const sub = imageMatch[2];
    const subLabels = {
      url: 'URL',
      storageKey: 'file',
      altText: 'alt text',
      sortOrder: 'order',
    };
    return sub ? `Image ${index} ${subLabels[sub] || sub}` : `Image ${index}`;
  }

  return path;
}

function buildValidationMessage(fields) {
  const messages = Object.entries(fields).map(([path, message]) => {
    const label = labelForPath(path);
    if (!message) return `${label} is invalid`;
    if (String(message).toLowerCase().includes(label.toLowerCase())) return message;
    return `${label}: ${message}`;
  });

  if (!messages.length) return 'Please correct the highlighted fields';
  if (messages.length === 1) return messages[0];
  return `Please fix ${messages.length} issues: ${messages.join(' · ')}`;
}

export function notFoundHandler(req, res) {
  return failure(res, 'NOT_FOUND', `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ZodError') {
    const fields = {};
    for (const issue of err.issues || []) {
      const key = issue.path?.length ? issue.path.join('.') : 'form';
      if (!fields[key]) fields[key] = issue.message;
    }
    return failure(res, 'VALIDATION_ERROR', buildValidationMessage(fields), 400, fields);
  }

  if (err.name === 'ValidationError') {
    const fields = {};
    for (const [key, value] of Object.entries(err.errors || {})) {
      fields[key] = value.message;
    }
    return failure(res, 'VALIDATION_ERROR', buildValidationMessage(fields), 400, fields);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    const label = labelForPath(field);
    const message = `${label} already exists. Use a different ${label.toLowerCase()}.`;
    return failure(res, 'DUPLICATE_ERROR', message, 409, {
      [field]: message,
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
