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

router.get('/tags', async (req, res, next) => {
  try {
    const tags = await Product.distinct('tags')
    res.json(tags)
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
      etiquetasDisponibles: req.body.etiquetasDisponibles ?? null,
      marca: req.body.marca ?? '',
      tags: req.body.tags ?? [],
    })
    res.status(201).json(prod)
  } catch (e) { next(e) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const update = {
      categoryId: req.body.categoryId,
      name: req.body.name,
      purchaseCost: req.body.purchaseCost,
      margin: req.body.margin,
      saleType: req.body.saleType,
      stockGrams: req.body.stockGrams,
      etiquetasDisponibles: req.body.etiquetasDisponibles ?? null,
      marca: req.body.marca ?? '',
      tags: req.body.tags ?? [],
    }
    if (req.body.purchaseCost !== undefined) {
      update.costUpdatedAt = new Date()
    }
    const prod = await Product.findByIdAndUpdate(
      req.params.id,
      update,
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

router.patch('/:id/etiquetas', async (req, res, next) => {
  try {
    const prod = await Product.findByIdAndUpdate(
      req.params.id,
      { etiquetasDisponibles: req.body.etiquetasDisponibles },
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
