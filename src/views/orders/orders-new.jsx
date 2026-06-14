import { useOrderForm } from '../../modules/orders/hooks/use-order-form.js'
import { Button } from '../../components/button.jsx'
import { SupplierSelector } from '../../modules/orders/components/supplier-selector.jsx'
import { NewSupplierInline } from '../../modules/orders/components/new-supplier-inline.jsx'
import { SupplierProductsPanel } from '../../modules/orders/components/supplier-products-panel.jsx'
import { ProductSearchPanel } from '../../modules/orders/components/product-search-panel.jsx'
import { NewProductInline } from '../../modules/orders/components/new-product-inline.jsx'
import { OrderItemList } from '../../modules/orders/components/order-item-list.jsx'

export const OrderFormPage = () => {
  const {
    isEditing, loading, navigate,
    supplierId, supplierName, supplierProducts, items, notes, setNotes, totalCost,
    searchQuery, setSearchQuery,
    selectedProductId, setSelectedProductId,
    filteredProducts, addedProductIds, productMap,
    categories, suppliers,
    handleSupplierChange,
    handleAddItem, handleRemoveItem,
    handleQuantityChange, handleCostChange,
    handleAddSearchedProduct, handleCreateAndAdd,
    handleCreateSupplier, handleSubmit,
  } = useOrderForm()

  if (loading) {
    return (
      <div className='stock-page'>
        <p className='placeholder'>Cargando pedido...</p>
      </div>
    )
  }

  return (
    <div className='stock-page'>
      <div className='stock-page__title-row'>
        <button className='back-btn' onClick={() => navigate('/orders')}>
          <span className='material-icons'>arrow_back</span> Volver
        </button>
        <h2 className='stock-page__title'>
          {isEditing ? 'Editar pedido' : 'Nuevo pedido'}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <SupplierSelector
          supplierId={supplierId}
          suppliers={suppliers}
          onChange={handleSupplierChange}
        />

        <NewSupplierInline
          show={supplierId === '__new__'}
          onSave={handleCreateSupplier}
        />

        {supplierId && supplierId !== '__new__' && (
          <>
            <SupplierProductsPanel
              supplierName={supplierName}
              supplierProducts={supplierProducts}
              productMap={productMap}
              addedProductIds={addedProductIds}
              onAdd={handleAddItem}
            />

            <ProductSearchPanel
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filteredProducts={filteredProducts}
              selectedProductId={selectedProductId}
              onSelectedProductChange={setSelectedProductId}
              onAdd={handleAddSearchedProduct}
            />

            <NewProductInline
              categories={categories}
              onSave={handleCreateAndAdd}
            />

            <div className='surface-card p-16 mb-16'>
              <h4 className='text-white mb-8'>Productos del pedido ({items.length})</h4>
              <OrderItemList items={items} onQuantityChange={handleQuantityChange} onCostChange={handleCostChange} onRemove={handleRemoveItem} />
            </div>

            <div className='surface-card p-16 mb-16'>
              <label className='field-label'>Notas (opcional)</label>
              <textarea className='field-input' value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>

            <div className='flex-row' style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className='text-white' style={{ margin: 0 }}>
                Costo total: ${totalCost.toLocaleString()}
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type='button' onClick={() => navigate('/orders')}>Cancelar</Button>
                <Button variant='primary' type='submit' disabled={items.length === 0}>
                  {isEditing ? 'Guardar cambios' : 'Crear pedido'}
                </Button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
