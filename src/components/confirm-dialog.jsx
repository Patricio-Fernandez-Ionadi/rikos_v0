import { Modal } from './modal.jsx'
import { Button } from './button.jsx'

/**
 * Confirmation dialog replacing window.confirm().
 *
 * @param {Object}   props
 * @param {boolean}  props.open
 * @param {Function} props.onClose
 * @param {Function} props.onConfirm
 * @param {string}   [props.title='Confirmar']
 * @param {string}   [props.message='¿Estás seguro?']
 * @param {string}   [props.confirmLabel='Confirmar']
 * @param {'primary'|'danger'} [props.confirmVariant='danger']
 */
export const ConfirmDialog = ({
	open,
	onClose,
	onConfirm,
	title = 'Confirmar',
	message = '¿Estás seguro?',
	confirmLabel = 'Confirmar',
	confirmVariant = 'danger',
}) => {
	return (
		<Modal open={open} onClose={onClose} title={title}>
			<p style={{ color: '#e0e0e0', margin: '12px 0' }}>{message}</p>
			<div className='modal-actions'>
				<Button onClick={onClose}>Cancelar</Button>
				<Button variant={confirmVariant} onClick={onConfirm}>
					{confirmLabel}
				</Button>
			</div>
		</Modal>
	)
}
