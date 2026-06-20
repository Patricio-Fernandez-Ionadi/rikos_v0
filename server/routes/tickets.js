import { Router } from 'express'
import Ticket from '../models/Ticket.js'

const router = Router()

/** List tickets, newest first. Optional ?status= filter. */
router.get('/', async (req, res, next) => {
	try {
		const filter = {}
		if (req.query.status) filter.status = req.query.status
		const tickets = await Ticket.find(filter).sort({ createdAt: -1 })
		res.json(tickets)
	} catch (e) { next(e) }
})

/** Create a ticket. */
router.post('/', async (req, res, next) => {
	try {
		const { type, text } = req.body
		if (!text?.trim()) return res.status(400).json({ error: 'text is required' })
		const ticket = await Ticket.create({ type, text: text.trim() })
		res.status(201).json(ticket)
	} catch (e) { next(e) }
})

/** Update ticket status. */
router.patch('/:id/status', async (req, res, next) => {
	try {
		const { status } = req.body
		if (!['active', 'resolved'].includes(status)) {
			return res.status(400).json({ error: 'Invalid status' })
		}
		const update = { status }
		if (status === 'resolved') update.resolvedAt = new Date()
		const ticket = await Ticket.findByIdAndUpdate(req.params.id, update, { new: true })
		if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
		res.json(ticket)
	} catch (e) { next(e) }
})

/** Delete a ticket. */
router.delete('/:id', async (req, res, next) => {
	try {
		const ticket = await Ticket.findByIdAndDelete(req.params.id)
		if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
		res.status(204).end()
	} catch (e) { next(e) }
})

export default router
