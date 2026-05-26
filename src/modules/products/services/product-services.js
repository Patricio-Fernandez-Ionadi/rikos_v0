import * as api from '../../../data/api.js'
import * as entities from '../../../data/entities.js'

export async function createProduct(data, { online }) {
	if (online) return await api.createProduct(data)
	return entities.createProduct(data)
}

export async function updateProduct(id, data, { online }) {
	if (online) return await api.updateProduct(id, data)
}

export async function deleteProduct(id, { online }) {
	if (online) await api.deleteProduct(id)
}
