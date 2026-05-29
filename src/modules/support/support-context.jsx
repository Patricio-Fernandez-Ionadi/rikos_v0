/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react'
import * as supportService from './services/support-services.js'

const STORAGE_KEY = 'rikos_support_notes'

function loadLocal() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		return raw ? JSON.parse(raw) : []
	} catch { return [] }
}

function saveLocal(notes) {
	try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)) }
	catch { /* quota */ }
}

export const SupportContext = createContext(null)

export function SupportProvider({ children }) {
	const [notes, setNotes] = useState([])
	const [text, setText] = useState('')
	const [type, setType] = useState('sugerencia')

	const persist = useCallback((fn) => {
		setNotes((prev) => {
			const next = fn(prev)
			saveLocal(next)
			return next
		})
	}, [])

	useEffect(() => {
		supportService.getNotes().then((serverNotes) => {
			if (serverNotes.length > 0) {
				setNotes(serverNotes)
				saveLocal(serverNotes)
			} else {
				setNotes(loadLocal())
			}
		}).catch(() => {
			setNotes(loadLocal())
		})
	}, [])

	const handleSubmit = useCallback(async (e) => {
		e.preventDefault()
		if (!text.trim()) return

		const created = await supportService.createNote({ type, text: text.trim() })
		if (created) {
			persist((prev) => [created, ...prev])
		} else {
			const localNote = {
				_id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
				type, text: text.trim(),
				createdAt: new Date().toISOString(),
			}
			persist((prev) => [localNote, ...prev])
		}
		setText('')
	}, [type, text, persist])

	const handleDelete = useCallback(async (id) => {
		if (!window.confirm('¿Eliminar esta nota?')) return
		try {
			await supportService.deleteNote(id)
		} catch { /* proceed with local removal */ }
		persist((prev) => prev.filter((n) => n._id !== id))
	}, [persist])

	return (
		<SupportContext.Provider value={{ notes, text, setText, type, setType, handleSubmit, handleDelete }}>
			{children}
		</SupportContext.Provider>
	)
}
