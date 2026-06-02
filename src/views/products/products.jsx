import { useEffect, useRef } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useProductManager } from '../../modules/products/product-manager.js'
import { useTasksManager } from '../../modules/tasks/tasks-manager.js'
import { ProductList } from '../../modules/products/product-list.jsx'
import { Modal } from '../../components/Modal.jsx'
import { ProductForm } from '../../modules/products/product/product-form.jsx'
import { Sidebar } from '../../modules/products/sidebar.jsx'

export const ProductsPage = () => {
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const {
		categories,
		suppliers,
		products,
		presentations,
		filteredProducts,
		searchTerm,
		handleSearch,
		selectedCategoryIds,
		handleSelectCategories,
		editingProduct,
		closeEditProduct,
		editProduct,
	} = useProductManager()

	const { getProductTaskCategories, toggleProductTask } = useTasksManager()

	// Restore state from URL on mount
	const restored = useRef(false)
	useEffect(() => {
		if (restored.current) return
		restored.current = true
		const q = searchParams.get('q')
		if (q) handleSearch(q)
		const c = searchParams.get('c')
		if (c) handleSelectCategories(c.split(','))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Sync search term to URL
	const syncTimer = useRef(null)
	useEffect(() => {
		clearTimeout(syncTimer.current)
		syncTimer.current = setTimeout(() => {
			const params = {}
			if (searchTerm) params.q = searchTerm
			if (selectedCategoryIds.length > 0) params.c = selectedCategoryIds.join(',')
			setSearchParams(params, { replace: true })
		}, 200)
		return () => clearTimeout(syncTimer.current)
	}, [searchTerm, selectedCategoryIds, setSearchParams])

	return (
		<div className='product-browser'>
			<div className='product-browser__header'>
				<h2 className='product-browser__title'>Productos</h2>
				<input
					className='field-input'
					type='text'
					placeholder='Buscar producto, marca o presentación…'
					value={searchTerm}
					onChange={(e) => handleSearch(e.target.value)}
					style={{ flex: 1 }}
				/>
			</div>

			<div className='product-browser__layout'>
				<Sidebar
					categories={categories}
					filteredProducts={filteredProducts}
					products={products}
					selectedCategoryIds={selectedCategoryIds}
					onSelectCategories={handleSelectCategories}
				/>

				<div className='product-browser__main'>
					<ProductList
						onEvent={(id) => navigate(`/products/${id}`, { state: { productList: filteredProducts.map((p) => p._id), searchTerm, selectedCategoryIds } })}
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
