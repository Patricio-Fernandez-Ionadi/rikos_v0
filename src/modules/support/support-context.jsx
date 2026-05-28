/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react'
import * as supportService from './services/support-services.js'

export const SupportContext = createContext(null)

export function SupportProvider({ children }) {
	const [notes, setNotes] = useState([])
	const [text, setText] = useState('')
	const [type, setType] = useState('sugerencia')

	useEffect(() => {
		supportService.getNotes().then(setNotes)
	}, [])

	const handleSubmit = useCallback(async (e) => {
		e.preventDefault()
		if (!text.trim()) return

		const created = await supportService.createNote({ type, text: text.trim() })
		if (created) {
			setNotes((prev) => [created, ...prev])
		}
		setText('')
	}, [type, text])

	const handleDelete = useCallback(async (id) => {
		if (!window.confirm('¿Eliminar esta nota?')) return
		try {
			await supportService.deleteNote(id)
			setNotes((prev) => prev.filter((n) => n._id !== id))
		} catch { /* keep note in list if delete fails */ }
	}, [])

	return (
		<SupportContext.Provider value={{ notes, text, setText, type, setType, handleSubmit, handleDelete }}>
			{children}
		</SupportContext.Provider>
	)
}
