import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../../app/data-context.jsx'
import { useShift } from '../../modules/shift/shift-context.jsx'

/**
 * Grid of summary cards linking to main sections.
 * When a shift is open, a detailed card appears as the first item.
 */
export const DashboardCards = () => {
	const navigate = useNavigate()
	const { categories, products, presentations } = useData()
	const { shift } = useShift()

	const totalProducts = products.length
	const totalCategories = categories.length
	const totalPresentations = presentations.length
	const withStock = presentations.filter((p) => (p.stock ?? 0) > 0).length
	const activeSales = shift?.sales?.length ?? 0
	const activeTotal = shift?.sales?.reduce((s, x) => s + (x.collectedAmount ?? x.total), 0) ?? 0

	return (
		<div className='dashboard__grid'>
			{shift && (
				<a className='dashboard__card' onClick={() => navigate('/shifts')}>
					<h4 className='dashboard__card-title'>
						Turno activo
						<span className='dashboard__badge dashboard__badge--open' style={{ marginLeft: 8 }}>
							Abierto
						</span>
					</h4>
					<div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
						<div>
							<div className='dashboard__card-desc'>Ventas</div>
							<div className='dashboard__card-value' style={{ fontSize: 20 }}>{activeSales}</div>
						</div>
						<div>
							<div className='dashboard__card-desc'>Total</div>
							<div className='dashboard__card-value' style={{ fontSize: 20 }}>${activeTotal.toLocaleString()}</div>
						</div>
						<div>
							<div className='dashboard__card-desc'>Inicial</div>
							<div className='dashboard__card-value' style={{ fontSize: 20 }}>${shift.openingCash.toLocaleString()}</div>
						</div>
						<div>
							<div className='dashboard__card-desc'>Esperado</div>
							<div className='dashboard__card-value' style={{ fontSize: 20 }}>${(shift.openingCash + activeTotal).toLocaleString()}</div>
						</div>
					</div>
				</a>
			)}

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
						? 'Ir al turno activo'
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
