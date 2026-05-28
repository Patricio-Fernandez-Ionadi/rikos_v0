export const ProductInfoSection = ({
	isFraction,
	totalStock,
	purchaseCost,
	minSalePrice,
	categoryName,
	saleTypeLabel,
	marca,
	activeSupplierName,
	stockGramsEdit,
	stockGramsValue,
	setStockGramsEdit,
	setStockGramsValue,
	handleStockGramsSave,
}) => {
	return (
		<div className='detail-page__info'>
			<div className='detail-page__info-primary'>
				<div className='detail-page__info-primary-value'>
					{minSalePrice != null
						? `$${minSalePrice.toLocaleString()}`
						: '—'}
				</div>
				<div className='detail-page__info-primary-label'>
					Precio de venta
				</div>
			</div>

			<div className='detail-page__info-secondary'>
				<div className='detail-page__info-secondary-item'>
					<span className='detail-page__info-label'>Stock</span>
					<span>
						{isFraction ? (
							stockGramsEdit ? (
								<span className='stock-edit-inline'>
									<input
										className='field-input field-input--xs'
										type='number'
										value={stockGramsValue}
										onChange={(e) => setStockGramsValue(e.target.value)}
									/>
									<button
										className='sidebar__btn sidebar__btn--xs'
										onClick={handleStockGramsSave}
									>
										OK
									</button>
									<button
										className='sidebar__btn sidebar__btn--xs'
										onClick={() => setStockGramsEdit(false)}
									>
										X
									</button>
								</span>
							) : (
								<>
									{totalStock ?? 0}g
									<button
										className='sidebar__btn sidebar__btn--xs'
										onClick={() => {
											setStockGramsValue(String(totalStock ?? 0))
											setStockGramsEdit(true)
										}}
									>
										Ajustar
									</button>
								</>
							)
						) : (
							<>{totalStock ?? 0} unidades</>
						)}
					</span>
				</div>
				<div className='detail-page__info-secondary-item'>
					<span className='detail-page__info-label'>Costo de compra</span>
					<span>${purchaseCost?.toLocaleString() ?? 'Sin datos'}</span>
				</div>
			</div>

			<div className='detail-page__info-tertiary'>
				{marca && (
					<div className='detail-page__info-row'>
						<span className='detail-page__info-label'>Marca</span>
						<span>{marca}</span>
					</div>
				)}
				<div className='detail-page__info-row'>
					<span className='detail-page__info-label'>Tipo</span>
					<span>{saleTypeLabel}</span>
				</div>
				<div className='detail-page__info-row'>
					<span className='detail-page__info-label'>Categoría</span>
					<span>{categoryName ?? '—'}</span>
				</div>
				{activeSupplierName && (
					<div className='detail-page__info-row'>
						<span className='detail-page__info-label'>Proveedor actual</span>
						<span>{activeSupplierName}</span>
					</div>
				)}
			</div>
		</div>
	)
}
