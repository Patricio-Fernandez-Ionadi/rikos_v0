import { Modal } from '../../../../components/Modal.jsx'
import { ProductForm } from '../product-form.jsx'
import { PresentationForm } from '../presentation-form.jsx'

export function ProductDetailModals({
  editProductOpen,
  onCloseEditProduct,
  product,
  categories,
  suppliers,
  handleEditProduct,
  presFormOpen,
  onClosePresForm,
  handleCreatePres,
  editingPres,
  onCloseEditingPres,
  handleEditPres,
}) {
  return (
    <>
      <Modal open={editProductOpen} onClose={onCloseEditProduct} title='Editar producto'>
        <ProductForm
          initial={product}
          categories={categories}
          suppliers={suppliers}
          onSubmit={handleEditProduct}
          onCancel={onCloseEditProduct}
        />
      </Modal>

      <Modal open={presFormOpen} onClose={onClosePresForm} title='Nueva presentación'>
        <PresentationForm
          product={product}
          onSubmit={async (data) => { await handleCreatePres(data); onClosePresForm() }}
          onCancel={onClosePresForm}
        />
      </Modal>

      <Modal open={!!editingPres} onClose={onCloseEditingPres} title='Editar presentación'>
        <PresentationForm
          initial={editingPres}
          product={product}
          onSubmit={async (data) => { await handleEditPres(data); onCloseEditingPres() }}
          onCancel={onCloseEditingPres}
        />
      </Modal>
    </>
  )
}
