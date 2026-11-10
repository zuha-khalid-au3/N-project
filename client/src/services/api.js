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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableFailure(error, status) {
  if (status === 408 || status === 425 || status === 429 || status >= 500) return true;
  if (!error) return false;
  const message = String(error.message || error).toLowerCase();
  return (
    error.name === 'TypeError' ||
    error.name === 'AbortError' ||
    message.includes('failed to fetch') ||
    message.includes('network') ||
    message.includes('load failed')
  );
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const method = String(options.method || 'GET').toUpperCase();
  const retries = options.retries ?? (method === 'GET' ? 3 : 0);
  const timeoutMs = options.timeoutMs ?? 20000;

  if (!isFormData && options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer =
      controller && timeoutMs
        ? setTimeout(() => controller.abort(), timeoutMs)
        : null;

    try {
      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        method,
        headers,
        credentials: 'include',
        signal: controller?.signal || options.signal,
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
        const error = new ApiError(payload, response.status);
        if (attempt < retries && isRetryableFailure(error, response.status)) {
          lastError = error;
          await sleep(1500 * (attempt + 1));
          continue;
        }
        throw error;
      }

      return payload;
    } catch (error) {
      lastError = error;
      if (attempt < retries && isRetryableFailure(error, error?.status)) {
        await sleep(1500 * (attempt + 1));
        continue;
      }

      if (error?.name === 'AbortError') {
        throw new ApiError(
          { error: { message: 'The server took too long to respond. Please try again.' } },
          408
        );
      }
      if (error?.name === 'TypeError') {
        throw new ApiError(
          {
            error: {
              message:
                'Unable to reach the server. It may be waking up — wait a few seconds and retry.',
            },
          },
          0
        );
      }
      throw error;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  throw lastError;
}
