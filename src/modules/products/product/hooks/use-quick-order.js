import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrders } from '../../../orders/order-manager.js'
import * as orderService from '../../../orders/services/order-services.js'

export function useQuickOrder() {
  const navigate = useNavigate()
  const { addItem, createOrder } = useOrders()

  const findOpenOrder = useCallback(async (supplierId) => {
    const orders = await orderService.getOrders('open')
    return orders.find((o) => o.supplierId === supplierId) ?? null
  }, [])

  const quickOrder = useCallback(async ({
    product, supplierId, supplierName, quantity, unitCost, unitLabel,
  }) => {
    const openOrder = await findOpenOrder(supplierId)
    const item = {
      productId: product._id,
      productName: product.name,
      quantity: Number(quantity),
      unitCost: Number(unitCost),
      unitLabel,
    }
    if (openOrder) {
      await addItem(openOrder._id, item)
    } else {
      await createOrder({
        supplierId,
        supplierName,
        status: 'open',
        items: [item],
        notes: '',
      })
    }
    navigate('/orders')
  }, [findOpenOrder, addItem, createOrder, navigate])

  return { quickOrder }
}
