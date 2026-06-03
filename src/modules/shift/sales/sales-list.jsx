import { useCatalog } from '../../../app/catalog-context.jsx'
import { useSalesManager } from './sales-manager.js'

export const SalesList = () => {
	const {
		groups,
		editingId,
		editQty,
		toggleExpand,
		isExpanded,
		startEdit,
		cancelEdit,
		setEditQty,
		saveEdit,
		handleDelete,
	} = useSalesManager()
	const { products } = useCatalog()

	const getProductName = (productId) =>
		products.find((p) => p._id === productId)?.name ?? '—'

	return (
		<div className='shift-sales'>
			<h4 className='shift-sales__title'>Ventas del turno ({groups.length})</h4>
			{groups.length === 0 ? (
				<p className='shift-sales__empty'>No hay ventas registradas</p>
			) : (
				<div className='shift-sales__list'>
					{groups.map((group) => (
						<div key={group.id} className='shift-sales__group'>
							<div
								className='shift-sales__group-header'
								onClick={() => toggleExpand(group.id)}
								role='button'
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') toggleExpand(group.id)
								}}
							>
								<span className='shift-sales__group-time'>
									{new Date(group.timestamp).toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit',
									})}
								</span>
								<span className='shift-sales__group-count'>
									{group.items.length} item{group.items.length > 1 ? 's' : ''}
								</span>
								<span
									className={`shift-sales__payment shift-sales__payment--${group.paymentMethod ?? 'cash'}`}
								>
									{group.paymentMethod === 'electronic' ? 'Elect.' : 'Efvo'}
								</span>
								<span className='shift-sales__group-total'>
									$
									{group.items
										.reduce((s, x) => s + x.total, 0)
										.toLocaleString()}
								</span>
								<span
									className={`shift-sales__expand-icon ${isExpanded(group.id) ? 'shift-sales__expand-icon--open' : ''}`}
								>
									<span className='material-icons'>chevron_right</span>
								</span>
							</div>
							{isExpanded(group.id) && (
								<div className='shift-sales__group-detail'>
									{group.items.map((item) => {
										const itemId = item._tempId || item._id
										const dbId = item._id
										return (
											<div key={itemId} className='shift-sales__item'>
												{editingId === itemId ? (
													<div className='shift-sales__edit-row'>
														<span className='shift-sales__item-name'>
															{getProductName(item.productId)}
														</span>
														<div className='shift-sales__edit-controls'>
															<input
																className='field-input field-input--sm'
																type='number'
																min='1'
																value={editQty ?? item.quantity}
																onChange={(e) =>
																	setEditQty(parseInt(e.target.value) || 1)
																}
																style={{ width: '60px' }}
															/>
															<span className='shift-sales__item-subtotal'>
																$
																{(
																	(editQty ?? item.quantity) * item.unitPrice
																).toLocaleString()}
															</span>
															<button
																className='btn btn--primary'
																onClick={() =>
																	saveEdit(dbId, itemId, item.unitPrice)
																}
																style={{ padding: '2px 8px' }}
															>
																OK
															</button>
															<button
																className='btn'
																onClick={cancelEdit}
																style={{ padding: '2px 8px' }}
															>
																X
															</button>
														</div>
													</div>
												) : (
													<div className='shift-sales__item-display'>
														<span className='shift-sales__item-name'>
															{getProductName(item.productId)}
														</span>
														<span className='shift-sales__qty'>
															{item.quantity}u
														</span>
														<span className='shift-sales__item-price'>
															${item.unitPrice.toLocaleString()}
														</span>
														<span className='shift-sales__item-subtotal'>
															${item.total.toLocaleString()}
														</span>
														<button
															className='btn'
															onClick={() => startEdit(itemId, item.quantity)}
															style={{ padding: '1px 6px', fontSize: '0.7em' }}
															title='Editar cantidad'
														>
															✎
														</button>
														<button
															className='btn btn--danger'
															onClick={() => handleDelete(dbId, itemId)}
															style={{ padding: '1px 6px', fontSize: '0.7em' }}
															title='Eliminar'
														>
															✕
														</button>
													</div>
												)}
											</div>
										)
									})}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}
