import { useParams } from 'react-router-dom'
import { useCatalog } from '../../app/catalog-context.jsx'
import { useSupplierDetailManager } from '../../modules/suppliers/supplier-detail-manager.js'
import { SupplierAddProductForm } from '../../modules/suppliers/components/supplier-add-product-form/supplier-add-product-form.jsx'
import { SupplierProductTable } from '../../modules/suppliers/components/supplier-product-table/supplier-product-table.jsx'
import { ProductSearch } from '../../components/product-search.jsx'
import { BackButton } from '../../components/back-button.jsx'

export const SupplierDetailPage = () => {
  const { id } = useParams()
  const { products, categories, presentations, suppliers, productSuppliers: allProductSuppliers } = useCatalog()
  const {
    supplier, productSuppliers, filteredAvailableProducts,
    showAddForm, setShowAddForm,
    addMode, setAddMode,
    searchTerm, setSearchTerm,
    selectedProductId, setSelectedProductId,
    newCatId, setNewCatId,
    newName, setNewName,
    purchaseCost, setPurchaseCost,
    editingPS, setEditingPS,
    editCost, setEditCost,
    handleAddProduct, handleUpdateCost, handleUnlink,
  } = useSupplierDetailManager(id)

  if (!supplier) {
    return (
      <div className='stock-page'>
        <p className='placeholder'>Proveedor no encontrado</p>
      </div>
    )
  }

  return (
    <div className='stock-page'>
      <div className='stock-page__title-row'>
        <BackButton to='/suppliers' />
        <h2 className='stock-page__title'>{supplier.name}</h2>
      </div>

      <div className='text-white mb-16'>
        {supplier.contactName && <p>Contacto: {supplier.contactName}</p>}
        {supplier.phone && <p>Teléfono: {supplier.phone}</p>}
        {supplier.email && <p>Email: {supplier.email}</p>}
        {supplier.notes && <p className='text-muted'>{supplier.notes}</p>}
      </div>

      <div className='detail-page__section-header mb-12'>
        <h3 className='text-white m-0'>Productos ({productSuppliers.length})</h3>
        <button className='btn' onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancelar' : '+ Agregar producto'}
        </button>
      </div>

      <SupplierAddProductForm
        showAddForm={showAddForm} setShowAddForm={setShowAddForm}
        addMode={addMode} setAddMode={setAddMode}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        selectedProductId={selectedProductId} setSelectedProductId={setSelectedProductId}
        filteredAvailableProducts={filteredAvailableProducts}
        newCatId={newCatId} setNewCatId={setNewCatId}
        newName={newName} setNewName={setNewName}
        purchaseCost={purchaseCost} setPurchaseCost={setPurchaseCost}
        handleAddProduct={handleAddProduct}
        categories={categories}
      />

      <ProductSearch
        products={products}
        presentations={presentations}
        categories={categories}
        suppliers={suppliers}
        productSuppliers={allProductSuppliers}
        compact
        showCategories={false}
        showTags={false}
        placeholder='Buscar producto…'
      >
        {({ filteredProducts }) => {
          const filteredIds = new Set(filteredProducts.map((p) => p._id))
          return (
            <SupplierProductTable
              productSuppliers={productSuppliers.filter((ps) => filteredIds.has(ps.productId))}
              products={products}
              categories={categories}
              editingPS={editingPS} setEditingPS={setEditingPS}
              editCost={editCost} setEditCost={setEditCost}
              handleUpdateCost={handleUpdateCost}
              handleUnlink={handleUnlink}
            />
          )
        }}
      </ProductSearch>
    </div>
  )
}
