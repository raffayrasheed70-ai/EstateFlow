// Small, defensive wrapper around localStorage.
// localStorage can throw (private mode, quota exceeded) or contain broken JSON,
// so every call is wrapped in try/catch and never crashes the app.

const CHANGE_EVENT = 'estateflow:change'

export function readJSON(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }))
    return true
  } catch {
    return false
  }
}

export function removeKey(key) {
  try {
    window.localStorage.removeItem(key)
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }))
  } catch {
    // ignore
  }
}

// Lets hooks reload when data changes elsewhere (another component, or
// another browser tab via the native "storage" event).
export function subscribeToChanges(callback) {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

export function createId(prefix) {
  const random =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${prefix}-${Date.now().toString(36)}-${random}`
}
