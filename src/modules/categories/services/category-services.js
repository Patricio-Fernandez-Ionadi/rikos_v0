import * as api from '../../../data/api.js'

export async function createCategory(name) {
	return await api.createCategory(name)
}

export async function updateCategory(id, name) {
	return await api.updateCategory(id, name)
}

export async function deleteCategory(id) {
	await api.deleteCategory(id)
}
