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
    const { type, productId, name, note, status } = req.body
    if (!type) return res.status(400).json({ error: 'type is required' })
    const task = await Task.create({ type, productId: productId || null, name: name || '', note: note || '', status: status || 'pending' })
    res.status(201).json(task)
  } catch (e) { next(e) }
})

/** Update a task note. */
router.patch('/:id/note', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { note: req.body.note ?? '' },
      { new: true },
    )
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
  } catch (e) { next(e) }
})

/** Update a task status (pending / viewed). */
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body
    if (!['pending', 'viewed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
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
