import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="notfound">
      <p className="notfound-code">404</p>
      <h1 className="page-title">Page not found</h1>
      <p className="text-muted">The page you are looking for does not exist or has moved.</p>
      <div className="d-flex gap-2 justify-content-center flex-wrap">
        <Link to="/" className="btn btn-ef-primary">
          Go to dashboard
        </Link>
        <Link to="/listings" className="btn btn-ef-ghost">
          Browse listings
        </Link>
      </div>
    </div>
  )
}
