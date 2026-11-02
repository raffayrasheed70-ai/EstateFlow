// Currency helpers. EstateFlow only supports PKR, but the user can choose how
// it is displayed: full ("Rs 12,500,000") or compact ("Rs 1.25 Crore").

const fullFormatter = new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0,
})

export function formatPKRFull(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 'Rs —'
  return `Rs ${fullFormatter.format(n)}`
}

export function formatPKRCompact(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 'Rs —'
  const trim = (x) => Number(x.toFixed(2)).toString()
  if (n >= 1e7) return `Rs ${trim(n / 1e7)} Crore`
  if (n >= 1e5) return `Rs ${trim(n / 1e5)} Lakh`
  return formatPKRFull(n)
}

// mode: 'full' | 'compact'
export function formatPKR(value, mode = 'compact') {
  return mode === 'full' ? formatPKRFull(value) : formatPKRCompact(value)
}

// Rent listings are priced per month.
export function formatPrice(value, listingType, mode = 'compact') {
  const base = formatPKR(value, mode)
  return listingType === 'For Rent' ? `${base} / month` : base
}
