import { useProductDetail } from './product-detail-manager.js'
import { useTasksManager } from '../../tasks/tasks-manager.js'
import { TaskAssigner } from '../../tasks/task-assigner.jsx'
import { Modal } from '../../../components/Modal.jsx'
import { ProductForm } from './product-form.jsx'
import { ProductInfo } from './product-info.jsx'
import { PresentationCard } from './presentation-card.jsx'
import { SuppliersSection } from './suppliers-section.jsx'
import { PresentationForm } from './presentation-form.jsx'

export const ProductDetail = ({ productId }) => {
	const {
		product, productPres, categories, category, isFraction, totalStock,
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

	if (!product) {
		return (
			<div className='stock-page'>
				<p className='placeholder'>Producto no encontrado</p>
			</div>
		)
	}

	return (
		<div className='detail-page'>
			<ProductInfo
				product={product} category={category} isFraction={isFraction}
				totalStock={totalStock}
				minSalePrice={minSalePrice} activeSupplierName={activeSupplierName}
				stockGramsEdit={stockGramsEdit} stockGramsValue={stockGramsValue}
				setStockGramsEdit={setStockGramsEdit} setStockGramsValue={setStockGramsValue}
				handleStockGramsSave={handleStockGramsSave}
				onEdit={() => setEditProductOpen(true)} onDelete={handleDeleteProduct}
			/>

			{/* ── Presentations ─────────────────────────────── */}
			<div className='detail-page__section'>
				<div className='detail-page__section-header'>
					<h3>Presentaciones</h3>
					<button className='sidebar__btn' onClick={() => setPresFormOpen(true)}>
						+ Nueva
					</button>
				</div>

				{productPres.length === 0 ? (
					<p className='placeholder' style={{ color: '#616161' }}>Sin presentaciones</p>
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
