import { useState } from 'react'
import { LEAD_SOURCES, LEAD_STATUSES } from '../../utils/constants'
import { validateLead } from '../../utils/validation'
import FormField from '../common/FormField'
import { fieldProps } from '../../utils/formHelpers'

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  propertyId: '',
  budget: '',
  source: 'Phone Call',
  status: 'New',
  followUpDate: '',
  notes: '',
}

function toFormValues(lead) {
  if (!lead) return EMPTY
  return {
    ...EMPTY,
    ...lead,
    budget: lead.budget === null || lead.budget === undefined ? '' : String(lead.budget),
  }
}

// Add / edit a lead. `properties` fills the "interested property" dropdown.
export default function LeadForm({ lead = null, properties, submitting = false, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => toFormValues(lead))
  const [errors, setErrors] = useState({})

  const change = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validateLead(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.getElementById(`lf-${Object.keys(found)[0]}`)?.focus()
      return
    }
    onSubmit(values)
  }

  const f = (name) => ({ ...fieldProps(`lf-${name}`, errors[name]), name, value: values[name], onChange: change })
  const selectClass = (name) => `form-select ${errors[name] ? 'is-invalid' : ''}`

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <FormField id="lf-name" label="Full name" error={errors.name} required className="col-md-6">
          <input type="text" {...f('name')} autoComplete="off" />
        </FormField>

        <FormField id="lf-email" label="Email" error={errors.email} required className="col-md-6">
          <input type="email" {...f('email')} autoComplete="off" />
        </FormField>

        <FormField id="lf-phone" label="Phone" error={errors.phone} required className="col-md-6">
          <input type="tel" {...f('phone')} placeholder="0300 1234567" autoComplete="off" />
        </FormField>

        <FormField id="lf-budget" label="Budget (PKR)" error={errors.budget} className="col-md-6">
          <input type="number" min="0" inputMode="numeric" {...f('budget')} placeholder="Optional" />
        </FormField>

        <FormField id="lf-propertyId" label="Interested property" className="col-12">
          <select {...f('propertyId')} className="form-select">
            <option value="">No specific property</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} — {p.city}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="lf-source" label="Lead source" error={errors.source} required className="col-md-4">
          <select {...f('source')} className={selectClass('source')}>
            {LEAD_SOURCES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </FormField>

        <FormField id="lf-status" label="Status" error={errors.status} required className="col-md-4">
          <select {...f('status')} className={selectClass('status')}>
            {LEAD_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </FormField>

        <FormField id="lf-followUpDate" label="Follow-up date" error={errors.followUpDate} className="col-md-4">
          <input type="date" {...f('followUpDate')} />
        </FormField>

        <FormField id="lf-notes" label="Notes" error={errors.notes} className="col-12">
          <textarea rows={3} {...f('notes')} placeholder="Conversation notes, preferences, next steps…" />
        </FormField>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ef-ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-ef-primary" disabled={submitting}>
          {submitting ? 'Saving…' : lead ? 'Save changes' : 'Add lead'}
        </button>
      </div>
    </form>
  )
}
