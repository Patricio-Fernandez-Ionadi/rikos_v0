import { FormActions } from '../../../../components/form-actions.jsx'
import { BULTO_UNITS_OPTIONS, BULTO_KG_OPTIONS } from '../../supplier-detail-manager.js'

export function SupplierAddProductForm({
  showAddForm, addMode, setAddMode,
  searchTerm, setSearchTerm,
  selectedProductId, setSelectedProductId,
  filteredAvailableProducts,
  newCatId, setNewCatId, newName, setNewName,
  purchaseCost, setPurchaseCost,
  bultoQuantity, setBultoQuantity,
  bultoIsCustom, setBultoIsCustom,
  isFraction,
  handleAddProduct, categories,
}) {
  if (!showAddForm) return null

  const bultoOptions = isFraction ? BULTO_KG_OPTIONS : BULTO_UNITS_OPTIONS
  const bultoLabel = isFraction ? 'kg' : 'uds'

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

      <label className='field-label mt-4'>Precio por bulto ($)</label>
      <input className='field-input' type='number' value={purchaseCost} onChange={(e) => setPurchaseCost(e.target.value)} />

      <label className='field-label mt-4'>
        {isFraction ? 'Kg del bulto' : 'Unidades por bulto'}
      </label>
      <div className='flex-row gap-8'>
        <select className='field-input' value={bultoIsCustom ? '__custom__' : bultoQuantity}
          onChange={(e) => {
            const val = e.target.value
            if (val === '__custom__') {
              setBultoIsCustom(true)
              setBultoQuantity('')
            } else {
              setBultoIsCustom(false)
              setBultoQuantity(val)
            }
          }}>
          <option value=''>Seleccionar…</option>
          {bultoOptions.map((opt) => (
            <option key={opt} value={opt}>{opt} {bultoLabel}</option>
          ))}
          <option value='__custom__'>Personalizado</option>
        </select>
        {bultoIsCustom && (
          <input className='field-input field-input--sm' type='number' step='0.1' min='0.1'
            value={bultoQuantity} placeholder='Valor'
            onChange={(e) => setBultoQuantity(e.target.value)} style={{ width: 80 }} />
        )}
      </div>

      {purchaseCost && bultoQuantity && (
        <div className='text-primary mt-4 text-sm'>
          Costo derivado: ${(parseFloat(purchaseCost) / parseFloat(bultoQuantity)).toFixed(2)} {isFraction ? '/kg' : '/unidad'}
        </div>
      )}

      <FormActions hideCancel submitLabel='Asignar' onSubmit={handleAddProduct}
        submitDisabled={
          (addMode === 'existing' && !selectedProductId) ||
          (addMode === 'new' && (!newName.trim() || !newCatId)) ||
          !purchaseCost
        } />
    </div>
  )
}