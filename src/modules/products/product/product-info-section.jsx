import { InlineEdit } from '../../../components/inline-edit.jsx'

export const ProductInfoSection = ({
	isFraction,
	totalStock,
	purchaseCost,
	margin,
	productPres,
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
				{(productPres ?? []).length > 0 ? (
					<div className='detail-page__info-prices'>
						{productPres.map((pres) => (
							<div key={pres._id} className='detail-page__info-price-item'>
								<span className='detail-page__info-price-label'>{pres.label || '—'}</span>
								<span className='detail-page__info-price-value'>
									${pres.salePrice?.toLocaleString() ?? '—'}
								</span>
							</div>
						))}
					</div>
				) : (
					<div className='detail-page__info-primary-value'>—</div>
				)}
				<div className='detail-page__info-primary-label'>
					Precios de venta
				</div>
			</div>

			<div className='detail-page__info-secondary'>
				<div className='detail-page__info-secondary-item'>
					<span className='detail-page__info-label'>Stock</span>
					<span>
						{isFraction ? (
							stockGramsEdit ? (
								<span className='inline-edit'>
									<input
										className='field-input field-input--xs'
										type='number'
										value={stockGramsValue}
										onChange={(e) => setStockGramsValue(e.target.value)}
									/>
									<span className='inline-edit__suffix'>g</span>
									<button className='btn btn--xs' onClick={handleStockGramsSave}>OK</button>
									<button className='btn btn--xs' onClick={() => setStockGramsEdit(false)}>X</button>
								</span>
							) : (
								<>
									{totalStock ?? 0}g
									<button
										className='btn btn--xs'
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
					<span className='detail-page__info-label'>Margen</span>
					<span>{margin != null ? `${margin}%` : '—'}</span>
				</div>
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
