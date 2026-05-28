import * as api from '../../../data/api.js'

export async function createSupplier(data) {
	return await api.createSupplier(data)
}

export async function updateSupplier(id, data) {
	return await api.updateSupplier(id, data)
}

export async function deleteSupplier(id) {
	await api.deleteSupplier(id)
}

export async function getProductSuppliers(productId) {
	return await api.getProductSuppliers(productId)
}

export async function getSupplier(id) {
	return await api.getSupplier(id)
}

export async function createProductSupplier(data) {
	return await api.createProductSupplier(data)
}

export async function deleteProductSupplier(id) {
	await api.deleteProductSupplier(id)
}
