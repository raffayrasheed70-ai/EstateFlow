import { NavLink } from 'react-router-dom'
import { DEVELOPER } from '../../utils/constants'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'bi-grid-1x2', end: true },
  { to: '/properties', label: 'Properties', icon: 'bi-buildings' },
  { to: '/leads', label: 'Leads', icon: 'bi-people' },
  { to: '/analytics', label: 'Analytics', icon: 'bi-bar-chart-line' },
  { to: '/listings', label: 'Public Listings', icon: 'bi-globe2' },
  { to: '/settings', label: 'Settings', icon: 'bi-gear' },
]

// Fixed on desktop; becomes a slide-in drawer on tablet/mobile.
export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? 'show' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="app-sidebar"
        className={`sidebar ${open ? 'open' : ''}`}
        aria-label="Main navigation"
      >
        <div className="sidebar-brand">
          <span className="brand-mark" aria-hidden="true">
            <i className="bi bi-house-heart-fill" />
          </span>
          <span className="brand-name">EstateFlow</span>
          <button
            type="button"
            className="icon-btn sidebar-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-credit">
            Built by <strong>Muhammad Raffay</strong>
            <br />
            Front-End Developer
          </p>
          <div className="sidebar-links">
            <a href={DEVELOPER.github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
              <i className="bi bi-github" aria-hidden="true" /> GitHub
            </a>
            <a href={DEVELOPER.portfolio} target="_blank" rel="noreferrer" aria-label="Portfolio website">
              <i className="bi bi-person-badge" aria-hidden="true" /> Portfolio
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
