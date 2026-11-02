import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { loadSettings, saveSettings } from '../services/settingsService'
import { formatPKR, formatPrice } from '../utils/formatCurrency'

const SettingsContext = createContext(null)

// Holds user settings (profile, theme, currency display) for the whole app and
// applies the theme to the <html> element.
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme
    document.documentElement.setAttribute('data-bs-theme', settings.theme)
  }, [settings.theme])

  const updateSettings = useCallback((patch) => {
    setSettings((current) => {
      const next = { ...current, ...patch }
      saveSettings(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      // Formatting helpers that respect the "currency display" preference.
      money: (amount) => formatPKR(amount, settings.currencyDisplay),
      price: (amount, listingType) => formatPrice(amount, listingType, settings.currencyDisplay),
    }),
    [settings, updateSettings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used inside <SettingsProvider>')
  return context
}
