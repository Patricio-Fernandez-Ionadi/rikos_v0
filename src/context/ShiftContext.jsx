import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import * as api from '../data/api.js'

const STORAGE_KEY = 'rikos_active_shift'
const ShiftContext = createContext(null)

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveLocal(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* quota exceeded */
  }
}

function clearLocal() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Manages the active shift with localStorage as the source of truth during the shift,
 * and MongoDB as the persistent store on close/sync.
 */
export function ShiftProvider({ children }) {
  const [shift, setShift] = useState(() => loadLocal())
  const [dbId, setDbId] = useState(null)
  const [synced, setSynced] = useState(false)
  const shiftRef = useRef(shift)
  shiftRef.current = shift

  useEffect(() => {
    if (shift) saveLocal(shift)
    else clearLocal()
  }, [shift])

  /**
   * Open a new shift: try DB first, fall back to localStorage-only.
   */
  const openShift = useCallback(async (openingCash) => {
    const s = {
      openingTime: new Date().toISOString(),
      openingCash,
      sales: [],
      status: 'open',
    }

    try {
      const dbShift = await api.openShift(openingCash)
      s._dbId = dbShift._id
      setDbId(dbShift._id)
      setSynced(true)
    } catch {
      setDbId(null)
      setSynced(false)
    }

    setShift(s)
  }, [])

  /**
   * Record a sale: updates local state + localStorage, and tries to push to DB.
   */
  const addSale = useCallback(async (sale) => {
    const current = shiftRef.current
    if (!current || current.status !== 'open') return

    const saleItem = {
      _tempId: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId: sale.productId,
      presentationId: sale.presentationId,
      quantity: sale.quantity,
      unitPrice: sale.unitPrice,
      total: sale.total,
      timestamp: new Date().toISOString(),
    }

    const updated = {
      ...current,
      sales: [...current.sales, saleItem],
    }
    setShift(updated)

    // Try to push to DB and deduct stock
    if (current._dbId) {
      try {
        await api.addSale(current._dbId, {
          productId: sale.productId,
          presentationId: sale.presentationId,
          quantity: sale.quantity,
          unitPrice: sale.unitPrice,
          total: sale.total,
        })
        setSynced(true)
      } catch {
        setSynced(false)
      }
    } else {
      setSynced(false)
    }
  }, [])

  /**
   * Sync all unsynced sales to the DB.
   * If the shift was created offline (_dbId null), first creates it in the DB.
   */
  const syncToDb = useCallback(async () => {
    const current = shiftRef.current
    if (!current) return false

    let currentDbId = current._dbId

    // If shift doesn't exist in DB yet, create it
    if (!currentDbId) {
      try {
        const dbShift = await api.openShift(current.openingCash)
        currentDbId = dbShift._id
        // Update local shift with the new DB id
        const updated = { ...current, _dbId: currentDbId }
        setShift(updated)
        setDbId(currentDbId)
      } catch {
        return false
      }
    }

    // Sync all sales
    try {
      if (current.sales.length > 0) {
        await api.syncSales(currentDbId, current.sales)
      }
      setSynced(true)
      return true
    } catch {
      return false
    }
  }, [])

  /**
   * Close the shift: sync to DB first, then record closing on DB, then clear local.
   */
  const closeShift = useCallback(async (closingCash, notes = '') => {
    const current = shiftRef.current
    if (!current) return

    // Ensure shift exists in DB before closing
    let currentDbId = current._dbId
    if (!currentDbId) {
      try {
        const dbShift = await api.openShift(current.openingCash)
        currentDbId = dbShift._id
      } catch {
        return { error: 'No hay conexión con el servidor. No se puede cerrar el turno.' }
      }
    }

    try {
      if (current.sales.length > 0) {
        await api.syncSales(currentDbId, current.sales)
      }
      await api.closeShift(currentDbId, closingCash, notes)
    } catch {
      return { error: 'Error al sincronizar con el servidor. Intente de nuevo.' }
    }

    const now = new Date().toISOString()
    const totalSales = current.sales.reduce((sum, s) => sum + s.total, 0)
    const expectedBalance = current.openingCash + totalSales
    const closed = {
      ...current,
      closingTime: now,
      closingCash,
      expectedBalance,
      difference: +(closingCash - expectedBalance).toFixed(2),
      status: 'closed',
      notes,
    }
    clearLocal()
    setShift(null)
    setDbId(null)
    setSynced(false)
    return closed
  }, [])

  const cancelShift = useCallback(() => {
    clearLocal()
    setShift(null)
    setDbId(null)
    setSynced(false)
  }, [])

  return (
    <ShiftContext.Provider value={{
      shift, dbId, synced,
      openShift, addSale, syncToDb, closeShift, cancelShift,
    }}>
      {children}
    </ShiftContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShift() {
  const ctx = useContext(ShiftContext)
  if (!ctx) throw new Error('useShift must be used within ShiftProvider')
  return ctx
}
