import { useCallback, useEffect, useState } from 'react'
import * as propertyService from '../services/propertyService'
import { subscribeToChanges } from '../utils/storage'

// Loads all properties and exposes add / update / remove helpers.
// The list reloads automatically whenever stored data changes.
export function useProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      setProperties(await propertyService.getProperties())
      setError('')
    } catch (err) {
      setError(err.message || 'Could not load properties.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
    return subscribeToChanges(reload)
  }, [reload])

  const addProperty = useCallback((values) => propertyService.createProperty(values), [])
  const editProperty = useCallback((id, values) => propertyService.updateProperty(id, values), [])
  const removeProperty = useCallback((id) => propertyService.deleteProperty(id), [])

  return { properties, loading, error, reload, addProperty, editProperty, removeProperty }
}

// Loads a single property by id (used by the detail pages).
export function useProperty(id) {
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      setProperty(await propertyService.getPropertyById(id))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    reload()
    return subscribeToChanges(reload)
  }, [reload])

  return { property, loading, reload }
}
