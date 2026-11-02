import { Link } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { CLOSED_LEAD_STATUSES } from '../../utils/constants'
import { formatDate, isOverdue } from '../../utils/dates'
import LeadStatusBadge from './LeadStatusBadge'

// Read-only lead summary shown inside a modal.
export default function LeadDetails({ lead, property }) {
  const { money } = useSettings()
  const overdue = !CLOSED_LEAD_STATUSES.includes(lead.status) && isOverdue(lead.followUpDate)

  return (
    <div>
      <div className="detail-head">
        <LeadStatusBadge status={lead.status} />
        {overdue && (
          <span className="overdue-flag">
            <i className="bi bi-exclamation-circle me-1" aria-hidden="true" />
            Follow-up overdue
          </span>
        )}
      </div>

      <dl className="detail-list">
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${lead.email}`}>{lead.email}</a>
          </dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>
            <a href={`tel:${lead.phone.replace(/\s/g, '')}`}>{lead.phone}</a>
          </dd>
        </div>
        <div>
          <dt>Interested property</dt>
          <dd>
            {property ? <Link to={`/properties/${property.id}`}>{property.title}</Link> : 'Not specified'}
          </dd>
        </div>
        <div>
          <dt>Budget</dt>
          <dd>{lead.budget ? money(lead.budget) : 'Not specified'}</dd>
        </div>
        <div>
          <dt>Lead source</dt>
          <dd>{lead.source}</dd>
        </div>
        <div>
          <dt>Follow-up date</dt>
          <dd>{formatDate(lead.followUpDate)}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{formatDate(lead.createdAt)}</dd>
        </div>
      </dl>

      <h3 className="detail-subtitle">Notes</h3>
      <p className="detail-notes">{lead.notes || 'No notes yet.'}</p>
    </div>
  )
}
