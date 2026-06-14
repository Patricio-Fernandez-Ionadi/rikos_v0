import * as api from '../../../data/api.js'

export const getOrders = (status) => api.getOrders(status)
export const getOrder = (id) => api.getOrder(id)
export const createOrder = (data) => api.createOrder(data)
export const updateOrder = (id, data) => api.updateOrder(id, data)
export const deleteOrder = (id) => api.deleteOrder(id)
export const addItemToOrder = (id, item) => api.addItemToOrder(id, item)
export const updateOrderStatus = (id, status) => api.updateOrderStatus(id, status)
