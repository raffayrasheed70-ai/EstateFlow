import { buildSampleProperties } from '../data/sampleProperties'
import {
  AREA_UNITS,
  LISTING_TYPES,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  STORAGE_KEYS,
  TYPES_WITHOUT_ROOMS,
} from '../utils/constants'
import { createId, readJSON, writeJSON } from '../utils/storage'

// Property data layer.
//
// Components never touch localStorage directly: they call these functions
// (through the useProperties hook). Every function is async and returns a
// Promise, exactly like a real HTTP/Supabase/Firebase call would. To connect a
// real backend later, you only rewrite the bodies of these functions.

const KEY = STORAGE_KEYS.properties

// Turns anything found in localStorage into a safe property object, or null if
// it is unusable. This is what prevents crashes from old or corrupted data.
function sanitizeProperty(raw) {
  if (!raw || typeof raw !== 'object') return null
  const price = Number(raw.price)
  if (!raw.id || typeof raw.title !== 'string' || !Number.isFinite(price)) return null
  const createdAt = new Date(raw.createdAt).getTime()
  return {
    id: String(raw.id),
    title: raw.title,
    description: typeof raw.description === 'string' ? raw.description : '',
    price,
    type: PROPERTY_TYPES.includes(raw.type) ? raw.type : 'House',
    listingType: LISTING_TYPES.includes(raw.listingType) ? raw.listingType : 'For Sale',
    city: typeof raw.city === 'string' ? raw.city : '',
    address: typeof raw.address === 'string' ? raw.address : '',
    bedrooms: Number.isFinite(Number(raw.bedrooms)) ? Number(raw.bedrooms) : 0,
    bathrooms: Number.isFinite(Number(raw.bathrooms)) ? Number(raw.bathrooms) : 0,
    area: Number.isFinite(Number(raw.area)) ? Number(raw.area) : 0,
    areaUnit: AREA_UNITS.includes(raw.areaUnit) ? raw.areaUnit : 'Marla',
    imageUrl: typeof raw.imageUrl === 'string' ? raw.imageUrl : '',
    // 'Under Offer' was renamed to 'Pending'; keep older saved data working.
    status: PROPERTY_STATUSES.includes(raw.status)
      ? raw.status
      : raw.status === 'Under Offer'
        ? 'Pending'
        : 'Available',
    ownerName: typeof raw.ownerName === 'string' ? raw.ownerName : '',
    contactNumber: typeof raw.contactNumber === 'string' ? raw.contactNumber : '',
    createdAt: Number.isFinite(createdAt) ? new Date(createdAt).toISOString() : new Date().toISOString(),
  }
}

function readAll() {
  const stored = readJSON(KEY, null)
  // Nothing saved yet (first visit) or the data is not an array: start from samples.
  if (!Array.isArray(stored)) {
    const samples = buildSampleProperties()
    writeJSON(KEY, samples)
    return samples
  }
  return stored.map(sanitizeProperty).filter(Boolean)
}

function normalizeInput(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    price: Number(values.price),
    type: values.type,
    listingType: values.listingType,
    city: values.city.trim(),
    address: values.address.trim(),
    // Plots (and any type without rooms) always store 0 rooms.
    bedrooms: TYPES_WITHOUT_ROOMS.includes(values.type) ? 0 : Number(values.bedrooms),
    bathrooms: TYPES_WITHOUT_ROOMS.includes(values.type) ? 0 : Number(values.bathrooms),
    area: Number(values.area),
    areaUnit: values.areaUnit,
    imageUrl: values.imageUrl.trim(),
    status: values.status,
    ownerName: values.ownerName.trim(),
    contactNumber: values.contactNumber.trim(),
  }
}

export async function getProperties() {
  return readAll()
}

export async function getPropertyById(id) {
  return readAll().find((p) => p.id === id) || null
}

export async function createProperty(values) {
  const all = readAll()
  // IDs are time + random based, but we still guarantee uniqueness explicitly.
  const taken = new Set(all.map((p) => p.id))
  let id = createId('prop')
  while (taken.has(id)) id = createId('prop')

  const property = { id, ...normalizeInput(values), createdAt: new Date().toISOString() }
  if (!writeJSON(KEY, [property, ...all])) {
    throw new Error('Could not save. Browser storage may be full or disabled.')
  }
  return property
}

export async function updateProperty(id, values) {
  const all = readAll()
  const existing = all.find((p) => p.id === id)
  if (!existing) throw new Error('This property no longer exists.')
  const updated = { ...existing, ...normalizeInput(values) }
  if (!writeJSON(KEY, all.map((p) => (p.id === id ? updated : p)))) {
    throw new Error('Could not save. Browser storage may be full or disabled.')
  }
  return updated
}

export async function deleteProperty(id) {
  writeJSON(KEY, readAll().filter((p) => p.id !== id))
}

export async function clearProperties() {
  writeJSON(KEY, [])
}

export async function restoreSampleProperties() {
  writeJSON(KEY, buildSampleProperties())
}
