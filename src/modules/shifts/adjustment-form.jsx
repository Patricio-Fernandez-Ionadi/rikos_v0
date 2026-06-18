import { useState } from 'react'
import { useShift } from './shift-context.jsx'
import { FormActions } from '../../components/form-actions.jsx'

/**
 * Inline form to add an adjustment (expense, withdrawal, adjustment)
 * to the active shift.
 *
 * @param {Object}     props
 * @param {Function}   props.onClose  Callback to close/collapse the form
 */
export const AdjustmentForm = ({ onClose }) => {
	const { addAdjustment } = useShift()
	const [amount, setAmount] = useState('')
	const [type, setType] = useState('expense')
	const [description, setDescription] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		const val = parseFloat(amount)
		if (isNaN(val) || val <= 0) return
		await addAdjustment({ amount: val, type, description })
		setAmount('')
		setDescription('')
		onClose?.()
	}

	return (
		<form className='shift-adjustments__form' onSubmit={handleSubmit}>
			<select
				className='field-input'
				value={type}
				onChange={(e) => setType(e.target.value)}
			>
				<option value='expense'>Gasto</option>
				<option value='withdrawal'>Retiro</option>
				<option value='adjustment'>Ajuste</option>
			</select>
			<input
				className='field-input'
				type='number'
				step='0.01'
				placeholder='Monto $'
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
				autoFocus
			/>
			<input
				className='field-input'
				type='text'
				placeholder='Descripción (opcional)'
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<FormActions
				onCancel={onClose}
				submitLabel='Agregar'
			/>
		</form>
	)
}
