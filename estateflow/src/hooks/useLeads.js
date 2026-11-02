import { useCallback, useEffect, useState } from 'react'
import * as leadService from '../services/leadService'
import { subscribeToChanges } from '../utils/storage'

// Loads all leads (newest first) and exposes CRUD helpers.
export function useLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      setLeads(await leadService.getLeads())
      setError('')
    } catch (err) {
      setError(err.message || 'Could not load leads.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
    return subscribeToChanges(reload)
  }, [reload])

  const addLead = useCallback((values) => leadService.createLead(values), [])
  const editLead = useCallback((id, values) => leadService.updateLead(id, values), [])
  const changeStatus = useCallback((id, status) => leadService.updateLeadStatus(id, status), [])
  const removeLead = useCallback((id) => leadService.deleteLead(id), [])

  return { leads, loading, error, reload, addLead, editLead, changeStatus, removeLead }
}
