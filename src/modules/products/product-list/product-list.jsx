import { ProductListItem } from '../product-list-item/product-list-item.jsx'

export const ProductList = ({ onEvent, filteredProducts }) => {
	if (filteredProducts.length === 0) return <EmptyCases />

	return (
		<>
			<div className='product-list'>
				{filteredProducts.map((product) => {
					return (
						<ProductListItem
							key={product._id}
							product={product}
							onEvent={onEvent}
						/>
					)
				})}
			</div>
		</>
	)
}

const EmptyCases = () => {
	return (
		<div className='placeholder'>
			<h3>No hay productos</h3>
		</div>
	)
}
