import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../../app/data-context.jsx'
import { useShift } from '../shift/shift-context.jsx'
import { calculate } from '../../data/index.js'
import * as productService from './services/product-services.js'
import * as presService from '../presentations/services/presentation-services.js'
import * as stockService from '../stock/services/stock-services.js'
import * as supplierService from '../suppliers/services/supplier-services.js'

export function useProductDetail(productId) {
	const navigate = useNavigate()
	const {
		categories, products, presentations,
		productSuppliers, setProducts, setPresentations, setProductSuppliers,
	} = useData()
	const { shift, addSale } = useShift()

	const product = useMemo(() => products.find((p) => p._id === productId), [products, productId])
	const productPres = useMemo(() => presentations.filter((p) => p.productId === productId), [presentations, productId])
	const category = useMemo(() => categories.find((c) => c._id === product?.categoryId), [categories, product])
	const isFraction = product?.saleType === 'fraction'

	const assignedSupplierIds = useMemo(() => productSuppliers.map((ps) => ps.supplierId), [productSuppliers])
	const activeSupplier = useMemo(
		() => productSuppliers.find((ps) => ps.purchaseCost === product?.purchaseCost)?.supplierId,
		[productSuppliers, product],
	)

	// ── UI state ──────────────────────────────────────────
	const [editProductOpen, setEditProductOpen] = useState(false)
	const [presFormOpen, setPresFormOpen] = useState(false)
	const [editingPres, setEditingPres] = useState(null)
	const [salePresId, setSalePresId] = useState(null)

	// Stock grams inline edit
	const [stockGramsEdit, setStockGramsEdit] = useState(false)
	const [stockGramsValue, setStockGramsValue] = useState('')

	// ── Load productSuppliers + auto-select random ────────
	useEffect(() => {
		if (product) {
			supplierService
				.getProductSuppliers(product._id)
				.then((pss) => {
					setProductSuppliers(pss)
					if (pss.length > 0) {
						const activePs = pss.find((ps) => ps.purchaseCost === product.purchaseCost)
						if (!activePs) {
							const random = pss[Math.floor(Math.random() * pss.length)]
							productService.updateProduct(product._id, {
								name: product.name, purchaseCost: random.purchaseCost,
								saleType: product.saleType, stockGrams: product.stockGrams,
							}).then((updated) => {
								setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
							}).catch(console.error)
						}
					}
				})
				.catch(console.error)
		}
	}, [product, setProductSuppliers, setProducts])

	// ── Product CRUD ─────────────────────────────────────
	const handleEditProduct = useCallback(async (data) => {
		if (!product) return
		try {
			const updated = await productService.updateProduct(product._id, data)
			setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
		} catch (e) {
			console.error(e)
		}
		setEditProductOpen(false)
	}, [product, setProducts])

	const handleDeleteProduct = useCallback(async () => {
		if (!product) return
		if (!window.confirm('¿Eliminar este producto y todas sus presentaciones?')) return
		try {
			await productService.deleteProduct(product._id)
			setProducts((prev) => prev.filter((p) => p._id !== product._id))
			setPresentations((prev) => prev.filter((p) => p.productId !== product._id))
			navigate('/products')
		} catch (e) {
			console.error(e)
		}
	}, [product, setProducts, setPresentations, navigate])

	// ── Presentation CRUD ────────────────────────────────
	const handleCreatePres = useCallback(async (data) => {
		if (!product) return
		try {
			const created = await presService.createPresentation({ productId: product._id, ...data })
			setPresentations((prev) => [...prev, created])
		} catch (e) {
			console.error(e)
		}
		setPresFormOpen(false)
	}, [product, setPresentations])

	const handleEditPres = useCallback(async (data) => {
		if (!editingPres) return
		try {
			const updated = await presService.updatePresentation(editingPres._id, data)
			setPresentations((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
		} catch (e) {
			console.error(e)
		}
		setEditingPres(null)
	}, [editingPres, setPresentations])

	const handleDeletePres = useCallback(async (presId) => {
		if (!window.confirm('¿Eliminar esta presentación?')) return
		try {
			await presService.deletePresentation(presId)
			setPresentations((prev) => prev.filter((p) => p._id !== presId))
		} catch (e) {
			console.error(e)
		}
	}, [setPresentations])

	// ── Stock ────────────────────────────────────────────
	const handleStockGramsSave = useCallback(async () => {
		if (!product) return
		const val = parseInt(stockGramsValue)
		if (isNaN(val) || val < 0) return
		try {
			const updated = await stockService.updateStockGrams(product._id, val)
			setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
		} catch (e) {
			console.error(e)
		}
		setStockGramsEdit(false)
	}, [product, stockGramsValue, setProducts])

	// ── Sale ─────────────────────────────────────────────
	const handleSale = useCallback(async (sale) => {
		await addSale(sale)
		const pres = presentations.find((p) => p._id === sale.presentationId)
		if (pres) {
			const prod = products.find((p) => p._id === pres.productId)
			if (prod?.saleType === 'fraction') {
				const deduction = sale.quantity * (pres.grams ?? 0)
				setProducts((prev) =>
					prev.map((p) =>
						p._id === prod._id
							? { ...p, stockGrams: Math.max(0, (p.stockGrams ?? 0) - deduction) }
							: p,
					),
				)
			} else {
				setPresentations((prev) =>
					prev.map((p) =>
						p._id === sale.presentationId
							? { ...p, stock: Math.max(0, (p.stock ?? 0) - sale.quantity) }
							: p,
					),
				)
			}
		}
		setSalePresId(null)
	}, [addSale, presentations, products, setProducts, setPresentations])

	// ── Suppliers ────────────────────────────────────────
	const handleAddSupplier = useCallback(async (supplierId, purchaseCost) => {
		if (!product) return
		try {
			const ps = await supplierService.createProductSupplier({ productId: product._id, supplierId, purchaseCost })
			setProductSuppliers((prev) => [...prev, ps])
		} catch (e) {
			console.error(e)
		}
	}, [product, setProductSuppliers])

	const handleRemoveSupplier = useCallback(async (psId) => {
		try {
			await supplierService.deleteProductSupplier(psId)
			setProductSuppliers((prev) => prev.filter((ps) => ps._id !== psId))
		} catch (e) {
			console.error(e)
		}
	}, [setProductSuppliers])

	const handleUseSupplierCost = useCallback(async (cost) => {
		if (!product) return
		try {
			const updated = await productService.updateProduct(product._id, {
				name: product.name, purchaseCost: cost,
				saleType: product.saleType, stockGrams: product.stockGrams,
			})
			setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
		} catch (e) {
			console.error(e)
		}
	}, [product, setProducts])

	return {
		// data
		product, productPres, category, isFraction,
		productSuppliers, assignedSupplierIds, activeSupplier,
		shift, calculate: (pres) => calculate(product, pres),

		// ui state
		editProductOpen, setEditProductOpen,
		presFormOpen, setPresFormOpen,
		editingPres, setEditingPres,
		salePresId, setSalePresId,
		stockGramsEdit, setStockGramsEdit,
		stockGramsValue, setStockGramsValue,

		// actions
		handleEditProduct, handleDeleteProduct,
		handleCreatePres, handleEditPres, handleDeletePres,
		handleStockGramsSave,
		handleSale,
		handleAddSupplier, handleRemoveSupplier, handleUseSupplierCost,
	}
}
