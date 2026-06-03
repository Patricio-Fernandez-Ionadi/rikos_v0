import { useNavigate } from 'react-router-dom'
import { useCatalog } from '../../app/catalog-context.jsx'
import { DataTable } from '../../components/data-table.jsx'

/**
 * Lists the 10 most recently created products (sorted by _id descending).
 */
export const RecentEntries = () => {
	const navigate = useNavigate()
	const { categories, products, presentations } = useCatalog()

	const recent = [...products]
		.sort((a, b) => (b._id > a._id ? 1 : -1))
		.slice(0, 10)

	const columns = [
		{ key: 'name', label: 'Producto' },
		{ key: 'cat', label: 'Categoría', className: 'dashboard__th--desktop' },
		{ key: 'marca', label: 'Marca', className: 'dashboard__th--desktop' },
		{ key: 'cost', label: 'Costo', className: 'dashboard__th--desktop' },
		{ key: 'price', label: 'Precio venta' },
	]

	return (
		<>
			<h3 className='dashboard__section-title'>Últimos ingresos</h3>
			<DataTable
				variant='dashboard'
				columns={columns}
				rows={recent}
				emptyMessage='No hay productos cargados'
				renderRow={(p) => {
					const cat = categories.find((c) => c._id === p.categoryId)
					const pres = presentations.find((pr) => pr.productId === p._id)
					const price = pres?.salePrice ?? null
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
				}}
			/>
		</>
	)
}
