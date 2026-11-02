// Pure functions used by both the admin Properties page and the public
// listings page. Pure = same input, same output, no side effects, so they are
// easy to test and reuse.

export const DEFAULT_FILTERS = {
  search: '',
  type: 'all',
  listingType: 'all',
  status: 'all',
  minPrice: '',
  maxPrice: '',
  sort: 'newest',
}

export function filterProperties(properties, filters) {
  const query = filters.search.trim().toLowerCase()
  const min = filters.minPrice === '' ? null : Number(filters.minPrice)
  const max = filters.maxPrice === '' ? null : Number(filters.maxPrice)

  const filtered = properties.filter((p) => {
    if (query) {
      const haystack = [p.title, p.city, p.address, p.description].join(' ').toLowerCase()
      if (!haystack.includes(query)) return false
    }
    if (filters.type !== 'all' && p.type !== filters.type) return false
    if (filters.listingType !== 'all' && p.listingType !== filters.listingType) return false
    if (filters.status !== 'all' && p.status !== filters.status) return false
    if (min !== null && Number.isFinite(min) && p.price < min) return false
    if (max !== null && Number.isFinite(max) && p.price > max) return false
    return true
  })

  const sorters = {
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
  }
  return [...filtered].sort(sorters[filters.sort] || sorters.newest)
}

export function hasActiveFilters(filters) {
  return Object.keys(DEFAULT_FILTERS).some((key) => filters[key] !== DEFAULT_FILTERS[key])
}
