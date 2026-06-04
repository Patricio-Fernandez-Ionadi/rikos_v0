import { useNavigate } from 'react-router-dom'
import { useCatalog } from '../../app/catalog-context.jsx'
import { DataTable } from '../../components/data-table.jsx'

/**
 * Table listing products that have no presentations at all (up to 10).
 */
export const NoPresentationsProducts = () => {
	const navigate = useNavigate()
	const { categories, products, presentations } = useCatalog()

	const noPres = products.filter(
		(p) => !presentations.some((pr) => pr.productId === p._id),
	)

	const columns = [
		{ key: 'name', label: 'Producto' },
		{ key: 'cat', label: 'Categoría', className: 'dashboard__th--desktop' },
	]

	return (
		<>
			<h3 className='dashboard__section-title'>
				Productos sin presentaciones
			</h3>
			<DataTable
				variant='dashboard'
				columns={columns}
				rows={noPres.slice(0, 10)}
				emptyMessage='Todos los productos tienen presentaciones cargadas'
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
		</>
	)
}
