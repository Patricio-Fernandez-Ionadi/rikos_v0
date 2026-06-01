import { Router } from 'express'
import Task from '../models/Task.js'

const router = Router()

/** List all tasks. */
router.get('/', async (_req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 })
    res.json(tasks)
  } catch (e) { next(e) }
})

/** Create a task. */
router.post('/', async (req, res, next) => {
  try {
    const { type, productId, name } = req.body
    if (!type) return res.status(400).json({ error: 'type is required' })
    const task = await Task.create({ type, productId: productId || null, name: name || '' })
    res.status(201).json(task)
  } catch (e) { next(e) }
})

/** Delete a task. */
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.status(204).end()
  } catch (e) { next(e) }
})

export default router
