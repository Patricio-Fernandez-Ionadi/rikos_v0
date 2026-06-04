import { useNavigate } from 'react-router-dom'
import { useCatalog } from '../../app/catalog-context.jsx'
import { DataTable } from '../../components/data-table.jsx'

/**
 * Table listing products without a purchase cost (up to 10).
 */
export const NoCostProducts = () => {
	const navigate = useNavigate()
	const { categories, products } = useCatalog()

	const noCost = products.filter((p) => p.purchaseCost == null)

	const columns = [
		{ key: 'name', label: 'Producto' },
		{ key: 'cat', label: 'Categoría', className: 'dashboard__th--desktop' },
	]

	return (
		<>
			<h3 className='dashboard__section-title'>
				Productos sin costo
			</h3>
			<DataTable
				variant='dashboard'
				columns={columns}
				rows={noCost.slice(0, 10)}
				emptyMessage='Todos los productos tienen costo cargado'
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
			{noCost.length > 10 && (
				<p className='dashboard__see-all'>
					<a href='/alerts/no-cost'>Ver todos ({noCost.length})</a>
				</p>
			)}
		</>
	)
}
