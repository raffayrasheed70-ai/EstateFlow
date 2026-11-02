import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import LoadingState from '../components/common/LoadingState'
import Modal from '../components/common/Modal'
import SafeImage from '../components/common/SafeImage'
import LeadStatusBadge from '../components/leads/LeadStatusBadge'
import { ListingBadge, StatusBadge } from '../components/properties/PropertyBadges'
import PropertyForm from '../components/properties/PropertyForm'
import { useSettings } from '../context/SettingsContext'
import { useToast } from '../context/ToastContext'
import { useLeads } from '../hooks/useLeads'
import { useProperties, useProperty } from '../hooks/useProperties'
import { formatDate } from '../utils/dates'

// Admin view of a single property, with edit/delete and the leads linked to it.
export default function PropertyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { price } = useSettings()
  const { property, loading } = useProperty(id)
  const { editProperty, removeProperty } = useProperties()
  const { leads } = useLeads()
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [busy, setBusy] = useState(false)

  const relatedLeads = useMemo(() => leads.filter((l) => l.propertyId === id), [leads, id])

  if (loading) return <LoadingState label="Loading property…" />

  if (!property) {
    return (
      <div className="ef-card">
        <EmptyState
          icon="bi-house-x"
          title="Property not found"
          message="It may have been deleted."
          action={
            <Link to="/properties" className="btn btn-ef-primary">
              Back to properties
            </Link>
          }
        />
      </div>
    )
  }

  const handleSave = async (values) => {
    setBusy(true)
    try {
      await editProperty(property.id, values)
      toast.success('Property updated.')
      setEditing(false)
    } catch (err) {
      toast.error(err.message || 'Could not save the property.')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    setBusy(true)
    try {
      await removeProperty(property.id)
      toast.success('Property deleted.')
      navigate('/properties')
    } catch (err) {
      toast.error(err.message || 'Could not delete the property.')
      setBusy(false)
    }
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumb-row">
        <Link to="/properties">
          <i className="bi bi-arrow-left me-1" aria-hidden="true" />
          Properties
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

            <div className="spec-grid">
              {property.type !== 'Plot' && (
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
                <span className="spec-label">Added</span>
                <span className="spec-value">{formatDate(property.createdAt)}</span>
              </div>
            </div>

            <h2 className="detail-subtitle">Description</h2>
            <p className="detail-notes">{property.description || 'No description.'}</p>
          </div>
        </div>

        <aside className="detail-side">
          <div className="ef-card p-3">
            <h2 className="card-title mb-3">Manage</h2>
            <div className="d-grid gap-2">
              <button type="button" className="btn btn-ef-primary" onClick={() => setEditing(true)}>
                <i className="bi bi-pencil me-2" aria-hidden="true" />
                Edit property
              </button>
              <Link to={`/listings/${property.id}`} className="btn btn-ef-ghost">
                <i className="bi bi-globe2 me-2" aria-hidden="true" />
                View public page
              </Link>
              <button type="button" className="btn btn-ef-danger" onClick={() => setConfirmDelete(true)}>
                <i className="bi bi-trash me-2" aria-hidden="true" />
                Delete
              </button>
            </div>
          </div>

          <div className="ef-card p-3">
            <h2 className="card-title mb-3">Owner / agent</h2>
            <p className="mb-1 fw-semibold">{property.ownerName || 'Not provided'}</p>
            {property.contactNumber ? (
              <a href={`tel:${property.contactNumber.replace(/\s/g, '')}`}>
                <i className="bi bi-telephone me-1" aria-hidden="true" />
                {property.contactNumber}
              </a>
            ) : (
              <span className="text-muted small">No contact number</span>
            )}
          </div>

          <div className="ef-card p-3">
            <h2 className="card-title mb-3">Interested leads ({relatedLeads.length})</h2>
            {relatedLeads.length === 0 ? (
              <p className="text-muted small mb-0">No leads are linked to this property yet.</p>
            ) : (
              <ul className="mini-list">
                {relatedLeads.map((lead) => (
                  <li key={lead.id}>
                    <span>{lead.name}</span>
                    <LeadStatusBadge status={lead.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {editing && (
        <Modal title="Edit property" onClose={() => !busy && setEditing(false)}>
          <PropertyForm
            property={property}
            submitting={busy}
            onSubmit={handleSave}
            onCancel={() => setEditing(false)}
          />
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete property?"
          message={`"${property.title}" will be permanently removed. This cannot be undone.`}
          busy={busy}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  )
}
