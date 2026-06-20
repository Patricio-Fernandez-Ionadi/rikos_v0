import { Button } from '../../../../components/button.jsx'
import { ProductInfo } from '../product-info.jsx'
import { PresentationCard } from '../presentation-card.jsx'
import { SuppliersSection } from '../suppliers-section.jsx'
import { TaskAssigner } from '../../../tasks/task-assigner.jsx'

export function ProductDetailBody({
  product,
  productPres,
  category,
  isFraction,
  totalStock,
  minSalePrice,
  activeSupplierName,
  stockGramsEdit,
  stockGramsValue,
  setStockGramsEdit,
  setStockGramsValue,
  handleStockGramsSave,
  shift,
  calculate,
  salePresId,
  setSalePresId,
  handleSale,
  setEditingPres,
  handleDeletePres,
  handleRenumberPres,
  hasMissingCodes,
  suppliers,
  productSuppliers,
  assignedSupplierIds,
  activeSupplier,
  handleUseSupplierCost,
  handleRemoveSupplier,
  handleAddSupplier,
  handlePresentationStockChange,
  getProductTaskCategories,
  toggleProductTask,
  setEditProductOpen,
  handleDeleteProduct,
  setPresFormOpen,
  onQuickOrder,
}) {
  return (
    <>
      <div className='detail-page__title-row'>
        <h2 className='detail-page__title'>{product.name}</h2>
        <div className='detail-page__title-actions'>
          <Button size='xs' variant='primary' onClick={onQuickOrder} title='Pedir a proveedor'>
            Pedir
          </Button>
          <Button size='xs' onClick={() => setEditProductOpen(true)} title='Editar producto'>
            <span className='material-icons'>edit</span>
          </Button>
        </div>
      </div>
      <div className='detail-page__id'>ID: {product._id}</div>

      {product.tags?.length > 0 && (
        <div className='detail-page__tags'>
          {product.tags.map((tag) => (
            <span key={tag} className='badge badge--primary'>{tag}</span>
          ))}
        </div>
      )}

      <ProductInfo
        product={product}
        category={category}
        isFraction={isFraction}
        totalStock={totalStock}
        productPres={productPres}
        minSalePrice={minSalePrice}
        activeSupplierName={activeSupplierName}
        stockGramsEdit={stockGramsEdit}
        stockGramsValue={stockGramsValue}
        setStockGramsEdit={setStockGramsEdit}
        setStockGramsValue={setStockGramsValue}
        handleStockGramsSave={handleStockGramsSave}
      />

      <div className='detail-page__section'>
        <div className='detail-page__section-header'>
          <h3>Presentaciones</h3>
          <div className='detail-page__section-actions'>
            {hasMissingCodes && (
              <button type='button' className='detail-page__renumber-btn' onClick={handleRenumberPres} title='Renumerar secuencialmente'>
                Renumerar
              </button>
            )}
            <Button size='sm' onClick={() => setPresFormOpen(true)}>+ Nueva</Button>
          </div>
        </div>
        {productPres.length === 0 ? (
          <p className='placeholder text-muted'>Sin presentaciones</p>
        ) : (
          <div className='detail-page__pres-grid'>
            {productPres.map((pres) => (
              <PresentationCard
                key={pres._id}
                pres={pres}
                product={product}
                shift={shift}
                calculate={calculate}
                salePresId={salePresId}
                setSalePresId={setSalePresId}
                handleSale={handleSale}
                onEdit={setEditingPres}
                onDelete={handleDeletePres}
                onStockChange={handlePresentationStockChange}
              />
            ))}
          </div>
        )}
      </div>

      <SuppliersSection
        productSuppliers={productSuppliers}
        suppliers={suppliers}
        assignedSupplierIds={assignedSupplierIds}
        activeSupplier={activeSupplier}
        product={product}
        handleUseSupplierCost={handleUseSupplierCost}
        handleRemoveSupplier={handleRemoveSupplier}
        handleAddSupplier={handleAddSupplier}
      />

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

      <div className='detail-page__admin'>
        <button
          className='detail-page__admin-btn detail-page__admin-btn--danger'
          onClick={handleDeleteProduct}
        >
          Eliminar
        </button>
      </div>
    </>
  )
}
