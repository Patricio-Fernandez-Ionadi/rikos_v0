import { useState } from 'react'

/**
 * Form for creating or editing a product.
 *
 * @param {Object}   props
 * @param {Object}   [props.initial]     Existing product to edit (undefined = create mode)
 * @param {Array}    props.categories    List of categories
 * @param {Function} props.onSubmit      Called with { categoryId, name, purchaseCost }
 * @param {Function} props.onCancel
 */
export const ProductForm = ({ initial, categories, onSubmit, onCancel }) => {
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?._id ?? '')
  const [name, setName] = useState(initial?.name ?? '')
  const [cost, setCost] = useState(initial?.purchaseCost ?? '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({
      categoryId,
      name: name.trim(),
      purchaseCost: cost === '' ? null : parseFloat(cost),
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
