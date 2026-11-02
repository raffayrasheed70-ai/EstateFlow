import { Link } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import SafeImage from '../common/SafeImage'
import { ListingBadge, StatusBadge } from './PropertyBadges'

// One property in the grid.
// - Admin mode: pass onEdit/onDelete to show manage buttons.
// - Public mode: pass `to` to link the whole card to the public detail page.
export default function PropertyCard({ property, to, onEdit, onDelete }) {
  const { price } = useSettings()
  const detailsLink = to || `/properties/${property.id}`

  return (
    <article className="ef-card property-card">
      <Link to={detailsLink} className="property-media" aria-label={`View ${property.title}`}>
        <SafeImage src={property.imageUrl} alt={property.title} className="property-img" />
        <span className="property-badges">
          <ListingBadge listingType={property.listingType} />
          <StatusBadge status={property.status} />
        </span>
      </Link>

      <div className="property-body">
        <p className="property-price">{price(property.price, property.listingType)}</p>
        <h3 className="property-title">
          <Link to={detailsLink}>{property.title}</Link>
        </h3>
        <p className="property-location">
          <i className="bi bi-geo-alt" aria-hidden="true" /> {property.address}, {property.city}
        </p>

        <ul className="property-specs" aria-label="Property features">
          {property.type !== 'Commercial' && property.type !== 'Plot' && (
            <>
              <li>
                <i className="bi bi-door-closed" aria-hidden="true" /> {property.bedrooms} Beds
              </li>
              <li>
                <i className="bi bi-droplet" aria-hidden="true" /> {property.bathrooms} Baths
              </li>
            </>
          )}
          <li>
            <i className="bi bi-arrows-fullscreen" aria-hidden="true" /> {property.area}{' '}
            {property.areaUnit}
          </li>
          <li>
            <i className="bi bi-tag" aria-hidden="true" /> {property.type}
          </li>
        </ul>

        {(onEdit || onDelete) && (
          <div className="property-actions">
            <Link to={detailsLink} className="btn btn-ef-ghost btn-sm">
              <i className="bi bi-eye me-1" aria-hidden="true" /> View
            </Link>
            {onEdit && (
              <button type="button" className="btn btn-ef-ghost btn-sm" onClick={() => onEdit(property)}>
                <i className="bi bi-pencil me-1" aria-hidden="true" /> Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="btn btn-ef-danger btn-sm"
                onClick={() => onDelete(property)}
                aria-label={`Delete ${property.title}`}
              >
                <i className="bi bi-trash me-1" aria-hidden="true" /> Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
