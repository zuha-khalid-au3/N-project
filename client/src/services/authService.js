import { apiRequest } from './api.js';

export function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function logout() {
  return apiRequest('/auth/logout', { method: 'POST' });
}

export function getMe() {
  return apiRequest('/auth/me');
}
