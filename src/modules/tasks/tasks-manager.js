import { useState, useCallback, useMemo, useEffect } from 'react'
import { useCatalog } from '../../app/catalog-context.jsx'
import * as tasksData from './tasks-data.js'

export const TASK_GROUPS = [
	{
		key: 'falta-envasar',
		icon: 'inventory_2',
		title: 'Falta envasar',
		desc: 'Productos que necesitan ser envasados',
		isNameType: false,
	},
	{
		key: 'falta-stock',
		icon: 'autorenew',
		title: 'Falta stock',
		desc: 'Productos que necesitan reposición de stock',
		isNameType: false,
	},
	{
		key: 'productos-sugeridos',
		icon: 'lightbulb',
		title: 'Productos sugeridos',
		desc: 'Nombres de productos que no existen aún en los datos',
		isNameType: true,
	},
	{
		key: 'faltan-etiquetas',
		icon: 'label',
		title: 'Faltan etiquetas',
		desc: 'Productos que necesitan etiquetas',
		isNameType: false,
	},
	{
		key: 'otros',
		icon: 'push_pin',
		title: 'Otros',
		desc: 'Otras tareas pendientes',
		isNameType: false,
		textBased: true,
	},
]

export function useTasksManager() {
	const { products } = useCatalog()
	const [version, setVersion] = useState(0)
	const bump = useCallback(() => setVersion((v) => v + 1), [])

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

	const getTaskItems = useCallback(
		(category) => {
			return tasksData.getTasksByType(category)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[version],
	)

	const toggleProductTask = useCallback(
		async (category, productId, note = '') => {
			tasksData.toggleProductTask(category, productId, note)
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
		async (name, note = '') => {
			await tasksData.addSuggestion(name, note)
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

	const addTextTask = useCallback(
		async (type, description, productId = null, note = '') => {
			await tasksData.addTextTask(type, description, productId, note)
			bump()
		},
		[bump],
	)

	const updateTaskNote = useCallback(
		async (id, note) => {
			await tasksData.updateNote(id, note)
			bump()
		},
		[bump],
	)

	const removeTask = useCallback(
		async (id) => {
			await tasksData.removeTaskById(id)
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

	const getProductNote = useCallback(
		(productId, type) => {
			const items = tasksData.getTasksByType(type)
			const found = items.find((t) => t.productId === productId)
			return found?.note ?? ''
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[version],
	)

	return {
		TASK_GROUPS,
		suggestedProducts: suggestions,
		getTaskProducts,
		getTaskItems,
		toggleProductTask,
		isInTask,
		addSuggested,
		removeSuggested,
		addTextTask,
		updateTaskNote,
		removeTask,
		getProductTaskCategories,
		getProductNote,
	}
}
