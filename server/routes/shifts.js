import { Router } from 'express'
import Shift from '../models/Shift.js'
import Product from '../models/Product.js'
import Presentation from '../models/Presentation.js'

const router = Router()

/** List all shifts, newest first. */
router.get('/', async (_req, res, next) => {
  try {
    const shifts = await Shift.find().sort({ openingTime: -1 })
    res.json(shifts)
  } catch (e) { next(e) }
})

/** Get the currently open shift, if any. */
router.get('/active', async (_req, res, next) => {
  try {
    const shift = await Shift.findOne({ status: 'open' })
    res.json(shift)
  } catch (e) { next(e) }
})

/** Open a new shift. */
router.post('/', async (req, res, next) => {
  try {
    const existing = await Shift.findOne({ status: 'open' })
    if (existing) return res.status(400).json({ error: 'There is already an open shift' })

    const shift = await Shift.create({
      openingTime: new Date(),
      openingCash: req.body.openingCash ?? 0,
      status: 'open',
    })
    res.status(201).json(shift)
  } catch (e) { next(e) }
})

/** Record a sale on the active shift and deduct stock. */
router.post('/:id/sales', async (req, res, next) => {
  try {
    const shift = await Shift.findById(req.params.id)
    if (!shift) return res.status(404).json({ error: 'Shift not found' })
    if (shift.status !== 'open') return res.status(400).json({ error: 'Shift is already closed' })

    const { productId, presentationId, quantity, unitPrice, total } = req.body

    const pres = await Presentation.findById(presentationId)
    if (!pres) return res.status(404).json({ error: 'Presentation not found' })

    const product = await Product.findById(pres.productId)
    if (!product) return res.status(404).json({ error: 'Product not found' })

    if ((pres.stock ?? 0) < quantity) return res.status(400).json({ error: 'Insufficient stock' })
    pres.stock -= quantity

    if (product.saleType === 'fraction') {
      const deduction = quantity * (pres.grams ?? 0)
      if ((product.stockGrams ?? 0) < deduction) return res.status(400).json({ error: 'Insufficient stock (grams)' })
      product.stockGrams -= deduction
      await product.save()
    }

    await pres.save()
    shift.sales.push({ productId, presentationId, quantity, unitPrice, total, timestamp: new Date() })
    await shift.save()

    res.status(201).json(shift)
  } catch (e) { next(e) }
})

/**
 * Record a multi-item ticket on the active shift (batch sale).
 * Validates stock for all items upfront, then deducts and records atomically.
 */
router.post('/:id/ticket', async (req, res, next) => {
  try {
    const shift = await Shift.findById(req.params.id)
    if (!shift) return res.status(404).json({ error: 'Shift not found' })
    if (shift.status !== 'open') return res.status(400).json({ error: 'Shift is already closed' })

    const { items, paymentMethod, ticketId } = req.body
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items must be a non-empty array' })
    }

    // 1. Validate stock for every item upfront
    for (const item of items) {
      const pres = await Presentation.findById(item.presentationId)
      if (!pres) return res.status(404).json({ error: `Presentation not found: ${item.presentationId}` })

      const product = await Product.findById(pres.productId)
      if (!product) return res.status(404).json({ error: `Product not found: ${pres.productId}` })

      if ((pres.stock ?? 0) < item.quantity) {
        return res.status(400).json({ error: `Stock insuficiente para ${pres.label}` })
      }

      if (product.saleType === 'fraction') {
        const deduction = item.quantity * (pres.grams ?? 0)
        if ((product.stockGrams ?? 0) < deduction) {
          return res.status(400).json({ error: `Stock insuficiente para ${product.name}` })
        }
      }
    }

    // 2. Deduct stock and push sales
    for (const item of items) {
      const pres = await Presentation.findById(item.presentationId)
      const product = await Product.findById(pres.productId)

      pres.stock -= item.quantity

      if (product.saleType === 'fraction') {
        const deduction = item.quantity * (pres.grams ?? 0)
        product.stockGrams -= deduction
        await product.save()
      }

      await pres.save()

      shift.sales.push({
        productId: pres.productId,
        presentationId: item.presentationId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        paymentMethod,
        ticketId: ticketId || null,
        timestamp: new Date(),
      })
    }

    await shift.save()
    res.status(201).json(shift)
  } catch (e) { next(e) }
})

