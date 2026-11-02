import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

// Accessible modal dialog: closes on Escape or backdrop click, keeps keyboard
// focus inside while open, locks page scroll, and restores focus on close.
export default function Modal({ title, onClose, children, size = 'lg', footer = null }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  // Keep the latest onClose in a ref. Parents pass inline arrow functions, and
  // listing onClose as an effect dependency would re-run the effect (and move
  // keyboard focus back to the dialog) on every parent re-render.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus({ preventScroll: true })

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)]
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [])

  // Rendered through a portal into <body>, so the modal is always positioned
  // relative to the browser window and never to the page content behind it.
  return createPortal(
    <div
      className="ef-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCloseRef.current()
      }}
    >
      <div
        ref={dialogRef}
        className={`ef-modal ef-modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="ef-modal-header">
          <h2 id={titleId} className="ef-modal-title">
            {title}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>
        <div className="ef-modal-body">{children}</div>
        {footer && <div className="ef-modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
