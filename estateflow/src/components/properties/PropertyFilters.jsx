import { DEFAULT_FILTERS, hasActiveFilters } from '../../utils/propertyFilters'
import { LISTING_TYPES, PROPERTY_STATUSES, PROPERTY_TYPES } from '../../utils/constants'
import SearchInput from '../common/SearchInput'

// Search + filter + sort controls. It is "controlled": the parent page owns
// the `filters` object and passes it in with an `onChange` callback.
// Set `showStatus={false}` on the public page, which only lists available homes.
export default function PropertyFilters({ filters, onChange, showStatus = true, extra = null }) {
  const set = (field) => (event) => onChange({ ...filters, [field]: event.target.value })

  return (
    <section className="ef-card filter-bar" aria-label="Search and filter properties">
      <div className="filter-search">
        <SearchInput
          value={filters.search}
          onChange={(search) => onChange({ ...filters, search })}
          placeholder="Search by title, location or description"
          label="Search properties"
        />
      </div>

      <div className="filter-grid">
        <div>
          <label htmlFor="filter-type" className="form-label">
            Type
          </label>
          <select id="filter-type" className="form-select" value={filters.type} onChange={set('type')}>
            <option value="all">All types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-listing" className="form-label">
            Sale / Rent
          </label>
          <select
            id="filter-listing"
            className="form-select"
            value={filters.listingType}
            onChange={set('listingType')}
          >
            <option value="all">Sale &amp; Rent</option>
            {LISTING_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {showStatus && (
          <div>
            <label htmlFor="filter-status" className="form-label">
              Availability
            </label>
            <select
              id="filter-status"
              className="form-select"
              value={filters.status}
              onChange={set('status')}
            >
              <option value="all">Any status</option>
              {PROPERTY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="filter-min" className="form-label">
            Min price (PKR)
          </label>
          <input
            id="filter-min"
            type="number"
            min="0"
            inputMode="numeric"
            className="form-control"
            placeholder="0"
            value={filters.minPrice}
            onChange={set('minPrice')}
          />
        </div>

        <div>
          <label htmlFor="filter-max" className="form-label">
            Max price (PKR)
          </label>
          <input
            id="filter-max"
            type="number"
            min="0"
            inputMode="numeric"
            className="form-control"
            placeholder="No limit"
            value={filters.maxPrice}
            onChange={set('maxPrice')}
          />
        </div>

        <div>
          <label htmlFor="filter-sort" className="form-label">
            Sort by
          </label>
          <select id="filter-sort" className="form-select" value={filters.sort} onChange={set('sort')}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="priceAsc">Price: low to high</option>
            <option value="priceDesc">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="filter-footer">
        {extra}
        {hasActiveFilters(filters) && (
          <button
            type="button"
            className="btn btn-ef-ghost btn-sm"
            onClick={() => onChange(DEFAULT_FILTERS)}
          >
            <i className="bi bi-x-circle me-1" aria-hidden="true" /> Reset filters
          </button>
        )}
      </div>
    </section>
  )
}
