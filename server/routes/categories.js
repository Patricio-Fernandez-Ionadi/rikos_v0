import { Router } from 'express'
import Category from '../models/Category.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const cats = await Category.find().sort({ name: 1 })
    res.json(cats)
  } catch (e) { next(e) }
})

router.post('/', async (req, res, next) => {
  try {
    const cat = await Category.create({ name: req.body.name })
    res.status(201).json(cat)
  } catch (e) { next(e) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    if (!cat) return res.status(404).json({ error: 'Not found' })
    res.json(cat)
  } catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const del = await Category.findByIdAndDelete(req.params.id)
    if (!del) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (e) { next(e) }
})

export default router
