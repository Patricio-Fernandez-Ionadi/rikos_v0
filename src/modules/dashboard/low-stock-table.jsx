import { useData } from '../../app/data-context.jsx'

/**
 * Table showing presentations with low stock (≤5 units, up to 10).
 */
export const LowStockTable = () => {
	const { products, presentations } = useData()

	const lowStock = presentations.filter(
		(p) => (p.stock ?? 0) > 0 && p.stock <= 5,
	)

	if (lowStock.length === 0) return null

	return (
		<>
			<h3 className='dashboard__section-title'>
				Stock bajo (≤5 unidades)
			</h3>
			<div className='dashboard__table-wrap'>
				<table className='dashboard__table'>
				<thead>
					<tr>
						<th>Producto</th>
						<th>Presentación</th>
						<th>Stock</th>
					</tr>
				</thead>
				<tbody>
					{lowStock.slice(0, 10).map((pres) => {
						const prod = products.find(
							(p) => p._id === pres.productId,
						)
						return (
							<tr key={pres._id}>
								<td>{prod?.name ?? '—'}</td>
								<td>{pres.label}</td>
								<td>
									<span className='dashboard__badge dashboard__badge--low'>
										{pres.stock}
									</span>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
			</div>
		</>
	)
}
