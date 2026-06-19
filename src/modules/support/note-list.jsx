import { useSupport } from './support-manager.js'
import { NoteCard } from './note-card.jsx'

const TABS = [
	{ key: 'active', label: 'Activas' },
	{ key: 'resolved', label: 'Finalizadas' },
	{ key: 'suppressed', label: 'Suprimidas' },
]

export const NoteList = () => {
	const { notes, filter, setFilter, filteredNotes } = useSupport()

	const counts = {}
	for (const tab of TABS) {
		counts[tab.key] = notes.filter((n) => n.status === tab.key || (!n.status && tab.key === 'active')).length
	}

	return (
		<>
			<div className='soporte-tabs'>
				{TABS.map((tab) => (
					<button
						key={tab.key}
						className={`soporte-tabs__tab${filter === tab.key ? ' soporte-tabs__tab--active' : ''}`}
						onClick={() => setFilter(tab.key)}
						type='button'
					>
						{tab.label}
						<span className='soporte-tabs__count'>{counts[tab.key]}</span>
					</button>
				))}
			</div>

			{filteredNotes.length === 0 ? (
				<p className='placeholder text-muted'>
					No hay notas {filter === 'active' ? 'activas' : filter === 'resolved' ? 'finalizadas' : 'suprimidas'}
				</p>
			) : (
				<div className='soporte-list'>
					{filteredNotes.map((note) => (
						<NoteCard key={note._id} note={note} />
					))}
				</div>
			)}
		</>
	)
}
