import * as api from '../../../data/api.js'

export async function createProduct(data) {
	return await api.createProduct(data)
}

export async function updateProduct(id, data) {
	return await api.updateProduct(id, data)
}

export async function deleteProduct(id) {
	await api.deleteProduct(id)
}
