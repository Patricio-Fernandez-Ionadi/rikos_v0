/**
 * Displays a list of products filtered by the selected category.
 * Shows product name, and conditionally displays:
 * - Sale price if only one presentation exists
 * - Number of presentations if multiple exist
 * - Total available stock across all presentations
 *
 * Clicking a product triggers the onEvent callback with the product ID.
 *
 * @param {Object}        props
 * @param {Function}      props.onEvent           Callback when a product is clicked (receives product ID)
 * @param {Array}         props.filteredProducts  Products to display
 * @param {string|null}   props.selectedProd      Currently selected product ID
 * @param {Array}         props.presentations     All presentations (used to compute per-product counts)
 */
export const ProductList = ({
	onEvent,
	filteredProducts,
	selectedProd,
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
							const totalStock = productPresentations.reduce(
								(sum, p) => sum + (p.stock ?? 0),
								0
							)
							const hasSinglePresentation = productPresentations.length === 1
							const singlePres = hasSinglePresentation ? productPresentations[0] : null

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
									<div className="product-list__item-left">
										<div className="product-list__item-name">{product.name}</div>
									</div>
									<div className="product-list__item-right">
										<div className="product-list__item-meta">
											{productPresentations.length > 0 ? (
												<>
													{hasSinglePresentation ? (
														<div className="product-list__item-price">
															${singlePres.salePrice?.toLocaleString() ?? 'Sin precio'}
														</div>
													) : (
														<div className="product-list__item-presentations">
															{productPresentations.length} presentaciones
														</div>
													)}
													<div className="product-list__item-stock">
														Stock: <strong>{totalStock}</strong>
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
