import * as api from '../../../data/api.js'
import * as entities from '../../../data/entities.js'

export async function createPresentation(data, { online }) {
	if (online) return await api.createPresentation(data)
	return entities.createPresentation(data)
}

export async function updatePresentation(id, data, { online }) {
	if (online) return await api.updatePresentation(id, data)
}

export async function deletePresentation(id, { online }) {
	if (online) await api.deletePresentation(id)
}
