const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

export class ApiError extends Error {
  constructor(payload, status) {
    super(payload?.error?.message || 'Request failed');
    this.name = 'ApiError';
    this.status = status;
    this.code = payload?.error?.code;
    this.fields = payload?.error?.fields;
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  if (!isFormData && options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
    body:
      options.body && !isFormData && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : { success: response.ok };

  if (!response.ok || payload.success === false) {
    throw new ApiError(payload, response.status);
  }

  return payload;
}
