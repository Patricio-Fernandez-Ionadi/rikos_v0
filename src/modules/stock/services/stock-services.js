import * as api from '../../../data/api.js'

export async function updateStock(presId, stockValue) {
	return await api.updateStock(presId, stockValue)
}

export async function updateStockGrams(productId, stockGrams) {
	return await api.updateStockGrams(productId, stockGrams)
}

export async function updateEtiquetas(productId, etiquetasDisponibles) {
	return await api.updateEtiquetas(productId, etiquetasDisponibles)
}

export async function deletePresentationStock(id) {
	await api.deletePresentation(id)
}
