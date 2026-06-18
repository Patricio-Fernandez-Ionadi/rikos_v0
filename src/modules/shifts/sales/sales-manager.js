import { useReducer, useCallback, useMemo } from 'react'
import { useShift } from '../shift-context.jsx'
import { salesReducer, initialState } from './sales-reducer.js'
import { updateSale as apiUpdateSale, deleteSale as apiDeleteSale } from './sales-services.js'

export function useSalesManager() {
	const { shift, editSale, removeSale } = useShift()
	const [ui, dispatch] = useReducer(salesReducer, initialState)

	const shiftId = shift._dbId || shift._id

	const groups = useMemo(() => {
		const sales = shift.sales ?? []
		const map = new Map()
		for (const sale of sales) {
			const key = sale.ticketId || sale._tempId || sale._id
			if (!map.has(key)) {
				map.set(key, {
					id: key,
					items: [],
					timestamp: sale.timestamp,
					paymentMethod: sale.paymentMethod,
				})
			}
			const group = map.get(key)
			group.items.push(sale)
			if (sale.paymentMethod) group.paymentMethod = sale.paymentMethod
		}
		return Array.from(map.values())
	}, [shift.sales])

	const toggleExpand = useCallback((id) => {
		dispatch({ type: 'TOGGLE_EXPAND', payload: id })
	}, [])

	const isExpanded = useCallback((id) => ui.expandedIds.has(id), [ui.expandedIds])

	const startEdit = useCallback((saleId, currentQty) => {
		dispatch({ type: 'START_EDIT', payload: { id: saleId, qty: currentQty } })
	}, [])

	const cancelEdit = useCallback(() => {
		dispatch({ type: 'CANCEL_EDIT' })
	}, [])

	const setEditQty = useCallback((qty) => {
		dispatch({ type: 'SET_EDIT_QTY', payload: qty })
	}, [])

	const saveEdit = useCallback(async (dbId, tempId, unitPrice) => {
		if (ui.editQty == null) return
		const newTotal = +(ui.editQty * unitPrice).toFixed(2)

		editSale(tempId, { quantity: ui.editQty, total: newTotal })

		if (shiftId && dbId) {
			try {
				await apiUpdateSale(shiftId, dbId, { quantity: ui.editQty })
			} catch { /* local state already updated */ }
		}

		dispatch({ type: 'CANCEL_EDIT' })
	}, [shiftId, ui.editQty, editSale])

	const handleDelete = useCallback(async (dbId, tempId) => {
		if (!window.confirm('¿Eliminar esta venta?')) return

		removeSale(tempId)

		if (shiftId && dbId) {
			try {
				await apiDeleteSale(shiftId, dbId)
			} catch { /* local state already updated */ }
		}
	}, [shiftId, removeSale])

	return {
		groups,
		expandedIds: ui.expandedIds,
		editingId: ui.editingId,
		editQty: ui.editQty,
		toggleExpand,
		isExpanded,
		startEdit,
		cancelEdit,
		setEditQty,
		saveEdit,
		handleDelete,
	}
}
