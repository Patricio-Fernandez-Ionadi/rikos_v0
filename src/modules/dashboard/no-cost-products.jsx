import { useData } from '../../app/data-context.jsx'

/**
 * Table listing products without a purchase cost (up to 10).
 */
export const NoCostProducts = () => {
	const { categories, products } = useData()

	const noCost = products.filter((p) => p.purchaseCost == null)

	return (
		<>
			<h3 className='dashboard__section-title'>
				Productos sin costo
			</h3>
			<table className='dashboard__table'>
				<thead>
					<tr>
						<th>Producto</th>
						<th>Categoría</th>
					</tr>
				</thead>
				<tbody>
					{noCost.slice(0, 10).map((p) => {
						const cat = categories.find(
							(c) => c._id === p.categoryId,
						)
						return (
							<tr key={p._id}>
								<td>{p.name}</td>
								<td>{cat?.name ?? '—'}</td>
							</tr>
						)
					})}
					{noCost.length === 0 && (
						<tr>
							<td colSpan={2} style={{ color: '#616161' }}>
								Todos los productos tienen costo cargado
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</>
	)
}
