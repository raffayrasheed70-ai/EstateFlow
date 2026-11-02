import { useState } from 'react'
import { createInquiryLead } from '../../services/leadService'
import { validateInquiry } from '../../utils/validation'
import FormField from '../common/FormField'
import { fieldProps } from '../../utils/formHelpers'

const EMPTY = { name: '', email: '', phone: '', message: '' }

// Public "Contact agent" form. A valid submission is saved as a new lead
// (source "Website Inquiry") so it appears in the admin Leads page.
// IMPORTANT: nothing is emailed or sent anywhere — this demo has no backend.
export default function InquiryForm({ property }) {
  const [values, setValues] = useState({
    ...EMPTY,
    message: `Hi, I'm interested in "${property.title}". Please share more details.`,
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [saved, setSaved] = useState(false)

  const change = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const found = validateInquiry(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.getElementById(`iq-${Object.keys(found)[0]}`)?.focus()
      return
    }
    setSubmitting(true)
    setSubmitError('')
    try {
      await createInquiryLead({ ...values, propertyId: property.id })
      setSaved(true)
    } catch (error) {
      setSubmitError(error.message || 'Could not save your inquiry.')
    } finally {
      setSubmitting(false)
    }
  }

  if (saved) {
    return (
      <div className="ef-card inquiry-card" role="status">
        <div className="inquiry-success">
          <span className="state-icon success" aria-hidden="true">
            <i className="bi bi-check2-circle" />
          </span>
          <h2 className="inquiry-title">Inquiry saved</h2>
          <p>
            Thank you, {values.name.trim()}. Your inquiry about this property was saved in this demo
            application and now appears in the admin Leads page.
          </p>
          <p className="small text-muted">
            This is a portfolio demo with no backend, so your message has <strong>not</strong> been
            emailed or sent to a real agency.
          </p>
          <button
            type="button"
            className="btn btn-ef-ghost"
            onClick={() => {
              setSaved(false)
              setValues({ ...EMPTY, message: '' })
            }}
          >
            Send another inquiry
          </button>
        </div>
      </div>
    )
  }

  const f = (name) => ({ ...fieldProps(`iq-${name}`, errors[name]), name, value: values[name], onChange: change })

  return (
    <form className="ef-card inquiry-card" onSubmit={handleSubmit} noValidate>
      <h2 className="inquiry-title">Contact agent</h2>
      <p className="text-muted small">
        Demo form: your inquiry is stored in this browser only and is not sent to anyone.
      </p>

      <div className="row g-3">
        <FormField id="iq-name" label="Your name" error={errors.name} required className="col-12">
          <input type="text" {...f('name')} autoComplete="name" />
        </FormField>
        <FormField id="iq-email" label="Email" error={errors.email} required className="col-12">
          <input type="email" {...f('email')} autoComplete="email" />
        </FormField>
        <FormField id="iq-phone" label="Phone" error={errors.phone} required className="col-12">
          <input type="tel" {...f('phone')} autoComplete="tel" placeholder="0300 1234567" />
        </FormField>
        <FormField id="iq-message" label="Message" error={errors.message} required className="col-12">
          <textarea rows={4} {...f('message')} />
        </FormField>
      </div>

      {submitError && (
        <div className="alert alert-danger mt-3 mb-0" role="alert">
          {submitError}
        </div>
      )}

      <button type="submit" className="btn btn-ef-primary w-100 mt-3" disabled={submitting}>
        {submitting ? 'Saving…' : 'Send inquiry'}
      </button>
    </form>
  )
}
