import { Router } from 'express'
import Presentation from '../models/Presentation.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.productId ? { productId: req.query.productId } : {}
    const pres = await Presentation.find(filter).sort({ label: 1 })
    res.json(pres)
  } catch (e) { next(e) }
})

router.post('/', async (req, res, next) => {
  try {
    const last = await Presentation.findOne({ code: { $ne: null } }).sort({ code: -1 })
    const nextCode = (last?.code ?? 0) + 1
    const pres = await Presentation.create({
      productId: req.body.productId,
      label: req.body.label ?? null,
      grams: req.body.grams ?? null,
      salePrice: req.body.salePrice ?? null,
      stock: req.body.stock ?? 0,
      code: nextCode,
    })
    res.status(201).json(pres)
  } catch (e) { next(e) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const pres = await Presentation.findByIdAndUpdate(
      req.params.id,
      { label: req.body.label, grams: req.body.grams, salePrice: req.body.salePrice, stock: req.body.stock ?? 0 },
      { new: true },
    )
    if (!pres) return res.status(404).json({ error: 'Not found' })
    res.json(pres)
  } catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const del = await Presentation.findByIdAndDelete(req.params.id)
    if (!del) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (e) { next(e) }
})

/** Reassign sequential codes 1..N to all presentations (migration). */
router.post('/renumber', async (_req, res, next) => {
  try {
    // Clear all codes first so the unique sparse index doesn't block reassignment
    await Presentation.updateMany({}, { $unset: { code: '' } })

    const all = await Presentation.find().sort({ _id: 1 })
    for (let i = 0; i < all.length; i++) {
      await Presentation.findByIdAndUpdate(all[i]._id, { code: i + 1 })
    }
    res.json({ count: all.length })
  } catch (e) { next(e) }
})

router.patch('/:id/stock', async (req, res, next) => {
  try {
    const pres = await Presentation.findByIdAndUpdate(
      req.params.id,
      { stock: req.body.stock },
      { new: true },
    )
    if (!pres) return res.status(404).json({ error: 'Not found' })
    res.json(pres)
  } catch (e) { next(e) }
})

export default router
