import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductDetail } from './product-detail-manager.js'
import { useTasksManager } from '../../tasks/tasks-manager.js'
import { useCatalog } from '../../../app/catalog-context.jsx'
import { ProductDetailNav } from './product-detail-nav/product-detail-nav.jsx'
import { ProductDetailBody } from './product-detail-body/product-detail-body.jsx'
import { ProductDetailModals } from './product-detail-modals/product-detail-modals.jsx'
import { filterProductIds } from '../../../data/filter-products.js'

export const ProductDetail = ({ productId, filterState = null }) => {
	const navigate = useNavigate()
	const { products, presentations, categories, tags } = useCatalog()
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
		handleStockGramsSave,
		handleSale,
		handleAddSupplier,
		handleRemoveSupplier,
		handleUseSupplierCost,
	} = useProductDetail(productId)

	const { getProductTaskCategories, toggleProductTask } = useTasksManager()

	// ── Editable filters ────────────────────────────
	const [filterOpen, setFilterOpen] = useState(false)
	const [localSearch, setLocalSearch] = useState(filterState?.searchTerm ?? '')
	const [localCategories, setLocalCategories] = useState(
		filterState?.selectedCategoryIds ?? [],
	)
	const [localTags, setLocalTags] = useState(filterState?.selectedTags ?? [])

	// Keep in sync when navigating to a product from a different filter state
	const prevFilterKey = useRef(null)
	const filterKey = JSON.stringify({
		s: filterState?.searchTerm,
		c: filterState?.selectedCategoryIds,
		t: filterState?.selectedTags,
	})
	useEffect(() => {
		if (filterKey !== prevFilterKey.current) {
			prevFilterKey.current = filterKey
			setLocalSearch(filterState?.searchTerm ?? '')
			setLocalCategories(filterState?.selectedCategoryIds ?? [])
			setLocalTags(filterState?.selectedTags ?? [])
			window.scrollTo(0, 0)
		}
	}, [filterKey, filterState])

	// ── Local filtered list ─────────────────────────
	const filteredIds = useMemo(() => {
		return filterProductIds(products, presentations, {
			searchTerm: localSearch,
			categoryIds: localCategories,
			tags: localTags,
		})
	}, [products, presentations, localSearch, localCategories, localTags])

	const navInfo = useMemo(() => {
		if (!product) return null
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
			state: {
				productList: filteredIds,
				searchTerm: localSearch,
				selectedCategoryIds: localCategories,
				selectedTags: localTags,
			},
		})
	}

	const handleToggleCategory = (catId) => {
		setLocalCategories((prev) =>
			prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId],
		)
	}

	const handleToggleTag = (tag) => {
		setLocalTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
		)
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
				filterOpen={filterOpen}
				onToggleFilter={() => setFilterOpen(!filterOpen)}
				onNavigate={handlePrevNext}
				localSearch={localSearch}
				onSearchChange={setLocalSearch}
				products={products}
				filteredIds={filteredIds}
				categories={categories}
				localCategories={localCategories}
				onToggleCategory={handleToggleCategory}
				tags={tags}
				localTags={localTags}
				onToggleTag={handleToggleTag}
				onBack={() => navigate(-1)}
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
