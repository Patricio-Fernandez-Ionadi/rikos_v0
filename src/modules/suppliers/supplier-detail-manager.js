import { useState, useEffect, useCallback, useMemo } from 'react'
import { useCatalog } from '../../app/catalog-context.jsx'
import * as supplierService from './services/supplier-services.js'
import * as productService from '../products/services/product-services.js'

/**
 * Manager hook for the supplier detail page.
 * Encapsulates all state, data loading, and actions.
 *
 * @param {string} supplierId
 */
export function useSupplierDetailManager(supplierId) {
	const { suppliers, products, categories, setProducts } = useCatalog()

	const supplier = suppliers.find((s) => s._id === supplierId)

	// ── Product-supplier links ──────────────────────────────
	const [productSuppliers, setProductSuppliers] = useState([])

	useEffect(() => {
		if (supplierId) {
			supplierService
				.getProductSuppliersBySupplier(supplierId)
				.then(setProductSuppliers)
				.catch(console.error)
		}
	}, [supplierId])

	// ── Add product form state ──────────────────────────────
	const [showAddForm, setShowAddForm] = useState(false)
	const [addMode, setAddMode] = useState('existing')
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedProductId, setSelectedProductId] = useState('')
	const [newCatId, setNewCatId] = useState(categories[0]?._id ?? '')
	const [newName, setNewName] = useState('')
	const [purchaseCost, setPurchaseCost] = useState('')

	// ── Derived product type ────────────────────────────────
	const selectedProduct = useMemo(
		() => products.find((p) => p._id === selectedProductId) ?? null,
		[products, selectedProductId],
	)
	const isFraction = addMode === 'new' ? false : selectedProduct?.saleType === 'fraction'

	const handleAddProduct = useCallback(async () => {
		if (!purchaseCost) return
		const cost = parseFloat(purchaseCost)
		if (isNaN(cost) || cost < 0) return
		let pid = selectedProductId

		if (addMode === 'new') {
			if (!newName.trim() || !newCatId) return
			const created = await productService.createProduct({
				categoryId: newCatId,
				name: newName.trim(),
				purchaseCost: cost,
			})
			setProducts((prev) => [...prev, created])
			pid = created._id
		}

		if (!pid) return
		try {
			const ps = await supplierService.createProductSupplier({
				productId: pid,
				supplierId,
				purchaseCost: cost,
			})
			setProductSuppliers((prev) => [...prev, ps])
		} catch (e) {
			alert(e.message || 'Error al asignar producto')
		}

		setShowAddForm(false)
		setSelectedProductId('')
		setNewName('')
		setPurchaseCost('')
		setSearchTerm('')
	}, [supplierId, addMode, selectedProductId, newName, newCatId, purchaseCost, setProducts])

	// ── Edit cost inline ────────────────────────────────────
	const [editingPS, setEditingPS] = useState(null)
	const [editCost, setEditCost] = useState('')

	const handleUpdateCost = useCallback(async (psId) => {
		const cost = parseFloat(editCost)
		if (isNaN(cost) || cost < 0) return
		try {
			const updated = await supplierService.updateProductSupplier(psId, {
				purchaseCost: cost,
			})
			setProductSuppliers((prev) =>
				prev.map((ps) => (ps._id === updated._id ? updated : ps)),
			)
		} catch (e) {
			console.error(e)
		}
		setEditingPS(null)
		setEditCost('')
	}, [editCost])

	const handleUnlink = useCallback(async (psId) => {
		if (!window.confirm('¿Desvincular este producto del proveedor?')) return
		try {
			await supplierService.deleteProductSupplier(psId)
			setProductSuppliers((prev) => prev.filter((ps) => ps._id !== psId))
		} catch (e) {
			console.error(e)
		}
	}, [])

	// ── Derived ─────────────────────────────────────────────
	const assignedProductIds = useMemo(
		() => new Set(productSuppliers.map((ps) => ps.productId)),
		[productSuppliers],
	)

	const filteredAvailableProducts = useMemo(() => {
		return products
			.filter((p) => !assignedProductIds.has(p._id))
			.filter((p) => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
			.sort((a, b) => a.name.localeCompare(b.name))
	}, [products, assignedProductIds, searchTerm])

	return {
		supplier,
		productSuppliers,
		filteredAvailableProducts,
		showAddForm, setShowAddForm,
		addMode, setAddMode,
		searchTerm, setSearchTerm,
		selectedProductId, setSelectedProductId,
		newCatId, setNewCatId,
		newName, setNewName,
		purchaseCost, setPurchaseCost,
		isFraction,
		editingPS, setEditingPS,
		editCost, setEditCost,
		handleAddProduct,
		handleUpdateCost,
		handleUnlink,
	}
}