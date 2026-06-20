/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react'
import * as ticketService from './services/ticket-services.js'

const STORAGE_KEY = 'rikos_tickets'

function loadLocal() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		const tickets = raw ? JSON.parse(raw) : []
		return tickets.map((t) => ({ ...t, status: t.status || 'active' }))
	} catch { return [] }
}

function saveLocal(tickets) {
	try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets)) }
	catch { /* quota */ }
}

export const TicketContext = createContext(null)

export function TicketProvider({ children }) {
	const [tickets, setTickets] = useState([])
	const [text, setText] = useState('')
	const [type, setType] = useState('sugerencia')
	const [filter, setFilter] = useState('active')

	const persist = useCallback((fn) => {
		setTickets((prev) => {
			const next = fn(prev)
			saveLocal(next)
			return next
		})
	}, [])

	useEffect(() => {
		ticketService.getTickets().then((serverTickets) => {
			if (serverTickets.length > 0) {
				setTickets(serverTickets)
				saveLocal(serverTickets)
			} else {
				const local = loadLocal()
				setTickets(local)
			}
		}).catch(() => {
			setTickets(loadLocal())
		})
	}, [])

	const filteredTickets = tickets.filter((t) => t.status === filter || (filter === 'all'))

	const handleSubmit = useCallback(async (e) => {
		e.preventDefault()
		if (!text.trim()) return

		const created = await ticketService.createTicket({ type, text: text.trim() })
		if (created) {
			persist((prev) => [created, ...prev])
		} else {
			const localTicket = {
				_id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
				type, text: text.trim(),
				createdAt: new Date().toISOString(),
			}
			persist((prev) => [localTicket, ...prev])
		}
		setText('')
	}, [type, text, persist])

	const handleStatusChange = useCallback(async (id, status) => {
		const updated = await ticketService.updateTicketStatus(id, status)
		if (updated) {
			persist((prev) => prev.map((t) => (t._id === id ? { ...t, status, resolvedAt: updated.resolvedAt } : t)))
		} else {
			persist((prev) => prev.map((t) => (t._id === id ? { ...t, status } : t)))
		}
	}, [persist])

	const handleDelete = useCallback(async (id) => {
		if (!window.confirm('¿Eliminar este ticket?')) return
		try {
			await ticketService.deleteTicket(id)
		} catch { /* proceed with local removal */ }
		persist((prev) => prev.filter((t) => t._id !== id))
	}, [persist])

	return (
		<TicketContext.Provider value={{
			tickets, filteredTickets, filter, setFilter,
			text, setText, type, setType,
			handleSubmit, handleStatusChange, handleDelete,
		}}>
			{children}
		</TicketContext.Provider>
	)
}
