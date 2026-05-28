import * as api from '../../../data/api.js'

export async function createPresentation(data) {
	return await api.createPresentation(data)
}

export async function updatePresentation(id, data) {
	return await api.updatePresentation(id, data)
}

export async function deletePresentation(id) {
	await api.deletePresentation(id)
}
