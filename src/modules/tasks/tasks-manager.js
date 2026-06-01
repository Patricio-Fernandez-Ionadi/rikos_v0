import { useState, useCallback, useMemo } from 'react'
import { useData } from '../../app/data-context.jsx'

const STORAGE_KEY = 'rikos_restock_list'

function loadRestockList() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		return raw ? JSON.parse(raw) : []
	} catch {
		return []
	}
}

function saveRestockList(ids) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
	} catch { /* quota exceeded */ }
}

const TASK_GROUPS = [
	{
		key: 'no-label',
		icon: '🏷️',
		title: 'Sin etiqueta',
		desc: 'Presentaciones sin etiqueta asignada',
		filter: (pres) => !pres.label || pres.label.trim() === '',
	},
	{
		key: 'needs-packaging',
		icon: '📦',
		title: 'Falta envasar',
		desc: 'Productos fraccionados con stock a granel sin envasar',
		filter: () => false,
		productFilter: (prod) => prod.saleType === 'fraction' && (prod.stockGrams ?? 0) > 0,
	},
	{
		key: 'no-stock',
		icon: '🔄',
		title: 'Sin stock',
		desc: 'Presentaciones agotadas',
		filter: (pres) => (pres.stock ?? 0) <= 0,
	},
	{
		key: 'no-price',
		icon: '💰',
		title: 'Sin precio de venta',
		desc: 'Presentaciones sin precio asignado',
		filter: (pres) => pres.salePrice == null,
	},
	{
		key: 'no-margin',
		icon: '📊',
		title: 'Sin margen',
		desc: 'Presentaciones sin margen de ganancia',
		filter: (pres) => pres.margin == null,
	},
	{
		key: 'no-cost',
		icon: '💵',
		title: 'Sin costo de compra',
		desc: 'Productos sin costo de compra registrado',
		productFilter: (prod) => prod.purchaseCost == null,
	},
	{
		key: 'restock',
		icon: '📋',
		title: 'Para pedir',
		desc: 'Productos marcados manualmente para reposición',
		productFilter: () => false,
		isManual: true,
	},
]

const getProduct = (products, id) => products.find((p) => p._id === id)

export function useTasksManager() {
	const { products, presentations } = useData()
	const [restockIds, setRestockIds] = useState(loadRestockList)

	const addToRestock = useCallback((productId) => {
		setRestockIds((prev) => {
			if (prev.includes(productId)) return prev
			const next = [...prev, productId]
			saveRestockList(next)
			return next
		})
	}, [])

	const removeFromRestock = useCallback((productId) => {
		setRestockIds((prev) => {
			const next = prev.filter((id) => id !== productId)
			saveRestockList(next)
			return next
		})
	}, [])

	const isInRestock = useCallback(
		(productId) => restockIds.includes(productId),
		[restockIds],
	)

	const toggleRestock = useCallback((productId) => {
		setRestockIds((prev) => {
			const next = prev.includes(productId)
				? prev.filter((id) => id !== productId)
				: [...prev, productId]
			saveRestockList(next)
			return next
		})
	}, [])

	const taskData = useMemo(() => {
		const activeGroups = TASK_GROUPS.map((group) => {
			if (group.isManual) {
				const matched = restockIds
					.map((id) => getProduct(products, id))
					.filter(Boolean)
				return { group, productItems: matched, presProductItems: [] }
			}
			if (group.productFilter) {
				const matched = products.filter(group.productFilter)
				return { group, productItems: matched, presProductItems: [] }
			}
			const matched = presentations.filter((pres) => {
				const prod = getProduct(products, pres.productId)
				if (!prod) return false
				return group.filter(pres, prod)
			})
			return {
				group,
				productItems: [],
				presProductItems: matched
					.map((pres) => ({
						pres,
						product: getProduct(products, pres.productId),
					}))
					.filter((x) => x.product),
			}
		}).filter((g) => g.productItems.length > 0 || g.presProductItems.length > 0)
		return activeGroups
	}, [products, presentations, restockIds])

	return {
		taskGroups: TASK_GROUPS,
		taskData,
		restockIds,
		addToRestock,
		removeFromRestock,
		isInRestock,
		toggleRestock,
	}
}
