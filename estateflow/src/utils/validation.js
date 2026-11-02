import {
  AREA_UNITS,
  LEAD_SOURCES,
  LEAD_STATUSES,
  LISTING_TYPES,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  TYPES_WITHOUT_ROOMS,
} from './constants'

// Every validator returns an object of { fieldName: 'error message' }.
// An empty object means the values are valid.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^\+?[0-9\s-]{10,16}$/

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value).trim())
}

export function isValidPhone(value) {
  return PHONE_PATTERN.test(String(value).trim())
}

export function isValidUrl(value) {
  try {
    const url = new URL(String(value).trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isPositiveNumber(value) {
  const n = Number(value)
  return value !== '' && Number.isFinite(n) && n > 0
}

function isNonNegativeInteger(value) {
  const n = Number(value)
  return value !== '' && Number.isInteger(n) && n >= 0
}

export function validateProperty(values) {
  const errors = {}
  if (!values.title.trim()) errors.title = 'Title is required.'
  else if (values.title.trim().length < 5) errors.title = 'Title must be at least 5 characters.'

  if (!values.description.trim()) errors.description = 'Description is required.'
  else if (values.description.trim().length < 20)
    errors.description = 'Description must be at least 20 characters.'

  if (!isPositiveNumber(values.price)) errors.price = 'Enter a price greater than 0.'
  if (!PROPERTY_TYPES.includes(values.type)) errors.type = 'Choose a property type.'
  if (!LISTING_TYPES.includes(values.listingType)) errors.listingType = 'Choose a listing type.'
  if (!values.city.trim()) errors.city = 'City is required.'
  if (!values.address.trim()) errors.address = 'Address is required.'
  if (!TYPES_WITHOUT_ROOMS.includes(values.type)) {
    if (!isNonNegativeInteger(values.bedrooms)) errors.bedrooms = 'Enter 0 or more bedrooms.'
    if (!isNonNegativeInteger(values.bathrooms)) errors.bathrooms = 'Enter 0 or more bathrooms.'
  }
  if (!isPositiveNumber(values.area)) errors.area = 'Enter an area greater than 0.'
  if (!AREA_UNITS.includes(values.areaUnit)) errors.areaUnit = 'Choose an area unit.'
  if (values.imageUrl.trim() && !isValidUrl(values.imageUrl))
    errors.imageUrl = 'Enter a valid http(s) image URL, or leave it empty.'
  if (!PROPERTY_STATUSES.includes(values.status)) errors.status = 'Choose an availability status.'

  if (!values.ownerName.trim()) errors.ownerName = 'Owner or agent name is required.'
  else if (values.ownerName.trim().length < 2) errors.ownerName = 'Name is too short.'

  if (!values.contactNumber.trim()) errors.contactNumber = 'Contact number is required.'
  else if (!isValidPhone(values.contactNumber))
    errors.contactNumber = 'Enter a valid phone number (10–16 digits, e.g. 0300 1234567).'
  return errors
}

export function validateLead(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Full name is required.'
  else if (values.name.trim().length < 2) errors.name = 'Name is too short.'

  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address.'

  if (!values.phone.trim()) errors.phone = 'Phone number is required.'
  else if (!isValidPhone(values.phone))
    errors.phone = 'Enter a valid phone number (10–16 digits, e.g. 0300 1234567).'

  if (values.budget !== '' && !isPositiveNumber(values.budget))
    errors.budget = 'Budget must be a number greater than 0, or empty.'

  if (!LEAD_SOURCES.includes(values.source)) errors.source = 'Choose a lead source.'
  if (!LEAD_STATUSES.includes(values.status)) errors.status = 'Choose a status.'
  if (values.notes.length > 1000) errors.notes = 'Notes must be 1000 characters or fewer.'
  return errors
}

// Public inquiry form: a smaller version of the lead form.
export function validateInquiry(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  else if (values.name.trim().length < 2) errors.name = 'Name is too short.'

  if (!values.email.trim()) errors.email = 'Please enter your email.'
  else if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address.'

  if (!values.phone.trim()) errors.phone = 'Please enter your phone number.'
  else if (!isValidPhone(values.phone))
    errors.phone = 'Enter a valid phone number (10–16 digits).'

  if (!values.message.trim()) errors.message = 'Please write a short message.'
  else if (values.message.trim().length < 10)
    errors.message = 'Message must be at least 10 characters.'
  else if (values.message.length > 1000) errors.message = 'Message must be 1000 characters or fewer.'
  return errors
}

export function validateProfile(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Name is required.'
  if (!values.role.trim()) errors.role = 'Role is required.'
  if (!values.businessName.trim()) errors.businessName = 'Business name is required.'
  if (values.email.trim() && !isValidEmail(values.email)) errors.email = 'Enter a valid email.'
  if (values.github.trim() && !isValidUrl(values.github)) errors.github = 'Enter a valid URL.'
  if (values.portfolio.trim() && !isValidUrl(values.portfolio))
    errors.portfolio = 'Enter a valid URL.'
  return errors
}
