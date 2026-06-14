export function OrderItemList({ items, onQuantityChange, onCostChange, onRemove }) {
  if (items.length === 0) {
    return <p className='placeholder'>Agregá productos al pedido</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item) => (
        <div key={item.productId}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--black)', padding: '8px 12px', borderRadius: 6 }}>
          <span className='text-white' style={{ flex: 1, minWidth: 0 }}>
            {item.productName}
          </span>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85em' }}>
            Cant:
            <input className='field-input field-input--sm' type='number' min='1'
              value={item.quantity}
              onChange={(e) => onQuantityChange(item.productId, e.target.value)}
              style={{ width: 55 }} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85em' }}>
            Costo u.:
            <input className='field-input field-input--sm' type='number' min='0' step='0.01'
              value={item.unitCost}
              onChange={(e) => onCostChange(item.productId, e.target.value)}
              style={{ width: 70 }} />
          </label>
          <span style={{ color: 'var(--grey-light)', fontSize: '0.85em', whiteSpace: 'nowrap' }}>
            ${(item.quantity * item.unitCost).toLocaleString()}
          </span>
          <button type='button' className='btn btn--xs btn--danger'
            onClick={() => onRemove(item.productId)}>✕</button>
        </div>
      ))}
    </div>
  )
}
