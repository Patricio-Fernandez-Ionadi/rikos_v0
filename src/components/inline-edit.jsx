import { useState } from 'react'

/**
 * Click-to-edit inline field.
 * `simple` mode: click on value → input. Blur/Escape cancels, Enter saves.
 *
 * @param {Object}   props
 * @param {string|number} props.value       Current display value
 * @param {Function} props.onSave           Called with parsed value
 * @param {Function} [props.renderValue]    Custom render for display value
 * @param {string}   [props.type='number']  Input type
 * @param {string}   [props.suffix]         Suffix after the input (e.g. 'g', 'u')
 * @param {boolean}  [props.simple]         Click-on-value mode (no button)
 * @param {string}   [props.className]      Class on the wrapper
 */
export const InlineEdit = ({
	value,
	onSave,
	renderValue,
	type = 'number',
	suffix,
	simple,
	className = '',
}) => {
	const [editing, setEditing] = useState(false)
	const [editValue, setEditValue] = useState('')

	const handleStart = () => {
		setEditValue(String(value ?? ''))
		setEditing(true)
	}

	const commit = () => {
		const parsed = type === 'number' ? Number(editValue) : editValue
		if (!isNaN(parsed) && parsed >= 0) {
			onSave(parsed)
		}
		setEditing(false)
	}

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') commit()
		if (e.key === 'Escape') setEditing(false)
	}

	if (editing) {
		return (
			<span className={`inline-edit ${className}`.trim()}>
				<input
					className='field-input field-input--xs'
					type={type}
					value={editValue}
					onChange={(e) => setEditValue(e.target.value)}
					onBlur={commit}
					onKeyDown={handleKeyDown}
					autoFocus
				/>
				{suffix && <span className='inline-edit__suffix'>{suffix}</span>}
			</span>
		)
	}

	return (
		<span className={`inline-edit ${className}${simple ? ' inline-edit--clickable' : ''}`.trim()}
			onClick={simple ? handleStart : undefined}
			role={simple ? 'button' : undefined}
			tabIndex={simple ? 0 : undefined}
			onKeyDown={simple ? (e) => { if (e.key === 'Enter') handleStart() } : undefined}
		>
			{renderValue ? renderValue(value) : value}
		</span>
	)
}
