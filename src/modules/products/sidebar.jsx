import { Link } from 'react-router-dom'
import { CategoriesSidebar } from '../../modules/categorias/categories-button-group'
import { ProductStats } from '../../modules/products/product-stats'

export const Sidebar = ({
	categories,
	filteredProducts,
	products,
	selectedCategoryIds,
	onSelectCategories,
}) => {
	return (
		<>
			<div className='products-sidebar'>
				<ProductStats
					categories={categories}
					filteredProducts={filteredProducts}
					products={products}
				/>
				<Link to='/products/new' className='sidebar__btn' style={{ display: 'block', marginBottom: 10 }}>
					+Nuevo producto
				</Link>
				<CategoriesSidebar
					selected={selectedCategoryIds}
					onEvent={onSelectCategories}
					categories={categories}
				/>
			</div>
		</>
	)
}
