import { Router } from 'express'
import Note from '../models/Note.js'

const router = Router()

/** List all notes, newest first. */
router.get('/', async (_req, res, next) => {
	try {
		const notes = await Note.find().sort({ createdAt: -1 })
		res.json(notes)
	} catch (e) { next(e) }
})

/** Create a note. */
router.post('/', async (req, res, next) => {
	try {
		const { type, text } = req.body
		if (!text?.trim()) return res.status(400).json({ error: 'text is required' })
		const note = await Note.create({ type, text: text.trim() })
		res.status(201).json(note)
	} catch (e) { next(e) }
})

/** Delete a note. */
router.delete('/:id', async (req, res, next) => {
	try {
		const note = await Note.findByIdAndDelete(req.params.id)
		if (!note) return res.status(404).json({ error: 'Note not found' })
		res.status(204).end()
	} catch (e) { next(e) }
})

export default router
