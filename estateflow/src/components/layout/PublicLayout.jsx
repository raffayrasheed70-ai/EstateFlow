import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { DEVELOPER } from '../../utils/constants'

// Layout for the public-facing listings (no sidebar, simple header + footer).
export default function PublicLayout() {
  const { settings } = useSettings()
  const { pathname } = useLocation()

  // Start each public page at the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="public-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="public-header">
        <div className="container public-header-inner">
          <Link to="/listings" className="public-brand">
            <span className="brand-mark" aria-hidden="true">
              <i className="bi bi-house-heart-fill" />
            </span>
            <span className="brand-name">{settings.profile.businessName}</span>
          </Link>
          <nav className="public-nav" aria-label="Public navigation">
            <NavLink to="/listings" end className="public-nav-link">
              Listings
            </NavLink>
            <Link to="/" className="btn btn-ef-primary btn-sm">
              <i className="bi bi-speedometer2 me-2" aria-hidden="true" />
              Admin dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="public-main" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="container">
          <p className="mb-1">
            Demo website built with EstateFlow by <strong>Muhammad Raffay</strong> ({DEVELOPER.role}).
          </p>
          <p className="mb-0 small">
            Listings are sample data stored in your browser. Inquiries are saved locally for this demo
            and are not sent to any agency.
          </p>
        </div>
      </footer>
    </div>
  )
}
