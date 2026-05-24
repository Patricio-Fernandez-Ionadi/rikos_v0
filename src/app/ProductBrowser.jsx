import { useState } from 'react'
import {
	categories,
	products,
	presentations,
	calculate,
} from '../data/index.js'

export const ProductBrowser = () => {
	console.log('Data loaded:', {
		categoriesCount: categories.length,
		productsCount: products.length,
		presentationsCount: presentations.length,
	})

	const [selectedCategoryId, setSelectedCategoryId] = useState(null)
	const [selectedProductId, setSelectedProductId] = useState(null)

	// Get products for selected category (or all if none selected)
	const filteredProducts = selectedCategoryId
		? products.filter((p) => p.categoryId === selectedCategoryId)
		: products

	// Get selected product
	const selectedProduct = selectedProductId
		? products.find((p) => p._id === selectedProductId)
		: null

	// Get presentations for selected product
	const productPresentations = selectedProduct
		? presentations.filter((p) => p.productId === selectedProduct._id)
		: []

	return (
		<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
			<h2>RIKOS - Navegador de Productos</h2>

			<div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
				{/* Category Sidebar */}
				<div
					style={{
						width: '250px',
						borderRight: '1px solid #eee',
						paddingRight: '20px',
					}}
				>
					<h3>Categorías</h3>
					<button
						onClick={() => setSelectedCategoryId(null)}
						style={{
							width: '100%',
							padding: '8px',
							marginBottom: '10px',
							background: selectedCategoryId === null ? '#007bff' : '#f8f9fa',
							color: selectedCategoryId === null ? 'white' : 'black',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Todas las categorías
					</button>

					{categories.map((category) => (
						<button
							key={category._id}
							onClick={() => setSelectedCategoryId(category._id)}
							style={{
								width: '100%',
								padding: '8px',
								marginBottom: '5px',
								background:
									selectedCategoryId === category._id ? '#007bff' : '#f8f9fa',
								color: selectedCategoryId === category._id ? 'white' : 'black',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							{category.name}
						</button>
					))}

					<div
						style={{
							marginTop: '20px',
							paddingTop: '15px',
							borderTop: '1px solid #eee',
						}}
					>
						<h4>Estadísticas</h4>
						<p>Total categorías: {categories.length}</p>
						<p>Total productos: {products.length}</p>
						<p>Productos en vista: {filteredProducts.length}</p>
						<p>
							Productos sin costo:{' '}
							{filteredProducts.filter((p) => p.purchaseCost === null).length}
						</p>
					</div>
				</div>

				{/* Main Content */}
				<div style={{ flex: 1 }}>
					{!selectedCategoryId ? (
						<div
							style={{ textAlign: 'center', padding: '40px', color: '#666' }}
						>
							<h3>Selecciona una categoría</h3>
							<p>Para ver los productos disponibles</p>
						</div>
					) : filteredProducts.length === 0 ? (
						<div
							style={{ textAlign: 'center', padding: '40px', color: '#666' }}
						>
							<h3>No hay productos en esta categoría</h3>
						</div>
					) : (
						<>
							<h3>Productos</h3>
							<div
								style={{
									maxHeight: '400px',
									overflowY: 'auto',
									border: '1px solid #ddd',
									borderRadius: '4px',
								}}
							>
								{filteredProducts.map((product) => (
									<div
										key={product._id}
										onClick={() => setSelectedProductId(product._id)}
										style={{
											padding: '12px',
											borderBottom: '1px solid #f0f0f0',
											background:
												selectedProductId === product._id ? '#e9f5ff' : 'white',
											cursor: 'pointer',
										}}
									>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}
										>
											<div>
												<strong>{product.name}</strong>
												<br />
												<small style={{ color: '#666' }}>
													Costo: $
													{product.purchaseCost?.toLocaleString() ??
														'Sin datos'}
												</small>
											</div>
											<div style={{ textAlign: 'right', minWidth: '120px' }}>
												{productPresentations.length > 0 ? (
													<>
														<strong>{productPresentations.length}</strong>{' '}
														presentaciones
														<br />
														<small style={{ color: '#666' }}>
															{
																productPresentations.filter(
																	(p) => p.salePrice !== null,
																).length
															}{' '}
															con precio
														</small>
													</>
												) : (
													<span style={{ color: '#999' }}>
														Sin presentaciones
													</span>
												)}
											</div>
										</div>
									</div>
								))}
							</div>

							{selectedProduct && (
								<div
									style={{
										marginTop: '25px',
										padding: '20px',
										border: '1px solid #ddd',
										borderRadius: '4px',
									}}
								>
									<h3>{selectedProduct.name}</h3>
									<p>
										<strong>Costo de compra:</strong> $
										{selectedProduct.purchaseCost?.toLocaleString() ??
											'Sin datos'}
									</p>

									{productPresentations.length === 0 ? (
										<p>No hay presentaciones para este producto</p>
									) : (
										<>
											<h4>Presentaciones:</h4>
											<div
												style={{
													maxHeight: '300px',
													overflowY: 'auto',
													border: '1px solid #eee',
													borderRadius: '4px',
													padding: '10px',
												}}
											>
												{productPresentations.map((pres) => {
													const calc = calculate(selectedProduct, pres)
													return (
														<div
															key={pres._id}
															style={{
																padding: '10px',
																marginBottom: '10px',
																border: '1px solid #f0f0f0',
																borderRadius: '4px',
															}}
														>
															<div
																style={{
																	display: 'flex',
																	justifyContent: 'space-between',
																}}
															>
																<div>
																	<strong>{pres.label}</strong>
																	{pres.grams !== null
																		? `(${pres.grams}g)`
																		: '(unidad completa)'}
																</div>
																<div
																	style={{
																		textAlign: 'right',
																		minWidth: '150px',
																	}}
																>
																	<div>Margen: {pres.margin ?? '—'}%</div>
																	<div>
																		Costo pres.: $
																		{calc.costPerPresentation?.toLocaleString() ??
																			'—'}
																	</div>
																	<div>
																		Precio lista: $
																		{calc.listPrice?.toLocaleString() ?? '—'}
																	</div>
																	<div>
																		Precio venta: $
																		{pres.salePrice?.toLocaleString() ??
																			'Sin datos'}
																	</div>
																	<div
																		style={{
																			marginTop: '5px',
																			fontSize: '0.9em',
																			color:
																				calc.priceDifference !== null &&
																				calc.priceDifference < 0
																					? '#d32f2f'
																					: calc.priceDifference !== null &&
																						  calc.priceDifference > 0
																						? '#388e3c'
																						: '#666',
																		}}
																	>
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
