export const ProductPresentation = ({
	selectedProd,
	presentations,
	calculate,
}) => {
	return (
		<>
			{selectedProd && (
				<div
					style={{
						marginTop: '25px',
						padding: '20px',
						border: '1px solid #ddd',
						borderRadius: '4px',
					}}
				>
					<h3>{selectedProd.name}</h3>
					<p>
						<strong>Costo de compra:</strong> $
						{selectedProd.purchaseCost?.toLocaleString() ?? 'Sin datos'}
					</p>

					{presentations.length === 0 ? (
						<p>No hay presentaciones para este producto</p>
					) : (
						<>
							<h4>Presentaciones:</h4>
							<div
								style={{
									maxHeight: '300px',
									overflowY: 'auto',
									border: '1px solid #eee',
									borderRadius: '4px',
									padding: '10px',
								}}
							>
								{presentations.map((pres) => {
									const calc = calculate(selectedProd, pres)
									return (
										<div
											key={pres._id}
											style={{
												padding: '10px',
												marginBottom: '10px',
												border: '1px solid #f0f0f0',
												borderRadius: '4px',
											}}
										>
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<div>
													<strong>{pres.label}</strong>
													{pres.grams !== null
														? `(${pres.grams}g)`
														: '(unidad completa)'}
												</div>
												<div
													style={{
														textAlign: 'right',
														minWidth: '150px',
													}}
												>
													<div>Margen: {pres.margin ?? '—'}%</div>
													<div>
														Costo pres.: $
														{calc.costPerPresentation?.toLocaleString() ?? '—'}
													</div>
													<div>
														Precio lista: $
														{calc.listPrice?.toLocaleString() ?? '—'}
													</div>
													<div>
														Precio venta: $
														{pres.salePrice?.toLocaleString() ?? 'Sin datos'}
													</div>
													<div
														style={{
															marginTop: '5px',
															fontSize: '0.9em',
															color:
																calc.priceDifference !== null &&
																calc.priceDifference < 0
																	? '#d32f2f'
																	: calc.priceDifference !== null &&
																		  calc.priceDifference > 0
																		? '#388e3c'
																		: '#666',
														}}
													>
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
