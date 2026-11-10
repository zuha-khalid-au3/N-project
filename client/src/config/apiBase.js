/**
 * Prefer same-origin `/api` so the Cloudflare worker (prod) and Vite proxy (dev)
 * keep admin auth first-party on mobile Safari.
 * Override with VITE_API_URL only when calling the API host directly.
 */
export function getApiBase() {
  const configured = import.meta.env.VITE_API_URL;
  if (configured) return String(configured).replace(/\/$/, '');
  return '/api';
}

export function getAssetOrigin() {
  const apiBase = getApiBase();
  if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
    return apiBase.replace(/\/api\/?$/, '');
  }
  return '';
}
