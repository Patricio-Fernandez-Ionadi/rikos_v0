import { useCatalog } from '../../app/catalog-context.jsx'
import { DataTable } from '../../components/data-table.jsx'

/**
 * Table showing presentations with low stock (≤5 units, up to 10).
 */
export const LowStockTable = () => {
	const { products, presentations } = useCatalog()

	const lowStock = presentations.filter(
		(p) => (p.stock ?? 0) > 0 && p.stock <= 5,
	)

	if (lowStock.length === 0) return null

	const columns = [
		{ key: 'product', label: 'Producto' },
		{ key: 'pres', label: 'Presentación' },
		{ key: 'stock', label: 'Stock' },
	]

	return (
		<>
			<h3 className='dashboard__section-title'>
				Stock bajo (≤5 unidades)
			</h3>
			<DataTable
				variant='dashboard'
				columns={columns}
				rows={lowStock.slice(0, 10)}
				renderRow={(pres) => {
					const prod = products.find((p) => p._id === pres.productId)
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
				}}
			/>
		</>
	)
}
