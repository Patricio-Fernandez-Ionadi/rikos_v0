import { Link } from 'react-router-dom'
import { useData } from '../../app/data-context.jsx'
import { useShift } from '../../modules/shift/shift-context.jsx'

/**
 * Grid of summary cards linking to main sections.
 * Each card shows a title, description, and key metric.
 */
export const DashboardCards = () => {
	const { categories, products, presentations } = useData()
	const { shift } = useShift()

	const totalProducts = products.length
	const totalCategories = categories.length
	const totalPresentations = presentations.length
	const withStock = presentations.filter((p) => (p.stock ?? 0) > 0).length
	const activeSales = shift?.sales?.length ?? 0
	const activeTotal = shift?.sales?.reduce((s, x) => s + x.total, 0) ?? 0

	return (
		<div className='dashboard__grid'>
			<Link to='/products' className='dashboard__card'>
				<h3 className='dashboard__card-title'>Productos</h3>
				<p className='dashboard__card-desc'>
					Gestionar catálogo y precios
				</p>
				<p className='dashboard__card-value'>{totalProducts}</p>
			</Link>

			<Link to='/stock' className='dashboard__card'>
				<h3 className='dashboard__card-title'>Stock</h3>
				<p className='dashboard__card-desc'>Control de inventario</p>
				<p className='dashboard__card-value'>{withStock}</p>
			</Link>

			<Link to='/shifts' className='dashboard__card'>
				<h3 className='dashboard__card-title'>Turnos</h3>
				<p className='dashboard__card-desc'>
					{shift
						? `Turno activo · ${activeSales} ventas`
						: 'Historial de turnos'}
				</p>
				<p className='dashboard__card-value'>
					{shift ? `$${activeTotal.toLocaleString()}` : '—'}
				</p>
			</Link>

			<div className='dashboard__card' style={{ cursor: 'default' }}>
				<h3 className='dashboard__card-title'>Categorías</h3>
				<p className='dashboard__card-desc'>Total en el catálogo</p>
				<p className='dashboard__card-value'>{totalCategories}</p>
			</div>

			<div className='dashboard__card' style={{ cursor: 'default' }}>
				<h3 className='dashboard__card-title'>Presentaciones</h3>
				<p className='dashboard__card-desc'>Variantes de producto</p>
				<p className='dashboard__card-value'>{totalPresentations}</p>
			</div>
		</div>
	)
}
