import { useState } from 'react'
import { Button } from './button.jsx'

/**
 * Click-to-edit inline field.
 * Shows value; clicking enters edit mode with an input + OK/Cancel.
 *
 * @param {Object}   props
 * @param {string|number} props.value       Current display value
 * @param {Function} props.onSave           Called with the new value
 * @param {Function} [props.renderValue]    Custom render for the display value
 * @param {string}   [props.type='number']  Input type
 * @param {string}   [props.suffix]         Suffix after the input (e.g. 'g', 'u')
 */
export const InlineEdit = ({
	value,
	onSave,
	renderValue,
	type = 'number',
	suffix,
}) => {
	const [editing, setEditing] = useState(false)
	const [editValue, setEditValue] = useState('')

	const handleStart = () => {
		setEditValue(String(value ?? ''))
		setEditing(true)
	}

	const handleSave = () => {
		onSave(editValue)
		setEditing(false)
	}

	const handleCancel = () => {
		setEditing(false)
	}

	if (editing) {
		return (
			<span className='inline-edit'>
				<input
					className='field-input field-input--xs'
					type={type}
					value={editValue}
					onChange={(e) => setEditValue(e.target.value)}
					autoFocus
				/>
				{suffix && <span className='inline-edit__suffix'>{suffix}</span>}
				<Button size='xs' onClick={handleSave}>OK</Button>
				<Button size='xs' onClick={handleCancel}>✕</Button>
			</span>
		)
	}

	return (
		<span className='inline-edit'>
			{renderValue ? renderValue(value) : value}
			<Button size='xs' onClick={handleStart}>Ajustar</Button>
		</span>
	)
}
