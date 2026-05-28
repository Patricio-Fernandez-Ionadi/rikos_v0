import { useNavigate } from 'react-router-dom'
import { useData } from '../../app/data-context.jsx'
import { useProductDetail } from './product-detail-manager.js'
import { Modal } from '../../components/Modal.jsx'
import { ProductForm } from './product-form.jsx'
import { PresentationForm } from '../presentations/presentation-form.jsx'
import { SaleForm } from '../../components/sale-form.jsx'

export const ProductDetail = ({ productId }) => {
	const navigate = useNavigate()
	const { categories, suppliers } = useData()

	const {
		product, productPres, category, isFraction,
		productSuppliers, assignedSupplierIds, activeSupplier,
		shift,
		calculate,
		editProductOpen, setEditProductOpen,
		presFormOpen, setPresFormOpen,
		editingPres, setEditingPres,
		salePresId, setSalePresId,
		stockGramsEdit, setStockGramsEdit,
		stockGramsValue, setStockGramsValue,
		handleEditProduct, handleDeleteProduct,
		handleCreatePres, handleEditPres, handleDeletePres,
		handleStockGramsSave,
		handleSale,
		handleAddSupplier, handleRemoveSupplier, handleUseSupplierCost,
	} = useProductDetail(productId)

	if (!product) {
		return (
			<div className='stock-page'>
				<p className='placeholder'>Producto no encontrado</p>
			</div>
		)
	}

	return (
		<div className='detail-page'>
			<div className='detail-page__header'>
				<button className='sidebar__btn' onClick={() => navigate('/products')}>
					← Volver
				</button>
				<div className='detail-page__header-right'>
					<button className='sidebar__btn' onClick={() => setEditProductOpen(true)}>
						Editar
					</button>
					<button className='sidebar__btn sidebar__btn--danger' onClick={handleDeleteProduct}>
						Eliminar
					</button>
				</div>
			</div>

			<h2 className='detail-page__title'>{product.name}</h2>

			<div className='detail-page__info'>
				<div className='detail-page__info-row'>
					<span className='detail-page__info-label'>Marca</span>
					<span>{product.marca || '—'}</span>
				</div>
				<div className='detail-page__info-row'>
					<span className='detail-page__info-label'>Tipo</span>
					<span>{isFraction ? 'Fraccionable' : 'Unidad'}</span>
				</div>
				<div className='detail-page__info-row'>
					<span className='detail-page__info-label'>Categoría</span>
					<span>{category?.name ?? '—'}</span>
				</div>
				<div className='detail-page__info-row'>
					<span className='detail-page__info-label'>Costo de compra</span>
					<span>${product.purchaseCost?.toLocaleString() ?? 'Sin datos'}</span>
				</div>

				{isFraction && (
					<div className='detail-page__info-row'>
						<span className='detail-page__info-label'>Stock (gramos)</span>
						<span>
							{stockGramsEdit ? (
								<span className='stock-edit-inline'>
									<input className='field-input field-input--xs' type='number'
										value={stockGramsValue}
										onChange={(e) => setStockGramsValue(e.target.value)} />
									<button className='sidebar__btn sidebar__btn--xs' onClick={handleStockGramsSave}>OK</button>
									<button className='sidebar__btn sidebar__btn--xs' onClick={() => setStockGramsEdit(false)}>X</button>
								</span>
							) : (
								<>
									{product.stockGrams ?? 0}g
									<button className='sidebar__btn sidebar__btn--xs' onClick={() => {
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
			<div className='detail-page__section'>
				<div className='detail-page__section-header'>
					<h3>Presentaciones</h3>
					<button className='sidebar__btn' onClick={() => setPresFormOpen(true)}>
						+ Nueva
					</button>
				</div>

				{productPres.length === 0 ? (
					<p className='placeholder' style={{ color: '#616161' }}>Sin presentaciones</p>
				) : (
					<div className='detail-page__pres-grid'>
						{productPres.map((pres) => {
							const calc = calculate(pres)
							const diffClass = calc.priceDifference !== null
								? calc.priceDifference < 0
									? 'detail-page__diff--negative'
									: calc.priceDifference > 0
										? 'detail-page__diff--positive'
										: 'detail-page__diff--neutral'
								: 'detail-page__diff--neutral'

							return (
								<div key={pres._id} className='detail-page__pres-card'>
									<div className='detail-page__pres-header'>
										<span className='detail-page__pres-label'>{pres.label}</span>
										<div className='detail-page__pres-actions'>
											{shift && shift.status === 'open' && (
												<button className='shift-bar__btn shift-bar__btn--primary shift-bar__btn--sm'
													onClick={() => setSalePresId(salePresId === pres._id ? null : pres._id)}>
													Vender
												</button>
											)}
											<button className='sidebar__btn sidebar__btn--xs' onClick={() => setEditingPres(pres)}>
												Editar
											</button>
											<button className='sidebar__btn sidebar__btn--xs sidebar__btn--danger'
												onClick={() => handleDeletePres(pres._id)}>
												X
											</button>
										</div>
									</div>

									{salePresId === pres._id && (
										<SaleForm presentation={pres} product={product}
											onSubmit={handleSale} onCancel={() => setSalePresId(null)} />
									)}

									<div className='detail-page__pres-details'>
										<div className='detail-page__pres-row'>
											<span>Cantidad:</span>
											<span>{pres.grams !== null ? `${pres.grams}g` : 'Unidad'}</span>
										</div>
										{!isFraction && (
											<div className='detail-page__pres-row'>
												<span>Stock:</span>
												<span>{pres.stock ?? 0}</span>
											</div>
										)}
										<div className='detail-page__pres-row'>
											<span>Margen:</span>
											<span>{pres.margin != null ? `${pres.margin}%` : '—'}</span>
										</div>
										<div className='detail-page__pres-row'>
											<span>Precio venta:</span>
											<span className='detail-page__pres-value'>${pres.salePrice?.toLocaleString() ?? 'Sin precio'}</span>
										</div>
										<div className='detail-page__pres-row'>
											<span>Costo x pres.:</span>
											<span>${calc.costPerPresentation?.toLocaleString() ?? '—'}</span>
										</div>
										<div className='detail-page__pres-row'>
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
			<div className='detail-page__section'>
				<div className='detail-page__section-header'>
					<h3>Proveedores</h3>
				</div>

				<div className='detail-page__suppliers'>
					{productSuppliers.length === 0 ? (
						<p className='placeholder' style={{ color: '#616161' }}>Sin proveedores asignados</p>
					) : (
						suppliers.filter((s) => assignedSupplierIds.includes(s._id))
							.map((s) => {
								const ps = productSuppliers.find((ps) => ps.supplierId === s._id)
								const isActive = ps?.supplierId === activeSupplier
								const diff = isActive || product.purchaseCost == null
									? null
									: ps.purchaseCost - product.purchaseCost
								const diffClass = diff == null ? '' : diff < 0 ? 'detail-page__diff--positive' : 'detail-page__diff--negative'
								return (
									<div key={s._id}
										className={`detail-page__supplier-row${isActive ? ' detail-page__supplier-row--active' : ''}`}
										onClick={() => isActive ? null : handleUseSupplierCost(ps?.purchaseCost)}
										role='button' tabIndex={0}>
										<span className='detail-page__supplier-name'>
											{s.name}{isActive && ' ✓'}
										</span>
										<span className={`detail-page__supplier-cost ${diffClass}`}>
											${ps?.purchaseCost?.toLocaleString() ?? '—'}
											{diff != null && ` (${diff > 0 ? '+' : ''}${diff.toLocaleString()})`}
										</span>
										<button className='sidebar__btn sidebar__btn--xs sidebar__btn--danger'
											onClick={(e) => { e.stopPropagation(); handleRemoveSupplier(ps._id) }}>
											X
										</button>
									</div>
								)
							})
					)}
					{suppliers.filter((s) => !assignedSupplierIds.includes(s._id)).length > 0 && (
						<div className='detail-page__supplier-add'>
							<select className='field-input field-input--sm'
								onChange={(e) => {
									const sid = e.target.value
									e.target.value = ''
									if (sid) handleAddSupplier(sid, 0)
								}}>
								<option value=''>Agregar proveedor...</option>
								{suppliers.filter((s) => !assignedSupplierIds.includes(s._id))
									.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
							</select>
						</div>
					)}
				</div>
			</div>

			{/* ── Modals ────────────────────────────────────── */}
			<Modal open={editProductOpen} onClose={() => setEditProductOpen(false)} title='Editar producto'>
				<ProductForm initial={product} categories={categories}
					onSubmit={handleEditProduct} onCancel={() => setEditProductOpen(false)} />
			</Modal>

			<Modal open={presFormOpen} onClose={() => setPresFormOpen(false)} title='Nueva presentación'>
				<PresentationForm product={product} onSubmit={handleCreatePres} onCancel={() => setPresFormOpen(false)} />
			</Modal>

			<Modal open={!!editingPres} onClose={() => setEditingPres(null)} title='Editar presentación'>
				<PresentationForm initial={editingPres} product={product}
					onSubmit={handleEditPres} onCancel={() => setEditingPres(null)} />
			</Modal>
		</div>
	)
}
