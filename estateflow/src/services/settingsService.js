import { DEVELOPER, STORAGE_KEYS } from '../utils/constants'
import { readJSON, writeJSON } from '../utils/storage'

export const DEFAULT_SETTINGS = {
  profile: {
    name: DEVELOPER.name,
    role: DEVELOPER.role,
    businessName: 'EstateFlow Demo Agency',
    email: '',
    github: DEVELOPER.github,
    portfolio: DEVELOPER.portfolio,
  },
  // The currency is always PKR; this only controls how prices are written.
  currencyDisplay: 'compact', // 'compact' (1.5 Crore) | 'full' (Rs 15,000,000)
  theme: 'light', // 'light' | 'dark'
}

// Synchronous on purpose: the theme must be applied before the first paint.
export function loadSettings() {
  const stored = readJSON(STORAGE_KEYS.settings, null)
  if (!stored || typeof stored !== 'object') return DEFAULT_SETTINGS
  const profile = { ...DEFAULT_SETTINGS.profile }
  if (stored.profile && typeof stored.profile === 'object') {
    Object.keys(profile).forEach((key) => {
      if (typeof stored.profile[key] === 'string') profile[key] = stored.profile[key]
    })
  }
  return {
    profile,
    currencyDisplay: stored.currencyDisplay === 'full' ? 'full' : 'compact',
    theme: stored.theme === 'dark' ? 'dark' : 'light',
  }
}

export function saveSettings(settings) {
  return writeJSON(STORAGE_KEYS.settings, settings)
}
