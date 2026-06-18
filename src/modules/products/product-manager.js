import { useReducer, useMemo, useCallback } from 'react'
import { useCatalog } from '../../app/catalog-context.jsx'
import { useShift } from '../../modules/shifts/shift-context.jsx'
import {
	productReducer,
	INITIAL_PRODUCT_STATE,
} from './reducer/product-reducer.js'
import * as actions from './reducer/product-actions.js'
import * as supplierService from '../suppliers/services/supplier-services.js'
import { useProductCrud } from './hooks/use-product-crud.js'
import { useProductStockSale } from './hooks/use-product-stock-sale.js'

export function useProductManager() {
	const [state, dispatch] = useReducer(productReducer, INITIAL_PRODUCT_STATE)
	const {
		categories,
		products,
		presentations,
		suppliers,
		tags,
		setProducts,
		setPresentations,
		setSuppliers,
	} = useCatalog()
	const { shift, addSale } = useShift()

	const selectedProduct = useMemo(
		() => products.find((p) => p._id === state.selectedProductId) ?? null,
		[products, state.selectedProductId],
	)

	const productPresentations = useMemo(
		() => presentations.filter((p) => p.productId === selectedProduct?._id),
		[presentations, selectedProduct],
	)

	const handleSelectProduct = actions.selectProduct(dispatch)
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

	const {
		createProductFn,
		editProductFn,
		deleteProductFn,
		createPresFn,
		editPresFn,
		deletePresFn,
	} = useProductCrud({
		selectedProduct,
		editingProduct: state.editingProduct,
		setProducts,
		setPresentations,
		dispatch,
	})

	const { updateStockFn, updateStockGramsFn, handleSaleFn } =
		useProductStockSale({
			presentations,
			products,
			setPresentations,
			setProducts,
			addSale,
			stockValue: state.stockValue,
			dispatch,
		})

	const loadProductSuppliersFn = useCallback(
		async (productId) => {
			try {
				const pss = await supplierService.getProductSuppliers(productId)
				setProductSuppliersFn(pss)
			} catch (e) {
				console.error(e)
			}
		},
		[setProductSuppliersFn],
	)

	const addProductSupplierFn = useCallback(
		async (productId, supplierId, purchaseCost) => {
			try {
				const ps = await supplierService.createProductSupplier({
					productId,
					supplierId,
					purchaseCost,
				})
				setProductSuppliersFn([...state.productSuppliers, ps])
			} catch (e) {
				console.error(e)
			}
		},
		[state.productSuppliers, setProductSuppliersFn],
	)

	const removeProductSupplierFn = useCallback(
		async (psId) => {
			try {
				await supplierService.deleteProductSupplier(psId)
				setProductSuppliersFn(
					state.productSuppliers.filter((ps) => ps._id !== psId),
				)
			} catch (e) {
				console.error(e)
			}
		},
		[state.productSuppliers, setProductSuppliersFn],
	)

	const setProductCostFromSupplierFn = useCallback(
		async (cost) => {
			if (!selectedProduct) return
			await editProductFn({ ...selectedProduct, purchaseCost: cost })
		},
		[selectedProduct, editProductFn],
	)

	const createSupplierFn = useCallback(
		async (data) => {
			try {
				const created = await supplierService.createSupplier(data)
				setSuppliers((prev) => [...prev, created])
				return created
			} catch (e) {
				console.error(e)
			}
		},
		[setSuppliers],
	)

	const updateSupplierFn = useCallback(
		async (id, data) => {
			try {
				const updated = await supplierService.updateSupplier(id, data)
				setSuppliers((prev) =>
					prev.map((s) => (s._id === updated._id ? updated : s)),
				)
			} catch (e) {
				console.error(e)
			}
		},
		[setSuppliers],
	)

	const deleteSupplierFn = useCallback(
		async (id) => {
			if (!window.confirm('¿Eliminar este proveedor?')) return
			try {
				await supplierService.deleteSupplier(id)
				setSuppliers((prev) => prev.filter((s) => s._id !== id))
			} catch (e) {
				console.error(e)
			}
		},
		[setSuppliers],
	)

	return {
		categories,
		products,
		presentations,
		suppliers,
		tags,
		selectedProduct,
		productPresentations,
		shift,
		...state,
		handleSelectProduct,
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
