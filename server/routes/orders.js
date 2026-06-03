import { Router } from 'express'
import Order from '../models/Order.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (e) { next(e) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Not found' })
    res.json(order)
  } catch (e) { next(e) }
})

router.post('/', async (req, res, next) => {
  try {
    const { supplierId, supplierName, items, notes } = req.body
    const totalCost = items.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0)
    const order = await Order.create({
      supplierId,
      supplierName,
      items: items.map(i => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        unitCost: i.unitCost,
        total: +(i.quantity * i.unitCost).toFixed(2),
      })),
      totalCost: +totalCost.toFixed(2),
      notes: notes ?? '',
    })
    res.status(201).json(order)
  } catch (e) { next(e) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Not found' })

    const { supplierId, supplierName, items, notes } = req.body
    const totalCost = items.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0)

    order.supplierId = supplierId
    order.supplierName = supplierName
    order.items = items.map(i => ({
      productId: i.productId,
      productName: i.productName,
      quantity: i.quantity,
      unitCost: i.unitCost,
      total: +(i.quantity * i.unitCost).toFixed(2),
    }))
    order.totalCost = +totalCost.toFixed(2)
    order.notes = notes ?? ''

    await order.save()
    res.json(order)
  } catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const del = await Order.findByIdAndDelete(req.params.id)
    if (!del) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (e) { next(e) }
})

export default router
