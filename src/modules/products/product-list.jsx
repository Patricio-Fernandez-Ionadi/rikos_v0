export const ProductList = ({
	onEvent,
	filteredProducts,
	presentations,
}) => {
	return (
		<>
			{filteredProducts.length === 0 ? (
				<div className="placeholder">
					<h3>No hay productos</h3>
				</div>
			) : (
				<>
					<h3>Productos</h3>
					<div className="product-list">
						{filteredProducts.map((product) => {
							const productPresentations = presentations.filter(
								(p) => p.productId === product._id
							)
							const isFraction = product.saleType === 'fraction'
							const totalStock = isFraction
								? (product.stockGrams ?? 0)
								: productPresentations.reduce((sum, p) => sum + (p.stock ?? 0), 0)
							const stockLabel = isFraction ? `${totalStock}g` : totalStock

							return (
								<div
									key={product._id}
									className="product-list__item"
									onClick={() => onEvent(product._id)}
								>
									<div className="product-list__item-left">
										<div className="product-list__item-name">{product.name}</div>
										<div className="product-list__item-type">
											{isFraction ? 'Fraccionable' : 'Unidad'}
										</div>
									</div>
									<div className="product-list__item-right">
										<div className="product-list__item-meta">
											{productPresentations.length > 0 ? (
												<>
													<div className="product-list__item-prices">
														{productPresentations.map((pres, i) => (
															<span key={pres._id}>
																{i > 0 && <span className="product-list__item-prices-sep">, </span>}
																<span className="product-list__item-price-label">{pres.label}</span>
																<span className="product-list__item-price-value">
																	${pres.salePrice?.toLocaleString() ?? '—'}
																</span>
															</span>
														))}
													</div>
													<div className="product-list__item-stock">
														Stock: <strong>{stockLabel}</strong>
													</div>
												</>
											) : (
												<div className="product-list__item-error">
													Sin presentaciones
												</div>
											)}
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</>
			)}
		</>
	)
}
