import { Router } from 'express'
import Order from '../models/Order.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    const orders = await Order.find(filter).sort({ createdAt: -1 })
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
    const { supplierId, supplierName, items, notes, status } = req.body
    const totalCost = items.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0)
    const order = await Order.create({
      supplierId,
      supplierName,
      status: status ?? 'open',
      items: items.map(i => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        unitCost: i.unitCost,
        total: +(i.quantity * i.unitCost).toFixed(2),
        unitLabel: i.unitLabel ?? '',
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

    const { supplierId, supplierName, items, notes, status } = req.body
    const totalCost = items.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0)

    order.supplierId = supplierId
    order.supplierName = supplierName
    if (status) order.status = status
    order.items = items.map(i => ({
      productId: i.productId,
      productName: i.productName,
      quantity: i.quantity,
      unitCost: i.unitCost,
      total: +(i.quantity * i.unitCost).toFixed(2),
      unitLabel: i.unitLabel ?? '',
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

router.patch('/:id/items', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Not found' })
    if (order.status !== 'open') return res.status(400).json({ error: 'Order is not open' })

    const { productId, productName, quantity, unitCost, unitLabel } = req.body
    const existing = order.items.find(i => i.productId === productId)
    if (existing) {
      existing.quantity += quantity
      existing.total = +(existing.quantity * existing.unitCost).toFixed(2)
    } else {
      order.items.push({
        productId,
        productName,
        quantity,
        unitCost,
        total: +(quantity * unitCost).toFixed(2),
        unitLabel: unitLabel ?? '',
      })
    }
    order.totalCost = +order.items.reduce((sum, i) => sum + i.total, 0).toFixed(2)
    await order.save()
    res.json(order)
  } catch (e) { next(e) }
})

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body
    if (!['open', 'placed'].includes(status)) return res.status(400).json({ error: 'Invalid status' })
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!order) return res.status(404).json({ error: 'Not found' })
    res.json(order)
  } catch (e) { next(e) }
})

export default router
