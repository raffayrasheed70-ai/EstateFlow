import { Link } from 'react-router-dom'
import { formatRelative } from '../../utils/dates'
import EmptyState from '../common/EmptyState'
import LeadStatusBadge from '../leads/LeadStatusBadge'

// Timeline of the newest properties and leads (derived from real records).
export function RecentActivity({ items }) {
  return (
    <section className="ef-card list-card" aria-label="Recent activity">
      <div className="card-head">
        <div>
          <h2 className="card-title">Recent activity</h2>
          <p className="card-subtitle">Newest properties and leads</p>
        </div>
      </div>
      {items.length === 0 ? (
        <EmptyState icon="bi-activity" title="No activity yet" message="Add a property or lead to get started." />
      ) : (
        <ul className="activity-list">
          {items.map((item) => (
            <li key={item.id} className="activity-item">
              <span className={`activity-dot ${item.kind}`} aria-hidden="true">
                <i className={`bi ${item.kind === 'property' ? 'bi-building' : 'bi-person-plus'}`} />
              </span>
              <div className="activity-text">
                <span className="activity-title">{item.title}</span>
                <span className="activity-detail">{item.detail}</span>
              </div>
              <time className="activity-time" dateTime={item.date}>
                {formatRelative(item.date)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// Leads that came in through the public inquiry form.
export function RecentInquiries({ inquiries, propertyTitles }) {
  return (
    <section className="ef-card list-card" aria-label="Recent inquiries">
      <div className="card-head">
        <div>
          <h2 className="card-title">Recent inquiries</h2>
          <p className="card-subtitle">Submitted through the public listings</p>
        </div>
        <Link to="/leads" className="card-link">
          View all
        </Link>
      </div>
      {inquiries.length === 0 ? (
        <EmptyState
          icon="bi-chat-left-text"
          title="No website inquiries yet"
          message="Open a public listing and send an inquiry to see it here."
          action={
            <Link to="/listings" className="btn btn-ef-ghost btn-sm">
              Open public listings
            </Link>
          }
        />
      ) : (
        <ul className="activity-list">
          {inquiries.map((lead) => (
            <li key={lead.id} className="activity-item">
              <span className="activity-dot lead" aria-hidden="true">
                <i className="bi bi-chat-left-text" />
              </span>
              <div className="activity-text">
                <span className="activity-title">{lead.name}</span>
                <span className="activity-detail">
                  {propertyTitles[lead.propertyId] || 'General inquiry'}
                </span>
              </div>
              <div className="activity-side">
                <LeadStatusBadge status={lead.status} />
                <time className="activity-time" dateTime={lead.createdAt}>
                  {formatRelative(lead.createdAt)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