/** Sync sales from localStorage to the DB mid-shift (no stock deduction, already applied locally). */
router.post('/:id/sync', async (req, res, next) => {
  try {
    const shift = await Shift.findById(req.params.id)
    if (!shift) return res.status(404).json({ error: 'Shift not found' })

    const { sales } = req.body
    if (!Array.isArray(sales)) return res.status(400).json({ error: 'sales must be an array' })

    for (const s of sales) {
      shift.sales.push({
        productId: s.productId,
        presentationId: s.presentationId,
        quantity: s.quantity,
        unitPrice: s.unitPrice,
        total: s.total,
        timestamp: s.timestamp ? new Date(s.timestamp) : new Date(),
      })
    }
    await shift.save()
    res.json(shift)
  } catch (e) { next(e) }
})

/**
 * PATCH /:id/sales/:saleId — Update a sale item (quantity).
 * Restores old stock and deducts new stock.
 */
router.patch('/:id/sales/:saleId', async (req, res, next) => {
  try {
    const shift = await Shift.findById(req.params.id)
    if (!shift) return res.status(404).json({ error: 'Shift not found' })
    if (shift.status !== 'open') return res.status(400).json({ error: 'Shift is already closed' })

    const sale = shift.sales.id(req.params.saleId)
    if (!sale) return res.status(404).json({ error: 'Sale not found' })

    const { quantity } = req.body
    if (quantity == null || quantity < 1) return res.status(400).json({ error: 'quantity must be >= 1' })

    const oldQty = sale.quantity
    const diff = quantity - oldQty

    const pres = await Presentation.findById(sale.presentationId)
    if (!pres) return res.status(404).json({ error: 'Presentation not found' })
    const product = await Product.findById(pres.productId)
    if (!product) return res.status(404).json({ error: 'Product not found' })

    if (diff > 0 && (pres.stock ?? 0) < diff) {
      return res.status(400).json({ error: 'Insufficient stock' })
    }
    pres.stock -= diff

    if (product.saleType === 'fraction') {
      const deduction = diff * (pres.grams ?? 0)
      if (deduction > 0 && (product.stockGrams ?? 0) < deduction) {
        return res.status(400).json({ error: 'Insufficient stock (grams)' })
      }
      product.stockGrams -= deduction
      await product.save()
    }

    await pres.save()

    sale.quantity = quantity
    sale.total = +(quantity * sale.unitPrice).toFixed(2)
    await shift.save()

    res.json(shift)
  } catch (e) { next(e) }
})

/**
 * DELETE /:id/sales/:saleId — Remove a sale item.
 * Restores stock.
 */
router.delete('/:id/sales/:saleId', async (req, res, next) => {
  try {
    const shift = await Shift.findById(req.params.id)
    if (!shift) return res.status(404).json({ error: 'Shift not found' })
    if (shift.status !== 'open') return res.status(400).json({ error: 'Shift is already closed' })

    const sale = shift.sales.id(req.params.saleId)
    if (!sale) return res.status(404).json({ error: 'Sale not found' })

    const pres = await Presentation.findById(sale.presentationId)
    if (!pres) return res.status(404).json({ error: 'Presentation not found' })
    const product = await Product.findById(pres.productId)
    if (!product) return res.status(404).json({ error: 'Product not found' })

    pres.stock += sale.quantity

    if (product.saleType === 'fraction') {
      const restore = sale.quantity * (pres.grams ?? 0)
      product.stockGrams += restore
      await product.save()
    }

    await pres.save()

    sale.deleteOne()
    await shift.save()

    res.json(shift)
  } catch (e) { next(e) }
})

/** Close the shift: record closing cash, compute expected balance and difference. */
router.post('/:id/close', async (req, res, next) => {
  try {
    const shift = await Shift.findById(req.params.id)
    if (!shift) return res.status(404).json({ error: 'Shift not found' })
    if (shift.status !== 'open') return res.status(400).json({ error: 'Shift is already closed' })

    const closingCash = req.body.closingCash
    if (closingCash == null) return res.status(400).json({ error: 'closingCash is required' })

    const cashSales = shift.sales.filter(
      (s) => !s.paymentMethod || s.paymentMethod === 'cash',
    )
    const totalSales = cashSales.reduce((sum, s) => sum + s.total, 0)
    const expectedBalance = shift.openingCash + totalSales

    shift.closingCash = closingCash
    shift.expectedBalance = expectedBalance
    shift.difference = +(closingCash - expectedBalance).toFixed(2)
    shift.closingTime = new Date()
    shift.status = 'closed'
    shift.notes = req.body.notes ?? ''

    await shift.save()
    res.json(shift)
  } catch (e) { next(e) }
})

export default router
