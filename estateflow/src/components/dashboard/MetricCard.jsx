import { Link } from 'react-router-dom'

// A single statistic tile. Pass `to` to make the whole tile a link.
export default function MetricCard({ icon, label, value, hint, tone = 'navy', to }) {
  const content = (
    <>
      <span className={`metric-icon tone-${tone}`} aria-hidden="true">
        <i className={`bi ${icon}`} />
      </span>
      <div className="metric-text">
        <span className="metric-label">{label}</span>
        <span className="metric-value">{value}</span>
        {hint && <span className="metric-hint">{hint}</span>}
      </div>
    </>
  )

  return to ? (
    <Link to={to} className="ef-card metric-card metric-link">
      {content}
    </Link>
  ) : (
    <div className="ef-card metric-card">{content}</div>
  )
}
