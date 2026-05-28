import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../app/data-context.jsx'
import { useShift } from '../modules/shift/shift-context.jsx'
import { calculate } from '../data/index.js'
import { Modal } from '../components/Modal.jsx'
import { ProductForm } from '../modules/products/product-form.jsx'
import { PresentationForm } from '../modules/presentations/presentation-form.jsx'
import { SaleForm } from '../components/sale-form.jsx'
import * as productService from '../modules/products/services/product-services.js'
import * as presService from '../modules/presentations/services/presentation-services.js'
import * as stockService from '../modules/stock/services/stock-services.js'
import * as supplierService from '../modules/suppliers/services/supplier-services.js'

export const ProductDetailPage = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const { categories, products, presentations, suppliers, online, setProducts, setPresentations } = useData()
	const { shift, addSale } = useShift()

	const product = products.find((p) => p._id === id)
	const productPres = presentations.filter((p) => p.productId === id)
	const category = categories.find((c) => c._id === product?.categoryId)
	const isFraction = product?.saleType === 'fraction'

	// ── Editing state ───────────────────────────────────────
	const [editProductOpen, setEditProductOpen] = useState(false)
	const [presFormOpen, setPresFormOpen] = useState(false)
	const [editingPres, setEditingPres] = useState(null)
	const [salePresId, setSalePresId] = useState(null)

	// Stock grams inline edit
	const [stockGramsEdit, setStockGramsEdit] = useState(false)
	const [stockGramsValue, setStockGramsValue] = useState('')

	// Supplier panel
	const [showSuppliers, setShowSuppliers] = useState(false)
	const [productSuppliers, setProductSuppliers] = useState([])

	useEffect(() => {
		if (product && showSuppliers) {
			supplierService.getProductSuppliers(product._id)
				.then(setProductSuppliers)
				.catch(console.error)
		}
	}, [product, showSuppliers])

	// ── Product CRUD ────────────────────────────────────────

	const handleEditProduct = useCallback(async (data) => {
		if (!product) return
		try {
			const updated = await productService.updateProduct(product._id, data, { online })
			if (updated) {
				setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
			} else {
				setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, ...data } : p)))
			}
		} catch (e) { console.error(e) }
		setEditProductOpen(false)
	}, [product, online, setProducts])

	const handleDeleteProduct = useCallback(async () => {
		if (!product) return
		if (!window.confirm('¿Eliminar este producto y todas sus presentaciones?')) return
		try {
			await productService.deleteProduct(product._id, { online })
			setProducts((prev) => prev.filter((p) => p._id !== product._id))
			setPresentations((prev) => prev.filter((p) => p.productId !== product._id))
			navigate('/products')
		} catch (e) { console.error(e) }
	}, [product, online, setProducts, setPresentations, navigate])

	// ── Presentation CRUD ───────────────────────────────────

	const handleCreatePres = useCallback(async (data) => {
		if (!product) return
		try {
			const created = await presService.createPresentation({ productId: product._id, ...data }, { online })
			setPresentations((prev) => [...prev, created])
		} catch (e) { console.error(e) }
		setPresFormOpen(false)
	}, [product, online, setPresentations])

	const handleEditPres = useCallback(async (data) => {
		if (!editingPres) return
		try {
			const updated = await presService.updatePresentation(editingPres._id, data, { online })
			if (updated) {
				setPresentations((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
			} else {
				setPresentations((prev) => prev.map((p) => (p._id === editingPres._id ? { ...p, ...data } : p)))
			}
		} catch (e) { console.error(e) }
		setEditingPres(null)
	}, [editingPres, online, setPresentations])

	const handleDeletePres = useCallback(async (presId) => {
		if (!window.confirm('¿Eliminar esta presentación?')) return
		try {
			await presService.deletePresentation(presId, { online })
			setPresentations((prev) => prev.filter((p) => p._id !== presId))
		} catch (e) { console.error(e) }
	}, [online, setPresentations])

	// ── Stock ───────────────────────────────────────────────

	const handleStockGramsSave = useCallback(async () => {
		if (!product) return
		const val = parseInt(stockGramsValue)
		if (isNaN(val) || val < 0) return
		try {
			const updated = await stockService.updateStockGrams(product._id, val, { online })
			if (updated) {
				setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
			} else {
				setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, stockGrams: val } : p)))
			}
		} catch (e) { console.error(e) }
		setStockGramsEdit(false)
	}, [product, stockGramsValue, online, setProducts])

	// ── Sale ────────────────────────────────────────────────

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

	// ── Suppliers ───────────────────────────────────────────

	const handleAddSupplier = useCallback(async (supplierId, purchaseCost) => {
		if (!product) return
		try {
			const ps = await supplierService.createProductSupplier(
				{ productId: product._id, supplierId, purchaseCost },
				{ online },
			)
			if (ps) setProductSuppliers((prev) => [...prev, ps])
		} catch (e) { console.error(e) }
	}, [product, online])

	const handleRemoveSupplier = useCallback(async (psId) => {
		try {
			await supplierService.deleteProductSupplier(psId, { online })
			setProductSuppliers((prev) => prev.filter((ps) => ps._id !== psId))
		} catch (e) { console.error(e) }
	}, [online])

	const handleUseSupplierCost = useCallback(async (cost) => {
		if (!product) return
		const data = { name: product.name, purchaseCost: cost, saleType: product.saleType, stockGrams: product.stockGrams }
		try {
			const updated = await productService.updateProduct(product._id, data, { online })
			if (updated) {
				setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
			} else {
				setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, purchaseCost: cost } : p)))
			}
		} catch (e) { console.error(e) }
	}, [product, online, setProducts])

	if (!product) {
		return (
			<div className="stock-page">
				<p className="placeholder" style={{ textAlign: 'center', padding: '40px', color: '#616161' }}>
					Producto no encontrado
				</p>
			</div>
		)
	}

	const assignedSupplierIds = productSuppliers.map((ps) => ps.supplierId)

	return (
		<div className="detail-page">
			<div className="detail-page__header">
				<button className="sidebar__btn" onClick={() => navigate('/products')}>
					← Volver
				</button>
				<div className="detail-page__header-right">
					<button className="sidebar__btn" onClick={() => setEditProductOpen(true)}>
						Editar
					</button>
					<button className="sidebar__btn sidebar__btn--danger" onClick={handleDeleteProduct}>
						Eliminar
					</button>
				</div>
			</div>

			<h2 className="detail-page__title">{product.name}</h2>

			<div className="detail-page__info">
				<div className="detail-page__info-row">
					<span className="detail-page__info-label">Tipo</span>
					<span>{isFraction ? 'Fraccionable' : 'Unidad'}</span>
				</div>
				<div className="detail-page__info-row">
					<span className="detail-page__info-label">Categoría</span>
					<span>{category?.name ?? '—'}</span>
				</div>
				<div className="detail-page__info-row">
					<span className="detail-page__info-label">Costo de compra</span>
					<span>${product.purchaseCost?.toLocaleString() ?? 'Sin datos'}</span>
				</div>

				{isFraction && (
					<div className="detail-page__info-row">
						<span className="detail-page__info-label">Stock (gramos)</span>
						<span>
							{stockGramsEdit ? (
								<span className="stock-edit-inline">
									<input
										className="field-input field-input--xs"
										type="number"
										value={stockGramsValue}
										onChange={(e) => setStockGramsValue(e.target.value)}
									/>
									<button className="sidebar__btn sidebar__btn--xs" onClick={handleStockGramsSave}>OK</button>
									<button className="sidebar__btn sidebar__btn--xs" onClick={() => setStockGramsEdit(false)}>X</button>
								</span>
							) : (
								<>
									{product.stockGrams ?? 0}g
									<button className="sidebar__btn sidebar__btn--xs" onClick={() => {
										setStockGramsValue(String(product.stockGrams ?? 0))
										setStockGramsEdit(true)
									}}>Ajustar</button>
								</>
							)}
						</span>
					</div>
				)}
			</div>

			{/* ── Presentations ─────────────────────────────── */}
			<div className="detail-page__section">
				<div className="detail-page__section-header">
					<h3>Presentaciones</h3>
					<button className="sidebar__btn" onClick={() => setPresFormOpen(true)}>
						+ Nueva
					</button>
				</div>

				{productPres.length === 0 ? (
					<p className="placeholder" style={{ color: '#616161' }}>
						Sin presentaciones
					</p>
				) : (
					<div className="detail-page__pres-grid">
						{productPres.map((pres) => {
							const calc = calculate(product, pres)
							const diffClass =
								calc.priceDifference !== null
									? calc.priceDifference < 0
										? 'detail-page__diff--negative'
										: calc.priceDifference > 0
											? 'detail-page__diff--positive'
											: 'detail-page__diff--neutral'
									: 'detail-page__diff--neutral'

							return (
								<div key={pres._id} className="detail-page__pres-card">
									<div className="detail-page__pres-header">
										<span className="detail-page__pres-label">{pres.label}</span>
										<div className="detail-page__pres-actions">
											{shift && shift.status === 'open' && (
												<button
													className="shift-bar__btn shift-bar__btn--primary shift-bar__btn--sm"
													onClick={() => setSalePresId(salePresId === pres._id ? null : pres._id)}
												>
													Vender
												</button>
											)}
											<button className="sidebar__btn sidebar__btn--xs" onClick={() => setEditingPres(pres)}>Editar</button>
											<button className="sidebar__btn sidebar__btn--xs sidebar__btn--danger" onClick={() => handleDeletePres(pres._id)}>X</button>
										</div>
									</div>

									{salePresId === pres._id && (
										<SaleForm
											presentation={pres}
											product={product}
											onSubmit={handleSale}
											onCancel={() => setSalePresId(null)}
										/>
									)}

									<div className="detail-page__pres-details">
										<div className="detail-page__pres-row">
											<span>Cantidad:</span>
											<span>{pres.grams !== null ? `${pres.grams}g` : 'Unidad'}</span>
										</div>
										{!isFraction && (
											<div className="detail-page__pres-row">
												<span>Stock:</span>
												<span>{pres.stock ?? 0}</span>
											</div>
										)}
										<div className="detail-page__pres-row">
											<span>Margen:</span>
											<span>{pres.margin != null ? `${pres.margin}%` : '—'}</span>
										</div>
										<div className="detail-page__pres-row">
											<span>Precio venta:</span>
											<span className="detail-page__pres-value">${pres.salePrice?.toLocaleString() ?? 'Sin precio'}</span>
										</div>
										<div className="detail-page__pres-row">
											<span>Costo x pres.:</span>
											<span>${calc.costPerPresentation?.toLocaleString() ?? '—'}</span>
										</div>
										<div className="detail-page__pres-row">
											<span>Precio lista:</span>
											<span>${calc.listPrice?.toLocaleString() ?? '—'}</span>
										</div>
										<div className={`detail-page__pres-row ${diffClass}`}>
											<span>Diferencia:</span>
											<span>
												{calc.priceDifferencePercent !== null
													? `${calc.priceDifferencePercent.toFixed(2)}%`
													: '—'}
												{calc.priceDifference !== null && ` ($${calc.priceDifference.toLocaleString()})`}
											</span>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>

			{/* ── Suppliers ─────────────────────────────────── */}
			<div className="detail-page__section">
				<div className="detail-page__section-header">
					<h3>Proveedores</h3>
					<button className="sidebar__btn" onClick={() => setShowSuppliers(!showSuppliers)}>
						{showSuppliers ? 'Ocultar' : 'Gestionar'}
					</button>
				</div>

				{showSuppliers && (
					<div className="detail-page__suppliers">
						{productSuppliers.length === 0 && (
							<p className="placeholder" style={{ color: '#616161' }}>Sin proveedores asignados</p>
						)}
						{suppliers
							.filter((s) => assignedSupplierIds.includes(s._id))
							.map((s) => {
								const ps = productSuppliers.find((ps) => ps.supplierId === s._id)
								return (
									<div key={s._id} className="detail-page__supplier-row">
										<span className="detail-page__supplier-name">{s.name}</span>
										<span className="detail-page__supplier-cost">
											${ps?.purchaseCost?.toLocaleString() ?? '—'}
										</span>
										<button
											className="sidebar__btn sidebar__btn--xs"
											onClick={() => handleUseSupplierCost(ps?.purchaseCost)}
										>
											Usar costo
										</button>
										<button
											className="sidebar__btn sidebar__btn--xs sidebar__btn--danger"
											onClick={() => handleRemoveSupplier(ps._id)}
										>
											X
										</button>
									</div>
								)
							})}
						{suppliers.filter((s) => !assignedSupplierIds.includes(s._id)).length > 0 && (
							<div className="detail-page__supplier-add">
								<select
									className="field-input field-input--sm"
									onChange={(e) => {
										const sid = e.target.value
										e.target.value = ''
										if (sid) handleAddSupplier(sid, 0)
									}}
								>
									<option value="">Agregar proveedor...</option>
									{suppliers
										.filter((s) => !assignedSupplierIds.includes(s._id))
										.map((s) => (
											<option key={s._id} value={s._id}>{s.name}</option>
										))
									}
								</select>
							</div>
						)}
					</div>
				)}
			</div>

			{/* ── Modals ────────────────────────────────────── */}
			<Modal open={editProductOpen} onClose={() => setEditProductOpen(false)} title="Editar producto">
				<ProductForm
					initial={product}
					categories={categories}
					onSubmit={handleEditProduct}
					onCancel={() => setEditProductOpen(false)}
				/>
			</Modal>

			<Modal open={presFormOpen} onClose={() => setPresFormOpen(false)} title="Nueva presentación">
				<PresentationForm
					product={product}
					onSubmit={handleCreatePres}
					onCancel={() => setPresFormOpen(false)}
				/>
			</Modal>

			<Modal open={!!editingPres} onClose={() => setEditingPres(null)} title="Editar presentación">
				<PresentationForm
					initial={editingPres}
					product={product}
					onSubmit={handleEditPres}
					onCancel={() => setEditingPres(null)}
				/>
			</Modal>
		</div>
	)
}
