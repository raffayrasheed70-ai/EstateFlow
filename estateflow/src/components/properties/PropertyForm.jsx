import { useState } from 'react'
import {
  AREA_UNITS,
  LISTING_TYPES,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  TYPES_WITHOUT_ROOMS,
} from '../../utils/constants'
import { fieldProps } from '../../utils/formHelpers'
import { isValidUrl, validateProperty } from '../../utils/validation'
import FormField from '../common/FormField'
import SafeImage from '../common/SafeImage'

const EMPTY = {
  title: '',
  type: 'House',
  listingType: 'For Sale',
  price: '',
  address: '',
  city: '',
  bedrooms: '3',
  bathrooms: '2',
  area: '',
  areaUnit: 'Marla',
  status: 'Available',
  description: '',
  imageUrl: '',
  ownerName: '',
  contactNumber: '',
}

// Turns a stored property into form values (all inputs work with strings).
function toFormValues(property) {
  if (!property) return EMPTY
  return {
    ...EMPTY,
    ...property,
    price: String(property.price),
    bedrooms: String(property.bedrooms),
    bathrooms: String(property.bathrooms),
    area: String(property.area),
  }
}

function Section({ title, children }) {
  return (
    <fieldset className="form-section">
      <legend>{title}</legend>
      <div className="row g-3">{children}</div>
    </fieldset>
  )
}

// Used for both "Add property" and "Edit property".
// `onSubmit(values)` is only called when validation passes.
export default function PropertyForm({ property = null, submitting = false, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => toFormValues(property))
  const [errors, setErrors] = useState({})

  const showRooms = !TYPES_WITHOUT_ROOMS.includes(values.type)
  const previewUrl = values.imageUrl.trim()

  const change = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (submitting) return // guards against double submits (duplicate properties)
    const found = validateProperty(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // Move focus to the first invalid field so keyboard users notice the problem.
      document.getElementById(`pf-${Object.keys(found)[0]}`)?.focus()
      return
    }
    onSubmit(values)
  }

  const f = (name) => ({ ...fieldProps(`pf-${name}`, errors[name]), name, value: values[name], onChange: change })
  const select = (name) => ({ ...f(name), className: `form-select ${errors[name] ? 'is-invalid' : ''}` })

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Section title="Basic information">
        <FormField id="pf-title" label="Property title" error={errors.title} required className="col-12">
          <input type="text" {...f('title')} placeholder="e.g. Modern 10 Marla House in Johar Town" />
        </FormField>

        <FormField id="pf-type" label="Property type" error={errors.type} required className="col-sm-6 col-lg-4">
          <select {...select('type')}>
            {PROPERTY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </FormField>

        <FormField id="pf-listingType" label="Listing type" error={errors.listingType} required className="col-sm-6 col-lg-4">
          <select {...select('listingType')}>
            {LISTING_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </FormField>

        <FormField
          id="pf-price"
          label={values.listingType === 'For Rent' ? 'Monthly rent (PKR)' : 'Price (PKR)'}
          error={errors.price}
          required
          className="col-sm-12 col-lg-4"
        >
          <input type="number" min="0" inputMode="numeric" {...f('price')} placeholder="e.g. 25000000" />
        </FormField>

        <FormField id="pf-status" label="Property status" error={errors.status} required className="col-sm-6">
          <select {...select('status')}>
            {PROPERTY_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </FormField>
      </Section>

      <Section title="Location & size">
        <FormField id="pf-address" label="Location / address" error={errors.address} required className="col-md-8">
          <input type="text" {...f('address')} placeholder="Area, street or block" />
        </FormField>

        <FormField id="pf-city" label="City" error={errors.city} required className="col-md-4">
          <input type="text" {...f('city')} placeholder="e.g. Lahore" />
        </FormField>

        {showRooms && (
          <>
            <FormField id="pf-bedrooms" label="Bedrooms" error={errors.bedrooms} required className="col-6 col-md-3">
              <input type="number" min="0" step="1" {...f('bedrooms')} />
            </FormField>
            <FormField id="pf-bathrooms" label="Bathrooms" error={errors.bathrooms} required className="col-6 col-md-3">
              <input type="number" min="0" step="1" {...f('bathrooms')} />
            </FormField>
          </>
        )}

        <FormField
          id="pf-area"
          label="Area size"
          error={errors.area}
          required
          className={showRooms ? 'col-6 col-md-3' : 'col-6 col-md-6'}
        >
          <input type="number" min="0" step="any" {...f('area')} placeholder="e.g. 10" />
        </FormField>

        <FormField
          id="pf-areaUnit"
          label="Area unit"
          error={errors.areaUnit}
          required
          className={showRooms ? 'col-6 col-md-3' : 'col-6 col-md-6'}
        >
          <select {...select('areaUnit')}>
            {AREA_UNITS.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </FormField>
      </Section>

      <Section title="Description & photo">
        <FormField
          id="pf-description"
          label="Property description"
          error={errors.description}
          required
          className="col-12"
          hint="At least 20 characters."
        >
          <textarea rows={3} {...f('description')} placeholder="Describe the property, its features and surroundings" />
        </FormField>

        <FormField
          id="pf-imageUrl"
          label="Property image URL"
          error={errors.imageUrl}
          className="col-md-7"
          hint="Optional. Paste a direct link to an image (https://…). A placeholder is shown if it is empty or cannot load."
        >
          <input type="url" {...f('imageUrl')} placeholder="https://example.com/photo.jpg" />
        </FormField>

        <div className="col-md-5">
          <span className="form-label d-block">Image preview</span>
          <div className="image-preview" aria-live="polite">
            {previewUrl && isValidUrl(previewUrl) ? (
              <SafeImage src={previewUrl} alt="Preview of the property image" className="image-preview-img" />
            ) : (
              <div className="image-fallback">
                <i className="bi bi-image" aria-hidden="true" />
                <span>{previewUrl ? 'Enter a valid link' : 'No image yet'}</span>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section title="Owner / agent">
        <FormField id="pf-ownerName" label="Owner / agent name" error={errors.ownerName} required className="col-md-6">
          <input type="text" {...f('ownerName')} autoComplete="off" placeholder="e.g. Ali Raza" />
        </FormField>
        <FormField id="pf-contactNumber" label="Contact number" error={errors.contactNumber} required className="col-md-6">
          <input type="tel" {...f('contactNumber')} autoComplete="off" placeholder="0300 1234567" />
        </FormField>
      </Section>

      <div className="form-actions">
        <button type="button" className="btn btn-ef-ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-ef-primary" disabled={submitting}>
          {submitting ? 'Saving…' : property ? 'Save changes' : 'Add property'}
        </button>
      </div>
    </form>
  )
}
