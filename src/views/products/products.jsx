import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCatalog } from '../../app/catalog-context.jsx'
import { useProductManager } from '../../modules/products/product-manager.js'
import { useTasksManager } from '../../modules/tasks/tasks-manager.js'
import { ProductSearch } from '../../components/product-search.jsx'
import { ProductList } from '../../modules/products/product-list/product-list.jsx'
import { Modal } from '../../components/Modal.jsx'
import { ProductForm } from '../../modules/products/product/product-form.jsx'
import { Sidebar } from '../../modules/products/sidebar/sidebar.jsx'
import { filterProducts } from '../../data/filter-products.js'

export const ProductsPage = () => {
	const navigate = useNavigate()
	const {
		categories,
		suppliers,
		products,
		presentations,
		tags,
		editingProduct,
		closeEditProduct,
		editProduct,
	} = useProductManager()
	const { productSuppliers: allProductSuppliers } = useCatalog()

	const { getProductTaskCategories, toggleProductTask } = useTasksManager()

	const [filterState, setFilterState] = useState({
		searchTerm: '',
		selectedCategoryIds: [],
		selectedTags: [],
	})

	const filteredProducts = useMemo(
		() =>
			filterProducts(products, presentations, {
				searchTerm: filterState.searchTerm,
				categoryIds: filterState.selectedCategoryIds,
				tags: filterState.selectedTags,
				suppliers,
				productSuppliers: allProductSuppliers,
			}),
		[
			products,
			presentations,
			suppliers,
			allProductSuppliers,
			filterState.searchTerm,
			filterState.selectedCategoryIds,
			filterState.selectedTags,
		],
	)

	return (
		<div className='product-browser'>
			<div className='product-browser__header'>
				<h2 className='product-browser__title'>Productos</h2>
			</div>

			<ProductSearch
				products={products}
				presentations={presentations}
				categories={categories}
				allTags={tags}
				suppliers={suppliers}
				productSuppliers={allProductSuppliers}
				compact
				filterState={filterState}
				onFilterStateChange={setFilterState}
				placeholder='Buscar producto, marca o presentación…'
			/>

			<div className='product-browser__layout'>
				<Sidebar
					categories={categories}
					filteredProducts={filteredProducts}
					products={products}
				/>

				<div className='product-browser__main'>
					<ProductList
						onEvent={(id) =>
							navigate(`/products/${id}`, {
								state: { productList: filteredProducts.map((p) => p._id) },
							})
						}
						filteredProducts={filteredProducts}
						presentations={presentations}
						getProductTaskCategories={getProductTaskCategories}
						toggleProductTask={toggleProductTask}
					/>
				</div>
			</div>

			<Modal
				open={!!editingProduct}
				onClose={() => closeEditProduct()}
				title='Editar producto'
			>
				<ProductForm
					initial={editingProduct}
					categories={categories}
					suppliers={suppliers}
					onSubmit={editProduct}
					onCancel={() => closeEditProduct()}
				/>
			</Modal>
		</div>
	)
}
