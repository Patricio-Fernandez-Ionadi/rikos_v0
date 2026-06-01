import { useState } from 'react'
import { Modal } from '../../components/Modal.jsx'
import { useShift } from '../../modules/shift/shift-context.jsx'

/**
 * Modal form to close the active shift. Manages its own closing cash,
 * notes, and error state, and calls closeShift from ShiftContext on submit.
 * Shows the adjusted expected balance (openingCash + cashSales - adjustments).
 *
 * @param {Object}     props
 * @param {boolean}    props.open     Whether the modal is visible
 * @param {Function}   props.onClose  Callback to close the modal
 */
export const CloseShiftForm = ({ open, onClose }) => {
	const { shift, closeShift } = useShift()
	const [closingCash, setClosingCash] = useState('')
	const [closingNotes, setClosingNotes] = useState('')
	const [closeError, setCloseError] = useState('')

	const cashSalesTotal = (shift?.sales ?? [])
		.filter((s) => !s.paymentMethod || s.paymentMethod === 'cash')
		.reduce((sum, s) => sum + (s.collectedAmount ?? s.total), 0)
	const adjustmentsTotal = (shift?.adjustments ?? []).reduce((sum, a) => sum + a.amount, 0)
	const expectedBalance = +(shift?.openingCash ?? 0) + cashSalesTotal - adjustmentsTotal

	const handleClose = async () => {
		const cash = parseFloat(closingCash)
		if (isNaN(cash) || cash < 0) return
		setCloseError('')
		const result = await closeShift(cash, closingNotes)
		if (result?.error) {
			setCloseError(result.error)
			return
		}
		setClosingCash('')
		setClosingNotes('')
		onClose()
	}

	return (
		<Modal open={open} onClose={onClose} title='Cerrar Turno'>
			{closeError && <p className='field-error'>{closeError}</p>}
			<div className='shifts-page__stats' style={{ marginBottom: 12 }}>
				<div className='shifts-page__stat'>
					Esperado en caja:{' '}
					<span className='shifts-page__stat-value'>
						${expectedBalance.toLocaleString()}
					</span>
				</div>
			</div>
			<label className='field-label'>Efectivo final ($)</label>
			<input
				className='field-input'
				type='number'
				value={closingCash}
				onChange={(e) => setClosingCash(e.target.value)}
				autoFocus
			/>
			<label className='field-label'>Notas (opcional)</label>
			<textarea
				className='field-input'
				value={closingNotes}
				onChange={(e) => setClosingNotes(e.target.value)}
				rows={2}
			/>
			<div className='modal-actions'>
				<button className='shift-bar__btn' onClick={onClose}>
					Cancelar
				</button>
				<button
					className='shift-bar__btn shift-bar__btn--danger'
					onClick={handleClose}
				>
					Cerrar
				</button>
			</div>
		</Modal>
	)
}
