import { useSupport } from './support-manager.js'
import { NoteCard } from './note-card.jsx'

export const NoteList = () => {
	const { notes } = useSupport()

	if (notes.length === 0) {
		return (
			<p className='placeholder' style={{ color: '#616161', textAlign: 'center', padding: '40px' }}>
				No hay notas registradas
			</p>
		)
	}

	return (
		<div className='soporte-list'>
			{notes.map((note) => (
				<NoteCard key={note._id} note={note} />
			))}
		</div>
	)
}
