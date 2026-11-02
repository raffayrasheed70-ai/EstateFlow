import { useMemo, useState } from 'react'
import EmptyState, { ErrorState } from '../components/common/EmptyState'
import { SkeletonCards } from '../components/common/LoadingState'
import PropertyCard from '../components/properties/PropertyCard'
import PropertyFilters from '../components/properties/PropertyFilters'
import { useProperties } from '../hooks/useProperties'
import { DEFAULT_FILTERS, filterProperties } from '../utils/propertyFilters'

// Public-facing browsing page. Only properties marked "Available" are shown.
export default function PublicListings() {
  const { properties, loading, error, reload } = useProperties()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const available = useMemo(() => properties.filter((p) => p.status === 'Available'), [properties])
  const visible = useMemo(() => filterProperties(available, filters), [available, filters])

  return (
    <>
      <section className="public-hero">
        <div className="container">
          <span className="eyebrow">Property listings</span>
          <h1>Find a place that fits your life</h1>
          <p>
            Browse homes, apartments, villas and commercial spaces. Send an inquiry from any listing —
            in this demo it is saved locally in the admin Leads page.
          </p>
        </div>
      </section>

      <div className="container public-content">
        <PropertyFilters filters={filters} onChange={setFilters} showStatus={false} />

        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <SkeletonCards />
        ) : (
          <>
            <p className="result-count" aria-live="polite">
              {visible.length} {visible.length === 1 ? 'property' : 'properties'} available
            </p>
            {visible.length === 0 ? (
              <div className="ef-card">
                <EmptyState
                  icon="bi-search"
                  title="No listings found"
                  message={
                    available.length === 0
                      ? 'There are no available properties right now.'
                      : 'Try changing your search or filters.'
                  }
                />
              </div>
            ) : (
              <div className="property-grid">
                {visible.map((property) => (
                  <PropertyCard key={property.id} property={property} to={`/listings/${property.id}`} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
