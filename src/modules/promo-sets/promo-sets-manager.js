import { useState, useEffect, useCallback } from 'react'
import * as promoService from './services/promo-sets-services.js'

export function usePromoSetsManager() {
  const [promoSets, setPromoSets] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await promoService.getPromoSets(true)
      setPromoSets(data)
    } catch (e) {
      console.error('Error loading promo sets:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const create = useCallback(async (data) => {
    const created = await promoService.createPromoSet(data)
    setPromoSets((prev) => [...prev, created])
    return created
  }, [])

  const update = useCallback(async (id, data) => {
    const updated = await promoService.updatePromoSet(id, data)
    setPromoSets((prev) => prev.map((p) => (p._id === id ? updated : p)))
    return updated
  }, [])

  const remove = useCallback(async (id) => {
    await promoService.deletePromoSet(id)
    setPromoSets((prev) => prev.filter((p) => p._id !== id))
  }, [])

  const toggleActive = useCallback(async (id, current) => {
    return update(id, { active: !current })
  }, [update])

  return { promoSets, loading, create, update, remove, toggleActive, refresh: load }
}
