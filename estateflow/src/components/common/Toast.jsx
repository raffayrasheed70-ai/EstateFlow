const ICONS = {
  success: 'bi-check-circle-fill',
  error: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
}

// Renders the stack of toast messages. State lives in ToastContext.
export default function Toast({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className={`ef-toast ef-toast-${toast.type}`} role="status">
          <i className={`bi ${ICONS[toast.type] || ICONS.info}`} aria-hidden="true" />
          <span className="ef-toast-message">{toast.message}</span>
          <button
            type="button"
            className="ef-toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}
