import * as api from '../../../data/api.js'

export async function getTickets(status) {
	try {
		return await api.getTickets(status)
	} catch {
		return []
	}
}

export async function createTicket({ type, text }) {
	try {
		return await api.createTicket({ type, text })
	} catch {
		return null
	}
}

export async function updateTicketStatus(id, status) {
	try {
		return await api.updateTicketStatus(id, status)
	} catch {
		return null
	}
}

export async function deleteTicket(id) {
	await api.deleteTicket(id)
}
