import { Router } from 'express'
import Supplier from '../models/Supplier.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 })
    res.json(suppliers)
  } catch (e) { next(e) }
})

router.post('/', async (req, res, next) => {
  try {
    const supplier = await Supplier.create({
      name: req.body.name,
      contactName: req.body.contactName ?? null,
      phone: req.body.phone ?? null,
      email: req.body.email ?? null,
      notes: req.body.notes ?? '',
    })
    res.status(201).json(supplier)
  } catch (e) { next(e) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, contactName: req.body.contactName, phone: req.body.phone, email: req.body.email, notes: req.body.notes },
      { new: true },
    )
    if (!supplier) return res.status(404).json({ error: 'Not found' })
    res.json(supplier)
  } catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const del = await Supplier.findByIdAndDelete(req.params.id)
    if (!del) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (e) { next(e) }
})

export default router
