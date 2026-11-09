export function safeGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently ignore storage quota/private mode errors
  }
}

export function safeRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently ignore
  }
}
