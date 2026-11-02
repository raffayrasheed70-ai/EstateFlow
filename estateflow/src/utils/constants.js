// Shared option lists and colours. Keeping them in one place means forms,
// filters, badges and charts always agree with each other.

export const PROPERTY_TYPES = ['House', 'Apartment', 'Villa', 'Commercial', 'Plot']
export const LISTING_TYPES = ['For Sale', 'For Rent']
export const PROPERTY_STATUSES = ['Available', 'Pending', 'Sold', 'Rented']
export const AREA_UNITS = ['Marla', 'Kanal', 'Sq Ft']

// Plots have no rooms, so bedrooms/bathrooms are hidden and stored as 0.
export const TYPES_WITHOUT_ROOMS = ['Plot']

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Interested',
  'Viewing Scheduled',
  'Converted',
  'Lost',
]
export const LEAD_SOURCES = [
  'Website Inquiry',
  'Referral',
  'Phone Call',
  'Walk-in',
  'Social Media',
  'Demo API',
  'Other',
]
// Statuses that mean "no more follow-up needed".
export const CLOSED_LEAD_STATUSES = ['Converted', 'Lost']

export const LEAD_STATUS_COLORS = {
  New: '#6F93C2',
  Contacted: '#9A8FBF',
  Interested: '#BD995C',
  'Viewing Scheduled': '#4F8A8B',
  Converted: '#4C9A6A',
  Lost: '#B5605C',
}

export const PROPERTY_STATUS_COLORS = {
  Available: '#4C9A6A',
  Pending: '#BD995C',
  Sold: '#6F7C8E',
  Rented: '#6F93C2',
}

export const PROPERTY_TYPE_COLORS = {
  House: '#202D40',
  Apartment: '#BD995C',
  Villa: '#4F8A8B',
  Commercial: '#9A8FBF',
  Plot: '#6F93C2',
}

export const STORAGE_KEYS = {
  properties: 'estateflow.properties.v1',
  leads: 'estateflow.leads.v1',
  settings: 'estateflow.settings.v1',
}

export const DEVELOPER = {
  name: 'Muhammad Raffay (Raffay Rasheed)',
  role: 'Front-End Developer',
  github: 'https://github.com/raffayrasheed70-ai',
  portfolio: 'https://raffayrasheed70.github.io/',
}
