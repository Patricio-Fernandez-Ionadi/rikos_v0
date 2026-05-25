import { useShift } from '../../context/ShiftContext.jsx'
import { ShiftSalesList } from './shift-sales-list.jsx'

/**
 * Displays the active shift card with its stats (opening time, cash,
 * sales count, total, expected balance), sync/close action buttons,
 * and the embedded ShiftSalesList.
 *
 * @param {Object}     props
 * @param {Function}   props.onRequestClose  Callback when user clicks "Cerrar Turno"
 */
export const ActiveShiftCard = ({ onRequestClose }) => {
	const { shift, synced, syncToDb } = useShift()

	return (
		<div className='shifts-page__card'>
			<div className='shifts-page__card-header'>
				<span className='dashboard__badge dashboard__badge--open'>
					Turno activo
				</span>
				<div style={{ display: 'flex', gap: '6px' }}>
					{!synced && (
						<button className='shift-bar__btn' onClick={() => syncToDb()}>
							Sincronizar
						</button>
					)}
					<button
						className='shift-bar__btn shift-bar__btn--danger'
						onClick={onRequestClose}
					>
						Cerrar Turno
					</button>
				</div>
			</div>
			<div className='shifts-page__stats'>
				<div className='shifts-page__stat'>
					Apertura:{' '}
					<span className='shifts-page__stat-value'>
						{new Date(shift.openingTime).toLocaleString()}
					</span>
				</div>
				<div className='shifts-page__stat'>
					Efectivo inicial:{' '}
					<span className='shifts-page__stat-value'>
						${shift.openingCash.toLocaleString()}
					</span>
				</div>
				<div className='shifts-page__stat'>
					Ventas:{' '}
					<span className='shifts-page__stat-value'>
						{shift.sales.length}
					</span>
				</div>
				<div className='shifts-page__stat'>
					Total:{' '}
					<span className='shifts-page__stat-value'>
						$
						{shift.sales
							.reduce((s, x) => s + x.total, 0)
							.toLocaleString()}
					</span>
				</div>
				<div className='shifts-page__stat'>
					Esperado:{' '}
					<span className='shifts-page__stat-value'>
						$
						{(
							shift.openingCash +
							shift.sales.reduce((s, x) => s + x.total, 0)
						).toLocaleString()}
					</span>
				</div>
			</div>
			<ShiftSalesList />
		</div>
	)
}
