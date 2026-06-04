import { useNavigate } from 'react-router-dom'
import { useCatalog } from '../../app/catalog-context.jsx'
import { DataTable } from '../../components/data-table.jsx'

/**
 * Table listing products whose presentations all lack a sale price (up to 10).
 */
export const NoSalePriceProducts = () => {
	const navigate = useNavigate()
	const { categories, products, presentations } = useCatalog()

	const noPrice = products.filter((p) => {
		const pres = presentations.filter((pr) => pr.productId === p._id)
		return pres.length > 0 && pres.every((pr) => pr.salePrice == null)
	})

	const columns = [
		{ key: 'name', label: 'Producto' },
		{ key: 'cat', label: 'Categoría', className: 'dashboard__th--desktop' },
	]

	return (
		<>
			<h3 className='dashboard__section-title'>
				Productos sin precio de venta
			</h3>
			<DataTable
				variant='dashboard'
				columns={columns}
				rows={noPrice.slice(0, 10)}
				emptyMessage='Todos los productos tienen precio de venta cargado'
				renderRow={(p) => {
					const cat = categories.find((c) => c._id === p.categoryId)
					return (
						<tr
							key={p._id}
							className='dashboard__row--clickable'
							onClick={() => navigate(`/products/${p._id}`)}
						>
							<td>{p.name}</td>
							<td className='dashboard__td--desktop'>{cat?.name ?? '—'}</td>
						</tr>
					)
				}}
			/>
			{noPrice.length > 10 && (
				<p className='dashboard__see-all'>
					<a href='/alerts/no-sale-price'>Ver todos ({noPrice.length})</a>
				</p>
			)}
		</>
	)
}
