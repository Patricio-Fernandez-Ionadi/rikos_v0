import { useReducer, useMemo, useCallback } from 'react'
import { useCatalog } from '../../app/catalog-context.jsx'
import { useShift } from '../../modules/shift/shift-context.jsx'
import { productReducer, INITIAL_PRODUCT_STATE } from './reducer/product-reducer.js'
import * as actions from './reducer/product-actions.js'
import * as productService from './services/product-services.js'
import * as presService from './product/services/presentation-services.js'
import * as stockService from '../stock/services/stock-services.js'
import * as supplierService from '../suppliers/services/supplier-services.js'
import { filterProducts } from '../../data/filter-products.js'
import { applyStockDeduction } from '../../data/stock-utils.js'

export function useProductManager() {
	const [state, dispatch] = useReducer(productReducer, INITIAL_PRODUCT_STATE)
	const { categories, products, presentations, suppliers, tags, setProducts, setPresentations, setSuppliers } = useCatalog()
	const { shift, addSale } = useShift()

	// ── Derived data ────────────────────────────────────────

	const filteredProducts = useMemo(() => {
		return filterProducts(products, presentations, {
			searchTerm: state.searchTerm,
			categoryIds: state.selectedCategoryIds,
			tags: state.selectedTags,
		})
	}, [products, presentations, state.selectedCategoryIds, state.selectedTags, state.searchTerm])

	const selectedProduct = useMemo(
		() => products.find((p) => p._id === state.selectedProductId) ?? null,
		[products, state.selectedProductId],
	)

	const productPresentations = useMemo(
		() => presentations.filter((p) => p.productId === selectedProduct?._id),
		[presentations, selectedProduct],
	)

	// ── UI actions (dispatch is stable) ─────────────────────

	const handleSelectCategories = actions.selectCategories(dispatch)
	const handleSelectTags = actions.selectTags(dispatch)
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
	const startSaleFn = actions.startSale(dispatch)
	const cancelSaleFn = actions.cancelSale(dispatch)
	const startStockEditFn = actions.startStockEdit(dispatch)
	const cancelStockEditFn = actions.cancelStockEdit(dispatch)
	const changeStockValueFn = actions.changeStockValue(dispatch)
	const toggleSupplierPanelFn = actions.toggleSupplierPanel(dispatch)
	const setProductSuppliersFn = actions.setProductSuppliers(dispatch)

	// ── Product CRUD ─────────────────────────────────────────

	const createProductFn = useCallback(async (data) => {
		const { supplierId, ...productData } = data
		try {
			const created = await productService.createProduct(productData)
			setProducts((prev) => [...prev, created])
			if (supplierId) {
				await supplierService.createProductSupplier({
					productId: created._id, supplierId, purchaseCost: productData.purchaseCost,
				})
			}
			dispatch({ type: 'CLOSE_PRODUCT_FORM' })
			return created
		} catch (e) {
			console.error(e)
		}
	}, [setProducts])

	const editProductFn = useCallback(async (data) => {
		const { supplierId, ...productData } = data
		const id = state.editingProduct?._id
		if (!id) return
		try {
			const updated = await productService.updateProduct(id, productData)
			setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
			if (supplierId) {
				await supplierService.createProductSupplier({
					productId: id, supplierId, purchaseCost: productData.purchaseCost,
				})
			}
		} catch (e) {
			console.error(e)
		}
		dispatch({ type: 'CLOSE_EDIT_PRODUCT' })
	}, [state.editingProduct, setProducts])

	const deleteProductFn = useCallback(async (id) => {
		if (!window.confirm('¿Eliminar este producto y todas sus presentaciones?')) return
		try {
			await productService.deleteProduct(id)
			setProducts((prev) => prev.filter((p) => p._id !== id))
			setPresentations((prev) => prev.filter((p) => p.productId !== id))
			dispatch({ type: 'SELECT_PRODUCT', id: null })
		} catch (e) {
			console.error(e)
		}
	}, [setProducts, setPresentations])

	// ── Presentation CRUD ────────────────────────────────────

	const createPresFn = useCallback(async (data) => {
		if (!selectedProduct) return
		try {
			const payload = { productId: selectedProduct._id, ...data }
			const created = await presService.createPresentation(payload)
			setPresentations((prev) => [...prev, created])
		} catch (e) {
			console.error(e)
		}
		dispatch({ type: 'CLOSE_PRES_FORM' })
	}, [selectedProduct, setPresentations])

	const editPresFn = useCallback(async (data) => {
		const id = state.editingPres?._id
		if (!id) return
		try {
			const updated = await presService.updatePresentation(id, data)
			setPresentations((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
		} catch (e) {
			console.error(e)
		}
		dispatch({ type: 'CLOSE_EDIT_PRES' })
	}, [state.editingPres, setPresentations])

	const deletePresFn = useCallback(async (id) => {
		if (!window.confirm('¿Eliminar esta presentación?')) return
		try {
			await presService.deletePresentation(id)
			setPresentations((prev) => prev.filter((p) => p._id !== id))
		} catch (e) {
			console.error(e)
		}
	}, [setPresentations])

	// ── Stock & Sale ─────────────────────────────────────────

	const updateStockFn = useCallback(async (presId) => {
		const val = parseInt(state.stockValue, 10)
		if (isNaN(val) || val < 0) return
		try {
			const pres = presentations.find((p) => p._id === presId)
			if (!pres) return
			const product = products.find((p) => p._id === pres.productId)
			const isFraction = product?.saleType === 'fraction'

			const updated = await stockService.updateStock(presId, val)
			setPresentations((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))

			if (isFraction && pres.grams) {
				const delta = val - (pres.stock ?? 0)
				if (delta !== 0) {
					const gramsDelta = delta * pres.grams
					const updatedProduct = await stockService.updateStockGrams(product._id, (product.stockGrams ?? 0) + gramsDelta)
					setProducts((prev) => prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)))
				}
			}
		} catch (e) {
			console.error(e)
		}
		dispatch({ type: 'CANCEL_STOCK_EDIT' })
	}, [state.stockValue, setPresentations, setProducts, presentations, products])

	const updateStockGramsFn = useCallback(async (productId, stockGrams) => {
		try {
			const updated = await stockService.updateStockGrams(productId, stockGrams)
			setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
		} catch (e) {
			console.error(e)
		}
	}, [setProducts])

	const handleSaleFn = useCallback(async (sale) => {
		await addSale(sale)
		const result = applyStockDeduction(presentations, products, sale)
		setPresentations(result.presentations)
		setProducts(result.products)
		dispatch({ type: 'CANCEL_SALE' })
	}, [addSale, presentations, products, setProducts, setPresentations])

	// ── Supplier management ─────────────────────────────────

	const loadProductSuppliersFn = useCallback(async (productId) => {
		try {
			const pss = await supplierService.getProductSuppliers(productId)
			setProductSuppliersFn(pss)
		} catch (e) {
			console.error(e)
		}
	}, [setProductSuppliersFn])

	const addProductSupplierFn = useCallback(async (productId, supplierId, purchaseCost) => {
		try {
			const ps = await supplierService.createProductSupplier({ productId, supplierId, purchaseCost })
			setProductSuppliersFn([...state.productSuppliers, ps])
		} catch (e) {
			console.error(e)
		}
	}, [state.productSuppliers, setProductSuppliersFn])

	const removeProductSupplierFn = useCallback(async (psId) => {
		try {
			await supplierService.deleteProductSupplier(psId)
			setProductSuppliersFn(state.productSuppliers.filter((ps) => ps._id !== psId))
		} catch (e) {
			console.error(e)
		}
	}, [state.productSuppliers, setProductSuppliersFn])

	const setProductCostFromSupplierFn = useCallback(async (cost) => {
		if (!selectedProduct) return
		await editProductFn({ ...selectedProduct, purchaseCost: cost })
	}, [selectedProduct, editProductFn])

	// ── Supplier CRUD (global) ──────────────────────────────

	const createSupplierFn = useCallback(async (data) => {
		try {
			const created = await supplierService.createSupplier(data)
			setSuppliers((prev) => [...prev, created])
			return created
		} catch (e) {
			console.error(e)
		}
	}, [setSuppliers])

	const updateSupplierFn = useCallback(async (id, data) => {
		try {
			const updated = await supplierService.updateSupplier(id, data)
			setSuppliers((prev) => prev.map((s) => (s._id === updated._id ? updated : s)))
		} catch (e) {
			console.error(e)
		}
	}, [setSuppliers])

	const deleteSupplierFn = useCallback(async (id) => {
		if (!window.confirm('¿Eliminar este proveedor?')) return
		try {
			await supplierService.deleteSupplier(id)
			setSuppliers((prev) => prev.filter((s) => s._id !== id))
		} catch (e) {
			console.error(e)
		}
	}, [setSuppliers])

	return {
		categories, products, presentations, suppliers, tags,
		filteredProducts, selectedProduct, productPresentations,
		shift,
		...state,
		handleSelectCategories,
		handleSelectTags,
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
		updateStockGrams: updateStockGramsFn,
		handleSale: handleSaleFn,
		toggleSupplierPanel: toggleSupplierPanelFn,
		productSuppliers: state.productSuppliers,
		loadProductSuppliers: loadProductSuppliersFn,
		addProductSupplier: addProductSupplierFn,
		removeProductSupplier: removeProductSupplierFn,
		setProductCostFromSupplier: setProductCostFromSupplierFn,
		createSupplier: createSupplierFn,
		updateSupplier: updateSupplierFn,
		deleteSupplier: deleteSupplierFn,
	}
}
