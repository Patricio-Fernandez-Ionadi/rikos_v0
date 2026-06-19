import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductDetail } from './product-detail-manager.js'
import { useTasksManager } from '../../tasks/tasks-manager.js'
import { useCatalog } from '../../../app/catalog-context.jsx'
import { ProductDetailNav } from './product-detail-nav/product-detail-nav.jsx'
import { ProductDetailBody } from './product-detail-body/product-detail-body.jsx'
import { ProductDetailModals } from './product-detail-modals/product-detail-modals.jsx'
import { QuickOrderModal } from './quick-order-modal.jsx'

export const ProductDetail = ({ productId, productList }) => {
	const navigate = useNavigate()
	const { products, presentations, categories } = useCatalog()
	const {
		product,
		productPres,
		category,
		isFraction,
		totalStock,
		productSuppliers,
		assignedSupplierIds,
		activeSupplier,
		activeSupplierName,
		minSalePrice,
		suppliers,
		shift,
		calculate,
		editProductOpen,
		setEditProductOpen,
		presFormOpen,
		setPresFormOpen,
		editingPres,
		setEditingPres,
		salePresId,
		setSalePresId,
		stockGramsEdit,
		setStockGramsEdit,
		stockGramsValue,
		setStockGramsValue,
		handleEditProduct,
		handleDeleteProduct,
		handleCreatePres,
		handleEditPres,
		handleDeletePres,
		handleRenumberPres,
		hasMissingCodes,
		handleStockGramsSave,
		handleSale,
		handleAddSupplier,
		handleRemoveSupplier,
		handleUseSupplierCost,
		quickOrder, quickOrderOpen, setQuickOrderOpen,
	} = useProductDetail(productId)

	const { getProductTaskCategories, toggleProductTask } = useTasksManager()

	// ── Search for other products ────────────────────
	const [search, setSearch] = useState('')

	const searchResults = useMemo(() => {
		if (!search.trim()) return []
		const q = search.toLowerCase()
		return products
			.filter((p) => p.name.toLowerCase().includes(q) && p._id !== product?._id)
			.slice(0, 12)
	}, [products, search, product])

	const handleSelectResult = (targetId) => {
		setSearch('')
		navigate(`/products/${targetId}`)
	}

	// ── Navigation through product list ──────────────
	const navInfo = useMemo(() => {
		if (!product || !productList?.length) return null
		const idx = productList.indexOf(productId)
		if (idx === -1) return null
		return {
			index: idx,
			total: productList.length,
			prevId: idx > 0 ? productList[idx - 1] : null,
			nextId: idx < productList.length - 1 ? productList[idx + 1] : null,
		}
	}, [productList, product, productId])

	const handlePrevNext = (targetId) => {
		navigate(`/products/${targetId}`, {
			replace: true,
			state: { productList },
		})
	}

	if (!product) {
		return (
			<div className='stock-page'>
				<p className='placeholder'>Producto no encontrado</p>
			</div>
		)
	}

	return (
		<div className='detail-page'>
			<ProductDetailNav
				navInfo={navInfo}
				onNavigate={handlePrevNext}
				onBack={() => navigate(-1)}
				search={search}
				onSearchChange={setSearch}
				searchResults={searchResults}
				onSelectResult={handleSelectResult}
			/>

			<ProductDetailBody
				product={product}
				productPres={productPres}
				category={category}
				isFraction={isFraction}
				totalStock={totalStock}
				minSalePrice={minSalePrice}
				activeSupplierName={activeSupplierName}
				stockGramsEdit={stockGramsEdit}
				stockGramsValue={stockGramsValue}
				setStockGramsEdit={setStockGramsEdit}
				setStockGramsValue={setStockGramsValue}
				handleStockGramsSave={handleStockGramsSave}
				shift={shift}
				calculate={calculate}
				salePresId={salePresId}
				setSalePresId={setSalePresId}
				handleSale={handleSale}
				setEditingPres={setEditingPres}
				handleDeletePres={handleDeletePres}
				handleRenumberPres={handleRenumberPres}
				hasMissingCodes={hasMissingCodes}
				suppliers={suppliers}
				productSuppliers={productSuppliers}
				assignedSupplierIds={assignedSupplierIds}
				activeSupplier={activeSupplier}
				handleUseSupplierCost={handleUseSupplierCost}
				handleRemoveSupplier={handleRemoveSupplier}
				handleAddSupplier={handleAddSupplier}
				getProductTaskCategories={getProductTaskCategories}
				toggleProductTask={toggleProductTask}
				setEditProductOpen={setEditProductOpen}
				handleDeleteProduct={handleDeleteProduct}
				setPresFormOpen={setPresFormOpen}
				onQuickOrder={() => setQuickOrderOpen(true)}
			/>

			<QuickOrderModal
				open={quickOrderOpen}
				onClose={() => setQuickOrderOpen(false)}
				product={product}
				productSuppliers={productSuppliers}
				suppliers={suppliers}
				presentations={presentations}
				onConfirm={quickOrder}
			/>

			<ProductDetailModals
				editProductOpen={editProductOpen}
				onCloseEditProduct={() => setEditProductOpen(false)}
				product={product}
				categories={categories}
				suppliers={suppliers}
				handleEditProduct={handleEditProduct}
				presFormOpen={presFormOpen}
				onClosePresForm={() => setPresFormOpen(false)}
				handleCreatePres={handleCreatePres}
				editingPres={editingPres}
				onCloseEditingPres={() => setEditingPres(null)}
				handleEditPres={handleEditPres}
			/>
		</div>
	)
}
