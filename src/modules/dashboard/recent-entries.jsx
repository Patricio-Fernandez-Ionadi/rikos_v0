import { useNavigate } from 'react-router-dom'
import { useData } from '../../app/data-context.jsx'

/**
 * Gets the first presentation's sale price for a product, or null.
 */
function getSalePrice(product, presentations) {
	const pres = presentations.find((p) => p.productId === product._id)
	return pres?.salePrice ?? null
}

/**
 * Lists the 10 most recently created products (sorted by _id descending).
 */
export const RecentEntries = () => {
	const navigate = useNavigate()
	const { categories, products, presentations } = useData()

	const recent = [...products]
		.sort((a, b) => (b._id > a._id ? 1 : -1))
		.slice(0, 10)

	return (
		<>
			<h3 className='dashboard__section-title'>Últimos ingresos</h3>
			<div className='dashboard__table-wrap'>
				<table className='dashboard__table'>
					<thead>
						<tr>
							<th>Producto</th>
							<th className='dashboard__th--desktop'>Categoría</th>
							<th className='dashboard__th--desktop'>Marca</th>
							<th className='dashboard__th--desktop'>Costo</th>
							<th>Precio venta</th>
						</tr>
					</thead>
					<tbody>
						{recent.map((p) => {
							const cat = categories.find((c) => c._id === p.categoryId)
							const price = getSalePrice(p, presentations)
							return (
								<tr
									key={p._id}
									className='dashboard__row--clickable'
									onClick={() => navigate(`/products/${p._id}`)}
								>
									<td>{p.name}</td>
									<td className='dashboard__td--desktop'>{cat?.name ?? '—'}</td>
									<td className='dashboard__td--desktop'>{p.marca || '—'}</td>
									<td className='dashboard__td--desktop'>{p.purchaseCost != null ? `$${p.purchaseCost.toLocaleString()}` : '—'}</td>
									<td>{price != null ? `$${price.toLocaleString()}` : '—'}</td>
								</tr>
							)
						})}
						{recent.length === 0 && (
							<tr>
								<td colSpan={5} style={{ color: '#616161' }}>
									No hay productos cargados
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</>
	)
}
