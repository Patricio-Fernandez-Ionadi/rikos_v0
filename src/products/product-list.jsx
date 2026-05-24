/**
 * Displays a list of products filtered by the selected category.
 * Clicking a product triggers the onEvent callback with the product ID.
 *
 * @param {Object}        props
 * @param {Object|null}   props.selectedCat       Selected category object (falsy means "all")
 * @param {Function}      props.onEvent           Callback when a product is clicked (receives product ID)
 * @param {Array}         props.filteredProducts  Products to display
 * @param {string|null}   props.selectedProd      Currently selected product ID
 * @param {Array}         props.presentations     All presentations (used to compute per-product counts)
 */
export const ProductList = ({
	selectedCat,
	onEvent,
	filteredProducts,
	selectedProd,
	presentations,
}) => {
	return (
		<>
			{!selectedCat ? (
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
										(selectedProd === product._id
											? ' product-list__item--selected'
											: '')
									}
									onClick={() => onEvent(product._id)}
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
												{presCount.filter((p) => p.salePrice !== null).length} con
												precio
											</>
										) : (
											'Sin presentaciones'
										)}
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
