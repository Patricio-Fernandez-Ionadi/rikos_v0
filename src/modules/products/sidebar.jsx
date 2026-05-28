import { CategoriesSidebar } from '../../modules/categorias/categories-button-group'
import { SearchProduct } from '../../modules/products/product-search-input'
import { ProductStats } from '../../modules/products/product-stats'

export const Sidebar = ({
	categories,
	filteredProducts,
	products,
	searchTerm,
	onSearch,
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
				<SearchProduct changeEvent={onSearch} value={searchTerm} />
				<CategoriesSidebar
					selected={selectedCategoryIds}
					onEvent={onSelectCategories}
					categories={categories}
				/>
			</div>
		</>
	)
}
