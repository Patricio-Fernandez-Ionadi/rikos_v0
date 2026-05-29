import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react'
import * as shiftService from './services/shift-services.js'
import { shiftReducer, INITIAL_SHIFT_STATE } from './reducer/shift-reducer.js'

const STORAGE_KEY = 'rikos_active_shift'
const CLOSED_KEY = 'rikos_closed_shifts'
const ShiftContext = createContext(null)

function loadLocal() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		const shift = raw ? JSON.parse(raw) : null
		if (shift?.status === 'closed') return null
		return shift
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
			const active = await shiftService.getActiveShift()
			if (active) {
				s._dbId = active._id
				s.openingTime = active.openingTime
				s.openingCash = active.openingCash
				s.sales = active.sales ?? []
				dispatch({ type: 'SET_SYNCED', synced: true })
			} else {
				const dbShift = await shiftService.openShift(openingCash)
				s._dbId = dbShift._id
				dispatch({ type: 'SET_SYNCED', synced: true })
			}
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
				await shiftService.addSale(current._dbId, {
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

	const recordTicket = useCallback(async (ticketId, paymentMethod, items, collectedTotal) => {
		const current = shiftRef.current
		if (!current || current.status !== 'open') return

		const itemsTotal = items.reduce((s, i) => s + (i.total ?? 0), 0)
		const diff = collectedTotal != null ? +(collectedTotal - itemsTotal).toFixed(2) : 0

		const saleItems = items.map((item) => {
			const ratio = itemsTotal > 0 ? (item.total ?? 0) / itemsTotal : 0
			const itemCollected = diff !== 0 && ratio > 0
				? +(item.total + diff * ratio).toFixed(2)
				: null
			return {
				_tempId: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
				productId: item.productId,
				presentationId: item.presentationId,
				quantity: item.quantity,
				unitPrice: item.unitPrice,
				total: item.total,
				collectedAmount: itemCollected,
				paymentMethod,
				ticketId,
				timestamp: new Date().toISOString(),
			}
		})

		dispatch({ type: 'BATCH_ADD_SALES', sales: saleItems })

		if (current._dbId) {
			try {
				await shiftService.recordTicket(current._dbId, {
					items: items.map((item) => ({
						productId: item.productId,
						presentationId: item.presentationId,
						quantity: item.quantity,
						unitPrice: item.unitPrice,
						total: item.total,
					})),
					paymentMethod,
					ticketId,
					collectedTotal,
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
				const active = await shiftService.getActiveShift()
				currentDbId = active?._id
				if (!currentDbId) {
					const dbShift = await shiftService.openShift(current.openingCash)
					currentDbId = dbShift._id
				}
				dispatch({ type: 'UPDATE_DB_ID', dbId: currentDbId })
			} catch {
				return false
			}
		}

		try {
			if (current.sales.length > 0) {
				await shiftService.syncSales(currentDbId, current.sales)
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
		const cashSalesTotal = current.sales
			.filter((s) => !s.paymentMethod || s.paymentMethod === 'cash')
			.reduce((sum, s) => sum + (s.collectedAmount ?? s.total), 0)
		const expectedBalance = +(current.openingCash + cashSalesTotal).toFixed(2)
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
				const active = await shiftService.getActiveShift()
				currentDbId = active?._id
				if (!currentDbId) {
					const dbShift = await shiftService.openShift(current.openingCash)
					currentDbId = dbShift._id
				}
				closed._dbId = currentDbId
			} catch { /* stay local-only */ }
		}

		if (currentDbId) {
			try {
				if (current.sales.length > 0) {
					await shiftService.syncSales(currentDbId, current.sales)
				}
				await shiftService.closeShift(currentDbId, closingCash, notes)
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
			recordTicket,
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
