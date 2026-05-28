import { useSupport } from './support-manager.js'

export const NoteCard = ({ note }) => {
	const { handleDelete } = useSupport()

	return (
		<div className={`soporte-card soporte-card--${note.type}`}>
			<div className='soporte-card__header'>
				<span className={`soporte-card__badge soporte-card__badge--${note.type}`}>
					{note.type === 'bug' ? 'Error' : note.type === 'sugerencia' ? 'Sugerencia' : 'Otro'}
				</span>
				<span className='soporte-card__date'>
					{new Date(note.createdAt).toLocaleString()}
				</span>
				<button
					className='sidebar__btn sidebar__btn--xs sidebar__btn--danger'
					onClick={() => handleDelete(note._id)}
				>
					X
				</button>
			</div>
			<p className='soporte-card__text'>{note.text}</p>
		</div>
	)
}
