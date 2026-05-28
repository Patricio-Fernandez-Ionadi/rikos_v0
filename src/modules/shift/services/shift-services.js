import * as api from '../../../data/api.js'

export const getActiveShift = () => api.getActiveShift()
export const openShift = (openingCash) => api.openShift(openingCash)
export const addSale = (shiftId, sale) => api.addSale(shiftId, sale)
export const recordTicket = (shiftId, data) => api.recordTicket(shiftId, data)
export const syncSales = (shiftId, sales) => api.syncSales(shiftId, sales)
export const closeShift = (shiftId, closingCash, notes) =>
	api.closeShift(shiftId, closingCash, notes)

/** Update a sale item (quantity). */
export const updateSale = (shiftId, saleId, data) =>
	api.updateSale(shiftId, saleId, data)

/** Delete a sale item (restores stock). */
export const deleteSale = (shiftId, saleId) =>
	api.deleteSale(shiftId, saleId)
