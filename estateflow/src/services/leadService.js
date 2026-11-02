import { buildSampleLeads } from '../data/sampleLeads'
import { LEAD_SOURCES, LEAD_STATUSES, STORAGE_KEYS } from '../utils/constants'
import { createId, readJSON, writeJSON } from '../utils/storage'

// Lead data layer. Same idea as propertyService: async functions that hide
// where the data actually lives, so a real backend can replace localStorage.

const KEY = STORAGE_KEYS.leads

function sanitizeLead(raw) {
  if (!raw || typeof raw !== 'object') return null
  if (!raw.id || typeof raw.name !== 'string') return null
  const budget = Number(raw.budget)
  const createdAt = new Date(raw.createdAt).getTime()
  return {
    id: String(raw.id),
    name: raw.name,
    email: typeof raw.email === 'string' ? raw.email : '',
    phone: typeof raw.phone === 'string' ? raw.phone : '',
    propertyId: typeof raw.propertyId === 'string' ? raw.propertyId : '',
    budget: Number.isFinite(budget) && raw.budget !== '' && raw.budget !== null ? budget : null,
    source: LEAD_SOURCES.includes(raw.source) ? raw.source : 'Other',
    status: LEAD_STATUSES.includes(raw.status) ? raw.status : 'New',
    followUpDate: /^\d{4}-\d{2}-\d{2}$/.test(raw.followUpDate || '') ? raw.followUpDate : '',
    notes: typeof raw.notes === 'string' ? raw.notes : '',
    createdAt: Number.isFinite(createdAt) ? new Date(createdAt).toISOString() : new Date().toISOString(),
  }
}

function readAll() {
  const stored = readJSON(KEY, null)
  if (!Array.isArray(stored)) {
    const samples = buildSampleLeads()
    writeJSON(KEY, samples)
    return samples
  }
  return stored.map(sanitizeLead).filter(Boolean)
}

function normalizeInput(values) {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    propertyId: values.propertyId || '',
    budget: values.budget === '' || values.budget === null ? null : Number(values.budget),
    source: values.source,
    status: values.status,
    followUpDate: values.followUpDate || '',
    notes: values.notes.trim(),
  }
}

// Most recent first, as required by the CRM page.
function sortNewestFirst(leads) {
  return [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function getLeads() {
  return sortNewestFirst(readAll())
}

export async function createLead(values) {
  const lead = { id: createId('lead'), ...normalizeInput(values), createdAt: new Date().toISOString() }
  if (!writeJSON(KEY, [lead, ...readAll()])) {
    throw new Error('Could not save. Browser storage may be full or disabled.')
  }
  return lead
}

export async function updateLead(id, values) {
  const all = readAll()
  const existing = all.find((l) => l.id === id)
  if (!existing) throw new Error('This lead no longer exists.')
  const updated = { ...existing, ...normalizeInput(values) }
  if (!writeJSON(KEY, all.map((l) => (l.id === id ? updated : l)))) {
    throw new Error('Could not save. Browser storage may be full or disabled.')
  }
  return updated
}

export async function updateLeadStatus(id, status) {
  const all = readAll()
  if (!LEAD_STATUSES.includes(status)) throw new Error('Invalid status.')
  writeJSON(KEY, all.map((l) => (l.id === id ? { ...l, status } : l)))
}

export async function deleteLead(id) {
  writeJSON(KEY, readAll().filter((l) => l.id !== id))
}

// Used by the public inquiry form. The inquiry is saved locally as a new lead
// so it shows up in the Leads page. Nothing is emailed or sent anywhere.
export async function createInquiryLead({ name, email, phone, message, propertyId }) {
  return createLead({
    name,
    email,
    phone,
    propertyId,
    budget: '',
    source: 'Website Inquiry',
    status: 'New',
    followUpDate: '',
    notes: message.trim(),
  })
}

export async function clearLeads() {
  writeJSON(KEY, [])
}

export async function restoreSampleLeads() {
  writeJSON(KEY, buildSampleLeads())
}
