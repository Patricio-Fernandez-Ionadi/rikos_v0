import { useShift } from '../../modules/shift/shift-context.jsx'

/**
 * Summary table for the active shift — sales count, total, opening cash,
 * expected balance, and status badge.
 */
export const ActiveShiftSummary = () => {
	const { shift } = useShift()

	if (!shift) return null

	const activeSales = shift.sales?.length ?? 0
	const activeTotal =
		shift.sales?.reduce((s, x) => s + x.total, 0) ?? 0

	return (
		<>
			<h3 className='dashboard__section-title'>Turno activo</h3>
			<table className='dashboard__table'>
				<thead>
					<tr>
						<th>Ventas</th>
						<th>Total</th>
						<th>Efectivo inicial</th>
						<th>Esperado</th>
						<th>Estado</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{activeSales}</td>
						<td>${activeTotal.toLocaleString()}</td>
						<td>${shift.openingCash.toLocaleString()}</td>
						<td>
							$
							{(
								shift.openingCash + activeTotal
							).toLocaleString()}
						</td>
						<td>
							<span className='dashboard__badge dashboard__badge--open'>
								Abierto
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</>
	)
}
