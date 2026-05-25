import { useData } from '../../context/DataContext.jsx'

/**
 * Card for a single closed shift showing date range, stats (sales count,
 * total, opening/closing cash, expected balance, difference), optional
 * notes, and an expandable sales table.
 *
 * @param {Object}     props
 * @param {Object}     props.shift        Closed shift data
 * @param {boolean}    props.isExpanded   Whether the sales table is visible
 * @param {Function}   props.onToggle     Callback to toggle expand
 */
export const PastShiftCard = ({ shift: s, isExpanded, onToggle }) => {
	const { products } = useData()

	const getProductName = (id) =>
		products.find((p) => p._id === id)?.name ?? '—'

	const diffClass =
		s.difference != null
			? s.difference < 0
				? 'shifts-page__diff--negative'
				: s.difference > 0
					? 'shifts-page__diff--positive'
					: ''
			: ''

	return (
		<div className='shifts-page__card'>
			<div className='shifts-page__card-header'>
				<div>
					<span
						className='dashboard__badge dashboard__badge--closed'
						style={{ marginRight: 8 }}
					>
						Cerrado
					</span>
					<span className='shifts-page__card-date'>
						{new Date(s.openingTime).toLocaleDateString()} ·{' '}
						{new Date(s.openingTime).toLocaleTimeString()} —{' '}
						{new Date(s.closingTime).toLocaleTimeString()}
					</span>
				</div>
			</div>
			<div className='shifts-page__stats'>
				<div className='shifts-page__stat'>
					Ventas:{' '}
					<span className='shifts-page__stat-value'>
						{s.sales?.length ?? 0}
					</span>
				</div>
				<div className='shifts-page__stat'>
					Total ventas:{' '}
					<span className='shifts-page__stat-value'>
						$
						{s.sales
							?.reduce((sum, x) => sum + x.total, 0)
							.toLocaleString() ?? 0}
					</span>
				</div>
				<div className='shifts-page__stat'>
					Apertura:{' '}
					<span className='shifts-page__stat-value'>
						${s.openingCash?.toLocaleString() ?? 0}
					</span>
				</div>
				<div className='shifts-page__stat'>
					Cierre:{' '}
					<span className='shifts-page__stat-value'>
						${s.closingCash?.toLocaleString() ?? '—'}
					</span>
				</div>
				<div className='shifts-page__stat'>
					Esperado:{' '}
					<span className='shifts-page__stat-value'>
						${s.expectedBalance?.toLocaleString() ?? '—'}
					</span>
				</div>
				<div className='shifts-page__stat'>
					Diferencia:{' '}
					<span className={`shifts-page__stat-value ${diffClass}`}>
						{s.difference != null
							? `$${s.difference.toLocaleString()}`
							: '—'}
					</span>
				</div>
			</div>
			{s.notes && (
				<div
					style={{ color: '#8e8e8e', fontSize: '0.85em', marginTop: 8 }}
				>
					Notas: {s.notes}
				</div>
			)}

			{s.sales?.length > 0 && (
				<div className='shifts-page__toggle' onClick={onToggle}>
					{isExpanded
						? 'Ocultar ventas'
						: `Ver ${s.sales.length} ventas`}
				</div>
			)}

			{isExpanded && (
				<div className='shifts-page__sales-wrap'>
					<table className='shifts-page__sales-table'>
						<thead>
							<tr>
								<th>Producto</th>
								<th>Cant.</th>
								<th>P. Unit.</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{s.sales.map((sale, i) => (
								<tr key={i}>
									<td>{getProductName(sale.productId)}</td>
									<td>{sale.quantity}</td>
									<td>${sale.unitPrice?.toLocaleString()}</td>
									<td>${sale.total?.toLocaleString()}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}
