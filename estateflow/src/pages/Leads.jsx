import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState, { ErrorState } from '../components/common/EmptyState'
import { SkeletonRows } from '../components/common/LoadingState'
import Modal from '../components/common/Modal'
import PageHeader from '../components/common/PageHeader'
import SearchInput from '../components/common/SearchInput'
import LeadDetails from '../components/leads/LeadDetails'
import LeadForm from '../components/leads/LeadForm'
import LeadsTable from '../components/leads/LeadsTable'
import { useToast } from '../context/ToastContext'
import { useLeads } from '../hooks/useLeads'
import { useProperties } from '../hooks/useProperties'
import { LEAD_SOURCES, LEAD_STATUSES } from '../utils/constants'

const DEFAULT_FILTERS = { search: '', status: 'all', source: 'all' }

export default function Leads() {
  const toast = useToast()
  const { leads, loading, error, reload, addLead, editLead, changeStatus, removeLead } = useLeads()
  const { properties } = useProperties()
  const [searchParams, setSearchParams] = useSearchParams()

  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  // The dashboard's "Add lead" button links here with ?new=1.
  const [formState, setFormState] = useState(() => (searchParams.get('new') === '1' ? { lead: null } : null))
  const [viewing, setViewing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (searchParams.get('new')) setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams])

  const propertyTitles = useMemo(
    () => Object.fromEntries(properties.map((p) => [p.id, p.title])),
    [properties],
  )

  // `leads` is already newest-first (sorted in leadService).
  const visible = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return leads.filter((lead) => {
      if (q && ![lead.name, lead.email, lead.phone].some((v) => v.toLowerCase().includes(q))) return false
      if (filters.status !== 'all' && lead.status !== filters.status) return false
      if (filters.source !== 'all' && lead.source !== filters.source) return false
      return true
    })
  }, [leads, filters])

  const filtersActive = filters.search || filters.status !== 'all' || filters.source !== 'all'

  const handleSubmit = async (values) => {
    setSaving(true)
    try {
      if (formState.lead) {
        await editLead(formState.lead.id, values)
        toast.success('Lead updated.')
      } else {
        await addLead(values)
        toast.success('Lead added.')
      }
      setFormState(null)
    } catch (err) {
      toast.error(err.message || 'Could not save the lead.')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (lead, status) => {
    try {
      await changeStatus(lead.id, status)
      toast.success(`${lead.name} marked as ${status}.`)
    } catch (err) {
      toast.error(err.message || 'Could not update the status.')
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await removeLead(toDelete.id)
      toast.success(`${toDelete.name} was deleted.`)
      setToDelete(null)
    } catch (err) {
      toast.error(err.message || 'Could not delete the lead.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle="Track inquiries from first contact to conversion."
        actions={
          <button type="button" className="btn btn-ef-primary" onClick={() => setFormState({ lead: null })}>
            <i className="bi bi-person-plus me-2" aria-hidden="true" />
            Add lead
          </button>
        }
      />

      <section className="ef-card filter-bar" aria-label="Search and filter leads">
        <div className="filter-search">
          <SearchInput
            value={filters.search}
            onChange={(search) => setFilters({ ...filters, search })}
            placeholder="Search by name, email or phone"
            label="Search leads"
          />
        </div>
        <div className="filter-grid filter-grid-leads">
          <div>
            <label htmlFor="lead-filter-status" className="form-label">
              Status
            </label>
            <select
              id="lead-filter-status"
              className="form-select"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All statuses</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="lead-filter-source" className="form-label">
              Source
            </label>
            <select
              id="lead-filter-source"
              className="form-select"
              value={filters.source}
              onChange={(e) => setFilters({ ...filters, source: e.target.value })}
            >
              <option value="all">All sources</option>
              {LEAD_SOURCES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          {filtersActive && (
            <div className="filter-reset">
              <button type="button" className="btn btn-ef-ghost btn-sm" onClick={() => setFilters(DEFAULT_FILTERS)}>
                <i className="bi bi-x-circle me-1" aria-hidden="true" /> Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <SkeletonRows />
      ) : (
        <>
          <p className="result-count" aria-live="polite">
            Showing {visible.length} of {leads.length} {leads.length === 1 ? 'lead' : 'leads'} · newest first
          </p>
          {visible.length === 0 ? (
            <div className="ef-card">
              <EmptyState
                icon={leads.length === 0 ? 'bi-people' : 'bi-search'}
                title={leads.length === 0 ? 'No leads yet' : 'No leads match your filters'}
                message={
                  leads.length === 0
                    ? 'Add a lead, or send an inquiry from a public listing.'
                    : 'Try a different search or reset the filters.'
                }
                action={
                  leads.length === 0 ? (
                    <button type="button" className="btn btn-ef-primary" onClick={() => setFormState({ lead: null })}>
                      Add lead
                    </button>
                  ) : (
                    <button type="button" className="btn btn-ef-ghost" onClick={() => setFilters(DEFAULT_FILTERS)}>
                      Reset filters
                    </button>
                  )
                }
              />
            </div>
          ) : (
            <LeadsTable
              leads={visible}
              propertyTitles={propertyTitles}
              onView={setViewing}
              onEdit={(lead) => setFormState({ lead })}
              onDelete={setToDelete}
              onStatusChange={handleStatusChange}
            />
          )}
        </>
      )}

      {formState && (
        <Modal title={formState.lead ? 'Edit lead' : 'Add lead'} onClose={() => !saving && setFormState(null)}>
          <LeadForm
            lead={formState.lead}
            properties={properties}
            submitting={saving}
            onSubmit={handleSubmit}
            onCancel={() => setFormState(null)}
          />
        </Modal>
      )}

      {viewing && (
        <Modal
          title={viewing.name}
          size="md"
          onClose={() => setViewing(null)}
          footer={
            <>
              <button type="button" className="btn btn-ef-ghost" onClick={() => setViewing(null)}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-ef-primary"
                onClick={() => {
                  setFormState({ lead: viewing })
                  setViewing(null)
                }}
              >
                Edit lead
              </button>
            </>
          }
        >
          <LeadDetails
            // Show the latest saved copy, in case the status was changed while open.
            lead={leads.find((l) => l.id === viewing.id) || viewing}
            property={properties.find((p) => p.id === viewing.propertyId)}
          />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete lead?"
          message={`${toDelete.name} will be permanently removed from your leads. This cannot be undone.`}
          busy={saving}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  )
}
