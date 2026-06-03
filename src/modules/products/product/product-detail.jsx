import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductDetail } from './product-detail-manager.js'
import { useTasksManager } from '../../tasks/tasks-manager.js'
import { useCatalog } from '../../../app/catalog-context.jsx'
import { TaskAssigner } from '../../tasks/task-assigner.jsx'
import { Modal } from '../../../components/Modal.jsx'
import { Button } from '../../../components/button.jsx'
import { ProductForm } from './product-form.jsx'
import { ProductInfo } from './product-info.jsx'
import { PresentationCard } from './presentation-card.jsx'
import { SuppliersSection } from './suppliers-section.jsx'
import { PresentationForm } from './presentation-form.jsx'
import { filterProductIds } from '../../../data/filter-products.js'

export const ProductDetail = ({ productId, filterState = null }) => {
	const navigate = useNavigate()
	const { products, presentations, categories } = useCatalog()
	const {
		product, productPres, category, isFraction, totalStock,
		productSuppliers, assignedSupplierIds, activeSupplier,
		activeSupplierName, minSalePrice,
		suppliers, shift, calculate,
		editProductOpen, setEditProductOpen,
		presFormOpen, setPresFormOpen,
		editingPres, setEditingPres,
		salePresId, setSalePresId,
		stockGramsEdit, setStockGramsEdit,
		stockGramsValue, setStockGramsValue,
		handleEditProduct, handleDeleteProduct,
		handleCreatePres, handleEditPres, handleDeletePres,
		handleStockGramsSave,
		handleSale,
		handleAddSupplier, handleRemoveSupplier, handleUseSupplierCost,
	} = useProductDetail(productId)

	const { getProductTaskCategories, toggleProductTask } = useTasksManager()

	// ── Editable filters ────────────────────────────
	const [filterOpen, setFilterOpen] = useState(false)
	const [localSearch, setLocalSearch] = useState(filterState?.searchTerm ?? '')
	const [localCategories, setLocalCategories] = useState(filterState?.selectedCategoryIds ?? [])

	// Keep in sync when navigating to a product from a different filter state
	const prevFilterKey = useRef(null)
	const filterKey = JSON.stringify({ s: filterState?.searchTerm, c: filterState?.selectedCategoryIds })
	useEffect(() => {
		if (filterKey !== prevFilterKey.current) {
			prevFilterKey.current = filterKey
			setLocalSearch(filterState?.searchTerm ?? '')
			setLocalCategories(filterState?.selectedCategoryIds ?? [])
		}
	}, [filterKey, filterState])

	// ── Local filtered list ─────────────────────────
	const filteredIds = useMemo(() => {
		return filterProductIds(products, presentations, {
			searchTerm: localSearch,
			categoryIds: localCategories,
		})
	}, [products, presentations, localSearch, localCategories])

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
			},
		})
	}

	const handleToggleCategory = (catId) => {
		setLocalCategories((prev) =>
			prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId],
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
			<div className='detail-page__header'>
				<button className='back-btn' onClick={() => navigate('/products')}>
					<span className='material-icons'>arrow_back</span> Volver
				</button>
				{navInfo && (
					<div className='detail-page__nav'>
						<div className='detail-page__nav-pagination'>
							<Button size='sm' disabled={!navInfo.prevId} onClick={() => handlePrevNext(navInfo.prevId)}>
								<span className='material-icons'>chevron_left</span>
							</Button>
							<span className='detail-page__nav-index'>
								{navInfo.index + 1}/{navInfo.total}
							</span>
							<Button size='sm' disabled={!navInfo.nextId} onClick={() => handlePrevNext(navInfo.nextId)}>
								<span className='material-icons'>chevron_right</span>
							</Button>
						</div>
						<Button size='sm' variant={filterOpen ? 'primary' : ''} active={filterOpen} onClick={() => setFilterOpen(!filterOpen)} title='Filtrar'>
							<span className='material-icons'>search</span>
							Filtrar
						</Button>
					</div>
				)}
			</div>

			{/* ── Compact filter bar ──────────────────── */}
			{filterOpen && (
				<div className='detail-page__filter-bar'>
					<input
						className='field-input'
						type='text'
						placeholder='Buscar producto, marca o presentación…'
						value={localSearch}
						onChange={(e) => setLocalSearch(e.target.value)}
						style={{ width: '100%', marginBottom: 8 }}
						autoFocus
					/>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
						{categories.map((cat) => {
							const active = localCategories.includes(cat._id)
							return (
								<Button key={cat._id} size='xs' active={active} onClick={() => handleToggleCategory(cat._id)}>
									{cat.name}
								</Button>
							)
						})}
					</div>
				</div>
			)}

			<div className='detail-page__title-row'>
				<h2 className='detail-page__title'>{product.name}</h2>
				<Button size='xs' onClick={() => setEditProductOpen(true)} title='Editar producto'>
					<span className='material-icons'>edit</span>
				</Button>
			</div>
			<div className='detail-page__id'>ID: {product._id}</div>

			<ProductInfo
				product={product} category={category} isFraction={isFraction}
				totalStock={totalStock}
				productPres={productPres}
				minSalePrice={minSalePrice} activeSupplierName={activeSupplierName}
				stockGramsEdit={stockGramsEdit} stockGramsValue={stockGramsValue}
				setStockGramsEdit={setStockGramsEdit} setStockGramsValue={setStockGramsValue}
				handleStockGramsSave={handleStockGramsSave}
			/>

			{/* ── Presentations ─────────────────────────────── */}
			<div className='detail-page__section'>
				<div className='detail-page__section-header'>
					<h3>Presentaciones</h3>
					<Button size='sm' onClick={() => setPresFormOpen(true)}>+ Nueva</Button>
				</div>

				{productPres.length === 0 ? (
					<p className='placeholder text-muted'>Sin presentaciones</p>
				) : (
					<div className='detail-page__pres-grid'>
						{productPres.map((pres) => (
							<PresentationCard key={pres._id}
								pres={pres} product={product}
								shift={shift} calculate={calculate}
								salePresId={salePresId} setSalePresId={setSalePresId}
								handleSale={handleSale}
								onEdit={setEditingPres} onDelete={handleDeletePres}
							/>
						))}
					</div>
				)}
			</div>

			<SuppliersSection
				productSuppliers={productSuppliers} suppliers={suppliers}
				assignedSupplierIds={assignedSupplierIds} activeSupplier={activeSupplier}
				product={product}
				handleUseSupplierCost={handleUseSupplierCost}
				handleRemoveSupplier={handleRemoveSupplier}
				handleAddSupplier={handleAddSupplier}
			/>

			{/* ── Tasks ────────────────────────────────────── */}
			<div className='detail-page__section'>
				<div className='detail-page__section-header'>
					<h3>Tareas</h3>
				</div>
				<TaskAssigner
					productId={product._id}
					getProductTaskCategories={getProductTaskCategories}
					toggleProductTask={toggleProductTask}
				/>
			</div>

			{/* ── Admin actions ──────────────────────────────── */}
			<div className='detail-page__admin'>
				<button
					className='detail-page__admin-btn detail-page__admin-btn--danger'
					onClick={handleDeleteProduct}
				>
					Eliminar
				</button>
			</div>

			{/* ── Modals ────────────────────────────────────── */}
			<Modal open={editProductOpen} onClose={() => setEditProductOpen(false)} title='Editar producto'>
				<ProductForm initial={product} categories={categories} suppliers={suppliers}
					onSubmit={handleEditProduct} onCancel={() => setEditProductOpen(false)} />
			</Modal>

			<Modal open={presFormOpen} onClose={() => setPresFormOpen(false)} title='Nueva presentación'>
				<PresentationForm product={product} onSubmit={handleCreatePres} onCancel={() => setPresFormOpen(false)} />
			</Modal>

			<Modal open={!!editingPres} onClose={() => setEditingPres(null)} title='Editar presentación'>
				<PresentationForm initial={editingPres} product={product}
					onSubmit={handleEditPres} onCancel={() => setEditingPres(null)} />
			</Modal>
		</div>
	)
}
