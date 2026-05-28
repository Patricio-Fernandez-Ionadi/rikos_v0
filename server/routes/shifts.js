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

    if (product.saleType === 'fraction') {
      const deduction = quantity * (pres.grams ?? 0)
      if ((product.stockGrams ?? 0) < deduction) return res.status(400).json({ error: 'Insufficient stock (grams)' })
      product.stockGrams -= deduction
      await product.save()
    } else {
      if ((pres.stock ?? 0) < quantity) return res.status(400).json({ error: 'Insufficient stock' })
      pres.stock -= quantity
      await pres.save()
    }

    shift.sales.push({ productId, presentationId, quantity, unitPrice, total, timestamp: new Date() })
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

/** Close the shift: record closing cash, compute expected balance and difference. */
router.post('/:id/close', async (req, res, next) => {
  try {
    const shift = await Shift.findById(req.params.id)
    if (!shift) return res.status(404).json({ error: 'Shift not found' })
    if (shift.status !== 'open') return res.status(400).json({ error: 'Shift is already closed' })

    const closingCash = req.body.closingCash
    if (closingCash == null) return res.status(400).json({ error: 'closingCash is required' })

    const totalSales = shift.sales.reduce((sum, s) => sum + s.total, 0)
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
