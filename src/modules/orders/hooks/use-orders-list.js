import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrders } from '../order-manager.js'

export function useOrdersList() {
  const { orders, loading, deleteOrder, closeOrder } = useOrders()
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState('open')

  const filteredOrders = useMemo(
    () => filterStatus ? orders.filter((o) => o.status === filterStatus) : orders,
    [orders, filterStatus],
  )

  const handleEdit = useCallback((id) => {
    navigate(id === 'new' ? '/orders/new' : `/orders/${id}`)
  }, [navigate])

  const handleClose = useCallback(async (id) => {
    await closeOrder(id)
  }, [closeOrder])

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('¿Eliminar este pedido?')) {
      await deleteOrder(id)
    }
  }, [deleteOrder])

  return {
    loading, filterStatus, setFilterStatus,
    filteredOrders, handleEdit, handleClose, handleDelete,
  }
}
