/**
 * Displays pricing details and calculated fields for a product's presentations.
 *
 * @param {Object}   props
 * @param {Object|null}   props.selectedProd       Selected product object
 * @param {Array}         props.presentations      Presentations belonging to the selected product
 * @param {Function}      props.calculate          Calculation function (product, presentation) => derived fields
 */
export const ProductPresentation = ({
	selectedProd,
	presentations,
	calculate,
}) => {
	return (
		<>
			{selectedProd && (
				<div className="detail">
					<h3 className="detail__title">{selectedProd.name}</h3>
					<p className="detail__cost">
						<strong>Costo de compra:</strong> $
						{selectedProd.purchaseCost?.toLocaleString() ?? 'Sin datos'}
					</p>

					{presentations.length === 0 ? (
						<p className="empty">No hay presentaciones para este producto</p>
					) : (
						<>
							<h4 className="detail__pres-title">Presentaciones:</h4>
							<div className="pres-list">
								{presentations.map((pres) => {
									const calc = calculate(selectedProd, pres)
									const diffClass =
										calc.priceDifference !== null
											? calc.priceDifference < 0
												? 'pres-card__diff--negative'
												: calc.priceDifference > 0
													? 'pres-card__diff--positive'
													: 'pres-card__diff--neutral'
											: 'pres-card__diff--neutral'
									return (
										<div key={pres._id} className="pres-card">
											<div className="pres-card__content">
												<div>
													<div className="pres-card__label">{pres.label}</div>
													<div className="pres-card__unit">
														{pres.grams !== null
															? `(${pres.grams}g)`
															: '(unidad completa)'}
													</div>
												</div>
												<div className="pres-card__details">
													<div className="pres-card__detail">
														Margen: {pres.margin ?? '—'}%
													</div>
													<div className="pres-card__detail">
														Costo pres.: $
														{calc.costPerPresentation?.toLocaleString() ?? '—'}
													</div>
													<div className="pres-card__detail">
														Precio lista: $
														{calc.listPrice?.toLocaleString() ?? '—'}
													</div>
													<div className="pres-card__detail pres-card__sale">
														Precio venta: $
														{pres.salePrice?.toLocaleString() ?? 'Sin datos'}
													</div>
													<div className={'pres-card__diff ' + diffClass}>
														Diferencia:{' '}
														{calc.priceDifferencePercent !== null
															? `${calc.priceDifferencePercent.toFixed(2)}%`
															: '—'}
														($
														{calc.priceDifference !== null
															? calc.priceDifference.toLocaleString()
															: '—'}
														)
													</div>
												</div>
											</div>
										</div>
									)
								})}
							</div>
						</>
					)}
				</div>
			)}
		</>
	)
}
