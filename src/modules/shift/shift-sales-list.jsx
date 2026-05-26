import { useState } from 'react'
import { useShift } from '../../modules/shift/shift-context.jsx'
import { useData } from '../../app/data-context.jsx'

/**
 * Displays the current shift's sales with inline edit and delete.
 * Each sale shows product name, quantity, unit price, and total.
 */
export const ShiftSalesList = () => {
	const { shift, removeSale, editSale } = useShift()
	const { products } = useData()

	const [editing, setEditing] = useState(null)
	const [editQty, setEditQty] = useState('')
	const [editPrice, setEditPrice] = useState('')

	if (!shift || shift.status !== 'open') return null

	const sales = shift.sales ?? []

	const getProductName = (id) =>
		products.find((p) => p._id === id)?.name ?? '—'

	const startEdit = (sale) => {
		setEditing(sale._tempId)
		setEditQty(String(sale.quantity))
		setEditPrice(String(sale.unitPrice))
	}

	const saveEdit = (sale) => {
		const qty = parseFloat(editQty)
		const price = parseFloat(editPrice)
		if (isNaN(qty) || qty <= 0 || isNaN(price) || price < 0) return
		editSale(sale._tempId, {
			quantity: qty,
			unitPrice: price,
			total: +(qty * price).toFixed(2),
		})
		setEditing(null)
	}

	const cancelEdit = () => setEditing(null)

	const handleRemove = (tempId) => {
		if (window.confirm('¿Eliminar esta venta?')) removeSale(tempId)
	}

	return (
		<div className='shift-sales'>
			<h4 className='shift-sales__title'>
				Ventas del turno ({sales.length})
			</h4>
			{sales.length === 0 ? (
				<p className='shift-sales__empty'>No hay ventas registradas</p>
			) : (
				<div className='shift-sales__list'>
					{sales.map((sale) => (
						<div key={sale._tempId} className='shift-sales__item'>
							{editing === sale._tempId ? (
								<div className='shift-sales__edit'>
									<span className='shift-sales__product'>
										{getProductName(sale.productId)}
									</span>
									<label className='shift-sales__edit-field'>
										Cant:
										<input
											className='field-input field-input--xs'
											type='number'
											value={editQty}
											onChange={(e) => setEditQty(e.target.value)}
										/>
									</label>
									<label className='shift-sales__edit-field'>
										P. Unit:
										<input
											className='field-input field-input--xs'
											type='number'
											value={editPrice}
											onChange={(e) => setEditPrice(e.target.value)}
										/>
									</label>
									<span className='shift-sales__total'>
										$
										{(
											parseFloat(editQty || 0) *
											parseFloat(editPrice || 0)
										).toLocaleString()}
									</span>
									<div className='shift-sales__edit-actions'>
										<button
											className='sidebar__btn sidebar__btn--xs'
											onClick={() => saveEdit(sale)}
										>
											OK
										</button>
										<button
											className='sidebar__btn sidebar__btn--xs'
											onClick={cancelEdit}
										>
											X
										</button>
									</div>
								</div>
							) : (
								<div className='shift-sales__display'>
									<span className='shift-sales__product'>
										{getProductName(sale.productId)}
									</span>
									<span className='shift-sales__qty'>
										{sale.quantity}u
									</span>
									<span className='shift-sales__price'>
										${sale.unitPrice.toLocaleString()}
									</span>
									<span className='shift-sales__total'>
										${sale.total.toLocaleString()}
									</span>
									<div className='shift-sales__actions'>
										<button
											className='shift-bar__btn shift-bar__btn--sm'
											onClick={() => startEdit(sale)}
										>
											Editar
										</button>
										<button
											className='shift-bar__btn shift-bar__btn--sm shift-bar__btn--danger'
											onClick={() => handleRemove(sale._tempId)}
										>
											Eliminar
										</button>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
			<div className='shift-sales__footer'>
				<strong>Total ventas: </strong>$
				{sales.reduce((s, x) => s + x.total, 0).toLocaleString()}
			</div>
		</div>
	)
}
