import { CategoriesSidebar } from '../../modules/categorias/categories-button-group'
import { useProductManager } from '../../modules/products/product-manager'
import { SearchProduct } from '../../modules/products/product-search-input'
import { ProductStats } from '../../modules/products/product-stats'

export const Sidebar = () => {
	const {
		categories,
		filteredProducts,
		products,
		searchTerm,
		handleSearch,
		selectedCategoryIds,
		handleSelectCategories,
	} = useProductManager()

	return (
		<>
			<div className='products-sidebar'>
				<ProductStats
					categories={categories}
					filteredProducts={filteredProducts}
					products={products}
				/>
				<SearchProduct changeEvent={handleSearch} value={searchTerm} />
				<CategoriesSidebar
					selected={selectedCategoryIds}
					onEvent={handleSelectCategories}
					categories={categories}
				/>
			</div>
		</>
	)
}
