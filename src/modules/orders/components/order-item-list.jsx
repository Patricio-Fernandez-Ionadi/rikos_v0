function itemKey(item) {
  return item.presentationId ? `${item.productId}-${item.presentationId}` : item.productId
}

export function OrderItemList({ items, onQuantityChange, onCostChange, onRemove }) {
  if (items.length === 0) {
    return <p className='placeholder'>Agregá productos al pedido</p>
  }

  return (
    <div className='order-item-list'>
      {items.map((item) => (
        <div key={itemKey(item)} className='order-item-list__item'>
          <span className='order-item-list__name'>
            {item.productName}
            {item.presentationLabel && (
              <span className='order-item-list__pres-label'>
                {item.presentationCode != null && <span className='pres-code-sm'>{item.presentationCode}</span>}
                {item.presentationLabel}
              </span>
            )}
            {item.unitLabel && <span className='order-item-list__unit-label'>{item.unitLabel}</span>}
          </span>
          <label className='order-item-list__field'>
            Cant:
            <input className='field-input field-input--sm' type='number' min='1'
              value={item.quantity}
              onChange={(e) => onQuantityChange(itemKey(item), e.target.value)}
              style={{ width: 55 }} />
          </label>
          <label className='order-item-list__field'>
            Costo u.:
            <input className='field-input field-input--sm' type='number' min='0' step='0.01'
              value={item.unitCost}
              onChange={(e) => onCostChange(itemKey(item), e.target.value)}
              style={{ width: 70 }} />
          </label>
          <span className='order-item-list__subtotal'>
            ${(item.quantity * item.unitCost).toLocaleString()}
          </span>
          <button type='button' className='btn btn--xs btn--danger'
            onClick={() => onRemove(itemKey(item))}>✕</button>
        </div>
      ))}
    </div>
  )
}
