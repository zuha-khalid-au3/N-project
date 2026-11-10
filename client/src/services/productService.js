import { apiRequest } from './api.js';

function toQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function fetchBusiness() {
  return apiRequest('/business');
}

export function fetchProducts(params) {
  return apiRequest(`/products${toQuery(params)}`);
}

export function fetchFeaturedProducts() {
  return apiRequest('/products/featured');
}

export function fetchProductBySlug(slug) {
  return apiRequest(`/products/${encodeURIComponent(slug)}`);
}

export function fetchFilters() {
  return apiRequest('/filters');
}

export function fetchCategories() {
  return apiRequest('/categories');
}

export function fetchAdminDashboard() {
  return apiRequest('/admin/dashboard');
}

export function fetchAdminProducts(params) {
  return apiRequest(`/admin/products${toQuery(params)}`);
}

export function fetchAdminProduct(id) {
  return apiRequest(`/admin/products/${id}`);
}

export function createProduct(payload) {
  return apiRequest('/admin/products', { method: 'POST', body: payload });
}

export function updateProduct(id, payload) {
  return apiRequest(`/admin/products/${id}`, { method: 'PATCH', body: payload });
}

export function deleteProduct(id) {
  return apiRequest(`/admin/products/${id}`, { method: 'DELETE' });
}

export function publishProduct(id) {
  return apiRequest(`/admin/products/${id}/publish`, { method: 'POST' });
}

export function unpublishProduct(id) {
  return apiRequest(`/admin/products/${id}/unpublish`, { method: 'POST' });
}

export async function uploadProductImage(file, { altText = '', sortOrder = 0, onProgress } = {}) {
  const sign = await apiRequest('/admin/uploads/sign', {
    method: 'POST',
    body: {
      filename: file.name,
      contentType: file.type,
      size: file.size,
    },
  });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('storageKey', sign.data.intent.storageKey);
  formData.append('altText', altText);
  formData.append('sortOrder', String(sortOrder));

  // Progress via XHR for better UX feedback
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
  const result = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/admin/uploads`);
    xhr.withCredentials = true;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      try {
        const payload = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300 && payload.success !== false) {
          resolve(payload);
        } else {
          reject(payload);
        }
      } catch (error) {
        reject(error);
      }
    };
    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.send(formData);
  });

  return result;
}

export function submitInquiry(payload) {
  return apiRequest('/inquiries', { method: 'POST', body: payload });
}

export function fetchInquiries() {
  return apiRequest('/admin/inquiries');
}

export function updateInquiryStatus(id, status) {
  return apiRequest(`/admin/inquiries/${id}`, { method: 'PATCH', body: { status } });
}
