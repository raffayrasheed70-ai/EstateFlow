import { useId } from 'react'

// Search box with a built-in clear button. `label` is read by screen readers.
export default function SearchInput({ value, onChange, placeholder = 'Search…', label = 'Search' }) {
  const id = useId()
  return (
    <div className="search-input">
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <i className="bi bi-search search-input-icon" aria-hidden="true" />
      <input
        id={id}
        type="search"
        className="form-control"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className="search-input-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <i className="bi bi-x-circle-fill" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
