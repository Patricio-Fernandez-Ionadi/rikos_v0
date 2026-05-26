import { useReducer, useMemo, useCallback } from 'react'
import { useData } from '../../app/data-context.jsx'
import { useShift } from '../../modules/shift/shift-context.jsx'
import { productReducer, INITIAL_PRODUCT_STATE } from './reducer/product-reducer.js'
import * as actions from './reducer/product-actions.js'
import * as productService from './services/product-services.js'
import * as presService from '../presentations/services/presentation-services.js'
import * as stockService from '../stock/services/stock-services.js'

/** @import { useProductManager } from './product-manager' */

/**
 * Encapsulates all state and CRUD logic for the products page.
 */
export function useProductManager() {
	const [state, dispatch] = useReducer(productReducer, INITIAL_PRODUCT_STATE)
	const { categories, products, presentations, online, setProducts, setPresentations } = useData()
	const { shift, addSale } = useShift()

	// ── Derived data ────────────────────────────────────────

	const filteredProducts = useMemo(() => {
		let result = products
		if (state.selectedCategoryIds.length > 0) {
			result = result.filter((p) => state.selectedCategoryIds.includes(p.categoryId))
		}
		if (state.searchTerm.trim()) {
			const term = state.searchTerm.trim().toLowerCase()
			result = result.filter((p) => p.name.toLowerCase().includes(term))
		}
		return result
	}, [products, state.selectedCategoryIds, state.searchTerm])

	const selectedProduct = useMemo(
		() => products.find((p) => p._id === state.selectedProductId) ?? null,
		[products, state.selectedProductId],
	)

	const productPresentations = useMemo(
		() => presentations.filter((p) => p.productId === selectedProduct?._id),
		[presentations, selectedProduct],
	)

	// ── UI actions (dispatch is stable, no useCallback needed) ──

	const handleSelectCategories = actions.selectCategories(dispatch)
	const handleSelectProduct = actions.selectProduct(dispatch)
	const handleSearch = actions.searchProducts(dispatch)
	const openProductFormFn = actions.openProductForm(dispatch)
	const closeProductFormFn = actions.closeProductForm(dispatch)
	const openEditProductFn = actions.editProduct(dispatch)
	const closeEditProductFn = actions.closeEditProduct(dispatch)
	const openPresFormFn = actions.openPresForm(dispatch)
	const closePresFormFn = actions.closePresForm(dispatch)
	const openEditPresFn = actions.editPres(dispatch)
	const closeEditPresFn = actions.closeEditPres(dispatch)
	const openPresentationsModalFn = actions.openPresentationsModal(dispatch)
	const closePresentationsModalFn = actions.closePresentationsModal(dispatch)
	const startSaleFn = actions.startSale(dispatch)
	const cancelSaleFn = actions.cancelSale(dispatch)
	const startStockEditFn = actions.startStockEdit(dispatch)
	const cancelStockEditFn = actions.cancelStockEdit(dispatch)
	const changeStockValueFn = actions.changeStockValue(dispatch)

	// ── Product CRUD ─────────────────────────────────────────

	const createProductFn = useCallback(async (data) => {
		try {
			const created = await productService.createProduct(data, { online })
			setProducts((prev) => [...prev, created])
		} catch (e) {
			console.error(e)
		}
		dispatch({ type: 'CLOSE_PRODUCT_FORM' })
	}, [online, setProducts])

	const editProductFn = useCallback(async (data) => {
		const id = state.editingProduct?._id
		if (!id) return
		try {
			const updated = await productService.updateProduct(id, data, { online })
			if (updated) {
				setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
			} else {
				setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, ...data } : p)))
			}
		} catch (e) {
			console.error(e)
		}
		dispatch({ type: 'CLOSE_EDIT_PRODUCT' })
	}, [online, state.editingProduct, setProducts])

	const deleteProductFn = useCallback(async (id) => {
		if (!window.confirm('¿Eliminar este producto y todas sus presentaciones?')) return
		try {
			await productService.deleteProduct(id, { online })
			setProducts((prev) => prev.filter((p) => p._id !== id))
			setPresentations((prev) => prev.filter((p) => p.productId !== id))
			dispatch({ type: 'SELECT_PRODUCT', id: null })
		} catch (e) {
			console.error(e)
		}
	}, [online, setProducts, setPresentations])

	// ── Presentation CRUD ────────────────────────────────────

	const createPresFn = useCallback(async (data) => {
		if (!selectedProduct) return
		try {
			const payload = { productId: selectedProduct._id, ...data }
			const created = await presService.createPresentation(payload, { online })
			setPresentations((prev) => [...prev, created])
		} catch (e) {
			console.error(e)
		}
		dispatch({ type: 'CLOSE_PRES_FORM' })
	}, [online, selectedProduct, setPresentations])

	const editPresFn = useCallback(async (data) => {
		const id = state.editingPres?._id
		if (!id) return
		try {
			const updated = await presService.updatePresentation(id, data, { online })
			if (updated) {
				setPresentations((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
			} else {
				setPresentations((prev) => prev.map((p) => (p._id === id ? { ...p, ...data } : p)))
			}
		} catch (e) {
			console.error(e)
		}
		dispatch({ type: 'CLOSE_EDIT_PRES' })
	}, [online, state.editingPres, setPresentations])

	const deletePresFn = useCallback(async (id) => {
		if (!window.confirm('¿Eliminar esta presentación?')) return
		try {
			await presService.deletePresentation(id, { online })
			setPresentations((prev) => prev.filter((p) => p._id !== id))
		} catch (e) {
			console.error(e)
		}
	}, [online, setPresentations])

	// ── Stock & Sale ─────────────────────────────────────────

	const updateStockFn = useCallback(async (presId) => {
		const val = parseInt(state.stockValue, 10)
		if (isNaN(val) || val < 0) return
		try {
			const updated = await stockService.updateStock(presId, val, { online })
			if (updated) {
				setPresentations((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
			} else {
				setPresentations((prev) => prev.map((p) => (p._id === presId ? { ...p, stock: val } : p)))
			}
		} catch (e) {
			console.error(e)
		}
		dispatch({ type: 'CANCEL_STOCK_EDIT' })
	}, [online, state.stockValue, setPresentations])

	const handleSaleFn = useCallback(async (sale) => {
		await addSale(sale)
		setPresentations((prev) =>
			prev.map((p) =>
				p._id === sale.presentationId
					? { ...p, stock: p.stock - sale.quantity }
					: p,
			),
		)
		dispatch({ type: 'CANCEL_SALE' })
	}, [addSale, setPresentations])

	return {
		categories, products, presentations, online,
		filteredProducts, selectedProduct, productPresentations,
		shift,
		...state,
		handleSelectCategories,
		handleSelectProduct,
		handleSearch,
		openProductForm: openProductFormFn,
		closeProductForm: closeProductFormFn,
		openEditProduct: openEditProductFn,
		closeEditProduct: closeEditProductFn,
		openPresForm: openPresFormFn,
		closePresForm: closePresFormFn,
		openEditPres: openEditPresFn,
		closeEditPres: closeEditPresFn,
		openPresentationsModal: openPresentationsModalFn,
		closePresentationsModal: closePresentationsModalFn,
		startSale: startSaleFn,
		cancelSale: cancelSaleFn,
		startStockEdit: startStockEditFn,
		cancelStockEdit: cancelStockEditFn,
		changeStockValue: changeStockValueFn,
		createProduct: createProductFn,
		editProduct: editProductFn,
		deleteProduct: deleteProductFn,
		createPres: createPresFn,
		editPres: editPresFn,
		deletePres: deletePresFn,
		updateStock: updateStockFn,
		handleSale: handleSaleFn,
	}
}
