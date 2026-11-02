import { LEAD_STATUS_COLORS } from '../../utils/constants'

export default function LeadStatusBadge({ status }) {
  return (
    <span className="status-badge" style={{ '--badge-color': LEAD_STATUS_COLORS[status] || '#6F7C8E' }}>
      {status}
    </span>
  )
}
