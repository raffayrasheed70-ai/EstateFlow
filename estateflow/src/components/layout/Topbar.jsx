import { Link, useLocation } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'

const TITLES = {
  '/': 'Dashboard',
  '/properties': 'Properties',
  '/leads': 'Leads',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
}

function titleFor(pathname) {
  if (TITLES[pathname]) return TITLES[pathname]
  if (pathname.startsWith('/properties/')) return 'Property Details'
  return 'EstateFlow'
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export default function Topbar({ onMenuClick, menuOpen }) {
  const { pathname } = useLocation()
  const { settings, updateSettings } = useSettings()
  const isDark = settings.theme === 'dark'
  const displayName = settings.profile.name || 'Admin'

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn menu-btn"
        onClick={onMenuClick}
        aria-label="Open navigation"
        aria-expanded={menuOpen}
        aria-controls="app-sidebar"
      >
        <i className="bi bi-list" aria-hidden="true" />
      </button>

      <h2 className="topbar-title">{titleFor(pathname)}</h2>

      <div className="topbar-actions">
        <Link to="/listings" className="btn btn-ef-ghost btn-sm d-none d-sm-inline-flex">
          <i className="bi bi-box-arrow-up-right me-2" aria-hidden="true" />
          View public site
        </Link>
        <button
          type="button"
          className="icon-btn"
          onClick={() => updateSettings({ theme: isDark ? 'light' : 'dark' })}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon-stars'}`} aria-hidden="true" />
        </button>
        <Link to="/settings" className="profile-chip" aria-label="Open profile settings">
          <span className="avatar" aria-hidden="true">
            {initials(displayName)}
          </span>
          <span className="profile-text d-none d-md-block">
            <span className="profile-name">{displayName.split('(')[0].trim()}</span>
            <span className="profile-role">{settings.profile.role}</span>
          </span>
        </Link>
      </div>
    </header>
  )
}
