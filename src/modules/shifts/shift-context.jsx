import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react'
import * as shiftService from './services/shift-services.js'
import { ensureDbShift, prepareTicketItems } from './services/shift-utils.js'
import { shiftReducer, INITIAL_SHIFT_STATE } from './reducer/shift-reducer.js'
import { generateTempId } from '../../data/entities.js'

const ShiftContext = createContext(null)

const SHIFT_STORAGE_KEY = 'rikos-shift'

function saveShiftToLocal(shift) {
	try {
		localStorage.setItem(SHIFT_STORAGE_KEY, JSON.stringify(shift))
	} catch { /* quota */ }
}

function clearShiftFromLocal() {
	try {
		localStorage.removeItem(SHIFT_STORAGE_KEY)
	} catch { /* ignore */ }
}

function restoreLocalShift() {
	try {
		const raw = localStorage.getItem(SHIFT_STORAGE_KEY)
		if (!raw) return null
		const shift = JSON.parse(raw)
		if (shift?.status !== 'open') return null
		return shift
	} catch { return null }
}

export function ShiftProvider({ children }) {
	const [state, dispatch] = useReducer(shiftReducer, INITIAL_SHIFT_STATE)
	const shiftRef = useRef(state.shift)
	shiftRef.current = state.shift

	useEffect(() => {
		if (state.shift && state.shift.status === 'open') {
			saveShiftToLocal(state.shift)
		}
	}, [state.shift])

	useEffect(() => {
		shiftService.getActiveShift()
			.then((serverShift) => {
				if (serverShift) {
					const localShift = restoreLocalShift()
					const mergedSales = [
						...(localShift?.sales ?? []).filter((ls) =>
							!serverShift.sales?.some((ss) => ss.ticketId === ls.ticketId),
						),
						...(serverShift.sales ?? []),
					]
					dispatch({ type: 'SET_SHIFT', shift: {
						openingTime: serverShift.openingTime,
						openingCash: serverShift.openingCash,
						sales: mergedSales,
						adjustments: serverShift.adjustments ?? [],
						status: 'open',
						_dbId: serverShift._id,
					}})
					clearShiftFromLocal()
				} else {
					const localShift = restoreLocalShift()
					if (localShift) {
						dispatch({ type: 'SET_SHIFT', shift: localShift })
					}
				}
			})
			.catch(() => {
				const localShift = restoreLocalShift()
				if (localShift) {
					dispatch({ type: 'SET_SHIFT', shift: localShift })
				}
			})
	}, [])

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
			} else {
				const dbShift = await shiftService.openShift(openingCash)
				s._dbId = dbShift._id
			}
		} catch { /* local-only */ }

		dispatch({ type: 'SET_SHIFT', shift: s })
	}, [])

	const addSale = useCallback(async (sale) => {
		const current = shiftRef.current
		if (!current || current.status !== 'open') return

		const saleItem = {
			_tempId: generateTempId(),
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
			} catch {
				console.warn('addSale: falló el servidor, venta solo local')
			}
		}
	}, [])

	const recordTicket = useCallback(async (ticketId, paymentMethod, items, collectedTotal) => {
		const current = shiftRef.current
		if (!current || current.status !== 'open') return

		const prepared = prepareTicketItems(items, collectedTotal)
		const saleItems = prepared.map((item) => ({
			_tempId: generateTempId(),
			productId: item.productId,
			presentationId: item.presentationId,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			total: item.total,
			collectedAmount: item.adjustedTotal,
			paymentMethod,
			ticketId,
			timestamp: new Date().toISOString(),
		}))

		dispatch({ type: 'BATCH_ADD_SALES', sales: saleItems })

		if (current._dbId) {
			const apiItems = prepared.map((item) => ({
				productId: item.productId,
				presentationId: item.presentationId,
				quantity: item.quantity,
				unitPrice: item.unitPrice,
				total: item.total,
			}))
			try {
				await shiftService.recordTicket(current._dbId, {
					items: apiItems,
					paymentMethod,
					ticketId,
					collectedTotal,
				})
			} catch (err) {
				dispatch({ type: 'REMOVE_SALES_BY_TICKET', ticketId })
				throw err
			}
		}
	}, [])

	const addAdjustment = useCallback(async ({ amount, type, description }) => {
		const current = shiftRef.current
		if (!current || current.status !== 'open') return

		const adj = {
			_tempId: generateTempId(),
			amount,
			type: type || 'expense',
			description: description || '',
			timestamp: new Date().toISOString(),
		}

		dispatch({ type: 'ADD_ADJUSTMENT', adjustment: adj })

		if (current._dbId) {
			try {
				await shiftService.addAdjustment(current._dbId, { amount, type, description })
			} catch {
				console.warn('addAdjustment: falló el servidor, ajuste solo local')
			}
		}
	}, [])

	const closeShift = useCallback(async (closingCash, notes = '') => {
		const current = shiftRef.current
		if (!current) return null

		const now = new Date().toISOString()
		const cashSalesTotal = current.sales
			.filter((s) => !s.paymentMethod || s.paymentMethod === 'cash')
			.reduce((sum, s) => sum + (s.collectedAmount ?? s.total), 0)
		const adjustmentsTotal = (current.adjustments ?? []).reduce((sum, a) => sum + a.amount, 0)
		const expectedBalance = +(current.openingCash + cashSalesTotal - adjustmentsTotal).toFixed(2)
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

		const currentDbId = await ensureDbShift(current._dbId, current.openingCash)
		if (currentDbId) {
			closed._dbId = currentDbId
		}

		if (currentDbId) {
			try {
				if (current.sales.length > 0) {
					await shiftService.syncSales(currentDbId, current.sales)
				}
				await shiftService.closeShift(currentDbId, closingCash, notes)
			} catch {
				console.warn('closeShift: falló el servidor, cierre solo local')
			}
		}

		saveShiftToLocal(closed)
		dispatch({ type: 'CLOSE', closedShift: closed })
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
		clearShiftFromLocal()
		dispatch({ type: 'CLEAR' })
	}, [])

	return (
		<ShiftContext.Provider value={{
			shift: state.shift,
			openShift,
			addSale,
			recordTicket,
			editSale,
			removeSale,
			addAdjustment,
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
