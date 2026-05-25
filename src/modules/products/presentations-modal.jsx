/**
 * Displays pricing details for a product's presentations with action buttons.
 * Shows name + presentation, grams/unit + sale price, cost + list price, and difference.
 * Optimized for mobile viewing within a modal.
 *
 * @param {Object}   props
 * @param {Object}   props.selectedProd       Selected product object
 * @param {Array}    props.presentations      Presentations belonging to the selected product
 * @param {Function} props.calculate          Calculation function (product, presentation) => derived fields
 * @param {Function} props.onEdit            Callback when edit button is clicked (receives presentation)
 * @param {Function} props.onDelete          Callback when delete button is clicked (receives presentation ID)
 */
export const PresentationsModal = ({
	selectedProd,
	presentations,
	onEdit,
	onDelete,
	calculate,
}) => {
	if (!selectedProd) return

	return (
		<div className='pres-detail'>
			{presentations.length === 0 ? (
				<p className='pres-detail__empty'>
					No hay presentaciones para este producto
				</p>
			) : (
				<div className='pres-grid'>
					{presentations.map((pres) => {
						const calc = calculate(selectedProd, pres)
						const diffClass =
							calc.priceDifference !== null
								? calc.priceDifference < 0
									? 'pres-row__diff--negative'
									: calc.priceDifference > 0
										? 'pres-row__diff--positive'
										: 'pres-row__diff--neutral'
								: 'pres-row__diff--neutral'

						return (
							<div key={pres._id} className='pres-row'>
								<div className='pres-row__main'>
									<div className='pres-row__row'>
										<div className='pres-row__cell pres-row__cell--label'>
											<span className='pres-row__name'>{pres.label}</span>
										</div>
										<div className='pres-row__cell pres-row__cell--value'>
											<span className='pres-row__label-small'>Venta</span>
											<span className='pres-row__value pres-row__value--sale'>
												${pres.salePrice?.toLocaleString() ?? 'Sin precio'}
											</span>
										</div>
									</div>

									<div className='pres-row__row'>
										<div className='pres-row__cell pres-row__cell--secondary'>
											<span className='pres-row__label-small'>Cantidad</span>
											<span className='pres-row__value pres-row__value--secondary'>
												{pres.grams !== null ? `${pres.grams}g` : 'Unidad'}
											</span>
										</div>
										<div className='pres-row__cell pres-row__cell--value'>
											<span className='pres-row__label-small'>Lista</span>
											<span className='pres-row__value pres-row__value--secondary'>
												${calc.listPrice?.toLocaleString() ?? '—'}
											</span>
										</div>
									</div>

									<div className='pres-row__row'>
										<div className='pres-row__cell pres-row__cell--secondary'>
											<span className='pres-row__label-small'>Costo</span>
											<span className='pres-row__value pres-row__value--secondary'>
												${calc.costPerPresentation?.toLocaleString() ?? '—'}
											</span>
										</div>
										<div
											className={`pres-row__cell pres-row__cell--diff ${diffClass}`}
										>
											<span className='pres-row__label-small'>Diferencia</span>
											<span className='pres-row__value pres-row__diff-text'>
												{calc.priceDifferencePercent !== null
													? `${calc.priceDifferencePercent.toFixed(2)}%`
													: '—'}{' '}
												($
												{calc.priceDifference !== null
													? calc.priceDifference.toLocaleString()
													: '—'}
												)
											</span>
										</div>
									</div>
								</div>

								{(onEdit || onDelete) && (
									<div className='pres-row__actions'>
										{onEdit && (
											<button
												className='pres-row__btn pres-row__btn--edit'
												onClick={() => onEdit(pres)}
												title='Editar presentación'
											>
												✎
											</button>
										)}
										{onDelete && (
											<button
												className='pres-row__btn pres-row__btn--delete'
												onClick={() => onDelete(pres._id)}
												title='Eliminar presentación'
											>
												🗑
											</button>
										)}
									</div>
								)}
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}
