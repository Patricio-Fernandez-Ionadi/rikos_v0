import { useState, useCallback, useMemo, useEffect } from 'react'
import { useData } from '../../app/data-context.jsx'
import * as tasksData from './tasks-data.js'

export const TASK_GROUPS = [
	{
		key: 'falta-envasar',
		icon: '📦',
		title: 'Falta envasar',
		desc: 'Productos que necesitan ser envasados',
		isNameType: false,
	},
	{
		key: 'falta-stock',
		icon: '🔄',
		title: 'Falta stock',
		desc: 'Productos que necesitan reposición de stock',
		isNameType: false,
	},
	{
		key: 'productos-sugeridos',
		icon: '💡',
		title: 'Productos sugeridos',
		desc: 'Nombres de productos que no existen aún en los datos',
		isNameType: true,
	},
	{
		key: 'faltan-etiquetas',
		icon: '🏷️',
		title: 'Faltan etiquetas',
		desc: 'Productos que necesitan etiquetas',
		isNameType: false,
	},
	{
		key: 'otros',
		icon: '📌',
		title: 'Otros',
		desc: 'Otras tareas pendientes',
		isNameType: false,
	},
]

export function useTasksManager() {
	const { products } = useData()
	const [version, setVersion] = useState(0)
	const bump = useCallback(() => setVersion((v) => v + 1), [])

	// Load from server on mount
	useEffect(() => {
		tasksData.init().then(bump)
	}, [bump])

	const suggestions = useMemo(() => {
		return tasksData.getNameSuggestions()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [version])

	const getTaskProducts = useCallback(
		(category) => {
			const ids = tasksData.getProductIdsByType(category)
			return ids.map((id) => products.find((p) => p._id === id)).filter(Boolean)
		},
		[products],
	)

	const toggleProductTask = useCallback(
		async (category, productId) => {
			tasksData.toggleProductTask(category, productId)
			bump()
		},
		[bump],
	)

	const isInTask = useCallback(
		(category, productId) => {
			return tasksData.getProductIdsByType(category).includes(productId)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[version],
	)

	const addSuggested = useCallback(
		async (name) => {
			await tasksData.addSuggestion(name)
			bump()
		},
		[bump],
	)

	const removeSuggested = useCallback(
		async (id) => {
			await tasksData.removeSuggestion(id)
			bump()
		},
		[bump],
	)

	const getProductTaskCategories = useCallback(
		(productId) => {
			return tasksData.getProductTaskTypes(productId)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[version],
	)

	return {
		TASK_GROUPS,
		suggestedProducts: suggestions,
		getTaskProducts,
		toggleProductTask,
		isInTask,
		addSuggested,
		removeSuggested,
		getProductTaskCategories,
	}
}
