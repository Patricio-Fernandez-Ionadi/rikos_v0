import * as api from '../../../data/api.js'

/**
 * Fetch all notes from the server.
 * Returns an empty array on failure (offline).
 */
export async function getNotes() {
	try {
		return await api.getNotes()
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

/** Delete a note on the server. */
export async function deleteNote(id) {
	await api.deleteNote(id)
}
