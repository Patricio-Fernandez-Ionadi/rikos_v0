import { useReducer, useCallback, useEffect } from 'react'
import * as orderService from './services/order-services.js'
import { orderReducer, INITIAL_ORDER_STATE } from './reducer/order-reducer.js'

export function useOrders() {
  const [state, dispatch] = useReducer(orderReducer, INITIAL_ORDER_STATE)

  useEffect(() => {
    orderService.getOrders()
      .then((list) => dispatch({ type: 'SET_ORDERS', orders: list }))
      .catch(() => dispatch({ type: 'SET_LOADING', loading: false }))
  }, [])

  const createOrder = useCallback(async (data) => {
    const order = await orderService.createOrder(data)
    dispatch({ type: 'ADD_ORDER', order })
    return order
  }, [])

  const updateOrder = useCallback(async (id, data) => {
    const order = await orderService.updateOrder(id, data)
    dispatch({ type: 'UPDATE_ORDER', order })
    return order
  }, [])

  const deleteOrder = useCallback(async (id) => {
    await orderService.deleteOrder(id)
    dispatch({ type: 'REMOVE_ORDER', id })
  }, [])

  const addItem = useCallback(async (orderId, item) => {
    const order = await orderService.addItemToOrder(orderId, item)
    dispatch({ type: 'UPDATE_ORDER', order })
    return order
  }, [])

  const closeOrder = useCallback(async (id) => {
    const order = await orderService.updateOrderStatus(id, 'placed')
    dispatch({ type: 'UPDATE_ORDER', order })
    return order
  }, [])

  return {
    orders: state.orders,
    loading: state.loading,
    createOrder,
    updateOrder,
    deleteOrder,
    addItem,
    closeOrder,
  }
}
