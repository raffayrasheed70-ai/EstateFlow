import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'
import LoadingState from '../components/common/LoadingState'
import SafeImage from '../components/common/SafeImage'
import InquiryForm from '../components/properties/InquiryForm'
import { ListingBadge, StatusBadge } from '../components/properties/PropertyBadges'
import { useSettings } from '../context/SettingsContext'
import { useProperty } from '../hooks/useProperties'
import { formatDate } from '../utils/dates'

export default function PublicPropertyDetails() {
  const { id } = useParams()
  const { property, loading } = useProperty(id)
  const { price } = useSettings()

  if (loading) {
    return (
      <div className="container public-content">
        <LoadingState label="Loading property…" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container public-content">
        <div className="ef-card">
          <EmptyState
            icon="bi-house-x"
            title="Property not found"
            message="This listing may have been removed."
            action={
              <Link to="/listings" className="btn btn-ef-primary">
                Back to listings
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const unavailable = property.status !== 'Available'

  return (
    <div className="container public-content">
      <nav aria-label="Breadcrumb" className="breadcrumb-row">
        <Link to="/listings">
          <i className="bi bi-arrow-left me-1" aria-hidden="true" />
          All listings
        </Link>
      </nav>

      <div className="detail-layout">
        <div className="ef-card detail-main">
          <SafeImage src={property.imageUrl} alt={property.title} className="detail-hero" />
          <div className="detail-content">
            <div className="detail-head">
              <ListingBadge listingType={property.listingType} />
              <StatusBadge status={property.status} />
              <span className="pill pill-soft">{property.type}</span>
            </div>
            <h1 className="detail-title">{property.title}</h1>
            <p className="property-location">
              <i className="bi bi-geo-alt" aria-hidden="true" /> {property.address}, {property.city}
            </p>
            <p className="detail-price">{price(property.price, property.listingType)}</p>

            {unavailable && (
              <div className="alert alert-warning" role="status">
                This property is currently marked <strong>{property.status}</strong>. You can still send an
                inquiry about similar options.
              </div>
            )}

            <div className="spec-grid">
              {property.type !== 'Commercial' && property.type !== 'Plot' && (
                <>
                  <div>
                    <span className="spec-label">Bedrooms</span>
                    <span className="spec-value">{property.bedrooms}</span>
                  </div>
                  <div>
                    <span className="spec-label">Bathrooms</span>
                    <span className="spec-value">{property.bathrooms}</span>
                  </div>
                </>
              )}
              <div>
                <span className="spec-label">Area</span>
                <span className="spec-value">
                  {property.area} {property.areaUnit}
                </span>
              </div>
              <div>
                <span className="spec-label">Listed</span>
                <span className="spec-value">{formatDate(property.createdAt)}</span>
              </div>
            </div>

            <h2 className="detail-subtitle">About this property</h2>
            <p className="detail-notes">{property.description}</p>
          </div>
        </div>

        <aside className="detail-side">
          <InquiryForm property={property} />
        </aside>
      </div>
    </div>
  )
}
