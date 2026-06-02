import { SaleForm } from '../../../components/sale-form.jsx'

export const PresentationCard = ({
	pres,
	product,
	shift,
	calculate,
	salePresId,
	setSalePresId,
	handleSale,
	onEdit,
	onDelete,
}) => {
	const calc = calculate(pres)
	const diffClass =
		calc.priceDifference !== null
			? calc.priceDifference < 0
				? 'detail-page__diff--negative'
				: calc.priceDifference > 0
					? 'detail-page__diff--positive'
					: 'detail-page__diff--neutral'
			: 'detail-page__diff--neutral'

	return (
		<div className='detail-page__pres-card'>
			<div className='detail-page__pres-header'>
				<span className='detail-page__pres-label'>{pres.label}</span>
				<div className='detail-page__pres-actions'>
					{shift && shift.status === 'open' && (
						<button
							className='shift-bar__btn shift-bar__btn--primary shift-bar__btn--sm'
							onClick={() =>
								setSalePresId(salePresId === pres._id ? null : pres._id)
							}
						>
							Vender
						</button>
					)}
					<button
						className='sidebar__btn sidebar__btn--xs'
						onClick={() => onEdit(pres)}
					>
						Editar
					</button>
					<button
						className='sidebar__btn sidebar__btn--xs sidebar__btn--danger'
						onClick={() => onDelete(pres._id)}
					>
						X
					</button>
				</div>
			</div>

			{salePresId === pres._id && (
				<SaleForm
					presentation={pres}
					product={product}
					onSubmit={handleSale}
					onCancel={() => setSalePresId(null)}
				/>
			)}

			<div className='detail-page__pres-details'>
				<div className='detail-page__pres-row'>
					<span>Cantidad:</span>
					<span>{pres.grams !== null ? `${pres.grams}g` : 1}</span>
				</div>
				<div className='detail-page__pres-row'>
					<span>Stock:</span>
					<span>{pres.stock ?? 0}</span>
				</div>
				<div className='detail-page__pres-row'>
					<span>Margen:</span>
					<span>{product.margin != null ? `${product.margin}%` : '—'}</span>
				</div>
				<div className='detail-page__pres-row'>
					<span>Precio lista:</span>
					<span>${calc.listPrice?.toLocaleString() ?? '—'}</span>
				</div>
				<div className='detail-page__pres-row'>
					<span>Costo x pres.:</span>
					<span>${calc.costPerPresentation?.toLocaleString() ?? '—'}</span>
				</div>
				<div className='detail-page__pres-row'>
					<span>Precio venta:</span>
					<span className='detail-page__pres-value'>
						${pres.salePrice?.toLocaleString() ?? 'Sin precio'}
					</span>
				</div>
				<div className={`detail-page__pres-row ${diffClass}`}>
					<span>Diferencia:</span>
					<span>
						{calc.priceDifferencePercent !== null
							? `${calc.priceDifferencePercent.toFixed(2)}%`
							: '—'}
						{calc.priceDifference !== null &&
							` ($${calc.priceDifference.toLocaleString()})`}
					</span>
				</div>
			</div>
		</div>
	)
}
