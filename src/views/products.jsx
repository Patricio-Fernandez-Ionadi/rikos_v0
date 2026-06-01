import { useNavigate, Link } from 'react-router-dom'
import { useProductManager } from '../modules/products/product-manager.js'
import { useTasksManager } from '../modules/tasks/tasks-manager.js'
import { ProductList } from '../modules/products/product-list.jsx'
import { Modal } from '../components/Modal.jsx'
import { ProductForm } from '../modules/products/product/product-form.jsx'
import { Sidebar } from '../modules/products/sidebar.jsx'

export const ProductsPage = () => {
	const navigate = useNavigate()
	const {
		categories, suppliers,
		products, presentations,
		filteredProducts,
		searchTerm, handleSearch,
		selectedCategoryIds, handleSelectCategories,
		editingProduct,
		closeEditProduct,
		editProduct,
	} = useProductManager()

	const { getProductTaskCategories, toggleProductTask } = useTasksManager()

	return (
		<div className='product-browser'>
			<div className='product-browser__header'>
				<h2 className='product-browser__title'>Productos</h2>
				<Link to='/products/new' className='sidebar__btn'>
					+Nuevo
				</Link>
			</div>

			<div className='product-browser__layout'>
				<Sidebar
					categories={categories}
					filteredProducts={filteredProducts}
					products={products}
					searchTerm={searchTerm}
					onSearch={handleSearch}
					selectedCategoryIds={selectedCategoryIds}
					onSelectCategories={handleSelectCategories}
				/>

				<div className='product-browser__main'>
					<ProductList
						onEvent={(id) => navigate(`/products/${id}`)}
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
					categories={categories} suppliers={suppliers}
					onSubmit={editProduct}
					onCancel={() => closeEditProduct()}
				/>
			</Modal>
		</div>
	)
}
