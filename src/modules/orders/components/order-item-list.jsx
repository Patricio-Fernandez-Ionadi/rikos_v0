export function OrderItemList({ items, onQuantityChange, onCostChange, onRemove }) {
  if (items.length === 0) {
    return <p className='placeholder'>Agregá productos al pedido</p>
  }

  return (
    <div className='order-item-list'>
      {items.map((item) => (
        <div key={item.productId} className='order-item-list__item'>
          <span className='order-item-list__name'>
            {item.productName}
          </span>
          <label className='order-item-list__field'>
            Cant:
            <input className='field-input field-input--sm' type='number' min='1'
              value={item.quantity}
              onChange={(e) => onQuantityChange(item.productId, e.target.value)}
              style={{ width: 55 }} />
          </label>
          <label className='order-item-list__field'>
            Costo u.:
            <input className='field-input field-input--sm' type='number' min='0' step='0.01'
              value={item.unitCost}
              onChange={(e) => onCostChange(item.productId, e.target.value)}
              style={{ width: 70 }} />
          </label>
          <span className='order-item-list__subtotal'>
            ${(item.quantity * item.unitCost).toLocaleString()}
          </span>
          <button type='button' className='btn btn--xs btn--danger'
            onClick={() => onRemove(item.productId)}>✕</button>
        </div>
      ))}
    </div>
  )
}
