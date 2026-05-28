import { useNavigate } from 'react-router-dom'
import { useProductManager } from '../modules/products/product-manager.js'
import { ProductList } from '../modules/products/product-list.jsx'
import { Modal } from '../components/Modal.jsx'
import { ProductForm } from '../modules/products/product/product-form.jsx'
import { NewProductButton } from '../modules/products/new-product-button.jsx'
import { Sidebar } from '../modules/products/sidebar.jsx'

export const ProductsPage = () => {
	const navigate = useNavigate()
	const {
		categories, suppliers,
		products, presentations,
		filteredProducts,
		searchTerm, handleSearch,
		selectedCategoryIds, handleSelectCategories,
		showProductForm, editingProduct,
		openProductForm, closeProductForm, closeEditProduct,
		createProduct, editProduct,
	} = useProductManager()

	return (
		<div className='product-browser'>
			<div className='product-browser__header'>
				<h2 className='product-browser__title'>Productos</h2>
				<NewProductButton
					className='sidebar__btn'
					onEvent={() => openProductForm()}
				/>
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
					/>
				</div>
			</div>

			<Modal
				open={showProductForm}
				onClose={() => closeProductForm()}
				title='Nuevo producto'
			>
				<ProductForm
					categories={categories} suppliers={suppliers}
					onSubmit={createProduct}
					onCancel={() => closeProductForm()}
				/>
			</Modal>

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
