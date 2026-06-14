import { FormActions } from '../../../../components/form-actions.jsx'

export function SupplierAddProductForm({
  showAddForm, addMode, setAddMode,
  searchTerm, setSearchTerm,
  selectedProductId, setSelectedProductId,
  filteredAvailableProducts,
  newCatId, setNewCatId, newName, setNewName,
  purchaseCost, setPurchaseCost,
  handleAddProduct, categories,
}) {
  if (!showAddForm) return null

  return (
    <div className='surface-card p-12 mb-16'>
      <div className='flex-row gap-8 mb-8'>
        <button className={`btn ${addMode === 'existing' ? 'btn--active' : ''}`}
          onClick={() => setAddMode('existing')}>Producto existente</button>
        <button className={`btn ${addMode === 'new' ? 'btn--active' : ''}`}
          onClick={() => setAddMode('new')}>Producto nuevo</button>
      </div>

      {addMode === 'existing' ? (
        <>
          <label className='field-label'>Buscar producto</label>
          <input className='field-input' type='text' value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} placeholder='Escribí para filtrar…' />
          <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}
            className='field-input mt-4'>
            <option value=''>Seleccionar producto…</option>
            {filteredAvailableProducts.map((p) => (
              <option key={p._id} value={p._id}>{p.name}{p.marca ? ` — ${p.marca}` : ''}</option>
            ))}
          </select>
        </>
      ) : (
        <>
          <label className='field-label'>Categoría</label>
          <select className='field-input' value={newCatId} onChange={(e) => setNewCatId(e.target.value)}>
            {categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
          </select>
          <label className='field-label mt-4'>Nombre del producto</label>
          <input className='field-input' type='text' value={newName} onChange={(e) => setNewName(e.target.value)} />
        </>
      )}

      <label className='field-label mt-4'>Precio de costo ($)</label>
      <input className='field-input' type='number' value={purchaseCost} onChange={(e) => setPurchaseCost(e.target.value)} />

      <FormActions hideCancel submitLabel='Asignar' onSubmit={handleAddProduct}
        submitDisabled={
          (addMode === 'existing' && !selectedProductId) ||
          (addMode === 'new' && (!newName.trim() || !newCatId)) ||
          !purchaseCost
        } />
    </div>
  )
}
