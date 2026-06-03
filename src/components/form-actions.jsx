import { Button } from './button.jsx'

/**
 * Standard form action buttons (Cancel + Submit).
 *
 * @param {Object}   props
 * @param {string}   [props.submitLabel='Guardar']
 * @param {string}   [props.cancelLabel='Cancelar']
 * @param {'primary'|'danger'} [props.submitVariant='primary']
 * @param {Function} [props.onCancel]
 * @param {Function} [props.onSubmit]
 * @param {boolean}  [props.submitDisabled]
 * @param {boolean}  [props.hideCancel=false]
 */
export const FormActions = ({
	submitLabel = 'Guardar',
	cancelLabel = 'Cancelar',
	submitVariant = 'primary',
	onCancel,
	onSubmit,
	submitDisabled,
	hideCancel = false,
}) => {
	return (
		<div className='modal-actions'>
			{!hideCancel && <Button onClick={onCancel}>{cancelLabel}</Button>}
			<Button
				variant={submitVariant}
				onClick={onSubmit}
				disabled={submitDisabled}
				type={onSubmit ? 'button' : 'submit'}
			>
				{submitLabel}
			</Button>
		</div>
	)
}
