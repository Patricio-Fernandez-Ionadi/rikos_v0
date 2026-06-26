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
		handleEtiquetasChange,
		handleSale,
		handleAddSupplier,
		handleRemoveSupplier,
		handleUseSupplierCost,
		quickOrder, quickOrderOpen, setQuickOrderOpen,
	} = useProductDetail(productId)

	const { getProductTaskCategories, toggleProductTask } = useTasksManager()

	// ── Filter by search ────────────────────────────
	const [search, setSearch] = useState('')

	const baseIds = useMemo(
		() => productList ?? products.map((p) => p._id),
		[productList, products],
	)

	const filteredIds = useMemo(() => {
		if (!search.trim()) return baseIds
		const q = search.toLowerCase()
		return baseIds.filter((id) => {
			const p = products.find((x) => x._id === id)
			return p && p.name.toLowerCase().includes(q)
		})
	}, [baseIds, search, products])

	// ── Dropdown results (exclude current) ──────────
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

	// ── Navigation through filtered list ────────────
	const navInfo = useMemo(() => {
		if (!product || !filteredIds.length) return null
		const idx = filteredIds.indexOf(productId)
		if (idx === -1) return null
		return {
			index: idx,
			total: filteredIds.length,
			prevId: idx > 0 ? filteredIds[idx - 1] : null,
			nextId: idx < filteredIds.length - 1 ? filteredIds[idx + 1] : null,
		}
	}, [filteredIds, product, productId])

	const handlePrevNext = (targetId) => {
		navigate(`/products/${targetId}`, {
			replace: true,
			state: { productList: filteredIds },
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
				productList={filteredIds}
				products={products}
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
				handleEtiquetasChange={handleEtiquetasChange}
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