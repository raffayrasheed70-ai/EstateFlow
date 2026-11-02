// Friendly message shown when a list has no items. `action` is an optional
// button or link element.
export default function EmptyState({ icon = 'bi-inbox', title, message, action = null }) {
  return (
    <div className="state-box">
      <span className="state-icon" aria-hidden="true">
        <i className={`bi ${icon}`} />
      </span>
      <h3 className="state-title">{title}</h3>
      {message && <p className="state-message">{message}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-box state-error" role="alert">
      <span className="state-icon" aria-hidden="true">
        <i className="bi bi-exclamation-triangle" />
      </span>
      <h3 className="state-title">Something went wrong</h3>
      <p className="state-message">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-ef-primary" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-2" aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  )
}
