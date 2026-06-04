import { useNavigate } from 'react-router-dom'
import { useCatalog } from '../../app/catalog-context.jsx'
import { DataTable } from '../../components/data-table.jsx'

/**
 * Table listing products without a margin (up to 10).
 */
export const NoMarginProducts = () => {
	const navigate = useNavigate()
	const { categories, products } = useCatalog()

	const noMargin = products.filter((p) => p.margin == null)

	const columns = [
		{ key: 'name', label: 'Producto' },
		{ key: 'cat', label: 'Categoría', className: 'dashboard__th--desktop' },
	]

	return (
		<>
			<h3 className='dashboard__section-title'>
				Productos sin margen
			</h3>
			<DataTable
				variant='dashboard'
				columns={columns}
				rows={noMargin.slice(0, 10)}
				emptyMessage='Todos los productos tienen margen cargado'
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
			{noMargin.length > 10 && (
				<p className='dashboard__see-all'>
					<a href='/alerts/no-margin'>Ver todos ({noMargin.length})</a>
				</p>
			)}
		</>
	)
}
