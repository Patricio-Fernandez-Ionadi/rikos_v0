import * as api from '../../../data/api.js'

export async function updateStock(presId, stockValue, { online }) {
	if (online) return await api.updateStock(presId, stockValue)
}

export async function deletePresentationStock(id, { online }) {
	if (online) await api.deletePresentation(id)
}
