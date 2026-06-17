import { Router } from 'express'
import PromoSet from '../models/PromoSet.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { active: true }
    const sets = await PromoSet.find(filter).sort({ name: 1 })
    res.json(sets)
  } catch (e) { next(e) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const set = await PromoSet.findById(req.params.id)
    if (!set) return res.status(404).json({ error: 'Not found' })
    res.json(set)
  } catch (e) { next(e) }
})

router.post('/', async (req, res, next) => {
  try {
    const set = await PromoSet.create({
      name: req.body.name,
      price: req.body.price,
      active: req.body.active ?? true,
      items: req.body.items ?? [],
    })
    res.status(201).json(set)
  } catch (e) { next(e) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const set = await PromoSet.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, price: req.body.price, active: req.body.active, items: req.body.items ?? [] },
      { new: true },
    )
    if (!set) return res.status(404).json({ error: 'Not found' })
    res.json(set)
  } catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const del = await PromoSet.findByIdAndDelete(req.params.id)
    if (!del) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (e) { next(e) }
})

export default router
