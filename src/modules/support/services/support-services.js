import * as api from '../../../data/api.js'

/**
 * Fetch notes from the server, optionally filtered by status.
 * Returns an empty array on failure (offline).
 */
export async function getNotes(status) {
	try {
		return await api.getNotes(status)
	} catch {
		return []
	}
}

/** Create a note on the server. Returns null on failure. */
export async function createNote({ type, text }) {
	try {
		return await api.createNote({ type, text })
	} catch {
		return null
	}
}

/** Update a note's status on the server. Returns null on failure. */
export async function updateNoteStatus(id, status) {
	try {
		return await api.updateNoteStatus(id, status)
	} catch {
		return null
	}
}

/** Delete a note on the server. */
export async function deleteNote(id) {
	await api.deleteNote(id)
}
