import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState, { ErrorState } from '../components/common/EmptyState'
import { SkeletonCards, SkeletonRows } from '../components/common/LoadingState'
import Modal from '../components/common/Modal'
import PageHeader from '../components/common/PageHeader'
import PropertyCard from '../components/properties/PropertyCard'
import PropertyFilters from '../components/properties/PropertyFilters'
import PropertyForm from '../components/properties/PropertyForm'
import PropertyStats from '../components/properties/PropertyStats'
import PropertyTable from '../components/properties/PropertyTable'
import { useToast } from '../context/ToastContext'
import { useProperties } from '../hooks/useProperties'
import { DEFAULT_FILTERS, filterProperties, hasActiveFilters } from '../utils/propertyFilters'

export default function Properties() {
  const toast = useToast()
  const { properties, loading, error, reload, addProperty, editProperty, removeProperty } = useProperties()
  const [searchParams, setSearchParams] = useSearchParams()

  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [view, setView] = useState('grid') // 'grid' | 'table'
  // formState: null (closed) | { property: null } (add) | { property } (edit)
  // The dashboard's "Add property" button links here with ?new=1.
  const [formState, setFormState] = useState(() => (searchParams.get('new') === '1' ? { property: null } : null))
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  // Remove the ?new=1 flag after it has been used, so a refresh doesn't reopen the form.
  useEffect(() => {
    if (searchParams.get('new')) setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams])

  const visible = useMemo(() => filterProperties(properties, filters), [properties, filters])

  const handleSubmit = async (values) => {
    setSaving(true)
    try {
      if (formState.property) {
        await editProperty(formState.property.id, values)
        toast.success('Property updated.')
      } else {
        await addProperty(values)
        toast.success('Property added.')
      }
      setFormState(null)
    } catch (err) {
      toast.error(err.message || 'Could not save the property.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await removeProperty(toDelete.id)
      toast.success(`"${toDelete.title}" was deleted.`)
      setToDelete(null)
    } catch (err) {
      toast.error(err.message || 'Could not delete the property.')
    } finally {
      setSaving(false)
    }
  }

  const viewToggle = (
    <div className="btn-group view-toggle" role="group" aria-label="Choose layout">
      <button
        type="button"
        className={`btn btn-sm ${view === 'grid' ? 'active' : ''}`}
        onClick={() => setView('grid')}
        aria-pressed={view === 'grid'}
      >
        <i className="bi bi-grid me-1" aria-hidden="true" /> Grid
      </button>
      <button
        type="button"
        className={`btn btn-sm ${view === 'table' ? 'active' : ''}`}
        onClick={() => setView('table')}
        aria-pressed={view === 'table'}
      >
        <i className="bi bi-list-ul me-1" aria-hidden="true" /> Table
      </button>
    </div>
  )

  return (
    <>
      <PageHeader
        title="Properties"
        subtitle="Create, edit and manage your listings."
        actions={
          <button type="button" className="btn btn-ef-primary" onClick={() => setFormState({ property: null })}>
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Add property
          </button>
        }
      />

      {!loading && !error && <PropertyStats properties={properties} />}

      <PropertyFilters filters={filters} onChange={setFilters} extra={viewToggle} />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        view === 'grid' ? <SkeletonCards /> : <SkeletonRows />
      ) : (
        <>
          <p className="result-count" aria-live="polite">
            Showing {visible.length} of {properties.length} {properties.length === 1 ? 'property' : 'properties'}
          </p>

          {visible.length === 0 ? (
            <div className="ef-card">
              {properties.length === 0 ? (
                <EmptyState
                  icon="bi-buildings"
                  title="No properties yet"
                  message="Add your first listing, or restore the sample data from Settings."
                  action={
                    <button type="button" className="btn btn-ef-primary" onClick={() => setFormState({ property: null })}>
                      Add property
                    </button>
                  }
                />
              ) : (
                <EmptyState
                  icon="bi-search"
                  title="No properties match your filters"
                  message="Try a different search or reset the filters."
                  action={
                    hasActiveFilters(filters) && (
                      <button type="button" className="btn btn-ef-ghost" onClick={() => setFilters(DEFAULT_FILTERS)}>
                        Reset filters
                      </button>
                    )
                  }
                />
              )}
            </div>
          ) : view === 'grid' ? (
            <div className="property-grid">
              {visible.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onEdit={(p) => setFormState({ property: p })}
                  onDelete={setToDelete}
                />
              ))}
            </div>
          ) : (
            <PropertyTable
              properties={visible}
              onEdit={(p) => setFormState({ property: p })}
              onDelete={setToDelete}
            />
          )}
        </>
      )}

      {formState && (
        <Modal
          title={formState.property ? 'Edit property' : 'Add property'}
          onClose={() => !saving && setFormState(null)}
        >
          <PropertyForm
            property={formState.property}
            submitting={saving}
            onSubmit={handleSubmit}
            onCancel={() => setFormState(null)}
          />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete property?"
          message={`"${toDelete.title}" will be permanently removed. This cannot be undone.`}
          busy={saving}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  )
}
