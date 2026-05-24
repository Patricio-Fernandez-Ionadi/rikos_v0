import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import { useShift } from '../context/ShiftContext.jsx'
import { calculate } from '../data/index.js'
import * as api from '../data/api.js'
import { CategoriesSidebar } from '../categorias/cat-sidebar-for-products.jsx'
import { ProductList } from '../products/product-list.jsx'
import { ProductPresentation } from '../products/product-presentation.jsx'
import { Modal } from '../components/Modal.jsx'
import { ProductForm } from '../products/ProductForm.jsx'
import { PresentationForm } from '../products/PresentationForm.jsx'
import { SaleForm } from '../components/SaleForm.jsx'

/**
 * Main product browsing interface.
 * Displays a category sidebar, product list, and presentation detail panel.
 * Supports CRUD on products/presentations, stock tracking, and shift sales.
 */
export const ProductsPage = () => {
	const {
		categories,
		products,
		presentations,
		online,
		setProducts,
		setPresentations,
	} = useData()
	const { shift, addSale } = useShift()

	const [selectedCategoryId, setSelectedCategoryId] = useState(null)
	const [selectedProductId, setSelectedProductId] = useState(null)
	const [showProductForm, setShowProductForm] = useState(false)
	const [showPresForm, setShowPresForm] = useState(false)
	const [editingProduct, setEditingProduct] = useState(null)
	const [editingPres, setEditingPres] = useState(null)
	const [salePresId, setSalePresId] = useState(null)
	const [stockEdit, setStockEdit] = useState(null)
	const [stockValue, setStockValue] = useState('')

	const filteredProducts = selectedCategoryId
		? products.filter((p) => p.categoryId === selectedCategoryId)
		: products

	const selectedProduct = selectedProductId
		? products.find((p) => p._id === selectedProductId)
		: null

	const productPresentations = selectedProduct
		? presentations.filter((p) => p.productId === selectedProduct._id)
		: []

	// ─── CRUD: Product ─────────────────────────────────────
	const handleCreateProduct = async (data) => {
		try {
			if (online) {
				const created = await api.createProduct(data)
				setProducts((prev) => [...prev, created])
			} else {
				const { createProduct: makeProd } = await import('../data/entities.js')
				const created = makeProd(data)
				setProducts((prev) => [...prev, created])
			}
		} catch (e) {
			console.error(e)
		}
		setShowProductForm(false)
	}

	const handleEditProduct = async (data) => {
		if (!editingProduct) return
		try {
			if (online) {
				const updated = await api.updateProduct(editingProduct._id, data)
				setProducts((prev) =>
					prev.map((p) => (p._id === updated._id ? updated : p)),
				)
			} else {
				setProducts((prev) =>
					prev.map((p) =>
						p._id === editingProduct._id ? { ...p, ...data } : p,
					),
				)
			}
		} catch (e) {
			console.error(e)
		}
		setEditingProduct(null)
	}

	const handleDeleteProduct = async (id) => {
		if (!window.confirm('¿Eliminar este producto y todas sus presentaciones?'))
			return
		try {
			if (online) await api.deleteProduct(id)
			setProducts((prev) => prev.filter((p) => p._id !== id))
			setPresentations((prev) => prev.filter((p) => p.productId !== id))
			if (selectedProductId === id) setSelectedProductId(null)
		} catch (e) {
			console.error(e)
		}
	}

	// ─── CRUD: Presentation ─────────────────────────────────
	const handleCreatePres = async (data) => {
		if (!selectedProduct) return
		try {
			const payload = { productId: selectedProduct._id, ...data }
			if (online) {
				const created = await api.createPresentation(payload)
				setPresentations((prev) => [...prev, created])
			} else {
				const { createPresentation: makePres } =
					await import('../data/entities.js')
				const created = makePres(payload)
				setPresentations((prev) => [...prev, created])
			}
		} catch (e) {
			console.error(e)
		}
		setShowPresForm(false)
	}

	const handleEditPres = async (data) => {
		if (!editingPres) return
		try {
			if (online) {
				const updated = await api.updatePresentation(editingPres._id, data)
				setPresentations((prev) =>
					prev.map((p) => (p._id === updated._id ? updated : p)),
				)
			} else {
				setPresentations((prev) =>
					prev.map((p) => (p._id === editingPres._id ? { ...p, ...data } : p)),
				)
			}
		} catch (e) {
			console.error(e)
		}
		setEditingPres(null)
	}

	const handleDeletePres = async (id) => {
		if (!window.confirm('¿Eliminar esta presentación?')) return
		try {
			if (online) await api.deletePresentation(id)
			setPresentations((prev) => prev.filter((p) => p._id !== id))
		} catch (e) {
			console.error(e)
		}
	}

	// ─── Stock ──────────────────────────────────────────────
	const handleStockUpdate = async (presId) => {
		const val = parseInt(stockValue)
		if (isNaN(val) || val < 0) return
		try {
			if (online) {
				const updated = await api.updateStock(presId, val)
				setPresentations((prev) =>
					prev.map((p) => (p._id === updated._id ? updated : p)),
				)
			} else {
				setPresentations((prev) =>
					prev.map((p) => (p._id === presId ? { ...p, stock: val } : p)),
				)
			}
		} catch (e) {
			console.error(e)
		}
		setStockEdit(null)
	}

	// ─── Sale ───────────────────────────────────────────────
	const handleSale = async (sale) => {
		await addSale(sale)
		// Optimistic local stock deduction
		setPresentations((prev) =>
			prev.map((p) =>
				p._id === sale.presentationId
					? { ...p, stock: p.stock - sale.quantity }
					: p,
			),
		)
		setSalePresId(null)
	}

	// ─── Render ─────────────────────────────────────────────
	return (
		<div className='product-browser'>
			<h2 className='product-browser__title'>RIKOS - Navegador de Productos</h2>

			<div className='product-browser__toolbar'>
				<button
					className='sidebar__btn'
					onClick={() => setShowProductForm(true)}
				>
					+ Nuevo producto
				</button>
			</div>

			<div className='product-browser__layout'>
				<CategoriesSidebar
					selected={selectedCategoryId}
					onEvent={setSelectedCategoryId}
					categories={categories}
					products={products}
					filteredProducts={filteredProducts}
				/>

				<div className='product-browser__main'>
					<ProductList
						onEvent={setSelectedProductId}
						filteredProducts={filteredProducts}
						selectedProd={selectedProductId}
						presentations={presentations}
					/>

					{selectedProduct && (
						<div className='detail'>
							<div className='detail__header'>
								<h3 className='detail__title'>{selectedProduct.name}</h3>
								<div className='detail__actions'>
									<button
										className='sidebar__btn sidebar__btn--small'
										onClick={() => setEditingProduct(selectedProduct)}
									>
										Editar
									</button>
									<button
										className='sidebar__btn sidebar__btn--small sidebar__btn--danger'
										onClick={() => handleDeleteProduct(selectedProduct._id)}
									>
										Eliminar
									</button>
									<button
										className='sidebar__btn sidebar__btn--small'
										onClick={() => setShowPresForm(true)}
									>
										+ Presentación
									</button>
								</div>
							</div>
							<p className='detail__cost'>
								<strong>Costo de compra:</strong> $
								{selectedProduct.purchaseCost?.toLocaleString() ?? 'Sin datos'}
							</p>

							<ProductPresentation
								selectedProd={selectedProduct}
								presentations={productPresentations}
								calculate={calculate}
							/>

							{/* Stock & Sale per presentation */}
							{productPresentations.length > 0 && (
								<div className='pres-list'>
									{productPresentations.map((pres) => (
										<div key={pres._id} className='pres-card'>
											<div className='pres-card__content'>
												<div>
													<div className='pres-card__label'>{pres.label}</div>
													<div className='pres-card__unit'>
														Stock: {pres.stock ?? 0}
														{stockEdit === pres._id ? (
															<span className='stock-edit-inline'>
																<input
																	className='field-input field-input--xs'
																	type='number'
																	value={stockValue}
																	onChange={(e) =>
																		setStockValue(e.target.value)
																	}
																/>
																<button
																	className='sidebar__btn sidebar__btn--xs'
																	onClick={() => handleStockUpdate(pres._id)}
																>
																	OK
																</button>
																<button
																	className='sidebar__btn sidebar__btn--xs'
																	onClick={() => setStockEdit(null)}
																>
																	X
																</button>
															</span>
														) : (
															<button
																className='sidebar__btn sidebar__btn--xs'
																onClick={() => {
																	setStockEdit(pres._id)
																	setStockValue(String(pres.stock ?? 0))
																}}
															>
																Ajustar
															</button>
														)}
													</div>
												</div>
												<div className='pres-card__actions'>
													{shift && shift.status === 'open' && (
														<button
															className='shift-bar__btn shift-bar__btn--primary shift-bar__btn--sm'
															onClick={() =>
																setSalePresId(
																	salePresId === pres._id ? null : pres._id,
																)
															}
														>
															Vender
														</button>
													)}
													<button
														className='sidebar__btn sidebar__btn--xs'
														onClick={() => setEditingPres(pres)}
													>
														Editar
													</button>
													<button
														className='sidebar__btn sidebar__btn--xs sidebar__btn--danger'
														onClick={() => handleDeletePres(pres._id)}
													>
														X
													</button>
												</div>
											</div>

											{salePresId === pres._id && (
												<SaleForm
													presentation={pres}
													onSubmit={handleSale}
													onCancel={() => setSalePresId(null)}
												/>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Modals */}
			<Modal
				open={showProductForm}
				onClose={() => setShowProductForm(false)}
				title='Nuevo producto'
			>
				<ProductForm
					categories={categories}
					onSubmit={handleCreateProduct}
					onCancel={() => setShowProductForm(false)}
				/>
			</Modal>

			<Modal
				open={!!editingProduct}
				onClose={() => setEditingProduct(null)}
				title='Editar producto'
			>
				<ProductForm
					initial={editingProduct}
					categories={categories}
					onSubmit={handleEditProduct}
					onCancel={() => setEditingProduct(null)}
				/>
			</Modal>

			<Modal
				open={showPresForm}
				onClose={() => setShowPresForm(false)}
				title='Nueva presentación'
			>
				<PresentationForm
					onSubmit={handleCreatePres}
					onCancel={() => setShowPresForm(false)}
				/>
			</Modal>

			<Modal
				open={!!editingPres}
				onClose={() => setEditingPres(null)}
				title='Editar presentación'
			>
				<PresentationForm
					initial={editingPres}
					onSubmit={handleEditPres}
					onCancel={() => setEditingPres(null)}
				/>
			</Modal>
		</div>
	)
}
