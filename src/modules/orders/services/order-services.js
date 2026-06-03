import * as api from '../../../data/api.js'

export const getOrders = () => api.getOrders()
export const getOrder = (id) => api.getOrder(id)
export const createOrder = (data) => api.createOrder(data)
export const updateOrder = (id, data) => api.updateOrder(id, data)
export const deleteOrder = (id) => api.deleteOrder(id)
