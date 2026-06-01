import { useState, useEffect } from 'react'
import { Modal } from '../../components/Modal.jsx'
import { useShift } from '../../modules/shift/shift-context.jsx'

/**
 * Modal form to open a new shift. Manages its own cash input state
 * and calls openShift from ShiftContext on submit. Defaults to the
 * previous shift's closing cash, editable by the user.
 *
 * @param {Object}     props
 * @param {boolean}    props.open                Whether the modal is visible
 * @param {Function}   props.onClose             Callback to close the modal
 * @param {number|string} props.defaultOpeningCash  Suggested opening cash (previous closing)
 */
export const OpenShiftForm = ({ open, onClose, defaultOpeningCash = '' }) => {
	const { openShift } = useShift()
	const [openingCash, setOpeningCash] = useState(defaultOpeningCash)

	useEffect(() => {
		if (open) setOpeningCash(defaultOpeningCash)
	}, [open, defaultOpeningCash])

	const handleOpen = async () => {
		const cash = parseFloat(openingCash)
		if (isNaN(cash) || cash < 0) return
		await openShift(cash)
		setOpeningCash('')
		onClose()
	}

	return (
		<Modal open={open} onClose={onClose} title='Abrir Turno'>
			<label className='field-label'>Efectivo inicial ($)</label>
			<input
				className='field-input'
				type='number'
				value={openingCash}
				onChange={(e) => setOpeningCash(e.target.value)}
				autoFocus
			/>
			<div className='modal-actions'>
				<button className='shift-bar__btn' onClick={onClose}>
					Cancelar
				</button>
				<button
					className='shift-bar__btn shift-bar__btn--primary'
					onClick={handleOpen}
				>
					Abrir
				</button>
			</div>
		</Modal>
	)
}
