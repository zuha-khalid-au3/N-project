const TOKEN_KEY = 'nemat_admin_token';

let memoryToken = '';

function readStore(store) {
  try {
    return store?.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function writeStore(store, token) {
  try {
    if (!token) store?.removeItem(TOKEN_KEY);
    else store?.setItem(TOKEN_KEY, token);
  } catch {
    // Private mode / blocked storage — memory token still works for this tab session.
  }
}

export function getAuthToken() {
  if (memoryToken) return memoryToken;
  memoryToken = readStore(window.sessionStorage) || readStore(window.localStorage) || '';
  return memoryToken;
}

export function setAuthToken(token) {
  memoryToken = token || '';
  writeStore(window.sessionStorage, memoryToken);
  writeStore(window.localStorage, memoryToken);
}

export function clearAuthToken() {
  setAuthToken('');
}
