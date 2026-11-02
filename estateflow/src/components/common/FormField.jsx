// Label + input slot + error message, so every form looks and behaves the same.
// The input itself is passed as `children`; give it the same `id`, plus
// aria-invalid / aria-describedby (use fieldProps from utils/formHelpers).
export default function FormField({ id, label, error, required = false, hint, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && (
          <span className="required-mark" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && <div className="form-text">{hint}</div>}
      {error && (
        <div id={`${id}-error`} className="field-error" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
