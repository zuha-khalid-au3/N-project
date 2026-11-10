const TOKEN_KEY = 'nemat_admin_token';

export function getAuthToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setAuthToken(token) {
  try {
    if (!token) {
      window.localStorage.removeItem(TOKEN_KEY);
      return;
    }
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Ignore storage failures (private mode quotas, etc.).
  }
}

export function clearAuthToken() {
  setAuthToken('');
}
