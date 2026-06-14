import { useCallback, useState } from 'react'
import { useCatalog } from '../../app/catalog-context.jsx'
import * as categoryService from './services/category-services.js'

export function useCategoryManager() {
	const { categories, setCategories } = useCatalog()
	const [editingCategory, setEditingCategory] = useState(null)
	const [formOpen, setFormOpen] = useState(false)

	const openForm = useCallback((category) => {
		setEditingCategory(category ?? null)
		setFormOpen(true)
	}, [])

	const closeForm = useCallback(() => {
		setEditingCategory(null)
		setFormOpen(false)
	}, [])

	const createCategory = useCallback(async (name) => {
		try {
			const created = await categoryService.createCategory(name)
			setCategories((prev) => [...prev, created])
			closeForm()
		} catch (e) {
			console.error(e)
		}
	}, [setCategories, closeForm])

	const updateCategory = useCallback(async (id, name) => {
		try {
			const updated = await categoryService.updateCategory(id, name)
			setCategories((prev) => prev.map((c) => (c._id === updated._id ? updated : c)))
			closeForm()
		} catch (e) {
			console.error(e)
		}
	}, [setCategories, closeForm])

	const deleteCategory = useCallback(async (id) => {
		if (!window.confirm('Eliminar esta categoria?')) return
		try {
			await categoryService.deleteCategory(id)
			setCategories((prev) => prev.filter((c) => c._id !== id))
		} catch (e) {
			console.error(e)
		}
	}, [setCategories])

	return {
		categories,
		editingCategory,
		formOpen,
		openForm,
		closeForm,
		createCategory,
		updateCategory,
		deleteCategory,
	}
}
