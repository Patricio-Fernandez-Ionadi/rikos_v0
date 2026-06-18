import { useState, useEffect } from 'react'
import { useShift } from '../../modules/shifts/shift-context.jsx'
import { ActiveShiftCard } from '../../modules/shifts/active-shift-card.jsx'
import { PastShiftCard } from '../../modules/shifts/past-shift-card.jsx'
import { OpenShiftForm } from '../../modules/shifts/open-shift-form.jsx'
import { CloseShiftForm } from '../../modules/shifts/close-shift-form.jsx'
import * as shiftService from '../../modules/shifts/services/shift-services.js'

/**
 * Shifts page — shows the active shift and past shift history.
 */
export const ShiftsPage = () => {
	const { shift } = useShift()
	const [pastShifts, setPastShifts] = useState([])
	const [expanded, setExpanded] = useState(null)
	const [showOpen, setShowOpen] = useState(false)
	const [showClose, setShowClose] = useState(false)

	useEffect(() => {
		shiftService
			.getShifts()
			.then((list) => {
				setPastShifts(list.filter((s) => s.status === 'closed'))
			})
			.catch(() => {})
	}, [shift])

	return (
		<div className='shifts-page'>
			<h2 className='shifts-page__title'>Turnos</h2>

			{!shift ? (
				<div className='shifts-page__card shifts-page__card--empty'>
					<p className='shifts-page__empty-text'>No hay turno activo</p>
					<button
						className='btn btn--primary'
						onClick={() => setShowOpen(true)}
					>
						Abrir Turno
					</button>
				</div>
			) : (
				<>
					<ActiveShiftCard onRequestClose={() => setShowClose(true)} />
					<CloseShiftForm
						open={showClose}
						onClose={() => setShowClose(false)}
					/>
				</>
			)}

			<OpenShiftForm
				open={showOpen}
				onClose={() => setShowOpen(false)}
				defaultOpeningCash={pastShifts[0]?.closingCash ?? ''}
			/>

			<h3 className='text-white' style={{ margin: '24px 0 12px' }}>
				Turnos anteriores
			</h3>

			{pastShifts.length === 0 && (
				<p className='placeholder text-muted text-center p-16'>
					No hay turnos anteriores registrados
				</p>
			)}

			{pastShifts.map((s) => (
				<PastShiftCard
					key={s._id}
					shift={s}
					isExpanded={expanded === s._id}
					onToggle={() => setExpanded(expanded === s._id ? null : s._id)}
				/>
			))}
		</div>
	)
}
