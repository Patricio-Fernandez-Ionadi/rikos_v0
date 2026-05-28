import { Router } from 'express'
import ProductSupplier from '../models/ProductSupplier.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.productId) filter.productId = req.query.productId
    if (req.query.supplierId) filter.supplierId = req.query.supplierId
    const pss = await ProductSupplier.find(filter).sort({ purchaseCost: 1 })
    res.json(pss)
  } catch (e) { next(e) }
})

router.post('/', async (req, res, next) => {
  try {
    const existing = await ProductSupplier.findOne({
      productId: req.body.productId,
      supplierId: req.body.supplierId,
    })
    if (existing) return res.status(400).json({ error: 'This supplier is already assigned to this product' })

    const ps = await ProductSupplier.create({
      productId: req.body.productId,
      supplierId: req.body.supplierId,
      purchaseCost: req.body.purchaseCost,
    })
    res.status(201).json(ps)
  } catch (e) { next(e) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const ps = await ProductSupplier.findByIdAndUpdate(
      req.params.id,
      { purchaseCost: req.body.purchaseCost },
      { new: true },
    )
    if (!ps) return res.status(404).json({ error: 'Not found' })
    res.json(ps)
  } catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const del = await ProductSupplier.findByIdAndDelete(req.params.id)
    if (!del) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (e) { next(e) }
})

export default router
