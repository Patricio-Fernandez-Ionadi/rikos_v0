import { SearchInput } from '../../../components/search-input.jsx'
import { CategorySelect } from '../../../components/category-select.jsx'

export const ProductBrowser = ({
	searchRef,
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
}) => {
	const handleToggleTag = (tag) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
		)
	}

	return (
		<div className='sale-cart__products'>
			<div className='sale-cart__filters'>
				<SearchInput
					ref={searchRef}
					placeholder='Buscar producto…'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<CategorySelect
					categories={categories}
					value={selectedCategory}
					onChange={(value) => {
						setSelectedCategory(value)
						setSelectedProductId(null)
					}}
				/>
				{tags.length > 0 && (
					<div className='sale-cart__tag-filters'>
						{tags.map((tag) => {
							const active = selectedTags.includes(tag)
							return (
								<button
									key={tag}
									className={`cat-sidebar__btn${active ? ' cat-sidebar__btn--active' : ''}`}
									onClick={() => handleToggleTag(tag)}
								>
									{tag}
								</button>
							)
						})}
					</div>
				)}
			</div>

			<div className='sale-cart__product-list'>
				{filteredProducts.map((product) => (
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
									<span className='sale-cart__pres-label'>{pres.label}</span>
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
		</div>
	)
}
