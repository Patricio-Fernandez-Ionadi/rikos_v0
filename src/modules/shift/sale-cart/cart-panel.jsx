import { useState } from 'react'

export const CartPanel = ({
	cartItems,
	paymentMethod,
	setPaymentMethod,
	subtotal,
	discount,
	calcTotal,
	finalTotal,
	collectedTotal,
	setCollectedTotal,
	onRemoveItem,
	onSubmit,
	onClose,
}) => {
	const hasItems = cartItems.length > 0
	const [editingTotal, setEditingTotal] = useState(false)
	const [totalInput, setTotalInput] = useState('')

	return (
		<div className='sale-cart__cart'>
			<h4 className='sale-cart__cart-heading'>
				Carrito ({cartItems.length})
			</h4>

			<div className='sale-cart__cart-list'>
				{!hasItems ? (
					<p className='placeholder'>Seleccioná un producto para empezar</p>
				) : (
					cartItems.map((item) => (
						<div key={item._cartId} className='sale-cart__cart-item'>
							<div className='sale-cart__cart-item-info'>
								<span className='sale-cart__cart-item-name'>
									{item.productName}
								</span>
								<span className='sale-cart__cart-item-pres'>
									{item.presLabel}
								</span>
								<span className='sale-cart__cart-item-qty'>
									{item.quantity}u × ${item.unitPrice.toLocaleString()}
								</span>
							</div>
							<span className='sale-cart__cart-item-total'>
								${item.total.toLocaleString()}
							</span>
							<button
								className='sidebar__btn sidebar__btn--xs sidebar__btn--danger'
								onClick={() => onRemoveItem(item._cartId)}
							>
								✕
							</button>
						</div>
					))
				)}
			</div>

			{hasItems && (
				<>
					<div className='sale-cart__payment'>
						<h4 className='sale-cart__payment-heading'>Medio de pago</h4>
						<label className='sale-cart__payment-option'>
							<input
								type='radio'
								name='payment'
								value='electronic'
								checked={paymentMethod === 'electronic'}
								onChange={() => setPaymentMethod('electronic')}
							/>
							Electrónico
						</label>
						<label className='sale-cart__payment-option'>
							<input
								type='radio'
								name='payment'
								value='cash'
								checked={paymentMethod === 'cash'}
								onChange={() => setPaymentMethod('cash')}
							/>
							Efectivo
							<span className='sale-cart__discount-badge'>10% OFF</span>
						</label>
					</div>

					<div className='sale-cart__totals'>
						<div className='sale-cart__total-row'>
							<span>Subtotal</span>
							<span>${subtotal.toLocaleString()}</span>
						</div>
						{discount > 0 && (
							<div className='sale-cart__total-row sale-cart__total-row--discount'>
								<span>Descuento 10%</span>
								<span>-${discount.toLocaleString()}</span>
							</div>
						)}
						<div className='sale-cart__total-row sale-cart__total-row--final'>
							<span>Total</span>
							{editingTotal ? (
								<input
									className='field-input'
									type='number'
									value={totalInput}
									onChange={(e) => setTotalInput(e.target.value)}
								onBlur={() => {
									const v = parseFloat(totalInput)
									if (!isNaN(v) && v >= 0 && Math.abs(v - calcTotal) > 0.01) {
										setCollectedTotal(v)
									} else {
										setCollectedTotal(null)
									}
									setEditingTotal(false)
								}}
									onKeyDown={(e) => {
										if (e.key === 'Enter') e.target.blur()
										if (e.key === 'Escape') {
											setCollectedTotal(null)
											setEditingTotal(false)
										}
									}}
									autoFocus
									style={{ width: '120px', textAlign: 'right' }}
								/>
							) : (
								<span
									style={{ cursor: 'pointer' }}
									onClick={() => {
										setTotalInput(String(finalTotal))
										setEditingTotal(true)
									}}
									title='Click para editar el monto cobrado'
								>
									${finalTotal.toLocaleString()}
									{collectedTotal != null && (
										<span style={{ fontSize: '0.75rem', color: '#999', marginLeft: '6px' }}>
											(manual)
										</span>
									)}
								</span>
							)}
						</div>
						{collectedTotal != null && Math.abs(collectedTotal - calcTotal) > 0.01 && (
							<div className='sale-cart__total-row' style={{ fontSize: '0.85rem', color: '#ffa726' }}>
								<span>Ajuste</span>
								<span>${(collectedTotal - calcTotal) > 0 ? '+' : ''}{(collectedTotal - calcTotal).toLocaleString()}</span>
							</div>
						)}
					</div>

					<button
						className='shift-bar__btn shift-bar__btn--primary sale-cart__submit'
						onClick={() => onSubmit(onClose)}
					>
						Registrar Venta
					</button>
				</>
			)}
		</div>
	)
}
