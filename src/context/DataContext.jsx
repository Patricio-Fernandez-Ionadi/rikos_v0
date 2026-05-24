import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import * as api from '../data/api.js'
import seed from '../data/seed.json' with { type: 'json' }

const STORAGE_KEY = 'rikos_data'
const DataContext = createContext(null)

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data.categories && data.products && data.presentations) return data
    return null
  } catch {
    return null
  }
}

function saveLocal(categories, products, presentations, dirty) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ categories, products, presentations, dirty }))
  } catch {
    /* quota exceeded */
  }
}

/**
 * Provides categories, products, and presentations.
 * Cascade source of truth: API → localStorage → seed.json.
 * All state changes are persisted to localStorage so CRUD and stock survive page reloads.
 * When changes occur while offline, dirty is set so the UI can show a sync button.
 */
export function DataProvider({ children }) {
  const [categories, setCategoriesRaw] = useState([])
  const [products, setProductsRaw] = useState([])
  const [presentations, setPresentationsRaw] = useState([])
  const [loading, setLoading] = useState(true)
  const [online, setOnline] = useState(false)
  const [dirty, setDirty] = useState(false)
  const loaded = useRef(false)

  // Wrapped setters that also mark dirty when changed offline
  const setCategories = useCallback((v) => {
    setCategoriesRaw(v)
    if (loaded.current && !online) setDirty(true)
  }, [online])

  const setProducts = useCallback((v) => {
    setProductsRaw(v)
    if (loaded.current && !online) setDirty(true)
  }, [online])

  const setPresentations = useCallback((v) => {
    setPresentationsRaw(v)
    if (loaded.current && !online) setDirty(true)
  }, [online])

  // Persist to localStorage on every state change after initial load
  useEffect(() => {
    if (loaded.current) {
      saveLocal(categories, products, presentations, dirty)
    }
  }, [categories, products, presentations, dirty])

  const loadFromApi = useCallback(async () => {
    const [cats, prods, pres] = await Promise.all([
      api.getCategories(),
      api.getProducts(),
      api.getPresentations(),
    ])
    setCategoriesRaw(cats)
    setProductsRaw(prods)
    setPresentationsRaw(pres)
    setOnline(true)
  }, [])

  const loadFromLocal = useCallback(() => {
    const saved = loadLocal()
    if (saved) {
      setCategoriesRaw(saved.categories)
      setProductsRaw(saved.products)
      setPresentationsRaw(saved.presentations)
      if (saved.dirty) setDirty(true)
    } else {
      setCategoriesRaw(seed.categories)
      setProductsRaw(seed.products)
      setPresentationsRaw(seed.presentations)
    }
    setOnline(false)
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        await loadFromApi()
      } catch {
        loadFromLocal()
      }
      loaded.current = true
      setLoading(false)
    })()
  }, [loadFromApi, loadFromLocal])

  const refresh = useCallback(async () => {
    try {
      const [cats, prods, pres] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
        api.getPresentations(),
      ])
      setCategoriesRaw(cats)
      setProductsRaw(prods)
      setPresentationsRaw(pres)
      setOnline(true)
    } catch {
      // stay with stale data
    }
  }, [])

  /**
   * Pushes all local data to the API by matching on business keys.
   * Products matched by (categoryId + name), presentations by (productId + label).
   * Handles the ObjectId ↔ string ID mapping automatically.
   */
  const syncData = useCallback(async () => {
    if (!online) return false

    try {
      // Get current server data
      const [, serverProds, serverPres] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
        api.getPresentations(),
      ])

      // Build lookup maps
      const prodByKey = new Map()
      serverProds.forEach((p) => prodByKey.set(`${p.categoryId}::${p.name}`, p))

      // Sync products: upsert by (categoryId + name)
      const idMap = new Map() // local _id → server _id
      for (const p of products) {
        const key = `${p.categoryId}::${p.name}`
        const existing = prodByKey.get(key)
        if (existing) {
          await api.updateProduct(existing._id, { name: p.name, purchaseCost: p.purchaseCost, categoryId: p.categoryId })
          idMap.set(p._id, existing._id)
        } else {
          const created = await api.createProduct({ name: p.name, purchaseCost: p.purchaseCost, categoryId: p.categoryId })
          idMap.set(p._id, created._id)
        }
      }

      // Sync presentations: upsert by (productId + label)
      for (const p of presentations) {
        const serverProductId = idMap.get(p.productId) || p.productId
        const key = `${serverProductId}::${p.label}`
        const existing = serverPres.find((sp) => `${sp.productId}::${sp.label}` === key)
        if (existing) {
          await api.updatePresentation(existing._id, { label: p.label, grams: p.grams, margin: p.margin, salePrice: p.salePrice })
          await api.updateStock(existing._id, p.stock ?? 0)
        } else {
          await api.createPresentation({
            productId: serverProductId, label: p.label, grams: p.grams,
            margin: p.margin, salePrice: p.salePrice, stock: p.stock ?? 0,
          })
        }
      }

      // Reload from API to get fresh ObjectIds
      await refresh()
      setDirty(false)
      return true
    } catch (e) {
      console.error('Data sync failed:', e)
      return false
    }
  }, [products, presentations, online, refresh])

  return (
    <DataContext.Provider value={{
      categories, products, presentations, loading, online, dirty,
      refresh, syncData, setCategories, setProducts, setPresentations,
    }}>
      {children}
    </DataContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
