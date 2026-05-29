import { useNavigate } from 'react-router-dom'
import { useShift } from '../../modules/shift/shift-context.jsx'

/**
 * Card for the active shift — shows sales count, total, opening cash,
 * expected balance, and status. Only renders when a shift is open.
 */
export const ActiveShiftSummary = () => {
	const navigate = useNavigate()
	const { shift } = useShift()

	if (!shift) return null

	const activeSales = shift.sales?.length ?? 0
	const activeTotal =
		shift.sales?.reduce((s, x) => s + (x.collectedAmount ?? x.total), 0) ?? 0

	const expected = shift.openingCash + activeTotal

	return (
		<a className='dashboard__card' onClick={() => navigate('/shifts')}>
			<h4 className='dashboard__card-title'>
				Turno activo
				<span className='dashboard__badge dashboard__badge--open' style={{ marginLeft: 8 }}>
					Abierto
				</span>
			</h4>
			<div style={{ display: 'flex', gap: 24, marginTop: 12, flexWrap: 'wrap' }}>
				<div>
					<div className='dashboard__card-desc'>Ventas</div>
					<div className='dashboard__card-value' style={{ fontSize: 22 }}>{activeSales}</div>
				</div>
				<div>
					<div className='dashboard__card-desc'>Total vendido</div>
					<div className='dashboard__card-value' style={{ fontSize: 22 }}>${activeTotal.toLocaleString()}</div>
				</div>
				<div>
					<div className='dashboard__card-desc'>Efectivo inicial</div>
					<div className='dashboard__card-value' style={{ fontSize: 22 }}>${shift.openingCash.toLocaleString()}</div>
				</div>
				<div>
					<div className='dashboard__card-desc'>Esperado</div>
					<div className='dashboard__card-value' style={{ fontSize: 22 }}>${expected.toLocaleString()}</div>
				</div>
			</div>
		</a>
	)
}
