import { useState } from 'react'
import {
	categories,
	products,
	presentations,
	calculate,
} from '../data/index.js'

/**
 * Main product browsing interface.
 * Displays a category sidebar, product list, and presentation detail panel.
 * All data is read from the static seed via mock.js; calculations are derived on render.
 */
export const ProductBrowser = () => {
	console.log('Data loaded:', {
		categoriesCount: categories.length,
		productsCount: products.length,
		presentationsCount: presentations.length,
	})

	const [selectedCategoryId, setSelectedCategoryId] = useState(null)
	const [selectedProductId, setSelectedProductId] = useState(null)

	const filteredProducts = selectedCategoryId
		? products.filter((p) => p.categoryId === selectedCategoryId)
		: products

	const selectedProduct = selectedProductId
		? products.find((p) => p._id === selectedProductId)
		: null

	const productPresentations = selectedProduct
		? presentations.filter((p) => p.productId === selectedProduct._id)
		: []

	return (
		<div className="product-browser">
			<h2 className="product-browser__title">RIKOS - Navegador de Productos</h2>

			<div className="product-browser__layout">
				<div className="sidebar">
					<h3 className="sidebar__title">Categorías</h3>
					<button
						className={
							'sidebar__btn sidebar__btn--all' +
							(selectedCategoryId === null ? ' sidebar__btn--active' : '')
						}
						onClick={() => setSelectedCategoryId(null)}
					>
						Todas las categorías
					</button>

					{categories.map((category) => (
						<button
							key={category._id}
							className={
								'sidebar__btn' +
								(selectedCategoryId === category._id ? ' sidebar__btn--active' : '')
							}
							onClick={() => setSelectedCategoryId(category._id)}
						>
							{category.name}
						</button>
					))}

					<div className="sidebar__stats">
						<h4 className="sidebar__stats-title">Estadísticas</h4>
						<p className="sidebar__stat">Total categorías: {categories.length}</p>
						<p className="sidebar__stat">Total productos: {products.length}</p>
						<p className="sidebar__stat">Productos en vista: {filteredProducts.length}</p>
						<p className="sidebar__stat">
							Productos sin costo:{' '}
							{filteredProducts.filter((p) => p.purchaseCost === null).length}
						</p>
					</div>
				</div>

				<div className="product-browser__main">
					{!selectedCategoryId ? (
						<div className="placeholder">
							<h3>Selecciona una categoría</h3>
							<p>Para ver los productos disponibles</p>
						</div>
					) : filteredProducts.length === 0 ? (
						<div className="placeholder">
							<h3>No hay productos en esta categoría</h3>
						</div>
					) : (
						<>
							<h3>Productos</h3>
							<div className="product-list">
								{filteredProducts.map((product) => {
									const presCount = presentations.filter(
										(p) => p.productId === product._id
									)
									return (
										<div
											key={product._id}
											className={
												'product-list__item' +
												(selectedProductId === product._id
													? ' product-list__item--selected'
													: '')
											}
											onClick={() => setSelectedProductId(product._id)}
										>
											<div>
												<div className="product-list__item-name">{product.name}</div>
												<div className="product-list__item-cost">
													Costo: ${' '}
													{product.purchaseCost?.toLocaleString() ?? 'Sin datos'}
												</div>
											</div>
											<div className="product-list__item-meta">
												{presCount.length > 0 ? (
													<>
														<strong>{presCount.length}</strong> presentaciones
														<br />
														{
															presCount.filter((p) => p.salePrice !== null).length
														}{' '}
														con precio
													</>
												) : (
													'Sin presentaciones'
												)}
											</div>
										</div>
									)
								})}
							</div>

							{selectedProduct && (
								<div className="detail">
									<h3 className="detail__title">{selectedProduct.name}</h3>
									<p className="detail__cost">
										<strong>Costo de compra:</strong> $
										{selectedProduct.purchaseCost?.toLocaleString() ?? 'Sin datos'}
									</p>

									{productPresentations.length === 0 ? (
										<p className="empty">No hay presentaciones para este producto</p>
									) : (
										<>
											<h4 className="detail__pres-title">Presentaciones:</h4>
											<div className="pres-list">
												{productPresentations.map((pres) => {
													const calc = calculate(selectedProduct, pres)
													const diffClass =
														calc.priceDifference !== null
															? calc.priceDifference < 0
																? 'pres-card__diff--negative'
																: calc.priceDifference > 0
																	? 'pres-card__diff--positive'
																	: 'pres-card__diff--neutral'
															: 'pres-card__diff--neutral'
													return (
														<div key={pres._id} className="pres-card">
															<div className="pres-card__content">
																<div>
																	<div className="pres-card__label">
																		{pres.label}
																	</div>
																	<div className="pres-card__unit">
																		{pres.grams !== null
																			? `(${pres.grams}g)`
																			: '(unidad completa)'}
																	</div>
																</div>
																<div className="pres-card__details">
																	<div className="pres-card__detail">
																		Margen: {pres.margin ?? '—'}%
																	</div>
																	<div className="pres-card__detail">
																		Costo pres.: $
																		{calc.costPerPresentation?.toLocaleString() ??
																			'—'}
																	</div>
																	<div className="pres-card__detail">
																		Precio lista: $
																		{calc.listPrice?.toLocaleString() ?? '—'}
																	</div>
																	<div className="pres-card__detail pres-card__sale">
																		Precio venta: $
																		{pres.salePrice?.toLocaleString() ??
																			'Sin datos'}
																	</div>
																	<div className={'pres-card__diff ' + diffClass}>
																		Diferencia:{' '}
																		{calc.priceDifferencePercent !== null
																			? `${calc.priceDifferencePercent.toFixed(2)}%`
																			: '—'}
																		($
																		{calc.priceDifference !== null
																			? calc.priceDifference.toLocaleString()
																			: '—'}
																		)
																	</div>
																</div>
															</div>
														</div>
													)
												})}
											</div>
										</>
									)}
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	)
}
