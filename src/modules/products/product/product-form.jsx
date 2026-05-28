import { useState } from 'react'

export const ProductForm = ({ initial, categories, suppliers = [], onSubmit, onCancel }) => {
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?._id ?? '')
  const [name, setName] = useState(initial?.name ?? '')
  const [marca, setMarca] = useState(initial?.marca ?? '')
  const [cost, setCost] = useState(initial?.purchaseCost ?? '')
  const [saleType, setSaleType] = useState(initial?.saleType ?? 'unit')
  const [stockGrams, setStockGrams] = useState(initial?.stockGrams ?? '')
  const [supplierId, setSupplierId] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({
      categoryId,
      name: name.trim(),
      marca: marca.trim(),
      purchaseCost: cost === '' ? null : parseFloat(cost),
      saleType,
      stockGrams: saleType === 'fraction' ? (stockGrams === '' ? 0 : parseInt(stockGrams)) : null,
      supplierId: supplierId || undefined,
    })
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <label className="field-label">Categoría</label>
      <select className="field-input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>

      <label className="field-label">Nombre del producto</label>
      <input className="field-input" type="text" value={name} onChange={(e) => setName(e.target.value)} autoFocus />

      <label className="field-label">Marca</label>
      <input className="field-input" type="text" value={marca} onChange={(e) => setMarca(e.target.value)} />

      {!initial && (
        <>
          <label className="field-label">Proveedor</label>
          <select className="field-input" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
            <option value=''>Sin proveedor</option>
            {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </>
      )}

      <label className="field-label">Tipo de venta</label>
      <select className="field-input" value={saleType} onChange={(e) => setSaleType(e.target.value)}>
        <option value="unit">Por unidad</option>
        <option value="fraction">Fraccionable (por gramos)</option>
      </select>

      {saleType === 'fraction' && (
        <>
          <label className="field-label">Stock total (gramos)</label>
          <input className="field-input" type="number" value={stockGrams} onChange={(e) => setStockGrams(e.target.value)} />
        </>
      )}

      <label className="field-label">Costo de compra ($)</label>
      <input className="field-input" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />

      <div className="modal-actions">
        <button type="button" className="shift-bar__btn" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="shift-bar__btn shift-bar__btn--primary">
          {initial ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  )
}
