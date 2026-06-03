import { Link } from 'react-router-dom'
import { CategoriesSidebar } from '../../modules/categorias/categories-button-group'
import { ProductStats } from '../../modules/products/product-stats'
import { Button } from '../../components/button.jsx'

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
				<Link to='/products/new' style={{ textDecoration: 'none' }}>
					<Button block style={{ marginBottom: 10 }}>+Nuevo producto</Button>
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
