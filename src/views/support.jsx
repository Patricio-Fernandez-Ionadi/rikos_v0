import { SupportProvider } from '../modules/support/support-manager.js'
import { NoteForm } from '../modules/support/note-form.jsx'
import { NoteList } from '../modules/support/note-list.jsx'

export const SoportePage = () => {
	return (
		<SupportProvider>
			<div className='soporte-page'>
				<h2 className='soporte-page__title'>Soporte</h2>
				<p className='soporte-page__desc'>
					Anotá sugerencias de cambios o reportes de error para revisarlos después.
				</p>
				<NoteForm />
				<NoteList />
			</div>
		</SupportProvider>
	)
}
