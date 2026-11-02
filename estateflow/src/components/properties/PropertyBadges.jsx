import { PROPERTY_STATUS_COLORS } from '../../utils/constants'

export function ListingBadge({ listingType }) {
  const isSale = listingType === 'For Sale'
  return <span className={`pill ${isSale ? 'pill-navy' : 'pill-gold'}`}>{listingType}</span>
}

export function StatusBadge({ status }) {
  return (
    <span className="status-badge" style={{ '--badge-color': PROPERTY_STATUS_COLORS[status] || '#6F7C8E' }}>
      {status}
    </span>
  )
}
