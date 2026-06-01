import { Router } from 'express'
import Product from '../models/Product.js'
import Presentation from '../models/Presentation.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.categoryId ? { categoryId: req.query.categoryId } : {}
    const prods = await Product.find(filter).sort({ name: 1 })
    res.json(prods)
  } catch (e) { next(e) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const prod = await Product.findById(req.params.id)
    if (!prod) return res.status(404).json({ error: 'Not found' })
    res.json(prod)
  } catch (e) { next(e) }
})

router.post('/', async (req, res, next) => {
  try {
    const prod = await Product.create({
      categoryId: req.body.categoryId,
      name: req.body.name,
      purchaseCost: req.body.purchaseCost ?? null,
      margin: req.body.margin ?? null,
      saleType: req.body.saleType ?? 'unit',
      stockGrams: req.body.saleType === 'fraction' ? (req.body.stockGrams ?? 0) : null,
      marca: req.body.marca ?? '',
    })
    res.status(201).json(prod)
  } catch (e) { next(e) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const prod = await Product.findByIdAndUpdate(
      req.params.id,
      {
        categoryId: req.body.categoryId,
        name: req.body.name,
        purchaseCost: req.body.purchaseCost,
        margin: req.body.margin,
        saleType: req.body.saleType,
        stockGrams: req.body.stockGrams,
        marca: req.body.marca ?? '',
      },
      { new: true },
    )
    if (!prod) return res.status(404).json({ error: 'Not found' })
    res.json(prod)
  } catch (e) { next(e) }
})

router.patch('/:id/stock-grams', async (req, res, next) => {
  try {
    const prod = await Product.findByIdAndUpdate(
      req.params.id,
      { stockGrams: req.body.stockGrams },
      { new: true },
    )
    if (!prod) return res.status(404).json({ error: 'Not found' })
    res.json(prod)
  } catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Presentation.deleteMany({ productId: req.params.id })
    const del = await Product.findByIdAndDelete(req.params.id)
    if (!del) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (e) { next(e) }
})

export default router
