import { useCallback, useEffect, useState } from 'react'
import { fetchDemoContacts } from '../../services/api'
import { createLead } from '../../services/leadService'
import { useToast } from '../../context/ToastContext'
import { ErrorState } from '../common/EmptyState'
import SafeAvatar from './SafeAvatar'

// Demonstrates external API integration with DummyJSON.
// These contacts are FAKE demo users. They are never added as leads
// automatically — only when you press "Add as lead".
export default function DemoContacts() {
  const toast = useToast()
  const [contacts, setContacts] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [addingId, setAddingId] = useState(null)
  const [addedIds, setAddedIds] = useState([])

  useEffect(() => {
    // AbortController cancels the request if the component unmounts or reloads.
    const controller = new AbortController()
    fetchDemoContacts(8, { signal: controller.signal })
      .then((data) => {
        setContacts(data)
        setStatus('ready')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Could not load demo contacts.')
        setStatus('error')
      })
    return () => controller.abort()
  }, [reloadKey])

  const retry = useCallback(() => {
    setStatus('loading')
    setError('')
    setReloadKey((key) => key + 1)
  }, [])

  const addAsLead = async (contact) => {
    setAddingId(contact.id)
    try {
      await createLead({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        propertyId: '',
        budget: '',
        source: 'Demo API',
        status: 'New',
        followUpDate: '',
        notes: 'Demo contact imported from the DummyJSON API. Not a real buyer.',
      })
      setAddedIds((ids) => [...ids, contact.id])
      toast.success(`${contact.name} was added as a demo lead.`)
    } catch (err) {
      toast.error(err.message || 'Could not add the lead.')
    } finally {
      setAddingId(null)
    }
  }

  return (
    <section className="ef-card list-card" aria-label="Demo contacts from DummyJSON">
      <div className="card-head">
        <div>
          <h2 className="card-title">
            Demo contacts <span className="pill pill-gold ms-1">Demo data</span>
          </h2>
          <p className="card-subtitle">
            Fake users from the DummyJSON API, shown to demonstrate API integration. They are not real
            buyers.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ef-ghost btn-sm"
          onClick={retry}
          disabled={status === 'loading'}
        >
          <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" /> Refresh
        </button>
      </div>

      {status === 'loading' && (
        <div role="status" aria-label="Loading demo contacts">
          {Array.from({ length: 4 }, (_, i) => (
            <div className="skeleton skeleton-row" key={i} />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState message={error} onRetry={retry} />}

      {status === 'ready' && (
        <ul className="contact-list">
          {contacts.map((contact) => (
            <li key={contact.id} className="contact-item">
              <SafeAvatar src={contact.avatar} name={contact.name} />
              <div className="contact-text">
                <span className="contact-name">{contact.name}</span>
                <span className="contact-detail">
                  {contact.email}
                  {contact.city ? ` · ${contact.city}` : ''}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-ef-ghost btn-sm"
                onClick={() => addAsLead(contact)}
                disabled={addingId === contact.id || addedIds.includes(contact.id)}
              >
                {addedIds.includes(contact.id) ? 'Added' : 'Add as lead'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
