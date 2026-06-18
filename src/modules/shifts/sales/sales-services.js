import * as api from '../../../data/api.js'

/** Fetch all products (for name resolution). */
export const getProducts = () => api.getProducts()

/** Update a sale item (quantity). */
export const updateSale = (shiftId, saleId, data) =>
	api.updateSale(shiftId, saleId, data)

/** Delete a sale item (restores stock). */
export const deleteSale = (shiftId, saleId) =>
	api.deleteSale(shiftId, saleId)
