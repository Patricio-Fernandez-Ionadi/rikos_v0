import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react'
import * as api from '../../data/api.js'
import { shiftReducer, INITIAL_SHIFT_STATE } from './reducer/shift-reducer.js'

const STORAGE_KEY = 'rikos_active_shift'
const CLOSED_KEY = 'rikos_closed_shifts'
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
	} catch { /* quota exceeded */ }
}

function clearLocal() {
	localStorage.removeItem(STORAGE_KEY)
}

export function ShiftProvider({ children }) {
	const [state, dispatch] = useReducer(shiftReducer, {
		...INITIAL_SHIFT_STATE,
		shift: loadLocal(),
	})
	const shiftRef = useRef(state.shift)
	shiftRef.current = state.shift

	useEffect(() => {
		if (state.shift) saveLocal(state.shift)
		else clearLocal()
	}, [state.shift])

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
			dispatch({ type: 'SET_SYNCED', synced: true })
		} catch {
			dispatch({ type: 'SET_SYNCED', synced: false })
		}

		dispatch({ type: 'SET_SHIFT', shift: s })
	}, [])

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

		dispatch({ type: 'ADD_SALE', sale: saleItem })

		if (current._dbId) {
			try {
				await api.addSale(current._dbId, {
					productId: sale.productId,
					presentationId: sale.presentationId,
					quantity: sale.quantity,
					unitPrice: sale.unitPrice,
					total: sale.total,
				})
				dispatch({ type: 'SET_SYNCED', synced: true })
			} catch {
				dispatch({ type: 'SET_SYNCED', synced: false })
			}
		} else {
			dispatch({ type: 'SET_SYNCED', synced: false })
		}
	}, [])

	const syncToDb = useCallback(async () => {
		const current = shiftRef.current
		if (!current) return false

		let currentDbId = current._dbId

		if (!currentDbId) {
			try {
				const dbShift = await api.openShift(current.openingCash)
				currentDbId = dbShift._id
				dispatch({ type: 'UPDATE_DB_ID', dbId: currentDbId })
			} catch {
				return false
			}
		}

		try {
			if (current.sales.length > 0) {
				await api.syncSales(currentDbId, current.sales)
			}
			dispatch({ type: 'SET_SYNCED', synced: true })
			return true
		} catch {
			return false
		}
	}, [])

	const closeShift = useCallback(async (closingCash, notes = '') => {
		const current = shiftRef.current
		if (!current) return null

		const now = new Date().toISOString()
		const totalSales = current.sales.reduce((sum, s) => sum + s.total, 0)
		const expectedBalance = +(current.openingCash + totalSales).toFixed(2)
		const difference = +(closingCash - expectedBalance).toFixed(2)

		const closed = {
			...current,
			closingTime: now,
			closingCash,
			expectedBalance,
			difference,
			status: 'closed',
			notes,
		}

		let currentDbId = current._dbId
		if (!currentDbId) {
			try {
				const dbShift = await api.openShift(current.openingCash)
				currentDbId = dbShift._id
				closed._dbId = currentDbId
			} catch { /* stay local-only */ }
		}

		if (currentDbId) {
			try {
				if (current.sales.length > 0) {
					await api.syncSales(currentDbId, current.sales)
				}
				await api.closeShift(currentDbId, closingCash, notes)
			} catch { /* close valid locally */ }
		}

		const history = JSON.parse(localStorage.getItem(CLOSED_KEY) || '[]')
		history.push(closed)
		try {
			localStorage.setItem(CLOSED_KEY, JSON.stringify(history))
		} catch { /* quota exceeded */ }

		dispatch({ type: 'CLOSE', closedShift: closed })
		clearLocal()
		return closed
	}, [])

	const removeSale = useCallback(async (tempId) => {
		const current = shiftRef.current
		if (!current || current.status !== 'open') return
		dispatch({ type: 'REMOVE_SALE', tempId })
	}, [])

	const editSale = useCallback(async (tempId, fields) => {
		const current = shiftRef.current
		if (!current || current.status !== 'open') return
		dispatch({ type: 'EDIT_SALE', tempId, fields })
	}, [])

	const cancelShift = useCallback(() => {
		clearLocal()
		dispatch({ type: 'CLEAR' })
	}, [])

	return (
		<ShiftContext.Provider value={{
			shift: state.shift,
			synced: state.synced,
			openShift,
			addSale,
			editSale,
			removeSale,
			syncToDb,
			closeShift,
			cancelShift,
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
