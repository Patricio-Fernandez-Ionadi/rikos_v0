import * as api from '../../../data/api.js'
import * as entities from '../../../data/entities.js'

export async function createSupplier(data, { online }) {
	if (online) return await api.createSupplier(data)
	return entities.createSupplier(data)
}

export async function updateSupplier(id, data, { online }) {
	if (online) return await api.updateSupplier(id, data)
}

export async function deleteSupplier(id, { online }) {
	if (online) await api.deleteSupplier(id)
}

export async function getProductSuppliers(productId) {
	return await api.getProductSuppliers(productId)
}

export async function createProductSupplier(data, { online }) {
	if (online) return await api.createProductSupplier(data)
	return entities.createProductSupplier(data)
}

export async function deleteProductSupplier(id, { online }) {
	if (online) await api.deleteProductSupplier(id)
}
