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
      bultoUnits: req.body.bultoUnits ?? null,
      bultoKg: req.body.bultoKg ?? null,
      supplierUnitLabel: req.body.supplierUnitLabel ?? 'Unidad',
      supplierUnitQty: req.body.supplierUnitQty ?? 1,
    })
    res.status(201).json(ps)
  } catch (e) { next(e) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const update = {}
    if (req.body.purchaseCost !== undefined) update.purchaseCost = req.body.purchaseCost
    if (req.body.bultoUnits !== undefined) update.bultoUnits = req.body.bultoUnits
    if (req.body.bultoKg !== undefined) update.bultoKg = req.body.bultoKg
    if (req.body.supplierUnitLabel !== undefined) update.supplierUnitLabel = req.body.supplierUnitLabel
    if (req.body.supplierUnitQty !== undefined) update.supplierUnitQty = req.body.supplierUnitQty
    const ps = await ProductSupplier.findByIdAndUpdate(req.params.id, update, { new: true })
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
