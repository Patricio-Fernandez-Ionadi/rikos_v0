import { ProductSearch } from '../../../components/product-search.jsx'
import { useCatalog } from '../../../app/catalog-context.jsx'

export const ProductBrowser = ({
	searchQuery,
	setSearchQuery,
	selectedCategory,
	setSelectedCategory,
	selectedTags,
	setSelectedTags,
	categories,
	tags,
	filteredProducts,
	selectedProductId,
	setSelectedProductId,
	selectedProduct,
	productPres,
	selectedPresId,
	setSelectedPresId,
	isFraction,
	quantity,
	setQuantity,
	handleAddToCart,
	presInPromos,
}) => {
	const { products, presentations, suppliers, productSuppliers } = useCatalog()

	const filterState = {
		searchTerm: searchQuery,
		selectedCategoryIds: selectedCategory ? [selectedCategory] : [],
		selectedTags,
	}

	const handleFilterChange = (next) => {
		setSearchQuery(next.searchTerm ?? '')
		setSelectedCategory(next.selectedCategoryIds?.[0] ?? '')
		setSelectedTags(next.selectedTags ?? [])
		setSelectedProductId(null)
	}

	return (
		<div className='sale-cart__products'>
			<ProductSearch
				products={products}
				presentations={presentations}
				categories={categories}
				allTags={tags}
				suppliers={suppliers}
				productSuppliers={productSuppliers}
				compact
				placeholder='Buscar por nombre o código…'
				autoFocus
				showTags
				categoryMode='multi'
				filterState={filterState}
				onFilterStateChange={handleFilterChange}
			>
				{({ filteredProducts: psProducts }) => {
					const list = filteredProducts ?? psProducts
					return (
						<>
							<div className='sale-cart__product-list'>
								{list.map((product) => (
									<div
										key={product._id}
										className={`sale-cart__product-item${selectedProductId === product._id ? ' sale-cart__product-item--active' : ''}`}
										onClick={() => {
											setSelectedProductId(product._id)
											setSelectedPresId(null)
											setQuantity(1)
										}}
									>
										<div className='sale-cart__product-name'>{product.name}</div>
										{product.marca && (
											<div className='sale-cart__product-marca'>{product.marca}</div>
										)}
									</div>
								))}
							</div>

							{selectedProduct && (
								<div className='sale-cart__pres-section'>
									<h4 className='sale-cart__pres-heading'>Presentaciones</h4>
									<div className='sale-cart__pres-list'>
										{productPres.map((pres) => (
											<div
												key={pres._id}
												className={`sale-cart__pres-item${selectedPresId === pres._id ? ' sale-cart__pres-item--active' : ''}`}
												onClick={() => {
													setSelectedPresId(pres._id)
													setQuantity(1)
												}}
											>
												<div className='sale-cart__pres-info'>
													<span className='sale-cart__pres-label'>
														{pres.code != null && <span className='sale-cart__pres-code'>{pres.code}</span>}
														{pres.label}
														{presInPromos?.has(pres._id) && <span className='sale-cart__promo-badge'>PROMO</span>}
													</span>
													<span className='sale-cart__pres-price'>
														${pres.salePrice?.toLocaleString() ?? '—'}
													</span>
												</div>
												<span className='sale-cart__pres-stock'>
													Stock:{' '}
													{isFraction
														? `${selectedProduct.stockGrams ?? 0}g`
														: pres.stock ?? 0}
												</span>
											</div>
										))}
									</div>

									{selectedPresId && selectedProduct && (() => {
										const pres = productPres.find((p) => p._id === selectedPresId)
										if (!pres) return null
										return (
											<div className='sale-cart__add-row'>
												<label className='field-label'>Cantidad</label>
												<div className='sale-cart__add-controls'>
													<input
														className='field-input field-input--sm'
														type='number'
														min='1'
														value={quantity}
														onChange={(e) => {
															const v = e.target.value
															setQuantity(v === '' ? '' : Math.max(1, parseInt(v) || 1))
														}}
														onBlur={() => {
															if (quantity === '' || quantity < 1) setQuantity(1)
														}}
													/>
													{isFraction && pres.grams && (
														<span className='sale-cart__grams-hint'>
															= {quantity * pres.grams}g
														</span>
													)}
													<button
														className='btn btn--primary'
														onClick={handleAddToCart}
													>
														Agregar
													</button>
												</div>
											</div>
										)
									})()}
								</div>
							)}
						</>
					)
				}}
			</ProductSearch>
		</div>
	)
}
