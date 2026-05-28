import { useNavigate } from 'react-router-dom'
import { useShift } from '../../modules/shift/shift-context.jsx'
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
	const navigate = useNavigate()

	return (
		<div className='shifts-page__card'>
			<div className='shifts-page__card-header'>
				<span className='dashboard__badge dashboard__badge--open'>
					Turno activo
				</span>
				<div className='shifts-page__card-actions'>
					<button
						className='shift-bar__btn shift-bar__btn--primary'
						onClick={() => navigate('/shifts/sale')}
					>
						+ Registrar Venta
					</button>
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
					Items:{' '}
					<span className='shifts-page__stat-value'>
						{shift.sales.length}
					</span>
				</div>
				<div className='shifts-page__stat'>
					Clientes:{' '}
					<span className='shifts-page__stat-value'>
						{new Set(shift.sales.map(s => s.ticketId || s._tempId)).size}
					</span>
				</div>
				{(() => {
					const cashTotal = shift.sales
						.filter((s) => !s.paymentMethod || s.paymentMethod === 'cash')
						.reduce((s, x) => s + x.total, 0)
					const electronicTotal = shift.sales
						.filter((s) => s.paymentMethod === 'electronic')
						.reduce((s, x) => s + x.total, 0)
					const totalSales = cashTotal + electronicTotal
					return (
						<>
							<div className='shifts-page__stat'>
								Total efectivo:{' '}
								<span className='shifts-page__stat-value'>
									${cashTotal.toLocaleString()}
								</span>
							</div>
							<div className='shifts-page__stat'>
								Total electrónico:{' '}
								<span className='shifts-page__stat-value'>
									${electronicTotal.toLocaleString()}
								</span>
							</div>
							<div className='shifts-page__stat'>
								Total ventas:{' '}
								<span className='shifts-page__stat-value'>
									${totalSales.toLocaleString()}
								</span>
							</div>
							<div className='shifts-page__stat'>
								Esperado en caja:{' '}
								<span className='shifts-page__stat-value'>
									${(shift.openingCash + cashTotal).toLocaleString()}
								</span>
							</div>
						</>
					)
				})()}
			</div>
			<ShiftSalesList />
		</div>
	)
}
