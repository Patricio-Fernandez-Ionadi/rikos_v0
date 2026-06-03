import { useSupport } from './support-manager.js'
import { Button } from '../../components/button.jsx'

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
				<Button size='xs' variant='danger' onClick={() => handleDelete(note._id)}>✕</Button>
			</div>
			<p className='soporte-card__text'>{note.text}</p>
		</div>
	)
}
