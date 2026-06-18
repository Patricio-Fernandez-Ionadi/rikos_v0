import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShift } from './shift-context.jsx'
import { AdjustmentForm } from './adjustment-form.jsx'
import { SalesList } from './sales/sales-list.jsx'
import { Button } from '../../components/button.jsx'

/**
 * Displays the active shift card with its stats (opening time, cash,
 * sales count, total, expected balance), sync/close action buttons,
 * adjustments list/add form, and the embedded ShiftSalesList.
 *
 * @param {Object}     props
 * @param {Function}   props.onRequestClose  Callback when user clicks "Cerrar Turno"
 */
export const ActiveShiftCard = ({ onRequestClose }) => {
	const { shift } = useShift()
	const navigate = useNavigate()
	const [showAdjustmentForm, setShowAdjustmentForm] = useState(false)

	const adjustments = shift.adjustments ?? []
	const adjustmentsTotal = adjustments.reduce((sum, a) => sum + a.amount, 0)

	const typeLabel = {
		expense: 'Gasto',
		withdrawal: 'Retiro',
		adjustment: 'Ajuste',
	}

	return (
		<div className='shifts-page__card'>
			<div className='shifts-page__card-header'>
				<span className='dashboard__badge dashboard__badge--open'>
					Turno activo
				</span>
				<div className='shifts-page__card-actions'>
					<Button variant='primary' onClick={() => navigate('/shifts/sale')}>
						+ Registrar Venta
					</Button>
					<Button onClick={() => setShowAdjustmentForm(!showAdjustmentForm)}>
						{showAdjustmentForm ? 'Cancelar' : '+ Ajuste'}
					</Button>
					<Button variant='danger' onClick={onRequestClose}>
						Cerrar Turno
					</Button>
				</div>
			</div>

			{showAdjustmentForm && (
				<AdjustmentForm onClose={() => setShowAdjustmentForm(false)} />
			)}

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
					<span className='shifts-page__stat-value'>{shift.sales.length}</span>
				</div>
				<div className='shifts-page__stat'>
					Clientes:{' '}
					<span className='shifts-page__stat-value'>
						{new Set(shift.sales.map((s) => s.ticketId || s._tempId)).size}
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
									$
									{(
										shift.openingCash +
										cashTotal -
										adjustmentsTotal
									).toLocaleString()}
								</span>
							</div>
						</>
					)
				})()}
			</div>

			{adjustments.length > 0 && (
				<div className='shift-adjustments'>
					<h4 className='shift-adjustments__title'>Ajustes</h4>
					{adjustments.map((adj, i) => (
						<div
							key={adj._tempId ?? adj._id ?? i}
							className='shift-adjustments__item'
						>
							<span className='shift-adjustments__type'>
								{typeLabel[adj.type] ?? adj.type}
							</span>
							<span className='shift-adjustments__desc'>{adj.description}</span>
							<span className='shift-adjustments__amount'>
								-${adj.amount.toLocaleString()}
							</span>
						</div>
					))}
				</div>
			)}

			<SalesList />
		</div>
	)
}
