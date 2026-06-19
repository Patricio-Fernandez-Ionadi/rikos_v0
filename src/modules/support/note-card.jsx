import { useSupport } from './support-manager.js'
import { DottedMenu } from '../../components/dotted-menu.jsx'

const STATUS_LABELS = {
	resolved: 'Finalizada',
	suppressed: 'Suprimida',
}

export const NoteCard = ({ note }) => {
	const { handleStatusChange } = useSupport()

	const actions = []
	if (note.status === 'active') {
		actions.push(
			{ label: 'Finalizar', onClick: () => handleStatusChange(note._id, 'resolved') },
			{ label: 'Suprimir', onClick: () => handleStatusChange(note._id, 'suppressed'), danger: true },
		)
	} else {
		actions.push(
			{ label: 'Reabrir', onClick: () => handleStatusChange(note._id, 'active') },
		)
	}

	return (
		<div className={`soporte-card soporte-card--${note.type} soporte-card--${note.status || 'active'}`}>
			<div className='soporte-card__header'>
				<span className={`soporte-card__badge soporte-card__badge--${note.type}`}>
					{note.type === 'bug' ? 'Error' : note.type === 'sugerencia' ? 'Sugerencia' : 'Otro'}
				</span>
				{note.status && note.status !== 'active' && (
					<span className={`soporte-card__status soporte-card__status--${note.status}`}>
						{STATUS_LABELS[note.status] || note.status}
					</span>
				)}
				<span className='soporte-card__date'>
					{new Date(note.createdAt).toLocaleString()}
				</span>
				<DottedMenu items={actions} />
			</div>
			<p className='soporte-card__text'>{note.text}</p>
		</div>
	)
}
