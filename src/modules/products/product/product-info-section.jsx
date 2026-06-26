import { InlineEdit } from '../../../components/inline-edit.jsx'
import { ETIQUETAS_THRESHOLD } from '../../../data/calculations.js'

export const ProductInfoSection = ({
	isFraction,
	totalStock,
	purchaseCost,
	margin,
	productPres,
	categoryName,
	saleTypeLabel,
	marca,
	etiquetasDisponibles,
	activeSupplierName,
	createdAt,
	costUpdatedAt,
	stockGramsEdit,
	stockGramsValue,
	setStockGramsEdit,
	setStockGramsValue,
	handleStockGramsSave,
	handleEtiquetasChange,
}) => {
	const faltaEtiquetas = isFraction && etiquetasDisponibles != null && etiquetasDisponibles < ETIQUETAS_THRESHOLD

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
					<span className='detail-page__info-label'>{isFraction ? 'Stock general' : 'Stock'}</span>
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
									<button className='btn btn--xs' onClick={() => setStockGramsEdit(false)}>✕</button>
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
					<span className='detail-page__info-label'>Costo {isFraction ? 'por kg' : 'por unidad'}</span>
					<span>
						${purchaseCost?.toLocaleString() ?? 'Sin datos'}
						{costUpdatedAt && (
							<span className='detail-page__info-secondary-date'>
								actualizado {new Date(costUpdatedAt).toLocaleDateString()}
							</span>
						)}
					</span>
				</div>
				{isFraction && (
					<div className='detail-page__info-secondary-item'>
						<span className='detail-page__info-label'>Etiquetas disponibles</span>
						<span className='detail-page__info-etiquetas'>
							<InlineEdit
								value={etiquetasDisponibles ?? 0}
								onSave={handleEtiquetasChange}
								suffix='u'
								simple
							/>
							{faltaEtiquetas && (
								<span className='badge badge--danger' style={{ marginLeft: 8 }}>
									⚠ Faltan etiquetas
								</span>
							)}
						</span>
					</div>
				)}
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
				{createdAt && (
					<div className='detail-page__info-row detail-page__info-row--muted'>
						<span className='detail-page__info-label'>Creado</span>
						<span>{new Date(createdAt).toLocaleDateString()}</span>
					</div>
				)}
				{costUpdatedAt && (
					<div className='detail-page__info-row detail-page__info-row--muted'>
						<span className='detail-page__info-label'>Costo actualizado</span>
						<span>{new Date(costUpdatedAt).toLocaleDateString()}</span>
					</div>
				)}
			</div>
		</div>
	)
}