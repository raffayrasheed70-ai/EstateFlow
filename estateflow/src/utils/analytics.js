import {
  CLOSED_LEAD_STATUSES,
  LEAD_STATUSES,
  LEAD_STATUS_COLORS,
  LISTING_TYPES,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  PROPERTY_TYPE_COLORS,
} from './constants'
import { isOverdue, lastMonths, monthKey } from './dates'

// Every number on the dashboard and analytics pages comes from these
// functions, which only read the stored properties and leads. Nothing here is
// invented.

export function computeMetrics(properties, leads) {
  const converted = leads.filter((l) => l.status === 'Converted').length
  const lost = leads.filter((l) => l.status === 'Lost').length
  const budgets = leads.map((l) => l.budget).filter((b) => Number.isFinite(b) && b > 0)
  return {
    totalProperties: properties.length,
    availableProperties: properties.filter((p) => p.status === 'Available').length,
    forSale: properties.filter((p) => p.listingType === 'For Sale').length,
    forRent: properties.filter((p) => p.listingType === 'For Rent').length,
    totalLeads: leads.length,
    convertedLeads: converted,
    lostLeads: lost,
    openLeads: leads.length - converted - lost,
    overdueFollowUps: leads.filter(
      (l) => !CLOSED_LEAD_STATUSES.includes(l.status) && isOverdue(l.followUpDate),
    ).length,
    conversionRate: leads.length ? (converted / leads.length) * 100 : 0,
    averageBudget: budgets.length ? budgets.reduce((a, b) => a + b, 0) / budgets.length : 0,
  }
}

// Leads created per month for the last `count` months.
export function monthlyInquiries(leads, count = 6) {
  const months = lastMonths(count)
  const counts = Object.fromEntries(months.map((m) => [m.key, 0]))
  leads.forEach((lead) => {
    const key = monthKey(lead.createdAt)
    if (key in counts) counts[key] += 1
  })
  return months.map((m) => ({ month: m.label, inquiries: counts[m.key] }))
}

export function leadsByStatus(leads) {
  return LEAD_STATUSES.map((status) => ({
    name: status,
    value: leads.filter((l) => l.status === status).length,
    color: LEAD_STATUS_COLORS[status],
  }))
}

export function propertyTypeDistribution(properties) {
  return PROPERTY_TYPES.map((type) => ({
    name: type,
    value: properties.filter((p) => p.type === type).length,
    color: PROPERTY_TYPE_COLORS[type],
  }))
}

// One row per listing type, with a count for each availability status.
export function inventoryBreakdown(properties) {
  return LISTING_TYPES.map((listingType) => {
    const row = { name: listingType }
    PROPERTY_STATUSES.forEach((status) => {
      row[status] = properties.filter(
        (p) => p.listingType === listingType && p.status === status,
      ).length
    })
    return row
  })
}

// Recent activity is derived from real records: when a property or lead was
// created. (EstateFlow does not keep an edit history.)
export function buildActivity(properties, leads, limit = 8) {
  const items = [
    ...properties.map((p) => ({
      id: `p-${p.id}`,
      kind: 'property',
      title: `Property listed: ${p.title}`,
      detail: `${p.city} · ${p.listingType}`,
      date: p.createdAt,
    })),
    ...leads.map((l) => ({
      id: `l-${l.id}`,
      kind: 'lead',
      title: `New lead: ${l.name}`,
      detail: `${l.source} · ${l.status}`,
      date: l.createdAt,
    })),
  ]
  return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit)
}
