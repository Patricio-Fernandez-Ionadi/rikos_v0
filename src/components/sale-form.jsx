import { useState } from 'react'

/**
 * Inline form to record a sale of a product presentation.
 *
 * @param {Object}   props
 * @param {Object}   props.presentation
 * @param {Function} props.onSubmit   Called with { productId, presentationId, quantity, unitPrice, total }
 * @param {Function} props.onCancel
 */
export const SaleForm = ({ presentation, onSubmit, onCancel }) => {
  const [qty, setQty] = useState(1)
  const [price, setPrice] = useState(presentation.salePrice ?? '')

  const total = (parseInt(qty) || 0) * (parseFloat(price) || 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!qty || !price) return
    onSubmit({
      productId: presentation.productId,
      presentationId: presentation._id,
      quantity: parseInt(qty),
      unitPrice: parseFloat(price),
      total,
    })
  }

  return (
    <form className="sale-form" onSubmit={handleSubmit}>
      <div className="sale-form__row">
        <label className="field-label">Cantidad</label>
        <input
          className="field-input field-input--sm"
          type="number"
          min="1"
          max={presentation.stock}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
      </div>
      <div className="sale-form__row">
        <label className="field-label">Precio unitario ($)</label>
        <input
          className="field-input field-input--sm"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div className="sale-form__total">Total: ${total.toLocaleString()}</div>
      <div className="sale-form__actions">
        <button type="button" className="shift-bar__btn" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="shift-bar__btn shift-bar__btn--primary">Vender</button>
      </div>
    </form>
  )
}
