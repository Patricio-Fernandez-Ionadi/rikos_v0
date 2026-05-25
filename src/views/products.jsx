import { useProductManager } from '../modules/products/product-manager.js'
import { calculate } from '../data/index.js'
import { ProductList } from '../modules/products/product-list.jsx'
import { PresentationsModal } from '../modules/products/presentations-modal.jsx'
import { Modal } from '../components/Modal.jsx'
import { ProductForm } from '../modules/products/product-form.jsx'
import { PresentationForm } from '../modules/products/presentation-form.jsx'
import { NewProductButton } from '../modules/products/new-product-button.jsx'
import { ProductDetail } from '../modules/products/product-detail.jsx'
import { Sidebar } from '../modules/products/sidebar.jsx'
import { PresentationCard } from '../modules/products/presentation-card.jsx'

export const ProductsPage = () => {
	const {
		categories,
		presentations,
		filteredProducts,
		selectedProduct,
		productPresentations,
		selectedProductId,
		showProductForm,
		editingProduct,
		showPresForm,
		editingPres,
		showPresentationsModal,
		handleSelectProduct,
		openProductForm,
		closeProductForm,
		openEditProduct,
		closeEditProduct,
		openPresForm,
		closePresForm,
		openEditPres,
		closeEditPres,
		openPresentationsModal,
		closePresentationsModal,
		createProduct,
		editProduct,
		deleteProduct,
		createPres,
		editPres,
		deletePres,
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
				<Sidebar />

				<div className='product-browser__main'>
					<ProductList
						onEvent={handleSelectProduct}
						filteredProducts={filteredProducts}
						selectedProd={selectedProductId}
						presentations={presentations}
					/>

					{selectedProduct && (
						<div className='detail'>
							<ProductDetail
								onSetEdit={openEditProduct}
								product={selectedProduct}
								onDelete={deleteProduct}
								showModal={openPresentationsModal}
								showForm={openPresForm}
							/>

							{productPresentations.length > 0 && (
								<div className='pres-list'>
									{productPresentations.map((pres) => (
										<PresentationCard key={pres._id} pres={pres} />
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			<Modal
				open={showProductForm}
				onClose={() => closeProductForm()}
				title='Nuevo producto'
			>
				<ProductForm
					categories={categories}
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
					categories={categories}
					onSubmit={editProduct}
					onCancel={() => closeEditProduct()}
				/>
			</Modal>

			<Modal
				open={showPresForm}
				onClose={() => closePresForm()}
				title='Nueva presentación'
			>
				<PresentationForm
					onSubmit={createPres}
					onCancel={() => closePresForm()}
				/>
			</Modal>

			<Modal
				open={!!editingPres}
				onClose={() => closeEditPres()}
				title='Editar presentación'
			>
				<PresentationForm
					initial={editingPres}
					onSubmit={editPres}
					onCancel={() => closeEditPres()}
				/>
			</Modal>

			<Modal
				open={showPresentationsModal && !!selectedProduct}
				onClose={() => closePresentationsModal()}
				title={`${selectedProduct?.name} — Presentaciones`}
			>
				<PresentationsModal
					selectedProd={selectedProduct}
					presentations={productPresentations}
					calculate={calculate}
					onEdit={(pres) => {
						openEditPres(pres)
						closePresentationsModal()
					}}
					onDelete={(presId) => deletePres(presId)}
				/>
			</Modal>
		</div>
	)
}
