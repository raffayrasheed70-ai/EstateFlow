import { Link } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { formatDate } from '../../utils/dates'
import SafeImage from '../common/SafeImage'
import { ListingBadge, StatusBadge } from './PropertyBadges'

// Table view of properties (alternative to the card grid).
export default function PropertyTable({ properties, onEdit, onDelete }) {
  const { price } = useSettings()

  return (
    <div className="ef-card table-card">
      <div className="table-responsive">
        <table className="table ef-table align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">Property</th>
              <th scope="col">Type</th>
              <th scope="col">Listing</th>
              <th scope="col">Price</th>
              <th scope="col">Status</th>
              <th scope="col">Added</th>
              <th scope="col" className="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id}>
                <td>
                  <div className="table-property">
                    <SafeImage src={property.imageUrl} alt="" className="table-thumb" />
                    <div>
                      <Link to={`/properties/${property.id}`} className="table-link">
                        {property.title}
                      </Link>
                      <div className="text-muted small">
                        {property.city}
                        {property.ownerName ? ` · ${property.ownerName}` : ''}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{property.type}</td>
                <td>
                  <ListingBadge listingType={property.listingType} />
                </td>
                <td className="fw-semibold text-nowrap">{price(property.price, property.listingType)}</td>
                <td>
                  <StatusBadge status={property.status} />
                </td>
                <td className="text-nowrap">{formatDate(property.createdAt)}</td>
                <td className="text-end text-nowrap">
                  <Link
                    to={`/properties/${property.id}`}
                    className="icon-btn"
                    aria-label={`View ${property.title}`}
                    title="View"
                  >
                    <i className="bi bi-eye" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => onEdit(property)}
                    aria-label={`Edit ${property.title}`}
                    title="Edit"
                  >
                    <i className="bi bi-pencil" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn-danger"
                    onClick={() => onDelete(property)}
                    aria-label={`Delete ${property.title}`}
                    title="Delete"
                  >
                    <i className="bi bi-trash" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
